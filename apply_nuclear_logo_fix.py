
import os
import re

REPO_ROOT = os.getcwd()
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
CACHE_BUSTER = "?v=final17"

def apply_nuclear_fix():
    print(f"Applying nuclear inline style fix to {HTML_FILE}...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Target the image.
    # Pattern: <img ... src="...SRRN-Circle-Design-Teal..." ...>
    # We want to insert style="..." or replace existing style.
    
    # Regex to find the tag
    # Note: verify content first. The tag likely looks like:
    # <img loading="lazy" ... src="...SRRN-Circle-Design-Teal..." ... class="...">
    
    match = re.search(r'(<img[^>]*src="[^"]*SRRN-Circle-Design-Teal[^"]*"[^>]*>)', content)
    if match:
        original_tag = match.group(1)
        print(f"Found tag: {original_tag}")
        
        # New style string
        nuclear_style = 'style="width: 480px !important; max-width: 100% !important; display: block !important; visibility: visible !important; opacity: 1 !important; position: relative !important;"'
        
        # Check if style attr exists
        if 'style="' in original_tag:
            # Append to existing style (simple regex replace might be tricky if messy, so let's just force replace the style attr)
            # Actually, standard replacement for style="..."
            new_tag = re.sub(r'style="[^"]*"', nuclear_style, original_tag)
        else:
            # Insert style before closing >
            new_tag = original_tag[:-1] + " " + nuclear_style + ">"
            
        new_content = content.replace(original_tag, new_tag)
        
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("Nuclear style injected.")
    else:
        print("Error: Could not find Teal Logo img tag.")

def update_cache_buster():
    print(f"Updating cache buster to {CACHE_BUSTER}...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = re.sub(r'custom-fixes.css\?v=[a-zA-Z0-9_]+', f'custom-fixes.css{CACHE_BUSTER}', content)
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cache buster updated in index.html.")

if __name__ == "__main__":
    apply_nuclear_fix()
    update_cache_buster()
