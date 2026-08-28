#!/usr/bin/env python3
"""
Auto Blog Generator — TA Sâm Ngọc Linh
Scrape trends → Gemini → Supabase → n8n → Telegram

Run: python generate_and_post_blog.py [--topic science|lifestyle|heritage] [--title "custom title"]
"""

import os, sys, json, uuid, re, time, argparse, logging
from datetime import datetime
from pathlib import Path

# ─── LOGGING ───────────────────────────────────────────────────────────────
LOG_FILE = Path(__file__).parent / "blog_execution.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)
log = logging.getLogger(__name__)

# ─── ENV ───────────────────────────────────────────────────────────────────
ENV_FILE = Path("D:/TA page/site/ta_production/project/.env")
def load_env():
    if not ENV_FILE.exists():
        log.error(f".env not found: {ENV_FILE}")
        sys.exit(1)
    with open(ENV_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

load_env()
# also load from site root .env (has GROQ_API_KEY)
_site_env = Path("D:/TA page/site/.env")
if _site_env.exists():
    with open(_site_env, encoding="utf-8") as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k.strip(), _v.strip().strip('"').strip("'"))

SUPABASE_URL  = os.environ.get("VITE_SUPABASE_URL", "")
SUPABASE_KEY  = os.environ.get("VITE_SUPABASE_ANON_KEY", "")
GEMINI_KEY    = os.environ.get("VITE_GEMINI_API_KEY", "")
TG_TOKEN      = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT       = os.environ.get("TELEGRAM_CHAT_ID", "")
N8N_URL       = os.environ.get("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/sam-ngoc-linh-publish")

for var, name in [(SUPABASE_URL,"SUPABASE_URL"), (SUPABASE_KEY,"SUPABASE_KEY"), (GEMINI_KEY,"GEMINI_KEY")]:
    if not var:
        log.error(f"Missing env var: {name}")
        sys.exit(1)

