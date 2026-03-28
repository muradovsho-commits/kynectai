'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import './interview-prep.css';

import { CORE_SECTIONS } from './core-data';
import { ACCOUNTING_SECTIONS } from './accounting-data';
import { EV_SECTIONS } from './ev-data';
import { DCF_SECTIONS } from './dcf-data';
import { MA_SECTIONS } from './ma-data';
import { LBO_SECTIONS } from './lbo-data';
import { BEHAVIORAL_SECTIONS } from './behavioral-data';
import { MARKETS_SECTIONS } from './markets-data';
import { QUIZ_QUESTIONS } from './quiz-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; sub: string; sections: Section[] }[] = [
  { id: 'accounting', title: 'Accounting Mastery', sub: 'Three statements, linkages, walkthroughs, working capital', sections: ACCOUNTING_SECTIONS },
  { id: 'ev', title: 'Valuation Fundamentals', sub: 'EV vs Equity Value, comps, precedent transactions', sections: EV_SECTIONS },
  { id: 'dcf', title: 'DCF & Advanced Valuation', sub: 'UFCF, WACC, terminal value, real-world nuance', sections: DCF_SECTIONS },
  { id: 'ma', title: 'Mergers & Acquisitions', sub: 'Accretion/dilution, synergies, purchase accounting', sections: MA_SECTIONS },
  { id: 'lbo', title: 'Leveraged Buyouts', sub: 'LBO mechanics, IRR drivers, good candidates', sections: LBO_SECTIONS },
  { id: 'core', title: 'Modeling & Interview Mastery', sub: 'Financial modeling, 6-week plan, appendices', sections: CORE_SECTIONS },
  { id: 'behavioral', title: 'Behavioral & Storytelling', sub: 'TMAY, Why IB?, stories, fit interviews', sections: BEHAVIORAL_SECTIONS },
  { id: 'markets', title: 'Market Awareness', sub: 'Macro, rates, sectors, and how to talk about markets in interviews', sections: MARKETS_SECTIONS },
  { id: 'quiz', title: 'Technical Practice', sub: '500 flashcards with answers', sections: [] },
];

const ICONS: Record<string, React.ReactElement> = {
  core: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-2.93-7.07-2.83 2.83m-8.48 8.48-2.83 2.83m0-14.14 2.83 2.83m8.48 8.48 2.83 2.83"/></svg>,
  accounting: <svg viewBox="0 0 24 24"><path d="M4 2h16v20H4z"/><path d="M8 6h8m-8 4h8m-8 4h5"/></svg>,
  ev: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  dcf: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  ma: <svg viewBox="0 0 24 24"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg>,
  lbo: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M12 11v4"/></svg>,
  behavioral: <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  markets: <svg viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  quiz: <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
};

