# Static Site Conversion Workflow

This repository contains tools and documentation for converting dynamic websites (e.g., WordPress, Joomla, Drupal) into high-fidelity static sites hosted on GitHub Pages.

## Overview

The conversion process consists of three main steps:

1. **Scrape**: Download the dynamic website to a local directory
2. **Repair**: Fix common layout issues and ensure proper rendering
3. **Deploy**: Push the static site to GitHub and enable GitHub Pages

## Prerequisites

### Required Software

- **Node.js** (v14 or higher)
- **Python 3** (v3.6 or higher)
- **Git**

### GitHub Authentication

You need one of the following for deployment:

- **GitHub CLI** (`gh`) installed and authenticated, OR
- **GITHUB_TOKEN** environment variable set, OR
- **~/.git-credentials** file configured

## Installation

1. Clone this repository:
```bash
git clone https://github.com/FreeForCharity/FFC-EX-SSRN.net.git
cd FFC-EX-SSRN.net
```

2. Install Node.js dependencies:
```bash
npm install
```

## Usage

### Quick Start

Convert a website in three commands:

```bash
# 1. Scrape the website
node ./scripts/identify_and_scrape.js "https://example.com" "./dist"

# 2. Repair layout issues
node ./scripts/repair_site.js "./dist"

# 3. Deploy to GitHub
python3 ./scripts/github_push.py "./dist" "YourOrg/repo-name"
```

### Step 1: Scrape the Website

Download all assets from the target website:

```bash
node ./scripts/identify_and_scrape.js "<URL>" "<OUTPUT_DIR>"
```

**Example:**
```bash
node ./scripts/identify_and_scrape.js "https://example.com" "./dist"
```

**What it does:**
- Downloads all HTML, CSS, JavaScript, images, and other assets
- Detects the site type (WordPress, Joomla, Drupal, etc.)
- Converts to a static file structure
- Saves metadata about the scraping process

**Options:**
- `<URL>`: The full URL of the website to scrape
- `<OUTPUT_DIR>`: Directory where scraped files will be saved

### Step 2: Repair the Site

Fix common layout and rendering issues:

```bash
node ./scripts/repair_site.js "<SITE_DIR>"
```

**Example:**
```bash
node ./scripts/repair_site.js "./dist"
```

**What it does:**
- Wraps videos in responsive containers (16:9 aspect ratio)
- Fixes absolute URLs to relative paths
- Injects CSS for responsive layouts
- Ensures images scale properly
- Fixes common overflow issues

**Repairs performed:**
- ✅ Responsive video wrappers (`fluid-width-video-wrapper` class)
- ✅ YouTube, Vimeo, and other embedded videos
- ✅ Path conversion from absolute to relative
- ✅ Responsive image sizing
- ✅ Overflow-x prevention

### Step 3: Deploy to GitHub

Create a GitHub repository and push the static site:

```bash
python3 ./scripts/github_push.py "<SITE_DIR>" "<REPO_NAME>"
```

**Example:**
```bash
python3 ./scripts/github_push.py "./dist" "MyOrg/my-static-site"
```

**What it does:**
- Creates a new GitHub repository (or uses existing one)
- Initializes git in the site directory
- Commits all files
- Pushes to GitHub
- Enables GitHub Pages automatically
- Provides the live URL

**Repository name format:**
- Must be in format: `owner/repo-name`
- Example: `FreeForCharity/example-static-site`

## Quick Start for SRRN.net Conversion

To complete the conversion of the remaining SRRN.net pages:

```bash
# Install dependencies
npm install

# Verify current status
npm run verify

# Scrape all missing pages (requires network access to srrn.net)
npm run scrape:all

# OR run the complete conversion workflow
npm run convert
```

See [CONVERSION_GUIDE.md](CONVERSION_GUIDE.md) for detailed instructions.

## GitHub Copilot Prompt

Use this prompt with GitHub Copilot to convert a new site:

```
I need to convert a dynamic website (e.g., WordPress) into a high-fidelity static site hosted on GitHub Pages. Please help me execute the following 3-step workflow using Node.js and Python.

Context: I have three scripts in my scripts/ directory that automate this process:
- identify_and_scrape.js: Uses website-scraper to download the site.
- repair_site.js: Automated post-processing to fix common layout issues (e.g., responsive video wrappers).
- github_push.py: Creates a repo and pushes code.

Your Task: Guide me through converting the site [INSERT URL HERE] to a new repository named [INSERT REPO NAME HERE].

Step 1: Scrape
Run the Node.js scraper to download the site assets to a local folder.
node ./scripts/identify_and_scrape.js "[URL]" "./dist"

Step 2: Repair
Run the repair script to inject necessary CSS for video aspect ratios (16:9) and fixing absolute paths.
node ./scripts/repair_site.js "./dist"

Step 3: Deploy
Push the repaired files to GitHub using the Python script. If I have ~/.git-credentials or GITHUB_TOKEN set, use them automatically.
python3 ./scripts/github_push.py "./dist" "[REPO_NAME]"

Please verify the commands before running them and let me know when the site is live on GitHub Pages.
```

