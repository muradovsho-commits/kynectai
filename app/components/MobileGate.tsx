'use client';
import { useState, useEffect } from 'react';

export default function MobileGate({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => window.innerWidth < 768;
    setIsMobile(check());
    setChecked(true);
    const handleResize = () => setIsMobile(check());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!checked) return null;

  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0c0c0c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
      }}>
        <div style={{ maxWidth: 380, textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '32px',
            color: '#fff',
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}>
            OfferBell<em style={{ fontStyle: 'italic' }}>.</em>
          </div>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '24px auto 20px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '12px',
            fontFamily: "'Sora', sans-serif",
          }}>
            Desktop Experience Only
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}>
            OfferBell is built for focused work sessions - outreach, interview prep, and career planning. Open it on your laptop or desktop for the full experience.
          </div>
          <a href="/" style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: '10px',
            border: '1.5px solid rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: "'Sora', sans-serif",
          }}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
