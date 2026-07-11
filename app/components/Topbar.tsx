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
  'Accounting & Audit': 'Aud',
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

type ObNavItem = { key: string; label: string; href: string };
const NAV_SECTIONS: Record<string, { label: string; items: ObNavItem[] }> = {
  learn: { label: 'Learn', items: [
    { key: 'learn', label: 'Learning Hub', href: '/learn' },
    { key: 'coach', label: 'Coach', href: '/coach' },
    { key: 'reps', label: 'The Desk', href: '/reps' },
  ] },
  prep: { label: 'Prep', items: [
    { key: 'concept-drills', label: 'Concept Drills', href: '/concept-drills' },
    { key: 'flashcards', label: 'Interview Flashcards', href: '/flashcards' },
    { key: 'mock-interview', label: 'Mock Interview', href: '/mock-interview' },
  ] },
  networking: { label: 'Networking', items: [
    { key: 'outreach-tracker', label: 'Outreach Tracker', href: '/outreach-tracker' },
    { key: 'outreach-writer', label: 'Outreach Writer', href: '/outreach-writer' },
    { key: 'referral-map', label: 'Referral Map', href: '/referral-map' },
  ] },
  insights: { label: 'Insights', items: [
    { key: 'resume-review', label: 'Resume Review', href: '/resume-review' },
    { key: 'diagnostic-review', label: 'Diagnostic Review', href: '/diagnostic-review' },
  ] },
};
const SECTION_ORDER = ['learn', 'prep', 'networking', 'insights'];
function sectionOf(page: string): string | null {
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

  // Which section's sub-tab bar is showing. Defaults to the section of the current page.
  const [openSection, setOpenSection] = useState<string | null>(() => sectionOf(activePage));
  useEffect(() => { setOpenSection(sectionOf(activePage)); }, [activePage]);
  // Zero the left offset; publish the fixed-header height (taller when a sub-tab bar shows).
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-w', '0px');
    document.documentElement.style.setProperty('--topbar-h', openSection ? '104px' : '56px');
    return () => { document.documentElement.style.setProperty('--topbar-h', '0px'); };
  }, [openSection]);

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
          setIndustryPill(abbreviateIndustry(target));
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
      setIndustryPill(abbreviateIndustry(v));
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

  const sub = openSection ? NAV_SECTIONS[openSection] : null;

  return (
    <>
      <header className="ob-top">
        <div className="ob-top-inner">
          <Link href="/dashboard" className="ob-top-brand">
            <img src="/ob-logo.png" alt="OfferBell" className="ob-top-logo-img" />
          </Link>

          <nav className="ob-top-nav">
            <Link href="/dashboard" className={`ob-top-link${activePage === 'dashboard' ? ' active' : ''}`}>Dashboard</Link>
            <Link href="/ob" className={`ob-top-link${activePage === 'ob' ? ' active' : ''}`}>OB</Link>
            {SECTION_ORDER.map(key => (
              <button
                key={key}
                type="button"
                className={`ob-top-link ob-top-sect${openSection === key ? ' active' : ''}`}
                onClick={() => setOpenSection(key)}
              >
                {NAV_SECTIONS[key].label}
              </button>
            ))}
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
                <span className="ob-industry-pill">{industryPill}</span>
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
                <input ref={picInputRef} type="file" accept="image/*" onChange={handlePicUpload} style={{ display: 'none' }} />
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
                  <Link key={it.key} href={it.href} className={`ob-subtab${on ? ' active' : ''}`}>{it.label}</Link>
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
            <Link href="/dashboard" className="ob-md-link">Dashboard</Link>
            <Link href="/ob" className="ob-md-link">OB</Link>
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
        .ob-top{position:fixed;top:0;left:0;right:0;z-index:60;
          background:var(--surface,#ffffff);border-bottom:1px solid var(--border,#e7e5e2);font-family:inherit}
        html[data-theme="dark"] .ob-top{background:#14171c;border-bottom-color:#252b33}
        .ob-top-inner{height:56px;display:flex;align-items:center;gap:8px;padding:0 20px}
        .ob-top-brand{display:flex;align-items:center;text-decoration:none;margin-right:10px;flex:0 0 auto}
        .ob-top-logo-img{height:30px;width:auto;display:block}
        html[data-theme="dark"] .ob-top-logo-img{filter:drop-shadow(0 0 0.5px rgba(255,255,255,.9))}
        .ob-top-nav{display:flex;align-items:center;gap:4px}
        .ob-top-link{display:inline-flex;align-items:center;height:36px;padding:0 14px;border-radius:0;
          font-size:14px;font-weight:500;color:var(--text-2,#5b6169);text-decoration:none;background:none;border:1px solid transparent;
          cursor:pointer;white-space:nowrap;font-family:inherit;transition:background .12s,color .12s}
        .ob-top-link:hover{color:var(--text,#141414);background:var(--hover,#f4f4f5)}
        html[data-theme="dark"] .ob-top-link{color:#9aa2ad}
        html[data-theme="dark"] .ob-top-link:hover{color:#fff;background:#20262e}
        .ob-top-link.active{color:var(--text,#141414);background:var(--surface,#fff);font-weight:600;border-color:transparent;
          box-shadow:0 1px 2px rgba(16,24,40,.10),0 1px 3px rgba(16,24,40,.08)}
        html[data-theme="dark"] .ob-top-link.active{color:#fff;background:#20262e;box-shadow:0 1px 3px rgba(0,0,0,.5)}
        .ob-top-right{display:flex;align-items:center;gap:10px;margin-left:auto}

        /* sub-tab bar (like RecruitU Jobs/Events) */
        .ob-subbar{border-top:1px solid var(--border,#eeece9);background:var(--surface,#fff)}
        html[data-theme="dark"] .ob-subbar{background:#14171c;border-top-color:#20242b}
        .ob-subbar-inner{height:48px;display:flex;align-items:center;gap:4px;padding:0 20px 0 calc(20px + 40px)}
        .ob-subtab{display:inline-flex;align-items:center;height:34px;padding:0 15px;border-radius:0;font-size:13.5px;font-weight:500;
          color:var(--text-2,#5b6169);text-decoration:none;background:none;border:1px solid transparent;white-space:nowrap;transition:.12s}
        .ob-subtab:hover{color:var(--text,#141414);background:var(--hover,#f4f4f5)}
        .ob-subtab.active{color:var(--text,#141414);background:var(--surface,#fff);font-weight:600;
          box-shadow:0 1px 2px rgba(16,24,40,.10),0 1px 3px rgba(16,24,40,.08)}
        html[data-theme="dark"] .ob-subtab{color:#9aa2ad}
        html[data-theme="dark"] .ob-subtab:hover{color:#fff;background:#20262e}
        html[data-theme="dark"] .ob-subtab.active{color:#fff;background:#20262e;box-shadow:0 1px 3px rgba(0,0,0,.5)}

        /* industry switcher */
        .ob-top-industry{position:relative}
        .ob-industry-row{display:flex;align-items:center;gap:12px;height:40px;padding:0 10px 0 13px;border-radius:0;
          background:var(--hover,#f5f4f2);border:1px solid var(--border,#e7e5e2);cursor:pointer;font-family:inherit;transition:.12s}
        .ob-industry-row:hover,.ob-industry-row.open{border-color:var(--text-3,#c9c6c1);background:var(--surface,#fff)}
        html[data-theme="dark"] .ob-industry-row{background:#1b2028;border-color:#2a313b}
        html[data-theme="dark"] .ob-industry-row:hover,html[data-theme="dark"] .ob-industry-row.open{background:#20262e;border-color:#38414d}
        .ob-industry-text{display:flex;flex-direction:column;align-items:flex-start;line-height:1.05}
        .ob-industry-eyebrow{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--text-3,#9a9a9a)}
        .ob-industry-name{font-size:13px;font-weight:600;color:var(--text,#1c1c1c);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        html[data-theme="dark"] .ob-industry-name{color:#eef1f4}
        .ob-industry-pill{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:26px;padding:0 8px;
          border-radius:0;background:#141414;color:#fff;font-size:11px;font-weight:700;letter-spacing:.3px}
        html[data-theme="dark"] .ob-industry-pill{background:#eef1f4;color:#141414}
        .ob-industry-menu{position:absolute;top:calc(100% + 8px);right:0;width:288px;max-height:64vh;overflow:auto;z-index:75;
          background:var(--surface,#fff);border:1px solid var(--border,#e7e5e2);border-radius:2px;padding:6px;
          box-shadow:0 18px 44px -14px rgba(30,25,15,.30)}
        html[data-theme="dark"] .ob-industry-menu{background:#181c22;border-color:#272e37}
        .ob-industry-menu-head{font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-3,#9a9a9a);padding:9px 12px 7px}
        .ob-industry-menu-item{display:flex;align-items:center;width:100%;padding:11px 13px;border:none;border-radius:0;
          background:none;cursor:pointer;text-align:left;font-family:inherit;font-size:15px;font-weight:500;color:var(--text,#1c1c1c)}
        .ob-industry-menu-item:hover{background:var(--hover,#f4f4f5)}
        html[data-theme="dark"] .ob-industry-menu-item{color:#e9edf1}
        html[data-theme="dark"] .ob-industry-menu-item:hover{background:#222831}
        .ob-industry-menu-item.active{background:var(--hover,#f0efec);font-weight:600}
        html[data-theme="dark"] .ob-industry-menu-item.active{background:#232a33}

        .ob-top-icon{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:0;
          background:none;border:1px solid transparent;color:var(--text-2,#5b6169);cursor:pointer;transition:.12s}
        .ob-top-icon:hover{background:var(--hover,#f4f4f5);color:var(--text,#141414);border-color:var(--border,#e7e5e2)}
        html[data-theme="dark"] .ob-top-icon{color:#9aa2ad}
        html[data-theme="dark"] .ob-top-icon:hover{background:#20262e;color:#fff;border-color:#2f3742}

        .ob-profile-section{position:relative}
        .ob-profile-trigger{display:flex;align-items:center;gap:8px;height:40px;padding:0 9px 0 6px;border-radius:0;
          background:none;border:1px solid var(--border,#e7e5e2);cursor:pointer;font-family:inherit;transition:.12s}
        .ob-profile-trigger:hover,.ob-profile-trigger.open{background:var(--hover,#f5f4f2)}
        html[data-theme="dark"] .ob-profile-trigger{border-color:#2a313b}
        html[data-theme="dark"] .ob-profile-trigger:hover,html[data-theme="dark"] .ob-profile-trigger.open{background:#20262e}
        .ob-avatar{width:30px;height:30px;border-radius:50%;background:#141414;color:#fff;display:flex;align-items:center;justify-content:center;
          font-size:12px;font-weight:700;overflow:hidden;flex:0 0 auto}
        html[data-theme="dark"] .ob-avatar{background:#eef1f4;color:#141414}
        .ob-plan-chip{font-size:9.5px;font-weight:800;letter-spacing:.4px;text-transform:uppercase;padding:2px 7px;border-radius:0}
        .ob-plan-chip--pro{background:#fef3c7;color:#92600e}
        .ob-plan-chip--elite{background:#dbeafe;color:#1e40af}
        .ob-chev{width:15px;height:15px;color:var(--text-3,#9a9a9a)}
        .ob-profile-menu{position:absolute;top:calc(100% + 8px);right:0;width:252px;z-index:75;
          background:var(--surface,#fff);border:1px solid var(--border,#e7e5e2);border-radius:2px;padding:6px;
          box-shadow:0 18px 44px -14px rgba(30,25,15,.30)}
        html[data-theme="dark"] .ob-profile-menu{background:#181c22;border-color:#272e37}
        .ob-pm-head{padding:10px 11px 11px;border-bottom:1px solid var(--border,#eee);margin-bottom:5px}
        html[data-theme="dark"] .ob-pm-head{border-bottom-color:#272e37}
        .ob-pm-name{font-size:14px;font-weight:700;color:var(--text,#1c1c1c);display:flex;align-items:center;gap:8px}
        html[data-theme="dark"] .ob-pm-name{color:#fff}
        .ob-pm-plan-tag{font-size:9.5px;font-weight:700;letter-spacing:.3px;padding:2px 7px;border:1px solid;border-radius:0}
        .ob-pm-email{font-size:12px;color:var(--text-3,#9a9a9a);margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .ob-pm-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 11px;border:none;border-radius:0;background:none;
          cursor:pointer;text-align:left;font-family:inherit;font-size:13.5px;font-weight:500;color:var(--text-2,#4b5158);text-decoration:none}
        .ob-pm-item svg{width:16px;height:16px;flex:0 0 auto}
        .ob-pm-item:hover{background:var(--hover,#f4f4f5);color:var(--text,#141414)}
        html[data-theme="dark"] .ob-pm-item{color:#aab2bd}
        html[data-theme="dark"] .ob-pm-item:hover{background:#222831;color:#fff}
        .ob-pm-item-accent{color:#b4864a}
        .ob-pm-item-accent:hover{background:#f7efe2;color:#8a6232}

        .ob-top-burger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:0;
          background:none;border:none;color:var(--text,#141414);cursor:pointer}
        .ob-mobile-overlay{display:none}
        .ob-mobile-drawer{display:none}
        @media (max-width:900px){
          .ob-top-nav{display:none}
          .ob-subbar{display:none}
          .ob-top-industry .ob-industry-text{display:none}
          .ob-top-burger{display:flex}
          .ob-mobile-overlay{display:block;position:fixed;inset:0;background:rgba(15,15,15,.4);z-index:80}
          .ob-mobile-drawer{display:block;position:fixed;top:0;right:0;bottom:0;width:min(320px,86vw);z-index:81;overflow-y:auto;
            background:var(--surface,#fff);border-left:1px solid var(--border,#e7e5e2);padding:16px 16px 40px}
          html[data-theme="dark"] .ob-mobile-drawer{background:#14171c;border-left-color:#252b33}
          .ob-md-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
          .ob-md-close{background:none;border:none;font-size:17px;color:var(--text-3,#9a9a9a);cursor:pointer}
          .ob-md-nav,.ob-md-foot{display:flex;flex-direction:column;gap:2px}
          .ob-md-foot{margin-top:16px;padding-top:14px;border-top:1px solid var(--border,#eee)}
          html[data-theme="dark"] .ob-md-foot{border-top-color:#252b33}
          .ob-md-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--text-3,#9a9a9a);padding:12px 8px 5px}
          .ob-md-link{display:block;padding:11px 10px;border-radius:0;font-size:14.5px;font-weight:500;color:var(--text,#1c1c1c);
            text-decoration:none;background:none;border:none;text-align:left;cursor:pointer;font-family:inherit;width:100%}
          .ob-md-link:hover{background:var(--hover,#f4f4f5)}
          html[data-theme="dark"] .ob-md-link{color:#e9edf1}
          html[data-theme="dark"] .ob-md-link:hover{background:#222831}
          .ob-md-industry-list{display:flex;flex-direction:column;gap:2px;padding:4px 0 8px}
          .ob-md-ind{padding:10px 10px;border-radius:0;border:none;background:none;font-size:14px;font-weight:500;color:var(--text,#1c1c1c);text-align:left;cursor:pointer}
          .ob-md-ind.active{background:var(--hover,#f0efec);font-weight:600}
        }
      ` }} />
    </>
  );
}
