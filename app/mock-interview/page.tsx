'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export default function MockInterviewPage() {
  const router = useRouter();

  const [activeTrack, setActiveTrack] = useState<TrackDef | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [activeQuestion, setActiveQuestion] = useState<Flashcard | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [grading, setGrading] = useState(false);

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

  // Init
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    setAllResponses(loadResponses());
  }, [router]);

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
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
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
  function openQuestion(card: Flashcard) { setActiveQuestion(card); setShowAnswer(false); setIsRecording(false); setRecordingTime(0); transcriptRef.current = ''; }
  function backToCats() { setActiveQuestion(null); setShowAnswer(false); if (isRecording) stopRecording(); }
  function backToTracks() { setActiveTrack(null); setActiveQuestion(null); }

  // Recording
  function startRecording() {
    if (!streamRef.current || !activeQuestion || !activeTrack) return;
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

    // Speech recognition
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const r = new SR();
        r.continuous = true; r.interimResults = false; r.lang = 'en-US';
        r.onresult = (e: any) => {
          let t = '';
          for (let i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) t += e.results[i][0].transcript + ' '; }
          transcriptRef.current = t.trim();
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
    if (!activeQuestion || !activeTrack) return;
    setGrading(true);

    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);
    const transcript = transcriptRef.current || '[No speech detected]';
    const actualDuration = Math.round((Date.now() - recordingStartRef.current) / 1000);
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
    setGrading(false);
  }

  function deleteResponse(id: string) {
    const updated = allResponses.filter(r => r.id !== id);
    setAllResponses(updated);
    saveResponses(updated);
    if (sessionVideos[id]) { URL.revokeObjectURL(sessionVideos[id]); setSessionVideos(prev => { const n = { ...prev }; delete n[id]; return n; }); }
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
    const totalQs = TRACKS.reduce((s, t) => s + t.cards.length, 0);
    const totalAttempted = new Set(allResponses.map(r => r.questionId)).size;
    const totalSubmissions = allResponses.length;

    const TRACK_COLORS: Record<string, { bg: string; color: string }> = {
      ib: { bg: '#dbeafe', color: '#2563eb' },
      pe: { bg: '#f3e8ff', color: '#7c3aed' },
      rx: { bg: '#fee2e2', color: '#dc2626' },
      consulting: { bg: '#fef3c7', color: '#d97706' },
      accounting: { bg: '#dcfce7', color: '#16a34a' },
      am: { bg: '#e0f2fe', color: '#0284c7' },
      st: { bg: '#fce7f3', color: '#db2777' },
      er: { bg: '#fef9c3', color: '#ca8a04' },
      re: { bg: '#ffedd5', color: '#ea580c' },
      vc: { bg: '#ede9fe', color: '#7c3aed' },
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

    const ARROW_R = <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

    return (
    <div className="app"><Sidebar activePage="mock-interview" />
      <main className="mi-main"><div className="mi-wrap" style={{ maxWidth: 1100 }}>
        <div className="mi-label">Practice</div>
        <div className="mi-title">Mock <em>Interview</em></div>
        <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, maxWidth: 560, marginBottom: 28 }}>Record yourself answering real interview questions. Get AI feedback on accuracy, depth, and clarity with video playback of every attempt.</div>

        <div style={{ display: 'flex', gap: 36, marginBottom: 40 }}>
          <div><div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', letterSpacing: '-0.5px' }}>{totalQs.toLocaleString()}+</div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2 }}>Questions</div></div>
          <div><div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', letterSpacing: '-0.5px' }}>{TRACKS.length}</div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2 }}>Career Tracks</div></div>
          {totalSubmissions > 0 && <div><div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#16a34a', letterSpacing: '-0.5px' }}>{totalAttempted}</div><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2 }}>Practiced</div></div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {TRACKS.map(t => {
            const total = t.cards.length;
            const attemptedSet = new Set(allResponses.filter(r => r.questionId.startsWith(t.id + '::')).map(r => r.questionId));
            const attempted = attemptedSet.size;
            const tc = TRACK_COLORS[t.id] || { bg: 'var(--surface-2)', color: 'var(--text)' };
            const tResps = allResponses.filter(r => r.questionId.startsWith(t.id + '::'));
            const tBest: Grade | null = tResps.length === 0 ? null : tResps.some(r => r.grade === 'Great') ? 'Great' : tResps.some(r => r.grade === 'Good') ? 'Good' : 'Bad';
            return (
              <div key={t.id} onClick={() => openTrack(t)} style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 10,
                padding: '24px 20px 18px', cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: tc.bg, color: tc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <div style={{ width: 18, height: 18 }}>{t.icon}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4, letterSpacing: '-0.1px' }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, flex: 1, marginBottom: 16 }}>{TRACK_DESCS[t.id] || ''}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-3)' }}>{total} QUESTIONS</span>
                    {attempted > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>{attempted} done</span>}
                    {tBest && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: tBest === 'Great' ? '#16a34a' : tBest === 'Good' ? '#3b82f6' : '#dc2626', display: 'flex', alignItems: 'center', gap: 2 }}>
                        {tBest === 'Bad' ? ThumbDown : ThumbUp}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 4 }}>Start {ARROW_R}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div></main>
    </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: QUESTION DETAIL
  // ══════════════════════════════════════════════════════════════

  if (activeQuestion) {
    const questionId = makeQid(activeTrack.id, activeQuestion.q);
    const qResps = allResponses.filter(r => r.questionId === questionId);
    const best = bestForQ(questionId);
    const avg = avgForQ(questionId);

    return (
      <div className="app"><Sidebar activePage="mock-interview" />
        <main className="mi-main"><div className="mi-wrap">
          <button className="mi-back" onClick={backToCats} type="button">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>

          <div className="mi-detail-header">
            <div>
              <div className="mi-detail-label">Question</div>
              <div className="mi-detail-title">{activeQuestion.q}</div>
            </div>
            <div className="mi-detail-stats">
              <div className="mi-detail-stat">
                <div className="mi-detail-stat-val">{qResps.length}</div>
                <div className="mi-detail-stat-label">Submissions</div>
              </div>
              <div className="mi-detail-stat">
                <div className={`mi-detail-stat-val ${best ? gCls(best) : 'neutral'}`}>{best || '--'}</div>
                <div className="mi-detail-stat-label">Best</div>
              </div>
              <div className="mi-detail-stat">
                <div className={`mi-detail-stat-val ${avg ? gCls(avg) : 'neutral'}`}>{avg || '--'}</div>
                <div className="mi-detail-stat-label">Average</div>
              </div>
            </div>
          </div>

          <div className="mi-actions">
            {!isRecording ? (
              <button className="mi-btn-record start" onClick={startRecording} disabled={!cameraReady || grading} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Record a Response
              </button>
            ) : (
              <button className="mi-btn-record stop" onClick={stopRecording} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>
                Stop Recording
              </button>
            )}
            <button className="mi-btn-secondary" onClick={() => setShowAnswer(!showAnswer)} type="button">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {showAnswer ? 'Hide correct answer' : 'View correct answer'}
            </button>
          </div>

          {showAnswer && (
            <div className="mi-answer-box">
              <div className="mi-answer-label">Correct Answer</div>
              <div className="mi-answer-text">{activeQuestion.a}</div>
            </div>
          )}

          <div className="mi-prompt">
            <div className="mi-prompt-label">Prompt:</div>
            <div className="mi-prompt-text">{activeQuestion.q}</div>
          </div>

          <div className="mi-camera-wrap">
            <video ref={videoRef} autoPlay muted playsInline />
            {isRecording && (
              <><div className="mi-recording-dot" /><div className="mi-recording-timer">{fmtTime(recordingTime)}</div></>
            )}
            {!isRecording && cameraReady && (
              <div className="mi-camera-notice">You are not currently being recorded. Click &apos;Record a Response&apos; to get started.</div>
            )}
            {!cameraReady && !isRecording && (
              <div className="mi-camera-notice">Camera access required. Please allow camera permissions.</div>
            )}
          </div>

          {grading && (
            <div className="mi-loading"><div className="mi-spinner" />Analyzing your response...</div>
          )}

          {qResps.length > 0 && (
            <div className="mi-responses">
              <div className="mi-responses-title">Your Response{qResps.length > 1 ? 's' : ''}:</div>
              {qResps.map(r => {
                const vid = sessionVideos[r.id] || null;
                return (
                  <div key={r.id} className="mi-response-card">
                    {vid && <video className="mi-response-video" src={vid} controls playsInline />}

                    <div className="mi-response-body">
                      <div className="mi-response-grade">
                        <div className={`mi-grade-label ${gCls(r.grade)}`}>
                          {r.grade === 'Bad' ? ThumbDown : ThumbUp}
                          {r.grade}
                          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)', marginLeft: 4 }}>Graded Submission</span>
                        </div>
                        <div className="mi-grade-stats">
                          <div className="mi-grade-stat">{ThumbUp}<strong>{r.strengths.length}</strong>Strengths</div>
                          <div className="mi-grade-stat">{ThumbDown}<strong>{r.weaknesses.length}</strong>Weaknesses</div>
                          <div className="mi-grade-stat">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            <strong>{r.wordsPerMin}</strong>Words/min
                          </div>
                          <div className="mi-grade-stat">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <strong>{r.durationSec}s</strong>Tot. Length
                          </div>
                        </div>
                      </div>

                      <div className="mi-response-feedback">
                        <h4>Overall Feedback</h4>
                        <p>{r.overallFeedback}</p>
                      </div>

                      {(r.strengths.length > 0 || r.weaknesses.length > 0) && (
                        <div className="mi-response-cols">
                          {r.strengths.length > 0 && (
                            <div className="mi-response-col"><h4>Strengths</h4><ul>{r.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                          )}
                          {r.weaknesses.length > 0 && (
                            <div className="mi-response-col"><h4>Weaknesses</h4><ul>{r.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul></div>
                          )}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <div className="mi-response-time">
                          Submitted {new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <button onClick={() => deleteResponse(r.id)} type="button" style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--text-3)', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div></main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // RENDER: CATEGORY LIST
  // ══════════════════════════════════════════════════════════════

  return (
    <div className="app"><Sidebar activePage="mock-interview" />
      <main className="mi-main"><div className="mi-wrap">
        <button className="mi-back" onClick={backToTracks} type="button">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>

        <div className="mi-label">{activeTrack.title}</div>
        <div className="mi-title" style={{ fontSize: 32, marginBottom: 24 }}>Practice <em>Questions</em></div>

        <div className="mi-cat-list">
          {categories.map(cat => {
            const isExp = expandedCats.has(cat.name);
            const total = cat.cards.length;
            const attemptedSet = new Set(cat.cards.map(c => makeQid(activeTrack.id, c.q)).filter(id => allResponses.some(r => r.questionId === id)));
            const attempted = attemptedSet.size;
            const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;
            const catResps = allResponses.filter(r => cat.cards.some(c => r.questionId === makeQid(activeTrack.id, c.q)));
            const subs = catResps.length;
            const catBest: Grade | null = subs === 0 ? null : catResps.some(r => r.grade === 'Great') ? 'Great' : catResps.some(r => r.grade === 'Good') ? 'Good' : 'Bad';
            const catAvg: Grade | null = subs === 0 ? null : scoreToGrade(catResps.map(r => r.grade === 'Great' ? 10 : r.grade === 'Good' ? 6 : 2).reduce((a, b) => a + b, 0) / subs);

            return (
              <div key={cat.name} className={`mi-cat-row${isExp ? ' expanded' : ''}`}>
                <div className="mi-cat-header" onClick={() => toggleCat(cat.name)}>
                  <div className="mi-cat-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="mi-cat-info">
                    <div className="mi-cat-name">{cat.name} <span>({attempted}/{total} complete)</span></div>
                    <div className="mi-cat-progress-row">
                      <span className="mi-cat-pct">{pct}%</span>
                      <div className="mi-cat-bar"><div className="mi-cat-bar-fill" style={{ width: `${pct}%` }} /></div>
                    </div>
                  </div>
                  <div className="mi-cat-stats">
                    <div className="mi-cat-stat">
                      <div className={`mi-cat-stat-val${subs > 0 ? '' : ' neutral'}`}>{subs}</div>
                      <div className="mi-cat-stat-label">Submissions</div>
                    </div>
                    <div className="mi-cat-stat">
                      <div className={`mi-cat-stat-val ${catBest ? gCls(catBest) : 'neutral'}`}>
                        {catBest ? <>{catBest === 'Bad' ? ThumbDown : ThumbUp} {catBest}</> : '--'}
                      </div>
                      <div className="mi-cat-stat-label">Best</div>
                    </div>
                    <div className="mi-cat-stat">
                      <div className={`mi-cat-stat-val ${catAvg ? gCls(catAvg) : 'neutral'}`}>
                        {catAvg ? <>{catAvg === 'Bad' ? ThumbDown : ThumbUp} {catAvg}</> : '--'}
                      </div>
                      <div className="mi-cat-stat-label">Average</div>
                    </div>
                  </div>
                  <div className="mi-cat-chevron">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>

                {isExp && (
                  <div className="mi-q-list">
                    {cat.cards.map(card => {
                      const cqid = makeQid(activeTrack.id, card.q);
                      const cBest = bestForQ(cqid);
                      const isDone = cBest !== null;
                      return (
                        <div key={card.q} className="mi-q-row" onClick={() => openQuestion(card)}>
                          <div className={`mi-q-status${isDone ? ' done' : ''}`}>
                            {isDone && <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <div className="mi-q-title">{card.q}</div>
                          <div className="mi-q-pills">
                            <span className="mi-q-pill cat-pill">{card.category}</span>
                            <span className="mi-q-pill diff-pill">{card.difficulty || 'Intermediate'}</span>
                          </div>
                          {cBest && (
                            <div className={`mi-q-score ${gCls(cBest)}`}>
                              {cBest === 'Bad' ? ThumbDown : ThumbUp}
                              {cBest}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div></main>
    </div>
  );
}
