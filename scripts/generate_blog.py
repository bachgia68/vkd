#!/usr/bin/env python3
"""
TA Blog Engine v8.0
2200+ Words · YAML Frontmatter · No Duplicate TOC · Social Share · Supabase · Telegram
"""

import os, sys, json, uuid, re, argparse, logging
from datetime import datetime
from pathlib import Path

# ─── PATHS ─────────────────────────────────────────────────────────────────────
ROOT       = Path(__file__).parent.parent
ENV_FILE   = ROOT / ".env"
STATE_FILE = ROOT / "scripts" / "blog_state.json"
VIDEO_DIR  = ROOT / "content" / "video_scripts"
LOG_FILE   = ROOT / "scripts" / "blog_engine.log"

VIDEO_DIR.mkdir(parents=True, exist_ok=True)

# ─── LOGGING ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger(__name__)

# ─── ENV ───────────────────────────────────────────────────────────────────────
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
_load_env(ROOT.parent.parent / ".env")

SUPA_URL   = os.environ.get("VITE_SUPABASE_URL", "")
SUPA_KEY   = os.environ.get("VITE_SUPABASE_ANON_KEY", "")
GEMINI_KEY = os.environ.get("VITE_GEMINI_API_KEY", "")
GROQ_KEY   = os.environ.get("GROQ_API_KEY", "")
TG_TOKEN   = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TG_CHAT    = os.environ.get("TELEGRAM_CHAT_ID", "")

# ─── COMPLIANCE ────────────────────────────────────────────────────────────────
FORBIDDEN = [
    "điều trị", "chữa khỏi", "công dụng (y học)", "hết bệnh",
    "hiệu quả 100%", "chắc chắn khỏe", "bảo đảm khỏi",
]

