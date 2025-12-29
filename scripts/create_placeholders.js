#!/usr/bin/env node

/**
 * create_placeholders.js
 * 
 * Creates placeholder HTML files for all missing pages.
 * This allows testing of navigation and structure while waiting
 * for the actual pages to be scraped.
 * 
 * Usage: node create_placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Pages to create placeholders for
const PAGES = [
  { 
    dir: 'about-us', 
    title: 'About Us',
    description: 'Information about Suicide Resource and Response Network'
  },
  { 
    dir: 'donate', 
    title: 'Donate',
    description: 'Support our mission to provide suicide prevention resources'
  },
  { 
    dir: 'aftercare', 
    title: 'Aftercare',
    description: 'Support services for those affected by suicide'
  },
  { 
    dir: 'events', 
    title: 'Special Events',
    description: 'Upcoming events and activities'
  },
  { 
    dir: 'news', 
    title: 'News',
    description: 'Latest news and updates from SRRN'
  },
  { 
    dir: 'request-a-training', 
    title: 'Request a Training',
    description: 'Request suicide prevention training for your organization'
  },
  { 
    dir: 'talk-today', 
    title: 'Talk Today',
    description: 'Resources for immediate support'
  },
  { 
    dir: 'training-calendar', 
    title: 'Training Calendar',
    description: 'Upcoming training sessions and workshops'
  },
  { 
    dir: 'training', 
    title: 'Training',
    description: 'Suicide prevention training programs'
  },
  { 
    dir: 'trainings-offered', 
    title: 'Trainings Offered',
    description: 'Overview of our training programs'
  }
];

const PLACEHOLDER_TEMPLATE = (page) => `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} | Suicide Resource and Response Network</title>
    <meta name="description" content="${page.description}">
    <link rel="stylesheet" href="../css/style.min.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .placeholder-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 40px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .placeholder-header {
            color: #0088aa;
            border-bottom: 3px solid #0088aa;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        .placeholder-notice {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .placeholder-nav {
            margin-top: 30px;
        }
        .placeholder-nav a {
            color: #0088aa;
            text-decoration: none;
            margin-right: 15px;
        }
        .placeholder-nav a:hover {
            text-decoration: underline;
        }
        .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #0088aa;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        .back-link:hover {
            background-color: #006688;
        }
    </style>
</head>
<body>
    <div class="placeholder-container">
        <h1 class="placeholder-header">${page.title}</h1>
        
        <div class="placeholder-notice">
            <strong>⚠️ Placeholder Page</strong><br>
            This page is a placeholder and will be replaced with actual content from srrn.net once the site is accessible and scraped.
        </div>
        
        <p>${page.description}</p>
        
        <h2>What to Expect</h2>
        <p>Once the full site scraping is complete, this page will contain the actual content from <code>https://srrn.net/${page.dir}/</code>, including:</p>
        <ul>
            <li>Complete page content and layout</li>
            <li>All images and media</li>
            <li>Proper styling and formatting</li>
            <li>Interactive elements</li>
        </ul>
        
        <h2>How to Complete Conversion</h2>
        <p>To replace this placeholder with real content:</p>
        <ol>
            <li>Ensure you have network access to srrn.net</li>
            <li>Run: <code>npm run scrape:all</code></li>
            <li>Run: <code>npm run repair</code></li>
            <li>Run: <code>npm run verify</code></li>
        </ol>
        
        <p>See <a href="../MANUAL_STEPS.md">MANUAL_STEPS.md</a> for detailed instructions.</p>
        
        <a href="../" class="back-link">← Back to Home</a>
        
        <div class="placeholder-nav">
            <h3>Navigation</h3>
            <a href="../">Home</a> |
            <a href="../about-us/">About Us</a> |
            <a href="../donate/">Donate</a> |
            <a href="../aftercare/">Aftercare</a> |
            <a href="../events/">Events</a> |
            <a href="../news/">News</a> |
            <a href="../request-a-training/">Request Training</a> |
            <a href="../talk-today/">Talk Today</a> |
            <a href="../training-calendar/">Training Calendar</a> |
            <a href="../training/">Training</a> |
            <a href="../trainings-offered/">Trainings Offered</a>
        </div>
    </div>
    
    <script>
        // Add warning if this is still a placeholder after some time
        const createDate = new Date('2025-12-29');
        const now = new Date();
        const daysSinceCreation = Math.floor((now - createDate) / (1000 * 60 * 60 * 24));
        
        if (daysSinceCreation > 7) {
            const notice = document.querySelector('.placeholder-notice');
            notice.innerHTML += '<br><br><strong>Note:</strong> This placeholder was created ' + 
                daysSinceCreation + ' days ago. Please check if the scraping has been completed.';
        }
    </script>
</body>
</html>
`;

console.log('='.repeat(70));
console.log('Creating Placeholder Pages');
console.log('='.repeat(70));
console.log('This will create placeholder HTML files for testing navigation');
console.log('while waiting for actual content to be scraped.\n');

let created = 0;
let skipped = 0;

PAGES.forEach(page => {
    const dir = path.join('.', page.dir);
    const filePath = path.join(dir, 'index.html');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // Only create if file doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, PLACEHOLDER_TEMPLATE(page));
        console.log(`✅ Created: ${filePath}`);
        created++;
    } else {
        console.log(`⏭  Skipped: ${filePath} (already exists)`);
        skipped++;
    }
});

console.log('\n' + '='.repeat(70));
console.log(`Summary: ${created} created, ${skipped} skipped`);
console.log('='.repeat(70));

if (created > 0) {
    console.log('\n📝 Placeholder pages created successfully!');
    console.log('\nThese placeholders will:');
    console.log('  ✓ Allow testing of site navigation');
    console.log('  ✓ Provide information about missing content');
    console.log('  ✓ Be automatically replaced when real pages are scraped');
    console.log('\nTo test the site with placeholders:');
    console.log('  python3 -m http.server 8000');
    console.log('  Then visit: http://localhost:8000/');
}

console.log('\n⚠️  Remember: These are placeholders!');
console.log('Run "npm run scrape:all" to download actual content.');
