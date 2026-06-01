'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/ge-theme.css';
import '../interview-prep/guide-refresh.css';

import { GE_INDUSTRY_SECTIONS } from './ge-industry-data';
import { GE_CRITERIA_SECTIONS } from './ge-criteria-data';
import { GE_UNIT_ECONOMICS_SECTIONS } from './ge-unit-economics-data';
import { GE_DEAL_PROCESS_SECTIONS } from './ge-deal-process-data';
import { GE_DEAL_STRUCTURE_SECTIONS } from './ge-deal-structure-data';
import { GE_MODELING_SECTIONS } from './ge-modeling-data';
import { GE_VALUE_CREATION_SECTIONS } from './ge-value-creation-data';
import { GE_EXITS_SECTIONS } from './ge-exits-data';
import { GE_SECTORS_SECTIONS } from './ge-sectors-data';
import { GE_INTERVIEW_SECTIONS } from './ge-interview-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Growth Equity Landscape', navTitle: 'Landscape', sub: 'What growth equity is, how it differs from VC and buyout, the major firms, and the career path.', moduleNum: 'Module 1', sections: GE_INDUSTRY_SECTIONS },
  { id: 'criteria', title: 'Investment Criteria & What Makes a Great GE Company', navTitle: 'Criteria', sub: 'The core criteria growth equity firms use to evaluate potential investments.', moduleNum: 'Module 2', sections: GE_CRITERIA_SECTIONS },
  { id: 'unit_economics', title: 'Unit Economics & SaaS Metrics Masterclass', navTitle: 'SaaS Metrics', sub: 'Why unit economics matter, core SaaS/subscription metrics, and non-SaaS analysis.', moduleNum: 'Module 3', sections: GE_UNIT_ECONOMICS_SECTIONS },
  { id: 'deal_process', title: 'Due Diligence - From Sourcing to IC Memo', navTitle: 'Due Diligence', sub: 'The deal funnel, sourcing process, and investment committee memo structure.', moduleNum: 'Module 4', sections: GE_DEAL_PROCESS_SECTIONS },
  { id: 'deal_structure', title: 'Deal Structuring & Term Sheets', navTitle: 'Deal Terms', sub: 'Types of securities, protective provisions, and valuation mechanics.', moduleNum: 'Module 5', sections: GE_DEAL_STRUCTURE_SECTIONS },
  { id: 'modeling', title: 'Growth Equity Financial Modeling', navTitle: 'Modeling', sub: 'How GE models differ from LBO models and key sensitivity analyses.', moduleNum: 'Module 6', sections: GE_MODELING_SECTIONS },
  { id: 'value_creation', title: 'Post-Investment Value Creation & Governance', navTitle: 'Value Creation', sub: 'The GE value-add playbook and board governance practices.', moduleNum: 'Module 7', sections: GE_VALUE_CREATION_SECTIONS },
  { id: 'exits', title: 'Exits & Returns', navTitle: 'Exits', sub: 'Exit channels and the key return drivers in growth equity.', moduleNum: 'Module 8', sections: GE_EXITS_SECTIONS },
  { id: 'sectors', title: 'Sector Deep Dives', navTitle: 'Sectors', sub: 'Enterprise software, healthcare tech, fintech, and consumer internet analysis.', moduleNum: 'Module 9', sections: GE_SECTORS_SECTIONS },
  { id: 'interview', title: 'Interview Preparation & Practice', navTitle: 'Interview Qs', sub: 'GE interview format, technical questions, the investment pitch, and common mistakes.', moduleNum: 'Module 10', sections: GE_INTERVIEW_SECTIONS },
];

export default function GEInterviewPrepPage() {
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
      <Sidebar activePage="ge-interview-prep" />

      <main className="main ib-guide-main ge-theme" ref={contentRef}>
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
              <h1>The Complete Growth Equity<br/>Technical Guide</h1>
              <p className="ib-hero-sub">From SaaS metrics and unit economics to deal structuring, GE modeling, and investment pitches - everything you need to break into growth equity.</p>
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
                <p><strong>Foundations:</strong> Start with Modules 1-3 to understand the GE landscape, investment criteria, and the SaaS metrics that drive most GE investing.</p>
                <p><strong>Deal mechanics:</strong> Modules 4-8 cover the full deal lifecycle from sourcing through exit, including term sheets, modeling, and value creation.</p>
                <p><strong>Interview prep:</strong> Module 10 covers the exact questions, pitch format, and common mistakes in GE interviews.</p>
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
