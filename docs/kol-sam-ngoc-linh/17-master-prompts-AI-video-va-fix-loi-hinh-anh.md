# Bộ 5 Master Prompts AI Video — Việt Sâm Ký (đã kiểm tra & sửa lỗi)

**Trạng thái:** đã đối chiếu với ảnh thật trong `D:\TA page\video ban hang\`, sửa lỗi tên file tham chiếu, sẵn sàng copy-paste chạy trực tiếp trên Veo / Seedance / Runway / Kling.

---

## 0. Chẩn đoán lỗi video hiện có

**File lỗi:** `D:\TA page\video ban hang\Second_Commercial_Video_Sc.mp4`

Đã trích 3 khung hình để kiểm tra (giây 0, 4, 8). Xác nhận: củ sâm trong video là **hình dạng nhân sâm Hàn Quốc/Trung Quốc** — rễ chính thuôn dài, phân nhánh như chân người, bề mặt tương đối trơn. **Sai hoàn toàn** so với Sâm Ngọc Linh thật (thân rễ nằm ngang, đốt tròn xù xì như đốt trúc, xem `15-cu-sam-tuoi.png`).

**Em không có công cụ chỉnh sửa/tái tạo hình ảnh trong video đã dựng.** Cách sửa duy nhất: dựng lại đúng cảnh đó bằng **PROMPT 2 (đã sửa bên dưới)**, dùng đúng ảnh tham chiếu củ sâm thật.

---

## 1. Sửa lỗi tham chiếu ảnh (quan trọng nhất — áp dụng cho MỌI prompt bên dưới)

Bản gốc chú đưa ghi 3 file tham chiếu, nhưng kiểm tra thực tế trong `D:\TA page\video ban hang\`:

| Vai trò trong prompt | File chú ghi (KHÔNG tồn tại) | File thật thay thế (đã xem, đúng nội dung) |
|---|---|---|
| Image 1 — KOL | `sanpham1.jpg` | ✅ **Giữ nguyên `sanpham1.jpg`** — đúng là ảnh người phụ nữ tóc bob ngắn, đeo kính, váy thổ cẩm, cầm bó lá sâm. Khớp 100% mô tả trong prompt gốc. |
| Image 2 — Củ Sâm | `cu sam 14 nam.jfif` | ❌ Không tồn tại → **dùng `15-cu-sam-tuoi.png`** — đúng thân rễ đốt trúc, sẹo mắt tròn xù xì, rễ con phân nhánh. Khớp chính xác mô tả botanical trong prompt. |
| Image 3 — Hoa/Quả Sâm | `tavuon16.jpg` | ❌ Không tồn tại → **dùng `11-hoa-sam-tuoi.png`** — xem lưu ý quan trọng bên dưới, ảnh này KHÔNG hoàn toàn khớp mô tả "quả đỏ chấm đen". |
| (Tùy chọn) Image 4 — Lá riêng | — | `14-la-sam-tuoi.png` — ảnh lá kép chân vịt rõ nét hơn, dùng bổ sung khi cận cảnh lá (Prompt 3). |

> ⚠️ **Lưu ý về Image 3 (`11-hoa-sam-tuoi.png`):** ảnh thật hiện có cho thấy **cụm hoa/hạt màu xanh-đỏ nhạt dạng gai tròn**, chưa phải giai đoạn quả chín đỏ tươi có chấm đen ở đỉnh như mô tả trong prompt gốc. Nếu dùng ảnh này làm reference bắt buộc (image-guided), AI sẽ ra hình giống ảnh thật (giai đoạn hoa/hạt non), **không ra quả đỏ chín** dù prompt text có yêu cầu "red berries with black tips". Hai lựa chọn: (A) chấp nhận dùng đúng giai đoạn hoa/hạt như ảnh thật — đã sửa mô tả text bên dưới cho khớp; (B) nếu chú có ảnh quả chín đỏ thật (chụp đúng mùa quả chín), thay vào để có hiệu ứng "quả đỏ chấm đen" như bản gốc mong muốn.

---

## 2. Mẹo dùng chung (đã cập nhật đường dẫn thật)

```
Image Reference 1 (KOL): D:\TA page\video ban hang\sanpham1.jpg
   → Image Weight / Face Strength = 0.85–0.9

