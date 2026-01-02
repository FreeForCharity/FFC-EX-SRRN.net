
import os
import glob

REPO_PATH = os.getcwd()
CACHE_BUSTER = "?v=final4"

def add_cache_buster():
    print("Adding NEW cache buster (v=final4) to custom-fixes.css in all HTML files...")
    html_files = glob.glob(os.path.join(REPO_PATH, "**/*.html"), recursive=True)
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace old buster
        import re
        if "custom-fixes.css?v=" in content:
            new_content = re.sub(r'custom-fixes.css\?v=[a-zA-Z0-9_]+', f'custom-fixes.css{CACHE_BUSTER}', content)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {file_path}")
        else:
             print(f"Skipping (no CSS link found): {file_path}")
            
    print(f"Done. Updated {count} files.")

if __name__ == "__main__":
    add_cache_buster()
