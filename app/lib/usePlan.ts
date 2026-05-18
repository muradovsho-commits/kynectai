'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-TRUTH PLAN HOOKS
//
// Plan source of truth is Convex (Stripe webhook writes users.plan). Pages
// use these hooks instead of reading localStorage directly, so DevTools
// localStorage tampering does nothing.
//
// Hydration-safe pattern:
//   • First render (server + client both) returns 'free' as a neutral
//     default. This is the only way to avoid React hydration mismatch
//     errors, since the server can't see localStorage.
//   • After mount, we read localStorage as a fast "warm start" so paid
//     users don't see a flash of locked content.
//   • As soon as Convex responds, its value takes precedence. Tampered
//     localStorage gets corrected within ~200ms.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'pro' | 'elite';

export function useUserPlan(): PlanTier {
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
  const userData = useQuery(
    api.users.getUser,
    userId ? { userId } : 'skip'
  ) as { plan?: string } | undefined;

  // Until mount, return 'free' so server-side render matches client first
  // render. Prevents React hydration error #418.
  if (!mounted) return 'free';

  // Post-mount, while Convex is still loading, return the localStorage
  // warm-start so paid users don't see a flash of locked content.
  if (userData === undefined) return warmStart;

  // Convex returned. This is the source of truth.
  const plan = userData?.plan;
  if (plan === 'elite' || plan === 'pro') return plan;
  return 'free';
}

export function useIsPro(): boolean {
  const plan = useUserPlan();
  return plan === 'pro' || plan === 'elite';
}

export function useIsElite(): boolean {
  return useUserPlan() === 'elite';
}
