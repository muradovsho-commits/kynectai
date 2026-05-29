'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import { ConvexHttpClient } from 'convex/browser';
import '../contact-finder/contact-finder.css';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import './outreach-writer.css';

type SavedMsg = { id: string; contact: string; firm: string; angle: string; subject: string; body: string; date: string };

const ANGLES: { key: string; label: string; sub: string; rate: string }[] = [
  { key: 'alumni',   label: 'Alumni',           sub: 'Same school, club, or program', rate: '68%' },
  { key: 'deal',     label: 'Deal Reference',   sub: 'Reference a recent transaction', rate: '41%' },
  { key: 'interest', label: 'Shared Interest',  sub: 'Common topic or research area',  rate: '54%' },
  { key: 'mutual',   label: 'Mutual Connection',sub: 'Someone referred you to them',   rate: '37%' },
  { key: 'career',   label: 'Career Path',      sub: 'Following a similar trajectory', rate: '32%' },
  { key: 'cold',     label: 'No Connection',    sub: 'Pure cold outreach',             rate: '8%'  },
];

const CTX_LABELS: Record<string, string> = {
  alumni: 'What do you have in common?',
  deal: 'Which deal or transaction?',
  interest: "What's the shared interest?",
  mutual: 'Who referred you?',
  career: 'What path are you targeting?',
  cold: 'Why this specific person?',
};
const CTX_PLACEHOLDERS: Record<string, string> = {
  alumni: 'e.g. NYU Stern IB Club, Goldman on-campus recruiting',
  deal: "e.g. Goldman's acquisition of GreenSky, their TMT coverage",
  interest: 'e.g. semiconductor M&A, impact investing, distressed debt',
  mutual: 'e.g. Jane Smith, your colleague at Goldman',
  career: 'e.g. IB at a bulge bracket, then buyside PE',
  cold: 'e.g. Their group covers sectors I want to work in',
};

function getMondayWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const mon = new Date(now);
  mon.setDate(now.getDate() - diff);
  mon.setHours(0, 0, 0, 0);
  return mon.toISOString().split('T')[0];
}

