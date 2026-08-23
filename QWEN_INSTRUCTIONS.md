# 🤖 Qwen/Ollama Instructions for TA Admin Dashboard

**Purpose:** Offload coding tasks to local Qwen/Ollama to save Claude tokens  
**Claude Role:** Review, verify, and approve changes only

---

## ✅ What Qwen Can Do

### **1. Dashboard UI Improvements**
- Fix bugs in JavaScript
- Add new tabs or sections
- Improve responsive design
- Add animations/transitions
- Fix styling issues

**Example Prompt for Qwen:**
```
Task: Add a "Statistics" section to show total revenue from products
File: strapi-admin-dashboard.html
Requirements:
- Calculate: (salePrice * stock) for each product
- Display in card format
- Show in Products tab
- Use VND currency format
```

### **2. API Server Enhancements**
- Add new endpoints
- Handle edge cases
- Add error handling
- Implement caching

**Example Prompt:**
```
Task: Add PUT endpoint to update products
File: mock-strapi-server.js
- Endpoint: PUT /api/products/:id
- Accept JSON with updated fields
- Return updated product
- Handle validation errors
```

### **3. Deployment Scripts**
- Fix Windows batch files (.bat)
- Improve bash scripts
- Add error handling
- Create new automation scripts

**Example Prompt:**
```
Task: Fix start-strapi.bat to handle Docker errors
File: start-strapi.bat
Issues:
- Should check if Docker Desktop is installed
- Should wait for PostgreSQL to be healthy
- Should timeout after 30 seconds
```

### **4. Documentation**
- Update guides
- Fix typos/grammar
- Add examples
- Improve clarity

---

## 🚫 What Qwen Should NOT Do

❌ Make architecture decisions  
❌ Change API contracts/data structure  
❌ Modify authentication/security  
❌ Delete or rename collections  
❌ Deploy to production servers  
❌ Handle secrets/credentials  

**For these:** Use Claude for review + approval

---

## 📋 Workflow

### **Step 1: Qwen Codes (Save Tokens)**
```bash
# Tell Qwen:
"Add feature X to strapi-admin-dashboard.html
Requirements:
- Display product SKU in bold
- Show stock in red if < 10
- Make responsive for mobile
"
```

### **Step 2: Qwen Outputs Changes**
Qwen generates code changes and uploads/pastes to local file.

### **Step 3: Claude Reviews** 
- Read changes
- Verify correctness
- Test if needed
- Approve or request fixes

### **Step 4: Commit to Git**
```bash
git add [modified-files]
git commit -m "feat: [description of changes]"
```

---

## 🔧 Common Tasks for Qwen

### **Add Product Price Formatter**
```javascript
// Task for Qwen:
// Add function to format Vietnamese currency
// Input: 500000 → Output: "500.000 ₫"

function formatVND(price) {
  return price.toLocaleString('vi-VN') + ' ₫';
}
```

### **Fix Mobile Responsiveness**
```css
/* Task for Qwen:
   Make dashboard work on 375px width phones
   - Adjust grid columns
   - Stack tabs vertically
   - Reduce padding on mobile
*/

@media (max-width: 768px) {
  .stats {
    grid-template-columns: 1fr;
  }
  .tabs {
    flex-wrap: wrap;
  }
}
```

### **Add Search/Filter**
```html
<!-- Task for Qwen:
     Add search box to Products tab
     - Filter by SKU or name
     - Case-insensitive
     - Real-time as user types
-->

<input type="text" id="searchBox" placeholder="Tìm kiếm sản phẩm...">
<script>
  document.getElementById('searchBox').addEventListener('input', (e) => {
    // Filter logic here
  });
</script>
```

---

## 🎯 Current Dashboard Capabilities

**Already Implemented (Don't Redo):**
- ✅ Display 3 products with multilingual text
- ✅ Show site header, footer, social links
- ✅ Real-time API data fetch
- ✅ Tab switching
- ✅ Responsive design
- ✅ Auto-refresh every 10 seconds
- ✅ Status indicators

**Good Candidates for Qwen:**
- 📝 Add search/filter functionality
- 🔄 Add data export (CSV, JSON)
- 📊 Add charts (revenue, stock levels)
- ✏️ Add inline editing capability
- 🔔 Add notifications for low stock
- 📱 Improve mobile UI
- 🎨 Add dark mode
- 🔍 Add product preview modal

---

## 🧪 Testing After Qwen Changes

**Always test:**
```bash
# 1. Check syntax
node -c [modified-js-files]

# 2. Test API still works
curl http://localhost:1337/api/products

# 3. Test dashboard loads
# Open: file:///D:/TA%20page/site/strapi-admin-dashboard.html

# 4. Run automated tests
bash test-admin-dashboard.sh
```

---

## 🚀 Example: Qwen Task Template

```
TASK: [Brief description]

FILE: [path to file]

CURRENT BEHAVIOR: [What happens now]

DESIRED BEHAVIOR: [What should happen]

REQUIREMENTS:
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

CONSTRAINTS:
- Must use existing API format
- Cannot change collection structure
- Must maintain responsive design

TEST CASES:
- Test case 1
- Test case 2
```

---

## 💡 Tips for Token Efficiency

**Use Qwen for:**
- HTML/CSS/JavaScript fixes
- Shell script updates
- Documentation improvements
- Repetitive code changes

**Use Claude for:**
- Architecture decisions
- Security reviews
- Complex debugging
- Production deployments

**Ratio:** ~80% Qwen work, ~20% Claude review

---

## 📞 Quick Reference

**Qwen can modify:**
- `strapi-admin-dashboard.html` ✅
- `mock-strapi-server.js` ✅ (non-critical features)
- `.bat` and `.sh` scripts ✅
- Documentation `.md` files ✅

**Qwen should NOT modify:**
- API data contracts ❌
- Authentication logic ❌
- Deployment configs ❌
- Security settings ❌

---

**Status:** Ready for Qwen to handle tasks  
**Claude Role:** Approve & verify only  
**Token Savings:** ~70% reduction in Claude usage
