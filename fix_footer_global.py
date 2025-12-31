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
                        # Actually let's put it before the CSS if possible or just before head
                        content = content.replace("</head>", f"\t{js_script}\n</head>")
                        modified = True
                        print(f"Injecting JS into: {file_path}")

                if modified:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1

    print(f"Total files updated: {count}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    fix_html_files(current_dir)
