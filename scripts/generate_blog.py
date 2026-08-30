#!/usr/bin/env python3
"""
TA Blog Engine v5.0
Dynamic Subject Matrix · HTML TOC · Social Share · Video Script · Supabase · Telegram
"""

import os, sys, json, uuid, re, argparse, logging
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

# ─── PATHS ────────────────────────────────────────────────────────────────────
ROOT         = Path(__file__).parent.parent          # ta_production/project/
ENV_FILE     = ROOT.parent.parent / "ta_production" / "project" / ".env"
STATE_FILE   = ROOT / "scripts" / "blog_state.json"
VIDEO_DIR    = ROOT / "content" / "video_scripts"
LOG_FILE     = ROOT / "scripts" / "blog_engine.log"

VIDEO_DIR.mkdir(parents=True, exist_ok=True)

# ─── LOGGING ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)

# ─── ENV ──────────────────────────────────────────────────────────────────────
def _load_env(path):
    if not Path(path).exists():
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

_load_env(ENV_FILE)
_load_env(ROOT.parent.parent / ".env")   # site root — has GROQ/DEEPSEEK keys

SUPA_URL  = os.environ.get("VITE_SUPABASE_URL", "")
SUPA_KEY  = os.environ.get("VITE_SUPABASE_ANON_KEY", "")
GEMINI_KEY = os.environ.get("VITE_GEMINI_API_KEY", "")
GROQ_KEY  = os.environ.get("GROQ_API_KEY", "")
TG_TOKEN  = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT   = os.environ.get("TELEGRAM_CHAT_ID", "")
N8N_URL   = os.environ.get("N8N_WEBHOOK_URL", "http://localhost:5678/webhook/sam-ngoc-linh-publish")

# ─── FORBIDDEN WORDS (compliance) ─────────────────────────────────────────────
FORBIDDEN = [
    "điều trị", "chữa khỏi", "công dụng (y học)", "hết bệnh",
    "hiệu quả 100%", "chắc chắn khỏe", "bảo đảm khỏi",
]

