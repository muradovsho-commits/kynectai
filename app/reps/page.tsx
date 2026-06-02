'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css'; // global color vars + full-screen session theming
import './desk.css'; // The Desk landing + scenario-list chrome
import { REPS_TRACKS, REPS_SCENARIOS, type RepsTrackId, type Scenario, type Persona, type ArtifactSpec } from './reps-data';

// ─────────────────────────────────────────────────────────────────────────────
// The Desk — career simulator.
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
        <Sidebar activePage="reps" />
        <main className="desk-canvas"><div className="desk-page" /></main>
      </div>
    );
  }

  // Paywall: anything that isn't Elite.
  if (planStatus === 'gated') {
    return (
      <div className="desk-app">
        <Sidebar activePage="reps" />
        <main className="desk-canvas">
          <div className="desk-page">
            <div className="desk-page-inner">
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
        <Sidebar activePage="reps" />
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
      <Sidebar activePage="reps" />
      <main className="desk-canvas">
        <div className="desk-page">
          <div className="desk-page-inner">
            <header className="desk-head">
              <div className="desk-eyebrow">The Desk</div>
              <h1 className="desk-title">
                {track
                  ? <>Live a day in <em>{track.title}</em>.</>
                  : <>Live a day in <em>the seat</em>.</>}
              </h1>
              <p className="desk-sub">
                {track
                  ? 'Pick a workday scenario below. Build the deliverable, upload it, and get graded on craft against the rubric an MD would actually use. Switch career from the Industry selector in the sidebar.'
                  : 'The Desk drops you into a junior seat on a real workday. Choose your career from the Industry selector in the sidebar to begin.'}
              </p>
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

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '40px 0 80px', fontFamily: "'Sora', sans-serif" }}>

      {/* ─── Two-column hero ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 48, alignItems: 'center', marginBottom: 48 }} className="paywall-hero">
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 11px', marginBottom: 18,
            background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
            Elite plan
          </div>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 52, lineHeight: 1.02, letterSpacing: '-1px',
            color: 'var(--text)', margin: 0, marginBottom: 18, fontWeight: 400,
          }}>
            The Desk is <em style={{ fontStyle: 'italic' }}>where you</em><br/>
            <em style={{ fontStyle: 'italic' }}>actually</em> work.
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 520 }}>
            {isPro
              ? "You're on Pro - Coach, Mock Interviews, Resume Review, Outreach. The Desk sits one tier above. You're dropped into a junior seat on a real workday. Personas message you. You build the actual deliverable. The AI grades it line by line."
              : 'The Desk drops you into a junior seat on a real workday. Personas message you in the voice of MDs and senior associates. You build the actual deliverable in Excel, Word, or PowerPoint. The AI grades the file itself.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => { window.location.href = '/checkout?plan=elite'; }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'var(--text)', color: 'var(--surface)',
                border: 'none', padding: '12px 22px', borderRadius: 10,
                fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
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
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Compare plans
            </button>
          </div>
        </div>

        {/* ─── Visual mockup: persona ping + deliverable card ─── */}
        <div style={{ position: 'relative', minHeight: 320 }} className="paywall-visual">
          {/* Faux app workspace */}
          <div style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 16, padding: '18px 20px',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          }}>
            {/* Tab strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', opacity: 0.5 }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.5 }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', opacity: 0.5 }} />
              <span style={{ marginLeft: 12, fontSize: 10.5, color: 'var(--text-3)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>IB &middot; LBO build</span>
            </div>

            {/* Persona message */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 12, fontWeight: 700,
                fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
              }}>AL</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Anna Liu</span>
                  <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>VP, Industrials</span>
                </div>
                <div style={{
                  background: 'var(--surface-2)', borderRadius: 10,
                  padding: '10px 12px',
                  fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5,
                }}>
                  Need the LBO model by EOD - 5-year hold, 6.5x entry, 60% leverage. Sources &amp; uses on tab 1, returns on tab 3.
                </div>
              </div>
            </div>

            {/* Deliverable card */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 14,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(34, 197, 94, 0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 1 }}>Industrials_LBO_v3.xlsx</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Uploaded &middot; Graded</div>
              </div>
              <div style={{
                padding: '3px 8px', borderRadius: 100,
                background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e',
                fontSize: 10, fontWeight: 700,
              }}>88 / 100</div>
            </div>

            {/* Grading feedback */}
            <div style={{
              padding: '10px 12px', borderRadius: 8,
              background: 'var(--surface-2)',
              borderLeft: '3px solid #22c55e',
              fontSize: 11, color: 'var(--text-3)', lineHeight: 1.55,
            }}>
              <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>Strong:</span> Sources &amp; Uses ties at <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-2)' }}>B14</span>. <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>Watch:</span> Tax shield missing in FCF on tab 2 row 23.
            </div>
          </div>
        </div>
      </div>

      {/* ─── Feature grid ─── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4,
          textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 18,
        }}>What's included</div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {[
            {
              title: '10 careers, 30 scenarios',
              body: 'IB, PE, consulting, restructuring, S&T, AM, VC, RE, ER, audit. Intro, intermediate, and advanced workdays in each.',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              ),
            },
            {
              title: 'Real deliverables, real grading',
              body: 'Build the comp sheet, the LBO, the IC memo, the DCF in Excel, Word, or PowerPoint. Upload it. The AI grades the file itself, line by line.',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg>
              ),
            },
            {
              title: 'Multi-persona pings',
              body: 'MDs, partners, VPs, senior associates message you in the voice of the seat. Push back, ask questions, defend your numbers.',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ),
            },
          ].map(item => (
            <div key={item.title} style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 14, padding: '20px 22px',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'rgba(37, 99, 235, 0.10)', color: '#3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>{item.body}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .paywall-hero { grid-template-columns: 1fr !important; gap: 32px !important; }
          .paywall-visual { order: -1; }
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
function whatYoullBuild(scenario: Scenario): string {
  const labels = scenario.artifacts.map(a => a.label);
  if (labels.length === 0) return '';
  if (labels.length === 1) return `Build the ${labels[0]}.`;
  if (labels.length === 2) return `Build the ${labels[0]} and ${labels[1]}.`;
  return `Build the ${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}.`;
}

const FORMAT_PILL_STYLE: Record<string, { bg: string; fg: string }> = {
  xlsx: { bg: '#dcfce7', fg: '#166534' },
  docx: { bg: '#dbeafe', fg: '#1e40af' },
  pptx: { bg: '#fee2e2', fg: '#991b1b' },
  pdf:  { bg: '#fef3c7', fg: '#854d0e' },
};

function FormatPill({ format }: { format: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '.6px',
      padding: '3px 7px', borderRadius: 5,
      background: 'transparent', color: 'var(--text-2)',
      border: '1px solid var(--border-2)',
      textTransform: 'uppercase',
    }}>{format}</span>
  );
}

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
function DeskHowTo({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="desk-howto">
      <button type="button" className="desk-howto-x" onClick={onDismiss} aria-label="Dismiss">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      <div className="desk-howto-eyebrow">How a workday works</div>
      <div className="desk-howto-body">
        You drop into a junior seat. Personas message you in the voice of MDs and senior associates, you build the actual deliverable in your own tools, and the AI grades the file on craft, citing specific cells, numbers, and lines.
      </div>
      <div className="desk-howto-steps">
        {[
          { n: '1', title: 'Pick a scenario', body: 'Choose a workday below, ordered from intro to advanced.' },
          { n: '2', title: 'Do the work', body: 'Build it in Excel, Word, or PowerPoint and upload the file.' },
          { n: '3', title: 'Get graded', body: 'The persona reviews your file and pushes back in chat.' },
        ].map(s => (
          <div key={s.n} className="desk-howto-step">
            <div className="desk-howto-step-n">{s.n}</div>
            <div className="desk-howto-step-title">{s.title}</div>
            <div className="desk-howto-step-body">{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Scenario list — scenarios for the career selected in the sidebar
// ═══════════════════════════════════════════════════════════════════════════
function ScenarioList({ track, scenarios, onPick }: { track: typeof REPS_TRACKS[number]; scenarios: Scenario[]; onPick: (id: string) => void; }) {
  const [showHowTo, setShowHowTo] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_reps_welcomed')) setShowHowTo(true);
  }, []);

  function dismissHowTo() {
    setShowHowTo(false);
    if (typeof window !== 'undefined') localStorage.setItem('offerbell_reps_welcomed', '1');
  }

  // Sort by difficulty ascending (Intro first). Stable within a difficulty.
  const sortedScenarios = useMemo(() => {
    return [...scenarios].sort((a, b) => {
      const da = DIFFICULTY_ORDER[a.difficulty] ?? 99;
      const db = DIFFICULTY_ORDER[b.difficulty] ?? 99;
      return da - db;
    });
  }, [scenarios]);

  return (
    <div className="desk-tab-pane">
      {showHowTo && <DeskHowTo onDismiss={dismissHowTo} />}

      <div className="desk-scn-list">
        {sortedScenarios.map(s => (
          <button key={s.id} type="button" className="desk-scn-card" onClick={() => onPick(s.id)}>
            <div className="desk-scn-main">
              <div className="desk-scn-meta">
                <span className="desk-scn-tag">{s.timeframe}</span>
                <span className="desk-scn-dot" />
                <span className="desk-scn-tag">{s.duration}</span>
                <span className="desk-scn-dot" />
                <span className={`desk-scn-tag ${difficultyClass(s.difficulty)}`}>{s.difficulty}</span>
              </div>
              <div className="desk-scn-title">{s.title}</div>
              <div className="desk-scn-summary">{s.summary}</div>
              <div className="desk-scn-build">
                <span className="desk-scn-build-text">{whatYoullBuild(s)}</span>
                <span className="desk-scn-fmts">
                  {s.artifacts.map(a => <FormatPill key={a.id} format={a.format} />)}
                </span>
              </div>
            </div>
            <svg className="desk-scn-chev" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </div>
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
    const storageKey = `offerbell_reps_session_${scenario.id}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const fresh = Date.now() - (data.updatedAt || 0) < 90 * 24 * 60 * 60 * 1000;
        if (fresh && Array.isArray(data.messages) && data.messages.length > 0) {
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

  // Save session state to localStorage on every change. Debouncing isn't
  // strictly necessary at this scale, and localStorage writes are sync, but
  // we skip empty-state writes to avoid clobbering a real session during the
  // brief moment between mount and the restore-or-init effect above.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length === 0) return;
    const storageKey = `offerbell_reps_session_${scenario.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        messages,
        completedArtifacts: Array.from(completedArtifacts),
        activeArtifactId,
        updatedAt: Date.now(),
      }));
    } catch {
      // Quota exceeded or storage unavailable. Silently drop.
    }
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Sora',sans-serif" }}>

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
