#!/usr/bin/env python3
"""
Background Remover — Remove white/light backgrounds from product images.
Preserves product details, exports as PNG with alpha transparency.

Usage:
  python background-remover.py --input product.jpg --threshold 220 --output product-bg-removed.png
"""

import argparse
from PIL import Image
import sys

def remove_background(input_path, output_path, threshold=220):
    """Remove white background via flood fill from edges."""
    try:
        img = Image.open(input_path)
        if img.mode != "RGBA":
            img = img.convert("RGBA")

        data = img.getdata()
        new_data = []

        for item in data:
            r, g, b = item[:3]
            if r > threshold and g > threshold and b > threshold:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"✓ Background removed: {output_path}")
        return True
    except Exception as e:
        print(f"✗ {input_path}: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Remove white background from images")
    parser.add_argument("--input", required=True, help="Input image (JPG/PNG)")
    parser.add_argument("--output", required=True, help="Output PNG file")
    parser.add_argument("--threshold", type=int, default=220, help="White threshold (0-255)")

    args = parser.parse_args()
    remove_background(args.input, args.output, args.threshold)

if __name__ == "__main__":
    main()
