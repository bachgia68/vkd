---
name: vkd-feature-audit
description: Use when asked for a status report of what is built vs mock vs planned on the VKD Group website (e.g. for the business owner), or before claiming any feature is "done" - regenerates an honest, code-verified feature audit instead of guessing.
---

# Audit trang thai tinh nang VKD (da xong / mot phan / ke hoach)

## Nguyen tac
- KHONG suy doan trang thai tu ten component - phai doc code that (tim mock data, TODO, `disabled`, `comingSoon`, `url: '#'`, gia tri hardcode co dinh...).
- Dung nhat quan 3 nhan: **Da hoan thien** (du lieu that, khong can lam them) / **Mot phan** (giao dien + logic chay duoc nhung thieu du lieu/he thong that) / **Ke hoach** (moi co giao dien minh hoa, phan loi chua xay).
- Bao cao gan nhat (18/07/2026) da publish dang Artifact HTML + xuat `.docx`/`.pdf` gui truc tiep cho nguoi dung.

## Cach audit lai (khi code thay doi dang ke)
1. Ra tung file trong `src/components/*`, `src/admin/pages/*`, `netlify/functions/*` - voi moi tinh nang, tim bang chung cu the (doan code/dong lenh), khong chi doc ten bien roi doan.
2. Dau hieu can kiem tra: co noi `adminMockData.ts`/`mockData.ts` khong (-> Mot phan/Ke hoach), co comment `TODO`/tu nhan chua xong khong, co nut bam khong co `onClick` that khong, co `url: '#'` khong, so lieu co la literal co dinh trong code khong.
3. Grep toan repo `supabase|database|prisma|postgres|mongodb|firebase` de xac nhan da co backend that chua - lan audit gan nhat: KHONG co, moi thu ngoai `vkdProducts.ts` song trong React state/context, mat khi tai lai trang.
4. So sanh voi site cu `samngoclinhvkdgroup.com` bang WebFetch neu can doi chieu - site cu (tai thoi diem audit): chi Tieng Viet/VND, dat hang qua goi dien/email thu cong, khong co QR thanh toan tu dong, khong loyalty/autoship/truy xuat nguon goc/cong quan tri rieng.
5. Dung lai bao cao theo cau truc: Tong quan so sanh -> Chi tiet giao dien khach hang -> Chi tiet giao dien quan tri -> Lo trinh tiep theo (uu tien viec nao mo khoa nhieu tinh nang khac nhat truoc, thuong la "co database that").
6. Xuat file: uu tien Artifact HTML (bang mau trang thai, xem skill artifact-design) + `.docx`/`.pdf` qua skill `docx`. May nay KHONG co LibreOffice/pandoc nen script `soffice.py` mac dinh cua skill docx se loi - dung Word COM automation qua PowerShell thay the:
   `$word = New-Object -ComObject Word.Application; $doc = $word.Documents.Open($docxPath); $doc.SaveAs([ref]$pdfPath, [ref]17); $doc.Close(); $word.Quit()` (17 = `wdFormatPDF`).