# ─── SUBJECT MATRIX ────────────────────────────────────────────────────────────
MATRIX = {
    "A": {
        "label":    "Tri Thức Sâm",
        "icon":     "🔬",
        "category": "science",
        "cta": "📞 **Tư vấn chuyên sâu:** [Zalo Vườn Sâm Nhà Khánh](https://tasamngoclinh.com/hop-tac)",
        "internal": {
            "sản phẩm sâm":  "https://tasamngoclinh.com/san-pham",
            "kiểm định":     "https://tasamngoclinh.com/gioi-thieu",
            "vườn sâm":      "https://tasamngoclinh.com/gioi-thieu",
        },
        "topics": [
            ("52 Saponin Sâm Ngọc Linh: Phân Tích Chuyên Sâu Và Cách Nhận Biết Sâm Thật",       "52-saponin-sam-ngoc-linh-phan-tich-nhan-biet"),
            ("Majonoside-R2: Hoạt Chất Độc Quyền Chỉ Có Ở Sâm Ngọc Linh Việt Nam",              "majonoside-r2-hoat-chat-doc-quyen-sam-ngoc-linh"),
            ("Kiểm Định Saponin Sâm Ngọc Linh: Tiêu Chuẩn HPLC Và BRC Standard",                "kiem-dinh-saponin-sam-ngoc-linh-hplc-brc"),
            ("Phân Biệt Sâm Ngọc Linh Thật Giả Qua Mắt Sâm, Vân Củ Và Mùi Vị",                 "phan-biet-sam-ngoc-linh-that-gia-mat-sam"),
            ("Hàm Lượng Saponin Theo Tuổi Củ: Sâm 5 Năm vs 7 Năm vs 10 Năm",                    "ham-luong-saponin-tuoi-cu-5-7-10-nam"),
            ("Sâm Ngọc Linh vs Hồng Sâm Hàn Quốc: So Sánh 52 Saponin Chi Tiết",                 "sam-ngoc-linh-vs-hong-sam-han-so-sanh"),
            ("Ginsenoside Rb1 Và Rg1: Hai Nền Tảng Hoạt Chất Sâm Ngọc Linh Việt",               "ginsenoside-rb1-rg1-nen-tang-hoat-chat"),
            ("Quy Trình VietGAP Tại Vườn Sâm Trà Linh: Từ Canh Tác Đến Kiểm Định",              "vietgap-vuon-sam-tra-linh-canh-tac-kiem-dinh"),
            ("Chỉ Số ORAC Sâm Ngọc Linh: Sức Chống Oxy Hoá Đo Được Thực Tế",                    "orac-sam-ngoc-linh-chong-oxy-hoa-thuc-te"),
            ("Bioavailability Saponin: Tại Sao Sâm Tươi Nguyên Củ Vượt Trội Hơn Chiết Xuất",    "bioavailability-saponin-sam-tuoi-vs-chiet-xuat"),
        ],
    },
    "B": {
        "label":    "Bài Thuốc & Sức Khỏe",
        "icon":     "🌿",
        "category": "lifestyle",
        "cta": "🛒 **Đặt ngay:** [Sâm ngâm mật mỡ gà TA](https://tasamngoclinh.com/san-pham/sam-ngam-mat-ong)",
        "internal": {
            "sâm ngâm mật": "https://tasamngoclinh.com/san-pham/sam-ngam-mat-ong",
            "trà sâm":      "https://tasamngoclinh.com/san-pham/tra-sam-ngoc-linh",
            "set quà":      "https://tasamngoclinh.com/qua-tang",
        },
        "topics": [
            ("Sâm Ngâm Mật Mỡ Gà: Công Thức Chuẩn Và Cách Bảo Quản Đúng Nhất",      "sam-ngam-mat-mo-ga-cong-thuc-chuan"),
            ("Trà Sâm Ngọc Linh: Cách Pha Chuẩn Vị Không Mất Hoạt Chất Saponin",    "tra-sam-ngoc-linh-cach-pha-khong-mat-hoat-chat"),
            ("Rượu Sâm Ngọc Linh Ngâm Đúng Cách: Quy Trình 7 Bước Chi Tiết",        "ruou-sam-ngoc-linh-ngam-dung-cach-7-buoc"),
            ("Liều Lượng Sâm Ngọc Linh Phù Hợp Theo Từng Đối Tượng Sử Dụng",       "lieu-luong-sam-ngoc-linh-theo-doi-tuong"),
            ("Sâm Ngọc Linh Cho Phụ Nữ Sau Sinh: Những Điều Cần Biết Và Lưu Ý",    "sam-ngoc-linh-phu-nu-sau-sinh"),
            ("Nghi Thức Uống Sâm Truyền Thống: Từ Triều Đình Đến Bàn Ăn Hiện Đại", "nghi-thuc-uong-sam-truyen-thong-den-hien-dai"),
            ("Sâm Ngọc Linh Và Thể Thao: Hỗ Trợ Phục Hồi Cơ Bắp Sau Tập Luyện",   "sam-ngoc-linh-the-thao-phuc-hoi-co-bap"),
            ("Lịch Uống Sâm Theo Mùa: Xuân Hạ Thu Đông Dùng Khác Nhau Như Thế Nào","lich-uong-sam-ngoc-linh-theo-mua"),
            ("Những Sai Lầm Phổ Biến Khi Sử Dụng Sâm Ngọc Linh Cần Tránh",        "sai-lam-pho-bien-dung-sam-ngoc-linh"),
            ("Sâm Ngọc Linh Cho Người Cao Tuổi: Liều Dùng Và Thời Điểm Phù Hợp",  "sam-ngoc-linh-nguoi-cao-tuoi-lieu-dung"),
        ],
    },
    "C": {
        "label":    "Đời Sống Vườn Sâm",
        "icon":     "🏔️",
        "category": "heritage",
        "cta": "🌿 **Tìm hiểu thêm:** [Vườn Sâm Nhà Khánh](https://tasamngoclinh.com/gioi-thieu)",
        "internal": {
            "vườn sâm nhà khánh": "https://tasamngoclinh.com/gioi-thieu",
            "trà linh":           "https://tasamngoclinh.com/gioi-thieu",
            "nguồn gốc":          "https://tasamngoclinh.com/gioi-thieu",
        },
        "topics": [
            ("Núi Ngọc Linh 2.598m: Địa Lý Kỳ Diệu Tạo Ra Sâm Quý Nhất Thế Giới",      "nui-ngoc-linh-dia-ly-ky-dieu-sam-quy-nhat"),
            ("Vườn Sâm Nhà Khánh: Mô Hình Canh Tác Hữu Cơ Chuẩn Rừng Tại Trà Linh",   "vuon-sam-nha-khanh-canh-tac-huu-co-chuan-rung"),
            ("Từ Hạt Sâm Đến Củ Sâm 7 Năm: Hành Trình Không Phân Bón Hóa Học",         "hat-sam-den-cu-sam-7-nam-hanh-trinh"),
            ("Nhật Ký Kỹ Sư Vườn Sâm: Mùa Mưa Tây Nguyên Và Những Thách Thức Thực Tế", "nhat-ky-ky-su-vuon-sam-mua-mua-tay-nguyen"),
            ("Người Xơ Đăng Và Bí Quyết Bảo Tồn Sâm Rừng Qua Nhiều Thế Kỷ",            "nguoi-xo-dang-bi-quyet-bao-ton-sam-rung"),
            ("Trà Linh: Thủ Phủ Sâm Ngọc Linh — Hướng Dẫn Đến Và Mua Sâm Thật",       "tra-linh-thu-phu-sam-huong-dan"),
            ("Độ Cao 1.800m: Khoa Học Giải Thích Tại Sao Sâm Không Thể Trồng Nơi Khác", "do-cao-1800m-tai-sao-sam-khong-trong-noi-khac"),
            ("Mưa Rừng Ngọc Linh: Khí Hậu Đặc Thù Nuôi Dưỡng Củ Sâm Ngàn Năm",       "mua-rung-ngoc-linh-khi-hau-dac-thu"),
            ("40 Năm Nhân Giống Sâm Ngọc Linh Ở Kon Tum: Câu Chuyện Bảo Tồn",          "40-nam-nhan-giong-sam-ngoc-linh-kon-tum"),
            ("Biến Đổi Khí Hậu Và Giải Pháp Bền Vững Cho Vùng Trồng Sâm Ngọc Linh",   "bien-doi-khi-hau-giai-phap-vuon-sam"),
        ],
    },
    "D": {
        "label":    "Quà Tặng & Hợp Tác",
        "icon":     "🎁",
        "category": "kgc",
        "cta": "📦 **Liên hệ tư vấn:** [Hợp tác & Đại lý TA](https://tasamngoclinh.com/hop-tac)",
        "internal": {
            "set quà":     "https://tasamngoclinh.com/qua-tang",
            "hợp tác":     "https://tasamngoclinh.com/hop-tac",
            "đại lý":      "https://tasamngoclinh.com/hop-tac",
            "sản phẩm ta": "https://tasamngoclinh.com/san-pham",
        },
        "topics": [
            ("Set Quà Sâm Ngọc Linh Doanh Nghiệp: Tiêu Chuẩn Biếu Tặng Cao Cấp 2025",          "set-qua-sam-ngoc-linh-doanh-nghiep-2025"),
            ("Sâm Ngọc Linh TA vs KGC Hàn Quốc: So Sánh Khách Quan Cho Nhà Mua Thông Minh",    "sam-ta-vs-kgc-han-quoc-so-sanh-khach-quan"),
            ("QR Code Truy Xuất Nguồn Gốc: Minh Bạch Từ Vườn Đến Tay Người Mua",               "qr-code-truy-xuat-nguon-goc-sam-ta"),
            ("Chính Sách Đại Lý Sâm Ngọc Linh TA: Điều Kiện, Ưu Đãi Và Quy Trình Hợp Tác",   "chinh-sach-dai-ly-sam-ngoc-linh-ta"),
            ("Chuỗi Cung Ứng Farm-to-Table Sâm Ngọc Linh TA: Minh Bạch Từng Khâu",             "chuoi-cung-ung-farm-to-table-sam-ta"),
            ("Đóng Gói Cao Cấp Sâm Ngọc Linh: Từ Hộp Gỗ Đến Tem Hologram Truy Xuất",          "dong-goi-cao-cap-sam-ngoc-linh"),
            ("Thị Trường Sâm Cao Cấp 2025: Người Mua Thông Minh Cần Biết Gì",                   "thi-truong-sam-cao-cap-2025"),
            ("Certificate Of Origin Sâm Ngọc Linh TA: Pháp Lý Đầy Đủ Và Quy Trình Truy Xuất", "certificate-of-origin-sam-ngoc-linh-ta"),
            ("Sâm Ngọc Linh Xuất Khẩu: Tiêu Chuẩn Quốc Tế Và Thị Trường Tiềm Năng",           "sam-ngoc-linh-xuat-khau-tieu-chuan"),
            ("Quà Tặng Sâm Ngọc Linh Cho Đối Tác Nước Ngoài: Cách Chọn Đúng",                  "qua-tang-sam-doi-tac-nuoc-ngoai"),
        ],
    },
}

