'use client';

import { useEffect, useRef } from 'react';
import { useMutation } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

// ─────────────────────────────────────────────────────────────────────────────
// Bandwidth-conscious progress sync.
//
// Previous version burned ~850MB/week with two users because:
//   1. A 10s setInterval pushed the full blob every 10s on every open tab,
//      even when nothing had changed.
//   2. useQuery(loadProgress) opened a live reactive subscription that
//      re-received the full blob every time anyone called saveProgress.
//   3. Pushes weren't dirty-checked — re-renders, mounts, navigations all
//      generated full-blob round trips.
//
// This rewrite:
//   • Removes the periodic interval entirely. Pushes happen only when a
//     SYNC_KEY actually changes (via intercepted setItem).
//   • Replaces useQuery with a one-time HTTP fetch on mount. After the
//     initial merge, no live subscription stays open.
//   • Hashes the gathered data and only pushes when the hash differs from
//     the last successful push.
//   • Pushes are debounced 10s so bursts of edits coalesce into one push.
//   • Single beforeunload flush via sendBeacon (no double-push).
//
// Net effect: 10–20× less bandwidth in normal use.
// ─────────────────────────────────────────────────────────────────────────────

const SYNC_KEYS = [
  // Profile & account (most plan/promo keys excluded below — they're owned
  // by the users table now)
  'offerbell_plan',
  'offerbell_plan_activated_at',
  'offerbell_plan_migrated_v2',
  'offerbell_billing_cycle',
  'offerbell_promo_code',
  'offerbell_profile_pic',
  'offerbell_account_created',
  'offerbell_tutorial_complete',
  'offerbell_tutorial_step',
  'offerbell-theme',
  // Flashcard progress
  'offerbell_flash_perf_ib',
  'offerbell_flash_perf_pe',
  'offerbell_flash_perf_rx',
  'offerbell_flash_perf_consulting',
  'offerbell_flash_perf_accounting',
  'offerbell_flash_perf_am',
  'offerbell_flash_perf_st',
  'offerbell_flash_perf_er',
  'offerbell_flash_perf_re',
  'offerbell_flash_perf_vc',
  'offerbell_flash_bookmarks',
  'offerbell_flash_review',
  'offerbell_flash_review_log',
  // Diagnostic
  'offerbell_diag_history',
  // Mock interview
  'offerbell_mock_responses',
  'offerbell_mock_weekly',
  // Outreach
  'offerbell_tracker_v3',
  'offerbell_tracker_config',
  'offerbell_tracker_seeded',
  'offerbell_saved_messages',
  'offerbell_messages_sent',
  'offerbell_outreach_weekly',
  'offerbell_dismissed_reminders',
  // Referral map
  'offerbell_referral_nodes_v3',
  // Resume
  'offerbell_resume_usage',
  'offerbell_resume_reviews',
  // Coach
  'offerbell_coach_history',
  'offerbell_coach_pro_usage',
  'offerbell_coach_weekly',
  // Activity / usage
  'offerbell_activity_days',
  'offerbell_searches_used',
  'offerbell_game_scores',
  'offerbell_feedback_history',
];

// Keys deliberately excluded from blob sync — they're owned by DB columns
// (users.plan, users.firstName, etc.) so syncing them through the blob just
// causes races and wastes bandwidth.
const EXCLUDE_FROM_SYNC = new Set([
  'offerbell_onboarding_profile',
  'offerbell_plan',
  'offerbell_plan_activated_at',
  'offerbell_promo_code',
]);

function gatherLocalData(): Record<string, string> {
  const data: Record<string, string> = {};
  for (const key of SYNC_KEYS) {
    if (EXCLUDE_FROM_SYNC.has(key)) continue;
    const val = localStorage.getItem(key);
    if (val !== null) data[key] = val;
  }
  return data;
}

// Cheap, deterministic string hash. We compare hashes to decide whether to
// push — equal hash means nothing changed since last successful push, so
// we skip the network call entirely.
function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h.toString(36);
}

function applyCloudData(cloud: Record<string, string>) {
  for (const [key, val] of Object.entries(cloud)) {
    if (EXCLUDE_FROM_SYNC.has(key)) continue;
    if (val !== null && val !== undefined) {
      localStorage.setItem(key, val);
    }
  }
}

const ARRAY_KEYS = new Set([
  'offerbell_activity_days',
  'offerbell_flash_bookmarks',
  'offerbell_diag_history',
  'offerbell_flash_review',
  'offerbell_flash_review_log',
  'offerbell_mock_responses',
  'offerbell_saved_messages',
  'offerbell_tracker_v3',
  'offerbell_referral_nodes_v3',
  'offerbell_dismissed_reminders',
  'offerbell_resume_reviews',
  'offerbell_feedback_history',
  'offerbell_game_scores',
]);

