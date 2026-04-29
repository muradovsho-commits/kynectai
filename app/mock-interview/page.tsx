'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import '../flashcards/flashcards.css';
import { IB_FLASHCARDS, Flashcard } from '../flashcards/ib-flashcard-data';
import { PE_FLASHCARDS } from '../flashcards/pe-flashcard-data';
import { CONSULTING_FLASHCARDS } from '../flashcards/consulting-flashcard-data';
import { ACCT_FLASHCARDS } from '../flashcards/acct-flashcard-data';
import { AM_FLASHCARDS } from '../flashcards/am-flashcard-data';
import { ST_FLASHCARDS } from '../flashcards/st-flashcard-data';
import { ER_FLASHCARDS, RE_FLASHCARDS, VC_FLASHCARDS, RX_FLASHCARDS } from '../flashcards/other-flashcard-data';

type Score = { accuracy: number; depth: number; clarity: number; verdict: string; tip: string };
type PerfData = { seen: number; pass: number; partial: number; fail: number; byCat: Record<string, { seen: number; pass: number }> };
type ReviewEntry = { id: string; track: string; trackTitle: string; cardQ: string; cardA: string; category: string; difficulty: string; userAnswer: string; feedback: string; score?: Score; verdict: string; at: number };

type Track = { id: string; title: string; cards: number; icon: React.ReactNode };
const TRACKS: Track[] = [
  {id:'ib',title:'Investment Banking',cards:IB_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
  {id:'pe',title:'Private Equity',cards:PE_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
  {id:'rx',title:'Restructuring',cards:RX_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
  {id:'consulting',title:'Consulting',cards:CONSULTING_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>},
  {id:'accounting',title:'Accounting',cards:ACCT_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>},
  {id:'am',title:'Asset Management',cards:AM_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>},
  {id:'st',title:'Sales & Trading',cards:ST_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  {id:'er',title:'Equity Research',cards:ER_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>},
  {id:'re',title:'Real Estate',cards:RE_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>},
  {id:'vc',title:'Venture Capital',cards:VC_FLASHCARDS.length,icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>},
];
const CARD_MAP: Record<string, Flashcard[]> = {ib:IB_FLASHCARDS,pe:PE_FLASHCARDS,consulting:CONSULTING_FLASHCARDS,accounting:ACCT_FLASHCARDS,am:AM_FLASHCARDS,st:ST_FLASHCARDS,er:ER_FLASHCARDS,re:RE_FLASHCARDS,vc:VC_FLASHCARDS,rx:RX_FLASHCARDS};

export default function MockInterviewPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [filterCat, setFilterCat] = useState('All');
  const [aiHistory, setAiHistory] = useState<{role:string;content:string;score?:Score}[]>([]);
  // Session: persist each card's conversation so navigating back shows history
  const [sessionMap, setSessionMap] = useState<Record<string, {role:string;content:string;score?:Score}[]>>({});
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [perf, setPerf] = useState<PerfData>({seen:0,pass:0,partial:0,fail:0,byCat:{}});
  const [reviewLog, setReviewLog] = useState<ReviewEntry[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string|null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const voiceSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    try { const p = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); setIsPro(p.plan === 'pro'); } catch {}
    const savedReview = localStorage.getItem('offerbell_flash_review_log');
    if (savedReview) try { setReviewLog(JSON.parse(savedReview)); } catch {}
  }, [router]);

  const perfKey = activeTrack ? `offerbell_flash_perf_${activeTrack}` : 'offerbell_flash_perf';

  useEffect(() => {
    if (!activeTrack) return;
    try { const raw = localStorage.getItem(perfKey); if (raw) setPerf(JSON.parse(raw)); else setPerf({seen:0,pass:0,partial:0,fail:0,byCat:{}}); } catch {}
  }, [activeTrack, perfKey]);

  const savePerf = useCallback((p: PerfData) => { setPerf(p); localStorage.setItem(perfKey, JSON.stringify(p)); }, [perfKey]);

  const allCards = useMemo(() => activeTrack ? (CARD_MAP[activeTrack] || []) : [], [activeTrack]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(allCards.map(c => c.category)))], [allCards]);
  const filtered = useMemo(() => {
    let base = filterCat === 'All' ? allCards : allCards.filter(c => c.category === filterCat);
    if (shuffleKey > 0) { const a = [...base]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    return base;
  }, [allCards, filterCat, shuffleKey]);

  const card = filtered[idx] || null;
  useEffect(() => { if (idx >= filtered.length && filtered.length > 0) setIdx(0); }, [idx, filtered.length]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiHistory]);

  // Save current card's history to session before leaving
  const saveCurrentSession = useCallback(() => {
    if (card && aiHistory.length > 0) {
      setSessionMap(prev => ({ ...prev, [card.q]: aiHistory }));
    }
  }, [card, aiHistory]);

  // Load a card's session history
  const loadSession = useCallback((question: string) => {
    const saved = sessionMap[question];
    setAiHistory(saved || []);
    setUserInput('');
    if (isRecording) { try { recognitionRef.current?.stop(); } catch {} }
    setVoiceError(null);
  }, [sessionMap, isRecording]);

  const goNext = useCallback(() => {
    if (idx < filtered.length - 1) {
      saveCurrentSession();
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      const nextCard = filtered[nextIdx];
      if (nextCard) loadSession(nextCard.q);
    }
  }, [idx, filtered, saveCurrentSession, loadSession]);

  const goPrev = useCallback(() => {
    if (idx > 0) {
      saveCurrentSession();
      const prevIdx = idx - 1;
      setIdx(prevIdx);
      const prevCard = filtered[prevIdx];
      if (prevCard) loadSession(prevCard.q);
    }
  }, [idx, filtered, saveCurrentSession, loadSession]);

  const resetSession = useCallback(() => {
    setSessionMap({});
    setAiHistory([]);
    setUserInput('');
    if (isRecording) { try { recognitionRef.current?.stop(); } catch {} }
    setVoiceError(null);
  }, [isRecording]);

  const openTrack = (id: string) => { setActiveTrack(id); setFilterCat('All'); setIdx(0); resetSession(); setShuffleKey(0); };

  // Voice
  const toggleRecording = () => {
    if (isRecording) { try { recognitionRef.current?.stop(); } catch {} setIsRecording(false); return; }
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const r = new SR(); r.continuous = true; r.interimResults = true; r.lang = 'en-US';
      r.onresult = (e: any) => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setUserInput(t); };
      r.onerror = (e: any) => { setVoiceError('Voice error: ' + e.error); setIsRecording(false); };
      r.onend = () => setIsRecording(false);
      recognitionRef.current = r; r.start(); setIsRecording(true); setVoiceError(null);
    } catch { setVoiceError('Voice recognition not supported'); }
  };

  // AI Submit
  const submitAnswer = async () => {
    if (!card || !userInput.trim() || aiLoading) return;
    if (isRecording) { try { recognitionRef.current?.stop(); } catch {} }
    const answer = userInput.trim(); setUserInput('');
    const newHistory = [...aiHistory, { role: 'user', content: answer }];
    setAiHistory(newHistory); setAiLoading(true);
    try {
      const res = await fetch('/api/interview-mock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: card.q, correctAnswer: card.a, userAnswer: answer, history: newHistory, track: activeTrack }) });
      const data = await res.json();
      if (data.error) { setAiHistory([...newHistory, { role: 'assistant', content: 'Something went wrong - try again.' }]); }
      else {
        const entry: { role: string; content: string; score?: Score } = { role: 'assistant', content: data.feedback };
        if (data.score) {
          entry.score = data.score;
          const verdict = data.score.verdict; const cat = card.category;
          const freshRaw = localStorage.getItem(perfKey);
          const np = freshRaw ? JSON.parse(freshRaw) : { seen:0,pass:0,partial:0,fail:0,byCat:{} };
          np.seen++; if (verdict === 'pass') np.pass++; else if (verdict === 'partial') np.partial++; else np.fail++;
          if (!np.byCat[cat]) np.byCat[cat] = { seen: 0, pass: 0 };
          np.byCat[cat].seen++; if (verdict === 'pass') np.byCat[cat].pass++;
          savePerf(np);
          const trackDef = TRACKS.find(t => t.id === activeTrack);
          const re: ReviewEntry = { id: `${Date.now()}_${Math.random().toString(36).slice(2,6)}`, track: activeTrack || '', trackTitle: trackDef?.title || '', cardQ: card.q, cardA: card.a, category: cat, difficulty: card.difficulty || '', userAnswer: answer, feedback: data.feedback, score: data.score, verdict, at: Date.now() };
          const updatedLog = [re, ...reviewLog].slice(0, 100);
          setReviewLog(updatedLog);
          localStorage.setItem('offerbell_flash_review_log', JSON.stringify(updatedLog));
        }
        setAiHistory([...newHistory, entry]);
        // Persist to session map
        if (card) setSessionMap(prev => ({ ...prev, [card.q]: [...newHistory, entry] }));
      }
    } catch { setAiHistory([...newHistory, { role: 'assistant', content: 'Connection error - try again.' }]); }
    setAiLoading(false);
  };

  const readiness = perf.seen > 0 ? Math.round((perf.pass / perf.seen) * 100) : 0;
  const trackTitle = TRACKS.find(t => t.id === activeTrack)?.title || '';

  // ═══ TRACK PICKER ═══
  if (!activeTrack) return (
    <div className="app"><Sidebar activePage="mock-interview" />
      <main className="main" style={{ padding: 0 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 40px 60px' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>OfferBell Pro</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, letterSpacing: '-1px', color: 'var(--text)', lineHeight: 1, marginBottom: 12 }}>Mock <em style={{ fontStyle: 'italic' }}>Interview</em></div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 520 }}>Answer real interview questions. An AI interviewer scores your response, pushes deeper with follow-ups, and tells you exactly where to improve.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {TRACKS.map(t => {
              const tp = (() => { try { const r = localStorage.getItem(`offerbell_flash_perf_${t.id}`); return r ? JSON.parse(r) : null; } catch { return null; } })();
              const tReadiness = tp && tp.seen > 0 ? Math.round((tp.pass / tp.seen) * 100) : 0;
              const attempted = tp?.seen || 0;
              return (
                <div key={t.id} onClick={() => openTrack(t.id)} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '22px 24px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 14 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 20, height: 20 }}>{t.icon}</div>
                    </div>
                    {attempted > 0 && (
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: tReadiness >= 70 ? '#16a34a' : tReadiness >= 40 ? '#d97706' : 'var(--text-3)' }}>{tReadiness}% ready</div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.cards} questions{attempted > 0 ? ` · ${attempted} attempted` : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );

  // ═══ INTERVIEW SESSION ═══
  return (
    <div className="app"><Sidebar activePage="mock-interview" />
      <main className="main" style={{ padding: 0 }}>
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Left — Question + Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Top bar */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => { setActiveTrack(null); resetSession(); }} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', padding: 0 }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{trackTitle}</div>
                <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>Q{idx + 1} / {filtered.length}{Object.keys(sessionMap).length > 0 ? ` · ${Object.keys(sessionMap).length} answered` : ''}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { setShuffleKey(p => p + 1); setIdx(0); resetSession(); }} type="button" style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Shuffle</button>
                {Object.keys(sessionMap).length > 0 && (
                  <button onClick={() => { if (confirm('Reset all answers in this session?')) { resetSession(); } }} type="button" style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #fecaca', background: 'var(--surface)', fontSize: 11, fontWeight: 600, color: '#dc2626', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Reset Session</button>
                )}
                {reviewLog.filter(r => r.track === activeTrack).length > 0 && (
                  <button onClick={() => setShowReview(true)} type="button" style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface)', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer', fontFamily: "'Sora', sans-serif", display: 'flex', alignItems: 'center', gap: 5 }}>
                    Review
                    <span style={{ background: 'var(--text)', color: 'var(--surface)', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8 }}>{reviewLog.filter(r => r.track === activeTrack).length}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question card */}
            {card && (
              <div style={{ padding: '28px 28px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: 'var(--surface-2)', color: 'var(--text-2)' }}>{card.category}</span>
                  {card.difficulty && <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: card.difficulty === 'Advanced' ? '#fef2f2' : '#fef3c7', color: card.difficulty === 'Advanced' ? '#dc2626' : '#d97706' }}>{card.difficulty}</span>}
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: 'var(--text)', lineHeight: 1.3, letterSpacing: '-0.4px' }}>{card.q}</div>
              </div>
            )}

            {/* Chat area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {aiHistory.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Answer as you would in a real interview</div>
                  <div style={{ fontSize: 12 }}>The AI interviewer will evaluate your response and push deeper with follow-ups.</div>
                </div>
              )}
              {aiHistory.map((msg, i) => (
                <div key={i} className={`flash-chat-msg ${msg.role}`}>
                  <div className="flash-chat-label">{msg.role === 'user' ? 'You' : 'Interviewer'}</div>
                  <div className="flash-chat-text">{msg.content}</div>
                  {msg.score && (
                    <div className={`flash-score-card verdict-${msg.score.verdict}`}>
                      <div className="flash-score-header">
                        <span className={`flash-verdict-badge ${msg.score.verdict}`}>
                          {msg.score.verdict === 'pass' ? 'Pass' : msg.score.verdict === 'partial' ? '~ Partial' : 'Fail'}
                        </span>
                      </div>
                      <div className="flash-score-bars">
                        <div className="flash-score-row"><span>Accuracy</span><div className="flash-score-track"><div className="flash-score-fill" style={{width:`${msg.score.accuracy*10}%`}}/></div><span>{msg.score.accuracy}/10</span></div>
                        <div className="flash-score-row"><span>Depth</span><div className="flash-score-track"><div className="flash-score-fill" style={{width:`${msg.score.depth*10}%`}}/></div><span>{msg.score.depth}/10</span></div>
                        <div className="flash-score-row"><span>Clarity</span><div className="flash-score-track"><div className="flash-score-fill" style={{width:`${msg.score.clarity*10}%`}}/></div><span>{msg.score.clarity}/10</span></div>
                      </div>
                      {msg.score.tip && <div className="flash-score-tip">{msg.score.tip}</div>}
                    </div>
                  )}
                </div>
              ))}
              {aiLoading && <div className="flash-chat-msg assistant"><div className="flash-chat-label">Interviewer</div><div className="flash-chat-text flash-typing">Evaluating<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></div></div>}
              <div ref={chatEndRef} />
              {voiceError && <div style={{ fontSize: 11, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', margin: '8px 0' }}>{voiceError}</div>}
              {isRecording && <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', animation: 'flash-rec-pulse 1.1s ease-in-out infinite' }} />Recording... speak your answer</div>}
            </div>

            {/* Input */}
            <div style={{ padding: '12px 24px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <div className="flash-interview-input">
                <textarea ref={inputRef} value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); }}} placeholder={voiceSupported ? 'Tap mic to speak, or type your answer...' : 'Type your answer...'} rows={2} />
                {voiceSupported && (
                  <button onClick={toggleRecording} disabled={aiLoading} type="button" title={isRecording ? 'Stop' : 'Record'} style={{ background: isRecording ? '#dc2626' : 'var(--surface-2)', border: `1.5px solid ${isRecording ? '#dc2626' : 'var(--border)'}`, color: isRecording ? '#fff' : 'var(--text-2)' }}>
                    {isRecording ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}
                  </button>
                )}
                <button onClick={submitAnswer} disabled={!userInput.trim() || aiLoading} type="button"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              </div>
              {/* Nav */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <button onClick={goPrev} disabled={idx === 0} type="button" style={{ background: 'none', border: '1.5px solid var(--border)', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: idx === 0 ? 'default' : 'pointer', color: idx === 0 ? 'var(--border-2)' : 'var(--text-2)', fontFamily: "'Sora', sans-serif" }}>Previous</button>
                <button onClick={() => { goNext(); setTimeout(() => inputRef.current?.focus(), 100); }} disabled={idx >= filtered.length - 1} type="button" style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: idx >= filtered.length - 1 ? 'default' : 'pointer', fontFamily: "'Sora', sans-serif", opacity: idx >= filtered.length - 1 ? 0.5 : 1 }}>Next Question</button>
              </div>
            </div>
          </div>

          {/* Right — Performance Panel */}
          <div style={{ width: 280, borderLeft: '1px solid var(--border)', background: 'var(--surface)', overflowY: 'auto', flexShrink: 0, padding: '24px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 16 }}>{trackTitle} Readiness</div>
            {/* Readiness ring */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, margin: '0 auto', position: 'relative' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3"/>
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={readiness >= 70 ? '#22c55e' : readiness >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${readiness}, 100`} strokeLinecap="round"/>
                </svg>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif', serif", fontSize: 28, letterSpacing: '-0.5px', color: 'var(--text)' }}>{readiness}%</span>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
              {[{n:perf.seen,l:'Attempted',c:'var(--text)'},{n:perf.pass,l:'Passed',c:'#22c55e'},{n:perf.partial,l:'Partial',c:'#f59e0b'},{n:perf.fail,l:'Failed',c:'#ef4444'}].map(s => (
                <div key={s.l} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: s.c, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
            {/* Weak areas */}
            {(() => {
              const weakCats = categories.filter(c => c !== 'All').map(c => {
                const d = perf.byCat[c] || { seen: 0, pass: 0 };
                return { cat: c, rate: d.seen > 0 ? d.pass / d.seen : -1, seen: d.seen };
              }).filter(c => c.seen > 0 && c.rate < 0.6).sort((a, b) => a.rate - b.rate);
              if (weakCats.length === 0) return null;
              return (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#dc2626', marginBottom: 10 }}>Focus Areas</div>
                  {weakCats.slice(0, 4).map(w => (
                    <div key={w.cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{w.cat}</span>
                      <span style={{ color: '#dc2626', fontWeight: 700 }}>{Math.round(w.rate * 100)}%</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </main>

      {/* Review modal — reuse same pattern */}
      {showReview && (
        <div onClick={() => setShowReview(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '86vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: 'var(--text)', letterSpacing: '-0.5px' }}>Review <em style={{ fontStyle: 'italic' }}>History</em></div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Your past answers and interviewer feedback.</div>
              </div>
              <button onClick={() => setShowReview(false)} type="button" style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 26px' }}>
              {reviewLog.filter(r => r.track === activeTrack).map(r => (
                <div key={r.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{r.cardQ.slice(0, 80)}{r.cardQ.length > 80 ? '...' : ''}</span>
                    <span className={`flash-verdict-badge ${r.verdict}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4 }}>{r.verdict === 'pass' ? 'Pass' : r.verdict === 'partial' ? 'Partial' : 'Fail'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}><strong>You:</strong> {r.userAnswer.slice(0, 120)}{r.userAnswer.length > 120 ? '...' : ''}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}><strong>Feedback:</strong> {r.feedback.slice(0, 150)}{r.feedback.length > 150 ? '...' : ''}</div>
                </div>
              ))}
              {reviewLog.filter(r => r.track === activeTrack).length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>No review history for this track yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
