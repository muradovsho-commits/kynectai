'use client';

import Topbar from "../components/Topbar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/er-theme.css';

import { ER_INDUSTRY_SECTIONS } from './er-industry-data';
import { ER_RESEARCH_SECTIONS } from './er-research-data';
import { ER_MODELING_SECTIONS } from './er-modeling-data';
import { ER_VALUATION_SECTIONS } from './er-valuation-data';
import { ER_INITIATION_SECTIONS } from './er-initiation-data';
import { ER_SECTOR_SECTIONS } from './er-sector-data';
import { ER_WRITING_SECTIONS } from './er-writing-data';
import { ER_CATALYSTS_SECTIONS } from './er-catalysts-data';
import { ER_STOCK_PITCH_SECTIONS } from './er-stock-pitch-data';
import { ER_INTERVIEW_SECTIONS } from './er-interview-data';

type Section = { title: string; content: string };

// Strip leading section numbers like "9.1 " or "9.4-9.5 " at render time.
// Requires the N.M decimal form so it can never clip a real title.
const cleanSectionTitle = (t: string) => t.replace(/^\d+\.\d+(-\d+(\.\d+)?)?\s+/, '');

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Equity Research Industry', navTitle: 'Industry', sub: 'What ER analysts do, the business model, sell-side vs. buy-side, career path, and where ER sits.', moduleNum: 'Module 1', sections: ER_INDUSTRY_SECTIONS },
  { id: 'research', title: 'The Research Process', navTitle: 'Research', sub: 'Understanding the business, building conviction, and ongoing coverage.', moduleNum: 'Module 2', sections: ER_RESEARCH_SECTIONS },
  { id: 'modeling', title: 'Financial Modeling for Equity Research', navTitle: 'Modeling', sub: 'ER models vs. banking models, building step by step, and consensus estimates.', moduleNum: 'Module 3', sections: ER_MODELING_SECTIONS },
  { id: 'valuation', title: 'Valuation in Practice', navTitle: 'Valuation', sub: 'Target price methodology and common valuation pitfalls in ER.', moduleNum: 'Module 4', sections: ER_VALUATION_SECTIONS },
  { id: 'initiation', title: 'Initiating Coverage', navTitle: 'Initiation', sub: 'What an initiation report contains and what makes a great one.', moduleNum: 'Module 5', sections: ER_INITIATION_SECTIONS },
  { id: 'sector', title: 'Industry Analysis & Sector Expertise', navTitle: 'Sectors', sub: 'Why sector expertise matters, frameworks for industry analysis, and building a mosaic.', moduleNum: 'Module 6', sections: ER_SECTOR_SECTIONS },
  { id: 'writing', title: 'Writing Research That Gets Read', navTitle: 'Writing', sub: 'The fundamental problem of research writing and principles that work.', moduleNum: 'Module 7', sections: ER_WRITING_SECTIONS },
  { id: 'catalysts', title: 'Earnings Season & Catalysts', navTitle: 'Catalysts', sub: 'The earnings cycle and how catalysts drive stock price movement.', moduleNum: 'Module 8', sections: ER_CATALYSTS_SECTIONS },
  { id: 'stock_pitch', title: 'The Stock Pitch', navTitle: 'Stock Pitch', sub: 'What interviewers evaluate, how to prepare your pitch, and defending it.', moduleNum: 'Module 9', sections: ER_STOCK_PITCH_SECTIONS },
  { id: 'interview', title: 'Interview Preparation', navTitle: 'Interview Qs', sub: 'ER interview format, technical questions, and common mistakes.', moduleNum: 'Module 10', sections: ER_INTERVIEW_SECTIONS },
];

export default function ERInterviewPrepPage() {
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
      <Topbar activePage="er-interview-prep" />

      <main className="main ib-guide-main er-theme" ref={contentRef}>
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>

        {activeModule === '' ? (
          <div className="ib-landing">
            <div className="ib-hero">
              <h1>The Complete Equity Research<br/>Interview Guide</h1>
              <p className="ib-hero-sub">From financial modeling and valuation to initiating coverage, the stock pitch, and earnings season - everything you need to think like a sell-side analyst.</p>
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
                <p><strong>Foundations:</strong> Modules 1-4 cover the ER industry, research process, modeling, and valuation - the core analytical toolkit.</p>
                <p><strong>The craft:</strong> Modules 5-8 cover initiating coverage, sector expertise, research writing, and the earnings cycle.</p>
                <p><strong>Interview prep:</strong> Modules 9-10 cover the stock pitch (centerpiece of ER interviews) and technical questions.</p>
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
          <div className="ib-layout">
            <aside className="ib-rail">
              <div className="ib-rail-inner">
                <div className="ib-rail-label">Modules</div>
                {MODULES.filter(m => !['behavioral','markets'].includes(m.id)).map((m, i) => (
                  <button
                    key={m.id}
                    className={'ib-rail-item' + (activeModule === m.id ? ' active' : '')}
                    onClick={() => setActiveModule(m.id)}
                  >
                    <span className="ib-rail-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ib-rail-title">{m.navTitle}</span>
                  </button>
                ))}
                {MODULES.some(m => ['behavioral','markets'].includes(m.id)) && (
                  <div className="ib-rail-divider" />
                )}
                {MODULES.filter(m => ['behavioral','markets'].includes(m.id)).map(m => (
                  <button
                    key={m.id}
                    className={'ib-rail-item' + (activeModule === m.id ? ' active' : '')}
                    onClick={() => setActiveModule(m.id)}
                  >
                    <span className="ib-rail-num">&middot;</span>
                    <span className="ib-rail-title">{m.navTitle}</span>
                  </button>
                ))}
              </div>
            </aside>

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
          </div>
        )}
      </main>
    </div>
  );
}
