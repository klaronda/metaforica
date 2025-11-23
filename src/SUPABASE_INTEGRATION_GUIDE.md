# Supabase Integration Guide for Metaforica

This guide shows how to connect the CMS components to Supabase. Replace the mock data with these implementations.

---

## Setup Supabase Client

### Create `/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  status: 'draft' | 'published'
  publish_date: string
  read_time: number
  seo_title?: string
  seo_description?: string
  featured_image?: string
  created_at: string
  updated_at: string
}

export interface PodcastEpisode {
  id: string
  spotify_id: string
  title: string
  description: string
  publish_date: string
  duration: string
  spotify_url: string
  thumbnail_url: string
  youtube_url?: string
  custom_show_notes?: string
  is_featured: boolean
  is_visible: boolean
  transcript_url?: string
  seo_description?: string
  seo_keywords?: string
  episode_number?: number
  season?: number
  created_at: string
  updated_at: string
}

export interface AboutPageContent {
  id: string
  section_type: 'hero' | 'achievements' | 'biography' | 'values' | 'philosophy'
  content: any // JSONB
  updated_at: string
}
```

---

## Blog Manager Integration

### Fetch Blog Posts

Replace the `mockPosts` in `BlogManager.tsx` with:

```typescript
import { supabase, BlogPost } from '../lib/supabase'

// Inside BlogManager component
const [posts, setPosts] = useState<BlogPost[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchPosts()
}, [])

const fetchPosts = async () => {
  setLoading(true)
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false })
    
    if (error) throw error
    setPosts(data || [])
  } catch (error) {
    console.error('Error fetching posts:', error)
    toast.error('Failed to load posts')
  } finally {
    setLoading(false)
  }
}
```

### Save Blog Post

Replace `handleSavePost` with:

```typescript
const handleSavePost = async () => {
  if (!selectedPost) return
  
  const updatedPost: Partial<BlogPost> = {
    title: editForm.title,
    content: editForm.content,
    excerpt: editForm.excerpt,
    tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    category: editForm.category,
    status: editForm.status,
    publish_date: editForm.publishDate,
    seo_title: editForm.seoTitle,
    seo_description: editForm.seoDescription,
    featured_image: editForm.featuredImage,
    read_time: Math.ceil(editForm.content.split(' ').length / 200),
    updated_at: new Date().toISOString()
  }

  try {
    let result
    if (posts.find(p => p.id === selectedPost.id)) {
      // Update existing post
      result = await supabase
        .from('blog_posts')
        .update(updatedPost)
        .eq('id', selectedPost.id)
        .select()
    } else {
      // Insert new post
      result = await supabase
        .from('blog_posts')
        .insert([{ ...updatedPost, id: selectedPost.id }])
        .select()
    }

    if (result.error) throw result.error
    
    toast.success('Post saved successfully!')
    fetchPosts() // Refresh the list
    setIsEditing(false)
    setActiveTab('posts')
  } catch (error) {
    console.error('Error saving post:', error)
    toast.error('Failed to save post')
  }
}
```

### Delete Blog Post

Replace `handleDeletePost` with:

```typescript
const handleDeletePost = async (postId: string) => {
  if (!confirm('Are you sure you want to delete this post?')) return
  
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId)
    
    if (error) throw error
    
    toast.success('Post deleted successfully!')
    fetchPosts() // Refresh the list
    if (selectedPost?.id === postId) {
      setSelectedPost(null)
      setIsEditing(false)
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    toast.error('Failed to delete post')
  }
}
```

### Import Posts

Update `handleFileImport` to save to database:

```typescript
const handleFileImport = async (file: File) => {
  setImportStatus('processing')
  setImportProgress(0)
  setImportResults({ imported: 0, errors: [] })

  try {
    const content = await file.text()
    let importedPosts: Partial<BlogPost>[] = []
    
    // Parse file (same as before)
    if (file.name.toLowerCase().includes('wordpress') || file.name.endsWith('.xml')) {
      importedPosts = parseWordPressXML(content)
    } else if (file.name.toLowerCase().includes('medium') || file.name.endsWith('.json')) {
      importedPosts = parseMediumJSON(content)
    }

    // Insert into database
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(importedPosts)
      .select()

    if (error) throw error

    setImportResults({ imported: data?.length || 0, errors: [] })
    setImportStatus('success')
    fetchPosts() // Refresh the list

  } catch (error) {
    setImportResults({ 
      imported: 0, 
      errors: [error instanceof Error ? error.message : 'Import failed'] 
    })
    setImportStatus('error')
  }
}
```

---

## Podcast Manager Integration

### Fetch Podcast Episodes

```typescript
import { supabase, PodcastEpisode } from '../lib/supabase'

