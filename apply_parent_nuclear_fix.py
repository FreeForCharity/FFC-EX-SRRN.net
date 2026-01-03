
import os
import re

REPO_ROOT = os.getcwd()
HTML_FILE = os.path.join(REPO_ROOT, "about-us/index.html")
CACHE_BUSTER = "?v=final19"

def apply_parent_nuclear_fix():
    print(f"Applying PARENT nuclear inline style fix to {HTML_FILE}...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Strategy:
    # 1. content is currently one big string or has newlines.
    # 2. find the img tag position.
    # 3. search backwards for the opening <div of the parent module.
    #    The subagent identified the parent as: <div class="et_pb_module et_pb_image et_pb_image_0 ...">
    #    or <span class="et_pb_image_wrap"> which is inside that div.
    
    # Let's target the module div specifically.
    
    # Regex to find the image tag for context
    img_pattern = r'(<img[^>]*src="[^"]*SRRN-Circle-Design-Teal[^"]*"[^>]*>)'
    img_match = re.search(img_pattern, content)
    
    if not img_match:
        print("Error: Logo IMG not found!")
        return

    img_start_pos = img_match.start()
    
    # Now look backwards for the container div.
    # It should have class "et_pb_image_0"
    
    # We'll search for <div [^>]*class="[^"]*et_pb_image_0[^"]*"
    # But we need to make sure it's the one BEFORE the image.
    
    pre_img_content = content[:img_start_pos]
    
    # Find last occurrence of the target div opener
    # Pattern for the specific module class identified by subagent
    div_pattern = r'(<div[^>]*class="[^"]*et_pb_image_0[^"]*"[^>]*>)'
    
    # We use rfindAll and take the last one to get the closest one before the image
    div_matches = list(re.finditer(div_pattern, pre_img_content))
    
    if not div_matches:
        print("Error: Parent DIV with class 'et_pb_image_0' not found before image!")
        # Fallback: Search for generic et_pb_module just before? No, safer to fail or try broad search.
        return

    target_div_match = div_matches[-1]
    original_div_tag = target_div_match.group(1)
    print(f"Found parent div: {original_div_tag}")
    
    # Prepare nuclear style
    nuclear_style = 'style="opacity: 1 !important; visibility: visible !important; animation: none !important; transform: none !important; display: block !important;"'
    
    # Inject style
    if 'style="' in original_div_tag:
        # Replace existing style
        new_div_tag = re.sub(r'style="[^"]*"', nuclear_style, original_div_tag)
    else:
        # Insert style before closing >
        new_div_tag = original_div_tag[:-1] + " " + nuclear_style + ">"
        
    # Replace in content
    # We need to construct the new content carefully
    # content = pre_img_content(up to div start) + new_div + pre_img_content(after div) + rest
    
    div_start = target_div_match.start()
    div_end = target_div_match.end()
    
    new_content = content[:div_start] + new_div_tag + content[div_end:]
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Parent Nuclear style injected.")

def update_cache_buster():
    print(f"Updating cache buster to {CACHE_BUSTER}...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = re.sub(r'custom-fixes.css\?v=[a-zA-Z0-9_]+', f'custom-fixes.css{CACHE_BUSTER}', content)
    
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Cache buster updated in index.html.")

if __name__ == "__main__":
    apply_parent_nuclear_fix()
    update_cache_buster()
