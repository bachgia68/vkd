# Task 4: End-to-End Pipeline Verification ✅

## Objective
Run complete image pipeline **5 times** (Replicate SD → ESRGAN → Sharp → Strapi):
1. Prompt generation
2. Upscaling
3. Compression
4. Upload to Strapi
5. Verify quality + metadata

## Test Data: 5 Product Descriptions

Use these Vietnamese product descriptions for testing:

### Image 1: Premium 20-Year Ginseng
```
Sâm Ngọc Linh 20 năm tuổi cao cấp, tự nhiên, chất lượng hàng đầu, 
chụp trong studio chuyên nghiệp, nền vàng sang trọng, 
ánh sáng mềm mại, hình ảnh tươi sáng, độ phân giải cao
```

### Image 2: Fresh Ginseng Root Close-up
```
Rễ sâm Ngọc Linh tươi tự nhiên, macro photography, chi tiết rõ nét,
độ sâu cảnh sâu, ánh sáng studio chuyên nghiệp, nền trắng,
chất lượng cao, độ phân giải 8K
```

### Image 3: Luxury Ginseng Extract
```
Nước sâm Ngọc Linh cao cấp trong lọ thủy tinh sang trọng,
bao bì đúp vàng, quây xanh, nền trắng nhẹ,
chụp chuyên nghiệp, thương mại, chi tiết sắc nét, ánh sáng vàng
```

### Image 4: Dried Ginseng Bundle
```
Bó sâm Ngọc Linh khô tự nhiên, thẩm mỹ truyền thống,
xếp chồng đẹp mắt, nền bê tông sáng, ánh sáng tự nhiên,
studio chuyên nghiệp, độ phân giải cao, chất lượng premium
```

### Image 5: Ginseng Tea Infusion
```
Trà sâm Ngọc Linh pha nước nóng, hương phai mênh mang,
cup gốm trắng sứ tinh xảo, sâm vàng nâu, khói hơi nước,
ánh sáng ấm áp, chụp theo kiểu lifestyle, chuyên nghiệp
```

## Execution Steps

### Step 1: Prepare Test Environment
```bash
# Verify all services running
docker ps | grep -E "n8n|strapi|upscayl"

# Verify API keys
echo "REPLICATE_API_TOKEN=$REPLICATE_API_TOKEN"
echo "STRAPI_API_TOKEN=$STRAPI_API_TOKEN"
```

Expected: All 3 containers running, both tokens set ✓

### Step 2: Run Workflow 5 Times
For each description above:

1. **In n8n dashboard** (http://localhost:5678):
   - Open workflow: `image-gen-replicate`
   - Paste description in "Set Prompt" node
   - Click "Execute Workflow"
   - Wait for completion (~2-3 min per image)
   - Check execution log: 0 errors ✓

2. **Pipeline stages** (verify each):
   ```
   Description
      ↓
   [Replicate] SD generates image (512×512)
      ↓
   [Download] Save to /images/temp/
      ↓
   [Real-ESRGAN] Upscale 4x (512→2048)
      ↓
   [Sharp] Compress to webp (2048→1024, <300KB)
      ↓
   [Strapi] Upload with metadata
      ✓
   ```

### Step 3: Monitor Pipeline Metrics

For **each of 5 images**, record:

| Image | Stage | Size (KB) | Time (s) | Status |
|-------|-------|----------|---------|--------|
| 1 | Replicate SD | ~100 | 30 | ✓ |
| 1 | ESRGAN upscale | ~500 | 45 | ✓ |
| 1 | Sharp compress | <300 | 5 | ✓ |
| 1 | Strapi upload | N/A | 2 | ✓ |
| 2 | Replicate SD | ~100 | 30 | ✓ |
| ... | ... | ... | ... | ... |

**Targets:**
- Replicate: 30-60s per image (cloud GPU)
- ESRGAN: 30-60s per image (upscaling intensive)
- Sharp: 2-5s per image (CPU compress)
- Strapi upload: <5s per image (network)
- **Total per image: ~2-3 minutes**

### Step 4: Verify Strapi Results
After all 5 uploads, check Strapi admin:

**In http://localhost:1337/admin/content-manager/collection-types/api::media-file.media-file:**

- [ ] 5 images total uploaded
- [ ] All images format: webp
- [ ] All images size: <300KB
- [ ] All images resolution: 1024×1024
- [ ] All have metadata tags
- [ ] All have product name extracted
- [ ] All accessible via API

**API verification:**
```bash
curl -X GET "http://localhost:1337/api/media-files?pagination[limit]=100" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" | jq '.data | length'
```

Expected: Output shows 5 or more files ✓

### Step 5: Quality Assessment

**Visual check** (compare with production images):
- [ ] Image 1: 20-year ginseng looks luxurious ✓
- [ ] Image 2: Close-up details sharp + clear ✓
- [ ] Image 3: Extract bottle color accurate ✓
- [ ] Image 4: Dried ginseng texture realistic ✓
- [ ] Image 5: Tea infusion steam visible ✓

**Performance check**:
- [ ] Lighthouse LCP: <2.5s (image load)
- [ ] WebP compression: <300KB per image ✓
- [ ] Upscale quality: noticeably better than original ✓

### Step 6: Error Handling Test (Optional)

Test failure scenarios:
- [ ] Kill Replicate API → workflow should fail gracefully
- [ ] Fill disk space → Sharp compression fails → log error
- [ ] Invalid Strapi token → upload fails → retry message

## Success Criteria

All 5 images complete pipeline:
- ✅ Generated (Replicate SD)
- ✅ Upscaled (Real-ESRGAN 4x)
- ✅ Compressed (<300KB webp)
- ✅ Uploaded (Strapi)
- ✅ Verified (visible in admin UI)

## Checkpoint 1: Image Pipeline Complete ✓

- [x] 5+ images in Strapi Media
- [x] All <300KB, webp format, 1024×1024
- [x] Metadata tags correct
- [x] n8n workflows 0 errors
- [x] Image quality acceptable
- [x] Lighthouse performance green

**Ready for Phase 2: Chatbot setup? → YES** ✅

---

## Next Phase: Phase 2 - Chatbot

After Task 4 completes, proceed to:
- Task 5: LangChain + Ollama LLM setup
- Task 6: Rasa NLU + intents training
- Task 7: Chatbot actions + Strapi integration
- Task 8: Gradio UI + Vercel deployment

Total estimated: 4 days for Phase 2.
