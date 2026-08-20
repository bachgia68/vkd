#!/usr/bin/env python3
"""
Image Optimizer — Convert images to modern formats (WebP, AVIF) with compression.
Reduces file size by 30-50% while maintaining visual quality.

Usage:
  python image-optimizer.py --input public/products/ --format webp --quality 80
"""

import argparse
import os
from pathlib import Path
from PIL import Image
import sys

def optimize_image(input_path, output_path, format_type="webp", quality=80):
    """Convert image to optimized format."""
    try:
        img = Image.open(input_path)
        if img.mode in ("RGBA", "LA"):
            img = img.convert("RGB")

        img.save(output_path, format=format_type.upper(), quality=quality, optimize=True)
        input_size = os.path.getsize(input_path)
        output_size = os.path.getsize(output_path)
        savings = 100 * (1 - output_size / input_size)

        print(f"✓ {input_path} → {output_path} (-{savings:.1f}%)")
        return True
    except Exception as e:
        print(f"✗ {input_path}: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Optimize images to modern formats")
    parser.add_argument("--input", required=True, help="Input directory or file")
    parser.add_argument("--format", default="webp", choices=["webp", "avif", "jpg"], help="Output format")
    parser.add_argument("--quality", type=int, default=80, help="Quality (1-100)")
    parser.add_argument("--recursive", action="store_true", help="Recursive search")

    args = parser.parse_args()
    input_path = Path(args.input)

    if input_path.is_file():
        output_path = input_path.with_suffix(f".{args.format}")
        optimize_image(input_path, output_path, args.format, args.quality)
    else:
        pattern = f"**/*.jpg" if args.recursive else "*.jpg"
        for img_path in input_path.glob(pattern):
            output_path = img_path.with_suffix(f".{args.format}")
            optimize_image(img_path, output_path, args.format, args.quality)

if __name__ == "__main__":
    main()
