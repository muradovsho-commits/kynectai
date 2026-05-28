'use client';

import { useEffect, useRef } from 'react';

// Tracks the user's active time across the entire app. Mounted once globally
// from progress-sync-provider so it runs on every authenticated page.
//
// Storage: offerbell_active_minutes = { "2026-05-28": 47.5, "2026-05-27": 12, ... }
//   - One entry per local-time day, value is cumulative minutes
//   - Pruned to last 60 days
//   - Pure localStorage, not in the blob sync (limitation: per-device only)
//
// Counts a tick only when document.visibilityState === 'visible' AND the
// window has focus. So minimized tabs, background tabs, and "left the app
// open while doing something else" don't inflate the count.

const STORAGE_KEY = 'offerbell_active_minutes';
const TICK_INTERVAL_MS = 30_000;   // tick every 30s
const TICK_MINUTES = 0.5;          // ...so each tick = 0.5 minutes
const KEEP_DAYS = 60;

function localDateStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return {};
}

function saveMap(map: Record<string, number>): void {
  // Prune entries older than KEEP_DAYS so storage doesn't grow forever.
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - KEEP_DAYS);
  cutoff.setHours(0, 0, 0, 0);
  const cutoffStr = localDateStr(cutoff);
  const pruned: Record<string, number> = {};
  for (const [k, v] of Object.entries(map)) {
    if (typeof v === 'number' && k >= cutoffStr) pruned[k] = v;
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned)); } catch {}
}

function isActiveNow(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.visibilityState !== 'visible') return false;
  if (typeof document.hasFocus === 'function' && !document.hasFocus()) return false;
  return true;
}

function tick(): void {
  if (!isActiveNow()) return;
  const today = localDateStr();
  const map = loadMap();
  map[today] = (map[today] || 0) + TICK_MINUTES;
  saveMap(map);
}

export function useActiveTime(): void {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // First tick on mount counts the user's arrival.
    tick();
    intervalRef.current = setInterval(tick, TICK_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
}
