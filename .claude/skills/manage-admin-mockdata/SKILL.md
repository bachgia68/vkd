---
name: manage-admin-mockdata
description: Use when editing the VKD admin backend (src/admin/*) - its 7 modules, seed/mock data, or the demo login - and when explaining to stakeholders that admin data is not real yet.
---

# Cong quan tri noi bo VKD (`src/admin`)

## Hien trang (quan trong - dung de ai tuong day la du lieu that)
- Toan bo 7 phan he (`src/admin/pages/*.tsx`: ProductsPage, RevenuePage, CrmErpPage, InventoryQrPage, ShowroomsPage, CmsPage, AgentsPage) doc/ghi vao mot file duy nhat `src/admin/adminMockData.ts` - state chi song trong trinh duyet phien hien tai, mat khi tai lai trang, KHONG lien quan gi toi `src/data/vkdProducts.ts` (danh muc khach hang thay tren site ban hang).
- Dang nhap (`src/admin/AdminAuthContext.tsx`) la mat khau demo kiem tra ngay tren trinh duyet (hang so `DEMO_PASSWORD`), khong phai xac thuc server that - file co comment canh bao ro dieu nay, DUNG go bo canh bao do khi sua.
- Xem day du trang thai tung phan he (da xong/mot phan/ke hoach) -> chay skill `vkd-feature-audit`.

## Khi can sua
- Them du lieu mau moi: sua mang tuong ung trong `adminMockData.ts` (vd. WAREHOUSES, INVENTORY, CUSTOMERS, AGENTS, ARTICLES, CHANNEL_REVENUE, SOCIAL_CAMPAIGNS...).
- Doi mat khau demo: sua `DEMO_PASSWORD` trong `AdminAuthContext.tsx` - van phai noi ro voi nguoi dung day KHONG an toan cho du lieu that (lo ngay trong bundle JS cong khai, ai mo devtools cung doc duoc).
- Muon "bien thanh that" (du lieu luu that, dang nhap that): can mot backend/database that truoc (vd. Supabase) - dung chi noi thang state React vao va tuong da luu, phai co API/DB that phia sau. Xem muc Lo trinh trong bao cao tinh nang gan nhat de biet thu tu uu tien.