"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./dashboard.css";

const TIPS = [
  { text: "The alumni angle works best when you reference something specific — the same club, program, or recruiting process. Vague connections get ignored.", source: "Kynect reply rate data" },
  { text: "Send your first email Monday–Wednesday between 8–10am. Response rates drop 40% on Fridays and weekends.", source: "Kynect timing analysis" },
  { text: "Keep your cold email under 100 words. Longer emails signal you don't value their time. Get to the ask fast.", source: "Kynect outreach data" },
  { text: "Follow up exactly once, 5–7 business days later. One follow-up increases reply rates by 22%. Two or more drops them.", source: "Kynect reply rate data" },
  { text: "Reference a specific deal or project they worked on. It takes 3 minutes of research and 3x's your reply rate.", source: "Deal reference angle data" },
];

const PHRASES = [
  "Hover over me!",
  "I'm watching you 👀",
  "Find some contacts!",
  "Time to network 📧",
  "Go get that offer!",
  "You got this 💪",
  "Don't forget to follow up!",
  "Check the job board →",
];

export default function DashboardPage() {
  const router = useRouter();
  const [tipIdx, setTipIdx] = useState(0);
  const botCardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speechRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<{ mx: number; my: number; isHovered: boolean; blinkTimer: number; blinking: boolean; blinkFrame: number; phraseIdx: number }>({
    mx: -999, my: -999, isHovered: false, blinkTimer: 0, blinking: false, blinkFrame: 0, phraseIdx: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("kynect_user_id");
    if (!stored) {
      router.replace("/signin");
      return;
    }
  }, [router]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("kynect-theme") : null;
    if (saved && typeof document !== "undefined") document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    if (typeof window !== "undefined") localStorage.setItem("kynect-theme", next);
  };

  useEffect(() => {
    const id = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = botCardRef.current;
    const speech = speechRef.current;
    if (!canvas || !card) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0;
    const state = animRef.current;

    function resize() {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
      W = canvas.width = rect.width * dpr;
      H = canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    }

    function getEyePupil(
      eyeCX: number,
      eyeCY: number,
      targetX: number,
      targetY: number,
      radius: number
    ) {
      const dx = targetX - eyeCX;
      const dy = targetY - eyeCY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = Math.min(dist, radius * 0.45);
      const angle = Math.atan2(dy, dx);
      return { x: eyeCX + Math.cos(angle) * r, y: eyeCY + Math.sin(angle) * r };
    }

    function drawBot(
      cx: number,
      cy: number,
      eyeLx: number,
      eyeLy: number,
      eyeRx: number,
      eyeRy: number,
      blink: boolean
    ) {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
      const s = dpr;
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      const bodyColor = dark ? "#f0efed" : "#0c0c0c";
      const bgColor = dark ? "#1a1a19" : "#ffffff";
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
      ctx.lineWidth = 1;
      const step = 24 * dpr;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 38 * s);
      ctx.lineTo(cx, cy - 52 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - 55 * s, 4 * s, 0, Math.PI * 2);
      ctx.fillStyle = bodyColor;
      ctx.fill();

      ctx.beginPath();
      (ctx as any).roundRect(cx - 28 * s, cy - 36 * s, 56 * s, 44 * s, 10 * s);
      ctx.fillStyle = bodyColor;
      ctx.fill();

      const eyeSize = 8 * s;
      const eyeY = cy - 18 * s;

      ctx.beginPath();
      if (blink) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(cx - 18 * s - eyeSize / 2, eyeY - 2, eyeSize, 4);
      } else {
        ctx.arc(cx - 18 * s, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeLx, eyeLy, 4 * s, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();
      }

      ctx.beginPath();
      if (blink) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(cx + 10 * s, eyeY - 2, eyeSize, 4);
      } else {
        ctx.arc(cx + 18 * s, eyeY, eyeSize, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeRx, eyeRy, 4 * s, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();
      }

      ctx.strokeStyle = bgColor;
      ctx.lineWidth = 2.5 * s;
      ctx.lineCap = "round";
      ctx.beginPath();
      if (state.isHovered) {
        ctx.arc(cx, cy - 8 * s, 8 * s, 0.2 * Math.PI, 0.8 * Math.PI);
      } else {
        ctx.moveTo(cx - 7 * s, cy - 7 * s);
        ctx.lineTo(cx + 7 * s, cy - 7 * s);
      }
      ctx.stroke();

      ctx.beginPath();
      (ctx as any).roundRect(cx - 22 * s, cy + 10 * s, 44 * s, 34 * s, 8 * s);
      ctx.fillStyle = bodyColor;
      ctx.fill();

      ctx.strokeStyle = bgColor;
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.moveTo(cx - 10 * s, cy + 22 * s);
      ctx.lineTo(cx + 10 * s, cy + 22 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 31 * s, 5 * s, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = 6 * s;
      ctx.lineCap = "round";
      const waveL = state.isHovered ? Math.sin(Date.now() * 0.005) * 12 * s : 0;
      ctx.beginPath();
      ctx.moveTo(cx - 22 * s, cy + 18 * s);
      ctx.lineTo(cx - 38 * s, cy + 28 * s + waveL);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 22 * s, cy + 18 * s);
      ctx.lineTo(cx + 38 * s, cy + 28 * s);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 10 * s, cy + 44 * s);
      ctx.lineTo(cx - 10 * s, cy + 56 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 10 * s, cy + 44 * s);
      ctx.lineTo(cx + 10 * s, cy + 56 * s);
      ctx.stroke();

      ctx.beginPath();
      (ctx as any).roundRect(cx - 17 * s, cy + 54 * s, 14 * s, 7 * s, 3 * s);
      ctx.fillStyle = bodyColor;
      ctx.fill();
      ctx.beginPath();
      (ctx as any).roundRect(cx + 3 * s, cy + 54 * s, 14 * s, 7 * s, 3 * s);
      ctx.fillStyle = bodyColor;
      ctx.fill();
    }

    let bobT = 0;
    function loop() {
      requestAnimationFrame(loop);
      bobT += 0.03;
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
      const bobOffset = Math.sin(bobT) * 4 * dpr;
      const cx = W / 2;
      const cy = H / 2 + bobOffset;

      state.blinkTimer++;
      if (!state.blinking && state.blinkTimer > 180 + Math.random() * 120) {
        state.blinking = true;
        state.blinkTimer = 0;
        state.blinkFrame = 0;
      }
      if (state.blinking) {
        state.blinkFrame++;
        if (state.blinkFrame > 8) state.blinking = false;
      }

      const eyeLCX = cx - 18 * dpr;
      const eyeRCX = cx + 18 * dpr;
      const eyeYC = cy - 18 * dpr;
      let eyeLX: number, eyeLY: number, eyeRX: number, eyeRY: number;
      if (state.isHovered) {
        const tgt = { x: state.mx * dpr, y: state.my * dpr };
        const lp = getEyePupil(eyeLCX, eyeYC, tgt.x, tgt.y, 8 * dpr);
        const rp = getEyePupil(eyeRCX, eyeYC, tgt.x, tgt.y, 8 * dpr);
        eyeLX = lp.x;
        eyeLY = lp.y;
        eyeRX = rp.x;
        eyeRY = rp.y;
      } else {
        eyeLX = eyeLCX;
        eyeLY = eyeYC;
        eyeRX = eyeRCX;
        eyeRY = eyeYC;
      }
      drawBot(cx, cy, eyeLX, eyeLY, eyeRX, eyeRY, state.blinking);
    }

    const onEnter = () => {
      state.isHovered = true;
      state.phraseIdx = Math.floor(Math.random() * (PHRASES.length - 1)) + 1;
      if (speech) speech.textContent = PHRASES[state.phraseIdx];
    };
    const onLeave = () => {
      state.isHovered = false;
      state.mx = -999;
      state.my = -999;
      if (speech) speech.textContent = PHRASES[0];
    };
    const onMove = (e: MouseEvent) => {
      if (!card) return;
          const rect = card.getBoundingClientRect();
          state.mx = e.clientX - rect.left;
          state.my = e.clientY - rect.top;
    };
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);
    const phraseInterval = setInterval(() => {
      if (state.isHovered && speech) {
        state.phraseIdx = (state.phraseIdx + 1) % PHRASES.length;
        if (state.phraseIdx === 0) state.phraseIdx = 1;
        speech.textContent = PHRASES[state.phraseIdx];
      }
    }, 3000);

    resize();
    loop();
    window.addEventListener("resize", resize);
    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      clearInterval(phraseInterval);
    };
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Kynect<em>.</em></Link>
        </div>
        <div className="sidebar-user">
          <div className="user-avi">AC</div>
          <div>
            <div className="user-name-text">Alex Chen</div>
            <div className="user-plan-text">Free plan</div>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode" type="button" />
        </div>
        <nav className="nav">
          <div className="nav-group">
            <span className="nav-group-label">Overview</span>
            <Link className="nav-item active" href="/dashboard">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Dashboard
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Tools</span>
            <Link className="nav-item" href="/contact-finder">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Contact Finder
              <span className="nav-pill pill-count">15 left</span>
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Outreach Writer
              <span className="nav-pill pill-count">10 left</span>
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Outreach Tracker
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              Job Board
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Intelligence</span>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              Hit Rate Intel
              <span className="nav-pill pill-pro">Pro</span>
            </Link>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Coach
              <span className="nav-pill pill-pro">Pro</span>
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Learn</span>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Recruiting Manual
            </Link>
          </div>
          <div className="nav-group">
            <span className="nav-group-label">Account</span>
            <Link className="nav-item" href="#">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Account
            </Link>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="upgrade-card">
            <div className="upgrade-card-title">Unlock Pro</div>
            <div className="upgrade-card-desc">Unlimited searches, hit rate data, AI coaching.</div>
            <a href="#" className="upgrade-card-btn">Go Pro — $12/mo</a>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <div className="greeting">Good morning, <em>Alex</em> 👋</div>
            <div className="greeting-sub">Recruiting season is in full swing. Let&apos;s get after it.</div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" type="button">View profile</button>
            <button className="btn btn-dark" type="button">+ New Search</button>
          </div>
        </div>

        <div className="hero-band">
          <div className="hero-stat">
            <div className="hero-stat-label">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Searches Used
            </div>
            <div className="hero-stat-value">0</div>
            <div className="hero-stat-sub">of 15 this month</div>
            <div className="hero-stat-bar">
              <div className="hero-stat-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-label">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Messages Sent
            </div>
            <div className="hero-stat-value">0</div>
            <div className="hero-stat-sub">of 10 this month</div>
            <div className="hero-stat-bar">
              <div className="hero-stat-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-label">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 11l3 3L22 4" />
              </svg>
              Pipeline Contacts
            </div>
            <div className="hero-stat-value">0</div>
            <div className="hero-stat-sub">across all stages</div>
          </div>
          <div className="hero-divider" />
          <div className="hero-cta">
            <div className="hero-cta-title">
              Start your first search to
              <br />
              build your pipeline.
            </div>
            <Link className="hero-cta-btn" href="/contact-finder">Find Contacts →</Link>
          </div>
        </div>

        <div className="grid">
          <div>
            <div className="section-label">Quick Actions</div>
            <div className="quick-actions">
              <Link className="action-card" href="/contact-finder">
                <div className="action-icon-wrap">
                  <svg viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div className="action-title">Find Contacts</div>
                <div className="action-desc">Search any firm or role. Verified emails + LinkedIn instantly.</div>
              </Link>
              <Link className="action-card" href="#">
                <div className="action-icon-wrap">
                  <svg viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div className="action-title">Write Outreach</div>
                <div className="action-desc">AI-personalized cold messages that actually get replies.</div>
              </Link>
              <Link className="action-card" href="#">
                <div className="action-icon-wrap">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <div className="action-title">Track Pipeline</div>
                <div className="action-desc">Kanban board from first message to offer.</div>
              </Link>
              <Link className="action-card" href="#">
                <div className="action-icon-wrap">
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                <div className="action-title">Browse Jobs</div>
                <div className="action-desc">Live finance listings. No ghost postings.</div>
              </Link>
            </div>

            <div className="section-label">Recent Activity</div>
            <div className="feed-card">
              <div className="feed-header">
                <div className="feed-header-title">Your Pipeline</div>
                <a href="#" className="feed-header-link">Open tracker →</a>
              </div>
              <div className="feed-empty">
                <div className="feed-empty-icon">📭</div>
                <div className="feed-empty-title">No contacts yet</div>
                <div className="feed-empty-sub">Find your first contact and start building your pipeline.</div>
                <button className="feed-start-btn" type="button">Find your first contact</button>
              </div>
            </div>

            <div className="bot-card" id="bot-card" ref={botCardRef}>
              <canvas id="bot-canvas" ref={canvasRef} />
              <div className="bot-speech" id="bot-speech" ref={speechRef}>
                Hover over me!
              </div>
            </div>
          </div>

          <div className="right-col">
            <div className="tip-card">
              <div className="tip-label">💡 Tip of the day</div>
              <div className="tip-text" id="tip-text">
                &quot;{TIPS[tipIdx].text}&quot;
              </div>
              <div className="tip-source" id="tip-source">
                Based on {TIPS[tipIdx].source}
              </div>
              <div className="tip-nav" id="tip-nav">
                {TIPS.map((_, i) => (
                  <div
                    key={i}
                    className={"tip-dot" + (i === tipIdx ? " active" : "")}
                    onClick={() => setTipIdx(i)}
                    onKeyDown={(e) => e.key === "Enter" && setTipIdx(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Tip ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="rate-card">
              <div className="rate-card-header">
                <div className="rate-card-title">Platform Reply Rates</div>
                <span className="pro-badge">Pro</span>
              </div>
              <div className="rate-card-body">
                <div className="rate-row">
                  <div className="rate-row-top">
                    <span className="rate-row-label">Alumni angle</span>
                    <span className="rate-row-pct">68%</span>
                  </div>
                  <div className="rate-bg">
                    <div className="rate-fill" style={{ width: "68%" }} />
                  </div>
                </div>
                <div className="rate-row">
                  <div className="rate-row-top">
                    <span className="rate-row-label">Shared interest</span>
                    <span className="rate-row-pct">54%</span>
                  </div>
                  <div className="rate-bg">
                    <div className="rate-fill" style={{ width: "54%" }} />
                  </div>
                </div>
                <div className="rate-row">
                  <div className="rate-row-top">
                    <span className="rate-row-label">Deal reference</span>
                    <span className="rate-row-pct">41%</span>
                  </div>
                  <div className="rate-bg">
                    <div className="rate-fill" style={{ width: "41%" }} />
                  </div>
                </div>
                <div className="rate-row">
                  <div className="rate-row-top">
                    <span className="rate-row-label">Mutual connection</span>
                    <span className="rate-row-pct">37%</span>
                  </div>
                  <div className="rate-bg">
                    <div className="rate-fill" style={{ width: "37%" }} />
                  </div>
                </div>
                <div className="rate-row">
                  <div className="rate-row-top">
                    <span className="rate-row-label">Generic intro</span>
                    <span className="rate-row-pct">8%</span>
                  </div>
                  <div className="rate-bg">
                    <div className="rate-fill" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
              <div className="rate-unlock">
                <a href="#">Unlock with Pro →</a>
              </div>
            </div>

            <div className="jobs-card">
              <div className="jobs-card-header">
                <div className="jobs-card-title">Live Listings</div>
                <div className="live-dot">Live</div>
              </div>
              <div className="job-item">
                <div className="job-item-title">Summer Analyst — Investment Banking</div>
                <div className="job-item-firm">Goldman Sachs · New York</div>
                <div className="job-item-footer">
                  <span className="job-tag tag-deadline">Due Jan 15</span>
                  <span className="job-tag tag-type">Internship</span>
                </div>
              </div>
              <div className="job-item">
                <div className="job-item-title">IB Summer Analyst Program</div>
                <div className="job-item-firm">J.P. Morgan · New York</div>
                <div className="job-item-footer">
                  <span className="job-tag tag-deadline">Due Jan 22</span>
                  <span className="job-tag tag-type">Internship</span>
                </div>
              </div>
              <div className="job-item">
                <div className="job-item-title">Investment Banking Intern</div>
                <div className="job-item-firm">Evercore · New York</div>
                <div className="job-item-footer">
                  <span className="job-tag tag-deadline">Due Feb 1</span>
                  <span className="job-tag tag-type">Internship</span>
                </div>
              </div>
              <div className="jobs-footer">
                <a href="#">View all listings →</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