GROUP_ORDER = ["A", "B", "C", "D"]

# ─── SLUG & UTILS ──────────────────────────────────────────────────────────────
_VI = {
    'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ắ':'a','ặ':'a','ẳ':'a','ẵ':'a',
    'ầ':'a','ấ':'a','ẩ':'a','ẫ':'a','ậ':'a','â':'a','è':'e','é':'e','ẻ':'e','ẽ':'e',
    'ẹ':'e','ê':'e','ề':'e','ế':'e','ể':'e','ễ':'e','ệ':'e','ì':'i','í':'i','ỉ':'i',
    'ĩ':'i','ị':'i','ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ồ':'o','ố':'o',
    'ổ':'o','ỗ':'o','ộ':'o','ơ':'o','ờ':'o','ớ':'o','ở':'o','ỡ':'o','ợ':'o','ù':'u',
    'ú':'u','ủ':'u','ũ':'u','ụ':'u','ư':'u','ừ':'u','ứ':'u','ử':'u','ữ':'u','ự':'u',
    'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y','đ':'d',
}

def _slug(text):
    s = text.lower()
    s = ''.join(_VI.get(c, c) for c in s)
    s = re.sub(r'[^a-z0-9\s-]', '', s).strip()
    s = re.sub(r'\s+', '-', s)[:65].rstrip('-')
    return s

def _word_count(text):
    return len(re.findall(r'\w+', text))

def _reading_time(text):
    return f"{max(1, round(_word_count(text) / 250))} phút đọc"

def _strip_anchors(text):
    """Remove {#s1} {#s2} etc. that models sometimes output literally."""
    return re.sub(r'\s*\{#[a-z0-9_-]+\}', '', text)

# ─── STATE ─────────────────────────────────────────────────────────────────────
def _load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {}

def _save_state(s):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(s, f, ensure_ascii=False, indent=2)

def get_next_topic(group=None):
    state = _load_state()
    if group is None:
        idx = state.get("__auto_group__", 0)
        group = GROUP_ORDER[idx % len(GROUP_ORDER)]
        state["__auto_group__"] = (idx + 1) % len(GROUP_ORDER)
    key = f"idx_{group}"
    tidx = state.get(key, 0)
    topics = MATRIX[group]["topics"]
    title, slug = topics[tidx % len(topics)]
    state[key] = (tidx + 1) % len(topics)
    _save_state(state)
    return title, slug, group

# ─── BUILDERS ──────────────────────────────────────────────────────────────────
def build_frontmatter(title, excerpt, reading_time, category_label):
    return (
        '---\n'
        f'title: "{title}"\n'
        f'excerpt: "{excerpt}"\n'
        f'reading_time: "{reading_time}"\n'
        f'category: "{category_label}"\n'
        'author: "Đội Ngũ Nghiên Cứu TA"\n'
        '---\n\n'
    )

def build_social_share(slug):
    url = f"https://tasamngoclinh.com/blog/{slug}"
    return (
        '\n<div class="ta-social-share bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 my-8 text-center">\n'
        '  <p class="font-bold text-emerald-950 text-base mb-3">Chia sẻ bài viết tri thức này đến bạn bè &amp; người thân:</p>\n'
        '  <div class="flex justify-center items-center gap-3 flex-wrap">\n'
        f'    <a href="https://www.facebook.com/sharer/sharer.php?u={url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"><span>Chia sẻ lên Facebook</span></a>\n'
        f'    <a href="https://zalo.me/share?url={url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0068FF] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"><span>Chia sẻ qua Zalo</span></a>\n'
        f'    <button onclick="navigator.clipboard.writeText(\'{url}\'); alert(\'Đã sao chép liên kết bài viết!\');" class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all shadow-sm"><span>Sao chép Link</span></button>\n'
        '  </div>\n'
        '</div>\n'
    )

