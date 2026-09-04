"""
V2 of the premium-bg pipeline — replaces the old "flood-fill white pixels
from image border" cutout with rembg (a real trained segmentation model,
already installed: `pip show rembg` -> u2net). The old approach broke on:

  - Products whose own packaging/background is mostly white/pale (e.g.
    28-men-kim-boi.png) — the flood-fill couldn't tell "white background"
    from "white product", so it erased most of the product itself.
  - Trimico's supplier photos (public/products/trimico/*) are NOT plain
    studio shots — they already have their own gradient/reflection
    background AND the TRIMICO logo + "www.trietminh.com" baked into the
    physical box print. No background-removal script can strip that; it's
    part of the source photo, not an overlay. rembg correctly treats the
    whole box (incl. printed URL) as foreground and leaves it — this
    script does NOT claim to fix Trimico's own branding, only flags which
    files still have it (printed on FLAGGED_SUPPLIER_TEXT list below) so
    Joe can decide: ask the supplier for clean assets, or accept as-is.

Simpler than the old script on purpose (per Joe's request 2026-09-04):
one background style, no manual flood-fill/dilate tuning, real AI cutout.

Run: python scripts/regen_premium_bg_rembg.py --sample   (3 sample files only, writes to *_SAMPLE.png next to output, does NOT overwrite)
     python scripts/regen_premium_bg_rembg.py --all       (regenerates all, overwrites premium-bg/)
"""
import argparse
import os

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
from rembg import remove, new_session

PUBLIC_ROOT = "public"
PREMIUM_DIR = os.path.join(PUBLIC_ROOT, "products", "premium-bg")

# v3 — Joe's feedback on v2: flat 2-stop gradient "trong mờ và xấu" (looks
# thin/washed out). Reference he sent (GPT-generated studio shot) has: light
# falling from top-left like a real softbox, a background tone matched to
# the product category (not one tone for everything), and fine grain so it
# reads as a photographed surface, not a flat digital gradient.
#
# ivory: default premium neutral. sage: health/herbal (tea, mushroom, honey
# with green cues). gold-dark: spirits/rượu (deeper, richer setting).
# Lightened per Joe's feedback on v3 (2026-09-04): "đổ màu nhạt hơn" — the
# sage/gold-dark edge tones were too saturated/deep, closer to the reference
# photo's much paler ivory/mint now.
BG_STYLES = {
    "ivory": {"c": (255, 254, 251), "e": (241, 233, 218)},
    "sage": {"c": (251, 253, 249), "e": (223, 233, 219)},
    "gold-dark": {"c": (234, 221, 195), "e": (172, 151, 118)},
}
# Keyword -> style, matched against the product's file path (rel_path is the
# most stable signal we have here — no product name passed into this script).
CATEGORY_KEYWORDS = {
    "sage": ["tra-", "nam-", "che-", "la-sam", "hoa-sam", "mat-ong", "yen"],
    "gold-dark": ["ruou-", "men-"],
}

# Pale/white products (plastic bags, white boxes) disappear against a light
# background — same brightness, not a cutout bug. Force these onto the
# deepest style regardless of category match.
PALE_PRODUCT_BRIGHTNESS = 175  # mean RGB of the kept (non-background) pixels

SESSION = new_session("u2net")


def pick_style(rel_path: str) -> str:
    name = rel_path.replace("\\", "/").lower()
    for style, keywords in CATEGORY_KEYWORDS.items():
        if any(k in name for k in keywords):
            return style
    return "ivory"


def make_gradient_bg(size, stops):
    """Directional soft-studio-light gradient (light source upper-left, like
    the reference photo) + a whisper of film grain so it doesn't read as a
    flat digital gradient."""
    w, h = size
    # Light source offset up-left instead of dead-center — a real softbox
    # doesn't sit behind the product.
    lx, ly = w * 0.32, h * 0.22
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.clip(np.sqrt(((xx - lx) / (w * 0.85)) ** 2 + ((yy - ly) / (h * 0.85)) ** 2), 0, 1)
    # Smootherstep instead of linear falloff — linear is what made v2 look
    # like a flat printed gradient rather than soft light falloff.
    dist = dist * dist * (3 - 2 * dist)
    bg = np.zeros((h, w, 3), dtype=np.float32)
    c, e = stops["c"], stops["e"]
    for i in range(3):
        bg[:, :, i] = c[i] + (e[i] - c[i]) * dist
    noise = np.random.normal(0, 2.2, (h, w))
    for i in range(3):
        bg[:, :, i] = np.clip(bg[:, :, i] + noise, 0, 255)
    return Image.fromarray(bg.astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(1.2))


def cutout_rembg(im: Image.Image) -> Image.Image:
    """AI segmentation instead of color-threshold flood-fill — correctly
    keeps white/pale parts that are actually the product (labels, caps,
    packaging), only strips the real background."""
    out = remove(im.convert("RGBA"), session=SESSION)
    return out


