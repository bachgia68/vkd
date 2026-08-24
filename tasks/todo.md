# Todo — TA site (cập nhật 2026-08-24, dọn lại cho đúng thực tế)

Quy tắc từ giờ: KHÔNG đánh dấu [x] khi chỉ dựa vào lời subagent báo — chỉ tick
sau khi PHIÊN CHÍNH tự chạy `npx tsc --noEmit` + `npm run build` và xác nhận
sạch. Việc giao Qwen/Ox: xem [feedback_use_qwen_ox_not_claude_subagents]
trong memory — brief nằm ở cuối file này, phiên chính phải tự kiểm tra kết
quả trước khi tick, không để mục nào "chạy song song" mà không ai theo dõi.

## ĐÃ XONG, ĐÃ VERIFY BUILD + PUSH LÊN MAIN (không phải chỉ nêu đề mục)
- [x] Site_languages + site_text_overrides + heritage location/date (Supabase
      + adminApi + admin pages Ngôn Ngữ/Header&Footer) — commit 7fd66f0
- [x] Carousel vuốt Vườn Sâm Nguyên Sinh + tọa độ Trà Linh cho 10 ảnh — commit 7fd66f0
- [x] About Us có ảnh thật + tọa độ — commit 7fd66f0
- [x] Nav admin tràn màn hình (thêm scroll ngang) — commit b170932
- [x] Trang Sản phẩm & Kho nối Supabase thật thay vì API 404 âm thầm — commit b170932
- [x] Video Thực Địa carousel + admin, Certifications carousel, gộp MXH/Liên hệ
      vào Header&Footer — commit 763e5b7
- [x] Component `SwipeCarousel.tsx` dùng chung + chuẩn hoá vào DESIGN_SYSTEM.md
      mục 7 (carousel bắt buộc cho mọi danh sách nhiều item)

## XONG — verify thật bởi phiên chính (build sạch + xem DOM qua dev server, không chỉ tin subagent)
- [x] Gộp menu Nghiên Cứu + Blog thành "Blog & Nghiên Cứu" — xác nhận trên DOM live
- [x] Blog listing thêm carousel "Bài Viết Nổi Bật" (8 slide) + giữ phân trang số 56 bài — xác nhận
- [x] Certifications.tsx → SwipeCarousel + CarouselImage fit=contain (7 slide, hết cắt mất ảnh) — xác nhận
- [x] VideoGallery.tsx → SwipeCarousel chung (4 video Facebook thật) + ProductDetail
      "Sản phẩm liên quan" → carousel — xác nhận
- [x] Commit + push 07f037c (763e5b7..07f037c)

## CHƯA LÀM — sẽ giao Qwen/Ox khi có việc mới (KHÔNG viết brief rồi bỏ đó nữa)
- [ ] Joe tự kiểm tra dòng site_text_overrides key=footer.followUs value="Liên hệ"
      (nghi test data cũ dán nhầm link Facebook, xem lại trong admin Header&Footer)
- [ ] 7 SKU TN thiếu ảnh (TN-002,003,004,006,007,008,009) — site NCC Trường Nhân
      đã đổi catalog, không gán ảnh an toàn được. Đề xuất: ẩn 7 SKU này qua
      trang Sản phẩm & Kho (đã sửa xong nút ẩn/hiện) cho tới khi có ảnh thật

## Checkpoint cuối (chỉ tick khi phiên chính tự chạy, không suy từ báo cáo subagent)
- [ ] npm run build sạch — chạy lại LẦN CUỐI sau khi cả 4 việc trên xong
- [ ] git commit + push (chỉ khi Joe yêu cầu)
- [ ] Test tay trên trình duyệt: carousel vuốt được, nav admin đủ mục, ẩn/hiện
      sản phẩm lưu được thật
