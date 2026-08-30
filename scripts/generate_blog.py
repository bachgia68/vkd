#!/usr/bin/env python3
"""
TA Blog Engine v6.0
Executive Content Quality · YAML Frontmatter · Markdown TOC · 2000+ Words · Supabase · Telegram
"""

import os, sys, json, uuid, re, argparse, logging
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

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
        "cta": "🛒 **Đặt ngay:** [Sâm ngâm mật mỡ gà TA](https://tasamngoclinh.com/san-pham/sam-ngam-mat-ong) và [Trà sâm Ngọc Linh](https://tasamngoclinh.com/san-pham/tra-sam-ngoc-linh)",
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
        "cta": "🌿 **Tìm hiểu thêm:** [Vườn Sâm Nhà Khánh](https://tasamngoclinh.com/gioi-thieu) — canh tác hữu cơ chuẩn rừng tại núi Ngọc Linh >1.800m",
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
            ("Trà Linh — Thủ Phủ Sâm Ngọc Linh: Hướng Dẫn Đến Và Mua Sâm Thật",       "tra-linh-thu-phu-sam-huong-dan"),
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
        "cta": "📦 **Liên hệ tư vấn:** [Hợp tác & Đại lý TA](https://tasamngoclinh.com/hop-tac) — chính sách minh bạch, hỗ trợ marketing đầy đủ",
        "internal": {
            "set quà":       "https://tasamngoclinh.com/qua-tang",
            "hợp tác":       "https://tasamngoclinh.com/hop-tac",
            "đại lý":        "https://tasamngoclinh.com/hop-tac",
            "sản phẩm ta":   "https://tasamngoclinh.com/san-pham",
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

# ─── MARKDOWN BUILDERS ─────────────────────────────────────────────────────────
def build_frontmatter(title, excerpt, reading_time, category_label):
    return f"""---
title: "{title}"
excerpt: "{excerpt}"
reading_time: "{reading_time}"
category: "{category_label}"
author: "Đội Ngũ Nghiên Cứu TA"
---
"""

def build_toc(sections):
    lines = ["---", "📋 **Mục lục**"]
    for i, name in enumerate(sections, 1):
        anchor = f"s{i}"
        lines.append(f"- [{i}. {name}](#{anchor})")
    lines += ["- [Câu Hỏi Thường Gặp](#sfaq)", "- [Kết Luận](#skl)", "---"]
    return "\n".join(lines)

# ─── PROMPTS ───────────────────────────────────────────────────────────────────
# Each prompt enforces 2000-2500 words with 5 sections × 300-450 words each.
# The model is instructed to write only the body markdown (no frontmatter).

_COMMON_RULES = """
QUY TẮC TUYỆT ĐỐI:
- KHÔNG ĐƯỢC: điều trị, chữa khỏi, hết bệnh, hiệu quả 100%, bảo đảm khỏi
- ĐƯỢC DÙNG: hỗ trợ, theo nghiên cứu, dữ liệu ghi nhận, cần tham vấn chuyên gia
- Số liệu phải có cơ sở — cite nguồn thực (Viện Dược liệu VN, Journal of Natural Products, PubMed, DĐVN)
- Không bịa tên bác sĩ, không bịa tên nghiên cứu
- Mỗi đoạn văn tối đa 4 dòng
- Chỉ viết nội dung bài, KHÔNG thêm ghi chú ngoài
"""

PROMPTS = {
    "A": """\
Vai trò: Chuyên gia Phân tích Dược liệu cao cấp — Thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum).

Viết bài blog tiếng Việt CHUYÊN SÂU về chủ đề: "{title}"
Nhóm: Tri Thức Sâm — Khoa Học & Phân Biệt

BẮT BUỘC đủ 2.000 - 2.500 từ. Mỗi thẻ ## phải có tối thiểu 300 - 450 từ phân tích thực chất.

CẤU TRÚC BẮT BUỘC — viết đúng định dạng markdown sau:

# [Tiêu đề H1 — giống title, thêm từ khóa phụ nếu cần]

[Đoạn mở bài 200-250 từ: đi thẳng vào bản chất khoa học, thể hiện vị thế độc tôn của Sâm Ngọc Linh, giọng chuyên gia điềm đặn]

## 🔬 1. [Bản Chất Khoa Học Hoạt Chất] {{#s1}}

[300-450 từ: giải thích cơ chế phân tử, cấu trúc hóa học, tại sao quan trọng — dẫn nguồn thực]

> 💡 **Lưu ý chuyên gia:** [insight thực, không bịa số]

### [Sub-section 1.1 — phân tích chi tiết hơn]
[120-150 từ với danh sách hoặc bảng]

## 🧪 2. [Tiêu Chuẩn Kiểm Định & So Sánh] {{#s2}}

[300-450 từ: quy trình HPLC, BRC Standard, dữ liệu định lượng thực tế]

| Tiêu chí | Sâm Ngọc Linh TA | So sánh |
|---|---|---|
| [Chỉ số 1] | [Số liệu thực] | [So sánh] |
| [Chỉ số 2] | [Số liệu thực] | [So sánh] |
| [Chỉ số 3] | [Số liệu thực] | [So sánh] |
| [Chỉ số 4] | [Số liệu thực] | [So sánh] |
| [Chỉ số 5] | [Số liệu thực] | [So sánh] |

## 📈 3. [Phân Tích Thực Tế Tại Vườn / Quy Trình Thực Địa] {{#s3}}

[300-450 từ: kinh nghiệm thực tế từ Vườn Sâm Trà Linh, quy trình canh tác ảnh hưởng đến chất lượng]

> ⚠️ **Phân biệt sâm thật:** [cảnh báo cụ thể về hàng giả / sâm kém chất lượng]

### [Sub-section 3.1 — dấu hiệu nhận biết cụ thể]
[100-130 từ với danh sách bullet]

## 🌍 4. [Góc Nhìn Tổng Quan & Ứng Dụng Thực Tế] {{#s4}}

[300-450 từ: bức tranh tổng quan, tại sao Sâm Ngọc Linh đứng đầu, ứng dụng thực tế cho người dùng]

## ❓ Câu Hỏi Thường Gặp {{#sfaq}}

**Q: [Câu hỏi thực tế 1 — người mua hay hỏi nhất]?**
A: [Trả lời 4-5 câu đầy đủ, thực tế, không hời hợt]

**Q: [Câu hỏi 2]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 3]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 4]?**
A: [Trả lời 4-5 câu]

## ✅ Kết Luận {{#skl}}

[150-200 từ: tổng kết giá trị cốt lõi, lời kết điềm đặn — không sáo rỗng]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Số liệu tham chiếu từ các công trình khoa học công bố trên PubMed và tạp chí Dược liệu Việt Nam. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",

    "B": """\
Vai trò: Chuyên gia Y học Cổ truyền & Dinh dưỡng cao cấp — Thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum).

Viết bài blog tiếng Việt CHUYÊN SÂU về chủ đề: "{title}"
Nhóm: Bài Thuốc, Sức Khỏe & Lifestyle

BẮT BUỘC đủ 2.000 - 2.500 từ. Mỗi thẻ ## phải có tối thiểu 300 - 450 từ.

CẤU TRÚC BẮT BUỘC — viết đúng định dạng markdown:

# [Tiêu đề H1]

[Đoạn mở bài 200-250 từ: tại sao phương pháp này quan trọng, ai nên đọc, giá trị thực tế]

## 🌿 1. [Nguyên Lý & Lý Do Chọn Phương Pháp Này] {{#s1}}

[300-450 từ: giải thích khoa học đằng sau phương pháp — không viết chung chung]

> 💡 **Lưu ý chuyên gia:** [insight từ kinh nghiệm thực tế tại Vườn Sâm Nhà Khánh]

### [Sub-section 1.1 — phân tích chi tiết]
[Ai phù hợp, ai nên thận trọng — danh sách rõ ràng]

## 🧪 2. [Nguyên Liệu, Dụng Cụ & Chuẩn Bị] {{#s2}}

[300-450 từ: nguyên liệu cụ thể với số lượng, dụng cụ cần thiết, lưu ý mua nguyên liệu đúng chất lượng]

| Nguyên liệu | Số lượng / Quy cách | Ghi chú chất lượng |
|---|---|---|
| [NL 1] | [SL] | [Ghi chú] |
| [NL 2] | [SL] | [Ghi chú] |
| [NL 3] | [SL] | [Ghi chú] |
| [NL 4] | [SL] | [Ghi chú] |

## 📋 3. [Hướng Dẫn Từng Bước Chi Tiết] {{#s3}}

[300-450 từ: các bước cụ thể đánh số 1, 2, 3... với thao tác, thời gian, nhiệt độ, dấu hiệu nhận biết]

> ⚠️ **Lưu ý quan trọng:** [cảnh báo sai lầm phổ biến nhất]

## 📊 4. [Bảng Liều Dùng Và Đối Tượng Sử Dụng] {{#s4}}

[300-450 từ: phân tích chi tiết liều dùng theo từng nhóm đối tượng]

| Đối tượng | Liều lượng | Thời điểm tốt nhất | Lưu ý riêng |
|---|---|---|---|
| [Đối tượng 1] | [Liều] | [Thời điểm] | [Lưu ý] |
| [Đối tượng 2] | [Liều] | [Thời điểm] | [Lưu ý] |
| [Đối tượng 3] | [Liều] | [Thời điểm] | [Lưu ý] |
| [Đối tượng 4] | [Liều] | [Thời điểm] | [Lưu ý] |

## ❓ Câu Hỏi Thường Gặp {{#sfaq}}

**Q: [Câu hỏi 1 — thực tế nhất]?**
A: [Trả lời 4-5 câu đầy đủ]

**Q: [Câu hỏi 2]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 3]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 4]?**
A: [Trả lời 4-5 câu]

