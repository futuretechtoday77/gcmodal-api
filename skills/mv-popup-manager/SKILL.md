# MV Popup Manager Skill

**Purpose:** Create, modify, and manage lead capture popups for HealthHarmonic.com using the MV Popup Manager system, including A/B split testing.

**Version:** 2.7.1  
**Status:** Production  
**Last Updated:** 2026-05-21

---

## When to Use This Skill

Use this skill when the user asks to:
- Create a new popup
- Modify an existing popup
- Add new popup layouts or styles
- Test popup designs
- Deploy popup changes
- Troubleshoot popup issues
- **Create A/B split tests**
- **Analyze split test results**
- **Complete split tests and select winners**

**Do NOT use for:**
- General website changes unrelated to popups
- Email marketing campaigns (use different tool)
- Analytics/tracking setup (separate concern)

---

## System Overview

### Architecture

**Frontend Library:**
- URL: https://gcmodal.vercel.app/gc-modal.js (v2.5.0 with split testing)
- Renders popups on HealthHarmonic.com
- Handles form submissions
- Automatically tracks split test conversions
- Repository: `gc-modal-library/`

**Backend API:**
- URL: https://gcmodal-api77.vercel.app
- Admin: https://gcmodal-api77.vercel.app/admin
- Handles submissions, uploads, authentication, split tests
- Repository: Main workspace (`~/.openclaw/workspace`)

### Current Popup Configuration

**Popups are hardcoded in TWO files:**
1. `/app/api/popups/route.js` - Public API (no Tag IDs)
2. `/app/api/admin/popups/route.js` - Admin API (with Tag IDs)

**Important:** Changes must be made to BOTH files to keep them in sync.

---

## Dedicated Edit Pages - NEW in v2.7.1

### Overview

Popup creation and editing now happens on dedicated pages instead of inline on the admin dashboard.

**Benefits:**
- Cleaner admin dashboard (no large inline forms)
- Focused editing environment
- Better mobile experience
- Easier to navigate between popups

### How It Works

**Creating a New Popup:**
1. Click "+ Create Popup" on admin dashboard
2. Navigate to `/admin/popup/edit`
3. Fill in all required fields
4. See live preview on the right
5. Click "Create Popup" to save
6. Automatically redirected back to admin

**Editing an Existing Popup:**
1. Find popup in admin dashboard (in folders or unorganized table)
2. Click "Edit" button
3. Navigate to `/admin/popup/edit?id=POPUP_ID`
4. Form pre-filled with existing data
5. Make changes and see live preview
6. Click "Save Changes" to update
7. Automatically redirected back to admin

**Cloning a Popup:**
1. Click "Clone" button on any popup
2. Navigate to edit page with pre-filled data
3. ID and Name automatically have "-copy" and "(Copy)" appended
4. Modify as needed
5. Save as new popup

### Edit Page Features

**Left Side - Form Fields:**
- Basic Info: ID, Name, Tag ID
- Design: Color variant, Layout
- Content: Headline, Subheadline, Body Copy, Button Text
- Image: Upload or URL, position, scale
- Fields: Include/exclude First Name

**Right Side - Live Preview:**
- Real-time preview of how popup will look
- Updates as you type
- Shows actual layout, colors, and content

**Navigation:**
- "Back to Admin" button returns to dashboard
- Cancel button confirms before discarding changes

---

## Folder Organization

### Overview

The admin dashboard now supports organizing popups and split tests into folders for easier navigation.

**Key Features:**
- Create folders to group related popups/tests
- Drag and drop items between folders
- Expand folders to see full details (stats, action buttons)
- Items in folders are hidden from main "Unorganized" table
- Much shorter, more navigable page

### How Folder Organization Works

1. **Folders display at top of page** → Collapsible sections with item counts
2. **Drag popup into folder** → It disappears from "Unorganized Popups" table
3. **Expand folder** → See full table with stats and all action buttons (Edit, Clone, View Code, Delete)
4. **Main table becomes short** → Only shows unorganized items

### Managing Folders

