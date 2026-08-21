"""
Regenerate product images using rembg (U2Net AI) for clean bg removal
instead of threshold flood-fill. Then composite onto luxury cream/sage
gradient. Run single file for test, or all 90 SKUs.

Usage:
  python scripts/rembg_product_shot.py --file 01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png
  python scripts/rembg_product_shot.py   # all 90
"""
import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from rembg import remove

PUBLIC_ROOT = Path("public")
SRC_DIR = PUBLIC_ROOT / "products"
OUT_DIR = PUBLIC_ROOT / "products" / "premium-bg"
LOGO_PATH = PUBLIC_ROOT / "assets/images/TA_logo_clean.png"
SITE_URL = "tasamngoclinh.com"

VARIANTS = {
    "gold":  {"c": (255, 252, 245), "e": (232, 220, 198)},
    "green": {"c": (250, 255, 250), "e": (210, 232, 215)},
}


def make_gradient_bg(size, stops):
    w, h = size
    cx, cy = w / 2.0, h / 2.0
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.clip(np.sqrt(((xx-cx)/(w*0.6))**2 + ((yy-cy)/(h*0.6))**2), 0, 1)
    bg = np.zeros((h, w, 3), dtype=np.float32)
    c, e = stops["c"], stops["e"]
    for i in range(3):
        bg[:,:,i] = c[i] + (e[i] - c[i]) * dist
    noise = np.random.normal(0, 2.5, (h, w))
    for i in range(3):
        bg[:,:,i] = np.clip(bg[:,:,i] + noise, 0, 255)
    return Image.fromarray(bg.astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(1))


def load_logo_cutout():
    logo_raw = Image.open(LOGO_PATH)
    return remove(logo_raw)


def composite_with_shadow(cutout, bg):
    alpha = np.array(cutout.split()[-1])
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    if not rows.any():
        return Image.alpha_composite(bg.convert("RGBA"), cutout)
    y0, y1 = np.where(rows)[0][[0, -1]]
    x0, x1 = np.where(cols)[0][[0, -1]]
    cx = float(x0 + x1) / 2
    shadow_w = float(x1 - x0) * 0.55
    shadow_h = shadow_w * 0.16
    shadow_layer = Image.new("RGBA", bg.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow_layer)
    sd.ellipse(
        [cx - shadow_w/2, y1 - shadow_h/2, cx + shadow_w/2, y1 + shadow_h/2],
        fill=(11, 47, 29, 70),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(shadow_w * 0.06))
    canvas = bg.convert("RGBA")
    canvas = Image.alpha_composite(canvas, shadow_layer)
    return Image.alpha_composite(canvas, cutout)


def stamp_logo_and_url(im, logo_cutout):
    im = im.convert("RGBA")
    w, h = im.size
    margin = int(w * 0.035)
    logo_w = int(w * 0.12)
    scale = logo_w / logo_cutout.width
    logo_h = int(logo_cutout.height * scale)
    logo_resized = logo_cutout.resize((logo_w, logo_h), Image.LANCZOS)
    font_size = max(11, int(w * 0.022))
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()
    draw = ImageDraw.Draw(im)
    b = draw.textbbox((0, 0), SITE_URL, font=font)
    url_w_px, url_h_px = b[2]-b[0], b[3]-b[1]
    gap = int(h * 0.008)
    block_h = url_h_px + gap + logo_h
    lx = min(w - logo_w - margin, w - logo_w)
    block_top = max(margin, h - block_h - margin)
    ly = min(block_top + url_h_px + gap, h - logo_h)
    im.alpha_composite(logo_resized, (max(0, lx), max(0, ly)))
    tx = lx + (logo_w - url_w_px) // 2
    tx = max(margin, min(tx, w - url_w_px - margin))
    ty = max(margin, block_top)
    draw.text((tx+1, ty+1), SITE_URL, font=font, fill=(180, 170, 155, 120))
    draw.text((tx, ty), SITE_URL, font=font, fill=(14, 58, 34, 200))
    return im.convert("RGB")


def process_one(rel_path, variant_name, logo_cutout):
    src = SRC_DIR / rel_path
    out = OUT_DIR / rel_path
    im = Image.open(src)
    # rembg AI removal — handles complex shapes, thin roots, gaps
    cutout = remove(im)
    bg = make_gradient_bg(im.size, VARIANTS[variant_name])
    composited = composite_with_shadow(cutout, bg).convert("RGB")
    stamped = stamp_logo_and_url(composited, logo_cutout)
    out.parent.mkdir(parents=True, exist_ok=True)
    stamped.save(out, quality=92)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", help="Filename under public/products/ (just the filename, not subdir)")
    args = parser.parse_args()

    if args.file:
        files = [Path(args.file)]
    else:
        files = sorted(
            p.relative_to(SRC_DIR)
            for p in SRC_DIR.rglob("*")
            if p.suffix.lower() in (".jpg", ".png")
            and "premium-bg" not in p.parts
        )

    print(f"Processing {len(files)} file(s) with rembg AI ...\n")
    logo_cutout = load_logo_cutout()

    for i, rel in enumerate(files):
        variant_name = "gold" if i % 2 == 0 else "green"
        try:
            process_one(rel, variant_name, logo_cutout)
            print(f"[{variant_name:5s}] OK {rel}")
        except Exception as e:
            print(f"       FAIL {rel}: {e}")

    print(f"\nDone: {len(files)} file(s).")


if __name__ == "__main__":
    main()
