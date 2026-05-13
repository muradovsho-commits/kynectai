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

import { getUserPlan, PLAN_LIMITS } from '../lib/plan';

const PROGRESS_KEY = 'offerbell_diag_in_progress';

type InProgressState = {
  trackKey: string;
  questions: MCQ[];
  idx: number;
  catResults: Record<string, CatResult>;
  totalCorrect: number;
  totalAnswered: number;
  missed: { q: string; explanation: string; category: string }[];
  savedAt: number;
};

function saveInProgress(state: InProgressState | null) {
  if (state) localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  else localStorage.removeItem(PROGRESS_KEY);
}

function loadInProgress(): InProgressState | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    // Expire after 24 hours
    if (Date.now() - state.savedAt > 24 * 60 * 60 * 1000) { localStorage.removeItem(PROGRESS_KEY); return null; }
    return state;
  } catch { return null; }
}

// Confirmation modal for per-track or all-track diagnostic history resets.
// target === 'all' triggers a global wipe; any other string is a track key.
function DiagResetModal({ target, onCancel, onConfirm }: { target: string; onCancel: () => void; onConfirm: () => void }) {
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
        width: 440, maxWidth: '100%',
        boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#dc2626', marginBottom: 10 }}>
          Reset {isAll ? 'all diagnostic history' : `${trackName} history`}
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.3px', color: 'var(--text)', marginBottom: 12 }}>
          Are you <em style={{ fontStyle: 'italic' }}>sure?</em>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 22 }}>
          {isAll
            ? 'This deletes every past diagnostic across all 10 tracks - scores, category breakdowns, and timeline. You can take new diagnostics any time, but the old ones are gone. This cannot be undone.'
            : `This deletes every past ${trackName} diagnostic - scores, category breakdowns, and timeline. Other tracks are unaffected. You can take new diagnostics any time. This cannot be undone.`}
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
  const [userPlan, setUserPlan] = useState<string>('free');
  const [savedProgress, setSavedProgress] = useState<InProgressState | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Per-track or all-track reset modal. null = closed.
  // 'all' = wipe entire diag history. trackKey string = wipe just that track's entries.
  const [resetTarget, setResetTarget] = useState<'all' | string | null>(null);

  const doReset = () => {
    if (resetTarget === null) return;
    try {
      if (resetTarget === 'all') {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([]);
      } else {
        const remaining = history.filter(h => h.track !== resetTarget);
        saveHistory(remaining);
        setHistory(remaining);
      }
    } catch {}
    setResetTarget(null);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    setHistory(loadHistory());
    setUserPlan(getUserPlan());
    setSavedProgress(loadInProgress());
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
    setSavedProgress(null);
    // Save initial state
    saveInProgress({ trackKey, questions: qs, idx: 0, catResults: {}, totalCorrect: 0, totalAnswered: 0, missed: [], savedAt: Date.now() });
  };

  const resumeAssessment = () => {
    if (!savedProgress) return;
    setTrackKey(savedProgress.trackKey);
    setQuestions(savedProgress.questions);
    setIdx(savedProgress.idx);
    setCatResults(savedProgress.catResults);
    setTotalCorrect(savedProgress.totalCorrect);
    setTotalAnswered(savedProgress.totalAnswered);
    setMissed(savedProgress.missed);
    setSelected(null); setShowExp(false); setTimer(TIME_PER_Q);
    setPhase('assess');
    setSavedProgress(null);
  };

  const discardProgress = () => {
    saveInProgress(null);
    setSavedProgress(null);
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
    const nextIdx = idx + 1;
    setIdx(nextIdx); setSelected(null); setShowExp(false); setTimer(TIME_PER_Q);
    // Save progress so user can resume if they navigate away
    saveInProgress({
      trackKey, questions, idx: nextIdx,
      catResults: { ...catResults },
      totalCorrect, totalAnswered, missed: [...missed],
      savedAt: Date.now(),
    });
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
    saveInProgress(null); // Clear saved progress
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

      // ─── shared atoms (consistent with concept-drills aesthetic) ───
      const D_PAGE_OUTER: React.CSSProperties = { padding: '32px 36px 80px' };
      const D_PAGE_INNER: React.CSSProperties = { maxWidth: 920, margin: '0 auto', fontFamily: "'Sora', sans-serif" };
      const D_EYEBROW: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)' };
      const D_SERIF: React.CSSProperties = { fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.8px', color: 'var(--text)', fontWeight: 400, margin: 0 };
      const D_CARD: React.CSSProperties = { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 };
      const D_BACK: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 7, background: 'transparent', border: '1.5px solid transparent', color: 'var(--text-3)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginLeft: -10 };
      const scoreColor = readinessScore >= 70 ? '#22c55e' : readinessScore >= 50 ? '#f59e0b' : readinessScore > 0 ? '#dc2626' : 'var(--text-3)';

      return (
        <div className="app">
          <Sidebar activePage="diagnostic-review" />
          <main className="main" style={D_PAGE_OUTER}>
            <div style={D_PAGE_INNER}>

              <button onClick={() => setViewTrack(null)} type="button" style={D_BACK}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                All tracks
              </button>

              {/* Header */}
              <div style={{ margin: '14px 0 24px' }}>
                <div style={{ ...D_EYEBROW, marginBottom: 10 }}>{t.title}</div>
                <h1 style={D_SERIF}>Readiness <em style={{ fontStyle: 'italic' }}>report</em></h1>
                <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
                  {st.diagsTaken > 0 ? `${st.diagsTaken} diagnostic${st.diagsTaken > 1 ? 's' : ''} completed. Performance below is averaged across all attempts.` : 'No diagnostics yet. Take one to see your category-by-category breakdown.'}
                </p>
              </div>

              {/* Score + readiness card */}
              <div style={{ ...D_CARD, padding: '28px 32px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 32 }} className="diag-readiness-card">
                <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
                    {st.diagsTaken > 0 && (
                      <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="9" strokeDasharray={`${(readinessScore / 100) * 264} 264`} strokeLinecap="round" />
                    )}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif', serif" }}>
                    <div style={{ fontSize: 32, fontStyle: 'italic', color: scoreColor, lineHeight: 1, letterSpacing: '-0.5px' }}>
                      {st.diagsTaken > 0 ? readinessScore : '-'}
                      {st.diagsTaken > 0 && <span style={{ fontSize: 15, color: 'var(--text-3)' }}>%</span>}
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{readinessLabel}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>{readinessDesc}</div>
                </div>
                <div style={{ display: 'flex', gap: 24, flexShrink: 0 }} className="diag-readiness-meta">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ ...D_EYEBROW, fontSize: 9.5, marginBottom: 4 }}>Best</div>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1 }}>{st.bestScore || '-'}{st.bestScore > 0 ? <span style={{ fontSize: 12, color: 'var(--text-3)' }}>%</span> : ''}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ ...D_EYEBROW, fontSize: 9.5, marginBottom: 4 }}>Categories</div>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1 }}>{t.categories.length}</div>
                  </div>
                </div>
              </div>

              {/* Recommendation for strong scores */}
              {readinessScore >= 70 && st.diagsTaken >= 1 && (
                <div style={{ ...D_CARD, padding: '16px 20px', marginBottom: 16, borderLeft: '3px solid #22c55e' }}>
                  <div style={{ ...D_EYEBROW, fontSize: 9.5, marginBottom: 6, color: '#22c55e' }}>Recommendation</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
                    Strong scores on {t.title}. To lock it in, drill <Link href="/flashcards" style={{ color: 'var(--text)', fontWeight: 700 }}>Interview Flashcards</Link> for repetition and consistency under pressure.
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              {st.cats.length > 0 && (
                <div style={{ ...D_CARD, padding: '20px 24px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div style={D_EYEBROW}>Category breakdown</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Ranked</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {st.cats.map((c, i) => {
                      const color = c.pct >= 80 ? '#22c55e' : c.pct >= 60 ? '#f59e0b' : c.pct >= 40 ? '#f97316' : '#dc2626';
                      return (
                        <div key={c.cat} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 56px', alignItems: 'center', gap: 14 }}>
                          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--text-3)' }}>{String(i + 1).padStart(2, '0')}</span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{c.cat}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.correct} of {c.total} correct</div>
                          </div>
                          <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${c.pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                          </div>
                          <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 18, color, textAlign: 'right' }}>{c.pct}<span style={{ fontSize: 11, color: 'var(--text-3)' }}>%</span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Priority focus */}
              {weakCats.length > 0 && (
                <div style={{ ...D_CARD, padding: '20px 24px', marginBottom: 16, borderLeft: '3px solid #dc2626' }}>
                  <div style={{ ...D_EYEBROW, fontSize: 9.5, color: '#dc2626', marginBottom: 6 }}>Priority focus</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 6 }}>These areas need <em style={{ fontStyle: 'italic' }}>urgent work</em></div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.55 }}>Click a topic to jump straight into drilling it.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {weakCats.map(c => (
                      <Link
                        key={c.cat}
                        href={`/concept-drills?track=${encodeURIComponent(viewTrack || '')}&topic=${encodeURIComponent(c.cat)}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '7px 13px', borderRadius: 100,
                          background: 'var(--surface-2)', border: '1px solid var(--border)',
                          fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
                          textDecoration: 'none', fontFamily: "'Sora', sans-serif",
                        }}
                      >
                        {c.cat}
                        <strong style={{ color: '#dc2626', fontWeight: 700 }}>{c.pct}%</strong>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Link href={`/flashcards?track=${viewTrack || 'ib'}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      Open Flashcards for this track
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* History timeline */}
              {st.history.length > 0 && (
                <div style={{ ...D_CARD, padding: '20px 24px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={D_EYEBROW}>Timeline</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Last {Math.min(st.history.length, 10)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {st.history.slice(0, 10).map(h => {
                      const hColor = h.score >= 80 ? '#22c55e' : h.score >= 55 ? '#f59e0b' : '#dc2626';
                      const dateStr = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      return (
                        <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 70px 56px', alignItems: 'center', gap: 12, fontSize: 12 }}>
                          <div style={{ color: 'var(--text-3)' }}>{dateStr}</div>
                          <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${h.score}%`, background: hColor, borderRadius: 2 }} />
                          </div>
                          <div style={{ color: 'var(--text-3)', textAlign: 'right' }}>{h.totalCorrect}/{h.totalAnswered}</div>
                          <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 16, color: hColor, textAlign: 'right' }}>{h.score}<span style={{ fontSize: 10, color: 'var(--text-3)' }}>%</span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* CTA */}
              {(() => {
                const plan = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_plan') || 'free') : 'free';
                const isPaid = plan === 'pro' || plan === 'elite';
                const totalTaken = Object.keys(TRACKS).reduce((sum, k) => sum + trackStats(k).diagsTaken, 0);
                const atLimit = !isPaid && totalTaken >= 1;

                if (atLimit) return (
                  <div style={{ ...D_CARD, padding: '20px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
                      You've used your free diagnostic
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 16 }}>
                      Upgrade to Pro for unlimited diagnostics across all {Object.keys(TRACKS).length} tracks.
                    </div>
                    <a href="/checkout" style={{
                      display: 'inline-block', padding: '11px 24px', borderRadius: 9,
                      background: 'var(--text)', color: 'var(--surface)',
                      fontSize: 13, fontWeight: 700, textDecoration: 'none',
                      fontFamily: "'Sora', sans-serif",
                    }}>Upgrade to Pro</a>
                  </div>
                );

                return (
                  <button onClick={() => {
                    setTrackKey(viewTrack); const tr = TRACKS[viewTrack]; const qs = buildAssessment(tr); setQuestions(qs); setIdx(0); setSelected(null); setShowExp(false); setTimer(TIME_PER_Q); setCatResults({}); setTotalCorrect(0); setTotalAnswered(0); setMissed([]); setPhase('assess');
                  }} type="button" style={{
                    width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'var(--text)', color: 'var(--surface)',
                    padding: '14px 24px', borderRadius: 10,
                    fontSize: 13.5, fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    {st.diagsTaken > 0 ? 'Take another diagnostic' : `Start ${t.title} diagnostic`}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                );
              })()}

              {st.diagsTaken > 0 && (
                <div style={{ marginTop: 28, textAlign: 'center' }}>
                  <button onClick={() => setResetTarget(viewTrack || '')} type="button" style={{
                    background: 'transparent', border: 'none',
                    fontSize: 11.5, color: 'var(--text-3)',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                    padding: '6px 10px', borderRadius: 6,
                    textDecoration: 'underline', textUnderlineOffset: 3,
                    textDecorationColor: 'var(--border-2)',
                  }}>Reset {t.title} history</button>
                </div>
              )}

            </div>
            {resetTarget !== null && (
              <DiagResetModal target={resetTarget} onCancel={() => setResetTarget(null)} onConfirm={doReset} />
            )}
            <style>{`
              @media (max-width: 720px) {
                .diag-readiness-card { flex-wrap: wrap; }
                .diag-readiness-meta { width: 100%; justify-content: flex-start !important; }
              }
            `}</style>
          </main>
        </div>
      );
    }


    // Main landing - all tracks
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
                    {totalDiagnostics > 0 ? overallAvg : '-'}
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
                    {bestTrackOverall ? bestTrackOverall.t.title.split(' ')[0] : '-'}
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

            {/* Resume in-progress diagnostic */}
            {savedProgress && TRACKS[savedProgress.trackKey] && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', marginBottom: 20,
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 14, gap: 16,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
                    Resume: {TRACKS[savedProgress.trackKey].title} Diagnostic
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    Question {savedProgress.idx + 1} of {savedProgress.questions.length} &middot; {savedProgress.totalCorrect}/{savedProgress.totalAnswered} correct
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={discardProgress} type="button" style={{
                    padding: '8px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: 'none', border: '1.5px solid var(--border)', color: 'var(--text-3)',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                  }}>Discard</button>
                  <button onClick={resumeAssessment} type="button" style={{
                    padding: '8px 18px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: 'var(--text)', color: 'var(--surface)', border: 'none',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                  }}>Resume</button>
                </div>
              </div>
            )}

            {/* Track list */}
            <div className="diag-section-head">
              <div className="diag-section-h">Select a <em>Track</em></div>
              <div className="diag-section-meta">{allTrackEntries.length} available</div>
            </div>

            <div className="diag-track-list">
              {allStats.map(({ k, t, st }, i) => {
                const scoreColor = st.avgScore >= 80 ? '#16a34a' : st.avgScore >= 55 ? '#d97706' : st.avgScore > 0 ? '#dc2626' : 'var(--text-3)';
                const recent = st.history.slice(0, 6).reverse();
                const isLocked = userPlan === 'free' && i >= (PLAN_LIMITS.diagnosticTracks.free as number);
                return (
                  <div key={k} className="diag-track-row" onClick={() => { if (isLocked) { window.location.href = '/checkout'; return; } setViewTrack(k); }} style={isLocked ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
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
                        <div className="diag-tr-val-none">-</div>
                      )}
                    </div>
                    <div>
                      <div className="diag-tr-label">Best</div>
                      {st.diagsTaken > 0 ? (
                        <div className="diag-tr-val">{st.bestScore}<span style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>%</span></div>
                      ) : (
                        <div className="diag-tr-val-none">-</div>
                      )}
                    </div>
                    <div>
                      <div className="diag-tr-label">Trend</div>
                      <div className="diag-tr-spark">
                        {recent.length > 0 ? recent.map((h, j) => (
                          <div key={j} className="diag-spark-bar" style={{ height: `${Math.max(4, (h.score / 100) * 28)}px`, background: h.score >= 70 ? '#16a34a' : h.score >= 50 ? '#d97706' : '#dc2626', opacity: 0.85 }} />
                        )) : <div style={{ fontSize: 18, color: 'var(--border-2)', fontStyle: 'italic', fontFamily: "'Instrument Serif', serif" }}>-</div>}
                      </div>
                    </div>
                    <div className="diag-tr-arrow">{ARROW_R}</div>
                  </div>
                );
              })}
            </div>

            {history.length > 0 && (
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <button onClick={() => setResetTarget('all')} type="button" style={{
                  background: 'transparent', border: 'none',
                  fontSize: 11.5, color: 'var(--text-3)',
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                  padding: '6px 10px', borderRadius: 6,
                  textDecoration: 'underline', textUnderlineOffset: 3,
                  textDecorationColor: 'var(--border-2)',
                }}>Reset all diagnostic history</button>
              </div>
            )}
          </div>
          {resetTarget !== null && (
            <DiagResetModal target={resetTarget} onCancel={() => setResetTarget(null)} onConfirm={doReset} />
          )}
        </main>
      </div>
    );
  }

  // ═══ ASSESSMENT ═══
  if (phase === 'assess' && q && track) {
    const A_PAGE_OUTER: React.CSSProperties = { padding: '32px 36px 80px' };
    const A_PAGE_INNER: React.CSSProperties = { maxWidth: 760, margin: '0 auto', fontFamily: "'Sora', sans-serif" };
    const A_CARD: React.CSSProperties = { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 };
    const A_EYEBROW: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)' };
    const progressPct = ((idx + 1) / questions.length) * 100;
    const timerColor = timer > 20 ? 'var(--text)' : timer > 10 ? '#f59e0b' : '#dc2626';
    const showResult = selected !== null;
    const isCorrect = selected === q.correct;
    const isTimeOut = selected === -1;
    return (
      <div className="app">
        <Sidebar activePage="diagnostic-review" />
        <main className="main" style={A_PAGE_OUTER}>
          <div style={A_PAGE_INNER}>

            {/* Top bar: track / category + autosave + timer + counter + save-exit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600 }}>
                <span>{track.title}</span>
                <span style={{ color: 'var(--border-2)' }}>/</span>
                <span style={{ color: 'var(--text-2)' }}>{q.category}</span>
                <span style={{ color: 'var(--border-2)' }}>&middot;</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#22c55e' }} title="Your progress is saved every question. You can leave and resume from your dashboard at any time within 24 hours.">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Auto-saved
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={timerColor} strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
                  <span style={{ color: timerColor, fontVariantNumeric: 'tabular-nums' }}>{String(timer).padStart(2, '0')}s</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 600 }}>Q{idx + 1} <span style={{ color: 'var(--border-2)' }}>/ {questions.length}</span></div>
                <button
                  onClick={() => {
                    // Snapshot the current in-progress state so Resume picks up here.
                    // The Home phase shows a Resume banner when savedProgress is set.
                    saveInProgress({
                      trackKey, questions, idx,
                      catResults: { ...catResults },
                      totalCorrect, totalAnswered, missed: [...missed],
                      savedAt: Date.now(),
                    });
                    setSavedProgress({
                      trackKey, questions, idx,
                      catResults: { ...catResults },
                      totalCorrect, totalAnswered, missed: [...missed],
                      savedAt: Date.now(),
                    });
                    setPhase('home');
                  }}
                  type="button"
                  title="Your progress is saved. Resume from the Diagnostic Review home anytime within 24 hours."
                  style={{
                    background: 'transparent', color: 'var(--text-2)',
                    padding: '6px 12px', borderRadius: 7,
                    fontSize: 11.5, fontWeight: 600,
                    border: '1.5px solid var(--border-2)',
                    cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Save &amp; exit
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: timerColor, transition: 'width 0.3s ease, background 0.3s ease', borderRadius: 2 }} />
            </div>

            {/* Question card */}
            <div style={{ ...A_CARD, padding: '24px 28px' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.4 }}>
                  Q{String(idx + 1).padStart(2, '0')} <span style={{ color: 'var(--border-2)' }}>/ {questions.length}</span>
                </div>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <div style={{ ...A_EYEBROW }}>{q.category}</div>
              </div>

              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 24, lineHeight: 1.3, color: 'var(--text)',
                fontWeight: 400, margin: '0 0 20px',
                letterSpacing: '-0.3px',
              }}>{q.q}</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrectChoice = i === q.correct;
                  let borderColor = 'var(--border)';
                  let bg = 'var(--surface)';
                  let textColor = 'var(--text)';
                  let letterBg = 'var(--surface-2)';
                  let letterColor = 'var(--text-3)';
                  if (showResult) {
                    if (isCorrectChoice) { borderColor = '#22c55e'; bg = 'rgba(34, 197, 94, 0.08)'; letterBg = '#22c55e'; letterColor = '#fff'; }
                    else if (isSelected && !isTimeOut) { borderColor = '#dc2626'; bg = 'rgba(220, 38, 38, 0.08)'; letterBg = '#dc2626'; letterColor = '#fff'; }
                    else { textColor = 'var(--text-3)'; }
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={showResult}
                      type="button"
                      className="diag-choice-btn"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '13px 16px',
                        background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 9,
                        cursor: showResult ? 'default' : 'pointer',
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
                      {showResult && isSelected && !isCorrectChoice && !isTimeOut && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {showExp && (
                <div style={{
                  marginTop: 18, padding: '16px 18px',
                  background: 'var(--surface-2)', borderRadius: 10,
                  borderLeft: `3px solid ${isCorrect ? '#22c55e' : '#dc2626'}`,
                }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                    color: isCorrect ? '#22c55e' : '#dc2626', marginBottom: 6,
                  }}>{isCorrect ? 'Correct' : isTimeOut ? 'Time expired' : 'Not quite'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 14 }}>{q.explanation}</div>
                  <button onClick={nextQ} type="button" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: 'var(--text)', color: 'var(--surface)',
                    padding: '9px 16px', borderRadius: 8,
                    fontSize: 12.5, fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                  }}>
                    {idx + 1 >= questions.length ? 'See results' : 'Next question'}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              )}
            </div>

          </div>
          <style>{`
            .diag-choice-btn:not(:disabled):hover { border-color: var(--border-2) !important; background: var(--surface-2) !important; }
          `}</style>
        </main>
      </div>
    );
  }

  // ═══ RESULTS ═══
  const sortedCats = track ? track.categories.map(cat => {
    const r = catResults[cat] || { total: 0, correct: 0 };
    const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    return { cat, ...r, pct };
  }).sort((a, b) => b.pct - a.pct) : [];

  const R_PAGE_OUTER: React.CSSProperties = { padding: '32px 36px 80px' };
  const R_PAGE_INNER: React.CSSProperties = { maxWidth: 760, margin: '0 auto', fontFamily: "'Sora', sans-serif" };
  const R_CARD: React.CSSProperties = { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12 };
  const R_EYEBROW: React.CSSProperties = { fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)' };
  const R_SERIF: React.CSSProperties = { fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.8px', color: 'var(--text)', fontWeight: 400, margin: 0 };
  const scoreColor = overallPct >= 70 ? '#22c55e' : overallPct >= 50 ? '#f59e0b' : '#dc2626';

  return (
    <div className="app">
      <Sidebar activePage="diagnostic-review" />
      <main className="main" style={R_PAGE_OUTER}>
        <div style={R_PAGE_INNER}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...R_EYEBROW, marginBottom: 10 }}>Diagnostic complete</div>
            <h1 style={R_SERIF}>
              {track?.title} <em style={{ fontStyle: 'italic', color: 'var(--text-3)' }}>&middot;</em> <em style={{ fontStyle: 'italic' }}>Performance report</em>
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '10px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          {/* Big stats card with donut */}
          <div style={{ ...R_CARD, padding: '28px 32px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 28 }} className="diag-results-stats">
            <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="9" strokeDasharray={`${(overallPct / 100) * 264} 264`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: "'Instrument Serif', serif" }}>
                <div style={{ fontSize: 34, fontStyle: 'italic', color: scoreColor, lineHeight: 1, letterSpacing: '-0.5px' }}>{overallPct}<span style={{ fontSize: 16, color: 'var(--text-3)' }}>%</span></div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{vt}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 12 }}>{vDesc}</div>
              <div style={{ display: 'flex', gap: 18, fontSize: 11.5, color: 'var(--text-3)' }}>
                <span><span style={{ color: '#22c55e', fontWeight: 700 }}>{totalCorrect}</span> correct</span>
                <span><span style={{ color: '#dc2626', fontWeight: 700 }}>{totalAnswered - totalCorrect}</span> wrong</span>
                <span style={{ color: 'var(--text-3)' }}>{totalAnswered} answered</span>
              </div>
            </div>
          </div>

          {/* Pullquote for strong scores */}
          {overallPct >= 70 && (
            <div style={{ ...R_CARD, padding: '16px 20px', marginBottom: 16, borderLeft: '3px solid #22c55e' }}>
              <div style={{ ...R_EYEBROW, fontSize: 9.5, marginBottom: 6, color: '#22c55e' }}>Next step</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
                Nice work, you're building momentum. Drill <a href="/flashcards" style={{ color: 'var(--text)', fontWeight: 700 }}>Interview Flashcards</a> to lock in this knowledge before real interviews.
              </div>
            </div>
          )}

          {/* Category breakdown */}
          {sortedCats.length > 0 && (
            <div style={{ ...R_CARD, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={R_EYEBROW}>Performance by category</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Ranked</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sortedCats.map((c, i) => {
                  const color = c.pct >= 80 ? '#22c55e' : c.pct >= 50 ? '#f59e0b' : '#dc2626';
                  return (
                    <div key={c.cat} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 120px 56px', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 18, color: 'var(--text-3)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{c.cat}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.correct} of {c.total} correct</div>
                      </div>
                      <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${c.pct}%`, background: color, borderRadius: 3 }} />
                      </div>
                      <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 18, color, textAlign: 'right' }}>{c.pct}<span style={{ fontSize: 11, color: 'var(--text-3)' }}>%</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missed questions */}
          {missed.length > 0 && (
            <div style={{ ...R_CARD, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={R_EYEBROW}>Questions missed</div>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
                  background: 'rgba(220, 38, 38, 0.10)', color: '#dc2626',
                }}>{missed.length}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {missed.map((m, i) => (
                  <div key={i} style={{
                    paddingBottom: i < missed.length - 1 ? 14 : 0,
                    borderBottom: i < missed.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ ...R_EYEBROW, fontSize: 9.5, marginBottom: 5 }}>{m.category}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{m.q}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55 }}>{m.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setPhase('home')} type="button" style={{
              flex: '1 1 200px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--text)', color: 'var(--surface)',
              padding: '12px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
            }}>
              Back to overview
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={startAssessment} type="button" style={{
              background: 'transparent', color: 'var(--text-2)',
              padding: '12px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 600,
              border: '1.5px solid var(--border-2)', cursor: 'pointer',
              fontFamily: "'Sora', sans-serif",
              display: 'inline-flex', alignItems: 'center', gap: 7,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>
              Retake
            </button>
          </div>

        </div>
        <style>{`
          @media (max-width: 600px) {
            .diag-results-stats { flex-wrap: wrap; }
          }
        `}</style>
      </main>
    </div>
  );
}
