'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import '../contact-finder/contact-finder.css';
import EmailSyncPanel from './EmailSyncPanel';
import RemindersPanel from './RemindersPanel';

const STATUSES: Record<string, { label: string; cls: string }> = {
  drafted: { label: 'Drafted', cls: 'b-drafted' },
  sent: { label: 'Sent', cls: 'b-sent' },
  fu1: { label: 'Followed Up 1x', cls: 'b-fu1' },
  fu2: { label: 'Followed Up 2x', cls: 'b-fu2' },
  fu3: { label: 'Followed Up 3x', cls: 'b-fu3' },
  spoken: { label: 'Spoken With', cls: 'b-spoken' },
  stay: { label: 'Staying in Touch', cls: 'b-stay' },
  noresp: { label: 'No Response', cls: 'b-noresp' },
  ghosted: { label: 'Ghosted Me', cls: 'b-ghosted' },
};

const COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6','#f97316','#06b6d4'];

const SAMPLE_CONTACTS: any[] = [];

function colorFor(n: string) { let h = 0; for (const c of n) h = c.charCodeAt(0) + ((h << 5) - h); return COLORS[Math.abs(h) % COLORS.length]; }
function initials(f: string, l: string) { return ((f || '')[0] || '').toUpperCase() + ((l || '')[0] || '').toUpperCase(); }
function fmtDate(ts: number | null) { if (!ts) return '—'; return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function daysSince(ts: number | null) { if (!ts) return null; return Math.floor((Date.now() - ts) / 864e5); }

type Contact = { id: string; fname: string; lname: string; firm: string; role: string; status: string; angle: string; notes: string; quality: string; createdAt: number; lastContact: number | null; };
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
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('offerbell_tracker_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      setContacts(parsed);
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
    const updated = contacts.map(c => c.id === id ? { ...c, status, lastContact: Date.now() } : c);
    setContacts(updated); persist(updated);
    showToast('Updated to ' + STATUSES[status]?.label);
  }

  function openDrawer(c: Contact) {
    setDrawerContact(c);
    setDrawerNotes(c.notes || '');
    setDrawerQuality(c.quality || '');
    setDrawerStatus(c.status);
    const showDate = ['spoken', 'stay'].includes(c.status);
    if (showDate && c.lastContact) {
      setDrawerDate(new Date(c.lastContact).toISOString().split('T')[0]);
    } else { setDrawerDate(''); }
    setDrawerOpen(true);
  }

  function saveDrawer() {
    if (!drawerContact) return;
    const updated = contacts.map(c => {
      if (c.id !== drawerContact.id) return c;
      let lastContact = c.lastContact;
      if (drawerDate && ['spoken', 'stay'].includes(drawerStatus)) {
        lastContact = new Date(drawerDate).getTime();
      } else if (!['spoken', 'stay'].includes(drawerStatus)) {
        lastContact = Date.now();
      }
      return { ...c, notes: drawerNotes, quality: drawerQuality, status: drawerStatus, lastContact };
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
    const c: Contact = {
      id: Date.now().toString(), fname: aFname.trim(), lname: aLname.trim(),
      firm: aFirm.trim(), role: aRole.trim(), status: aStatus, angle: aAngle,
      notes: aNotes.trim(), quality: '', createdAt: Date.now(), lastContact: null,
    };
    const updated = [...contacts, c];
    setContacts(updated); persist(updated);
    setModalOpen(false); setAFname(''); setALname(''); setAFirm(''); setARole(''); setAStatus('drafted'); setAAngle(''); setANotes('');
    showToast(name + ' added');
  }



  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    if (q && !(c.fname + ' ' + c.lname + ' ' + c.firm).toLowerCase().includes(q)) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'followup') return ['fu1', 'fu2', 'fu3'].includes(c.status);
    if (activeFilter === 'spoken') return c.status === 'spoken';
    if (activeFilter === 'stay') return c.status === 'stay';
    if (activeFilter === 'noresp') return c.status === 'noresp';
    if (activeFilter === 'ghosted') return c.status === 'ghosted';
    if (activeFilter === 'drafted') return c.status === 'drafted';
    if (activeFilter === 'sent') return c.status === 'sent';
    return true;
  });

  const total = contacts.length;
  const sent = contacts.filter(c => c.status !== 'drafted').length;
  const fu = contacts.filter(c => ['fu1', 'fu2', 'fu3'].includes(c.status)).length;
  const spoken = contacts.filter(c => ['spoken', 'stay'].includes(c.status)).length;
  const rate = sent > 0 ? Math.round(spoken / sent * 100) + '%' : '—';

  const showDateField = ['spoken', 'stay'].includes(drawerStatus);

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
        <main className="main" style={{ padding: '32px 36px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, letterSpacing: '-.5px', color: 'var(--text)', marginBottom: 3 }}>
                Outreach <em style={{ fontStyle: 'italic' }}>Tracker</em>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                Track every networking conversation in one place.{' '}
                <span style={{ color: 'var(--text-3)' }}>Click any row to update status, add notes, or log a call date.</span>
              </div>
            </div>
            <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>+ Add Contact</button>
          </div>

          {/* Email & Calendar Sync */}
          <EmailSyncPanel onContactsUpdated={() => {
            try {
              const saved = localStorage.getItem('offerbell_tracker_v3');
              if (saved) setContacts(JSON.parse(saved));
            } catch {}
          }} />

          {/* Reminders */}
          <RemindersPanel contacts={contacts} onOpenContact={(id) => {
            const c = contacts.find(ct => ct.id === id);
            if (c) openDrawer(c);
          }} />

          {/* Chrome Extension Banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '14px 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Chrome Extension</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Add contacts from Gmail to your tracker with one click</div>
              </div>
            </div>
            <a href="/install-extension.html" target="_blank" rel="noopener noreferrer" style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textDecoration: 'none', whiteSpace: 'nowrap' }}>Install Extension</a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Total', val: total, sub: 'contacts tracked' },
              { label: 'Sent', val: sent, sub: 'emails out' },
              { label: 'Following Up', val: fu, sub: 'awaiting reply' },
              { label: 'Spoken With', val: spoken, sub: 'calls completed', highlight: true },
              { label: 'Response Rate', val: rate, sub: 'of all sent' },
            ].map(s => (
              <div key={s.label} style={{ background: s.highlight ? '#0c0c0c' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '14px 18px', flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.highlight ? '#ffffff' : 'var(--text)', letterSpacing: '-1px', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: s.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-3)', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>



          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Filter:</span>
            {[
              { key: 'all', label: 'All' }, { key: 'drafted', label: 'Drafted' }, { key: 'sent', label: 'Sent' },
              { key: 'followup', label: 'Following Up' }, { key: 'spoken', label: 'Spoken With' },
              { key: 'stay', label: 'Stay in Touch' }, { key: 'noresp', label: 'No Response' }, { key: 'ghosted', label: 'Ghosted Me' },
            ].map(f => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{ padding: '5px 12px', borderRadius: 100, border: '1.5px solid', borderColor: activeFilter === f.key ? 'var(--text)' : 'var(--border-2)', background: activeFilter === f.key ? 'var(--text)' : 'var(--surface)', color: activeFilter === f.key ? 'var(--surface)' : 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all .15s' }}>
                {f.label}
              </button>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1.5px solid var(--border-2)', borderRadius: 8, padding: '6px 12px', marginLeft: 'auto' }}>
              <svg width="14" height="14" fill="none" stroke="var(--text-3)" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or firm…" style={{ border: 'none', background: 'none', fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', outline: 'none', width: 180 }} />
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a1a19' }}>
                  {['Name', 'Firm & Role', 'Status', 'Angle', 'Date Added', 'Days Since Contact', 'Quality', 'Notes'].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'rgba(255,255,255,.6)', padding: '11px 14px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,.07)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontStyle: 'italic', color: 'var(--text)', marginBottom: 8 }}>No contacts here yet</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Add your first contact to start tracking.</div>
                    <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>+ Add Contact</button>
                  </td></tr>
                ) : filtered.map(c => {
                  const days = daysSince(c.lastContact);
                  const isSpoken = ['spoken', 'stay'].includes(c.status);
                  const daysStr = days === null ? '—' : isSpoken ? days + ' days since call' : days + ' days ago';
                  const daysCls = days === null ? 'var(--text-3)' : isSpoken ? (days > 60 ? '#dc2626' : days > 30 ? '#d97706' : '#16a34a') : (days > 14 ? '#dc2626' : days > 7 ? '#d97706' : '#16a34a');
                  const st = STATUSES[c.status] || { label: c.status, cls: 'b-drafted' };
                  const color = colorFor(c.fname + c.lname);
                  return (
                    <tr key={c.id} onClick={() => openDrawer(c)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(c.fname, c.lname)}</div>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>{c.fname} {c.lname}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.firm || '—'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.role}</div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        <span className={`badge ${st.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 100, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {c.angle ? <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--text-3)' }}>{c.angle}</span> : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{fmtDate(c.createdAt)}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, fontWeight: 700, color: daysCls, whiteSpace: 'nowrap' }}>{daysStr}</td>
                      <td style={{ padding: '11px 14px' }}>
                        {c.quality === 'great' ? <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 12 }}>Great</span>
                          : c.quality === 'ok' ? <span style={{ color: '#d97706', fontWeight: 700, fontSize: 12 }}>OK</span>
                          : c.quality === 'cold' ? <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 12 }}>Cold</span>
                          : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
                      </td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--text-2)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.notes || <span style={{ color: 'var(--text-3)' }}>No notes</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                    <option value="">—</option>
                    {['Alumni','Deal Reference','Shared Interest','Mutual Connection','Career Path','Cold'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>Notes <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(optional)</span></label>
                <textarea value={aNotes} onChange={e => setANotes(e.target.value)} placeholder="What did you talk about? Any follow-up items?" style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none', resize: 'vertical', minHeight: 70, lineHeight: 1.5 }} />
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
                  <button key={k} onClick={() => { setDrawerStatus(k); if (['spoken','stay'].includes(k) && !drawerDate) setDrawerDate(new Date().toISOString().split('T')[0]); }} style={{ padding: '8px 10px', borderRadius: 8, border: '1.5px solid', borderColor: drawerStatus === k ? 'var(--text)' : 'var(--border)', background: drawerStatus === k ? 'var(--text)' : 'var(--surface)', color: drawerStatus === k ? 'var(--surface)' : 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'center' }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            {showDateField && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>Date spoken</div>
                <input type="date" value={drawerDate} onChange={e => setDrawerDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }} />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>Used to calculate time since last conversation</div>
              </div>
            )}
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
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>Notes</div>
              <textarea value={drawerNotes} onChange={e => setDrawerNotes(e.target.value)} placeholder="What did you discuss? Who did they mention? Any follow-up items?" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border-2)', borderRadius: 9, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none', resize: 'none', minHeight: 100, lineHeight: 1.6 }} />
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
