"use client";

import Topbar from "../components/Topbar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useEffect, useLayoutEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import "./dashboard.css";

// ─── Helpers ───────────────────────────────────────────────────────────────

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Track label lookup - matches the 10 flash_perf_* tables.
const TRACK_LABELS: Record<string, string> = {
  ib: 'Investment Banking',
  pe: 'Private Equity',
  rx: 'Restructuring',
  consulting: 'Consulting',
  accounting: 'Accounting',
  am: 'Asset Management',
  st: 'Sales & Trading',
  er: 'Equity Research',
  re: 'Real Estate',
  vc: 'Venture Capital',
};

// ─── Dashboard widget configuration ────────────────────────────────────────
// Stored in `offerbell_dashboard_config` localStorage (small ~200 bytes
// payload, syncs via the normal blob path without bandwidth impact).
type DashboardWidgetKey =
  | 'weeklySummary'
  | 'weeklyActivity'
  | 'skillHeatmap'
  | 'calendar'
  | 'focus'
  | 'outreach';

type DashboardConfig = { widgets: Record<DashboardWidgetKey, boolean> };

const WIDGET_DEFS: { key: DashboardWidgetKey; label: string; desc: string; col: 'left' | 'right' }[] = [
  { key: 'weeklySummary',  label: 'Weekly Summary', desc: 'Drills, mock interviews, coach chats, avg score', col: 'left' },
  { key: 'weeklyActivity', label: 'Weekly Activity', desc: 'Hours per day bar chart, Monday through Sunday', col: 'left' },
  { key: 'skillHeatmap',   label: 'Skill Heatmap', desc: 'Per-topic accuracy across your active track', col: 'left' },
  { key: 'calendar',       label: 'Calendar & Streak', desc: 'Monthly activity grid with current streak', col: 'right' },
  { key: 'focus',          label: 'What to Focus On', desc: 'Personalized recommendations based on your data', col: 'right' },
  { key: 'outreach',       label: 'Outreach Pipeline', desc: 'Contact pipeline summary by status', col: 'right' },
];

// Divy spec: simple default: Weekly Summary, Skill Heatmap, Calendar, Focus.
// Weekly Activity and Outreach are opt-in via Customize.
const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  widgets: {
    weeklySummary: true,
    weeklyActivity: false,
    skillHeatmap: true,
    calendar: true,
    focus: true,
    outreach: false,
  },
};

const DASHBOARD_CONFIG_KEY = 'offerbell_dashboard_config';

function loadDashboardConfig(): DashboardConfig {
  try {
    const raw = localStorage.getItem(DASHBOARD_CONFIG_KEY);
    if (!raw) return DEFAULT_DASHBOARD_CONFIG;
    const parsed = JSON.parse(raw);
    // Defensive merge: ensure every widget key exists (in case new ones were added)
    const widgets = { ...DEFAULT_DASHBOARD_CONFIG.widgets };
    if (parsed?.widgets && typeof parsed.widgets === 'object') {
      for (const k of Object.keys(widgets) as DashboardWidgetKey[]) {
        if (typeof parsed.widgets[k] === 'boolean') widgets[k] = parsed.widgets[k];
      }
    }
    return { widgets };
  } catch { return DEFAULT_DASHBOARD_CONFIG; }
}
function saveDashboardConfig(cfg: DashboardConfig) {
  try { localStorage.setItem(DASHBOARD_CONFIG_KEY, JSON.stringify(cfg)); } catch {}
}
const TRACK_ORDER = ['ib', 'pe', 'rx', 'consulting', 'accounting', 'am', 'st', 'er', 're', 'vc'];

// Map onboarding verticals (17 of them) to flash_perf track keys (10 of them).
// Tracks NOT in flash_perf yet (Hedge Fund, Growth Equity, FP&A, Corporate Dev,
// Credit, Family Office, Endowment) return empty string -> dashboard shows
// "coming soon" empty state for the heatmap.
const VERTICAL_TO_TRACK: Record<string, string> = {
  'Investment Banking': 'ib',
  'Private Equity': 'pe',
  'Venture Capital': 'vc',
  'Sales & Trading': 'st',
  'Equity Research': 'er',
  'Asset Management': 'am',
  'Consulting': 'consulting',
  'Accounting & Audit': 'accounting',
  'Accounting / Audit / Tax': 'accounting',
  'Real Estate': 're',
  'Restructuring': 'rx',
};

