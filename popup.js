// ==========================================
// TICKK OUTBOUND AUDIT — POPUP CONTROLLER v2.1
// ==========================================
// Phase 1: Multi-Tenant Auth Gate + Beta Feedback Engine
//
// ★ Dual-state popup: Auth Gate ↔ Dashboard
// ★ Session persisted in chrome.storage.local
// ★ "Samosa jal gaya" easter egg with confetti
// ★ Does NOT call backend endpoints directly — all network
//   requests are proxied through the background service worker
//   to comply with Manifest V3 CSP restrictions.
//
// ★ Data contract from /emails endpoint:
//   { success: true, emails: [ { token, recipient, status,
//     open_count, link_clicks, created_at, opened_at, ... } ] }
// ==========================================

'use strict';

// ──────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────
const CONFIG = Object.freeze({
  CONSOLE_URL:       'https://tick-mail-tracker.vercel.app',
  FEED_MAX_ITEMS:    5,
  STORAGE_KEY:       'tickk_tracking_enabled',
  SESSION_KEY:       'tickk_user_session',
  BURNOUT_LOG_KEY:   'tickk_burnout_logs',
  EASTER_EGG_CODE:   'Samosa jal gaya',
});

// ──────────────────────────────────────────
// DOM REFERENCES (deferred — resolved after DOMContentLoaded)
// ──────────────────────────────────────────
let DOM = {};

function resolveDOMRefs() {
  DOM = Object.freeze({
    // Auth gate
    authGate:             document.getElementById('authGate'),
    authForm:             document.getElementById('authForm'),
    authEmail:            document.getElementById('authEmail'),
    authPassword:         document.getElementById('authPassword'),
    authConfirmPassword:  document.getElementById('authConfirmPassword'),
    confirmPasswordGroup: document.getElementById('confirmPasswordGroup'),
    authError:            document.getElementById('authError'),
    authSubmitBtn:        document.getElementById('authSubmitBtn'),
    tabLogin:             document.getElementById('tabLogin'),
    tabSignup:            document.getElementById('tabSignup'),

    // Session bar
    sessionBar:           document.getElementById('sessionBar'),
    sessionAvatar:        document.getElementById('sessionAvatar'),
    sessionEmail:         document.getElementById('sessionEmail'),
    logoutBtn:            document.getElementById('logoutBtn'),

    // Dashboard
    dashboardContent:     document.getElementById('dashboardContent'),
    metricDispatched:     document.getElementById('metricDispatched'),
    metricOpens:          document.getElementById('metricOpens'),
    feedScroll:           document.getElementById('feedScroll'),
    feedEmpty:            document.getElementById('feedEmpty'),
    trackingToggle:       document.getElementById('trackingToggle'),
    toggleStatus:         document.getElementById('toggleStatus'),
    statusDot:            document.getElementById('statusDot'),
    statusLabel:          document.getElementById('statusLabel'),
    errorBanner:          document.getElementById('errorBanner'),
    errorMessage:         document.getElementById('errorMessage'),
    openConsole:          document.getElementById('openConsole'),

    // Burnout feedback
    burnoutTriggerAuth:   document.getElementById('burnoutTriggerAuth'),
    burnoutTriggerDash:   document.getElementById('burnoutTriggerDash'),
    burnoutOverlay:       document.getElementById('burnoutOverlay'),
    burnoutClose:         document.getElementById('burnoutClose'),
    burnoutCancel:        document.getElementById('burnoutCancel'),
    burnoutSubmit:        document.getElementById('burnoutSubmit'),
    burnoutInput:         document.getElementById('burnoutInput'),
    burnoutFormSection:   document.getElementById('burnoutFormSection'),
    burnoutSuccess:       document.getElementById('burnoutSuccess'),

    // Easter egg
    easterEggOverlay:     document.getElementById('easterEggOverlay'),
    easterEggDismiss:     document.getElementById('easterEggDismiss'),
    confettiCanvas:       document.getElementById('confettiCanvas'),
  });
}

// ──────────────────────────────────────────
// UTILITY — Time Formatting
// ──────────────────────────────────────────
function formatRelativeTime(isoString) {
  try {
    const now  = Date.now();
    const then = new Date(isoString).getTime();
    if (isNaN(then)) return '—';
    const diff = Math.max(0, now - then);

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60)   return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)   return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)     return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return '—';
  }
}

