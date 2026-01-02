
import os
import glob

REPO_PATH = os.getcwd()
CACHE_BUSTER = "?v=final"

def add_cache_buster():
    print("Adding cache buster to custom-fixes.css in all HTML files...")
    html_files = glob.glob(os.path.join(REPO_PATH, "**/*.html"), recursive=True)
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Look for the link to custom-fixes.css
        target_str = '/css/custom-fixes.css"'
        replacement_str = f'/css/custom-fixes.css{CACHE_BUSTER}"'
        
        # Check if it's already there (avoid double append)
        if CACHE_BUSTER in content:
            # Maybe update it if it's an old one? For now just skip
            # specific check for our new buster might be better if we iterate
            continue
            
        if target_str in content:
            new_content = content.replace(target_str, replacement_str)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {file_path}")
            
    print(f"Done. Updated {count} files.")

if __name__ == "__main__":
    add_cache_buster()
