# MV Popup Manager - Beta Release v2.8.8-beta.20

**Date:** 2026-05-23  
**Status:** Production Ready Beta  
**Git Tag:** v2.8.8-beta.20

## What's Working ✅

### Core Features
- Form submission with email, firstName, phone
- Global Control integration (contact creation + tagging)
- Tag firing using `/api/ai/tags/fire-tag/{tagId}` endpoint (reliable, no 401 errors)
- Rate limiting (5 submissions per minute per IP)
- Email validation (RFC 5322 compliant)
- CORS whitelist for approved domains
- Phone number field support (backend ready, enable in popup config)

### Split Testing
- 50/50 random assignment working
- Button click, exit intent, time delay triggers
- Conversion tracking
- Manual winner selection
- Champion vs Challenger tests

### 10 Deployed Popups

**Nitriloside/ForbiddenFood (tag: 69a02963430175cb1007f09d):**
1. `forbiddenfood-nitriloside`
2. `nitriloside-course`
3. `Nitriloside ForbiddenFood Course`
4. `ApricotSeed ForbiddenFood Course`
5. `nitrilosides-optin`

**RifeLead/Frequency (tag: 68cb4cbb97f1fa5d35ebf6f3):**
6. `frequency-generator-report`
7. `rifelead-scientist-bw`
8. `rifelead-scientist-sepia`
9. `rifelead-microscope`
10. `rifelead-waveforms`

## Known Limitations

### Split Test Variant Randomization
- API assigns variants correctly (50/50)
- Frontend may show same variant repeatedly (investigating)
- Not cookie-related (confirmed)
- Workaround: Split tests work, just not perfectly random in UI

### Phone Field
- Backend supports phone field
- Not enabled in current popup configs
- To enable: add 'phone' to fields array in popup config

### Static Config
- Popups currently in static files
- Must sync between `/api/popups`, `/api/split-test`, `/lib/popups`
- Future: Move to Control Board database

## Backup Files
- `POPUP_BACKUP_2026-05-23.md` - All popups including 10 RedLight variants
- `VERSION_BETA.md` - Beta version documentation
- Git tag `v2.8.8-beta.20` - Full code snapshot

## URLs
- **API:** https://gcmodal-api77.vercel.app
- **Admin:** https://gcmodal-api77.vercel.app/admin
- **Frontend Library:** https://gcmodal.vercel.app/gc-modal.js

## Next Steps (v2.9.0)
1. Move popups to Control Board database
2. Dynamic popup loading (no static lists)
3. Auto-deployment from admin
4. Fix split test variant randomization in frontend
5. Add phone field to active popup configs

## Testing Results (2026-05-23)
✅ Split test form → Contact created and tagged  
✅ Direct popup with phone → Contact updated with phone  
✅ First name updates → Working correctly  
✅ Tag application → Working via fire-tag endpoint  

## Files Modified
- `/app/api/submit/route.js` - Fixed tagging endpoint
- `/app/api/split-test/route.js` - Added RifeLead popups
- `/app/api/popups/route.js` - Cleaned to 10 popups
- `/lib/popups.js` - Added RifeLead popups
- `POPUP_BACKUP_2026-05-23.md` - Created backup
- `VERSION_BETA.md` - Created version doc
- `skills/mv-popup-manager/SKILL.md` - Updated
