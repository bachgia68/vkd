# 38. HANDOFF phiên 2026-08-21 (chiều-tối) + Định nghĩa "kết quả cuối cùng" cho toàn bộ kế hoạch

Đọc file này trước nếu tiếp tục bất kỳ việc gì thuộc B2/Mai Studio/
livestream/SEO — có đủ trạng thái thật + việc cần làm tiếp, không cần đọc
lại toàn bộ lịch sử chat.

## ⚠️ CHẶN NGAY LÚC NÀY — Docker/WSL2 bị lỗi hạ tầng, cần Joe tự xử lý

Cuối phiên, `docker exec`/`docker restart` vào `n8n-vkd` bắt đầu lỗi:
`OCI runtime exec failed: ... error executing setns process: exit status 1`
và container CPU tụt lên 1374% trước đó — dấu hiệu WSL2/Docker Desktop bị
lỗi ở tầng hệ điều hành, không phải lỗi workflow hay lỗi Claude gây ra.
Claude không được phép tự chạy `wsl --shutdown` (bị chặn bởi quy tắc an
toàn — hành động ảnh hưởng toàn máy).

**Việc Joe cần làm trước khi làm bất cứ gì tiếp**:
1. Đóng Docker Desktop hẳn.
2. Mở PowerShell (không cần quyền admin) chạy: `wsl --shutdown`
3. Mở lại Docker Desktop, đợi tới khi icon hết "starting".
4. Chạy `docker start n8n-vkd strapi_cms` nếu chúng không tự tự lên.
5. Báo phiên sau, việc import SEO patch (mục dưới) sẽ chạy tiếp ngay.

## Trạng thái THẬT của từng phần việc (không phải suy đoán)

### 1. B2 — tự động hoá research PubMed vào bài viết: ĐANG CHẠY THẬT, ỔN ĐỊNH
- Đã test qua webhook thật nhiều lần, bug ảnh trùng + tiêu đề lai Anh-Việt
  đã sửa và verify thật (xem file 36 mục 1 để biết chi tiết kỹ thuật).
- Đây là phần DUY NHẤT trong phiên này đã deploy thành công và đang chạy
  trên workflow live `BcMAh4e0xYXG9bR4`.

### 2. SEO on-page mạnh hơn (Joe yêu cầu cuối phiên): CODE ĐÃ VIẾT XONG, CHƯA DEPLOY ĐƯỢC
- Đã thêm: `meta_description`/`focus_keyword` (cột mới trong Supabase
  `blog_posts`, đã tạo xong — phần DB này KHÔNG bị ảnh hưởng bởi lỗi
  Docker), prompt Gemini yêu cầu thêm PHẦN 3 SEO (focus keyword, ≥2 heading
  H2, meta description 120-160 ký tự), node mới "Kiem Tra SEO" (tính
  seoScore 0-100 + seoWarnings, do Ollama draft + Claude sửa lỗi cú pháp).
- File JSON đã sẵn sàng: `wf_seo_final.json` trong thư mục scratchpad phiên
  này (đường dẫn tạm, KHÔNG còn tồn tại sau khi phiên kết thúc) — **cần làm
  lại từ đầu ở phiên sau** theo đúng các bước ở mục "Việc làm tiếp" dưới
  đây, không có file backup lâu dài, vì đây là working file tạm.
- Đã sửa song song ở code site (ĐÃ COMMIT ĐƯỢC, không phụ thuộc Docker):
  `src/lib/siteContentApi.ts` (thêm field `meta_description` vào type +
  3 query) và `src/components/BlogPostDetail.tsx` (dùng
  `meta_description || excerpt` cho thẻ SEO/JSON-LD thay vì chỉ dùng
  excerpt) — 2 file này ĐÃ SỬA XONG THẬT trong `ta_production/project`,
  chỉ chưa build/deploy lên Vercel.

### 3. Mai Studio (video tự tạo cho KOC Mai): ĐÃ CÓ SẴN, CHƯA TEST THẬT
Xem chi tiết đầy đủ ở file 36 mục "Mai Studio" — không lặp lại ở đây.

### 4. Livestream loop OBS: KẾ HOẠCH XONG, CHƯA TRIỂN KHAI THẬT
Xem file 37 (flow 30 phút, 5 phương án mạnh hơn OBS, overlay HTML đã làm
sẵn ở `docs/kol-sam-ngoc-linh/overlay/mai-live-overlay.html`).

## Việc làm tiếp ngay khi Docker sống lại (thứ tự ưu tiên)