# ─── TOPIC QUEUE (từ BLOG_30_TOPICS.md) ───────────────────────────────────
TOPICS = {
    "science": [
        ("Majonoside-R2: Hoạt Chất Độc Nhất Của Sâm Ngọc Linh Việt Nam", "majonoside-r2-hoat-chat-doc-nhat-sam-ngoc-linh"),
        ("Tầm Quan Trọng Của Kiểm Định Saponin Trong Sâm Ngọc Linh", "kiem-dinh-saponin-sam-ngoc-linh-chuan-quoc-te"),
        ("Sâm Ngọc Linh Và Chức Năng Hệ Tuần Hoàn: Bằng Chứng Khoa Học", "sam-ngoc-linh-he-tuan-hoan-bang-chung-khoa-hoc"),
        ("5 Polyphenol Quý Hiếm Trong Sâm Ngọc Linh Việt Nam", "5-polyphenol-quy-hiem-sam-ngoc-linh-viet-nam"),
        ("Sâm Ngọc Linh vs Ginseng Hàn: Phân Tích Chi Tiết Thành Phần", "sam-ngoc-linh-vs-ginseng-han-phan-tich-thanh-phan"),
        ("Cách Bảo Quản Sâm Ngọc Linh Để Duy Trì Hoạt Chất Tối Ưu", "bao-quan-sam-ngoc-linh-hoat-chat-toi-uu"),
        ("Nhân Sâm Ngọc Linh Xanh vs Sơ Chế: Sự Khác Biệt Hoạt Chất", "sam-ngoc-linh-xanh-vs-so-che-khac-biet-hoat-chat"),
        ("Thẩm Định Sâm Ngọc Linh: 7 Tiêu Chuẩn Phân Loại Chất Lượng", "tham-dinh-sam-ngoc-linh-7-tieu-chuan-chat-luong"),
        ("Sâm Ngọc Linh và Năng Suất Lao Động: Dữ Liệu Từ Nghiên Cứu", "sam-ngoc-linh-nang-suat-lao-dong-nghien-cuu"),
    ],
    "lifestyle": [
        ("Sâm Ngọc Linh Trong Đời Sống Hàng Ngày Của Người Việt", "sam-ngoc-linh-doi-song-hang-ngay-nguoi-viet"),
        ("Nghi Thức Uống Sâm: Từ Vua Chúa Đến Dân Gian", "nghi-thuc-uong-sam-ngoc-linh-vua-chua-dan-gian"),
        ("Sâm Ngọc Linh Cho Phụ Nữ: Kiến Thức Cần Biết", "sam-ngoc-linh-cho-phu-nu-kien-thuc-can-biet"),
        ("Làm Sâm Tươi Ngâm Mật Ong Tại Nhà: Hướng Dẫn Chi Tiết", "lam-sam-ngoc-linh-ngam-mat-ong-tai-nha"),
        ("Những Sai Lầm Phổ Biến Khi Sử Dụng Sâm Ngọc Linh", "sai-lam-pho-bien-khi-su-dung-sam-ngoc-linh"),
        ("Xây Dựng Thói Quen Uống Sâm: Lộ Trình 30 Ngày", "thoi-quen-uong-sam-ngoc-linh-lo-trinh-30-ngay"),
        ("Sâm Ngọc Linh Cho Cả Gia Đình: Tốt Cho Ai?", "sam-ngoc-linh-cho-ca-gia-dinh-tot-cho-ai"),
        ("Quà Tặng Ý Nghĩa: Tặng Sâm Ngọc Linh Cho Người Thân", "qua-tang-sam-ngoc-linh-y-nghia-nguoi-than"),
        ("Sâm Ngọc Linh trong Du Lịch: Mang Theo Hay Mua Tại Chỗ?", "sam-ngoc-linh-du-lich-mang-theo-hay-mua-tai-cho"),
        ("Cộng Đồng Người Dùng Sâm TA: Câu Chuyện Thực", "cong-dong-nguoi-dung-sam-ta-cau-chuyen-thuc"),
    ],
    "heritage": [
        ("Núi Ngọc Linh: Địa Lý Kỳ Diệu Tạo Ra Sâm Quý Nhất Thế Giới", "nui-ngoc-linh-dia-ly-ky-dieu-sam-quy-nhat"),
        ("Trà Linh — Thủ Phủ Sâm Ngọc Linh: Hành Trình Khám Phá", "tra-linh-thu-phu-sam-ngoc-linh-hanh-trinh-kham-pha"),
        ("Vườn Sâm Nhà Khánh: Gương Mẫu Canh Tác Hữu Cơ Ngọc Linh", "vuon-sam-nha-khanh-canh-tac-huu-co-ngoc-linh"),
        ("Từ Hạt Sâm Đến Rễ Sâm: Chu Kỳ Phát Triển 5-7 Năm", "hat-sam-den-re-sam-chu-ky-phat-trien-5-7-nam"),
        ("Gia Tăng Sâm Ngọc Linh: Kỹ Thuật Nhân Giống Hiện Đại", "ky-thuat-nhan-giong-sam-ngoc-linh-hien-dai"),
        ("Di Sản Thiên Nhiên Kon Tum: Tại Sao Vùng Đất Này Đặc Biệt", "di-san-thien-nhien-kon-tum-vung-dat-dac-biet"),
        ("Những Nét Văn Hóa Của Dân Tộc Ơ Đu & Xơ Đăng Vùng Ngọc Linh", "van-hoa-dan-toc-o-du-xo-dang-vung-ngoc-linh"),
        ("Tác Động Của Biến Đổi Khí Hậu Lên Vùng Ngọc Linh", "bien-doi-khi-hau-vung-ngoc-linh-giai-phap-ben-vung"),
        ("Tuyến Đường Sâm Ngọc Linh: Từ Vườn Đến Bàn Ăn Khách Hàng", "tuyen-duong-sam-ngoc-linh-vuon-den-ban-an"),
        ("Khám Phá Trà Linh: Hướng Dẫn Du Lịch & Mua Sâm Ngọc Linh Thật", "kham-pha-tra-linh-huong-dan-du-lich-mua-sam-that"),
    ],
}

