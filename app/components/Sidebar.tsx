'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUserPlan } from '../lib/usePlan';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface SidebarProps {
  activePage: string;
}

// Map onboarding VERTICALS (from app/onboarding/page.tsx) to short pill labels.
// If the user picks a vertical not listed here, falls back to first 3 chars.
const INDUSTRY_PILL: Record<string, string> = {
  'Investment Banking': 'IB',
  'Private Equity': 'PE',
  'Hedge Fund': 'HF',
  'Venture Capital': 'VC',
  'Growth Equity': 'GE',
  'Sales & Trading': 'S&T',
  'Equity Research': 'ER',
  'Asset Management': 'AM',
  'Consulting': 'Cons',
  'Accounting / Audit / Tax': 'Aud',
  'Corporate Finance / FP&A': 'CF',
  'Corporate Development': 'CD',
  'Real Estate': 'RE',
  'Credit / Debt': 'Cred',
  'Restructuring': 'Rx',
  'Family Office': 'FO',
  'Endowment / Pension': 'EP',
};

function abbreviateIndustry(full: string): string {
  if (!full) return 'IB';
  if (INDUSTRY_PILL[full]) return INDUSTRY_PILL[full];
  // Fallback: take initials of first two words, or first 3 chars
  const parts = full.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return full.slice(0, 3).toUpperCase();
}

