'use client';

import Sidebar from "../components/Sidebar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// Also used directly for sign-out
const SYNC_KEYS = ['offerbell_onboarding_profile','offerbell_plan','offerbell_plan_activated_at','offerbell_billing_cycle','offerbell_promo_code','offerbell_profile_pic','offerbell_account_created','offerbell_tutorial_complete','offerbell-theme','offerbell_flash_perf_ib','offerbell_flash_perf_pe','offerbell_flash_perf_rx','offerbell_flash_perf_consulting','offerbell_flash_perf_accounting','offerbell_flash_perf_am','offerbell_flash_perf_st','offerbell_flash_perf_er','offerbell_flash_perf_re','offerbell_flash_perf_vc','offerbell_flash_bookmarks','offerbell_flash_review','offerbell_flash_review_log','offerbell_diag_history','offerbell_mock_responses','offerbell_mock_weekly','offerbell_tracker_v3','offerbell_tracker_config','offerbell_saved_messages','offerbell_messages_sent','offerbell_outreach_weekly','offerbell_dismissed_reminders','offerbell_referral_nodes_v3','offerbell_resume_usage','offerbell_resume_reviews','offerbell_coach_history','offerbell_coach_pro_usage','offerbell_coach_weekly','offerbell_activity_days','offerbell_searches_used','offerbell_game_scores','offerbell_feedback_history'];
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

const SCHOOLS = ["Adelphi University","American University","Appalachian State University","Arizona State University","Auburn University","Babson College","Baruch College","Baylor University","Bentley University","Binghamton University","Boston College","Boston University","Bridgewater State University","Brigham Young University","Brown University","Bryant University","Bucknell University","Carnegie Mellon University","Case Western Reserve University","Catholic University of America","Champlain College","Christopher Newport University","Clark University","Clemson University","Colgate University","Columbia University","Cornell University","Creighton University","Dartmouth College","DePaul University","Dickinson College","Drexel University","Duke University","East Carolina University","Elizabethtown College","Elon University","Emerson College","Emory University","Fairfield University","Fairleigh Dickinson University","Fashion Institute of Technology","Florida International University","Florida State University","Fordham University","Franklin & Marshall College","George Mason University","George Washington University","Georgetown University","Georgia Institute of Technology","Gettysburg College","Hamilton College","Harvard University","High Point University","Hofstra University","Hobart and William Smith Colleges","Howard University","Indiana University","Iona University","Iowa State University","Ithaca College","James Madison University","Johns Hopkins University","Johnson & Wales University","Kansas State University","Kean University","King's College PA","La Selle University","Lafayette College","Lehigh University","Liberty University","Long Island University","Longwood University","Louisiana State University","Loyola University Chicago","Loyola University Maryland","Manhattan College","Marist College","Marquette University","Massachusetts Institute of Technology","Merrimack College","Miami University of Ohio","Middlebury College","Misericordia University","Mississippi State University","Monmouth University","Montana State University","Montclair State University","Moravian University","Muhlenberg College","NC State University","New York University","Northeastern University","Northwestern University","Norwich University","Ohio State University","Ohio University","Oklahoma State University","Old Dominion University","Oregon State University","Pace University","Penn State University","Princeton University","Providence College","Purdue University","Quinnipiac University","Radford University","Ramapo College","Rensselaer Polytechnic Institute","Rice University","Rider University","Rochester Institute of Technology","Roger Williams University","Rowan University","Rutgers University","Sacred Heart University","Saint Anselm College","Saint Francis University PA","Saint Joseph's University","Salve Regina University","Seton Hall University","Simmons University","Skidmore College","Slippery Rock University","Southern Methodist University","St. Lawrence University","Stanford University","Stockton University","Stony Brook University","Suffolk University","Susquehanna University","Syracuse University","Temple University","Texas A&M University","Texas Christian University","Texas Tech University","The College of New Jersey","The New School","Towson University","Tufts University","Tulane University","UMass Boston","UMass Dartmouth","UMass Lowell","UNC Charlotte","UCLA","Union College","University at Albany","University at Buffalo","University of Alabama","University of Arizona","University of Arkansas","University of Baltimore","University of California Berkeley","University of Cincinnati","University of Colorado Boulder","University of Connecticut","University of Central Florida","University of Delaware","University of Florida","University of Georgia","University of Houston","University of Idaho","University of Illinois Urbana-Champaign","University of Iowa","University of Kansas","University of Kentucky","University of Louisville","University of Maryland","University of Massachusetts Amherst","University of Memphis","University of Miami","University of Michigan","University of Minnesota","University of Mississippi","University of Missouri","University of Montana","University of Nebraska","University of Nevada Las Vegas","University of Nevada Reno","University of New Hampshire","University of New Mexico","University of North Carolina at Chapel Hill","University of North Texas","University of Notre Dame","University of Oklahoma","University of Oregon","University of Pennsylvania","University of Pittsburgh","University of Rhode Island","University of Richmond","University of Rochester","University of South Carolina","University of South Florida","University of Southern California","University of Tennessee","University of Texas at Austin","University of Tulsa","University of Utah","University of Vermont","University of Virginia","University of Washington","University of Wisconsin Madison","University of Wyoming","Vanderbilt University","Villanova University","Virginia Commonwealth University","Virginia Tech","Wake Forest University","Washington University in St. Louis","Wheaton College MA","Wichita State University","Widener University","Wilkes University","William & Mary","Worcester Polytechnic Institute","Yale University"];

