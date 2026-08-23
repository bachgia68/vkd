# Task Checklist: KOC Sâm TA 24/7 Livestream (Full — 9 Phases)

Design: `docs/superpowers/specs/2026-08-21-koc-livestream-design.md`

## Phase 0: Permission & Compliance Foundation

### [x] Task 0: KOC Permission Document — CONFIRMED (user xác nhận bằng lời, chưa có văn bản ký chính thức lưu trữ)
- Văn bản xin phép chị gái dùng hình ảnh + giọng nói (kể cả lồng AI voice trên mặt thật)
- Ghi rõ: phạm vi dùng (livestream/video), thời hạn, quyền rút lại
- Files: `docs/legal/koc-permission-mai.md` (ký tên/xác nhận)
- Scope: XS | Dependencies: None
- **BLOCKING — không làm Task 1 nếu chưa có văn bản này**

### [x] Task 0b: Compliance Reference Check — DONE (docs/compliance/tpcn-ad-rules-vn.md)
- Tra cứu Nghị định quảng cáo TPCN (từ ngữ cấm: "điều trị", "chữa khỏi"...)
- Tạo blacklist từ khóa + whitelist thay thế ("hỗ trợ", "cải thiện")
- Files: `docs/compliance/tpcn-ad-rules-vn.md`
- Scope: XS | Dependencies: None

✓ **Checkpoint 0:** Permission ký + compliance rules sẵn sàng → Proceed

## Phase 1: Foundation & Asset Prep

### [x] Task 1: KOC Avatar Image Prep — DONE (koc_mai.jpg cropped 1080x1920, saved assets/kol-mai/kol-avatar-9-16.png)
- Crop 9:16 (1080×1920), face+hands rõ, test cả EaseMate + SadTalker
- Files: `assets/kol-mai/kol-avatar-9-16.png`
- Scope: XS | Dependencies: Task 0

### [x] Task 2: Sales Script Bank — DONE (Ollama 1,3,4 + Groq gpt-oss-120b 2,5; scripts/batch-1-scripts.json)
- 5 scripts (45-60s): sâm giả, cách ngâm, ưu đãi, testimonial, Q&A
- Dùng whitelist từ Task 0b, tránh từ cấm
- Files: `scripts/batch-1-scripts.json`
- Scope: S | Dependencies: Task 0b | Token: ~500

### [x] Task 2b: Compliance Self-Check — DONE (scripts/compliance-check.js, all 5 PASS)
- Chạy Gemini fact-check pass: scan script vs blacklist từ khóa (Task 0b)
- Nếu vi phạm → sửa lại trước khi qua Task 3
- Files: `scripts/compliance-check-log.json`
- Scope: XS | Dependencies: Task 2, 0b | Token: ~100

### [ ] Task 3: Voiceover Generation (TTS Parallel)
- 5 MP3 (Vietnamese, TTS-Free/Viettel AI)
- Files: `audio/script-{1-5}-voiceover.mp3`
- Scope: XS | Dependencies: Task 2b

✓ **Checkpoint 1:** Ảnh + script (đã compliance-check) + audio sẵn sàng → Proceed

## Phase 2: AI Video Generation

### [ ] Task 4: EaseMate AI Lip-Sync (Primary)
- Upload avatar + audio → 5 MP4 (mouth/eye sync)
- Files: `video/ai/script-{1-5}-easemate.mp4`
- Scope: M | Dependencies: Task 1, 3 | Note: theo dõi credit free tier

### [ ] Task 4b: SadTalker Fallback (nếu EaseMate hết credit)
- Setup Colab notebook, test avatar + audio → MP4 backup
- Chỉ chạy nếu Task 4 không đủ 5/5 video
- Files: `video/ai/script-{X}-sadtalker.mp4`, `docs/SADTALKER_COLAB_SETUP.md`
- Scope: S | Dependencies: Task 4 (conditional)

### [ ] Task 5: B-roll Real Footage
- Quay 10-15 clip (5-10s): rửa sâm, thái lát, hũ ngâm, nhãn hiệu TA
- Files: `video/real/ginseng-*.mp4`
- Scope: S | Dependencies: None (song song Task 4)

