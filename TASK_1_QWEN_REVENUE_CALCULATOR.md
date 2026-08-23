# 🎯 QWEN TASK 1: Revenue Calculator

**Status:** READY FOR QWEN  
**Priority:** HIGH  
**Estimated Time:** 30-45 minutes  
**Difficulty:** MEDIUM

---

## 📋 TASK SUMMARY

Add revenue calculation and display to the admin dashboard. Users should see:
1. Revenue for each product (salePrice × stock)
2. Total revenue summary
3. Profit calculation (if applicable)
4. All formatted as Vietnamese currency (₫)

---

## 📂 FILE TO MODIFY

**File:** `strapi-admin-dashboard.html`

**Location:** `D:\TA page\site\strapi-admin-dashboard.html`

---

## 🎯 REQUIREMENTS

### Display Requirements
- [ ] Show revenue in each product card
- [ ] Add "Total Revenue" stat box at top of Products tab
- [ ] Add "Avg Revenue per Item" stat
- [ ] Format all numbers as VND (1.234.567 ₫)
- [ ] Keep responsive design (mobile-friendly)

### Calculation
```
Revenue = salePrice × stock

Product 1 (SAM-001): 450,000 × 25 = 11,250,000 ₫
Product 2 (SAM-002): 220,000 × 50 = 11,000,000 ₫
Product 3 (SAM-003): 150,000 × 100 = 15,000,000 ₦
TOTAL: 37,250,000 ₦
AVERAGE: 12,416,667 ₦
```

### Styling
- Use existing color scheme (purple #667eea accent)
- Add to stats section (with product count & total stock)
- Make stat boxes responsive
- Add currency symbol (₫) next to all prices

---

## 🔍 WHERE TO ADD

### 1. Add JavaScript Function
Add this to `displayProducts()` function:

```javascript
// Calculate revenue
function calculateRevenue(products) {
  let total = 0;
  products.forEach(p => {
    const revenue = (p.salePrice || p.price) * (p.stock || 0);
    total += revenue;
  });
  return total;
}

function formatVND(num) {
  return num.toLocaleString('vi-VN') + ' ₫';
}
```

### 2. Update Stats Section
Find this in `displayProducts()`:
```html
<div class="stats">
  <div class="stat-box">
    <div class="stat-number" id="productCount">0</div>
    <div class="stat-label">Tổng Sản Phẩm</div>
  </div>
  <div class="stat-box">
    <div class="stat-number" id="totalStock">0</div>
    <div class="stat-label">Tổng Kho</div>
  </div>
</div>
```

**Add 2 more stat boxes:**
```html
  <div class="stat-box">
    <div class="stat-number" id="totalRevenue">0</div>
    <div class="stat-label">Tổng Doanh Thu</div>
  </div>
  <div class="stat-box">
    <div class="stat-number" id="avgRevenue">0</div>
    <div class="stat-label">TB/Sản Phẩm</div>
  </div>
```

### 3. Update Product Card
In product card HTML, add revenue row after price:

```html
<div style="margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 6px;">
  <div style="font-size: 12px; color: #999; margin-bottom: 10px;">💰 Doanh Thu</div>
  <div style="font-size: 20px; font-weight: bold; color: #10b981;">
    ${formatVND((p.salePrice || p.price) * (p.stock || 0))}
  </div>
</div>
```

---

## 📝 TESTING CHECKLIST

After making changes, test:

- [ ] Dashboard loads without JavaScript errors (check browser F12)
- [ ] Products tab shows 3 products
- [ ] Each product card shows revenue in green
- [ ] Stat section shows 4 boxes (Count, Stock, Revenue, Avg)
- [ ] Numbers format correctly: `11.250.000 ₫`
- [ ] Revenue calculations are correct:
  - SAM-001: 11,250,000 ₫
  - SAM-002: 11,000,000 ₫
  - SAM-003: 15,000,000 ₦
  - Total: 37,250,000 ₦
  - Average: 12,416,667 ₦
- [ ] Responsive on mobile (375px width)
- [ ] No layout issues on Chrome, Firefox

---

## 🔄 SUBMISSION FORMAT

**When done, reply with:**

```
## ✅ Task 1: Revenue Calculator - COMPLETE

### Changes Made:
1. Added calculateRevenue() function
2. Added formatVND() function
3. Added 2 stat boxes (Total Revenue, Avg Revenue)
4. Added revenue row to each product card
5. Formatted all numbers as VND currency

### Testing Results:
✅ Dashboard loads without errors
✅ All calculations correct
✅ Numbers format correctly (11.250.000 ₫)
✅ Responsive on mobile
✅ No console errors

### File Modified:
- strapi-admin-dashboard.html

### Claude Review Needed:
[Copy-paste your modified HTML section here for review]
```

---

## 💡 TIPS

1. **VND Format:** Use JavaScript `toLocaleString('vi-VN')` to format numbers
2. **Colors:** Use green (#10b981) for revenue to make it stand out
3. **Mobile:** Ensure stat boxes stack on small screens
4. **Calculation:** Use `(p.salePrice || p.price)` to handle missing salePrice
5. **Rounding:** Round to nearest integer for VND (no decimals)

---

## ❌ COMMON MISTAKES TO AVOID

- ❌ Forget to update HTML stat boxes (need 4 total, not 2)
- ❌ Use wrong price field (should be `salePrice`, not `price`)
- ❌ Forget to multiply by stock
- ❌ Wrong locale for VND (should be `vi-VN`)
- ❌ Don't test on mobile
- ❌ Break existing CSS/styling

---

## 🎯 SUCCESS CRITERIA

✅ Pass if:
- Revenue displays for each product
- Total revenue stat box appears
- Average revenue stat box appears
- All numbers format as VND (₫)
- Dashboard still responsive
- No console errors
- Calculations mathematically correct

❌ Fail if:
- Dashboard shows JavaScript errors
- Revenue not displaying
- Numbers not formatted correctly
- Mobile layout broken
- Any existing features broken

---

## 📞 SUPPORT

If stuck:
1. Check browser console (F12) for errors
2. Verify `formatVND()` function syntax
3. Test with `console.log(calculateRevenue(products))`
4. Compare with original `displayProducts()` structure
5. Check that stat boxes have correct IDs

---

## 🚀 AFTER APPROVAL

Once Claude approves:
1. Claude will merge to git
2. Deploy to tasamngoclinh.com
3. Test live dashboard
4. Move to Task 2 (Stock Indicators)

---

**Ready? Start coding! 🎉**

Questions? This task is clear and self-contained.

**Qwen, make it awesome! 💪**