# ─── PROMPTS ───────────────────────────────────────────────────────────────────
# Rules appended to every prompt.
_RULES = """
QUY TẮC TUYỆT ĐỐI:
- KHÔNG ĐƯỢC viết: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%, bảo đảm khỏi
- ĐƯỢC DÙNG: hỗ trợ, theo nghiên cứu, dữ liệu ghi nhận, cần tham vấn chuyên gia
- Mỗi phần ## phải đạt 350-500 từ phân tích thực chất
- Toàn bài 2.200-2.800 từ — KHÔNG được viết ngắn hơn
- Số liệu phải có cơ sở (Viện Dược liệu VN, Journal of Natural Products, PubMed, DĐVN)
- KHÔNG bịa tên bác sĩ, KHÔNG bịa nghiên cứu
- KHÔNG thêm chuỗi {#s1} {#s2} hay anchor bất kỳ vào cuối tiêu đề
- KHÔNG sinh khối Mục lục — giao diện web đã tự tạo mục lục
- Chỉ viết nội dung bài, KHÔNG thêm ghi chú ngoài lề
"""

PROMPTS = {
    "A": """\
Vai trò: Chuyên gia Phân tích Dược liệu cao cấp — Thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum >1.800m).

Viết bài blog tiếng Việt CHUYÊN SÂU về: "{title}"
Nhóm: Tri Thức Sâm — Khoa Học & Phân Biệt

CẤU TRÚC BẮT BUỘC:

# [Tiêu đề H1 — giống title, thêm từ khóa phụ nếu cần]

[Đoạn mở bài 200-250 từ: đi thẳng vào bản chất khoa học, thể hiện vị thế độc tôn của Sâm Ngọc Linh, giọng điềm đặn]

## 1. Bản Chất Khoa Học Của Hoạt Chất

[350-500 từ: giải thích cơ chế phân tử, cấu trúc hóa học, tại sao quan trọng. Dẫn nguồn thực.]

> **Lưu ý chuyên gia:** [insight thực tế từ quy trình kiểm định tại Vườn Sâm Nhà Khánh]

### [Sub-heading phân tích chi tiết hơn]

[150-180 từ với danh sách hoặc mô tả kỹ thuật]

## 2. Tiêu Chuẩn Kiểm Định Và So Sánh Định Lượng

[350-500 từ: quy trình HPLC, BRC Standard, dữ liệu thực tế]

| Tiêu chí | Sâm Ngọc Linh TA | Sâm Hàn Quốc | Sâm khác |
|---|---|---|---|
| [Chỉ số 1] | [Số liệu] | [Số liệu] | [Số liệu] |
| [Chỉ số 2] | [Số liệu] | [Số liệu] | [Số liệu] |
| [Chỉ số 3] | [Số liệu] | [Số liệu] | [Số liệu] |
| [Chỉ số 4] | [Số liệu] | [Số liệu] | [Số liệu] |
| [Chỉ số 5] | [Số liệu] | [Số liệu] | [Số liệu] |

## 3. Thực Tế Tại Vườn Trà Linh: Quy Trình Kiểm Soát Chất Lượng

[350-500 từ: kinh nghiệm thực địa Vườn Sâm Nhà Khánh, quy trình canh tác ảnh hưởng đến hàm lượng saponin]

> **Phân biệt sâm thật:** [cảnh báo cụ thể dấu hiệu hàng giả hoặc sâm kém chất lượng]

### [Sub-heading về dấu hiệu nhận biết cụ thể]

[120-150 từ danh sách kiểm tra thực tế]

## 4. Ứng Dụng Thực Tế Và Lời Khuyên Sử Dụng

[350-500 từ: hướng dẫn ứng dụng cho người dùng, liều lượng tham khảo, cách bảo quản]

## 5. Câu Hỏi Thường Gặp

**Câu hỏi 1: [Câu hỏi người mua hay hỏi nhất]?**
[Trả lời 5-6 câu đầy đủ, thực tế]

**Câu hỏi 2: [Câu hỏi phổ biến 2]?**
[Trả lời 5-6 câu]

**Câu hỏi 3: [Câu hỏi phổ biến 3]?**
[Trả lời 5-6 câu]

**Câu hỏi 4: [Câu hỏi phổ biến 4]?**
[Trả lời 5-6 câu]

## 6. Kết Luận

[200-250 từ: tổng kết giá trị cốt lõi, lời kết điềm đặn — không sáo rỗng]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Số liệu tham chiếu từ các công trình khoa học công bố trên PubMed và tạp chí Dược liệu Việt Nam. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",

    "B": """\
Vai trò: Chuyên gia Y học Cổ truyền & Dinh dưỡng cao cấp — Thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum >1.800m).

Viết bài blog tiếng Việt CHUYÊN SÂU về: "{title}"
Nhóm: Bài Thuốc, Sức Khỏe & Lifestyle

CẤU TRÚC BẮT BUỘC:

# [Tiêu đề H1]

[Đoạn mở bài 200-250 từ: tại sao phương pháp này quan trọng, ai nên đọc]

## 1. Nguyên Lý Khoa Học Đằng Sau Phương Pháp

[350-500 từ: giải thích cơ chế — không viết chung chung]

> **Lưu ý chuyên gia:** [insight từ Vườn Sâm Nhà Khánh hoặc thực tế sử dụng]

### [Ai phù hợp, ai cần thận trọng]

[150-180 từ danh sách rõ ràng]

## 2. Nguyên Liệu Và Chuẩn Bị

[350-500 từ: nguyên liệu cụ thể với số lượng, lưu ý chọn nguyên liệu chất lượng]

| Nguyên liệu | Số lượng | Tiêu chuẩn chọn | Ghi chú |
|---|---|---|---|
| [NL 1] | [SL] | [Tiêu chuẩn] | [Ghi chú] |
| [NL 2] | [SL] | [Tiêu chuẩn] | [Ghi chú] |
| [NL 3] | [SL] | [Tiêu chuẩn] | [Ghi chú] |
| [NL 4] | [SL] | [Tiêu chuẩn] | [Ghi chú] |

## 3. Hướng Dẫn Từng Bước Chi Tiết