// Inside PodcastManager component
const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchEpisodes()
}, [])

const fetchEpisodes = async () => {
  setLoading(true)
  try {
    const { data, error } = await supabase
      .from('podcast_episodes')
      .select('*')
      .order('publish_date', { ascending: false })
    
    if (error) throw error
    setEpisodes(data || [])
  } catch (error) {
    console.error('Error fetching episodes:', error)
    toast.error('Failed to load episodes')
  } finally {
    setLoading(false)
  }
}
```

### Spotify Sync

```typescript
const handleSync = async () => {
  setIsSyncing(true)
  
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('sync-spotify-podcasts', {
      body: {}
    })

    if (error) throw error
    
    setLastSync(new Date())
    toast.success(`Synced ${data.episodesAdded} episodes from Spotify!`)
    fetchEpisodes() // Refresh the list
  } catch (error) {
    console.error('Error syncing with Spotify:', error)
    toast.error('Failed to sync with Spotify')
  } finally {
    setIsSyncing(false)
  }
}
```

### Update Episode

```typescript
const handleSaveEpisode = async () => {
  if (!selectedEpisode) return
  
  try {
    const { error } = await supabase
      .from('podcast_episodes')
      .update({
        youtube_url: selectedEpisode.youtube_url,
        custom_show_notes: selectedEpisode.custom_show_notes,
        transcript_url: selectedEpisode.transcript_url,
        seo_description: selectedEpisode.seo_description,
        seo_keywords: selectedEpisode.seo_keywords,
        is_featured: selectedEpisode.is_featured,
        is_visible: selectedEpisode.is_visible,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedEpisode.id)
    
    if (error) throw error
    
    toast.success('Episode updated successfully!')
    fetchEpisodes()
    setIsEditing(false)
    setSelectedEpisode(null)
  } catch (error) {
    console.error('Error updating episode:', error)
    toast.error('Failed to update episode')
  }
}
```

### Toggle Featured/Visible

```typescript
const handleToggleFeatured = async (episodeId: string) => {
  const episode = episodes.find(ep => ep.id === episodeId)
  if (!episode) return
  
  try {
    const { error } = await supabase
      .from('podcast_episodes')
      .update({ is_featured: !episode.is_featured })
      .eq('id', episodeId)
    
    if (error) throw error
    
    toast.success(episode.is_featured ? 'Removed from featured' : 'Marked as featured')
    fetchEpisodes()
  } catch (error) {
    console.error('Error toggling featured:', error)
    toast.error('Failed to update episode')
  }
}

const handleToggleVisible = async (episodeId: string) => {
  const episode = episodes.find(ep => ep.id === episodeId)
  if (!episode) return
  
  try {
    const { error } = await supabase
      .from('podcast_episodes')
      .update({ is_visible: !episode.is_visible })
      .eq('id', episodeId)
    
    if (error) throw error
    
    toast.success(episode.is_visible ? 'Episode hidden' : 'Episode visible')
    fetchEpisodes()
  } catch (error) {
    console.error('Error toggling visibility:', error)
    toast.error('Failed to update episode')
  }
}
```

---

## About Page Editor Integration

### Fetch About Content

```typescript
import { supabase, AboutPageContent } from '../lib/supabase'

// Inside AboutPageEditor component
const [heroContent, setHeroContent] = useState<any>(null)
const [achievementsContent, setAchievementsContent] = useState<any>(null)
const [biographyContent, setBiographyContent] = useState<any>(null)
const [valuesContent, setValuesContent] = useState<any>(null)
const [philosophyContent, setPhilosophyContent] = useState<any>(null)

useEffect(() => {
  fetchAboutContent()
}, [])

const fetchAboutContent = async () => {
  try {
    const { data, error } = await supabase
      .from('about_page_content')
      .select('*')
    
    if (error) throw error
    
    // Organize by section_type
    data?.forEach(section => {
      switch (section.section_type) {
        case 'hero':
          setHeroContent(section.content)
          break
        case 'achievements':
          setAchievementsContent(section.content)
          break
        case 'biography':
          setBiographyContent(section.content)
          break
        case 'values':
          setValuesContent(section.content)
          break
        case 'philosophy':
          setPhilosophyContent(section.content)
          break
      }
    })
  } catch (error) {
    console.error('Error fetching about content:', error)
    toast.error('Failed to load content')
  }
}
```

### Save About Content

```typescript
const saveSection = async (sectionType: string, content: any) => {
  try {
    const { error } = await supabase
      .from('about_page_content')
      .upsert({
        section_type: sectionType,
        content: content,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'section_type'
      })
    
    if (error) throw error
    
    toast.success('Section saved successfully!')
  } catch (error) {
    console.error('Error saving section:', error)
    toast.error('Failed to save section')
  }
}

// Example: Save hero section
const handleSaveHero = () => {
  saveSection('hero', {
    name: heroName,
    title: heroTitle,
    bio: heroBio,
    image: heroImage
  })
}

// Example: Save achievements
const handleSaveAchievements = () => {
  saveSection('achievements', {
    cards: achievementCards // array of 4 cards
  })
}
```

---

## Storage & Table Overview

### Buckets

- `site-assets` – global illustrations, backgrounds, favicon, CTA art.
- `blog-assets` – featured images and media referenced inside blog posts.
- `profile-assets` – host/podcast guest portraits for the About section.
- `podcast-assets` (optional) – supplementary episode imagery or assets that you want to serve outside of Spotify.
- `email-assets` (optional) – newsletter-specific images (headers, product shots).
- `import-assets` (temporary) – drop Medium/WordPress assets here while importing, then move to the permanent bucket.

Each bucket should be set to `public` for now so the frontend can fetch files with the anon key. Add a simple storage policy later that guards the write path to authenticated CMS users (see `auth.role()` check).

### Table Schemas You Need Today

#### `podcast_episodes`

Stores the Spotify data plus optional CMS overrides (YouTube URLs, show notes, transcripts).

```sql
create table podcast_episodes (
  id uuid primary key default uuid_generate_v4(),
  spotify_id text unique not null,
  title text not null,
  description text,
  publish_date timestamptz not null,
  duration text,
  spotify_url text,
  thumbnail_url text,
  youtube_url text,
  custom_show_notes text,
  transcript_url text,
  seo_description text,
  seo_keywords text[],
  is_featured boolean default false,
  is_visible boolean default true,
  episode_number int,
  season int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Use `thumbnail_url` or a storage path (`podcast-assets`) so the hero and podcast grid can display art when Spotify does not expose it.

#### `blog_posts`

Supports the CMS and the blog feed.

```sql
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  excerpt text,
  content text,
  status text check (status in ('draft','published')) default 'draft',
  category text,
  tags text[],
  publish_date timestamptz,
  read_time int,
  featured_image_url text,
  featured_image_path text,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Store the Supabase Storage path in `featured_image_path` (e.g., `blog-assets/why-curiosity.webp`) and use a helper to build the full CDN URL when rendering.

#### `about_page_content`

Drives the hero copy, biography, values, achievements and philosophy quote.

```sql
create table about_page_content (
  id uuid primary key default uuid_generate_v4(),
  section_type text check (section_type in ('hero','biography','values','achievements','philosophy')) not null,
  content jsonb not null,
  updated_at timestamptz default now()
);
```

Example `content` payloads:

- `hero`: `{ "title": "...", "subtitle": "...", "profile_image_url": "...", "profile_image_alt": "..." }`
- `values`: `{ "label": "Mis Valores", "items": ["Autenticidad","Curiosidad"] }`
- `achievements`: `{ "cards": [{ "label": "...", "description": "...", "icon": "mic" }] }`

#### `email_subscribers` (for the capture forms)

```sql
create table email_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  wants_podcast boolean default true,
  wants_blog boolean default true,
  wants_books boolean default true,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
```


### Asset Upload Flow

1. Upload files from the About CMS into `profile-assets`, blog images into `blog-assets`, and general site art into `site-assets`.
2. Supabase Storage returns a public URL plus a `path` (e.g., `profile-assets/alexandra-hero.webp`).
3. Persist the public URL or path in the relevant table (`profile_image_url` in the `hero` content object, `featured_image_url` for blog posts, etc.).
4. Render the preview by pointing the `<img>` tag at the stored URL; the `AboutPageEditor` already renders a preview if `profileImageUrl` is set.

When you’re ready to lock things down, change each bucket to private and update the CMS to request signed URLs via Supabase Storage.


## Email Template Manager Integration

### Save Email Template

```typescript
// Create a new table for email templates
const saveEmailTemplate = async (templateName: string, templateData: any) => {
  try {
    const { error } = await supabase
      .from('email_templates')
      .insert({
        name: templateName,
        template_data: templateData,
        created_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    toast.success('Template saved!')
  } catch (error) {
    console.error('Error saving template:', error)
    toast.error('Failed to save template')
  }
}
```

### Send Test Email

```typescript
const handleSendTestEmail = async () => {
  const templateData = {
    heroType,
    heroTitle,
    heroDescription,
    // ... all other fields
  }
  
  try {
    // Call Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: 'your-email@example.com', // Could be from a form input
        template: templateData,
        subject: heroTitle
      }
    })

    if (error) throw error
    
    toast.success('Test email sent!')
  } catch (error) {
    console.error('Error sending test email:', error)
    toast.error('Failed to send test email')
  }
}
```

---

## Analytics Dashboard Integration

### Google Analytics API Setup

1. **Enable Google Analytics Data API** in Google Cloud Console
2. **Create Service Account** and download JSON key
3. **Add Service Account email** to Google Analytics property (with Viewer permissions)
4. **Store credentials** in Supabase Edge Function secrets

### Fetch Analytics Data

Create an Edge Function `get-analytics-data`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { BetaAnalyticsDataClient } from "npm:@google-analytics/data@4"

serve(async (req) => {
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: JSON.parse(Deno.env.get('GOOGLE_ANALYTICS_CREDENTIALS') || '{}')
    })
    
    const propertyId = Deno.env.get('GA_PROPERTY_ID')
    
    // Fetch page views for last 30 days
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ]
    })
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### Use in Component

```typescript
const [analyticsData, setAnalyticsData] = useState<any>(null)

const fetchAnalytics = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-analytics-data')
    
    if (error) throw error
    
    setAnalyticsData(data)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    toast.error('Failed to load analytics')
  }
}

