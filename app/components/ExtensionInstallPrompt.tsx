'use client';
import { useState, useEffect } from 'react';

// Contextual install prompt for the OfferBell Chrome extension.
//
// Design goals (do not regress):
// 1. Never shown to users who already have the extension. We ping it via
//    chrome.runtime.sendMessage; if it answers, we render nothing.
// 2. Never nags. Dismissible. Once dismissed it stays gone until the user has
//    racked up more outreach actions, then it quietly comes back once.
// 3. Zero new network calls, zero reactive queries, no offerbell_plan writes.
//    Reads/writes only its own localStorage keys. Bandwidth-safe.
// 4. Self-contained: renders nothing until it has CONFIRMED the extension is
//    absent, so it can never flash in front of an existing-extension user.
// 5. Visual: matches the site tokens (var(--surface)/--border/--text), uses the
//    same near-black primary button as "+ Add Contact", and stays compact
//    (single line of copy) so it does not dominate the page.

const EXTENSION_ID = 'ecmiggmdjpohgidmdonhbcbnlhdagmkp';
const STORE_URL =
  'https://chromewebstore.google.com/detail/' + EXTENSION_ID;

const DISMISS_KEY = 'offerbell_ext_prompt_dismissed_at_count';
const ACTION_COUNT_KEY = 'offerbell_messages_sent';
const RESURFACE_AFTER = 4;

type DetectState = 'checking' | 'absent' | 'present';

export default function ExtensionInstallPrompt({
  variant = 'tracker',
}: {
  variant?: 'tracker' | 'writer';
}) {
  const [detect, setDetect] = useState<DetectState>('checking');
  const [hidden, setHidden] = useState(false);

  // --- Install detection ---------------------------------------------------
  useEffect(() => {
    let settled = false;
    function markAbsent() {
      if (!settled) { settled = true; setDetect('absent'); }
    }
    function markPresent() {
      if (!settled) { settled = true; setDetect('present'); }
    }
    try {
      const c: any = typeof chrome !== 'undefined' ? chrome : undefined;
      if (c && c.runtime && c.runtime.sendMessage) {
        c.runtime.sendMessage(
          EXTENSION_ID,
          { action: 'ping' },
          (response: any) => {
            const err = c.runtime.lastError;
            if (err || !response) markAbsent();
            else markPresent();
          }
        );
        setTimeout(markAbsent, 1200);
      } else {
        markAbsent();
      }
    } catch {
      markAbsent();
    }
  }, []);

  // --- Dismissal / resurface logic ----------------------------------------
  useEffect(() => {
    if (detect !== 'absent') return;
    try {
      const dismissedAtRaw = localStorage.getItem(DISMISS_KEY);
      if (dismissedAtRaw === null) { setHidden(false); return; }
      const dismissedAt = parseInt(dismissedAtRaw, 10);
      const current = parseInt(localStorage.getItem(ACTION_COUNT_KEY) || '0', 10);
      if (!isNaN(dismissedAt) && current - dismissedAt >= RESURFACE_AFTER) {
        localStorage.removeItem(DISMISS_KEY);
        setHidden(false);
      } else {
        setHidden(true);
      }
    } catch {
      setHidden(false);
    }
  }, [detect]);

  function dismiss() {
    setHidden(true);
    try {
      const current = localStorage.getItem(ACTION_COUNT_KEY) || '0';
      localStorage.setItem(DISMISS_KEY, current);
    } catch {}
  }

  if (detect !== 'absent' || hidden) return null;

  const copy =
    variant === 'writer'
      ? 'Send straight from LinkedIn or email and auto-track it. Get the Chrome extension.'
      : 'Send from LinkedIn or email and auto-update this tracker. Get the Chrome extension.';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        margin: variant === 'writer' ? '14px 0 0' : '0 0 16px',
        borderRadius: 10,
        border: '1.5px solid var(--border)',
        background: 'var(--surface)',
        fontSize: 13,
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--text-3)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
        aria-hidden
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
      <span style={{ flex: 1, minWidth: 0, color: 'var(--text-2, var(--text-3))' }}>
        {copy}
      </span>
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flexShrink: 0,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 12,
          padding: '7px 14px',
          borderRadius: 8,
          color: 'var(--surface)',
          background: 'var(--text)',
          whiteSpace: 'nowrap',
          fontFamily: "'Sora', sans-serif",
        }}
      >
        Add to Chrome
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
          color: 'var(--text-3)',
          padding: 4,
        }}
      >
        {'\u00D7'}
      </button>
    </div>
  );
}
