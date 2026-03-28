'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import './quiz.css';

const questions = [
  {
    id: 1,
    question: "What type of work environment do you prefer?",
    options: [
      { text: "Fast-paced, high pressure, long hours, deal-driven", career: "ib" },
      { text: "Deep analytical research with a focus on operational improvements", career: "pe" },
      { text: "Client-facing, framing ambiguous problems, frequent travel", career: "consulting" },
      { text: "Highly independent, research-focused, analytical environment", career: "am" },
      { text: "Structured, rules-based, predictable hours", career: "accounting" },
      { text: "Market-focused, research-oriented, analyzing broad trends", career: "am" },
    ]
  },
  {
    id: 2,
    question: "Which task sounds the most interesting to you?",
    options: [
      { text: "Building complex financial models for mergers and acquisitions", career: "ib" },
      { text: "Evaluating companies to buy, improve, and sell for a profit", career: "pe" },
      { text: "Advising a CEO on how to enter a new market or cut costs", career: "consulting" },
      { text: "Analyzing market trends and building investment theses on public companies", career: "am" },
      { text: "Ensuring financial statements are accurate and comply with regulations", career: "accounting" },
      { text: "Analyzing macro trends to manage an investment portfolio", career: "am" },
    ]
  },
  {
    id: 3,
    question: "What is your strongest skill?",
    options: [
      { text: "Financial modeling and endurance", career: "ib" },
      { text: "Deep financial analysis and strategic diligence", career: "pe" },
      { text: "Structuring ambiguous problems and communicating clearly", career: "consulting" },
      { text: "Deep analytical reasoning, financial modeling, and data interpretation", career: "am" },
      { text: "Attention to detail and understanding financial reporting rules", career: "accounting" },
      { text: "Investment research and thesis generation", career: "am" },
    ]
  },
  {
    id: 4,
    question: "How do you prefer to handle data?",
    options: [
      { text: "Use it to pitch a story or justify a transaction", career: "ib" },
      { text: "Use it to find hidden value and assess downside risk", career: "pe" },
      { text: "Use it to uncover operational inefficiencies and opportunities", career: "consulting" },
      { text: "Use it to evaluate investment opportunities and build portfolio models", career: "am" },
      { text: "Ensure it is perfectly reconciled and historically accurate", career: "accounting" },
      { text: "Use it to forecast long-term earnings and value public companies", career: "am" },
    ]
  },
  {
    id: 5,
    question: "What is your ultimate career goal?",
    options: [
      { text: "Advise on the biggest corporate transactions in the world", career: "ib" },
      { text: "Own & operate businesses to generate outsized returns", career: "pe" },
      { text: "Become a C-suite executive or start your own company", career: "consulting" },
      { text: "Manage portfolios and generate long-term risk-adjusted returns", career: "am" },
      { text: "Become a CFO or Partner at a professional services firm", career: "accounting" },
      { text: "Manage a multi-billion dollar fund", career: "am" },
    ]
  }
];

const CAREER_DATA: Record<string, { title: string; desc: string; href: string; iconClass: string; icon: JSX.Element }> = {
  ib: {
    title: "Investment Banking",
    desc: "Investment Banking is the perfect fit for you! You thrive in fast-paced environments, enjoy complex financial modeling, and want to work on landmark M&A transactions and public offerings.",
    href: "/interview-prep",
    iconClass: 'icon-ib',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  },
  pe: {
    title: "Private Equity",
    desc: "Private Equity aligns perfectly with your goals! You have a keen eye for value, enjoy deep-dive due diligence, and want to invest in and improve businesses rather than just advise them.",
    href: "/pe-interview-prep",
    iconClass: 'icon-pe',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  },
  consulting: {
    title: "Management Consulting",
    desc: "Management Consulting is your calling! You are a natural problem solver, love tackling ambiguous challenges, and excel at communicating strategic recommendations to executives.",
    href: "/consulting-interview-prep",
    iconClass: 'icon-consulting',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  },
  accounting: {
    title: "Accounting & Audit",
    desc: "Accounting & Audit suits your detailed and structured mindset! You excel at ensuring accuracy, understanding complex financial regulations, and providing a foundation of trust for business operations.",
    href: "/accounting-interview-prep",
    iconClass: 'icon-accounting',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15L11 17L15 13"/></svg>
  },
  am: {
    title: "Asset Management",
    desc: "Asset Management is the right route for you! You are fascinated by macroeconomic trends, enjoy deep investment research, and want to manage significant portfolios of assets over the long term.",
    href: "/am-interview-prep",
    iconClass: 'icon-am',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
  }
};


export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    ib: 0,
    pe: 0,
    consulting: 0,
    accounting: 0,
    am: 0
  });
  const [showResult, setShowResult] = useState(false);
  const [topCareer, setTopCareer] = useState<string | null>(null);

  const handleOptionClick = (careerId: string) => {
    // Increment the score for the selected career
    const newScores = { ...scores, [careerId]: scores[careerId] + 1 };
    setScores(newScores);

    // Go to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate highest score
      let highestScore = -1;
      let highestCareer = 'ib'; // default
      for (const [career, score] of Object.entries(newScores)) {
        if (score > highestScore) {
          highestScore = score;
          highestCareer = career;
        }
      }
      setTopCareer(highestCareer);
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
                    onClick={() => handleOptionClick(opt.career)}
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
                
                <div className="quiz-result-actions">
                  <Link href={CAREER_DATA[topCareer].href} className="quiz-primary-btn">
                    Start {CAREER_DATA[topCareer].title} Track
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </Link>
                  <button className="quiz-secondary-btn" onClick={() => {
                    setScores({ib: 0, pe: 0, consulting: 0, accounting: 0, am: 0});
                    setCurrentQuestionIndex(0);
                    setShowResult(false);
                    setTopCareer(null);
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
