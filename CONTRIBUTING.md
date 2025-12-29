# Contributing to Static Site Conversion Toolkit

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

**Note:** This toolkit is designed exclusively for deployment to **GitHub Pages**. Contributions should maintain compatibility with GitHub Pages hosting.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the [Issues](../../issues) section
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (OS, Node version, Python version)
   - Example URL if relevant (ensure it's publicly accessible)

### Suggesting Enhancements

Have an idea for improvement? Open an issue with:
- Clear description of the enhancement
- Use case / why it's needed
- Proposed implementation (optional)

### Contributing Code

1. **Fork the repository**

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Test Node.js scripts
   node ./scripts/identify_and_scrape.js --help
   node ./scripts/repair_site.js --help
   
   # Test Python script
   python3 ./scripts/github_push.py --help
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: Add feature description"
   ```
   
   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style Guidelines

### JavaScript
- Use ES6+ features
- Use `const` and `let` (not `var`)
- Meaningful variable names
- Add JSDoc comments for functions
- Handle errors gracefully

Example:
```javascript
/**
 * Description of function
 * @param {string} param1 - Description
 * @param {number} param2 - Description
 * @returns {boolean} Description
 */
function myFunction(param1, param2) {
  // Implementation
}
```

### Python
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions
- Handle exceptions gracefully

Example:
```python
def my_function(param1: str, param2: int) -> bool:
    """
    Description of function
    
    Args:
        param1: Description
        param2: Description
    
    Returns:
        Description
    """
    # Implementation
```

## Testing

Before submitting a PR:

1. **Test the scraper:**
   ```bash
   node ./scripts/identify_and_scrape.js "https://example.com" "./test-output"
   ```

2. **Test the repair script:**
   ```bash
   node ./scripts/repair_site.js "./test-output"
   ```

3. **Test input validation:**
   - Test with invalid inputs
   - Test with edge cases
   - Ensure error messages are helpful

4. **Clean up test files:**
   ```bash
   rm -rf ./test-output
   ```

## Areas for Contribution

Here are areas where contributions are especially welcome:

### High Priority
- [ ] Support for more CMS platforms (Drupal, Joomla, Wix, etc.)
- [ ] Better handling of JavaScript-heavy sites
- [ ] Improved error messages and debugging
- [ ] Performance optimizations for large sites

### Medium Priority
- [ ] Support for authenticated sites
- [ ] Better video handling (more platforms)
- [ ] Progressive Web App (PWA) support
- [ ] Sitemap generation
- [ ] RSS feed preservation

### Nice to Have
- [ ] GUI/Web interface
- [ ] Docker support
- [ ] Site preview before deployment
- [ ] Automated testing suite
- [ ] CI/CD improvements

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FreeForCharity/FFC-EX-SRRN.net.git
   cd FFC-EX-SRRN.net
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a test branch:**
   ```bash
   git checkout -b test/my-test
   ```

## Pull Request Process

1. Update README.md if you're adding features
2. Update QUICKSTART.md if it affects the quick start process
3. Add/update examples if relevant
4. Ensure all scripts still work
5. Update ISSUE_TEMPLATE.md if you're changing the workflow

## Security

If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email the maintainers directly (check repository for contact)
3. Provide details about the vulnerability
4. Allow time for a fix before public disclosure

## Code Review

All submissions require review. We review PRs based on:
- Code quality and style
- Test coverage
- Documentation
- Backward compatibility
- Security implications

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?

- Open an issue with the `question` label
- Check existing issues for similar questions
- Review the [README](README.md) and [QUICKSTART](QUICKSTART.md)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)

Thank you for contributing! 🎉
