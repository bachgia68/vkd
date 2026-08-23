# Kênh KOL Sâm Ngọc Linh — Kế hoạch triển khai chi tiết

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng kênh KOL cá nhân chuyên về Sâm Ngọc Linh (persona hybrid: VA cho nội dung ngắn, chú cho nội dung dài), với TA là "hãng ruột" phía sau, đủ uy tín để (1) được các hãng sâm ưu tiên hợp tác/phân phối và (2) mở đường tiếp cận thị trường mỹ phẩm quốc tế.

**Architecture:** Toàn bộ deliverable là tài liệu/nội dung (không phải phần mềm) — thư ngỏ, checklist, kịch bản, tài khoản kênh, lịch đăng — lưu trong `docs/kol-sam-ngoc-linh/`. Mỗi task tạo ra một artifact cụ thể, có thể kiểm tra được, và các artifact về sau (thư ngỏ, kịch bản, kênh) đều tham chiếu tên KOL/checklist đã chốt ở các task đầu.

**Tech Stack:** Namelix, NameSnack, CreatorNameHub, NameCrafter.ai, TubeName Gen (đặt tên) · Canva (nhận diện) · CapCut, Opus Clip (dựng clip) · Rask AI, ElevenLabs (dịch/lồng tiếng) · TikTok Creative Center (nghiên cứu trend) · Metricool (lên lịch đăng) · Mailmeteor (mail merge)

## Global Constraints

- Ngân sách marketing chung dưới 3 triệu VND đến hết 2026 — mọi tool ưu tiên free/freemium; chỉ trả phí khi vượt trội rõ rệt và được chú xác nhận trước.
- Tên KOL và mọi nội dung công khai phải trung lập với TA — không chứa "TA" hay "nhà Khánh".
- Thương hiệu bán hàng nền là **TA** (không dùng "VKD").
- Chuyến đi thực địa dự kiến trong vài tuần tới, chưa chốt ngày — Task 1-8 (Giai đoạn 0) phải xong trước khi chuyến đi diễn ra, không phụ thuộc ngày chính xác.
- Gương mặt KOL phụ (VA) đã có sẵn ảnh/clip tại `D:\TA page\video ban hang\KOL_face.png` và `mat VA.jfif` — dùng làm tư liệu tham chiếu, không tạo mới.
- Mọi file deliverable lưu trong `D:\TA page\site\docs\kol-sam-ngoc-linh\`.

---

### Task 1: Chốt tên KOL + bộ nhận diện tối thiểu

**Files:**
- Create: `docs/kol-sam-ngoc-linh/01-ten-va-nhan-dien.md`

**Interfaces:**
- Consumes: tiêu chí đặt tên trong spec (`docs/superpowers/specs/2026-08-08-kol-sam-ngoc-linh-design.md`, mục "Quy trình đặt tên & nhận diện KOL")
- Produces: `TEN_KOL` (tên chính thức dùng xuyên suốt), `TAGLINE` (1 câu định vị) — mọi task từ Task 4 trở đi dùng 2 giá trị này trong thư ngỏ/bio/kênh

- [ ] **Bước 1: Chạy 5 tool đặt tên với input chuẩn**

Input đưa vào mỗi tool (Namelix, NameSnack, CreatorNameHub, NameCrafter.ai, TubeName Gen):
- Niche: "Sâm Ngọc Linh / dược liệu chế biến sâu"
- Từ khóa gợi ý: sâm, ngọc linh, dược liệu, thẩm định, núi rừng, saponin
- Tone: đáng tin cậy, gần gũi, có chiều sâu chuyên môn
- Ràng buộc: 2-3 từ, không chứa "TA"/"nhà Khánh"

Ghi lại tối thiểu 15 tên ứng viên vào bảng nháp trong file.

- [ ] **Bước 2: Lọc theo 4 tiêu chí**

Với mỗi tên trong danh sách 15, đánh dấu Đạt/Không đạt:
1. Username còn trống trên TikTok + YouTube + Facebook (kiểm tra thủ công bằng cách gõ URL `tiktok.com/@<ten>`, `youtube.com/@<ten>`, `facebook.com/<ten>`)
2. Không trùng/gây nhầm với KOL dược liệu hiện có: Đông Y Mạnh Phúc Gia, Dược sĩ Phương1, Alo Nhà Thuốc, Bà Lai thảo dược, Cô Sinh thảo dược, Lâm Cỏ, Tuấn Thầy Thuốc
3. Không chứa từ dễ bị TikTok/YouTube gắn cờ vi phạm y/dược ("bác sĩ", "thần dược", "chữa bệnh")
4. Dịch/đọc được sang tiếng Anh ổn (dùng cho thư chào hàng quốc tế ở Task 7)

- [ ] **Bước 3: Chốt 1 tên chính**

Chọn tên đạt cả 4 tiêu chí, ưu tiên tên ngắn nhất, dễ nhớ nhất. Ghi `TEN_KOL` vào đầu file.

- [ ] **Bước 4: Viết tagline và bio 3 nền tảng**

Viết 1 tagline (dưới 10 từ, ví dụ dạng: "Người thẩm định thật cho Sâm Ngọc Linh thật") và bio riêng cho TikTok (≤80 ký tự), YouTube (≤160 ký tự), Facebook (≤255 ký tự), đều dùng `TEN_KOL` + tagline.

- [ ] **Bước 5: Xác minh & lưu file**

Verification: mở file, xác nhận có đủ `TEN_KOL`, `TAGLINE`, bio 3 nền tảng, và bảng lọc 15 tên với lý do loại. Chú xác nhận chốt tên trước khi dùng ở các task sau.

---

### Task 2: Viết checklist thẩm định chuẩn

**Files:**
- Create: `docs/kol-sam-ngoc-linh/02-checklist-tham-dinh.md`

**Interfaces:**
- Consumes: mục "Checklist thẩm định chuẩn" trong spec
- Produces: `CHECKLIST_THAM_DINH.md` — dùng ở Task 5 (thư ngỏ) và Task 8 (chuẩn bị thực địa)

- [ ] **Bước 1: Viết checklist 6 mục**

```markdown
# Checklist thẩm định hãng sâm

