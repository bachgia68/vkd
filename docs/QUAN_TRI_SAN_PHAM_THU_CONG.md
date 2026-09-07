# Hướng dẫn tự quản trị sản phẩm (không cần Claude)

Viết cho Joe — số lượng sản phẩm không nhiều, phần lớn việc "ẩn 1 sản phẩm bị
lỗi" hoặc "kiểm tra vì sao sản phẩm đã xoá vẫn hiện" tự làm được trong 2 phút,
không cần chờ Claude mở phiên mới.

## 1. Kiến trúc dữ liệu sản phẩm (đọc 1 lần, hiểu mãi mãi)

Site có **2 lớp dữ liệu** cho mỗi sản phẩm:

1. **Catalog tĩnh** — file `src/data/products.ts` trong code (tên, mô tả,
   thành phần, ảnh gốc, giá niêm yết...). Đây là "khuôn" — sửa file này thì
   phải nhờ Claude/dev (cần build + deploy).
2. **Override runtime** — bảng `products` trong Supabase (chỉ có
   `sku`, `active`, `stock_qty`, giá ghi đè, ảnh ghi đè...). Đây là lớp admin
   **tự sửa được ngay**, không cần deploy — sửa xong hiện trên site **ngay
   lập tức** (vài giây, không cần đợi build).

**Quy tắc vàng**: khách hàng chỉ thấy 1 sản phẩm khi **CẢ HAI** điều kiện
đúng — (a) SKU đó có trong `products.ts`, và (b) SKU đó **không có** row
Supabase với `active = false`. Nếu 1 SKU chưa từng có row Supabase nào cả,
mặc định vẫn **HIỆN** (không phải ẩn) — đây là điểm hay bị hiểu nhầm.

→ **Muốn ẩn vĩnh viễn 1 sản phẩm khỏi site: chỉ cần set `active = false`
cho đúng SKU đó trong Supabase.** Không cần đụng vào code.

## 2. Cách ẩn/hiện 1 sản phẩm — 2 cách, chọn 1

### Cách A — Qua trang Admin (dễ nhất, làm cách này trước)

1. Vào `https://tasamngoclinh.com/gate-vkd-control-2026/products`, đăng nhập.
2. Tìm sản phẩm theo tên hoặc SKU (ô tìm kiếm trên đầu trang).
3. Bấm nút **Sửa** để đổi tên/giá/ảnh, hoặc bấm icon **hình con mắt gạch
   chéo (⊘)** để bật/tắt hiển thị — đây chính là bật/tắt `active`.
