'use client';

import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/interview-prep.css';

import { RE_FUNDAMENTALS_SECTIONS, RE_MODELING_SECTIONS, RE_BEHAVIORAL_SECTIONS } from './re-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 're_fund', title: 'Markets & Asset Classes', sub: 'Equities, fixed income, FX, commodities, derivatives', sections: ST_MARKETS_SECTIONS },
  { id: 're_beh', title: 'Quant & Probability', sub: 'Mental math, expected value, brainteasers, trading games', sections: ST_QUANT_SECTIONS },
  { id: 're_model', title: 'Technical Concepts', sub: 'Options, bond math, FX, macro', sections: ST_TECHNICALS_SECTIONS },
  { id: 're_unused', title: 'S&T Behavioral', sub: 'Why S&T, trade ideas, market questions', sections: ST_BEHAVIORAL_SECTIONS },
];

const ICONS: Record<string, React.ReactElement> = {
  re_fund: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  re_beh: <svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3"/></svg>,
  re_model: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  re_unused: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
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
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    try { const raw = localStorage.getItem('offerbell_onboarding_profile'); if (raw) { const p = JSON.parse(raw); _setUserName({ first: p.firstName || '', last: p.lastName || '' }); setUserPlan(p.plan || 'free'); } } catch {}
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
  }, [router]);

  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const sections = activeModule ? mod.sections : [];
  const toggleItem = (key: string) => { setOpenItems(prev => ({ ...prev, [key]: !prev[key] })); };

  return (
    <div className="app">
      <Sidebar activePage="re-interview-prep" />
      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom:"16px"}}><Link href="/learn" style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"14px",fontWeight:600,color:"var(--text-3)",textDecoration:"none"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Overview</Link></div>
          <div className="prep-title">Real Estate <em>Guide</em></div>
          <div className="prep-sub">Master real estate finance and REPE interview preparation.</div>
        </div>
        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Fundamentals & Modeling</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>{MODULES.filter(m => ['re_fund','re_model'].includes(m.id)).map(m => (<div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>{ICONS[m.id]}<div className="module-name">{m.title}</div></div>))}</div>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Behavioral & Fit</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>{MODULES.filter(m => ['re_beh','re_unused'].includes(m.id)).map(m => (<div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>{ICONS[m.id]}<div className="module-name">{m.title}</div></div>))}</div>
        </div>
        {activeModule === '' ? (
          <div className="prep-content">
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px 32px",marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"8px"}}>Welcome to the Real Estate Guide</h2>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"16px"}}>This guide prepares you for the unique demands of S&T interviews — real-time market knowledge, mental math under pressure, probability reasoning, and trade idea delivery.</p>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7}}>Select a module above to start reading.</p>
            </div>
            <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>Study Approach</div>
            {MODULES.map((m, i) => (<div key={m.id} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }} style={{display:"flex",alignItems:"center",gap:"16px",padding:"14px 18px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"12px",marginBottom:"8px",cursor:"pointer"}}><div style={{width:"32px",height:"32px",borderRadius:"50%",background:"var(--surface-2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:"var(--text-2)",flexShrink:0}}>{i + 1}</div><div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:600,color:"var(--text)"}}>{m.title}</div><div style={{fontSize:"12px",color:"var(--text-3)",marginTop:"2px"}}>{m.sub}</div></div><div style={{fontSize:"12px",color:"var(--text-3)"}}>{m.sections.length} topics</div></div>))}
          </div>
        ) : (
        <div className="prep-content">
          <div style={{marginBottom:"16px"}}><button onClick={() => setActiveModule('')} style={{background:"none",border:"none",cursor:"pointer",fontSize:"13px",color:"var(--text-3)",fontFamily:"'Sora',sans-serif",padding:0}}>Back to overview</button></div>
          <div className="prep-section-title">{mod.title}</div>
          <div className="prep-section-sub">{mod.sub} — {sections.length} topics</div>
          {sections.map((s, i) => { const key = `${activeModule}-${i}`; const isOpen = openItems[key] ?? false; return (<div key={key} className={'prep-item' + (isOpen ? ' open' : '')}><div className="prep-item-header" onClick={() => toggleItem(key)}><div className="prep-item-num">{i + 1}</div><div className="prep-item-title">{s.title}</div><svg className="prep-item-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></div>{isOpen && (<div className="prep-item-body" dangerouslySetInnerHTML={{ __html: s.content }} />)}</div>); })}
        </div>
        )}
      </main>
    </div>
  );
}
