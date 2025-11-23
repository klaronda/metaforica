# Metaforica - Component Manifest & Migration Checklist

## 📋 Complete File Structure for Migration

### ✅ Main Application Files

```
/App.tsx                              # Main entry point (needs to be created/updated)
/styles/globals.css                   # Global styles, typography tokens, CSS variables
```

### ✅ Core CMS Components (`/components/`)

```
/components/BlogManager.tsx           # Main CMS dashboard with all tabs
/components/PodcastManager.tsx        # Podcast episode management & Spotify sync
/components/EmailTemplateManager.tsx  # Email marketing template editor
/components/EmailTemplate.tsx         # Email template renderer (for preview & export)
/components/AboutPageEditor.tsx       # About page content editor
/components/AnalyticsDashboard.tsx    # Google Analytics 4 dashboard
```

**Key Features Per Component:**

#### BlogManager.tsx
- Blog post listing with search
- Rich text editor with formatting toolbar
- WordPress/Medium import functionality
- SEO settings
- Category & tag management
- Draft/Published status
- Backdate support
- Tab navigation for all CMS sections

#### PodcastManager.tsx
- Spotify sync controls (manual & auto)
- Episode listing with search & filters
- Featured/Visible toggles
- YouTube URL field
- Custom show notes editor
- Transcript URL field
- SEO metadata fields
- Episode statistics dashboard

#### EmailTemplateManager.tsx
- Preview/Edit tabs
- Hero section editor (Book/Podcast/Blog)
- Blog posts section (add/edit/remove)
- Podcast episodes section (add/edit/remove)
- Upsell section editor
- Copy HTML / Export JSON / Send Test
- Toggle sections on/off

#### EmailTemplate.tsx
- Mobile-responsive email design
- Dynamic hero sections by type
- Blog posts cards
- Podcast episodes cards
- Upsell card with pricing
- Branded header/footer
- Social links

#### AboutPageEditor.tsx
- Hero section editor
- Achievement cards (4 cards)
- Biography rich text editor
- Core values section
- Philosophy quote editor
- Save functionality per section

#### AnalyticsDashboard.tsx
- Real-time metrics cards
- 30-day overview statistics
- Page views trend chart (Recharts)
- Top content tables
- Traffic sources breakdown
- Device breakdown
- Geographic data
- User behavior metrics
- Date range selector
- Manual refresh button

### ✅ UI Components (`/components/ui/`)

**All shadcn/ui components** - Copy entire `/components/ui/` folder:

```
/components/ui/accordion.tsx
/components/ui/alert-dialog.tsx
/components/ui/alert.tsx
/components/ui/aspect-ratio.tsx
/components/ui/avatar.tsx
/components/ui/badge.tsx
/components/ui/breadcrumb.tsx
/components/ui/button.tsx
/components/ui/calendar.tsx
/components/ui/card.tsx
/components/ui/carousel.tsx
/components/ui/chart.tsx
/components/ui/checkbox.tsx
/components/ui/collapsible.tsx
/components/ui/command.tsx
/components/ui/context-menu.tsx
/components/ui/dialog.tsx
/components/ui/drawer.tsx
/components/ui/dropdown-menu.tsx
/components/ui/form.tsx
/components/ui/hover-card.tsx
/components/ui/input-otp.tsx
/components/ui/input.tsx
/components/ui/label.tsx
/components/ui/menubar.tsx
/components/ui/navigation-menu.tsx
/components/ui/pagination.tsx
/components/ui/popover.tsx
/components/ui/progress.tsx
/components/ui/radio-group.tsx
/components/ui/resizable.tsx
/components/ui/scroll-area.tsx
/components/ui/select.tsx
/components/ui/separator.tsx
/components/ui/sheet.tsx
/components/ui/sidebar.tsx
/components/ui/skeleton.tsx
/components/ui/slider.tsx
/components/ui/sonner.tsx
/components/ui/switch.tsx
/components/ui/table.tsx
/components/ui/tabs.tsx
/components/ui/textarea.tsx
/components/ui/toggle-group.tsx
/components/ui/toggle.tsx
/components/ui/tooltip.tsx
```

### ✅ Protected Components (DO NOT MODIFY)

```
/components/figma/ImageWithFallback.tsx   # Protected - handles image fallbacks
```

### ✅ Styles

```
/styles/globals.css                       # Critical: Typography tokens, CSS variables, Tailwind config
```

**Important Notes on Styling:**
- Uses Tailwind CSS v4.0 (no tailwind.config.js needed)
- Typography tokens defined for each HTML element (h1-h6, p, etc.)
- Custom CSS variables for colors
- `rounded-organic` utility for brand-consistent rounded corners
- DO NOT use text-* (font-size), font-* (font-weight), or leading-* (line-height) classes unless explicitly needed

---

## 🔧 Dependencies to Install

