'use client';

import Topbar from "../components/Topbar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/re-theme.css';

import { RE_INDUSTRY_SECTIONS } from './re-industry-data';
import { RE_PROPERTY_SECTIONS } from './re-property-data';
import { RE_NOI_SECTIONS } from './re-noi-data';
import { RE_WATERFALL_SECTIONS } from './re-waterfall-data';
import { RE_REIB_SECTIONS } from './re-reib-data';
import { RE_VALUATION_SECTIONS } from './re-valuation-data';
import { RE_LEASES_SECTIONS } from './re-leases-data';
import { RE_MODELING_SECTIONS } from './re-modeling-data';
import { RE_REPE_SECTIONS } from './re-repe-data';
import { RE_REITS_SECTIONS } from './re-reits-data';
import { RE_DEBT_SECTIONS } from './re-debt-data';
import { RE_DEVELOPMENT_SECTIONS } from './re-development-data';
import { RE_INTERVIEW_SECTIONS } from './re-interview-data';

type Section = { title: string; content: string };

// Strip leading section numbers like "9.1 " or "9.4-9.5 " at render time.
// Requires the N.M decimal form so it can never clip a real title.
const cleanSectionTitle = (t: string) => t.replace(/^\d+\.\d+(-\d+(\.\d+)?)?\s+/, '');

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Real Estate Finance Landscape', navTitle: 'Landscape', sub: 'Why real estate is its own asset class, the capital stack, and how the career paths differ.', moduleNum: 'Module 1', sections: RE_INDUSTRY_SECTIONS },
  { id: 'property', title: 'Property Types & Market Fundamentals', navTitle: 'Property Types', sub: 'The major and specialty property types, supply and demand, and the real estate cycle.', moduleNum: 'Module 2', sections: RE_PROPERTY_SECTIONS },
  { id: 'noi', title: 'NOI & Cash Flow Fundamentals', navTitle: 'NOI & Cash Flow', sub: 'Building NOI top-down, operating expenses, the capital items below NOI, and the value of NOI growth.', moduleNum: 'Module 3', sections: RE_NOI_SECTIONS },
  { id: 'valuation', title: 'Valuation & Cap Rates', navTitle: 'Valuation', sub: 'The cap rate properly understood, what drives it, going-in vs exit, and the three approaches to value.', moduleNum: 'Module 4', sections: RE_VALUATION_SECTIONS },
  { id: 'leases', title: 'Lease Analysis & Tenant Economics', navTitle: 'Leases', sub: 'Gross vs net leases, critical lease terms, rent roll and rollover analysis, and tenant credit.', moduleNum: 'Module 5', sections: RE_LEASES_SECTIONS },
  { id: 'debt', title: 'Real Estate Debt & Capital Markets', navTitle: 'RE Debt', sub: 'Why leverage is central, the key debt metrics, types of debt, and structural terms.', moduleNum: 'Module 6', sections: RE_DEBT_SECTIONS },
  { id: 'modeling', title: 'Real Estate Financial Modeling', navTitle: 'Modeling', sub: 'The pro forma, the return metrics, yield on cost and the development spread, and sensitivity.', moduleNum: 'Module 7', sections: RE_MODELING_SECTIONS },
  { id: 'waterfall', title: 'The Equity Waterfall & Promote', navTitle: 'Waterfall', sub: 'The GP/LP split, the four tiers, a worked waterfall, and hurdles and catch-ups.', moduleNum: 'Module 8', sections: RE_WATERFALL_SECTIONS },
  { id: 'repe', title: 'Real Estate Private Equity (REPE)', navTitle: 'REPE', sub: 'The four strategies, the value creation playbook, the deal process, and fund structures.', moduleNum: 'Module 9', sections: RE_REPE_SECTIONS },
  { id: 'development', title: 'Development & Construction', navTitle: 'Development', sub: 'The development process, the development pro forma, construction financing, and key risks.', moduleNum: 'Module 10', sections: RE_DEVELOPMENT_SECTIONS },
  { id: 'reits', title: 'REITs & Public Real Estate', navTitle: 'REITs', sub: 'What a REIT is, FFO and AFFO, valuing a REIT via NAV and FFO multiples, and the rates lens.', moduleNum: 'Module 11', sections: RE_REITS_SECTIONS },
  { id: 'reib', title: 'Real Estate Investment Banking (REIB)', navTitle: 'REIB', sub: 'Entity-level valuation, FFO accretion, REIT M&A, and capital raising.', moduleNum: 'Module 12', sections: RE_REIB_SECTIONS },
  { id: 'interview', title: 'Interview Preparation', navTitle: 'Interview Qs', sub: 'The format across tracks, a full worked acquisition case, a question bank, common mistakes, and a glossary.', moduleNum: 'Module 13', sections: RE_INTERVIEW_SECTIONS },
];