const VERTICALS = ["Investment Banking","Private Equity","Venture Capital","Consulting","Accounting & Audit","Asset Management","Sales & Trading","Equity Research","Real Estate","Restructuring","Growth Equity"];

const YEARS = ["Class of 2025","Class of 2026","Class of 2027","Class of 2028","Class of 2029","Class of 2030"];

export default function MyAccountPage() {
  const router = useRouter();
  const deleteAccountMutation = useMutation(api.auth.deleteAccount);
  const downgradePlanMutation = useMutation(api.auth.downgradePlan);
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
  const [resumeUsed, setResumeUsed] = useState(0);
  const [resumeLifetime, setResumeLifetime] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  const [planActivatedAt, setPlanActivatedAt] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<string>('monthly');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [pendingPlanChange, setPendingPlanChange] = useState<{ targetPlan: string; effectiveAt: number } | null>(null);
  const [resumingPlan, setResumingPlan] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const picInputRef = useRef<HTMLInputElement>(null);
  const saveProgressMut = useMutation((api as any).progress?.saveProgress);

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
    try { const t = localStorage.getItem('offerbell_tracker_v3'); if (t) setContactsTracked(JSON.parse(t).length); } catch {}
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
    try { const plan = localStorage.getItem('offerbell_plan') || 'free'; const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      // Auto-migrate old pro → elite
      const migrated = localStorage.getItem('offerbell_plan_migrated_v2');
      if (!migrated && (plan === 'pro' || prof.plan === 'pro') && localStorage.getItem('offerbell_plan_activated_at')) {
        localStorage.setItem('offerbell_plan', 'elite'); localStorage.setItem('offerbell_plan_migrated_v2', 'true');
        prof.plan = 'elite'; localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(prof));
      }
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
        const u = await client.query((api as any).users.getUser, { userId });
        if (cancelled) return;
        setDbUser(u);
        if (!u || !u.found) { setProfileLoaded(true); return; }
        hasHydratedFromDb.current = true;

        if (u.firstName) setFirstName(u.firstName);
        if (u.lastName) setLastName(u.lastName);
        if (u.email) setEmail(u.email);
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
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  function removePic() {
    setProfilePic(null);
    localStorage.removeItem('offerbell_profile_pic');
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
        const u = await client.query((api as any).users.getUser, { userId: uid });
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

  return (
    <div className="app">
      <Sidebar activePage="my-account" />

      <main className="main" style={{padding:'32px 36px'}}>

        {/* Profile Header */}
        <div style={{display:'flex',alignItems:'flex-start',gap:20,marginBottom:32,paddingBottom:32,borderBottom:'1px solid var(--border)'}}>
          <div style={{position:'relative',flexShrink:0}}>
            <input ref={picInputRef} type="file" accept="image/*" onChange={handlePicUpload} style={{display:'none'}} />
            <div
              onClick={() => picInputRef.current?.click()}
              style={{
                width:72,height:72,borderRadius:'50%',
                background:'var(--text)',color:'var(--surface)',
                fontSize:22,fontWeight:700,
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:"'Instrument Serif',serif",
                cursor:'pointer',overflow:'hidden',position:'relative',
              }}
            >
              {profilePic ? (
                <img src={profilePic} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
              ) : initials}
              {/* Pencil overlay */}
              <div style={{
                position:'absolute',bottom:0,left:0,right:0,
                height:24,
                background:'rgba(0,0,0,0.55)',
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </div>
            </div>
            {profilePic && (
              <button onClick={removePic} type="button" title="Remove photo" style={{
                position:'absolute',top:-4,right:-4,
                width:20,height:20,borderRadius:'50%',
                background:'var(--surface)',border:'1.5px solid var(--border)',
                display:'flex',alignItems:'center',justifyContent:'center',
                cursor:'pointer',fontSize:12,color:'var(--text-3)',lineHeight:1,padding:0,
              }}>&times;</button>
            )}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Instrument Serif',serif",fontSize:26,letterSpacing:'-.3px',color:'var(--text)',marginBottom:3}}>{firstName} <em style={{fontStyle:'italic'}}>{lastName}</em></div>
            <div style={{fontSize:13,color:'var(--text-3)',marginBottom:10}}>{email}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {userPlan === 'elite' ? (
                <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'#eff6ff',color:'#1d4ed8',border:'1px solid #93c5fd'}}>Elite Plan</span>
              ) : userPlan === 'pro' ? (
                <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'#ecfdf5',color:'#166534',border:'1px solid #bbf7d0'}}>Pro Plan</span>
              ) : (
                <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'#fef3c7',color:'#92400e',border:'1px solid #fde68a'}}>Free Plan</span>
              )}
              <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'var(--surface-2)',color:'var(--text-2)',border:'1px solid var(--border)'}}>{school}</span>
              <span style={{display:'inline-flex',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:600,background:'var(--surface-2)',color:'var(--text-2)',border:'1px solid var(--border)'}}>{year}</span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
            <button type="button" onClick={async () => {
              // Save all data to cloud before wiping localStorage
              const userId = localStorage.getItem('offerbell_user_id');
              if (userId) {
                const data: Record<string, string> = {};
                for (const key of SYNC_KEYS) { const val = localStorage.getItem(key); if (val !== null) data[key] = val; }
                if (Object.keys(data).length > 0) {
                  const payload = { userId, data: JSON.stringify(data) };
                  // Try React mutation first (uses the working Convex React client)
                  try { if (saveProgressMut) await saveProgressMut(payload); }
                  catch {
                    // Fallback: HTTP client
                    try {
                      const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
                      if (url) { const h = new ConvexHttpClient(url); await h.mutation(api.progress.saveProgress, payload); }
                    } catch {}
                  }
                }
              }
              // Now wipe localStorage
              const keys: string[] = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('offerbell') && k !== 'offerbell-theme') keys.push(k); } keys.forEach(k => localStorage.removeItem(k)); localStorage.removeItem('userId'); document.cookie = 'offerbell_user_id=; path=/; max-age=0'; router.push('/');
            }} style={{background:'var(--surface)',color:'var(--text-2)',padding:'8px 20px',borderRadius:10,fontSize:13,fontWeight:600,border:'1.5px solid var(--border-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Sign Out</button>
          </div>
        </div>

        {/* Usage */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>This Month's Usage<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {(() => {
              const isPro = userPlan === 'pro' || userPlan === 'elite';
              const resumeCount = isPro ? resumeUsed : resumeLifetime;
              const resumeMax = userPlan === 'elite' ? 30 : isPro ? 10 : 1;
              const resumeDisplay = Math.min(resumeCount, resumeMax);
              const resumeRemaining = Math.max(0, resumeMax - resumeCount);
              const owMax = userPlan === 'elite' ? 30 : isPro ? 20 : 5;
              const owLabel = userPlan === 'elite' ? '30/week' : isPro ? '20/week' : '5 total';
              const msgPct = Math.min(100, Math.round(messagesUsed / owMax * 100));
              return [
                {label:'Resume Review', used: resumeDisplay, total: String(resumeMax), pct: Math.min(100, Math.round(resumeCount / resumeMax * 100)), color: resumeRemaining === 0 ? '#dc2626' : 'var(--text)', reset: isPro ? `${resumeRemaining} of ${resumeMax} left this week` : resumeCount >= 1 ? 'Free review used' : '1 free review'},
                {label:'Outreach Messages', used: messagesUsed, total: String(owMax), pct: msgPct, color: 'var(--text)', reset: isPro ? `${owLabel}` : `${Math.max(0, 5 - messagesUsed)} of 5 left`},
                {label:'Contacts Tracked', used: contactsTracked, total: 'Unlimited', pct: 100, color: '#16a34a', reset: 'No limit'},
              ];
            })().map(u=>(
              <div key={u.label} style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:'18px 20px'}}>
                <div style={{fontSize:11,fontWeight:600,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:'.5px',marginBottom:10}}>{u.label}</div>
                <div style={{height:6,background:'var(--surface-2)',borderRadius:3,overflow:'hidden',marginBottom:8}}>
                  <div style={{height:'100%',borderRadius:3,background:u.color,width:barsAnimated?u.pct+'%':'0%',transition:'width 1s cubic-bezier(.4,0,.2,1)'}}/>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                  <div style={{fontSize:18,fontWeight:800,color:u.color,letterSpacing:'-.5px'}}>{u.used}</div>
                  <div style={{fontSize:11,color:'var(--text-3)'}}>of {u.total}</div>
                </div>
                <div style={{fontSize:11,color:'var(--text-3)',marginTop:4}}>{u.reset}</div>
              </div>
            ))}
          </div>
        </div>
{/* Pending plan-change banner. Shown only when the user has
            scheduled a cancel/downgrade that hasn't taken effect yet. */}
        {pendingPlanChange && (
          <div style={{
            marginBottom: 24,
            padding: '14px 18px',
            borderRadius: 12,
            background: 'var(--surface-2, #fff7ed)',
            border: '1.5px solid #fb923c',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                {pendingPlanChange.targetPlan === 'free'
                  ? 'Your subscription is scheduled to cancel'
                  : `Your plan is scheduled to switch to ${pendingPlanChange.targetPlan === 'pro' ? 'Pro' : pendingPlanChange.targetPlan}`}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2, #636160)' }}>
                Effective {new Date(pendingPlanChange.effectiveAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}. You'll keep your current plan until then.
              </div>
            </div>
            <button
              type="button"
              onClick={handleKeepPlan}
              disabled={resumingPlan}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1.5px solid var(--border-2)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: 12,
                fontWeight: 700,
                cursor: resumingPlan ? 'not-allowed' : 'pointer',
                opacity: resumingPlan ? 0.6 : 1,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {resumingPlan ? 'Working…' : 'Keep my plan'}
            </button>
          </div>
        )}
        {/* Profile Form */}
        <div data-tutorial="profile-section" style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Profile<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>First name</label>
              <input style={inp} type="text" value={firstName} onChange={e=>{setFirstName(e.target.value);autoSave();}} placeholder="First name"/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Last name</label>
              <input style={inp} type="text" value={lastName} onChange={e=>{setLastName(e.target.value);autoSave();}} placeholder="Last name"/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Email</label>
              <input style={inp} type="email" value={email} onChange={e=>{setEmail(e.target.value);autoSave();}} placeholder="your@email.com"/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>School</label>
              <select style={inp} value={school} onChange={e=>{setSchool(e.target.value);autoSave();}}>
                <option value="">Select school...</option>
                {school && !SCHOOLS.includes(school) && <option key={school}>{school}</option>}
                {SCHOOLS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Graduation Year</label>
              <select style={inp} value={year} onChange={e=>{setYear(e.target.value);autoSave();}}>
                <option value="">Select year...</option>
                {year && !YEARS.includes(year) && <option key={year}>{year}</option>}
                {YEARS.map(y=><option key={y}>{y}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <label style={{fontSize:12,fontWeight:700,color:'var(--text)'}}>Target Role</label>
              <select style={inp} value={targetRole} onChange={e=>{setTargetRole(e.target.value);autoSave();}}>
                <option value="">Select role...</option>
                {targetRole && !VERTICALS.includes(targetRole) && <option key={targetRole}>{targetRole}</option>}
                {VERTICALS.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div data-tutorial="plan-section" style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Plan & Billing<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          {(userPlan === 'pro' || userPlan === 'elite') ? (
            <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,background: userPlan === 'elite' ? '#1d4ed8' : '#166534',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--text)',marginBottom:2}}>{userPlan === 'elite' ? 'Elite' : 'Pro'} Plan</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>
                    {userPlan === 'elite' ? 'Higher AI limits · 30 resume reviews/week · priority support' : 'Usage-based AI · 10 resume reviews/week · all features'}
                  </div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:4}}>
                    {(() => {
                      if (!planActivatedAt && !promoCode) return null;
                      const fmtDate = (ts: number) => new Date(ts).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
                      const cycleDays = billingCycle === 'annual' ? 365 : billingCycle === '6month' ? 182 : 30;
                      if (promoCode) {
                        const code = promoCode.toLowerCase();
                        if (code.includes('lifetime') || code.includes('forever') || code.includes('free')) return <>Lifetime via code <strong>{promoCode}</strong></>;
                        if (planActivatedAt) return <>Via code <strong>{promoCode}</strong> · Renews {fmtDate(planActivatedAt + cycleDays * 864e5)}</>;
                        return <>Via code <strong>{promoCode}</strong></>;
                      }
                      if (planActivatedAt) return <>Renews {fmtDate(planActivatedAt + cycleDays * 864e5)}</>;
                      return null;
                    })()}
                  </div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
                <div style={{textAlign:'right',marginRight:4}}>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,fontStyle:'italic',color:'var(--text)',letterSpacing:'-.3px'}}>
                    {promoCode && (promoCode.toLowerCase().includes('lifetime') || promoCode.toLowerCase().includes('forever') || promoCode.toLowerCase().includes('free'))
                      ? <>$0</>
                      : billingCycle === 'annual'
                        ? <>{userPlan === 'elite' ? '$384' : '$192'}<span style={{fontSize:12,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/yr</span></>
                        : billingCycle === '6month'
                          ? <>{userPlan === 'elite' ? '$216' : '$108'}<span style={{fontSize:12,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/6mo</span></>
                          : <>{userPlan === 'elite' ? '$40' : '$20'}<span style={{fontSize:12,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/mo</span></>
                    }
                  </div>
                  <div style={{fontSize:10,color:'#16a34a',fontWeight:600}}>Active</div>
                </div>
                <button type="button" onClick={() => window.location.href='/checkout'} style={{background:'var(--text)',color:'var(--surface)',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Manage Plan</button>
              </div>
            </div>
          ) : (
            <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,background:'var(--text)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="20" height="20" fill="none" stroke="var(--surface)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:'var(--text)',marginBottom:2}}>Free Plan</div>
                  <div style={{fontSize:12,color:'var(--text-3)'}}>5 messages · 1 resume review/week · 3 mock interviews/week</div>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:24,fontStyle:'italic',color:'var(--text)',letterSpacing:'-.3px'}}>$0 <span style={{fontSize:13,fontStyle:'normal',fontFamily:"'Sora',sans-serif",color:'var(--text-3)',fontWeight:400}}>/mo</span></div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:2}}>No card required</div>
                </div>
                <button type="button" onClick={() => window.location.href='/checkout'} style={{background:'#f59e0b',color:'#fff',padding:'9px 20px',borderRadius:10,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>View Plans</button>
              </div>
            </div>
          )}
        </div>

        {/* Support */}
        <div style={{marginBottom:28}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>Support<div style={{flex:1,height:1,background:'var(--border)'}}/></div>
          <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:14,padding:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:3}}>Need help?</div>
              <div style={{fontSize:12,color:'var(--text-3)'}}>Reach out to our team for questions, feedback, or partnership inquiries.</div>
            </div>
            <a href="mailto:officialofferbell@gmail.com" style={{background:'var(--surface)',color:'var(--text)',padding:'8px 16px',borderRadius:9,fontSize:12,fontWeight:700,border:'1.5px solid var(--border-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif",whiteSpace:'nowrap',textDecoration:'none'}}>officialofferbell@gmail.com</a>
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
        <div onClick={() => setModal(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)'}}>
          <div onClick={e => e.stopPropagation()} style={{background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:16,padding:'28px',width:380,maxWidth:'90vw',boxShadow:'0 16px 48px rgba(0,0,0,0.12)'}}>
            <div style={{fontSize:16,fontWeight:700,color:'var(--text)',marginBottom:8}}>{modal.title}</div>
            <div style={{fontSize:13,color:'var(--text-3)',lineHeight:1.7,marginBottom:24}}>{modal.desc}</div>
            <div style={{display:'flex',gap:10}}>
              <button type="button" onClick={() => setModal(null)} style={{flex:1,padding:'11px',borderRadius:10,border:'1.5px solid var(--border)',background:'var(--surface)',color:'var(--text)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>Go Back</button>
              <button type="button" onClick={() => { setModal(null); modal.onConfirm(); }} style={{flex:1,padding:'11px',borderRadius:10,border:'none',background:'#dc2626',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>{modal.confirmLabel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
