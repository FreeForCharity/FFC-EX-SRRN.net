
import os
import re

REPO_ROOT = os.getcwd()
CSS_FILE = os.path.join(REPO_ROOT, "css/custom-fixes.css")
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
CACHE_BUSTER = "?v=final18"

CSS_TO_APPEND = """
/* FINAL FIX Round 3: Force Animation Visibility */
/* Divi animations hide elements (opacity: 0) until JS triggers them. */
/* Since JS is flaky on static pages, we FORCE visibility. */

.et_animated,
.et_pb_animation_top,
.et_pb_animation_bottom,
.et_pb_animation_left,
.et_pb_animation_right,
.et_pb_image_0 {
    opacity: 1 !important;
    animation: none !important;
    transform: none !important;
    visibility: visible !important;
}

/* Ensure the module itself forces display */
.et_pb_image_0 {
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
    
    new_content = re.sub(r'custom-fixes.css\?v=[a-zA-Z0-9_]+', f'custom-fixes.css{CACHE_BUSTER}', content)
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cache buster updated in index.html.")

if __name__ == "__main__":
    append_css()
    update_cache_buster()
