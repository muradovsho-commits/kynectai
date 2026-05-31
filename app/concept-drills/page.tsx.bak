// Build: v5-quiet-editorial
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useIsPro } from '../lib/usePlan';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './drills.css';
import { TRACKS as DRILL_TRACKS, DrillQ } from './drill-data';

type MCQ = { q: string; scenario?: string; category: string; difficulty?: string; options: string[]; correct: number; explanation: string };
type TrackDef = { title: string; desc: string; icon: string; iconClass: string; topics: string[]; questions: DrillQ[] };

const TRACKS: Record<string, TrackDef> = DRILL_TRACKS;
const TRACK_KEYS = Object.keys(TRACKS);
const DRILL_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function drillToMCQ(d: DrillQ): MCQ {
  return { q: d.q, scenario: d.scenario, category: d.topic, difficulty: d.difficulty, options: d.options, correct: d.correct, explanation: d.explanation };
}

function toRoman(n: number): string {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of map) { while (n >= v) { out += s; n -= v; } }
  return out;
}

type Phase = 'landing' | 'topics' | 'drilling' | 'done';

// Per-track visual theme. Hue is applied subtly (icon tint + left accent
// stripe) so the grid reads as a system, not a kaleidoscope.
const TRACK_THEME: Record<string, { color: string; bg: string }> = {
  ib:         { color: '#2563eb', bg: 'rgba(37, 99, 235, 0.10)' },   // blue
  pe:         { color: '#16a34a', bg: 'rgba(22, 163, 74, 0.10)' },   // green
  consulting: { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.10)' },  // purple
  accounting: { color: '#ea580c', bg: 'rgba(234, 88, 12, 0.10)' },   // orange
  am:         { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.10)' },   // red
  st:         { color: '#0891b2', bg: 'rgba(8, 145, 178, 0.10)' },   // cyan
  er:         { color: '#d97706', bg: 'rgba(217, 119, 6, 0.10)' },   // amber
  re:         { color: '#0d9488', bg: 'rgba(13, 148, 136, 0.10)' },  // teal
  rx:         { color: '#475569', bg: 'rgba(71, 85, 105, 0.14)' },   // slate
  vc:         { color: '#c026d3', bg: 'rgba(192, 38, 211, 0.10)' },  // magenta
};

