# 🎯 Qwen Improvement Tasks for Admin Dashboard

**After deployment to tasamngoclinh.com, use these tasks to improve the dashboard**  
**Claude will review & approve each change**

---

## 🎨 UI/UX Improvements (Priority: HIGH)

### **Task 1: Add Revenue Calculator**
```
TASK: Calculate and display total revenue per product

FILE: strapi-admin-dashboard.html

CURRENT BEHAVIOR:
- Dashboard shows products with price and salePrice
- No revenue calculation

DESIRED BEHAVIOR:
- Add "Revenue" column to products tab
- Calculate: salePrice × stock for each product
- Show total revenue at bottom
- Format as Vietnamese currency (12.500.000 ₫)

REQUIREMENTS:
- [ ] Add revenue calculation function
- [ ] Display in products card
- [ ] Add summary stat showing total revenue
- [ ] Make responsive on mobile

TEST CASES:
- Product 1: 450,000 × 25 = 11,250,000 ₫
- Product 2: 220,000 × 50 = 11,000,000 ₫  
- Product 3: 150,000 × 100 = 15,000,000 ₦
- Total: 37,250,000 ₫
```

### **Task 2: Add Stock Level Indicator**
```
TASK: Visual indicator for low/medium/high stock

FILE: strapi-admin-dashboard.html

DESIRED BEHAVIOR:
- Green badge: Stock > 50
- Yellow badge: Stock 10-50
- Red badge: Stock < 10
- Warning icon for critical items

REQUIREMENTS:
- [ ] Add color-coded stock badges
- [ ] Add warning alerts
- [ ] Highlight low stock products
- [ ] Add "stock health" stat

IMPLEMENTATION:
function getStockStatus(stock) {
  if (stock < 10) return { color: 'red', label: '⚠️ Critical' };
  if (stock < 50) return { color: 'yellow', label: '🟡 Low' };
  return { color: 'green', label: '✓ OK' };
}
```

### **Task 3: Add Dark Mode Toggle**
```
TASK: Add dark/light theme toggle

FILE: strapi-admin-dashboard.html

REQUIREMENTS:
- [ ] Add theme toggle button (top-right)
- [ ] Save preference to localStorage
- [ ] Smooth color transitions
- [ ] Update all color variables
- [ ] Test on all tabs

COLOR SCHEME:
Dark mode:
  - Background: #1a1a1a
  - Text: #f0f0f0
  - Cards: #2d2d2d
  - Accent: #667eea (keep same)
```

---

## 📊 Data Features (Priority: MEDIUM)

### **Task 4: Export Data to CSV**
```
TASK: Add "Export" button to download data

FILE: strapi-admin-dashboard.html

FUNCTIONALITY:
- Export products as CSV
- Export social links as CSV
- Export all data as JSON

BUTTON: Add to each tab header

FORMAT:
Products CSV:
SKU,Name (VI),Price,Sale Price,Stock,Active

social_links CSV:
Platform,URL,Display Order,Active
```

### **Task 5: Add Search/Filter**
```
TASK: Add search box to filter products

FILE: strapi-admin-dashboard.html

REQUIREMENTS:
- [ ] Add search input to Products tab
- [ ] Filter by SKU, name, or category
- [ ] Case-insensitive search
- [ ] Real-time filtering as user types
- [ ] Clear button to reset

IMPLEMENTATION:
1. Add input: <input id="searchProducts" placeholder="Tìm kiếm...">
2. Add listener to filter displayedProducts
3. Hide non-matching cards
```

### **Task 6: Add Product Edit Modal**
```
TASK: Allow quick inline editing of products

FILE: strapi-admin-dashboard.html

FUNCTIONALITY:
- Click on product card to open modal
- Edit: name (VI), price, salePrice, stock
- Save button sends PUT request
- Cancel closes without saving

MODAL FIELDS:
- Product SKU (read-only)
- Name (VI) input
- Price input
- Sale Price input
- Stock input
- Featured checkbox
- Active checkbox
```

---

## 🔧 API Enhancements (Priority: LOW - Only if needed)

### **Task 7: Add Product Update Endpoint**
```
TASK: Implement PUT /api/products/:id for editing

FILE: mock-strapi-server.js

ENDPOINT: PUT /api/products/:id

REQUEST BODY:
{
  "data": {
    "name": { "vi": "Updated name" },
    "price": 300000,
    "stock": 40
  }
}

RESPONSE:
{
  "data": {
    "id": 1,
    "sku": "SAM-001",
    ...updated fields...
  }
}

REQUIREMENTS:
- [ ] Validate input
- [ ] Update product in memory
- [ ] Return updated product
- [ ] Handle not found (404)
```

