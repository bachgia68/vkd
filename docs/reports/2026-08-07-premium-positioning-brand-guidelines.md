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

---

## 7. Cập nhật 2026-08-07 — crawl sâu 6 trang thật + đo màu bằng DOM thật

Bản research đầu (§1-6) chỉ dựa trên WebFetch (chuyển HTML→markdown, không
đọc được CSS thật) nên các mô tả màu sắc ở trên là **suy đoán bằng mắt, chưa
verify**. Lần này mở trực tiếp jungkwanjang.us bằng trình duyệt và đọc
`getComputedStyle()` thật trên DOM — số liệu dưới đây là **verified, không
phải suy đoán**.

### 7.1 Bảng màu THẬT của JKJ (đo trực tiếp, không phải mô tả)

- Nền chủ đạo: `#ffffff` (trắng, xuất hiện 64 lần trong mẫu quét)
- Nền tối (footer, section tương phản): `#000000`
- Chữ chính: `#141414` (gần đen, không phải đen tuyệt đối)
- **Màu CTA/thương hiệu chính: `#de3741`** (đỏ tươi) — nút "Subscribe" đo
  được chính xác `background: #de3741, color: #ffffff`. Đây MỚI là màu nhận
  diện thật của JKJ/Korea Ginseng Corporation, không phải "gold" như suy
  đoán ban đầu — sửa lại nhận định trong §1 nếu có nơi nào từng ngầm hiểu
  JKJ dùng vàng làm màu chính.
- Màu phụ: `#91342c` (đỏ mận/maroon đậm, dùng cho các khối nhấn phụ)
- Nền thẻ/khối xám nhạt: `#f7f7f7`, `#f8f8f8`, `#f0f0f0`
- Font: **`Plus Jakarta Sans`** cho cả heading lẫn body — sans-serif hình
  học hiện đại, không dùng serif/display font kiểu "luxury cổ điển".

**Áp dụng cho TA — KHÔNG sao chép màu đỏ của JKJ** (đó là màu nhận diện
riêng của họ, dùng lại sẽ gây nhầm thương hiệu). Thay vào đó áp dụng cùng
**nguyên tắc phối màu**: nền trắng/kem chủ đạo + 1 màu tương phản mạnh duy
nhất cho CTA (TA đã có `gold-400 #D4AF37` — giữ nguyên, đúng vai trò tương
đương màu đỏ của JKJ) + nền tối cho các khối trust/premium (TA đã dùng
`forest-900` — đúng hướng, không cần đổi). Không cần thêm màu mới ngoài
token đã có trong `@theme` của `src/index.css`.

### 7.2 Sitemap thật của JKJ (crawl 6 trang, để tham chiếu cấu trúc IA)

```
/ (home)
├── Shop (dropdown)
│   ├── Featured: Best Seller, New Release, E-Gift Card
│   ├── Product Type: Stick, Tonic, Jar, Pill/Shot, Candy/Tea/Powder, Root
│   ├── Ingredient: 10 nhóm (Red Ginseng, Deer Antler, Collagen, Honey...)
│   └── Benefits: 8 nhóm theo mục tiêu sức khỏe (Energy, Focus, Immune,
│       Sports, Skin, Blood sugar, Women's, Kid's Health)
├── Collections (11 dòng sản phẩm thương hiệu riêng: Everytime, Hong Sam
│   Won, CheonNok, GLPro, Skincare...)
├── /pages/rewards-program (chương trình thành viên)
├── K-Ginseng (dropdown)
│   ├── /pages/wisdom-of-the-ages
│   ├── /pages/born-from-root
│   ├── /pages/our-story (About)
│   └── /pages/research-clinical-studies
├── Learn: /blogs/ginseng-101, /blogs/press-room
├── /pages/franchise-opportunities (B2B/nhượng quyền)
├── /pages/subscriptions-program
├── /pages/contact-us
└── /policies/* (refund, shipping, terms, privacy) — TA đang thiếu hoàn
    toàn nhóm trang này, xem §7.5.
```

