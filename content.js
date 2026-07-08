// ==========================================
// TICKK OUTBOUND AUDIT — CONTENT SCRIPT
// ==========================================
// Gmail compose interception with inline tracking toggle and
// Sent folder visual tick injection. Detects compose windows
// via MutationObserver, injects a premium toggle beside the
// Send button, conditionally instruments outbound emails, and
// renders live tracking status ticks in Gmail's email list.
//
// ★ MODULES:
//   1. Toggle State Management (popup + inline sync)
//   2. Inline Compose Toggle (premium pill element)
//   3. Send Pipeline (pixel injection + link rewriting)
//   4. Sent Folder Visual Ticks (delivery + open indicators)
//
// ★ Toggle state is shared with the popup dashboard via
//   chrome.storage.local under key 'tickk_tracking_enabled'.
// ==========================================

'use strict';

// ==========================================
// CONFIG — OUTBOUND AUDIT MODULE
// ==========================================
const AUDIT_BACKEND_URL = 'https://tick-email-tracker.onrender.com';
const AUDIT_USER_ID = '700dfa91-2d97-431a-b96b-ff9faabdcd27';
const STORAGE_KEY = 'tickk_tracking_enabled';

// ==========================================
// MODULE 1: TRACKING TOGGLE STATE
// ==========================================
// Default: enabled (true). The popup toggle persists state to
// chrome.storage.local. This variable is the in-memory mirror
// for zero-latency checks inside the synchronous send pipeline.
let TICKK_TRACKING_ENABLED = true;

// Registry of all injected inline toggles — kept in sync when
// state changes from ANY source (popup, inline click, storage).
const inlineToggleRegistry = new Set();

// ── Load persisted toggle state on content script injection ──
try {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (result[STORAGE_KEY] === false) {
      TICKK_TRACKING_ENABLED = false;
    } else {
      TICKK_TRACKING_ENABLED = true;
    }
    console.log('[TICKK Audit] Tracking toggle loaded from storage:', TICKK_TRACKING_ENABLED ? 'ENABLED' : 'DISABLED');
    syncAllInlineToggles();
  });
} catch (e) {
  console.error('[TICKK Audit] Failed to read toggle state:', e.message);
}

// ── Listen for live toggle changes from the popup ──
try {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trackingStateChanged') {
      TICKK_TRACKING_ENABLED = message.enabled !== false;
      console.log('[TICKK Audit] Tracking toggle updated via popup:', TICKK_TRACKING_ENABLED ? 'ENABLED' : 'DISABLED');
      syncAllInlineToggles();
      sendResponse({ received: true });
    }
  });
} catch (e) {
  console.error('[TICKK Audit] Failed to register toggle listener:', e.message);
}

// ── Also listen for storage changes (covers edge cases where
//    the popup writes to storage but the tab message fails) ──
try {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[STORAGE_KEY]) {
      TICKK_TRACKING_ENABLED = changes[STORAGE_KEY].newValue !== false;
      console.log('[TICKK Audit] Tracking toggle changed via storage event:', TICKK_TRACKING_ENABLED ? 'ENABLED' : 'DISABLED');
      syncAllInlineToggles();
    }
  });
} catch (e) {
  console.error('[TICKK Audit] Failed to register storage listener:', e.message);
}

// ==========================================
// INLINE TOGGLE — Visual State Sync
// ==========================================
function syncAllInlineToggles() {
  inlineToggleRegistry.forEach((toggleEl) => {
    if (!toggleEl || !document.contains(toggleEl)) {
      inlineToggleRegistry.delete(toggleEl);
      return;
    }
    applyToggleVisualState(toggleEl, TICKK_TRACKING_ENABLED);
  });
}

function applyToggleVisualState(toggleEl, isEnabled) {
  const dot    = toggleEl.querySelector('.tickk-toggle-dot');
  const label  = toggleEl.querySelector('.tickk-toggle-label');
  if (!dot || !label) return;

  if (isEnabled) {
    toggleEl.classList.add('tickk-on');
    toggleEl.classList.remove('tickk-off');
    dot.style.background    = '#34d399';
    dot.style.boxShadow     = '0 0 6px rgba(52,211,153,0.5)';
    label.textContent       = 'ON';
    label.style.color       = '#34d399';
  } else {
    toggleEl.classList.remove('tickk-on');
    toggleEl.classList.add('tickk-off');
    dot.style.background    = '#55555f';
    dot.style.boxShadow     = 'none';
    label.textContent       = 'OFF';
    label.style.color       = '#8a8a96';
  }
}

