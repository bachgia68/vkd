# 37. Livestream lặp OBS cho KOC Mai — flow 30 phút, tool free, "bí kíp" thật KOC hay dùng

Joe chọn hướng: dựng 1 video bán hàng ~30 phút, phát LẶP LẠI 24/7 qua OBS
(giả lập livestream), để Mai không cần đứng máy cả ngày. Đây là kỹ thuật
thật, rất phổ biến trong live commerce Việt Nam/Trung Quốc ("phòng live tự
động", "loop stream") — ghi rõ CẢ cách làm THẬT lẫn RỦI RO thật, không tô
hồng.

## ⚠️ Rủi ro chính sách — đọc trước khi làm

Facebook và TikTok đều có điều khoản cấm trình bày nội dung dựng sẵn như
đang phát trực tiếp thật mà không có gì phân biệt. Vi phạm lặp lại có thể
bị giảm reach, gỡ nhãn LIVE, hoặc hạn chế tài khoản. Không có cách nào loại
bỏ hoàn toàn rủi ro này nếu stream 100% là video dựng sẵn phát lại vô hạn.
**Giảm rủi ro thực tế** (KOC lớn vẫn làm):
- Luôn có 1 người thật (Mai hoặc trợ lý) theo dõi Telegram/tin nhắn thật
  song song, nhảy vào trả lời khách hỏi mua — không để 100% vô nhân.
- Không chạy đúng 1 loop y hệt mãi mãi — xáo trộn thứ tự + thêm đoạn mới
  định kỳ (chi tiết bí kíp #1, #7 bên dưới) để không phải "1 file lặp vô
  hạn" trần trụi.
- Ưu tiên khung giờ thấp điểm (đêm khuya, sáng sớm) chạy loop, khung giờ
  vàng (12h, 20h) Mai lên thật hoặc dùng bản mới nhất — hybrid, không loop
  100% thời gian.
- Cân nhắc dùng nhãn phụ đề "Phát lại chương trình live hôm nay" ở góc màn
  hình ngoài giờ vàng — giảm rủi ro bị báo cáo, vẫn giữ được hiệu ứng liên
  tục có người bán.

## Bộ tool FREE — không cái nào tốn phí cố định

| Việc | Tool | Vì sao |
|---|---|---|
| Bộ não phát sóng | **OBS Studio** | Free, mã nguồn mở, chuẩn công nghiệp |
| Phát 1 video lặp không giật hình | OBS Media Source, tick **Loop** | Có sẵn trong OBS, không cần plugin |
| Tự động đổi cảnh/sản phẩm theo giờ | **Advanced Scene Switcher** (plugin OBS free) | Lên lịch chuyển scene theo giờ trong ngày, không cần đứng bấm |
| Phát cùng lúc nhiều nền tảng (FB+TikTok) từ 1 OBS | **Restream.io** (gói free, giới hạn số kênh + độ phân giải) | Không cần mở OBS riêng cho từng nền tảng |
| Overlay đồng hồ thật + đếm ngược ưu đãi + ticker comment | OBS **Browser Source** trỏ vào 1 file HTML tự làm (xem mục dưới) | Miễn phí 100%, tự chủ nội dung |
| Dựng/làm mới đoạn video định kỳ | **Mai Video Pipeline** đã có sẵn (n8n + ElevenLabs + Kling AI) | Không cần dựng tay, tự động sinh đoạn mới nạp vào playlist |
| Theo dõi stream có bị rớt không | n8n Schedule Trigger + kiểm tra RTMP/API Restream, báo Telegram | Tái dùng hạ tầng Telegram bot sẵn có |
| Cắt/nối/chuẩn hoá video không giật khi loop | **ffmpeg** (free, đã cài sẵn trên máy — thấy trong `ta_studio/backend/app.py`) | Tránh khựng hình ở điểm nối loop |

Không cần Blotato, không cần Streamlabs Prime, không cần StreamYard trả phí
— toàn bộ chuỗi trên free hoàn toàn (Restream free tier đủ dùng cho 2 kênh
FB+TikTok ở độ phân giải thường).

## Flow nội dung 30 phút (khung dùng lặp lại, đổi sản phẩm/ưu đãi mỗi vòng)

Đây là cấu trúc chuẩn ngành live commerce — không phải nói liên tục 30
phút, mà chia nhịp để giữ chân người xem dù là loop:

| Thời gian | Nội dung | Mục đích |
|---|---|---|
| 0:00–2:00 | Hook mở đầu + giới thiệu chương trình hôm nay + ưu đãi flash đang chạy | Giữ người mới lướt qua ở lại 3 giây đầu |
| 2:00–6:00 | Giới thiệu sản phẩm #1: nguồn gốc Sâm Ngọc Linh, USP (đúng giọng Quiet Luxury đã chọn cho TA) | Xây thẩm quyền, không thổi phồng |
| 6:00–10:00 | Demo/trải nghiệm thật (video Mai dùng sản phẩm, cận cảnh) | Bằng chứng thực tế |
| 10:00–14:00 | Trả lời câu hỏi thường gặp (dùng câu hỏi THẬT đã nhận trước đó — xem bí kíp #3) | Tạo cảm giác đang tương tác |
| 14:00–16:00 | Minigame nhỏ / mã giảm giá bí mật đọc trong video | Giữ chân, tạo lý do xem hết |
| 16:00–20:00 | Giới thiệu sản phẩm #2 hoặc combo quà tặng | Đa dạng hoá, tránh nhàm nếu xem lại |
| 20:00–24:00 | Chốt đơn: hướng dẫn đặt hàng, mã giảm giá giới hạn | Chuyển đổi |
| 24:00–27:00 | Nhắc ưu đãi sắp hết, FOMO ("còn 15 phút") | Thúc đẩy quyết định |
| 27:00–30:00 | Cảm ơn, teaser buổi sau, countdown → loop lại từ 0:00 | Khép vòng mượt |

## Bí kíp thật ("1% KOC mới biết") — kỹ thuật, không phải mẹo mơ hồ

1. **Không loop 1 file duy nhất — cắt thành 6 block ~5 phút, xáo thứ tự
   mỗi ngày bằng script.** Nền tảng dễ phát hiện "y hệt lặp vô hạn" hơn
   "nội dung tương tự nhưng thứ tự khác mỗi ngày". Dùng ffmpeg concat với
   playlist file sinh ngẫu nhiên mỗi 24h (cron n8n).
2. **Overlay đồng hồ thật chạy real-time** (Browser Source, JS
   `setInterval` lấy giờ hệ thống) — người xem hay liếc góc màn hình, đồng
   hồ nhảy đúng giờ tạo cảm giác "đang live thật" dù nội dung là loop.
3. **Ticker bình luận dùng câu hỏi THẬT đã từng nhận** (không bịa) — lấy
   từ lịch sử tin nhắn/comment thật của Mai trước đó, xoay vòng hiển thị.
   Vừa đúng đạo đức (không giả mạo người xem ảo hoàn toàn), vừa tạo social
   proof thật.
4. **Đồng hồ đếm "còn X suất giá sốc"** giảm dần theo thời gian thật (biến
   đếm ngược lưu trong file JSON nhỏ, script n8n reset mỗi vòng loop mới) —
   tạo khẩn cấp dù nội dung lặp.
5. **OBS auto-reconnect bật sẵn** (Settings → Advanced → Network → "Auto
   reconnect") — stream 24/7 mà rớt mạng 2 phút không có người canh sẽ mất
   cả buổi doanh số, đây là lỗi phổ biến nhất người mới gặp.
6. **Bơm nội dung mới định kỳ, không để loop tĩnh mãi mãi** — mỗi tuần
   dùng Mai Video Pipeline sinh 1 đoạn mới (5 phút, 1 sản phẩm mới hoặc ưu
   đãi mới), ffmpeg ghép thay 1 block cũ trong playlist 6 block — vòng loop
   "sống", không phải 1 file chết.
7. **Luôn có người thật trực Telegram song song** — n8n đã có sẵn bot
   (`@tasamngoclinh_bot`) nhận tin nhắn khách thật trong lúc loop chạy, Mai
   hoặc Joe tự nhảy vào trả lời/chốt đơn khi có khách hỏi mua thật — đây là
   khác biệt giữa "loop giả toàn phần" (rủi ro cao, chuyển đổi thấp) và
   "loop nền + người thật chốt đơn" (an toàn hơn, hiệu quả hơn).

## 5 phương án mạnh hơn OBS (self-hosted, free, cho chạy 24/7 không cần máy tính desktop mở sẵn)

OBS là GUI desktop — phải mở máy, đăng nhập Windows, dễ crash/rớt khi máy
ngủ. 5 lựa chọn dưới đây "mạnh hơn" theo đúng nghĩa: chạy headless (không
cần màn hình), tự phục hồi khi lỗi, một số có REST API để n8n điều khiển
thẳng — đúng kiểu hạ tầng KOC lớn/agency chuyên nghiệp hay dùng, không phải
mẹo phổ thông.

| # | Repo/Công cụ | Vì sao mạnh hơn OBS | Độ khó cài |
|---|---|---|---|
| 1 | **`datarhei/restreamer`** (GitHub, self-host qua Docker) | Sinh ra ĐÚNG cho việc này: loop video 24/7 + đẩy nhiều nền tảng cùng lúc + dashboard theo dõi + tự phục hồi khi rớt kết nối. Không cần desktop mở, chạy như 1 container y hệt Postiz/n8n đang có. | Thấp — 1 lệnh `docker run`, có UI web |
| 2 | **`ossrs/srs`** (SRS - Simple Realtime Server) | Server RTMP/multistream cực nhẹ, được dùng thật trong ngành live commerce Trung Quốc (chính ngành Joe đang tham khảo) để relay 1 nguồn ra nhiều điểm đăng. Rất bền, ít tốn tài nguyên. | Trung bình — cấu hình file, không có UI đẹp |
| 3 | **FFmpeg headless + Windows Task Scheduler** (không cần GUI, không cần OBS) | Đơn giản nhất, bền nhất cho đúng nhu cầu "1 video loop 24/7" — không có giao diện để crash, chạy nền như 1 service, tự khởi động lại nếu Windows reboot. Lệnh mẫu: `ffmpeg -re -stream_loop -1 -i playlist.txt -c copy -f flv rtmp://...`. | Rất thấp — không cần cài thêm gì ngoài ffmpeg đã có sẵn trên máy |
| 4 | **Ant Media Server Community Edition** (`ant-media/Ant-Media-Server`) | Có REST API đầy đủ — n8n có thể GỌI THẲNG để bật/tắt stream, đổi playlist, theo dõi trạng thái, y hệt cách n8n đang điều khiển Postiz. Hợp nếu muốn tích hợp sâu vào workflow tự động hoá đã có. | Cao hơn — cần Java runtime, cấu hình nhiều hơn |
| 5 | **`savonet/liquidsoap`** — "bí kíp" thật sự ít người biết | Đây là công cụ ngành phát thanh/truyền hình chuyên nghiệp dùng phát tự động 24/7 hàng chục năm nay (trước cả livestream bán hàng ra đời) — hỗ trợ SẴN "day-parting" (tự đổi nội dung theo khung giờ trong ngày), crossfade mượt giữa các đoạn, không giật hình ở điểm nối — đúng thứ OBS không làm tốt bằng. Ít người trong ngành livestream bán hàng VN biết tới vì nó xuất thân từ ngành radio. | Cao — cú pháp cấu hình riêng (ngôn ngữ Liquidsoap), cần thời gian học |

**Đề xuất thực tế cho Joe**: bắt đầu với **#3 (FFmpeg headless)** để chạy
thử ngay hôm nay (không cài gì thêm), sau đó nếu cần dashboard theo dõi +
đẩy nhiều kênh cùng lúc thì chuyển sang **#1 (datarhei/restreamer)** — đây
là 2 lựa chọn có tỷ lệ công sức/hiệu quả tốt nhất, đúng gu hạ tầng Docker
Joe đang dùng cho cả stack (Postiz, n8n, Strapi đều Docker).

## Việc cần Joe tự làm (không tự động hoá được)

1. Cài OBS Studio + plugin Advanced Scene Switcher (tải, không cần tài
   khoản trả phí).
2. Tạo tài khoản Restream.io free, kết nối kênh Facebook Page + TikTok
   (TikTok RTMP cần tài khoản đủ điều kiện — TikTok giới hạn quyền livestream
   theo follower/loại tài khoản, kiểm tra trước, có thể chưa mở được ngay).
3. Quay/dựng lần đầu 6 block 5-phút gốc (dùng Mai Video Pipeline đã có sẵn
   để tạo nhanh, hoặc quay thật bằng điện thoại) — Claude không tự quay
   video thật được.
4. Quyết định khung giờ nào chạy loop, khung giờ nào Mai lên thật (đề xuất:
   loop giờ thấp điểm, live thật 12h/20h).

## Việc tôi có thể chuẩn bị sẵn ngay (không cần đợi Joe)

- File overlay HTML (đồng hồ + đếm ngược + ticker) để cắm thẳng vào OBS
  Browser Source — xem `docs/kol-sam-ngoc-linh/overlay/mai-live-overlay.html`.
- Script Python xáo playlist 6 block mỗi ngày (`ffmpeg concat`), chạy qua
  Task Scheduler Windows — có thể chuẩn bị khi Joe có 6 file video gốc.
