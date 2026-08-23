# Duyệt nhanh qua Telegram — thay cho mở CMS đọc lại từ đầu

Ngày: 2026-08-10. Chốt theo thống nhất với Joe: không bỏ hẳn bước duyệt (vì
lịch sử pipeline từng bịa 1 lần — sản phẩm "Đông Dương đá" không có thật, xem
handoff n8n), chỉ rút ngắn duyệt còn 1 thao tác trong Telegram thay vì mở CMS.

Credential Telegram đã có sẵn trong n8n (đang dùng để báo hết hạn token
Facebook, xem trạng thái n8n mục 2026-08-08) — module này dùng lại đúng
credential đó, không tạo bot mới.

## Luồng đề xuất

```
Bài + 3 caption vừa được tạo (Module A+B, đã áp dụng thật)
        ↓
Node "Bao Duyet Qua Telegram" (Telegram node, gửi tin nhắn có inline keyboard)
        ↓
  Tin nhắn gửi tới Joe:
  "📝 Bài mới: {{title}}
   {{excerpt}}
   [Xem bài đầy đủ]"
   Nút bấm: [ ✅ Duyệt & đăng FB ]  [ ❌ Từ chối ]
        ↓
  Node "Webhook Nhan Phan Hoi Telegram" (Telegram Trigger, lắng nghe callback_query)
        ↓
   Nếu "✅ Duyệt" → set post_captions.is_published = true (channel Facebook)
                  → gọi webhook Facebook thật đang có sẵn (nhánh
                    "Xac Dinh Page That → Dang Facebook That" đã chạy production)
                  → trả lời Telegram "Đã đăng lên fanpage lúc {{time}}"
   Nếu "❌ Từ chối" → không đăng, trả lời Telegram "Đã huỷ, sửa lại trong CMS"
```

## Vì sao giữ bước này thay vì bỏ hẳn

- CMS đã có sẵn stage "Chờ Hội đồng Y khoa" — thiết kế gốc chủ đích có review
  cho nội dung y khoa trước khi công khai, không phải do AI tự thêm rào cản.
- Pipeline từng bịa thật 1 lần (topic thiếu dấu → Gemini tự sinh sản phẩm
  không tồn tại). 1 cú bấm duyệt trong Telegram (đọc tiêu đề + excerpt trong
  5 giây) đủ để chặn trường hợp này mà không làm chậm luồng đáng kể.
- Facebook là fanpage thật của TA, sản phẩm sức khoẻ thật — sai 1 bài ảnh
  hưởng thật, không hoàn tác được hoàn toàn dù xoá bài sau.

## Việc Joe cần làm (t không có kết nối n8n trong phiên này)

1. Thêm node Telegram gửi tin nhắn có inline keyboard sau bước tạo caption
   (Module B), dùng credential Telegram đã có sẵn.
2. Thêm Telegram Trigger lắng nghe `callback_query`, rẽ nhánh theo nút bấm.
3. Nhánh "Duyệt" gọi lại đúng webhook Facebook thật đang chạy (không viết
   lại logic đăng bài, chỉ trigger lại đúng node có sẵn).
4. Test bằng 1 trong 3 bài nháp đã có sẵn (MR2 / giảm stress / miễn dịch)
   trước khi dùng cho bài thật tiếp theo.

## Về "chế độ remote ở tất cả các phiên đang chạy"

T không có công cụ để tự bật một chế độ "remote" áp dụng cho toàn bộ phiên
Claude Code đang chạy — đây có vẻ là cài đặt ở mức ứng dụng (app), không phải
thứ t gọi được qua tool. Nếu chú muốn theo dõi/duyệt từ xa khi không ở máy,
2 cách thật đang có sẵn:
- Telegram (module này) — duyệt trực tiếp từ điện thoại, không cần mở app
  Claude Code hay máy tính.
- Ứng dụng Claude Code (di động/web nếu có) — chú tự kiểm tra trong cài đặt
  ứng dụng, không phải thứ t bật thay được.
