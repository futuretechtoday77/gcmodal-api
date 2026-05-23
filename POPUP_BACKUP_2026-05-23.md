# Popup Configuration Backup
**Date:** 2026-05-23
**Version:** Pre-beta cleanup

## Confirmed Working Popups (3)

### 1. forbiddenfood-nitriloside
- **Tag ID:** 69a02963430175cb1007f09d
- **Fields:** firstName, email
- **Status:** ✅ Working (split test + direct)

### 2. nitriloside-course
- **Tag ID:** 69a02963430175cb1007f09d
- **Fields:** firstName, email
- **Status:** ✅ Working (split test + direct)

### 3. frequency-generator-report
- **Tag ID:** 68cb4cbb97f1fa5d35ebf6f3
- **Fields:** email
- **Status:** ✅ Working (split test + direct)

## Full Static Config Backup

### /app/api/popups/route.js
[Contains 20+ popups including ForbiddenFood, RifeLead, RedLightResearch campaigns]

### /app/api/split-test/route.js
[Contains 6 core popups + 4 RifeLead popups]

### /lib/popups.js
[Contains 6 core popups for server-side config loading]

## Known Issues
1. Split test API has separate static config — must keep in sync with /api/popups
2. Phone field support added but not enabled in popup configs (fields array)
3. Tagging fixed using fire-tag endpoint (not contact/{id}/tags)

## Next Steps for Auto-Deployment
1. Move all popups to Control Board database
2. Remove static configs from code
3. Fetch popup configs dynamically from Control Board
4. Split test should use same dynamic source
