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

type Contact = { id: string; fname: string; lname: string; firm: string; role: string; status: string; angle: string; notes: string; quality: string; createdAt: number; lastContact: number | null; sentAt: number | null; lastFollowUpAt: number | null; linkedin: string; };
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
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('offerbell_tracker_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      setContacts(parsed.map((c: any) => ({ ...c, linkedin: c.linkedin || '' })));
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
      if (drawerDate) {
        const dateTs = new Date(drawerDate).getTime();
        if (drawerStatus === 'sent') { sentAt = dateTs; lastContact = dateTs; }
        else if (['fu1','fu2','fu3'].includes(drawerStatus)) { lastFollowUpAt = dateTs; lastContact = dateTs; }
        else { lastContact = dateTs; }
      } else {
        const now = Date.now();
        if (drawerStatus === 'sent' && !sentAt) { sentAt = now; lastContact = now; }
        else if (['fu1','fu2','fu3'].includes(drawerStatus)) { lastFollowUpAt = now; lastContact = now; }
        else if (drawerStatus !== 'drafted') { lastContact = now; }
      }
      return { ...c, notes: drawerNotes, quality: drawerQuality, status: drawerStatus, lastContact, sentAt, lastFollowUpAt, linkedin: drawerLinkedin.trim() };
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
    const c: Contact = {
      id: now.toString(), fname: aFname.trim(), lname: aLname.trim(),
      firm: aFirm.trim(), role: aRole.trim(), status: aStatus, angle: aAngle,
      notes: aNotes.trim(), quality: '', createdAt: now, lastContact: null,
      sentAt: aStatus === 'sent' ? now : null,
      lastFollowUpAt: ['fu1','fu2','fu3'].includes(aStatus) ? now : null,
      linkedin: aLinkedin.trim(),
    };
    const updated = [...contacts, c];
    setContacts(updated); persist(updated);
    setModalOpen(false); setAFname(''); setALname(''); setAFirm(''); setARole(''); setAStatus('drafted'); setAAngle(''); setANotes(''); setALinkedin('');
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

  const showDateField = true;
  const dateFieldLabel = drawerStatus === 'drafted' ? 'Date drafted'
    : drawerStatus === 'sent' ? 'Date sent'
    : ['fu1','fu2','fu3'].includes(drawerStatus) ? 'Date of last follow-up'
    : ['spoken','stay'].includes(drawerStatus) ? 'Date spoken'
    : drawerStatus === 'noresp' ? 'Date of last outreach'
    : drawerStatus === 'ghosted' ? 'Date of last message'
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

          {/* Chrome Extension Banner */}
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--surface)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>OfferBell Chrome Extension</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>Add contacts and write outreach emails directly from Gmail &amp; Outlook — without leaving your inbox.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b', background: '#fef3c7', padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>Awaiting Approval</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              {[
                { icon: '•', text: 'Works in Gmail & Outlook Web' },
                { icon: '•', text: 'Add contacts with one click' },
                { icon: '•', text: 'AI-powered outreach writer' },
              ].map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>{f.icon}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <RemindersPanel contacts={contacts} onOpenContact={(id) => {
            const c = contacts.find(ct => ct.id === id);
            if (c) openDrawer(c);
          }} />

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
              { key: 'followup', label: 'Following Up' }, { key: 'needsfu', label: 'Needs Follow Up' }, { key: 'spoken', label: 'Spoken With' },
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
                  {['Name', 'Firm & Role', 'Status', 'Angle', 'LinkedIn', 'Date Added', 'Days Since Contact', 'Quality', 'Notes', ''].map(h => (
                    <th key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'rgba(255,255,255,.6)', padding: '11px 14px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: h !== '' ? '1px solid rgba(255,255,255,.07)' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontStyle: 'italic', color: 'var(--text)', marginBottom: 8 }}>No contacts here yet</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Add your first contact to start tracking.</div>
                    <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>+ Add Contact</button>
                  </td></tr>
                ) : filtered.map(c => {
                  const daysSent = daysSince(c.sentAt);
                  const daysFU = daysSince(c.lastFollowUpAt);
                  const daysLC = daysSince(c.lastContact);
                  let daysStr = '—';
                  let daysCls = 'var(--text-3)';
                  if (c.status === 'drafted') {
                    const d = daysSince(c.createdAt);
                    daysStr = d !== null ? `drafted ${d}d ago` : '—';
                    daysCls = d !== null && d > 7 ? '#d97706' : d !== null && d > 14 ? '#dc2626' : 'var(--text-3)';
                  } else if (c.status === 'sent') {
                    daysStr = daysSent !== null ? `sent ${daysSent}d ago` : '—';
                    daysCls = daysSent !== null ? (daysSent > 7 ? '#dc2626' : daysSent > 3 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (['fu1','fu2','fu3'].includes(c.status)) {
                    daysStr = daysFU !== null ? `followed up ${daysFU}d ago` : daysSent !== null ? `sent ${daysSent}d ago` : '—';
                    const d = daysFU ?? daysSent;
                    daysCls = d !== null ? (d > 10 ? '#dc2626' : d > 5 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (['spoken','stay'].includes(c.status)) {
                    daysStr = daysLC !== null ? `spoke ${daysLC}d ago` : '—';
                    daysCls = daysLC !== null ? (daysLC > 60 ? '#dc2626' : daysLC > 30 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (c.status === 'noresp' || c.status === 'ghosted') {
                    daysStr = daysLC !== null ? `${daysLC}d no reply` : '—';
                    daysCls = '#dc2626';
                  }
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
                      <td style={{ padding: '11px 14px' }}>
                        {c.linkedin ? <a href={c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#0a66c2', textDecoration: 'none' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                          Profile
                        </a> : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>—</span>}
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
                      <td style={{ padding: '11px 8px', textAlign: 'center' }}>
                        <button onClick={e => { e.stopPropagation(); if (confirm('Remove ' + c.fname + ' ' + c.lname + '?')) { const updated = contacts.filter(x => x.id !== c.id); setContacts(updated); persist(updated); showToast('Removed'); } }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete contact"
                          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
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
                  <button key={k} onClick={() => { setDrawerStatus(k); if (['spoken','stay'].includes(k) && !drawerDate) setDrawerDate(new Date().toISOString().split('T')[0]); }} style={{ padding: '8px 10px', borderRadius: 8, border: '1.5px solid', borderColor: drawerStatus === k ? 'var(--text)' : 'var(--border)', background: drawerStatus === k ? 'var(--text)' : 'var(--surface)', color: drawerStatus === k ? 'var(--surface)' : 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'center' }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            {showDateField && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--text-3)', marginBottom: 8 }}>{dateFieldLabel}</div>
                <input type="date" value={drawerDate} onChange={e => setDrawerDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--border-2)', borderRadius: 8, fontSize: 13, fontFamily: 'Sora, sans-serif', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }} />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>Used to calculate days since last action</div>
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