Khi thăm vườn/nhà máy, xin bản sao hoặc chụp ảnh các giấy tờ sau:

1. [ ] Giấy chứng nhận vùng trồng (tên vùng, diện tích, thời gian canh tác)
2. [ ] Phiếu kiểm nghiệm hàm lượng saponin (đặc biệt Majonoside-R2 / MR2)
3. [ ] Chứng nhận GACP-WHO (nếu có)
4. [ ] Chứng nhận HACCP/ISO cho dây chuyền chế biến (nếu có sản phẩm chế biến sâu)
5. [ ] Bảng giá sỉ tham khảo theo từng loại sản phẩm (củ tươi/khô, trà, cao, nước, viên)
6. [ ] Chính sách hợp tác KOL/phân phối (chiết khấu, điều kiện, độc quyền vùng hay không)

Ghi chú tại chỗ: ngày thăm, người tiếp đón, ấn tượng thực tế so với giấy tờ.
```

- [ ] **Bước 2: Lưu file và xác minh**

Verification: file có đủ 6 mục checklist dạng checkbox, có phần "Ghi chú tại chỗ".

---

### Task 3: Viết kịch bản quay 3-clip mẫu

**Files:**
- Create: `docs/kol-sam-ngoc-linh/03-kich-ban-quay-3-clip.md`

**Interfaces:**
- Consumes: `TEN_KOL`, `TAGLINE` (Task 1); 5 content pillars trong spec
- Produces: kịch bản dùng lặp lại cho mỗi hãng ở Giai đoạn 1 (Task 8)

- [ ] **Bước 1: Viết kịch bản Clip 1 — Tại vườn**

```markdown
## Clip 1: Tại vùng trồng (60-90s, quay bởi chú)

Mở đầu (0-10s): Đứng giữa vườn sâm, nói: "Hôm nay tôi có mặt tại [tên vùng] —
vùng trồng của [tên hãng]. Đi thực tế mới thấy trồng được củ sâm Ngọc Linh
chuẩn nó gian nan thế nào."

Thân (10-60s): Quay cận cảnh cây sâm, tán rừng che, hỏi người trồng/chủ hãng
3 câu: (1) Sâm trồng bao nhiêu năm mới thu hoạch? (2) Độ cao và điều kiện đất
ở đây có gì đặc biệt? (3) Khó khăn lớn nhất khi trồng sâm ở đây là gì?

Kết (60-90s): Chốt 1 câu nhận định thật của chú về vùng trồng (khen thật/
góp ý thật, không tâng bốc quá đà).
```

- [ ] **Bước 2: Viết kịch bản Clip 2 — So sánh kiến thức**

```markdown
## Clip 2: So sánh vùng miền (45-60s, quay bởi chú, dựng ngắn cho VA)