### Core Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "lucide-react": "latest",
    "sonner@2.0.3": "2.0.3",
    "recharts": "latest",
    "react-hook-form@7.55.0": "7.55.0"
  }
}
```

### Notes on Imports
- **Lucide Icons**: `import { IconName } from "lucide-react"`
- **Toast**: `import { toast } from "sonner@2.0.3"` (must specify version)
- **React Hook Form**: `import { ... } from "react-hook-form@7.55.0"` (must specify version)
- **Recharts**: For analytics charts
- **shadcn/ui components**: Import from `"./components/ui/component-name"`

---

## 🗄️ Database Schema (Supabase)

### Tables to Create

#### 1. `blog_posts`
```sql
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

CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date DESC);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
```

#### 2. `podcast_episodes`
```sql
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

CREATE INDEX idx_podcast_episodes_publish_date ON podcast_episodes(publish_date DESC);
CREATE INDEX idx_podcast_episodes_featured ON podcast_episodes(is_featured) WHERE is_featured = true;
CREATE INDEX idx_podcast_episodes_visible ON podcast_episodes(is_visible) WHERE is_visible = true;
```

#### 3. `about_page_content`
```sql
CREATE TABLE about_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_type TEXT NOT NULL CHECK (section_type IN ('hero', 'achievements', 'biography', 'values', 'philosophy')),
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_type)
);
```

#### 4. `email_subscribers`
```sql
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_email_subscribers_active ON email_subscribers(is_active) WHERE is_active = true;
```

#### 5. `contact_messages`
```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

CREATE INDEX idx_contact_messages_read ON contact_messages(is_read, created_at DESC);
```

### Row Level Security (RLS)

**Enable RLS on all tables:**
```sql
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
```

**Example RLS Policies** (adjust based on auth strategy):
```sql
-- Allow public read access to published blog posts
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users (CMS) full access
CREATE POLICY "Authenticated users have full access" ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Similar policies for other tables...
```

---

## 🔌 Supabase Edge Functions

### Function to Create: `sync-spotify-podcasts`

**Location:** Supabase Dashboard > Edge Functions

**Purpose:** Sync podcast episodes from Spotify API

**Endpoint:** `https://[your-project].supabase.co/functions/v1/sync-spotify-podcasts`

