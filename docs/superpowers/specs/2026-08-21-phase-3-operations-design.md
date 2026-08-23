# Phase 3: Operations Foundation — Autostart + Multi-Channel + Blog

**Date:** 2026-08-21  
**Author:** Claude Code  
**Status:** Design Approved  

---

## Overview

Phase 3 completes operational infrastructure for TA (Sâm Ngọc Linh): automating Strapi startup, enabling multi-channel content links, and generating luxury KGC-branded blog content. After Phase 3, verification of Phase 2 (Strapi ↔ Next.js integration) begins, followed by payment integration and livestream setup.

**Scope:** 3 independent tasks (autostart, multi-channel, blog generation) + sequence definition for "phase tiếp".  
**Timeline:** 1 day (parallel execution).  
**Budget:** <3tr VND/month (Ollama local = free, no new costs).

---

## Task 1: Strapi Autostart (.bat Script)

### Purpose
Eliminate manual startup friction: developer double-clicks `StartStrapi.bat` → Strapi runs + admin panel opens automatically.

### Implementation
- **File:** `StartStrapi.bat` (Windows batch)
- **Script logic:**
  ```batch
  @echo off
  cd /d "%~dp0"
  npm run develop > logs\strapi-startup.log 2>&1 &
  timeout /t 5
  start http://localhost:1337/admin
  ```
- **Prerequisite:** `npm install` already done in Phase 2 setup
- **Logging:** Output → `logs/strapi-startup.log` (gitignored)

### Success Criteria
- [ ] `.bat` file exists in project root
- [ ] Double-click starts Strapi without manual terminal commands
- [ ] Browser opens to http://localhost:1337/admin within 10 seconds
- [ ] Strapi admin loads (login screen if fresh, or dashboard if previous session cached)

### Dependencies
None (independent, uses existing Strapi config).

---

## Task 2: Multi-Channel Posting (Strapi Admin Links)

### Purpose
Enable foot er to link to Facebook fanpage + TikTok (in addition to YouTube/Instagram from Phase 1). Support future social expansion.

### Implementation
**Strapi Collection Schema Update** (SiteFooter):
Add 2 new text fields to existing SiteFooter collection:
- `facebookFanpage` — URL string, optional, placeholder: "https://facebook.com/..."
- `tiktokProfile` — URL string, optional, placeholder: "https://tiktok.com/..."

**Frontend (already handles):**
- Footer component (`components/Footer.tsx`, Phase 2) already renders social links dynamically from Strapi
- New fields auto-render as new icons in footer (5 total: YouTube, Instagram, Facebook, TikTok, + 1 reserve)

### Success Criteria
- [ ] Strapi admin "Site Footers" collection shows 2 new input fields (FB + TikTok)
- [ ] User can enter URLs in admin
- [ ] Save & Publish works
- [ ] Frontend footer displays all 5 social icons (4 active, 1 future)
- [ ] Links are clickable (manual click-to-share, no auto-posting)

### Dependencies
Phase 1 (SiteFooter collection exists + Footer component).

---

## Task 3: Blog Post Generation (9 Posts, KGC Luxury Brand)

### Purpose
Seed blog with 9 high-quality posts on mountain life + Ngọc Linh natural beauty, following KGC luxury aesthetic and existing blog template rules.

### Content Strategy
**Topics (9 posts):**
- Mountain Life (3): Local ecosystem, farming methods, seasonal rhythms
- Ngọc Linh Beauty (6): Product origins, natural properties, usage stories, gift value, health benefits, terroir

### Implementation
1. **Ollama Local Generation:**
   - Use Ollama (free, on-device)
   - Prompt template: KGC brand tone (luxury, educational, non-medicinal language per compliance rules)
   - Reference: `/anthropic-skills:brand-guidelines` for tone/voice

2. **Blog Post Template (Phase 1 standard):**
   ```markdown
   Title: [Auto-generated, SEO-friendly]
   Slug: [kebab-case, unique]
   Content: [800-1200 words, with compliance-checked language]
   Images: [2 per post, KGC-styled descriptions]
   Published: false (awaiting user approval)
   ```