[350-500 từ: các bước đánh số 1, 2, 3... với thao tác, thời gian, nhiệt độ cụ thể]

> **Lưu ý quan trọng:** [cảnh báo sai lầm phổ biến nhất]

## 4. Liều Lượng Theo Từng Đối Tượng

[350-500 từ: phân tích chi tiết]

| Đối tượng | Liều lượng | Thời điểm tốt nhất | Lưu ý riêng |
|---|---|---|---|
| [Đối tượng 1] | [Liều] | [Thời điểm] | [Lưu ý] |
| [Đối tượng 2] | [Liều] | [Thời điểm] | [Lưu ý] |
| [Đối tượng 3] | [Liều] | [Thời điểm] | [Lưu ý] |
| [Đối tượng 4] | [Liều] | [Thời điểm] | [Lưu ý] |

## 5. Câu Hỏi Thường Gặp

**Câu hỏi 1: [Câu hỏi phổ biến nhất]?**
[Trả lời 5-6 câu]

**Câu hỏi 2: [Câu hỏi 2]?**
[Trả lời 5-6 câu]

**Câu hỏi 3: [Câu hỏi 3]?**
[Trả lời 5-6 câu]

**Câu hỏi 4: [Câu hỏi 4]?**
[Trả lời 5-6 câu]

## 6. Kết Luận

[200-250 từ: tổng kết lời khuyên thực tế]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",

    "C": """\
Vai trò: Phóng viên Thực địa & Chuyên gia Nông nghiệp Hữu cơ — Thương hiệu TA Sâm Ngọc Linh (Vườn Sâm Nhà Khánh, núi Ngọc Linh >1.800m).

Viết bài blog tiếng Việt CHUYÊN SÂU về: "{title}"
Nhóm: Đời Sống Vườn Sâm & Văn Hóa

Viết như phóng sự thực địa — cụ thể, chân thực, không hoa mỹ.

CẤU TRÚC BẮT BUỘC:

# [Tiêu đề H1]

[Đoạn mở bài 200-250 từ: cảnh quan, bầu không khí, lý do vùng đất đặc biệt — sống động như người đứng tại chỗ]

## 1. Địa Lý, Khí Hậu Và Điều Kiện Sinh Thái

[350-500 từ: số liệu thực: độ cao m, nhiệt độ °C, độ ẩm %, lượng mưa mm/năm, thành phần đất]

| Yếu tố sinh thái | Vùng Ngọc Linh (>1.800m) | Trung bình Tây Nguyên | Yêu cầu tối thiểu |
|---|---|---|---|
| [Yếu tố 1] | [Số liệu] | [Số liệu] | [Yêu cầu] |
| [Yếu tố 2] | [Số liệu] | [Số liệu] | [Yêu cầu] |
| [Yếu tố 3] | [Số liệu] | [Số liệu] | [Yêu cầu] |
| [Yếu tố 4] | [Số liệu] | [Số liệu] | [Yêu cầu] |

> **Lưu ý chuyên gia:** [quan sát cụ thể từ kỹ sư vườn hoặc người Xơ Đăng]

## 2. Quy Trình Canh Tác Thực Tế

[350-500 từ: từng bước theo mùa, công việc cụ thể, quyết định kỹ thuật]

### Lịch canh tác theo mùa

[Bảng hoặc danh sách công việc theo tháng/mùa chi tiết]

## 3. Con Người Và Văn Hóa Vùng Sâm

[350-500 từ: trải nghiệm thực tế của kỹ sư hoặc người Xơ Đăng — không hoa mỹ]

> **Thực tế cần biết:** [một thách thức thực sự tại vườn — không che giấu khó khăn]

## 4. Tại Sao Không Thể Trồng Sâm Ở Nơi Khác

[350-500 từ: phân tích khoa học — đất, vi khí hậu, hệ sinh thái rừng nguyên sinh]

## 5. Câu Hỏi Thường Gặp

**Câu hỏi 1: [Câu hỏi về vườn / truy xuất]?**
[Trả lời 5-6 câu]

**Câu hỏi 2: [Câu hỏi 2]?**
[Trả lời 5-6 câu]

**Câu hỏi 3: [Câu hỏi 3]?**
[Trả lời 5-6 câu]

**Câu hỏi 4: [Câu hỏi 4]?**
[Trả lời 5-6 câu]

## 6. Kết Luận

[200-250 từ: tổng kết, lời kết chân thực]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",

    "D": """\
Vai trò: Chuyên gia Tư vấn Doanh nghiệp & Gifting cao cấp — Thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum).

Viết bài blog tiếng Việt CHUYÊN SÂU về: "{title}"
Nhóm: Quà Tặng Doanh Nghiệp & Hợp Tác. Nhắm Giám đốc điều hành / Trưởng phòng mua hàng.

CẤU TRÚC BẮT BUỘC:

# [Tiêu đề H1]

[Đoạn mở bài 200-250 từ: tại sao sâm Ngọc Linh là quà tặng chiến lược — giá trị, tính khan hiếm, ý nghĩa]

## 1. Giá Trị Chiến Lược Của Sâm Ngọc Linh Trong Văn Hóa Quà Tặng B2B

[350-500 từ: so sánh với quà tặng doanh nghiệp phổ biến, lý do thực tế — không sáo rỗng]

> **Lưu ý chuyên gia:** [tình huống thực tế sâm được chọn để tặng đối tác quan trọng]

## 2. Danh Mục Set Quà Và Bảng Giá Tham Khảo

[350-500 từ: mô tả chi tiết từng loại set]

| Loại Set | Thành phần chính | Giá tham khảo | Phù hợp với |
|---|---|---|---|
| [Set 1] | [Thành phần] | [Giá] | [Đối tượng] |
| [Set 2] | [Thành phần] | [Giá] | [Đối tượng] |
| [Set 3] | [Thành phần] | [Giá] | [Đối tượng] |
| [Set 4] | [Thành phần] | [Giá] | [Đối tượng] |

