import json

try:
    # Use utf-8-sig to handle BOM if present, otherwise utf-16le if that was the original issue
    # PowerShell redirection often creates UTF-16LE, but let's try a robust read or fallback
    encodings = ['utf-16le', 'utf-8-sig', 'utf-8']
    
    comments = None
    for enc in encodings:
        try:
            with open('all_code_comments.json', 'r', encoding=enc) as f:
                comments = json.load(f)
            break
        except Exception:
            continue
            
    if comments is None:
        print("Failed to read all_code_comments.json with any encoding.")
    else:
        print(f"Found {len(comments)} code comments.")
        for c in comments:
            print(f"Comment_ID: {c['id']}, Body: {c['body'][:50]}...")

    reviews = None
    for enc in encodings:
        try:
            with open('all_reviews.json', 'r', encoding=enc) as f:
                reviews = json.load(f)
            break
        except Exception:
            continue
            
    if reviews is None:
        print("Failed to read all_reviews.json with any encoding.")
    else:
        print(f"Found {len(reviews)} reviews.")
        for r in reviews:
            print(f"Review_ID: {r['id']}, Body: {r['body'][:50]}...")

except Exception as e:
    print(f"Error: {e}")
