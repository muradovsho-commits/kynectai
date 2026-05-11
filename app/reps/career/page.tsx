'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import '../../contact-finder/contact-finder.css';
import { REPS_SCENARIOS } from '../reps-data';
import {
  IB_YEAR_1_EVENTS,
  IB_PERSONA_PROFILE,
  SCHOOLS,
  BACKGROUNDS,
  FIRMS_BY_CAREER,
  SKILL_LABELS,
  SKILL_DESCRIPTIONS,
  getStartingSkills,
  applyBackgroundBonus,
  computeOverall,
  getNextEvent,
  applyEffects,
  type PlayerSave,
  type CareerId,
  type CareerEvent,
  type NarrativeEvent,
  type QuickDecisionEvent,
  type MajorDeliverableEvent,
  type TrainingEvent,
  type TimeSkipEvent,
  type EvaluationEvent,
  type SkillId,
  type Skills,
} from '../career-data';

// ─────────────────────────────────────────────────────────────────────────────
// MyCareer: the long-form career simulator. Co-exists with the Practice mode
// at /reps (track grid). This route handles its own player creation, save/load,
// and game loop. State persists in localStorage under offerbell_career_save_*.
// ─────────────────────────────────────────────────────────────────────────────

const SAVE_KEY_PREFIX = 'offerbell_career_save_';
const ACTIVE_CAREER_KEY = 'offerbell_career_active'; // which career the user is currently playing

function saveKeyFor(career: CareerId): string {
  return `${SAVE_KEY_PREFIX}${career}`;
}

function loadSave(career: CareerId): PlayerSave | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(saveKeyFor(career));
    if (!raw) return null;
    return JSON.parse(raw) as PlayerSave;
  } catch {
    return null;
  }
}

function writeSave(save: PlayerSave) {
  if (typeof window === 'undefined') return;
  try {
    const next = { ...save, lastPlayedAt: Date.now() };
    localStorage.setItem(saveKeyFor(save.career), JSON.stringify(next));
    localStorage.setItem(ACTIVE_CAREER_KEY, save.career);
  } catch {
    // quota or unavailable, ignore
  }
}

function deleteSave(career: CareerId) {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(saveKeyFor(career)); } catch { /* ignore */ }
}

// ─── Persona photos (mirrors the lookup in /reps/page.tsx) ───────────────────

const PERSONA_PHOTOS: Record<string, string> = {
  'David Chen':        'https://randomuser.me/api/portraits/men/32.jpg',
  'Priya Raman':       'https://randomuser.me/api/portraits/women/44.jpg',
  'Marcus Whitfield':  'https://randomuser.me/api/portraits/men/45.jpg',
  'Anna Liu':          'https://randomuser.me/api/portraits/women/21.jpg',
  'Jordan Park':       'https://randomuser.me/api/portraits/men/22.jpg',
};