export default function Sidebar({ activePage }: SidebarProps) {
  // Theme: read from DOM (set by blocking script in layout.tsx before hydrate).
  // Mirrors the original Sidebar pattern - state would cause flicker.
  const [, setThemeKey] = useState(0);
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  const [userName, setUserName] = useState(() => {
    if (typeof window === 'undefined') return { first: '', last: '', email: '' };
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        return { first: p.firstName || '', last: p.lastName || '', email: p.email || '' };
      }
    } catch {}
    return { first: '', last: '', email: '' };
  });

  const [industryPill, setIndustryPill] = useState(() => {
    if (typeof window === 'undefined') return 'IB';
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        const target = Array.isArray(p.targetRoles) && p.targetRoles.length > 0 ? p.targetRoles[0] : '';
        return abbreviateIndustry(target);
      }
    } catch {}
    return 'IB';
  });

  // Plan from Convex-backed hook. Source of truth, side-effects to localStorage.
  // Same one-time-fetch pattern as original Sidebar - no live blob subscription.
  const userPlan = useUserPlan();

  const [profilePic, setProfilePic] = useState(() => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem('offerbell_profile_pic') || null; } catch { return null; }
  });
  const updateProfileMut = useMutation((api as any).users?.updateUserProfile);
  const picInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Refresh username/industry on storage changes (e.g. user edits profile elsewhere)
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        if (raw) {
          const p = JSON.parse(raw);
          setUserName({ first: p.firstName || '', last: p.lastName || '', email: p.email || '' });
          const target = Array.isArray(p.targetRoles) && p.targetRoles.length > 0 ? p.targetRoles[0] : '';
          setIndustryPill(abbreviateIndustry(target));
        }
      } catch {}
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'offerbell_onboarding_profile') refresh();
    };
    window.addEventListener('storage', onStorage);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Close mobile sidebar on route change.
  useEffect(() => { setMobileOpen(false); setMenuOpen(false); }, [pathname]);

  // Click-outside close for profile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  // Body scroll lock when mobile menu open.
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const displayName = (userName.first + ' ' + userName.last).trim() || 'User';
  const displayInitials = ((userName.first[0] || '') + (userName.last[0] || '')).toUpperCase() || 'U';

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('offerbell-theme', next); } catch {}
    setThemeKey(k => k + 1);
  }

  function handlePicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 128, 128);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfilePic(dataUrl);
        try { localStorage.setItem('offerbell_profile_pic', dataUrl); } catch {}
        // Persist to users table so it survives reload.
        try {
          const uid = localStorage.getItem('offerbell_user_id') || '';
          if (uid && updateProfileMut) void updateProfileMut({ userId: uid, profilePic: dataUrl });
        } catch {}
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function signOut() {
    // Same logic as the original Sidebar: clear all offerbell_* keys except theme,
    // remove userId, expire the cookie, hard navigate to home.
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('offerbell') && k !== 'offerbell-theme') keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('userId');
    document.cookie = 'offerbell_user_id=; path=/; max-age=0';
    window.location.href = '/';
  }

  // Helper to compute active state class
  const cls = (page: string) => `ob-side-item${activePage === page ? ' active' : ''}`;

  const planLabel = userPlan === 'elite' ? 'Elite plan' : userPlan === 'pro' ? 'Pro plan' : 'Free plan';
  const planColor = userPlan === 'elite' ? '#3b82f6' : userPlan === 'pro' ? '#22c55e' : '#9ca3af';

  return (
    <>
      {/* Mobile hamburger - hidden by default, shown via CSS on small screens */}
      <button
        className="ob-mobile-hamburger"
        onClick={() => setMobileOpen(true)}
        type="button"
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      {mobileOpen && <div className="ob-mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`ob-side${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        {/* Header: logo + collapse button */}
        <div className="ob-side-head">
          <Link href="/dashboard" className="ob-side-brand">
            <div className="ob-side-brand-mark">
              <Image
                src="/offerbell-logo.jpeg"
                alt="OfferBell"
                width={30}
                height={30}
                priority
                unoptimized
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
              />
            </div>
            <span className="ob-side-brand-text">OfferBell</span>
          </Link>
          <button
            className="ob-side-collapse"
            onClick={() => setCollapsed(c => !c)}
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12C2 8.31 2 6.47 2.81 5.16C3.11 4.68 3.49 4.25 3.92 3.92C5.08 3 6.72 3 10 3H14C17.28 3 18.92 3 20.08 3.92C20.51 4.25 20.89 4.68 21.19 5.16C22 6.47 22 8.31 22 12C22 15.69 22 17.53 21.19 18.84C20.89 19.32 20.51 19.75 20.08 20.08C18.92 21 17.28 21 14 21H10C6.72 21 5.08 21 3.92 20.08C3.49 19.75 3.11 19.32 2.81 18.84C2 17.53 2 15.69 2 12Z"/>
              <path d="M9.5 3L9.5 21" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <nav className="ob-side-nav">
          {/* Dashboard alone at top - no group label */}
          <div className="ob-side-group">
            <div className="ob-side-item-list">
              <Link className={cls('dashboard')} href="/dashboard">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          <div className="ob-side-group">
            <span className="ob-side-group-label">Learn</span>
            <div className="ob-side-item-list">
              <Link className={cls('learn')} href="/learn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span>Learning Hub</span>
              </Link>
              <Link className={cls('concept-drills')} href="/concept-drills">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Concept Drills</span>
              </Link>
              <Link className={cls('reps')} href="/reps">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>The Desk</span>
              </Link>
            </div>
          </div>

          <div className="ob-side-group">
            <span className="ob-side-group-label">Prep</span>
            <div className="ob-side-item-list">
              <Link className={cls('coach')} href="/coach">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Coach</span>
              </Link>
              <Link className={cls('flashcards')} href="/flashcards">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
                <span>Interview Flashcards</span>
              </Link>
              <Link className={cls('mock-interview')} href="/mock-interview">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                <span>Mock Interview</span>
              </Link>
            </div>
          </div>

          <div className="ob-side-group">
            <span className="ob-side-group-label">Networking</span>
            <div className="ob-side-item-list">
              <Link className={cls('outreach-tracker')} href="/outreach-tracker">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <span>Outreach Tracker</span>
              </Link>
              <Link className={cls('outreach-writer')} href="/outreach-writer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Outreach Writer</span>
              </Link>
              <Link className={cls('referral-map')} href="/referral-map">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M5 9v3a4 4 0 0 0 4 4h2"/><path d="M19 9v3a4 4 0 0 1-4 4h-2"/></svg>
                <span>Referral Map</span>
              </Link>
            </div>
          </div>

          <div className="ob-side-group">
            <span className="ob-side-group-label">Insights</span>
            <div className="ob-side-item-list">
              <Link className={cls('resume-review')} href="/resume-review">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                <span>Resume Review</span>
              </Link>
              <Link className={cls('diagnostic-review')} href="/diagnostic-review">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <span>Diagnostic Review</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Industry pill in footer (above profile) */}
        <div className="ob-side-foot">
          <Link href="/my-account" className="ob-industry-row" title="Change in account settings">
            <span className="ob-industry-lbl">Industry</span>
            <span className="ob-industry-pill">{industryPill}</span>
          </Link>
        </div>

        {/* Profile section with dropdown */}
        <div className="ob-profile-section" ref={menuRef}>
          {menuOpen && (
            <div className="ob-profile-menu">
              <div className="ob-pm-head">
                <div className="ob-pm-name">
                  {displayName}
                  {(userPlan === 'pro' || userPlan === 'elite') && (
                    <span className="ob-pm-plan-tag" style={{ color: planColor, borderColor: planColor }}>{planLabel}</span>
                  )}
                </div>
                <div className="ob-pm-email">{userName.email || 'No email on file'}</div>
              </div>
              {userPlan !== 'elite' && (
                <Link className="ob-pm-item ob-pm-item-accent" href="/checkout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Upgrade to Elite
                </Link>
              )}
              <Link className="ob-pm-item" href="/my-account">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
                Settings
              </Link>
              <button
                className="ob-pm-item ob-pm-item-toggle"
                type="button"
                onClick={(e) => { e.preventDefault(); toggleTheme(); }}
              >
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
                Dark mode
                <span className="ob-pm-spacer" />
                <span className={`ob-pm-switch${isDark ? ' on' : ''}`}><span className="ob-pm-switch-knob" /></span>
              </button>
              <Link className="ob-pm-item" href="/feedback">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Report a Bug
              </Link>
              <button className="ob-pm-item" type="button" onClick={signOut}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            </div>
          )}

          <button
            className={`ob-profile-trigger${menuOpen ? ' open' : ''}`}
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          >
            <input
              ref={picInputRef}
              type="file"
              accept="image/*"
              onChange={handlePicUpload}
              style={{ display: 'none' }}
            />
            <span
              className="ob-avatar"
              onClick={(e) => { e.stopPropagation(); picInputRef.current?.click(); }}
              title="Click avatar to change photo"
              style={{ cursor: 'pointer' }}
            >
              {profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', display: 'block' }} />
              ) : displayInitials}
            </span>
            <span className="ob-pname">{displayName}</span>
            <svg className="ob-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </aside>

      {/* All sidebar styles scoped via .ob-* classnames so we don't conflict
          with old .sidebar/.nav-item styles still in contact-finder.css and
          dashboard.css. Self-contained, so the sidebar looks identical on
          every page regardless of which page-specific CSS is imported. */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --ob-sidebar-w: 230px; }
        .ob-side {
          position: fixed; top: 0; left: 0;
          width: var(--ob-sidebar-w);
          height: 100vh;
          background: #151618;
          color: #f4f5f8;
          display: flex; flex-direction: column;
          z-index: 50;
          font-family: 'Inter', 'Sora', system-ui, -apple-system, sans-serif;
          transition: width 0.2s ease;
        }
        .ob-side.collapsed { width: 60px; }

        .ob-side a, .ob-side button { font-family: inherit; }
        .ob-side svg { display: block; }

        /* Header (logo + collapse) */
        .ob-side-head {
          padding: 12px 16px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px;
          flex-shrink: 0;
        }
        .ob-side-brand {
          display: flex; align-items: center; gap: 12px;
          color: #f4f5f8; text-decoration: none;
          overflow: hidden; min-width: 0;
        }
        .ob-side-brand-mark {
          width: 30px; height: 30px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          background: #1f2024;
          display: flex; align-items: center; justify-content: center;
        }
        .ob-side-brand-text {
          font-size: 17px; font-weight: 600; letter-spacing: -0.3px;
          white-space: nowrap;
        }
        .ob-side.collapsed .ob-side-brand-text { display: none; }
        .ob-side.collapsed .ob-side-brand { gap: 0; }
        .ob-side.collapsed .ob-side-head { justify-content: center; }
        .ob-side-collapse {
          background: transparent; border: none; color: #f4f5f8;
          width: 30px; height: 30px;
          border-radius: 7px;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          padding: 6px;
          transition: background 0.12s;
        }
        .ob-side-collapse:hover { background: rgba(255,255,255,0.06); }
        .ob-side.collapsed .ob-side-collapse { display: none; }

        /* Nav */
        .ob-side-nav {
          flex: 1 1 auto;
          padding: 8px 0;
          min-height: 0;
          overflow-y: auto; overflow-x: hidden;
          scrollbar-width: none;
        }
        .ob-side-nav::-webkit-scrollbar { display: none; }

        .ob-side-group { margin-bottom: 14px; }
        .ob-side-group:last-child { margin-bottom: 0; }

        .ob-side-group-label {
          display: block;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #f4f5f8;
          padding: 0 16px;
          margin-bottom: 6px;
        }
        .ob-side.collapsed .ob-side-group-label { display: none; }

        .ob-side-item-list { display: flex; flex-direction: column; gap: 2px; }

        .ob-side-item {
          display: flex; align-items: center;
          gap: 10px;
          padding: 7px 14px;
          margin: 0 8px;
          border-radius: 8px;
          color: #f4f5f8;
          text-decoration: none;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.02em;
          min-height: 36px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s;
        }
        .ob-side-item:hover { background: rgba(255,255,255,0.05); }
        .ob-side-item.active { background: rgba(255,255,255,0.10); font-weight: 500; }
        .ob-side-item svg { width: 18px; height: 18px; flex-shrink: 0; stroke-width: 1.5; }
        .ob-side.collapsed .ob-side-item { justify-content: center; padding: 7px 0; margin: 0 8px; }
        .ob-side.collapsed .ob-side-item span { display: none; }

        /* Foot: industry pill */
        .ob-side-foot {
          padding: 4px 16px 8px;
          flex-shrink: 0;
          border-top: 0.5px solid rgba(255,255,255,0.05);
        }
        .ob-industry-row {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.05);
          padding: 6px 12px;
          border-radius: 8px;
          gap: 10px;
          text-decoration: none;
          transition: background 0.12s;
        }
        .ob-industry-row:hover { background: rgba(255,255,255,0.10); }
        .ob-industry-lbl { font-size: 12px; color: #f4f5f8; }
        .ob-industry-pill {
          background: #3b82f6; color: #fff;
          font-size: 11px; font-weight: 500;
          padding: 2px 8px;
          border-radius: 999px;
          min-width: 28px; text-align: center;
        }
        .ob-side.collapsed .ob-industry-row { justify-content: center; padding: 6px 0; }
        .ob-side.collapsed .ob-industry-lbl { display: none; }

        /* Profile section */
        .ob-profile-section {
          padding: 8px 16px;
          border-top: 0.5px solid rgba(255,255,255,0.05);
          position: relative;
          flex-shrink: 0;
        }
        .ob-profile-trigger {
          display: flex; align-items: center;
          gap: 8px;
          padding: 8px;
          background: rgba(255,255,255,0.03);
          border: 0.5px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          color: #f4f5f8;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.12s;
        }
        .ob-profile-trigger:hover { background: rgba(255,255,255,0.08); }
        .ob-avatar {
          width: 28px; height: 28px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          color: #f4f5f8;
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 500;
          flex-shrink: 0;
          overflow: hidden;
        }
        .ob-pname {
          flex: 1; min-width: 0;
          font-size: 12px; font-weight: 500;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ob-chev {
          color: rgba(255,255,255,0.5);
          width: 14px; height: 14px;
          transition: transform 0.2s;
        }
        .ob-profile-trigger.open .ob-chev { transform: rotate(180deg); }
        .ob-side.collapsed .ob-profile-trigger { justify-content: center; padding: 4px 0; background: transparent; border: none; }
        .ob-side.collapsed .ob-pname,
        .ob-side.collapsed .ob-chev { display: none; }

        /* Profile dropdown menu */
        .ob-profile-menu {
          position: absolute;
          bottom: calc(100% - 4px);
          left: 16px; right: 16px;
          background: #1f2024;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 5px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
          z-index: 60;
        }
        .ob-pm-head {
          padding: 8px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 4px;
        }
        .ob-pm-name {
          font-size: 13px; font-weight: 600; color: #f4f5f8;
          display: flex; align-items: center; gap: 6px;
        }
        .ob-pm-plan-tag {
          display: inline-block;
          font-size: 9px; font-weight: 600;
          padding: 1px 5px;
          border: 1px solid currentColor;
          border-radius: 4px;
          letter-spacing: 0.04em; text-transform: uppercase;
          line-height: 1.2;
        }
        .ob-pm-email {
          font-size: 11px; color: rgba(244,245,248,0.5);
          margin-top: 2px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .ob-pm-item {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 10px;
          border-radius: 6px;
          color: #f4f5f8;
          text-decoration: none;
          font-size: 13px; font-weight: 400;
          cursor: pointer;
          background: transparent; border: none;
          width: 100%; text-align: left;
        }
        .ob-pm-item:hover { background: rgba(255,255,255,0.08); }
        .ob-pm-item svg { width: 15px; height: 15px; flex-shrink: 0; color: rgba(244,245,248,0.7); }
        .ob-pm-item-accent { color: #fbbf24; font-weight: 500; }
        .ob-pm-item-accent svg { color: #fbbf24; }
        .ob-pm-spacer { flex: 1; }
        .ob-pm-switch {
          width: 28px; height: 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          position: relative;
          transition: background 0.15s;
          flex-shrink: 0;
          display: inline-block;
        }
        .ob-pm-switch.on { background: #3b82f6; }
        .ob-pm-switch-knob {
          position: absolute;
          top: 2px; left: 2px;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.15s;
        }
        .ob-pm-switch.on .ob-pm-switch-knob { transform: translateX(12px); }

        /* Mobile hamburger - hidden by default */
        .ob-mobile-hamburger {
          display: none;
          position: fixed; top: 12px; left: 12px;
          width: 40px; height: 40px;
          background: #151618; color: #f4f5f8;
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          align-items: center; justify-content: center;
          cursor: pointer;
          z-index: 45;
        }
        .ob-mobile-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 49;
        }

        @media (max-width: 768px) {
          .ob-mobile-hamburger { display: flex; }
          .ob-side { transform: translateX(-100%); transition: transform 0.25s ease; }
          .ob-side.mobile-open { transform: translateX(0); }
          .ob-mobile-overlay { display: block; }
        }
      ` }} />
    </>
  );
}
