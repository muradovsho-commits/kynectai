'use client';

import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/interview-prep.css';

import { ST_FOUNDATIONS_SECTIONS } from './st-foundations-data';
import { ST_ASSETS_SECTIONS } from './st-assets-data';
import { ST_MATH_SECTIONS } from './st-math-data';
import { ST_TRADING_SECTIONS } from './st-trading-data';
import { ST_TECHNICALS_SECTIONS } from './st-technicals-data';
import { ST_IDEAS_SECTIONS } from './st-ideas-data';
import { ST_BEHAVIORAL_SECTIONS } from './st-behavioral-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 'st_found', title: 'S&T Foundations', sub: 'What S&T is, the three desks, how desks make money', sections: ST_FOUNDATIONS_SECTIONS },
  { id: 'st_assets', title: 'Asset Classes', sub: 'Equities, fixed income, FX, commodities, derivatives', sections: ST_ASSETS_SECTIONS },
  { id: 'st_math', title: 'Mental Math & Probability', sub: 'Speed math, expected value, brainteasers', sections: ST_MATH_SECTIONS },
  { id: 'st_trading', title: 'Trading Games & Risk', sub: 'Mock trading, bidding games, risk management', sections: ST_TRADING_SECTIONS },
  { id: 'st_tech', title: 'Options & Bond Math', sub: 'Greeks, duration, convexity, yield curve', sections: ST_TECHNICALS_SECTIONS },
  { id: 'st_ideas', title: 'Trade Ideas & Markets', sub: 'Pitching trades, market knowledge checklist', sections: ST_IDEAS_SECTIONS },
  { id: 'st_beh', title: 'S&T Behavioral', sub: 'Why S&T, why trading vs sales, practice drills', sections: ST_BEHAVIORAL_SECTIONS },
];

const ICONS: Record<string, React.ReactElement> = {
  st_found: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  st_assets: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  st_math: <svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="3"/></svg>,
  st_trading: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  st_tech: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  st_ideas: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg>,
  st_beh: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function InterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('offerbell_user_id');
    if (!stored) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  }, [router]);

  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const sections = activeModule ? mod.sections : [];
  const toggleItem = (key: string) => { setOpenItems(prev => ({ ...prev, [key]: !prev[key] })); };

  return (
    <div className="app">
      <Sidebar activePage="st-interview-prep" />
      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom:"16px"}}><Link href="/learn" style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"14px",fontWeight:600,color:"var(--text-3)",textDecoration:"none"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Overview</Link></div>
          <div className="prep-title">Sales & Trading <em>Guide</em></div>
          <div className="prep-sub">Master the trading floor — from market fundamentals and probability to trade ideas and risk management.</div>
        </div>

        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Foundations & Markets</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['st_found','st_assets'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}<div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Quant & Technical Skills</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['st_math','st_trading','st_tech'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}<div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Trade Ideas & Behavioral</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['st_ideas','st_beh'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}<div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
        </div>

        {activeModule === '' ? (
          <div className="prep-content">
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px 32px",marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"8px"}}>Welcome to the Sales & Trading Guide</h2>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"16px"}}>This guide prepares you for the unique demands of S&T interviews — real-time market knowledge, mental math under pressure, probability reasoning, and trade idea delivery.</p>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7}}>Select a module above to start reading.</p>
            </div>
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"20px 24px",marginBottom:"20px"}}>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"}}>How to Use This Guide</div>
              <div style={{fontSize:"13px",color:"var(--text-2)",lineHeight:1.7}}>
                <p style={{marginBottom:"8px"}}><strong>Markets First:</strong> Know where the S&P, 10Y yield, oil, and EUR/USD are trading TODAY. Build a daily habit.</p>
                <p style={{marginBottom:"8px"}}><strong>Math Speed:</strong> Practice mental math for 10 minutes every day. S&T interviews are timed pressure tests.</p>
                <p style={{marginBottom:"0"}}><strong>Have a View:</strong> Walk into every interview with a trade idea — long or short, with a thesis, catalyst, and risk.</p>
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
          <div style={{marginBottom:"16px"}}><button onClick={() => setActiveModule('')} style={{background:"none",border:"none",cursor:"pointer",fontSize:"13px",color:"var(--text-3)",fontFamily:"'Sora',sans-serif",padding:0}}>Back to overview</button></div>
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
