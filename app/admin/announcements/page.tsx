'use client';

// ============================================================================
// ADMIN: ANNOUNCEMENTS
// ----------------------------------------------------------------------------
// Access is the isAdmin flag on your users row, set by hand in the Convex
// dashboard (Data -> users -> your row -> isAdmin = true). No password, nothing
// to remember, and revoking is one toggle. A signed-in non-admin (or a signed
// out visitor) sees the not-found state; every read and write is re-checked
// server side, so the page being publicly routable gives nothing away.
// ============================================================================

import { useCallback, useEffect, useState } from 'react';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

type Row = {
  id: string;
  title: string;
  body: string;
  audience: string;
  link: string;
  linkLabel: string;
  active: boolean;
  emailSent: boolean;
  emailCount: number;
  createdAt: number;
};

type Counts = { all: number; free: number; pro: number; elite: number };

const AUDIENCES = [
  { key: 'all', label: 'Everyone' },
  { key: 'free', label: 'Free plan' },
  { key: 'pro', label: 'Pro plan' },
  { key: 'elite', label: 'Elite plan' },
];

function authHeaders(): Record<string, string> {
  let userId = '';
  let token = '';
  try {
    userId = localStorage.getItem('offerbell_user_id') || '';
    token = localStorage.getItem('offerbell_session') || '';
  } catch {}
  const h: Record<string, string> = { 'x-ob-user': userId };
  if (token) h['x-ob-session'] = token;
  return h;
}

