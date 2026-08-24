# Todo — Admin ngôn ngữ/header-footer/ảnh vườn (2026-08-24)

Xem chi tiết ở `tasks/plan.md`. Checklist thi công theo thứ tự phase.

## Phase 1 — Supabase (làm trước tiên)
- [ ] Task 1: bảng `site_languages` + RLS + seed 5 ngôn ngữ hiện có
- [ ] Task 2: bảng `site_text_overrides` + RLS
- [ ] Task 3: thêm cột `location`, `captured_date` vào `heritage_gallery_images`
- [ ] **Checkpoint 1**: `list_tables` xác nhận đúng, RLS test qua `execute_sql`

## Phase 2 — Backend layer
- [ ] Task 4: adminApi.ts — CRUD site_languages (KHÔNG có hàm delete)
- [ ] Task 5: siteContentApi.ts — fetchVisibleLanguages()
- [ ] Task 6: adminApi.ts + siteContentApi.ts — CRUD site_text_overrides
- [ ] Task 7: mở rộng HeritageGalleryImage type + create/update nhận location/captured_date
- [ ] **Checkpoint 2**: `npx tsc --noEmit` sạch

## Phase 3 — Trang admin
- [ ] Task 8: LanguagesPage.tsx
- [ ] Task 9: HeaderFooterPage.tsx
- [ ] Task 10: đăng ký route + NAV trong AdminLayout.tsx
- [ ] Task 11: form HeritageGalleryPage.tsx thêm địa điểm/ngày chụp
- [ ] **Checkpoint 3**: 2 mục nav mới hiện trong admin, thao tác không lỗi

## Phase 4 — Gate trang khách hàng
- [ ] Task 12: Header.tsx + Footer.tsx dùng useSiteLanguages() thay hardcode
- [ ] Task 13: Header.tsx + Footer.tsx đọc site_text_overrides, fallback translations.ts
- [ ] Task 14: Heritage.tsx hiện caption location/ngày dưới ảnh
- [ ] **Checkpoint 4**: build sạch, ẩn ngôn ngữ ở admin → biến mất ở trang khách ngay

## Phase 5 — SỬA LẠI 2026-08-24: KGC-style = hiệu ứng carousel, KHÔNG phải màu ảnh
Joe làm rõ lại: ảnh gốc không cần chỉnh màu. "Kiểu KGC" nghĩa là hiệu ứng
vuốt/chuyển ảnh trên kgc.co.kr — ảnh đang active nổi lên (scale + shadow) khi
vuốt ngang, không phải hậu kỳ màu sắc. Việc chỉnh màu (grade_heritage_photos.py)
ĐÃ HỦY, không cần làm nữa.
- [x] Task 15: xem ảnh gốc thật bằng mắt — kết luận: ảnh ổn, không cần chụp lại
- [~] Task 20 (thay Task 16/17): carousel vuốt ngang + hiệu ứng "nổi lên" cho
      slide active, thuần CSS scroll-snap + IntersectionObserver (không thêm
      lib), giao subagent Claude chạy nền (2026-08-24)
- [ ] Checkpoint: build sạch, carousel có dot indicator + nút mũi tên desktop,
      caption location/ngày hiện dưới ảnh nếu có dữ liệu

### Phiên Ox — Task 15 (khảo sát chất lượng ảnh gốc + rà soát build)
```
Task 1: Liệt kê toàn bộ ảnh trong bảng heritage_gallery_images (query Supabase project
  xcwirgrlnibnjmseglee, SELECT id, image_url, alt_vi, location, visible FROM
  heritage_gallery_images ORDER BY sort_order), tải từng ảnh về xem, ghi chú ảnh nào:
  mờ/thiếu sáng/góc xấu (không cứu được bằng hậu kỳ, cần chụp lại) vs ảnh đủ chất lượng
  để Qwen hậu kỳ (Task 16). Xuất danh sách phân loại 2 nhóm ra 1 file text.
Task 2 (sau khi Claude báo Phase 3-4 xong): chạy `npx tsc --noEmit -p tsconfig.json` và
  `npm run build` trong ta_production/project, xác nhận sạch — báo lại nếu có lỗi.
```

## Phiên chính (sau khi Qwen/Ox/subagent xong, cần Joe duyệt)
- [ ] Duyệt danh sách phân loại ảnh của Ox (Task 15)
- [ ] Duyệt bộ ảnh trước/sau của Qwen (Task 16/17), chọn ảnh nào thay
- [ ] Ảnh đã duyệt: upload qua admin Heritage Gallery (kèm location/date) — không tự ý apply thẳng

## Phase 6 — About Us
- [x] Task 19: FounderStory.tsx thêm khối ảnh + tọa độ 15°12'N 108°18'E (xong 2026-08-24, tsc sạch)

## Checkpoint cuối
- [ ] npm run build sạch
- [ ] Test tay toàn luồng end-to-end
- [ ] Deploy CHỈ khi Joe yêu cầu rõ ràng (skill deploy-vkd-site)
