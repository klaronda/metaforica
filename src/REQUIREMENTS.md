# Metaforica Website - Complete Requirements Document

## Project Overview
A comprehensive blog and podcast website for Metaforica, featuring warm and colorful aesthetics with yellow/gold accents. Built with Supabase, deployed via Vercel, with integrations for Spotify, Medium, Google Analytics, and YouTube.

---

## 1. END-USER EXPERIENCE REQUIREMENTS

### 1.1 Navigation & Layout
- **Responsive navigation bar** with smooth scrolling to sections
- **Home/Landing page** with hero section
- **About section** ("Sobre Mí") with biography and achievements
- **Blog section** with searchable, filterable posts
- **Podcast section** with episode listings
- **Books section** for selling books
- **Contact modal** for user inquiries
- **Footer** with social media links (Instagram, Spotify, YouTube)
- **Mobile-responsive design** across all screen sizes

### 1.2 Blog Functionality
- **Blog post listing** with:
  - Featured images
  - Post titles and excerpts
  - Publication dates
  - Read time estimates
  - Category badges
  - Tag display
  - Search functionality
  - Filter by category
  - Filter by tags
- **Individual blog post pages** with:
  - Full content display
  - Rich text formatting support (Markdown)
  - SEO meta tags
  - Social sharing buttons
  - Related posts section
- **Backdated posts support** (for imported content)

### 1.3 Podcast Section
- **Podcast episode listings** with:
  - Episode titles and descriptions
  - Spotify embed players
  - YouTube video embeds (when available)
  - Episode metadata (duration, publish date, episode number)
  - Featured episodes highlighting
  - Search and filter capabilities
  - Custom show notes
  - Transcript links (when available)
  - Additional resource links
- **Spotify integration** for automatic episode sync
- **YouTube integration** for video podcasts

### 1.4 About Page ("Sobre Mí")
- **Hero section** with professional photo and introduction
- **Achievement cards** (4 cards) displaying:
  - Icons/images
  - Titles
  - Descriptions
- **Biography section** with rich text content
- **Core Values section** with:
  - Multiple value cards
  - Icons
  - Titles and descriptions
- **Philosophy/Quote section** with featured quote

### 1.5 Books Section
- **Book showcase** with:
  - Cover images
  - Titles and descriptions
  - Purchase links/buttons
  - Pricing information
  - Preview/sample chapters links
- **Featured book highlighting**

### 1.6 Contact & Communication
- **Contact modal** with:
  - Name, email, message fields
  - Form validation
  - Success/error notifications
  - Email preferences opt-in
- **Email newsletter subscription** with:
  - Subscription form
  - Email preferences management
  - Unsubscribe functionality
- **Toast notifications** for user feedback

### 1.7 Analytics & Tracking
- **Google Analytics 4 integration**
- **Cookie consent** (if required)
- **Page view tracking**
- **Event tracking** for key user actions

### 1.8 Design & Aesthetics
- **Warm color palette** with yellow/gold accents
- **Organic, rounded shapes** (rounded-organic class)
- **Playful yet professional typography**
- **Engaging visual elements**
- **Smooth animations and transitions**
- **Accessibility compliance** (WCAG standards)

---

## 2. CONTENT MANAGER (CMS) REQUIREMENTS

### 2.1 Authentication & Access
- **Discrete login system** (no public-facing login)
- **Secure authentication** via Supabase Auth
- **Session management**
- **Password-protected CMS access**
- **No user account creation** (admin only)

### 2.2 Blog Management

#### 2.2.1 Blog Posts Tab
- **Post listing view** with:
  - Search functionality across title, content, excerpt, tags, category
  - Real-time search results count
  - Post status badges (Published/Draft)
  - Publication dates
  - Read time display
  - Category and tag display
  - Edit and delete actions
  - Clear search button
- **Create new post** button
- **Responsive grid layout**

#### 2.2.2 Blog Editor Tab
- **Rich text editor** with formatting toolbar:
  - Bold, italic, underline, strikethrough
  - Headings (H1, H2, H3)
  - Bullet lists and numbered lists
  - Blockquotes
  - Link insertion
  - Line break insertion
  - Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
  - Show/hide toolbar toggle
  - Markdown support
