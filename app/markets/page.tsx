'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './markets.css';

type Post = {
  id: number;
  author: { name: string; handle: string; avatar: string; badge: boolean };
  timestamp: string;
  content: string;
  market: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  upvotes: number;
  downvotes: number;
  replies: number;
};

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: { name: 'Alex Chen', handle: '@alexc', avatar: 'AC', badge: true },
    timestamp: '2h ago',
    content: 'CPI data just came in hotter than expected at 3.5%. The market is completely ignoring this but I expect a massive repricing in rates by next week. The Fed is not cutting anytime soon.',
    market: 'Macro',
    sentiment: 'Bearish',
    upvotes: 42,
    downvotes: 2,
    replies: 5,
  },
  {
    id: 2,
    author: { name: 'Sarah Jenkins', handle: '@sjenkins', avatar: 'SJ', badge: false },
    timestamp: '4h ago',
    content: 'If NVDA holds $900 through earnings, the entire semi sector is getting dragged up another 15%. IV is priced for perfection though, making options plays incredibly risky right now.',
    market: 'Equities',
    sentiment: 'Bullish',
    upvotes: 89,
    downvotes: 5,
    replies: 12,
  },
  {
    id: 3,
    author: { name: 'Marcus T.', handle: '@marcustrade', avatar: 'MT', badge: true },
    timestamp: '5h ago',
    content: 'Goldman Sachs just quietly expanded their FICC desk headcount while reducing IB advisory roles. Tells you everything you need to know about where they expect revenue to come from this year.',
    market: 'Firms',
    sentiment: 'Neutral',
    upvotes: 156,
    downvotes: 0,
    replies: 28,
  },
  {
    id: 4,
    author: { name: 'Elena R.', handle: '@elerio', avatar: 'ER', badge: true },
    timestamp: '6h ago',
    content: 'Oil surging past $85 on geopolitical tensions again. Energy stocks look fundamentally cheap here compared to the broader market multiple. Building a position in XLE.',
    market: 'Energy',
    sentiment: 'Bullish',
    upvotes: 34,
    downvotes: 8,
    replies: 3,
  }
];

const MARKETS = ['Global', 'Following', 'Macro', 'Equities', 'Fixed Income', 'Energy', 'Crypto', 'Firms'];
const SENTIMENT_COLORS = {
  Bullish: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', dot: '#10b981' },
  Bearish: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', dot: '#ef4444' },
  Neutral: { bg: 'var(--surface-2)', text: 'var(--text-2)', dot: 'var(--text-3)' }
};

