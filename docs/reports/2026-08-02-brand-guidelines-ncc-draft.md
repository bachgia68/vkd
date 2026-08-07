# Brand Guidelines cho Nhà Cung Cấp (NCC) — Draft

Ngày: 2026-08-02
Trạng thái: **DRAFT** — chưa gửi NCC, cần chủ shop duyệt nội dung/giọng văn trước.

## 1. Vì sao có tài liệu này

Sàn TA vận hành theo mô hình **Branded House** (giống Amazon Basics, Sephora,
Shopee Mall): khách hàng mua vì tin tưởng thương hiệu TA, không phải vì biết
"sản phẩm này của công ty nào". Toàn bộ sản phẩm từ nhiều NCC (VKD, TRIMICO,
**samk5.vn/"Sâm Ngọc Linh K5"** — onboard 2026-08-07, xem §7 — và các NCC
tương lai) được trình bày thống nhất dưới một giao diện, một giỏ hàng, một
lần thanh toán, một đầu mối chăm sóc khách hàng (TA).

Việc phân loại theo NCC vẫn tồn tại **ở backend** (SKU, kho, vận đơn, đối soát
công nợ) — NCC không biến mất khỏi hệ thống, chỉ ẩn khỏi những gì khách hàng
nhìn thấy.

## 2. Quy tắc cho ảnh sản phẩm NCC gửi lên

Đây là điểm khó nhất về mặt kỹ thuật, cần NCC phối hợp ngay từ khâu chụp ảnh —
sau khi ảnh đã in logo lên bao bì/túi quà thật thì không thể xoá sạch bằng
crop mà không làm hỏng ảnh sản phẩm.

- **Không** đặt banner/watermark logo NCC đè lên ảnh sản phẩm (VD: dải ruy-băng
  "VKD Sâm Ngọc Linh" phía trên ảnh) — nếu có, TA sẽ tự cắt bỏ được, nhưng tốt
  nhất là gửi ảnh sạch từ đầu.
- **Hạn chế tối đa** để logo NCC xuất hiện trên chính vật phẩm được chụp (túi
  quà, hộp, tem nhãn) đối với các dòng sản phẩm mới/đóng gói lại cho TA — vì
  phần này nằm trong khung hình chính, không cắt được.
- Với sản phẩm đã có bao bì in sẵn logo NCC (hàng tồn, chưa đổi bao bì kịp):
  TA sẽ dùng ảnh hiện có nhưng ưu tiên các góc chụp che bớt logo, và lên kế
  hoạch thay ảnh khi có lô đóng gói mới.
- Định dạng khuyến nghị: nền trắng/trong suốt, không có banner/frame thương
  hiệu nào chèn thêm ngoài chính vật phẩm.

## 3. Quy tắc nội dung/văn bản

- Mọi mô tả sản phẩm, trang chi tiết, trang danh mục: gọi chung là **"TA"**,
  không nêu tên NCC ("Sâm Ngọc Linh VKD Group", "đặc sản TRIMICO"...).
- Số hotline, thông tin liên hệ hiển thị cho khách: dùng đầu mối chăm sóc
  khách hàng của **TA**, không dùng hotline riêng của NCC.
- Chứng nhận/giấy phép (CGMP, HACCP, ISO...) của NCC vẫn được hiển thị (đây là
  bằng chứng chất lượng, không phải nhận diện thương hiệu NCC) — giữ nguyên.

## 4. Quy tắc điều hướng (navigation)

- Không tạo menu/route riêng theo tên NCC. Sản phẩm phân loại theo **nhu cầu**
  (Sức khỏe Gia đình, Quà biếu Doanh nhân, Tăng cường Miễn dịch...) hoặc theo
  **dạng sản phẩm** (Trà sâm, Mật ong sâm, Sâm củ tươi/khô, Rượu sâm, Mỹ phẩm...).
