'use client';
import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
type PerfData = { seen: number; pass: number; partial: number; fail: number; byCat: Record<string, { seen: number; pass: number }> };
type Bookmark = { track: string; q: string; savedAt: number };

const BOOKMARKS_KEY = 'offerbell_flash_bookmarks';
const BOOKMARK_CAP = 500;
function loadBookmarks(): Bookmark[] { try { return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'); } catch { return []; } }
function saveBookmarks(b: Bookmark[]) { localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(b.slice(-BOOKMARK_CAP))); }

const BM_ICON = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
const BM_ICON_FILLED = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
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

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <FlashcardsContent />
    </Suspense>
  );
}

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPro, setIsPro] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [shuffleKey, setShuffleKey] = useState(0);
  // Pro features
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [showProModal, setShowProModal] = useState(false);
  const [gridFlipped, setGridFlipped] = useState<Record<number, boolean>>({});
  const [showInsight, setShowInsight] = useState(false);
  // Performance
  const [perf, setPerf] = useState<PerfData>({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    const p = localStorage.getItem('offerbell_plan') || 'free';
    setIsPro(p === 'pro' || p === 'elite');
    import('../lib/plan').then(({ isUserPro }) => { setIsPro(isUserPro()); });
    setBookmarks(loadBookmarks());

    // Handle URL params from cross-feature links (e.g. diagnostic review)
    const paramTrack = searchParams.get('track');
    if (paramTrack && CARD_MAP[paramTrack]) {
      setActiveTrack(paramTrack);
    }
  }, [router, searchParams]);

  // Load perf for active track
  useEffect(() => {
    if (!activeTrack) { setPerf({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} }); return; }
    const key = `offerbell_flash_perf_${activeTrack}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) { setPerf(JSON.parse(saved)); return; }
    } catch {}
    // Migrate old global data on first use for this track
    try {
      const oldGlobal = localStorage.getItem('offerbell_flash_perf');
      if (oldGlobal && !localStorage.getItem('offerbell_flash_perf_migrated')) {
        const oldData = JSON.parse(oldGlobal);
        // Assign old global data to the first track the user opens (best effort)
        localStorage.setItem(key, JSON.stringify(oldData));
        localStorage.setItem('offerbell_flash_perf_migrated', 'true');
        setPerf(oldData);
        return;
      }
    } catch {}
    setPerf({ seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} });
  }, [activeTrack]);

  const perfKey = activeTrack ? `offerbell_flash_perf_${activeTrack}` : 'offerbell_flash_perf';
  const savePerf = useCallback((p: PerfData) => { setPerf(p); localStorage.setItem(perfKey, JSON.stringify(p)); }, [perfKey]);

  // Bookmark helpers
  const bookmarkSet = useMemo(() => new Set(bookmarks.map(b => `${b.track}::${b.q}`)), [bookmarks]);
  const isBookmarked = useCallback((q: string) => activeTrack ? bookmarkSet.has(`${activeTrack}::${q}`) : false, [activeTrack, bookmarkSet]);
  const toggleBookmark = useCallback((c: Flashcard) => {
    if (!activeTrack) return;
    const key = `${activeTrack}::${c.q}`;
    let next: Bookmark[];
    if (bookmarkSet.has(key)) {
      next = bookmarks.filter(b => !(b.track === activeTrack && b.q === c.q));
    } else {
      next = [...bookmarks, { track: activeTrack, q: c.q, savedAt: Date.now() }];
    }
    setBookmarks(next);
    saveBookmarks(next);
  }, [activeTrack, bookmarks, bookmarkSet]);
  const trackBookmarkCount = useMemo(() => {
    const m: Record<string, number> = {};
    for (const b of bookmarks) m[b.track] = (m[b.track] || 0) + 1;
    return m;
  }, [bookmarks]);
  const currentTrackBmCount = activeTrack ? (trackBookmarkCount[activeTrack] || 0) : 0;

  const allCards = useMemo(() => activeTrack ? (CARD_MAP[activeTrack] || []) : [], [activeTrack]);

  // Free users only see 10% of cards per track
  const accessibleCards = useMemo(() => {
    if (isPro) return allCards;
    const limit = Math.max(1, Math.ceil(allCards.length * 0.1));
    return allCards.slice(0, limit);
  }, [allCards, isPro]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(accessibleCards.map(c => c.category)))], [accessibleCards]);
  const filtered = useMemo(() => {
    let base = filterCat === 'All' ? accessibleCards : accessibleCards.filter(c => c.category === filterCat);
    if (filterDiff !== 'All') base = base.filter(c => c.difficulty === filterDiff);
    if (showBookmarksOnly) base = base.filter(c => isBookmarked(c.q));
    if (shuffleKey > 0) { const a = [...base]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessibleCards, filterCat, filterDiff, shuffleKey, showBookmarksOnly, bookmarkSet]);

  const card = filtered[idx] || null;
  useEffect(() => { if (idx >= filtered.length && filtered.length > 0) setIdx(0); }, [idx, filtered.length]);

  const resetCardState = useCallback(() => {
    setShowAnswer(false); setShowInsight(false);
  }, []);
  const goNext = useCallback(() => { if (idx < filtered.length - 1) { setIdx(idx + 1); resetCardState(); } }, [idx, filtered.length, resetCardState]);
  const goPrev = useCallback(() => { if (idx > 0) { setIdx(idx - 1); resetCardState(); } }, [idx, resetCardState]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'l') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'h') goPrev();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowAnswer(p => !p); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev]);

  const openTrack = (id: string) => { setActiveTrack(id); setFilterCat('All'); setFilterDiff('All'); setIdx(0); resetCardState(); setShuffleKey(0); setShowBookmarksOnly(false); };
  const goBack = () => { setActiveTrack(null); setIdx(0); resetCardState(); };

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
                    {trackBookmarkCount[t.id] > 0 && <span className="flash-track-saved">{trackBookmarkCount[t.id]} saved</span>}
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
        <div className="flash-drill-layout">
          <div className="flash-drill">
            <button className="flash-back" onClick={goBack} type="button">{ARROW_L} All Tracks</button>
            <div className="flash-drill-head">
              <div className="flash-drill-title">{trackInfo?.title}</div>
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
              <button
                className={`flash-bookmarks-toggle${showBookmarksOnly ? ' active' : ''}`}
                onClick={() => { setShowBookmarksOnly(p => !p); setIdx(0); resetCardState(); setGridFlipped({}); }}
                disabled={currentTrackBmCount === 0 && !showBookmarksOnly}
                type="button"
                title={currentTrackBmCount === 0 ? 'No bookmarks yet' : `${currentTrackBmCount} bookmarked`}
              >
                {BM_ICON_FILLED}
                {currentTrackBmCount > 0 && <span className="flash-bm-count">{currentTrackBmCount}</span>}
              </button>
            </div>

            {/* Free user teaser - show how many more cards they're missing */}
            {!isPro && activeTrack && allCards.length > accessibleCards.length && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 18px', marginBottom: 16,
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 10, fontSize: 12, color: 'var(--text-3)',
              }}>
                <span>
                  Showing <strong style={{ color: 'var(--text)' }}>{accessibleCards.length}</strong> of <strong style={{ color: 'var(--text)' }}>{allCards.length}</strong> questions in this track.
                  Upgrade to unlock all {allCards.length}.
                </span>
                <a href="/checkout" style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                  background: 'var(--text)', color: 'var(--surface)', textDecoration: 'none',
                  fontFamily: "'Sora', sans-serif", flexShrink: 0, marginLeft: 12,
                }}>Upgrade</a>
              </div>
            )}

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
                      <button className={`flash-bookmark-btn${isBookmarked(card.q) ? ' active' : ''}`} onClick={() => toggleBookmark(card)} type="button" title={isBookmarked(card.q) ? 'Remove bookmark' : 'Bookmark this question'}>
                        {isBookmarked(card.q) ? BM_ICON_FILLED : BM_ICON}
                      </button>
                    </div>
                    <div className="flash-question">{card.q}</div>
                    <div className="flash-firm-row">
                      <span className="flash-firm-tag">
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Reported in an interview
                      </span>
                    </div>

                    {/* ── PRACTICE MODE ── */}
                      <>
                        <button className={`flash-show-btn${showAnswer ? ' shown' : ''}`} onClick={() => {
                          const wasHidden = !showAnswer;
                          setShowAnswer(!showAnswer);
                          if (wasHidden) {
                            // Track as drilled - update both localStorage AND React state
                            try {
                              const raw = localStorage.getItem(perfKey);
                              const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
                              p.seen = (p.seen || 0) + 1;
                              const cat = card.category;
                              if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
                              p.byCat[cat].seen++;
                              localStorage.setItem(perfKey, JSON.stringify(p));
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

                  </div>
                </div>

                {/* Navigation */}
                <div className="flash-nav-row">
                  <button className="flash-nav-btn" onClick={goPrev} disabled={idx === 0} type="button">{ARROW_L} Back</button>
                  <span className="flash-nav-counter">Question {idx + 1} of {filtered.length}</span>
                  <button className="flash-nav-btn" onClick={goNext} disabled={idx >= filtered.length - 1} type="button">Next {ARROW_R}</button>
                </div>
                <div className="flash-keyboard-hint">
                    <span><span className="flash-kbd">←</span> Previous</span>
                    <span><span className="flash-kbd">→</span> Next</span>
                    <span><span className="flash-kbd">⎵</span> Toggle Answer</span>
                  </div>
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
                          const raw = localStorage.getItem(perfKey);
                          const p = raw ? JSON.parse(raw) : { seen: 0, pass: 0, partial: 0, fail: 0, byCat: {} };
                          p.seen = (p.seen || 0) + 1;
                          const cat = c.category;
                          if (!p.byCat[cat]) p.byCat[cat] = { seen: 0, pass: 0 };
                          p.byCat[cat].seen++;
                          localStorage.setItem(perfKey, JSON.stringify(p));
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
                            <button className={`flash-bookmark-btn${isBookmarked(c.q) ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleBookmark(c); }} type="button" title={isBookmarked(c.q) ? 'Remove bookmark' : 'Bookmark'}>
                              {isBookmarked(c.q) ? BM_ICON_FILLED : BM_ICON}
                            </button>
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

        </div>
      </main>
      {showProModal && <ProModal onClose={() => setShowProModal(false)} />}
    </div>
  );
}
