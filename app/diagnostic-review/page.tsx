'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Sidebar from '../components/Sidebar';
import { useUserPlan } from '../lib/usePlan';
import './diagnostic.css';
import { TRACKS as DRILL_TRACKS, DrillQ } from '../concept-drills/drill-data';

type MCQ = { q: string; category: string; options: string[]; correct: number; explanation: string };
type TrackDef = { title: string; categories: string[]; questions: DrillQ[]; target: number };

const TRACK_TARGET: Record<string, number> = {
  ib: 40, pe: 50, consulting: 45, accounting: 25, am: 25,
  st: 50, er: 30, re: 30, vc: 40, rx: 25,
};
const DEFAULT_TARGET = 40;
type CatResult = { total: number; correct: number };
type DiagResult = {
  id: string; track: string; date: string; score: number;
  totalCorrect: number; totalAnswered: number;
  catScores: Record<string, { total: number; correct: number }>;
};

const TRACKS: Record<string, TrackDef> = {};
for (const [key, t] of Object.entries(DRILL_TRACKS)) {
  TRACKS[key] = { title: t.title, categories: t.topics, questions: t.questions, target: TRACK_TARGET[key] ?? DEFAULT_TARGET };
}

// Map sidebar industry name -> diagnostic track key. The sidebar uses full
// names like "Investment Banking"; track keys are short codes like "ib".
const SIDEBAR_TO_TRACK: Record<string, string> = {
  'Investment Banking': 'ib',
  'Private Equity': 'pe',
  'Restructuring': 'rx',
  'Consulting': 'consulting',
  'Accounting & Audit': 'accounting',
  'Asset Management': 'am',
  'Sales & Trading': 'st',
  'Equity Research': 'er',
  'Real Estate': 're',
  'Venture Capital': 'vc',
};
function getSidebarTrack(): string {
  if (typeof window === 'undefined') return 'ib';
  try {
    const raw = localStorage.getItem('offerbell_onboarding_profile');
    if (!raw) return 'ib';
    const prof = JSON.parse(raw);
    const role = prof?.targetRoles?.[0];
    if (role && SIDEBAR_TO_TRACK[role]) return SIDEBAR_TO_TRACK[role];
  } catch {}
  return 'ib';
}

const STORAGE_KEY = 'offerbell_diag_history';
const PROGRESS_KEY = 'offerbell_diag_in_progress';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildAssessment(track: TrackDef): MCQ[] {
  const pools = track.categories
    .map(cat => ({ cat, qs: shuffle(track.questions.filter(q => q.topic === cat)) }))
    .filter(p => p.qs.length > 0);
  const alloc = pools.map(() => 0);
  let remaining = track.target;
  let progress = true;
  while (remaining > 0 && progress) {
    progress = false;
    for (let i = 0; i < pools.length && remaining > 0; i++) {
      if (alloc[i] < pools[i].qs.length) { alloc[i]++; remaining--; progress = true; }
    }
  }
  const allQ: MCQ[] = [];
  pools.forEach((p, i) => {
    for (let k = 0; k < alloc[i]; k++) {
      const d = p.qs[k];
      allQ.push({ q: d.q, category: p.cat, options: d.options, correct: d.correct, explanation: d.explanation });
    }
  });
  return shuffle(allQ);
}

function loadHistory(): DiagResult[] { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }
function saveHistory(h: DiagResult[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); }

type Phase = 'home' | 'assess' | 'results';

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
    if (Date.now() - state.savedAt > 24 * 60 * 60 * 1000) { localStorage.removeItem(PROGRESS_KEY); return null; }
    return state;
  } catch { return null; }
}

// ═══ Reset confirmation modal ═══
function DiagResetModal({ trackTitle, onCancel, onConfirm }: { trackTitle: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div onClick={onCancel} className="diag-modal-overlay">
      <div onClick={e => e.stopPropagation()} className="diag-modal">
        <div className="diag-modal-eyebrow">Reset {trackTitle} history</div>
        <div className="diag-modal-title">Are you <em>sure?</em></div>
        <div className="diag-modal-text">
          This deletes every past {trackTitle} diagnostic — scores, category breakdowns, and timeline.
          You can take new diagnostics any time. This cannot be undone.
        </div>
        <div className="diag-modal-actions">
          <button type="button" className="diag-modal-cancel" onClick={onCancel}>Cancel</button>
          <button type="button" className="diag-modal-confirm" onClick={onConfirm}>Reset</button>
        </div>
      </div>
    </div>
  );
}

