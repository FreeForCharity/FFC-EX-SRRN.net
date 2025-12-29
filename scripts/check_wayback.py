#!/usr/bin/env python3
"""
Check Wayback Machine for archived versions of srrn.net pages.
"""

import requests
import json
import sys

BASE_URL = "https://archive.org/wayback/available"

# Pages to check
PAGES = [
    "https://srrn.net/",
    "https://srrn.net/about-us/",
    "https://srrn.net/donate/",
    "https://srrn.net/aftercare/",
    "https://srrn.net/events/",
    "https://srrn.net/news/",
    "https://srrn.net/request-a-training/",
    "https://srrn.net/talk-today/",
    "https://srrn.net/training-calendar/",
    "https://srrn.net/training/",
    "https://srrn.net/trainings-offered/"
]

print("=" * 70)
print("Checking Wayback Machine for SRRN.net archives")
print("=" * 70)

for page in PAGES:
    try:
        response = requests.get(f"{BASE_URL}?url={page}", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("archived_snapshots") and data["archived_snapshots"].get("closest"):
                snapshot = data["archived_snapshots"]["closest"]
                print(f"\n✅ {page}")
                print(f"   Available: {snapshot.get('available', False)}")
                print(f"   URL: {snapshot.get('url', 'N/A')}")
                print(f"   Timestamp: {snapshot.get('timestamp', 'N/A')}")
            else:
                print(f"\n❌ {page} - No archive found")
        else:
            print(f"\n⚠ {page} - HTTP {response.status_code}")
    except Exception as e:
        print(f"\n❌ {page} - Error: {str(e)}")

print("\n" + "=" * 70)
