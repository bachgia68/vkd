# 🚀 sam-daily-buzz QUICK START GUIDE

## You Now Have 2 Skills + 1 Routine

```
1. festival-content-automation (Already saved ✅)
   └─ Use for: Events, festivals, product launches
   └─ Call: @festival-content-automation "event details"
   └─ Output: Blog + 3 videos (TikTok/Reels/CMS)

2. sam-daily-buzz ⭐ (NEW — Just created)
   └─ Use for: Daily competitive intel + trend content
   └─ Trigger: Automatic 8 AM daily (via Routine)
   └─ Or manual: @sam-daily-buzz "keywords"
   └─ Output: Blog + 3 social posts + approval email

3. Routine: "🔥 SAM DAILY BUZZ" (Configured, Ready to Activate)
   └─ Runs: Mon-Fri at 8:00 AM GMT+7
   └─ Action: Auto-crawl → Generate content → Email approval
   └─ Approval: You review → Click [✅ PUBLISH ALL] → Live in 5 min
```

---

## ACTIVATION CHECKLIST

### ✅ Before Going Live

**Step 1: API Keys (4 minutes)**
```bash
# Add these to your .env file:

CMS_API_TOKEN=your_cms_auth_token_here
TIKTOK_BUSINESS_TOKEN=your_tiktok_api_key_here
META_ACCESS_TOKEN=your_meta_graph_api_token_here
GOOGLE_TRENDS_API_KEY=your_gtrendsapi_key_here (optional)
```

**Where to get each:**
- CMS_API_TOKEN: Admin panel → Settings → API Keys
- TIKTOK_BUSINESS_TOKEN: TikTok For Business → API access
- META_ACCESS_TOKEN: Facebook Developers → Tokens

**Step 2: Email Configuration (2 minutes)**
```json
{
  "approval_email": "joe@yourcompany.com",
  "daily_summary_email": "joe@yourcompany.com",
  "slack_channel": "#marketing-automation" (optional)
}
```

**Step 3: Verify Competitor List (3 minutes)**

Current config monitors:
```
✓ trimico.vn (Trương Nhân)
✓ k5brand.vn (K5)
✓ vingin.vn (Vingin)
```

**Want to add more?** Edit `/mnt/skills/user/sam-daily-buzz/references/routine_daily_config.json`:
```json
"sites_to_crawl": [
  {
    "name": "new_competitor",
    "website": "theirsite.vn",
    "facebook": "their_fanpage",
    "weight": 0.2
  }
]
```

**Step 4: Test Run (5 minutes)**

```bash
# Run DRY RUN (no publish, just generate content)
@sam-daily-buzz --dry-run "test"

# Output: Blog post + social captions appear in editor
# Check: Do they look good?
# If yes → proceed to Step 5
```

**Step 5: Activate Routine (1 click)**

In Claude Code → Routines:
1. Find: "🔥 SAM DAILY BUZZ"
2. Toggle: ON
3. Status: Active ✅
4. First run: Tomorrow 8:00 AM GMT+7

---

## HOW DAILY APPROVAL WORKS

### Morning (8:00 AM - 10:00 AM)

```
8:00 AM
└─ Routine triggers automatically
└─ Crawls trimico, K5, Vingin + Google Trends
└─ Generates blog + 3 social posts
└─ Sends approval email to you

8:15 AM (You wake up)
└─ Email arrives: "🔥 sam-daily-buzz Ready for Review"
└─ 3 options visible:
   [✅ PUBLISH ALL]   → Everything goes live immediately
   [📝 EDIT]          → Review & make changes before publishing
   [❌ SKIP TODAY]    → Save for manual review later

8:20 AM (You click one button)
└─ If [✅ PUBLISH ALL]:
   - Blog post → CMS (live now)
   - TikTok → Queued for 12:00 PM
   - Reels → Queued for 13:00 PM
   - Facebook → Posted immediately
   
└─ If [📝 EDIT]:
   - Open Claude editor
   - Make changes (edit title, captions, etc)
   - Click "Republish for approval"
   - Decision: Approve again or save
   
└─ If [❌ SKIP TODAY]:
   - Content saved in draft folder
   - No publication
   - You can publish manually later

TIMER: Approval expires in 2 hours (you can extend 30min at a time)
```

---

## EXAMPLE: FIRST DAY WALKTHROUGH

### Friday, August 2, 8:15 AM (Your First Approval)

**Email arrives:**