// ──────────────────────────────────────────
// UTILITY — Safe Number Display
// ──────────────────────────────────────────
function formatMetric(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000)    return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

// ──────────────────────────────────────────
// UTILITY — HTML Escape
// ──────────────────────────────────────────
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ──────────────────────────────────────────
// UTILITY — Generate Mock Session Token
// ──────────────────────────────────────────
function generateSessionToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// ══════════════════════════════════════════
// AUTH GATE — Session Management
// ══════════════════════════════════════════
let currentAuthMode = 'login'; // 'login' | 'signup'

async function checkSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get([CONFIG.SESSION_KEY], (result) => {
      const session = result[CONFIG.SESSION_KEY];
      if (session && session.token && session.email) {
        resolve(session);
      } else {
        resolve(null);
      }
    });
  });
}

function saveSession(session) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [CONFIG.SESSION_KEY]: session }, resolve);
  });
}

function clearSession() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(CONFIG.SESSION_KEY, resolve);
  });
}

// ──────────────────────────────────────────
// AUTH — UI State Transitions
// ──────────────────────────────────────────
function showAuthGate() {
  DOM.authGate.classList.add('visible');
  DOM.dashboardContent.classList.remove('visible');
  DOM.sessionBar.classList.remove('visible');
}

function showDashboard(session) {
  DOM.authGate.classList.remove('visible');
  DOM.dashboardContent.classList.add('visible');
  DOM.sessionBar.classList.add('visible');

  // Populate session bar
  const initials = session.email
    .split('@')[0]
    .substring(0, 2)
    .toUpperCase();
  DOM.sessionAvatar.textContent = initials;
  DOM.sessionEmail.textContent = session.email;
}

// ──────────────────────────────────────────
// AUTH — Tab Switching
// ──────────────────────────────────────────
function initAuthTabs() {
  DOM.tabLogin.addEventListener('click', () => switchAuthTab('login'));
  DOM.tabSignup.addEventListener('click', () => switchAuthTab('signup'));
}

function switchAuthTab(mode) {
  currentAuthMode = mode;
  DOM.authError.classList.remove('visible');
  DOM.authError.textContent = '';

  if (mode === 'login') {
    DOM.tabLogin.classList.add('active');
    DOM.tabSignup.classList.remove('active');
    DOM.confirmPasswordGroup.style.display = 'none';
    DOM.authSubmitBtn.textContent = 'Authenticate';
  } else {
    DOM.tabLogin.classList.remove('active');
    DOM.tabSignup.classList.add('active');
    DOM.confirmPasswordGroup.style.display = 'block';
    DOM.authSubmitBtn.textContent = 'Create Account';
  }
}

// ──────────────────────────────────────────
// AUTH — Form Submission (Mock Supabase Flow)
// ──────────────────────────────────────────
function initAuthForm() {
  DOM.authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    DOM.authError.classList.remove('visible');

    const email = DOM.authEmail.value.trim();
    const password = DOM.authPassword.value;

    // ── Validation ──
    if (!email || !password) {
      showAuthError('Please fill in all fields.');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAuthError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      showAuthError('Password must be at least 6 characters.');
      return;
    }

    if (currentAuthMode === 'signup') {
      const confirmPassword = DOM.authConfirmPassword.value;
      if (password !== confirmPassword) {
        showAuthError('Passwords do not match.');
        return;
      }
    }

    // ── Mock Auth — Simulate Supabase response delay ──
    DOM.authSubmitBtn.textContent = '⟳ Authenticating…';
    DOM.authSubmitBtn.disabled = true;

    await new Promise((r) => setTimeout(r, 800));

    // Generate mock session token (will be replaced with real Supabase later)
    const session = {
      token: generateSessionToken(),
      email: email,
      created_at: new Date().toISOString(),
      auth_provider: 'mock_supabase',
    };

    await saveSession(session);

    DOM.authSubmitBtn.textContent = currentAuthMode === 'login' ? 'Authenticate' : 'Create Account';
    DOM.authSubmitBtn.disabled = false;

    // Transition to dashboard
    showDashboard(session);
    loadDashboardData();
  });
}

function showAuthError(message) {
  DOM.authError.textContent = message;
  DOM.authError.classList.add('visible');
}

