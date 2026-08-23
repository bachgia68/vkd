# 🔥 sam-daily-buzz — Daily Competitive Intelligence & Trend-to-Post Automation

**Purpose:** Crawl competitor sites + Facebook + Google Trends → Identify trending topics → Auto-generate blog post + social captions → Ready for approval & publish  
**Trigger:** Daily at 8:00 AM GMT+7 (via Routine) or manual: `@sam-daily-buzz "keywords"`  
**Output:** 
- 📄 Blog post (500-800 words, SEO)
- 🎥 3 social captions (TikTok/Reels/Facebook)
- 📊 Competitive brief (what rivals are doing)
- ✅ Approval link (1-click review → publish)

---

## How It Works

### Daily Workflow

```
8:00 AM Trigger
    ↓
CRAWL SOURCES (Stage 1)
    ├─ Competitor websites (trimico.vn, K5, Vingin...)
    ├─ Facebook: Competitor pages + customer comments
    ├─ Google Trends: "Sâm Ngọc Linh", "Dược liệu", "Chức năng thực phẩm"
    └─ Reddit/Forums: What people are asking
    ↓
IDENTIFY TRENDS (Stage 2)
    ├─ Price changes (competitor raising/dropping?)
    ├─ New products launched
    ├─ Customer pain points (quality, delivery, guarantee)
    ├─ Seasonal keywords (summer wellness, winter immunity, etc)
    └─ Viral posts (what's getting shares/comments?)
    ↓
GENERATE CONTENT (Stage 3)
    ├─ Write blog post (position TA as solution to trend)
    ├─ Create TikTok hook (60s script)
    ├─ Create Reels caption (engaging, with CTA)
    ├─ Create Facebook post (longer form, community-focused)
    └─ Extract competitive insights (what we should do differently)
    ↓
APPROVAL QUEUE (Stage 4)
    ├─ Email: "TA Daily Buzz ready for review"
    ├─ Link: https://claude.ai/...
    ├─ 3 options: [✅ Publish All] [📝 Edit] [❌ Skip]
    └─ User approval → Auto-publish to CMS + social
```

---

## Stage 1: Crawl Sources

### 1a. Competitor Websites

**Targets:**
```
✓ trimico.vn (Trương Nhân) — Premium ginseng positioning
✓ K5 brand — Mid-market, educational content
✓ Vingin — Mass market leader
✓ Onploka / Hoàng Gia — E-commerce player
✓ Tu Mơ Rông KT — Direct from cultivation
```

**What to Extract:**
- Product listings + prices
- Blog posts (titles, publish date, engagement estimate)
- Customer reviews (ratings, sentiment, main complaints)
- Promotion campaigns (flash sales, bundle offers)
- Educational content (why their sâm is better)

**Tools:**
- `web_search` + `web_fetch` (crawl public pages)
- Parse blog post titles → trending topics
- Extract price changes (week-over-week comparison)

### 1b. Facebook Competitive Analysis

**Crawl:**
- Top 5-10 recent posts from competitor Fanpages
- Comment sentiment: positive (loyalty) vs negative (complaints)
- Engagement rate: shares, reactions, comments per post
- Hashtags: what's trending in sâm/dược liệu community

**Key Metrics:**
- Post format that gets most engagement (video vs carousel vs text)
- Optimal posting time (when audience is most active)
- Customer pain points (recurring complaints)

### 1c. Google Trends + Search Intent

**Keywords to Monitor:**
```
Daily:
- "Sâm Ngọc Linh" (brand search)
- "Sâm Ngọc Linh giá bao nhiêu" (price search)
- "Sâm Ngọc Linh chứng thực" (quality search)
- "Mua sâm Ngọc Linh ở đâu" (purchase intent)
- "Sâm Ngọc Linh tác dụng" (educational)

Weekly:
- "Dương sinh" (seasonal)
- "Tăng cường miễn dịch" (seasonal)
- "Dược liệu" (general category)
```

**Output:**
- Search volume trends (is this keyword going UP or DOWN?)
- Seasonal patterns (e.g., spike in Nov-Dec for wellness gifts)
- Related searches (what else do searchers ask?)

---

## Stage 2: Identify Trending Topics

### Scoring Algorithm

For each trend detected, score it:

```
TREND SCORE = (Search Volume ↑) + (Competitor Activity) + (Customer Sentiment) + (Seasonality Match)

Example:
- "Sâm Ngọc Linh chứng thực" ⬆️ +3 (search vol up 15%)
- Competitor "trimico" just published blog on QR codes ⬆️ +2
- Facebook comments asking about authenticity ⬆️ +2
- Summer wellness season ⬆️ +1
─────────────────────────
TREND SCORE = 8/10 → HIGH PRIORITY
```

### Trend Themes (Template Categories)