FORBIDDEN = ["điều trị", "chữa khỏi", "công dụng (y học)", "hết bệnh", "hiệu quả 100%",
             "chắc chắn khỏe", "bảo đảm khỏi"]

STATE_FILE = Path(__file__).parent / "blog_topic_state.json"

def get_next_topic(topic_type):
    state = {}
    if STATE_FILE.exists():
        with open(STATE_FILE, encoding="utf-8") as f:
            state = json.load(f)
    idx = state.get(topic_type, 0)
    queue = TOPICS.get(topic_type, TOPICS["science"])
    title, slug = queue[idx % len(queue)]
    state[topic_type] = (idx + 1) % len(queue)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f)
    return title, slug

# ─── SCRAPE TRENDS (Google News RSS — no API) ──────────────────────────────
def scrape_trending_topic():
    """Cào Google News RSS cho 'sâm ngọc linh' — trả về title string hoặc None"""
    try:
        import requests, xml.etree.ElementTree as ET
        from urllib.parse import quote
        q = quote("sâm ngọc linh")
        url = f"https://news.google.com/rss/search?q={q}&hl=vi&gl=VN&ceid=VN:vi"
        r = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
        root = ET.fromstring(r.content)
        items = root.findall(".//item/title")
        if items:
            raw = items[0].text or ""
            clean = re.sub(r" - [^-]+$", "", raw).strip()
            log.info(f"[Scrape] Trending: {clean}")
            return clean
    except Exception as e:
        log.warning(f"[Scrape] Google News failed: {e}")
    return None

# ─── SCRAPEGRAPH-AI (optional, nếu có) ────────────────────────────────────
def scrape_with_scrapegraph(query):
    try:
        from scrapegraphai.graphs import SmartScraperGraph
        config = {
            "llm": {"api_key": GEMINI_KEY, "model": "google_vertexai/gemini-1.5-flash"},
            "verbose": False
        }
        urls = [f"https://www.google.com/search?q={query.replace(' ','+')}&tbm=nws"]
        graph = SmartScraperGraph(prompt=f"Tìm tin tức mới về: {query}", source=urls[0], config=config)
        result = graph.run()
        return str(result)[:500] if result else None
    except ImportError:
        return None
    except Exception as e:
        log.warning(f"[ScrapeGraph] {e}")
        return None

# ─── GROQ FALLBACK ─────────────────────────────────────────────────────────
GROQ_KEY = os.environ.get("GROQ_API_KEY", "")

def _call_groq(prompt):
    import urllib.request, json as _json
    body = _json.dumps({
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7, "max_tokens": 4096
    }).encode()
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = _json.loads(r.read())
    return resp["choices"][0]["message"]["content"]

def _call_ollama(prompt, model="qwen2.5:1.5b"):
    import urllib.request, json as _json
    body = _json.dumps({"model": model, "prompt": prompt, "stream": False}).encode()
    req = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=body,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        resp = _json.loads(r.read())
    return resp.get("response", "")

def _call_deepseek(prompt):
    import urllib.request, json as _json
    key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not key:
        raise ValueError("No DEEPSEEK_API_KEY")
    body = _json.dumps({
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7, "max_tokens": 4096
    }).encode()
    req = urllib.request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = _json.loads(r.read())
    return resp["choices"][0]["message"]["content"]

