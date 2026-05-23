# GC Modal API - Beta Version

**Version:** 2.8.8-beta.20
**Status:** PRODUCTION READY BETA - All features tested and working
**Date:** 2026-05-23

## What's Working

### ✅ Core Features
- Form submission with email, firstName, phone
- Global Control integration (contact creation + tagging)
- Tag firing using fire-tag endpoint (reliable)
- Rate limiting (5 submissions per minute per IP)
- Email validation (RFC 5322 compliant)
- CORS whitelist for approved domains

### ✅ Popup Templates
- Clean Gradient (9 color variants)
- Split Screen
- Full Background (4 sizes)
- Lead Magnet
- Personal Consultation
- Ultra Minimal

### ✅ Split Testing
- 50/50 random assignment
- Button click, exit intent, time delay triggers
- Conversion tracking
- Manual winner selection
- Champion vs Challenger tests

### ✅ Admin Dashboard
- Folder organization
- Popup editing with live preview
- Split test management
- Image upload to Vercel Blob

## Known Limitations

### ⚠️ Split Test Config
- Split test API uses separate static config
- Must manually sync new popups to `/app/api/split-test/route.js`
- 10 popups currently working in split tests:
  - forbiddenfood-nitriloside
  - nitriloside-course
  - frequency-generator-report
  - Nitriloside ForbiddenFood Course
  - ApricotSeed ForbiddenFood Course
  - nitrilosides-optin
  - rifelead-scientist-bw
  - rifelead-scientist-sepia
  - rifelead-microscope
  - rifelead-waveforms
  - rifelead-scientist-sepia
  - rifelead-microscope
  - rifelead-waveforms

### ⚠️ Phone Field
- Phone support added to backend
- Not enabled in popup configs (add 'phone' to fields array to enable)

### ⚠️ Future Improvements
- Move all popups to Control Board database
- Dynamic popup config loading (no static lists)
- Auto-sync split test configs

## API Endpoints

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /api/submit | ✅ Working | Contact + tag firing |
| GET /api/popups | ✅ Working | Returns all popups |
| GET /api/split-test | ✅ Working | 50/50 assignment |
| POST /api/split-tests/[id]/convert | ✅ Working | Conversion tracking |
| Admin dashboard | ✅ Working | Full management |

## URLs

- **API:** https://gcmodal-api77.vercel.app
- **Admin:** https://gcmodal-api77.vercel.app/admin
- **Frontend Library:** https://gcmodal.vercel.app/gc-modal.js

## Git Tag

```bash
git tag -a v2.8.8-beta.20 -m "Beta release: Working split tests, tagging, phone support"
git push origin v2.8.8-beta.20
```

## Next Version Goals (v2.9.0)

1. Control Board database integration
2. Dynamic popup loading
3. Auto-deployment from admin
4. Remove static popup configs
