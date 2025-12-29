#!/usr/bin/env node

/**
 * identify_and_scrape.js
 * 
 * Downloads a dynamic website (e.g., WordPress) into a static site
 * using website-scraper library.
 * 
 * Usage: node identify_and_scrape.js <URL> <OUTPUT_DIR>
 * Example: node identify_and_scrape.js "https://example.com" "./dist"
 */

const scrape = require('website-scraper').default || require('website-scraper');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Error: Missing required arguments');
  console.error('Usage: node identify_and_scrape.js <URL> <OUTPUT_DIR>');
  console.error('Example: node identify_and_scrape.js "https://example.com" "./dist"');
  process.exit(1);
}

const [targetUrl, outputDir] = args;

// Validate URL
try {
  new URL(targetUrl);
} catch (error) {
  console.error(`Error: Invalid URL "${targetUrl}"`);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('Static Site Scraper');
console.log('='.repeat(60));
console.log(`Target URL: ${targetUrl}`);
console.log(`Output Directory: ${outputDir}`);
console.log('='.repeat(60));

// Scraper configuration
const options = {
  urls: [targetUrl],
  directory: outputDir,
  recursive: true,
  maxRecursiveDepth: 10,
  filenameGenerator: 'bySiteStructure',
  prettifyUrls: true,
  sources: [
    { selector: 'img', attr: 'src' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' },
    { selector: 'script', attr: 'src' },
    { selector: 'link[rel="icon"]', attr: 'href' },
    { selector: 'link[rel="shortcut icon"]', attr: 'href' },
    { selector: 'video', attr: 'src' },
    { selector: 'source', attr: 'src' },
    { selector: 'audio', attr: 'src' },
    { selector: 'a', attr: 'href' }
  ],
  requestConcurrency: 5,
  urlFilter: (url) => {
    // Only scrape URLs from the same domain
    const targetDomain = new URL(targetUrl).hostname;
    try {
      const urlDomain = new URL(url).hostname;
      return urlDomain === targetDomain;
    } catch {
      return true; // Relative URLs
    }
  },
  onResourceError: (resource, error) => {
    console.warn(`Failed to download: ${resource.url} - ${error.message}`);
  },
  onResourceSaved: (resource) => {
    console.log(`✓ Saved: ${resource.url}`);
  }
};

// Detect site type (basic WordPress detection)
async function detectSiteType(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    if (html.includes('wp-content') || html.includes('wordpress')) {
      return 'WordPress';
    } else if (html.includes('joomla')) {
      return 'Joomla';
    } else if (html.includes('drupal')) {
      return 'Drupal';
    }
    return 'Unknown';
  } catch (error) {
    console.warn('Could not detect site type:', error.message);
    return 'Unknown';
  }
}

// Main scraping function
async function main() {
  try {
    console.log('\n🔍 Detecting site type...');
    const siteType = await detectSiteType(targetUrl);
    console.log(`Site Type: ${siteType}`);
    
    console.log('\n📥 Starting download...\n');
    const result = await scrape(options);
    
    console.log('\n✅ Scraping completed successfully!');
    console.log(`Total resources downloaded: ${result.length}`);
    
    // Save metadata
    const metadata = {
      url: targetUrl,
      siteType: siteType,
      scrapedAt: new Date().toISOString()
    };
    
    const metadataPath = path.join(outputDir, '.scraper-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata));
    console.log(`\n📝 Metadata saved to: ${metadataPath}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('Next step: Run repair script');
    console.log(`node ./scripts/repair_site.js "${outputDir}"`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error during scraping:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the scraper
main();
