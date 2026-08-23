# Kế hoạch hành động cụ thể + Bộ AI Tool "0 đến Hero"

**Ngày:** 2026-08-08
**Bối cảnh:** Chú xác nhận tích hợp kênh KOL (Việt Sâm Ký) thành 1 dự án chung với phát triển kinh doanh TA Sâm — không tách biệt nữa. Người thực hiện: chú + VA, không có kinh nghiệm làm content/KOL trước đây, mục tiêu AI làm 90% công việc chuẩn bị (kịch bản, dựng, viết caption, lên lịch), con người chỉ làm phần bắt buộc phải là người thật (xuất hiện, nói, quay, gửi tin nhắn thật, đăng nhập tài khoản thật).

---

## Phần 1 — Bài học rút ra từ Hannah Olala (nghiên cứu thật, không suy diễn)

Nguồn: search thật ngày 2026-08-08 (xem link cuối file).

- Hannah Olala **không chỉ là KOL cá nhân** — bà xây công ty mỹ phẩm Skinetiq theo mô hình D2C (bán trực tiếp tới người dùng), sau 4 năm bán 75% cổ phần cho tập đoàn Marico với định giá ~750 tỷ VND.
- **Từ 2019, vận hành song song 4 mảng cùng lúc**: social commerce (nội dung + livestream bán hàng), phân phối mỹ phẩm, phòng khám da liễu, và sản xuất nội dung. → Bài học: KOL không dừng ở "người nói hay", mà là hạt nhân của một hệ sinh thái kinh doanh (đúng hướng chú đang chọn: tích hợp KOL vào dự án TA Sâm).
- **Không cạnh tranh bằng giá** — chọn phân khúc cao cấp, tạo khác biệt bằng chuyên môn + niềm tin người tiêu dùng. → Khớp hoàn toàn với định vị "Việt Sâm Ký" (người thẩm định thật, không phải nơi bán rẻ nhất).
- Kết hợp dữ liệu từ sàn thương mại điện tử để tối ưu sản phẩm, giá, nội dung — tức là **đo lường liên tục, không làm nội dung theo cảm tính**.

**Áp dụng cho Việt Sâm Ký:** nội dung KOL không phải mục tiêu cuối, mà là kênh dẫn khách vào hệ sinh thái TA Sâm (fanpage bán hàng, sản phẩm chế biến sâu, sau này có thể là dòng sản phẩm/dịch vụ riêng). Ngay từ đầu nên đo lường: view nào ra đơn, pillar nào chuyển đổi tốt, để dồn lực đúng chỗ — không dàn trải cả 5 pillar đều nhau mãi mãi.

---

## Phần 2 — Bộ AI Tool "0 đến Hero" (không kinh nghiệm, AI làm 90%)

Nguyên tắc chọn tool: **free/freemium trước, chỉ trả phí khi tool đó thay thế trực tiếp một việc tốn nhiều giờ công của con người.** Ngân sách marketing hiện dưới 3 triệu VND/năm — các tool có phí dưới đây chỉ nên bật 1-2 cái, không bật hết cùng lúc.

### 2.1. Ý tưởng & Kịch bản (AI làm gần 100%)
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| Claude (em) | Viết kịch bản, caption, thư ngỏ, phân tích hiệu suất | Đã có sẵn |
| TikTok Creative Center | Tra trend/hashtag đang lên trong ngách sức khỏe | Free |

### 2.2. Giọng nói (khi không muốn/không tiện tự thu âm)
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| ElevenLabs | Lồng tiếng thuyết minh tự nhiên, nhân bản giọng | Free tier giới hạn phút/tháng; gói Starter ~$5/tháng |
| Rask AI | Dịch + lồng tiếng đa ngôn ngữ, tự khớp khẩu hình | Free tier giới hạn phút; gói trả phí theo phút dịch |

