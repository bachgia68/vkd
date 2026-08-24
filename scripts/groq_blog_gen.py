"""
Generate blog posts via Groq (llama-3.3-70b-versatile) and upload to Supabase.
Reads prompts from docs/seo-blog-drafts/OLLAMA_PROMPTS.md.

Usage:
  python scripts/groq_blog_gen.py           # all 3 posts
  python scripts/groq_blog_gen.py --idx 0   # post index 0 only (0-based)
"""
import argparse
import json
import os
import sys
import urllib.request
from dotenv import load_dotenv

load_dotenv()

GROQ_KEY = os.environ.get("GROQ_API_KEY") or os.environ.get("VITE_GROQ_API_KEY")
SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY")

if not GROQ_KEY:
    sys.exit("GROQ_API_KEY missing from .env")
if not SUPABASE_URL or not SUPABASE_KEY:
    sys.exit("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing from .env")

POSTS = [
    {
        "title": "Hướng dẫn mua sâm Ngọc Linh uy tín — Checklist đầy đủ",
        "slug": "huong-dan-mua-sam-ngoc-linh-uy-tin",
        "excerpt": "Làm sao chọn được sâm Ngọc Linh thật, chất lượng cao, giá hợp lý? Guide đầy đủ 9 điểm cần kiểm tra trước khi mua, cách nhận biết sâm giả, và 5 kênh mua uy tín.",
        "featured_image_url": "https://tasamngoclinh.com/assets/images/heritage-cusam-2.jpg",
        "prompt": """Viết 1 bài blog Tiếng Việt, độc lập, 2000-2500 từ.

Tiêu đề: "Hướng dẫn mua sâm Ngọc Linh uy tín — Checklist đầy đủ"

Cấu trúc bài bắt buộc:
1. Intro (100 từ): Tại sao cần guide này, phần lớn sâm bán thị trường là giả hoặc kém chất lượng.
2. Section "9 Tiêu chí kiểm tra sâm Ngọc Linh thật": hình dáng rễ (đốt), màu sắc, mùi hương, trọng lượng, chứng chỉ Saponin, xuất xứ Trà Linh, thời gian lưu trữ, giá bán, hình thức bán.
3. Section "Sâm giả vs Sâm thật — So sánh trực tiếp": bảng so sánh 5-6 đặc điểm.
4. Section "5 Kênh mua uy tín": mua tại vườn Trà Linh, shop chuyên, thuốc Đông y, online, qua người thân.
5. Section "Giá tham khảo": bảng giá theo loại và hạng.
6. Section "Mẹo tránh mua phải sâm kém chất lượng".
7. FAQ mini (3 câu phổ biến).
8. Kết luận (100 từ): nhắc kiểm tra kỹ, gợi ý TA Sâm Ngọc Linh.

Yêu cầu: Markdown H2 cho section, có ít nhất 1 bảng so sánh, tone chuyên sâu gần gũi, không bịa số liệu y học."""
    },
    {
        "title": "Phân biệt sâm Ngọc Linh thật và giả — Hướng dẫn chi tiết",
        "slug": "phan-biet-sam-ngoc-linh-that-gia",
        "excerpt": "Sâm giả ngày càng tinh vi. Hướng dẫn từng cách kiểm tra sâm Ngọc Linh thật: từ hình dáng rễ, màu sắc, mùi hương, đến chứng chỉ kiểm định Saponin. Tránh mua phải hàng lạo.",
        "featured_image_url": "https://tasamngoclinh.com/assets/images/heritage-cusam-2.jpg",
        "prompt": """Viết bài blog 1500-2000 từ, Tiếng Việt.

Tiêu đề: "Phân biệt sâm Ngọc Linh thật và giả — Hướng dẫn chi tiết"

Cấu trúc:
1. Intro (80 từ): vấn đề sâm giả tràn lan hiện nay.
2. Section "Các loại sâm giả phổ biến": sâm Hàn Quốc bán chui, sâm nước ngoài nhập rẻ, sâm vùng khác không phải Trà Linh.
3. Section "Cách phân biệt qua 7 đặc điểm": hình dáng rễ, màu sắc, mùi hương, trọng lượng, cảm giác chạm, chứng chỉ Saponin, hộp đóng gói.
4. Section "Kiểm tra Chứng chỉ Saponin — Cách xác minh".
5. Section "Bảng so sánh: Sâm Ngọc Linh Thật vs Giả" (markdown table).
6. Section "5 Lời khuyên tránh mua sâm giả".
7. Kết.

Yêu cầu: Markdown, có bảng so sánh bắt buộc, tone chân thành cảnh báo, không bán hàng lộ liễu."""
    },
    {
        "title": "Cách dùng sâm Ngọc Linh đúng cách — Liều, Thời điểm, Lưu ý",
        "slug": "cach-dung-sam-ngoc-linh-dung-cach",
        "excerpt": "Sâm Ngọc Linh dùng sao cho hiệu quả? Hướng dẫn liều lượng, thời điểm uống, cách nấu, và những lưu ý quan trọng để đạt tác dụng tối đa.",
        "featured_image_url": "https://tasamngoclinh.com/assets/images/heritage-vuon-sam-1.jpg",
        "prompt": """Bài blog 1200-1600 từ, Tiếng Việt.

Tiêu đề: "Cách dùng sâm Ngọc Linh đúng cách — Liều, Thời điểm, Lưu ý"

Cấu trúc:
1. Intro (60 từ): dùng sai cách sẽ lãng phí tiền.
2. Section "Liều lượng hàng ngày": người bình thường 2-3g, người yếu 3-5g, người cao tuổi 2-3g, không quá 5g/ngày.
3. Section "Cách dùng sâm Ngọc Linh": ngâm mật ong, ngâm rượu, nấu canh, nhai trực tiếp, bột/viên.
4. Section "Thời điểm uống tốt nhất": sáng sớm tốt nhất, không chiều tối/trước ngủ.
5. Section "Thời gian liên tục — Nên ngừng định kỳ": 1-2 tháng rồi nghỉ 1 tuần.
6. Section "Lưu ý & Chống chỉ định": huyết áp cao, phụ nữ mang thai, thuốc loãng máu.
7. Section "Cách bảo quản".
8. FAQ (2-3 câu).

Yêu cầu: Markdown H2, tone hữu ích cẩn thận, nhắc tư vấn bác sĩ khi có bệnh."""
    },
]


