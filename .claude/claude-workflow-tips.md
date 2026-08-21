# Claude + Agency Agents — Workflow Tips & Tricks

Master Claude, slash commands, and the 254-agent library for maximum productivity in TA.

## Essential Slash Commands

| Command | What it does | Example |
|---------|------------|---------|
| `/help` | List all available commands | `/help` |
| `/config` | Edit Claude Code settings (model, theme, etc.) | `/config` |
| `/fast` | Toggle fast mode (Opus with faster output) | `/fast` |
| `/code-review` | Launch code review skill (search codesbase + analyze) | `/code-review --fix` |
| `/simplify` | Auto-refactor code for clarity & efficiency | `/simplify` |
| `/skills` | List available skills for this repo | `/skills` |
| `/loop` | Run command/prompt on recurring interval | `/loop 5m /check-tests` |
| `/run` | Execute & preview your app locally | `/run` |
| `/plan` | Enter plan mode (design before code) | `/plan` |
| `/clear` | Clear conversation context | `/clear` |

## Using Agents in Sessions

### Method 1: Direct @ Mention (Simple)
```
@[agent-name] [your task]
```
Example:
```
@engineering-code-reviewer Review this PR for security issues
@marketing-content-strategist Outline a blog post about our new feature
@product-manager Write product requirements for X
```

### Method 2: Copy-Paste Full Prompt
1. Open **Agent Registry** artifact
2. Find agent by name
3. Click "Copy Agent ID"
4. Find agent file in `.claude/agents/[division]/[id].md`
5. Copy full prompt
6. Paste into Claude at start of new turn

### Method 3: Use in Auto-Load (All Sessions)
Edit `.claude/settings.json`:
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
Now those agents are available in every session by default.

## Best Practices

### 1. Match Agent to Task
- **Code work** → engineering-* agents (code-reviewer, backend-architect, devops-engineer)
- **Content** → marketing-* agents (content-strategist, copy-editor, seo-specialist)
- **Design** → design-* agents (art-director, ux-researcher, design-systems-architect)
- **Product** → product-manager, product-strategist
- **Security** → security-penetration-tester, security-compliance-specialist
- **DevOps** → engineering-devops-engineer, engineering-site-reliability-engineer

### 2. Combine Multiple Agents
Use multiple agents in sequence for complex work:
```
1. @product-manager — Write feature requirements
2. @engineering-backend-architect — Design database schema
3. @design-art-director — Plan visual design
4. @engineering-code-reviewer — Review final code
```

### 3. Use `/plan` Mode for Big Changes
When starting significant work:
1. Run `/plan`
2. Let Claude design the approach
3. Use agents to review the plan
4. Exit plan mode and implement

### 4. Leverage `/code-review` with Agents
```
/code-review --comment
# Then:
@engineering-code-reviewer Review findings from above
```

### 5. Chain `/loop` with Agents
For recurring tasks:
```
/loop 1h @engineering-devops-engineer Check CI/CD status
```

## MCP (Model Context Protocol) — What It Is

**MCP** connects Claude to external tools and data sources. In TA, you can add MCPs for:
- GitHub (read PRs, issues, push commits)
- Supabase (query database, run migrations)
- Email/Gmail (send emails, read messages)
- Slack (post to Slack, read conversations)
- And 100+ other integrations

**Example**: Use GitHub MCP to let Claude read your PR code directly while reviewing.

See `/help` for available MCPs in your session.

## TA-Specific Agent Workflows

### Blog Writing Workflow
```
1. @marketing-content-strategist
   "Create outline for blog: 'Why TA Tea is Better than KGC'"

2. @marketing-copy-editor
   "Polish the outline, add brand voice"

3. Use /make-blog-images skill
   "Generate 3 images for the blog"

4. Claude drafts full blog post
   → Commit to branch → Deploy via /deploy-vkd-site
```

### Admin Feature Development
```
1. @product-manager
   "Write requirements for: ability to bulk edit prices"

2. @engineering-backend-architect
   "Design database schema + API endpoints"

3. @testing-qa-engineer
   "Create test cases for new feature"

4. Claude implements + tests
```

### Product Photo Shoot
```
1. @design-art-director
   "Visual direction: Show ginseng luxury like Hermès"

2. Use /make-premium-product-photos skill
   "Generate 5 product photos in premium KGC style"

3. @design-art-director
   "Review photos, suggest refinements"
```

### Code Review + Security
```
1. /code-review --comment
   (Claude analyzes your changes)

2. @engineering-code-reviewer
   "Review findings, suggest refactors"

3. @security-penetration-tester
   "Check for security vulnerabilities in this code"

4. Claude makes fixes → push
```

### Sales Strategy
```
1. @sales-sales-strategy-leader
   "Plan Q4 sales strategy for TA product"

2. @marketing-growth-strategist
   "Growth hacking ideas to support sales"

3. @sales-sales-ops-manager
   "Create sales ops playbook from above"
```

## Pro Tips

### Tip 1: Ask Agents to Disagree
```
@engineering-code-reviewer Review this PR
@security-penetration-tester Find security issues
→ Ask: "What would the other agent say?"
```

### Tip 2: Use Agents as Thought Partners
```
@product-manager "Is this feature direction right?"
@engineering-backend-architect "Is the arch sound?"
→ Let them "debate" before deciding
```

### Tip 3: Copy Agents to `/artifacts`
For long-lived agents, save to artifacts:
```
# In agent file
[agent-prompt-text]

# Create artifact
→ Share with team via link
```

### Tip 4: Create Custom TA Agents
If none of the 254 match your need:
1. Copy a similar agent prompt
2. Customize for TA's context
3. Save to `.claude/agents/specialized/[custom-name].md`
4. Use in sessions

### Tip 5: Combine `/loop` + Agent
```
/loop 2h @engineering-devops-engineer Run: check deployment logs, alert if errors
```
Runs every 2 hours automatically.

## Troubleshooting

**Q: Agent not responding**  
A: Make sure agent file path is correct. Check `.claude/agents/[division]/[id].md` exists.

**Q: Agents feel generic**  
A: Add TA context to your prompt: *"As [agent-name], review this code. Remember: TA sells premium ginseng, not generic tea."*

**Q: Too many agents, can't find what I need**  
A: Use Agent Registry artifact, filter by division, search by keyword.

**Q: Want to auto-load agents**  
A: Edit `.claude/settings.json`, add agent paths to `agents.auto_load` array.

---

**Resource Links**
- 📋 [Agent Registry Artifact](#) — Interactive list of all 254 agents
- 📖 [.claude/AGENTS.md](./.claude/AGENTS.md) — Full documentation
- 🔧 [Agency Agents Repo](https://github.com/msitarzewski/agency-agents) — Source
- 📝 [Claude Code Docs](https://claude.ai/code) — Official CLI docs
