'use client';
import { useMemo } from 'react';

type Contact = {
  id: string;
  fname: string;
  lname: string;
  firm: string;
  role?: string;
  status: string;
  sentAt?: number | null;
  lastFollowUpAt?: number | null;
  lastContact: number | null;
  createdAt?: number;
  scheduledAt?: number | null;
};

function daysSince(ts: number | null | undefined) {
  if (!ts) return null;
  return Math.floor((Date.now() - ts) / 864e5);
}

type ActionItem = {
  id: string;
  contactId: string;
  name: string;
  firm: string;
  role: string;
  days: number;
  headline: string;      // e.g. "Send 2nd follow-up"
  subline: string;       // e.g. "Sent 5 days ago, no reply"
  urgency: 'hot' | 'warm' | 'cold';  // drives color
  ctaLabel: string;      // e.g. "Send follow-up"
  nextStatus: string;    // the status to move to on CTA click
};

function buildActions(contacts: Contact[]): ActionItem[] {
  const out: ActionItem[] = [];
  for (const c of contacts) {
    const name = (c.fname + ' ' + c.lname).trim();
    const firm = c.firm || '';
    const role = c.role || '';
    // Scheduled call today/tomorrow: hot
    if (c.status === 'scheduled' && c.scheduledAt) {
      const dAhead = Math.ceil((c.scheduledAt - Date.now()) / 864e5);
      if (dAhead <= 2 && dAhead >= 0) {
        out.push({
          id: 'sched_' + c.id, contactId: c.id, name, firm, role, days: Math.abs(dAhead),
          headline: dAhead === 0 ? 'Call today' : dAhead === 1 ? 'Call tomorrow' : 'Call in 2 days',
          subline: 'Prep your talking points',
          urgency: 'hot', ctaLabel: 'Open notes', nextStatus: c.status,
        });
        continue;
      }
    }
    // Drafted > 5 days: hot (sitting unsent)
    if (c.status === 'drafted') {
      const d = daysSince(c.createdAt);
      if (d !== null && d >= 5) {
        out.push({
          id: 'draft_' + c.id, contactId: c.id, name, firm, role, days: d,
          headline: 'Send this email',
          subline: `Drafted ${d} days ago, still unsent`,
          urgency: d > 14 ? 'hot' : 'warm',
          ctaLabel: 'Mark as sent', nextStatus: 'sent',
        });
      }
      continue;
    }
    // Sent, no reply after 3+ days: first follow-up
    if (c.status === 'sent') {
      const d = daysSince(c.sentAt || c.lastContact);
      if (d !== null && d >= 3) {
        out.push({
          id: 'fu1_' + c.id, contactId: c.id, name, firm, role, days: d,
          headline: 'Send 1st follow-up',
          subline: `Sent ${d} days ago, no reply`,
          urgency: d > 10 ? 'hot' : d > 6 ? 'warm' : 'cold',
          ctaLabel: 'Log follow-up', nextStatus: 'fu1',
        });
      }
      continue;
    }
    // fu1 -> fu2 after 5 days; fu2 -> fu3 after 7 days
    if (c.status === 'fu1' || c.status === 'fu2') {
      const d = daysSince(c.lastFollowUpAt || c.lastContact);
      const threshold = c.status === 'fu1' ? 5 : 7;
      if (d !== null && d >= threshold) {
        const nextN = c.status === 'fu1' ? 2 : 3;
        out.push({
          id: 'nextfu_' + c.id, contactId: c.id, name, firm, role, days: d,
          headline: `Send ${nextN}${nextN === 2 ? 'nd' : 'rd'} follow-up`,
          subline: `Last follow-up ${d} days ago`,
          urgency: d > threshold + 5 ? 'hot' : 'warm',
          ctaLabel: 'Log follow-up', nextStatus: c.status === 'fu1' ? 'fu2' : 'fu3',
        });
      }
      continue;
    }
    // fu3 without response: mark no-response after 10 days
    if (c.status === 'fu3') {
      const d = daysSince(c.lastFollowUpAt || c.lastContact);
      if (d !== null && d >= 10) {
        out.push({
          id: 'ghost_' + c.id, contactId: c.id, name, firm, role, days: d,
          headline: 'Mark as no response',
          subline: `3 follow-ups, ${d} days silent`,
          urgency: 'cold', ctaLabel: 'Move on', nextStatus: 'noresp',
        });
      }
      continue;
    }
    // Staying in touch: re-engage if untouched 30+ days
    if (c.status === 'stay') {
      const d = daysSince(c.lastContact);
      if (d !== null && d >= 30) {
        out.push({
          id: 'reengage_' + c.id, contactId: c.id, name, firm, role, days: d,
          headline: 'Re-engage',
          subline: `Haven't spoken in ${d} days`,
          urgency: d > 60 ? 'warm' : 'cold',
          ctaLabel: 'Send check-in', nextStatus: 'stay',
        });
      }
    }
  }
  // Hot first, then warm, then cold; within each bucket, longest days first.
  const order = { hot: 0, warm: 1, cold: 2 };
  out.sort((a, b) => order[a.urgency] - order[b.urgency] || b.days - a.days);
  return out;
}

