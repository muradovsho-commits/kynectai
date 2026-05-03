'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
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
  if (allQ.length < 10) {
    const used = new Set(allQ.map(q => q.q));
    const remaining = shuffle(track.questions.filter(q => !used.has(q.q))).slice(0, 10 - allQ.length);
    for (const d of remaining) {
      allQ.push({ q: d.q, category: d.topic, options: d.options, correct: d.correct, explanation: d.explanation });
    }
  }
  return shuffle(allQ);
}

function loadHistory(): DiagResult[] { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }
function saveHistory(h: DiagResult[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); }

type Phase = 'home' | 'select' | 'assess' | 'results';

const ARROW = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const BACK_ARROW = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const ARROW_R = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>;

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
      const perfTrackKey = `offerbell_flash_perf_${trackKey}`;
      const raw = localStorage.getItem(perfTrackKey);
      const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
      p.seen = (p.seen || 0) + 1;
      if (ok) p.pass = (p.pass || 0) + 1; else p.fail = (p.fail || 0) + 1;
      const cat = q.category;
      if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
      p.byCat[cat].seen++; if (ok) p.byCat[cat].pass++;
      localStorage.setItem(perfTrackKey, JSON.stringify(p));
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
  const vDesc = overallPct >= 80 ? 'Strong command of fundamentals across most categories.' : overallPct >= 65 ? 'Good base. Sharpen weak areas and drill consistency.' : overallPct >= 40 ? 'Foundation forming. Prioritize weakest categories first.' : 'Early stage. Work through guides and flashcards first.';

  const trackStats = (tk: string) => {
    const th = history.filter(h => h.track === tk);
    const diagsTaken = th.length;
    const bestScore = th.length > 0 ? Math.max(...th.map(h => h.score)) : 0;
    const avgScore = th.length > 0 ? Math.round(th.reduce((s, h) => s + h.score, 0) / th.length) : 0;
    const catAgg: Record<string, { total: number; correct: number }> = {};
    for (const h of th) {
      for (const [cat, sc] of Object.entries(h.catScores)) {
        if (!catAgg[cat]) catAgg[cat] = { total: 0, correct: 0 };
        catAgg[cat].total += sc.total;
        catAgg[cat].correct += sc.correct;
      }
    }
    const cats = Object.entries(catAgg).map(([cat, d]) => ({ cat, ...d, pct: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0 })).sort((a, b) => b.pct - a.pct);
    return { diagsTaken, bestScore, avgScore, cats, history: th };
  };

  // ═══ HOME ═══
  if (phase === 'home') {
    // Track detail view
    if (viewTrack && TRACKS[viewTrack]) {
      const t = TRACKS[viewTrack];
      const st = trackStats(viewTrack);
      const readinessScore = st.avgScore;
      const readinessLabel = readinessScore >= 80 ? 'Interview Ready' : readinessScore >= 65 ? 'Solid Foundation' : readinessScore >= 50 ? 'Getting There' : readinessScore >= 30 ? 'Building Up' : st.diagsTaken > 0 ? 'Just Starting' : 'Not Started';
      const readinessDesc = readinessScore >= 80 ? 'Strong performance across categories. Focus on depth and mock interviews.' : readinessScore >= 65 ? 'Solid foundation. Target weak categories to close the gap.' : readinessScore >= 50 ? 'Building momentum. Continue drilling to reach interview-ready.' : readinessScore >= 30 ? 'Early stage. Work through guides and flashcards before diagnostics.' : st.diagsTaken > 0 ? 'Just getting started. Keep taking diagnostics to build a baseline.' : 'Take your first diagnostic to establish a baseline.';
      const scoreCls = readinessScore >= 80 ? 'strong' : readinessScore >= 55 ? 'mid' : readinessScore > 0 ? 'weak' : 'none';
      const weakCats = st.cats.filter(c => c.pct < 50 && c.total >= 2);

      return (
        <div className="app"><Sidebar activePage="diagnostic-review" />
          <main className="diag-main">
            <div className="diag-wrap">
              <button className="diag-back" onClick={() => setViewTrack(null)} type="button">
                {BACK_ARROW}All Tracks
              </button>

              {/* Hero with giant score */}
              <div className="diag-detail-hero">
                <div className="diag-detail-hero-top">
                  <div className="diag-detail-track-name">{t.title}<br/><em>Readiness Report</em></div>
                  <div className="diag-detail-tag">{st.diagsTaken > 0 ? `${st.diagsTaken} Diagnostic${st.diagsTaken > 1 ? 's' : ''}` : 'Not Started'}</div>
                </div>

                <div className="diag-mega-score-row">
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <span className={`diag-mega-score ${scoreCls}`}>{st.diagsTaken > 0 ? readinessScore : '—'}</span>
                    {st.diagsTaken > 0 && <span className="diag-mega-sign">%</span>}
                  </div>
                  <div className="diag-mega-label">
                    <div className="diag-mega-label-title">{readinessLabel}</div>
                    <div className="diag-mega-label-desc">{readinessDesc}</div>
                  </div>
                  <div className="diag-mega-meta">
                    <div className="diag-mega-meta-item">
                      <div className="diag-mega-meta-val">{st.bestScore || '—'}{st.bestScore > 0 ? '%' : ''}</div>
                      <div className="diag-mega-meta-label">Best</div>
                    </div>
                    <div className="diag-mega-meta-item">
                      <div className="diag-mega-meta-val">{t.categories.length}</div>
                      <div className="diag-mega-meta-label">Categories</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strong performance pullquote */}
              {readinessScore >= 70 && st.diagsTaken >= 1 && (
                <div className="diag-pullquote">
                  <div className="diag-pullquote-eyebrow">Recommendation</div>
                  <div className="diag-pullquote-text">
                    Strong scores on {t.title} diagnostics. To solidify, drill <a href="/flashcards">Interview Flashcards</a> — the more cards, the sharper you'll be under pressure.
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              {st.cats.length > 0 && (
                <>
                  <div className="diag-section-head">
                    <div className="diag-section-h">Category <em>Breakdown</em></div>
                    <div className="diag-section-meta">{t.title}</div>
                  </div>
                  <div className="diag-cat-list">
                    {st.cats.map((c, i) => {
                      const color = c.pct >= 80 ? '#16a34a' : c.pct >= 60 ? '#d97706' : c.pct >= 40 ? '#f59e0b' : '#dc2626';
                      return (
                        <div key={c.cat} className="diag-cat-entry">
                          <span className="diag-cat-rank">{String(i + 1).padStart(2, '0')}</span>
                          <div className="diag-cat-main">
                            <div className="diag-cat-heading">{c.cat}</div>
                            <div className="diag-cat-detail">{c.correct} of {c.total} correct</div>
                          </div>
                          <div className="diag-cat-bar-container">
                            <div className="diag-cat-bar-fill" style={{ width: `${c.pct}%`, background: color }} />
                          </div>
                          <div className="diag-cat-pct" style={{ color }}>{c.pct}<span style={{ fontSize: 12, color: 'var(--text-3)' }}>%</span></div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Focus areas */}
              {weakCats.length > 0 && (
                <div className="diag-focus-card">
                  <div className="diag-focus-head">
                    <span className="diag-focus-label">Priority Focus</span>
                  </div>
                  <div className="diag-focus-title">These areas need <em>urgent work</em></div>
                  <div className="diag-focus-desc">Click a topic to jump straight into drilling it.</div>
                  <div className="diag-focus-chips">
                    {weakCats.map(c => (
                      <Link key={c.cat} href={`/concept-drills?track=${encodeURIComponent(viewTrack || '')}&topic=${encodeURIComponent(c.cat)}`} className="diag-focus-chip" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        {c.cat} <strong>{c.pct}%</strong>
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: 4, opacity: 0.5 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <Link href={`/flashcards?track=${viewTrack === 'ib' ? 'ib' : viewTrack === 'pe' ? 'pe' : viewTrack === 'consulting' ? 'consulting' : viewTrack === 'accounting' ? 'accounting' : viewTrack || 'ib'}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Open Flashcards for this track <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* History */}
              {st.history.length > 0 && (
                <div style={{ marginTop: 40 }}>
                  <div className="diag-section-head">
                    <div className="diag-section-h">Timeline</div>
                    <div className="diag-section-meta">Last {Math.min(st.history.length, 10)}</div>
                  </div>
                  <div className="diag-history-table">
                    {st.history.slice(0, 10).map(h => {
                      const hColor = h.score >= 80 ? '#16a34a' : h.score >= 55 ? '#d97706' : '#dc2626';
                      const dateStr = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <div key={h.id} className="diag-history-entry">
                          <div className="diag-hist-date">{dateStr}</div>
                          <div className="diag-hist-bar">
                            <div className="diag-hist-bar-fill" style={{ width: `${h.score}%`, background: hColor }} />
                          </div>
                          <div className="diag-hist-ratio">{h.totalCorrect}/{h.totalAnswered}</div>
                          <div className="diag-hist-score" style={{ color: hColor }}>{h.score}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button className="diag-cta-primary" onClick={() => {
                // Free users: 1 diagnostic total
                const plan = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_plan') || 'free') : 'free';
                if (plan !== 'pro' && plan !== 'elite') {
                  const totalTaken = allStats.reduce((sum, s) => sum + s.st.diagsTaken, 0);
                  if (totalTaken >= 1) {
                    alert('Free plan includes 1 diagnostic. Upgrade to Pro for unlimited diagnostics across all tracks.');
                    return;
                  }
                }
                setTrackKey(viewTrack); const tr = TRACKS[viewTrack]; const qs = buildAssessment(tr); setQuestions(qs); setIdx(0); setSelected(null); setShowExp(false); setTimer(TIME_PER_Q); setCatResults({}); setTotalCorrect(0); setTotalAnswered(0); setMissed([]); setPhase('assess');
              }} type="button">
                {st.diagsTaken > 0 ? 'Take Another Diagnostic' : `Start ${t.title} Diagnostic`}
                {ARROW}
              </button>
            </div>
          </main>
        </div>
      );
    }

    // Main landing — all tracks
    const allLatest = history.slice(0, 20);
    const totalDiagnostics = history.length;
    const allTrackEntries = Object.entries(TRACKS);
    const allStats = allTrackEntries.map(([k, t]) => ({ k, t, st: trackStats(k) }));
    const tracksWithData = allStats.filter(s => s.st.diagsTaken > 0);
    const overallAvg = tracksWithData.length > 0 ? Math.round(tracksWithData.reduce((s, x) => s + x.st.avgScore, 0) / tracksWithData.length) : 0;
    const bestTrackOverall = tracksWithData.length > 0 ? tracksWithData.reduce((a, b) => a.st.bestScore > b.st.bestScore ? a : b) : null;

    return (
      <div className="app"><Sidebar activePage="diagnostic-review" />
        <main className="diag-main">
          <div className="diag-wrap">
            <div className="diag-eyebrow">OfferBell Assessment</div>
            <div className="diag-hero-title">Diagnostic<br/><em>Review</em></div>
            <div className="diag-lede">Test your interview readiness across career tracks. Timed MCQs across every core category, with detailed performance reports and targeted recommendations.</div>

            {/* Hero stats row */}
            <div className="diag-hero-row">
              <div className="diag-hero-stat">
                <div>
                  <div className="diag-hero-stat-label">Overall Average</div>
                  <div className="diag-hero-stat-num">
                    {totalDiagnostics > 0 ? overallAvg : '—'}
                    {totalDiagnostics > 0 && <span style={{ fontSize: 28, color: 'var(--text-3)', fontStyle: 'italic' }}>%</span>}
                  </div>
                </div>
                <div className="diag-hero-stat-sub">{tracksWithData.length} track{tracksWithData.length !== 1 ? 's' : ''} assessed</div>
              </div>
              <div className="diag-hero-stat">
                <div>
                  <div className="diag-hero-stat-label">Total Taken</div>
                  <div className="diag-hero-stat-num">{totalDiagnostics || '0'}</div>
                </div>
                <div className="diag-hero-stat-sub">All time</div>
              </div>
              <div className="diag-hero-stat">
                <div>
                  <div className="diag-hero-stat-label">Best Track</div>
                  <div className="diag-hero-stat-num" style={{ fontSize: bestTrackOverall ? 26 : 52 }}>
                    {bestTrackOverall ? bestTrackOverall.t.title.split(' ')[0] : '—'}
                  </div>
                </div>
                <div className="diag-hero-stat-sub">{bestTrackOverall ? `${bestTrackOverall.st.bestScore}% best` : 'No data'}</div>
              </div>
              <div className="diag-hero-stat">
                <div>
                  <div className="diag-hero-stat-label">Avail. Tracks</div>
                  <div className="diag-hero-stat-num">{allTrackEntries.length}</div>
                </div>
                <div className="diag-hero-stat-sub">Ready to assess</div>
              </div>
            </div>

            {/* Track list */}
            <div className="diag-section-head">
              <div className="diag-section-h">Select a <em>Track</em></div>
              <div className="diag-section-meta">{allTrackEntries.length} available</div>
            </div>

            <div className="diag-track-list">
              {allStats.map(({ k, t, st }, i) => {
                const scoreColor = st.avgScore >= 80 ? '#16a34a' : st.avgScore >= 55 ? '#d97706' : st.avgScore > 0 ? '#dc2626' : 'var(--text-3)';
                const recent = st.history.slice(0, 6).reverse();
                return (
                  <div key={k} className="diag-track-row" onClick={() => setViewTrack(k)}>
                    <span className="diag-tr-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="diag-tr-name">{t.title}</div>
                      <div className="diag-tr-name-sub">{t.categories.length} categories</div>
                    </div>
                    <div>
                      <div className="diag-tr-label">Avg Score</div>
                      {st.diagsTaken > 0 ? (
                        <div className="diag-tr-val" style={{ color: scoreColor }}>{st.avgScore}<span style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>%</span></div>
                      ) : (
                        <div className="diag-tr-val-none">—</div>
                      )}
                    </div>
                    <div>
                      <div className="diag-tr-label">Best</div>
                      {st.diagsTaken > 0 ? (
                        <div className="diag-tr-val">{st.bestScore}<span style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>%</span></div>
                      ) : (
                        <div className="diag-tr-val-none">—</div>
                      )}
                    </div>
                    <div>
                      <div className="diag-tr-label">Trend</div>
                      <div className="diag-tr-spark">
                        {recent.length > 0 ? recent.map((h, j) => (
                          <div key={j} className="diag-spark-bar" style={{ height: `${Math.max(4, (h.score / 100) * 28)}px`, background: h.score >= 70 ? '#16a34a' : h.score >= 50 ? '#d97706' : '#dc2626', opacity: 0.85 }} />
                        )) : <div style={{ fontSize: 18, color: 'var(--border-2)', fontStyle: 'italic', fontFamily: "'Instrument Serif', serif" }}>—</div>}
                      </div>
                    </div>
                    <div className="diag-tr-arrow">{ARROW_R}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ═══ ASSESSMENT ═══
  if (phase === 'assess' && q && track) return (
    <div className="app"><Sidebar activePage="diagnostic-review" />
      <main className="diag-main">
        <div className="diag-assess-wrap">
          <div className="diag-assess-top">
            <div className="diag-assess-left">
              <span className="diag-assess-track">{track.title} <em>Diagnostic</em></span>
              <span className="diag-assess-chip">{q.category}</span>
            </div>
            <div className="diag-assess-right">
              <span className={`diag-timer ${timer > 20 ? 'ok' : timer > 10 ? 'warn' : 'danger'}`}>{String(timer).padStart(2, '0')}<span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-3)', marginLeft: 2 }}>s</span></span>
              <span className="diag-counter">Q{idx + 1} / {questions.length}</span>
            </div>
          </div>
          <div className="diag-prog-track">
            <div className="diag-prog-fill" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="diag-q-block">
            <div className="diag-q-num">Question {idx + 1} of {questions.length}</div>
            <div className="diag-q-text">{q.q}</div>
          </div>

          <div className="diag-opts">
            {q.options.map((opt, i) => {
              let cls = 'diag-opt';
              if (selected !== null) { if (i === q.correct) cls += ' correct'; else if (i === selected) cls += ' wrong'; else cls += ' faded'; }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(i)} type="button" disabled={selected !== null}>
                  <span className="diag-opt-letter">{'ABCD'[i]}</span>
                  <span className="diag-opt-txt">{opt}</span>
                  {selected !== null && i === q.correct && <span className="diag-opt-tag ok">Correct</span>}
                  {selected !== null && i === selected && i !== q.correct && <span className="diag-opt-tag no">Wrong</span>}
                  {selected === -1 && i === q.correct && <span className="diag-opt-tag ok">Answer</span>}
                </button>
              );
            })}
          </div>

          {showExp && (
            <div className={`diag-explain ${selected === q.correct ? 'correct' : 'wrong'}`}>
              <div className="diag-explain-head">{selected === q.correct ? 'Correct' : selected === -1 ? 'Time expired' : 'Incorrect'}</div>
              <div className="diag-explain-txt">{q.explanation}</div>
              <button className="diag-next" onClick={nextQ} type="button">
                {idx + 1 >= questions.length ? 'See Results' : 'Next Question'}
                {ARROW}
              </button>
            </div>
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

  return (
    <div className="app"><Sidebar activePage="diagnostic-review" />
      <main className="diag-main">
        <div className="diag-results-wrap">
          <div className="diag-results-mark">Diagnostic Complete</div>
          <div className="diag-results-title">{track?.title}<br/><em>Performance Report</em></div>

          {/* Main scorecard */}
          <div className="diag-results-scorecard">
            <span className="diag-results-corner tl">OfferBell</span>
            <span className="diag-results-corner tr">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <div className={`diag-results-scorecard-verdict ${vc}`}>{vt}</div>
            <div className={`diag-big-score ${vc}`}>{overallPct}<span className="diag-big-score-pct">%</span></div>
            <div className="diag-results-verdict-line">{vDesc}</div>
            <div className="diag-results-ratio">{totalCorrect} of {totalAnswered} correct</div>
          </div>

          {overallPct >= 70 && (
            <div className="diag-pullquote">
              <div className="diag-pullquote-eyebrow">Next Step</div>
              <div className="diag-pullquote-text">Nice work — you're building momentum. Drill <a href="/flashcards">Interview Flashcards</a> to lock in this knowledge before real interviews.</div>
            </div>
          )}

          {/* Cat breakdown */}
          {sortedCats.length > 0 && (
            <div className="diag-cat-results">
              <div className="diag-section-head">
                <div className="diag-section-h">Performance by <em>Category</em></div>
                <div className="diag-section-meta">Ranked</div>
              </div>
              {sortedCats.map((c, i) => {
                const color = c.pct >= 80 ? '#16a34a' : c.pct >= 50 ? '#d97706' : '#dc2626';
                return (
                  <div key={c.cat} className="diag-cat-result-row">
                    <span className="diag-cat-result-rank">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="diag-cat-result-name">{c.cat}</div>
                      <div className="diag-cat-result-sub">{c.correct} of {c.total} correct</div>
                    </div>
                    <div className="diag-cat-result-bar-wrap">
                      <div className="diag-cat-result-bar" style={{ width: `${c.pct}%`, background: color }} />
                    </div>
                    <div className="diag-cat-result-pct" style={{ color }}>{c.pct}<span style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>%</span></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Missed questions */}
          {missed.length > 0 && (
            <div className="diag-missed-section">
              <div className="diag-section-head">
                <div className="diag-section-h">Questions <em>Missed</em></div>
                <div className="diag-section-meta">{missed.length} to review</div>
              </div>
              <div className="diag-missed-list">
                {missed.map((m, i) => (
                  <div key={i} className="diag-missed-card">
                    <div className="diag-missed-q-label">{m.category}</div>
                    <div className="diag-missed-q-text">{m.q}</div>
                    <div className="diag-missed-a">{m.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="diag-results-actions">
            <button className="diag-cta-primary" onClick={() => setPhase('home')} type="button">Back to Overview{ARROW}</button>
            <button className="diag-cta-ghost" onClick={startAssessment} type="button">Retake</button>
          </div>
        </div>
      </main>
    </div>
  );
}
