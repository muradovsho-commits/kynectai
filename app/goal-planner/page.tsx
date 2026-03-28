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
  { id: 'pe_umm', label: 'PE Associate — Upper Middle Market', firm: 'Thoma Bravo / Vista / Silver Lake' },
  { id: 'mbb', label: 'Consulting — MBB', firm: 'McKinsey / Bain / BCG' },
  { id: 'cons_t2', label: 'Consulting — Tier 2', firm: 'Deloitte S&O / OW / LEK / Kearney' },
  { id: 'st', label: 'S&T Summer Analyst', firm: 'Goldman / JPM / Morgan Stanley / Citi' },
  { id: 'er', label: 'Equity Research Associate', firm: 'Top sell-side platforms' },
  { id: 'vc', label: 'VC Analyst / Associate', firm: 'Sequoia / a16z / Benchmark / GC' },
  { id: 're', label: 'REPE Analyst / Associate', firm: 'Blackstone RE / Brookfield / Starwood' },
  { id: 'rx', label: 'Restructuring Analyst', firm: 'Houlihan Lokey / PJT / Evercore / Lazard' },
  { id: 'quant', label: 'Quant Researcher / Trader', firm: 'Citadel / Two Sigma / Jane Street / DE Shaw' },
  { id: 'am', label: 'Asset Management Analyst', firm: 'Fidelity / T. Rowe / Wellington / Capital Group' },
];

type Task = { id: string; text: string; week: number; category: string; done: boolean };

