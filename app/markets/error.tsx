'use client';

import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import './markets.css';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Markets Page Render Error:", error);
  }, [error]);

  return (
    <div className="app">
      <Sidebar activePage="markets" />
      <main className="markets-main">
        <div className="markets-layout">
          <div className="markets-feed-col" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              Database Syncing
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: 15, marginBottom: 24 }}>
              The social feed database schema is currently deploying to your live environment. Please try again in a few moments, or ensure you've run the Convex deploy command.
            </p>
            <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 8, textAlign: 'left', marginBottom: 24, fontSize: 13, color: '#ef4444' }}>
              <code>{error.message || "Function not found / unhandled exception"}</code>
            </div>
            <button 
              onClick={() => reset()}
              style={{
                background: 'var(--text)',
                color: 'var(--surface)',
                padding: '10px 24px',
                borderRadius: 100,
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
