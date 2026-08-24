# Kế hoạch: Ảnh sản phẩm chuyên nghiệp + PM tool (2026-08-24)

## Tổng quan
Sau sự cố domain (24/8), 5 việc đã sửa xong trong phiên chính (badge/logo, giá
rượu, submenu mobile, backup, hướng dẫn deploy). Còn lại 3 việc cần giao cho
Qwen/Ox chạy độc lập ở phiên khác + 1 đề xuất PM tool cho phiên chính.

## Ràng buộc bắt buộc (đọc trước khi giao việc)
`docs/DESIGN_SYSTEM.md` mục "Nguồn ảnh" + skill `manage-site-images`: **chỉ
dùng ảnh thật, KHÔNG Unsplash/stock/AI-generate**. Yêu cầu "làm ảnh chuyên
nghiệp" của Joe phải hiểu là XỬ LÝ ảnh thật đã có (crop/nền/màu), không phải
tạo ảnh giả bằng AI. Nếu Qwen/Ox đề xuất dùng Midjourney/DALL-E/Stable
Diffusion để tạo ảnh sản phẩm — DỪNG, hỏi lại Joe trước, vì trái rule đã khoá.

## Task List

### Task A: Crawl 8 ảnh TN còn thiếu (ĐÃ CÓ SẴN, chưa chạy)
Đã có sẵn brief tại `scripts/qwen-tn-remaining-images.md` — giao thẳng cho
Qwen, không cần viết lại.

- **Input:** `scripts/qwen-tn-remaining-images.md` (URL nguồn + 8 SKU thiếu ảnh)
- **Lệnh:** Qwen đọc file trên, crawl `https://samngoclinhtruongnhan.vn/san-pham`,
  xuất `scripts/tn-remaining-images.json`
- **Outcome mong đợi:** file JSON có đủ 8 SKU (TN-002,003,004,006,007,008,009,012)
  với `image_url` dạng S3 trực tiếp (không phải `_next/image` proxy)
- **Bước sau (phiên chính chạy):** `node scripts/merge-tn-remaining-images.js`
  (Qwen cần viết script merge này nếu chưa có) → `npm run build` → `vercel deploy --prod`

### Task B: Xử lý ảnh sản phẩm chuyên nghiệp — công cụ đã chốt

**Quyết định công cụ (2026-08-24, sau khi review đề xuất của Joe):**

| Việc | Công cụ | Vì sao |
|---|---|---|
| Xóa nền / tách nền chi tiết (tóc, viền, bóng đổ) | **rembg** với model `birefnet-general` | De-facto standard, có sẵn REST API server (`rembg s`), miễn phí/chạy local (đúng ngân sách <3tr/tháng), BiRefNet cho độ chi tiết cao hơn U2-Net mặc định — không cần cài BiRefNet riêng, rembg đã wrap sẵn |
| Ghép nền cao cấp kiểu KGC (nền phẳng/gradient nhẹ + đổ bóng sản phẩm) | `scripts/generate_premium_product_bg.py` (đã có sẵn trong repo) | Không viết lại — dùng ảnh đã tách nền từ rembg làm input |
| Nâng cấp độ phân giải ảnh cũ/mờ | **Upscayl** (CLI) | Chỉ dùng cho ảnh gốc thật nhưng độ phân giải thấp, KHÔNG dùng để "vẽ thêm" chi tiết không có thật |

**KHÔNG dùng:** IOPaint/Lama Cleaner (xóa vật thể/inpainting — không cần cho
ảnh sản phẩm sâm, rủi ro tạo chi tiết giả), Fabric.js+Stable Diffusion canvas
editor (tạo ảnh sinh AI — trái rule "chỉ ảnh thật").

**Cài đặt (môi trường máy này — ghi lại vì `python`/`python3` bị Windows
Store alias chặn, phải dùng path đầy đủ):**
```bash
"C:/Users/DELL/AppData/Local/Python/bin/python.exe" -m pip install rembg[cli] onnxruntime
"C:/Users/DELL/AppData/Local/Python/bin/python.exe" -m rembg d  # tải model birefnet-general lần đầu (vài trăm MB, chạy 1 lần)
```

- **Input:** ảnh thật trong `public/assets/images/` có nền xấu/không đồng bộ
- **Lệnh giao Ox:** cài rembg theo lệnh trên, chạy tách nền cho ảnh sản phẩm
  cần sửa, sau đó dùng `generate_premium_product_bg.py` ghép nền chuẩn, xuất
  ảnh mới cùng tên + hậu tố `-premium`, KHÔNG ghi đè ảnh gốc
