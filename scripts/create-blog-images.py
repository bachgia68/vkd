#!/usr/bin/env python3
"""
Create sample blog post images with premium styling.
Output: High-quality images for blog posts (2-3 per post).

Usage:
  python create-blog-images.py --blog-title "Sâm Ngọc Linh" --count 3 --output public/blog-images/
"""

import argparse
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import os

def create_blog_image(index, blog_title, output_dir, width=1200, height=630):
    """Create single blog post image (for social share / hero)."""
    try:
        # Base: Gradient ivory → gold
        img = Image.new("RGB", (width, height), color=(240, 235, 220))
        draw = ImageDraw.Draw(img)

        # Gradient overlay (darker towards bottom)
        for y in range(height):
            intensity = int(255 * (0.95 - (y / height) * 0.3))
            color = (intensity, int(intensity * 0.95), int(intensity * 0.85))
            draw.line([(0, y), (width, y)], fill=color)

        # Title text (large, bold)
        try:
            font_large = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 48)
            draw.text((60, 100), blog_title, fill=(80, 40, 20), font=font_large)
        except:
            draw.text((60, 100), blog_title, fill=(80, 40, 20))

        # Section label based on image index
        sections = ["Giới Thiệu", "Công Dụng", "Hướng Dẫn Sử Dụng"]
        section = sections[index % len(sections)] if index < len(sections) else f"Phần {index + 1}"

        try:
            font_section = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 28)
            draw.text((60, 250), f"📖 {section}", fill=(184, 134, 11), font=font_section)
        except:
            draw.text((60, 250), f"📖 {section}", fill=(184, 134, 11))

        # Tagline
        try:
            font_small = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 16)
            draw.text((60, 550), "Vườn Sâm Ngọc Linh nhà Khánh | Khám Phục Thần Dược Tự Nhiên",
                     fill=(100, 50, 20), font=font_small)
        except:
            draw.text((60, 550), "Vườn Sâm Ngọc Linh nhà Khánh",
                     fill=(100, 50, 20))

        # Decorative elements (circles)
        circle_color = (212, 175, 55)  # Gold
        draw.ellipse([(width - 150, 50), (width - 50, 150)], outline=circle_color, width=3)
        draw.ellipse([(50, height - 100), (150, height)], outline=circle_color, width=3)

        # Save
        Path(output_dir).mkdir(parents=True, exist_ok=True)
        output_path = os.path.join(output_dir, f"blog-{index + 1}.png")
        img.save(output_path)
        print(f"✓ Created: {output_path}")
        return output_path
    except Exception as e:
        print(f"✗ Error creating image: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Create blog post images")
    parser.add_argument("--blog-title", default="Sâm Ngọc Linh", help="Blog title")
    parser.add_argument("--count", type=int, default=3, help="Number of images to create")
    parser.add_argument("--output", default="public/blog-images/", help="Output directory")

    args = parser.parse_args()

    print(f"Creating {args.count} images for '{args.blog_title}'...")
    for i in range(args.count):
        create_blog_image(i, args.blog_title, args.output)

    print(f"\n✓ Created {args.count} blog images in {args.output}")
    print("\nNext: Run image-optimizer to compress:")
    print(f"  python image-optimizer.py --input {args.output} --format webp --quality 85 --recursive")

if __name__ == "__main__":
    main()
