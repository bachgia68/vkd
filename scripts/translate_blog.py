"""
Translate blog_posts (title, excerpt, body) -> title_en/zh/fr, etc.
Uses Ollama local model. Requires Supabase MCP or service-role key via env.

Adds columns to blog_posts if not exist, then translates and upserts.

Usage:
  python scripts/translate_blog.py --lang en
  python scripts/translate_blog.py --lang en zh fr
  python scripts/translate_blog.py --lang en --slug huong-dan-mua-sam-ngoc-linh-uy-tin
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.request
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "")
# Need service role key for UPDATE; falls back to anon (read-only)
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY", "")
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5:7b-instruct"

LANG_MAP = {
    "en": ("title_en", "excerpt_en", "body_en", "English"),
    "zh": ("title_zh", "excerpt_zh", "body_zh", "Simplified Chinese (简体中文)"),
    "fr": ("title_fr", "excerpt_fr", "body_fr", "French"),
}


def sb_get(path: str) -> list:
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    req = urllib.request.Request(url, headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def sb_patch(slug: str, fields: dict):
    url = f"{SUPABASE_URL}/rest/v1/blog_posts?slug=eq.{slug}"
    body = json.dumps(fields).encode()
    req = urllib.request.Request(url, data=body, method="PATCH", headers={
        "apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json", "Prefer": "return=minimal",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status


def ollama(prompt: str) -> str:
    body = json.dumps({"model": MODEL, "prompt": prompt, "stream": False}).encode()
    for attempt in range(2):
        try:
            req = urllib.request.Request(OLLAMA_URL, data=body, method="POST",
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.loads(r.read())["response"].strip()
        except Exception as e:
            if attempt == 1:
                raise
            time.sleep(3)
    return ""


def translate_post(post: dict, lang: str) -> dict:
    title_key, excerpt_key, body_key, lang_label = LANG_MAP[lang]
    fields = {}

    # Title + excerpt in 1 call
    pair_prompt = (
        f"Translate these Vietnamese texts to {lang_label}.\n"
        f"Return ONLY JSON: {{\"title\": \"...\", \"excerpt\": \"...\"}}\n\n"
        f"TITLE: {post['title']}\nEXCERPT: {post.get('excerpt', '')}"
    )
    raw = ollama(pair_prompt)
    m = re.search(r'\{.*?"title".*?"excerpt".*?\}', raw, re.DOTALL)
    if m:
        obj = json.loads(m.group())
        fields[title_key] = obj.get("title", post["title"])
        fields[excerpt_key] = obj.get("excerpt", post.get("excerpt", ""))
    else:
        fields[title_key] = post["title"]
        fields[excerpt_key] = post.get("excerpt", "")

    # Body in separate call (can be long)
    body_vi = post.get("body", "")
    if body_vi:
        body_prompt = (
            f"Translate the following Vietnamese blog post (Markdown) to {lang_label}.\n"
            f"Preserve all Markdown formatting (##, **, tables, etc.).\n"
            f"Return ONLY the translated text, no explanation.\n\n{body_vi[:6000]}"
        )
        fields[body_key] = ollama(body_prompt)

    return fields


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lang", nargs="+", default=["en"], choices=list(LANG_MAP))
    parser.add_argument("--slug", help="Translate only this slug")
    parser.add_argument("--dry", action="store_true")
    args = parser.parse_args()

    if not SUPABASE_URL:
        sys.exit("VITE_SUPABASE_URL missing")

    query = "blog_posts?select=slug,title,excerpt,body&published=eq.true&order=created_at"
    if args.slug:
        query = f"blog_posts?select=slug,title,excerpt,body&slug=eq.{args.slug}"

    posts = sb_get(query)
    print(f"Found {len(posts)} posts. Translating -> {args.lang}")

    for i, post in enumerate(posts):
        sys.stdout.write(f"[{i+1}/{len(posts)}] {post['slug'][:40]}  ")
        sys.stdout.flush()
        fields = {}
        for lang in args.lang:
            try:
                translated = translate_post(post, lang)
                fields.update(translated)
                sys.stdout.write(f"{lang}:OK ")
            except Exception as e:
                sys.stdout.write(f"{lang}:ERR({str(e)[:30]}) ")
        sys.stdout.write("\n")
        if fields and not args.dry:
            try:
                sb_patch(post["slug"], fields)
            except Exception as e:
                print(f"  PATCH error: {e}")
        time.sleep(0.2)

    print("\nDone.")


if __name__ == "__main__":
    main()