Mở đầu: "Rất nhiều người hỏi tôi Sâm Lai Châu hay Sâm Nghệ An có tốt không?
Tốt chứ! Nhưng giá nó khác hoàn toàn Sâm Ngọc Linh chuẩn Kon Tum/Quảng Nam."

Thân: Cầm củ sâm thật tại vườn, chỉ 2-3 đặc điểm nhận dạng (vân củ, màu,
mùi) để phân biệt vùng trồng — dựa trên thông tin thật từ hãng, không suy
đoán.

Kết: "Giá khác vì vùng khác, không phải vì sâm nào giả sâm nào thật — cả
hai đều là sâm quý, chỉ khác mức giá."
```

- [ ] **Bước 3: Viết kịch bản Clip 3 — Tại nhà máy chế biến**

```markdown
## Clip 3: Tại nhà máy chế biến sâu (60-90s, quay bởi chú)

Mở đầu: "Củ sâm tươi đắng ngắt, khó uống, chủ yếu nam giới ngâm rượu. Nhưng
để làm ra trà, cao, nước sâm cho phụ nữ và người già dùng được, nhà máy phải
đạt chuẩn thế này."

Thân: Quay dây chuyền chế biến (nếu hãng cho phép), hỏi 1 câu về quy trình
đạt chuẩn GACP-WHO/HACCP nào đang áp dụng.

Kết: Nếm thử 1 sản phẩm chế biến sâu tại chỗ, đưa ra nhận xét thật (kể cả
điểm chưa ưng, ví dụ "hơi ngọt so với tôi" nếu đúng vậy).
```

- [ ] **Bước 4: Lưu file và xác minh**

Verification: file có đủ 3 kịch bản, mỗi kịch bản có mở đầu/thân/kết cụ thể, không có chỗ nào ghi "nói gì đó" chung chung.

---

### Task 4: Lập danh sách ưu tiên liên hệ hãng trong nước

**Files:**
- Create: `docs/kol-sam-ngoc-linh/04-danh-sach-hang-trong-nuoc.md`

**Interfaces:**
- Consumes: 3 hãng đã nêu trong spec
- Produces: bảng danh sách dùng ở Task 5 (gửi thư ngỏ) và Task 15 (mở rộng)

- [ ] **Bước 1: Lập bảng 6 hãng ưu tiên**

```markdown
# Danh sách hãng ưu tiên liên hệ