# ─── DYNAMIC SUBJECT MATRIX ───────────────────────────────────────────────────
MATRIX = {
    "A": {
        "label": "Khoa Học & Phân Biệt Sâm",
        "icon": "🔬",
        "cta_html": '<p>🛒 Xem sản phẩm đã kiểm định: <a href="/san-pham" class="text-emerald-700 underline font-semibold">Sâm Ngọc Linh TA chính hãng</a> — kết quả HPLC minh bạch.</p>',
        "internal_links": {
            "sản phẩm sâm": '/san-pham',
            "vườn sâm": '/gioi-thieu',
            "kiểm định": '/gioi-thieu',
        },
        "topics": [
            ("52 Saponin Sâm Ngọc Linh: Phân Tích Chuyên Sâu Và Cách Nhận Biết", "52-saponin-sam-ngoc-linh-phan-tich-nhan-biet"),
            ("Majonoside-R2: Hoạt Chất Độc Quyền Chỉ Có Ở Sâm Ngọc Linh Việt Nam", "majonoside-r2-hoat-chat-doc-quyen-sam-ngoc-linh"),
            ("Kiểm Định Saponin Sâm Ngọc Linh: Tiêu Chuẩn Phòng Lab HPLC", "kiem-dinh-saponin-sam-ngoc-linh-tieu-chuan-hplc"),
            ("Phân Biệt Sâm Ngọc Linh Thật Giả Qua Mắt Sâm Và Vân Củ", "phan-biet-sam-ngoc-linh-that-gia-mat-sam-van-cu"),
            ("Hàm Lượng Saponin Theo Tuổi Củ: Sâm 5 Năm vs 10 Năm", "ham-luong-saponin-tuoi-cu-5-nam-vs-10-nam"),
            ("Sâm Ngọc Linh vs Hồng Sâm Hàn: So Sánh 52 Saponin Chi Tiết", "sam-ngoc-linh-vs-hong-sam-han-so-sanh-saponin"),
            ("Ginsenoside Rb1 Và Rg1: Hai Nền Tảng Hoạt Chất Sâm Việt", "ginsenoside-rb1-rg1-nen-tang-hoat-chat-sam-viet"),
            ("Quy Trình VietGAP Áp Dụng Cho Vùng Trồng Sâm Ngọc Linh", "vietgap-vung-trong-sam-ngoc-linh"),
            ("Chỉ Số ORAC Sâm Ngọc Linh: Sức Chống Oxy Hoá Được Đo Thực Tế", "orac-sam-ngoc-linh-chong-oxy-hoa"),
            ("BRC Standard và Kiểm Soát Chất Lượng Sâm Ngọc Linh TA", "brc-standard-kiem-soat-chat-luong-sam-ta"),
        ],
    },
    "B": {
        "label": "Bài Thuốc, Sức Khỏe & Lifestyle",
        "icon": "🌿",
        "cta_html": '<p>🛒 Đặt ngay: <a href="/san-pham/sam-ngam-mat-ong" class="text-emerald-700 underline font-semibold">Sâm ngâm mật mỡ gà TA</a> và <a href="/san-pham/tra-sam-ngoc-linh" class="text-emerald-700 underline font-semibold">Trà sâm Ngọc Linh</a> — giao tận nơi toàn quốc.</p>',
        "internal_links": {
            "sâm ngâm mật": '/san-pham/sam-ngam-mat-ong',
            "trà sâm": '/san-pham/tra-sam-ngoc-linh',
            "rượu sâm": '/san-pham',
            "set quà": '/qua-tang',
        },
        "topics": [
            ("Sâm Ngâm Mật Mỡ Gà: Công Thức Chuẩn Và Cách Bảo Quản Đúng", "sam-ngam-mat-mo-ga-cong-thuc-chuan-bao-quan"),
            ("Trà Sâm Ngọc Linh: Cách Pha Chuẩn Vị Không Mất Hoạt Chất", "tra-sam-ngoc-linh-cach-pha-chuan-vi"),
            ("Rượu Sâm Ngọc Linh Ngâm Đúng Cách: Từng Bước Chi Tiết", "ruou-sam-ngoc-linh-ngam-dung-cach-tung-buoc"),
            ("Nghi Thức Uống Sâm: Từ Triều Đình Đến Bàn Ăn Người Việt", "nghi-thuc-uong-sam-ngoc-linh-truyen-thong"),
            ("Liều Lượng Sâm Ngọc Linh Phù Hợp Cho Người Cao Tuổi", "lieu-luong-sam-ngoc-linh-nguoi-cao-tuoi"),
            ("Sâm Ngọc Linh Cho Phụ Nữ Sau Sinh: Những Điều Cần Biết", "sam-ngoc-linh-phu-nu-sau-sinh-can-biet"),
            ("Sâm Và Thể Thao: Hỗ Trợ Phục Hồi Cơ Bắp Sau Tập Luyện", "sam-ngoc-linh-the-thao-phuc-hoi-co-bap"),
            ("Lịch Uống Sâm Theo Mùa: Xuân Hạ Thu Đông Dùng Khác Nhau", "lich-uong-sam-ngoc-linh-theo-mua"),
            ("Những Sai Lầm Phổ Biến Khi Sử Dụng Sâm Ngọc Linh", "sai-lam-pho-bien-dung-sam-ngoc-linh"),
            ("Kết Hợp Sâm Ngọc Linh Với Chế Độ Ăn Plant-Based", "sam-ngoc-linh-ket-hop-che-do-plant-based"),
        ],
    },
    "C": {
        "label": "Nhật Ký Vườn Sâm & Văn Hóa",
        "icon": "🏔️",
        "cta_html": '<p>🌿 Tìm hiểu thêm: <a href="/gioi-thieu" class="text-emerald-700 underline font-semibold">Vườn Sâm Nhà Khánh</a> — canh tác hữu cơ chuẩn rừng tại núi Ngọc Linh &gt;1.800m.</p>',
        "internal_links": {
            "vườn sâm nhà khánh": '/gioi-thieu',
            "trà linh": '/gioi-thieu',
            "kon tum": '/gioi-thieu',
            "nguồn gốc": '/gioi-thieu',
        },
        "topics": [
            ("Núi Ngọc Linh 2.598m: Địa Lý Kỳ Diệu Tạo Ra Sâm Quý Nhất", "nui-ngoc-linh-dia-ly-ky-dieu-sam-quy-nhat"),
            ("Vườn Sâm Nhà Khánh: Mô Hình Canh Tác Hữu Cơ Chuẩn Rừng", "vuon-sam-nha-khanh-canh-tac-huu-co-chuan-rung"),
            ("Từ Hạt Sâm Đến Củ Sâm 7 Năm: Hành Trình Không Phân Bón Hóa Học", "hat-sam-den-cu-sam-7-nam-khong-phan-bon"),
            ("Nhật Ký Kỹ Sư Vườn Sâm: Mùa Mưa Tây Nguyên Và Thách Thức", "nhat-ky-ky-su-vuon-sam-mua-mua-tay-nguyen"),
            ("Người Xơ Đăng Và Bí Quyết Bảo Tồn Sâm Rừng Qua Thế Kỷ", "nguoi-xo-dang-bi-quyet-bao-ton-sam-rung"),
            ("Trà Linh — Thủ Phủ Sâm Ngọc Linh: Hướng Dẫn Đến Mua Sâm Thật", "tra-linh-thu-phu-sam-ngoc-linh-huong-dan"),
            ("Độ Cao 1.800m: Tại Sao Sâm Ngọc Linh Không Thể Trồng Nơi Khác", "do-cao-1800m-sam-ngoc-linh-khong-trong-noi-khac"),
            ("Mưa Rừng Ngọc Linh: Khí Hậu Đặc Thù Nuôi Dưỡng Củ Sâm", "mua-rung-ngoc-linh-khi-hau-dac-thu-nuoi-duong"),
            ("40 Năm Nhân Giống Sâm Ngọc Linh Ở Kon Tum: Câu Chuyện Bảo Tồn", "40-nam-nhan-giong-sam-ngoc-linh-kon-tum"),
            ("Biến Đổi Khí Hậu Và Giải Pháp Bền Vững Cho Vùng Ngọc Linh", "bien-doi-khi-hau-giai-phap-ben-vung-ngoc-linh"),
        ],
    },
    "D": {
        "label": "Quà Tặng Doanh Nghiệp & Hợp Tác",
        "icon": "🎁",
        "cta_html": '<p>📦 Liên hệ tư vấn: <a href="/hop-tac" class="text-emerald-700 underline font-semibold">Hợp tác & Đại lý TA</a> — chính sách phân phối minh bạch, hỗ trợ marketing.</p>',
        "internal_links": {
            "set quà": '/qua-tang',
            "hợp tác": '/hop-tac',
            "đại lý": '/hop-tac',
            "sản phẩm cao cấp": '/san-pham',
        },
        "topics": [
            ("Set Quà Sâm Ngọc Linh Doanh Nghiệp: Tiêu Chuẩn Biếu Tặng 2025", "set-qua-sam-ngoc-linh-doanh-nghiep-2025"),
            ("Sâm Ngọc Linh TA vs KGC Hàn Quốc: So Sánh Khách Quan Cho Nhà Mua", "sam-ta-vs-kgc-han-quoc-so-sanh-khach-quan"),
            ("QR Code Truy Xuất Nguồn Gốc: Minh Bạch Từ Vườn Đến Tay Người Mua", "qr-code-truy-xuat-nguon-goc-sam-ngoc-linh-ta"),
            ("Chính Sách Đại Lý Sâm Ngọc Linh TA: Điều Kiện Và Ưu Đãi", "chinh-sach-dai-ly-sam-ngoc-linh-ta"),
            ("Chuỗi Cung Ứng Farm-to-Table Sâm Ngọc Linh TA: Minh Bạch 100%", "chuoi-cung-ung-farm-to-table-sam-ta"),
            ("Đóng Gói Cao Cấp Sâm Ngọc Linh: Từ Hộp Gỗ Đến Tem Hologram", "dong-goi-cao-cap-sam-ngoc-linh-tem-hologram"),
            ("Thị Trường Sâm Cao Cấp 2025: Người Mua Thông Minh Cần Biết Gì", "thi-truong-sam-cao-cap-2025-nguoi-mua"),
            ("Certificate Of Origin Sâm Ngọc Linh TA: Pháp Lý Và Truy Xuất", "certificate-of-origin-sam-ngoc-linh-ta"),
            ("Sâm Ngọc Linh Xuất Khẩu: Tiêu Chuẩn Và Thị Trường Tiềm Năng", "sam-ngoc-linh-xuat-khau-tieu-chuan-thi-truong"),
            ("Quà Tặng Ý Nghĩa Cho Đối Tác: Tại Sao Chọn Sâm Ngọc Linh TA", "qua-tang-doi-tac-tai-sao-chon-sam-ngoc-linh-ta"),
        ],
    },
}

