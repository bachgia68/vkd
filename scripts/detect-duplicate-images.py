#!/usr/bin/env python3
"""
Duplicate Image Detector — Find visually similar images in a directory.
Uses perceptual hashing (pHash) to detect near-duplicates.

Usage:
  python detect-duplicate-images.py --input public/products/ --threshold 90
"""

import argparse
from PIL import Image
from pathlib import Path
import imagehash
import sys

def get_image_hash(image_path):
    """Compute perceptual hash of image."""
    try:
        img = Image.open(image_path)
        return imagehash.phash(img)
    except Exception as e:
        print(f"⚠ {image_path}: {e}", file=sys.stderr)
        return None

def find_duplicates(directory, threshold=90):
    """Find visually similar images above threshold."""
    images = list(Path(directory).rglob("*.jpg")) + list(Path(directory).rglob("*.png"))
    hashes = {}

    for img_path in images:
        h = get_image_hash(img_path)
        if h:
            hashes[str(img_path)] = h

    duplicates = []
    for i, (path1, hash1) in enumerate(hashes.items()):
        for path2, hash2 in list(hashes.items())[i+1:]:
            distance = hash1 - hash2
            similarity = 100 * (1 - distance / 64)
            if similarity >= threshold:
                duplicates.append((path1, path2, similarity))
                print(f"⚠ {similarity:.1f}% similar:\n  {path1}\n  {path2}")

    return duplicates

def main():
    parser = argparse.ArgumentParser(description="Find duplicate/similar images")
    parser.add_argument("--input", required=True, help="Directory to scan")
    parser.add_argument("--threshold", type=int, default=90, help="Similarity threshold (0-100)")

    args = parser.parse_args()
    duplicates = find_duplicates(args.input, args.threshold)
    print(f"\nFound {len(duplicates)} duplicate pairs")

if __name__ == "__main__":
    main()
