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
from scipy.ndimage import binary_dilation, label

PUBLIC_ROOT = "public"
PREMIUM_DIR = os.path.join(PUBLIC_ROOT, "products", "premium-bg")
LOGO_PATH = os.path.join(PUBLIC_ROOT, "assets/images/TA_logo_clean.png")
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SITE_URL = "tasamngoclinh.com"

# Toned down from the first pass — Joe's feedback was "hơi giả, không sang"
# (looks a bit fake, not premium). KGC-style product photography keeps
# white/cream as the dominant tone (docs/reports/2026-08-07-premium-
# positioning-brand-guidelines.md §"nguyên tắc phối màu") and uses brand
# color only as a soft accent, not a saturated wash — these stops stay much
# closer to neutral cream, with gold/green only as a faint warm edge tint.
# Luxury white — Apple/KGC product catalog style: bright center, cream/green tinted edge
VARIANTS = {
    "gold":  {"c": (255, 252, 245), "e": (232, 220, 198)},  # warm ivory edge
    "green": {"c": (250, 255, 250), "e": (210, 232, 215)},  # cool sage edge
}


def make_gradient_bg(size, stops):
    """Luxury white radial gradient: pure white center → warm/cool cream edge."""
    w, h = size
    cx, cy = w / 2.0, h / 2.0
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.clip(np.sqrt(((xx-cx)/(w*0.6))**2 + ((yy-cy)/(h*0.6))**2), 0, 1)
    bg = np.zeros((h, w, 3), dtype=np.float32)
    c, e = stops["c"], stops["e"]
    for i in range(3):
        bg[:,:,i] = c[i] + (e[i] - c[i]) * dist
    # Paper texture: barely visible
    noise = np.random.normal(0, 2.5, (h, w))
    for i in range(3):
        bg[:,:,i] = np.clip(bg[:,:,i] + noise, 0, 255)
    return Image.fromarray(bg.astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(1))


def cut_white_background(im, thresh=205):
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    minc = rgb.min(axis=2)
    whiteish = minc >= thresh

    # Border-flood-fill alone misses whiteish background trapped in narrow
    # gaps between thin structures (root hairs, leaf stems on loose herbal
    # material like hoa-sam-tuoi/cu-sam-tuoi) — those gaps aren't connected
    # to the image edge through other whiteish pixels, so they stayed as
    # visible flat-white patches once composited onto a colored background
    # (invisible before against near-white ivory, obvious now). Dilate first
    # to bridge small gaps for CONNECTIVITY purposes only, then intersect
    # back with the original mask so only genuinely whiteish pixels are ever
    # actually cut — this never eats into real product edges.
    bridged = binary_dilation(whiteish, iterations=4)
    labeled, _ = label(bridged)
    border_labels = set(labeled[0, :]) | set(labeled[-1, :]) | set(labeled[:, 0]) | set(labeled[:, -1])
    border_labels.discard(0)
    bg_mask = np.isin(labeled, list(border_labels)) & whiteish

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
    """Clean dark-style stamp: logo bottom-right + URL below — no white strip, KGC minimal."""
    im = im.convert("RGBA")
    w, h = im.size
    margin = int(w * 0.035)

    # Logo
    logo_w = int(w * 0.12)
    scale = logo_w / logo_cutout.width
    logo_h = int(logo_cutout.height * scale)
    logo_resized = logo_cutout.resize((logo_w, logo_h), Image.LANCZOS)

    # URL font
    font_size = max(11, int(w * 0.022))
    try:
        font = ImageFont.truetype(FONT_PATH, font_size)
    except Exception:
        font = ImageFont.load_default()

    draw = ImageDraw.Draw(im)
    b = draw.textbbox((0, 0), SITE_URL, font=font)
    url_w_px = b[2] - b[0]
    url_h_px = b[3] - b[1]
    gap = int(h * 0.008)

    # Total block height: url + gap + logo
    block_h = url_h_px + gap + logo_h
    # Anchor bottom-right, fully inside image
    lx = min(w - logo_w - margin, w - logo_w)
    block_top = max(margin, h - block_h - margin)
    ly = min(block_top + url_h_px + gap, h - logo_h)

    # Logo
    im.alpha_composite(logo_resized, (max(0, lx), max(0, ly)))

    # URL — right-aligned with logo, above it
    tx = lx + (logo_w - url_w_px) // 2  # center under logo
    tx = max(margin, min(tx, w - url_w_px - margin))
    ty = max(margin, block_top)
    # Shadow + white text on dark bg
    draw.text((tx + 1, ty + 1), SITE_URL, font=font, fill=(180, 170, 155, 120))
    draw.text((tx, ty), SITE_URL, font=font, fill=(14, 58, 34, 200))

    return im.convert("RGB")


def process_one(rel_path, variant_name, logo_cutout):
    src_path = os.path.join(PUBLIC_ROOT, "products", rel_path)
    out_path = os.path.join(PREMIUM_DIR, rel_path)
    im = Image.open(src_path)
    cutout = cut_white_background(im)
    bg = make_gradient_bg(im.size, VARIANTS[variant_name])  # color tuple
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
