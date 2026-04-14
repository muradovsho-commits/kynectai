'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import './quiz.css';

// Careers
const CAREERS: Record<string, { title: string; href: string; color: string }> = {
  ib: { title: 'Investment Banking', href: '/interview-prep', color: '#3b82f6' },
  pe: { title: 'Private Equity', href: '/pe-interview-prep', color: '#8b5cf6' },
  vc: { title: 'Venture Capital', href: '/vc-interview-prep', color: '#ec4899' },
  consulting: { title: 'Management Consulting', href: '/consulting-interview-prep', color: '#10b981' },
  am: { title: 'Asset Management', href: '/am-interview-prep', color: '#14b8a6' },
  accounting: { title: 'Accounting & Audit', href: '/accounting-interview-prep', color: '#64748b' },
  st: { title: 'Sales & Trading', href: '/st-interview-prep', color: '#f59e0b' },
  er: { title: 'Equity Research', href: '/er-interview-prep', color: '#06b6d4' },
  re: { title: 'Real Estate', href: '/re-interview-prep', color: '#78716c' },
  rx: { title: 'Restructuring', href: '/rx-interview-prep', color: '#dc2626' },
};
const ALL_KEYS = Object.keys(CAREERS);

// Questions - personality/preference based, not "which finance career do you want"
// Each answer distributes points to multiple careers so it's not obvious
type Q = { question: string; options: { text: string; w: Record<string, number> }[] };

