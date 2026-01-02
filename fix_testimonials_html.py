
import os
import glob
from bs4 import BeautifulSoup

REPO_PATH = os.getcwd()

def fix_testimonials_html():
    print("Injecting missing portrait divs into testimonials...")
    html_files = glob.glob(os.path.join(REPO_PATH, "about-us/index.html")) # Target only About Us page first
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
        
        modified = False
        testimonials = soup.find_all("div", class_="et_pb_testimonial")
        
        for t in testimonials:
            # Check if portrait div exists
            portrait = t.find("div", class_="et_pb_testimonial_portrait")
            if not portrait:
                print("  Found testimonial without portrait. Injecting...")
                # Create generic portrait div
                new_portrait = soup.new_tag("div", **{"class": "et_pb_testimonial_portrait"})
                # Insert at beginning of testimonial container
                t.insert(0, new_portrait)
                modified = True
        
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(str(soup))
            count += 1
            print(f"Updated: {file_path}")
        else:
             print(f"No changes needed for: {file_path}")
            
    print(f"Done. Updated {count} files.")

if __name__ == "__main__":
    fix_testimonials_html()
