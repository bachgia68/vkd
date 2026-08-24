# Kế hoạch: Dứt điểm admin còn thiếu (ngôn ngữ, header/footer, ảnh vườn sâm) — 2026-08-24

## Tổng quan
Joe đã nhắc các mục này nhiều lần trong 2 tháng, chưa xong. Site đã có sẵn hạ
tầng admin thật (Supabase + RLS + adminApi.ts) cho địa chỉ/phone/social
(`SettingsPage.tsx`) và ảnh vườn sâm (`HeritageGalleryPage.tsx`) — KHÔNG làm
lại từ đầu, chỉ mở rộng đúng pattern đã có. Phần thực sự thiếu: quản trị
ngôn ngữ hiển thị, quản trị text header/footer, field tọa độ/ngày cho ảnh
vườn, và xử lý ảnh vườn theo phong cách KGC.

## Ràng buộc bắt buộc (đọc trước khi làm)
- Theo đúng pattern `docs/DESIGN_SYSTEM.md` mục 2 & 3: bảng Supabase có
  `visible`/`sort_order` + RLS 2 policy + `adminApi.ts` 5 hàm chuẩn tên +
  `siteContentApi.ts` 1 hàm public-read + trang admin copy layout
  `HeritageGalleryPage.tsx` + đăng ký `AdminApp.tsx` + `NAV` trong
  `AdminLayout.tsx`.
- KHÔNG dùng ảnh AI-generate/stock cho vườn sâm — chỉ xử lý hậu kỳ ảnh thật
  đã có (đúng luật đã khoá trong DESIGN_SYSTEM.md + skill `manage-site-images`).
- "Xử lý KGC" cho ẢNH VƯỜN (phong cảnh, không phải sản phẩm nền trắng) KHÔNG
  giống hệt skill `make-premium-product-photos` (skill đó là background-removal
  cho ảnh sản phẩm nền trắng — không áp dụng được cho ảnh phong cảnh có nền
  thật). Với ảnh vườn: xử lý = color-grade đồng bộ (tương phản, tông ấm nhẹ
  theo palette forest/gold đã khoá) + crop tỷ lệ đồng nhất + có thể thêm dải
  caption dưới ảnh (địa điểm/ngày). Nếu ảnh gốc chất lượng quá thấp (mờ, thiếu
  sáng, góc xấu) — hậu kỳ không cứu được, phải báo Joe cần chụp lại, không cố
  ép.

## Kiến trúc / quyết định
- **Ngôn ngữ**: bảng `site_languages` mới, theo đúng khuôn `site_sections`
  (đã có sẵn pattern ẩn/hiện). Khác biệt: KHÔNG cho xóa qua UI (chỉ ẩn/hiện +
  thêm mới) vì xóa nhầm mất công dịch. Ngôn ngữ mới mặc định `visible=false`.
  `Header.tsx`/`Footer.tsx` hiện hardcode `const languages: Language[] =
  ['vi','en','zh','fr','ar']` ở tổng cộng 4 chỗ (Header dòng 53 dùng ở 2 nơi
  render, Footer dòng 55) — thay bằng 1 hook dùng chung `useSiteLanguages()`
  đọc từ bảng mới, để sửa 1 chỗ áp dụng cả 2 file.
- **Header/Footer text**: không build full CMS đa ngôn ngữ (quá lớn, vượt
  scope). Chỉ cho sửa **bản tiếng Việt** của: `footer.brandDesc`, nav labels
  6 mục, `footer.contact`/`footer.followUs`/`footer.quickLinks` label — lưu
  vào 1 bảng `site_text_overrides` (key, value_vi) đơn giản, Header/Footer đọc
  override nếu có, fallback về `translations.ts` nếu chưa sửa. Không đụng 4
  ngôn ngữ còn lại qua admin (vẫn sửa code) — bản dịch đầy đủ qua admin là
  việc lớn riêng, để Joe quyết có cần không sau khi thấy bản này.
- **Heritage gallery**: thêm 2 cột `location text`, `captured_date date` vào
  bảng có sẵn `heritage_gallery_images` (không tạo bảng mới). Giá trị gợi ý
  mặc định trong form: `15°12'N 108°18'E, Trà Linh, Nam Trà My, Quảng Nam`.
  `Heritage.tsx` (trang khách) hiện caption dưới ảnh nếu có field.
- **About Us + ảnh vườn**: `FounderStory.tsx` đã có bài viết đầy đủ (câu
  chuyện Khánh) nhưng KHÔNG có ảnh nào và không có tọa độ hiển thị — chỉ cần
  bổ sung 1 khối ảnh + tọa độ vào trang có sẵn, không viết lại bài.

