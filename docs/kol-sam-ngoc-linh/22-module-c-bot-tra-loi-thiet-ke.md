# Module C — Bot trả lời & thu thông tin đơn (THIẾT KẾ, CHƯA WIRING)

Ngày: 2026-08-10. Đây là bản thiết kế để Joe xem và duyệt phạm vi quyền
trước — **chưa tạo credential/webhook nào**, vì module này đụng tin nhắn
khách hàng thật, khác với Module A/B (chỉ đụng nội dung/caption).

## 0. Ranh giới an toàn (không thương lượng)

- Bot **không** tự xử lý thanh toán/chuyển tiền. "Chốt đơn" = thu thông tin
  đơn (tên, SĐT, sản phẩm, số lượng) rồi báo khách "đội ngũ xác nhận trong
  ít phút" — người thật xác nhận và thu tiền theo đúng quy trình hiện có.
- Bot chỉ trả lời dựa trên dữ liệu thật trong `src/data/products.ts` (giá cố
  định các sản phẩm đóng gói) — **không** báo giá hoa/củ/lá sâm tươi vì giá
  này theo thời giá, đã ghi rõ ở [19-lich-hang-ngay-team-kol-fanpage-tiktok.md](19-lich-hang-ngay-team-kol-fanpage-tiktok.md).
  Câu hỏi về giá hoa/củ/lá tươi → escalate người, không tự trả lời.
- Không bịa số liệu đã bán/rating/kiểm định — đúng nguyên tắc đang áp dụng
  toàn hệ thống.

## 1. Vì sao chưa có sẵn trong 10 repo đã khảo sát

Cả 10 repo tập trung vào tạo/đăng nội dung, không có repo nào làm inbox
reply/order-capture cho sâm. Phải tự ghép từ 3 khối có sẵn: webhook Meta
Messenger (n8n đã có credential Facebook Graph, chỉ cần MỞ RỘNG phạm vi sang
`pages_messaging` — đây là quyền mới, cần Joe duyệt), Gemini (đã dùng ở Flow
1), Supabase (đã dùng cho `channels`/`post_captions`).

## 2. Luồng đề xuất

```
Khách nhắn Messenger/Zalo OA
        ↓
Webhook n8n (endpoint mới, KHÁC endpoint publish-to-channel hiện có)
        ↓
Node "Phan Loai Y Dinh" (Gemini): trả về 1 trong 3 nhãn
   - faq        → câu hỏi có thể trả lời từ products.ts (giá/thành phần/cách dùng)
   - order      → khách muốn mua, có nêu sản phẩm/số lượng
   - khac       → ngoài kịch bản (khiếu nại, mặc cả, hỏi giá hoa/củ/lá tươi, câu hỏi y tế)
        ↓
  faq  → Gemini trả lời (grounded products.ts) → gửi lại khách
  order→ Lưu vào bảng mới `order_drafts` (post_id không cần, chỉ cần
         customer_name/phone/product/qty/source_channel/created_at)
         → gửi khách "Dạ em đã ghi nhận, đội ngũ liên hệ xác nhận trong ít
           phút ạ" → Telegram báo Joe/team (kênh Telegram đã dùng cho cảnh
           báo token FB, xem file trạng thái n8n)
  khac → KHÔNG tự trả lời → Telegram báo người xử lý ngay, bot chỉ nhắn
         khách "Dạ để em chuyển câu hỏi này cho đội ngũ ạ"
```

## 3. Việc cần Joe quyết trước khi wiring

1. **Mở rộng quyền Facebook app** sang `pages_messaging` (Meta có thể yêu cầu
   App Review tuỳ mức Access hiện tại — giống vướng mắc System User token đã
   gặp ở Facebook posting, xem file trạng thái n8n mục 2026-08-08).
2. **Zalo OA đang unverified** (file 18 mục -1) — nhắn tin tự động qua Zalo
   OA API cần OA đã verify, nên nhánh Zalo của module này phải chờ, chỉ làm
   nhánh Facebook Messenger trước.
3. **Tạo bảng `order_drafts` mới trong Supabase** — bảng chưa tồn tại, cần
   Joe duyệt schema (đề xuất ở mục 2) trước khi tạo thật.
4. **Ngưỡng escalate** — hiện đề xuất 3 nhãn faq/order/khác, Joe xem có cần
   thêm nhãn nào không trước khi chốt prompt phân loại.

## 4. Khi nào làm

Sau Module A + B (đã có spec, áp dụng ngay). Module C chỉ bắt đầu wiring khi
Joe xác nhận cả 4 điểm ở mục 3, vì đây là module duy nhất đụng dữ liệu/tin
nhắn khách hàng thật.
