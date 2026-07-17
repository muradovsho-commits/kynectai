'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '../components/Topbar';
import '../contact-finder/contact-finder.css'; // global color vars + full-screen session theming
import './desk.css'; // The Desk landing + scenario-list chrome
import { REPS_TRACKS, REPS_SCENARIOS, type RepsTrackId, type Scenario, type Persona, type ArtifactSpec } from './reps-data';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// Cloud session sync for The Desk. All calls are wrapped and fire-and-forget:
// localStorage stays the primary store, so if Convex is unreachable The Desk
// behaves exactly as before. This only ever ADDS cross-device persistence.
function repsClient(): ConvexHttpClient | null {
  try {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    return new ConvexHttpClient(url);
  } catch { return null; }
}
function repsAuth(): { userId: string | null; sessionToken: string | undefined } {
  if (typeof window === 'undefined') return { userId: null, sessionToken: undefined };
  return {
    userId: localStorage.getItem('offerbell_user_id'),
    sessionToken: localStorage.getItem('offerbell_session') || undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// The Desk - career simulator.
//
// Career is driven by the Industry selector in the sidebar (same source of
// truth as Concept Drills and the interview-prep pages): the active vertical
// is read from offerbell_onboarding_profile.targetRoles[0]. There is no
// in-page career grid. Switching career happens in the sidebar.
//
// Two views once a career resolves:
//   1. Scenario list: pick a workday scenario for the selected career
//   2. Session: chat panel on left, artifact workspace on right
//
// Personas drop opening messages. The student replies in chat OR uploads work.
// On upload, the file is parsed server-side, sent to the AI with the rubric,
// and graded on craft. Feedback lands in chat in the persona's voice.
// ─────────────────────────────────────────────────────────────────────────────

type ChatMsg = {
  id: string;
  from: 'persona' | 'student' | 'system';
  personaId?: string;
  text: string;
  artifactId?: string;
  scores?: Record<string, number>;
};

type UploadStatus = 'idle' | 'parsing' | 'grading' | 'done' | 'error';

// Plan-gate state. 'loading' is the first paint after mount, before we've
// inspected localStorage. 'elite' renders the full Desk experience. Anything
// else renders the paywall.
type PlanStatus = 'loading' | 'elite' | 'gated';

// Maps the sidebar's selected vertical (offerbell_onboarding_profile.targetRoles[0])
// to a Desk track id. Verticals without a Desk track yet (e.g. Growth Equity,
// Hedge Fund) resolve to null and show a "coming soon" empty state. Mirrors the
// VERTICAL_TO_TRACK pattern in concept-drills, using The Desk's own track ids.
const VERTICAL_TO_TRACK: Record<string, RepsTrackId> = {
  'Investment Banking': 'ib',
  'Private Equity': 'pe',
  'Venture Capital': 'vc',
  'Consulting': 'consulting',
  'Accounting & Audit': 'audit',
  'Accounting / Audit / Tax': 'audit',
  'Asset Management': 'am',
  'Sales & Trading': 'st',
  'Equity Research': 'er',
  'Real Estate': 're',
  'Restructuring': 'rx',
};

export default function RepsPage() {
  const router = useRouter();
  const [planStatus, setPlanStatus] = useState<PlanStatus>('loading');
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [vertical, setVertical] = useState<string>('');
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Auth + plan gate (localStorage UI hint; the /api/reps routes enforce Elite
  // server-side against Convex truth).
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

  // Selected vertical from the sidebar. Re-reads on the in-window
  // 'offerbell-profile-changed' event (fired by the sidebar when the user
  // switches industry) and on cross-tab storage events.
  const loadVertical = useCallback(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        setVertical((Array.isArray(p.targetRoles) && p.targetRoles[0]) || '');
      } else {
        setVertical('');
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadVertical();
    const onChanged = () => loadVertical();
    const onStorage = (e: StorageEvent) => { if (e.key === 'offerbell_onboarding_profile') loadVertical(); };
    window.addEventListener('offerbell-profile-changed', onChanged);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('offerbell-profile-changed', onChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, [loadVertical]);

  // Apply saved theme on mount (mirrors other pages).
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('offerbell-theme') : null;
    if (saved && typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const trackId = VERTICAL_TO_TRACK[vertical] || null;
  const track = trackId ? REPS_TRACKS.find(t => t.id === trackId) ?? null : null;
  const scenarios = trackId ? (REPS_SCENARIOS[trackId] || []) : [];
  const scenario = activeScenarioId ? scenarios.find(s => s.id === activeScenarioId) ?? null : null;

  // Switching career (in the sidebar) drops any open scenario so you don't
  // carry an IB session into the PE desk.
  useEffect(() => { setActiveScenarioId(null); }, [trackId]);

  // Loading: render the frame only, no content, to avoid layout shift.
  if (planStatus === 'loading') {
    return (
      <div className="desk-app">
        <Topbar activePage="reps" />
        <main className="desk-canvas"><div className="desk-page" /></main>
      </div>
    );
  }

  // Paywall: anything that isn't Elite.
  if (planStatus === 'gated') {
    return (
      <div className="desk-app">
        <Topbar activePage="reps" />
        <main className="desk-canvas">
          <div className="desk-page">
            <div className="desk-page-inner desk-inner-wide">
              <ElitePaywall currentPlan={currentPlan} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Live session: full-height split (chat | workspace) beside the sidebar.
  if (scenario) {
    return (
      <div className="desk-app">
        <Topbar activePage="reps" />
        <main className="desk-canvas">
          <SessionView key={scenario.id} scenario={scenario} onExit={() => setActiveScenarioId(null)} />
        </main>
      </div>
    );
  }

  // Elite + no open session: the scenario list for the selected career, or an
  // empty state when the vertical has no Desk track yet.
  return (
    <div className="desk-app">
      <Topbar activePage="reps" />
      <main className="desk-canvas">
        <div className="desk-page">
          <div className="desk-page-inner">
            <header className="desk-head">
              <div className="desk-hero-row">
                <div>
                  <div className="desk-eyebrow">The Desk</div>
                  <h1 className="desk-title">
                    {track
                      ? <>Live a day in <em>{track.title}</em>.</>
                      : <>Live a day in <em>the seat</em>.</>}
                  </h1>
                  <p className="desk-sub">
                    {track
                      ? 'Pick a workday below. Build the real deliverable, upload it, and get marked up on craft by the person who asked for it.'
                      : 'The Desk drops you into a junior seat on a real workday. Choose your career from the Industry selector to begin.'}
                  </p>
                </div>
                {track && (
                  <div className="desk-hero-stats">
                    <div>
                      <div className="desk-hero-stat-val">{scenarios.length}</div>
                      <div className="desk-hero-stat-label">Workdays</div>
                    </div>
                    <div>
                      <div className="desk-hero-stat-val">{scenarios.reduce((n, s) => n + s.artifacts.length, 0)}</div>
                      <div className="desk-hero-stat-label">Deliverables</div>
                    </div>
                  </div>
                )}
              </div>
            </header>

            {!track ? (
              <div className="desk-empty">
                {!vertical
                  ? 'Pick an industry in the sidebar to start a workday.'
                  : `The Desk for ${vertical} is coming soon. Switch industry in the sidebar to try another career.`}
              </div>
            ) : (
              <ScenarioList track={track} scenarios={scenarios} onPick={(id) => setActiveScenarioId(id)} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ElitePaywall: rendered when the user is on free or pro. Shows what The Desk
// is and a single CTA into the upgrade flow.
// ═══════════════════════════════════════════════════════════════════════════
function ElitePaywall({ currentPlan }: { currentPlan: string | null }) {
  const isPro = currentPlan === 'pro';

  type Beat = { time: string; kind: 'ping' | 'build' | 'submit' | 'grade'; who?: string; role?: string; initials?: string; text: string; score?: string };
  const beats: Beat[] = [
    { time: '9:12', kind: 'ping', who: 'Anna Liu', role: 'VP, Industrials', initials: 'AL',
      text: 'Need the LBO by EOD. 5-year hold, 6.5x entry, 60% leverage. Sources and uses on tab 1, returns on tab 3.' },
    { time: '11:30', kind: 'build',
      text: 'You open Excel and build it. Sources and uses, the debt schedule, the returns waterfall. A real file, not multiple choice.' },
    { time: '2:40', kind: 'ping', who: 'Marcus Whitfield', role: 'MD', initials: 'MW',
      text: 'Walk me through the exit multiple. Why 7.0x and not 6.0x? Defend it.' },
    { time: '4:55', kind: 'submit',
      text: 'You upload Industrials_LBO_v3.xlsx. The desk goes quiet.' },
    { time: '5:10', kind: 'grade', score: '88 / 100',
      text: 'Graded line by line. Strong: sources and uses ties at B14. Watch: tax shield missing in FCF on tab 2, row 23.' },
  ];

  const careers = ['Investment Banking', 'Private Equity', 'Consulting', 'Restructuring', 'Sales & Trading', 'Asset Management', 'Venture Capital', 'Real Estate', 'Equity Research', 'Audit'];

  const dot = (b: Beat) => {
    if (b.kind === 'ping') {
      return (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 11, fontWeight: 700,
          fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
          boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
        }}>{b.initials}</div>
      );
    }
    const map: Record<string, { bg: string; fg: string; icon: JSX.Element }> = {
      build: { bg: 'var(--surface-2)', fg: 'var(--text-2)', icon: <path d="M4 4h16v16H4zM4 10h16M10 10v10" /> },
      submit: { bg: 'var(--surface-2)', fg: 'var(--text-2)', icon: <><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></> },
      grade: { bg: 'rgba(34,197,94,0.14)', fg: '#16a34a', icon: <path d="M20 6L9 17l-5-5" /> },
    };
    const m = map[b.kind];
    return (
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: m.bg, color: m.fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: b.kind === 'grade' ? '1px solid rgba(34,197,94,0.4)' : '1px solid var(--border)',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{m.icon}</svg>
      </div>
    );
  };

  return (
    <div style={{ margin: '0 auto', padding: '40px 0 90px', fontFamily: "'Sora', sans-serif" }}>

      <div className="pw-hero">
      <div className="pw-hero-copy">
      {/* ─── Hero ─── */}
      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 54, lineHeight: 1.0, letterSpacing: '-1px',
        color: 'var(--text)', margin: '0 0 20px', fontWeight: 400, maxWidth: 600,
      }}>
        The Desk is <em style={{ fontStyle: 'italic' }}>where you</em> <em style={{ fontStyle: 'italic' }}>actually</em> work.
      </h1>

      <p style={{ fontSize: 15.5, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 560 }}>
        {isPro
          ? "You're on Pro. The Desk sits one tier up. It drops you into a junior seat on a real workday: personas message you, you build the actual deliverable, and the AI grades the file itself."
          : 'No flashcards, no quizzes. The Desk drops you into a junior seat on a real workday and grades the work you actually produce. Here is one day in the seat.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 56 }}>
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

      <div style={{ marginTop: 34, paddingTop: 30, borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, lineHeight: 1.1, color: 'var(--text)', margin: '0 0 8px', fontWeight: 400 }}>
          Ten seats. <em style={{ fontStyle: 'italic' }}>Thirty workdays.</em>
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.55, margin: '0 0 14px' }}>
          Switch the seat from the Industry selector. Every career has intro, intermediate, and advanced workdays, each with its own personas, deliverables, and rubric.
        </p>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 2.0 }}>
          {careers.map((c, i) => (
            <span key={c}>
              {i > 0 && <span style={{ color: 'var(--text-3)', margin: '0 12px', fontWeight: 300 }}>|</span>}
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c}</span>
            </span>
          ))}
        </div>
      </div>
      </div>
      <div className="pw-hero-timeline">
      {/* ─── Workday timeline ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4,
        textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 26,
      }}>
        <span>A day in the seat</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0, textTransform: 'none', color: 'var(--text-3)' }}>Tue</span>
      </div>

      <div style={{ position: 'relative' }}>
        {beats.map((b, i) => {
          const last = i === beats.length - 1;
          return (
            <div key={i} className="beat" style={{ display: 'flex', alignItems: 'stretch', gap: 16, animationDelay: `${0.08 * i + 0.05}s` }}>
              {/* time */}
              <div style={{
                width: 52, flexShrink: 0, textAlign: 'right', paddingTop: 4,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-3)',
              }}>{b.time}</div>

              {/* spine */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                {dot(b)}
                {!last && <div style={{ width: 2, flex: 1, minHeight: 22, marginTop: 6, background: 'linear-gradient(var(--border), var(--border))' }} />}
              </div>

              {/* content */}
              <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 26 }}>
                {b.kind === 'ping' && (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{b.who}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{b.role}</span>
                  </div>
                )}
                {b.kind === 'grade' ? (
                  <div style={{
                    borderLeft: '3px solid #22c55e', background: 'var(--surface-2)',
                    borderRadius: '0 10px 10px 0', padding: '12px 16px',
                    boxShadow: '0 6px 24px rgba(34,197,94,0.10)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Industrials_LBO_v3.xlsx</span>
                      <span style={{ padding: '2px 9px', borderRadius: 100, background: 'rgba(34,197,94,0.14)', color: '#16a34a', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{b.score}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{b.text}</div>
                  </div>
                ) : b.kind === 'ping' ? (
                  <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, maxWidth: 520 }}>
                    {b.text}
                  </div>
                ) : (
                  <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.55, paddingTop: 5, maxWidth: 520 }}>
                    {b.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>
      </div>

      <style>{`
        .beat { opacity: 0; transform: translateY(8px); animation: beatIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes beatIn { to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .beat { animation: none; opacity: 1; transform: none; } }
        .desk-page-inner.desk-inner-wide { max-width: 1140px; }
        .pw-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 54px; align-items: start; margin-bottom: 24px; }
        .pw-hero-copy { min-width: 0; padding-top: 4px; }
        .pw-hero-timeline { min-width: 0; }
        @media (max-width: 900px) {
          .pw-hero { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 880px) {
          .paywall-hero { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PersonaAvatar
//
// Uses randomuser.me/api/portraits as the image host. Each named persona is
// mapped to a specific stock headshot via PERSONA_PHOTOS below, chosen by
// rough gender match to the name. If the image fails (offline service, ad
// blocker), falls back to the geometric SVG with initials.
//
// Adding a new persona: append a name to PERSONA_PHOTOS with a chosen URL.
// ═══════════════════════════════════════════════════════════════════════════

const PERSONA_PHOTOS: Record<string, string> = {
  // IB
  'David Chen':        'https://randomuser.me/api/portraits/men/32.jpg',
  'Priya Raman':       'https://randomuser.me/api/portraits/women/44.jpg',
  'Marcus Whitfield':  'https://randomuser.me/api/portraits/men/45.jpg',
  'Anna Liu':          'https://randomuser.me/api/portraits/women/21.jpg',
  'Jordan Park':       'https://randomuser.me/api/portraits/men/22.jpg',
  // PE
  'Sam Garcia':        'https://randomuser.me/api/portraits/men/11.jpg',
  'Rachel Kim':        'https://randomuser.me/api/portraits/women/56.jpg',
  'Diane Mosse':       'https://randomuser.me/api/portraits/women/12.jpg',
  // Consulting
  'Marcus Bell':       'https://randomuser.me/api/portraits/men/67.jpg',
  'Sara Patel':        'https://randomuser.me/api/portraits/women/73.jpg',
  // Restructuring
  'Eleanor Voss':      'https://randomuser.me/api/portraits/women/8.jpg',
  'Daniel Reyes':      'https://randomuser.me/api/portraits/men/53.jpg',
  'Mira Okonkwo':      'https://randomuser.me/api/portraits/women/39.jpg',
  'Aaron Park':        'https://randomuser.me/api/portraits/men/89.jpg',
  // S&T
  'Mike Donato':       'https://randomuser.me/api/portraits/men/41.jpg',
  // AM
  'Karthik Rangan':    'https://randomuser.me/api/portraits/men/78.jpg',
  // VC
  'Yusuf Bakir':       'https://randomuser.me/api/portraits/men/64.jpg',
  'Helene Marchetti':  'https://randomuser.me/api/portraits/women/60.jpg',
  // RE
  'Reese Tanaka':      'https://randomuser.me/api/portraits/men/16.jpg',
  'Aaron Mitchell':    'https://randomuser.me/api/portraits/men/27.jpg',
  'Devon Wright':      'https://randomuser.me/api/portraits/men/95.jpg',
  // ER
  'Carmen Holloway':   'https://randomuser.me/api/portraits/women/85.jpg',
  // Audit
  'Priya Mehta':       'https://randomuser.me/api/portraits/women/29.jpg',
  'James Hartwell':    'https://randomuser.me/api/portraits/men/38.jpg',
};

const AVATAR_PALETTES = [
  { bg: '#1f2937', fg: '#fde68a', accent: 'rgba(253,230,138,0.18)' },
  { bg: '#1e3a8a', fg: '#fbbf24', accent: 'rgba(251,191,36,0.18)' },
  { bg: '#365314', fg: '#bef264', accent: 'rgba(190,242,100,0.18)' },
  { bg: '#7c2d12', fg: '#fed7aa', accent: 'rgba(254,215,170,0.18)' },
  { bg: '#581c87', fg: '#d8b4fe', accent: 'rgba(216,180,254,0.18)' },
  { bg: '#0c4a6e', fg: '#7dd3fc', accent: 'rgba(125,211,252,0.18)' },
  { bg: '#7e22ce', fg: '#fbcfe8', accent: 'rgba(251,207,232,0.18)' },
  { bg: '#854d0e', fg: '#fde68a', accent: 'rgba(253,230,138,0.22)' },
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function PersonaAvatar({ persona, size = 32 }: { persona: Persona; size?: number }) {
  const [imgErrored, setImgErrored] = useState(false);
  const photoUrl = PERSONA_PHOTOS[persona.name];

  if (photoUrl && !imgErrored) {
    return (
      <img
        src={photoUrl}
        alt={persona.name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setImgErrored(true)}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          display: 'block',
          background: 'var(--bg)',
        }}
      />
    );
  }

  return <InitialsAvatar persona={persona} size={size} />;
}

function InitialsAvatar({ persona, size }: { persona: Persona; size: number }) {
  const { palette, pattern } = useMemo(() => {
    const h = hashName(persona.name);
    return { palette: AVATAR_PALETTES[h % AVATAR_PALETTES.length], pattern: h % 3 };
  }, [persona.name]);

  const fontSize = size * 0.42;
  const r = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }} aria-hidden="true">
      <defs>
        <clipPath id={`clip-${persona.id}-${size}`}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>
      </defs>
      <circle cx={r} cy={r} r={r} fill={palette.bg} />
      <g clipPath={`url(#clip-${persona.id}-${size})`}>
        {pattern === 0 && <circle cx={r} cy={r} r={size * 0.34} fill="none" stroke={palette.fg} strokeWidth={size * 0.05} opacity="0.42" />}
        {pattern === 1 && <path d={`M 0 ${r} A ${r} ${r} 0 0 1 ${size} ${r} Z`} fill={palette.accent} />}
        {pattern === 2 && <circle cx={r} cy={size * 0.92} r={size * 0.42} fill={palette.accent} />}
      </g>
      <text
        x={r} y={r + fontSize * 0.36} textAnchor="middle"
        fill={palette.fg}
        fontFamily="'Instrument Serif', serif"
        fontSize={fontSize}
        fontStyle="italic"
        fontWeight="500"
      >
        {persona.initials}
      </text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════


const DIFFICULTY_ORDER: Record<string, number> = {
  'Intro': 0,
  'Intermediate': 1,
  'Advanced': 2,
};

function difficultyClass(d: string): string {
  if (d === 'Intro') return 'desk-diff-intro';
  if (d === 'Advanced') return 'desk-diff-adv';
  return 'desk-diff-mid';
}

// ═══════════════════════════════════════════════════════════════════════════
// How-it-works strip (dismissible, once per user)
// ═══════════════════════════════════════════════════════════════════════════
function DeskHowTo({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <>
      <button type="button" className="desk-howto-toggle" aria-expanded={open} onClick={onToggle}>
        How it works
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div className="desk-howto">
          {[
            { n: '01', title: 'Pick a workday', body: 'Ordered from your first week to the all-nighter.' },
            { n: '02', title: 'Do the work', body: 'Build it in Excel, Word, or PowerPoint. Upload the file.' },
            { n: '03', title: 'Get marked up', body: 'The persona reviews your file and pushes back in chat.' },
          ].map(st => (
            <div key={st.n} className="desk-howto-step">
              <div className="desk-howto-step-n">{st.n}</div>
              <div className="desk-howto-step-title">{st.title}</div>
              <div className="desk-howto-step-body">{st.body}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// Scenario list - scenarios for the career selected in the sidebar
// ═══════════════════════════════════════════════════════════════════════════
function ScenarioList({ track, scenarios, onPick }: { track: typeof REPS_TRACKS[number]; scenarios: Scenario[]; onPick: (id: string) => void; }) {
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_reps_welcomed')) setShowHowTo(true);
  }, []);

  function toggleHowTo() {
    setShowHowTo(v => {
      const next = !v;
      if (typeof window !== 'undefined' && !next) localStorage.setItem('offerbell_reps_welcomed', '1');
      return next;
    });
  }

  const STAGES = ['Intro', 'Intermediate', 'Advanced'];
  const STAGE_NOTE: Record<string, string> = {
    Intro: 'Your first asks. The associate is checking whether you can be trusted with real work.',
    Intermediate: 'A normal week. Live deadlines, a VP who will mark it up.',
    Advanced: 'The deal is moving and the thesis just changed. Deliver anyway.',
  };

  // Group into stages so the progression stays readable however many exist.
  const grouped = useMemo(() => {
    return STAGES
      .map(st => ({ stage: st, items: scenarios.filter(s => s.difficulty === st) }))
      .filter(g => g.items.length > 0);
  }, [scenarios]);

  return (
    <div className="desk-tab-pane">
      <DeskHowTo open={showHowTo} onToggle={toggleHowTo} />

      {grouped.length === 0 ? (
        <div className="desk-empty">No workdays for this career yet.</div>
      ) : grouped.map(g => (
        <section key={g.stage} className="desk-stage">
          <div className="desk-stage-head">
            <h2 className="desk-stage-name">{g.stage}</h2>
            <span className="desk-stage-note">{STAGE_NOTE[g.stage]}</span>
          </div>
          <div className="desk-scn-grid">
            {g.items.map(s => (
              <button key={s.id} type="button" className="desk-scn-card" onClick={() => onPick(s.id)}>
                <span className="desk-scn-when">{s.timeframe}</span>
                <span className="desk-scn-title">{s.title}</span>
                <span className="desk-scn-summary">{s.summary}</span>
                <span className="desk-scn-foot">
                  <span className="desk-scn-meta">
                    {s.artifacts.length} {s.artifacts.length === 1 ? 'Deliverable' : 'Deliverables'}
                  </span>
                  <span className="desk-scn-link">
                    Start
                    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEW 3: Live session
// ═══════════════════════════════════════════════════════════════════════════
function SessionView({ scenario, onExit }: { scenario: Scenario; onExit: () => void; }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(scenario.artifacts[0]?.id ?? null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedArtifacts, setCompletedArtifacts] = useState<Set<string>>(new Set());
  const [showSessionHelper, setShowSessionHelper] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_reps_session_intro_seen')) setShowSessionHelper(true);
  }, []);

  function dismissSessionHelper() {
    setShowSessionHelper(false);
    if (typeof window !== 'undefined') localStorage.setItem('offerbell_reps_session_intro_seen', '1');
  }

  // Session persistence. On mount: try to restore from localStorage. Falls
  // back to the scenario's opening messages if no prior session or if the
  // stored state is corrupted or older than 90 days. State is keyed per
  // scenarioId so each scenario maintains its own progress.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    reconciledRef.current = false;
    localOrigUpdatedRef.current = 0;
    const storageKey = `offerbell_reps_session_${scenario.id}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const fresh = Date.now() - (data.updatedAt || 0) < 90 * 24 * 60 * 60 * 1000;
        if (fresh && Array.isArray(data.messages) && data.messages.length > 0) {
          localOrigUpdatedRef.current = data.updatedAt || 0;
          setMessages(data.messages);
          setCompletedArtifacts(new Set(Array.isArray(data.completedArtifacts) ? data.completedArtifacts : []));
          if (data.activeArtifactId && scenario.artifacts.some(a => a.id === data.activeArtifactId)) {
            setActiveArtifactId(data.activeArtifactId);
          }
          return;
        }
      } catch {
        // Corrupted state, fall through to fresh init.
      }
    }

    // Fresh session: seed with the scenario's opening messages.
    const opening: ChatMsg[] = scenario.opening.map((o, i) => ({
      id: `open-${i}`,
      from: 'persona',
      personaId: o.personaId,
      text: o.text,
    }));
    setMessages(opening);
    setCompletedArtifacts(new Set());
    setActiveArtifactId(scenario.artifacts[0]?.id ?? null);
  }, [scenario]);

  // Cloud reconcile: after the local restore above, pull this scenario's
  // session from the server and adopt it only if it is newer (edited on
  // another device). Local-first means The Desk is unaffected if Convex is
  // unreachable; this strictly adds cross-device sync.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { userId, sessionToken } = repsAuth();
    if (!userId) { reconciledRef.current = true; return; }
    const client = repsClient();
    if (!client) { reconciledRef.current = true; return; }
    let cancelled = false;
    const storageKey = `offerbell_reps_session_${scenario.id}`;
    (async () => {
      try {
        const cloud = await client.query(api.repsSessions.getSession, { userId, sessionToken, scenarioId: scenario.id });
        if (cancelled) return;
        // Compare against the ORIGINAL local timestamp captured at load, not a
        // re-read of localStorage (which a fresh-init save may have already
        // bumped). orig === 0 means no real local session, so cloud always wins.
        const orig = localOrigUpdatedRef.current;
        if (cloud && (orig === 0 || cloud.updatedAt > orig)) {
          let data: any = null;
          try { data = JSON.parse(cloud.data); } catch {}
          if (data && Array.isArray(data.messages) && data.messages.length > 0) {
            try { localStorage.setItem(storageKey, cloud.data); } catch {}
            localOrigUpdatedRef.current = cloud.updatedAt;
            setMessages(data.messages);
            setCompletedArtifacts(new Set(Array.isArray(data.completedArtifacts) ? data.completedArtifacts : []));
            if (data.activeArtifactId && scenario.artifacts.some(a => a.id === data.activeArtifactId)) {
              setActiveArtifactId(data.activeArtifactId);
            }
          }
        } else if (!cloud) {
          // Server has nothing yet: push our current local session up so the
          // scenario exists in the cloud for other devices.
          const localRaw = localStorage.getItem(storageKey);
          if (localRaw) { try { await client.mutation(api.repsSessions.upsertSession, { userId, sessionToken, scenarioId: scenario.id, data: localRaw }); } catch {} }
        }
      } catch {
        // Convex unreachable or query failed: local state already applied, The Desk unaffected.
      } finally {
        reconciledRef.current = true;
      }
    })();
    return () => { cancelled = true; };
  }, [scenario]);

  // Debounce timer for pushing session changes to the cloud.
  const repsCloudTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cross-device reconcile state. localOrigUpdatedRef = timestamp of the REAL
  // local session found at load (0 if none / fresh opening). reconciledRef
  // gates cloud pushes until reconcile has decided, so a fresh-init opening
  // can never clobber a real cloud session.
  const localOrigUpdatedRef = useRef(0);
  const reconciledRef = useRef(false);

  // Save session state to localStorage on every change. Debouncing isn't
  // strictly necessary at this scale, and localStorage writes are sync, but
  // we skip empty-state writes to avoid clobbering a real session during the
  // brief moment between mount and the restore-or-init effect above.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length === 0) return;
    const storageKey = `offerbell_reps_session_${scenario.id}`;
    const payload = JSON.stringify({
      messages,
      completedArtifacts: Array.from(completedArtifacts),
      activeArtifactId,
      updatedAt: Date.now(),
    });
    try {
      localStorage.setItem(storageKey, payload);
    } catch {
      // Quota exceeded or storage unavailable. Silently drop.
    }
    // Debounced cloud push (fire-and-forget; never blocks or breaks the local save).
    if (repsCloudTimer.current) clearTimeout(repsCloudTimer.current);
    repsCloudTimer.current = setTimeout(() => {
      // Do not push until the cloud reconcile has decided, otherwise a
      // fresh-init opening could overwrite a real cloud session.
      if (!reconciledRef.current) return;
      const { userId, sessionToken } = repsAuth();
      if (!userId) return;
      const client = repsClient();
      if (!client) return;
      try { void client.mutation(api.repsSessions.upsertSession, { userId, sessionToken, scenarioId: scenario.id, data: payload }).catch(() => {}); } catch {}
    }, 4000);
  }, [messages, completedArtifacts, activeArtifactId, scenario.id]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const personaById = useCallback((id?: string) => {
    return scenario.personas.find(p => p.id === id);
  }, [scenario]);

  const activeArtifact: ArtifactSpec | null = activeArtifactId
    ? scenario.artifacts.find(a => a.id === activeArtifactId) ?? null
    : null;

  const activeIdx = activeArtifact ? scenario.artifacts.findIndex(a => a.id === activeArtifact.id) : -1;
  const requestingPersona = activeArtifact ? personaById(activeArtifact.requestedBy) : null;

  function isUnlocked(idx: number): boolean {
    if (idx === 0) return true;
    for (let i = 0; i < idx; i++) {
      if (!completedArtifacts.has(scenario.artifacts[i].id)) return false;
    }
    return true;
  }

  // Build a workspace-state addendum the chat API sees as part of the
  // scenarioContext. This is what stops the AI from telling the student
  // "doesn't matter, pick whichever" when the UI actually requires sequential
  // completion. Only included for multi-artifact scenarios.
  function buildEnrichedContext(): string {
    if (scenario.artifacts.length <= 1) return scenario.context;
    const current = activeArtifact?.label || 'none';
    const locked = scenario.artifacts
      .filter(a => !completedArtifacts.has(a.id) && a.id !== activeArtifactId)
      .map(a => a.label);
    const completed = Array.from(completedArtifacts)
      .map(id => scenario.artifacts.find(a => a.id === id)?.label)
      .filter((s): s is string => !!s);
    return scenario.context + `

CURRENT WORKSPACE STATE (the student sees this in the UI on the right side):
- Currently working on: ${current}
- Locked deliverables (the student cannot start these until they pass the current one): ${locked.length > 0 ? locked.join(', ') : 'none'}
- Already completed: ${completed.length > 0 ? completed.join(', ') : 'none'}

The student must complete deliverables sequentially in this scenario. If they ask which one to do first, or whether the order matters, stay in your persona and redirect them to focus on the current deliverable (${current}). Do not say "pick whichever" or "doesn't matter, do them in any order." The system enforces this order.`;
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, from: 'student', text }]);
    setSending(true);
    try {
      const res = await fetch('/api/reps/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scenarioContext: buildEnrichedContext(),
          personas: scenario.personas,
          history: messages.map(m => ({ from: m.from, personaId: m.personaId, text: m.text })),
          userMessage: text,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { id: `e-${Date.now()}`, from: 'system', text: data.error || 'Something went wrong.' }]);
      } else if (data.replies && Array.isArray(data.replies)) {
        const newMsgs: ChatMsg[] = data.replies.map((r: any, i: number) => ({
          id: `p-${Date.now()}-${i}`,
          from: 'persona',
          personaId: r.personaId,
          text: r.text,
        }));
        setMessages(prev => [...prev, ...newMsgs]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, from: 'system', text: 'Connection error.' }]);
    } finally {
      setSending(false);
    }
  }

  async function handleFileUpload(file: File) {
    if (!activeArtifact) return;
    setUploadStatus('parsing');
    setUploadError(null);

    // Record the upload in chat history so when the user returns to this
    // session they can see what they submitted (filename only, no binary).
    setMessages(prev => [...prev, {
      id: `upload-${Date.now()}`,
      from: 'student',
      text: `Uploaded: ${file.name}`,
    }]);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('scenarioContext', scenario.context);
      fd.append('artifactPrompt', activeArtifact.prompt);
      fd.append('artifactRubric', activeArtifact.rubric);
      fd.append('artifactFormat', activeArtifact.format);
      fd.append('graderPersona', JSON.stringify(personaById(activeArtifact.requestedBy)));

      setUploadStatus('grading');
      const res = await fetch('/api/reps/grade', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        setUploadStatus('error');
        setUploadError(data.error || 'Grading failed.');
        return;
      }

      setUploadStatus('done');
      const justCompletedId = activeArtifact.id;
      const scores: Record<string, number> = data.scores || {};

      // Pass threshold: average score across all rubric dimensions must be
      // 6 or higher. Below that, the artifact stays open for revision, the
      // checkmark doesn't appear, and the workspace doesn't auto-advance.
      const scoreValues = Object.values(scores).filter((v): v is number => typeof v === 'number');
      const avgScore = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0;
      const passed = avgScore >= 6;

      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        from: 'persona',
        personaId: activeArtifact.requestedBy,
        text: data.feedback,
        artifactId: activeArtifact.id,
        scores,
      }]);

      if (passed) {
        setCompletedArtifacts(prev => {
          const next = new Set(prev);
          next.add(justCompletedId);
          return next;
        });
        const nextIdx = activeIdx + 1;
        if (nextIdx < scenario.artifacts.length) {
          setTimeout(() => {
            setActiveArtifactId(scenario.artifacts[nextIdx].id);
            setUploadStatus('idle');
          }, 1200);
        }
      } else {
        // Failed grade: stay on this artifact, let the user revise and resubmit.
        setTimeout(() => setUploadStatus('idle'), 800);
      }
    } catch (e: any) {
      setUploadStatus('error');
      setUploadError(e?.message || 'Upload failed.');
    }
  }

  function resetSession() {
    if (typeof window === 'undefined') return;
    if (!window.confirm('Reset this scenario? Your chat history and progress will be cleared.')) return;
    try {
      localStorage.removeItem(`offerbell_reps_session_${scenario.id}`);
    } catch {
      // ignore
    }
    // Also clear it in the cloud (fire-and-forget).
    {
      const { userId, sessionToken } = repsAuth();
      if (userId) {
        const client = repsClient();
        if (client) { try { void client.mutation(api.repsSessions.deleteSession, { userId, sessionToken, scenarioId: scenario.id }).catch(() => {}); } catch {} }
      }
    }
    const opening: ChatMsg[] = scenario.opening.map((o, i) => ({
      id: `open-${i}`,
      from: 'persona',
      personaId: o.personaId,
      text: o.text,
    }));
    setMessages(opening);
    setCompletedArtifacts(new Set());
    setActiveArtifactId(scenario.artifacts[0]?.id ?? null);
    setUploadStatus('idle');
    setUploadError(null);
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-h, 0px))', overflow: 'hidden', fontFamily: "'Sora',sans-serif" }}>

      {/* LEFT PANE: chat */}
      <section style={{ flex: '0 0 480px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <button type="button" onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                Exit session
              </button>
              <span style={{ color: 'var(--text-3)', fontSize: 11 }}>·</span>
              <button type="button" onClick={resetSession} title="Clear chat history and progress for this scenario" style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif" }}>
                Reset
              </button>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scenario.title}</div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {scenario.personas.map(p => (
              <div key={p.id} title={`${p.name}, ${p.title}, ${p.firm}`}>
                <PersonaAvatar persona={p} size={30} />
              </div>
            ))}
          </div>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map(m => {
            if (m.from === 'system') {
              return <div key={m.id} style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: '6px 0' }}>{m.text}</div>;
            }
            if (m.from === 'student') {
              return (
                <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '78%', background: 'var(--text)', color: 'var(--surface)', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
              );
            }
            const p = personaById(m.personaId);
            return (
              <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                {p ? <PersonaAvatar persona={p} size={30} /> : <div style={{ width: 30, height: 30 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p?.name || 'Persona'}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{p?.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  {m.scores && (
                    <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text-2)' }}>
                      {Object.entries(m.scores).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                          <span style={{ fontWeight: 700, color: 'var(--text)' }}>{v}/10</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {sending && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-3)', fontSize: 12 }}>
              <div style={{ width: 30, height: 30 }} />
              <span>Typing...</span>
            </div>
          )}
        </div>

        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask a clarifying question, or upload your work on the right"
              rows={1}
              style={{
                flex: 1, resize: 'none', padding: '10px 12px',
                border: '1.5px solid var(--border)', borderRadius: 10,
                background: 'var(--surface)', color: 'var(--text)',
                fontSize: 13, fontFamily: "'Sora',sans-serif",
                outline: 'none', maxHeight: 120, lineHeight: 1.5,
              }}
            />
            <button
              type="button" onClick={handleSend} disabled={!input.trim() || sending}
              style={{
                background: 'var(--text)', color: 'var(--surface)',
                border: 'none', padding: '10px 16px', borderRadius: 10,
                fontSize: 12, fontWeight: 700, cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !sending ? 1 : 0.4,
                fontFamily: "'Sora',sans-serif",
              }}
            >Send</button>
          </div>
        </div>
      </section>

      {/* RIGHT PANE: artifact workspace */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface)' }}>
        <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Workspace</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.3px' }}>
              · Deliverable {activeIdx + 1} of {scenario.artifacts.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {scenario.artifacts.map((a, idx) => {
              const unlocked = isUnlocked(idx);
              const isActive = a.id === activeArtifactId;
              const isDone = completedArtifacts.has(a.id);
              return (
                <button
                  key={a.id} type="button"
                  onClick={() => { if (unlocked) setActiveArtifactId(a.id); }}
                  disabled={!unlocked}
                  title={unlocked ? a.label : `Unlocks after you submit Deliverable ${idx}`}
                  style={{
                    padding: '5px 12px', fontSize: 11, fontWeight: 700,
                    border: '1.5px solid ' + (isActive ? 'var(--text)' : 'var(--border)'),
                    background: isActive ? 'var(--text)' : 'transparent',
                    color: isActive ? 'var(--surface)' : (unlocked ? 'var(--text-2)' : 'var(--text-3)'),
                    borderRadius: 7,
                    cursor: unlocked ? 'pointer' : 'not-allowed',
                    opacity: unlocked ? 1 : 0.55,
                    fontFamily: "'Sora',sans-serif",
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {!unlocked && <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
                  {a.label}
                  {isDone && <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
          <div style={{ maxWidth: 760 }}>

            {showSessionHelper && (
              <div style={{
                marginBottom: 22, padding: '16px 18px',
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 12, position: 'relative',
              }}>
                <button
                  type="button" onClick={dismissSessionHelper} aria-label="Dismiss"
                  style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 6 }}>How a session works</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, paddingRight: 20 }}>
                  Read the chat on the left, your team is briefing you. Build the deliverable below in your own tools (Excel, Word, PowerPoint), then upload the file here. The persona who asked for it will review it in the chat. If you have clarifying questions, ask them in chat and they'll respond.
                </div>
              </div>
            )}

            {!activeArtifact && (
              <div style={{ color: 'var(--text-3)', fontSize: 13 }}>No deliverable selected.</div>
            )}
            {activeArtifact && (
              <>
                {requestingPersona && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px',
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: 10, marginBottom: 18,
                  }}>
                    <PersonaAvatar persona={requestingPersona} size={32} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 2 }}>
                        {requestingPersona.name} is asking you to build
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{activeArtifact.label}</div>
                    </div>
                  </div>
                )}

                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Deliverable · {activeArtifact.format.toUpperCase()}</div>
                <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, lineHeight: 1.15, color: 'var(--text)', margin: 0, marginBottom: 18 }}>{activeArtifact.label}</h2>

                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 22 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{activeArtifact.prompt}</div>
                </div>

                <UploadBox
                  format={activeArtifact.format}
                  status={uploadStatus}
                  error={uploadError}
                  completed={completedArtifacts.has(activeArtifact.id)}
                  onFile={handleFileUpload}
                  fileInputRef={fileInputRef}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UploadBox
// ═══════════════════════════════════════════════════════════════════════════
function UploadBox({ format, status, error, completed, onFile, fileInputRef }: {
  format: string; status: UploadStatus; error: string | null; completed: boolean;
  onFile: (f: File) => void; fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const accept = {
    xlsx: '.xlsx,.xls,.xlsm',
    docx: '.docx',
    pdf: '.pdf',
    pptx: '.pptx',
  }[format as 'xlsx' | 'docx' | 'pdf' | 'pptx'] || '.*';

  const statusLabel = {
    idle: completed ? 'Resubmit revision' : 'Drop file or click to upload',
    parsing: 'Parsing file...',
    grading: 'Grading on craft...',
    done: 'Graded, feedback in chat',
    error: 'Upload failed',
  }[status];

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file" accept={accept}
        style={{ display: 'none' }}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault(); setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed ' + (dragOver ? 'var(--text)' : 'var(--border)'),
          borderRadius: 14,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: status === 'parsing' || status === 'grading' ? 'wait' : 'pointer',
          background: dragOver ? 'var(--surface)' : 'transparent',
          transition: 'border-color .15s, background .15s',
        }}
      >
        <div style={{ width: 44, height: 44, margin: '0 auto 14px', borderRadius: 11, background: 'var(--text)', color: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'parsing' || status === 'grading' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="14 8" opacity="0.6" /></svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{statusLabel}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{format.toUpperCase()} only, max 4 MB</div>
        {error && <div style={{ marginTop: 10, fontSize: 12, color: '#dc2626' }}>{error}</div>}
      </div>
    </div>
  );
}
