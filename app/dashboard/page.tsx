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
          const dow = new Date().getDay();
          const todayIdx = dow === 0 ? 6 : dow - 1;
          const today = new Date().toISOString().split('T')[0];

          // Build 5-week heatmap
          const heatmapDays: { date: string; active: boolean; isToday: boolean; isFuture: boolean }[] = [];
          const startOffset = todayIdx + 28;
          const startDate = new Date();
          startDate.setHours(0,0,0,0);
          startDate.setDate(startDate.getDate() - startOffset);
          for (let i = 0; i < 35; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const ds = d.toISOString().split('T')[0];
            heatmapDays.push({ date: ds, active: activityDaysSet.has(ds), isToday: ds === today, isFuture: ds > today });
          }

          return (
            <div className="streak-card">
              <div className="streak-header">
                <div className="streak-left">
                  <div className="streak-section-label">Activity</div>
                  <div className="streak-headline">
                    <span className="streak-count">{currentStreak}</span>
                    <span className="streak-unit">day streak</span>
                  </div>
                </div>
                <button onClick={() => setCalendarExpanded(!calendarExpanded)} type="button" className={`streak-toggle${calendarExpanded ? ' open' : ''}`}>
                  {calendarExpanded ? 'Less' : 'More'}
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
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

              {/* Heatmap */}
              {calendarExpanded && (
                <div className="streak-heatmap">
                  <div className="streak-heatmap-grid">
                    {heatmapDays.map(d => (
                      <div key={d.date} className={`streak-hm-cell${d.active ? ' active' : d.isFuture ? ' future' : ''}${d.isToday ? ' today' : ''}`} />
                    ))}
                  </div>
                  <div className="streak-heatmap-footer">5 weeks ago &rarr; today</div>
                </div>
              )}
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
