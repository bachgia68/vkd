# Design: KOC Sâm TA — 24/7 AI Livestream + Auto-Sales System

**Date:** 2026-08-21
**Status:** Approved for planning

## Problem

TA cần triển khai KOC (chị gái, người thật, mặc áo dài hồng, cầm sâm tươi) livestream bán hàng 24/7 trên TikTok/Facebook/Shopee mà không cần người trực máy, dùng 100% công cụ free tier, tối thiểu token Claude.

Bổ sung so với plan gốc: HeyGen không có key sẵn (cần free avatar tool khác), cần agent persona chuyên sâu (không chỉ 1 prompt chung), cần xác nhận platform livestream không phụ thuộc máy tính bật liên tục.

## Decisions (từ brainstorming)

| Hạng mục | Quyết định | Lý do |
|---|---|---|
| **Avatar tool** | Test song song **EaseMate AI** + **SadTalker** (Colab) | EaseMate dễ dùng, tiếng Việt chuẩn; SadTalker 100% free backup nếu EaseMate hết credit |
| **Stream platform** | Hybrid: **OBS** (máy chạy, free, full control) + **GoStream** (cloud, không cần treo máy, có free/rẻ tier) | OBS launch nhanh trước; GoStream là target dài hạn để bỏ phụ thuộc máy tính bật 24/7 |
| **Agent personas** | Bắt đầu **1 Gemini prompt đơn giản** (viết script + trả comment) để launch nhanh → sau đó nâng cấp **3 persona đầy đủ** (Herbal Expert, TikTok Creator, Telesale) khi hệ thống ổn định | Ưu tiên tốc độ ra mắt, tránh over-engineering trước khi có traffic thật |
| **KOC identity** | **Người thật** (chị gái) | Cần xin phép sử dụng hình ảnh + giọng nói bằng văn bản (dù chỉ nội bộ gia đình), kiểm tra luật quảng cáo TPCN VN về lồng giọng AI trên gương mặt thật |

## Architecture (Updated)

```
KOC ảnh thật (chị gái, xin phép sử dụng)
   ↓
Script bank (Gemini, đơn giản trước — persona sau)
   ↓
Voice (TTS-Free/Viettel AI)
   ↓
Avatar Lip-sync ── EaseMate AI (primary) ── SadTalker (fallback)
   ↓
CapCut compositing (AI clip + B-roll thật + TTS cho B-roll)
   ↓
Master video 30 phút (modular: 5-10 AI clip 15-30s + 10-15 B-roll 5-10s, duplicate 3-4x)
   ↓
        ┌─────────────┴─────────────┐
        ↓                           ↓
   OBS (Phase 1, máy bật)      GoStream (Phase 2, cloud)
        ↓                           ↓
   TikTok / Facebook / Shopee Live (song song)
        ↓
   n8n webhook (comment listener)
        ↓
   Gemini reply (persona đơn giản → nâng cấp Telesale persona)
        ↓
   Auto-post reply + log vào CRM/Sheet
```

## Missing Pieces Identified (vs. Plan Gốc)

1. **KOC Permission Doc** — văn bản xin phép sử dụng hình ảnh/giọng chị gái (mới, Task 0)
2. **Avatar Tool Fallback** — SadTalker Colab setup nếu EaseMate hết credit (mới, Task 4b)
3. **B-roll TTS Voiceover** — dùng CapCut TTS lồng cho các đoạn cận cảnh sâm (bổ sung Task 6)
4. **GoStream Migration Path** — kế hoạch chuyển từ OBS sang cloud khi ổn định (mới, Phase 7)
5. **Compliance Check (TPCN Ads Law VN)** — Fact-Checker layer cho script trước khi публи (mới, Task 2b)
6. **CRM/Sheet Logging** — n8n lưu thông tin khách từ comment vào Google Sheet (bổ sung Task 9)
7. **Persona Upgrade Path** — mốc khi nào chuyển từ prompt đơn giản sang 3-persona đầy đủ (mới, Phase 8)
8. **Competitor Research (browser-use)** — theo dõi đối thủ bán sâm trên TikTok (optional, Phase 9)

## Non-Goals (giữ đúng YAGNI)

- KHÔNG dùng MetaGPT/CrewAI full multi-agent framework ngay (over-engineering cho giai đoạn launch)
- KHÔNG dùng LangGraph/Flowise chatbot y khoa sâu ngay (Phase 2, sau khi có traffic + dữ liệu thật)
- KHÔNG mua HeyGen/GoStream paid tier trước khi test free tier hết khả năng

## Success Criteria

- [ ] Stream 24/7 chạy ổn định ≥7 ngày liên tục (OBS phase)
- [ ] Comment bot trả lời ≤30s, đúng ngữ cảnh, tuân thủ luật TPCN
- [ ] Zero vi phạm chính sách quảng cáo (không bị flag/gỡ video)
- [ ] Token budget ≤15k/tuần (bao gồm cả script + comment + compliance check)
- [ ] Văn bản xin phép KOC hoàn tất trước khi publish

## Next Step

Invoke `planning-and-task-breakdown` skill để tạo task list đầy đủ 9 phase (bổ sung Task 0, 2b, 4b, và Phase 7-9 mới).
