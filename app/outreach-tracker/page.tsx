'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '../contact-finder/contact-finder.css';
import RemindersPanel from './RemindersPanel';

const STATUSES: Record<string, { label: string; cls: string }> = {
  drafted: { label: 'Drafted', cls: 'b-drafted' },
  sent: { label: 'Sent', cls: 'b-sent' },
  fu1: { label: 'Followed Up 1x', cls: 'b-fu1' },
  fu2: { label: 'Followed Up 2x', cls: 'b-fu2' },
  fu3: { label: 'Followed Up 3x', cls: 'b-fu3' },
  scheduled: { label: 'Scheduled', cls: 'b-scheduled' },
  spoken: { label: 'Spoken With', cls: 'b-spoken' },
  stay: { label: 'Staying in Touch', cls: 'b-stay' },
  noresp: { label: 'No Response', cls: 'b-noresp' },
};

const COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6','#f97316','#06b6d4'];

const SAMPLE_CONTACTS: any[] = [];

function colorFor(n: string) { let h = 0; for (const c of n) h = c.charCodeAt(0) + ((h << 5) - h); return COLORS[Math.abs(h) % COLORS.length]; }
function initials(f: string, l: string) { return ((f || '')[0] || '').toUpperCase() + ((l || '')[0] || '').toUpperCase(); }
function fmtDate(ts: number | null) { if (!ts) return '-'; return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function daysSince(ts: number | null) { if (!ts) return null; return Math.floor((Date.now() - ts) / 864e5); }

type Contact = { id: string; fname: string; lname: string; firm: string; role: string; status: string; angle: string; notes: string; quality: string; createdAt: number; lastContact: number | null; sentAt: number | null; lastFollowUpAt: number | null; linkedin: string; scheduledAt: number | null; };
export default function OutreachTrackerPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [_userName, _setUserName] = useState({ first: '', last: '' });

  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      setUserPlan(prof.plan || plan);
    } catch { setUserPlan('free'); }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        _setUserName({ first: p.firstName || '', last: p.lastName || '' });
      }
    } catch (e) {}
  }, []);
  const _displayName = (_userName.first + ' ' + _userName.last).trim() || 'User';
  const _displayInitials = ((_userName.first[0] || '') + (_userName.last[0] || '')).toUpperCase() || 'U';

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContact, setDrawerContact] = useState<Contact | null>(null);
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerQuality, setDrawerQuality] = useState('');
  const [drawerLinkedin, setDrawerLinkedin] = useState('');
  const [drawerStatus, setDrawerStatus] = useState('');
  const [drawerDate, setDrawerDate] = useState('');
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

  useEffect(() => {
    const saved = localStorage.getItem('offerbell_tracker_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      setContacts(parsed.map((c: any) => ({ ...c, linkedin: c.linkedin || '', scheduledAt: c.scheduledAt || null })));
    } else if (!localStorage.getItem('offerbell_tracker_seeded')) {
      setContacts(SAMPLE_CONTACTS);
      localStorage.setItem('offerbell_tracker_v3', JSON.stringify(SAMPLE_CONTACTS));
      localStorage.setItem('offerbell_tracker_seeded', 'true');
    }
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
  }, []);

  function persist(c: Contact[]) { localStorage.setItem('offerbell_tracker_v3', JSON.stringify(c)); }

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  function quickMove(id: string, status: string) {
    const now = Date.now();
    const updated = contacts.map(c => {
      if (c.id !== id) return c;
      const patch: Partial<Contact> = { status, lastContact: now };
      if (status === 'sent' && !c.sentAt) patch.sentAt = now;
      if (['fu1','fu2','fu3'].includes(status)) patch.lastFollowUpAt = now;
      return { ...c, ...patch };
    });
    setContacts(updated); persist(updated);
    showToast('Updated to ' + STATUSES[status]?.label);
  }

  function openDrawer(c: Contact) {
    setDrawerContact(c);
    setDrawerNotes(c.notes || '');
    setDrawerQuality(c.quality || '');
    setDrawerStatus(c.status);
    setDrawerLinkedin(c.linkedin || '');
    if (c.status === 'sent' && c.sentAt) {
      setDrawerDate(new Date(c.sentAt).toISOString().split('T')[0]);
    } else if (c.status === 'scheduled' && c.scheduledAt) {
      setDrawerDate(new Date(c.scheduledAt).toISOString().split('T')[0]);
    } else if (['fu1','fu2','fu3'].includes(c.status) && c.lastFollowUpAt) {
      setDrawerDate(new Date(c.lastFollowUpAt).toISOString().split('T')[0]);
    } else if (c.lastContact) {
      setDrawerDate(new Date(c.lastContact).toISOString().split('T')[0]);
    } else if (c.status === 'drafted' && c.createdAt) {
      setDrawerDate(new Date(c.createdAt).toISOString().split('T')[0]);
    } else { setDrawerDate(''); }
    setDrawerOpen(true);
  }

  function saveDrawer() {
    if (!drawerContact) return;
    const updated = contacts.map(c => {
      if (c.id !== drawerContact.id) return c;
      let lastContact = c.lastContact;
      let sentAt = c.sentAt || null;
      let lastFollowUpAt = c.lastFollowUpAt || null;
      let createdAt = c.createdAt;
      let scheduledAt = c.scheduledAt || null;
      if (drawerDate) {
        const dateTs = new Date(drawerDate).getTime();
        if (drawerStatus === 'drafted') { createdAt = dateTs; }
        else if (drawerStatus === 'sent') { sentAt = dateTs; lastContact = dateTs; }
        else if (drawerStatus === 'scheduled') { scheduledAt = dateTs; }
        else if (['fu1','fu2','fu3'].includes(drawerStatus)) { lastFollowUpAt = dateTs; lastContact = dateTs; }
        else { lastContact = dateTs; }
      } else {
        const now = Date.now();
        if (drawerStatus === 'sent' && !sentAt) { sentAt = now; lastContact = now; }
        else if (drawerStatus === 'scheduled' && !scheduledAt) { scheduledAt = now; }
        else if (['fu1','fu2','fu3'].includes(drawerStatus)) { lastFollowUpAt = now; lastContact = now; }
        else if (drawerStatus !== 'drafted') { lastContact = now; }
      }
      return { ...c, notes: drawerNotes, quality: drawerQuality, status: drawerStatus, lastContact, sentAt, lastFollowUpAt, linkedin: drawerLinkedin.trim(), createdAt, scheduledAt };
    });
    setContacts(updated); persist(updated);
    setDrawerOpen(false); showToast('Saved');
  }

  function deleteContact() {
    if (!drawerContact) return;
    if (!confirm('Remove ' + drawerContact.fname + ' ' + drawerContact.lname + '?')) return;
    const updated = contacts.filter(c => c.id !== drawerContact.id);
    setContacts(updated); persist(updated);
    setDrawerOpen(false); showToast('Removed');
  }

  function saveAdd() {
    if (!aFname.trim()) return;
    const name = aFname.trim();
    const now = Date.now();
    const dateTs = aDate ? new Date(aDate).getTime() : now;
    const c: Contact = {
      id: now.toString(), fname: aFname.trim(), lname: aLname.trim(),
      firm: aFirm.trim(), role: aRole.trim(), status: aStatus, angle: aAngle,
      notes: aNotes.trim(), quality: '', createdAt: aStatus === 'drafted' ? dateTs : now, lastContact: aStatus !== 'drafted' ? dateTs : null,
      sentAt: aStatus === 'sent' ? dateTs : null,
      lastFollowUpAt: ['fu1','fu2','fu3'].includes(aStatus) ? dateTs : null,
      linkedin: aLinkedin.trim(),
      scheduledAt: aStatus === 'scheduled' ? dateTs : null,
    };
    const updated = [...contacts, c];
    setContacts(updated); persist(updated);
    setModalOpen(false); setAFname(''); setALname(''); setAFirm(''); setARole(''); setAStatus('drafted'); setAAngle(''); setANotes(''); setALinkedin(''); setADate('');
    showToast(name + ' added');
  }



  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    if (q && !(c.fname + ' ' + c.lname + ' ' + c.firm).toLowerCase().includes(q)) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'followup') return ['fu1', 'fu2', 'fu3'].includes(c.status);
    if (activeFilter === 'needsfu') {
      if (c.status === 'sent') { const d = daysSince(c.sentAt || c.lastContact); return d !== null && d >= 3; }
      if (['fu1','fu2','fu3'].includes(c.status)) { const d = daysSince(c.lastFollowUpAt || c.lastContact); return d !== null && d >= 5; }
      if (c.status === 'drafted') { const d = daysSince(c.createdAt); return d !== null && d >= 5; }
      return false;
    }
    if (activeFilter === 'spoken') return c.status === 'spoken';
    if (activeFilter === 'stay') return c.status === 'stay';
    if (activeFilter === 'noresp') return c.status === 'noresp';
    if (activeFilter === 'noresp') return c.status === 'noresp';
    if (activeFilter === 'drafted') return c.status === 'drafted';
    if (activeFilter === 'sent') return c.status === 'sent';
    return true;
  });

  const total = contacts.length;
  const sent = contacts.filter(c => c.status !== 'drafted').length;
  const fu = contacts.filter(c => ['fu1', 'fu2', 'fu3'].includes(c.status)).length;
  const spoken = contacts.filter(c => ['spoken', 'stay'].includes(c.status)).length;
  const rate = sent > 0 ? Math.round(spoken / sent * 100) + '%' : '-';

  const showDateField = true;
  const dateFieldLabel = drawerStatus === 'drafted' ? 'Date drafted'
    : drawerStatus === 'sent' ? 'Date sent'
    : drawerStatus === 'scheduled' ? 'Scheduled for'
    : ['fu1','fu2','fu3'].includes(drawerStatus) ? 'Date of last follow-up'
    : ['spoken','stay'].includes(drawerStatus) ? 'Date spoken'
    : drawerStatus === 'noresp' ? 'Date of last outreach'
    : 'Date';

  const css = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root,[data-theme="light"]{--bg:#fafaf9;--surface:#ffffff;--surface-2:#f5f4f2;--border:#ebebea;--border-2:#dddcda;--text:#0c0c0c;--text-2:#636160;--text-3:#9b9997;--sidebar-w:252px}
    [data-theme="dark"]{--bg:#111110;--surface:#1a1a19;--surface-2:#222221;--border:#2a2a29;--border-2:#353534;--text:#f0efed;--text-2:#a8a6a3;--text-3:#636160}
    body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
    .sidebar{width:var(--sidebar-w);flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:40;overflow-y:auto}
    .sidebar-logo{padding:22px 20px 18px;font-family:'Instrument Serif',serif;font-size:21px;letter-spacing:-.5px;border-bottom:1px solid var(--border);color:var(--text)}
    .sidebar-logo em{font-style:italic}
    .sidebar-user{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--border)}
    .user-avi{width:34px;height:34px;border-radius:50%;background:var(--text);color:var(--surface);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .nav{padding:12px;flex:1}
    .nav-group-label{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-3);padding:10px 10px 6px;display:block}
    .nav-item{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;color:var(--text-2);cursor:pointer;transition:all .15s;margin-bottom:1px;text-decoration:none}
    .nav-item:hover{background:var(--surface-2);color:var(--text)}
    .nav-item.active{background:var(--text);color:var(--surface);font-weight:600}
    .nav-icon{width:16px;height:16px;flex-shrink:0;opacity:.5}
    .nav-item.active .nav-icon{opacity:1;filter:invert(1)}
    [data-theme="dark"] .nav-item.active .nav-icon{filter:invert(0)}
    .nav-pill{margin-left:auto;font-size:10px;font-weight:700;padding:2px 7px;border-radius:100px}
    .pill-count{background:var(--surface-2);color:var(--text-2)}
    .pill-pro{background:#fef3c7;color:#92400e}
    .nav-item.active .pill-count{background:rgba(255,255,255,.15);color:rgba(255,255,255,.8)}
    .theme-toggle-row{padding:10px 12px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
    .theme-toggle-label{font-size:12px;font-weight:600;color:var(--text-2);display:flex;align-items:center;gap:7px}
    .toggle-switch{width:42px;height:24px;border-radius:100px;background:var(--border-2);cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
    .toggle-switch.on{background:var(--text)}
    .toggle-knob{width:18px;height:18px;border-radius:50%;background:var(--surface);position:absolute;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.15)}
    .toggle-switch.on .toggle-knob{transform:translateX(18px)}
    .sidebar-footer{padding:12px;border-top:1px solid var(--border);flex-shrink:0}
    .upgrade-card{background:var(--text);border-radius:12px;padding:14px 16px}
    .upgrade-card-title{font-size:12px;font-weight:700;margin-bottom:4px;color:var(--surface)}
    .upgrade-card-desc{font-size:11px;color:rgba(255,255,255,.45);margin-bottom:12px;line-height:1.5}
    .upgrade-card-btn{display:block;background:var(--surface);color:var(--text);text-align:center;padding:7px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none}
    .b-drafted{background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb}
    .b-sent{background:#dbeafe;color:#1d4ed8;border:1px solid #bfdbfe}
    .b-fu1{background:#fef3c7;color:#b45309;border:1px solid #fde68a}
    .b-fu2{background:#ffedd5;color:#c2410c;border:1px solid #fed7aa}
    .b-fu3{background:#fee2e2;color:#b91c1c;border:1px solid #fecaca}
    .b-scheduled{background:#e0e7ff;color:#4338ca;border:1px solid #c7d2fe}
    .b-spoken{background:#0c0c0c;color:#ffffff;border:1px solid #0c0c0c}
    .b-stay{background:#dcfce7;color:#15803d;border:1px solid #bbf7d0}
    .b-noresp{background:#f9fafb;color:#9ca3af;border:1px solid #e5e7eb}
    .b-ghosted{background:#fce7f3;color:#be185d;border:1px solid #fbcfe8}
  `;

  return (
    <>
      <div className="app">
        {/* SIDEBAR */}
        <Sidebar activePage="outreach-tracker" />

        {/* MAIN */}
        <main className="main" style={{ padding: '40px 40px 60px' }}>

          {/* Inner wrapper: centers content within the post-sidebar area */}
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 20 }}>
            <div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 34, letterSpacing: '-.7px', color: 'var(--text)', marginBottom: 4, lineHeight: 1 }}>
                Outreach <em style={{ fontStyle: 'italic' }}>Tracker</em>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6, lineHeight: 1.5 }}>
                Every conversation, one place. Click a row to update status or log a call.
              </div>
            </div>
            <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', letterSpacing: '0.3px', display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, textTransform: 'uppercase' }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              Add Contact
            </button>
          </div>

          {/* Reminders */}
          <RemindersPanel contacts={contacts} onOpenContact={(id) => {
            const c = contacts.find(ct => ct.id === id);
            if (c) openDrawer(c);
          }} />

          {/* Stats - redesigned: 3 numbers, editorial style */}
          {total > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, padding: '20px 0', borderTop: '2px solid var(--text)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
              {[
                { label: 'Contacts', val: total, sub: 'tracked' },
                { label: 'Outreach', val: sent, sub: 'emails sent' },
                { label: 'Conversations', val: spoken, sub: 'calls completed', emphasize: true },
                { label: 'Response Rate', val: rate, sub: sent > 0 ? 'of all sent' : 'send some first' },
              ].map((s, i, arr) => (
                <div key={s.label} style={{ padding: '0 20px', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, lineHeight: 1, letterSpacing: '-1px', color: s.emphasize ? '#16a34a' : 'var(--text)', fontWeight: 400 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6, fontWeight: 500 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All', count: total },
              { key: 'drafted', label: 'Drafted', count: contacts.filter(c => c.status === 'drafted').length },
              { key: 'sent', label: 'Sent', count: contacts.filter(c => c.status === 'sent').length },
              { key: 'followup', label: 'Following Up', count: contacts.filter(c => ['fu1','fu2','fu3'].includes(c.status)).length },
              { key: 'spoken', label: 'Spoken', count: contacts.filter(c => c.status === 'spoken').length },
              { key: 'stay', label: 'Staying in Touch', count: contacts.filter(c => c.status === 'stay').length },
              { key: 'noresp', label: 'No Response', count: contacts.filter(c => c.status === 'noresp').length },
            ].filter(f => f.key === 'all' || f.count > 0).map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{ padding: '6px 12px', borderRadius: 100, border: '1.5px solid', borderColor: activeFilter === f.key ? 'var(--text)' : 'var(--border-2)', background: activeFilter === f.key ? 'var(--text)' : 'var(--surface)', color: activeFilter === f.key ? 'var(--surface)' : 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {f.label}
                {f.count > 0 && f.key !== 'all' && <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}>{f.count}</span>}
              </button>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1.5px solid var(--border-2)', borderRadius: 100, padding: '6px 14px', marginLeft: 'auto' }}>
              <svg width="14" height="14" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or firm..." style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', outline: 'none', width: 180 }} />
            </div>
          </div>

          {/* Table - redesigned with fewer columns */}
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1.5px solid var(--border)' }}>
                  {['Contact', 'Status', 'Last Activity', 'LinkedIn', 'Notes'].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-3)', padding: '12px 16px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '72px 20px', textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="22" height="22" fill="none" stroke="var(--text-3)" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, fontStyle: 'italic', color: 'var(--text)', marginBottom: 6 }}>No contacts here yet</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20, maxWidth: 320, margin: '0 auto 20px', lineHeight: 1.55 }}>
                      {activeFilter === 'all' ? 'Add your first contact to start tracking who you have reached out to.' : 'No contacts match this filter.'}
                    </div>
                    {activeFilter === 'all' && <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Add your first contact</button>}
                  </td></tr>
                ) : filtered.map(c => {
                  const daysSent = daysSince(c.sentAt);
                  const daysFU = daysSince(c.lastFollowUpAt);
                  const daysLC = daysSince(c.lastContact);
                  let daysStr = '—';
                  let daysCls = 'var(--text-3)';
                  let daysBold = false;
                  if (c.status === 'drafted') {
                    const d = daysSince(c.createdAt);
                    daysStr = d !== null ? (d === 0 ? 'Drafted today' : `Drafted ${d}d ago`) : '—';
                    daysCls = d !== null && d > 14 ? '#dc2626' : d !== null && d > 7 ? '#d97706' : 'var(--text-3)';
                    daysBold = d !== null && d > 7;
                  } else if (c.status === 'sent') {
                    daysStr = daysSent !== null ? (daysSent === 0 ? 'Sent today' : `Sent ${daysSent}d ago`) : '—';
                    daysCls = daysSent !== null ? (daysSent > 7 ? '#dc2626' : daysSent > 3 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                    daysBold = daysSent !== null && daysSent > 3;
                  } else if (['fu1','fu2','fu3'].includes(c.status)) {
                    const fuN = c.status === 'fu1' ? '1st' : c.status === 'fu2' ? '2nd' : '3rd';
                    daysStr = daysFU !== null ? `${fuN} follow-up ${daysFU}d ago` : daysSent !== null ? `Sent ${daysSent}d ago` : '—';
                    const d = daysFU ?? daysSent;
                    daysCls = d !== null ? (d > 10 ? '#dc2626' : d > 5 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                    daysBold = d !== null && d > 5;
                  } else if (['spoken','stay'].includes(c.status)) {
                    daysStr = daysLC !== null ? (daysLC === 0 ? 'Spoke today' : `Spoke ${daysLC}d ago`) : '—';
                    daysCls = daysLC !== null ? (daysLC > 60 ? '#dc2626' : daysLC > 30 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (c.status === 'noresp') {
                    daysStr = daysLC !== null ? `${daysLC}d, no reply` : 'No reply';
                    daysCls = '#dc2626';
                    daysBold = true;
                  } else if (c.status === 'scheduled') {
                    if (c.scheduledAt) {
                      const dAhead = Math.ceil((c.scheduledAt - Date.now()) / 864e5);
                      daysStr = dAhead === 0 ? 'Scheduled today' : dAhead === 1 ? 'Tomorrow' : dAhead > 0 ? `In ${dAhead} days` : `${Math.abs(dAhead)}d ago`;
                      daysCls = dAhead >= 0 ? '#16a34a' : '#d97706';
                      daysBold = dAhead >= 0 && dAhead <= 2;
                    }
                  }
                  const st = STATUSES[c.status] || { label: c.status, cls: 'b-drafted' };
                  const color = colorFor(c.fname + c.lname);
                  return (
                    <tr key={c.id} onClick={() => openDrawer(c)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '14px 16px', minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(c.fname, c.lname)}</div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.1px' }}>{c.fname} {c.lname}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{c.firm || 'Unknown firm'}{c.role ? ` — ${c.role}` : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span className={`badge ${st.cls}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.2px' }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, fontWeight: daysBold ? 700 : 500, color: daysCls, whiteSpace: 'nowrap' }}>{daysStr}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {c.linkedin ? <a href={c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#0a66c2', textDecoration: 'none' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                          Profile
                        </a> : <span style={{ color: 'var(--border-2)', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-2)', maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.notes || <span style={{ color: 'var(--border-2)', fontStyle: 'italic' }}>No notes</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        </main>
      </div>

      {/* ADD MODAL */}
      {modalOpen && (
        <div onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--surface)', borderRadius: 18, width: '100%', maxWidth: 560, overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--text)' }}>Add Contact</span>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-3)' }}>×</button>
            </div>
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                [{ label: 'First Name', val: aFname, set: setAFname, ph: 'Emily' }, { label: 'Last Name', val: aLname, set: setALname, ph: 'Zhang' }],
                [{ label: 'Firm', val: aFirm, set: setAFirm, ph: 'Goldman Sachs' }, { label: 'Role', val: aRole, set: setARole, ph: 'IB Analyst' }],
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {row.map((f: any) => (
                    <div key={f.label}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{f.label}</label>
                      <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }} />
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Status</label>
                  <select value={aStatus} onChange={e => setAStatus(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}>
                    {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Angle</label>
                  <select value={aAngle} onChange={e => setAAngle(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}>
                    <option value="">-</option>
                    {['Alumni','Deal Reference','Shared Interest','Mutual Connection','Career Path','Cold'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Date <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
                <input type="date" value={aDate} onChange={e => setADate(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none', colorScheme: isDark ? 'dark' : 'light' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Notes <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
                <textarea value={aNotes} onChange={e => setANotes(e.target.value)} placeholder="What did you talk about? Any follow-up items?" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none', resize: 'vertical', minHeight: 70, lineHeight: 1.5 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>LinkedIn URL <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
                <input value={aLinkedin} onChange={e => setALinkedin(e.target.value)} placeholder="linkedin.com/in/name" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }} />
              </div>
            </div>
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: '1.5px solid var(--border-2)', color: 'var(--text-2)', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>Cancel</button>
              <button onClick={saveAdd} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>Add Contact</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER */}
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 380, background: 'var(--surface)', borderLeft: '1.5px solid var(--border)', zIndex: 50, transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .28s ease', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 32px rgba(0,0,0,.07)' }}>
        {drawerContact && <>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: colorFor(drawerContact.fname + drawerContact.lname), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(drawerContact.fname, drawerContact.lname)}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{drawerContact.fname} {drawerContact.lname}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{[drawerContact.role, drawerContact.firm].filter(Boolean).join(' · ')}</div>
              </div>
            </div>
            <button onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text-3)' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>Status</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {Object.entries(STATUSES).map(([k, v]) => (
                  <button key={k} onClick={() => { setDrawerStatus(k); if (['spoken','stay','scheduled'].includes(k) && !drawerDate) setDrawerDate(new Date().toISOString().split('T')[0]); }} style={{ padding: '8px 10px', borderRadius: 8, border: '1.5px solid', borderColor: drawerStatus === k ? 'var(--text)' : 'var(--border)', background: drawerStatus === k ? 'var(--text)' : 'var(--surface)', color: drawerStatus === k ? 'var(--surface)' : 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'center' }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            {showDateField && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>{dateFieldLabel}</div>
                <input type="date" value={drawerDate} onChange={e => setDrawerDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none', colorScheme: isDark ? 'dark' : 'light' }} />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>Used to calculate days since last action</div>
              </div>
            )}
            {['spoken', 'stay'].includes(drawerStatus) && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>Conversation quality</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['great', 'ok', 'cold'].map(q => (
                  <button key={q} onClick={() => setDrawerQuality(q)} style={{ flex: 1, padding: 8, borderRadius: 8, border: '1.5px solid', borderColor: drawerQuality === q ? 'var(--text)' : 'var(--border)', background: drawerQuality === q ? 'var(--text)' : 'var(--surface)', color: drawerQuality === q ? 'var(--surface)' : 'var(--text-2)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textTransform: 'capitalize', textAlign: 'center' }}>
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            )}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>Notes</div>
              <textarea value={drawerNotes} onChange={e => setDrawerNotes(e.target.value)} placeholder="What did you discuss? Who did they mention? Any follow-up items?" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border-2)', borderRadius: 9, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none', resize: 'none', minHeight: 100, lineHeight: 1.6 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>LinkedIn</div>
              <input value={drawerLinkedin} onChange={e => setDrawerLinkedin(e.target.value)} placeholder="linkedin.com/in/name" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }} />
            </div>
            <button onClick={saveDrawer} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 9, padding: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', width: '100%' }}>Save</button>
            <button onClick={deleteContact} style={{ background: 'none', border: '1.5px solid #fecaca', color: '#dc2626', borderRadius: 9, padding: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', width: '100%' }}>Remove from tracker</button>
          </div>
        </>}
      </div>

      {/* TOAST */}
      <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: `translateX(-50%) translateY(${toast ? '0' : '80px'})`, background: 'var(--text)', color: 'var(--surface)', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, zIndex: 300, transition: 'transform .3s ease', pointerEvents: 'none', whiteSpace: 'nowrap' }}>{toast}</div>
    </>
  );
}
