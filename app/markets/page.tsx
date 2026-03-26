'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import './markets.css';

type Post = {
  id: number;
  author: { name: string; handle: string; avatar: string; badge: boolean };
  createdAt: number; // Unix timestamp
  content: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  upvotes: number;
  downvotes: number;
  replies: number;
};

// Formatting helpers
function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const extractTags = (text: string): string[] => {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return Array.from(new Set(matches)).map(t => t.toLowerCase());
};

// Mock initial data
const now = Date.now();
const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: { name: 'Alex Chen', handle: '@alexc', avatar: 'AC', badge: true },
    createdAt: now - 1000 * 60 * 120, // 2h ago
    content: 'CPI data hotter than expected at 3.5%. The market is ignoring this but I expect a massive repricing in rates next week. #macro #fixedincome',
    sentiment: 'Bearish',
    upvotes: 42, downvotes: 2, replies: 5,
  },
  {
    id: 2,
    author: { name: 'Sarah Jenkins', handle: '@sjenkins', avatar: 'SJ', badge: false },
    createdAt: now - 1000 * 60 * 45, // 45m ago
    content: 'If NVDA holds $900 through earnings, the entire semi sector is getting dragged up 15%. IV is priced for perfection though. #equities #semis',
    sentiment: 'Bullish',
    upvotes: 89, downvotes: 5, replies: 12,
  },
  {
    id: 3,
    author: { name: 'Marcus T.', handle: '@marcustrade', avatar: 'MT', badge: true },
    createdAt: now - 1000 * 60 * 300, // 5h ago
    content: 'Goldman Sachs just quietly expanded their FICC desk headcount while reducing IB advisory roles. Revenue shift clearly happening. #firms #ib',
    sentiment: 'Neutral',
    upvotes: 156, downvotes: 0, replies: 28,
  },
  {
    id: 4,
    author: { name: 'Elena R.', handle: '@elerio', avatar: 'ER', badge: true },
    createdAt: now - 1000 * 60 * 15, // 15m ago (Rising velocity)
    content: 'Oil surging past $85 on geopolitical tensions. Energy stocks look fundamentally cheap here compared to the broader market multiple. Building a position in XLE. #energy #macro #commodities',
    sentiment: 'Bullish',
    upvotes: 34, downvotes: 0, replies: 3,
  },
  {
    id: 5,
    author: { name: 'Dan R.', handle: '@dr_macro', avatar: 'DR', badge: false },
    createdAt: now - 1000 * 60 * 5, // 5m ago
    content: 'Anyone touching long duration bonds today is playing with fire. The curve isn\'t fully pricing in this sticky inflation print. #fixedincome #macro',
    sentiment: 'Bearish',
    upvotes: 12, downvotes: 1, replies: 0,
  }
];

const SENTIMENT_COLORS = {
  Bullish: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', dot: '#10b981' },
  Bearish: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', dot: '#ef4444' },
  Neutral: { bg: 'var(--surface-2)', text: 'var(--text-2)', dot: 'var(--text-3)' }
};

