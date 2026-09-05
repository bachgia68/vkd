# TA Extended Tools Wishlist (22 Total: 12 Core + 10 Optional)

**Version**: 1.0 (2026-08-20)

---

## 🎯 Core 12 (BẮT BUỘC)

| # | Name | Category | Status |
|----|------|----------|--------|
| 1 | superpowers | Harness | ✅ Active |
| 2 | ECC | Harness | ✅ Active |
| 3 | karpathy-skills | Harness | ✅ Active |
| 4 | ponytail | Harness | ✅ Active |
| 5 | anthropics/skills | Skills | ✅ Active |
| 6 | awesome-claude-skills | Skills | ✅ Active |
| 7 | wshobson/agents | Skills | ✅ Active |
| 8 | claude-mem | Memory | ✅ Active |
| 9 | graphify | Memory | ✅ Ready |
| 10 | repomix | Memory | ✅ Ready |
| 11 | github-mcp | Tools | ✅ Auto |
| 12 | playwright-mcp | Tools | ✅ Auto |

---

## 💡 Optional Tier-1 (Quick wins, 15-30% token savings)

| # | Name | Purpose | TA Use | Effort | Trạng thái thật (2026-08-24) |
|----|------|---------|--------|--------|------|
| 1 | **cc-switch** | Model swap (Haiku/Sonnet) | Low-complexity tasks | Low | ⚠️ KHÔNG phải npm — desktop app (Tauri, .msi/.zip Windows), Joe tự tải: [farion1231/cc-switch/releases](https://github.com/farion1231/cc-switch/releases) |
| 2 | **claude-code-router** | Định tuyến tác vụ tới model khác nhau | Chưa cấu hình dùng | Low | ✅ Cài xong `npm i -g claude-code-router`, lệnh `ccr` chạy được (v2.0.0) — CHƯA cấu hình routing |
| 3 | **system-prompts-ai** | Prompt optimization | Blog generation (batch) | Medium | ☐ Chưa cài — chỉ là tài liệu tham khảo, không phải tool |
| 4 | **caveman** | Response brevity | Reduce output token | Low | ✅ Auto (đã áp dụng qua CLAUDE.md global, không cần cài riêng) |
| 5 | **claude-hud** | Token dashboard | Budget visualization | Low | ✅ Xong 2026-09-03 — `jq` cài qua winget (jqlang.jq 1.8.2) + copy jq.exe vào `%APPDATA%\npm` (dir đã có sẵn trong PATH) vì claude-hud gọi `which jq` (POSIX) không chạy được trên cmd.exe/PowerShell thường; `claude-hud` chạy từ Git Bash cài statusline thành công, restart Claude Code để thấy |
| 6 | **awesome-mcp-servers** | MCP discovery | Add new APIs | Low | ✅ Đã có sẵn qua `mcp-registry` search tool trong môi trường này |

---

## 💎 Optional Tier-2 (Phase 2, add if major feature work)

| # | Name | Purpose | When |
|----|------|---------|------|
| 6 | **vibe-kanban** | Sprint board | Feature planning |
| 7 | **best-practice** | Code quality linter | CI/CD setup |
| 8 | **taste-skill** | Design audit | UI redesign |
| 9 | **codegraph** | Dependency map | KOL pipeline audit |
| 10 | **planning-with-files** | Task hierarchy | Complex feature spec |

---

## 🎓 Activation Timeline

**Phase 1 (Week 1-2)**: 12 core tools only
**Phase 1.5 (Week 2)**: Add cc-switch + claude-hud + system-prompts-ai
**Phase 2 (Week 3-4)**: Evaluate Tier-2 based on workload

---

See `TOOLS_SETUP_GUIDE.md` for detailed setup instructions.
