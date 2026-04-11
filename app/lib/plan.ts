/**
 * Check if user currently has Pro access.
 * Simple check — cancellation is instant, no delayed expiry.
 */
export function isUserPro(): boolean {
  if (typeof window === 'undefined') return false;

  const plan = localStorage.getItem('offerbell_plan') || 'free';
  if (plan === 'pro') return true;

  try {
    const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
    if (prof.plan === 'pro') return true;
  } catch {}

  return false;
}
