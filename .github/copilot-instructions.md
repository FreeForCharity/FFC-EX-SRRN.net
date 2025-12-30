# GitHub Copilot Instructions for FFC-EX-SRRN.net

This file provides essential context for GitHub Copilot coding agents working on this repository for the first time.

## Repository Overview

This repository serves dual purposes:
1. **Static Site Conversion Toolkit** - A reusable framework for converting dynamic websites (WordPress, Joomla, Drupal) to static sites
2. **SRRN.net Static Site** - The converted static version of the SRRN.net nonprofit website

**Deployment Method**: GitHub Pages is the **sole supported deployment method**. All scripts, workflows, and documentation are designed exclusively for GitHub Pages hosting.

## Technology Stack

### Core Technologies
- **Node.js** (v14+) - For scraping and site repair scripts
- **Python 3** (v3.6+) - For GitHub deployment automation
- **Git** - Version control and deployment

### Key Dependencies
- **website-scraper** (v5.3.1) - Downloads entire websites to local static files
- **jsdom** (v23.0.1) - DOM manipulation for HTML repairs
- **GitHub Pages** - Static site hosting platform

### Development Tools
- **npm scripts** - All common operations are wrapped in package.json scripts
- **GitHub Actions** - Automated workflow for site conversion (see `.github/workflows/convert-site.yml`)

## Project Structure

```
FFC-EX-SRRN.net/
├── index.html                      # Home page (scraped content)
├── about-us/                       # Individual page directories
├── donate/
├── aftercare/
├── events/
├── news/
├── request-a-training/
├── talk-today/
├── training-calendar/              # Special: Uses WordPress calendar plugin (needs replacement)
├── training/
├── trainings-offered/
├── css/                            # Shared stylesheets
├── js/                             # Shared JavaScript
├── images/                         # Shared images
├── fonts/                          # Web fonts
├── scripts/                        # Automation tools (Node.js & Python)
│   ├── identify_and_scrape.js     # Single page scraper
│   ├── scrape_all_pages.js        # Multi-page scraper
│   ├── repair_site.js             # Post-processing (responsive fixes)
│   ├── discover_urls.js           # URL discovery from HTML
│   ├── verify_pages.js            # Page existence verification
│   ├── create_placeholders.js     # Placeholder page generator
│   ├── check_wayback.py           # Internet Archive checker
│   ├── github_push.py             # GitHub Pages deployment
│   └── fix_github_pages_paths.js  # Path fixing for GitHub Pages
└── [documentation files]          # See Documentation section below
```

## How to Build, Test, and Run

### Installation
```bash
npm install
```

### Available npm Scripts

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run scrape` | Single page scraper | Scraping individual URLs |
| `npm run scrape:all` | All pages scraper | Full site scraping (requires network access to srrn.net) |
| `npm run discover` | URL discovery | Finding additional pages to scrape |
| `npm run verify` | Page verification | Checking which pages exist locally |
| `npm run placeholder` | Create placeholders | Testing site structure without content |
| `npm run repair` | Apply responsive fixes | After scraping, before deployment |
| `npm run serve` | Local server | Testing site locally (http://localhost:8000) |
| `npm run convert` | Complete workflow | Full scrape + repair + verify |

### Testing Locally
```bash
# Start local server
npm run serve

# Visit in browser
open http://localhost:8000
```

### Deployment to GitHub Pages
```bash
# Deploy to GitHub Pages (sole supported deployment method)
python3 ./scripts/github_push.py "./path/to/site" "owner/repo-name"
```

**Important**: The `github_push.py` script requires GitHub authentication via one of:
- GitHub CLI (`gh auth login`)
- GITHUB_TOKEN environment variable
- ~/.git-credentials file

## Common Development Tasks

### Scraping a New Website
```bash
# 1. Scrape the website
node ./scripts/identify_and_scrape.js "https://example.com" "./dist"

# 2. Repair layout issues
node ./scripts/repair_site.js "./dist"

# 3. Deploy to GitHub Pages
python3 ./scripts/github_push.py "./dist" "owner/repo-name"
```

### Adding a New Repair to repair_site.js
1. The repair script uses JSDOM to manipulate HTML
2. Add your repair logic in the `processHtmlFile()` function
3. Update the statistics tracking if needed
4. Test with `npm run repair`

Example repair pattern:
```javascript
function myCustomRepair(document) {
  const elements = document.querySelectorAll('.my-selector');
  elements.forEach(el => {
    // Your repair logic
  });
  return elementsModified;
}
```

### Verifying Conversion Status
```bash
# Check which pages exist and their sizes
npm run verify