// ──────────────────────────────────────────
// AUTH — Logout
// ──────────────────────────────────────────
function initLogout() {
  DOM.logoutBtn.addEventListener('click', async () => {
    await clearSession();
    showAuthGate();

    // Reset form
    DOM.authForm.reset();
    switchAuthTab('login');
  });
}

// ══════════════════════════════════════════
// CORE — Fetch Audit Data via Background SW
// ══════════════════════════════════════════
async function fetchAuditData() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'getAuditLogs' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      // Background.js forwards the raw JSON from /emails endpoint.
      // Expected shape: { success: true, emails: [...] }
      // Guard against all failure shapes:
      if (!response) {
        reject(new Error('No response from background service worker'));
        return;
      }
      if (response.success === false) {
        reject(new Error(response.error || 'Backend returned failure'));
        return;
      }

      resolve(response);
    });
  });
}

// ──────────────────────────────────────────
// RENDER — Metric Counter Cards
// ──────────────────────────────────────────
function renderMetrics(emails) {
  // Total dispatched = total rows in the tracked_emails table
  const totalDispatched = Array.isArray(emails) ? emails.length : 0;

  // Confirmed opens = rows where open_count > 0
  // This is the actual Supabase column name per server.js schema
  const confirmedOpens = Array.isArray(emails)
    ? emails.filter((e) => {
        const openCount = parseInt(e.open_count, 10);
        return !isNaN(openCount) && openCount > 0;
      }).length
    : 0;

  // Remove loading shimmer
  DOM.metricDispatched.classList.remove('loading');
  DOM.metricOpens.classList.remove('loading');

  // Animate count-up
  animateCounter(DOM.metricDispatched, totalDispatched);
  animateCounter(DOM.metricOpens, confirmedOpens);
}

function animateCounter(element, target) {
  const duration = 600;
  const start    = performance.now();
  const initial  = parseInt(element.textContent) || 0;

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = Math.round(initial + (target - initial) * eased);
    element.textContent = formatMetric(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ──────────────────────────────────────────
// RENDER — Live Audit Signal Feed (Latest 5)
// ──────────────────────────────────────────
function renderFeed(emails) {
  if (!Array.isArray(emails) || emails.length === 0) {
    DOM.feedEmpty.style.display = 'flex';
    return;
  }

  DOM.feedEmpty.style.display = 'none';

  // Backend already returns descending by created_at,
  // but sort defensively and take only the latest 5.
  const latest = [...emails]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, CONFIG.FEED_MAX_ITEMS);

  // Build feed DOM via DocumentFragment for single reflow
  const fragment = document.createDocumentFragment();

  latest.forEach((entry) => {
    const item      = document.createElement('div');
    item.className  = 'feed-item';

    // Determine signal type from actual Supabase columns
    const openCount  = parseInt(entry.open_count, 10) || 0;
    const linkClicks = parseInt(entry.link_clicks, 10) || 0;
    const status     = (entry.status || '').toUpperCase();

    let signalType, signalLabel;
    if (linkClicks > 0) {
      signalType  = 'click';
      signalLabel = 'CLICK';
    } else if (openCount > 0 || status === 'OPENED') {
      signalType  = 'open';
      signalLabel = 'OPENED';
    } else if (status === 'DELIVERED') {
      signalType  = 'dispatched';
      signalLabel = 'DELIVERED';
    } else {
      signalType  = 'dispatched';
      signalLabel = 'SENT';
    }

    const recipient = entry.recipient || 'Unknown recipient';
    const timestamp = entry.opened_at || entry.created_at || '';

    item.innerHTML = `
      <div class="feed-signal-dot ${signalType}"></div>
      <div class="feed-content">
        <div class="feed-recipient" title="${escapeHTML(recipient)}">${escapeHTML(recipient)}</div>
        <div class="feed-meta">
          <span class="feed-type ${signalType}">${signalLabel}</span>
          <span class="feed-timestamp">${formatRelativeTime(timestamp)}</span>
        </div>
      </div>
    `;

    fragment.appendChild(item);
  });

  // Clear any existing feed items (preserve the empty state element)
  const existingItems = DOM.feedScroll.querySelectorAll('.feed-item');
  existingItems.forEach((el) => el.remove());

  DOM.feedScroll.appendChild(fragment);
}

// ──────────────────────────────────────────
// STATUS — Connection & Error Handling
// ──────────────────────────────────────────
function setStatusActive() {
  DOM.statusDot.classList.remove('inactive');
  DOM.statusLabel.classList.remove('inactive');
  DOM.statusLabel.innerHTML = 'Engine <span>Active</span>';
  DOM.errorBanner.classList.remove('visible');
}

function setStatusError(message) {
  DOM.statusDot.classList.add('inactive');
  DOM.statusLabel.classList.add('inactive');
  DOM.statusLabel.innerHTML = 'Engine <span>Offline</span>';
  DOM.errorMessage.textContent = message || 'Unable to reach audit server.';
  DOM.errorBanner.classList.add('visible');

  // Clear loading state on error
  DOM.metricDispatched.classList.remove('loading');
  DOM.metricOpens.classList.remove('loading');
  DOM.metricDispatched.textContent = '—';
  DOM.metricOpens.textContent = '—';
}

// ──────────────────────────────────────────
// TOGGLE — Tracking Enable/Disable
// ──────────────────────────────────────────
function initToggle() {
  // Restore persisted state
  chrome.storage.local.get([CONFIG.STORAGE_KEY], (result) => {
    const isEnabled = result[CONFIG.STORAGE_KEY] !== false; // Default: enabled
    DOM.trackingToggle.checked = isEnabled;
    updateToggleUI(isEnabled);
  });

  // Handle state changes
  DOM.trackingToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;

    // Persist to chrome.storage
    chrome.storage.local.set({ [CONFIG.STORAGE_KEY]: isEnabled }, () => {
      updateToggleUI(isEnabled);

      // Broadcast state change to all active Gmail tabs
      chrome.tabs.query({ url: 'https://mail.google.com/*' }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'trackingStateChanged',
            enabled: isEnabled,
          }).catch(() => {
            // Tab may not have content script loaded — safe to ignore
          });
        });
      });
    });
  });
}

