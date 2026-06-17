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

// The standalone OB download (a zip that unpacks to ~/ob). Host OB.zip in the
// site's /public folder so it serves from here. If you ever move it, change this.
const OB_DOWNLOAD_URL = '/OB.zip';
const OB_SUPPORT_EMAIL = 'officialofferbell@gmail.com';

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

// The OB orb, animated — a small "product shot" of the app that sells the
// voice-assistant idea. Pure CSS/SVG, no assets. Lives in a dark device panel
// so it looks premium on both light and dark site themes.
function OBShowcase() {
  return (
    <div className="obshow">
      <style dangerouslySetInnerHTML={{ __html: `
        .obshow{
          position:relative; border-radius:22px; overflow:hidden;
          background:radial-gradient(120% 90% at 50% 18%, #0a1326 0%, #060a16 45%, #04060c 100%);
          border:1px solid rgba(59,130,246,0.22);
          box-shadow:0 24px 60px -28px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.04);
          min-height:360px; display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:28px 20px;
        }
        .obshow::before{
          content:""; position:absolute; inset:0;
          background-image:radial-gradient(rgba(99,140,230,0.10) 1px, transparent 1px);
          background-size:22px 22px; opacity:0.6; pointer-events:none;
        }
        .obshow-stage{ position:relative; width:150px; height:150px; display:flex; align-items:center; justify-content:center; }
        .obshow-ring{
          position:absolute; width:118px; height:118px; border-radius:50%;
          border:1px solid rgba(80,140,255,0.5); animation:obPulse 3.4s ease-out infinite;
        }
        .obshow-ring.r2{ animation-delay:1.13s; } .obshow-ring.r3{ animation-delay:2.26s; }
        .obshow-orb{
          position:relative; width:112px; height:112px; border-radius:50%;
          background:radial-gradient(circle at 36% 30%, #bfdbff 0%, #5b9bff 26%, #2563eb 54%, #1740b8 78%, #102a78 100%);
          box-shadow:0 0 56px rgba(37,99,235,0.75), 0 0 120px rgba(37,99,235,0.35), inset 0 -10px 26px rgba(8,20,60,0.6), inset 0 8px 18px rgba(255,255,255,0.28);
          display:flex; align-items:center; justify-content:center; gap:5px;
          animation:obBreathe 4.2s ease-in-out infinite;
        }
        .obshow-orb i{
          display:block; width:4px; border-radius:3px; height:10px;
          background:rgba(255,255,255,0.92); box-shadow:0 0 8px rgba(255,255,255,0.6);
          animation:obBar 1.05s ease-in-out infinite;
        }
        .obshow-orb i:nth-child(1){ animation-delay:0s; } .obshow-orb i:nth-child(2){ animation-delay:.12s; }
        .obshow-orb i:nth-child(3){ animation-delay:.24s; } .obshow-orb i:nth-child(4){ animation-delay:.36s; }
        .obshow-orb i:nth-child(5){ animation-delay:.48s; }
        .obshow-status{
          margin-top:30px; display:inline-flex; align-items:center; gap:8px;
          padding:7px 15px; border-radius:999px; background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.10); color:#dbe6ff; font-size:12.5px; font-weight:600;
          font-family:'Sora',sans-serif;
        }
        .obshow-status .d{ width:7px; height:7px; border-radius:50%; background:#4ade80; box-shadow:0 0 8px #4ade80; animation:obDot 1.6s ease-in-out infinite; }
        .obshow-cap{ margin-top:12px; font-size:11px; letter-spacing:.04em; color:rgba(190,205,235,0.5); font-family:'Sora',sans-serif; }
        @keyframes obBreathe{ 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.05); } }
        @keyframes obPulse{ 0%{ transform:scale(0.78); opacity:.6; } 100%{ transform:scale(2.3); opacity:0; } }
        @keyframes obBar{ 0%,100%{ height:9px; } 50%{ height:26px; } }
        @keyframes obDot{ 0%,100%{ opacity:1; } 50%{ opacity:.25; } }
        @media (prefers-reduced-motion: reduce){
          .obshow-orb,.obshow-ring,.obshow-orb i,.obshow-status .d{ animation:none !important; }
        }
      ` }} />
      <div className="obshow-stage">
        <span className="obshow-ring r1" />
        <span className="obshow-ring r2" />
        <span className="obshow-ring r3" />
        <span className="obshow-orb"><i /><i /><i /><i /><i /></span>
      </div>
      <div className="obshow-status"><span className="d" /> Listening&hellip;</div>
      <div className="obshow-cap">OB &middot; a production of OfferBell</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ObElite — get-started / download for Elite members
// ═══════════════════════════════════════════════════════════════════════════
function ObElite() {
  const [os, setOs] = useState<'mac' | 'win'>('mac');
  const [copied, setCopied] = useState(false);

  // One paste: unzip to ~/ob, clear the download quarantine flag, launch.
  // The launcher builds its own environment and installs everything on first run.
  const INSTALL_CMD = 'cd ~/Downloads && unzip -o OB.zip -d ~ && xattr -dr com.apple.quarantine ~/ob 2>/dev/null; cd ~/ob && chmod +x launch_ob.command && ./launch_ob.command';

  const copyCmd = () => {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
    fontFamily: "'Sora', sans-serif", border: '1px solid ' + (active ? 'transparent' : 'var(--border-2)'),
    background: active ? 'var(--text)' : 'transparent', color: active ? 'var(--surface)' : 'var(--text-2)',
  });

  const stepRow = (n: number, title: string, body: React.ReactNode) => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12.5, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
      }}>{n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{body}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 0 90px', fontFamily: "'Sora', sans-serif" }}>
      <div className="ob-hero" style={{ marginBottom: 40 }}>
        <div className="ob-hero-copy">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', marginBottom: 18,
            background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
            Elite plan
          </div>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 50, lineHeight: 1.02, letterSpacing: '-1px',
            color: 'var(--text)', margin: '0 0 16px', fontWeight: 400,
          }}>
            Your <em style={{ fontStyle: 'italic' }}>OB</em> is ready.
          </h1>

          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
            OB is a desktop voice assistant built on everything in OfferBell, like the AI from <em style={{ fontStyle: 'italic' }}>Iron Man</em>, but for finance recruiting. Run a mock interview, tear down a company, prep a coffee chat, or get a market brief, just by talking. Set it up below.
          </p>
        </div>

        <div className="ob-hero-art"><OBShowcase /></div>
      </div>

      {/* Install instructions */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 16, padding: '24px 24px 26px', marginBottom: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Get OB on your Mac</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setOs('mac')} style={pill(os === 'mac')}>macOS</button>
            <button type="button" onClick={() => setOs('win')} style={pill(os === 'win')}>Windows</button>
          </div>
        </div>

        {os === 'mac' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {stepRow(1, 'Download OB', (
              <div>
                <a href={OB_DOWNLOAD_URL} download style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6,
                  background: 'var(--text)', color: 'var(--surface)', textDecoration: 'none',
                  padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                }}>
                  Download OB.zip
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                </a>
                <div style={{ marginTop: 7, fontSize: 12.5, color: 'var(--text-3)' }}>It'll land in your Downloads folder.</div>
              </div>
            ))}

            {stepRow(2, 'Open Terminal and paste this', (
              <div>
                <div style={{ marginBottom: 8 }}>
                  Press <strong>Cmd + Space</strong>, type <strong>Terminal</strong>, hit Enter. Then paste the line below and press Enter:
                </div>
                <div style={{ position: 'relative', background: '#0b1220', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                  <code style={{
                    display: 'block', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11.5,
                    color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingRight: 70,
                  }}>{INSTALL_CMD}</code>
                  <button type="button" onClick={copyCmd} style={{
                    position: 'absolute', top: 10, right: 10, cursor: 'pointer',
                    background: copied ? '#16a34a' : 'rgba(255,255,255,0.08)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.16)', borderRadius: 7, padding: '5px 11px',
                    fontSize: 11.5, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                  }}>{copied ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            ))}

            {stepRow(3, 'Let it set up, then it opens', (
              <span>The first run takes a couple of minutes while it installs itself, you only wait once. When the setup screen appears, paste your free <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Gemini API key</a> (it's the only key OB needs).</span>
            ))}

            {stepRow(4, 'Sign in with your OfferBell account', (
              <span>Use this same email and password. OB unlocks automatically because you're Elite.</span>
            ))}

            <div style={{
              marginTop: 4, padding: '12px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 10, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55,
            }}>
              Don't have Python? OB will tell you and link the installer, install it once, then paste the command again.
              {' '}Stuck anywhere? Email <a href={'mailto:' + OB_SUPPORT_EMAIL} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>{OB_SUPPORT_EMAIL}</a> and we'll get you running.
            </div>
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
                OB runs on macOS today. The Windows build is in progress, in the meantime, reach us at{' '}
                <a href={'mailto:' + OB_SUPPORT_EMAIL} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>{OB_SUPPORT_EMAIL}</a>.
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

      <style>{`
        .ob-hero{ display:flex; gap:34px; align-items:center; }
        .ob-hero-copy{ flex:1; min-width:0; }
        .ob-hero-art{ width:312px; flex-shrink:0; }
        @media (max-width: 820px){
          .ob-hero{ flex-direction:column-reverse; gap:26px; }
          .ob-hero-art{ width:100%; max-width:420px; }
          .ob-feat-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ObPaywall — Elite upsell for free / pro
// ═══════════════════════════════════════════════════════════════════════════
function ObPaywall({ currentPlan }: { currentPlan: string | null }) {
  const isPro = currentPlan === 'pro';
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 0 90px', fontFamily: "'Sora', sans-serif" }}>
      <div className="ob-hero">
        <div className="ob-hero-copy">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', marginBottom: 18,
            background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
            Elite only
          </div>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 50, lineHeight: 1.02, letterSpacing: '-1px',
            color: 'var(--text)', margin: '0 0 16px', fontWeight: 400,
          }}>
            <em style={{ fontStyle: 'italic' }}>OB</em> is the coach you talk to.
          </h1>

          <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.5, margin: '0 0 14px', fontWeight: 600 }}>
            Think the AI assistant from <em style={{ fontStyle: 'italic' }}>Iron Man</em>, except it actually knows your IB technicals, LBO math, and what a Superday feels like.
          </p>

          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 26px' }}>
            {isPro
              ? "You're on Pro. OB sits one tier up, a desktop voice assistant you talk to out loud. It runs live mock interviews, tears down companies from their filings, preps your coffee chats, and briefs you on the market before it opens. Nothing else in recruiting works like this."
              : 'Talk to OB out loud on your desktop. It runs live mock interviews, tears down any company from its filings, preps your coffee chats, and briefs you on the market before it opens, no typing, all by voice. Nothing else in recruiting does this.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
        </div>

        <div className="ob-hero-art"><OBShowcase /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 52 }} className="ob-feat-grid">
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

      <style>{`
        .ob-hero{ display:flex; gap:34px; align-items:center; }
        .ob-hero-copy{ flex:1; min-width:0; }
        .ob-hero-art{ width:312px; flex-shrink:0; }
        @media (max-width: 820px){
          .ob-hero{ flex-direction:column-reverse; gap:26px; }
          .ob-hero-art{ width:100%; max-width:420px; }
          .ob-feat-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}