# Expected output: "Found: 11/11" when all pages are downloaded
```

## Known Issues and Workarounds

### Issue 1: srrn.net Network Access
**Problem**: The live site https://srrn.net may not be accessible from all environments (DNS issues, network restrictions).

**Workaround**:
- Run scraping from an environment with proper network access
- Use Internet Archive if site is down: `python3 scripts/check_wayback.py`
- Manual browser save-as for individual pages

### Issue 2: Training Calendar Dynamic Content
**Problem**: The `/training-calendar/` page uses WordPress Modern Events Calendar Lite plugin which requires server-side processing and a database.

**Solution**: After conversion to static site, replace with one of:
- **Preferred**: Static HTML calendar with links to external events (e.g., Facebook events)
  - Create/update by opening a GitHub issue and assigning to GitHub Copilot Pro Agent
  - Or manually edit HTML files in `/training-calendar/`
- **Alternative**: Facebook Events widget via SociableKit (see template repository)

**Reference**: See [FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML) for implementation examples.

### Issue 3: Dynamic Features in Static Sites
**Problem**: Contact forms, donation buttons, event calendars require server-side processing.

**Solution**: Use external service integrations:
- **Donations**: [Zeffy](https://www.zeffy.com) (zero platform fees for nonprofits)
- **Forms**: Zeffy Forms or Microsoft Forms
- **Analytics**: Google Analytics
- **Comments**: Disqus, giscus, or Utterances
- **Search**: Lunr.js (client-side) or Algolia DocSearch

**Reference**: See `EXTERNAL_SERVICES.md` for complete guide.

### Issue 4: GitHub Pages Deployment
**Problem**: Paths might not work correctly on GitHub Pages if they're absolute.

**Solution**: The `repair_site.js` script automatically converts absolute URLs to relative paths. If issues persist, run `scripts/fix_github_pages_paths.js`.

## Documentation

This repository has extensive documentation:

| File | Purpose |
|------|---------|
| `README.md` | Overview, quick start, and usage guide |
| `QUICKSTART.md` | Get started in under 5 minutes |
| `CONVERSION_GUIDE.md` | Complete conversion workflow for SRRN.net |
| `EXTERNAL_SERVICES.md` | External service integrations for dynamic features |
| `MANUAL_STEPS.md` | Manual step-by-step instructions for troubleshooting |
| `IMPLEMENTATION_SUMMARY.md` | Framework implementation status |
| `STATUS.md` | Current conversion status and metrics |
| `CONTRIBUTING.md` | Contribution guidelines |
| `FUTURE_ENHANCEMENTS.md` | Planned improvements |
| `ISSUE_TEMPLATE.md` | Template for site conversion issues |

**Always read the relevant documentation before making changes.**

## Code Style and Conventions

### JavaScript (Node.js scripts)
- Use ES6+ features (const/let, arrow functions, async/await)
- Prefer `const` over `let`; never use `var`
- Add JSDoc comments for functions
- Handle errors gracefully with try/catch
- Provide clear console output with emoji indicators (✅, ❌, 🔍, etc.)
- Use `#!/usr/bin/env node` shebang for executable scripts

### Python (deployment scripts)
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions
- Handle exceptions gracefully
- Provide clear output messages

### HTML/CSS
- Maintain responsive design (mobile-first)
- Use semantic HTML5 elements
- Keep CSS modular and organized
- Ensure accessibility (ARIA labels, alt text)

### Git Commits
Use conventional commit messages:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Testing Guidelines

### Before Making Changes
1. **Run verification**: `npm run verify` to understand current state
2. **Test locally**: `npm run serve` to see the site in action
3. **Check documentation**: Read relevant .md files

### After Making Changes
1. **Test the specific script**: Run the modified script with test data
2. **Verify no breakage**: Ensure existing functionality still works
3. **Test locally**: Use `npm run serve` to verify visual changes
4. **Update documentation**: If behavior changes, update relevant .md files

### No Automated Tests
**Important**: This repository does NOT have a test suite (no Jest, Mocha, etc.). All testing must be done manually:
- Run scripts with test inputs
- Verify output visually
- Check console output for errors
- Test in a browser for UI changes

## Security Considerations

### Avoid Hardcoded Credentials
- Never commit GitHub tokens, API keys, or passwords
- Use environment variables or GitHub secrets
- Credentials should be in `~/.git-credentials` or environment variables

