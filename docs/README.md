# Documentation Directory

This directory contains technical documentation for specific features and issues in the FFC-EX-SRRN.net repository.

## Documents

### [GIT_LFS_GITHUB_PAGES.md](./GIT_LFS_GITHUB_PAGES.md)
**Purpose**: Explains how Git LFS files are handled when deploying to GitHub Pages

**When to read this**:
- Video or other large files (>100MB) not loading on the deployed site
- Setting up deployment for a new site with large assets
- Troubleshooting GitHub Pages deployment issues
- Understanding LFS bandwidth considerations

**Summary**: GitHub Pages doesn't automatically serve Git LFS files. This document explains the custom GitHub Actions workflow that fetches LFS files before deployment, ensuring large media files like videos are properly accessible on the live site.

**Key Topics**:
- Git LFS + GitHub Pages integration
- Custom deployment workflow setup
- Verification and troubleshooting steps
- Alternative solutions for large media files
- Bandwidth considerations

## Contributing

When adding new documentation:

1. **Create a descriptive filename** using UPPER_SNAKE_CASE (e.g., `NEW_FEATURE_GUIDE.md`)
2. **Update this README** with:
   - Link to the new document
   - Brief purpose statement
   - When to read it
   - Summary of contents
   - Key topics covered
3. **Follow markdown best practices**:
   - Use clear headings
   - Include code examples where relevant
   - Add troubleshooting sections
   - Link to external resources when helpful

## Documentation Standards

### Structure
Each document should include:
- **Problem/Purpose** - What issue does this address?
- **Solution/Approach** - How is it solved?
- **Implementation Details** - Step-by-step explanation
- **Verification** - How to test/verify it works
- **Troubleshooting** - Common issues and solutions
- **References** - Links to relevant resources

### Style
- Use clear, concise language
- Include practical examples
- Add visual aids (diagrams, screenshots) when helpful
- Provide command-line examples with expected output
- Document edge cases and limitations

## Questions?

If you need clarification on any documentation:
1. Check the main [README.md](../README.md) for general information
2. Review related documentation in this directory
3. Open an issue on GitHub with questions

## Maintenance

- **Review documentation** when making related code changes
- **Update examples** if commands or paths change
- **Archive outdated documents** if features are removed
- **Keep this README** up-to-date with new additions
