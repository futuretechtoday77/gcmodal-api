# MV Popup Manager - Version History

## Versioning Standard

We use **Semantic Versioning** (SemVer) with the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, major architectural changes
- **MINOR**: New features, enhancements, new popups (backward compatible)
- **PATCH**: Bug fixes, small tweaks, documentation updates

---

## Current Version

### v2.8.7 - PRODUCTION (Stable Cookie Restrictions)
**Release Date:** 2026-05-22  
**Commit:** `TBD`  
**Status:** ✅ Production Ready

**What's Working:**
- **Button Popups** - No cookie restriction (always show)
- **Exit Intent** - 7-day cookie, triggers within 50px of top
- **Time Delay** - 7-day cookie, default 3 minute delay
- **CORS** - Properly configured for all API endpoints

**Known Issues:**
- **Split Testing** - Not working (API returns "not found")
- **Image Resizer** - Admin controls don't affect preview

### v2.8.5 - PRODUCTION (Cookie-Based Popup Restrictions)
**Release Date:** 2026-05-22  
**Commit:** `af94b9f`  
**Status:** ✅ Production Ready

**Features in v2.8.5:**
- **Cookie-Based Restrictions** - Exit intent and time delay popups respect 7-day cookie
  - Button popups: NO restriction (always show)
  - Exit intent: 7 day cookie (once per week)
  - Time delay: 7 day cookie (once per week)
- **initUniversal() Support** - Backward compatibility for existing code
- **Direct Trigger Support** - Admin-generated code with popupId/trigger works

### v2.8.3 - PRODUCTION (Template System Bug Fixes)
**Release Date:** 2026-05-22  
**Commit:** `c2d97b8`  
**Status:** ✅ Production Ready

**Bug Fixes in v2.8.3:**
- **Field Checkboxes Persistent** - Name and Phone checkboxes now stay checked when switching templates
- **Fixed Save API** - Phone field now properly saves and loads from database
- **Ultra Minimal Fixed** - Removed duplicate email field that was appearing
- **Single Name Field** - All templates now use single "Name" field (not First/Last split)
- **Phone Field on All Templates** - Every template now supports the phone number field

### v2.8.0 - PRODUCTION (Template System)
**Release Date:** 2026-05-21  
**Commit:** `ecd0913`  
**Status:** ✅ Production Ready

**Feature:** Comprehensive template system with 9 pre-designed layouts and extensive customization

**What's New in v2.8.0:**
- **Template System** - 9 professionally designed popup templates:
  - Clean Gradient, Ultra Minimal (Minimal category)
  - Split Screen, Full Background, Full Background Tall, Full Background Wide, Full Background Compact (Image category)
  - Lead Magnet (Product category)
  - Personal Consultation (Personal category)
- **Mobile-First Design** - Default preview is mobile (320px), desktop toggle available
- **High-Contrast Color Themes** - 4 new professional themes (Professional, Professional Blue, Dark Mode, Clean Minimal) plus 8 original pastel themes
- **Button Color Picker** - 8 preset colors for all templates
- **Popup Height Options** - Compact, Standard, Tall for all templates
- **Custom Text Colors** - Override headline and subheadline colors per popup
- **Trust Text** - Customizable privacy message with on/off toggle for all templates
- **Full Background Overlay** - Toggle on/off, color picker, opacity slider (10-90%)
- **Personal Consultation Features** - Custom avatar image, position (left/right), chat message
- **Improved Image Display** - All images use `object-fit: contain` (no cropping)
- **Template Selector UI** - Browse by category with live preview
- **Design Tab** - All customization options in one place

**Previous Features (from v2.7.1):**
- Complete Edit Page with all form fields
- Image upload, position, scale
- Clone functionality

**Deployment Note:** Currently manual deployment required after saving. Auto-deploy coming in v2.9.0.

**Rollback:** To v2.7.1 (commit `cebb74d`) or v2.7.0 (commit `b7e3a3b`) if needed

---

### v2.7.0 - STABLE
**Release Date:** 2026-05-21  
**Commit:** `b7e3a3b`  
**Status:** ⚠️ Superseded

Initial dedicated edit page (simplified version).

---

### v2.6.0 - STABLE
**Release Date:** 2026-05-21  
**Commit:** `f4ee310`  
**Status:** ⚠️ Superseded

Functional folder navigation system.

---

