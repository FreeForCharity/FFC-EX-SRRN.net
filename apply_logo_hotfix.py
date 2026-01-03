
import os
import re

REPO_ROOT = os.getcwd()
CSS_FILE = os.path.join(REPO_ROOT, "css/custom-fixes.css")
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
CACHE_BUSTER = "?v=final16"

CSS_TO_APPEND = """
/* FINAL FIX Round 2: Logo Layout Conflict */
img[src*="SRRN-Circle-Design-Teal"] {
    position: relative !important; /* Force flow layout to expand parent */
    width: 480px !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    left: auto !important;
    top: auto !important;
    margin: 0 auto !important; /* Center it */
}

/* Ensure parent wrapper doesn't collapse */
.et_pb_image_wrap:has(img[src*="SRRN-Circle-Design-Teal"]) {
    width: auto !important;
    display: block !important;
}
"""

def append_css():
    print(f"Appending CSS to {CSS_FILE}...")
    with open(CSS_FILE, "a", encoding="utf-8") as f:
        f.write(CSS_TO_APPEND)
    print("CSS appended.")

def update_cache_buster():
    print(f"Updating cache buster to {CACHE_BUSTER}...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Simple regex update for v=finalXX
    new_content = re.sub(r'custom-fixes.css\?v=[a-zA-Z0-9_]+', f'custom-fixes.css{CACHE_BUSTER}', content)
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cache buster updated in index.html.")

if __name__ == "__main__":
    append_css()
    update_cache_buster()
