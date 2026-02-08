#!/usr/bin/env python3
"""
Generate missing responsive image sizes for partner/sponsor logos.
This script creates scaled-down versions of images referenced in srcset attributes.
"""

from PIL import Image
import os
import sys

# Image configurations: (source_path, [(output_path, width, height), ...])
IMAGE_CONFIGS = [
    # Talk Today 2026
    (
        "./assets/uploads/2025/12/Talk-Today-2026.png",
        [
            ("./assets/uploads/2025/12/Talk-Today-2026-1280x994.png", 1280, 994),
            ("./assets/uploads/2025/12/Talk-Today-2026-980x761.png", 980, 761),
            ("./assets/uploads/2025/12/Talk-Today-2026-480x373.png", 480, 373),
        ]
    ),
    # SCMS Logo
    (
        "./assets/uploads/2022/12/SCMS-logo-COLOR-with-transparent-background-from-Lori-10-14-19.png",
        [
            ("./assets/uploads/2022/12/SCMS-logo-COLOR-with-transparent-background-from-Lori-10-14-19-1280x481.png", 1280, 481),
            ("./assets/uploads/2022/12/SCMS-logo-COLOR-with-transparent-background-from-Lori-10-14-19-980x368.png", 980, 368),
            ("./assets/uploads/2022/12/SCMS-logo-COLOR-with-transparent-background-from-Lori-10-14-19-480x180.png", 480, 180),
        ]
    ),
    # Health Fund
    (
        "./assets/uploads/2025/01/Health-Fund_FULL-COLOR-2-e1736358192821.png",
        [
            ("./assets/uploads/2025/01/Health-Fund_FULL-COLOR-2-e1736358192821-980x308.png", 980, 308),
            ("./assets/uploads/2025/01/Health-Fund_FULL-COLOR-2-e1736358192821-480x270.png", 480, 270),
        ]
    ),
    # CMU
    (
        "./assets/uploads/2021/03/Central-Michigan-University-Secondary-Application.jpg",
        [
            ("./assets/uploads/2021/03/Central-Michigan-University-Secondary-Application-150x150.jpg", 150, 150),
            ("./assets/uploads/2021/03/Central-Michigan-University-Secondary-Application-120x120.jpg", 120, 120),
        ]
    ),
    # Children's Grief Center
    (
        "./assets/uploads/2022/08/Childrens-Grief-Center-logo-square.jpg",
        [
            ("./assets/uploads/2022/08/Childrens-Grief-Center-logo-square-480x480.jpg", 480, 480),
        ]
    ),
    # AIHFS
    (
        "./assets/uploads/2022/03/AIHFS.png",
        [
            ("./assets/uploads/2022/03/AIHFS-480x233.png", 480, 233),
        ]
    ),
]

def generate_responsive_image(source_path, output_path, target_width, target_height):
    """
    Generate a responsive version of an image with the specified dimensions.
    Maintains aspect ratio and uses high-quality resampling.
    """
    try:
        # Open the source image
        with Image.open(source_path) as img:
            # Calculate aspect ratios
            source_ratio = img.width / img.height
            target_ratio = target_width / target_height
            
            # Resize maintaining aspect ratio, then crop if needed
            if abs(source_ratio - target_ratio) < 0.01:
                # Aspect ratios are similar, just resize
                resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            else:
                # Different aspect ratios, resize and crop
                if source_ratio > target_ratio:
                    # Source is wider, fit to height
                    new_width = int(target_height * source_ratio)
                    resized = img.resize((new_width, target_height), Image.Resampling.LANCZOS)
                    # Center crop
                    left = (new_width - target_width) // 2
                    resized = resized.crop((left, 0, left + target_width, target_height))
                else:
                    # Source is taller, fit to width
                    new_height = int(target_width / source_ratio)
                    resized = img.resize((target_width, new_height), Image.Resampling.LANCZOS)
                    # Center crop
                    top = (new_height - target_height) // 2
                    resized = resized.crop((0, top, target_width, top + target_height))
            
            # Save with appropriate quality
            if output_path.endswith('.jpg') or output_path.endswith('.jpeg'):
                resized.save(output_path, 'JPEG', quality=90, optimize=True)
            else:
                resized.save(output_path, 'PNG', optimize=True)
            
            print(f"✓ Generated: {output_path} ({target_width}x{target_height})")
            return True
            
    except Exception as e:
        print(f"✗ Error generating {output_path}: {e}")
        return False

def main():
    """Generate all missing responsive images."""
    print("🖼️  Generating missing responsive images for partner/sponsor logos...")
    print()
    
    total_generated = 0
    total_errors = 0
    
    for source_path, outputs in IMAGE_CONFIGS:
        # Check if source exists
        if not os.path.exists(source_path):
            print(f"⚠️  Warning: Source image not found: {source_path}")
            continue
        
        print(f"Processing: {os.path.basename(source_path)}")
        
        for output_path, width, height in outputs:
            # Skip if already exists
            if os.path.exists(output_path):
                print(f"  ⏭️  Skipped (already exists): {os.path.basename(output_path)}")
                continue
            
            # Generate the responsive image
            if generate_responsive_image(source_path, output_path, width, height):
                total_generated += 1
            else:
                total_errors += 1
        
        print()
    
    # Summary
    print("=" * 60)
    print(f"✅ Successfully generated: {total_generated} images")
    if total_errors > 0:
        print(f"❌ Errors: {total_errors} images")
        return 1
    else:
        print("🎉 All responsive images generated successfully!")
        return 0

if __name__ == "__main__":
    sys.exit(main())
