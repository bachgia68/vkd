# 🎯 QWEN: Admin Dashboard Features (Priority Order)

**Date:** 2026-08-23  
**Status:** READY FOR IMPLEMENTATION  
**File to modify:** `strapi-admin-dashboard.html`

---

## **TASK 1: Video Upload Tool** ⭐ HIGH PRIORITY

### Description
Add **Video Management Tab** to admin dashboard. Users upload videos directly, no auto-post to social media.

### Requirements
- [x] New tab: "📹 Video Management"
- [x] Drag-drop upload UI
- [x] Display video list with file names
- [x] Delete button for each video
- [x] Store in `/public/videos/` folder
- [x] Show upload progress
- [x] Multi-language support (VI/EN/FR/ZH)

### Implementation Details
```javascript
// Add to tabs
<button class="tab-btn" onclick="switchTab('video')">📹 Video Management</button>

// Video tab content:
- Upload input (drag-drop)
- Video list table (name, size, date, actions)
- Delete button with confirm
- Upload progress bar

// API endpoint:
POST /api/video/upload
GET /api/video/list
DELETE /api/video/{id}
```

### Testing Checklist
- [ ] Can upload MP4, WebM, MOV files
- [ ] File size validation (max 500MB)
- [ ] Display progress during upload
- [ ] Delete works and removes file
- [ ] Responsive on mobile (375px+)
- [ ] No console errors (F12)

---

## **TASK 2: Product CRUD Operations** ⭐ HIGH PRIORITY

### Description
Add Add/Edit/Delete buttons to Products tab. Users manage products directly in admin.

### Requirements
- [x] "Add Product" button → Form
- [x] Edit button on each product card
- [x] Delete button with confirm
- [x] Form fields: SKU, Name (VI/EN/FR/ZH), Price, Sale Price, Stock, Description
- [x] Save to API
- [x] Form validation

### Implementation Details
```javascript
// Product form:
- SKU (text)
- Name (multilingual object: {vi, en, fr, zh})
- Price (number)
- Sale Price (number, optional)
- Stock (number)
- Description (textarea, multilingual)
- Submit button → POST to API

// API endpoints:
POST /api/products (create)
PUT /api/products/{sku} (edit)
DELETE /api/products/{sku} (delete)
```

### Testing Checklist
- [ ] Add product form appears
- [ ] Edit fills form with current data
- [ ] Delete shows confirm dialog
- [ ] Save creates/updates in API
- [ ] SKU validation (unique)
- [ ] Responsive form layout

---

## **TASK 3: KGC-Style Effects** ⭐⭐ CRITICAL (Brand)

### Description
Apply **swipe carousel + elegant animations** like KGC website (reference: https://kgc.co.kr).

### Features
- Swipe/carousel gallery for rừng sâm images
- Smooth transitions (300ms)
- Hover effects: scale + shadow
- Color scheme: KGC green (#2d5016) → TA green
- Auto-play (5s interval)
- Touch support (mobile swipe)

### Implementation Details
```css
/* Swipe container */
.gallery-swipe {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 20px;
}

/* Hover effect */
.gallery-item:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

/* Color palette */
--ta-green: #2d5016;
--ta-accent: #667eea;
```

### Where to Apply
1. Image galleries (rừng sâm photos section)
2. Product images
3. Footer image carousel

### Testing Checklist
- [ ] Swipe works on desktop (mouse drag)
- [ ] Swipe works on mobile (touch)
- [ ] Smooth animations (no jank)
- [ ] Colors match KGC style
- [ ] Responsive on all sizes
- [ ] Hover states visible

---

## **TASK 4: Image Gallery Management** (Nice-to-have)

### Description
Add **Image Upload Tab** for rừng sâm gallery. Users upload photos with angle selection.

### Requirements
- [x] "📸 Image Gallery" tab
- [x] Drag-drop upload
- [x] Angle selection: front, side, top, detail
- [x] Gallery display with filter by angle
- [x] Delete image button

### Testing Checklist
- [ ] Upload JPG, PNG, WebP
- [ ] Angle filter works
- [ ] Delete removes from gallery
- [ ] Mobile responsive

---

## **DELIVERABLES**

### Code Changes
1. Add video tab + upload logic
2. Add CRUD buttons + form
3. Apply KGC effects to galleries
4. Add image gallery tab

### Files Modified
- `strapi-admin-dashboard.html` (single file)

### Expected Result
- Admin can upload videos
- Admin can add/edit/delete products
- Dashboard has KGC-style animations
- All features responsive + multi-language

---

## **SUBMISSION FORMAT**

When done, reply with:

```
## ✅ Admin Dashboard Features - COMPLETE

### Features Delivered:
1. ✅ Video Upload Tool
2. ✅ Product CRUD
3. ✅ KGC-Style Effects
4. ✅ Image Gallery

### Testing Results:
- ✅ All uploads working
- ✅ CRUD operations functional
- ✅ KGC effects smooth
- ✅ Responsive on mobile
- ✅ No console errors

### File Modified:
- strapi-admin-dashboard.html

### Claude Review Needed:
[Paste the key JavaScript functions here for review]
```

---

## **NOTES**

- ❌ **NO repeats:** Don't ask if video upload is needed
- ❌ **NO external APIs:** Use local file storage only
- ✅ **Multi-language:** All text must support VI/EN/FR/ZH
- ✅ **Responsive:** Test 375px (mobile) + 1280px (desktop)
- ✅ **Performance:** Keep animations smooth (<60ms)

---

**Ready? Start with Task 1! 💪**
