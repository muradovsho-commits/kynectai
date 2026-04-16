'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef, useMemo } from 'react';
import '../contact-finder/contact-finder.css';
import RemindersPanel from './RemindersPanel';

// ══════════════════════════════════════════════════════════════
// TYPES & CONSTANTS
// ══════════════════════════════════════════════════════════════

type Contact = {
  id: string;
  fname: string;
  lname: string;
  firm: string;
  role: string;
  status: string;
  angle: string;
  notes: string;
  quality: string;
  createdAt: number;
  lastContact: number | null;
  sentAt: number | null;
  lastFollowUpAt: number | null;
  linkedin: string;
  scheduledAt: number | null;
};

const STATUSES: Record<string, { label: string; short: string; color: string; group: string }> = {
  drafted:   { label: 'Drafted',          short: 'Draft',      color: '#64748b', group: 'pipeline' },
  sent:      { label: 'Sent',             short: 'Sent',       color: '#3b82f6', group: 'pipeline' },
  fu1:       { label: 'Followed Up 1x',   short: 'FU 1',       color: '#f59e0b', group: 'pipeline' },
  fu2:       { label: 'Followed Up 2x',   short: 'FU 2',       color: '#ea580c', group: 'pipeline' },
  fu3:       { label: 'Followed Up 3x',   short: 'FU 3',       color: '#dc2626', group: 'pipeline' },
  scheduled: { label: 'Scheduled',        short: 'Scheduled',  color: '#6366f1', group: 'active' },
  spoken:    { label: 'Spoken With',      short: 'Spoken',     color: '#0c0c0c', group: 'won' },
  stay:      { label: 'Staying in Touch', short: 'Keeping warm', color: '#16a34a', group: 'won' },
  noresp:    { label: 'No Response',      short: 'No reply',   color: '#94a3b8', group: 'closed' },
};

// Ordered list of statuses for the pipeline funnel
const PIPELINE_ORDER = ['drafted', 'sent', 'fu1', 'fu2', 'fu3', 'scheduled', 'spoken', 'stay'];

// Group definitions (for the grouped table view)
const GROUPS = [
  { key: 'urgent',   label: 'Urgent',          subtitle: 'Follow up today',             color: '#dc2626' },
  { key: 'active',   label: 'In motion',       subtitle: 'Drafted, sent, following up', color: '#3b82f6' },
  { key: 'won',      label: 'Spoken with',     subtitle: 'Keep these warm',             color: '#16a34a' },
  { key: 'closed',   label: 'No response',     subtitle: 'Pipeline dead ends',          color: '#94a3b8' },
];

const AVATAR_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6','#f97316','#06b6d4'];

// ══════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════