GROUP_ORDER = ["A", "B", "C", "D"]

# ─── SLUG ─────────────────────────────────────────────────────────────────────
_VI = {'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ắ':'a','ặ':'a','ẳ':'a','ẵ':'a',
       'ầ':'a','ấ':'a','ẩ':'a','ẫ':'a','ậ':'a','â':'a','è':'e','é':'e','ẻ':'e','ẽ':'e',
       'ẹ':'e','ê':'e','ề':'e','ế':'e','ể':'e','ễ':'e','ệ':'e','ì':'i','í':'i','ỉ':'i',
       'ĩ':'i','ị':'i','ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ồ':'o','ố':'o',
       'ổ':'o','ỗ':'o','ộ':'o','ơ':'o','ờ':'o','ớ':'o','ở':'o','ỡ':'o','ợ':'o','ù':'u',
       'ú':'u','ủ':'u','ũ':'u','ụ':'u','ư':'u','ừ':'u','ứ':'u','ử':'u','ữ':'u','ự':'u',
       'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y','đ':'d'}

def _slug(text):
    s = text.lower()
    s = ''.join(_VI.get(c, c) for c in s)
    s = re.sub(r'[^a-z0-9\s-]', '', s).strip()
    s = re.sub(r'\s+', '-', s)[:65].rstrip('-')
    return s

def _reading_time(text):
    return f"{max(1, round(len(re.findall(r'\\w+', text)) / 250))} phút đọc"

# ─── STATE ────────────────────────────────────────────────────────────────────
def _load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {}

def _save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def get_next_topic(group=None):
    state = _load_state()
    if group is None:
        idx = state.get("__auto_group__", 0)
        group = GROUP_ORDER[idx % len(GROUP_ORDER)]
        state["__auto_group__"] = (idx + 1) % len(GROUP_ORDER)
    topics = MATRIX[group]["topics"]
    key = f"idx_{group}"
    tidx = state.get(key, 0)
    title, slug = topics[tidx % len(topics)]
    state[key] = (tidx + 1) % len(topics)
    _save_state(state)
    return title, slug, group

# ─── HTML BUILDERS ────────────────────────────────────────────────────────────
def build_toc(sections):
    items = ""
    for i, name in enumerate(sections, 1):
        anchor = f"sec-{i}" if name.lower() != "faq" else "sec-faq"
        items += f'<li><a href="#{anchor}" class="hover:underline hover:text-emerald-600">{i}. {name}</a></li>\n         '
    items += f'<li><a href="#sec-faq" class="hover:underline hover:text-emerald-600">{len(sections)+1}. Câu hỏi thường gặp (FAQ)</a></li>'
    return f"""<div class="toc-box p-4 bg-emerald-50/50 rounded-xl my-6 border border-emerald-100">
  <p class="font-bold text-emerald-900 text-lg mb-2 flex items-center gap-2">📋 Mục lục nội dung</p>
  <ul class="space-y-2 text-sm text-emerald-800">
         {items}
  </ul>
</div>"""