### **Task 8: Add Delete Product Endpoint**
```
TASK: Implement DELETE /api/products/:id

FILE: mock-strapi-server.js

ENDPOINT: DELETE /api/products/:id

RESPONSE:
{
  "data": {
    "id": 1,
    "message": "Product deleted"
  }
}

REQUIREMENTS:
- [ ] Remove from products array
- [ ] Return confirmation
- [ ] Handle not found (404)
```

---

## 🎬 Animation & Polish (Priority: LOW)

### **Task 9: Add Loading Animations**
```
TASK: Improve visual feedback during data loading

FILE: strapi-admin-dashboard.html

ADDITIONS:
- Skeleton screens for cards while loading
- Pulse animation for loading state
- Fade-in animation when data appears
- Spin animation for refresh button

CSS:
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-skeleton {
  animation: pulse 2s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}
```

### **Task 10: Add Hover Effects**
```
TASK: Improve interactivity with micro-interactions

FILE: strapi-admin-dashboard.html

ADDITIONS:
- Scale up cards on hover
- Color change on tab hover
- Icon rotation on button hover
- Smooth transitions

CSS:
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
```

---

## 📱 Mobile Optimization (Priority: HIGH)

### **Task 11: Improve Mobile Layout**
```
TASK: Optimize dashboard for phones (375px width)

FILE: strapi-admin-dashboard.html

REQUIREMENTS:
- [ ] Stack stat boxes vertically on mobile
- [ ] Make tabs scrollable horizontally
- [ ] Reduce padding on mobile
- [ ] Full-width cards
- [ ] Touch-friendly buttons (48px min)
- [ ] Hide less important data on mobile

BREAKPOINT: 768px

MOBILE CHANGES:
- .stats { grid-template-columns: 1fr; }
- .multilang { grid-template-columns: 1fr; }
- .tabs { font-size: 12px; }
- .card { padding: 12px; }
```

### **Task 12: Add Mobile Menu**
```
TASK: Replace tab bar with hamburger menu on mobile

FILE: strapi-admin-dashboard.html

FUNCTIONALITY:
- Show hamburger icon on mobile
- Click to toggle menu
- Tabs appear in dropdown
- Close on selection

BREAKPOINT: < 768px

MARKUP:
<button id="menuToggle" class="hamburger">☰</button>
<nav id="mobileMenu" class="hidden">
  [tabs]
</nav>
```

---

## 🧪 Testing & QA (Priority: MEDIUM)

### **Task 13: Add Unit Tests**
```
TASK: Add basic JavaScript tests

FILE: Create test-dashboard.js

TESTS:
- formatVND(500000) → "500.000 ₫"
- getStockStatus(5) → { color: 'red', label: '⚠️ Critical' }
- filterProducts("SAM") → [SAM-001, SAM-002]
- calculateRevenue(products) → 37250000

FRAMEWORK: Jest or simple assertions

TEST COMMAND:
node test-dashboard.js
```

---

## 📋 Task Priority Guide

**Do FIRST (Immediate):**
1. Task 1: Revenue Calculator
2. Task 2: Stock Indicator
3. Task 11: Mobile Optimization

**Do SECOND (Next Week):**
4. Task 3: Dark Mode
5. Task 4: Export CSV
6. Task 5: Search/Filter

**Do LATER (Nice-to-Have):**
7. Task 6-10: Edit modal, animations, etc.

---

## 🚀 How to Submit Qwen Work

**Format for Qwen response:**
```
## Modified Files:
- strapi-admin-dashboard.html ← main changes
- [other files if applicable]

## Changes Made:
1. Added revenue calculation function
2. Added color-coded stock badges
3. Added stats summary section
4. Made responsive for mobile

## Testing:
✅ Tested on Chrome
✅ Tested on Firefox
✅ Tested on mobile (375px)

## Claude Review:
Ready for review - see attached code changes
```

---

## ✅ Approval Process

1. **Qwen codes** → Generates changes
2. **Qwen tests** → Verifies locally
3. **Claude reviews** → Checks correctness, security
4. **Claude approves** → "Looks good, merging now"
5. **Commit & deploy** → Push to production

---

**Start with Task 1 (Revenue Calculator)**  
**Estimated time: 30 minutes with Qwen**  
**Claude review: 5 minutes**

Let's build something amazing! 🚀
