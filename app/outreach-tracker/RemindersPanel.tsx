'use client';
import { useState, useEffect } from 'react';

type Contact = { id: string; fname: string; lname: string; firm: string; status: string; lastContact: number | null; };
type Reminder = { id: string; type: string; contactName: string; contactFirm: string; contactId: string; days: number; };

function daysSince(ts: number | null) { if (!ts) return null; return Math.floor((Date.now() - ts) / 864e5); }

export default function RemindersPanel({ contacts, onOpenContact }: { contacts: Contact[]; onOpenContact?: (id: string) => void }) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [collapsed, setCollapsed] = useState(false);

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
          days,
        });
      }
    }
    r.sort((a, b) => b.days - a.days);
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

  const shown = collapsed ? [] : visible.slice(0, 4);

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.04), rgba(245,158,11,0.02))', border: '1.5px solid rgba(217,119,6,0.18)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : 12, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(217,119,6,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#d97706' }}>Needs your attention</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>
              {visible.length} contact{visible.length !== 1 ? 's' : ''} waiting for a follow-up
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={() => setCollapsed(c => !c)} type="button" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', background: 'none', border: '1.5px solid var(--border-2)', borderRadius: 100, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
            {collapsed ? 'Show' : 'Hide'}
          </button>
          {!collapsed && <button onClick={dismissAll} type="button" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif', padding: '5px 4px' }}>Dismiss all</button>}
        </div>
      </div>
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderTop: '1px solid rgba(217,119,6,0.15)', marginTop: 10 }}>
          {shown.map((r, i) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < shown.length - 1 || visible.length > shown.length ? '1px solid rgba(217,119,6,0.12)' : 'none', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: '#d97706', lineHeight: 1, letterSpacing: '-0.3px', flexShrink: 0, minWidth: 38 }}>{r.days}d</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.contactName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{r.contactFirm ? r.contactFirm + ' · ' : ''}since last contact</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {onOpenContact && <button type="button" onClick={() => onOpenContact(r.contactId)} style={{ fontSize: 11, fontWeight: 700, padding: '6px 14px', borderRadius: 100, background: 'var(--text)', border: 'none', color: 'var(--surface)', cursor: 'pointer', fontFamily: 'Sora, sans-serif', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Follow up</button>}
                <button type="button" onClick={() => dismiss(r.id)} title="Dismiss" style={{ fontSize: 16, fontWeight: 400, padding: '2px 8px', borderRadius: 100, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'Sora, sans-serif', lineHeight: 1 }}>×</button>
              </div>
            </div>
          ))}
          {visible.length > shown.length && <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: '10px 0 0', fontWeight: 600 }}>+ {visible.length - shown.length} more</div>}
        </div>
      )}
    </div>
  );
}
