"""
Regenerates public/products/premium-bg/<...> in place for all 90 SKUs,
alternating between two brand-toned gradient backgrounds (gold-400-adjacent
and forest-900-adjacent, both from docs/DESIGN_SYSTEM.md tokens) instead of
the single neutral ivory used previously, and stamps the TA logo + site URL
in the bottom-right corner of every image (previously only done for the 12
homepage-carousel SKUs via add_logo_watermark.py).

Reads the existing file list straight from public/products/premium-bg/ (the
90 files already there are the definitive list — mirrors public/products/
for the same relative path, which is the untouched original source).

Run: python scripts/batch_premium_bg_alternate.py
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy.ndimage import label

PUBLIC_ROOT = "public"
PREMIUM_DIR = os.path.join(PUBLIC_ROOT, "products", "premium-bg")
LOGO_PATH = os.path.join(PUBLIC_ROOT, "assets/images/TA_logo_clean.png")
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SITE_URL = "tasamngoclinh.com"

VARIANTS = {
    "gold": {
        "center": (250, 245, 228),
        "mid": (234, 213, 160),
        "edge": (196, 160, 70),
    },
    "green": {
        "center": (244, 247, 240),
        "mid": (193, 209, 191),
        "edge": (63, 92, 68),
    },
}


def make_gradient_bg(size, stops):
    w, h = size
    cx, cy = w / 2, h * 0.42
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.sqrt(((xx - cx) / (w * 0.75)) ** 2 + ((yy - cy) / (h * 0.75)) ** 2)
    dist = np.clip(dist, 0, 1)
    bg = np.zeros((h, w, 3), dtype=np.float32)
    for i in range(3):
        stop1, stop2, stop3 = stops["center"][i], stops["mid"][i], stops["edge"][i]
        t = dist
        near = t < 0.55
        val_near = stop1 + (stop2 - stop1) * (t / 0.55)
        t2 = np.clip((t - 0.55) / 0.45, 0, 1)
        val_far = stop2 + (stop3 - stop2) * t2
        bg[:, :, i] = np.where(near, val_near, val_far)
    return Image.fromarray(bg.astype(np.uint8), "RGB")


def cut_white_background(im, thresh=205):
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    minc = rgb.min(axis=2)
    whiteish = minc >= thresh
    labeled, _ = label(whiteish)
    border_labels = set(labeled[0, :]) | set(labeled[-1, :]) | set(labeled[:, 0]) | set(labeled[:, -1])
    border_labels.discard(0)
    bg_mask = np.isin(labeled, list(border_labels))
    alpha = arr[:, :, 3].astype(np.float32)
    alpha[bg_mask] = 0
    alpha_img = Image.fromarray(alpha.astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(1.5))
    out = arr.copy()
    out[:, :, 3] = np.array(alpha_img)
    return Image.fromarray(out, "RGBA")


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
        [cx - shadow_w / 2, y1 - shadow_h / 2, cx + shadow_w / 2, y1 + shadow_h / 2],
        fill=(11, 47, 29, 70),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(shadow_w * 0.06))
    canvas = bg.convert("RGBA")
    canvas = Image.alpha_composite(canvas, shadow_layer)
    canvas = Image.alpha_composite(canvas, cutout)
    return canvas


def load_logo_cutout():
    logo = Image.open(LOGO_PATH)
    return cut_white_background(logo, thresh=235)


def stamp_logo_and_url(im, logo_cutout):
    im = im.convert("RGBA")
    w, h = im.size
    logo_w = int(w * 0.16)
    scale = logo_w / logo_cutout.width
    logo_h = int(logo_cutout.height * scale)
    logo_resized = logo_cutout.resize((logo_w, logo_h), Image.LANCZOS)
    alpha = logo_resized.split()[-1].point(lambda a: int(a * 0.85))
    logo_resized = Image.merge("RGBA", (*logo_resized.split()[:3], alpha))
    margin = int(w * 0.04)
    x = w - logo_w - margin
    y = h - logo_h - margin
    im.alpha_composite(logo_resized, (x, y))

    draw = ImageDraw.Draw(im)
    font_size = max(14, int(w * 0.032))
    font = ImageFont.truetype(FONT_PATH, font_size)
    bbox = draw.textbbox((0, 0), SITE_URL, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    tx = w - text_w - margin
    ty = y - text_h - int(h * 0.012)
    draw.text((tx + 1, ty + 1), SITE_URL, font=font, fill=(0, 0, 0, 110))
    draw.text((tx, ty), SITE_URL, font=font, fill=(255, 255, 255, 235))
    return im.convert("RGB")


def process_one(rel_path, variant_name, logo_cutout):
    src_path = os.path.join(PUBLIC_ROOT, "products", rel_path)
    out_path = os.path.join(PREMIUM_DIR, rel_path)
    im = Image.open(src_path)
    cutout = cut_white_background(im)
    bg = make_gradient_bg(im.size, VARIANTS[variant_name])
    composited = composite_with_shadow(cutout, bg).convert("RGB")
    stamped = stamp_logo_and_url(composited, logo_cutout)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    stamped.save(out_path, quality=92)


def main():
    rel_paths = []
    for root, _dirs, files in os.walk(PREMIUM_DIR):
        for fn in files:
            full = os.path.join(root, fn)
            rel_paths.append(os.path.relpath(full, PREMIUM_DIR))
    rel_paths.sort()

    logo_cutout = load_logo_cutout()
    counts = {"gold": 0, "green": 0}
    for i, rel_path in enumerate(rel_paths):
        variant_name = "gold" if i % 2 == 0 else "green"
        process_one(rel_path, variant_name, logo_cutout)
        counts[variant_name] += 1
        print(f"[{variant_name:5s}] {rel_path}")

    print(f"\nDone: {len(rel_paths)} images ({counts['gold']} gold, {counts['green']} green).")


if __name__ == "__main__":
    main()