- ID/route kỹ thuật (URL, slug, id nội bộ) có thể vẫn chứa tên NCC viết
  thường — đây là chi tiết kỹ thuật, khách hàng không nhìn thấy.

## 5. Backend vẫn cần biết NCC nào

Không xoá thông tin NCC khỏi:
- SKU/mã sản phẩm nội bộ (`VKD-0xx`, tương tự cho NCC khác).
- Dữ liệu kho, vận đơn, đối soát công nợ trong trang quản trị (`/gate-*`).
- Hợp đồng, giấy phép, chứng nhận chất lượng lưu trữ nội bộ.

## 6. Việc cần làm tiếp (chưa nằm trong bản draft này)

- ~~Hợp nhất toàn bộ danh mục vào một cấu trúc phân loại duy nhất~~ — **ĐÃ
  XONG** (`src/data/products.ts`, hợp nhất từ `vkdProducts.ts` +
  `trimicoProducts.ts`, giờ có thêm `samk5Products.ts` — xem §7). Một trang
  catalog duy nhất khách hàng dùng, không còn tách riêng theo NCC.
- Thay ảnh gốc cho các sản phẩm có logo NCC in trực tiếp trên bao bì/túi quà
  (không crop được) khi có lô hàng đóng gói mới hoặc ảnh chụp lại.
- Đồng bộ trang admin "Sản phẩm & Kho" (`ProductsPage.tsx`) với
  `src/data/products.ts` — hiện 2 nguồn dữ liệu tách biệt hoàn toàn (xem
  `HANDOFF_NEXT_SESSION.md` §2 "Sub-project E"), nghĩa là sản phẩm mới thêm
  vào catalog thật không tự hiện trong trang quản lý kho admin.

## 7. Quy trình onboard 1 NCC mới — đã kiểm chứng thật với samk5.vn (2026-08-07)

NCC thứ 3 samk5.vn ("Sâm Ngọc Linh K5", Công ty TNHH MTV Đầu Tư Phát Triển
Du Lịch Xơ Đăng, Kon Tum) đã được onboard theo đúng quy tắc trên — quy trình
cụ thể, lặp lại được cho NCC tiếp theo:

1. **Xác nhận với chủ shop trước khi thêm bất kỳ dữ liệu nào** — hỏi rõ đây
   có phải NCC mới không (không tự suy đoán). samk5.vn đã được xác nhận là
   NCC độc lập, không phải kênh bán của VKD.
2. Thêm tên NCC/tên công ty thật vào `BANNED_PATTERNS` trong
   `scripts/check-no-supplier-names.js` — với samk5 là `/\bK5\b/i`,
   `/samk5/i`, `/X[oơ]\s*Đ[aă]ng/i` (tên công ty đứng sau). Guard tự động
   fail build nếu tên này lộ ra bất kỳ đâu khách hàng nhìn thấy.
3. Tạo file dữ liệu riêng `src/data/<tenNCC>Products.ts` theo đúng pattern
   `trimicoProducts.ts` — `supplierId` là identifier nội bộ (vd `'samk5'`),
   không bao giờ hiển thị cho khách; field text hiển thị (`name`,
   `description`...) tuyệt đối không chứa tên NCC.
4. Thêm entry tương ứng thủ công vào `src/data/products.ts` (file catalog
   thật) — SKU tiền tố riêng (`SK5-0xx`), cùng shape `Product` interface.
   `sku`/`supplierId`/`sourceUrl`/`image`/`slug` là field định danh nội bộ,
   được phép chứa tên NCC (không bị guard chặn) vì khách hàng không đọc
   những field này dưới dạng text.
5. Tải ảnh sản phẩm thật về `public/products/<tenNCC>/` — không dùng ảnh
   stock, không giữ nguyên watermark/banner NCC nếu ảnh gốc có (xem §2).
6. `npm run check:brand && npx tsc -b && npm run build` phải sạch trước khi
   commit — đây là bước bắt buộc, không bỏ qua dù chỉ thêm dữ liệu.
