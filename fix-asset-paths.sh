#!/bin/bash

# Fix asset paths by creating copies without version numbers in filenames
# This handles files that were scraped with version numbers embedded in filenames

echo "Fixing asset paths..."

# Find all JS and CSS files with _ver= in the filename
find . -type f \( -name "*_ver=*.js" -o -name "*_ver=*.css" \) | while read -r file; do
    # Get the directory
    dir=$(dirname "$file")
    
    # Get the filename
    filename=$(basename "$file")
    
    # Remove the version suffix to get the original filename
    # e.g., "jquery.min_ver=3.7.1.js" -> "jquery.min.js"
    original_name=$(echo "$filename" | sed 's/_ver=.*\././')
    
    # Create the target path
    target="$dir/$original_name"
    
    # Only create copy if it doesn't exist
    if [ ! -f "$target" ]; then
        echo "Creating: $target"
        cp "$file" "$target"
    fi
done

echo "Done! Asset paths fixed."
