# Medium Integration Plan for Metafórica

## Problem
Medium blocks automated RSS feed access with Cloudflare, and their official API doesn't support reading published posts.

## Recommended Solutions (in order of preference)

### Option 1: Manual Import Tool (RECOMMENDED)
Create a simple import tool in the CMS that accepts Medium post URLs and extracts content.

**Pros:**
- Works reliably
- You control what gets imported
- No API limitations
- Can cherry-pick best posts

**How it works:**
1. Admin pastes Medium post URL in CMS
2. Edge Function uses a headless browser or parsing service to extract:
   - Title
   - Content (converted to HTML)
   - Publish date
   - Featured image
   - Tags
3. Saves to `blog_posts` table with `source: 'medium'` and `canonical_url`
4. Original stays hosted on Medium

**Implementation:** ~2 hours

---

### Option 2: RSS Feed Proxy Service
Use a third-party service that can bypass Cloudflare and provide clean RSS data.

**Services:**
- **RSS.app** (free tier available)
- **FetchRSS** (free tier available)
- **Feedburner** (Google, free)

**Pros:**
- Automated syncing
- No manual work after setup

**Cons:**
- Depends on third-party service
- May have rate limits
- Service could break

**Implementation:** ~1 hour

---

### Option 3: Bulk JSON Import
Export all posts from Medium as JSON, then upload via CMS.

**Pros:**
- One-time bulk import
- Full control over data

**Cons:**
- Manual process
- No automatic updates for new posts
- Need to repeat for each new post

**How to export from Medium:**
1. Go to Settings → Account → Download your information
2. Medium sends a zip file with all posts as HTML
3. Parse HTML files and import into Supabase

**Implementation:** ~3 hours (parsing tool + upload)

---

## Recommended Implementation: Option 1

### Edge Function: `sync-medium-post`

```typescript
// Accept a Medium URL, fetch and parse content, save to blog_posts
{
  "url": "https://medium.com/@metaforicapodcast/post-slug-123"
}
```

### CMS UI Enhancement
Add a "Import from Medium" section in Blog Manager:
- Input field for Medium URL
- "Import" button
- Shows preview before saving
- Option to edit before publishing

### Database Changes
Add to `blog_posts` table:
- `source` (enum: 'native', 'medium', 'imported')
- `canonical_url` (string, nullable) - link to original Medium post
- `external_link` (string, nullable) - "Read on Medium" CTA

### Display Logic
When `source === 'medium'`:
- Show "Originally published on Medium" badge
- Add "Read on Medium" button linking to `canonical_url`
- Keep content synced in your database for SEO

---

## Next Steps

1. **Decide which option** you prefer
2. **For Option 1 (recommended):**
   - Create Edge Function for URL parsing
   - Add import UI to BlogManager
   - Test with 2-3 posts
3. **Set up canonical URLs** properly for SEO
4. **Add "Originally published on Medium" attribution**

---

## Alternative: Keep Medium Completely Separate

If you want Medium content to stay only on Medium:
- Just link to Medium profile from your site
- Add a "Read on Medium" section with external links
- No content duplication
- Simpler but less SEO benefit

Let me know which direction you want to go!


