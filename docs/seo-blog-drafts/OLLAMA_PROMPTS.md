# Blog Content Generation Prompts — For Ollama

Ghi chú: Mỗi prompt dưới dây dùng để sinh 1 bài blog qua Ollama local. Sau khi sinh xong, copy content vào Supabase `blog_posts` table hoặc trigger n8n pipeline.

Cấu trúc bài blog:
- Tiêu đề H1 (được tự động từ title field)
- Excerpt (100-150 từ, tóm tắt chủ đề)
- Thân bài (Markdown): H2 subheading, paragraphs, bullet points, **bold**, blockquotes (> quote)
- Hình ảnh: `![alt](url)` — URLs phải là file thực trong `/public/assets/images/` hoặc Supabase `blog-images` bucket
- Links nội bộ: `[text](/product/slug)` hoặc `/blog/post-id`

---

## Prompt 1: "Hướng dẫn mua sâm Ngọc Linh uy tín — Checklist đầy đủ"

**Mục đích:** Pillar content, high commercial intent, rank cho "sâm Ngọc Linh mua ở đâu uy tín"

**Metadata để copy vào Supabase:**
```
title: "Hướng dẫn mua sâm Ngọc Linh uy tín — Checklist đầy đủ"
slug: "huong-dan-mua-sam-ngoc-linh-uy-tin"
excerpt: "Làm sao chọn được sâm Ngọc Linh thật, chất lượng cao, giá hợp lý? Guide đầy đủ 9 điểm cần kiểm tra trước khi mua, cách nhận biết sâm giả, và 5 kênh mua uy tín."
featured_image_url: "https://tasamngoclinh.com/assets/images/heritage-cusam-2.jpg"
published: true
```

**Prompt cho Ollama:**
```
Viết 1 bài blog Tiếng Việt, độc lập, không cần tham khảo công thức, 2000-2500 từ.

Tiêu đề: "Hướng dẫn mua sâm Ngọc Linh uy tín — Checklist đầy đủ"

Mục đích: Người tìm kiếm "sâm Ngọc Linh mua ở đâu uy tín" hoặc "cách chọn sâm Ngọc Linh" cần 1 guide toàn diện — từ nhận biết sâm thật/giả, đến kiểm tra kiểm định, cho tới các kênh mua uy tín.

Cấu trúc bài bắt buộc:
1. Intro (100 từ): Tại sao cần guide này, phần lớn sâm bán thị trường là giả hoặc kém chất lượng.

2. Section "9 Tiêu chí kiểm tra sâm Ngọc Linh thật" — liệt kê 9 điểm dưới dạng bullet + giải thích chi tiết mỗi điểm:
   - Hình dáng rễ (có đốt hay không)
   - Màu sắc
   - Mùi hương
   - Trọng lượng/độ khô
   - Chứng chỉ kiểm định Saponin
   - Xuất xứ (Trà Linh vs nơi khác)
   - Thời gian lưu trữ
   - Giá bán (so sánh khác loại sâm)
   - Hình thức bán (túi nilon duyên vs hộp chứng thực)

3. Section "Sâm giả vs Sâm thật — So sánh trực tiếp" — bảng so sánh 5-6 đặc điểm, hoặc 3 ví dụ cụ thể về sâm giả phổ biến.

4. Section "5 Kênh mua uy tín" — mô tả 5 cách mua:
   - Mua trực tiếp từ vườn/nông dân Trà Linh (cách liên hệ)
   - Mua từ các shop chuyên dùng (ví dụ: kênh của TA)
   - Mua từ các quầy thuốc Đông y uy tín
   - Mua online từ các nền tảng uy tín (Shopee/Zalo/...)
   - Hỏi bạn bè/người thân đã mua thành công

5. Section "Giá tham khảo" — liệt kê bảng giá theo loại (tươi, khô, ngâm, sấy) và hạng (S/M/L).

6. Section "Mẹo để tránh mua phải sâm kém chất lượng":
   - Không nên chỉ tin ảnh trên mạng
   - Kiểm tra chứng chỉ từ cơ quan chính phủ
   - Hỏi kỹ về nguồn gốc
   - Tránh mua từ nhà cái không rõ thông tin
   - Ưu tiên mua có hóa đơn / bảo hành

7. FAQ mini (3-4 câu hỏi phổ biến):
   - "Mua sâm tươi hay khô tốt hơn?"
   - "Cần kiểm tra gì ngoài hình dáng?"
   - "Giá 100k/100g có phải sâm thật không?"

8. Kết luận (100 từ): Nhấn mạnh tầm quan trọng của việc kiểm tra kỹ, và gợi ý dùng TA Sâm Ngọc Linh — nơi đủ chứng chỉ và minh bạch pháp lý.

**Yêu cầu chung:**
- Markdown format: H2 cho section (#), H3 cho subsection (##), bullet points (*), bold (**từ**).
- Tone: Chuyên sâu nhưng gần gũi, không bác sĩ lạnh lẽo.
- Không dùng ảnh/video — chỉ dùng text và tables.
- Bao gồm ít nhất 1 table so sánh (dùng markdown table syntax).
- Internal links: link tới `/product/...` cho sản phẩm TA (nếu liên quan), không link quá nhiều.
- Không bịa số liệu/tác dụng y học — chỉ nói những gì phổ biến hoặc từ kiến thức chung.
```

