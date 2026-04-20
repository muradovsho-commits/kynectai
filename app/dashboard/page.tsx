"use client";

import Sidebar from "../components/Sidebar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./dashboard.css";

const TIPS = [
  {
    text: "The alumni angle works best when you reference something specific - the same club, program, or professor. Saying you went to the same school isn't enough.",
    source: "OfferBell reply rate data",
  },
  {
    text: "Send cold emails Monday through Thursday between 9am and 5pm. Never send on weekends - it looks desperate. If they reply on a weekend, you can respond then.",
    source: "OfferBell timing analysis",
  },
  {
    text: "Keep your cold email under 100 words. Bankers skim on their phones between meetings. If it doesn't fit on one screen, it probably won't get read.",
    source: "OfferBell outreach data",
  },
  {
    text: "Follow up exactly once, 5 to 7 business days later. A single follow-up boosts reply rates significantly. Two or more follow-ups actually hurt your chances.",
    source: "OfferBell reply rate data",
  },
  {
    text: "Reference a specific deal they worked on. It takes 3 minutes on Google and signals you did your homework - which most students don't.",
    source: "Deal reference angle data",
  },
  {
    text: "Don't ask for a job in a cold email. Ask for 15 minutes of their time. The goal of the first email is to get a conversation, not an offer.",
    source: "OfferBell outreach data",
  },
  {
    text: "Always send from your .edu email. It immediately establishes credibility and reminds them you're a student, not a random LinkedIn spammer.",
    source: "OfferBell reply rate data",
  },
  {
    text: "Before a coffee chat, prepare 3 thoughtful questions about their specific group or deals - not generic questions you could Google. That's what gets you remembered.",
    source: "OfferBell networking data",
  },
  {
    text: "Send a thank-you email within 2 hours of every call. Keep it short - reference one specific thing they said. This is how you stay top of mind.",
    source: "OfferBell follow-up data",
  },
  {
    text: "Your subject line should be under 8 words and mention your school name. Subject lines with a university name get opened at nearly double the rate.",
    source: "OfferBell outreach data",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState({ first: "", last: "" });
  const [streakDays, setStreakDays] = useState<boolean[]>([false,false,false,false,false,false,false]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [activityDaysSet, setActivityDaysSet] = useState<Set<string>>(new Set());
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [accountCreatedAt, setAccountCreatedAt] = useState<string | null>(null);
  const [upgradeToast, setUpgradeToast] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tipIdx] = useState(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.floor(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay()) / 7);
    return weekNum % TIPS.length;
  });

  // Auth guard - no onboarding redirect, tutorial handles profile setup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("offerbell_user_id");
    if (!stored) { router.replace("/signin"); return; }
    // If no profile exists yet, create a minimal stub with signup data so the app doesn't break
    try {
      const raw = window.localStorage.getItem("offerbell_onboarding_profile");
      if (!raw) {
        const signupName = window.localStorage.getItem("offerbell_signup_name") || "";
        const signupEmail = window.localStorage.getItem("offerbell_signup_email") || "";
        const parts = signupName.trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";
        window.localStorage.setItem("offerbell_onboarding_profile", JSON.stringify({
          firstName, lastName, university: "", major: "", year: "",
          targetRoles: [], recruitYear: "", targetFirms: [], email: signupEmail, plan: "free"
        }));
      }
    } catch {}
  }, [router]);

  // Tutorial trigger - show on first post-verification login
  useEffect(() => {
    if (typeof window === "undefined") return;
    const complete = localStorage.getItem('offerbell_tutorial_complete');
    // Also check inside onboarding profile (survives cross-origin deploys)
    let profileComplete = false;
    try {
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      if (prof.tutorialComplete) profileComplete = true;
    } catch {}
    if (complete || profileComplete) {
      // Make sure both are set for future checks
      localStorage.setItem('offerbell_tutorial_complete', 'true');
      return;
    }
    const step = parseInt(localStorage.getItem('offerbell_tutorial_step') || '0', 10);
    setTutorialStep(step);
    setShowTutorial(true);
  }, []);

  // Theme
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("offerbell-theme") : null;
    if (saved && typeof document !== "undefined") document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Load profile
  useEffect(() => {
    try {
      const raw = localStorage.getItem("offerbell_onboarding_profile");
      if (raw) {
        const profile = JSON.parse(raw);
        setUserName({ first: profile.firstName || "", last: profile.lastName || "" });
      }
    } catch {}
  }, []);

  // Load activity data - refresh on mount AND on window focus
  const loadStats = useCallback(() => {
    // Account creation date
    let created = localStorage.getItem('offerbell_account_created');
    if (!created) {
      created = new Date().toISOString().split('T')[0];
      localStorage.setItem('offerbell_account_created', created);
    }
    setAccountCreatedAt(created);

    // Streak / activity tracking
    try {
      const today = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem('offerbell_activity_days');
      let days: string[] = raw ? JSON.parse(raw) : [];
      // Log today if not already logged
      if (!days.includes(today)) {
        days.push(today);
        // Keep only last 90 days for calendar view
        const cutoff = new Date(Date.now() - 90 * 864e5).toISOString().split('T')[0];
        days = days.filter(d => d >= cutoff);
        localStorage.setItem('offerbell_activity_days', JSON.stringify(days));
      }
      setActivityDaysSet(new Set(days));
      // Build this-week array (Mon-Sun)
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=Sun
      const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - mondayOffset);
      monday.setHours(0, 0, 0, 0);
      const weekDays: boolean[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const ds = d.toISOString().split('T')[0];
        weekDays.push(days.includes(ds));
      }
      setStreakDays(weekDays);
      // Calculate consecutive streak ending today
      const sorted = [...days].sort().reverse();
      let streak = 0;
      let check = new Date();
      check.setHours(0, 0, 0, 0);
      for (const d of sorted) {
        const ds = check.toISOString().split('T')[0];
        if (d === ds) {
          streak++;
          check.setDate(check.getDate() - 1);
        } else if (d < ds) {
          break;
        }
      }
      setCurrentStreak(streak);
    } catch {}
  }, []);
  useEffect(() => {
    loadStats();
    const onFocus = () => loadStats();
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') loadStats(); });
    return () => { window.removeEventListener('focus', onFocus); };
  }, [loadStats]);

  // Upgrade toast
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const upgrade = params.get("upgrade");
    if (upgrade === "coach") setUpgradeToast("AI Coach is a Pro feature. Upgrade to unlock it.");
    if (upgrade) {
      window.history.replaceState({}, "", "/dashboard");
      setTimeout(() => setUpgradeToast(""), 5000);
    }
  }, []);

  const displayFirst = userName.first || "there";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="app">
      <Sidebar activePage="dashboard" />

      <main className="dash-main">
        {/* ── Top bar ── */}
        <div className="dash-topbar">
          <div>
            <div className="dash-greeting-sub">Welcome back to OfferBell.</div>
            <div className="dash-greeting">{greeting}, <em>{displayFirst}</em></div>
          </div>
          <Link className="dash-profile-btn" href="/my-account">View profile</Link>
        </div>

        {/* ── Today Card ── */}
        <div className="dash-today-card">
          <div className="dash-today-label">Today on OfferBell</div>
          <h1 className="dash-today-title">Do just one thing to move recruiting forward.</h1>
          <p className="dash-today-desc">
            Pick one path, complete it, then come back tomorrow. You can always access everything else from the sidebar.
          </p>
          <div className="dash-action-grid">
            <Link className="dash-action-card" href="/learn">
              <div className="dash-action-title">Learn a path</div>
              <div className="dash-action-desc">Spend 10 minutes in the Learning Hub.</div>
              <div className="dash-action-link">Open Learning Hub →</div>
            </Link>
            <Link className="dash-action-card" href="/outreach-tracker">
              <div className="dash-action-title">Reach out to 1 person</div>
              <div className="dash-action-desc">Choose a contact and send one email.</div>
              <div className="dash-action-link">Go to Outreach / Pipeline →</div>
            </Link>
            <Link className="dash-action-card" href="/flashcards">
              <div className="dash-action-title">Drill interview questions</div>
              <div className="dash-action-desc">Practice with 1,300+ technical flashcards across all tracks.</div>
              <div className="dash-action-link">Open Interview Flashcards →</div>
            </Link>
          </div>
        </div>

        {/* ── Activity Streak ── */}
        {(() => {
          const dow = new Date().getDay();
          const todayIdx = dow === 0 ? 6 : dow - 1;
          const today = new Date().toISOString().split('T')[0];

          // Build 90-day history for the expanded view
          const allDays: { date: string; active: boolean; isToday: boolean; isFuture: boolean; day: number; month: number; year: number }[] = [];
          const histStart = new Date();
          histStart.setHours(0,0,0,0);
          histStart.setDate(histStart.getDate() - 89);
          for (let i = 0; i < 90; i++) {
            const d = new Date(histStart);
            d.setDate(histStart.getDate() + i);
            const ds = d.toISOString().split('T')[0];
            allDays.push({ date: ds, active: activityDaysSet.has(ds), isToday: ds === today, isFuture: ds > today, day: d.getDate(), month: d.getMonth(), year: d.getFullYear() });
          }

          // Group by month for expanded calendar
          const months: { label: string; year: number; month: number; days: typeof allDays }[] = [];
          for (const d of allDays) {
            const key = `${d.year}-${d.month}`;
            let m = months.find(m => `${m.year}-${m.month}` === key);
            if (!m) { m = { label: new Date(d.year, d.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), year: d.year, month: d.month, days: [] }; months.push(m); }
            m.days.push(d);
          }

          const activeDaysCount = allDays.filter(d => d.active && !d.isFuture).length;
          // Consistency: days since account creation
          const accountStart = accountCreatedAt || today;
          const daysSinceCreation = Math.max(1, Math.floor((new Date(today).getTime() - new Date(accountStart).getTime()) / 864e5) + 1);
          const consistencyPct = Math.round((activeDaysCount / daysSinceCreation) * 100);

          return (
            <>
            <div className="streak-card">
              <div className="streak-header">
                <div className="streak-left">
                  <div className="streak-section-label">Activity</div>
                  <div className="streak-headline">
                    <span className="streak-count">{currentStreak}</span>
                    <span className="streak-unit">day streak</span>
                  </div>
                </div>
                <button onClick={() => setCalendarExpanded(true)} type="button" className="streak-toggle">
                  Expand
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </button>
              </div>

              {/* This week */}
              <div className="streak-week">
                {['M','T','W','T','F','S','S'].map((label, i) => (
                  <div key={i} className="streak-day">
                    <div className={`streak-day-label${i === todayIdx ? ' today' : ''}`}>{label}</div>
                    <div className={`streak-dot${streakDays[i] ? ' active' : i > todayIdx ? ' future' : ' missed'}${i === todayIdx ? ' is-today' : ''}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ FULLSCREEN CALENDAR ═══ */}
            {calendarExpanded && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' }} onClick={() => setCalendarExpanded(false)}>
                <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8, zIndex: 310 }}>
                  <button onClick={(e) => { e.stopPropagation(); setCalendarExpanded(false); }} style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} type="button">
                    <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div onClick={e => e.stopPropagation()} style={{ flex: 1, margin: 20, borderRadius: 20, background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <svg width="18" height="18" fill="none" stroke="var(--text)" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <div>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: 'var(--text)', letterSpacing: '-0.4px' }}>Activity <em style={{ fontStyle: 'italic' }}>Calendar</em></div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Last 90 days of activity</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.5px' }}>{currentStreak}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 3 }}>Streak</div>
                      </div>
                      <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#16a34a', lineHeight: 1, letterSpacing: '-0.5px' }}>{activeDaysCount}</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 3 }}>Active Days</div>
                      </div>
                      <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.5px' }}>{consistencyPct}%</div>
                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 3 }}>Consistency</div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar months */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 32 }} ref={(el) => {
                    // Auto-scroll to current month on mount
                    if (el) {
                      setTimeout(() => {
                        const currentMonthEl = el.querySelector('[data-current-month]');
                        if (currentMonthEl) currentMonthEl.scrollIntoView({ behavior: 'instant', block: 'start' });
                      }, 50);
                    }
                  }}>
                    {months.map(m => {
                      const isCurrentMonth = m.month === new Date().getMonth() && m.year === new Date().getFullYear();
                      // Build a proper month grid: figure out what day of week the 1st falls on
                      const firstOfMonth = new Date(m.year, m.month, 1);
                      const lastOfMonth = new Date(m.year, m.month + 1, 0);
                      const startDow = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1; // Mon=0
                      const daysInMonth = lastOfMonth.getDate();

                      // Build cells: empty padding + actual days
                      const cells: (typeof allDays[0] | null)[] = [];
                      for (let i = 0; i < startDow; i++) cells.push(null);
                      for (let day = 1; day <= daysInMonth; day++) {
                        const dateStr = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const found = allDays.find(d => d.date === dateStr);
                        cells.push(found || { date: dateStr, active: false, isToday: dateStr === today, isFuture: dateStr > today, day, month: m.month, year: m.year });
                      }

                      return (
                        <div key={m.label} {...(isCurrentMonth ? { 'data-current-month': 'true' } : {})}>
                          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: 'var(--text)', marginBottom: 14, letterSpacing: '-0.3px' }}>{m.label}</div>
                          {/* Day labels */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                              <div key={d} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase', padding: '4px 0' }}>{d}</div>
                            ))}
                          </div>
                          {/* Day cells */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                            {cells.map((c, i) => {
                              if (!c) return <div key={`empty-${i}`} />;
                              const isActive = c.active;
                              const isFut = c.isFuture;
                              const isT = c.isToday;
                              return (
                                <div key={c.date} style={{
                                  aspectRatio: '1', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: isT ? 800 : 500, fontFamily: "'Sora', sans-serif",
                                  background: isActive ? '#16a34a' : 'transparent',
                                  color: isActive ? '#fff' : isFut ? 'var(--border-2)' : isT ? 'var(--text)' : 'var(--text-3)',
                                  border: isT && !isActive ? '2px solid var(--text)' : '2px solid transparent',
                                  transition: 'background 0.15s',
                                }}>
                                  {c.day}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer legend */}
                  <div style={{ padding: '14px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 20, fontSize: 11, color: 'var(--text-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, background: '#16a34a' }} /><span>Active</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, border: '2px solid var(--text)', background: 'transparent' }} /><span>Today</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 4, background: 'transparent', border: '1px solid var(--border)' }} /><span>Inactive</span></div>
                    <div style={{ marginLeft: 'auto', fontWeight: 600 }}>Click outside or &times; to close</div>
                  </div>
                </div>
              </div>
            )}
            </>
          );
        })()}

        {/* ── Tip of the Week ── */}
        <div className="dash-tip-card">
          <div className="dash-tip-label">One Simple Tip</div>
          <div className="dash-tip-text">&quot;{TIPS[tipIdx].text}&quot;</div>
          <div className="dash-tip-source">You&apos;ll see a new tip each week.</div>
        </div>
      </main>

      {upgradeToast && (
        <div className="dash-upgrade-toast">
          {upgradeToast}
          <a href="/checkout">Upgrade</a>
        </div>
      )}

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
