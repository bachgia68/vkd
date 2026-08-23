# Phát triển KOL "VA" + Joe — 2 gương mặt thật nội bộ, không thuê ngoài

Ngày: 2026-08-14. Quyết định: dùng chính Joe và VA (gương mặt thật đã có
sẵn tư liệu quay) làm KOL, không chi tiền thuê KOL ngoài.

## Tư liệu thật đã có sẵn (kiểm tra tại `D:\TA page\video ban hang\`)

- `KOL_face.png` — chân dung VA (chủ vườn/người bán thật).
- `sanpham1.jpg` — VA cầm cụm hoa/quả sâm tại cửa hàng.
- `mat VA.jfif` — VA tại vườn ươm sâm giống.
- `video1.mp4` → đã dựng thành `output/final_video_1.mp4` (38.3s, dọc
  1080x1920) — VA nói tự nhiên, giới thiệu mùa quả sâm chín, đã có hook +
  outro CTA đúng màu thương hiệu TA. **Đây là video hero đầu tiên, sẵn
  sàng đăng ngay** nếu chưa đăng.

Ghi chú: phiên trước từng cân nhắc face-swap/AI avatar (Deep-Live-Cam,
SadTalker) rồi **bỏ hẳn hướng đó** vì đã có footage thật của đúng VA —
video thật luôn tăng trust/conversion tốt hơn avatar AI khi bán hàng.
Giữ nguyên quyết định này: ưu tiên quay thật, chỉ dùng avatar AI (pipeline
có sẵn ở `video-pipeline/super-video-maker-skill/`, các recipe
`avatar-*`) khi thật sự không có cách quay thật (vd cảnh minh hoạ khoa
học không quay được).

## Phân vai đề xuất

- **VA**: gương mặt "người bán/người vườn" — gần gũi, tại vườn/cửa hàng,
  giới thiệu sản phẩm, trả lời kiểu KOC đời thường. Ưu tiên cho clip bán
  hàng ngắn, livestream, review sản phẩm — khớp với affiliate TikTok Shop
  vừa mở.
- **Joe**: gương mặt "chủ thương hiệu" — tin cậy, kiến thức khoa học
  (MR2, nghiên cứu), câu chuyện xây dựng TA — khớp với vai trò kênh cá
  nhân "Việt Sâm Ký" đã có kịch bản sẵn ở file 03.

## Việc cần Joe tự làm (không tự động hoá được)

1. Quay thêm clip mới bằng điện thoại — dùng đúng kịch bản có sẵn ở
   [03-kich-ban-quay-3-clip.md](03-kich-ban-quay-3-clip.md) (đổi chủ ngữ
   sang VA hoặc Joe tuỳ cảnh). Không cần ekip, quay dọc 1080x1920 là đủ.
2. Gửi file thô (video/ảnh mới) vào `D:\TA page\video ban hang\` để phiên
   sau dựng tiếp bằng đúng pipeline đã dùng cho `final_video_1.mp4`.
3. Quay xong ưu tiên: 1 clip VA tại vườn giới thiệu sản phẩm sắp mở
   affiliate (gắn được vào giỏ hàng TikTok Shop), 1 clip Joe nói về MR2/
   khoa học sâm (dùng cho fanpage + kênh cá nhân).

## Việc Claude làm được ngay (không cần chờ Joe)

- Dựng thêm bản cắt/caption khác từ `video1.mp4` đã có nếu cần thêm
  version cho các kênh khác nhau (TikTok/Reels/Shorts).
- Viết caption 6 kênh + hashtag cho `final_video_1.mp4` nếu chưa có, gắn
  vào lịch đăng (file 12/19).
- Khi Joe gửi clip mới, dựng ngay theo đúng quy trình đã kiểm chứng ở
  `tasks/plan.md` (Whisper transcript → cắt đoạn chết → hook/outro →
  xuất 1080x1920 H.264/AAC).

## Liên kết với TikTok Shop Affiliate (vừa mở Open Collaboration 10-15%)

Ưu tiên tiếp theo: dựng 1 clip VA giới thiệu đúng sản phẩm đã bật
affiliate, đăng lên TikTok Shop **gắn giỏ hàng** (không chỉ đăng thường) —
đây là cách nhanh nhất tận dụng % hoa hồng vừa đặt, tự bán được chứ không
chỉ chờ KOL ngoài vào nhận link.
