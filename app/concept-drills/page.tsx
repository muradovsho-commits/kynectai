// Build: v5-quiet-editorial
'use client';
import { useState, useEffect } from 'react';
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

export default function ConceptDrillsPage() {
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
  }, []);

  const track = TRACKS[trackKey];

  const startDrill = (topic: string) => {
    setActiveTopic(topic);
    const allQs = track.questions;
    const pool = topic === 'All Topics' ? allQs : allQs.filter(q => q.topic === topic);
    const source = pool.length > 0 ? pool : allQs;
    const picked = shuffle(source).slice(0, DRILL_SIZE).map(drillToMCQ);
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
    if (idx + 1 >= questions.length) { setPhase('done'); return; }
    setIdx(i => i + 1); setSelected(null); setShowExp(false);
  };

  const q = questions[idx];
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round(correct / total * 100) : 0;

  // ══════════════ LANDING ══════════════
  if (phase === 'landing') return (
    <div className="app">
      <Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-page">
          <header className="cd-page-head">
            <div className="cd-eyebrow">Practice</div>
            <h1 className="cd-h1">Concept <em>Drills</em></h1>
            <p className="cd-lede">Ten short multiple-choice questions per round, drawn at random from the track you pick. New set every time.</p>
          </header>

          <section className="cd-index">
            <div className="cd-index-head">
              <span className="cd-index-lbl">Tracks</span>
              <span className="cd-index-lbl-right">Topics</span>
            </div>
            <ul className="cd-index-list">
              {TRACK_KEYS.map((k, i) => {
                const t = TRACKS[k];
                return (
                  <li key={k}>
                    <button
                      className="cd-index-row"
                      onClick={() => { setTrackKey(k); setPhase('topics'); }}
                      type="button"
                    >
                      <span className="cd-index-num">{toRoman(i + 1)}</span>
                      <span className="cd-index-main">
                        <span className="cd-index-title">{t.title}</span>
                        <span className="cd-index-desc">{t.desc}</span>
                      </span>
                      <span className="cd-index-count">{t.topics.length}</span>
                      <span className="cd-index-arrow" aria-hidden>›</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );

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

          <div className="cd-result-actions">
            <button className="cd-action-primary" onClick={() => startDrill(activeTopic)} type="button">Drill again</button>
            <button className="cd-action-secondary" onClick={() => setPhase('topics')} type="button">Pick topic</button>
            <button className="cd-action-secondary" onClick={() => setPhase('landing')} type="button">All tracks</button>
          </div>
        </div>
      </main>
    </div>
  );
}