Image Reference 2 (Củ Sâm): D:\TA page\video ban hang\15-cu-sam-tuoi.png
   → Image Weight = 0.8–0.9 (giữ đúng cấu trúc đốt trúc, không để AI "làm mượt" thành củ tròn)

Image Reference 3 (Hoa/Lá Sâm): D:\TA page\video ban hang\11-hoa-sam-tuoi.png
   → Image Weight = 0.7–0.8
   (Tùy chọn thêm Image 4: D:\TA page\video ban hang\14-la-sam-tuoi.png cho cận cảnh lá)
```

> Ghi chú kỹ thuật: tên gọi "Image Weight / Face Strength" đúng với workflow kiểu Runway/Kling multi-reference. Một số nền tảng (Veo, Seedance) có thể đặt tên khác cho tính năng tương tự (ví dụ "Reference Strength", "Style Influence") — kiểm tra đúng nhãn trong giao diện tool tại thời điểm dùng trước khi chạy hàng loạt.

---

## 3. PROMPT 1 — Giới thiệu tổng thể vườn sâm (15s)

```
[Subject & Character]:
A 15-second authentic commercial video. The Asian woman from Image 1 (short brown bob hair, glasses, friendly smile, black traditional embroidered dress) stands inside a real high-mountain ginseng farm under black shading mesh nets. She speaks with natural lip-sync, presenting the farm warmly. Maintain 100% facial and costume consistency with Image 1.

[Botanic Detail - Vietnamese Ngoc Linh Ginseng]:
Focus on authentic Panax vietnamensis. In her hand, she holds a fresh green ginseng branch with palmate compound leaves (5 dark-green serrated leaflets, matching Image 4/leaf reference) and a cluster of spiky green-red flower/seed heads on long stems (matching Image 3). Absolutely NO fat, smooth, human-shaped Korean ginseng taproots anywhere in frame.

[Environment & Camera Work]:
- 0:00-0:05: Medium shot of the woman standing between rows of ginseng beds under black shading mesh nets on a foggy mountain slope, natural morning light filtering through.
- 0:05-0:10: Close-up pan over lush green ginseng plants with the spiky flower/seed clusters (Image 3) growing in rich organic soil.
- 0:10-0:15: Return to medium shot. The woman smiles, gesturing welcomingly to the viewer as she finishes speaking.

[Technical Specs]:
4K resolution, photorealistic, 24fps, organic natural lighting, documentary style, smooth camera movement.
```

**Dùng khi:** video mở đầu chuỗi, giới thiệu nguồn gốc vườn sâm.

---

## 4. PROMPT 2 — Cận cảnh củ sâm nhiều năm tuổi (15s) — **dùng để sửa lại cảnh lỗi trong Second_Commercial_Video_Sc.mp4**

```
[Subject & Character]:
A 15-second commercial featuring the Asian woman from Image 1 (short brown bob hair, glasses, black traditional embroidered dress) presenting a premium aged ginseng root. Maintain exact facial features and costume from Image 1.

[Botanic Detail - Rhizome Structure]:
The hero product is a genuine multi-year Vietnamese Ngoc Linh Ginseng rhizome (strictly matching Image 2 — D:\TA page\video ban hang\15-cu-sam-tuoi.png). Features a long, horizontal, irregular, bamboo-joint-like creeping rhizome (trúc khúc) with numerous distinct, tight, circular scar nodes from annual stems, yellowish-brown rugged skin, thin wiry rootlets branching outward, and a small green stem sprouting from one end. STRICTLY DO NOT generate a smooth, thick, fork-shaped, human-body-like taproot (this is the Korean ginseng error to avoid — reject any output resembling a plump forked root without visible circular stem-scar segments).