export default function AdminAnnouncementsPage() {
  const [phase, setPhase] = useState<'checking' | 'denied' | 'ready'>('checking');

  const [rows, setRows] = useState<Row[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, free: 0, pro: 0, elite: 0 });

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [link, setLink] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    const res = await fetch('/api/admin/announcements', { headers: authHeaders() });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || `Request failed (${res.status})`);
    }
    const data = await res.json();
    setRows(Array.isArray(data.items) ? data.items : []);
    if (data.counts) setCounts(data.counts);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let userId = '';
      let token: string | undefined;
      try {
        userId = localStorage.getItem('offerbell_user_id') || '';
        token = localStorage.getItem('offerbell_session') || undefined;
      } catch {}
      const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
      if (!userId || !url) {
        if (!cancelled) setPhase('denied');
        return;
      }
      try {
        const client = new ConvexHttpClient(url);
        const ok = await client.query((api as any).announcements.amIAdmin, {
          userId,
          sessionToken: token,
        });
        if (cancelled) return;
        if (ok !== true) {
          setPhase('denied');
          return;
        }
        await loadAll();
        if (!cancelled) setPhase('ready');
      } catch {
        if (!cancelled) setPhase('denied');
      }
    })();
    return () => { cancelled = true; };
  }, [loadAll]);

  const audienceSize = audience === 'all' ? counts.all
    : audience === 'pro' ? counts.pro
    : audience === 'elite' ? counts.elite
    : counts.free;

  async function post() {
    setError('');
    setStatus('');
    if (!title.trim() || !body.trim()) {
      setError('Title and message are both required.');
      return;
    }
    if (sendEmail) {
      const ok = window.confirm(`Email this to ${audienceSize} user${audienceSize === 1 ? '' : 's'}? This cannot be undone.`);
      if (!ok) return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ title, body, audience, link, linkLabel, sendEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
      setTitle('');
      setBody('');
      setLink('');
      setLinkLabel('');
      setSendEmail(false);
      const emailNote = data.emailed ? ` Emailed ${data.emailed} user${data.emailed === 1 ? '' : 's'}.` : '';
      setStatus(`Posted.${emailNote}${data.emailError ? ' ' + data.emailError : ''}`);
      await loadAll();
    } catch (e: any) {
      setError(e?.message || 'Could not post that announcement.');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(row: Row) {
    setError('');
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: row.id, active: !row.active }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Request failed (${res.status})`);
      }
      await loadAll();
    } catch (e: any) {
      setError(e?.message || 'Could not update that announcement.');
    }
  }

  if (phase !== 'ready') {
    return (
      <div className="adm-shell">
        <div className="adm-gate">
          {phase === 'checking' ? (
            <p className="adm-sub">Loading...</p>
          ) : (
            <>
              <h1 className="adm-serif">Not found</h1>
              <p className="adm-sub">This page is not available on your account.</p>
              <a className="adm-link" href="/dashboard">Back to dashboard</a>
            </>
          )}
        </div>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <div className="adm-wrap">
        <h1 className="adm-serif">Announcements</h1>
        <p className="adm-sub">
          Posts to the bell in the topbar. {counts.all} verified account{counts.all === 1 ? '' : 's'} total
          &middot; {counts.free} free &middot; {counts.pro} pro &middot; {counts.elite} elite
        </p>

        <div className="adm-card">
          <label className="adm-label">Title</label>
          <input
            className="adm-input"
            value={title}
            maxLength={120}
            placeholder="New: Concept Drills for Restructuring"
            onChange={e => setTitle(e.target.value)}
          />

          <label className="adm-label">Message</label>
          <textarea
            className="adm-input adm-textarea"
            value={body}
            rows={6}
            placeholder="Write the announcement here. Line breaks are preserved."
            onChange={e => setBody(e.target.value)}
          />

          <label className="adm-label">Audience</label>
          <select className="adm-input" value={audience} onChange={e => setAudience(e.target.value)}>
            {AUDIENCES.map(a => (
              <option key={a.key} value={a.key}>{a.label}</option>
            ))}
          </select>

          <div className="adm-row">
            <div className="adm-col">
              <label className="adm-label">Link (optional)</label>
              <input className="adm-input" value={link} placeholder="/concept-drills" onChange={e => setLink(e.target.value)} />
            </div>
            <div className="adm-col">
              <label className="adm-label">Link label (optional)</label>
              <input className="adm-input" value={linkLabel} placeholder="Try it now" onChange={e => setLinkLabel(e.target.value)} />
            </div>
          </div>

          <label className="adm-check">
            <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} />
            <span>Also email this to {audienceSize} user{audienceSize === 1 ? '' : 's'}</span>
          </label>

          {error && <div className="adm-error">{error}</div>}
          {status && <div className="adm-status">{status}</div>}

          <button className="adm-btn" type="button" onClick={post} disabled={busy}>
            {busy ? 'Sending...' : sendEmail ? 'Post and email' : 'Post announcement'}
          </button>
        </div>

        <div className="adm-histhead">Sent</div>
        {rows.length === 0 ? (
          <div className="adm-empty">Nothing posted yet.</div>
        ) : (
          <div className="adm-list">
            {rows.map(r => (
              <div key={r.id} className={`adm-item${r.active ? '' : ' hidden'}`}>
                <div className="adm-item-meta">
                  {new Date(r.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  {' '}&middot;{' '}
                  {AUDIENCES.find(a => a.key === r.audience)?.label || r.audience}
                  {r.emailSent ? ` \u00b7 emailed ${r.emailCount}` : ''}
                  {r.active ? '' : ' \u00b7 hidden'}
                </div>
                <div className="adm-item-title">{r.title}</div>
                <div className="adm-item-body">{r.body}</div>
                <button className="adm-link" type="button" onClick={() => toggleActive(r)}>
                  {r.active ? 'Hide from users' : 'Show again'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}

const CSS = `
  .adm-shell{min-height:100vh;background:#fbfbfa;padding:48px 20px 80px;
    font-family:'Lato',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1d293d}
  .adm-wrap{max-width:680px;margin:0 auto}
  .adm-gate{max-width:340px;margin:12vh auto 0;display:flex;flex-direction:column}
  .adm-serif{font-family:'Instrument Serif',Georgia,serif;font-size:38px;font-weight:400;margin:0 0 6px;letter-spacing:-.2px}
  .adm-sub{font-size:13px;color:#62748e;margin:0 0 26px;line-height:1.6}
  .adm-card{background:#fff;border:1px solid #e5e7eb;border-radius:2px;padding:22px;margin-bottom:38px}
  .adm-label{display:block;font-size:10px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:#90a1b9;margin:14px 0 6px}
  .adm-label:first-child{margin-top:0}
  .adm-input{width:100%;box-sizing:border-box;padding:9px 11px;border:1px solid #e5e7eb;border-radius:2px;background:#fff;
    font-family:inherit;font-size:13.5px;color:#1d293d;outline:none}
  .adm-input:focus{border-color:#94a3b8}
  .adm-textarea{resize:vertical;line-height:1.6}
  .adm-row{display:flex;gap:14px}
  .adm-col{flex:1;min-width:0}
  .adm-check{display:flex;align-items:center;gap:9px;margin-top:18px;font-size:13px;color:#45556c;cursor:pointer}
  .adm-btn{margin-top:18px;padding:10px 18px;border:none;border-radius:2px;background:#1d293d;color:#fff;
    font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}
  .adm-btn:hover{background:#0f172a}
  .adm-btn:disabled{opacity:.55;cursor:default}
  .adm-error{margin-top:14px;font-size:12.5px;color:#b91c1c;line-height:1.5}
  .adm-status{margin-top:14px;font-size:12.5px;color:#15803d;line-height:1.5}
  .adm-histhead{font-size:10px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:#90a1b9;
    padding-bottom:8px;border-bottom:1px solid #e5e7eb}
  .adm-empty{padding:16px 0;font-size:13px;color:#90a1b9}
  .adm-list{display:flex;flex-direction:column}
  .adm-item{padding:16px 0;border-bottom:1px solid #eef0f2}
  .adm-item.hidden{opacity:.5}
  .adm-item-meta{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#90a1b9;margin-bottom:5px}
  .adm-item-title{font-size:14.5px;font-weight:700;color:#1d293d}
  .adm-item-body{margin-top:4px;font-size:13px;line-height:1.6;color:#45556c;white-space:pre-wrap}
  .adm-link{margin-top:8px;padding:0;border:none;background:none;font-family:inherit;font-size:12px;font-weight:700;
    color:#2563eb;cursor:pointer;text-decoration:none;display:inline-block}
  .adm-link:hover{text-decoration:underline}
`;
