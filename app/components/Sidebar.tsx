'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserPlan } from '../lib/usePlan';

interface SidebarProps {
  activePage: string;
}

// Reads localStorage for the user's plan as the primary source. Once per
// mount, also fetches from the DB via a one-time HTTP call to refresh the
// cache - this catches plan changes from webhooks (cancellations, tier
// changes, payment failures) without using a live useQuery subscription
// that re-receives the entire user record on every system-wide write.
//
// Trade-off: a plan change that lands while the user is sitting on a
// non-/my-account page will not appear until they navigate. Plan changes
// happen rarely and almost always involve a navigation anyway, so this
// trades a tiny UX edge case for a roughly 10× bandwidth reduction.

export default function Sidebar({ activePage }: SidebarProps) {
  // Dark mode: read from DOM, not state. The blocking <script> in layout.tsx
  // already sets data-theme="dark" before React hydrates, so the DOM is the
  // source of truth. Using React state causes flicker on navigation.
  const [darkKey, setDarkKey] = useState(0);
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  const [userName, setUserName] = useState(() => {
    if (typeof window === 'undefined') return { first: '', last: '' };
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); return { first: p.firstName || '', last: p.lastName || '' }; }
    } catch {}
    return { first: '', last: '' };
  });
  // Plan comes from the Convex-backed hook. The hook:
  //   • Reads users.plan from Convex (Stripe webhook is the source of truth)
  //   • Reactively re-renders if the plan changes mid-session
  //   • Side effect: writes the verified plan to localStorage.offerbell_plan
  //     so legacy pages that read localStorage directly converge on the
  //     same value within ~200ms of page load. Since Sidebar mounts on
  //     every authenticated page, this means localStorage is always in
  //     sync with Convex on every page in the app.
  const userPlan = useUserPlan();

  const [messagesSent, setMessagesSent] = useState(() => {
    if (typeof window === 'undefined') return 0;
    try { return parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10); } catch { return 0; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(() => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem('offerbell_profile_pic') || null; } catch { return null; }
  });
  const picInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Convex is the source of truth for plan (see the first useEffect
    // above, which fetches u.plan and sets localStorage from it). The old
    // v2 migration that read localStorage and auto-promoted 'pro' to
    // 'elite' was removed - it kept reviving Elite for users who'd been
    // demoted, and a one-off DB backfill is the right way to handle
    // legacy pro users now.
    //
    // Keep message count in sync
    const refresh = () => { try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {} };
    const onStorage = (e: StorageEvent) => { if (e.key === 'offerbell_messages_sent') refresh(); };
    window.addEventListener('storage', onStorage);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    const interval = setInterval(refresh, 2000);
    return () => { window.removeEventListener('storage', onStorage); document.removeEventListener('visibilitychange', onVisible); clearInterval(interval); };
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
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
    localStorage.setItem('offerbell-theme', next);
    setDarkKey(k => k + 1);
  }

  function handlePicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
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
        localStorage.setItem('offerbell_profile_pic', dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  const cls = (page: string) => `nav-item${activePage === page ? ' active' : ''}`;

  return (
    <>
      <button className="mobile-hamburger" onClick={() => setMobileOpen(true)} type="button" aria-label="Open menu"
        style={{ display: 'none' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar-top-row">
          <div className="sidebar-logo"><Link href="/my-account" style={{color:'inherit',textDecoration:'none'}}>OfferBell<em>.</em></Link></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} type="button" aria-label="Close menu"
            style={{ display: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="sidebar-user">
          <div style={{position:'relative'}}>
            <input
              ref={picInputRef}
              type="file"
              accept="image/*"
              onChange={handlePicUpload}
              style={{ display: 'none' }}
            />
            <div
              className="user-avi"
              onClick={() => picInputRef.current?.click()}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
              }}
              title="Click to change photo"
            >
              {profilePic ? (
                <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit', display: 'block' }} />
              ) : (
                displayInitials
              )}
            </div>
            {(userPlan === 'pro' || userPlan === 'elite') && <div style={{position:'absolute',bottom:-1,right:-1,width:12,height:12,borderRadius:'50%',background: userPlan === 'elite' ? '#2563eb' : '#16a34a',border:'2px solid var(--surface)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="7" height="7" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            </div>}
          </div>
          <div><div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{displayName}</div><div style={{fontSize:11,color: userPlan === 'elite' ? '#2563eb' : userPlan === 'pro' ? '#16a34a' : 'var(--text-3)',fontWeight: userPlan !== 'free' ? 600 : 400}}>{userPlan === 'elite' ? 'Elite plan' : userPlan === 'pro' ? 'Pro plan' : 'Free plan'}</div></div>
          <button
            onClick={() => {
              const keys: string[] = [];
              for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('offerbell') && k !== 'offerbell-theme') keys.push(k); }
              keys.forEach(k => localStorage.removeItem(k));
              localStorage.removeItem('userId');
              document.cookie = 'offerbell_user_id=; path=/; max-age=0';
              window.location.href = '/';
            }}
            type="button"
            title="Sign out"
            style={{
              marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
          </button>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .sidebar::-webkit-scrollbar { display: none !important; }
          .sidebar { -ms-overflow-style: none !important; scrollbar-width: none !important; overflow-y: hidden !important; }
          .sidebar .sidebar-logo { padding: 14px 16px 12px !important; }
          .sidebar .sidebar-user { padding: 8px 16px !important; }
          .sidebar .nav { padding: 4px 10px !important; }
          .sidebar .nav-group-label { padding: 8px 10px 2px !important; font-size: 9.5px !important; }
          .sidebar .nav-item { padding: 5px 10px !important; margin-bottom: 0px !important; }
          .sidebar .theme-toggle-row { padding: 10px 16px !important; }
        `}} />
        <nav className="nav">
          <div className="nav-group">
            <span className="nav-group-label">Overview</span>
            <Link className={cls('dashboard')} href="/dashboard"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Learn</span>
            <Link className={cls('learn')} href="/learn"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Learning Hub</Link>
            <Link className={cls('concept-drills')} href="/concept-drills"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Concept Drills</Link>
            <Link className={cls('reps')} href="/reps"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>The Desk</Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Prep</span>
            <Link className={cls('coach')} href="/coach"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Coach</Link>
            <Link className={cls('flashcards')} href="/flashcards"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>Interview Flashcards</Link>
            <Link className={cls('mock-interview')} href="/mock-interview"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Mock Interview</Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Networking</span>
            <Link className={cls('outreach-tracker')} href="/outreach-tracker"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Outreach Tracker</Link>
            <Link className={cls('outreach-writer')} href="/outreach-writer"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Outreach Writer</Link>
            <Link className={cls('referral-map')} href="/referral-map"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="M5 9v3a4 4 0 0 0 4 4h2"/><path d="M19 9v3a4 4 0 0 1-4 4h-2"/></svg>Referral Map</Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Insights</span>
            <Link className={cls('resume-review')} href="/resume-review"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>Resume Review</Link>
            <Link className={cls('diagnostic-review')} href="/diagnostic-review"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>Diagnostic Review</Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Settings</span>
            <Link className={cls('my-account')} href="/my-account"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Settings</Link>
            <Link className={cls('feedback')} href="/feedback"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8"/><path d="M8 14h4"/></svg>Feedback</Link>
          </div>
        </nav>
        <div className="theme-toggle-row">
          <span className="theme-toggle-label"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>Dark mode</span>
          <button className={`toggle-switch${isDark?' on':''}`} onClick={toggleTheme} type="button"><div className="toggle-knob"/></button>
        </div>
      </aside>
    </>
  );
}