**Điểm rút ra cho TA**: JKJ tách rất rõ 3 trục điều hướng sản phẩm
(Product Type / Ingredient / Benefits) — khách có thể tìm theo dạng bào chế
HOẶC theo mục tiêu sức khỏe HOẶC theo dòng thương hiệu con, tuỳ thói quen.
TA hiện chỉ có 1 trục (loại sản phẩm: Sâm Củ Tươi/Ngâm Mật Ong/Trà.../Mỹ
Phẩm...) — `ProductAdvisor.tsx` đã có logic gợi ý theo mục tiêu/đối tượng
nhưng KHÔNG xuất hiện như một trục điều hướng riêng trong menu/catalog
filter, mới chỉ là 1 quiz rời rạc trên trang chủ.

### 7.3 Trang sản phẩm chi tiết (product detail) — anatomy thật

Layout: gallery ảnh bên trái + panel thông tin bên phải gồm: giá + số
review ngay dưới tên, chọn size/số lượng dạng dropdown, khối "Make It a
Habit" gợi ý subscribe (30 ngày tạo thói quen, 90 ngày thành lifestyle),
nút Add to Cart + Wishlist, tab Description/Reviews/Shipping/About Us, khối
"Key Benefits" 4 lợi ích kèm icon, danh sách nguyên liệu tối giản, dòng
disclaimer FDA, carousel "Related Products" + "Recently Viewed". So với
`ProductDetail.tsx` hiện tại của TA — cần xác minh có tab/accordion tương
đương hay đang là 1 khối văn bản dài liền (ghi chú câu hỏi mở, không giả
định — kiểm tra code thật trước khi kết luận).

### 7.4 Trang Rewards — cấu trúc tier thật

4 hạng theo mức chi tiêu/năm (Member $0-299 → Royal $2000+), mỗi hạng tăng
% hoàn điểm (1%→3%) + hạng cao có free shipping. Không dùng màu sắc phân
biệt hạng — chỉ dùng bố cục card + nhãn "Free shipping" cho 2 hạng cao
nhất. Có cơ chế thưởng nhập môn (5.000 điểm chào mừng) và mốc đơn hàng thứ
3 (+10.000 điểm tự động) — cơ chế "mốc đơn hàng" này TA chưa có trong
`loyaltyTiers`/`LoyaltyDashboard.tsx`, ghi nhận làm câu hỏi mở Phase 2 (có
đáng làm không phụ thuộc vào việc TA có đủ dữ liệu đơn hàng lặp lại không —
hỏi Joe trước khi build, không tự quyết).

### 7.5 Trang B2B/franchise — TA có thể học gì

JKJ tách hẳn 1 trang nhượng quyền riêng biệt về hình ảnh (tối giản, dùng
infographic thay vì ảnh sản phẩm/review) với bảng chi phí minh bạch (franchise
fee, build-out, tồn kho ban đầu, % royalty) và quy trình 7 bước dạng
flowchart. `B2B.tsx` của TA hiện có 3 khối (Nhà Phân Phối/Nhà Đầu Tư/
OEM-ODM) nhưng đều chỉ có 1 nút "Đăng Ký Hợp Tác" chung, không có breakdown
chi phí hay quy trình rõ ràng theo từng loại hình — ghi nhận là câu hỏi mở
Phase 2 (**không tự bịa số tiền/% hoa hồng cho TA** — đây là dữ kiện kinh
doanh thật chỉ Joe mới cung cấp được).

### 7.6 Gap lớn nhất phát hiện qua đợt crawl này

TA **hoàn toàn chưa có** các trang pháp lý mà JKJ có đầy đủ:
`/policies/refund-policy`, `/policies/shipping-policy`,
`/policies/terms-of-service`, `/policies/privacy-policy` — hiện tại
`Footer.tsx` chỉ có text tĩnh "Privacy Policy/Terms of Service/Cookie
Policy" không link (xem fix ngày 2026-08-07 trong lịch sử commit). Đây là
gap thật, ưu tiên cao hơn nhiều mảng thẩm mỹ khác vì ảnh hưởng trực tiếp
tới uy tín pháp lý khi khách thanh toán thật qua PayOS.