## 3. Quy Trình Đặt Hàng, Tùy Chỉnh Và Giao Nhận

[350-500 từ: từng bước cụ thể, thời gian sản xuất, tùy chỉnh bao bì]

> **Lưu ý đặt hàng sớm:** [thời gian cần thiết để có hàng đúng hạn — thông tin thực tế]

## 4. Chính Sách Hợp Tác Và Đại Lý

[350-500 từ: điều kiện hợp tác cụ thể, ưu đãi, cam kết hỗ trợ]

## 5. Câu Hỏi Thường Gặp

**Câu hỏi 1: [Về giá / số lượng tối thiểu]?**
[Trả lời 5-6 câu]

**Câu hỏi 2: [Về tùy chỉnh bao bì]?**
[Trả lời 5-6 câu]

**Câu hỏi 3: [Về thời gian giao hàng]?**
[Trả lời 5-6 câu]

**Câu hỏi 4: [Về chứng nhận xuất xứ]?**
[Trả lời 5-6 câu]

## 6. Kết Luận

[200-250 từ: tổng kết lý do chọn TA, lời kết thuyết phục]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",
}

# ─── AI PROVIDERS ──────────────────────────────────────────────────────────────
def _call_ollama(prompt, model="qwen2.5:1.5b"):
    import urllib.request
    body = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode()
    req = urllib.request.Request(
        "http://localhost:11434/api/generate",
        data=body, headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=360) as r:
        return json.loads(r.read()).get("response", "")

def _call_groq(prompt):
    import urllib.request
    if not GROQ_KEY:
        raise ValueError("no GROQ_API_KEY")
    body = json.dumps({
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7, "max_tokens": 6000,
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
        "temperature": 0.7, "max_tokens": 6000,
    }).encode()
    req = urllib.request.Request(
        "https://api.deepseek.com/v1/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())["choices"][0]["message"]["content"]

# ─── AUTO-CLASSIFY ─────────────────────────────────────────────────────────────
def _auto_classify(title):
    t = title.lower()
    if any(k in t for k in ["saponin","hplc","majonoside","ginsenoside","kiểm định","phân biệt","brc","orac","bioavailability"]):
        return "A"
    if any(k in t for k in ["ngâm","trà","rượu","liều","chế biến","uống","phụ nữ","thể thao","bài thuốc","cao tuổi","mùa"]):
        return "B"
    if any(k in t for k in ["vườn","núi","rừng","kỹ sư","canh tác","trà linh","nhật ký","văn hóa","xơ đăng","khí hậu","địa lý","nhân giống"]):
        return "C"
    if any(k in t for k in ["quà","doanh nghiệp","đại lý","hợp tác","set","xuất khẩu","bảng giá","premium","certificate"]):
        return "D"
    return "A"

# ─── GENERATE ──────────────────────────────────────────────────────────────────
def generate_content(title_vi, group, slug):
    prompt = PROMPTS[group].format(title=title_vi, rules=_RULES)
    raw_md = None
    provider_used = "none"

    try:
        log.info("[Ollama] Generating 2200+ words...")
        raw = _call_ollama(prompt).strip()
        raw = ''.join(c if ord(c) >= 32 or c in '\n\t' else ' ' for c in raw)
        wc = _word_count(raw)
        if wc >= 700:
            raw_md = raw
            provider_used = f"Ollama ({wc} words)"
            log.info(f"[Ollama] OK — {wc} words")
        else:
            log.warning(f"[Ollama] Only {wc} words — escalating to Groq")
    except Exception as e:
        log.warning(f"[Ollama] Failed: {e}")

    if raw_md is None:
        try:
            log.info("[Groq] Generating...")
            raw_md = _call_groq(prompt).strip()
            provider_used = f"Groq ({_word_count(raw_md)} words)"
            log.info(f"[Groq] OK — {_word_count(raw_md)} words")
        except Exception as e:
            log.warning(f"[Groq] Failed: {e}")

    if raw_md is None:
        try:
            log.info("[DeepSeek] Generating...")
            raw_md = _call_deepseek(prompt).strip()
            provider_used = f"DeepSeek ({_word_count(raw_md)} words)"
        except Exception as e:
            log.warning(f"[DeepSeek] Failed: {e}")

    if raw_md is None and GEMINI_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_KEY)
            log.info("[Gemini] Generating...")
            resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
            raw_md = resp.text.strip()
            provider_used = f"Gemini ({_word_count(raw_md)} words)"
        except Exception as e:
            log.warning(f"[Gemini] Failed: {e}")

    if raw_md is None:
        raise RuntimeError("All AI providers failed. Is Ollama running? Run: ollama serve")

    # Post-process: strip any anchor syntax the model emitted
    raw_md = _strip_anchors(raw_md)

    # Assemble: frontmatter + body + social share + CTA
    grp = MATRIX[group]
    reading_time_str = _reading_time(raw_md)
    excerpt_plain = re.sub(r'[#*`>|_\[\]<>]', '', raw_md[:300]).replace('\n', ' ').strip()[:180]

    social_share = build_social_share(slug)
    cta_line = grp["cta"]

    # Insert social share + CTA before copyright footer line
    if "*Bài viết được biên soạn" in raw_md:
        raw_md = raw_md.replace(
            "*Bài viết được biên soạn",
            f"{social_share}\n{cta_line}\n\n*Bài viết được biên soạn"
        )
    else:
        raw_md += f"\n{social_share}\n{cta_line}\n\n*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*"

    frontmatter = build_frontmatter(title_vi, excerpt_plain, reading_time_str, grp["label"])
    full_body = frontmatter + raw_md

    total_words = _word_count(full_body)
    log.info(f"[Content] {total_words} words via {provider_used}")

    return {
        "title_vi":         title_vi,
        "body_md":          full_body,
        "excerpt_vi":       excerpt_plain,
        "reading_time":     reading_time_str,
        "meta_description": f"{title_vi[:100]} — Sâm Ngọc Linh TA, vườn hữu cơ Trà Linh Kon Tum."[:160],
        "image_prompt":     f"Cinematic macro photo of fresh Ngoc Linh Vietnamese ginseng root, {grp['label']}, dark forest floor, Hasselblad 8K",
        "provider":         provider_used,
    }

