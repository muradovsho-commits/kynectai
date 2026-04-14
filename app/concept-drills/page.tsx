// Build: v4-editorial-workspace
'use client';
import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './drills.css';
import { TRACKS as DRILL_TRACKS, DrillQ } from './drill-data';

type MCQ = { q: string; scenario?: string; category: string; difficulty?: string; options: string[]; correct: number; explanation: string };
type TrackDef = { title: string; desc: string; icon: string; iconClass: string; topics: string[]; questions: DrillQ[] };

const TRACKS: Record<string, TrackDef> = DRILL_TRACKS;
const TRACK_KEYS = Object.keys(TRACKS);
const DRILL_SIZE = 10;
const MISTAKE_KEY = 'offerbell_drill_mistakes';
const SESSION_KEY = 'offerbell_drill_session';

type Mistake = { trackKey: string; q: string; scenario?: string; options: string[]; correct: number; explanation: string; topic: string; ts: number };

function loadMistakes(): Mistake[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(MISTAKE_KEY) || '[]'); } catch { return []; }
}
function saveMistakes(arr: Mistake[]) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(MISTAKE_KEY, JSON.stringify(arr.slice(0, 200))); } catch {}
}
function loadLastSession(): { trackKey?: string; topic?: string } {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '{}'); } catch { return {}; }
}
function saveLastSession(data: { trackKey: string; topic: string }) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function drillToMCQ(d: DrillQ): MCQ {
  return { q: d.q, scenario: d.scenario, category: d.topic, difficulty: d.difficulty, options: d.options, correct: d.correct, explanation: d.explanation };
}
function mistakeToMCQ(m: Mistake): MCQ {
  return { q: m.q, scenario: m.scenario, category: m.topic, options: m.options, correct: m.correct, explanation: m.explanation };
}

