const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// ANTI-SELF-OPEN CACHES (Memory)
// ==========================================
// senderIpCache: Stores the sender's IP during /register to block
// the local DOM execution leak at dispatch time (RULE 1).
const senderIpCache = new Map();

// proxyFleetCache: Tracks the timestamp of the FIRST Google Proxy
// bot hit per token, creating a 4-second suppression window to
// absorb trailing edge-cache bots from the same fleet cluster.
const proxyFleetCache = new Map();

// ==========================================
// SUPABASE CONFIG — OUTBOUND AUDIT DATABASE
// ==========================================
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
        "FATAL: Missing required environment variables.\n",
        "  -> SUPABASE_URL:", SUPABASE_URL ? "SET" : "MISSING", "\n",
        "  -> SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY ? "SET" : "MISSING", "\n",
        "Please configure these in your Render dashboard under Environment Variables."
    );
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// HELPER: Return 1x1 Transparent Beacon (STRICT ANTI-CACHE)
// ==========================================
const returnBeacon = (res) => {
    try {
        const beaconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const imgBuffer = Buffer.from(beaconBase64, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': imgBuffer.length,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store',
            'Vary': '*',
            'X-Content-Type-Options': 'nosniff'
        });
        res.end(imgBuffer);
    } catch (error) {
        console.error("Backend Error in [returnBeacon]:", error.name, "|", error.message, "|", error.stack);
        res.status(500).end();
    }
};

// ==========================================
// 0. ROOT KEEP-ALIVE ENDPOINT — Cron-Job Ping
// ==========================================
// cron-job.org hits the naked root URL every 5 minutes to prevent
// Render's free-tier instance from spinning down due to inactivity.
// Without this handler, Express returns 404 and the cron service
// flags the job as a persistent failure and auto-deactivates it.
app.get('/', (req, res) => {
    res.status(200).send('TICKK Tracking Engine: Active and Awake 24/7!');
});

