"""
Translate product name + description -> nameEn/descriptionEn (+ zh/fr optional)
Uses Ollama local model. Patches products.ts in place.

Usage:
  python scripts/translate_products.py --lang en          # English only
  python scripts/translate_products.py --lang en zh fr    # multiple langs
  python scripts/translate_products.py --lang en --dry    # preview only
"""
import argparse
import json
import re
import sys
import time
import urllib.request

PRODUCTS_TS = "src/data/products.ts"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5:7b-instruct"  # or "llama3.2:3b", "phi3:mini" — any Ollama model

LANG_MAP = {
    "en": ("nameEn", "descriptionEn", "English"),
    "zh": ("nameZh", "descriptionZh", "Simplified Chinese (简体中文)"),
    "fr": ("nameFr", "descriptionFr", "French"),
}


def ollama_translate_pair(name: str, desc: str, target_lang: str) -> tuple[str, str]:
    """Translate name + description in one call. Returns (name_t, desc_t)."""
    prompt = (
        f"Translate these two Vietnamese product texts to {target_lang}.\n"
        f"Return ONLY a JSON object: {{\"name\": \"...\", \"desc\": \"...\"}}\n\n"
        f"NAME: {name}\nDESC: {desc}"
    )
    body = json.dumps({"model": MODEL, "prompt": prompt, "stream": False}).encode()
    for attempt in range(2):
        try:
            req = urllib.request.Request(OLLAMA_URL, data=body, method="POST",
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                raw = json.loads(r.read())["response"].strip()
            # extract JSON from response
            m = re.search(r'\{.*?"name".*?"desc".*?\}', raw, re.DOTALL)
            if m:
                obj = json.loads(m.group())
                return obj["name"].strip(), obj["desc"].strip()
            # fallback: split by lines
            lines = [l.strip() for l in raw.splitlines() if l.strip()]
            return lines[0] if lines else name, lines[1] if len(lines) > 1 else desc
        except Exception as e:
            if attempt == 1:
                raise
            time.sleep(2)
    return name, desc


def extract_products(ts_src: str):
    """Return list of {sku, name, description, slug} from products.ts."""
    items = []
    for m in re.finditer(r'"sku":\s*"([^"]+)".*?"slug":\s*"([^"]+)".*?"name":\s*"([^"]+)".*?"description":\s*"([^"]+)"',
                         ts_src, re.DOTALL):
        items.append({"sku": m[1], "slug": m[2], "name": m[3], "description": m[4]})
    return items


def patch_product(ts_src: str, slug: str, fields: dict[str, str]) -> str:
    """Insert/replace nameEn/descriptionEn fields after the 'sourceUrl' line for this product."""
    # Find the product block for this slug
    slug_pat = re.compile(r'("slug":\s*"' + re.escape(slug) + r'")')
    m = slug_pat.search(ts_src)
    if not m:
        return ts_src

    # Look for existing translated fields and remove them first
    for key in fields:
        ts_src = re.sub(r'\s*"' + key + r'":\s*"[^"]*",?\n', '\n', ts_src)

    # Re-find slug position after removal
    m = slug_pat.search(ts_src)
    if not m:
        return ts_src

    # Find 'sourceUrl' after this slug
    src_url_pat = re.compile(r'"sourceUrl":\s*"[^"]*"', re.DOTALL)
    search_start = m.start()
    m2 = src_url_pat.search(ts_src, search_start)
    if not m2:
        return ts_src

    insert_pos = m2.end()
    insert_str = ""
    for key, val in fields.items():
        escaped = val.replace("\\", "\\\\").replace('"', '\\"')
        insert_str += f',\n    "{key}": "{escaped}"'

    return ts_src[:insert_pos] + insert_str + ts_src[insert_pos:]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lang", nargs="+", default=["en"], choices=list(LANG_MAP))
    parser.add_argument("--dry", action="store_true", help="Print result, don't write")
    parser.add_argument("--sku", help="Translate only this SKU (for testing)")
    args = parser.parse_args()

    with open(PRODUCTS_TS, encoding="utf-8") as f:
        ts_src = f.read()

    products = extract_products(ts_src)
    if args.sku:
        products = [p for p in products if p["sku"] == args.sku]

    print(f"Translating {len(products)} products -> {args.lang} using {MODEL}")

    for i, p in enumerate(products):
        sys.stdout.write(f"[{i+1}/{len(products)}] {p['sku']}  ")
        sys.stdout.flush()
        fields = {}
        for lang in args.lang:
            name_key, desc_key, lang_label = LANG_MAP[lang]
            try:
                name_t, desc_t = ollama_translate_pair(p["name"], p["description"], lang_label)
                fields[name_key] = name_t
                fields[desc_key] = desc_t
                sys.stdout.write(f"{lang}:OK ")
            except Exception as e:
                sys.stdout.write(f"{lang}:ERR({str(e)[:40]}) ")
        sys.stdout.write("\n")
        if fields and not args.dry:
            ts_src = patch_product(ts_src, p["slug"], fields)
        time.sleep(0.1)

    if not args.dry:
        with open(PRODUCTS_TS, "w", encoding="utf-8") as f:
            f.write(ts_src)
        print(f"\nDone. {PRODUCTS_TS} updated.")
    else:
        print("\n[dry run] no files written.")


if __name__ == "__main__":
    main()
