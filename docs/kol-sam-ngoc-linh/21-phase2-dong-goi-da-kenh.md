# Phase 2 (Module B) — Đóng gói đa kênh tự động, 0 credential mới

Ngày: 2026-08-10. Nối tiếp Phase 1 ([20-phase1-nghien-cuu-that-truoc-khi-viet.md](20-phase1-nghien-cuu-that-truoc-khi-viet.md)).
Mục tiêu: xoá bước Joe tự soạn tay caption từng kênh — thay bằng 1 node Gemini
tách bài gốc thành caption riêng, rồi tự điền vào đúng bảng `post_captions`
mà admin CMS đã đọc (xem `saveCaption()`/`publishCaption()` trong
`src/admin/adminApi.ts`, dòng ~898-977).

## 0. Grounded vào schema thật, không bịa bảng mới

- Bảng `post_captions` đã tồn tại: `id, post_id, channel_id, caption_text,
  video_url, is_published, published_at`.
- Bảng `channels` đã có 3 hàng thật: Facebook (đang đăng được), TikTok
  (`@tasamngoclinh`, webhook chưa nối), Zalo (OA `4462867459578640848`,
  chưa verify). `channel_id` của từng hàng dùng để insert đúng caption vào
  đúng kênh.
- Admin CMS hiện tại: người phải tự gõ caption cho từng `channel_id` rồi bấm
  "Duyệt & Đăng". Module B không đổi bước duyệt — chỉ tự động điền sẵn caption
  để người chỉ cần đọc lại + duyệt, không phải viết từ đầu.

## 1. Node mới cần thêm vào n8n (sau khi bài gốc đã tạo xong)

**Vị trí chèn:** ngay sau node tạo bài viết (Strapi/Supabase `blog_posts`),
trước hoặc song song với nhánh tạo ảnh — không đụng nhánh Facebook đang chạy.

**Node A — `Phan Ra Da Kenh` (Gemini):**
Input: nội dung bài gốc (`content_html`/`content` từ node trước) + `topic`.
Prompt:
```
Từ bài viết khoa học sau, viết 3 caption riêng biệt, giữ giọng Quiet Luxury
(điềm đạm, dẫn chứng trước, không sáo ngữ "thiên nhiên ban tặng"/"bí quyết
ngàn đời"):

BÀI GỐC:
{{ $json.content }}

1. Facebook: 80-150 từ, có 1 câu hỏi cuối để gợi bình luận, kèm link
   "Đọc thêm tại tasamngoclinh.com/blog/{{ $json.slug }}"
2. TikTok: dưới 40 từ, mở đầu bằng 1 con số/sự thật cụ thể lấy từ bài gốc
   (không phải lời chào), kèm 4-6 hashtag: #samngoclinh #ngoclinh
   #samvietnam #tramy (+ 1-2 tag riêng theo chủ đề bài)
3. Zalo: 60-100 từ, giọng gần gũi hơn Facebook, không dùng hashtag

Xuất đúng JSON, không thêm chữ nào khác:
{"facebook": "...", "tiktok": "...", "zalo": "..."}
```

**Node B — `Luu Caption Vao Supabase` (HTTP Request, 3 lần lặp qua từng kênh
hoặc 1 node Function tách thành 3 request):**
```
POST {{ $env.SUPABASE_URL }}/rest/v1/post_captions
Headers: apikey / Authorization (dùng credential Supabase đã có sẵn trong n8n
  cho phần khác của workflow — không tạo credential mới)
Body: {
  "post_id": "{{ $json.post_id }}",
  "channel_id": "{{ $json.channel_id_facebook | channel_id_tiktok | channel_id_zalo }}",
  "caption_text": "{{ $json.facebook | tiktok | zalo }}",
  "is_published": false
}
```
`channel_id` của Facebook/TikTok/Zalo là hằng số cố định (lấy 1 lần từ bảng
`channels`, dán thẳng vào node — không cần query lại mỗi lần chạy).

## 2. Kết quả sau khi thêm

Mỗi lần bài viết mới được tạo, vào admin CMS sẽ thấy sẵn 3 caption
(Facebook/TikTok/Zalo) ở trạng thái "chưa duyệt" — Joe/team chỉ đọc lại, sửa
nếu cần, rồi bấm "Duyệt & Đăng" như quy trình hiện tại. Không đổi hành vi
đăng bài thật (Facebook vẫn qua webhook n8n có sẵn; TikTok/Zalo vẫn thủ công
cho tới khi Module credential được nối, xem file 18 mục -1).

## 3. Việc Joe cần làm

1. Lấy 3 `channel_id` thật từ bảng `channels` (SQL: `select id, platform_type
   from channels;`), dán cố định vào node B.
2. Thêm 2 node (A, B) vào n8n sau bước tạo bài viết.
3. Test bằng 1 bài đã có sẵn trong Strapi/Supabase, kiểm tra 3 dòng
   `post_captions` mới xuất hiện đúng bài, đúng kênh.
