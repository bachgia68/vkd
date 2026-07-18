---
name: vkd-web
description: Use when starting ANY work on the VKD Group website project (this repo) - orientation hub covering tech stack, environment gotchas, deployment, and which sub-skill to use (products, PayOS payments, admin mock data, deploying, or feature-status audit).
---

# VKD Group Website - skill tong

## Du an nay la gi
- Nen tang thuong mai dien tu cua VKD Group (Sam Ngoc Linh Viet Nam): React 19 + TypeScript + Vite + Tailwind, thanh toan qua PayOS (VietQR), trien khai tren Netlify.
- Repo: `bachgia68/vkd` (remote `origin`, nhanh `main`). Site song: `https://vkd-nature-storefront.netlify.app`.
- Trang khach hang: `src/App.tsx` + `src/components/*`. Cong quan tri noi bo: `src/admin/*` (mat khau demo - xem `manage-admin-mockdata`).
- CHUA co database that (xem `vkd-feature-audit`) - moi thu ngoai `src/data/vkdProducts.ts` (san pham that) deu la state/mock trong trinh duyet, mat khi tai lai trang.

## Chon skill con theo viec can lam
- Them/sua/xoa san pham that (dong bo tu samngoclinhvkdgroup.com) -> `update-vkd-products`
- Debug/kiem tra luong thanh toan PayOS (VietQR), webhook, form checkout -> `manage-payos-checkout`
- Sua noi dung/so lieu mau trong cong quan tri (7 phan he) -> `manage-admin-mockdata`
- Build, kiem tra, commit, push de Netlify tu deploy -> `deploy-vkd-site`
- Can bao cao tinh nang nao da xong/dang do (vd. cho chu shop) truoc khi khang dinh mot tinh nang "da xong" -> `vkd-feature-audit`

## Moi truong (doc truoc khi dung vao repo - do mat thoi gian debug lai)
- Duong dan project chua dau tieng Viet: `...\VKD\site\project-bolt-sb1-hravyvsn.10.7\project`. KHONG tu go lai "Tai lieu" trong path tuyet doi - o dia co 2 dang chuan hoa Unicode trung ten hien thi, go tay de trung ban sao rong va gay loi ENOENT gia du file ro rang ton tai.
  - Cach ne an toan nhat: dung path NGAN dang 8.3, vd. `C:\Users\DELL\OneDrive\TAILIU~1\VKD\site\PROJEC~1.7\project\...` - dung duoc voi moi cong cu (Read/Edit/PowerShell/git).
  - Hoac: luon `cd`/`Set-Location` bang path TUONG DOI tu cwd da dung san, khong go lai path tuyet doi co dau.
- Bash tool: Grep/Glob dung path tuong doi thi on; Read/Edit/git qua Bash voi path tuyet doi co dau hay loi ENOENT gia - uu tien PowerShell hoac path ngan 8.3 khi nghi ngo.
- Tao FILE MOI trong repo nay: dung PowerShell (`New-Item`, `[System.IO.File]::WriteAllText` voi UTF8 KHONG BOM) - cong cu Write tao file moi doi khi khong dong bo sang filesystem that ma git/npm/vite nhin thay. Sua file co san thi Edit van dung binh thuong.
- Preview dev server qua `preview_start({name: "vkd-dev"})` co the loi moi truong rieng (khong lien quan code) - chay `npm run dev` hoac `npm run preview` nen qua Bash/PowerShell roi `preview_start({url: "http://localhost:<port>"})` de mo trong Browser pane thay the.
- May nay KHONG co LibreOffice/pandoc - neu can xuat PDF tu .docx, dung Word COM automation qua PowerShell (`SaveAs` voi `wdFormatPDF = 17`), dung ma soffice.py mac dinh cua skill docx se loi tren Windows nay.
- Git identity da cau hinh san trong repo, khong can set lai.