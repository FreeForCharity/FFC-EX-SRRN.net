
import requests

urls = [
    "https://srrn.net/Michael-Webster-640x360-1.mp4",
    "https://srrn.net/wp-content/uploads/Michael-Webster-640x360-1.mp4",
    "https://srrn.net/wp-content/uploads/2021/09/Michael-Webster-640x360-1.mp4"
]

print("Checking video URLs...")
for url in urls:
    try:
        r = requests.head(url, allow_redirects=True, timeout=5)
        print(f"{url}: {r.status_code}")
    except Exception as e:
        print(f"{url}: Error {e}")
