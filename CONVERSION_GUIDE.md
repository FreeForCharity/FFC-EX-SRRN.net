# Complete Static Pages Conversion Guide

## Overview

This document provides instructions for completing the conversion of all pages from the SRRN.net live site to this static GitHub repository **for deployment via GitHub Pages** (the sole supported deployment method).

For recommended external services and implementation patterns, see **[FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)**.

## Current Status

As of the last scrape (December 20, 2024), the following has been completed:
- ✅ Home page (index.html) - Scraped
- ✅ Initial site structure (CSS, JS, fonts, images) - Downloaded

## Pages Still Needed

The following pages have been identified from the site navigation and need to be scraped:

1. `/about-us/` - About Us page
2. `/donate/` - Donate page  
3. `/aftercare/` - Aftercare page
4. `/events/` - Special Events page
5. `/news/` - News page
6. `/request-a-training/` - Request a Training page
7. `/talk-today/` - Talk Today page
8. `/training-calendar/` - Training Calendar page
9. `/training/` - Training page
10. `/trainings-offered/` - Trainings Offered page

## How to Complete the Conversion

### Option 1: Automatic Scraping (Recommended)

If you have network access to https://srrn.net, use the automated scraping script:

```bash
# 1. Navigate to the repository root
cd /path/to/FFC-EX-SRRN.net

# 2. Ensure dependencies are installed
npm install

# 3. Run the comprehensive scraper
node scripts/scrape_all_pages.js

# 4. Run the repair script to fix layouts
node scripts/repair_site.js .

# 5. Verify all pages were downloaded
ls -la *.html
ls -la */index.html
```

### Option 2: Manual URL Discovery

If you need to discover additional URLs not found in the navigation:

```bash
# Analyze existing HTML files for links
node scripts/discover_urls.js ./index.html

# Review the generated urls-to-scrape.json
cat urls-to-scrape.json

# Update scripts/scrape_all_pages.js with any new URLs
# Then run the scraper as described in Option 1
```

### Option 3: Individual Page Scraping

To scrape individual pages one at a time:

```bash
# Scrape a single page
node scripts/identify_and_scrape.js "https://srrn.net/about-us/" "./temp-about"

# Move the downloaded files to the correct location
mv ./temp-about/about-us/* ./about-us/
rm -rf ./temp-about

# Repeat for each page
```

## Verification Checklist

After scraping, verify the following:

- [ ] All 11 identified pages have been downloaded
- [ ] Each page has its own directory with an index.html file
- [ ] Navigation links work between pages
- [ ] Images, CSS, and JavaScript files are present
- [ ] No broken links or 404 errors
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Videos are properly embedded and responsive

## Expected Directory Structure

After complete conversion, the repository should have:

```
FFC-EX-SRRN.net/
├── index.html                  # Home page
├── about-us/
│   └── index.html
├── donate/
│   └── index.html
├── aftercare/
│   └── index.html
├── events/
│   └── index.html
├── news/
│   └── index.html
├── request-a-training/
│   └── index.html
├── talk-today/
│   └── index.html
├── training-calendar/
│   └── index.html
├── training/
│   └── index.html
├── trainings-offered/
│   └── index.html
├── css/                        # Shared stylesheets
├── js/                         # Shared JavaScript
├── images/                     # Shared images
├── fonts/                      # Web fonts
└── scripts/                    # Scraping and build scripts
```

## Troubleshooting

### Site Not Accessible

If `https://srrn.net` is not accessible:
- Check if the domain is still active
- Try accessing with a VPN or different network
- Consider using Internet Archive (archive.org) if the site is offline

### Incomplete Scraping

If some pages are missing after scraping:
- Check the console output for errors
- Increase `maxRecursiveDepth` in scrape_all_pages.js
- Verify the URL list is complete in scripts/scrape_all_pages.js
- Try scraping problematic pages individually

### Broken Links

If internal links don't work:
- Run the repair script: `node scripts/repair_site.js .`
- Check that relative paths are correct
- Verify directory structure matches expected paths

## Next Steps After Completion

1. **Test Locally**: Open index.html in a browser and test all navigation
2. **Run Repair Script**: Apply responsive fixes with `node scripts/repair_site.js .`
3. **Commit Changes**: Commit all downloaded pages to git
4. **Deploy to GitHub Pages**: Push to GitHub and verify GitHub Pages is working
5. **Validate**: Test the live GitHub Pages site thoroughly
6. **Replace Dynamic Features**: Implement external service integrations (see below)

## External Services for Dynamic Features

The SRRN.net site includes features that require external services when converted to a static site hosted on GitHub Pages. See **[FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)** for implementation examples.

### Required Replacements

1. **Training Calendar** (`/training-calendar/`)
   - **Current**: WordPress Modern Events Calendar Lite plugin (requires database)
   - **Recommended Replacement Option 1 (preferred)**: Static HTML calendar with links to external event pages (e.g., Facebook events). Create or update the calendar by:
     - Opening a GitHub issue (for example, titled **"Update training calendar"**), assigning it to the **GitHub Copilot Pro Agent**, and including:
       - Links to the existing calendar or event sources (e.g., Facebook page, legacy calendar)
       - The date range to include and any recurrence rules
       - Any layout/design constraints or examples to match
     - Ensuring the agent has access to this repository so it can read existing HTML and create or modify the calendar markup
     - If the Copilot Pro Agent is not available, follow the manual static calendar workflow described in `EXTERNAL_SERVICES.md` (Option B - Manual HTML Editing, lines 166-170) to hand-edit the calendar HTML
   - **Recommended Replacement Option 2**: Facebook Events widget (via [SociableKit](https://www.sociablekit.com))
   - **Template Reference**: See events section in FFC-IN-Single_Page_Template_HTML

2. **Donation Forms** (if present)
   - **Recommended**: [Zeffy](https://www.zeffy.com) embedded donation forms (zero platform fees for nonprofits)
   - **Template Reference**: See donate section in FFC-IN-Single_Page_Template_HTML

3. **Contact Forms** (if present)
   - **Recommended**: Zeffy Forms or Microsoft Forms
   - **Template Reference**: FFC-IN-Single_Page_Template_HTML examples

4. **Analytics** (optional)
   - **Recommended**: Google Analytics
   - **Template Reference**: FFC-IN-Single_Page_Template_HTML implementation

## Tools Reference

- `scripts/scrape_all_pages.js` - Scrapes all identified pages
- `scripts/discover_urls.js` - Discovers URLs from existing HTML
- `scripts/identify_and_scrape.js` - Scrapes individual URLs
- `scripts/repair_site.js` - Fixes common layout issues
- `scripts/github_push.py` - Deploys to GitHub Pages

## Contact

For questions or issues with the conversion process, please create an issue in this repository.
