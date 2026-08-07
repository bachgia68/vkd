---
name: update-vkd-products
description: Use when the user asks to add, update, remove, or re-sync VKD's product catalog (sam Ngoc Linh products) from the live site samngoclinhvkdgroup.com, edit src/data/products.ts or vkdProducts.ts, or sync the real catalog to the Supabase admin "Sản phẩm & Kho" page.
---

# Cap nhat san pham VKD

Skill nay dung khi can them / sua / xoa / dong bo lai danh muc san pham that cua VKD Group.

## Nguon du lieu that (KHONG bia)

- Trang danh muc: `https://samngoclinhvkdgroup.com/san-pham/` va 4 trang con:
  `danh-muc-san-pham/du-18-tuoi/ruou-ngoc-de/`, `.../chua-du-18-tuoi/nuoc-tang-luc/`,
  `.../chua-du-18-tuoi/thuc-pham-bo-sung/`, `.../chua-du-18-tuoi/my-pham-pns/`.
- Moi san pham: lay ten, gia, thanh phan, mo ta, huong dan dung, canh bao, xuat xu **nguyen van**
  tu trang chi tiet goc (WebFetch tung URL san pham).
- San pham ghi "Het hang" tren trang goc thi **loai khoi** `vkdProducts.ts` (xem comment dau file
  de biet danh sach SKU da loai truoc do va ly do).
- Khong tu dat `rating`/`reviews` - day la field cu da bo khoi UI (khong con component nao render
  no), de giu tuong thich type thi set `rating: 0, reviews: 0`, tuyet doi khong bia so nhu "5.0 . 175
  danh gia" da tung bi go bo.

## Kien truc du lieu hien tai (cap nhat 2026-08-07 — QUAN TRONG, khac ban dau)

- `src/data/products.ts` la catalog THAT DUY NHAT ma trang khach hang doc (mang `products:
  Product[]`, hien ~90 SKU tu 3 NCC: VKD-0xx, TRM-0xx/trimico, SK5-00x/samk5). Day la file can sua
  khi them/sua/xoa san pham hien thi cho khach — KHONG con la `vkdProducts.ts` don le nhu mo ta cu
  ben duoi (file do van ton tai lam "backend reference" rieng cho NCC VKD nhung khong con la nguon
  catalog thuc te).
- Moi NCC co 1 file backend rieng cung pattern (`trimicoProducts.ts`, `samk5Products.ts`, ...) —
  chi de tham chieu/note noi bo, KHONG duoc doc boi UI. Entry that van phai them thu cong vao
  `products.ts` (script `migrate-to-unified-products.mjs` chi doc `vkdProducts.ts` +
  `trimicoProducts.ts`, KHONG tu dong doc NCC thu 3/4 tro di).
- `supplierId` tren moi Product la NOI BO CHI, khong bao gio hien thi cho khach (Branded House —
  moi thu khach thay deu la thuong hieu "TA"). `scripts/check-no-supplier-names.js` chan tu NCC lo
  ra UI — them pattern vao `BANNED_PATTERNS` khi onboard NCC moi.
- Quy trinh onboard 1 NCC MOI (da kiem chung that qua samk5, xem chi tiet trong
  `HANDOFF_NEXT_SESSION.md` muc "Con NCC khac chua them"): (1) hoi Joe xac nhan day la NCC moi, (2)
  them pattern cam ten NCC do vao `BANNED_PATTERNS`, (3) tao file `<tenNCC>Products.ts` theo
  pattern `samk5Products.ts`, (4) them entry thu cong vao `products.ts`, (5) tai anh that ve
  `public/products/<tenNCC>/`, (6) `npm run check:brand && npx tsc -b && npm run build`.

## File can sua (san pham cu tu vkdProducts.ts — van dung neu chi sua NCC VKD)

- `src/data/vkdProducts.ts` - mang `vkdProducts: VKDProduct[]`. Moi san pham can: `sku` (tang dan
  `VKD-0xx`), `slug` (dung slug tren site goc de `sourceUrl` khop), `name`, `price` (VND, so
  nguyen), `image`, `category` (1 trong 4 `CategoryId`), `activeIngredient`, `description`,
  `ingredients`/`volume`/`benefits`/`warnings`/`origin` (tuy san pham co hay khong), `sourceUrl`.
  **Sua file nay xong van phai dong bo entry tuong ung sang `products.ts`** (xem muc kien truc o
  tren) — khong tu dong, phai lam tay/Edit.
- Anh san pham: tai ve `public/products/` (dat ten `NN-slug.png` theo dung so thu tu dang dung),
  KHONG dung anh Unsplash/stock - phai la anh that cua san pham do.
- Neu them/xoa category, cap nhat luon mang `categories` o dau file.

## Quy trinh

1. WebFetch trang danh muc lien quan de lay danh sach san pham + trang thai con hang/het hang.
2. WebFetch tung trang chi tiet san pham can them/cap nhat de lay day du thong tin that.
3. Tai anh san pham that ve `public/products/` (hoac `public/products/<tenNCC>/` cho NCC khong phai
   VKD).
4. Sua `src/data/vkdProducts.ts` (NCC VKD) hoac them entry vao `src/data/products.ts` truc tiep
   (NCC khac) bang Edit (khong viet lai toan bo file).
