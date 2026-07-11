'use client';

import Topbar from "../components/Topbar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
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
import { ST_FUTURES_SWAPS_SECTIONS } from './st-futures-swaps-data';
import { ST_PROBABILITY_SECTIONS } from './st-probability-data';
import { ST_BRAINTEASERS_SECTIONS } from './st-brainteasers-data';
import { ST_MARKETS_SECTIONS } from './st-markets-data';
import { ST_BEHAVIORAL_SECTIONS } from './st-behavioral-data';

type Section = { title: string; content: string };

// Strip leading section numbers like "9.1 " or "9.4-9.5 " at render time.
// Requires the N.M decimal form so it can never clip a real title.
const cleanSectionTitle = (t: string) => t.replace(/^\d+\.\d+(-\d+(\.\d+)?)?\s+/, '');

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The S&T Industry & Business Model', navTitle: 'Industry', sub: 'What S&T is, the three roles on the floor, how desks make money, and S&T vs IB.', moduleNum: 'Module 1', sections: ST_INDUSTRY_SECTIONS },
  { id: 'market_structure', title: 'Market Structure & How Trading Works', navTitle: 'Markets', sub: 'Exchange vs OTC, the order book and bid-ask spread, order types, liquidity, and clearing.', moduleNum: 'Module 2', sections: ST_MARKET_STRUCTURE_SECTIONS },
  { id: 'equities', title: 'Equities', navTitle: 'Equities', sub: 'Cash equities, ETFs, short selling and securities lending, equity derivatives, and prime brokerage.', moduleNum: 'Module 3', sections: ST_EQUITIES_SECTIONS },
  { id: 'fixed_income', title: 'Fixed Income & Rates', navTitle: 'Fixed Income', sub: 'The price-yield relationship, duration and convexity, the yield curve, credit, and repo.', moduleNum: 'Module 4', sections: ST_FIXED_INCOME_SECTIONS },
  { id: 'options', title: 'Options & the Greeks', navTitle: 'Options', sub: 'Calls and puts, moneyness, the Greeks, volatility, put-call parity, and option strategies.', moduleNum: 'Module 5', sections: ST_DERIVATIVES_SECTIONS },
  { id: 'futures_swaps', title: 'Futures, Swaps & Credit Derivatives', navTitle: 'Futures / Swaps', sub: 'Forwards and futures, contango and backwardation, interest rate swaps, and CDS.', moduleNum: 'Module 6', sections: ST_FUTURES_SWAPS_SECTIONS },
  { id: 'fx_commodities', title: 'FX & Commodities', navTitle: 'FX / Commodities', sub: 'Currency pairs, what drives them, the carry trade, and commodity markets.', moduleNum: 'Module 7', sections: ST_MACRO_SECTIONS },
  { id: 'mental_math', title: 'Mental Math', navTitle: 'Mental Math', sub: 'Why it is tested, the core techniques, and worked drills to build speed and accuracy.', moduleNum: 'Module 8', sections: ST_MENTAL_MATH_SECTIONS },
  { id: 'probability', title: 'Probability & Expected Value', navTitle: 'Probability / EV', sub: 'Expected value, probability essentials, and edge, variance, and bet sizing.', moduleNum: 'Module 9', sections: ST_PROBABILITY_SECTIONS },
  { id: 'brainteasers', title: 'Brainteasers & Estimation', navTitle: 'Brainteasers', sub: 'What they really test, a universal approach, market-sizing, and worked examples by type.', moduleNum: 'Module 10', sections: ST_BRAINTEASERS_SECTIONS },
  { id: 'markets', title: 'Markets & Forming a View', navTitle: 'Market Views', sub: 'Following markets, how to pitch a trade idea, and talking markets without sounding scripted.', moduleNum: 'Module 11', sections: ST_MARKETS_SECTIONS },
  { id: 'risk', title: 'Risk Management & P&L Attribution', navTitle: 'Risk / P&L', sub: 'The kinds of risk, VaR and the Greeks, and managing the book and attributing P&L.', moduleNum: 'Module 12', sections: ST_RISK_SECTIONS },
  { id: 'strategies', title: 'Trading Strategies & Market-Making', navTitle: 'Strategies', sub: 'Market-making up close, relative value and arbitrage, and flow, directional, and systematic strategies.', moduleNum: 'Module 13', sections: ST_STRATEGIES_SECTIONS },
  { id: 'behavioral', title: 'Behavioral, Fit & Why S&T', navTitle: 'Behavioral', sub: 'Why S&T and sales vs trading, the temperament desks screen for, and composure and curiosity.', moduleNum: 'Module 14', sections: ST_BEHAVIORAL_SECTIONS },
  { id: 'interview', title: 'Interview Preparation', navTitle: 'Interview Qs', sub: 'The interview format, technical and math/brainteaser questions with answers, mistakes, and a glossary.', moduleNum: 'Module 15', sections: ST_INTERVIEW_SECTIONS },
];

export default function STInterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ─── Plan gate (server-truth via Convex one-shot) ────────────────────────
  // Replaces a raw localStorage check, which a free user could bypass by
  // editing devtools. Now we wait for Convex verification before allowing
  // content to render. During warm-start (isVerified=false), we trust
  // localStorage so paying users on slow networks aren't bounced.
  const { plan: userPlan, isVerified } = useUserPlanStatus();
  const isPaid = userPlan === 'pro' || userPlan === 'elite';
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    if (isVerified && !isPaid) { router.replace('/checkout'); }
  }, [router, isVerified, isPaid]);

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

  if (!isPaid) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fafaf9',fontFamily:"'Sora',-apple-system,sans-serif",color:'#52525b',fontSize:14}}>Loading…</div>;

    return (
    <div className="app">
      <Topbar activePage="st-interview-prep" />

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
              <h1>The Complete Sales &amp; Trading<br/>Interview Guide</h1>
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
                <p><strong>Foundations:</strong> Modules 1-2 cover what S&T is and how markets actually work. Essential context before the products.</p>
                <p><strong>Products:</strong> Modules 3-7 cover every major asset class - equities, fixed income, options, futures and swaps, and FX and commodities.</p>
                <p><strong>Trading skills:</strong> Modules 8-11 build the skills S&T tests live - mental math, probability and expected value, brainteasers, and forming and pitching a market view.</p>
                <p><strong>Risk and strategy:</strong> Modules 12-13 cover risk management and P&L, plus market-making and trading strategies.</p>
                <p><strong>Interview ready:</strong> Modules 14-15 cover behavioral and fit, then the interview itself with questions, answers, and a glossary.</p>
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
                    <li key={i}><button onClick={() => scrollToSection(i)} className="ib-toc-link">{cleanSectionTitle(s.title)}</button></li>
                  ))}
                </ol>
              </div>
            )}

            {mod.sections.map((s, i) => (
              <div key={`${activeModule}-${i}`} ref={el => { sectionRefs.current[`${activeModule}-${i}`] = el; }} className="ib-section">
                <h3>{cleanSectionTitle(s.title)}</h3>
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
