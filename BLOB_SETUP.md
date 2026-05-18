# Vercel Blob Storage Setup

Image upload requires Vercel Blob Storage to be enabled.

## Quick Setup (via Vercel Dashboard)

1. Go to https://vercel.com/futuretechtoday77s-projects/gcmodal-api
2. Click **Storage** tab
3. Click **Create Database** → Select **Blob**
4. Name it: `gcmodal-images`
5. Click **Create**
6. Vercel automatically adds `BLOB_READ_WRITE_TOKEN` to your project

## Verify Setup

After connecting Blob Storage, redeploy:

```bash
cd ~/.openclaw/workspace/gcmodal-api
vercel --prod
```

Then test upload in admin dashboard!

## Alternative: Manual Token (if needed)

If Vercel doesn't auto-create the token:

1. Go to Storage tab
2. Copy the token shown
3. Add to environment variables:
   ```bash
   vercel env add BLOB_READ_WRITE_TOKEN production
   ```
4. Paste token when prompted
5. Redeploy

## Storage Limits

**Free Plan:**
- 1 GB storage
- Unlimited bandwidth
- Automatic CDN delivery

**Upgrade if needed:**
- Pro: 100 GB ($0.15/GB after)
- Enterprise: Custom

## Test Upload

After setup:
1. Go to https://gcmodal-api.vercel.app/admin
2. Edit a popup
3. Click "Choose File" under Image section
4. Upload an image (max 5MB)
5. Should see ✅ success message
6. Image URL automatically filled in
