# Feature: Admin Panel — Header/Footer/Social Links Management

## Overview
Add admin capability to manage homepage header/footer content and social media links without code deployment. Admin can add/edit/delete social channels (YouTube, Facebook, Instagram, TikTok, etc.) with icons and links.

## Scope

### 1. Header Management
- **What admin can edit:**
  - Logo image
  - Navigation menu links (text + URL)
  - Hero title/subtitle
  - CTA button (text + link)
- **Where:** Strapi CMS, collection: `SiteHeader`

### 2. Footer Management
- **What admin can edit:**
  - Company info (address, phone, email)
  - Footer links (columns: Services, Support, Legal)
  - Copyright text
- **Where:** Strapi CMS, collection: `SiteFooter`

### 3. Social Media Links (Multi-channel)
- **What admin can manage:**
  - Add new social channel (YouTube, Facebook, Instagram, TikTok, LinkedIn, Twitter, etc.)
  - Edit link + icon for each channel
  - Reorder channels
  - Delete channels
- **Fields per link:**
  - Channel name (enum: youtube, facebook, instagram, tiktok, linkedin, twitter, zalo, telegram)
  - URL (link to profile)
  - Icon (SVG or emoji or icon library)
  - Display order (priority)
  - Active/inactive toggle
- **Where:** Strapi CMS, collection: `SocialLinks`

---

## Technical Approach

### Option A: Strapi Admin UI (Recommended)
- Create new Strapi collections: `SiteHeader`, `SiteFooter`, `SocialLinks`
- Admin edits via Strapi dashboard
- Frontend fetches via Strapi API
- **Pros:** No code needed, drag-drop UI, no deployment
- **Cons:** Strapi running required
- **Cost:** Free (Strapi open-source)

### Option B: Custom React Admin Page
- Create `/admin/header-footer` page (protected route)
- Forms for editing content
- Save to Strapi/Supabase
- **Pros:** Full control, custom UX
- **Cons:** Code changes needed, deployment required
- **Cost:** Dev time

### Option C: Headless CMS (Contentful, Sanity)
- Use external CMS for content management
- **Pros:** Professional, easy collaboration
- **Cons:** Monthly cost, external dependency

---

## Recommended Approach: Option A (Strapi Collections)

**Why:**
- ✅ No code changes needed
- ✅ Admin can manage content immediately
- ✅ Reusable for other site content
- ✅ Budget-friendly (<$120/month)

---

## Implementation Tasks

### Phase 1: Strapi Collections Setup

**Task A1:** Create `SiteHeader` collection
- Fields: logo_url, nav_links (array), hero_title, hero_subtitle, cta_button_text, cta_button_link
- Permissions: publish-only (admin can edit, publish)

**Task A2:** Create `SiteFooter` collection
- Fields: company_address, company_phone, company_email, footer_links (array), copyright_text
- Permissions: publish-only

**Task A3:** Create `SocialLinks` collection
- Fields per item:
  - channel_name (enum: youtube, facebook, instagram, tiktok, linkedin, twitter, zalo, telegram)
  - url (text)
  - icon (text, emoji or SVG)
  - display_order (number)
  - is_active (boolean)
- Permissions: publish-only

**Task A4:** Test Strapi admin UI
- Admin creates test entries
- Verify CRUD operations work

### Phase 2: Frontend Integration

**Task B1:** Fetch header from Strapi API
- Create hook: `useHeader()` → fetch from `/api/site-header`
- Update homepage hero section to use dynamic data

**Task B2:** Fetch footer from Strapi API
- Create hook: `useFooter()` → fetch from `/api/site-footer`
- Update footer component to use dynamic data

**Task B3:** Fetch social links from Strapi API
- Create hook: `useSocialLinks()` → fetch from `/api/social-links`
- Update footer social section to use dynamic data
- Display icons + links for each channel

**Task B4:** Test end-to-end
- Admin updates content in Strapi
- Frontend refreshes and shows new content
- Verify on homepage + mobile

### Phase 3: Admin UX Polish (Optional)

**Task C1:** Add UI improvements to Strapi admin
- Better icon picker (visual library)
- Drag-to-reorder social links
- Preview of changes in real-time

---

## Success Criteria

✅ Admin can edit header content via Strapi  
✅ Admin can edit footer content via Strapi  
✅ Admin can add/edit/delete social links  
✅ Social links display on homepage with icons  
✅ Changes visible immediately (no deployment)  
✅ Mobile responsive  

---

## Timeline

**Phase 1 (Strapi setup):** 2-3 hours  
**Phase 2 (Frontend integration):** 3-4 hours  
**Phase 3 (Polish):** 2 hours (optional)  

**Total:** 7-9 hours

---

## Budget Impact

- **Strapi:** Free (self-hosted)
- **Icons:** Emoji (free) or icon library (free)
- **Total cost:** $0 (within existing budget)

---

## Next Steps

1. **Confirm approach:** Option A (Strapi collections) ✓
2. **Start Phase 1:** Create Strapi collections
3. **Test:** Admin can add content
4. **Deploy:** Frontend fetches dynamic data
5. **Launch:** Admin has control
