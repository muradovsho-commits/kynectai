'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/vc-theme.css';

import { VC_INDUSTRY_SECTIONS } from './vc-industry-data';
import { VC_FUND_SECTIONS } from './vc-fund-data';
import { VC_SOURCING_SECTIONS } from './vc-sourcing-data';
import { VC_TERM_SHEETS_SECTIONS } from './vc-term-sheets-data';
import { VC_CAP_TABLE_SECTIONS } from './vc-cap-table-data';
import { VC_PORTFOLIO_SECTIONS } from './vc-portfolio-data';
import { VC_METRICS_SECTIONS } from './vc-metrics-data';
import { VC_SECTORS_SECTIONS } from './vc-sectors-data';
import { VC_EXITS_SECTIONS } from './vc-exits-data';
import { VC_INTERVIEW_SECTIONS } from './vc-interview-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Venture Capital Industry', navTitle: 'Industry', sub: 'What VCs do, the power law, stages of financing, and the VC ecosystem.', moduleNum: 'Module 1', sections: VC_INDUSTRY_SECTIONS },
  { id: 'fund', title: 'Fund Structure & Economics', navTitle: 'Fund Econ', sub: 'The limited partnership, 2 and 20, and portfolio construction.', moduleNum: 'Module 2', sections: VC_FUND_SECTIONS },
  { id: 'sourcing', title: 'Deal Sourcing & Startup Evaluation', navTitle: 'Sourcing', sub: 'How VCs find deals and the evaluation framework for startups.', moduleNum: 'Module 3', sections: VC_SOURCING_SECTIONS },
  { id: 'term_sheets', title: 'Term Sheets & Deal Structuring', navTitle: 'Term Sheets', sub: 'Economic terms, governance terms, and protective provisions.', moduleNum: 'Module 4', sections: VC_TERM_SHEETS_SECTIONS },
  { id: 'cap_table', title: 'Cap Tables & Dilution', navTitle: 'Cap Tables', sub: 'Cap table basics, the option pool shuffle, and dilution math.', moduleNum: 'Module 5', sections: VC_CAP_TABLE_SECTIONS },
  { id: 'portfolio', title: 'Portfolio Management & Follow-Ons', navTitle: 'Portfolio', sub: 'The board member role, follow-on investment decisions, and portfolio triage.', moduleNum: 'Module 6', sections: VC_PORTFOLIO_SECTIONS },
  { id: 'metrics', title: 'Startup Metrics & Unit Economics', navTitle: 'Metrics', sub: 'Stage-appropriate metrics and critical early-stage unit economics.', moduleNum: 'Module 7', sections: VC_METRICS_SECTIONS },
  { id: 'sectors', title: 'Sector Deep Dives', navTitle: 'Sectors', sub: 'SaaS, fintech, healthcare, consumer/marketplace, and climate/deep tech.', moduleNum: 'Module 8', sections: VC_SECTORS_SECTIONS },
  { id: 'exits', title: 'Exits & Fund Returns', navTitle: 'Exits', sub: 'Exit channels, fund return metrics, and the return profile.', moduleNum: 'Module 9', sections: VC_EXITS_SECTIONS },
  { id: 'interview', title: 'Interview Preparation', navTitle: 'Interview Qs', sub: 'VC interview format, questions, and common mistakes.', moduleNum: 'Module 10', sections: VC_INTERVIEW_SECTIONS },
];

export default function VCInterviewPrepPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => { if (typeof window === 'undefined') return; if (!window.localStorage.getItem('offerbell_user_id')) { router.replace('/signin'); } }, [router]);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => { if (typeof window === 'undefined') return; const saved = localStorage.getItem('offerbell-theme'); if (saved) { document.documentElement.setAttribute('data-theme', saved); setIsDark(saved === 'dark'); } }, []);

  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const scrollToSection = (idx: number) => { const el = sectionRefs.current[`${activeModule}-${idx}`]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTo({ top: 0 }); }, [activeModule]);

  return (
    <div className="app">
      <Sidebar activePage="vc-interview-prep" />
      <main className="main ib-guide-main vc-theme" ref={contentRef}>
        <div className="ib-back-row"><Link href="/learn" className="ib-back-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back to Learning Hub</Link></div>

        <nav className="ib-module-nav"><div className="ib-module-nav-inner">
          {MODULES.map(m => (<button key={m.id} className={'ib-nav-tab' + (activeModule === m.id ? ' active' : '')} onClick={() => setActiveModule(m.id)}>{m.navTitle}</button>))}
        </div></nav>

        {activeModule === '' ? (
          <div className="ib-landing">
            <div className="ib-hero">
              <h1>The Complete Venture Capital<br/>Technical Guide</h1>
              <p className="ib-hero-sub">Fund economics, startup evaluation, term sheets, cap tables, and sector thesis - everything you need to think like an early-stage investor.</p>
            </div>
            <div className="ib-container">
              <div className="ib-toc"><h4>Table of Contents</h4><ol>
                {MODULES.map(m => (<li key={m.id}><button onClick={() => setActiveModule(m.id)} className="ib-toc-link">{m.moduleNum}: {m.title}</button></li>))}
              </ol></div>
              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>Foundations:</strong> Modules 1–3 cover the VC industry, fund economics, and how deals are sourced and evaluated.</p>
                <p><strong>Technical depth:</strong> Modules 4–7 cover term sheets, cap tables, portfolio management, and startup metrics.</p>
                <p><strong>Interview ready:</strong> Modules 8–10 cover sector expertise, exits/returns, and the exact interview questions and formats.</p>
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
                <h3>{s.title}</h3><div className="ib-section-body" dangerouslySetInnerHTML={{ __html: s.content }} />
              </div>
            ))}
            <div className="ib-bottom-nav">
              {(() => { const idx = MODULES.findIndex(m => m.id === activeModule); const prev = idx > 0 ? MODULES[idx-1] : null; const next = idx < MODULES.length-1 ? MODULES[idx+1] : null; return (<>
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
