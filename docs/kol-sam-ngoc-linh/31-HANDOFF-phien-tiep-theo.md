# HANDOFF — đọc file này đầu tiên ở phiên sau

Ngày: 2026-08-14. Phiên trước hết token giữa chừng — đây là trạng thái
THẬT, đã kiểm chứng, không phải suy đoán. Đọc xong file này là đủ ngữ cảnh,
không cần đọc lại toàn bộ lịch sử chat.

## Việc ngay trước mắt — Postiz đang mở, chờ kết nối kênh

Joe vừa tạo xong tài khoản Postiz (`localhost:4007`), đang ở màn hình
"Connect Your Channels" (onboarding bước 1/2). **Việc tiếp theo: Joe tự
bấm vào ô "Facebook Page" và "Tiktok" trên màn hình đó → đăng nhập OAuth
bình thường** (Claude không làm thay được — cần đăng nhập tài khoản thật).
Sau khi kết nối xong, báo phiên sau để nối Postiz vào workflow n8n.

## Đã xong thật trong phiên này (đã kiểm chứng qua Supabase/n8n/curl, không phải đoán)

1. **4 bài blog thật đã publish**: MR2, Stress/trí nhớ, Miễn dịch (300+ hợp
   chất), Trẻ hóa — đều grounded từ PubMed/Consensus thật (có DOI), có ảnh
   thật, có caption 6 kênh, có video gắn vào TikTok trong CMS.
2. **Video pipeline miễn phí đã cài xong** tại
   `D:\TA page\video-pipeline\super-video-maker-skill\` — ảnh thật + edge-tts
   (giọng đọc free) + Whisper local (`models/ggml-small.bin`, phụ đề đồng
   bộ, KHÔNG dùng text Whisper đoán vì hay sai chính tả tên riêng — chỉ
   dùng timestamp, text vẫn là kịch bản gốc viết tay). Script tái sử dụng:
   `tmp/video_jobs/make_video.sh`.
3. **Tính năng truy xuất QR đã xây sẵn từ trước** (không phải phiên này) —
   chỉ chờ Joe tạo lô hàng thật đầu tiên qua admin `/gate-vkd-control-2026/inventory-qr`.
4. **Postiz đã cài xong** tại `D:\TA page\postiz\` (docker-compose.yaml +
   `dynamicconfig/development-sql.yaml` — file này BẮT BUỘC phải có, thiếu
   là container `temporal` crash ngay, đã từng gặp và vá trong phiên này).
   Chạy ở `localhost:4007`. Tài khoản Joe đã tạo xong.

## Đang bị chặn — cần Joe tự làm, không tự làm thay được

| Việc | Link | Vì sao chặn |
|---|---|---|
| Facebook đăng thật | [developers.facebook.com/apps](https://developers.facebook.com/apps) | Tài khoản dev Meta (Moc Nguyen) bị khoá, đang chờ Joe tự xác minh. **⚠️ Sửa 2026-08-14: giả định "Postiz né được checkpoint này" SAI** — Postiz self-host vẫn cần tạo App Facebook riêng (FACEBOOK_APP_ID/FACEBOOK_APP_SECRET trong `docker-compose.yaml`, đang để trống → lỗi "ID ứng dụng không hợp lệ" khi Joe thử kết nối). Xem hướng dẫn đầy đủ ở file 35 mục B10. |
| TikTok đăng thật | [developers.tiktok.com/apps](https://developers.tiktok.com/apps) | Chưa từng tạo Developer App + OAuth. Hoặc dùng Postiz thay thế. |
| Vá lỗi token Telegram plaintext | — | Xem hướng dẫn tay chi tiết ở file 29, chưa làm (UI n8n bị treo khi Claude thử qua browser 4 lần liên tiếp — Claude KHÔNG được tự đọc/nhập API key, đây là quy tắc an toàn cố định). |

## File tham khảo đầy đủ (đọc theo thứ tự nếu cần chi tiết)

- **20-27**: research grounding, đa kênh, video repo, truy xuất QR — nền
  tảng đã xây trong các phiên trước phiên này.
- **28**: cấu hình node Telegram duyệt nhanh (chưa build vào n8n).
- **29**: hướng dẫn tay vá lỗi token plaintext (chưa làm).
- **30**: MASTER — tổng hợp mọi việc tay cần làm, có link, copy-paste được.
- **31 (file này)**: handoff mới nhất, đọc đầu tiên.

## Việc phiên sau nên làm ngay (theo thứ tự ưu tiên)

1. Hỏi Joe: đã kết nối kênh Postiz chưa? Nếu xong → nối Postiz vào n8n
   (thay thế nhánh Facebook Graph API cũ đang hỏng). **Đây cũng là mục B10
   trong file 35 — cùng 1 việc, xem file 35 để có bước chi tiết.**
2. Nếu Joe rảnh, hướng dẫn vá lỗi token plaintext (file 29) — 5 phút, không
   phụ thuộc gì khác.
3. Viết thêm bài "Cổng truy xuất nguồn gốc" nếu Joe đã tạo lô hàng thật
   (kiểm tra `select * from batches where is_demo=false` trước khi viết —
   đừng dùng dữ liệu demo).
4. **Backlog kỹ thuật mới (2026-08-14, chưa bắt đầu bất kỳ mục nào)**: xem
   [35-10-repo-flow-kol-nghien-cuu-va-ke-hoach.md](35-10-repo-flow-kol-nghien-cuu-va-ke-hoach.md)
   — 10 repo/flow GitHub Joe research để nâng cấp pipeline n8n (research
   trend, ghostwriter thẩm quyền từ PubMed, phân rã đa kênh, chống trùng
   góc, video, hub đăng bài...). Có bảng trạng thái + thứ tự làm đề xuất ở
   cuối file đó (mục C). Làm dần qua nhiều phiên, KHÔNG cần xong hết 1 lần —
   cập nhật cột "Trạng thái" trong bảng mỗi khi làm xong 1 mục.

## Lưu ý về cách làm việc đã rút ra trong phiên này (để phiên sau đỡ lặp lại)

- **UI n8n qua browser automation rất hay treo/reset** — ưu tiên viết
  hướng dẫn tay thay vì cố click qua UI nếu thử 2-3 lần không được.
- **Không tự đọc/nhập API key, token, mật khẩu dù được phép** — kể cả key
  tự tạo ra, hệ thống tự chặn hành động đọc clipboard chứa secret. Luôn để
  Joe tự dán vào field, Claude chỉ chuẩn bị sẵn chỗ trống.
- **Luôn kiểm tra Supabase/n8n execution log thật** trước khi báo "xong" —
  giao diện có thể hiện "thành công" giả (VD: nút Duyệt & Đăng TikTok đánh
  dấu is_published=true dù chưa có nhánh xử lý thật nào chạy).
