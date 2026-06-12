'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import './guide-base.css';
import './ib-theme.css';

import { CORE_SECTIONS } from './core-data';
import { ACCOUNTING_SECTIONS } from './accounting-data';
import { EV_SECTIONS } from './ev-data';
import { DCF_SECTIONS } from './dcf-data';
import { MA_SECTIONS } from './ma-data';
import { LBO_SECTIONS } from './lbo-data';
import { BEHAVIORAL_SECTIONS } from './behavioral-data';
import { MARKETS_SECTIONS } from './markets-data';
import { SUMMARY_SECTIONS } from './summary-data';
import { IB_FLASHCARDS } from '../flashcards/ib-flashcard-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'core', title: 'Financial Modeling Foundations', navTitle: 'Core Concepts', sub: 'The bedrock principles of finance that power every model, valuation, and investment decision.', moduleNum: 'Module 1', sections: CORE_SECTIONS },
  { id: 'accounting', title: 'Accounting & the Three Financial Statements', navTitle: 'Accounting', sub: 'How financial statements work, why profit differs from cash, and how to extract the numbers that matter.', moduleNum: 'Module 2', sections: ACCOUNTING_SECTIONS },
  { id: 'ev', title: 'Equity Value, Enterprise Value & Valuation Multiples', navTitle: 'EV & Multiples', sub: 'Two lenses for measuring what a company is worth, and how to compare companies using multiples.', moduleNum: 'Module 3', sections: EV_SECTIONS },
  { id: 'dcf', title: 'Valuation & DCF Analysis', navTitle: 'DCF & Valuation', sub: 'From intrinsic valuation to comparable companies, precedent transactions, and the football field.', moduleNum: 'Module 4', sections: DCF_SECTIONS },
  { id: 'ma', title: 'M&A Deals & Merger Models', navTitle: 'M&A Models', sub: 'Accretion/dilution, synergies, deal structures, and why companies acquire other companies.', moduleNum: 'Module 5', sections: MA_SECTIONS },
  { id: 'lbo', title: 'Leveraged Buyouts & LBO Models', navTitle: 'LBO Models', sub: 'LBO mechanics, IRR drivers, what makes a good candidate, and advanced topics.', moduleNum: 'Module 6', sections: LBO_SECTIONS },
  { id: 'summary', title: 'Connecting the Modules', navTitle: 'Summary', sub: 'How every topic traces back to a single idea: is an investment worth making?', moduleNum: 'Summary', sections: SUMMARY_SECTIONS },
  { id: 'behavioral', title: 'Behavioral & Storytelling', navTitle: 'Behavioral', sub: 'TMAY, Why IB?, stories, fit interviews', moduleNum: 'Module 7', sections: BEHAVIORAL_SECTIONS },
  { id: 'markets', title: 'Market Awareness', navTitle: 'Markets', sub: 'Macro, rates, sectors, and how to talk about markets in interviews', moduleNum: 'Module 8', sections: MARKETS_SECTIONS },
  { id: 'quiz', title: 'Technical Practice', navTitle: 'Practice', sub: '500 flashcards with answers', moduleNum: 'Practice', sections: [] },
];