### v2.4.0 - STABLE (Baseline)
**Release Date:** 2026-05-20  
**Commit:** `97779ad`  
**Status:** ⚠️ Pre-folder-system

### What's in v2.4.0

**Features:**
- 22 new popup campaigns across 3 Global Control tags
- Complete image upload integration with Vercel Blob
- JWT-based authentication for admin
- Rate limiting on submissions and logins
- Email validation and XSS protection

**Bug Fixes:**
- Fixed logout on save issue (JWT token handling)
- Fixed syntax error with unescaped quotes

**Security:**
- Tag IDs filtered from public API
- JWT expiration: 24 hours
- Rate limits: 5 submissions/min, 3 login attempts/15min

**Popups Deployed:**
- ForbiddenFood: 6 popups (Tag: 69a02963430175cb1007f09d)
- RifeLead: 4 popups (Tag: 68cb4cbb97f1fa5d35ebf6f3)
- RedLightResearch: 10 popups (Tag: 6942461446aba476ddd3ae8c)
- Plus 3 existing test popups

---

## Previous Versions

### v2.3.3 - WORKING BASELINE
**Commit:** `454bb53`  
**Date:** 2026-05-19  
**Status:** Last known good before v2.4.0

This was the stable version before adding the 22 new popups. Use this if v2.4.0 has critical issues.

### v2.3.2 - SECURITY ENHANCEMENTS
**Commit:** `75a0aac`  
**Date:** 2026-05-19  
**Status:** Security complete, pre-Tag ID display fix

Added all 9 security features but Tag IDs didn't display in edit form.

---

## Rollback Procedures

### Emergency Rollback (Immediate)

If production is broken and you need to revert NOW:

```bash
# Rollback to v2.4.0's stable point
cd ~/.openclaw/workspace
git reset --hard 97779ad
git push -f origin master

# Or use the tag
git reset --hard v2.4.0
git push -f origin master
```

**⚠️ Force push will overwrite history - use only in emergencies**

### Safe Rollback (Recommended)

If you want to preserve history:

```bash
cd ~/.openclaw/workspace

# Create a revert commit
git revert --no-commit 97779ad..HEAD
git commit -m "Rollback to v2.4.0 stable"
git push origin master
```

### Rollback to Previous Major Version

To go back to v2.3.3 (pre-new-popups):

```bash
cd ~/.openclaw/workspace
git checkout -b rollback-v2.3.3 454bb53

# Make it the new master (careful!)
git branch -D master
git checkout -b master
git push -f origin master
```

---

## Creating New Releases

### Before Adding Features (Prerequisites)

1. **Tag current version:**
```bash
git tag -a v2.4.0 -m "Release v2.4.0: 22 new popups, bug fixes"
git push origin v2.4.0
```

2. **Document in VERSION.md:**
- Add new version section
- List what's changing
- Note any breaking changes
- Update rollback procedures

3. **Create release notes:**
```bash
cat > RELEASE_v2.5.0.md << 'EOF'
# Release v2.5.0 - [Feature Name]

## Planned Changes
- Feature 1
- Feature 2

## Rollback Plan
If issues occur, rollback to: v2.4.0 (commit 97779ad)

## Testing Checklist
- [ ] Admin login works
- [ ] Popups display correctly
- [ ] Form submissions work
- [ ] Images load properly
EOF
```

### After Feature Complete

1. **Test everything**
2. **Update VERSION.md** with new version
3. **Tag the release:**
```bash
git tag -a v2.5.0 -m "Release v2.5.0: [description]"
git push origin v2.5.0
```
4. **Archive release notes** to `releases/` folder

---

## Git Tag Reference

| Version | Tag | Commit | Date | Status |
|---------|-----|--------|------|--------|
| v2.7.1 | `v2.7.1` | `cebb74d` | 2026-05-21 | ✅ Current |
| v2.7.0 | `v2.7.0` | `b7e3a3b` | 2026-05-21 | ⚠️ Superseded |
| v2.6.0 | `v2.6.0` | `cdade2e` | 2026-05-21 | ⚠️ Superseded |
| v2.5.3 | `v2.5.3` | `TBD` | 2026-05-21 | ⚠️ Superseded (folders decorative only) |
| v2.5.2 | `v2.5.2` | `3325261` | 2026-05-21 | ⚠️ Superseded |
| v2.5.1 | `v2.5.1` | `3975fc2` | 2026-05-21 | ⚠️ Superseded |
| v2.5.0 | `v2.5.0` | `288e720` | 2026-05-21 | ⚠️ Superseded |
| v2.4.0 | `v2.4.0` | `97779ad` | 2026-05-20 | ⚠️ Pre-split-testing |
| v2.3.3 | `v2.3.3` | `454bb53` | 2026-05-19 | ⚠️ Backup |
| v2.3.2 | `v2.3.2` | `75a0aac` | 2026-05-19 | ❌ Deprecated |

