# TA Image Tools Guide — 5 Essential Scripts

**Version**: 1.0 (2026-08-20)  
**Purpose**: Automated image processing for product catalog, posters, and brand consistency

---

## 🎯 Quick Reference

| Tool | Purpose | Command | Input | Output |
|------|---------|---------|-------|--------|
| **image-optimizer** | Reduce size 30-50% | `python image-optimizer.py --input DIR --format webp` | JPG/PNG | WebP/AVIF |
| **color-extractor** | Extract brand colors | `python color-extractor.py --input photo.jpg` | JPG/PNG | Hex colors |
| **background-remover** | Remove white bg | `python background-remover.py --input photo.jpg --output out.png` | JPG | PNG (transparent) |
| **detect-duplicate** | Find similar images | `python detect-duplicate-images.py --input DIR --threshold 90` | DIR | Report |
| **poster-generator** | Create combo posters | `python poster-generator.py --type combo --products SK5-001,SK5-002 --title "Combo" --price 899000` | Product IDs | PNG poster |

---

## 1️⃣ Image Optimizer

**Purpose**: Convert images to modern formats (WebP, AVIF) to reduce file size by 30-50%.

### Install
```bash
pip install Pillow
```

### Usage
```bash
# Optimize single image
python image-optimizer.py --input product.jpg --format webp --quality 80

# Batch optimize directory
python image-optimizer.py --input public/products/ --format webp --quality 80 --recursive

# AVIF format (best compression, slower)
python image-optimizer.py --input public/products/ --format avif --quality 75
```

### Why TA Needs This
- Site has 90 SKU images (400KB each = 36MB total)
- WebP reduces to 150KB each (13.5MB = 62% savings)
- Faster load time on mobile (Ngọc Linh customers)
- Better SEO (Google favors fast sites)

### Output
```
✓ product.jpg → product.webp (-45.2%)
✓ photo.jpg → photo.webp (-38.7%)
```

---

## 2️⃣ Color Extractor

**Purpose**: Extract dominant colors for UI/brand consistency.

### Install
```bash
pip install Pillow
```

### Usage
```bash
# Extract top 3 colors
python color-extractor.py --input samk5/SK5-001.jpg --count 3

# Exclude white pixels (for product photos)
python color-extractor.py --input samk5/SK5-001.jpg --count 5 --exclude-white
```

### Output
```
1. #c9a76f (RGB: (201, 167, 111))  ← Gold accent
2. #8b6f47 (RGB: (139, 111, 71))   ← Brown
3. #d4af37 (RGB: (212, 175, 55))   ← Brass
```

### Use Cases
- Extract brand colors from product photos → Tailwind CSS variables
- Ensure consistency across carousel/cards
- Create color palette for new designs
- A/B test accent colors on checkout

---

## 3️⃣ Background Remover

**Purpose**: Remove white/light backgrounds → PNG with alpha transparency.

### Install
```bash
pip install Pillow
```

### Usage
```bash
# Default (threshold 220)
python background-remover.py --input product.jpg --output product-clean.png

# Strict threshold (only pure white)
python background-remover.py --input product.jpg --output product-clean.png --threshold 245

# Loose threshold (include light grays)
python background-remover.py --input product.jpg --output product-clean.png --threshold 200
```

### Output
- PNG with alpha channel (transparent background)
- Preserves product details
- Ready to overlay on brand gradient

### Use Cases
- Remove studio white background from product photos
- Create transparent PNG for carousel
- Layer product images on colored backgrounds
- Generate dynamic poster backgrounds

---

## 4️⃣ Detect Duplicate Images

**Purpose**: Find visually similar images (perceptual hashing).

### Install
```bash
pip install Pillow imagehash
```

### Usage
```bash
# Find duplicates in product directory (threshold: 90%)
python detect-duplicate-images.py --input public/products/ --threshold 90

# Loose (catch similar variants)
python detect-duplicate-images.py --input public/products/ --threshold 75

# Strict (catch only exact copies)
python detect-duplicate-images.py --input public/products/ --threshold 98
```

### Output
```
⚠ 92.3% similar:
  public/products/samk5/SK5-001.jpg
  public/products/samk5/SK5-001-backup.jpg

Found 3 duplicate pairs
```

