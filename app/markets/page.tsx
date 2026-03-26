'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import './markets.css';

type PostResponse = {
  _id: Id<"marketPosts">;
  _creationTime: number;
  userId: Id<"users">;
  content: string;
  sentiment: string;
  upvotes: number;
  downvotes: number;
  replies: number;
  createdAt: number;
  author: {
    name: string;
    handle: string;
    avatar: string;
    badge: boolean;
  };
};

// Formatting helpers
function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return `Just now`;
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const extractTags = (text: string): string[] => {
  const matches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  return Array.from(new Set(matches)).map(t => t.toLowerCase());
};

const SENTIMENT_COLORS = {
  Bullish: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', dot: '#10b981' },
  Bearish: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', dot: '#ef4444' },
  Neutral: { bg: 'var(--surface-2)', text: 'var(--text-2)', dot: 'var(--text-3)' }
};

// Clean functional SVG components for React safety
const PinSolid = () => <svg className="pin-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11.78L20.24 16H13v6l-1 2-1-2v-6H3.76L8 11.78V4h8v7.78z"/></svg>;
const PinOutline = () => <svg className="pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11.78L20.24 16H13v6l-1 2-1-2v-6H3.76L8 11.78V4h8v7.78z" fill="none"/></svg>;
const FlameIcon = () => <svg className="flame-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2c0 0-3 3-3 8 0 0-4-3-4-8-3 3-5 7-5 12 0 5 4 9 9 9s9-4 9-9c0-5-2-9-5-12z"/><path d="M12 17c0 0-1-1-1-3 0 0-2-1-2-3-1 1-2 3-2 5 0 2 1 4 3 4s3-2 3-4z"/></svg>;
const BullishIcon = () => <svg className="sentiment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7L13.5 15.5 8.5 10.5 2 17"/><path d="M16 7H22V13"/></svg>;
const BearishIcon = () => <svg className="sentiment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17L13.5 8.5 8.5 13.5 2 7"/><path d="M16 17H22V11"/></svg>;
const NeutralIcon = () => <svg className="sentiment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/></svg>;

export default function MarketsPage() {
  const router = useRouter();
  
  // Dynamic Convex Data
  // Wrapped in a reliable array fallback directly in case the fetch hasn't started or fails locally
  const queryData = useQuery(api.marketPosts.list);
  const rawPosts: PostResponse[] = queryData || [];
  
  const createPost = useMutation(api.marketPosts.create);
  const actionPost = useMutation(api.marketPosts.action);
  
  // Navigation State
  const [activeFeed, setActiveFeed] = useState<string>('Global');
  const [pinnedTags, setPinnedTags] = useState<string[]>(['#macro', '#equities']);

  // Composer State
  const [composeText, setComposeText] = useState('');
  const [composeSentiment, setComposeSentiment] = useState<'Bullish'|'Bearish'|'Neutral'>('Neutral');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); }
    else { setUserId(stored); }
  }, [router]);

  // Extract hashtags live while composing to show user if they meet requirements
  const composeTags = extractTags(composeText);
  const canPost = composeText.trim().length > 0 && composeTags.length > 0 && composeText.length <= 280 && userId;

  const handlePost = async () => {
    if (!canPost) return;
    try {
      await createPost({
        userId: userId as Id<"users">,
        content: composeText,
        sentiment: composeSentiment,
      });
      setComposeText('');
    } catch (e) {
      console.error(e);
      alert("Failed to submit post.");
    }
  };

  const handleAction = async (postId: Id<"marketPosts">, type: string) => {
    try {
      await actionPost({ postId, type });
    } catch (e) {
      console.error(e);
    }
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

  // Calculate Trending & Rising tags natively
  const { trending, rising } = useMemo(() => {
    const tagStats: Record<string, { count: number; recentCount: number; bullish: number; bearish: number }> = {};
    const oneHourAgo = Date.now() - 1000 * 60 * 60;
    
    rawPosts.forEach(post => {
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
  }, [rawPosts]);

  // Filter feed logic
  const filteredPosts = rawPosts.filter(p => {
    if (activeFeed === 'Global') return true;
    if (activeFeed === 'Following') return true;
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
              <div className="composer-avatar">
                {rawPosts.length > 0 && userId === rawPosts[0].userId ? rawPosts[0].author.avatar : 'U'}
              </div>
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
                    {/* EMOJIS FULLY REMOVED */}
                    <select className="composer-select" value={composeSentiment} onChange={e => setComposeSentiment(e.target.value as any)}>
                      <option value="Neutral">Neutral</option>
                      <option value="Bullish">Bullish</option>
                      <option value="Bearish">Bearish</option>
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
                <div className="no-posts" style={{ padding: '60px 40px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--text-3)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  </div>
                  <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Nothing here yet.</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 14 }}>Be the first to tag a post with {activeFeed}.</div>
                </div>
              ) : (
                filteredPosts.map(post => {
                  const sColor = (SENTIMENT_COLORS as any)[post.sentiment] || SENTIMENT_COLORS.Neutral;
                  return (
                    <div key={post._id} className="post-card">
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
                            {post.sentiment === 'Bullish' && <BullishIcon />}
                            {post.sentiment === 'Bearish' && <BearishIcon />}
                            {post.sentiment === 'Neutral' && <NeutralIcon />}
                          </div>
                        </div>
                        
                        <div className="post-text">{renderContent(post.content)}</div>
                        
                        <div className="post-actions">
                          <button className="action-btn upvote" onClick={() => handleAction(post._id, 'upvote')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            <span>{post.upvotes}</span>
                          </button>
                          <button className="action-btn downvote" onClick={() => handleAction(post._id, 'downvote')}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path></svg>
                            {post.downvotes > 0 && <span style={{marginLeft: 4}}>{post.downvotes}</span>}
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
                    <div className="trending-volume">{t.count} posts</div>
                  </div>
                  <div className={`trending-sentiment ${t.borderClass}`}>
                    <button 
                      className="pin-tag-btn" 
                      onClick={(e) => handlePinTag(t.tag, e)}
                      title={pinnedTags.includes(t.tag) ? "Unpin tag" : "Pin to feed"}
                    >
                      {pinnedTags.includes(t.tag) ? <PinSolid /> : <PinOutline />}
                    </button>
                  </div>
                </div>
              ))}
              {trending.length === 0 && (
                <div style={{color: 'var(--text-3)', fontSize: 13}}>No tags trending yet.</div>
              )}
            </div>

            {rising.length > 0 && (
              <div className="trending-widget rising-widget">
                <div className="widget-header" style={{ display: 'flex', alignItems: 'center' }}>
                  Rising <FlameIcon />
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
                      {pinnedTags.includes(t.tag) ? <PinSolid /> : <PinOutline />}
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