function generatePlan(roleId: string): Task[] {
  const base: { text: string; week: number; category: string }[] = [];

  // Universal tasks
  base.push({ text: 'Complete your OfferBell profile (school, year, target role)', week: 1, category: 'Setup' });
  base.push({ text: 'Set up LinkedIn profile with professional headshot and summary', week: 1, category: 'Setup' });

  if (roleId.startsWith('ib') || roleId.startsWith('pe') || roleId === 'rx') {
    base.push({ text: 'Master the 3-statement linkage (do 10 walk-throughs)', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold outreach emails to analysts/associates', week: 1, category: 'Networking' });
    base.push({ text: 'Complete Accounting module in Learning Hub', week: 2, category: 'Technical' });
    base.push({ text: 'Schedule 3 coffee chats from outreach responses', week: 2, category: 'Networking' });
    base.push({ text: 'Master DCF — be able to walk through in 2 minutes', week: 2, category: 'Technical' });
    base.push({ text: 'Do 50 flashcards (mix of Accounting + Valuation)', week: 2, category: 'Technical' });
    base.push({ text: 'Send 10 more cold emails to new contacts', week: 3, category: 'Networking' });
    base.push({ text: 'Complete Valuation module in Learning Hub', week: 3, category: 'Technical' });
    base.push({ text: 'Practice "Walk me through your resume" — record yourself', week: 3, category: 'Behavioral' });
    base.push({ text: 'Master LBO fundamentals — be able to walk through sources & uses', week: 3, category: 'Technical' });
    base.push({ text: 'Follow up with all coffee chat contacts (thank you emails)', week: 4, category: 'Networking' });
    base.push({ text: 'Complete M&A module — accretion/dilution, merger model steps', week: 4, category: 'Technical' });
    base.push({ text: 'Prepare 3 behavioral stories (leadership, conflict, failure)', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do a full mock interview with a friend or OfferBell Coach', week: 4, category: 'Behavioral' });
    base.push({ text: 'Send 10 more outreach emails — expand to new firms', week: 5, category: 'Networking' });
    base.push({ text: 'Do 100 flashcards covering all categories', week: 5, category: 'Technical' });
    base.push({ text: 'Practice "Why this firm?" for your top 5 target firms', week: 5, category: 'Behavioral' });
    base.push({ text: 'Complete full technical review — identify weak spots', week: 6, category: 'Technical' });
    base.push({ text: 'Do 2 full mock interviews (back-to-back superday format)', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final outreach push — 10 more emails to remaining targets', week: 6, category: 'Networking' });
  }

  if (roleId.startsWith('pe')) {
    base.push({ text: 'Master paper LBO — practice with 5 different prompts', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare an investment pitch (company you would buy)', week: 4, category: 'Technical' });
    base.push({ text: 'Study 3 recent PE deals in your target firm\'s portfolio', week: 5, category: 'Research' });
  }

  if (roleId === 'mbb' || roleId === 'cons_t2') {
    base.push({ text: 'Complete Consulting Mindset module in Learning Hub', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold outreach emails to consultants', week: 1, category: 'Networking' });
    base.push({ text: 'Build 5 custom issue trees from scratch (no frameworks)', week: 2, category: 'Technical' });
    base.push({ text: 'Do 3 live cases with a partner — focus on structure', week: 2, category: 'Technical' });
    base.push({ text: 'Master mental math — 10 min daily drills', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Case Types module — profitability, market entry, M&A', week: 3, category: 'Technical' });
    base.push({ text: 'Do 5 more live cases — focus on synthesis and recommendation', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare PEI stories — leadership, impact, persuasion', week: 3, category: 'Behavioral' });
    base.push({ text: 'Schedule 3+ coffee chats from outreach responses', week: 3, category: 'Networking' });
    base.push({ text: 'Do 5 cases focusing on quant/exhibit interpretation', week: 4, category: 'Technical' });
    base.push({ text: 'Polish "Tell me about yourself" — practice until natural', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do 6 live cases — alternate interviewer-led and candidate-led', week: 5, category: 'Technical' });
    base.push({ text: 'Full PEI practice — record and review', week: 5, category: 'Behavioral' });
    base.push({ text: 'Simulate 2 full interview days under time pressure', week: 6, category: 'Behavioral' });
    base.push({ text: 'Final case review — sharpen recommendations and presence', week: 6, category: 'Technical' });
  }

  if (roleId === 'st') {
    base.push({ text: 'Start daily market check — S&P, 10Y yield, oil, EUR/USD, VIX', week: 1, category: 'Markets' });
    base.push({ text: 'Complete S&T Foundations + Asset Classes modules', week: 1, category: 'Technical' });
    base.push({ text: 'Send 10 cold emails to S&T professionals', week: 1, category: 'Networking' });
    base.push({ text: 'Mental math drills — 15 min daily', week: 2, category: 'Technical' });
    base.push({ text: 'Complete Probability + Trading Games modules', week: 2, category: 'Technical' });
    base.push({ text: 'Prepare 2 trade ideas (long + short) with thesis/catalyst/risk', week: 3, category: 'Technical' });
    base.push({ text: 'Complete Options & Bond Math module', week: 3, category: 'Technical' });
    base.push({ text: 'Practice "Why S&T?" and "Why trading vs sales?"', week: 4, category: 'Behavioral' });
    base.push({ text: 'Do a mock trading game with a friend', week: 4, category: 'Technical' });
    base.push({ text: 'Full mock S&T interview — markets + brainteasers + behavioral', week: 5, category: 'Behavioral' });
  }

  if (roleId === 'er') {
    base.push({ text: 'Pick a sector to follow — identify 5 public companies', week: 1, category: 'Research' });
    base.push({ text: 'Build a financial model for one company in your sector', week: 2, category: 'Technical' });
    base.push({ text: 'Prepare 2 stock pitches (1 long, 1 short)', week: 3, category: 'Technical' });
    base.push({ text: 'Practice delivering each pitch in 2 minutes', week: 4, category: 'Behavioral' });
    base.push({ text: 'Write a 5-page sample research report', week: 5, category: 'Technical' });
  }

  if (roleId === 'vc') {
    base.push({ text: 'Pick 1-2 sectors — develop a written thesis', week: 1, category: 'Research' });
    base.push({ text: 'Read 10 pitch decks and write 1-page memos for each', week: 2, category: 'Technical' });
    base.push({ text: 'Prepare 3 company deep-dives you can discuss for 10+ min', week: 3, category: 'Technical' });
    base.push({ text: 'Learn term sheet basics — liquidation pref, anti-dilution, pro-rata', week: 3, category: 'Technical' });
    base.push({ text: 'Start a blog/Substack analyzing startups', week: 4, category: 'Research' });
  }

  if (roleId === 're') {
    base.push({ text: 'Learn RE fundamentals — NOI, cap rate, DSCR, LTV', week: 1, category: 'Technical' });
    base.push({ text: 'Build a simple apartment pro forma from scratch', week: 2, category: 'Technical' });
    base.push({ text: 'Learn waterfall distributions — practice with numbers', week: 3, category: 'Technical' });
    base.push({ text: 'Prepare 1-2 investment ideas with specific numbers', week: 4, category: 'Technical' });
    base.push({ text: 'Follow CBRE/JLL reports — know current market trends', week: 4, category: 'Research' });
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
    // Load saved plan
    try {
      const saved = localStorage.getItem('offerbell_goal_plan');
      if (saved) { const d = JSON.parse(saved); setSelectedRole(d.role); setPlan(d.tasks); }
    } catch {}
    // Compute streak
    computeStreak();
  }, [router]);

  const computeStreak = () => {
    try {
      const activity = JSON.parse(localStorage.getItem('offerbell_activity') || '{}');
      const today = new Date().toISOString().slice(0,10);
      setTodayCount(activity[today] || 0);
      let s = 0;
      const d = new Date();
      while (true) {
        const key = d.toISOString().slice(0,10);
        if (activity[key] && activity[key] > 0) { s++; d.setDate(d.getDate() - 1); }
        else break;
      }
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
    // Track activity
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
            {/* Streak Badge */}
            <div style={{display:'flex',gap:'12px'}}>
              {streak > 0 && (
                <div style={{background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',padding:'8px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:700,display:'flex',alignItems:'center',gap:'6px'}}>
                  🔥 {streak}-day streak
                </div>
              )}
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',padding:'8px 16px',borderRadius:'10px',fontSize:'13px',fontWeight:600,color:'var(--text-2)'}}>
                Today: {todayCount} action{todayCount !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {plan.length === 0 ? (
            <div>
              <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'16px',padding:'28px 32px',marginBottom:'20px'}}>
                <h2 style={{fontFamily:"'Instrument Serif', serif",fontSize:'20px',color:'var(--text)',marginBottom:'16px'}}>What are you recruiting for?</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  {ROLE_TARGETS.map(r => (
                    <div key={r.id} onClick={() => setSelectedRole(r.id)} style={{padding:'14px 16px',borderRadius:'10px',border: selectedRole === r.id ? '2px solid var(--accent)' : '1.5px solid var(--border)',background: selectedRole === r.id ? 'var(--accent-light, rgba(99,102,241,0.08))' : 'var(--bg)',cursor:'pointer',transition:'all 0.15s'}}>
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
              {/* Progress Bar */}
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

              {/* Weekly Tasks */}
              {weeks.map(w => {
                const weekTasks = plan.filter(t => t.week === w);
                const weekDone = weekTasks.filter(t => t.done).length;
                return (
                  <div key={w} style={{marginBottom:'16px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)',textTransform:'uppercase',letterSpacing:'0.5px'}}>Week {w}</div>
                      <div style={{fontSize:'11px',color:'var(--text-3)',background:'var(--surface-2)',padding:'2px 10px',borderRadius:'8px'}}>{weekDone}/{weekTasks.length}</div>
                    </div>
                    {weekTasks.map(t => (
                      <div key={t.id} onClick={() => toggleTask(t.id)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:'10px',marginBottom:'6px',cursor:'pointer',opacity: t.done ? 0.6 : 1}}>
                        <div style={{width:'20px',height:'20px',borderRadius:'6px',border: t.done ? 'none' : '2px solid var(--border)',background: t.done ? 'var(--accent)' : 'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          {t.done && <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'13px',fontWeight:600,color:'var(--text)',textDecoration: t.done ? 'line-through' : 'none'}}>{t.text}</div>
                        </div>
                        <span style={{fontSize:'10px',padding:'3px 8px',borderRadius:'6px',background:'var(--surface-2)',color:'var(--text-3)',fontWeight:600}}>{t.category}</span>
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
