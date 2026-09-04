"""
Regenerates public/products/premium-bg/<...> in place for all SKUs, same
gold/green alternating premium background as batch_premium_bg_alternate.py,
but WITHOUT stamping the TA logo + site URL — Joe reported the watermark
looked misaligned/cropped on live product cards (the stamp script used a
hardcoded Linux font path /usr/share/fonts/... which silently falls back to
PIL's tiny bitmap default font on Windows, so text position/size math never
matched what actually got drawn).

Reads straight from public/products/<rel_path> (untouched originals) for
every file that currently exists under public/products/premium-bg/, so it's
safe to re-run — never touches the source photos.

Run: python scripts/regen_premium_bg_no_watermark.py
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import binary_dilation, label

PUBLIC_ROOT = "public"
PREMIUM_DIR = os.path.join(PUBLIC_ROOT, "products", "premium-bg")

VARIANTS = {
    "gold":  {"c": (255, 252, 245), "e": (232, 220, 198)},
    "green": {"c": (250, 255, 250), "e": (210, 232, 215)},
}


def make_gradient_bg(size, stops):
    w, h = size
    cx, cy = w / 2.0, h / 2.0
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.clip(np.sqrt(((xx - cx) / (w * 0.6)) ** 2 + ((yy - cy) / (h * 0.6)) ** 2), 0, 1)
    bg = np.zeros((h, w, 3), dtype=np.float32)
    c, e = stops["c"], stops["e"]
    for i in range(3):
        bg[:, :, i] = c[i] + (e[i] - c[i]) * dist
    noise = np.random.normal(0, 2.5, (h, w))
    for i in range(3):
        bg[:, :, i] = np.clip(bg[:, :, i] + noise, 0, 255)
    return Image.fromarray(bg.astype(np.uint8), "RGB").filter(ImageFilter.GaussianBlur(1))


def cut_white_background(im, thresh=205):
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    minc = rgb.min(axis=2)
    whiteish = minc >= thresh
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


def process_one(rel_path, variant_name):
    src_path = os.path.join(PUBLIC_ROOT, "products", rel_path)
    out_path = os.path.join(PREMIUM_DIR, rel_path)
    im = Image.open(src_path)
    cutout = cut_white_background(im)
    bg = make_gradient_bg(im.size, VARIANTS[variant_name])
    composited = composite_with_shadow(cutout, bg).convert("RGB")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    composited.save(out_path, quality=92)


def main():
    rel_paths = []
    for root, _dirs, files in os.walk(PREMIUM_DIR):
        for fn in files:
            full = os.path.join(root, fn)
            rel_paths.append(os.path.relpath(full, PREMIUM_DIR))
    rel_paths.sort()

    counts = {"gold": 0, "green": 0}
    skipped = []
    for i, rel_path in enumerate(rel_paths):
        variant_name = "gold" if i % 2 == 0 else "green"
        src_path = os.path.join(PUBLIC_ROOT, "products", rel_path)
        if not os.path.exists(src_path):
            skipped.append(rel_path)
            continue
        process_one(rel_path, variant_name)
        counts[variant_name] += 1
        print(f"[{variant_name:5s}] {rel_path}")

    print(f"\nDone: {counts['gold'] + counts['green']} images ({counts['gold']} gold, {counts['green']} green).")
    if skipped:
        print(f"Skipped (no source found): {len(skipped)}")
        for s in skipped:
            print(f"  MISSING SOURCE: {s}")


if __name__ == "__main__":
    main()
