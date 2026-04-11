'use client';
import { useState, useEffect } from 'react';

type Contact = { id: string; fname: string; lname: string; firm: string; status: string; lastContact: number | null; };
type Reminder = { id: string; type: string; contactName: string; contactFirm: string; contactId: string; message: string; };

function daysSince(ts: number | null) { if (!ts) return null; return Math.floor((Date.now() - ts) / 864e5); }

export default function RemindersPanel({ contacts, onOpenContact }: { contacts: Contact[]; onOpenContact?: (id: string) => void }) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    try { const d = localStorage.getItem('offerbell_dismissed_reminders'); if (d) setDismissedIds(new Set(JSON.parse(d))); } catch {}
  }, []);

  useEffect(() => {
    if (!contacts.length) return;
    let followUpDays = 7;
    try { const s = localStorage.getItem('offerbell_sync_settings'); if (s) followUpDays = JSON.parse(s).followUpReminderDays || 7; } catch {}

    const r: Reminder[] = [];
    for (const c of contacts) {
      if (['drafted', 'spoken', 'stay'].includes(c.status)) continue;
      const days = daysSince(c.lastContact);
      if (days !== null && days >= followUpDays) {
        r.push({
          id: `fu_${c.id}`,
          type: 'follow_up',
          contactName: `${c.fname} ${c.lname}`.trim(),
          contactFirm: c.firm || '',
          contactId: c.id,
          message: `Follow up with ${c.fname}${c.firm ? ` (${c.firm})` : ''} – last contacted ${days} days ago`,
        });
      }
    }
    setReminders(r);
  }, [contacts]);

  const visible = reminders.filter(r => !dismissedIds.has(r.id));
  if (visible.length === 0) return null;

  function dismiss(id: string) {
    setDismissedIds(prev => {
      const next = new Set([...prev, id]);
      localStorage.setItem('offerbell_dismissed_reminders', JSON.stringify([...next]));
      return next;
    });
  }

  function dismissAll() {
    const allIds = visible.map(r => r.id);
    setDismissedIds(prev => {
      const next = new Set([...prev, ...allIds]);
      localStorage.setItem('offerbell_dismissed_reminders', JSON.stringify([...next]));
      return next;
    });
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Reminders</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'var(--surface-2)', color: 'var(--text)' }}>{visible.length}</span>
        </div>
        <button onClick={dismissAll} type="button" style={{ fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>Dismiss all</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible.slice(0, 5).map(r => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: 'var(--surface-2)', border: '1.5px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.message}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
              {onOpenContact && <button type="button" onClick={() => onOpenContact(r.contactId)} style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>Open</button>}
              <button type="button" onClick={() => dismiss(r.id)} style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6, background: 'none', border: '1.5px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'Sora, sans-serif', opacity: 0.6 }}>Dismiss</button>
            </div>
          </div>
        ))}
        {visible.length > 5 && <div style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', padding: '4px 0' }}>+ {visible.length - 5} more</div>}
      </div>
    </div>
  );
}