**Basic Structure:**
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    // 1. Authenticate with Spotify API
    const spotifyToken = await getSpotifyToken();
    
    // 2. Fetch show episodes from Spotify
    const episodes = await fetchSpotifyEpisodes(spotifyToken, SHOW_ID);
    
    // 3. Upsert episodes into Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data, error } = await supabase
      .from('podcast_episodes')
      .upsert(episodes, { onConflict: 'spotify_id' });
    
    // 4. Return results
    return new Response(
      JSON.stringify({ 
        success: true, 
        episodesAdded: data?.length || 0 
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

**Environment Variables for Edge Function:**
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_SHOW_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

## 🔐 Environment Variables

### Required Environment Variables

**For Vercel Deployment:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Spotify (for Edge Function)
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_SHOW_ID=your-podcast-show-id

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: Email Service (e.g., SendGrid, Resend)
EMAIL_SERVICE_API_KEY=your-email-api-key
```

**Where to Set:**
1. Vercel Dashboard > Project Settings > Environment Variables
2. Supabase Dashboard > Project Settings > Edge Functions > Secrets

---

## 🎨 Design Tokens (in globals.css)

### Color Variables
```css
--color-amber-50: ...
--color-amber-100: ...
/* ... through amber-900 */

--color-orange-50: ...
/* ... through orange-900 */

--color-gold: ...
--color-warm-accent: ...
```

### Typography Tokens
```css
/* Set for each HTML element */
h1 { font-size: ...; font-weight: ...; line-height: ...; }
h2 { ... }
h3 { ... }
p { ... }
/* etc. */
```

### Custom Utilities
```css
.rounded-organic { border-radius: 1.5rem; }
.text-shadow-warm { text-shadow: ...; }
```

---

## 📦 Migration Checklist

### Phase 1: Setup
- [ ] Create new Cursor project
- [ ] Initialize with React + TypeScript
- [ ] Install Tailwind CSS v4.0
- [ ] Set up Supabase project
- [ ] Configure environment variables

### Phase 2: Copy Core Files
- [ ] Copy `/styles/globals.css`
- [ ] Copy `/components/ui/` entire folder (all shadcn components)
- [ ] Copy `/components/figma/ImageWithFallback.tsx` (protected)
- [ ] Copy all main CMS components:
  - [ ] `BlogManager.tsx`
  - [ ] `PodcastManager.tsx`
  - [ ] `EmailTemplateManager.tsx`
  - [ ] `EmailTemplate.tsx`
  - [ ] `AboutPageEditor.tsx`
  - [ ] `AnalyticsDashboard.tsx`

### Phase 3: Database Setup
- [ ] Create Supabase tables (blog_posts, podcast_episodes, etc.)
- [ ] Add indexes
- [ ] Enable RLS
- [ ] Configure RLS policies
- [ ] Test database connections

### Phase 4: Edge Functions
- [ ] Create `sync-spotify-podcasts` Edge Function
- [ ] Set Edge Function environment variables
- [ ] Test Spotify API connection
- [ ] Test episode sync functionality

### Phase 5: Integration
- [ ] Connect components to Supabase
- [ ] Implement data fetching (useEffect hooks)
- [ ] Implement data mutations (create, update, delete)
- [ ] Set up Google Analytics 4
- [ ] Configure GA4 API access (if using real-time dashboard)
- [ ] Test end-to-end CMS workflows

### Phase 6: Public-Facing Site
- [ ] Create homepage/landing page
- [ ] Create blog listing page
- [ ] Create individual blog post page
- [ ] Create podcast listing page
- [ ] Create individual podcast episode page
- [ ] Create about page (rendering from database)
- [ ] Create books page
- [ ] Create contact modal
- [ ] Add navigation
- [ ] Add footer

### Phase 7: Email Integration
- [ ] Choose email service (SendGrid, Resend, etc.)
- [ ] Set up email templates export
- [ ] Implement "Send Test Email" functionality
- [ ] Set up newsletter subscription flow
- [ ] Configure email preferences management

### Phase 8: Testing
- [ ] Test all CMS features
- [ ] Test responsive design
- [ ] Test accessibility (keyboard nav, screen readers)
- [ ] Test SEO (meta tags, structured data)
- [ ] Test performance (Lighthouse)
- [ ] Cross-browser testing

### Phase 9: Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Configure Vercel environment variables
- [ ] Deploy to production
- [ ] Set up custom domain
- [ ] Configure SSL
- [ ] Test production deployment

### Phase 10: Post-Launch
- [ ] Set up monitoring/error tracking
- [ ] Configure automated backups
- [ ] Document CMS usage for content manager
- [ ] Train content manager on CMS
- [ ] Launch! 🚀

---

## 🚨 Critical Notes

### 1. **Component Compatibility**
All components are designed to work together. The `BlogManager.tsx` acts as the main dashboard that contains tabs for all other managers.

### 2. **Data Flow**
- Components use React `useState` for local state
- Mock data is provided in components
- Replace mock data with Supabase hooks (`useEffect` + `supabase.from()`)

### 3. **Styling Constraints**
⚠️ **IMPORTANT**: Do NOT use Tailwind's font-size, font-weight, or line-height utilities unless explicitly needed. Typography is managed via `globals.css`.

### 4. **Protected Files**
Do NOT modify:
- `/components/figma/ImageWithFallback.tsx`

### 5. **Image Handling**
- For Figma imports: Use `figma:asset` paths
- For new images: Use `ImageWithFallback` component
- For user uploads: Use Supabase Storage

### 6. **Rich Text Editor**
The blog editor supports:
- Markdown syntax
- HTML tags (for underline, etc.)
- Keyboard shortcuts
- Live preview (word count, character count)

### 7. **Search Functionality**
Real-time search across multiple fields. Uses `useMemo` for performance.

### 8. **Import Functionality**
- Auto-detects WordPress XML vs Medium JSON
- Parses and cleans HTML
- Auto-generates excerpts
- Auto-calculates read time
- Sets all imports to "draft" status

### 9. **Email Templates**
Email template HTML export needs to be email-client compatible (inline CSS, table layouts if needed). Current implementation uses modern CSS but may need conversion for email clients.

### 10. **Analytics Integration**
The Analytics Dashboard requires Google Analytics 4 API setup with proper credentials and scopes.

---

## 📚 Additional Resources

### Supabase Docs
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Spotify API
- [Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Get Show Episodes](https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes)

### Google Analytics
- [GA4 API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

### Tailwind CSS
- [Tailwind v4.0 Docs](https://tailwindcss.com/docs)

### shadcn/ui
- [Component Documentation](https://ui.shadcn.com/docs)

---

## 🎯 Quick Start Guide

1. **Clone/Create project in Cursor**
2. **Copy all component files** from this manifest
3. **Copy `globals.css`**
4. **Install dependencies**
5. **Set up Supabase project** and create tables
6. **Configure environment variables**
7. **Replace mock data** with Supabase queries
8. **Test CMS functionality**
9. **Build public-facing pages**
10. **Deploy to Vercel**

---

## ✅ Validation Checklist

After migration, verify:
- [ ] All 7 CMS tabs are functional
- [ ] Blog post creation/editing works
- [ ] Rich text editor toolbar functions
- [ ] Search filters posts correctly
- [ ] WordPress/Medium import parses files
- [ ] Podcast manager displays episodes
- [ ] Spotify sync button works (with Edge Function)
- [ ] Email template preview renders correctly
- [ ] Email template exports HTML
- [ ] About page editor saves content
- [ ] Analytics dashboard displays metrics
- [ ] All shadcn/ui components render
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Environment variables are set
- [ ] Database connections work
- [ ] RLS policies allow proper access

---

**Migration prepared by:** Figma Make AI  
**Date:** November 12, 2024  
**Status:** ✅ Ready for Cursor import  
**Estimated migration time:** 4-6 hours for experienced developer
