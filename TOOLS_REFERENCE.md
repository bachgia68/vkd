# ⚙️ Tools Reference — Salve Para Memória

**Data:** 2026-08-21 | **Lembrete:** Outras sessões editando Strapi (produtos, blog) — não sobrescrever

---

## 🎯 Core 12 Tools (Sempre Disponível)

| # | Tool | Comando | Propósito |
|---|------|---------|----------|
| 1 | superpowers | `/superpowers` | Brainstorm, planejamento |
| 2 | ECC | (global) | Context efficiency |
| 3 | karpathy-skills | (global) | Base patterns |
| 4 | ponytail | (monitorar) | Token tracking |
| 5 | anthropic/skills | (invoke) | Official skill library |
| 6 | awesome-claude-skills | (invoke) | Community skills |
| 7 | wshobson/agents | (invoke) | Multi-agent patterns |
| 8 | claude-mem | (memória) | Persistent memory |
| 9 | graphify | (indexação) | Codebase indexing |
| 10 | repomix | (snapshot) | Archive rápido |
| 11 | github-mcp | (MCP ativo) | Git/PR workflow |
| 12 | playwright-mcp | (MCP ativo) | Browser automation |

---

## 💡 Optional 10 Tools (High-ROI)

| # | Tool | Quando Usar | ROI |
|---|------|------------|-----|
| 1 | **cc-switch** | Task baixa complexidade | 30-50% custo |
| 2 | **awesome-mcp-servers** | Novas APIs | Descoberta |
| 3 | **system-prompts-ai** | Otimizar prompts | Token eficiente |
| 4 | **caveman** | Enforce brevity | Auto-check |
| 5 | **claude-hud** | Dashboard real-time | Visibilidade |
| 6 | **vibe-kanban** | Sprint board | Task tracking |
| 7 | **codegraph** | Dependency mapping | Prevent breaking |
| 8 | **planning-with-files** | Estruturar tasks | Hierarchy |
| 9 | **best-practice** | Code quality | Evitar tech debt |
| 10 | **taste-skill** | Design audit | Visual consistency |

---

## 🔌 MCP Servers (100+ Tools Deferred)

### Essencial para TA
- **N8N MCP** → Workflow automation
- **Strapi** → CMS (não tem MCP, usar API)
- **Supabase MCP** → Database operations
- **Vercel MCP** → Deploy, logs
- **GitHub MCP** → Version control ✅ Ativo
- **Telegram MCP** → Bot control (@tasamngoclinh_bot)
- **Ollama MCP** → Local LLM (free translation)
- **ElevenLabs MCP** → Voice synthesis (Mai pipeline)
- **Kling MCP** → AI video generation (Mai pipeline)

### Quando Precisar (Ative com ToolSearch)
```
ToolSearch("select:mcp__superpowers__brainstorming,mcp__github-mcp__create-pr")
```

---

## ⚡ TA Project Tools in Use

### Phase 1-2 (Completado)
- ✅ **Strapi collections** — SiteHeader, SiteFooter, SocialLinks (schema created)
- ✅ **React hooks** — useHeader, useFooter, useSocialLinks (fetching)
- ✅ **Components** — HeroSection, Footer (dynamic rendering)
- ✅ **Config** — TypeScript, Tailwind, Next.js, i18n

### Phase 3 (Próximo)
- **Playwright MCP** → Test UI (screenshot, click, verify)
- **GitHub MCP** → Commit + deploy
- **Vercel MCP** → Monitor deploy logs

### Ongoing
- **Ollama** → Free translation (blog, product names)
- **Telegram MCP** → Report status via @tasamngoclinh_bot
- **GitHub MCP** → Push commits

---

## 🚨 CRITICAL: Data Conflict Avoidance

**Outras sessões editando AGORA:**
- 🔴 **Tradução de produtos** — não sobrescrever Strapi products collection
- 🔴 **Tradução de blog** — não sobrescrever Strapi blog-posts collection
- 🟢 **Safe to edit:** SiteHeader, SiteFooter, SocialLinks (só Phase 2 using)

**Strategy:**
1. **Leia ANTES de commitar** — check git status para conflitos Strapi
2. **Separe branches** — data/config vs content/translation
3. **Backup Strapi dados** — export JSON antes de mutate
4. **Comunicar via Telegram** — send status via @tasamngoclinh_bot

---

## 📋 TA Project Tech Stack

| Layer | Tech | Status | Notes |
|-------|------|--------|-------|
| **Frontend** | Next.js 14 + Tailwind | ✅ | App router, i18n ready |
| **CMS** | Strapi (local) | ✅ | SQLite, 3 collections |
| **Data** | Supabase PostgreSQL | ⏳ | Not yet integrated |
| **Payments** | Stripe + PayPal + Payos | ⏳ | Phase 4 |
| **Automation** | n8n | ✅ | Image pipeline + video |
| **Translation** | Ollama (local) | ✅ | Free, no tokens |
| **Chatbot** | Rasa + LangChain | ⏳ | Python env pending |
| **Video** | Kling + ElevenLabs | ✅ | Mai pipeline working |
| **Deploy** | Vercel + GitHub | ✅ | CI/CD via git push |

---

## 🎯 Quick Start (Next Session)

```bash
# Start full stack
docker-compose up -d    # n8n (5678), Strapi (1337), Ollama (11434)
npm run develop         # Strapi admin
npm run dev             # Next.js dev (3000)

# Monitor
curl http://localhost:1337/api/site-headers  # Check Strapi
curl http://localhost:3000                    # Check Next.js
ollama list                                    # Check LLM
```

---

## 📞 Report Status

```bash
# Via Telegram bot (saved in memory):
# Bot: @tasamngoclinh_bot
# Message: "Phase 2 testing — Hero + Footer live, Strapi data flowing"
```

---

## 🔐 Passwords & Keys (In Memory Only)

- Strapi admin: (setup on first run, no password set yet)
- Telegram token: (saved in memory, @tasamngoclinh_bot)
- Stripe keys: (in .env.example, not committed)
- Supabase: (MayBach org account, see memory)

---

**Saved:** 2026-08-21  
**Use this file to remember tools without needing to ask Claude every time**

👉 When next session starts, just `/de` to recall this file
