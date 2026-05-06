'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

// All localStorage keys that should sync across devices/sessions
const SYNC_KEYS = [
  // Profile & account
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
  // Flashcard progress (per track)
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
  // Diagnostic review
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
  // Resume review
  'offerbell_resume_usage',
  'offerbell_resume_reviews',
  // Coach
  'offerbell_coach_history',
  'offerbell_coach_pro_usage',
  'offerbell_coach_weekly',
  // Activity
  'offerbell_activity_days',
  // Usage tracking
  'offerbell_searches_used',
  'offerbell_game_scores',
  'offerbell_feedback_history',
];

function gatherLocalData(): Record<string, string> {
  const data: Record<string, string> = {};
  for (const key of SYNC_KEYS) {
    const val = localStorage.getItem(key);
    if (val !== null) data[key] = val;
  }
  return data;
}

function applyCloudData(cloud: Record<string, string>) {
  for (const [key, val] of Object.entries(cloud)) {
    if (val !== null && val !== undefined) {
      localStorage.setItem(key, val);
    }
  }
}

export function useProgressSync() {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('offerbell_user_id') : null;
  const saveProgress = useMutation(api.progress.saveProgress);
  const cloudData = useQuery(api.progress.loadProgress, userId ? { userId } : 'skip');
  const hasSynced = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // On mount: pull cloud data and merge into localStorage
  useEffect(() => {
    if (!userId || hasSynced.current || cloudData === undefined) return;
    hasSynced.current = true;

    if (cloudData === null) {
      // No cloud data yet — push local data up as initial seed
      const local = gatherLocalData();
      if (Object.keys(local).length > 0) {
        saveProgress({ userId, data: JSON.stringify(local) }).catch(() => {});
      }
      return;
    }

    // Cloud data exists — merge
    try {
      const cloud: Record<string, string> = JSON.parse(cloudData.data);
      const local = gatherLocalData();

      // For each key: if cloud has it and local doesn't, use cloud.
      // If both have it, use whichever has more data (longer string = more progress).
      // Special merge for array-type keys (activity days, bookmarks, responses, etc.)
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

      const merged: Record<string, string> = { ...cloud };

      for (const key of SYNC_KEYS) {
        const cloudVal = cloud[key];
        const localVal = local[key];

        if (!cloudVal && localVal) {
          merged[key] = localVal;
        } else if (cloudVal && !localVal) {
          // Cloud has it, local doesn't — use cloud
        } else if (cloudVal && localVal) {
          // Both have it — merge intelligently
          if (ARRAY_KEYS.has(key)) {
            // Merge arrays by combining unique entries
            try {
              const cloudArr = JSON.parse(cloudVal);
              const localArr = JSON.parse(localVal);
              if (Array.isArray(cloudArr) && Array.isArray(localArr)) {
                // For arrays of objects with id fields, dedupe by id
                const hasIds = cloudArr.length > 0 && typeof cloudArr[0] === 'object' && cloudArr[0] !== null && ('id' in cloudArr[0] || 'q' in cloudArr[0]);
                if (hasIds) {
                  const idKey = 'id' in (cloudArr[0] || {}) ? 'id' : 'q';
                  const seen = new Set<string>();
                  const combined = [];
                  for (const item of [...localArr, ...cloudArr]) {
                    const k = item[idKey];
                    if (k && !seen.has(k)) { seen.add(k); combined.push(item); }
                  }
                  merged[key] = JSON.stringify(combined);
                } else if (key === 'offerbell_activity_days') {
                  // String array — union
                  const combined = [...new Set([...cloudArr, ...localArr])];
                  merged[key] = JSON.stringify(combined);
                } else {
                  // Use whichever is longer
                  merged[key] = localArr.length >= cloudArr.length ? localVal : cloudVal;
                }
              }
            } catch {
              // If parse fails, use longer
              merged[key] = (localVal.length >= cloudVal.length) ? localVal : cloudVal;
            }
          } else if (key.startsWith('offerbell_flash_perf_')) {
            // Perf objects — use whichever has more "seen"
            try {
              const cloudPerf = JSON.parse(cloudVal);
              const localPerf = JSON.parse(localVal);
              merged[key] = (localPerf.seen || 0) >= (cloudPerf.seen || 0) ? localVal : cloudVal;
            } catch {
              merged[key] = localVal;
            }
          } else {
            // Simple values — prefer local (user's current device is "truth")
            merged[key] = localVal;
          }
        }
      }

      // Apply merged data to localStorage
      applyCloudData(merged);

      // Push merged data back to cloud
      saveProgress({ userId, data: JSON.stringify(merged) }).catch(() => {});
    } catch {
      // If anything fails, don't break — just push local data
      const local = gatherLocalData();
      if (Object.keys(local).length > 0) {
        saveProgress({ userId, data: JSON.stringify(local) }).catch(() => {});
      }
    }
  }, [userId, cloudData, saveProgress]);

  // Debounced save: call this whenever localStorage changes
  const pushToCloud = useCallback(() => {
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const local = gatherLocalData();
      if (Object.keys(local).length > 0) {
        saveProgress({ userId, data: JSON.stringify(local) }).catch(() => {});
      }
    }, 2000); // 2 second debounce
  }, [userId, saveProgress]);

  // Force push on mount + every 10 seconds while active
  useEffect(() => {
    if (!userId) return;
    // Immediate push on mount (catches data that existed before sync was set up)
    const immediate = setTimeout(() => {
      const local = gatherLocalData();
      if (Object.keys(local).length > 2) { // more than just user_id + theme
        saveProgress({ userId, data: JSON.stringify(local) }).catch(() => {});
      }
    }, 1000);

    // Periodic push every 10 seconds
    const interval = setInterval(() => {
      const local = gatherLocalData();
      if (Object.keys(local).length > 2) {
        saveProgress({ userId, data: JSON.stringify(local) }).catch(() => {});
      }
    }, 10000);

    // Push before tab close
    const beforeUnload = () => {
      const local = gatherLocalData();
      if (Object.keys(local).length > 2) {
        // Use sendBeacon to a simple API endpoint for reliability
        try {
          const blob = new Blob([JSON.stringify({ userId, data: JSON.stringify(local) })], { type: 'application/json' });
          navigator.sendBeacon('/api/progress-save', blob);
        } catch {}
        // Also try direct Convex as backup
        saveProgress({ userId, data: JSON.stringify(local) }).catch(() => {});
      }
    };
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [userId, saveProgress]);

  // Listen for localStorage changes (from other parts of the app)
  useEffect(() => {
    if (!userId) return;

    const handler = (e: StorageEvent) => {
      if (e.key && SYNC_KEYS.includes(e.key)) {
        pushToCloud();
      }
    };
    window.addEventListener('storage', handler);

    // Also intercept localStorage.setItem to catch same-tab writes
    const origSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key: string, value: string) {
      origSetItem(key, value);
      if (SYNC_KEYS.includes(key)) {
        pushToCloud();
      }
    };

    return () => {
      window.removeEventListener('storage', handler);
      localStorage.setItem = origSetItem;
    };
  }, [userId, pushToCloud]);

  return { pushToCloud };
}
