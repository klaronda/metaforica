# ⚡ Quick Reference Card - Metaforica Migration

**For when you need answers fast!**

---

## 📋 Files to Copy: 76+

- **Documentation:** 5-8 `.md` files
- **Styles:** `styles/globals.css`
- **Components:** All files in `/components/` folder
- **App:** `App.tsx`

**Fastest way:** Copy entire `/components/` folder and all `.md` files.

---

## 🔧 Essential Commands

### Setup
```bash
npm install @supabase/supabase-js lucide-react sonner@2.0.3 recharts react-hook-form@7.55.0
```

### Create Supabase Client
Create `/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Run Locally
```bash
npm run dev
```

### Deploy
```bash
vercel
```

---

## 🗄️ Database Tables to Create

Run this SQL in Supabase:

```sql
-- 1. Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[],
  category TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  publish_date DATE NOT NULL,
  read_time INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Podcast episodes
CREATE TABLE podcast_episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spotify_id TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  publish_date DATE NOT NULL,
  duration TEXT,
  spotify_url TEXT NOT NULL,
  thumbnail_url TEXT,
  youtube_url TEXT,
  custom_show_notes TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  transcript_url TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  episode_number INTEGER,
  season INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. About page content
CREATE TABLE about_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_type TEXT NOT NULL CHECK (section_type IN ('hero', 'achievements', 'biography', 'values', 'philosophy')),
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_type)
);

-- 4. Email subscribers
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

-- 5. Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
```

---

## 🔐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-secret
SPOTIFY_SHOW_ID=your-show-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 📝 Key Components

### CMS Components
- `BlogManager.tsx` - Main CMS (all tabs)
- `PodcastManager.tsx` - Podcast management
- `EmailTemplateManager.tsx` - Email marketing
- `AboutPageEditor.tsx` - About page editor
- `AnalyticsDashboard.tsx` - Analytics

### Public Components
- `Hero.tsx` - Homepage hero
- `Header.tsx` - Navigation
- `Footer.tsx` - Footer
- `AllBlogPosts.tsx` - Blog listing
- `BlogPost.tsx` - Blog post page
- `AllPodcasts.tsx` - Podcast listing
- `AboutSection.tsx` - About section
- `BooksSection.tsx` - Books section

### Utilities
- `AdminLogin.tsx` - CMS login
- `ContactModal.tsx` - Contact form
- `GoogleAnalytics.tsx` - GA4 tracking

---

## 🎨 Styling Rules

### ✅ DO:
- Use `rounded-organic` for border radius
- Import `globals.css` in main entry
- Use Tailwind for spacing, colors, layout

### ❌ DON'T:
- Don't use `text-*` classes for font size
- Don't use `font-*` classes for font weight
- Don't use `leading-*` classes for line height
- Don't modify `ImageWithFallback.tsx`

**Why?** Typography is handled by `globals.css` tokens.

---

## 🔄 Replace Mock Data Pattern

**Old (Mock):**
```typescript
const [posts, setPosts] = useState([mockData])
```

**New (Supabase):**
```typescript
const [posts, setPosts] = useState([])