def build_social_share(slug):
    url = f"https://tasamngoclinh.com/blog/{slug}"
    enc = quote(url, safe='')
    fb = f"https://www.facebook.com/sharer/sharer.php?u={enc}"
    zl = f"https://zalo.me/share?url={enc}"
    tg = f"https://t.me/share/url?url={enc}"
    return f"""<div class="social-share-box my-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
  <p class="font-bold text-gray-700 mb-3">Chia sẻ bài viết này đến bạn bè &amp; người thân:</p>
  <div class="flex justify-center gap-3 flex-wrap">
    <a href="{fb}" target="_blank" rel="noopener" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all">📘 Facebook</a>
    <a href="{zl}" target="_blank" rel="noopener" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all">💬 Zalo</a>
    <a href="{tg}" target="_blank" rel="noopener" class="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-all">✈️ Telegram</a>
    <button onclick="navigator.clipboard.writeText(window.location.href); alert('Đã sao chép liên kết!');" class="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all cursor-pointer">🔗 Sao chép Link</button>
  </div>
</div>"""

def apply_internal_links(body, group):
    """Replace keyword mentions with clean HTML anchor tags."""
    links = MATRIX[group]["internal_links"]
    for keyword, href in links.items():
        # Only replace first occurrence to avoid wrapping already-wrapped text
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        replacement = f'<a href="{href}" class="text-emerald-700 underline font-semibold">{keyword}</a>'
        body = pattern.sub(replacement, body, count=1)
    return body

# ─── AI PROVIDERS ─────────────────────────────────────────────────────────────
def _call_ollama(prompt, model="qwen2.5:1.5b"):
    import urllib.request
    body = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode()
    req = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=body, headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read()).get("response", "")

def _call_groq(prompt):
    import urllib.request
    if not GROQ_KEY:
        raise ValueError("no GROQ_API_KEY")
    body = json.dumps({
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7, "max_tokens": 4096,
    }).encode()
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {GROQ_KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())["choices"][0]["message"]["content"]

def _call_deepseek(prompt):
    import urllib.request
    key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not key:
        raise ValueError("no DEEPSEEK_API_KEY")
    body = json.dumps({
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7, "max_tokens": 4096,
    }).encode()
    req = urllib.request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())["choices"][0]["message"]["content"]

