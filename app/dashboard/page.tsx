"use client";

import Sidebar from "../components/Sidebar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./dashboard.css";

const TIPS = [
  {
    text: "The alumni angle works best when you reference something specific — the same club, program, or professor. Saying you went to the same school isn't enough.",
    source: "OfferBell reply rate data",
  },
  {
    text: "Send cold emails Monday through Thursday between 9am and 5pm. Never send on weekends — it looks desperate. If they reply on a weekend, you can respond then.",
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
    text: "Reference a specific deal they worked on. It takes 3 minutes on Google and signals you did your homework — which most students don't.",
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
    text: "Before a coffee chat, prepare 3 thoughtful questions about their specific group or deals — not generic questions you could Google. That's what gets you remembered.",
    source: "OfferBell networking data",
  },
  {
    text: "Send a thank-you email within 2 hours of every call. Keep it short — reference one specific thing they said. This is how you stay top of mind.",
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
  const [messagesSent, setMessagesSent] = useState(0);
  const [pipelineCount, setPipelineCount] = useState(0);
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [flashcardsDrilled, setFlashcardsDrilled] = useState(0);
  const [upgradeToast, setUpgradeToast] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tipIdx] = useState(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.floor(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay()) / 7);
    return weekNum % TIPS.length;
  });

  // Auth guard — no onboarding redirect, tutorial handles profile setup
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

  // Tutorial trigger — show on first post-verification login
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

  // Load stats
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem("offerbell_messages_sent") || "0", 10)); } catch {}
    try {
      const t = localStorage.getItem("offerbell_tracker_v3");
      if (t) setPipelineCount(JSON.parse(t).length);
    } catch {}
    try { setSearchesUsed(parseInt(localStorage.getItem("offerbell_searches_used") || "0", 10)); } catch {}
    try {
      const perf = localStorage.getItem("offerbell_flash_perf");
      if (perf) { const p = JSON.parse(perf); setFlashcardsDrilled(p.seen || 0); }
    } catch {}
  }, []);

  // Upgrade toast
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const upgrade = params.get("upgrade");
    if (upgrade === "coach") setUpgradeToast("AI Coach is a Pro feature. Upgrade to unlock it.");
    else if (upgrade === "hitrate") setUpgradeToast("Hit Rate Intel is a Pro feature. Upgrade to unlock it.");
    if (upgrade) {
      window.history.replaceState({}, "", "/dashboard");
      setTimeout(() => setUpgradeToast(""), 5000);
    }
  }, []);

  const displayFirst = userName.first || "there";
  const greeting = (() => {
    const h = new Date().getHours();
    return "Good day";
  })();

  return (
    <div className="app">
      <Sidebar activePage="dashboard" />

      <main className="dash-main">
        {/* ── Top bar ── */}
        <div className="dash-topbar">
          <div>
            <div className="dash-greeting-sub">Recruiting season is in full swing.</div>
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
              <div className="dash-action-desc">Practice with 1,500+ technical flashcards across all tracks.</div>
              <div className="dash-action-link">Open Interview Flashcards →</div>
            </Link>
          </div>
        </div>

        {/* ── Lightweight Progress ── */}
        <div className="dash-progress-card">
          <div className="dash-progress-header">
            <h2 className="dash-progress-title">Lightweight progress</h2>
            <span className="dash-progress-hint">Just enough to know you&apos;re moving.</span>
          </div>
          <div className="dash-progress-stats">
            <div>
              <div className="dash-stat-label">Contacts tracked</div>
              <div className="dash-stat-value">{pipelineCount}</div>
            </div>
            <div>
              <div className="dash-stat-label">Messages sent</div>
              <div className="dash-stat-value">{messagesSent}</div>
            </div>
            <div>
              <div className="dash-stat-label">Contact searches</div>
              <div className="dash-stat-value">{searchesUsed}</div>
            </div>
            <div>
              <div className="dash-stat-label">Flashcards drilled</div>
              <div className="dash-stat-value">{flashcardsDrilled}</div>
            </div>
          </div>
        </div>

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
