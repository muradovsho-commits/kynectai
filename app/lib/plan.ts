/**
 * Plan tiers: 'free' | 'pro' | 'elite'
 * Existing 'pro' users (before 3-tier update) are auto-promoted to 'elite'.
 */

export type PlanTier = 'free' | 'pro' | 'elite';

// ══════════════════════════════════════════════════════════════
// PLAN LIMITS - single source of truth
// ══════════════════════════════════════════════════════════════

export const PLAN_LIMITS = {
  flashcards: { free: 0.1, pro: 1, elite: 1 },          // fraction of cards per track
  conceptDrillQs: { free: 5, pro: 999, elite: 999 },     // questions per drill session
  diagnosticTracks: { free: 1, pro: 999, elite: 999 },   // number of tracks available
  interviewPrepGuides: { free: false, pro: true, elite: true },
  outreachContacts: { free: 5, pro: 999, elite: 999 },   // max contacts in tracker
  referralContacts: { free: 5, pro: 999, elite: 999 },   // max contacts in referral map
  outreachWriter: { free: 5, pro: 20, elite: 30 },       // messages per week (free = total lifetime)
  outreachWriterIsLifetime: { free: true, pro: false, elite: false },
  resumeReview: { free: 1, pro: 10, elite: 30 },         // per week
  resumeChat: { free: 3, pro: 20, elite: 40 },           // follow-up chat msgs per week
  coach: { free: 1, pro: 40, elite: 80 },                // per week (free), tokens per window (pro/elite)
  mockInterview: { free: 3, pro: 999, elite: 999 },      // per week
  infiniteDrills: { free: 0, pro: 1500, elite: 4000 },   // free=0 => Pro-gated; weekly cap on paid
} as const;

// ══════════════════════════════════════════════════════════════
// WEEKLY USAGE HELPERS
// ══════════════════════════════════════════════════════════════

/** Returns ISO string for Monday of current week at 00:00 UTC */
export function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = 0
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

/**
 * Generic weekly usage tracker.
 * Key format: offerbell_{feature}_usage
 * Value: { week: string, count: number }
 */
export function getWeeklyUsage(feature: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(`offerbell_${feature}_weekly`);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data.week !== getWeekStart()) {
      // New week, reset
      localStorage.setItem(`offerbell_${feature}_weekly`, JSON.stringify({ week: getWeekStart(), count: 0 }));
      return 0;
    }
    return data.count || 0;
  } catch { return 0; }
}

export function incrementWeeklyUsage(feature: string): number {
  const week = getWeekStart();
  const current = getWeeklyUsage(feature);
  const next = current + 1;
  localStorage.setItem(`offerbell_${feature}_weekly`, JSON.stringify({ week, count: next }));
  return next;
}

export function getLimit(feature: keyof typeof PLAN_LIMITS, plan?: PlanTier): number | boolean {
  const p = plan || getUserPlan();
  const limits = PLAN_LIMITS[feature] as Record<string, number | boolean>;
  return limits[p];
}

// ══════════════════════════════════════════════════════════════
// PLAN DETECTION
// ══════════════════════════════════════════════════════════════

export function getUserPlan(): PlanTier {
  if (typeof window === 'undefined') return 'free';

  const plan = localStorage.getItem('offerbell_plan') || 'free';

  // Migrate: old pro users before 3-tier system -> elite
  const migrated = localStorage.getItem('offerbell_plan_migrated_v2');
  if (!migrated && plan === 'pro') {
    const activatedAt = localStorage.getItem('offerbell_plan_activated_at');
    if (activatedAt) {
      localStorage.setItem('offerbell_plan', 'elite');
      localStorage.setItem('offerbell_plan_migrated_v2', 'true');
      try {
        const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
        prof.plan = 'elite';
        localStorage.setItem('offerbell_onboarding_profile', JSON.stringify(prof));
      } catch {}
      return 'elite';
    }
    localStorage.setItem('offerbell_plan_migrated_v2', 'true');
  }

  if (plan === 'pro' || plan === 'elite') return plan as PlanTier;

  try {
    const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
    if (prof.plan === 'pro' || prof.plan === 'elite') return prof.plan as PlanTier;
  } catch {}

  return 'free';
}

export function isUserPro(): boolean {
  const plan = getUserPlan();
  return plan === 'pro' || plan === 'elite';
}

export function isUserElite(): boolean {
  return getUserPlan() === 'elite';
}