# ─── PROMPT BUILDERS PER GROUP ────────────────────────────────────────────────
PROMPTS = {
    "A": """Viết bài blog tiếng Việt 1.500+ từ về chủ đề: "{title}"
Nhóm: Khoa Học & Phân Biệt Sâm — Thương hiệu TA Sâm Ngọc Linh, vườn hữu cơ Trà Linh Kon Tum.

CẤU TRÚC 5 PHẦN (mỗi phần ≥250 từ):
## Phần 1: Bản Chất Khoa Học
(giải thích hoạt chất, cơ chế phân tử, dữ liệu nghiên cứu thực — KHÔNG bịa số)
## Phần 2: Tiêu Chuẩn Kiểm Định
(HPLC, BRC Standard, VietGAP — giải thích quy trình cụ thể)
## Phần 3: Bảng So Sánh Dữ Liệu
(tạo bảng markdown | Tiêu chí | Sâm Ngọc Linh TA | So sánh | với ít nhất 5 hàng số liệu có căn cứ)
## Phần 4: Dấu Hiệu Phân Biệt Thực Tế
(mắt sâm, vân củ, mùi vị — mô tả chi tiết từng bước kiểm tra)
## Phần 5: Câu Hỏi Thường Gặp
(5 Q&A thực tế, mỗi câu trả lời ≥3 câu đầy đủ)

> 💡 Callout: chèn ít nhất 2 khối ghi chú "💡 Lưu ý chuyên gia:" hoặc "⚠️ Cảnh báo phân biệt sâm giả:"

QUY TẮC TUYỆT ĐỐI:
- KHÔNG: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%
- DÙNG: hỗ trợ, theo nghiên cứu, dữ liệu ghi nhận, cần tham vấn chuyên gia
- Không bịa tên bác sĩ, không bịa tên nghiên cứu — chỉ cite nguồn thực (Viện Dược liệu VN, Journal of Natural Products...)
- Chỉ viết nội dung bài, KHÔNG thêm chú thích ngoài""",

    "B": """Viết bài blog tiếng Việt 1.500+ từ về chủ đề: "{title}"
Nhóm: Bài Thuốc, Sức Khỏe & Lifestyle — Thương hiệu TA Sâm Ngọc Linh, vườn hữu cơ Trà Linh Kon Tum.

CẤU TRÚC 5 PHẦN (mỗi phần ≥250 từ):
## Phần 1: Tại Sao Phương Pháp Này Phù Hợp
(giải thích lý do chọn phương pháp, ai nên dùng, ai không nên)
## Phần 2: Nguyên Liệu & Chuẩn Bị
(liệt kê cụ thể nguyên liệu, dụng cụ, thông số — không viết chung chung)
## Phần 3: Hướng Dẫn Từng Bước Chi Tiết
(đánh số bước, mỗi bước mô tả rõ thao tác, thời gian, nhiệt độ nếu có)
## Phần 4: Bảng Liều Dùng Theo Đối Tượng
(tạo bảng markdown | Đối tượng | Liều lượng | Thời điểm | Lưu ý | với ≥4 đối tượng cụ thể)
## Phần 5: Câu Hỏi Thường Gặp
(5 Q&A thực tế, mỗi câu trả lời ≥3 câu)

> 💡 Chèn ít nhất 2 callout: "💡 Mẹo Chuyên Gia:" hoặc "⚠️ Lưu Ý Quan Trọng:"

QUY TẮC TUYỆT ĐỐI:
- KHÔNG: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%
- DÙNG: hỗ trợ, theo nghiên cứu, nên hỏi thêm chuyên gia y tế
- Không bịa thông số không có cơ sở
- Chỉ viết nội dung bài, KHÔNG thêm chú thích ngoài""",

    "C": """Viết bài blog tiếng Việt 1.500+ từ về chủ đề: "{title}"
Nhóm: Nhật Ký Vườn Sâm & Văn Hóa — Thương hiệu TA Sâm Ngọc Linh, Vườn Sâm Nhà Khánh, núi Ngọc Linh >1.800m.

CẤU TRÚC 5 PHẦN (mỗi phần ≥250 từ):
## Phần 1: Bức Tranh Địa Lý & Khí Hậu
(mô tả cụ thể điều kiện địa lý núi Ngọc Linh — độ cao, nhiệt độ, độ ẩm, lượng mưa)
## Phần 2: Quy Trình Canh Tác Thực Tế
(mô tả chi tiết công việc thực tế tại vườn theo mùa — không viết kiểu quảng cáo chung chung)
## Phần 3: Câu Chuyện Người Thật
(viết từ góc nhìn kỹ sư vườn hoặc người dân Xơ Đăng — chân thực, không hoa mỹ)
## Phần 4: Tại Sao Không Thể Nhân Rộng Ra Nơi Khác
(giải thích các yếu tố độc đáo của vùng — đất, vi khí hậu, hệ sinh thái rừng)
## Phần 5: Câu Hỏi Thường Gặp
(5 Q&A về xuất xứ, truy xuất, tham quan vườn — mỗi câu ≥3 câu)

> 💡 Chèn ít nhất 2 callout chân thực: "💡 Góc Nhìn Thực Tế:" hoặc "📍 Tọa Độ Vườn Sâm:"

QUY TẮC: Viết như một phóng sự thực địa — cụ thể, chân thực, không quảng cáo hoa mỹ.
Chỉ viết nội dung bài, KHÔNG thêm chú thích ngoài""",

    "D": """Viết bài blog tiếng Việt 1.500+ từ về chủ đề: "{title}"
Nhóm: Quà Tặng Doanh Nghiệp & Hợp Tác — Thương hiệu TA Sâm Ngọc Linh, vườn hữu cơ Trà Linh Kon Tum.

CẤU TRÚC 5 PHẦN (mỗi phần ≥250 từ):
## Phần 1: Tại Sao Chọn Sâm Ngọc Linh Làm Quà Tặng Doanh Nghiệp
(lý do thực tế: giá trị, tính khan hiếm, ý nghĩa văn hóa — không viết chung chung)
## Phần 2: Danh Mục Set Quà & Bảng Giá Tham Khảo
(tạo bảng markdown | Loại Set | Thành Phần | Giá Tham Khảo | Phù Hợp Với | ≥4 loại cụ thể)
## Phần 3: Quy Trình Đặt Hàng & Chính Sách
(từng bước đặt hàng, thời gian giao, chính sách đại lý, điều kiện hợp tác)
## Phần 4: Câu Chuyện Khách Hàng Thực
(2–3 tình huống điển hình: doanh nghiệp tặng đối tác nước ngoài, gia đình biếu sếp, ...)
## Phần 5: Câu Hỏi Thường Gặp
(5 Q&A về giá, tùy chỉnh bao bì, thời gian giao — mỗi câu ≥3 câu)

> 💡 Chèn 2 callout: "💡 Gợi Ý Từ Chuyên Gia:" hoặc "📦 Lưu Ý Đặt Hàng:"

QUY TẮC: Viết thực tế, thuyết phục — nhắm người mua là giám đốc điều hành hoặc trưởng phòng mua hàng.
Chỉ viết nội dung bài, KHÔNG thêm chú thích ngoài""",
}

def _extract_sections(body_md):
    """Extract H2 section names from generated markdown."""
    return re.findall(r'^## (.+?)(?:\s*\{#[^}]*\})?$', body_md, re.MULTILINE)[:5]

