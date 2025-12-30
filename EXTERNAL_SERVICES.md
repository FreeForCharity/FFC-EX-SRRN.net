# External Services Guide for Static Sites

This document outlines recommended external services for adding dynamic functionality to static sites deployed on GitHub Pages.

## Overview

When converting dynamic websites (like WordPress) to static sites hosted on GitHub Pages, server-side features must be replaced with external service integrations. This guide provides recommended services based on the **[FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)** template repository.

## Reference Template

The **[FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)** repository demonstrates best practices for integrating external services into static sites deployed on GitHub Pages.

### Template Features

The template includes working examples of:

1. **Donation Forms** - Zeffy integration (zero platform fees for nonprofits)
2. **Event Calendars** - Facebook Events widget via SociableKit
3. **Analytics** - Google Analytics implementation
4. **Social Media Integration** - Facebook, Twitter/X, Instagram links
5. **Responsive Design** - Mobile-first approach
6. **SEO Optimization** - Meta tags and Open Graph
7. **Performance** - Optimized assets and lazy loading

## Recommended External Services

### 1. Donation Forms

**Service**: [Zeffy](https://www.zeffy.com)
- **Cost**: Free (zero platform fees for nonprofits)
- **Features**: 
  - Embeddable donation forms
  - One-time and recurring donations
  - No platform fees for nonprofits; standard credit card processing fees apply and are typically covered by donors via optional tips
  - Customizable branding
- **Implementation**: Embed via iframe
- **Template Reference**: See donate section in FFC-IN-Single_Page_Template_HTML

**Alternative Services**:
- Stripe Payment Links
- PayPal Donate Button
- Square Donations

### 2. Event Calendars

**Service**: [SociableKit](https://www.sociablekit.com) Facebook Events Widget
- **Cost**: Free tier available, paid plans for advanced features
- **Features**:
  - Automatically syncs with Facebook Events
  - Responsive design
  - Customizable styling
  - No coding required
- **Implementation**: Embed via iframe
- **Template Reference**: See events section in FFC-IN-Single_Page_Template_HTML

**Alternative**:
- **Static HTML calendar** (recommended for full control): Create a custom calendar page in HTML with links to external event pages (e.g., Facebook events). To create or update the calendar, open an issue in this repository and assign it to GitHub Copilot Pro Agent to make the HTML changes and add them to the site. Edit the HTML source files in the repository, commit changes to git, and push to GitHub to trigger an automatic GitHub Pages rebuild and deployment.

**SRRN.net Specific**: The Training Calendar page currently uses WordPress Modern Events Calendar Lite plugin, which requires a database. This should be replaced with one of the above options.

### 3. Contact Forms

**Recommended Services**:

**Option A: Zeffy Forms**
- **Cost**: Free (zero platform fees for nonprofits)
- **Features**: Form builder, data collection, integrates with Zeffy donation platform
- **Implementation**: Embed via iframe or use Zeffy form builder

**Option B: Microsoft Forms**
- **Cost**: Free (requires Microsoft account)
- **Features**: Built-in spam protection, data collection, integration with Microsoft 365
- **Implementation**: Create form in Microsoft Forms and embed via iframe

### 4. Analytics

**Service**: Google Analytics
- **Cost**: Free
- **Features**:
  - Page view tracking
  - User behavior analysis
  - Custom event tracking
  - Real-time reporting
- **Implementation**: Add Google Tag Manager script to HTML
- **Template Reference**: See analytics implementation in FFC-IN-Single_Page_Template_HTML

**Privacy-Focused Alternatives**:
- Plausible Analytics (paid)
- Simple Analytics (paid)
- Umami (self-hosted, free)

### 5. Comments

**Recommended Services**:

**Option A: Disqus**
- **Cost**: Free with ads, paid for ad-free
- **Features**: Comment threading, moderation, spam protection

**Option B: giscus**
- **Cost**: Free
- **Features**: Uses GitHub Discussions, no external account needed
- **Privacy**: Better privacy than Disqus

**Option C: Utterances**
- **Cost**: Free
- **Features**: Uses GitHub Issues, lightweight

### 6. Search Functionality

**Recommended Services**:

**Option A: Lunr.js** (Client-side)
- **Cost**: Free (JavaScript library)
- **Features**: Client-side search, no server required
- **Implementation**: Index pages during build, search in browser

**Option B: Algolia DocSearch**
- **Cost**: Free for documentation sites, paid otherwise
- **Features**: Fast search, relevance ranking

### 7. Newsletter/Email Signups

**Recommended Services**:
- Mailchimp (free tier available)
- ConvertKit (paid)
- Buttondown (free tier available)

## SRRN.net-Specific Requirements

Based on analysis of the SRRN.net WordPress site, the following features require external service integration:

### 1. Training and Events Calendar

**Current Implementation**: WordPress Modern Events Calendar Lite (v7.26.0)
- Requires: PHP, MySQL database, server-side processing
- Features: Event creation, calendar views, filtering

**Recommended Replacement Option 1**: Facebook Events Widget (SociableKit)
- **Why**: Matches the pattern used in FFC-IN-Single_Page_Template_HTML
- **Benefits**: 
  - Automatically updates when events are added to Facebook
  - No manual HTML updates required
  - Professional appearance
  - Mobile-responsive
- **Implementation**: 
  1. Create events on Facebook Page
  2. Get SociableKit widget code
  3. Embed in `/training-calendar/` page

**Recommended Replacement Option 2**: Static HTML Calendar with External Event Links (Preferred for Full Control)
- Create a custom calendar page in HTML that lists events with links to external event pages (e.g., Facebook events)
- **Benefits**:
  - Complete control over design and layout
  - No third-party dependencies or iframe embeds
  - Consistent with static site architecture
- **Implementation**: 
  
  **Option A - Using GitHub Copilot Pro Agent (if available)**:
  1. Open an issue in this repository requesting calendar updates
  2. Assign the issue to GitHub Copilot Pro Agent
  3. The agent will create/update the HTML source files with event information and links
  4. Review the changes, then commit and push to GitHub
  5. GitHub Pages will automatically rebuild and deploy the updated calendar
  
  **Option B - Manual HTML Editing**:
  1. Directly edit the HTML source files in the repository (e.g., `/training-calendar/index.html`)
  2. Add or update event information with links to external event pages (e.g., Facebook events)
  3. Commit the changes to git and push to GitHub
  4. GitHub Pages will automatically rebuild and deploy the updated calendar

### 2. Potential Donation Features

If SRRN.net has donation functionality:
- **Recommended**: Zeffy (as demonstrated in FFC-IN-Single_Page_Template_HTML)
- **Benefits**: Zero fees mean more money goes to the cause
- **Implementation**: Embed Zeffy donation form via iframe

### 3. Contact/Request Forms

If SRRN.net has contact or training request forms:
- **Recommended**: Zeffy Forms or Microsoft Forms
- **Implementation**: Replace WordPress Contact Form 7 with Zeffy Forms or Microsoft Forms embed

## Implementation Checklist

When converting SRRN.net to static site:

- [ ] Identify all dynamic features in current WordPress site
- [ ] Choose appropriate external services for each feature
- [ ] Create accounts and configure services
- [ ] Test integrations locally
- [ ] Update documentation with service credentials/info
- [ ] Deploy to GitHub Pages
- [ ] Verify all integrations work on live site
- [ ] Set up monitoring/alerts for service status

## Template Repository Reference

For complete implementation examples, see:
- **Repository**: [FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)
- **Live Site**: https://ffcworkingsite2.org/
- **Documentation**: See README in template repository

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Zeffy Documentation](https://zeffy.com/en-US/help)
- [SociableKit Documentation](https://www.sociablekit.com/documentation)
- [Microsoft Forms Documentation](https://support.microsoft.com/forms)
- [Google Analytics Setup Guide](https://support.google.com/analytics)

## Support

For questions about implementing these services:
1. Check the template repository documentation
2. Review service-specific documentation
3. Create an issue in this repository
4. Contact the service provider's support

---

**Last Updated**: 2025-12-29  
**Template Repository**: [FFC-IN-Single_Page_Template_HTML](https://github.com/FreeForCharity/FFC-IN-Single_Page_Template_HTML)  
**Deployment Method**: GitHub Pages (sole supported method)
