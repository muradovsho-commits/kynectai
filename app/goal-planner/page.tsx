'use client';
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

const ROLE_TARGETS = [
  { id: 'ib_bb', label: 'IB Summer Analyst — Bulge Bracket', firm: 'Goldman Sachs / J.P. Morgan / Morgan Stanley' },
  { id: 'ib_eb', label: 'IB Summer Analyst — Elite Boutique', firm: 'Evercore / Lazard / Centerview / PJT' },
  { id: 'ib_mm', label: 'IB Summer Analyst — Middle Market', firm: 'Houlihan Lokey / Jefferies / William Blair' },
  { id: 'pe_mf', label: 'PE Associate — Mega-Fund', firm: 'Blackstone / KKR / Apollo / Carlyle' },
  { id: 'pe_umm', label: 'PE Associate — Upper Middle Market', firm: 'Thoma Bravo / Vista / Silver Lake / H&F' },
  { id: 'mbb', label: 'Consulting — MBB', firm: 'McKinsey / Bain / BCG' },
  { id: 'cons_t2', label: 'Consulting — Tier 2', firm: 'Deloitte S&O / OW / LEK / Kearney' },
  { id: 'am', label: 'Asset Management Analyst', firm: 'Fidelity / T. Rowe / Wellington / Capital Group' },
  { id: 'acct', label: 'Accounting & Audit — Big 4', firm: 'Deloitte / PwC / EY / KPMG' },
  { id: 'er', label: 'Equity Research Associate', firm: 'Goldman / JPM / Morgan Stanley / BofA / Barclays' },
  { id: 'st', label: 'S&T Summer Analyst', firm: 'Goldman / JPM / Morgan Stanley / Citi' },
  { id: 'vc', label: 'VC Analyst / Associate', firm: 'Sequoia / a16z / Benchmark / General Catalyst' },
  { id: 're', label: 'REPE Analyst / Associate', firm: 'Blackstone RE / Brookfield / Starwood' },
  { id: 'rx', label: 'Restructuring Analyst', firm: 'Houlihan Lokey / PJT / Evercore / Lazard' },
];

type Task = { id: string; text: string; week: number; category: string; done: boolean };

