// Build: v3-handwritten-mcqs
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './diagnostic.css';
import { TRACKS as DRILL_TRACKS, DrillQ } from '../concept-drills/drill-data';

type MCQ = { q: string; category: string; options: string[]; correct: number; explanation: string };
type TrackDef = { title: string; categories: string[]; questions: DrillQ[] };
type CatResult = { total: number; correct: number };
type DiagResult = {
  id: string; track: string; date: string; score: number;
  totalCorrect: number; totalAnswered: number;
  catScores: Record<string, { total: number; correct: number }>;
};

const TRACKS: Record<string, TrackDef> = {};
for (const [key, t] of Object.entries(DRILL_TRACKS)) {
  TRACKS[key] = { title: t.title, categories: t.topics, questions: t.questions };
}

const QUESTIONS_PER_CAT = 5;
const TIME_PER_Q = 45;
const STORAGE_KEY = 'offerbell_diag_history';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

function buildAssessment(track: TrackDef): MCQ[] {
  const allQ: MCQ[] = [];
  for (const cat of track.categories) {
    const pool = track.questions.filter(q => q.topic === cat);
    if (pool.length === 0) continue;
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_CAT);
    for (const d of picked) {
      allQ.push({ q: d.q, category: cat, options: d.options, correct: d.correct, explanation: d.explanation });
    }
  }
  // If not enough from categories, fill with random from all questions
  if (allQ.length < 10) {
    const used = new Set(allQ.map(q => q.q));
    const remaining = shuffle(track.questions.filter(q => !used.has(q.q))).slice(0, 10 - allQ.length);
    for (const d of remaining) {
      allQ.push({ q: d.q, category: d.topic, options: d.options, correct: d.correct, explanation: d.explanation });
    }
  }
  return shuffle(allQ);
}

