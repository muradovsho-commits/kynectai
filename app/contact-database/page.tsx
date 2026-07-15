'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Topbar from '../components/Topbar';
import './contact-database.css';
import { IB_CONTACTS, POSITIONS, type DbContact, type ContactPrivate } from './contact-data';

const LIVE_VERTICAL = 'Investment Banking';
const SAVED_KEY = 'offerbell_contactdb_saved';
const PAGE_SIZE = 25;

/* ── icons ── */
const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.34-4.34" /></svg>
);
const IconSchool = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg>
);
const IconPin = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconCaret = () => (
  <svg className="cdb-select-caret" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
);
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const IconSend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
);
const IconBookmark = ({ filled }: { filled: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" /></svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const IconBuilding = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
);
const IconLinkedin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.4 8.75 22 11.1 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2.05-3.3-2.05 0-2.37 1.57-2.37 3.2V21h-4z" /></svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);
const IconDatabase = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>
);

function initialsOf(c: DbContact): string {
  return (c.first[0] + c.last[0]).toUpperCase();
}

/* ── Multi-select with a text filter, mirrors the reference company/school pickers ── */
function PickerField({
  placeholder,
  icon,
  width,
  options,
  selected,
  onToggle,
}: {
  placeholder: string;
  icon: React.ReactNode;
  width: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const shown = options.filter(o => o.toLowerCase().includes(text.trim().toLowerCase()));

  return (
    <div className="cdb-select-wrap" ref={ref} style={{ width }}>
      <div className="cdb-field">
        <span className="cdb-field-icon">{icon}</span>
        <input
          className="cdb-input"
          placeholder={selected.length ? `${placeholder.replace('...', '')} (${selected.length})` : placeholder}
          value={text}
          onChange={e => { setText(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && (
        <div className="cdb-menu">
          {shown.length === 0 && <div className="cdb-menu-empty">No matches</div>}
          {shown.map(o => (
            <button key={o} type="button" className="cdb-menu-item" onClick={() => onToggle(o)}>
              <span className={`cdb-check${selected.includes(o) ? ' on' : ''}`}><IconCheck /></span>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PositionField({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div className="cdb-select-wrap" ref={ref}>
      <button type="button" className={`cdb-select-btn${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span>{selected.length ? `Position (${selected.length})` : 'Position'}</span>
        <IconCaret />
      </button>
      {open && (
        <div className="cdb-menu">
          {POSITIONS.map(p => (
            <button key={p} type="button" className="cdb-menu-item" onClick={() => onToggle(p)}>
              <span className={`cdb-check${selected.includes(p) ? ' on' : ''}`}><IconCheck /></span>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContactDatabasePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.localStorage.getItem('offerbell_user_id')) router.replace('/signin');
  }, [router]);

  // Selected industry lives in the onboarding profile; the Topbar switcher
  // rewrites targetRoles[0] and fires 'offerbell-profile-changed' in-window.
  const [vertical, setVertical] = useState('');
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('offerbell_onboarding_profile');
        const p = raw ? JSON.parse(raw) : {};
        setVertical((Array.isArray(p.targetRoles) && p.targetRoles[0]) || '');
      } catch { setVertical(''); }
    };
    read();
    window.addEventListener('offerbell-profile-changed', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('offerbell-profile-changed', read);
      window.removeEventListener('storage', read);
    };
  }, []);

  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);

  const [saved, setSaved] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      const p = raw ? JSON.parse(raw) : [];
      if (Array.isArray(p)) setSaved(p);
    } catch {}
  }, []);
  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<'contact' | 'experience' | 'education'>('contact');

  // Unlock state is server-owned. `details` only ever holds contacts this user
  // has actually paid for; everything else has no address on the client at all.
  const [details, setDetails] = useState<Record<string, ContactPrivate>>({});
  const [credits, setCredits] = useState<{ plan: string; used: number; limit: number; lifetime: boolean } | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockErr, setUnlockErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/contact-unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ action: 'status' }),
        });
        if (!r.ok) return;
        const d = await r.json();
        if (!alive) return;
        setDetails(d.details || {});
        setCredits({ plan: d.plan, used: d.used, limit: d.limit, lifetime: d.lifetime });
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const doUnlock = async (id: string) => {
    setUnlocking(true); setUnlockErr('');
    try {
      const r = await fetch('/api/contact-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'unlock', contactId: id }),
      });
      const d = await r.json();
      if (!r.ok) {
        setUnlockErr(d?.message || 'Could not unlock this contact. Try again.');
        if (typeof d?.used === 'number') setCredits({ plan: d.plan, used: d.used, limit: d.limit, lifetime: d.lifetime });
        return;
      }
      setDetails(prev => ({ ...prev, [id]: d.detail }));
      setCredits({ plan: d.plan, used: d.used, limit: d.limit, lifetime: d.lifetime });
    } catch {
      setUnlockErr('Could not reach the server. Try again.');
    } finally {
      setUnlocking(false);
    }
  };

  const companyOptions = useMemo(
    () => Array.from(new Set(IB_CONTACTS.map(c => c.company).filter(Boolean))).sort(),
    []
  );
  const schoolOptions = useMemo(
    () => Array.from(new Set(IB_CONTACTS.map(c => c.school).filter(Boolean))).sort(),
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return IB_CONTACTS.filter(c => {
      if (q && !`${c.first} ${c.last} ${c.company} ${c.title}`.toLowerCase().includes(q)) return false;
      // Substring rather than exact match: the sheet stores school as a full
      // degree line ("Boston College - Carroll School of Management"), so an
      // exact match would split one school across several options.
      if (companies.length && !companies.some(v => c.company.toLowerCase().includes(v.toLowerCase()))) return false;
      if (schools.length && !schools.some(v => c.school.toLowerCase().includes(v.toLowerCase()))) return false;
      if (positions.length && !positions.includes(c.seniority)) return false;
      if (savedOnly && !saved.includes(c.id)) return false;
      return true;
    });
  }, [query, companies, schools, positions, savedOnly, saved]);

  // The list is over a thousand rows, so render a page at a time.
  const [shown, setShown] = useState(PAGE_SIZE);
  useEffect(() => { setShown(PAGE_SIZE); }, [query, companies, schools, positions, savedOnly]);
  const page = results.slice(0, shown);

  const active = openId ? IB_CONTACTS.find(c => c.id === openId) || null : null;

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    setter(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));

  const openContact = (id: string) => { setOpenId(id); setTab('contact'); setUnlockErr(''); };

  const remaining = credits ? Math.max(0, credits.limit - credits.used) : null;
  const outOfCredits = remaining === 0;
  const creditNote = credits === null
    ? ''
    : credits.lifetime
      ? `${remaining} of ${credits.limit} free unlocks remaining`
      : `${remaining} of ${credits.limit} unlocks left this week. Resets Monday.`;

  /* ── Verticals without a dataset yet ── */
  if (vertical && vertical !== LIVE_VERTICAL) {
    return (
      <div className="cdb-app">
        <Topbar activePage="contact-database" />
        <div className="cdb-soon-wrap">
          <div className="cdb-soon">
            <div className="cdb-soon-icon"><IconDatabase /></div>
            <p className="cdb-soon-kicker">In progress</p>
            <h1>The {vertical} database is being built</h1>
            <p>
              We are verifying every {vertical.toLowerCase()} profile before it goes live, so the
              search is not open yet. Roles, firms, schools, and contact details all get checked by
              hand first. This vertical is next in the queue.
            </p>
            <div className="cdb-soon-rule" />
            <div className="cdb-soon-note">
              <strong>Investment Banking</strong> is live today. Switch your industry from the
              topbar to browse it.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cdb-app">
      <Topbar activePage="contact-database" />

      {/* ── Filter bar ── */}
      <div className="cdb-filterbar">
        <div className="cdb-filters-left">
          <div className="cdb-field cdb-field-people">
            <span className="cdb-field-icon"><IconSearch /></span>
            <input
              className="cdb-input"
              placeholder="Search people..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <PickerField
            placeholder="Search by company..."
            icon={<IconSearch />}
            width="220px"
            options={companyOptions}
            selected={companies}
            onToggle={toggle(setCompanies)}
          />

          <PickerField
            placeholder="Search by school..."
            icon={<IconSchool />}
            width="220px"
            options={schoolOptions}
            selected={schools}
            onToggle={toggle(setSchools)}
          />

          <PositionField selected={positions} onToggle={toggle(setPositions)} />
        </div>

        <button
          type="button"
          className={`cdb-saved-btn${savedOnly ? ' on' : ''}`}
          onClick={() => setSavedOnly(s => !s)}
        >
          <IconUsers />
          Saved{saved.length ? ` (${saved.length})` : ''}
        </button>
      </div>

      {/* ── List ── */}
      <div className="cdb-body">
        <div className={`cdb-listcol${active ? ' shifted' : ''}`}>
          <div className="cdb-listhead">
            <h2>Recommended People</h2>
            <span className="cdb-count">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
          </div>

          {results.length === 0 ? (
            <div className="cdb-empty">No people match these filters.</div>
          ) : (
            <div className="cdb-cards">
              {page.map(c => (
                <div
                  key={c.id}
                  className={`cdb-card${openId === c.id ? ' active' : ''}`}
                  onClick={() => openContact(c.id)}
                >
                  <span className="cdb-avatar">{initialsOf(c)}</span>

                  <div className="cdb-cardmain">
                    <span className="cdb-name">{c.first} {c.last}</span>
                    <span className="cdb-metarow">
                      <span className="cdb-firm">{c.company}</span>
                      <span className="cdb-dot">·</span>
                      <span className="cdb-role">{c.title}</span>
                    </span>
                    <div className="cdb-subrow">
                      {c.school && (
                        <span className="cdb-sub">
                          <IconSchool />
                          <span className="cdb-sub-school">{c.school}</span>
                        </span>
                      )}
                      {c.location && (
                        <span className="cdb-sub">
                          <IconPin />
                          {c.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="cdb-cardactions">
                    <button
                      type="button"
                      className="cdb-req-btn"
                      onClick={e => { e.stopPropagation(); openContact(c.id); }}
                    >
                      <IconSend />
                      Request Contact
                    </button>
                    <button
                      type="button"
                      className={`cdb-bm-btn${saved.includes(c.id) ? ' on' : ''}`}
                      title={saved.includes(c.id) ? 'Remove from saved' : 'Save contact'}
                      onClick={e => { e.stopPropagation(); toggleSave(c.id); }}
                    >
                      <IconBookmark filled={saved.includes(c.id)} />
                    </button>
                  </div>
                </div>
              ))}
              {shown < results.length && (
                <button type="button" className="cdb-more" onClick={() => setShown(n => n + PAGE_SIZE)}>
                  Load {Math.min(PAGE_SIZE, results.length - shown)} more
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail panel ── */}
      {active && (
        <aside className="cdb-panel">
          <button type="button" className="cdb-panel-close" onClick={() => setOpenId(null)} title="Close">
            <IconX />
          </button>

          <h2 className="cdb-panel-name">{active.first} {active.last}</h2>
          <div className="cdb-panel-meta">
            <span className="cdb-metarow">
              <IconBuilding />
              <span className="cdb-firm">{active.company}</span>
              <span className="cdb-dot">·</span>
              <span className="cdb-role">{active.title}</span>
            </span>
            {active.school && (
              <span className="cdb-metarow">
                <IconSchool />
                <span className="cdb-sub-school" style={{ fontSize: 13 }}>{active.school}</span>
              </span>
            )}
            {active.location && <span className="cdb-sub"><IconPin size={13} />{active.location}</span>}
          </div>

          <div className="cdb-tabs">
            <button type="button" className={`cdb-tab${tab === 'contact' ? ' on' : ''}`} onClick={() => setTab('contact')}>Contact</button>
            <button type="button" className={`cdb-tab${tab === 'experience' ? ' on' : ''}`} onClick={() => setTab('experience')}>Experience</button>
            <button type="button" className={`cdb-tab${tab === 'education' ? ' on' : ''}`} onClick={() => setTab('education')}>Education</button>
          </div>

          {tab === 'contact' && (
            <>
              <p className="cdb-sect-label">Contact</p>
              <div className="cdb-contact-box">
                <div className="cdb-contact-row">
                  <IconLinkedin />
                  <span className="cdb-contact-key">LinkedIn</span>
                  {details[active.id] ? (
                    <a className="cdb-contact-val cdb-link" href={details[active.id].linkedin} target="_blank" rel="noopener noreferrer">
                      {details[active.id].linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </a>
                  ) : (
                    <span className="cdb-redact"><span style={{ width: 84 }} /><span style={{ width: 62 }} /></span>
                  )}
                </div>
                <div className="cdb-contact-row">
                  <IconMail />
                  <span className="cdb-contact-key">Email</span>
                  {details[active.id] ? (
                    <a className="cdb-contact-val cdb-link" href={`mailto:${details[active.id].email}`}>{details[active.id].email}</a>
                  ) : (
                    <span className="cdb-redact"><span style={{ width: 96 }} /><span style={{ width: 70 }} /></span>
                  )}
                </div>

                {!details[active.id] && (
                  <>
                    <button
                      type="button"
                      className="cdb-unlock"
                      disabled={unlocking || outOfCredits}
                      onClick={() => doUnlock(active.id)}
                    >
                      {unlocking ? 'Unlocking...' : outOfCredits ? 'No unlocks left' : 'Unlock contact info'}
                    </button>
                    {creditNote && (
                      <p className="cdb-unlock-note">
                        {creditNote}
                        {outOfCredits && credits?.plan !== 'elite' && (
                          <>
                            {' '}
                            <Link href="/checkout" className="cdb-link">Upgrade</Link>
                          </>
                        )}
                      </p>
                    )}
                    {unlockErr && <p className="cdb-unlock-err">{unlockErr}</p>}
                  </>
                )}
              </div>
            </>
          )}

          {tab === 'experience' && (
            <>
              <p className="cdb-sect-label">Experience</p>
              <div className="cdb-exp">
                <div className="cdb-exp-co">
                  <div className="cdb-exp-co-name">{active.company}</div>
                  <div className="cdb-exp-co-dur">Current</div>
                  <div className="cdb-exp-roles">
                    <div>
                      <div className="cdb-exp-role-title">{active.title}</div>
                      {active.location && <div className="cdb-exp-role-loc"><IconPin />{active.location}</div>}
                    </div>
                  </div>
                </div>
                <p className="cdb-tab-note">Full role history is not on file yet. Open their LinkedIn for the rest.</p>
              </div>
            </>
          )}

          {tab === 'education' && (
            <>
              <p className="cdb-sect-label">Education</p>
              <div className="cdb-edu">
                {active.school ? (
                  <div>
                    <div className="cdb-edu-school">{active.school}</div>
                  </div>
                ) : (
                  <p className="cdb-tab-note">No school on file for this contact.</p>
                )}
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
}
