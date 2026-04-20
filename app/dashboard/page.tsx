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
  const [calendarMonth, setCalendarMonth] = useState(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
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
          const d = new Date().getDay();
          const todayIdx = d === 0 ? 6 : d - 1;
          const flameClass = currentStreak >= 7 ? 'hot' : currentStreak >= 3 ? 'warm' : 'cold';

          // Longest streak computation
          const longestStreak = (() => {
            const sorted = [...activityDaysSet].sort();
            let longest = 0, run = 0, prev = '';
            for (const day of sorted) {
              if (prev) {
                const prevDate = new Date(prev);
                prevDate.setDate(prevDate.getDate() + 1);
                if (prevDate.toISOString().split('T')[0] === day) run++;
                else run = 1;
              } else run = 1;
              if (run > longest) longest = run;
              prev = day;
            }
            return longest;
          })();

          return (
            <div className="streak-card">
              {/* Header */}
              <div className="streak-header">
                <div className="streak-meta">
                  <div className={`streak-flame ${flameClass}`}>
                    {currentStreak >= 3
                      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    }
                  </div>
                  <div>
                    <div className="streak-count">
                      {currentStreak}<span>day{currentStreak !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="streak-subtitle">
                      {currentStreak >= 14 ? 'Unstoppable. Two weeks straight.'
                        : currentStreak >= 7 ? 'Full week. Keep this energy.'
                        : currentStreak >= 3 ? 'Momentum is building.'
                        : currentStreak >= 1 ? 'You showed up today. That counts.'
                        : 'Start your streak today.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCalendarExpanded(!calendarExpanded)}
                  type="button"
                  className={`streak-toggle${calendarExpanded ? ' open' : ''}`}
                >
                  {calendarExpanded ? 'Week' : 'Calendar'}
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>

              {/* Week view */}
              {!calendarExpanded && (
                <div className="streak-week">
                  {['M','T','W','T','F','S','S'].map((label, i) => {
                    const isToday = i === todayIdx;
                    const isFuture = i > todayIdx;
                    const isActive = streakDays[i];
                    const cellClass = `streak-day-cell${isActive ? ' active' : isFuture ? ' future' : ' missed'}${isToday ? ' is-today' : ''}`;
                    return (
                      <div key={i} className="streak-day">
                        <div className={`streak-day-label${isToday ? ' today' : ''}`}>{label}</div>
                        <div className={cellClass}>
                          {isActive && <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Calendar view */}
              {calendarExpanded && (() => {
                const year = calendarMonth.getFullYear();
                const month = calendarMonth.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
                const today = new Date().toISOString().split('T')[0];
                const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                const now = new Date();
                const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

                const activeDaysThisMonth = Array.from({ length: daysInMonth }, (_, i) => {
                  const ds = new Date(year, month, i + 1).toISOString().split('T')[0];
                  return activityDaysSet.has(ds) ? 1 : 0;
                }).reduce((a: number, b: number) => a + b, 0);

                return (
                  <div className="streak-calendar">
                    {/* Month nav */}
                    <div className="cal-nav">
                      <button className="cal-nav-btn" type="button" onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <div>
                        <span className="cal-month-label">{monthLabel}</span>
                        <span className="cal-month-count">{activeDaysThisMonth} active</span>
                      </div>
                      <button className="cal-nav-btn" type="button" disabled={isCurrentMonth} onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>

                    {/* Grid */}
                    <div className="cal-grid">
                      {['M','T','W','T','F','S','S'].map(h => (
                        <div key={h} className="cal-header-cell">{h}</div>
                      ))}
                      {Array.from({ length: startDow }, (_, i) => (
                        <div key={'e' + i} className="cal-cell empty" />
                      ))}
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        const dayNum = i + 1;
                        const ds = new Date(year, month, dayNum).toISOString().split('T')[0];
                        const isActive = activityDaysSet.has(ds);
                        const isToday = ds === today;
                        const isFuture = ds > today;
                        const cls = `cal-cell${isActive ? ' active' : isFuture ? ' future-cell' : ' inactive'}${isToday ? ' today-cell' : ''}`;
                        return <div key={dayNum} className={cls}>{dayNum}</div>;
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Stats footer */}
              <div className="streak-stats">
                <div className="streak-stat">
                  <div className="streak-stat-num">{activityDaysSet.size}</div>
                  <div className="streak-stat-label">Total days</div>
                </div>
                <div className="streak-stat">
                  <div className={`streak-stat-num${currentStreak >= 3 ? ' green' : ''}`}>{currentStreak}</div>
                  <div className="streak-stat-label">Current</div>
                </div>
                <div className="streak-stat">
                  <div className="streak-stat-num">{longestStreak}</div>
                  <div className="streak-stat-label">Best</div>
                </div>
              </div>
            </div>
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