| Theme | Example Topics | Why It Matters |
|-------|-------------------|----------------|
| **Quality** | "Sâm thật vs giả", "QR code traceability", "GACP certification" | TA's 200% guarantee = competitive advantage |
| **Price** | "Sâm rẻ", "Flash sale", "Bundle offers" | Monitor competitor discounts; position TA value, not price |
| **Education** | "MR2 Majonoside-R2", "Sâm tác dụng gì?", "Cách dùng sâm" | TA has science backing; create educational content |
| **Seasonal** | "Quà tặng", "Tăng năng lượng mùa đông", "Wellness ritual" | Different angles by season |
| **Community** | Customer testimonials, "Sâm Ngọc Linh vs Sâm Hàn Quốc", reviews | UGC-style content (authentic voices) |

---

## Stage 3: Generate Content

### 3a. Blog Post Template (500-800 words)

**Structure:**
```
[Hook]: Start with the TREND
        "X% more people are searching for [keyword] this week"

[Problem]: Why this trend matters to readers
        "People want to know..."

[Solution]: How TA addresses this trend
        "TA's [feature] solves this because..."

[Proof]: Competitive comparison
        "Unlike [competitor], TA does [X] better because..."

[CTA]: Shop now + social share + email signup
```

**Example Hook (Auto-Generated):**
```
📊 TREND DETECTED: "Sâm Ngọc Linh chứng thực" ⬆️ 18% search volume this week

This week, Google searches for authentic ginseng jumped 18%. Why? People are 
tired of buying counterfeits. TA just published 3 customer stories proving 
QR traceability works — here's what they discovered...
```

### 3b. Social Media Captions (Auto-Generated)

**TikTok (60 chars, hook-first):**
```
"Sâm giả ở đâu? Chỉ cần quét QR code — TA bảo hành 200% 📱"
```

**Instagram Reels (150 chars, community):**
```
"Hôm nay 18% người tìm 'sâm chứng thực'. Đó là lý do TA có QR mã. 
Quét 1 lần = biết nguồn gốc. Kết quả? Zero counterfeits. Tin không? 
Quét cái này 👆"
```

**Facebook (250 chars, storytelling):**
```
"Câu chuyện hôm nay: Chị Linh từ Hà Nội mua sâm online 5 lần rồi mà sợ bị giả. 
Hôm qua cô quét QR code sâm TA → Liền thấy tất cả chi tiết từ vùng trồng tới 
ngày thu hoạch. 'Lần đầu tiên tôi thật 100% yên tâm' — chị nói vậy.

Bạn muốn lần đầu tiên có thể tin tưởng? 👇"
```

### 3c. Competitive Brief (What We Should Do)

**Auto-Generated Summary:**
```
COMPETITOR WATCH — August 2, 2026

🔴 TRIMICO (trimico.vn):
   - Just launched "Premium authentication" blog series
   - Positioning on heritage + scientist testimonials  
   - Engagement: High (1.5k avg comments per post)
   → ACTION FOR TA: Double down on MR2 science content (they're weak here)

🟡 K5 BRAND:
   - Launching "Summer immunity" campaign (seasonal)
   - Emphasizing price ($15-20/oz range)
   → ACTION FOR TA: Position on value (quality per $), not lowest price

🟢 VINGIN:
   - Low digital presence, focus on retail partnerships
   → OPPORTUNITY: Outrank them on search for "online + authentic"
```

---

## Stage 4: Approval & Auto-Publish

### Approval Email

```
Subject: 🔥 sam-daily-buzz Ready for Review — Aug 2, 8:15 AM

Hi Joe,

Your daily ginseng content is ready:

📰 BLOG POST (Ready to publish)
   Title: "Sâm Ngọc Linh Chứng Thực: Hôm Nay 18% Người Tìm — Đây Là Lý Do"
   Length: 650 words, SEO optimized
   Preview: https://claude.ai/... [edit link]

📱 SOCIAL POSTS (3 formats)
   ✓ TikTok: "Sâm giả ở đâu? Chỉ cần quét QR code..."
   ✓ Reels: "Hôm nay 18% người tìm 'sâm chứng thực'..."
   ✓ Facebook: "Câu chuyện hôm nay: Chị Linh từ Hà Nội..."
   Preview: https://claude.ai/... [review link]

📊 COMPETITIVE BRIEF
   - Trimico: Double down on science content
   - K5: Position on value, not price
   - Vingin: Opportunity on search ranking
   Preview: https://claude.ai/... [full report]

QUICK ACTIONS:
   [✅ PUBLISH ALL]  → Blog + 3 socials go live in 5 min
   [📝 EDIT]         → Review & make changes before publishing
   [❌ SKIP TODAY]   → Save for manual review later

TIMER: Auto-delete this approval in 2 hours (you can extend)

Questions? Reply to this email.
```

### One-Click Publish

**If you click [✅ PUBLISH ALL]:**

