# Xử lý ảnh sản phẩm chuẩn premium (kiểu KGC) — quy trình chuẩn

## ⚠️ CẬP NHẬT 2026-09-04 — script ở mục 4 (`batch_premium_bg_alternate.py`) ĐÃ NGƯNG DÙNG

Joe báo 3 lỗi thật trên site sau khi dùng script đó: (1) logo TA + chữ
"tasamngoclinh.com" stamp lên ảnh bị **lệch/méo** — do script dùng font
path Linux (`/usr/share/fonts/...`) không tồn tại trên máy Windows, PIL âm
thầm fallback về font mặc định cực nhỏ, toạ độ tính theo font đúng nhưng vẽ
bằng font sai kích thước; (2) flood-fill theo ngưỡng màu xoá nhầm cả sản
phẩm nếu sản phẩm chính là màu trắng/nhạt (vd. `28-men-kim-boi.png` — bao
ni-lông trắng — bị xoá gần hết); (3) Joe yêu cầu **bỏ hẳn** watermark
logo/URL, không sửa lại.

**Script chuẩn hiện tại: `scripts/regen_premium_bg_rembg.py`** — thay
flood-fill bằng `rembg` (model AI cắt nền thật, đã cài sẵn), KHÔNG stamp
logo/URL, tự động chọn 1 trong 3 tông nền theo từ khoá trong đường dẫn file
(`ivory` mặc định, `sage` cho trà/mật ong/lá sâm, `gold-dark` cho rượu/men),
và tự phát hiện sản phẩm màu nhạt (đo độ sáng trung bình vùng giữ lại sau
cắt nền, ngưỡng `PALE_PRODUCT_BRIGHTNESS`) để chuyển sang nền `gold-dark`
sâu hơn thay vì nền sáng khiến sản phẩm "biến mất" vì cùng độ sáng nền.
Ánh sáng hắt chếch trên-trái (softbox thật) thay vì gradient tỏa tròn từ
tâm — gradient tâm-tỏa-tròn bị Joe chê "trong mờ, xấu, như in phẳng".

Chạy:
```bash
python scripts/regen_premium_bg_rembg.py --files <rel_path...>   # xem mẫu trước, ghi vào premium-bg-sample/
python scripts/regen_premium_bg_rembg.py --all                    # ghi đè premium-bg/ toàn bộ, chỉ chạy khi Joe đã duyệt mẫu
```
Luôn chạy `--files` với vài ảnh đại diện (1 chai/hộp thường, 1 sản phẩm
màu nhạt/trắng, 1 ảnh có nền gốc phức tạp như trimico) và gửi Joe duyệt
trước — đừng tự ý `--all` khi chưa hỏi.

**Trần thật của cách này**: đây là ghép nền + gradient ánh sáng giả lập,
KHÔNG phải ảnh do AI sinh (generative) — sẽ không đạt độ chân thực có phản
chiếu/bokeh/độ sâu trường ảnh thật như ảnh mẫu kiểu GPT-image/Flux mà Joe
có thể đưa làm tham khảo. Muốn mức đó cần gọi model sinh ảnh thật (Gemini
image, Flux, GPT-image) — đã thử `VITE_GEMINI_API_KEY` trong `.env` phiên
2026-09-04, bị chặn (`API_KEY_SERVICE_BLOCKED`, lỗi 403 từ Google) — chưa
xác nhận sửa được, đừng giả định key này dùng được cho tới khi kiểm tra lại.

Ảnh có logo/URL nhà cung cấp in **trực tiếp trên vỏ hộp thật** (vd. loạt
ảnh `trimico/` có "www.trietminh.com" + logo TM) — đây LÀ MỘT PHẦN ảnh gốc,
không phải watermark do site chèn, không script xử lý nền nào xoá được.
Cần ảnh sạch từ NCC hoặc retouch tay từng ảnh nếu muốn bỏ.

Nội dung bên dưới (mục 1-5) là quy trình CŨ (2026-08-14), giữ lại để tham
khảo lịch sử màu KGC gốc — bảng màu ở mục 1 đậm hơn giá trị hiện dùng trong
`regen_premium_bg_rembg.py` (đã nhạt thêm theo phản hồi 2026-09-04).

## 1. Nguyên tắc màu — học đúng kiểu KGC, không tự sáng tạo

**Quan trọng: môi trường sandbox nhiều phiên Claude Code (cloud) bị chặn
mạng ra ngoài (`EGRESS_BLOCKED`), không tự mở được `kgc.co.kr`/
`jungkwanjang.us` trực tiếp.** Nguồn dữ liệu màu KGC dùng cho skill này lấy
từ nghiên cứu DOM thật đã làm ở phiên có quyền browser trước đó, lưu tại
`docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`. Nếu cần
cập nhật lại theo bản KGC mới nhất, phải làm ở phiên có công cụ browser/
WebFetch không bị chặn — đừng đoán màu.

Nguyên tắc rút ra (mục "nguyên tắc phối màu" trong report trên): **nền
trắng/kem là chủ đạo**, màu thương hiệu (gold/forest) chỉ là **điểm nhấn
rất nhẹ** ở rìa/vignette, KHÔNG phải một lớp màu phẳng bão hoà phủ toàn bộ
nền. Ảnh nền quá đậm màu (vàng/xanh rực) sẽ trông như đồ hoạ AI-generate
rẻ tiền, không phải ảnh chụp studio thật cao cấp — đúng thứ Joe phản đối.

