'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/st-theme.css';

import { ST_INDUSTRY_SECTIONS } from './st-industry-data';
import { ST_MARKET_STRUCTURE_SECTIONS } from './st-market-structure-data';
import { ST_EQUITIES_SECTIONS } from './st-equities-data';
import { ST_FIXED_INCOME_SECTIONS } from './st-fixed-income-data';
import { ST_DERIVATIVES_SECTIONS } from './st-derivatives-data';
import { ST_MACRO_SECTIONS } from './st-macro-data';
import { ST_RISK_SECTIONS } from './st-risk-data';
import { ST_STRATEGIES_SECTIONS } from './st-strategies-data';
import { ST_MENTAL_MATH_SECTIONS } from './st-mental-math-data';
import { ST_INTERVIEW_SECTIONS } from './st-interview-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The S&T Industry & Business Model', navTitle: 'Industry', sub: 'What S&T is, the three roles on the floor, how desks make money, and S&T vs. IB.', moduleNum: 'Module 1', sections: ST_INDUSTRY_SECTIONS },
  { id: 'market_structure', title: 'Market Structure & How Trading Works', navTitle: 'Markets', sub: 'Exchange-traded vs. OTC, order types, liquidity, clearing and settlement.', moduleNum: 'Module 2', sections: ST_MARKET_STRUCTURE_SECTIONS },
  { id: 'equities', title: 'Equities', navTitle: 'Equities', sub: 'Cash equities, equity derivatives, and prime brokerage.', moduleNum: 'Module 3', sections: ST_EQUITIES_SECTIONS },
  { id: 'fixed_income', title: 'Fixed Income & Rates', navTitle: 'Fixed Income', sub: 'Government bonds, corporate credit, and structured products.', moduleNum: 'Module 4', sections: ST_FIXED_INCOME_SECTIONS },
  { id: 'derivatives', title: 'Derivatives - Options, Futures & Swaps', navTitle: 'Derivatives', sub: 'Options fundamentals, the Greeks, futures, interest rate swaps, and CDS.', moduleNum: 'Module 5', sections: ST_DERIVATIVES_SECTIONS },
  { id: 'macro', title: 'FX & Commodities', navTitle: 'FX / Commodities', sub: 'Foreign exchange markets and commodity trading.', moduleNum: 'Module 6', sections: ST_MACRO_SECTIONS },
  { id: 'risk', title: 'Risk Management & P&L Attribution', navTitle: 'Risk / P&L', sub: 'Risk measures, VaR, Greeks-based risk, and P&L attribution.', moduleNum: 'Module 7', sections: ST_RISK_SECTIONS },
  { id: 'strategies', title: 'Trading Strategies & Market-Making', navTitle: 'Strategies', sub: 'Market-making, relative value, flow trading, and macro/directional strategies.', moduleNum: 'Module 8', sections: ST_STRATEGIES_SECTIONS },
  { id: 'mental_math', title: 'Mental Math & Brainteasers', navTitle: 'Mental Math', sub: 'Mental math essentials, practice drills, probability and expected value.', moduleNum: 'Module 9', sections: ST_MENTAL_MATH_SECTIONS },
  { id: 'interview', title: 'Interview Preparation', navTitle: 'Interview Qs', sub: 'The S&T interview format, market knowledge requirements, and common mistakes.', moduleNum: 'Module 10', sections: ST_INTERVIEW_SECTIONS },
];

export default function STInterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    const plan = localStorage.getItem('offerbell_plan') || 'free';
    try { const p = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); if ((p.plan || plan) !== 'pro' && (p.plan || plan) !== 'elite') { router.replace('/checkout'); return; } } catch { router.replace('/checkout'); }
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
      <Sidebar activePage="st-interview-prep" />

      <main className="main ib-guide-main st-theme" ref={contentRef}>
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>

        <nav className="ib-module-nav">
          <div className="ib-module-nav-inner">
            {MODULES.map(m => (
              <button key={m.id} className={'ib-nav-tab' + (activeModule === m.id ? ' active' : '')} onClick={() => setActiveModule(m.id)}>{m.navTitle}</button>
            ))}
          </div>
        </nav>

        {activeModule === '' ? (
          <div className="ib-landing">
            <div className="ib-hero">
              <h1>The Complete Sales &amp; Trading<br/>Technical Guide</h1>
              <p className="ib-hero-sub">Market structure, derivatives, risk management, mental math, and trading strategies - everything you need to land a seat on the trading floor.</p>
            </div>

            <div className="ib-container">
              <div className="ib-toc">
                <h4>Table of Contents</h4>
                <ol>
                  {MODULES.map(m => (
                    <li key={m.id}><button onClick={() => setActiveModule(m.id)} className="ib-toc-link">{m.moduleNum}: {m.title}</button></li>
                  ))}
                </ol>
              </div>

              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>Foundations:</strong> Modules 1-2 cover what S&T is and how markets work. Essential context before diving into products.</p>
                <p><strong>Products:</strong> Modules 3-6 cover every major asset class - equities, fixed income, derivatives, FX, and commodities.</p>
                <p><strong>Interview prep:</strong> Modules 7-10 cover risk, strategies, mental math (critical for S&T), and the interview itself.</p>
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
              <div key={`${activeModule}-${i}`} ref={el => { sectionRefs.current[`${activeModule}-${i}`] = el; }} className="ib-section">
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
                    <button className="ib-bottom-nav-btn ib-bn-overview" onClick={() => setActiveModule('')}>All Modules</button>
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
