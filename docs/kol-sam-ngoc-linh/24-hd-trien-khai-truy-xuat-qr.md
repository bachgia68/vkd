# Hướng dẫn triển khai Truy xuất nguồn gốc QR — từ tạo lô tới khách quét

Ngày: 2026-08-10. Đối chiếu trực tiếp với code đang chạy thật (`InventoryQrPage.tsx`,
`BatchTraceabilityLookup.tsx`, `traceabilityApi.ts`) — tính năng này **đã xây
xong hoàn chỉnh, không cần code thêm**, chỉ còn thiếu người thật thao tác lô
đầu tiên. Tài liệu này để in/train nhân viên kho — không phải kế hoạch, mà là
quy trình thật đang chạy được ngay hôm nay.

## Trạng thái hiện tại (kiểm tra thật qua Supabase)

Bảng `batches` hiện chỉ có **1 dòng, đánh dấu `is_demo: true`** — chưa có lô
hàng thật nào. Mọi bài viết/nội dung về truy xuất nguồn gốc phải chờ tới khi
có lô thật đầu tiên ở bước dưới đây.

## Trước khi bắt đầu

- Đăng nhập admin tại `/gate-vkd-control-2026` (tài khoản có quyền `admin`).
- Vào mục **Vận hành / Kho hàng → Tồn kho đa điểm & Truy xuất QR**.
- Đảm bảo sản phẩm cần đóng gói đã có trong danh mục (`Sản phẩm & Kho`) và
  vùng trồng đã đúng (Tu Mơ Rông / Nam Trà My / Puxailaileng — đã có sẵn).

## Bước 1 — Tạo lô hàng (trước khi đóng gói)

Trong khung **"Tạo lô hàng & mã QR truy xuất"**, điền:
1. Sản phẩm (chọn từ danh mục thật)
2. Vùng trồng
3. Ngày thu hoạch **thật** — không điền ngày ước lượng
4. Khối lượng (kg) **thật**
5. Vị trí kho (VD: `KHO-TMR - Kệ A3`)
6. Trạng thái kiểm định — để `Đang chờ kiểm định` nếu chưa có kết quả, chỉ
   chọn `Đạt kiểm định` khi đã có phiếu kiểm nghiệm thật trong tay

Bấm **"Tạo lô hàng & sinh mã QR"** — hệ thống tự sinh 1 `qr_hash` duy nhất,
không thể trùng với lô khác.

## Bước 2 — In tem QR

Có 2 cách, chọn theo thiết bị đang có:
- **"Tải QR"**: xuất file ảnh QR để in bằng máy in tem riêng (Zebra, TSC...).
- **"In nhãn"** (1 lô) hoặc **"In tất cả nhãn"** (hàng loạt): in trực tiếp
  bằng máy in thường, khổ tem 60mm (in đơn) hoặc lưới 3 cột (in hàng loạt),
  đã có sẵn logo TA + tên sản phẩm + ngày thu hoạch trên tem.

## Bước 3 — Dán tem lên sản phẩm

Dán tem lên **từng thùng/đơn vị sản phẩm trước khi niêm phong** — không dán
sau khi đã đóng gói xong xuôi, vì tem là 1 phần của quy trình xác nhận trước
khi hàng rời kho.

## Bước 4 — Quét thử trước khi xuất kho

Dùng điện thoại quét thử **1 tem bất kỳ** trong lô, xác nhận trang hiện đúng
sản phẩm/vùng trồng/ngày thu hoạch. Chỉ xuất kho sau khi bước này pass.

## Bước 5 — Khách hàng quét (bước cuối cùng, đã tự động 100%)

Không cần ai thao tác thêm — khi khách quét mã trên sản phẩm thật:
1. Trình duyệt mở `tasamngoclinh.com/?trace=<mã>` — trang công khai, không
   cần đăng nhập.
2. Hệ thống gọi `fetchBatchByQr()` hiển thị đúng sản phẩm/vùng trồng/ngày
   thu hoạch/trạng thái kiểm định của đúng lô đó.
3. Đồng thời tự ghi 1 dòng vào `qr_scan_events` (không cần ai bấm gì) — dữ
   liệu này chảy thẳng vào **bản đồ nhiệt lượt quét** trong admin.

## Cơ chế chống hàng giả (đã có sẵn, tự động)

Nếu cùng 1 mã QR bị quét từ **nhiều vùng địa lý khác nhau trong 24 giờ**, hệ
thống tự đánh dấu `suspect` — hiện cảnh báo ⚠ trên bản đồ nhiệt trong admin.
Đây là dấu hiệu hàng giả/hàng nhái dùng lại mã thật đã dán trên 1 sản phẩm
khác. Khi thấy cảnh báo này, kiểm tra lại kênh phân phối của đúng lô đó.

## Quy tắc bắt buộc

- **Không bao giờ dùng lại mã QR cũ** cho lô khác.
- Lô bị huỷ/tem in lỗi → **tạo lô mới**, không sửa lại lô cũ (giữ đúng lịch
  sử truy xuất).
- Không điền ngày thu hoạch/khối lượng ước lượng — đây là dữ liệu khách hàng
  nhìn thấy trực tiếp, sai là mất uy tín "thẩm định độc lập" mà TA đang xây.

## Khi có lô thật đầu tiên

Báo lại để t viết bài "Cổng truy xuất nguồn gốc" (pillar còn thiếu trong bộ
4 bài đã có) — dùng đúng số liệu lô thật đó, không dùng số liệu demo.
