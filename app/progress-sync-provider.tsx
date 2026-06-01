'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useProgressSync } from './hooks/useProgressSync';
import { useActiveTime } from './hooks/useActiveTime';

function SyncRunner() {
  useProgressSync();
  useActiveTime();
  return null;
}

export function ProgressSyncProvider({ children }: { children: ReactNode }) {
  // Track the logged-in user reactively. Logout/login is a client-side
  // navigation (no full reload), so a one-time mount check would keep stale
  // state: the sync hook would never re-run its initial hydration after a
  // re-login, leaving drill/flashcard stats and the selected track blank until
  // a manual refresh. Polling localStorage (plus storage/focus events) catches
  // the change, and keying SyncRunner by userId remounts it on any login change
  // so useProgressSync re-runs its hydration for the new session.
  const [userId, setUserId] = useState<string | null>(null);

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

  return (
    <>
      {userId && <SyncRunner key={userId} />}
      {children}
    </>
  );
}