- **Outcome mong đợi:** danh sách file trước/sau (path cũ → path mới) để Joe
  duyệt từng ảnh trước khi thay vào `products.ts`/Supabase — không tự động
  thay thế hàng loạt
- **Điều kiện dừng:** nếu ảnh gốc chất lượng quá thấp kể cả sau Upscayl, liệt
  kê ra danh sách "cần Joe chụp lại" thay vì tự tạo ảnh thay thế bằng AI

### Task C: Ảnh blog thiếu/trùng (đã có rule sẵn, giao Ox rà soát định kỳ)
- **Input:** skill `make-blog-images` + query SQL đã có trong
  `manage-site-images` (blog_posts featured_image_url NULL/trùng)
- **Lệnh giao Ox:** chạy 2 query rà soát, liệt kê bài thiếu ảnh bìa hoặc <2
  ảnh/bài
- **Outcome mong đợi:** bảng SKU/slug bài viết thiếu ảnh, kèm đề xuất ảnh
  thật có sẵn trong `public/assets/images/` phù hợp (không tự tạo ảnh mới)

## Checkpoint
- [ ] Task A xong → build + deploy, verify 8 sản phẩm TN có ảnh trên
      `tasamngoclinh.com/product/tn-00X`
- [ ] Task B: Joe duyệt danh sách ảnh trước/sau trước khi áp dụng
- [ ] Task C: chỉ báo cáo, không tự sửa DB

## Rủi ro
| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Qwen/Ox tự dùng AI tạo ảnh giả (trái rule) | Cao | Nhắc rõ trong prompt giao việc, review trước khi merge |
| Crawl TN bị chặn/robots.txt | Trung bình | Nếu lỗi, báo lại thay vì bỏ qua âm thầm |

## Task D: PM tool + VS Code — công cụ đã chốt

**Vấn đề:** Claude (phiên chính) hiện là "PM dự án" duy nhất nhưng không có
bảng theo dõi bền vững qua các phiên — dễ sót việc khi nhiều task giao cho
Qwen/Ox chạy song song.

**Quyết định (review 3 lựa chọn Joe đưa: kandev/vibe-kanban, automaker,
agent-deck):**

- **Chọn: vibe-kanban** — đã có sẵn trong danh sách 10 tool tùy chọn của
  `ta_tools_inventory.md` (chưa từng cài thật), nhẹ nhất trong 3 lựa chọn,
  đúng nhu cầu: bảng Kanban cho AI agent, mỗi cột gate qua Human/CI trước khi
  chuyển trạng thái → task không "biến mất" giữa các phiên.
- **Không chọn automaker / agent-deck**: cả hai đòi hỏi hạ tầng nặng hơn
  (Git worktree tự động, quản lý nhiều CLI agent song song qua TUI riêng) —
  vượt quá nhu cầu hiện tại (1 người, ngân sách <3tr/tháng) và tăng bề mặt
  lỗi/bảo trì không cần thiết. Cân nhắc lại sau nếu quy mô đội tăng.

**VS Code:** file `.continueignore` đã có sẵn ở gốc repo → xác nhận đang
dùng **Continue** (extension VS Code, trỏ Ollama local) làm nơi Qwen/Ox code
trực tiếp trong VS Code thay vì chỉ chạy CLI rời — đúng hướng, không cần đổi
tool khác. Việc còn thiếu: cấu hình `.continue/config.json` trỏ đúng model
Ollama đang chạy (`qwen2.5:7b-instruct` theo memory) — giao Ox kiểm tra file
này có tồn tại và đúng model chưa.

- **Lệnh giao Ox:**
  1. Cài `npx vibe-kanban` (hoặc theo hướng dẫn repo) trỏ vào board đọc trực
     tiếp `tasks/todo.md` của các dự án con (site, ta_production/project)
  2. Kiểm tra `.continue/config.json` — nếu thiếu, tạo trỏ Ollama
     `qwen2.5:7b-instruct` tại `http://localhost:11434`
- **Outcome mong đợi:** 1 board vibe-kanban chạy được, hiện đúng task từ
  `tasks/todo.md`; Continue trong VS Code gọi được Ollama local (test bằng 1
  prompt code đơn giản)