---

## Prompt 2: "Phân biệt sâm Ngọc Linh thật và giả — Hướng dẫn chi tiết kèm ảnh"

**Mục đích:** Trust-building, shareable, rank cho "phân biệt sâm thật giả", xây dựng brand authority

**Metadata:**
```
title: "Phân biệt sâm Ngọc Linh thật và giả — Hướng dẫn chi tiết"
slug: "phan-biet-sam-ngoc-linh-that-gia"
excerpt: "Sâm giả ngày càng tinh vi. Hướng dẫn từng cách kiểm tra sâm Ngọc Linh thật: từ hình dáng rễ, màu sắc, mùi hương, đến chứng chỉ kiểm định Saponin. Tránh mua phải hàng lạo."
featured_image_url: "https://tasamngoclinh.com/assets/images/heritage-cu-sam-2.jpg"
published: true
```

**Prompt:**
```
Viết bài blog 1500-2000 từ, Tiếng Việt.

Tiêu đề: "Phân biệt sâm Ngọc Linh thật và giả — Hướng dẫn chi tiết"

Mục đích: Người mua sâm lần đầu hoặc bị "ung thư" bởi sâm giả cần guide chi tiết — không chỉ liệt kê mà phải dễ hiểu, áp dụng được ngay.

Cấu trúc:
1. Intro (80 từ): Vấn đề sâm giả hiện nay — thị trường đầy rẫy hàng fake, người mua khó phân biệt, chi rất nhiều tiền nhưng chất lượng thấp.

2. Section "Các loại sâm giả phổ biến" (với 3 ví dụ cụ thể):
   - Sâm Hàn Quốc (Panax ginseng) được bán chui dưới danh "sâm Ngọc Linh"
   - Sâm Tây Bản Nha, Mỹ, Trung Quốc nhập khẩu giá rẻ
   - Sâm Ngọc Linh giả (nhân tạo hoặc từ vùng khác không phải Trà Linh)

3. Section "Cách phân biệt qua 7 đặc điểm" — mỗi đặc điểm 1 subsection:
   - Hình dáng rễ (sâm thật có đốt, sâm giả rễ trơn)
   - Màu sắc rễ (tự nhiên vàng nhạt vs màu nhân tạo)
   - Mùi hương (đặc trưng vs không mùi hoặc mùi kỳ lạ)
   - Trọng lượng khi cầm (sâm thật nặng hơn, chắc chắn)
   - Cảm giác chạm (bề mặt tự nhiên vs quá mịn)
   - Chứng chỉ kiểm định (Saponin %, số hiệu, cơ quan công bố)
   - Hộp đóng gói (hộp cao cấp vs túi rẻ tiền)

4. Section "Kiểm tra Chứng chỉ Saponin — Cách xác minh thật giả":
   - Giấy chứng chỉ phải có: số hiệu, ngày, cơ quan cấp, % Saponin/MR2
   - Cách verify: số hiệu + liên hệ cơ quan chủ quản
   - Tránh giấy chứng chỉ không rõ nguồn hoặc ảnh in trên túi

5. Section "Bảng so sánh: Sâm Ngọc Linh Thật vs Giả" (markdown table):
   | Đặc điểm | Thật | Giả |
   | Hình rễ | Có đốt | Rõ ráng chẻ nhánh |
   | Màu | Vàng nhạt tự nhiên | Vàng nước, nhân tạo |
   | Mùi | Thơm, đặc trưng | Không mùi/mùi chất hóa |
   | Chứng chỉ | Đầy đủ, xác minh được | Thiếu hoặc không rõ |
   | Giá | 300-600k/100g tươi | Dưới 100k/100g (quá rẻ) |

6. Section "5 Lời khuyên để tránh mua phải sâm giả":
   - Lựa chọn nhà cung cấp uy tín (có lịch sử, review tốt)
   - Kiểm tra trực tiếp trước khi mua (nếu mua offline)
   - Yêu cầu chứng chỉ kiểm định trước khi thanh toán
   - Mua từ kênh chính thức hoặc người giới thiệu đáng tin
   - Tránh mua hàng giảm giá quá lớn (scam tip-off)

7. Kết: Nhấn mạnh sâm thật đắt tiền nhưng chất lượng xứng đáng, và khuyên mua từ những nơi có chứng chỉ + minh bạch.

**Yêu cầu:**
- Dùng markdown, H2 cho section
- Bảng so sánh bắt buộc có
- Có thể mention TA Sâm Ngọc Linh nhưng không bán hàng, chỉ xây dựng trust
- Không dùng ảnh (chỉ text)
- Tone: Chân thành, cảnh báo lành, không áp dụng
```