```
Subject: 🔥 sam-daily-buzz Ready for Review — August 2, 8:15 AM

Hi Joe,

Your daily ginseng content is ready:

📰 BLOG POST (650 words)
   "Sâm Ngọc Linh Chứng Thực: Hôm Nay 18% Người Tìm — Đây Là Lý Do"
   
   Hook: This week, Google searches for authentic ginseng jumped 18%.
   Why? People are tired of buying fakes.
   Solution: TA's QR traceability does [this]...
   
   Preview: https://claude.ai/... [view full]

📱 SOCIAL POSTS
   
   TikTok (8.5M creators watching):
   "Sâm giả ở đâu? Chỉ cần quét QR code — TA bảo hành 200% 📱"
   
   Reels (Instagram targeting 25-45 doanh nhân):
   "Hôm nay 18% người tìm 'sâm chứng thực'...
   Đó là lý do TA có QR mã. Quét 1 lần = biết nguồn gốc."
   
   Facebook (Fanpage community):
   "Câu chuyện hôm nay: Chị Linh từ Hà Nội mua sâm online 5 lần...
   Lần đầu tiên cô thật 100% yên tâm. Bạn muốn lần đầu tiên?"
   
   Preview: https://claude.ai/... [view all 3]

📊 COMPETITIVE BRIEF (What Your Rivals Are Doing)
   
   🔴 TRIMICO just published "Premium Authentication" blog
      → Action: You double down on MR2 science (they're weak here)
   
   🟡 K5 launching "Summer immunity" campaign
      → Action: Position TA on value, not lowest price
   
   🟢 VINGIN has low digital presence
      → Opportunity: Outrank them on search rankings
   
   Preview: https://claude.ai/... [full report]

────────────────────────────────────────────────────────────
YOUR DECISION (2 HOURS TO CHOOSE):

   [✅ PUBLISH ALL]
   └─ Blog live now on CMS
   └─ TikTok goes live 12:00 PM (peak time)
   └─ Reels goes live 13:00 PM
   └─ Facebook posted immediately
   └─ Confirmation email with metrics dashboard

   [📝 EDIT FIRST]
   └─ Review each piece in Claude editor
   └─ Rewrite titles/captions as needed
   └─ Resubmit for approval
   
   [❌ SKIP TODAY]
   └─ Content saved as draft
   └─ No publication
   └─ Publish manually anytime later

TIMER: Auto-expires in 2 hours (can extend)
```

---

### What You Do

**Option 1: Trust the System (RECOMMENDED FOR FIRST DAY)**

```
Click [✅ PUBLISH ALL]
    ↓
Wait 5 seconds
    ↓
Confirmation email arrives: "Content live! 👍"
    ↓
Dashboard shows:
    - Blog: live at https://yoursite.com/blog/sam-thuc-chat...
    - TikTok: queued, goes live 12 PM (3h 45m from now)
    - Reels: queued, goes live 1 PM
    - Facebook: live now (5 shares already)
    ↓
18:00 PM: Daily summary email arrives
    - Blog: 234 views in first 10 hours
    - TikTok: 1.2K views (will grow overnight)
    - Reels: 450 views (will grow)
    - Facebook: 23 shares, 150 reactions
    - Click-throughs: +8 shop visits
```

**Option 2: Perfectionist (EDIT FIRST)**

```
Click [📝 EDIT FIRST]
    ↓
Claude editor opens
    ↓
Read blog post preview
    ↓
"Hmm, I want to change this headline..."
    ↓
Edit: "Sâm Ngọc Linh Chứng Thực" → "Sâm Thật vs Giả: 18% Người Tìm"
    ↓
Review TikTok caption
    ↓
"Perfect, keep this one as-is"
    ↓
Review Reels caption
    ↓
"Add more personality: 'Bạn sợ mua sâm giả phải không?'"
    ↓
Click "Republish"
    ↓
Back to approval email with edited versions
    ↓
Click [✅ PUBLISH ALL]
    ↓
Done!
```

**Option 3: Wait (SKIP TODAY)**

```
Click [❌ SKIP TODAY]
    ↓
Content saved as draft
    ↓
Later in the day you review manually
    ↓
If good: Publish manually
    ↓
If bad: Discard, wait for tomorrow's content
```

---

## WHAT HAPPENS AFTER YOU APPROVE

### Timeline

```
8:20 AM: You click [✅ PUBLISH ALL]
    ↓
8:21 AM: Blog post uploaded to CMS (status: published)
    ↓
8:22 AM: TikTok video queued for 12:00 PM
    ↓
8:22 AM: Reels video queued for 13:00 PM
    ↓
8:22 AM: Facebook post published (immediate)
    ↓
8:23 AM: Confirmation email arrives with live links
    
12:00 PM: TikTok goes live
    ├─ Real-time view counter starts
    └─ Comments start rolling in (auto-respond with Zalo link?)
    
13:00 PM: Reels goes live
    ├─ Shares spike (visual content)
    └─ YouTube shorts auto-upload (if enabled)
    
18:00 PM: Daily summary email
    ├─ "Your content did well today!"
    ├─ Blog: 234 views
    ├─ Social: 1.8K total views
    ├─ Shop clicks: +8 visits
    └─ Recommendation: Tomorrow's content should focus on "X" (trending better)
```

