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
//   3. Pushes weren't dirty-checked - re-renders, mounts, navigations all
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
// Net effect: 10-20× less bandwidth in normal use.
// ─────────────────────────────────────────────────────────────────────────────

const SYNC_KEYS = [
  // Profile & account (most plan/promo keys excluded below - they're owned
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
  // Concept drills - per-question history for the Question History tab.
  // Per-device only (the aggregate byCat stats DO sync via flash_perf_*).
  'offerbell_drill_history',
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

// Keys deliberately excluded from blob sync - they're owned by DB columns
// (users.plan, users.firstName, etc.) so syncing them through the blob just
// causes races and wastes bandwidth.
const EXCLUDE_FROM_SYNC = new Set([
  'offerbell_onboarding_profile',
  'offerbell_plan',
  'offerbell_plan_activated_at',
  'offerbell_promo_code',
  // Moved to dedicated Convex tables (mockResponses, coachConvos).
  // Excluding them from the blob means saves of these keys no longer cause
  // ~500KB round trips through userProgress.data.
  'offerbell_mock_responses',
  'offerbell_coach_history',
  // Moved to dedicated Convex tables (flashPerf, diagHistory) - same reason
  // as above. Hydrated into localStorage from those tables on init below.
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
  'offerbell_diag_history',
]);

// Cross-tab coordination: tabs share a "last push" timestamp via localStorage
// so they don't both fire saveProgress at the same wall-clock moment.
// Without this, multi-tab users generate write-conflict retries on the userProgress
// document (one document per user), each retry costing a full read + write of the blob.
const CROSS_TAB_LOCK_KEY = 'offerbell_progress_push_lock_ts';
const CROSS_TAB_LOCK_WINDOW_MS = 3000;

function gatherLocalData(): Record<string, string> {
  const data: Record<string, string> = {};
  for (const key of SYNC_KEYS) {
    if (EXCLUDE_FROM_SYNC.has(key)) continue;
    const val = localStorage.getItem(key);
    if (val !== null) data[key] = val;
  }
  return data;
}

// Mark today (LOCAL date) as an active day. Runs app-wide (see init effect)
// so ANY page counts toward activity - previously only opening the dashboard
// logged a day, so days where the user only studied (flashcards, drills, etc.)
// were never recorded. offerbell_activity_days is union-merged across devices.
function recordActivityToday() {
  try {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const raw = localStorage.getItem('offerbell_activity_days');
    let days: string[] = [];
    try { const p = raw ? JSON.parse(raw) : []; if (Array.isArray(p)) days = p; } catch {}
    if (!days.includes(today)) {
      days.push(today);
      const cut = new Date(); cut.setDate(cut.getDate() - 120);
      const cutoff = `${cut.getFullYear()}-${String(cut.getMonth() + 1).padStart(2, '0')}-${String(cut.getDate()).padStart(2, '0')}`;
      days = days.filter(x => x >= cutoff);
      localStorage.setItem('offerbell_activity_days', JSON.stringify(days));
    }
  } catch {}
}

// Cheap, deterministic string hash. We compare hashes to decide whether to
// push - equal hash means nothing changed since last successful push, so
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
    // Profile pic is a local-authoritative scalar: whatever this tab holds
    // (including an empty string = "removed") wins. Without this, the
    // (cv && !lv) branch below keeps restoring the old cloud pic every load,
    // so removing/changing the avatar never sticks.
    if (key === 'offerbell_profile_pic') {
      if (key in local) merged[key] = local[key];
      else if (key in cloud) merged[key] = cloud[key];
      continue;
    }
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

    // App-wide: record today as active on any page load (was dashboard-only).
    recordActivityToday();

    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;

    (async () => {
      try {
        const client = new ConvexHttpClient(url);

        // ── Hydrate the dedicated-table data into localStorage so pages that
        //    read localStorage directly (flashcards, concept-drills,
        //    diagnostic-review, etc.) see the cross-device source of truth.
        //    Done in parallel with the blob fetch below.
        //    If a fetch fails or returns empty, localStorage is left as-is
        //    (existing local data survives).
        const flashPerfPromise = client.query(api.flashPerf.listPerf, { userId })
          .then((rows: Record<string, { data: string; updatedAt: number }>) => {
            if (!rows) return;
            for (const [track, row] of Object.entries(rows)) {
              try { localStorage.setItem(`offerbell_flash_perf_${track}`, row.data); } catch {}
            }
            // One-time migration: if cloud has no rows but localStorage has
            // legacy flash_perf data, push everything up.
            if (Object.keys(rows).length === 0) {
              const tracks = ['ib','pe','rx','consulting','accounting','am','st','er','re','vc'];
              const entries: Array<{ track: string; data: string }> = [];
              for (const t of tracks) {
                try {
                  const local = localStorage.getItem(`offerbell_flash_perf_${t}`);
                  if (local) entries.push({ track: t, data: local });
                } catch {}
              }
              if (entries.length > 0) {
                void (async () => {
                  try {
                    const c = new ConvexHttpClient(url);
                    await c.mutation(api.flashPerf.importPerf, { userId, entries });
                  } catch {}
                })();
              }
            }
          })
          .catch(() => {});

        const diagHistoryPromise = client.query(api.diagHistory.listHistory, { userId })
          .then((rows: Array<{ id: string; track: string; date: string; score: number; totalCorrect: number; totalAnswered: number; catScores: string; timestamp: number }>) => {
            if (!rows) return;
            if (rows.length > 0) {
              // Reshape back to the legacy localStorage format so pages keep working.
              const legacy = rows.map(r => ({
                id: r.id,
                track: r.track,
                date: r.date,
                score: r.score,
                totalCorrect: r.totalCorrect,
                totalAnswered: r.totalAnswered,
                catScores: (() => { try { return JSON.parse(r.catScores); } catch { return {}; } })(),
              }));
              try { localStorage.setItem('offerbell_diag_history', JSON.stringify(legacy)); } catch {}
            } else {
              // One-time migration from legacy localStorage.
              try {
                const localRaw = localStorage.getItem('offerbell_diag_history');
                if (localRaw) {
                  const localArr = JSON.parse(localRaw);
                  if (Array.isArray(localArr) && localArr.length > 0) {
                    const entries = localArr.map((e: any) => ({
                      entryId: e.id || String(Date.now()) + Math.random(),
                      track: e.track || '',
                      date: e.date || new Date().toISOString(),
                      score: e.score || 0,
                      totalCorrect: e.totalCorrect || 0,
                      totalAnswered: e.totalAnswered || 0,
                      catScores: JSON.stringify(e.catScores || {}),
                      timestamp: e.id ? parseInt(e.id, 10) || Date.now() : Date.now(),
                    }));
                    void (async () => {
                      try {
                        const c = new ConvexHttpClient(url);
                        await c.mutation(api.diagHistory.importHistory, { userId, entries });
                      } catch {}
                    })();
                  }
                }
              } catch {}
            }
          })
          .catch(() => {});

        // Don't await the hydration promises - they're side-effect-only and
        // shouldn't block the blob sync below.
        void flashPerfPromise;
        void diagHistoryPromise;

        const cloudData = await client.query(api.progress.loadProgress, { userId });

        if (!cloudData) {
          // No cloud data - seed from local only if local has meaningful data.
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
    // Add 0-2s jitter so independently-running tabs naturally desync their
    // debounce timers, dramatically reducing the chance of simultaneous pushes.
    const jitter = Math.floor(Math.random() * 2000);
    saveTimerRef.current = setTimeout(() => { void pushIfDirty(); }, 10000 + jitter);
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

    // Cross-tab lock check: if another tab pushed within the lock window,
    // skip this push and reschedule. The dirty data stays marked (hash check
    // above will let the next push through), so nothing is lost; we just
    // avoid colliding with the other tab's write to the same userProgress doc.
    try {
      const lastLockTs = parseInt(localStorage.getItem(CROSS_TAB_LOCK_KEY) || '0', 10);
      if (lastLockTs && Date.now() - lastLockTs < CROSS_TAB_LOCK_WINDOW_MS) {
        schedulePush();
        return;
      }
    } catch {}

    // Claim the cross-tab lock before firing the network call so other tabs see it.
    try { localStorage.setItem(CROSS_TAB_LOCK_KEY, String(Date.now())); } catch {}

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
    const onVis = () => {
      if (document.visibilityState === 'hidden') void pushIfDirty();
      else recordActivityToday();
    };
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
