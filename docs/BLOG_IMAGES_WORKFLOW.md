# Blog Images Workflow — TA Premium Blog

**Version**: 1.0 (2026-08-20)

---

## 📸 Yêu Cầu Hình Ảnh Cho Blog

**Bắt buộc**: ≥2 ảnh/bài (skill `make-blog-images`)

| Vị trí | Kích Thước | Định Dạng | Mục Đích |
|--------|-----------|----------|---------|
| **Hero Banner** (cover) | 1200×630px | WebP/AVIF | Social share + page top |
| **Content Image 1** | 800×600px | WebP/AVIF | Sau intro paragraph |
| **Content Image 2** | 800×600px | WebP/AVIF | Giữa bài (data/comparison) |
| **Optional: Infographic** | 1000×800px | WebP/AVIF | Key stats visualization |

---

## 🎨 Image Sources for "Sâm Ngọc Linh" Blog Post

### Option 1: Use Existing Product Images
**Best**: Reuse từ `public/products/samk5/`, `public/products/trimico/`, `public/products/vkd/`

```bash
# Available product images:
- SK5-001.jpg (Collagen Noliko)
- SK5-004.jpg (Tổ Yến 100ml)
- SK5-006.jpg (Collagen Tổ Yến Noliko+)
- TRIMICO-*.jpg (Sâm Ngọc Linh root + processed)
- VKD-*.jpg (Sâm nhân tạo samples)

# Process:
1. Copy to public/blog-images/
2. Run image-optimizer (compress → WebP)
3. Reference in markdown as: ![Sâm Ngọc Linh](public/blog-images/sk5-001.webp)
```

### Option 2: Generate Branded Images
**Run script** (requires Python):
```bash
python scripts/create-blog-images.py \
  --blog-title "Sâm Ngọc Linh: Khảm Phục Thần Dược" \
  --count 3 \
  --output public/blog-images/

# Output:
# public/blog-images/blog-1.png (Giới Thiệu section)
# public/blog-images/blog-2.png (Công Dụng section)
# public/blog-images/blog-3.png (Hướng Dẫn Sử Dụng section)
```

### Option 3: Use Placeholder (Fast)
**For testing blog structure**:
```bash
# Create 800×600 placeholder PNGs
mkdir -p public/blog-images/
convert -size 800x600 xc:'#f0ebe0' public/blog-images/blog-1.png  # Ivory
convert -size 800x600 xc:'#d4af37' public/blog-images/blog-2.png  # Gold
convert -size 800x600 xc:'#8b6f47' public/blog-images/blog-3.png  # Brown
```

---

## 🖼️ Compression Workflow

### Step 1: Gather Images
```bash
mkdir -p public/blog-images/
cp public/products/samk5/SK5-004.jpg public/blog-images/blog-tho-yen.jpg
cp public/products/trimico/TRIMICO-root.jpg public/blog-images/blog-root.jpg
cp public/products/vkd/VKD-extract.jpg public/blog-images/blog-extract.jpg
```

### Step 2: Optimize to WebP
```bash
python scripts/image-optimizer.py \
  --input public/blog-images/ \
  --format webp \
  --quality 85 \
  --recursive

# Output:
# ✓ blog-tho-yen.jpg → blog-tho-yen.webp (-48.3%)
# ✓ blog-root.jpg → blog-root.webp (-52.1%)
# ✓ blog-extract.jpg → blog-extract.webp (-45.7%)
```

### Step 3: Verify & Reference in Blog

Check file sizes:
```bash
ls -lh public/blog-images/*.webp
# Result: ~120KB each (vs 250KB+ original JPGs)
```

Update blog post markdown:
```markdown
![Tổ Yến Sâm Ngọc Linh](public/blog-images/blog-tho-yen.webp)
_Hình 1: Tổ Yến giàu collagen, kết hợp với sâm cải thiện hấp thu_

...

![Rễ Sâm Tự Nhiên](public/blog-images/blog-root.webp)
_Hình 2: Sâm Ngọc Linh hoang dã, tuổi 20-50 năm_
```

---

## 📝 Update Blog Post with Images

### Current Blog File
`src/data/blogPosts/sample-premium-blog-post.md`

### Add Images (Replace text with images + captions)

