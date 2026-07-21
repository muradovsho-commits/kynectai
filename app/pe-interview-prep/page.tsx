'use client';

import Topbar from "../components/Topbar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPlanStatus } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import '../interview-prep/guide-base.css';
import '../interview-prep/pe-theme.css';

import { PE_INDUSTRY_SECTIONS } from './pe-industry-data';
import { PE_FUND_SECTIONS } from './pe-fund-data';
import { PE_DEAL_PROCESS_SECTIONS } from './pe-deal-process-data';
import { PE_LBO_MODELING_SECTIONS } from './pe-lbo-modeling-data';
import { PE_OPERATIONS_SECTIONS } from './pe-operations-data';
import { PE_EXITS_SECTIONS } from './pe-exits-data';
import { PE_ADVANCED_TOPICS_SECTIONS } from './pe-advanced-topics-data';
import { PE_INTERVIEW_QUESTIONS_SECTIONS } from './pe-interview-questions-data';
import { PE_VALUATION_SECTIONS } from './pe-valuation-data';
import { PE_LBO_SECTIONS } from './pe-lbo-data';
import { PE_PAPER_LBO_SECTIONS } from './pe-paper-lbo-data';
import { PE_RETURNS_SECTIONS } from './pe-returns-data';
import { PE_PITCH_SECTIONS } from './pe-pitch-data';

type Section = { title: string; content: string };

// Strip leading section numbers like "9.1 " or "9.4-9.5 " at render time.
// Requires the N.M decimal form so it can never clip a real title.
const cleanSectionTitle = (t: string) => t.replace(/^\d+\.\d+(-\d+(\.\d+)?)?\s+/, '');

const MODULES: { id: string; title: string; navTitle: string; sub: string; moduleNum: string; sections: Section[] }[] = [
  { id: 'industry', title: 'The Private Equity Industry', navTitle: 'PE Industry', sub: 'What PE firms do, how they differ from other investors, the major strategies, and the day-to-day.', moduleNum: 'Module 1', sections: PE_INDUSTRY_SECTIONS },
  { id: 'fund', title: 'Fund Structure, Economics & Fundraising', navTitle: 'Fund Structure', sub: 'GPs and LPs, the fund lifecycle, fees and carry, the hurdle, and the distribution waterfall.', moduleNum: 'Module 2', sections: PE_FUND_SECTIONS },
  { id: 'accounting_valuation', title: 'Accounting & Valuation Essentials', navTitle: 'Accounting & Val', sub: 'The three statements and how they link, enterprise vs equity value, multiples, and the three valuation methods.', moduleNum: 'Module 3', sections: PE_VALUATION_SECTIONS },
  { id: 'lbo_concept', title: 'The LBO Concept & Why It Works', navTitle: 'LBO Concept', sub: 'What an LBO is, why leverage amplifies returns, the three return drivers, and the capital structure.', moduleNum: 'Module 4', sections: PE_LBO_SECTIONS },
  { id: 'paper_lbo', title: 'The Paper LBO', navTitle: 'Paper LBO', sub: 'The most-tested PE exercise: the step-by-step method, a full worked example, and MOIC-to-IRR shortcuts.', moduleNum: 'Module 5', sections: PE_PAPER_LBO_SECTIONS },
  { id: 'full_lbo', title: 'The Full LBO Model', navTitle: 'Full LBO Model', sub: 'Sources and uses, the operating model and debt schedule, and calculating the return at exit.', moduleNum: 'Module 6', sections: PE_LBO_MODELING_SECTIONS },
  { id: 'returns', title: 'Returns & the Value Creation Bridge', navTitle: 'Returns', sub: 'IRR vs MOIC, the value creation bridge, and what good deal-level and fund-level returns look like.', moduleNum: 'Module 7', sections: PE_RETURNS_SECTIONS },
  { id: 'deal_process', title: 'Deal Sourcing, Screening & Due Diligence', navTitle: 'Deal Process', sub: 'How PE firms find, screen, and diligence investments, from sourcing to the investment committee.', moduleNum: 'Module 8', sections: PE_DEAL_PROCESS_SECTIONS },
  { id: 'operations', title: 'Portfolio Operations & Value Creation', navTitle: 'Operations', sub: 'The value creation levers, the 100-day plan, active ownership, and buy-and-build.', moduleNum: 'Module 9', sections: PE_OPERATIONS_SECTIONS },
  { id: 'exits', title: 'Exits & Performance Measurement', navTitle: 'Exits', sub: 'Exit routes (sale, secondary, IPO, recap) and how fund performance is measured (TVPI, DPI, RVPI).', moduleNum: 'Module 10', sections: PE_EXITS_SECTIONS },
  { id: 'advanced', title: 'Advanced Topics & Special Situations', navTitle: 'Advanced', sub: 'Continuation funds, NAV lending, co-investment, secondaries, sector specialization, and ESG.', moduleNum: 'Module 11', sections: PE_ADVANCED_TOPICS_SECTIONS },
  { id: 'thesis', title: 'The Investment Thesis & Deal Discussion', navTitle: 'Investment Thesis', sub: 'How to pitch a buyout target, build an investment thesis, and discuss deals and markets like an investor.', moduleNum: 'Module 12', sections: PE_PITCH_SECTIONS },
  { id: 'interview_qs', title: 'PE Interview Prep: Questions, Cases & Behavioral', navTitle: 'Interview Qs', sub: 'The interview format, fit and technical Q&A, the LBO case study, common mistakes, and a glossary.', moduleNum: 'Module 13', sections: PE_INTERVIEW_QUESTIONS_SECTIONS },
];

