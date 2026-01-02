import os

# Root directory
ROOT_DIR = r"c:\Users\clark\OneDrive\Documents\AntiGravity\FFC-EX-SRRN.net"
CSS_LINK = '<link rel="stylesheet" id="custom-fixes-css" href="/FFC-EX-SRRN.net/css/custom-fixes.css" type="text/css" media="all">'

def inject_css(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if "custom-fixes.css" in content:
            print(f"Skipping {file_path} (already has custom-fixes)")
            return False
            
        # Inject before </head>
        if "</head>" in content:
            new_content = content.replace("</head>", f"\t{CSS_LINK}\n</head>")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected CSS into: {file_path}")
            return True
        else:
            print(f"Skipping {file_path} (no </head> tag)")
            return False
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

count = 0
for root, dirs, files in os.walk(ROOT_DIR):
    for file in files:
        if file.endswith(".html"):
            if inject_css(os.path.join(root, file)):
                count += 1

print(f"Total files updated: {count}")