# ─── COMPLIANCE ────────────────────────────────────────────────────────────────
def compliance_check(body):
    found = [w for w in FORBIDDEN if w.lower() in body.lower()]
    return f"FAIL: từ cấm = {found}" if found else "PASS"

# ─── VIDEO SCRIPT ──────────────────────────────────────────────────────────────
def generate_video_script(title_vi, group, slug, excerpt):
    grp = MATRIX[group]
    hooks = {
        "A": "Bạn có biết Sâm Ngọc Linh chứa 52 Saponin — nhiều hơn bất kỳ loài sâm nào trên thế giới?",
        "B": "Cách dùng sâm Ngọc Linh đúng để không lãng phí — nhiều người đang làm sai!",
        "C": "Bên trong khu rừng >1.800m — nơi duy nhất trên Trái Đất sâm Ngọc Linh tự mọc.",
        "D": "Set quà biếu 2025 — Sâm Ngọc Linh TA: sang trọng, truy xuất được, không lo hàng giả.",
    }
    script = {
        "slug": slug, "title": title_vi, "group": group,
        "group_label": grp["label"],
        "platform": "Facebook Reels / TikTok / Instagram Reels",
        "duration": "15-30 giây", "koc": "Mai — @VuonSamNhaKhanh",
        "segments": [
            {"id":"hook","duration":"0-3s","visual":"Close-up củ sâm tươi hoặc rừng Ngọc Linh sương sớm",
             "caption": hooks.get(group,""), "voiceover": hooks.get(group,""),
             "note": "Phải dừng scroll trong 2s đầu — hook mạnh"},
            {"id":"body","duration":"4-22s","visual":"B-roll vườn / sản phẩm / chế biến",
             "caption": excerpt[:120], "voiceover": excerpt[:100],
             "note": "Font overlay to, không nhạc ồn"},
            {"id":"cta","duration":"23-30s","visual":"Logo TA + URL",
             "caption": "Link trong Bio — Vườn Sâm Nhà Khánh",
             "voiceover": "Tìm hiểu tại tasamngoclinh.com — link trong bio",
             "note": "CTA rõ ràng, kêu gọi click"},
        ],
        "hashtags": ["#samngoclinh","#samngoclinhthật","#tasamngoclinh","#vuonsamNhaKhanh"],
        "blog_url": f"https://tasamngoclinh.com/blog/{slug}",
        "generated_at": datetime.now().isoformat(),
    }
    jp = VIDEO_DIR / f"{slug[:50]}.json"
    tp = VIDEO_DIR / f"{slug[:50]}.txt"
    with open(jp, "w", encoding="utf-8") as f:
        json.dump(script, f, ensure_ascii=False, indent=2)
    txt = [f"=== KỊCH BẢN VIDEO — {title_vi} ===", f"Platform: {script['platform']} | KOC: {script['koc']}", ""]
    for s in script["segments"]:
        txt += [f"[{s['id'].upper()} {s['duration']}]",
                f"Visual: {s['visual']}",
                f"Caption: {s['caption']}",
                f"Voiceover: {s['voiceover']}",
                f"Note: {s['note']}", ""]
    txt += [f"Hashtags: {' '.join(script['hashtags'])}", f"Blog: {script['blog_url']}"]
    with open(tp, "w", encoding="utf-8") as f:
        f.write('\n'.join(txt))
    log.info(f"[VideoScript] {jp.name}")
    return jp, tp

