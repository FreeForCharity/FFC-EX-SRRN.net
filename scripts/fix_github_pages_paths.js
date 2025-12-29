#!/usr/bin/env node

/**
 * fix_github_pages_paths.js
 * 
 * Fixes absolute paths in HTML files for GitHub Pages deployment.
 * Converts paths like "/wp-content/..." to "./wp-content/..." for proper loading.
 * 
 * Usage: node fix_github_pages_paths.js <SITE_DIR>
 * Example: node fix_github_pages_paths.js "."
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Error: Missing required argument');
  console.error('Usage: node fix_github_pages_paths.js <SITE_DIR>');
  console.error('Example: node fix_github_pages_paths.js "."');
  process.exit(1);
}

const siteDir = path.resolve(args[0]);

// Verify directory exists
if (!fs.existsSync(siteDir)) {
  console.error(`Error: Directory "${siteDir}" does not exist`);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('GitHub Pages Path Fixer');
console.log('='.repeat(60));
console.log(`Site Directory: ${siteDir}`);
console.log('='.repeat(60));

// Statistics
let stats = {
  filesProcessed: 0,
  pathsFixed: 0,
  filesModified: 0
};

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip common directories that don't need processing
      if (!['node_modules', '.git', '.github'].includes(file)) {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Calculate the relative depth of a file from the site root
 */
function getDepthFromRoot(filePath) {
  const relativePath = path.relative(siteDir, path.dirname(filePath));
  if (!relativePath || relativePath === '.') {
    return 0;
  }
  return relativePath.split(path.sep).length;
}

/**
 * Get the path prefix needed to reach the root from this file
 */
function getPathPrefix(depth) {
  if (depth === 0) {
    return './';
  }
  return '../'.repeat(depth);
}

/**
 * Fix absolute paths in HTML document
 */
function fixPaths(document, filePath) {
  let fixed = 0;
  const depth = getDepthFromRoot(filePath);
  const prefix = getPathPrefix(depth);
  
  // Check if URL is from the original site
  let originalSiteUrl = '';
  const metadataPath = path.join(siteDir, '.scraper-metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      originalSiteUrl = metadata.url;
    } catch (error) {
      // Ignore metadata errors
    }
  }
  
  // Skip external URLs
  const isExternal = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('//') ||
           url.startsWith('mailto:') ||
           url.startsWith('tel:') ||
           url.startsWith('#');
  };
  
  // Skip certain paths that should remain absolute
  const shouldSkipPath = (url) => {
    if (!url) return true;
    // Skip dynamic WordPress endpoints
    if (url.includes('/wp-admin/') || 
        url.includes('/wp-json/') ||
        url.includes('xmlrpc.php') ||
        url.includes('/feed/') ||
        url.includes('/comments/feed/')) {
      return true;
    }
    return false;
  };
  
  // Fix paths in elements with specific attributes
  const selectors = [
    { selector: 'a[href]', attr: 'href' },
    { selector: 'img[src]', attr: 'src' },
    { selector: 'script[src]', attr: 'src' },
    { selector: 'link[href]', attr: 'href' },
    { selector: 'source[src]', attr: 'src' },
    { selector: 'video[src]', attr: 'src' },
    { selector: 'iframe[src]', attr: 'src' },
    { selector: 'img[srcset]', attr: 'srcset' }
  ];
  
  selectors.forEach(({ selector, attr }) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const value = element.getAttribute(attr);
      
      if (!value) return;
      
      // Handle srcset separately (can have multiple URLs)
      if (attr === 'srcset') {
        let modified = false;
        const parts = value.split(',').map(part => {
          const [url, ...descriptor] = part.trim().split(/\s+/);
          
          // Fix absolute paths starting with /
          if (url.startsWith('/') && !isExternal(url) && !shouldSkipPath(url)) {
            fixed++;
            modified = true;
            return `${prefix}${url.substring(1)}${descriptor.length ? ' ' + descriptor.join(' ') : ''}`;
          }
          
          // Fix hardcoded original site URLs
          if (originalSiteUrl && url.startsWith(originalSiteUrl)) {
            const relativePath = url.substring(originalSiteUrl.length);
            if (relativePath.startsWith('/')) {
              fixed++;
              modified = true;
              return `${prefix}${relativePath.substring(1)}${descriptor.length ? ' ' + descriptor.join(' ') : ''}`;
            }
          }
          
          return part.trim();
        });
        
        if (modified) {
          element.setAttribute(attr, parts.join(', '));
        }
        return;
      }
      
      // Handle regular attributes
      if (value.startsWith('/') && !isExternal(value) && !shouldSkipPath(value)) {
        const newValue = prefix + value.substring(1);
        element.setAttribute(attr, newValue);
        fixed++;
      }
    });
  });
  
  // Fix inline styles with url() references
  const elementsWithStyle = document.querySelectorAll('[style*="url("]');
  elementsWithStyle.forEach(element => {
    const style = element.getAttribute('style');
    if (style) {
      const newStyle = style.replace(/url\(['"]?(\/[^'")\s]+)['"]?\)/g, (match, url) => {
        if (!shouldSkipPath(url)) {
          fixed++;
          return `url('${prefix}${url.substring(1)}')`;
        }
        return match;
      });
      if (newStyle !== style) {
        element.setAttribute('style', newStyle);
      }
    }
  });
  
  return fixed;
}

/**
 * Process a single HTML file
 */
function processHtmlFile(filePath) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Fix paths
    const pathsFixed = fixPaths(document, filePath);
    
    if (pathsFixed > 0) {
      stats.pathsFixed += pathsFixed;
      stats.filesModified++;
      
      // Save modified HTML
      const modifiedHtml = dom.serialize();
      fs.writeFileSync(filePath, modifiedHtml, 'utf8');
      
      const relativePath = path.relative(siteDir, filePath);
      console.log(`✓ Fixed ${pathsFixed} paths in: ${relativePath}`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main function
 */
function main() {
  console.log('\n🔧 Starting GitHub Pages path fix...\n');
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(siteDir);
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  // Process each file
  htmlFiles.forEach(processHtmlFile);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Path fixing completed!');
  console.log('='.repeat(60));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total paths fixed: ${stats.pathsFixed}`);
  console.log('='.repeat(60));
  console.log('\nYour site is now ready for GitHub Pages deployment!');
  console.log('Make sure to commit and push the changes.');
  console.log('='.repeat(60));
}

// Run the fix process
main();
