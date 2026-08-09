"""
Removes the flat white studio background from real product photos and
recomposites them onto a brand-toned gradient (Ivory -> Ivory Dim, soft
vignette), matching the "professional background, not plain white" look Joe
asked for (KGC reference). Background removal is border-flood-fill based
(only white-ish regions connected to the image edge are cut), so light
elements *inside* the product — labels, gold caps, text — are never touched.

Run: python scripts/generate_premium_product_bg.py
Reads/writes only the 12 current homepage-featured product images (see
scripts/_tmp_list_featured.mjs output) — full 90-SKU catalog can reuse this
same function later, not done in this pass to keep it fast/reviewable.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import label
import os

IVORY = (246, 242, 233)
IVORY_DIM = (237, 231, 216)
VIGNETTE = (214, 201, 168)  # muted warm edge tone, brand gold-adjacent

SRC_ROOT = "public/products"
OUT_ROOT = "public/products/premium-bg"

IMAGES = [
    "01-sam-ngoc-linh-thai-lat-ngam-mat-ong.png",
    "02-cao-sam-ngoc-linh-mat-ong.png",
    "17-ruou-ngoc-de-thien-huong-750ml.png",
    "29-bo-tre-hoa-combo-big-size.png",
    "04-giai-doc-gan-panaxx-naturis.png",
    "18-ruou-ngoc-de-sam-ngoc-linh-12-nam-500ml.png",
    "19-ruou-ngoc-de-sam-ngoc-linh-10-nam-500ml.png",
    "25-combo-2-chai-ruou-sam-ngoc-linh-19-5-do.png",
    "31-nuoc-tre-hoa-da-purely-refreshing.png",
    "trimico/11-hoa-sam-tuoi.png",
    "trimico/42-mat-ong-dang-rung-500ml.png",
    "trimico/02-tra-sam-ngoc-linh-thuong-hang.png",
]


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

    # Loose "white-ish" mask (catches anti-aliased edge halo too)
    whiteish = minc >= 225
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


def main():
    os.makedirs(OUT_ROOT, exist_ok=True)
    for rel in IMAGES:
        src_path = os.path.join(SRC_ROOT, rel)
        im = Image.open(src_path)
        cutout = cut_white_background(im)
        bg = make_gradient_bg(im.size)
        result = composite_with_shadow(cutout, bg).convert("RGB")
        out_path = os.path.join(OUT_ROOT, os.path.basename(rel))
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        result.save(out_path, quality=92)
        print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