- **Post metadata fields**:
  - Title
  - Excerpt
  - Content (with word count and character count)
  - Category (dropdown selection)
  - Tags (comma-separated)
  - Publication date (with backdate support)
  - Featured image upload
- **Publish settings**:
  - Published/Draft toggle
  - Status indicator
- **SEO settings**:
  - SEO title (60 character limit)
  - SEO meta description (160 character limit)
  - Character counters
- **Save and cancel** actions
- **Auto-calculation** of read time

### 2.3 Podcast Management

#### 2.3.1 Spotify Sync
- **Sync controls**:
  - Last sync timestamp display
  - Manual "Sync Now" button
  - Loading states during sync
  - Auto-sync toggle (daily scheduling)
  - Sync status indicators
- **Statistics dashboard**:
  - Total episodes count
  - Featured episodes count
  - Episodes with YouTube count

#### 2.3.2 Episode Management
- **Episode listing** with:
  - Search by title/description
  - Filter dropdown (All, Featured Only, Visible Only, Hidden Only)
  - Episode thumbnails
  - Metadata display (date, duration, Spotify link)
  - Status badges (Featured, Hidden, YouTube)
  - Quick action buttons
- **Episode actions**:
  - Toggle featured status
  - Toggle visibility (show/hide on website)
  - Edit episode details
- **Episode editor** with:
  - Read-only Spotify info (auto-synced)
  - YouTube URL field
  - Custom show notes (rich text)
  - Transcript URL field
  - SEO meta description
  - SEO keywords
  - Featured toggle
  - Visible toggle
  - Save/cancel actions

### 2.4 About Page Editor
- **Section-based editing**:
  - Hero section (name, title, bio intro, profile image)
  - Achievement cards (4 cards with title, description, icon)
  - Biography (combined rich text editor)
  - Core values (multiple cards with title, description, emoji/icon)
  - Philosophy quote (quote text and author)
- **Save functionality** for each section
- **Preview capability**
- **Image upload** for profile photo

### 2.5 Email Marketing

#### 2.5.1 Email Template Manager
- **Dual-tab interface**:
  - Preview tab (live email preview)
  - Edit tab (comprehensive editor)
- **Hero section editor**:
  - Content type selector (Book Launch, New Podcast Episode, Blog Post)
  - Title field
  - Description (rich text)
  - Image URL field
  - CTA button text
  - CTA button link
  - Dynamic color theming based on type
- **Blog posts section**:
  - Toggle to include/exclude
  - Add/remove blog post cards
  - Edit title, excerpt, link, date per post
  - Multiple posts support
- **Podcast episodes section**:
  - Toggle to include/exclude
  - Add/remove episode cards
  - Edit title, description, link, duration per episode
  - Multiple episodes support
- **Upsell section**:
  - Title field
  - Description field
  - Image URL field
  - Price field (optional)
  - CTA button text
  - CTA button link
- **Export functionality**:
  - Copy HTML code
  - Export template as JSON
  - Send test email
  - Download template

### 2.6 Import Functionality

#### 2.6.1 WordPress Import
- **XML file upload**
- **Automatic parsing** of WordPress export format
- **Field mapping**:
  - Title
  - Content (HTML stripping)
  - Publication date
  - Categories
  - Tags
- **Batch import** with progress indicator
- **Import status** (processing, success, error)
- **Results summary** (number imported, errors)

#### 2.6.2 Medium Import
- **JSON file upload**
- **Automatic parsing** of Medium export format
- **Field mapping**:
  - Title
  - Content/body
  - Publication date
  - Tags
- **Batch import** with progress indicator
- **Import status** (processing, success, error)
- **Results summary** (number imported, errors)

#### 2.6.3 Import Features
- **Drag-and-drop file upload**
- **File type validation** (.xml, .json)
- **File size limit** (10MB max)
- **Auto-format detection**
- **Import progress bar**
- **Success/error alerts**
- **Automatic excerpt generation**
- **Automatic read time calculation**
- **All imported posts set to "Draft"** initially

