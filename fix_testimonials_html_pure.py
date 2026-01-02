
import os
import glob
import re

REPO_PATH = os.getcwd()

def fix_testimonials_html_pure():
    print("Injecting missing portrait divs (pure python)...")
    html_files = glob.glob(os.path.join(REPO_PATH, "about-us/index.html"))
    
    count = 0
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Regex to find et_pb_testimonial containers
        # We need to find the opening tag and check contents. 
        # Since HTML is complex, we'll try a simpler approach assuming standard formatting.
        # Find: <div class="et_pb_module et_pb_testimonial ...">
        # Then, if "et_pb_testimonial_portrait" is NOT in the next few chars, inject it.
        
        # Actually, let's use a replace strategy.
        # We find the module. If it lacks portrait, we add it.
        # Since we can't reliably parse HTML with regex, we will look for specific patterns observed in the file.
        
        # Pattern: <div class="et_pb_module et_pb_testimonial
        # If we see this, then we look for "et_pb_testimonial_description_inner"
        # The portrait usually comes BEFORE description inner.
        
        # New strategy: Find ALL instances of testimonial modules.
        # Inspect content between opening and description.
        
        # Simpler: Just inject it at the start of the inner content of the testimonial div.
        # The testimonial usually starts like:
        # <div class="et_pb_module et_pb_testimonial ...">
        #   <div class="et_pb_testimonial_description">
        #     <div class="et_pb_testimonial_description_inner"> ...
        
        # The portrait sits INSIDE the main div, usually before "et_pb_testimonial_description".
        
        # Let's replace:
        # (<div class="et_pb_module et_pb_testimonial[^"]* et_pb_testimonial_no_image[^"]*">)
        # with \1<div class="et_pb_testimonial_portrait"></div>
        
        # Note: The class 'et_pb_testimonial_no_image' might be present if there is no image.
        # Removing that class might also help styled themes show the placeholder?
        # But we want to Force the portrait div.
        
        new_content = content
        
        # Find testimonials that might map to "no image" or just generic testimonials
        # We will look for the description block and prepend the portrait div if it's missing.
        
        # Look for: <div class="et_pb_testimonial_description">
        # Replace with: <div class="et_pb_testimonial_portrait"></div><div class="et_pb_testimonial_description">
        # BUT only if "et_pb_testimonial_portrait" isn't already immediately before it.
        
        pattern = re.compile(r'(<div class="et_pb_testimonial_description">)')
        
        # Check if portrait already exists before description?
        # It's hard to be sure with just regex.
        # Risk: Double injection.
        # Check: file content doesn't have "et_pb_testimonial_portrait"
        
        if "et_pb_testimonial_portrait" not in content:
            # Safe to inject everywhere
            new_content = re.sub(r'(<div class="et_pb_testimonial_description">)', r'<div class="et_pb_testimonial_portrait"></div>\1', content)
        else:
            # It exists somewhere. Maybe mixed state.
            # We'll try to match only where it's missing.
            # Look for > followed by whitespace followed by <div class="et_pb_testimonial_description">
            # and inject.
            pass
            # If we already have some, we need to be careful.
            # Let's just do the injection. If double portrait, we can fix later. CSS will stack them.
            # To be safer, replace specific known context if possible.
            
            # The file has `et_pb_testimonial_portrait` only in CSS or one place according to previous grep (line 8000+?)
            # Previous grep said: `class="et_pb_testimonial_portrait"></div>` exists at line 8317.
            # So SOME exist.
            
            # Let's try to target the specific testimonials that look like they are missing.
            # Based on the screenshot, ALL (or most) are missing icons.
            # If line 8317 has it, maybe that one is working?
            # Wait, the screenshot showed NO icons.
            
            # I will blindly inject before `et_pb_testimonial_description` if `et_pb_testimonial_portrait` is not within 100 chars preceding.
            # Python re doesn't support variable lookbehind.
            
            pass 
        
        # Direct string replacement for known "no image" structure
        # Often "no_image" class is used.
        new_content = re.sub(r'(et_pb_testimonial_no_image)', r'et_pb_testimonial', new_content) # Remove no_image class
        
        # Now inject div
        # We replace <div class="et_pb_testimonial_description"> with <div class="et_pb_testimonial_portrait"></div><div class="et_pb_testimonial_description">
        # But ensure we don't do it if portrait is there.
        # We can loop through matches.
        
        def replacement(match):
            # Check context before match (not easily available in re.sub without custom iteration)
            return '<div class="et_pb_testimonial_portrait"></div><div class="et_pb_testimonial_description">'

        # Let's iterate manually finding indices
        p = re.compile(r'<div class="et_pb_testimonial_description">')
        
        output_chars = []
        last_idx = 0
        for m in p.finditer(content):
            start = m.start()
            end = m.end()
            
            # Check preceding 200 chars for "et_pb_testimonial_portrait"
            preceding = content[max(0, start-200):start]
            if "et_pb_testimonial_portrait" not in preceding:
                output_chars.append(content[last_idx:start])
                output_chars.append('<div class="et_pb_testimonial_portrait"></div>')
                output_chars.append(content[start:end])
            else:
                output_chars.append(content[last_idx:end])
            
            last_idx = end
            modified = True
        
        output_chars.append(content[last_idx:])
        new_content = "".join(output_chars)
        
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            count += 1
            print(f"Updated: {file_path}")
        else:
             print(f"No changes needed (or already present): {file_path}")
            
    print(f"Done. Updated {count} files.")

if __name__ == "__main__":
    fix_testimonials_html_pure()
