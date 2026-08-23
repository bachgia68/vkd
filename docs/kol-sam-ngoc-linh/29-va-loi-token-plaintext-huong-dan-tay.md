# Vá lỗi token Telegram nằm plaintext trong URL — hướng dẫn tay (5 phút)

Ngày: 2026-08-14. T đã thử sửa qua giao diện n8n bằng trình duyệt nhưng UI
bị treo/reset liên tục (đã thử 4 lần) — thay vì tiếp tục tốn thời gian, viết
hướng dẫn để chú tự làm, chắc chắn hơn và nhanh hơn.

## Lỗi thật là gì

4 node trong workflow "Sam Ngoc Linh VKD - Auto CMS" đang gọi Telegram Bot
API bằng **HTTP Request node với token dán thẳng vào URL**:

- `Bao Kenh Qua Telegram`
- `Thong Bao Telegram`
- `Bao Ket Qua FB Telegram`
- `Bao Nhac Gia Han Telegram`

URL dạng: `https://api.telegram.org/bot<TOKEN>/sendMessage` — token nằm
ngay trong URL, ai export workflow JSON ra cũng đọc được token thật.

## Cách sửa (dùng credential đúng chuẩn n8n)

### Bước 1 — Tạo credential Telegram (1 lần duy nhất)
1. n8n → **Credentials** (menu trái) → **Create credential**.
2. Gõ tìm "Telegram API" → chọn.
3. Ô **Access Token**: dán đúng token hiện đang có trong URL của 4 node
   trên (mở 1 trong 4 node, copy phần sau chữ `bot` và trước dấu `/` cuối).
4. Đặt tên: `Telegram Bot - TA` → **Save**.

### Bước 2 — Sửa từng node trong 4 node trên
Với mỗi node:
1. Double-click mở node.
2. Đổi loại node: xoá node HTTP Request cũ, kéo thả node mới loại
   **Telegram** từ panel bên trái (gõ tìm "Telegram" trong ô tìm node).
3. Trong node Telegram mới:
   - **Credential to connect with**: chọn `Telegram Bot - TA` vừa tạo.
   - **Resource**: Message. **Operation**: Send a Text Message.
   - **Chat ID**: copy đúng chat_id đang có trong Body của node HTTP
     Request cũ (mở node cũ trước khi xoá để lấy, hoặc xem trong tab
     Executions của 1 lần chạy gần đây).
   - **Text**: copy nguyên nội dung message đang có trong node cũ.
4. Nối lại đúng các dây nối (input/output) như node cũ đã có.
5. Bấm **Execute step** để test node mới hoạt động đúng trước khi lưu cả
   workflow.

### Bước 3 — Sau khi xong cả 4 node
- **Xoá 4 node HTTP Request cũ** (không giữ lại — vẫn còn token plaintext
  trong đó nếu giữ).
- Lưu workflow, chạy thử 1 lần bằng bài nháp để chắc chắn Telegram vẫn báo
  tin bình thường.

## Vì sao không dùng biến môi trường (Environment Variables)

Đã kiểm tra — tính năng Variables trên bản n8n hiện tại của chú bị khoá
("Upgrade to unlock variables", cần bản trả phí). Nên hướng credential ở
trên là cách duy nhất làm được miễn phí trên bản đang chạy.

## Lợi ích thêm khi làm xong bước này

Node Telegram mới (đúng chuẩn) là điều kiện cần cho module "Duyệt nhanh qua
Telegram" (file 28) — làm xong bước vá lỗi này coi như đã xong luôn 1 phần
chuẩn bị cho module đó.
