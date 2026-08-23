# TA Project Runbook — Complete Setup & Execution Guide

## Quick Start (Windows - PowerShell)

```powershell
# 1. Navigate to project
cd "D:\TA page\site"

# 2. Run setup script
powershell -ExecutionPolicy Bypass -File SETUP.ps1

# 3. Edit .env with your tokens
notepad .env

# 4. Start dev server
npm run dev
```

## Quick Start (macOS/Linux - Bash)

```bash
cd ~/projects/ta-site
bash setup.sh
nano .env  # Edit with tokens
npm run dev
```

---

## Manual Step-by-Step Setup

### Step 1: Prerequisites
```bash
# Windows (PowerShell)
winget install Git.Git
winget install Docker.DockerDesktop
winget install OpenJS.NodeJS
winget install Python.Python.3.11

# macOS
brew install git docker node python3

# Linux (Ubuntu)
sudo apt update
sudo apt install -y git docker.io nodejs python3-pip
sudo usermod -aG docker $USER
```

### Step 2: Project Setup
```bash
# Clone/init repo
cd "D:\TA page\site"  # Windows
# OR
cd ~/projects/ta-site  # macOS/Linux

# Setup env
cp .env.example .env
# Edit .env with your tokens:
# - REPLICATE_API_TOKEN=...
# - STRAPI_API_TOKEN=...
# - Supabase URL + key
# - etc.
```

### Step 3: Install Dependencies
```bash
# Node.js
npm install --legacy-peer-deps
npm install framer-motion shadcn-ui next-intl umami @umami/sdk

# Python
pip install -r requirements.txt
# OR individual packages:
pip install langchain ollama rasa gradio requests

# (Optional) Rasa setup
cd rasa
rasa init --no-prompt
```

### Step 4: Start Services
```bash
# Start all Docker services
docker-compose up -d

# Verify services running
docker ps | grep ta-

# Expected output:
# ta-n8n      (n8n dashboard)
# ta-strapi   (Strapi CMS)
# ta-ollama   (LLM backend)
# ta-upscayl  (Image upscaler)
```

### Step 5: Configure Strapi
```bash
# Open Strapi admin
# URL: http://localhost:1337/admin

# 1. Create admin account (first time only)
# 2. Import collections from: strapi/config/collections.ts
#    - Products (name, price, images, category)
#    - BlogPosts (title, content, locale)
#    - MediaFiles (files, type, tags)
# 3. Create API token (Settings → API Tokens)
# 4. Copy token to .env: STRAPI_API_TOKEN=...
```

### Step 6: Download Ollama Model
```bash
# Start Ollama
docker-compose up -d ollama

# Download LLaMA 2 7B (quantized, ~3.8GB)
docker exec ta-ollama ollama pull llama2-7b-chat-q4_K_M

# Verify
docker exec ta-ollama ollama list

# Expected output:
# llama2-7b-chat-q4_K_M    3.8 GB
```

### Step 7: Train Rasa Model
```bash
cd rasa

# Validate data
rasa data validate

# Train model
rasa train

# Test NLU
rasa shell nlu
# Type: "Sâm bao nhiêu tiền?"
# Expected: intent=ask_price (confidence >0.8)
```

### Step 8: Start Next.js Dev Server
```bash
npm run dev

# Expected: Server running at http://localhost:3000
```

---

## Task Execution Commands

### Phase 1: Image Pipeline

**Task 1: Replicate SD API + n8n**
```bash
# 1. Get Replicate token: replicate.com → Settings → API Token
# 2. Set env: REPLICATE_API_TOKEN=<token>
# 3. Open n8n: http://localhost:5678
# 4. Import workflow: n8n/workflows/image-gen-replicate.json
# 5. Add credentials (Replicate API key + Strapi token)
# 6. Test workflow with sample prompt
```

**Task 2: ESRGAN + Sharp Optimization**
```bash
# 1. Verify Upscayl service: docker ps | grep upscayl
# 2. Upload 5 images from Task 1
# 3. Run n8n workflow: image-optimize-pipeline.json
# 4. Verify output: ls public/images/optimized/
# 5. Check sizes: all <300KB? ✓
```

**Task 3: Strapi Batch Upload**
```bash
# 1. Open n8n: http://localhost:5678
# 2. Import: n8n/workflows/batch-upload-strapi.json
# 3. Configure Strapi API token
# 4. Run workflow
# 5. Verify in Strapi: http://localhost:1337/admin
#    (Content Manager → MediaFiles → should see 10+ images)
```

**Task 4: End-to-End Verification**
```bash
# Read: TASK_4_VERIFICATION.md
# Run: Full pipeline 5 times with test descriptions
# Expected: 5 images in Strapi, all <300KB, metadata correct
# Checkpoint 1: Image Pipeline Complete ✅
```

### Phase 2: Chatbot

**Task 5: LangChain + Ollama LLM**
```bash
# 1. Verify Ollama running: curl http://localhost:11434/api/tags
# 2. Test LLM script:
python chatbot/llm.py --health
python chatbot/llm.py --interactive
# 3. Test Vietnamese Q&A:
# "Sâm bao nhiêu tiền?" → <5s response ✓
```

