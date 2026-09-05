# 10 repo nâng cấp frontend web TA — kèm lệnh cài, mapping vào taste-skill

Ngày tạo: 2026-08-24. Research qua WebSearch, xác minh tồn tại thật (không
đoán như ảnh "30 tool" trước đây từng bị fake số sao). Đây là backlog CHO
WEB (Next.js + Tailwind site tasamngoclinh.com) — khác hẳn file
`docs/kol-sam-ngoc-linh/35-...` (đó là backlog n8n pipeline, không liên
quan). Áp dụng cùng `.claude/skills/taste-skill/SKILL.md` — taste-skill là
BỘ QUY TẮC thiết kế, các repo dưới đây là THƯ VIỆN thật để lắp vào.

**Cách giao Qwen/Ox:** xem brief tương ứng trong `tasks/todo.md`. Claude
không tự code — chỉ nghiên cứu + viết brief theo [[feedback_use_qwen_ox_not_claude_subagents]].

## Bảng tổng quan

| # | Repo | Vai trò | Lệnh cài | Ưu tiên | Trạng thái |
|---|---|---|---|---|---|
| 1 | `shadcn-ui/ui` | Component base — bạn sở hữu code, dễ customize, đúng khuyến nghị taste-skill mục 2.A cho "modern SaaS" | `npx shadcn@latest init` rồi `npx shadcn@latest add <component>` | Cao | ☐ Chưa dùng — site hiện tự viết component tay |
| 2 | `radix-ui/primitives` | Primitive accessible (dialog/dropdown/tooltip) nếu cần custom sâu hơn shadcn | `npm i @radix-ui/react-dialog` (theo từng primitive cần) | Trung bình | ☐ Chưa dùng |
| 3 | `natemoo-re/keen-slider` (Keen Slider) | **Thay thế embla-carousel** — nhẹ, xác nhận không có báo lỗi "Invalid hook call" như embla đã gặp với React 19 (xem [[feedback... embla]] trong memory cũ) | `npm i keen-slider` | Cao — giải quyết đúng lỗi cũ đã rollback | ☐ Chưa test — PHẢI test kỹ trên nhánh riêng trước khi thay `SwipeCarousel.tsx`, đừng lặp lỗi embla |
| 4 | `framer/motion` (import từ `motion/react`) | Animation — đúng khuyến nghị taste-skill mục 3.A, thay CSS animation tay hiện tại cho scroll-reveal | `npm i motion` | Trung bình | ☐ Site đang dùng CSS thuần (`useScrollReveal` hook) — ổn định, chỉ đổi nếu cần hiệu ứng phức tạp hơn |
| 5 | `phosphor-icons/react` | Icon set — taste-skill khuyến nghị ưu tiên hơn lucide-react | `npm i @phosphor-icons/react` | Thấp | ☐ Kiểm tra icon hiện tại dùng gì trước khi đổi, tránh đổi cả bộ không cần thiết |
| 6 | `simple-icons/simple-icons` | Logo mạng xã hội thật (Facebook/TikTok/Zalo...) cho social proof — taste-skill mục 4.8 cấm text giả logo | CDN: `https://cdn.simpleicons.org/{slug}/{color}` (không cần cài npm) | Thấp | ☐ Kiểm tra Footer hiện tại có đang dùng icon giả không |
| 7 | `pmndrs/zustand` | Global state nhẹ nếu admin dashboard cần state phức tạp hơn (giỏ hàng, filter sản phẩm) | `npm i zustand` | Thấp | ☐ Chỉ cần nếu prop-drilling admin trở nên rối — chưa xác nhận cần |
| 8 | `colinhacks/zod` | Validate form (Product CRUD, đặt hàng) — chuẩn ngành cho Next.js/TS | `npm i zod` | Trung bình | ☐ Kiểm tra form hiện tại (`BatchTraceabilityLookup`, admin CRUD) đã validate chưa |
| 9 | `htmlstreamofficial/preline` | Landing/marketing block có sẵn — tham khảo bố cục hero/section, KHÔNG cài nguyên bộ nếu chỉ cần tham khảo pattern | Tham khảo code, copy pattern thủ công (không phải `npm install` nguyên site) | Thấp | ☐ Dùng khi cần ý tưởng bố cục mới, không phải dependency |
| 10 | `greensock/GSAP` (đã có sẵn theo taste-skill mục 5.A/5.B) | Sticky-stack / horizontal-pan cho storytelling sản phẩm (Heritage timeline) nếu cần hiệu ứng phức tạp hơn scroll-reveal hiện tại | `npm i gsap` | Thấp | ☐ Chỉ cần nếu Heritage section muốn nâng cấp lên pin/scrub thật |

## Thứ tự đề xuất

1. **#3 Keen Slider** trước tiên — đây là việc GIẢI QUYẾT lỗi đã rollback
   (embla-carousel), giá trị cao nhất, rủi ro đã biết cách né.
2. **#1 shadcn/ui** — nền tảng lâu dài, giảm code tay cho form/dialog/dropdown
   trong admin.
3. **#8 zod** — validate form admin, chi phí thấp, giá trị an toàn dữ liệu cao.
4. Còn lại (#2, #4-7, #9-10) — làm khi có nhu cầu cụ thể, không cài trước
   "cho có".

## Quy tắc bắt buộc khi làm

- **Test trên nhánh riêng trước khi thay `SwipeCarousel.tsx`** — bài học từ
  embla-carousel: cài xong phải chạy dev server thật, thử thao tác vuốt,
  KHÔNG chỉ tin theo README.
- Đọc `docs/DESIGN_SYSTEM.md` mục 7 (carousel bắt buộc cho list nhiều item)
  trước khi đổi bất kỳ carousel nào.
- Mọi thư viện mới phải qua taste-skill mục 3.F (dependency verification) —
  kiểm tra `package.json` trước khi import, không giả định đã có.