## Task List

### Phase 1: Nền tảng dữ liệu (Supabase — làm trước, mọi thứ khác phụ thuộc)
- [ ] Task 1: Tạo bảng `site_languages` + RLS + seed 5 dòng hiện có (vi
      visible=true, en/zh/fr/ar visible=true vì bản dịch đã tồn tại đầy đủ
      trong `translations.ts` — không tự ý ẩn ngôn ngữ đang chạy tốt)
- [ ] Task 2: Tạo bảng `site_text_overrides` (key text primary key, value_vi
      text, updated_at) + RLS
- [ ] Task 3: `ALTER TABLE heritage_gallery_images ADD COLUMN location text,
      ADD COLUMN captured_date date`

### Checkpoint 1
- [ ] 3 migration chạy thành công trên Supabase (dùng MCP `apply_migration`
      hoặc SQL editor), `list_tables` xác nhận cột/bảng đúng tên
- [ ] RLS: public chỉ đọc được `visible=true`/`published=true`, ghi cần
      `is_admin()`

### Phase 2: adminApi.ts + siteContentApi.ts (backend layer)
- [ ] Task 4: `adminApi.ts` — 5 hàm `fetchAllSiteLanguages/createSiteLanguage/
      updateSiteLanguage/toggleSiteLanguageVisible` (KHÔNG viết hàm delete —
      cố tình bỏ theo yêu cầu "không được xóa")
- [ ] Task 5: `siteContentApi.ts` — `fetchVisibleLanguages()` (public read)
- [ ] Task 6: `adminApi.ts` + `siteContentApi.ts` — CRUD tương tự cho
      `site_text_overrides` (`fetchTextOverrides`, `upsertTextOverride`)
- [ ] Task 7: mở rộng `HeritageGalleryImage` type + `createHeritageGalleryImage`/
      `updateHeritageGalleryImage` nhận thêm `location`, `captured_date`

### Checkpoint 2
- [ ] `npx tsc --noEmit` sạch
- [ ] Test tay qua Supabase MCP `execute_sql`: insert/update/select đúng RLS

