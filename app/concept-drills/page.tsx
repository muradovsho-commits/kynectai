// Build: v6-career-aware-tabs
'use client';
import { useState, useEffect, useMemo, useCallback, useLayoutEffect, useRef, Suspense } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Sidebar from '../components/Sidebar';
import { useUserPlan } from '../lib/usePlan';
import './drills.css';
import { TRACKS as DRILL_TRACKS, DrillQ } from './drill-data';

// ─── Career mapping ────────────────────────────────────────────────────────
// Maps the user's vertical (from onboarding / settings) to a flash_perf
// track key. Identical to the mapping the dashboard uses so that drilling
// here updates the same per-topic stats the dashboard heatmap reads.
// Verticals without a track yet (Hedge Fund, Growth Equity, FP&A, Corp Dev,
// Credit, Family Office, Endowment) return empty string -> empty state.
const VERTICAL_TO_TRACK: Record<string, string> = {
  'Investment Banking': 'ib',
  'Private Equity': 'pe',
  'Venture Capital': 'vc',
  'Sales & Trading': 'st',
  'Equity Research': 'er',
  'Asset Management': 'am',
  'Consulting': 'consulting',
  'Accounting & Audit': 'accounting',
  'Accounting / Audit / Tax': 'accounting',
  'Real Estate': 're',
  'Restructuring': 'rx',
};

const TRACK_LABELS: Record<string, string> = {
  ib: 'Investment Banking',
  pe: 'Private Equity',
  vc: 'Venture Capital',
  st: 'Sales & Trading',
  er: 'Equity Research',
  am: 'Asset Management',
  consulting: 'Consulting',
  accounting: 'Accounting & Audit',
  re: 'Real Estate',
  rx: 'Restructuring',
};

const DRILL_SIZE_FREE = 5;
const DRILL_SIZE_PAID = 10;
const HISTORY_CAP = 100;

// ─── Types ──────────────────────────────────────────────────────────────────
type Tab = 'practice' | 'history' | 'progress';
type Phase = 'landing' | 'drilling' | 'done';
type Difficulty = 'any' | 'easy' | 'medium' | 'hard';

type FlashTrack = {
  seen: number;
  pass: number;
  partial: number;
  fail: number;
  byCat: Record<string, { seen: number; pass: number }>;
};

type DrillHistoryItem = {
  id: string;
  trackKey: string;
  topic: string;
  difficulty: string;
  question: string;
  scenario?: string;
  options: string[];
  correctIdx: number;
  userIdx: number | null; // null = skipped
  correct: boolean;
  explanation: string;
  timestamp: number;
};

// ─── Utils ──────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function cap(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// ─── Top-level Suspense wrapper ────────────────────────────────────────────
export default function ConceptDrills() {
  return (
    <Suspense fallback={<div className="cd-app"><div /></div>}>
      <ConceptDrillsInner />
    </Suspense>
  );
}