4. Nút **thùng rác (🗑 "Xoá")** giờ **đã an toàn** để dùng — nó set
   `active = false` (ẩn vĩnh viễn), **không xoá dữ liệu thật** trong
   Supabase. (Trước ngày 2026-09-07 nút này xoá thật row, gây bug "xoá xong
   sản phẩm tự hiện lại" — đã sửa, xem mục 4.)
5. Site cập nhật ngay, không cần chờ deploy.

### Cách B — Qua Supabase trực tiếp (khi trang Admin lỗi/không vào được)

1. Vào **`https://supabase.com/dashboard/project/xcwirgrlnibnjmseglee/editor`**
   (đăng nhập bằng tài khoản Supabase của Joe — nếu chưa có quyền, xin
   Claude/dev thêm mình vào project "Vkd web Project").
2. Sidebar bên trái → gõ tìm bảng **`products`** → click vào.
3. Dùng ô tìm kiếm/filter phía trên bảng: filter theo cột `sku` =
   giá trị SKU cần sửa (vd. `KT-011`).
   - **Nếu KHÔNG tìm thấy dòng nào** → SKU đó chưa từng có row (mặc định
     đang HIỆN trên site). Bấm nút **Insert row** (góc trên bên phải bảng),
     điền tối thiểu `sku` (bắt buộc, gõ đúng chính tả) và `name_vi` (bắt
     buộc, gõ tên sản phẩm cho dễ nhận), cột `active` **bỏ tick** (= false),
     bấm Save.
   - **Nếu tìm thấy dòng rồi** → click trực tiếp vào ô `active` trên dòng
     đó, gạt công tắc thành **tắt (false)** để ẩn, hoặc **bật (true)** để
     hiện lại. Tự lưu ngay khi rời khỏi ô, không cần bấm nút Save riêng.
4. Kiểm tra lại trên site thật (mở tab ẩn danh để tránh cache trình duyệt
   cũ) — nếu vẫn thấy sản phẩm, đợi ~10 giây rồi F5 lại (site cache RPC vài
   giây).

### Cách xác định SKU của 1 sản phẩm

- Cách nhanh nhất: mở trang sản phẩm đó trên site, nhìn URL —
  `tasamngoclinh.com/product/<slug>`. Slug không phải SKU, nhưng nếu cần map
  chính xác slug → SKU, vào Supabase Table Editor như trên, filter tìm theo
  tên sản phẩm trong cột `name_vi`.
- Hoặc: vào trang Admin `/products`, tìm theo tên — SKU hiện ngay trên mỗi
  dòng kết quả.

## 3. Case thường gặp: "Tôi xoá sản phẩm trong admin rồi mà vẫn thấy trên site"

Checklist xử lý theo thứ tự:

1. **Đợi 10-15 giây rồi mở tab ẩn danh (Incognito) load lại site** — loại
   trừ khả năng do cache trình duyệt/CDN, không phải bug thật.
2. Vào Supabase Table Editor (mục 2, Cách B), filter `sku` đúng SKU nghi
   ngờ — kiểm tra cột `active`:
   - Nếu **không có row nào** → đây chính là nguyên nhân (fail-open, xem
     mục 1). Insert row mới với `active = false` theo hướng dẫn trên.
   - Nếu **có row nhưng `active = true`** → có ai đó (hoặc chính mình) vừa
     bật lại, hoặc thao tác "Xoá" trước đó chưa kịp lưu — set lại `false`.
3. Vẫn còn hiện sau khi xác nhận `active = false` trong Supabase → đây mới
   là bug thật, báo Claude kèm SKU + link trang sản phẩm để debug.

## 4. Lịch sử sự cố đã xử lý (để hiểu vì sao có quy tắc trên)

- **2026-09-07**: nút "Xoá" trong trang Admin trước đó gọi thẳng
  `DELETE FROM products WHERE id=...` (xoá hẳn row Supabase). Nhưng cơ chế
  hiển thị (`useLiveProducts`) coi "không có row" = **hiện bình thường**
  (fail-open, để không lỡ ẩn nhầm sản phẩm chưa kịp sync). Hậu quả: xoá
  xong, sản phẩm **tự hiện lại** ở mọi nơi (catalog, "sản phẩm liên quan",
  combo builder). Phát hiện qua 2 đợt: 8 SKU dòng "Củ Sâm/Nguyên Cây"
  (KT-016→023) và 2 SKU "Lá Sâm Khô/Tươi" (KT-011, KT-012) — đã set lại
  `active=false` cho cả 10 SKU. Đã sửa code: "Xoá" giờ set `active=false`
  thay vì xoá row thật, không tái diễn được nữa.
- Nếu tương lai lại thấy hiện tượng tương tự (xoá không ăn), khả năng cao
  nhất là 1 nơi nào đó trong code vẫn đọc thẳng catalog tĩnh
  (`products.ts`) mà bỏ qua lớp override Supabase — báo Claude kèm URL
  trang đang lỗi để tìm đúng chỗ.

## 5. Việc CHƯA làm được thủ công (bắt buộc phải nhờ Claude/dev)

- Thêm/sửa hẳn 1 sản phẩm mới vào catalog (tên, mô tả, ảnh gốc, giá niêm
  yết) — phải sửa `products.ts` + build + deploy.
- Dịch sản phẩm sang ngôn ngữ khác (EN/ZH/FR).
- Đổi cấu trúc/thêm cột mới cho bảng `products` (cần migration).