### 2.7 Analytics Dashboard

#### 2.7.1 Google Analytics 4 Integration
- **Real-time metrics**:
  - Active users right now
  - Page views today
  - Top pages today
- **Overview metrics** (30-day period):
  - Total users
  - Total sessions
  - Total page views
  - Average session duration
  - Bounce rate
  - Pages per session
- **Trend visualization**:
  - Line chart for page views over time
  - 7-day, 30-day, 90-day views
- **Top content**:
  - Most viewed blog posts
  - Most viewed podcast episodes
  - Page view counts
- **Traffic sources**:
  - Organic search
  - Direct traffic
  - Social media
  - Referrals
  - Percentage breakdowns
- **Device breakdown**:
  - Desktop vs. mobile vs. tablet
  - Percentage distribution
- **Geographic data**:
  - Top countries
  - User counts per country
- **User behavior**:
  - New vs. returning users
  - Engagement metrics
- **Data refresh**:
  - Manual refresh button
  - Last updated timestamp
  - Auto-refresh capability

#### 2.7.2 Analytics Features
- **Date range selector**
- **Metric cards** with trend indicators
- **Interactive charts** (using Recharts)
- **Export data** functionality
- **Real-time updates**
- **Error handling** for API failures

### 2.8 CMS Navigation
- **Tab-based navigation**:
  - Posts (blog post listing)
  - Editor (blog post editor)
  - Podcasts (podcast management)
  - About (about page editor)
  - Email (email template manager)
  - Import (content import)
  - Analytics (analytics dashboard)
- **Icon indicators** for each tab
- **Active tab highlighting**
- **Responsive tab layout**

---

## 3. TECHNICAL REQUIREMENTS

### 3.1 Technology Stack
- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS v4.0
- **Component Library**: shadcn/ui
- **Backend/Database**: Supabase
  - PostgreSQL database
  - Supabase Auth
  - Supabase Storage (for images)
  - Edge Functions (for Spotify sync)
- **Deployment**: Vercel
- **Version Control**: GitHub
- **Development Environment**: Cursor IDE

### 3.2 External Integrations
- **Spotify API**: Podcast episode sync (Edge Function)
- **YouTube API**: Video embeds
- **Google Analytics 4**: Analytics tracking
- **Medium API**: Content import
- **Email Service**: Newsletter/contact form (to be determined)

### 3.3 Database Schema

