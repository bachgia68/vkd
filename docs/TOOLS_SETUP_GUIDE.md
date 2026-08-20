# TA Project — Tools & MCP Setup Guide

**Last updated**: 2026-08-20 · **Version**: 1.0

## Quick Start (Phiên Mới)

1. **Đọc memory** (2 min):
   ```bash
   cat .claude/projects/D--TA-page-site/memory/MEMORY.md
   cat .claude/projects/D--TA-page-site/memory/tools_and_harness_config_2026_08_20.md
   ```

2. **Invoke orientation**:
   ```
   /superpowers:using-superpowers
   ```

3. **Track budget** (beginning of session):
   - Expected spend: ~300k token/day
   - Budget limit: ~2.7tr VND (assume 1 VND ≈ 100 token)
   - Alert at 80% = stop new non-critical work

---

## 12 Core Tools — Setup Status

### ✅ Already Active

| # | Tool | Status | Action |
|----|------|--------|--------|
| 1 | **superpowers** | ✅ Active | Use `/superpowers:*` before tasks |
| 2 | **ECC** | ✅ In CLAUDE.md | Follow "no re-derive" rule |
| 3 | **karpathy-skills** | ✅ In CLAUDE.md | No reinvention |
| 4 | **ponytail** | ✅ Memory | Log token spend EOD |
| 5 | **anthropics/skills** | ✅ Auto | Use when needed |
| 6 | **awesome-claude-skills** | ✅ Auto | Grep before copy |
| 7 | **wshobson/agents** | ✅ Auto | Use Workflow for multi-agent |
| 8 | **claude-mem** | ✅ Active | Update MEMORY.md |
| 9 | **graphify** | ⚠️ On-demand | Run when needing codebase snapshot |
| 10 | **repomix** | ⚠️ On-demand | Run before handoff |
| 11 | **github-mcp** | ✅ Auto | Commit/PR management |
| 12 | **playwright-mcp** | ✅ Auto | UI screenshot & verify |

---

## 📊 Token Budget Breakdown

**Monthly**: <3tr VND = ~300k token/day

| Activity | Token/day | % |
|----------|-----------|-----|
| Blog generation (batch weekly) | 40k | 13% |
| Interactive tasks | 150k | 50% |
| Code review (ultra) | 60k | 20% |
| Debugging, exploration | 50k | 17% |

**Optimization**: ECC (-30%), cc-switch (-20%), caveman (-10%) = potential -50% total

---

## 🚀 Session Workflow

1. **Start**: Read MEMORY.md + invoke `/superpowers:using-superpowers`
2. **During**: Use skill before each task, track token spend
3. **End**: Update memory, run repomix snapshot, commit

See full guide in `EXTENDED_TOOLS_WISHLIST.md`
