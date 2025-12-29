#!/usr/bin/env node

/**
 * repair_site.js
 * 
 * Post-processes scraped static sites to fix common layout issues:
 * - Adds responsive video wrappers (16:9 aspect ratio)
 * - Fixes absolute paths to relative paths
 * - Injects necessary CSS for proper rendering
 * 
 * Usage: node repair_site.js <SITE_DIR>
 * Example: node repair_site.js "./dist"
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Error: Missing required argument');
  console.error('Usage: node repair_site.js <SITE_DIR>');
  console.error('Example: node repair_site.js "./dist"');
  process.exit(1);
}

const siteDir = args[0];

// Verify directory exists
if (!fs.existsSync(siteDir)) {
  console.error(`Error: Directory "${siteDir}" does not exist`);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('Static Site Repair Tool');
console.log('='.repeat(60));
console.log(`Site Directory: ${siteDir}`);
console.log('='.repeat(60));

// CSS to inject for responsive videos and other fixes
const REPAIR_CSS = `
<style id="repair-css">
/* Responsive Video Wrapper - 16:9 Aspect Ratio */
.fluid-width-video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.fluid-width-video-wrapper iframe,
.fluid-width-video-wrapper object,
.fluid-width-video-wrapper embed,
.fluid-width-video-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Ensure responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Fix common layout issues */
body {
  overflow-x: hidden;
}
</style>
`;

// Statistics
let stats = {
  filesProcessed: 0,
  videosWrapped: 0,
  pathsFixed: 0,
  cssInjected: 0
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
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Wrap video elements with responsive wrapper
 */
function wrapVideos(document) {
  let wrapped = 0;
  
  // Find all iframe, video, and embed elements that might be videos
  const videoSelectors = [
    'iframe[src*="youtube.com"]',
    'iframe[src*="youtu.be"]',
    'iframe[src*="vimeo.com"]',
    'iframe[src*="dailymotion.com"]',
    'video',
    'embed[src*="youtube.com"]',
    'embed[src*="vimeo.com"]'
  ];
  
  videoSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      // Skip if already wrapped
      if (element.parentElement && 
          element.parentElement.classList.contains('fluid-width-video-wrapper')) {
        return;
      }
      
      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'fluid-width-video-wrapper';
      
      // Insert wrapper before element
      element.parentNode.insertBefore(wrapper, element);
      
      // Move element into wrapper
      wrapper.appendChild(element);
      
      wrapped++;
    });
  });
  
  return wrapped;
}

/**
 * Fix absolute paths to relative paths
 */
function fixPaths(document, htmlFilePath) {
  let fixed = 0;
  
  // Read metadata to get original URL
  const metadataPath = path.join(siteDir, '.scraper-metadata.json');
  let originalUrl = '';
  
  if (fs.existsSync(metadataPath)) {
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      originalUrl = metadata.url;
    } catch (error) {
      console.warn('Could not read metadata file');
    }
  }
  
  if (!originalUrl) {
    return fixed;
  }
  
  const urlObj = new URL(originalUrl);
  const absolutePathRegex = new RegExp(`${urlObj.origin}`, 'g');
  
  // Fix in various attributes
  const selectors = [
    { selector: 'a', attr: 'href' },
    { selector: 'img', attr: 'src' },
    { selector: 'script', attr: 'src' },
    { selector: 'link', attr: 'href' },
    { selector: 'source', attr: 'src' },
    { selector: 'video', attr: 'src' }
  ];
  
  selectors.forEach(({ selector, attr }) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const value = element.getAttribute(attr);
      if (value && value.includes(urlObj.origin)) {
        const newValue = value.replace(absolutePathRegex, '');
        element.setAttribute(attr, newValue);
        fixed++;
      }
    });
  });
  
  return fixed;
}

/**
 * Inject repair CSS into HTML head
 */
function injectCss(document) {
  // Check if CSS already injected
  if (document.getElementById('repair-css')) {
    return false;
  }
  
  // Find head element
  let head = document.querySelector('head');
  
  // Create head if it doesn't exist
  if (!head) {
    head = document.createElement('head');
    if (document.documentElement) {
      document.documentElement.insertBefore(head, document.body);
    }
  }
  
  // Parse and inject CSS
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = REPAIR_CSS.trim();
  const styleElement = tempDiv.firstChild;
  
  if (head && styleElement) {
    head.appendChild(styleElement);
    return true;
  }
  
  return false;
}

/**
 * Process a single HTML file
 */
function processHtmlFile(filePath) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    let modified = false;
    
    // Wrap videos
    const videosWrapped = wrapVideos(document);
    if (videosWrapped > 0) {
      stats.videosWrapped += videosWrapped;
      modified = true;
    }
    
    // Fix paths
    const pathsFixed = fixPaths(document, filePath);
    if (pathsFixed > 0) {
      stats.pathsFixed += pathsFixed;
      modified = true;
    }
    
    // Inject CSS
    const cssInjected = injectCss(document);
    if (cssInjected) {
      stats.cssInjected++;
      modified = true;
    }
    
    // Save if modified
    if (modified) {
      const modifiedHtml = dom.serialize();
      fs.writeFileSync(filePath, modifiedHtml, 'utf8');
      console.log(`✓ Repaired: ${path.relative(siteDir, filePath)}`);
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main repair function
 */
function main() {
  console.log('\n🔧 Starting site repair...\n');
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(siteDir);
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  // Process each file
  htmlFiles.forEach(processHtmlFile);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Repair completed!');
  console.log('='.repeat(60));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Videos wrapped: ${stats.videosWrapped}`);
  console.log(`Paths fixed: ${stats.pathsFixed}`);
  console.log(`CSS injected: ${stats.cssInjected} files`);
  console.log('='.repeat(60));
  console.log('\nNext step: Deploy to GitHub');
  console.log(`python3 ./scripts/github_push.py "${siteDir}" "<REPO_NAME>"`);
  console.log('='.repeat(60));
}

// Run the repair process
main();
