'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/am-theme.css';

import { AM_INDUSTRY_SECTIONS } from './am-industry-data';
import { AM_RESEARCH_SECTIONS } from './am-research-data';
import { AM_VALUATION_SECTIONS } from './am-valuation-data';
import { AM_FINANCIAL_ANALYSIS_SECTIONS } from './am-financial-analysis-data';
import { AM_FIXED_INCOME_SECTIONS } from './am-fixed-income-data';
import { AM_PORTFOLIO_SECTIONS } from './am-portfolio-data';
import { AM_INDUSTRY_LANDSCAPE_SECTIONS } from './am-industry-landscape-data';
import { AM_STOCK_PITCH_SECTIONS } from './am-stock-pitch-data';
import { AM_RISK_SECTIONS } from './am-risk-data';
import { AM_INTERVIEW_SECTIONS } from './am-interview-data';

type Section = { title: string; content: string };

// Strip leading section numbers like "9.1 " or "9.4-9.5 " at render time.
// Requires the N.M decimal form so it can never clip a real title.
const cleanSectionTitle = (t: string) => t.replace(/^\d+\.\d+(-\d+(\.\d+)?)?\s+/, '');

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Asset Management Industry', navTitle: 'Industry', sub: 'What asset managers do, how they make money, the major players, and roles in the industry.', moduleNum: 'Module 1', sections: AM_INDUSTRY_SECTIONS },
  { id: 'research', title: 'Equity Research & Fundamental Analysis', navTitle: 'Research', sub: 'The research process, primary research, and sector-specific analysis frameworks.', moduleNum: 'Module 2', sections: AM_RESEARCH_SECTIONS },
  { id: 'valuation', title: 'Valuation Methods', navTitle: 'Valuation', sub: 'DCF, relative valuation, sum-of-the-parts, DDM, and asset-based valuation.', moduleNum: 'Module 3', sections: AM_VALUATION_SECTIONS },
  { id: 'financial_analysis', title: 'Financial Statement Analysis & Quality of Earnings', navTitle: 'Financials', sub: 'Revenue quality, earnings quality, cash flow analysis, and balance sheet red flags.', moduleNum: 'Module 4', sections: AM_FINANCIAL_ANALYSIS_SECTIONS },
  { id: 'fixed_income', title: 'Fixed Income & Credit Analysis', navTitle: 'Fixed Income', sub: 'Bond fundamentals, credit analysis, and the yield curve.', moduleNum: 'Module 5', sections: AM_FIXED_INCOME_SECTIONS },
  { id: 'portfolio', title: 'Portfolio Theory & Construction', navTitle: 'Portfolio', sub: 'Modern portfolio theory, factor investing, and portfolio construction in practice.', moduleNum: 'Module 6', sections: AM_PORTFOLIO_SECTIONS },
  { id: 'landscape', title: 'Fund Structures & Strategies', navTitle: 'Fund Types', sub: 'Passive vs. active management, fund vehicle types, and hedge fund strategies.', moduleNum: 'Module 7', sections: AM_INDUSTRY_LANDSCAPE_SECTIONS },
  { id: 'stock_pitch', title: 'The Stock Pitch', navTitle: 'Stock Pitch', sub: 'What makes a great stock pitch and common mistakes to avoid.', moduleNum: 'Module 8', sections: AM_STOCK_PITCH_SECTIONS },
  { id: 'risk', title: 'Risk Management & Behavioral Finance', navTitle: 'Risk', sub: 'Types of risk, measurement tools, and behavioral finance biases.', moduleNum: 'Module 9', sections: AM_RISK_SECTIONS },
  { id: 'interview', title: 'Interview Preparation & Questions', navTitle: 'Interview Qs', sub: 'Interview format, technical questions, and preparing for the stock pitch.', moduleNum: 'Module 10', sections: AM_INTERVIEW_SECTIONS },
];

export default function AMInterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [_userName, _setUserName] = useState({ first: '', last: '' });
  const [messagesSent, setMessagesSent] = useState(0);


  // ─── Plan gate (server-truth via Convex one-shot) ────────────────────────
  // Replaces a raw localStorage check, which a free user could bypass by
  // editing devtools. Now we wait for Convex verification before allowing
  // content to render. During warm-start (isVerified=false), we trust
  // localStorage so paying users on slow networks aren't bounced.
  const { plan: userPlan, isVerified } = useUserPlanStatus();
  const isPaid = userPlan === 'pro' || userPlan === 'elite';
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); return; }
    if (isVerified && !isPaid) { router.replace('/checkout'); }
  }, [router, isVerified, isPaid]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) { const p = JSON.parse(raw); _setUserName({ first: p.firstName || '', last: p.lastName || '' }); }
    } catch {}
  }, []);



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
      <Sidebar activePage="am-interview-prep" />

      <main className="main ib-guide-main am-theme" ref={contentRef}>
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>

        <nav className="ib-module-nav">
          <div className="ib-module-nav-inner">
            {MODULES.map(m => (
              <button key={m.id} className={'ib-nav-tab' + (activeModule === m.id ? ' active' : '')} onClick={() => setActiveModule(m.id)}>
                {m.navTitle}
              </button>
            ))}
          </div>
        </nav>

        {activeModule === '' ? (
          <div className="ib-landing">
            <div className="ib-hero">
              <h1>The Complete Asset Management<br/>Interview Guide</h1>
              <p className="ib-hero-sub">From equity research and valuation to portfolio theory, risk management, and the stock pitch - everything you need to break into asset management and buy-side roles.</p>
            </div>

            <div className="ib-container">
              <div className="ib-toc">
                <h4>Table of Contents</h4>
                <ol>
                  {MODULES.map(m => (
                    <li key={m.id}>
                      <button onClick={() => setActiveModule(m.id)} className="ib-toc-link">{m.moduleNum}: {m.title}</button>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>New to AM:</strong> Start with Modules 1-3 to understand the industry, research process, and core valuation methods before tackling advanced topics.</p>
                <p><strong>Interview prep:</strong> Focus on Modules 8 and 10 - the stock pitch is the centerpiece of most buy-side interviews.</p>
                <p><strong>Deep dive:</strong> Modules 4-7 cover financial analysis, fixed income, portfolio theory, and fund structures for comprehensive preparation.</p>
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