✓ **Checkpoint 2:** ≥5 AI video (EaseMate/SadTalker) + 10+ B-roll sẵn sàng → Proceed

## Phase 3: Compositing

### [ ] Task 6: CapCut Master Video (Modular)
- Ghép: AI clip 15-30s xen B-roll 5-10s (có TTS lồng cho B-roll), lặp 3-4x → 30 phút
- Nhạc nền, caption auto, chốt đơn graphic
- File: `video/master/kol-master-30min-loop.mp4`
- Scope: L (2-3h) | Dependencies: Task 4/4b, 5

✓ **Checkpoint 3:** Master video 30 phút export, play mượt → Proceed

## Phase 4: Livestream (OBS Phase 1)

### [ ] Task 7: OBS Setup
- Scene "KOC 24/7", Media Source Loop, stream key TikTok/FB/Shopee
- Config: `obs-config/kol-stream.json`
- Scope: M | Dependencies: Task 6

### [ ] Task 8: Platform Verification (30-min test)
- Live đồng thời 3 platform, verify loop/lag/comment
- Scope: S | Dependencies: Task 7

✓ **Checkpoint 4:** Stream ổn định 30 phút, zero crash → Proceed

## Phase 5: Comment Automation

### [ ] Task 9: n8n Webhook + CRM Logging
- Listen comment → Gemini reply (≤30s) → post → log khách vào Google Sheet
- Scope: M | Dependencies: Task 8 | Token: ~200/comment

### [ ] Task 10: Response Templates (Simple Prompt)
- 4-5 template: Q&A, skeptic, compliment, off-topic — tuân thủ compliance (Task 0b)
- Files: `prompts/gemini-comment-templates.json`
- Scope: S | Dependencies: Task 9

✓ **Checkpoint 5:** Bot live, 5+ comment test đúng ngữ cảnh + compliant → Proceed

## Phase 6: Launch & Monitoring

### [ ] Task 11: 24/7 Monitoring (OBS)
- Auto-restart reboot, health check 2h, Telegram alert nếu offline >5 phút
- Files: `scripts/obs-monitor.ps1`, `n8n-workflows/kol-stream-monitor.json`
- Scope: M | Dependencies: Task 7-10

### [ ] Task 12: Weekly Content Refresh
- Template: script → voice → avatar → CapCut swap (rollback plan)
- Schedule: Thứ 2, 8:00 AM
- Scope: M | Dependencies: All Phase 1-5

✓ **Checkpoint 6:** 24/7 live ổn định ≥7 ngày, refresh cycle test OK → Proceed

## Phase 7: OBS → GoStream Migration (Cloud, không treo máy)

### [ ] Task 13: GoStream Account Setup + Test
- Đăng ký GoStream, upload 1 video test, verify loop 24/7 trên cloud
- Scope: S | Dependencies: Checkpoint 6 passed

### [ ] Task 14: Parallel Run (OBS + GoStream 1 tuần)
- Chạy song song 7 ngày, so sánh uptime/chất lượng/chi phí
- Files: `docs/OBS_VS_GOSTREAM_COMPARISON.md`
- Scope: S | Dependencies: Task 13

### [ ] Task 15: Full Migration to GoStream (nếu pass)
- Tắt OBS, chuyển hoàn toàn qua GoStream, cập nhật monitoring (Task 11) trỏ sang GoStream API
- Scope: M | Dependencies: Task 14 (chỉ nếu GoStream thắng)

✓ **Checkpoint 7:** Không còn phụ thuộc máy tính bật liên tục (nếu migrate) → Proceed

## Phase 8: Persona Upgrade (Simple Prompt → 3 Full Personas)

**Trigger: Chỉ bắt đầu khi Checkpoint 6 pass VÀ có traffic thật ≥2 tuần**

