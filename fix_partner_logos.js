#!/usr/bin/env node

/**
 * Fix broken partner logo srcset references
 * Removes references to non-existent 480x480 scaled images
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');

console.log('🔍 Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf8');

// Pattern to match srcset attributes that reference Partners-And-Sponsors-Logos with 480x480
const srcsetPattern = /srcset="(\.\/assets\/uploads\/2020\/12\/Partners-And-Sponsors-Logos[^"]*-480x480\.png[^"]*)"/g;

// Count matches before fix
const matchesBefore = html.match(srcsetPattern);
console.log(`Found ${matchesBefore ? matchesBefore.length : 0} srcset attributes referencing non-existent 480x480 images`);

if (matchesBefore) {
  matchesBefore.forEach((match, index) => {
    console.log(`  ${index + 1}. ${match.substring(0, 80)}...`);
  });
}

// Replace srcset attributes that have Partners-And-Sponsors-Logos with 480x480
// Keep only the main image (512w version) and remove the 480w version
html = html.replace(
  /srcset="(\.\/assets\/uploads\/2020\/12\/Partners-And-Sponsors-Logos(-\d+)?\.png) 512w, \.\/assets\/uploads\/2020\/12\/Partners-And-Sponsors-Logos(-\d+)?-480x480\.png 480w"/g,
  'srcset="$1 512w"'
);

// Also update sizes attribute to be simpler when we only have one size
html = html.replace(
  /sizes="\(min-width: 0px\) and \(max-width: 480px\) 480px, \(min-width: 481px\) 512px, 100vw"/g,
  'sizes="(max-width: 512px) 100vw, 512px"'
);

// Count matches after fix
const matchesAfter = html.match(srcsetPattern);
console.log(`\n✅ Fixed srcset attributes. Remaining references to 480x480: ${matchesAfter ? matchesAfter.length : 0}`);

// Write the fixed HTML
fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ index.html updated successfully');

// Also remove the empty image wrapper at line 7695
console.log('\n🔍 Checking for empty image wrappers...');
const emptyImagePattern = /<div class="et_pb_module et_pb_image et_pb_image_7">\s*\n\s*\n\s*\n\s*\n\s*<span class="et_pb_image_wrap "><\/span>\s*\n\s*<\/div>/;
if (emptyImagePattern.test(html)) {
  html = html.replace(emptyImagePattern, '');
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ Removed empty image wrapper (et_pb_image_7)');
} else {
  console.log('ℹ️  No empty image wrapper found (may have been already removed)');
}

console.log('\n✨ All fixes applied successfully!');