export default function RemindersPanel({
  contacts,
  onOpenContact,
  onQuickAction,
}: {
  contacts: Contact[];
  onOpenContact?: (id: string) => void;
  onQuickAction?: (contactId: string, nextStatus: string) => void;
}) {
  const actions = useMemo(() => buildActions(contacts), [contacts]);
  if (actions.length === 0) return null;

  const hot = actions.filter(a => a.urgency === 'hot').length;
  const top = actions.slice(0, 6);

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 28,
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: hot > 0 ? 'linear-gradient(180deg, rgba(220,38,38,0.04), transparent)' : 'var(--surface-2)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: hot > 0 ? 'rgba(220,38,38,0.1)' : 'rgba(139,37,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hot > 0 ? '#dc2626' : '#8b2500'} strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.6px', textTransform: 'uppercase', color: hot > 0 ? '#dc2626' : '#8b2500' }}>
            Your next moves
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 2, letterSpacing: '-0.1px' }}>
            {actions.length} {actions.length === 1 ? 'action' : 'actions'} waiting
            {hot > 0 && <span style={{ color: '#dc2626', fontWeight: 700 }}> · {hot} urgent</span>}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', flexShrink: 0 }}>
          Sorted by urgency
        </div>
      </div>

      <div>
        {top.map((a, i) => {
          const urgencyColor = a.urgency === 'hot' ? '#dc2626' : a.urgency === 'warm' ? '#d97706' : '#64748b';
          return (
            <div
              key={a.id}
              onClick={() => onOpenContact && onOpenContact(a.contactId)}
              style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr auto auto',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderBottom: i < top.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Days counter */}
              <div style={{ textAlign: 'center', fontFamily: 'Instrument Serif, serif' }}>
                <div style={{ fontSize: 28, fontWeight: 400, color: urgencyColor, lineHeight: 0.95, letterSpacing: '-1px' }}>
                  {a.days}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2 }}>
                  {a.urgency === 'hot' && a.days === 0 ? 'TODAY' : 'DAYS'}
                </div>
              </div>

              {/* Content */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.1px', marginBottom: 3 }}>
                  {a.headline}: <span style={{ fontWeight: 500 }}>{a.name}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {a.firm ? a.firm : 'Unknown firm'}
                  {a.role ? ' · ' + a.role : ''}
                  {' · '}{a.subline}
                </div>
              </div>

              {/* Quick action button */}
              {onQuickAction && a.nextStatus !== 'noresp' ? (
                <button
                  onClick={e => { e.stopPropagation(); onQuickAction(a.contactId, a.nextStatus); }}
                  style={{
                    background: 'var(--text)', color: 'var(--surface)', border: 'none',
                    padding: '7px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.3px', textTransform: 'uppercase', cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif', flexShrink: 0, whiteSpace: 'nowrap',
                  }}
                  type="button"
                >
                  {a.ctaLabel}
                </button>
              ) : onQuickAction ? (
                <button
                  onClick={e => { e.stopPropagation(); onQuickAction(a.contactId, a.nextStatus); }}
                  style={{
                    background: 'rgba(100,116,139,0.08)', color: '#64748b',
                    border: '1px solid rgba(100,116,139,0.2)',
                    padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.3px', textTransform: 'uppercase', cursor: 'pointer',
                    fontFamily: 'Sora, sans-serif', flexShrink: 0, whiteSpace: 'nowrap',
                  }}
                  type="button"
                >
                  {a.ctaLabel}
                </button>
              ) : <div />}

              {/* Open details arrow */}
              <div style={{ color: 'var(--text-3)', fontSize: 18, fontFamily: 'Instrument Serif, serif', lineHeight: 1, flexShrink: 0 }}>&rsaquo;</div>
            </div>
          );
        })}
        {actions.length > top.length && (
          <div style={{ padding: '11px 20px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-3)', borderTop: '1px solid var(--border)' }}>
            + {actions.length - top.length} more {actions.length - top.length === 1 ? 'action' : 'actions'} waiting (scroll down to see all contacts)
          </div>
        )}
      </div>
    </div>
  );
}
