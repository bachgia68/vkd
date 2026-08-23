# Task 8: Gradio UI + Vercel Deployment ✅

## Overview
- Gradio chatbot interface (Vietnamese)
- Connect to Rasa NLU + Ollama LLM backend
- Deploy to Vercel serverless
- Embed in Next.js site as iframe

## Files
- `chatbot/app.py` — Gradio web UI
- `api/chatbot.ts` — Vercel serverless function (proxy)
- `components/ChatbotEmbed.tsx` — React iframe embed component

## Local Testing

### 1. Install Gradio
```bash
pip install gradio
```

### 2. Run Gradio App Locally
```bash
python chatbot/app.py
```

Open http://localhost:7860 in browser

Expected: 
- Chat interface loads ✓
- Can send messages ✓
- Responses from Rasa/Ollama appear ✓

### 3. Test with Sample Questions
1. "Sâm bao nhiêu tiền?" → `ask_price` intent + response
2. "Giao hàng mất bao lâu?" → `ask_shipping` intent + response
3. "Random question" → LLaMA fallback response

## Deploy to Vercel

### 1. Prepare Environment
Add to `.env.local`:
```bash
GRADIO_URL=https://your-gradio-backend.com
NEXT_PUBLIC_GRADIO_URL=https://your-gradio-backend.com
```

### 2. Deploy Gradio Backend
**Option A: Vercel (recommended)**
```bash
# Create Gradio serverless function
vercel --prod
```

**Option B: Hugging Face Spaces (free)**
1. Create Space on huggingface.co
2. Upload `chatbot/app.py`
3. Set environment variables (RASA_URL, OLLAMA_URL)
4. Get public URL: `https://yourusername-chatbot.hf.space`

### 3. Update Environment
Set `GRADIO_URL` to deployed URL:
```bash
# .env.production
GRADIO_URL=https://yourusername-chatbot.hf.space
NEXT_PUBLIC_GRADIO_URL=https://yourusername-chatbot.hf.space
```

### 4. Add Component to Site
In your page (e.g., `pages/chat.tsx`):

```tsx
import ChatbotEmbed from '@/components/ChatbotEmbed';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <ChatbotEmbed 
        title="Chat với trợ lý AI"
        gradioUrl={process.env.NEXT_PUBLIC_GRADIO_URL}
        height={700}
      />
    </div>
  );
}
```

### 5. Test Embed
1. `npm run dev` (start Next.js)
2. Open `http://localhost:3000/chat`
3. Iframe should load chatbot ✓
4. Send test messages ✓

## Verification Checklist

### Local
- [ ] `python chatbot/app.py` starts without errors
- [ ] Gradio UI loads at http://localhost:7860
- [ ] Chat works (Rasa intent classification works)
- [ ] Fallback to LLaMA for unknown intents

### Deployed
- [ ] Gradio deployed to Vercel/HF Spaces
- [ ] Public URL accessible
- [ ] Component in Next.js page
- [ ] Iframe loads without CORS errors
- [ ] Chat functional end-to-end

### Performance
- [ ] Iframe loads <3s
- [ ] Response time <5s per message
- [ ] No console errors in browser
- [ ] Mobile responsive

## Troubleshooting

**Gradio iframe shows blank:**
- Check CORS: Gradio must allow embedding
- Verify URL in env variable
- Check browser console for errors

**API timeout:**
- Increase timeout in `chatbot/app.py`
- Check Rasa/Ollama services running
- Verify network connectivity

**Vercel deployment fails:**
- Install dependencies: `pip install -r requirements.txt`
- Check Python version 3.8+
- Verify environment variables set in Vercel dashboard

## Next: Phase 3 - Frontend Polish (Tasks 9-13)

Chatbot live. Now implement:
- Task 9: shadcn/ui + Framer Motion
- Task 10: Image gallery with animations
- Task 11: next-intl i18n routing
- Task 12: Translate content (blog + products)
- Task 13: Umami analytics
