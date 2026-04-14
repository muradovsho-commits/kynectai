// Build: v3-handwritten-mcqs
'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './drills.css';
import { TRACKS as DRILL_TRACKS, DrillQ } from './drill-data';

type MCQ = { q: string; category: string; difficulty?: string; options: string[]; correct: number; explanation: string };

type TrackDef = { title: string; desc: string; icon: string; iconClass: string; topics: string[]; questions: DrillQ[] };

const TRACKS: Record<string, TrackDef> = DRILL_TRACKS;

const TRACK_KEYS = Object.keys(TRACKS);
const DRILL_SIZE = 10;

const ICONS: Record<string, JSX.Element> = {
  briefcase: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  layers: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  box: <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  file: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  chart: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  pulse: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  search: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  home: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  rocket: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  alert: <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function drillToMCQ(d: DrillQ): MCQ {
  return { q: d.q, category: d.topic, difficulty: d.difficulty, options: d.options, correct: d.correct, explanation: d.explanation };
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
  const [history, setHistory] = useState<{ q: string; correct: boolean; explanation: string }[]>([]);
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
    setHistory(h => [...h, { q: q.q, correct: ok, explanation: q.explanation }]);
    // Track in flash_perf for dashboard
    try {
      const raw = localStorage.getItem('offerbell_flash_perf');
      const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
      p.seen = (p.seen || 0) + 1;
      if (ok) p.pass = (p.pass || 0) + 1;
      else p.fail = (p.fail || 0) + 1;
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

  // ═══ LANDING ═══
  if (phase === 'landing') return (
    <div className="app"><Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-landing">
          <h1 className="cd-page-title">Concept Drills</h1>
          <p className="cd-page-sub">10 random multiple-choice questions per drill. Different set every time.</p>
          <div className="cd-card-grid">
            {TRACK_KEYS.map(k => {
              const t = TRACKS[k];
              return (
                <button key={k} className="cd-track-card" onClick={() => { setTrackKey(k); setPhase('topics'); }} type="button">
                  <div className={`cd-track-icon ${t.iconClass}`}>{ICONS[t.icon]}</div>
                  <div className="cd-track-title">{t.title}</div>
                  <div className="cd-track-desc">{t.desc}</div>
                  <div className="cd-track-footer"><span className="cd-track-link">Start Drilling</span></div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );

  // ═══ TOPIC PICKER ═══
  if (phase === 'topics') return (
    <div className="app"><Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-track-detail">
          <button className="cd-back" onClick={() => setPhase('landing')} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            All Tracks
          </button>
          <div className="cd-detail-header">
            <div className={`cd-detail-icon ${track.iconClass}`}>{ICONS[track.icon]}</div>
            <div>
              <h2 className="cd-detail-title">{track.title}</h2>
              <p className="cd-detail-sub">10 questions per drill, randomized each session</p>
            </div>
          </div>
          <div className="cd-topic-grid">
            <button className="cd-topic-card" onClick={() => startDrill('All Topics')} type="button">
              <div className="cd-tc-name">All Topics</div>
              <div className="cd-tc-go">Start</div>
            </button>
            {track.topics.map(topic => (
              <button key={topic} className="cd-topic-card" onClick={() => startDrill(topic)} type="button">
                <div className="cd-tc-name">{topic}</div>
                <div className="cd-tc-go">Start</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  // ═══ DRILLING ═══
  if (phase === 'drilling' && q) return (
    <div className="app"><Sidebar activePage="concept-drills" />
      <main className="main cd-main cd-play-main">
        <div className="cd-play">
          <div className="cd-top-bar">
            <div className="cd-top-score"><span className="cd-sv">{score}</span> <span className="cd-sl">pts</span></div>
            <div className="cd-top-tally"><span className="cd-tok">{correct}</span> / <span className="cd-tx">{wrong}</span></div>
            <div className="cd-top-progress">{idx + 1} / {questions.length}</div>
          </div>
          <div className="cd-progress-wrap"><div className="cd-progress-bar" style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
          <div className="cd-q-area">
            <div className="cd-q-meta">
              <span className="cd-q-topic">{q.category}</span>
              {q.difficulty && <span className="cd-q-diff" style={{ color: q.difficulty === 'Advanced' ? '#d97706' : '#16a34a', borderColor: q.difficulty === 'Advanced' ? '#d97706' : '#16a34a' }}>{q.difficulty}</span>}
            </div>
            <div className="cd-q-text">{q.q}</div>
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
                    {selected !== null && i === q.correct && <span className="cd-choice-icon ok">Correct</span>}
                    {selected !== null && i === selected && i !== q.correct && <span className="cd-choice-icon no">Wrong</span>}
                  </button>
                );
              })}
            </div>
            {showExp && (
              <div className={`cd-explanation ${selected === q.correct ? 'correct' : 'wrong'}`}>
                <div className="cd-exp-label">{selected === q.correct ? 'Correct' : 'Incorrect'} - Full Answer:</div>
                <div className="cd-exp-text">{q.explanation}</div>
                <button className="cd-next-btn" onClick={next} type="button">
                  {idx + 1 >= questions.length ? 'See Results' : 'Next Question'}
                  <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              </div>
            )}
          </div>
          <div className="cd-bottom-bar"><button className="cd-end-btn" onClick={() => setPhase('done')} type="button">End Drill</button></div>
        </div>
      </main>
    </div>
  );

  // ═══ RESULTS ═══
  return (
    <div className="app"><Sidebar activePage="concept-drills" />
      <main className="main cd-main">
        <div className="cd-results">
          <h2 className="cd-results-title">Drill <em>Complete</em></h2>
          <div className="cd-results-topic">{track.title}{activeTopic !== 'All Topics' ? ` - ${activeTopic}` : ''}</div>
          <div className="cd-final-score"><div className="cd-final-num">{score}</div><div className="cd-final-label">points</div></div>
          <div className="cd-stats-grid">
            <div className="cd-stat"><div className="cd-stat-val">{total}</div><div className="cd-stat-lbl">Answered</div></div>
            <div className="cd-stat"><div className="cd-stat-val" style={{color:'#16a34a'}}>{correct}</div><div className="cd-stat-lbl">Correct</div></div>
            <div className="cd-stat"><div className="cd-stat-val" style={{color:'#dc2626'}}>{wrong}</div><div className="cd-stat-lbl">Wrong</div></div>
            <div className="cd-stat"><div className="cd-stat-val">{accuracy}%</div><div className="cd-stat-lbl">Accuracy</div></div>
          </div>
          {history.filter(h => !h.correct).length > 0 && (
            <div className="cd-review">
              <div className="cd-review-title">Review what you missed</div>
              {history.filter(h => !h.correct).map((h, i) => (
                <div key={i} className="cd-review-item"><div className="cd-review-q">{h.q}</div><div className="cd-review-exp">{h.explanation}</div></div>
              ))}
            </div>
          )}
          <div className="cd-results-actions">
            <button className="cd-retry-btn" onClick={() => startDrill(activeTopic)} type="button">Drill Again</button>
            <button className="cd-menu-btn" onClick={() => setPhase('topics')} type="button">Pick Topic</button>
            <button className="cd-menu-btn" onClick={() => setPhase('landing')} type="button">All Tracks</button>
          </div>
        </div>
      </main>
    </div>
  );
}