function colorFor(n: string) {
  let h = 0;
  for (const c of n) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(f: string, l: string) {
  return ((f || '')[0] || '').toUpperCase() + ((l || '')[0] || '').toUpperCase();
}
function daysSince(ts: number | null | undefined) {
  if (!ts) return null;
  return Math.floor((Date.now() - ts) / 864e5);
}
function formatRelative(ts: number | null | undefined): string {
  if (!ts) return '-';
  const d = daysSince(ts);
  if (d === null) return '-';
  if (d === 0) return 'today';
  if (d === 1) return 'yesterday';
  if (d < 7) return d + ' days ago';
  if (d < 30) return Math.floor(d / 7) + 'w ago';
  if (d < 365) return Math.floor(d / 30) + 'mo ago';
  return Math.floor(d / 365) + 'y ago';
}

// Figure out which bucket a contact lives in (for grouping)
function bucketOf(c: Contact): 'urgent' | 'active' | 'won' | 'closed' {
  if (c.status === 'noresp') return 'closed';
  if (c.status === 'spoken' || c.status === 'stay') return 'won';
  // Urgent: follow-up overdue
  if (c.status === 'sent') {
    const d = daysSince(c.sentAt || c.lastContact);
    if (d !== null && d >= 3) return 'urgent';
  }
  if (c.status === 'fu1' || c.status === 'fu2') {
    const d = daysSince(c.lastFollowUpAt || c.lastContact);
    const threshold = c.status === 'fu1' ? 5 : 7;
    if (d !== null && d >= threshold) return 'urgent';
  }
  if (c.status === 'drafted') {
    const d = daysSince(c.createdAt);
    if (d !== null && d >= 5) return 'urgent';
  }
  return 'active';
}

// ══════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════

export default function OutreachTrackerPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isDark, setIsDark] = useState(false);

  const [search, setSearch] = useState('');
  const [firmFilter, setFirmFilter] = useState('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(['closed']));

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContact, setDrawerContact] = useState<Contact | null>(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerQuality, setDrawerQuality] = useState('');
  const [drawerLinkedin, setDrawerLinkedin] = useState('');
  const [drawerStatus, setDrawerStatus] = useState('');
  const [drawerDate, setDrawerDate] = useState('');

  // Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [aFname, setAFname] = useState('');
  const [aLname, setALname] = useState('');
  const [aFirm, setAFirm] = useState('');
  const [aRole, setARole] = useState('');
  const [aStatus, setAStatus] = useState('drafted');
  const [aAngle, setAAngle] = useState('');
  const [aNotes, setANotes] = useState('');
  const [aLinkedin, setALinkedin] = useState('');
  const [aDate, setADate] = useState('');

  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load + persist
  useEffect(() => {
    const saved = localStorage.getItem('offerbell_tracker_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContacts(parsed.map((c: any) => ({ ...c, linkedin: c.linkedin || '', scheduledAt: c.scheduledAt || null })));
      } catch {}
    }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
  }, []);

  function persist(next: Contact[]) {
    localStorage.setItem('offerbell_tracker_v3', JSON.stringify(next));
  }

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }

  // Quick status change (used from drawer + from "next moves" inline buttons)
  function quickMove(id: string, nextStatus: string) {
    const now = Date.now();
    const updated = contacts.map(c => {
      if (c.id !== id) return c;
      const patch: Partial<Contact> = { status: nextStatus, lastContact: now };
      if (nextStatus === 'sent' && !c.sentAt) patch.sentAt = now;
      if (['fu1', 'fu2', 'fu3'].includes(nextStatus)) patch.lastFollowUpAt = now;
      if (nextStatus === 'scheduled') patch.scheduledAt = now;
      return { ...c, ...patch } as Contact;
    });
    setContacts(updated);
    persist(updated);
    const label = STATUSES[nextStatus]?.label || nextStatus;
    const contact = contacts.find(x => x.id === id);
    const name = contact ? contact.fname + ' ' + contact.lname : 'Contact';
    showToast(`${name.trim()} moved to ${label}`);
  }

  // ── Drawer open / save / delete ──
  function openDrawer(c: Contact) {
    setDrawerContact(c);
    setDrawerNotes(c.notes || '');
    setDrawerQuality(c.quality || '');
    setDrawerStatus(c.status);
    setDrawerLinkedin(c.linkedin || '');
    const sourceTs = c.status === 'sent' ? c.sentAt
      : c.status === 'scheduled' ? c.scheduledAt
      : ['fu1','fu2','fu3'].includes(c.status) ? c.lastFollowUpAt
      : c.status === 'drafted' ? c.createdAt
      : c.lastContact;
    setDrawerDate(sourceTs ? new Date(sourceTs).toISOString().split('T')[0] : '');
    setDrawerOpen(true);
  }

  function saveDrawer() {
    if (!drawerContact) return;
    const updated = contacts.map(c => {
      if (c.id !== drawerContact.id) return c;
      let lastContact = c.lastContact;
      let sentAt = c.sentAt;
      let lastFollowUpAt = c.lastFollowUpAt;
      let createdAt = c.createdAt;
      let scheduledAt = c.scheduledAt;
      const statusChanged = drawerStatus !== c.status;
      if (drawerDate) {
        const dateTs = new Date(drawerDate).getTime();
        if (drawerStatus === 'drafted') createdAt = dateTs;
        else if (drawerStatus === 'sent') { sentAt = dateTs; lastContact = dateTs; }
        else if (drawerStatus === 'scheduled') scheduledAt = dateTs;
        else if (['fu1','fu2','fu3'].includes(drawerStatus)) { lastFollowUpAt = dateTs; lastContact = dateTs; }
        else lastContact = dateTs;
      } else if (statusChanged) {
        const now = Date.now();
        if (drawerStatus === 'sent' && !sentAt) { sentAt = now; lastContact = now; }
        else if (drawerStatus === 'scheduled' && !scheduledAt) scheduledAt = now;
        else if (['fu1','fu2','fu3'].includes(drawerStatus)) { lastFollowUpAt = now; lastContact = now; }
        else if (drawerStatus !== 'drafted') lastContact = now;
      }
      return {
        ...c,
        notes: drawerNotes,
        quality: drawerQuality,
        status: drawerStatus,
        linkedin: drawerLinkedin.trim(),
        lastContact, sentAt, lastFollowUpAt, createdAt, scheduledAt,
      };
    });
    setContacts(updated); persist(updated);
    setDrawerOpen(false);
    showToast('Saved');
  }

  function deleteContact() {
    if (!drawerContact) return;
    if (!confirm('Remove ' + drawerContact.fname + ' ' + drawerContact.lname + '?')) return;
    const updated = contacts.filter(c => c.id !== drawerContact.id);
    setContacts(updated); persist(updated);
    setDrawerOpen(false);
    showToast('Removed');
  }

  // ── Add new contact ──
  function saveAdd() {
    if (!aFname.trim()) return;
    const now = Date.now();
    const dateTs = aDate ? new Date(aDate).getTime() : now;
    const c: Contact = {
      id: now.toString(),
      fname: aFname.trim(), lname: aLname.trim(),
      firm: aFirm.trim(), role: aRole.trim(),
      status: aStatus, angle: aAngle,
      notes: aNotes.trim(), quality: '',
      createdAt: aStatus === 'drafted' ? dateTs : now,
      lastContact: aStatus !== 'drafted' ? dateTs : null,
      sentAt: aStatus === 'sent' ? dateTs : null,
      lastFollowUpAt: ['fu1','fu2','fu3'].includes(aStatus) ? dateTs : null,
      scheduledAt: aStatus === 'scheduled' ? dateTs : null,
      linkedin: aLinkedin.trim(),
    };
    const updated = [...contacts, c];
    setContacts(updated); persist(updated);
    setModalOpen(false);
    setAFname(''); setALname(''); setAFirm(''); setARole('');
    setAStatus('drafted'); setAAngle(''); setANotes(''); setALinkedin(''); setADate('');
    showToast(c.fname + ' added');
  }

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  // ── Filters + grouping ──
  const uniqueFirms = useMemo(() => {
    const set = new Set(contacts.map(c => c.firm).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts.filter(c => {
      if (q && !((c.fname + ' ' + c.lname + ' ' + c.firm + ' ' + c.role).toLowerCase().includes(q))) return false;
      if (firmFilter !== 'all' && c.firm !== firmFilter) return false;
      return true;
    });
  }, [contacts, search, firmFilter]);

  const grouped = useMemo(() => {
    const out: Record<string, Contact[]> = { urgent: [], active: [], won: [], closed: [] };
    for (const c of filtered) out[bucketOf(c)].push(c);
    // Within each group, sort by status order then by staleness
    for (const k of Object.keys(out)) {
      out[k].sort((a, b) => {
        const ai = PIPELINE_ORDER.indexOf(a.status);
        const bi = PIPELINE_ORDER.indexOf(b.status);
        if (ai !== bi) return ai - bi;
        const ad = daysSince(a.lastContact || a.createdAt) || 0;
        const bd = daysSince(b.lastContact || b.createdAt) || 0;
        return bd - ad;
      });
    }
    return out;
  }, [filtered]);

  // ── Pipeline funnel counts ──
  const pipelineCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const s of PIPELINE_ORDER) out[s] = 0;
    for (const c of contacts) {
      if (out[c.status] !== undefined) out[c.status]++;
    }
    return out;
  }, [contacts]);

  const totalContacts = contacts.length;
  const spokenCount = contacts.filter(c => c.status === 'spoken' || c.status === 'stay').length;
  const sentCount = contacts.filter(c => c.status !== 'drafted').length;
  const responseRate = sentCount > 0 ? Math.round((spokenCount / sentCount) * 100) : 0;

  // Weekly progress
  const weekStats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 864e5;
    let emailsSent = 0, followUps = 0, calls = 0;
    for (const c of contacts) {
      if (c.sentAt && c.sentAt >= weekAgo) emailsSent++;
      if (c.lastFollowUpAt && c.lastFollowUpAt >= weekAgo) followUps++;
      if ((c.status === 'spoken' || c.status === 'stay') && c.lastContact && c.lastContact >= weekAgo) calls++;
    }
    return { emailsSent, followUps, calls };
  }, [contacts]);

  // ── EMPTY STATE (no contacts at all) ──
  if (totalContacts === 0) {
    return (
      <>
        <div className="app">
          <Sidebar activePage="outreach-tracker" />
          <main className="main" style={{ padding: '40px 40px 60px' }}>
            <div style={{ maxWidth: 640, margin: '80px auto 0', textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(139,37,0,0.08), rgba(217,119,6,0.06))',
                border: '1px solid rgba(139,37,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b2500" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 12, lineHeight: 1.05 }}>
                Your network, <em style={{ fontStyle: 'italic', color: '#8b2500' }}>organized.</em>
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.6 }}>
                Stop tracking outreach in a messy spreadsheet. Add every banker, analyst, and alum you're talking to - we'll remind you when to follow up.
              </div>
              <button onClick={() => setModalOpen(true)} style={{
                background: 'var(--text)', color: 'var(--surface)', border: 'none',
                padding: '14px 32px', borderRadius: 100,
                fontSize: 13, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 14px -4px rgba(0,0,0,0.25)',
              }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add your first contact
              </button>

              {/* Mini feature tease */}
              <div style={{
                marginTop: 56, padding: '24px 28px',
                background: 'var(--surface)',
                border: '1px solid var(--border)', borderRadius: 16, textAlign: 'left',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8b2500', marginBottom: 14 }}>
                  What this does
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    { t: 'Auto follow-up reminders', d: "We'll tell you when it's time to nudge someone." },
                    { t: 'Pipeline at a glance', d: 'See who\'s drafted, sent, waiting, spoken with.' },
                    { t: 'Days since last contact', d: 'Never lose a relationship to silence again.' },
                    { t: 'One-click status updates', d: "Spoke with them? Tap. Move on." },
                  ].map(f => (
                    <div key={f.t}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{f.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>{f.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
        {modalOpen && <AddModal
          isDark={isDark} onClose={() => setModalOpen(false)} onSave={saveAdd}
          {...{ aFname, setAFname, aLname, setALname, aFirm, setAFirm, aRole, setARole,
            aStatus, setAStatus, aAngle, setAAngle, aNotes, setANotes, aLinkedin, setALinkedin, aDate, setADate }}
        />}
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // MAIN VIEW
  // ══════════════════════════════════════════════════════════════

  return (
    <>
      <div className="app">
        <Sidebar activePage="outreach-tracker" />

        <main className="main" style={{ padding: '36px 40px 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

            {/* ─── HEADER ─── */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8b2500', marginBottom: 6 }}>
                  Your Network
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, letterSpacing: '-1px', color: 'var(--text)', lineHeight: 1, marginBottom: 8 }}>
                  Outreach <em style={{ fontStyle: 'italic' }}>Tracker</em>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>
                  Every conversation, one place. Never let a relationship go cold.
                </div>
              </div>
              <button onClick={() => setModalOpen(true)} style={{
                background: 'var(--text)', color: 'var(--surface)', border: 'none',
                padding: '12px 24px', borderRadius: 100,
                fontSize: 12, fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
                boxShadow: '0 3px 10px -3px rgba(0,0,0,0.18)',
              }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Contact
              </button>
            </div>

            {/* ─── YOUR NEXT MOVES (reminders) ─── */}
            <RemindersPanel
              contacts={contacts}
              onOpenContact={(id) => {
                const c = contacts.find(ct => ct.id === id);
                if (c) openDrawer(c);
              }}
              onQuickAction={quickMove}
            />

            {/* ─── PIPELINE FUNNEL ─── */}
            <div style={{
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              borderRadius: 16,
              padding: '20px 24px',
              marginBottom: 28,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.6px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 4 }}>
                    Pipeline
                  </div>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text)', letterSpacing: '-0.4px' }}>
                    {totalContacts} {totalContacts === 1 ? 'contact' : 'contacts'} · <em style={{ color: '#16a34a' }}>{responseRate}%</em> to conversation
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', fontStyle: 'italic' }}>
                  {spokenCount} {spokenCount === 1 ? 'person' : 'people'} spoken with
                </div>
              </div>

              {/* Funnel bars */}
              <div style={{ display: 'flex', gap: 4, height: 36, borderRadius: 8, overflow: 'hidden' }}>
                {PIPELINE_ORDER.map(s => {
                  const count = pipelineCounts[s] || 0;
                  if (count === 0) return null;
                  const pct = (count / totalContacts) * 100;
                  const { short, color } = STATUSES[s];
                  return (
                    <div
                      key={s}
                      style={{
                        flex: pct,
                        minWidth: pct < 5 ? 32 : 0,
                        background: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '0 8px',
                        color: '#fff',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.2px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}
                      title={`${STATUSES[s].label}: ${count}`}
                    >
                      {count >= 3 ? `${short} · ${count}` : count}
                    </div>
                  );
                })}
              </div>

              {/* Funnel legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px', marginTop: 14 }}>
                {PIPELINE_ORDER.map(s => {
                  const count = pipelineCounts[s] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-2)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: STATUSES[s].color }} />
                      <span style={{ fontWeight: 600 }}>{STATUSES[s].label}</span>
                      <span style={{ color: 'var(--text-3)', fontWeight: 700 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── WEEKLY PROGRESS ─── */}
            {(weekStats.emailsSent + weekStats.followUps + weekStats.calls) > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(22,163,74,0.05), rgba(16,185,129,0.02))',
                border: '1px solid rgba(22,163,74,0.15)',
                borderRadius: 14,
                padding: '14px 20px',
                marginBottom: 28,
                display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#16a34a' }}>This week</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginTop: 1 }}>Keep the momentum going</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  {[
                    { lbl: 'Emails sent', val: weekStats.emailsSent },
                    { lbl: 'Follow-ups', val: weekStats.followUps },
                    { lbl: 'Conversations', val: weekStats.calls },
                  ].map(s => (
                    <div key={s.lbl} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 4 }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SEARCH + FIRM FILTER ─── */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1.5px solid var(--border-2)', borderRadius: 100, padding: '8px 14px', flex: '1 1 280px', maxWidth: 420 }}>
                <svg width="14" height="14" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, firm, role..."
                  style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', outline: 'none', flex: 1, width: '100%' }}
                />
                {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>}
              </div>
              {uniqueFirms.length > 2 && (
                <select
                  value={firmFilter}
                  onChange={e => setFirmFilter(e.target.value)}
                  style={{
                    padding: '8px 16px', borderRadius: 100, border: '1.5px solid var(--border-2)',
                    background: firmFilter !== 'all' ? 'var(--text)' : 'var(--surface)',
                    color: firmFilter !== 'all' ? 'var(--surface)' : 'var(--text-2)',
                    fontSize: 12, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="all">All firms</option>
                  {uniqueFirms.filter(f => f !== 'all').map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              )}
            </div>

            {/* ─── GROUPED CONTACT TABLE ─── */}
            {filtered.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14 }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic', color: 'var(--text)', marginBottom: 6 }}>Nothing matches</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Try clearing your search or firm filter</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {GROUPS.map(g => {
                  const list = grouped[g.key];
                  if (!list || list.length === 0) return null;
                  const isCollapsed = collapsedGroups.has(g.key);
                  return (
                    <div key={g.key} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                      {/* Group header */}
                      <button
                        onClick={() => {
                          setCollapsedGroups(prev => {
                            const next = new Set(prev);
                            if (next.has(g.key)) next.delete(g.key);
                            else next.add(g.key);
                            return next;
                          });
                        }}
                        type="button"
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                          padding: '14px 20px',
                          background: 'var(--surface-2)',
                          border: 'none', borderBottom: isCollapsed ? 'none' : '1px solid var(--border)',
                          cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ width: 4, height: 28, background: g.color, borderRadius: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.1px' }}>
                            {g.label}
                            <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 700, color: 'var(--text-3)', padding: '2px 8px', background: 'var(--surface)', borderRadius: 100 }}>{list.length}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{g.subtitle}</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>

                      {!isCollapsed && (
                        <div>
                          {list.map((c, i) => {
                            const st = STATUSES[c.status] || STATUSES.drafted;
                            const color = colorFor(c.fname + c.lname);
                            const { relative, isStale } = activityFor(c);
                            return (
                              <div
                                key={c.id}
                                onClick={() => openDrawer(c)}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '44px 1fr auto auto auto',
                                  alignItems: 'center',
                                  gap: 14,
                                  padding: '14px 20px',
                                  borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none',
                                  cursor: 'pointer',
                                  transition: 'background 0.12s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                              >
                                {/* Avatar */}
                                <div style={{
                                  width: 38, height: 38, borderRadius: 10,
                                  background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                                }}>
                                  {initials(c.fname, c.lname) || '?'}
                                </div>

                                {/* Name + firm + notes preview */}
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {c.fname} {c.lname}
                                    </div>
                                    {c.linkedin && (
                                      <a
                                        href={c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin}
                                        target="_blank" rel="noopener noreferrer"
                                        onClick={e => e.stopPropagation()}
                                        style={{ color: '#0a66c2', flexShrink: 0, lineHeight: 0 }}
                                        title="Open LinkedIn"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                                      </a>
                                    )}
                                  </div>
                                  <div style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {c.firm || 'Unknown firm'}
                                    {c.role ? ' · ' + c.role : ''}
                                    {c.notes ? ' · ' : ''}
                                    {c.notes && <span style={{ fontStyle: 'italic' }}>"{c.notes.slice(0, 50)}{c.notes.length > 50 ? '...' : ''}"</span>}
                                  </div>
                                </div>

                                {/* Status badge */}
                                <div style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  padding: '4px 10px', borderRadius: 100,
                                  background: st.color + '14',
                                  border: `1px solid ${st.color}33`,
                                  color: st.color,
                                  fontSize: 10, fontWeight: 800, letterSpacing: '0.3px',
                                  whiteSpace: 'nowrap', flexShrink: 0,
                                }}>
                                  <span style={{ width: 5, height: 5, borderRadius: 50, background: st.color }} />
                                  {st.short}
                                </div>

                                {/* Relative time */}
                                <div style={{
                                  fontSize: 11, fontWeight: isStale ? 700 : 500,
                                  color: isStale ? '#dc2626' : 'var(--text-3)',
                                  whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                                  flexShrink: 0,
                                }}>
                                  {relative}
                                </div>

                                {/* Chevron */}
                                <div style={{ color: 'var(--text-3)', fontSize: 18, fontFamily: 'Instrument Serif, serif', lineHeight: 1, flexShrink: 0 }}>&rsaquo;</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── THEME TOGGLE (persistent at bottom) ─── */}
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
              <button onClick={toggleTheme} type="button" style={{
                background: 'none', border: '1px solid var(--border)',
                padding: '8px 16px', borderRadius: 100,
                fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {isDark ? '☀' : '◐'} {isDark ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════ ADD MODAL ══════════ */}
      {modalOpen && <AddModal
        isDark={isDark} onClose={() => setModalOpen(false)} onSave={saveAdd}
        {...{ aFname, setAFname, aLname, setALname, aFirm, setAFirm, aRole, setARole,
          aStatus, setAStatus, aAngle, setAAngle, aNotes, setANotes, aLinkedin, setALinkedin, aDate, setADate }}
      />}

      {/* ══════════ EDIT DRAWER ══════════ */}
      <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 420, maxWidth: '100vw',
        background: 'var(--surface)',
        borderLeft: '1.5px solid var(--border)',
        zIndex: 50,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s ease',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
      }}>
        {drawerContact && (
          <>
            <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
              <button onClick={() => setDrawerOpen(false)} style={{
                position: 'absolute', top: 16, right: 16,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 22, color: 'var(--text-3)', lineHeight: 1, padding: 4,
              }}>×</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: colorFor(drawerContact.fname + drawerContact.lname),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initials(drawerContact.fname, drawerContact.lname)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text)', letterSpacing: '-0.3px', lineHeight: 1.15 }}>
                    {drawerContact.fname} {drawerContact.lname}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {[drawerContact.role, drawerContact.firm].filter(Boolean).join(' · ') || 'No firm yet'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Quick actions */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Quick Actions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    { k: 'sent',      label: 'Mark as sent',     color: '#3b82f6' },
                    { k: 'fu1',       label: 'Log follow-up',    color: '#f59e0b' },
                    { k: 'scheduled', label: 'Call scheduled',   color: '#6366f1' },
                    { k: 'spoken',    label: 'Spoke with them',  color: '#16a34a' },
                  ].map(a => (
                    <button
                      key={a.k}
                      onClick={() => { setDrawerStatus(a.k); setDrawerDate(new Date().toISOString().split('T')[0]); }}
                      type="button"
                      style={{
                        padding: '10px 12px', borderRadius: 10,
                        border: drawerStatus === a.k ? `1.5px solid ${a.color}` : '1.5px solid var(--border)',
                        background: drawerStatus === a.k ? a.color + '14' : 'var(--surface)',
                        color: drawerStatus === a.k ? a.color : 'var(--text-2)',
                        fontSize: 12, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                        display: 'flex', alignItems: 'center', gap: 8,
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: 50, background: a.color, flexShrink: 0 }} />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full status grid */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  {Object.entries(STATUSES).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => {
                        setDrawerStatus(k);
                        if (['spoken','stay','scheduled'].includes(k) && !drawerDate) {
                          setDrawerDate(new Date().toISOString().split('T')[0]);
                        }
                      }}
                      type="button"
                      style={{
                        padding: '8px 10px', borderRadius: 8,
                        border: '1.5px solid',
                        borderColor: drawerStatus === k ? 'var(--text)' : 'var(--border)',
                        background: drawerStatus === k ? 'var(--text)' : 'var(--surface)',
                        color: drawerStatus === k ? 'var(--surface)' : 'var(--text-2)',
                        fontSize: 11.5, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                        textAlign: 'center',
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>
                  {drawerStatus === 'drafted' ? 'Date drafted'
                    : drawerStatus === 'sent' ? 'Date sent'
                    : drawerStatus === 'scheduled' ? 'Scheduled for'
                    : ['fu1','fu2','fu3'].includes(drawerStatus) ? 'Date of last follow-up'
                    : ['spoken','stay'].includes(drawerStatus) ? 'Date spoken'
                    : 'Date'}
                </div>
                <input
                  type="date"
                  value={drawerDate}
                  onChange={e => setDrawerDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1.5px solid var(--border-2)', borderRadius: 8,
                    fontSize: 13, fontFamily: 'Sora, sans-serif',
                    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
                    colorScheme: isDark ? 'dark' : 'light',
                  }}
                />
              </div>

              {/* Conversation quality */}
              {['spoken', 'stay'].includes(drawerStatus) && (
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>How did it go?</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { k: 'great', label: 'Great', color: '#16a34a' },
                      { k: 'ok',    label: 'OK',    color: '#d97706' },
                      { k: 'cold',  label: 'Cold',  color: '#64748b' },
                    ].map(q => (
                      <button
                        key={q.k}
                        onClick={() => setDrawerQuality(q.k)}
                        type="button"
                        style={{
                          flex: 1, padding: '10px',
                          borderRadius: 8,
                          border: '1.5px solid',
                          borderColor: drawerQuality === q.k ? q.color : 'var(--border)',
                          background: drawerQuality === q.k ? q.color + '18' : 'var(--surface)',
                          color: drawerQuality === q.k ? q.color : 'var(--text-2)',
                          fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                        }}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Notes</div>
                <textarea
                  value={drawerNotes}
                  onChange={e => setDrawerNotes(e.target.value)}
                  placeholder="What did you talk about? What did they mention? Follow-up items?"
                  style={{
                    width: '100%', padding: '12px',
                    border: '1.5px solid var(--border-2)', borderRadius: 10,
                    fontSize: 13, fontFamily: 'Sora, sans-serif',
                    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
                    resize: 'vertical', minHeight: 110, lineHeight: 1.6,
                  }}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>LinkedIn</div>
                <input
                  value={drawerLinkedin}
                  onChange={e => setDrawerLinkedin(e.target.value)}
                  placeholder="linkedin.com/in/name"
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1.5px solid var(--border-2)', borderRadius: 8,
                    fontSize: 13, fontFamily: 'Sora, sans-serif',
                    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
                  }}
                />
              </div>

              {/* Timeline info */}
              <div style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 11, color: 'var(--text-3)', lineHeight: 1.7 }}>
                {drawerContact.sentAt && <div>Sent: {new Date(drawerContact.sentAt).toLocaleDateString()}</div>}
                {drawerContact.lastFollowUpAt && <div>Last follow-up: {new Date(drawerContact.lastFollowUpAt).toLocaleDateString()}</div>}
                {drawerContact.lastContact && <div>Last contact: {new Date(drawerContact.lastContact).toLocaleDateString()}</div>}
                {drawerContact.createdAt && <div>Added: {new Date(drawerContact.createdAt).toLocaleDateString()}</div>}
              </div>
            </div>

            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <button onClick={deleteContact} type="button" style={{
                background: 'none', border: '1.5px solid var(--border)',
                color: '#dc2626', padding: '10px 16px',
                borderRadius: 10, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
              }}>Remove</button>
              <button onClick={saveDrawer} type="button" style={{
                flex: 1, background: 'var(--text)', color: 'var(--surface)', border: 'none',
                padding: '10px 20px', borderRadius: 10,
                fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                letterSpacing: '0.3px', textTransform: 'uppercase',
              }}>Save</button>
            </div>
          </>
        )}
      </div>

      {/* Drawer backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.22)',
            zIndex: 49, cursor: 'pointer',
          }}
        />
      )}

      {/* ══════════ TOAST ══════════ */}
      <div style={{
        position: 'fixed', bottom: 28, left: '50%',
        transform: `translateX(-50%) translateY(${toast ? '0' : '80px'})`,
        background: 'var(--text)', color: 'var(--surface)',
        padding: '10px 22px', borderRadius: 100,
        fontSize: 13, fontWeight: 600, zIndex: 300,
        transition: 'transform 0.3s ease', pointerEvents: 'none', whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px -6px rgba(0,0,0,0.25)',
      }}>{toast}</div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// HELPERS (outside the main component)
// ══════════════════════════════════════════════════════════════

function activityFor(c: Contact): { relative: string; isStale: boolean } {
  if (c.status === 'drafted') {
    const d = daysSince(c.createdAt);
    return {
      relative: d === null ? '-' : d === 0 ? 'Drafted today' : `Drafted ${d}d ago`,
      isStale: d !== null && d > 7,
    };
  }
  if (c.status === 'scheduled' && c.scheduledAt) {
    const dAhead = Math.ceil((c.scheduledAt - Date.now()) / 864e5);
    if (dAhead >= 0) {
      return {
        relative: dAhead === 0 ? 'Today' : dAhead === 1 ? 'Tomorrow' : `In ${dAhead}d`,
        isStale: false,
      };
    }
    return { relative: `${Math.abs(dAhead)}d ago`, isStale: true };
  }
  const ref = c.lastFollowUpAt || c.sentAt || c.lastContact;
  const d = daysSince(ref);
  if (d === null) return { relative: '-', isStale: false };
  const label = d === 0 ? 'Today' : d === 1 ? '1d ago' : `${d}d ago`;
  let stale = false;
  if (c.status === 'sent' && d > 5) stale = true;
  else if ((c.status === 'fu1' || c.status === 'fu2') && d > 7) stale = true;
  else if (c.status === 'fu3' && d > 10) stale = true;
  else if (c.status === 'stay' && d > 45) stale = true;
  return { relative: label, isStale: stale };
}

// ══════════════════════════════════════════════════════════════
// ADD MODAL (extracted for readability)
// ══════════════════════════════════════════════════════════════

function AddModal(props: any) {
  const { isDark, onClose, onSave,
    aFname, setAFname, aLname, setALname, aFirm, setAFirm, aRole, setARole,
    aStatus, setAStatus, aAngle, setAAngle, aNotes, setANotes, aLinkedin, setALinkedin, aDate, setADate } = props;

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, backdropFilter: 'blur(4px)',
    }}>
      <div style={{ background: 'var(--surface)', borderRadius: 18, width: '100%', maxWidth: 560, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#8b2500', marginBottom: 4 }}>Add</div>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--text)', letterSpacing: '-0.3px' }}>
              New <em style={{ fontStyle: 'italic' }}>contact</em>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: 'var(--text-3)', lineHeight: 1, padding: 4 }}>×</button>
        </div>
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="First Name *" val={aFname} set={setAFname} ph="Emily" />
            <Field label="Last Name" val={aLname} set={setALname} ph="Zhang" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Firm" val={aFirm} set={setAFirm} ph="Goldman Sachs" />
            <Field label="Role" val={aRole} set={setARole} ph="IB Analyst" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Status</label>
              <select value={aStatus} onChange={e => setAStatus(e.target.value)} style={selectStyle(isDark)}>
                {Object.entries(STATUSES).map(([k, v]: [string, any]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Angle</label>
              <select value={aAngle} onChange={e => setAAngle(e.target.value)} style={selectStyle(isDark)}>
                <option value="">-</option>
                {['Alumni','Deal Reference','Shared Interest','Mutual Connection','Career Path','Cold'].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Date <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
            <input type="date" value={aDate} onChange={e => setADate(e.target.value)} style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>LinkedIn URL <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
            <input value={aLinkedin} onChange={e => setALinkedin(e.target.value)} placeholder="linkedin.com/in/name" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Notes <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
            <textarea
              value={aNotes}
              onChange={e => setANotes(e.target.value)}
              placeholder="Why you're reaching out, any mutual connections, follow-up notes..."
              style={{ ...inputStyle, resize: 'vertical', minHeight: 70, lineHeight: 1.5 } as any}
            />
          </div>
        </div>
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ background: 'none', border: '1.5px solid var(--border-2)', color: 'var(--text-2)', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>Cancel</button>
          <button onClick={onSave} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', padding: '9px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Add contact</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, val, set, ph }: { label: string; val: string; set: (s: string) => void; ph: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{label}</label>
      <input value={val} onChange={e => set(e.target.value)} placeholder={ph} style={inputStyle} />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  border: '1.5px solid var(--border-2)', borderRadius: 8,
  fontSize: 13, fontFamily: 'Sora, sans-serif',
  color: 'var(--text)', background: 'var(--bg)', outline: 'none',
};

function selectStyle(isDark: boolean): React.CSSProperties {
  return { ...inputStyle, cursor: 'pointer' };
}
