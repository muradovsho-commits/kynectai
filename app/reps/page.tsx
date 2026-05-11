'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { REPS_TRACKS, REPS_SCENARIOS, type RepsTrackId, type Scenario, type Persona, type ArtifactSpec } from './reps-data';

// ─────────────────────────────────────────────────────────────────────────────
// Reps — career-simulator page.
//
// Three top-level views, no URL routing (kept local for speed):
//   1. Track grid: pick one of 10 careers
//   2. Scenario list: pick a workday scenario in that career
//   3. Session: chat panel on left, artifact workspace on right
//
// The session is NOT a scripted chatbot. Personas drop opening messages, the
// student then EITHER replies in chat OR uploads work product. When the
// student uploads, the file is parsed server-side (xlsx/docx/pdf), the actual
// content is sent to the AI along with the artifact's grading rubric, and the
// AI grades on craft — citing specific cells, sections, or numbers. Feedback
// lands in the chat in the voice of the persona who asked for the work.
// ─────────────────────────────────────────────────────────────────────────────

type ChatMsg = {
  id: string;
  from: 'persona' | 'student' | 'system';
  personaId?: string;
  text: string;
  // For grading messages, optionally include the artifact reference and score.
  artifactId?: string;
  scores?: Record<string, number>;
};

type UploadStatus = 'idle' | 'parsing' | 'grading' | 'done' | 'error';

export default function RepsPage() {
  const router = useRouter();
  const [activeTrack, setActiveTrack] = useState<RepsTrackId | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) router.replace('/signin');
  }, [router]);

  const track = activeTrack ? REPS_TRACKS.find(t => t.id === activeTrack) : null;
  const scenarios = activeTrack ? REPS_SCENARIOS[activeTrack] : [];
  const scenario = activeScenarioId ? scenarios.find(s => s.id === activeScenarioId) : null;

  return (
    <div className="app">
      <Sidebar activePage="reps" />
      <main className="main" style={{ padding: scenario ? 0 : '32px 36px', maxWidth: scenario ? '100%' : 1200 }}>

        {/* Breadcrumb — hidden during session for focus */}
        {!scenario && (activeTrack) && (
          <div style={{ marginBottom: 20, fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" onClick={() => { setActiveTrack(null); setActiveScenarioId(null); }} style={breadcrumbBtn}>Reps</button>
            {track && <>
              <span>/</span>
              <span style={{ color: 'var(--text)' }}>{track.title}</span>
            </>}
          </div>
        )}

        {/* VIEW 1: Track grid */}
        {!activeTrack && (
          <TrackGrid onPick={(id) => setActiveTrack(id)} />
        )}

        {/* VIEW 2: Scenario list */}
        {activeTrack && !activeScenarioId && track && (
          <ScenarioList track={track} scenarios={scenarios} onPick={(id) => setActiveScenarioId(id)} />
        )}

        {/* VIEW 3: Live session */}
        {scenario && (
          <SessionView
            key={scenario.id}
            scenario={scenario}
            onExit={() => setActiveScenarioId(null)}
          />
        )}

      </main>
    </div>
  );
}

const breadcrumbBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--text-3)',
  cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontSize: 12, padding: 0,
};

