
import os
import glob

REPO_PATH = os.getcwd()

def fix_testimonials_classes():
    print("Removing suppression classes from testimonials...")
    html_files = glob.glob(os.path.join(REPO_PATH, "about-us/index.html"))
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove "et_pb_testimonial_no_image"
        new_content = content.replace("et_pb_testimonial_no_image", "")
        # Remove "et_pb_icon_off"
        new_content = new_content.replace("et_pb_icon_off", "")
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {file_path}")
        else:
             print(f"No changes needed: {file_path}")
            
    print(f"Done. Updated {count} files.")

if __name__ == "__main__":
    fix_testimonials_classes()