// ==========================================
// MODULE 2: INLINE TOGGLE — CSS Injection
// ==========================================
function injectToggleStyles() {
  if (document.getElementById('tickk-inline-styles')) return;

  const style = document.createElement('style');
  style.id = 'tickk-inline-styles';
  style.textContent = `
    /* ══════════════════════════════════════════
       TICKK INLINE TOGGLE — Gmail Compose
       Premium minimalist dark pill element
       ══════════════════════════════════════════ */
    .tickk-inline-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px 4px 8px;
      margin-left: 8px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(10,10,12,0.85);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      vertical-align: middle;
      height: 28px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      z-index: 1;
      flex-shrink: 0;
    }
    .tickk-inline-toggle:hover {
      border-color: rgba(255,255,255,0.18);
      background: rgba(16,16,20,0.92);
      transform: translateY(-0.5px);
    }
    .tickk-inline-toggle:active {
      transform: scale(0.97);
    }
    .tickk-toggle-brand {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.2px;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      line-height: 1;
    }
    .tickk-toggle-pipe {
      width: 1px;
      height: 12px;
      background: rgba(255,255,255,0.08);
      flex-shrink: 0;
    }
    .tickk-toggle-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }
    .tickk-toggle-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      line-height: 1;
      transition: color 0.3s ease;
      min-width: 18px;
    }
    .tickk-inline-toggle::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      opacity: 0;
      background: radial-gradient(circle at center, rgba(52,211,153,0.15), transparent 70%);
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .tickk-inline-toggle.tickk-on::after {
      background: radial-gradient(circle at center, rgba(52,211,153,0.12), transparent 70%);
    }
    .tickk-inline-toggle:active::after {
      opacity: 1;
    }

    /* ══════════════════════════════════════════
       TICKK VISUAL TICKS — Gmail Row Badges
       Sent folder delivery + open indicators
       ══════════════════════════════════════════ */
    .tickk-status-badge {
      display: inline-flex;
      align-items: center;
      margin-right: 6px;
      vertical-align: text-bottom;
      flex-shrink: 0;
      position: relative;
      cursor: default;
    }

    /* ── Single Silver Tick: Sent / Delivered ── */
    .tickk-svg-sent {
      color: #8696a0;
      opacity: 0.8;
      transition: all 0.4s ease;
    }

    /* ── Double Green Ticks: Opened (WhatsApp style) ── */
    .tickk-svg-opened {
      color: #25D366; /* WhatsApp Green */
      filter: drop-shadow(0 0 2px rgba(37,211,102,0.3));
      transition: all 0.4s ease;
    }

    /* Subtle entrance animation */
    .tickk-status-badge svg {
      animation: tickk-badge-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes tickk-badge-pop {
      from { transform: scale(0.5); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }

    /* Hover Mini-Widget (Interactive Tooltip) */
    .tickk-tooltip-widget {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) scale(0.95);
      padding: 6px 10px;
      border-radius: 6px;
      background: rgba(14,14,18,0.96);
      border: 1px solid rgba(255,255,255,0.12);
      color: #e5e7eb;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      pointer-events: none; /* Let hover cleanly dismiss */
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    }
    .tickk-tooltip-widget.tickk-tooltip-show {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) scale(1);
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// INLINE TOGGLE — DOM Element Factory
// ==========================================
function createInlineToggle() {
  const toggle = document.createElement('div');
  toggle.className = 'tickk-inline-toggle tickk-on';
  toggle.setAttribute('role', 'switch');
  toggle.setAttribute('aria-label', 'TICKK email tracking toggle');
  toggle.setAttribute('tabindex', '0');

  toggle.innerHTML = `
    <span class="tickk-toggle-brand">TK</span>
    <span class="tickk-toggle-pipe"></span>
    <span class="tickk-toggle-dot"></span>
    <span class="tickk-toggle-label">ON</span>
  `;

  applyToggleVisualState(toggle, TICKK_TRACKING_ENABLED);

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    TICKK_TRACKING_ENABLED = !TICKK_TRACKING_ENABLED;
    console.log('[TICKK Audit] Inline toggle clicked:', TICKK_TRACKING_ENABLED ? 'ENABLED' : 'DISABLED');
    chrome.storage.local.set({ [STORAGE_KEY]: TICKK_TRACKING_ENABLED });
    syncAllInlineToggles();
  });

  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });

  return toggle;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Generate a cryptographically strong UUID v4.
 */
function generateAuditToken() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } catch (error) {
    console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
    return 'fallback-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  }
}

function resolveRecipientAddress(composeWindow) {
  try {
    const selectors = [
      'input[name="to"]', '[name="to"]', '[peoplekit-id="To"]', '[aria-label="To"]', '.vO', '.oj .vN', '[email]'
    ];
    for (const selector of selectors) {
      const el = composeWindow.querySelector(selector);
      if (el) {
        const email = el.getAttribute('email') || el.value || el.getAttribute('value');
        if (email && email.includes('@')) return email.trim();
      }
    }
    const toArea = composeWindow.querySelector('.wO[role="list"]') || composeWindow.querySelector('[role="list"][aria-label="To"]');
    if (toArea) {
      const chip = toArea.querySelector('[email]');
      if (chip) return chip.getAttribute('email');
    }
    return 'unknown';
  } catch (error) {
    console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
    return 'unknown';
  }
}

function resolveComposeBody(composeWindow) {
  try {
    return composeWindow.querySelector('[role="textbox"][aria-label="Message Body"]') ||
      composeWindow.querySelector('.Am.Al.editable') ||
      composeWindow.querySelector('[contenteditable="true"]');
  } catch (error) {
    console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
    return null;
  }
}

// ==========================================
// BACKEND REGISTRATION — FIRE-AND-FORGET (keepalive)
// ==========================================
function fireRegistration(token, recipient) {
  const payload = JSON.stringify({
    token: token,
    recipient: recipient,
    user_id: AUDIT_USER_ID
  });

  fetch(`${AUDIT_BACKEND_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true
  })
    .then(response => {
      if (response.ok) {
        console.log(`[TICKK Audit] DB registration confirmed (HTTP ${response.status}) | Token: ${token}`);
      } else {
        console.error(`[TICKK Audit] /register failed | HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .catch(error => {
      console.error('[TICKK Audit] /register network error:', error.name, error.message);
    });

  console.log('[TICKK Audit] /register fired (keepalive, non-blocking) | Token:', token);
}

// ==========================================
// TRACKING PIXEL INJECTION — DIRECT SRC
// ==========================================
function injectTrackingPixel(body, token) {
  const existingBeacon = body.querySelector('.tickk-delivery-beacon');
  if (existingBeacon) existingBeacon.remove();

  const beaconUrl = `${AUDIT_BACKEND_URL}/track?id=${token}`;
  const beacon = document.createElement('img');

  beacon.setAttribute('src', beaconUrl);
  beacon.alt = '';
  beacon.setAttribute('width', '1');
  beacon.setAttribute('height', '1');
  beacon.style.cssText = 'display: inline; margin: 0; padding: 0; float: right;';
  beacon.classList.add('tickk-delivery-beacon');

  body.appendChild(beacon);
  console.log('[TICKK Audit] Beacon injected (src set) | Token:', token);
  return beacon;
}

// ==========================================
// LINK REWRITING FOR CLICK TRACKING
// ==========================================
function rewriteLinksForTracking(body, token) {
  const links = body.querySelectorAll('a[href]');
  links.forEach(link => {
    try {
      const originalUrl = link.href;
      if (originalUrl && originalUrl.startsWith('http') && !originalUrl.includes(AUDIT_BACKEND_URL)) {
        const encodedUrl = encodeURIComponent(originalUrl);
        link.href = `${AUDIT_BACKEND_URL}/audit-click?token=${token}&url=${encodedUrl}`;
        console.log('[TICKK Audit] Rewrote link for tracking:', originalUrl);
      }
    } catch (linkError) {
      console.error("Error in [Link Rewriting]:", linkError.name, linkError.message, linkError.stack);
    }
  });
}

// ==========================================
// RELEASE GMAIL'S NATIVE SEND
// ==========================================
function releaseGmailSend(sendBtn) {
  const syntheticMousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
  syntheticMousedown._tickkBypassed = true;
  sendBtn.dispatchEvent(syntheticMousedown);
  sendBtn.click();
}

// ==========================================
// MODULE 3: CORE SEND PIPELINE
// ==========================================
function executeSendPipeline(sendBtn, body, composeWindow) {
  const savedToken = body.dataset.tickkAuditToken;
  const recipient = resolveRecipientAddress(composeWindow);
  console.log('[TICKK Audit] Send pipeline started | Token:', savedToken, '| Recipient:', recipient);

  if (!TICKK_TRACKING_ENABLED) {
    console.log('[TICKK Audit] ⏸ Tracking DISABLED — bypassing all instrumentation. Releasing clean send.');
    releaseGmailSend(sendBtn);
    return;
  }

  injectTrackingPixel(body, savedToken);
  rewriteLinksForTracking(body, savedToken);
  fireRegistration(savedToken, recipient);
  console.log('[TICKK Audit] ✅ Beacon + links + registration complete. Releasing Gmail send.');
  releaseGmailSend(sendBtn);
}

// ==========================================
// SEND BUTTON RESOLVER — Multi-Strategy
// ==========================================
function resolveSendButton(composeWindow) {
  return composeWindow.querySelector('[data-tooltip*="Send"]') ||
    composeWindow.querySelector('[aria-label*="Send"]') ||
    composeWindow.querySelector('.gU.Up [role="button"]');
}

// ==========================================
// OUTBOUND AUDIT SETUP — INTERCEPT + INJECT TOGGLE
// ==========================================
function setupOutboundAudit(composeWindow) {
  try {
    const body = resolveComposeBody(composeWindow);
    if (!body) return;

    if (body.dataset.tickkAuditSetup) return;
    body.dataset.tickkAuditSetup = 'true';

    const token = generateAuditToken();
    body.dataset.tickkAuditToken = token;
    console.log('[TICKK Audit] Compose detected — token reserved:', token);

    const sendBtn = resolveSendButton(composeWindow);
    if (!sendBtn) return;

    if (sendBtn.dataset.tickkAuditListenerAttached) return;
    sendBtn.dataset.tickkAuditListenerAttached = 'true';

    injectToggleStyles();
    injectInlineToggle(composeWindow, sendBtn);

    sendBtn.addEventListener('mousedown', function tickkSendInterceptor(event) {
      if (event._tickkBypassed) return;
      if (sendBtn.dataset.tickkAuditDispatched) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      sendBtn.dataset.tickkAuditDispatched = 'true';

      try {
        executeSendPipeline(sendBtn, body, composeWindow);
      } catch (error) {
        console.error('[TICKK Audit] Pipeline error — releasing send:', error.name, error.message, error.stack);
        sendBtn.dataset.tickkAuditDispatched = '';
        releaseGmailSend(sendBtn);
      }
    }, true);

  } catch (error) {
    console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
  }
}

// ==========================================
// INLINE TOGGLE INJECTION — Into Compose Toolbar
// ==========================================
function injectInlineToggle(composeWindow, sendBtn) {
  try {
    if (composeWindow.querySelector('.tickk-inline-toggle')) return;

    const toggle = createInlineToggle();
    const sendBtnContainer = sendBtn.parentElement;

    if (sendBtnContainer) {
      if (sendBtnContainer.tagName === 'TD') {
        const toggleCell = document.createElement('td');
        toggleCell.style.cssText = 'vertical-align: middle; padding: 0;';
        toggleCell.appendChild(toggle);

        if (sendBtnContainer.nextSibling) {
          sendBtnContainer.parentElement.insertBefore(toggleCell, sendBtnContainer.nextSibling);
        } else {
          sendBtnContainer.parentElement.appendChild(toggleCell);
        }
      } else {
        if (sendBtnContainer.nextSibling) {
          sendBtnContainer.parentElement.insertBefore(toggle, sendBtnContainer.nextSibling);
        } else {
          sendBtnContainer.parentElement.appendChild(toggle);
        }
      }
    } else {
      sendBtn.insertAdjacentElement('afterend', toggle);
    }

    inlineToggleRegistry.add(toggle);
    console.log('[TICKK Audit] Inline toggle injected into compose toolbar');

    const cleanupObserver = new MutationObserver(() => {
      if (!document.contains(toggle)) {
        inlineToggleRegistry.delete(toggle);
        cleanupObserver.disconnect();
      }
    });
    cleanupObserver.observe(document.body, { childList: true, subtree: true });

  } catch (error) {
    console.error('[TICKK Audit] Failed to inject inline toggle:', error.name, error.message, error.stack);
  }
}

// ==========================================
// ==========================================
// MODULE 4: SENT FOLDER VISUAL TICKS
// ==========================================
// ==========================================
// Injects delivery/open status indicators into Gmail's email
// list view. Scans visible rows, matches recipients against
// cached audit data, and renders premium tick badges.
//
// ARCHITECTURE:
//   1. Audit data is fetched from background.js and cached
//   2. A recipient→status lookup map is built for O(1) matching
//   3. Gmail rows are scanned via MutationObserver + periodic
//      refresh to catch scroll-triggered virtual DOM recycling
//   4. Badges are idempotently injected — safe to re-scan
//
// PERFORMANCE SAFEGUARDS:
//   - Debounced scan (300ms) prevents mutation storm thrashing
//   - Data fetch is throttled to 45-second intervals
//   - Badge injection checks for existing badges before DOM write
//   - Observer only watches the email list container, not body
// ==========================================

// ── Audit Data Cache ──
let tickkAuditCache = [];                // Raw array from /emails
let tickkRecipientMap = new Map();       // recipient_email → audit entry (most recent)
let tickkLastFetchTime = 0;              // Timestamp of last data fetch
const TICKK_FETCH_INTERVAL = 45000;      // 45 seconds between API hits
const TICKK_SCAN_DEBOUNCE = 300;         // 300ms debounce on DOM scans
let tickkScanTimer = null;               // Debounce timer reference

// ──────────────────────────────────────────
// DATA — Fetch + Cache Audit Logs
// ──────────────────────────────────────────
function fetchAndCacheAuditData() {
  return new Promise((resolve) => {
    const now = Date.now();

    // Throttle: don't re-fetch if data is fresh
    if (now - tickkLastFetchTime < TICKK_FETCH_INTERVAL && tickkAuditCache.length > 0) {
      resolve(tickkAuditCache);
      return;
    }

    chrome.runtime.sendMessage({ action: 'getAuditLogs' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[TICKK Ticks] Data fetch error:', chrome.runtime.lastError.message);
        resolve(tickkAuditCache); // Fall back to stale cache
        return;
      }

      if (!response || response.success === false) {
        console.error('[TICKK Ticks] Backend returned error:', response?.error);
        resolve(tickkAuditCache);
        return;
      }

      // Extract emails array from response shape { success, emails }
      const emails = Array.isArray(response) ? response : (response.emails || response.data || []);
      tickkAuditCache = emails;
      tickkLastFetchTime = now;

      // Build recipient lookup map — keyed by normalized email
      // If multiple entries exist for the same recipient, keep
      // the one with the highest open_count (most engagement).
      tickkRecipientMap.clear();
      emails.forEach((entry) => {
        const recipientRaw = (entry.recipient || '').trim().toLowerCase();
        if (!recipientRaw || recipientRaw === 'unknown') return;

        const existing = tickkRecipientMap.get(recipientRaw);
        if (!existing || (parseInt(entry.open_count, 10) || 0) > (parseInt(existing.open_count, 10) || 0)) {
          tickkRecipientMap.set(recipientRaw, entry);
        }
      });

      console.log(`[TICKK Ticks] Cache refreshed — ${emails.length} entries, ${tickkRecipientMap.size} unique recipients`);
      resolve(emails);
    });
  });
}

// ──────────────────────────────────────────
// MATCHER — Extract Recipients from Gmail Row
// ──────────────────────────────────────────
// Gmail's email list rows contain participant info in various
// DOM structures depending on the view (Inbox, Sent, All Mail).
// We use multi-strategy extraction to find recipient emails.
function extractRowRecipients(row) {
  const recipients = new Set();

  try {
    // Strategy 1: [email] attribute on participant chips
    // Gmail attaches email="" attributes to participant elements
    const emailChips = row.querySelectorAll('[email]');
    emailChips.forEach((chip) => {
      const email = chip.getAttribute('email');
      if (email && email.includes('@')) {
        recipients.add(email.trim().toLowerCase());
      }
    });

    // Strategy 2: data-hovercard-id attribute (Google contact card)
    // Some Gmail versions use this for contact lookup
    const hovercardEls = row.querySelectorAll('[data-hovercard-id]');
    hovercardEls.forEach((el) => {
      const hoverId = el.getAttribute('data-hovercard-id');
      if (hoverId && hoverId.includes('@')) {
        recipients.add(hoverId.trim().toLowerCase());
      }
    });

    // Strategy 3: Participant name spans (`.yP`, `.zF`, `.yW span`)
    // In Sent folder, these show the recipient's name. We match
    // against the name text as a fallback if no email attribute found.
    if (recipients.size === 0) {
      const nameSelectors = ['.yP', '.zF', '.bA4 span', '.yW span[email]'];
      nameSelectors.forEach((sel) => {
        const els = row.querySelectorAll(sel);
        els.forEach((el) => {
          const email = el.getAttribute('email') || el.getAttribute('name');
          if (email && email.includes('@')) {
            recipients.add(email.trim().toLowerCase());
          }
        });
      });
    }

    // Strategy 4: Title attribute fallback
    // Some participant elements store the full email in title=""
    if (recipients.size === 0) {
      const titleEls = row.querySelectorAll('[title*="@"]');
      titleEls.forEach((el) => {
        const title = el.getAttribute('title') || '';
        // Extract email from title using simple regex
        const match = title.match(/[\w.+-]+@[\w.-]+\.\w+/);
        if (match) {
          recipients.add(match[0].trim().toLowerCase());
        }
      });
    }
  } catch (error) {
    console.error('[TICKK Ticks] Recipient extraction error:', error.message);
  }

  return recipients;
}

// ──────────────────────────────────────────
// MATCHER — Lookup Audit Entry for Row
// ──────────────────────────────────────────
// Tries to match ANY extracted recipient against the audit map.
// Returns the best matching audit entry, or null if no match.
function matchRowToAudit(recipients) {
  for (const email of recipients) {
    const entry = tickkRecipientMap.get(email);
    if (entry) return entry;
  }
  return null;
}

// ──────────────────────────────────────────
// BADGE — Create Status Tick Element
// ──────────────────────────────────────────
function createStatusBadge(auditEntry) {
  const openCount  = parseInt(auditEntry.open_count, 10) || 0;
  const linkClicks = parseInt(auditEntry.link_clicks, 10) || 0;
  const status     = (auditEntry.status || '').toUpperCase();
  const isOpened   = openCount > 0 || status === 'OPENED';

  const badge = document.createElement('span');
  badge.className = 'tickk-status-badge';
  badge.style.position = 'relative'; // For tooltip positioning

  // Tooltip content preparation
  let tooltipText = '';

  if (isOpened) {
    // ── Double Green Ticks: OPENED (Premium WhatsApp style) ──
    // stroke-width="3.5" + width="20" for authentic extra-bold feel
    badge.innerHTML = `<svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="tickk-svg-opened"><polyline points="15 6 6 15 2 11"></polyline><polyline points="22 6 13 15 10 12"></polyline></svg>`;

    const city = auditEntry.city || 'Unknown Location';
    const country = auditEntry.country || '';
    const locationStr = country && city !== 'Unknown Location' ? `${city}, ${country}` : city;
    tooltipText = `Opened ${openCount} times | Last City: ${locationStr}`;
  } else {
    // ── Single Grey Tick: PENDING (Premium WhatsApp style) ──
    badge.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="tickk-svg-sent"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    tooltipText = `Sent | Pending Open Track...`;
  }

  // ── IN-MAIL HOVER MINI-WIDGET (Interactive Tooltip) ──
  badge.addEventListener('mouseenter', () => {
    let tooltipEl = badge.querySelector('.tickk-tooltip-widget');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'tickk-tooltip-widget';
      tooltipEl.textContent = tooltipText;
      badge.appendChild(tooltipEl);
      // Small reflow delay for transition
      requestAnimationFrame(() => tooltipEl.classList.add('tickk-tooltip-show'));
    } else {
      tooltipEl.classList.add('tickk-tooltip-show');
    }
  });

  badge.addEventListener('mouseleave', () => {
    const tooltipEl = badge.querySelector('.tickk-tooltip-widget');
    if (tooltipEl) {
      tooltipEl.classList.remove('tickk-tooltip-show');
    }
  });

  // Store the data fingerprint so we can detect when to update
  badge.dataset.tickkOpenCount = openCount;
  badge.dataset.tickkStatus = status;

  return badge;
}

// ──────────────────────────────────────────
// INJECTION — Scan Gmail Rows + Inject Badges
// ──────────────────────────────────────────
function scanAndInjectTicks() {
  try {
    // Gmail email rows use the `.zA` class (thread row in list)
    const rows = document.querySelectorAll('tr.zA, [role="row"]');
    if (rows.length === 0) return;

    let injected = 0;
    let updated  = 0;

    rows.forEach((row) => {
      try {
        // Extract recipient emails from this row
        const recipients = extractRowRecipients(row);
        if (recipients.size === 0) return;

        // Match against audit cache
        const auditEntry = matchRowToAudit(recipients);

        // ── No match: Remove any stale badge ──
        if (!auditEntry) {
          const staleBadge = row.querySelector('.tickk-status-badge');
          if (staleBadge) staleBadge.remove();
          return;
        }

        // ── Check for existing badge ──
        const existingBadge = row.querySelector('.tickk-status-badge');
        const newOpenCount  = parseInt(auditEntry.open_count, 10) || 0;
        const newStatus     = (auditEntry.status || '').toUpperCase();

        if (existingBadge) {
          // Badge exists — check if data has changed
          const oldOpenCount = parseInt(existingBadge.dataset.tickkOpenCount, 10) || 0;
          const oldStatus    = existingBadge.dataset.tickkStatus || '';

          if (oldOpenCount === newOpenCount && oldStatus === newStatus) {
            return; // No change — skip DOM write
          }

          // Data changed — remove old badge and re-inject
          existingBadge.remove();
          updated++;
        } else {
          injected++;
        }

        // ── Create and inject the badge ──
        const badge = createStatusBadge(auditEntry);

        // Find the best injection anchor in the row:
        // We want to target the "To:" column which is typically inside `.yW` or `.bA4` (the sender/recipient cell)
        // By injecting as the first child of this container, it appears right before the "To:" label
        const participantCell = row.querySelector('.yW') || row.querySelector('.bA4');

        if (participantCell) {
          // Prepend to the participant container
          participantCell.insertBefore(badge, participantCell.firstChild);
        } else {
          // Fallback: append to the beginning of the subject line container
          const subjectEl = row.querySelector('.bog') || row.querySelector('.bqe') || row.querySelector('.xT');
          if (subjectEl) {
            const innerSpan = subjectEl.querySelector('span') || subjectEl;
            innerSpan.parentElement.insertBefore(badge, innerSpan);
          }
        }
      } catch (rowError) {
        // Silently skip problematic rows — never break Gmail
      }
    });

    if (injected > 0 || updated > 0) {
      console.log(`[TICKK Ticks] Scan complete — ${injected} new badges, ${updated} updated`);
    }
  } catch (error) {
    console.error('[TICKK Ticks] Row scan error:', error.message);
  }
}

// ──────────────────────────────────────────
// ORCHESTRATOR — Debounced Scan Trigger
// ──────────────────────────────────────────
// Called by MutationObserver and periodic timer. Debounces to
// prevent rapid-fire DOM scans during Gmail's virtual scroll
// recycling and mutation storms.
function triggerTickScan() {
  if (tickkScanTimer) clearTimeout(tickkScanTimer);
  tickkScanTimer = setTimeout(async () => {
    await fetchAndCacheAuditData();
    scanAndInjectTicks();
  }, TICKK_SCAN_DEBOUNCE);
}

// ──────────────────────────────────────────
// OBSERVER — Gmail Email List Mutations
// ──────────────────────────────────────────
// Watches for changes in the email list container. Gmail uses
// virtual scrolling — rows are recycled as the user scrolls,
// so we need to re-scan on every DOM mutation in the list area.
function initTicksObserver() {
  try {
    // Gmail's main content area where email rows live
    // Multiple selectors for resilience across Gmail versions
    const listContainer = document.querySelector('[role="main"]') ||
      document.querySelector('.AO') ||
      document.querySelector('.nH');

    if (!listContainer) {
      // Gmail hasn't fully loaded yet — retry after a short delay
      setTimeout(initTicksObserver, 2000);
      return;
    }

    const ticksObserver = new MutationObserver((mutations) => {
      // Only trigger if actual child nodes changed (not just attributes)
      const hasRelevantMutation = mutations.some((m) =>
        m.type === 'childList' && m.addedNodes.length > 0
      );
      if (hasRelevantMutation) {
        triggerTickScan();
      }
    });

    ticksObserver.observe(listContainer, {
      childList: true,
      subtree: true,
    });

    console.log('[TICKK Ticks] Email list observer attached');

    // Also watch for Gmail navigation (Inbox → Sent → etc.)
    // Gmail changes the hash — we detect this to re-scan
    let lastHash = window.location.hash;
    const hashObserver = setInterval(() => {
      if (window.location.hash !== lastHash) {
        lastHash = window.location.hash;
        console.log('[TICKK Ticks] Gmail navigation detected — re-scanning');
        // Force a fresh fetch on navigation (user might switch to Sent)
        tickkLastFetchTime = 0;
        triggerTickScan();
      }
    }, 1000);

  } catch (error) {
    console.error('[TICKK Ticks] Observer init error:', error.message);
  }
}

// ──────────────────────────────────────────
// PERIODIC REFRESH — Catch Open Status Updates
// ──────────────────────────────────────────
// Even without DOM changes, open_count can change as recipients
// open emails. This timer ensures badges stay current.
function initTicksPeriodicRefresh() {
  setInterval(async () => {
    try {
      // Force a fresh fetch by clearing the throttle
      tickkLastFetchTime = 0;
      await fetchAndCacheAuditData();
      scanAndInjectTicks();
      console.log('[TICKK Ticks] Periodic refresh complete');
    } catch (error) {
      console.error('[TICKK Ticks] Periodic refresh error:', error.message);
    }
  }, 60000); // Every 60 seconds
}

// ==========================================
// MASTER BOOTSTRAP — Initialize All Modules
// ==========================================
// Single unified observer for compose detection + tick injection.
// Separated concerns: compose observer fires on dialog mutations,
// ticks observer fires on email list mutations.
// ==========================================
try {
  // ── Compose Window Observer (Module 2 + 3) ──
  const composeObserver = new MutationObserver(() => {
    try {
      const composeWindows = document.querySelectorAll('.M9, .AD, [role="dialog"]');
      composeWindows.forEach(setupOutboundAudit);
    } catch (error) {
      console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
    }
  });

  composeObserver.observe(document.body, { childList: true, subtree: true });

  // Initial scan for any compose windows already present
  document.querySelectorAll('.M9, .AD, [role="dialog"]').forEach(setupOutboundAudit);

  // ── Visual Ticks Engine (Module 4) ──
  // Delay initialization slightly to let Gmail finish rendering
  setTimeout(() => {
    injectToggleStyles(); // Ensure tick CSS is injected
    initTicksObserver();
    initTicksPeriodicRefresh();
    // Initial tick scan
    triggerTickScan();
    console.log('[TICKK Ticks] Visual ticks engine initialized');
  }, 3000);

} catch (error) {
  console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
}