### Phase 3: Trang admin mới
- [ ] Task 8: `src/admin/pages/LanguagesPage.tsx` (copy layout
      `HeritageGalleryPage.tsx`) — list ngôn ngữ, toggle ẩn/hiện, form thêm
      ngôn ngữ mới (key + label, mặc định `visible=false` + cảnh báo "chưa có
      bản dịch, cần thêm vào translations.ts trước khi bật")
- [ ] Task 9: `src/admin/pages/HeaderFooterPage.tsx` — form sửa
      `site_text_overrides` (nav labels, brandDesc, các label cột footer),
      preview trực tiếp giá trị hiện tại
- [ ] Task 10: đăng ký 2 route trong `AdminApp.tsx` + 2 dòng `NAV` trong
      `AdminLayout.tsx` ("Ngôn ngữ", "Header & Footer")
- [ ] Task 11: `HeritageGalleryPage.tsx` — thêm 2 input (địa điểm, ngày chụp)
      vào form thêm ảnh, giá trị mặc định gợi ý tọa độ Trà Linh; hiện
      location/date trong card ảnh admin

### Checkpoint 3
- [ ] Vào `/gate-vkd-control-2026/` thấy đủ 2 mục nav mới
- [ ] Thêm/ẩn/hiện ngôn ngữ test → phản ánh đúng trên Header/Footer trang
      khách (sau Phase 4)
- [ ] Sửa 1 nav label → phản ánh đúng trên Header (sau Phase 4)

### Phase 4: Gate trang khách hàng theo dữ liệu mới
- [ ] Task 12: `Header.tsx` + `Footer.tsx` — thay `const languages: Language[]
      = [...]` hardcode bằng hook `useSiteLanguages()` mới (đọc
      `fetchVisibleLanguages()`), giữ nguyên UI/style hiện tại
- [ ] Task 13: `Header.tsx` + `Footer.tsx` — đọc `site_text_overrides` cho
      nav labels/brandDesc, fallback `translations.ts` nếu chưa có override
- [ ] Task 14: `Heritage.tsx` — hiện caption (location + ngày) dưới mỗi ảnh
      gallery nếu ảnh có field, ẩn caption nếu field trống (ảnh cũ)

### Checkpoint 4
- [ ] `npm run build` sạch, `npm run dev` → tay kiểm: đổi ngôn ngữ ở admin ẩn
      1 ngôn ngữ → biến mất khỏi dropdown Header + Footer ngay
- [ ] Thêm ảnh vườn mới kèm tọa độ/ngày qua admin → hiện caption đúng ở
      Heritage.tsx trang chủ

### Phase 5: Ảnh vườn sâm — xử lý phong cách KGC (việc thị giác, không phải code)
- [ ] Task 15: liệt kê toàn bộ ảnh gốc hiện có trong
      `heritage_gallery_images` (qua `execute_sql` hoặc Supabase Storage) —
      xem chất lượng gốc bằng mắt (Read tool đọc file ảnh thật, không suy
      đoán) trước khi quyết định hậu kỳ được hay cần chụp lại
- [ ] Task 16: viết `scripts/grade_heritage_photos.py` (PIL) — color-grade
      đồng bộ (tương phản, cân bằng trắng, tông ấm rất nhẹ theo palette
      forest/gold ĐÃ KHÓA, không phủ màu phẳng đậm — học nguyên tắc "nền
      nhạt, brand color chỉ điểm nhấn" từ
      `docs/reports/2026-08-07-premium-positioning-brand-guidelines.md`) +
      crop tỷ lệ vuông đồng nhất (khớp `aspect-square` đang dùng ở
      `Heritage.tsx`)
- [ ] Task 17: chạy script trên bản copy (không ghi đè gốc), xuất
      trước/sau để Joe duyệt qua `SendUserFile` hoặc admin preview trước khi
      thay ảnh thật trong Storage
- [ ] Task 18: với ảnh không thể cứu bằng hậu kỳ (mờ/thiếu sáng/góc xấu) —
      liệt kê riêng, báo Joe cần chụp lại, không tự ý bỏ qua hay ép xử lý

### Checkpoint 5 (cần Joe duyệt — không tự động apply)
- [ ] Joe xem bộ ảnh trước/sau, chọn ảnh nào thay, ảnh nào chụp lại
- [ ] Ảnh đã duyệt upload lại qua `HeritageGalleryPage.tsx` (dùng chính admin
      vừa xong ở Phase 3/4, kèm location/date)

### Phase 6: About Us — bổ sung ảnh + tọa độ vào bài đã có
- [ ] Task 19: `FounderStory.tsx` — thêm 1 khối ảnh (dùng 2-3 ảnh vườn đã qua
      xử lý Phase 5) + dòng tọa độ `15°12'N 108°18'E, Trà Linh, Nam Trà My,
      Quảng Nam` hiển thị rõ (đã có sẵn `MapPin` icon import, chưa dùng cho
      mục này) — không viết lại nội dung bài, chỉ chèn thêm

### Checkpoint cuối
- [ ] `npm run build` sạch
- [ ] Test tay toàn bộ luồng: admin ngôn ngữ/header-footer/gallery hoạt động,
      trang khách phản ánh đúng, About Us có ảnh + tọa độ
- [ ] Deploy theo skill `deploy-vkd-site` — CHỈ khi Joe yêu cầu rõ ràng

## Rủi ro & giảm thiểu
| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Ảnh vườn gốc chất lượng quá thấp, hậu kỳ không cứu được | Cao — vẫn "không chuyên nghiệp" sau khi làm | Task 15/18: xem ảnh thật trước, báo thẳng nếu cần chụp lại thay vì hứa suông |
| Site_text_overrides thiếu 1 số key khiến admin sửa không thấy hiệu lực | Trung bình | Task 9 chỉ expose đúng các key đã liệt kê ở Kiến trúc, test tay Checkpoint 3 |
| Xóa nhầm ngôn ngữ đang dùng qua migration seed sai | Cao (mất bản dịch) | Task 1 seed đúng 5 ngôn ngữ hiện có, không xóa dòng nào, không viết hàm delete |

## Câu hỏi cần Joe trả lời
- Ảnh vườn sâm hiện tại: có ảnh gốc chất lượng cao chưa qua xử lý không, hay
  đây là toàn bộ ảnh đang có (đã hậu kỳ tệ từ trước)? Cần xem ảnh gốc trước
  khi cam kết Phase 5 làm được tới đâu.
- Header/Footer text override (Phase 3 Task 9): chỉ cần bản tiếng Việt, hay
  cần cả 5 ngôn ngữ? (bản kế hoạch này chỉ làm tiếng Việt để giữ scope hợp lý
  — nếu cần đủ 5 ngôn ngữ, đây là việc lớn hơn, nên tách phase riêng)
