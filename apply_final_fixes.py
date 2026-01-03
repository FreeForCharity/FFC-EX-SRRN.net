
import os
import re

REPO_ROOT = os.getcwd()
CSS_FILE = os.path.join(REPO_ROOT, "css/custom-fixes.css")
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
CACHE_BUSTER = "?v=final15"

CSS_TO_APPEND = """
/* FINAL FIXES: Logo & Toggles */
img[src*="SRRN-Circle-Design-Teal"] {
    width: 480px !important;
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
}

.et_pb_toggle_open .et_pb_toggle_content {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    height: auto !important;
    padding-bottom: 20px !important;
}

.et_pb_toggle_close .et_pb_toggle_content {
    display: none !important;
}

.et_pb_toggle_title {
    cursor: pointer !important;
}
"""

JS_INLINE = """
<script>
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixing toggles (Inline)...");
    var toggles = document.querySelectorAll('.et_pb_toggle_title');
    
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            var parent = this.parentElement;
            var content = parent.querySelector('.et_pb_toggle_content');
            
            if (parent.classList.contains('et_pb_toggle_open')) {
                parent.classList.remove('et_pb_toggle_open');
                parent.classList.add('et_pb_toggle_close');
                content.style.display = 'none';
            } else {
                parent.classList.remove('et_pb_toggle_close');
                parent.classList.add('et_pb_toggle_open');
                content.style.display = 'block';
            }
        });
        
        // Initial state check
        var parent = toggle.parentElement;
        var content = parent.querySelector('.et_pb_toggle_content');
        if (parent.classList.contains('et_pb_toggle_open')) {
             content.style.display = 'block';
        } else {
             content.style.display = 'none';
        }
    });
});
</script>
"""

def append_css():
    print(f"Appending CSS to {CSS_FILE}...")
    with open(CSS_FILE, "a", encoding="utf-8") as f:
        f.write(CSS_TO_APPEND)
    print("CSS appended.")

def inline_js():
    print(f"Inlining JS in {HTML_FILE}...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace external script if exists
    if '<script src="../fix_toggles.js"></script>' in content:
        new_content = content.replace('<script src="../fix_toggles.js"></script>', JS_INLINE)
    else:
        # Append before body close if not found (fallback)
        if "</body>" in content:
            new_content = content.replace("</body>", f"{JS_INLINE}\n</body>")
        else:
            print("Error: Could not find script tag or body tag.")
            return

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("JS inlined.")

def update_cache_buster():
    print(f"Updating cache buster to {CACHE_BUSTER}...")
    # Just update the one file since we are hotfixing
    # Actually, better to update all if possible, but let's stick to the target file for speed + CSS file
    
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = re.sub(r'custom-fixes.css\?v=[a-zA-Z0-9_]+', f'custom-fixes.css{CACHE_BUSTER}', content)
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cache buster updated in index.html.")

if __name__ == "__main__":
    append_css()
    inline_js()
    update_cache_buster()
