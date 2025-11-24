# Wattpad Integration Plan for Metafórica

## Great News!
Wattpad content from [@SoyMetaforica](https://www.wattpad.com/user/SoyMetaforica) has **16 published stories** and can be accessed programmatically!

## Wattpad vs Medium vs Spotify

| Platform | API Access | Auto-Sync | Difficulty |
|----------|-----------|-----------|------------|
| Spotify  | ✅ Official API | ✅ Yes | Easy |
| Wattpad  | ✅ Community APIs | ✅ Yes | Easy |
| Medium   | ❌ Blocked | ❌ Manual only | Hard |

## Recommended Solution: Automated Wattpad Sync

Similar to Spotify, we can create an Edge Function that automatically fetches stories from Wattpad.

### Available Tools:
- **wattpad-api** (Python wrapper with caching)
- **wattpad-scraper** (Can export to EPUB/HTML)
- **Unofficial Wattpad API endpoints** (used by mobile apps)

---

## Implementation Plan

### 1. Create Edge Function: `sync-wattpad-stories`

**What it does:**
- Fetches all stories from `@SoyMetaforica`
- Extracts: title, description, cover image, tags, URL, read count
- Upserts into `blog_posts` table (or new `wattpad_stories` table)
- Runs weekly (or on-demand via CMS button)

**Endpoint Example:**
```bash
POST https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories
```

### 2. Database Schema Options

**Option A: Use existing `blog_posts` table**
```sql
-- Add new columns
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS source VARCHAR DEFAULT 'native';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS external_url VARCHAR;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS wattpad_id VARCHAR;
```

**Option B: Create dedicated `wattpad_stories` table** (RECOMMENDED)
```sql
CREATE TABLE wattpad_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wattpad_id VARCHAR UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  story_url TEXT NOT NULL,
  tags TEXT[],
  read_count INTEGER DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  part_count INTEGER DEFAULT 0,
  language VARCHAR DEFAULT 'es',
  is_completed BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP
);
```

### 3. CMS Integration

Add "Wattpad Stories" tab to Admin Panel:
- List all synced stories
- "Sync Now" button (like Spotify)
- Toggle visibility
- View stats (reads, votes, comments)
- "Read on Wattpad" links

### 4. Frontend Display

**Option A: Combined "Escritos" Section**
- Show both blog posts AND Wattpad stories
- Badge to indicate source ("Blog" vs "Wattpad")

**Option B: Separate "Historias" Section**
- Dedicated page for Wattpad stories
- Different styling (more literary/story-focused)
- "Read full story on Wattpad" CTA

---

## Technical Approach

### Using Wattpad's Unofficial API

Wattpad mobile apps use these endpoints (no auth required for public content):

```typescript
// Get user profile and stories
GET https://www.wattpad.com/api/v3/users/{username}

// Get story details
GET https://www.wattpad.com/api/v3/stories/{story_id}

// Get user's published stories
GET https://www.wattpad.com/api/v3/users/{username}/stories/published
```

### Edge Function Pseudo-code

```typescript
import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const WATTPAD_USERNAME = "SoyMetaforica";
const WATTPAD_API_BASE = "https://www.wattpad.com/api/v3";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Fetch stories from Wattpad
    const response = await fetch(
      `${WATTPAD_API_BASE}/users/${WATTPAD_USERNAME}/stories/published?limit=50`
    );
    
    const data = await response.json();
    
    // Map Wattpad data to our schema
    const stories = data.stories.map(story => ({
      wattpad_id: story.id,
      title: story.title,
      description: story.description,
      cover_image_url: story.cover,
      story_url: story.url,
      tags: story.tags,
      read_count: story.readCount,
      vote_count: story.voteCount,
      comment_count: story.commentCount,
      part_count: story.numParts,
      is_completed: story.completed,
      language: story.language?.name || 'es',
      is_visible: true,
      updated_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString()
    }));

    // Upsert to Supabase
    const { error } = await supabase
      .from('wattpad_stories')
      .upsert(stories, { onConflict: 'wattpad_id' });

    if (error) throw error;

    return new Response(
      JSON.stringify({ synced: stories.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
```

---

## Display Components

### Wattpad Story Card
```tsx
<Card className="wattpad-story-card">
  <img src={story.coverImageUrl} alt={story.title} />
  <h3>{story.title}</h3>
  <p>{story.description}</p>
  <div className="stats">
    <span>📖 {story.readCount.toLocaleString()} lecturas</span>
    <span>⭐ {story.voteCount.toLocaleString()} votos</span>
  </div>
  <Button asChild>
    <a href={story.storyUrl} target="_blank">
      Leer en Wattpad
    </a>
  </Button>
</Card>
```

---

## Content Strategy Recommendations

Based on the Wattpad profile, Metaforica has:
- ✅ **16 stories** (great content library!)
- ✅ **Literary/personal narratives** (fits brand perfectly)
- ✅ **Spanish language** (matches target audience)

### Suggested Site Structure:

1. **Homepage**
   - Hero: Podcast
   - Section 2: Latest Blog Post
   - Section 3: Featured Wattpad Story
   - Section 4: Podcast Episodes

2. **/escritos** (Blog Posts)
   - Native blog content
   - Medium imports (if desired)

3. **/historias** (NEW - Wattpad Stories)
   - All 16 Wattpad stories
   - Grid/masonry layout
   - Filter by tags
   - Sort by reads/votes

4. **/podcast** (Already implemented)

---

## Next Steps

1. **Test Wattpad API** to verify data structure
2. **Create `wattpad_stories` table** in Supabase
3. **Build Edge Function** for syncing
4. **Add Wattpad Manager** to CMS (copy Podcast Manager pattern)
5. **Create frontend components** for displaying stories
6. **Add navigation link** for "Historias"

---

## Estimated Timeline

- Database setup: **15 minutes**
- Edge Function: **1 hour**
- CMS integration: **1 hour**
- Frontend components: **2 hours**
- Testing & polish: **30 minutes**

**Total: ~5 hours of work**

---

## Benefits of This Approach

✅ Fully automated (like Spotify)  
✅ No manual imports needed  
✅ Keeps Wattpad as canonical source  
✅ Showcases existing content library  
✅ Drives traffic to Wattpad (good for author metrics)  
✅ SEO benefits (story descriptions/titles indexed)  
✅ Professional portfolio display  

---

Would you like me to start building this? It's much cleaner than Medium integration!