export default function MarketsPage() {
  const router = useRouter();
  const [activeMarket, setActiveMarket] = useState('Global');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  // Composer state
  const [composeText, setComposeText] = useState('');
  const [composeMarket, setComposeMarket] = useState('Equities');
  const [composeSentiment, setComposeSentiment] = useState<'Bullish'|'Bearish'|'Neutral'>('Neutral');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); }
  }, [router]);

  const handlePost = () => {
    if (!composeText.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: { name: 'You', handle: '@user', avatar: 'U', badge: false },
      timestamp: 'Just now',
      content: composeText,
      market: composeMarket,
      sentiment: composeSentiment,
      upvotes: 0,
      downvotes: 0,
      replies: 0,
    };
    setPosts([newPost, ...posts]);
    setComposeText('');
  };

  const filteredPosts = posts.filter(p => {
    if (activeMarket === 'Global') return true;
    if (activeMarket === 'Following') return true; // Mock following feed as global for now
    return p.market === activeMarket;
  });

  return (
    <div className="app">
      <Sidebar activePage="markets" />
      
      <main className="markets-main">
        <div className="markets-layout">
          
          {/* LEFT COLUMN: FEED */}
          <div className="markets-feed-col">
            <div className="markets-header">
              <div className="markets-title">Markets Pulse</div>
              <div className="markets-subtitle">Real-time community intelligence & discourse.</div>
            </div>

            {/* Composer */}
            <div className="markets-composer">
              <div className="composer-avatar">U</div>
              <div className="composer-body">
                <textarea 
                  placeholder="What's your take on the markets?"
                  value={composeText}
                  onChange={e => setComposeText(e.target.value)}
                  maxLength={280}
                  className="composer-input"
                  rows={3}
                />
                <div className="composer-actions">
                  <div className="composer-selectors">
                    <select className="composer-select" value={composeMarket} onChange={e => setComposeMarket(e.target.value)}>
                      {MARKETS.filter(m => m !== 'Global' && m !== 'Following').map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select className="composer-select" value={composeSentiment} onChange={e => setComposeSentiment(e.target.value as any)}>
                      <option value="Neutral">Neutral ➖</option>
                      <option value="Bullish">Bullish 🐂</option>
                      <option value="Bearish">Bearish 🐻</option>
                    </select>
                  </div>
                  <div className="composer-right">
                    <span className="composer-char-count" style={{ color: composeText.length > 260 ? '#ef4444' : 'var(--text-3)' }}>
                      {composeText.length}/280
                    </span>
                    <button 
                      className={`composer-btn ${composeText.length > 0 ? 'active' : ''}`}
                      onClick={handlePost}
                      disabled={!composeText.trim()}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Filters */}
            <div className="markets-tabs-wrapper">
              <div className="markets-tabs">
                {MARKETS.map(market => (
                  <button 
                    key={market} 
                    className={`market-tab ${activeMarket === market ? 'active' : ''}`}
                    onClick={() => setActiveMarket(market)}
                  >
                    {market}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats header (only visible if specific market selected) */}
            {activeMarket !== 'Global' && activeMarket !== 'Following' && (
              <div className="market-stats-header">
                <div className="stat-pill">📈 Volatility: Elev.</div>
                <div className="stat-pill">💬 Activity: High</div>
                <div className="stat-pill">🎯 Sentiment: Mixed</div>
              </div>
            )}

            {/* Posts Feed */}
            <div className="posts-container">
              {filteredPosts.length === 0 ? (
                <div className="no-posts">
                  <div style={{ fontSize: 40, marginBottom: 16 }}>📉</div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No chatter here yet.</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Be the first to share your take on {activeMarket}.</div>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const sColor = SENTIMENT_COLORS[post.sentiment];
                  return (
                    <div key={post.id} className="post-card">
                      <div className="post-sidebar">
                        <div className="post-avatar">{post.author.avatar}</div>
                        <div className="post-thread-line"></div>
                      </div>
                      <div className="post-content-container">
                        <div className="post-header">
                          <div className="post-author-info">
                            <span className="post-author-name">{post.author.name}</span>
                            {post.author.badge && (
                              <svg className="verified-badge" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                            )}
                            <span className="post-author-handle">{post.author.handle}</span>
                            <span className="post-dot">·</span>
                            <span className="post-time">{post.timestamp}</span>
                          </div>
                          <div className="post-tags-top">
                            {activeMarket === 'Global' && (
                              <span className="post-market-tag">{post.market}</span>
                            )}
                            <span className="post-sentiment-tag" style={{ background: sColor.bg, color: sColor.text }}>
                              <span className="sentiment-dot" style={{ backgroundColor: sColor.dot }}></span>
                              {post.sentiment}
                            </span>
                          </div>
                        </div>
                        
                        <div className="post-text">{post.content}</div>
                        
                        <div className="post-actions">
                          <button className="action-btn upvote">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            <span>{post.upvotes}</span>
                          </button>
                          <button className="action-btn downvote">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg>
                          </button>
                          <button className="action-btn reply">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            <span>{post.replies}</span>
                          </button>
                          <button className="action-btn flag" style={{ marginLeft: 'auto' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
          </div>

          {/* RIGHT COLUMN: TRENDING */}
          <div className="markets-sidebar-col">
            <div className="trending-widget">
              <div className="widget-header">Trending Markets</div>
              
              <div className="trending-item">
                <div className="trending-info">
                  <div className="trending-name">1. Equities</div>
                  <div className="trending-volume">1,245 posts today</div>
                </div>
                <div className="trending-sentiment bullish-border">68% Bullish</div>
              </div>
              
              <div className="trending-item">
                <div className="trending-info">
                  <div className="trending-name">2. Macro</div>
                  <div className="trending-volume">892 posts today</div>
                </div>
                <div className="trending-sentiment bearish-border">54% Bearish</div>
              </div>
              
              <div className="trending-item">
                <div className="trending-info">
                  <div className="trending-name">3. Crypto</div>
                  <div className="trending-volume">512 posts today</div>
                </div>
                <div className="trending-sentiment bullish-border">82% Bullish</div>
              </div>
              
              <div className="trending-item">
                <div className="trending-info">
                  <div className="trending-name">4. Energy</div>
                  <div className="trending-volume">324 posts today</div>
                </div>
                <div className="trending-sentiment neutral-border">Mixed</div>
              </div>

            </div>
            
            <div className="community-guidelines">
              <div className="guidelines-title">Pulse Guidelines</div>
              <ul className="guidelines-list">
                <li>Be constructive. Disagree on the thesis, respect the analyst.</li>
                <li>Verified <svg className="verified-badge inline-badge" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> users have active marketplace listings or placements.</li>
                <li>Tag your sentiment responsibly.</li>
              </ul>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
