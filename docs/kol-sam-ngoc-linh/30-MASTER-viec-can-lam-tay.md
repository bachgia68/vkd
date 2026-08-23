# MASTER — Mọi việc cần Joe tự làm, copy-paste khi rảnh

Ngày: 2026-08-14. File tổng hợp DUY NHẤT — mọi hướng dẫn tay đã viết rải
rác (file 20-29) đều gom lại đây, kèm link thật, để khỏi phải lục lại từng
tin nhắn. Làm theo đúng thứ tự ưu tiên từ trên xuống.

---

## 1. VÁ LỖI BẢO MẬT — token Telegram plaintext (ưu tiên #1, 5 phút, không cần chờ ai)

**Vấn đề:** 4 node HTTP Request trong workflow n8n đang gọi Telegram Bot
API với token dán thẳng vào URL — ai export workflow JSON cũng đọc được.

**4 node cần sửa:** `Bao Kenh Qua Telegram`, `Thong Bao Telegram`,
`Bao Ket Qua FB Telegram`, `Bao Nhac Gia Han Telegram`.

**Làm:**
1. Mở n8n → **Credentials** → **Create credential** → gõ "Telegram API" → chọn.
2. Ô **Access Token**: mở 1 trong 4 node trên, copy phần token trong URL
   (đoạn giữa chữ `bot` và dấu `/` cuối cùng) → dán vào đây.
3. Đặt tên credential: `Telegram Bot - TA` → Save.
4. Với từng node trong 4 node: xoá node HTTP Request cũ → kéo thả node mới
   loại **Telegram** (gõ tìm trong panel bên trái) → chọn credential vừa
   tạo → Resource: Message → Operation: Send a Text Message → Chat ID và
   Text copy nguyên từ node cũ trước khi xoá → nối lại dây nối.
5. Test bằng "Execute step", xong hết 4 node thì Save workflow.

Chi tiết đầy đủ: [29-va-loi-token-plaintext-huong-dan-tay.md](29-va-loi-token-plaintext-huong-dan-tay.md)

---

## 2. FACEBOOK — sửa quyền token thật (đang bị chặn phía Meta, kiểm tra định kỳ)

**Link:** [developers.facebook.com/apps](https://developers.facebook.com/apps)

**Trạng thái lúc viết file này:** tài khoản dev Meta (Moc Nguyen) đang bị
khoá, hiện lỗi "Cần xác nhận tài khoản". Vào link trên, bấm "Xác nhận tài
khoản", làm theo hướng dẫn Meta (xác minh SĐT/email, có thể cần giấy tờ).

**Sau khi tài khoản hết bị khoá, làm tiếp:**
1. Vào app đang dùng (tên **videoflow**, ID `936399749494997` — chú tự
   xác nhận lại tên/ID còn đúng không).
2. **App Review → Permissions and Features** → xin cấp `pages_manage_posts`
   + 1 trong 2 quyền: `pages_read_engagement` hoặc `pages_manage_metadata`.
3. [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
   → chọn đúng Page → tạo Page Access Token mới → đổi sang long-lived token.
4. Đưa token mới cho t (dán vào chat) — t cập nhật credential "Facebook
   Graph account" trong n8n.

**Giải pháp thay thế nếu Meta cứ chặn mãi:** dùng Postiz (mục 4 dưới) —
Postiz kết nối Facebook qua màn hình đăng nhập OAuth thường, không qua
Developer Portal đang bị khoá.

---

## 3. TIKTOK — tạo Developer App + OAuth (chưa từng làm)

**Link:** [developers.tiktok.com/apps](https://developers.tiktok.com/apps)

1. Đăng nhập bằng tài khoản @tasamngoclinh (hoặc tài khoản quản lý).
2. Tạo app mới → xin quyền **Content Posting API**.
3. Sau khi được duyệt (TikTok thường mất vài ngày), lấy Client Key +
   Client Secret → đưa t để nối vào n8n.

**Giải pháp thay thế nhanh hơn:** dùng Postiz (mục 4) — Postiz tự quản
OAuth TikTok, không cần tự xin Content Posting API riêng.

---

## 4. POSTIZ — nền tảng đăng đa kênh thay thế (đang setup)

**Đã tự cài xong phần hạ tầng** tại `D:\TA page\postiz\` (Docker, chạy trên
máy chú, không cần chú làm gì cho bước cài đặt).

**Sau khi cài xong (t sẽ báo khi container chạy ổn định), việc chú cần
làm:**
1. Mở [localhost:4007](http://localhost:4007) → tạo tài khoản admin đầu
   tiên (email + mật khẩu — **chú tự tạo, t không nhập thay**).
2. Vào mục kết nối kênh (Channels/Integrations) → bấm "Connect" cho từng
   nền tảng (Facebook, TikTok...) → đăng nhập OAuth như bình thường.
3. Báo t khi kết nối xong — t nối Postiz vào workflow n8n hiện có.

---

## 5. TELEGRAM DUYỆT NHANH — sau khi xong mục 1

Chi tiết đầy đủ: [28-telegram-duyet-nhanh-cau-hinh-node.md](28-telegram-duyet-nhanh-cau-hinh-node.md)

5 node cần thêm vào n8n (tóm tắt, xem file 28 để có bảng chi tiết):
1. Thêm inline keyboard (nút Duyệt/Từ chối) vào node Telegram thông báo bài mới.
2. Telegram Trigger mới, chỉ nghe `callback_query`.
3. IF node kiểm tra callback data bắt đầu bằng `approve_fb:`.
4. Nhánh true → gọi lại webhook `http://localhost:5678/webhook/publish-to-channel`.
5. Nhánh false → báo đã huỷ. Cả 2 nhánh → node "Answer Callback Query".

---

## Thứ tự làm khi có thời gian

1. Mục 1 (vá bảo mật) — làm trước, không phụ thuộc gì, 5 phút.
2. Mục 4 (Postiz) — kiểm tra t đã cài xong chưa, tự tạo tài khoản + kết nối kênh.
3. Mục 2 hoặc 3 (Facebook/TikTok) — chỉ cần nếu KHÔNG dùng Postiz thay thế.
4. Mục 5 (Telegram duyệt nhanh) — làm sau cùng, cần mục 1 xong trước.