**After "Sâm Ngọc Linh Là Gì?" section:**
```markdown
## Sâm Ngọc Linh Là Gì?

Sâm Ngọc Linh (*Panax vietnamensis*) là loài sâm hoang dã quý hiếm...

![Sâm Ngọc Linh tự nhiên](public/blog-images/blog-root.webp)
_Sâm Ngọc Linh hoang dã, tuổi 20-50 năm. Hình ảnh: Mẫu từ vùng Kon Tum_

Thành phần chính gồm...
```

**After "Tăng Cường Miễn Dịch" section:**
```markdown
## Công Dụng — Khoa Học Chứng Minh

### 1. Tăng Cường Miễn Dịch

![Tổ Yến Sâm Ngọc Linh](public/blog-images/blog-tho-yen.webp)
_Tổ Yến kết hợp sâm, giàu collagen + saponin_

Nghiên cứu từ Đại học Y Hà Nội...
```

---

## 🎯 For Multiple Blog Posts

### Map Images to Different Posts

| Bài Blog | Image 1 | Image 2 | Image 3 |
|----------|---------|---------|---------|
| Sâm Ngọc Linh (sample) | Root | Tổ Yến | Extract |
| Cách Chọn Sâm Thật | Lab test | Packaging | Certificate |
| Công Thức Nước Sâm | Raw ingredients | Brewing | Finished drink |
| Nữ Tính & Làm Đẹp | Before/after skin | Collagen close-up | Product bottle |

**Naming convention**: `public/blog-images/{post-slug}-{number}.webp`

Example:
```
public/blog-images/
├── sam-ngoc-linh-1.webp (Root)
├── sam-ngoc-linh-2.webp (Tổ Yến)
├── sam-ngoc-linh-3.webp (Extract)
├── cach-chon-sam-1.webp (Lab test)
├── cach-chon-sam-2.webp (Certificate)
└── ... (more posts)
```

---

## 📊 File Size Impact

### Before Optimization
```
blog-tho-yen.jpg:   285 KB
blog-root.jpg:      312 KB
blog-extract.jpg:   268 KB
Total (3 images):   865 KB
```

### After Optimization (WebP)
```
blog-tho-yen.webp:  147 KB (-48%)
blog-root.webp:     149 KB (-52%)
blog-extract.webp:  145 KB (-46%)
Total (3 images):   441 KB (-49%)
```

**Impact per post**: 865KB → 441KB saved per blog post  
**For 10 posts**: 8.65MB → 4.41MB (-49% storage + faster load)

---

## 🔗 Integration Steps

1. **Create images** (Option 1/2/3 from above)
2. **Run image-optimizer** to compress to WebP
3. **Update `sample-premium-blog-post.md`** with image references
4. **Commit** blog post + images
5. **Publish** via admin CMS (or directly update DB)
6. **Verify** on live site (browser check images load)

---

## ✅ Checklist Before Publishing

- [ ] ≥2 images per blog post
- [ ] Images optimized to WebP (max 200KB each)
- [ ] Image captions descriptive (alt text for SEO)
- [ ] Images reference correct file path
- [ ] Images display correctly on mobile (800×600 responsive)
- [ ] Load time <3s with all images (check DevTools)
- [ ] Social share preview shows hero image (og:image)

---

## 🚀 Automated Image Workflow (Future)

Batch script to automate:
```bash
#!/bin/bash
# auto-blog-images.sh — Run weekly

BLOG_DIR="src/data/blogPosts/"
OUTPUT_DIR="public/blog-images/"

for blog in $BLOG_DIR/*.md; do
  echo "Processing $(basename $blog)..."
  
  # Extract blog title
  TITLE=$(head -1 "$blog" | sed 's/^# //')
  
  # Generate images
  python scripts/create-blog-images.py \
    --blog-title "$TITLE" \
    --count 2 \
    --output "$OUTPUT_DIR"
  
  # Optimize
  python scripts/image-optimizer.py \
    --input "$OUTPUT_DIR" \
    --format webp \
    --quality 85 \
    --recursive
done
```

---

**Next**: Copy 2-3 ảnh từ `public/products/` vào `public/blog-images/`, chạy optimizer, publish blog!
