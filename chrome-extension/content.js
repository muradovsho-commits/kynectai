// OfferBell Chrome Extension — Gmail + Outlook Web Content Script
// Injects "Add to OfferBell" + "Write Outreach" buttons when viewing an email

const OFFERBELL_URL = 'https://offerbell.org';

function isOutlook() {
  return location.hostname.includes('outlook.office') || location.hostname.includes('outlook.live');
}

// ── Helpers ──────────────────────────────────────────────

function inferFirmFromEmail(email) {
  const domain = email.split('@')[1] || '';
  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com', 'mail.com', 'live.com', 'msn.com', 'ymail.com'];
  if (freeProviders.includes(domain)) return '';
  const firm = domain.split('.')[0];
  return firm.charAt(0).toUpperCase() + firm.slice(1);
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML.replace(/"/g, '&quot;');
}

// ── UI: Buttons ──────────────────────────────────────────

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

function createWriteButton() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'offerbell-write-btn';
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
    <span>Write Outreach</span>
  `;
  return btn;
}

// ── UI: Add Contact Popup ────────────────────────────────

function createPopup(senderInfo) {
  const { first, last } = splitName(senderInfo.name);
  const firm = inferFirmFromEmail(senderInfo.email);

  const overlay = document.createElement('div');
  overlay.className = 'offerbell-overlay';
  overlay.innerHTML = `
    <div class="offerbell-popup">
      <div class="offerbell-popup-header">
        <div class="offerbell-popup-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0c0c0c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
        <button class="offerbell-btn-primary">Add Contact</button>
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

  overlay.querySelector('.offerbell-popup-close').addEventListener('click', () => overlay.remove());
  overlay.querySelector('.offerbell-btn-cancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('.offerbell-btn-primary').addEventListener('click', () => {
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
    const params = new URLSearchParams(data);
    window.open(`${OFFERBELL_URL}/add-contact?${params.toString()}`, '_blank');
    overlay.querySelector('.offerbell-popup-body').style.display = 'none';
    overlay.querySelector('.offerbell-popup-footer').style.display = 'none';
    overlay.querySelector('.offerbell-popup-success').style.display = 'flex';
    setTimeout(() => overlay.remove(), 2500);
  });

  return overlay;
}

// ── UI: Outreach Writer Popup ────────────────────────────

