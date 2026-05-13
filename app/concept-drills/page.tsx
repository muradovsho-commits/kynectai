// Build: v5-quiet-editorial
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

export default function ConceptDrillsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ConceptDrillsContent />
    </Suspense>
  );
}

function ConceptDrillsContent() {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

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
    // Free users get 5 questions per drill, paid get full DRILL_SIZE
    const plan = localStorage.getItem('offerbell_plan') || 'free';
    const isPaid = plan === 'pro' || plan === 'elite';
    const size = isPaid ? DRILL_SIZE : 5;
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
  if (phase === 'landing') {
    // Aggregate per-track stats from the same localStorage keys the drill
    // logic already writes to. Computed inline, refreshes on each render.
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
    const hasActivity = totalSeen > 0;

    return (
      <div className="app">
        <Sidebar activePage="concept-drills" />
        <main className="main" style={{ padding: '32px 36px 80px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

            {/* ════════ HERO ════════ */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              gap: 32, marginBottom: 36, paddingBottom: 28,
              borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6,
                  textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12,
                }}>Practice</div>
                <h1 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 46, lineHeight: 1, letterSpacing: '-1.2px',
                  color: 'var(--text)', fontWeight: 400, margin: '0 0 14px',
                }}>Concept <em style={{ fontStyle: 'italic' }}>Drills</em></h1>
                <p style={{
                  fontSize: 14, color: 'var(--text-2)', lineHeight: 1.55,
                  maxWidth: 540, margin: 0,
                }}>Ten timed multiple-choice questions per round, drawn at random from the track you pick. Pass rate stays visible so you can see where you're tight and where you're not.</p>
              </div>

              {hasActivity && (
                <div style={{
                  display: 'flex', gap: 14, flexShrink: 0,
                }}>
                  <div style={{
                    padding: '14px 18px',
                    background: 'var(--surface)', border: '1.5px solid var(--border)',
                    borderRadius: 12, minWidth: 120,
                  }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Questions</div>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, fontStyle: 'italic', color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>{totalSeen}</div>
                  </div>
                  <div style={{
                    padding: '14px 18px',
                    background: 'var(--surface)', border: '1.5px solid var(--border)',
                    borderRadius: 12, minWidth: 120,
                  }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Accuracy</div>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, fontStyle: 'italic', color: overallPct >= 70 ? '#22c55e' : overallPct >= 50 ? '#f59e0b' : 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>{overallPct}<span style={{ fontSize: 16, color: 'var(--text-3)' }}>%</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* ════════ TRACK GRID ════════ */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}>
              {TRACK_KEYS.map((k) => {
                const t = TRACKS[k];
                const theme = TRACK_THEME[k] || { color: 'var(--text)', bg: 'var(--surface-2)' };
                const stats = trackStats[k] || { seen: 0, pass: 0, pct: 0 };
                const questionCount = t.questions.length;
                return (
                  <button
                    key={k}
                    onClick={() => { setTrackKey(k); setPhase('topics'); }}
                    type="button"
                    className="cd-tile"
                    style={{
                      position: 'relative', textAlign: 'left',
                      background: 'var(--surface)', border: '1.5px solid var(--border)',
                      borderRadius: 14, padding: '18px 20px 16px',
                      cursor: 'pointer', overflow: 'hidden',
                      fontFamily: "'Sora', sans-serif",
                      transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    {/* Accent stripe down the left edge */}
                    <span style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                      background: theme.color, opacity: 0.85,
                    }} aria-hidden />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: theme.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <TrackIcon name={t.icon} color={theme.color} />
                      </div>
                      {stats.seen > 0 && (
                        <div style={{
                          padding: '3px 8px', borderRadius: 100,
                          fontSize: 10.5, fontWeight: 700,
                          background: stats.pct >= 70 ? 'rgba(34, 197, 94, 0.12)' : stats.pct >= 50 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(220, 38, 38, 0.12)',
                          color: stats.pct >= 70 ? '#22c55e' : stats.pct >= 50 ? '#f59e0b' : '#dc2626',
                          border: 'none',
                        }}>{stats.pct}%</div>
                      )}
                    </div>

                    <div style={{
                      fontSize: 16, fontWeight: 700, color: 'var(--text)',
                      lineHeight: 1.25, marginBottom: 6,
                    }}>{t.title}</div>

                    <div style={{
                      fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5,
                      marginBottom: 14,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>{t.desc}</div>

                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 8, paddingTop: 12,
                      borderTop: '1px solid var(--border)',
                    }}>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>
                        {t.topics.length} topics &middot; {questionCount} Qs
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 11, fontWeight: 700, color: theme.color,
                      }}>
                        {stats.seen > 0 ? 'Drill again' : 'Start'}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          <style>{`
            .cd-tile:hover {
              transform: translateY(-2px);
              border-color: var(--border-2) !important;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            }
          `}</style>
        </main>
      </div>
    );
  }


  // ══════════════ TOPIC PICKER ══════════════
  if (phase === 'topics') return (
    <div className="app">
      <Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-page cd-page-narrow">
          <button className="cd-back" onClick={() => setPhase('landing')} type="button">
            <span aria-hidden>‹</span> All tracks
          </button>

          <header className="cd-page-head cd-page-head-sub">
            <div className="cd-eyebrow">{track.title}</div>
            <h1 className="cd-h1"><em>Pick</em> a topic</h1>
            <p className="cd-lede">Ten questions chosen at random, scored as you go. Each round is a fresh draw.</p>
          </header>

          <ul className="cd-topic-list">
            <li>
              <button className="cd-topic-row cd-topic-all" onClick={() => startDrill('All Topics')} type="button">
                <span className="cd-topic-num" aria-hidden></span>
                <span className="cd-topic-name">All topics</span>
                <span className="cd-topic-arrow" aria-hidden>›</span>
              </button>
            </li>
            {track.topics.map((topic, i) => {
              return (
                <li key={topic}>
                  <button className="cd-topic-row" onClick={() => startDrill(topic)} type="button">
                    <span className="cd-topic-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cd-topic-name">{topic}</span>
                    <span className="cd-topic-arrow" aria-hidden>›</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );

  // ══════════════ DRILLING ══════════════
  if (phase === 'drilling' && q) return (
    <div className="app">
      <Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-page cd-page-play">
          <div className="cd-play-top">
            <div className="cd-play-title">
              <span className="cd-play-track">{track.title}</span>
              <span className="cd-play-sep">·</span>
              <span className="cd-play-topic">{activeTopic}</span>
            </div>
            <button className="cd-play-end" onClick={() => setPhase('done')} type="button">End drill</button>
          </div>

          <div className="cd-progress">
            <div className="cd-progress-fill" style={{ width: `${(idx / questions.length) * 100}%` }} />
          </div>

          <article className="cd-q">
            <header className="cd-q-head">
              <span className="cd-q-index">Q{String(idx + 1).padStart(2, '0')}<span className="cd-q-of">/ {questions.length}</span></span>
              <span className="cd-q-rule" aria-hidden></span>
              <span className="cd-q-cat">{q.category}</span>
              {q.difficulty && <span className={`cd-q-diff cd-q-diff-${q.difficulty}`}>{q.difficulty}</span>}
            </header>

            {q.scenario && <div className="cd-q-scenario">{q.scenario}</div>}

            <h2 className="cd-q-prompt">{q.q}</h2>

            <div className="cd-choices">
              {q.options.map((opt, i) => {
                let cls = 'cd-choice';
                if (selected !== null) {
                  if (i === q.correct) cls += ' correct';
                  else if (i === selected) cls += ' wrong';
                  else cls += ' faded';
                }
                return (
                  <button key={i} className={cls} onClick={() => handleSelect(i)} type="button" disabled={selected !== null}>
                    <span className="cd-choice-letter">{'ABCD'[i]}</span>
                    <span className="cd-choice-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {showExp && (
              <div className={`cd-exp ${selected === q.correct ? 'correct' : 'wrong'}`}>
                <div className="cd-exp-label">{selected === q.correct ? 'Correct' : 'Incorrect'}</div>
                <div className="cd-exp-text">{q.explanation}</div>
                <button className="cd-exp-next" onClick={next} type="button">
                  {idx + 1 >= questions.length ? 'Finish' : 'Next question'} <span aria-hidden>›</span>
                </button>
              </div>
            )}
          </article>

          <footer className="cd-play-foot">
            <span><span className="cd-foot-n">{score}</span> pts</span>
            <span className="cd-foot-sep">·</span>
            <span className="cd-foot-ok">{correct} right</span>
            <span className="cd-foot-sep">·</span>
            <span className="cd-foot-no">{wrong} wrong</span>
          </footer>
        </div>
      </main>
    </div>
  );

  // ══════════════ REVIEW ══════════════
  return (
    <div className="app">
      <Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-page cd-page-narrow">
          <header className="cd-page-head">
            <div className="cd-eyebrow">Drill complete</div>
            <h1 className="cd-h1"><em>{track.title}</em>{activeTopic !== 'All Topics' ? ` · ${activeTopic}` : ''}</h1>
          </header>

          <div className="cd-result-summary">
            <div className="cd-result-accuracy">
              <span className="cd-result-num">{accuracy}</span>
              <span className="cd-result-pct">%</span>
            </div>
            <div className="cd-result-meta">
              <div className="cd-result-line">{correct} of {total} correct</div>
              <div className="cd-result-line-sub">{score} points</div>
            </div>
          </div>

          {history.filter(h => !h.correct).length > 0 && (
            <section className="cd-review">
              <div className="cd-review-head">
                <span className="cd-review-lbl">What you missed</span>
                <span className="cd-review-count">{history.filter(h => !h.correct).length}</span>
              </div>
              <ol className="cd-review-list">
                {history.filter(h => !h.correct).map((h, i) => (
                  <li key={i} className="cd-review-item">
                    <div className="cd-review-topic">{h.topic}</div>
                    <div className="cd-review-q">{h.q}</div>
                    <div className="cd-review-exp">{h.explanation}</div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="cd-result-actions-wrap">
            {(() => {
              const plan = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_plan') || 'free') : 'free';
              if (plan === 'pro' || plan === 'elite') return null;
              return (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 18px', marginBottom: 16,
                  background: 'var(--surface)', border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 12, color: 'var(--text-3)',
                }}>
                  <span>Free drills are 5 questions. Upgrade for full {DRILL_SIZE}-question drills across all tracks.</span>
                  <a href="/checkout" style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--text)', color: 'var(--surface)', textDecoration: 'none', fontFamily: "'Sora', sans-serif", flexShrink: 0, marginLeft: 12 }}>Upgrade</a>
                </div>
              );
            })()}
            <div className="cd-result-actions-label">Next</div>
            <div className="cd-result-actions">
              <button className="cd-action-primary" onClick={() => startDrill(activeTopic)} type="button">
                Drill again
                <span aria-hidden>↻</span>
              </button>
              <button className="cd-action-secondary" onClick={() => setPhase('topics')} type="button">Pick another topic</button>
              <button className="cd-action-secondary" onClick={() => setPhase('landing')} type="button">All tracks</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
