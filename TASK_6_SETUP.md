# Task 6: Rasa Chatbot NLU + Intent Training ✅

## Overview
- Rasa framework for Vietnamese NLU
- 10 intents + 50+ training examples
- Intent classification, entity extraction
- Story-based conversation flow
- Train model ready for Task 7

## Files Created
- `rasa/data/nlu.yml` — 10 intents, 70+ training examples
- `rasa/data/stories.yml` — 10 conversation flows
- `rasa/domain.yml` — intents, entities, actions, responses
- `rasa/config.yml` — NLU + policy pipeline

## Intents

1. **ask_price** — "Sâm bao nhiêu tiền?"
2. **ask_shipping** — "Giao hàng bao lâu?"
3. **ask_benefits** — "Sâm có tác dụng gì?"
4. **ask_usage** — "Cách dùng sâm thế nào?"
5. **ask_quality** — "Sâm của bạn thật không?"
6. **ask_product_types** — "Có mấy loại sâm?"
7. **ask_storage** — "Bảo quản sâm sao?"
8. **complain** — "Hàng bị hỏng"
9. **greeting** — "Chào bạn"
10. **goodbye** — "Tạm biệt"

## Setup Steps

### 1. Install Rasa
```bash
pip install rasa
```

### 2. Initialize Rasa Project (One-time)
```bash
cd rasa
rasa init --no-prompt
```

This creates initial structure. Copy our configs over:
```bash
cp data/nlu.yml data/nlu.yml.bak
cp data/stories.yml data/stories.yml.bak
# Use our nlu.yml, stories.yml, domain.yml, config.yml
```

### 3. Train NLU Model
```bash
cd rasa
rasa train
```

Wait ~2-5 minutes (training 70+ examples with DIETClassifier)

Output: `models/` directory contains trained model

Verify:
```bash
ls -lh rasa/models/
# Should show recent .tar.gz file
```

### 4. Evaluate Model (Optional)
```bash
rasa test nlu --nlu data/nlu.yml --model models/<latest>.tar.gz
```

Expected: Intent classification F1 score >0.8 ✓

### 5. Test in Rasa Shell
```bash
rasa shell nlu
```

Interactive test with 5 Vietnamese queries:

Test 1: "Sâm Ngọc Linh 20 năm bao nhiêu tiền?"
Expected intent: `ask_price` (confidence >0.8)

Test 2: "Giao hàng mất bao lâu?"
Expected intent: `ask_shipping` (confidence >0.8)

Test 3: "Sâm có lợi ích gì?"
Expected intent: `ask_benefits` (confidence >0.8)

Test 4: "Cách sử dụng sâm như thế nào?"
Expected intent: `ask_usage` (confidence >0.8)

Test 5: "Sâm bạn từ đâu?"
Expected intent: `ask_quality` (confidence >0.8)

### 6. Extract Intents Programmatically (Task 7 preview)
```python
from rasa.nlu.model import Interpreter

interpreter = Interpreter.load("rasa/models/latest")

# Test prediction
result = interpreter.parse("Sâm bao tiền?")
print(f"Intent: {result['intent']['name']}")
print(f"Confidence: {result['intent']['confidence']}")
```

Expected: `Intent: ask_price, Confidence: 0.92`

## Training Data Structure

**NLU file format:**
```yaml
nlu:
- intent: ask_price
  examples: |
    - Sâm bao nhiêu tiền?
    - Giá sâm bao lăn?
    - [more examples...]
```

Each intent has 5-7 examples (80+ total for good coverage)

**Stories file format:**
```yaml
stories:
- story: ask_price
  steps:
    - intent: greeting
    - action: utter_greet
    - intent: ask_price
    - action: utter_ask_price
    - action: action_fetch_products
```

Stories teach Rasa how conversations flow

**Domain file:**
- Lists all intents, entities, actions, slots
- Defines utterances (template responses)
- Custom actions hook into Python code (Task 7)

## Performance Metrics

**Expected performance:**
- Intent accuracy: >85%
- Entity extraction: >90% (if trained enough)
- Inference time: <500ms per query (CPU)

**If accuracy is low:**
- Add more training examples (10-15 per intent)
- Adjust confidence threshold in config
- Enable entity patterns (regex) for product names

## Troubleshooting

**Training fails:**
```bash
# Check file format (YAML syntax)
rasa data validate

# Rebuild from scratch
rm -rf rasa/models
rasa train
```

**Intent confidence low:**
- Add more diverse examples
- Check examples match expected intents
- Train longer: increase `epochs` in config

**Model file too large:**
- Use compression: `rasa train --compression-level 1`
- Remove old models: `rm rasa/models/*.tar.gz`

## Next: Task 7 - Chatbot Actions + Strapi Integration

Model trained. Now implement custom actions (fetch products, log complaints, etc.)
