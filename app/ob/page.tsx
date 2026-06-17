'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css'; // global color vars + frame theming
import '../reps/desk.css';                      // .desk-app / .desk-canvas / .desk-page frame

// ─────────────────────────────────────────────────────────────────────────────
// OB — the Elite voice coach (macOS desktop app).
//
// OB is a separate desktop application; this page is its home on the website:
// for Elite users it's the get-started / download page, for everyone else it's
// the Elite paywall. The real enforcement is in the app itself (it verifies the
// user's OfferBell Elite account on launch via Convex auth:verifyLicense); the
// localStorage check here is the same UI gate every paid page uses.
// ─────────────────────────────────────────────────────────────────────────────

type PlanStatus = 'loading' | 'elite' | 'gated';

// When the packaged macOS build is hosted, set this to its URL (e.g.
// 'https://offerbell.org/downloads/OB-mac.dmg'). While empty, the Elite view
// shows a "rolling out" state instead of a broken download link.
const OB_DOWNLOAD_URL = '';

export default function ObPage() {
  const router = useRouter();
  const [planStatus, setPlanStatus] = useState<PlanStatus>('loading');
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  // Auth + plan gate (localStorage UI hint; the OB app enforces Elite on launch).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) {
      router.replace('/signin');
      return;
    }
    const plan = (localStorage.getItem('offerbell_plan') || 'free').toLowerCase();
    setCurrentPlan(plan);
    setPlanStatus(plan === 'elite' ? 'elite' : 'gated');
  }, [router]);

  // Apply saved theme on mount (mirrors other pages).
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('offerbell-theme') : null;
    if (saved && typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', saved);
  }, []);

  if (planStatus === 'loading') {
    return (
      <div className="desk-app">
        <Sidebar activePage="ob" />
        <main className="desk-canvas"><div className="desk-page" /></main>
      </div>
    );
  }

  return (
    <div className="desk-app">
      <Sidebar activePage="ob" />
      <main className="desk-canvas">
        <div className="desk-page">
          <div className="desk-page-inner">
            {planStatus === 'elite' ? <ObElite /> : <ObPaywall currentPlan={currentPlan} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared feature list
// ═══════════════════════════════════════════════════════════════════════════
const FEATURES: { title: string; body: string }[] = [
  { title: 'Live voice mock interviews', body: 'Pick a track and firm, then get grilled out loud by a tough interviewer that asks follow-ups and grades you. All ten tracks.' },
  { title: 'Company teardowns', body: 'Say a company and OB pulls its filings and walks you through the business, the numbers, and the story.' },
  { title: 'Coffee chats & outreach', body: 'Hand OB a LinkedIn URL. It preps you for the call and drafts a personalized message in your voice.' },
  { title: 'Morning market brief', body: 'A quick spoken read on the market and your watchlist so you walk into the day with a view.' },
];

const OB_ORB = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.5" />
    <path d="M7.5 12a4.5 4.5 0 0 1 9 0" />
    <path d="M4 12a8 8 0 0 1 16 0" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// ObElite — get-started / download for Elite members
// ═══════════════════════════════════════════════════════════════════════════
function ObElite() {
  const [os, setOs] = useState<'mac' | 'win'>('mac');

  const macSteps: { t: string; d: React.ReactNode }[] = [
    {
      t: 'Download OB for macOS',
      d: OB_DOWNLOAD_URL
        ? (<a href={OB_DOWNLOAD_URL} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Download the OB app &rarr;</a>)
        : 'The macOS app is rolling out to Elite members, you\u2019ll get a download email shortly.',
    },
    { t: 'Open it and move OB to Applications', d: 'Double-click the downloaded file and drag OB into your Applications folder.' },
    { t: 'Launch OB', d: 'The first time, macOS may say it\u2019s from an unidentified developer, right-click the app and choose Open to get past it.' },
    { t: 'Sign in with your OfferBell account', d: 'Use this same email and password. OB unlocks automatically because you\u2019re Elite.' },
  ];

  const pill = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
    fontFamily: "'Sora', sans-serif", border: '1px solid ' + (active ? 'transparent' : 'var(--border-2)'),
    background: active ? 'var(--text)' : 'transparent', color: active ? 'var(--surface)' : 'var(--text-2)',
  });

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 0 90px', fontFamily: "'Sora', sans-serif" }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', marginBottom: 20,
        background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
        border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 999,
        fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
        Elite plan
      </div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif", fontSize: 54, lineHeight: 1.0, letterSpacing: '-1px',
        color: 'var(--text)', margin: '0 0 20px', fontWeight: 400, maxWidth: 620,
      }}>
        Meet <em style={{ fontStyle: 'italic' }}>OB</em>, your recruiting coach you talk to.
      </h1>

      <p style={{ fontSize: 15.5, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 30px', maxWidth: 560 }}>
        OB is a desktop voice assistant built on everything in OfferBell. Run a mock interview, tear down a
        company, prep a coffee chat, or get a market brief, just by talking. It's included with your Elite plan.
      </p>

      {/* Install instructions */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 16, padding: '24px 24px 26px', marginBottom: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Get OB on your computer</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setOs('mac')} style={pill(os === 'mac')}>macOS</button>
            <button type="button" onClick={() => setOs('win')} style={pill(os === 'win')}>Windows</button>
          </div>
        </div>

        {os === 'mac' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {macSteps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12.5, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{s.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{s.d}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Requires macOS on Apple silicon.</div>
          </div>
        ) : (
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>OB for Windows is on the way</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
                We'll email Elite members the moment the Windows build is ready. For now, OB runs on macOS (Apple silicon).
              </div>
            </div>
          </div>
        )}
      </div>

      {/* feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="ob-feat-grid">
        {FEATURES.map((f) => (
          <div key={f.title} style={{
            border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 14, padding: '18px 18px',
          }}>
            <div style={{ width: 30, height: 30, color: '#3b82f6', marginBottom: 10 }}>{OB_ORB}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{f.body}</div>
          </div>
        ))}
      </div>

      <style>{`@media (max-width: 720px){ .ob-feat-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ObPaywall — Elite upsell for free / pro
// ═══════════════════════════════════════════════════════════════════════════
function ObPaywall({ currentPlan }: { currentPlan: string | null }) {
  const isPro = currentPlan === 'pro';
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 0 90px', fontFamily: "'Sora', sans-serif" }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', marginBottom: 20,
        background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
        border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 999,
        fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
        Elite only
      </div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif", fontSize: 54, lineHeight: 1.0, letterSpacing: '-1px',
        color: 'var(--text)', margin: '0 0 20px', fontWeight: 400, maxWidth: 620,
      }}>
        <em style={{ fontStyle: 'italic' }}>OB</em> is the coach you talk to.
      </h1>

      <p style={{ fontSize: 15.5, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 560 }}>
        {isPro
          ? "You're on Pro. OB sits one tier up: a desktop voice assistant that runs mock interviews, company teardowns, coffee-chat prep, and market briefs, out loud, on demand."
          : 'OB is a desktop voice assistant built on all of OfferBell. Run mock interviews, tear down companies, prep coffee chats, and get market briefs, just by talking. Available on the Elite plan.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 52 }}>
        <button
          type="button"
          onClick={() => { window.location.href = '/checkout?plan=elite'; }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--text)', color: 'var(--surface)',
            border: 'none', padding: '12px 22px', borderRadius: 10,
            fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif",
          }}
        >
          Upgrade to Elite
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
        <button
          type="button"
          onClick={() => { window.location.href = '/checkout'; }}
          style={{
            background: 'transparent', color: 'var(--text-2)',
            border: '1.5px solid var(--border-2)', padding: '12px 20px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif",
          }}
        >
          Compare plans
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="ob-feat-grid">
        {FEATURES.map((f) => (
          <div key={f.title} style={{
            border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 14, padding: '18px 18px',
          }}>
            <div style={{ width: 30, height: 30, color: '#3b82f6', marginBottom: 10 }}>{OB_ORB}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{f.body}</div>
          </div>
        ))}
      </div>

      <style>{`@media (max-width: 720px){ .ob-feat-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}
