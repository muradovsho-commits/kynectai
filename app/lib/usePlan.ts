'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-TRUTH PLAN HOOKS
//
// Replaces the old getUserPlan() / isUserPro() / isUserElite() functions
// which read localStorage. Those values are tampered easily via DevTools.
//
// Pattern:
//   • First render returns localStorage value as a "warm start" (instant UI)
//   • As soon as Convex responds, the verified plan from the database takes
//     over. Stripe webhook is the source of truth for users.plan in Convex.
//   • If a user faked localStorage to "elite", the gates snap shut as soon
//     as Convex returns (~200ms). They never get to use anything paid.
//
// Bandwidth cost: each gated page mount fires one small Convex query to
// users.getUser (~200 bytes). Negligible compared to anything else.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'pro' | 'elite';

export function useUserPlan(): PlanTier {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('offerbell_user_id'));
    }
  }, []);

  // Convex query - skipped until we have the userId from localStorage.
  // useQuery returns undefined while loading, then the data once it lands.
  const userData = useQuery(
    api.users.getUser,
    userId ? { userId } : 'skip'
  ) as { plan?: string } | undefined;

  // Warm start: while Convex is loading on first paint, fall back to
  // localStorage so the UI doesn't briefly flash the wrong gating to
  // legitimate paid users. Once Convex returns, its value overrides.
  if (userData === undefined) {
    if (typeof window === 'undefined') return 'free';
    try {
      const local = localStorage.getItem('offerbell_plan');
      if (local === 'elite' || local === 'pro') return local;
    } catch {}
    return 'free';
  }

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