export default function OutreachWriterPage() {
  const incrementOutreachCount = useMutation(api.users.incrementOutreachCount);

  // ── State ──
  const [userPlan, setUserPlan] = useState('free');
  const [hydrated, setHydrated] = useState(false);
  const [messagesSent, setMessagesSent] = useState(0);
  const [weeklyUsed, setWeeklyUsed] = useState(0);

  // Contact (the person being emailed)
  const [contactName, setContactName] = useState('');
  const [contactFirm, setContactFirm] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactSchool, setContactSchool] = useState('');

  // "About you" (auto-filled, editable in collapsed panel)
  const [yourName, setYourName] = useState('');
  const [yourSchool, setYourSchool] = useState('');
  const [yourYear, setYourYear] = useState('');
  const [yourTarget, setYourTarget] = useState('Investment Banking');
  const [aboutOpen, setAboutOpen] = useState(false);

  // Message config
  const [angle, setAngle] = useState('alumni');
  const [ctx, setCtx] = useState('');
  const [tone, setTone] = useState('Professional');

  // Generation
  const [output, setOutput] = useState('');
  const [subject, setSubject] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  // Drafts
  const [savedMsgs, setSavedMsgs] = useState<SavedMsg[]>([]);
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState('');

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const prof = JSON.parse(raw);
        setYourName(((prof.firstName || '') + ' ' + (prof.lastName || '')).trim());
        setYourSchool(prof.university || '');
        setYourYear(prof.year || '');
        if (prof.targetRoles && prof.targetRoles.length > 0) setYourTarget(prof.targetRoles[0]);
      }
    } catch {}

    // Theme
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

    // Plan
    const plan = localStorage.getItem('offerbell_plan') || 'free';
    try { const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}'); setUserPlan(prof.plan || plan); } catch { setUserPlan(plan); }

    // Saved drafts
    try {
      const r = localStorage.getItem('offerbell_saved_messages');
      if (r) setSavedMsgs(JSON.parse(r));
    } catch {}

    // Free-plan message counter
    try {
      const c = parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10);
      setMessagesSent(c);
      // Sync to extension if installed (preserved from original)
      try {
        const extensionId = 'ecmiggmdjpohgidmdonhbcbnlhdagmkp';
        if (extensionId && typeof chrome !== 'undefined' && (chrome as any).runtime?.sendMessage) {
          (chrome as any).runtime.sendMessage(extensionId, {
            action: 'updateCount',
            messagesSent: c,
            plan: localStorage.getItem('offerbell_plan') || 'free',
            userId: localStorage.getItem('offerbell_user_id') || ''
          }, () => {});
        }
      } catch {}
    } catch {}

    // Weekly counter for Pro/Elite
    try {
      const raw = localStorage.getItem('offerbell_outreach_weekly');
      const week = getMondayWeekStart();
      if (raw) {
        const d = JSON.parse(raw);
        if (d.week === week) setWeeklyUsed(d.count || 0);
      }
    } catch {}
  }, []);

  // Listen for sidebar industry changes so target role stays current
  useEffect(() => {
    function refresh() {
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        if (raw) {
          const prof = JSON.parse(raw);
          if (prof.targetRoles && prof.targetRoles.length > 0) setYourTarget(prof.targetRoles[0]);
        }
      } catch {}
    }
    window.addEventListener('offerbell-profile-changed', refresh);
    return () => window.removeEventListener('offerbell-profile-changed', refresh);
  }, []);

  // Hydrate plan + outreach usage from Convex (source of truth). Without this,
  // the chip reads from stale localStorage (e.g. plan was changed in Convex,
  // or the weekly counter is wrong). One-shot HTTP fetch - not a reactive
  // useQuery - so no live-subscription bandwidth cost. Plan local state ONLY,
  // never writes 'offerbell_plan' localStorage to avoid downgrading a paying
  // user during a Stripe webhook delay window.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userId = localStorage.getItem('offerbell_user_id');
    if (!userId) return;
    const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
    if (!url) return;
    let cancelled = false;
    (async () => {
      try {
        const client = new ConvexHttpClient(url);
        const userRow: any = await client.query((api as any).users.getUser, { userId });
        if (cancelled) return;
        if (userRow?.found) {
          if (userRow.plan === 'free' || userRow.plan === 'pro' || userRow.plan === 'elite') {
            setUserPlan(userRow.plan);
          }
          // Free-plan lifetime count is authoritative on the server (users.outreachCount,
          // surfaced as messagesUsed). This IS a page-specific local mirror so writing
          // localStorage is safe.
          if (typeof userRow.messagesUsed === 'number') {
            setMessagesSent(userRow.messagesUsed);
            try { localStorage.setItem('offerbell_messages_sent', String(userRow.messagesUsed)); } catch {}
          }
        }
        const usage: any = await client.query((api as any).usage?.getUsage, { userId });
        if (!cancelled && usage && typeof usage.outreachWriter === 'number') {
          setWeeklyUsed(usage.outreachWriter);
          try {
            localStorage.setItem('offerbell_outreach_weekly', JSON.stringify({ week: getMondayWeekStart(), count: usage.outreachWriter }));
          } catch {}
        }
      } catch { /* swallow - localStorage fallback already populated */ }
      finally { if (!cancelled) setHydrated(true); }
    })();
    return () => { cancelled = true; };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  // ── Usage / limit calc ──
  const weeklyMax = userPlan === 'elite' ? 30 : userPlan === 'pro' ? 20 : 0;
  const freeMax = 5;
  const isPaid = userPlan === 'pro' || userPlan === 'elite';
  const used = isPaid ? weeklyUsed : messagesSent;
  const max = isPaid ? weeklyMax : freeMax;
  const remaining = Math.max(0, max - used);
  const atLimit = remaining <= 0;
  const chipClass = atLimit ? 'ow-chip limit' : (remaining <= 2 ? 'ow-chip warn' : 'ow-chip');

  function saveDraft() {
    if (!output) return;
    const msg: SavedMsg = {
      id: Date.now().toString(),
      contact: contactName.trim() || 'Unknown',
      firm: contactFirm.trim() || 'Unknown',
      angle: ANGLES.find(a => a.key === angle)?.label || angle,
      subject,
      body: output,
      date: new Date().toISOString(),
    };
    const updated = [msg, ...savedMsgs].slice(0, 20);
    setSavedMsgs(updated);
    localStorage.setItem('offerbell_saved_messages', JSON.stringify(updated));
    showToast('Draft saved');
  }

  function deleteDraft(id: string) {
    const updated = savedMsgs.filter(m => m.id !== id);
    setSavedMsgs(updated);
    localStorage.setItem('offerbell_saved_messages', JSON.stringify(updated));
    if (expandedDraft === id) setExpandedDraft(null);
    showToast('Draft deleted');
  }

  function saveToTracker() {
    const angleLabel = ANGLES.find(a => a.key === angle)?.label || angle;
    const c: any = {
      id: Date.now().toString(),
      fname: contactName.trim() || 'No Name',
      lname: '',
      firm: contactFirm.trim() || 'Unknown Firm',
      role: contactRole.trim() || 'Unknown Role',
      status: 'drafted',
      angle: angleLabel,
      notes: subject ? 'Subject: ' + subject : '',
      quality: '',
      createdAt: Date.now(),
      lastContact: null,
    };
    if (contactName.includes(' ')) {
      const parts = contactName.trim().split(' ');
      c.fname = parts[0];
      c.lname = parts.slice(1).join(' ');
    }
    const t = localStorage.getItem('offerbell_tracker_v3');
    const existing = t ? JSON.parse(t) : [];
    localStorage.setItem('offerbell_tracker_v3', JSON.stringify([...existing, c]));
    showToast('Saved to Outreach Tracker');
  }

  function copyMsg() {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${output}`);
    showToast('Copied to clipboard');
  }

  async function generate() {
    setError('');
    if (!contactName.trim() || !contactFirm.trim()) {
      setError('Add at least the contact\u2019s name and firm to generate.');
      return;
    }
    if (atLimit) {
      setError(isPaid
        ? `You have used all ${max} messages this week. Resets Monday.`
        : `You have reached your free plan limit of ${freeMax} messages. Upgrade to Pro for 20/week.`);
      return;
    }

    setGenerating(true);
    setOutput('');
    setSubject('');

    const angleLabel = ANGLES.find(a => a.key === angle)?.label || angle;
    const prompt = `Write a compelling cold email for an undergraduate student to a finance professional.
Student Info: name=${yourName}, school=${yourSchool}, year=${yourYear}, target role=${yourTarget}.
Contact Info: name=${contactName}, firm=${contactFirm}, role=${contactRole}, school=${contactSchool}.
Networking Angle: ${angleLabel}. Context: ${ctx || 'None provided'}.
Tone: ${tone}.

Rules:
1. Do not use overly formal or robotic words like "delve", "robust", "thrilled", or "tapestry".
2. Make it sound like a natural, ambitious college student. Length should be around 4 to 8 sentences, providing enough detail without being desperate.
3. The very first line must be exactly "Subject: [your subject here]". Then two newlines, then the email body. Do not include any other commentary before or after.
4. Ensure the subject line uses grammatically correct Title Case (e.g., capitalize the first letter of each major word).
5. Pay close attention to the contact's specific role and firm. Do not mistakenly refer to the contact's job as the student's target role if they are different.`;

    try {
      const res = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) {
        const friendly = data.message || (data.error === 'limit_reached'
          ? `You have hit your weekly limit. Resets Monday.`
          : data.error);
        setError(friendly);
        // Sync local state if server reported truth
        if (typeof data.plan === 'string' && (data.plan === 'free' || data.plan === 'pro' || data.plan === 'elite')) {
          setUserPlan(data.plan);
        }
        if (typeof data.used === 'number') {
          if (data.plan === 'pro' || data.plan === 'elite') setWeeklyUsed(data.used);
          else setMessagesSent(data.used);
        }
        setGenerating(false);
        return;
      }

      const rawText = data.text || '';
      const match = rawText.match(/^Subject:\s*(.+)$/im);
      if (match) {
        setSubject(match[1]);
        setOutput(rawText.replace(/^Subject:\s*.+(\r?\n)+/i, '').trim());
      } else {
        setSubject('Networking Context');
        setOutput(rawText.trim());
      }

      // Bump local counters
      try {
        const storedUid = window.localStorage.getItem('offerbell_user_id');
        if (storedUid) {
          const newQ = await incrementOutreachCount({ userId: storedUid as any });
          localStorage.setItem('offerbell_messages_sent', String(newQ));
          setMessagesSent(newQ);
        } else {
          const prev = parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10);
          localStorage.setItem('offerbell_messages_sent', String(prev + 1));
          setMessagesSent(prev + 1);
        }
        if (isPaid) {
          const week = getMondayWeekStart();
          const r = localStorage.getItem('offerbell_outreach_weekly');
          let wk = r ? JSON.parse(r) : { week, count: 0 };
          if (wk.week !== week) wk = { week, count: 0 };
          wk.count++;
          localStorage.setItem('offerbell_outreach_weekly', JSON.stringify(wk));
          setWeeklyUsed(wk.count);
        }
        const currentPlan = localStorage.getItem('offerbell_plan') || 'free';
        document.cookie = `offerbell_plan=${currentPlan}; path=/; max-age=2592000; SameSite=Lax`;
      } catch {}
    } catch (e) {
      console.error(e);
      setError('Failed to generate. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function startOver() {
    setOutput('');
    setSubject('');
    setContactName('');
    setContactFirm('');
    setContactRole('');
    setContactSchool('');
    setCtx('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const selectedAngle = ANGLES.find(a => a.key === angle);

  return (
    <div className="ow-app">
      <Sidebar activePage="outreach-writer" />
      <div className="ow-canvas">
        <div className="ow-page">
          <div className="ow-page-inner">

            {/* ─── Top row ─── */}
            <div className="ow-top-row">
              <div className="ow-title-block">
                <h1 className="ow-page-title">Outreach <em>Writer</em></h1>
                <div className="ow-page-sub">
                  Generate a personalized cold email that actually gets replies. Pick your angle, add context, and ship it.
                </div>
              </div>
              <div className="ow-top-chips">
                <div className={chipClass} style={{ opacity: hydrated ? 1 : 0, transition: 'opacity 0.15s' }}>
                  <span className="ow-chip-dot" />
                  {atLimit
                    ? 'Weekly limit reached'
                    : isPaid
                      ? `${remaining} of ${max} left this week`
                      : `${remaining} of ${freeMax} left`}
                </div>
              </div>
            </div>

            <div className="ow-grid">
              {/* ─── LEFT: form or output ─── */}
              <div>
                {!output && !generating && (
                  <div className="ow-card">
                    {/* Section 1: Contact */}
                    <div className="ow-section">
                      <div className="ow-section-head">
                        <div>
                          <div className="ow-section-title">Who you're emailing</div>
                          <div className="ow-section-sub">The contact you want a reply from</div>
                        </div>
                      </div>
                      <div className="ow-grid-2" style={{ marginBottom: 12 }}>
                        <div className="ow-field">
                          <label className="ow-label">Name</label>
                          <input className="ow-input" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="e.g. Emily Zhang" />
                        </div>
                        <div className="ow-field">
                          <label className="ow-label">Firm</label>
                          <input className="ow-input" value={contactFirm} onChange={e => setContactFirm(e.target.value)} placeholder="e.g. Goldman Sachs" />
                        </div>
                      </div>
                      <div className="ow-grid-2">
                        <div className="ow-field">
                          <label className="ow-label">Role</label>
                          <input className="ow-input" value={contactRole} onChange={e => setContactRole(e.target.value)} placeholder="e.g. IB Analyst" />
                        </div>
                        <div className="ow-field">
                          <label className="ow-label">Their school (optional)</label>
                          <input className="ow-input" value={contactSchool} onChange={e => setContactSchool(e.target.value)} placeholder="e.g. NYU Stern" />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Angle */}
                    <div className="ow-section">
                      <div className="ow-section-head">
                        <div>
                          <div className="ow-section-title">Pick your angle</div>
                          <div className="ow-section-sub">Alumni and deal reference angles get the highest reply rates</div>
                        </div>
                      </div>
                      <div className="ow-angles">
                        {ANGLES.map(a => (
                          <button
                            key={a.key}
                            type="button"
                            className={`ow-angle${angle === a.key ? ' sel' : ''}`}
                            onClick={() => { setAngle(a.key); setCtx(''); }}
                          >
                            <div className="ow-angle-row">
                              <div className="ow-angle-name">{a.label}</div>
                              <div className="ow-angle-rate">{a.rate}</div>
                            </div>
                            <div className="ow-angle-sub">{a.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section 3: Context + tone */}
                    <div className="ow-section">
                      <div className="ow-section-head">
                        <div>
                          <div className="ow-section-title">{CTX_LABELS[angle]}</div>
                          <div className="ow-section-sub">Specific details lift reply rates dramatically</div>
                        </div>
                      </div>
                      <textarea
                        className="ow-textarea"
                        value={ctx}
                        onChange={e => setCtx(e.target.value)}
                        placeholder={CTX_PLACEHOLDERS[angle]}
                        rows={2}
                        style={{ marginBottom: 16 }}
                      />
                      <div className="ow-label" style={{ marginBottom: 8 }}>Tone</div>
                      <div className="ow-tones">
                        {['Professional', 'Conversational', 'Direct & brief'].map(t => (
                          <button
                            key={t}
                            type="button"
                            className={`ow-tone${tone === t ? ' sel' : ''}`}
                            onClick={() => setTone(t)}
                          >{t}</button>
                        ))}
                      </div>
                    </div>

                    {/* Error inline */}
                    {error && <div className="ow-error">{error}</div>}

                    {/* Generate button */}
                    <div className="ow-generate-row">
                      <button
                        type="button"
                        className="ow-generate"
                        onClick={generate}
                        disabled={generating || atLimit || !contactName.trim() || !contactFirm.trim()}
                      >
                        {atLimit
                          ? (userPlan === 'free' ? 'Upgrade to Pro for more' : 'Weekly limit reached')
                          : 'Generate message'}
                      </button>
                    </div>

                    {/* Collapsible "About you" */}
                    <div className={`ow-collapse-head${aboutOpen ? ' open' : ''}`} onClick={() => setAboutOpen(!aboutOpen)}>
                      <div className="ow-collapse-head-left">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        About you {!aboutOpen && <span style={{ color: 'var(--text-3)', fontWeight: 500 }}>· auto-filled from your profile</span>}
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    {aboutOpen && (
                      <div className="ow-collapse-body">
                        <div className="ow-grid-2" style={{ marginBottom: 12 }}>
                          <div className="ow-field">
                            <label className="ow-label">Your name</label>
                            <input className="ow-input" value={yourName} onChange={e => setYourName(e.target.value)} placeholder="Your name" />
                          </div>
                          <div className="ow-field">
                            <label className="ow-label">Your school</label>
                            <input className="ow-input" value={yourSchool} onChange={e => setYourSchool(e.target.value)} placeholder="e.g. NYU Stern" />
                          </div>
                        </div>
                        <div className="ow-grid-2">
                          <div className="ow-field">
                            <label className="ow-label">Year</label>
                            <input className="ow-input" value={yourYear} onChange={e => setYourYear(e.target.value)} placeholder="e.g. Junior" />
                          </div>
                          <div className="ow-field">
                            <label className="ow-label">Target role</label>
                            <input className="ow-input" value={yourTarget} onChange={e => setYourTarget(e.target.value)} placeholder="e.g. Investment Banking" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Generating state */}
                {generating && (
                  <div className="ow-output-card">
                    <div className="ow-output-head">
                      <div className="ow-output-head-left">
                        <span className="ow-output-eyebrow">Writing your email</span>
                        <span className="ow-output-angle-tag">{selectedAngle?.label}</span>
                      </div>
                    </div>
                    <div className="ow-output-body">
                      <div className="ow-generating">
                        <div className="ow-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: 'var(--border)', borderTopColor: 'var(--text)' }} />
                        <div className="ow-generating-title">Generating your <em>message</em></div>
                        <div className="ow-generating-sub">Just a second.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Output state */}
                {output && !generating && (
                  <>
                    <div className="ow-output-card">
                      <div className="ow-output-head">
                        <div className="ow-output-head-left">
                          <span className="ow-output-eyebrow">Your email</span>
                          <span className="ow-output-angle-tag">{selectedAngle?.label} angle</span>
                        </div>
                        <div className="ow-output-actions">
                          <button type="button" className="ow-action" onClick={generate}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                            Regenerate
                          </button>
                          <button type="button" className="ow-action" onClick={copyMsg}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            Copy
                          </button>
                          <button type="button" className="ow-action" onClick={saveDraft}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                            Save draft
                          </button>
                          <button type="button" className="ow-action primary" onClick={saveToTracker}>
                            Save to Tracker
                          </button>
                        </div>
                      </div>
                      <div className="ow-output-body">
                        <div className="ow-output-subject-lbl">Subject line</div>
                        <div className="ow-output-subject">{subject}</div>
                        <div className="ow-output-body-text">{output}</div>
                      </div>
                      <div className="ow-output-foot">
                        <span className="ow-foot-stat"><strong>{output.split(/\s+/).filter(Boolean).length}</strong> words</span>
                        <span className="ow-foot-stat"><strong>{output.length}</strong> chars</span>
                        <span className="ow-foot-badge">{selectedAngle?.rate} avg reply rate</span>
                      </div>
                    </div>
                    <div className="ow-new-row">
                      <button type="button" className="ow-back-btn" onClick={() => { setOutput(''); setSubject(''); setError(''); }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        Edit form
                      </button>
                      <button type="button" className="ow-new-btn" onClick={startOver}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                        New email
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* ─── RIGHT: drafts panel ─── */}
              <aside className="ow-aside">
                <div className="ow-aside-head">
                  <div className="ow-aside-title">Saved <em style={{ fontStyle: 'italic' }}>drafts</em></div>
                  <div className="ow-aside-sub">{savedMsgs.length} of 20 saved</div>
                </div>
                <div className="ow-aside-body">
                  {savedMsgs.length === 0 ? (
                    <div className="ow-aside-empty">
                      <div className="ow-aside-empty-title">No drafts yet</div>
                      Generate a message and click <strong style={{ color: 'var(--text-2)', fontWeight: 600 }}>Save draft</strong> to keep it here.
                    </div>
                  ) : (
                    savedMsgs.map(m => {
                      const isOpen = expandedDraft === m.id;
                      return (
                        <div key={m.id} className={`ow-draft${isOpen ? ' open' : ''}`}>
                          <div className="ow-draft-head" onClick={() => setExpandedDraft(isOpen ? null : m.id)}>
                            <div className="ow-draft-top">
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div className="ow-draft-name">{m.contact}</div>
                                <div className="ow-draft-meta">{m.firm} · {m.angle}</div>
                                <div className="ow-draft-subject">Subject: {m.subject}</div>
                                {!isOpen && <div className="ow-draft-preview">{m.body}</div>}
                              </div>
                              <svg className="ow-draft-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                          </div>
                          {isOpen && (
                            <div className="ow-draft-body-full">
                              <div className="ow-draft-body-text">{m.body}</div>
                              <div className="ow-draft-actions">
                                <button
                                  type="button"
                                  className="ow-draft-copy"
                                  onClick={() => { navigator.clipboard.writeText(`Subject: ${m.subject}\n\n${m.body}`); showToast('Copied'); }}
                                >Copy full message</button>
                                <button type="button" className="ow-draft-del" onClick={() => deleteDraft(m.id)}>Delete</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>
            </div>

          </div>
        </div>
      </div>

      {toast && (
        <div className="ow-toast" style={{ transform: `translateX(-50%) translateY(0)` }}>
          {toast}
        </div>
      )}
    </div>
  );
}
