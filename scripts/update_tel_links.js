#!/usr/bin/env node

/**
 * Update all crisis helpline phone numbers to use TEL and SMS links
 * 
 * Changes:
 * - "988" becomes <a href="tel:988">988</a>
 * - "TALK to 741741" becomes <a href="sms:741741&body=TALK">TALK to 741741</a>
 */

const fs = require('fs');
const path = require('path');

// Statistics
let filesProcessed = 0;
let filesModified = 0;
let replacementsMade = 0;

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Skip node_modules and .git directories
            if (file !== 'node_modules' && file !== '.git') {
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
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Pattern 1: Single-line format (most common)
        const pattern1 = /Call <u>988 <\/u>or text&nbsp;<a href="https:\/\/crisistextline\.org\/" target="_blank" rel="noopener noreferrer" style="color: #000000;"><span style="text-decoration: underline;">TALK to 741741<\/span><\/a>/g;
        
        // Pattern 2: Multi-line format (for index.html and similar files)
        // This handles whitespace and line breaks between elements
        const pattern2 = /Call <u>988 <\/u>or\s+text&nbsp;<a href="https:\/\/crisistextline\.org\/"\s+target="_blank"\s+rel="noopener noreferrer"\s+style="color: #000000;"><span\s+style="text-decoration: underline;">TALK to\s+741741<\/span><\/a>/g;
        
        // Replacement with TEL and SMS links
        const replacement = 'Call <a href="tel:988" style="color: #000000;"><u>988</u></a> or text <a href="sms:741741&body=TALK" style="color: #000000;"><span style="text-decoration: underline;">TALK to 741741</span></a>';
        
        // Count matches before replacement
        const matches1 = content.match(pattern1);
        const matches2 = content.match(pattern2);
        const matchCount = (matches1 ? matches1.length : 0) + (matches2 ? matches2.length : 0);
        
        if (matchCount > 0) {
            // Apply both patterns
            content = content.replace(pattern1, replacement);
            content = content.replace(pattern2, replacement);
            
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                filesModified++;
                replacementsMade += matchCount;
                console.log(`✅ Updated ${filePath} (${matchCount} replacement${matchCount > 1 ? 's' : ''})`);
            }
        }
        
        filesProcessed++;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

/**
 * Main function
 */
function main() {
    console.log('🔍 Searching for HTML files with crisis helpline text...\n');
    
    // Find all HTML files
    const htmlFiles = findHtmlFiles('/home/runner/work/FFC-EX-SRRN.net/FFC-EX-SRRN.net');
    
    console.log(`📁 Found ${htmlFiles.length} HTML files\n`);
    
    // Process each file
    for (const file of htmlFiles) {
        processHtmlFile(file);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log('='.repeat(60));
    console.log(`Files processed: ${filesProcessed}`);
    console.log(`Files modified: ${filesModified}`);
    console.log(`Total replacements: ${replacementsMade}`);
    console.log('='.repeat(60));
    
    if (filesModified > 0) {
        console.log('\n✅ All crisis helpline numbers updated successfully!');
    } else {
        console.log('\n⚠️  No files needed updating.');
    }
}

// Run the script
try {
    main();
} catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
}