// ═══════════════════════════════════════════════════════════════════════════
// VIEW 1 — Track grid
// ═══════════════════════════════════════════════════════════════════════════
function TrackGrid({ onPick }: { onPick: (id: RepsTrackId) => void }) {
  return (
    <>
      <header style={{ marginBottom: 36, paddingBottom: 26, borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 10 }}>Reps</div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 46, lineHeight: 1.04, letterSpacing: '-0.6px', color: 'var(--text)', margin: 0, marginBottom: 12 }}>
          Live a day in <em style={{ fontStyle: 'italic' }}>the career.</em>
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 640, margin: 0 }}>
          Drop into a realistic workday. Take pings from your MD, your client, your investment committee. Build the actual work — comps, models, memos, slides — and get graded on craft.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
        {REPS_TRACKS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onPick(t.id)}
            style={{
              textAlign: 'left', padding: '22px 24px',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              borderRadius: 14, cursor: 'pointer',
              transition: 'border-color .15s, transform .15s',
              fontFamily: "'Sora',sans-serif",
              display: 'flex', flexDirection: 'column', gap: 12, minHeight: 168,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Instrument Serif',serif", fontSize: 18, fontStyle: 'italic' }}>
                {t.abbr}
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>{REPS_SCENARIOS[t.id]?.length || 0} scenarios</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{t.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>{t.tagline}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VIEW 2 — Scenario list
// ═══════════════════════════════════════════════════════════════════════════
function ScenarioList({ track, scenarios, onPick }: { track: typeof REPS_TRACKS[number]; scenarios: Scenario[]; onPick: (id: string) => void; }) {
  return (
    <>
      <header style={{ marginBottom: 28, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: track.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Instrument Serif',serif", fontSize: 22, fontStyle: 'italic' }}>
            {track.abbr}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 34, lineHeight: 1.05, color: 'var(--text)', margin: 0, marginBottom: 4 }}>
              {track.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{track.tagline}</p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 660, margin: 0 }}>{track.description}</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {scenarios.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            style={{
              textAlign: 'left', padding: '20px 24px',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              borderRadius: 12, cursor: 'pointer',
              transition: 'border-color .15s',
              fontFamily: "'Sora',sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={metaTag}>{s.timeframe}</span>
                <span style={dotSep} />
                <span style={metaTag}>{s.duration}</span>
                <span style={dotSep} />
                <span style={metaTag}>{s.difficulty}</span>
                {s.artifacts.length > 0 && <>
                  <span style={dotSep} />
                  <span style={{ ...metaTag, color: 'var(--text-2)' }}>{s.artifacts.length} deliverable{s.artifacts.length === 1 ? '' : 's'}</span>
                </>}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>{s.summary}</div>
            </div>
            <svg width="18" height="18" fill="none" stroke="var(--text-3)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        ))}
      </div>
    </>
  );
}

const metaTag: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' };
const dotSep: React.CSSProperties = { width: 3, height: 3, borderRadius: '50%', background: 'var(--text-3)' };

// ═══════════════════════════════════════════════════════════════════════════
// VIEW 3 — Live session
//
// Two-pane layout: chat on the left, artifact workspace on the right.
// ═══════════════════════════════════════════════════════════════════════════
function SessionView({ scenario, onExit }: { scenario: Scenario; onExit: () => void; }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(scenario.artifacts[0]?.id ?? null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [completedArtifacts, setCompletedArtifacts] = useState<Set<string>>(new Set());
  const chatRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drop opening messages from the scenario into the chat on mount.
  useEffect(() => {
    const opening: ChatMsg[] = scenario.opening.map((o, i) => ({
      id: `open-${i}`,
      from: 'persona',
      personaId: o.personaId,
      text: o.text,
    }));
    setMessages(opening);
  }, [scenario]);

  // Auto-scroll chat to bottom on new messages.
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const personaById = useCallback((id?: string) => {
    return scenario.personas.find(p => p.id === id);
  }, [scenario]);

  const activeArtifact: ArtifactSpec | null = activeArtifactId
    ? scenario.artifacts.find(a => a.id === activeArtifactId) ?? null
    : null;

  // ── Send a chat message ─────────────────────────────────────────────────
  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, from: 'student', text }]);
    setSending(true);
    try {
      const res = await fetch('/api/reps/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          scenarioContext: scenario.context,
          personas: scenario.personas,
          history: messages.map(m => ({ from: m.from, personaId: m.personaId, text: m.text })),
          userMessage: text,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages(prev => [...prev, { id: `e-${Date.now()}`, from: 'system', text: data.error || 'Something went wrong.' }]);
      } else if (data.replies && Array.isArray(data.replies)) {
        // The API can return one or more persona replies.
        const newMsgs: ChatMsg[] = data.replies.map((r: any, i: number) => ({
          id: `p-${Date.now()}-${i}`,
          from: 'persona',
          personaId: r.personaId,
          text: r.text,
        }));
        setMessages(prev => [...prev, ...newMsgs]);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, from: 'system', text: 'Connection error.' }]);
    } finally {
      setSending(false);
    }
  }

  // ── Upload + grade an artifact ──────────────────────────────────────────
  async function handleFileUpload(file: File) {
    if (!activeArtifact) return;
    setUploadStatus('parsing');
    setUploadError(null);

    try {
      // Send the raw file to the parsing+grading endpoint.
      const fd = new FormData();
      fd.append('file', file);
      fd.append('scenarioContext', scenario.context);
      fd.append('artifactPrompt', activeArtifact.prompt);
      fd.append('artifactRubric', activeArtifact.rubric);
      fd.append('artifactFormat', activeArtifact.format);
      fd.append('graderPersona', JSON.stringify(personaById(activeArtifact.requestedBy)));

      setUploadStatus('grading');
      const res = await fetch('/api/reps/grade', {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadStatus('error');
        setUploadError(data.error || 'Grading failed.');
        return;
      }

      setUploadStatus('done');
      setCompletedArtifacts(prev => new Set(prev).add(activeArtifact.id));

      // Drop the grading message into the chat from the persona who requested it.
      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        from: 'persona',
        personaId: activeArtifact.requestedBy,
        text: data.feedback,
        artifactId: activeArtifact.id,
        scores: data.scores,
      }]);
    } catch (e: any) {
      setUploadStatus('error');
      setUploadError(e?.message || 'Upload failed.');
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Sora',sans-serif" }}>

      {/* LEFT PANE — chat */}
      <section style={{ flex: '0 0 480px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', background: 'var(--bg)' }}>
        {/* Header */}
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ minWidth: 0 }}>
            <button type="button" onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', padding: 0, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
              Exit session
            </button>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{scenario.title}</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {scenario.personas.map(p => (
              <div key={p.id} title={`${p.name} — ${p.title}`} style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--text)', color: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                {p.initials}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map(m => {
            if (m.from === 'system') {
              return <div key={m.id} style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', padding: '6px 0' }}>{m.text}</div>;
            }
            if (m.from === 'student') {
              return (
                <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '78%', background: 'var(--text)', color: 'var(--surface)', padding: '10px 14px', borderRadius: '14px 14px 4px 14px', fontSize: 13, lineHeight: 1.5 }}>{m.text}</div>
              );
            }
            const p = personaById(m.personaId);
            return (
              <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 7, background: 'var(--text)', color: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{p?.initials || '?'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{p?.name || 'Persona'}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{p?.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{m.text}</div>
                  {m.scores && (
                    <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text-2)' }}>
                      {Object.entries(m.scores).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                          <span style={{ fontWeight: 700, color: 'var(--text)' }}>{v}/10</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {sending && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: 'var(--text-3)', fontSize: 12 }}>
              <div style={{ width: 28, height: 28 }} />
              <span>Typing…</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Reply…"
              rows={1}
              style={{
                flex: 1, resize: 'none', padding: '10px 12px',
                border: '1.5px solid var(--border)', borderRadius: 10,
                background: 'var(--surface)', color: 'var(--text)',
                fontSize: 13, fontFamily: "'Sora',sans-serif",
                outline: 'none', maxHeight: 120, lineHeight: 1.5,
              }}
            />
            <button
              type="button" onClick={handleSend} disabled={!input.trim() || sending}
              style={{
                background: 'var(--text)', color: 'var(--surface)',
                border: 'none', padding: '10px 16px', borderRadius: 10,
                fontSize: 12, fontWeight: 700, cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !sending ? 1 : 0.4,
                fontFamily: "'Sora',sans-serif",
              }}
            >Send</button>
          </div>
        </div>
      </section>

      {/* RIGHT PANE — artifact workspace */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface)' }}>
        <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase' }}>Workspace</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {scenario.artifacts.map(a => (
              <button
                key={a.id} type="button"
                onClick={() => setActiveArtifactId(a.id)}
                style={{
                  padding: '5px 12px', fontSize: 11, fontWeight: 700,
                  border: '1.5px solid ' + (a.id === activeArtifactId ? 'var(--text)' : 'var(--border)'),
                  background: a.id === activeArtifactId ? 'var(--text)' : 'transparent',
                  color: a.id === activeArtifactId ? 'var(--surface)' : 'var(--text-2)',
                  borderRadius: 7, cursor: 'pointer', fontFamily: "'Sora',sans-serif",
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {a.label}
                {completedArtifacts.has(a.id) && <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', maxWidth: 760 }}>
          {!activeArtifact && (
            <div style={{ color: 'var(--text-3)', fontSize: 13 }}>No deliverable selected.</div>
          )}
          {activeArtifact && (
            <>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 8 }}>Deliverable · {activeArtifact.format.toUpperCase()}</div>
              <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, lineHeight: 1.15, color: 'var(--text)', margin: 0, marginBottom: 18 }}>{activeArtifact.label}</h2>

              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 22 }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{activeArtifact.prompt}</div>
              </div>

              <UploadBox
                format={activeArtifact.format}
                status={uploadStatus}
                error={uploadError}
                completed={completedArtifacts.has(activeArtifact.id)}
                onFile={handleFileUpload}
                fileInputRef={fileInputRef}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UploadBox — drag-and-drop file input + status display
// ═══════════════════════════════════════════════════════════════════════════
function UploadBox({ format, status, error, completed, onFile, fileInputRef }: {
  format: string; status: UploadStatus; error: string | null; completed: boolean;
  onFile: (f: File) => void; fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [dragOver, setDragOver] = useState(false);
  const accept = {
    xlsx: '.xlsx,.xls,.xlsm',
    docx: '.docx',
    pdf: '.pdf',
    pptx: '.pptx',
  }[format as 'xlsx' | 'docx' | 'pdf' | 'pptx'] || '.*';

  const statusLabel = {
    idle: completed ? 'Resubmit revision' : 'Drop file or click to upload',
    parsing: 'Parsing file…',
    grading: 'Grading on craft…',
    done: 'Graded — feedback in chat',
    error: 'Upload failed',
  }[status];

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file" accept={accept}
        style={{ display: 'none' }}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault(); setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed ' + (dragOver ? 'var(--text)' : 'var(--border)'),
          borderRadius: 14,
          padding: '40px 24px',
          textAlign: 'center',
          cursor: status === 'parsing' || status === 'grading' ? 'wait' : 'pointer',
          background: dragOver ? 'var(--surface)' : 'transparent',
          transition: 'border-color .15s, background .15s',
        }}
      >
        <div style={{ width: 44, height: 44, margin: '0 auto 14px', borderRadius: 11, background: 'var(--text)', color: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {status === 'parsing' || status === 'grading' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="14 8" opacity="0.6" /></svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{statusLabel}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{format.toUpperCase()} only · max 4 MB</div>
        {error && <div style={{ marginTop: 10, fontSize: 12, color: '#dc2626' }}>{error}</div>}
      </div>
    </div>
  );
}