export default function MarketsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  // Navigation State
  const [activeFeed, setActiveFeed] = useState<string>('Global');
  const [pinnedTags, setPinnedTags] = useState<string[]>(['#macro', '#equities']);

  // Composer State
  const [composeText, setComposeText] = useState('');
  const [composeSentiment, setComposeSentiment] = useState<'Bullish'|'Bearish'|'Neutral'>('Neutral');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); }
  }, [router]);

  // Extract hashtags live while composing to show user if they meet requirements
  const composeTags = extractTags(composeText);
  const canPost = composeText.trim().length > 0 && composeTags.length > 0 && composeText.length <= 280;

  const handlePost = () => {
    if (!canPost) return;
    const newPost: Post = {
      id: Date.now(),
      author: { name: 'You', handle: '@user', avatar: 'U', badge: false },
      createdAt: Date.now(),
      content: composeText,
      sentiment: composeSentiment,
      upvotes: 0, downvotes: 0, replies: 0,
    };
    setPosts([newPost, ...posts]);
    setComposeText('');
  };

  const handlePinTag = (tag: string, e: any) => {
    e.stopPropagation();
    if (pinnedTags.includes(tag)) {
      setPinnedTags(pinnedTags.filter(t => t !== tag));
      if (activeFeed === tag) setActiveFeed('Global');
    } else {
      setPinnedTags([...pinnedTags, tag]);
    }
  };

  // Render post text with clickable hashtags
  const renderContent = (text: string): ReactNode => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, idx) => {
      if (part.match(/^#[a-zA-Z0-9_]+/)) {
        const tagLower = part.toLowerCase();
        return (
          <span 
            key={idx} 
            className="inline-hashtag"
            onClick={(e) => { e.stopPropagation(); setActiveFeed(tagLower); }}
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // Calculate Trending & Rising tags
  const { trending, rising } = useMemo(() => {
    const tagStats: Record<string, { count: number; recentCount: number; bullish: number; bearish: number }> = {};
    const oneHourAgo = Date.now() - 1000 * 60 * 60;
    
    posts.forEach(post => {
      const tags = extractTags(post.content);
      const isRecent = post.createdAt > oneHourAgo;
      
      tags.forEach(tag => {
        if (!tagStats[tag]) tagStats[tag] = { count: 0, recentCount: 0, bullish: 0, bearish: 0 };
        tagStats[tag].count++;
        if (isRecent) tagStats[tag].recentCount++;
        if (post.sentiment === 'Bullish') tagStats[tag].bullish++;
        if (post.sentiment === 'Bearish') tagStats[tag].bearish++;
      });
    });

    const allTags = Object.entries(tagStats).map(([tag, data]) => {
      const totalSent = data.bullish + data.bearish;
      let sentimentStr = 'Mixed';
      let borderClass = 'neutral-border';
      if (totalSent > 0) {
        const bullPct = data.bullish / totalSent;
        if (bullPct >= 0.6) { sentimentStr = `${Math.round(bullPct*100)}% Bullish`; borderClass = 'bullish-border'; }
        else if (bullPct <= 0.4) { sentimentStr = `${Math.round((1-bullPct)*100)}% Bearish`; borderClass = 'bearish-border'; }
      }
      return { tag, count: data.count, velocity: data.recentCount, sentimentStr, borderClass };
    });

    // Trending: High volume + velocity, sort by (count + velocity * 2)
    const sortedTrending = [...allTags].sort((a,b) => (b.count + b.velocity*2) - (a.count + a.velocity*2)).slice(0, 5);
    
    // Rising: High velocity but lower absolute count (newer trends)
    const sortedRising = [...allTags]
      .filter(t => t.velocity > 0 && t.count <= 3) 
      .sort((a,b) => b.velocity - a.velocity)
      .slice(0, 3);

    return { trending: sortedTrending, rising: sortedRising };
  }, [posts]);

  // Filter feed logic
  const filteredPosts = posts.filter(p => {
    if (activeFeed === 'Global') return true;
    if (activeFeed === 'Following') return true; // Mock Following as Global for now
    // If activeFeed is a hashtag (starts with #)
    const tags = extractTags(p.content);
    return tags.includes(activeFeed);
  });

  return (
    <div className="app">
      <Sidebar activePage="markets" />
      
      <main className="markets-main">
        <div className="markets-layout">
          
          {/* LEFT COLUMN: FEED */}
          <div className="markets-feed-col">
            <div className="markets-header">
              <div className="markets-title">{activeFeed === 'Global' ? 'Pulse' : activeFeed === 'Following' ? 'Following' : activeFeed}</div>
              <div className="markets-subtitle">
                {activeFeed.startsWith('#') ? `Community chatter around ${activeFeed}.` : 'Real-time community intelligence & discourse.'}
              </div>
            </div>

            {/* Composer */}
            <div className="markets-composer">
              <div className="composer-avatar">U</div>
              <div className="composer-body">
                <textarea 
                  placeholder="Drop a hot take. Don't forget your #hashtags..."
                  value={composeText}
                  onChange={e => setComposeText(e.target.value)}
                  maxLength={280}
                  className="composer-input"
                  rows={3}
                />
                <div className="composer-actions">
                  <div className="composer-selectors">
                    <select className="composer-select" value={composeSentiment} onChange={e => setComposeSentiment(e.target.value as any)}>
                      <option value="Neutral">Neutral ➖</option>
                      <option value="Bullish">Bullish 🐂</option>
                      <option value="Bearish">Bearish 🐻</option>
                    </select>
                    {composeTags.length === 0 && composeText.length > 0 && (
                      <span className="composer-warning">Add at least 1 #hashtag</span>
                    )}
                  </div>
                  <div className="composer-right">
                    <span className="composer-char-count" style={{ color: composeText.length > 260 ? '#ef4444' : 'var(--text-3)' }}>
                      {composeText.length}/280
                    </span>
                    <button 
                      className={`composer-btn ${canPost ? 'active' : ''}`}
                      onClick={handlePost}
                      disabled={!canPost}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="markets-tabs-wrapper">
              <div className="markets-tabs">
                <button className={`market-tab ${activeFeed === 'Global' ? 'active' : ''}`} onClick={() => setActiveFeed('Global')}>Global</button>
                <button className={`market-tab ${activeFeed === 'Following' ? 'active' : ''}`} onClick={() => setActiveFeed('Following')}>Following</button>
                <div className="tab-divider"></div>
                {pinnedTags.map(tag => (
                  <div key={tag} className={`pinned-tab-group ${activeFeed === tag ? 'active' : ''}`}>
                    <button className="pinned-tab-label" onClick={() => setActiveFeed(tag)}>{tag}</button>
                    <button className="pinned-tab-unpin" onClick={(e) => handlePinTag(tag, e)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="posts-container">
              {filteredPosts.length === 0 ? (
                <div className="no-posts">
                  <div style={{ fontSize: 40, marginBottom: 16 }}>📉</div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Nothing here yet.</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Be the first to tag a post with {activeFeed}.</div>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const sColor = SENTIMENT_COLORS[post.sentiment];
                  const postHashtags = extractTags(post.content);
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
                              <svg className="verified-badge" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            )}
                            <span className="post-author-handle">{post.author.handle}</span>
                            <span className="post-dot">·</span>
                            <span className="post-time">{timeAgo(post.createdAt)}</span>
                          </div>
                          
                          <div className="post-sentiment-tag" style={{ background: sColor.bg, color: sColor.text }}>
                            <span className="sentiment-dot" style={{ backgroundColor: sColor.dot }}></span>
                            {post.sentiment}
                          </div>
                        </div>
                        
                        <div className="post-text">{renderContent(post.content)}</div>
                        
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
              <div className="widget-header">Trending Tags</div>
              {trending.map((t, idx) => (
                <div key={t.tag} className="trending-item" onClick={() => setActiveFeed(t.tag)}>
                  <div className="trending-info">
                    <div className="trending-name">{idx + 1}. {t.tag}</div>
                    <div className="trending-volume">{t.count * 123 + Math.floor(Math.random()*100)} posts</div>
                  </div>
                  <div className={`trending-sentiment ${t.borderClass}`}>
                    <button 
                      className="pin-tag-btn" 
                      onClick={(e) => handlePinTag(t.tag, e)}
                      title={pinnedTags.includes(t.tag) ? "Unpin tag" : "Pin to feed"}
                    >
                      {pinnedTags.includes(t.tag) ? '📌' : '📍'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {rising.length > 0 && (
              <div className="trending-widget rising-widget">
                <div className="widget-header">
                  Rising <span style={{fontSize: 14}}>🔥</span>
                </div>
                {rising.map((t) => (
                  <div key={t.tag} className="trending-item" onClick={() => setActiveFeed(t.tag)}>
                    <div className="trending-info">
                      <div className="trending-name" style={{color: '#3b82f6'}}>{t.tag}</div>
                      <div className="trending-volume">Climbing right now</div>
                    </div>
                    <button 
                      className="pin-tag-btn" 
                      onClick={(e) => handlePinTag(t.tag, e)}
                    >
                      📍
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="community-guidelines">
              <div className="guidelines-title">Pulse Guidelines</div>
              <ul className="guidelines-list">
                <li>Every post must contain at least one #hashtag.</li>
                <li>Verified <svg className="verified-badge inline-badge" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> users have active marketplace listings or placements.</li>
                <li>No spam, be constructive.</li>
              </ul>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