# ─── IMAGE ─────────────────────────────────────────────────────────────────────
def generate_image(title_vi, slug, group):
    try:
        from PIL import Image, ImageDraw, ImageFont
        BG = {"A":(10,40,30),"B":(30,20,10),"C":(20,15,35),"D":(15,25,40)}
        AC = {"A":(200,230,100),"B":(255,180,60),"C":(220,180,255),"D":(255,215,100)}
        bg, ac = BG.get(group,(10,40,30)), AC.get(group,(200,230,100))
        img = Image.new("RGB",(1200,675),color=bg)
        draw = ImageDraw.Draw(img)
        for y in range(675):
            a = int(y/675*60)
            draw.line([(0,y),(1200,y)], fill=tuple(max(0,c-a//3) for c in bg))
        draw.rectangle([(20,20),(1180,655)], outline=ac, width=2)
        try:
            fb = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", 50)
            fs = ImageFont.truetype("C:/Windows/Fonts/times.ttf", 20)
        except:
            fb = fs = ImageFont.load_default()
        words, lines, line = title_vi.split(), [], []
        for w in words:
            if len(" ".join(line+[w])) < 36:
                line.append(w)
            else:
                lines.append(" ".join(line)); line = [w]
        if line: lines.append(" ".join(line))
        y0 = max(140, 337 - len(lines)*60//2)
        for i, ln in enumerate(lines[:3]):
            draw.text((60, y0+i*68), ln, fill=ac, font=fb)
        lbl = {"A":"KHOA HỌC","B":"LIFESTYLE","C":"DI SẢN","D":"CAO CẤP"}.get(group,"TA")
        draw.text((60,580), f"TA SÂM NGỌC LINH  |  {lbl}", fill=(180,180,160), font=fs)
        draw.text((60,610), "tasamngoclinh.com", fill=tuple(c//2 for c in ac), font=fs)
        fn = f"featured-{slug[:40]}.webp"
        fp = Path(__file__).parent / fn
        img.save(fp, "WEBP", quality=80)
        log.info(f"[Image] {fn}")
        return str(fp), fn
    except Exception as e:
        log.warning(f"[Image] {e}")
        return None, None

# ─── SUPABASE ──────────────────────────────────────────────────────────────────
def upload_image(local_path, filename):
    if not local_path or not Path(local_path).exists():
        return ""
    try:
        import requests
        with open(local_path, "rb") as f:
            data = f.read()
        r = requests.post(
            f"{SUPA_URL}/storage/v1/object/blog-images/{filename}",
            data=data,
            headers={"apikey":SUPA_KEY,"Authorization":f"Bearer {SUPA_KEY}","Content-Type":"image/webp"},
            timeout=20,
        )
        if r.status_code in (200, 201):
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
        "title": post_data["title_vi"],
        "title_vi": post_data["title_vi"],
        "slug": slug,
        "slug_vi": slug,
        "body": post_data["body_md"],
        "excerpt": post_data["excerpt_vi"][:200],
        "excerpt_vi": post_data["excerpt_vi"][:200],
        "featured_image_url": img_url,
        "category": MATRIX[group]["category"],
        "published": False,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "meta_description": post_data["meta_description"],
        "compliance_check": compliance,
        "reading_time": post_data.get("reading_time", ""),
        "author": "Đội Ngũ Nghiên Cứu TA",
    }
    r = requests.post(
        f"{SUPA_URL}/rest/v1/blog_posts",
        json=payload,
        headers={"apikey":SUPA_KEY,"Authorization":f"Bearer {SUPA_KEY}","Content-Type":"application/json","Prefer":"return=representation"},
        timeout=15,
    )
    if r.status_code == 201:
        ins = r.json()
        ins = ins[0] if isinstance(ins, list) else ins
        log.info(f"[Supabase] OK id={ins.get('id','?')}")
        return ins.get("id", post_id), slug
    raise RuntimeError(f"[Supabase] {r.status_code}: {r.text[:200]}")

def send_telegram(title, group, slug, compliance, provider, video_json):
    if not TG_TOKEN or not TG_CHAT:
        return
    try:
        import requests
        icon = "✅" if compliance == "PASS" else "⚠️"
        msg = (
            f"{icon} BÀI VIẾT MỚI — {MATRIX[group]['label']}\n\n"
            f"📌 {title}\n"
            f"📋 Compliance: {compliance}\n"
            f"🤖 Provider: {provider}\n"
            f"🎬 Script: {video_json.name if video_json else '—'}\n\n"
            f"🔗 Preview: https://tasamngoclinh.com/blog/{slug}\n"
            f"📊 Admin: https://tasamngoclinh.com/blog-admin.html\n\n"
            f"⏳ Đợi duyệt → publish\n"
            f"— Blog Engine v8.0 | {datetime.now().strftime('%d/%m %H:%M')}"
        )
        requests.post(
            f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id": TG_CHAT, "text": msg},
            timeout=10,
        )
        log.info("[Telegram] sent")
    except Exception as e:
        log.warning(f"[Telegram] {e}")

# ─── PIPELINE ──────────────────────────────────────────────────────────────────
def run_one(title_vi, group, slug, label=""):
    log.info("="*60)
    log.info(f"Group {group} | {MATRIX[group]['label']} | {title_vi[:55]}")
    log.info("="*60)

    post_data  = generate_content(title_vi, group, slug)
    compliance = compliance_check(post_data["body_md"])
    if compliance.startswith("FAIL"):
        log.warning(f"[Compliance] {compliance} — bài DRAFT, verify trước publish")

    img_path, img_fn = generate_image(title_vi, slug, group)
    img_url = upload_image(img_path, img_fn) if img_path else ""
    blog_id, final_slug = insert_db(post_data, slug, group, img_url, compliance)
    video_json, _ = generate_video_script(title_vi, group, slug, post_data["excerpt_vi"])
    send_telegram(title_vi, group, final_slug, compliance, post_data.get("provider","?"), video_json)

    wc = _word_count(post_data["body_md"])
    print(f"\n  {label}DONE | {wc} words | {post_data.get('provider','?')}")
    print(f"  Preview:  https://tasamngoclinh.com/blog/{final_slug}")
    print(f"  Admin:    https://tasamngoclinh.com/blog-admin.html")
    print(f"  Script:   {video_json}\n")
    return blog_id, final_slug

# ─── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="TA Blog Engine v8.0")
    parser.add_argument("--auto",  action="store_true", help="Auto round-robin topic")
    parser.add_argument("--topic", default="", help="Custom title/keyword")
    parser.add_argument("--group", choices=["A","B","C","D"], default=None)
    parser.add_argument("--batch", type=int, default=0, help="Generate N posts")
    args = parser.parse_args()

    if args.batch > 0:
        n = min(args.batch, 10)
        log.info(f"[Batch] Generating {n} posts...")
        for i in range(n):
            title_vi, slug, group = get_next_topic()
            try:
                run_one(title_vi, group, slug, label=f"({i+1}/{n}) ")
            except Exception as e:
                log.error(f"[Batch] Post {i+1} failed: {e}")
        return

    if args.topic:
        title_vi = args.topic.strip()
        group = args.group or _auto_classify(title_vi)
        slug = _slug(title_vi)
        log.info(f"[Custom] Group {group}: {MATRIX[group]['label']}")
        run_one(title_vi, group, slug)
        return

    title_vi, slug, group = get_next_topic(args.group)
    run_one(title_vi, group, slug)

if __name__ == "__main__":
    main()
