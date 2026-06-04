'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import Sidebar from '../components/Sidebar';
import { useIsPro } from '../lib/usePlan';
import './mock-interview.css';
import { IB_FLASHCARDS, Flashcard } from '../flashcards/ib-flashcard-data';
import { PE_FLASHCARDS } from '../flashcards/pe-flashcard-data';
import { CONSULTING_FLASHCARDS } from '../flashcards/consulting-flashcard-data';
import { ACCT_FLASHCARDS } from '../flashcards/acct-flashcard-data';
import { AM_FLASHCARDS } from '../flashcards/am-flashcard-data';
import { ST_FLASHCARDS } from '../flashcards/st-flashcard-data';
import { ER_FLASHCARDS, RE_FLASHCARDS, VC_FLASHCARDS, RX_FLASHCARDS } from '../flashcards/other-flashcard-data';
import { saveVideoBlob, loadVideoBlob, deleteVideoBlob, pruneOrphanedVideos } from './video-storage';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type Grade = 'Great' | 'Good' | 'Bad';

type ResponseEntry = {
  id: string;
  questionId: string;
  videoUrl: null;
  transcript: string;
  grade: Grade;
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  wordsPerMin: number;
  durationSec: number;
  timestamp: number;
  hidden?: boolean;
  category?: string;
};

type TrackDef = { id: string; title: string; cards: Flashcard[] };

type InterviewType = 'behavioral' | 'technical' | 'mixed';

type InterviewConfig = {
  company: string;
  stage: string;
  trackId: string;
  location: string;
  type: InterviewType | '';
};

type InterviewQAEntry = {
  question: string;
  correctAnswer: string;
  transcript: string;
  grade: Grade;
  scoreAvg: number;
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  responseId: string | null;  // links to mockResponses entry when graded
  skipped: boolean;
  durationSec: number;
};

type InterviewSession = {
  id: string;
  timestamp: number;
  config: InterviewConfig;
  trackTitle: string;
  questions: InterviewQAEntry[];
  avgScore: number;       // 0-10
  questionsAnswered: number;
  questionsSkipped: number;
  totalDurationSec: number;
};

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const TRACKS: TrackDef[] = [
  {id:'ib',title:'Investment Banking',cards:IB_FLASHCARDS},
  {id:'pe',title:'Private Equity',cards:PE_FLASHCARDS},
  {id:'rx',title:'Restructuring',cards:RX_FLASHCARDS},
  {id:'consulting',title:'Consulting',cards:CONSULTING_FLASHCARDS},
  {id:'accounting',title:'Accounting',cards:ACCT_FLASHCARDS},
  {id:'am',title:'Asset Management',cards:AM_FLASHCARDS},
  {id:'st',title:'Sales & Trading',cards:ST_FLASHCARDS},
  {id:'er',title:'Equity Research',cards:ER_FLASHCARDS},
  {id:'re',title:'Real Estate',cards:RE_FLASHCARDS},
  {id:'vc',title:'Venture Capital',cards:VC_FLASHCARDS},
];

const ROLE_TO_TRACK: Record<string, string> = {
  'Investment Banking': 'ib',
  'Private Equity': 'pe',
  'Growth Equity': 'pe',
  'Hedge Fund': 'am',
  'Asset Management': 'am',
  'Sales & Trading': 'st',
  'Equity Research': 'er',
  'Consulting': 'consulting',
  'Accounting & Audit': 'accounting',
  'Real Estate': 're',
  'Venture Capital': 'vc',
  'Restructuring': 'rx',
};

const QUESTIONS_PER_INTERVIEW = 10;
const RECORDING_LIMIT_SEC = 60;

const RESPONSES_KEY = 'offerbell_mock_responses';
const SESSIONS_KEY = 'offerbell_mock_interviews';