| # | Tên hãng | Khu vực | Kênh liên hệ đã biết | Trạng thái | Ghi chú |
|---|----------|---------|----------------------|------------|---------|
| 1 | Công ty CP Dược liệu Trà Linh | Nam Trà My, Quảng Nam | (điền khi tra cứu) | Chưa liên hệ | Trồng cả sâm quy, đương quy, sâm dây Ngọc Linh |
| 2 | Ca Nam | Kon Tum | (điền khi tra cứu) | Chưa liên hệ | Chú đã đề cập trực tiếp |
| 3 | Vĩnh Khang Đạt | Kon Tum | (điền khi tra cứu) | Chưa liên hệ | Chú đã đề cập trực tiếp |
| 4 | (HTX sâm Ngọc Linh dự phòng #1) | Kon Tum/Quảng Nam | (điền khi tra cứu) | Chưa xác định | Tìm qua fanpage/hội nhóm sâm |
| 5 | (HTX sâm Ngọc Linh dự phòng #2) | Kon Tum/Quảng Nam | (điền khi tra cứu) | Chưa xác định | Tìm qua fanpage/hội nhóm sâm |
| 6 | (Hãng anh Khánh đang hợp tác) | (điền) | Đã có quan hệ qua chú | Đang trao đổi | Ưu tiên bám sát theo gợi ý trong hội thoại gốc |
```

- [ ] **Bước 2: Điền kênh liên hệ thực tế**

Với hãng #1-3, tra cứu fanpage Facebook chính chủ hoặc website (nếu có), điền cột "Kênh liên hệ đã biết". Với hãng #4-5, tìm qua từ khóa "sâm Ngọc Linh Kon Tum" / "sâm Ngọc Linh Quảng Nam" trên Facebook/Google, chọn 2 hãng có fanpage hoạt động thật (có bài đăng trong 30 ngày gần nhất).

- [ ] **Bước 3: Lưu file và xác minh**

Verification: bảng có đủ 6 dòng, tối thiểu 3 hãng có kênh liên hệ điền cụ thể (không để trống "(điền khi tra cứu)").

---

### Task 5: Soạn thư ngỏ mẫu gửi hãng trong nước

**Files:**
- Create: `docs/kol-sam-ngoc-linh/05-thu-ngo-mau.md`

**Interfaces:**
- Consumes: `TEN_KOL` (Task 1), `CHECKLIST_THAM_DINH` (Task 2), danh sách hãng (Task 4)
- Produces: mẫu thư dùng trong Mailmeteor ở Task 6

- [ ] **Bước 1: Viết mẫu thư ngỏ**

```markdown
# Mẫu thư ngỏ gửi hãng sâm

Chủ đề: Đề nghị thăm vùng trồng — hợp tác phân phối Sâm Ngọc Linh

Kính gửi {{ten_hang}},

Tôi là {{TEN_KOL}}, hiện đang xây dựng kênh truyền thông chuyên về Sâm Ngọc
Linh, với tệp khách hàng quan tâm đến sản phẩm sâm chất lượng cao — cả củ
tươi và sản phẩm chế biến sâu.

Trước khi đưa bất kỳ sản phẩm nào vào giới thiệu với khách hàng của mình,
tôi luôn thẩm định trực tiếp tại vùng trồng và nhà máy chế biến. Tôi mong
được xin phép:

1. Thăm vùng trồng và nhà máy của {{ten_hang}} trong thời gian tới
2. Xem giấy tờ chứng nhận vùng trồng, phiếu kiểm nghiệm saponin, và các
   chứng nhận liên quan (nếu có)
3. Trao đổi về khả năng hợp tác phân phối lâu dài

Rất mong nhận được phản hồi để sắp xếp lịch phù hợp.

Trân trọng,
{{TEN_KOL}}
{{so_dien_thoai_lien_he}}
```

- [ ] **Bước 2: Lưu file và xác minh**

Verification: thư có đủ 3 điểm yêu cầu, dùng biến `{{ten_hang}}` và `{{TEN_KOL}}` đúng định dạng mail-merge của Mailmeteor (2 dấu ngoặc nhọn).

---

### Task 6: Gửi thư ngỏ hàng loạt qua Mailmeteor

**Files:**
- Modify: `docs/kol-sam-ngoc-linh/04-danh-sach-hang-trong-nuoc.md` (cập nhật cột Trạng thái)

**Interfaces:**
- Consumes: mẫu thư (Task 5), danh sách hãng (Task 4)
- Produces: cột "Trạng thái" cập nhật "Đã gửi" — dùng để theo dõi ở Task 14

- [ ] **Bước 1: Cài Mailmeteor add-on cho Gmail**

Vào Google Workspace Marketplace, tìm "Mailmeteor", cài vào tài khoản Gmail dùng để liên hệ hãng.

- [ ] **Bước 2: Tạo Google Sheet nguồn dữ liệu**

Tạo sheet với 2 cột `ten_hang`, `email` (hoặc để trống nếu gửi qua Zalo/Facebook thay vì email — xem Bước 4).

- [ ] **Bước 3: Dán mẫu thư vào Gmail draft và chạy mail merge**

Copy nội dung Task 5 vào 1 email nháp trong Gmail, mở Mailmeteor, chọn sheet nguồn, ánh xạ biến `{{ten_hang}}`, gửi thử 1 email cho chính mình để kiểm tra trước khi gửi hàng loạt.

- [ ] **Bước 4: Gửi thủ công qua Zalo/Facebook cho hãng không có email công khai**

Với hãng chỉ có fanpage Facebook (không có email), copy nội dung thư ngỏ, thay `{{ten_hang}}` bằng tên thật, gửi qua tin nhắn Fanpage hoặc Zalo.

- [ ] **Bước 5: Cập nhật trạng thái và xác minh**

Verification: mở lại `04-danh-sach-hang-trong-nuoc.md`, xác nhận tối thiểu 3 hãng có trạng thái "Đã gửi" kèm ngày gửi.

---

### Task 7: Lập danh sách nhà trưng bày/hãng mỹ phẩm quốc tế mục tiêu

**Files:**
- Create: `docs/kol-sam-ngoc-linh/07-danh-sach-quoc-te.md`

**Interfaces:**
- Consumes: track quốc tế hóa trong spec (in-cosmetics Global, Cosmetics 360 Đức)
- Produces: danh sách dùng ở Task 8 (thư chào hàng quốc tế)

- [ ] **Bước 1: Lập bảng nhà trưng bày mục tiêu**

```markdown
# Danh sách hãng mỹ phẩm quốc tế mục tiêu

| # | Tên hãng/hội chợ | Ngách quan tâm | Nguồn danh sách | Trạng thái |
|---|-------------------|-----------------|------------------|------------|
| 1 | in-cosmetics Global (danh sách nhà trưng bày) | Nguyên liệu chống lão hóa, chống sạm da | Website chính thức in-cosmetics Global, mục "Exhibitor list" | Chưa lấy danh sách |
| 2 | Cosmetics 360 (Đức) | Nguyên liệu thiên nhiên, chiết xuất thực vật | Website chính thức hội chợ | Chưa lấy danh sách |
| 3-10 | (điền tên hãng cụ thể sau khi lấy exhibitor list) | | | |
```

- [ ] **Bước 2: Truy cập exhibitor list và điền 8 hãng cụ thể**

Vào website chính thức của in-cosmetics Global và Cosmetics 360, tìm mục danh sách nhà trưng bày (exhibitor list/directory), lọc theo từ khóa "natural extract", "anti-aging", "botanical", chọn 8 hãng có thông tin liên hệ công khai (email hoặc form liên hệ), điền vào dòng 3-10.

- [ ] **Bước 3: Lưu file và xác minh**

Verification: bảng có tối thiểu 8 hãng cụ thể (không còn dòng "(điền tên hãng cụ thể...)"), mỗi hãng có nguồn danh sách ghi rõ.

---

### Task 8: Soạn thư chào hàng quốc tế (song ngữ)

**Files:**
- Create: `docs/kol-sam-ngoc-linh/08-thu-chao-hang-quoc-te.md`

**Interfaces:**
- Consumes: `TEN_KOL` (Task 1), danh sách quốc tế (Task 7)
- Produces: mẫu thư dùng qua Mailmeteor/Rask AI để gửi

- [ ] **Bước 1: Viết mẫu thư tiếng Anh**

```markdown
# International outreach letter template

Subject: Panax Vietnamensis (Ngoc Linh Ginseng) raw extract — partnership inquiry

Dear {{company_name}} team,

I represent {{TEN_KOL}}, a Vietnam-based channel specializing in Panax
Vietnamensis (Ngoc Linh Ginseng), one of the rarest ginseng species,
grown exclusively in the Ngoc Linh mountain region of Vietnam.

We work directly with certified growers and are building export-ready
documentation (saponin content testing — Majonoside-R2/MR2 — and GACP-WHO
certification where available) for cosmetic-grade raw material and extract
supply, relevant to anti-aging and skin-brightening applications.

We would welcome the opportunity to share samples and documentation for
your team's review, and to discuss a potential supply partnership.

Best regards,
{{TEN_KOL}}
{{contact_email}}
```

- [ ] **Bước 2: Ghi chú quy trình xử lý khi hãng phản hồi**

```markdown
## Khi có phản hồi

1. Xác nhận hãng cần mẫu thật hay chỉ cần hồ sơ giấy tờ trước
2. Liên hệ hãng trong nước tương ứng (Task 4) để xin phiếu test saponin/
   GACP-WHO gửi kèm
3. Nếu hãng cần video giới thiệu bằng tiếng Anh, dùng Rask AI dịch/lồng
   tiếng 1 clip từ Task 12 hoặc Task 13 thay vì quay mới
```

- [ ] **Bước 3: Lưu file và xác minh**

Verification: thư có đủ 3 nội dung (giới thiệu, hồ sơ đang chuẩn bị, đề nghị gửi mẫu), có phần quy trình xử lý phản hồi.

---

### Task 9: Chuẩn bị shot-list & thiết bị cho chuyến thực địa

**Files:**
- Create: `docs/kol-sam-ngoc-linh/09-chuan-bi-thuc-dia.md`

**Interfaces:**
- Consumes: `CHECKLIST_THAM_DINH` (Task 2), kịch bản 3-clip (Task 3), danh sách hãng đã phản hồi (cập nhật từ Task 6)

- [ ] **Bước 1: Viết checklist thiết bị mang theo**

```markdown
# Checklist thiết bị & tài liệu mang theo khi thực địa

Thiết bị:
- [ ] Điện thoại đã sạc đầy + sạc dự phòng
- [ ] Gimbal/tripod mini (nếu có) để quay ổn định cảnh phỏng vấn
- [ ] Micro cài áo không dây (nếu có) — ưu tiên vì tiếng gió ở vùng núi cao

Tài liệu mang theo (in hoặc lưu điện thoại):
- [ ] Bản in checklist thẩm định (Task 2)
- [ ] Bản in/lưu kịch bản 3-clip (Task 3)
- [ ] Danh thiếp/thông tin liên hệ TEN_KOL để gửi lại hãng nếu cần
```

- [ ] **Bước 2: Viết lịch trình mẫu 1 ngày thăm 1 hãng**

```markdown
## Lịch trình mẫu (1 hãng/ngày)

08:00-09:00: Di chuyển tới vườn, chào hỏi, giới thiệu lại mục đích thăm
09:00-10:30: Quay Clip 1 (tại vườn) + xin xem giấy tờ theo checklist
10:30-11:30: Quay Clip 2 (so sánh kiến thức) tại vườn
13:30-15:00: Di chuyển tới nhà máy (nếu khác địa điểm), quay Clip 3
15:00-16:00: Trao đổi hợp tác/phân phối, chụp ảnh giấy tờ còn thiếu
16:00: Cảm ơn, hẹn lịch phản hồi
```

- [ ] **Bước 3: Lưu file và xác minh**

Verification: file có đủ checklist thiết bị và lịch trình mẫu theo khung giờ cụ thể.

---

### Task 10: Thiết lập tài khoản kênh trên 3 nền tảng

**Files:**
- Create: `docs/kol-sam-ngoc-linh/10-thiet-lap-kenh.md`

**Interfaces:**
- Consumes: `TEN_KOL`, `TAGLINE`, bio 3 nền tảng (Task 1)
- Produces: link 3 kênh — dùng ở Task 11 (Metricool) và mọi task đăng nội dung

- [ ] **Bước 1: Tạo tài khoản TikTok**

Đăng ký với username = `TEN_KOL` (đã xác nhận trống ở Task 1), dán bio đã soạn, đặt ảnh đại diện từ `KOL_face.png` (crop vuông) hoặc logo từ Task 1.

- [ ] **Bước 2: Tạo kênh YouTube**

Đăng ký kênh với tên = `TEN_KOL`, dán bio dài, thêm banner đơn giản (có thể tạo nhanh bằng Canva).

- [ ] **Bước 3: Tạo Fanpage Facebook riêng cho KOL**

Tạo fanpage mới (khác với "Vườn sâm Ngọc Linh nhà Khánh") với tên = `TEN_KOL`, dán bio, ghi rõ trong phần giới thiệu là kênh cá nhân thẩm định độc lập.

- [ ] **Bước 4: Ghi lại 3 link kênh và xác minh**

```markdown
# Link kênh chính thức

- TikTok: https://www.tiktok.com/@{{username}}
- YouTube: https://www.youtube.com/@{{username}}
- Facebook: https://www.facebook.com/{{username}}
```

Verification: cả 3 link mở được, hiển thị đúng tên và bio đã soạn ở Task 1.

---

### Task 11: Thiết lập quy trình hậu kỳ Opus Clip → CapCut

**Files:**
- Create: `docs/kol-sam-ngoc-linh/11-quy-trinh-hau-ky.md`

**Interfaces:**
- Consumes: tư liệu thô quay ở Task 9 (thực địa)
- Produces: quy trình dùng lặp lại ở Task 12, Task 13, và mọi đợt nội dung sau này

- [ ] **Bước 1: Viết quy trình từng bước**

```markdown
# Quy trình hậu kỳ: 1 video dài → nhiều clip ngắn

1. Upload video dài (chú quay) lên Opus Clip (gói free: 60 credits/tháng,
   có watermark — đủ dùng cho đợt đầu)
2. Chọn tính năng "ClipAnything" để tự động tìm 5-8 đoạn có tiềm năng viral
   nhất trong video
3. Tải các clip đề xuất về, chọn ra 3-5 clip khớp với content pillar đang
   cần (ưu tiên pillar 3 "So sánh & phân biệt" vì dễ viral nhất)
4. Import các clip đã chọn vào CapCut
5. Trong CapCut: bật phụ đề tự động tiếng Việt, chỉnh sửa lại câu chữ cho
   khớp giọng VA (nếu VA lồng tiếng lại), thêm 1 hook chữ to trong 2 giây
   đầu (ví dụ: "Sự thật về giá Sâm Ngọc Linh mà ít ai nói")
6. Xuất video theo tỷ lệ dọc 9:16, độ phân giải tối thiểu 1080x1920
7. Đặt tên file theo định dạng: `{{pillar_so}}-{{ten-ngan-gon}}-{{ngay}}.mp4`
```

- [ ] **Bước 2: Lưu file và xác minh**

Verification: quy trình có đủ 7 bước, mỗi bước có tên tool/tính năng cụ thể, không có bước mơ hồ kiểu "chỉnh sửa cho đẹp".

---

### Task 12: Thiết lập lịch đăng qua Metricool + khung lịch tuần ra mắt

**Files:**
- Create: `docs/kol-sam-ngoc-linh/12-lich-dang-bai.md`

**Interfaces:**
- Consumes: link 3 kênh (Task 10)
- Produces: khung lịch dùng để sản xuất nội dung ở Task 13, Task 14

- [ ] **Bước 1: Kết nối 3 kênh vào Metricool**

Đăng ký tài khoản Metricool (free tier), kết nối TikTok, YouTube, Facebook đã tạo ở Task 10 qua mục "Connect account".

- [ ] **Bước 2: Viết khung lịch đăng tuần đầu ra mắt**

```markdown
# Khung lịch đăng — Tuần ra mắt

| Ngày | VA (clip ngắn) | Chú (video dài) |
|------|------------------|-------------------|
| T2 | Pillar 3 — So sánh giá vùng miền | — |
| T3 | Pillar 4 — Review sản phẩm chế biến | — |
| T4 | Pillar 1 — Cắt từ clip vườn | Pillar 1 — Video đầy đủ "Thẩm định vườn X" |
| T5 | Pillar 5 — Câu chuyện người trồng | — |
| T6 | Pillar 2 — Bóc tách giấy tờ (bản ngắn) | — |
| CN | Tổng hợp/Q&A từ bình luận tuần trước | — |
```

- [ ] **Bước 3: Nhập lịch vào Metricool và xác minh**

Nhập 6 bài đăng trên vào lịch Metricool cho tuần ra mắt (đặt giờ đăng 19h-21h — khung giờ vàng theo TikTok Creative Center gợi ý cho ngách sức khỏe). Verification: mở lịch Metricool, xác nhận đủ 6 bài đã lên lịch với đúng ngày/kênh.

---

### Task 13: Sản xuất mẻ nội dung ra mắt (8 clip ngắn + 2 video dài)

**Files:**
- Modify: `docs/kol-sam-ngoc-linh/12-lich-dang-bai.md` (bổ sung link nháp từng bài)

**Interfaces:**
- Consumes: tư liệu thực địa (Task 9), quy trình hậu kỳ (Task 11), khung lịch (Task 12)

- [ ] **Bước 1: Dựng 8 clip ngắn theo quy trình Task 11**

Áp dụng quy trình 7 bước ở Task 11 cho tư liệu quay được, ưu tiên phủ đủ cả 5 content pillar (tối thiểu 1 clip/pillar, 3 clip còn lại chọn theo pillar mạnh nhất từ Opus Clip).

- [ ] **Bước 2: Dựng 2 video dài cho chú**

Ghép Clip 1 + Clip 3 (kịch bản Task 3) của cùng 1 hãng thành 1 video dài hoàn chỉnh (5-8 phút) có mở đầu/kết giới thiệu `TEN_KOL`; lặp lại cho hãng thứ 2 nếu có đủ tư liệu.

- [ ] **Bước 3: Gắn từng file vào đúng ô lịch Metricool**

Upload từng clip/video vào đúng ô đã lên lịch ở Task 12.

- [ ] **Bước 4: Xác minh**

Verification: Metricool hiển thị đủ 8 clip ngắn + 2 video dài ở trạng thái "Scheduled", mỗi content pillar (1-5) có ít nhất 1 bài trong mẻ ra mắt.

---

### Task 14: Thiết lập theo dõi hiệu suất tuần

**Files:**
- Create: `docs/kol-sam-ngoc-linh/14-theo-doi-hieu-suat.md`

**Interfaces:**
- Consumes: dữ liệu từ Metricool sau khi nội dung đăng (Task 13)
- Produces: mẫu báo cáo tuần dùng liên tục ở Giai đoạn 3

- [ ] **Bước 1: Viết mẫu báo cáo tuần**

```markdown
# Báo cáo hiệu suất tuần — Mẫu

Tuần: {{tu_ngay}} - {{den_ngay}}

| Nền tảng | Follower mới | View trung bình/clip | Clip/video hiệu suất cao nhất | Pillar hiệu suất cao nhất |
|----------|---------------|------------------------|-------------------------------|------------------------------|
| TikTok | | | | |
| YouTube | | | | |
| Facebook | | | | |

Nhận xét & điều chỉnh tuần tới:
-
-

Phản hồi từ thư ngỏ trong tuần (nếu có):
-
```

- [ ] **Bước 2: Lập lịch điền báo cáo hàng tuần**

Đặt nhắc nhở (Google Calendar hoặc ghi chú) vào mỗi Chủ Nhật để mở Metricool, lấy số liệu, điền vào bản sao mới của mẫu báo cáo, lưu với tên `14-bao-cao-tuan-{{so_tuan}}.md`.

- [ ] **Bước 3: Xác minh**

Verification: mẫu báo cáo có đủ 4 cột số liệu + phần nhận xét + phần theo dõi phản hồi thư ngỏ.

---

### Task 15: Mở rộng danh sách hãng thẩm định thứ 2

**Files:**
- Modify: `docs/kol-sam-ngoc-linh/04-danh-sach-hang-trong-nuoc.md`

**Interfaces:**
- Consumes: kết quả thẩm định 3 hãng đầu (từ Task 9/13), báo cáo hiệu suất (Task 14)

- [ ] **Bước 1: Đánh giá pillar/hãng nào được đón nhận tốt nhất**

Dựa trên 2-3 báo cáo tuần đầu (Task 14), xác định content pillar và hãng nào có view/engagement cao nhất.

- [ ] **Bước 2: Tìm thêm 3-5 hãng cùng đặc điểm với hãng hiệu suất cao nhất**

Tìm qua fanpage/hội nhóm sâm Ngọc Linh, ưu tiên hãng cùng vùng trồng hoặc cùng dòng sản phẩm chế biến sâu với hãng đang được đón nhận tốt.

- [ ] **Bước 3: Bổ sung vào bảng danh sách và gửi thư ngỏ (lặp lại Task 5-6)**

Thêm các hãng mới vào bảng ở Task 4, áp dụng lại mẫu thư Task 5 và quy trình gửi Task 6.

- [ ] **Bước 4: Xác minh**

Verification: bảng danh sách hãng có thêm tối thiểu 3 dòng mới, cột "Trạng thái" cập nhật "Đã gửi" cho các hãng mới.

---

## Self-Review

**Spec coverage:**
- Kiến trúc thương hiệu 2 lớp/2 gương mặt → Task 10 (tài khoản), Task 12-13 (phân chia nội dung VA/chú)
- Content pillars (5) → Task 12 (khung lịch phủ đủ pillar), Task 13 (yêu cầu tối thiểu 1 clip/pillar)
- Đặt tên & nhận diện → Task 1
- Kế hoạch tiếp cận thực địa (thư ngỏ, checklist, kịch bản, quy trình từng hãng) → Task 2, 3, 4, 5, 6, 9
- Track quốc tế hóa song song → Task 7, 8
- Bộ 13 tool → xuất hiện trong Global Constraints + từng task tương ứng (Namelix/NameSnack/3 tool cũ ở Task 1, Canva ở Task 1/10, CapCut/Opus Clip ở Task 11, Rask AI/ElevenLabs ở Task 8, TikTok Creative Center ở Task 12, Metricool ở Task 12, Mailmeteor ở Task 6)
- Timeline 4 giai đoạn → Task 1-9 = Giai đoạn 0-1, Task 10-13 = Giai đoạn 2, Task 14-15 = Giai đoạn 3
- Phân công (chú/VA/AI) → ghi rõ trong "Interfaces"/nội dung từng task (ví dụ Task 9 là chú tự thực hiện tại hiện trường)

**Placeholder scan:** Đã rà lại toàn bộ — không còn "TBD"/"TODO"; các ô bảng dạng `(điền khi tra cứu)` là dữ liệu cần điền thực tế trong lúc thực thi task đó (không phải placeholder bỏ trống vĩnh viễn), có bước cụ thể yêu cầu điền và verification kiểm tra không còn để trống.

**Type/naming consistency:** `TEN_KOL` và `TAGLINE` dùng nhất quán từ Task 1 → Task 5, 7, 8, 10. `CHECKLIST_THAM_DINH` (Task 2) được tham chiếu đúng ở Task 5 và Task 9.
