
import os
import requests
import re
from pathlib import Path

# Configuration
REPO_ROOT = os.getcwd()
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
ASSETS_DIR = os.path.join(REPO_ROOT, "assets")
UPLOADS_DIR = os.path.join(ASSETS_DIR, "uploads")
LIVE_BASE_URL = "https://srrn.net/wp-content/uploads"

# Placeholder for testimonials
PLACEHOLDER_URL = "https://srrn.net/wp-content/themes/Divi/includes/builder/images/placeholder-image-square.jpg" # Or generic
PLACEHOLDER_LOCAL = os.path.join(ASSETS_DIR, "placeholder-user.jpg")

def ensure_dir(path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)

def download_file(url, local_path):
    if os.path.exists(local_path):
        print(f"Skipping (exists): {local_path}")
        return True
    
    print(f"Downloading: {url} -> {local_path}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 200:
            ensure_dir(local_path)
            with open(local_path, 'wb') as f:
                f.write(r.content)
            print("Success.")
            return True
        else:
            print(f"Failed (Status {r.status_code}): {url}")
            return False
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

def recover_assets():
    print(f"Scanning {HTML_FILE} for missing assets...")
    
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find images pointing to our local structure /FFC-EX-SRRN.net/assets/uploads/...
    # Pattern: src="/FFC-EX-SRRN.net/assets/uploads/([^"]+)"
    matches = re.findall(r'src="/FFC-EX-SRRN.net/assets/uploads/([^"]+)"', content)
    
    for relative_path in matches:
        # relative_path is like "2021/09/image.jpg"
        local_path = os.path.join(UPLOADS_DIR, relative_path.replace("/", os.sep))
        live_url = f"{LIVE_BASE_URL}/{relative_path}"
        
        download_file(live_url, local_path)

    # Regex for srcset
    srcset_matches = re.findall(r'srcset="([^"]+)"', content)
    for srcset in srcset_matches:
        # Split by comma
        urls = srcset.split(',')
        for entry in urls:
            entry = entry.strip().split(' ')[0] # Get URL part
            if "/assets/uploads/" in entry:
                # Clean up path
                if "../assets/uploads/" in entry:
                     clean = entry.split("../assets/uploads/")[1]
                elif "/FFC-EX-SRRN.net/assets/uploads/" in entry:
                     clean = entry.split("/FFC-EX-SRRN.net/assets/uploads/")[1]
                else:
                    continue
                
                local_path = os.path.join(UPLOADS_DIR, clean.replace("/", os.sep))
                live_url = f"{LIVE_BASE_URL}/{clean}"
                download_file(live_url, local_path)

    # Download Placeholder for Testimonials
    download_file("https://secure.gravatar.com/avatar/ad516503a11cd5ca435acc9bb6523536?s=500", PLACEHOLDER_LOCAL)

    # Inject Placeholder into Testimonials
    # We look for <div class="et_pb_testimonial_portrait"></div> and replace it with img
    if '<div class="et_pb_testimonial_portrait"></div>' in content:
        print("Injecting placeholder images into empty testimonial divs...")
        new_content = content.replace(
            '<div class="et_pb_testimonial_portrait"></div>',
            f'<div class="et_pb_testimonial_portrait"><img src="../assets/placeholder-user.jpg" alt="User" width="90" height="90" /></div>'
        )
        if new_content != content:
            with open(HTML_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Testimonial injection complete.")

    # Fix Video Path if needed (make it simple relative)
    # Current: src="/FFC-EX-SRRN.net/assets/Michael-Webster-640x360-1.mp4" (or similar)
    # We want: src="../assets/Michael-Webster-640x360-1.mp4"
    if 'src="/FFC-EX-SRRN.net/assets/Michael-Webster-640x360-1.mp4"' in content: # Check for absolute first
         print("Fixing video path to relative...")
         content = content.replace('src="/FFC-EX-SRRN.net/assets/Michael-Webster-640x360-1.mp4"', 'src="../assets/Michael-Webster-640x360-1.mp4"')
         with open(HTML_FILE, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    recover_assets()
