'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PLAN_LIMITS } from '../lib/plan';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

function AddContactInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState<'saving' | 'saved' | 'duplicate' | 'error' | 'limit'>('saving');
  const [contactName, setContactName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const fname = params.get('fname') || '';
        const lname = params.get('lname') || '';
        const email = params.get('email') || '';
        const firm = params.get('firm') || '';
        const role = params.get('role') || '';
        const contactStatus = params.get('status') || 'drafted';
        const notes = params.get('notes') || '';

        if (!fname && !lname) {
          setStatus('error');
          return;
        }

        setContactName(`${fname} ${lname}`.trim());

        const uid = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_user_id') || '') : '';
        const tok = typeof window !== 'undefined' ? (localStorage.getItem('offerbell_session') || undefined) : undefined;
        const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
        if (!uid || !url) { setStatus('error'); return; }
        const client = new ConvexHttpClient(url);

        // Load existing contacts from the server (for duplicate + plan-cap checks)
        let contacts: any[] = [];
        try {
          const row: any = await client.query(api.outreachTracker.getTracker, { userId: uid, sessionToken: tok });
          if (row && row.data) { const p = JSON.parse(row.data); if (Array.isArray(p)) contacts = p; }
        } catch {}

        // Check for duplicate (by name or email)
        const isDuplicate = contacts.some(c => {
          const nameMatch = c.fname?.toLowerCase() === fname.toLowerCase() &&
                           c.lname?.toLowerCase() === lname.toLowerCase();
          const emailMatch = email && c.email?.toLowerCase() === email.toLowerCase();
          return nameMatch || emailMatch;
        });

        if (isDuplicate) {
          setStatus('duplicate');
          return;
        }

        // Free plan: enforce the same contact cap the tracker uses
        const plan = (localStorage.getItem('offerbell_plan') || 'free').toLowerCase();
        if (plan !== 'pro' && plan !== 'elite' && contacts.length >= PLAN_LIMITS.outreachContacts.free) {
          setStatus('limit');
          return;
        }

        // Create new contact matching the tracker's Contact type
        const newContact = {
          id: `ext_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          fname,
          lname,
          email,
          firm,
          role,
          status: contactStatus,
          angle: '',
          notes,
          quality: 'medium',
          createdAt: Date.now(),
          lastContact: contactStatus === 'sent' || contactStatus === 'spoken' ? Date.now() : null,
          source: 'gmail-extension',
        };

        await client.mutation(api.outreachTracker.appendContacts, { userId: uid, sessionToken: tok, contacts: JSON.stringify([newContact]) });
        setStatus('saved');

      } catch (err) {
        console.error('Error saving contact:', err);
        setStatus('error');
      }
    })();
  }, [params]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc, #eef2ff)',
      fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '40px 48px',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        maxWidth: 400,
        width: '90%',
      }}>
        {status === 'saving' && (
          <>
            <div style={{ fontSize: 36, marginBottom: 12 }}></div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1e293b' }}>Adding contact...</div>
          </>
        )}

        {status === 'saved' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#eff6ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              {contactName} added!
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              Contact has been saved to your Outreach Tracker.
            </div>
            <a
              href="/outreach-tracker"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Open Outreach Tracker
            </a>
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              You can close this tab.
            </div>
          </>
        )}

        {status === 'duplicate' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fef3c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              Already in your tracker
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              <strong>{contactName}</strong> is already in your Outreach Tracker.
            </div>
            <a
              href="/outreach-tracker"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Open Outreach Tracker
            </a>
          </>
        )}

        {status === 'limit' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fef3c7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              Contact limit reached
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              The free plan holds up to {PLAN_LIMITS.outreachContacts.free} contacts. Upgrade to add unlimited contacts to your Outreach Tracker.
            </div>
            <a
              href="/checkout"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: '#2563eb',
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Upgrade
            </a>
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
              You can close this tab.
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fef2f2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              Something went wrong
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              Missing contact information. Make sure a name was provided.
            </div>
            <button
              onClick={() => window.close()}
              style={{
                padding: '10px 24px',
                background: '#f1f5f9',
                color: '#475569',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AddContactPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#64748b' }}>Loading...</div>
      </div>
    }>
      <AddContactInner />
    </Suspense>
  );
}
