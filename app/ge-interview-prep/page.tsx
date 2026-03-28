'use client';
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/interview-prep.css';
import { GE_FUNDAMENTALS_SECTIONS } from './ge-fundamentals-data';
import { GE_TECHNICALS_SECTIONS } from './ge-technicals-data';
import { GE_CASES_SECTIONS } from './ge-cases-data';
import { GE_BEHAVIORAL_SECTIONS } from './ge-behavioral-data';
type Section = { title: string; content: string };
const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 'ge_fund', title: 'GE Fundamentals', sub: 'What GE is, GE vs PE vs VC, value creation, firms', sections: GE_FUNDAMENTALS_SECTIONS },
  { id: 'ge_tech', title: 'Technicals & Valuation', sub: 'Investment criteria, SaaS metrics, deal structuring', sections: GE_TECHNICALS_SECTIONS },
  { id: 'ge_case', title: 'Case Studies', sub: 'Investment memos, live case framework, sample analysis', sections: GE_CASES_SECTIONS },
  { id: 'ge_beh', title: 'Behavioral & Practice', sub: 'Why GE, company deep-dives, study plan', sections: GE_BEHAVIORAL_SECTIONS },
];
const ICONS: Record<string, React.ReactElement> = {
  ge_fund: <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  ge_tech: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  ge_case: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  ge_beh: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};
export default function InterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = window.localStorage.getItem('offerbell_user_id');
    if (!s) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  }, [router]);
  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const sections = activeModule ? mod.sections : [];
  const toggleItem = (key: string) => { setOpenItems(prev => ({ ...prev, [key]: !prev[key] })); };

  return (
    <div className="app">
      <Sidebar activePage="ge-interview-prep" />
      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom:"16px"}}><Link href="/learn" style={{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"14px",fontWeight:600,color:"var(--text-3)",textDecoration:"none"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Overview</Link></div>
          <div className="prep-title">Growth Equity <em>Guide</em></div>
          <div className="prep-sub">Master growth equity investing -- from evaluating high-growth companies and SaaS metrics to structuring minority investments and presenting investment memos.</div>
        </div>

        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Fundamentals & Technicals</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['ge_fund','ge_tech'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setOpenItems({}); }}>
                {ICONS[m.id]}<div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Case Studies & Behavioral</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['ge_case','ge_beh'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setOpenItems({}); }}>
                {ICONS[m.id]}<div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
        </div>

        {activeModule === '' ? (
          <div className="prep-content">
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px 32px",marginBottom:"20px"}}>
              <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"8px"}}>Welcome to the Growth Equity Guide</h2>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"16px"}}>Growth equity sits between VC and buyout PE -- investing in proven, high-growth companies that need capital to scale. This guide covers everything from SaaS metrics and deal structuring to investment memos and case study frameworks.</p>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7}}>Select a module above to start reading.</p>
            </div>
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"20px 24px",marginBottom:"20px"}}>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"}}>How to Use This Guide</div>
              <div style={{fontSize:"13px",color:"var(--text-2)",lineHeight:1.7}}>
                <p style={{marginBottom:"8px"}}><strong>Know the Positioning:</strong> GE vs PE vs VC is the most asked question. Understand the differences in deal structure, value creation, and return profiles cold.</p>
                <p style={{marginBottom:"8px"}}><strong>Master SaaS Metrics:</strong> Most GE deals are in software. ARR, NRR, CAC payback, burn multiple, Rule of 40 -- these are the language of growth investing.</p>
                <p style={{marginBottom:"0"}}><strong>Prepare a Company:</strong> Have 2-3 high-growth private companies you can discuss for 10+ minutes with specific metrics and an investment thesis.</p>
              </div>
            </div>
            <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>Study Approach</div>
            {MODULES.map((m, i) => (
              <div key={m.id} onClick={() => { setActiveModule(m.id); setOpenItems({}); }} style={{display:"flex",alignItems:"center",gap:"16px",padding:"14px 18px",background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"12px",marginBottom:"8px",cursor:"pointer"}}>
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
          <div className="prep-section-sub">{mod.sub} -- {sections.length} topics</div>
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