function TrackIcon({ name, color }: { name: string; color: string }) {
  const common = { width: 18, height: 18, fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'briefcase': return <svg viewBox="0 0 24 24" {...common}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'layers':    return <svg viewBox="0 0 24 24" {...common}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case 'box':       return <svg viewBox="0 0 24 24" {...common}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
    case 'file':      return <svg viewBox="0 0 24 24" {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'chart':     return <svg viewBox="0 0 24 24" {...common}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
    case 'pulse':     return <svg viewBox="0 0 24 24" {...common}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case 'search':    return <svg viewBox="0 0 24 24" {...common}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'home':      return <svg viewBox="0 0 24 24" {...common}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'alert':     return <svg viewBox="0 0 24 24" {...common}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case 'rocket':    return <svg viewBox="0 0 24 24" {...common}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/></svg>;
    default:          return <svg viewBox="0 0 24 24" {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// Confirmation modal used for both per-track and all-track progress resets.
// target === 'all' triggers a global wipe; any other string is a track key.
function ResetModal({ target, onCancel, onConfirm }: { target: string; onCancel: () => void; onConfirm: () => void }) {
  const isAll = target === 'all';
  const trackName = !isAll && TRACKS[target] ? TRACKS[target].title : '';
  return (
    <div onClick={onCancel} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', border: '1.5px solid var(--border)',
        borderRadius: 14, padding: 24,
        width: 420, maxWidth: '100%',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#dc2626', marginBottom: 10 }}>
          Reset {isAll ? 'all progress' : `${trackName} progress`}
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.3px', color: 'var(--text)', marginBottom: 12 }}>
          Are you <em style={{ fontStyle: 'italic' }}>sure?</em>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 22 }}>
          {isAll
            ? 'This deletes every drill stat and accuracy score across all 10 tracks. Your question bank and topics stay intact, but past performance is gone. This cannot be undone.'
            : `This deletes every drill stat and accuracy score for ${trackName}. Other tracks are unaffected. Your question bank and topics stay intact. This cannot be undone.`}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} type="button" style={{
            flex: 1, padding: '10px', borderRadius: 9,
            background: 'transparent', color: 'var(--text-2)',
            border: '1.5px solid var(--border-2)',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}>Cancel</button>
          <button onClick={onConfirm} type="button" style={{
            flex: 1, padding: '10px', borderRadius: 9,
            background: '#dc2626', color: '#fff',
            border: 'none',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default function ConceptDrillsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ConceptDrillsContent />
    </Suspense>
  );
}

function ConceptDrillsContent() {
  const searchParams = useSearchParams();
  const isPro = useIsPro();
  const [phase, setPhase] = useState<Phase>('landing');
  const [trackKey, setTrackKey] = useState('ib');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [history, setHistory] = useState<{ q: string; correct: boolean; explanation: string; topic: string }[]>([]);
  const [activeTopic, setActiveTopic] = useState('All Topics');

  // Per-track or all-track reset modal. null = closed.
  // 'all' = reset every track. trackKey string = reset just that track.
  const [resetTarget, setResetTarget] = useState<'all' | string | null>(null);
  // Bumped after a reset wipes localStorage so the next render reads fresh
  // (empty) trackStats from disk.
  const [resetTick, setResetTick] = useState(0);
  // Plan + userId so we can (1) hide reset for free users and
  // (2) persist resets to Convex so they survive logout/login.
  const [userId, setUserId] = useState<string>('');
  const saveProgressMut = useMutation((api as any).progress?.saveProgress);
  const canReset = isPro;

  const doReset = async () => {
    if (resetTarget === null) return;
    // Build the payload that mirrors the localStorage wipe. saveProgress
    // merges new values over old, so setting a key to "{}" effectively
    // erases that progress server-side too.
    const payload: Record<string, string> = {};
    try {
      if (resetTarget === 'all') {
        for (const k of TRACK_KEYS) {
          localStorage.removeItem(`offerbell_flash_perf_${k}`);
          payload[`offerbell_flash_perf_${k}`] = '{}';
        }
      } else {
        localStorage.removeItem(`offerbell_flash_perf_${resetTarget}`);
        payload[`offerbell_flash_perf_${resetTarget}`] = '{}';
      }
    } catch {}
    // Persist the wipe to Convex so logout/login doesn't restore old values.
    if (userId && saveProgressMut && Object.keys(payload).length > 0) {
      try { await saveProgressMut({ userId, data: JSON.stringify(payload) }); } catch {}
    }
    setResetTarget(null);
    setResetTick(t => t + 1);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    setUserId(localStorage.getItem('offerbell_user_id') || '');

    // Handle URL params from cross-feature links (e.g. diagnostic review)

    // Handle URL params from cross-feature links (e.g. diagnostic review)
    const paramTrack = searchParams.get('track');
    const paramTopic = searchParams.get('topic');
    if (paramTrack && TRACKS[paramTrack]) {
      setTrackKey(paramTrack);
      if (paramTopic) {
        const t = TRACKS[paramTrack];
        const topicExists = t.topics.includes(paramTopic) || t.questions.some(q => q.topic === paramTopic);
        if (topicExists) {
          setActiveTopic(paramTopic);
          // Auto-navigate to topics view so user can start drilling
          setPhase('topics');
        } else {
          setPhase('topics');
        }
      } else {
        setPhase('topics');
      }
    }
  }, [searchParams]);

  const track = TRACKS[trackKey];

  const startDrill = (topic: string) => {
    setActiveTopic(topic);
    const allQs = track.questions;
    const pool = topic === 'All Topics' ? allQs : allQs.filter(q => q.topic === topic);
    const source = pool.length > 0 ? pool : allQs;
    // Free users get 5 questions per drill, paid get full DRILL_SIZE.
    // isPro reads server truth via useIsPro hook (Convex-backed).
    const size = isPro ? DRILL_SIZE : 5;
    const picked = shuffle(source).slice(0, size).map(drillToMCQ);
    setQuestions(picked);
    setIdx(0); setSelected(null); setShowExp(false);
    setScore(0); setCorrect(0); setWrong(0); setHistory([]);
    setPhase('drilling');
  };

  const handleSelect = (ci: number) => {
    if (selected !== null) return;
    setSelected(ci); setShowExp(true);
    const q = questions[idx]; const ok = ci === q.correct;
    if (ok) { setScore(s => s + 10); setCorrect(c => c + 1); }
    else { setWrong(w => w + 1); }
    setHistory(h => [...h, { q: q.q, correct: ok, explanation: q.explanation, topic: q.category }]);
    try {
      const cdPerfKey = `offerbell_flash_perf_${trackKey}`;
      const raw = localStorage.getItem(cdPerfKey);
      const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
      p.seen = (p.seen || 0) + 1;
      if (ok) p.pass = (p.pass || 0) + 1; else p.fail = (p.fail || 0) + 1;
      const cat = q.category;
      if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
      p.byCat[cat].seen++;
      if (ok) p.byCat[cat].pass++;
      localStorage.setItem(cdPerfKey, JSON.stringify(p));
    } catch {}
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setPhase('done'); return; }
    setIdx(i => i + 1); setSelected(null); setShowExp(false);
  };

  const q = questions[idx];
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  // ══════════════ LANDING ══════════════
  // ─────────────────────────────── shared atoms
  const PAGE_OUTER: React.CSSProperties = { padding: '32px 36px 80px' };
  const PAGE_INNER: React.CSSProperties = { maxWidth: 960, margin: '0 auto', fontFamily: "'Sora', sans-serif" };
  const EYEBROW: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)' };
  const SERIF_TITLE_SM: React.CSSProperties = { fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.8px', color: 'var(--text)', fontWeight: 400, margin: 0 };
  const CARD: React.CSSProperties = { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 };
  const BACK_LINK: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 7, background: 'transparent', border: '1.5px solid transparent', color: 'var(--text-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginLeft: -10 };

  // ═══════════════════════════════════════════════════════════════
  //   PHASE 1 - LANDING (track picker)
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'landing') {
    const trackStats: Record<string, { seen: number; pass: number; pct: number }> = {};
    let totalSeen = 0;
    let totalPass = 0;
    if (typeof window !== 'undefined') {
      for (const k of TRACK_KEYS) {
        try {
          const raw = localStorage.getItem(`offerbell_flash_perf_${k}`);
          if (raw) {
            const p = JSON.parse(raw);
            const seen = p.seen || 0;
            const pass = p.pass || 0;
            trackStats[k] = { seen, pass, pct: seen > 0 ? Math.round((pass / seen) * 100) : 0 };
            totalSeen += seen;
            totalPass += pass;
          } else {
            trackStats[k] = { seen: 0, pass: 0, pct: 0 };
          }
        } catch { trackStats[k] = { seen: 0, pass: 0, pct: 0 }; }
      }
    }
    const overallPct = totalSeen > 0 ? Math.round((totalPass / totalSeen) * 100) : 0;

    return (
      <div className="app">
        <Sidebar activePage="concept-drills" />
        <main className="main" style={PAGE_OUTER}>
          <div style={PAGE_INNER}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ ...EYEBROW, marginBottom: 10 }}>Practice</div>
              <h1 style={SERIF_TITLE_SM}>Concept <em style={{ fontStyle: 'italic' }}>drills</em></h1>
              <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
                Ten multiple-choice questions per round, drawn from the track you pick. Pass rates stay visible so you know where to come back.
              </p>
            </div>

            {/* Stats strip - only shows once user has any activity */}
            {totalSeen > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 28,
                padding: '14px 18px', marginBottom: 24,
                ...CARD,
              }}>
                <div>
                  <div style={{ ...EYEBROW, fontSize: 9.5, marginBottom: 3 }}>Questions</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.4px', lineHeight: 1 }}>{totalSeen}</div>
                </div>
                <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
                <div>
                  <div style={{ ...EYEBROW, fontSize: 9.5, marginBottom: 3 }}>Accuracy</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: overallPct >= 70 ? '#22c55e' : overallPct >= 50 ? '#f59e0b' : 'var(--text)', letterSpacing: '-0.4px', lineHeight: 1 }}>
                    {overallPct}<span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>%</span>
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Pass rate {totalPass} of {totalSeen}</div>
              </div>
            )}

            {/* Track list - dense 2-col grid */}
            <div key={`tracks-${resetTick}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
              {TRACK_KEYS.map((k) => {
                const t = TRACKS[k];
                const theme = TRACK_THEME[k] || { color: 'var(--text-2)', bg: 'var(--surface-2)' };
                const stats = trackStats[k] || { seen: 0, pass: 0, pct: 0 };
                return (
                  <button
                    key={k}
                    onClick={() => { setTrackKey(k); setPhase('topics'); }}
                    type="button"
                    className="cd-row"
                    style={{
                      ...CARD,
                      textAlign: 'left',
                      padding: '16px 18px',
                      cursor: 'pointer',
                      fontFamily: "'Sora', sans-serif",
                      display: 'flex', flexDirection: 'column', gap: 10,
                      transition: 'border-color 0.15s ease, transform 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: theme.color, flexShrink: 0 }} aria-hidden />
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', flex: 1 }}>{t.title}</div>
                      {stats.seen > 0 && (
                        <div style={{
                          fontSize: 10.5, fontWeight: 700,
                          padding: '2px 8px', borderRadius: 100,
                          color: stats.pct >= 70 ? '#22c55e' : stats.pct >= 50 ? '#f59e0b' : '#dc2626',
                          background: stats.pct >= 70 ? 'rgba(34, 197, 94, 0.10)' : stats.pct >= 50 ? 'rgba(245, 158, 11, 0.10)' : 'rgba(220, 38, 38, 0.10)',
                        }}>{stats.pct}%</div>
                      )}
                    </div>
                    <div style={{
                      fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>{t.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
                      <span>{t.topics.length} topics</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--text-2)' }}>
                        {stats.seen > 0 ? 'Drill again' : 'Start'}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {totalSeen > 0 && canReset && (
              <div style={{ marginTop: 28, textAlign: 'center' }}>
                <button onClick={() => setResetTarget('all')} type="button" style={{
                  background: 'transparent', border: 'none',
                  fontSize: 11.5, color: 'var(--text-3)',
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                  padding: '6px 10px', borderRadius: 6,
                  textDecoration: 'underline', textUnderlineOffset: 3,
                  textDecorationColor: 'var(--border-2)',
                }}>Reset all drill progress</button>
              </div>
            )}

          </div>
          {resetTarget !== null && (
            <ResetModal target={resetTarget} onCancel={() => setResetTarget(null)} onConfirm={doReset} />
          )}
          <style>{`
            .cd-row:hover { border-color: var(--border-2) !important; transform: translateY(-1px); }
            .cd-topic-card:hover { border-color: var(--border-2) !important; background: var(--surface-2) !important; }
            .cd-choice-btn:not(:disabled):hover { border-color: var(--border-2) !important; background: var(--surface-2) !important; }
          `}</style>
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  //   PHASE 2 - TOPIC PICKER
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'topics') {
    const theme = TRACK_THEME[trackKey] || { color: 'var(--text-2)', bg: 'var(--surface-2)' };
    return (
      <div className="app">
        <Sidebar activePage="concept-drills" />
        <main className="main" style={PAGE_OUTER}>
          <div style={{ ...PAGE_INNER, maxWidth: 760 }}>

            <button onClick={() => setPhase('landing')} type="button" style={BACK_LINK}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              All tracks
            </button>

            {/* Header */}
            <div style={{ margin: '14px 0 24px' }}>
              <div style={{ ...EYEBROW, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.color }} />
                {track.title}
              </div>
              <h1 style={SERIF_TITLE_SM}>Pick a <em style={{ fontStyle: 'italic' }}>topic</em></h1>
              <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.55, margin: '10px 0 0' }}>
                Ten questions drawn from the topic you pick. New random set each time.
              </p>
            </div>

            {/* All topics - featured */}
            <button
              onClick={() => startDrill('All Topics')}
              type="button"
              className="cd-topic-card"
              style={{
                width: '100%', textAlign: 'left',
                padding: '16px 20px', marginBottom: 12,
                ...CARD,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                fontFamily: "'Sora', sans-serif",
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: theme.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="16" height="16" fill="none" stroke={theme.color} strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>All topics</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Random mix across all {track.topics.length} topics</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {/* Individual topics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
              {track.topics.map((topic, i) => {
                return (
                  <button
                    key={topic}
                    onClick={() => startDrill(topic)}
                    type="button"
                    className="cd-topic-card"
                    style={{
                      textAlign: 'left',
                      padding: '14px 16px',
                      ...CARD,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12,
                      fontFamily: "'Sora', sans-serif",
                      transition: 'border-color 0.15s ease, background 0.15s ease',
                    }}
                  >
                    <span style={{
                      fontFamily: "'Instrument Serif', serif", fontStyle: 'italic',
                      fontSize: 18, color: theme.color, minWidth: 22, flexShrink: 0,
                    }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{topic}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                );
              })}
            </div>

            {(() => {
              if (!canReset) return null;
              let hasTrackData = false;
              try { hasTrackData = !!localStorage.getItem(`offerbell_flash_perf_${trackKey}`); } catch {}
              if (!hasTrackData) return null;
              return (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                  <button onClick={() => setResetTarget(trackKey)} type="button" style={{
                    background: 'transparent', border: 'none',
                    fontSize: 11.5, color: 'var(--text-3)',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                    padding: '6px 10px', borderRadius: 6,
                    textDecoration: 'underline', textUnderlineOffset: 3,
                    textDecorationColor: 'var(--border-2)',
                  }}>Reset {track.title} progress</button>
                </div>
              );
            })()}

          </div>
          {resetTarget !== null && (
            <ResetModal target={resetTarget} onCancel={() => setResetTarget(null)} onConfirm={doReset} />
          )}
          <style>{`
            .cd-topic-card:hover { border-color: var(--border-2) !important; background: var(--surface-2) !important; }
            .cd-choice-btn:not(:disabled):hover { border-color: var(--border-2) !important; background: var(--surface-2) !important; }
          `}</style>
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  //   PHASE 3 - DRILLING
  // ═══════════════════════════════════════════════════════════════
  if (phase === 'drilling' && q) {
    const theme = TRACK_THEME[trackKey] || { color: 'var(--text-2)', bg: 'var(--surface-2)' };
    const progressPct = ((idx) / questions.length) * 100;
    const isCorrect = selected === q.correct;
    return (
      <div className="app">
        <Sidebar activePage="concept-drills" />
        <main className="main" style={PAGE_OUTER}>
          <div style={{ ...PAGE_INNER, maxWidth: 760 }}>

            {/* Top bar: breadcrumb + score + end */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, marginBottom: 14, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.color, display: 'inline-block' }} />
                <span>{track.title}</span>
                <span style={{ color: 'var(--border-2)' }}>/</span>
                <span style={{ color: 'var(--text-2)' }}>{activeTopic}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text)' }}>{score}</span> pts &middot;{' '}
                  <span style={{ color: '#22c55e' }}>{correct}</span> right &middot;{' '}
                  <span style={{ color: '#dc2626' }}>{wrong}</span> wrong
                </div>
                <button onClick={() => setPhase('done')} type="button" style={{
                  background: 'transparent', color: 'var(--text-3)',
                  padding: '6px 12px', borderRadius: 7,
                  fontSize: 11.5, fontWeight: 600,
                  border: '1.5px solid var(--border)',
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}>End drill</button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: theme.color, transition: 'width 0.3s ease', borderRadius: 2 }} />
            </div>

            {/* Question card */}
            <div style={{ ...CARD, padding: '24px 28px' }}>
              {/* Question header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.4 }}>
                  Q{String(idx + 1).padStart(2, '0')} <span style={{ color: 'var(--border-2)' }}>/ {questions.length}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.5, textTransform: 'uppercase' }}>{q.category}</div>
                {q.difficulty && (
                  <div style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 4,
                    color: q.difficulty === 'easy' ? '#22c55e' : q.difficulty === 'medium' ? '#f59e0b' : '#dc2626',
                    background: q.difficulty === 'easy' ? 'rgba(34, 197, 94, 0.10)' : q.difficulty === 'medium' ? 'rgba(245, 158, 11, 0.10)' : 'rgba(220, 38, 38, 0.10)',
                  }}>{q.difficulty}</div>
                )}
              </div>

              {/* Scenario */}
              {q.scenario && (
                <div style={{
                  padding: '12px 14px', marginBottom: 16,
                  background: 'var(--surface-2)', borderLeft: `3px solid ${theme.color}`,
                  borderRadius: 6,
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6,
                }}>{q.scenario}</div>
              )}

              {/* Question prompt */}
              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 24, lineHeight: 1.3, color: 'var(--text)',
                fontWeight: 400, margin: '0 0 20px',
                letterSpacing: '-0.3px',
              }}>{q.q}</h2>

              {/* Choices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrectChoice = i === q.correct;
                  const showResult = selected !== null;
                  let borderColor = 'var(--border)';
                  let bg = 'var(--surface)';
                  let textColor = 'var(--text)';
                  let letterBg = 'var(--surface-2)';
                  let letterColor = 'var(--text-3)';
                  if (showResult) {
                    if (isCorrectChoice) { borderColor = '#22c55e'; bg = 'rgba(34, 197, 94, 0.08)'; letterBg = '#22c55e'; letterColor = '#fff'; }
                    else if (isSelected) { borderColor = '#dc2626'; bg = 'rgba(220, 38, 38, 0.08)'; letterBg = '#dc2626'; letterColor = '#fff'; }
                    else { textColor = 'var(--text-3)'; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      type="button"
                      className="cd-choice-btn"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '13px 16px',
                        background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 9,
                        cursor: selected !== null ? 'default' : 'pointer',
                        fontFamily: "'Sora', sans-serif",
                        textAlign: 'left', color: textColor,
                        transition: 'all 0.12s ease',
                      }}
                    >
                      <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: letterBg, color: letterColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        flexShrink: 0,
                        transition: 'all 0.12s ease',
                      }}>{'ABCD'[i]}</div>
                      <span style={{ fontSize: 13.5, lineHeight: 1.4, flex: 1 }}>{opt}</span>
                      {showResult && isCorrectChoice && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {showResult && isSelected && !isCorrectChoice && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExp && (
                <div style={{
                  marginTop: 18, padding: '16px 18px',
                  background: 'var(--surface-2)', borderRadius: 10,
                  borderLeft: `3px solid ${isCorrect ? '#22c55e' : '#dc2626'}`,
                }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                    color: isCorrect ? '#22c55e' : '#dc2626', marginBottom: 6,
                  }}>{isCorrect ? 'Correct' : 'Not quite'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14 }}>{q.explanation}</div>
                  <button onClick={next} type="button" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: 'var(--text)', color: 'var(--surface)',
                    padding: '9px 16px', borderRadius: 8,
                    fontSize: 12.5, fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    {idx + 1 >= questions.length ? 'Finish drill' : 'Next question'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
            </div>

          </div>
          <style>{`
            .cd-choice-btn:not(:disabled):hover { border-color: var(--border-2) !important; background: var(--surface-2) !important; }
          `}</style>
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  //   PHASE 4 - RESULTS
  // ═══════════════════════════════════════════════════════════════
  const theme = TRACK_THEME[trackKey] || { color: 'var(--text-2)', bg: 'var(--surface-2)' };
  const missed = history.filter(h => !h.correct);
  const accuracyColor = accuracy >= 70 ? '#22c55e' : accuracy >= 50 ? '#f59e0b' : '#dc2626';
  return (
    <div className="app">
      <Sidebar activePage="concept-drills" />
      <main className="main" style={PAGE_OUTER}>
        <div style={{ ...PAGE_INNER, maxWidth: 760 }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...EYEBROW, display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.color }} />
              Drill complete
            </div>
            <h1 style={SERIF_TITLE_SM}>
              <em style={{ fontStyle: 'italic' }}>{track.title}</em>
              {activeTopic !== 'All Topics' && <span style={{ color: 'var(--text-3)', fontStyle: 'normal' }}> &middot; {activeTopic}</span>}
            </h1>
          </div>

          {/* Big stats card */}
          <div style={{
            ...CARD, padding: '28px 32px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 32,
          }}>
            <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={accuracyColor} strokeWidth="9" strokeDasharray={`${(accuracy / 100) * 264} 264`} strokeLinecap="round" />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
                fontFamily: "'Instrument Serif', serif",
              }}>
                <div style={{ fontSize: 28, fontStyle: 'italic', color: accuracyColor, lineHeight: 1, letterSpacing: '-0.5px' }}>{accuracy}<span style={{ fontSize: 14, color: 'var(--text-3)' }}>%</span></div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
              <div>
                <div style={{ ...EYEBROW, fontSize: 9.5, marginBottom: 4 }}>Correct</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e', lineHeight: 1 }}>{correct}<span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}> / {total}</span></div>
              </div>
              <div>
                <div style={{ ...EYEBROW, fontSize: 9.5, marginBottom: 4 }}>Wrong</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: missed.length > 0 ? '#dc2626' : 'var(--text-3)', lineHeight: 1 }}>{wrong}</div>
              </div>
              <div>
                <div style={{ ...EYEBROW, fontSize: 9.5, marginBottom: 4 }}>Points</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{score}</div>
              </div>
            </div>
          </div>

          {/* Free plan upgrade nudge */}
          {(() => {
            if (isPro) return null;
            return (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', marginBottom: 16,
                ...CARD,
                fontSize: 12, color: 'var(--text-3)',
              }}>
                <span>Free drills are 5 questions. Upgrade for full {DRILL_SIZE}-question drills across all tracks.</span>
                <a href="/checkout" style={{ padding: '6px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--text)', color: 'var(--surface)', textDecoration: 'none', fontFamily: "'Sora', sans-serif", flexShrink: 0, marginLeft: 12 }}>Upgrade</a>
              </div>
            );
          })()}

          {/* Missed questions */}
          {missed.length > 0 && (
            <div style={{ ...CARD, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ ...EYEBROW }}>What you missed</div>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: 'rgba(220, 38, 38, 0.10)', color: '#dc2626',
                }}>{missed.length}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {missed.map((h, i) => (
                  <div key={i} style={{
                    paddingBottom: i < missed.length - 1 ? 14 : 0,
                    borderBottom: i < missed.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ ...EYEBROW, fontSize: 9.5, marginBottom: 5 }}>{h.topic}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{h.q}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55 }}>{h.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => startDrill(activeTopic)} type="button" style={{
              flex: '1 1 200px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--text)', color: 'var(--surface)',
              padding: '12px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>
              Drill again
            </button>
            <button onClick={() => setPhase('topics')} type="button" style={{
              background: 'transparent', color: 'var(--text-2)',
              padding: '12px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 600,
              border: '1.5px solid var(--border-2)', cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
            }}>Another topic</button>
            <button onClick={() => setPhase('landing')} type="button" style={{
              background: 'transparent', color: 'var(--text-2)',
              padding: '12px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 600,
              border: '1.5px solid var(--border-2)', cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
            }}>All tracks</button>
          </div>

        </div>
      </main>
    </div>
  );
}
