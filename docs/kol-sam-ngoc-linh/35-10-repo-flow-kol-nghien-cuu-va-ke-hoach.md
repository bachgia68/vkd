# 35. 10 flow/repo GitHub mạnh nhất để nâng cấp "máy KOL Sâm" — bảng dự án + kế hoạch triển khai từng repo

Ngày tạo: 2026-08-14. Nguồn: Joe research thủ công, dán nguyên văn vào chat,
yêu cầu ghi lại đầy đủ không bỏ sót, làm dần qua nhiều phiên (không phải làm
xong trong 1 phiên).

**Đây là backlog KỸ THUẬT cho pipeline n8n auto-CMS/social** (khác với dự án
kênh KOL cá nhân "Việt Sâm Ký" ở file 00-19) — bổ sung/nâng cấp workflow đang
chạy tại `D:\TA page\video-pipeline\` (xem `HANDOFF_NEXT_SESSION.md` ở đó cho
tình trạng kỹ thuật chi tiết: webhook → Xay dung Prompt → Gemini → Chuan hoa
→ Tao Bai Viet Strapi/Supabase → Ket Hop Du Lieu → Tao Anh → Upload). File
này KHÔNG lặp lại tình trạng workflow — chỉ ghi ý tưởng nâng cấp từ 10
repo/flow tham khảo, mapping vào đúng chỗ trong flow hiện tại, và trạng thái
triển khai từng cái.

## Cách đọc file này ở phiên sau

1. Đọc bảng tổng quan (mục A) trước — biết ngay cái nào đã làm/đang làm/chưa
   đụng tới.
2. Vào đúng mục chi tiết (B1-B10) của repo đang định làm — có sẵn bước cụ
   thể, không cần nghiên cứu lại từ đầu.
3. Làm xong 1 bước, cập nhật cột "Trạng thái" trong bảng A NGAY (đừng để dồn
   tới cuối phiên rồi quên) + tick vào checklist trong mục chi tiết tương ứng.
4. Nếu bị chặn (cần Joe quyết định/cấp quyền), ghi rõ vào cột "Đang chặn" và
   để nguyên, chuyển sang repo khác — không đợi.

---

## A. Bảng tổng quan — 10 repo vs mảnh ghép máy KOL vs trạng thái

| # | Repo/Flow | Mảnh ghép trong máy KOL | Vị trí gắn vào flow hiện tại | Ưu tiên | Trạng thái |
|---|---|---|---|---|---|
| 1 | `abuzar561/tiktok-viral-ai-automation` | Trend/Insight Discovery | TRƯỚC node "Xay dung Prompt" | Cao | ☐ Chưa bắt đầu |
| 2 | AI Automation Society "Ghostwriter" + `tanishra/Linkedin-Post-Automation` | Ghostwriter thẩm quyền ngành | Thay/nâng cấp node "Xay dung Prompt" | Cao | ✅ Xong 2026-08-20 |
| 3 | n8n.io chính thức — "Multi-Platform Distribution GPT-4" | Phân rã 1 bài → N định dạng kênh | SAU node viết bài gốc (Gemini/Chuan hoa), TRƯỚC bước đăng đa kênh | Cao | ✅ Xong 2026-08-20 |
| 4 | `sumamazaeem/Automating-Social-Media-Posts-with-Notion-n8n` | Lịch nội dung trung tâm chống trùng góc | Thay việc query Supabase thủ công chọn góc | Trung bình | ☐ Chưa bắt đầu |
| 5 | `ezedinff/TikTok-Forge` | Faceless video pipeline (Remotion) | Thay thế FLOW 2 AUTO_VIDEO_CREATOR (storyboard JSON thủ công) | Trung bình | ☐ Chưa bắt đầu |
| 6 | `cporter202/automate-faceless-content` | Faceless full pipeline đa nền tảng | Khung tổng nếu mở rộng video ngắn đa kênh cùng lúc | Thấp (dài hạn) | ☐ Chưa bắt đầu |
| 7 | `enescingoz/awesome-n8n-templates` | Kho tra cứu 280+ template | Tra cứu khi cần node cụ thể (Telegram/Notion/RAG) | Thấp (dùng khi cần) | ☐ Mở tra cứu khi cần, không phải task chạy 1 lần |
| 8 | `SamurAIGPT/AI-Influencer-Generator` | AI Persona/gương mặt KOL ảo | Cân nhắc riêng — có rủi ro đạo đức thương hiệu | Thấp — **cần Joe quyết định trước** | ☐ Chờ Joe quyết định có làm hay không |
| 9 | n8n.io — "Instagram discovery w/ Apify, GPT-4o & Perplexity" | Bắt trend đối thủ + research thẩm quyền | TRƯỚC/SONG SONG node viết bài, thêm nguồn Perplexity | Trung bình | ☐ Chưa bắt đầu |
| 10 | n8n.io — "Blotato + Claude + Seedance" | Hub đăng đa kênh thay Graph API tự viết | Thay thế toàn bộ nhánh đăng Facebook/token đang lỗi | Cao (nhưng có chi phí) | ☐ Chưa bắt đầu — cân nhắc song song với Postiz đã cài (xem ghi chú B10) |

**Lưu ý quan trọng khi bắt đầu bất kỳ mục nào ở trên**: pipeline hiện tại đã
cài **Postiz** (`D:\TA page\postiz\`, xem file 31-HANDOFF mục "Việc ngay
trước mắt") làm hub đăng đa kênh — đúng vai trò mà mục #10 (Blotato) định
làm. Trước khi tải Blotato, hỏi lại tình trạng Postiz đã kết nối kênh xong
chưa — có thể KHÔNG cần Blotato nữa nếu Postiz chạy ổn, tránh làm trùng 2
công cụ cùng vai trò.

---

## B1. Trend/Insight Discovery — `abuzar561/tiktok-viral-ai-automation`

**Mục tiêu:** Chọn góc content dựa trên trend TikTok thật thay vì luân phiên
cứng 8 trụ nội dung hiện tại.

**Vị trí trong flow:** Node mới TRƯỚC "Xay dung Prompt" — scrape/lấy dữ liệu
trend, feed kết quả vào biến đầu vào của "Xay dung Prompt" thay vì hard-code
trụ nội dung theo thứ tự.

**Các bước triển khai:**
1. Clone/đọc repo `abuzar561/tiktok-viral-ai-automation`, xác định phần nào
   dùng scraping TikTok (kiểm tra có vi phạm ToS TikTok không — nếu dùng
   API/scrape trực tiếp có rủi ro bị chặn IP, cân nhắc dùng Apify actor thay
   thế nếu repo gốc dùng cách không bền).
2. Xác định input/output tương thích: repo cần trend nào (từ khoá sức khoẻ,
   thảo dược, làm đẹp — lọc theo ngành sâm, KHÔNG lấy trend giải trí chung
   chung không liên quan).
3. Thêm node HTTP Request/Code trong n8n gọi nguồn trend đã chọn, map kết
   quả (top trend + engagement) vào 1 field `trend_context` truyền sang node
   "Xay dung Prompt".
4. Sửa prompt Gemini trong "Xay dung Prompt": thêm hướng dẫn "ưu tiên góc
   liên quan tới `{{trend_context}}` nếu có, nếu không có trend phù hợp thì
   quay lại luân phiên 8 trụ như cũ" — KHÔNG bỏ hẳn cơ chế cũ, chỉ ưu tiên
   khi có dữ liệu tốt hơn.
5. Test: chạy webhook thật, so sánh bài sinh ra có bám trend hay không.

**Điều kiện hoàn thành:**
- [ ] Có nguồn trend thật chạy được (không bị chặn/lỗi ToS)
- [ ] Node "Xay dung Prompt" nhận được `trend_context` thật, có fallback khi rỗng
- [ ] Đã chạy thử ít nhất 3 lần, bài sinh ra thể hiện rõ đang bám trend

**Rủi ro:** Scraping TikTok dễ bị đổi cấu trúc/chặn — cần review lại code
scrape trước khi tin theo 100%, không cắm thẳng vào production nếu chưa test
ổn định qua vài ngày.

---

## B2. Ghostwriter thẩm quyền ngành — AI Automation Society + `tanishra/Linkedin-Post-Automation`

**Mục tiêu:** TA = "chuyên gia thẩm định độc lập trong ngành sâm" — bài đăng
hàng ngày dựa trên tin tức/nghiên cứu ngành thay vì chỉ viết theo trụ nội
dung cố định.

**Vị trí trong flow:** Nâng cấp trực tiếp node "Xay dung Prompt" hiện tại —
đổi nguồn input từ "chọn trụ nội dung" sang "tóm tắt tin tức/nghiên cứu mới
nhất rồi viết góc nhìn thẩm quyền".

**Các bước triển khai:**
1. Đổi nguồn tin: thay LinkedIn feed (không áp dụng cho TA) bằng
   **PubMed/Consensus** — đã có sẵn MCP `plugin_bio-research_pubmed` và
   `plugin_bio-research_consensus` dùng được ngay trong phiên Claude, nhưng
   trong n8n cần gọi qua HTTP Request tới PubMed E-utilities API hoặc script
   riêng vì n8n không có MCP client sẵn.
2. Thêm node "Lay Nghien Cuu Moi" (HTTP Request tới PubMed API, query theo
   từ khoá cố định: "Panax vietnamensis", "majonoside", "saponin ginseng"...)
   chạy ĐỊNH KỲ (không phải mỗi lần webhook) — cân nhắc thêm 1 workflow phụ
   chạy hàng tuần, ghi kết quả vào 1 bảng Supabase mới `research_queue`
   (title, doi, summary, used=false).
3. "Xay dung Prompt" đọc từ `research_queue` (lấy 1 dòng `used=false`,
   ORDER BY ngày tìm thấy), viết bài theo góc "TA thẩm định độc lập" — Y HỆT
   pattern đã dùng thành công ở 4 bài blog thật hiện tại (MR2, Stress/trí
   nhớ, Miễn dịch, Trẻ hoá — đều grounded PubMed/Consensus có DOI, xem file
   31-HANDOFF mục "Đã xong thật"). Đây KHÔNG phải làm mới hoàn toàn — chỉ
   cần TỰ ĐỘNG HOÁ bước tìm nghiên cứu mà trước đây Claude làm thủ công.
4. Đánh dấu `used=true` sau khi bài viết xong, tránh viết trùng 1 nghiên cứu
   2 lần.
5. Google Sheet/Supabase trạng thái: tận dụng bảng `blog_posts` sẵn có, có
   thể thêm cột `source_doi` để truy vết nguồn.

**Điều kiện hoàn thành:**
- [x] Bảng `research_queue` tồn tại, có 16 dòng nghiên cứu thật (done 2026-08-20)
- [x] Cột `source_doi` đã thêm vào `blog_posts` (done 2026-08-20)
- [x] Nodes n8n đã thêm: n0 (GET queue), n22 (PATCH mark used), n2 cập nhật dùng research (done 2026-08-20)
- [x] Đã sinh được ít nhất 1 bài tự động end-to-end từ `research_queue` (execution 118, done 2026-08-20)

**Lưu ý:** Đây là mục ưu tiên cao nhất vì đúng khớp mô hình đã chứng minh
hiệu quả (4 bài thật đã publish) — chỉ là tự động hoá bước research, không
đổi cách viết.

**✅ HOÀN THÀNH 2026-08-20:** Pipeline đọc `research_queue` → viết bài → lưu Strapi+Supabase với `source_doi` → mark `used=true` → Telegram notify. Execution 118 success.

---

## B3. Multi-Platform Repurposing — n8n.io "Automate Content Analysis & Multi-Platform Distribution GPT-4"

**Mục tiêu:** Gộp bước soạn content CMS + soạn caption FB thành 1 node "phân
rã đa kênh" ngay sau khi viết xong bài gốc, thay vì soạn riêng 2 bước thủ
công như hiện tại.

**Vị trí trong flow:** Node mới NGAY SAU "Chuan hoa" (bài gốc đã viết xong,
đã chuẩn hoá) — trước khi ghi vào Strapi/Supabase.

**Các bước triển khai:**
1. Đọc kỹ workflow mẫu trên n8n.io để lấy đúng cấu trúc node (thường là 1
   node AI với prompt yêu cầu xuất JSON có key riêng cho từng kênh:
   `facebook_caption`, `tiktok_caption`, `zalo_caption`...).
2. Viết prompt riêng cho từng kênh dựa theo giọng văn đã dùng (đã có sẵn ví
   dụ caption 6 kênh cho 4 bài blog thật — dùng lại làm few-shot trong
   prompt để giữ đúng văn phong).
3. Thêm node "Phan Ra Da Kenh" (Gemini/OpenAI) ngay sau "Chuan hoa", input =
   bài gốc, output = JSON 6 caption theo kênh (Facebook/TikTok/Zalo/
   Instagram/YouTube/LinkedIn — khớp đúng 6 kênh đã có trong bảng
   `channels`).
4. Ghi JSON caption trực tiếp vào cột tương ứng trong `blog_posts` hoặc bảng
   phụ `post_captions` — CmsPage.tsx đã có sẵn UI hiển thị caption đa kênh
   (theo file -9 trong HANDOFF site), chỉ cần trỏ đúng nguồn dữ liệu mới.
5. Test: so sánh caption tự sinh với caption Claude soạn tay trước đây, chỉnh
   prompt tới khi chất lượng tương đương.

**Điều kiện hoàn thành:**
- [x] 1 node sinh đủ 6 caption từ 1 bài gốc (n23 Phan Ra Da Kenh + n24 Phan Tich Caption, done 2026-08-20)
- [x] Captions lưu vào cột `captions` jsonb của `blog_posts` — execution 119 success, keys: facebook/instagram/zalo/tiktok/youtube/linkedin
- [ ] Caption hiện đúng trong CmsPage admin (cần update frontend đọc từ `captions` jsonb)
- [ ] Đã so sánh chất lượng với ít nhất 2 bài đã làm tay

**✅ Pipeline hoàn thành 2026-08-20.** Frontend CmsPage chưa hiển thị — bước tiếp theo nếu cần.

---

## B4. Content Calendar chống trùng góc — `sumamazaeem/Automating-Social-Media-Posts-with-Notion-n8n`

**Mục tiêu:** Tránh chọn trùng góc nội dung — hiện đang query Supabase thủ
công để né trùng, nên có bảng lịch trung tâm tự động kiểm tra.

**Vị trí trong flow:** Thay bước query Supabase thủ công (trước "Xay dung
Prompt") bằng 1 bảng lịch có trạng thái rõ ràng.

**Các bước triển khai:**
1. Không cần dùng Notion (Joe đã có Supabase là nguồn thật) — chỉ lấy Ý
   TƯỞNG kiến trúc từ repo (1 bảng lịch trung tâm, trạng thái draft/
   scheduled/posted, node kiểm tra trùng trước khi tạo bài mới).
2. Thêm bảng Supabase `content_calendar` (ngày dự kiến, trụ nội dung/góc,
   trạng thái, id bài liên kết) nếu chưa có cấu trúc tương đương — kiểm tra
   trước xem `blog_posts` đã đủ field để dùng làm lịch chưa, tránh tạo bảng
   trùng chức năng.
3. Node "Kiem Tra Trung Goc" trước "Xay dung Prompt": query 7-14 ngày gần
   nhất, loại các góc đã dùng, trả về danh sách góc còn "trống" cho phép chọn.
4. Cập nhật trạng thái `posted` tự động sau khi đăng thành công (webhook
   confirm).

**Điều kiện hoàn thành:**
- [ ] Có bảng lịch trung tâm truy vấn được
- [ ] Node kiểm tra trùng chạy trước khi sinh bài, có bằng chứng chặn được
      ít nhất 1 lần trùng góc trong test

**Phụ thuộc:** Nên làm SAU B2 (ghostwriter) vì lúc đó "góc nội dung" sẽ đến
từ `research_queue` thay vì 8 trụ cứng — thiết kế lịch cần tính đến việc này
để không làm 2 lần.

---

## B5. Faceless Short-Form Video — `ezedinff/TikTok-Forge`

**Mục tiêu:** Thay thế phần dựng storyboard JSON thủ công trong FLOW 2
(AUTO_VIDEO_CREATOR, skill `marketing-sam`) bằng pipeline Remotion tự động.

**Vị trí trong flow:** Thay thế nhánh script→video hiện tại — LƯU Ý: pipeline
video hiện tại đã dùng giải pháp riêng (ảnh thật + edge-tts + Whisper local,
xem file 31-HANDOFF mục "Video pipeline miễn phí đã cài xong",
`super-video-maker-skill/`) — đây là giải pháp MIỄN PHÍ đã hoạt động. Trước
khi đổi sang TikTok-Forge (dùng Remotion + OpenAI, có chi phí API), cân nhắc
kỹ có thực sự cần không.

**Các bước triển khai:**
1. Đọc kỹ `super-video-maker-skill/` hiện có trước — xác định điểm yếu thật
   sự cần TikTok-Forge giải quyết (VD: hiệu ứng chuyển cảnh đẹp hơn, hỗ trợ
   nhiều định dạng khung hình hơn) — KHÔNG thay thế nếu giải pháp cũ vẫn đáp
   ứng đủ, tránh phá vỡ pipeline đang chạy ổn.
2. Nếu xác nhận cần: cài Remotion riêng (không đụng `super-video-maker-skill`
   hiện có), test độc lập trước khi tích hợp vào n8n.
3. Thay thế node dựng video trong workflow n8n bằng lệnh gọi Remotion
   CLI/HTTP — theo đúng cách đã dùng cho video pipeline cũ (Code node gọi
   script ngoài, không cần `ExecuteCommand` node — xem "Việc KHÔNG nên làm
   lại" trong video-pipeline HANDOFF, tránh lặp lỗi cũ).
4. So sánh chất lượng + chi phí (API cost của TikTok-Forge) với giải pháp
   free hiện tại trước khi quyết định chuyển hẳn.

**Điều kiện hoàn thành:**
- [ ] Đã xác định rõ lý do cần đổi (không đổi chỉ vì "mới hơn")
- [ ] Test độc lập chạy được, ra video chất lượng tốt hơn rõ rệt
- [ ] Joe xác nhận chấp nhận chi phí API phát sinh (nếu có) trước khi thay production

**Rủi ro:** Đừng phá vỡ pipeline video free đang chạy ổn định chỉ vì repo
"nghe có vẻ mạnh hơn" — ưu tiên thấp hơn B1-B3.

---

## B6. Faceless Full Pipeline đa nền tảng — `cporter202/automate-faceless-content`

**Mục tiêu:** Khung tổng nếu TA muốn mở rộng ra video ngắn đăng đồng thời
nhiều nền tảng, thay vì chỉ blog + FB như hiện tại.

**Vị trí trong flow:** Đây là khung THAM KHẢO kiến trúc tổng, không phải 1
node cụ thể — chỉ dùng khi Joe quyết định mở rộng quy mô video.

**Các bước triển khai (chỉ làm khi Joe xác nhận mở rộng):**
1. Đọc kiến trúc: idea → script → video → lên lịch đăng đồng thời YouTube/
   TikTok/Facebook/Instagram.
2. So khớp với hub đăng đa kênh đã có (Postiz, xem B10) — khả năng cao
   Postiz đã đảm nhiệm phần "lên lịch đăng đồng thời", nên chỉ cần LẤY phần
   "idea → script → video" từ repo này, KHÔNG cần phần đăng bài (tránh trùng
   với Postiz).
3. Việc này phụ thuộc B5 xong trước (cần pipeline dựng video ổn định trước
   khi tính chuyện đăng đồng loạt nhiều nền tảng).

**Điều kiện hoàn thành:**
- [ ] Joe xác nhận muốn mở rộng quy mô video đa kênh (chưa hỏi — cần hỏi
      trước khi bắt đầu bất kỳ bước nào ở mục này)

**Trạng thái:** Ưu tiên thấp, để dành — chỉ mở khi có xác nhận rõ ràng từ Joe,
tránh làm thừa.

---

## B7. Kho template tra cứu — `enescingoz/awesome-n8n-templates`

**Mục tiêu:** Không phải 1 task "làm xong" — là nguồn tra cứu khi cần ghép
thêm node cụ thể (Telegram, Notion, RAG chatbot Q&A khách hàng về sâm).

**Cách dùng:** Khi bất kỳ mục B1-B6/B9/B10 cần 1 node kỹ thuật cụ thể chưa
rõ cách làm trong n8n, tra trong 280+ template của repo này trước khi tự
viết từ đầu — đặc biệt 13 template "social" đã note riêng.

**Ứng dụng cụ thể đã nhìn thấy trước:**
- RAG chatbot Q&A khách hàng về sâm — có thể dùng làm nền cho `ChatWidget.tsx`
  hiện tại (đang là bot rule-based đơn giản theo node, xem site
  `src/components/ChatWidget.tsx`) nếu Joe muốn bot trả lời tự do hơn thay vì
  chỉ theo kịch bản node cố định — đây là Ý TƯỞNG MỞ, không phải task đã
  chốt, cần Joe xác nhận trước khi làm vì đổi hẳn kiến trúc chatbot hiện tại.

**Trạng thái:** Không cần "hoàn thành" — giữ làm tài liệu tra cứu sống, quay
lại đây mỗi khi cần.

---

## B8. AI Persona/Virtual Spokesperson — `SamurAIGPT/AI-Influencer-Generator`

**Mục tiêu:** "Gương mặt KOL ảo" đọc tin dược liệu, dùng Stable Diffusion +
gTTS + SadTalker, không cần API trả phí.

**⚠️ CẦN JOE QUYẾT ĐỊNH TRƯỚC KHI LÀM BẤT KỲ BƯỚC NÀO:**
Rủi ro thương hiệu thật — đi ngược tinh thần "Quiet Luxury, khoa học thực
chứng, minh bạch" đã thống nhất cho TA (xem nguyên tắc "không dùng cảnh dàn
dựng giả" ở `tasks/todo.md` Task 6). Nếu làm 1 gương mặt AI giả rồi trình
bày như người thật đang nói, đây là hành vi lừa dối khách hàng — vi phạm
chính nguyên tắc minh bạch TA đang xây dựng thương hiệu xung quanh.

**Chỉ cân nhắc nếu:**
- Gắn nhãn RÕ RÀNG "nhân vật AI/không phải người thật" mọi lúc xuất hiện (
  giống cách Task 12 trong todo.md đã yêu cầu nhãn "Nội dung có sử dụng AI"
  cho video founder-story).
- Định vị là "trợ lý ảo đọc tin tức dược liệu" — KHÔNG mạo danh chuyên gia/
  bác sĩ có thật (đã có tiền lệ cố tình không bịa tên bác sĩ cụ thể trong
  blog, xem site HANDOFF mục -10 Bước 4).

**Việc cần làm trước khi code bất cứ gì:** Hỏi Joe có muốn làm hướng này
không, và nếu có thì xác nhận cách gắn nhãn minh bạch cụ thể.

**Trạng thái:** Chờ quyết định — KHÔNG tự triển khai.

---

## B9. Instagram Discovery & Repurposing — n8n.io "Apify, GPT-4o & Perplexity"

**Mục tiêu:** Tăng độ "thẩm định" của bài viết bằng cách research qua
Perplexity trước khi viết, không chỉ dùng 1 nguồn Gemini.

**Vị trí trong flow:** Node research bổ sung, chạy SONG SONG hoặc TRƯỚC "Xay
dung Prompt" — cùng vai trò với B2 (ghostwriter) nhưng thêm 1 nguồn khác
(Perplexity có khả năng search real-time tốt, PubMed/Consensus mạnh về học
thuật — dùng cả 2, không thay thế nhau).

**Các bước triển khai:**
1. Cần API key Perplexity — Joe tự tạo tài khoản, cấp key (Claude không tự
   đăng ký/nhập key được, theo nguyên tắc an toàn cố định).
2. Thêm node "Research Perplexity" trước "Xay dung Prompt", câu hỏi tập
   trung: xu hướng tìm kiếm gần đây về sâm/thảo dược/sức khoẻ liên quan,
   không lấy nguyên si nội dung đối thủ (tránh đạo nội dung — chỉ lấy Ý
   TƯỞNG/insight, bài viết vẫn phải viết mới hoàn toàn, đúng cách đã làm với
   4 bài PubMed/Consensus).
3. Gộp kết quả Perplexity + `research_queue` (từ B2) thành 1 context đầy đủ
   truyền vào "Xay dung Prompt".
4. Phần "Instagram content discovery đối thủ" của repo gốc — CÂN NHẮC KỸ,
   TA hiện chưa có nhiều đối thủ trực tiếp trên Instagram để tái sử dụng
   insight, có thể bỏ qua phần đó, chỉ lấy phần "Perplexity nghiên cứu
   trước khi viết".

**Điều kiện hoàn thành:**
- [ ] Joe đã cấp API key Perplexity
- [ ] Node research chạy được, kết quả có ích cho bài viết (so sánh có/không
      Perplexity)

**Phụ thuộc:** Có thể làm song song B2, không bắt buộc chờ nhau — chỉ cần
gộp context trước khi đưa vào prompt cuối.

---

## B10. Hub đăng đa kênh — n8n.io "Blotato + Claude + Seedance"

**Mục tiêu ban đầu:** Blotato quản lý OAuth/token hộ, thay thế nhánh "Dang
Facebook That" đang tự viết Graph API và hay lỗi token hết hạn.

**⚠️ KIỂM TRA TRƯỚC KHI LÀM BẤT KỲ BƯỚC NÀO:** Pipeline hiện tại ĐÃ CÀI
**Postiz** (`D:\TA page\postiz\`, localhost:4007) đúng để giải quyết vấn đề
y hệt (hub quản lý OAuth đa kênh, né lỗi token tự quản lý). Theo file
31-HANDOFF (2026-08-14), Joe vừa tạo tài khoản Postiz, đang ở bước kết nối
kênh Facebook/TikTok qua OAuth.

**Các bước triển khai:**
1. **Bước 0 bắt buộc:** hỏi Joe tình trạng kết nối kênh Postiz hiện tại
   (xong chưa, có lỗi gì không). Nếu Postiz kết nối thành công và hoạt động
   ổn — **KHÔNG cần Blotato nữa**, đóng mục B10 lại, chỉ cần nối Postiz vào
   n8n workflow (thay nhánh "Dang Facebook That" cũ) — đây vốn đã là việc kế
   tiếp ưu tiên số 1 ghi trong file 31-HANDOFF.
2. Chỉ xét tới Blotato nếu Postiz gặp vấn đề không giải quyết được (VD:
   không hỗ trợ nền tảng cần, giới hạn gói miễn phí quá chặt) — khi đó so
   sánh chi phí Blotato (thường có phí) vs lợi ích trước khi Joe quyết định.
3. Nếu nối Postiz (nhánh chính, khả năng cao đây là hướng đúng): thay node
   "Dang Facebook That" bằng HTTP Request gọi Postiz API, truyền
   title/caption/image_url/video_url — Postiz tự lo OAuth/token, n8n không
   cần giữ token Facebook nữa.
4. Test end-to-end: 1 bài từ webhook → qua node phân rã đa kênh (B3) → gửi
   Postiz → xác nhận đăng thật lên ít nhất Facebook.

**Điều kiện hoàn thành:**
- [ ] Đã hỏi Joe + xác nhận trạng thái Postiz
- [ ] Nếu dùng Postiz: n8n gọi được Postiz API, đăng thật thành công ít
      nhất 1 lần, không còn phụ thuộc token Facebook tự quản lý cũ
- [ ] Nếu dùng Blotato thay thế: ghi rõ lý do Postiz không đáp ứng được,
      Joe đã xác nhận chi phí trước khi tích hợp

### Tiến độ thật (cập nhật 2026-08-20)

**Chặn MỚI phát hiện 2026-08-20:** Tài khoản Facebook Developer của Joe (`developers.facebook.com`) hiển thị "Cần xác nhận tài khoản — phát hiện hoạt động bất thường". TikTok Developer cũng bị chặn (policy violation). Cả 2 đều chặn bước tạo FB App ID cho Postiz.
- **Nếu FB Developer chỉ cần verify** (thường là vậy — security check thông thường): click "Xác nhận tài khoản" → xác nhận SĐT/email → account restore trong vài giờ → tiếp tục plan Postiz gốc.
- **Nếu bị ban thật**: chuyển sang **Buffer** ($6/tháng) — Buffer dùng FB App của họ, Joe chỉ cần OAuth vào Buffer dashboard, không cần FB Developer account. Buffer có REST API để n8n gọi. Script n8n sẵn tại `b10_postiz_replace.js` (scratchpad), chỉ cần đổi base URL + auth format.

**Script n8n đã chuẩn bị sẵn:** `b10_postiz_replace.js` trong scratchpad — thay n18+n15 (Graph API) → n18 (GET Postiz integrations) + n18b (pick FB channel) + n15 (POST Postiz posts) + fix n16 report. Chạy sau khi có Postiz API key + FB channel kết nối.

**Đã xác nhận qua kiểm tra trực tiếp (không suy đoán):**
- Postiz DB (`postiz-postgres`, bảng `Integration`) — **0 dòng** tính đến 2026-08-20, chưa kết nối kênh nào.
- **Public API Postiz đã xác nhận hoạt động** — test từ trong chính container
  `n8n-vkd` (đúng network sẽ dùng khi build node thật):
  ```
  docker exec n8n-vkd wget -qO- http://host.docker.internal:4007/api/public/v1/integrations
  → HTTP/1.1 401 Unauthorized   (route tồn tại, chỉ thiếu API key — ĐÚNG như kỳ vọng)
  ```
  - **Base URL dùng trong node n8n**: `http://host.docker.internal:4007/api/public/v1`
    (KHÔNG dùng `localhost:4007` — n8n chạy trong container riêng, không thấy
    cổng host qua `localhost`; `host.docker.internal` là cách Docker Desktop
    Windows cho container gọi ngược ra host).
  - Auth: header `Authorization: <api-key>` (không phải `Bearer <key>`).
  - Endpoint đăng bài: `POST /posts` — cấu trúc `{type, date, tags, posts:
    [{integration:{id}, value:[{content, image}], settings:{__type}}]}`.
  - Endpoint liệt kê kênh: `GET /integrations`.
  - Endpoint upload ảnh trước khi đăng: `POST /upload`.
