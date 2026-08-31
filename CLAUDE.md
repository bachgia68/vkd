# TA Website (Sâm Ngọc Linh) — bắt buộc đọc trước khi sửa

Trước khi thêm/sửa bất cứ tính năng, nội dung, section, hay trang admin nào
trong repo này, đọc **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** trước
— đây là chuẩn thiết kế + chuẩn nội dung bắt buộc, chốt để site không lệch
chuẩn qua từng lần sửa. Không tự sáng tạo pattern mới khi tài liệu đó đã có
pattern tương đương (ảnh, section ẩn/hiện, bài viết, trang admin...).

Các skill chi tiết theo từng việc: xem `.claude/skills/vkd-web/SKILL.md` để
biết chọn skill nào (products, PayOS, admin mock data, deploy, feature audit).

# Agency Agents Library — 254 AI Agents Available

Dự án TA đã tích hợp **254 AI agent personalities** từ [Agency Agents](https://github.com/msitarzewski/agency-agents) library.
Các agents này giúp chuẩn hóa workflows, code review, content, design, security, và hơn thế.

## Quick Start: Use Agents

**Cách 1: Mention trực tiếp**
```
@[agent-name] [task]
```
Ví dụ:
```
@engineering-code-reviewer Review PR này, tìm security issues
@marketing-content-strategist Viết outline cho blog: "Tại sao sâm TA tốt hơn"
@product-manager Viết requirements cho feature X
```

**Cách 2: Xem registry + copy prompt**
- Mở **Agent Registry** artifact (see links below)
- Tìm agent cần
- Copy agent ID
- Mở file `.claude/agents/[division]/[agent-id].md`
- Copy full prompt, paste vào Claude

**Cách 3: Auto-load agents (tất cả sessions)**
Edit `.claude/settings.json`:
```json
{
  "agents": {
    "auto_load": [
      ".claude/agents/engineering/engineering-code-reviewer.md",
      ".claude/agents/marketing/marketing-content-strategist.md"
    ]
  }
}
```

## Agent Divisions (17 divisions, 254 agents)

| Division | Count | Dùng cho |
|----------|-------|---------|
| engineering | 58 | Code review, architecture, testing, DevOps, databases |
| specialized | 57 | DeFi, ML ops, robotics, biotech, finance modeling |
| marketing | 36 | Content, campaigns, growth, analytics, branding |
| security | 12 | Penetration testing, compliance, threat modeling |
| gis | 13 | Geospatial analysis, mapping, location intelligence |
| sales | 9 | Pitch strategy, negotiation, deal analysis |
| testing | 9 | QA, test automation, performance testing |
| design | 10 | UI/UX, design systems, visual design |
| project-management | 7 | Agile, roadmapping, resource planning |
| paid-media | 7 | Ads strategy, budget optimization |
| game-development | 6 | Game design, mechanics, level design |
| spatial-computing | 6 | AR/VR, spatial UI |
| academic | 6 | Research, thesis writing, literature reviews |
| support | 6 | Customer support, escalation |
| product | 5 | Product strategy, analytics, roadmap |
| finance | 5 | Financial modeling, tax, valuation |
| healthcare | 3 | Clinical workflows, patient data |

## TA-Specific Agent Recommendations

### Viết Blog
```
@marketing-content-strategist → Outline bài viết
@marketing-copy-editor → Polish nội dung
@marketing-seo-specialist → SEO optimization
Use /make-blog-images → Tạo ảnh
```

### Admin Features
```
@product-manager → Requirements
@engineering-backend-architect → Schema + API design
@testing-qa-engineer → Test cases
Use /manage-admin-mockdata → Seed data
```

### Product Photos
```
@design-art-director → Visual direction (luxury style)
Use /make-premium-product-photos → Generate ảnh
@design-art-director → Review + refine
```

### Code Review + Security
```
/code-review --comment
@engineering-code-reviewer → Review findings
@security-penetration-tester → Security audit
```

### Deployment
```
@engineering-devops-engineer → CI/CD strategy
Use /deploy-vkd-site → Deploy to Vercel
```

## Resources

- **📋 Agent Registry** — Interactive, searchable list of all 254 agents (artifact)
- **🎯 Claude Workflow Tips** — Slash commands, MCP, best practices (artifact)
- **📖 .claude/AGENTS.md** — Full documentation
- **🔧 .claude/agents/** — All agent prompt files organized by division
- **📊 .claude/agents-catalog.json** — Machine-readable agent metadata

## Lệnh hay dùng

| Lệnh | Dùng cho |
|------|---------|
| `/help` | Liệt kê tất cả commands |
| `/config` | Cấu hình Claude (model, theme) |
| `/fast` | Bật fast mode (Opus faster output) |
| `/code-review` | Code review + analysis |
| `/plan` | Plan mode trước khi code |
| `/loop 5m [command]` | Chạy command every 5 min |
| `/skills` | Liệt kê skills cho repo |

**Xem toàn bộ tips & tricks tại: `.claude/claude-workflow-tips.md`**
