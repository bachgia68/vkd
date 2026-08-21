"""
Generate professional product photography via fal-ai/bria/product-shot.
Replaces the Python gradient composite with real AI-generated studio backgrounds.

Usage:
  python scripts/fal_product_shot.py                    # all files in premium-bg
  python scripts/fal_product_shot.py --file 01-sam-...  # single file test
"""
import argparse
import base64
import os
import sys
import time
from pathlib import Path

import fal_client
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.environ.get("FAL_KEY") or os.environ.get("FAL_API_KEY")
if not FAL_KEY:
    sys.exit("FAL_KEY not found in .env")

os.environ["FAL_KEY"] = FAL_KEY

PUBLIC_ROOT = Path("public")
SRC_DIR    = PUBLIC_ROOT / "products"
OUT_DIR    = PUBLIC_ROOT / "products" / "premium-bg"

SCENE_PROMPT = (
    "Luxury Vietnamese ginseng product on a deep forest-green premium surface, "
    "elegant studio lighting with soft shadows, dark rich background gradient from "
    "deep emerald to near-black, high-end health supplement brand photography, "
    "clean minimal composition, professional commercial photography, 4K quality"
)

NEGATIVE_PROMPT = "text, watermark, logo, blurry, low quality, cheap, plastic"


def encode_image(path: Path) -> str:
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    suffix = path.suffix.lower().lstrip(".")
    mime = "image/png" if suffix == "png" else "image/jpeg"
    return f"data:{mime};base64,{data}"


def generate_product_shot(src_path: Path, out_path: Path):
    print(f"  > FAL: {src_path.name}")
    result = fal_client.run(
        "fal-ai/bria/product-shot",
        arguments={
            "image_url": encode_image(src_path),
            "scene_description": SCENE_PROMPT,
            "negative_prompt": NEGATIVE_PROMPT,
            "num_images": 1,
            "optimize_description": True,
        },
    )
    images = result.get("images") or []
    if not images:
        print(f"  ✗ No output for {src_path.name}")
        return False

    import urllib.request
    img_url = images[0]["url"]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(img_url, out_path)
    print(f"  ✓ saved → {out_path}")
    return True


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", help="Single relative path under public/products/")
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

    print(f"Processing {len(files)} files via fal-ai/bria/product-shot ...\n")
    ok = fail = 0
    for rel in files:
        src = SRC_DIR / rel
        out = OUT_DIR / rel
        try:
            if generate_product_shot(src, out):
                ok += 1
            else:
                fail += 1
        except Exception as e:
            print(f"  ✗ ERROR {rel}: {e}")
            fail += 1
        time.sleep(0.5)  # rate limit courtesy

    print(f"\nDone: {ok} OK, {fail} failed.")


if __name__ == "__main__":
    main()
