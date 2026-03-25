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
  { id: 'core', title: 'Core Concepts', sub: 'Financial modeling, TVM, PV, IRR, WACC', sections: CORE_SECTIONS },
  { id: 'accounting', title: 'Accounting', sub: 'Three statements, FCF, ratios', sections: ACCOUNTING_SECTIONS },
  { id: 'ev', title: 'EV & Valuation', sub: 'Equity Value, Enterprise Value, multiples', sections: EV_SECTIONS },
  { id: 'dcf', title: 'DCF Analysis', sub: 'DCF, comps, precedent transactions', sections: DCF_SECTIONS },
  { id: 'ma', title: 'M&A Models', sub: 'Accretion/dilution, merger models', sections: MA_SECTIONS },
  { id: 'lbo', title: 'LBO Models', sub: 'Leveraged buyouts, paper LBO', sections: LBO_SECTIONS },
  { id: 'behavioral', title: 'Behavioral', sub: 'TMAY, fit, stories, strengths', sections: BEHAVIORAL_SECTIONS },
  { id: 'markets', title: 'Market Awareness', sub: 'Bloomberg, WSJ, stock pitches', sections: MARKETS_SECTIONS },
  { id: 'quiz', title: 'Technicals Test', sub: '30 multiple choice questions', sections: [] },
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
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
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

        {activeModule !== '' && (
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
        )}

        {activeModule === '' ? (
          <div className="prep-content" style={{maxWidth:"1060px"}}>
            {/* Two-column layout: left content + right study path */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:"28px",marginBottom:"28px"}}>
              {/* Left Column */}
              <div>
                {/* Welcome Card */}
                <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"28px 32px",marginBottom:"20px"}}>
                  <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:"22px",color:"var(--text)",marginBottom:"10px"}}>Welcome to the {MODULES[0] ? mod.title.split(' ')[0] : 'IB'} Interview Guide</h2>
                  <p style={{fontSize:"14px",color:"var(--text-2)",lineHeight:1.7,marginBottom:"20px"}}>This curriculum is curated by former MDs and Associates from Tier-1 bulge bracket banks. We've distilled thousands of interview hours into these modules to ensure you spend your time on what actually gets you the offer.</p>
                  <div style={{fontSize:"11px",fontWeight:700,color:"var(--text)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"12px"}}>How to Use This Guide</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                    {[
                      "Follow the sequential path for technical mastery.",
                      "Review behavioral frameworks early and often.",
                      "Use the Market Awareness tab for daily news hooks.",
                      "Complete Technical Tests to unlock certificates.",
                    ].map((tip, i) => (
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"8px",fontSize:"13px",color:"var(--text-2)",lineHeight:1.5}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:"2px"}}><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Access */}
                <div style={{fontSize:"14px",fontWeight:700,color:"var(--text)",marginBottom:"12px"}}>Quick Access</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"10px"}}>
                  {MODULES.filter(m => m.id !== 'quiz').map(m => (
                    <div key={m.id} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }} className="module-card" style={{textAlign:"left",padding:"18px 16px",cursor:"pointer"}}>
                      <div style={{marginBottom:"10px"}}>{ICONS[m.id]}</div>
                      <div className="module-name" style={{fontSize:"13px"}}>{m.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column — Study Path */}
              <div>
                <div style={{background:"var(--surface)",border:"1.5px solid var(--border)",borderRadius:"16px",padding:"24px",position:"sticky",top:"24px"}}>
                  <div style={{fontSize:"16px",fontWeight:700,color:"var(--text)",marginBottom:"4px"}}>Study Path</div>
                  <p style={{fontSize:"12px",color:"var(--text-3)",lineHeight:1.5,marginBottom:"20px"}}>Follow this expert-vetted sequence for optimal preparation efficiency.</p>
                  <div style={{position:"relative"}}>
                    {/* Vertical line */}
                    <div style={{position:"absolute",left:"17px",top:"20px",bottom:"20px",width:"2px",background:"var(--border)"}}/>
                    {MODULES.map((m, i) => (
                      <div key={m.id} onClick={() => { setActiveModule(m.id); setActiveSection(0); setOpenItems({}); }} style={{display:"flex",gap:"14px",marginBottom: i < MODULES.length - 1 ? "20px" : "0",cursor:"pointer",position:"relative",zIndex:1}}>
                        <div style={{width:"36px",height:"36px",borderRadius:"50%",background: i < 3 ? "var(--text)" : "var(--surface-2)",border: i >= 3 ? "2px solid var(--border)" : "none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color: i < 3 ? "var(--surface)" : "var(--text-2)",flexShrink:0}}>{i + 1}</div>
                        <div style={{paddingTop:"2px"}}>
                          <div style={{fontSize:"13px",fontWeight:700,color:"var(--text)"}}>{m.title}</div>
                          <div style={{fontSize:"11px",color:"var(--text-3)",marginTop:"2px",lineHeight:1.4}}>{m.sub}</div>
                          <div style={{fontSize:"10px",fontWeight:700,color:"var(--text-3)",textTransform:"uppercase",letterSpacing:".5px",marginTop:"4px"}}>{m.sections.length || '30'} {m.id === 'quiz' ? 'questions' : 'topics'}</div>
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

          {activeModule === 'quiz' ? (
            <div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"20px"}}>
                {['all','Core Concepts','Accounting','EV & Valuation','DCF Analysis','M&A Models','LBO Models'].map(cat => (
                  <button key={cat} onClick={() => {setQuizFilter(cat);setQuizAnswers({});setQuizSubmitted(false);}} style={{padding:"6px 14px",borderRadius:"100px",border:"1.5px solid "+(quizFilter===cat?"var(--text)":"var(--border)"),background:quizFilter===cat?"var(--text)":"var(--surface)",color:quizFilter===cat?"var(--surface)":"var(--text-2)",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>{cat==='all'?'All Topics':cat}</button>
                ))}
              </div>
              {(quizFilter==='all'?QUIZ_QUESTIONS:QUIZ_QUESTIONS.filter(q=>q.category===quizFilter)).map((q,qi) => {
                const answered = quizAnswers[q.id] !== undefined;
                const isCorrect = quizAnswers[q.id] === q.correct;
                return (
                  <div key={q.id} style={{background:"var(--surface)",border:"1.5px solid "+(quizSubmitted?(isCorrect?"#22c55e":answered?"#ef4444":"var(--border)"):"var(--border)"),borderRadius:"12px",padding:"18px 20px",marginBottom:"10px"}}>
                    <div style={{display:"flex",gap:"10px",marginBottom:"12px"}}>
                      <div style={{width:"28px",height:"28px",borderRadius:"50%",background:quizSubmitted?(isCorrect?"#22c55e":answered?"#ef4444":"var(--surface-2)"):"var(--surface-2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:quizSubmitted&&(isCorrect||answered)?"#fff":"var(--text-2)",flexShrink:0}}>{qi+1}</div>
                      <div>
                        <div style={{fontSize:"11px",fontWeight:600,color:"var(--text-3)",marginBottom:"4px"}}>{q.category}</div>
                        <div style={{fontSize:"14px",fontWeight:600,color:"var(--text)",lineHeight:1.5}}>{q.question}</div>
                      </div>
                    </div>
                    <div style={{display:"grid",gap:"8px",paddingLeft:"38px"}}>
                      {q.options.map((opt,oi) => {
                        const sel = quizAnswers[q.id]===oi;
                        const corr = oi===q.correct;
                        let bg="var(--surface-2)",brd="var(--border)",col="var(--text)";
                        if(quizSubmitted&&corr){bg="rgba(34,197,94,0.1)";brd="#22c55e";col="#16a34a";}
                        else if(quizSubmitted&&sel&&!corr){bg="rgba(239,68,68,0.1)";brd="#ef4444";col="#dc2626";}
                        else if(sel){bg="var(--text)";brd="var(--text)";col="var(--surface)";}
                        return (
                          <div key={oi} onClick={()=>{if(!quizSubmitted)setQuizAnswers(p=>({...p,[q.id]:oi}));}} style={{padding:"10px 14px",borderRadius:"8px",border:"1.5px solid "+brd,background:bg,color:col,fontSize:"13px",cursor:quizSubmitted?"default":"pointer",fontWeight:sel?600:400,transition:"all 0.15s"}}>
                            <span style={{fontWeight:700,marginRight:"8px"}}>{String.fromCharCode(65+oi)}.</span>{opt}
                          </div>
                        );
                      })}
                    </div>
                    {quizSubmitted&&answered&&(
                      <div style={{marginTop:"12px",paddingLeft:"38px",fontSize:"13px",color:"var(--text-2)",lineHeight:1.6,background:"var(--surface-2)",padding:"12px 14px",borderRadius:"8px"}}>
                        <strong style={{color:isCorrect?"#16a34a":"#dc2626"}}>{isCorrect?"Correct":"Incorrect"}.</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"16px",marginTop:"20px"}}>
                {!quizSubmitted?(
                  <button onClick={()=>setQuizSubmitted(true)} style={{padding:"12px 32px",borderRadius:"10px",border:"none",background:"#6366f1",color:"#fff",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>Submit Answers</button>
                ):(
                  <>
                    <div style={{fontSize:"18px",fontWeight:700,color:"var(--text)"}}>
                      Score: {(()=>{const qs=quizFilter==='all'?QUIZ_QUESTIONS:QUIZ_QUESTIONS.filter(q=>q.category===quizFilter);const c=qs.filter(q=>quizAnswers[q.id]===q.correct).length;return c+"/"+qs.length+" ("+Math.round(c/qs.length*100)+"%)"})()}
                    </div>
                    <button onClick={()=>{setQuizAnswers({});setQuizSubmitted(false);}} style={{padding:"10px 24px",borderRadius:"10px",border:"1.5px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>Retake</button>
                  </>
                )}
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