---

## Environment Information

**Production URLs:**
- Admin Dashboard: https://gcmodal-api77.vercel.app/admin
- API Endpoint: https://gcmodal-api77.vercel.app
- Client Library: https://gcmodal.vercel.app/gc-modal.js

**Required Environment Variables:**
- `ADMIN_PASSWORD` - Admin login password
- `JWT_SECRET` - 32+ character random string
- `UPSTASH_REDIS_REST_URL` - Redis connection URL
- `UPSTASH_REDIS_REST_TOKEN` - Redis auth token
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `CONTROLBOARD_API_TOKEN` - Optional (not currently used)
- `WORKSPACE_ID` - Control Board workspace ID

---

**Last Updated:** 2026-05-21  
**Version:** v2.8.0  
**Next Planned:** v2.9.0 (Auto-deploy feature)

## Current Version

### v2.6.0 - PRODUCTION (Functional Folder Navigation)
**Release Date:** 2026-05-21
**Commit:** `cdade2e`
**Status:** ✅ Production Ready

**Feature:** Functional folder navigation system - folders now actually organize and hide content

**What's New in v2.6.0:**
- **Functional Folder System** - Folders now truly organize the interface:
  - Popups in folders are ONLY visible inside their folder (not duplicated in main table)
  - Main table renamed to "Unorganized Popups" (only shows items not in folders)
  - Dramatically shorter page - much easier to navigate
  - Full popup details in folder views (stats, Edit, Clone, View Code, Delete buttons)
  - Expandable folder tables with complete functionality
  - "Remove from folder" vs "Delete popup" clearly distinguished (yellow vs red)
  - Drag items between folders and unorganized section
  - Real organization instead of just decorative folders
- Applies to both popup and split test folders
- Makes long lists manageable by hiding organized items

**Previous Features (from v2.5.3):**
- **Folder Management** - Create, rename, delete folders with drag-and-drop organization
- **Folder Storage** - Persistent folder data in Control Board

**From v2.5.2:**
- **Button Customizer** - Full styling options for button-triggered tests (now in code modal)
  - Button text, colors, font, size, padding, shadow, alignment
  - Live preview
  - Contextual styling per placement

**Complete Split Testing Features:**
- Create A/B tests between any two popups
- Fixed 50/50 traffic split (random on each page load)
- Conversion tracking on successful form submissions
- Email deduplication (one conversion per email per test)
- Manual winner selection (you decide, not auto)
- Champion vs Challenger workflow (test winner against new variant)
- Three trigger types: Button click, Exit intent, Time delay
- Auto-generated button IDs (no manual entry needed)
- Archive/unarchive tests (soft delete)
- Real-time stats display (no minimum sample size)

**Admin Dashboard:**
- New "Split Tests (A/B Testing)" section
- Create test form with popup selection and button customizer
- Test list showing all statuses (running/completed/archived)
- Conversion counts for each variant
- Complete test modal with winner selection
- Implementation code display with styled button
- Champion vs Challenger creation flow

**Frontend Library (v2.5.1):**
- Automatic split test detection
- Built-in conversion tracking
- Backward compatible with existing popups
- No code changes needed on client sites

**Breaking Changes:** None - fully backward compatible

**Rollback:** To v2.5.3 (if tagged) or v2.4.0 (commit 97779ad) if needed

---

## Previous Versions

### v2.5.0 - SUPERSEDED
**Release Date:** 2026-05-21  
**Commit:** `288e720`  
**Status:** ⚠️ Superseded by v2.5.1

Initial split testing release without button customizer. Use v2.5.1 for full button styling support.

### v2.4.0 - STABLE (Baseline)
**Release Date:** 2026-05-20  
**Commit:** `97779ad`  
**Status:** ⚠️ Previous stable (before split testing)

Use this if v2.5.x has critical issues.
