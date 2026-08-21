# TA Agent Library — Agency Agents Integration

**254 AI agents** from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents), organized by 17 divisions.

## Quick Start

### View Agent List
👉 **[Agent Registry Artifact](./AGENTS-REGISTRY.md)** — Interactive, filterable list with copy-paste commands.

### How to Use Agents in Claude Sessions

**Option 1: Direct Message (Simplest)**
```
@[agent-name] [your task]
```
Example:
```
@code-reviewer Review this PR for security issues
@product-manager Write product requirements for feature X
```

**Option 2: Use in System Prompt (For Entire Session)**
Add agent prompt to your session's system instructions before asking Claude to work on a task.

**Option 3: Copy Full Prompt**
Find agent in registry → copy full prompt text → paste into Claude.

## Divisions & Use Cases

| Division | Count | Best For |
|----------|-------|----------|
| **engineering** | 58 | Code review, architecture, testing, DevOps, databases |
| **specialized** | 57 | Niche domains: DeFi, ML ops, robotics, biotech, finance modeling |
| **marketing** | 36 | Content, campaigns, growth, analytics, brand |
| **security** | 12 | Penetration testing, compliance, threat modeling, SIEM |
| **gis** | 13 | Geospatial analysis, mapping, location intelligence |
| **sales** | 9 | Pitch strategy, negotiation, sales ops, deal analysis |
| **testing** | 9 | QA, test automation, performance testing, chaos engineering |
| **project-management** | 7 | Agile, roadmapping, resource planning, retrospectives |
| **paid-media** | 7 | Ads strategy, budget optimization, channel planning |
| **design** | 10 | UI/UX, design systems, visual design, UX research |
| **game-development** | 6 | Game design, mechanics, level design, narrative |
| **academic** | 6 | Research, thesis writing, literature reviews |
| **support** | 6 | Customer support, ticketing, escalation strategies |
| **product** | 5 | Product strategy, analytics, roadmap, competitive analysis |
| **finance** | 5 | Financial modeling, tax planning, valuation, analysis |
| **healthcare** | 3 | Clinical workflows, patient data, compliance |
| **spatial-computing** | 6 | AR/VR, spatial UI, immersive experiences |

## TA-Specific Agent Recommendations

### For Blog/Content
- `marketing-content-strategist` — Plan content, outline, structure
- `marketing-copy-editor` — Polish writing, brand voice
- `marketing-seo-specialist` — SEO optimization, keywords
- Use with `/make-blog-images` skill for images

### For Admin Backend
- `product-manager` — Feature planning, requirements
- `engineering-backend-architect` — Database schema, API design
- Use with `manage-admin-mockdata` skill

### For Product Photos
- `design-art-director` — Visual direction, composition
- Use with `make-premium-product-photos` skill

### For Code Reviews
- `engineering-code-reviewer` — Architecture, patterns, security
- `security-penetration-tester` — Security vulnerabilities

### For Deployment & DevOps
- `engineering-devops-engineer` — CI/CD, infrastructure
- `engineering-site-reliability-engineer` — Monitoring, incident response

### For Marketing & Campaigns
- `marketing-growth-strategist` — Growth hacking, channel planning
- `sales-sales-ops-manager` — Sales strategy, forecasting

## Load Agents Automatically (Optional)

To auto-load agents in all TA sessions, add to `.claude/settings.json`:
```json
{
  "agents": {
    "auto_load": [
      ".claude/agents/engineering/engineering-code-reviewer.md",
      ".claude/agents/product/product-manager.md",
      ".claude/agents/marketing/marketing-content-strategist.md"
    ]
  }
}
```

Then Claude will use these agents by default in all sessions.

## Full Catalog
See **[agents-catalog.json](.claude/agents-catalog.json)** for complete metadata (name, description, emoji, vibe) of all 254 agents.

---

**Last sync**: 2025-08-21  
**Source**: [Agency Agents Library](https://github.com/msitarzewski/agency-agents)