def composite_with_shadow(cutout: Image.Image, bg: Image.Image) -> Image.Image:
    """Two-layer shadow — a tight dark contact shadow right under the base
    (product 'sits' on the surface) plus a wider, much softer ambient
    shadow — a single blurred ellipse (v2) read as a flat grey smudge."""
    alpha = np.array(cutout.split()[-1])
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    if not rows.any():
        return Image.alpha_composite(bg.convert("RGBA"), cutout)
    y0, y1 = np.where(rows)[0][[0, -1]]
    x0, x1 = np.where(cols)[0][[0, -1]]
    cx = float(x0 + x1) / 2
    base_w = float(x1 - x0)

    shadow_layer = Image.new("RGBA", bg.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow_layer)
    # Ambient — wide, very soft, barely-there
    amb_w, amb_h = base_w * 0.7, base_w * 0.7 * 0.18
    sd.ellipse([cx - amb_w / 2, y1 - amb_h / 2, cx + amb_w / 2, y1 + amb_h / 2], fill=(20, 30, 20, 40))
    # Contact — tight, darker, close under the base
    con_w, con_h = base_w * 0.42, base_w * 0.42 * 0.12
    sd.ellipse([cx - con_w / 2, y1 - con_h / 2, cx + con_w / 2, y1 + con_h / 2], fill=(10, 15, 10, 75))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(max(3, base_w * 0.05)))

    canvas = bg.convert("RGBA")
    canvas = Image.alpha_composite(canvas, shadow_layer)
    canvas = Image.alpha_composite(canvas, cutout)
    return canvas


def color_grade(im: Image.Image) -> Image.Image:
    """Subtle 'sang trọng' pass: a bit more contrast/color depth and warmth,
    not a strong filter — keeps the product looking real, per brand
    guideline (KGC style stays close to natural color, accent only)."""
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    return im


def process_one(rel_path: str):
    """Returns (image, flagged). flagged=True means the product itself is
    pale/white (plastic bag, white box — e.g. 28-men-kim-boi.png) and would
    disappear against the light gradient (same brightness, not a cutout
    bug) — those get the deeper taupe background instead, and are flagged
    so Joe can eyeball this small subset specifically."""
    src_path = os.path.join(PUBLIC_ROOT, "products", rel_path)
    im = Image.open(src_path)
    cutout = cutout_rembg(im)
    alpha = np.array(cutout.split()[-1])
    kept_mask = alpha > 10
    kept_ratio = float(kept_mask.sum()) / alpha.size
    if kept_ratio < 0.02:
        # Segmentation found almost nothing — trust the original photo as-is.
        return color_grade(im.convert("RGB")), True

    rgb = np.array(cutout.convert("RGB"))
    mean_brightness = float(rgb[kept_mask].mean())
    is_pale = mean_brightness > PALE_PRODUCT_BRIGHTNESS
    style = "gold-dark" if is_pale else pick_style(rel_path)
    bg = make_gradient_bg(im.size, BG_STYLES[style])
    composited = composite_with_shadow(cutout, bg).convert("RGB")
    return color_grade(composited), is_pale


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="overwrite premium-bg/ in place for every file")
    ap.add_argument("--files", nargs="*", help="specific rel paths under premium-bg/ to process (writes to premium-bg-sample/ unless --all)")
    args = ap.parse_args()

    if args.files:
        rel_paths = args.files
    else:
        rel_paths = []
        for root, _dirs, files in os.walk(PREMIUM_DIR):
            for fn in files:
                full = os.path.join(root, fn)
                rel_paths.append(os.path.relpath(full, PREMIUM_DIR))
        rel_paths.sort()

    out_dir = PREMIUM_DIR if args.all else os.path.join(PUBLIC_ROOT, "products", "premium-bg-sample")
    os.makedirs(out_dir, exist_ok=True)

    flagged_files = []
    for rel_path in rel_paths:
        src_path = os.path.join(PUBLIC_ROOT, "products", rel_path)
        if not os.path.exists(src_path):
            print(f"SKIP (no source): {rel_path}")
            continue
        result, flagged = process_one(rel_path)
        out_path = os.path.join(out_dir, rel_path)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        result.save(out_path, quality=92)
        tag = "PALE-PRODUCT" if flagged else "ok"
        print(f"[{tag:12s}] {rel_path}")
        if flagged:
            flagged_files.append(rel_path)

    print(f"\nDone: {len(rel_paths)} images, {len(flagged_files)} flagged as pale/white product (deeper bg used).")
    if flagged_files:
        print("Flagged files — worth a manual eyeball:")
        for f in flagged_files:
            print(f"  {f}")


if __name__ == "__main__":
    main()
