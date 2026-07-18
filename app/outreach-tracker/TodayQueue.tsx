'use client';
import { useState, useEffect, useMemo } from 'react';
import { computeWarmth, WARMTH_COLOR, WARMTH_LABEL } from './warmth';

/* ═══════════════════════════════════════════════════════════════════════════
   TodayQueue

   Replaces RemindersPanel. Same alert-rule engine, but the answer is the
   product rather than a nag box, and the dismissal actually expires.

   The old panel keyed dismissals `fu_${id}` and wrote them to localStorage
   forever, with no expiry and no reset when the contact changed. Dismiss a
   contact once and their follow-up never returned, not at 30 days, not at 60.
   Here a snooze stores a TIMESTAMP and is re-evaluated every render, so it
   lapses on its own. It is also keyed by status, so any status change
   invalidates the old snooze and the contact re-enters the queue.
   ═══════════════════════════════════════════════════════════════════════════ */

export type QContact = {
  id: string; fname: string; lname: string; firm: string; role?: string;
  status: string; lastContact: number | null; angle?: string;
};
type AlertRule = { status: string; enabled: boolean; days: number };
type Urgency = 'overdue' | 'due' | 'today';

const SNOOZE_KEY = 'offerbell_snoozed_contacts';

// Tracker angle labels -> outreach-writer ANGLES keys. Identical sets; only
// the casing differs, which is why these were never connected.
const ANGLE_TO_WRITER: Record<string, string> = {
  'Alumni': 'alumni',
  'Deal Reference': 'deal',
  'Shared Interest': 'interest',
  'Mutual Connection': 'mutual',
  'Career Path': 'career',
  'Cold': 'cold',
};

// What the next touch actually is, per status.
const NEXT_ACTION: Record<string, string> = {
  sent: 'Draft follow-up',
  fu1: 'Draft follow-up',
  fu2: 'Draft follow-up',
  fu3: 'Draft follow-up',
  stay: 'Draft check-in',
  scheduled: 'Open contact',
  drafted: 'Send it',
};

function daysSince(ts: number | null): number | null {
  if (!ts) return null;
  return Math.floor((Date.now() - ts) / 864e5);
}

function loadSnoozes(): Record<string, { until: number; status: string }> {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch {}
  return {};
}

export type QueueItem = { c: QContact; days: number; over: number; urgency: Urgency };

/* One engine, shared. The hero headline, the tab count and the list must never
   disagree, so page.tsx and the panel both read from this. */
export function useOutreachQueue(contacts: QContact[], rules: AlertRule[], alertsEnabled: boolean) {
  const [snoozes, setSnoozes] = useState<Record<string, { until: number; status: string }>>({});

  useEffect(() => { setSnoozes(loadSnoozes()); }, []);

  function snooze(id: string, status: string, days: number) {
    const next = { ...snoozes, [id]: { until: Date.now() + days * 864e5, status } };
    setSnoozes(next);
    try { localStorage.setItem(SNOOZE_KEY, JSON.stringify(next)); } catch {}
  }

  const thresholds = useMemo(() => {
    const t: Record<string, number> = {};
    for (const r of rules) if (r.enabled) t[r.status] = r.days;
    return t;
  }, [rules]);

  const queue = useMemo(() => {
    if (!alertsEnabled) return [] as QueueItem[];
    const out: QueueItem[] = [];
    for (const c of contacts) {
      const threshold = thresholds[c.status];
      if (threshold === undefined) continue;
      const days = daysSince(c.lastContact);
      if (days === null || days < threshold) continue;

      // A snooze only holds while it is unexpired AND the status has not moved.
      const sn = snoozes[c.id];
      if (sn && sn.until > Date.now() && sn.status === c.status) continue;

      const over = days - threshold;
      out.push({ c, days, over, urgency: over > 0 ? 'overdue' : 'due' });
    }
    // Latest first. Being 9 days late matters more than being 1 day late.
    out.sort((a, b) => b.over - a.over);
    return out;
  }, [contacts, thresholds, alertsEnabled, snoozes]);

  const inFlight = useMemo(
    () => contacts.filter(c => thresholds[c.status] !== undefined).length - queue.length,
    [contacts, thresholds, queue]
  );

  // Cooling: relationships you've already built (talked / staying in touch) that
  // are drifting cold from silence. These aren't in the follow-up queue because
  // there's no pending reply to chase - the risk is quiet neglect, not a missed
  // follow-up. This is the recruiting version of "reconnect before it's too late".
  const queuedIds = useMemo(() => new Set(queue.map(q => q.c.id)), [queue]);
  const cooling = useMemo(() => {
    const out: { c: QContact; score: number }[] = [];
    for (const c of contacts) {
      if (queuedIds.has(c.id)) continue;
      if (c.status !== 'stay' && c.status !== 'spoken') continue;
      const w = computeWarmth({ status: c.status, lastContact: c.lastContact });
      // surface the ones that have slipped to neutral/cold, worst first
      if (w.score < 60) out.push({ c, score: w.score });
    }
    out.sort((a, b) => a.score - b.score);
    return out.slice(0, 5);
  }, [contacts, queuedIds]);

  return { queue, cooling, snooze, thresholds, inFlight: Math.max(inFlight, 0) };
}

