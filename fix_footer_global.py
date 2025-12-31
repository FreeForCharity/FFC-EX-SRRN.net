import os

def fix_html_files(root_dir):
    # CSS to inject
    css_file_name = "custom-fixes.css"
    # JS to inject (optional/good practice since we did it for index.html)
    js_file_name = "custom-menu.js" 

    count = 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.lower().endswith(".html"):
                file_path = os.path.join(dirpath, filename)
                
                # Calculate relative path to the root's css folder
                # depth is number of separators from root to header
                rel_path_from_root = os.path.relpath(dirpath, root_dir)
                
                if rel_path_from_root == ".":
                    prefix = "" # Root
                else:
                    # e.g. about-us -> ".."
                    # 2025/01 -> "../.."
                    levels = rel_path_from_root.count(os.sep) + 1
                    prefix = "../" * levels
                
                # Construct relative links
                # We need css/custom-fixes.css and ./custom-menu.js (at root)
                
                # If prefix is empty (root), links are:
                # css/custom-fixes.css
                # custom-menu.js
                
                # If prefix is "../", links are:
                # ../css/custom-fixes.css
                # ../custom-menu.js
                
                if prefix == "":
                    css_link = f'<link rel="stylesheet" href="css/{css_file_name}">'
                    js_script = f'<script src="{js_file_name}" defer=""></script>'
                else:
                    css_link = f'<link rel="stylesheet" href="{prefix}css/{css_file_name}">'
                    js_script = f'<script src="{prefix}{js_file_name}" defer=""></script>'

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                modified = False
                
                # Check and Inject CSS
                if "custom-fixes.css" not in content:
                    # Inject before </head>
                    if "</head>" in content:
                        content = content.replace("</head>", f"\t{css_link}\n</head>")
                        modified = True
                        print(f"Injecting CSS into: {file_path}")
                
                # Check and Inject JS (for header menu fixes)
                if "custom-menu.js" not in content:
                    # Inject before </head> is fine, or before custom-fixes
                    if "</head>" in content:
                        # Find where we just put the CSS, or just before head
                        content = content.replace("</head>", f"\t{js_script}\n</head>")
                        modified = True
                        print(f"Injecting JS into: {file_path}")
                
                # Fix Broken Asset Paths (Comprehensive wp-content -> assets)
                # We need to handle uploads, plugins, themes, and et-cache
                replacements = {
                    "wp-content/uploads": "assets/uploads",
                    "wp-content/plugins": "assets/plugins",
                    "wp-content/themes": "assets/themes",
                    "wp-content/et-cache": "assets/et-cache"
                }

                for old, new in replacements.items():
                    if old in content:
                        content = content.replace(old, new)
                        modified = True
                        print(f"Fixed {old} -> {new} in: {file_path}")
                
                # Fix Absolute URLs (CORS / Broken Paths)
                # Previous run might have created //srrn.net/assets... or exists as //srrn.net/wp-content...
                # We want to replace these with relative paths or root-relative
                # Actually, using the calculated relative_path is best for portability (Github Pages subpath)
                
                # Calculate relative prefix for assets (remove ./ if distinct or ensure consistency)
                # relative_path variable from above includes ./ or ../
                # If relative_path is "./", we want just "assets/" or "./assets/"
                
                # Target: //srrn.net/assets -> {relative_path}assets
                # Target: https://srrn.net/assets -> {relative_path}assets
                
                bad_tlds = ["//srrn.net/assets", "https://srrn.net/assets", "http://srrn.net/assets", "//srrn.net/wp-content", "https://srrn.net/wp-content"]
                
                for bad in bad_tlds:
                    if bad in content:
                        # If bad was wp-content, we map to assets. If it was assets, we keep assets.
                        # But wait, earlier loop already replaced wp-content -> assets.
                        # So //srrn.net/wp-content became //srrn.net/assets already.
                        # So we primarily need to target //srrn.net/assets
                        
                        # Just in case some escaped detection
                        if "wp-content" in bad:
                             # This branch acts if the previous loop didn't catch it for some reason?
                             # But simpler to just target the domain prefix + asset folder
                             pass

                        content = content.replace(bad, f"{prefix}assets")
                        modified = True
                        print(f"Fixed absolute URL {bad} -> {prefix}assets in: {file_path}")

                # Clean up any potential double slashes from concatenation if relative_path ended in /
                # (handled by relative_path construction usually)
                
                # Fix specific double-slash issue seen in previously
                if "//assets" in content:
                    # Be careful not to break https://assets (unlikely) or //assets if it's protocol relative validly?
                    # valid protocol relative starts with //
                    # We only want to fix paths that look like href="//assets" which is actually valid 
                    # as protocol relative to domain root, but on GH pages with subpath it fails
                    # We want relative paths.
                    # This replace is risky. Let's rely on the domain replacements above.
                    pass

                if modified:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1

    print(f"Total files updated: {count}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    fix_html_files(current_dir)
