# Telegram duyệt nhanh — cấu hình node cụ thể để dán vào n8n

Ngày: 2026-08-13. Viết dựa trên cấu trúc node THẬT đã đọc trong workflow
"Sam Ngoc Linh VKD - Auto CMS" (không đoán) — dùng lại đúng credential
Telegram đã có sẵn (node "Thong Bao Telegram" / "Bao Kenh Qua Telegram" đang
dùng), không tạo bot mới, không cần thêm API key nào.

## Điểm chèn: ngay sau "Ket Hop Du Lieu" (bài viết mới vừa tạo xong)

Hiện tại nhánh trên cùng kết thúc ở: `... → Ket Hop Du Lieu → (nhánh ảnh) →
Thong Bao Telegram → Ghi Bai Vao Supabase`. "Thong Bao Telegram" hiện chỉ
báo tin, không có nút bấm. Sửa node này (hoặc thêm 1 node Telegram mới ngay
sau nó) để có **inline keyboard**.

### Node 1 — Sửa "Thong Bao Telegram" (hoặc thêm node mới cùng vị trí)

Trong node Telegram (action: Send Message), thêm phần **Reply Markup →
Inline Keyboard**, thêm 1 hàng 2 nút:

| Text nút | Callback data |
|---|---|
| ✅ Duyệt & đăng FB | `approve_fb:{{ $json.post_id }}` |
| ❌ Từ chối | `reject:{{ $json.post_id }}` |

`post_id` lấy từ field đã có sẵn trong data chảy qua node này (chính là ID
bài vừa ghi vào Supabase ở bước kế tiếp — nếu thứ tự hiện tại ghi Supabase
sau bước Telegram, đảo 2 bước: **Ghi Bai Vao Supabase trước, Thong Bao
Telegram sau**, để có `post_id` thật đưa vào callback_data).

### Node 2 — Thêm mới: "Telegram Trigger - Duyet Nhanh"

- Loại node: **Telegram Trigger**
- Update Types: chỉ tick `callback_query`
- Dùng chung credential Telegram đã có

### Node 3 — Thêm mới: "IF - La Duyet FB" (ngay sau Node 2)

- Điều kiện: `{{ $json.callback_query.data }}` bắt đầu bằng `approve_fb:`

**Nhánh true** → Node 4a. **Nhánh false** (bấm "Từ chối") → Node 4b.

### Node 4a — "Goi Lai Webhook Duyet Kenh That" (HTTP Request)

Gọi lại đúng endpoint CMS đang dùng thật (không viết lại logic đăng bài):

```
POST http://localhost:5678/webhook/publish-to-channel
Body (JSON):
{
  "action": "publish",
  "post_id": "{{ $json.callback_query.data.split(':')[1] }}",
  "channel": "facebook",
  "channels": ["facebook"]
}
```

Lưu ý: payload rút gọn này thiếu `title/content/image_url` so với payload
đầy đủ CMS gửi — cần thêm 1 node **Supabase (Get row)** trước đó, query
`blog_posts` theo `post_id` để lấy đủ `title/excerpt/content/featured_image_url`
rồi mới build payload đầy đủ, khớp đúng field mà node "Dang Facebook That"
đang đọc (`content`, `image_url`, `caption`, `featured_image_url` — xem lại
comment trong `CmsPage.tsx` dòng ~276-279 nếu cần đối chiếu).

### Node 4b — "Bao Da Tu Choi Telegram" (Telegram, Send Message)

Trả lời "Đã huỷ, sửa lại trong CMS nếu cần đăng." — không gọi webhook nào.

### Node 5 — "Tra Loi Callback" (Telegram, Answer Callback Query)

Bắt buộc có node này ở cuối cả 2 nhánh — nếu thiếu, nút bấm trên điện thoại
Joe sẽ hiện icon "đang tải" mãi dù đã xử lý xong.

## Vì sao viết hướng dẫn chữ thay vì file JSON import sẵn

T không tự tin JSON schema chính xác 100% cho Telegram Trigger + Inline
Keyboard của đúng phiên bản n8n 2.31.6 đang chạy (rủi ro import lỗi, hỏng
workflow đang chạy thật) — làm bằng tay qua UI n8n an toàn hơn, mỗi node
build xong test ngay được bằng nút "Execute step" trước khi nối tiếp.

## Việc Joe cần làm

1. Đảo thứ tự "Ghi Bai Vao Supabase" lên trước "Thong Bao Telegram" (nếu
   chưa đúng thứ tự) để có `post_id` thật.
2. Thêm inline keyboard vào node Telegram theo Node 1.
3. Thêm Node 2-5 theo đúng thứ tự trên.
4. Test bằng 1 bài nháp trước khi dùng cho bài thật tiếp theo.