export default function InterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [quizFilter, setQuizFilter] = useState('all');
  const [shuffledCards, setShuffledCards] = useState<typeof IB_FLASHCARDS>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const shuffleCards = (filter: string) => {
    const pool = filter === 'all' ? [...IB_FLASHCARDS] : IB_FLASHCARDS.filter(c => c.category === filter);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setShuffledCards(pool);
    setRevealedAnswers({});
  };

  const [_userName, _setUserName] = useState({ first: '', last: '' });
  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  const [planChecked, setPlanChecked] = useState(false);

  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      const effectivePlan = prof.plan || plan;
      setUserPlan(effectivePlan);
      setPlanChecked(true);
      // Free users cannot access prep guides
      if (effectivePlan !== 'pro' && effectivePlan !== 'elite') {
        router.replace('/checkout');
      }
    } catch { setUserPlan('free'); setPlanChecked(true); router.replace('/checkout'); }
  }, [router]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); _setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); }
    else { shuffleCards('all'); }
  }, [router]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('offerbell-theme');
    if (saved) { document.documentElement.setAttribute('data-theme', saved); setIsDark(saved === 'dark'); }
  }, []);

  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[`${activeModule}-${idx}`];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo({ top: 0 });
  }, [activeModule]);

  return (
    <div className="app">
      <Sidebar activePage="interview-prep" />

      <main className="main ib-guide-main ib-theme" ref={contentRef}>
        {/* Back link */}
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>

        {/* Module Navigation Bar */}
        <nav className="ib-module-nav">
          <div className="ib-module-nav-inner">
            {MODULES.filter(m => !['behavioral','markets'].includes(m.id)).map(m => (
              <button
                key={m.id}
                className={'ib-nav-tab' + (activeModule === m.id ? ' active' : '')}
                onClick={() => setActiveModule(m.id)}
              >
                {m.navTitle}
              </button>
            ))}
            <span className="ib-nav-divider" />
            {MODULES.filter(m => ['behavioral','markets'].includes(m.id)).map(m => (
              <button
                key={m.id}
                className={'ib-nav-tab' + (activeModule === m.id ? ' active' : '')}
                onClick={() => setActiveModule(m.id)}
              >
                {m.navTitle}
              </button>
            ))}
          </div>
        </nav>

        {activeModule === '' ? (
          /* ═══════════════ LANDING / OVERVIEW ═══════════════ */
          <div className="ib-landing">
            {/* Hero */}
            <div className="ib-hero">
              <h1>The Complete Investment Banking<br/>Interview Guide</h1>
              <p className="ib-hero-sub">Everything you need to prep for IB interviews: financial modeling, accounting, valuation, M&amp;A, and leveraged buyouts, with practice questions and behavioral prep.</p>
            </div>

            {/* Container */}
            <div className="ib-container">
              {/* Table of Contents */}
              <div className="ib-toc">
                <h4>Table of Contents</h4>
                <ol>
                  {MODULES.filter(m => m.id !== 'quiz').map(m => (
                    <li key={m.id}>
                      <button onClick={() => setActiveModule(m.id)} className="ib-toc-link">
                        {m.moduleNum}: {m.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* How to Use */}
              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>2+ weeks:</strong> Go through each module in order. Spend 1-2 days per module, understanding concepts before memorizing answers.</p>
                <p><strong>1 week:</strong> Focus on Core Concepts, Accounting, and DCF Analysis - these cover 80% of technical questions. Then Behavioral.</p>
                <p><strong>1-2 days:</strong> Go straight to Interview Questions at the bottom of each module. Focus on Accounting and DCF, then Behavioral.</p>
              </div>

              {/* Module Cards */}
              <div className="ib-module-cards">
                {MODULES.filter(m => m.id !== 'quiz').map(m => (
                  <button key={m.id} className="ib-module-card" onClick={() => setActiveModule(m.id)}>
                    <div className="ib-module-card-num">{m.moduleNum}</div>
                    <div className="ib-module-card-title">{m.title}</div>
                    <div className="ib-module-card-sub">{m.sub}</div>
                    <div className="ib-module-card-meta">{m.sections.length} {m.sections.length === 1 ? 'topic' : 'topics'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : activeModule === 'quiz' ? (
          /* ═══════════════ QUIZ ═══════════════ */
          <div className="ib-container">
            <div className="ib-module-header-card ib-mh-quiz">
              <div className="ib-mh-num">{mod.moduleNum}</div>
              <h2>{mod.title}</h2>
              <p>{mod.sub}</p>
            </div>
            <div className="ib-quiz-wrap">
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"28px"}}>
                {['all','Accounting','Valuation','M&A','LBO','Capital Markets','Behavioral'].map(cat => (
                  <button key={cat} onClick={() => {setQuizFilter(cat);shuffleCards(cat);}} className={'ib-quiz-filter' + (quizFilter === cat ? ' active' : '')}>{cat==='all'?'All Topics':cat}</button>
                ))}
              </div>
              {shuffledCards.slice(0, 10).map((q,qi) => {
                const isRevealed = revealedAnswers[qi] === true;
                return (
                  <div key={qi} className="ib-quiz-card">
                    <div className="ib-quiz-card-top">
                      <span className="ib-quiz-card-num">{qi+1}</span>
                      <span className="ib-quiz-card-cat">{q.category}</span>
                    </div>
                    <div className="ib-quiz-card-q">{q.q}</div>
                    <button onClick={()=>setRevealedAnswers(p=>({...p,[qi]:!isRevealed}))} className="ib-quiz-reveal">{isRevealed?'Hide Answer':'Reveal Answer'}</button>
                    {isRevealed && <div className="ib-quiz-card-a">{q.a}</div>}
                  </div>
                );
              })}
              <div className="ib-quiz-footer">
                <span>10 of {quizFilter === 'all' ? IB_FLASHCARDS.length : IB_FLASHCARDS.filter(c => c.category === quizFilter).length} questions</span>
                <button onClick={()=>shuffleCards(quizFilter)} className="ib-quiz-new-set">New Set</button>
              </div>
            </div>
          </div>
        ) : (
          /* ═══════════════ MODULE READING VIEW ═══════════════ */
          <div className="ib-container">
            {/* Module Header Card */}
            <div className={'ib-module-header-card' + (mod.id === 'summary' ? ' ib-mh-summary' : '')}>
              <div className="ib-mh-num">{mod.moduleNum}</div>
              <h2>{mod.title}</h2>
              <p>{mod.sub}</p>
            </div>

            {/* Section Table of Contents (inline) */}
            {mod.sections.length > 2 && (
              <div className="ib-section-toc">
                <h4>In This Module</h4>
                <ol>
                  {mod.sections.map((s, i) => (
                    <li key={i}><button onClick={() => scrollToSection(i)} className="ib-toc-link">{s.title}</button></li>
                  ))}
                </ol>
              </div>
            )}

            {/* All sections rendered openly */}
            {mod.sections.map((s, i) => (
              <div
                key={`${activeModule}-${i}`}
                ref={el => { sectionRefs.current[`${activeModule}-${i}`] = el; }}
                className="ib-section"
              >
                <h3>{s.title}</h3>
                <div className="ib-section-body" dangerouslySetInnerHTML={{ __html: s.content }} />
              </div>
            ))}

            {/* Bottom navigation */}
            <div className="ib-bottom-nav">
              {(() => {
                const idx = MODULES.findIndex(m => m.id === activeModule);
                const prev = idx > 0 ? MODULES[idx - 1] : null;
                const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;
                return (
                  <>
                    {prev ? (
                      <button className="ib-bottom-nav-btn ib-bn-prev" onClick={() => setActiveModule(prev.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        <span>{prev.navTitle}</span>
                      </button>
                    ) : <div />}
                    <button className="ib-bottom-nav-btn ib-bn-overview" onClick={() => setActiveModule('')}>
                      All Modules
                    </button>
                    {next ? (
                      <button className="ib-bottom-nav-btn ib-bn-next" onClick={() => setActiveModule(next.id)}>
                        <span>{next.navTitle}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    ) : <div />}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