// ==========================================
// 1. REGISTER ENDPOINT — Outbound Audit Entry
// ==========================================
app.post('/register', async (req, res) => {
    const { token, recipient, user_id } = req.body;

    // ── Capture sender's IP for RULE 1 isolation ──
    let senderIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    if (senderIp && senderIp.includes(',')) senderIp = senderIp.split(',')[0].trim();
    if (senderIp) {
        senderIpCache.set(token, senderIp);
        // Clear after 24 hours to prevent memory leaks while covering
        // late Sent Folder self-opens from the sender's browser
        setTimeout(() => senderIpCache.delete(token), 24 * 60 * 60 * 1000);
    }

    // ── Input validation ──
    if (!token) {
        return res.status(400).json({ success: false, error: 'Audit token is required' });
    }
    if (!recipient) {
        return res.status(400).json({ success: false, error: 'Recipient is required' });
    }

    try {
        console.log(`\n[TICKK Audit] Registering outbound audit entry...`);
        console.log(`  -> Recipient: ${recipient} | Token: ${token} | User: ${user_id}`);

        // ── IDEMPOTENT UPSERT ──
        // Uses onConflict: 'token' so that retries from the client
        // are safe. Requires UNIQUE constraint on the 'token' column.
        const { error } = await supabase
            .from('tracked_emails')
            .upsert([{
                token: token,
                recipient: recipient,
                status: 'UNOPENED',
                user_id: user_id || null,
                created_at: new Date().toISOString()
            }], { onConflict: 'token', ignoreDuplicates: true });

        if (error) {
            console.error("Backend Error in [/register] DB Upsert:", error.name || 'SupabaseError', "|", error.message, "|", error.details || 'No details');
            return res.status(500).json({ success: false, error: error.message });
        }

        console.log("[TICKK Audit] Outbound audit entry registered successfully (idempotent).");
        res.status(201).json({ success: true });
    } catch (error) {
        console.error("Backend Error in [/register]:", error.name, "|", error.message, "|", error.stack);
        return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

// ==========================================
// 2. DELIVERY BEACON — REDIRECT GATEWAY
// ==========================================
// Google Image Proxy downloads images ONCE and caches them on its
// CDN. The only way to force re-fetches is to ensure Google Proxy
// NEVER receives a cacheable 200 from the pixel URL.
//
// This endpoint ALWAYS returns a 302 redirect to /track/open with
// a unique timestamp. 302 = temporary redirect; Google Proxy cannot
// resolve it to a cacheable image — it must follow fresh each time.
//
// NOTE: No user_id parameter. The token alone identifies the row.
// Appending user_id caused Google Proxy to forward the sender's
// identity on recipient-side pre-fetches, triggering false self-open
// blocks and permanently caching a blank image.
// ==========================================
app.get('/track', (req, res) => {
    const rawToken = req.query.id || req.query.token || '';

    console.log(`\n[TICKK Audit] Delivery beacon request → Redirecting to /track/open`);
    console.log(`  -> Token: ${rawToken} | Redirect timestamp: ${Date.now()}`);

    const redirectTarget = `/track/open?id=${encodeURIComponent(rawToken)}&_t=${Date.now()}`;

    res.writeHead(302, {
        'Location': redirectTarget,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    res.end();
});

// ==========================================
// 2b. DELIVERY BEACON — ACTUAL TRACKING ENDPOINT
// ==========================================
// Redirect target from /track. The &_t= timestamp ensures Google
// Proxy treats each request as a new resource.
//
// STATE MACHINE RULES:
//   RULE 1: Sender IP Isolation — block opens from the sender's IP
//   RULE 2: Microsecond DOM Shield — block sub-1.5s non-proxy hits
//   RULE 3: Proxy Fleet Cluster Filter — handle GoogleImageProxy:
//     3a: UNOPENED → DELIVERED (first proxy bot, 4s window opens)
//     3b: Within 4s fleet window → suppress trailing bots
//     3c: After 4s (or on OPENED state) → pass to RULE 4 as human
//   RULE 4: Genuine Human Open — record engagement
// ==========================================
app.get('/track/open', async (req, res) => {
    const rawToken = req.query.id || req.query.token || '';
    const auditTokenId = rawToken.trim();
    console.log(`[TICKK Audit] /track/open hit | Token: ${auditTokenId} | _t: ${req.query._t}`);

    if (!auditTokenId || auditTokenId === 'undefined' || auditTokenId === 'null') return returnBeacon(res);

    try {
        // ── 1. DB LOOKUP (with retry) ──
        let existingEntry = null;
        for (let attempt = 0; attempt < 4; attempt++) {
            try {
                const { data } = await supabase
                    .from('tracked_emails')
                    .select('id, status, created_at, open_count, opened_history')
                    .eq('token', auditTokenId)
                    .maybeSingle();
                if (data) { existingEntry = data; break; }
            } catch (retryError) {
                console.error("Backend Error in [/track/open] DB Lookup Attempt", attempt + 1, ":", retryError.message);
            }
            if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (!existingEntry) {
            console.log("[TICKK Audit] Audit token not found in database. Returning beacon.");
            return returnBeacon(res);
        }

        // ── 2. STATE MACHINE CONTEXT ──
        const userAgent = req.headers['user-agent'] || '';
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

        const isGoogleNetwork = ip && (ip.startsWith('209.85.') || ip.startsWith('142.250.') || ip.startsWith('74.125.'));
        const isMachineProxy = userAgent.includes('GoogleImageProxy') || userAgent.includes('YahooCacheSystem') || isGoogleNetwork;
        const isSenderIp = ip && senderIpCache.get(auditTokenId) === ip;
        const timeSinceCreation = Date.now() - new Date(existingEntry.created_at).getTime();
        const currentState = existingEntry.status; // 'UNOPENED', 'DELIVERED', 'OPENED'

        console.log(`[TICKK Audit] State Machine | IP: ${ip} | UA: ${userAgent.substring(0, 80)} | Proxy: ${isMachineProxy} | GoogleNet: ${!!isGoogleNetwork} | SenderIP: ${!!isSenderIp} | State: ${currentState} | Age: ${timeSinceCreation}ms`);

        // ── RULE 1: SENDER IP ISOLATION ──
        // The sender's IP was captured during /register. If this request
        // originates from the same IP, it's the sender viewing their own
        // Sent Folder or the local DOM execution at dispatch time.
        // This is the ONLY self-open guard needed — no user_id URL check.
        if (isSenderIp) {
            console.log(`[TICKK Audit] RULE 1 Triggered: Blocked false open from known sender IP (${ip}).`);
            return returnBeacon(res);
        }

        // ── RULE 2: MICROSECOND INJECTION SHIELD ──
        // Only for non-proxy agents. If a non-proxy request arrives within
        // 1.5 seconds of email creation, it's physically impossible for a
        // human to have received and opened it. This catches edge cases
        // where the sender's IP shifts (rapid IPv6 rotation) and RULE 1
        // misses the local DOM reflection.
        if (!isMachineProxy && timeSinceCreation < 1500) {
            console.log(`[TICKK Audit] RULE 2 Triggered: Blocked microsecond DOM leak (Time: ${timeSinceCreation}ms).`);
            return returnBeacon(res);
        }

        // ── RULE 3: SMART PROXY FLEET CLUSTER FILTER ──
        // Google Image Proxy sends multiple bots from its fleet when it
        // pre-fetches images in a delivered email. We use a 4-second
        // suppression window to absorb trailing bots from the same cluster.
        if (isMachineProxy) {
            if (currentState === 'UNOPENED') {
                // ── RULE 3a: First proxy contact. Email was delivered. ──
                // Flip UNOPENED → DELIVERED and open the 4s fleet window.
                console.log(`[TICKK Audit] RULE 3a: Initial proxy handshake. Flipping UNOPENED → DELIVERED.`);

                proxyFleetCache.set(auditTokenId, Date.now());
                setTimeout(() => proxyFleetCache.delete(auditTokenId), 10000); // 10s TTL for safety

                const { error: updateError } = await supabase
                    .from('tracked_emails')
                    .update({ status: 'DELIVERED' })
                    .eq('id', existingEntry.id);

                if (updateError) {
                    console.error("Backend Error in [/track/open] DB Update (DELIVERED):", updateError.message);
                } else {
                    console.log(`[TICKK Audit] Entry ID ${existingEntry.id} status → DELIVERED (blue badge)`);
                }
                // Return 204 No Content — Google Proxy refuses to cache
                // empty 204 responses for <img> tags. This forces a fresh
                // live fetch when the actual human recipient opens the email.
                return res.status(204).end();
            }

            // State is DELIVERED or OPENED — check fleet cache window
            const firstDeliveryTime = proxyFleetCache.get(auditTokenId);
            if (firstDeliveryTime && (Date.now() - firstDeliveryTime < 4000)) {
                // ── RULE 3b: Within 4s of first proxy hit. ──
                // This is a trailing edge-cache bot from the same fleet.
                console.log(`[TICKK Audit] RULE 3b: Suppressed trailing proxy bot (${Date.now() - firstDeliveryTime}ms since first delivery).`);
                return returnBeacon(res);
            }

            // ── RULE 3c: Proxy hit AFTER 4s window (or cache expired). ──
            // This is a genuine human opening the email in Gmail, routed
            // through Google Image Proxy. Fall through to RULE 4.
            console.log(`[TICKK Audit] RULE 3c: Proxy fetch after fleet window — genuine human Gmail open. Passing to RULE 4.`);
        }

        // ── RULE 4: GENUINE HUMAN OPEN ──
        // Reached when:
        //   A) A non-proxy client directly opened the email (Apple Mail, Outlook, etc.)
        //   B) Google Proxy is routing a subsequent human fetch (RULE 3c pass-through)
        console.log(`[TICKK Audit] RULE 4: Genuine human open detected! Recording engagement.`);

        // ── Geo-location lookup (best-effort, non-blocking to response) ──
        let city = null;
        let country = null;

        if (ip) {
            try {
                const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData.status === 'success') {
                        city = geoData.city;
                        country = geoData.country;
                    }
                }
            } catch (geoError) {
                console.error("Error in [Geo-Location Lookup]:", geoError.message);
            }
        }

        const currentOpens = existingEntry.open_count || 0;
        const currentHistory = Array.isArray(existingEntry.opened_history) ? existingEntry.opened_history : [];
        const newTimestamp = new Date().toISOString();

        currentHistory.push(newTimestamp);

        const updateData = {
            status: 'OPENED',
            opened_at: newTimestamp,
            open_count: currentOpens + 1,
            opened_history: currentHistory,
            ip_address: ip
        };

        if (city) updateData.city = city;
        if (country) updateData.country = country;

        const { error: updateError } = await supabase
            .from('tracked_emails')
            .update(updateData)
            .eq('id', existingEntry.id);

        if (updateError) {
            console.error("Backend Error in [/track/open] DB Update (OPENED):", updateError.message);
        } else {
            console.log(`[TICKK Audit] ✅ Open confirmed! Entry ID ${existingEntry.id} → OPENED | Opens: ${updateData.open_count} | Location: ${city || 'Unknown'}, ${country || 'Unknown'}`);
        }

        return returnBeacon(res);
    } catch (error) {
        console.error("Backend Error in [/track/open]:", error.message, error.stack);
        return returnBeacon(res);
    }
});

// ==========================================
// 3. AUDIT LOG ENDPOINT — Fetch User's Outbound Logs
// ==========================================
app.get('/emails', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id || user_id === 'undefined' || user_id === 'null') {
        return res.json({ success: true, emails: [] });
    }

    try {
        console.log(`[TICKK Audit] Fetching audit logs for user: ${user_id}`);

        const { data, error } = await supabase
            .from('tracked_emails')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Backend Error in [/emails] DB Fetch:", error.name || 'SupabaseError', "|", error.message, "|", error.details || 'No details');
            return res.status(500).json({ success: false, error: error.message });
        }

        console.log(`[TICKK Audit] Returned ${data.length} audit log entries.`);
        res.json({ success: true, emails: data });
    } catch (error) {
        console.error("Backend Error in [/emails]:", error.name, "|", error.message, "|", error.stack);
        return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
});

// ==========================================
// 4. LINK TRACKING ENDPOINT — /audit-click & /v (branded alias)
// ==========================================
const handleAuditClick = async (req, res) => {
    const { token, url } = req.query;

    if (!token || !url) {
        console.error("[TICKK Audit] Click rejected: Missing token or target URL");
        return res.status(400).send("Bad Request");
    }

    const decodedUrl = decodeURIComponent(url);
    console.log(`\n[TICKK Audit] Link click intercepted | Token: ${token}`);

    try {
        // 1. Fetch the existing audit record safely
        const { data: existingEntry, error: fetchError } = await supabase
            .from('tracked_emails')
            .select('*')
            .eq('token', token)
            .single();

        if (fetchError || !existingEntry) {
            console.error(`[TICKK Audit] DB Fetch failed or token not found for click: ${token}`);
            return res.redirect(decodedUrl);
        }

        // 2. Safely parse and increment counters
        //    Use 'open_count' — the actual column name in tracked_emails
        const currentClicks = parseInt(existingEntry.link_clicks || 0, 10);
        const currentOpens = parseInt(existingEntry.open_count || 0, 10);

        // 3. Prepare pristine atomic update payload
        let updatePayload = {
            link_clicks: currentClicks + 1
        };

        // Fallback: If opens count is 0 or null, force status confirmation and set open_count to 1
        // A link click is mathematical proof the email was opened — if the pixel
        // was blocked by corporate filters, this corrects the data gap.
        if (currentOpens < 1) {
            updatePayload.status = 'OPENED';
            updatePayload.open_count = 1;
            updatePayload.opened_at = new Date().toISOString();
            console.log(`[TICKK Audit] Fallback active: Forcing status to OPENED and open_count to 1 for token: ${token}`);
        } else if (existingEntry.status !== 'OPENED') {
            // Opens exist but status never flipped (edge case)
            updatePayload.status = 'OPENED';
            updatePayload.opened_at = new Date().toISOString();
            console.log(`[TICKK Audit] Link click promoting status → OPENED (fallback) | Token: ${token}`);
        }

        // 4. Execute the update query cleanly
        const { error: updateError } = await supabase
            .from('tracked_emails')
            .update(updatePayload)
            .eq('token', token);

        if (updateError) {
            console.error(`[TICKK Audit] Database update execution failed: ${updateError.message}`);
        } else {
            console.log(`[TICKK Audit] Link click recorded successfully. Total Clicks: ${currentClicks + 1}`);
        }

    } catch (err) {
        console.error(`[TICKK Audit] Fatal tracking exception in click pipeline: ${err.message}`);
    }

    // Always ensure the user gets redirected smoothly no matter what happens in the DB pipeline
    return res.redirect(decodedUrl);
};

app.get('/audit-click', handleAuditClick);
app.get('/v', handleAuditClick);

// ==========================================
// SERVER BOOT
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[TICKK Audit] Backend server ready on port ${PORT}`);
    console.log(`[TICKK Audit] Supabase connection: ACTIVE`);
    console.log(`[TICKK Audit] Self-open guards: RULE 1 (Sender IP) + RULE 2 (Microsecond Shield)`);
    console.log(`[TICKK Audit] Proxy handling: RULE 3 (Fleet Cluster Filter, 4s window)`);
});