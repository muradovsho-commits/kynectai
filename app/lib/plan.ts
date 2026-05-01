/**
 * Plan tiers: 'free' | 'pro' | 'elite'
 * Existing 'pro' users (before 3-tier update) are auto-promoted to 'elite'.
 */

export type PlanTier = 'free' | 'pro' | 'elite';

export function getUserPlan(): PlanTier {
  if (typeof window === 'undefined') return 'free';

  const plan = localStorage.getItem('offerbell_plan') || 'free';

  // Migrate: old pro users before 3-tier system → elite
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
