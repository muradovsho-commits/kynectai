'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/cons-theme.css';

import { CONS_INDUSTRY_SECTIONS } from './cons-industry-data';
import { CONS_FRAMEWORKS_SECTIONS } from './cons-frameworks-data';
import { CONS_CASES_SECTIONS } from './cons-cases-data';
import { CONS_PROFITABILITY_SECTIONS } from './cons-profitability-data';
import { CONS_MARKETSIZING_SECTIONS } from './cons-marketsizing-data';
import { CONS_GROWTH_SECTIONS } from './cons-growth-data';
import { CONS_ADVANCED_CASES_SECTIONS } from './cons-advanced-cases-data';
import { CONS_OPERATIONS_SECTIONS } from './cons-operations-data';
import { CONS_BEHAVIORAL_SECTIONS } from './cons-behavioral-data';
import { CONS_PRACTICE_SECTIONS } from './cons-practice-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Consulting Industry', navTitle: 'Industry', sub: 'What management consultants do, the major firms, career paths, and day-to-day life.', moduleNum: 'Module 1', sections: CONS_INDUSTRY_SECTIONS },
  { id: 'frameworks', title: 'Structured Problem Solving', navTitle: 'Frameworks', sub: 'Hypothesis-driven thinking, MECE, issue trees, the Pyramid Principle, and 80/20 analysis.', moduleNum: 'Module 2', sections: CONS_FRAMEWORKS_SECTIONS },
  { id: 'cases', title: 'Case Interview Fundamentals', navTitle: 'Case Basics', sub: 'What cases test, the interview flow, common case types, and building custom frameworks.', moduleNum: 'Module 3', sections: CONS_CASES_SECTIONS },
  { id: 'profitability', title: 'Profitability & Turnaround Cases', navTitle: 'Profitability', sub: 'The profitability framework, revenue and cost trees, and turnaround-specific considerations.', moduleNum: 'Module 4', sections: CONS_PROFITABILITY_SECTIONS },
  { id: 'marketsizing', title: 'Market Sizing & Estimation', navTitle: 'Market Sizing', sub: 'Top-down vs. bottom-up approaches, methodology, and common traps.', moduleNum: 'Module 5', sections: CONS_MARKETSIZING_SECTIONS },
  { id: 'growth', title: 'Growth Strategy & Market Entry', navTitle: 'Growth', sub: 'The growth strategy framework and market entry case analysis.', moduleNum: 'Module 6', sections: CONS_GROWTH_SECTIONS },
  { id: 'advanced_cases', title: 'M&A, Pricing & Competitive Response', navTitle: 'M&A / Pricing', sub: 'M&A cases in consulting, pricing strategy, and competitive response frameworks.', moduleNum: 'Module 7', sections: CONS_ADVANCED_CASES_SECTIONS },
  { id: 'operations', title: 'Operations & Implementation', navTitle: 'Operations', sub: 'Operations cases, supply chain, capacity planning, and implementation challenges.', moduleNum: 'Module 8', sections: CONS_OPERATIONS_SECTIONS },
  { id: 'behavioral', title: 'Behavioral & Fit Interviews', navTitle: 'Behavioral', sub: 'Why behavioral matters, STAR framework, key themes, and common mistakes.', moduleNum: 'Module 9', sections: CONS_BEHAVIORAL_SECTIONS },
  { id: 'practice', title: 'Full Practice Cases', navTitle: 'Practice', sub: 'Complete case walkthroughs with frameworks, analysis, and recommendations.', moduleNum: 'Module 10', sections: CONS_PRACTICE_SECTIONS },
];

export default function ConsultingInterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [_userName, _setUserName] = useState({ first: '', last: '' });
  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      const effectivePlan = prof.plan || plan;
      setUserPlan(effectivePlan);
      if (effectivePlan !== 'pro' && effectivePlan !== 'elite') {
        router.replace('/checkout');
        return;
      }
    } catch { setUserPlan('free'); router.replace('/checkout'); }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); _setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
  }, []);

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
      <Sidebar activePage="consulting-interview-prep" />

      <main className="main ib-guide-main cons-theme" ref={contentRef}>
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>

        <nav className="ib-module-nav">
          <div className="ib-module-nav-inner">
            {MODULES.map(m => (
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
          <div className="ib-landing">
            <div className="ib-hero">
              <h1>The Complete Management<br/>Consulting Guide</h1>
              <p className="ib-hero-sub">From structured problem solving and case interview mastery to behavioral fit - everything you need to land an offer at MBB and top strategy firms.</p>
            </div>

            <div className="ib-container">
              <div className="ib-toc">
                <h4>Table of Contents</h4>
                <ol>
                  {MODULES.map(m => (
                    <li key={m.id}>
                      <button onClick={() => setActiveModule(m.id)} className="ib-toc-link">
                        {m.moduleNum}: {m.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>New to consulting:</strong> Start with Modules 1-3 to understand the industry, frameworks, and case interview mechanics before diving into specific case types.</p>
                <p><strong>Case practice:</strong> Modules 4-8 cover every major case type with frameworks, examples, and walkthroughs. Work through them systematically.</p>
                <p><strong>Interview ready:</strong> Module 9 covers behavioral prep, and Module 10 provides full practice cases to simulate real interview conditions.</p>
              </div>

              <div className="ib-module-cards">
                {MODULES.map(m => (
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
        ) : (
          <div className="ib-container">
            <div className="ib-module-header-card">
              <div className="ib-mh-num">{mod.moduleNum}</div>
              <h2>{mod.title}</h2>
              <p>{mod.sub}</p>
            </div>

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
