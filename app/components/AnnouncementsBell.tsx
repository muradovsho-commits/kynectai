'use client';

// ============================================================================
// ANNOUNCEMENTS BELL
// ----------------------------------------------------------------------------
// Reads the announcements feed with a ONE-SHOT HTTP query on mount (same
// pattern as usePlan), never a live useQuery subscription: this renders on
// every page via Topbar, and a live subscription on 30+ pages is exactly the
// chatter that burned the Convex bandwidth tier before. A localStorage cache
// with a short TTL means normal page-to-page navigation costs zero queries.
// Opening the panel marks everything currently shown as read (one mutation).
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

type Item = {
  id: string;
  title: string;
  body: string;
  link: string;
  linkLabel: string;
  createdAt: number;
  read: boolean;
};

const CACHE_KEY = 'offerbell_announcements_cache';
const TTL_MS = 90 * 1000;

function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function AnnouncementsBell() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fetchedAtRef = useRef(0);

  function readCache(): { at: number; userId: string; items: Item[] } | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.items)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function writeCache(next: Item[]) {
    try {
      const userId = localStorage.getItem('offerbell_user_id') || '';
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), userId, items: next }));
    } catch {}
  }

  async function load(force: boolean) {
    if (typeof window === 'undefined') return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;
    if (!force && Date.now() - fetchedAtRef.current < TTL_MS) return;
    fetchedAtRef.current = Date.now();
    let userId = '';
    try { userId = localStorage.getItem('offerbell_user_id') || ''; } catch {}
    try {
      const client = new ConvexHttpClient(url);
      const rows: any = await client.query((api as any).announcements.listForUser, {
        userId: userId || undefined,
      });
      if (!Array.isArray(rows)) return;
      const next: Item[] = rows.map((r: any) => ({
        id: String(r.id),
        title: String(r.title || ''),
        body: String(r.body || ''),
        link: String(r.link || ''),
        linkLabel: String(r.linkLabel || ''),
        createdAt: Number(r.createdAt || 0),
        read: r.read === true,
      }));
      setItems(next);
      writeCache(next);
    } catch {
      // Offline or Convex unreachable: the cached list stays on screen.
    }
  }

  useEffect(() => {
    setMounted(true);
    let currentUser = '';
    try { currentUser = localStorage.getItem('offerbell_user_id') || ''; } catch {}
    const cached = readCache();
    if (cached && cached.userId === currentUser) {
      setItems(cached.items);
      fetchedAtRef.current = cached.at || 0;
    }
    void load(false);
    const onVisible = () => { if (document.visibilityState === 'visible') void load(false); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click-outside close, same behavior as the profile and industry menus.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const unread = items.filter(i => !i.read);

  async function togglePanel() {
    const next = !open;
    setOpen(next);
    if (!next) return;
    void load(false);
    if (unread.length === 0) return;
    let userId = '';
    try { userId = localStorage.getItem('offerbell_user_id') || ''; } catch {}
    // Optimistic: clear the dot right away, then persist.
    const cleared = items.map(i => ({ ...i, read: true }));
    setItems(cleared);
    writeCache(cleared);
    if (!userId) return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;
    try {
      const client = new ConvexHttpClient(url);
      await client.mutation((api as any).announcements.markAllRead, {
        userId,
        announcementIds: unread.map(i => i.id),
      });
    } catch {}
  }

  return (
    <div className="ob-annc" ref={wrapRef}>
      <button
        type="button"
        className={`ob-annc-btn${open ? ' open' : ''}`}
        onClick={togglePanel}
        title="Announcements"
        aria-label="Announcements"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {mounted && unread.length > 0 && <span className="ob-annc-dot" aria-hidden="true" />}
      </button>

      {mounted && open && (
        <div className="ob-annc-panel">
          <div className="ob-annc-head">Announcements</div>
          {items.length === 0 ? (
            <div className="ob-annc-empty">Nothing new right now.</div>
          ) : (
            <div className="ob-annc-list">
              {items.map(it => (
                <div key={it.id} className="ob-annc-item">
                  <div className="ob-annc-meta">{relTime(it.createdAt)}</div>
                  <div className="ob-annc-title">{it.title}</div>
                  <div className="ob-annc-body">{it.body}</div>
                  {it.link && (
                    <a className="ob-annc-link" href={it.link}>
                      {it.linkLabel || 'Read more'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .ob-annc{position:relative;display:inline-flex}
        .ob-annc-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;
          border-radius:9px;background:none;border:1px solid var(--border,#e5e7eb);color:#62748e;cursor:pointer;transition:.12s}
        .ob-annc-btn:hover,.ob-annc-btn.open{background:#f8fafc;color:#1d293d}
        html[data-theme="dark"] .ob-annc-btn{color:#a8a6a3;border-color:#2a2a29}
        html[data-theme="dark"] .ob-annc-btn:hover,html[data-theme="dark"] .ob-annc-btn.open{background:#222221;color:#fff}
        .ob-annc-dot{position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:50%;background:#d97706;
          border:2px solid var(--surface,#fff);box-sizing:content-box}
        html[data-theme="dark"] .ob-annc-dot{border-color:#1a1a19}
        .ob-annc-panel{position:absolute;top:calc(100% + 4px);right:0;width:340px;max-height:70vh;overflow:auto;z-index:75;
          background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:2px;padding:5px;
          box-shadow:0 12px 32px -10px rgba(15,23,42,.22)}
        html[data-theme="dark"] .ob-annc-panel{background:#222221;border-color:#2a2a29}
        .ob-annc-head{font-size:10px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:#90a1b9;padding:8px 11px 7px}
        .ob-annc-empty{padding:6px 11px 14px;font-size:12.5px;color:#90a1b9}
        .ob-annc-list{display:flex;flex-direction:column}
        .ob-annc-item{padding:11px;border-top:1px solid #eef0f2}
        html[data-theme="dark"] .ob-annc-item{border-top-color:#2a2a29}
        .ob-annc-meta{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#90a1b9;margin-bottom:4px}
        .ob-annc-title{font-size:13.5px;font-weight:700;color:#1d293d;line-height:1.3}
        html[data-theme="dark"] .ob-annc-title{color:#fff}
        .ob-annc-body{margin-top:4px;font-size:12.5px;line-height:1.55;color:#45556c;white-space:pre-wrap}
        html[data-theme="dark"] .ob-annc-body{color:#a8a6a3}
        .ob-annc-link{display:inline-block;margin-top:7px;font-size:12px;font-weight:700;color:#2563eb;text-decoration:none}
        .ob-annc-link:hover{text-decoration:underline}
        html[data-theme="dark"] .ob-annc-link{color:#60a5fa}
        /* Anchored to the bell on desktop; on narrow screens the bell sits close
           enough to the left that a right-aligned panel would run off-screen, so
           pin it to the viewport instead (the header is fixed, so this tracks it). */
        @media (max-width:900px){
          .ob-annc-panel{position:fixed;top:54px;left:10px;right:10px;width:auto;max-height:66vh}
        }
      ` }} />
    </div>
  );
}
