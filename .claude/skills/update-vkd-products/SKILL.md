---
name: update-vkd-products
description: Use when the user asks to add, update, remove, or re-sync VKD's product catalog (sam Ngoc Linh products) from the live site samngoclinhvkdgroup.com, or otherwise edit src/data/vkdProducts.ts.
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

## File can sua

- `src/data/vkdProducts.ts` - mang `vkdProducts: VKDProduct[]`. Moi san pham can: `sku` (tang dan
  `VKD-0xx`), `slug` (dung slug tren site goc de `sourceUrl` khop), `name`, `price` (VND, so
  nguyen), `image`, `category` (1 trong 4 `CategoryId`), `activeIngredient`, `description`,
  `ingredients`/`volume`/`benefits`/`warnings`/`origin` (tuy san pham co hay khong), `sourceUrl`.
- Anh san pham: tai ve `public/products/` (dat ten `NN-slug.png` theo dung so thu tu dang dung),
  KHONG dung anh Unsplash/stock - phai la anh that cua san pham do.
- Neu them/xoa category, cap nhat luon mang `categories` o dau file.

## Quy trinh

1. WebFetch trang danh muc lien quan de lay danh sach san pham + trang thai con hang/het hang.
2. WebFetch tung trang chi tiet san pham can them/cap nhat de lay day du thong tin that.
3. Tai anh san pham that ve `public/products/`.
4. Sua `src/data/vkdProducts.ts` bang Edit (khong viet lai toan bo file).
5. Chay `npm run build` de bat loi type truoc khi xem tren trinh duyet.
6. Mo preview (`npm run preview -- --port 4173 --strictPort` chay nen, roi mo
   `http://localhost:4173`) va kiem tra san pham moi/sua hien thi dung o trang danh muc lan trang
   chi tiet.
7. Commit + push len `https://github.com/bachgia68/vkd` (remote `origin`, nhanh `main`) voi message
   mo ta ro da them/sua/xoa san pham nao.

## Luu y moi truong (quan trong, do mat thoi gian debug lai)

- Cong cu Read/Write/Edit/Grep/Glob va cong cu PowerShell/Bash trong phien nay nhin thay HAI
  filesystem khac nhau: sua file co san (Edit) thi dong bo dung sang filesystem that (ma
  git/npm/vite dung), nhung TAO file/thu muc moi bang Write thi KHONG hien ra ben phia
  PowerShell/git. Neu can tao file moi (vd. them 1 skill khac, thay doi launch.json), phai tao
  bang PowerShell (`New-Item`, `[System.IO.File]::WriteAllText` voi UTF8 khong BOM), khong dung
  Write tool cho file moi trong repo nay.
- Duong dan project chua dau tieng Viet (`...\VKD\site\project-bolt-sb1-hravyvsn.10.7\project`).
  Khong bao gio tu go lai doan "Tai lieu" trong path tuyet doi cho PowerShell/Node - de gay loi
  ENOENT gia (do lech chuan hoa Unicode) du file ro rang ton tai. Luon dung `Set-Location` voi path
  **tuong doi** tu thu muc lam viec mac dinh cua phien, hoac cwd da dung san tu lenh truoc.
- Git identity cuc bo da cau hinh san trong repo nay (`user.email`/`user.name`), khong can set lai.
- Khong dung Bash tool trong repo nay (khong resolve duoc path co dau) - luon dung PowerShell.
- Preview server dev qua `preview_start({name: "vkd-dev"})` bi loi moi truong rieng (khong lien quan
  code) - dung cach chay `npm run preview` nen qua PowerShell roi `preview_start({url:
  "http://localhost:4173"})` de mo trong Browser pane thay the.