function PersonaPhoto({ name, size = 36 }: { name: string; size?: number }) {
  const [errored, setErrored] = useState(false);
  const url = PERSONA_PHOTOS[name];
  if (!url || errored) {
    const initials = name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: '#1f2937', color: '#fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: size * 0.42, flexShrink: 0 }}>{initials}</div>
    );
  }
  return (
    <img src={url} alt={name} width={size} height={size} loading="lazy" onError={() => setErrored(true)} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block', background: 'var(--bg)' }} />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Top-level page
// ═════════════════════════════════════════════════════════════════════════════

export default function CareerPage() {
  const router = useRouter();
  const [activeSave, setActiveSave] = useState<PlayerSave | null>(null);
  const [phase, setPhase] = useState<'loading' | 'menu' | 'creating' | 'playing'>('loading');
  const [planAuthorized, setPlanAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) {
      router.replace('/signin');
      return;
    }
    const plan = (localStorage.getItem('offerbell_plan') || 'free').toLowerCase();
    if (plan !== 'elite') {
      // Send them back to /reps which has the paywall UI.
      router.replace('/reps');
      return;
    }
    setPlanAuthorized(true);

    // Load active career if any.
    const activeCareer = localStorage.getItem(ACTIVE_CAREER_KEY) as CareerId | null;
    if (activeCareer) {
      const save = loadSave(activeCareer);
      if (save) {
        setActiveSave(save);
        setPhase('playing');
        return;
      }
    }
    setPhase('menu');
  }, [router]);

  if (!planAuthorized || phase === 'loading') {
    return <div className="app"><Sidebar activePage="reps" /><main className="main" style={{ padding: 32 }} /></div>;
  }

  return (
    <div className="app">
      <Sidebar activePage="reps" />
      <main className="main" style={{ padding: phase === 'playing' ? 0 : '28px 32px', maxWidth: phase === 'playing' ? '100%' : 1100 }}>
        {phase === 'menu' && (
          <CareerMenu
            onStartNew={(career) => {
              // For now only IB is fully built. Block selection of others here.
              setPhase('creating');
              localStorage.setItem(ACTIVE_CAREER_KEY, career);
            }}
            onResume={(save) => {
              setActiveSave(save);
              setPhase('playing');
            }}
            onExitToReps={() => router.push('/reps')}
          />
        )}
        {phase === 'creating' && (
          <PlayerCreation
            career="ib"
            onCreate={(save) => {
              writeSave(save);
              setActiveSave(save);
              setPhase('playing');
            }}
            onCancel={() => setPhase('menu')}
          />
        )}
        {phase === 'playing' && activeSave && (
          <GameLoop
            save={activeSave}
            onSaveChange={(next) => { setActiveSave(next); writeSave(next); }}
            onExit={() => { router.push('/reps'); }}
            onAbandon={() => {
              if (window.confirm('Abandon this career? Your save will be deleted permanently. This cannot be undone.')) {
                deleteSave(activeSave.career);
                localStorage.removeItem(ACTIVE_CAREER_KEY);
                setActiveSave(null);
                setPhase('menu');
              }
            }}
          />
        )}
      </main>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MENU: start new career, resume existing, return to Practice
// ═════════════════════════════════════════════════════════════════════════════

const CAREER_TILES: { id: CareerId; title: string; tagline: string; available: boolean; accent: string }[] = [
  { id: 'ib',         title: 'Investment Banking', tagline: 'Two years of analyst life, leading into on-cycle PE and lateral decisions.', available: true,  accent: '#1f2937' },
  { id: 'pe',         title: 'Private Equity',     tagline: 'Post-banking buyside arc. Sourcing, diligence, IC defense.',                 available: false, accent: '#1d4ed8' },
  { id: 'consulting', title: 'Consulting',         tagline: 'Strategy generalist track. Engagement to engagement, partner path.',         available: false, accent: '#0891b2' },
  { id: 'rx',         title: 'Restructuring',      tagline: 'Crisis-first banking. Distressed mandates, sponsor calls, lender battles.',  available: false, accent: '#7c2d12' },
  { id: 'st',         title: 'Sales & Trading',    tagline: 'A trading career in IG credit. Desk politics, P&L, risk tolerance.',         available: false, accent: '#dc2626' },
  { id: 'am',         title: 'Asset Management',   tagline: 'Long-only equity research, PM pitch reps, conviction over time.',            available: false, accent: '#166534' },
  { id: 'vc',         title: 'Venture Capital',    tagline: 'Decks, founder calls, partner meetings, the long compounding bet.',          available: false, accent: '#7c3aed' },
  { id: 're',         title: 'Real Estate',        tagline: 'Acquisitions analyst track. Underwriting, IC, market cycles.',               available: false, accent: '#92400e' },
  { id: 'er',         title: 'Equity Research',    tagline: 'Sellside research arc. Notes, ratings, buyside coverage building.',          available: false, accent: '#0f766e' },
  { id: 'audit',      title: 'Accounting & Audit', tagline: 'Big Four career path. Engagements, reviews, manager promotion track.',       available: false, accent: '#4f46e5' },
];

function CareerMenu({ onStartNew, onResume, onExitToReps }: {
  onStartNew: (career: CareerId) => void;
  onResume: (save: PlayerSave) => void;
  onExitToReps: () => void;
}) {
  const existingSaves = useMemo<PlayerSave[]>(() => {
    const out: PlayerSave[] = [];
    for (const tile of CAREER_TILES) {
      const s = loadSave(tile.id);
      if (s) out.push(s);
    }
    return out.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
  }, []);

  return (
    <>
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button type="button" onClick={onExitToReps} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Practice mode
        </button>
      </div>

      <header style={{ marginBottom: 36, paddingBottom: 26, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a8a', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 10 }}>MyCareer</div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 50, lineHeight: 1.02, letterSpacing: '-0.6px', color: 'var(--text)', margin: 0, marginBottom: 14 }}>
          Build <em style={{ fontStyle: 'italic' }}>a career.</em>
        </h1>
        <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 680, margin: 0 }}>
          A long-form career simulator. Pick a track, create your player, and live through the years. Your skills, reputation, and burnout determine what happens next. Multiple seasons, branching outcomes, the deals you'll remember.
        </p>
      </header>

      {existingSaves.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>Resume</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {existingSaves.map(s => (
              <button key={s.saveId} type="button" onClick={() => onResume(s)} style={{
                textAlign: 'left', padding: '16px 20px',
                border: '1.5px solid var(--border)', background: 'var(--surface)',
                borderRadius: 12, cursor: 'pointer',
                fontFamily: "'Sora',sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
              }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>{s.playerName}, Year {s.currentYear} {careerLabel(s.career)} Analyst</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.firmName} · {s.playerSchool} · Week {s.currentWeek} of 50 · OVR {computeOverall(s.skills)}</div>
                </div>
                <svg width="16" height="16" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>Start a new career</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {CAREER_TILES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => t.available && onStartNew(t.id)}
              disabled={!t.available}
              style={{
                textAlign: 'left', padding: '22px 24px',
                border: '1.5px solid var(--border)', background: 'var(--surface)',
                borderRadius: 14,
                cursor: t.available ? 'pointer' : 'not-allowed',
                opacity: t.available ? 1 : 0.55,
                transition: 'border-color .15s',
                fontFamily: "'Sora',sans-serif",
                display: 'flex', flexDirection: 'column', gap: 12, minHeight: 168, position: 'relative',
              }}
              onMouseEnter={e => { if (t.available) e.currentTarget.style.borderColor = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Instrument Serif',serif", fontSize: 18, fontStyle: 'italic' }}>
                  {t.id === 'ib' ? 'IB' : t.id === 'pe' ? 'PE' : t.id === 'consulting' ? 'C' : t.id === 'rx' ? 'Rx' : t.id === 'st' ? 'ST' : t.id === 'am' ? 'AM' : t.id === 'vc' ? 'VC' : t.id === 're' ? 'RE' : t.id === 'er' ? 'ER' : 'A'}
                </div>
                {!t.available && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', padding: '3px 7px', border: '1px solid var(--border)', borderRadius: 5 }}>Coming soon</span>}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{t.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>{t.tagline}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function careerLabel(id: CareerId): string {
  return ({ ib: 'IB', pe: 'PE', consulting: 'Consulting', rx: 'Rx', st: 'S&T', am: 'AM', vc: 'VC', re: 'RE', er: 'ER', audit: 'Audit' } as Record<CareerId, string>)[id];
}

// ═════════════════════════════════════════════════════════════════════════════
// PLAYER CREATION: multi-step
// ═════════════════════════════════════════════════════════════════════════════

function PlayerCreation({ career, onCreate, onCancel }: {
  career: CareerId;
  onCreate: (save: PlayerSave) => void;
  onCancel: () => void;
}) {
  type Step = 1 | 2 | 3 | 4 | 5;
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [hometown, setHometown] = useState('');
  const [backgroundId, setBackgroundId] = useState('');
  const [firmName, setFirmName] = useState('');

  const firmOptions = FIRMS_BY_CAREER[career];
  const selectedFirm = firmOptions.find(f => f.name === firmName);

  const finalSkills = useMemo(() => applyBackgroundBonus(getStartingSkills(), backgroundId), [backgroundId]);

  function commit() {
    const save: PlayerSave = {
      saveId: `save-${Date.now()}`,
      career,
      playerName: name.trim() || 'Unnamed Analyst',
      playerSchool: school || 'Other',
      playerHometown: hometown.trim() || 'Somewhere, USA',
      playerBackgroundId: backgroundId,
      firmName: firmName || firmOptions[0].name,
      currentYear: 1,
      currentWeek: 0,
      skills: finalSkills,
      stamina: 80,
      reputations: {},
      completedEventIds: [],
      badges: [],
      signatureMoments: [],
      status: 'active',
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
    onCreate(save);
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          Cancel
        </button>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a8a', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>
          Player Creation · Step {step} of 5
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 38, lineHeight: 1.08, color: 'var(--text)', margin: 0, marginBottom: 6 }}>
          {step === 1 && 'Who are you?'}
          {step === 2 && 'Where do you come from?'}
          {step === 3 && 'What did you do in college?'}
          {step === 4 && 'Where did you sign?'}
          {step === 5 && <>Welcome to <em style={{ fontStyle: 'italic' }}>{firmName}</em>.</>}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0, lineHeight: 1.6 }}>
          {step === 1 && 'Pick a name and school. These show up everywhere in the game.'}
          {step === 2 && 'Hometown is just for flavor. It will come up.'}
          {step === 3 && "Background gives you a small skill bonus to start. Pick what's closest to who you actually were."}
          {step === 4 && "Pick your firm. Each one has a real personality. The choice shapes your culture, your deal flow, and what your seniors care about."}
          {step === 5 && 'Confirm and start your career.'}
        </p>
      </div>

      <div style={{ padding: '28px 30px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, marginBottom: 20 }}>
        {step === 1 && (
          <div>
            <label style={fieldLabelStyle}>Your name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alex Chen" style={fieldInputStyle} autoFocus />

            <label style={{ ...fieldLabelStyle, marginTop: 18 }}>Your school</label>
            <select value={school} onChange={e => setSchool(e.target.value)} style={fieldInputStyle}>
              <option value="">Pick a school</option>
              {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <label style={fieldLabelStyle}>Hometown</label>
            <input type="text" value={hometown} onChange={e => setHometown(e.target.value)} placeholder="e.g. Cleveland, OH" style={fieldInputStyle} autoFocus />
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BACKGROUNDS.map(bg => (
              <button key={bg.id} type="button" onClick={() => setBackgroundId(bg.id)} style={{
                textAlign: 'left', padding: '14px 18px',
                border: '1.5px solid ' + (backgroundId === bg.id ? 'var(--text)' : 'var(--border)'),
                background: backgroundId === bg.id ? 'var(--bg)' : 'transparent',
                borderRadius: 10, cursor: 'pointer', fontFamily: "'Sora',sans-serif",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{bg.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 6 }}>{bg.blurb}</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1e3a8a', letterSpacing: '.3px' }}>
                  {Object.entries(bg.bonus).map(([k, v]) => `+${v} ${SKILL_LABELS[k as SkillId]}`).join(' · ')}
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {firmOptions.map(f => (
              <button key={f.name} type="button" onClick={() => setFirmName(f.name)} style={{
                textAlign: 'left', padding: '14px 18px',
                border: '1.5px solid ' + (firmName === f.name ? 'var(--text)' : 'var(--border)'),
                background: firmName === f.name ? 'var(--bg)' : 'transparent',
                borderRadius: 10, cursor: 'pointer', fontFamily: "'Sora',sans-serif",
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <div style={{
                  flexShrink: 0,
                  width: 44, height: 44, borderRadius: 10,
                  background: f.accent, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Instrument Serif',serif", fontStyle: 'italic', fontSize: 18,
                }}>
                  {f.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.55 }}>{f.tagline}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div>
            <div style={{ marginBottom: 18, padding: '16px 18px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Player card</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{name || 'Unnamed Analyst'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 2 }}>{school || 'Other'} · {hometown || 'Somewhere, USA'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{firmName} · Year 1 IB Analyst</div>
              {selectedFirm && (
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.55, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', fontStyle: 'italic' }}>
                  {selectedFirm.tagline}
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 10 }}>Starting skills</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {(['modeling', 'memo', 'commercial', 'voice'] as SkillId[]).map(k => (
                <div key={k} style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
                  <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 4 }}>{SKILL_LABELS[k]}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>{finalSkills[k]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={() => setStep(s => (s > 1 ? (s - 1) as Step : s))} disabled={step === 1}
          style={{ ...nextButtonStyle, background: 'transparent', color: 'var(--text-2)', border: '1.5px solid var(--border)', opacity: step === 1 ? 0.4 : 1 }}>
          Back
        </button>

        {step < 5 ? (
          <button type="button" onClick={() => setStep(s => (s + 1) as Step)}
            disabled={
              (step === 1 && (!name.trim() || !school)) ||
              (step === 2 && !hometown.trim()) ||
              (step === 3 && !backgroundId) ||
              (step === 4 && !firmName)
            }
            style={nextButtonStyle}>
            Continue
          </button>
        ) : (
          <button type="button" onClick={commit} style={nextButtonStyle}>
            Start career
          </button>
        )}
      </div>
    </div>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 8, fontFamily: "'Sora',sans-serif",
};
const fieldInputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'var(--bg)', color: 'var(--text)', fontSize: 14, fontFamily: "'Sora',sans-serif", outline: 'none',
};
const nextButtonStyle: React.CSSProperties = {
  background: 'var(--text)', color: 'var(--surface)', border: 'none', padding: '12px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif",
};

// ═════════════════════════════════════════════════════════════════════════════
// GAME LOOP
// ═════════════════════════════════════════════════════════════════════════════

function GameLoop({ save, onSaveChange, onExit, onAbandon }: {
  save: PlayerSave;
  onSaveChange: (next: PlayerSave) => void;
  onExit: () => void;
  onAbandon: () => void;
}) {
  const nextEvent = useMemo(() => getNextEvent(save), [save]);

  function completeEvent(eventId: string, week: number, effects: any, eventTitle: string) {
    let nextSave: PlayerSave = applyEffects(save, effects, week, eventTitle);
    nextSave = {
      ...nextSave,
      completedEventIds: [...nextSave.completedEventIds, eventId],
      currentWeek: Math.max(nextSave.currentWeek, week + 1),
    };
    onSaveChange(nextSave);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: "'Sora',sans-serif" }}>
      <PlayerHeader save={save} onExit={onExit} onAbandon={onAbandon} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <section style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', minWidth: 0 }}>
          {nextEvent ? (
            <EventRenderer event={nextEvent} save={save} onComplete={completeEvent} />
          ) : (
            <YearEndPlaceholder save={save} />
          )}
        </section>
        <aside style={{ flex: '0 0 320px', borderLeft: '1px solid var(--border)', overflowY: 'auto', padding: '24px 24px', background: 'var(--surface)' }}>
          <CareerSidebar save={save} />
        </aside>
      </div>
    </div>
  );
}

// ─── Player Header (top bar) ────────────────────────────────────────────────

function PlayerHeader({ save, onExit, onAbandon }: { save: PlayerSave; onExit: () => void; onAbandon: () => void }) {
  const ovr = computeOverall(save.skills);
  return (
    <header style={{ padding: '14px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <div>
          <button type="button" onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            Save and exit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{save.playerName}</div>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Year {save.currentYear} {careerLabel(save.career)} Analyst at {save.firmName}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Skill chips */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['modeling', 'memo', 'commercial', 'voice'] as SkillId[]).map(k => (
            <div key={k} title={SKILL_DESCRIPTIONS[k]} style={{ padding: '4px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 7, minWidth: 70 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.3px', textTransform: 'uppercase' }}>{SKILL_LABELS[k]}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', fontFamily: "'Instrument Serif',serif" }}>{save.skills[k]}</div>
            </div>
          ))}
          <div style={{ padding: '4px 10px', background: '#1e3a8a', color: '#fde68a', border: '1px solid #1e3a8a', borderRadius: 7, minWidth: 56 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase' }}>Overall</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Instrument Serif',serif" }}>{ovr}</div>
          </div>
        </div>

        {/* Stamina */}
        <div style={{ minWidth: 100 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.3px', textTransform: 'uppercase', marginBottom: 4 }}>Stamina</div>
          <div style={{ height: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${save.stamina}%`, height: '100%', background: save.stamina > 60 ? '#16a34a' : save.stamina > 30 ? '#d97706' : '#dc2626', transition: 'width .25s' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 2 }}>{save.stamina}/100</div>
        </div>

        {/* Calendar */}
        <div style={{ minWidth: 110 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.3px', textTransform: 'uppercase', marginBottom: 4 }}>Calendar</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Y{save.currentYear} W{save.currentWeek}<span style={{ color: 'var(--text-3)', fontWeight: 400 }}>/50</span></div>
        </div>

        <button type="button" onClick={onAbandon} title="Permanently delete this save" style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', padding: '6px 8px' }}>
          Abandon
        </button>
      </div>
    </header>
  );
}

// ─── Career sidebar (right panel) ───────────────────────────────────────────

function CareerSidebar({ save }: { save: PlayerSave }) {
  const reps = useMemo(() => {
    return Object.entries(save.reputations)
      .map(([k, v]) => ({ key: k, value: v, profile: IB_PERSONA_PROFILE[k] }))
      .filter(r => r.profile)
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [save.reputations]);

  return (
    <>
      {reps.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>Reputation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reps.map(r => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PersonaPhoto name={r.profile.photoKey} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{r.profile.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{r.profile.title}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.value > 0 ? '#16a34a' : r.value < 0 ? '#dc2626' : 'var(--text-3)' }}>
                  {r.value > 0 ? '+' : ''}{r.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {save.badges.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>Badges</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {save.badges.map(b => (
              <span key={b} style={{ fontSize: 10.5, fontWeight: 700, padding: '4px 9px', background: '#fde68a', color: '#854d0e', borderRadius: 5, letterSpacing: '.2px' }}>{b}</span>
            ))}
          </div>
        </div>
      )}

      {save.signatureMoments.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>Defining moments</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {save.signatureMoments.slice().reverse().map(m => (
              <div key={m.id} style={{ padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.3px', marginBottom: 4 }}>Y{m.year} W{m.week}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{m.title}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{m.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reps.length === 0 && save.badges.length === 0 && save.signatureMoments.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
          Reputation, badges, and defining moments will appear here as you progress.
        </div>
      )}
    </>
  );
}

function YearEndPlaceholder({ save }: { save: PlayerSave }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#1e3a8a', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 10 }}>End of available content</div>
      <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 32, lineHeight: 1.1, color: 'var(--text)', margin: 0, marginBottom: 14 }}>
        You're caught up.
      </h2>
      <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 22 }}>
        You've reached the end of the content shipped so far for this career. The next batch (weeks {save.currentWeek}-25 of Year 1) is in the build queue.
      </p>
      <div style={{ padding: '16px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Where you are</div>
        <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>{save.playerName}, Year {save.currentYear} W{save.currentWeek} at {save.firmName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)' }}>OVR {computeOverall(save.skills)} · {save.badges.length} badges · {save.signatureMoments.length} defining moments</div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// EVENT RENDERERS
// ═════════════════════════════════════════════════════════════════════════════

function EventRenderer({ event, save, onComplete }: {
  event: CareerEvent;
  save: PlayerSave;
  onComplete: (eventId: string, week: number, effects: any, eventTitle: string) => void;
}) {
  switch (event.type) {
    case 'narrative':       return <NarrativeRenderer  event={event} onDone={() => onComplete(event.id, event.week, event.effects, event.title)} />;
    case 'quick_decision':  return <DecisionRenderer   event={event} onChoose={(opt) => onComplete(event.id, event.week, opt.effects, event.title)} />;
    case 'training':        return <TrainingRenderer   event={event} onDone={() => onComplete(event.id, event.week, { skills: { [event.skill]: event.skillGain }, stamina: -event.staminaCost } as any, event.title)} />;
    case 'time_skip':       return <TimeSkipRenderer   event={event} onDone={() => onComplete(event.id, event.week + event.weeksAdvanced - 1, event.effects, event.title)} />;
    case 'evaluation':      return <EvaluationRenderer event={event} save={save} onDone={() => onComplete(event.id, event.week, undefined, event.title)} />;
    case 'major_deliverable': return <DeliverableRenderer event={event} save={save} onComplete={(passed) => onComplete(event.id, event.week, passed ? event.effectsOnPass : event.effectsOnFail, event.title)} />;
  }
}

function EventChrome({ event, children }: { event: CareerEvent; children: React.ReactNode }) {
  const typeLabel: Record<CareerEvent['type'], string> = {
    narrative: 'Scene',
    quick_decision: 'Decision',
    training: 'Training',
    time_skip: 'Time skip',
    evaluation: 'Review',
    major_deliverable: 'Deliverable',
  };
  const isDefining = (event as any).defining;
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Week {event.week} · {typeLabel[event.type]}</span>
        {isDefining && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#854d0e', background: '#fde68a', padding: '2px 7px', borderRadius: 4, letterSpacing: '.3px', textTransform: 'uppercase' }}>Defining moment</span>}
      </div>
      <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, lineHeight: 1.1, color: 'var(--text)', margin: 0, marginBottom: 24 }}>{event.title}</h2>
      {children}
    </div>
  );
}

// ─── Narrative ──────────────────────────────────────────────────────────────

function NarrativeRenderer({ event, onDone }: { event: NarrativeEvent; onDone: () => void }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const scene = event.scenes[sceneIdx];
  const isLast = sceneIdx === event.scenes.length - 1;
  return (
    <EventChrome event={event}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {event.scenes.slice(0, sceneIdx + 1).map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {s.speaker ? (
              <PersonaPhoto name={s.speakerPersonaKey ? IB_PERSONA_PROFILE[s.speakerPersonaKey]?.photoKey || s.speaker : s.speaker} size={36} />
            ) : (
              <div style={{ width: 36 }} />
            )}
            <div style={{ flex: 1, minWidth: 0, padding: '12px 16px', background: s.speaker ? 'var(--surface)' : 'transparent', border: s.speaker ? '1px solid var(--border)' : 'none', borderRadius: 10 }}>
              {s.speaker && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{s.speaker}</span>
                  {s.speakerTitle && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{s.speakerTitle}</span>}
                </div>
              )}
              <div style={{ fontSize: 13.5, color: s.speaker ? 'var(--text)' : 'var(--text-2)', lineHeight: 1.65 }}>{s.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 26 }}>
        <button type="button" onClick={() => isLast ? onDone() : setSceneIdx(i => i + 1)} style={nextButtonStyle}>
          {isLast ? 'Continue' : 'Next'}
        </button>
      </div>
    </EventChrome>
  );
}

// ─── Quick decision ─────────────────────────────────────────────────────────

function DecisionRenderer({ event, onChoose }: { event: QuickDecisionEvent; onChoose: (opt: QuickDecisionEvent['options'][number]) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const selected = event.options.find(o => o.id === selectedId);

  return (
    <EventChrome event={event}>
      <div style={{ padding: '14px 18px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 18, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65 }}>{event.setup}</div>

      {event.speaker && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 22 }}>
          <PersonaPhoto name={event.speakerPersonaKey ? IB_PERSONA_PROFILE[event.speakerPersonaKey]?.photoKey || event.speaker : event.speaker} size={36} />
          <div style={{ flex: 1, padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{event.speaker}</span>
              {event.speakerTitle && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{event.speakerTitle}</span>}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.65 }}>{event.prompt}</div>
          </div>
        </div>
      )}

      {!showConsequence && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {event.options.map(opt => (
            <button key={opt.id} type="button" onClick={() => setSelectedId(opt.id)} style={{
              textAlign: 'left', padding: '14px 18px',
              border: '1.5px solid ' + (selectedId === opt.id ? 'var(--text)' : 'var(--border)'),
              background: selectedId === opt.id ? 'var(--bg)' : 'var(--surface)',
              borderRadius: 10, cursor: 'pointer', fontFamily: "'Sora',sans-serif",
              fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5,
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {showConsequence && selected && (
        <div style={{ padding: '16px 18px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>You chose</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{selected.label}</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 14 }}>{selected.consequence}</div>
          <EffectsSummary effects={selected.effects} />
        </div>
      )}

      <div style={{ marginTop: 22 }}>
        {!showConsequence && (
          <button type="button" disabled={!selectedId} onClick={() => setShowConsequence(true)} style={{ ...nextButtonStyle, opacity: selectedId ? 1 : 0.4, cursor: selectedId ? 'pointer' : 'not-allowed' }}>
            Confirm choice
          </button>
        )}
        {showConsequence && selected && (
          <button type="button" onClick={() => onChoose(selected)} style={nextButtonStyle}>
            Continue
          </button>
        )}
      </div>
    </EventChrome>
  );
}

// ─── Training ───────────────────────────────────────────────────────────────

function TrainingRenderer({ event, onDone }: { event: TrainingEvent; onDone: () => void }) {
  return (
    <EventChrome event={event}>
      <div style={{ padding: '20px 22px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Drill</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>{event.drillTitle}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{event.drillDescription}</div>
      </div>
      <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>What you'll gain</div>
        <EffectsSummary effects={{ skills: { [event.skill]: event.skillGain } as any, stamina: -event.staminaCost }} />
      </div>
      <button type="button" onClick={onDone} style={nextButtonStyle}>Complete drill</button>
    </EventChrome>
  );
}

// ─── Time skip ──────────────────────────────────────────────────────────────

function TimeSkipRenderer({ event, onDone }: { event: TimeSkipEvent; onDone: () => void }) {
  return (
    <EventChrome event={event}>
      <div style={{ padding: '20px 22px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 18, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7 }}>
        {event.blurb}
      </div>
      {event.effects && (
        <div style={{ padding: '14px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 22 }}>
          <EffectsSummary effects={event.effects} />
        </div>
      )}
      <button type="button" onClick={onDone} style={nextButtonStyle}>Continue</button>
    </EventChrome>
  );
}

// ─── Evaluation ─────────────────────────────────────────────────────────────

function EvaluationRenderer({ event, save, onDone }: { event: EvaluationEvent; save: PlayerSave; onDone: () => void }) {
  // Generate dynamic feedback based on save state.
  const ovr = computeOverall(save.skills);
  const mdRep = save.reputations['md'] || 0;
  const vpRep = save.reputations['vp'] || 0;
  const assocRep = save.reputations['assoc'] || 0;
  const stamina = save.stamina;

  const lines: string[] = [];
  if (vpRep >= 5) lines.push('"You handle pings well. People upstream notice."');
  else if (vpRep <= -2) lines.push('"You need to be sharper on the small interactions. Pings, follow-ups, tone."');
  else lines.push('"Solid on the basics so far. Nothing concerning, nothing standout."');

  if (save.skills.modeling >= 70) lines.push('"Your modeling is ahead of your class. Don\'t lose that edge."');
  else if (save.skills.modeling <= 62) lines.push('"Modeling needs more reps. Do drills on weekends if you have to."');

  if (stamina < 40) lines.push('"You look exhausted. Don\'t burn out in your first quarter."');
  else if (stamina > 80) lines.push('"You\'ve got gas left. Good."');

  if (assocRep >= 5) lines.push('"Jordan likes working with you. That carries weight when staffing comes up."');
  else if (assocRep <= -2) lines.push('"Your associate has flagged some friction. Talk to Jordan offline."');

  if (lines.length < 3) lines.push('"Keep your head down for the next ten weeks. Then we\'ll have a longer conversation."');

  return (
    <EventChrome event={event}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 22 }}>
        <PersonaPhoto name={event.evaluator} size={48} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{event.evaluator}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{event.evaluatorTitle}</div>
        </div>
      </div>
      {event.prompts.map((p, i) => (
        <div key={i} style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 14 }}>{p}</div>
      ))}
      <div style={{ padding: '18px 20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 12 }}>{event.evaluator}'s read</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic' }}>{l}</div>
        ))}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Current overall: <strong style={{ color: 'var(--text)' }}>{ovr}</strong> · Stamina: <strong style={{ color: 'var(--text)' }}>{stamina}/100</strong></div>
        </div>
      </div>
      <button type="button" onClick={onDone} style={nextButtonStyle}>Continue</button>
    </EventChrome>
  );
}

// ─── Major deliverable ──────────────────────────────────────────────────────

function DeliverableRenderer({ event, save, onComplete }: {
  event: MajorDeliverableEvent;
  save: PlayerSave;
  onComplete: (passed: boolean) => void;
}) {
  const scenario = REPS_SCENARIOS[event.scenarioCareerId]?.find(s => s.id === event.scenarioId);
  const [artifactIdx, setArtifactIdx] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'grading' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const [lastScores, setLastScores] = useState<Record<string, number> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [allDone, setAllDone] = useState(false);

  if (!scenario) {
    return (
      <EventChrome event={event}>
        <div style={{ color: '#dc2626', fontSize: 13 }}>Error: scenario {event.scenarioId} not found.</div>
        <div style={{ marginTop: 22 }}>
          <button type="button" onClick={() => onComplete(false)} style={nextButtonStyle}>Skip event</button>
        </div>
      </EventChrome>
    );
  }

  const artifact = scenario.artifacts[artifactIdx];
  const isLastArtifact = artifactIdx === scenario.artifacts.length - 1;

  async function handleFile(file: File) {
    if (!artifact) return;
    setUploadStatus('parsing');
    setUploadError(null);
    setLastFeedback(null);
    setLastScores(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('scenarioContext', scenario.context);
      fd.append('artifactPrompt', artifact.prompt);
      fd.append('artifactRubric', artifact.rubric);
      fd.append('artifactFormat', artifact.format);
      const requester = scenario.personas.find(p => p.id === artifact.requestedBy);
      fd.append('graderPersona', JSON.stringify(requester));

      setUploadStatus('grading');
      const res = await fetch('/api/reps/grade', { method: 'POST', body: fd, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) {
        setUploadStatus('error');
        setUploadError(data.error || 'Grading failed.');
        return;
      }
      const sc: Record<string, number> = data.scores || {};
      const values = Object.values(sc).filter((v): v is number => typeof v === 'number');
      const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      setScores(prev => [...prev, avg]);
      setLastFeedback(data.feedback || '');
      setLastScores(sc);
      setUploadStatus('idle');
    } catch (e: any) {
      setUploadStatus('error');
      setUploadError(e?.message || 'Upload failed.');
    }
  }

  function advance() {
    setLastFeedback(null);
    setLastScores(null);
    if (isLastArtifact) {
      setAllDone(true);
    } else {
      setArtifactIdx(i => i + 1);
    }
  }

  if (allDone) {
    const overallAvg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const passed = overallAvg >= event.passThreshold;
    return (
      <EventChrome event={event}>
        <div style={{ padding: '24px 26px', background: passed ? 'var(--bg)' : 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 14, marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Result</div>
          <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, lineHeight: 1.1, color: 'var(--text)', margin: 0, marginBottom: 12 }}>
            {passed ? 'You shipped it.' : 'Below the bar.'}
          </h3>
          <div style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 14 }}>
            Average score across {scores.length} deliverable{scores.length > 1 ? 's' : ''}: <strong style={{ color: 'var(--text)' }}>{overallAvg.toFixed(1)}/10</strong>. {passed ? 'The team is happy.' : 'You\'ll feel this on the next staffing decision.'}
          </div>
          <EffectsSummary effects={passed ? event.effectsOnPass : event.effectsOnFail} />
        </div>
        <button type="button" onClick={() => onComplete(passed)} style={nextButtonStyle}>Continue</button>
      </EventChrome>
    );
  }

  const requester = scenario.personas.find(p => p.id === artifact.requestedBy);

  return (
    <EventChrome event={event}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Deliverable {artifactIdx + 1} of {scenario.artifacts.length}</span>
        {scores.length > 0 && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>· Prior: {scores.map(s => s.toFixed(1)).join(', ')}/10</span>}
      </div>

      {requester && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 18 }}>
          <PersonaPhoto name={requester.name} size={32} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 2 }}>
              {requester.name} is asking you to build
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{artifact.label}</div>
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 18, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
        {scenario.context}
      </div>

      <div style={{ padding: '18px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 18 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Brief · {artifact.format.toUpperCase()}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{artifact.prompt}</div>
      </div>

      {!lastFeedback && (
        <>
          <input ref={fileInputRef} type="file" accept={`.${artifact.format},.xls,.xlsm`} style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); if (fileInputRef.current) fileInputRef.current.value = ''; }} />
          <div onClick={() => fileInputRef.current?.click()}
            style={{ border: '2px dashed var(--border)', borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: uploadStatus === 'parsing' || uploadStatus === 'grading' ? 'wait' : 'pointer', marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
              {uploadStatus === 'idle' && 'Drop file or click to upload'}
              {uploadStatus === 'parsing' && 'Parsing file...'}
              {uploadStatus === 'grading' && 'Grading on craft...'}
              {uploadStatus === 'error' && 'Upload failed'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{artifact.format.toUpperCase()} only, max 4 MB</div>
            {uploadError && <div style={{ marginTop: 10, fontSize: 12, color: '#dc2626' }}>{uploadError}</div>}
          </div>
        </>
      )}

      {lastFeedback && lastScores && (
        <div style={{ padding: '18px 20px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 12, marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Grader feedback</div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65, marginBottom: 14, whiteSpace: 'pre-wrap' }}>{lastFeedback}</div>
          <div style={{ padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8 }}>
            {Object.entries(lastScores).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                <span style={{ color: 'var(--text-2)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{v}/10</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <button type="button" onClick={advance} style={nextButtonStyle}>
              {isLastArtifact ? 'Finish deliverable' : 'Next deliverable'}
            </button>
          </div>
        </div>
      )}
    </EventChrome>
  );
}

// ─── Effects summary line ───────────────────────────────────────────────────

function EffectsSummary({ effects }: { effects?: any }) {
  if (!effects) return null;
  const lines: string[] = [];
  if (effects.skills) {
    for (const [k, v] of Object.entries(effects.skills)) {
      const num = v as number;
      if (num) lines.push(`${num > 0 ? '+' : ''}${num} ${SKILL_LABELS[k as SkillId]}`);
    }
  }
  if (typeof effects.stamina === 'number' && effects.stamina !== 0) {
    lines.push(`${effects.stamina > 0 ? '+' : ''}${effects.stamina} Stamina`);
  }
  if (effects.reputations) {
    for (const [k, v] of Object.entries(effects.reputations)) {
      const num = v as number;
      if (num) {
        const profile = IB_PERSONA_PROFILE[k];
        const name = profile ? profile.name : k;
        lines.push(`${num > 0 ? '+' : ''}${num} rep with ${name}`);
      }
    }
  }
  if (effects.badges) {
    for (const b of effects.badges) lines.push(`Badge: ${b}`);
  }
  if (effects.signatureMoment) {
    lines.push(`Defining moment: ${effects.signatureMoment.title}`);
  }
  if (lines.length === 0) return null;
  return (
    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7 }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
