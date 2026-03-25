'use client';
import { useState, useEffect, useCallback } from 'react';

type EmailAccount = { provider: string; providerEmail: string; status: string; accessToken: string; refreshToken: string; tokenExpiresAt: number; connectedAt: number; lastSyncedAt?: number; };
type SyncSettings = { autoLogSent: boolean; autoUpdateStatus: boolean; followUpReminderDays: number; upcomingCallReminder: boolean; };
type SyncedEmail = { id: string; threadId: string; from: string; to: string; subject: string; snippet: string; sentAt: number; direction: string; matchedContactName?: string; };

const DEFAULT_SETTINGS: SyncSettings = { autoLogSent: true, autoUpdateStatus: true, followUpReminderDays: 7, upcomingCallReminder: true };

export default function EmailSyncPanel({ onContactsUpdated }: { onContactsUpdated?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [settings, setSettings] = useState<SyncSettings>(DEFAULT_SETTINGS);
  const [syncing, setSyncing] = useState(false);
  const [syncedEmails, setSyncedEmails] = useState<SyncedEmail[]>([]);
  const [syncError, setSyncError] = useState('');
  const [showEmails, setShowEmails] = useState(false);

  // Load accounts, settings, synced emails from localStorage
  useEffect(() => {
    try { const a = localStorage.getItem('offerbell_email_accounts'); if (a) setAccounts(JSON.parse(a)); } catch {}
    try { const s = localStorage.getItem('offerbell_sync_settings'); if (s) setSettings(JSON.parse(s)); } catch {}
    try { const e = localStorage.getItem('offerbell_synced_emails'); if (e) setSyncedEmails(JSON.parse(e)); } catch {}

    // Handle OAuth callback cookie
    try {
      const cookie = document.cookie.split('; ').find(c => c.startsWith('offerbell_email_connect='));
      if (cookie) {
        const data = JSON.parse(decodeURIComponent(cookie.split('=').slice(1).join('=')));
        document.cookie = 'offerbell_email_connect=; path=/; max-age=0';
        if (data.provider) {
          const acct: EmailAccount = {
            provider: data.provider,
            providerEmail: data.providerEmail || '',
            status: 'connected',
            accessToken: data.accessToken || '',
            refreshToken: data.refreshToken || '',
            tokenExpiresAt: data.tokenExpiresAt || Date.now() + 3600000,
            connectedAt: Date.now(),
          };
          setAccounts(prev => {
            const filtered = prev.filter(a => a.provider !== data.provider);
            const updated = [...filtered, acct];
            localStorage.setItem('offerbell_email_accounts', JSON.stringify(updated));
            return updated;
          });
          setExpanded(true);
          // Auto-sync on first connect
          setTimeout(() => doSync(acct), 500);
        }
      }
    } catch {}

    const params = new URLSearchParams(window.location.search);
    if (params.get('synced')) { setExpanded(true); window.history.replaceState({}, '', '/outreach-tracker'); }
  }, []);

  function saveSettings(s: SyncSettings) { setSettings(s); localStorage.setItem('offerbell_sync_settings', JSON.stringify(s)); }

  function disconnect(provider: string) {
    if (!confirm('Disconnect this email account? Your synced email data will be kept.')) return;
    const updated = accounts.filter(a => a.provider !== provider);
    setAccounts(updated);
    localStorage.setItem('offerbell_email_accounts', JSON.stringify(updated));
  }

  // Extract email address from "Name <email>" format
  function extractEmail(str: string): string {
    const match = str.match(/<([^>]+)>/);
    return (match ? match[1] : str).toLowerCase().trim();
  }

  // Extract name from "Name <email>" format
  function extractName(str: string): string {
    const match = str.match(/^([^<]+)</);
    return match ? match[1].trim().replace(/"/g, '') : str.split('@')[0];
  }

  const doSync = useCallback(async (account?: EmailAccount) => {
    const acct = account || accounts.find(a => a.provider === 'gmail');
    if (!acct || !acct.accessToken) { setSyncError('No connected account'); return; }

    setSyncing(true);
    setSyncError('');

    try {
      const res = await fetch('/api/email-sync/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: acct.accessToken }),
      });

      if (res.status === 401) {
        setSyncError('Gmail token expired. Reconnect your account.');
        // Mark account as expired
        setAccounts(prev => {
          const updated = prev.map(a => a.provider === acct.provider ? { ...a, status: 'expired' } : a);
          localStorage.setItem('offerbell_email_accounts', JSON.stringify(updated));
          return updated;
        });
        setSyncing(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        setSyncError(err.error || 'Sync failed');
        setSyncing(false);
        return;
      }

      const { emails, myEmail } = await res.json();

      // Load current tracker contacts
      let contacts: any[] = [];
      try { const t = localStorage.getItem('offerbell_tracker_v3'); if (t) contacts = JSON.parse(t); } catch {}

      // Match emails to contacts and build synced list
      const newSynced: SyncedEmail[] = [];
      let contactsChanged = false;

      for (const email of emails) {
        // Determine the "other party" email/name
        const otherParty = email.direction === 'sent' ? email.to : email.from;
        const otherEmail = extractEmail(otherParty);
        const otherName = extractName(otherParty);

        // Try to match to a contact
        let matchedContact: any = null;
        for (const c of contacts) {
          const fullName = `${c.fname} ${c.lname}`.toLowerCase().trim();
          const contactFname = (c.fname || '').toLowerCase();
          const contactLname = (c.lname || '').toLowerCase();
          const otherLower = otherName.toLowerCase();

          // Match by name (fuzzy)
          if (fullName && (otherLower.includes(contactFname) && otherLower.includes(contactLname)) ||
              (otherLower.includes(fullName))) {
            matchedContact = c;
            break;
          }
          // Match by firm name in email domain
          if (c.firm && otherEmail.includes(c.firm.toLowerCase().replace(/\s+/g, ''))) {
            matchedContact = c;
            break;
          }
        }

        newSynced.push({
          ...email,
          matchedContactName: matchedContact ? `${matchedContact.fname} ${matchedContact.lname}` : undefined,
        });

        // Auto-update contact status if enabled
        if (matchedContact && settings.autoUpdateStatus) {
          const idx = contacts.findIndex(c => c.id === matchedContact.id);
          if (idx !== -1) {
            const c = contacts[idx];
            if (email.direction === 'sent' && c.status === 'drafted') {
              contacts[idx] = { ...c, status: 'sent', lastContact: email.sentAt };
              contactsChanged = true;
            } else if (email.direction === 'received' && ['sent', 'fu1', 'fu2', 'fu3'].includes(c.status)) {
              contacts[idx] = { ...c, status: 'spoken', lastContact: email.sentAt };
              contactsChanged = true;
            }
          }
        }
      }

      // Save synced emails
      setSyncedEmails(newSynced);
      localStorage.setItem('offerbell_synced_emails', JSON.stringify(newSynced));

      // Save updated contacts if any changed
      if (contactsChanged) {
        localStorage.setItem('offerbell_tracker_v3', JSON.stringify(contacts));
        if (onContactsUpdated) onContactsUpdated();
      }

      // Update account last synced time
      setAccounts(prev => {
        const updated = prev.map(a => a.provider === acct.provider ? { ...a, status: 'connected', lastSyncedAt: Date.now() } : a);
        localStorage.setItem('offerbell_email_accounts', JSON.stringify(updated));
        return updated;
      });

    } catch (err: any) {
      setSyncError(err.message || 'Sync failed');
    }

    setSyncing(false);
  }, [accounts, settings.autoUpdateStatus, onContactsUpdated]);

  const gmail = accounts.find(a => a.provider === 'gmail');
  const outlook = accounts.find(a => a.provider === 'outlook');

  function fmtAgo(ts?: number) {
    if (!ts) return 'Never';
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs / 24)}d ago`;
  }

  function fmtDate(ts: number) {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  const tog = (on: boolean): React.CSSProperties => ({ width: 36, height: 20, borderRadius: 100, background: on ? '#10b981' : 'var(--border-2)', cursor: 'pointer', position: 'relative', border: 'none', transition: 'background .2s', flexShrink: 0 });
  const knb = (on: boolean): React.CSSProperties => ({ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 19 : 3, transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.15)' });

  const matchedCount = syncedEmails.filter(e => e.matchedContactName).length;

  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="16" height="16" fill="none" stroke="var(--text-2)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Email &amp; Calendar Sync</span>
          {accounts.length > 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: '#ecfdf5', color: '#166534', border: '1px solid #bbf7d0' }}>{accounts.length} connected</span>}
          {syncedEmails.length > 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>{syncedEmails.length} emails · {matchedCount} matched</span>}
        </div>
        <svg width="14" height="14" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {expanded && (
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Provider cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { key: 'gmail', label: 'Gmail', acct: gmail, href: '/api/auth/gmail', color: '#EA4335' },
              { key: 'outlook', label: 'Outlook', acct: outlook, href: '/api/auth/outlook', color: '#0078D4' },
            ].map(p => (
              <div key={p.key} style={{ border: '1.5px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: p.color }}>{p.label[0]}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.acct ? p.acct.providerEmail : 'Not connected'}</div>
                  </div>
                </div>
                {p.acct ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: p.acct.status === 'expired' ? '#dc2626' : '#16a34a' }}>
                        {p.acct.status === 'expired' ? '⚠ Token expired' : `✓ Synced ${fmtAgo(p.acct.lastSyncedAt)}`}
                      </span>
                      <button onClick={e => { e.stopPropagation(); disconnect(p.key); }} type="button" style={{ fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Disconnect</button>
                    </div>
                    {p.acct.status === 'expired' ? (
                      <a href={p.href} style={{ display: 'block', textAlign: 'center', background: '#dc2626', color: '#fff', padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Reconnect {p.label}</a>
                    ) : (
                      <button onClick={e => { e.stopPropagation(); doSync(); }} disabled={syncing} type="button" style={{ width: '100%', background: 'var(--text)', color: 'var(--surface)', padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: syncing ? 'not-allowed' : 'pointer', opacity: syncing ? 0.5 : 1 }}>
                        {syncing ? 'Syncing...' : 'Sync Now'}
                      </button>
                    )}
                  </div>
                ) : (
                  <a href={p.href} style={{ display: 'block', textAlign: 'center', background: 'var(--text)', color: 'var(--surface)', padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Connect {p.label}</a>
                )}
              </div>
            ))}
          </div>

          {/* Sync error */}
          {syncError && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 12, fontWeight: 500 }}>{syncError}</div>
          )}

          {/* Synced emails preview */}
          {syncedEmails.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)' }}>
                  Recent Synced Emails ({syncedEmails.length})
                </div>
                <button onClick={() => setShowEmails(!showEmails)} type="button" style={{ fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                  {showEmails ? 'Hide' : 'Show'}
                </button>
              </div>
              {showEmails && (
                <div style={{ border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                  {syncedEmails.slice(0, 10).map((e, i) => (
                    <div key={e.id} style={{ padding: '10px 14px', borderBottom: i < 9 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.direction === 'sent' ? '#2563eb' : '#16a34a', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.subject || '(no subject)'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {e.direction === 'sent' ? 'To: ' : 'From: '}{e.direction === 'sent' ? e.to : e.from}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{fmtDate(e.sentAt)}</div>
                      {e.matchedContactName && (
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#ecfdf5', color: '#166534', whiteSpace: 'nowrap', flexShrink: 0 }}>↔ {e.matchedContactName}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sync Settings */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 10 }}>Sync Settings</div>
            {[
              { key: 'autoLogSent' as const, label: 'Auto-log sent outreach', sub: 'Automatically record emails you send to tracked contacts' },
              { key: 'autoUpdateStatus' as const, label: 'Auto-update statuses from replies', sub: 'Move contacts forward when they reply' },
              { key: 'upcomingCallReminder' as const, label: 'Upcoming call reminders', sub: 'Get notified 24 hours before scheduled calls' },
            ].map((s, i) => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.label}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.sub}</div></div>
                <button type="button" onClick={() => saveSettings({ ...settings, [s.key]: !settings[s.key] })} style={tog(settings[s.key])}><div style={knb(settings[s.key])} /></button>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Follow-up reminder after</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>Remind you if a contact hasn&apos;t replied</div></div>
              <select value={settings.followUpReminderDays} onChange={e => saveSettings({ ...settings, followUpReminderDays: parseInt(e.target.value) })} style={{ padding: '6px 10px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 12, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}>
                {[3, 5, 7, 10, 14].map(d => <option key={d} value={d}>{d} days</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