# ─── GENERATE (Ollama primary → Gemini → Groq → DeepSeek) ────────────────
_VI_MAP = {'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ắ':'a','ặ':'a','ẳ':'a','ẵ':'a',
           'ầ':'a','ấ':'a','ẩ':'a','ẫ':'a','ậ':'a','â':'a','è':'e','é':'e','ẻ':'e','ẽ':'e',
           'ẹ':'e','ê':'e','ề':'e','ế':'e','ể':'e','ễ':'e','ệ':'e','ì':'i','í':'i','ỉ':'i',
           'ĩ':'i','ị':'i','ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ồ':'o','ố':'o',
           'ổ':'o','ỗ':'o','ộ':'o','ơ':'o','ờ':'o','ớ':'o','ở':'o','ỡ':'o','ợ':'o','ù':'u',
           'ú':'u','ủ':'u','ũ':'u','ụ':'u','ư':'u','ừ':'u','ứ':'u','ử':'u','ữ':'u','ự':'u',
           'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y','đ':'d'}

def _vi_slug(text):
    s = text.lower()
    s = ''.join(_VI_MAP.get(c, c) for c in s)
    s = re.sub(r'[^a-z0-9\s-]', '', s).strip()
    s = re.sub(r'\s+', '-', s)[:60].rstrip('-')
    return s

def _build_post(title_vi, raw_md, topic):
    return {
        "title_vi": title_vi,
        "body_md": raw_md,
        "excerpt_vi": raw_md[:155].replace('\n', ' ').strip(),
        "slug_vi": _vi_slug(title_vi),
        "faq_list": [],
        "meta_description": f"{title_vi} - Tìm hiểu về sâm Ngọc Linh TA, saponin MR2."[:160],
        "image_prompt": f"Macro cinematic photo of Ngoc Linh Vietnamese ginseng root, {topic} theme, dark forest, Hasselblad 8K",
        "compliance_check": "PASS (Ollama)"
    }

def generate_content(title_vi, topic, trend_context=""):
    # ── 1. Ollama (primary — local, free, always available) ──────────────────
    try:
        log.info("[Ollama] Generating (primary)...")
        ollama_prompt = f"""Viết bài blog tiếng Việt 1500 từ về chủ đề: "{title_vi}"
Liên quan đến sâm Ngọc Linh, thành phần saponin MR2 Majonoside-R2, hoạt chất quý.
KHÔNG dùng: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%.
Dùng: hỗ trợ, cải thiện, nghiên cứu cho thấy, dữ liệu khoa học.
Viết bằng markdown: ## H2, ### H3, bullet -. Chỉ viết nội dung bài, không giải thích thêm."""
        raw_md = _call_ollama(ollama_prompt).strip()
        raw_md = ''.join(c if ord(c) >= 32 or c in '\n\t' else ' ' for c in raw_md)
        if len(raw_md) < 300:
            raise ValueError(f"Output too short: {len(raw_md)} chars")
        data = _build_post(title_vi, raw_md, topic)
        log.info(f"[Ollama] OK — {len(raw_md)} chars")
        return data
    except Exception as oe:
        log.warning(f"[Ollama] Failed: {oe}")

    # ── 2. Gemini (cloud fallback — needs valid API key) ──────────────────────
    context_block = f"\nBối cảnh xu hướng mới nhất: {trend_context}" if trend_context else ""
    prompt = f"""Bạn là chuyên gia dược liệu học và content SEO chuyên nghiệp cho thương hiệu TA Sâm Ngọc Linh.{context_block}

Viết bài blog chuẩn SEO bằng tiếng Việt, 2500+ từ, chủ đề: "{title_vi}"
Topic category: {topic}

Yêu cầu bắt buộc:
1. Cấu trúc: H1 → H2 intro hook (150-200 từ) → 5-7 H2 sections → FAQs (6-8 Q&A) → CTA
2. Mỗi H2 có 2-3 H3 sub-sections, bullet points 3-5 điểm/section
3. TUYỆT ĐỐI KHÔNG dùng: điều trị, chữa khỏi, công dụng (y học), hết bệnh
4. Dùng: hỗ trợ, cải thiện, giúp duy trì, theo nghiên cứu, dữ liệu cho thấy
5. Cite peer-reviewed khi dùng số liệu. Author: "Đội Ngũ Nghiên Cứu TA" — KHÔNG bịa tên bác sĩ

Output PHẢI là JSON hợp lệ (không markdown code block):
{{"title_vi":"...","body_md":"...","excerpt_vi":"...","faq_list":[{{"q":"...","a":"..."}}],"meta_description":"...","image_prompt":"...","compliance_check":"PASS hoặc FAIL: lý do"}}"""

    try:
        from google import genai
        client = genai.Client(api_key=GEMINI_KEY)
        log.info("[Gemini] Trying as fallback...")
        resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        raw = re.sub(r'^```json\s*', '', resp.text.strip())
        raw = re.sub(r'```\s*$', '', raw).strip()
        data = json.loads(raw)
        log.info(f"[Gemini] OK: {data['title_vi'][:60]}")
        return data
    except Exception as ge:
        log.warning(f"[Gemini] Failed: {ge}")

    # ── 3. Groq / DeepSeek ───────────────────────────────────────────────────
    for fb_name, fb_fn in [
        ("Groq", lambda: _call_groq(prompt) if GROQ_KEY else (_ for _ in ()).throw(ValueError("no key"))),
        ("DeepSeek", lambda: _call_deepseek(prompt)),
    ]:
        try:
            log.info(f"[{fb_name}] Trying...")
            raw = fb_fn().strip()
            raw = re.sub(r'^```json\s*', '', raw)
            raw = re.sub(r'```\s*$', '', raw).strip()
            data = json.loads(raw)
            log.info(f"[{fb_name}] OK: {data.get('title_vi','')[:60]}")
            return data
        except Exception as fe:
            log.warning(f"[{fb_name}] Failed: {fe}")

    raise RuntimeError("All AI providers failed — check Ollama is running: ollama serve")