export default function ConceptDrillsPage() {
  const [trackKey, setTrackKey] = useState<string>('ib');
  const [phase, setPhase] = useState<'idle' | 'drilling' | 'review'>('idle');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<{ q: string; correct: boolean; explanation: string; topic: string }[]>([]);
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    setMistakes(loadMistakes());
    const last = loadLastSession();
    if (last.trackKey && TRACKS[last.trackKey]) setTrackKey(last.trackKey);
    setHydrated(true);
  }, []);

  const track = TRACKS[trackKey];

  const mistakesByTrack = useMemo(() => {
    const m: Record<string, number> = {};
    for (const x of mistakes) m[x.trackKey] = (m[x.trackKey] || 0) + 1;
    return m;
  }, [mistakes]);

  const trackMistakes = mistakes.filter(m => m.trackKey === trackKey);

  const topicCounts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const q of track.questions) c[q.topic] = (c[q.topic] || 0) + 1;
    return c;
  }, [track]);

  const startDrill = (topic: string) => {
    setActiveTopic(topic);
    saveLastSession({ trackKey, topic });
    const allQs = track.questions;
    const pool = topic === 'All Topics' ? allQs : allQs.filter(q => q.topic === topic);
    const source = pool.length > 0 ? pool : allQs;
    const picked = shuffle(source).slice(0, DRILL_SIZE).map(drillToMCQ);
    setQuestions(picked);
    setIdx(0); setSelected(null); setShowExp(false);
    setScore(0); setCorrect(0); setWrong(0); setStreak(0); setHistory([]);
    setPhase('drilling');
  };

  const startMistakeDrill = () => {
    if (trackMistakes.length === 0) return;
    setActiveTopic('Your Misses');
    const picked = shuffle(trackMistakes).slice(0, DRILL_SIZE).map(mistakeToMCQ);
    setQuestions(picked);
    setIdx(0); setSelected(null); setShowExp(false);
    setScore(0); setCorrect(0); setWrong(0); setStreak(0); setHistory([]);
    setPhase('drilling');
  };

  const handleSelect = (ci: number) => {
    if (selected !== null) return;
    setSelected(ci); setShowExp(true);
    const q = questions[idx]; const ok = ci === q.correct;
    if (ok) {
      setScore(s => s + 10 + Math.min(streak, 5));
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
    } else {
      setWrong(w => w + 1);
      setStreak(0);
      const newMistake: Mistake = {
        trackKey, q: q.q, scenario: q.scenario, options: q.options,
        correct: q.correct, explanation: q.explanation, topic: q.category, ts: Date.now()
      };
      setMistakes(prev => {
        const filtered = prev.filter(m => !(m.trackKey === trackKey && m.q === q.q));
        const nextArr = [newMistake, ...filtered];
        saveMistakes(nextArr);
        return nextArr;
      });
    }
    setHistory(h => [...h, { q: q.q, correct: ok, explanation: q.explanation, topic: q.category }]);
    try {
      const raw = localStorage.getItem('offerbell_flash_perf');
      const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
      p.seen = (p.seen || 0) + 1;
      if (ok) p.pass = (p.pass || 0) + 1; else p.fail = (p.fail || 0) + 1;
      const cat = q.category;
      if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
      p.byCat[cat].seen++;
      if (ok) p.byCat[cat].pass++;
      localStorage.setItem('offerbell_flash_perf', JSON.stringify(p));
    } catch {}
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setPhase('review'); return; }
    setIdx(i => i + 1); setSelected(null); setShowExp(false);
  };

  const exitToIdle = () => {
    setPhase('idle'); setSelected(null); setShowExp(false); setIdx(0);
  };

  const q = questions[idx];
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  return (
    <div className="app">
      <Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-shell">

          <header className="cd-header">
            <div>
              <div className="cd-eyebrow">Practice</div>
              <h1 className="cd-title">Concept <em>Drills</em></h1>
              <p className="cd-subtitle">Ten short multiple choice questions. Pick a track, hit start, see what sticks.</p>
            </div>
            {phase === 'drilling' && (
              <button className="cd-exit" onClick={exitToIdle} type="button">Exit drill</button>
            )}
          </header>

          <nav className="cd-track-strip" aria-label="Track switcher">
            {TRACK_KEYS.map(k => {
              const t = TRACKS[k];
              const isActive = k === trackKey;
              const missCount = mistakesByTrack[k] || 0;
              return (
                <button
                  key={k}
                  className={`cd-track-pill ${isActive ? 'active' : ''}`}
                  onClick={() => { setTrackKey(k); setPhase('idle'); }}
                  type="button"
                  disabled={phase === 'drilling'}
                  title={t.title}
                >
                  <span className="cd-track-pill-name">{t.title}</span>
                  {missCount > 0 && <span className="cd-track-pill-miss">{missCount}</span>}
                </button>
              );
            })}
          </nav>

          {phase === 'idle' && hydrated && (
            <div className="cd-workspace">
              <section className="cd-quickstart">
                <button className="cd-qs-card cd-qs-primary" onClick={() => startDrill('All Topics')} type="button">
                  <div className="cd-qs-label">Start a drill</div>
                  <div className="cd-qs-headline">All topics, 10 questions</div>
                  <div className="cd-qs-meta">Random mix from {track.questions.length} {track.title} questions</div>
                  <div className="cd-qs-arrow">→</div>
                </button>

                <button
                  className={`cd-qs-card cd-qs-mistakes ${trackMistakes.length === 0 ? 'cd-qs-disabled' : ''}`}
                  onClick={startMistakeDrill}
                  type="button"
                  disabled={trackMistakes.length === 0}
                >
                  <div className="cd-qs-label">Mistake bank</div>
                  <div className="cd-qs-headline">
                    {trackMistakes.length > 0
                      ? `Redrill ${Math.min(trackMistakes.length, 10)} miss${Math.min(trackMistakes.length, 10) === 1 ? '' : 'es'}`
                      : 'No misses yet'}
                  </div>
                  <div className="cd-qs-meta">
                    {trackMistakes.length > 0
                      ? `${trackMistakes.length} total banked from ${track.title}`
                      : 'Wrong answers get saved here automatically'}
                  </div>
                  {trackMistakes.length > 0 && <div className="cd-qs-arrow">→</div>}
                </button>
              </section>

              <section className="cd-topics-section">
                <div className="cd-section-head">
                  <div className="cd-section-title">By topic</div>
                  <div className="cd-section-meta">{track.topics.length} topics in {track.title}</div>
                </div>
                <ul className="cd-topic-list">
                  {track.topics.map((topic, i) => {
                    const count = topicCounts[topic] || 0;
                    const topicMisses = trackMistakes.filter(m => m.topic === topic).length;
                    return (
                      <li key={topic}>
                        <button className="cd-topic-row" onClick={() => startDrill(topic)} type="button">
                          <span className="cd-topic-num">{String(i + 1).padStart(2, '0')}</span>
                          <span className="cd-topic-name">{topic}</span>
                          <span className="cd-topic-meta">
                            <span className="cd-topic-count">{count} questions</span>
                            {topicMisses > 0 && <span className="cd-topic-miss">{topicMisses} miss{topicMisses === 1 ? '' : 'es'}</span>}
                          </span>
                          <span className="cd-topic-go">Drill →</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          )}

          {phase === 'drilling' && q && (
            <div className="cd-stage">
              <div className="cd-status">
                <div className="cd-status-left">
                  <span className="cd-status-track">{track.title}</span>
                  <span className="cd-status-sep">·</span>
                  <span className="cd-status-topic">{activeTopic}</span>
                </div>
                <div className="cd-status-right">
                  <div className="cd-progress-dots">
                    {questions.map((_, i) => {
                      const past = i < idx || (i === idx && showExp);
                      const h = history[i];
                      let cls = 'cd-pdot';
                      if (i === idx && !showExp) cls += ' current';
                      else if (past && h) cls += h.correct ? ' hit' : ' miss';
                      return <span key={i} className={cls} />;
                    })}
                  </div>
                  <span className="cd-status-counter">{idx + 1} / {questions.length}</span>
                  {streak >= 3 && <span className="cd-streak">{streak} streak</span>}
                </div>
              </div>

              <article className="cd-q-card">
                <header className="cd-q-card-head">
                  <span className="cd-q-cat">{q.category}</span>
                  {q.difficulty && (
                    <span className={`cd-q-diff cd-q-diff-${q.difficulty}`}>{q.difficulty}</span>
                  )}
                  <span className="cd-q-num">Question {String(idx + 1).padStart(2, '0')}</span>
                </header>

                {q.scenario && (
                  <div className="cd-q-scenario">{q.scenario}</div>
                )}

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
                  <footer className={`cd-explanation ${selected === q.correct ? 'correct' : 'wrong'}`}>
                    <div className="cd-exp-label">
                      {selected === q.correct ? 'Correct' : 'Incorrect'}
                      <span className="cd-exp-pts">
                        {selected === q.correct ? `+${10 + Math.min(streak - 1, 5)} pts` : '0 pts'}
                      </span>
                    </div>
                    <div className="cd-exp-text">{q.explanation}</div>
                    <button className="cd-next-btn" onClick={next} type="button">
                      {idx + 1 >= questions.length ? 'Finish' : 'Next'}
                      <span aria-hidden>→</span>
                    </button>
                  </footer>
                )}
              </article>

              <div className="cd-score-footer">
                <div><span className="cd-score-num">{score}</span><span className="cd-score-lbl">pts</span></div>
                <div className="cd-score-tally">
                  <span className="cd-score-ok">{correct} right</span>
                  <span className="cd-score-no">{wrong} wrong</span>
                </div>
              </div>
            </div>
          )}

          {phase === 'review' && (
            <div className="cd-review-stage">
              <article className="cd-review-card">
                <header className="cd-review-head">
                  <div>
                    <div className="cd-review-eyebrow">Drill complete</div>
                    <h2 className="cd-review-title">{track.title}{activeTopic !== 'All Topics' ? ` · ${activeTopic}` : ''}</h2>
                  </div>
                  <div className="cd-review-score">
                    <div className="cd-review-num">{accuracy}<span>%</span></div>
                    <div className="cd-review-num-lbl">{correct} of {total}</div>
                  </div>
                </header>

                <div className="cd-review-stats">
                  <div className="cd-rs-item"><div className="cd-rs-val">{score}</div><div className="cd-rs-lbl">Points earned</div></div>
                  <div className="cd-rs-item"><div className="cd-rs-val" style={{color:'#16a34a'}}>{correct}</div><div className="cd-rs-lbl">Correct</div></div>
                  <div className="cd-rs-item"><div className="cd-rs-val" style={{color:'#dc2626'}}>{wrong}</div><div className="cd-rs-lbl">Wrong</div></div>
                </div>

                {history.filter(h => !h.correct).length > 0 && (
                  <section className="cd-review-misses">
                    <div className="cd-review-section-title">
                      What you missed
                      <span className="cd-review-section-meta">{history.filter(h => !h.correct).length} saved to your mistake bank</span>
                    </div>
                    <ol className="cd-miss-list">
                      {history.filter(h => !h.correct).map((h, i) => (
                        <li key={i} className="cd-miss-item">
                          <div className="cd-miss-topic">{h.topic}</div>
                          <div className="cd-miss-q">{h.q}</div>
                          <div className="cd-miss-exp">{h.explanation}</div>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                <footer className="cd-review-actions">
                  <button className="cd-action-primary" onClick={() => startDrill(activeTopic)} type="button">Drill again</button>
                  <button className="cd-action-secondary" onClick={exitToIdle} type="button">Pick another topic</button>
                  {wrong > 0 && (
                    <button className="cd-action-tertiary" onClick={startMistakeDrill} type="button">Drill misses</button>
                  )}
                </footer>
              </article>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