def groq_generate(prompt):
    import requests as _req
    resp = _req.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"},
        json={"model": "groq/compound", "messages": [
            {"role": "system", "content": "You are a Vietnamese content writer. Write the final blog post directly without any thinking, planning, or meta-commentary."},
            {"role": "user", "content": prompt}
        ], "temperature": 0.7, "max_tokens": 8192},
        timeout=180,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]




def supabase_upsert(post):
    payload = json.dumps(post).encode()
    url = f"{SUPABASE_URL}/rest/v1/blog_posts?on_conflict=slug"
    req = urllib.request.Request(
        url,
        data=payload,
        method="POST",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--idx", type=int, help="0-based post index (omit = all)")
    args = parser.parse_args()

    posts_to_run = [POSTS[args.idx]] if args.idx is not None else POSTS

    for p in posts_to_run:
        sys.stdout.buffer.write(f"\nGenerating: {p['slug']}\n".encode())
        body = groq_generate(p["prompt"])
        sys.stdout.buffer.write(f"  Generated {len(body)} chars\n".encode())

        row = {
            "title": p["title"],
            "slug": p["slug"],
            "excerpt": p["excerpt"],
            "body": body,
            "featured_image_url": p["featured_image_url"],
            "published": True,
        }
        out_file = f"C:/Users/DELL/AppData/Local/Temp/blog_{p['slug']}.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(row, f, ensure_ascii=False, indent=2)
        sys.stdout.buffer.write(f"  Saved to {out_file}\n".encode())

    sys.stdout.buffer.write(b"\nDone.\n")


if __name__ == "__main__":
    main()