### 2.3. Dựng & xử lý video từ cảnh quay thật (chủ lực — vì kênh cần "người thật" để giữ uy tín)
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| CapCut | Dựng, phụ đề tự động, template, chuyển 1 video dài → nhiều bản ngắn | Free (bản Pro có thêm hiệu ứng, ~$10-20/tháng, không bắt buộc) |
| Opus Clip | Tự tìm đoạn "viral" trong video dài của chú, cắt sẵn | Free 60 credit/tháng (có watermark) — đủ dùng giai đoạn đầu |

### 2.4. Sinh video bán hàng từ ảnh KOL + ảnh sản phẩm (AI tạo video, không cần quay)

Đây là nhóm tool trả lời đúng câu hỏi "từ ảnh KOL và ảnh sản phẩm, AI nào tạo video bán hàng tốt nhất" — xếp hạng theo mức độ phù hợp với dự án này (đã có sẵn `KOL_face.png`, `sanpham1.jpg`, `mat VA.jfif`, `11/14/15-*.png` trong `D:\TA page\video ban hang`):

| Xếp hạng | Tool | Việc AI làm thay | Phí (2026) |
|---|------|---|---|
| **#0 — free, dùng ngay hôm nay** | **Google Veo 3.1 (qua Gemini app hoặc Flow)** | Chú đang dùng đúng tool này cho video trên fanpage — **đúng lựa chọn, không cần đổi.** Upload `sanpham1.jpg`/`KOL_face.png` làm ảnh tham chiếu, gõ prompt (dùng thẳng 5 prompt mẫu ở [17-master-prompts-AI-video-va-fix-loi-hinh-anh.md](17-master-prompts-AI-video-va-fix-loi-hinh-anh.md)), Veo dựng video có tiếng đồng bộ trực tiếp từ ảnh | **Free thật**: ~5-10 video/ngày qua Gemini app (tài khoản Google thường), không watermark. Giới hạn: mỗi clip ~8s (ghép nhiều clip 8s lại thành video 15s như quy trình file 17) |
| **#1 — dùng cho nội dung TA bán hàng, cần pipeline tự động hơn** | **Creatify** | Đưa ảnh sản phẩm (trà/cao/nước sâm) vào, AI tự viết kịch bản + dựng video quảng cáo dạng UGC, **chèn thẳng ảnh sản phẩm thật vào khung hình**, có "Creatify Agent" tự làm cả pipeline từ nghiên cứu tới video hoàn chỉnh | Free 10 credit/tháng (~2 video, có watermark); Starter $39/tháng (~950k VND) |
| **#1B — đối thủ ngang tầm Creatify, free 1080p không watermark** | **Seedance 2.0** | Xếp #1 bảng xếp hạng chất lượng video ELO độc lập (1.215 điểm, cao hơn Kling 3.0). Giữ chi tiết sản phẩm/logo/chữ ổn định qua từng khung hình (quan trọng cho video bán hàng), có âm thanh đồng bộ tự nhiên ngay từ ảnh sản phẩm. Bản 2.0 xuất 1080p miễn phí, không watermark ở gói credit hàng ngày | Có gói free credit hàng ngày (1080p, không watermark); giá trả phí thay đổi theo nền tảng trung gian bán lại — cần báo giá cụ thể khi chọn |
| **#2 — dùng khi cần ra tin nhanh, không kịp quay** | **HeyGen (Avatar IV)** | Biến ảnh tĩnh `KOL_face.png`/`mat VA.jfif` thành video nói chuyện thật (AI khớp khẩu hình theo giọng đã thu hoặc voice AI) | Từ $24-29/tháng (~600-700k VND) |
| **#3 — bổ sung cảnh nền, không có người nói** | **Kling AI** | Sinh cảnh B-roll (núi rừng, cận cảnh sản phẩm) khi không có sẵn tư liệu quay. So với Seedance: Kling mạnh hơn về chuyển động camera chính xác và vật lý 3D; Seedance mạnh hơn về chuyển động nhân vật linh hoạt | ~$0,07/giây sinh video, có gói free giới hạn |

