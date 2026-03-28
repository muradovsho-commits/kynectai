'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import './quiz.css';

const questions = [
  {
    id: 1,
    question: "What type of work environment do you thrive in?",
    options: [
      { text: "High-intensity deal teams pulling all-nighters to close transactions", careers: { ib: 3, rx: 1 } },
      { text: "Small teams doing deep due diligence on companies to buy and improve", careers: { pe: 3, vc: 1 } },
      { text: "Client-facing strategy work with frequent travel and variety", careers: { consulting: 3 } },
      { text: "Fast-paced trading floor reacting to real-time market moves", careers: { st: 3 } },
      { text: "Quiet, research-driven environment analyzing investments independently", careers: { am: 2, er: 2 } },
      { text: "Structured, detail-oriented work with clear standards and procedures", careers: { accounting: 3 } },
    ]
  },
  {
    id: 2,
    question: "Which task sounds the most interesting to you?",
    options: [
      { text: "Building a merger model to analyze whether an acquisition creates value", careers: { ib: 3 } },
      { text: "Evaluating a company's operations to figure out how to make it more profitable", careers: { pe: 2, consulting: 1 } },
      { text: "Writing a detailed investment memo on why a startup will be the next big thing", careers: { vc: 3 } },
      { text: "Analyzing a distressed company's capital structure to find the fulcrum security", careers: { rx: 3 } },
      { text: "Building an earnings model and setting a price target on a public company", careers: { er: 3 } },
      { text: "Underwriting a real estate deal and modeling the property's cash flows", careers: { re: 3 } },
    ]
  },
  {
    id: 3,
    question: "What is your strongest skill?",
    options: [
      { text: "Financial modeling and the stamina to work through the night on a live deal", careers: { ib: 3 } },
      { text: "Pattern recognition — quickly spotting what makes a good vs bad investment", careers: { pe: 2, vc: 2 } },
      { text: "Structured problem-solving and communicating recommendations clearly", careers: { consulting: 3 } },
      { text: "Attention to detail, accuracy, and understanding complex regulations", careers: { accounting: 3 } },
      { text: "Forming investment views and defending them with conviction", careers: { am: 2, st: 2 } },
      { text: "Deep analytical research and writing clear, persuasive reports", careers: { er: 2, rx: 1 } },
    ]
  },
  {
    id: 4,
    question: "How do you prefer to use data?",
    options: [
      { text: "To tell a story that justifies a deal or transaction to a client", careers: { ib: 3 } },
      { text: "To find hidden value, assess downside risk, and build an investment case", careers: { pe: 2, am: 1 } },
      { text: "To uncover operational inefficiencies and recommend strategic changes", careers: { consulting: 3 } },
      { text: "To make quick, high-stakes trading decisions in real time", careers: { st: 3 } },
      { text: "To ensure financial records are accurate and compliant", careers: { accounting: 3 } },
      { text: "To evaluate market trends and forecast where an industry is heading", careers: { er: 2, vc: 1 } },
    ]
  },
  {
    id: 5,
    question: "What motivates you the most?",
    options: [
      { text: "Working on headline deals that reshape entire industries", careers: { ib: 3 } },
      { text: "Owning a piece of the upside — investing and growing businesses for a return", careers: { pe: 2, vc: 2 } },
      { text: "Solving complex business problems and seeing your strategy implemented", careers: { consulting: 3 } },
      { text: "The intellectual challenge of markets — being right about where things are going", careers: { st: 2, am: 2 } },
      { text: "Building a stable career with clear progression and professional credentials", careers: { accounting: 3 } },
      { text: "Saving companies from collapse and navigating high-stakes negotiations", careers: { rx: 3 } },
    ]
  },
  {
    id: 6,
    question: "What type of company or asset interests you most?",
    options: [
      { text: "Large public corporations making transformative acquisitions", careers: { ib: 3 } },
      { text: "Mature, cash-flowing private businesses with room for operational improvement", careers: { pe: 3 } },
      { text: "Early-stage startups with massive potential and visionary founders", careers: { vc: 3 } },
      { text: "Physical assets — office buildings, apartments, industrial properties", careers: { re: 3 } },
      { text: "Distressed or bankrupt companies with complicated debt structures", careers: { rx: 3 } },
      { text: "Public companies across sectors — analyzing their stock and fundamentals", careers: { er: 2, am: 2 } },
    ]
  },
  {
    id: 7,
    question: "How do you feel about risk?",
    options: [
      { text: "I advise on risk but don't take it directly — I help clients make decisions", careers: { ib: 2, consulting: 2 } },
      { text: "I want to take calculated, leveraged bets on proven businesses", careers: { pe: 3 } },
      { text: "I'm comfortable with high risk and high reward on unproven companies", careers: { vc: 3 } },
      { text: "I want to trade risk in real time — managing positions and P&L daily", careers: { st: 3 } },
      { text: "I'm risk-averse — I prefer structure, rules, and predictability", careers: { accounting: 3 } },
      { text: "I'm drawn to messy, uncertain situations where I can find hidden value", careers: { rx: 2, re: 1 } },
    ]
  },
  {
    id: 8,
    question: "Where do you see yourself in 10 years?",
    options: [
      { text: "Managing Director at a top investment bank running a coverage group", careers: { ib: 3 } },
      { text: "Partner at a PE fund making investment decisions on billion-dollar buyouts", careers: { pe: 3 } },
      { text: "Senior Partner at a consulting firm or CEO of a company I helped build", careers: { consulting: 3 } },
      { text: "Running my own venture fund investing in the next generation of startups", careers: { vc: 3 } },
      { text: "Portfolio manager running my own book with a track record of returns", careers: { am: 2, st: 2 } },
      { text: "CFO of a major corporation or Partner at a Big 4 firm", careers: { accounting: 3 } },
    ]
  },
  {
    id: 9,
    question: "Pick the topic you'd most enjoy becoming an expert in.",
    options: [
      { text: "M&A deal structures, fairness opinions, and capital markets", careers: { ib: 3 } },
      { text: "LBO mechanics, debt covenants, and operational value creation", careers: { pe: 3 } },
      { text: "Go-to-market strategy, unit economics, and product-market fit", careers: { vc: 2, consulting: 1 } },
      { text: "Cap rates, NOI, lease structures, and property valuation", careers: { re: 3 } },
      { text: "Options pricing, market microstructure, and portfolio hedging", careers: { st: 3 } },
      { text: "Bankruptcy code, priority of claims, and restructuring support agreements", careers: { rx: 3 } },
    ]
  },
  {
    id: 10,
    question: "What kind of impact do you want to have?",
    options: [
      { text: "Advise on the transactions that move markets and make headlines", careers: { ib: 3 } },
      { text: "Transform companies from the inside — improve operations and create real value", careers: { pe: 2, consulting: 1 } },
      { text: "Fund the entrepreneurs building the future", careers: { vc: 3 } },
      { text: "Produce research that moves stock prices and influences investor decisions", careers: { er: 3 } },
      { text: "Provide the financial accuracy and trust that businesses depend on", careers: { accounting: 3 } },
      { text: "Build and manage real assets that people live and work in", careers: { re: 3 } },
    ]
  },
];