**Task 6: Rasa NLU Training**
```bash
cd rasa
rasa train
rasa shell nlu

# Test 5 Vietnamese intents:
# "Sâm bao tiền?" → ask_price
# "Giao mất bao lâu?" → ask_shipping
# "Dùng sao?" → ask_usage
# "Sâm là gì?" → ask_benefits
# "Khác lạ sao?" → ask_quality
```

**Task 7: Chatbot Actions + Strapi**
```bash
# Actions already scaffolded in: rasa/actions/actions.py
# 1. Setup Rasa action server (in separate terminal):
cd rasa
rasa run actions

# 2. Test actions:
# - ActionFetchProducts: fetch from Strapi
# - ActionGetPrice: search products
# - ActionLogComplaint: save to Supabase
# - ActionDefaultFallback: LLaMA LLM fallback
```

**Task 8: Gradio UI + Vercel**
```bash
# 1. Test locally:
python chatbot/app.py
# Open: http://localhost:7860

# 2. Deploy to Vercel:
vercel --prod

# 3. Set environment variables in Vercel dashboard:
# RASA_URL=http://...
# OLLAMA_URL=http://...

# 4. Embed in Next.js:
# pages/chat.tsx → <ChatbotEmbed />

# Checkpoint 2: Chatbot Live ✅
```

### Phase 3: Frontend

**Task 9: shadcn/ui + Theme**
```bash
npm install shadcn-ui framer-motion
npm run dev

# Verify: tailwind.config.ts has KGC colors
# - gold: #D4AF37
# - cream: #F5F1E8
# - navy: #1a1a1a
```

**Task 10: ProductGallery Component**
```bash
# Already scaffolded in: components/ProductGallery.tsx
# Usage in page:
# <ProductGallery columns={3} strapiUrl={...} />
```

**Task 11: next-intl i18n Setup**
```bash
npm install next-intl

# Routing structure: /vi/, /en/
# Locale detection: browser language preference
# Switcher component: components/LocaleSwitch.tsx
```

**Task 12: Batch Content Translation**
```bash
# 1. Extract from Strapi:
node scripts/translate-content.js

# 2. Translate with DeepL free API (100k chars/month free)
# 3. Upload back to Strapi with locale field
# 4. Verify: http://localhost:3000/vi/blog vs /en/blog
```

**Task 13: Umami Analytics**
```bash
# 1. Deploy Umami (Docker or cloud):
docker-compose up -d umami  # (if added to docker-compose.yml)

# 2. Add tracking to pages/_document.tsx:
# <Script src="..." data-website-id="..." />

# 3. Track custom events:
# - chat_message_sent
# - gallery_zoom
# - product_view

# 4. View dashboard: http://localhost:3000/analytics

# Checkpoint 3: Frontend Complete ✅
```

---

## Service Access URLs

| Service | URL | Default | Port |
|---------|-----|---------|------|
| n8n | http://localhost:5678 | none | 5678 |
| Strapi | http://localhost:1337 | admin | 1337 |
| Ollama | http://localhost:11434 | API | 11434 |
| Upscayl | http://localhost:7860 | API | 7860 |
| Next.js | http://localhost:3000 | web | 3000 |
| Umami | http://localhost:3001 | analytics | 3001 |

---

## Environment Variables (.env)

```bash
# APIs
REPLICATE_API_TOKEN=<your-token>
STRAPI_API_TOKEN=<your-jwt>
STRAPI_URL=http://localhost:1337
SUPABASE_URL=https://...
SUPABASE_KEY=<key>

# LLM
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2-7b-chat-q4_K_M
RASA_URL=http://localhost:5005

# Chatbot
GRADIO_URL=http://localhost:7860
NEXT_PUBLIC_GRADIO_URL=http://localhost:7860

# Translation
DEEPL_API_KEY=<key>

# Analytics
UMAMI_WEBSITE_ID=<id>
UMAMI_URL=http://localhost:3001
```

---

## Troubleshooting

**Docker services fail to start:**
```bash
# Check logs
docker logs ta-n8n
docker logs ta-strapi
docker logs ta-ollama

# Restart all
docker-compose restart

# Nuclear option (full reset)
docker-compose down -v
docker-compose up -d
```

**Python/Rasa errors:**
```bash
# Reinstall
pip uninstall rasa -y
pip install rasa
rasa train
```

**Next.js won't start:**
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

**Out of disk space:**
```bash
# Clean Docker
docker system prune -a --volumes
```

---

## Monitoring

```bash
# Watch Docker logs
docker-compose logs -f

# Monitor services
watch -n 2 'docker ps --filter "name=ta-" --format "table {{.Names}}\t{{.Status}}"'

# Check disk usage
df -h
du -sh *

# Monitor ports
netstat -ano | findstr :5678  # Windows
lsof -i :5678  # macOS/Linux
```

---

## Production Deployment

```bash
# 1. Build Next.js
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Deploy services
# - Strapi: Vercel/Heroku/Railway
# - Ollama: self-hosted or cloud API
# - n8n: self-hosted or n8n.cloud
# - Gradio: Vercel serverless or HF Spaces

# 4. Monitor
# - Umami dashboard
# - Vercel analytics
# - Strapi logs

# 5. Set production environment variables
# - Update API URLs
# - Update API tokens (rotate old ones)
# - Enable HTTPS/SSL
```

---

**All ready! Start with `npm run dev` and read task guides.** 🚀
