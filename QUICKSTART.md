# Quick Start Guide

Get started converting your first dynamic website to a static site in under 5 minutes!

## Prerequisites Check

Before you begin, ensure you have:

```bash
# Check Node.js (v14+)
node --version

# Check Python (3.6+)
python3 --version

# Check Git
git --version
```

If any are missing, install them:
- **Node.js**: https://nodejs.org/
- **Python**: https://www.python.org/downloads/
- **Git**: https://git-scm.com/downloads

## Setup (One-time)

1. **Clone this repository:**
```bash
git clone https://github.com/FreeForCharity/FFC-EX-SRRN.net.git
cd FFC-EX-SRRN.net
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Set up GitHub authentication** (choose ONE option):

   **Option A: GitHub CLI (Recommended)**
   ```bash
   # Install gh (GitHub CLI)
   # macOS: brew install gh
   # Windows: choco install gh
   # Linux: See https://cli.github.com/
   
   # Authenticate
   gh auth login
   ```

   **Option B: Environment Variable**
   ```bash
   export GITHUB_TOKEN="your_github_token_here"
   ```

   **Option C: Git Credentials**
   ```bash
   git config --global credential.helper store
   # Then perform any git push to save credentials
   ```

## Usage

### Convert Your First Site

Let's convert `example.com` to a static site:

```bash
# Step 1: Scrape the website
node ./scripts/identify_and_scrape.js "https://example.com" "./my-site"

# Step 2: Repair layout issues
node ./scripts/repair_site.js "./my-site"

# Step 3: Deploy to GitHub
python3 ./scripts/github_push.py "./my-site" "YourGitHubUsername/example-static"
```

**That's it!** Your site will be live at:
`https://yourgithubusername.github.io/example-static/`

(Wait 2-5 minutes for GitHub Pages to deploy)

## Real Example

Here's a real conversion of a WordPress site:

```bash
# Convert a WordPress blog
node ./scripts/identify_and_scrape.js "https://myblog.wordpress.com" "./blog-static"
node ./scripts/repair_site.js "./blog-static"
python3 ./scripts/github_push.py "./blog-static" "myorg/blog-archive"
```

## What Each Script Does

### 1. identify_and_scrape.js
- Downloads all HTML, CSS, JS, images
- Preserves site structure
- Detects CMS type (WordPress, Joomla, etc.)
- **Time:** 1-10 minutes depending on site size

### 2. repair_site.js
- Wraps videos in responsive containers (16:9)
- Converts absolute URLs to relative
- Adds responsive CSS
- Fixes common layout issues
- **Time:** Seconds to 1 minute

### 3. github_push.py
- Creates GitHub repository
- Pushes all files
- Enables GitHub Pages
- Provides live URL
- **Time:** 30 seconds to 2 minutes

## Common Issues & Solutions

### Issue: "No GitHub credentials found"

**Solution:** Set up authentication (see Setup step 3 above)

### Issue: "Repository already exists"

**Solution:** The script will use the existing repository and push updates to it.

### Issue: "Site looks different from original"

**Solutions:**
1. Check browser console for errors (F12)
2. Look for broken links to external resources
3. Some dynamic features (forms, search) won't work in static sites
4. Consider manual CSS adjustments in the output directory

### Issue: "Videos are stretched or broken"

**Solution:** The repair script should fix this. If not:
1. Check that `fluid-width-video-wrapper` class is present
2. Verify the repair-css style block is injected
3. Try running repair script again

## Next Steps

Once your site is live:

1. **Test everything:**
   - Navigation links
   - Images loading
   - Videos playing
   - Mobile responsiveness

2. **Add features:**
   - Custom domain (GitHub Pages settings)
   - Google Analytics
   - Contact forms (use Formspree)
   - Comments (use Disqus)

3. **Maintain:**
   - Re-run conversion if source site changes
   - Keep repository up to date

## Advanced: Use GitHub Actions

You can automate the entire process with GitHub Actions:

1. Go to your repository on GitHub
2. Click "Actions" tab
3. Click "Static Site Conversion" workflow
4. Click "Run workflow"
5. Enter the URL and target repository
6. Click "Run workflow"

The entire process runs automatically!

## Getting Help

- **Issues**: Open an issue on GitHub
- **Documentation**: See [README.md](README.md)
- **Examples**: Check the Issues tab for completed conversions

## Tips for Success

1. **Start small:** Test with a small site first (5-10 pages)
2. **Check robots.txt:** Make sure scraping is allowed
3. **Respect rate limits:** Large sites may take time
4. **Test locally:** Review files before pushing to GitHub
5. **Backup originals:** Keep the original site accessible

## Example Commands Reference

```bash
# Scrape
node ./scripts/identify_and_scrape.js "URL" "OUTPUT_DIR"

# Repair
node ./scripts/repair_site.js "OUTPUT_DIR"

# Deploy
python3 ./scripts/github_push.py "OUTPUT_DIR" "OWNER/REPO"
```

## Success Checklist

After conversion, verify:
- [ ] Site loads at GitHub Pages URL
- [ ] Homepage displays correctly
- [ ] Navigation works
- [ ] Images load
- [ ] Videos play (if any)
- [ ] Mobile view works
- [ ] No console errors

---

**Ready to convert your site?** Follow the steps above and you'll have a static site in minutes!

For detailed information, see the [full README](README.md).
