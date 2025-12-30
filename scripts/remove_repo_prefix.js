#!/usr/bin/env node

/**
 * remove_repo_prefix.js
 * 
 * Removes the /FFC-EX-SRRN.net/ prefix from all paths in HTML files
 * Converts paths like "/FFC-EX-SRRN.net/assets/..." to "./assets/..."
 * or "./FFC-EX-SRRN.net/assets/..." to "./assets/..."
 * 
 * Usage: node remove_repo_prefix.js <SITE_DIR>
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Error: Missing required argument');
  console.error('Usage: node remove_repo_prefix.js <SITE_DIR>');
  process.exit(1);
}

const siteDir = path.resolve(args[0]);
const REPO_PREFIX = '/FFC-EX-SRRN.net/';
const REPO_PREFIX_RELATIVE = './FFC-EX-SRRN.net/';

// Verify directory exists
if (!fs.existsSync(siteDir)) {
  console.error(`Error: Directory "${siteDir}" does not exist`);
  process.exit(1);
}

console.log('='.repeat(60));
console.log('Repository Prefix Remover');
console.log('='.repeat(60));
console.log(`Site Directory: ${siteDir}`);
console.log(`Removing prefix: ${REPO_PREFIX} and ${REPO_PREFIX_RELATIVE}`);
console.log('='.repeat(60));

// Statistics
let stats = {
  filesProcessed: 0,
  filesModified: 0,
  pathsFixed: 0
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
 * Process a single HTML file
 */
function processHtmlFile(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;
    
    // Count occurrences before replacement
    const countBefore = (html.match(new RegExp(REPO_PREFIX.replace(/\//g, '\\/'), 'g')) || []).length +
                        (html.match(new RegExp(REPO_PREFIX_RELATIVE.replace(/\//g, '\\/').replace(/\./g, '\\.'), 'g')) || []).length;
    
    // Replace /FFC-EX-SRRN.net/ with ./
    html = html.replace(/\/FFC-EX-SRRN\.net\//g, './');
    
    // Replace ./FFC-EX-SRRN.net/ with ./  
    html = html.replace(/\.\/FFC-EX-SRRN\.net\//g, './');
    
    // Check if file was modified
    if (html !== original) {
      stats.filesModified++;
      stats.pathsFixed += countBefore;
      
      // Save modified HTML
      fs.writeFileSync(filePath, html, 'utf8');
      
      const relativePath = path.relative(siteDir, filePath);
      console.log(`✓ Fixed ${countBefore} paths in: ${relativePath}`);
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
  console.log('\n🔧 Starting repository prefix removal...\n');
  
  // Find all HTML files
  const htmlFiles = findHtmlFiles(siteDir);
  console.log(`Found ${htmlFiles.length} HTML files\n`);
  
  // Process each file
  htmlFiles.forEach(processHtmlFile);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Prefix removal completed!');
  console.log('='.repeat(60));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total paths fixed: ${stats.pathsFixed}`);
  console.log('='.repeat(60));
}

// Run the fix process
main();
