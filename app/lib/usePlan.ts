'use client';

import { useEffect, useState } from 'react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-TRUTH PLAN HOOKS
//
// Plan source of truth is Convex (Stripe webhook writes users.plan). The
// hook does a ONE-SHOT HTTP fetch on mount (not a reactive useQuery) and
// mirrors the result to localStorage so legacy code that reads localStorage
// directly converges on the truth.
//
// Why not reactive useQuery: this hook is used on every page (via Sidebar
// at minimum). Each useQuery opens a live subscription that re-downloads
// the entire user record every time ANY field on it changes - and many
// pages run mutations that touch the user record (incrementOutreachCount,
// updateUserProfile, etc.). Multiplied across 8+ pages and a session of
// testing, that subscription chatter blew through the 1GB Convex free tier.
// One-shot HTTP on mount: plan value only changes via Stripe webhook or
// manual Convex edit, neither of which needs live propagation. A page
// refresh picks up the new value.
//
// Hydration-safe: first render (server + client) returns 'free' so the
// rendered HTML matches. After mount, the localStorage warm-start kicks
// in to avoid flashing locked content to paid users. Once the HTTP fetch
// returns, its value takes precedence and writes back to localStorage.
// ─────────────────────────────────────────────────────────────────────────────

export type PlanTier = 'free' | 'pro' | 'elite';

export function useUserPlanStatus(): { plan: PlanTier; isVerified: boolean } {
  const [mounted, setMounted] = useState(false);
  const [warmStart, setWarmStart] = useState<PlanTier>('free');
  const [serverPlan, setServerPlan] = useState<PlanTier | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Warm-start from localStorage so paid users don't flash locked UI.
    let userId: string | null = null;
    try {
      userId = localStorage.getItem('offerbell_user_id');
      const local = localStorage.getItem('offerbell_plan');
      if (local === 'elite' || local === 'pro') setWarmStart(local);
    } catch {}

    if (!userId) return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;

    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const userRow: any = await client.query((api as any).users.getUser, { userId });
        if (cancelled) return;
        const truth = userRow?.plan;
        const planValue: PlanTier = (truth === 'elite' || truth === 'pro') ? truth : 'free';
        setServerPlan(planValue);
        try {
          if (localStorage.getItem('offerbell_plan') !== planValue) {
            localStorage.setItem('offerbell_plan', planValue);
          }
        } catch {}
      } catch {
        // Server unreachable - warm-start localStorage value stays in effect.
        if (!cancelled) setServerPlan(undefined);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Hydration safety: first render must match server (which returns 'free').
  if (!mounted) return { plan: 'free', isVerified: false };

  // Post-mount, while one-shot fetch is in flight, return warm-start value.
  // isVerified stays false so gating logic waits for verified truth.
  if (serverPlan === undefined) return { plan: warmStart, isVerified: false };

  return { plan: serverPlan, isVerified: true };
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
