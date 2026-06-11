'use client';
import { useState, useEffect } from 'react';

// Contextual install prompt for the OfferBell Chrome extension.
//
// Design goals (do not regress):
// 1. Never shown to users who already have the extension. We ping it via
//    chrome.runtime.sendMessage; if it answers, we render nothing.
// 2. Never nags. Dismissible. Once dismissed it stays gone until the user has
//    racked up more outreach actions (the "sick of copy-pasting" trigger),
//    then it quietly comes back once.
// 3. Zero new network calls, zero reactive queries, no offerbell_plan writes.
//    Reads/writes only its own localStorage keys. Bandwidth-safe.
// 4. Self-contained: renders nothing until it has CONFIRMED the extension is
//    absent, so it can never flash in front of an existing-extension user.
//
// Placement: inline at the outreach handoff point (tracker) and under generated
// output (writer). It is a slim card, not a banner or modal.

const EXTENSION_ID = 'ecmiggmdjpohgidmdonhbcbnlhdagmkp';
const STORE_URL =
  'https://chromewebstore.google.com/detail/' + EXTENSION_ID;

// localStorage keys (namespaced, will not collide with anything existing)
const DISMISS_KEY = 'offerbell_ext_prompt_dismissed_at_count';
// We reuse the existing action counter the app already maintains.
const ACTION_COUNT_KEY = 'offerbell_messages_sent';
// How many more actions after a dismissal before we resurface once.
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
      if (!settled) {
        settled = true;
        setDetect('absent');
      }
    }
    function markPresent() {
      if (!settled) {
        settled = true;
        setDetect('present');
      }
    }
    try {
      const c: any = typeof chrome !== 'undefined' ? chrome : undefined;
      if (c && c.runtime && c.runtime.sendMessage) {
        // Ask the extension to identify itself. If it is installed and exposes
        // an onMessageExternal handler, it responds and we treat it as present.
        // If it is not installed, Chrome invokes the callback with
        // runtime.lastError set, so we treat that as absent.
        c.runtime.sendMessage(
          EXTENSION_ID,
          { action: 'ping' },
          (response: any) => {
            // Touch lastError so Chrome does not log "Unchecked runtime.lastError".
            const err = c.runtime.lastError;
            if (err || !response) {
              markAbsent();
            } else {
              markPresent();
            }
          }
        );
        // Fallback: if the callback never fires (older Chrome quirk), assume
        // absent after a short delay so we do not get stuck on "checking".
        setTimeout(markAbsent, 1200);
      } else {
        // Not Chrome, or no extension API at all -> cannot have our extension.
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
      if (dismissedAtRaw === null) {
        setHidden(false);
        return;
      }
      const dismissedAt = parseInt(dismissedAtRaw, 10);
      const current = parseInt(
        localStorage.getItem(ACTION_COUNT_KEY) || '0',
        10
      );
      // Resurface only after the user has done enough more actions since the
      // dismissal. Otherwise stay hidden.
      if (
        !isNaN(dismissedAt) &&
        current - dismissedAt >= RESURFACE_AFTER
      ) {
        // Clear the marker so this counts as a fresh appearance.
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

  const headline =
    variant === 'writer'
      ? 'Send this without leaving OfferBell'
      : 'Stop copy-pasting your outreach';
  const sub =
    variant === 'writer'
      ? 'The Chrome extension drops your message straight into LinkedIn or email and tracks the send automatically.'
      : 'The Chrome extension sends from LinkedIn or email and auto-updates this tracker, so you never mark messages by hand.';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '14px 16px',
        margin: '14px 0',
        borderRadius: '12px',
        border: '1px solid var(--border, rgba(0,0,0,0.10))',
        background: 'var(--card-subtle, rgba(99,102,241,0.06))',
        fontSize: '14px',
      }}
    >
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: '34px',
          height: '34px',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(99,102,241,0.16)',
          fontSize: '18px',
        }}
      >
        {'\u26A1'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, marginBottom: '2px' }}>{headline}</div>
        <div style={{ opacity: 0.75, lineHeight: 1.4 }}>{sub}</div>
      </div>
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flexShrink: 0,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '13px',
          padding: '8px 14px',
          borderRadius: '9px',
          color: '#fff',
          background: 'var(--accent, #6366f1)',
          whiteSpace: 'nowrap',
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
          fontSize: '18px',
          lineHeight: 1,
          opacity: 0.5,
          padding: '4px',
        }}
      >
        {'\u00D7'}
      </button>
    </div>
  );
}
