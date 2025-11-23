# 📦 Complete Export Checklist for Cursor Migration

## 🎯 Executive Summary

**Total Files to Export: 80+ files**

This checklist includes ALL files from the Figma Make project, including:
- 5 Documentation files
- 1 Stylesheet
- 17 Main components (including public-facing pages)
- 6 CMS manager components  
- 47 shadcn/ui components
- 2 Protected components
- 2 Utility files

---

## 📚 Documentation Files (5 files)

**Priority: HIGH** - Read these first!

```
✅ /REQUIREMENTS.md                    - Complete requirements (end-user & CMS)
✅ /COMPONENT_MANIFEST.md              - Component architecture & database schema
✅ /SUPABASE_INTEGRATION_GUIDE.md      - Supabase integration code examples
✅ /MIGRATION_SUMMARY.md               - High-level migration overview
✅ /FILES_TO_EXPORT.md                 - Original export checklist
```

**Bonus (if exists):**
```
□ /ANALYTICS_SETUP_GUIDE.md            - Google Analytics setup
□ /guidelines/Guidelines.md            - Additional guidelines
□ /Attributions.md                     - Third-party attributions
```

---

## 🎨 Styles (1 file)

**Priority: CRITICAL** - Must have!

```
✅ /styles/globals.css                 - Typography tokens, CSS variables, design system
```

---

## 🌐 Public-Facing Components (11 files)

**Priority: HIGH** - User-facing website

```
✅ /components/Hero.tsx                - Homepage hero section
✅ /components/Header.tsx              - Main navigation header
✅ /components/Footer.tsx              - Site footer with social links
✅ /components/BlogSection.tsx         - Blog section on homepage
✅ /components/BlogPost.tsx            - Individual blog post page
✅ /components/AllBlogPosts.tsx        - Blog listing page
✅ /components/PodcastSection.tsx      - Podcast section on homepage
✅ /components/AllPodcasts.tsx         - Podcast listing page
✅ /components/AboutSection.tsx        - About section (renders from DB)
✅ /components/BooksSection.tsx        - Books showcase section
✅ /components/WorkshopsSection.tsx    - Workshops section (hidden for now)
```

---

## 🔐 Authentication & Utilities (4 files)

**Priority: HIGH** - Required for CMS access

```
✅ /components/AdminLogin.tsx          - Discrete CMS login
✅ /components/ContactModal.tsx        - Contact form modal
✅ /components/EmailPreferences.tsx    - Newsletter preferences management
✅ /components/GoogleAnalytics.tsx     - GA4 tracking component
```

---

## 🎛️ CMS Manager Components (6 files)

**Priority: CRITICAL** - The heart of the CMS

```
✅ /components/BlogManager.tsx         - Main CMS dashboard (all tabs)
✅ /components/PodcastManager.tsx      - Podcast episode management
✅ /components/EmailTemplateManager.tsx - Email marketing template editor
✅ /components/EmailTemplate.tsx       - Email template renderer
✅ /components/AboutPageEditor.tsx     - About page content editor
✅ /components/AnalyticsDashboard.tsx  - Google Analytics dashboard
```

---

## 🧩 shadcn/ui Components (47 files)

**Priority: CRITICAL** - UI component library

**Directory:** `/components/ui/`

**Recommendation:** Copy the entire `/components/ui/` folder

```
✅ /components/ui/accordion.tsx
✅ /components/ui/alert-dialog.tsx
✅ /components/ui/alert.tsx
✅ /components/ui/aspect-ratio.tsx
✅ /components/ui/avatar.tsx
✅ /components/ui/badge.tsx
✅ /components/ui/breadcrumb.tsx
✅ /components/ui/button.tsx
✅ /components/ui/calendar.tsx
✅ /components/ui/card.tsx
✅ /components/ui/carousel.tsx
✅ /components/ui/chart.tsx
✅ /components/ui/checkbox.tsx
✅ /components/ui/collapsible.tsx
✅ /components/ui/command.tsx
✅ /components/ui/context-menu.tsx
✅ /components/ui/dialog.tsx
✅ /components/ui/drawer.tsx
✅ /components/ui/dropdown-menu.tsx
✅ /components/ui/form.tsx
✅ /components/ui/hover-card.tsx
✅ /components/ui/input-otp.tsx
✅ /components/ui/input.tsx
✅ /components/ui/label.tsx
✅ /components/ui/menubar.tsx
✅ /components/ui/navigation-menu.tsx
✅ /components/ui/pagination.tsx
✅ /components/ui/popover.tsx
✅ /components/ui/progress.tsx
✅ /components/ui/radio-group.tsx
✅ /components/ui/resizable.tsx
✅ /components/ui/scroll-area.tsx
✅ /components/ui/select.tsx
✅ /components/ui/separator.tsx
✅ /components/ui/sheet.tsx
✅ /components/ui/sidebar.tsx
✅ /components/ui/skeleton.tsx
✅ /components/ui/slider.tsx
✅ /components/ui/sonner.tsx
✅ /components/ui/switch.tsx
✅ /components/ui/table.tsx
✅ /components/ui/tabs.tsx
✅ /components/ui/textarea.tsx
✅ /components/ui/toggle-group.tsx
✅ /components/ui/toggle.tsx
✅ /components/ui/tooltip.tsx
✅ /components/ui/use-mobile.ts        - Mobile detection hook
✅ /components/ui/utils.ts             - Utility functions (cn helper, etc.)
```

