'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useProgressSync } from './hooks/useProgressSync';
import { useActiveTime } from './hooks/useActiveTime';

function SyncRunner() {
  useProgressSync();
  useActiveTime();
  return null;
}

// Shown only while a logged-in user's personalized data is loading onto this
// device. Fixed brand colours (a dark splash) so server and client render
// identically (no hydration mismatch) and it reads as an intentional splash,
// never a logged-out screen.
function HydrationLoader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#0f0f0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: '#fafafa' }}>OfferBell</div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: '2px solid #2a2a2a', borderTopColor: '#fafafa',
        animation: 'ob-spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes ob-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// Personalized app routes where seeing a logged-out / empty flash is jarring.
// Public pages (landing, auth, legal, interview-prep guides, onboarding) are
// intentionally NOT gated, so they render normally and stay SEO-friendly.
const GATED_PREFIXES = [
  '/dashboard', '/outreach-tracker', '/referral-map', '/outreach-writer',
  '/add-contact', '/contact-finder', '/flashcards', '/concept-drills',
  '/diagnostic-review', '/game-mode', '/coach', '/mock-interview', '/reps',
  '/resume-review', '/my-account', '/profile', '/checkout', '/learn', '/ob',
];

export function ProgressSyncProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const isGatedRoute = GATED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));

  // Track the logged-in user reactively. Logout/login is a client-side
  // navigation (no full reload), so a one-time mount check would keep stale
  // state: the sync hook would never re-run its initial hydration after a
  // re-login, leaving drill/flashcard stats and the selected track blank until
  // a manual refresh. Polling localStorage (plus storage/focus events) catches
  // the change, and keying SyncRunner by userId remounts it on any login change
  // so useProgressSync re-runs its hydration for the new session.
  const [userId, setUserId] = useState<string | null>(null);

  // Hydration gate. On a gated route it starts false (server and first client
  // paint agree, so we never paint the empty default), then resolves on mount:
  //   - not logged in, or data already cached locally -> reveal immediately
  //   - logged in but data not on this device yet -> hold the splash until the
  //     cloud blob lands (or a safety timeout), so the user never sees a
  //     logged-out / "User" / empty flash on hard refresh.
  // Public routes are never gated.
  const [ready, setReady] = useState(!isGatedRoute);

  useEffect(() => {
    const read = () => {
      const id = typeof window !== 'undefined' ? localStorage.getItem('offerbell_user_id') : null;
      setUserId(prev => (prev === id ? prev : id));
    };
    read();
    const interval = setInterval(read, 1000);
    window.addEventListener('storage', read);
    window.addEventListener('focus', read);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', read);
      window.removeEventListener('focus', read);
    };
  }, []);

  useEffect(() => {
    if (ready) return;
    const loggedIn = !!localStorage.getItem('offerbell_user_id');
    const hasProfile = !!localStorage.getItem('offerbell_onboarding_profile');
    if (!loggedIn || hasProfile) { setReady(true); return; }
    // Logged in but this device has no cached profile yet: wait for the cloud
    // blob to land before revealing the app.
    const done = () => setReady(true);
    window.addEventListener('offerbell-progress-hydrated', done);
    const t = setTimeout(done, 6000); // safety net so it can never hang
    return () => { window.removeEventListener('offerbell-progress-hydrated', done); clearTimeout(t); };
  }, [ready]);

  return (
    <>
      {userId && <SyncRunner key={userId} />}
      {ready ? children : <HydrationLoader />}
    </>
  );
}
