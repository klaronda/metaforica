# 📊 Analytics Setup Guide for Metafórica

## Overview
Your website now has a complete analytics system that can track anonymous user behavior, gather insights, and help you improve your website. This guide will help you set up and use the analytics features.

---

## 🚀 Quick Start: Google Analytics 4 (Recommended)

### Step 1: Create a Google Analytics Account (FREE)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or "Admin" (gear icon)
3. Create an account:
   - Account name: "Metaforica"
   - Choose your data sharing settings
4. Create a property:
   - Property name: "Metaforica Website"
   - Time zone: Your timezone
   - Currency: Your currency
5. Fill in business details (blog, small business, etc.)
6. Create a **Web** data stream:
   - Website URL: Your Squarespace URL
   - Stream name: "Main Website"

### Step 2: Get Your Measurement ID

After creating the data stream, you'll see a **Measurement ID** that looks like:
```
G-XXXXXXXXXX
```

Copy this ID!

### Step 3: Add It to Your Website

Open `/App.tsx` and find this line (around line 140):
```tsx
<GoogleAnalytics measurementId="G-XXXXXXXXXX" />
```

Replace `"G-XXXXXXXXXX"` with your actual Measurement ID:
```tsx
<GoogleAnalytics measurementId="G-ABC123XYZ" />
```

### Step 4: Verify It's Working

1. Deploy your website
2. Visit your website in a browser
3. Go back to Google Analytics
4. Click "Realtime" in the left sidebar
5. You should see yourself as an active user!

**Note:** It takes 24-48 hours for historical data to start showing up.

---

## 📈 What Gets Tracked (Privacy-Friendly)

Your analytics system tracks:

✅ **Anonymous Data:**
- Page views (which pages people visit)
- Time on page (how long they stay)
- Bounce rate (if they leave immediately)
- Device type (mobile, desktop, tablet)
- Location (country/city level only)
- Traffic sources (where visitors come from)
- Search queries on your site
- Click events (buttons, links)

❌ **NOT Tracked:**
- Names, emails, or personal info
- Exact IP addresses (anonymized automatically)
- Private/sensitive data
- Login credentials

---

## 🎯 Custom Event Tracking

Your website automatically tracks these custom events:

### Blog Post Views
```tsx
import { analytics } from './components/GoogleAnalytics';

analytics.trackBlogView('Article Title', 'Writing Tips');
```

### Podcast Episode Plays
```tsx
analytics.trackPodcastPlay('Episode Title', 103);
```

### Book Clicks
```tsx
analytics.trackBookClick('Book Title', 'view'); // or 'purchase'
```

### Newsletter Signups
```tsx
analytics.trackNewsletterSignup(['blog', 'podcast']);
```

### Contact Form
```tsx
analytics.trackContactSubmit();
```

### Search
```tsx
analytics.trackSearch('metáforas', 5); // query, results count
```

---

## 📊 Viewing Your Analytics Dashboard

### In Your CMS:
1. Triple-click the settings icon (bottom left)
2. Enter your admin password
3. Click the "Analytics" tab
4. View real-time and historical data

### In Google Analytics:
1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your Metaforica property
3. Explore these reports:
   - **Realtime**: See who's on your site RIGHT NOW
   - **Reports > Life cycle > Acquisition**: Where visitors come from
   - **Reports > Life cycle > Engagement**: What content they engage with
   - **Reports > User > Demographics**: Age, gender, interests
   - **Reports > User > Tech**: Devices, browsers, screen sizes

---

## 🤖 Automated Insights

Your Analytics Dashboard automatically provides:

### Traffic Insights
- Visitor growth/decline trends
- Peak traffic times
- Most popular pages

### Content Performance
- Top performing blog posts
- Most listened podcast episodes
- Best converting calls-to-action

### Audience Insights
- Geographic distribution
- Device preferences
- Returning vs new visitors

### Recommendations
The system generates automated suggestions like:
- "Your blog posts have great engagement - publish more!"
- "58% mobile traffic - optimize mobile experience"
- "Podcast page is popular - feature it more prominently"

---

## 🔄 Alternative: Privacy-Focused Analytics

If you prefer a more privacy-focused alternative to Google Analytics:

### Plausible Analytics (Paid, but Simple & Private)

1. Go to [plausible.io](https://plausible.io)
2. Create an account ($9/month)
3. Add your website
4. Get your tracking script
5. Add to your site (simpler than GA4)

**Benefits:**
- ✅ Cookie-free (no annoying cookie banners!)
- ✅ GDPR compliant by default
- ✅ Simple, beautiful interface
- ✅ Lightweight (loads faster)
- ❌ Costs money ($9-$19/mo)

---

## 🛠️ Advanced: Connect to Supabase for Custom Analytics

For complete control, you can build your own analytics:

### Why Use Supabase?
- Store custom events
- Build custom reports
- Track user journeys
- Export data easily
- Free tier available

### How to Set It Up:
1. Create a free [Supabase](https://supabase.com) account
2. Create a new project
3. Create a table for events:
```sql
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```
4. Use Supabase client to log events
5. Query data for custom dashboards

---

## 📱 Tracking on Squarespace

Since you're hosting on Squarespace:

### Method 1: Direct GA4 Integration (Easiest)
1. In Squarespace: Settings > Advanced > Code Injection
2. Paste in **Header**:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
Replace `G-XXXXXXXXXX` with your Measurement ID

### Method 2: Use Built-in Squarespace Analytics
Squarespace provides basic analytics:
- Settings > Analytics
- View visits, popular pages, traffic sources
- Limited compared to GA4 but easier

---

## 🎯 Best Practices

### 1. Check Analytics Weekly
- Review top pages
- Check traffic sources
- Look for trends

### 2. Set Goals
- Track newsletter signups
- Monitor podcast clicks
- Measure book page visits

### 3. A/B Test Changes
- Change headlines, watch engagement
- Try different CTAs, compare clicks
- Adjust based on data

### 4. Respect Privacy
- Be transparent about tracking
- Provide opt-out options
- Don't collect sensitive data

### 5. Act on Insights
- Popular blog topics → Write more
- High bounce rate → Improve content
- Mobile traffic → Optimize mobile

---

## 🆘 Troubleshooting

### "No data showing up"
- Wait 24-48 hours after setup
- Check Measurement ID is correct
- Verify script is loaded (check browser console)
- Test in Realtime view (should be instant)

### "Realtime works but no historical data"
- Normal! GA4 needs time to aggregate
- Check back tomorrow

### "Getting too many bot visits"
- In GA4: Admin > Data Streams > Configure tag settings
- Enable "Exclude all hits from known bots and spiders"

### "Want more detailed tracking"
- Use Google Tag Manager for advanced tracking
- Hire an analytics consultant
- Or keep it simple - basic tracking is often enough!

---

## 📧 Questions?

The current setup in your CMS shows **demo data** until you connect Google Analytics. Once connected, you'll see:

- ✅ Real visitor counts
- ✅ Actual page views
- ✅ True engagement metrics
- ✅ Live traffic sources

---

## 🎉 You're All Set!

Your website now has:
1. ✅ Google Analytics 4 ready to connect
2. ✅ Privacy-friendly anonymous tracking
3. ✅ Beautiful analytics dashboard in CMS
4. ✅ Custom event tracking for blogs/podcasts
5. ✅ Automated insights and recommendations

**Next Steps:**
1. Create your GA4 account (15 minutes)
2. Add Measurement ID to App.tsx
3. Deploy and verify tracking works
4. Check back tomorrow for data
5. Use insights to improve your content!

---

*Last updated: November 2024*
*For support, check Google Analytics Help Center or Squarespace Support*