### Input Validation
- Always validate URLs before scraping (see `identify_and_scrape.js` for example)
- Sanitize user inputs in scripts
- Be careful with `eval()` or `new Function()` - avoid if possible

### XSS Prevention
- The repair script injects CSS - ensure it's properly escaped
- When manipulating HTML with JSDOM, validate content

## GitHub Actions Workflow

The repository includes `.github/workflows/convert-site.yml` for automated conversions:

**Trigger**: Manual workflow dispatch
**Inputs**:
- `source_url`: Website URL to convert
- `target_repo`: Target GitHub repository (owner/repo format)
- `output_dir`: Output directory (default: ./dist)

**Steps**:
1. Checkout repository
2. Setup Node.js and Python
3. Install dependencies
4. Scrape website
5. Repair site
6. Deploy to GitHub Pages

**Permissions Required**: `contents: write`, `pages: write`, `id-token: write`

## External Service Integration

When adding functionality that requires server-side processing:

1. **Consult EXTERNAL_SERVICES.md** for recommended services
2. **Check the template repository**: [FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)
3. **Prefer Zeffy for nonprofits**: Zero platform fees
4. **Use iframe embeds**: Easiest integration method
5. **Document the integration**: Add to EXTERNAL_SERVICES.md

## Troubleshooting for Developers

### Script Fails with "Module not found"
```bash
# Ensure dependencies are installed
npm install
```

### "Cannot resolve host" during scraping
- Check network connectivity to target site
- Try from different network/VPN
- Use Internet Archive as fallback

### Repair script doesn't modify files
- Check console output for errors
- Verify HTML files exist in target directory
- Ensure JSDOM can parse the HTML

### GitHub Pages deployment fails
- Check GitHub authentication (gh auth status)
- Verify repository exists or can be created
- Check that GITHUB_TOKEN has proper permissions

### Local server won't start
```bash
# Try a different port
python3 -m http.server 8080
```

## Best Practices for This Repository

1. **Always test scripts manually** before committing - there are no automated tests
2. **Keep documentation in sync** - Update .md files when changing behavior
3. **Use npm scripts** - Don't call scripts directly (use `npm run` commands)
4. **Preserve deployment focus** - Remember GitHub Pages is the sole deployment method
5. **Check git status** before committing - Ensure .gitignore is working (no node_modules, dist/, etc.)
6. **Provide clear output** - Use emoji and formatting for script output
7. **Handle errors gracefully** - Always use try/catch and provide helpful error messages
8. **Validate inputs** - Check URLs, paths, and user inputs before processing

## Quick Reference for Common Errors

### "Error: Missing required arguments"
→ Check the script's usage documentation (run with no args to see help)

### "Error: Directory does not exist"
→ Create the directory or verify the path is correct

### "Error: Invalid URL"
→ Ensure URL includes protocol (https://)

### "Error: No GitHub credentials found"
→ Set up authentication via gh CLI, GITHUB_TOKEN, or .git-credentials

### DNS resolution failures
→ Run from environment with network access or use Internet Archive

## Template Repository Reference

For implementation examples of external services, responsive design, and best practices, see:

**Repository**: [FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)

This template demonstrates:
- Zeffy donation form integration
- Facebook Events widget (SociableKit)
- Google Analytics setup
- Responsive design patterns
- SEO optimization

Use this as a reference when implementing similar features in converted sites.

## Getting Help

1. **Check documentation first**: Start with README.md, then specific guides
2. **Review existing code**: Look at similar implementations in scripts/
3. **Check Issues**: Search for similar problems in GitHub Issues
4. **Consult STATUS.md**: Understand current state and known limitations
5. **Create an issue**: If stuck, open a GitHub issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Environment details (OS, Node version, Python version)
   - Error messages and logs

## Summary for Quick Onboarding

**When working on this repository:**
1. Run `npm install` first
2. Use `npm run verify` to check current state
3. Test locally with `npm run serve`
4. Read relevant documentation before making changes
5. Remember: GitHub Pages is the only deployment target
6. Test manually - there are no automated tests
7. External services required for dynamic features (see EXTERNAL_SERVICES.md)
8. Training calendar needs special attention (WordPress plugin replacement)

**Main workflows:**
- **Convert a site**: scrape → repair → verify → deploy
- **Test locally**: serve → browse → verify
- **Make changes**: edit → test → document → commit

---

**Last Updated**: 2025-12-30  
**Maintained by**: FreeForCharity  
**Repository**: https://github.com/FreeForCharity/FFC-EX-SRRN.net
