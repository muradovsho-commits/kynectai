'use client';

import Sidebar from "../components/Sidebar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// Also used directly for sign-out
const SYNC_KEYS = ['offerbell_onboarding_profile','offerbell_plan','offerbell_plan_activated_at','offerbell_billing_cycle','offerbell_promo_code','offerbell_profile_pic','offerbell_account_created','offerbell_tutorial_complete','offerbell-theme','offerbell_flash_bookmarks','offerbell_flash_review','offerbell_flash_review_log','offerbell_mock_weekly','offerbell_tracker_v3','offerbell_tracker_config','offerbell_saved_messages','offerbell_messages_sent','offerbell_outreach_weekly','offerbell_dismissed_reminders','offerbell_referral_nodes_v3','offerbell_resume_usage','offerbell_resume_reviews','offerbell_coach_pro_usage','offerbell_coach_weekly','offerbell_activity_days','offerbell_searches_used','offerbell_game_scores','offerbell_feedback_history'];import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

const SCHOOLS = ["Adelphi University","American University","Appalachian State University","Arizona State University","Auburn University","Babson College","Baruch College","Baylor University","Bentley University","Binghamton University","Boston College","Boston University","Bridgewater State University","Brigham Young University","Brown University","Bryant University","Bucknell University","Carnegie Mellon University","Case Western Reserve University","Catholic University of America","Champlain College","Christopher Newport University","Clark University","Clemson University","Colgate University","Columbia University","Cornell University","Creighton University","Dartmouth College","DePaul University","Dickinson College","Drexel University","Duke University","East Carolina University","Elizabethtown College","Elon University","Emerson College","Emory University","Fairfield University","Fairleigh Dickinson University","Fashion Institute of Technology","Florida International University","Florida State University","Fordham University","Franklin & Marshall College","George Mason University","George Washington University","Georgetown University","Georgia Institute of Technology","Gettysburg College","Hamilton College","Harvard University","High Point University","Hofstra University","Hobart and William Smith Colleges","Howard University","Indiana University","Iona University","Iowa State University","Ithaca College","James Madison University","Johns Hopkins University","Johnson & Wales University","Kansas State University","Kean University","King's College PA","La Selle University","Lafayette College","Lehigh University","Liberty University","Long Island University","Longwood University","Louisiana State University","Loyola University Chicago","Loyola University Maryland","Manhattan College","Marist College","Marquette University","Massachusetts Institute of Technology","Merrimack College","Miami University of Ohio","Middlebury College","Misericordia University","Mississippi State University","Monmouth University","Montana State University","Montclair State University","Moravian University","Muhlenberg College","NC State University","New York University","Northeastern University","Northwestern University","Norwich University","Ohio State University","Ohio University","Oklahoma State University","Old Dominion University","Oregon State University","Pace University","Penn State University","Princeton University","Providence College","Purdue University","Quinnipiac University","Radford University","Ramapo College","Rensselaer Polytechnic Institute","Rice University","Rider University","Rochester Institute of Technology","Roger Williams University","Rowan University","Rutgers University","Sacred Heart University","Saint Anselm College","Saint Francis University PA","Saint Joseph's University","Salve Regina University","Seton Hall University","Simmons University","Skidmore College","Slippery Rock University","Southern Methodist University","St. Lawrence University","Stanford University","Stockton University","Stony Brook University","Suffolk University","Susquehanna University","Syracuse University","Temple University","Texas A&M University","Texas Christian University","Texas Tech University","The College of New Jersey","The New School","Towson University","Tufts University","Tulane University","UMass Boston","UMass Dartmouth","UMass Lowell","UNC Charlotte","UCLA","Union College","University at Albany","University at Buffalo","University of Alabama","University of Arizona","University of Arkansas","University of Baltimore","University of California Berkeley","University of Cincinnati","University of Colorado Boulder","University of Connecticut","University of Central Florida","University of Delaware","University of Florida","University of Georgia","University of Houston","University of Idaho","University of Illinois Urbana-Champaign","University of Iowa","University of Kansas","University of Kentucky","University of Louisville","University of Maryland","University of Massachusetts Amherst","University of Memphis","University of Miami","University of Michigan","University of Minnesota","University of Mississippi","University of Missouri","University of Montana","University of Nebraska","University of Nevada Las Vegas","University of Nevada Reno","University of New Hampshire","University of New Mexico","University of North Carolina at Chapel Hill","University of North Texas","University of Notre Dame","University of Oklahoma","University of Oregon","University of Pennsylvania","University of Pittsburgh","University of Rhode Island","University of Richmond","University of Rochester","University of South Carolina","University of South Florida","University of Southern California","University of Tennessee","University of Texas at Austin","University of Tulsa","University of Utah","University of Vermont","University of Virginia","University of Washington","University of Wisconsin Madison","University of Wyoming","Vanderbilt University","Villanova University","Virginia Commonwealth University","Virginia Tech","Wake Forest University","Washington University in St. Louis","Wheaton College MA","Wichita State University","Widener University","Wilkes University","William & Mary","Worcester Polytechnic Institute","Yale University"];

