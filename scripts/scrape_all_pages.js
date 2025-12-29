#!/usr/bin/env node

/**
 * scrape_all_pages.js
 * 
 * Scrapes all identified pages from the SRRN.net website.
 * This script explicitly targets each page that should be converted.
 * 
 * Usage: node scrape_all_pages.js
 */

const scrape = require('website-scraper').default || require('website-scraper');
const fs = require('fs');
const path = require('path');

// Base URL for the site
const BASE_URL = 'https://srrn.net';

// List of all pages to scrape based on the site navigation
const PAGES_TO_SCRAPE = [
  '/',                      // Home page
  '/about-us/',             // About Us page
  '/donate/',               // Donate page
  '/aftercare/',            // Aftercare page
  '/events/',               // Special Events page
  '/news/',                 // News page
  '/request-a-training/',   // Request a Training page
  '/talk-today/',           // Talk Today page
  '/training-calendar/',    // Training Calendar page
  '/training/',             // Training page
  '/trainings-offered/'     // Trainings Offered page
];

// Build full URLs
const urls = PAGES_TO_SCRAPE.map(page => `${BASE_URL}${page}`);

console.log('='.repeat(70));
console.log('SRRN.net Complete Site Scraper');
console.log('='.repeat(70));
console.log(`Base URL: ${BASE_URL}`);
console.log(`Pages to scrape: ${PAGES_TO_SCRAPE.length}`);
console.log('='.repeat(70));
console.log('\nPages:');
PAGES_TO_SCRAPE.forEach((page, index) => {
  console.log(`  ${index + 1}. ${page}`);
});
console.log('='.repeat(70));

// Output directory - use a temporary directory for scraping
const outputDir = path.join(process.cwd(), '.scrape-temp');

// Clean up temp directory if it exists
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

// Scraper configuration
const options = {
  urls: urls,
  directory: outputDir,
  recursive: true,
  maxRecursiveDepth: 5,  // Reduced depth since we're targeting specific pages
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
    { selector: 'iframe', attr: 'src' }
  ],
  requestConcurrency: 3,  // Conservative to avoid overwhelming the server
  urlFilter: (url) => {
    // Only scrape URLs from the same domain
    const targetDomain = new URL(BASE_URL).hostname;
    try {
      const urlObj = new URL(url);
      // Strict hostname comparison to prevent subdomain attacks
      return urlObj.hostname === targetDomain;
    } catch {
      // For relative URLs, validate they don't contain suspicious patterns
      if (typeof url === 'string' && url.startsWith('/') && !url.includes('//')) {
        return true;
      }
      return false;
    }
  },
  onResourceError: (resource, error) => {
    console.warn(`⚠ Failed: ${resource.url} - ${error.message}`);
  },
  onResourceSaved: (resource) => {
    console.log(`✓ Saved: ${resource.url}`);
  }
};

// Main scraping function
async function main() {
  try {
    console.log('\n📥 Starting comprehensive site scrape...\n');
    
    const startTime = Date.now();
    const result = await scrape(options);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Scraping completed successfully!');
    console.log(`Total resources downloaded: ${result.length}`);
    console.log(`Time taken: ${duration} seconds`);
    console.log('='.repeat(70));
    
    // Update metadata
    const metadata = {
      url: BASE_URL,
      siteType: 'WordPress',
      scrapedAt: new Date().toISOString(),
      pagesScraped: PAGES_TO_SCRAPE,
      totalResources: result.length,
      durationSeconds: parseFloat(duration)
    };
    
    const metadataPath = path.join(outputDir, '.scraper-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\n📝 Metadata updated: ${metadataPath}`);
    
    // Generate a summary report
    const summaryPath = path.join(outputDir, 'scrape-summary.txt');
    const summary = `
SRRN.net Site Scrape Summary
============================
Date: ${new Date().toISOString()}
Base URL: ${BASE_URL}
Pages Scraped: ${PAGES_TO_SCRAPE.length}
Total Resources: ${result.length}
Duration: ${duration} seconds

Pages:
${PAGES_TO_SCRAPE.map((page, i) => `  ${i + 1}. ${page}`).join('\n')}

Next Steps:
-----------
1. Run the repair script:
   node ./scripts/repair_site.js "."

2. Verify all pages are working:
   - Check each HTML file exists
   - Verify navigation links work
   - Test responsive layout

3. Review the static site locally before deployment
`;
    
    fs.writeFileSync(summaryPath, summary);
    console.log(`📄 Summary saved: ${summaryPath}`);
    
    // Move files from temp directory to current directory
    console.log('\n📦 Moving scraped files to repository...');
    const targetDir = process.cwd();
    
    // website-scraper creates a subdirectory named after the hostname
    // We need to move files from inside that subdirectory
    const scrapedDir = path.join(outputDir, 'srrn.net');
    
    if (!fs.existsSync(scrapedDir)) {
      console.error('Error: Scraped directory not found at:', scrapedDir);
      console.log('Looking for files in:', outputDir);
      console.log('Contents:', fs.readdirSync(outputDir));
      throw new Error('Scraped directory structure unexpected');
    }
    
    // Function to recursively copy files
    function copyFiles(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyFiles(srcPath, destPath);
        } else {
          // Only copy if it's a new file or we're updating content
          fs.copyFileSync(srcPath, destPath);
          console.log(`  ✓ Copied: ${path.relative(targetDir, destPath)}`);
        }
      }
    }
    
    copyFiles(scrapedDir, targetDir);
    
    // Clean up temp directory
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log('✅ Files moved successfully!\n');
    
    console.log('='.repeat(70));
    console.log('Next step: Run repair script');
    console.log('npm run repair');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Error during scraping:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the scraper
main();
