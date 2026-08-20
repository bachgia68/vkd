#!/usr/bin/env python3
"""
Poster Generator — Create product/combo posters with premium styling.
Composite multiple product images, add text, pricing, brand elements.

Usage:
  python poster-generator.py --type combo --products SK5-001,SK5-002 --title "Dưỡng Nhan Sâm Yến" --price 899000 --output poster.png
"""

import argparse
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import sys

def create_combo_poster(products, title, price, output_path):
    """Create combo poster from product images and text."""
    try:
        # Base poster: 800x600 gradient ivory→gold
        poster = Image.new("RGB", (800, 600), color=(240, 235, 220))

        # Add product images (layout: 2x2 or 3x1 grid)
        img_size = 120
        for idx, product in enumerate(products):
            try:
                product_img = Image.open(product).convert("RGB")
                product_img.thumbnail((img_size, img_size), Image.Resampling.LANCZOS)
                x = 100 + (idx % 2) * 200
                y = 250 + (idx // 2) * 150
                poster.paste(product_img, (x, y))
            except:
                pass

        # Add text layers
        draw = ImageDraw.Draw(poster)

        # Title (bold, large)
        try:
            font_large = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 36)
            draw.text((50, 50), title, fill=(80, 40, 20), font=font_large)
        except:
            draw.text((50, 50), title, fill=(80, 40, 20))

        # Price (gold accent)
        price_text = f"{price:,}đ"
        try:
            font_price = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 28)
            draw.text((50, 150), price_text, fill=(184, 134, 11), font=font_price)
        except:
            draw.text((50, 150), price_text, fill=(184, 134, 11))

        # Brand tagline (small, elegant)
        try:
            font_small = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 14)
            draw.text((50, 550), "Vườn Sâm Ngọc Linh nhà Khánh", fill=(100, 50, 20), font=font_small)
        except:
            draw.text((50, 550), "Vườn Sâm Ngọc Linh nhà Khánh", fill=(100, 50, 20))

        poster.save(output_path)
        print(f"✓ Poster created: {output_path}")
        return True
    except Exception as e:
        print(f"✗ {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Generate product/combo posters")
    parser.add_argument("--type", default="combo", choices=["combo", "single", "promo"], help="Poster type")
    parser.add_argument("--products", required=True, help="Product IDs or image paths (comma-separated)")
    parser.add_argument("--title", required=True, help="Poster title")
    parser.add_argument("--price", type=int, required=True, help="Price in VND")
    parser.add_argument("--output", default="poster.png", help="Output PNG file")

    args = parser.parse_args()
    products = [p.strip() for p in args.products.split(",")]
    create_combo_poster(products, args.title, args.price, args.output)

if __name__ == "__main__":
    main()
