'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';

const SAMPLE_FIRMS = [
  { name: 'Goldman Sachs', logo: 'GS', color: '#0c0c0c' },
  { name: 'Morgan Stanley', logo: 'MS', color: '#003580' },
  { name: 'J.P. Morgan', logo: 'JP', color: '#003087' },
  { name: 'Evercore', logo: 'EV', color: '#8B0000' },
  { name: 'Blackstone', logo: 'BX', color: '#1a1a2e' },
  { name: 'McKinsey', logo: 'McK', color: '#1b1b1b' },
  { name: 'Bain & Co.', logo: 'BN', color: '#8B0000' },
  { name: 'Lazard', logo: 'LZ', color: '#2d3748' },
  { name: 'Centerview', logo: 'CV', color: '#333' },
  { name: 'KKR', logo: 'KKR', color: '#1a202c' },
  { name: 'Deloitte', logo: 'DL', color: '#86bc25' },
  { name: 'PJT Partners', logo: 'PJT', color: '#1a1a2e' },
];

export default function JobBoardPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const subscribeMutation = useMutation((api as any).jobBoard?.subscribe);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) router.replace('/signin');
    const saved = localStorage.getItem('offerbell_job_board_subscribed');
    if (saved) setAlreadySubscribed(true);
    try {
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      if (prof.email) setEmail(prof.email);
    } catch {}
  }, [router]);

  const handleSubmit = async () => {
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      if (subscribeMutation) {
        await subscribeMutation({ email: email.trim() });
      }
    } catch (err) {
      console.error('Job board subscribe error:', err);
    }
    localStorage.setItem('offerbell_job_board_subscribed', 'true');
    localStorage.setItem('offerbell_job_board_email', email.trim());
    setSubmitted(true);
    setAlreadySubscribed(true);
    setSubmitting(false);
  };

  return (
    <div className="app">
      <Sidebar activePage="job-board" />
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 40px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 14 }}>Job Board</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, letterSpacing: -0.8, lineHeight: 1.15, color: 'var(--text)', marginBottom: 10 }}>
              New opportunities,<br />every <em style={{ fontStyle: 'italic' }}>Monday.</em>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.65, maxWidth: 520 }}>
              Every week, we compile the latest internship and full-time openings across IB, PE, consulting, accounting, and more — organized by class year, all in one email. Subscribe and never miss a new posting.
            </div>
          </div>

          {/* How it works */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
            {[
              { num: '01', title: 'Subscribe', desc: 'Enter your email below — takes 5 seconds.' },
              { num: '02', title: 'We compile', desc: 'Every week we round up the newest openings across all class years.' },
              { num: '03', title: 'You apply', desc: 'One email each Monday with every new role and a direct link to apply.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '20px 18px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', letterSpacing: 1, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Firm logos */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40, justifyContent: 'center' }}>
            {SAMPLE_FIRMS.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px' }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: -0.3 }}>{f.logo}</div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{f.name}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--text-3)', fontWeight: 600, padding: '0 8px' }}>+ many more</div>
          </div>

          {/* Signup Card */}
          {!submitted && !alreadySubscribed ? (
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '32px 28px' }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Get the weekly drop</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>
                Enter your email and you&apos;ll receive a weekly roundup of the newest opportunities across every class year — IB, PE, consulting, accounting, and more. One email, every Monday.
              </div>

              {/* Email */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                  style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: "'Sora', sans-serif", color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}
                />
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={!email.trim() || submitting} type="button" style={{
                width: '100%', padding: 14, borderRadius: 10, border: 'none',
                background: email.trim() && !submitting ? 'var(--text)' : 'var(--border)',
                color: email.trim() && !submitting ? 'var(--surface)' : 'var(--text-3)',
                fontSize: 14, fontWeight: 700, cursor: email.trim() && !submitting ? 'pointer' : 'default',
                fontFamily: "'Sora', sans-serif", transition: 'all 0.12s',
              }}>
                {submitting ? 'Subscribing...' : 'Subscribe to weekly jobs'}
              </button>

              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-3)' }}>
                No spam. Unsubscribe anytime. Delivered every Monday.
              </div>
            </div>
          ) : (
            /* Success state */
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '40px 28px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>
                You&apos;re <em style={{ fontStyle: 'italic' }}>in.</em>
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.65, maxWidth: 380, margin: '0 auto 24px' }}>
                You&apos;ll receive a weekly roundup of the newest job opportunities every Monday. Keep an eye on your inbox.
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => { localStorage.removeItem('offerbell_job_board_subscribed'); setAlreadySubscribed(false); setSubmitted(false); }} type="button" style={{
                  padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--border)',
                  background: 'var(--surface)', color: 'var(--text)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}>Change email</button>
                <button onClick={() => router.push('/dashboard')} type="button" style={{
                  padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: 'var(--text)', color: 'var(--surface)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}>Back to Dashboard</button>
              </div>
            </div>
          )}

          {/* What you'll get */}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>What&apos;s in each email</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'Organized by class year', desc: 'Roles for 2026, 2027, 2028, and beyond — all in one place' },
                { title: 'Full-time and internships', desc: 'Analyst programs, SA roles, and off-cycle openings' },
                { title: 'All major verticals', desc: 'IB, PE, consulting, accounting, AM, S&T, ER, and more' },
                { title: 'Direct application links', desc: 'One click to apply — no redirects or dead links' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
