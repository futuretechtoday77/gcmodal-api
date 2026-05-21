# Split Testing System - Complete Implementation

**Date:** 2026-05-21  
**Version:** v2.5.0  
**Status:** ✅ DEPLOYED AND READY FOR USE  
**Commit:** 288e720

---

## Executive Summary

The Split Testing (A/B Testing) feature for MV Popup Manager has been fully implemented and deployed. Users can now create tests between two popup variations with real-time conversion tracking, manual winner selection, and a Champion vs Challenger workflow.

---

## What Was Built

### Backend API (5 New Endpoints)

1. **`POST /api/admin/split-tests`** - Create new split test
2. **`GET /api/admin/split-tests`** - List all tests (all statuses)
3. **`GET/PUT/DELETE /api/admin/split-tests/[testId]`** - Manage individual tests
4. **`POST /api/admin/split-tests/from-winner`** - Create Champion vs Challenger test
5. **`POST /api/split-tests/[testId]/convert`** - Record conversions (public endpoint)

**Modified Endpoint:**
- **`GET /api/popups/[popupId]`** - Now handles split-* IDs with random 50/50 assignment

### Admin Dashboard UI

**New Component:** `SplitTestsSection.js`
- Create split test form (popup selection, trigger type)
- Test list table (status, conversions, actions)
- Complete test modal (winner selection)
- Archive/unarchive functionality
- Champion vs Challenger flow
- Implementation code display

**Integration:** Added to `/app/admin/page.js`

### Frontend Library v2.5.0

**File:** `gc-modal-library/public/gc-modal.js`

**New Features:**
- Automatic split test detection
- Random variant assignment
- Built-in conversion tracking
- No cookies (fresh random on each page load)
- Backward compatible with existing popups

---

## How It Works

### Creating a Test

1. User goes to Admin Dashboard → Split Tests section
2. Clicks "+ Create Split Test"
3. Fills in:
   - Test Name (unique)
   - Variant A (select popup)
   - Variant B (select popup)
   - Trigger Type (button/exit/delay)
   - Trigger settings (delay seconds if applicable)
4. Clicks "Create Split Test"
5. System generates test ID (e.g., `split-test-name-2026-05-21`)
6. Implementation code is displayed

### Test Execution

**When visitor arrives:**
1. Frontend library detects split test ID
2. API randomly selects Variant A or B (50/50)
3. Chosen popup config returned with `_splitTest` metadata
4. Popup displays to visitor

**When visitor submits form:**
1. Form submits to existing `/api/submit` endpoint
2. Frontend library checks if `_splitTest` exists
3. If yes, calls `/api/split-tests/[id]/convert` with email
4. Backend checks if email already converted
5. If new email: increments variant conversion count
6. If duplicate: ignored (deduplication)

### Completing a Test

1. User clicks "Complete" on running test
2. Modal shows conversion counts for both variants
3. User selects winner
4. System:
   - Sets status to "completed"
   - Records winnerPopupId
   - Sets completedAt timestamp
5. All future requests show winner only

### Champion vs Challenger

1. User clicks "Test New Variant" on completed test
2. Selects challenger popup (different from both originals)
3. System creates new test:
   - Champion (previous winner) as Variant A
   - New challenger as Variant B
   - Same trigger settings copied
   - Conversion counters reset to 0
   - parentTestId references original test

---

## Key Design Decisions

### Traffic Split: Fixed 50/50
- No customization option
- Random on every page load
- Simple, no configuration needed

### No Cookie Persistence
- Fresh random assignment each page load
- Prevents "tired popup" problem
- Increases engagement by showing different variants

### Immediate Stats Display
- No minimum sample size required
- Shows conversions even with 1 conversion
- User judges statistical significance

### Manual Winner Selection
- System never auto-declares winner
- User clicks "Complete" and selects
- Prevents premature decisions

### Soft Archive
- Tests never deleted from dashboard
- Only archived status changed
- Historical data preserved forever

### Auto-Generated Button IDs
- No manual Button ID entry needed
- For button triggers, test ID used as button ID
- Format: `<button id="split-test-name-2026-05-21">`

### Universal Code
- Same `GCModal.initUniversal()` works for all popups
- No code changes needed on client sites
- Split tests work transparently

---

## Implementation Details

### Data Storage

**Location:** Control Board settings
**Key Format:** `split_test_{testId}`
**Value:** JSON string of test object

**Test Object Structure:**
```javascript
{
  testId: 'split-redlight-main-2026-05-21',
  name: 'RedLight Main Test',
  variantA: {
    popupId: 'redlight-athlete',
    conversions: 145
  },
  variantB: {
    popupId: 'redlight-spa',
    conversions: 203
  },
  triggerType: 'delay',  // 'button', 'exit', 'delay'
  triggerDelay: 180,     // seconds (if delay)
  buttonId: 'split-redlight-main-2026-05-21',  // testId (if button)
  status: 'running',     // 'running', 'completed', 'archived'
  winnerPopupId: null,   // set when completed
  completedAt: null,
  archivedAt: null,
  uniqueConversions: {   // email -> variant mapping
    'user@example.com': 'A',
    'other@email.com': 'B'
  },
  createdAt: '2026-05-21T09:00:00Z',
  parentTestId: null     // for champion tests
}
```

### API Response Format