---

## Prompt 3: "Cách dùng sâm Ngọc Linh đúng cách — Liều lượng, Thời điểm, Lưu ý"

**Mục đích:** Bottom-of-funnel, hỗ trợ khách đã mua, rank "cách dùng sâm ngọc linh"

**Metadata:**
```
title: "Cách dùng sâm Ngọc Linh đúng cách — Liều, Thời điểm, Lưu ý"
slug: "cach-dung-sam-ngoc-linh-dung-cach"
excerpt: "Sâm Ngọc Linh dùng sao cho hiệu quả? Hướng dẫn liều lượng, thời điểm uống, cách nấu, và những lưu ý quan trọng để đạt tác dụng tối đa."
featured_image_url: "https://tasamngoclinh.com/assets/images/heritage-vuon-sam-1.jpg"
published: true
```

**Prompt:**
```
Bài blog 1200-1600 từ.

Tiêu đề: "Cách dùng sâm Ngọc Linh đúng cách — Liều, Thời điểm, Lưu ý"

Mục đích: Khách vừa mua sâm nhưng không biết dùng sao, hoặc muốn biết liều lượng/thời điểm để khai thác tác dụng tối đa.

Cấu trúc:
1. Intro (60 từ): Sâm Ngọc Linh tuy quý nhưng nếu dùng sai cách sẽ lãng phí tiền bạc + có thể gây không thoải mái.

2. Section "Liều lượng hàng ngày" — chi tiết cho từng đối tượng:
   - Người bình thường (không bệnh): 2-3g/ngày
   - Người yếu/suy nhược: 3-5g/ngày
   - Người cao tuổi: 2-3g/ngày, liều nhỏ hơn
   - Phụ nữ: 2-3g/ngày (không quá liều)
   - Không nên quá 5g/ngày lâu dài

3. Section "Cách dùng sâm Ngọc Linh" — 5 phương pháp:
   - Ngâm mật ong: 3-5g + mật ong, để 2-3 tuần, dùng từng thìa
   - Ngâm rượu: 3-5g + rượu 40%, để 2-4 tuần
   - Nấu canh/tán: 2-3g tươi hoặc khô nấu với gà/bò
   - Nhai trực tiếp: sâm sấy khô, nhai từ từ
   - Bột hoặc viên nén: theo hướng dẫn bao

4. Section "Thời điểm uống tốt nhất":
   - Sáng sớm (6-8h): tốt nhất, giúp tỉnh táo, có năng lượng
   - Trước bữa cơm 30-60 phút: hỗ trợ tiêu hóa
   - KHÔNG nên chiều tối/trước ngủ: dễ mất ngủ
   - KHÔNG nên uống ngay sau vận động nặng: cơ thể mệt

5. Section "Thời gian liên tục — Nên ngừng định kỳ":
   - Dùng 1-2 tháng liên tục rồi ngừng 1 tuần
   - Tránh dùng quá lâu (3+ tháng liên tục): cơ thể quen, giảm hiệu quả
   - Nên xen kẽ hoặc dùng theo mùa (tăng cường mùa đông)

6. Section "Những lưu ý & Chống chỉ định":
   - Người huyết áp cao: dùng liều rất nhỏ (1-2g), tư vấn bác sĩ
   - Phụ nữ mang thai: không nên dùng (chưa có đủ nghiên cứu)
   - Người dùng thuốc loãng máu/chống đông: hỏi bác sĩ (có thể tương tác)
   - Người bị mất ngủ nặng: dùng sáng sớm, không trưa/tối
   - Bị sốt cao/viêm: tạm dừng cho tới bình phục

7. Section "Cách bảo quản để giữ tác dụng":
   - Bảo quản nơi khô, mát, tránh ánh sáng trực tiếp
   - Sâm tươi: tủ lạnh 1-2 tháng; sâm khô: 1-2 năm
   - Dùng hộp kín để tránh ẩm ướt

8. FAQ (2-3 câu):
   - "Mấy ngày dùng mới thấy tác dụng?"
   - "Có thể dùng cùng thuốc tây được không?"

**Yêu cầu:**
- Markdown, H2 section
- Tone: Hữu ích, cẩn thận (không khuyến khích lạm dụng)
- Không bịa con số — chỉ nói tiêu chuẩn chung
- Nhắc nhở tư vấn bác sĩ khi có bệnh
```

---

## Ghi chú thêm

- **Hình ảnh:** Mỗi bài nên có ≥2 ảnh (theo yêu cầu skill `make-blog-images`). URLs phải là ảnh thực trong `public/assets/images/` — xem danh sách sẵn có ở dưới.
- **Internal links:** Khi viết, có thể tự link tới `/product/...` nếu liên quan (vd. "Xem [Sâm Ngọc Linh ngâm mật ong](/product/sam-ngoc-linh-ngam-mat-ong-sk5-007)")
- **SEO:** Mỗi bài có `slug` sẵn (tối ưu từ khóa). Không thay đổi slug sau khi publish.

**Ảnh sẵn có để dùng:** 
- `heritage-cusam-2.jpg`, `heritage-cusam-3.jpg` — sâm củ
- `heritage-cay-sam.png`, `sam-ngoc-linh-plant.png` — cây sâm
- `heritage-vuon-sam-1.jpg` — vườn/cảnh quan
- `heritage-hat-sam-1.jpg` — hạt sâm
- `cusam.jpg` — sâm chụp detail

Sau khi Ollama sinh xong nội dung, paste vào Supabase `blog_posts` table. Nếu cần ảnh đặc thù, dùng skill `make-blog-images` để tạo.