export default function PEInterviewPrepPage() {
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
      <Topbar activePage="pe-interview-prep" />

      <main className="main ib-guide-main pe-theme" ref={contentRef}>
        {/* Back link */}
        <div className="ib-back-row">
          <Link href="/learn" className="ib-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learning Hub
          </Link>
        </div>

        {activeModule === '' ? (
          /* ═══════════════ LANDING / OVERVIEW ═══════════════ */
          <div className="ib-landing">
            {/* Hero */}
            <div className="ib-hero">
              <h1>The Complete Private Equity<br/>Interview Guide</h1>
              <p className="ib-hero-sub">A comprehensive reference covering PE fund economics, LBO modeling, deal process, value creation, and interview preparation - everything needed to break into private equity.</p>
            </div>

            {/* Container */}
            <div className="ib-container">
              {/* Table of Contents */}
              <div className="ib-toc">
                <h4>Table of Contents</h4>
                <ol>
                  {MODULES.map(m => (
                    <li key={m.id}>
                      <button onClick={() => setActiveModule(m.id)} className="ib-toc-link">
                        {m.moduleNum}: {m.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              {/* How to Use */}
              <div className="ib-how-to-use">
                <h4>How to Use This Guide</h4>
                <p><strong>Foundations:</strong> Modules 1-3 cover what PE is, how funds and their economics work, and the accounting and valuation you need. Start here before any modeling.</p>
                <p><strong>The LBO core:</strong> Modules 4-7 are the technical heart of PE - the LBO concept, the paper LBO (the most-tested exercise), the full model, and how returns and the value creation bridge work. Spend the most time here.</p>
                <p><strong>The deal lifecycle:</strong> Modules 8-10 follow a deal from sourcing and diligence through operations and value creation to the exit and fund performance.</p>
                <p><strong>Advanced and interview ready:</strong> Modules 11-13 cover advanced topics, how to build and pitch an investment thesis, and the interview itself - format, questions, the case study, mistakes, and a glossary.</p>
              </div>

              {/* Module Cards */}
              <div className="ib-module-cards">
                {MODULES.map(m => (
                  <button key={m.id} className="ib-module-card" onClick={() => setActiveModule(m.id)}>
                    <div className="ib-module-card-num">{m.moduleNum}</div>
                    <div style={{flex: 1}}>
                      <div className="ib-module-card-title">{m.title}</div>
                      <div className="ib-module-card-sub" style={{display:'block'}}>{m.sub}</div>
                    </div>
                    <div className="ib-module-card-meta">{m.sections.length} topics</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ═══════════════ MODULE READING VIEW ═══════════════ */
          <div className="ib-layout">
            <aside className="ib-rail">
              <div className="ib-rail-inner">
                <div className="ib-rail-label">Modules</div>
                {MODULES.filter(m => m.id !== 'quiz').map((m, i) => (
                  <button
                    key={m.id}
                    className={'ib-rail-item' + (activeModule === m.id ? ' active' : '')}
                    onClick={() => setActiveModule(m.id)}
                  >
                    <span className="ib-rail-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="ib-rail-title">{m.navTitle}</span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="ib-container">
            {/* Module Header Card */}
            <div className="ib-module-header-card">
              <div className="ib-mh-num">{mod.moduleNum}</div>
              <h2>{mod.title}</h2>
              <p>{mod.sub}</p>
            </div>

            {/* Section Table of Contents (inline) */}
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

            {/* All sections rendered openly */}
            {mod.sections.map((s, i) => (
              <div
                key={`${activeModule}-${i}`}
                ref={el => { sectionRefs.current[`${activeModule}-${i}`] = el; }}
                className="ib-section"
              >
                <h3>{cleanSectionTitle(s.title)}</h3>
                <div className="ib-section-body" dangerouslySetInnerHTML={{ __html: s.content }} />
              </div>
            ))}

            {/* Bottom navigation */}
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
                    <button className="ib-bottom-nav-btn ib-bn-overview" onClick={() => setActiveModule('')}>
                      All Modules
                    </button>
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