**Create Folder:**
1. Click "+ New Folder" button
2. Enter folder name
3. Click "Create"

**Organize Items:**
1. Drag any popup from main table
2. Drop onto folder header
3. Popup moves into folder

**View Folder Contents:**
1. Click folder header to expand
2. See full table with stats and buttons
3. Click again to collapse

**Remove from Folder:**
1. Expand folder
2. Click yellow "Remove" button
3. Item returns to "Unorganized" table

**Delete Folder:**
1. Click trash icon on folder header
2. Confirm deletion
3. Items inside move back to unorganized (not deleted)

### Folder Best Practices

**Suggested Organization:**
- By product/offer ("RedLight Popups", "Forbidden Food Popups")
- By status ("Active Campaigns", "Archived", "Testing")
- By season ("Black Friday", "New Year")
- By performance ("High Converters", "Needs Testing")

**Benefits:**
- Dramatically shorter admin page
- Easy to find specific campaigns
- Group related tests together
- Hide inactive/archived items

---

## Split Testing (A/B Testing)

### Overview

Split testing allows you to test two popup variations against each other with real-time conversion tracking.

**Key Features:**
- **Traffic Split:** Fixed 50/50 (random on every page load)
- **Conversions:** Tracked on successful form submissions only
- **Deduplication:** One conversion per email per test
- **Winner Selection:** Manual (you decide, not auto)
- **Champion vs Challenger:** Create new tests from winners
- **Three Trigger Types:** Button click, Exit intent, Time delay

### How Split Tests Work

1. **Visitor arrives** → System randomly shows Variant A or B (50/50)
2. **Visitor submits form** → Conversion recorded for that variant
3. **Same email submits again** → Ignored (already counted)
4. **You review stats** → Click "Complete Test" when ready
5. **Select winner** → All future traffic shows winner only
6. **Test new variant** → Create "Champion vs Challenger" test

### Creating a Split Test

**Step 1:** Go to Admin Dashboard
- Visit: https://gcmodal-api77.vercel.app/admin
- Login with admin password

**Step 2:** Scroll to "Split Tests (A/B Testing)" Section
- Click "+ Create Split Test"

**Step 3:** Fill in Required Fields
- **Test Name:** Unique name (e.g., "RedLight Main Test")
- **Variant A:** Select first popup from dropdown
- **Variant B:** Select second popup from dropdown
- **Trigger Type:** Choose one:
  - **Button Click:** Popup shows when button is clicked
  - **Exit Intent:** Popup shows when mouse leaves viewport
  - **Time Delay:** Popup shows after X seconds

**Step 4:** Configure Trigger (if needed)
- **Delay only:** Set delay in seconds (e.g., 180 = 3 minutes)
- **Button/Exit:** No additional config needed

**Step 5:** Create Test
- Click "Create Split Test"
- Copy the implementation code

### Implementation Code Examples

**Button Trigger:**
```html
<!-- GC Modal: Universal Script (already on your site) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api77.vercel.app'
  });
</script>

<!-- Trigger: Button Click -->
<!-- Copy this button HTML to your site: -->
<button id="split-test-name-2026-05-21">Get Free Report</button>
```

**Exit Intent Trigger:**
```html
<!-- GC Modal: Universal Script (already on your site) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api77.vercel.app'
  });
</script>

<!-- Trigger: Exit Intent (auto-detects mouse leaving viewport) -->
<!-- No additional code needed - automatically triggers on exit intent -->
```

**Time Delay Trigger:**
```html
<!-- GC Modal: Universal Script (already on your site) -->
<script src="https://gcmodal.vercel.app/gc-modal.js"></script>
<script>
  GCModal.initUniversal({
    apiUrl: 'https://gcmodal-api77.vercel.app'
  });
</script>

<!-- Trigger: Time Delay (180s = 3m 0s) -->
<!-- Automatically triggers after 180 seconds on page -->
```

### Managing Split Tests

**Test Statuses:**
- **Running:** Test is active, showing random variants
- **Completed:** Winner selected, showing winner only
- **Archived:** Hidden from main view but preserved