**Bảng màu đã dùng thật, đạt yêu cầu (đừng đậm hơn giá trị này):**
```python
VARIANTS = {
    "gold": {
        "center": (253, 251, 246),  # gần trắng
        "mid": (248, 241, 223),     # kem ấm rất nhẹ
        "edge": (225, 205, 158),    # vàng nhạt — vẫn phải NHẠT, không rực
    },
    "green": {
        "center": (251, 252, 249),
        "mid": (236, 240, 231),
        "edge": (194, 208, 191),    # xanh sage nhạt, không phải forest đậm
    },
}
```
Nếu Joe muốn nhiều màu xen kẽ cho đỡ nhàm (đã làm 1 lần: alternate gold/
green theo index chẵn/lẻ) — vẫn giữ nguyên độ nhạt này, chỉ đổi hue.

## 2. Kỹ thuật cắt nền — tránh để lại khe hở (bug đã gặp thật)

Ảnh gốc nền trắng phẳng (không alpha) cần flood-fill border-connected để
xoá đúng phần nền, giữ nguyên chi tiết trắng bên trong sản phẩm (nhãn, chữ,
nắp vàng...). **Vấn đề gặp thật**: ảnh sản phẩm dạng rời (bó rễ tươi, chùm
hoa, cành lá) có khe hở nền trắng bị KẸT giữa các nhánh mảnh, không nối
được với viền ảnh qua đường thẳng — flood-fill border-connected đơn thuần
bỏ sót, để lại mảng trắng lộ liễu khi ghép lên nền màu (vô hình trên nền
ivory nhạt trước đây, LỘ RÕ trên nền có màu).

**Cách sửa**: dilate mask "trắng" một khoảng nhỏ CHỈ để tính connectivity,
rồi intersect lại với mask gốc trước khi xoá — không bao giờ xoá nhầm pixel
sản phẩm thật:
```python
from scipy.ndimage import binary_dilation, label

whiteish = minc >= 205  # ~215-225 với ảnh nền xám nhạt thay vì trắng tuyệt đối
bridged = binary_dilation(whiteish, iterations=4)
labeled, _ = label(bridged)
border_labels = set(labeled[0,:]) | set(labeled[-1,:]) | set(labeled[:,0]) | set(labeled[:,-1])
border_labels.discard(0)
bg_mask = np.isin(labeled, list(border_labels)) & whiteish  # & mask gốc — bắt buộc
```
`iterations=4` đủ cho đa số ảnh (chai/hộp — chiếm phần lớn catalog). Với ảnh
"bó rễ rời" đặc biệt khó (khe hở rộng, không phải sợi mảnh), kể cả
`iterations=20` cũng có thể còn sót — đây là **giới hạn thật của thuật
toán**, đừng cố dilate quá lớn (sẽ ăn lẹm vào rễ/sợi mảnh thật ở chỗ khác).
Cách xử lý đúng khi gặp ca này: báo Joe ảnh đó cần chụp lại nền sạch hơn
hoặc retouch tay, không cố ép thuật toán.

## 3. Bóng đổ + logo + URL

- Bóng mềm hình ellipse dưới sản phẩm, màu `forest-900` mờ (`(11,47,29,70)`),
  `GaussianBlur` theo tỷ lệ bề rộng sản phẩm — giữ nguyên, đã ổn.
- Logo TA (`public/assets/images/TA_logo_clean.png`, cắt nền bằng đúng kỹ
  thuật trên với `thresh=235` vì nguồn logo là trắng phẳng sạch, khác ảnh
  sản phẩm) + `tasamngoclinh.com` — ghim góc dưới phải, ~16% bề rộng ảnh,
  opacity ~0.85. Có shadow đen mờ dưới chữ URL để đọc được trên mọi nền.

## 4. Script chuẩn — dùng lại, đừng viết mới

`scripts/batch_premium_bg_alternate.py` là bản đầy đủ nhất (màu đã tune +
fix khe hở + logo + URL, alternate gold/green). Chạy:
```bash
pip install --break-system-packages pillow numpy scipy   # nếu chưa có
python scripts/batch_premium_bg_alternate.py
```
Đọc danh sách ảnh trực tiếp từ `public/products/premium-bg/` (đã có sẵn,
mirror `public/products/` cho từng đường dẫn gốc) — không cần
`scripts/_product_images.json` (file tạm, tự xoá, chỉ script cũ
`generate_premium_product_bg.py` cần). **`products.ts` đã trỏ mọi SKU vào
đúng path `/products/premium-bg/...` từ trước — script này overwrite tại
chỗ, không cần sửa code nào khác.**

## 5. Sau khi chạy — luôn xem bằng mắt trước khi commit

Ít nhất kiểm tra: 1 sản phẩm dạng chai/hộp (đa số catalog), 1 sản phẩm dạng
rời/hữu cơ (rễ/hoa/lá — nhóm dễ lỗi nhất). Dùng Read tool xem trực tiếp file
PNG, đừng suy đoán qua log. Nếu thấy mảng trắng/xám lộ rõ không tự nhiên,
đó là dấu hiệu cần tăng `iterations` hoặc báo Joe cần ảnh gốc tốt hơn — theo
đúng mục 2.