function updateToggleUI(isEnabled) {
  DOM.toggleStatus.textContent = isEnabled
    ? 'Pixel injection enabled'
    : 'Tracking paused';
}

// ──────────────────────────────────────────
// CONSOLE LINK
// ──────────────────────────────────────────
function initConsoleLink() {
  DOM.openConsole.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: CONFIG.CONSOLE_URL });
  });
}

// ══════════════════════════════════════════
// BETA FEEDBACK ENGINE — "SAMOSA JAL GAYA"
// ══════════════════════════════════════════

function initBurnoutEngine() {
  // Open overlay from either trigger (auth footer or dashboard footer)
  const openOverlay = () => {
    DOM.burnoutOverlay.classList.add('visible');
    DOM.burnoutFormSection.style.display = 'block';
    DOM.burnoutSuccess.classList.remove('visible');
    DOM.burnoutInput.value = '[TKS-CRASH]: ';
    // Focus at end of pre-filled text
    setTimeout(() => {
      DOM.burnoutInput.focus();
      DOM.burnoutInput.setSelectionRange(
        DOM.burnoutInput.value.length,
        DOM.burnoutInput.value.length
      );
    }, 100);
  };

  DOM.burnoutTriggerAuth.addEventListener('click', openOverlay);
  DOM.burnoutTriggerDash.addEventListener('click', openOverlay);

  // Close overlay
  const closeOverlay = () => {
    DOM.burnoutOverlay.classList.remove('visible');
  };

  DOM.burnoutClose.addEventListener('click', closeOverlay);
  DOM.burnoutCancel.addEventListener('click', closeOverlay);

  // Close on backdrop click
  DOM.burnoutOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.burnoutOverlay) closeOverlay();
  });

  // Submit burnout report
  DOM.burnoutSubmit.addEventListener('click', async () => {
    const rawValue = DOM.burnoutInput.value.trim();

    if (!rawValue || rawValue === '[TKS-CRASH]:' || rawValue === '[TKS-CRASH]: ') {
      // Nothing entered beyond the prefix
      DOM.burnoutInput.style.borderColor = 'var(--accent-rose)';
      setTimeout(() => {
        DOM.burnoutInput.style.borderColor = '';
      }, 1500);
      return;
    }

    // Extract the user message after prefix
    const userMessage = rawValue.replace(/^\[TKS-CRASH\]:\s*/, '').trim();

    // ── Log to chrome.storage (async, no network) ──
    const logEntry = {
      id: Date.now(),
      message: rawValue,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    };

    chrome.storage.local.get([CONFIG.BURNOUT_LOG_KEY], (result) => {
      const logs = result[CONFIG.BURNOUT_LOG_KEY] || [];
      logs.push(logEntry);
      // Keep only last 50 logs
      if (logs.length > 50) logs.splice(0, logs.length - 50);
      chrome.storage.local.set({ [CONFIG.BURNOUT_LOG_KEY]: logs });
    });

    console.info('[TKS Burnout Engine] Report filed:', logEntry);

    // ── Easter Egg Check ──
    if (userMessage.toLowerCase() === CONFIG.EASTER_EGG_CODE.toLowerCase()) {
      closeOverlay();
      triggerEasterEgg();
      return;
    }

    // ── Normal submission success ──
    DOM.burnoutFormSection.style.display = 'none';
    DOM.burnoutSuccess.classList.add('visible');

    setTimeout(() => {
      closeOverlay();
    }, 2000);
  });
}