**Actions Available:**
- **View Code:** See implementation code again
- **Complete:** End test and select winner
- **Reopen:** Resume a completed test (back to running)
- **Archive:** Hide test from dashboard
- **Unarchive:** Restore archived test
- **Test New Variant:** Create Champion vs Challenger test

### Completing a Test

1. Click "Complete" on a running test
2. Review conversion counts for both variants
3. Select the winner (higher conversions)
4. Click "Complete Test"

**After completion:**
- Status changes to "Completed"
- All traffic shows winner popup
- Loser popup no longer shown
- Conversion tracking stops

### Champion vs Challenger

When you have a winner, you can test it against a new variant:

1. Click "Test New Variant" on a completed test
2. Select a challenger popup (different from both original variants)
3. New test is created with:
   - Champion (previous winner) as Variant A
   - New challenger as Variant B
   - Same trigger settings
   - Conversion counters reset to 0

### Split Test Best Practices

**What to Test:**
- Different headlines
- Different images
- Different button text
- Different layouts (centered vs side-by-side)
- Different color variants

**Sample Size:**
- No minimum required (system shows stats immediately)
- Recommend at least 100 conversions per variant for significance
- Let test run for at least 1 week to account for day-of-week effects

**Common Mistakes:**
- Changing test mid-way (invalidates results)
- Ending test too early (need statistical significance)
- Testing too many things at once (can't isolate what worked)

---

## Creating a New Popup

### Step 1: Design the Popup

Gather requirements:
- **Purpose:** What's the offer? (free report, course access, etc.)
- **Headline:** Main attention-grabbing text
- **Subheadline:** Supporting text explaining value
- **Body Copy:** Optional additional details
- **Button Text:** Call-to-action text
- **Image:** Product image, book cover, or visual element
- **Fields:** firstName + email, or just email?
- **Color Variant:** purple, green, blue, red, orange, or custom
- **Layout:** centered, side-by-side, compact, or overlay

### Step 2: Add to Configuration Files

**File 1:** `/app/api/popups/route.js`

Add to `staticPopups` object (inside GET function):

```javascript
'your-popup-id': {
  name: 'Display Name for Admin',
  // NOTE: tagId is here but will be FILTERED OUT in public response
  tagId: '69a02963430175cb1007f09d',  // Global Control Tag ID
  design: {
    variant: 'purple',  // purple, green, blue, red, orange
    layout: 'side-by-side',  // centered, side-by-side, compact, overlay
    headline: 'Your Attention-Grabbing Headline',
    subheadline: 'Supporting text that explains the value',
    bodyCopy: 'Optional additional details here',
    buttonText: 'Get Instant Access',
    image: {
      url: 'https://your-image-url.com/image.jpg',
      position: 'left-side',  // left-side, top, none
      scale: 100  // 100 = actual size, 200 = 2x, etc.
    }
  },
  fields: ['firstName', 'email']  // or just ['email']
}
```

**File 2:** `/app/api/admin/popups/route.js`

Add IDENTICAL popup config to `staticPopups` object. Must match File 1 exactly.

### Step 3: Deploy Changes

```bash
cd ~/.openclaw/workspace
git add app/api/popups/route.js app/api/admin/popups/route.js
git commit -m "Add new popup: [Popup Name]"
git push origin master
```

Vercel auto-deploys in ~30-60 seconds.

### Step 4: Upload Images

**⚠️ CRITICAL: Use VERTICAL/PORTRAIT images only for side-by-side layouts**

Horizontal images don't display properly in the left-side image position. Always use portrait orientation images.

**Upload Process:**
1. Go to https://gcmodal-api77.vercel.app/admin
2. Login with admin password
3. Scroll to bottom - find "Upload Image" section
4. Select image file (JPG/PNG, max 500KB)
5. Click Upload
6. Copy the returned Blob URL
7. Update the popup config with the actual URL (including random suffix)

**Image Requirements:**
- Format: JPG or PNG
- Size: 500KB max
- Dimensions: 800x1200px (2:3 ratio) or 900x1600px (9:16 ratio)
- Orientation: **VERTICAL/PORTRAIT ONLY** for side-by-side layouts
- Quality: High resolution

### Step 5: Verify Deployment

1. Visit https://gcmodal-api77.vercel.app/admin
2. Login with admin password
3. Verify new popup appears in list
4. Click Edit to confirm all fields populated
5. Verify image displays correctly (should fill left side)
6. Test on website using `?popup=your-popup-id` parameter

---

## Complete Workflow Example

**Creating a popup with image:**

```bash
# 1. Add popup config to both route files
# 2. Commit and push
git add app/api/popups/route.js app/api/admin/popups/route.js
git commit -m "Add new popup: RedLightResearch Campaign"
git push origin master

# 3. Wait for deploy (30-60 seconds)

# 4. Upload image via admin dashboard
# 5. Get actual Blob URL with random suffix

# 6. Update config with real image URL
# Edit both files, update image.url field

# 7. Commit and push again
git add app/api/popups/route.js app/api/admin/popups/route.js
git commit -m "Update popup with actual image URLs"
git push origin master

# 8. Test the popup
# Visit: https://healthharmonic.com/?popup=your-popup-id
```

---

## Popup Design Patterns

### Layout Options

**1. Centered Layout**
```
┌─────────────────────┐
│                     │
│      [Image]        │
│                     │
│      Headline       │
│    Subheadline      │
│                     │
│  [Email] [Button]   │
│                     │
└─────────────────────┘
```
- Best for: Simple offers, single focus
- Image: Optional, shown above text
- Width: 500px
- Use when: Clean, minimal design needed

**2. Side-by-Side Layout**
```
┌──────────────────────────┐
│         │                │
│  Image  │   Headline     │
│         │  Subheadline   │
│         │                │
│         │ [Name] [Email] │
│         │    [Button]    │
└──────────────────────────┘
```
- Best for: Product images, book covers
- Image: Left side, 280px wide
- Width: 700px
- Use when: Visual product needs to be shown

**3. Compact Layout**
```
┌─────────────────────┐
│      │              │
│ Img  │  Headline    │
│      │ [Name][Email]│
│      │   [Button]   │
└─────────────────────┘
```
- Best for: Minimal intrusion, quick capture
- Image: Small left thumbnail
- Width: 550px
- Use when: Less aggressive approach needed

**4. Overlay Layout**
```
┌─────────────────────┐
│                     │
│    [Full Image]     │
│         ┌───────┐   │
│         │ Form  │   │
│         └───────┘   │
└─────────────────────┘
```
- Best for: Dramatic product shots
- Image: Full background
- Form: Overlays bottom of image
- Width: 500px
- Use when: High-impact visual needed

### Color Variants

**Purple (Default):**
- Primary: #7c3aed
- Use for: General offers, reports

**Green:**
- Primary: #10b981
- Use for: Health, natural products, success

**Blue:**
- Primary: #3b82f6
- Use for: Trust, authority, information

**Red:**
- Primary: #ef4444
- Use for: Urgency, limited time offers

**Orange:**
- Primary: #f97316
- Use for: Energy, excitement, action

### Field Combinations

**Email Only:**
```javascript
fields: ['email']
```
- Lower friction
- Higher conversion rate
- Less information collected
- Use for: Top-of-funnel, casual visitors

**First Name + Email:**
```javascript
fields: ['firstName', 'email']
```
- Personalization possible
- Moderate friction
- More complete data
- Use for: Engaged visitors, paid traffic

---

## Common Modifications

### Changing Headline/Copy

1. Edit both popup config files
2. Update `headline`, `subheadline`, or `bodyCopy` fields
3. Keep text concise (headline: 8-12 words max)
4. Test readability on mobile (preview at 375px width)

### Swapping Images

**Upload New Image:**
```bash
# Login to admin
# Go to https://gcmodal-api77.vercel.app/admin
# Use upload form (requires JWT token)
# Copy returned Blob Storage URL
```

**Update Config:**
```javascript
image: {
  url: 'https://wtlu1vtxxipjqznc.public.blob.vercel-storage.com/new-image.jpg',
  position: 'left-side',
  scale: 100  // Adjust to fit design
}
```

**Image Guidelines:**
- Format: JPG or PNG
- Size: 500KB max (will be validated)
- Dimensions: 800x1200px recommended for side-by-side
- Aspect Ratio: **VERTICAL/PORTRAIT strongly preferred** (2:3, 3:4, or 9:16)
- Quality: High resolution (will scale down as needed)

**⚠️ Important: For side-by-side layouts, use VERTICAL images only.**
- Horizontal/landscape images don't display well in left-side position
- Portrait orientation (taller than wide) works best with image-left layout
- Recommended: 800x1200px (2:3 ratio) or 900x1600px (9:16 ratio)

### Changing Button Text

Strong button text examples:
- "Get Instant Access"
- "Send My Free Report"
- "Yes, I Want This"
- "Download Now"
- "Send Report & Login"
- "Claim My Spot"

Weak button text (avoid):
- "Submit"
- "Click Here"
- "OK"
- "Continue"

### Adjusting Colors

Custom variant:
```javascript
// Not currently supported - use one of 5 presets
// Future enhancement: custom hex colors
```

---

## Testing Popups

### Local Testing

**Preview in Admin:**
1. Go to admin dashboard
2. Click "Edit" on popup
3. Preview shows on right side
4. Make changes and see live preview

**Test on Website:**
1. Add `?popup=your-popup-id` to any HealthHarmonic.com URL
2. Popup will display immediately
3. Test form submission
4. Check email delivery in Global Control

### Production Testing Checklist

- [ ] Headline is clear and compelling
- [ ] Subheadline adds value/clarity
- [ ] Button text is action-oriented
- [ ] Image loads and looks good
- [ ] Form fields are labeled clearly
- [ ] Email field validates correctly
- [ ] Submission goes to Global Control
- [ ] Thank you message displays
- [ ] Mobile view looks correct
- [ ] Close button works
- [ ] Popup doesn't re-show after close (30-day cookie)

---

## Image Best Practices

### For Side-by-Side Layout (Recommended)

**ALWAYS use vertical/portrait images.**

The image appears on the left side at 280px width. Horizontal images get squished and look terrible.

**Good image types:**
- Book covers (portrait orientation)
- Product shots (tall bottles, boxes)
- Document covers (research reports)
- People portraits (vertical)

**Bad image types:**
- Landscape photos
- Wide banners
- Screenshots (usually 16:9)
- Horizontal infographics

**Quick Test:** If the image looks good on a phone screen in portrait mode, it'll work well.

### Image Scale Settings

```javascript
image: {
  url: 'https://...',
  position: 'left-side',
  scale: 100  // Base size
  // scale: 150  // 1.5x larger (zoom in)
  // scale: 200  // 2x larger (fills more space)
}
```

Higher scale values zoom into the image, which can help if the image has important details.

---

## Troubleshooting

### Popup Not Showing

**Check:**
1. Is popup ID spelled correctly?
2. Is popup in config files?
3. Has Vercel deployed latest code?
4. Clear browser cache and cookies
5. Try `?popup=your-id&force=true` URL parameter

### Form Submission Fails

**Common Causes:**
- Rate limit exceeded (5/min per IP)
- Invalid email format
- CORS issue (domain not whitelisted)
- Redis connection down
- Tag ID not set correctly

**Debug:**
1. Open browser DevTools → Network tab
2. Submit form and check `/api/submit` request
3. Look for error response
4. Check Vercel logs for server-side errors

### Image Won't Upload

**Validation Errors:**
- File must be actual image (magic bytes checked)
- Must be JPG, PNG, GIF, or WebP
- Max size varies (check Blob Storage limits)
- Must be logged into admin (JWT required)

**Fix:**
1. Verify file is genuine image (not renamed .txt)
2. Reduce file size if too large
3. Check JWT token is valid (login again)
4. Try different browser

### Tag ID Not Showing in Admin

**This was fixed in v2.3.3:**
- Tag IDs now display in edit form
- React key prop forces form remount
- Admin endpoint returns full config with Tag IDs

**If broken again:**
1. Check `/api/admin/popups` endpoint returns data
2. Verify JWT authentication working
3. Check React key prop: `key={editingPopup?.id || 'new'}`
4. Rollback to commit `454bb53` if needed

### Split Test Not Tracking Conversions

**Check:**
1. Is the test status "Running"?
2. Are you using the correct test ID in your button/code?
3. Are you submitting with different emails? (same email won't count twice)
4. Check browser console for errors
5. Verify `gc-modal.js` is v2.5.0 or higher

---

## Advanced Patterns

### A/B Testing with Split Tests

**Create two similar popups:**
1. Create Popup A (e.g., headline variation 1)
2. Create Popup B (e.g., headline variation 2)
3. Create split test with both popups
4. Run for at least 1 week
5. Complete test and select winner

**What to test:**
- Headlines (emotional vs. factual)
- Images (product shot vs. lifestyle)
- Button text ("Get Access" vs. "Download Now")
- Layouts (centered vs. side-by-side)

### Seasonal Variations

Create holiday-specific versions:
```javascript
'black-friday-special': {
  name: 'Black Friday Special Offer',
  design: {
    variant: 'red',  // Urgent!
    headline: 'Black Friday Only: 50% Off',
    // ... rest of config
  }
}
```

Swap active popup by changing which ID is used on website.

### Multi-Step Popups (Future)

Not currently supported. Would require:
- Step tracking in state
- Multiple form sections
- Progress indicator
- More complex validation

Consider if conversion rates don't meet goals with current single-step design.

---

## File Locations

**Backend Repository:** `~/.openclaw/workspace`
```
├── app/
│   ├── admin/
│   │   ├── page.js              # Admin dashboard
│   │   └── components/
│   │       └── SplitTestsSection.js  # Split testing UI
│   ├── api/
│   │   ├── popups/route.js      # PUBLIC API (edit this)
│   │   ├── admin/popups/route.js  # ADMIN API (edit this)
│   │   ├── admin/split-tests/   # Split test admin endpoints
│   │   │   ├── route.js         # Create, list tests
│   │   │   └── [testId]/        # Manage individual tests
│   │   ├── split-tests/         # Public conversion endpoint
│   │   │   └── [testId]/convert/route.js
│   │   ├── submit/route.js      # Form submissions
│   │   └── upload/route.js      # Image uploads
│   └── layout.js
├── lib/
│   ├── auth.js                  # JWT verification
│   ├── rate-limit.js            # Redis rate limiter
│   └── security-*.js            # Security helpers
├── releases/
│   └── TECH_SPEC_SPLIT_TESTING_v2.5.0.md  # Technical spec
└── public/
    └── login.html               # Admin login
```

**Frontend Repository:** `~/.openclaw/workspace/gc-modal-library`
```
├── public/
│   └── gc-modal.js              # Client library v2.5.0 with split testing
└── package.json
```

**Documentation:**
```
├── DEPLOYMENT_v2.3.3_FINAL.md   # Deployment guide
├── SECURITY_AUDIT.md            # Security features
├── VERSION.md                   # Version history
├── TEST_RESULTS_2026-05-20.md   # Split testing test results
└── memory/                      # Session memories
```

---

## Security Considerations

### Always Maintain

1. **Tag IDs are sensitive:** Never expose in public API
2. **JWT required for admin:** All sensitive operations need auth
3. **Rate limiting active:** Don't bypass, it protects against spam
4. **Email validation:** RFC 5322 compliance prevents junk submissions
5. **Input sanitization:** XSS protection on firstName field
6. **CORS whitelist:** Only approved domains can submit
7. **Magic byte validation:** Uploaded files checked for actual type
8. **Security headers:** HSTS, CSP, etc. protect against various attacks
9. **Audit logging:** Security events tracked for monitoring

### When Adding Features

**Always:**
- Validate all inputs
- Sanitize user-provided content
- Use prepared statements/parameterized queries
- Check authentication before sensitive operations
- Log security-relevant events
- Test for XSS, CSRF, injection attacks

**Never:**
- Trust client-side validation alone
- Expose sensitive data in public APIs
- Use wildcards in CORS
- Skip rate limiting
- Hard-code secrets in source code
- Disable security features for convenience

---

## Deployment Workflow

### Making Changes

```bash
# 1. Edit popup config in BOTH files
vim app/api/popups/route.js
vim app/api/admin/popups/route.js

# 2. Test locally if possible
# (Currently no local dev setup - test in admin preview)

# 3. Commit with descriptive message
git add app/api/popups/route.js app/api/admin/popups/route.js
git commit -m "Add popup: [Name] with [layout] layout"

# 4. Push to trigger Vercel deploy
git push origin master

# 5. Wait for Vercel (check dashboard or wait ~60 sec)

# 6. Test in admin
# Visit https://gcmodal-api77.vercel.app/admin
# Verify popup appears and all fields correct

# 7. Test on website
# Add ?popup=your-id to URL and test form submission
```

### Rollback Procedure

If deployment breaks:
```bash
# Revert to last working commit
git log --oneline -10  # Find last good commit
git reset --hard <commit-hash>
git push -f origin master

# Known good commits:
# 288e720 - v2.5.0 (current, with split testing)
# 97779ad - v2.4.0 (stable, before split testing)
# 454bb53 - v2.3.3 (Tag IDs working)
```

### Emergency Fixes

If production is broken:
1. **STOP** making changes
2. **IDENTIFY** last working commit
3. **ROLLBACK** immediately
4. **TEST** rollback in admin
5. **INVESTIGATE** what broke
6. **FIX** in separate branch
7. **TEST** thoroughly before merge
8. **DEPLOY** with confidence

**Do NOT:**
- Make multiple rapid commits trying to fix
- Force push without knowing what you're overwriting
- Continue working on broken state
- Skip testing before pushing

---

## Common Popup Templates

### Free Report Offer

```javascript
'free-report-template': {
  name: 'Free Report Template',
  tagId: '69a02963430175cb1007f09d',
  design: {
    variant: 'blue',
    layout: 'side-by-side',
    headline: 'Free Special Report Reveals...',
    subheadline: 'Enter your email and I\'ll send you instant access',
    bodyCopy: '',
    buttonText: 'Send My Free Report',
    image: {
      url: 'https://your-report-cover.jpg',
      position: 'left-side',
      scale: 100
    }
  },
  fields: ['email']
}
```

### Course Access

```javascript
'course-access-template': {
  name: 'Course Access Template',
  tagId: '69a02963430175cb1007f09d',
  design: {
    variant: 'green',
    layout: 'centered',
    headline: 'Get Instant Course Access',
    subheadline: 'Learn the secrets of...',
    bodyCopy: 'Includes: Video lessons, PDF guides, and bonus materials',
    buttonText: 'Send Login Details',
    image: {
      url: '',
      position: 'none'
    }
  },
  fields: ['firstName', 'email']
}
```

### Product Launch

```javascript
'product-launch-template': {
  name: 'Product Launch Template',
  tagId: '69a02963430175cb1007f09d',
  design: {
    variant: 'orange',
    layout: 'overlay',
    headline: 'Be First to Know',
    subheadline: 'Join the waitlist for exclusive early access',
    bodyCopy: '',
    buttonText: 'Notify Me at Launch',
    image: {
      url: 'https://your-product-image.jpg',
      position: 'top',
      scale: 150
    }
  },
  fields: ['firstName', 'email']
}
```

---

## Performance Optimization

### Image Optimization

**Before Upload:**
1. Resize to max needed dimensions (800x1200px)
2. Compress with tools like TinyPNG
3. Use JPG for photos, PNG for graphics
4. Target 200-500KB file size

**In Config:**
```javascript
image: {
  url: 'https://...',
  scale: 100  // Adjust if image appears too large/small
}
```

### Load Time Optimization

**Current Performance:**
- Library loads: ~50KB gzipped
- API response: ~2KB
- Image load: Depends on image size
- Total: < 1 second on decent connection

**Future Improvements:**
- Lazy load images
- Defer popup display until page ready
- Cache popup configs in localStorage
- Preload critical images

---

## Analytics & Tracking

### Current Tracking

**Global Control Integration:**
- All submissions go to Tag ID `69a02963430175cb1007f09d`
- Email and firstName captured
- Timestamp recorded
- Source tracking via URL parameters

**Split Test Tracking:**
- Conversions recorded per variant
- Deduplication by email
- Real-time stats in admin dashboard
- No minimum sample size required

### Available Metrics

**From Global Control:**
- Total submissions per popup
- Conversion rate (if tracking views)
- Geographic distribution
- Time-series data

**From Admin Dashboard:**
- Split test conversion counts
- Variant performance comparison
- Test status and history

**From Vercel Logs:**
- API response times
- Error rates
- Rate limit hits
- Security events

### Future Analytics

**Potential Additions:**
- Heatmaps showing user interaction
- A/B test result tracking
- Conversion funnel visualization
- Real-time dashboard

---

## Maintenance Schedule

### Daily
- Monitor Vercel logs for errors
- Check Redis rate limit usage
- Verify form submissions reaching Global Control

### Weekly
- Review conversion rates by popup
- Check for any failed deployments
- Update any outdated images or copy

### Monthly
- Review analytics and optimize underperforming popups
- Test all popups on different devices
- Audit security logs for unusual activity
- Update documentation if needed

### Quarterly
- Full security audit
- Performance review and optimization
- Consider new features based on usage
- Update dependencies if needed

---

## Support & Resources

**Admin Dashboard:** https://gcmodal-api77.vercel.app/admin  
**Password:** Set in Vercel env var `ADMIN_PASSWORD`  
**GitHub:** https://github.com/futuretechtoday77/gcmodal-api  
**Vercel:** https://vercel.com/futuretechtoday77s-projects/gcmodal-api77

**Documentation:**
- Current: `DEPLOYMENT_v2.3.3_FINAL.md`
- Security: `SECURITY_AUDIT.md`
- History: `memory/2026-05-19-final.md`
- Split Testing: `releases/TECH_SPEC_SPLIT_TESTING_v2.5.0.md`

**Contact:**
- User: Joshua Parker
- Email: joshua@healthharmonic.com
- Telegram: @knowingtruth

---

## Quick Reference Card

**Create Popup:**
1. Design popup (headline, image, layout)
2. Add to both `/app/api/popups/route.js` AND `/app/api/admin/popups/route.js`
3. `git commit -m "Add popup: [name]"`
4. `git push origin master`
5. Wait 60 seconds for deploy
6. Test in admin and on website

**Create Split Test:**
1. Go to https://gcmodal-api77.vercel.app/admin
2. Scroll to "Split Tests (A/B Testing)"
3. Click "+ Create Split Test"
4. Select two popups, choose trigger type
5. Click "Create Split Test"
6. Copy implementation code
7. Add button/code to your website

**Edit Existing:**
1. Find popup in both route files
2. Update fields (keep files in sync!)
3. Commit and push
4. Verify in admin

**Complete Split Test:**
1. Click "Complete" on running test
2. Review conversion counts
3. Select winner
4. Click "Complete Test"

**Upload Image:**
1. Login to admin dashboard
2. Use upload form (bottom of page)
3. Copy Blob Storage URL
4. Update popup config with new URL

**Troubleshoot:**
1. Check Vercel deployment status
2. Verify in admin dashboard
3. Test with `?popup=id&force=true`
4. Check browser DevTools → Network tab
5. Review Vercel logs if needed

**Emergency Rollback:**
```bash
git reset --hard 288e720  # v2.5.0 with split testing
git push -f origin master
```

---

**Version:** 2.6.0  
**Last Updated:** 2026-05-21  
**Status:** Production-ready with Split Testing and Folder Organization

**END OF SKILL**
