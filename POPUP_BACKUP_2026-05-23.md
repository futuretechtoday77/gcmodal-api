# Popup Configuration Backup
**Date:** 2026-05-23
**Version:** Pre-beta cleanup

## ⚠️ CRITICAL: RedLight Popups (10 total - SAVE THESE!)
**Tag ID:** `6942461446aba476ddd3ae8c`

### 1. redlight-athlete
- **Name:** RedLightResearch - The Secret To Aging Backwards
- **Headline:** FREE REPORT: The Secret To Aging Backwards
- **Subheadline:** Discover how near-infrared and red light therapy may support:
- **Body:** • Skin rejuvenation • Cellular energy • Recovery • Brain health • Healthy aging
- **Button:** Get Instant Access
- **Image:** popup-redlight-athlete-l0nzaaJ22wiJ88KBFE7HY3YBtW2RLk.jpg

### 2. redlight-spa
- **Name:** RedLightResearch - Light Deficiency
- **Headline:** What If Aging Is Partly A Light Deficiency Problem?
- **Subheadline:** The science of photobiomodulation suggests certain wavelengths help support cellular energy, circulation, collagen, and mitochondrial function.
- **Body:** Enter your email below and I'll send you my 23-page research-backed guide on red and near-infrared light therapy.
- **Button:** Read The Research Report
- **Image:** popup-redlight-spa-qgQPRDwIthYG7xdiCGNdoqMJJxMFlE.jpg

### 3. redlight-ancestors
- **Name:** RedLightResearch - Ancestors Light
- **Headline:** Your Ancestors Got Something Every Day You Barely Get At All
- **Subheadline:** Red and near-infrared light.
- **Body:** Modern indoor living blocks many of the most biologically important wavelengths for cellular repair and recovery. Learn how photobiomodulation works in my free guide.
- **Button:** Get The Free Guide
- **Image:** popup-redlight-spa-qgQPRDwIthYG7xdiCGNdoqMJJxMFlE.jpg

### 4. redlight-starving
- **Name:** RedLightResearch - Starving For Light
- **Headline:** The Modern World Is Starving Your Cells
- **Subheadline:** Most people are overexposed to artificial blue light… while being deprived of the healing red and near-infrared wavelengths human biology evolved with.
- **Body:** Discover how specific wavelengths of light may support mitochondrial energy, skin repair, recovery, and healthy aging.
- **Button:** Download The Free Report
- **Image:** popup-redlight-athlete-l0nzaaJ22wiJ88KBFE7HY3YBtW2RLk.jpg

### 5. redlight-industry-secret
- **Name:** RedLightResearch - Industry Secret
- **Headline:** The Anti-Aging Industry Barely Talks About This
- **Subheadline:** Your mitochondria respond to light.
- **Body:** Learn why researchers are studying red and near-infrared wavelengths for skin health, recovery, inflammation, and cognitive support.
- **Button:** Download Free PDF
- **Image:** popup-redlight-spa-qgQPRDwIthYG7xdiCGNdoqMJJxMFlE.jpg

### 6. redlight-before-buy
- **Name:** RedLightResearch - Before You Buy
- **Headline:** Before You Buy A Red Light Panel…
- **Subheadline:** Read this first.
- **Body:** Most people don't understand wavelengths, penetration depth, irradiance, or why device quality matters. Get my free buyer's guide.
- **Button:** Download Free Buyer's Guide
- **Image:** popup-redlight-athlete-l0nzaaJ22wiJ88KBFE7HY3YBtW2RLk.jpg

### 7. redlight-drowning
- **Name:** RedLightResearch - Drowning In Frequencies
- **Headline:** You're Drowning In Artificial Frequencies…
- **Subheadline:** …but starving for regenerative light.
- **Body:** Learn why specific wavelengths may be critical for recovery, energy, sleep, and healthy aging.
- **Button:** Download The Report
- **Image:** popup-redlight-spa-qgQPRDwIthYG7xdiCGNdoqMJJxMFlE.jpg

### 8. redlight-wavelengths
- **Name:** RedLightResearch - 9 Wavelengths
- **Headline:** The 9 Most Important Light Wavelengths Explained
- **Subheadline:** A practical science-forward guide to photobiomodulation and wide-spectrum red light therapy.
- **Body:** Includes 480nm, 590nm, 630nm, 660nm, 670nm, 810nm, 830nm, 850nm, and 1060nm.
- **Button:** Send Me The PDF
- **Image:** popup-redlight-athlete-l0nzaaJ22wiJ88KBFE7HY3YBtW2RLk.jpg

### 9. redlight-missing-half
- **Name:** RedLightResearch - Missing Half
- **Headline:** Most Red Light Panels Are Missing Half The Story
- **Subheadline:** Different wavelengths affect different tissues.
- **Body:** Learn why wide-spectrum photobiomodulation may outperform basic 660nm/850nm-only systems.
- **Button:** Get The Free Report
- **Image:** popup-redlight-athlete-l0nzaaJ22wiJ88KBFE7HY3YBtW2RLk.jpg

### 10. redlight-designed-outdoors
- **Name:** RedLightResearch - Designed For Outdoors
- **Headline:** We Were Designed For Sunlight — Not Screens
- **Subheadline:** Artificial indoor living may be disrupting your biology in ways most people never consider.
- **Body:** Discover the regenerative science of red and near-infrared light therapy.
- **Button:** Get Instant Access
- **Image:** popup-redlight-spa-qgQPRDwIthYG7xdiCGNdoqMJJxMFlE.jpg

---

## Confirmed Working Popups (10 currently deployed)

### Nitriloside/ForbiddenFood (tag: 69a02963430175cb1007f09d)
1. `forbiddenfood-nitriloside`
2. `nitriloside-course`
3. `Nitriloside ForbiddenFood Course`
4. `ApricotSeed ForbiddenFood Course`
5. `nitrilosides-optin`

### RifeLead/Frequency (tag: 68cb4cbb97f1fa5d35ebf6f3)
6. `frequency-generator-report`
7. `rifelead-scientist-bw`
8. `rifelead-scientist-sepia`
9. `rifelead-microscope`
10. `rifelead-waveforms`

---

## Full Static Config Backup Location

All popup configs (including deleted ones) can be recovered from git history:
```bash
git show HEAD~1:app/api/popups/route.js
```

This includes:
- ForbiddenFood campaign (6 popups)
- RifeLead campaign (4 popups) 
- RedLightResearch campaign (10 popups)
- Other test popups

---

## Known Issues
1. Split test API has separate static config — must keep in sync with /api/popups
2. Phone field support added but not enabled in popup configs (fields array)
3. Tagging fixed using fire-tag endpoint (not contact/{id}/tags)

---

## Next Steps for Auto-Deployment
1. Move all popups to Control Board database
2. Remove static configs from code
3. Fetch popup configs dynamically from Control Board
4. Split test should use same dynamic source
