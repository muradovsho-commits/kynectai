'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import TutorialOverlay from '../components/TutorialOverlay';
import '../contact-finder/contact-finder.css';
import './learn.css';

const GUIDES = [
  {
    id: 'ib',
    title: 'Investment Banking',
    desc: 'From bulge bracket recruitment cycles to complex modeling tests. Master the technical and behavioral nuances of M&A and Capital Markets.',
    modules: 9,
    href: '/interview-prep',
    iconClass: 'icon-ib',
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    id: 'pe',
    title: 'Private Equity',
    desc: 'The definitive LBO track. Understand fund structures, deal sourcing, and the rigorous case study rounds characteristic of mega-funds and mid-markets.',
    modules: 5,
    href: '/pe-interview-prep',
    iconClass: 'icon-pe',
    icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    id: 'consulting',
    title: 'Consulting',
    desc: 'Master the MBB framework. From MECE principles to mental math proficiency and executive presence for high-stakes casing.',
    modules: 5,
    href: '/consulting-interview-prep',
    iconClass: 'icon-consulting',
    icon: <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  },
  {
    id: 'quant',
    title: 'Quant Research',
    desc: 'Mathematics and algorithmic strategy. A deep dive into stochastic calculus, probability, and C++ for high-frequency trading environments.',
    modules: 5,
    href: '/quant-interview-prep',
    iconClass: 'icon-quant',
    icon: <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    id: 'accounting',
    title: 'Accounting & Audit',
    desc: 'Three-statement mastery, GAAP vs IFRS, audit procedures, and the technical questions Big 4 firms ask in every round.',
    modules: 5,
    href: '/accounting-interview-prep',
    iconClass: 'icon-accounting',
    icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>,
  },
  {
    id: 'am',
    title: 'Asset Management',
    desc: 'Portfolio construction, equity research, stock pitches, and the buy-side mindset. Everything to break into long-only and hedge fund roles.',
    modules: 4,
    href: '/am-interview-prep',
    iconClass: 'icon-am',
    icon: <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>,
  },
];

const ARROW = <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

export default function LearnPage() {
  const totalModules = GUIDES.reduce((s, g) => s + g.modules, 0) + 7; // +7 for career roadmaps tracks
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const complete = localStorage.getItem('offerbell_tutorial_complete');
    if (!complete) {
      const step = parseInt(localStorage.getItem('offerbell_tutorial_step') || '0', 10);
      setTutorialStep(step);
      setShowTutorial(true);
    }
  }, []);

  return (
    <div className="app">
      {/* ── Sidebar ── */}
      <Sidebar activePage="learn" />

      {/* ── Main Content ── */}
      <main className="learn-main">
        {/* Career Roadmaps Hero (Rectangle Style) */}
        <div className="learn-hero">
          <div className="learn-hero-badge">Expert Curated</div>
          <div className="learn-hero-title">Career <em>Roadmaps</em></div>
          <div className="learn-hero-row">
            <div className="learn-hero-desc">
              Navigate the complexities of elite professional paths with our definitive guides. Engineered by industry veterans for the next generation of leaders.
            </div>
            <div className="learn-hero-stats">
              <div>
                <div className="learn-hero-stat-val">7</div>
                <div className="learn-hero-stat-label">Active Paths</div>
              </div>
              <div>
                <div className="learn-hero-stat-val">{totalModules}+</div>
                <div className="learn-hero-stat-label">Resources</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Banner */}
        <div data-tutorial="career-discovery">
        <div className="learn-quiz-banner" style={{ marginTop: '20px' }}>
          <div className="learn-quiz-icon">
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          </div>
          <div className="learn-quiz-content">
            <div className="learn-quiz-title">Not sure where to start?</div>
            <div className="learn-quiz-desc">Take our 2-minute quiz and get a personalized learning path.</div>
          </div>
          <Link href="/quiz" className="learn-quiz-btn">Take Career Quiz <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></Link>
        </div>

        {/* Career Roadmaps Banner */}
        <div className="learn-quiz-banner" style={{ marginTop: '16px' }}>
          <div className="learn-quiz-icon icon-roadmaps">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div className="learn-quiz-content">
            <div className="learn-quiz-title">Career Roadmaps</div>
            <div className="learn-quiz-desc">Not sure which path is right? Explore IB, PE, consulting, accounting, quant finance, and more. Learn what each role does, what they pay, and how to break in.</div>
          </div>
          <Link href="/recruiting-manual" className="learn-quiz-btn">Explore Paths <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></Link>
        </div>
        </div>

        {/* Unified Card Grid Header */}
        <div data-tutorial="interview-guides">
        <div className="learn-section-header">
          <h2>Interview Preparatory Guides</h2>
          <p>Master the technical and behavioral nuances to secure your dream offer.</p>
        </div>

        {/* Unified Card Grid */}
        <div className="learn-grid">
          {GUIDES.map(g => (
            <Link key={g.id} href={g.href} className="learn-card">
              <div className={`learn-card-icon ${g.iconClass}`}>{g.icon}</div>
              <div className="learn-card-title">{g.title}</div>
              <div className="learn-card-desc">{g.desc}</div>
              <div className="learn-card-footer">
                <span className="learn-card-modules">{g.modules} Modules</span>
                <span className="learn-card-link">Start Guide {ARROW}</span>
              </div>
            </Link>
          ))}
          {/* Bespoke Coaching Card */}
          <Link href="/coach" className="learn-card coaching-card">
            <div className="learn-card-title" style={{ fontSize: 19 }}>Bespoke Coaching</div>
            <div className="learn-card-desc">
              Need a custom trajectory? Our AI coach provides 1-on-1 strategic planning for non-traditional backgrounds.
            </div>
            <button className="coaching-card-btn" onClick={(e) => { e.preventDefault(); window.location.href = '/coach'; }}>
              Speak to a Coach
            </button>
          </Link>
        </div>
        </div>

        {/* Footer */}
        <div className="learn-footer">
          <div className="learn-footer-copy">© 2026 OfferBell Professional. All rights reserved.</div>
          <div className="learn-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Support</a>
          </div>
        </div>
      </main>

      {showTutorial && (
        <TutorialOverlay
          userId={typeof window !== 'undefined' ? (localStorage.getItem('offerbell_user_id') || '') : ''}
          initialStep={tutorialStep}
          onComplete={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