function ConceptDrillsInner() {
  // ─── User identity + selected vertical ───────────────────────────────────
  const [profile, setProfile] = useState<{ first: string; vertical: string; userId: string }>({
    first: '',
    vertical: '',
    userId: '',
  });

  const loadProfile = useCallback(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      const userId = localStorage.getItem('offerbell_user_id') || '';
      if (raw) {
        const p = JSON.parse(raw);
        setProfile({
          first: p.firstName || '',
          vertical: (Array.isArray(p.targetRoles) && p.targetRoles[0]) || '',
          userId,
        });
      } else {
        setProfile({ first: '', vertical: '', userId });
      }
    } catch {}
  }, []);

  useEffect(() => {
    loadProfile();
    // Listen for in-window profile changes (user switched industry via sidebar).
    // Storage events only fire cross-tab so we use this custom event.
    const onChanged = () => loadProfile();
    window.addEventListener('offerbell-profile-changed', onChanged);
    return () => window.removeEventListener('offerbell-profile-changed', onChanged);
  }, [loadProfile]);

  // Apply saved theme on mount (mirrors other pages' pattern).
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('offerbell-theme') : null;
    if (saved && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  // Track key derived from the user's selected vertical. Empty for verticals
  // without a flash_perf track yet.
  const selectedTrackKey = VERTICAL_TO_TRACK[profile.vertical] || '';
  const trackDef = selectedTrackKey ? DRILL_TRACKS[selectedTrackKey] : null;

  // Reset tab + phase when track switches, so a user switching from IB to PE
  // doesn't see leftover IB drill state.
  useEffect(() => {
    setTab('practice');
    setPhase('landing');
    setQuestions([]);
    setIdx(0);
    setSelected(null);
    setShowExp(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, [selectedTrackKey]);

  // ─── Tabs and phase ──────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>('practice');
  const [phase, setPhase] = useState<Phase>('landing');

  // ─── Plan-aware drill size: free=5 q/drill, pro/elite=10 q/drill ────────
  const userPlan = useUserPlan();
  const drillSize = userPlan === 'free' ? DRILL_SIZE_FREE : DRILL_SIZE_PAID;

  // ─── Drilling state ──────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<DrillQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  // Stored so "Drill again" repeats the same filter.
  const [drillFilter, setDrillFilter] = useState<{ topic: string; difficulty: Difficulty }>({ topic: '', difficulty: 'any' });
  // Currently-selected filter shown on the Practice tab.
  const [practiceDifficulty, setPracticeDifficulty] = useState<Difficulty>('any');

  // ─── Infinite mode (AI-generated, adaptive, never runs out) ──────────────
  // Reuses the exact drilling UI + local grading. Does NOT write to drill
  // history or Convex (it is endless); results are tracked in-session only and
  // fed back to the model for adaptivity.
  const [infinite, setInfinite] = useState(false);
  const [loadingQ, setLoadingQ] = useState(false);
  const [infErr, setInfErr] = useState('');
  const askedRef = useRef<string[]>([]);
  const resultsRef = useRef<{ topic: string; difficulty: string; correct: boolean }[]>([]);
  const nextQRef = useRef<DrillQ | null>(null);
  const prefetchRef = useRef<Promise<DrillQ | null> | null>(null);

  // Only offer difficulty filters that actually exist for this track, so the
  // user can't pick a difficulty that yields an empty drill (some tracks are
  // entirely 'hard', etc.).
  const availableDifficulties = useMemo<Difficulty[]>(() => {
    const present = new Set((trackDef?.questions || []).map(q => q.difficulty));
    return (['any', 'easy', 'medium', 'hard'] as Difficulty[]).filter(d => d === 'any' || present.has(d));
  }, [trackDef]);
  useEffect(() => {
    if (!availableDifficulties.includes(practiceDifficulty)) setPracticeDifficulty('any');
  }, [availableDifficulties, practiceDifficulty]);

  // ─── Flash perf (per-track) for current track ────────────────────────────
  // Reads from offerbell_flash_perf_{trackKey}. Same shape the dashboard
  // reads. perfTick increments after each answer to force a re-read of the
  // stored data so the topic cards and progress stats update live.
  const [flashPerf, setFlashPerf] = useState<FlashTrack | null>(null);
  const [perfTick, setPerfTick] = useState(0);

  const loadFlashPerf = useCallback(() => {
    if (!selectedTrackKey) {
      setFlashPerf(null);
      return;
    }
    try {
      const raw = localStorage.getItem(`offerbell_flash_perf_${selectedTrackKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFlashPerf({
          seen: parsed.seen || 0,
          pass: parsed.pass || 0,
          partial: parsed.partial || 0,
          fail: parsed.fail || 0,
          byCat: (parsed.byCat && typeof parsed.byCat === 'object') ? parsed.byCat : {},
        });
      } else {
        setFlashPerf({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} });
      }
    } catch {
      setFlashPerf({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} });
    }
  }, [selectedTrackKey]);

  useEffect(() => {
    loadFlashPerf();
  }, [loadFlashPerf, perfTick]);

  // ─── Drill history (for Question History tab) ────────────────────────────
  // Read/written DIRECTLY from its Convex table (no localStorage data store), so
  // it syncs cross-device and survives login. Capped at HISTORY_CAP entries.
  const [history, setHistory] = useState<DrillHistoryItem[]>([]);
  const [authUid, setAuthUid] = useState('');
  const [authTok, setAuthTok] = useState<string | undefined>(undefined);
  useEffect(() => {
    try {
      setAuthUid(localStorage.getItem('offerbell_user_id') || '');
      setAuthTok(localStorage.getItem('offerbell_session') || undefined);
    } catch {}
  }, []);
  const serverDrill = useQuery(api.drillHistory.getDrillHistory, authUid ? { userId: authUid, sessionToken: authTok } : 'skip');
  const upsertDrillHistory = useMutation(api.drillHistory.upsertDrillHistory);

  // Warm-start the Question History from a read-only local cache so it does not
  // flash empty until the server query resolves. Read only for first paint,
  // written only from server data / our own appends; never pushed back.
  useLayoutEffect(() => {
    try {
      const cached = localStorage.getItem('offerbell_drill_history');
      if (cached) {
        const p = JSON.parse(cached);
        if (Array.isArray(p)) setHistory(p);
      }
    } catch {}
  }, []);

  // Adopt the live server row on load and on any remote change.
  useEffect(() => {
    if (serverDrill === undefined) return; // loading
    const raw = serverDrill && serverDrill.data ? serverDrill.data : '[]';
    let arr: DrillHistoryItem[] = [];
    try { const p = JSON.parse(raw); if (Array.isArray(p)) arr = p; } catch {}
    setHistory(arr);
    try { localStorage.setItem('offerbell_drill_history', raw); } catch {} // refresh warm-start cache
  }, [serverDrill && serverDrill.data]);

  // After login, the sync hook hydrates flash_perf into localStorage
  // asynchronously; re-read profile and stats once it lands so the page doesn't
  // show 0 / "select a track" until a manual refresh. (Drill history is handled
  // by its own live server query above, not this event.)
  useEffect(() => {
    const onHydrated = () => { loadProfile(); setPerfTick(t => t + 1); };
    window.addEventListener('offerbell-progress-hydrated', onHydrated);
    return () => window.removeEventListener('offerbell-progress-hydrated', onHydrated);
  }, [loadProfile]);

  // Filter history to the current track (switching industry hides past
  // drills from other tracks - keeps the view focused).
  const trackHistory = useMemo(() => {
    if (!selectedTrackKey) return [];
    return history.filter(h => h.trackKey === selectedTrackKey);
  }, [history, selectedTrackKey]);

  // ─── Derived stats ───────────────────────────────────────────────────────
  // Sourced from this track's drill history (the same log the Question History
  // tab shows) so the two never disagree. The shared flash_perf counter is NOT
  // used here because Flashcards writes to it too, which would inflate the
  // drill count with flashcard reps.
  const stats = useMemo(() => {
    const seen = trackHistory.length;
    const pass = trackHistory.filter(h => h.correct).length;
    const accuracy = seen > 0 ? Math.round((pass / seen) * 100) : 0;
    return { seen, pass, accuracy };
  }, [trackHistory]);

  // Per-topic rows for the current track, also from drill history.
  const topicRows = useMemo(() => {
    if (!selectedTrackKey || !trackDef) return [];
    return trackDef.topics.map(topic => {
      const items = trackHistory.filter(h => h.topic === topic);
      const seen = items.length;
      const pass = items.filter(h => h.correct).length;
      const accuracy = seen > 0 ? Math.round((pass / seen) * 100) : 0;
      const available = trackDef.questions.filter(q => q.topic === topic).length;
      return { topic, seen, pass, accuracy, available };
    });
  }, [selectedTrackKey, trackDef, trackHistory]);

  // ─── History filters ─────────────────────────────────────────────────────
  const [historyFilters, setHistoryFilters] = useState<{ topic: string; difficulty: string; search: string }>({
    topic: '',
    difficulty: '',
    search: '',
  });

  const filteredHistory = useMemo(() => {
    return trackHistory
      .filter(h => !historyFilters.topic || h.topic === historyFilters.topic)
      .filter(h => !historyFilters.difficulty || h.difficulty === historyFilters.difficulty)
      .filter(h => {
        if (!historyFilters.search) return true;
        const needle = historyFilters.search.toLowerCase();
        return h.question.toLowerCase().includes(needle) || h.explanation.toLowerCase().includes(needle);
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [trackHistory, historyFilters]);

  // ─── Start a drill ───────────────────────────────────────────────────────
  function startDrill(topic: string, difficulty: Difficulty) {
    if (!trackDef) return;
    let pool = trackDef.questions.slice();
    if (topic) pool = pool.filter(q => q.topic === topic);
    if (difficulty !== 'any') pool = pool.filter(q => q.difficulty === difficulty);
    if (pool.length === 0) return;
    // Smart cycling: serve questions the user hasn't seen yet first (guarantees
    // coverage), then resurface ones they previously got wrong (spaced
    // repetition), then the least-recently-seen. Falls back to pure random when
    // there's no history. Seen-state comes from drill history (capped), so this
    // reflects recent history rather than all-time.
    const lastSeen = new Map<string, { ts: number; correct: boolean }>();
    for (const h of history) {
      if (h.trackKey !== selectedTrackKey) continue;
      const prev = lastSeen.get(h.question);
      if (!prev || h.timestamp > prev.ts) lastSeen.set(h.question, { ts: h.timestamp, correct: h.correct });
    }
    const unseen = pool.filter(q => !lastSeen.has(q.q));
    const missed = pool.filter(q => lastSeen.get(q.q)?.correct === false)
      .sort((a, b) => (lastSeen.get(a.q)?.ts ?? 0) - (lastSeen.get(b.q)?.ts ?? 0));
    const passed = pool.filter(q => lastSeen.get(q.q)?.correct === true)
      .sort((a, b) => (lastSeen.get(a.q)?.ts ?? 0) - (lastSeen.get(b.q)?.ts ?? 0));
    const ordered = [...shuffle(unseen), ...missed, ...passed];
    const shuffled = shuffle(ordered.slice(0, drillSize));
    setQuestions(shuffled);
    setIdx(0);
    setSelected(null);
    setShowExp(false);
    setCorrectCount(0);
    setWrongCount(0);
    setDrillFilter({ topic, difficulty });
    setPhase('drilling');
  }

  // ─── Infinite mode helpers ───────────────────────────────────────────────
  async function fetchInfinite(): Promise<DrillQ | null> {
    const res = await fetch('/api/drill-infinite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track: selectedTrackKey,
        trackTitle: trackDef?.title || selectedTrackKey,
        topics: Array.from(new Set((trackDef?.questions || []).map(q => q.topic))),
        recent: resultsRef.current.slice(-6),
        avoid: askedRef.current.slice(-25),
      }),
    });
    if (!res.ok) throw new Error('gen');
    const data = await res.json();
    const q = data.question;
    if (!q || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) return null;
    return q as DrillQ;
  }

  // Retry a few times to ride out transient failures / bad generations.
  async function fetchInfiniteRetry(tries = 3): Promise<DrillQ | null> {
    for (let i = 0; i < tries; i++) {
      try {
        const q = await fetchInfinite();
        if (q) return q;
      } catch { /* try again */ }
    }
    return null;
  }

  // Kick off a background fetch for the NEXT question (called the moment the
  // user answers), so "Next question" is instant. Stores result in nextQRef.
  function prefetchNext() {
    if (nextQRef.current || prefetchRef.current) return;
    const p = (async () => {
      const q = await fetchInfiniteRetry();
      nextQRef.current = q;
      return q;
    })();
    prefetchRef.current = p;
    p.finally(() => { if (prefetchRef.current === p) prefetchRef.current = null; });
  }

  async function startInfinite() {
    if (!trackDef) return;
    askedRef.current = [];
    resultsRef.current = [];
    nextQRef.current = null;
    prefetchRef.current = null;
    setInfinite(true);
    setQuestions([]);
    setIdx(0);
    setSelected(null);
    setShowExp(false);
    setCorrectCount(0);
    setWrongCount(0);
    setInfErr('');
    setDrillFilter({ topic: '', difficulty: 'any' });
    setPhase('drilling');
    setLoadingQ(true);
    const q = await fetchInfiniteRetry();
    if (!q) { setInfErr('Could not generate a question. Try again.'); setLoadingQ(false); return; }
    askedRef.current.push(q.q);
    setQuestions([q]);
    setIdx(0);
    setLoadingQ(false);
    prefetchNext(); // warm up question 2 in the background
  }

  async function nextInfinite() {
    setInfErr('');
    // Fast path: the prefetched question is already here.
    if (nextQRef.current) {
      const q = nextQRef.current;
      nextQRef.current = null;
      askedRef.current.push(q.q);
      setQuestions(prev => [...prev, q]);
      setIdx(i => i + 1);
      setSelected(null);
      setShowExp(false);
      prefetchNext();
      return;
    }
    // Otherwise wait on the in-flight prefetch, or fetch fresh.
    setLoadingQ(true);
    let q: DrillQ | null = null;
    try {
      if (prefetchRef.current) q = await prefetchRef.current;
      nextQRef.current = null;
      if (!q) q = await fetchInfiniteRetry();
    } catch { q = null; }
    if (!q) { setInfErr('Could not generate the next question. Try again.'); setLoadingQ(false); return; }
    askedRef.current.push(q.q);
    setQuestions(prev => [...prev, q]);
    setIdx(i => i + 1);
    setSelected(null);
    setShowExp(false);
    setLoadingQ(false);
    prefetchNext();
  }

  // ─── Answer / skip ───────────────────────────────────────────────────────
  function answer(ci: number) {
    if (showExp) return;
    const q = questions[idx];
    if (!q) return;
    const ok = ci === q.correct;
    setSelected(ci);
    setShowExp(true);
    if (ok) setCorrectCount(c => c + 1);
    else setWrongCount(w => w + 1);

    // Infinite mode: track the result in-session for adaptivity, but never
    // write to drill history or Convex (it is endless).
    if (infinite) {
      resultsRef.current.push({ topic: q.topic, difficulty: q.difficulty, correct: ok });
      prefetchNext();
      return;
    }

    // NOTE: drills intentionally do NOT write to offerbell_flash_perf_{track}.
    // That counter is read only by the Flashcards tab; writing drill answers to
    // it inflated the Flashcards "cards seen" count. Drill performance is fully
    // captured in offerbell_drill_history below, which the drills tab and the
    // dashboard (Total Drills / Avg Score / Skill Heatmap) read from.

    // Append to drill history (capped at HISTORY_CAP, newest first).
    appendHistory({
      id: uid(),
      trackKey: selectedTrackKey,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.q,
      scenario: q.scenario,
      options: q.options,
      correctIdx: q.correct,
      userIdx: ci,
      correct: ok,
      explanation: q.explanation,
      timestamp: Date.now(),
    });
  }

  function skipQuestion() {
    if (showExp) return;
    const q = questions[idx];
    if (!q) return;
    setSelected(null);
    setShowExp(true);
    setWrongCount(w => w + 1);

    if (infinite) {
      resultsRef.current.push({ topic: q.topic, difficulty: q.difficulty, correct: false });
      prefetchNext();
      return;
    }

    // (See note in answer(): drills do not write to flash_perf. The skip is
    // recorded in offerbell_drill_history below.)

    appendHistory({
      id: uid(),
      trackKey: selectedTrackKey,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.q,
      scenario: q.scenario,
      options: q.options,
      correctIdx: q.correct,
      userIdx: null,
      correct: false,
      explanation: q.explanation,
      timestamp: Date.now(),
    });
  }

  function appendHistory(item: DrillHistoryItem) {
    const next = [item, ...history].slice(0, HISTORY_CAP);
    setHistory(next);
    const str = JSON.stringify(next);
    try { localStorage.setItem('offerbell_drill_history', str); } catch {} // keep warm-start cache current
    if (authUid) {
      upsertDrillHistory({ userId: authUid, sessionToken: authTok, data: str, updatedAt: Date.now() }).catch(() => {});
    }
  }

  function nextQuestion() {
    if (infinite) { nextInfinite(); return; }
    if (idx + 1 >= questions.length) {
      setPhase('done');
      setPerfTick(t => t + 1);
      return;
    }
    setIdx(i => i + 1);
    setSelected(null);
    setShowExp(false);
  }

  function endDrill() {
    setInfinite(false);
    setLoadingQ(false);
    setInfErr('');
    setPhase('landing');
    setPerfTick(t => t + 1);
  }

  // ─── Drilling phase render ──────────────────────────────────────────────
  const currentQ = questions[idx];

  // Infinite mode: first-question loading / error screen (no currentQ yet).
  if (phase === 'drilling' && infinite && !currentQ) {
    return (
      <div className="cd-app">
        <Sidebar activePage="concept-drills" />
        <main className="cd-canvas">
          <div className="cd-page">
            <div className="cd-drill-inner">
              <div className="cd-drill-head">
                <button type="button" className="cd-back-btn" onClick={endDrill} aria-label="Back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                </button>
                <div className="cd-drill-head-text">
                  <div className="cd-drill-title">Infinite drill</div>
                  <div className="cd-drill-sub">{trackDef?.title || ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 16px', textAlign: 'center' }}>
                {infErr ? (
                  <>
                    <div style={{ color: '#dc2626', fontSize: 14, marginBottom: 16 }}>{infErr}</div>
                    <button type="button" className="cd-btn cd-btn-primary" onClick={startInfinite}>Try again</button>
                  </>
                ) : (
                  <>
                    <div style={{ width: 34, height: 34, border: '3px solid var(--border, rgba(0,0,0,.12))', borderTopColor: 'var(--accent, #3b75ff)', borderRadius: '50%', animation: 'cdspin .7s linear infinite' }} />
                    <div style={{ color: 'var(--text-3, #888)', fontSize: 14, marginTop: 16 }}>Generating your first question...</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
        <style>{`@keyframes cdspin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (phase === 'drilling' && currentQ) {
    const drillProgress = ((idx + 1) / questions.length) * 100;
    return (
      <div className="cd-app">
        <Sidebar activePage="concept-drills" />
        <main className="cd-canvas">
          <div className="cd-page">
            <div className="cd-drill-inner">
              <div className="cd-drill-head">
                <button type="button" className="cd-back-btn" onClick={endDrill} aria-label="Back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </button>
                <div className="cd-drill-head-text">
                  <div className="cd-drill-title">{infinite ? 'Infinite drill' : (drillFilter.topic || (trackDef?.title || 'Drill'))}</div>
                  <div className="cd-drill-sub">{infinite ? `Question ${idx + 1}` : `Question ${idx + 1} of ${questions.length}`}</div>
                </div>
              </div>
              {!infinite && (
                <div className="cd-drill-progress">
                  <div className="cd-drill-progress-fill" style={{ width: `${drillProgress}%` }} />
                </div>
              )}

              <div className="cd-drill-tags">
                <span className={`cd-tag cd-tag-diff cd-tag-diff-${currentQ.difficulty}`}>{cap(currentQ.difficulty)}</span>
                <span className="cd-tag cd-tag-topic">{currentQ.topic}</span>
              </div>
              <h2 className="cd-drill-q">{currentQ.q}</h2>
              {currentQ.scenario && (
                <div className="cd-drill-scenario">{currentQ.scenario}</div>
              )}

              <div className="cd-drill-options">
                {currentQ.options.map((opt, i) => {
                  let className = 'cd-drill-option';
                  if (showExp) {
                    if (i === currentQ.correct) className += ' correct';
                    else if (i === selected) className += ' wrong';
                  } else if (i === selected) {
                    className += ' selected';
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      className={className}
                      onClick={() => answer(i)}
                      disabled={showExp}
                    >
                      <span className="cd-drill-option-letter">{String.fromCharCode(65 + i)}</span>
                      <span className="cd-drill-option-text">{opt}</span>
                      {showExp && i === currentQ.correct && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {showExp && i === selected && i !== currentQ.correct && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {showExp && (
                <div className="cd-drill-exp">
                  <div className="cd-drill-exp-head">
                    {selected !== null && selected === currentQ.correct ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
                        <span style={{ color: '#16a34a' }}>Correct</span>
                      </>
                    ) : selected !== null ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                        <span style={{ color: '#dc2626' }}>Incorrect</span>
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        <span style={{ color: 'var(--text-3)' }}>Skipped</span>
                      </>
                    )}
                  </div>
                  <div className="cd-drill-exp-body">{currentQ.explanation}</div>
                </div>
              )}

              <div className="cd-drill-foot">
                {!showExp ? (
                  <button type="button" className="cd-btn cd-btn-secondary" onClick={skipQuestion}>
                    Skip / I don&apos;t know
                  </button>
                ) : (
                  <div />
                )}
                {showExp && (
                  <button type="button" className="cd-btn cd-btn-primary" onClick={nextQuestion} disabled={loadingQ}>
                    {loadingQ ? 'Generating...' : infinite ? 'Next question' : (idx + 1 >= questions.length ? 'Finish drill' : 'Next question')}
                  </button>
                )}
              </div>
              {infinite && infErr && (
                <div style={{ color: '#dc2626', fontSize: 13, marginTop: 10, textAlign: 'right' }}>{infErr}</div>
              )}
              {infinite && <style>{`@keyframes cdspin{to{transform:rotate(360deg)}}`}</style>}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Done phase ──────────────────────────────────────────────────────────
  if (phase === 'done') {
    const totalAnswered = correctCount + wrongCount;
    const finalAccuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return (
      <div className="cd-app">
        <Sidebar activePage="concept-drills" />
        <main className="cd-canvas">
          <div className="cd-page">
            <div className="cd-done-inner">
              <div className="cd-done-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1 className="cd-done-title">Drill complete</h1>
              <div className="cd-done-sub">
                {drillFilter.topic || trackDef?.title || ''}
                {drillFilter.difficulty !== 'any' ? ` · ${cap(drillFilter.difficulty)}` : ''}
              </div>
              <div className="cd-done-stats">
                <div className="cd-done-stat">
                  <div className="cd-done-stat-lbl">Score</div>
                  <div className="cd-done-stat-num">{correctCount}/{questions.length}</div>
                </div>
                <div className="cd-done-stat">
                  <div className="cd-done-stat-lbl">Accuracy</div>
                  <div className="cd-done-stat-num">{finalAccuracy}%</div>
                </div>
              </div>
              <div className="cd-done-actions">
                <button type="button" className="cd-btn cd-btn-secondary" onClick={endDrill}>
                  Back to drills
                </button>
                <button type="button" className="cd-btn cd-btn-primary" onClick={() => startDrill(drillFilter.topic, drillFilter.difficulty)}>
                  Drill again
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── Landing phase: tabs ─────────────────────────────────────────────────
  return (
    <div className="cd-app">
      <Sidebar activePage="concept-drills" />
      <main className="cd-canvas">
        <div className="cd-page">
          <div className="cd-page-inner">
            <div className="cd-page-head">
              <h1 className="cd-page-title">Concept <em>Drills</em></h1>
              <div className="cd-page-sub">
                {selectedTrackKey
                  ? `Practice ${TRACK_LABELS[selectedTrackKey]} technicals and track your accuracy.`
                  : 'Practice technical concepts and track your accuracy.'}
              </div>
            </div>

            <div className="cd-tabs">
              {(['practice', 'history', 'progress'] as Tab[]).map(t => (
                <button
                  key={t}
                  type="button"
                  className={`cd-tab${tab === t ? ' active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t === 'practice' ? 'Practice' : t === 'history' ? 'Question History' : 'Progress'}
                </button>
              ))}
            </div>

            {!selectedTrackKey ? (
              <div className="cd-empty-state">
                {!profile.vertical
                  ? 'Pick an industry in the sidebar to see your drills.'
                  : `Drills for ${profile.vertical} are coming soon. Try Coach or Mock Interview for this track.`}
              </div>
            ) : (
              <>
                {tab === 'practice' && (
                  <div className="cd-tab-pane">
                    <div className="cd-stats-grid">
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Questions done</div>
                        <div className="cd-stat-num">{stats.seen}</div>
                        <div className="cd-stat-sub">In {TRACK_LABELS[selectedTrackKey]}</div>
                      </div>
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Accuracy</div>
                        <div className="cd-stat-num">{stats.accuracy}%</div>
                        <div className="cd-stat-sub">{stats.pass} correct</div>
                      </div>
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Topics</div>
                        <div className="cd-stat-num">{trackDef?.topics.length || 0}</div>
                        <div className="cd-stat-sub">Available to drill</div>
                      </div>
                    </div>

                    <div className="cd-filter-row">
                      <div className="cd-filter-lbl">Difficulty</div>
                      <div className="cd-filter-options">
                        {availableDifficulties.map(d => (
                          <button
                            key={d}
                            type="button"
                            className={`cd-chip${practiceDifficulty === d ? ' active' : ''}`}
                            onClick={() => setPracticeDifficulty(d)}
                          >
                            {cap(d)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cd-quick-start"
                      onClick={() => startDrill('', practiceDifficulty)}
                    >
                      <div className="cd-quick-start-text">
                        <div className="cd-quick-start-title">Mixed drill</div>
                        <div className="cd-quick-start-sub">{drillSize} random questions across all {trackDef?.topics.length || 0} topics</div>
                      </div>
                      <div className="cd-quick-start-arrow">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="cd-quick-start"
                      onClick={() => startInfinite()}
                      style={{ marginTop: 10 }}
                    >
                      <div className="cd-quick-start-text">
                        <div className="cd-quick-start-title">Infinite drill <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--accent, #3b75ff)', marginLeft: 6 }}>AI</span></div>
                        <div className="cd-quick-start-sub">Endless AI questions that adapt to you. Never run out.</div>
                      </div>
                      <div className="cd-quick-start-arrow">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </button>

                    <div className="cd-section-title">Topics</div>
                    <div className="cd-topics-grid">
                      {topicRows.map(t => (
                        <button
                          key={t.topic}
                          type="button"
                          className="cd-topic-card"
                          onClick={() => startDrill(t.topic, practiceDifficulty)}
                          disabled={t.available === 0}
                        >
                          <div className="cd-topic-head">
                            <div className="cd-topic-name">{t.topic}</div>
                            <div className={`cd-topic-acc${t.seen === 0 ? ' cd-topic-acc-none' : t.accuracy >= 75 ? ' cd-topic-acc-good' : t.accuracy >= 50 ? ' cd-topic-acc-mid' : ' cd-topic-acc-low'}`}>
                              {t.seen > 0 ? `${t.accuracy}%` : '-'}
                            </div>
                          </div>
                          <div className="cd-topic-bar-track">
                            <div
                              className="cd-topic-bar-fill"
                              style={{
                                width: t.seen > 0 ? `${t.accuracy}%` : '0%',
                                background: t.seen === 0 ? 'var(--border)' : t.accuracy >= 75 ? '#16a34a' : t.accuracy >= 50 ? '#f59e0b' : '#ef4444',
                              }}
                            />
                          </div>
                          <div className="cd-topic-meta">
                            <span>{t.seen > 0 ? `${t.seen} answered` : 'Not started'}</span>
                            <span>{t.available > 0 ? 'Tap to drill' : 'No questions yet'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'history' && (
                  <div className="cd-tab-pane">
                    {trackHistory.length === 0 ? (
                      <div className="cd-empty-state">
                        Complete a drill to see your question history here.
                      </div>
                    ) : (
                      <>
                        <div className="cd-history-filters">
                          <input
                            type="text"
                            placeholder="Search questions or explanations..."
                            value={historyFilters.search}
                            onChange={e => setHistoryFilters(f => ({ ...f, search: e.target.value }))}
                            className="cd-input"
                          />
                          <select
                            value={historyFilters.topic}
                            onChange={e => setHistoryFilters(f => ({ ...f, topic: e.target.value }))}
                            className="cd-select"
                          >
                            <option value="">All topics</option>
                            {trackDef?.topics.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={historyFilters.difficulty}
                            onChange={e => setHistoryFilters(f => ({ ...f, difficulty: e.target.value }))}
                            className="cd-select"
                          >
                            <option value="">All difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div className="cd-history-count">
                          Showing {filteredHistory.length} of {trackHistory.length} questions
                        </div>
                        <div className="cd-history-list">
                          {filteredHistory.map(h => (
                            <HistoryCard key={h.id} item={h} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {tab === 'progress' && (
                  <div className="cd-tab-pane">
                    <div className="cd-stats-grid">
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Questions done</div>
                        <div className="cd-stat-num">{stats.seen}</div>
                      </div>
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Correct</div>
                        <div className="cd-stat-num">{stats.pass}</div>
                      </div>
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Accuracy</div>
                        <div className="cd-stat-num">{stats.accuracy}%</div>
                      </div>
                      <div className="cd-stat">
                        <div className="cd-stat-lbl">Topics seen</div>
                        <div className="cd-stat-num">{topicRows.filter(t => t.seen > 0).length}</div>
                        <div className="cd-stat-sub">of {topicRows.length}</div>
                      </div>
                    </div>

                    <div className="cd-progress-grid">
                      <div className="cd-progress-card">
                        <div className="cd-progress-card-title">Your strengths</div>
                        {(() => {
                          const strong = topicRows.filter(t => t.seen >= 3 && t.accuracy >= 75).sort((a, b) => b.accuracy - a.accuracy);
                          if (strong.length === 0) {
                            return <div className="cd-empty-inline">Complete more drills to identify your strengths.</div>;
                          }
                          return (
                            <div className="cd-progress-list">
                              {strong.map(t => (
                                <div key={t.topic} className="cd-progress-item">
                                  <div className="cd-progress-item-name">{t.topic}</div>
                                  <div className="cd-progress-item-stat" style={{ color: '#16a34a' }}>{t.accuracy}%</div>
                                  <div className="cd-progress-item-sub">{t.seen} questions</div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="cd-progress-card">
                        <div className="cd-progress-card-title">Areas to improve</div>
                        {(() => {
                          const weak = topicRows.filter(t => t.seen > 0 && t.accuracy < 75).sort((a, b) => a.accuracy - b.accuracy);
                          if (weak.length === 0) {
                            return <div className="cd-empty-inline">Nothing below 75% yet. Keep drilling.</div>;
                          }
                          return (
                            <div className="cd-progress-list">
                              {weak.map(t => (
                                <div key={t.topic} className="cd-progress-item">
                                  <div className="cd-progress-item-name">{t.topic}</div>
                                  <div className="cd-progress-item-stat" style={{ color: '#dc2626' }}>{t.accuracy}%</div>
                                  <div className="cd-progress-item-sub">{t.seen} questions</div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── History card subcomponent ──────────────────────────────────────────────
function HistoryCard({ item }: { item: DrillHistoryItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cd-history-card${item.correct ? ' cd-history-card-ok' : item.userIdx === null ? ' cd-history-card-skip' : ' cd-history-card-bad'}`}>
      <div className="cd-history-card-head">
        <div className="cd-history-card-tags">
          <span className="cd-tag cd-tag-topic">{item.topic}</span>
          <span className={`cd-tag cd-tag-diff cd-tag-diff-${item.difficulty}`}>{cap(item.difficulty)}</span>
        </div>
        <div className={`cd-history-card-result${item.correct ? ' good' : item.userIdx === null ? ' skip' : ' bad'}`}>
          {item.correct ? 'Correct' : item.userIdx === null ? 'Skipped' : 'Wrong'}
        </div>
      </div>
      <div className="cd-history-card-q">{item.question}</div>
      <button
        type="button"
        className="cd-history-card-expand"
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'Hide answer' : 'View answer & explanation'}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="cd-history-card-body">
          {item.scenario && <div className="cd-history-card-scenario">{item.scenario}</div>}
          <div className="cd-history-card-options">
            {item.options.map((opt, i) => {
              let cls = 'cd-history-card-option';
              if (i === item.correctIdx) cls += ' correct';
              else if (i === item.userIdx) cls += ' wrong';
              return (
                <div key={i} className={cls}>
                  <span className="cd-drill-option-letter">{String.fromCharCode(65 + i)}</span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>
          <div className="cd-history-card-exp">
            <div className="cd-history-card-exp-lbl">Explanation</div>
            <div className="cd-history-card-exp-body">{item.explanation}</div>
          </div>
        </div>
      )}
    </div>
  );
}
