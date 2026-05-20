# MV Popup Manager - Version History

## Versioning Standard

We use **Semantic Versioning** (SemVer) with the format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, major architectural changes
- **MINOR**: New features, enhancements, new popups (backward compatible)
- **PATCH**: Bug fixes, small tweaks, documentation updates

---

## Current Version

### v2.4.0 - STABLE (Current Production)
**Release Date:** 2026-05-20  
**Commit:** `97779ad`  
**Status:** ✅ Production Ready

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
| v2.4.0 | `v2.4.0` | `97779ad` | 2026-05-20 | ✅ Current |
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

**Last Updated:** 2026-05-20  
**Version:** v2.4.0  
**Next Planned:** v2.5.0 (Split Testing / A-B Testing)
