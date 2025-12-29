#!/usr/bin/env node

/**
 * discover_urls.js
 * 
 * Discovers all URLs from the existing index.html file to identify
 * what pages need to be scraped from the live site.
 * 
 * Usage: node discover_urls.js [path-to-index.html]
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Parse command line arguments
const args = process.argv.slice(2);
const indexPath = args[0] || './index.html';

if (!fs.existsSync(indexPath)) {
  console.error(`Error: File not found: ${indexPath}`);
  process.exit(1);
}

console.log('='.repeat(70));
console.log('URL Discovery Tool for SRRN.net');
console.log('='.repeat(70));
console.log(`Analyzing: ${indexPath}\n`);

// Read and parse the HTML file
const html = fs.readFileSync(indexPath, 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

// Extract all links
const allLinks = Array.from(document.querySelectorAll('a[href]'));
const urls = new Set();

allLinks.forEach(link => {
  const href = link.getAttribute('href');
  
  // Filter for srrn.net URLs, excluding mailto: links
  if (href && !href.startsWith('mailto:') && !href.startsWith('javascript:')) {
    try {
      const url = new URL(href);
      // Strict hostname comparison to prevent subdomain attacks
      if (url.hostname === 'srrn.net') {
        // Remove query strings and fragments for cleaner URLs
        const cleanUrl = url.origin + url.pathname;
        urls.add(cleanUrl);
      }
    } catch (e) {
      // Ignore invalid URLs
    }
  }
});

// Sort URLs
const sortedUrls = Array.from(urls).sort();

console.log(`Found ${sortedUrls.length} unique URLs:\n`);
sortedUrls.forEach((url, index) => {
  console.log(`  ${index + 1}. ${url}`);
});

// Extract just the paths
const paths = sortedUrls.map(url => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (e) {
    return null;
  }
}).filter(p => p !== null);

// Deduplicate paths
const uniquePaths = Array.from(new Set(paths)).sort();

console.log('\n' + '='.repeat(70));
console.log(`Unique paths to scrape (${uniquePaths.length}):\n`);
uniquePaths.forEach((urlPath, index) => {
  console.log(`  ${index + 1}. ${urlPath}`);
});

// Save to a file
const outputFile = 'urls-to-scrape.json';
const output = {
  discoveredAt: new Date().toISOString(),
  sourceFile: indexPath,
  baseUrl: 'https://srrn.net',
  totalUrls: sortedUrls.length,
  uniquePaths: uniquePaths,
  fullUrls: sortedUrls
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

console.log('\n' + '='.repeat(70));
console.log(`✅ URL list saved to: ${outputFile}`);
console.log('='.repeat(70));
console.log('\nUse this information to update scripts/scrape_all_pages.js');
console.log('with the complete list of pages to scrape.');
