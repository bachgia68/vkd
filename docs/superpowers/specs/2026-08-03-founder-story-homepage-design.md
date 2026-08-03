# Founder Story & Homepage Content Refresh — Design

Ngày: 2026-08-03
Trạng thái: Đã duyệt qua brainstorm (nhiều vòng chỉnh sửa trực tiếp qua chat).

## 1. Bối cảnh

Chuyển thông điệp thương hiệu TA từ khung "sàn giao dịch đa vùng trồng" sang câu
chuyện cá nhân thật của founder Khánh — 1 vườn gốc duy nhất tại Trà Linh, Nam
Trà My, Quảng Nam (bỏ Tu Mơ Rông + Kỳ Sơn khỏi nội dung công khai), cộng thêm
2 trụ cột minh bạch (củ tươi nguyên bản / sản phẩm chế biến sâu tuyển chọn).

## 2. Nội dung & vị trí

- **Slogan mới** (Hero badge): "BẢO TỒN NGUYÊN BẢN – TUYỂN CHỌN TINH HOA" (bỏ
  hoàn toàn chữ "sàn giao dịch").
- **Hero CTA** (2 nút, thay 2 nút cũ): "Xem Sản Phẩm Tuyển Chọn" → `catalog`;
  "Đặt Lịch Thăm Vườn" → mở `https://zalo.me/0984999309` tab mới.
- **Stats.tsx**: thay ô "3 / Vùng Trồng" bằng nội dung nêu bật Trà Linh là đỉnh
  cao nhất, hội tụ nhiều linh khí nhất của khối núi Ngọc Linh — thể hiện ngay
  trong value/label của ô stat (không chỉ nhắc ở nơi khác), gắn 1.800m+ độ cao.
- **About.tsx**: thay nội dung "sàn giao dịch đa vùng" bằng bản tóm tắt 2 trụ
  cột (củ tươi nguyên bản / sản phẩm chế biến sâu), chỉ còn 1 card vùng trồng
  (Trà Linh), nút "Đọc Toàn Bộ Câu Chuyện" → trang mới.
- **Trang mới `FounderStory.tsx`** (route `about-story`, vào qua nút ở About,
  KHÔNG thêm vào menu chính): toàn bộ câu chuyện dài — hành trình mẹ mất, 10
  năm ở Trà Linh, 2 trụ cột minh bạch, tuyên ngôn founder, mục "thị sở thị"
  (ảnh vườn thật anh vừa gửi). Tuyên ngôn sửa: "Trồng một cây sâm mất 6-10
  năm..." (không phải 5-7 năm).
- **social_links (Supabase)**: thêm Zalo (`https://zalo.me/0984999309`) +
  WhatsApp (`https://wa.me/84984999309`) — Footer tự hiện qua logic có sẵn.
  KHÔNG nhúng ảnh QR "Anne Mai" (không khớp danh tính founder).
- **KHÔNG đổi** `footer.brandDesc`/thêm dòng pháp lý Hộ Kinh Doanh — bỏ khỏi
  phạm vi theo yêu cầu.

## 3. Ảnh cho Research Hub (`educationGuides`, hiện không có ảnh)

Thêm field `image` vào `EducationGuide` (mockData.ts) + render `<img>` thay
placeholder icon trong `ResearchHub.tsx`. Dùng ảnh có sẵn trong repo (đã là
tài sản thật của site, không phải ảnh dựng):
- guide-001 (Authentication) → `/assets/images/sam-ngoc-linh-plant.png`
- guide-002 (Dosage) → `/assets/images/product-1.jpg`
- guide-003 (Preparation) → `/assets/images/nature-forest.jpg`

Ảnh vườn thật anh gửi (nursery Trà Linh) lưu thành asset mới
`/assets/images/vuon-giong-tra-linh.jpg`, dùng cho mục "thị sở thị" ở trang
`FounderStory.tsx` — phù hợp hơn vì đây là bằng chứng vườn thật, không gán ép
vào 1 trong 3 bài nghiên cứu không liên quan trực tiếp.

## 4. Việc phát hiện thêm, KHÔNG thuộc phạm vi này (chỉ nêu để anh biết)

`src/data/mockData.ts` — mảng `newsArticles` — có `titleVi` chứa "VKD" ở
nhiều bài (VD "Sâm Ngọc Linh VKD Khẳng Định Vị Thế..."), hiển thị trực tiếp
qua `NewsFeed.tsx`. Đây là rò rỉ tên NCC giống loại đã sửa trước đó, nhưng
nằm ngoài phạm vi content lần này (không phải about/hero/research) — nên xử
lý riêng, không sửa lẫn vào đây.
