# HƯỚNG DẪN TỰ DEPLOY KHI GẶP LỖI (tasamngoclinh.com)

## 1. ĐÂU LÀ BẢN ĐÚNG (source of truth)

CHỈ CÓ 1 THƯ MỤC ĐÚNG để deploy lên domain chính:

```
D:\TA page\site\ta_production\project
```

- KHÔNG deploy từ `D:\TA page\site` (thư mục gốc) — đó là project Next.js "site" (admin dashboard thử nghiệm, KHÔNG PHẢI trang live).
- `ta_production\project` là project Vite, tên trên Vercel là **"ta"**.
- Sản phẩm nằm ở `ta_production/project/public/products-seo.json` (tự sinh khi build, đừng sửa tay).

## 2. BACKUP CHUẨN

- **Git tag** (khôi phục nhanh, có lịch sử):
  ```bash
  cd "D:\TA page\site\ta_production\project"
  git tag backup-YYYYMMDD
  ```
  Xem lại các bản backup: `git tag | grep backup`
  Khôi phục về 1 bản: `git checkout backup-YYYYMMDD` (rồi build + deploy lại)

- **File zip** (phòng khi máy hỏng / mất git):
  ```
  D:\TA page\site\backups\ta_production_backup_YYYYMMDD.zip
  ```
  Chứa toàn bộ source code (trừ node_modules, dist, .git). Muốn khôi phục: giải nén đè vào `ta_production/project`, chạy `npm install` rồi build lại.

  **Tạo bản zip mới bất cứ lúc nào:**
  ```bash
  cd "D:\TA page\site\ta_production\project"
  zip -r -q "D:\TA page\site\backups\ta_production_backup_$(date +%Y%m%d).zip" . -x "node_modules/*" -x "dist/*" -x ".git/*"
  ```

## 3. DEPLOY LẠI (khi trang live bị lỗi)

```bash
cd "D:\TA page\site\ta_production\project"
npm install          # chỉ cần khi vừa restore từ zip hoặc máy mới
npm run build        # tạo thư mục dist/
vercel deploy --prod # đẩy lên production
```

Chờ lệnh chạy xong, sẽ ra dòng `Production https://ta-xxxxx.vercel.app`.

## 4. KIỂM TRA DOMAIN CÓ ĐÚNG PROJECT KHÔNG (bước hay bị quên → gây lỗi như vụ 24/8/2026)

```bash
vercel domains inspect tasamngoclinh.com
```

Xem dòng `Projects` — PHẢI là **`ta`**. Nếu thấy project khác (vd `site`), nghĩa là ai đó vừa deploy nhầm thư mục khác đè domain. Sửa lại:

```bash
cd "D:\TA page\site\ta_production\project"
vercel domains add tasamngoclinh.com ta --force
vercel domains add www.tasamngoclinh.com ta --force
```

## 5. DẤU HIỆU NHẬN BIẾT LỖI "DEPLOY NHẦM PROJECT"

- Trang chủ hiện "Lỗi: Failed to fetch" hoặc màu sắc/slogan lạ (không phải "Bảo Tồn Nguyên Bản").
- Sản phẩm hiện chỉ 1-2 món giả (không phải danh sách thật ~100+ sản phẩm).
- Cách xử lý: làm lại bước 3 + bước 4 ở trên.

## 6. QUY TẮC BẤT DI BẤT DỊCH

- KHÔNG BAO GIỜ chạy `vercel deploy --prod` khi đang đứng ở `D:\TA page\site` (thư mục gốc). Luôn `cd` vào `ta_production/project` trước.
- KHÔNG tự sáng tác script deploy khác — chỉ dùng đúng 3 lệnh ở mục 3.
- Trước khi deploy, luôn tag backup git (mục 2) — 1 dòng lệnh, không tốn thời gian.
