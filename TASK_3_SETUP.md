# Task 3: Strapi Media Library Integration ✅

## Overview
- Connect Strapi Media plugin
- Authenticate API access
- Create batch upload workflow (n8n)
- Upload 10+ optimized images with metadata
- Verify in Strapi admin UI

## Setup Steps

### 1. Setup Strapi Collections
Strapi is already running from docker-compose. Create collections for:
- **Products**: ginseng products (name, price, images, category)
- **BlogPosts**: blog articles (title, content, featuredImage)
- **MediaFiles**: optimized images (file, type, tags, size)

Collections config: `strapi/config/collections.ts`

Manual steps in Strapi Admin:
1. Open http://localhost:1337/admin
2. Content-type Builder → Create new collection
3. Create **Products** collection:
   - `name` (Text, required)
   - `slug` (UID from name)
   - `description` (Rich Text)
   - `price` (Decimal, required)
   - `currency` (Enum: VND, USD)
   - `images` (Media, multiple)
   - `category` (Enum: fresh/dried/extract/tea/supplement)
   - `stock` (Integer)
   - `featured` (Boolean)

4. Create **BlogPosts** collection:
   - `title` (Text, required, unique)
   - `slug` (UID from title)
   - `content` (Rich Text)
   - `excerpt` (Text, max 500)
   - `featuredImage` (Media)
   - `locale` (Enum: vi/en)
   - `published` (Boolean)

5. Create **MediaFiles** collection:
   - `name` (Text, required)
   - `url` (Text, required)
   - `file` (Media, required)
   - `type` (Enum: product/blog/hero/gallery)
   - `tags` (JSON)
   - `format` (Enum: webp/jpg/png)
   - `size` (Integer)

### 2. Create API Token
1. Open http://localhost:1337/admin/settings/api-tokens
2. Click "Create new API token"
3. Name: `n8n-batch-upload`
4. Description: `Upload optimized images via n8n`
5. Type: `Full access`
6. Copy token, add to `.env`: `STRAPI_API_TOKEN=<token>`

### 3. Setup n8n Batch Upload Workflow
1. Open http://localhost:5678 (n8n)
2. Import workflow: `n8n/workflows/batch-upload-strapi.json`
3. Configure:
   - **Strapi API endpoint**: `http://localhost:1337/api/upload`
   - **Authorization**: Use token from Step 2
   - **Input directory**: `/public/images/optimized/` (from Task 2)

### 4. Test Upload with 10 Sample Images
Run n8n workflow with optimized images from Task 2:

**Workflow steps:**
1. List all images in `/public/images/optimized/`
2. For each image:
   - Extract metadata from filename (product name, type, tags)
   - POST to Strapi `/api/upload`
   - Return upload result

**Expected result:**
- All 10 images uploaded to Strapi
- Metadata tags applied (product, type)
- File sizes <300KB
- Accessible via Strapi Media API

### 5. Verify in Strapi Admin
1. Open http://localhost:1337/admin/content-manager/collection-types/api::media-file.media-file
2. Should see 10 uploaded images with:
   - [ ] Name extracted from filename
   - [ ] Type (product/blog)
   - [ ] Tags applied
   - [ ] File size <300KB
   - [ ] Format: webp

### 6. Query via Strapi API
Test API access (verify upload worked):
```bash
curl -X GET "http://localhost:1337/api/media-files" \
  -H "Authorization: Bearer <your-strapi-token>"
```

Expected response: JSON array with 10 media files

### 7. Batch Metadata Update (Optional)
If you want to link images to products:
```bash
curl -X PUT "http://localhost:1337/api/products/1" \
  -H "Authorization: Bearer <your-strapi-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "images": [1, 2, 3]
    }
  }'
```

## Troubleshooting

**Strapi returns 401 (Unauthorized):**
- Verify API token in `.env` matches Strapi settings
- Token must be "Full access" or have `upload` permission
- Check token hasn't expired (create new if needed)

**n8n can't find images directory:**
- Verify path: `/public/images/optimized/`
- Check files exist: `ls public/images/optimized/`
- Ensure permissions: `chmod 755 public/images/optimized/`

**Upload succeeds but images not visible in Strapi UI:**
- Clear Strapi cache: restart container
- Refresh browser (hard refresh: Ctrl+Shift+R)
- Check Strapi logs: `docker logs ta-strapi`

**Metadata not extracted correctly:**
- Check filename format in Task 2 output
- Expected: `<product>_<type>_<num>.webp`
- Example: `sam-20nam_product_1.webp`

## Next: Task 4 - Verify Image Pipeline End-to-End

Run full pipeline (Replicate → Upscale → Compress → Upload) 5 times.