function createWritePopup(senderInfo) {
  const { first, last } = splitName(senderInfo.name);
  const firm = inferFirmFromEmail(senderInfo.email);

  const overlay = document.createElement('div');
  overlay.className = 'offerbell-overlay';
  overlay.innerHTML = `
    <div class="offerbell-popup offerbell-popup-wide">
      <div class="offerbell-popup-header">
        <div class="offerbell-popup-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0c0c0c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Write Outreach
        </div>
        <button class="offerbell-popup-close">&times;</button>
      </div>

      <!-- Step 1: Details -->
      <div class="ob-write-step" id="ob-write-step1">
        <div class="offerbell-popup-body">
          <div class="ob-section-label">Contact</div>
          <div class="offerbell-field-row">
            <div class="offerbell-field"><label>Name</label><input type="text" id="ob-w-name" value="${escapeHtml((first + ' ' + last).trim())}" placeholder="Contact name" /></div>
            <div class="offerbell-field"><label>Firm</label><input type="text" id="ob-w-firm" value="${escapeHtml(firm)}" placeholder="Company" /></div>
          </div>
          <div class="offerbell-field-row">
            <div class="offerbell-field"><label>Role</label><input type="text" id="ob-w-role" value="" placeholder="e.g. IB Analyst" /></div>
            <div class="offerbell-field"><label>Their School (optional)</label><input type="text" id="ob-w-school" value="" placeholder="e.g. NYU Stern" /></div>
          </div>
          <div class="ob-section-label" style="margin-top:8px">About You</div>
          <div class="offerbell-field-row">
            <div class="offerbell-field"><label>Your Name</label><input type="text" id="ob-w-yourname" value="" placeholder="Your name" /></div>
            <div class="offerbell-field"><label>Your School</label><input type="text" id="ob-w-yourschool" value="" placeholder="e.g. Ohio State" /></div>
          </div>
          <div class="offerbell-field-row">
            <div class="offerbell-field"><label>Year</label><input type="text" id="ob-w-year" value="" placeholder="e.g. Junior" /></div>
            <div class="offerbell-field"><label>Target Role</label><input type="text" id="ob-w-target" value="Investment Banking" placeholder="e.g. Investment Banking" /></div>
          </div>
        </div>
        <div class="offerbell-popup-footer">
          <button class="offerbell-btn-cancel" id="ob-w-cancel1">Cancel</button>
          <button class="offerbell-btn-primary" id="ob-w-next1">Choose Angle →</button>
        </div>
      </div>

      <!-- Step 2: Angle -->
      <div class="ob-write-step" id="ob-write-step2" style="display:none">
        <div class="offerbell-popup-body">
          <div class="ob-section-label">Networking Angle</div>
          <div class="ob-angle-grid">
            <button class="ob-angle-option ob-angle-active" data-angle="alumni"><strong>Alumni</strong><span>Same school or program</span></button>
            <button class="ob-angle-option" data-angle="deal"><strong>Deal Reference</strong><span>Recent transaction</span></button>
            <button class="ob-angle-option" data-angle="interest"><strong>Shared Interest</strong><span>Common topic or area</span></button>
            <button class="ob-angle-option" data-angle="mutual"><strong>Mutual Connection</strong><span>Someone referred you</span></button>
            <button class="ob-angle-option" data-angle="career"><strong>Career Path</strong><span>Similar trajectory</span></button>
            <button class="ob-angle-option" data-angle="cold"><strong>No Connection</strong><span>Pure cold outreach</span></button>
          </div>
          <div class="offerbell-field" style="margin-top:12px">
            <label id="ob-w-ctx-label">What do you have in common?</label>
            <input type="text" id="ob-w-ctx" placeholder="e.g. NYU Stern IB Club, Goldman on-campus recruiting" />
          </div>
          <div class="ob-section-label" style="margin-top:8px">Tone</div>
          <div class="ob-tone-row">
            <button class="ob-tone-option ob-tone-active" data-tone="Professional">Professional</button>
            <button class="ob-tone-option" data-tone="Conversational">Conversational</button>
            <button class="ob-tone-option" data-tone="Direct & brief">Direct & brief</button>
          </div>
        </div>
        <div class="offerbell-popup-footer">
          <button class="offerbell-btn-cancel" id="ob-w-back2">← Back</button>
          <button class="offerbell-btn-primary" id="ob-w-generate">Generate Message →</button>
        </div>
      </div>

      <!-- Step 3: Output -->
      <div class="ob-write-step" id="ob-write-step3" style="display:none">
        <div class="offerbell-popup-body">
          <div id="ob-w-loading" style="text-align:center;padding:40px 0">
            <div style="font-size:15px;font-weight:700;color:#0c0c0c;margin-bottom:4px">Generating your message…</div>
            <div style="font-size:12px;color:#9b9997">Just a second.</div>
          </div>
          <div id="ob-w-result" style="display:none">
            <div class="ob-section-label">Subject</div>
            <div id="ob-w-subject" style="font-size:14px;font-weight:700;color:#0c0c0c;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #ebebea"></div>
            <div id="ob-w-body" style="font-size:13px;line-height:1.8;color:#0c0c0c;white-space:pre-wrap;max-height:240px;overflow-y:auto"></div>
          </div>
        </div>
        <div class="offerbell-popup-footer" id="ob-w-result-footer" style="display:none">
          <button class="offerbell-btn-cancel" id="ob-w-back3">← Edit</button>
          <div style="display:flex;gap:6px">
            <button class="offerbell-btn-cancel" id="ob-w-regen">↻ Redo</button>
            <button class="offerbell-btn-cancel" id="ob-w-copy">Copy</button>
            <button class="offerbell-btn-primary" id="ob-w-insert">Insert into Reply</button>
          </div>
        </div>
      </div>
    </div>
  `;

  let selectedAngle = 'alumni';
  let selectedTone = 'Professional';
  let generatedSubject = '';
  let generatedBody = '';

  const ctxLabels = { alumni: 'What do you have in common?', deal: 'Which deal or transaction?', interest: "What's the shared interest?", mutual: 'Who referred you?', career: 'What path are you targeting?', cold: 'Why this specific person?' };
  const ctxPlaceholders = { alumni: 'e.g. NYU Stern IB Club, Goldman on-campus recruiting', deal: "e.g. Goldman's acquisition of GreenSky", interest: 'e.g. semiconductor M&A, impact investing', mutual: 'e.g. Jane Smith from Goldman', career: 'e.g. IB at a bulge bracket, then PE', cold: 'e.g. Their group covers sectors I want to work in' };

  // Close
  overlay.querySelector('.offerbell-popup-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#ob-w-cancel1').addEventListener('click', () => overlay.remove());

  function showStep(n) {
    overlay.querySelector('#ob-write-step1').style.display = n === 1 ? '' : 'none';
    overlay.querySelector('#ob-write-step2').style.display = n === 2 ? '' : 'none';
    overlay.querySelector('#ob-write-step3').style.display = n === 3 ? '' : 'none';
  }

  overlay.querySelector('#ob-w-next1').addEventListener('click', () => showStep(2));
  overlay.querySelector('#ob-w-back2').addEventListener('click', () => showStep(1));
  overlay.querySelector('#ob-w-back3').addEventListener('click', () => showStep(2));

  // Angle
  overlay.querySelectorAll('.ob-angle-option').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.ob-angle-option').forEach(b => b.classList.remove('ob-angle-active'));
      btn.classList.add('ob-angle-active');
      selectedAngle = btn.getAttribute('data-angle');
      overlay.querySelector('#ob-w-ctx-label').textContent = ctxLabels[selectedAngle] || 'Context';
      overlay.querySelector('#ob-w-ctx').placeholder = ctxPlaceholders[selectedAngle] || '';
    });
  });

  // Tone
  overlay.querySelectorAll('.ob-tone-option').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.ob-tone-option').forEach(b => b.classList.remove('ob-tone-active'));
      btn.classList.add('ob-tone-active');
      selectedTone = btn.getAttribute('data-tone');
    });
  });

  // Generate
  async function generate() {
    showStep(3);
    overlay.querySelector('#ob-w-loading').style.display = '';
    overlay.querySelector('#ob-w-result').style.display = 'none';
    overlay.querySelector('#ob-w-result-footer').style.display = 'none';

    const angleLabels = { alumni: 'Alumni', deal: 'Deal Reference', interest: 'Shared Interest', mutual: 'Mutual Connection', career: 'Career Path', cold: 'No Connection' };

    const prompt = `Write a compelling cold email for an undergraduate student to a finance professional.
Student Info: name=${overlay.querySelector('#ob-w-yourname').value}, school=${overlay.querySelector('#ob-w-yourschool').value}, year=${overlay.querySelector('#ob-w-year').value}, target role=${overlay.querySelector('#ob-w-target').value}.
Contact Info: name=${overlay.querySelector('#ob-w-name').value}, firm=${overlay.querySelector('#ob-w-firm').value}, role=${overlay.querySelector('#ob-w-role').value}, school=${overlay.querySelector('#ob-w-school').value}.
Networking Angle: ${angleLabels[selectedAngle] || selectedAngle}. Context: ${overlay.querySelector('#ob-w-ctx').value || 'None provided'}.
Tone: ${selectedTone}.

Rules:
1. Do not use overly formal or robotic words like "delve", "robust", "thrilled", or "tapestry".
2. Make it sound like a natural, ambitious college student. Length should be around 4 to 8 sentences.
3. The very first line must be exactly "Subject: [your subject here]". Then two newlines, then the email body. Do not include any other commentary.
4. Ensure the subject line uses grammatically correct Title Case.
5. Pay close attention to the contact's specific role and firm.`;

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: 'generateOutreach', prompt }, (resp) => {
          if (chrome.runtime.lastError) { reject(new Error(chrome.runtime.lastError.message)); return; }
          if (resp && resp.success) { resolve(resp.data); } else { reject(new Error(resp?.error || 'Unknown error')); }
        });
      });
      const rawText = response.text || '';
      const match = rawText.match(/^Subject:\s*(.+)$/im);
      if (match) {
        generatedSubject = match[1];
        generatedBody = rawText.replace(/^Subject:\s*.+(\r?\n)+/i, '').trim();
      } else {
        generatedSubject = 'Networking Inquiry';
        generatedBody = rawText.trim();
      }
      overlay.querySelector('#ob-w-subject').textContent = generatedSubject;
      overlay.querySelector('#ob-w-body').textContent = generatedBody;
      overlay.querySelector('#ob-w-loading').style.display = 'none';
      overlay.querySelector('#ob-w-result').style.display = '';
      overlay.querySelector('#ob-w-result-footer').style.display = '';
    } catch (err) {
      overlay.querySelector('#ob-w-loading').innerHTML = '<div style="font-size:14px;font-weight:700;color:#dc2626;margin-bottom:4px">Failed to generate</div><div style="font-size:12px;color:#9b9997">Check your connection and try again.</div>';
    }
  }

  overlay.querySelector('#ob-w-generate').addEventListener('click', generate);
  overlay.querySelector('#ob-w-regen').addEventListener('click', generate);

  // Copy
  overlay.querySelector('#ob-w-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(`Subject: ${generatedSubject}\n\n${generatedBody}`);
    const b = overlay.querySelector('#ob-w-copy');
    b.textContent = 'Copied!';
    setTimeout(() => { b.textContent = 'Copy'; }, 1500);
  });

  // Insert into Gmail reply
  overlay.querySelector('#ob-w-insert').addEventListener('click', () => {
    const composeBox = document.querySelector('[role="textbox"][aria-label*="Message"]')
      || document.querySelector('.editable[contenteditable="true"]')
      || document.querySelector('[aria-label="Message Body"]')
      || document.querySelector('div[aria-label*="Body"]')
      || document.querySelector('.Am.Al.editable')
      || document.querySelector('[contenteditable="true"][role="textbox"]')
      || document.querySelector('div[role="textbox"]')
      || document.querySelector('[aria-label*="body" i][contenteditable="true"]');

    if (composeBox) {
      composeBox.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, generatedBody);
      overlay.remove();
    } else {
      const replyBtn = document.querySelector('[data-tooltip="Reply"]')
        || document.querySelector('[aria-label="Reply"]')
        || document.querySelector('.ams.bkH');
      if (replyBtn) {
        replyBtn.click();
        setTimeout(() => {
          const box = document.querySelector('[role="textbox"][aria-label*="Message"]')
            || document.querySelector('.editable[contenteditable="true"]')
            || document.querySelector('[contenteditable="true"][role="textbox"]');
          if (box) { box.focus(); document.execCommand('insertText', false, generatedBody); }
          overlay.remove();
        }, 500);
      } else {
        navigator.clipboard.writeText(`Subject: ${generatedSubject}\n\n${generatedBody}`);
        const b = overlay.querySelector('#ob-w-insert');
        b.textContent = 'Copied to clipboard!';
        setTimeout(() => overlay.remove(), 1200);
      }
    }
  });

  return overlay;
}

