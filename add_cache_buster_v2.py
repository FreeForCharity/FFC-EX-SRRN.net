
import os
import glob

REPO_PATH = os.getcwd()
CACHE_BUSTER = "?v=final2"

def add_cache_buster():
    print("Adding NEW cache buster (v=final2) to custom-fixes.css in all HTML files...")
    html_files = glob.glob(os.path.join(REPO_PATH, "**/*.html"), recursive=True)
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace old buster if exists, or append new one
        if "custom-fixes.css?v=final" in content:
            new_content = content.replace("custom-fixes.css?v=final", f"custom-fixes.css{CACHE_BUSTER}")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Updated (replaced): {file_path}")
        elif "custom-fixes.css" in content and CACHE_BUSTER not in content:
             # Basic append if no buster was there (unlikely given previous steps, but safe)
            new_content = content.replace('custom-fixes.css"', f'custom-fixes.css{CACHE_BUSTER}"')
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Updated (new): {file_path}")
            
    print(f"Done. Updated {count} files.")

if __name__ == "__main__":
    add_cache_buster()