1. **Blog Post** → Auto-upload to CMS (status: "published")
2. **TikTok** → Queued for 12:00 PM (peak time) or manual
3. **Instagram Reels** → Queued for 13:00 PM
4. **Facebook** → Posted immediately (max engagement for Fanpage)
5. **Confirmation** → Email with live URLs + metrics tracker

---

## Configuration & Customization

### Competitor Sites to Monitor

Edit this list in Routine settings:

```json
{
  "competitors": [
    {
      "name": "trimico",
      "website": "trimico.vn",
      "facebook": "trimico.official",
      "weight": 0.4  // 40% of trend score
    },
    {
      "name": "K5",
      "website": "k5brand.vn",
      "facebook": "k5ginseng",
      "weight": 0.3
    },
    {
      "name": "Vingin",
      "website": "vingin.vn",
      "facebook": "vingin.official",
      "weight": 0.2
    }
  ],
  "keywords_to_monitor": [
    "Sâm Ngọc Linh",
    "Sâm chứng thực",
    "Dương sinh",
    "Tăng cường miễn dịch"
  ],
  "publish_time": "08:00 GMT+7",
  "approval_timeout_minutes": 120
}
```

### Content Tone

**Default (for TA):**
- Authority (backed by science + QR proof)
- Accessibility (explain MR2 in simple terms)
- Trust (customer testimonials + 200% guarantee)
- Trend-aware (reference what people are searching)

### Publishing Schedule

**Automatic Times:**
- Blog post: Publish immediately after approval
- TikTok: Queue for 12:00 PM (lunch peak)
- Reels: Queue for 13:00 PM (afternoon scroll)
- Facebook: Post immediately (community active all day)

---

## Metrics to Track (Post-Publish)

After content goes live, `sam-daily-buzz` logs:

| Metric | Platform | Target | Review |
|--------|----------|--------|--------|
| **Views (24h)** | TikTok | 5K-10K | Daily |
| **Engagement Rate** | TikTok | 8-12% | Daily |
| **Click-through to Shop** | All | +3% vs baseline | Daily |
| **Blog Page Views** | CMS | 500+ | Weekly |
| **Social Shares** | Facebook | 50+ | Weekly |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Competitor site blocked/changed** | Fallback to web_search + manual Facebook check |
| **No trends detected** | Use fallback evergreen topics (MR2 science, seasonal wellness) |
| **Approval timeout (2 hrs)** | Email Claude to extend → can extend in 30-min increments |
| **Already published same topic** | Duplicate detection → skip or suggest angle twist |
| **Social post character limit** | Auto-truncate + add ellipsis + link to blog |

---

## Example: Full Day Flow (Aug 2, 2026)

```
08:00 AM
   └─ Routine triggers sam-daily-buzz
   └─ Stage 1: Crawl trimico, K5, Vingin, Facebook, Google Trends
   └─ Find: "Sâm chứng thực" ⬆️ 18%, competitor blog published, 5 customer Q's

08:05 AM
   └─ Stage 2: Score trend = 8/10 (HIGH)
   └─ Categorize: Quality + Authenticity angle

08:10 AM
   └─ Stage 3: Auto-generate blog + 3 captions
   └─ Output ready in Claude editor (editable)

08:15 AM
   └─ Email to Joe: "Ready for review — 3 options"
   └─ Joe clicks [✅ PUBLISH ALL]

08:20 AM
   └─ Blog post live on CMS (featured image auto-added)
   └─ TikTok queued for 12:00 PM
   └─ Facebook posted immediately
   └─ Reels queued for 13:00 PM

08:21 AM
   └─ Confirmation email: "Content live! 👍"
   └─ Metrics dashboard updated

12:00 PM
   └─ TikTok post goes live
   └─ Real-time view counter starts

13:00 PM
   └─ Reels post goes live

18:00 PM
   └─ Daily summary email: Views, engagement, shop clicks

---

## Next Steps

1. **Configure Competitor List** — Which sites to crawl daily?
2. **Set Approval Workflow** — Email? In-app push? Slack? 
3. **Connect Social APIs** — TikTok, Facebook, Instagram credentials
4. **Connect CMS API** — Endpoint + auth token for auto-publish
5. **Test Run** — Dry run (no publish) to verify content quality

---

## Reusability

This skill works for ANY product category:
- Cà Phê, Dược liệu, Thực phẩm chức năng, Craft products...

Just swap:
```
competitors: [your_rivals]
keywords: [your_category_keywords]
cta_link: [your_shop_url]
tone: [your_brand_voice]
```

Then run `@sam-daily-buzz` daily.

---

## Files Included

```
/mnt/skills/user/sam-daily-buzz/
├── SKILL.md (this file)
├── references/
│   ├── competitor_config.json (websites + FB pages to crawl)
│   ├── trend_score_algorithm.md (how trends are ranked)
│   ├── content_templates.md (blog + social post templates)
│   └── approval_workflow.md (email + 1-click publish flow)
└── tools/
    └── crawl_competitors.py (CLI tool to test crawl)
```
