'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './flashcards.css';
import { IB_FLASHCARDS } from './ib-flashcard-data';
import { PE_FLASHCARDS } from './pe-flashcard-data';
import { CONSULTING_FLASHCARDS } from './consulting-flashcard-data';
import { QUANT_FLASHCARDS } from './quant-flashcard-data';
import { ACCT_FLASHCARDS } from './acct-flashcard-data';
import { AM_FLASHCARDS } from './am-flashcard-data';
import { ST_FLASHCARDS } from './st-flashcard-data';
import { ER_FLASHCARDS, RE_FLASHCARDS, VC_FLASHCARDS, RX_FLASHCARDS } from './other-flashcard-data';

type Track = { id: string; title: string; desc: string; cards: number; iconClass: string; icon: React.ReactNode };

const TRACKS: Track[] = [
  { id:'ib',title:'Investment Banking',desc:'Accounting, DCF, M&A, LBO, and behavioral questions reported across bulge brackets, elite boutiques, and middle market banks.',cards:IB_FLASHCARDS.length,iconClass:'icon-ib',icon:<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>},
  { id:'pe',title:'Private Equity',desc:'LBO mechanics, fund economics, deal process, and operational value creation from mega-funds to middle market sponsors.',cards:PE_FLASHCARDS.length,iconClass:'icon-pe',icon:<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
  { id:'consulting',title:'Consulting',desc:'Case frameworks, market sizing, profitability, mental math, and MBB behavioral prep.',cards:CONSULTING_FLASHCARDS.length,iconClass:'icon-consulting',icon:<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>},
  { id:'quant',title:'Quant Research',desc:'Probability, statistics, derivatives pricing, brainteasers, and coding from top quant trading firms.',cards:QUANT_FLASHCARDS.length,iconClass:'icon-quant',icon:<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  { id:'accounting',title:'Accounting & Audit',desc:'Journal entries, audit assertions, financial statements, and Big 4 behavioral prep.',cards:ACCT_FLASHCARDS.length,iconClass:'icon-accounting',icon:<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>},
  { id:'am',title:'Asset Management',desc:'Stock pitches, portfolio construction, macro, valuation, and buy-side behavioral.',cards:AM_FLASHCARDS.length,iconClass:'icon-am',icon:<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>},
  { id:'st',title:'Sales & Trading',desc:'Market structure, fixed income, options Greeks, trade ideas, and macro positioning.',cards:ST_FLASHCARDS.length,iconClass:'icon-st',icon:<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  { id:'er',title:'Equity Research',desc:'Earnings models, consensus, price targets, stock coverage, and sell-side process.',cards:ER_FLASHCARDS.length,iconClass:'icon-er',icon:<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>},
  { id:'re',title:'Real Estate',desc:'NOI, cap rates, waterfalls, REIT metrics, debt sizing, and property analysis.',cards:RE_FLASHCARDS.length,iconClass:'icon-re',icon:<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
  { id:'vc',title:'Venture Capital',desc:'Term sheets, SaaS metrics, cap tables, fund economics, and startup evaluation.',cards:VC_FLASHCARDS.length,iconClass:'icon-vc',icon:<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
  { id:'rx',title:'Restructuring',desc:'Chapter 11, priority of claims, fulcrum security, DIP financing, and distressed valuation.',cards:RX_FLASHCARDS.length,iconClass:'icon-rx',icon:<svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>},
];

const CARD_MAP: Record<string, typeof IB_FLASHCARDS> = {
  ib:IB_FLASHCARDS, pe:PE_FLASHCARDS, consulting:CONSULTING_FLASHCARDS,
  quant:QUANT_FLASHCARDS, accounting:ACCT_FLASHCARDS, am:AM_FLASHCARDS,
  st:ST_FLASHCARDS, er:ER_FLASHCARDS, re:RE_FLASHCARDS,
  vc:VC_FLASHCARDS, rx:RX_FLASHCARDS,
};

const ARROW_R = <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const ARROW_L = <svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>;
const CHEVRON = <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>;

// ── Dropdown Component ──
function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const display = value === 'All' ? label : value;
  const hasValue = value !== 'All';

  return (
    <div className="flash-dropdown" ref={ref}>
      <button className={`flash-dropdown-btn${hasValue ? ' has-value' : ''}`} onClick={() => setOpen(!open)} type="button">
        {display}{CHEVRON}
      </button>
      {open && (
        <div className="flash-dropdown-menu">
          {options.map(o => (
            <button key={o} className={`flash-dropdown-item${value === o ? ' active' : ''}`}
              onClick={() => { onChange(o); setOpen(false); }} type="button">
              {o === 'All' ? `All ${label}s` : o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FlashcardsPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) router.replace('/signin');
  }, [router]);

  const allCards = useMemo(() => activeTrack ? (CARD_MAP[activeTrack] || []) : [], [activeTrack]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allCards.map(c => c.category)));
    return ['All', ...cats];
  }, [allCards]);

  const filtered = useMemo(() => {
    let base = filterCat === 'All' ? allCards : allCards.filter(c => c.category === filterCat);
    if (filterDiff !== 'All') base = base.filter(c => c.difficulty === filterDiff);
    if (shuffleKey > 0) {
      const arr = [...base];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCards, filterCat, filterDiff, shuffleKey]);

  const card = filtered[idx] || null;

  const goNext = useCallback(() => { if (idx < filtered.length - 1) { setIdx(idx + 1); setShowAnswer(false); } }, [idx, filtered.length]);
  const goPrev = useCallback(() => { if (idx > 0) { setIdx(idx - 1); setShowAnswer(false); } }, [idx]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'l') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'h') goPrev();
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowAnswer(p => !p); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const openTrack = (id: string) => { setActiveTrack(id); setFilterCat('All'); setFilterDiff('All'); setIdx(0); setShowAnswer(false); setShuffleKey(0); };
  const goBack = () => { setActiveTrack(null); setIdx(0); setShowAnswer(false); };
  const handleFilterCat = (v: string) => { setFilterCat(v); setIdx(0); setShowAnswer(false); };
  const handleFilterDiff = (v: string) => { setFilterDiff(v); setIdx(0); setShowAnswer(false); };
  const handleShuffle = () => { setShuffleKey(p => p + 1); setIdx(0); setShowAnswer(false); };

  const trackInfo = TRACKS.find(t => t.id === activeTrack);

  // ── LANDING ──
  if (!activeTrack) {
    const total = TRACKS.reduce((s, t) => s + t.cards, 0);
    return (
      <div className="app">
        <Sidebar activePage="flashcards" />
        <main className="flash-main">
          <div className="flash-landing">
            <div className="flash-landing-badge">Technical Practice</div>
            <div className="flash-landing-title">Interview <em>Flashcards</em></div>
            <div className="flash-landing-sub">
              Master every technical concept with curated interview questions reported in actual interviews across top firms. Filter by topic and difficulty, then drill one card at a time.
            </div>
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
      </div>
    );
  }

  // ── DRILL VIEW ──
  return (
    <div className="app">
      <Sidebar activePage="flashcards" />
      <main className="flash-main">
        <div className="flash-drill">
          <button className="flash-back" onClick={goBack} type="button">
            {ARROW_L} All Tracks
          </button>

          <div className="flash-drill-head">
            <div className="flash-drill-title">{trackInfo?.title}</div>
          </div>

          {/* Filter bar */}
          <div className="flash-filter-bar">
            <Dropdown label="Topic" value={filterCat} options={categories} onChange={handleFilterCat} />
            <Dropdown label="Difficulty" value={filterDiff} options={['All','Easy','Medium','Hard']} onChange={handleFilterDiff} />
            <div className="flash-filter-spacer" />
            <button className="flash-shuffle" onClick={handleShuffle} type="button">
              <svg viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              Shuffle
            </button>
          </div>

          {/* Single Card */}
          {card ? (
            <>
              <div className="flash-card-container">
                <div className="flash-card-single">
                  <div className="flash-card-tags">
                    <span className="flash-tag flash-tag-cat">{card.category}</span>
                    {card.difficulty && (
                      <span className={`flash-tag flash-tag-diff-${card.difficulty.toLowerCase()}`}>{card.difficulty}</span>
                    )}
                  </div>

                  <div className="flash-question">{card.q}</div>

                  {card.firm && (
                    <div className="flash-firm-row">
                      <span className="flash-firm-tag">
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Reported in {card.firm} interview
                      </span>
                    </div>
                  )}

                  <button
                    className={`flash-show-btn${showAnswer ? ' shown' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setShowAnswer(!showAnswer); }}
                    type="button"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>

                  {showAnswer && (
                    <div className="flash-answer">{card.a}</div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flash-nav-row">
                <button className="flash-nav-btn" onClick={goPrev} disabled={idx === 0} type="button">
                  {ARROW_L} Back
                </button>
                <span className="flash-nav-counter">Question {idx + 1} of {filtered.length}</span>
                <button className="flash-nav-btn" onClick={goNext} disabled={idx >= filtered.length - 1} type="button">
                  Next {ARROW_R}
                </button>
              </div>

              <div className="flash-keyboard-hint">
                <span><span className="flash-kbd">←</span> Previous</span>
                <span><span className="flash-kbd">→</span> Next</span>
                <span><span className="flash-kbd">⎵</span> Toggle Answer</span>
              </div>
            </>
          ) : (
            <div className="flash-card-container">
              <div className="flash-card-single" style={{ alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                <div style={{ color: 'var(--text-3)', fontSize: 14 }}>No questions match the current filters.</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
