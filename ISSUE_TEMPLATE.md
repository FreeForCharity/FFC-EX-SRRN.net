# Site Conversion Request

**Target Website URL:** [e.g. https://example.com]  
**Target Repository Name:** [e.g. Organization/site-static-export]

## Phase 1: Conversion

- [ ] **Scrape Site**: Run `node ./scripts/identify_and_scrape.js <URL> <DIR>`
- [ ] **Automated Repair**: Run `node ./scripts/repair_site.js <DIR>`
    - [ ] Verify `fluid-width-video-wrapper` classes are added (if videos exist).
    - [ ] Verify `repair-css` style block is injected.

## Phase 2: Deployment

- [ ] **Push to GitHub**: Run `python3 ./scripts/github_push.py <DIR> <REPO_NAME>`
- [ ] **Enable GitHub Pages**: Confirmed Pages is active in repo settings (Script should do this automatically).

## Phase 3: Visual Verification

- [ ] **Live URL**: [Link to GitHub Pages site]
- [ ] **Video Check**: Verify videos are 16:9 and not stretched.
- [ ] **Interactive Elements**: Check menus, buttons, and links.
    - [ ] *Note specific broken elements here (e.g., contact forms, search bars).*

## Notes

> [!IMPORTANT]
> If the original site used server-side plugins (like "Donate" buttons or Forms), they may need manual reimplementation in `repair_site.js` or via manual HTML edits.

## Conversion Details

**Scraped Date:** [Date]  
**Site Type Detected:** [WordPress/Joomla/Drupal/Unknown]  
**Total Files Downloaded:** [Number]  
**Videos Wrapped:** [Number]  
**Paths Fixed:** [Number]

## Issues Encountered

[Describe any issues encountered during conversion]

## Manual Fixes Required

- [ ] [List any manual fixes needed]
- [ ] [e.g., Replace contact form with Formspree]
- [ ] [e.g., Add Google Analytics tracking]

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Images display properly
- [ ] Videos play and are properly sized
- [ ] Links work (internal and external)
- [ ] Mobile responsive design works
- [ ] No console errors
- [ ] Page load time is acceptable

## Deployment Information

**Repository URL:** [GitHub repo URL]  
**GitHub Pages URL:** [Live site URL]  
**Deployment Date:** [Date]  
**Deployed By:** [Username]

## Follow-up Actions

- [ ] [Any follow-up actions needed]
- [ ] [e.g., Update DNS records]
- [ ] [e.g., Set up custom domain]
