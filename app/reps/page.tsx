'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { REPS_TRACKS, REPS_SCENARIOS, type RepsTrackId, type Scenario, type Persona, type ArtifactSpec } from './reps-data';

// ─────────────────────────────────────────────────────────────────────────────
// Reps career-simulator page.
//
// Three top-level views:
//   1. Track grid: pick one of 10 careers
//   2. Scenario list: pick a workday scenario in that career
//   3. Session: chat panel on left, artifact workspace on right
//
// Personas drop opening messages. The student replies in chat OR uploads work.
// On upload, the file is parsed server-side, sent to the AI with the rubric,
// and the AI grades on craft. Feedback lands in chat in the persona's voice.
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

export default function RepsPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState<RepsTrackId | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) router.replace('/signin');
  }, [router]);

  const track = activeTrack ? REPS_TRACKS.find(t => t.id === activeTrack) : null;
  const scenarios = activeTrack ? REPS_SCENARIOS[activeTrack] : [];
  const scenario = activeScenarioId ? scenarios.find(s => s.id === activeScenarioId) : null;

  return (
    <div className="app">
      <Sidebar activePage="reps" />
      <main className="main" style={{ padding: scenario ? 0 : '32px 36px', maxWidth: scenario ? '100%' : 1200 }}>

        {!scenario && activeTrack && (
          <div style={{ marginBottom: 20, fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" onClick={() => { setActiveTrack(null); setActiveScenarioId(null); }} style={breadcrumbBtn}>Reps</button>
            {track && <>
              <span>/</span>
              <span style={{ color: 'var(--text)' }}>{track.title}</span>
            </>}
          </div>
        )}

        {!activeTrack && <TrackGrid onPick={(id) => setActiveTrack(id)} />}
        {activeTrack && !activeScenarioId && track && (
          <ScenarioList track={track} scenarios={scenarios} onPick={(id) => setActiveScenarioId(id)} />
        )}
        {scenario && (
          <SessionView key={scenario.id} scenario={scenario} onExit={() => setActiveScenarioId(null)} />
        )}
      </main>
    </div>
  );
}

const breadcrumbBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--text-3)',
  cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontSize: 12, padding: 0,
};

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
// WelcomeBanner
// ═══════════════════════════════════════════════════════════════════════════
function WelcomeBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div style={{
      marginBottom: 28,
      padding: '22px 26px',
      border: '1.5px solid var(--border)',
      background: 'var(--surface)',
      borderRadius: 14,
      position: 'relative',
    }}>
      <button
        type="button" onClick={onDismiss} aria-label="Dismiss"
        style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 6 }}>How Reps work</div>
      <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.55, marginBottom: 16, maxWidth: 620 }}>
        Reps put you in a junior seat on a real workday. Personas message you, you build the actual deliverable, and the AI grades the file on craft, citing specific cells, numbers, and lines.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        {[
          { n: '1', title: 'Pick a career', body: 'Choose from 10 finance careers: IB, PE, consulting, restructuring, S&T, AM, VC, RE, ER, audit.' },
          { n: '2', title: 'Choose a scenario', body: 'Three workday scenarios per career, ranging from intro to advanced. Pick the one that matches where you are.' },
          { n: '3', title: 'Do the work', body: 'Build the deliverable in your own tools (Excel, Word, PowerPoint), upload it, and get graded on craft.' },
        ].map(s => (
          <div key={s.n} style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', color: 'var(--text-3)', marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.5 }}>{s.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEW 1: Track grid
// ═══════════════════════════════════════════════════════════════════════════
function TrackGrid({ onPick }: { onPick: (id: RepsTrackId) => void }) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem('offerbell_reps_welcomed');
    if (!dismissed) setShowWelcome(true);
  }, []);

  function dismissWelcome() {
    setShowWelcome(false);
    if (typeof window !== 'undefined') localStorage.setItem('offerbell_reps_welcomed', '1');
  }

  return (
    <>
      <header style={{ marginBottom: 36, paddingBottom: 26, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 10 }}>Reps</div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 46, lineHeight: 1.04, letterSpacing: '-0.6px', color: 'var(--text)', margin: 0, marginBottom: 12 }}>
          Live a day in <em style={{ fontStyle: 'italic' }}>the career.</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 640, margin: 0 }}>
          Drop into a realistic workday. Take pings from your MD, your client, your investment committee. Build the actual work, comps, models, memos, slides, and get graded on craft.
        </p>
      </header>

      {showWelcome && <WelcomeBanner onDismiss={dismissWelcome} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {REPS_TRACKS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onPick(t.id)}
            style={{
              textAlign: 'left', padding: '22px 24px',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              borderRadius: 14, cursor: 'pointer',
              transition: 'border-color .15s, transform .15s',
              fontFamily: "'Sora',sans-serif",
              display: 'flex', flexDirection: 'column', gap: 12, minHeight: 168,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Instrument Serif',serif", fontSize: 18, fontStyle: 'italic' }}>
                {t.abbr}
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>{REPS_SCENARIOS[t.id]?.length || 0} scenarios</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{t.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>{t.tagline}</div>
            </div>
          </button>
        ))}
      </div>
    </>
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
  const s = FORMAT_PILL_STYLE[format] || { bg: 'var(--bg)', fg: 'var(--text-2)' };
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '.5px',
      padding: '2px 6px', borderRadius: 4,
      background: s.bg, color: s.fg,
      textTransform: 'uppercase',
    }}>{format}</span>
  );
}