useEffect(() => {
  fetchPosts()
}, [])

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('publish_date', { ascending: false })
  
  if (error) {
    console.error(error)
    toast.error('Failed to load posts')
    return
  }
  
  setPosts(data || [])
}
```

---

## 🐛 Common Errors & Fixes

### Error: "Cannot find module './components/ui/button'"
**Fix:** Copy entire `/components/ui/` folder

### Error: "supabase is not defined"
**Fix:** Create `/lib/supabase.ts` and import it

### Error: Styling looks wrong
**Fix:** Import `globals.css` in main entry point

### Error: TypeScript errors everywhere
**Fix:** Install all dependencies, especially `@types/*` packages

### Error: Database permission denied
**Fix:** Check RLS policies in Supabase

---

## ⚡ Quick Component Import Guide

### For Blog Post:
```typescript
import { supabase } from '../lib/supabase'

const { data: post } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('id', postId)
  .single()
```

### For Podcast Episodes:
```typescript
const { data: episodes } = await supabase
  .from('podcast_episodes')
  .select('*')
  .eq('is_visible', true)
  .order('publish_date', { ascending: false })
```

### For About Content:
```typescript
const { data: sections } = await supabase
  .from('about_page_content')
  .select('*')
```

### Save/Update:
```typescript
const { error } = await supabase
  .from('blog_posts')
  .upsert({ id, ...data })

if (error) {
  toast.error('Save failed')
} else {
  toast.success('Saved!')
}
```

---

## 🎯 CMS Features at a Glance

| Tab | Feature | Key Actions |
|-----|---------|-------------|
| Posts | Blog listing | Search, filter, edit, delete |
| Editor | Rich text editor | Format text, add links, save |
| Podcasts | Podcast manager | Sync Spotify, edit episodes |
| About | About editor | Edit all sections |
| Email | Newsletter templates | Create, preview, export |
| Import | Content import | Upload WordPress/Medium files |
| Analytics | GA4 dashboard | View metrics, top content |

---

## 📚 Documentation Cheat Sheet

| Need to... | Read... |
|------------|---------|
| Understand features | REQUIREMENTS.md |
| Get architecture overview | COMPONENT_MANIFEST.md |
| Connect to Supabase | SUPABASE_INTEGRATION_GUIDE.md |
| See file list | COMPLETE_EXPORT_CHECKLIST.md |
| Get quick overview | MIGRATION_SUMMARY.md |
| Quick reference | QUICK_REFERENCE.md (this file) |

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] All components work locally
- [ ] Environment variables set in Vercel
- [ ] Database tables created in Supabase
- [ ] Edge Functions deployed (Spotify sync)
- [ ] RLS policies configured
- [ ] No console errors
- [ ] Tested on mobile
- [ ] SEO meta tags added
- [ ] Analytics tracking works

---

## 🎨 Brand Colors

```css
Primary: #FFC107 (Amber/Yellow)
Accent: #FF9800 (Orange)
Secondary: #FFD54F (Gold)
Text: #1F2937 (Dark Gray)
Background: #FFFFFF (White)
Muted: #F3F4F6 (Light Gray)
```

---

## 🔑 Key Integrations

1. **Supabase** - Database + auth + storage
2. **Spotify** - Podcast auto-sync (Edge Function)
3. **YouTube** - Video embeds (just URLs)
4. **GA4** - Analytics (optional dashboard)
5. **Email** - SendGrid/Resend (optional)

---

## ✅ Testing Checklist

- [ ] Homepage loads
- [ ] Blog listing shows posts
- [ ] Individual blog post displays
- [ ] Podcast listing shows episodes
- [ ] CMS login works
- [ ] Can create blog post
- [ ] Can edit blog post
- [ ] Rich text editor works
- [ ] Search filters posts
- [ ] Email template preview works
- [ ] About page displays
- [ ] Contact form submits

---

## 🎯 First Steps After Migration

1. **Copy files** (76+ files)
2. **Install deps** (`npm install ...`)
3. **Create Supabase project**
4. **Run SQL** (create tables)
5. **Set env vars** (`.env.local`)
6. **Create client** (`/lib/supabase.ts`)
7. **Test locally** (`npm run dev`)
8. **Replace mock data** (follow integration guide)
9. **Deploy** (`vercel`)

---

## 💡 Pro Tips

1. **Use React Query** for cleaner data fetching
2. **Set up real-time subs** for live updates
3. **Use Supabase Storage** for image uploads
4. **Enable backups** in Supabase dashboard
5. **Monitor errors** with Sentry or similar
6. **Cache static assets** with Vercel Edge
7. **Optimize images** (WebP, lazy loading)

---

## 🆘 Emergency Contacts

- **Supabase Status:** https://status.supabase.com
- **Vercel Status:** https://www.vercel-status.com
- **Spotify API:** https://developer.spotify.com/community

---

## 📞 Get Help

1. **Check documentation** (all `.md` files)
2. **Search Supabase docs** (common issues)
3. **Check browser console** (for errors)
4. **Review network tab** (for API errors)
5. **Check environment variables** (often the issue!)

---

**Keep this handy during migration! 📌**

**Last updated:** November 12, 2024  
**Version:** 1.0  
**Status:** ✅ Production Ready
