#!/usr/bin/env node

/**
 * verify_pages.js
 * 
 * Verifies that all expected pages have been scraped and are present
 * in the repository.
 * 
 * Usage: node verify_pages.js
 */

const fs = require('fs');
const path = require('path');

// Expected pages based on URL discovery
const EXPECTED_PAGES = [
  { path: '/', file: 'index.html', name: 'Home' },
  { path: '/about-us/', file: 'about-us/index.html', name: 'About Us' },
  { path: '/donate/', file: 'donate/index.html', name: 'Donate' },
  { path: '/aftercare/', file: 'aftercare/index.html', name: 'Aftercare' },
  { path: '/events/', file: 'events/index.html', name: 'Special Events' },
  { path: '/news/', file: 'news/index.html', name: 'News' },
  { path: '/request-a-training/', file: 'request-a-training/index.html', name: 'Request a Training' },
  { path: '/talk-today/', file: 'talk-today/index.html', name: 'Talk Today' },
  { path: '/training-calendar/', file: 'training-calendar/index.html', name: 'Training Calendar' },
  { path: '/training/', file: 'training/index.html', name: 'Training' },
  { path: '/trainings-offered/', file: 'trainings-offered/index.html', name: 'Trainings Offered' }
];

console.log('='.repeat(70));
console.log('Page Verification Tool');
console.log('='.repeat(70));
console.log(`Checking for ${EXPECTED_PAGES.length} expected pages...\n`);

let foundCount = 0;
let missingCount = 0;
const missing = [];

EXPECTED_PAGES.forEach((page, index) => {
  const exists = fs.existsSync(page.file);
  const status = exists ? '✅' : '❌';
  const size = exists ? fs.statSync(page.file).size : 0;
  const sizeKB = (size / 1024).toFixed(2);
  
  console.log(`${index + 1}. ${status} ${page.name}`);
  console.log(`   Path: ${page.path}`);
  console.log(`   File: ${page.file}`);
  
  if (exists) {
    console.log(`   Size: ${sizeKB} KB`);
    foundCount++;
  } else {
    console.log(`   Status: MISSING`);
    missingCount++;
    missing.push(page);
  }
  console.log();
});

console.log('='.repeat(70));
console.log('Summary:');
console.log(`  Found: ${foundCount}/${EXPECTED_PAGES.length}`);
console.log(`  Missing: ${missingCount}/${EXPECTED_PAGES.length}`);
console.log('='.repeat(70));

if (missingCount > 0) {
  console.log('\n⚠ Missing Pages:');
  missing.forEach((page, index) => {
    console.log(`  ${index + 1}. ${page.name} (${page.file})`);
  });
  console.log('\nTo scrape missing pages, run:');
  console.log('  node scripts/scrape_all_pages.js');
  process.exit(1);
} else {
  console.log('\n✅ All expected pages are present!');
  console.log('\nNext steps:');
  console.log('  1. Run repair script: node scripts/repair_site.js .');
  console.log('  2. Test navigation between pages');
  console.log('  3. Verify responsive layout');
  console.log('  4. Deploy to GitHub Pages');
  process.exit(0);
}
