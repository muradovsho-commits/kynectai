'use client';

import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/interview-prep.css';

import { ACCT_AUDIT_SECTIONS } from './acct-audit-data';
import { ACCT_TAX_SECTIONS } from './acct-tax-data';
import { ACCT_TECH_SECTIONS } from './acct-tech-data';
import { ACCT_BEHAVIORAL_SECTIONS } from './acct-behavioral-data';
import { ACCT_FIRMS_SECTIONS } from './acct-firms-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 'acct_audit', title: 'Audit & Assurance', sub: 'SOX Compliance, Walkthroughs, Test of Controls', sections: ACCT_AUDIT_SECTIONS },
  { id: 'acct_tax', title: 'Tax Services', sub: 'Corporate, State & Local, M&A Tax Structuring', sections: ACCT_TAX_SECTIONS },
  { id: 'acct_tech', title: 'Technical Accounting', sub: 'ASC 606 (Revenue), Lease Accounting (ASC 842), 3-Statement', sections: ACCT_TECH_SECTIONS },
  { id: 'acct_behavioral', title: 'Big 4 Behavioral & CPA', sub: 'Partner Interviews, The CPA Journey, Busy Season', sections: ACCT_BEHAVIORAL_SECTIONS },
  { id: 'acct_firms', title: 'Firm Profiles & Exits', sub: 'Big 4 vs Mid-Tier, Controllership vs FP&A Exits', sections: ACCT_FIRMS_SECTIONS },
];

const ICONS: Record<string, React.ReactElement> = {
  acct_audit: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>,
  acct_tax: <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  acct_tech: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  acct_behavioral: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  acct_firms: <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
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
      <Sidebar activePage="accounting-interview-prep" />

      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom: "16px"}}>
            <Link href="/learn" style={{display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-3)", textDecoration: "none"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Overview
            </Link>
          </div>
          <div className="prep-title">Accounting & Audit <em>Guide</em></div>
          <div className="prep-sub">The definitive unvarnished playbook for the Big 4: SOX testing frameworks, Tax vs Audit career choices, and technical accounting interview strategies.</div>
        </div>

        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>The Technical Service Lines</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['acct_audit','acct_tax', 'acct_tech'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Behavioral & Industry Knowledge</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['acct_behavioral', 'acct_firms'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>
        </div>

        {activeModule === '' ? (
          <div className="prep-content" style={{maxWidth:"1060px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"28px",marginBottom:"28px"}}>
              <div>
                <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px 32px",marginBottom:"20px"}}>
                  <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"10px"}}>Welcome to the Accounting Interview Guide</h2>
                  <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"20px"}}>This curriculum is developed by CPAs and audit managers from Big 4 and national firms. We've organized technical accounting, audit procedures, tax concepts, and behavioral prep into an efficient study path.</p>
                  <div style={{fontSize:"11px",fontWeight:700,color:"var(--text)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>How to Use This Guide</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                    {[
                      "Start with technical accounting fundamentals.",
                      "Understand the audit lifecycle end to end.",
                      "Review firm-specific culture and values before interviews.",
                      "Practice behavioral answers with concrete examples.",
                    ].map((tip, i) => (
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"8px",fontSize:"13px",color:"var(--text-2)",lineHeight:1.5}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:"2px"}}><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{fontSize:"14px",fontWeight:700,color:"var(--text)",marginBottom:"12px"}}>Quick Access</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"10px"}}>
                  {MODULES.map(m => (
                    <div key={m.id} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }} className="module-card" style={{textAlign:"left",padding:"18px 16px",cursor:"pointer"}}>
                      <div style={{marginBottom:"10px"}}>{ICONS[m.id]}</div>
                      <div className="module-name" style={{fontSize:"13px"}}>{m.title}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"24px",position:"sticky",top:"24px"}}>
                  <div style={{fontSize:"16px",fontWeight:700,color:"var(--text)",marginBottom:"4px"}}>Study Path</div>
                  <p style={{fontSize:"12px",color:"var(--text-3)",lineHeight:1.5,marginBottom:"20px"}}>Follow this expert-vetted sequence for optimal preparation efficiency.</p>
                  <div style={{position:"relative"}}>
                    <div style={{position:"absolute",left:"17px",top:"20px",bottom:"20px",width:"2px",background:"var(--border)"}}/>
                    {MODULES.map((m, i) => (
                      <div key={m.id} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }} style={{display:"flex",gap:"14px",marginBottom: i < MODULES.length - 1 ? "20px" : "0",cursor:"pointer",position:"relative",zIndex:1}}>
                        <div style={{width:"36px",height:"36px",borderRadius:"50%",background: i < 3 ? "var(--text)" : "var(--surface-2)",border: i >= 3 ? "2px solid var(--border)" : "none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color: i < 3 ? "var(--surface)" : "var(--text-2)",flexShrink:0}}> {i + 1}</div>
                        <div style={{paddingTop:"2px"}}>
                          <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)"}}> {m.title}</div>
                          <div style={{fontSize:"11px",color:"var(--text-3)",marginTop:"2px",lineHeight:1.4}}>{m.sub}</div>
                          <div style={{fontSize:"10px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".5px",marginTop:"4px"}}>{m.sections.length} topics</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{fontSize:"11px",color:"var(--text-3)",textAlign:"right",marginTop:"10px"}}>Last updated: Mar 2026</div>
              </div>
            </div>
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
