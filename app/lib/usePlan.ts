'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-TRUTH PLAN HOOKS
//
// Plan source of truth is Convex (Stripe webhook writes users.plan). The
// hook reads Convex via useQuery and reflects truth in localStorage so legacy
// code that still reads localStorage directly converges on the same value
// within ~200ms of page load.
//
// Hydration-safe: first render (server + client) returns 'free' so the
// rendered HTML matches. After mount, the localStorage warm-start kicks in
// to avoid flashing locked content to paid users. Once Convex returns, its
// value takes precedence.
//
// Pages that GATE access (redirect on free plan) should use the full
// useUserPlanStatus hook so they can wait for isVerified before redirecting -
// otherwise a paid user may briefly read stale localStorage and get sent to
// /checkout incorrectly.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'pro' | 'elite';

export function useUserPlanStatus(): { plan: PlanTier; isVerified: boolean } {
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [warmStart, setWarmStart] = useState<PlanTier>('free');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('offerbell_user_id'));
      try {
        const local = localStorage.getItem('offerbell_plan');
        if (local === 'elite' || local === 'pro') setWarmStart(local);
      } catch {}
    }
  }, []);

  // Convex query - skipped until userId is loaded from localStorage.
  // useQuery returns undefined while loading, then the data once it lands.
  // useQuery is reactive: if Convex updates (Stripe webhook, manual edit,
  // etc.) every page using this hook re-renders with the new value.
  const userData = useQuery(
    api.users.getUser,
    userId ? { userId } : 'skip'
  ) as { plan?: string } | undefined;

  // Whenever Convex returns a verified plan, mirror it to localStorage so
  // legacy code that still reads localStorage directly converges on the
  // truth. This is what corrects localStorage tampering and makes pages
  // that haven't been migrated to this hook still behave correctly within
  // ~200ms of first paint.
  useEffect(() => {
    if (userData === undefined || typeof window === 'undefined') return;
    const truth = userData?.plan;
    const planValue: PlanTier = (truth === 'elite' || truth === 'pro') ? truth : 'free';
    try {
      if (localStorage.getItem('offerbell_plan') !== planValue) {
        localStorage.setItem('offerbell_plan', planValue);
      }
    } catch {}
  }, [userData]);

  // Hydration safety: first render must match server (which returns 'free').
  if (!mounted) return { plan: 'free', isVerified: false };

  // Post-mount, while Convex loads, return warm-start localStorage value.
  // isVerified stays false so gating logic waits for the real value.
  if (userData === undefined) return { plan: warmStart, isVerified: false };

  const plan = userData?.plan;
  if (plan === 'elite' || plan === 'pro') return { plan, isVerified: true };
  return { plan: 'free', isVerified: true };
}

export function useUserPlan(): PlanTier {
  return useUserPlanStatus().plan;
}

export function useIsPro(): boolean {
  const plan = useUserPlan();
  return plan === 'pro' || plan === 'elite';
}

export function useIsElite(): boolean {
  return useUserPlan() === 'elite';
}
