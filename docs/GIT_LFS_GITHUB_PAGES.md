# GitHub Pages Git LFS Support - Implementation Guide

## Problem
The video file `assets/Michael-Webster-640x360-1.mp4` (123MB) is stored in Git LFS but GitHub Pages was serving the LFS pointer file instead of the actual video content, causing the video to not launch.

## Root Cause
By default, GitHub Pages uses a simple build-and-deploy workflow that doesn't fetch Git LFS files. When it deploys the site, it only includes the LFS pointer files (text files containing the hash and size), not the actual binary content.

## Solution
We've created a custom GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that explicitly fetches LFS files before deploying to GitHub Pages.

## How It Works

### The New Workflow
The `deploy-pages.yml` workflow:

1. **Checkout with LFS**: Uses `actions/checkout@v4` with `lfs: true` parameter
2. **Fetch LFS Objects**: Explicitly runs `git lfs checkout` to download all LFS files
3. **Upload to Pages**: Packages the full content (including LFS files) for deployment
4. **Deploy**: Deploys the complete site to GitHub Pages

### Workflow Triggers
The workflow runs on:
- Push to `main` branch (automatic deployment)
- Manual trigger via GitHub Actions UI (workflow_dispatch)

## After Merging This PR

### Option 1: Automatic Deployment (Recommended)
Once this PR is merged to `main`:
1. The new workflow will automatically run
2. It will fetch all LFS files including the video
3. Deploy the complete site to GitHub Pages
4. Video will be accessible at `https://freeforcharity.github.io/FFC-EX-SRRN.net/assets/Michael-Webster-640x360-1.mp4`

### Option 2: Manual Trigger
If you need to force a redeployment:
1. Go to Actions tab in GitHub
2. Select "Deploy to GitHub Pages with LFS" workflow
3. Click "Run workflow"
4. Select `main` branch
5. Click "Run workflow" button

## Verification Steps

After the workflow completes (2-5 minutes):

1. **Check the video file directly**:
   ```bash
   curl -I https://freeforcharity.github.io/FFC-EX-SRRN.net/assets/Michael-Webster-640x360-1.mp4
   ```
   - Look for `Content-Type: video/mp4`
   - Look for `Content-Length: 128887376` (123MB)

2. **Test the About Us page**:
   - Visit: https://freeforcharity.github.io/FFC-EX-SRRN.net/about-us/
   - Scroll to "How We Can Help" section
   - Click the play button on the video
   - Video should load and play

3. **Check for errors**:
   - Open browser console (F12)
   - Look for any 404 errors for the video file
   - Video element should show duration (31:21) and allow playback

## Why This Was Needed

### Git LFS Overview
Git LFS (Large File Storage) is designed to handle large files efficiently:
- Large files are stored separately from the main repository
- The repository contains only a small "pointer" file
- The actual content is stored on GitHub's LFS servers
- Files are downloaded on-demand when you clone or checkout

### GitHub Pages Default Behavior
The default Pages deployment:
- Only deploys files from the repository
- Doesn't automatically fetch LFS content
- Results in pointer files being served as content
- Browsers can't play LFS pointer text as video

### Our Custom Workflow
- Explicitly fetches LFS files during checkout
- Ensures complete content is uploaded to Pages
- Results in actual video file being served
- Browsers can properly play the video

## Alternative Solutions (Not Implemented)

### 1. External Video Hosting
Host the video on YouTube, Vimeo, or a CDN:
- **Pros**: Better streaming, bandwidth optimization, no Git LFS needed
- **Cons**: External dependency, potential cost, requires embedding code

### 2. Reduce Video File Size
Compress the video to under 100MB:
- **Pros**: No LFS needed, simpler deployment
- **Cons**: Reduced quality, requires video processing

### 3. Self-Hosted Media Server
Host video on separate media server:
- **Pros**: Full control, no GitHub limitations
- **Cons**: Additional infrastructure, maintenance overhead

## Future Considerations

### Video File Management
- Current video is 123MB (31 minutes, 21 seconds)
- Git LFS has bandwidth limits (1GB/month on free tier, 50GB/month on Teams)
- Each video view on GitHub Pages counts against bandwidth
- Monitor LFS usage in repository settings

### Recommendations
1. **Keep using Git LFS** for videos if they're infrequently updated
2. **Consider external hosting** if:
   - Videos are viewed frequently (high bandwidth)
   - Multiple large videos are added
   - LFS bandwidth limits are exceeded
3. **Document video management** in repository README

## Troubleshooting

### Video Still Not Loading After Deployment

1. **Check workflow status**:
   - Go to Actions tab
   - Verify "Deploy to GitHub Pages with LFS" completed successfully
   - Check for any errors in workflow logs

2. **Verify LFS file**:
   ```bash
   git lfs ls-files | grep Michael-Webster
   ```
   - Should show the video file is tracked by LFS

3. **Check Pages deployment**:
   - Repository Settings → Pages
   - Verify source is "GitHub Actions"
   - Check deployment status

4. **Browser cache**:
   - Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache
   - Try incognito/private mode

### Workflow Permission Issues

If deployment fails with permission errors:
1. Repository Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Enable "Allow GitHub Actions to create and approve pull requests"
5. Save changes
6. Re-run the workflow

## References

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git LFS Documentation](https://git-lfs.com/)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- [actions/checkout LFS support](https://github.com/actions/checkout#usage)

## Summary

This custom workflow solves the Git LFS + GitHub Pages integration issue, ensuring that large video files are properly fetched and deployed. Once merged and deployed, the video will function correctly on the live site.