[Environment & Camera Work]:
- 0:00-0:05: Medium shot. The woman lifts a rustic bamboo tray holding the genuine Ngoc Linh ginseng rhizome (Image 2) under the shaded farm canopy.
- 0:05-0:10: Extreme close-up macro shot of the rhizome surface (Image 2), highlighting the authentic circular stem scars, knotty bamboo-like segments, rugged texture, and fine roots under natural sunlight.
- 0:10-0:15: The woman holds the rhizome close to the camera with pride, smiling with absolute trustworthiness.

[Technical Specs]:
4K, highly detailed texture, macro depth of field, authentic daylight, commercial quality.
```

**Dùng khi:** video chốt đơn củ sâm nguyên củ, nhấn mạnh độ tuổi và dưỡng chất. **Ưu tiên chạy prompt này trước** để có bản thay thế cho video lỗi.

---

## 5. PROMPT 3 — Bán lá & hoa/hạt sâm tươi (15s)

```
[Subject & Character]:
A 15-second commercial with the woman from Image 1 (short bob hair, glasses, black traditional embroidered dress) showcasing fresh Ngoc Linh ginseng leaves and flower/seed clusters inside her farm.

[Botanic Detail - Leaf & Flower]:
Accurate depiction of Panax vietnamensis foliage. Show fresh, dark-green palmate compound leaves with 5 finely serrated leaflets and visible leaf veins (matching Image 4 — D:\TA page\video ban hang\14-la-sam-tuoi.png). Feature spiky spherical green-and-reddish flower/seed heads on long thin stems (matching Image 3 — D:\TA page\video ban hang\11-hoa-sam-tuoi.png).

[Environment & Camera Work]:
- 0:00-0:05: Medium shot. The woman holds a large bouquet of freshly harvested Ngoc Linh ginseng stems with rich green leaves and flower/seed clusters, smiling happily inside the shade-net farm.
- 0:05-0:10: Close-up pan over the leaf clusters (Image 4) and the spiky flower/seed heads (Image 3) resting together, with morning dew drops glistening.
- 0:10-0:15: The woman presents the leaf bouquet toward the camera, inviting customers to try fresh ginseng tea.

[Technical Specs]:
4K resolution, cinematic close-up, sharp focus, natural green tone, organic farm setting.
```

**Dùng khi:** bán bộ phận lá và hoa/hạt cho khách muốn trải nghiệm giá mềm hơn.

---

## 6. PROMPT 4 — Kiểm tra & phân biệt sâm thật tại vườn (15s)

```
[Subject & Character]:
A 15-second educational sales video. The woman from Image 1 (short bob hair, glasses, black traditional embroidered dress) demonstrates how to identify real Ngoc Linh ginseng right at her mountain farm.

[Botanic Detail - Genuine vs Fake Markers]:
Show direct detail of authentic Panax vietnamensis: a long, horizontal, irregular, knotted rhizome with distinct annual circular scar nodes (Image 2 — D:\TA page\video ban hang\15-cu-sam-tuoi.png), thin wiry roots. Contrast verbally/visually with a thick, smooth, uniform, human-shaped taproot (the Korean ginseng look to explicitly avoid and warn viewers about).

[Environment & Camera Work]:
- 0:00-0:05: Medium shot of the woman sitting at a rustic wooden farm table, holding an authentic knotty Ngoc Linh rhizome (Image 2).
- 0:05-0:10: Close-up shot as her finger gently points to the circular annual scar nodes along the rhizome segments, explaining its age and authenticity.
- 0:10-0:15: She looks directly into the camera with a confident, reassuring smile, holding the rhizome up.

[Technical Specs]:
4K resolution, crisp clarity, realistic hand movement, trustworthy lighting, professional educational tone.
```

**Dùng khi:** video "chuyên gia" hướng dẫn nhận biết sâm thật, tạo niềm tin tuyệt đối.

---

## 7. PROMPT 5 — Thu hoạch & đóng gói quà biếu cao cấp (15s)

```
[Subject & Character]:
A 15-second luxury-commercial video featuring the woman from Image 1 (short bob hair, glasses, black traditional embroidered dress) preparing freshly harvested Ngoc Linh ginseng for premium gift packaging.