// ── Gmail DOM Observer ───────────────────────────────────

function getSenderFromEmail() {
  // ── Outlook Web ──
  if (isOutlook()) {
    // 1. title attributes with @ (Outlook puts email in title on sender elements)
    const titledEls = document.querySelectorAll('[title*="@"]');
    for (const el of titledEls) {
      const title = el.getAttribute('title') || '';
      const m = title.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (m) {
        const name = el.textContent?.trim() || m[0].split('@')[0];
        return { name, email: m[0].toLowerCase() };
      }
    }
    // 2. aria-label attributes with @
    const ariaEls = document.querySelectorAll('[aria-label*="@"]');
    for (const el of ariaEls) {
      const aria = el.getAttribute('aria-label') || '';
      const m = aria.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (m) {
        const before = aria.split(m[0])[0].replace(/[<(,]/g, '').trim();
        return { name: before || m[0].split('@')[0], email: m[0].toLowerCase() };
      }
    }
    // 3. persona hover targets
    const hoverTargets = document.querySelectorAll('span.lpc-hoverTarget, [data-lpc-hover-target-id]');
    for (const el of hoverTargets) {
      const name = el.textContent?.trim() || '';
      if (!name || name.length < 2) continue;
      const hoverId = el.getAttribute('data-lpc-hover-target-id') || '';
      const parent = el.closest('[aria-label]');
      const ariaLabel = parent ? parent.getAttribute('aria-label') : '';
      const allText = hoverId + ' ' + ariaLabel + ' ' + (el.getAttribute('title') || '');
      const m = allText.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (m) return { name, email: m[0].toLowerCase() };
      return { name, email: '' };
    }
    // 4. brute-force scan for any email pattern in visible text
    const allSpans = document.querySelectorAll('span');
    for (const el of allSpans) {
      if (el.children.length > 3) continue;
      const text = el.textContent || '';
      if (text.length > 150) continue;
      const m = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (m) {
        const before = text.split(m[0])[0].replace(/[<(]/g, '').trim();
        return { name: before || m[0].split('@')[0], email: m[0].toLowerCase() };
      }
    }
    return { name: '', email: '' };
  }

  // ── Gmail ──
  const selectors = ['span[email]', '.go', 'h3.iw span[email]', '[data-hovercard-id]'];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      const email = el.getAttribute('email') || '';
      const name = el.getAttribute('name') || el.textContent || '';
      if (email) return { name: name || email, email };
    }
  }
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
  // ── Outlook Web ── always in email context
  if (isOutlook()) return true;
  // ── Gmail ──
  if (document.querySelector('.hP')) return true;
  if (document.querySelector('.gD')) return true;
  if (document.querySelector('h2[data-thread-perm-id]')) return true;
  if (document.querySelector('[data-message-id]')) return true;
  const hash = window.location.hash;
  if (hash && hash.match(/#[a-z]+\/[A-Za-z0-9]+/)) return true;
  return false;
}

function attachButtonEvents(btn, handler) {
  btn.addEventListener('mousedown', handler, true);
  btn.addEventListener('click', handler, true);
}

function injectButton() {
  if (document.querySelector('.offerbell-btn-group')) return;
  if (!isEmailView()) return;

  const container = document.createElement('div');
  container.className = 'offerbell-btn-group';
  const addBtn = createButton();
  const writeBtn = createWriteButton();
  attachButtonEvents(addBtn, handleAddClick);
  attachButtonEvents(writeBtn, handleWriteClick);
  container.appendChild(addBtn);
  container.appendChild(writeBtn);

  if (isOutlook()) {
    container.classList.add('offerbell-floating');
    document.body.appendChild(container);
    return;
  }

  // Gmail toolbar injection
  const toolbar = document.querySelector('.iH > div')
    || document.querySelector('.G-tF')
    || document.querySelector('.bAo .x')
    || document.querySelector('[gh="mtb"]');

  if (toolbar) { toolbar.appendChild(container); return; }

  const subjectEl = document.querySelector('.hP') || document.querySelector('h2[data-thread-perm-id]');
  if (subjectEl) {
    const row = subjectEl.closest('tr') || subjectEl.parentElement;
    if (row) { row.style.position = 'relative'; row.appendChild(container); return; }
  }

  container.classList.add('offerbell-floating');
  document.body.appendChild(container);
}

let _lastClickTime = 0;

function handleAddClick(e) {
  e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();
  const now = Date.now(); if (now - _lastClickTime < 500) return; _lastClickTime = now;

  const senderInfo = getSenderFromEmail();
  if (!senderInfo) {
    const allEmails = document.querySelectorAll('span[email]');
    if (allEmails.length > 0) {
      const el = allEmails[0];
      document.body.appendChild(createPopup({ name: el.getAttribute('name') || el.textContent || '', email: el.getAttribute('email') || '' }));
      return;
    }
    alert('Could not detect sender email. Try opening an email first.');
    return;
  }
  document.body.appendChild(createPopup(senderInfo));
}

function handleWriteClick(e) {
  e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();
  const now = Date.now(); if (now - _lastClickTime < 500) return; _lastClickTime = now;

  const senderInfo = getSenderFromEmail() || { name: '', email: '' };
  if (!senderInfo.email) {
    const allEmails = document.querySelectorAll('span[email]');
    if (allEmails.length > 0) {
      const el = allEmails[0];
      senderInfo.name = el.getAttribute('name') || el.textContent || '';
      senderInfo.email = el.getAttribute('email') || '';
    }
  }
  document.body.appendChild(createWritePopup(senderInfo));
}

// ── Navigation Watcher ───────────────────────────────────

let lastUrl = '';
const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    document.querySelectorAll('.offerbell-add-btn, .offerbell-write-btn, .offerbell-btn-group').forEach(el => el.remove());
    setTimeout(injectButton, 800);
  }
  if (!document.querySelector('.offerbell-add-btn')) {
    if (isEmailView()) setTimeout(injectButton, 300);
  }
});
observer.observe(document.body, { childList: true, subtree: true });
setTimeout(injectButton, 1500);
// Outlook is a SPA that doesn't change URL — poll for button presence
if (isOutlook()) {
  setTimeout(injectButton, 3000);
  setTimeout(injectButton, 5000);
  setInterval(() => {
    if (!document.querySelector('.offerbell-btn-group')) injectButton();
  }, 3000);
}