// Read outreach tracker statuses from user's config (or defaults from
// app/outreach-tracker/page.tsx line 36). Match exactly so dashboard mirrors
// what the user sees in the tracker, including renamed statuses.
const DEFAULT_OUTREACH_STATUSES = [
  { key: 'drafted', label: 'Drafted' },
  { key: 'sent', label: 'Sent' },
  { key: 'fu1', label: 'Followed Up 1x' },
  { key: 'fu2', label: 'Followed Up 2x' },
  { key: 'fu3', label: 'Followed Up 3x' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'spoken', label: 'Spoken With' },
  { key: 'stay', label: 'Staying in Touch' },
  { key: 'noresp', label: 'No Response' },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  // Auth guard - same logic as before. Redirect to signin if no user id.
  // Also seeds minimal profile from signup data if onboarding profile missing.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("offerbell_user_id");
    if (!stored) { router.replace("/signin"); return; }
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

  // Tutorial overlay (preserve existing logic)
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [dashConfig, setDashConfig] = useState<DashboardConfig>(DEFAULT_DASHBOARD_CONFIG);
  const [showCustomize, setShowCustomize] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem('offerbell_tutorial_replay')) {
      const step = parseInt(localStorage.getItem('offerbell_tutorial_step') || '1', 10);
      setTutorialStep(step);
      setShowTutorial(true);
      return;
    }
    const complete = localStorage.getItem('offerbell_tutorial_complete');
    let profileComplete = false;
    try {
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      if (prof.tutorialComplete) profileComplete = true;
    } catch {}
    if (complete || profileComplete) {
      localStorage.setItem('offerbell_tutorial_complete', 'true');
      return;
    }
    const step = parseInt(localStorage.getItem('offerbell_tutorial_step') || '0', 10);
    setTutorialStep(step);
    setShowTutorial(true);
  }, []);

  // Theme application (existing pattern - mirrors data-theme attribute from localStorage)
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("offerbell-theme") : null;
    if (saved && typeof document !== "undefined") document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Load dashboard widget config + listen for storage changes from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDashConfig(loadDashboardConfig());
    const onStorage = (e: StorageEvent) => {
      if (e.key === DASHBOARD_CONFIG_KEY) setDashConfig(loadDashboardConfig());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function toggleWidget(key: DashboardWidgetKey) {
    const next: DashboardConfig = { widgets: { ...dashConfig.widgets, [key]: !dashConfig.widgets[key] } };
    setDashConfig(next);
    saveDashboardConfig(next);
  }
  function resetDashConfig() {
    setDashConfig(DEFAULT_DASHBOARD_CONFIG);
    saveDashboardConfig(DEFAULT_DASHBOARD_CONFIG);
  }

  // Upgrade toast from query param
  const [upgradeToast, setUpgradeToast] = useState("");
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

  // ─── User identity + selected vertical (from localStorage)
  const [profile, setProfile] = useState<{ first: string; vertical: string }>({ first: "", vertical: "" });
  const loadProfile = useCallback(() => {
    try {
      const raw = localStorage.getItem("offerbell_onboarding_profile");
      if (raw) {
        const p = JSON.parse(raw);
        setProfile({
          first: p.firstName || "",
          vertical: (Array.isArray(p.targetRoles) && p.targetRoles[0]) || "",
        });
      }
    } catch {}
  }, []);
  useEffect(() => {
    loadProfile();
    // Listen for in-window profile changes (e.g. user switched industry via sidebar).
    // Storage events only fire cross-tab so we use a custom event for same-window.
    const onChanged = () => loadProfile();
    window.addEventListener('offerbell-profile-changed', onChanged);
    window.addEventListener('offerbell-progress-hydrated', onChanged);
    return () => {
      window.removeEventListener('offerbell-profile-changed', onChanged);
      window.removeEventListener('offerbell-progress-hydrated', onChanged);
    };
  }, [loadProfile]);

  // Selected flash_perf track key for the user's primary vertical.
  // Empty string for verticals that don't have a flashcard track yet.
  const selectedTrackKey = VERTICAL_TO_TRACK[profile.vertical] || '';

  // ─── User ID for Convex queries
  const [userId, setUserId] = useState<string>("");
  useEffect(() => {
    try { setUserId(localStorage.getItem('offerbell_user_id') || ""); } catch {}
  }, []);

  // ─── Activity / streak / calendar (from offerbell_activity_days localStorage)
  const [activityDaysSet, setActivityDaysSet] = useState<Set<string>>(new Set());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [accountCreatedAt, setAccountCreatedAt] = useState<string | null>(null);
  const loadActivity = useCallback(() => {
    try {
      const todayDate = new Date();
      const today = localDateStr(todayDate);

      let created = localStorage.getItem('offerbell_account_created');
      if (!created) {
        created = today;
        localStorage.setItem('offerbell_account_created', created);
      }
      setAccountCreatedAt(created);

      const raw = localStorage.getItem('offerbell_activity_days');
      let days: string[] = raw ? JSON.parse(raw) : [];
      if (!days.includes(today)) {
        days.push(today);
        const cutoffDate = new Date(); cutoffDate.setDate(cutoffDate.getDate() - 90);
        const cutoff = localDateStr(cutoffDate);
        days = days.filter(d => d >= cutoff);
        localStorage.setItem('offerbell_activity_days', JSON.stringify(days));
      }
      setActivityDaysSet(new Set(days));

      // Consecutive streak ending today
      const dayset = new Set(days);
      let streak = 0;
      const check = new Date(todayDate); check.setHours(0,0,0,0);
      while (dayset.has(localDateStr(check))) {
        streak++;
        check.setDate(check.getDate() - 1);
      }
      setCurrentStreak(streak);
    } catch {}
  }, []);
  useEffect(() => {
    loadActivity();
    const onFocus = () => loadActivity();
    const onVisible = () => { if (document.visibilityState === 'visible') loadActivity(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loadActivity]);

  // ─── Mock interview + coach stats: ONE-SHOT HTTP fetch (not reactive useQuery).
  // Reactive subscriptions burn bandwidth on every mutation to those tables.
  // These stats are aggregate counts that don't need live updates - mount fetch
  // is enough. A page refresh picks up the latest.
  const [mockStats, setMockStats] = useState<any>(undefined);
  const [coachStats, setCoachStats] = useState<any>(undefined);
  useEffect(() => {
    if (!userId) return;
    if (typeof window === 'undefined') return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;
    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const [m, c, u] = await Promise.all([
          client.query((api as any).mockResponses.getMockStats, { userId, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }),
          client.query((api as any).coachConvos.getCoachStats, { userId, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }),
          client.query((api as any).users.getUser, { userId, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) }).catch(() => null),
        ]);
        if (!cancelled) {
          setMockStats(m);
          setCoachStats(c);
          try { localStorage.setItem('offerbell_dash_mock_stats', JSON.stringify(m)); } catch {}
          try { localStorage.setItem('offerbell_dash_coach_stats', JSON.stringify(c)); } catch {}
          // Refresh the displayed name from the server (source of truth). The
          // local onboarding_profile can be stale after a name change on another
          // device or session, so reconcile it here and notify listeners
          // (topbar, sidebar) via the shared profile-changed event.
          if (u && u.firstName) {
            try {
              const raw = localStorage.getItem('offerbell_onboarding_profile');
              const existing = raw ? JSON.parse(raw) : {};
              if (existing.firstName !== u.firstName || existing.lastName !== (u.lastName || existing.lastName)) {
                const merged = { ...existing, firstName: u.firstName, lastName: u.lastName || existing.lastName || '' };
                localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(merged));
                window.dispatchEvent(new Event('offerbell-profile-changed'));
              }
            } catch {}
            setProfile(prev => ({ ...prev, first: u.firstName }));
          }
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // ─── Mock per-topic stats for the selected track (one-shot HTTP fetch).
  // Powers the Skill Heatmap alongside flashcard data. Lightweight aggregate.
  const [mockTopicStats, setMockTopicStats] = useState<Array<{ category: string; count: number; scoreSum: number }>>([]);
  useEffect(() => {
    if (!userId || !selectedTrackKey) { setMockTopicStats([]); return; }
    if (typeof window === 'undefined') return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;
    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const t = await client.query((api as any).mockResponses.getMockTopicStats, { userId, trackId: selectedTrackKey, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) });
        if (!cancelled) setMockTopicStats(Array.isArray(t) ? t : []);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [userId, selectedTrackKey]);

  // ─── Flashcard performance per track (from localStorage, no Convex hit)
  // Each offerbell_flash_perf_{track} stores { seen, pass, partial, fail, byCat }
  // where byCat is Record<categoryName, { seen, pass }>
  // Concept-drill performance sourced from the drill history log (drill-only).
  // The dashboard does NOT read flash_perf, so flashcard activity never affects
  // Total Drills, Avg Score, or the Skill Heatmap.
  const [drillByTrackCat, setDrillByTrackCat] = useState<Record<string, Record<string, { seen: number; correct: number }>>>({});
  const [drillAgg, setDrillAgg] = useState<{ items: number; scoreSum: number }>({ items: 0, scoreSum: 0 });
  // Diagnostic Review contributes to Avg Score only (NOT drills/heatmap). Read
  // from its own history store so it never touches flash_perf again.
  const [diagAgg, setDiagAgg] = useState<{ items: number; scoreSum: number }>({ items: 0, scoreSum: 0 });
  // Diagnostic per-track, per-category scores so the Skill Heatmap can blend
  // diagnostic accuracy in alongside drills/flashcards and mock interviews.
  const [diagByTrackCat, setDiagByTrackCat] = useState<Record<string, Record<string, { total: number; correct: number }>>>({});
  const loadLocalProgress = useCallback(() => {
    // Concept-drill performance from the per-question drill history log
    // (offerbell_drill_history) - drill answers only, never flashcards. Powers
    // Total Drills, the drill portion of Avg Score, and the Skill Heatmap.
    try {
      const raw = localStorage.getItem('offerbell_drill_history');
      const hist = raw ? JSON.parse(raw) : [];
      if (Array.isArray(hist)) {
        let items = 0; let scoreSum = 0;
        const byTrackCat: Record<string, Record<string, { seen: number; correct: number }>> = {};
        for (const h of hist) {
          const tk = h?.trackKey; const cat = h?.topic; const ok = !!h?.correct;
          items += 1;
          if (ok) scoreSum += 100;
          if (tk && cat) {
            const tgt = byTrackCat[tk] || (byTrackCat[tk] = {});
            const acc = tgt[cat] || (tgt[cat] = { seen: 0, correct: 0 });
            acc.seen += 1; if (ok) acc.correct += 1;
          }
        }
        setDrillAgg({ items, scoreSum });
        setDrillByTrackCat(byTrackCat);
      } else {
        setDrillAgg({ items: 0, scoreSum: 0 });
        setDrillByTrackCat({});
      }
    } catch {
      setDrillAgg({ items: 0, scoreSum: 0 });
      setDrillByTrackCat({});
    }

    // Diagnostic Review history -> avg-score contribution.
    try {
      const raw = localStorage.getItem('offerbell_diag_history');
      const hist = raw ? JSON.parse(raw) : [];
      if (Array.isArray(hist)) {
        let items = 0; let scoreSum = 0;
        const byTrackCat: Record<string, Record<string, { total: number; correct: number }>> = {};
        for (const r of hist) {
          const answered = Number(r?.totalAnswered) || 0;
          const correct = Number(r?.totalCorrect) || 0;
          items += answered;
          scoreSum += correct * 100; // each correct answer = 100%
          // Per-track, per-category breakdown for the Skill Heatmap.
          const tk = r?.track;
          const cs = r?.catScores;
          if (tk && cs && typeof cs === 'object') {
            const tgt = byTrackCat[tk] || (byTrackCat[tk] = {});
            for (const [cat, v] of Object.entries(cs)) {
              const tot = Number((v as any)?.total) || 0;
              const cor = Number((v as any)?.correct) || 0;
              const acc = tgt[cat] || (tgt[cat] = { total: 0, correct: 0 });
              acc.total += tot; acc.correct += cor;
            }
          }
        }
        setDiagAgg({ items, scoreSum });
        setDiagByTrackCat(byTrackCat);
      } else {
        setDiagAgg({ items: 0, scoreSum: 0 });
        setDiagByTrackCat({});
      }
    } catch {
      setDiagAgg({ items: 0, scoreSum: 0 });
      setDiagByTrackCat({});
    }
  }, []);
  useEffect(() => {
    loadLocalProgress();
    const onVisible = () => { if (document.visibilityState === 'visible') loadLocalProgress(); };
    document.addEventListener('visibilitychange', onVisible);
    // After login, the sync hook hydrates flash_perf/diagnostic into
    // localStorage asynchronously; re-read once that lands so stats aren't 0.
    const onHydrated = () => loadLocalProgress();
    window.addEventListener('offerbell-progress-hydrated', onHydrated);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('offerbell-progress-hydrated', onHydrated);
    };
  }, [loadLocalProgress]);

  // Warm-start every Weekly Summary number from cache BEFORE the browser paints,
  // so navigating to the dashboard never flashes 0 then the real value. Pure
  // localStorage reads (device-local display cache); not in the sync blob.
  useLayoutEffect(() => {
    loadLocalProgress();
    try {
      const m = localStorage.getItem('offerbell_dash_mock_stats');
      if (m) setMockStats(JSON.parse(m));
      const c = localStorage.getItem('offerbell_dash_coach_stats');
      if (c) setCoachStats(JSON.parse(c));
    } catch {}
  }, [loadLocalProgress]);

  // ─── Outreach tracker data (from localStorage)
  const [outreachContacts, setOutreachContacts] = useState<Array<{ status: string }>>([]);
  const [outreachStatuses, setOutreachStatuses] = useState(DEFAULT_OUTREACH_STATUSES);
  useLayoutEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_tracker_v3');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setOutreachContacts(parsed);
      }
    } catch {}
    // Pull user's customized status labels from config if present
    try {
      const cfg = localStorage.getItem('offerbell_tracker_config');
      if (cfg) {
        const parsed = JSON.parse(cfg);
        if (Array.isArray(parsed.statuses)) {
          // Use user labels but preserve our ordering and any missing default statuses
          const userMap = new Map(parsed.statuses.map((s: any) => [s.key, s.label]));
          const merged = DEFAULT_OUTREACH_STATUSES.map(s => ({
            key: s.key,
            label: (userMap.get(s.key) as string) || s.label,
          }));
          setOutreachStatuses(merged);
        }
      }
    } catch {}
  }, []);

  // ─── Live-table features (drill history + outreach tracker) now live ONLY in
  // their Convex tables. Fetch them once on mount for the read-only dashboard
  // aggregations and cache into localStorage. These keys are excluded from the
  // blob and the sync hook no longer pushes them, so this write is a local
  // display cache that never travels back to the server.
  useEffect(() => {
    const uid = typeof window !== 'undefined' ? localStorage.getItem('offerbell_user_id') : null;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!uid || !url) return;
    const tok = localStorage.getItem('offerbell_session') || undefined;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const [drill, tracker] = await Promise.all([
          client.query(api.drillHistory.getDrillHistory, { userId: uid, sessionToken: tok }).catch(() => null),
          client.query(api.outreachTracker.getTracker, { userId: uid, sessionToken: tok }).catch(() => null),
        ]);
        const drillData = drill && (drill as any).data ? (drill as any).data : null;
        const trackerData = tracker && (tracker as any).data ? (tracker as any).data : null;
        if (drillData) { try { localStorage.setItem('offerbell_drill_history', drillData); } catch {} }
        if (trackerData) {
          try { localStorage.setItem('offerbell_tracker_v3', trackerData); } catch {}
          try { const p = JSON.parse(trackerData); if (Array.isArray(p)) setOutreachContacts(p); } catch {}
        }
        // Re-run the drill/diagnostic aggregation now that drill history is cached.
        try { window.dispatchEvent(new Event('offerbell-progress-hydrated')); } catch {}
      } catch {}
    })();
  }, []);

  // ─── Computed: weekly summary stats
  const totalDrills = useMemo(() => drillAgg.items, [drillAgg]);

  // Avg score across EVERYTHING that produces a score: flashcards + concept
  // drills (both in flash_perf) and mock interviews (single + full, from
  // mockResponses). Count-weighted so a mode with more attempts counts more,
  // rather than naively averaging two percentages of unequal sample size.
  // Avg score across everything that produces a grade: concept drills (from
  // drill history), mock interviews, and diagnostic. Flashcards are NOT graded
  // here. Count-weighted so a mode with more attempts counts more.
  const avgScoreData = useMemo(() => {
    const mockCount = (mockStats && mockStats.count) || 0;
    const mockScoreSum = mockCount * ((mockStats && mockStats.avgGrade) || 0);
    const items = drillAgg.items + mockCount + diagAgg.items;
    const scoreSum = drillAgg.scoreSum + mockScoreSum + diagAgg.scoreSum;
    const score = items > 0 ? Math.round(scoreSum / items) : 0;
    return { score, items };
  }, [drillAgg, mockStats, diagAgg]);
  const avgScore = avgScoreData.score;

  // ─── Active time per day (set by useActiveTime hook running app-wide)
  const [activeMinutes, setActiveMinutes] = useState<Record<string, number>>({});
  const loadActiveMinutes = useCallback(() => {
    try {
      const raw = localStorage.getItem('offerbell_active_minutes');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          setActiveMinutes(parsed);
          return;
        }
      }
    } catch {}
    setActiveMinutes({});
  }, []);
  useEffect(() => {
    loadActiveMinutes();
    // Refresh whenever the tab regains visibility (catches updates from the
    // ticker between dashboard renders). Also poll every 30s so the bars
    // update live if the dashboard is left open.
    const onVisible = () => { if (document.visibilityState === 'visible') loadActiveMinutes(); };
    document.addEventListener('visibilitychange', onVisible);
    const id = setInterval(loadActiveMinutes, 30_000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(id);
    };
  }, [loadActiveMinutes]);

  // ─── Computed: weekly activity (Hours per day, this Mon→Sun in local time)
  // Sums app-wide active minutes per local-time day, converts to hours.
  // Source: offerbell_active_minutes map, written by useActiveTime hook
  // every 30s while the user has the tab visible and focused.
  const weeklyActivity = useMemo(() => {
    const hours = [0, 0, 0, 0, 0, 0, 0];
    // Compute local Monday-00:00 of this week.
    const now = new Date();
    const dow = now.getDay(); // 0=Sun..6=Sat
    const mondayOffset = dow === 0 ? 6 : dow - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const ds = localDateStr(d);
      const mins = activeMinutes[ds] || 0;
      hours[i] = mins / 60;
    }
    return hours;
  }, [activeMinutes]);

  const maxWeekly = Math.max(0.01, ...weeklyActivity);

  // ─── Computed: skill heatmap: per-topic accuracy WITHIN the selected track
  // (not per-track across the platform). Reads byCat for the user's selected
  // vertical's flash_perf track. Sorted by accuracy ascending so weakest
  // topics appear first.
  const topicRows = useMemo(() => {
    if (!selectedTrackKey) return [];
    const drillByCat = drillByTrackCat[selectedTrackKey] || {};
    const diagByCat = diagByTrackCat[selectedTrackKey] || {};
    // Union of topics seen in concept drills (drill history), mock interviews,
    // and diagnostic. Each topic's accuracy is the blended average across all
    // three sources, weighted by attempts. Flashcards are excluded.
    const cats = new Set<string>([
      ...Object.keys(drillByCat),
      ...mockTopicStats.map(m => m.category),
      ...Object.keys(diagByCat),
    ]);
    return Array.from(cats)
      .map(topic => {
        const dr = drillByCat[topic] || { seen: 0, correct: 0 };
        const m = mockTopicStats.find(x => x.category === topic);
        const d = diagByCat[topic] || { total: 0, correct: 0 };
        const drillSeen = dr.seen || 0;
        const drillScoreSum = (dr.correct || 0) * 100; // each drill pass = 100%
        const mockCount = m?.count || 0;
        const mockScoreSum = m?.scoreSum || 0;     // already 0-100 per attempt
        const diagSeen = d.total || 0;
        const diagScoreSum = (d.correct || 0) * 100; // each correct diag answer = 100%
        const seen = drillSeen + mockCount + diagSeen;
        const accuracy = seen > 0 ? Math.round((drillScoreSum + mockScoreSum + diagScoreSum) / seen) : 0;
        return { topic, seen, accuracy };
      })
      .filter(r => r.seen > 0)
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [drillByTrackCat, selectedTrackKey, mockTopicStats, diagByTrackCat]);

  const hasAnyTopicData = topicRows.length > 0;

  // ─── Computed: what to focus on (real recommendations, career-aware)
  // All recommendations reference the user's SELECTED vertical, not some
  // unrelated track that happens to have low accuracy.
  const focusItems = useMemo(() => {
    const recs: Array<{ title: string; desc: string; href: string; urgency: 'amber' | 'red'; icon: 'mock' | 'flash' | 'coach' | 'outreach' | 'resume' }> = [];
    const trackLabel = TRACK_LABELS[selectedTrackKey] || profile.vertical || 'your track';

    // No mock interviews
    if (mockStats && mockStats.count === 0) {
      recs.push({
        title: 'Do your first Mock Interview',
        desc: 'Simulate real interview pressure before it counts.',
        href: '/mock-interview',
        urgency: 'red',
        icon: 'mock',
      });
    }
    // Flashcards: recommend the user's selected track specifically.
    if (selectedTrackKey) {
      // User has data, find their weakest topic IN this track if any are <70%.
      if (hasAnyTopicData) {
        const weakest = topicRows[0]; // already sorted ascending by accuracy
        if (weakest && weakest.accuracy < 70) {
          recs.push({
            title: `Practice ${weakest.topic} (${trackLabel})`,
            desc: `You're at ${weakest.accuracy}% accuracy here. Closing this gap matters.`,
            href: `/flashcards?track=${selectedTrackKey}`,
            urgency: 'amber',
            icon: 'flash',
          });
        }
      } else {
        // No flashcard data for this track yet.
        recs.push({
          title: `Start ${trackLabel} flashcards`,
          desc: 'Test where you stand on technical knowledge.',
          href: `/flashcards?track=${selectedTrackKey}`,
          urgency: 'amber',
          icon: 'flash',
        });
      }
    } else if (profile.vertical) {
      // User has a vertical selected but it doesn't have a flash_perf track yet.
      recs.push({
        title: `Explore other prep for ${profile.vertical}`,
        desc: 'Flashcards for this track are coming soon. Try Coach or Mock Interview.',
        href: '/coach',
        urgency: 'amber',
        icon: 'coach',
      });
    }
    // No coach chats
    if (coachStats && coachStats.count === 0) {
      recs.push({
        title: 'Try the Coach',
        desc: 'Get personalized feedback on your prep strategy.',
        href: '/coach',
        urgency: 'amber',
        icon: 'coach',
      });
    }
    // No outreach contacts
    if (outreachContacts.length === 0) {
      recs.push({
        title: 'Build your outreach pipeline',
        desc: 'Add your first contact and start networking.',
        href: '/outreach-tracker',
        urgency: 'red',
        icon: 'outreach',
      });
    }
    // No resume reviews
    try {
      const resumeReviews = localStorage.getItem('offerbell_resume_reviews');
      const arr = resumeReviews ? JSON.parse(resumeReviews) : [];
      if (!Array.isArray(arr) || arr.length === 0) {
        recs.push({
          title: 'Get your resume reviewed',
          desc: 'Submit your resume for line-by-line feedback.',
          href: '/resume-review',
          urgency: 'amber',
          icon: 'resume',
        });
      }
    } catch {}

    return recs.slice(0, 3);
  }, [mockStats, coachStats, hasAnyTopicData, topicRows, selectedTrackKey, profile.vertical, outreachContacts]);

  // ─── Computed: outreach pipeline counts
  const outreachCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of outreachContacts) counts[c.status] = (counts[c.status] || 0) + 1;
    return counts;
  }, [outreachContacts]);

  // ─── Calendar (compact, 6 weeks)
  const calendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const todayStr = localDateStr(now);
    const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const startDow = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1; // Mon=0
    const daysInMonth = lastOfMonth.getDate();
    const cells: Array<{ day: number; date: string; active: boolean; today: boolean } | null> = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({
        day,
        date,
        active: activityDaysSet.has(date),
        today: date === todayStr,
      });
    }
    return { monthLabel, cells };
  }, [activityDaysSet]);

  const activityHistory = useMemo(() => {
    const days = Array.from(activityDaysSet).sort();
    let longest = 0, run = 0;
    let prev: number | null = null;
    for (const d of days) {
      const t = new Date(d + 'T00:00:00').getTime();
      if (prev !== null && t - prev === 86400000) run++; else run = 1;
      if (run > longest) longest = run;
      prev = t;
    }
    const byMonth: Record<string, number[]> = {};
    for (const d of days) {
      const parts = d.split('-');
      const key = `${parts[0]}-${parts[1]}`;
      (byMonth[key] = byMonth[key] || []).push(Number(parts[2]));
    }
    const months = Object.keys(byMonth).sort().reverse().map(key => {
      const [y, m] = key.split('-');
      const label = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      return { label, days: byMonth[key].sort((a, b) => a - b) };
    });
    return { total: days.length, longest, months };
  }, [activityDaysSet]);

  // ─── Render
  const displayFirst = profile.first || "there";
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const focusIconFor = (icon: string) => {
    switch (icon) {
      case 'mock':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
      case 'flash':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>;
      case 'coach':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
      case 'outreach':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
      case 'resume':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
      default:
        return null;
    }
  };

  return (
    <div className="dash-app">
      <Topbar activePage="dashboard" />

      <div className="dash-canvas">
        <div className="dash-page">
          <div className="dash-page-inner">
            <div className="dash-top-row">
              <div>
                <div className="dash-greet-sub">{greeting}, {displayFirst}</div>
                <h1 className="dash-page-title">Your <em>Dashboard</em></h1>
                <div className="dash-page-sub">Everything you&apos;ve practiced, sent, and learned - in one view</div>
              </div>
              <button type="button" className="dash-customize-btn" onClick={() => setShowCustomize(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Customize
              </button>
            </div>

            <div className="dash-grid">
              {/* ─── LEFT COLUMN ─── */}
              <div className="dash-col-left">
                {/* Weekly Summary */}
                {dashConfig.widgets.weeklySummary && (
                <div className="dash-card">
                  <h2 className="dash-card-title">Weekly Summary</h2>
                  <div className="dash-stats-grid">
                    <div>
                      <div className="dash-stat-lbl">Total Drills</div>
                      <div className="dash-stat-num">{totalDrills}</div>
                      <div className="dash-stat-sub">{totalDrills === 0 ? 'No drills yet' : `${totalDrills} sessions total`}</div>
                    </div>
                    <div>
                      <div className="dash-stat-lbl">Mock Interviews</div>
                      <div className="dash-stat-num">{mockStats?.count ?? 0}</div>
                      <div className="dash-stat-sub">Avg score {mockStats?.avgGrade ?? 0}%</div>
                    </div>
                    <div>
                      <div className="dash-stat-lbl">Coach Chats</div>
                      <div className="dash-stat-num">{coachStats?.thisWeek ?? 0}</div>
                      <div className="dash-stat-sub">This week</div>
                    </div>
                    <div>
                      <div className="dash-stat-lbl">Avg Score</div>
                      <div className="dash-stat-num">{avgScore}%</div>
                      <div className="dash-stat-sub">{avgScoreData.items === 0 ? 'No scored activity yet' : `Based on ${avgScoreData.items} graded ${avgScoreData.items === 1 ? 'item' : 'items'}`}</div>
                    </div>
                  </div>
                </div>
                )}

                {/* Weekly Activity */}
                {dashConfig.widgets.weeklyActivity && (
                <div className="dash-card">
                  <h2 className="dash-card-title">Weekly Activity</h2>
                  <div className="dash-activity-sub">Hours per day</div>
                  <div className="dash-bars">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                      const v = weeklyActivity[i];
                      const heightPct = maxWeekly > 0 ? (v / maxWeekly) * 100 : 0;
                      const display = v === 0 ? '0' : v < 0.1 ? v.toFixed(2) : v.toFixed(1);
                      return (
                        <div key={day} className="dash-bar-col">
                          <div className="dash-bar-wrap">
                            <div className="dash-bar" style={{ height: `${heightPct}%` }} />
                          </div>
                          <div className="dash-bar-day">{day}</div>
                          <div className="dash-bar-val">{display}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* Skill Heatmap - per-topic accuracy within selected track */}
                {dashConfig.widgets.skillHeatmap && (
                <div className="dash-card">
                  <h2 className="dash-card-title">
                    Skill Heatmap
                    {selectedTrackKey && (
                      <span className="dash-card-title-tag">{TRACK_LABELS[selectedTrackKey]}</span>
                    )}
                  </h2>
                  {!profile.vertical ? (
                    <div className="dash-empty">Pick an industry in the sidebar to see your topic-level accuracy.</div>
                  ) : !selectedTrackKey ? (
                    <div className="dash-empty">Flashcards for {profile.vertical} aren&apos;t available yet. Try Coach or Mock Interview for this track.</div>
                  ) : !hasAnyTopicData ? (
                    <div className="dash-empty">
                      Complete a few {TRACK_LABELS[selectedTrackKey]} flashcards or mock questions to see your topic-level accuracy.
                    </div>
                  ) : (
                    <div className="dash-heatmap">
                      {topicRows.map(row => (
                        <Link
                          key={row.topic}
                          className="dash-heatmap-row"
                          href={`/flashcards?track=${selectedTrackKey}`}
                        >
                          <div className="dash-heatmap-label">{row.topic}</div>
                          <div className="dash-heatmap-bar-wrap">
                            <div
                              className="dash-heatmap-bar"
                              style={{
                                width: `${row.accuracy}%`,
                                background: row.accuracy >= 75 ? '#5b9e77' : row.accuracy >= 50 ? '#cf9a53' : '#c77b7b',
                              }}
                            />
                          </div>
                          <div className="dash-heatmap-val">{row.accuracy}%</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* ─── RIGHT COLUMN ─── */}
              <div className="dash-col-right">
                {/* Calendar (compact) */}
                {dashConfig.widgets.calendar && (
                <div className="dash-card dash-card-sm">
                  <div className="dash-cal-head">
                    <div className="dash-cal-title">{calendar.monthLabel}</div>
                    <div className="dash-cal-meta">
                      <span className="dash-cal-streak">{currentStreak} day streak</span>
                    </div>
                  </div>
                  <div className="dash-cal-grid">
                    {['MO','TU','WE','TH','FR','SA','SU'].map(d => (
                      <div key={d} className="dash-cal-dow">{d}</div>
                    ))}
                    {calendar.cells.map((c, i) => {
                      if (!c) return <div key={`empty-${i}`} className="dash-cal-day empty" />;
                      return (
                        <div
                          key={c.date}
                          className={`dash-cal-day${c.active ? ' active' : ''}${c.today ? ' today' : ''}`}
                          title={c.date}
                        >
                          {c.day}
                        </div>
                      );
                    })}
                  </div>
                  <button type="button" className="dash-cal-link" onClick={() => setHistoryOpen(true)}>View activity history</button>
                </div>
                )}

                {/* What to Focus On */}
                {dashConfig.widgets.focus && (
                <div className="dash-card dash-card-sm">
                  <h2 className="dash-card-title-sm">What to Focus On</h2>
                  {focusItems.length === 0 ? (
                    <div className="dash-empty" style={{ padding: '20px 0', fontSize: 13 }}>
                      You&apos;re on top of things. Keep the streak going.
                    </div>
                  ) : (
                    focusItems.map((f, i) => (
                      <Link key={i} className="dash-focus-item" href={f.href}>
                        <div className="dash-focus-icon">{focusIconFor(f.icon)}</div>
                        <div className="dash-focus-body">
                          <div className="dash-focus-head">
                            <span className="dash-focus-title">{f.title}</span>
                            <span className={`dash-focus-dot ${f.urgency}`} />
                          </div>
                          <div className="dash-focus-desc">{f.desc}</div>
                        </div>
                        <svg className="dash-focus-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </Link>
                    ))
                  )}
                </div>
                )}

                {/* Outreach */}
                {dashConfig.widgets.outreach && (
                <div className="dash-card dash-card-sm">
                  <h2 className="dash-card-title-sm">Outreach</h2>
                  <div className="dash-pipe-row dash-pipe-row-strong">
                    <div className="dash-pipe-lbl">Total contacts</div>
                    <div className="dash-pipe-val">{outreachContacts.length}</div>
                  </div>
                  {outreachStatuses.map(s => (
                    <div key={s.key} className="dash-pipe-row">
                      <div className="dash-pipe-lbl">{s.label}</div>
                      <div className="dash-pipe-val">{outreachCounts[s.key] || 0}</div>
                    </div>
                  ))}
                  <Link className="dash-solid-btn" href="/outreach-tracker">Open Outreach Tracker</Link>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCustomize && (
        <div className="dash-customize-overlay" onClick={() => setShowCustomize(false)}>
          <div className="dash-customize-modal" onClick={e => e.stopPropagation()}>
            <div className="dash-customize-head">
              <div>
                <div className="dash-customize-title">Customize <em>Dashboard</em></div>
                <div className="dash-customize-sub">Toggle widgets to show or hide. Changes save automatically.</div>
              </div>
              <button type="button" className="dash-customize-x" onClick={() => setShowCustomize(false)} aria-label="Close">×</button>
            </div>
            <div className="dash-customize-body">
              <div className="dash-customize-section-lbl">Available Widgets</div>
              <div className="dash-customize-list">
                {WIDGET_DEFS.map(w => {
                  const on = dashConfig.widgets[w.key];
                  return (
                    <button
                      key={w.key}
                      type="button"
                      className={`dash-customize-row${on ? ' is-on' : ''}`}
                      onClick={() => toggleWidget(w.key)}
                    >
                      <div className={`dash-customize-check${on ? ' is-on' : ''}`}>
                        {on && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--surface)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                      <div className="dash-customize-text">
                        <div className="dash-customize-name">{w.label}</div>
                        <div className="dash-customize-desc">{w.desc}</div>
                      </div>
                      <div className="dash-customize-col-tag">{w.col === 'left' ? 'Main' : 'Side'}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="dash-customize-foot">
              <button type="button" className="dash-customize-reset" onClick={resetDashConfig}>Reset to default</button>
              <button type="button" className="dash-customize-done" onClick={() => setShowCustomize(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

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
          onComplete={() => { setShowTutorial(false); try { sessionStorage.removeItem('offerbell_tutorial_replay'); } catch {} }}
        />
      )}
      {historyOpen && (
        <div className="dash-hist-overlay" onClick={() => setHistoryOpen(false)}>
          <div className="dash-hist-card" onClick={e => e.stopPropagation()}>
            <div className="dash-hist-head">
              <h3 className="dash-hist-title">Activity History</h3>
              <button type="button" className="dash-hist-close" onClick={() => setHistoryOpen(false)} aria-label="Close">✕</button>
            </div>
            <div className="dash-hist-stats">
              <div className="dash-hist-stat"><div className="dash-hist-stat-n">{activityHistory.total}</div><div className="dash-hist-stat-l">Active days</div></div>
              <div className="dash-hist-stat"><div className="dash-hist-stat-n">{currentStreak}</div><div className="dash-hist-stat-l">Current streak</div></div>
              <div className="dash-hist-stat"><div className="dash-hist-stat-n">{activityHistory.longest}</div><div className="dash-hist-stat-l">Longest streak</div></div>
            </div>
            <div className="dash-hist-list">
              {activityHistory.months.length === 0 ? (
                <div className="dash-hist-empty">No activity yet. Complete a drill, mock interview, or coach session and it will show up here.</div>
              ) : activityHistory.months.map(mo => (
                <div key={mo.label} className="dash-hist-month">
                  <div className="dash-hist-month-label">{mo.label}</div>
                  <div className="dash-hist-days">
                    {mo.days.map(d => <span key={d} className="dash-hist-day">{d}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