export default function DiagnosticReviewPage() {
  const [phase, setPhase] = useState<Phase>('home');
  const [trackKey, setTrackKey] = useState('ib');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [catResults, setCatResults] = useState<Record<string, CatResult>>({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [missed, setMissed] = useState<{ q: string; explanation: string; category: string }[]>([]);
  const [history, setHistory] = useState<DiagResult[]>([]);
  const userPlan = useUserPlan();
  const [savedProgress, setSavedProgress] = useState<InProgressState | null>(null);
  const [resetTarget, setResetTarget] = useState<string | null>(null);
  // For free users: a flag that says they've clicked Start at least once.
  // Persists across discards, save&exit, and track switches, so a free
  // user gets exactly one diagnostic attempt - whether they complete it
  // or not. Without this, they could Start -> Save&exit -> Discard ->
  // Start on a different track indefinitely.
  const [freeUsedFlag, setFreeUsedFlag] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [userId, setUserId] = useState<string>('');

  const saveProgressMut = useMutation((api as any).progress?.saveProgress);
  const appendDiagResultMut = useMutation((api as any).diagHistory?.appendResult);
  const clearTrackDiagMut = useMutation((api as any).diagHistory?.clearTrack);
  const canReset = userPlan === 'pro' || userPlan === 'elite';

  // ── Mount: load history, in-progress, theme, set trackKey from sidebar ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    setHistory(loadHistory());
    const sp = loadInProgress();
    setSavedProgress(sp);
    setUserId(localStorage.getItem('offerbell_user_id') || '');
    setFreeUsedFlag(localStorage.getItem('offerbell_diag_free_used') === '1');
    // If a free user has saved progress, force them onto that track so they
    // can't even view a different track's hub (and accidentally start one,
    // were the CTA ever to slip through). Paid users follow the sidebar.
    const plan = (localStorage.getItem('offerbell_plan') || 'free').toLowerCase();
    if (plan === 'free' && sp && TRACKS[sp.trackKey]) {
      setTrackKey(sp.trackKey);
    } else {
      setTrackKey(getSidebarTrack());
    }
  }, []);

  // ── Listen for sidebar industry changes ──
  useEffect(() => {
    function onProfileChanged() {
      if (phase !== 'home') return;
      // Free user with in-progress diagnostic: ignore sidebar changes. They
      // are locked to their committed track until they finish or discard.
      if (userPlan === 'free' && savedProgress) return;
      setTrackKey(getSidebarTrack());
    }
    window.addEventListener('offerbell-profile-changed', onProfileChanged);
    return () => window.removeEventListener('offerbell-profile-changed', onProfileChanged);
  }, [phase, userPlan, savedProgress]);

  const startAssessment = () => {
    if (!trackKey) return;
    const track = TRACKS[trackKey];
    if (!track) return;
    // For free users: commit the attempt the moment they click Start.
    // Persists across discards so they can't game the system by
    // start -> discard -> start on a different track.
    if (userPlan === 'free' && !freeUsedFlag) {
      try { localStorage.setItem('offerbell_diag_free_used', '1'); } catch {}
      setFreeUsedFlag(true);
    }
    const qs = buildAssessment(track);
    setQuestions(qs); setIdx(0); setSelected(null); setShowExp(false);
    setCatResults({}); setTotalCorrect(0); setTotalAnswered(0); setMissed([]);
    setPhase('assess');
    setSavedProgress(null);
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
    setSelected(null); setShowExp(false);
    setPhase('assess');
    setSavedProgress(null);
  };

  const discardProgress = () => {
    // Free users get a warning - they've already burned their attempt by
    // starting. Discarding doesn't restore it; this just makes it explicit.
    if (userPlan === 'free') {
      setShowDiscardConfirm(true);
      return;
    }
    doDiscard();
  };
  const doDiscard = () => {
    saveInProgress(null);
    setSavedProgress(null);
    setShowDiscardConfirm(false);
  };

  const handleSelect = (ci: number) => {
    if (selected !== null) return;
    setSelected(ci); setShowExp(true);
    const q = questions[idx]; const ok = ci === q.correct;
    setCatResults(p => { const c = p[q.category] || { total: 0, correct: 0 }; return { ...p, [q.category]: { total: c.total + 1, correct: ok ? c.correct + 1 : c.correct } }; });
    setTotalAnswered(a => a + 1);
    if (ok) setTotalCorrect(c => c + 1);
    else setMissed(m => [...m, { q: q.q, explanation: q.explanation, category: q.category }]);
    // Diagnostic results are intentionally NOT written to offerbell_flash_perf_*.
    // That store is shared by Concept Drills, Flashcards, and the dashboard
    // heatmap; the diagnostic is a separate self-contained assessment and must
    // not bleed its results into those surfaces. Its own history/score live in
    // STORAGE_KEY and component state.
  };

  const nextQ = () => {
    if (idx + 1 >= questions.length) { finishAssessment(); return; }
    const nextIdx = idx + 1;
    setIdx(nextIdx); setSelected(null); setShowExp(false);
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
    if (userId && appendDiagResultMut) {
      void appendDiagResultMut({ sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined),
        userId, entryId: result.id, track: result.track,
        date: result.date, score: result.score,
        totalCorrect: result.totalCorrect, totalAnswered: result.totalAnswered,
        catScores: JSON.stringify(result.catScores),
        timestamp: parseInt(result.id, 10) || Date.now(),
      }).catch(() => {});
    }
    saveInProgress(null);
    setPhase('results');
  };

  const doReset = async () => {
    if (!resetTarget) return;
    const remaining = history.filter(h => h.track !== resetTarget);
    saveHistory(remaining);
    setHistory(remaining);
    if (userId && clearTrackDiagMut) {
      try { await clearTrackDiagMut({ userId, track: resetTarget, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }); } catch {}
    }
    if (userId && saveProgressMut) {
      try {
        await saveProgressMut({ userId, data: JSON.stringify({ [STORAGE_KEY]: JSON.stringify(remaining) }), sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) });
      } catch {}
    }
    setResetTarget(null);
  };

  // ── Derived values for current track only ──
  const track = TRACKS[trackKey];
  const q = questions[idx];
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
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

  // ═══════════════════════════════════════════════════════════════════════
  // ASSESSMENT VIEW
  // ═══════════════════════════════════════════════════════════════════════
  if (phase === 'assess' && q && track) {
    const progressPct = ((idx + 1) / questions.length) * 100;
    const showResult = selected !== null;
    const isCorrect = selected === q.correct;
    const isTimeOut = selected === -1;
    return (
      <div className="diag-app">
        <Sidebar activePage="diagnostic-review" />
        <div className="diag-canvas">
          <div className="diag-page">
            <div className="diag-assess-page">
              {/* Top bar */}
              <div className="diag-assess-topbar">
                <div className="diag-assess-trail">
                  <span className="diag-assess-trail-track">{track.title}</span>
                  <span className="diag-assess-trail-sep">/</span>
                  <span className="diag-assess-trail-cat">{q.category}</span>
                  <span className="diag-assess-trail-sep">·</span>
                  <span className="diag-autosaved" title="Your progress saves every question. Resume from the hub anytime within 24 hours.">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Auto-saved
                  </span>
                </div>
                <div className="diag-assess-meta">
                  <div className="diag-q-counter">Q{idx + 1} <span>/ {questions.length}</span></div>
                  {userPlan !== 'free' && (
                    <button
                      type="button"
                      className="diag-save-exit"
                      onClick={() => {
                        saveInProgress({ trackKey, questions, idx, catResults: { ...catResults }, totalCorrect, totalAnswered, missed: [...missed], savedAt: Date.now() });
                        setSavedProgress({ trackKey, questions, idx, catResults: { ...catResults }, totalCorrect, totalAnswered, missed: [...missed], savedAt: Date.now() });
                        setPhase('home');
                      }}
                      title="Your progress saves. Resume from the hub anytime within 24 hours."
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                      Save &amp; exit
                    </button>
                  )}
                </div>
              </div>

              <div className="diag-progress-bar">
                <div className="diag-progress-fill" style={{ width: `${progressPct}%`, background: '#3b82f6' }} />
              </div>

              <div className="diag-q-card">
                <div className="diag-q-head">
                  <div className="diag-q-num">Q{String(idx + 1).padStart(2, '0')} <span>/ {questions.length}</span></div>
                  <div className="diag-q-divider" />
                  <div className="diag-q-cat">{q.category}</div>
                </div>

                <h2 className="diag-q-text">{q.q}</h2>

                <div className="diag-choices">
                  {q.options.map((opt, i) => {
                    const isSel = selected === i;
                    const isCorr = i === q.correct;
                    let cls = 'diag-choice';
                    if (showResult) {
                      if (isCorr) cls += ' correct';
                      else if (isSel && !isTimeOut) cls += ' wrong';
                      else cls += ' dim';
                    }
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(i)}
                        disabled={showResult}
                        className={cls}
                      >
                        <div className="diag-choice-letter">{'ABCD'[i]}</div>
                        <span className="diag-choice-text">{opt}</span>
                        {showResult && isCorr && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--good)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                        {showResult && isSel && !isCorr && !isTimeOut && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bad)" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {showExp && (
                  <div className={`diag-explanation ${isCorrect ? 'correct' : 'wrong'}`}>
                    <div className="diag-explanation-label">{isCorrect ? 'Correct' : isTimeOut ? 'Time expired' : 'Not quite'}</div>
                    <div className="diag-explanation-text">{q.explanation}</div>
                    <button type="button" className="diag-next-btn" onClick={nextQ}>
                      {idx + 1 >= questions.length ? 'See results' : 'Next question'}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RESULTS VIEW
  // ═══════════════════════════════════════════════════════════════════════
  if (phase === 'results') {
    const sortedCats = track ? track.categories.map(cat => {
      const r = catResults[cat] || { total: 0, correct: 0 };
      const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
      return { cat, ...r, pct };
    }).sort((a, b) => b.pct - a.pct) : [];
    const scoreColor = overallPct >= 70 ? 'var(--good)' : overallPct >= 50 ? 'var(--warn)' : 'var(--bad)';

    return (
      <div className="diag-app">
        <Sidebar activePage="diagnostic-review" />
        <div className="diag-canvas">
          <div className="diag-page">
            <div className="diag-page-inner">

              <div className="diag-results-eyebrow">Diagnostic complete</div>
              <h1 className="diag-results-title">{track?.title} <em>· performance report</em></h1>
              <div className="diag-results-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>

              {/* Score ring + summary */}
              <div className="diag-readiness">
                <div className="diag-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="9" strokeDasharray={`${(overallPct / 100) * 264} 264`} strokeLinecap="round" />
                  </svg>
                  <div className="diag-ring-num" style={{ color: scoreColor }}>
                    {overallPct}<span className="diag-ring-num-pct">%</span>
                  </div>
                </div>
                <div className="diag-readiness-body">
                  <div className="diag-readiness-label">{vt}</div>
                  <div className="diag-readiness-desc">{vDesc}</div>
                  <div style={{ display: 'flex', gap: 18, fontSize: 11.5, color: 'var(--text-3)', marginTop: 10 }}>
                    <span><span style={{ color: 'var(--good)', fontWeight: 700 }}>{totalCorrect}</span> correct</span>
                    <span><span style={{ color: 'var(--bad)', fontWeight: 700 }}>{totalAnswered - totalCorrect}</span> wrong</span>
                    <span>{totalAnswered} answered</span>
                  </div>
                </div>
              </div>

              {overallPct >= 70 && (
                <div className="diag-rec">
                  <div className="diag-rec-label">Next step</div>
                  <div className="diag-rec-text">
                    Nice work. Lock it in by drilling <Link href={`/flashcards?track=${trackKey}`}>Interview Flashcards</Link> for repetition under pressure.
                  </div>
                </div>
              )}

              {sortedCats.length > 0 && (
                <div className="diag-card">
                  <div className="diag-card-head">
                    <div className="diag-card-title">Performance by category</div>
                    <div className="diag-card-meta">Ranked</div>
                  </div>
                  <div className="diag-cats">
                    {sortedCats.map((c, i) => {
                      const cc = c.pct >= 80 ? 'var(--good)' : c.pct >= 50 ? 'var(--warn)' : 'var(--bad)';
                      return (
                        <div key={c.cat} className="diag-cat-row">
                          <span className="diag-cat-num">{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <div className="diag-cat-name">{c.cat}</div>
                            <div className="diag-cat-sub">{c.correct} of {c.total} correct</div>
                          </div>
                          <div className="diag-cat-bar-wrap">
                            <div className="diag-cat-bar" style={{ width: `${c.pct}%`, background: cc }} />
                          </div>
                          <div className="diag-cat-pct" style={{ color: cc }}>{c.pct}<span className="diag-cat-pct-sm">%</span></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {missed.length > 0 && (
                <div className="diag-card">
                  <div className="diag-card-head">
                    <div className="diag-card-title">Questions missed</div>
                    <div className="diag-missed-pill">{missed.length}</div>
                  </div>
                  <div>
                    {missed.map((m, i) => (
                      <div key={i} className="diag-missed-item">
                        <div className="diag-missed-cat">{m.category}</div>
                        <div className="diag-missed-q">{m.q}</div>
                        <div className="diag-missed-exp">{m.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="diag-results-actions">
                <button type="button" className="diag-results-back" onClick={() => setPhase('home')}>
                  Back to overview
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button type="button" className="diag-retake" onClick={startAssessment}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>
                  Retake
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // HUB VIEW — single track, sidebar-driven
  // ═══════════════════════════════════════════════════════════════════════
  if (!track) {
    // Fallback if sidebar industry doesn't map to a known track
    return (
      <div className="diag-app">
        <Sidebar activePage="diagnostic-review" />
        <div className="diag-canvas">
          <div className="diag-page">
            <div className="diag-page-inner">
              <h1 className="diag-page-title">Diagnostic <em>Review</em></h1>
              <div className="diag-page-sub">Select an industry in the sidebar to load your diagnostic.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const st = trackStats(trackKey);
  const readinessScore = st.avgScore;
  const readinessLabel = readinessScore >= 80 ? 'Interview Ready' : readinessScore >= 65 ? 'Solid Foundation' : readinessScore >= 50 ? 'Getting There' : readinessScore >= 30 ? 'Building Up' : st.diagsTaken > 0 ? 'Just Starting' : 'Not Started';
  const readinessDesc = readinessScore >= 80 ? 'Strong performance across categories. Focus on depth and mock interviews.' : readinessScore >= 65 ? 'Solid foundation. Target weak categories to close the gap.' : readinessScore >= 50 ? 'Building momentum. Continue drilling to reach interview-ready.' : readinessScore >= 30 ? 'Early stage. Work through guides and flashcards before diagnostics.' : st.diagsTaken > 0 ? 'Just getting started. Keep taking diagnostics to build a baseline.' : 'Take your first diagnostic to establish a baseline.';
  const scoreColor = readinessScore >= 70 ? 'var(--good)' : readinessScore >= 50 ? 'var(--warn)' : readinessScore > 0 ? 'var(--bad)' : 'var(--text-3)';
  const weakCats = st.cats.filter(c => c.pct < 50 && c.total >= 2);

  // Free tier: 1 diagnostic LIFETIME total. The freeUsedFlag closes the
  // start->save&exit->discard->start-on-new-track loophole - the moment
  // a free user clicks Start, their attempt is committed.
  const totalAllTracksTaken = history.length;
  const freeUsedQuota = userPlan === 'free' && (totalAllTracksTaken >= 1 || freeUsedFlag);
  // But if user already has data on THIS track, they can still see their report
  const canStartNew = !freeUsedQuota || st.diagsTaken > 0;

  return (
    <div className="diag-app">
      <Sidebar activePage="diagnostic-review" />
      <div className="diag-canvas">
        <div className="diag-page">
          <div className="diag-page-inner">

            {/* Top row */}
            <div className="diag-top-row">
              <div className="diag-title-block">
                <div className="diag-eyebrow">OfferBell Assessment</div>
                <h1 className="diag-page-title">Diagnostic <em>Review</em></h1>
                <div className="diag-page-sub">
                  Timed MCQs across every core category in {track.title}, with a detailed performance report and targeted recommendations.
                </div>
                <div className="diag-track-meta">For <strong>{track.title}</strong> · change in sidebar</div>
              </div>
              {freeUsedQuota ? (
                <div className="diag-chip locked">
                  <span className="diag-chip-dot" />
                  Free plan limit reached
                </div>
              ) : userPlan === 'free' ? (
                <div className="diag-chip warn">
                  <span className="diag-chip-dot" />
                  1 free diagnostic
                </div>
              ) : (
                <div className="diag-chip">
                  <span className="diag-chip-dot" />
                  Unlimited diagnostics
                </div>
              )}
            </div>

            {/* Resume in-progress banner */}
            {savedProgress && TRACKS[savedProgress.trackKey] && (
              <div className="diag-resume">
                <div className="diag-resume-text">
                  <div className="diag-resume-title">Resume: {TRACKS[savedProgress.trackKey].title} Diagnostic</div>
                  <div className="diag-resume-sub">
                    Question {savedProgress.idx + 1} of {savedProgress.questions.length} · {savedProgress.totalCorrect}/{savedProgress.totalAnswered} correct
                  </div>
                </div>
                <div className="diag-resume-btns">
                  <button type="button" className="diag-btn-secondary" onClick={discardProgress}>Discard</button>
                  <button type="button" className="diag-btn-primary" onClick={resumeAssessment}>Resume</button>
                </div>
              </div>
            )}

            {/* Readiness card */}
            <div className="diag-readiness">
              <div className="diag-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-2)" strokeWidth="9" />
                  {st.diagsTaken > 0 && (
                    <circle cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="9" strokeDasharray={`${(readinessScore / 100) * 264} 264`} strokeLinecap="round" />
                  )}
                </svg>
                <div className="diag-ring-num" style={{ color: scoreColor }}>
                  {st.diagsTaken > 0 ? readinessScore : '—'}
                  {st.diagsTaken > 0 && <span className="diag-ring-num-pct">%</span>}
                </div>
              </div>
              <div className="diag-readiness-body">
                <div className="diag-readiness-label">{readinessLabel}</div>
                <div className="diag-readiness-desc">{readinessDesc}</div>
              </div>
              <div className="diag-readiness-meta">
                <div className="diag-readiness-meta-item">
                  <div className="diag-readiness-meta-label">Best</div>
                  <div className="diag-readiness-meta-val">
                    {st.bestScore || '—'}
                    {st.bestScore > 0 && <span className="diag-readiness-meta-val-pct">%</span>}
                  </div>
                </div>
                <div className="diag-readiness-meta-item">
                  <div className="diag-readiness-meta-label">Taken</div>
                  <div className="diag-readiness-meta-val">{st.diagsTaken}</div>
                </div>
                <div className="diag-readiness-meta-item">
                  <div className="diag-readiness-meta-label">Categories</div>
                  <div className="diag-readiness-meta-val">{track.categories.length}</div>
                </div>
              </div>
            </div>

            {/* Recommendation strip */}
            {readinessScore >= 70 && st.diagsTaken >= 1 && (
              <div className="diag-rec">
                <div className="diag-rec-label">Recommendation</div>
                <div className="diag-rec-text">
                  Strong scores on {track.title}. To lock it in, drill <Link href={`/flashcards?track=${trackKey}`}>Interview Flashcards</Link> for repetition and consistency under pressure.
                </div>
              </div>
            )}

            {/* Category breakdown */}
            {st.cats.length > 0 && (
              <div className="diag-card">
                <div className="diag-card-head">
                  <div className="diag-card-title">Category breakdown</div>
                  <div className="diag-card-meta">Ranked</div>
                </div>
                <div className="diag-cats">
                  {st.cats.map((c, i) => {
                    const cc = c.pct >= 80 ? 'var(--good)' : c.pct >= 60 ? 'var(--warn)' : c.pct >= 40 ? '#f97316' : 'var(--bad)';
                    return (
                      <div key={c.cat} className="diag-cat-row">
                        <span className="diag-cat-num">{String(i + 1).padStart(2, '0')}</span>
                        <div>
                          <div className="diag-cat-name">{c.cat}</div>
                          <div className="diag-cat-sub">{c.correct} of {c.total} correct</div>
                        </div>
                        <div className="diag-cat-bar-wrap">
                          <div className="diag-cat-bar" style={{ width: `${c.pct}%`, background: cc }} />
                        </div>
                        <div className="diag-cat-pct" style={{ color: cc }}>{c.pct}<span className="diag-cat-pct-sm">%</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* History timeline */}
            {st.history.length > 0 && (
              <div className="diag-card">
                <div className="diag-card-head">
                  <div className="diag-card-title">Timeline</div>
                  <div className="diag-card-meta">Last {Math.min(st.history.length, 10)}</div>
                </div>
                <div className="diag-history">
                  {st.history.slice(0, 10).map(h => {
                    const hc = h.score >= 80 ? 'var(--good)' : h.score >= 55 ? 'var(--warn)' : 'var(--bad)';
                    const dateStr = new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div key={h.id} className="diag-hist-row">
                        <div className="diag-hist-date">{dateStr}</div>
                        <div className="diag-hist-bar-wrap">
                          <div className="diag-hist-bar" style={{ width: `${h.score}%`, background: hc }} />
                        </div>
                        <div className="diag-hist-count">{h.totalCorrect}/{h.totalAnswered}</div>
                        <div className="diag-hist-pct" style={{ color: hc }}>{h.score}<span className="diag-cat-pct-sm">%</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA / upgrade gate. Hidden when savedProgress exists - the resume
                banner above is the action. Free users who have used their quota
                see the upgrade gate regardless of this track's history. */}
            {!savedProgress && (
              freeUsedQuota ? (
                <div className="diag-upgrade">
                  <div className="diag-upgrade-title">You&apos;ve used your free <em>diagnostic</em></div>
                  <div className="diag-upgrade-sub">Upgrade to Pro for unlimited diagnostics across every track.</div>
                  <Link href="/my-account" className="diag-upgrade-btn">Upgrade plan</Link>
                </div>
              ) : st.diagsTaken === 0 ? (
                <button type="button" className="diag-cta" onClick={startAssessment}>
                  Start {track.title} diagnostic
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ) : (
                <button type="button" className="diag-cta" onClick={startAssessment}>
                  Take another diagnostic
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              )
            )}

            {st.diagsTaken > 0 && canReset && (
              <div className="diag-reset-link">
                <button type="button" onClick={() => setResetTarget(trackKey)}>Reset {track.title} history</button>
              </div>
            )}

          </div>
        </div>
      </div>

      {resetTarget && (
        <DiagResetModal
          trackTitle={TRACKS[resetTarget]?.title || ''}
          onCancel={() => setResetTarget(null)}
          onConfirm={doReset}
        />
      )}

      {showDiscardConfirm && (
        <div onClick={() => setShowDiscardConfirm(false)} className="diag-modal-overlay">
          <div onClick={e => e.stopPropagation()} className="diag-modal">
            <div className="diag-modal-eyebrow">Discard saved progress</div>
            <div className="diag-modal-title">Are you <em>sure?</em></div>
            <div className="diag-modal-text">
              You&apos;ve already used your free diagnostic by starting one. Discarding
              this saved progress will <strong style={{ color: 'var(--text)' }}>not</strong> give you another attempt -
              you&apos;ll need to upgrade to Pro to take a new diagnostic on any track.
            </div>
            <div className="diag-modal-actions">
              <button type="button" className="diag-modal-cancel" onClick={() => setShowDiscardConfirm(false)}>Keep progress</button>
              <button type="button" className="diag-modal-confirm" onClick={doDiscard}>Discard anyway</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
