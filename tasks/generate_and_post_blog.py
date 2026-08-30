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
        # Mở rộng 2025–2026
        ("Chỉ Số ORAC Của Sâm Ngọc Linh: Sức Chống Oxy Hoá Đo Được", "orac-sam-ngoc-linh-suc-chong-oxy-hoa"),
        ("Ginsenoside Rb1 Và Rg1: Hai Hoạt Chất Nền Trong Sâm Việt", "ginsenoside-rb1-rg1-sam-ngoc-linh-viet"),
        ("Bioavailability Của Saponin Sâm Ngọc Linh Sau Hấp Thu Đường Uống", "bioavailability-saponin-sam-ngoc-linh-duong-uong"),
        ("Quy Trình VietGAP Áp Dụng Cho Vùng Trồng Sâm Ngọc Linh", "vietgap-vung-trong-sam-ngoc-linh-tieu-chuan"),
        ("Phân Tích HPLC Định Lượng Saponin Sâm Ngọc Linh: Phương Pháp Chuẩn", "hplc-dinh-luong-saponin-sam-ngoc-linh"),
        ("Sâm Ngọc Linh Và Căng Thẳng Oxy Hoá: Cơ Chế Phân Tử", "sam-ngoc-linh-can-thang-oxy-hoa-co-che-phan-tu"),
        ("Hàm Lượng Saponin Theo Tuổi Củ: Sâm 5 Năm vs 10 Năm", "ham-luong-saponin-tuoi-cu-sam-ngoc-linh"),
        ("Tương Tác Của Sâm Ngọc Linh Với Hệ Vi Sinh Đường Ruột", "sam-ngoc-linh-he-vi-sinh-duong-ruot-nghien-cuu"),
        ("Nghiên Cứu Adaptogen: Sâm Ngọc Linh Trong Danh Mục Thực Vật Bổ Sung", "sam-ngoc-linh-adaptogen-thuc-vat-bo-sung"),
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
        # Mở rộng
        ("Sâm Ngọc Linh Sau Sinh: Những Điều Mẹ Cần Biết", "sam-ngoc-linh-sau-sinh-me-can-biet"),
        ("Kết Hợp Sâm Ngọc Linh Với Chế Độ Ăn Plant-Based", "sam-ngoc-linh-ket-hop-che-do-an-plant-based"),
        ("Uống Sâm Ngọc Linh Buổi Sáng vs Tối: Khoa Học Giải Thích", "uong-sam-ngoc-linh-buoi-sang-vs-toi-khoa-hoc"),
        ("Sâm Ngọc Linh Và Thể Thao: Hỗ Trợ Phục Hồi Cơ Bắp", "sam-ngoc-linh-the-thao-ho-tro-phuc-hoi-co-bap"),
        ("Lịch Uống Sâm Ngọc Linh Theo Mùa: Xuân Hạ Thu Đông", "lich-uong-sam-ngoc-linh-theo-mua-xuan-ha-thu-dong"),
        ("Sâm Ngọc Linh Cho Người Trung Niên 40–60 Tuổi", "sam-ngoc-linh-nguoi-trung-nien-40-60-tuoi"),
        ("Cách Pha Trà Sâm Ngọc Linh Chuẩn Vị Không Mất Hoạt Chất", "pha-tra-sam-ngoc-linh-chuan-vi-khong-mat-hoat-chat"),
        ("Set Quà Sâm Ngọc Linh Doanh Nghiệp: Lựa Chọn Cho Đối Tác", "set-qua-sam-ngoc-linh-doanh-nghiep-doi-tac"),
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
        # Mở rộng
        ("Mưa Rừng Ngọc Linh: Khí Hậu Đặc Thù Nuôi Dưỡng Củ Sâm", "mua-rung-ngoc-linh-khi-hau-dac-thu-nuoi-duong-sam"),
        ("Độ Cao 1500m: Tại Sao Sâm Ngọc Linh Không Thể Trồng Nơi Khác", "do-cao-1500m-sam-ngoc-linh-khong-the-trong-noi-khac"),
        ("Người Xơ Đăng Và Bí Quyết Bảo Tồn Sâm Rừng Qua Thế Kỷ", "nguoi-xo-dang-bi-quyet-bao-ton-sam-rung"),
        ("Câu Chuyện 40 Năm Nhân Giống Sâm Ngọc Linh Ở Kon Tum", "40-nam-nhan-giong-sam-ngoc-linh-kon-tum"),
        ("Khổng Lồ Dưới Rễ Núi: Củ Sâm 20 Năm Tuổi Trị Giá Bao Nhiêu?", "cu-sam-ngoc-linh-20-nam-tuoi-tri-gia"),
        ("Những Tháng Mùa Mưa Tây Nguyên: Mùa Vàng Của Sâm Ngọc Linh", "mua-mua-tay-nguyen-mua-vang-sam-ngoc-linh"),
    ],
    "kgc": [
        ("Sâm Ngọc Linh TA vs KGC Hàn Quốc: So Sánh Khách Quan", "sam-ngoc-linh-ta-vs-kgc-han-quoc-so-sanh"),
        ("Tiêu Chuẩn Premium Sâm Việt: Học Từ Quy Trình KGC Hàn Quốc", "tieu-chuan-premium-sam-viet-hoc-tu-kgc-han-quoc"),
        ("Certificate of Origin Sâm Ngọc Linh TA: Pháp Lý & Truy Xuất", "certificate-of-origin-sam-ngoc-linh-ta-phap-ly"),
        ("Đóng Gói Cao Cấp Sâm Ngọc Linh: Từ Vỏ Hộp Đến Tem Hologram", "dong-goi-cao-cap-sam-ngoc-linh-tem-hologram"),
        ("Sâm Ngọc Linh Dạng Viên Nén vs Tươi Nguyên Củ: Đâu Là Tốt Hơn", "sam-ngoc-linh-vien-nen-vs-tuoi-nguyen-cu"),
        ("Chuỗi Cung Ứng Sâm Ngọc Linh TA: Farm-to-Table Minh Bạch", "chuoi-cung-ung-sam-ngoc-linh-ta-farm-to-table"),
        ("QR Code Truy Xuất Nguồn Gốc: Cách TA Bảo Vệ Người Mua", "qr-code-truy-xuat-nguon-goc-sam-ngoc-linh-ta"),
        ("Sâm Ngọc Linh Xuất Khẩu: Tiêu Chuẩn Và Thị Trường Tiềm Năng", "sam-ngoc-linh-xuat-khau-tieu-chuan-thi-truong"),
        ("Từ Vườn Ngọc Linh Đến Hộp Quà Premium: Hành Trình Kiểm Soát Chất Lượng", "vuon-ngoc-linh-hop-qua-premium-kiem-soat-chat-luong"),
        ("Thị Trường Sâm Cao Cấp 2025: Người Mua Thông Minh Cần Biết Gì", "thi-truong-sam-cao-cap-2025-nguoi-mua-thong-minh"),
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
    INTERNAL_LINKS = {
        "science":   "[Xem sản phẩm sâm tươi TA](https://tasamngoclinh.com/san-pham)",
        "lifestyle": "[Tham khảo set quà TA](https://tasamngoclinh.com/qua-tang)",
        "heritage":  "[Tìm hiểu vườn sâm Nhà Khánh](https://tasamngoclinh.com/gioi-thieu)",
        "kgc":       "[So sánh sản phẩm TA](https://tasamngoclinh.com/san-pham)",
    }
    link_hint = INTERNAL_LINKS.get(topic, "")

    try:
        log.info("[Ollama] Generating (primary)...")
        ollama_prompt = f"""Viết bài blog tiếng Việt 1500–2000 từ về chủ đề: "{title_vi}"
Thương hiệu: TA Sâm Ngọc Linh — vườn hữu cơ Trà Linh, Kon Tum.

CẤU TRÚC BẮT BUỘC (markdown):
## [Tên section 1]
### [Sub-section 1.1]
Nội dung 120–150 từ...
> **Lưu ý khoa học:** [1 câu dữ liệu nghiên cứu thực — không bịa số]

### [Sub-section 1.2]
- Điểm 1
- Điểm 2
- Điểm 3

## [Tên section 2]
...

## Câu Hỏi Thường Gặp
**Q: Câu hỏi 1?**
A: Trả lời...

## Kết Luận
[2–3 câu tổng kết + CTA nhẹ]
{link_hint}

QUY TẮC:
- KHÔNG dùng: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%
- DÙNG: hỗ trợ, cải thiện, theo nghiên cứu, dữ liệu cho thấy
- Ít nhất 4 section H2, mỗi section có 2 H3
- Chỉ viết nội dung bài, không giải thích gì thêm"""
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
    prompt = f"""Bạn là Chuyên gia Biên tập Cao cấp cho thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum).{context_block}

Viết bài blog tiếng Việt 2500+ từ, chuẩn SEO, chủ đề: "{title_vi}"
Topic: {topic}

═══ CHUẨN ĐỊNH DẠNG BẮT BUỘC ═══

**METADATA ĐẦU BÀI:**
- Title SEO (55–65 ký tự, chứa từ khoá chính)
- Excerpt 2–3 câu đắt giá
- Reading time (ước tính)

**CẤU TRÚC:**
# [Title H1]

[Đoạn intro hook 150–200 từ — giá trị lớn nhất độc giả nhận được]

---
📋 **Mục lục**
- [Tên section 1](#s1)
- [Tên section 2](#s2)
...
---

## 🔬 [Section 1 — H2 có icon]
### [Sub-section 1.1]
Nội dung 100-150 từ, đoạn tối đa 4 dòng. Bôi đậm thuật ngữ khoa học.

> 💡 **Lưu ý chuyên gia:** [1 câu insight thực — không bịa số]

### [Sub-section 1.2]
- Điểm 1
- Điểm 2
- Điểm 3

## 📊 [Section 2 — Bảng so sánh nếu phù hợp]
| Tiêu chí | Sâm Ngọc Linh TA | So sánh |
|---|---|---|
| ... | ... | ... |

[Lặp lại 5–7 H2 sections]

---
> ⚠️ **Phân biệt sâm thật:** [1–2 câu cảnh báo nếu topic phù hợp]
---

## ❓ Câu Hỏi Thường Gặp
**Q: Câu hỏi 1?**
A: Trả lời ngắn gọn...

## ✅ Kết Luận
[2–3 câu tổng kết ngắn]

🛒 **Xem sản phẩm sâm Ngọc Linh TA:** [link sản phẩm phù hợp theo topic {topic}]

═══ QUY TẮC NỘI DUNG ═══
- TUYỆT ĐỐI KHÔNG: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%, bảo đảm khỏi
- DÙNG: hỗ trợ, cải thiện, theo nghiên cứu, dữ liệu cho thấy, nghiên cứu khoa học ghi nhận
- Số liệu phải có cơ sở thực (không bịa) — cite nguồn rõ ràng
- Không bịa tên bác sĩ/chuyên gia. Dùng "nghiên cứu viên", "Đội Ngũ Nghiên Cứu TA"
- Mỗi đoạn văn ≤ 4 dòng

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
    parser.add_argument("--topic", choices=["science","lifestyle","heritage","kgc"], default="science")
    parser.add_argument("--title", default="", help="Override title (optional)")
    parser.add_argument("--scrape", action="store_true", help="Scrape trending topic then generate")
    parser.add_argument("--auto", action="store_true", help="Round-robin across all categories automatically")
    args = parser.parse_args()

    # --auto: pick next category round-robin
    if args.auto:
        _all_cats = ["science", "lifestyle", "heritage", "kgc"]
        _state = {}
        if STATE_FILE.exists():
            with open(STATE_FILE, encoding="utf-8") as _sf:
                _state = json.load(_sf)
        _auto_idx = _state.get("__auto_cat__", 0)
        args.topic = _all_cats[_auto_idx % len(_all_cats)]
        _state["__auto_cat__"] = (_auto_idx + 1) % len(_all_cats)
        with open(STATE_FILE, "w", encoding="utf-8") as _sf:
            json.dump(_state, _sf)
        log.info(f"[Auto] Round-robin category: {args.topic}")

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
