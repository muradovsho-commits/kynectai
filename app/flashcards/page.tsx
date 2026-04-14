'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './flashcards.css';
import { IB_FLASHCARDS, Flashcard } from './ib-flashcard-data';
import { PE_FLASHCARDS } from './pe-flashcard-data';
import { CONSULTING_FLASHCARDS } from './consulting-flashcard-data';
import { ACCT_FLASHCARDS } from './acct-flashcard-data';
import { AM_FLASHCARDS } from './am-flashcard-data';
import { ST_FLASHCARDS } from './st-flashcard-data';
import { ER_FLASHCARDS, RE_FLASHCARDS, VC_FLASHCARDS, RX_FLASHCARDS } from './other-flashcard-data';

type Track = { id: string; title: string; desc: string; cards: number; iconClass: string; icon: React.ReactNode };
type Score = { accuracy: number; depth: number; clarity: number; verdict: string; tip: string };
type PerfData = { seen: number; pass: number; partial: number; fail: number; byCat: Record<string, { seen: number; pass: number }> };
type ReviewEntry = {
  id: string;
  track: string;
  trackTitle: string;
  cardQ: string;
  cardA: string;
  category: string;
  difficulty: string;
  userAnswer: string;
  feedback: string;
  score?: Score;
  verdict: string;
  at: number;
};