[Botanic Detail]:
Complete, pristine Panax vietnamensis plant: intact green leaves (Image 4), spiky flower/seed cluster (Image 3), connected to a long, multi-knotted horizontal rhizome with full fibrous root system (Image 2), lightly dusted with organic mountain soil.

[Environment & Camera Work]:
- 0:00-0:05: Medium shot. The woman carefully lifts a fully intact, freshly dug Ngoc Linh ginseng plant from a woven bamboo basket inside the netted farm.
- 0:05-0:10: Close-up shot placing the pristine rhizome gently onto a bed of green moss inside a luxury wooden gift box.
- 0:10-0:15: The woman closes the box partially, looks at the camera, and gives a warm nod of approval.

[Technical Specs]:
4K resolution, cinematic lighting, slow-motion 60fps style, high-end commercial feel.
```

**Dùng khi:** hướng tới khách mua làm quà biếu/quà tặng doanh nghiệp, cao cấp.

---

## 8. Kịch bản lời thoại (voiceover) — xoay vòng cho 5 prompt

**Mẫu 1 (dùng cho Prompt 1 & 3 — Tổng quan & Lá/hoa sâm):**
> "Xin chào cả nhà! Hôm nay mời mọi người cùng ghé thăm vườn sâm Ngọc Linh chính gốc. Từ lá, hoa cho đến củ đều tích tụ trọn vẹn tinh hoa núi rừng. Nhanh tay liên hệ để nhận sâm chuẩn nhé!"
> (~40 từ, ướm khoảng 15s ở tốc độ nói tự nhiên — **nên test lại đúng thời lượng bằng chính giọng đọc/AI voice sẽ dùng**, vì tốc độ nói thực tế thay đổi theo người/giọng AI, không cố định theo số từ.)

**Mẫu 2 (dùng cho Prompt 2, 4 & 5 — Củ sâm & chốt đơn):**
> "Bà con xem này, củ sâm Ngọc Linh chuẩn gốc mọc từng đốt móng trúc xù xì, hàng chục năm tuổi giàu dưỡng chất. Cam kết sâm thật 100% thu hoạch tại vườn. Nhấn vào góc màn hình để đặt hàng ngay!"
> (~41 từ — test lại thời lượng thực tế trước khi ghép vào video)

---

## 9. Kế hoạch chạy — copy-paste và chạy theo thứ tự

| Thứ tự | Việc | Input | Output kỳ vọng |
|---|---|---|---|
| 1 | Chạy **Prompt 2** trước tiên | 3 ảnh reference (mục 2) + Prompt 2 | Clip 15s thay thế cho video lỗi hiện có |
| 2 | Đối chiếu output với `15-cu-sam-tuoi.png` | Xem kỹ: có còn hình dạng củ tròn kiểu Hàn Quốc không | Nếu vẫn sai → tăng Image Weight của Image 2 lên 0.9-0.95, chạy lại |
| 3 | Chạy Prompt 1, 3, 4, 5 theo cùng bộ ảnh reference | Prompt tương ứng | 4 clip còn lại cho chuỗi nội dung Pillar 1 (thẩm định), Pillar 3 (so sánh), Pillar 4 (bán hàng) |
| 4 | Ghép voiceover Mẫu 1/Mẫu 2 tương ứng bằng ElevenLabs hoặc giọng thật | Kịch bản mục 8 | 5 clip hoàn chỉnh có tiếng |
| 5 | Đưa cả 5 clip vào CapCut, thêm phụ đề + hook 2 giây đầu | Quy trình đã có ở file 11 | Sẵn sàng đăng theo lịch file 12 |

**Lưu ý cuối:** đây là nội dung **AI-generated cho pillar 3-4 (so sánh/bán hàng)**, không dùng thay cho pillar 1-2 (thẩm định thực địa) — giữ đúng nguyên tắc đã thống nhất ở file 15: AI cho bán hàng, người thật 100% cho thẩm định uy tín.
