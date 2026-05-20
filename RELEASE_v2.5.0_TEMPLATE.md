# Release v2.5.0 - Split Testing (A/B Testing) Feature

**Status:** 🟡 PLANNED  
**Target Date:** TBD  
**Rollback Version:** v2.4.0 (commit 97779ad, tag: v2.4.0)

---

## Overview

Add A/B split testing functionality to allow testing different popup variations against each other.

## Planned Changes

### New Features
- [ ] Split test configuration in popup admin
- [ ] Traffic allocation (e.g., 50/50, 60/40)
- [ ] Conversion tracking per variation
- [ ] Statistical significance calculator
- [ ] Winner auto-selection

### Code Changes Required
- [ ] Frontend library updates (gc-modal.js)
- [ ] Backend API for tracking conversions per variation
- [ ] Admin dashboard UI for creating split tests
- [ ] Database/Control Board storage for test data

### Integration Points
- [ ] Code insertion tool integration
- [ ] Global Control conversion tracking
- [ ] Stats aggregation

---

## Pre-Implementation Checklist

Before starting development:

- [x] Tag current version (v2.4.0) - DONE
- [x] Document rollback plan - DONE
- [ ] Create feature branch: `git checkout -b feature/split-testing`
- [ ] Write technical specification
- [ ] Define success metrics

---

## Testing Plan

### Unit Tests
- Traffic allocation logic
- Conversion tracking
- Statistical calculations

### Integration Tests
- End-to-end split test flow
- Admin dashboard functionality
- Client library behavior

### Production Verification
- [ ] Admin login works
- [ ] Split tests can be created
- [ ] Traffic splits correctly
- [ ] Conversions tracked accurately
- [ ] Rollback works if needed

---

## Rollback Procedure

If issues are found after deployment:

```bash
# Immediate rollback
cd ~/.openclaw/workspace
git reset --hard v2.4.0
git push -f origin master

# Or revert via commit
git revert --no-commit v2.4.0..HEAD
git commit -m "Rollback to v2.4.0 - split testing issues"
git push origin master
```

**Rollback will restore:**
- 22 working popups
- JWT authentication (fixed)
- Image uploads working
- No split testing functionality

---

## Success Criteria

Feature is complete when:
1. Can create split test from admin
2. Traffic splits according to configuration
3. Conversions tracked per variation
4. Statistical significance shown
5. No regression in existing features
6. Rollback tested and verified

---

## Notes

- Keep changes backward compatible if possible
- Consider feature flag for gradual rollout
- Monitor error rates after deployment
- Document new API endpoints

---

**Created:** 2026-05-20  
**By:** Joshua Parker / OpenClaw Assistant  
**Status:** Awaiting approval to begin development