**Vì sao Veo không nằm trong bảng gốc:** thiếu sót — chú đã tự tìm ra và đang dùng đúng, bảng gốc đáng lẽ phải liệt kê Veo làm lựa chọn free đầu tiên vì nó chính là công cụ tạo video từ ảnh tham chiếu tốt nhất hiện có mà **hoàn toàn free** ở mức dùng của kênh mới (5-10 video/ngày dư sức cho nhịp 1 clip/ngày). Đã bổ sung ở hàng #0. Việc còn thiếu không phải là "tool nào để tạo video" (Veo đã đúng) — mà là **quy trình chọn đúng ảnh tham chiếu** để tránh lỗi củ sâm sai hình dạng như video `Second_Commercial_Video_Sc.mp4`, đã sửa chi tiết ở file 17.

**Chọn Veo, Creatify hay Seedance 2.0?** Veo (free) dùng trước cho mọi nhu cầu hàng ngày — không tốn phí, chất lượng đủ tốt, đã có sẵn quy trình prompt ở file 17. Chỉ cân nhắc Creatify khi cần pipeline tự động hơn (ít phải tự viết prompt) hoặc Seedance khi Veo hết quota trong ngày mà vẫn cần thêm video.

**Cách dùng cụ thể với tư liệu đã có:**
1. Video bán hàng sản phẩm chế biến sâu cho fanpage TA → đưa `sanpham1.jpg` + ảnh trà/cao/nước sâm vào **Creatify** → AI ra video UGC-style hoàn chỉnh trong vài phút.
2. Video tin nhanh (VD: "Vừa gửi thư chào hàng tới hội chợ CosmeticBusiness") khi không kịp quay → đưa `KOL_face.png` hoặc `mat VA.jfif` vào **HeyGen Avatar IV** → có video nói ngay.
3. Không có cảnh núi rừng đẹp cho 1 clip cụ thể → dùng **Kling AI** sinh B-roll chèn xen kẽ (đã có ví dụ `kling sam rung.mp4` trong thư mục, cho thấy cách này từng được thử).

> **Cảnh báo chiến lược, không chỉ là gợi ý công cụ:** cốt lõi giá trị của Việt Sâm Ký là "người thẩm định **thật**". Nhóm tool ở mục này **phù hợp nhất cho nội dung bán hàng của TA** (pillar 4 — trải nghiệm sản phẩm, hoặc quảng cáo chuyển đổi), **không nên dùng cho pillar 1-2** (thẩm định vùng trồng, bóc tách giấy tờ) — vì nếu khán giả phát hiện "clip thẩm định" thực ra là AI dựng từ ảnh tĩnh, sẽ phá vỡ chính uy tín "tôi đã đến tận nơi xem tận mắt" đang xây dựng. Quy tắc: **AI-generated cho bán hàng/quảng cáo, người thật 100% cho thẩm định/uy tín.**

**Về ngân sách nếu chọn 1 tool trả phí để bắt đầu:** với mục tiêu follower + bán hàng, ưu tiên **Creatify Starter ($39/tháng)** trước vì tác động trực tiếp đến chuyển đổi bán hàng (đo được bằng đơn hàng), thay vì HeyGen (tác động gián tiếp hơn tới follower). Đây là chi phí **vượt** ngân sách marketing hiện tại (<3 triệu VND/năm) nếu chạy liên tục cả năm (~11,4 triệu VND/năm) — chỉ nên bật 1-2 tháng test khi đã xác nhận có ngân sách riêng, không tự động bật.

### 2.5. Livestream (cân nhắc kỹ, không phải bước đầu tiên)
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| Virbo Live (Wondershare) | Avatar AI livestream 24/7, tự trả lời câu hỏi thường gặp | Từ ~$30/tháng theo gói entry-level |
| TikTok Shop AI Booster | Thuật toán tự ưu tiên hiển thị shop có livestream đều đặn, chatbot hỗ trợ chốt đơn trong bình luận | Tích hợp sẵn trong TikTok Shop, không phí thêm |

