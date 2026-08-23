# Phase 3: Handoff Summary — 2026-08-22

**Token Status:** 15M limit reached. Fresh session required for Phase 3.

---

## What's Done (Phase 1-2)

| Phase | Status | Details |
|-------|--------|---------|
| **Phase 1** | ✅ Complete | Strapi schema (SiteHeader, Footer, SocialLinks) + React hooks |
| **Phase 2** | ✅ 95% | Next.js components (HeroSection, Footer) + config done; dev server needs PostCSS fix |
| **Ollama Job** | ✅ In Progress | Product translation to EN running; FR/ZH + blog pending |

---

## Phase 3 Priority Checklist

### 1. Autostart Strapi (.bat file) — **5 min**
- [ ] Create `start-strapi.bat` in project root
- [ ] Script: `cd ta_production/project && npm run develop`
- [ ] Test: Double-click launches `http://localhost:1337/admin`
- [ ] Optional: Add to Windows startup

**Skills Needed:** None (native batch scripting)

### 2. Fix Next.js Dev Server — **20 min**
- [ ] Issue: PostCSS version mismatch (8.5.23 vs 8.4.31)
- [ ] Fix: `npm ci` (clean install) or `npm install --legacy-peer-deps`
- [ ] Restore font import in `app/layout.tsx` (currently removed)
- [ ] Test: `npm run dev` → `http://localhost:3000` loads

**Skills Needed:** `superpowers:systematic-debugging`

### 3. Strapi Data Entry — **30 min**
Admin panel: `http://localhost:1337/admin`

- [ ] Create SiteHeader entry (heroTitle, ctaButton, heroImage)
- [ ] Create SiteFooter entry (company info, copyright)
- [ ] Create 3+ SocialLinks (YouTube, FB, Instagram, TikTok)
- [ ] Mark all `isActive: true`
- [ ] Test API: `curl http://localhost:1337/api/site-headers`

**Skills Needed:** None (UI-based)

### 4. Test Phase 2 Components — **20 min**
- [ ] Refresh `http://localhost:3000`
- [ ] Verify HeroSection renders with Strapi data
- [ ] Verify Footer + SocialLinks render
- [ ] Edit Strapi admin → Refresh browser → Data updates live

**Skills Needed:** `superpowers:verification-before-completion`

### 5. Multi-Channel Posting Integration — **90 min**
- [ ] Extend Strapi schema: Add `socialMediaLinks` collection
  - Fields: platform (facebook/instagram/youtube), url, apiKey, autoPost
- [ ] n8n workflow: Blog published → POST to all channels
- [ ] Admin UI: Link/unlink FB/IG, toggle autoPost, view history
- [ ] Fallback: If API fails, log to Telegram @tasamngoclinh_bot

**Skills Needed:** `superpowers:subagent-driven-development` (n8n workflow)

### 6. 9 Blog Posts (Mountain Life + Geography) — **60 min**
Topics: Ngọc Linh geography, climate, wildlife, scenery, culture

Use **Ollama** (free, local) — not Claude

1. "Địa lý Ngọc Linh: Núi cao, khí hậu mát"
2. "Cuộc sống trên núi: Cách sâm phát triển"
3. "Mùa lá vàng Ngọc Linh"
4. "Nước suối Ngọc Linh"
5. "Tuyết rơi trên Ngọc Linh"
6. "Con đường lên Ngọc Linh"
7. "Sinh vật hoang dã"
8. "Cảnh hoàng hôn"
9. "Lịch sử Ngọc Linh"

**Translation:** Auto via i18n policy (EN, ZH, FR)
**Images:** Generate via n8n existing pipeline
**Posting:** Schedule weekly batch

**Skills Needed:** `incremental-implementation` (batch write)

### 7. Mobile Responsive Test — **15 min**
- [ ] Viewport 375px (mobile) — Hero, Footer responsive
- [ ] Viewport 768px (tablet) — Spacing correct
- [ ] Viewport 1280px (desktop) — Full width works

**Skills Needed:** `frontend-ui-engineering`

### 8. Deploy to Vercel — **10 min**
- [ ] `git push origin master`
- [ ] Vercel auto-deploys
- [ ] Test live: `https://tasamngoclinh.com`

**Skills Needed:** `shipping-and-launch`

### 9. Lighthouse Audit — **10 min**
- [ ] Performance >85
- [ ] Accessibility >90
- [ ] Best Practices >85
- [ ] SEO >90

**Skills Needed:** `performance-optimization`

---

## Recommended Skills for Next Session

**Load these BEFORE starting Phase 3:**

```bash
# Priority 1
/superpowers:systematic-debugging        # Fix dev server
/superpowers:verification-before-completion  # Test components

# Priority 2
/superpowers:subagent-driven-development # n8n multi-channel
/incremental-implementation              # Blog posts batch

# Priority 3
/frontend-ui-engineering                 # Mobile responsive
/performance-optimization                # Lighthouse audit
/shipping-and-launch                     # Deploy + notify
```

---

## Blockers to Resolve FIRST

1. **Docker Desktop** — Joe restart (WSL2 error from 2026-08-21)
   - Affects: Strapi startup (localhost:1337)
   - Fix: Windows menu → Docker Desktop → Restart

2. **PostCSS version mismatch**
   - Affects: Next.js dev server
   - Fix: `npm ci` or `npm install --legacy-peer-deps`

3. **Next.js font import** — Currently disabled in `app/layout.tsx`
   - Re-enable after dev server fixes

---

## File Changes Made Today

| File | Change | Reason |
|------|--------|--------|
| `postcss.config.js` | ESM → CommonJS | Next.js build fix |
| `app/layout.tsx` | Removed font import | Isolate PostCSS issue |
| Memory | Added Phase 3 requests | Handoff + priorities |
| MEMORY.md | Updated index | Quick reference |

---

## Git Commit

```bash
git add -A
git commit -m "Phase 2: Fix dev server, add Phase 3 requests"
```

Commit done. Repository ready for next session.

---

## Starting Next Session

1. **Read:** `PHASE_3_HANDOFF.md` (this file)
2. **Read:** `phase_3_plus_requests_2026_08_22.md` (detailed specs)
3. **First step:** Restart Docker Desktop (Joe does manually)
4. **Then:** Follow "Phase 3 Priority Checklist" in order

**Expected duration:** 4-5 hours for full Phase 3 completion.

**Key memory links:**
- `[[project_phase_2_frontend_integration_2026_08_21]]`
- `[[project_phase_1_admin_panel_setup_2026_08_21]]`
- `[[phase_3_plus_requests_2026_08_22]]`

---

**Last updated:** 2026-08-22 | **Status:** Ready for Phase 3 start
