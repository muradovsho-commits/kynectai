'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import '../contact-finder/contact-finder.css'; // global color vars + frame theming
import '../reps/desk.css';                      // .desk-app / .desk-canvas / .desk-page frame

// ─────────────────────────────────────────────────────────────────────────────
// OB — the Elite voice coach (macOS desktop app).
//
// OB is a separate desktop application; this page is its home on the website:
// for Elite users it's the get-started / download page, for everyone else it's
// the Elite paywall. The real enforcement is in the app itself (it verifies the
// user's OfferBell Elite account on launch via Convex auth:verifyLicense); the
// localStorage check here is the same UI gate every paid page uses.
// ─────────────────────────────────────────────────────────────────────────────

type PlanStatus = 'loading' | 'elite' | 'gated';

// The standalone OB download (a zip that unpacks to ~/ob). Host OB.zip in the
// site's /public folder so it serves from here. If you ever move it, change this.
const OB_DOWNLOAD_URL = '/OB.zip';
const OB_SUPPORT_EMAIL = 'officialofferbell@gmail.com';

export default function ObPage() {
  const router = useRouter();
  const [planStatus, setPlanStatus] = useState<PlanStatus>('loading');
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  // Auth + plan gate (localStorage UI hint; the OB app enforces Elite on launch).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem('offerbell_user_id')) {
      router.replace('/signin');
      return;
    }
    const plan = (localStorage.getItem('offerbell_plan') || 'free').toLowerCase();
    setCurrentPlan(plan);
    setPlanStatus(plan === 'elite' ? 'elite' : 'gated');
  }, [router]);

  // Apply saved theme on mount (mirrors other pages).
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('offerbell-theme') : null;
    if (saved && typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', saved);
  }, []);

  if (planStatus === 'loading') {
    return (
      <div className="desk-app">
        <Sidebar activePage="ob" />
        <main className="desk-canvas"><div className="desk-page" /></main>
      </div>
    );
  }

  return (
    <div className="desk-app">
      <Sidebar activePage="ob" />
      <main className="desk-canvas">
        <div className="desk-page">
          <div className="desk-page-inner">
            {planStatus === 'elite' ? <ObElite /> : <ObPaywall currentPlan={currentPlan} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared feature list
// ═══════════════════════════════════════════════════════════════════════════
const FEATURES: { title: string; body: string }[] = [
  { title: 'Live voice mock interviews', body: 'Pick a track and firm, then get grilled out loud by a tough interviewer that asks follow-ups and grades you. All ten tracks.' },
  { title: 'Company teardowns', body: 'Say a company and OB pulls its filings and walks you through the business, the numbers, and the story.' },
  { title: 'Coffee chats & outreach', body: 'Hand OB a LinkedIn URL. It preps you for the call and drafts a personalized message in your voice.' },
  { title: 'Morning market brief', body: 'A quick spoken read on the market and your watchlist so you walk into the day with a view.' },
];

const OB_ORB = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.5" />
    <path d="M7.5 12a4.5 4.5 0 0 1 9 0" />
    <path d="M4 12a8 8 0 0 1 16 0" />
  </svg>
);

// The OB node-sphere, animated — a recreation of the real OB HUD (a rotating
// wireframe constellation sphere). Canvas-rendered, no assets. Lives in a dark
// device panel so it sells the "proprietary voice tech" look on any site theme.
function OBShowcase() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = typeof window !== 'undefined'
      && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fibonacci sphere of points.
    const N = 74;
    const pts: number[][] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * Math.PI * (3 - Math.sqrt(5));
      pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
    }
    // Edges between near neighbors (the constellation lines).
    const edges: number[][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], dz = pts[i][2] - pts[j][2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.52) edges.push([i, j]);
      }
    }

    let raf = 0;
    let t = 0;
    const tilt = 0.42, cosX = Math.cos(tilt), sinX = Math.sin(tilt);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += reduce ? 0 : 0.0030;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.43, R = Math.min(w, h) * 0.30;
      const cosY = Math.cos(t), sinY = Math.sin(t);

      const proj = pts.map((p) => {
        const x = p[0] * cosY - p[2] * sinY;
        const z = p[0] * sinY + p[2] * cosY;
        const y = p[1];
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        const depth = (z2 + 1.4) / 2.8; // ~0 (back) .. ~1 (front)
        return { x: cx + x * R, y: cy + y2 * R, depth };
      });

      // lines
      ctx.lineWidth = 0.6;
      for (const [i, j] of edges) {
        const a = proj[i], b = proj[j];
        const al = Math.max(0, ((a.depth + b.depth) / 2)) * 0.42;
        ctx.strokeStyle = 'rgba(125,155,215,' + al.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // nodes
      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        const tw = 0.62 + 0.38 * Math.sin(t * 2.1 + i * 1.27);
        const sz = 0.8 + p.depth * 1.9;
        const al = Math.min(1, (0.22 + p.depth * 0.7) * tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(214,226,255,' + al.toFixed(3) + ')';
        ctx.shadowColor = 'rgba(120,160,255,0.85)';
        ctx.shadowBlur = p.depth * 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const dockIcon = (path: React.ReactNode) => (
    <span style={{ display: 'inline-flex', color: '#7da2e6' }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
    </span>
  );

  return (
    <div className="obshow">
      <style dangerouslySetInnerHTML={{ __html: `
        .obshow{
          position:relative; border-radius:22px; overflow:hidden; min-height:380px;
          background:radial-gradient(120% 100% at 50% 35%, #0a1124 0%, #060a16 50%, #03050b 100%);
          border:1px solid rgba(59,130,246,0.20);
          box-shadow:0 24px 60px -30px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .obshow::before{
          content:""; position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(90,130,220,0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(90,130,220,0.05) 1px, transparent 1px);
          background-size:26px 26px;
        }
        .obshow-canvas{ position:absolute; inset:0; width:100%; height:100%; display:block; }
        .obshow-head{ position:absolute; top:16px; left:18px; z-index:2; }
        .obshow-ob{ font-family:'Instrument Serif',serif; font-size:22px; color:#e8eeff; line-height:1; }
        .obshow-sub{ font-family:'Sora',sans-serif; font-size:8.5px; letter-spacing:0.18em; color:rgba(150,170,215,0.6); margin-top:4px; }
        .obshow-by{ position:absolute; left:0; right:0; bottom:62px; text-align:center; z-index:2;
          font-family:'Sora',sans-serif; font-size:11px; color:rgba(150,170,215,0.45); }
        .obshow-dock{ position:absolute; left:50%; transform:translateX(-50%); bottom:20px; z-index:2;
          display:flex; align-items:center; gap:16px; padding:9px 16px; border-radius:13px;
          background:rgba(10,16,32,0.7); border:1px solid rgba(90,130,220,0.22); backdrop-filter:blur(4px); }
      ` }} />
      <canvas ref={canvasRef} className="obshow-canvas" />
      <div className="obshow-head">
        <div className="obshow-ob">OB</div>
        <div className="obshow-sub">AN OFFERBELL PRODUCT</div>
      </div>
      <div className="obshow-by">Brought to you by OfferBell</div>
      <div className="obshow-dock">
        {dockIcon(<><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>)}
        {dockIcon(<><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="13" cy="18" r="2" /></>)}
        {dockIcon(<><path d="M12 4v8" /><path d="M7 7a8 8 0 1 0 10 0" /></>)}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ObElite — get-started / download for Elite members
// ═══════════════════════════════════════════════════════════════════════════
function ObElite() {
  const [os, setOs] = useState<'mac' | 'win'>('mac');
  const [copied, setCopied] = useState(false);

  // One paste: unzip to ~/ob, clear the download quarantine flag, launch.
  // The launcher builds its own environment and installs everything on first run.
  const INSTALL_CMD = 'cd ~/Downloads && unzip -o OB.zip -d ~ && xattr -dr com.apple.quarantine ~/ob 2>/dev/null; cd ~/ob && chmod +x launch_ob.command && ./launch_ob.command';

  const copyCmd = () => {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const pill = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
    fontFamily: "'Sora', sans-serif", border: '1px solid ' + (active ? 'transparent' : 'var(--border-2)'),
    background: active ? 'var(--text)' : 'transparent', color: active ? 'var(--surface)' : 'var(--text-2)',
  });

  const stepRow = (n: number, title: string, body: React.ReactNode) => (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12.5, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
      }}>{n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{body}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 0 90px', fontFamily: "'Sora', sans-serif" }}>
      <div className="ob-hero" style={{ marginBottom: 40 }}>
        <div className="ob-hero-copy">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', marginBottom: 18,
            background: 'rgba(37, 99, 235, 0.12)', color: '#3b82f6',
            border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 999,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
            Elite plan
          </div>

          <h1 style={{
            fontFamily: "'Instrument Serif', serif", fontSize: 50, lineHeight: 1.02, letterSpacing: '-1px',
            color: 'var(--text)', margin: '0 0 16px', fontWeight: 400,
          }}>
            Your <em style={{ fontStyle: 'italic' }}>OB</em> is ready.
          </h1>

          <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
            OB is a desktop voice assistant built on everything in OfferBell, like the AI from <em style={{ fontStyle: 'italic' }}>Iron Man</em>, but for finance recruiting. Run a mock interview, tear down a company, prep a coffee chat, or get a market brief, just by talking. Set it up below.
          </p>
        </div>

        <div className="ob-hero-art"><OBShowcase /></div>
      </div>

      {/* Install instructions */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 16, padding: '24px 24px 26px', marginBottom: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Get OB on your Mac</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setOs('mac')} style={pill(os === 'mac')}>macOS</button>
            <button type="button" onClick={() => setOs('win')} style={pill(os === 'win')}>Windows</button>
          </div>
        </div>

        {os === 'mac' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {stepRow(1, 'Download OB', (
              <div>
                <a href={OB_DOWNLOAD_URL} download style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6,
                  background: 'var(--text)', color: 'var(--surface)', textDecoration: 'none',
                  padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                }}>
                  Download OB.zip
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                </a>
                <div style={{ marginTop: 7, fontSize: 12.5, color: 'var(--text-3)' }}>It'll land in your Downloads folder.</div>
              </div>
            ))}

            {stepRow(2, 'Open Terminal and paste this', (
              <div>
                <div style={{ marginBottom: 8 }}>
                  Press <strong>Cmd + Space</strong>, type <strong>Terminal</strong>, hit Enter. Then paste the line below and press Enter:
                </div>
                <div style={{ position: 'relative', background: '#0b1220', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                  <code style={{
                    display: 'block', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11.5,
                    color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingRight: 70,
                  }}>{INSTALL_CMD}</code>
                  <button type="button" onClick={copyCmd} style={{
                    position: 'absolute', top: 10, right: 10, cursor: 'pointer',
                    background: copied ? '#16a34a' : 'rgba(255,255,255,0.08)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.16)', borderRadius: 7, padding: '5px 11px',
                    fontSize: 11.5, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                  }}>{copied ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            ))}

            {stepRow(3, 'Let it set up, then it opens', (
              <span>The first run takes a couple of minutes while it installs itself, you only wait once. When the setup screen appears, paste your free <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Gemini API key</a> (it's the only key OB needs).</span>
            ))}

            {stepRow(4, 'Sign in with your OfferBell account', (
              <span>Use this same email and password. OB unlocks automatically because you're Elite.</span>
            ))}

            <div style={{
              marginTop: 4, padding: '12px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 10, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55,
            }}>
              Don't have Python? OB will tell you and link the installer, install it once, then paste the command again.
              {' '}Stuck anywhere? Email <a href={'mailto:' + OB_SUPPORT_EMAIL} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>{OB_SUPPORT_EMAIL}</a> and we'll get you running.
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>OB for Windows is on the way</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>
                OB runs on macOS today. The Windows build is in progress, in the meantime, reach us at{' '}
                <a href={'mailto:' + OB_SUPPORT_EMAIL} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>{OB_SUPPORT_EMAIL}</a>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="ob-feat-grid">
        {FEATURES.map((f) => (
          <div key={f.title} style={{
            border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 14, padding: '18px 18px',
          }}>
            <div style={{ width: 30, height: 30, color: '#3b82f6', marginBottom: 10 }}>{OB_ORB}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{f.body}</div>
          </div>
        ))}
      </div>

      <style>{`
        .ob-hero{ display:flex; gap:34px; align-items:center; }
        .ob-hero-copy{ flex:1; min-width:0; }
        .ob-hero-art{ width:312px; flex-shrink:0; }
        @media (max-width: 820px){
          .ob-hero{ flex-direction:column-reverse; gap:26px; }
          .ob-hero-art{ width:100%; max-width:420px; }
          .ob-feat-grid{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ObPaywall — Elite upsell for free / pro
// ═══════════════════════════════════════════════════════════════════════════
function ObPaywall({ currentPlan }: { currentPlan: string | null }) {
  const isPro = currentPlan === 'pro';

  const SAYINGS = [
    'OB, run me an IB technical.',
    'Tear down Nvidia for me.',
    'Prep my coffee chat with Alex.',
    'What moved the market today?',
    'Quiz me on LBO math.',
    'Grill me like a Superday.',
  ];
  const [sayIdx, setSayIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSayIdx((i) => (i + 1) % SAYINGS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const goElite = () => { window.location.href = '/checkout?plan=elite'; };
  const goCompare = () => { window.location.href = '/checkout'; };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '34px 0 100px', fontFamily: "'Sora', sans-serif" }}>
      {/* ── Cinematic dark hero ───────────────────────────────────────── */}
      <div className="obpw-stage">
        <div className="obpw-stage-copy">
          <h1 className="obpw-h1">
            The recruiting coach you <em>talk to</em>.
          </h1>

          <p className="obpw-lead">
            The AI assistant from <em>Iron Man</em>, rebuilt for breaking into finance.
          </p>

          <div className="obpw-say">
            <svg className="obpw-mic" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
            <span key={sayIdx} className="obpw-say-text">{SAYINGS[sayIdx]}</span>
          </div>

          <p className="obpw-body">
            {isPro
              ? "You're on Pro. OB lives one tier up: a desktop voice assistant you actually talk to. No typing, no tabs, just say what you need and it runs."
              : 'OB is a desktop voice assistant built on all of OfferBell. Say what you need out loud and it runs, mock interviews, company teardowns, coffee-chat prep, market briefs. Nothing else in recruiting works like this.'}
          </p>

          <div className="obpw-cta">
            <button type="button" onClick={goElite} className="obpw-btn-primary">
              Upgrade to Elite
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <button type="button" onClick={goCompare} className="obpw-btn-ghost">Compare plans</button>
          </div>
        </div>

        <div className="obpw-stage-art"><OBShowcase /></div>
      </div>

      {/* ── what OB does (compact, complete) ─────────────────────────── */}
      <div className="obpw-caps-wrap">
        <div className="obpw-kicker">Everything OB does, by voice</div>
        <div className="obpw-caps">
          {[
            ['Live mock interviews', 'Pick a desk and a firm, then get grilled out loud with real follow-ups and a grade. All ten tracks.'],
            ['Company teardowns', 'Name a company. OB pulls the filings and walks you through the business, the numbers, and the story.'],
            ['Coffee-chat prep', 'Hand it a LinkedIn URL and walk in knowing who they are and exactly what to ask.'],
            ['Outreach writer', 'It drafts the cold email or DM in your own voice, ready to send.'],
            ['Morning market brief', 'A spoken read on the market and your watchlist before the open.'],
            ['Remembers your search', 'Tell it your targets once and it carries the context into every session.'],
          ].map(([t, d]) => (
            <div key={t} className="obpw-cap">
              <span className="obpw-cap-orb">{OB_ORB}</span>
              <div className="obpw-cap-txt"><b>{t}</b><span>{d}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* ── light closing CTA ─────────────────────────────────────────── */}
      <div className="obpw-close">
        <span className="obpw-close-text">Included with Elite. The only voice coach in finance recruiting.</span>
        <button type="button" onClick={goElite} className="obpw-btn-primary">
          Upgrade to Elite
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .obpw-stage{
          position:relative; display:flex; gap:30px; align-items:center;
          background:radial-gradient(120% 130% at 12% 10%, #0c1426 0%, #070b16 48%, #04060c 100%);
          border:1px solid rgba(59,130,246,0.22); border-radius:26px; padding:38px 36px;
          box-shadow:0 40px 90px -50px rgba(37,99,235,0.6);
          overflow:hidden;
        }
        .obpw-stage::before{
          content:""; position:absolute; inset:0; pointer-events:none;
          background-image:linear-gradient(rgba(90,130,220,0.045) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(90,130,220,0.045) 1px, transparent 1px);
          background-size:30px 30px;
        }
        .obpw-stage-copy{ position:relative; flex:1; min-width:0; z-index:1; }
        .obpw-stage-art{ position:relative; width:330px; flex-shrink:0; z-index:1; }
        .obpw-h1{
          font-family:'Instrument Serif',serif; font-weight:400; color:#f1f5ff;
          font-size:52px; line-height:1.0; letter-spacing:-1px; margin:0 0 14px;
        }
        .obpw-h1 em{ font-style:italic; color:#8fc0ff; }
        .obpw-lead{ font-size:16px; font-weight:600; color:#cdd9f2; line-height:1.45; margin:0 0 20px; }
        .obpw-lead em{ font-style:italic; color:#8fc0ff; }
        .obpw-say{
          display:inline-flex; align-items:center; gap:9px; min-height:22px;
          padding:9px 15px; border-radius:11px; margin-bottom:22px;
          background:rgba(255,255,255,0.045); border:1px solid rgba(120,150,220,0.2); color:#9fb6e0;
        }
        .obpw-mic{ color:#5b9bff; flex-shrink:0; }
        .obpw-say-text{ font-size:13.5px; color:#e3ecff; font-style:italic; animation:obpwFade .5s ease; }
        .obpw-body{ font-size:13.5px; color:#93a4c6; line-height:1.6; margin:0 0 26px; max-width:440px; }
        .obpw-cta{ display:flex; align-items:center; gap:11px; flex-wrap:wrap; }
        .obpw-btn-primary{
          display:inline-flex; align-items:center; gap:8px; cursor:pointer;
          background:#2563eb; color:#fff; border:none; padding:12px 22px; border-radius:11px;
          font-size:13.5px; font-weight:700; font-family:'Sora',sans-serif;
          box-shadow:0 10px 28px -10px rgba(37,99,235,0.9);
        }
        .obpw-btn-ghost{
          cursor:pointer; background:transparent; color:#b7c4de;
          border:1.5px solid rgba(120,150,220,0.3); padding:12px 20px; border-radius:11px;
          font-size:13px; font-weight:600; font-family:'Sora',sans-serif;
        }
        .obpw-caps-wrap{ margin-top:52px; }
        .obpw-kicker{
          font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--text-3); margin-bottom:22px; text-align:center;
        }
        .obpw-caps{ display:grid; grid-template-columns:repeat(2,1fr); gap:22px 32px; }
        .obpw-cap{ display:flex; gap:13px; align-items:flex-start; }
        .obpw-cap-orb{ width:22px; height:22px; color:#2563eb; flex-shrink:0; margin-top:1px; }
        .obpw-cap-txt{ display:flex; flex-direction:column; gap:3px; min-width:0; }
        .obpw-cap-txt b{ font-size:14px; font-weight:700; color:var(--text); }
        .obpw-cap-txt span{ font-size:12.5px; color:var(--text-2); line-height:1.5; }
        .obpw-close{
          display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
          margin-top:48px; padding:20px 24px; border-radius:16px;
          background:var(--surface); border:1px solid var(--border);
        }
        .obpw-close-text{ font-size:14px; color:var(--text); font-weight:600; max-width:460px; line-height:1.5; }
        @keyframes obpwFade{ from{ opacity:0; transform:translateY(4px); } to{ opacity:1; transform:none; } }
        @media (max-width: 820px){
          .obpw-stage{ flex-direction:column-reverse; gap:26px; padding:30px 22px; }
          .obpw-stage-art{ width:100%; max-width:400px; }
          .obpw-h1{ font-size:42px; }
          .obpw-caps{ grid-template-columns:1fr; }
          .obpw-close{ flex-direction:column; align-items:flex-start; }
        }
      ` }} />
    </div>
  );
}