function loadHistory(): DiagResult[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveHistory(h: DiagResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
}

type Phase = 'home' | 'select' | 'assess' | 'results';

export default function DiagnosticReviewPage() {
  const [phase, setPhase] = useState<Phase>('home');
  const [trackKey, setTrackKey] = useState('');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [timer, setTimer] = useState(TIME_PER_Q);
  const [catResults, setCatResults] = useState<Record<string, CatResult>>({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [missed, setMissed] = useState<{ q: string; explanation: string; category: string }[]>([]);
  const [history, setHistory] = useState<DiagResult[]>([]);
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [viewTrack, setViewTrack] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (phase !== 'assess' || showExp) { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimer(t => { if (t <= 1) { handleTimeUp(); return 0; } return t - 1; });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, idx, showExp]);

  const handleTimeUp = useCallback(() => {
    if (selected !== null) return;
    setSelected(-1); setShowExp(true);
    const q = questions[idx];
    setCatResults(p => { const c = p[q.category] || { total: 0, correct: 0 }; return { ...p, [q.category]: { total: c.total + 1, correct: c.correct } }; });
    setTotalAnswered(a => a + 1);
    setMissed(m => [...m, { q: q.q, explanation: q.explanation, category: q.category }]);
  }, [selected, questions, idx]);

  const startAssessment = () => {
    if (!trackKey) return;
    const track = TRACKS[trackKey];
    const qs = buildAssessment(track);
    setQuestions(qs); setIdx(0); setSelected(null); setShowExp(false); setTimer(TIME_PER_Q);
    setCatResults({}); setTotalCorrect(0); setTotalAnswered(0); setMissed([]);
    setPhase('assess');
  };

  const handleSelect = (ci: number) => {
    if (selected !== null) return;
    setSelected(ci); setShowExp(true);
    const q = questions[idx]; const ok = ci === q.correct;
    setCatResults(p => { const c = p[q.category] || { total: 0, correct: 0 }; return { ...p, [q.category]: { total: c.total + 1, correct: ok ? c.correct + 1 : c.correct } }; });
    setTotalAnswered(a => a + 1);
    if (ok) setTotalCorrect(c => c + 1);
    else setMissed(m => [...m, { q: q.q, explanation: q.explanation, category: q.category }]);
    try {
      const raw = localStorage.getItem('offerbell_flash_perf');
      const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
      p.seen = (p.seen || 0) + 1;
      if (ok) p.pass = (p.pass || 0) + 1; else p.fail = (p.fail || 0) + 1;
      const cat = q.category;
      if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
      p.byCat[cat].seen++; if (ok) p.byCat[cat].pass++;
      localStorage.setItem('offerbell_flash_perf', JSON.stringify(p));
    } catch {}
  };

  const nextQ = () => {
    if (idx + 1 >= questions.length) { finishAssessment(); return; }
    setIdx(i => i + 1); setSelected(null); setShowExp(false); setTimer(TIME_PER_Q);
  };

  const finishAssessment = () => {
    const score = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const result: DiagResult = {
      id: Date.now().toString(), track: trackKey,
      date: new Date().toISOString(), score,
      totalCorrect, totalAnswered, catScores: { ...catResults },
    };
    const updated = [result, ...history].slice(0, 50);
    setHistory(updated); saveHistory(updated);
    setPhase('results');
  };

  const track = trackKey ? TRACKS[trackKey] : null;
  const q = questions[idx];
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const vc = overallPct >= 80 ? 'strong' : overallPct >= 55 ? 'mid' : 'weak';
  const vt = overallPct >= 80 ? 'Interview Ready' : overallPct >= 65 ? 'Solid Foundation' : overallPct >= 55 ? 'Getting There' : overallPct >= 40 ? 'Needs Work' : 'Significant Gaps';

  // Aggregate performance data across all history
  const trackHistory = history.filter(h => !trackKey || h.track === trackKey);
  const allTrackHistory = history;
  const latestByTrack: Record<string, DiagResult> = {};
  for (const h of history) { if (!latestByTrack[h.track]) latestByTrack[h.track] = h; }

  // Overall readiness from flash_perf
  const [flashPerf, setFlashPerf] = useState<{ seen: number; pass: number; partial: number; fail: number; byCat: Record<string, { seen: number; pass: number }> }>({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} });
  useEffect(() => {
    try { const raw = localStorage.getItem('offerbell_flash_perf'); if (raw) setFlashPerf(JSON.parse(raw)); } catch {}
  }, []);

  // ═══ HOME - Career Track Selection + Per-Track Stats ═══
  if (phase === 'home') {

    // Per-track stats
    const trackStats = (tk: string) => {
      const th = history.filter(h => h.track === tk);
      const diagsTaken = th.length;
      const bestScore = th.length > 0 ? Math.max(...th.map(h => h.score)) : 0;
      const avgScore = th.length > 0 ? Math.round(th.reduce((s, h) => s + h.score, 0) / th.length) : 0;
      // Category scores from diagnostic history for this track
      const catAgg: Record<string, { total: number; correct: number }> = {};
      for (const h of th) {
        for (const [cat, sc] of Object.entries(h.catScores)) {
          if (!catAgg[cat]) catAgg[cat] = { total: 0, correct: 0 };
          catAgg[cat].total += sc.total;
          catAgg[cat].correct += sc.correct;
        }
      }
      const cats = Object.entries(catAgg).map(([cat, d]) => ({
        cat, ...d, pct: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
      })).sort((a, b) => b.pct - a.pct);
      return { diagsTaken, bestScore, avgScore, cats, history: th };
    };

    // If viewing a specific track's stats
    if (viewTrack && TRACKS[viewTrack]) {
      const t = TRACKS[viewTrack];
      const st = trackStats(viewTrack);
      const readinessScore = st.avgScore;
      const readinessLabel = readinessScore >= 80 ? 'Interview Ready' : readinessScore >= 65 ? 'Solid Foundation' : readinessScore >= 50 ? 'Getting There' : readinessScore >= 30 ? 'Building Up' : st.diagsTaken > 0 ? 'Just Starting' : 'Not Started';
      const readinessColor = readinessScore >= 80 ? '#16a34a' : readinessScore >= 65 ? '#22c55e' : readinessScore >= 50 ? '#d97706' : readinessScore >= 30 ? '#f59e0b' : '#94a3b8';

      return (
        <div className="app"><Sidebar activePage="diagnostic-review" />
          <main className="diag-main">
            <div className="diag-container">
              <button className="diag-back-link" onClick={() => setViewTrack(null)} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                All Tracks
              </button>
              <div className="diag-title">{t.title} <em>Readiness</em></div>
              <div className="diag-sub">{st.diagsTaken > 0 ? `${st.diagsTaken} diagnostic${st.diagsTaken > 1 ? 's' : ''} taken` : 'No diagnostics taken yet for this track'}</div>

              {/* Readiness Ring */}
              <div className="diag-readiness-card">
                <div className="diag-ring-wrap">
                  <svg viewBox="0 0 120 120" className="diag-ring-svg">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-2)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke={readinessColor} strokeWidth="8"
                      strokeDasharray={`${readinessScore * 3.267} 326.7`} strokeDashoffset="0"
                      strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                  </svg>
                  <div className="diag-ring-inner">
                    <div className="diag-ring-score" style={{ color: readinessColor }}>{readinessScore}%</div>
                    <div className="diag-ring-label">{readinessLabel}</div>
                  </div>
                </div>
                <div className="diag-readiness-stats">
                  <div className="diag-rs"><div className="diag-rs-val">{st.diagsTaken}</div><div className="diag-rs-label">Diagnostics Taken</div></div>
                  <div className="diag-rs"><div className="diag-rs-val">{st.bestScore}%</div><div className="diag-rs-label">Best Score</div></div>
                  <div className="diag-rs"><div className="diag-rs-val">{st.avgScore}%</div><div className="diag-rs-label">Average Score</div></div>
                  <div className="diag-rs"><div className="diag-rs-val">{t.categories.length}</div><div className="diag-rs-label">Categories</div></div>
                </div>
              </div>

              {/* High Performance Recommendation */}
              {readinessScore >= 70 && st.diagsTaken >= 1 && (
                <div style={{background:'linear-gradient(135deg, rgba(22,163,74,0.06), rgba(34,197,94,0.04))',border:'1.5px solid rgba(22,163,74,0.2)',borderRadius:12,padding:'16px 18px',marginBottom:20,display:'flex',alignItems:'flex-start',gap:12}}>
                  <div style={{width:28,height:28,borderRadius:8,background:'rgba(22,163,74,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:3}}>Strong performance - keep pushing</div>
                    <div style={{fontSize:12,color:'var(--text-3)',lineHeight:1.6}}>
                      You're scoring well on {t.title} diagnostics. To solidify your prep, we recommend going through as many of the <a href="/flashcards" style={{color:'var(--text)',fontWeight:700,textDecoration:'underline'}}>Interview Flashcards</a> as possible. The more cards you drill, the sharper you'll be under pressure.
                    </div>
                  </div>
                </div>
              )}
              {st.cats.length > 0 && (
                <div className="diag-section">
                  <div className="diag-section-title">Category Breakdown</div>
                  <div className="diag-section-sub">Performance across {t.title} topics</div>
                  <div className="diag-mastery-grid">
                    {st.cats.map(c => {
                      const color = c.pct >= 80 ? '#16a34a' : c.pct >= 60 ? '#d97706' : c.pct >= 40 ? '#f59e0b' : '#dc2626';
                      return (
                        <div key={c.cat} className="diag-mastery-item">
                          <div className="diag-mastery-top">
                            <span className="diag-mastery-cat">{c.cat}</span>
                            <span className="diag-mastery-pct" style={{ color }}>{c.pct}%</span>
                          </div>
                          <div className="diag-mastery-bar-wrap">
                            <div className="diag-mastery-bar" style={{ width: `${c.pct}%`, background: color }} />
                          </div>
                          <div className="diag-mastery-detail">{c.correct}/{c.total} correct</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* History for this track */}
              {st.history.length > 0 && (
                <div className="diag-section">
                  <div className="diag-section-title">History</div>
                  <div className="diag-history-list">
                    {st.history.slice(0, 10).map(h => {
                      const hColor = h.score >= 80 ? '#16a34a' : h.score >= 55 ? '#d97706' : '#dc2626';
                      const dateStr = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      return (
                        <div key={h.id} className="diag-history-row">
                          <div className="diag-history-track">{dateStr}</div>
                          <div className="diag-history-detail">{h.totalCorrect}/{h.totalAnswered}</div>
                          <div className="diag-history-score" style={{ color: hColor }}>{h.score}%</div>
                          <div className="diag-history-bar-wrap">
                            <div className="diag-history-bar" style={{ width: `${h.score}%`, background: hColor }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Focus Areas for this track */}
              {st.cats.filter(c => c.pct < 50 && c.total >= 2).length > 0 && (
                <div className="diag-section">
                  <div className="diag-section-title">Focus Areas</div>
                  <div className="diag-focus-list">
                    {st.cats.filter(c => c.pct < 50 && c.total >= 2).map(c => (
                      <div key={c.cat} className="diag-focus-item">
                        <div className="diag-focus-dot" />
                        <div>
                          <div className="diag-focus-cat">{c.cat}</div>
                          <div className="diag-focus-detail">{c.pct}% accuracy ({c.correct}/{c.total}) - drill this in Flashcards and Concept Drills</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="diag-cta-btn" onClick={() => { setTrackKey(viewTrack); const tr = TRACKS[viewTrack]; const qs = buildAssessment(tr); setQuestions(qs); setIdx(0); setSelected(null); setShowExp(false); setTimer(TIME_PER_Q); setCatResults({}); setTotalCorrect(0); setTotalAnswered(0); setMissed([]); setPhase('assess'); }} type="button">
                Take {t.title} Diagnostic
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            </div>
          </main>
        </div>
      );
    }

    // Main landing - career track selection grid
    return (
      <div className="app"><Sidebar activePage="diagnostic-review" />
        <main className="diag-main">
          <div className="diag-container">
            <div className="diag-title">Diagnostic <em>Review</em></div>
            <div className="diag-sub">Select a career track to view your readiness or take a diagnostic assessment.</div>

            <div className="diag-track-select-grid">
              {Object.entries(TRACKS).map(([k, t]) => {
                const st = trackStats(k);
                const hasData = st.diagsTaken > 0;
                const scoreColor = st.avgScore >= 80 ? '#16a34a' : st.avgScore >= 55 ? '#d97706' : st.avgScore > 0 ? '#f59e0b' : 'var(--text-3)';
                return (
                  <div key={k} className="diag-track-select-card" onClick={() => setViewTrack(k)}>
                    <div className="diag-tsc-title">{t.title}</div>
                    {hasData ? (
                      <div className="diag-tsc-stats">
                        <div className="diag-tsc-score" style={{ color: scoreColor }}>{st.avgScore}%</div>
                        <div className="diag-tsc-detail">{st.diagsTaken} diagnostic{st.diagsTaken > 1 ? 's' : ''} · Best: {st.bestScore}%</div>
                      </div>
                    ) : (
                      <div className="diag-tsc-empty">No diagnostics yet</div>
                    )}
                    <div className="diag-tsc-arrow">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ═══ TRACK SELECTION ═══
  if (phase === 'select') return (
    <div className="app"><Sidebar activePage="diagnostic-review" />
      <main className="diag-main">
        <div className="diag-container">
          <button className="diag-back-link" onClick={() => setPhase('home')} type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Overview
          </button>
          <div className="diag-title">Start <em>Diagnostic</em></div>
          <div className="diag-sub">Select a career track. You will be tested on {QUESTIONS_PER_CAT} questions per category, with {TIME_PER_Q} seconds per question.</div>
          <div className="diag-track-grid">
            {Object.entries(TRACKS).map(([k, t]) => (
              <button key={k} className={`diag-track-btn${trackKey === k ? ' active' : ''}`} onClick={() => setTrackKey(k)} type="button">{t.title}</button>
            ))}
          </div>
          <button className={`diag-start-btn ${trackKey ? 'ready' : 'disabled'}`} onClick={startAssessment} type="button">
            {trackKey ? `Start ${TRACKS[trackKey].title} Diagnostic (${TRACKS[trackKey].categories.length * QUESTIONS_PER_CAT} questions)` : 'Select a career track'}
          </button>
        </div>
      </main>
    </div>
  );

  // ═══ ASSESSMENT ═══
  if (phase === 'assess' && q && track) return (
    <div className="app"><Sidebar activePage="diagnostic-review" />
      <main className="diag-main">
        <div className="diag-container">
          <div className="diag-top">
            <div className="diag-top-left">
              <div className="diag-top-track">{track.title} <em>Diagnostic</em></div>
              <span className="diag-top-cat">{q.category}</span>
            </div>
            <div className="diag-top-right">
              <span className={`diag-timer ${timer > 20 ? 'ok' : timer > 10 ? 'warn' : 'danger'}`}>{timer}s</span>
              <span className="diag-counter">{idx + 1} / {questions.length}</span>
            </div>
          </div>
          <div className="diag-progress-wrap"><div className="diag-progress-bar" style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
          <div className="diag-q-card">
            <div className="diag-q-num">Question {idx + 1} of {questions.length} - {q.category}</div>
            <div className="diag-q-text">{q.q}</div>
          </div>
          <div className="diag-choices">
            {q.options.map((opt, i) => {
              let cls = 'diag-choice';
              if (selected !== null) { if (i === q.correct) cls += ' correct'; else if (i === selected) cls += ' wrong'; else cls += ' faded'; }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)} type="button" disabled={selected !== null}>
                  <span className="diag-choice-letter">{'ABCD'[i]}</span>
                  <span className="diag-choice-text">{opt}</span>
                  {selected !== null && i === q.correct && <span className="diag-choice-tag ok">Correct</span>}
                  {selected !== null && i === selected && i !== q.correct && <span className="diag-choice-tag no">Wrong</span>}
                  {selected === -1 && i === q.correct && <span className="diag-choice-tag ok">Answer</span>}
                </button>
              );
            })}
          </div>
          {showExp && (
            <>
              <div className={`diag-exp ${selected === q.correct ? 'correct' : 'wrong'}`}>
                <div className="diag-exp-label">{selected === q.correct ? 'Correct' : selected === -1 ? 'Time is up' : 'Incorrect'}</div>
                {q.explanation}
              </div>
              <button className="diag-next-btn" onClick={nextQ} type="button">
                {idx + 1 >= questions.length ? 'See Results' : 'Next Question'}
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );

  // ═══ RESULTS ═══
  const sortedCats = track ? track.categories.map(cat => {
    const r = catResults[cat] || { total: 0, correct: 0 };
    const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    return { cat, ...r, pct };
  }).sort((a, b) => b.pct - a.pct) : [];
  const strengths = sortedCats.filter(c => c.pct >= 80);
  const weaknesses = sortedCats.filter(c => c.pct < 50 && c.total > 0);

  return (
    <div className="app"><Sidebar activePage="diagnostic-review" />
      <main className="diag-main">
        <div className="diag-container">
          <div className="diag-results">
            <div className="diag-results-header">
              <div className="diag-results-title">{track?.title} <em>Diagnostic Results</em></div>
              <div className={`diag-overall-score ${vc}`}>{overallPct}%</div>
              <div className={`diag-verdict ${vc}`}>{vt}</div>
              <div className="diag-verdict-sub">{totalCorrect} of {totalAnswered} correct</div>
            </div>
            {overallPct >= 70 && (
              <div style={{background:'linear-gradient(135deg, rgba(22,163,74,0.06), rgba(34,197,94,0.04))',border:'1.5px solid rgba(22,163,74,0.2)',borderRadius:12,padding:'16px 18px',marginBottom:16,display:'flex',alignItems:'flex-start',gap:12}}>
                <div style={{width:28,height:28,borderRadius:8,background:'rgba(22,163,74,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:3}}>Nice score - you're building momentum</div>
                  <div style={{fontSize:12,color:'var(--text-3)',lineHeight:1.6}}>
                    Due to your strong performance, we recommend going through as many of the <a href="/flashcards" style={{color:'var(--text)',fontWeight:700,textDecoration:'underline'}}>Interview Flashcards</a> as possible to lock in your knowledge before interviews.
                  </div>
                </div>
              </div>
            )}
            <div className="diag-cats">
              <div className="diag-cats-title">Performance by Category</div>
              {sortedCats.map(c => {
                const cls = c.pct >= 80 ? 'strong' : c.pct >= 50 ? 'mid' : 'weak';
                const color = c.pct >= 80 ? '#16a34a' : c.pct >= 50 ? '#d97706' : '#dc2626';
                return (
                  <div key={c.cat} className="diag-cat-row">
                    <div className="diag-cat-name">{c.cat}</div>
                    <div className="diag-cat-bar-wrap"><div className={`diag-cat-bar ${cls}`} style={{ width: `${c.pct}%` }} /></div>
                    <div className="diag-cat-pct" style={{ color }}>{c.pct}%</div>
                  </div>
                );
              })}
            </div>
            <div className="diag-insights">
              <div className="diag-insights-title">Insights</div>
              {strengths.map(s => (<div key={s.cat} className="diag-insight strength"><strong>{s.cat}</strong> is a strength - {s.correct}/{s.total} correct ({s.pct}%). Keep sharpening here.</div>))}
              {weaknesses.map(w => (<div key={w.cat} className="diag-insight weakness"><strong>{w.cat}</strong> needs significant work - {w.correct}/{w.total} correct ({w.pct}%). Prioritize this in your prep.</div>))}
              {weaknesses.length === 0 && strengths.length === sortedCats.length && (<div className="diag-insight strength">Strong performance across all categories. Focus on speed and depth.</div>)}
              {overallPct < 60 && (<div className="diag-insight tip">Focus on Interview Flashcards for your weakest categories. Drill 20-30 cards per day in {weaknesses[0]?.cat || 'your weakest area'} before moving on.</div>)}
              {overallPct >= 60 && overallPct < 80 && (<div className="diag-insight tip">Solid foundation. Use Concept Drills to test under pressure, focus flashcard sessions on {weaknesses.length > 0 ? weaknesses.map(w => w.cat).join(' and ') : 'advanced topics'}.</div>)}
              {overallPct >= 80 && (<div className="diag-insight tip">You are interview-ready on fundamentals. Shift focus to mock interviews, behavioral storytelling, and firm-specific research.</div>)}
            </div>
            {missed.length > 0 && (
              <div className="diag-missed">
                <div className="diag-missed-title">Questions You Missed ({missed.length})</div>
                {missed.map((m, i) => (<div key={i} className="diag-missed-item"><div className="diag-missed-q">{m.q}</div><div className="diag-missed-a">{m.explanation}</div></div>))}
              </div>
            )}
            <div className="diag-actions">
              <button className="diag-action-btn diag-action-primary" onClick={() => { setPhase('home'); }} type="button">Back to Overview</button>
              <button className="diag-action-btn diag-action-secondary" onClick={() => { startAssessment(); }} type="button">Retake</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
