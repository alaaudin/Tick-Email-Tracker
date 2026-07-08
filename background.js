// ==========================================
// TICKK OUTBOUND AUDIT — BACKGROUND SERVICE WORKER
// ==========================================
// Clean message relay between content script and the backend.
// Proxies fetch() calls for /register and /emails endpoints.
// ==========================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Action 1: Register outbound audit entry
  if (message.action === "registerAudit") {
    (async () => {
      try {
        const response = await fetch('https://tick-email-tracker.onrender.com/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: message.token, recipient: message.recipient, user_id: message.user_id })
        });

        if (!response.ok) {
          console.error("Audit registration failed | HTTP Status:", response.status, "| StatusText:", response.statusText);
          sendResponse({ success: false, error: `HTTP ${response.status}: ${response.statusText}` });
          return;
        }

        const data = await response.json();
        sendResponse({ success: true, data });
      } catch (error) {
        console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  // Action 2: Fetch all audit logs for the user
  if (message.action === "getAuditLogs") {
    (async () => {
      try {
        const response = await fetch('https://tick-email-tracker.onrender.com/emails?user_id=700dfa91-2d97-431a-b96b-ff9faabdcd27');

        if (!response.ok) {
          console.error("Audit log fetch failed | HTTP Status:", response.status, "| StatusText:", response.statusText);
          sendResponse({ success: false, error: `HTTP ${response.status}: ${response.statusText}` });
          return;
        }

        const data = await response.json();
        sendResponse(data);
      } catch (error) {
        console.error("Error Name:", error.name, "| Details:", error.message, "| Stack:", error.stack);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }
});
