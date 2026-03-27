'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './flashcards.css';
import { IB_FLASHCARDS } from './ib-flashcard-data';

type Track = {
  id: string;
  title: string;
  desc: string;
  cards: number;
  iconClass: string;
  icon: React.ReactNode;
};

const TRACKS: Track[] = [
  {
    id: 'ib', title: 'Investment Banking',
    desc: 'Accounting walkthroughs, DCF, EV vs Equity Value, accretion/dilution, LBO mechanics, and behavioral questions.',
    cards: IB_FLASHCARDS.length, iconClass: 'icon-ib',
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    id: 'pe', title: 'Private Equity',
    desc: 'LBO modeling, fund economics, deal sourcing, portfolio operations, and PE-specific behavioral prep.',
    cards: 0, iconClass: 'icon-pe',
    icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    id: 'consulting', title: 'Consulting',
    desc: 'Case frameworks, market sizing, profitability analysis, MECE structure, and MBB behavioral.',
    cards: 0, iconClass: 'icon-consulting',
    icon: <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  },
  {
    id: 'quant', title: 'Quant Research',
    desc: 'Probability, statistics, stochastic calculus, derivatives pricing, brainteasers, and coding questions.',
    cards: 0, iconClass: 'icon-quant',
    icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    id: 'accounting', title: 'Accounting & Audit',
    desc: 'Journal entries, audit assertions, financial statement analysis, materiality, and Big 4 behavioral.',
    cards: 0, iconClass: 'icon-accounting',
    icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>,
  },
  {
    id: 'am', title: 'Asset Management',
    desc: 'Stock pitches, portfolio construction, macro analysis, valuation, and buy-side behavioral.',
    cards: 0, iconClass: 'icon-am',
    icon: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  },
];

const ARROW = <svg viewBox="0 0 24 24" width="16" height="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export default function FlashcardsPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [shuffled, setShuffled] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) router.replace('/signin');
  }, [router]);

  const allCards = useMemo(() => {
    if (activeTrack === 'ib') return IB_FLASHCARDS;
    return [];
  }, [activeTrack]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allCards.map(c => c.category)));
    return ['All', ...cats];
  }, [allCards]);

  const filtered = useMemo(() => {
    const base = activeCategory === 'All' ? allCards : allCards.filter(c => c.category === activeCategory);
    if (!shuffled) return base;
    const arr = [...base];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCards, activeCategory, shuffleKey, shuffled]);

  const toggleFlip = useCallback((idx: number) => {
    setFlipped(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const openTrack = (id: string) => { setActiveTrack(id); setActiveCategory('All'); setFlipped({}); setShuffled(false); };
  const goBack = () => { setActiveTrack(null); setFlipped({}); };

  const flippedCount = Object.values(flipped).filter(Boolean).length;
  const trackInfo = TRACKS.find(t => t.id === activeTrack);

  // ── LANDING VIEW ──
  if (!activeTrack) {
    const totalCards = TRACKS.reduce((s, t) => s + t.cards, 0);
    return (
      <div className="app">
        <Sidebar activePage="flashcards" />
        <main className="flash-main">
          <div className="flash-hero">
            <div className="flash-hero-badge">Technical Practice</div>
            <div className="flash-hero-title">Interview <em>Flashcards</em></div>
            <div className="flash-hero-desc">
              Master every technical concept with interactive flashcards. Click a track to begin drilling — flip cards, filter by category, and shuffle until every answer is instinctive.
            </div>
            <div className="flash-hero-stats">
              <div>
                <div className="flash-hero-stat-val">{totalCards}+</div>
                <div className="flash-hero-stat-label">Total Cards</div>
              </div>
              <div>
                <div className="flash-hero-stat-val">{TRACKS.length}</div>
                <div className="flash-hero-stat-label">Career Tracks</div>
              </div>
            </div>
          </div>

          <div className="flash-section">
            <div className="flash-section-header">
              <div className="flash-section-title">Choose a Track</div>
            </div>
          </div>

          <div className="flash-track-grid">
            {TRACKS.map(t => (
              <div key={t.id} className={`flash-track-card${t.cards === 0 ? ' coming-soon' : ''}`} onClick={() => t.cards > 0 && openTrack(t.id)}>
                <div className={`flash-track-icon ${t.iconClass}`}>{t.icon}</div>
                <div className="flash-track-title">{t.title}</div>
                <div className="flash-track-desc">{t.desc}</div>
                <div className="flash-track-footer">
                  {t.cards > 0 ? (
                    <>
                      <span className="flash-track-count">{t.cards} CARDS</span>
                      <span className="flash-track-cta">Start Practice {ARROW}</span>
                    </>
                  ) : (
                    <>
                      <span className="flash-track-count coming-soon-label">Coming Soon</span>
                      <span className="flash-track-cta disabled">—</span>
                    </>
                  )}
                </div>
              </div>
            ))}
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
        <div className="flash-drill-header">
          <button className="flash-back-btn" onClick={goBack} type="button">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All Tracks
          </button>
          <div className="flash-drill-title">{trackInfo?.title}</div>
          <div className="flash-drill-stats">
            <span>{filtered.length} cards</span>
            <span>·</span>
            <span>{flippedCount} reviewed</span>
          </div>
        </div>

        <div className="flash-drill-controls">
          <div className="flash-filters-inline">
            {categories.map(cat => (
              <button key={cat} className={`flash-filter-pill${activeCategory === cat ? ' active' : ''}`} onClick={() => { setActiveCategory(cat); setFlipped({}); setShuffled(false); }} type="button">
                {cat}
              </button>
            ))}
          </div>
          <button className="flash-shuffle-btn" onClick={() => { setShuffled(true); setShuffleKey(p => p + 1); setFlipped({}); }} type="button">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
            Shuffle
          </button>
        </div>

        <div className="flash-grid">
          {filtered.map((card, i) => (
            <div key={`${shuffleKey}-${i}`} className="flash-card-wrapper" onClick={() => toggleFlip(i)}>
              <div className={`flash-card${flipped[i] ? ' flipped' : ''}`}>
                <div className="flash-card-front">
                  <div className="flash-card-cat">{card.category}</div>
                  <div className="flash-card-q">{card.q}</div>
                  <div className="flash-card-hint">Click to reveal →</div>
                </div>
                <div className="flash-card-back">
                  <div className="flash-card-cat">Answer</div>
                  <div className="flash-card-a">{card.a}</div>
                  <div className="flash-card-hint">Click to flip back</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
