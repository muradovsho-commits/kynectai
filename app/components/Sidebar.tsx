'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SidebarProps {
  activePage: string;
}

export default function Sidebar({ activePage }: SidebarProps) {
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState({ first: '', last: '' });
  const [userPlan, setUserPlan] = useState('free');
  const [messagesSent, setMessagesSent] = useState(0);

  useEffect(() => {
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        setUserName({ first: p.firstName || '', last: p.lastName || '' });
        const plan = localStorage.getItem('offerbell_plan') || 'free';
        setUserPlan(p.plan || plan);
      }
    } catch {}
  }, []);

  const displayName = (userName.first + ' ' + userName.last).trim() || 'User';
  const displayInitials = ((userName.first[0] || '') + (userName.last[0] || '')).toUpperCase() || 'U';

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  const cls = (page: string) => `nav-item${activePage === page ? ' active' : ''}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><Link href="/my-account" style={{color:'inherit',textDecoration:'none'}}>OfferBell<em>.</em></Link></div>
      <div className="sidebar-user">
        <div style={{position:'relative'}}>
          <div className="user-avi">{displayInitials}</div>
          {userPlan === 'pro' && <div style={{position:'absolute',bottom:-1,right:-1,width:12,height:12,borderRadius:'50%',background:'#16a34a',border:'2px solid var(--surface)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="7" height="7" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>}
        </div>
        <div><div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{displayName}</div><div style={{fontSize:11,color: userPlan === 'pro' ? '#16a34a' : 'var(--text-3)',fontWeight: userPlan === 'pro' ? 600 : 400}}>{userPlan === 'pro' ? '✦ Pro plan' : 'Free plan'}</div></div>
      </div>
      <nav className="nav">
        <div className="nav-group">
          <span className="nav-group-label">Overview</span>
          <Link className={cls('dashboard')} href="/dashboard"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</Link>
        </div>
        <div className="nav-group">
          <span className="nav-group-label">Tools</span>
          <Link className={cls('contact-finder')} href="/contact-finder"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>Contact Finder<span className="nav-pill pill-pro">Soon</span></Link>
          <Link className={cls('outreach-writer')} href="/outreach-writer"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Outreach Writer{userPlan !== 'pro' && <span className="nav-pill pill-count">{Math.max(0, 5 - messagesSent)} left</span>}</Link>
          <Link className={cls('outreach-tracker')} href="/outreach-tracker"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Outreach Tracker</Link>
          <Link className={cls('offer-pipeline')} href="/offer-pipeline"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>Offer Pipeline</Link>
          <Link className={cls('job-board')} href="/job-board"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>Job Board</Link>
        </div>
        <div className="nav-group">
          <span className="nav-group-label">Intelligence</span>
          <Link className={cls('hit-rate-intel')} href="/hit-rate-intel"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Hit Rate Intel<span className="nav-pill pill-pro">Pro</span></Link>
          <Link className={cls('coach')} href="/coach"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>Coach<span className="nav-pill pill-pro">Pro</span></Link>
          <Link className={cls('goal-planner')} href="/goal-planner"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>Goal Planner</Link>
        </div>
        <div className="nav-group">
          <span className="nav-group-label">Learn</span>
          <Link className={cls('learn')} href="/learn"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Learning Hub</Link>
          <Link className={cls('flashcards')} href="/flashcards"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>Interview Flashcards</Link>
        </div>
        <div className="nav-group">
          <span className="nav-group-label">Account</span>
          <Link className={cls('my-account')} href="/my-account"><svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Account</Link>
        </div>
      </nav>
      <div className="theme-toggle-row">
        <span className="theme-toggle-label"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>Dark mode</span>
        <button className={`toggle-switch${isDark?' on':''}`} onClick={toggleTheme} type="button"><div className="toggle-knob"/></button>
      </div>

    </aside>
  );
}
