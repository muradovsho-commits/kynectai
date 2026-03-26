'use client';

import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/interview-prep.css';

import { AM_BEHAVIORAL_SECTIONS } from './am-behavioral-data';
import { AM_MARKETS_SECTIONS } from './am-markets-data';
import { AM_TECH_SECTIONS } from './am-tech-data';
import { AM_STOCK_PITCH_SECTIONS } from './am-stock-pitch-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 'am_tech', title: 'Investing Foundations & Markets', sub: 'AM mindset, asset classes, pricing, benchmarks, efficiency', sections: AM_TECH_SECTIONS },
  { id: 'am_markets', title: 'Fundamental Analysis & Valuation', sub: 'Business models, margins, ROIC, DCF, multiples, margin of safety', sections: AM_MARKETS_SECTIONS },
  { id: 'am_pitch', title: 'Portfolio, Macro & Stock Pitch', sub: 'Sizing, risk, diversification, rates, inflation, pitch structure', sections: AM_STOCK_PITCH_SECTIONS },
  { id: 'am_behavioral', title: 'Cross-Asset, Performance & Mastery', sub: 'Fixed income, attribution, question bank, behavioral, appendices', sections: AM_BEHAVIORAL_SECTIONS },
];

const ICONS: Record<string, React.ReactElement> = {
  am_markets: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  am_tech: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 11v4"/></svg>,
  am_pitch: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07-2.83 2.83m-8.48 8.48-2.83 2.83m0-14.14 2.83 2.83m8.48 8.48 2.83 2.83"/></svg>,
  am_behavioral: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
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
      <Sidebar activePage="am-interview-prep" />

      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom: "16px"}}>
            <Link href="/learn" style={{display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-3)", textDecoration: "none"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Overview
            </Link>
          </div>
          <div className="prep-title">Asset Management <em>Guide</em></div>
          <div className="prep-sub">Everything you need to break into public markets — spanning macroeconomics, valuation, pitching a stock, and managing risk. Select a module below to start studying.</div>
        </div>

        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Foundations & Markets</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['am_tech','am_markets'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Applied Finance</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['am_pitch'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Behavioral & Fit</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => m.id === 'am_behavioral').map(m => (
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
              <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"8px"}}>Welcome to the Asset Management Guide</h2>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"16px"}}>This guide takes you through the mind of a portfolio manager — from navigating macro interest rate cycles and discounted cash flows to formulating the perfect variant perception for a stock pitch.</p>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7}}>Select a module above to start reading.</p>
            </div>
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"20px 24px",marginBottom:"20px"}}>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"}}>How to Use This Guide</div>
              <div style={{fontSize:"13px",color:"var(--text-2)",lineHeight:1.7}}>
                <p style={{marginBottom:"8px"}}><strong>Macro First:</strong> Start with Macro & Markets. Asset managers look at the big picture before zooming in on specific stocks. Understand yield curves and Fed policy inside out.</p>
                <p style={{marginBottom:"8px"}}><strong>Perfecting the Pitch:</strong> You cannot pass an AM interview without a polished stock pitch. Spend a week developing 1 Long and 1 Short pitch strictly adhering to the Variant Perception framework outlined.</p>
                <p style={{marginBottom:"0"}}><strong>Mindset:</strong> Behavioral prep for AM requires proving you are analytical, passionate about news/markets, and objective. Show them you can handle being wrong.</p>
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