---

## 🔒 Protected Components (1 file)

**Priority: CRITICAL** - DO NOT MODIFY

```
✅ /components/figma/ImageWithFallback.tsx  - Protected image component
```

**⚠️ WARNING:** This is a system file. Copy exactly as-is. Do not edit.

---

## 📱 Main Application (1 file)

**Priority: CRITICAL** - Entry point

```
✅ /App.tsx                            - Main application component
```

**Note:** This file may need updates to include your public-facing pages and routing.

---

## 📊 Complete File Count

| Category | Count |
|----------|-------|
| Documentation | 5-8 files |
| Styles | 1 file |
| Public Components | 11 files |
| Auth & Utilities | 4 files |
| CMS Managers | 6 files |
| shadcn/ui Components | 47 files |
| Protected Components | 1 file |
| Main App | 1 file |
| **TOTAL** | **76-79 files** |

---

## 🚀 Quick Copy Commands

### Option 1: Copy Everything
```bash
# Create project directory
mkdir metaforica-cursor
cd metaforica-cursor

# Copy all documentation
cp ../figma-make-project/*.md .

# Copy styles
mkdir -p styles
cp ../figma-make-project/styles/globals.css styles/

# Copy all components
mkdir -p components
cp ../figma-make-project/components/*.tsx components/

# Copy UI components folder
cp -r ../figma-make-project/components/ui components/

# Copy protected components
mkdir -p components/figma
cp ../figma-make-project/components/figma/ImageWithFallback.tsx components/figma/

# Copy main app
cp ../figma-make-project/App.tsx .
```

### Option 2: Create Zip Archive
```bash
# From the Figma Make project root
zip -r metaforica-complete.zip \
  *.md \
  App.tsx \
  styles/ \
  components/ \
  -x "*/node_modules/*" "*/dist/*" "*/.git/*"
```

---

## ✅ Verification Checklist

After copying, verify your Cursor project has:

### File Structure
```
your-project/
├── REQUIREMENTS.md
├── COMPONENT_MANIFEST.md
├── SUPABASE_INTEGRATION_GUIDE.md
├── MIGRATION_SUMMARY.md
├── FILES_TO_EXPORT.md
├── App.tsx
├── styles/
│   └── globals.css
├── components/
│   ├── Hero.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlogSection.tsx
│   ├── BlogPost.tsx
│   ├── AllBlogPosts.tsx
│   ├── PodcastSection.tsx
│   ├── AllPodcasts.tsx
│   ├── AboutSection.tsx
│   ├── BooksSection.tsx
│   ├── WorkshopsSection.tsx
│   ├── AdminLogin.tsx
│   ├── ContactModal.tsx
│   ├── EmailPreferences.tsx
│   ├── GoogleAnalytics.tsx
│   ├── BlogManager.tsx
│   ├── PodcastManager.tsx
│   ├── EmailTemplateManager.tsx
│   ├── EmailTemplate.tsx
│   ├── AboutPageEditor.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── ... (45 more files)
│   │   ├── use-mobile.ts
│   │   └── utils.ts
│   └── figma/
│       └── ImageWithFallback.tsx
```

### Quick Tests
```bash
# 1. Check file count in components/
ls components/*.tsx | wc -l
# Should be: 17 files

# 2. Check file count in components/ui/
ls components/ui/* | wc -l
# Should be: 47 files

# 3. Check documentation files
ls *.md | wc -l
# Should be: 5-8 files

# 4. Verify globals.css exists
cat styles/globals.css | head -n 5
# Should show CSS content
```

---

## 🔧 Post-Copy Setup

### 1. Install Dependencies
```bash
npm install
npm install @supabase/supabase-js
npm install lucide-react
npm install sonner@2.0.3
npm install recharts
npm install react-hook-form@7.55.0
```

### 2. Create Environment File
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

### 3. Create Supabase Client
Create `/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### 4. Set Up Database
Run SQL from COMPONENT_MANIFEST.md to create:
- blog_posts table
- podcast_episodes table
- about_page_content table
- email_subscribers table
- contact_messages table

### 5. Test Components
```bash
npm run dev
# Navigate to localhost:3000 to test
```

---

## 🎯 Component Usage Guide

### Public Website Pages

**Homepage (`/`):**
```tsx
import { Hero } from './components/Hero'
import { BlogSection } from './components/BlogSection'
import { PodcastSection } from './components/PodcastSection'
import { AboutSection } from './components/AboutSection'
import { BooksSection } from './components/BooksSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BlogSection />
      <PodcastSection />
      <AboutSection />
      <BooksSection />
    </>
  )
}
```

**Blog Page (`/blog`):**
```tsx
import { AllBlogPosts } from './components/AllBlogPosts'

