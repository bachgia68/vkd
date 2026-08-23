# Lỗi Facebook token thiếu quyền — cần sửa sau

Ngày ghi nhận: 2026-08-13. Ghi lại để không quên, chưa sửa trong phiên này vì
Joe không có thời gian xử lý ngay.

## Lỗi thật, đọc từ log n8n (execution ID#61, node "Dang Facebook That")

```
NodeApiError: Bad request - please check your parameters
"Any of the pages_read_engagement, pages_manage_metadata, pages_read_user_content,
pages_manage_ads, pages_show_list or pages_messaging permission(s) must be granted
before impersonating a user's page."
```

Không phải token hết hạn (còn hạn tới 2026-10-07) — token hiện tại **thiếu
scope/quyền**. Node có "Execution will continue even if the node fails" nên
n8n báo cả workflow "Succeeded" dù bước đăng Facebook thật đã fail — dễ gây
hiểu nhầm là đã đăng thành công.

## Cách sửa khi có thời gian

Vào Meta for Developers → app đang giữ token → cấp lại `pages_manage_posts`
+ ít nhất 1 trong các quyền bị thiếu ở trên → tạo lại Page Access Token →
cập nhật credential "Facebook Graph account" trong n8n.

## Quyết định của Joe (2026-08-13): tạm dừng hướng tự quản Graph API

Lý do: hướng tự đăng nhập/tự quản token Facebook Graph API (+ tương lai
TikTok Content Posting API) liên tục gãy — App Review, Advanced Access,
token hết hạn, thiếu scope — không đủ thời gian để cứ sửa liên tục. Đang
tìm hướng thay thế ổn định hơn, xem [26-repo-thay-the-va-video-koc.md](26-repo-thay-the-va-video-koc.md).