#### 3.3.1 Blog Posts Table
```sql
- id (uuid, primary key)
- title (text)
- content (text)
- excerpt (text)
- tags (text[])
- category (text)
- status (enum: 'draft', 'published')
- publish_date (date)
- read_time (integer)
- seo_title (text, nullable)
- seo_description (text, nullable)
- featured_image (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3.3.2 Podcast Episodes Table
```sql
- id (uuid, primary key)
- spotify_id (text, unique)
- title (text)
- description (text)
- publish_date (date)
- duration (text)
- spotify_url (text)
- thumbnail_url (text)
- youtube_url (text, nullable)
- custom_show_notes (text, nullable)
- is_featured (boolean, default: false)
- is_visible (boolean, default: true)
- transcript_url (text, nullable)
- seo_description (text, nullable)
- seo_keywords (text, nullable)
- episode_number (integer, nullable)
- season (integer, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3.3.3 About Page Content Table
```sql
- id (uuid, primary key)
- section_type (enum: 'hero', 'achievements', 'biography', 'values', 'philosophy')
- content (jsonb)
- updated_at (timestamp)
```

#### 3.3.4 Email Subscribers Table
```sql
- id (uuid, primary key)
- email (text, unique)
- name (text, nullable)
- subscribed_at (timestamp)
- preferences (jsonb)
- is_active (boolean, default: true)
```

#### 3.3.5 Contact Messages Table
```sql
- id (uuid, primary key)
- name (text)
- email (text)
- message (text)
- created_at (timestamp)
- is_read (boolean, default: false)
```

### 3.4 Supabase Edge Functions

#### 3.4.1 Spotify Sync Function
```typescript
// Edge function to sync podcast episodes from Spotify
// Endpoint: /functions/v1/sync-spotify-podcasts
// Method: POST
// Auth: Required (service role key)
// Returns: { success: boolean, episodesAdded: number, episodesUpdated: number }
```

#### 3.4.2 Send Email Function (Optional)
```typescript
// Edge function to send emails (contact form, newsletters)
// Endpoint: /functions/v1/send-email
// Method: POST
// Returns: { success: boolean, messageId: string }
```

### 3.5 Security Requirements
- **Row Level Security (RLS)** enabled on all Supabase tables
- **API key protection** (no keys in frontend code)
- **Environment variables** for all sensitive data
- **HTTPS only** for all connections
- **Input validation** and sanitization
- **XSS prevention**
- **CSRF protection**
- **Rate limiting** on API endpoints

### 3.6 Performance Requirements
- **Page load time**: < 3 seconds
- **Time to Interactive**: < 5 seconds
- **Lighthouse score**: > 90
- **Image optimization**: WebP format, lazy loading
- **Code splitting**: Dynamic imports for routes
- **Caching**: Browser caching for static assets
- **CDN**: Vercel Edge Network

### 3.7 SEO Requirements
- **Meta tags** on all pages
- **Open Graph tags** for social sharing
- **Twitter Card tags**
- **Structured data** (JSON-LD) for blog posts
- **XML sitemap**
- **robots.txt**
- **Semantic HTML**
- **Alt text** on all images
- **Canonical URLs**

### 3.8 Accessibility Requirements
- **WCAG 2.1 Level AA** compliance
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus indicators**
- **ARIA labels** where needed
- **Color contrast** ratios met
- **Responsive font sizing**

---

## 4. COMPONENT ARCHITECTURE

### 4.1 Main Components
- `App.tsx` - Main application entry point
- `BlogManager.tsx` - CMS dashboard
- `PodcastManager.tsx` - Podcast management
- `EmailTemplateManager.tsx` - Email marketing
- `AboutPageEditor.tsx` - About page CMS
- `AnalyticsDashboard.tsx` - Google Analytics dashboard
- `EmailTemplate.tsx` - Email template renderer

### 4.2 UI Components (shadcn/ui)
All components located in `/components/ui/`:
- accordion, alert-dialog, alert, aspect-ratio, avatar
- badge, breadcrumb, button
- calendar, card, carousel, chart, checkbox, collapsible, command, context-menu
- dialog, drawer, dropdown-menu
- form
- hover-card
- input, input-otp
- label
- menubar
- navigation-menu
- pagination, popover, progress
- radio-group, resizable
- scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch
- table, tabs, textarea, toggle-group, toggle, tooltip

### 4.3 Protected Components
- `ImageWithFallback.tsx` - Protected image component (DO NOT MODIFY)

### 4.4 Styling
- `/styles/globals.css` - Global styles and CSS variables
- Tailwind v4.0 configuration
- Custom color tokens (amber/yellow/gold accents)
- Typography tokens for each HTML element
- Organic border radius utilities (rounded-organic)

---

## 5. CONTENT STRATEGY

### 5.1 Blog Categories
- Writing Tips
- Writing Process
- Book Reviews
- Podcast Insights
- Personal Stories

### 5.2 Content Guidelines
- **Blog posts**: 800-2000 words optimal
- **Excerpts**: 150-200 characters
- **SEO titles**: Max 60 characters
- **Meta descriptions**: Max 160 characters
- **Images**: High quality, relevant, optimized
- **Tags**: 3-7 tags per post
- **Tone**: Warm, insightful, authentic, playful

### 5.3 Publishing Workflow
1. Create draft in CMS
2. Add content with rich text editor
3. Set category and tags
4. Add SEO metadata
5. Upload featured image
6. Preview
7. Set publish date
8. Publish or schedule
9. Promote via email newsletter
10. Track analytics

---

## 6. EMAIL MARKETING STRATEGY

### 6.1 Email Types
- **New blog post announcements**
- **New podcast episode releases**
- **Book launch campaigns**
- **Monthly newsletters**
- **Special offers/courses**

### 6.2 Email Template Structure
1. **Header**: Branding with logo/name
2. **Hero Section**: Main announcement (book/podcast/blog)
3. **Supporting Content**: 1-2 recent blog posts
4. **Supporting Content**: 1-2 recent podcast episodes
5. **Upsell**: Featured product/service
6. **Footer**: Social links, preferences, unsubscribe

### 6.3 Email Best Practices
- Mobile-responsive design
- Clear CTAs
- Personal tone
- Value-first content
- Consistent branding
- Easy unsubscribe

---

## 7. DEPLOYMENT & HOSTING

### 7.1 Vercel Deployment
- **Automatic deployments** from GitHub main branch
- **Preview deployments** for pull requests
- **Environment variables** configured in Vercel dashboard
- **Custom domain** setup
- **SSL certificate** (automatic)

### 7.2 Supabase Project
- **Production database** with backups
- **Edge functions** deployed
- **Storage buckets** for images
- **API keys** secured in environment variables
- **Row Level Security** policies enabled

### 7.3 Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_SHOW_ID=
GOOGLE_ANALYTICS_ID=
```

---

## 8. FUTURE ENHANCEMENTS (Out of Scope for V1)

### 8.1 Potential Features
- User comments on blog posts
- Social media auto-posting
- Advanced analytics (custom dashboards)
- A/B testing for email templates
- Multi-language support
- Workshops section (currently hidden)
- User accounts for saving favorites
- Push notifications
- Mobile app
- Advanced search with Algolia
- Podcast transcription automation
- AI writing assistant integration

### 8.2 Content Additions
- Video library (beyond podcast videos)
- Resource downloads (PDFs, templates)
- Community forum
- Live events/webinars
- Member-only content

---

## 9. SUCCESS METRICS

### 9.1 User Engagement
- Blog post views per month
- Podcast plays per episode
- Average time on site
- Bounce rate < 60%
- Pages per session > 2

### 9.2 Email Performance
- Open rate > 20%
- Click-through rate > 3%
- Unsubscribe rate < 1%
- List growth rate

### 9.3 Business Goals
- Book sales conversions
- Email list growth
- Podcast subscriber growth
- Social media follower growth
- Brand awareness metrics

---

## 10. MAINTENANCE & SUPPORT

### 10.1 Regular Tasks
- Weekly blog post publishing
- Podcast episode syncing
- Monthly newsletter sending
- Analytics review (monthly)
- Content backup (weekly)
- Security updates (as needed)

### 10.2 Monitoring
- Uptime monitoring (99.9% target)
- Error tracking
- Performance monitoring
- Analytics tracking
- User feedback collection

---

## NOTES FOR CURSOR MIGRATION

### Critical Implementation Details

1. **Rich Text Editor**: Uses Markdown syntax with custom toolbar. Keyboard shortcuts enabled (Ctrl+B, Ctrl+I, Ctrl+U).

2. **Spotify Sync**: Needs Edge Function implementation. Mock data provided in components.

3. **Image Handling**: Use ImageWithFallback component for new images. Protected component - do not modify.

4. **Styling**: Do NOT use Tailwind classes for font-size, font-weight, or line-height unless explicitly needed. Typography is handled by globals.css.

5. **Date Handling**: Backdate support is critical for imported content. Use publishDate field.

6. **Search**: Real-time search across multiple fields (title, content, excerpt, category, tags).

7. **Import**: Auto-detects WordPress XML or Medium JSON formats. All imports start as drafts.

8. **Email Templates**: Export as HTML ready for email platforms. JSON export for template reuse.

9. **Analytics**: Real-time dashboard with GA4. Requires Google Analytics API setup.

10. **SEO**: Every blog post and podcast episode has SEO fields (title, description, keywords).

---

## PROJECT STATUS
✅ Complete feature set ready for migration to Cursor
✅ All components built and tested
✅ Requirements documented
✅ Database schema defined
✅ Integration points identified
⏳ Pending: Supabase Edge Function for Spotify sync
⏳ Pending: Email service integration
⏳ Pending: Production deployment