1. Export workflow hiện tại (`n8n export:workflow --id=BcMAh4e0xYXG9bR4`),
   kiểm tra node "Xay dung Prompt" ĐÃ có đoạn "PHAN 3 - SEO" chưa (nếu
   CHƯA có nghĩa là bản SEO patch chưa từng deploy — làm lại từ đầu theo
   đặc tả ở mục 2 phía trên, không cần hỏi lại Joe, đã có đủ spec).
2. Sau khi deploy xong, test qua webhook thật (`curl -X POST
   http://localhost:5678/webhook/sam-ngoc-linh-publish`), kiểm tra Supabase
   `blog_posts` có cột `meta_description`/`focus_keyword` được điền không.
3. Cân nhắc thêm: gửi `seoScore`/`seoWarnings` qua Telegram cùng thông báo
   bài viết mới (hiện code node "Kiem Tra SEO" đã tính ra 2 field này
   nhưng CHƯA nối vào node Telegram — chỉ mới lưu tạm trong luồng dữ liệu,
   không mất, chỉ chưa hiển thị cho Joe xem).
4. Build + deploy site (`ta_production/project`) để 2 file site đã sửa lên
   production thật (hiện chỉ có ở local).

## Định nghĩa "KẾT QUẢ CUỐI CÙNG" cho toàn bộ kế hoạch (Joe yêu cầu ghi rõ)

Đây là đích đến cụ thể của TOÀN BỘ sáng kiến "máy KOL Sâm" — dùng để biết
khi nào một hạng mục thực sự "xong", không phải khi nào code chạy không
lỗi:

| Hạng mục | Kết quả cuối = | Cách xác nhận đã đạt |
|---|---|---|
| B2 (research tự động) | Mỗi bài blog tự sinh hàng ngày đều grounded từ 1 nghiên cứu PubMed thật, có DOI truy vết được, KHÔNG cần Claude/Joe tìm tay | Check `blog_posts.source_doi` khác NULL cho ≥80% bài mới trong 1 tuần liên tục |
| SEO on-page | Mỗi bài có `meta_description` 120-160 ký tự + `focus_keyword` xuất hiện tự nhiên trong tiêu đề/H2/nội dung, `seoScore` trung bình ≥80/100 | Query Supabase định kỳ, không cần đọc từng bài tay |
| Ảnh không trùng | 2 bài liên tiếp trong 7 ngày KHÔNG dùng chung 1 `featured_image_url` (trừ khi hết ảnh trong bucket đó) | Query đếm `featured_image_url` trùng trong 7 ngày gần nhất, phải bằng 0 hoặc rất thấp |
| Mai Studio | Mai tự vào `/mai-studio`, chọn sản phẩm/giọng đọc, bấm tạo — video thật xuất hiện trong Supabase Storage + Telegram trong <5 phút, KHÔNG cần Joe/Claude can thiệp | Joe tự test 1 lần thành công, xem là "xong", không cần lặp lại |
| Livestream Mai | Có ít nhất 1 kênh (FB hoặc TikTok) chạy loop 24/7 thật, có người thật trực tin nhắn song song, chạy ổn định ≥3 ngày liên tục không cần can thiệp thủ công | Joe xác nhận qua theo dõi trực tiếp, không phải chỉ "đã cài xong công cụ" |
| B10 (Postiz thay Facebook Graph API) | Đăng bài từ CMS admin thật sự lên Facebook qua Postiz, không còn phụ thuộc token Facebook Graph tự quản lý cũ | 1 lần đăng thật thành công qua Postiz, không lỗi token trong ≥1 tháng |

**Nguyên tắc chung cho "xong"**: xong = đã chạy thật ít nhất 1 lần với dữ
liệu/tiền thật (không phải test giả), VÀ có cách tự kiểm tra lại bằng
query/log mà không cần đọc lại toàn bộ hội thoại cũ. Nếu 1 hạng mục chỉ
"code không lỗi" nhưng chưa test thật — vẫn ghi rõ là "CHƯA XONG", như cách
đã làm xuyên suốt các file 35-38.

## File liên quan (đọc theo thứ tự nếu cần thêm chi tiết)

- **35**: backlog kỹ thuật gốc 10 repo.
- **36**: bug đã sửa (ảnh trùng, tiêu đề lai ngôn ngữ) + trạng thái Mai
  Studio.
- **37**: kế hoạch livestream loop OBS + 5 phương án mạnh hơn.
- **38 (file này)**: handoff mới nhất + định nghĩa kết quả cuối.