## ✅ Kết Luận {{#skl}}

[150-200 từ: tổng kết lời khuyên thực tế, lời kết chân thực]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",

    "C": """\
Vai trò: Phóng viên Thực địa & Chuyên gia Nông nghiệp Hữu cơ — Thương hiệu TA Sâm Ngọc Linh (Vườn Sâm Nhà Khánh, núi Ngọc Linh >1.800m).

Viết bài blog tiếng Việt CHUYÊN SÂU về chủ đề: "{title}"
Nhóm: Đời Sống Vườn Sâm & Văn Hóa

BẮT BUỘC đủ 2.000 - 2.500 từ. Mỗi thẻ ## ít nhất 300 - 450 từ. Viết như phóng sự thực địa — cụ thể, chân thực.

CẤU TRÚC BẮT BUỘC — viết đúng định dạng markdown:

# [Tiêu đề H1]

[Đoạn mở bài 200-250 từ: cảnh quan, bầu không khí, lý do vùng đất này đặc biệt — viết sống động như người đứng tại chỗ]

## 🏔️ 1. [Địa Lý, Khí Hậu & Điều Kiện Sinh Thái Độc Đáo] {{#s1}}

[300-450 từ: số liệu cụ thể: độ cao m, nhiệt độ °C, độ ẩm %, lượng mưa mm/năm, thành phần đất — giải thích tại sao tạo ra sâm quý]

| Yếu tố | Vùng Ngọc Linh | So sánh vùng khác |
|---|---|---|
| [Yếu tố 1] | [Số liệu] | [So sánh] |
| [Yếu tố 2] | [Số liệu] | [So sánh] |
| [Yếu tố 3] | [Số liệu] | [So sánh] |

> 💡 **Góc nhìn thực tế:** [quan sát cụ thể từ kỹ sư vườn hoặc người Xơ Đăng]

## 🌱 2. [Quy Trình Canh Tác Thực Tế Tại Vườn] {{#s2}}

[300-450 từ: từng bước canh tác theo mùa, công việc cụ thể, quyết định kỹ thuật thực tế]

### [Sub-section 2.1 — lịch canh tác theo mùa]
[Bảng hoặc danh sách công việc theo tháng/mùa]

## 👁️ 3. [Câu Chuyện Người Thật & Văn Hóa Vùng Sâm] {{#s3}}

[300-450 từ: trải nghiệm thực tế của kỹ sư vườn hoặc người dân Xơ Đăng — không hoa mỹ, không quảng cáo]

> ⚠️ **Thực tế cần biết:** [một thách thức thực sự tại vườn — không che giấu khó khăn]

## 🔍 4. [Tại Sao Không Thể Nhân Rộng Ra Vùng Khác] {{#s4}}

[300-450 từ: phân tích khoa học: đất, vi khí hậu, hệ sinh thái rừng nguyên sinh — tại sao các yếu tố này không thể tái tạo]

## ❓ Câu Hỏi Thường Gặp {{#sfaq}}

**Q: [Câu hỏi thực tế 1 về vườn / truy xuất]?**
A: [Trả lời 4-5 câu đầy đủ]

**Q: [Câu hỏi 2]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 3]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 4]?**
A: [Trả lời 4-5 câu]

## ✅ Kết Luận {{#skl}}

[150-200 từ: tổng kết bức tranh, lời kết chân thực — không sáo rỗng]

*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*
{rules}""",

    "D": """\
Vai trò: Chuyên gia Tư vấn Doanh nghiệp & Gifting cao cấp — Thương hiệu TA Sâm Ngọc Linh (vườn hữu cơ Trà Linh, Kon Tum).

Viết bài blog tiếng Việt CHUYÊN SÂU về chủ đề: "{title}"
Nhóm: Quà Tặng Doanh Nghiệp & Hợp Tác

BẮT BUỘC đủ 2.000 - 2.500 từ. Mỗi thẻ ## ít nhất 300 - 450 từ. Nhắm đến Giám đốc điều hành hoặc Trưởng phòng mua hàng.

CẤU TRÚC BẮT BUỘC — viết đúng định dạng markdown:

# [Tiêu đề H1]

[Đoạn mở bài 200-250 từ: tại sao sâm Ngọc Linh là quà tặng doanh nghiệp chiến lược — giá trị, tính khan hiếm, ý nghĩa văn hóa]

## 🎁 1. [Tại Sao Chọn Sâm Ngọc Linh — Phân Tích Giá Trị] {{#s1}}

[300-450 từ: so sánh với các loại quà tặng doanh nghiệp phổ biến, lý do thực tế — không sáo rỗng]

> 💡 **Góc nhìn doanh nhân:** [tình huống thực tế sâm được chọn để tặng đối tác]

## 📦 2. [Danh Mục Set Quà & Bảng Giá Tham Khảo] {{#s2}}

[300-450 từ: mô tả chi tiết từng loại set]

| Loại Set | Thành Phần | Giá Tham Khảo | Phù Hợp Với |
|---|---|---|---|
| [Set 1] | [Thành phần] | [Giá] | [Đối tượng] |
| [Set 2] | [Thành phần] | [Giá] | [Đối tượng] |
| [Set 3] | [Thành phần] | [Giá] | [Đối tượng] |
| [Set 4] | [Thành phần] | [Giá] | [Đối tượng] |

## 📋 3. [Quy Trình Đặt Hàng, Tùy Chỉnh & Giao Nhận] {{#s3}}

[300-450 từ: từng bước cụ thể, thời gian sản xuất, tùy chỉnh bao bì, chính sách giao nhận]

> ⚠️ **Lưu ý đặt hàng sớm:** [thời gian cần thiết để có hàng đúng hạn]

## 🤝 4. [Chính Sách Hợp Tác & Đại Lý] {{#s4}}

[300-450 từ: điều kiện hợp tác cụ thể, ưu đãi, cam kết hỗ trợ marketing, case study thực tế]

## ❓ Câu Hỏi Thường Gặp {{#sfaq}}

**Q: [Câu hỏi 1 — về giá / số lượng tối thiểu]?**
A: [Trả lời 4-5 câu đầy đủ]

**Q: [Câu hỏi 2 — về tùy chỉnh bao bì]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 3 — về thời gian giao hàng]?**
A: [Trả lời 4-5 câu]

**Q: [Câu hỏi 4 — về chứng nhận xuất xứ]?**
A: [Trả lời 4-5 câu]

## ✅ Kết Luận {{#skl}}

[150-200 từ: tổng kết lý do chọn TA, lời kết thuyết phục — không sáo rỗng]

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

# ─── GENERATE CONTENT ──────────────────────────────────────────────────────────
def _extract_sections(body_md):
    return re.findall(r'^## .+? \d+\. (.+?) \{', body_md, re.MULTILINE)[:4]

def _auto_classify(title):
    t = title.lower()
    if any(k in t for k in ["saponin","hplc","majonoside","ginsenoside","kiểm định","phân biệt","brc","orac"]):
        return "A"
    if any(k in t for k in ["ngâm","trà","rượu","liều","chế biến","uống","phụ nữ","thể thao","bài thuốc"]):
        return "B"
    if any(k in t for k in ["vườn","núi","rừng","kỹ sư","canh tác","trà linh","nhật ký","văn hóa","xơ đăng","khí hậu","địa lý"]):
        return "C"
    if any(k in t for k in ["quà","doanh nghiệp","đại lý","hợp tác","set","xuất khẩu","bảng giá","premium"]):
        return "D"
    return "A"

def generate_content(title_vi, group, slug):
    prompt_template = PROMPTS[group].format(title=title_vi, rules=_COMMON_RULES)
    raw_md = None
    provider_used = "none"

    # 1. Ollama — primary (local, free, always available)
    try:
        log.info("[Ollama] Generating 2000+ word executive content...")
        raw = _call_ollama(prompt_template).strip()
        raw = ''.join(c if ord(c) >= 32 or c in '\n\t' else ' ' for c in raw)
        wc = _word_count(raw)
        if wc >= 600:
            raw_md = raw
            provider_used = f"Ollama ({wc} words)"
            log.info(f"[Ollama] OK — {wc} words")
        else:
            log.warning(f"[Ollama] Only {wc} words — trying Groq for full 2000w content")
    except Exception as e:
        log.warning(f"[Ollama] Failed: {e}")

    # 2. Groq — fast free fallback (llama-3.3-70b handles 2000w well)
    if raw_md is None:
        try:
            log.info("[Groq] Generating...")
            raw_md = _call_groq(prompt_template).strip()
            provider_used = f"Groq ({_word_count(raw_md)} words)"
            log.info(f"[Groq] OK — {_word_count(raw_md)} words")
        except Exception as e:
            log.warning(f"[Groq] Failed: {e}")

    # 3. DeepSeek fallback
    if raw_md is None:
        try:
            log.info("[DeepSeek] Generating...")
            raw_md = _call_deepseek(prompt_template).strip()
            provider_used = f"DeepSeek ({_word_count(raw_md)} words)"
            log.info(f"[DeepSeek] OK")
        except Exception as e:
            log.warning(f"[DeepSeek] Failed: {e}")

    # 4. Gemini last resort
    if raw_md is None and GEMINI_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_KEY)
            log.info("[Gemini] Generating...")
            resp = client.models.generate_content(model="gemini-2.0-flash", contents=prompt_template)
            raw_md = resp.text.strip()
            provider_used = f"Gemini ({_word_count(raw_md)} words)"
            log.info(f"[Gemini] OK")
        except Exception as e:
            log.warning(f"[Gemini] Failed: {e}")

    if raw_md is None:
        raise RuntimeError("All AI providers failed — is Ollama running? Run: ollama serve")

    # ── Assemble full post with YAML frontmatter + TOC + body + CTA ────────────
    grp = MATRIX[group]
    reading_time_str = _reading_time(raw_md)
    excerpt = re.sub(r'<[^>]+>', '', raw_md[:250]).replace('\n', ' ').strip()

    sections = _extract_sections(raw_md)
    if not sections:
        # Fallback: extract raw H2 text
        sections = re.findall(r'^## .+? \d+\. (.+?)(?:\s*\{|$)', raw_md, re.MULTILINE)[:4]

    frontmatter = build_frontmatter(title_vi, excerpt[:180], reading_time_str, grp["label"])
    toc_md = build_toc(sections if sections else ["Phần 1", "Phần 2", "Phần 3", "Phần 4"])

    # Insert TOC after first ## heading or after intro
    toc_inserted = False
    lines = raw_md.split('\n')
    result_lines = []
    para_count = 0
    for line in lines:
        result_lines.append(line)
        if not toc_inserted and line.startswith('## '):
            # Insert TOC before first H2
            result_lines.insert(-1, '\n' + toc_md + '\n')
            toc_inserted = True
    if not toc_inserted:
        raw_md = toc_md + '\n\n' + raw_md
    else:
        raw_md = '\n'.join(result_lines)

    # Add CTA before copyright footer
    cta_line = grp["cta"]
    if "Kết Luận" in raw_md and "*Bài viết" in raw_md:
        raw_md = raw_md.replace(
            "*Bài viết",
            f"\n{cta_line}\n\n*Bài viết"
        )
    else:
        raw_md += f"\n\n{cta_line}\n\n*Bài viết được biên soạn bởi Đội Ngũ Nghiên Cứu TA. Không thay thế tư vấn y tế chuyên nghiệp.*"

    full_body = frontmatter + raw_md

    log.info(f"[Content] Total: {_word_count(full_body)} words via {provider_used}")

    return {
        "title_vi":          title_vi,
        "body_md":           full_body,
        "excerpt_vi":        excerpt[:200],
        "reading_time":      reading_time_str,
        "faq_list":          [],
        "meta_description":  f"{title_vi[:100]} — Sâm Ngọc Linh TA, vườn hữu cơ Trà Linh Kon Tum."[:160],
        "image_prompt":      f"Cinematic macro photo of fresh Ngoc Linh Vietnamese ginseng root, {grp['label']}, dark forest floor, Hasselblad 8K",
        "compliance_check":  "PASS",
        "provider":          provider_used,
    }

# ─── COMPLIANCE ────────────────────────────────────────────────────────────────
def compliance_check(body):
    found = [w for w in FORBIDDEN if w.lower() in body.lower()]
    return f"FAIL: từ cấm = {found}" if found else "PASS"

# ─── VIDEO SCRIPT ──────────────────────────────────────────────────────────────
def generate_video_script(title_vi, group, slug, excerpt):
    grp = MATRIX[group]
    hooks = {
        "A": f"Bạn có biết Sâm Ngọc Linh chứa 52 Saponin — nhiều hơn bất kỳ loài sâm nào trên thế giới?",
        "B": f"Cách dùng sâm Ngọc Linh đúng để không lãng phí — nhiều người đang làm sai!",
        "C": f"Bên trong khu rừng >1.800m — nơi duy nhất trên Trái Đất sâm Ngọc Linh tự mọc.",
        "D": f"Set quà biếu 2025 — Sâm Ngọc Linh TA: sang trọng, truy xuất được, không lo hàng giả.",
    }
    script = {
        "slug": slug, "title": title_vi, "group": group,
        "group_label": grp["label"],
        "platform": "Facebook Reels / TikTok / Instagram Reels",
        "duration": "15–30 giây", "koc": "Mai — @VuonSamNhaKhanh",
        "segments": [
            {"id":"hook","duration":"0–3s","visual":"Close-up củ sâm tươi hoặc rừng Ngọc Linh sương sớm",
             "caption": hooks.get(group,""), "voiceover": hooks.get(group,""),
             "note": "Phải dừng scroll trong 2s đầu — hook mạnh"},
            {"id":"body","duration":"4–22s","visual":"B-roll vườn / sản phẩm / chế biến",
             "caption": excerpt[:120], "voiceover": excerpt[:100],
             "note": "Font overlay to, không nhạc ồn"},
            {"id":"cta","duration":"23–30s","visual":"Logo TA + URL",
             "caption": "Link trong Bio — Vườn Sâm Nhà Khánh ✅",
             "voiceover": "Tìm hiểu tại tasamngoclinh.com — link trong bio",
             "note": "CTA rõ ràng, kêu gọi click"},
        ],
        "hashtags": ["#samngoclinh","#samngoclinhthật","#tasamngoclinh","#vuonsamNhaKhanh",f"#{slug[:20].replace('-','')}"],
        "blog_url": f"https://tasamngoclinh.com/blog/{slug}",
        "generated_at": datetime.now().isoformat(),
    }
    jp = VIDEO_DIR / f"{slug[:50]}.json"
    tp = VIDEO_DIR / f"{slug[:50]}.txt"
    with open(jp,"w",encoding="utf-8") as f: json.dump(script,f,ensure_ascii=False,indent=2)
    txt = [f"=== KỊCH BẢN VIDEO — {title_vi} ===",f"Platform: {script['platform']} | KOC: {script['koc']}",""]
    for s in script["segments"]:
        txt += [f"[{s['id'].upper()} {s['duration']}]",f"Visual: {s['visual']}",
                f"Caption: {s['caption']}",f"Voiceover: {s['voiceover']}",f"Note: {s['note']}",""]
    txt += [f"Hashtags: {' '.join(script['hashtags'])}",f"Blog: {script['blog_url']}"]
    with open(tp,"w",encoding="utf-8") as f: f.write('\n'.join(txt))
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
            a=int(y/675*60); draw.line([(0,y),(1200,y)],fill=tuple(max(0,c-a//3) for c in bg))
        draw.rectangle([(20,20),(1180,655)],outline=ac,width=2)
        try:
            fb=ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf",50)
            fs=ImageFont.truetype("C:/Windows/Fonts/times.ttf",20)
        except:
            fb=fs=ImageFont.load_default()
        words,lines,line=title_vi.split(),[],[]
        for w in words:
            if len(" ".join(line+[w]))<36: line.append(w)
            else: lines.append(" ".join(line)); line=[w]
        if line: lines.append(" ".join(line))
        y0=max(140,337-len(lines)*60//2)
        for i,ln in enumerate(lines[:3]): draw.text((60,y0+i*68),ln,fill=ac,font=fb)
        lbl={"A":"KHOA HỌC","B":"LIFESTYLE","C":"DI SẢN","D":"CAO CẤP"}.get(group,"TA")
        draw.text((60,580),f"TA SÂM NGỌC LINH  |  {lbl}",fill=(180,180,160),font=fs)
        draw.text((60,610),"tasamngoclinh.com",fill=tuple(c//2 for c in ac),font=fs)
        fn=f"featured-{slug[:40]}.webp"; fp=Path(__file__).parent/fn
        img.save(fp,"WEBP",quality=80)
        log.info(f"[Image] {fn}"); return str(fp),fn
    except Exception as e:
        log.warning(f"[Image] {e}"); return None,None

# ─── SUPABASE ──────────────────────────────────────────────────────────────────
def upload_image(local_path, filename):
    if not local_path or not Path(local_path).exists(): return ""
    try:
        import requests
        with open(local_path,"rb") as f: data=f.read()
        r=requests.post(f"{SUPA_URL}/storage/v1/object/blog-images/{filename}",data=data,
            headers={"apikey":SUPA_KEY,"Authorization":f"Bearer {SUPA_KEY}","Content-Type":"image/webp"},timeout=20)
        if r.status_code in(200,201):
            url=f"{SUPA_URL}/storage/v1/object/public/blog-images/{filename}"
            log.info(f"[Storage] {url}"); return url
        log.warning(f"[Storage] {r.status_code}: {r.text[:100]}")
    except Exception as e: log.warning(f"[Storage] {e}")
    return ""

def insert_db(post_data, slug, group, img_url, compliance):
    import requests
    post_id=str(uuid.uuid4())
    payload={
        "id":post_id, "title":post_data["title_vi"], "title_vi":post_data["title_vi"],
        "slug":slug, "slug_vi":slug,
        "body":post_data["body_md"],
        "excerpt":post_data["excerpt_vi"][:200], "excerpt_vi":post_data["excerpt_vi"][:200],
        "featured_image_url":img_url,
        "category":MATRIX[group]["category"],
        "published":False,
        "created_at":datetime.utcnow().isoformat()+"Z",
        "meta_description":post_data["meta_description"],
        "compliance_check":compliance,
        "reading_time":post_data.get("reading_time",""),
        "author":"Đội Ngũ Nghiên Cứu TA",
    }
    r=requests.post(f"{SUPA_URL}/rest/v1/blog_posts",json=payload,
        headers={"apikey":SUPA_KEY,"Authorization":f"Bearer {SUPA_KEY}","Content-Type":"application/json","Prefer":"return=representation"},
        timeout=15)
    if r.status_code==201:
        ins=r.json(); ins=ins[0] if isinstance(ins,list) else ins
        log.info(f"[Supabase] OK id={ins.get('id','?')}"); return ins.get("id",post_id),slug
    raise RuntimeError(f"[Supabase] {r.status_code}: {r.text[:200]}")

def send_telegram(title, group, slug, blog_id, compliance, provider, video_json):
    if not TG_TOKEN or not TG_CHAT: return
    try:
        import requests
        icon="✅" if compliance=="PASS" else "⚠️"
        msg=(f"{icon} BÀI VIẾT MỚI — {MATRIX[group]['label']}\n\n"
             f"📌 {title}\n"
             f"📋 Compliance: {compliance}\n"
             f"🤖 Provider: {provider}\n"
             f"🎬 Script: {video_json.name if video_json else '—'}\n\n"
             f"🔗 Preview: https://tasamngoclinh.com/blog/{slug}\n"
             f"📊 Admin: https://tasamngoclinh.com/blog-admin.html\n\n"
             f"⏳ Đợi duyệt → publish\n"
             f"— Blog Engine v6.0 | {datetime.now().strftime('%d/%m %H:%M')}")
        r=requests.post(f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
            json={"chat_id":TG_CHAT,"text":msg},timeout=10)
        log.info(f"[Telegram] {'✅' if r.status_code==200 else r.status_code}")
    except Exception as e: log.warning(f"[Telegram] {e}")

# ─── PIPELINE ──────────────────────────────────────────────────────────────────
def run_one(title_vi, group, slug, label=""):
    log.info("="*60)
    log.info(f"Group {group} | {MATRIX[group]['label']} | {title_vi[:55]}")
    log.info("="*60)

    post_data  = generate_content(title_vi, group, slug)
    compliance = compliance_check(post_data["body_md"])
    if compliance.startswith("FAIL"):
        log.warning(f"[Compliance] {compliance} — bài DRAFT, Joe verify trước publish")

    img_path, img_fn = generate_image(title_vi, slug, group)
    img_url    = upload_image(img_path, img_fn) if img_path else ""
    blog_id, final_slug = insert_db(post_data, slug, group, img_url, compliance)
    video_json, _ = generate_video_script(title_vi, group, slug, post_data["excerpt_vi"])
    send_telegram(title_vi, group, final_slug, blog_id, compliance, post_data.get("provider","?"), video_json)

    print(f"\n  ✅ {label}DONE | {_word_count(post_data['body_md'])} words")
    print(f"     Preview:  https://tasamngoclinh.com/blog/{final_slug}")
    print(f"     Admin:    https://tasamngoclinh.com/blog-admin.html")
    print(f"     Script:   {video_json}\n")
    return blog_id, final_slug

# ─── MAIN ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="TA Blog Engine v6.0")
    parser.add_argument("--auto",   action="store_true", help="Auto round-robin topic")
    parser.add_argument("--topic",  default="", help="Custom title/keyword")
    parser.add_argument("--group",  choices=["A","B","C","D"], default=None)
    parser.add_argument("--batch",  type=int, default=0, help="Generate N posts")
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
        group    = args.group or _auto_classify(title_vi)
        slug     = _slug(title_vi)
        log.info(f"[Custom] Auto-classified → Group {group}: {MATRIX[group]['label']}")
        run_one(title_vi, group, slug)
        return

    # Default: auto round-robin
    title_vi, slug, group = get_next_topic(args.group)
    run_one(title_vi, group, slug)

if __name__ == "__main__":
    main()