> **Khuyến nghị thực tế cho giai đoạn 0 đến Hero:** **KHÔNG bắt đầu bằng livestream AI ảo.** Với kênh chưa có follower, livestream ảo 24/7 sẽ phát cho gần như 0 người xem — lãng phí phí tool. Thứ tự đúng: (1) xây follower bằng clip ngắn thật trước, (2) khi có vài nghìn follower ổn định mới thử livestream **thật** (chú hoặc VA) vào khung giờ vàng 1-2 buổi/tuần để test phản ứng, (3) chỉ cân nhắc AI livestream 24/7 khi đã có đơn hàng đều và cần phủ khung giờ đêm/sáng sớm mà không có nhân sự trực.

### 2.6. Thiết kế & nhận diện
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| Canva | Logo, thumbnail, bộ nhận diện, thư ngỏ PDF | Free đủ dùng |

### 2.7. Lên lịch & đo hiệu suất
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| Metricool | Lên lịch đăng 3 nền tảng cùng lúc, gộp số liệu 1 chỗ | Free tier đủ dùng giai đoạn đầu |

### 2.8. Tăng trưởng khán giả — **hợp pháp**, thay thế cho "crawl user Facebook"
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| Meta Ads Manager (Audience Insights + Lookalike Audience) | Nhắm quảng cáo tới người có sở thích tương tự follower fanpage đối thủ — hợp pháp vì Meta tự làm việc khớp mẫu, không giao dữ liệu cá nhân người dùng cho bên thứ 3 | Trả theo ngân sách quảng cáo tự đặt (có thể bắt đầu 50-100k VND/ngày để test) |
| Theo dõi công khai (thủ công) | Đọc bình luận công khai trên bài đăng đối thủ để hiểu khách hàng đang hỏi gì, phàn nàn gì — không lưu trữ thông tin cá nhân | Free |

### 2.9. Chăm sóc khách hàng tự động (khi có đơn hỏi liên tục)
| Tool | Việc AI làm thay | Phí |
|------|---|---|
| Chatbot tích hợp TikTok Shop / Fanpage (Fchat, ManyChat...) | Tự trả lời câu hỏi thường gặp trong bình luận/tin nhắn, giảm tải cho chú | Free tier giới hạn số hội thoại; trả phí khi lượng tin nhắn tăng |

---

## Phần 3 — Kế hoạch hành động cụ thể theo tuần (0 đến Hero, 12 tuần đầu)

Nguyên tắc đọc bảng: cột "AI/Claude chuẩn bị" là phần đã xong hoặc AI làm sẵn. Cột "Chú/VA thực hiện" là phần **bắt buộc con người** — không thể giao AI.

| Tuần | AI/Claude chuẩn bị | Chú/VA thực hiện |
|------|----------------------|----------------------|
| 1 | ✅ Đã xong: tên, checklist, kịch bản, thư ngỏ, danh sách hãng | Kiểm tra username, gửi thư Trà Linh (đã soạn sẵn ở file 06), tự tìm liên hệ Ca Nam/Vĩnh Khang Đạt |
| 2 | Theo dõi phản hồi thư ngỏ, chuẩn bị thêm thư cho hãng phản hồi | Tạo tài khoản TikTok/YouTube/Facebook (dùng bio đã soạn ở file 01); chốt lịch chuyến thực địa |
| 3-4 | Chuẩn bị shot-list/checklist mang theo (đã có ở file 09) | **Đi thực địa**, quay tư liệu theo kịch bản 3-clip (file 03) tại 1-2 hãng đầu tiên |
| 5 | Dùng Opus Clip cắt clip dài → CapCut dựng 8-12 clip ngắn; viết caption từng clip | Duyệt, chọn 1-2 câu mở đầu ưng ý nhất từ các phương án AI đề xuất |
| 6 | Lên lịch đăng tuần đầu qua Metricool (nội dung đã soạn ở file 12) | Đăng nhập kết nối Metricool (Task 10-12), xác nhận lịch đúng |
| 7 | Theo dõi số liệu tuần 1, viết báo cáo (mẫu file 14) | Đăng bài theo lịch nếu Metricool cần duyệt tay; trả lời bình luận đầu tiên |
| 8 | Phân tích pillar nào hiệu suất tốt nhất, đề xuất điều chỉnh tuần 9-10 | Quyết định có tăng tần suất pillar đang ăn khách không |
| 9-10 | Soạn thêm nội dung theo pillar được chọn; chuẩn bị thư gửi thêm 2-3 hãng | Tiếp tục đăng đều, cân nhắc thử 1 buổi livestream thật (không AI) vào khung giờ vàng |
| 11 | Tổng hợp kết quả 10 tuần, đề xuất mở rộng danh sách hãng | Quyết định mở rộng theo đề xuất hay không |
| 12 | Đánh giá: có nên bắt đầu chạy Meta Ads lookalike để tăng tốc không (thay vì chỉ organic) | Quyết định ngân sách quảng cáo thử nghiệm đầu tiên (nếu có) |

