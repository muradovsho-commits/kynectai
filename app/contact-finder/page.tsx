"use client";

import Sidebar from "../components/Sidebar";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./contact-finder.css";

export default function ContactFinderPage() {
  const router = useRouter();
  const addToWaitlist = useMutation(api.waitlist.addEmail);
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
    } catch {}
  }, []);
  const _displayName = (_userName.first + ' ' + _userName.last).trim() || 'User';
  const _displayInitials = ((_userName.first[0] || '') + (_userName.last[0] || '')).toUpperCase() || 'U';

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("offerbell_user_id");
    if (!stored) { router.replace("/signin"); return; }
  }, [router]);

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("offerbell-theme");
    if (saved) {
      document.documentElement.setAttribute("data-theme", saved);
      setIsDark(saved === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    setIsDark(next === "dark");
    if (typeof window !== "undefined") localStorage.setItem("offerbell-theme", next);
  };

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("offerbell_waitlist_joined") === "true";
    return false;
  });

  return (
    <div className="app">
      <Sidebar activePage="contact-finder" />

      <main className="main" style={{ background: 'var(--bg)', display: 'flex', justifyContent: 'center', padding: '60px 24px', alignItems: 'flex-start' }}>
        <div className="cf-layout">
          
          {/* TOP HERO CARD */}
          <div className="cf-card cf-hero-card">
            <div className="cf-icon-box cf-icon-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <h1 className="cf-title">Contact Finder</h1>
            <div className="cf-subtitle">COMING SOON</div>
            <p className="cf-desc">
              Search 200,000+ verified finance professionals across investment banking, private equity, consulting, and more. Get names, emails, and LinkedIn profiles instantly.
            </p>
          </div>

          {/* NOTIFY CARD */}
          <div className="cf-card cf-notify-card">
            <div className="cf-icon-box cf-icon-gray">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                <polyline points="3 7 12 13 21 7"/>
              </svg>
            </div>
            <div className="cf-notify-right">
              <div className="cf-notify-heading">Get notified when Contact Finder launches:</div>
              <div className="cf-notify-form">
                {!submitted ? (
                  <>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="cf-input"
                    />
                    <button
                      className="cf-notify-btn"
                      onClick={async () => {
                        if (!email.includes("@")) return;
                        try { await addToWaitlist({ email }); } catch {}
                        if (typeof window !== "undefined") localStorage.setItem("offerbell_waitlist_joined", "true");
                        setSubmitted(true);
                      }}
                    >
                      Notify Me <span style={{ marginLeft: '4px' }}>&gt;</span>
                    </button>
                  </>
                ) : (
                  <div className="cf-success-msg">
                    You're on the list — we'll notify you at launch.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="cf-stats-row">
            <div className="cf-card cf-stat-card">
              <div className="cf-icon-box cf-icon-gray-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <div className="cf-stat-num">200K+</div>
              <div className="cf-stat-label">Finance Professionals</div>
            </div>

            <div className="cf-card cf-stat-card">
              <div className="cf-icon-box cf-icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                  <path d="M9 22v-4h6v4"/>
                  <path d="M8 6h.01"/><path d="M16 6h.01"/>
                  <path d="M12 6h.01"/><path d="M12 10h.01"/>
                  <path d="M12 14h.01"/><path d="M16 10h.01"/>
                  <path d="M16 14h.01"/><path d="M8 10h.01"/>
                  <path d="M8 14h.01"/>
                </svg>
              </div>
              <div className="cf-stat-num">500+</div>
              <div className="cf-stat-label">Firms Covered</div>
            </div>

            <div className="cf-card cf-stat-card">
              <div className="cf-icon-box cf-icon-cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="cf-stat-num">95%</div>
              <div className="cf-stat-label">Email Accuracy</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
