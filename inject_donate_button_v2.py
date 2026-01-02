
import os
import glob

REPO_PATH = os.getcwd()

# Updated HTML to include Text Label + Icon
DONATE_HTML = """
<!-- Custom Donate Button Injection -->
<div class="custom-donate-button-wrapper">
    <a href="https://p2p.onecause.com/srrn/donate" target="_blank" class="custom-donate-button" title="Donate Now">
        <span class="icon" aria-hidden="true">$</span>
        <span class="label">Donate Now</span>
    </a>
</div>
</body>
"""

def inject_donate_button():
    print("Re-injecting Donate Now button (with Text) into all HTML files...")
    html_files = glob.glob(os.path.join(REPO_PATH, "**/*.html"), recursive=True)
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove old injection if exists
        cleaned_content = content
        if 'class="custom-donate-button-wrapper"' in content:
            import re
            # Regex to remove the entire wrapper block we added previously
            cleaned_content = re.sub(r'<!-- Custom Donate Button Injection -->.*?</div>', '', content, flags=re.DOTALL)
            
        # Also remove if it was just the closing body tag replacement
        if cleaned_content != content:
             print(f"cleaned old injection from {file_path}")
        
        # Inject new content
        if "</body>" in cleaned_content:
            new_content = cleaned_content.replace("</body>", DONATE_HTML)
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            # print(f"Injected: {file_path}")
            
    print(f"Done. Updated {count} files with new Button HTML.")

if __name__ == "__main__":
    inject_donate_button()