3. **Image Sourcing:**
   - 18 total images (2 per post, KGC visual style: gold/cream/navy, luxury photography)
   - Can source from: existing assets, stock (Unsplash gold/nature), or generated (Gamma/Claude Design)
   - Ensure no image duplicates across posts

4. **User Approval Workflow:**
   - Generate 9 posts → save to Strapi (unpublished)
   - User reviews all 9 in Strapi admin
   - User approves each post (toggle `published: true`)
   - After approval, auto-publish 1/day at 8h (existing cadence)

### Success Criteria
- [ ] 9 blog posts generated via Ollama
- [ ] All comply with compliance rules (no medical claims)
- [ ] Each post has 2 images (KGC-styled, no duplicates)
- [ ] Posts visible in Strapi blog collection (unpublished state)
- [ ] User approves all 9
- [ ] Auto-publishing cadence active (1/day at 8h)

### Dependencies
Phase 1 (blog collection + template rules).

---

## Task 4: Phase tiếp Sequence (Next Phase Definition)

### Order (After Phase 3 Done)
1. **Test Phase 2** — Verify Strapi ↔ Next.js integration live
   - Hero section fetches + renders from Strapi
   - Footer (with new social links) dynamic from Strapi
   - Multi-language switching (i18n) functional
   
2. **Payments Integration** — Stripe/PayPal/Payos checkout
   - Follows plan.md Phase 4 (Tasks 8-10)
   
3. **Livestream Setup** — KOC Mai 24/7 stream
   - OBS (initial) or recommended tools:
     - **Restream Studio** (multi-platform broadcast)
     - **GoStream** (cloud-based, no local PC)
     - **Streamlabs Desktop** (beginner-friendly)
     - **Owncast** (self-hosted open-source)
     - **StreamYard** (browser-based, templates)

### Recommendation
For KOC Mai livestream:
- **Primary:** Restream Studio (1 stream → TikTok + FB + YouTube + Shopee simultaneously)
- **Backup:** GoStream (24/7 cloud loop, no PC dependency)
- Skip pure OBS; combine with Restream for multiplexing.

---

## Architecture & Dependencies

```
Phase 3 (independent, parallel execution possible)
├── Task 1: Autostart (.bat)
│   └── No dependencies
├── Task 2: Multi-channel links (Strapi admin)
│   └── Depends on Phase 1 (SiteFooter collection)
└── Task 3: Blog generation (Ollama local)
    ├── Depends on Phase 1 (blog template)
    └── Requires user approval before auto-publish

Phase tiếp (sequential)
├── Test Phase 2
│   └── Verify Phase 1 + 2 components (Hero, Footer, i18n)
├── Payments (Phase 4 per plan.md)
│   └── Stripe/PayPal/Payos checkout
└── Livestream (Phase 5+ per todo.md + OBS → Restream/GoStream)
    └── KOC Mai 24/7 auto-loop + comment automation
```

---

## Files Changed/Created

| File | Type | Purpose |
|------|------|---------|
| `StartStrapi.bat` | New | Autostart script |
| `logs/` | Dir | Startup logging (gitignored) |
| Strapi collection (SiteFooter) | Update | Add FB + TikTok fields |
| 9 blog posts | New (Strapi) | Content in blog collection |
| 18 images | New | Blog post images (KGC-styled) |

---

## Success Metrics

| Task | Metric | Target |
|------|--------|--------|
| Autostart | Startup time | <10s browser open |
| Multi-channel | Admin fields | 2 new input fields live |
| Blog | Posts generated | 9 posts + approval → auto-publish |
| Phase tiếp | Definition | Clear sequence (Test → Payments → Live) |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ollama generation quality | Medium | Use brand-guidelines + user review gate |
| Image sourcing delays | Medium | Pre-stage images before gen, or use stock |
| Strapi collection schema breaking | Low | Non-destructive field addition |
| Blog cadence timing conflicts | Low | Verify cron job not overlapping with other tasks |

---

## Notes

- Ollama local (free): no API costs, on-device privacy
- Multi-channel links are manual (no API auto-posting required; user clicks to share)
- Phase 3 is operational foundation; testing + payments follow in strict order
- KGC brand consistency maintained via brand-guidelines skill

---

**Next Step:** Invoke writing-plans skill to create detailed implementation plan + task breakdown.
