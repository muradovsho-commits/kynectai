'use client';

import Sidebar from "../components/Sidebar";
import ExtensionInstallPrompt from "../components/ExtensionInstallPrompt";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PLAN_LIMITS } from '../lib/plan';
import { useUserPlan } from '../lib/usePlan';
import '../contact-finder/contact-finder.css';
import RemindersPanel from './RemindersPanel';

type AlertRule = {
  status: string;
  enabled: boolean;
  days: number;        // days of inactivity before alert fires
};

type TrackerConfig = {
  columns: { key: string; label: string; visible: boolean }[];
  statuses: { key: string; label: string; cls: string }[];
  alerts: AlertRule[];
  alertsGlobal: boolean;  // master toggle
};

const DEFAULT_COLUMNS = [
  { key: 'name', label: 'Contact', visible: true },
  { key: 'firmRole', label: 'Firm & Role', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'angle', label: 'Angle', visible: false },
  { key: 'linkedin', label: 'LinkedIn', visible: true },
  { key: 'dateAdded', label: 'Date Added', visible: false },
  { key: 'daysSince', label: 'Last Activity', visible: true },
  { key: 'quality', label: 'Quality', visible: false },
  { key: 'notes', label: 'Notes', visible: true },
];

const DEFAULT_STATUSES = [
  { key: 'drafted', label: 'Drafted', cls: 'b-drafted' },
  { key: 'sent', label: 'Sent', cls: 'b-sent' },
  { key: 'fu1', label: 'Followed Up 1x', cls: 'b-fu1' },
  { key: 'fu2', label: 'Followed Up 2x', cls: 'b-fu2' },
  { key: 'fu3', label: 'Followed Up 3x', cls: 'b-fu3' },
  { key: 'scheduled', label: 'Scheduled', cls: 'b-scheduled' },
  { key: 'spoken', label: 'Spoken With', cls: 'b-spoken' },
  { key: 'stay', label: 'Staying in Touch', cls: 'b-stay' },
  { key: 'noresp', label: 'No Response', cls: 'b-noresp' },
];

const DEFAULT_ALERTS: AlertRule[] = [
  { status: 'sent',  enabled: true, days: 5 },
  { status: 'fu1',   enabled: true, days: 7 },
  { status: 'fu2',   enabled: true, days: 7 },
  { status: 'fu3',   enabled: true, days: 10 },
  { status: 'stay',  enabled: true, days: 30 },
  { status: 'scheduled', enabled: false, days: 1 },
  { status: 'drafted',   enabled: false, days: 14 },
];

const CONFIG_KEY = 'offerbell_tracker_config';
function loadConfig(): TrackerConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all default columns exist (in case new ones were added)
      const existing = new Set(parsed.columns.map((c: any) => c.key));
      for (const dc of DEFAULT_COLUMNS) { if (!existing.has(dc.key)) parsed.columns.push(dc); }
      // Migrate: add alerts if missing (old configs won't have them)
      if (!parsed.alerts) parsed.alerts = DEFAULT_ALERTS.map(a => ({ ...a }));
      if (parsed.alertsGlobal === undefined) parsed.alertsGlobal = true;
      // Ensure all default alert statuses exist
      const existingAlerts = new Set(parsed.alerts.map((a: any) => a.status));
      for (const da of DEFAULT_ALERTS) { if (!existingAlerts.has(da.status)) parsed.alerts.push({ ...da }); }
      return parsed;
    }
  } catch {}
  return { columns: DEFAULT_COLUMNS.map(c => ({ ...c })), statuses: DEFAULT_STATUSES.map(s => ({ ...s })), alerts: DEFAULT_ALERTS.map(a => ({ ...a })), alertsGlobal: true };
}
function saveConfig(cfg: TrackerConfig) { localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg)); }

const STATUSES: Record<string, { label: string; cls: string }> = {};
// Will be populated from config in the component

const COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6','#f97316','#06b6d4'];

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
  const userPlan = useUserPlan();
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
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
  const [devMode, setDevMode] = useState(false);
  const [config, setConfig] = useState<TrackerConfig>(loadConfig());

  // Build dynamic STATUSES from config
  const statusMap: Record<string, { label: string; cls: string }> = {};
  for (const s of config.statuses) statusMap[s.key] = { label: s.label, cls: s.cls };
  // Also update the module-level STATUSES for backward compat
  Object.keys(STATUSES).forEach(k => delete STATUSES[k]);
  Object.assign(STATUSES, statusMap);
  // Resolve a customized status label by key, falling back to a default.
  const sl = (key: string, fallback: string) => config.statuses.find(s => s.key === key)?.label || fallback;

  const visibleColumns = config.columns.filter(c => c.visible);

  useEffect(() => {
    const saved = localStorage.getItem('offerbell_tracker_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      setContacts(parsed.map((c: any) => ({ ...c, linkedin: c.linkedin || '', scheduledAt: c.scheduledAt || null })));
    }
    // NOTE: no sample-seeding write here. The Convex table is the source of
    // truth for contacts; writing an empty list on mount would push [] to the
    // server and wipe real data on every login. Empty just shows until the live
    // server data arrives via the sync hook.
    const theme = localStorage.getItem('offerbell-theme');
    if (theme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); setIsDark(true); }
    setConfig(loadConfig());
  }, []);

  // After login the sync hook merges the cloud copy into localStorage and fires
  // this event. Re-read contacts so a change made on another device shows up
  // here without a manual refresh. This page otherwise only loads on mount,
  // before the cloud data has landed, which is why cross-device edits were not
  // appearing.
  useEffect(() => {
    const onHydrated = () => {
      try {
        const saved = localStorage.getItem('offerbell_tracker_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          setContacts(parsed.map((c: any) => ({ ...c, linkedin: c.linkedin || '', scheduledAt: c.scheduledAt || null })));
        }
      } catch {}
    };
    window.addEventListener('offerbell-progress-hydrated', onHydrated);
    return () => window.removeEventListener('offerbell-progress-hydrated', onHydrated);
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
    // Free users: limited contacts
    const plan = userPlan;
    if (plan !== 'pro' && plan !== 'elite' && contacts.length >= PLAN_LIMITS.outreachContacts.free) {
      showToast(`Free plan allows ${PLAN_LIMITS.outreachContacts.free} contacts. Upgrade to Pro for unlimited.`);
      return;
    }
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
    :root,[data-theme="light"]{--bg:#fafaf9;--surface:#ffffff;--surface-2:#f5f4f2;--border:#ebebea;--border-2:#dddcda;--text:#0c0c0c;--text-2:#636160;--text-3:#9b9997;--sidebar-w:240px}
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
        <main className="main" style={{ padding: '32px 36px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, letterSpacing: '-.5px', color: 'var(--text)', marginBottom: 3 }}>
                Outreach <em style={{ fontStyle: 'italic' }}>Tracker</em>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                Track every networking conversation in one place. Click any row to update.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <a href="https://chromewebstore.google.com/detail/ecmiggmdjpohgidmdonhbcbnlhdagmkp" target="_blank" rel="noopener noreferrer" title="Get the Chrome extension" aria-label="Get the Chrome extension" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.15s', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', fontFamily: "'Sora', sans-serif", textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Extension
              </a>
              <button onClick={() => setDevMode(true)} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', transition: 'border-color 0.15s', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', fontFamily: "'Sora', sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Customize
              </button>
              <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>+ Add Contact</button>
            </div>
          </div>

          {/* Free user limit indicator */}
          {userPlan !== 'pro' && userPlan !== 'elite' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px', marginBottom: 16,
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 10, fontSize: 12, color: 'var(--text-3)',
            }}>
              <span><strong style={{ color: 'var(--text)' }}>{contacts.length}</strong> of <strong style={{ color: 'var(--text)' }}>{PLAN_LIMITS.outreachContacts.free}</strong> contacts used. Upgrade for unlimited contacts and full pipeline tracking.</span>
              <a href="/checkout" style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'var(--text)', color: 'var(--surface)', textDecoration: 'none', fontFamily: "'Sora', sans-serif", flexShrink: 0, marginLeft: 12 }}>Upgrade</a>
            </div>
          )}


          {/* Reminders */}
          <RemindersPanel contacts={contacts} onOpenContact={(id) => {
            const c = contacts.find(ct => ct.id === id);
            if (c) openDrawer(c);
          }} />

          {/* Extension install prompt (self-hides if already installed) */}
          <ExtensionInstallPrompt variant="tracker" />

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Total', val: total, sub: 'contacts tracked' },
              { label: sl('sent', 'Sent'), val: sent, sub: 'emails out' },
              { label: 'Following Up', val: fu, sub: 'awaiting reply' },
              { label: sl('spoken', 'Spoken With'), val: spoken, sub: 'calls completed', highlight: true },
              { label: 'Completion Rate', val: rate, sub: 'of all sent' },
            ].map(s => (
              <div key={s.label} style={{ background: s.highlight ? '#0c0c0c' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '14px 18px', flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: s.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: "'Instrument Serif', 'Times New Roman', serif", fontSize: 32, fontWeight: 400, color: s.highlight ? '#ffffff' : 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: s.highlight ? 'rgba(255,255,255,0.5)' : 'var(--text-3)', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>



          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: 1 }}>Filter:</span>
            {[
              { key: 'all', label: 'All' }, { key: 'drafted', label: sl('drafted', 'Drafted') }, { key: 'sent', label: sl('sent', 'Sent') },
              { key: 'followup', label: 'Following Up' }, { key: 'needsfu', label: 'Needs Follow Up' }, { key: 'spoken', label: sl('spoken', 'Spoken With') },
              { key: 'stay', label: sl('stay', 'Stay in Touch') }, { key: 'noresp', label: sl('noresp', 'No Response') },
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
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1.5px solid var(--border)' }}>
                  {visibleColumns.map(h => (
                    <th key={h.key} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-3)', padding: '12px 14px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h.label}</th>
                  ))}
                  <th style={{ width: 40, padding: '12px 8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={visibleColumns.length + 1} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, fontStyle: 'italic', color: 'var(--text)', marginBottom: 8 }}>No contacts here yet</div>
                    <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Add your first contact to start tracking.</div>
                    <button onClick={() => setModalOpen(true)} style={{ background: 'var(--text)', color: 'var(--surface)', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>+ Add Contact</button>
                  </td></tr>
                ) : filtered.map(c => {
                  const daysSent2 = daysSince(c.sentAt);
                  const daysFU2 = daysSince(c.lastFollowUpAt);
                  const daysLC2 = daysSince(c.lastContact);
                  let daysStr2 = '-';
                  let daysCls2 = 'var(--text-3)';
                  if (c.status === 'drafted') {
                    const d = daysSince(c.createdAt);
                    daysStr2 = d !== null ? (d === 0 ? 'Today' : `${d}d ago`) : '-';
                    daysCls2 = d !== null && d > 14 ? '#dc2626' : d !== null && d > 7 ? '#d97706' : 'var(--text-3)';
                  } else if (c.status === 'sent') {
                    daysStr2 = daysSent2 !== null ? (daysSent2 === 0 ? 'Today' : `${daysSent2}d ago`) : '-';
                    daysCls2 = daysSent2 !== null ? (daysSent2 > 7 ? '#dc2626' : daysSent2 > 3 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (['fu1','fu2','fu3'].includes(c.status)) {
                    daysStr2 = daysFU2 !== null ? `${daysFU2}d ago` : daysSent2 !== null ? `${daysSent2}d ago` : '-';
                    const d2 = daysFU2 ?? daysSent2;
                    daysCls2 = d2 !== null ? (d2 > 10 ? '#dc2626' : d2 > 5 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (['spoken','stay'].includes(c.status)) {
                    daysStr2 = daysLC2 !== null ? (daysLC2 === 0 ? 'Today' : `${daysLC2}d ago`) : '-';
                    daysCls2 = daysLC2 !== null ? (daysLC2 > 60 ? '#dc2626' : daysLC2 > 30 ? '#d97706' : '#16a34a') : 'var(--text-3)';
                  } else if (c.status === 'noresp') {
                    daysStr2 = daysLC2 !== null ? `${daysLC2}d` : '-';
                    daysCls2 = '#dc2626';
                  }
                  const st = STATUSES[c.status] || { label: c.status, cls: 'b-drafted' };
                  const color = colorFor(c.fname + c.lname);

                  const cellRenderers: Record<string, React.ReactNode> = {
                    name: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials(c.fname, c.lname)}</div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>{c.fname} {c.lname}</span>
                      </div>
                    ),
                    firmRole: (
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.firm || '-'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.role}</div>
                      </div>
                    ),
                    status: (
                      <span className={`badge ${st.cls}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>{st.label}</span>
                    ),
                    angle: c.angle ? <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--text-3)' }}>{c.angle}</span> : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>-</span>,
                    linkedin: c.linkedin ? <a href={c.linkedin.startsWith('http') ? c.linkedin : 'https://' + c.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#0a66c2', textDecoration: 'none' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                      Profile
                    </a> : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>-</span>,
                    dateAdded: <span style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>{fmtDate(c.createdAt)}</span>,
                    daysSince: <span style={{ fontSize: 12, fontWeight: 600, color: daysCls2, whiteSpace: 'nowrap' }}>{daysStr2}</span>,
                    quality: c.quality === 'great' ? <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 12 }}>Great</span>
                      : c.quality === 'ok' ? <span style={{ color: '#d97706', fontWeight: 700, fontSize: 12 }}>OK</span>
                      : c.quality === 'cold' ? <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 12 }}>Cold</span>
                      : <span style={{ color: 'var(--text-3)', fontSize: 12 }}>-</span>,
                    notes: <span style={{ fontSize: 12, color: c.notes ? 'var(--text-2)' : 'var(--text-3)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{c.notes || 'No notes'}</span>,
                  };

                  return (
                    <tr key={c.id} onClick={() => openDrawer(c)} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      {visibleColumns.map(col => (
                        <td key={col.key} style={{ padding: '12px 14px' }}>{cellRenderers[col.key]}</td>
                      ))}
                      <td style={{ padding: '8px 8px', textAlign: 'center', width: 40 }}>
                        <button onClick={e => { e.stopPropagation(); if (confirm('Remove ' + c.fname + ' ' + c.lname + '?')) { const updated = contacts.filter(x => x.id !== c.id); setContacts(updated); persist(updated); showToast('Removed'); } }} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--border-2)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--border-2)')}>
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

      {/* ═══ DEVELOPER MODE OVERLAY ═══ */}
      {devMode && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' }} onClick={() => setDevMode(false)}>
          <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 310 }}>
            <button onClick={(e) => { e.stopPropagation(); setDevMode(false); }} style={{ width: 36, height: 36, borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} type="button">
              <svg width="16" height="16" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div onClick={e => e.stopPropagation()} style={{ flex: 1, margin: 20, borderRadius: 20, background: 'var(--surface)', border: '1.5px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
            {/* Header */}
            <div style={{ padding: '20px 28px', borderBottom: '2px solid var(--text)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <svg width="18" height="18" fill="none" stroke="var(--text)" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: 'var(--text)', letterSpacing: '-0.4px' }}>Customize <em style={{ fontStyle: 'italic' }}>Tracker</em></div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Toggle columns and rename statuses to match your workflow</div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Left: Controls */}
              <div style={{ flex: '0 0 420px', overflowY: 'auto', padding: '28px 28px', borderRight: '1px solid var(--border)' }}>
              {/* ── Column Visibility ── */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>Visible Columns</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {config.columns.map((col, ci) => (
                    <div key={col.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, transition: 'border-color 0.15s' }}>
                      <button onClick={() => {
                        if (col.key === 'name' || col.key === 'status') return; // Always visible
                        const next = { ...config, columns: config.columns.map((c, i) => i === ci ? { ...c, visible: !c.visible } : c) };
                        setConfig(next); saveConfig(next);
                      }} type="button" style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${col.visible ? 'var(--text)' : 'var(--border-2)'}`, background: col.visible ? 'var(--text)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: col.key === 'name' || col.key === 'status' ? 'default' : 'pointer', flexShrink: 0, opacity: col.key === 'name' || col.key === 'status' ? 0.5 : 1 }}>
                        {col.visible && <svg width="12" height="12" fill="none" stroke="var(--surface)" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 600, color: col.visible ? 'var(--text)' : 'var(--text-3)', flex: 1 }}>{col.label}</span>
                      {(col.key === 'name' || col.key === 'status') && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 100 }}>Required</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Status Labels ── */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>Status Labels</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.5 }}>Rename any status to match your workflow. Changes apply everywhere in the tracker.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {config.statuses.map((s, si) => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10 }}>
                      <span className={`badge ${s.cls}`} style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }} />
                      <input
                        value={s.label}
                        onChange={e => {
                          const next = { ...config, statuses: config.statuses.map((st, i) => i === si ? { ...st, label: e.target.value } : st) };
                          setConfig(next); saveConfig(next);
                        }}
                        style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: "'Sora', sans-serif", outline: 'none', padding: '4px 0' }}
                      />
                      <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: "'SFMono-Regular', monospace" }}>{s.key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Follow-up Alerts ── */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-3)' }}>Follow-up Alerts</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, lineHeight: 1.5 }}>Choose which statuses trigger reminders and how many days of silence before they fire.</div>
                  </div>
                  <button
                    onClick={() => {
                      const next = { ...config, alertsGlobal: !config.alertsGlobal };
                      setConfig(next); saveConfig(next);
                    }}
                    type="button"
                    style={{
                      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
                      background: config.alertsGlobal ? '#16a34a' : 'var(--border)',
                      position: 'relative', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 3,
                      left: config.alertsGlobal ? 23 : 3,
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>

                {config.alertsGlobal && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {config.alerts.map((rule, ai) => {
                      const statusLabel = config.statuses.find(s => s.key === rule.status)?.label || rule.status;
                      const statusCls = config.statuses.find(s => s.key === rule.status)?.cls || '';
                      return (
                        <div key={rule.status} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '12px 16px', background: 'var(--bg)',
                          border: '1.5px solid var(--border)', borderRadius: 10,
                          opacity: rule.enabled ? 1 : 0.5, transition: 'opacity 0.15s',
                        }}>
                          <button
                            onClick={() => {
                              const next = { ...config, alerts: config.alerts.map((a, i) => i === ai ? { ...a, enabled: !a.enabled } : a) };
                              setConfig(next); saveConfig(next);
                            }}
                            type="button"
                            style={{
                              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                              border: `2px solid ${rule.enabled ? 'var(--text)' : 'var(--border-2)'}`,
                              background: rule.enabled ? 'var(--text)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }}
                          >
                            {rule.enabled && <svg width="12" height="12" fill="none" stroke="var(--surface)" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                          </button>
                          <span className={`badge ${statusCls}`} style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{statusLabel}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>after</span>
                            <input
                              type="number"
                              min={1}
                              max={90}
                              value={rule.days}
                              onChange={e => {
                                const val = Math.max(1, Math.min(90, parseInt(e.target.value) || 1));
                                const next = { ...config, alerts: config.alerts.map((a, i) => i === ai ? { ...a, days: val } : a) };
                                setConfig(next); saveConfig(next);
                              }}
                              style={{
                                width: 48, padding: '5px 6px', textAlign: 'center',
                                border: '1.5px solid var(--border)', borderRadius: 6,
                                fontSize: 13, fontWeight: 700, color: 'var(--text)',
                                background: 'var(--surface)', fontFamily: "'Sora', sans-serif",
                                outline: 'none',
                              }}
                            />
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>days</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Reset ── */}
              <div style={{ paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <button onClick={() => {
                  const fresh = { columns: DEFAULT_COLUMNS.map(c => ({ ...c })), statuses: DEFAULT_STATUSES.map(s => ({ ...s })), alerts: DEFAULT_ALERTS.map(a => ({ ...a })), alertsGlobal: true };
                  setConfig(fresh); saveConfig(fresh);
                  showToast('Reset to defaults');
                }} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 100, border: '1.5px solid #fecaca', background: 'none', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset to Defaults
                </button>
              </div>
            </div>

              {/* Right: Live Preview */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', background: 'var(--bg)', minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>Preview</div>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                        {config.columns.filter(c => c.visible).map(h => (
                          <th key={h.key} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-3)', padding: '10px 10px', textAlign: 'left', whiteSpace: 'nowrap' }}>{h.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Emily Zhang', firm: 'Goldman Sachs', role: 'Analyst', status: 'sent', angle: 'Alumni', linkedin: true, date: '3d ago', quality: 'A', notes: 'Great call' },
                        { name: 'Marcus Li', firm: 'Blackstone', role: 'Associate', status: 'fu1', angle: 'Deal Ref', linkedin: true, date: '5d ago', quality: 'B', notes: '' },
                        { name: 'Sarah Kim', firm: 'JPMorgan', role: 'VP', status: 'spoken', angle: 'Cold', linkedin: false, date: '1d ago', quality: 'A+', notes: 'Coffee chat scheduled' },
                        { name: 'Alex Chen', firm: 'Evercore', role: 'Analyst', status: 'drafted', angle: 'Mutual', linkedin: true, date: 'Today', quality: '', notes: 'Need to send' },
                      ].map((row, ri) => {
                        const st = config.statuses.find(s => s.key === row.status) || { label: row.status, cls: 'b-drafted' };
                        const visCols = config.columns.filter(c => c.visible);
                        return (
                          <tr key={ri} style={{ borderBottom: ri < 3 ? '1px solid var(--border)' : 'none' }}>
                            {visCols.map(col => {
                              let content: React.ReactNode = '-';
                              if (col.key === 'name') content = <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><div style={{ width: 24, height: 24, borderRadius: 6, background: ['#3b82f6','#8b5cf6','#ec4899','#16a34a'][ri], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{row.name.split(' ').map(n => n[0]).join('')}</div><span style={{ fontSize: 11, fontWeight: 700 }}>{row.name}</span></div>;
                              else if (col.key === 'firmRole') content = <div><div style={{ fontSize: 11, fontWeight: 600 }}>{row.firm}</div><div style={{ fontSize: 9, color: 'var(--text-3)' }}>{row.role}</div></div>;
                              else if (col.key === 'status') content = <span className={`badge ${st.cls}`} style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 100, fontSize: 8, fontWeight: 700, whiteSpace: 'nowrap' }}>{st.label}</span>;
                              else if (col.key === 'angle') content = row.angle ? <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--surface-2)', color: 'var(--text-3)' }}>{row.angle}</span> : '-';
                              else if (col.key === 'linkedin') content = row.linkedin ? <span style={{ fontSize: 9, color: '#0a66c2', fontWeight: 600 }}>Profile</span> : <span style={{ color: 'var(--text-3)', fontSize: 9 }}>-</span>;
                              else if (col.key === 'dateAdded') content = <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{row.date}</span>;
                              else if (col.key === 'daysSince') content = <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{row.date}</span>;
                              else if (col.key === 'quality') content = row.quality ? <span style={{ fontSize: 9, fontWeight: 700 }}>{row.quality}</span> : '-';
                              else if (col.key === 'notes') content = <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{row.notes || '-'}</span>;
                              return <td key={col.key} style={{ padding: '10px 10px', fontSize: 11, color: 'var(--text)' }}>{content}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 12, textAlign: 'center', fontStyle: 'italic' }}>Live preview with sample data</div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 28px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Changes save automatically</div>
              <button onClick={() => setDevMode(false)} type="button" style={{ padding: '10px 24px', borderRadius: 100, background: 'var(--text)', color: 'var(--surface)', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora', sans-serif", letterSpacing: '0.3px', textTransform: 'uppercase' }}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: `translateX(-50%) translateY(${toast ? '0' : '80px'})`, background: 'var(--text)', color: 'var(--surface)', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, zIndex: 300, transition: 'transform .3s ease', pointerEvents: 'none', whiteSpace: 'nowrap' }}>{toast}</div>
    </>
  );
}
