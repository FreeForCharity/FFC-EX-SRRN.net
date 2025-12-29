# Large Video Files

This directory contained a large video file that exceeded GitHub's 100MB file size limit:

- `Michael-Webster-640x360-1.mp4` (123 MB)

## Recommendations

For large video files, consider:

1. **Host on YouTube or Vimeo**: Embed videos using iframe instead of hosting locally
2. **Use Git LFS**: If you need to version large files, use Git Large File Storage
3. **CDN Hosting**: Use a CDN service like Cloudflare R2, AWS S3, or similar
4. **Compress Videos**: Use video compression tools to reduce file size

## Current Status

The video file has been excluded from the repository to allow successful deployment. The page referencing this video may show a broken video embed.

To restore video functionality:
- Upload the video to a video hosting service
- Update the HTML to embed from the hosted location
- Or use Git LFS if local hosting is required