### Use Cases
- Audit product catalog for accidental duplicates
- Detect when vendor sends variant images (slightly rotated/cropped)
- Clean up before generating combo posters
- Verify image uniqueness after batch uploads

---

## 5️⃣ Poster Generator

**Purpose**: Create branded combo/product posters (images + text + styling).

### Install
```bash
pip install Pillow
```

### Usage
```bash
# Create combo poster
python poster-generator.py \
  --type combo \
  --products SK5-001,SK5-002,SK5-003 \
  --title "Dưỡng Nhan Sâm Yến" \
  --price 899000 \
  --output public/products/combo/duong-nhan-poster.png

# Single product poster
python poster-generator.py \
  --type single \
  --products SK5-004 \
  --title "Tổ Yến Sâm Ngọc Linh" \
  --price 525000 \
  --output poster.png

# Promotion poster
python poster-generator.py \
  --type promo \
  --products SK5-001,SK5-002 \
  --title "Khuyến Mãi Tháng 8" \
  --price 1299000 \
  --output poster-promo.png
```

### Output
- PNG poster (800×600px, optimized for mobile)
- Premium gradient background (Ivory → Gold)
- Product images composited
- Pricing + brand tagline
- Ready to upload to fanpage/TikTok

### Customization
Edit colors in script:
```python
poster = Image.new("RGB", (800, 600), color=(240, 235, 220))  # Ivory
draw.text(..., fill=(184, 134, 11), ...)  # Gold
```

---

## 📋 Workflow Integration

### Step 1: Optimize Catalog (Week 1)
```bash
python image-optimizer.py --input public/products/ --format webp --recursive
# Result: 36MB → 13.5MB images, faster page load
```

### Step 2: Extract Colors (Week 2)
```bash
for img in public/products/*/*.jpg; do
  python color-extractor.py --input "$img" --count 1
done
# Result: Tailwind CSS color palette
```

### Step 3: Audit for Duplicates (Weekly)
```bash
python detect-duplicate-images.py --input public/products/ --threshold 92
# Result: Clean catalog, no redundant images
```

### Step 4: Generate Posters (Monthly)
```bash
# For each combo in combo_sets
python poster-generator.py \
  --type combo \
  --products $(echo $COMBO_SKUS | tr ',' ' ') \
  --title "$COMBO_TITLE" \
  --price $COMBO_PRICE \
  --output "public/products/combo/${COMBO_SLUG}.png"
```

### Step 5: Background Removal (As Needed)
```bash
# If new product photo has white background
python background-remover.py --input new-product.jpg --output new-product-clean.png
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `imagehash not found` | `pip install imagehash` |
| `timesbd.ttf not found` | Font file path error; check Windows Fonts folder |
| `PIL.UnidentifiedImageError` | Corrupted image file; verify with image viewer |
| `Permission denied` | Output directory not writable; check folder permissions |
| Poster text overlaps images | Adjust `y` coordinate in poster-generator.py |

---

## 📊 File Size Impact

### Before Optimization (90 SKUs)
- Format: JPG (studio photos)
- Average size: 400KB per image
- Total: 36 MB (slow on mobile)

### After Optimization
| Format | Size | Savings | Load Time |
|--------|------|---------|-----------|
| WebP (quality 80) | 150KB | -62% | 2.5s → 1.0s |
| AVIF (quality 75) | 100KB | -75% | 2.5s → 0.8s |

**Recommendation**: Use WebP (good balance) or AVIF (best compression, niche browser support).

---

## 🎨 Brand Consistency

Use extracted colors across site:
```css
/* From color-extractor output */
:root {
  --brand-gold: #d4af37;
  --brand-brown: #8b6f47;
  --brand-ivory: #f0ebe0;
}
```

Apply to:
- Product carousel borders
- Button accents
- Combo card overlays
- Poster backgrounds

---

## 📚 Further Reading

- [Pillow Documentation](https://pillow.readthedocs.io/)
- [ImageHash Perceptual Hashing](https://github.com/JohannesBuchner/imagehash)
- [WebP Format Benefits](https://developers.google.com/speed/webp)
- `manage-site-images` skill for visual QA

---

**Version**: 1.0 (2026-08-20) · **Maintain by**: Claude Code TA project
