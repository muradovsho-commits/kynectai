'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css';

const INDUSTRIES = ['Investment Banking','Private Equity','Consulting','Asset Management','Sales & Trading','Equity Research','Accounting & Audit','Venture Capital','Real Estate','Restructuring','Growth Equity','Corporate Finance'];

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
  const [interests, setInterests] = useState<string[]>([]);
  const [classYear, setClassYear] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

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

  const toggleInterest = (ind: string) => {
    setInterests(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  };

  const handleSubmit = () => {
    if (!email.trim()) return;
    localStorage.setItem('offerbell_job_board_subscribed', 'true');
    localStorage.setItem('offerbell_job_board_email', email);
    localStorage.setItem('offerbell_job_board_interests', JSON.stringify(interests));
    localStorage.setItem('offerbell_job_board_class', classYear);
    setSubmitted(true);
    setAlreadySubscribed(true);
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
              Curated opportunities,<br />delivered <em style={{ fontStyle: 'italic' }}>weekly.</em>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.65, maxWidth: 520 }}>
              Every week, we hand-pick the best internship and full-time openings across investment banking, private equity, consulting, accounting, and more — and send them straight to your inbox.
            </div>
          </div>

          {/* How it works */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
            {[
              { num: '01', title: 'Subscribe', desc: 'Drop your email and pick the industries you care about.' },
              { num: '02', title: 'We curate', desc: 'Our team sources verified openings from top firms every week.' },
              { num: '03', title: 'You apply', desc: 'Get a clean email every Monday with fresh roles — no spam, no fluff.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '20px 18px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#7c3aed', letterSpacing: 1, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Firm logos ticker */}
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
                Subscribe to receive curated job opportunities every Monday. Pick your industries and class year so we send you the most relevant roles.
              </div>

              {/* Email */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Email address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 13, fontFamily: "'Sora', sans-serif", color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}
                />
              </div>

              {/* Class Year */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Class year</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['2026','2027','2028','2029'].map(y => (
                    <button key={y} onClick={() => setClassYear(y)} type="button" style={{
                      padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      border: classYear === y ? '1.5px solid #7c3aed' : '1.5px solid var(--border)',
                      background: classYear === y ? 'rgba(124,58,237,0.06)' : 'var(--bg)',
                      color: classYear === y ? '#7c3aed' : 'var(--text)',
                      cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                    }}>{y}</button>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Industries you're interested in <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(select all that apply)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => toggleInterest(ind)} type="button" style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                      border: interests.includes(ind) ? '1.5px solid #7c3aed' : '1.5px solid var(--border)',
                      background: interests.includes(ind) ? 'rgba(124,58,237,0.06)' : 'var(--bg)',
                      color: interests.includes(ind) ? '#7c3aed' : 'var(--text-3)',
                      cursor: 'pointer', fontFamily: "'Sora', sans-serif", transition: 'all 0.12s',
                    }}>{ind}</button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={!email.trim()} type="button" style={{
                width: '100%', padding: 14, borderRadius: 10, border: 'none',
                background: email.trim() ? 'var(--text)' : 'var(--border)',
                color: email.trim() ? 'var(--surface)' : 'var(--text-3)',
                fontSize: 14, fontWeight: 700, cursor: email.trim() ? 'pointer' : 'default',
                fontFamily: "'Sora', sans-serif", transition: 'all 0.12s',
              }}>
                Subscribe to weekly jobs →
              </button>

              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-3)' }}>
                No spam. Unsubscribe anytime. Delivered every Monday.
              </div>
            </div>
          ) : (
            /* Success state */
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '40px 28px', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>✓</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>
                You&apos;re <em style={{ fontStyle: 'italic' }}>in.</em>
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.65, marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
                You&apos;ll receive curated job opportunities in your inbox every Monday. Keep an eye out for your first email.
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => { setAlreadySubscribed(false); setSubmitted(false); }} type="button" style={{
                  padding: '10px 20px', borderRadius: 10, border: '1.5px solid var(--border)',
                  background: 'var(--surface)', color: 'var(--text)', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'Sora', sans-serif",
                }}>Update preferences</button>
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
                { icon: '🏦', title: 'Full-time analyst roles', desc: 'BB, EB, MM banks, PE firms, and consulting' },
                { icon: '☀️', title: 'Summer internships', desc: 'SA programs at top firms across all verticals' },
                { icon: '🎯', title: 'Filtered for you', desc: 'Based on your class year and industry interests' },
                { icon: '⚡', title: 'Direct application links', desc: 'One click to apply — no redirects or dead links' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