function loadResponses(): ResponseEntry[] {
  try { const raw = localStorage.getItem(RESPONSES_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveResponses(entries: ResponseEntry[]) {
  // Best-effort cache. Must never throw: a localStorage failure (e.g. quota)
  // used to abort the caller before the durable Convex save ran, silently
  // dropping the attempt from both stores. Convex is the source of truth.
  try { localStorage.setItem(RESPONSES_KEY, JSON.stringify(entries.slice(0, 200))); } catch {}
}
function loadInterviews(): InterviewSession[] {
  try { const raw = localStorage.getItem(SESSIONS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveInterviews(s: InterviewSession[]) {
  try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(s.slice(0, 50))); } catch {}
}
function makeQid(trackId: string, q: string): string {
  return `${trackId}::${q.slice(0, 80)}`;
}
function scoreToGrade(avg: number): Grade {
  if (avg >= 8) return 'Great';
  if (avg >= 5) return 'Good';
  return 'Bad';
}
function gradeToScore(g: Grade): number {
  return g === 'Great' ? 10 : g === 'Good' ? 6 : 2;
}

// Select N questions from track filtered by interview type.
// Filtering is strictly by category === 'Behavioral'. Matching against the
// question text was poisoning the pool: technical questions like
// 'Why does depreciation add back to cash flow?' were getting classified
// as behavioral because of the word 'why'.
function selectInterviewQuestions(track: TrackDef, type: InterviewType, count: number): Flashcard[] {
  const all = track.cards;
  const behavioralPool = all.filter(c => c.category === 'Behavioral');
  const technicalPool = all.filter(c => c.category !== 'Behavioral');

  let pool: Flashcard[];
  if (type === 'behavioral') {
    pool = behavioralPool.length ? behavioralPool : all;
  } else if (type === 'technical') {
    pool = technicalPool.length ? technicalPool : all;
  } else {
    // Mixed: roughly 30% behavioral, 70% technical, shuffled together
    const behCount = Math.min(Math.floor(count * 0.3), behavioralPool.length);
    const techCount = count - behCount;
    const shuffledBeh = [...behavioralPool].sort(() => Math.random() - 0.5).slice(0, behCount);
    const shuffledTec = [...technicalPool].sort(() => Math.random() - 0.5).slice(0, techCount);
    return [...shuffledBeh, ...shuffledTec].sort(() => Math.random() - 0.5);
  }

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

type ViewMode = 'hub' | 'single' | 'setup' | 'interview' | 'results';

export default function MockInterviewPage() {
  const router = useRouter();
  const isPro = useIsPro();

  const upsertResponseMut = useMutation(api.mockResponses.upsertResponse);
  const setResponseHiddenMut = useMutation(api.mockResponses.setResponseHidden);
  const importResponsesMut = useMutation(api.mockResponses.importResponses);
  const backfillCategoriesMut = useMutation((api as any).mockResponses.backfillCategories);

  // View routing
  const [view, setView] = useState<ViewMode>('hub');
  const [sidebarTrackId, setSidebarTrackId] = useState<string>('ib');
  const [showProGate, setShowProGate] = useState(false);

  // Single-mode state (preserved from original)
  const [activeTrack, setActiveTrack] = useState<TrackDef | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Shared camera/recording state
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [grading, setGrading] = useState(false);

  // Per-question responses (existing data model)
  const [allResponses, setAllResponses] = useState<ResponseEntry[]>([]);
  const [sessionVideos, setSessionVideos] = useState<Record<string, string>>({});

  // Interview-mode state
  const [setupConfig, setSetupConfig] = useState<InterviewConfig>({
    company: '', stage: '', trackId: 'ib', location: '', type: '',
  });
  const [interviewQuestions, setInterviewQuestions] = useState<Flashcard[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [interviewResults, setInterviewResults] = useState<InterviewQAEntry[]>([]);
  const [allSessions, setAllSessions] = useState<InterviewSession[]>([]);
  const [viewingSession, setViewingSession] = useState<InterviewSession | null>(null);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const recordingStartRef = useRef<number>(0);
  const interviewStartRef = useRef<number>(0);

  // ── Sidebar industry sync ──────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readSidebar = () => {
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        if (!raw) return;
        const p = JSON.parse(raw);
        const role = Array.isArray(p?.targetRoles) ? p.targetRoles[0] : null;
        if (role && ROLE_TO_TRACK[role]) {
          const newId = ROLE_TO_TRACK[role];
          setSidebarTrackId(newId);
          setSetupConfig(c => ({ ...c, trackId: newId }));
          // If user is currently in single-mode track picker, swap to the new track
          // so the page mirrors the sidebar exactly.
          setActiveTrack(curr => {
            if (!curr) return curr;
            const next = TRACKS.find(t => t.id === newId);
            return next || curr;
          });
        }
      } catch {}
    };
    readSidebar();
    const handler = () => readSidebar();
    window.addEventListener('offerbell-profile-changed', handler);
    return () => window.removeEventListener('offerbell-profile-changed', handler);
  }, []);

  // ── Mount: load responses and full sessions ────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const uid = localStorage.getItem('offerbell_user_id');
    if (!uid) { router.replace('/signin'); return; }

    setAllResponses(loadResponses());
    setAllSessions(loadInterviews());

    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;

    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const cloud = await client.query(api.mockResponses.listResponses, { userId: uid, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }) as ResponseEntry[];
        if (cancelled) return;
        const localList = loadResponses();
        if ((!cloud || cloud.length === 0) && localList.length > 0) {
          try {
            await importResponsesMut({ sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined),
              userId: uid,
              entries: localList.map(r => ({
                entryId: r.id, questionId: r.questionId,
                trackId: r.questionId.split('::')[0] || '',
                transcript: r.transcript, grade: r.grade, overallFeedback: r.overallFeedback,
                strengths: r.strengths, weaknesses: r.weaknesses,
                wordsPerMin: r.wordsPerMin, durationSec: r.durationSec,
                timestamp: r.timestamp, hidden: r.hidden,
              })),
            });
          } catch {}
          return;
        }
        const cloudIds = new Set(cloud.map(r => r.id));
        const onlyLocal = localList.filter(r => !cloudIds.has(r.id));
        const merged = [...cloud, ...onlyLocal].sort((a, b) => b.timestamp - a.timestamp);
        setAllResponses(merged);
        saveResponses(merged);
        if (onlyLocal.length > 0) {
          try {
            await importResponsesMut({ sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined),
              userId: uid,
              entries: onlyLocal.map(r => ({
                entryId: r.id, questionId: r.questionId,
                trackId: r.questionId.split('::')[0] || '',
                transcript: r.transcript, grade: r.grade, overallFeedback: r.overallFeedback,
                strengths: r.strengths, weaknesses: r.weaknesses,
                wordsPerMin: r.wordsPerMin, durationSec: r.durationSec,
                timestamp: r.timestamp, hidden: r.hidden,
              })),
            });
          } catch {}
        }
      } catch {}
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // ── Rehydrate video blobs from IDB ─────────────────────────
  useEffect(() => {
    if (allResponses.length === 0) return;
    let cancelled = false;
    (async () => {
      const validIds = new Set(allResponses.map(r => r.id));
      pruneOrphanedVideos(validIds).catch(() => {});
      for (const r of allResponses) {
        if (cancelled) return;
        if (sessionVideos[r.id]) continue;
        const blob = await loadVideoBlob(r.id);
        if (cancelled) return;
        if (blob) {
          const url = URL.createObjectURL(blob);
          setSessionVideos(prev => prev[r.id] ? prev : { ...prev, [r.id]: url });
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResponses]);

  // ── One-time backfill: tag older mock responses with their question category
  // so the dashboard Skill Heatmap can bucket them by topic. Categories are
  // derived locally from the flashcard data this page already imports, then
  // persisted. The mutation only fills rows that currently lack a category.
  const backfilledRef = useRef(false);
  useEffect(() => {
    if (backfilledRef.current) return;
    if (allResponses.length === 0) return;
    const uid = localStorage.getItem('offerbell_user_id');
    if (!uid) return;
    const missing = allResponses.filter(r => !r.category);
    if (missing.length === 0) { backfilledRef.current = true; return; }
    const needTracks = new Set(missing.map(r => r.questionId.split('::')[0]));
    const qidToCat: Record<string, string> = {};
    for (const t of TRACKS) {
      if (!needTracks.has(t.id)) continue;
      for (const c of t.cards) {
        if (c.category) qidToCat[makeQid(t.id, c.q)] = c.category;
      }
    }
    const items = missing
      .map(r => ({ entryId: r.id, category: qidToCat[r.questionId] }))
      .filter((x): x is { entryId: string; category: string } => !!x.category);
    backfilledRef.current = true;
    if (items.length === 0) return;
    setAllResponses(prev => prev.map(r => {
      const hit = items.find(i => i.entryId === r.id);
      return hit ? { ...r, category: hit.category } : r;
    }));
    backfillCategoriesMut({ userId: uid, items, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResponses]);

  // ── Camera lifecycle: on for single+activeQuestion OR interview mode ──
  useEffect(() => {
    const needCamera = (view === 'single' && activeQuestion !== null) || view === 'interview';
    if (!needCamera) {
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      setCameraReady(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraReady(true);
      } catch { setCameraReady(false); }
    })();
    return () => { cancelled = true; };
  }, [view, activeQuestion]);

  // ── Recording timer (per-question cap) ─────────────────────
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          const next = t + 1;
          if (next >= RECORDING_LIMIT_SEC) {
            setTimeout(() => {
              try { recorderRef.current?.stop(); } catch {}
              try { recognitionRef.current?.stop(); } catch {}
              setIsRecording(false);
            }, 0);
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Cleanup video object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(sessionVideos).forEach(u => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ══════════════════════════════════════════════════════════════
  // CATEGORIES (single mode)
  // Free users see only 10% of cards per category (matching flashcards
  // gating). Without this, free users could read every question via single
  // mode and bypass the flashcards paywall entirely.
  // ══════════════════════════════════════════════════════════════
  const categories = useMemo(() => {
    if (!activeTrack) return [];
    const map = new Map<string, Flashcard[]>();
    for (const c of activeTrack.cards) {
      const list = map.get(c.category) || [];
      list.push(c);
      map.set(c.category, list);
    }
    // For free users, take 10% (rounded up, min 1) of each category
    if (!isPro) {
      const gated = new Map<string, Flashcard[]>();
      for (const [name, cards] of map.entries()) {
        const n = Math.max(1, Math.ceil(cards.length * 0.1));
        gated.set(name, cards.slice(0, n));
      }
      return Array.from(gated.entries()).map(([name, cards]) => ({ name, cards }));
    }
    return Array.from(map.entries()).map(([name, cards]) => ({ name, cards }));
  }, [activeTrack, isPro]);

  // Total locked-question count for the upgrade nudge in single-mode picker
  const lockedQuestionCount = useMemo(() => {
    if (!activeTrack || isPro) return 0;
    const total = activeTrack.cards.length;
    const visible = categories.reduce((sum, cat) => sum + cat.cards.length, 0);
    return total - visible;
  }, [activeTrack, categories, isPro]);

  // ══════════════════════════════════════════════════════════════
  // RECORDING (shared by single + interview modes)
  // ══════════════════════════════════════════════════════════════

  function startRecording() {
    if (!streamRef.current) return;
    const inSingle = view === 'single' && activeQuestion && activeTrack;
    const inInterview = view === 'interview' && interviewQuestions[currentQIdx];
    if (!inSingle && !inInterview) return;

    // Free users: 3 recordings per week (shared across both modes)
    const plan = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_plan') || 'free') : 'free';
    if (plan !== 'pro' && plan !== 'elite') {
      try {
        const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1;
        const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0);
        const week = mon.toISOString().split('T')[0];
        const raw = localStorage.getItem('offerbell_mock_weekly');
        let wk = raw ? JSON.parse(raw) : { week, count: 0 };
        if (wk.week !== week) wk = { week, count: 0 };
        if (wk.count >= 3) {
          alert('Free plan allows 3 mock interviews per week. Upgrade to Pro for unlimited.');
          return;
        }
      } catch {}
    }

    chunksRef.current = [];
    transcriptRef.current = '';
    recordingStartRef.current = Date.now();

    try {
      let recorder: MediaRecorder;
      try { recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9,opus' }); }
      catch { recorder = new MediaRecorder(streamRef.current); }
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => processRecording();
      recorderRef.current = recorder;
      recorder.start();
    } catch { return; }

    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const r = new SR();
        r.continuous = true; r.interimResults = true; r.lang = 'en-US';
        let finalText = '';
        r.onresult = (e: any) => {
          let interimText = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
            else interimText += e.results[i][0].transcript + ' ';
          }
          transcriptRef.current = (finalText + interimText).trim();
        };
        r.onend = () => {
          if (recorderRef.current && recorderRef.current.state === 'recording') {
            try { r.start(); } catch {}
          }
        };
        r.onerror = () => {};
        recognitionRef.current = r;
        r.start();
      }
    } catch {}

    setIsRecording(true);
  }

  function stopRecording() {
    try { recorderRef.current?.stop(); } catch {}
    try { recognitionRef.current?.stop(); } catch {}
    setIsRecording(false);
  }

  async function processRecording() {
    const transcript = transcriptRef.current.trim();
    const actualDuration = Math.round((Date.now() - recordingStartRef.current) / 1000);

    if (!transcript || actualDuration < 2) {
      alert("We didn't catch any audio. Check that your microphone is enabled for this site and try again. (Chrome is the most reliable browser for this feature.)");
      return;
    }

    const inSingle = view === 'single' && activeQuestion && activeTrack;
    const inInterview = view === 'interview' && interviewQuestions[currentQIdx];

    if (inSingle) {
      await processSingleResponse(transcript, actualDuration);
    } else if (inInterview) {
      await processInterviewResponse(transcript, actualDuration);
    }
  }

  // ── Single-mode grading (preserved from original) ──────────
  async function processSingleResponse(transcript: string, actualDuration: number) {
    if (!activeQuestion || !activeTrack) return;
    setGrading(true);

    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    const wpm = actualDuration > 0 ? Math.round((wordCount / actualDuration) * 60) : 0;

    let grade: Grade = 'Bad';
    let overallFeedback = '';
    let strengths: string[] = [];
    let weaknesses: string[] = [];

    try {
      const res = await fetch('/api/interview-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: activeQuestion.q, correctAnswer: activeQuestion.a, userAnswer: transcript, track: activeTrack.id }),
      });
      const data = await res.json();
      if (data.feedback) overallFeedback = data.feedback.replace(/\|\|\|SCORE:.*?\|\|\|/g, '').trim();
      if (data.score) {
        const avg = ((data.score.accuracy || 0) + (data.score.depth || 0) + (data.score.clarity || 0)) / 3;
        grade = scoreToGrade(avg);
        if (Array.isArray(data.score.strengths)) strengths = data.score.strengths;
        else {
          if (data.score.accuracy >= 7) strengths.push('Strong technical accuracy');
          if (data.score.depth >= 7) strengths.push('Good depth of explanation');
          if (data.score.clarity >= 7) strengths.push('Clear and structured communication');
        }
        if (Array.isArray(data.score.weaknesses)) weaknesses = data.score.weaknesses;
        else {
          if (data.score.tip) weaknesses.push(data.score.tip);
          if (data.score.accuracy < 5) weaknesses.push('Technical accuracy needs improvement');
          if (data.score.depth < 5) weaknesses.push('Response lacks sufficient depth');
          if (data.score.clarity < 5) weaknesses.push('Communication could be clearer and more structured');
        }
      }
    } catch {
      overallFeedback = 'Could not connect to AI grader. Please try again.';
    }

    const entryId = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const questionId = makeQid(activeTrack.id, activeQuestion.q);
    const entry: ResponseEntry = {
      id: entryId, questionId, videoUrl: null,
      transcript, grade, overallFeedback, strengths, weaknesses,
      wordsPerMin: wpm, durationSec: actualDuration, timestamp: Date.now(),
      category: activeQuestion.category,
    };

    setSessionVideos(prev => ({ ...prev, [entryId]: videoUrl }));
    const updated = [entry, ...allResponses];
    setAllResponses(updated);
    saveResponses(updated);

    const currentUid = localStorage.getItem('offerbell_user_id');
    if (currentUid) {
      upsertResponseMut({ sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined),
        userId: currentUid, entryId, questionId, trackId: activeTrack.id,
        transcript, grade, overallFeedback, strengths, weaknesses,
        wordsPerMin: wpm, durationSec: actualDuration, timestamp: entry.timestamp,
        category: activeQuestion.category,
      }).catch(() => {});
    }
    saveVideoBlob(entryId, blob).catch(() => {});
    bumpWeeklyUsage();
    setGrading(false);
  }

  // ── Interview-mode grading ─────────────────────────────────
  async function processInterviewResponse(transcript: string, actualDuration: number) {
    const q = interviewQuestions[currentQIdx];
    if (!q) return;
    setGrading(true);

    const track = TRACKS.find(t => t.id === setupConfig.trackId);
    const trackId = track?.id || 'ib';

    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    const wordCount = transcript.split(/\s+/).filter(Boolean).length;
    const wpm = actualDuration > 0 ? Math.round((wordCount / actualDuration) * 60) : 0;

    let grade: Grade = 'Bad';
    let overallFeedback = '';
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let scoreAvg = 0;

    try {
      const res = await fetch('/api/interview-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q.q, correctAnswer: q.a, userAnswer: transcript, track: trackId }),
      });
      const data = await res.json();
      if (data.feedback) overallFeedback = data.feedback.replace(/\|\|\|SCORE:.*?\|\|\|/g, '').trim();
      if (data.score) {
        scoreAvg = ((data.score.accuracy || 0) + (data.score.depth || 0) + (data.score.clarity || 0)) / 3;
        grade = scoreToGrade(scoreAvg);
        if (Array.isArray(data.score.strengths)) strengths = data.score.strengths;
        if (Array.isArray(data.score.weaknesses)) weaknesses = data.score.weaknesses;
      }
    } catch {
      overallFeedback = 'Could not connect to AI grader.';
    }

    const entryId = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const questionId = makeQid(trackId, q.q);

    // Also persist to mockResponses so it shows up in per-question history
    const resp: ResponseEntry = {
      id: entryId, questionId, videoUrl: null,
      transcript, grade, overallFeedback, strengths, weaknesses,
      wordsPerMin: wpm, durationSec: actualDuration, timestamp: Date.now(),
      category: q.category,
    };
    setSessionVideos(prev => ({ ...prev, [entryId]: videoUrl }));
    const updatedResponses = [resp, ...allResponses];
    setAllResponses(updatedResponses);
    saveResponses(updatedResponses);

    const currentUid = localStorage.getItem('offerbell_user_id');
    if (currentUid) {
      upsertResponseMut({ sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined),
        userId: currentUid, entryId, questionId, trackId,
        transcript, grade, overallFeedback, strengths, weaknesses,
        wordsPerMin: wpm, durationSec: actualDuration, timestamp: resp.timestamp,
        category: q.category,
      }).catch(() => {});
    }
    saveVideoBlob(entryId, blob).catch(() => {});
    bumpWeeklyUsage();

    // Append to interview results
    const qaEntry: InterviewQAEntry = {
      question: q.q, correctAnswer: q.a, transcript,
      grade, scoreAvg, overallFeedback, strengths, weaknesses,
      responseId: entryId, skipped: false, durationSec: actualDuration,
    };
    const newResults = [...interviewResults, qaEntry];
    setInterviewResults(newResults);
    setGrading(false);

    // Advance to next question, or end interview
    if (currentQIdx + 1 >= interviewQuestions.length) {
      finalizeInterview(newResults);
    } else {
      setCurrentQIdx(currentQIdx + 1);
    }
  }

  function bumpWeeklyUsage() {
    const plan = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_plan') || 'free') : 'free';
    if (plan === 'pro' || plan === 'elite') return;
    try {
      const now = new Date(); const day = now.getDay(); const diff = day === 0 ? 6 : day - 1;
      const mon = new Date(now); mon.setDate(now.getDate() - diff); mon.setHours(0,0,0,0);
      const week = mon.toISOString().split('T')[0];
      const raw = localStorage.getItem('offerbell_mock_weekly');
      let wk = raw ? JSON.parse(raw) : { week, count: 0 };
      if (wk.week !== week) wk = { week, count: 0 };
      wk.count++;
      localStorage.setItem('offerbell_mock_weekly', JSON.stringify(wk));
    } catch {}
  }

  function deleteResponse(id: string) {
    const updated = allResponses.filter(r => r.id !== id);
    setAllResponses(updated);
    saveResponses(updated);
    if (sessionVideos[id]) { URL.revokeObjectURL(sessionVideos[id]); setSessionVideos(prev => { const n = { ...prev }; delete n[id]; return n; }); }
    deleteVideoBlob(id).catch(() => {});
  }

  function toggleHideResponse(id: string) {
    const updated = allResponses.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r);
    setAllResponses(updated);
    saveResponses(updated);
    const uid = localStorage.getItem('offerbell_user_id');
    const newHidden = !allResponses.find(r => r.id === id)?.hidden;
    if (uid) setResponseHiddenMut({ userId: uid, entryId: id, hidden: newHidden, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }).catch(() => {});
  }

  // ══════════════════════════════════════════════════════════════
  // INTERVIEW FLOW
  // ══════════════════════════════════════════════════════════════

  function openSetup() {
    if (!isPro) {
      setShowProGate(true);
      return;
    }
    setSetupConfig({
      company: '', stage: '', trackId: sidebarTrackId, location: '', type: '',
    });
    setView('setup');
  }

  function startInterview() {
    // Belt-and-suspenders: also gate at start time in case state was forced
    if (!isPro) { setShowProGate(true); return; }
    const track = TRACKS.find(t => t.id === setupConfig.trackId);
    if (!track || !setupConfig.type) return;
    const qs = selectInterviewQuestions(track, setupConfig.type as InterviewType, QUESTIONS_PER_INTERVIEW);
    if (qs.length === 0) { alert('No questions available for this track.'); return; }
    setInterviewQuestions(qs);
    setCurrentQIdx(0);
    setInterviewResults([]);
    interviewStartRef.current = Date.now();
    setView('interview');
  }

  function skipQuestion() {
    const q = interviewQuestions[currentQIdx];
    if (!q) return;
    const qaEntry: InterviewQAEntry = {
      question: q.q, correctAnswer: q.a, transcript: '',
      grade: 'Bad', scoreAvg: 0, overallFeedback: '',
      strengths: [], weaknesses: [],
      responseId: null, skipped: true, durationSec: 0,
    };
    const newResults = [...interviewResults, qaEntry];
    setInterviewResults(newResults);
    if (currentQIdx + 1 >= interviewQuestions.length) {
      finalizeInterview(newResults);
    } else {
      setCurrentQIdx(currentQIdx + 1);
    }
  }

  function endInterview() {
    // Mark remaining unaddressed questions as skipped
    const remaining = interviewQuestions.length - interviewResults.length;
    if (remaining > 0) {
      const skipped: InterviewQAEntry[] = interviewQuestions.slice(interviewResults.length).map(q => ({
        question: q.q, correctAnswer: q.a, transcript: '',
        grade: 'Bad' as Grade, scoreAvg: 0, overallFeedback: '',
        strengths: [], weaknesses: [],
        responseId: null, skipped: true, durationSec: 0,
      }));
      finalizeInterview([...interviewResults, ...skipped]);
    } else {
      finalizeInterview(interviewResults);
    }
  }

  function finalizeInterview(results: InterviewQAEntry[]) {
    if (isRecording) stopRecording();
    const answered = results.filter(r => !r.skipped);
    const avgScore = answered.length > 0
      ? answered.reduce((a, b) => a + b.scoreAvg, 0) / answered.length
      : 0;
    const track = TRACKS.find(t => t.id === setupConfig.trackId);
    const session: InterviewSession = {
      id: `int_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      config: { ...setupConfig },
      trackTitle: track?.title || setupConfig.trackId,
      questions: results,
      avgScore,
      questionsAnswered: answered.length,
      questionsSkipped: results.length - answered.length,
      totalDurationSec: Math.round((Date.now() - interviewStartRef.current) / 1000),
    };
    const updated = [session, ...allSessions];
    setAllSessions(updated);
    saveInterviews(updated);
    setViewingSession(session);
    setView('results');
  }

  function exitInterview() {
    if (confirm('Exit this interview? Your unsaved progress will be lost.')) {
      if (isRecording) stopRecording();
      setView('hub');
    }
  }

  function deleteSession(id: string) {
    if (!confirm('Delete this interview?')) return;
    const updated = allSessions.filter(s => s.id !== id);
    setAllSessions(updated);
    saveInterviews(updated);
  }

  // ══════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const fmtDateShort = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  function playQuestionAudio(text: string) {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95; utter.pitch = 1; utter.volume = 1;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    } catch {}
  }

  // Stats for hub
  const hubStats = useMemo(() => {
    const total = allSessions.length;
    const answeredScores = allSessions.map(s => s.avgScore).filter(s => s > 0);
    const avg = answeredScores.length > 0 ? answeredScores.reduce((a, b) => a + b, 0) / answeredScores.length : 0;
    const best = answeredScores.length > 0 ? Math.max(...answeredScores) : 0;
    const now = new Date();
    const thisMonth = allSessions.filter(s => {
      const d = new Date(s.timestamp);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
    return { total, avg, best, thisMonth };
  }, [allSessions]);

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════

  const sidebarTrack = TRACKS.find(t => t.id === sidebarTrackId);

  return (
    <div className="mi-app">
      <Sidebar activePage="mock-interview" />
      <div className="mi-canvas">
        <div className="mi-page">

          {view === 'hub' && renderHub()}
          {view === 'single' && renderSingle()}
          {view === 'setup' && renderSetupModal()}
          {view === 'interview' && renderInterview()}
          {view === 'results' && renderResults()}

        </div>
      </div>

      {showProGate && (
        <div className="mi-modal-overlay" onClick={() => setShowProGate(false)}>
          <div className="mi-modal mi-pro-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="mi-modal-x mi-modal-x--abs" onClick={() => setShowProGate(false)}>&times;</button>
            <div className="mi-pro-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="mi-pro-modal-title">Full interviews are a Pro feature</div>
            <div className="mi-pro-modal-desc">
              Upgrade to run unlimited 10-question simulated interviews with AI feedback on every answer. Single-question practice stays free.
            </div>
            <div className="mi-pro-modal-feats">
              <div className="mi-pro-modal-feat">
                <span className="mi-pro-modal-dot" />
                <div>
                  <strong>Unlimited full interviews</strong>
                  <br/>10 questions per session pulled from your selected track
                </div>
              </div>
              <div className="mi-pro-modal-feat">
                <span className="mi-pro-modal-dot" />
                <div>
                  <strong>Per-question AI grading</strong>
                  <br/>Accuracy, depth, and clarity scores with feedback for every answer
                </div>
              </div>
              <div className="mi-pro-modal-feat">
                <span className="mi-pro-modal-dot" />
                <div>
                  <strong>Interview history</strong>
                  <br/>Track your average score, best score, and trends over time
                </div>
              </div>
            </div>
            <div className="mi-pro-modal-actions">
              <button type="button" className="mi-btn-ghost" onClick={() => setShowProGate(false)}>Maybe later</button>
              <button type="button" className="mi-btn-primary" onClick={() => router.push('/my-account')}>View Pro plans</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── HUB ────────────────────────────────────────────────────
  function renderHub() {
    return (
      <div className="mi-hub">
        <div className="mi-hub-head">
          <div>
            <h1 className="mi-page-title">Mock <em>Interviews</em></h1>
            <div className="mi-page-sub">Practice and track your interview performance</div>
          </div>
          <button type="button" className="mi-start-btn" onClick={openSetup}>
            {isPro ? 'Start full interview' : 'Start full interview'}
            {!isPro && <span className="mi-pro-badge">Pro</span>}
          </button>
        </div>

        <div className="mi-stats-grid">
          <div className="mi-stat">
            <div className="mi-stat-lbl">Total interviews</div>
            <div className="mi-stat-num">{hubStats.total}</div>
            <div className="mi-stat-sub">All time</div>
          </div>
          <div className="mi-stat">
            <div className="mi-stat-lbl">Average score</div>
            <div className="mi-stat-num">{hubStats.avg.toFixed(1)}<span className="mi-stat-unit">/10</span></div>
            <div className="mi-stat-sub">Across answered Qs</div>
          </div>
          <div className="mi-stat">
            <div className="mi-stat-lbl">Best score</div>
            <div className="mi-stat-num">{hubStats.best.toFixed(1)}<span className="mi-stat-unit">/10</span></div>
            <div className="mi-stat-sub">Personal best</div>
          </div>
          <div className="mi-stat">
            <div className="mi-stat-lbl">This month</div>
            <div className="mi-stat-num">{hubStats.thisMonth}</div>
            <div className="mi-stat-sub">Interviews completed</div>
          </div>
        </div>

        <div className="mi-modes">
          <button type="button" className="mi-mode mi-mode-primary" onClick={() => {
            const t = TRACKS.find(t => t.id === sidebarTrackId) || TRACKS[0];
            setActiveTrack(t);
            setExpandedCats(new Set());
            setActiveQuestion(null);
            setView('single');
          }}>
            <div className="mi-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 17.5h.01"/></svg>
            </div>
            <div className="mi-mode-body">
              <div className="mi-mode-title">Practice a single question</div>
              <div className="mi-mode-sub">Pick any question from the flashcard bank. Record once. Get focused feedback. Free to use.</div>
            </div>
            <div className="mi-mode-arrow">→</div>
          </button>

          <button type="button" className="mi-mode" onClick={openSetup}>
            <div className="mi-mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/></svg>
            </div>
            <div className="mi-mode-body">
              <div className="mi-mode-title">
                Start a full interview
                {!isPro && <span className="mi-pro-badge">Pro</span>}
              </div>
              <div className="mi-mode-sub">A simulated 10-question interview. Pick the type, then run through it like the real thing.</div>
            </div>
            <div className="mi-mode-arrow">→</div>
          </button>
        </div>

        {allSessions.length > 0 && (
          <div className="mi-section">
            <div className="mi-section-head">
              <div className="mi-section-title">Past interviews</div>
              <div className="mi-section-meta">{allSessions.length} session{allSessions.length === 1 ? '' : 's'}</div>
            </div>
            <div className="mi-sessions-list">
              {allSessions.slice(0, 10).map(s => (
                <div key={s.id} className="mi-session-row" onClick={() => { setViewingSession(s); setView('results'); }}>
                  <div className="mi-session-left">
                    <div className="mi-session-co">{s.config.company || s.trackTitle}</div>
                    <div className="mi-session-meta">
                      <span>{s.config.type}</span>
                      <span className="mi-dot" />
                      <span>{s.questions.length} questions</span>
                      <span className="mi-dot" />
                      <span>{fmtDateShort(s.timestamp)}</span>
                    </div>
                  </div>
                  <div className="mi-session-right">
                    <div className="mi-session-score">{s.avgScore.toFixed(1)}<span>/10</span></div>
                    <button type="button" className="mi-session-del" onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} title="Delete">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allSessions.length === 0 && (
          <div className="mi-empty">
            <div className="mi-empty-icons">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/></svg></span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg></span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6"/></svg></span>
            </div>
            <div className="mi-empty-title">No interviews yet</div>
            <div className="mi-empty-sub">Start your first mock interview to see your results here</div>
            <button type="button" className="mi-empty-btn" onClick={openSetup}>
              {isPro ? 'Start your first interview' : 'Unlock with Pro'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── SETUP MODAL (overlays hub) ─────────────────────────────
  function renderSetupModal() {
    const canStart = setupConfig.type && setupConfig.trackId;
    const trackTitle = TRACKS.find(t => t.id === setupConfig.trackId)?.title || '';
    return (
      <>
        {renderHub()}
        <div className="mi-modal-overlay" onClick={() => setView('hub')}>
          <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mi-modal-head">
              <div>
                <div className="mi-modal-title">Set up your mock interview</div>
                <div className="mi-modal-track">For <strong>{trackTitle}</strong> &middot; change in sidebar</div>
              </div>
              <button type="button" className="mi-modal-x" onClick={() => setView('hub')}>&times;</button>
            </div>

            <div className="mi-modal-body">
              <div className="mi-field">
                <label>Company <span className="mi-field-opt">optional</span></label>
                <input
                  type="text"
                  placeholder="e.g., Goldman Sachs, JP Morgan, Vista"
                  value={setupConfig.company}
                  onChange={(e) => setSetupConfig({ ...setupConfig, company: e.target.value })}
                />
              </div>

              <div className="mi-field">
                <label>Office location <span className="mi-field-opt">optional</span></label>
                <input
                  type="text"
                  placeholder="e.g., New York, Cleveland"
                  value={setupConfig.location}
                  onChange={(e) => setSetupConfig({ ...setupConfig, location: e.target.value })}
                />
              </div>

              <div className="mi-field">
                <label>Interview type *</label>
                <select
                  value={setupConfig.type}
                  onChange={(e) => setSetupConfig({ ...setupConfig, type: e.target.value as InterviewType })}
                >
                  <option value="">Select interview type</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical</option>
                  <option value="mixed">Mixed (behavioral + technical)</option>
                </select>
              </div>
            </div>

            <div className="mi-modal-foot">
              <button type="button" className="mi-btn-ghost" onClick={() => setView('hub')}>Cancel</button>
              <button type="button" className="mi-btn-primary" disabled={!canStart} onClick={startInterview}>
                Start interview
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── INTERVIEW MODE ─────────────────────────────────────────
  function renderInterview() {
    const q = interviewQuestions[currentQIdx];
    if (!q) return null;
    const total = interviewQuestions.length;

    return (
      <div className="mi-iv">
        <div className="mi-iv-bar">
          <div className="mi-iv-bar-left">
            <span className="mi-iv-qno">Question {currentQIdx + 1}/{total}</span>
          </div>
          <button type="button" className="mi-iv-exit" onClick={exitInterview}>Exit interview</button>
        </div>

        <div className="mi-iv-q-card">
          <div className="mi-iv-q-text">{q.q}</div>
          <button type="button" className="mi-iv-play" onClick={() => playQuestionAudio(q.q)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11 5L6 9H2v6h4l5 4V5zm4.54 0a8 8 0 0 1 0 14M19 8a4 4 0 0 1 0 8" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            Play Question
          </button>
        </div>

        <div className="mi-iv-video-wrap">
          <video ref={videoRef} autoPlay playsInline muted className="mi-iv-video" />
          {!cameraReady && (
            <div className="mi-iv-video-loading">
              <div className="mi-spinner" />
              <div>Connecting to camera...</div>
            </div>
          )}
          {isRecording && (
            <div className="mi-iv-rec-overlay">
              <div className="mi-rec-dot" />
              REC {fmtTime(recordingTime)} / {fmtTime(RECORDING_LIMIT_SEC)}
            </div>
          )}
        </div>

        {!isRecording && !grading && (
          <div className="mi-iv-actions">
            <button type="button" className="mi-btn-skip" onClick={skipQuestion}>Skip Question</button>
            <button type="button" className="mi-btn-begin" disabled={!cameraReady} onClick={startRecording}>
              Begin Question
            </button>
          </div>
        )}
        {isRecording && (
          <div className="mi-iv-actions">
            <button type="button" className="mi-btn-stop" onClick={stopRecording}>Stop and Submit</button>
          </div>
        )}
        {grading && (
          <div className="mi-iv-grading">
            <div className="mi-spinner" />
            <div>Grading your answer...</div>
          </div>
        )}

        <div className="mi-iv-disclaimer">
          This feature requires camera and microphone access. By using this service, you consent to recording your interview session for evaluation purposes.
        </div>
      </div>
    );
  }

  // ── RESULTS PAGE ───────────────────────────────────────────
  function renderResults() {
    const s = viewingSession;
    if (!s) return null;
    const ratingClass = (avg: number) => avg >= 8 ? 'great' : avg >= 5 ? 'good' : 'bad';

    return (
      <div className="mi-results">
        <button type="button" className="mi-back" onClick={() => setView('hub')}>
          <span className="mi-back-arrow">←</span> Back to Mock Interviews
        </button>

        <div className="mi-results-head">
          <h1 className="mi-page-title">Interview <em>Results</em></h1>
          <div className="mi-results-sub">
            {s.config.company || s.trackTitle} <span className="mi-dot" /> {s.config.type} interview <span className="mi-dot" /> {s.questions.length} questions
          </div>
        </div>

        <div className="mi-stats-grid mi-stats-grid--3">
          <div className="mi-stat">
            <div className="mi-stat-lbl">Average score</div>
            <div className="mi-stat-num">{s.avgScore.toFixed(1)}<span className="mi-stat-unit">/10</span></div>
            <div className="mi-stat-sub">{s.avgScore >= 8 ? 'Strong showing' : s.avgScore >= 5 ? 'Solid baseline' : 'Keep practicing'}</div>
          </div>
          <div className="mi-stat">
            <div className="mi-stat-lbl">Questions answered</div>
            <div className="mi-stat-num">{s.questionsAnswered}<span className="mi-stat-unit">/{s.questions.length}</span></div>
            <div className="mi-stat-sub">Completed</div>
          </div>
          <div className="mi-stat">
            <div className="mi-stat-lbl">Questions skipped</div>
            <div className="mi-stat-num">{s.questionsSkipped}</div>
            <div className="mi-stat-sub">Not answered</div>
          </div>
        </div>

        <div className="mi-results-cta">
          <button type="button" className="mi-btn-primary" onClick={openSetup}>Take another interview</button>
          <button type="button" className="mi-btn-ghost" onClick={() => router.push('/dashboard')}>Back to dashboard</button>
        </div>

        <div className="mi-q-breakdown">
          <div className="mi-section-title" style={{ marginBottom: 18 }}>Question-by-question</div>
          <div className="mi-q-list">
            {s.questions.map((qa, i) => (
              <div key={i} className="mi-q-card">
                <div className="mi-q-card-head">
                  <div className="mi-q-card-no">Question {i + 1}</div>
                  <div className={`mi-q-card-score mi-q-card-score--${ratingClass(qa.scoreAvg)}`}>
                    {qa.skipped ? 'Skipped' : `${qa.scoreAvg.toFixed(1)}/10`}
                  </div>
                </div>
                <div className="mi-q-card-section">
                  <div className="mi-q-card-lbl">Question</div>
                  <div className="mi-q-card-q">{qa.question}</div>
                </div>
                {!qa.skipped && (
                  <div className="mi-q-card-section">
                    <div className="mi-q-card-lbl">Your answer</div>
                    <div className="mi-q-card-ans">{qa.transcript}</div>
                  </div>
                )}
                <div className="mi-q-card-section">
                  <div className="mi-q-card-lbl">Expected answer</div>
                  <div className="mi-q-card-expected">{qa.correctAnswer}</div>
                </div>
                {qa.overallFeedback && (
                  <div className="mi-q-card-section">
                    <div className="mi-q-card-lbl">Feedback</div>
                    <div className="mi-q-card-fb">{qa.overallFeedback}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── SINGLE MODE (preserved flow, redesigned wrapper) ───────
  // No track picker any more. activeTrack is auto-set from the sidebar industry
  // when the user enters single-mode (same pattern as flashcards and drills).
  function renderSingle() {
    if (!activeTrack) return null; // shouldn't happen — set on entry
    if (!activeQuestion) return renderSingleQuestionPicker();
    return renderSingleRecording();
  }

  function renderSingleQuestionPicker() {
    const visibleCount = categories.reduce((sum, c) => sum + c.cards.length, 0);
    return (
      <div className="mi-single">
        <button type="button" className="mi-back" onClick={() => setView('hub')}>
          <span className="mi-back-arrow">&larr;</span> Back to hub
        </button>
        <h1 className="mi-page-title">Single <em>Question</em></h1>
        <div className="mi-page-sub">
          {activeTrack!.title} &middot; {visibleCount} question{visibleCount === 1 ? '' : 's'} across {categories.length} topic{categories.length === 1 ? '' : 's'}. Pick one to record.
        </div>

        {!isPro && lockedQuestionCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 18px', marginTop: 16, marginBottom: 16,
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 10, fontSize: 12, color: 'var(--text-3)', gap: 12,
          }}>
            <span>
              Showing <strong style={{ color: 'var(--text)' }}>{visibleCount}</strong> of <strong style={{ color: 'var(--text)' }}>{activeTrack!.cards.length}</strong> questions in this track.
              Upgrade to unlock all {activeTrack!.cards.length}.
            </span>
            <a href="/my-account" style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100,
              background: 'var(--text)', color: 'var(--surface)',
              fontSize: 11, fontWeight: 700, textDecoration: 'none',
              fontFamily: "'Sora', sans-serif", letterSpacing: '0.3px',
            }}>Upgrade</a>
          </div>
        )}

        <div className="mi-cat-list">
          {categories.map(cat => {
            const expanded = expandedCats.has(cat.name);
            return (
              <div key={cat.name} className="mi-cat">
                <button
                  type="button"
                  className="mi-cat-head"
                  onClick={() => setExpandedCats(prev => {
                    const n = new Set(prev);
                    n.has(cat.name) ? n.delete(cat.name) : n.add(cat.name);
                    return n;
                  })}
                >
                  <span className="mi-cat-name">{cat.name}</span>
                  <span className="mi-cat-meta">{cat.cards.length} questions</span>
                  <span className="mi-cat-chev">{expanded ? '-' : '+'}</span>
                </button>
                {expanded && (
                  <div className="mi-cat-body">
                    {cat.cards.map((card, i) => {
                      const qid = makeQid(activeTrack!.id, card.q);
                      const responses = allResponses.filter(r => r.questionId === qid);
                      const bestG: Grade | null = responses.some(r => r.grade === 'Great') ? 'Great'
                        : responses.some(r => r.grade === 'Good') ? 'Good'
                        : responses.length > 0 ? 'Bad' : null;
                      return (
                        <button
                          key={i}
                          type="button"
                          className="mi-q-row"
                          onClick={() => { setActiveQuestion(card); setShowAnswer(false); transcriptRef.current = ''; }}
                        >
                          <div className="mi-q-row-text">{card.q}</div>
                          <div className="mi-q-row-meta">
                            {bestG && <span className={`mi-grade mi-grade--${bestG.toLowerCase()}`}>{bestG}</span>}
                            <span className="mi-arrow-r">&rarr;</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderSingleRecording() {
    const q = activeQuestion!;
    const qid = makeQid(activeTrack!.id, q.q);
    const myResponses = allResponses.filter(r => r.questionId === qid);

    return (
      <div className="mi-single">
        <button type="button" className="mi-back" onClick={() => { setActiveQuestion(null); if (isRecording) stopRecording(); }}>
          <span className="mi-back-arrow">&larr;</span> Back to questions
        </button>

        <div className="mi-single-q-card">
          <div className="mi-single-q-track">{activeTrack!.title} <span className="mi-dot" /> {q.category}</div>
          <div className="mi-single-q-text">{q.q}</div>
          <button type="button" className="mi-iv-play" onClick={() => playQuestionAudio(q.q)}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
            Play question
          </button>
        </div>

        <div className="mi-iv-video-wrap">
          <video ref={videoRef} autoPlay playsInline muted className="mi-iv-video" />
          {!cameraReady && (
            <div className="mi-iv-video-loading">
              <div className="mi-spinner" />
              <div>Connecting to camera...</div>
            </div>
          )}
          {isRecording && (
            <div className="mi-iv-rec-overlay">
              <div className="mi-rec-dot" />
              REC {fmtTime(recordingTime)} / {fmtTime(RECORDING_LIMIT_SEC)}
            </div>
          )}
        </div>

        <div className="mi-iv-actions">
          {!isRecording && !grading && (
            <button type="button" className="mi-btn-begin" disabled={!cameraReady} onClick={startRecording}>
              {myResponses.length > 0 ? 'Try again' : 'Begin recording'}
            </button>
          )}
          {isRecording && (
            <button type="button" className="mi-btn-stop" onClick={stopRecording}>Stop and Submit</button>
          )}
          {grading && <div className="mi-iv-grading"><div className="mi-spinner" /><div>Grading...</div></div>}
        </div>

        {!showAnswer && (
          <button type="button" className="mi-show-answer" onClick={() => setShowAnswer(true)}>Show expected answer</button>
        )}
        {showAnswer && (
          <div className="mi-expected">
            <div className="mi-expected-lbl">Expected answer</div>
            <div className="mi-expected-body">{q.a}</div>
          </div>
        )}

        {myResponses.length > 0 && (
          <div className="mi-attempts">
            <div className="mi-section-head" style={{ marginTop: 28 }}>
              <div className="mi-section-title">Past attempts on this question ({myResponses.length})</div>
            </div>
            <div className="mi-attempts-list">
              {myResponses.map(r => (
                <div key={r.id} className="mi-attempt">
                  <div className="mi-attempt-head">
                    <span className={`mi-grade mi-grade--${r.grade.toLowerCase()}`}>{r.grade}</span>
                    <span className="mi-attempt-meta">{r.wordsPerMin} wpm <span className="mi-dot" /> {r.durationSec}s <span className="mi-dot" /> {new Date(r.timestamp).toLocaleString()}</span>
                    <div className="mi-attempt-actions">
                      <button type="button" onClick={() => toggleHideResponse(r.id)} title={r.hidden ? 'Show the full review for this attempt' : 'Collapse the full review for this attempt'}>
                        {r.hidden ? 'Show review' : 'Hide review'}
                      </button>
                    </div>
                  </div>
                  {!r.hidden && (
                    <>
                      {sessionVideos[r.id] && (
                        <video src={sessionVideos[r.id]} controls className="mi-attempt-video" />
                      )}
                      <div className="mi-attempt-section">
                        <div className="mi-attempt-lbl">Transcript</div>
                        <div className="mi-attempt-body">{r.transcript}</div>
                      </div>
                      {r.overallFeedback && (
                        <div className="mi-attempt-section">
                          <div className="mi-attempt-lbl">Feedback</div>
                          <div className="mi-attempt-body">{r.overallFeedback}</div>
                        </div>
                      )}
                      {r.strengths.length > 0 && (
                        <div className="mi-attempt-section">
                          <div className="mi-attempt-lbl">Strengths</div>
                          <ul className="mi-attempt-list">{r.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                        </div>
                      )}
                      {r.weaknesses.length > 0 && (
                        <div className="mi-attempt-section">
                          <div className="mi-attempt-lbl">Improve</div>
                          <ul className="mi-attempt-list">{r.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
