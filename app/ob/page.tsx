'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '../components/Topbar';
import '../contact-finder/contact-finder.css'; // global color vars + frame theming
import '../reps/desk.css';                      // .desk-app / .desk-canvas / .desk-page frame

// ─────────────────────────────────────────────────────────────────────────────
// OB - the Elite voice coach (macOS desktop app).
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
        <Topbar activePage="ob" />
        <main className="desk-canvas"><div className="desk-page" /></main>
      </div>
    );
  }

  return (
    <div className="desk-app">
      <Topbar activePage="ob" />
      <main className="desk-canvas">
        <div className="desk-page">
          <div className="desk-page-inner ob-inner-wide">
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
const OB_ORB = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="2.5" />
    <path d="M7.5 12a4.5 4.5 0 0 1 9 0" />
    <path d="M4 12a8 8 0 0 1 16 0" />
  </svg>
);

// The OB node-sphere, animated - a recreation of the real OB HUD (a rotating
// wireframe constellation sphere). Reusable: `glow` floats it on a soft halo
// (no box), or drop it inside OBShowcase's device panel.
function OBSphere({ height = 380, glow = false, darkBg = false, rFactor = 0.30, cyFactor = 0.43, children }:
  { height?: number; glow?: boolean; darkBg?: boolean; rFactor?: number; cyFactor?: number; children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = typeof window !== 'undefined'
      && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const N = 74;
    const pts: number[][] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * Math.PI * (3 - Math.sqrt(5));
      pts.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
    }
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
      const cx = w / 2, cy = h * cyFactor, R = Math.min(w, h) * rFactor;
      const cosY = Math.cos(t), sinY = Math.sin(t);

      // Backdrop-aware palette: light nodes on a dark backdrop, blue wireframe
      // on a light page. darkBg forces the dark-backdrop look (the elite panel).
      const darkMode = darkBg || (typeof document !== 'undefined'
        && document.documentElement.getAttribute('data-theme') === 'dark');
      const lineRGB = darkMode ? '125,155,215' : '37,99,235';
      const lineMul = darkMode ? 0.42 : 0.6;
      const nodeRGB = darkMode ? '214,226,255' : '37,99,235';
      const nodeShadow = darkMode ? 'rgba(120,160,255,0.85)' : 'rgba(37,99,235,0.4)';

      const proj = pts.map((p) => {
        const x = p[0] * cosY - p[2] * sinY;
        const z = p[0] * sinY + p[2] * cosY;
        const y = p[1];
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;
        const depth = (z2 + 1.4) / 2.8;
        return { x: cx + x * R, y: cy + y2 * R, depth };
      });

      ctx.lineWidth = 0.6;
      for (const [i, j] of edges) {
        const a = proj[i], b = proj[j];
        const al = Math.max(0, ((a.depth + b.depth) / 2)) * lineMul;
        ctx.strokeStyle = 'rgba(' + lineRGB + ',' + al.toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        const tw = 0.62 + 0.38 * Math.sin(t * 2.1 + i * 1.27);
        const sz = 0.8 + p.depth * 1.9;
        const al = Math.min(1, (0.22 + p.depth * 0.7) * tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + nodeRGB + ',' + al.toFixed(3) + ')';
        ctx.shadowColor = nodeShadow;
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
  }, [rFactor, cyFactor, darkBg]);

  return (
    <div className="obsphere" style={{ height }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .obsphere{ position:relative; width:100%; }
        .obsphere-canvas{ position:absolute; inset:0; width:100%; height:100%; display:block; }
        .obsphere-glow{ position:absolute; inset:0; pointer-events:none;
          background:radial-gradient(circle at 50% 46%, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.035) 42%, transparent 66%);
        }
        [data-theme="dark"] .obsphere-glow{
          background:
            radial-gradient(circle at 50% 46%, #070b18 0%, #070b18 25%, rgba(7,11,24,0.5) 45%, transparent 66%),
            radial-gradient(circle at 50% 46%, rgba(45,108,235,0.42) 0%, rgba(45,108,235,0.12) 38%, transparent 62%);
        }
      ` }} />
      {glow && <div className="obsphere-glow" />}
      <canvas ref={canvasRef} className="obsphere-canvas" />
      {children}
    </div>
  );
}

// The boxed "device panel" version (used in the Elite get-started hero).
function OBShowcase() {
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
        .obshow-head{ position:absolute; top:16px; left:18px; z-index:2; }
        .obshow-ob{ font-family:'Instrument Serif',serif; font-size:22px; color:#e8eeff; line-height:1; }
        .obshow-sub{ font-family:'Sora',sans-serif; font-size:8.5px; letter-spacing:0.18em; color:rgba(150,170,215,0.6); margin-top:4px; }
        .obshow-by{ position:absolute; left:0; right:0; bottom:62px; text-align:center; z-index:2;
          font-family:'Sora',sans-serif; font-size:11px; color:rgba(150,170,215,0.45); }
        .obshow-dock{ position:absolute; left:50%; transform:translateX(-50%); bottom:20px; z-index:2;
          display:flex; align-items:center; gap:16px; padding:9px 16px; border-radius:13px;
          background:rgba(10,16,32,0.7); border:1px solid rgba(90,130,220,0.22); backdrop-filter:blur(4px); }
      ` }} />
      <div className="obshow-head">
        <div className="obshow-ob">OB</div>
        <div className="obshow-sub">AN OFFERBELL PRODUCT</div>
      </div>
      <OBSphere height={380} glow={false} darkBg />
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
// ObElite - get-started / download for Elite members
// ═══════════════════════════════════════════════════════════════════════════
function ObElite() {
  const [os, setOs] = useState<'mac' | 'win'>('mac');
  const [copied, setCopied] = useState(false);
  const [copiedWin, setCopiedWin] = useState(false);
  const [copiedOpen, setCopiedOpen] = useState(false);

  // One paste: unzip to ~/ob, clear the download quarantine flag, launch.
  // The launcher builds its own environment and installs everything on first run.
  const INSTALL_CMD = 'cd ~/Downloads && unzip -o OB.zip -d ~ && xattr -dr com.apple.quarantine ~/ob 2>/dev/null; cd ~/ob && chmod +x launch_ob.command && ./launch_ob.command';

  // Windows: extract OB.zip into the home folder and run the launcher.
  const INSTALL_CMD_WIN = 'cd ~\\Downloads; Expand-Archive -Path OB.zip -DestinationPath ~ -Force; cd ~\\ob; .\\launch_ob.bat';

  const copyCmd = () => {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const copyCmdWin = () => {
    navigator.clipboard.writeText(INSTALL_CMD_WIN).then(() => {
      setCopiedWin(true);
      setTimeout(() => setCopiedWin(false), 1800);
    }).catch(() => {});
  };

  const copyOpenCmd = () => {
    const cmd = os === 'mac' ? 'cd ~/ob && ./launch_ob.command' : 'cd ~\\ob; .\\launch_ob.bat';
    navigator.clipboard.writeText(cmd).then(() => {
      setCopiedOpen(true);
      setTimeout(() => setCopiedOpen(false), 1800);
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
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Get OB on your {os === 'mac' ? 'Mac' : 'PC'}</div>
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

            {stepRow(2, 'Open PowerShell and paste this', (
              <div>
                <div style={{ marginBottom: 8 }}>
                  Press <strong>Windows + R</strong>, type <strong>powershell</strong>, hit Enter. Then paste the line below and press Enter:
                </div>
                <div style={{ position: 'relative', background: '#0b1220', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                  <code style={{
                    display: 'block', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11.5,
                    color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingRight: 70,
                  }}>{INSTALL_CMD_WIN}</code>
                  <button type="button" onClick={copyCmdWin} style={{
                    position: 'absolute', top: 10, right: 10, cursor: 'pointer',
                    background: copiedWin ? '#16a34a' : 'rgba(255,255,255,0.08)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.16)', borderRadius: 7, padding: '5px 11px',
                    fontSize: 11.5, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                  }}>{copiedWin ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            ))}

            {stepRow(3, 'Let it set up, then it opens', (
              <span>The first run takes a couple of minutes while it installs itself, you only wait once. If Windows shows a <strong>"Windows protected your PC"</strong> box, click <strong>More info</strong> then <strong>Run anyway</strong>. When the setup screen appears, paste your free <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Gemini API key</a> (it's the only key OB needs).</span>
            ))}

            {stepRow(4, 'Sign in with your OfferBell account', (
              <span>Use this same email and password. OB unlocks automatically because you're Elite.</span>
            ))}

            <div style={{
              marginTop: 4, padding: '12px 14px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: 10, fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55,
            }}>
              Don't have Python? OB will tell you and link the installer, install it once (check <strong>"Add python.exe to PATH"</strong> during setup), then run the command again.
              {' '}Stuck anywhere? Email <a href={'mailto:' + OB_SUPPORT_EMAIL} style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>{OB_SUPPORT_EMAIL}</a> and we'll get you running.
            </div>
          </div>
        )}
      </div>

      {/* How to use OB */}
      <div style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 16, padding: '24px 24px 26px', marginBottom: 44 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Using OB</div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Opening OB</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>
            The simplest way to launch OB every time: open {os === 'mac' ? 'Terminal' : 'PowerShell'} and run this line.
          </div>
          <div style={{ position: 'relative', background: '#0b1220', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
            <code style={{ display: 'block', fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 11.5, color: '#cbd5e1', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all', paddingRight: 70 }}>{os === 'mac' ? 'cd ~/ob && ./launch_ob.command' : 'cd ~\\ob; .\\launch_ob.bat'}</code>
            <button type="button" onClick={copyOpenCmd} style={{
              position: 'absolute', top: 9, right: 9, cursor: 'pointer',
              background: copiedOpen ? '#16a34a' : 'rgba(255,255,255,0.08)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.16)', borderRadius: 7, padding: '5px 11px',
              fontSize: 11.5, fontWeight: 700, fontFamily: "'Sora', sans-serif",
            }}>{copiedOpen ? 'Copied' : 'Copy'}</button>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.55 }}>
            Want a one-click icon instead? {os === 'mac' ? (
              <>Right-click <strong>launch_ob.command</strong> in the ob folder, choose <strong>Make Alias</strong>, and drag the alias onto your Dock or Desktop.</>
            ) : (
              <>Right-click <strong>launch_ob.bat</strong> in the ob folder, choose <strong>Send to</strong>, then <strong>Desktop (create shortcut)</strong>, and pin that shortcut to your taskbar.</>
            )} After the first setup, OB opens in a few seconds with your key already saved.
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Three ways to drive it</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 12 }}>
            <div style={{ marginBottom: 7 }}><strong style={{ color: 'var(--text)' }}>Talk to it.</strong> No typing, no menus. Say what you want and OB runs it, then talks you through it. In a mock, answer out loud the way you would in a real interview.</div>
            <div style={{ marginBottom: 7 }}><strong style={{ color: 'var(--text)' }}>Or just type.</strong> Somewhere you can&rsquo;t talk, or prefer to read? Type to OB in the chat box instead. Same commands, same features, no voice needed.</div>
            <div style={{ marginBottom: 7 }}><strong style={{ color: 'var(--text)' }}>Open tabs by hand.</strong> Hover over the orb to bring up all the tabs, so you can open any feature yourself without saying a word.</div>
            <div><strong style={{ color: 'var(--text)' }}>Mute anytime.</strong> Tap the mic in OB when you need quiet.</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              'Run me an IB technical.',
              'Tear down Nvidia.',
              'Prep my coffee chat, here\u2019s the LinkedIn.',
              'Draft outreach to a VP at Evercore.',
              'What moved the market today?',
              'Grill me like a Superday.',
            ].map((s) => (
              <span key={s} style={{
                display: 'inline-block', padding: '7px 13px', borderRadius: 999,
                border: '1px solid var(--border-2)', background: 'var(--surface-2)',
                fontSize: 12.5, color: 'var(--text-2)', fontStyle: 'italic',
              }}>&ldquo;{s}&rdquo;</span>
            ))}
          </div>
        </div>
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
// ObPaywall - Elite upsell for free / pro
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
    <div style={{ margin: '0 auto', padding: '28px 0 90px', fontFamily: "'Sora', sans-serif" }}>
      <div className="obpw-hero">
      <div className="obpw-hero-copy">
      <h1 className="obpw-h1">The recruiting coach you <em>talk to</em>.</h1>
      <p className="obpw-lead">The AI assistant from <em>Iron Man</em>, rebuilt for breaking into finance.</p>
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

      <div className="obpw-platform">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="13" rx="1.5" /><path d="M8 21h8M12 17v4" /></svg>
        macOS &amp; Windows desktop app
      </div>
      </div>
      <div className="obpw-hero-art">
        <div className="obpw-float">
          <OBSphere height={400} glow rFactor={0.34} cyFactor={0.46}>
            <div className="obpw-voice">
              <svg className="obpw-mic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
              <span key={sayIdx} className="obpw-voice-text">{SAYINGS[sayIdx]}</span>
            </div>
          </OBSphere>
        </div>
      </div>
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
        .desk-page-inner.ob-inner-wide{ max-width:1180px; }
        .obpw-hero{ display:grid; grid-template-columns:1.02fr 0.98fr; gap:48px; align-items:center; margin-bottom:56px; }
        .obpw-hero-copy{ min-width:0; }
        .obpw-hero-art{ display:flex; align-items:center; justify-content:center; }
        .obpw-float{ position:relative; max-width:440px; width:100%; margin:0; }
        .obpw-voice{
          position:absolute; left:50%; bottom:54px; transform:translateX(-50%);
          display:inline-flex; align-items:center; gap:9px; white-space:nowrap;
          padding:9px 16px; border-radius:999px; z-index:2;
          background:rgba(10,16,32,0.72); border:1px solid rgba(120,150,220,0.3);
          backdrop-filter:blur(5px); box-shadow:0 8px 26px -12px rgba(0,0,0,0.7);
        }
        .obpw-mic{ color:#5b9bff; flex-shrink:0; }
        .obpw-voice-text{ font-size:13px; color:#e7eeff; font-style:italic; animation:obpwFade .5s ease; }
        .obpw-h1{
          font-family:'Instrument Serif',serif; font-weight:400; color:var(--text);
          font-size:clamp(38px,3.9vw,54px); line-height:1.03; letter-spacing:-1px; margin:0 0 14px; max-width:none;
        }
        .obpw-h1 em{ font-style:italic; color:#2563eb; }
        .obpw-lead{ font-size:16.5px; font-weight:600; color:var(--text); line-height:1.45; margin:0 0 14px; max-width:none; }
        .obpw-lead em{ font-style:italic; color:#2563eb; }
        .obpw-body{ font-size:14px; color:var(--text-2); line-height:1.6; margin:0 0 24px; max-width:520px; }
        .obpw-cta{ display:flex; align-items:center; justify-content:flex-start; gap:11px; flex-wrap:wrap; }
        .obpw-platform{
          display:inline-flex; align-items:center; gap:7px; margin-top:16px;
          font-size:12px; color:var(--text-3); font-weight:500;
        }
        .obpw-btn-primary{
          display:inline-flex; align-items:center; gap:8px; cursor:pointer;
          background:#2563eb; color:#fff; border:none; padding:12px 22px; border-radius:11px;
          font-size:13.5px; font-weight:700; font-family:'Sora',sans-serif;
          box-shadow:0 10px 28px -10px rgba(37,99,235,0.9);
        }
        .obpw-btn-ghost{
          cursor:pointer; background:transparent; color:var(--text-2);
          border:1.5px solid var(--border-2); padding:12px 20px; border-radius:11px;
          font-size:13px; font-weight:600; font-family:'Sora',sans-serif;
        }
        .obpw-caps-wrap{ margin-top:0; text-align:left; }
        .obpw-kicker{
          font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--text-3); margin-bottom:22px; text-align:center;
        }
        .obpw-caps{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        .obpw-cap{ display:flex; gap:13px; align-items:flex-start; padding:17px 18px; border:1px solid var(--border); background:var(--surface); border-radius:14px; }
        .obpw-cap-orb{ width:22px; height:22px; color:#2563eb; flex-shrink:0; margin-top:1px; }
        .obpw-cap-txt{ display:flex; flex-direction:column; gap:3px; min-width:0; }
        .obpw-cap-txt b{ font-size:14px; font-weight:700; color:var(--text); }
        .obpw-cap-txt span{ font-size:12.5px; color:var(--text-2); line-height:1.5; }
        .obpw-close{
          display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
          margin-top:40px; padding:22px 26px; border-radius:16px; text-align:left;
          background:var(--surface); border:1px solid var(--border);
        }
        .obpw-close-text{ font-size:14px; color:var(--text); font-weight:600; max-width:460px; line-height:1.5; }
        @keyframes obpwFade{ from{ opacity:0; transform:translateY(3px); } to{ opacity:1; transform:translateY(0); } }
        @media (max-width: 980px){
          .obpw-hero{ grid-template-columns:1fr; gap:22px; text-align:center; }
          .obpw-hero-art{ order:-1; }
          .obpw-float{ margin:0 auto; }
          .obpw-h1,.obpw-lead,.obpw-body{ margin-left:auto; margin-right:auto; max-width:600px; }
          .obpw-cta{ justify-content:center; }
          .obpw-caps{ grid-template-columns:repeat(2,1fr); }
        }
        @media (max-width: 620px){
          .obpw-h1{ font-size:36px; }
          .obpw-caps{ grid-template-columns:1fr; }
          .obpw-close{ flex-direction:column; align-items:flex-start; }
        }
      ` }} />
    </div>
  );
}
