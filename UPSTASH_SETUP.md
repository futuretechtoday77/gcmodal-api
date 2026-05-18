# Upstash Setup Instructions

You need to add 3 environment variables to Vercel for the security fixes to work.

## Step 1: Get Upstash Redis Credentials

1. Go to https://console.upstash.com/
2. Click **Create Database**
3. Name: `gcmodal-ratelimit`
4. Region: Choose closest to your users (e.g., US-East)
5. Type: Regional (free tier)
6. Click **Create**
7. On the database page, scroll down to **REST API**
8. Copy these two values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 2: Generate JWT Secret

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Copy the output (it will look like: `XyZ123abc...`)

## Step 3: Add Environment Variables to Vercel

### Option A: Via Vercel CLI (Fastest)

```bash
cd ~/.openclaw/workspace/gcmodal-api

# Add Upstash URL
vercel env add UPSTASH_REDIS_REST_URL production
# Paste the URL when prompted

# Add Upstash Token
vercel env add UPSTASH_REDIS_REST_TOKEN production
# Paste the token when prompted

# Add JWT Secret
vercel env add JWT_SECRET production
# Paste the generated secret when prompted

# Redeploy
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Go to https://vercel.com/futuretechtoday77s-projects/gcmodal-api/settings/environment-variables
2. Click **Add New**
3. Add these three variables (one at a time):

**Variable 1:**
- Name: `UPSTASH_REDIS_REST_URL`
- Value: (paste URL from Upstash)
- Environment: Production

**Variable 2:**
- Name: `UPSTASH_REDIS_REST_TOKEN`
- Value: (paste token from Upstash)
- Environment: Production

**Variable 3:**
- Name: `JWT_SECRET`
- Value: (paste generated secret)
- Environment: Production

4. Click **Save** for each
5. Redeploy the project

## Step 4: Verify Setup

After deploying, test the endpoints:

**Test rate limiting:**
```bash
# Submit 6 times quickly - 6th should fail with 429
for i in {1..6}; do
  curl -X POST https://gcmodal-api.vercel.app/api/submit \
    -H "Content-Type: application/json" \
    -d '{"popupId":"test","email":"test@example.com"}'
  sleep 1
done
```

**Test email validation:**
```bash
# Should fail with "Invalid email address"
curl -X POST https://gcmodal-api.vercel.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{"popupId":"test","email":"not-an-email"}'
```

**Test login rate limiting:**
```bash
# Try 4 wrong passwords - 4th should fail with 429
for i in {1..4}; do
  curl -X POST https://gcmodal-api.vercel.app/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"password":"wrong"}'
done
```

**Test upload auth:**
```bash
# Should fail with 401 Unauthorized
curl -X POST https://gcmodal-api.vercel.app/api/upload \
  -F "file=@test.jpg"
```

## Troubleshooting

**If rate limiting doesn't work:**
- Check Vercel logs for "Rate limiting disabled" warning
- Verify env vars are spelled correctly
- Ensure Upstash database is active
- Try redeploying

**If JWT errors occur:**
- Check JWT_SECRET is set
- Verify it's at least 32 characters
- Clear browser localStorage and log in again

**Cost:**
- Upstash Free Tier: 10,000 requests/day (plenty for popup forms)
- No credit card required