## Issue Template

When tracking a site conversion, use this issue template:

### Site Conversion Request

**Target Website URL:** [e.g. https://example.com]  
**Target Repository Name:** [e.g. Organization/site-static-export]

#### Phase 1: Conversion
- [ ] **Scrape Site**: Run `node ./scripts/identify_and_scrape.js <URL> <DIR>`
- [ ] **Automated Repair**: Run `node ./scripts/repair_site.js <DIR>`
    - [ ] Verify `fluid-width-video-wrapper` classes are added (if videos exist)
    - [ ] Verify `repair-css` style block is injected

#### Phase 2: Deployment
- [ ] **Push to GitHub**: Run `python3 ./scripts/github_push.py <DIR> <REPO_NAME>`
- [ ] **Enable GitHub Pages**: Confirmed Pages is active in repo settings (Script should do this automatically)

#### Phase 3: Visual Verification
- [ ] **Live URL**: [Link to GitHub Pages site]
- [ ] **Video Check**: Verify videos are 16:9 and not stretched
- [ ] **Interactive Elements**: Check menus, buttons, and links
    - [ ] *Note specific broken elements here (e.g., contact forms, search bars)*

#### Notes
> [!IMPORTANT]
> If the original site used server-side plugins (like "Donate" buttons or Forms), they may need manual reimplementation in `repair_site.js` or via manual HTML edits.

## Troubleshooting

### Authentication Issues

**Problem:** "No GitHub credentials found"

**Solutions:**
1. Install and authenticate GitHub CLI:
   ```bash
   gh auth login
   ```

2. Or set environment variable:
   ```bash
   export GITHUB_TOKEN="your_token_here"
   ```

3. Or configure git credentials:
   ```bash
   git config --global credential.helper store
   # Then perform any git operation to save credentials
   ```

### Scraping Issues

**Problem:** Some assets are not downloaded

**Solution:** Check the URL filter in `identify_and_scrape.js`. By default, it only downloads resources from the same domain.

**Problem:** Site looks different from the original

**Solution:** Run the repair script and check for:
- Missing CSS files
- JavaScript that requires server-side processing
- Dynamic content that needs manual recreation

### Deployment Issues

**Problem:** GitHub Pages not enabled automatically

**Solution:** Manually enable GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages section
3. Select source: Deploy from branch `main` `/root`

**Problem:** 404 error on GitHub Pages

**Solution:** 
- Ensure `index.html` exists in the root directory
- Wait 2-5 minutes for GitHub Pages to build
- Check GitHub Actions for build errors

## Known Limitations

### Dynamic Features
Static sites cannot replicate:
- Contact forms (consider using services like Formspree, Netlify Forms)
- User authentication
- Database-driven content
- Server-side search (consider using client-side search like Lunr.js)
- Shopping carts (consider Snipcart, Shopify Buy Button)

### Server-Side Plugins
WordPress plugins that run server-side code will not work:
- Donation buttons → Use Stripe, PayPal buttons
- Newsletter signups → Use service APIs (Mailchimp, etc.)
- Comments → Use Disqus or similar
- Analytics → Use Google Analytics, Plausible

### Recommended Workarounds
1. **Forms**: Integrate Formspree, Google Forms, or Netlify Forms
2. **Search**: Add Lunr.js or Algolia DocSearch
3. **Comments**: Add Disqus, Utterances, or giscus
4. **E-commerce**: Use Snipcart or Shopify Buy Button

## Advanced Usage

### Custom Repairs

Modify `repair_site.js` to add custom repair logic:

```javascript
// Add custom repair function
function customRepair(document) {
  // Your custom logic here
  // Example: Remove specific elements
  const elementsToRemove = document.querySelectorAll('.unwanted-class');
  elementsToRemove.forEach(el => el.remove());
}
```

### Scraping Configuration

Modify `identify_and_scrape.js` options:

```javascript
const options = {
  // ... existing options
  maxRecursiveDepth: 20,  // Increase depth
  requestConcurrency: 10,  // More concurrent requests
  // Add custom URL filter
  urlFilter: (url) => {
    // Your custom logic
    return true;
  }
};
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

## Credits

- **website-scraper**: For the core scraping functionality
- **jsdom**: For HTML manipulation
- **GitHub Pages**: For hosting static sites

---

**Maintained by:** FreeForCharity  
**Repository:** https://github.com/FreeForCharity/FFC-EX-SSRN.net
