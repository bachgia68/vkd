---
name: brand-ta-guard
description: Use before touching any customer-facing text (components, pages, i18n, index.html) or when asked to hide/remove supplier names - explains the Branded House rule for this site and the automated guard that enforces it.
---

# Brand TA - khong lo ten NCC ra UI khach hang

## Kien truc thuong hieu (da chot, khong hoi lai)
- Frontend khach hang = 100% brand **TA**. Khong bao gio hien ten Nha Cung Cap (VKD,
  TRIMICO, Triet Minh, Vo Kim Duong...) trong text, alt image, menu, breadcrumb,
  hotline label ma khach hang nhin thay.
- Backend/admin (`src/admin/*`, `src/data/*`) DUOC PHEP giu ten NCC that va SKU
  dang `VKD-0xx` de phan loai don hang, kho, van don - day la mo hinh dung
  (Branded House o frontend, da NCC o backend, giong Amazon/Sephora/Shopee Mall).
- Khong chia menu/route rieng theo ten NCC. Dieu huong theo nhu cau/dang san pham,
  khong theo "chợ" NCC.

## Automation da wire san
- `scripts/check-no-supplier-names.js` quet `src/components`, `src/pages`,
  `index.html`, va nhan hien thi trong `src/i18n/translations.ts` de tim
  VKD / TRIMICO / Triet Minh / Vo Kim Duong lo ra text khach hang thay.
- Da wire vao `npm run build` qua `prebuild` (package.json) - build se FAIL neu
  co vi pham moi. Chay rieng: `npm run check:brand`.
- Dong comment ky thuat noi bo (khong phai text khach hang) duoc phep neu them
  marker `supplier-guard-allow` cuoi dong.
- Script CO CHU DICH tru: DOM id (`id="trimico-catalog"`), route/slug kebab-case
  (`'trimico-product-detail'`), khai bao type (`trimico: string;`) - day la ID
  ky thuat, khong phai nhan hien thi.

## Khi sua/them component moi
1. Neu can nhac den nha cung cap trong text hien thi -> luon thay bang "TA".
2. Neu can id/route/slug ky thuat co chua tu "trimico"/"vkd" -> OK giu nguyen,
   guard se tu bo qua (kebab-case adjacency).
3. Sau khi sua, chay `npm run check:brand` truoc khi build/commit.
