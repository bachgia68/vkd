# Brand Guidelines cho Nhà Cung Cấp (NCC) — Draft

Ngày: 2026-08-02
Trạng thái: **DRAFT** — chưa gửi NCC, cần chủ shop duyệt nội dung/giọng văn trước.

## 1. Vì sao có tài liệu này

Sàn TA vận hành theo mô hình **Branded House** (giống Amazon Basics, Sephora,
Shopee Mall): khách hàng mua vì tin tưởng thương hiệu TA, không phải vì biết
"sản phẩm này của công ty nào". Toàn bộ sản phẩm từ nhiều NCC (VKD, TRIMICO,
và các NCC tương lai) được trình bày thống nhất dưới một giao diện, một giỏ
hàng, một lần thanh toán, một đầu mối chăm sóc khách hàng (TA).

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

- Hợp nhất toàn bộ danh mục (43 sản phẩm dòng chính + 50 sản phẩm TRIMICO)
  vào một cấu trúc phân loại theo nhu cầu/dạng sản phẩm duy nhất, thay vì hai
  danh mục tách biệt như hiện tại (`vkdProducts.ts` / `trimicoProducts.ts`,
  hai trang catalog riêng). Đây là việc kiến trúc dữ liệu + UI lớn, nên tách
  thành phiên làm việc riêng có kế hoạch rõ ràng trước khi code.
- Thay ảnh gốc cho các sản phẩm có logo NCC in trực tiếp trên bao bì/túi quà
  (không crop được) khi có lô hàng đóng gói mới hoặc ảnh chụp lại.
