# Tăng trưởng Fanpage/TikTok — audit số liệu thật + kế hoạch hành động

Ngày: 2026-08-09. Đọc file này khi Joe nói "KOL" liên quan tới tăng follow/tương tác trên Facebook/TikTok — khác với dự án kênh cá nhân "Việt Sâm Ký" ở `00-HANDOFF.md` (đi thực địa/tìm nguồn hàng quốc tế).

## -1. TikTok thật: @tasamngoclinh — ĐÃ sửa data sai, CHƯA auto-post được

Joe xác nhận TikTok thật là **@tasamngoclinh**. Kiểm tra Supabase bảng
`channels` (project `xcwirgrlnibnjmseglee`) thấy:
- Row TikTok cũ ghi `channel_url: tiktok.com/@vuasamngoclinh` — **tên cũ từ
  thời VKD, sai** (giống lỗi số Zalo/email cũ đã gặp ở site). Đã sửa thành
  `tiktok.com/@tasamngoclinh` qua SQL trực tiếp.
- `webhook_url` của row TikTok là `http://localhost:5678/webhook/publish-to-channel`
  — **placeholder cục bộ, không phải endpoint thật**, không đổi từ lúc tạo
  row (04/08/2026). Đọc code `src/admin/adminApi.ts` (`publishCaption`) xác
  nhận: **repo web này KHÔNG gọi API Facebook/TikTok/... trực tiếp** — chỉ
  bắn webhook cho 1 automation ngoài (n8n) tự gọi API thật. Nghĩa là bấm
  "Duyệt & Đăng" cho kênh TikTok trong CMS admin **hiện tại sẽ không đăng
  được gì cả** (webhook trỏ vào localhost, không ai nhận).
- Theo `D:\TA page\video-pipeline\HANDOFF_NEXT_SESSION.md`, Facebook ĐÃ đăng
  thật tự động qua chính cơ chế webhook này (n8n có node Graph API thật) —
  vậy hạ tầng đúng đã có sẵn cho Facebook, chỉ TikTok là chưa được nối.

**Để TikTok tự đăng được thật, cần theo đúng thứ tự (không thể bỏ qua bước
nào, và bước 1-2 bắt buộc Joe tự làm — gắn với tài khoản/danh tính doanh
nghiệp của Joe, AI không làm thay được):**
1. Joe tạo app trên **TikTok for Developers** (developers.tiktok.com), xin
   quyền **Content Posting API** — cần xác minh doanh nghiệp, có thể phải
   chờ TikTok duyệt app (không tức thời).
2. Sau khi có Client Key/Secret, làm OAuth lấy access token cho tài khoản
   @tasamngoclinh (login kit — có sẵn 1 phần hạ tầng: commit cũ
   "add TikTok domain verification file" đã verify domain `tasamngoclinh.com`
   trên TikTok Developer Portal, đây là bước cần cho redirect URI OAuth).
3. Thêm node đăng bài TikTok thật vào workflow n8n hiện có (nơi Facebook
   đang chạy) — dùng access token từ bước 2.
4. Đổi `webhook_url` của row TikTok trong Supabase `channels` từ
   `localhost:5678` sang đúng URL webhook n8n thật (giống Facebook đang
   dùng) — bước này AI làm được ngay khi có URL thật, chỉ 1 câu UPDATE SQL.

