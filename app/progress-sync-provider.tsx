'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useProgressSync } from './hooks/useProgressSync';

function SyncRunner() {
  useProgressSync();
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