// ══════════════════════════════════════════
// EASTER EGG — Confetti + Alert
// ══════════════════════════════════════════

function triggerEasterEgg() {
  // Show the overlay card
  DOM.easterEggOverlay.classList.add('visible');

  // Launch confetti
  launchConfetti();

  // Dismiss handler
  DOM.easterEggDismiss.addEventListener('click', () => {
    DOM.easterEggOverlay.classList.remove('visible');
    clearConfetti();
  }, { once: true });

  // Auto-dismiss after 6 seconds
  setTimeout(() => {
    DOM.easterEggOverlay.classList.remove('visible');
    clearConfetti();
  }, 6000);
}

// ──────────────────────────────────────────
// CONFETTI ENGINE (Canvas-based, lightweight)
// ──────────────────────────────────────────
let confettiParticles = [];
let confettiAnimId = null;

function launchConfetti() {
  const canvas = DOM.confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = 380;
  canvas.height = 600;
  canvas.style.display = 'block';

  const colors = [
    '#34d399', '#22d3ee', '#fbbf24', '#f87171',
    '#60a5fa', '#a78bfa', '#fb7185', '#4ade80',
  ];

  // Create 80 particles
  confettiParticles = [];
  for (let i = 0; i < 80; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
    });
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    confettiParticles.forEach((p) => {
      if (p.opacity <= 0) return;
      active = true;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.rotation += p.rotationSpeed;

      // Fade out as it falls past 80% of canvas
      if (p.y > canvas.height * 0.8) {
        p.opacity -= 0.02;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (active) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      clearConfetti();
    }
  }

  confettiAnimId = requestAnimationFrame(animateConfetti);
}

function clearConfetti() {
  if (confettiAnimId) {
    cancelAnimationFrame(confettiAnimId);
    confettiAnimId = null;
  }
  const canvas = DOM.confettiCanvas;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
  }
  confettiParticles = [];
}

// ══════════════════════════════════════════
// DASHBOARD DATA LOADER
// ══════════════════════════════════════════
async function loadDashboardData() {
  initToggle();
  initConsoleLink();

  try {
    const data = await fetchAuditData();

    // /emails returns { success: true, emails: [...] }
    // background.js forwards this shape directly via sendResponse(data)
    const emails = Array.isArray(data)
      ? data
      : (data.emails || data.data || []);

    setStatusActive();
    renderMetrics(emails);
    renderFeed(emails);
  } catch (error) {
    console.error('[TICKK Popup] Failed to load audit data:', error.message);
    setStatusError(error.message);
  }
}

// ══════════════════════════════════════════
// BOOTSTRAP — Main Initialization
// ══════════════════════════════════════════
async function init() {
  resolveDOMRefs();
  initAuthTabs();
  initAuthForm();
  initLogout();
  initBurnoutEngine();

  // Check for existing session
  const session = await checkSession();

  if (session) {
    // Session exists → show dashboard
    showDashboard(session);
    loadDashboardData();
  } else {
    // No session → show auth gate
    showAuthGate();
  }
}

// Fire on DOM ready
document.addEventListener('DOMContentLoaded', init);