def generate_content(title_vi, group, slug):
    """Call AI providers in priority order. Return dict with body ready for DB."""
    prompt_template = PROMPTS.get(group, PROMPTS["A"])
    prompt = prompt_template.format(title=title_vi)
    grp = MATRIX[group]

    raw_md = None

    # 1. Ollama (primary — local, free)
    try:
        log.info("[Ollama] Generating...")
        raw = _call_ollama(prompt).strip()
        raw = ''.join(c if ord(c) >= 32 or c in '\n\t' else ' ' for c in raw)
        if len(raw.split()) >= 400:
            raw_md = raw
            log.info(f"[Ollama] OK — {len(raw.split())} words")
        else:
            log.warning(f"[Ollama] Too short ({len(raw.split())} words), trying fallback")
    except Exception as e:
        log.warning(f"[Ollama] Failed: {e}")

    # 2. Groq (fast free fallback)
    if raw_md is None:
        try:
            log.info("[Groq] Trying...")
            raw_md = _call_groq(prompt).strip()
            log.info(f"[Groq] OK — {len(raw_md.split())} words")
        except Exception as e:
            log.warning(f"[Groq] Failed: {e}")

    # 3. DeepSeek fallback
    if raw_md is None:
        try:
            log.info("[DeepSeek] Trying...")
            raw_md = _call_deepseek(prompt).strip()
            log.info(f"[DeepSeek] OK")
        except Exception as e:
            log.warning(f"[DeepSeek] Failed: {e}")

    # 4. Gemini last resort (costs token $)
    if raw_md is None and GEMINI_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_KEY)
            log.info("[Gemini] Trying as last resort...")
            resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            raw_md = resp.text.strip()
            log.info(f"[Gemini] OK — {len(raw_md.split())} words")
        except Exception as e:
            log.warning(f"[Gemini] Failed: {e}")

    if raw_md is None:
        raise RuntimeError("All AI providers failed — is Ollama running? Run: ollama serve")

    # ── Post-process: build full body with HTML components ─────────────────────
    sections = _extract_sections(raw_md)

    toc_html    = build_toc(sections)
    share_html  = build_social_share(slug)
    cta_html    = grp["cta_html"]

    # Add IDs to H2 headings so TOC anchors work
    def _add_h2_ids(md, secs):
        counter = [0]
        def replacer(m):
            counter[0] += 1
            if counter[0] <= len(secs):
                return f'<h2 id="sec-{counter[0]}">{m.group(1).strip()}</h2>'
            return m.group(0)
        return re.sub(r'^## (.+)$', replacer, md, flags=re.MULTILINE)

    body_with_ids = _add_h2_ids(raw_md, sections)

    # Apply internal links
    body_linked = apply_internal_links(body_with_ids, group)

    # Add FAQ anchor id
    body_linked = re.sub(
        r'(<h2[^>]*>)(.*?Câu Hỏi.*?)(</h2>)',
        r'<h2 id="sec-faq">\2</h2>',
        body_linked,
        flags=re.IGNORECASE,
    )

    # Insert TOC after first paragraph (after first double newline past intro)
    parts = body_linked.split('\n\n', 3)
    if len(parts) >= 3:
        full_body = parts[0] + '\n\n' + parts[1] + '\n\n' + toc_html + '\n\n' + '\n\n'.join(parts[2:])
    else:
        full_body = toc_html + '\n\n' + body_linked

    # Append CTA + social share at end
    full_body += f'\n\n{cta_html}\n\n{share_html}'

    excerpt = re.sub(r'<[^>]+>', '', raw_md)[:200].replace('\n', ' ').strip()

    return {
        "title_vi":    title_vi,
        "body_md":     full_body,
        "excerpt_vi":  excerpt,
        "reading_time": _reading_time(raw_md),
        "faq_list":    [],
        "meta_description": f"{title_vi[:100]} — Sâm Ngọc Linh TA, vườn hữu cơ Trà Linh Kon Tum."[:160],
        "image_prompt": f"Cinematic macro photo of fresh Ngoc Linh Vietnamese ginseng root, {grp['label']}, dark forest, 8K",
        "compliance_check": "PASS",
    }

# ─── COMPLIANCE ───────────────────────────────────────────────────────────────
def compliance_check(body):
    found = [w for w in FORBIDDEN if w.lower() in body.lower()]
    return f"FAIL: từ cấm = {found}" if found else "PASS"

# ─── VIDEO SCRIPT ─────────────────────────────────────────────────────────────
def generate_video_script(title_vi, group, slug, excerpt):
    grp = MATRIX[group]
    hook_lines = {
        "A": f"Bạn có biết Sâm Ngọc Linh chứa 52 Saponin — nhiều nhất thế giới?",
        "B": f"Cách dùng đúng để giữ nguyên hoạt chất Sâm Ngọc Linh — nhiều người đang làm sai!",
        "C": f"Bên trong khu rừng >1.800m tại núi Ngọc Linh — nơi duy nhất sâm thật mọc.",
        "D": f"Set quà biếu doanh nghiệp 2025 — Sâm Ngọc Linh TA: sang trọng, truy xuất được.",
    }
    script = {
        "slug": slug,
        "title": title_vi,
        "group": group,
        "group_label": grp["label"],
        "platform": "Facebook Reels / TikTok / Instagram",
        "duration": "15-30 giây",
        "koc": "Mai — @VuonSamNhaKhanh",
        "segments": [
            {
                "id": "hook",
                "duration": "0–3 giây",
                "visual": "Close-up củ sâm tươi hoặc cảnh rừng Ngọc Linh",
                "caption_text": hook_lines.get(group, f"Bí mật về {title_vi[:40]}"),
                "voiceover": hook_lines.get(group, ""),
                "note": "Hook mạnh — phải dừng scroll trong 2 giây đầu",
            },
            {
                "id": "body",
                "duration": "4–22 giây",
                "visual": "B-roll vườn sâm / sản phẩm / quá trình chế biến",
                "caption_text": excerpt[:120],
                "voiceover": f"{excerpt[:100]}...",
                "note": "Tốc độ vừa phải, font chữ lớn overlay, không âm nhạc quá ồn",
            },
            {
                "id": "cta",
                "duration": "23–30 giây",
                "visual": "Logo TA + URL tasamngoclinh.com",
                "caption_text": "Link trong Bio — Vườn Sâm Nhà Khánh ✅",
                "voiceover": "Tìm hiểu thêm tại tasamngoclinh.com — link trong bio.",
                "note": "CTA rõ ràng, kêu gọi click link bio",
            },
        ],
        "hashtags": [
            "#samngoclinh", "#samngoclinhthật", "#tasamngoclinh",
            "#vuonsamNhaKhanh", "#saponin", f"#{slug[:20].replace('-','')}",
        ],
        "generated_at": datetime.now().isoformat(),
        "blog_url": f"https://tasamngoclinh.com/blog/{slug}",
    }

    json_path = VIDEO_DIR / f"{slug[:50]}.json"
    txt_path  = VIDEO_DIR / f"{slug[:50]}.txt"

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(script, f, ensure_ascii=False, indent=2)

    txt_lines = [
        f"=== KỊCH BẢN VIDEO FB/REELS — {title_vi} ===",
        f"Platform: {script['platform']} | Thời lượng: {script['duration']}",
        f"KOC: {script['koc']}",
        "",
    ]
    for seg in script["segments"]:
        txt_lines += [
            f"[{seg['id'].upper()} — {seg['duration']}]",
            f"Visual: {seg['visual']}",
            f"Caption: {seg['caption_text']}",
            f"Voiceover: {seg['voiceover']}",
            f"Note: {seg['note']}",
            "",
        ]
    txt_lines += [
        f"Hashtags: {' '.join(script['hashtags'])}",
        f"Blog link: {script['blog_url']}",
    ]
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write('\n'.join(txt_lines))

    log.info(f"[VideoScript] Saved: {json_path.name} + {txt_path.name}")
    return json_path, txt_path

