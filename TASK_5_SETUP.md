# Task 5: LangChain + Ollama Local LLM Setup ✅

## Overview
- Install & run Ollama (local LLaMA 2 7B)
- Zero API costs (runs on server GPU/CPU)
- Fast Vietnamese Q&A (<5 seconds)
- LangChain integration for easy prompt management

## Setup Steps

### 1. Start Ollama Service
```bash
docker-compose up -d ollama
```

Wait 10s for service to start (http://localhost:11434)

### 2. Download LLaMA 2 7B Model
```bash
# Download quantized model (smaller, faster)
docker exec ta-ollama ollama pull llama2-7b-chat-q4_K_M
```

Wait ~5 minutes (model is ~5GB, download + extraction)

Verify download:
```bash
docker exec ta-ollama ollama list
```

Expected output:
```
NAME                          ID              SIZE      MODIFIED
llama2-7b-chat-q4_K_M        ...              3.8 GB    2 min ago
```

### 3. Test Ollama API Directly
```bash
curl -X POST "http://localhost:11434/api/generate" \
  -d '{
    "model": "llama2-7b-chat-q4_K_M",
    "prompt": "Sâm Ngọc Linh là gì?",
    "stream": false
  }'
```

Expected: JSON response with Vietnamese answer ✓

### 4. Install Python Dependencies
```bash
pip install langchain ollama openai
```

### 5. Test LangChain Wrapper
```bash
python chatbot/llm.py --health
```

Expected: `✓ Ollama health: Healthy`

### 6. Run Interactive Chat Test
```bash
python chatbot/llm.py --interactive
```

Test 3 Vietnamese questions:
1. "Sâm Ngọc Linh 20 năm bao nhiêu tiền?"
2. "Giao hàng mất bao lâu?"
3. "Sâm này có tác dụng gì?"

Expected:
- Each answer <5 seconds ✓
- Answers in Vietnamese ✓
- Relevant to sâm Ngọc Linh ✓

### 7. Single Query Test
```bash
python chatbot/llm.py --message "Tôi muốn mua sâm, bạn có gợi ý không?"
```

Expected response:
```
📝 Response:
[Vietnamese answer about ginseng products]

⏱️  Time: 2350ms
```

## Performance Notes

**Model specifications:**
- Model: LLaMA 2 7B (quantized 4-bit)
- Size: ~3.8GB (fits on 4GB GPU or CPU)
- Context window: 2048 tokens
- Response time: 2-5s (depends on server hardware)

**Hardware requirements:**
- **GPU (recommended)**: NVIDIA GPU with 6GB+ VRAM
  - Response time: 2-3s per query
- **CPU (fallback)**: 4+ cores
  - Response time: 5-15s per query (acceptable)

**Optimization:**
- Temperature: 0.7 (balanced creativity)
- Top-k: 40, Top-p: 0.9 (coherent responses)
- Max output: 512 tokens (concise answers)

## Environment Variables (.env)

```bash
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2-7b-chat-q4_K_M
OLLAMA_TIMEOUT=30  # seconds
```

## Troubleshooting

**Model download hangs:**
- Check disk space: `df -h` (need 10GB free)
- Check network: `curl -I ollama.ai`
- Restart service: `docker restart ta-ollama`

**API returns timeout:**
- Model still downloading: wait 5-10 min
- Server overloaded: increase `OLLAMA_TIMEOUT`
- GPU out of memory: use quantized model (q4_K_M)

**Response quality too low:**
- Check prompt engineering (Task 6)
- Add context from Rasa (Task 7)
- Try different temperature (0.5-0.9)

**Python dependency errors:**
- Reinstall: `pip install --upgrade langchain ollama`
- Check Python version: `python --version` (3.8+)

## Next: Task 6 - Rasa NLU + Intents Training

LLM ready. Now train Rasa for intent classification & entity extraction.
