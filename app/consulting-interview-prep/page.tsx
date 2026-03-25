'use client';

import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/interview-prep.css';

import { CONS_FRAMEWORKS_SECTIONS } from './consulting-frameworks-data';
import { CONS_MATH_SECTIONS } from './consulting-math-data';
import { CONS_EXECUTION_SECTIONS } from './consulting-execution-data';
import { CONS_BEHAVIORAL_SECTIONS } from './consulting-behavioral-data';
import { CONS_FIRMS_SECTIONS } from './consulting-firms-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 'cons_frameworks', title: 'Case Frameworks', sub: 'Profitability, Market Entry, M&A', sections: CONS_FRAMEWORKS_SECTIONS },
  { id: 'cons_math', title: 'Case Math & Mental Agility', sub: 'Market Sizing, Breakeven, ROI', sections: CONS_MATH_SECTIONS },
  { id: 'cons_execution', title: 'Case Execution', sub: 'Structuring, Chart Reading, Synthesis', sections: CONS_EXECUTION_SECTIONS },
  { id: 'cons_behavioral', title: 'PEI & Fit Interviews', sub: 'McKinsey PEI, BCG Leadership, Tone', sections: CONS_BEHAVIORAL_SECTIONS },
  { id: 'cons_firms', title: 'Firm Profiles & Culture', sub: 'MBB vs Tier 2, Staffing Models, Travel', sections: CONS_FIRMS_SECTIONS },
];

const ICONS: Record<string, React.ReactElement> = {
  cons_frameworks: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  cons_math: <svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3"/></svg>,
  cons_execution: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  cons_behavioral: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  cons_firms: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

export default function InterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const [_userName, _setUserName] = useState({ first: '', last: '' });

  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      setUserPlan(prof.plan || plan);
    } catch { setUserPlan('free'); }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); _setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
  }, []);
  const _displayName = (_userName.first + ' ' + _userName.last).trim() || 'User';
  const _displayInitials = ((_userName.first[0] || '') + (_userName.last[0] || '')).toUpperCase() || 'U';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); }
  }, [router]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('offerbell-theme');
    if (saved) { document.documentElement.setAttribute('data-theme', saved); setIsDark(saved === 'dark'); }
  }, []);
  const toggleTheme = () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(next === 'dark');
    localStorage.setItem('offerbell-theme', next);
  };

  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const sections = mod.sections;

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="app">
      <Sidebar activePage="consulting-interview-prep" />

      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom: "16px"}}>
            <Link href="/learn" style={{display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-3)", textDecoration: "none"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Overview
            </Link>
          </div>
          <div className="prep-title">Management Consulting <em>Guide</em></div>
          <div className="prep-sub">Everything you need to secure MBB offers — rigorous case frameworks, graph synthesis, market sizing math, and the infamous McKinsey PEI.</div>
        </div>

        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>The Case Interview (Strategy & Math)</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['cons_frameworks','cons_math', 'cons_execution'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Behavioral & Industry Knowledge</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['cons_behavioral', 'cons_firms'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
        </div>

        {activeModule === '' ? (
          <div className="prep-content">
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px 32px",marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"8px"}}>Welcome to Consulting Prep</h2>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"16px"}}>Management consulting interviews (especially at MBB: McKinsey, BCG, Bain) are globally notorious for the "Case Interview". You are expected to solve a complex, ambiguous business problem live on a whiteboard in 30 minutes, relying solely on mental arithmetic and structured logic trees.</p>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7}}>Select a module above to start your review.</p>
            </div>
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"20px 24px",marginBottom:"20px"}}>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"}}>How to Use This Guide</div>
              <div style={{fontSize:"13px",color:"var(--text-2)",lineHeight:1.7}}>
                <p style={{marginBottom:"8px"}}><strong>MECE Frameworks:</strong> The foundation of all casing is structure. You must memorize and customize the core frameworks without sounding like a robot. Start there.</p>
                <p style={{marginBottom:"8px"}}><strong>Mental Math:</strong> If you pull out a calculator or fumble a division involving billions, the interview is over immediately. The Case Math module contains all the heuristic shortcuts you need.</p>
                <p style={{marginBottom:"0"}}><strong>The PEI Trap:</strong> Do not underestimate behavioral interviews for consulting. McKinsey's Personal Experience Interview (PEI) fails more candidates than their math tests. You need iron-clad, deeply structured personal stories.</p>
              </div>
            </div>

            <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>Study Approach</div>
            {MODULES.map((m, i) => (
              <div key={m.id} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }} style={{display:"flex",alignItems:"center",gap:"16px",padding:"14px 18px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"12px",marginBottom:"8px",cursor:"pointer"}}>
                <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"var(--surface-2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:"var(--text-2)",flexShrink:0}}>{i + 1}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"14px",fontWeight:600,color:"var(--text)"}}>{m.title}</div>
                  <div style={{fontSize:"12px",color:"var(--text-3)",marginTop:"2px"}}>{m.sub}</div>
                </div>
                <div style={{fontSize:"12px",color:"var(--text-3)"}}>{m.sections.length} topics</div>
              </div>
            ))}

          </div>
        ) : (
        <div className="prep-content">
          <div style={{marginBottom:"16px"}}>
            <button onClick={() => setActiveModule('')} style={{background:"none",border:"none",cursor:"pointer",fontSize:"13px",color:"var(--text-3)",fontFamily:"'Sora',sans-serif",padding:0}}>Back to overview</button>
          </div>
          <div className="prep-section-title">{mod.title}</div>
          <div className="prep-section-sub">{mod.sub} — {sections.length} topics</div>

          {sections.map((s, i) => {
            const key = `${activeModule}-${i}`;
            const isOpen = openItems[key] ?? false;
            return (
              <div key={key} className={'prep-item' + (isOpen ? ' open' : '')}>
                <div className="prep-item-header" onClick={() => toggleItem(key)}>
                  <div className="prep-item-num">{i + 1}</div>
                  <div className="prep-item-title">{s.title}</div>
                  <svg className="prep-item-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
                {isOpen && (
                  <div className="prep-item-body" dangerouslySetInnerHTML={{ __html: s.content }} />
                )}
              </div>
            );
          })}
        </div>
        )}
      </main>
    </div>
  );
}
