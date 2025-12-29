# Manual Steps for Completing SRRN.net Conversion

## Prerequisites

This document outlines the manual steps needed to complete the conversion when network access to srrn.net is available.

## Problem

The live site https://srrn.net is currently not accessible from the automated environment due to:
1. DNS resolution failures
2. Network restrictions

## Solution

The conversion must be completed manually or in an environment with proper network access.

## Step-by-Step Instructions

### 1. Verify Network Access

First, confirm you can access the site:

```bash
# Test connectivity
curl -I https://srrn.net/
ping srrn.net

# If these work, proceed to step 2
```

### 2. Run the Automated Scraper

From the repository root:

```bash
# Install dependencies (if not already done)
npm install

# Run the comprehensive scraper
npm run scrape:all

# This will:
# - Scrape all 11 identified pages
# - Download all assets (CSS, JS, images, fonts)
# - Create proper directory structure
# - Save metadata
```

### 3. Verify Completion

```bash
# Check that all pages were downloaded
npm run verify

# Expected output: "Found: 11/11"
```

### 4. Apply Repairs

```bash
# Fix responsive layouts and common issues
npm run repair

# This will:
# - Add responsive video wrappers
# - Fix absolute URLs to relative paths
# - Inject responsive CSS
```

### 5. Manual Verification

Test each page locally:

```bash
# Open in browser
python3 -m http.server 8000

# Then visit:
# http://localhost:8000/
# http://localhost:8000/about-us/
# http://localhost:8000/donate/
# etc.
```

Check for:
- [ ] All pages load correctly
- [ ] Navigation links work
- [ ] Images display properly
- [ ] CSS/JavaScript loads
- [ ] Responsive design works on mobile
- [ ] Videos are embedded correctly

### 6. Commit Changes

```bash
# Review what will be committed
git status

# Add all new pages
git add .

# Commit with descriptive message
git commit -m "Complete conversion of all SRRN.net pages

- Added About Us page
- Added Donate page
- Added Aftercare page
- Added Events page
- Added News page
- Added Request a Training page
- Added Talk Today page
- Added Training Calendar page
- Added Training page
- Added Trainings Offered page

All pages scraped, repaired, and verified."

# Push to GitHub
git push
```

## Alternative: Manual Page-by-Page Scraping

If the automated scraper fails, you can scrape pages individually:

```bash
# For each page, run:
node scripts/identify_and_scrape.js "https://srrn.net/about-us/" "./temp"

# Then move to correct location:
mkdir -p about-us
mv temp/about-us/* about-us/
rm -rf temp

# Repeat for each page:
# - /donate/
# - /aftercare/
# - /events/
# - /news/
# - /request-a-training/
# - /talk-today/
# - /training-calendar/
# - /training/
# - /trainings-offered/
```

## Alternative: Use Internet Archive

If srrn.net is down, you can try archived versions:

```bash
# Check for archived versions
python3 scripts/check_wayback.py

# If archives exist, scrape from archive.org
# Example:
node scripts/identify_and_scrape.js \
  "https://web.archive.org/web/20241220/https://srrn.net/about-us/" \
  "./temp"
```

## Troubleshooting

### "Cannot resolve host"

- Check DNS settings
- Try from a different network
- Use a VPN
- Contact site administrator

### "403 Forbidden" or "429 Too Many Requests"

- Reduce `requestConcurrency` in scripts/scrape_all_pages.js
- Add delays between requests
- Use browser DevTools to save pages manually

### Incomplete Downloads

- Check console output for errors
- Increase `maxRecursiveDepth` in scraper config
- Verify URL list is complete
- Try scraping problem pages individually

## Current Status

✅ **Completed:**
- Automated scraping scripts created
- URL discovery tool working
- Verification tool ready
- Documentation complete
- All tooling tested and ready

❌ **Pending:**
- Network access to srrn.net required
- Actual page downloads (10 pages)
- Final verification
- Deployment

## Next Actions Required

**Someone with network access to srrn.net needs to:**

1. Clone this repository
2. Run `npm install`
3. Run `npm run scrape:all`
4. Run `npm run repair`
5. Run `npm run verify`
6. Commit and push the changes

## Contact

If you encounter issues or need assistance:
- Create an issue in this repository
- Include error messages and screenshots
- Describe your environment (OS, Node version, network)