- Đã export workflow n8n hiện tại (`n8n export:workflow --all`) để biết
  chính xác cấu trúc node cần thay — node đích: **"Dang Facebook That"**
  (id `n15-fb-post-real`, dùng credential `facebookGraphApi` "Facebook Graph
  account", gọi trực tiếp `graph.facebook.com`) + node phụ trợ **"Xac Dinh
  Page That"** (id `n18-fb-identify-page`, cũng dùng credential Facebook
  Graph cũ) — cả 2 node này sẽ bị thay thế. Node đứng trước
  ("IF - La Facebook") và đứng sau ("Xay Bao Cao FB" → "Bao Ket Qua FB
  Telegram") giữ nguyên, chỉ đổi phần ở giữa.

**Việc CÒN LẠI, đang chặn bởi Joe (không tự làm thay được):**

0. **Phát hiện 2026-08-14 — chặn TRƯỚC bước kết nối kênh**: Joe thử bấm kết
   nối Facebook trong Postiz, gặp lỗi Facebook "ID ứng dụng không hợp lệ".
   Nguyên nhân xác nhận qua đọc `docker-compose.yaml`: Postiz self-host cần
   App Facebook riêng, nhưng `FACEBOOK_APP_ID`/`FACEBOOK_APP_SECRET` đang để
   trống (`''`). **Sửa lại giả định sai trong file 31-HANDOFF** — Postiz
   self-host KHÔNG né được việc phải tạo Facebook Developer App, giống hệt
   yêu cầu cũ của nhánh Graph API tự viết trước đây.
   - Joe cần tạo/dùng lại 1 Facebook App tại
     [developers.facebook.com/apps/creation](https://developers.facebook.com/apps/creation)
     (loại "Other" → category "Business"), thêm sản phẩm **"Facebook Login
     for Business"**.
   - Redirect URI phải khai báo đúng: `http://localhost:4007/integrations/social/facebook`.
   - Quyền cần xin: `pages_show_list`, `business_management`,
     `pages_manage_posts`, `pages_manage_engagement`,
     `pages_read_engagement`, `read_insights`.
   - Chuyển App Mode **Development → Live** (nếu không chỉ admin app đăng
     được, không đăng công khai cho page thật).
   - Điền `FACEBOOK_APP_ID`/`FACEBOOK_APP_SECRET` vào
     `D:\TA page\postiz\docker-compose.yaml` (2 dòng đang để trống sẵn) —
     **Joe tự điền, Claude không chạm secret** — rồi
     `docker compose up -d --force-recreate postiz` để nhận cấu hình mới.
1. Sau khi App Facebook sống: Joe vào Postiz UI (`localhost:4007`, đã đăng
   nhập) → mục "Connect Channels" → kết nối Facebook Page thật (chọn đúng
   page "Vườn Sâm Ngọc Linh nhà Khánh" + cấp quyền) — OAuth thật, không thể
   tự động hoá.
2. Joe tự vào Postiz **Settings → Developer/API** (tên mục chính xác tuỳ
   phiên bản UI, tìm mục sinh "API Key") → tạo API key → **dán trực tiếp
   vào 1 credential mới trong n8n UI** (Settings → Credentials → New →
   "Header Auth" → name field = `Authorization`, value = API key vừa tạo,
   đặt tên credential "Postiz API Key") — **Claude không tự đọc/nhập key
   này**, đúng nguyên tắc an toàn cố định của dự án.

**Việc làm tiếp ngay khi Joe xong 2 bước trên (không cần hỏi lại):**
1. Thêm node "Lay Kenh Postiz" (`GET {base}/integrations`, dùng credential
   "Postiz API Key" vừa tạo) ngay sau "IF - La Facebook" (nhánh true), thay
   cho "Xac Dinh Page That" cũ.
2. Thêm node Code "Chon Kenh FB Postiz" — lọc kết quả tìm
   `providerIdentifier === 'facebook'` (hoặc đúng giá trị Postiz trả về cho
   Facebook Page), lấy `id`; báo lỗi rõ ràng nếu không tìm thấy (case Joe
   quên kết nối/kênh bị disconnect).
3. Thêm node "Dang Qua Postiz" (`POST {base}/posts`, dùng cùng credential) —
   thay hẳn "Dang Facebook That" cũ, giữ nguyên format input từ
   "Webhook - Duyet Kenh" (`body.title/content/image_url`) để không phải
   sửa gì phía admin `CmsPage.tsx`/`channels` đang gọi webhook này.
4. Nối output vào đúng "Xay Bao Cao FB" cũ (chỉ đổi nguồn dữ liệu đọc trong
   code node đó cho khớp response Postiz thay vì response Graph API) —
   giữ nguyên cơ chế báo kết quả qua Telegram đã có.
5. Test bằng đúng cách đã dùng trước giờ cho workflow này: gọi
   `Webhook - Duyet Kenh` qua `curl`, xác nhận qua Postiz UI/DB (bảng
   `Post`) có bài mới, KHÔNG tin UI n8n làm nguồn sự thật duy nhất (đã có
   tiền lệ UI n8n cache/lag trong dự án này).
6. Sau khi ổn định nhánh Facebook: cân nhắc mở rộng node "Chon Kenh Postiz"
   để nhận thêm TikTok cùng cơ chế (không cần nhánh IF/node riêng cho từng
   kênh nữa — đây là lợi ích chính của việc dùng Postiz thay Graph API tự
   viết).

**Đây là mục ưu tiên cao nhất về mặt vận hành** (giải quyết đúng lỗi token
đang treo) — nên làm sớm, ngay sau khi Joe xác nhận trạng thái Postiz.

---

## C. Thứ tự đề xuất làm (không bắt buộc cứng, điều chỉnh theo thời gian rảnh từng phiên)

1. **B10** (nối Postiz — đã có sẵn hạ tầng, chỉ còn nối dây, giải quyết lỗi
   token đang treo) → làm trước tiên vì rẻ nhất, giá trị cao nhất.
2. **B2** (tự động hoá research PubMed/Consensus vào `research_queue`) — nền
   tảng cho B4 và B9, đúng mô hình đã chứng minh hiệu quả.
3. **B3** (node phân rã đa kênh) — gộp 2 bước soạn caption thủ công thành 1,
   tiết kiệm thời gian ngay.
4. **B9** (thêm Perplexity) — làm song song hoặc ngay sau B2.
5. **B4** (lịch chống trùng góc) — làm sau khi B2 ổn định (góc nội dung giờ
   đến từ research_queue, thiết kế lịch cần khớp).
6. **B1** (trend TikTok) — cần review kỹ rủi ro scraping trước, không vội.
7. **B5/B6** (video) — chỉ làm nếu xác nhận pipeline free hiện tại không đủ.
8. **B7** (kho template) — dùng khi cần, không phải task rời.
9. **B8** (AI persona) — chờ Joe quyết định, không tự làm.

---

## D. Câu hỏi cần hỏi Joe trước khi mở khoá 1 số mục

1. Postiz đã kết nối kênh xong chưa? (chặn B10)
2. Có đồng ý cấp API key Perplexity không? (chặn B9)
3. Có muốn làm "gương mặt KOL ảo" không, nếu có thì gắn nhãn minh bạch thế
   nào? (chặn B8 — mặc định KHÔNG làm nếu không có câu trả lời rõ ràng)
4. Có muốn mở rộng video đăng đồng thời nhiều nền tảng không, hay giữ
   nguyên blog + FB là chính? (chặn B6)
