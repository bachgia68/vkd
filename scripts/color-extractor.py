#!/usr/bin/env python3
"""
Color Extractor — Extract dominant colors from images for brand consistency.
Output: Hex colors, RGB tuples for UI styling.

Usage:
  python color-extractor.py --input public/products/samk5/SK5-001.jpg --count 3
"""

import argparse
from PIL import Image
from collections import Counter
import sys

def get_dominant_colors(image_path, count=3, exclude_white=True):
    """Extract dominant colors from image."""
    try:
        img = Image.open(image_path).convert("RGB")
        pixels = list(img.getdata())

        if exclude_white:
            pixels = [p for p in pixels if not (p[0] > 240 and p[1] > 240 and p[2] > 240)]

        color_counts = Counter(pixels)
        dominant = color_counts.most_common(count)

        return [(rgb, f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}") for rgb, _ in dominant]
    except Exception as e:
        print(f"✗ {image_path}: {e}", file=sys.stderr)
        return []

def main():
    parser = argparse.ArgumentParser(description="Extract dominant colors from images")
    parser.add_argument("--input", required=True, help="Image file path")
    parser.add_argument("--count", type=int, default=3, help="Number of colors to extract")
    parser.add_argument("--exclude-white", action="store_true", default=True, help="Skip white pixels")

    args = parser.parse_args()
    colors = get_dominant_colors(args.input, args.count, args.exclude_white)

    for i, (rgb, hex_color) in enumerate(colors, 1):
        print(f"{i}. {hex_color} (RGB: {rgb})")

if __name__ == "__main__":
    main()