function generatePlan(roleId: string): Task[] {
  const base: { text: string; week: number; category: string }[] = [];

  // ── Universal first steps ──
  base.push({ text: 'Complete your OfferBell profile (school, year, target role)', week: 1, category: 'Setup' });
  base.push({ text: 'Polish LinkedIn — professional headshot, headline, summary, experiences', week: 1, category: 'Setup' });

  // ── IB (all tiers) ──
  if (roleId.startsWith('ib')) {
    base.push({ text: 'Master the 3-statement linkage — do 10 walk-throughs until automatic', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold outreach emails to analysts/associates at target banks', week: 1, category: 'Networking' });
    base.push({ text: 'Complete Accounting module in Learning Hub', week: 2, category: 'Technical' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 2, category: 'Networking' });
    base.push({ text: 'Master DCF — be able to walk through in under 2 minutes', week: 2, category: 'Technical' });
    base.push({ text: 'Do 50 flashcards (Accounting + Valuation mix)', week: 2, category: 'Technical' });
    base.push({ text: 'Send 10 more cold emails to new contacts at different banks', week: 3, category: 'Networking' });
    base.push({ text: 'Complete Valuation module — comps, precedents, DCF, LBO', week: 3, category: 'Technical' });
    base.push({ text: 'Practice "Walk me through your resume" — record and critique yourself', week: 3, category: 'Behavioral' });
    base.push({ text: 'Master LBO fundamentals — sources & uses, debt tranches, IRR/MOIC', week: 3, category: 'Technical' });
    base.push({ text: 'Follow up with all coffee chat contacts (thank you emails within 24hrs)', week: 4, category: 'Networking' });
    base.push({ text: 'Complete M&A module — accretion/dilution, merger model steps, synergies', week: 4, category: 'Technical' });
    base.push({ text: 'Prepare 3 behavioral stories (leadership, teamwork, failure) using STAR', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do a full mock interview with a friend or OfferBell Coach', week: 4, category: 'Behavioral' });
    base.push({ text: 'Send 10 more outreach emails — expand to new firms and groups', week: 5, category: 'Networking' });
    base.push({ text: 'Do 100 flashcards covering all IB categories', week: 5, category: 'Technical' });
    base.push({ text: 'Prepare "Why this firm?" for your top 5 target banks', week: 5, category: 'Behavioral' });
    base.push({ text: 'Complete full technical review — identify and drill weak spots', week: 6, category: 'Technical' });
    base.push({ text: 'Do 2 full mock superdays (3-5 back-to-back interviews)', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final outreach push — 10 more emails to remaining targets', week: 6, category: 'Networking' });
  }

  // ── PE ──
  if (roleId.startsWith('pe')) {
    base.push({ text: 'Master the 3-statement linkage and EBITDA-to-FCF bridge', week: 1, category: 'Technical' });
    base.push({ text: 'Reach out to 5 headhunters and 5 PE associates via cold email', week: 1, category: 'Networking' });
    base.push({ text: 'Complete PE Fundamentals + Accounting Mastery in Learning Hub', week: 2, category: 'Technical' });
    base.push({ text: 'Master the full LBO model — sources & uses through IRR calculation', week: 2, category: 'Technical' });
    base.push({ text: 'Do 50 PE flashcards (accounting + LBO + valuation)', week: 2, category: 'Technical' });
    base.push({ text: 'Practice paper LBOs — do 5 different prompts under time pressure', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare an investment pitch (a company you would buy in an LBO)', week: 3, category: 'Technical' });
    base.push({ text: 'Complete Debt & Capital Structure + Returns modules', week: 3, category: 'Technical' });
    base.push({ text: 'Study 3 recent deals from your target firm\'s portfolio', week: 4, category: 'Research' });
    base.push({ text: 'Prepare "Why PE?" and "Why our firm?" with specific deal references', week: 4, category: 'Behavioral' });
    base.push({ text: 'Prepare behavioral stories — biggest failure, leadership, investment thesis defense', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do a full mock PE interview (technicals + paper LBO + behavioral)', week: 5, category: 'Behavioral' });
    base.push({ text: 'Master advanced topics — dividend recaps, PIK, covenant analysis', week: 5, category: 'Technical' });
    base.push({ text: 'Complete full technical review — 100+ flashcards, timed', week: 6, category: 'Technical' });
    base.push({ text: 'Simulate a 4-hour modeling test under exam conditions', week: 6, category: 'Technical' });
    base.push({ text: 'Do 2 full mock PE superdays', week: 6, category: 'Behavioral' });
  }

  // ── Consulting ──
  if (roleId === 'mbb' || roleId === 'cons_t2') {
    base.push({ text: 'Complete Consulting Mindset module — hypothesis-driven thinking, MECE', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold outreach emails to consultants at target firms', week: 1, category: 'Networking' });
    base.push({ text: 'Build 5 custom issue trees from scratch (no memorized frameworks)', week: 2, category: 'Technical' });
    base.push({ text: 'Do 3 live cases with a partner — focus on structure quality', week: 2, category: 'Technical' });
    base.push({ text: 'Start daily mental math drills — 10 min every morning', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Framework Building + Case Types modules', week: 3, category: 'Technical' });
    base.push({ text: 'Do 5 more live cases — focus on synthesis and final recommendation', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare PEI stories — leadership, personal impact, persuasion', week: 3, category: 'Behavioral' });
    base.push({ text: 'Schedule 3+ coffee chats from outreach responses', week: 3, category: 'Networking' });
    base.push({ text: 'Do 5 cases focusing on quant and exhibit interpretation', week: 4, category: 'Technical' });
    base.push({ text: 'Polish "Tell me about yourself" — practice until it sounds natural', week: 4, category: 'Behavioral' });
    base.push({ text: 'Send 10 more outreach emails — expand firm list', week: 4, category: 'Networking' });
    base.push({ text: 'Do 6 live cases — alternate interviewer-led and candidate-led formats', week: 5, category: 'Technical' });
    base.push({ text: 'Full PEI practice — record yourself, review for clarity and energy', week: 5, category: 'Behavioral' });
    base.push({ text: 'Prepare "Why consulting?" and "Why this firm?" answers', week: 5, category: 'Behavioral' });
    base.push({ text: 'Simulate 2 full interview days under real time pressure', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final case review — sharpen recommendations and executive presence', week: 6, category: 'Technical' });
    base.push({ text: 'Do the Daily 30-Minute Drill Menu for 7 consecutive days', week: 6, category: 'Technical' });
  }

  // ── Asset Management ──
  if (roleId === 'am') {
    base.push({ text: 'Complete Macro & Markets module — yield curves, rates, asset classes', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold outreach emails to analysts/PMs at target firms', week: 1, category: 'Networking' });
    base.push({ text: 'Start reading WSJ Markets and Bloomberg daily — build the habit', week: 1, category: 'Research' });
    base.push({ text: 'Complete Valuation & Technicals module — DCF, DDM, comps', week: 2, category: 'Technical' });
    base.push({ text: 'Pick a sector to follow — identify 5 public companies to track', week: 2, category: 'Research' });
    base.push({ text: 'Build a simple financial model for one company in your sector', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare 2 stock pitches (1 long, 1 short) with variant perception', week: 3, category: 'Technical' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 3, category: 'Networking' });
    base.push({ text: 'Complete Stock Pitching module — practice delivering in 2 minutes', week: 4, category: 'Technical' });
    base.push({ text: 'Prepare "Why AM?" and "Why this firm?" — show genuine market passion', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do 50 AM flashcards covering macro, valuation, and stock pitching', week: 4, category: 'Technical' });
    base.push({ text: 'Have a friend push back on your stock pitches for 10 minutes each', week: 5, category: 'Behavioral' });
    base.push({ text: 'Prepare behavioral stories — a time you were wrong about a stock, risk management', week: 5, category: 'Behavioral' });
    base.push({ text: 'Send 10 more outreach emails to firms you haven\'t contacted', week: 5, category: 'Networking' });
    base.push({ text: 'Do a full mock AM interview — market questions + pitch + behavioral', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final review — know current markets cold (rates, indices, recent moves)', week: 6, category: 'Technical' });
  }

  // ── Accounting & Audit ──
  if (roleId === 'acct') {
    base.push({ text: 'Complete Accounting Fundamentals module in Learning Hub', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold emails to campus recruiters and Big 4 professionals', week: 1, category: 'Networking' });
    base.push({ text: 'Master GAAP vs IFRS key differences — prepare a comparison sheet', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Financial Statements module — walk-throughs and linkages', week: 2, category: 'Technical' });
    base.push({ text: 'Attend your school\'s Meet the Firms event or Big 4 info session', week: 2, category: 'Networking' });
    base.push({ text: 'Do 50 Accounting flashcards covering journal entries and adjustments', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare "Why audit/tax?" and "Why this firm?" — reference specific service lines', week: 3, category: 'Behavioral' });
    base.push({ text: 'Complete Audit Process module — engagement types, materiality, sampling', week: 3, category: 'Technical' });
    base.push({ text: 'Schedule 3+ coffee chats with Big 4 associates or managers', week: 4, category: 'Networking' });
    base.push({ text: 'Prepare behavioral stories — teamwork, attention to detail, meeting deadlines', week: 4, category: 'Behavioral' });
    base.push({ text: 'Research CPA exam requirements — plan your study timeline', week: 4, category: 'Research' });
    base.push({ text: 'Practice "Tell me about yourself" tailored for Big 4 interviews', week: 5, category: 'Behavioral' });
    base.push({ text: 'Do a full mock Big 4 interview — technical + behavioral', week: 5, category: 'Behavioral' });
    base.push({ text: 'Send follow-up thank you emails to all contacts', week: 5, category: 'Networking' });
    base.push({ text: 'Review ethics and professional responsibility concepts', week: 6, category: 'Technical' });
    base.push({ text: 'Final technical review — 100 flashcards, timed', week: 6, category: 'Technical' });
  }

  // ── Equity Research ──
  if (roleId === 'er') {
    base.push({ text: 'Pick a sector you\'re genuinely passionate about — identify 5 companies', week: 1, category: 'Research' });
    base.push({ text: 'Send 10 cold emails to research associates and analysts', week: 1, category: 'Networking' });
    base.push({ text: 'Complete ER Fundamentals module — reports, sell-side vs buy-side', week: 1, category: 'Technical' });
    base.push({ text: 'Build a detailed financial model for one company in your sector', week: 2, category: 'Technical' });
    base.push({ text: 'Read 5 earnings call transcripts — summarize key takeaways', week: 2, category: 'Research' });
    base.push({ text: 'Complete Modeling & Valuation module — EPS forecasting, price targets', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare 2 stock pitches (1 long, 1 short) with specific catalysts', week: 3, category: 'Technical' });
    base.push({ text: 'Practice delivering each pitch in exactly 2 minutes — record yourself', week: 3, category: 'Behavioral' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 4, category: 'Networking' });
    base.push({ text: 'Have a friend push back on every assumption in your pitches', week: 4, category: 'Behavioral' });
    base.push({ text: 'Write a 5-page sample research report with valuation and rating', week: 4, category: 'Technical' });
    base.push({ text: 'Prepare "Why ER?" and "What sector would you cover?" with deep answers', week: 5, category: 'Behavioral' });
    base.push({ text: 'Complete Technical Questions module — accounting, valuation, industry Q&A', week: 5, category: 'Technical' });
    base.push({ text: 'Send 10 more outreach emails to additional firms', week: 5, category: 'Networking' });
    base.push({ text: 'Do a full mock ER interview — pitch + technicals + behavioral', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final review — know your sector cold, current prices, recent earnings', week: 6, category: 'Technical' });
  }

  // ── Sales & Trading ──
  if (roleId === 'st') {
    base.push({ text: 'Start daily market check — S&P, 10Y yield, oil, EUR/USD, VIX', week: 1, category: 'Markets' });
    base.push({ text: 'Complete S&T Foundations + Asset Classes modules', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold emails to S&T professionals at target banks', week: 1, category: 'Networking' });
    base.push({ text: 'Start daily mental math drills — 15 min with a timer', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Mental Math & Probability module — expected value, Bayes', week: 2, category: 'Technical' });
    base.push({ text: 'Do 30 probability and brainteaser problems from "Heard on the Street"', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Trading Games & Risk module — practice mock trading', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare 2 trade ideas (long + short) with thesis, catalyst, and risk', week: 3, category: 'Technical' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 3, category: 'Networking' });
    base.push({ text: 'Complete Options & Bond Math module — Greeks, duration, yield curve', week: 4, category: 'Technical' });
    base.push({ text: 'Practice "Why S&T?" and "Why trading vs sales?" answers', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do a mock trading game with a friend', week: 4, category: 'Technical' });
    base.push({ text: 'Update your trade ideas with current market data', week: 5, category: 'Markets' });
    base.push({ text: 'Do 50 S&T flashcards covering all categories', week: 5, category: 'Technical' });
    base.push({ text: 'Full mock S&T interview — markets + brainteasers + trade idea + behavioral', week: 5, category: 'Behavioral' });
    base.push({ text: 'Final review — make sure you can rattle off all market levels without checking', week: 6, category: 'Markets' });
    base.push({ text: 'Do 2 full mock S&T interview days', week: 6, category: 'Behavioral' });
  }

  // ── Venture Capital ──
  if (roleId === 'vc') {
    base.push({ text: 'Pick 1-2 sectors you\'re passionate about — start developing a written thesis', week: 1, category: 'Research' });
    base.push({ text: 'Complete VC Fundamentals module — power law, fund economics, stages', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold emails to VC associates and principals', week: 1, category: 'Networking' });
    base.push({ text: 'Read 10 startup pitch decks — write a 1-page investment memo for each', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Startup Evaluation module — SaaS metrics, marketplace metrics', week: 2, category: 'Technical' });
    base.push({ text: 'Follow 10-15 VCs on Twitter/X for deal flow and market commentary', week: 2, category: 'Research' });
    base.push({ text: 'Prepare 3 company deep-dives you can discuss for 10+ minutes each', week: 3, category: 'Technical' });
    base.push({ text: 'Learn term sheet basics — liquidation preference, anti-dilution, pro-rata', week: 3, category: 'Technical' });
    base.push({ text: 'Schedule 3 coffee chats — ask about their investment process', week: 3, category: 'Networking' });
    base.push({ text: 'Start a blog/Substack analyzing startups — publish your first piece', week: 4, category: 'Research' });
    base.push({ text: 'Prepare "Why VC?" and "What sectors excite you?" with deep, specific answers', week: 4, category: 'Behavioral' });
    base.push({ text: 'Complete VC Technicals module — fund math, market sizing, deal terms', week: 4, category: 'Technical' });
    base.push({ text: 'Practice evaluating a pitch deck live in 10 minutes', week: 5, category: 'Technical' });
    base.push({ text: 'Send 10 more outreach emails — include founders for warm intros', week: 5, category: 'Networking' });
    base.push({ text: 'Do a full mock VC interview — sector thesis + company pitch + deck eval', week: 6, category: 'Behavioral' });
    base.push({ text: 'Publish 2 more startup analyses — build your public portfolio', week: 6, category: 'Research' });
  }

  // ── Real Estate ──
  if (roleId === 're') {
    base.push({ text: 'Complete RE Fundamentals module — NOI, cap rates, property types, REPE vs REITs', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold emails to REPE analysts/associates and RE bankers', week: 1, category: 'Networking' });
    base.push({ text: 'Start following CBRE and JLL market research reports', week: 1, category: 'Research' });
    base.push({ text: 'Build a simple apartment pro forma from scratch on paper', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Pro Forma Modeling module — DSCR, LTV, waterfall structures', week: 2, category: 'Technical' });
    base.push({ text: 'Learn waterfall distributions — practice with specific dollar amounts', week: 3, category: 'Technical' });
    base.push({ text: 'Know current 10Y Treasury yield and direction of cap rates in major markets', week: 3, category: 'Research' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 3, category: 'Networking' });
    base.push({ text: 'Prepare 1-2 investment ideas with specific numbers (market, cap rate, IRR)', week: 4, category: 'Technical' });
    base.push({ text: 'Prepare "Why real estate?" and "Why REPE over traditional PE?"', week: 4, category: 'Behavioral' });
    base.push({ text: 'Complete Technical Questions module — cap rate deep dive, FFO, market knowledge', week: 4, category: 'Technical' });
    base.push({ text: 'Practice "Walk me through a property acquisition" end-to-end', week: 5, category: 'Technical' });
    base.push({ text: 'Send 10 more outreach emails to additional firms', week: 5, category: 'Networking' });
    base.push({ text: 'Do a full mock REPE interview — technicals + deal walkthrough + behavioral', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final review — know 2-3 recent notable RE transactions in your target sector', week: 6, category: 'Research' });
  }

  // ── Restructuring ──
  if (roleId === 'rx') {
    base.push({ text: 'Master the 3-statement linkage — same foundation as IB', week: 1, category: 'Technical' });
    base.push({ text: 'Complete RX Fundamentals module — Chapter 11, priority of claims, DIP', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold emails to RX analysts/associates at target firms', week: 1, category: 'Networking' });
    base.push({ text: 'Memorize the priority of claims waterfall — be able to recite it cold', week: 2, category: 'Technical' });
    base.push({ text: 'Complete RX Technicals module — distressed valuation, fulcrum security, credit analysis', week: 2, category: 'Technical' });
    base.push({ text: 'Study 3 notable bankruptcy cases (Lehman, Hertz, J.Crew) — know the facts', week: 3, category: 'Research' });
    base.push({ text: 'Practice fulcrum security analysis with 5 different capital structures', week: 3, category: 'Technical' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 3, category: 'Networking' });
    base.push({ text: 'Build a simplified 13-week cash flow model from scratch', week: 4, category: 'Technical' });
    base.push({ text: 'Prepare "Why restructuring?" and "Why RX over M&A?"', week: 4, category: 'Behavioral' });
    base.push({ text: 'Master IB accounting + valuation technicals (same questions as IB interviews)', week: 4, category: 'Technical' });
    base.push({ text: 'Practice walking through Chapter 11 in under 2 minutes — record yourself', week: 5, category: 'Technical' });
    base.push({ text: 'Do 50 flashcards covering IB accounting + RX-specific questions', week: 5, category: 'Technical' });
    base.push({ text: 'Send 10 more outreach emails — include distressed debt funds', week: 5, category: 'Networking' });
    base.push({ text: 'Do a full mock RX interview — technicals + case + behavioral', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final review — know current credit spreads, default rates, and 2-3 active distressed situations', week: 6, category: 'Research' });
  }

  return base.map((t, i) => ({ ...t, id: `task_${i}`, done: false }));
}

export default function GoalPlannerPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');
  const [plan, setPlan] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = window.localStorage.getItem('offerbell_user_id');
    if (!s) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    try { const saved = localStorage.getItem('offerbell_goal_plan'); if (saved) { const d = JSON.parse(saved); setSelectedRole(d.role); setPlan(d.tasks); } } catch {}
    computeStreak();
  }, [router]);

  const computeStreak = () => {
    try {
      const activity = JSON.parse(localStorage.getItem('offerbell_activity') || '{}');
      const today = new Date().toISOString().slice(0,10);
      setTodayCount(activity[today] || 0);
      let s = 0; const d = new Date();
      while (true) { const k = d.toISOString().slice(0,10); if (activity[k] && activity[k] > 0) { s++; d.setDate(d.getDate()-1); } else break; }
      setStreak(s);
    } catch {}
  };

  const startPlan = () => {
    if (!selectedRole) return;
    const tasks = generatePlan(selectedRole);
    setPlan(tasks);
    localStorage.setItem('offerbell_goal_plan', JSON.stringify({ role: selectedRole, tasks }));
  };

  const toggleTask = (id: string) => {
    const updated = plan.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setPlan(updated);
    localStorage.setItem('offerbell_goal_plan', JSON.stringify({ role: selectedRole, tasks: updated }));
    const today = new Date().toISOString().slice(0,10);
    const activity = JSON.parse(localStorage.getItem('offerbell_activity') || '{}');
    activity[today] = (activity[today] || 0) + 1;
    localStorage.setItem('offerbell_activity', JSON.stringify(activity));
    computeStreak();
  };

  const resetPlan = () => { setPlan([]); setSelectedRole(''); localStorage.removeItem('offerbell_goal_plan'); };

  const weeks = plan.length > 0 ? [...new Set(plan.map(t => t.week))].sort((a,b) => a-b) : [];
  const completedCount = plan.filter(t => t.done).length;
  const progress = plan.length > 0 ? Math.round((completedCount / plan.length) * 100) : 0;
  const roleLabel = ROLE_TARGETS.find(r => r.id === selectedRole)?.label || '';

  const catColors: Record<string, string> = { Setup: '#6366f1', Technical: '#f59e0b', Networking: '#16a34a', Behavioral: '#8b5cf6', Research: '#06b6d4', Markets: '#ef4444' };

  return (
    <div className="app">
      <Sidebar activePage="goal-planner" />
      <main className="main">
        <div style={{maxWidth:'800px',margin:'0 auto',padding:'0 16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'24px',flexWrap:'wrap',gap:'16px'}}>
            <div>
              <h1 style={{fontFamily:"'Instrument Serif', serif",fontSize:'28px',color:'var(--text)',margin:0}}>Goal Planner</h1>
              <p style={{fontSize:'14px',color:'var(--text-3)',marginTop:'6px'}}>Pick your target role. We'll build your weekly game plan.</p>
            </div>
            <div style={{display:'flex',gap:'12px'}}>
              {streak > 0 && <div style={{background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',padding:'8px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:700,display:'flex',alignItems:'center',gap:'6px'}}>🔥 {streak}-day streak</div>}
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',padding:'8px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:600,color:'var(--text-2)'}}>Today: {todayCount} action{todayCount !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {plan.length === 0 ? (
            <div>
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'16px',padding:'28px 32px',marginBottom:'20px'}}>
                <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:'20px',color:'var(--text)',marginBottom:'16px'}}>What are you recruiting for?</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  {ROLE_TARGETS.map(r => (
                    <div key={r.id} onClick={() => setSelectedRole(r.id)} style={{padding:'14px 16px',borderRadius:'10px',border: selectedRole === r.id ? '2px solid var(--accent)' : '1.5px solid var(--border)',background: selectedRole === r.id ? 'rgba(99,102,241,0.06)' : 'var(--bg)',cursor:'pointer',transition:'all 0.15s'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>{r.label}</div>
                      <div style={{fontSize:'11px',color:'var(--text-3)',marginTop:'2px'}}>{r.firm}</div>
                    </div>
                  ))}
                </div>
                <button onClick={startPlan} disabled={!selectedRole} style={{marginTop:'20px',width:'100%',padding:'12px',borderRadius:'10px',border:'none',background: selectedRole ? 'var(--accent)' : 'var(--border)',color: selectedRole ? '#fff' : 'var(--text-3)',fontSize:'14px',fontWeight:700,cursor: selectedRole ? 'pointer' : 'default',fontFamily:"'Sora',sans-serif"}}>Generate My 6-Week Plan</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'14px',padding:'20px 24px',marginBottom:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                  <div>
                    <div style={{fontSize:'14px',fontWeight:700,color:'var(--text)'}}>{roleLabel}</div>
                    <div style={{fontSize:'12px',color:'var(--text-3)',marginTop:'2px'}}>{completedCount} of {plan.length} tasks complete</div>
                  </div>
                  <div style={{fontSize:'24px',fontWeight:700,color:'var(--accent)',fontFamily:"'Instrument Serif', serif"}}>{progress}%</div>
                </div>
                <div style={{height:'8px',borderRadius:'4px',background:'var(--surface-2)',overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${progress}%`,borderRadius:'4px',background:'linear-gradient(90deg,var(--accent),#8b5cf6)',transition:'width 0.3s'}} />
                </div>
                <button onClick={resetPlan} style={{marginTop:'12px',fontSize:'11px',color:'var(--text-3)',background:'none',border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif",textDecoration:'underline'}}>Reset plan & choose a different role</button>
              </div>

              {weeks.map(w => {
                const weekTasks = plan.filter(t => t.week === w);
                const weekDone = weekTasks.filter(t => t.done).length;
                return (
                  <div key={w} style={{marginBottom:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)',textTransform:'uppercase',letterSpacing:'0.5px'}}>Week {w}</div>
                      <div style={{fontSize:'11px',color: weekDone === weekTasks.length ? '#16a34a' : 'var(--text-3)',background:'var(--surface-2)',padding:'2px 10px',borderRadius:'8px',fontWeight: weekDone === weekTasks.length ? 700 : 400}}>{weekDone === weekTasks.length && weekTasks.length > 0 ? '✓ ' : ''}{weekDone}/{weekTasks.length}</div>
                    </div>
                    {weekTasks.map(t => (
                      <div key={t.id} onClick={() => toggleTask(t.id)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'10px',marginBottom:'6px',cursor:'pointer',opacity: t.done ? 0.55 : 1,transition:'opacity 0.15s'}}>
                        <div style={{width:'20px',height:'20px',borderRadius:'6px',border: t.done ? 'none' : '2px solid var(--border)',background: t.done ? '#16a34a' : 'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.15s'}}>
                          {t.done && <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'13px',fontWeight:600,color:'var(--text)',textDecoration: t.done ? 'line-through' : 'none'}}>{t.text}</div>
                        </div>
                        <span style={{fontSize:'10px',padding:'3px 8px',borderRadius:'6px',background: catColors[t.category] ? `${catColors[t.category]}18` : 'var(--surface-2)',color: catColors[t.category] || 'var(--text-3)',fontWeight:600,whiteSpace:'nowrap'}}>{t.category}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
