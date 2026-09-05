# 10 repo/tool nâng cấp KOC Mai + livestream — kèm lệnh cài

Ngày tạo: 2026-08-24. Bổ sung cho kế hoạch đã có ở
`docs/kol-sam-ngoc-linh/37-obs-loop-livestream-mai-plan.md` (flow 30 phút +
bộ tool free đã chọn: OBS, Advanced Scene Switcher, Restream.io, ffmpeg) —
KHÔNG lặp lại, chỉ thêm phần kỹ thuật cụ thể (repo GitHub) còn thiếu trong
file 37: playlist shuffle tự động, overlay HTML, và các repo B5/B6/B8 đã
note sơ trong file 35 nay research kỹ hơn.

## Bảng tổng quan

| # | Repo/Tool | Vai trò | Lệnh cài | Ưu tiên | Trạng thái |
|---|---|---|---|---|---|
| 1 | `jb-alvarado/ffplayout` | Phát 24/7 từ playlist JSON, tự động shuffle, overlay logo/text có sẵn — đúng nhu cầu "6 block 5 phút xáo thứ tự mỗi ngày" (bí kíp #1, file 37) | Docker: `docker pull ffplayout/ffplayout` | Cao — thay script ffmpeg tự viết bằng giải pháp có sẵn | ☐ Chưa dùng — hiện dự định tự viết script ffmpeg concat |
| 2 | `UpDownLeftDie/obs-random-videos` | Nhẹ hơn ffplayout — chỉ cần playlist ngẫu nhiên trong OBS qua 1 file HTML Local File, không cần Docker | Tải file `obs-random-videos.html`, add làm Browser Source trong OBS | Trung bình — dùng nếu ffplayout quá nặng cho máy hiện tại | ☐ Chưa dùng |
| 3 | `haasonsaas/obs-agent` | Multi-agent điều khiển OBS qua WebSocket — có thể nối với n8n để tự động chuyển cảnh theo giờ (thay/bổ sung Advanced Scene Switcher) | `npm i` theo README repo, cần OBS WebSocket plugin bật sẵn | Thấp — Advanced Scene Switcher (đã chọn ở file 37) đã đủ dùng, chỉ cân nhắc nếu cần logic phức tạp hơn lịch giờ cố định | ☐ Không cần gấp |
| 4 | `obsproject/obs-websocket` | Giao thức chuẩn để mọi script/n8n điều khiển OBS từ xa — nền tảng cho mục #3 và cho n8n theo dõi stream (mục "kiểm tra rớt mạng" file 37) | Cài plugin trong OBS Settings → Tools → WebSocket Server Settings (đã tích hợp sẵn OBS ≥28, không cần cài riêng) | Cao — cần bật TRƯỚC khi làm bất kỳ automation OBS nào | ☐ Chưa xác nhận đã bật trên máy Mai |
| 5 | `davidjerleke/embla-carousel` version mới (kiểm tra lại) | KHÔNG áp dụng — ghi ở đây để nhắc: nếu sau này cần carousel cho trang livestream/VOD, dùng `keen-slider` (xem `WEB_UPGRADE_10_REPOS.md` #3), không quay lại embla trừ khi xác nhận hỗ trợ React 19 | — | — | ⚠️ Cấm dùng lại (đã rollback 1 lần, gây vỡ site) |
| 6 | ffmpeg concat playlist script (tự viết, không phải repo có sẵn) | Cắt 1 video 30 phút thành 6 block, xáo thứ tự mỗi 24h — bí kíp #1 file 37 | Đã có ffmpeg cài sẵn (`ta_studio/backend/app.py` dùng rồi) — chỉ cần viết script `.cjs`/`.py` mới, giao Qwen/Ox | Cao | ☐ Chưa viết — brief trong `tasks/todo.md` |
| 7 | Overlay đồng hồ/ticker HTML (tự viết, không phải repo) | Browser Source OBS — đồng hồ real-time + ticker câu hỏi thật (bí kíp #2, #3 file 37) | Không cần thư viện ngoài — HTML/CSS/JS thuần, `setInterval` | Cao | ☐ Chưa viết — brief trong `tasks/todo.md` |
| 8 | `SamurAIGPT/AI-Influencer-Generator` (= mục B8 file 35) | AI persona/gương mặt ảo — CHỈ dùng nếu Joe xác nhận, PHẢI gắn nhãn AI rõ ràng | — | Thấp — chờ Joe quyết định | ☐ Chờ quyết định (giống B8) |
| 9 | `restreamio` (không phải repo, dịch vụ SaaS free tier) | Multistream FB+TikTok từ 1 OBS — đã chọn trong file 37, ghi lại ở đây cho đủ bộ 10 | Đăng ký tài khoản restream.io, không cần code | Cao (đã quyết định dùng) | ☐ Joe tự đăng ký tài khoản |
| 10 | `Kling AI` + `ElevenLabs` (Mai Video Pipeline đã có) | Sinh đoạn video mới định kỳ nạp vào playlist (mục "Dựng/làm mới đoạn video" file 37) | Đã tích hợp sẵn trong n8n Mai Video Pipeline (keys thật, CHƯA test) | Cao nhưng CHƯA test | ⚠️ Chưa test lần nào thật (tốn phí ElevenLabs+Kling, cần Joe duyệt trước khi bấm — xem [[project_mai_studio_video_pipeline]]) |

## Thứ tự đề xuất

1. **#4 obs-websocket** — bật trước tiên, nền tảng cho mọi automation khác.
2. **#6 + #7** (script playlist shuffle + overlay HTML) — 2 việc kỹ thuật cụ
   thể còn thiếu thật sự trong file 37, giao Qwen/Ox viết ngay.
3. **#1 ffplayout** — cân nhắc thay ffmpeg script tự viết nếu #6 quá phức
   tạp để tự duy trì.
4. **#9 Restream.io** — Joe tự đăng ký, không cần code.
5. **#10 Mai Video Pipeline test thật** — CẦN Joe duyệt phí trước, đây là
   việc bị chặn lâu nhất trong toàn bộ backlog KOC (xem handoff #1).
6. **#3, #8** — để sau, không gấp.

## Lưu ý bắt buộc

- Đọc rủi ro chính sách ở đầu file 37 trước khi làm bất kỳ mục nào —
  loop 100% không người thật theo dõi là vi phạm ToS FB/TikTok.
- KHÔNG dùng lại embla-carousel (#5) — bài học đã trả giá 1 lần.
- Mục #10 (test Mai Studio thật) tốn phí thật — không tự bấm chạy, chờ Joe.
