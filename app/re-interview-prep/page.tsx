'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/re-theme.css';

import { RE_INDUSTRY_SECTIONS } from './re-industry-data';
import { RE_PROPERTY_SECTIONS } from './re-property-data';
import { RE_VALUATION_SECTIONS } from './re-valuation-data';
import { RE_LEASES_SECTIONS } from './re-leases-data';
import { RE_MODELING_SECTIONS } from './re-modeling-data';
import { RE_REPE_SECTIONS } from './re-repe-data';
import { RE_REITS_SECTIONS } from './re-reits-data';
import { RE_DEBT_SECTIONS } from './re-debt-data';
import { RE_DEVELOPMENT_SECTIONS } from './re-development-data';
import { RE_INTERVIEW_SECTIONS } from './re-interview-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Real Estate Finance Landscape', navTitle: 'Landscape', sub: 'Why real estate is different from other asset classes and the major career paths.', moduleNum: 'Module 1', sections: RE_INDUSTRY_SECTIONS },
  { id: 'property', title: 'Property Types & Market Fundamentals', navTitle: 'Property Types', sub: 'The five core property types, specialty sectors, and market cycles.', moduleNum: 'Module 2', sections: RE_PROPERTY_SECTIONS },
  { id: 'valuation', title: 'Real Estate Valuation', navTitle: 'Valuation', sub: 'Net operating income, the three approaches to value, and key valuation metrics.', moduleNum: 'Module 3', sections: RE_VALUATION_SECTIONS },
  { id: 'leases', title: 'Lease Analysis & Tenant Economics', navTitle: 'Leases', sub: 'Lease structures, critical lease terms, and rent roll analysis.', moduleNum: 'Module 4', sections: RE_LEASES_SECTIONS },
  { id: 'modeling', title: 'Real Estate Financial Modeling', navTitle: 'Modeling', sub: 'The real estate pro forma and waterfall distribution structures.', moduleNum: 'Module 5', sections: RE_MODELING_SECTIONS },
  { id: 'repe', title: 'Real Estate Private Equity (REPE)', navTitle: 'REPE', sub: 'REPE strategies and the value creation playbook.', moduleNum: 'Module 6', sections: RE_REPE_SECTIONS },
  { id: 'reits', title: 'REITs & Public Real Estate', navTitle: 'REITs', sub: 'What REITs are and REIT-specific valuation metrics.', moduleNum: 'Module 7', sections: RE_REITS_SECTIONS },
  { id: 'debt', title: 'Real Estate Debt & Capital Markets', navTitle: 'RE Debt', sub: 'Types of real estate debt and key debt metrics.', moduleNum: 'Module 8', sections: RE_DEBT_SECTIONS },
  { id: 'development', title: 'Development & Construction', navTitle: 'Development', sub: 'The development process and key development metrics.', moduleNum: 'Module 9', sections: RE_DEVELOPMENT_SECTIONS },
  { id: 'interview', title: 'Interview Preparation', navTitle: 'Interview Qs', sub: 'RE interview format, technical questions, and common mistakes.', moduleNum: 'Module 10', sections: RE_INTERVIEW_SECTIONS },
];

export default function REInterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
  const scrollToSection = (idx: number) => { const el = sectionRefs.current[`${activeModule}-${idx}`]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo({ top: 0 }); }, [activeModule]);

  return (
    <div className="app">
      <Sidebar activePage="re-interview-prep" />
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
              <h1>The Complete Real Estate<br/>Finance Guide</h1>
              <p className="ib-hero-sub">From NOI and cap rates to REPE strategies, waterfall structures, and property-level analysis - everything you need to break into real estate finance.</p>
            </div>
            <div className="ib-container">
              <div className="ib-toc"><h4>Table of Contents</h4><ol>
                {MODULES.map(m => (<li key={m.id}><button onClick={() => setActiveModule(m.id)} className="ib-toc-link">{m.moduleNum}: {m.title}</button></li>))}
              </ol></div>
              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>Foundations:</strong> Modules 1–4 cover the RE landscape, property types, valuation, and lease analysis - the core knowledge base.</p>
                <p><strong>Advanced:</strong> Modules 5–9 cover modeling, REPE, REITs, debt markets, and development - the specialized technical skills.</p>
                <p><strong>Interview ready:</strong> Module 10 covers the exact technical questions and common mistakes in RE interviews.</p>
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
              {mod.sections.map((s, i) => (<li key={i}><button onClick={() => scrollToSection(i)} className="ib-toc-link">{s.title}</button></li>))}
            </ol></div>)}
            {mod.sections.map((s, i) => (
              <div key={`${activeModule}-${i}`} ref={el => { sectionRefs.current[`${activeModule}-${i}`] = el; }} className="ib-section">
                <h3>{s.title}</h3>
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