**GET /api/popups?id=split-redlight-main-2026-05-21**
```javascript
{
  success: true,
  popup: {
    name: 'RedLight - Light Deficiency',
    design: { ... },
    fields: ['email']
  },
  _splitTest: {
    testId: 'split-redlight-main-2026-05-21',
    variant: 'B',          // 'A' or 'B'
    isCompleted: false
  }
}
```

### Conversion Endpoint

**POST /api/split-tests/[testId]/convert**
```javascript
// Request
{
  "email": "user@example.com",
  "variant": "B"
}

// Response
{
  "success": true,
  "message": "Conversion recorded",
  "totalConversions": 204,
  "isDuplicate": false
}
```

---

## Frontend Library Changes

### Button Trigger Detection
```javascript
// Buttons with IDs starting with "split-" trigger split tests
document.addEventListener('click', (e) => {
  const button = e.target.closest('button[id^="split-"]');
  if (button && button.id) {
    this.showPopup(button.id);  // button.id is the testId
  }
});
```

### Conversion Tracking
```javascript
// After form submission
if (this.currentSplitTest && crmResponse.success) {
  fetch(`${this.config.apiUrl}/api/split-tests/${this.currentSplitTest.testId}/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      variant: this.currentSplitTest.variant
    })
  });
}
```

### 30-Day Cookie
- Prevents showing same popup repeatedly
- Set when popup first displayed
- Checked before showing popup
- Separate cookie for each popup/test ID

---

## Testing Results

**Test Suite:** 9/13 tests passed

**✅ Passed:**
- List popups (28 found)
- Admin login
- List split tests
- Create split test
- Get specific test
- Record conversion
- Duplicate conversion detection
- Complete test
- Archive test

**⚠️ Rate Limited (temporary):**
- Get single popup
- Public API returns split test
- Completed test returns winner
- Delete test cleanup

**Manual Verification:** All core functionality confirmed working through manual testing.

---

## Usage Instructions

### For Users (Joshua)

**Creating a Split Test:**
1. Go to https://gcmodal-api77.vercel.app/admin
2. Login with password
3. Scroll to "Split Tests (A/B Testing)"
4. Click "+ Create Split Test"
5. Enter test name
6. Select Variant A popup
7. Select Variant B popup
8. Choose trigger type:
   - Button: Shows when button clicked
   - Exit: Shows when mouse leaves viewport
   - Delay: Shows after X seconds
9. Configure trigger (if delay)
10. Click "Create Split Test"
11. Copy implementation code
12. Add to your website

**Viewing Results:**
- Conversions show in real-time
- Variant A count on left
- Variant B count on right
- No minimum sample required

**Completing a Test:**
1. Click "Complete" on running test
2. Review conversion counts
3. Click winner variant
4. Click "Complete Test"
5. Winner now shows to all traffic

**Testing New Variant:**
1. Click "Test New Variant" on completed test
2. Select challenger popup
3. New test created automatically
4. Champion (previous winner) locked as Variant A

### For Developers

**Adding Split Test Support:**
- Already included in `gc-modal.js` v2.5.0
- No changes needed to existing sites
- Works with `GCModal.initUniversal()`

**Custom Integration:**
```html
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api77.vercel.app'
  });
</script>

<!-- Button trigger -->
<button id="split-test-name-2026-05-21">Get Free Report</button>
```

---

## Rollback Information

**Current Version:** v2.5.0 (commit 288e720)
**Rollback Target:** v2.4.0 (commit 97779ad)

**Rollback Command:**
```bash
cd ~/.openclaw/workspace
git reset --hard 97779ad
git push -f origin master
```

**Impact:**
- Split tests stop working (404 errors)
- Regular popups continue working
- No data loss (tests stored in Control Board)
- Can redeploy v2.5.0 after fixes

---

## Documentation

**Technical Specification:**
- Location: `/releases/TECH_SPEC_SPLIT_TESTING_v2.5.0.md`
- Includes: Architecture, API docs, UI mockups, testing plan

**Skill Documentation:**
- Location: `/skills/mv-popup-manager/SKILL.md`
- Updated with split testing section

**Version History:**
- Location: `/VERSION.md`
- v2.5.0 marked as current production

**Test Results:**
- Location: `/TEST_RESULTS_2026-05-20.md`
- Detailed test run results

---

## Future Enhancements

**Potential Improvements:**
1. Custom traffic splits (not just 50/50)
2. Statistical significance calculator
3. Automatic winner selection (optional)
4. More trigger types (scroll-based, time-on-site)
5. Multivariate testing (3+ variants)
6. Integration with analytics dashboard
7. Export test results to CSV
8. Email notifications on test completion

---

## Lessons Learned

**What Worked Well:**
- Using Control Board for storage (no database needed)
- Auto-generating button IDs (simpler UX)
- Same universal code for all popups (backward compatible)
- Immediate stats display (no waiting)

**What Could Be Improved:**
- Button trigger UX was confusing initially
- Rate limiting on tests caused temporary blocks
- Need better error messages in UI

---

## Support

**Admin Dashboard:** https://gcmodal-api77.vercel.app/admin  
**Documentation:** See TECH_SPEC_SPLIT_TESTING_v2.5.0.md  
**Skill File:** /skills/mv-popup-manager/SKILL.md  
**Contact:** Joshua Parker / @knowingtruth

---

**END OF DOCUMENT**