const DIFFICULTY_ORDER: Record<string, number> = {
  'Intro': 0,
  'Intermediate': 1,
  'Advanced': 2,
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEW 2: Scenario list
// ═══════════════════════════════════════════════════════════════════════════
function ScenarioList({ track, scenarios, onPick }: { track: typeof REPS_TRACKS[number]; scenarios: Scenario[]; onPick: (id: string) => void; }) {
  // Sort by difficulty ascending (Intro first, Advanced last). Stable order
  // within a difficulty preserves the source order from reps-data.ts.
  const sortedScenarios = useMemo(() => {
    return [...scenarios].sort((a, b) => {
      const da = DIFFICULTY_ORDER[a.difficulty] ?? 99;
      const db = DIFFICULTY_ORDER[b.difficulty] ?? 99;
      return da - db;
    });
  }, [scenarios]);

  return (
    <>
      <header style={{ marginBottom: 28, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: track.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Instrument Serif',serif", fontSize: 22, fontStyle: 'italic' }}>
            {track.abbr}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, lineHeight: 1.05, color: 'var(--text)', margin: 0, marginBottom: 4 }}>
              {track.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{track.tagline}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 660, margin: 0, marginBottom: 14 }}>{track.description}</p>
        <div style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.55, maxWidth: 660 }}>
          Scenarios are ordered by difficulty. Start with an Intro or Intermediate scenario if it's your first time in this career.
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sortedScenarios.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            style={{
              textAlign: 'left', padding: '20px 24px',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              borderRadius: 12, cursor: 'pointer',
              transition: 'border-color .15s',
              fontFamily: "'Sora',sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
                <span style={metaTag}>{s.timeframe}</span>
                <span style={dotSep} />
                <span style={metaTag}>{s.duration}</span>
                <span style={dotSep} />
                <span style={{ ...metaTag, color: difficultyColor(s.difficulty) }}>{s.difficulty}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 10 }}>{s.summary}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-2)', fontWeight: 600 }}>{whatYoullBuild(s)}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {s.artifacts.map(a => <FormatPill key={a.id} format={a.format} />)}
                </div>
              </div>
            </div>
            <svg width="18" height="18" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </div>
    </>
  );
}

const metaTag: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' };
const dotSep: React.CSSProperties = { width: 3, height: 3, borderRadius: '50%', background: 'var(--text-3)' };

function difficultyColor(d: string): string {
  if (d === 'Intro') return '#166534';
  if (d === 'Advanced') return '#991b1b';
  return '#854d0e';
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

  useEffect(() => {
    const opening: ChatMsg[] = scenario.opening.map((o, i) => ({
      id: `open-${i}`,
      from: 'persona',
      personaId: o.personaId,
      text: o.text,
    }));
    setMessages(opening);
  }, [scenario]);

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
          scenarioContext: scenario.context,
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
      setCompletedArtifacts(prev => {
        const next = new Set(prev);
        next.add(justCompletedId);
        return next;
      });

      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        from: 'persona',
        personaId: activeArtifact.requestedBy,
        text: data.feedback,
        artifactId: activeArtifact.id,
        scores: data.scores,
      }]);

      const nextIdx = activeIdx + 1;
      if (nextIdx < scenario.artifacts.length) {
        setTimeout(() => {
          setActiveArtifactId(scenario.artifacts[nextIdx].id);
          setUploadStatus('idle');
        }, 1200);
      }
    } catch (e: any) {
      setUploadStatus('error');
      setUploadError(e?.message || 'Upload failed.');
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Sora',sans-serif" }}>

      {/* LEFT PANE: chat */}
      <section style={{ flex: '0 0 480px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ minWidth: 0 }}>
            <button type="button" onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              Exit session
            </button>
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