export default function TodayQueue({
  queue, cooling, thresholds, inFlight, alertsEnabled, totalContacts, statusLabel, onSnooze, onOpenContact,
}: {
  queue: QueueItem[];
  cooling: { c: QContact; score: number }[];
  thresholds: Record<string, number>;
  inFlight: number;
  alertsEnabled: boolean;
  totalContacts: number;
  statusLabel: (key: string, fallback: string) => string;
  onSnooze: (id: string, status: string, days: number) => void;
  onOpenContact: (id: string) => void;
}) {
  const [menuFor, setMenuFor] = useState<string | null>(null);

  useEffect(() => {
    if (!menuFor) return;
    const close = () => setMenuFor(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuFor]);

  const overdue = queue.filter(q => q.urgency === 'overdue');
  const dueToday = queue.filter(q => q.urgency === 'due');

  function why(status: string, days: number, over: number, threshold: number) {
    if (status === 'stay') return `${days} days quiet. Keep the relationship warm.`;
    if (over === 0) return `Due today. Last touch was ${days} days ago.`;
    return `No reply in ${days} days. Your rule chases at ${threshold}.`;
  }

  function writerHref(c: QContact) {
    const p = new URLSearchParams();
    p.set('name', `${c.fname} ${c.lname}`.trim());
    if (c.firm) p.set('firm', c.firm);
    if (c.role) p.set('role', c.role);
    const a = c.angle ? ANGLE_TO_WRITER[c.angle] : '';
    if (a) p.set('angle', a);
    return `/outreach-writer?${p.toString()}`;
  }

  function Row({ q }: { q: QueueItem }) {
    const { c, days, over, urgency } = q;
    const action = NEXT_ACTION[c.status] || 'Open contact';
    const isDraftable = action.startsWith('Draft');
    const tag = urgency === 'overdue' ? `${over}d overdue` : 'Due today';
    return (
      <div className={`ot-q-row ot-urg-${urgency}`}>
        <span className="ot-q-mark" />
        <span className="ot-q-av" onClick={() => onOpenContact(c.id)}>
          {((c.fname || '')[0] || '').toUpperCase()}{((c.lname || '')[0] || '').toUpperCase()}
        </span>
        <span className="ot-q-main" onClick={() => onOpenContact(c.id)}>
          <span className="ot-q-top">
            <span className="ot-q-name">{`${c.fname} ${c.lname}`.trim()}</span>
            <span className="ot-q-firm">{[c.firm, c.role].filter(Boolean).join(' / ')}</span>
          </span>
          <span className="ot-q-why">{why(c.status, days, over, thresholds[c.status] ?? 0)}</span>
        </span>
        <span className="ot-q-state">
          <span className="ot-q-tag">{tag}</span>
          <span className="ot-q-status">
            {(() => {
              const w = computeWarmth({ status: c.status, lastContact: c.lastContact });
              return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginRight: 8 }} title={`Warmth ${w.score}/100`}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: WARMTH_COLOR[w.band] }} />
                <span style={{ color: WARMTH_COLOR[w.band], fontWeight: 600 }}>{WARMTH_LABEL[w.band]}</span>
              </span>;
            })()}
            {statusLabel(c.status, c.status)}{c.angle ? ` / ${c.angle}` : ''}
          </span>
        </span>
        <span className="ot-q-act" onClick={e => e.stopPropagation()}>
          {isDraftable ? (
            <a className="ot-btn ot-btn-primary" href={writerHref(c)}>{action}</a>
          ) : (
            <button type="button" className="ot-btn ot-btn-primary" onClick={() => onOpenContact(c.id)}>{action}</button>
          )}
          <button
            type="button"
            className="ot-btn ot-btn-ghost"
            onClick={e => { e.stopPropagation(); setMenuFor(menuFor === c.id ? null : c.id); }}
          >
            Snooze
          </button>
          {menuFor === c.id && (
            <div className="ot-snooze-menu" onClick={e => e.stopPropagation()}>
              {[{ d: 1, l: 'Tomorrow' }, { d: 3, l: 'In 3 days' }, { d: 7, l: 'Next week' }].map(o => (
                <button key={o.d} type="button" className="ot-snooze-item" onClick={() => { onSnooze(c.id, c.status, o.d); setMenuFor(null); }}>
                  {o.l}
                </button>
              ))}
            </div>
          )}
        </span>
      </div>
    );
  }

  if (!alertsEnabled) {
    return (
      <div className="ot-done">
        Follow-up alerts are switched off, so there is no queue. Turn them back on under <b>Customize</b> and this becomes your daily list.
      </div>
    );
  }

  if (queue.length === 0 && cooling.length === 0) {
    return (
      <div className="ot-done">
        {totalContacts === 0
          ? <>Nothing tracked yet. Add a contact and the queue builds itself from your follow-up rules.</>
          : <>Nothing is due. <b>{inFlight}</b> {inFlight === 1 ? 'contact is' : 'contacts are'} inside the follow-up window you set, so they are not your problem today.</>}
      </div>
    );
  }

  return (
    <>
      {overdue.length > 0 && (
        <>
          <div className="ot-sec">
            <h2 className="ot-sec-name">Overdue</h2>
            <span className="ot-sec-note">Past the follow-up window you set. These decay fast.</span>
          </div>
          <div className="ot-q">
            {overdue.map(q => <Row key={q.c.id} q={q} />)}
          </div>
        </>
      )}
      {dueToday.length > 0 && (
        <>
          <div className="ot-sec">
            <h2 className="ot-sec-name">Due today</h2>
            <span className="ot-sec-note">Right on the window. Send these and they stay warm.</span>
          </div>
          <div className="ot-q">
            {dueToday.map(q => <Row key={q.c.id} q={q} />)}
          </div>
        </>
      )}
      {cooling.length > 0 && (
        <>
          <div className="ot-sec">
            <h2 className="ot-sec-name">Going cold</h2>
            <span className="ot-sec-note">People you've already built with, drifting quiet. Reconnect before it's too late.</span>
          </div>
          <div className="ot-q">
            {cooling.map(({ c }) => {
              const w = computeWarmth({ status: c.status, lastContact: c.lastContact });
              const days = daysSince(c.lastContact);
              return (
                <div key={c.id} className="ot-q-row ot-urg-due">
                  <span className="ot-q-mark" style={{ background: WARMTH_COLOR[w.band] }} />
                  <span className="ot-q-av" onClick={() => onOpenContact(c.id)}>
                    {((c.fname || '')[0] || '').toUpperCase()}{((c.lname || '')[0] || '').toUpperCase()}
                  </span>
                  <span className="ot-q-main" onClick={() => onOpenContact(c.id)}>
                    <span className="ot-q-top">
                      <span className="ot-q-name">{`${c.fname} ${c.lname}`.trim()}</span>
                      <span className="ot-q-firm">{[c.firm, c.role].filter(Boolean).join(' / ')}</span>
                    </span>
                    <span className="ot-q-why">{days === null ? 'No recent contact.' : `Last spoke ${days} days ago. Warmth is fading.`}</span>
                  </span>
                  <span className="ot-q-state">
                    <span className="ot-q-tag" style={{ color: WARMTH_COLOR[w.band] }}>{WARMTH_LABEL[w.band]}</span>
                    <span className="ot-q-status">{statusLabel(c.status, c.status)}</span>
                  </span>
                  <span className="ot-q-act" onClick={e => e.stopPropagation()}>
                    <a className="ot-btn ot-btn-primary" href={`/outreach-writer?${new URLSearchParams({ name: `${c.fname} ${c.lname}`.trim(), ...(c.firm ? { firm: c.firm } : {}), ...(c.role ? { role: c.role } : {}) }).toString()}`}>Reconnect</a>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="ot-done">
        <b>{inFlight}</b> {inFlight === 1 ? 'contact is' : 'contacts are'} inside their follow-up window. Not your problem today.
      </div>
    </>
  );
}
