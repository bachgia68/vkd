# Phase 1 — Ép Gemini viết dựa trên nghiên cứu thật (không bịa số liệu)

Ngày: 2026-08-10. Thực hiện theo đề xuất Phase 1 đã được chú duyệt ("phải an
toàn"). Không đụng credential/token nào — chỉ thêm 1 bước tra cứu thật vào
TRƯỚC node "prompt" trong workflow n8n `Sam Ngoc Linh VKD - Auto CMS`
(`localhost:5678/workflow/BcMAh4e0xYXG9bR4`, xem cấu trúc 9 node hiện tại ở
`HANDOFF_NEXT_SESSION.md`).

Em không có kết nối trực tiếp tới n8n Docker của chú trong phiên này (không
có MCP tool n8n), nên phần "sửa workflow" dưới đây là **spec để chú tự dán
vào n8n UI** — không phải thay đổi đã áp dụng.

## 1. Ngân hàng trích dẫn thật cho MR2 (đã tra PubMed thật, có DOI kiểm chứng được)

Dùng bộ này làm "grounding context" mặc định khi chủ đề bài viết là MR2/hoạt
chất — dán thẳng vào node prompt, không để Gemini tự nghĩ ra số liệu.

According to PubMed:

1. Kháng viêm (ức chế NF-κB, TNF-α, IL-1 trên đại thực bào) — Jeong et al.,
   *Int Immunopharmacol* 2015. [DOI](https://doi.org/10.1016/j.intimp.2015.07.025)
2. Bảo vệ gan (ức chế apoptosis tế bào gan do TNF-α/D-GalN) — Tran et al.,
   *Planta Med* 2002. [DOI](https://doi.org/10.1055/s-2002-32069)
3. Ức chế alpha-glucosidase (hỗ trợ kiểm soát đường huyết), định lượng
   LC-MS/MS chuẩn — Dang et al., *Nat Prod Res* 2024. [DOI](https://doi.org/10.1080/14786419.2024.2429124)
4. Hoạt tính chống ung thư giai đoạn khởi phát (mô hình gan/da chuột) —
   Konoshima et al., *Cancer Lett* 1999. [DOI](https://doi.org/10.1016/s0304-3835(99)00257-8)
   và *Biol Pharm Bull* 1998. [DOI](https://doi.org/10.1248/bpb.21.834)
5. Lên men tăng hàm lượng MR2 479→649 mg/L, tăng hoạt tính chống oxy hoá —
   Nguyen et al., *Food Res Int* 2025. [DOI](https://doi.org/10.1016/j.foodres.2025.116275)

Mỗi claim khoa học trong bài phải trỏ về đúng 1 trong các nguồn này (hoặc
nguồn mới do bước tra cứu tự động ở mục 2 trả về) — không dùng câu mơ hồ
kiểu "nghiên cứu ghi nhận" mà không có DOI đi kèm.

## 2. Node mới cần thêm vào n8n (đặt giữa Webhook và node "prompt" hiện có)

**Tên node:** `Tra Cuu PubMed That`
**Loại:** HTTP Request (không cần API key — PubMed E-utilities free)
**Method:** GET
**URL:**
```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=5&sort=relevance&term={{ encodeURIComponent($json.topic_keyword_en) }}
```
`topic_keyword_en` = từ khoá tiếng Anh tương ứng với `angle` param đã có
(vd: `angle=mr2` → `"Majonoside R2 Panax vietnamensis"`).

**Node tiếp theo:** `Lay Abstract` (HTTP Request thứ 2, dùng `efetch.fcgi`
với danh sách PMID vừa lấy, `rettype=abstract&retmode=text`) → nối
abstract text vào field mới `real_research_context`.

**Sửa node "prompt" hiện có:** thêm đoạn sau vào đầu prompt template:
```
DỮ LIỆU NGHIÊN CỨU THẬT (chỉ được trích dẫn từ đây, không tự bịa số liệu
hay tên nghiên cứu khác):
{{ $json.real_research_context }}

Nếu dữ liệu trên không đủ để trả lời góc bài viết, hãy viết "chưa có đủ
bằng chứng công bố" thay vì tự sáng tác.
```

## 3. Việc chú cần làm (AI không tự đăng nhập n8n thay được)

1. Mở `localhost:5678/workflow/BcMAh4e0xYXG9bR4`.
2. Thêm 2 node HTTP Request theo spec mục 2, nối giữa Webhook và node prompt.
3. Sửa nội dung node prompt: chèn đoạn "DỮ LIỆU NGHIÊN CỨU THẬT" ở trên vào
   đầu template hiện có.
4. Test bằng topic MR2 trước (đã có sẵn ngân hàng trích dẫn ở mục 1 để đối
   chiếu kết quả PubMed trả về có khớp không).
5. Publish lại workflow sau khi test pass.

## 4. Không làm trong Phase 1 (để dành Phase 2/3 sau)

- Chưa đụng node Facebook/token (đang hoạt động, không sửa để tránh gãy).
- Chưa thêm Blotato hay bên thứ 3 nào khác — cần chú tự quyết mức tin tưởng
  trước khi AI động vào phân phối đa kênh.
- Chưa tự động hoá việc chọn `angle`/chủ đề — vẫn theo luân phiên 8 trụ hiện
  tại, chỉ thêm bước kiểm chứng thật cho mỗi lần chạy.