useEffect(() => {
  fetchAnalytics()
}, [])
```

---

## Contact Form Integration

### Save Contact Message

```typescript
const handleContactSubmit = async (formData: { name: string, email: string, message: string }) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        created_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    toast.success('Message sent successfully!')
    
    // Optionally, trigger email notification via Edge Function
    await supabase.functions.invoke('send-email', {
      body: {
        to: 'your-email@example.com',
        subject: `New contact from ${formData.name}`,
        text: formData.message
      }
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    toast.error('Failed to send message')
  }
}
```

---

## Email Subscription Integration

### Subscribe User

```typescript
const handleSubscribe = async (email: string, name?: string) => {
  try {
    const { error } = await supabase
      .from('email_subscribers')
      .insert({
        email,
        name,
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
    
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        toast.error('This email is already subscribed!')
      } else {
        throw error
      }
      return
    }
    
    toast.success('Successfully subscribed to newsletter!')
  } catch (error) {
    console.error('Error subscribing:', error)
    toast.error('Failed to subscribe')
  }
}
```

### Unsubscribe User

```typescript
const handleUnsubscribe = async (email: string) => {
  try {
    const { error } = await supabase
      .from('email_subscribers')
      .update({ is_active: false })
      .eq('email', email)
    
    if (error) throw error
    
    toast.success('Successfully unsubscribed')
  } catch (error) {
    console.error('Error unsubscribing:', error)
    toast.error('Failed to unsubscribe')
  }
}
```

---

## Real-time Subscriptions (Optional)

For real-time updates when content changes:

```typescript
// Subscribe to blog post changes
useEffect(() => {
  const subscription = supabase
    .channel('blog_posts_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'blog_posts' },
      (payload) => {
        console.log('Change received!', payload)
        fetchPosts() // Refresh posts
      }
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

---

## Error Handling Best Practices

### Centralized Error Handler

```typescript
const handleSupabaseError = (error: any, context: string) => {
  console.error(`${context}:`, error)
  
  // User-friendly error messages
  if (error.code === '23505') {
    toast.error('This item already exists')
  } else if (error.code === 'PGRST116') {
    toast.error('Item not found')
  } else if (error.message.includes('JWT')) {
    toast.error('Session expired. Please login again.')
  } else {
    toast.error(`Failed to ${context.toLowerCase()}`)
  }
}

// Usage
try {
  const { error } = await supabase.from('blog_posts').insert(post)
  if (error) throw error
} catch (error) {
  handleSupabaseError(error, 'Save post')
}
```

---

## Testing Checklist

After implementing Supabase integration:

- [ ] Blog posts CRUD operations work
- [ ] Search and filter work with database
- [ ] Import saves to database
- [ ] Podcast episodes fetch from database
- [ ] Spotify sync Edge Function works
- [ ] Episode updates save correctly
- [ ] About page content saves/loads
- [ ] Email templates can be saved
- [ ] Contact form saves to database
- [ ] Email subscription works
- [ ] Analytics data fetches correctly
- [ ] Error handling shows user-friendly messages
- [ ] Loading states display properly
- [ ] No console errors
- [ ] RLS policies allow proper access
- [ ] Real-time updates work (if implemented)

---

## Performance Optimization

### Use React Query (Optional but Recommended)

Install: `npm install @tanstack/react-query`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Fetch posts
const { data: posts, isLoading } = useQuery({
  queryKey: ['blog_posts'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('publish_date', { ascending: false })
    
    if (error) throw error
    return data
  }
})

// Save post
const queryClient = useQueryClient()
const saveMutation = useMutation({
  mutationFn: async (post: Partial<BlogPost>) => {
    const { error } = await supabase
      .from('blog_posts')
      .upsert(post)
    
    if (error) throw error
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blog_posts'] })
    toast.success('Post saved!')
  },
  onError: (error) => {
    toast.error('Failed to save post')
  }
})
```

---

## Next Steps

1. Copy this integration code to Cursor
2. Replace mock data with Supabase calls
3. Create Edge Functions for Spotify sync and email
4. Test all CRUD operations
5. Set up real-time subscriptions (optional)
6. Implement error handling
7. Add loading states
8. Test end-to-end workflows

**Good luck with your Supabase integration! 🚀**
