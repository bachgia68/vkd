"""
Stamps a small, semi-transparent TA monogram in the bottom-right corner of
the homepage-carousel product photos (the same 12 SKUs `getFeaturedProducts`
picks — Joe asked to start there before doing the rest of the 90-SKU catalog).

Logo source (public/assets/images/TA_logo_clean.png) has a flat white
background, not alpha — reuses the same border-flood-fill cutout technique
as generate_premium_product_bg.py so only the background is removed, not
any white highlights inside the monogram itself.

Run: python scripts/add_logo_watermark.py
Overwrites the premium-bg files in place (products.ts already points at
these paths for the 12 SKUs — no code change needed).
"""
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import label

LOGO_PATH = "public/assets/images/TA_logo_clean.png"
LOGO_WIDTH_RATIO = 0.16  # logo width as a fraction of the product image width
MARGIN_RATIO = 0.04  # gap from the image edge, as a fraction of image width
LOGO_OPACITY = 0.82

# The 12 SKUs getFeaturedProducts() currently selects (verified via
# scripts/tmp-list-featured.mjs against src/data/products.ts before this
# script was written — regenerate that check if the featured set changes).
TARGET_IMAGES = [
    "public/products/premium-bg/trimico/11-hoa-sam-tuoi.png",
    "public/products/premium-bg/01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png",
    "public/products/premium-bg/02-cao-sam-ngoc-linh-mat-ong.png",
    "public/products/premium-bg/17-ruou-ngoc-de-thien-huong-750ml.png",
    "public/products/premium-bg/trimico/42-mat-ong-dang-rung-500ml.png",
    "public/products/premium-bg/29-bo-tre-hoa-combo-big-size.png",
    "public/products/premium-bg/04-giai-doc-gan-panaxx-naturis.png",
    "public/products/premium-bg/18-ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml.png",
    "public/products/premium-bg/19-ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml.png",
    "public/products/premium-bg/25-combo-2-chai-ruou-sam-ngoc-linh-19-5-do.png",
    "public/products/premium-bg/31-nuoc-tre-hoa-da-purely-refreshing.png",
    "public/products/premium-bg/trimico/02-tra-sam-ngoc-linh-thuong-hang.png",
]


def cut_white_background(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    minc = rgb.min(axis=2)
    whiteish = minc >= 235  # logo source is clean flat white, tighter than product photos
    labeled, _ = label(whiteish)
    border_labels = set(labeled[0, :]) | set(labeled[-1, :]) | set(labeled[:, 0]) | set(labeled[:, -1])
    border_labels.discard(0)
    bg_mask = np.isin(labeled, list(border_labels))
    alpha = arr[:, :, 3].astype(np.float32)
    alpha[bg_mask] = 0
    alpha_img = Image.fromarray(alpha.astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1))
    out = arr.copy()
    out[:, :, 3] = np.array(alpha_img)
    return Image.fromarray(out, "RGBA")


def load_logo_cutout() -> Image.Image:
    logo = Image.open(LOGO_PATH)
    return cut_white_background(logo)


def stamp(image_path: str, logo_cutout: Image.Image) -> None:
    im = Image.open(image_path).convert("RGBA")
    w, h = im.size
    logo_w = int(w * LOGO_WIDTH_RATIO)
    scale = logo_w / logo_cutout.width
    logo_h = int(logo_cutout.height * scale)
    logo_resized = logo_cutout.resize((logo_w, logo_h), Image.LANCZOS)

    alpha = logo_resized.split()[-1].point(lambda a: int(a * LOGO_OPACITY))
    logo_resized = Image.merge("RGBA", (*logo_resized.split()[:3], alpha))

    margin = int(w * MARGIN_RATIO)
    x = w - logo_w - margin
    y = h - logo_h - margin

    im.alpha_composite(logo_resized, (x, y))
    im.convert("RGB").save(image_path, quality=92)


def main():
    logo_cutout = load_logo_cutout()
    for rel_path in TARGET_IMAGES:
        if not os.path.exists(rel_path):
            print(f"SKIP (not found): {rel_path}")
            continue
        stamp(rel_path, logo_cutout)
        print(f"stamped: {rel_path}")
    print(f"\nDone: {len(TARGET_IMAGES)} images processed.")


if __name__ == "__main__":
    main()
