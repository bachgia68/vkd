# 3 repo thay thế Graph API tự quản + 3 repo/flow dựng video KOC/KOL

Ngày: 2026-08-13. Ghi lại theo quyết định của Joe: tạm dừng hướng tự quản
token Facebook Graph API (xem [25-loi-token-facebook-can-sua.md](25-loi-token-facebook-can-sua.md))
vì liên tục gãy, không đủ thời gian sửa liên tục.

## A. 3 lựa chọn thay thế đăng đa kênh (đã kiểm tra thật, không phải suy đoán)

### 1. [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) — khuyến nghị chính
Self-hosted (Docker), mã nguồn mở, hỗ trợ 30+ nền tảng (Facebook, TikTok,
Instagram, YouTube...), có sẵn tích hợp n8n + REST API/webhook. Tự host trên
server của TA nên không phụ thuộc bên thứ 3 giữ dữ liệu — Postiz tự quản
OAuth/token cho từng nền tảng thay vì TA phải tự vá Graph API như hiện tại.

### 2. [inovector/mixpost](https://github.com/inovector/mixpost) — phương án dự phòng
Cũng self-hosted (Docker/Laravel), 11 mạng xã hội, trả 1 lần không phải trả
phí định kỳ. Ít nền tảng hơn Postiz (không có TikTok) nhưng ổn định, cộng
đồng lâu năm hơn.

### 3. Ayrshare — phương án không cần tự host (giống hướng Blotato đã đề xuất trước)
Không phải repo mã nguồn mở — là API thương mại (SDK Node.js/Python/PHP...),
Ayrshare tự quản toàn bộ OAuth/token, TA chỉ gọi API. Đánh đổi giống Blotato:
giao quyền đăng bài cho bên thứ 3 — cần Joe tự cân nhắc mức tin tưởng trước
khi dùng, đúng nguyên tắc an toàn đã thống nhất từ đầu.

**Khuyến nghị:** thử Postiz trước (tự host, kiểm soát được, có TikTok) —
giải quyết đúng gốc rễ vấn đề hiện tại (tự quản token Facebook liên tục gãy)
mà không giao dữ liệu cho bên ngoài.

## B. 3 repo/flow dựng video KOC/KOL — có 1 điểm an toàn phải đọc trước khi dùng

**Cảnh báo an toàn (nhắc lại nguyên tắc đã chốt từ đầu dự án):** 2/3 repo bên
dưới có tính năng "AI avatar"/"voice cloning" (tạo mặt người giả, nhân bản
giọng nói). TA đã quyết định **không dùng AI giả mạo gương mặt/giọng người
thật** — rủi ro pháp lý + mất uy tín cho sản phẩm sức khỏe. Chỉ nên dùng các
repo này cho phần **dựng/edit từ tư liệu quay thật** (ghép caption, nhạc,
chuyển cảnh, voiceover từ kịch bản có sẵn), **không bật tính năng avatar ảo**.

### 1. [itsjwill/vanta](https://github.com/itsjwill/vanta)
Engine dựng video mã nguồn mở trên nền Remotion — caption động, nhạc AI,
100+ hiệu ứng chuyển cảnh, thay thế miễn phí cho CapCut/Descript. **Có
tính năng AI avatar + voice cloning — không dùng phần này**, chỉ dùng phần
caption/edit/chuyển cảnh cho tư liệu quay thật.

### 2. [Bomx/super-video-maker-skill](https://github.com/Bomx/super-video-maker-skill)
Skill sản xuất video cho AI agent (dùng được trực tiếp trong Claude Code) —
Remotion + FFmpeg + b-roll AI + caption + QC tự động. **Cũng có tùy chọn
HeyGen avatar — không bật**, chỉ dùng nhánh screen-recording/b-roll thật +
ghép caption/nhạc.

### 3. [lucaswalter/n8n-ai-automations](https://github.com/lucaswalter/n8n-ai-automations)
Bộ workflow n8n có sẵn cho content/marketing automation — dùng để ghép vào
pipeline hiện có (Webhook → prompt → Gemini → ... đã có trong workflow TA),
không có tính năng avatar giả, an toàn nhất trong 3 lựa chọn để tham khảo
cấu trúc workflow.

## Việc cần Joe quyết trước khi triển khai

- Có muốn tự host Postiz trên server hiện có (cùng chỗ chạy n8n) không, hay
  ưu tiên Ayrshare để đỡ phải tự vận hành thêm 1 service?
- Xác nhận lại: video KOC/KOL vẫn dùng người thật quay + AI chỉ hỗ trợ dựng,
  không tạo avatar ảo — đúng tinh thần đã chốt hay Joe muốn xem xét lại?
