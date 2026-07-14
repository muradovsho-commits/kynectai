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

// Source of truth: app/my-account/page.tsx line 17 (the settings dropdown).
// Sidebar dropdown must show the same options the user sees in settings.
const VERTICALS = [
  'Investment Banking',
  'Private Equity',
  'Venture Capital',
  'Consulting',
  'Accounting & Audit',
  'Asset Management',
  'Sales & Trading',
  'Equity Research',
  'Real Estate',
  'Restructuring',
  'Growth Equity',
];

type ObNavItem = { key: string; label: string; href: string };
const NAV_SECTIONS: Record<string, { label: string; items: ObNavItem[] }> = {
  dashboard: { label: 'Home', items: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'ob', label: 'OB', href: '/ob' },
  ] },
  learn: { label: 'Learn', items: [
    { key: 'learn', label: 'Guides', href: '/learn' },
    { key: 'coach', label: 'Coach', href: '/coach' },
    { key: 'reps', label: 'The Desk', href: '/reps' },
  ] },
  prep: { label: 'Prep', items: [
    { key: 'concept-drills', label: 'Concept Drills', href: '/concept-drills' },
    { key: 'flashcards', label: 'Interview Flashcards', href: '/flashcards' },
    { key: 'mock-interview', label: 'Mock Interview', href: '/mock-interview' },
  ] },
  networking: { label: 'Network', items: [
    { key: 'outreach-tracker', label: 'Outreach Tracker', href: '/outreach-tracker' },
    { key: 'outreach-writer', label: 'Outreach Writer', href: '/outreach-writer' },
    { key: 'referral-map', label: 'Referral Map', href: '/referral-map' },
  ] },
  insights: { label: 'Insights', items: [
    { key: 'resume-review', label: 'Resume Review', href: '/resume-review' },
    { key: 'diagnostic-review', label: 'Diagnostic Review', href: '/diagnostic-review' },
  ] },
};
const SECTION_ORDER = ['dashboard', 'learn', 'prep', 'networking', 'insights'];
function sectionOf(page: string): string | null {
  if (['dashboard', 'ob'].includes(page)) return 'dashboard';
  if (['concept-drills', 'flashcards', 'mock-interview'].includes(page)) return 'prep';
  if (['outreach-tracker', 'outreach-writer', 'referral-map'].includes(page)) return 'networking';
  if (['resume-review', 'diagnostic-review'].includes(page)) return 'insights';
  if (['learn', 'coach', 'reps', 'interview-prep', 'recruiting-manual'].includes(page) || page.endsWith('-interview-prep')) return 'learn';
  return null;
}

