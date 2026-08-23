# Video repo — đã mở kiểm tra thật, chốt 2 recipe an toàn dùng cho TA

Ngày: 2026-08-13. Máy chú đang tắt (Docker/n8n không kết nối được lúc viết
file này) nên chưa render thử được video thật — đây là spec để chú/team áp
dụng khi máy bật lại, không phải video đã xong.

## Đã mở [Bomx/super-video-maker-skill](https://github.com/Bomx/super-video-maker-skill) ra xem thật (không chỉ đọc mô tả)

Repo có ~15 "recipe" (kịch bản dựng video khác nhau). Phần lớn dùng **HeyGen
avatar** (mặt người giả) — đúng như cảnh báo ở file 26, **không dùng nhóm
này**. Nhưng có 2 recipe khớp chính xác nguyên tắc TA đã chốt ("người thật
quay + AI chỉ hỗ trợ dựng"):

### 1. `captioned-talking-head` — dùng cho video KOL/thẩm định (Pillar 1-2)
Nhận **video đã quay thật** (`main.mp4` — Van Anh hoặc người thật khác đang
nói), tự động: tách phụ đề theo từng từ (Whisper), chèn b-roll (cảnh vườn
sâm/sản phẩm) đúng lúc câu nói nhắc tới, render qua Remotion. Không tạo mặt
giả — chỉ hậu kỳ cho tư liệu thật. Khớp đúng quy trình đã có ở file 11
"quy trình hậu kỳ" — recipe này tự động hoá phần chèn phụ đề + b-roll đang
làm tay.

### 2. `faceless-broll-ad` — dùng cho video bán hàng không cần người (Pillar 3-4)
Không có người trên khung hình — ghép cảnh (ưu tiên ảnh/video thật có sẵn
trong `video ban hang/`, chỉ generate AI b-roll khi thiếu cảnh) + giọng đọc +
phụ đề động + nhạc. Đúng tinh thần "AI cho bán hàng" đã thống nhất ở file 15.
Recipe tự ghi rõ trong code: **"Prefer real screenshots and stock over
generated"** — ưu tiên tư liệu thật trước khi generate.

## Setup thật cần có trước khi dùng được (chưa có sẵn, cần chú chuẩn bị)

- Node.js + Python đã cài trên máy (kiểm tra `node -v`, `python3 -V`).
- API key cần cho 2 recipe này: OpenAI (ảnh/b-roll fallback), có thể thêm
  ElevenLabs (giọng đọc) nếu chưa muốn tự thu âm. Không bắt buộc HeyGen (chỉ
  cần cho nhóm avatar mà TA không dùng).
- Whisper chạy local (dùng cho tách phụ đề) — cần máy đủ RAM, không phụ
  thuộc Docker/n8n.

## Cập nhật 2026-08-13 (máy đã bật lại) — ĐÃ CÀI THẬT

Cài vào `D:\TA page\video-pipeline\super-video-maker-skill\` (chung repo
video-pipeline hiện có, không đụng vào n8n/Strapi vì đây là tool riêng, chỉ
chạy khi gọi lệnh, không phải service nền):

- `git clone` repo về đúng vị trí trên — xong.
- `python3 -m pip install -r requirements.txt` — 22 package cài thành công
  (openai, ffmpeg-python, playwright, boto3...).
- `npm install` trong `remotion-template/` — 251 package, 0 lỗi bảo mật.
- Duyệt script cài đặt của `esbuild` (bundler Remotion cần) qua
  `npm approve-scripts esbuild` — không duyệt bước này Remotion sẽ không
  build được.
- Đang xác minh `npx remotion --version` chạy được (lần đầu cần tải Chrome
  headless cho engine render, mất vài phút — sẽ báo kết quả khi xong).

## Chưa có — cần chú chuẩn bị trước khi render video thật

1. **API key** — dán vào file `.env` (copy từ `.env.example` trong repo):
   bắt buộc `OPENAI_API_KEY` (dùng cho ảnh/b-roll fallback khi thiếu tư liệu
   thật). `ELEVENLABS_API_KEY` tuỳ chọn (nếu muốn giọng đọc AI thay vì tự
   thu âm). **Không cần** `HEYGEN_API_KEY` — TA không dùng avatar giả.
2. **Tư liệu quay thật** — video/ảnh thật để đưa vào recipe
   `captioned-talking-head` (đặt vào `remotion-template/public/source/`)
   hoặc `faceless-broll-ad` (dùng ảnh/video có sẵn trong `video ban hang/`).

## Bước tiếp theo khi có API key + tư liệu

Báo t, sẽ chạy thử render 1 clip ngắn thật bằng tư liệu có sẵn để kiểm tra
trước khi dùng cho video đăng thật.
