#!/usr/bin/env node

/**
 * scrape_news_with_pagination.js
 * 
 * Scrapes the news section from SRRN.net including all pagination pages.
 * Automatically detects and scrapes all available pagination pages.
 * 
 * Usage: node scrape_news_with_pagination.js
 */

const scrape = require('website-scraper').default || require('website-scraper');
const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://srrn.net';

// Function to check if a URL returns 200 OK
function checkUrlExists(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Main function to discover and scrape all news pages
async function main() {
  console.log('='.repeat(70));
  console.log('SRRN.net News Section Scraper with Pagination');
  console.log('='.repeat(70));
  
  // Start with the main news page
  const newsUrls = [`${BASE_URL}/news/`];
  
  // Discover pagination pages (limit to first 10 pages for reasonable scraping time)
  console.log('\n🔍 Discovering pagination pages (limiting to first 10 for now)...');
  const maxPages = 10; // Reasonable limit for initial scraping
  
  for (let pageNum = 2; pageNum <= maxPages; pageNum++) {
    const pageUrl = `${BASE_URL}/news/page/${pageNum}/`;
    process.stdout.write(`  Checking page ${pageNum}... `);
    
    const exists = await checkUrlExists(pageUrl);
    
    if (exists) {
      console.log('✓');
      newsUrls.push(pageUrl);
    } else {
      console.log('✗');
      break; // Stop if a page doesn't exist
    }
  }
  
  console.log(`\n📊 Found ${newsUrls.length} news pages (including pagination)`);
  console.log('='.repeat(70));
  
  // Output directory
  const outputDir = path.join(process.cwd(), '.scrape-temp-news');
  
  // Clean up temp directory if it exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  
  // Scraper configuration
  const options = {
    urls: newsUrls,
    directory: outputDir,
    recursive: true,
    maxRecursiveDepth: 3,
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
    requestConcurrency: 2,
    urlFilter: (url) => {
      const targetDomain = new URL(BASE_URL).hostname;
      try {
        const urlObj = new URL(url);
        return urlObj.hostname === targetDomain;
      } catch {
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
      if (resource.url.includes('/news/')) {
        console.log(`✓ Saved: ${resource.url}`);
      }
    }
  };
  
  try {
    console.log('\n📥 Starting news section scrape...\n');
    
    const startTime = Date.now();
    const result = await scrape(options);
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Scraping completed successfully!');
    console.log(`Pages scraped: ${newsUrls.length}`);
    console.log(`Total resources: ${result.length}`);
    console.log(`Time taken: ${duration} seconds`);
    console.log('='.repeat(70));
    
    // Move files from temp directory to news directory
    console.log('\n📦 Moving scraped files to repository...');
    const targetDir = path.join(process.cwd(), 'news');
    const scrapedNewsDir = path.join(outputDir, 'srrn.net', 'news');
    
    if (!fs.existsSync(scrapedNewsDir)) {
      console.error('Error: Scraped news directory not found');
      throw new Error('Scraped directory structure unexpected');
    }
    
    // Backup existing news directory
    if (fs.existsSync(targetDir)) {
      const backupDir = path.join(process.cwd(), '.news-backup-' + Date.now());
      fs.renameSync(targetDir, backupDir);
      console.log(`  ℹ Backed up existing news to: ${backupDir}`);
    }
    
    // Create news directory
    fs.mkdirSync(targetDir, { recursive: true });
    
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
          fs.copyFileSync(srcPath, destPath);
          console.log(`  ✓ Copied: ${path.relative(process.cwd(), destPath)}`);
        }
      }
    }
    
    copyFiles(scrapedNewsDir, targetDir);
    
    // Clean up temp directory
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log('\n✅ Files moved successfully!\n');
    
    console.log('='.repeat(70));
    console.log('✅ News section updated successfully!');
    console.log(`📄 Main page: news/index.html`);
    console.log(`📁 Pagination: news/page/2/, news/page/3/, etc.`);
    console.log('='.repeat(70));
    console.log('\nNext steps:');
    console.log('1. Run: npm run serve');
    console.log('2. Visit: http://localhost:8000/news/');
    console.log('3. Verify pagination links work');
    console.log('='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Error during scraping:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the scraper
main();
