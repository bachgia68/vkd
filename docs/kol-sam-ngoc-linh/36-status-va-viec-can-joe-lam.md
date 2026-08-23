# 36. Trạng thái phiên tự động (2026-08-21) + việc cần Joe làm

Phiên này Joe rời máy giữa chừng, yêu cầu tự động chạy tiếp toàn bộ backlog
10 repo (file 35) + xây "Mai Studio" tích hợp n8n để KOC Mai tự lên video/
livestream. Ghi lại đây CHÍNH XÁC những gì đã làm thật (kiểm chứng qua
Supabase/n8n/docker, không suy đoán) và những gì đang chặn cần Joe quyết
định hoặc tự tay làm.

## ĐÃ LÀM XONG THẬT trong phiên này

1. **B2 (research_queue tự động PubMed) — XONG, đã live.**
   - Bảng `research_queue` tạo mới trên Supabase (`xcwirgrlnibnjmseglee`),
     16 dòng nghiên cứu THẬT lấy từ PubMed (majonoside R2, saponin/stress/
     trí nhớ, saponin/miễn dịch, saponin/trẻ hoá da) — có PMID + DOI thật,
     không bịa.
   - Thêm cột `blog_posts.source_doi` để truy vết nguồn khi bài viết ra đời
     từ 1 dòng research.
   - Đã sửa workflow n8n `Sam Ngoc Linh VKD - Auto CMS` (ID `BcMAh4e0xYXG9bR4`):
     thêm node "Lay Nghien Cuu Chua Dung" (GET research_queue, used=false,
     limit 1) ngay sau Webhook, node "Xay dung Prompt" đọc research đó vào
     prompt (không bịa số liệu ngoài nghiên cứu), thêm node "Danh Dau Nghien
     Cuu Da Dung" (PATCH used=true) sau khi ghi bài vào Supabase. Đã
     import + publish + restart container, log xác nhận workflow active.
   - **ĐÃ TEST THẬT, THÀNH CÔNG** (execution n8n id 124, status success, 76s):
     bài mới "Comparative Analysis of the Ginsenosides..." tạo thật trong
     Supabase (`blog_posts`, id `b8f1f34b...`), nội dung bám đúng nghiên cứu
     (không lạc đề), `research_queue` dòng tương ứng đã `used=true` +
     `used_at` + `blog_post_id` link ngược đúng.
   - **Bug phụ phát hiện khi test, ĐÃ SỬA**: sau khi restart container,
     `strapi_cms` bị mất DNS trong network Docker (`ENOTFOUND strapi`, đúng
     gotcha cũ ở HANDOFF 2026-08-14) — execution đầu tiên (id 123) lỗi vì
     việc này, không liên quan tới thay đổi research_queue. Fix: restart
     `strapi_cms` để làm mới network endpoint (`docker restart strapi_cms`),
     KHÔNG cần `docker network connect` lại vì container vẫn đứng đúng
     network, chỉ endpoint bị "treo" IP rỗng sau khi n8n-vkd restart.
   - **Gap nhỏ CHƯA sửa**: cột `blog_posts.source_doi` chưa được ghi khi tạo
     bài (node "Ghi Bai Vao Supabase" chưa truyền field này) — vẫn truy vết
     được nguồn qua chiều ngược `research_queue.blog_post_id`, chỉ là chưa
     tiện lợi bằng. Sửa sau nếu cần.
   - **Bug thật Joe phát hiện (2026-08-21, đã sửa) — "bài viết ảnh trùng,
     link SEO loạn"**:
     1. Node "Xay dung Prompt" khi không có `topic` từ webhook, dùng NGUYÊN
        title tiếng Anh của bài báo khoa học làm chủ đề → Gemini ra tiêu đề
        lai Anh-Việt, slug siêu dài, không chuẩn SEO. **Đã sửa**: thêm
        `angleTopicMap` ánh xạ mỗi angle sang 1 câu chủ đề tiếng Việt sạch,
        Gemini chỉ dùng `research_context` (câu tiếng Anh + DOI) để lấy dữ
        liệu khoa học, KHÔNG dùng làm chủ đề bài viết.
     2. **Bug gốc CÓ TỪ TRƯỚC (không phải do B2 tạo ra)**: node "Ket Hop Du
        Lieu" không truyền field `angle` qua cho node "Chon Anh Dai Dien" —
        mọi bài viết (kể cả trước khi tôi động vào workflow) đều rơi về
        bucket ảnh mặc định `mr2` (chỉ 3-4 ảnh) bất kể angle thật là gì →
        đúng nguyên nhân ảnh bị lặp lại liên tục Joe thấy. **Đã sửa**: thêm
        `angle` vào output của "Ket Hop Du Lieu", thêm 3 bucket ảnh mới cho
        angle `stress-tri-nho`/`mien-dich`/`tre-hoa`, thêm logic ưu tiên
        ảnh chưa dùng gần đây (`recentImageUrls` nếu có truyền vào).
     3. Gặp thêm 1 bug tự gây ra khi sửa (ReferenceError "Cannot access
        'angle' before initialization" — đặt nhầm thứ tự khai báo biến) —
        đã phát hiện qua test thật + sửa ngay trong cùng phiên.
     - **XÁC NHẬN THẬT (test lần cuối, 15:14:35)**: bài "Sâm Ngọc Linh Và
       Khả Năng Hỗ Trợ Trí Nhớ, Giảm Căng Thẳng: Góc Nhìn Dược Lý Học Hiện
       Đại" — tiêu đề/slug sạch, `featured_image_url` =
       `nui-ngoc-linh-lang-ban-thung-lung.jpg` (đúng bucket `stress-tri-nho`,
       KHÔNG còn rơi về ảnh mặc định mr2 nữa). Bug đã sửa triệt để, không
       phải đoán.
     - **Lưu ý kỹ thuật cho phiên sau**: field `angle` phải truyền qua ĐÚNG
       node "Chuan hoa - Gemini" (n5) vì đây là node feed trực tiếp vào
       "Chon Anh Dai Dien" (n21) — KHÔNG phải qua "Ket Hop Du Lieu" (n8, một
       nhánh khác không liên quan tới chọn ảnh). Tôi từng sửa nhầm n8 trước,
       mất 1 vòng test mới phát hiện đúng chỗ.
   - **3 dòng research_queue khác cũng bị `used=true` nhưng `used_at`/
     `blog_post_id` đều NULL** (id `15a86e3d`, `8aadf9a3`, `e3160fc5`) —
     KHÔNG phải do node n8n mới (n8n chỉ chạy 2 lần hôm nay, không đủ để giải
     thích 3 dòng này). Nhiều khả năng do 1 tiến trình khác (Ollama/script
     riêng của Joe) đang thử nghiệm song song cùng bảng — không tự sửa lại
     `used=false` vì có thể đang được Joe dùng dở. Hỏi Joe nếu thấy lạ.

2. **Docker Desktop + n8n-vkd + strapi_cms**: đã phát hiện Docker Desktop
   tắt hẳn đầu phiên (không phải lỗi cấu hình), tự khởi động lại, khởi động
   lại container `n8n-vkd` (đang Exited), xác nhận cả 2 container Up + workflow
   active.

## PHÁT HIỆN QUAN TRỌNG — "Mai Studio" ĐÃ ĐƯỢC XÂY (không phải phiên này)

Trước khi tôi bắt đầu code gì thêm cho việc livestream, phát hiện Joe/Ollama
đã tự xây phần lớn hạ tầng này rồi (nằm trong các file `??` chưa commit lúc
đầu phiên) — **không làm trùng, chỉ kiểm tra + báo cáo trạng thái thật**:

- **n8n workflow "Mai Video Pipeline — ElevenLabs + Kling AI"** (ID
  `RNLIuJqq73BO6emv`), đang **active thật**: nhận request từ app → ElevenLabs
  TTS (đã có API key thật, không rỗng) → Kling AI tạo video (đã có API key
  thật) → poll tiến độ 30s/lần → lưu video vào Supabase Storage → báo Mai qua
  Telegram. Webhook: `POST /webhook/mai/generate`.
- **`ta_production/project/src/components/mai/MaiStudio.tsx`** (667 dòng,
  route `/mai-studio`, mở qua `MaiStudio.bat`): UI để Mai tự chọn sản phẩm/
  background/nhân vật/giọng đọc, gọi thẳng webhook trên. Biến
  `VITE_N8N_MAI_WEBHOOK` đã trỏ đúng `http://localhost:5678/webhook/mai/generate`
  trong `.env`.
- **`ta_studio/` (Flask backend, cổng 5050 + frontend riêng)**: 990 dòng
  backend hỗ trợ Gemini/Veo3/Imagen3/D-ID, có admin panel (sản phẩm,
  background, nhân vật, giọng đọc, watermark, lịch đăng). **Không thấy chạy**
  (không có tiến trình ở cổng 5050 lúc kiểm tra) — có vẻ là bản build song
  song/thử nghiệm trước, còn `MaiStudio.tsx` + n8n mới là hướng đang dùng
  thật (khớp đúng yêu cầu "tích hợp vào n8n" của Joe). Chưa rõ Joe còn muốn
  dùng `ta_studio/` không — hỏi lại nếu 2 bản trùng chức năng, tránh bảo trì
  2 nơi.
- **CHƯA CHẠY THỬ THẬT** pipeline Mai Video (ElevenLabs + Kling tốn phí mỗi
  lần gọi) — không tự bấm chạy khi Joe không có mặt để duyệt chi phí phát
  sinh, đúng nguyên tắc "không tự thực hiện giao dịch tài chính". Việc tiếp
  theo khi Joe rảnh: mở `MaiStudio.bat`, thử tạo 1 video ngắn, xác nhận
  video thật xuất hiện trong Supabase Storage + Telegram.

## "Livestream cho KOC Mai" — CHƯA LÀM ĐƯỢC, cần Joe quyết định trước

Đây là phần KHÔNG thể tự động hoàn thành trong phiên này, nói rõ để không
hiểu lầm là "đã xong":

- Pipeline hiện có (ElevenLabs + Kling) là **video dựng sẵn** (job bất đồng
  bộ, chờ 30 giây/lần poll, tổng thời gian ra 1 clip ngắn có thể vài phút) —
  **không phải livestream thời gian thực**. Không thể "biến" pipeline này
  thành livestream chỉ bằng cách sửa n8n.
- Livestream avatar AI thời gian thực cần hạ tầng khác hẳn (vd HeyGen
  Interactive Avatar, D-ID Real-time Streaming, Synthesia livestream) — đều
  là dịch vụ trả phí theo phút/giờ streaming, cần Joe tự đăng ký tài khoản +
  nhập thanh toán (Claude không tự đăng ký/thanh toán dịch vụ được).
- **Câu hỏi thương hiệu vẫn treo từ file 35 mục B8, giờ càng cấp thiết hơn**:
  "Mai" là người thật hay nhân vật AI? Nếu livestream bằng avatar AI mà
  không gắn nhãn rõ "đây là AI" thì vi phạm đúng nguyên tắc minh bạch TA đã
  chọn (Quiet Luxury, không dàn dựng giả). Cần Joe trả lời trước khi build
  bất kỳ dòng code livestream nào.
- **Lựa chọn thực tế, nêu để Joe chọn** (không tự chọn thay):
  1. Mai (người thật) tự livestream bằng OBS/Streamlabs — n8n chỉ hỗ trợ
     phía sau (đẩy thông báo lịch live qua Telegram, không cần đụng vào
     livestream engine) — rẻ nhất, không vướng nhãn AI.
  2. Avatar AI livestream thật (HeyGen/D-ID) — tốn phí theo phút, cần gắn
     nhãn "AI" rõ ràng mọi lúc lên sóng.
  3. Không làm livestream thời gian thực, chỉ tăng tần suất ra video ngắn
     (pipeline hiện có) đăng đều đặn — gần hơn với "Mai Studio tự làm video"
     đã có sẵn, không cần đầu tư thêm gì mới.

## Việc CẦN Joe tự làm (không tự động hoá được, xếp theo mức khẩn)

| # | Việc | Vì sao chặn | Ưu tiên |
|---|---|---|---|
| 1 | Chọn 1 trong 3 hướng livestream ở trên (hoặc hướng khác) | Quyết định thương hiệu + chi phí, Claude không tự chọn thay | Cao |
| 2 | Trả lời: Mai là người thật hay AI persona? Nếu AI, gắn nhãn thế nào? | Rủi ro minh bạch thương hiệu (nguyên tắc B8, file 35) | Cao |
| 3 | Test thật `MaiStudio.bat` → tạo 1 video (tốn phí ElevenLabs+Kling) | Chi phí phát sinh cần Joe duyệt, Claude không tự bấm | Cao |
| 4 | Facebook Developer App cho Postiz (`FACEBOOK_APP_ID/SECRET` trong `postiz/docker-compose.yaml`) | OAuth thật, cần tài khoản Meta của Joe | Cao (B10, đã treo từ 2026-08-14) |
| 5 | Xác nhận `ta_studio/` (Flask, cổng 5050) còn dùng không hay bỏ hẳn | Tránh bảo trì trùng 2 hệ thống video-gen | Trung bình |
| 6 | Cấp API key Perplexity nếu muốn làm B9 | Tài khoản trả phí/free-tier riêng | Trung bình |
| 7 | Test webhook thật cho research_queue (mục 1 phần "Đã làm xong") | Muốn Joe xem qua nội dung bài đầu tiên tự sinh từ PubMed trước khi để chạy tự động theo lịch | Trung bình |

## File liên quan

- Backlog kỹ thuật gốc: [35-10-repo-flow-kol-nghien-cuu-va-ke-hoach.md](35-10-repo-flow-kol-nghien-cuu-va-ke-hoach.md)
- Handoff n8n/video: `D:\TA page\video-pipeline\HANDOFF_NEXT_SESSION.md`