const VERTICALS = ["Investment Banking","Private Equity","Venture Capital","Consulting","Accounting & Audit","Asset Management","Sales & Trading","Equity Research","Real Estate","Restructuring","Growth Equity"];

const YEARS = ["Class of 2025","Class of 2026","Class of 2027","Class of 2028","Class of 2029","Class of 2030"];

export default function MyAccountPage() {
  const router = useRouter();
  const updateProfileMut = useMutation((api as any).users?.updateUserProfile);
  const [userId, setUserId] = useState('');
  // Replaces a reactive useQuery - see below for one-time HTTP fetch.
  const [dbUser, setDbUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [modal, setModal] = useState<{ title: string; desc: string; confirmLabel: string; onConfirm: () => void } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [barsAnimated, setBarsAnimated] = useState(false);
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [contactsTracked, setContactsTracked] = useState(0);
  // Warm-start the count from the tracker's read-only cache so it does not flash
  // 0 before the server fetch lands. The fetch in the mount effect then confirms it.
  useLayoutEffect(() => {
    try {
      const c = localStorage.getItem('offerbell_tracker_v3');
      if (c) { const p = JSON.parse(c); if (Array.isArray(p)) setContactsTracked(p.length); }
    } catch {}
  }, []);
  const [resumeUsed, setResumeUsed] = useState(0);
  const [resumeLifetime, setResumeLifetime] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  const [planActivatedAt, setPlanActivatedAt] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<string>('monthly');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [pendingPlanChange, setPendingPlanChange] = useState<{ targetPlan: string; effectiveAt: number } | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');
  const [resumingPlan, setResumingPlan] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);
  const saveProgressMut = useMutation((api as any).progress?.saveProgress);

  // Redesigned UI: tab state for the new settings layout. Pure cosmetic;
  // does not change behavior.

  // Server-side weekly usage (Convex). Falls back to localStorage if the
  // fetch hasn't resolved yet so the page never renders empty bars.
  const [weeklyUsage, setWeeklyUsage] = useState<{
    coach: number; resumeReview: number; outreachWriter: number; mockInterview: number;
  } | null>(null);

  // Limits matrix mirrors app/api/_lib/plan.ts. Read-only here.
  const PLAN_LIMITS = {
    coach:          { free: 1, pro: 40,  elite: 80  },
    resumeReview:   { free: 1, pro: 10,  elite: 30  },
    outreachWriter: { free: 5, pro: 20,  elite: 30  },
    mockInterview:  { free: 3, pro: 999, elite: 999 },
  } as const;

  // Returns the next reset point. Server window is Monday 00:00 UTC.
  const getResetInfo = () => {
    const now = new Date();
    const utcDay = now.getUTCDay();
    const daysUntilNextMonday = utcDay === 0 ? 1 : (8 - utcDay);
    const nextMondayUTC = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilNextMonday, 0, 0, 0, 0
    ));
    const day = nextMondayUTC.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    const time = nextMondayUTC.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    const diff = nextMondayUTC.getTime() - Date.now();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const relative = days >= 1 ? `${days}d ${hours}h` : `${hours}h`;
    return { day, time, relative };
  };

  // Tutorial check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const complete = localStorage.getItem('offerbell_tutorial_complete');
    if (!complete) {
      const step = parseInt(localStorage.getItem('offerbell_tutorial_step') || '0', 10);
      setTutorialStep(step);
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
    setTimeout(() => setBarsAnimated(true), 200);

    // Load real usage data
    try { setSearchesUsed(parseInt(localStorage.getItem('offerbell_searches_used') || '0', 10)); } catch {}
    try { setMessagesUsed(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    // contactsTracked now comes from the Convex tracker table, not localStorage
    // (the tracker no longer keeps a localStorage copy).
    (async () => {
      try {
        const uid = localStorage.getItem('offerbell_user_id') || '';
        const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
        if (!uid || !url) return;
        const tok = localStorage.getItem('offerbell_session') || undefined;
        const client = new ConvexHttpClient(url);
        const row: any = await client.query(api.outreachTracker.getTracker, { userId: uid, sessionToken: tok });
        if (row && row.data) { const p = JSON.parse(row.data); if (Array.isArray(p)) setContactsTracked(p.length); }
      } catch {}
    })();
    try {
      const raw = localStorage.getItem('offerbell_resume_usage');
      if (raw) {
        const data = JSON.parse(raw);
        setResumeLifetime(data.lifetime || 0);
        // Check if current week
        const now = new Date(); const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0];
        setResumeUsed(data.week === weekStart ? (data.count || 0) : 0);
      }
    } catch {}
    try {
      // Plan is sourced from Convex (server-side patch via getUser). The
      // localStorage value here is just a cache; the source of truth is
      // u.plan returned from Convex queries. The old v2 migration that
      // auto-promoted 'pro' to 'elite' on every page load was removed.
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      setUserPlan(localStorage.getItem('offerbell_plan') || prof.plan || plan);
    } catch {}
    try { const at = localStorage.getItem('offerbell_plan_activated_at'); if (at) setPlanActivatedAt(parseInt(at, 10)); } catch {}
    try { const pc = localStorage.getItem('offerbell_promo_code'); if (pc) setPromoCode(pc); } catch {}
    try { const bc = localStorage.getItem('offerbell_billing_cycle'); if (bc) setBillingCycle(bc); } catch {}

    // Load profile from onboarding localStorage as initial fallback
    // Load profile from onboarding localStorage as initial fallback. We only
    // use these values until the DB query below resolves, then DB wins for
    // every field unconditionally (including empties - the DB is truth).
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile.firstName) setFirstName(profile.firstName);
        if (profile.lastName) setLastName(profile.lastName);
        if (profile.email) setEmail(profile.email);
        if (profile.university) setSchool(profile.university);
        if (profile.year) {
          const classOf = profile.year.startsWith('Class of') ? profile.year : `Class of ${profile.year}`;
          setYear(classOf);
        }
        if (profile.targetRoles && Array.isArray(profile.targetRoles) && profile.targetRoles.length > 0) {
          setTargetRole(profile.targetRoles[0]);
        }
      }
    } catch (e) {}
    // Load profile picture
    try { const pic = localStorage.getItem('offerbell_profile_pic'); if (pic) setProfilePic(pic); } catch {}

    // Now load from DB (source of truth) and overwrite localStorage fallback
   // Just record the userId. The reactive `dbUser` useQuery handles the
    // actual DB load via the dedicated effect below - using one source of
    // truth instead of a parallel HTTP fetch eliminates the rehydration
    // flicker.
    const uid = localStorage.getItem('offerbell_user_id') || '';
    setUserId(uid);
    if (!uid) setProfileLoaded(true);
  }, []);

  // Live-sync with sidebar industry pill: if the user changes their industry
  // anywhere else in the app (notably the sidebar) while this page is open,
  // re-read the profile so the Target Role select reflects the new choice
  // without a page reload. Pure read on a small localStorage key, no Convex
  // round-trip.
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        if (!raw) return;
        const p = JSON.parse(raw);
        if (Array.isArray(p.targetRoles) && p.targetRoles.length > 0) {
          setTargetRole(p.targetRoles[0]);
        }
      } catch {}
    };
    window.addEventListener('offerbell-profile-changed', refresh);
    return () => window.removeEventListener('offerbell-profile-changed', refresh);
  }, []);

  // Fetch weekly usage from Convex weeklyUsage table. Source of truth for
  // the Usage tab. Falls back gracefully on error or pre-deploy code paths.
  useEffect(() => {
    if (!userId) return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;
    const client = new ConvexHttpClient(url);
    client.query((api as any).usage?.getUsage, { userId })
      .then((u: any) => {
        if (!u) return;
        setWeeklyUsage({
          coach: u.coach ?? 0,
          resumeReview: u.resumeReview ?? 0,
          outreachWriter: u.outreachWriter ?? 0,
          mockInterview: u.mockInterview ?? 0,
        });
      })
      .catch(() => { /* server hasn't deployed usage table yet; cards show 0 */ });
  }, [userId]);

 // One-time HTTP fetch + hydrate. We deliberately DO NOT use a reactive
  // useQuery here - it sets up a live subscription that re-receives the
  // entire user record every time anyone calls updateUserProfile (which
  // happens on every settings autoSave keystroke), burning bandwidth.
  // Plan/profile changes from webhooks propagate on the next page mount.
  const hasHydratedFromDb = useRef(false);
  useEffect(() => {
    if (!userId) return;
    if (hasHydratedFromDb.current) return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) { setProfileLoaded(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const u = await client.query((api as any).users.getUser, { userId, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) });
        if (cancelled) return;
        setDbUser(u);
        if (!u || !u.found) { setProfileLoaded(true); return; }
        hasHydratedFromDb.current = true;

        if (u.firstName) setFirstName(u.firstName);
        if (u.lastName) setLastName(u.lastName);
        if (u.email) setEmail(u.email);
        // Free-plan outreach is a lifetime count on the user row (outreachCount,
        // surfaced as messagesUsed). Refresh from the server so the usage panel
        // is correct even on a fresh device where localStorage is empty.
        if (typeof u.messagesUsed === 'number') {
          setMessagesUsed(u.messagesUsed);
          try { localStorage.setItem('offerbell_messages_sent', String(u.messagesUsed)); } catch {}
        }
        if (u.university) setSchool(u.university);
        if (u.graduationYear) {
          const classOf = u.graduationYear.startsWith('Class of')
            ? u.graduationYear
            : `Class of ${u.graduationYear}`;
          setYear(classOf);
        }
        if (u.targetRoles && u.targetRoles.length > 0) {
          setTargetRole(u.targetRoles[0]);
        }
        if (u.profilePic) setProfilePic(u.profilePic);
        setUserPlan(u.plan || 'free');
        try { localStorage.setItem('offerbell_plan', u.plan || 'free'); } catch {}
        setPendingPlanChange(u.pendingPlanChange ?? null);
        setSubscriptionStatus(u.subscriptionStatus ?? '');

        // Sync DB → localStorage cache so sidebar / other pages see truth.
        try {
          const raw = localStorage.getItem('offerbell_onboarding_profile');
          const existing = raw ? JSON.parse(raw) : {};
          const updated = {
            ...existing,
            firstName: u.firstName || existing.firstName,
            lastName: u.lastName || existing.lastName,
            email: u.email || existing.email,
            university: u.university || existing.university,
            year: u.graduationYear || existing.year,
            targetRoles: (u.targetRoles && u.targetRoles.length > 0)
              ? u.targetRoles
              : existing.targetRoles,
          };
          localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(updated));
        } catch {}
        setProfileLoaded(true);
      } catch (e) {
        console.error('[my-account] hydration fetch failed:', e);
        setProfileLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  function handlePicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const size = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 128, 128);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfilePic(dataUrl);
        localStorage.setItem('offerbell_profile_pic', dataUrl);
        // Persist to the users table (source of truth loaded on every page).
        // Without this, getUser() rehydrates the OLD pic on reload.
        try {
          const uid = localStorage.getItem('offerbell_user_id') || '';
          if (uid) void updateProfileMut({ userId: uid, profilePic: dataUrl });
        } catch {}
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function removePic() {
    setProfilePic(null);
    // Use empty string (not removeItem) so it's a real synced value that
    // overwrites the blob; and clear the users-table column, which is the
    // source of truth getUser() rehydrates from on every reload.
    localStorage.setItem('offerbell_profile_pic', '');
    try {
      const uid = localStorage.getItem('offerbell_user_id') || '';
      if (uid) void updateProfileMut({ userId: uid, profilePic: '' });
    } catch {}
  }
  async function handleKeepPlan() {
    if (!pendingPlanChange) return;
    setResumingPlan(true);
    try {
      const uid = localStorage.getItem('offerbell_user_id') || '';
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
      let subscriptionId: string | undefined;
      if (convexUrl) {
        const { ConvexHttpClient } = await import('convex/browser');
        const client = new ConvexHttpClient(convexUrl);
        const u = await client.query((api as any).users.getUser, { userId: uid, sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) });
        subscriptionId = u?.stripeSubscriptionId || undefined;
      }
      if (!uid || !subscriptionId) {
        alert('Could not undo the change. Please contact support.');
        setResumingPlan(false);
        return;
      }
      const res = await fetch('/api/stripe-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, subscriptionId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(`Could not undo: ${data.error || 'Unknown error'}.`);
        setResumingPlan(false);
        return;
      }
      setPendingPlanChange(null);
      alert('Your plan will continue as normal. No changes will take effect.');
    } catch (e) {
      console.error('[keep-plan] failed:', e);
      alert('Something went wrong. Please try again.');
      setResumingPlan(false);
    }
  }

 // Mirror form state into a ref so autoSave always reads the freshest values,
  // independent of React render timing. Without this, saves are one keystroke
  // behind because onChange's setX schedules a re-render but autoSave runs
  // before the new state is committed.
  const valuesRef = useRef({ firstName, lastName, email, school, year, targetRole });
  useEffect(() => {
    valuesRef.current = { firstName, lastName, email, school, year, targetRole };
  }, [firstName, lastName, email, school, year, targetRole]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function autoSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const v = valuesRef.current;
      // Save to localStorage (cache for sidebar / other pages)
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        const existing = raw ? JSON.parse(raw) : {};
        const updated = {
          ...existing,
          firstName: v.firstName,
          lastName: v.lastName,
          email: v.email,
          university: v.school,
          year: v.year.replace('Class of ', ''),
          targetRoles: v.targetRole
            ? [v.targetRole, ...((existing.targetRoles || []).filter((r: string) => r !== v.targetRole))]
            : (existing.targetRoles || []),
        };
        localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(updated));
      } catch {}

      // Save to Convex DB (source of truth)
      const uid = userId || localStorage.getItem('offerbell_user_id') || '';
      if (uid && updateProfileMut) {
        updateProfileMut({
          userId: uid,
          firstName: v.firstName,
          lastName: v.lastName,
          university: v.school,
          graduationYear: v.year.replace('Class of ', ''),
          targetRoles: v.targetRole ? [v.targetRole] : [],
        })
          .then(() => console.log('[save] OK'))
          .catch((e: any) => console.error('[save] FAILED:', e?.message || e, e));
      }
    }, 600);
  }

  const initials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase();
  const inp = { padding:'10px 14px', border:'1.5px solid var(--border-2)', borderRadius:10, fontSize:13, fontFamily:"'Sora',sans-serif", color:'var(--text)', background:'var(--bg)', outline:'none', width:'100%' } as React.CSSProperties;
  // Helpers used inside JSX
  const planLabel = userPlan === 'elite' ? 'Elite' : userPlan === 'pro' ? 'Pro' : 'Free';
  const planBadgeStyle = userPlan === 'elite'
    ? { background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }
    : userPlan === 'pro'
      ? { background: 'rgba(234, 179, 8, 0.12)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)' }
      : { background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' };

  const handleSignOut = async () => {
    const uid = localStorage.getItem('offerbell_user_id');
    if (uid) {
      const data: Record<string, string> = {};
      for (const key of SYNC_KEYS) { const val = localStorage.getItem(key); if (val !== null) data[key] = val; }
      if (Object.keys(data).length > 0) {
        const payload = { userId: uid, data: JSON.stringify(data), sessionToken: (typeof window!=='undefined'?localStorage.getItem('offerbell_session')||undefined:undefined) };
        try { if (saveProgressMut) await saveProgressMut(payload); }
        catch {
          try {
            const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
            if (url) { const h = new ConvexHttpClient(url); await h.mutation(api.progress.saveProgress, payload); }
          } catch {}
        }
      }
    }
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('offerbell') && k !== 'offerbell-theme') keys.push(k); }
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('userId');
    try { await fetch('/api/auth/signout', { method: 'POST' }); } catch {}
    router.push('/');
  };

  // Usage rows (computed). Falls back to localStorage values if Convex
  // hasn't responded yet so the Usage tab never renders empty.
  const usageRows = (() => {
    const plan = (userPlan === 'elite' ? 'elite' : userPlan === 'pro' ? 'pro' : 'free') as 'free' | 'pro' | 'elite';
    const coachUsed = weeklyUsage?.coach ?? 0;
    const reviewUsed = weeklyUsage?.resumeReview ?? (plan === 'free' ? resumeLifetime : resumeUsed);
    // Free outreach is a LIFETIME count (messagesUsed/outreachCount); paid is
    // weekly (weeklyUsage.outreachWriter). The weekly value is 0 for free, so a
    // plain ?? would wrongly show 0 instead of the lifetime count.
    const writerUsed = plan === 'free' ? messagesUsed : (weeklyUsage?.outreachWriter ?? 0);
    const mockUsed = weeklyUsage?.mockInterview ?? 0;
    return [
      { key: 'coach',          label: 'AI Coach',         icon: 'chat',     used: coachUsed,  limit: PLAN_LIMITS.coach[plan],          isLifetime: false },
      { key: 'resumeReview',   label: 'Resume Review',    icon: 'doc',      used: reviewUsed, limit: PLAN_LIMITS.resumeReview[plan],   isLifetime: false },
      { key: 'outreachWriter', label: 'Outreach Writer',  icon: 'send',     used: writerUsed, limit: PLAN_LIMITS.outreachWriter[plan], isLifetime: plan === 'free' },
      { key: 'mockInterview',  label: 'Mock Interview',   icon: 'mic',      used: mockUsed,   limit: PLAN_LIMITS.mockInterview[plan],  isLifetime: false },
    ];
  })();

  const reset = getResetInfo();

  return (
    <div className="app">
      <Sidebar activePage="my-account" />

      <main className="main" style={{ padding: '32px 36px 80px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>

        {/* ════════════════ HERO ════════════════ */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          paddingBottom: 24, marginBottom: 28,
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <input ref={picInputRef} type="file" accept="image/*" onChange={handlePicUpload} style={{ display: 'none' }} />
            <button
              type="button"
              onClick={() => picInputRef.current?.click()}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--text)', color: 'var(--surface)',
                fontSize: 22, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Instrument Serif', serif",
                cursor: 'pointer', overflow: 'hidden',
                border: '2px solid var(--border)',
                padding: 0,
              }}
              aria-label="Change profile picture"
            >
              {profilePic ? (
                <img src={profilePic} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (initials || '?')}
            </button>
            {profilePic && (
              <button
                type="button"
                onClick={removePic}
                title="Remove photo"
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'var(--bg)', border: '1.5px solid var(--border-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Instrument Serif', serif", fontSize: 26, letterSpacing: '-0.3px',
              color: 'var(--text)', lineHeight: 1.15, marginBottom: 2,
            }}>
              {firstName || 'Set'} <em style={{ fontStyle: 'italic' }}>{lastName || 'your name'}</em>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 8 }}>{email || 'No email set'}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 100,
                fontSize: 10.5, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
                ...planBadgeStyle,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                {planLabel}
              </span>
              {school && (
                <span style={{
                  display: 'inline-flex', padding: '3px 9px', borderRadius: 100,
                  fontSize: 10.5, fontWeight: 600,
                  background: 'var(--surface-2)', color: 'var(--text-3)',
                  border: '1px solid var(--border)',
                }}>{school}</span>
              )}
              {year && (
                <span style={{
                  display: 'inline-flex', padding: '3px 9px', borderRadius: 100,
                  fontSize: 10.5, fontWeight: 600,
                  background: 'var(--surface-2)', color: 'var(--text-3)',
                  border: '1px solid var(--border)',
                }}>{year}</span>
              )}
            </div>
          </div>

          <button type="button" onClick={handleSignOut} style={{
            background: 'transparent', color: 'var(--text-2)',
            padding: '8px 16px', borderRadius: 8,
            fontSize: 12.5, fontWeight: 600,
            border: '1.5px solid var(--border-2)',
            cursor: 'pointer', fontFamily: "'Sora', sans-serif",
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
            Sign out
          </button>
        </div>

        {/* ════════════════ PAST-DUE BANNER ════════════════ */}
        {/* Shown when Stripe has marked the subscription past_due (card was
            declined). Stripe retries the charge per its default policy
            (~3 weeks across 4 retries). Until then the user keeps full
            access, but they need to know their payment failed - otherwise
            they're blindsided when Stripe gives up and downgrades them. */}
        {subscriptionStatus === 'past_due' && (
          <div style={{
            marginBottom: 20, padding: '13px 16px',
            borderRadius: 10, background: 'rgba(220, 38, 38, 0.07)',
            border: '1.5px solid rgba(220, 38, 38, 0.3)',
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                Payment failed. Please update your payment method
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Your last charge was declined. Stripe will retry automatically, but if it keeps failing your subscription will be cancelled.
              </div>
            </div>
            <a
              href="mailto:support@offerbell.org?subject=Payment%20Failed%20-%20Update%20Card"
              style={{
                padding: '7px 14px', borderRadius: 7,
                background: 'var(--text)', color: 'var(--bg)',
                fontSize: 12, fontWeight: 700, textDecoration: 'none',
                fontFamily: "'Sora', sans-serif",
              }}
            >Contact support</a>
          </div>
        )}

        {/* ════════════════ PENDING PLAN BANNER ════════════════ */}
        {/* Hide if effectiveAt is in the past - the change has already taken
            effect and the webhook auto-clears, but this gives us UI-side
            protection against a stale Convex value loaded just before the
            webhook clear lands. */}
        {pendingPlanChange && pendingPlanChange.effectiveAt > Date.now() && (
          <div style={{
            marginBottom: 20, padding: '13px 16px',
            borderRadius: 10, background: 'rgba(251, 146, 60, 0.07)',
            border: '1.5px solid rgba(251, 146, 60, 0.3)',
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                {pendingPlanChange.targetPlan === 'free'
                  ? 'Subscription scheduled to cancel'
                  : `Plan switches to ${pendingPlanChange.targetPlan === 'pro' ? 'Pro' : pendingPlanChange.targetPlan}`}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Effective {new Date(pendingPlanChange.effectiveAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}. Current plan stays until then.
              </div>
            </div>
            <button type="button" onClick={handleKeepPlan} disabled={resumingPlan} style={{
              padding: '7px 14px', borderRadius: 7,
              border: '1.5px solid var(--border-2)', background: 'var(--bg)', color: 'var(--text)',
              fontSize: 12, fontWeight: 700, cursor: resumingPlan ? 'not-allowed' : 'pointer',
              opacity: resumingPlan ? 0.6 : 1, fontFamily: "'Sora', sans-serif",
            }}>{resumingPlan ? 'Working...' : 'Keep my plan'}</button>
          </div>
        )}

        {/* ════════════════ TOP ROW: PLAN + USAGE ════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }} className="ma-grid">
          {/* ─── PLAN CARD ─── */}
          <div data-tutorial="plan-section" style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '22px 24px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Plan &amp; billing</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: userPlan === 'free' ? 'var(--text-3)' : '#22c55e', letterSpacing: 0.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: userPlan === 'free' ? 'var(--text-3)' : '#22c55e' }}/>
                {userPlan === 'free' ? 'Free' : 'Active'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, letterSpacing: '-0.5px', color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>
                  {planLabel} <em style={{ fontStyle: 'italic' }}>plan</em>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                  {userPlan === 'elite'
                    ? 'The Desk, higher AI limits, 30 resume reviews/week'
                    : userPlan === 'pro'
                      ? '10 resume reviews/week, 20 outreach/week, all features'
                      : '5 outreach lifetime, 1 review/week, 3 mocks/week'}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontStyle: 'italic', color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {userPlan === 'free' ? '$0' : (promoCode && (promoCode.toLowerCase().includes('lifetime') || promoCode.toLowerCase().includes('forever') || promoCode.toLowerCase().includes('free')))
                    ? '$0'
                    : billingCycle === 'annual'
                      ? userPlan === 'elite' ? '$384' : '$192'
                      : billingCycle === '6month'
                        ? userPlan === 'elite' ? '$216' : '$108'
                        : userPlan === 'elite' ? '$40' : '$20'
                  }
                  <span style={{ fontSize: 12, fontStyle: 'normal', fontFamily: "'Sora', sans-serif", color: 'var(--text-3)', fontWeight: 400 }}>
                    /{billingCycle === 'annual' ? 'yr' : billingCycle === '6month' ? '6mo' : 'mo'}
                  </span>
                </div>
              </div>
            </div>

            {(planActivatedAt || promoCode) && (userPlan === 'pro' || userPlan === 'elite') && (
              <div style={{
                padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8,
                fontSize: 11.5, color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.5,
              }}>
                {(() => {
                  const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  const cycleDays = billingCycle === 'annual' ? 365 : billingCycle === '6month' ? 182 : 30;
                  if (promoCode) {
                    const code = promoCode.toLowerCase();
                    if (code.includes('lifetime') || code.includes('forever') || code.includes('free')) return <>Lifetime via code <strong style={{ color: 'var(--text-2)' }}>{promoCode}</strong></>;
                    if (planActivatedAt) return <>Via code <strong style={{ color: 'var(--text-2)' }}>{promoCode}</strong>. Renews {fmtDate(planActivatedAt + cycleDays * 864e5)}</>;
                    return <>Activated via <strong style={{ color: 'var(--text-2)' }}>{promoCode}</strong></>;
                  }
                  if (planActivatedAt) return <>Renews {fmtDate(planActivatedAt + cycleDays * 864e5)}</>;
                  return null;
                })()}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button type="button" onClick={() => window.location.href = '/checkout'} style={{
                flex: 1, background: userPlan === 'free' ? '#2563eb' : 'var(--surface-2)',
                color: userPlan === 'free' ? '#fff' : 'var(--text)',
                padding: '11px 0', borderRadius: 9,
                fontSize: 12.5, fontWeight: 700,
                border: userPlan === 'free' ? 'none' : '1.5px solid var(--border-2)',
                cursor: 'pointer', fontFamily: "'Sora', sans-serif",
              }}>{userPlan === 'free' ? 'Upgrade plan' : 'Manage plan'}</button>
              {userPlan !== 'free' && (
                <button type="button" onClick={() => window.location.href = '/checkout'} style={{
                  background: 'transparent', color: 'var(--text-2)',
                  padding: '11px 14px', borderRadius: 9,
                  fontSize: 12.5, fontWeight: 600,
                  border: '1.5px solid var(--border-2)',
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}>Compare</button>
              )}
            </div>
          </div>

          {/* ─── USAGE CARD ─── */}
          <div style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 14, padding: '22px 24px',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>This week</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Resets {reset.day.split(',')[0]} ({reset.relative})</div>
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 14, lineHeight: 1.15 }}>
              Your <em style={{ fontStyle: 'italic' }}>usage</em>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {usageRows.map(row => {
                const pct = row.limit > 0 ? Math.min(100, Math.round((row.used / row.limit) * 100)) : 0;
                const remaining = Math.max(0, row.limit - row.used);
                const isUnlimited = row.limit >= 999;
                const overOrAt = !isUnlimited && row.used >= row.limit;
                const barColor = overOrAt ? '#dc2626' : pct >= 80 ? '#f59e0b' : 'var(--text)';
                return (
                  <div key={row.key}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ fontSize: 12.5, color: 'var(--text-2)', fontWeight: 500 }}>{row.label}</div>
                      <div style={{ fontSize: 11.5, color: overOrAt ? '#dc2626' : 'var(--text-3)', fontWeight: 600 }}>
                        {isUnlimited ? <span style={{ color: 'var(--text-3)' }}>Unlimited</span> : <>{row.used} <span style={{ color: 'var(--text-3)' }}>/ {row.limit}</span></>}
                      </div>
                    </div>
                    {!isUnlimited && (
                      <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, background: barColor, width: barsAnimated ? pct + '%' : '0%', transition: 'width 1s cubic-bezier(.4,0,.2,1)' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ════════════════ PROFILE FORM ════════════════ */}
        <div data-tutorial="profile-section" style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 14, padding: '22px 24px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Profile</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: 'var(--text)', letterSpacing: '-0.3px', lineHeight: 1.15 }}>
                Your <em style={{ fontStyle: 'italic' }}>info</em>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Saves automatically
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="ma-form">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>First name</label>
              <input style={inp} type="text" value={firstName} onChange={e => { setFirstName(e.target.value); autoSave(); }} placeholder="First name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Last name</label>
              <input style={inp} type="text" value={lastName} onChange={e => { setLastName(e.target.value); autoSave(); }} placeholder="Last name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</label>
              <input style={{ ...inp, background: 'var(--surface-2)', color: 'var(--text-3)', cursor: 'not-allowed' }} type="email" value={email} readOnly disabled aria-readonly="true" title="Email is set at signup and cannot be changed here" placeholder="your@email.com" />
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Set at signup and verified. Contact support to change it.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>School</label>
              <select style={inp} value={school} onChange={e => { setSchool(e.target.value); autoSave(); }}>
                <option value="">Select school...</option>
                {school && !SCHOOLS.includes(school) && <option key={school}>{school}</option>}
                {SCHOOLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Graduation</label>
              <select style={inp} value={year} onChange={e => { setYear(e.target.value); autoSave(); }}>
                <option value="">Select year...</option>
                {year && !YEARS.includes(year) && <option key={year}>{year}</option>}
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Target role</label>
              <select style={inp} value={targetRole} onChange={e => { setTargetRole(e.target.value); autoSave(); }}>
                <option value="">Select role...</option>
                {targetRole && !VERTICALS.includes(targetRole) && <option key={targetRole}>{targetRole}</option>}
                {VERTICALS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ════════════════ ACCOUNT ACTIONS ════════════════ */}
        <div style={{
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 14, padding: '6px 24px',
        }}>
          {/* Support row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 0', gap: 20, borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 1 }}>Need help?</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>Questions, feedback, or partnership inquiries</div>
              </div>
            </div>
            <a href="mailto:officialofferbell@gmail.com" style={{
              background: 'transparent', color: 'var(--text-2)',
              padding: '7px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 600,
              border: '1.5px solid var(--border-2)',
              textDecoration: 'none', whiteSpace: 'nowrap',
              fontFamily: "'Sora', sans-serif",
            }}>Email support</a>
          </div>

          {/* Sign out row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 0', gap: 20, borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 1 }}>Sign out</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>You can sign back in anytime</div>
              </div>
            </div>
            <button type="button" onClick={handleSignOut} style={{
              background: 'transparent', color: 'var(--text-2)',
              padding: '7px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 600,
              border: '1.5px solid var(--border-2)',
              cursor: 'pointer', fontFamily: "'Sora', sans-serif",
            }}>Sign out</button>
          </div>

          {/* Delete account row removed - users contact support to delete */}
        </div>

        </div>
      </main>

      {showTutorial && (
        <TutorialOverlay
          userId={typeof window !== 'undefined' ? (localStorage.getItem('offerbell_user_id') || '') : ''}
          initialStep={tutorialStep}
          onComplete={() => setShowTutorial(false)}
        />
      )}

      {/* Confirmation Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '24px', width: 380, maxWidth: '90vw', boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{modal.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 20 }}>{modal.desc}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setModal(null)} style={{ flex: 1, padding: '10px', borderRadius: 9, border: '1.5px solid var(--border-2)', background: 'transparent', color: 'var(--text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>Go back</button>
              <button type="button" onClick={() => { setModal(null); modal.onConfirm(); }} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>{modal.confirmLabel}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .ma-grid { grid-template-columns: 1fr !important; }
          .ma-form { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .ma-form { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