5. Chay `npm run check:brand && npx tsc -b && npm run build` de bat loi type/brand-leak truoc khi
   xem tren trinh duyet.
6. Mo preview (`npm run preview -- --port 4173 --strictPort` chay nen, roi mo
   `http://localhost:4173`) va kiem tra san pham moi/sua hien thi dung o trang danh muc lan trang
   chi tiet.
7. **Dong bo sang Supabase de trang admin "San pham & Kho" (`/gate-vkd-control-2026/products`) thay
   dung** — xem muc "Dong bo Supabase admin" ben duoi. BUOC NAY TRUOC LA HAY BO QUA (gay ra gap
   kien truc phat hien 2026-08-07: 6 san pham samk5 hien dung tren site khach nhung khong hien
   trong trang quan tri kho vi bang `products` tren Supabase khong duoc cap nhat theo).
8. Commit + push len `https://github.com/bachgia68/vkd` (remote `origin`, nhanh `main`) voi message
   mo ta ro da them/sua/xoa san pham nao.

## Dong bo Supabase admin (BUOC MOI — bat buoc moi lan sua products.ts)

Trang admin "San pham & Kho" (`ProductsPage.tsx`) doc tu bang Supabase `products` (project
`xcwirgrlnibnjmseglee`, "Vkd web Project") — HOAN TOAN TACH BIET voi `src/data/products.ts` (catalog
that khach hang thay). Sua `products.ts` khong tu dong cap nhat bang nay — phai chay sync tay.

- Bang `products` (Supabase) co cot: `sku` (UNIQUE), `name_vi`, `category_id` (FK ->
  `product_categories`), `price_vnd`, `image_url`, cong voi 2 cot **CHI ADMIN QUAN LY, KHONG BAO
  GIO GHI DE**: `active`, `stock_qty` (day la du lieu ton kho that cua admin, khac hoan toan
  catalog content).
- `product_categories` hien chi co 3 dong: `nuoc-sam`(id 6) / `tpbs`(id 7) / `mypham`(id 8) — la
  danh muc THO cho admin, khac 7 `ProductTypeId` chi tiet trong `productTypes.ts`. Mapping dang
  dung (khong hoan hao 1-1, la quyet dinh hop ly khi thieu category tuong ung, co the doi trong
  admin UI sau): `tra-nuoc-uong-sam`->6, `my-pham-sam`->8, tat ca con lai (`sam-ngam-mat-ong`,
  `sam-cu-tuoi-kho`, `ruou-sam`, `nam-lim-duoc-lieu`, `set-qua-tang`)->7.
- Cach sync: viet script `tsx` tam thoi import `products` tu `./src/data/products` + map
  `CATEGORY_MAP` o tren, generate 1 cau `INSERT ... ON CONFLICT (sku) DO UPDATE SET name_vi =
  EXCLUDED.name_vi, category_id = EXCLUDED.category_id, price_vnd = EXCLUDED.price_vnd, image_url =
  EXCLUDED.image_url` (KHONG dong `active`/`stock_qty` vao SET) roi chay qua Supabase MCP
  `execute_sql` (project_id `xcwirgrlnibnjmseglee`). Vi du that da chay 2026-08-07: 90 san pham,
  xem git log commit "sync: seed Supabase products table from real catalog (Sub-project E)" de xem
  lai script mau (da xoa file scratch sau khi chay, nhung SQL sinh ra con luu trong lich su commit
  message).
- KHONG BAO GIO xoa row trong bang `products` — SKU cu khong con trong catalog (vd. cac VKD-02..08
  dinh dang cu) cu de nguyen, admin tu tay an/active=false neu muon ngung ban.
- Sau khi sync, verify nhanh: `select count(*) from products;` phai >= so SKU trong `products.ts`.

## Luu y moi truong (quan trong, do mat thoi gian debug lai)

- Cong cu Read/Write/Edit/Grep/Glob va cong cu PowerShell/Bash trong phien nay nhin thay HAI
  filesystem khac nhau: sua file co san (Edit) thi dong bo dung sang filesystem that (ma
  git/npm/vite dung), nhung TAO file/thu muc moi bang Write thi KHONG hien ra ben phia
  PowerShell/git. Neu can tao file moi (vd. them 1 skill khac, thay doi launch.json), phai tao
  bang PowerShell (`New-Item`, `[System.IO.File]::WriteAllText` voi UTF8 khong BOM), khong dung
  Write tool cho file moi trong repo nay.
- Duong dan project chua dau tieng Viet (`...\VKD\site\vkd-production\project`).
  Khong bao gio tu go lai doan "Tai lieu" trong path tuyet doi cho PowerShell/Node - de gay loi
  ENOENT gia (do lech chuan hoa Unicode) du file ro rang ton tai. Luon dung `Set-Location` voi path
  **tuong doi** tu thu muc lam viec mac dinh cua phien, hoac cwd da dung san tu lenh truoc.
- Git identity cuc bo da cau hinh san trong repo nay (`user.email`/`user.name`), khong can set lai.
- Khong dung Bash tool trong repo nay (khong resolve duoc path co dau) - luon dung PowerShell.
- Preview server dev qua `preview_start({name: "vkd-dev"})` bi loi moi truong rieng (khong lien quan
  code) - dung cach chay `npm run preview` nen qua PowerShell roi `preview_start({url:
  "http://localhost:4173"})` de mo trong Browser pane thay the.