export default function Topbar({ activePage }: SidebarProps) {
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

  const [currentVertical, setCurrentVertical] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        return (Array.isArray(p.targetRoles) && p.targetRoles[0]) || '';
      }
    } catch {}
    return '';
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('offerbell_sidebar_collapsed') === 'true'; }
    catch { return false; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Zero the left offset; publish the fixed-header height (taller when a sub-tab bar shows).
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', '0px');
    document.documentElement.style.setProperty('--topbar-h', sectionOf(activePage) ? '92px' : '48px');
    return () => { document.documentElement.style.setProperty('--topbar-h', '0px'); };
  }, [activePage]);

  const [industryMenuOpen, setIndustryMenuOpen] = useState(false);
  const industryMenuRef = useRef<HTMLDivElement>(null);

  // Refresh username/industry on storage changes (e.g. user edits profile elsewhere)
  // Plus a custom 'offerbell-profile-changed' event since same-window localStorage
  // updates don't trigger storage events (browsers only fire those for OTHER tabs).
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        if (raw) {
          const p = JSON.parse(raw);
          setUserName({ first: p.firstName || '', last: p.lastName || '', email: p.email || '' });
          const target = Array.isArray(p.targetRoles) && p.targetRoles.length > 0 ? p.targetRoles[0] : '';
          setCurrentVertical(target);
        }
      } catch {}
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'offerbell_onboarding_profile') refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('offerbell-profile-changed', refresh);
    window.addEventListener('offerbell-progress-hydrated', refresh);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('offerbell-profile-changed', refresh);
      window.removeEventListener('offerbell-progress-hydrated', refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  // Close mobile sidebar on route change.
  useEffect(() => { setMobileOpen(false); setMenuOpen(false); setIndustryMenuOpen(false); }, [pathname]);

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

  // Click-outside close for industry menu.
  useEffect(() => {
    if (!industryMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (industryMenuRef.current && !industryMenuRef.current.contains(e.target as Node)) {
        setIndustryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [industryMenuOpen]);

  function selectVertical(v: string): void {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      const p = raw ? JSON.parse(raw) : {};
      // Put selected vertical first; keep up to 2 others as secondary targets.
      const others = Array.isArray(p.targetRoles) ? p.targetRoles.filter((r: string) => r !== v).slice(0, 2) : [];
      const newTargets = [v, ...others];
      const updated = { ...p, targetRoles: newTargets };
      localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(updated));
      setCurrentVertical(v);
      setIndustryMenuOpen(false);
      // Notify other components in this same window (storage events only fire cross-tab).
      window.dispatchEvent(new CustomEvent('offerbell-profile-changed'));

      // Mirror the change to the Convex `users` table so My Account's Target Role
      // stays in sync. This is a single small mutation against a dedicated
      // table, NOT the userProgress.data blob, so it does not affect the
      // bandwidth pattern from the Capacity Reached V1 fix.
      try {
        const uid = localStorage.getItem('offerbell_user_id');
        if (uid && updateProfileMut) {
          void updateProfileMut({ userId: uid, targetRoles: newTargets });
        }
      } catch {}
    } catch {}
  }

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

  async function signOut() {
    // The tracker / referral / drills pages now write their Convex tables on
    // every edit, so there is nothing pending to flush at logout. The old flush
    // re-pushed localStorage here, which could overwrite newer server data (from
    // another device) with this device's stale copy - so it is gone.
    // Clear all offerbell_* keys except theme, remove userId, expire the
    // cookie, hard navigate to home.
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

  // Learning Hub stays highlighted while reading anything launched from it:
  // the IB guide, the 10 track guides, and the recruiting manual.
  const learnActive = activePage === 'learn'
    || activePage === 'interview-prep'
    || activePage.endsWith('-interview-prep')
    || activePage === 'recruiting-manual';

  const planLabel = userPlan === 'elite' ? 'Elite plan' : userPlan === 'pro' ? 'Pro plan' : 'Free plan';
  const planColor = userPlan === 'elite' ? '#3b82f6' : userPlan === 'pro' ? '#eab308' : '#9ca3af';

  const currentSection = sectionOf(activePage);
  const sub = currentSection ? NAV_SECTIONS[currentSection] : null;

  return (
    <>
      <header className="ob-top">
        <div className="ob-top-inner">
          <Link href="/dashboard" className="ob-top-brand">
            <img src="/ob-logo.png" alt="OfferBell" className="ob-top-logo-img" />
          </Link>

          <nav className="ob-top-nav">
            {SECTION_ORDER.map(key => {
              const items = NAV_SECTIONS[key].items;
              const navItem = (
                <div key={key} className="ob-top-navitem">
                  <Link
                    href={items[0].href}
                    data-tutorial={`nav-${key}`}
                    className={`ob-top-link ob-top-sect${currentSection === key ? ' active' : ''}`}
                  >
                    {NAV_SECTIONS[key].label}
                  </Link>
                  <div className="ob-top-dropdown" role="menu">
                    {items.map(it => (
                      <Link key={it.key} href={it.href} className={`ob-top-dd-item${activePage === it.key ? ' active' : ''}`}>{it.label}</Link>
                    ))}
                  </div>
                </div>
              );
              return key === 'learn'
                ? [<span key="div-home-learn" className="ob-top-divider" aria-hidden="true">|</span>, navItem]
                : navItem;
            })}
          </nav>

          <div className="ob-top-right">
            <div className="ob-top-industry" ref={industryMenuRef}>
              <button
                type="button"
                className={`ob-industry-row${industryMenuOpen ? ' open' : ''}`}
                onClick={() => setIndustryMenuOpen(o => !o)}
                title="Click to switch industry"
              >
                <div className="ob-industry-text">
                  <span className="ob-industry-eyebrow">Industry</span>
                  <span className="ob-industry-name">{currentVertical || 'Select'}</span>
                </div>
                <svg className="ob-industry-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {industryMenuOpen && (
                <div className="ob-industry-menu">
                  <div className="ob-industry-menu-head">Switch industry</div>
                  {VERTICALS.map(v => (
                    <button
                      key={v}
                      type="button"
                      className={`ob-industry-menu-item${v === currentVertical ? ' active' : ''}`}
                      onClick={() => selectVertical(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="ob-top-icon"
              onClick={(e) => { e.preventDefault(); toggleTheme(); }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <div className="ob-profile-section" ref={menuRef}>
              <button
                className={`ob-profile-trigger${menuOpen ? ' open' : ''}`}
                type="button"
                data-plan={userPlan}
                onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
              >
                <span className="ob-avatar">
                  {profilePic ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', display: 'block' }} />
                  ) : displayInitials}
                </span>
                {(userPlan === 'pro' || userPlan === 'elite') && (
                  <span className={`ob-plan-chip ob-plan-chip--${userPlan}`}>{userPlan === 'elite' ? 'Elite' : 'Pro'}</span>
                )}
                <svg className="ob-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
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
                    <Link className="ob-pm-item ob-pm-item-accent" href="/my-account">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      Manage plan
                    </Link>
                  )}
                  <Link className="ob-pm-item" href="/my-account">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
                    Settings
                  </Link>
                  <button className="ob-pm-item" type="button" onClick={() => { try { sessionStorage.setItem('offerbell_tutorial_replay', '1'); localStorage.setItem('offerbell_tutorial_step', '1'); } catch {} setMenuOpen(false); window.location.href = '/my-account'; }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    How do I use this site?
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
            </div>

            <button className="ob-top-burger" onClick={() => setMobileOpen(true)} type="button" aria-label="Open menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        {sub && (
          <div className="ob-subbar">
            <div className="ob-subbar-inner">
              {sub.items.map(it => {
                const on = activePage === it.key || (it.key === 'learn' && learnActive);
                return (
                  <Link key={it.key} href={it.href} data-tutorial={`subtab-${it.key}`} className={`ob-subtab${on ? ' active' : ''}`}>{it.label}</Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {mobileOpen && <div className="ob-mobile-overlay" onClick={() => setMobileOpen(false)} />}
      {mobileOpen && (
        <div className="ob-mobile-drawer">
          <div className="ob-md-head">
            <img src="/ob-logo.png" alt="OfferBell" className="ob-top-logo-img" />
            <button type="button" className="ob-md-close" onClick={() => setMobileOpen(false)} aria-label="Close">&#10005;</button>
          </div>
          <div className="ob-md-nav">
            {SECTION_ORDER.map(key => (
              <div key={key}>
                <div className="ob-md-label">{NAV_SECTIONS[key].label}</div>
                {NAV_SECTIONS[key].items.map(it => (
                  <Link key={it.key} href={it.href} className="ob-md-link">{it.label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="ob-md-foot">
            <div className="ob-md-label">Industry</div>
            <div className="ob-md-industry-list">
              {VERTICALS.map(v => (
                <button key={v} type="button" className={`ob-md-ind${v === currentVertical ? ' active' : ''}`} onClick={() => selectVertical(v)}>{v}</button>
              ))}
            </div>
            <button type="button" className="ob-md-link" onClick={() => { toggleTheme(); }}>{isDark ? 'Light mode' : 'Dark mode'}</button>
            <Link href="/my-account" className="ob-md-link">Settings</Link>
            <button type="button" className="ob-md-link" onClick={signOut}>Sign out</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .ob-top,.ob-top *{font-family:'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important}
        .ob-top{position:fixed;top:0;left:0;right:0;z-index:60;
          background:var(--surface,#ffffff);border-bottom:1px solid var(--border,#e5e7eb);font-family:inherit}
        html[data-theme="dark"] .ob-top{background:#1a1a19;border-bottom-color:#2a2a29}
        .ob-top-inner{height:48px;display:flex;align-items:center;gap:8px;padding:0 20px}
        .ob-top-brand{display:flex;align-items:center;text-decoration:none;margin-right:16px;flex:0 0 auto}
        .ob-top-logo-img{height:26px;width:auto;display:block}
        html[data-theme="dark"] .ob-top-logo-img{filter:drop-shadow(0 0 0.5px rgba(255,255,255,.9))}
        .ob-top-nav{display:flex;align-items:center;gap:2px}
        .ob-top-divider{display:flex;align-items:center;color:#cfcdc9;font-weight:300;font-size:15px;padding:0 8px;user-select:none;line-height:1}
        html[data-theme="dark"] .ob-top-divider{color:#3d3c39}
        .ob-top-navitem{position:relative;display:inline-flex}
        .ob-top-dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(4px);min-width:150px;background:#fff;border:1px solid #e8eaed;border-radius:9px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:5px;opacity:0;visibility:hidden;transition:opacity .14s ease,transform .14s ease,visibility .14s;z-index:60}
        .ob-top-dropdown::before{content:"";position:absolute;top:-9px;left:0;right:0;height:9px}
        .ob-top-navitem:hover .ob-top-dropdown{opacity:1;visibility:visible;transform:translateX(-50%) translateY(2px)}
        .ob-top-dd-item{display:block;padding:7px 12px;border-radius:5px;font-size:13px;font-weight:500;color:#475569;text-decoration:none;white-space:nowrap}
        .ob-top-dd-item:hover{background:#f1f5f9;color:#1d293d}
        .ob-top-dd-item.active{background:#f1f5f9;color:#1d293d;font-weight:600}
        html[data-theme="dark"] .ob-top-dropdown{background:#1a1a19;border-color:#2a2a29;box-shadow:0 10px 30px rgba(0,0,0,.55)}
        html[data-theme="dark"] .ob-top-dd-item{color:#a8a6a3}
        html[data-theme="dark"] .ob-top-dd-item:hover{background:#222221;color:#fff}
        html[data-theme="dark"] .ob-top-dd-item.active{background:#222221;color:#fff}
        .ob-top-link{display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:2px;
          font-size:13px;font-weight:500;color:#62748e;text-decoration:none;background:none;border:none;
          cursor:pointer;white-space:nowrap;font-family:inherit;transition:background .12s,color .12s}
        .ob-top-link:hover{color:#1d293d;background:#f8fafc}
        html[data-theme="dark"] .ob-top-link{color:#a8a6a3}
        html[data-theme="dark"] .ob-top-link:hover{color:#fff;background:#222221}
        .ob-top-link.active{color:#1d293d;background:#f1f5f9;font-weight:500}
        html[data-theme="dark"] .ob-top-link.active{color:#fff;background:#222221}
        .ob-top-right{display:flex;align-items:center;gap:8px;margin-left:auto}

        /* sub-tab bar */
        .ob-subbar{border-top:1px solid var(--border,#eef0f2);background:var(--surface,#fff)}
        html[data-theme="dark"] .ob-subbar{background:#1a1a19;border-top-color:#2a2a29}
        .ob-subbar-inner{height:44px;display:flex;align-items:center;gap:2px;padding:0 20px 0 58px}
        .ob-subtab{display:inline-flex;align-items:center;height:30px;padding:0 13px;border-radius:2px;font-size:13px;font-weight:500;
          color:#62748e;text-decoration:none;background:none;border:none;white-space:nowrap;transition:.12s}
        .ob-subtab:hover{color:#1d293d;background:#f8fafc}
        .ob-subtab.active{color:#1d293d;background:#f1f5f9;font-weight:500}
        html[data-theme="dark"] .ob-subtab{color:#a8a6a3}
        html[data-theme="dark"] .ob-subtab:hover{color:#fff;background:#222221}
        html[data-theme="dark"] .ob-subtab.active{color:#fff;background:#222221}

        /* industry switcher */
        .ob-top-industry{position:relative}
        .ob-industry-row{display:flex;align-items:center;gap:8px;height:34px;padding:0 9px 0 12px;border-radius:2px;
          background:none;border:1px solid var(--border,#e5e7eb);cursor:pointer;font-family:inherit;transition:.12s}
        .ob-industry-row:hover,.ob-industry-row.open{background:#f8fafc;border-color:#cad5e2}
        html[data-theme="dark"] .ob-industry-row{border-color:#2a2a29}
        html[data-theme="dark"] .ob-industry-row:hover,html[data-theme="dark"] .ob-industry-row.open{background:#222221;border-color:#3a3a39}
        .ob-industry-text{display:flex;flex-direction:column;align-items:flex-start;line-height:1.05}
        .ob-industry-eyebrow{font-size:8.5px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#90a1b9}
        .ob-industry-name{font-size:12.5px;font-weight:600;color:#1d293d;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        html[data-theme="dark"] .ob-industry-name{color:#f0efed}
        .ob-industry-caret{width:14px;height:14px;color:#90a1b9;flex:0 0 auto}
        .ob-industry-row.open .ob-industry-caret{transform:rotate(180deg)}
        .ob-industry-menu{position:absolute;top:calc(100% + 4px);right:0;width:264px;max-height:64vh;overflow:auto;z-index:75;
          background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:2px;padding:5px;
          box-shadow:0 12px 32px -10px rgba(15,23,42,.22)}
        html[data-theme="dark"] .ob-industry-menu{background:#222221;border-color:#2a2a29}
        .ob-industry-menu-head{font-size:10px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:#90a1b9;padding:8px 11px 6px}
        .ob-industry-menu-item{display:flex;align-items:center;width:100%;padding:9px 11px;border:none;border-radius:2px;
          background:none;cursor:pointer;text-align:left;font-family:inherit;font-size:13.5px;font-weight:500;color:#314158}
        .ob-industry-menu-item:hover{background:#f8fafc;color:#1d293d}
        html[data-theme="dark"] .ob-industry-menu-item{color:#d6d4d1}
        html[data-theme="dark"] .ob-industry-menu-item:hover{background:#222221;color:#fff}
        .ob-industry-menu-item.active{background:#f1f5f9;color:#1d293d;font-weight:600}
        html[data-theme="dark"] .ob-industry-menu-item.active{background:#2a2a29;color:#fff}

        .ob-top-icon{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:2px;order:1;
          background:none;border:1px solid transparent;color:#62748e;cursor:pointer;transition:.12s}
        .ob-top-icon:hover{background:#f8fafc;color:#1d293d}
        html[data-theme="dark"] .ob-top-icon{color:#a8a6a3}
        html[data-theme="dark"] .ob-top-icon:hover{background:#222221;color:#fff}

        .ob-profile-section{position:relative}
        .ob-profile-trigger{display:flex;align-items:center;gap:7px;height:34px;padding:0 8px 0 5px;border-radius:2px;
          background:none;border:1px solid var(--border,#e5e7eb);cursor:pointer;font-family:inherit;transition:.12s}
        .ob-profile-trigger:hover,.ob-profile-trigger.open{background:#f8fafc}
        html[data-theme="dark"] .ob-profile-trigger{border-color:#2a2a29}
        html[data-theme="dark"] .ob-profile-trigger:hover,html[data-theme="dark"] .ob-profile-trigger.open{background:#222221}
        .ob-avatar{width:28px;height:28px;border-radius:50%;background:#1d293d;color:#fff;display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;overflow:hidden;flex:0 0 auto}
        html[data-theme="dark"] .ob-avatar{background:#f0efed;color:#141414}
        .ob-plan-chip{font-size:9px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:2px 6px;border-radius:2px}
        .ob-plan-chip--pro{background:#fef3c7;color:#92600e}
        .ob-plan-chip--elite{background:#dbeafe;color:#1e40af}
        .ob-chev{width:14px;height:14px;color:#90a1b9}
        .ob-profile-menu{position:absolute;top:calc(100% + 4px);right:0;width:244px;z-index:75;
          background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:2px;padding:5px;
          box-shadow:0 12px 32px -10px rgba(15,23,42,.22)}
        html[data-theme="dark"] .ob-profile-menu{background:#222221;border-color:#2a2a29}
        .ob-pm-head{padding:9px 11px 10px;border-bottom:1px solid #eef0f2;margin-bottom:4px}
        html[data-theme="dark"] .ob-pm-head{border-bottom-color:#2a2a29}
        .ob-pm-name{font-size:13.5px;font-weight:700;color:#1d293d;display:flex;align-items:center;gap:8px}
        html[data-theme="dark"] .ob-pm-name{color:#fff}
        .ob-pm-plan-tag{font-size:9px;font-weight:700;letter-spacing:.3px;padding:2px 6px;border:1px solid;border-radius:2px}
        .ob-pm-email{font-size:11.5px;color:#90a1b9;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ob-pm-item{display:flex;align-items:center;gap:10px;width:100%;padding:8px 11px;border:none;border-radius:2px;background:none;
          cursor:pointer;text-align:left;font-family:inherit;font-size:13px;font-weight:500;color:#45556c;text-decoration:none}
        .ob-pm-item svg{width:15px;height:15px;flex:0 0 auto}
        .ob-pm-item:hover{background:#f8fafc;color:#1d293d}
        html[data-theme="dark"] .ob-pm-item{color:#a8a6a3}
        html[data-theme="dark"] .ob-pm-item:hover{background:#222221;color:#fff}
        .ob-pm-item-accent{color:#b4864a}
        .ob-pm-item-accent:hover{background:#f7efe2;color:#8a6232}

        .ob-top-burger{display:none;align-items:center;justify-content:center;width:38px;height:38px;border-radius:2px;
          background:none;border:none;color:#1d293d;cursor:pointer}
        .ob-mobile-overlay{display:none}
        .ob-mobile-drawer{display:none}
        @media (max-width:900px){
          .ob-top-nav{display:none}
          .ob-subbar{display:none}
          .ob-top-industry .ob-industry-text{display:none}
          .ob-top-burger{display:flex}
          .ob-mobile-overlay{display:block;position:fixed;inset:0;background:rgba(15,23,42,.4);z-index:80}
          .ob-mobile-drawer{display:block;position:fixed;top:0;right:0;bottom:0;width:min(320px,86vw);z-index:81;overflow-y:auto;
            background:var(--surface,#fff);border-left:1px solid var(--border,#e5e7eb);padding:16px 16px 40px}
          html[data-theme="dark"] .ob-mobile-drawer{background:#1a1a19;border-left-color:#2a2a29}
          .ob-md-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
          .ob-md-close{background:none;border:none;font-size:17px;color:#90a1b9;cursor:pointer}
          .ob-md-nav,.ob-md-foot{display:flex;flex-direction:column;gap:2px}
          .ob-md-foot{margin-top:16px;padding-top:14px;border-top:1px solid #eef0f2}
          html[data-theme="dark"] .ob-md-foot{border-top-color:#2a2a29}
          .ob-md-label{font-size:10px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:#90a1b9;padding:12px 8px 5px}
          .ob-md-link{display:block;padding:10px 10px;border-radius:2px;font-size:14px;font-weight:500;color:#1d293d;
            text-decoration:none;background:none;border:none;text-align:left;cursor:pointer;font-family:inherit;width:100%}
          .ob-md-link:hover{background:#f8fafc}
          html[data-theme="dark"] .ob-md-link{color:#f0efed}
          html[data-theme="dark"] .ob-md-link:hover{background:#222221}
          .ob-md-industry-list{display:flex;flex-direction:column;gap:2px;padding:4px 0 8px}
          .ob-md-ind{padding:9px 10px;border-radius:2px;border:none;background:none;font-size:13.5px;font-weight:500;color:#314158;text-align:left;cursor:pointer}
          .ob-md-ind.active{background:#f1f5f9;color:#1d293d;font-weight:600}
        }
      ` }} />
    </>
  );
}