# ─── IMAGE ────────────────────────────────────────────────────────────────────
def generate_image(title_vi, slug, group):
    try:
        from PIL import Image, ImageDraw, ImageFont
        BG = {"A": (10,40,30), "B": (30,20,10), "C": (20,15,35), "D": (15,25,40)}
        AC = {"A": (200,230,100), "B": (255,180,60), "C": (220,180,255), "D": (255,215,100)}
        bg, ac = BG.get(group,(10,40,30)), AC.get(group,(200,230,100))

        img = Image.new("RGB", (1200, 675), color=bg)
        draw = ImageDraw.Draw(img)
        for y in range(675):
            a = int(y/675*60)
            draw.line([(0,y),(1200,y)], fill=tuple(max(0,c-a//3) for c in bg))
        draw.rectangle([(20,20),(1180,655)], outline=ac, width=2)

        try:
            f_big = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 50)
            f_sm  = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 20)
        except:
            f_big = f_sm = ImageFont.load_default()

        words, lines, line = title_vi.split(), [], []
        for w in words:
            if len(" ".join(line+[w])) < 36:
                line.append(w)
            else:
                lines.append(" ".join(line)); line=[w]
        if line: lines.append(" ".join(line))

        y0 = max(140, 337 - len(lines)*60//2)
        for i, ln in enumerate(lines[:3]):
            draw.text((60, y0+i*68), ln, fill=ac, font=f_big)

        lbl = {"A":"KHOA HỌC","B":"LIFESTYLE","C":"DI SẢN","D":"CAO CẤP"}.get(group,"TA")
        draw.text((60,580), f"TA SÂM NGỌC LINH  |  {lbl}", fill=(180,180,160), font=f_sm)
        draw.text((60,610), "tasamngoclinh.com", fill=tuple(c//2 for c in ac), font=f_sm)

        fname = f"featured-{slug[:40]}.webp"
        fpath = Path(__file__).parent / fname
        img.save(fpath, "WEBP", quality=80)
        log.info(f"[Image] {fname}")
        return str(fpath), fname
    except Exception as e:
        log.warning(f"[Image] {e}")
        return None, None

# ─── SUPABASE ─────────────────────────────────────────────────────────────────
def upload_image(local_path, filename):
    if not local_path or not Path(local_path).exists():
        return ""
    try:
        import requests
        with open(local_path,"rb") as f: data = f.read()
        r = requests.post(
            f"{SUPA_URL}/storage/v1/object/blog-images/{filename}",
            data=data,
            headers={"apikey":SUPA_KEY,"Authorization":f"Bearer {SUPA_KEY}","Content-Type":"image/webp"},
            timeout=20,
        )
        if r.status_code in (200,201):
            url = f"{SUPA_URL}/storage/v1/object/public/blog-images/{filename}"
            log.info(f"[Storage] {url}")
            return url
        log.warning(f"[Storage] {r.status_code}: {r.text[:100]}")
    except Exception as e:
        log.warning(f"[Storage] {e}")
    return ""

def insert_db(post_data, slug, group, img_url, compliance):
    import requests
    post_id = str(uuid.uuid4())
    payload = {
        "id": post_id,
        "title": post_data["title_vi"], "title_vi": post_data["title_vi"],
        "slug": slug, "slug_vi": slug,
        "body": post_data["body_md"], "excerpt": post_data["excerpt_vi"][:200],
        "excerpt_vi": post_data["excerpt_vi"][:200],
        "featured_image_url": img_url,
        "category": {"A":"science","B":"lifestyle","C":"heritage","D":"kgc"}.get(group, group.lower()),
        "published": False,
        "created_at": datetime.utcnow().isoformat()+"Z",
        "meta_description": post_data["meta_description"],
        "compliance_check": compliance,
        "reading_time": post_data.get("reading_time",""),
        "author": "Đội Ngũ Nghiên Cứu TA",
    }
    r = requests.post(
        f"{SUPA_URL}/rest/v1/blog_posts", json=payload,
        headers={"apikey":SUPA_KEY,"Authorization":f"Bearer {SUPA_KEY}","Content-Type":"application/json","Prefer":"return=representation"},
        timeout=15,
    )
    if r.status_code == 201:
        result = r.json()
        inserted = result[0] if isinstance(result,list) else result
        log.info(f"[Supabase] OK id={inserted.get('id','?')}")
        return inserted.get("id", post_id), slug
    raise RuntimeError(f"[Supabase] {r.status_code}: {r.text[:200]}")

def send_telegram(title, group, slug, blog_id, compliance, video_json, count_label=""):
    if not TG_TOKEN or not TG_CHAT:
        return
    try:
        import requests
        icon = "✅" if compliance == "PASS" else "⚠️"
        grp_label = MATRIX[group]["label"]
        video_note = f"🎬 Script: {video_json.name}" if video_json else "🎬 Script: —"
        msg = (
            f"{icon} BÀI VIẾT MỚI — {grp_label} {count_label}\n\n"
            f"📌 {title}\n"
            f"📋 Compliance: {compliance}\n"
            f"{video_note}\n\n"
            f"🔗 Preview: https://tasamngoclinh.com/blog/{slug}\n"
            f"📊 Admin: https://tasamngoclinh.com/blog-admin.html\n\n"
            f"⏳ Đợi duyệt → publish\n"
            f"— Auto Blog v5.0 | {datetime.now().strftime('%d/%m %H:%M')}"
        )
        r = requests.post(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT, "text": msg}, timeout=10,
        )
        log.info(f"[Telegram] {'Sent ✅' if r.status_code==200 else r.status_code}")
    except Exception as e:
        log.warning(f"[Telegram] {e}")

# ─── PIPELINE (single post) ───────────────────────────────────────────────────
def run_one(title_vi, group, slug, count_label=""):
    log.info(f"{'='*60}")
    log.info(f"Group {group} | {MATRIX[group]['label']} | {title_vi[:55]}")
    log.info(f"{'='*60}")

    post_data   = generate_content(title_vi, group, slug)
    compliance  = compliance_check(post_data.get("body_md",""))
    img_path, img_fn = generate_image(title_vi, slug, group)
    img_url     = upload_image(img_path, img_fn) if img_path else ""
    blog_id, final_slug = insert_db(post_data, slug, group, img_url, compliance)
    video_json, _ = generate_video_script(title_vi, group, slug, post_data.get("excerpt_vi",""))
    send_telegram(title_vi, group, final_slug, blog_id, compliance, video_json, count_label)

    log.info(f"✅ DONE | ID={blog_id} | {final_slug}")
    log.info(f"   Video script: {video_json}")
    print(f"\n  Preview: https://tasamngoclinh.com/blog/{final_slug}")
    print(f"  Script:  {video_json}\n")
    return blog_id, final_slug

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="TA Blog Engine v5.0")
    parser.add_argument("--mode", choices=["auto","custom","batch"], default="auto")
    parser.add_argument("--title", default="", help="Custom title (mode=custom)")
    parser.add_argument("--group", choices=["A","B","C","D"], default=None)
    parser.add_argument("--count", type=int, default=5, help="Batch count (mode=batch)")
    args = parser.parse_args()

    if args.mode == "auto":
        title_vi, slug, group = get_next_topic(args.group)
        run_one(title_vi, group, slug)

    elif args.mode == "custom":
        if not args.title:
            print("Lỗi: --title bắt buộc với mode=custom")
            sys.exit(1)
        title_vi = args.title
        slug = _slug(title_vi)
        # Auto-classify group if not specified
        group = args.group
        if group is None:
            kw_a = ["saponin","hplc","majonoside","ginsenoside","kiểm định","phân biệt","brc"]
            kw_b = ["ngâm","trà","rượu","liều","chế biến","uống","nấu","phụ nữ","thể thao"]
            kw_c = ["vườn","núi","rừng","kỹ sư","canh tác","trà linh","nhật ký","văn hóa","xơ đăng"]
            kw_d = ["quà","doanh nghiệp","đại lý","hợp tác","set","xuất khẩu","bảng giá"]
            lower = title_vi.lower()
            if any(k in lower for k in kw_a): group = "A"
            elif any(k in lower for k in kw_b): group = "B"
            elif any(k in lower for k in kw_c): group = "C"
            elif any(k in lower for k in kw_d): group = "D"
            else: group = "A"
            log.info(f"[AutoClassify] → Group {group}: {MATRIX[group]['label']}")
        run_one(title_vi, group, slug)

    elif args.mode == "batch":
        n = max(1, min(args.count, 10))
        log.info(f"[Batch] Generating {n} posts...")
        for i in range(n):
            title_vi, slug, group = get_next_topic()
            try:
                run_one(title_vi, group, slug, count_label=f"({i+1}/{n})")
            except Exception as e:
                log.error(f"[Batch] Post {i+1} failed: {e}")
        log.info(f"[Batch] Completed {n} posts")

if __name__ == "__main__":
    main()
