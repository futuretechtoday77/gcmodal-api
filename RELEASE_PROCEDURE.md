# Release Procedure - Standard Operating Process (SOP)

**Applies to:** All MV Popup Manager releases  
**Version:** 1.0  
**Last Updated:** 2026-05-20

---

## Overview

This document defines the standard procedure for releasing new versions of the MV Popup Manager to ensure stability, proper documentation, and easy rollback.

---

## Release Types

### 1. PATCH Release (v2.4.1)
**For:** Bug fixes, minor tweaks  
**Timeline:** Same day  
**Risk:** Low

### 2. MINOR Release (v2.5.0)
**For:** New features, enhancements  
**Timeline:** 1-3 days testing  
**Risk:** Medium

### 3. MAJOR Release (v3.0.0)
**For:** Breaking changes, architecture changes  
**Timeline:** 1-2 weeks testing  
**Risk:** High

---

## Pre-Release Checklist (MUST COMPLETE)

### Step 1: Prepare Documentation (Before ANY Code Changes)

```bash
# 1. Tag current version
cd ~/.openclaw/workspace
git tag -a v2.4.0 -m "Release v2.4.0: [description]"
git push origin v2.4.0

# 2. Update VERSION.md
cat >> VERSION.md << 'EOF'

### v2.5.0 - PLANNED
**Target Date:** [DATE]
**Branch:** feature/[name]
**Rollback To:** v2.4.0

**Changes:**
- Feature 1
- Feature 2

**Breaking Changes:** [YES/NO]
EOF

# 3. Create release notes template
cp RELEASE_v2.5.0_TEMPLATE.md "releases/RELEASE_v2.5.0_$(date +%Y-%m-%d).md"
```

### Step 2: Create Feature Branch

```bash
cd ~/.openclaw/workspace
git checkout -b feature/split-testing
```

### Step 3: Development

- Make changes
- Test locally
- Update documentation

---

## Release Checklist (MUST COMPLETE)

### Before Deploying to Production

- [ ] All code changes committed
- [ ] Local testing passes
- [ ] Documentation updated
- [ ] VERSION.md updated with new version number
- [ ] Release notes completed in `releases/` folder
- [ ] Rollback procedure tested (if possible)

### Deploy Steps

```bash
# 1. Merge to master
git checkout master
git merge feature/split-testing

# 2. Final version tag
git tag -a v2.5.0 -m "Release v2.5.0: Split testing functionality"
git push origin master
git push origin v2.5.0

# 3. Verify deployment
sleep 60
curl -s https://gcmodal-api77.vercel.app/api/popups | head -20
```

### Post-Deploy Verification (Within 30 minutes)

- [ ] Admin dashboard loads
- [ ] Can login
- [ ] Existing popups still work
- [ ] New features functional
- [ ] No console errors
- [ ] Image uploads work
- [ ] Form submissions work

---

## Rollback Procedures

### Emergency Rollback (Production Broken)

**Use when:** Site completely non-functional

```bash
cd ~/.openclaw/workspace
git reset --hard v2.4.0  # or whatever previous version
git push -f origin master
```

**⚠️ Warning:** This erases history. Use only in true emergencies.

### Standard Rollback (Preferred)

**Use when:** Issues found, need to revert safely

```bash
cd ~/.openclaw/workspace

# Create revert commit (preserves history)
git revert --no-commit v2.4.0..HEAD
git commit -m "Rollback: Reverting v2.5.0 due to [issue]"
git push origin master

# Document the rollback
cat >> VERSION.md << 'EOF'

### Rollback: v2.5.0 → v2.4.0
**Date:** $(date +%Y-%m-%d)
**Reason:** [Describe issue]
**Action:** Reverted to v2.4.0
EOF
```

### Branch-Based Rollback

**Use when:** Want to preserve new code but remove from production

```bash
cd ~/.openclaw/workspace

# Create archive branch
git checkout -b archive/v2.5.0-attempt

# Reset master to stable
git checkout master
git reset --hard v2.4.0
git push -f origin master

# Later can merge archive branch back after fixes
```

---

## Version Number Reference

| Version | Tag | Status | When to Use |
|---------|-----|--------|-------------|
| v2.4.0 | `v2.4.0` | ✅ Current | Production baseline |
| v2.3.3 | `v2.3.3` | ⚠️ Backup | If v2.4.0 fails |

**Current Working Version:** v2.4.0 (commit 97779ad)

---

## Quick Reference

### Tag Current Version
```bash
git tag -a v2.4.0 -m "Release v2.4.0"
git push origin v2.4.0
```

### List All Versions
```bash
git tag -l
```

### View Version Details
```bash
git show v2.4.0
```

### Compare Versions
```bash
git diff v2.4.0..v2.5.0
```

---

## Emergency Contacts

**Vercel Dashboard:** https://vercel.com/futuretechtoday77s-projects/gcmodal-api
**GitHub Repo:** https://github.com/futuretechtoday77/gcmodal-api
**Admin Panel:** https://gcmodal-api77.vercel.app/admin

---

## Approval Required

Before starting any release:
- [ ] Joshua Parker approval
- [ ] Test plan reviewed
- [ ] Rollback plan documented

---

**Document Owner:** Joshua Parker  
**Review Cycle:** After each major release  
**Next Review:** After v2.5.0 release
