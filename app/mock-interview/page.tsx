'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useAction } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
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
};

type TrackDef = { id: string; title: string; cards: Flashcard[]; icon: React.ReactNode };

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════

const TRACKS: TrackDef[] = [
  {id:'ib',title:'Investment Banking',cards:IB_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
  {id:'pe',title:'Private Equity',cards:PE_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
  {id:'rx',title:'Restructuring',cards:RX_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
  {id:'consulting',title:'Consulting',cards:CONSULTING_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>},
  {id:'accounting',title:'Accounting',cards:ACCT_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>},
  {id:'am',title:'Asset Management',cards:AM_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>},
  {id:'st',title:'Sales & Trading',cards:ST_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  {id:'er',title:'Equity Research',cards:ER_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>},
  {id:'re',title:'Real Estate',cards:RE_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>},
  {id:'vc',title:'Venture Capital',cards:VC_FLASHCARDS,icon:<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>},
];

const RESPONSES_KEY = 'offerbell_mock_responses';
const RECORDING_LIMIT_SEC = 60;

function loadResponses(): ResponseEntry[] {
  try { const raw = localStorage.getItem(RESPONSES_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function saveResponses(entries: ResponseEntry[]) {
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(entries.slice(0, 200)));
}
function makeQid(trackId: string, q: string): string {
  return `${trackId}::${q.slice(0, 80)}`;
}
function scoreToGrade(avg: number): Grade {
  if (avg >= 7.5) return 'Great';
  if (avg >= 5) return 'Good';
  return 'Bad';
}
function gCls(g: Grade): string {
  return g === 'Great' ? 'great' : g === 'Good' ? 'good' : 'bad';
}
// Display label for grades. Internal data stays 'Great'|'Good'|'Bad';
// users see Strong/Mid/Bad which is the language Divy prefers for these levels.
function gradeLabel(g: Grade): string {
  return g === 'Great' ? 'Strong' : g === 'Good' ? 'Mid' : 'Bad';
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MockInterviewPage() {
  const router = useRouter();

  // Per-entry Convex mutations. Replaces the old blob-sync path for
  // offerbell_mock_responses, which round-tripped ~500KB on every save.
  const upsertResponseMut = useMutation(api.mockResponses.upsertResponse);
  const setResponseHiddenMut = useMutation(api.mockResponses.setResponseHidden);
  const importResponsesMut = useMutation(api.mockResponses.importResponses);

  const [activeTrack, setActiveTrack] = useState<TrackDef | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<Flashcard | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [grading, setGrading] = useState(false);
  const [showHidden, setShowHidden] = useState(false);

  const [allResponses, setAllResponses] = useState<ResponseEntry[]>([]);
  const [sessionVideos, setSessionVideos] = useState<Record<string, string>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef('');
  const recognitionRef = useRef<any>(null);
  const recordingStartRef = useRef<number>(0);

  // Init: load responses. Source of truth is now the Convex mockResponses
  // table. We hydrate from there, with a one-time migration for users whose
  // data still lives only in localStorage (the legacy blob-sync path).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const uid = localStorage.getItem('offerbell_user_id');
    if (!uid) { router.replace('/signin'); return; }

    // Start with whatever's in localStorage so the UI isn't blank during fetch
    const localList = loadResponses();
    setAllResponses(localList);

    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;

    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const cloud = await client.query(api.mockResponses.listResponses, { userId: uid }) as ResponseEntry[];
        if (cancelled) return;

        // If cloud has nothing but local does, this user predates the split.
        // One-time migration: push everything in localStorage up to Convex.
        if ((!cloud || cloud.length === 0) && localList.length > 0) {
          try {
            await importResponsesMut({
              userId: uid,
              entries: localList.map(r => ({
                entryId: r.id,
                questionId: r.questionId,
                trackId: r.questionId.split('::')[0] || '',
                transcript: r.transcript,
                grade: r.grade,
                overallFeedback: r.overallFeedback,
                strengths: r.strengths,
                weaknesses: r.weaknesses,
                wordsPerMin: r.wordsPerMin,
                durationSec: r.durationSec,
                timestamp: r.timestamp,
                hidden: r.hidden,
              })),
            });
          } catch {}
          return; // localList already in state
        }

        // Merge: prefer cloud version, but keep any local entry not yet uploaded.
        const cloudIds = new Set(cloud.map(r => r.id));
        const onlyLocal = localList.filter(r => !cloudIds.has(r.id));
        const merged = [...cloud, ...onlyLocal].sort((a, b) => b.timestamp - a.timestamp);
        setAllResponses(merged);
        saveResponses(merged);

        // Push any local-only entries up to Convex
        if (onlyLocal.length > 0) {
          try {
            await importResponsesMut({
              userId: uid,
              entries: onlyLocal.map(r => ({
                entryId: r.id,
                questionId: r.questionId,
                trackId: r.questionId.split('::')[0] || '',
                transcript: r.transcript,
                grade: r.grade,
                overallFeedback: r.overallFeedback,
                strengths: r.strengths,
                weaknesses: r.weaknesses,
                wordsPerMin: r.wordsPerMin,
                durationSec: r.durationSec,
                timestamp: r.timestamp,
                hidden: r.hidden,
              })),
            });
          } catch {}
        }
      } catch {
        // Network failure - keep showing localStorage data
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Rehydrate video blobs from IndexedDB for any responses we don't have in memory.
  // Object URLs only live for the current page session, so we recreate them from the
  // persisted blobs on every page load. Runs whenever the response list changes.
  useEffect(() => {
    if (allResponses.length === 0) return;
    let cancelled = false;
    (async () => {
      // First pass: clean up any IDB blobs whose response was deleted in another tab/session
      const validIds = new Set(allResponses.map(r => r.id));
      pruneOrphanedVideos(validIds).catch(() => {});

      // Load each missing video and add to sessionVideos as it arrives
      for (const r of allResponses) {
        if (cancelled) return;
        if (sessionVideos[r.id]) continue; // already have this one
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

  // Camera lifecycle
  useEffect(() => {
    if (!activeQuestion) {
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
  }, [activeQuestion]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          const next = t + 1;
          if (next >= RECORDING_LIMIT_SEC) {
            // Hit the cap - stop recording. Defer so we don't tear down inside the setState callback.
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

  // Categories for current track
  const categories = useMemo(() => {
    if (!activeTrack) return [];
    const map = new Map<string, Flashcard[]>();
    for (const c of activeTrack.cards) {
      const list = map.get(c.category) || [];
      list.push(c);
      map.set(c.category, list);
    }
    return Array.from(map.entries()).map(([name, cards]) => ({ name, cards }));
  }, [activeTrack]);

  // Navigation
  function openTrack(t: TrackDef) { setActiveTrack(t); setExpandedCats(new Set()); setActiveQuestion(null); }
  function toggleCat(c: string) { setExpandedCats(prev => { const n = new Set(prev); n.has(c) ? n.delete(c) : n.add(c); return n; }); }
  function openQuestion(card: Flashcard) { setActiveQuestion(card); setShowAnswer(false); setIsRecording(false); setRecordingTime(0); transcriptRef.current = ''; setShowHidden(false); }
  function backToCats() { setActiveQuestion(null); setShowAnswer(false); if (isRecording) stopRecording(); }
  function backToTracks() { setActiveTrack(null); setActiveQuestion(null); }

  // Recording
  function startRecording() {
    if (!streamRef.current || !activeQuestion || !activeTrack) return;

    // Free users: 3 recordings per week
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

    // MediaRecorder
    try {
      let recorder: MediaRecorder;
      try { recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm;codecs=vp9,opus' }); }
      catch { recorder = new MediaRecorder(streamRef.current); }
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => processRecording();
      recorderRef.current = recorder;
      recorder.start();
    } catch { return; }

    // Speech recognition. Chrome's Web Speech API silently stops after pauses
    // and internal timeouts, so we capture interim results and auto-restart
    // while the MediaRecorder is still going.
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const r = new SR();
        r.continuous = true; r.interimResults = true; r.lang = 'en-US';

        let finalText = '';
        r.onresult = (e: any) => {
          let interimText = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal) {
              finalText += e.results[i][0].transcript + ' ';
            } else {
              interimText += e.results[i][0].transcript + ' ';
            }
          }
          transcriptRef.current = (finalText + interimText).trim();
        };
        r.onend = () => {
          // If we're still recording, the engine timed out by itself - restart it
          if (recorderRef.current && recorderRef.current.state === 'recording') {
            try { r.start(); } catch {}
          }
        };
        r.onerror = (_e: any) => { /* 'no-speech' and 'aborted' are normal - onend will restart if needed */ };
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
    if (!activeQuestion || !activeTrack) return;

    const transcript = transcriptRef.current.trim();
    const actualDuration = Math.round((Date.now() - recordingStartRef.current) / 1000);

    // No speech captured - bail without consuming usage or hitting the AI grader.
    // This happens when the mic didn't pick up audio, browser permissions were off,
    // or speech recognition silently failed mid-recording.
    if (!transcript || actualDuration < 2) {
      alert("We didn't catch any audio. Check that your microphone is enabled for this site and try again. (Chrome is the most reliable browser for this feature.)");
      return;
    }

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

      if (data.feedback) {
        overallFeedback = data.feedback.replace(/\|\|\|SCORE:.*?\|\|\|/g, '').trim();
      }
      if (data.score) {
        const avg = ((data.score.accuracy || 0) + (data.score.depth || 0) + (data.score.clarity || 0)) / 3;
        grade = scoreToGrade(avg);
        // Use structured strengths/weaknesses from AI if provided
        if (data.score.strengths && Array.isArray(data.score.strengths)) {
          strengths = data.score.strengths;
        } else {
          if (data.score.accuracy >= 7) strengths.push('Strong technical accuracy');
          if (data.score.depth >= 7) strengths.push('Good depth of explanation');
          if (data.score.clarity >= 7) strengths.push('Clear and structured communication');
        }
        if (data.score.weaknesses && Array.isArray(data.score.weaknesses)) {
          weaknesses = data.score.weaknesses;
        } else {
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
    };

    setSessionVideos(prev => ({ ...prev, [entryId]: videoUrl }));
    const updated = [entry, ...allResponses];
    setAllResponses(updated);
    saveResponses(updated);

    // Push this single entry to Convex (replaces the old ~500KB blob round-trip).
    // Fire-and-forget; localStorage is the immediate source of truth.
    const currentUid = localStorage.getItem('offerbell_user_id');
    if (currentUid) {
      upsertResponseMut({
        userId: currentUid,
        entryId,
        questionId,
        trackId: activeTrack.id,
        transcript,
        grade,
        overallFeedback,
        strengths,
        weaknesses,
        wordsPerMin: wpm,
        durationSec: actualDuration,
        timestamp: entry.timestamp,
      }).catch(() => {});
    }

    // Persist the video blob to IndexedDB so it survives page reloads.
    // Fire-and-forget; if it fails (quota, browser limits) video stays session-only.
    saveVideoBlob(entryId, blob).catch(() => {});

    // Increment weekly usage for free users
    const plan = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_plan') || 'free') : 'free';
    if (plan !== 'pro' && plan !== 'elite') {
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

    setGrading(false);
  }

  function deleteResponse(id: string) {
    const updated = allResponses.filter(r => r.id !== id);
    setAllResponses(updated);
    saveResponses(updated);
    if (sessionVideos[id]) { URL.revokeObjectURL(sessionVideos[id]); setSessionVideos(prev => { const n = { ...prev }; delete n[id]; return n; }); }
    // Also clear the persisted blob so storage doesn't grow forever
    deleteVideoBlob(id).catch(() => {});
  }

  function toggleHideResponse(id: string) {
    const updated = allResponses.map(r => r.id === id ? { ...r, hidden: !r.hidden } : r);
    setAllResponses(updated);
    saveResponses(updated);
    // Mirror the flag change to Convex
    const uid = localStorage.getItem('offerbell_user_id');
    const newHidden = !allResponses.find(r => r.id === id)?.hidden;
    if (uid) {
      setResponseHiddenMut({ userId: uid, entryId: id, hidden: newHidden }).catch(() => {});
    }
  }

  // Helpers
  function bestForQ(questionId: string): Grade | null {
    const m = allResponses.filter(r => r.questionId === questionId);
    if (!m.length) return null;
    if (m.some(r => r.grade === 'Great')) return 'Great';
    if (m.some(r => r.grade === 'Good')) return 'Good';
    return 'Bad';
  }
  function avgForQ(questionId: string): Grade | null {
    const m = allResponses.filter(r => r.questionId === questionId);
    if (!m.length) return null;
    const s = m.map(r => r.grade === 'Great' ? 10 : r.grade === 'Good' ? 6 : 2);
    return scoreToGrade(s.reduce((a, b) => a + b, 0) / s.length);
  }
  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Thumb icons
  const ThumbUp = <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>;
  const ThumbDown = <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 15V19a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>;

  // ══════════════════════════════════════════════════════════════
  // RENDER: TRACK PICKER
  // ══════════════════════════════════════════════════════════════

  if (!activeTrack) {
    const totalAttempted = new Set(allResponses.map(r => r.questionId)).size;
    const totalSubmissions = allResponses.length;
    const hasActivity = totalSubmissions > 0;

    // Per-track subtle theme. Color only used for the accent dot + the
    // bottom action chevron, never as a saturated background tile.
    const TRACK_THEME: Record<string, string> = {
      ib: '#2563eb', pe: '#16a34a', consulting: '#7c3aed', accounting: '#ea580c',
      am: '#dc2626', st: '#0891b2', er: '#d97706', re: '#0d9488', rx: '#475569', vc: '#c026d3',
    };
    // Standard industry 2-letter codes. Rendered in serif italic in the row
    // as a quiet editorial alternative to icon tiles.
    const TRACK_CODE: Record<string, string> = {
      ib: 'IB', pe: 'PE', consulting: 'CN', accounting: 'AC',
      am: 'AM', st: 'ST', er: 'ER', re: 'RE', rx: 'RX', vc: 'VC',
    };
    const TRACK_DESCS: Record<string, string> = {
      ib: 'DCF, LBO, M&A, valuation, and accounting questions from top banks.',
      pe: 'Fund mechanics, deal sourcing, portfolio ops, and returns analysis.',
      rx: 'Bankruptcy, distressed debt, credit analysis, and turnaround strategies.',
      consulting: 'Case frameworks, market sizing, profitability, and fit questions.',
      accounting: 'Financial statements, audit, tax, and technical accounting.',
      am: 'Portfolio theory, stock pitches, risk management, and market analysis.',
      st: 'Trading mechanics, derivatives, macro, and market-making concepts.',
      er: 'Equity valuation, sector analysis, financial modeling, and stock recommendations.',
      re: 'Cap rates, NOI, property valuation, and real estate finance.',
      vc: 'Startup valuation, term sheets, due diligence, and venture mechanics.',
    };

    return (
      <div className="app">
        <Sidebar activePage="mock-interview" />
        <main className="main" style={{ padding: '32px 36px 80px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Practice</div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 46, lineHeight: 1, letterSpacing: '-1.2px', color: 'var(--text)', fontWeight: 400, margin: '0 0 14px' }}>
                Mock <em style={{ fontStyle: 'italic' }}>interview</em>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.55, maxWidth: 560, margin: 0 }}>
                Record yourself answering real interview questions. Get AI feedback on accuracy, depth, and clarity, with video playback of every attempt.
              </p>
            </div>

            {/* Stats strip - only shows once user has any activity */}
            {hasActivity && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 28,
                padding: '14px 18px', marginBottom: 24,
                background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12,
              }}>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 3 }}>Submissions</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.4px', lineHeight: 1 }}>{totalSubmissions}</div>
                </div>
                <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 3 }}>Questions practiced</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#22c55e', letterSpacing: '-0.4px', lineHeight: 1 }}>{totalAttempted}</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Across {TRACKS.length} career tracks</div>
              </div>
            )}

            {/* Track list - wide rows, NOT a card grid (intentionally distinct from concept drills) */}
            <div style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: '56px 1fr 220px 84px 50px',
                alignItems: 'center', gap: 16,
                padding: '10px 20px',
                background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
                fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-3)',
              }} className="mi-list-head">
                <span></span>
                <span>Track</span>
                <span>Progress</span>
                <span style={{ textAlign: 'center' }}>Best</span>
                <span></span>
              </div>

              {TRACKS.map((t, i) => {
                const accent = TRACK_THEME[t.id] || 'var(--text-2)';
                const total = t.cards.length;
                const attemptedSet = new Set(allResponses.filter(r => r.questionId.startsWith(t.id + '::')).map(r => r.questionId));
                const attempted = attemptedSet.size;
                const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;
                const tResps = allResponses.filter(r => r.questionId.startsWith(t.id + '::'));
                const tBest: Grade | null = tResps.length === 0 ? null : tResps.some(r => r.grade === 'Great') ? 'Great' : tResps.some(r => r.grade === 'Good') ? 'Good' : 'Bad';
                const bestColor = tBest === 'Great' ? '#22c55e' : tBest === 'Good' ? '#f59e0b' : tBest === 'Bad' ? '#dc2626' : 'var(--text-3)';
                const bestBg = tBest === 'Great' ? 'rgba(34, 197, 94, 0.10)' : tBest === 'Good' ? 'rgba(245, 158, 11, 0.10)' : tBest === 'Bad' ? 'rgba(220, 38, 38, 0.10)' : 'transparent';
                return (
                  <div
                    key={t.id}
                    onClick={() => openTrack(t)}
                    className="mi-list-row"
                    style={{
                      display: 'grid', gridTemplateColumns: '56px 1fr 220px 84px 50px',
                      alignItems: 'center', gap: 16,
                      padding: '16px 20px',
                      borderBottom: i < TRACKS.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.12s ease',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: 'italic',
                      fontSize: 24,
                      letterSpacing: '-0.5px',
                      color: accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      lineHeight: 1,
                    }}>{TRACK_CODE[t.id] || ''}</div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{t.title}</div>
                      <div style={{
                        fontSize: 12, color: 'var(--text-3)', lineHeight: 1.45,
                        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{TRACK_DESCS[t.id] || ''}</div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 75 ? '#22c55e' : pct >= 40 ? '#f59e0b' : accent, borderRadius: 2, transition: 'width 0.3s ease' }} />
                        </div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', minWidth: 28, textAlign: 'right' }}>{pct}%</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                        {attempted === 0 ? 'Not started' : `${attempted} ${attempted === 1 ? 'question' : 'questions'} done`}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {tBest === null ? (
                        <span style={{ color: 'var(--text-3)', fontSize: 12 }}>--</span>
                      ) : (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '3px 9px', borderRadius: 100,
                          background: bestBg, color: bestColor,
                          fontSize: 10.5, fontWeight: 700,
                        }}>
                          {tBest === 'Great' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          {tBest === 'Good' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />}
                          {tBest === 'Bad' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>}
                          {gradeLabel(tBest)}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'var(--text-3)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
          <style>{`
            .mi-list-row:hover { background: var(--surface-2) !important; }
            .mi-cat-row-new:hover { border-color: var(--border-2) !important; }
            .mi-q-row-new:hover { background: var(--surface-2) !important; }
            @media (max-width: 720px) {
              .mi-list-head { grid-template-columns: 56px 1fr 50px !important; }
              .mi-list-head > span:nth-child(3), .mi-list-head > span:nth-child(4) { display: none; }
              .mi-list-row { grid-template-columns: 56px 1fr 50px !important; }
              .mi-list-row > div:nth-child(3), .mi-list-row > div:nth-child(4) { display: none; }
            }
          `}</style>
        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: QUESTION DETAIL
  // ══════════════════════════════════════════════════════════════

  if (activeQuestion) {
    const questionId = makeQid(activeTrack.id, activeQuestion.q);
    const qResps = allResponses.filter(r => r.questionId === questionId);
    const visibleResps = qResps.filter(r => !r.hidden);
    const hiddenResps = qResps.filter(r => !!r.hidden);
    const shownResps = showHidden ? qResps : visibleResps;
    const best = bestForQ(questionId);
    const avg = avgForQ(questionId);
    const gradePill = (g: Grade | null) => {
      if (!g) return { label: '--', color: 'var(--text-3)', bg: 'var(--surface-2)' };
      if (g === 'Great') return { label: gradeLabel(g), color: '#22c55e', bg: 'rgba(34, 197, 94, 0.10)' };
      if (g === 'Good') return { label: gradeLabel(g), color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.10)' };
      return { label: gradeLabel(g), color: '#dc2626', bg: 'rgba(220, 38, 38, 0.10)' };
    };
    const bestPill = gradePill(best);
    const avgPill = gradePill(avg);

    return (
      <div className="app">
        <Sidebar activePage="mock-interview" />
        <main className="main" style={{ padding: '32px 36px 80px' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

            <button onClick={backToCats} type="button" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', borderRadius: 7,
              background: 'transparent', border: '1.5px solid transparent',
              color: 'var(--text-3)', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginLeft: -10,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back to {activeTrack.title}
            </button>

            {/* Header row: question + stat strip */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, margin: '14px 0 24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0, maxWidth: 620 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>
                  {activeTrack.title} &middot; {activeQuestion.category}
                </div>
                <h1 style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 28, lineHeight: 1.25, letterSpacing: '-0.4px',
                  color: 'var(--text)', fontWeight: 400, margin: 0,
                }}>{activeQuestion.q}</h1>
              </div>
              <div style={{
                display: 'flex', gap: 14, flexShrink: 0,
                padding: '12px 18px',
                background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12,
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>Subs</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1 }}>{qResps.length}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center', minWidth: 56 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>Best</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '3px 8px', borderRadius: 100,
                    background: bestPill.bg, color: bestPill.color,
                    fontSize: 10.5, fontWeight: 700,
                  }}>{bestPill.label}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center', minWidth: 56 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>Avg</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '3px 8px', borderRadius: 100,
                    background: avgPill.bg, color: avgPill.color,
                    fontSize: 10.5, fontWeight: 700,
                  }}>{avgPill.label}</div>
                </div>
              </div>
            </div>

            {/* Reveal answer (collapsible) */}
            {showAnswer && (
              <div style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderLeft: '3px solid #22c55e',
                borderRadius: 10, padding: '14px 18px', marginBottom: 14,
              }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: '#22c55e', marginBottom: 8 }}>Model answer</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{activeQuestion.a}</div>
              </div>
            )}

            {/* Camera card */}
            <div style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 14, overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{ position: 'relative', background: '#000', aspectRatio: '16 / 9' }}>
                <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {isRecording && (
                  <>
                    <div style={{
                      position: 'absolute', top: 14, left: 14,
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '5px 10px', borderRadius: 100,
                      background: 'rgba(220, 38, 38, 0.9)', color: '#fff',
                      fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: 'mi-pulse 1.4s ease-in-out infinite' }} />
                      REC
                    </div>
                    <div style={{
                      position: 'absolute', top: 14, right: 14,
                      padding: '5px 10px', borderRadius: 7,
                      background: recordingTime >= RECORDING_LIMIT_SEC - 10 ? 'rgba(220, 38, 38, 0.92)' : 'rgba(0, 0, 0, 0.6)',
                      color: '#fff',
                      fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                    }}>{recordingTime}s / {RECORDING_LIMIT_SEC}s</div>
                  </>
                )}
                {!isRecording && cameraReady && (
                  <div style={{
                    position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                    padding: '6px 12px', borderRadius: 7,
                    background: 'rgba(0, 0, 0, 0.6)', color: '#fff',
                    fontSize: 11.5, fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}>Click "Record a response" below to start</div>
                )}
                {!cameraReady && !isRecording && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 13, fontWeight: 600,
                  }}>Camera access required. Please allow camera permissions.</div>
                )}
              </div>

              {/* Action bar inside the card */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 18px',
                borderTop: '1px solid var(--border)',
              }}>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={!cameraReady || grading}
                    type="button"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: '#dc2626', color: '#fff',
                      padding: '10px 18px', borderRadius: 9,
                      fontSize: 13, fontWeight: 700,
                      border: 'none',
                      cursor: (!cameraReady || grading) ? 'not-allowed' : 'pointer',
                      opacity: (!cameraReady || grading) ? 0.5 : 1,
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }} />
                    Record a response
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    type="button"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'var(--text)', color: 'var(--surface)',
                      padding: '10px 18px', borderRadius: 9,
                      fontSize: 13, fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    <span style={{ width: 9, height: 9, background: '#fff', borderRadius: 1 }} />
                    Stop &amp; submit
                  </button>
                )}
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  type="button"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: 'transparent', color: 'var(--text-2)',
                    padding: '10px 16px', borderRadius: 9,
                    fontSize: 12.5, fontWeight: 600,
                    border: '1.5px solid var(--border-2)', cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                  }}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  {showAnswer ? 'Hide answer' : 'Reveal answer'}
                </button>
              </div>
            </div>

            {/* Grading loader */}
            {grading && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '20px',
                background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12,
                marginBottom: 16, fontSize: 13, color: 'var(--text-2)',
              }}>
                <div style={{ width: 14, height: 14, border: '2px solid var(--border-2)', borderTopColor: 'var(--text)', borderRadius: '50%', animation: 'mi-spin 0.8s linear infinite' }} />
                Analyzing your response...
              </div>
            )}

            {/* Past responses */}
            {qResps.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
                  Your {visibleResps.length === 1 ? 'response' : `responses (${visibleResps.length})`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {shownResps.map(r => {
                    const vid = sessionVideos[r.id] || null;
                    const pill = gradePill(r.grade);
                    return (
                      <div key={r.id} style={{
                        background: 'var(--surface)', border: '1.5px solid var(--border)',
                        borderRadius: 12, overflow: 'hidden',
                        opacity: r.hidden ? 0.55 : 1,
                      }}>
                        {vid && (
                          <video src={vid} controls playsInline style={{ width: '100%', display: 'block', background: '#000', aspectRatio: '16 / 9', objectFit: 'cover' }} />
                        )}
                        <div style={{ padding: '18px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 100,
                              background: pill.bg, color: pill.color,
                              fontSize: 11, fontWeight: 700,
                            }}>
                              {r.grade === 'Great' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              {r.grade === 'Good' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />}
                              {r.grade === 'Bad' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>}
                              {pill.label}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11.5, color: 'var(--text-3)' }}>
                              <span><strong style={{ color: 'var(--text-2)' }}>{r.strengths.length}</strong> strengths</span>
                              <span><strong style={{ color: 'var(--text-2)' }}>{r.weaknesses.length}</strong> areas to work on</span>
                              <span><strong style={{ color: 'var(--text-2)' }}>{r.wordsPerMin}</strong> wpm</span>
                              <span><strong style={{ color: 'var(--text-2)' }}>{r.durationSec}s</strong></span>
                            </div>
                            <div style={{ flex: 1 }} />
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                              {new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          </div>

                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Overall feedback</div>
                            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{r.overallFeedback}</div>
                          </div>

                          {(r.strengths.length > 0 || r.weaknesses.length > 0) && (
                            <div style={{ display: 'grid', gridTemplateColumns: r.strengths.length > 0 && r.weaknesses.length > 0 ? '1fr 1fr' : '1fr', gap: 14 }}>
                              {r.strengths.length > 0 && (
                                <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 9, borderLeft: '3px solid #22c55e' }}>
                                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#22c55e', marginBottom: 6 }}>Strengths</div>
                                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                                    {r.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                  </ul>
                                </div>
                              )}
                              {r.weaknesses.length > 0 && (
                                <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 9, borderLeft: '3px solid #dc2626' }}>
                                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: '#dc2626', marginBottom: 6 }}>Areas to work on</div>
                                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                                    {r.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          <div style={{ marginTop: 14, textAlign: 'right' }}>
                            <button
                              onClick={() => toggleHideResponse(r.id)}
                              type="button"
                              style={{
                                background: 'none', border: 'none',
                                fontSize: 11, color: 'var(--text-3)',
                                cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                                padding: '4px 8px',
                              }}
                            >{r.hidden ? 'Unhide' : 'Hide'}</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {hiddenResps.length > 0 && (
                  <div style={{ marginTop: 14, textAlign: 'center' }}>
                    <button
                      onClick={() => setShowHidden(s => !s)}
                      type="button"
                      style={{
                        background: 'none', border: '1px solid var(--border)',
                        fontSize: 11, color: 'var(--text-2)',
                        cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                        padding: '6px 14px', borderRadius: 7,
                        letterSpacing: 0.3,
                      }}
                    >{showHidden ? `Collapse ${hiddenResps.length} hidden` : `Show ${hiddenResps.length} hidden`}</button>
                  </div>
                )}
              </div>
            )}

          </div>
          <style>{`
            @keyframes mi-spin { to { transform: rotate(360deg); } }
            @keyframes mi-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
          `}</style>
        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: CATEGORY LIST
  // ══════════════════════════════════════════════════════════════

  return (
    <div className="app">
      <Sidebar activePage="mock-interview" />
      <main className="main" style={{ padding: '32px 36px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', fontFamily: "'Sora', sans-serif" }}>

          <button onClick={backToTracks} type="button" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 7,
            background: 'transparent', border: '1.5px solid transparent',
            color: 'var(--text-3)', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: "'Sora', sans-serif", marginLeft: -10,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            All tracks
          </button>

          <div style={{ margin: '14px 0 28px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>{activeTrack.title}</div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.05, letterSpacing: '-0.8px', color: 'var(--text)', fontWeight: 400, margin: 0 }}>
              Practice <em style={{ fontStyle: 'italic' }}>questions</em>
            </h1>
            <p style={{ fontSize: 13.5, color: 'var(--text-3)', lineHeight: 1.55, margin: '10px 0 0', maxWidth: 560 }}>
              Pick a category, record yourself answering, and get AI feedback line by line.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categories.map(cat => {
              const isExp = expandedCats.has(cat.name);
              const total = cat.cards.length;
              const attemptedSet = new Set(cat.cards.map(c => makeQid(activeTrack.id, c.q)).filter(id => allResponses.some(r => r.questionId === id)));
              const attempted = attemptedSet.size;
              const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;
              const catResps = allResponses.filter(r => cat.cards.some(c => r.questionId === makeQid(activeTrack.id, c.q)));
              const subs = catResps.length;
              const catBest: Grade | null = subs === 0 ? null : catResps.some(r => r.grade === 'Great') ? 'Great' : catResps.some(r => r.grade === 'Good') ? 'Good' : 'Bad';
              const bestColor = catBest === 'Great' ? '#22c55e' : catBest === 'Good' ? '#f59e0b' : catBest === 'Bad' ? '#dc2626' : 'var(--text-3)';
              const bestBg = catBest === 'Great' ? 'rgba(34, 197, 94, 0.10)' : catBest === 'Good' ? 'rgba(245, 158, 11, 0.10)' : catBest === 'Bad' ? 'rgba(220, 38, 38, 0.10)' : 'var(--surface-2)';

              return (
                <div key={cat.name} className="mi-cat-row-new" style={{
                  background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s ease',
                }}>
                  {/* Header row (clickable) */}
                  <div
                    onClick={() => toggleCat(cat.name)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 200px auto auto',
                      alignItems: 'center', gap: 16,
                      padding: '14px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{cat.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {subs === 0 ? 'Not started' : `${subs} ${subs === 1 ? 'submission' : 'submissions'}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 75 ? '#22c55e' : pct >= 40 ? '#f59e0b' : 'var(--text-2)', borderRadius: 2, transition: 'width 0.3s ease' }} />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', minWidth: 32, textAlign: 'right' }}>{pct}%</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 100, background: bestBg, fontSize: 10.5, fontWeight: 700, color: bestColor, minWidth: 64, justifyContent: 'center' }}>
                      {catBest === null ? <span style={{ color: 'var(--text-3)' }}>--</span> : (
                        <>
                          {catBest === 'Great' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          {catBest === 'Good' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />}
                          {catBest === 'Bad' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>}
                          {gradeLabel(catBest)}
                        </>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-3)', transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  {/* Questions list */}
                  {isExp && (
                    <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
                      {cat.cards.map(card => {
                        const cqid = makeQid(activeTrack.id, card.q);
                        const cBest = bestForQ(cqid);
                        const isDone = cBest !== null;
                        const qColor = cBest === 'Great' ? '#22c55e' : cBest === 'Good' ? '#f59e0b' : cBest === 'Bad' ? '#dc2626' : 'var(--text-3)';
                        return (
                          <div
                            key={card.q}
                            className="mi-q-row-new"
                            onClick={() => openQuestion(card)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 14,
                              padding: '12px 20px',
                              borderBottom: '1px solid var(--border)',
                              cursor: 'pointer',
                              transition: 'background 0.12s ease',
                            }}
                          >
                            <div style={{
                              width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                              background: isDone ? '#22c55e' : 'transparent',
                              border: isDone ? 'none' : '1.5px solid var(--border-2)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff',
                            }}>
                              {isDone && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <div style={{ flex: 1, fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{card.q}</div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                              {card.difficulty || 'Intermediate'}
                            </span>
                            {cBest && (
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                padding: '2px 8px', borderRadius: 100,
                                fontSize: 10, fontWeight: 700,
                                color: qColor,
                                background: cBest === 'Great' ? 'rgba(34, 197, 94, 0.10)' : cBest === 'Good' ? 'rgba(245, 158, 11, 0.10)' : 'rgba(220, 38, 38, 0.10)',
                              }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                                {gradeLabel(cBest)}
                              </span>
                            )}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.5 }}><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
