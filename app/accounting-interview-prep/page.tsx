'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/acct-theme.css';

import { ACCT_OVERVIEW_SECTIONS } from './acct-overview-data';
import { ACCT_STATEMENTS_SECTIONS } from './acct-statements-data';
import { ACCT_REVENUE_SECTIONS } from './acct-revenue-data';
import { ACCT_ASSETS_SECTIONS } from './acct-assets-data';
import { ACCT_AUDIT_SECTIONS } from './acct-audit-data';
import { ACCT_INTERNAL_CONTROLS_SECTIONS } from './acct-internal-controls-data';
import { ACCT_EVIDENCE_SECTIONS } from './acct-evidence-data';
import { ACCT_ETHICS_SECTIONS } from './acct-ethics-data';
import { ACCT_ADVANCED_SECTIONS } from './acct-advanced-data';
import { ACCT_INTERVIEW_SECTIONS } from './acct-interview-data';

type Section = { title: string; content: string };

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'overview', title: 'The Accounting & Audit Industry', navTitle: 'Industry', sub: 'What accounting and audit professionals do, the Big 4, career paths, and day-to-day work.', moduleNum: 'Module 1', sections: ACCT_OVERVIEW_SECTIONS },
  { id: 'statements', title: 'Financial Statement Fundamentals', navTitle: 'Statements', sub: 'The three financial statements, how they link together, and GAAP vs. IFRS.', moduleNum: 'Module 2', sections: ACCT_STATEMENTS_SECTIONS },
  { id: 'revenue', title: 'Revenue Recognition & Expense Matching', navTitle: 'Revenue', sub: 'ASC 606 five-step model, expense recognition, and the matching principle.', moduleNum: 'Module 3', sections: ACCT_REVENUE_SECTIONS },
  { id: 'assets', title: 'Assets, Liabilities & Equity', navTitle: 'Assets/Liabilities', sub: 'Current and non-current assets, liability classification, and equity components.', moduleNum: 'Module 4', sections: ACCT_ASSETS_SECTIONS },
  { id: 'audit', title: 'The Audit Process', navTitle: 'Audit Process', sub: 'Audit standards, phases of the audit, and types of audit opinions.', moduleNum: 'Module 5', sections: ACCT_AUDIT_SECTIONS },
  { id: 'controls', title: 'Internal Controls & the Control Environment', navTitle: 'Controls', sub: 'The COSO framework and internal control over financial reporting (ICFR).', moduleNum: 'Module 6', sections: ACCT_INTERNAL_CONTROLS_SECTIONS },
  { id: 'evidence', title: 'Audit Evidence & Procedures', navTitle: 'Evidence', sub: 'Financial statement assertions, evidence reliability hierarchy, and key audit procedures.', moduleNum: 'Module 7', sections: ACCT_EVIDENCE_SECTIONS },
  { id: 'ethics', title: 'Fraud, Ethics & Independence', navTitle: 'Ethics', sub: 'Auditor responsibilities for fraud, independence requirements, and the AICPA code.', moduleNum: 'Module 8', sections: ACCT_ETHICS_SECTIONS },
  { id: 'advanced', title: 'Specialized Accounting Areas', navTitle: 'Advanced', sub: 'Business combinations, leases (ASC 842), derivatives, and segment reporting.', moduleNum: 'Module 9', sections: ACCT_ADVANCED_SECTIONS },
  { id: 'interview', title: 'Interview Questions & Case Studies', navTitle: 'Interview Qs', sub: 'Contextual questions, technical questions, and the case study format.', moduleNum: 'Module 10', sections: ACCT_INTERVIEW_SECTIONS },
];

export default function AccountingInterviewPrepPage() {
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

  const scrollToSection = (idx: number) => {
    const el = sectionRefs.current[`${activeModule}-${idx}`];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTo({ top: 0 });
  }, [activeModule]);

  return (
    <div className="app">
      <Sidebar activePage="accounting-interview-prep" />

      <main className="main ib-guide-main acct-theme" ref={contentRef}>
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
              <h1>The Complete Accounting &amp;<br/>Audit Technical Guide</h1>
              <p className="ib-hero-sub">From financial statement fundamentals and GAAP mastery to audit procedures, internal controls, and Big 4 interview preparation.</p>
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
                <p><strong>Foundations:</strong> Modules 1-4 cover the accounting fundamentals - statements, revenue recognition, and the balance sheet. Essential for any accounting role.</p>
                <p><strong>Audit track:</strong> Modules 5-8 cover the full audit process, internal controls, evidence procedures, and professional ethics.</p>
                <p><strong>Interview ready:</strong> Module 9 covers specialized topics, and Module 10 has the exact questions and case formats Big 4 firms use.</p>
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