function mergeBlobs(cloud: Record<string, string>, local: Record<string, string>): Record<string, string> {
  const merged: Record<string, string> = { ...cloud };
  for (const key of SYNC_KEYS) {
    if (EXCLUDE_FROM_SYNC.has(key)) continue;
    const cv = cloud[key];
    const lv = local[key];
    if (!cv && lv) merged[key] = lv;
    else if (cv && !lv) { /* keep cloud */ }
    else if (cv && lv) {
      if (ARRAY_KEYS.has(key)) {
        try {
          const ca = JSON.parse(cv);
          const la = JSON.parse(lv);
          if (Array.isArray(ca) && Array.isArray(la)) {
            const hasIds = ca.length > 0 && typeof ca[0] === 'object' && ca[0] !== null && ('id' in ca[0] || 'q' in ca[0]);
            if (hasIds) {
              const idKey = 'id' in (ca[0] || {}) ? 'id' : 'q';
              const seen = new Set<string>();
              const combined: any[] = [];
              for (const item of [...la, ...ca]) {
                const k = item[idKey];
                if (k && !seen.has(k)) { seen.add(k); combined.push(item); }
              }
              merged[key] = JSON.stringify(combined);
            } else if (key === 'offerbell_activity_days') {
              const combined = [...new Set([...ca, ...la])];
              merged[key] = JSON.stringify(combined);
            } else {
              merged[key] = la.length >= ca.length ? lv : cv;
            }
          }
        } catch {
          merged[key] = (lv.length >= cv.length) ? lv : cv;
        }
      } else if (key.startsWith('offerbell_flash_perf_')) {
        try {
          const cp = JSON.parse(cv);
          const lp = JSON.parse(lv);
          merged[key] = (lp.seen || 0) >= (cp.seen || 0) ? lv : cv;
        } catch {
          merged[key] = lv;
        }
      } else {
        merged[key] = lv;
      }
    }
  }
  return merged;
}

export function useProgressSync() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('offerbell_user_id') : null;
  const saveProgress = useMutation(api.progress.saveProgress);

  const hasSyncedRef = useRef(false);
  const lastPushedHashRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPushingRef = useRef(false);
  const userIdRef = useRef<string | null>(userId);
  userIdRef.current = userId;

  // ── Initial sync (one-time HTTP fetch, not a live subscription) ──────────
  useEffect(() => {
    if (!userId || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;

    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const cloudData = await client.query(api.progress.loadProgress, { userId });

        if (!cloudData) {
          // No cloud data — seed from local only if local has meaningful data.
          const local = gatherLocalData();
          const localStr = JSON.stringify(local);
          if (Object.keys(local).length > 2) {
            await saveProgress({ userId, data: localStr });
            lastPushedHashRef.current = hashString(localStr);
          }
          return;
        }

        let cloud: Record<string, string> = {};
        try { cloud = JSON.parse(cloudData.data); } catch {}
        const local = gatherLocalData();
        const merged = mergeBlobs(cloud, local);

        applyCloudData(merged);

        const mergedStr = JSON.stringify(merged);
        const cloudHash = hashString(cloudData.data);
        const mergedHash = hashString(mergedStr);
        // Only push if the merge actually produced something different
        // from what's already in cloud. Saves a round trip in the common
        // case where local is empty and cloud is the source of truth.
        if (mergedHash !== cloudHash) {
          await saveProgress({ userId, data: mergedStr });
        }
        lastPushedHashRef.current = mergedHash;
      } catch (e) {
        console.error('[useProgressSync] initial sync failed:', e);
      }
    })();
  }, [userId, saveProgress]);

  // ── Push routine: schedule (debounced) and execute (dirty-checked) ───────
  function schedulePush() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { void pushIfDirty(); }, 10000);
  }

  async function pushIfDirty() {
    const uid = userIdRef.current;
    if (!uid || isPushingRef.current) return;
    if (!hasSyncedRef.current) return;
    const local = gatherLocalData();
    if (Object.keys(local).length === 0) return;
    const localStr = JSON.stringify(local);
    const localHash = hashString(localStr);
    if (localHash === lastPushedHashRef.current) return;
    isPushingRef.current = true;
    try {
      await saveProgress({ userId: uid, data: localStr });
      lastPushedHashRef.current = localHash;
    } catch (e) {
      console.error('[useProgressSync] push failed:', e);
    } finally {
      isPushingRef.current = false;
    }
  }

  // ── Detect mutations: intercept setItem + listen for storage events ──────
  useEffect(() => {
    if (!userId) return;
    const origSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key: string, value: string) {
      origSetItem(key, value);
      if (SYNC_KEYS.includes(key) && !EXCLUDE_FROM_SYNC.has(key)) {
        schedulePush();
      }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key && SYNC_KEYS.includes(e.key) && !EXCLUDE_FROM_SYNC.has(e.key)) {
        schedulePush();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      localStorage.setItem = origSetItem;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ── Flush on tab hide/unload ─────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const flushBeacon = () => {
      const uid = userIdRef.current;
      if (!uid) return;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      const local = gatherLocalData();
      if (Object.keys(local).length === 0) return;
      const localStr = JSON.stringify(local);
      const localHash = hashString(localStr);
      if (localHash === lastPushedHashRef.current) return;
      try {
        const blob = new Blob([JSON.stringify({ userId: uid, data: localStr })], { type: 'application/json' });
        navigator.sendBeacon('/api/progress-save', blob);
        lastPushedHashRef.current = localHash;
      } catch {}
    };
    const onVis = () => { if (document.visibilityState === 'hidden') void pushIfDirty(); };
    window.addEventListener('beforeunload', flushBeacon);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('beforeunload', flushBeacon);
      document.removeEventListener('visibilitychange', onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { pushToCloud: () => schedulePush() };
}