---

## METRICS TO WATCH

After approval, sam-daily-buzz tracks:

### Real-Time (Updated hourly)

| Metric | Platform | Goal | Status |
|--------|----------|------|--------|
| **Views (24h)** | TikTok | 5K | On track ✅ |
| **Engagement** | TikTok | 8% | 9.2% ✅✅ |
| **Blog reads** | CMS | 500 | 234 (halfway) |
| **Click-to-shop** | All | +5% baseline | +12% 🎉 |

### Daily (18:00 PM email)

- What content performed best
- Competitor activity that day (did they post? what?)
- Suggested topics for tomorrow

### Weekly (Friday summary)

- Total reach + engagement
- Revenue attributed to content (if integrated)
- Competitor competitive moves this week
- Recommendations for next week's strategy

---

## TROUBLESHOOTING

### "Approval email didn't arrive"

```
1. Check spam folder
2. Verify email in config: /mnt/skills/user/sam-daily-buzz/references/routine_daily_config.json
3. Check if Routine is actually active (toggle ON in Claude Code → Routines)
4. Check error logs: tail -f /var/log/sam-daily-buzz.log
```

### "I want to edit the post AFTER it's published"

```
1. Go to CMS admin panel
2. Find the blog post
3. Edit directly (markdown editor)
4. Click "Update"
5. Changes live immediately

Same for social posts (edit via TikTok Studio, Instagram Business, etc)
```

### "Competitor site structure changed, crawl is failing"

```
Fallback automatically kicks in:
1. Web search for keyword instead
2. Manual Facebook scan
3. Use last-known data + human review

Check: https://claude.ai/... [crawl debug report]
Possible fix: Update competitor site structure in config
```

### "I want to skip tomorrow's content"

```
1. Before 8 AM: Toggle Routine OFF (pauses all future runs)
2. After 8 AM: [❌ SKIP TODAY] button in approval email
3. To re-enable: Toggle Routine back ON

Or: Use --schedule flag to set custom days:
@sam-daily-buzz --schedule "MON,WED,FRI" (skip Tue/Thu)
```

---

## WHAT'S NEXT (After 1 Week)

### Monitor & Optimize

After 5-7 days of daily content:

1. **Review Performance**
   ```
   Which topics got most engagement?
   - Competitor intel posts: 12% engagement
   - Price comparison posts: 8%
   - Educational posts: 15% ⭐ (WINNER)
   
   → Action: Increase educational content mix tomorrow
   ```

2. **Refine Keyword List**
   ```
   Add keywords that are trending NOW:
   - "Sâm Ngọc Linh Đà Nẵng 2026" (due to festival)
   - "Dương sinh hè" (seasonal)
   - Remove keywords with 0 search vol
   ```

3. **Adjust Competitor List**
   ```
   - Vingin showing 0 activity → Keep monitoring
   - New competitor emerging? → Add to watch list
   - Trimico's blog declining? → Lower weight
   ```

4. **A/B Test Posting Times**
   ```
   Try different times:
   - TikTok 12:00 PM vs 14:00 PM (which gets more views?)
   - Reels 13:00 PM vs 15:00 PM
   - Use data to optimize schedule
   ```

5. **Connect Revenue Tracking** (Optional)
   ```
   If you want to track: "How much revenue did this content drive?"
   → Integrate UTM links in CTA
   → Track shop clicks → purchases
   → Calculate ROI per post
   ```

---

## SUPPORT

**Questions?**
- Docs: `/mnt/skills/user/sam-daily-buzz/SKILL.md`
- Config: `/mnt/skills/user/sam-daily-buzz/references/routine_daily_config.json`
- Templates: `/mnt/skills/user/sam-daily-buzz/references/*_template.md`

**Issues?**
- Check troubleshooting section above
- Review error logs: `@sam-daily-buzz --debug`
- Contact: Claude (this chat)

---

## REMINDER: You Have 2 Skills Now

| Skill | When to Use | How to Call |
|-------|------------|------------|
| **festival-content-automation** | Special events, festivals, launches | `@festival-content-automation "event name"` |
| **sam-daily-buzz** | Every day, competitive intel | Auto-runs 8 AM, or `@sam-daily-buzz "keywords"` |

Both are **reusable for ANY product category** — just update the keywords/competitors/brand voice!

---

## READY? 

✅ **Activation Steps:**
1. Add API keys to .env (4 min)
2. Verify emails in config (2 min)
3. Run dry test (5 min)
4. Toggle Routine ON (1 click)
5. Wait for first approval tomorrow 8 AM
6. Click [✅ PUBLISH ALL]
7. Watch your content go live 🚀

**You're all set!**