Trong lúc chờ, admin CMS "Duyệt & Đăng" kênh TikTok vẫn dùng được để tự
copy caption đăng tay (không có webhook thì hệ thống tự hiểu là "chỉ đánh
dấu đã duyệt", không báo lỗi giả).

## 0. Vì sao không dùng bot/flow tự động "tăng follow" từ GitHub

Joe từng yêu cầu tìm 10 flow GitHub cài chạy tự động tăng follow/tương tác — **đã từ chối chủ động**, không tìm/cài. Lý do:
- Gần như toàn bộ công cụ dạng này là bot auto-follow/unfollow/like/comment hàng loạt — vi phạm điều khoản Facebook/TikTok, rủi ro thật là khoá fanpage/tài khoản chính thức của TA.
- Nhiều bot yêu cầu đăng nhập/cookie tài khoản thật — rủi ro bảo mật (lộ quyền quản trị fanpage).
- Chạy code không rõ nguồn gốc từ GitHub lên máy cũng là rủi ro (mã độc trá hình).

Thay vào đó: audit số liệu THẬT từ Meta Business Suite (đã đăng nhập sẵn trên Chrome của Joe) + kế hoạch tăng trưởng hợp pháp bên dưới.

## 1. Số liệu thật đã xem (28 ngày qua, 12/7–8/8/2026, fanpage "Vườn Sâm Ngọc Linh nhà Khánh")

- **25 người theo dõi** tổng, 23 người theo dõi thật mới trong 28 ngày — tài khoản còn rất nhỏ, đúng như Joe cảm nhận.
- **2.708 lượt xem, 166 lượt tương tác** trong 28 ngày — nhưng biểu đồ tăng vọt CHỈ bắt đầu từ khoảng 6/8, gần như bằng 0 trước đó → những bài/video mới đăng đang có tác dụng thật, không phải ảo giác.
- **92 lượt xem đạt tối thiểu 3 giây, nhưng 0 lượt xem đạt tối thiểu 1 phút** — dấu hiệu retention (giữ chân người xem) của video đang rất kém, cần xem lại phần đầu video có đủ hấp dẫn để giữ người xem qua giây thứ 3-5 không.
- **Cơ cấu nội dung theo lượt xem**: bài nhiều ảnh chiếm 58%, bài 1 ảnh chiếm 20,4% — nghĩa là ~78% lượt xem đến từ ẢNH, không phải video/Reels, dù Facebook hiện đang ưu tiên phân phối Reels/video nhất (banner chính Meta: "Video bạn đăng trên Facebook giờ sẽ là thước phim").
- Bài đăng gần nhất là 1 bài CHỮ rất dài (nhiều đoạn, đánh số 1️⃣2️⃣, không có hình động) — định dạng này có reach tự nhiên thấp hơn nhiều so với video ngắn trên thuật toán hiện tại.
- Video/bài gần nhất khác lại có giọng văn tốt: ngắn gọn, xưng "em", kể chuyện thật ("Nãy vườn nhà em mới thu được mẻ sâm...") — **giữ đúng giọng này**, đừng quay lại kiểu bài dài liệt kê.

## 2. Chẩn đoán — vì sao "flow không ổn"

1. Đang đăng quá nhiều ẢNH/CHỮ DÀI, quá ít VIDEO NGẮN — ngược với thuật toán Facebook/TikTok hiện tại đang ưu tiên phân phối video ngắn nhất.
2. Video đã đăng có vấn đề giữ chân người xem (0 lượt xem ≥1 phút) — cần xem lại 3-5 giây đầu của chính video đó (mở bài đăng → "Xem thông tin chi tiết" → biểu đồ retention theo giây) để biết chính xác khán giả rời đi ở giây nào.
3. Base quá nhỏ (25 follower) nên mọi thứ đều cần thời gian tích luỹ — không có cách hợp pháp nào "nhảy cóc" giai đoạn này, chỉ có tần suất đăng đều + đúng định dạng mới rút ngắn được.

## 3. Kế hoạch hành động cụ thể

### A. Định dạng nội dung (ưu tiên cao nhất)
- Chuyển tỷ lệ đăng sang **đa số là video ngắn 15-45 giây** (Reels), ảnh/bài chữ chỉ nên là nội dung phụ, không phải trục chính.
- Bài chữ dài kiểu "VÌ SAO NÊN CHỌN..." → cắt thành landing page/bài blog trên chính `tasamngoclinh.com/blog` (đã tối ưu SEO, có route thật, index được Google) rồi chỉ đăng caption ngắn + link trên Facebook, thay vì dán nguyên văn dài lên fanpage.

### B. Hook 3 giây đầu (sửa ngay vấn đề retention)
- Mở video bằng HÌNH ẢNH/HÀNH ĐỘNG thật ngay giây đầu (cầm củ sâm lên, nhổ củ khỏi đất, rót nước...), không mở bằng chữ hay lời chào dài dòng.
- Có thể tái dùng đúng cấu trúc hook đã soạn sẵn trong 4 kịch bản KOL sản phẩm (`../kich-ban-kol-4-san-pham-2026-08-09.md` ở thư mục `site/docs/` gốc — hoa sâm/củ sâm/lá sâm/combo) — các hook đó đã thiết kế theo đúng nguyên tắc "số liệu thật gây tò mò trong 3 giây".

### C. Tần suất & lịch đăng
- Tối thiểu 3-4 video ngắn/tuần, cùng khung giờ cố định (gợi ý 11h-13h hoặc 19h-21h — giờ vàng tương tác của người dùng Việt Nam trên Facebook/TikTok, điều chỉnh lại sau 2-3 tuần khi có dữ liệu thật từ chính fanpage).
- Đăng đồng thời TikTok + Facebook Reels từ cùng 1 video gốc (tăng gấp đôi điểm chạm mà không cần quay thêm).

### D. Hashtag/từ khoá gợi ý cho TikTok (áp dụng cho từng sản phẩm)
Gốc chung: #samngoclinh #ngoclinh #samvietnam #tramy #samnui #vuonsam
Theo sản phẩm: thêm 1-2 tag riêng (#hoasamngoclinh, #cusamtuoi, #lasamngoclinh, #tosamyensao...) — không nhồi quá 5-6 hashtag/video, ưu tiên tag đúng ngách hơn tag chung chung lượt tìm cao nhưng cạnh tranh khốc liệt.

### E. Tương tác thật (không bot)
- Trả lời MỌI bình luận trong giờ đầu sau khi đăng — thuật toán ưu tiên bài có tương tác sớm.
- Đặt 1 câu hỏi cuối caption để gợi bình luận (vd. "Nhà bạn quen dùng sâm lát hay sâm ngâm mật ong hơn?").
- Ghim bình luận tốt nhất lên đầu.
- Cân nhắc dùng đúng công cụ "Quảng bá bài viết"/"Trung tâm quảng cáo" sẵn có trong Meta Business Suite của Joe — boost ngân sách nhỏ (vài trăm nghìn/bài) cho đúng video đang có tín hiệu tốt, đây là cách hợp pháp duy nhất "mua" thêm reach nhanh.

### F. Đo lường
- Check lại "Thông tin chi tiết" mỗi tuần (không phải hàng ngày) — so metric "lượt xem ≥1 phút" cải thiện chưa sau khi sửa hook, đây là chỉ số quan trọng nhất để biết định dạng mới có hiệu quả không.

## 4. Việc cần Joe xác nhận/tự làm

- **Xác nhận có tài khoản TikTok chính thức của TA/Khánh chưa** — nếu chưa, cần tạo trước khi áp dụng chiến lược đăng chéo 2 nền tảng ở mục C.
- Quay lại 3-5 giây đầu của video mới nhất theo đúng nguyên tắc hook ở mục B, rồi đăng thử — sau ~1 tuần kiểm tra "Thông tin chi tiết" xem retention có cải thiện không trước khi nhân rộng cách làm.
