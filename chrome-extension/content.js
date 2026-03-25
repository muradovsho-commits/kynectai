// OfferBell Chrome Extension — Gmail Content Script
// Injects "Add to OfferBell" button when viewing an email

const OFFERBELL_URL = 'https://offerbell.org';

// ── Helpers ──────────────────────────────────────────────

function extractEmailParts(rawFrom) {
  // Parse "John Smith <john@acme.com>" or just "john@acme.com"
  const match = rawFrom.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].replace(/"/g, '').trim(), email: match[2].trim().toLowerCase() };
  }
  return { name: rawFrom.split('@')[0], email: rawFrom.trim().toLowerCase() };
}

function inferFirmFromEmail(email) {
  const domain = email.split('@')[1] || '';
  // Skip common free email providers
  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com', 'mail.com', 'live.com', 'msn.com', 'ymail.com'];
  if (freeProviders.includes(domain)) return '';
  // Capitalize domain name without TLD
  const firm = domain.split('.')[0];
  return firm.charAt(0).toUpperCase() + firm.slice(1);
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

// ── UI Injection ─────────────────────────────────────────

function createButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'offerbell-add-btn';
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="16" y1="11" x2="22" y2="11"/>
    </svg>
    <span>Add to OfferBell</span>
  `;
  return btn;
}

function createPopup(senderInfo) {
  const { first, last } = splitName(senderInfo.name);
  const firm = inferFirmFromEmail(senderInfo.email);

  const overlay = document.createElement('div');
  overlay.className = 'offerbell-overlay';
  overlay.innerHTML = `
    <div class="offerbell-popup">
      <div class="offerbell-popup-header">
        <div class="offerbell-popup-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="16" y1="11" x2="22" y2="11"/>
          </svg>
          Add to OfferBell
        </div>
        <button class="offerbell-popup-close">&times;</button>
      </div>
      <div class="offerbell-popup-body">
        <div class="offerbell-field-row">
          <div class="offerbell-field">
            <label>First Name</label>
            <input type="text" id="ob-fname" value="${escapeHtml(first)}" placeholder="First name" />
          </div>
          <div class="offerbell-field">
            <label>Last Name</label>
            <input type="text" id="ob-lname" value="${escapeHtml(last)}" placeholder="Last name" />
          </div>
        </div>
        <div class="offerbell-field">
          <label>Email</label>
          <input type="email" id="ob-email" value="${escapeHtml(senderInfo.email)}" placeholder="Email" />
        </div>
        <div class="offerbell-field-row">
          <div class="offerbell-field">
            <label>Firm / Company</label>
            <input type="text" id="ob-firm" value="${escapeHtml(firm)}" placeholder="Company name" />
          </div>
          <div class="offerbell-field">
            <label>Role / Title</label>
            <input type="text" id="ob-role" value="" placeholder="e.g. VP, Analyst" />
          </div>
        </div>
        <div class="offerbell-field">
          <label>Status</label>
          <select id="ob-status">
            <option value="drafted">Drafted</option>
            <option value="sent" selected>Sent</option>
            <option value="spoken">Spoken With</option>
            <option value="stay">Staying in Touch</option>
          </select>
        </div>
        <div class="offerbell-field">
          <label>Notes</label>
          <textarea id="ob-notes" rows="2" placeholder="Optional notes about this contact..."></textarea>
        </div>
      </div>
      <div class="offerbell-popup-footer">
        <button class="offerbell-btn-cancel">Cancel</button>
        <button class="offerbell-btn-add">Add Contact</button>
      </div>
      <div class="offerbell-popup-success" style="display:none">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <div>Contact added to OfferBell!</div>
        <a href="${OFFERBELL_URL}/outreach-tracker" target="_blank">Open Tracker</a>
      </div>
    </div>
  `;

  // Wire up events
  overlay.querySelector('.offerbell-popup-close').addEventListener('click', () => overlay.remove());
  overlay.querySelector('.offerbell-btn-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('.offerbell-btn-add').addEventListener('click', () => {
    const data = {
      fname: document.getElementById('ob-fname').value.trim(),
      lname: document.getElementById('ob-lname').value.trim(),
      email: document.getElementById('ob-email').value.trim(),
      firm: document.getElementById('ob-firm').value.trim(),
      role: document.getElementById('ob-role').value.trim(),
      status: document.getElementById('ob-status').value,
      notes: document.getElementById('ob-notes').value.trim(),
    };

    if (!data.fname && !data.lname) {
      document.getElementById('ob-fname').style.borderColor = '#ef4444';
      return;
    }

    // Open OfferBell's add-contact page with data
    const params = new URLSearchParams(data);
    window.open(`${OFFERBELL_URL}/add-contact?${params.toString()}`, '_blank');

    // Show success state
    overlay.querySelector('.offerbell-popup-body').style.display = 'none';
    overlay.querySelector('.offerbell-popup-footer').style.display = 'none';
    overlay.querySelector('.offerbell-popup-success').style.display = 'flex';

    // Auto-close after 2s
    setTimeout(() => overlay.remove(), 2500);
  });

  return overlay;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.replace(/"/g, '&quot;');
}

// ── Gmail DOM Observer ───────────────────────────────────

function getSenderFromEmail() {
  // Gmail renders the sender in various ways, try multiple selectors
  // Main sender name/email in expanded email view
  const selectors = [
    'span[email]',                    // Most reliable — Gmail puts email attr on sender span
    '.go',                            // Sender name element
    'h3.iw span[email]',            // Another variation
    '[data-hovercard-id]',           // Hovercard contact
  ];

  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const email = el.getAttribute('email') || '';
      const name = el.getAttribute('name') || el.textContent || '';
      if (email) return { name: name || email, email };
    }
  }

  // Fallback: try to grab from the "From:" line
  const fromHeaders = document.querySelectorAll('.gD');
  if (fromHeaders.length > 0) {
    const el = fromHeaders[fromHeaders.length - 1];
    const email = el.getAttribute('email') || '';
    const name = el.getAttribute('name') || el.textContent || '';
    if (email) return { name, email };
  }

  return null;
}

function isEmailView() {
  // Multiple ways to detect we're viewing an individual email
  // .hP = subject line, .gD = sender element, h2[data-thread-perm-id] = thread heading
  // Also check URL pattern for opened emails (contains /m/ or hash with msg id)
  if (document.querySelector('.hP')) return true;
  if (document.querySelector('.gD')) return true;
  if (document.querySelector('h2[data-thread-perm-id]')) return true;
  if (document.querySelector('[data-message-id]')) return true;
  // URL-based: Gmail uses hash fragments like #inbox/FMfcgz... when viewing an email
  const hash = window.location.hash;
  if (hash && hash.match(/#[a-z]+\/[A-Za-z0-9]+/)) return true;
  return false;
}

function attachButtonEvents(btn) {
  // Use both mousedown (fires before Gmail can intercept) and click as backup
  // capture: true ensures we get the event first
  btn.addEventListener('mousedown', handleButtonClick, true);
  btn.addEventListener('click', handleButtonClick, true);
}

function injectButton() {
  // Don't double-inject
  if (document.querySelector('.offerbell-add-btn')) return;

  // Only inject when viewing an email (not inbox list)
  if (!isEmailView()) return;

  // Try to find Gmail toolbar areas (multiple selectors for different Gmail versions)
  const toolbar = document.querySelector('.iH > div')
    || document.querySelector('.G-tF')
    || document.querySelector('.bAo .x')
    || document.querySelector('[gh="mtb"]');

  if (toolbar) {
    const btn = createButton();
    attachButtonEvents(btn);
    toolbar.appendChild(btn);
    return;
  }

  // Try to inject near the subject line
  const subjectEl = document.querySelector('.hP')
    || document.querySelector('h2[data-thread-perm-id]');
  if (subjectEl) {
    const subjectRow = subjectEl.closest('tr') || subjectEl.parentElement;
    if (subjectRow) {
      const btn = createButton();
      attachButtonEvents(btn);
      subjectRow.style.position = 'relative';
      subjectRow.appendChild(btn);
      return;
    }
  }

  // Final fallback: floating button (always visible, always works)
  const btn = createButton();
  btn.classList.add('offerbell-floating');
  attachButtonEvents(btn);
  document.body.appendChild(btn);
}

let _lastClickTime = 0;
function handleButtonClick(e) {
  e.stopPropagation();
  e.stopImmediatePropagation();
  e.preventDefault();

  // Debounce: prevent double-fire from mousedown + click
  const now = Date.now();
  if (now - _lastClickTime < 500) return;
  _lastClickTime = now;

  const senderInfo = getSenderFromEmail();
  if (!senderInfo) {
    // Try harder — grab any visible email on the page
    const allEmails = document.querySelectorAll('span[email]');
    if (allEmails.length > 0) {
      const el = allEmails[0];
      const popup = createPopup({
        name: el.getAttribute('name') || el.textContent || '',
        email: el.getAttribute('email') || ''
      });
      document.body.appendChild(popup);
      return;
    }

    alert('Could not detect sender email. Try opening an email first.');
    return;
  }

  const popup = createPopup(senderInfo);
  document.body.appendChild(popup);
}

// ── Watch for Gmail navigation ───────────────────────────

let lastUrl = '';
const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    // Remove any existing button on navigation (especially floating ones)
    document.querySelectorAll('.offerbell-add-btn').forEach(el => el.remove());
    // Small delay to let Gmail render
    setTimeout(injectButton, 800);
  }

  // Also re-check periodically when DOM changes (Gmail is an SPA)
  if (!document.querySelector('.offerbell-add-btn')) {
    if (isEmailView()) {
      setTimeout(injectButton, 300);
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial injection attempt
setTimeout(injectButton, 1500);