**Mốc "Hero" thực tế cho kênh mới, 0 kinh nghiệm:** đa số kênh ngách sức khỏe/dược liệu ở Việt Nam mất **3-6 tháng** đăng đều mới có vài nghìn đến vài chục nghìn follower ổn định — không có cách nào để AI "tua nhanh" giai đoạn này hợp pháp. Việc AI làm 90% là ở khâu **chuẩn bị nội dung**, không phải ở tốc độ tăng follower, vốn phụ thuộc thuật toán nền tảng và tần suất đăng đều đặn thật.

---

## Nguồn tham khảo (web search 2026-08-08)

- [Hannah Olala tạo dấu ấn với chiến lược mỹ phẩm cao cấp trên Shopee](https://congthuong.vn/hannah-olala-tao-dau-an-voi-chien-luoc-my-pham-cao-cap-tren-shopee-463999.media)
- [Hannah Olala lần đầu tiết lộ bí quyết bán thành công công ty 1.000 tỷ đồng](https://cafef.vn/hannah-olala-lan-dau-tiet-lo-bi-quyet-de-ban-thanh-cong-cong-ty-1000-ty-dong-chi-sau-4-nam-xay-dung-18826061613151871.chn)
- [Thấy gì từ thương vụ 750 tỷ của Hannah Olala và Marico?](https://kenh14.vn/thay-gi-tu-thuong-vu-750-ty-cua-hannah-olala-va-tap-doan-ty-do-marico-215260213100800105.chn)
- [HeyGen vs Kling AI 2026](https://www.selecthub.com/ai-video-generator-software/heygen-vs-kling-ai/)
- [Best AI Video Generators 2026](https://www.heygen.com/blog/best-ai-video-generators-tested-and-reviewed)
- [24/7 AI Digital Human Live Streaming — Tencent Cloud](https://www.tencentcloud.com/techpedia/143803?lang=en)
- [Host Live Shopping with AI Streamer — Virbo Live](https://virbo.wondershare.com/virbo-live.html)
- [TikTok Shop AI Booster](https://fchat.vn/blog/tiktok-shop-ai-booster-khi-thuat-toan-tiktok-tu-dong-tim-kiem-khach-hang-tiem-nang-cho-ban.html)

**Bổ sung 2026-08-09 (Veo + free video tools):**
- [Veo 3 Free Trial 2026: AI Studio, Flow & Free Credits](https://www.veo3ai.io/blog/veo3-free-trial-how-to-get-free-access-2026)
- [Google Veo Free Access 2026: Who Can Use It for Free and What It Costs](https://wideripples.com/google-veo-3-guide/)
- [7 Best Free AI Video Generators 2026: Tested & Ranked (No Watermark)](https://www.veo3ai.io/blog/best-free-ai-video-generators-2026)