export default function BlogPage() {
  return <AllBlogPosts />
}
```

**Blog Post Page (`/blog/[slug]`):**
```tsx
import { BlogPost } from './components/BlogPost'

export default function BlogPostPage({ params }) {
  return <BlogPost slug={params.slug} />
}
```

**Podcast Page (`/podcast`):**
```tsx
import { AllPodcasts } from './components/AllPodcasts'

export default function PodcastPage() {
  return <AllPodcasts />
}
```

**CMS Page (`/cms` - protected route):**
```tsx
import { BlogManager } from './components/BlogManager'
import { AdminLogin } from './components/AdminLogin'

export default function CMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
  }
  
  return <BlogManager />
}
```

---

## 🎨 Customization Points

### Easily Customizable:
1. **Colors** - Edit CSS variables in `globals.css`
2. **Typography** - Edit font definitions in `globals.css`
3. **Hero Content** - Edit `Hero.tsx`
4. **Footer Links** - Edit `Footer.tsx`
5. **Navigation Items** - Edit `Header.tsx`

### Advanced Customization:
1. **Component Layouts** - Modify individual component files
2. **CMS Tabs** - Add/remove tabs in `BlogManager.tsx`
3. **Email Templates** - Customize `EmailTemplate.tsx`
4. **Database Schema** - Add fields to Supabase tables

---

## ⚠️ Common Pitfalls

### Pitfall 1: Missing UI Components
**Symptom:** Import errors for Button, Card, etc.  
**Solution:** Ensure entire `/components/ui/` folder is copied

### Pitfall 2: Styling Doesn't Match
**Symptom:** Site looks plain or unstyled  
**Solution:** Verify `globals.css` is imported in main entry point

### Pitfall 3: TypeScript Errors
**Symptom:** Lots of red squiggly lines  
**Solution:** Install all dependencies, especially `@types/` packages

### Pitfall 4: Components Import Wrong Paths
**Symptom:** Cannot find module errors  
**Solution:** Update import paths to match your project structure

### Pitfall 5: Supabase Undefined
**Symptom:** "Cannot read property 'from' of undefined"  
**Solution:** Create `/lib/supabase.ts` and export initialized client

---

## 🧪 Testing Strategy

### Phase 1: Component Rendering
- [ ] Each component renders without errors
- [ ] No console errors on page load
- [ ] Styling looks correct

### Phase 2: Static Content
- [ ] Hero section displays
- [ ] Navigation works
- [ ] Footer displays
- [ ] All pages accessible

### Phase 3: Database Integration
- [ ] Can fetch blog posts from Supabase
- [ ] Can create new blog post
- [ ] Can edit existing blog post
- [ ] Can delete blog post

### Phase 4: CMS Features
- [ ] Login to CMS works
- [ ] All 7 tabs display
- [ ] Rich text editor functions
- [ ] Search works
- [ ] Import works
- [ ] Email template preview works

### Phase 5: Integrations
- [ ] Spotify sync works (with Edge Function)
- [ ] Analytics dashboard displays data
- [ ] Contact form submits
- [ ] Newsletter signup works

---

## 📦 Deployment Checklist

Before deploying to Vercel:

- [ ] All components working locally
- [ ] Environment variables set
- [ ] Database tables created
- [ ] Edge Functions deployed
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Responsive design tested
- [ ] SEO meta tags added
- [ ] Analytics tracking works
- [ ] Contact form tested

---

## 🎓 Next Steps After Migration

1. **Test Everything** - Go through each feature
2. **Customize Branding** - Update colors, fonts, imagery
3. **Add Content** - Import existing blog posts/podcasts
4. **Set Up Email** - Configure email service for newsletters
5. **Deploy to Vercel** - Get live on the internet
6. **Train Content Manager** - Show your wife how to use CMS
7. **Monitor Analytics** - Track traffic and engagement
8. **Iterate & Improve** - Add features based on usage

---

## 🆘 Need Help?

### Documentation Files:
- **REQUIREMENTS.md** - What each feature does
- **COMPONENT_MANIFEST.md** - Technical architecture
- **SUPABASE_INTEGRATION_GUIDE.md** - Database connection
- **MIGRATION_SUMMARY.md** - High-level overview

### External Resources:
- Supabase: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com
- React: https://react.dev

---

## ✨ Success Criteria

Migration is complete when:

1. ✅ All 76+ files copied successfully
2. ✅ CMS dashboard renders with all tabs
3. ✅ Can create/edit blog posts
4. ✅ Can view/manage podcast episodes
5. ✅ Email template preview works
6. ✅ Public pages display content
7. ✅ Styling matches Metaforica brand
8. ✅ Database connected and queries work
9. ✅ No critical errors in console
10. ✅ Deployed to Vercel successfully

---

**You're ready to migrate! 🚀**

This is a complete, production-ready system. Follow this checklist step by step, and you'll have the Metaforica website live in no time.

**Good luck! 🎉**
