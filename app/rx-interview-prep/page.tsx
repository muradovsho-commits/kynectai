'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/rx-theme.css';

import { RX_OVERVIEW_SECTIONS } from './rx-overview-data';
import { RX_DISTRESS_SECTIONS } from './rx-distress-data';
import { RX_OUT_OF_COURT_SECTIONS } from './rx-out-of-court-data';
import { RX_CHAPTER11_SECTIONS } from './rx-chapter11-data';
import { RX_WATERFALL_SECTIONS } from './rx-waterfall-data';
import { RX_CREDIT_SECTIONS } from './rx-credit-data';
import { RX_CASE_STUDY_SECTIONS } from './rx-case-study-data';
import { RX_VALUATION_SECTIONS } from './rx-valuation-data';
import { RX_RETURNS_SECTIONS } from './rx-returns-data';
import { RX_STRUCTURAL_SECTIONS } from './rx-structural-data';
import { RX_LME_SECTIONS } from './rx-lme-data';
import { RX_INTERVIEW_SECTIONS } from './rx-interview-data';

type Section = { title: string; content: string };

// Strip leading section numbers like "9.1 " or "9.4-9.5 " at render time.
// Requires the N.M decimal form so it can never clip a real title.
const cleanSectionTitle = (t: string) => t.replace(/^\d+\.\d+(-\d+(\.\d+)?)?\s+/, '');

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'overview', title: 'The Restructuring Industry', navTitle: 'Industry', sub: 'What restructuring is, who the key players are, and what the day-to-day work looks like.', moduleNum: 'Module 1', sections: RX_OVERVIEW_SECTIONS },
  { id: 'distress', title: 'Causes of Distress & the Capital Structure', navTitle: 'Distress', sub: 'Common causes of financial distress, signs to watch for, the capital structure hierarchy, and the credit documents that govern it.', moduleNum: 'Module 2', sections: RX_DISTRESS_SECTIONS },
  { id: 'out_of_court', title: 'Out-of-Court Restructuring Solutions', navTitle: 'Out-of-Court', sub: 'Why out-of-court is preferred and the tools available for consensual restructuring.', moduleNum: 'Module 3', sections: RX_OUT_OF_COURT_SECTIONS },
  { id: 'chapter11', title: 'Chapter 11 Bankruptcy', navTitle: 'Chapter 11', sub: 'Chapter 11 vs. Chapter 7, the case timeline, types of filings, and key bankruptcy concepts.', moduleNum: 'Module 4', sections: RX_CHAPTER11_SECTIONS },
  { id: 'waterfall', title: 'Waterfall Analysis & Recovery Values', navTitle: 'Waterfalls', sub: 'How waterfalls work, multiple worked examples, where tranches trade, and equity value in distress.', moduleNum: 'Module 5', sections: RX_WATERFALL_SECTIONS },
  { id: 'credit', title: 'Bond Math & Yield Analysis', navTitle: 'Bond Math', sub: 'Yield to maturity, current yield, yield to worst, accrued interest, and distressed pricing.', moduleNum: 'Module 6', sections: RX_CREDIT_SECTIONS },
  { id: 'case_study', title: 'Cap Tables & Liquidity Analysis', navTitle: 'Cap Tables', sub: 'Building cap tables, the 13-week liquidity model, reading a structure like an RX banker, and the work product.', moduleNum: 'Module 7', sections: RX_CASE_STUDY_SECTIONS },
  { id: 'valuation', title: 'Valuation in Distress', navTitle: 'Valuation', sub: 'Why valuation decides recoveries, going-concern vs liquidation, EBITDA quality, and the multiple.', moduleNum: 'Module 8', sections: RX_VALUATION_SECTIONS },
  { id: 'returns', title: 'Returns & Distressed Investing', navTitle: 'Returns', sub: 'From recoveries to returns, MOIC and the IRR shortcut, choosing the tranche, and loan-to-own.', moduleNum: 'Module 9', sections: RX_RETURNS_SECTIONS },
  { id: 'structural', title: 'Structural Subordination & HoldCo/OpCo', navTitle: 'Structural Sub', sub: 'What structural subordination is, the HoldCo/OpCo mechanism, and upstream and downstream guarantees.', moduleNum: 'Module 10', sections: RX_STRUCTURAL_SECTIONS },
  { id: 'lme', title: 'Liability Management Exercises (LMEs)', navTitle: 'LMEs', sub: 'Uptier transactions, drop-down transactions, and the double-dip in depth.', moduleNum: 'Module 11', sections: RX_LME_SECTIONS },
  { id: 'interview', title: 'Interview Questions & Case Study', navTitle: 'Interview Qs', sub: 'Approach, a full worked case study, a 26-question bank with model answers, and a glossary.', moduleNum: 'Module 12', sections: RX_INTERVIEW_SECTIONS },
];

export default function RXInterviewPrepPage() {
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
      <Sidebar activePage="rx-interview-prep" />

      <main className="main ib-guide-main rx-theme" ref={contentRef}>
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
              <h1>The Complete Restructuring<br/>Interview Guide</h1>
              <p className="ib-hero-sub">From Chapter 11 mechanics and waterfall analysis to liability management exercises and distressed valuation - the most intellectually demanding area of finance.</p>
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
                <p><strong>Foundations:</strong> Start with Modules 1-4 to understand the industry, causes of distress and the capital structure, out-of-court solutions, and Chapter 11 mechanics.</p>
                <p><strong>Technical depth:</strong> Modules 5-11 cover waterfall and recovery analysis, bond math, cap tables and liquidity, distressed valuation, returns and distressed investing, structural subordination, and LMEs - the core technical toolkit.</p>
                <p><strong>Interview ready:</strong> Module 12 covers the exact questions and the worked case study format you'll encounter in restructuring interviews.</p>
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
