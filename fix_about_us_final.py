
import os
import requests
import re

REPO_ROOT = os.getcwd()
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
ASSETS_DIR = os.path.join(REPO_ROOT, "assets")
LOGO_DIR = os.path.join(ASSETS_DIR, "uploads/2020/11")
LOGO_URL = "https://srrn.net/wp-content/uploads/2020/11/SRRN-Circle-Design-Teal-480x467.png"
LOGO_LOCAL = os.path.join(LOGO_DIR, "SRRN-Circle-Design-Teal-480x467.png")
JS_FILE = os.path.join(REPO_ROOT, "fix_toggles.js")

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def download_logo():
    print(f"Checking logo at {LOGO_LOCAL}...")
    ensure_dir(LOGO_DIR)
    if not os.path.exists(LOGO_LOCAL):
        print(f"Downloading {LOGO_URL}...")
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            r = requests.get(LOGO_URL, headers=headers, timeout=10)
            if r.status_code == 200:
                with open(LOGO_LOCAL, 'wb') as f:
                    f.write(r.content)
                print("Logo downloaded successfully.")
            else:
                print(f"Failed to download logo. Status: {r.status_code}")
        except Exception as e:
            print(f"Error downloading logo: {e}")
    else:
        print("Logo already exists.")

def create_toggle_script():
    print(f"Creating {JS_FILE}...")
    js_content = """
document.addEventListener('DOMContentLoaded', function() {
    console.log("Fixing toggles...");
    var toggles = document.querySelectorAll('.et_pb_toggle_title');
    
    toggles.forEach(function(toggle) {
        // Remove cloned event listeners if any (simple hack: clone node)
        // Actually, just binding new click should remain simple.
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default if it's a link
            
            var parent = this.parentElement;
            var content = parent.querySelector('.et_pb_toggle_content');
            
            // Toggle classes
            if (parent.classList.contains('et_pb_toggle_open')) {
                parent.classList.remove('et_pb_toggle_open');
                parent.classList.add('et_pb_toggle_close');
                // Slide Up
                content.style.display = 'none';
            } else {
                parent.classList.remove('et_pb_toggle_close');
                parent.classList.add('et_pb_toggle_open');
                // Slide Down
                content.style.display = 'block';
            }
        });
        
        // Ensure initial state matches class
        var parent = toggle.parentElement;
        var content = parent.querySelector('.et_pb_toggle_content');
        if (parent.classList.contains('et_pb_toggle_close')) {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    });
});
"""
    with open(JS_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Toggle script created.")

def inject_script():
    print(f"Injecting script into {HTML_FILE}...")
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already injected
    if "fix_toggles.js" in content:
        print("Script already injected.")
        return

    # Inject before closing body tag
    script_tag = '<script src="../fix_toggles.js"></script>'
    if "</body>" in content:
        new_content = content.replace("</body>", f"{script_tag}\n</body>")
        with open(HTML_FILE, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Script injected successfully.")
    else:
        print("Could not find </body> tag.")

if __name__ == "__main__":
    download_logo()
    create_toggle_script()
    inject_script()
