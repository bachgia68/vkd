"""
Removes the flat white studio background from real product photos and
recomposites them onto a brand-toned gradient (Ivory -> Ivory Dim, soft
vignette), matching the "professional background, not plain white" look Joe
asked for (KGC reference). Background removal is border-flood-fill based
(only white-ish regions connected to the image edge are cut), so light
elements *inside* the product — labels, gold caps, text — are never touched.

Run: python scripts/generate_premium_product_bg.py
Reads every product image referenced in src/data/products.ts (via
scripts/_product_images.json, regenerate with:
  npx tsx -e "..." — see git history of this file for the one-liner, or just
  re-run the extraction: import products from products.ts, dedupe .image).
Output mirrors the source's subfolder (root / trimico / samk5 / ...) under
public/products/premium-bg/ so filenames that repeat across suppliers
(01-*.png, 02-*.png, ...) never collide.
"""
import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import label

IVORY = (246, 242, 233)
IVORY_DIM = (237, 231, 216)
VIGNETTE = (214, 201, 168)  # muted warm edge tone, brand gold-adjacent

PUBLIC_ROOT = "public"
IMAGE_LIST_PATH = "scripts/_product_images.json"


def make_gradient_bg(size):
    w, h = size
    cx, cy = w / 2, h * 0.42  # optical center slightly above vertical middle
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.sqrt(((xx - cx) / (w * 0.75)) ** 2 + ((yy - cy) / (h * 0.75)) ** 2)
    dist = np.clip(dist, 0, 1)

    bg = np.zeros((h, w, 3), dtype=np.float32)
    for i in range(3):
        # 3-stop gradient: Ivory center -> Ivory Dim mid -> muted vignette edge
        stop1 = IVORY[i]
        stop2 = IVORY_DIM[i]
        stop3 = VIGNETTE[i]
        t = dist
        near = t < 0.55
        val_near = stop1 + (stop2 - stop1) * (t / 0.55)
        t2 = np.clip((t - 0.55) / 0.45, 0, 1)
        val_far = stop2 + (stop3 - stop2) * t2
        bg[:, :, i] = np.where(near, val_near, val_far)
    return Image.fromarray(bg.astype(np.uint8), "RGB")


def cut_white_background(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    minc = rgb.min(axis=2)

    # Loose "white/light-gray-ish" mask — some source photos use a seamless
    # light-gray backdrop (~215-225) rather than pure white, so 225 alone
    # missed most of the background on those and left a visible seam.
    whiteish = minc >= 205
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


def composite_with_shadow(cutout: Image.Image, bg: Image.Image) -> Image.Image:
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
        fill=(11, 47, 29, 70),  # forest-900 tint, soft
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(shadow_w * 0.06))

    canvas = bg.convert("RGBA")
    canvas = Image.alpha_composite(canvas, shadow_layer)
    canvas = Image.alpha_composite(canvas, cutout)
    return canvas


def process_one(rel_url: str) -> str:
    """rel_url like '/products/trimico/11-hoa-sam-tuoi.png' -> writes
    public/products/premium-bg/trimico/11-hoa-sam-tuoi.png, returns the new
    rel_url ('/products/premium-bg/trimico/11-hoa-sam-tuoi.png')."""
    assert rel_url.startswith("/products/")
    sub_path = rel_url[len("/products/"):]  # e.g. "trimico/11-hoa-sam-tuoi.png"
    src_path = os.path.join(PUBLIC_ROOT, "products", sub_path)
    out_rel = os.path.join("products", "premium-bg", sub_path)
    out_path = os.path.join(PUBLIC_ROOT, out_rel)

    im = Image.open(src_path)
    cutout = cut_white_background(im)
    bg = make_gradient_bg(im.size)
    result = composite_with_shadow(cutout, bg).convert("RGB")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    result.save(out_path, quality=92)
    return "/" + out_rel.replace(os.sep, "/")


def main():
    with open(IMAGE_LIST_PATH, encoding="utf-8") as f:
        images = json.load(f)

    mapping = {}
    for rel_url in images:
        new_url = process_one(rel_url)
        mapping[rel_url] = new_url
        print(f"{rel_url} -> {new_url}")

    with open("scripts/_product_image_mapping.json", "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    print(f"\nDone: {len(mapping)} images. Mapping written to scripts/_product_image_mapping.json")


if __name__ == "__main__":
    main()
