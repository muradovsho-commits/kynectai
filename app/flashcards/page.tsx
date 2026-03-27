'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';
import './flashcards.css';
import { IB_FLASHCARDS } from './ib-flashcard-data';

export default function FlashcardsPage() {
  const router = useRouter();
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [shuffled, setShuffled] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); }
  }, [router]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(IB_FLASHCARDS.map(c => c.category)));
    return ['All', ...cats];
  }, []);

  const filtered = useMemo(() => {
    const base = activeCategory === 'All' ? IB_FLASHCARDS : IB_FLASHCARDS.filter(c => c.category === activeCategory);
    if (!shuffled) return base;
    // Fisher-Yates shuffle with key dependency
    const arr = [...base];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, shuffleKey, shuffled]);

  const toggleFlip = useCallback((idx: number) => {
    setFlipped(prev => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  const handleShuffle = () => {
    setShuffled(true);
    setShuffleKey(prev => prev + 1);
    setFlipped({});
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setFlipped({});
    setShuffled(false);
  };

  const flippedCount = Object.values(flipped).filter(Boolean).length;

  return (
    <div className="app">
      <Sidebar activePage="flashcards" />
      <main className="flash-main">
        {/* Hero */}
        <div className="flash-hero">
          <div className="flash-hero-badge">Technical Practice</div>
          <div className="flash-hero-title">Interview <em>Flashcards</em></div>
          <div className="flash-hero-desc">
            Click any card to flip it and reveal the answer. Filter by category, shuffle the deck, and drill until every answer is instinctive.
          </div>
          <div className="flash-hero-stats">
            <div>
              <div className="flash-hero-stat-val">{IB_FLASHCARDS.length}</div>
              <div className="flash-hero-stat-label">Total Cards</div>
            </div>
            <div>
              <div className="flash-hero-stat-val">{categories.length - 1}</div>
              <div className="flash-hero-stat-label">Categories</div>
            </div>
            <div>
              <div className="flash-hero-stat-val">{flippedCount}</div>
              <div className="flash-hero-stat-label">Reviewed</div>
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="flash-section">
          <div className="flash-section-header">
            <div>
              <div className="flash-section-title">Investment Banking</div>
              <div className="flash-section-count">{filtered.length} cards{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}</div>
            </div>
            <button className="flash-shuffle-btn" onClick={handleShuffle} type="button">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              Shuffle
            </button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flash-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`flash-filter-pill${activeCategory === cat ? ' active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Card grid */}
        <div className="flash-grid">
          {filtered.map((card, i) => (
            <div key={`${shuffleKey}-${i}`} className="flash-card-wrapper" onClick={() => toggleFlip(i)}>
              <div className={`flash-card${flipped[i] ? ' flipped' : ''}`}>
                {/* Front */}
                <div className="flash-card-front">
                  <div className="flash-card-cat">{card.category}</div>
                  <div className="flash-card-q">{card.q}</div>
                  <div className="flash-card-hint">Click to reveal →</div>
                </div>
                {/* Back */}
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
