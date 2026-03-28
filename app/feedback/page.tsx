'use client';
import Sidebar from "../components/Sidebar";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../contact-finder/contact-finder.css';

const TYPES = [
  { id: 'feature', label: 'Feature Request', desc: 'Suggest a new feature or improvement' },
  { id: 'bug', label: 'Bug Report', desc: 'Something isn\'t working right' },
  { id: 'feedback', label: 'General Feedback', desc: 'Share your thoughts on the platform' },
];

type LocalEntry = { id: string; type: string; message: string; date: string };

export default function FeedbackPage() {
  const router = useRouter();
  const [type, setType] = useState('feature');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<LocalEntry[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const s = window.localStorage.getItem('offerbell_user_id');
    if (!s) { router.replace('/signin'); return; }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    try { const saved = localStorage.getItem('offerbell_feedback_history'); if (saved) setHistory(JSON.parse(saved)); } catch {}
  }, [router]);

  const handleSubmit = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    let userName = '';
    let userEmail = '';
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        userName = `${p.firstName || ''} ${p.lastName || ''}`.trim();
        userEmail = p.email || '';
      }
    } catch {}

    // Send to our API which emails the team
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message: message.trim(), userName, userEmail }),
      });
    } catch {}

    // Always save locally regardless of API success
    const entry: LocalEntry = { id: Date.now().toString(), type, message: message.trim(), date: new Date().toISOString().slice(0, 10) };
    const updated = [entry, ...history];
    setHistory(updated);
    localStorage.setItem('offerbell_feedback_history', JSON.stringify(updated));
    setMessage('');
    setSubmitted(true);
    setSending(false);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const typeLabel = TYPES.find(t => t.id === type)?.label || '';

  return (
    <div className="app">
      <Sidebar activePage="feedback" />
      <main className="main">
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: 'var(--text)', margin: '0 0 6px' }}>Feedback</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-3)', marginBottom: '28px' }}>Help us build the platform you actually need. Every submission is read by our team.</p>

          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '24px 28px', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>What type of feedback?</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              {TYPES.map(t => (
                <button key={t.id} onClick={() => setType(t.id)} style={{
                  flex: 1, padding: '12px 10px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontSize: '12px', fontWeight: 600, transition: 'all 0.15s',
                  border: type === t.id ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                  background: type === t.id ? 'rgba(99,102,241,0.06)' : 'var(--bg)',
                  color: type === t.id ? 'var(--accent)' : 'var(--text-2)',
                }}>
                  <div>{t.label}</div>
                  <div style={{ fontSize: '10px', fontWeight: 400, color: 'var(--text-3)', marginTop: '2px' }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Your message</div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={
                type === 'feature' ? 'Describe the feature you\'d like to see. What problem would it solve for you?'
                : type === 'bug' ? 'What happened? What did you expect to happen? Include any steps to reproduce.'
                : 'Share any thoughts, suggestions, or impressions about the platform.'
              }
              rows={5}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '13px', fontFamily: "'Sora', sans-serif", resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                {submitted ? <span style={{ color: '#16a34a', fontWeight: 600 }}>Submitted -- thank you for your feedback.</span> : `Submitting as: ${typeLabel}`}
              </div>
              <button onClick={handleSubmit} disabled={!message.trim() || sending} style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none', fontSize: '13px', fontWeight: 700, cursor: message.trim() && !sending ? 'pointer' : 'default', fontFamily: "'Sora', sans-serif",
                background: message.trim() && !sending ? 'var(--accent)' : 'var(--border)', color: message.trim() && !sending ? '#fff' : 'var(--text-3)',
              }}>
                {sending ? 'Sending...' : 'Submit Feedback'}
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Your Submissions</div>
              {history.map(h => (
                <div key={h.id} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 18px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                      background: h.type === 'feature' ? 'rgba(99,102,241,0.1)' : h.type === 'bug' ? 'rgba(239,68,68,0.1)' : 'rgba(22,163,74,0.1)',
                      color: h.type === 'feature' ? '#6366f1' : h.type === 'bug' ? '#ef4444' : '#16a34a',
                    }}>{h.type === 'feature' ? 'Feature Request' : h.type === 'bug' ? 'Bug Report' : 'Feedback'}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{h.date}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6 }}>{h.message}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