export default function InterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [quizFilter, setQuizFilter] = useState('all');

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
      <Sidebar activePage="interview-prep" />

      <main className="main">
        <div className="prep-header">
          <div style={{marginBottom: "16px"}}>
            <Link href="/learn" style={{display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-3)", textDecoration: "none"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Overview
            </Link>
          </div>
          <div className="prep-title">IB Interview <em>Guide</em></div>
          <div className="prep-sub">Everything you need to ace your investment banking interviews — technicals, behavioral, and market awareness. Select a module below to start studying.</div>
        </div>

        <div style={{marginBottom:"28px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Technicals</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => ['core','accounting','ev','dcf','ma','lbo','quiz'].includes(m.id)).map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Behavioral</div>
          <div className="module-grid" style={{marginBottom:"16px"}}>
            {MODULES.filter(m => m.id === 'behavioral').map(m => (
              <div key={m.id} className={'module-card' + (activeModule === m.id ? ' active' : '')} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }}>
                {ICONS[m.id]}
                <div className="module-name">{m.title}</div>
              </div>
            ))}
          </div>

          <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"8px"}}>Market Awareness</div>
          <div className="module-grid">
            {MODULES.filter(m => m.id === 'markets').map(m => (
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
              <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"8px"}}>Welcome to the IB Interview Guide</h2>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"16px"}}>This guide covers everything you need to prepare for investment banking interviews — from core financial modeling concepts to advanced M&A and LBO questions, plus behavioral prep and market awareness.</p>
              <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7}}>Select a module above to start studying, or follow the recommended path below.</p>
            </div>
            <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"20px 24px",marginBottom:"20px"}}>
              <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)",marginBottom:"8px"}}>How to Use This Guide</div>
              <div style={{fontSize:"13px",color:"var(--text-2)",lineHeight:1.7}}>
                <p style={{marginBottom:"8px"}}><strong>2+ weeks:</strong> Go through each module in order. Spend 1-2 days per module, understanding concepts before memorizing answers.</p>
                <p style={{marginBottom:"8px"}}><strong>1 week:</strong> Focus on Core Concepts, Accounting, and DCF Analysis — these cover 80% of technical questions. Then Behavioral.</p>
                <p style={{marginBottom:"0"}}><strong>1-2 days:</strong> Go straight to Interview Questions at the bottom of each module. Focus on Accounting and DCF, then Behavioral.</p>
              </div>
            </div>

            <div style={{fontSize:"11px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>Recommended Study Path</div>
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

          {activeModule === 'quiz' ? (
            <div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"20px"}}>
                {['all','Accounting & Financial Statements','Valuation & DCF','M&A Concepts & Merger Models','LBO & Financial Sponsors','Capital Markets & Macro','Behavioral & Fit - IB Focused'].map(cat => (
                  <button key={cat} onClick={() => {setQuizFilter(cat);setRevealedAnswers({});}} style={{padding:"6px 14px",borderRadius:"100px",border:"1.5px solid "+(quizFilter===cat?"var(--text)":"var(--border)"),background:quizFilter===cat?"var(--text)":"var(--surface)",color:quizFilter===cat?"var(--surface)":"var(--text-2)",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>{cat==='all'?'All Topics':cat}</button>
                ))}
              </div>
              {(quizFilter==='all'?QUIZ_QUESTIONS:QUIZ_QUESTIONS.filter(q=>q.category===quizFilter)).map((q,qi) => {
                const isRevealed = revealedAnswers[q.id] === true;
                return (
                  <div key={q.id} style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"12px",padding:"18px 20px",marginBottom:"10px"}}>
                    <div style={{display:"flex",gap:"10px",marginBottom:"12px"}}>
                      <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"var(--surface-2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"var(--text-2)",flexShrink:0}}>{qi+1}</div>
                      <div>
                        <div style={{fontSize:"11px",fontWeight:600,color:"var(--text-3)",marginBottom:"4px"}}>{q.category}</div>
                        <div style={{fontSize:"14px",fontWeight:600,color:"var(--text)",lineHeight:1.5}}>{q.question}</div>
                      </div>
                    </div>
                    <div style={{paddingLeft:"38px"}}>
                      <button onClick={()=>setRevealedAnswers(p=>({...p,[q.id]:!isRevealed}))} style={{padding:"8px 14px",borderRadius:"8px",border:"1.5px solid var(--border)",background:"var(--surface-2)",color:"var(--text)",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif",marginBottom:isRevealed?"10px":"0"}}>{isRevealed?'Hide Answer':'Reveal Answer'}</button>
                      {isRevealed && (
                        <div style={{fontSize:"13px",color:"var(--text-2)",lineHeight:1.6,background:"var(--surface-2)",padding:"12px 14px",borderRadius:"8px"}}>
                          <strong style={{color:"var(--text)"}}>Strong answer:</strong> {q.answer}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"16px",marginTop:"20px"}}>
                <div style={{fontSize:"14px",fontWeight:700,color:"var(--text)"}}>
                  {(()=>{const qs=quizFilter==='all'?QUIZ_QUESTIONS:QUIZ_QUESTIONS.filter(q=>q.category===quizFilter);return qs.length+" flashcards";})()}
                </div>
                <button onClick={()=>setRevealedAnswers({})} style={{padding:"10px 24px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>Reset Reveals</button>
              </div>
            </div>
          ) : sections.map((s, i) => {
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