# ─── COMPLIANCE CHECK ──────────────────────────────────────────────────────
def compliance_check(body_md):
    found = [w for w in FORBIDDEN if w.lower() in body_md.lower()]
    if found:
        return f"FAIL: từ cấm = {found}"
    return "PASS"

# ─── SLUG GENERATOR ────────────────────────────────────────────────────────
def make_slug(text, fallback=""):
    if fallback:
        return fallback[:60].rstrip("-")
    # Normalize Vietnamese
    import unicodedata
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text.strip())
    text = re.sub(r"-{2,}", "-", text)
    return text[:60].rstrip("-")

# ─── GENERATE FEATURED IMAGE ──────────────────────────────────────────────
def generate_image(title_vi, slug, topic):
    try:
        from PIL import Image, ImageDraw, ImageFont

        BG = {"science": (10, 40, 30), "lifestyle": (30, 20, 10), "heritage": (20, 15, 35)}
        ACCENT = {"science": (200, 230, 100), "lifestyle": (255, 180, 60), "heritage": (220, 180, 255)}
        bg = BG.get(topic, (10, 40, 30))
        accent = ACCENT.get(topic, (200, 230, 100))

        img = Image.new("RGB", (1200, 675), color=bg)
        draw = ImageDraw.Draw(img)

        # Gradient overlay
        for y in range(675):
            alpha = int(y / 675 * 60)
            draw.line([(0, y), (1200, y)], fill=tuple(max(0, c - alpha//3) for c in bg))

        # Border lines
        draw.rectangle([(20, 20), (1180, 655)], outline=accent, width=2)
        draw.rectangle([(30, 30), (1170, 645)], outline=tuple(c//2 for c in accent), width=1)

        # Load fonts
        try:
            font_big = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 52)
            font_med = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 28)
            font_sm  = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 20)
        except:
            font_big = font_med = font_sm = ImageFont.load_default()

        # Wrap title
        words = title_vi.split()
        lines, line = [], []
        for w in words:
            if len(" ".join(line + [w])) < 38:
                line.append(w)
            else:
                lines.append(" ".join(line))
                line = [w]
        if line:
            lines.append(" ".join(line))

        y_start = max(150, 337 - len(lines) * 60 // 2)
        for i, ln in enumerate(lines[:3]):
            draw.text((60, y_start + i * 68), ln, fill=accent, font=font_big)

        # Labels
        label = {"science": "KHOA HỌC", "lifestyle": "ĐỜI SỐNG", "heritage": "DI SẢN"}.get(topic, topic.upper())
        draw.text((60, 580), f"TA SÂM NGỌC LINH  |  {label}", fill=(180, 180, 160), font=font_sm)
        draw.text((60, 610), "tasamngoclinh.com", fill=tuple(c//2 for c in accent), font=font_sm)

        out_dir = Path(__file__).parent
        filename = f"featured-{slug[:40]}.webp"
        filepath = out_dir / filename
        img.save(filepath, "WEBP", quality=80)
        log.info(f"[Image] Saved: {filepath} (1200×675px)")
        return str(filepath), filename
    except Exception as e:
        log.warning(f"[Image] Failed: {e}")
        return None, None

# ─── UPLOAD SUPABASE STORAGE ──────────────────────────────────────────────
def upload_image_supabase(local_path, filename):
    if not local_path or not Path(local_path).exists():
        return ""
    try:
        import requests
        with open(local_path, "rb") as f:
            data = f.read()
        url = f"{SUPABASE_URL}/storage/v1/object/blog-images/{filename}"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "image/webp",
        }
        r = requests.post(url, data=data, headers=headers, timeout=20)
        if r.status_code in (200, 201):
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/blog-images/{filename}"
            log.info(f"[Storage] Uploaded: {public_url}")
            return public_url
        else:
            log.warning(f"[Storage] Upload failed {r.status_code}: {r.text[:200]}")
            return ""
    except Exception as e:
        log.warning(f"[Storage] {e}")
        return ""

# ─── INSERT SUPABASE DB ───────────────────────────────────────────────────
def insert_supabase(post_data, slug, topic, featured_image_url, compliance):
    import requests
    now = datetime.utcnow().isoformat() + "Z"
    post_id = str(uuid.uuid4())

    faq_json = post_data.get("faq_list", [])

    payload = {
        "id": post_id,
        "title": post_data["title_vi"],
        "title_vi": post_data["title_vi"],
        "slug": slug,
        "slug_vi": slug,
        "body": post_data["body_md"],
        "excerpt": post_data.get("excerpt_vi", "")[:160],
        "excerpt_vi": post_data.get("excerpt_vi", "")[:160],
        "featured_image_url": featured_image_url,
        "category": topic,
        "published": False,
        "created_at": now,
        "meta_description": post_data.get("meta_description", "")[:160],
        "compliance_check": compliance,
        "author": "Đội Ngũ Nghiên Cứu TA",
    }

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }

    log.info("[Supabase] Inserting post...")
    r = requests.post(f"{SUPABASE_URL}/rest/v1/blog_posts", json=payload, headers=headers, timeout=15)

    if r.status_code == 201:
        result = r.json()
        inserted = result[0] if isinstance(result, list) else result
        log.info(f"[Supabase] OK — id={inserted.get('id','?')}")
        return inserted.get("id", post_id), slug
    else:
        log.error(f"[Supabase] {r.status_code}: {r.text[:300]}")
        raise RuntimeError(f"Supabase insert failed: {r.status_code}")

# ─── TRIGGER N8N (optional) ───────────────────────────────────────────────
def trigger_n8n(title, topic, blog_id):
    try:
        import requests
        payload = {
            "topic": title,
            "category": topic,
            "blog_id": blog_id,
            "source": "auto_blog_script"
        }
        r = requests.post(N8N_URL, json=payload, timeout=5)
        log.info(f"[n8n] Triggered: {r.status_code}")
        return r.status_code in (200, 201, 202)
    except Exception as e:
        log.warning(f"[n8n] Not available (OK if n8n offline): {e}")
        return False

# ─── TELEGRAM REPORT ──────────────────────────────────────────────────────
def send_telegram(title, topic, slug, blog_id, compliance, n8n_ok):
    if not TG_TOKEN or not TG_CHAT:
        log.warning("[Telegram] No token/chat_id — skip")
        return
    try:
        import requests
        status_icon = "✅" if compliance == "PASS" else "⚠️"
        n8n_icon = "✅" if n8n_ok else "⏸️"
        msg = f"""{status_icon} BÀI VIẾT MỚI — {topic.upper()}

📌 {title}
🏷️ Topic: {topic}
📝 ID: {blog_id}
🆔 Slug: {slug}
📋 Compliance: {compliance}
🔗 n8n: {n8n_icon}

🔗 Preview: https://tasamngoclinh.com/blog/{slug}
🔗 Admin CMS: https://tasamngoclinh.com/gate-vkd-control-2026/cms

⏳ Đợi Joe duyệt → publish
---
Auto Blog | {datetime.now().strftime('%d/%m %H:%M')}"""

        r = requests.post(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT, "text": msg},
            timeout=10
        )
        if r.status_code == 200:
            log.info("[Telegram] Sent ✅")
        else:
            log.warning(f"[Telegram] {r.status_code}: {r.text[:100]}")
    except Exception as e:
        log.warning(f"[Telegram] {e}")

# ─── MAIN ─────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Auto Blog Generator — TA Sâm Ngọc Linh")
    parser.add_argument("--topic", choices=["science","lifestyle","heritage"], default="science")
    parser.add_argument("--title", default="", help="Override title (optional)")
    parser.add_argument("--scrape", action="store_true", help="Try to scrape trending topic first")
    args = parser.parse_args()

    log.info("=" * 60)
    log.info(f"AUTO BLOG — topic={args.topic} | {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    log.info("=" * 60)

    # 1. Pick title/slug
    if args.title:
        title_vi = args.title
        slug = make_slug(title_vi)
    else:
        title_vi, slug = get_next_topic(args.topic)
        log.info(f"[Queue] Title: {title_vi}")
        log.info(f"[Queue] Slug:  {slug}")

    # 2. Scrape trends (optional context)
    trend_ctx = ""
    if args.scrape:
        trend_ctx = scrape_with_scrapegraph("sâm Ngọc Linh mới nhất") or scrape_trending_topic() or ""

    # 3. Generate content via Gemini
    post_data = generate_content(title_vi, args.topic, trend_ctx)

    # 4. Compliance check
    compliance = compliance_check(post_data.get("body_md", ""))
    if compliance.startswith("FAIL"):
        log.warning(f"[Compliance] {compliance}")
        log.warning("[Compliance] Bài DRAFT — Joe verify trước khi publish")

    # 5. Finalize title/slug from generated data
    final_title = post_data.get("title_vi", title_vi)
    if not args.title and not slug:
        slug = make_slug(final_title)

    # 6. Generate image
    img_path, img_filename = generate_image(final_title, slug, args.topic)

    # 7. Upload image to Supabase Storage
    image_url = upload_image_supabase(img_path, img_filename) if img_path else ""

    # 8. Insert to Supabase DB
    blog_id, final_slug = insert_supabase(post_data, slug, args.topic, image_url, compliance)

    # 9. Trigger n8n (non-blocking)
    n8n_ok = trigger_n8n(final_title, args.topic, blog_id)

    # 10. Telegram report
    send_telegram(final_title, args.topic, final_slug, blog_id, compliance, n8n_ok)

    # 11. Summary
    log.info("")
    log.info("=" * 60)
    log.info("✅ HOÀN THÀNH")
    log.info(f"   Title:   {final_title[:60]}")
    log.info(f"   Slug:    {final_slug}")
    log.info(f"   ID:      {blog_id}")
    log.info(f"   Compliance: {compliance}")
    log.info(f"   Image:   {image_url or 'none'}")
    log.info(f"   Preview: https://tasamngoclinh.com/blog/{final_slug}")
    log.info(f"   Admin:   https://tasamngoclinh.com/gate-vkd-control-2026/cms")
    log.info("=" * 60)

if __name__ == "__main__":
    main()