const CAREER_DATA: Record<string, { title: string; desc: string; href: string; iconClass: string; icon: JSX.Element }> = {
  ib: {
    title: "Investment Banking",
    desc: "You thrive in high-intensity environments, love financial modeling, and want to advise on the transactions that reshape industries. Investment banking will put you at the center of the biggest deals in the world.",
    href: "/interview-prep",
    iconClass: 'icon-ib',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  },
  pe: {
    title: "Private Equity",
    desc: "You have a sharp eye for value, enjoy deep due diligence, and want to invest in and transform businesses rather than just advise on them. PE offers ownership, operational impact, and significant upside.",
    href: "/pe-interview-prep",
    iconClass: 'icon-pe',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  },
  consulting: {
    title: "Management Consulting",
    desc: "You're a natural problem solver who thrives on variety, client interaction, and structured thinking. Consulting will expose you to dozens of industries and put you in front of C-suite executives from day one.",
    href: "/consulting-interview-prep",
    iconClass: 'icon-consulting',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  },
  accounting: {
    title: "Accounting & Audit",
    desc: "You value precision, structure, and building deep expertise in financial reporting. Accounting offers a clear career path, professional credentials, and a foundation that opens doors across all of finance.",
    href: "/accounting-interview-prep",
    iconClass: 'icon-accounting',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>
  },
  am: {
    title: "Asset Management",
    desc: "You're fascinated by markets, love building investment theses, and want to manage capital over the long term. Asset management rewards deep research, conviction, and a disciplined investment process.",
    href: "/am-interview-prep",
    iconClass: 'icon-am',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
  },
  st: {
    title: "Sales & Trading",
    desc: "You thrive on real-time decision making, love markets, and want to be where the action is every single day. S&T offers direct exposure to global markets with immediate feedback on your performance.",
    href: "/st-interview-prep",
    iconClass: 'icon-st',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  },
  er: {
    title: "Equity Research",
    desc: "You love deep-dive analysis, writing compelling research, and forming views on public companies. Equity research lets you become the go-to expert on a sector and influence how investors allocate capital.",
    href: "/er-interview-prep",
    iconClass: 'icon-er',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
  },
  vc: {
    title: "Venture Capital",
    desc: "You're drawn to innovation, love meeting founders, and want to fund the companies building the future. VC combines investment acumen with a front-row seat to the startup ecosystem.",
    href: "/vc-interview-prep",
    iconClass: 'icon-vc',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  },
  re: {
    title: "Real Estate",
    desc: "You're interested in tangible assets, enjoy financial modeling with real cash flows, and want to build expertise in one of the oldest and most stable asset classes. Real estate offers deal work with physical impact.",
    href: "/re-interview-prep",
    iconClass: 'icon-re',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
  rx: {
    title: "Restructuring",
    desc: "You're drawn to high-stakes, complex situations where companies are in distress. Restructuring offers intellectually challenging work at the intersection of finance, law, and negotiation — and it thrives in any market cycle.",
    href: "/rx-interview-prep",
    iconClass: 'icon-rx',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  },
};

const ALL_CAREERS = ['ib','pe','consulting','accounting','am','st','er','vc','re','rx'];

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(ALL_CAREERS.map(c => [c, 0]))
  );
  const [showResult, setShowResult] = useState(false);
  const [topCareer, setTopCareer] = useState<string | null>(null);
  const [runnerUp, setRunnerUp] = useState<string | null>(null);

  const handleOptionClick = (careers: Record<string, number>) => {
    const newScores = { ...scores };
    for (const [career, pts] of Object.entries(careers)) {
      newScores[career] = (newScores[career] || 0) + pts;
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
      setTopCareer(sorted[0][0]);
      setRunnerUp(sorted[1] && sorted[1][1] > 0 ? sorted[1][0] : null);
      setShowResult(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="app">
      <Sidebar activePage="learn" />
      <main className="quiz-main">
        <div className="quiz-container">
          
          <Link href="/learn" className="quiz-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Learn
          </Link>

          {!showResult ? (
            <div className="quiz-card">
              <div className="quiz-progress-wrapper">
                <div className="quiz-progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="quiz-header">
                <span className="quiz-step">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <h1 className="quiz-question">{currentQuestion.question}</h1>
              </div>

              <div className="quiz-options">
                {currentQuestion.options.map((opt, i) => (
                  <button 
                    key={i} 
                    className="quiz-option-btn"
                    onClick={() => handleOptionClick(opt.careers)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            topCareer && CAREER_DATA[topCareer] && (
              <div className="quiz-result-card fade-in">
                <div className="quiz-result-header">
                  <div className="quiz-result-badge">Your Best Fit</div>
                  <h1 className="quiz-result-title">{CAREER_DATA[topCareer].title}</h1>
                </div>
                
                <div className="quiz-result-content">
                  <div className={`quiz-result-icon-wrapper ${CAREER_DATA[topCareer].iconClass}`}>
                    {CAREER_DATA[topCareer].icon}
                  </div>
                  <p className="quiz-result-desc">
                    {CAREER_DATA[topCareer].desc}
                  </p>
                </div>

                {runnerUp && CAREER_DATA[runnerUp] && (
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: 'var(--text-3)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Runner-up</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{CAREER_DATA[runnerUp].title}</div>
                    <div style={{ marginLeft: 'auto' }}>
                      <Link href={CAREER_DATA[runnerUp].href} style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', textDecoration: 'none' }}>Explore →</Link>
                    </div>
                  </div>
                )}
                
                <div className="quiz-result-actions">
                  <Link href={CAREER_DATA[topCareer].href} className="quiz-primary-btn">
                    Start {CAREER_DATA[topCareer].title} Track
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </Link>
                  <button className="quiz-secondary-btn" onClick={() => {
                    setScores(Object.fromEntries(ALL_CAREERS.map(c => [c, 0])));
                    setCurrentQuestionIndex(0);
                    setShowResult(false);
                    setTopCareer(null);
                    setRunnerUp(null);
                  }}>
                    Retake Quiz
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