export default function REInterviewPrepPage() {
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
  const scrollToSection = (idx: number) => { const el = sectionRefs.current[`${activeModule}-${idx}`]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo({ top: 0 }); }, [activeModule]);

  if (!isPaid) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fafaf9',fontFamily:"'Sora',-apple-system,sans-serif",color:'#52525b',fontSize:14}}>Loading…</div>;

    return (
    <div className="app">
      <Topbar activePage="re-interview-prep" />
      <main className="main ib-guide-main re-theme" ref={contentRef}>
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>
        <nav className="ib-module-nav"><div className="ib-module-nav-inner">
          {MODULES.map(m => (<button key={m.id} className={'ib-nav-tab' + (activeModule === m.id ? ' active' : '')} onClick={() => setActiveModule(m.id)}>{m.navTitle}</button>))}
        </div></nav>

        {activeModule === '' ? (
          <div className="ib-landing">
            <div className="ib-hero">
              <h1>The Complete Real Estate<br/>Interview Guide</h1>
              <p className="ib-hero-sub">From NOI and cap rates to REPE strategies, waterfall structures, and property-level analysis - everything you need to break into real estate finance.</p>
            </div>
            <div className="ib-container">
              <div className="ib-toc"><h4>Table of Contents</h4><ol>
                {MODULES.map(m => (<li key={m.id}><button onClick={() => setActiveModule(m.id)} className="ib-toc-link">{m.moduleNum}: {m.title}</button></li>))}
              </ol></div>
              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>Foundations:</strong> Modules 1-6 cover the RE landscape, property types, NOI and cash flow, valuation and cap rates, leases, and debt - the core knowledge base every track is built on.</p>
                <p><strong>Advanced:</strong> Modules 7-12 cover modeling, the equity waterfall, REPE, development, REITs, and REIB - the specialized technical and track-specific skills.</p>
                <p><strong>Interview ready:</strong> Module 13 covers the format across tracks, a full worked acquisition case, the question bank, and common mistakes.</p>
              </div>
              <div className="ib-module-cards">
                {MODULES.map(m => (<button key={m.id} className="ib-module-card" onClick={() => setActiveModule(m.id)}>
                  <div className="ib-module-card-num">{m.moduleNum}</div>
                  <div className="ib-module-card-title">{m.title}</div>
                  <div className="ib-module-card-sub">{m.sub}</div>
                  <div className="ib-module-card-meta">{m.sections.length} {m.sections.length === 1 ? 'topic' : 'topics'}</div>
                </button>))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ib-container">
            <div className="ib-module-header-card"><div className="ib-mh-num">{mod.moduleNum}</div><h2>{mod.title}</h2><p>{mod.sub}</p></div>
            {mod.sections.length > 2 && (<div className="ib-section-toc"><h4>In This Module</h4><ol>
              {mod.sections.map((s, i) => (<li key={i}><button onClick={() => scrollToSection(i)} className="ib-toc-link">{cleanSectionTitle(s.title)}</button></li>))}
            </ol></div>)}
            {mod.sections.map((s, i) => (
              <div key={`${activeModule}-${i}`} ref={el => { sectionRefs.current[`${activeModule}-${i}`] = el; }} className="ib-section">
                <h3>{cleanSectionTitle(s.title)}</h3>
                <div className="ib-section-body" dangerouslySetInnerHTML={{ __html: s.content }} />
              </div>
            ))}
            <div className="ib-bottom-nav">
              {(() => { const idx = MODULES.findIndex(m => m.id === activeModule); const prev = idx > 0 ? MODULES[idx - 1] : null; const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null; return (<>
                {prev ? (<button className="ib-bottom-nav-btn ib-bn-prev" onClick={() => setActiveModule(prev.id)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span>{prev.navTitle}</span></button>) : <div />}
                <button className="ib-bottom-nav-btn ib-bn-overview" onClick={() => setActiveModule('')}>All Modules</button>
                {next ? (<button className="ib-bottom-nav-btn ib-bn-next" onClick={() => setActiveModule(next.id)}><span>{next.navTitle}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>) : <div />}
              </>); })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
