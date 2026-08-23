# TA Site Redesign Plan — Summary

## Overview
Redesign tasamngoclinh.com with luxury KGC styling (gold/cream/navy) using Vespi template.

## Key Scope
- **Hero:** Carousel (best-seller + seasonal rotation)
- **Gallery:** 3-col grid + zoom modal
- **i18n:** VI/EN bilingual (next-intl routing)
- **Payments:** Stripe + PayPal + Payos
- **Components:** shadcn/ui + Framer Motion animations

## 13 Tasks
| Phase | Tasks | Status |
|-------|-------|--------|
| 1. Foundation | Task 1-2: Setup Vespi + Figma design | 🔴 BLOCKED (template) |
| 2. Components | Task 3-5: Hero, gallery, product detail | ⏳ PENDING |
| 3. i18n | Task 6-7: Routing + Ollama translation | ⏳ PENDING |
| 4. Payments | Task 8-10: Stripe, PayPal, Payos | ⏳ PENDING |
| 5. QA | Task 11-13: Mobile, performance, testing | ⏳ PENDING |

**Timeline:** 40-45 hours (5-6 days)  
**Launch:** Sep 10, 2026  
**Budget:** <$120/month (Ollama = free)

---

## Files Created
- `tasks/plan.md` — full implementation plan
- `STATUS_CEO_REPORT.md` — detailed status by phase
- `SETUP.ps1` / `setup.sh` — environment setup
- `RUNBOOK.md` — execution guide
- 10+ scaffolded files (Phase 1-3 setup)

---

## Previous Work (DO NOT DELETE)
✅ Phase 1 scaffolding (Image pipeline: 4 tasks, setup guides)  
✅ Phase 2 scaffolding (Chatbot: 8 tasks, LLM + Rasa + Gradio)  
✅ Phase 3 scaffolding (Frontend: 5 tasks, UI components)

All committed to git with detailed setup guides per task.

---

## Next Action
**Template selection needed:**
- Vespi (recommended) ← use this
- v0.dev / Commerce / Custom

**Then:** Start Task 1 (Vespi setup + colors)
