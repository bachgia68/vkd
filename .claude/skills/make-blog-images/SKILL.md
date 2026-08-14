# Làm ảnh cho bài blog — bắt buộc ≥2 ảnh/bài, không để bài toàn chữ

Trước đây mỗi bài blog chỉ có 1 ảnh bìa (`featured_image_url`), phần lớn là
ảnh tái dùng chung chung — đúng phản hồi "bài toàn chữ, nhàm chán". Từ
2026-08-14, mọi bài blog **published** phải có ít nhất **2 ảnh riêng biệt**:
1 ảnh bìa (`featured_image_url`, hiện ở card danh sách + đầu bài) + ít nhất 1
ảnh chèn trong thân bài (`body`, giữa các đoạn văn).

Dùng skill này bất cứ khi nào viết bài blog mới (kể cả qua flow AUTO_POST_CMS
của `marketing-sam`) hoặc khi rà soát bài cũ thiếu ảnh.

## 1. Ảnh bìa — ưu tiên ảnh thật trước

Theo đúng quy trình `manage-site-images`: luôn xem hết `public/assets/images/`
trước, chỉ dùng ảnh thật của TA (vườn sâm, củ sâm, sản phẩm...), không
Unsplash/AI. Đây vẫn là lựa chọn MẶC ĐỊNH cho ảnh bìa.

## 2. Ảnh thứ 2 (trong thân bài) — khi không có ảnh thật phù hợp, tạo infographic

Nếu chủ đề bài không có ảnh thật nào minh hoạ được nội dung cụ thể (số liệu,
so sánh, trích dẫn nghiên cứu) — tạo 1 ảnh infographic bằng Pillow (không cần
Canva, từng thử `generate-design`/`export-design` của Canva MCP bị lỗi
permission — xem `ta_image_skill_comparison.md` nếu muốn thử lại). Có 2
template sẵn trong `D:\AI_Skills\ai-marketing-skills\outputs_Claude_mark_sam\references\`:

- **`make_comparison_image.py`** — `generate_comparison_image(...)`: bảng so
  sánh 2 cột (vd. Sâm Ngọc Linh vs Tam Thất, TA vs đối thủ, sản phẩm A vs B).
  Dùng khi bài có nội dung đối chiếu rõ ràng.
- **`make_stat_card_image.py`** — `generate_stat_card_image(...)`: 1 số liệu
  lớn + caption ngắn + trích nguồn. Dùng cho bài tin tức/trend, bài có 1 con
  số nổi bật (giá, %, mốc thời gian) muốn nhấn mạnh.

Cả 2 dùng chung bảng màu/font đã khoá — **không tự đổi màu/font khi gọi**:
- Forest dark `#0B2F1D`, Gold `#D4AF37`, Cream `#faf8f3` (đúng token
  `tailwind.config.js`, xem `docs/DESIGN_SYSTEM.md` mục 1).
- Font Times New Roman (`C:/Windows/Fonts/times.ttf` + `timesbd.ttf` +
  `timesi.ttf`) — đã verify đủ glyph tiếng Việt qua `fontTools`, KHÔNG dùng
  Georgia (thiếu dấu).

**Số liệu trong ảnh phải có thật, trích nguồn rõ** (`footer_source`) — không
tự bịa số nghiên cứu/giá để ảnh "nhìn thuyết phục hơn". Nếu bài không có số
liệu/so sánh nào đủ chắc chắn để làm infographic, dùng thêm 1 ảnh thật khác
trong kho `public/assets/images/` thay vì ép infographic vào.

## 3. Upload ảnh lên public URL — bucket Supabase `blog-images`

Không commit vào git/không cần chờ deploy Vercel — dùng bucket `blog-images`
đã có sẵn (`src/admin/adminApi.ts`). Cần `service_role` key để bypass RLS:

1. Lấy key từ n8n (đã có sẵn, KHÔNG hỏi lại Joe) — xem chi tiết đầy đủ trong
   `ta_image_skill_comparison.md` mục "Cách đưa ảnh lên public URL" (đọc kỹ
   phần dùng `docker cp` cả `-wal`/`-shm`, và quy tắc không dán token thẳng
   vào lệnh bash/chat).
2. Upload:
   ```
   curl -X POST "https://xcwirgrlnibnjmseglee.supabase.co/storage/v1/object/blog-images/<path>.png" \
     -H "apikey: $(cat <file-chứa-token>)" -H "Authorization: Bearer $(cat <file-chứa-token>)" \
     -H "Content-Type: image/png" --data-binary "@<file>.png"
   ```
3. Public URL: `https://xcwirgrlnibnjmseglee.supabase.co/storage/v1/object/public/blog-images/<path>.png`
   — verify bằng `curl -o /dev/null -w "%{http_code}"` phải ra `200` trước
   khi gắn vào bài.

## 4. Gắn ảnh vào bài

- Ảnh bìa: cột `featured_image_url` + `featured_image_alt` (alt mô tả đúng
  nội dung ảnh — bắt buộc theo `docs/DESIGN_SYSTEM.md` mục 4).
- Ảnh thứ 2 trong thân bài: chèn ngay trong `body` bằng cú pháp markdown
  `![mô tả ảnh](url-ảnh)` trên 1 dòng riêng, giữa 2 đoạn văn hoặc ngay dưới
  đoạn giải thích số liệu liên quan — `BlogPostDetail.tsx` (parser markdown
  tự viết trong repo) đã hỗ trợ cú pháp này từ 2026-08-14, render thành
  `<figure>` bo góc + caption tự động từ phần `[mô tả ảnh]`.
  KHÔNG dùng cú pháp `<img>` HTML thô — parser chỉ nhận đúng dạng
  `![...](...)`.

## 5. Việc chưa làm / có thể mở rộng sau

- Chưa backfill ảnh thứ 2 cho các bài đã đăng trước 2026-08-14 (chỉ 1 bài —
  "Thẩm Định Sâm Ngọc Linh" — có sẵn ảnh so sánh, đặt làm ảnh bìa chứ chưa
  chèn ảnh thứ 2 trong thân). Làm dần khi rà soát lại, không cần làm hàng loạt
  ngay trừ khi Joe yêu cầu rõ.
- Chưa tự động hoá bước tạo+upload ảnh vào flow AUTO_POST_CMS của n8n — vẫn
  là bước Claude làm tay khi được gọi.
