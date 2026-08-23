# Task 2: Real-ESRGAN + Sharp Image Optimization ✅

## Overview
- **Real-ESRGAN**: Upscale images 4x (512×512 → 2048×2048)
- **Sharp**: Compress to webp, resize to 1024×1024, target <300KB
- **n8n workflow**: Automate upscale + compress pipeline
- **Output**: Optimized images in Strapi ready for frontend

## Setup Steps

### 1. Install Node Dependencies
```bash
npm install sharp axios
```

### 2. Start Upscayl Service
```bash
docker-compose up -d upscayl
```

Wait 30s for Upscayl to start (http://localhost:7860)

### 3. Setup n8n Workflow
1. Open http://localhost:5678 (n8n)
2. Import workflow: `n8n/workflows/image-optimize-pipeline.json`
3. Add credentials:
   - **Strapi API**: Already configured from Task 1
   - **Upscayl API**: Local (http://localhost:7860, no auth needed)

### 4. Test Optimization Pipeline
Run workflow with 1 image from Task 1:

**Expected result:**
- Original: ~50-100KB
- After upscale: ~500-800KB (4x larger)
- After compress: <300KB webp

Example flow:
```
Input (Task 1 image) 
  ↓
Fetch from Strapi
  ↓
Real-ESRGAN 4x upscale (512→2048)
  ↓
Sharp compress & resize (2048→1024)
  ↓
Output <300KB webp
  ↓
Upload optimized back to Strapi
```

### 5. Manual Test (Optional)
Test the optimization script directly:
```bash
node scripts/optimize-image.js <image-url> <filename>
```

Example:
```bash
node scripts/optimize-image.js "https://example.com/image.png" "sam-product.png"
```

Output: `public/images/optimized/sam-product.webp` (<300KB)

### 6. Batch Optimize Task 1 Images
Run n8n workflow for all 5 images from Task 1:

- [ ] Image 1: Original → Optimized ✓
- [ ] Image 2: Original → Optimized ✓
- [ ] Image 3: Original → Optimized ✓
- [ ] Image 4: Original → Optimized ✓
- [ ] Image 5: Original → Optimized ✓

### 7. Verify Results
Check in Strapi admin:
- [ ] All 5 optimized images <300KB
- [ ] All images webp format
- [ ] All images 1024×1024 resolution
- [ ] Quality acceptable (compare upscale before/after)

## Troubleshooting

**Upscayl API returns 404:**
- Check Upscayl container running: `docker ps | grep upscayl`
- Verify image files exist in `/images/temp/` directory

**Sharp compression fails:**
- Ensure npm packages installed: `npm install sharp`
- Check available disk space: `df -h`

**n8n workflow timeout:**
- Increase timeout in n8n settings (upscale can take 30-60s per image)
- Check Upscayl logs: `docker logs ta-upscayl`

## Performance Notes

- Upscale time: ~30-60s per image (GPU-dependent)
- Compression time: ~2-5s per image (CPU-only)
- Total per image: ~1-2 minutes
- For 100 images: ~2-3 hours (can parallelize with multiple n8n instances)

## Next: Task 3 - Strapi Media Library Integration
Connect optimized images to Strapi, batch upload workflow.