const TRACKS: Track[] = [
  {id:'ib',title:'Investment Banking',desc:'Accounting, DCF, M&A, LBO, and behavioral questions reported across bulge brackets, elite boutiques, and middle market banks.',cards:IB_FLASHCARDS.length,iconClass:'icon-ib',icon:<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
  {id:'pe',title:'Private Equity',desc:'LBO mechanics, fund economics, deal process, and operational value creation from mega-funds to middle market sponsors.',cards:PE_FLASHCARDS.length,iconClass:'icon-pe',icon:<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
  {id:'rx',title:'Restructuring',desc:'Chapter 11, priority of claims, fulcrum security, DIP financing, and distressed valuation.',cards:RX_FLASHCARDS.length,iconClass:'icon-rx',icon:<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
  {id:'consulting',title:'Consulting',desc:'Case frameworks, market sizing, profitability, mental math, and MBB behavioral prep.',cards:CONSULTING_FLASHCARDS.length,iconClass:'icon-consulting',icon:<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>},
  {id:'accounting',title:'Accounting & Audit',desc:'Journal entries, audit assertions, financial statements, and Big 4 behavioral prep.',cards:ACCT_FLASHCARDS.length,iconClass:'icon-accounting',icon:<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>},
  {id:'am',title:'Asset Management',desc:'Stock pitches, portfolio construction, macro, valuation, and buy-side behavioral.',cards:AM_FLASHCARDS.length,iconClass:'icon-am',icon:<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>},
  {id:'st',title:'Sales & Trading',desc:'Market structure, fixed income, options Greeks, trade ideas, and macro positioning.',cards:ST_FLASHCARDS.length,iconClass:'icon-st',icon:<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  {id:'er',title:'Equity Research',desc:'Earnings models, consensus, price targets, stock coverage, and sell-side process.',cards:ER_FLASHCARDS.length,iconClass:'icon-er',icon:<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>},
  {id:'re',title:'Real Estate',desc:'NOI, cap rates, waterfalls, REIT metrics, debt sizing, and property analysis.',cards:RE_FLASHCARDS.length,iconClass:'icon-re',icon:<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
  {id:'vc',title:'Venture Capital',desc:'Term sheets, SaaS metrics, cap tables, fund economics, and startup evaluation.',cards:VC_FLASHCARDS.length,iconClass:'icon-vc',icon:<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
];
const CARD_MAP: Record<string, Flashcard[]> = {ib:IB_FLASHCARDS,pe:PE_FLASHCARDS,consulting:CONSULTING_FLASHCARDS,accounting:ACCT_FLASHCARDS,am:AM_FLASHCARDS,st:ST_FLASHCARDS,er:ER_FLASHCARDS,re:RE_FLASHCARDS,vc:VC_FLASHCARDS,rx:RX_FLASHCARDS};

const ARROW_R = <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const ARROW_L = <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>;
const CHEVRON = <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>;

// Micro-learning insight generator (hardcoded tips per category)
const INSIGHTS: Record<string, { why: string; shows: string; top1: string }> = {
  Accounting: { why: "Accounting is the language of business. Every transaction, every model, every deal starts here.", shows: "Interviewers use accounting to test whether you actually understand how businesses work vs just memorizing formulas.", top1: "Top candidates don't just recite the impact - they explain the economic intuition behind why it works that way." },
  Valuation: { why: "Valuation determines whether a deal makes sense. It's the core analytical skill in any finance role.", shows: "You'll be asked to value companies in every round. Interviewers test whether you can think critically about what a business is worth.", top1: "Elite candidates discuss what assumptions matter most and acknowledge uncertainty rather than pretending DCF gives a precise answer." },
  "M&A": { why: "M&A is the bread and butter of investment banking. Understanding deal mechanics is non-negotiable.", shows: "Interviewers test whether you understand how transactions actually work - not just textbook definitions.", top1: "The best candidates connect M&A concepts to real deals they've followed and discuss strategic rationale, not just mechanics." },
  LBO: { why: "LBO mechanics are tested in both IB and PE interviews. It's where valuation meets capital structure.", shows: "Can you think like a financial sponsor? Do you understand how leverage creates (and destroys) value?", top1: "Top candidates can do a paper LBO in their head and discuss which return lever matters most in different scenarios." },
  Modeling: { why: "Models are the primary deliverable analysts produce. Your modeling skills directly impact deal execution.", shows: "Interviewers want to know if you can build something that works - and catch when something doesn't.", top1: "The best analysts build models that are transparent, auditable, and tell a clear story. They sanity-check every output." },
  Behavioral: { why: "Culture fit matters as much as technical skill. You'll spend 80+ hours/week with your team.", shows: "Are you self-aware? Can you handle pressure? Will you be someone people want on their deal team at 2 AM?", top1: "Top candidates give specific, structured stories that reveal character - not rehearsed corporate-speak." },
  Frameworks: { why: "Structured thinking is the core consulting skill. Frameworks give you a starting point for any problem.", shows: "Can you break down ambiguous problems into clear, actionable components without being told how?", top1: "The best candidates customize frameworks to the specific case rather than mechanically applying a template." },
  "Market Sizing": { why: "Market sizing tests your ability to structure problems and make reasonable assumptions under pressure.", shows: "Interviewers care about your process and logic, not whether you get the exact number.", top1: "Top candidates state assumptions explicitly, do clean mental math, and sanity-check their answer at the end." },
  Audit: { why: "Audit develops professional judgment, skepticism, and deep accounting knowledge - the foundation of accounting careers.", shows: "Do you understand why we audit, not just how? Can you connect assertions to procedures?", top1: "The best candidates show professional skepticism while being practical about materiality and risk-based approaches." },
};
function getInsight(category: string) {
  return INSIGHTS[category] || { why: "This concept is fundamental to the role and is tested frequently in interviews.", shows: "Interviewers use this to assess your technical depth and ability to think on your feet.", top1: "Top candidates explain the 'why' behind concepts, not just the 'what.' They connect theory to practice." };
}

// Dropdown
function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  const display = value === 'All' ? label : value;
  return (
    <div className="flash-dropdown" ref={ref}>
      <button className={`flash-dropdown-btn${value !== 'All' ? ' has-value' : ''}`} onClick={() => setOpen(!open)} type="button">{display}{CHEVRON}</button>
      {open && <div className="flash-dropdown-menu">{options.map(o => (
        <button key={o} className={`flash-dropdown-item${value === o ? ' active' : ''}`} onClick={() => { onChange(o); setOpen(false); }} type="button">{o === 'All' ? `All ${label}s` : o}</button>
      ))}</div>}
    </div>
  );
}

// Pro upgrade modal
function ProModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  return (
    <div className="pro-modal-overlay" onClick={onClose}>
      <div className="pro-modal" onClick={e => e.stopPropagation()}>
        <button className="pro-modal-close" onClick={onClose}>×</button>
        <div className="pro-modal-icon"></div>
        <div className="pro-modal-title">Upgrade to Pro</div>
        <div className="pro-modal-desc">Unlock AI Interview Mode, Performance Dashboard, and Micro-Learning Insights to prep like the top 1%.</div>
        <div className="pro-modal-features">
          <div className="pro-modal-feat"><span className="pro-feat-icon"></span><div><strong>AI Interview Mode</strong><br/>Live mock interviews with follow-up questions and real-time scoring</div></div>
          <div className="pro-modal-feat"><span className="pro-feat-icon"></span><div><strong>Performance Dashboard</strong><br/>Track mastery, find weak areas, get interview readiness scores</div></div>
          <div className="pro-modal-feat"><span className="pro-feat-icon"></span><div><strong>Micro-Learning Insights</strong><br/>&ldquo;Why this matters&rdquo; and &ldquo;How to answer like a top 1% candidate&rdquo;</div></div>
        </div>
        <button className="pro-modal-btn" onClick={() => router.push('/my-account')}>View Pro Plans</button>
      </div>
    </div>
  );
}

// Performance sidebar
function PerfPanel({ perf, categories }: { perf: PerfData; categories: string[] }) {
  const readiness = perf.seen > 0 ? Math.round((perf.pass / perf.seen) * 100) : 0;
  const weakCats = categories.filter(c => c !== 'All').map(c => {
    const d = perf.byCat[c] || { seen: 0, pass: 0 };
    return { cat: c, rate: d.seen > 0 ? d.pass / d.seen : -1, seen: d.seen };
  }).filter(c => c.seen > 0 && c.rate < 0.6).sort((a, b) => a.rate - b.rate);

  return (
    <div className="perf-panel">
      <div className="perf-panel-title">Performance</div>
      <div className="perf-readiness">
        <div className="perf-readiness-ring">
          <svg viewBox="0 0 36 36">
            <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3"/>
            <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={readiness >= 70 ? '#22c55e' : readiness >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${readiness}, 100`} strokeLinecap="round"/>
          </svg>
          <span className="perf-readiness-num">{readiness}%</span>
        </div>
        <div className="perf-readiness-label">Interview Readiness</div>
      </div>
      <div className="perf-stats-grid">
        <div className="perf-stat"><span className="perf-stat-n">{perf.seen}</span><span className="perf-stat-l">Attempted</span></div>
        <div className="perf-stat"><span className="perf-stat-n" style={{color:'#22c55e'}}>{perf.pass}</span><span className="perf-stat-l">Passed</span></div>
        <div className="perf-stat"><span className="perf-stat-n" style={{color:'#f59e0b'}}>{perf.partial}</span><span className="perf-stat-l">Partial</span></div>
        <div className="perf-stat"><span className="perf-stat-n" style={{color:'#ef4444'}}>{perf.fail}</span><span className="perf-stat-l">Failed</span></div>
      </div>
      {weakCats.length > 0 && (
        <div className="perf-weak">
          <div className="perf-weak-title">Focus Areas</div>
          {weakCats.slice(0, 3).map(w => (
            <div key={w.cat} className="perf-weak-row">
              <span>{w.cat}</span>
              <span className="perf-weak-pct">{Math.round(w.rate * 100)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [shuffleKey, setShuffleKey] = useState(0);
  // Pro features
  const [mode, setMode] = useState<'practice' | 'interview'>('practice');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [showProModal, setShowProModal] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ role: string; content: string; score?: Score }[]>([]);
  const [gridFlipped, setGridFlipped] = useState<Record<number, boolean>>({});
  const [showInsight, setShowInsight] = useState(false);
  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const baseInputRef = useRef<string>(''); // text before current recording session
  // Performance
  const [perf, setPerf] = useState<PerfData>({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} });
  // Review log (per-attempt history)
  const [reviewLog, setReviewLog] = useState<ReviewEntry[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pass' | 'partial' | 'fail'>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Detect Web Speech API support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  // Cleanup recognition on unmount or mode switch
  useEffect(() => {
    return () => { try { recognitionRef.current?.stop(); } catch {} };
  }, []);

  const toggleRecording = () => {
    setVoiceError(null);
    if (isRecording) {
      try { recognitionRef.current?.stop(); } catch {}
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setVoiceError('Your browser does not support voice recording. Try Chrome or Edge.'); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    baseInputRef.current = userInput ? userInput.trimEnd() + ' ' : '';
    rec.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t + ' ';
        else interim += t;
      }
      if (final) baseInputRef.current += final;
      setUserInput(baseInputRef.current + interim);
    };
    rec.onerror = (event: any) => {
      const err = event.error || 'unknown';
      if (err === 'not-allowed' || err === 'service-not-allowed') setVoiceError('Microphone access denied. Enable it in your browser settings.');
      else if (err === 'no-speech') setVoiceError('No speech detected. Try again and speak clearly.');
      else if (err === 'aborted') { /* silent - user-initiated stop */ }
      else setVoiceError(`Voice error: ${err}`);
      setIsRecording(false);
    };
    rec.onend = () => { setIsRecording(false); };
    try {
      rec.start();
      recognitionRef.current = rec;
      setIsRecording(true);
    } catch (e: any) {
      setVoiceError('Could not start recording. Please try again.');
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    setIsPro(localStorage.getItem('offerbell_plan') === 'pro');
    import('../lib/plan').then(({ isUserPro }) => { setIsPro(isUserPro()); });
    const saved = localStorage.getItem('offerbell_flash_perf');
    if (saved) try { setPerf(JSON.parse(saved)); } catch { /* */ }
    const savedReview = localStorage.getItem('offerbell_flash_review');
    if (savedReview) try { setReviewLog(JSON.parse(savedReview)); } catch { /* */ }
  }, [router]);

  const savePerf = useCallback((p: PerfData) => { setPerf(p); localStorage.setItem('offerbell_flash_perf', JSON.stringify(p)); }, []);

  const allCards = useMemo(() => activeTrack ? (CARD_MAP[activeTrack] || []) : [], [activeTrack]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(allCards.map(c => c.category)))], [allCards]);
  const filtered = useMemo(() => {
    let base = filterCat === 'All' ? allCards : allCards.filter(c => c.category === filterCat);
    if (filterDiff !== 'All') base = base.filter(c => c.difficulty === filterDiff);
    if (shuffleKey > 0) { const a = [...base]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCards, filterCat, filterDiff, shuffleKey]);

  const card = filtered[idx] || null;

  const resetCardState = useCallback(() => {
    setShowAnswer(false); setAiHistory([]); setUserInput(''); setShowInsight(false);
    if (isRecording) { try { recognitionRef.current?.stop(); } catch {} }
    setVoiceError(null);
  }, [isRecording]);
  const goNext = useCallback(() => { if (idx < filtered.length - 1) { setIdx(idx + 1); resetCardState(); } }, [idx, filtered.length, resetCardState]);
  const goPrev = useCallback(() => { if (idx > 0) { setIdx(idx - 1); resetCardState(); } }, [idx, resetCardState]);

  useEffect(() => {
    if (mode === 'interview') return; // disable keyboard in interview mode (textarea needs keys)
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'l') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'h') goPrev();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowAnswer(p => !p); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev, mode]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiHistory]);

  const openTrack = (id: string) => { setActiveTrack(id); setFilterCat('All'); setFilterDiff('All'); setIdx(0); resetCardState(); setShuffleKey(0); };
  const goBack = () => { setActiveTrack(null); setIdx(0); resetCardState(); setMode('practice'); };
  const handleModeSwitch = (m: 'practice' | 'interview') => {
    if (m === 'interview' && !isPro) { setShowProModal(true); return; }
    setMode(m); resetCardState();
  };

  // AI Interview submit
  const submitAnswer = async () => {
    if (!card || !userInput.trim() || aiLoading) return;
    if (isRecording) { try { recognitionRef.current?.stop(); } catch {} }
    const answer = userInput.trim();
    setUserInput('');
    const newHistory = [...aiHistory, { role: 'user', content: answer }];
    setAiHistory(newHistory);
    setAiLoading(true);
    try {
      const res = await fetch('/api/interview-mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: card.q, correctAnswer: card.a, userAnswer: answer,
          history: newHistory, track: activeTrack,
        }),
      });
      const data = await res.json();
      if (data.error) { setAiHistory([...newHistory, { role: 'assistant', content: 'Something went wrong - try again.' }]); }
      else {
        const entry: { role: string; content: string; score?: Score } = { role: 'assistant', content: data.feedback };
        if (data.score) {
          entry.score = data.score;
          // Update performance - read fresh from localStorage to avoid overwriting practice mode data
          const verdict = data.score.verdict;
          const cat = card.category;
          const freshRaw = localStorage.getItem('offerbell_flash_perf');
          const np = freshRaw ? JSON.parse(freshRaw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
          np.seen = (np.seen || 0) + 1;
          if (verdict === 'pass') np.pass = (np.pass || 0) + 1;
          else if (verdict === 'partial') np.partial = (np.partial || 0) + 1;
          else np.fail = (np.fail || 0) + 1;
          if (!np.byCat[cat]) np.byCat[cat] = { seen: 0, pass: 0 };
          np.byCat[cat].seen++;
          if (verdict === 'pass') np.byCat[cat].pass++;
          savePerf(np);
          // Append to review log
          const reviewEntry: ReviewEntry = {
            id: `rv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            track: activeTrack || '',
            trackTitle: TRACKS.find(t => t.id === activeTrack)?.title || '',
            cardQ: card.q,
            cardA: card.a,
            category: cat,
            difficulty: (card as any).difficulty || '',
            userAnswer: answer,
            feedback: data.feedback,
            score: data.score,
            verdict,
            at: Date.now(),
          };
          const freshReviewRaw = localStorage.getItem('offerbell_flash_review');
          const freshReview: ReviewEntry[] = freshReviewRaw ? JSON.parse(freshReviewRaw) : [];
          // Prepend newest first, cap at 200 entries
          const nextLog = [reviewEntry, ...freshReview].slice(0, 200);
          setReviewLog(nextLog);
          localStorage.setItem('offerbell_flash_review', JSON.stringify(nextLog));
        }
        setAiHistory([...newHistory, entry]);
      }
    } catch { setAiHistory([...newHistory, { role: 'assistant', content: 'Network error - please try again.' }]); }
    setAiLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const trackInfo = TRACKS.find(t => t.id === activeTrack);
  const insight = card ? getInsight(card.category) : null;

  // ═══ LANDING ═══
  if (!activeTrack) {
    const total = TRACKS.reduce((s, t) => s + t.cards, 0);
    return (
      <div className="app">
        <Sidebar activePage="flashcards" />
        <main className="flash-main">
          <div className="flash-landing">
            <div className="flash-landing-badge">Interview Flashcards</div>
            <div className="flash-landing-title">Interview <em>Flashcards</em></div>
            <div className="flash-landing-sub">Master every technical concept with curated interview questions reported in actual interviews across top firms. Filter by topic and difficulty, then drill one card at a time.</div>
            {(() => {
              let diagScore = 0;
              try { const h = JSON.parse(localStorage.getItem('offerbell_diag_history') || '[]'); if (h.length > 0) diagScore = Math.max(...h.map((d: any) => d.score || 0)); } catch {}
              if (diagScore >= 70) return (
                <div style={{fontSize:12,color:'#16a34a',fontWeight:600,marginBottom:6,marginTop:-4}}>Your diagnostic scores are strong - go through every question below to lock it in.</div>
              );
              if (diagScore > 0) return (
                <div style={{fontSize:12,color:'var(--text-3)',marginBottom:6,marginTop:-4}}>You're at {diagScore}% on diagnostics. We recommend hitting 70%+ on <a href="/diagnostic-review" style={{color:'var(--text)',fontWeight:600,textDecoration:'underline'}}>Diagnostic Review</a> before deep-diving here.</div>
              );
              return (
                <div style={{fontSize:12,color:'var(--text-3)',marginBottom:6,marginTop:-4}}>Tip: Start with <a href="/learn" style={{color:'var(--text)',fontWeight:600,textDecoration:'underline'}}>Prep Guides</a> and <a href="/concept-drills" style={{color:'var(--text)',fontWeight:600,textDecoration:'underline'}}>Concept Drills</a> first, then come back here.</div>
              );
            })()}
            <div className="flash-landing-stats">
              <div><div className="flash-stat-num">{total.toLocaleString()}+</div><div className="flash-stat-label">Questions</div></div>
              <div><div className="flash-stat-num">{TRACKS.length}</div><div className="flash-stat-label">Career Tracks</div></div>
              <div><div className="flash-stat-num">40+</div><div className="flash-stat-label">Firms Covered</div></div>
            </div>
            <div className="flash-track-grid">
              {TRACKS.map(t => (
                <div key={t.id} className={`flash-track-card${t.cards === 0 ? ' coming-soon' : ''}`} onClick={() => t.cards > 0 && openTrack(t.id)}>
                  <div className={`flash-track-icon ${t.iconClass}`}>{t.icon}</div>
                  <div className="flash-track-name">{t.title}</div>
                  <div className="flash-track-desc">{t.desc}</div>
                  <div className="flash-track-footer">
                    <span className={`flash-track-count${t.cards === 0 ? ' soon' : ''}`}>{t.cards > 0 ? `${t.cards} QUESTIONS` : 'COMING SOON'}</span>
                    {t.cards > 0 && <span className="flash-track-cta">Start {ARROW_R}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
      </div>
    );
  }

  // ═══ DRILL VIEW ═══
  return (
    <div className="app">
      <Sidebar activePage="flashcards" />
      <main className="flash-main">
        <div className={`flash-drill-layout${mode === 'interview' && isPro ? ' with-perf' : ''}`}>
          <div className="flash-drill">
            <button className="flash-back" onClick={goBack} type="button">{ARROW_L} All Tracks</button>
            <div className="flash-drill-head">
              <div className="flash-drill-title">{trackInfo?.title}</div>
              {/* Mode toggle */}
              <div className="flash-mode-toggle">
                <button className={`flash-mode-btn${mode === 'practice' ? ' active' : ''}`} onClick={() => handleModeSwitch('practice')} type="button">
                  <svg viewBox="0 0 24 24" width="14" height="14"><rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 21h8M12 17v4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                  Practice
                </button>
                <button className={`flash-mode-btn${mode === 'interview' ? ' active' : ''}${!isPro ? ' locked' : ''}`} onClick={() => handleModeSwitch('interview')} type="button">
                  <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                  Interview Mode
                  {!isPro && <span className="flash-pro-badge">PRO</span>}
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flash-filter-bar">
              <Dropdown label="Topic" value={filterCat} options={categories} onChange={v => { setFilterCat(v); setIdx(0); resetCardState(); setGridFlipped({}); }} />
              <Dropdown label="Difficulty" value={filterDiff} options={['All','Intermediate','Advanced']} onChange={v => { setFilterDiff(v); setIdx(0); resetCardState(); setGridFlipped({}); }} />
              <div className="flash-filter-spacer" />
              {/* View toggle */}
              <div className="flash-view-toggle">
                <button className={`flash-view-btn${viewMode === 'single' ? ' active' : ''}`} onClick={() => setViewMode('single')} type="button" title="Single card view">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </button>
                <button className={`flash-view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} type="button" title="Grid view">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                </button>
              </div>
              <button className="flash-shuffle" onClick={() => { setShuffleKey(p => p + 1); setIdx(0); resetCardState(); setGridFlipped({}); }} type="button">
                <svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
                Shuffle
              </button>
              {mode === 'interview' && isPro && (
                <button
                  className="flash-shuffle"
                  onClick={() => setShowReview(true)}
                  type="button"
                  title="Review your past answers"
                  style={{ position: 'relative' }}
                >
                  <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/></svg>
                  Review
                  {reviewLog.filter(r => !activeTrack || r.track === activeTrack).length > 0 && (
                    <span style={{ marginLeft: 6, background: 'var(--text)', color: 'var(--surface)', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' }}>
                      {reviewLog.filter(r => !activeTrack || r.track === activeTrack).length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* ═══ SINGLE CARD VIEW ═══ */}
            {viewMode === 'single' && (
            <>
            {card ? (
              <>
                <div className="flash-card-container">
                  <div className="flash-card-single">
                    <div className="flash-card-tags">
                      <span className="flash-tag flash-tag-cat">{card.category}</span>
                      {card.difficulty && <span className={`flash-tag flash-tag-diff-${card.difficulty.toLowerCase()}`}>{card.difficulty}</span>}
                    </div>
                    <div className="flash-question">{card.q}</div>
                    <div className="flash-firm-row">
                      <span className="flash-firm-tag">
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Reported in an interview
                      </span>
                    </div>

                    {/* ── PRACTICE MODE ── */}
                    {mode === 'practice' && (
                      <>
                        <button className={`flash-show-btn${showAnswer ? ' shown' : ''}`} onClick={() => {
                          const wasHidden = !showAnswer;
                          setShowAnswer(!showAnswer);
                          if (wasHidden) {
                            // Track as drilled - update both localStorage AND React state
                            try {
                              const raw = localStorage.getItem('offerbell_flash_perf');
                              const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
                              p.seen = (p.seen || 0) + 1;
                              const cat = card.category;
                              if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
                              p.byCat[cat].seen++;
                              localStorage.setItem('offerbell_flash_perf', JSON.stringify(p));
                              setPerf(p);
                            } catch {}
                          }
                        }} type="button">
                          {showAnswer ? 'Hide Answer' : 'Show Answer'}
                        </button>
                        {showAnswer && <div className="flash-answer">{card.a}</div>}
                        {showAnswer && isPro && insight && (
                          <>
                            {!showInsight ? (
                              <button className="flash-insight-toggle" onClick={() => setShowInsight(true)} type="button">
                                <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
                                Show Interview Insight
                              </button>
                            ) : (
                              <div className="flash-insight-panel">
                                <div className="flash-insight-header">
                                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                                  Interview Insight
                                </div>
                                <div className="flash-insight-item"><span className="flash-insight-label">Why this matters</span><p>{insight.why}</p></div>
                                <div className="flash-insight-item"><span className="flash-insight-label">How it shows up in interviews</span><p>{insight.shows}</p></div>
                                <div className="flash-insight-item"><span className="flash-insight-label">How top 1% candidates answer</span><p>{insight.top1}</p></div>
                              </div>
                            )}
                          </>
                        )}
                        {showAnswer && !isPro && (
                          <button className="flash-insight-toggle locked" onClick={() => setShowProModal(true)} type="button">
                            <svg viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                            Unlock Interview Insights <span className="flash-pro-badge">PRO</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* ── INTERVIEW MODE ── */}
                    {mode === 'interview' && isPro && (
                      <div className="flash-interview-area">
                        {aiHistory.length === 0 && (
                          <div className="flash-interview-prompt">Answer as you would in a real interview. The AI interviewer will evaluate your response and push deeper.</div>
                        )}
                        {aiHistory.map((msg, i) => (
                          <div key={i} className={`flash-chat-msg ${msg.role}`}>
                            <div className="flash-chat-label">{msg.role === 'user' ? 'You' : ' Interviewer'}</div>
                            <div className="flash-chat-text">{msg.content}</div>
                            {msg.score && (
                              <div className={`flash-score-card verdict-${msg.score.verdict}`}>
                                <div className="flash-score-header">
                                  <span className={`flash-verdict-badge ${msg.score.verdict}`}>
                                    {msg.score.verdict === 'pass' ? ' Pass' : msg.score.verdict === 'partial' ? '~ Partial' : ' Fail'}
                                  </span>
                                </div>
                                <div className="flash-score-bars">
                                  <div className="flash-score-row"><span>Accuracy</span><div className="flash-score-track"><div className="flash-score-fill" style={{ width: `${msg.score.accuracy * 10}%` }} /></div><span>{msg.score.accuracy}/10</span></div>
                                  <div className="flash-score-row"><span>Depth</span><div className="flash-score-track"><div className="flash-score-fill" style={{ width: `${msg.score.depth * 10}%` }} /></div><span>{msg.score.depth}/10</span></div>
                                  <div className="flash-score-row"><span>Clarity</span><div className="flash-score-track"><div className="flash-score-fill" style={{ width: `${msg.score.clarity * 10}%` }} /></div><span>{msg.score.clarity}/10</span></div>
                                </div>
                                {msg.score.tip && <div className="flash-score-tip"> {msg.score.tip}</div>}
                              </div>
                            )}
                          </div>
                        ))}
                        {aiLoading && <div className="flash-chat-msg assistant"><div className="flash-chat-label"> Interviewer</div><div className="flash-chat-text flash-typing">Evaluating<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></div></div>}
                        <div ref={chatEndRef} />
                        {voiceError && (
                          <div style={{ fontSize: 11, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {voiceError}
                          </div>
                        )}
                        {isRecording && (
                          <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', animation: 'flash-rec-pulse 1.1s ease-in-out infinite' }} />
                            Recording... speak your answer, then tap the mic again to stop
                          </div>
                        )}
                        <div className="flash-interview-input">
                          <textarea
                            ref={inputRef}
                            value={userInput}
                            onChange={e => setUserInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAnswer(); }}}
                            placeholder={voiceSupported ? 'Tap the mic to speak your answer, or type it here...' : 'Type your answer as you would in a real interview...'}
                            rows={3}
                          />
                          {voiceSupported && (
                            <button
                              onClick={toggleRecording}
                              disabled={aiLoading}
                              type="button"
                              title={isRecording ? 'Stop recording' : 'Record your answer'}
                              style={{
                                background: isRecording ? '#dc2626' : 'var(--surface-2)',
                                border: `1.5px solid ${isRecording ? '#dc2626' : 'var(--border)'}`,
                                color: isRecording ? '#fff' : 'var(--text-2)',
                                transition: 'all 0.15s',
                              }}
                            >
                              {isRecording ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                              ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                              )}
                            </button>
                          )}
                          <button onClick={submitAnswer} disabled={!userInput.trim() || aiLoading} type="button">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>
                        <style jsx>{`
                          @keyframes flash-rec-pulse {
                            0%, 100% { opacity: 1; transform: scale(1); }
                            50% { opacity: 0.4; transform: scale(1.3); }
                          }
                        `}</style>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flash-nav-row">
                  <button className="flash-nav-btn" onClick={goPrev} disabled={idx === 0} type="button">{ARROW_L} Back</button>
                  <span className="flash-nav-counter">Question {idx + 1} of {filtered.length}</span>
                  <button className="flash-nav-btn" onClick={goNext} disabled={idx >= filtered.length - 1} type="button">Next {ARROW_R}</button>
                </div>
                {mode === 'practice' && (
                  <div className="flash-keyboard-hint">
                    <span><span className="flash-kbd">←</span> Previous</span>
                    <span><span className="flash-kbd">→</span> Next</span>
                    <span><span className="flash-kbd">⎵</span> Toggle Answer</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flash-card-container"><div className="flash-card-single" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 180 }}><div style={{ color: 'var(--text-3)', fontSize: 14 }}>No questions match the current filters.</div></div></div>
            )}
            </>
            )}

            {/* ═══ GRID VIEW ═══ */}
            {viewMode === 'grid' && (
              <>
                <div className="flash-grid-counter">{filtered.length} questions</div>
                <div className="flash-grid">
                  {filtered.map((c, i) => (
                    <div key={`${shuffleKey}-${i}`} className="flash-grid-card-wrap" onClick={() => {
                      const wasFlipped = gridFlipped[i];
                      setGridFlipped(p => ({ ...p, [i]: !p[i] }));
                      if (!wasFlipped) {
                        try {
                          const raw = localStorage.getItem('offerbell_flash_perf');
                          const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
                          p.seen = (p.seen || 0) + 1;
                          const cat = c.category;
                          if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
                          p.byCat[cat].seen++;
                          localStorage.setItem('offerbell_flash_perf', JSON.stringify(p));
                          setPerf(p);
                        } catch {}
                      }
                    }}>
                      <div className={`flash-grid-card${gridFlipped[i] ? ' flipped' : ''}`}>
                        {/* Front */}
                        <div className="flash-grid-front">
                          <div className="flash-card-tags" style={{marginBottom:10}}>
                            <span className="flash-tag flash-tag-cat">{c.category}</span>
                            {c.difficulty && <span className={`flash-tag flash-tag-diff-${c.difficulty.toLowerCase()}`}>{c.difficulty}</span>}
                          </div>
                          <div className="flash-grid-q">{c.q}</div>
                          <div className="flash-grid-bottom">
                            <span className="flash-grid-firm">Reported in an interview</span>
                            <span className="flash-grid-hint">Click to reveal →</span>
                          </div>
                        </div>
                        {/* Back */}
                        <div className="flash-grid-back">
                          <div className="flash-grid-back-label">ANSWER</div>
                          <div className="flash-grid-a">{c.a}</div>
                          <div className="flash-grid-hint" style={{color:'#7c3aed'}}>Click to flip back</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="flash-card-container"><div className="flash-card-single" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 180 }}><div style={{ color: 'var(--text-3)', fontSize: 14 }}>No questions match the current filters.</div></div></div>
                )}
              </>
            )}
          </div>

          {/* Performance panel (Pro, interview mode) */}
          {mode === 'interview' && isPro && (
            <PerfPanel perf={perf} categories={categories} />
          )}
        </div>
      </main>
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
      {showReview && (
        <div onClick={() => setShowReview(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '86vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}>
            {/* Header */}
            <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: 'var(--text)', letterSpacing: '-0.5px' }}>Review <em style={{ fontStyle: 'italic' }}>History</em></div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Go back to any question you&apos;ve answered. See what the interviewer said and retry if you want another shot.</div>
              </div>
              <button onClick={() => setShowReview(false)} type="button" style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid var(--border)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Filter chips */}
            {(() => {
              const tlog = reviewLog.filter(r => !activeTrack || r.track === activeTrack);
              const cpass = tlog.filter(r => r.verdict === 'pass').length;
              const cpart = tlog.filter(r => r.verdict === 'partial').length;
              const cfail = tlog.filter(r => r.verdict === 'fail').length;
              const visible = reviewFilter === 'all' ? tlog : tlog.filter(r => r.verdict === reviewFilter);
              const chip = (key: typeof reviewFilter, label: string, count: number, color: string) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setReviewFilter(key)}
                  style={{
                    padding: '7px 14px', borderRadius: 999, border: `1.5px solid ${reviewFilter === key ? color : 'var(--border)'}`,
                    background: reviewFilter === key ? color : 'var(--surface-2)', color: reviewFilter === key ? '#fff' : 'var(--text-2)',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.15s'
                  }}
                >
                  {label}
                  <span style={{ background: reviewFilter === key ? 'rgba(255,255,255,0.25)' : 'var(--surface)', color: reviewFilter === key ? '#fff' : 'var(--text-3)', padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 800 }}>{count}</span>
                </button>
              );
              return (
                <>
                  <div style={{ padding: '14px 26px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
                    {chip('all', 'All', tlog.length, '#111827')}
                    {chip('pass', 'Passed', cpass, '#16a34a')}
                    {chip('partial', 'Partial', cpart, '#d97706')}
                    {chip('fail', 'Missed', cfail, '#dc2626')}
                    <div style={{ flex: 1 }} />
                    {tlog.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm('Clear your review history? This cannot be undone.')) return;
                          const others = reviewLog.filter(r => activeTrack && r.track !== activeTrack);
                          setReviewLog(others);
                          localStorage.setItem('offerbell_flash_review', JSON.stringify(others));
                        }}
                        style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Clear history
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 20px' }}>
                    {visible.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-3)', fontSize: 13 }}>
                        {tlog.length === 0 ? 'No answers recorded yet. Answer a question in Interview Mode to start building your review history.' : 'No questions match this filter.'}
                      </div>
                    )}
                    {visible.map((r) => {
                      const vColor = r.verdict === 'pass' ? '#16a34a' : r.verdict === 'partial' ? '#d97706' : '#dc2626';
                      const vLabel = r.verdict === 'pass' ? 'Passed' : r.verdict === 'partial' ? 'Partial' : 'Missed';
                      const when = new Date(r.at);
                      const ago = (() => {
                        const s = (Date.now() - r.at) / 1000;
                        if (s < 60) return 'just now';
                        if (s < 3600) return `${Math.floor(s/60)}m ago`;
                        if (s < 86400) return `${Math.floor(s/3600)}h ago`;
                        return `${when.toLocaleDateString()}`;
                      })();
                      return (
                        <div key={r.id} style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', background: vColor, padding: '3px 8px', borderRadius: 6, letterSpacing: 0.3, textTransform: 'uppercase' }}>{vLabel}</span>
                            {r.score && (
                              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>
                                {r.score.accuracy}/10 accuracy · {r.score.depth}/10 depth · {r.score.clarity}/10 clarity
                              </span>
                            )}
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>· {r.category || '-'}</span>
                            <div style={{ flex: 1 }} />
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{ago}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.45 }}>{r.cardQ}</div>
                          <details style={{ marginBottom: 8 }}>
                            <summary style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', cursor: 'pointer', padding: '4px 0' }}>Your answer</summary>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, padding: '6px 10px', background: 'var(--surface)', borderRadius: 8, marginTop: 4, whiteSpace: 'pre-wrap' }}>{r.userAnswer}</div>
                          </details>
                          <details>
                            <summary style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', cursor: 'pointer', padding: '4px 0' }}>Interviewer feedback{r.score?.tip ? ' + tip' : ''}</summary>
                            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, padding: '6px 10px', background: 'var(--surface)', borderRadius: 8, marginTop: 4, whiteSpace: 'pre-wrap' }}>
                              {r.feedback}
                              {r.score?.tip && (<><br/><br/><strong style={{ color: 'var(--text)' }}>Tip:</strong> {r.score.tip}</>)}
                            </div>
                          </details>
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button
                              type="button"
                              onClick={() => {
                                // Jump to that card: switch track if needed, reset filters, find index
                                if (r.track && r.track !== activeTrack) {
                                  setActiveTrack(r.track);
                                }
                                setFilterCat('All'); setFilterDiff('All'); setShuffleKey(0);
                                setShowReview(false);
                                // Defer index set until filtered recalculates
                                setTimeout(() => {
                                  const list = CARD_MAP[r.track] || [];
                                  const foundIdx = list.findIndex((c: any) => c.q === r.cardQ);
                                  if (foundIdx >= 0) { setIdx(foundIdx); resetCardState(); }
                                }, 50);
                              }}
                              style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, border: 'none', background: 'var(--text)', color: 'var(--surface)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 10 9 10"/></svg>
                              Retry this question
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
