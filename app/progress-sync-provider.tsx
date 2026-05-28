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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('offerbell_user_id'));
  }, []);

  return (
    <>
      {isLoggedIn && <SyncRunner />}
      {children}
    </>
  );
}