const questions: Q[] = [
  {
    question: "It's Saturday afternoon. What are you most likely doing?",
    options: [
      { text: "Reading an annual report or earnings transcript", w: { er: 4, am: 3, ib: 1 } },
      { text: "Catching up on the news and forming opinions on what's happening in the world", w: { st: 3, am: 2, consulting: 1 } },
      { text: "Organizing something - spreadsheets, plans, your apartment", w: { accounting: 4, ib: 1, re: 1 } },
      { text: "Talking to people - networking, catching up, building relationships", w: { consulting: 3, ib: 2, vc: 2 } },
    ]
  },
  {
    question: "You're given a complicated problem at work. Your instinct is to:",
    options: [
      { text: "Break it into a clear framework before doing anything else", w: { consulting: 4, accounting: 2 } },
      { text: "Build a model or run the numbers to figure out the answer", w: { ib: 3, pe: 2, am: 1, er: 1 } },
      { text: "Call someone who's dealt with it before and get their take", w: { vc: 2, consulting: 2, ib: 1, re: 1 } },
      { text: "Trust your gut and move quickly - you'll adjust as you go", w: { st: 4, vc: 2 } },
    ]
  },
  {
    question: "Which school subject did you naturally gravitate toward?",
    options: [
      { text: "Math and logic puzzles", w: { st: 3, am: 2, accounting: 2, ib: 1 } },
      { text: "Writing and persuasion", w: { consulting: 3, er: 3, vc: 1 } },
      { text: "History, economics, or political science", w: { am: 2, consulting: 2, rx: 1, pe: 1 } },
      { text: "Science - testing hypotheses with experiments", w: { er: 2, pe: 2, vc: 2, am: 1 } },
    ]
  },
  {
    question: "What sounds most satisfying to you?",
    options: [
      { text: "Closing a deal after months of grinding", w: { ib: 4, pe: 2, re: 1 } },
      { text: "Being right about something when everyone else disagreed", w: { am: 4, st: 3, er: 2 } },
      { text: "Fixing something that was broken or underperforming", w: { rx: 4, pe: 2, consulting: 2 } },
      { text: "Discovering the next big thing before anyone else", w: { vc: 4, er: 1, st: 1 } },
    ]
  },
  {
    question: "How do you feel about ambiguity?",
    options: [
      { text: "I love it - the less defined the problem, the more interesting it is", w: { consulting: 3, vc: 3, rx: 2 } },
      { text: "I can handle it but I prefer clear data to work with", w: { am: 2, er: 2, pe: 2, ib: 1 } },
      { text: "I like structured problems with clear right and wrong answers", w: { accounting: 4, st: 1 } },
      { text: "Ambiguity is fine as long as I can act quickly and iterate", w: { st: 3, vc: 2, re: 1 } },
    ]
  },
  {
    question: "Pick the headline that would make you stop scrolling:",
    options: [
      { text: "\"$45B Mega-Merger Reshapes the Industry\"", w: { ib: 4, rx: 1, pe: 1 } },
      { text: "\"This Under-the-Radar Stock Is Up 300% - Here's Why\"", w: { am: 3, er: 3, st: 1 } },
      { text: "\"How a First-Time Founder Built a $2B Company in 3 Years\"", w: { vc: 4, consulting: 1 } },
      { text: "\"New Accounting Rules Could Cost Banks Billions\"", w: { accounting: 3, rx: 2, ib: 1 } },
    ]
  },
  {
    question: "You're leading a group project. You tend to:",
    options: [
      { text: "Create the plan, assign tasks, and manage the timeline", w: { consulting: 3, ib: 2, accounting: 1 } },
      { text: "Do the hardest analytical work yourself", w: { er: 3, am: 2, pe: 2 } },
      { text: "Focus on the big picture and delegate the details", w: { pe: 3, vc: 2, consulting: 1 } },
      { text: "Jump in wherever there's a fire and put it out", w: { ib: 2, rx: 3, st: 1 } },
    ]
  },
  {
    question: "What kind of reward matters most to you?",
    options: [
      { text: "Direct financial upside tied to my performance", w: { pe: 3, st: 3, am: 2 } },
      { text: "Recognition and prestige within my industry", w: { ib: 3, consulting: 2, er: 1 } },
      { text: "Intellectual challenge and continuous learning", w: { consulting: 2, am: 2, er: 2, vc: 1 } },
      { text: "Stability, clear progression, and work-life balance", w: { accounting: 4, re: 2 } },
    ]
  },
  {
    question: "How do you feel about public speaking?",
    options: [
      { text: "I love it - I'm at my best presenting to a room", w: { consulting: 4, st: 1, ib: 1 } },
      { text: "I'd rather let my written work speak for itself", w: { er: 3, am: 2, accounting: 2 } },
      { text: "I'm comfortable one-on-one but not in front of large groups", w: { pe: 2, vc: 2, re: 2, ib: 1 } },
      { text: "I prefer fast back-and-forth conversations over formal presentations", w: { st: 3, vc: 2, rx: 1 } },
    ]
  },
  {
    question: "Which of these frustrates you the most?",
    options: [
      { text: "Slow decision-making when the answer is obvious", w: { st: 4, ib: 2, vc: 1 } },
      { text: "Sloppy analysis that ignores key details", w: { accounting: 3, er: 2, am: 2 } },
      { text: "People who don't see the bigger strategic picture", w: { consulting: 3, pe: 3, vc: 1 } },
      { text: "Wasting time on things that don't create real value", w: { pe: 3, rx: 2, re: 1 } },
    ]
  },
  {
    question: "If you had to write about one topic for a year, it would be:",
    options: [
      { text: "Markets, macro trends, and what's moving prices", w: { st: 3, am: 3, er: 1 } },
      { text: "How companies are built, run, and improved", w: { pe: 3, consulting: 2, vc: 1 } },
      { text: "Deals, transactions, and the business of M&A", w: { ib: 4, rx: 2 } },
      { text: "Real assets - property, infrastructure, tangible things", w: { re: 4, pe: 1 } },
    ]
  },
  {
    question: "How do you handle risk?",
    options: [
      { text: "I calculate it, size it, and take it deliberately", w: { st: 3, am: 3, pe: 1 } },
      { text: "I advise others on risk but don't take it directly myself", w: { ib: 3, consulting: 3 } },
      { text: "I'm drawn to messy, uncertain situations where there's hidden value", w: { rx: 4, vc: 2, re: 1 } },
      { text: "I prefer to minimize risk with clear rules and procedures", w: { accounting: 4, ib: 1 } },
    ]
  },
  {
    question: "You just won $10 million. What do you do with it?",
    options: [
      { text: "Build a diversified investment portfolio", w: { am: 4, er: 1, st: 1 } },
      { text: "Buy a few rental properties", w: { re: 5 } },
      { text: "Invest in startups and emerging companies", w: { vc: 4, pe: 1 } },
      { text: "Start your own advisory or consulting practice", w: { consulting: 3, ib: 1, rx: 1 } },
    ]
  },
  {
    question: "What's your attention span like?",
    options: [
      { text: "I can deep-dive on one topic for hours without getting bored", w: { er: 4, am: 2, pe: 1 } },
      { text: "I like variety - switching between projects and topics keeps me sharp", w: { consulting: 3, ib: 2, vc: 1 } },
      { text: "I'm laser-focused in short bursts - I work best under tight deadlines", w: { st: 3, ib: 2, rx: 1 } },
      { text: "I enjoy methodical, process-driven work that requires precision", w: { accounting: 4, re: 1 } },
    ]
  },
  {
    question: "In 10 years, you'd rather be known as:",
    options: [
      { text: "The person who ran the biggest deals in the industry", w: { ib: 4, pe: 1 } },
      { text: "The smartest investor in the room", w: { am: 3, st: 2, pe: 2, er: 1 } },
      { text: "Someone who built and scaled real businesses", w: { pe: 3, vc: 3 } },
      { text: "A trusted advisor that executives turn to for answers", w: { consulting: 4, rx: 1, accounting: 1 } },
    ]
  },
];

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(Object.fromEntries(ALL_KEYS.map(k => [k, 0])));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (weights: Record<string, number>) => {
    const next = { ...scores };
    for (const [k, v] of Object.entries(weights)) next[k] = (next[k] || 0) + v;
    setScores(next);
    if (currentQ + 1 >= questions.length) { setScores(next); setShowResult(true); }
    else setCurrentQ(currentQ + 1);
  };

  const resetQuiz = () => { setScores(Object.fromEntries(ALL_KEYS.map(k => [k, 0]))); setCurrentQ(0); setShowResult(false); };

  // Compute relative strengths - normalize against the top score so the #1 career is always 100%
  const maxScore = Math.max(...Object.values(scores), 1);
  const sorted = ALL_KEYS.map(k => ({ key: k, score: scores[k], strength: Math.round((scores[k] / maxScore) * 100) })).sort((a, b) => b.score - a.score);
  const topCareer = sorted[0];
  // Group into tiers
  const strongFit = sorted.filter(s => s.strength >= 70);
  const goodFit = sorted.filter(s => s.strength >= 40 && s.strength < 70);
  const lowerFit = sorted.filter(s => s.strength < 40);

  const DESCS: Record<string, string> = {
    ib: 'You thrive under pressure, love deal execution, and want to work on headline transactions.',
    pe: 'You want to invest in and improve businesses - ownership, diligence, and value creation.',
    vc: 'You\'re drawn to innovation, founders, and the startup ecosystem.',
    consulting: 'You love solving ambiguous problems, working across industries, and advising leadership.',
    am: 'You\'re passionate about markets, building conviction, and managing capital.',
    accounting: 'You value precision, clear standards, and building foundational expertise.',
    st: 'You thrive on real-time decision-making, markets, and direct P&L accountability.',
    er: 'You love deep research, writing, and forming differentiated views on public companies.',
    re: 'You\'re interested in tangible assets, property cash flows, and deal-oriented real estate investing.',
    rx: 'You\'re drawn to complexity, distressed situations, and high-stakes problem solving.',
  };

  const progressPct = (currentQ / questions.length) * 100;

  return (
    <div className="app">
      <Sidebar activePage="learn" />
      <main className="quiz-main">
        <div className="quiz-container">
          <Link href="/learn" className="quiz-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Learn
          </Link>

          {!showResult ? (
            <div className="quiz-card">
              <div className="quiz-progress-wrapper">
                <div className="quiz-progress-bar" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="quiz-header">
                <span className="quiz-step">Question {currentQ + 1} of {questions.length}</span>
                <h1 className="quiz-question">{questions[currentQ].question}</h1>
              </div>
              <div className="quiz-options">
                {questions[currentQ].options.map((opt, i) => (
                  <button key={i} className="quiz-option-btn" onClick={() => handleSelect(opt.w)} type="button">
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-result fade-in">
              <div className="quiz-result-top">
                <h2 className="quiz-result-heading">Your Career <em>Profile</em></h2>
                <p className="quiz-result-sub">Based on your personality and preferences, here's where you naturally align.</p>
              </div>

              {/* Top match - big and clear */}
              <div className="quiz-top-match" style={{ borderColor: CAREERS[topCareer.key].color + '40' }}>
                <div className="quiz-top-badge">Your Strongest Fit</div>
                <div className="quiz-top-title" style={{ color: CAREERS[topCareer.key].color }}>{CAREERS[topCareer.key].title}</div>
                <p className="quiz-top-desc">{DESCS[topCareer.key]}</p>
                <Link href={CAREERS[topCareer.key].href} className="quiz-top-cta" style={{ background: CAREERS[topCareer.key].color }}>
                  Start Preparing →
                </Link>
              </div>

              {/* Strong fits (70%+) - show as clear contenders */}
              {strongFit.length > 1 && (
                <div className="quiz-tier">
                  <div className="quiz-tier-label">Also a strong fit</div>
                  <div className="quiz-tier-cards">
                    {strongFit.slice(1).map(s => {
                      const c = CAREERS[s.key];
                      return (
                        <Link key={s.key} href={c.href} className="quiz-tier-card" style={{ borderColor: c.color + '30' }}>
                          <div className="quiz-tc-bar" style={{ background: c.color, width: `${s.strength}%` }} />
                          <div className="quiz-tc-name">{c.title}</div>
                          <div className="quiz-tc-strength" style={{ color: c.color }}>{s.strength}%</div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Good fits (40-69%) - worth exploring */}
              {goodFit.length > 0 && (
                <div className="quiz-tier">
                  <div className="quiz-tier-label">Worth exploring</div>
                  <div className="quiz-tier-list">
                    {goodFit.map(s => {
                      const c = CAREERS[s.key];
                      return (
                        <div key={s.key} className="quiz-tier-row">
                          <div className="quiz-tr-name">{c.title}</div>
                          <div className="quiz-tr-bar-wrap">
                            <div className="quiz-tr-bar" style={{ width: `${s.strength}%`, background: c.color }} />
                          </div>
                          <div className="quiz-tr-strength">{s.strength}%</div>
                          <Link href={c.href} className="quiz-tr-link">Explore →</Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lower fits - collapsed, just names */}
              {lowerFit.length > 0 && (
                <div className="quiz-tier quiz-tier-low">
                  <div className="quiz-tier-label">Lower alignment</div>
                  <div className="quiz-low-list">
                    {lowerFit.map(s => (
                      <span key={s.key} className="quiz-low-item">{CAREERS[s.key].title} · {s.strength}%</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="quiz-result-actions">
                <button className="quiz-secondary-btn" onClick={resetQuiz} type="button">Retake Quiz</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