### [ ] Task 16: Herbal/TCM Expert Persona
- System prompt đầy đủ (Mission/Persona/Directives/Tone/Output) cho tư vấn y học
- Files: `personas/herbal-expert-system-prompt.md`
- Scope: S | Dependencies: Checkpoint 6 + traffic data

### [ ] Task 17: TikTok Creator Persona
- System prompt cho viết script (thay thế Task 2 prompt đơn giản)
- Files: `personas/tiktok-creator-system-prompt.md`
- Scope: S | Dependencies: Task 16

### [ ] Task 18: Telesale Closing Persona
- System prompt cho comment reply nâng cao (thay Task 10 template đơn giản), objection handling
- Files: `personas/telesale-system-prompt.md`
- Scope: S | Dependencies: Task 16

### [ ] Task 19: A/B Test Persona vs Simple Prompt
- So sánh conversion/engagement 1 tuần trước/sau nâng cấp persona
- Files: `docs/PERSONA_AB_TEST_RESULTS.md`
- Scope: S | Dependencies: Task 17, 18

✓ **Checkpoint 8:** Persona đầy đủ live, A/B test data thu thập → Optional, evaluate ROI

## Phase 9: Competitor Research (Optional)

### [ ] Task 20: browser-use Setup for Competitor Scan
- Cấu hình browser-use tự động quét TikTok Seller Center / Shopee Affiliate
- Scope: M | Dependencies: None (independent, chạy bất kỳ lúc nào)

### [ ] Task 21: Weekly Competitor Report
- Tổng hợp video xu hướng, giá, khuyến mãi đối thủ sâm
- Files: `docs/reports/competitor-scan-{date}.md`
- Scope: S | Dependencies: Task 20

✓ **Checkpoint 9 (Optional):** Competitor data feed vào Task 12 refresh cycle

---

## Summary

| Phase | Tasks | Trigger | Priority |
|---|---|---|---|
| 0. Permission/Compliance | 0, 0b | Trước hết | **BLOCKING** |
| 1. Foundation | 1-3, 2b | Sau Phase 0 | Core |
| 2. AI Video | 4, 4b, 5 | Sau Phase 1 | Core |
| 3. Compositing | 6 | Sau Phase 2 | Core |
| 4. Livestream OBS | 7-8 | Sau Phase 3 | Core |
| 5. Automation | 9-10 | Sau Phase 4 | Core |
| 6. Launch | 11-12 | Sau Phase 5 | Core |
| 7. GoStream Migration | 13-15 | Sau 7 ngày ổn định | Nâng cao (optional nhưng khuyến nghị) |
| 8. Persona Upgrade | 16-19 | Sau 2 tuần có traffic | Nâng cao (data-driven) |
| 9. Competitor Research | 20-21 | Bất kỳ lúc nào | Optional |

**Core path (Phase 0-6):** 21 task → 15 task chính, launch trong ~10-14 ngày
**Full path (all 9 phase):** 21 task, launch core trước, mở rộng theo data

## Token Budget (Weekly, Core Phase)

- Script (Task 2): ~500
- Compliance check (Task 2b): ~100
- Comments (Task 9-10): ~200/comment × ~350/tuần = ~10k
- **Total:** ~10.6k/tuần (Core). Phase 8 persona thêm ~1-2k/tuần khi active.

## Tool Stack

- **avatar:** EaseMate AI (primary) + SadTalker Colab (fallback)
- **stream:** OBS (Phase 1) → GoStream (Phase 7, khi ổn định)
- **automation:** n8n + Gemini
- **video:** CapCut PC
- **compliance:** Manual reference doc (Task 0b) + Gemini self-check (Task 2b)
- **monitoring:** Telegram bot (@tasamngoclinh_bot) + n8n

## Critical Path — Không được bỏ qua

1. **Task 0 (Permission)** — KHÔNG làm gì tiếp nếu chưa xin phép chị gái bằng văn bản
2. **Task 0b + 2b (Compliance)** — mọi script PHẢI qua compliance check trước khi lên video/live
3. **Task 4b (Fallback)** — chỉ chạy nếu Task 4 thiếu video, không phải bắt buộc luôn

