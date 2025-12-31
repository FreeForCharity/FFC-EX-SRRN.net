import os

# Root directory
ROOT_DIR = r"c:\Users\clark\OneDrive\Documents\AntiGravity\FFC-EX-SRRN.net"
REPO_NAME = "/FFC-EX-SRRN.net/"

def fix_paths(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # replacements map - simplified to replace any known relative asset path with absolute
        # We target specific folders that we know are in the root
        
        replacements = {}
        
        # Prefixes to handle: ./, ../, ../../, and maybe nothing (if relative)
        prefixes = ['./', '../', '../../', '../../../']
        targets = ['assets/', 'wp-content/', 'wp-includes/', 'css/', 'js/', 'images/', 'feed/', 'comments/', 'xmlrpc.php']
        
        for prefix in prefixes:
            for target in targets:
                # href="...
                old_href = f'href="{prefix}{target}'
                new_href = f'href="{REPO_NAME}{target}'
                replacements[old_href] = new_href
                
                # src="...
                old_src = f'src="{prefix}{target}'
                new_src = f'src="{REPO_NAME}{target}'
                replacements[old_src] = new_src
        
        # Also handle specific css file name if it differs, but absolute path fix should solve 404 if file exists now.
        
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            # print(f"Fixed paths in: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

count = 0
for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith(".html"):
            if fix_paths(os.path.join(root, file)):
                count += 1

print(f"Total files updated: {count}")
