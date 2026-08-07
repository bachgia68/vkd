# Premium Positioning Brand Guidelines — TA (nghiên cứu từ JungKwanJang)

Ngày: 2026-08-07
Trạng thái: Tham chiếu bắt buộc — đọc trước khi nâng cấp UI/UX theo hướng
"world's most expensive ginseng". Ghi lại để không phải nghiên cứu lại
jungkwanjang.us (Korea Ginseng Corporation, thương hiệu sâm hàng đầu Hàn Quốc,
thành lập 1899) mỗi lần bắt tay vào task liên quan.

Đây là guideline **định hướng thiết kế/nội dung**, khác với
`2026-08-02-brand-guidelines-ncc-draft.md` (guideline về **ẩn tên NCC** —
Branded House). Hai tài liệu bổ trợ nhau, không thay thế nhau.

## 1. Nguyên tắc định vị cao cấp (rút ra từ JKJ, áp dụng cho TA)

Không sao chép nguyên xi — TA chưa có 125 năm lịch sử hay hàng trăm review
thật. Áp dụng **cùng cơ chế thuyết phục**, chỉ dùng dữ kiện TA thực sự có:

1. **Di sản/xuất xứ thay cho lịch sử thương hiệu**: JKJ dùng "Since 1899".
   TA chưa có — thay bằng xuất xứ địa lý cụ thể (Sâm Ngọc Linh trồng ở đâu,
   độ tuổi củ, điều kiện thổ nhưỡng) — đã có sẵn trong nội dung Heritage.
   KHÔNG bịa số năm thành lập công ty giả.
2. **Bằng chứng khoa học/hàm lượng hoạt chất thay cho tuyên bố mơ hồ**: JKJ
   nói "active compounds", TA có con số thật (52+/MR2 saponin) — đây là lợi
   thế cạnh tranh THẬT SỰ mạnh hơn JKJ ở điểm này, phải là tuyên bố chính
   trong Hero, không chôn ở section dưới.
3. **Chứng nhận thật thay cho review giả**: JKJ có 8 badge chứng nhận
   (FDA, ISO 22000, GMP, HACCP...). TA đã có 7 ảnh chứng nhận thật
   (`Certifications.tsx`) — nguyên tắc: **luôn hiển thị**, không gate, không
   cần chờ có review mới cho lên top. Đây là bằng chứng có sẵn ngay hôm nay.
4. **Review/testimonial thật thay cho số sao giả**: JKJ hiển thị 158-505
   review mỗi sản phẩm ngay trên card. TA KHÔNG được bịa số — chỉ hiển thị
   khi Joe xác nhận có nội dung thật, và phải **ẩn hoàn toàn** (không hiện
   khung rỗng/placeholder) cho tới khi có nội dung — nguyên tắc "publish
   gate mặc định OFF" đã áp dụng cho Trust & Proof section.
5. **Kiến trúc giá theo độ tinh khiết/nồng độ**: JKJ định giá cao hơn cho
   dạng chiết xuất đậm đặc so với dạng viên/gói. TA nên áp badge
   "Kiểm định Saponin" cho sản phẩm có dữ liệu `activeIngredient` thật,
   không phải mọi sản phẩm — đúng như đã note trong spec Phase 1 §3.

## 2. Cấu trúc trang chủ tham khảo (JKJ, rút gọn còn phù hợp với TA)

JKJ có 15 section (trang của họ có traffic rất lớn, đủ để giữ khách cuộn
sâu). TA đang bị chính Joe phàn nàn "quá nhiều section, khách rời trang
trước khi tới chỗ mua" — vì vậy **không** copy độ dài của JKJ, chỉ mượn thứ
tự logic:

`Hero (tuyên bố mạnh nhất) → Sản phẩm bán được ngay → Bằng chứng xuất xứ/khoa
học → Phân khúc theo nhu cầu (nếu có) → Chứng nhận thật → Ưu đãi
thành viên/subscription → Kênh liên hệ cho nhóm hàng cao cấp/quà tặng`

Tương ứng với thứ tự đã chốt trong
`docs/superpowers/specs/2026-08-06-homepage-conversion-redesign-phase1-design.md`
§1 — không cần thiết kế lại từ đầu, spec đó đã đúng hướng này.

## 3. Mẫu hình sản phẩm card (áp dụng khi nâng cấp `Products.tsx`)

- Ảnh sản phẩm nền sạch, không banner đè logo NCC (đã có rule ở guideline
  Branded House).
- Copy mô tả dưới 15 từ hiển thị ngay trên card (không phải mở trang chi
  tiết mới đọc được).
- Badge chỉ hiển thị khi có dữ liệu thật hỗ trợ (giá cố định → nút "Thêm
  vào giỏ"; giá liên hệ → nút "Chat Zalo", không phải nút Add to Cart bị
  vô hiệu hoá gây rối).
- Biến thể (dung tích/số lượng) chọn ngay trên card nếu dữ liệu hỗ trợ —
  chưa bắt buộc cho Phase 1, ghi nhận làm Phase 2 candidate nếu
  `vkdProducts.ts` có đủ trường variant.

## 4. Membership/loyalty — mượn khung, không mượn tên

JKJ có 2 chương trình (Rewards + Subscriptions) tách biệt trong nav chính.
TA đã có `loyaltyTiers` (Standard/VIP/VVIP Elite) nhưng homepage không có
lối vào — đây chính là gap Task 5 của Phase 1 plan (`EliteTeaser.tsx`) đang
vá. Không cần thêm chương trình subscription riêng ở Phase 1 — ghi nhận làm
câu hỏi mở Phase 2 (TA có đủ volume đơn hàng định kỳ để chương trình
subscription có ý nghĩa không, cần Joe xác nhận trước khi build).

## 5. Điều JKJ làm mà TA **không được copy**

- Không tự gắn số review/rating khi chưa có dữ liệu thật (vi phạm nguyên
  tắc "không bịa số liệu" đã ghi trong `Global Constraints` của Phase 1
  plan).
- Không tự đặt "Since <năm>" nếu năm đó không phải năm thành lập thật của
  TA/VKD — kiểm tra với Joe trước khi dùng bất kỳ mốc thời gian nào trong
  copy marketing.
- Không thêm badge "bestseller"/"sale" giả — chỉ khi có dữ liệu đơn hàng
  thật hậu thuẫn (đã ghi trong spec Phase 1 §3).

## 6. Khi nào cập nhật tài liệu này

Cập nhật khi: (a) Joe cung cấp thêm dữ kiện thật (số năm, số khách hàng,
review thật) có thể thay cho placeholder ở trên; (b) có đợt nghiên cứu đối
thủ mới ngoài JKJ; (c) Phase 2 mở rộng sang subscription/variant selector.
Không cần đọc lại toàn bộ jungkwanjang.us để tái tạo tài liệu này trừ khi
site đó có thay đổi lớn về mô hình kinh doanh.
