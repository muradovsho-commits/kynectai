'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

type Story = {
  title: string;
  summary: string;
  impact: { ib: string; quant: string; trading: string };
  tags: string[];
  heat: string;
  link: string;
  source: string;
  pubDate: string;
};

const CATEGORIES = ['All', 'Macro', 'Equities', 'Fixed Income', 'Volatility', 'Firms', 'Geopolitical', 'Explainer'];
const HEAT_LABELS: Record<string, string> = { high: 'High Impact', medium: 'Medium Impact', low: 'Low Impact' };
const HEAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: 'rgba(239,68,68,0.08)', text: '#dc2626', border: '#fecaca' },
  medium: { bg: 'rgba(245,158,11,0.08)', text: '#d97706', border: '#fde68a' },
  low: { bg: 'var(--surface-2)', text: 'var(--text-3)', border: 'var(--border)' },
};

export default function MarketIntelPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); return; }
  }, [router]);

  useEffect(() => {
    async function fetchStories() {
      setLoading(true);
      try {
        const res = await fetch('/api/market-intel');
        const data = await res.json();
        setStories(data.stories || []);
        if (data.error && (!data.stories || data.stories.length === 0)) setError(data.error);
      } catch (e) {
        setError('Failed to load market intelligence');
      }
      setLoading(false);
    }
    fetchStories();
  }, []);

  const filtered = activeCategory === 'All' ? stories : stories.filter(s => s.tags?.includes(activeCategory));

  return (
    <div className="app">
      <Sidebar activePage="market-intel" />
      <main className="main" style={{ padding: '32px 36px', maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Market Intelligence</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', letterSpacing: '-.5px' }}>
              What&apos;s moving <em style={{ fontStyle: 'italic' }}>markets.</em>
            </div>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-2)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', border: '2px solid var(--text-3)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Fetching {stories.length || 6} stories…
              </div>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '6px 14px', fontSize: 13, fontWeight: activeCategory === cat ? 700 : 500,
              color: activeCategory === cat ? 'var(--text)' : 'var(--text-3)',
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif",
              borderBottom: activeCategory === cat ? '2px solid var(--text)' : '2px solid transparent',
              marginBottom: -13, paddingBottom: 10,
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Stories */}
        {error && !loading && stories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', fontSize: 14 }}>{error}</div>
        )}

        {loading && stories.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 60, height: 16, borderRadius: 8, background: 'var(--surface-2)' }} />
                  <div style={{ width: 50, height: 16, borderRadius: 8, background: 'var(--surface-2)' }} />
                </div>
                <div style={{ height: 18, borderRadius: 8, background: 'var(--surface-2)', marginBottom: 8, width: '90%' }} />
                <div style={{ height: 14, borderRadius: 8, background: 'var(--surface-2)', marginBottom: 6, width: '70%' }} />
                <div style={{ height: 14, borderRadius: 8, background: 'var(--surface-2)', width: '80%' }} />
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((story, i) => {
            const heat = HEAT_COLORS[story.heat?.toLowerCase()] || HEAT_COLORS.low;
            return (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '24px 28px', transition: 'border-color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>

                {/* Tags + Heat */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 100, background: heat.bg, color: heat.text, border: `1px solid ${heat.border}` }}>
                    {HEAT_LABELS[story.heat?.toLowerCase()] || 'Medium Impact'}
                  </span>
                  {story.tags?.map(tag => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'var(--surface-2)', color: 'var(--text-3)', border: '1px solid var(--border)' }}>{tag}</span>
                  ))}
                  {story.source && <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>{story.source}</span>}
                </div>

                {/* Title */}
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1.4 }}>{story.title}</div>

                {/* Summary */}
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.6 }}>{story.summary}</div>

                {/* Impact breakdown */}
                <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
                  <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Why it matters</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div><strong style={{ color: 'var(--text)' }}>IB:</strong> {story.impact?.ib}</div>
                    <div><strong style={{ color: 'var(--text)' }}>Quant:</strong> {story.impact?.quant}</div>
                    <div><strong style={{ color: 'var(--text)' }}>Trading:</strong> {story.impact?.trading}</div>
                  </div>
                </div>

                {story.link && (
                  <a href={story.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>
                    Read full story →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );
}
