# MV Popup Manager Skill

**Purpose:** Create, modify, and manage lead capture popups for HealthHarmonic.com using the MV Popup Manager system.

**Version:** 2.3.3  
**Status:** Production  
**Last Updated:** 2026-05-19

---

## When to Use This Skill

Use this skill when the user asks to:
- Create a new popup
- Modify an existing popup
- Add new popup layouts or styles
- Test popup designs
- Deploy popup changes
- Troubleshoot popup issues

**Do NOT use for:**
- General website changes unrelated to popups
- Email marketing campaigns (use different tool)
- Analytics/tracking setup (separate concern)

---

## System Overview

### Architecture

**Frontend Library:**
- URL: https://gcmodal.vercel.app/gc-modal.js
- Renders popups on HealthHarmonic.com
- Handles form submissions
- Repository: `gc-modal-library/`

**Backend API:**
- URL: https://gcmodal-api77.vercel.app
- Admin: https://gcmodal-api77.vercel.app/admin
- Handles submissions, uploads, authentication
- Repository: Main workspace (`~/.openclaw/workspace`)

### Current Popup Configuration

**Popups are hardcoded in TWO files:**
1. `/app/api/popups/route.js` - Public API (no Tag IDs)
2. `/app/api/admin/popups/route.js` - Admin API (with Tag IDs)

**Important:** Changes must be made to BOTH files to keep them in sync.

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

---

## Advanced Patterns

### A/B Testing (Manual)

Create two similar popups with different:
- Headlines
- Images
- Button text
- Layouts

Track conversions in Global Control by Tag ID or popup name.

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
│   ├── admin/page.js              # Admin dashboard
│   ├── api/
│   │   ├── popups/route.js        # PUBLIC API (edit this)
│   │   ├── admin/popups/route.js  # ADMIN API (edit this)
│   │   ├── submit/route.js        # Form submissions
│   │   └── upload/route.js        # Image uploads
│   └── layout.js
├── lib/
│   ├── auth.js                    # JWT verification
│   ├── rate-limit.js              # Redis rate limiter
│   └── security-*.js              # Security helpers
└── public/
    └── login.html                  # Admin login
```

**Frontend Repository:** `~/.openclaw/workspace/gc-modal-library`
```
├── public/
│   └── gc-modal.js                # Client library (deployed separately)
└── package.json
```

**Documentation:**
```
├── DEPLOYMENT_v2.3.3_FINAL.md     # Current deployment guide
├── SECURITY_AUDIT.md              # Security features
└── memory/2026-05-19-final.md     # Recent changes
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
# 454bb53 - v2.3.3 (current, Tag IDs working)
# 75a0aac - v2.3.2 (Tag IDs don't display but work)
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

### Available Metrics

**From Global Control:**
- Total submissions per popup
- Conversion rate (if tracking views)
- Geographic distribution
- Time-series data

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

**Edit Existing:**
1. Find popup in both route files
2. Update fields (keep files in sync!)
3. Commit and push
4. Verify in admin

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
git reset --hard 454bb53
git push -f origin master
```

---

**Version:** 2.3.3  
**Last Updated:** 2026-05-19  
**Status:** Production-ready

**END OF SKILL**
