
import os
import glob

REPO_PATH = os.getcwd()

DONATE_HTML = """
<!-- Custom Donate Button Injection -->
<div class="custom-donate-button-wrapper">
    <a href="https://p2p.onecause.com/srrn/donate" target="_blank" class="custom-donate-button" title="Donate Now">
        <span class="icon" data-icon="&#57497;">&#57497;</span>
    </a>
</div>
</body>
"""

def inject_donate_button():
    print("Injecting Donate Now button into all HTML files...")
    html_files = glob.glob(os.path.join(REPO_PATH, "**/*.html"), recursive=True)
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Avoid duplicate injection
        if "custom-donate-button-wrapper" in content:
            continue
            
        # Inject before closing body tag
        if "</body>" in content:
            new_content = content.replace("</body>", DONATE_HTML)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Injected: {file_path}")
            
    print(f"Done. Injected into {count} files.")

if __name__ == "__main__":
    inject_donate_button()
