# Complete File Export List for Cursor Migration

## 📁 All Files to Copy to Cursor

### Documentation Files (Reference)
```
✅ /REQUIREMENTS.md                    - Complete requirements document
✅ /COMPONENT_MANIFEST.md              - Component manifest & migration checklist  
✅ /SUPABASE_INTEGRATION_GUIDE.md      - Supabase integration code examples
✅ /FILES_TO_EXPORT.md                 - This file
```

---

## 🎨 Styles

```
✅ /styles/globals.css                 - CRITICAL: Typography, CSS variables, Tailwind config
```

**Note:** This file contains all design tokens. Do not skip!

---

## 🧩 Core CMS Components

```
✅ /components/BlogManager.tsx         - Main CMS dashboard (contains all tabs)
✅ /components/PodcastManager.tsx      - Podcast episode management
✅ /components/EmailTemplateManager.tsx - Email template editor
✅ /components/EmailTemplate.tsx       - Email template renderer
✅ /components/AboutPageEditor.tsx     - About page content editor
✅ /components/AnalyticsDashboard.tsx  - Google Analytics dashboard
```

---

## 🎛️ UI Components (shadcn/ui)

**Directory:** `/components/ui/`

**Copy the entire folder** or individual files:

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
```

**Total UI Components:** 45 files

---

## 🔒 Protected Components (DO NOT MODIFY)

```
✅ /components/figma/ImageWithFallback.tsx
```

**Important:** Copy this file exactly as-is. Do not modify.

---

## 📊 Total File Count

- **Documentation:** 4 files
- **Styles:** 1 file  
- **Core CMS Components:** 6 files
- **UI Components:** 45 files
- **Protected Components:** 1 file

**Grand Total: 57 files**

---

## 🚀 Quick Copy Commands

If you have terminal access to the Figma Make project:

### Copy Everything at Once
```bash
# Create destination directory
mkdir -p metaforica-cursor

# Copy documentation
cp REQUIREMENTS.md metaforica-cursor/
cp COMPONENT_MANIFEST.md metaforica-cursor/
cp SUPABASE_INTEGRATION_GUIDE.md metaforica-cursor/
cp FILES_TO_EXPORT.md metaforica-cursor/

# Copy styles
mkdir -p metaforica-cursor/styles
cp styles/globals.css metaforica-cursor/styles/

# Copy components
mkdir -p metaforica-cursor/components
cp components/BlogManager.tsx metaforica-cursor/components/
cp components/PodcastManager.tsx metaforica-cursor/components/
cp components/EmailTemplateManager.tsx metaforica-cursor/components/
cp components/EmailTemplate.tsx metaforica-cursor/components/
cp components/AboutPageEditor.tsx metaforica-cursor/components/
cp components/AnalyticsDashboard.tsx metaforica-cursor/components/

# Copy UI components (entire folder)
cp -r components/ui metaforica-cursor/components/

# Copy protected components
mkdir -p metaforica-cursor/components/figma
cp components/figma/ImageWithFallback.tsx metaforica-cursor/components/figma/
```

### Or Create a Zip Archive
```bash
zip -r metaforica-components.zip \
  REQUIREMENTS.md \
  COMPONENT_MANIFEST.md \
  SUPABASE_INTEGRATION_GUIDE.md \
  FILES_TO_EXPORT.md \
  styles/globals.css \
  components/BlogManager.tsx \
  components/PodcastManager.tsx \
  components/EmailTemplateManager.tsx \
  components/EmailTemplate.tsx \
  components/AboutPageEditor.tsx \
  components/AnalyticsDashboard.tsx \
  components/ui/ \
  components/figma/ImageWithFallback.tsx
```

---

## 📝 Manual Copy Checklist

Use this checklist if copying files manually:

### Phase 1: Documentation
- [ ] REQUIREMENTS.md
- [ ] COMPONENT_MANIFEST.md
- [ ] SUPABASE_INTEGRATION_GUIDE.md
- [ ] FILES_TO_EXPORT.md

### Phase 2: Styles
- [ ] styles/globals.css

### Phase 3: Core Components
- [ ] components/BlogManager.tsx
- [ ] components/PodcastManager.tsx
- [ ] components/EmailTemplateManager.tsx
- [ ] components/EmailTemplate.tsx
- [ ] components/AboutPageEditor.tsx
- [ ] components/AnalyticsDashboard.tsx

### Phase 4: UI Components (45 files)
**Tip:** Copy the entire `/components/ui/` folder at once

- [ ] All 45 shadcn/ui component files

### Phase 5: Protected Components
- [ ] components/figma/ImageWithFallback.tsx

---

## 🔍 Verification After Copy

Run these checks in Cursor:

### 1. File Structure Check
```
your-project/
├── REQUIREMENTS.md
├── COMPONENT_MANIFEST.md
├── SUPABASE_INTEGRATION_GUIDE.md
├── FILES_TO_EXPORT.md
├── styles/
│   └── globals.css
├── components/
│   ├── BlogManager.tsx
│   ├── PodcastManager.tsx
│   ├── EmailTemplateManager.tsx
│   ├── EmailTemplate.tsx
│   ├── AboutPageEditor.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── ui/
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   └── ... (43 more files)
│   └── figma/
│       └── ImageWithFallback.tsx
```

### 2. Import Validation

Search for broken imports:
```typescript
// All these should resolve correctly:
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { BlogManager } from "./components/BlogManager"
import { PodcastManager } from "./components/PodcastManager"
```

### 3. Dependencies Check

Verify all imports exist:
```bash
# In Cursor terminal
npm install lucide-react
npm install sonner@2.0.3
npm install recharts
npm install react-hook-form@7.55.0
npm install @supabase/supabase-js
```

### 4. TypeScript Check
```bash
# Run TypeScript compiler (should have minimal errors)
npx tsc --noEmit
```

---

## ⚠️ Common Migration Issues & Solutions

### Issue 1: Import Path Errors
**Problem:** `Cannot find module './components/ui/button'`

**Solution:** Ensure all UI components are in `/components/ui/` and imports use relative paths:
```typescript
import { Button } from "./components/ui/button"  // ✅ Correct
import { Button } from "@/components/ui/button"  // ❌ Wrong (unless you set up path aliases)
```

### Issue 2: Missing Dependencies
**Problem:** `Cannot find package 'lucide-react'`

**Solution:** Install all dependencies:
```bash
npm install lucide-react sonner@2.0.3 recharts react-hook-form@7.55.0
```

### Issue 3: CSS Not Loading
**Problem:** Styling doesn't match expected design

**Solution:** Ensure `globals.css` is imported in your main entry point:
```typescript
// In App.tsx or main.tsx
import './styles/globals.css'
```

### Issue 4: Tailwind Not Working
**Problem:** Tailwind classes not applying

**Solution:** Ensure Tailwind v4.0 is configured. If using Tailwind v3, you'll need a `tailwind.config.js`:
```javascript
// tailwind.config.js (only needed for Tailwind v3)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Issue 5: Supabase Types Missing
**Problem:** TypeScript errors on Supabase queries

**Solution:** Generate types from your Supabase schema:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts
```

---

## 🎯 Post-Migration Setup Tasks

After copying all files to Cursor:

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
npm install lucide-react
npm install sonner@2.0.3
npm install recharts
npm install react-hook-form@7.55.0
npm install @tanstack/react-query  # Optional but recommended
```

### 2. Create `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-secret
SPOTIFY_SHOW_ID=your-podcast-show-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Create Supabase Client
Create `/lib/supabase.ts` (see SUPABASE_INTEGRATION_GUIDE.md)

### 4. Set Up Database
- Run SQL from COMPONENT_MANIFEST.md to create tables
- Enable RLS
- Configure policies

### 5. Create Edge Functions
- `sync-spotify-podcasts`
- `send-email` (optional)
- `get-analytics-data` (optional)

### 6. Replace Mock Data
Follow SUPABASE_INTEGRATION_GUIDE.md to replace mock data with real database calls

### 7. Test Components
- [ ] BlogManager loads and saves posts
- [ ] PodcastManager displays episodes
- [ ] Email template preview works
- [ ] About page editor functions
- [ ] Analytics dashboard displays (with mock data initially)
- [ ] Import functionality works

### 8. Build Public Pages
Create user-facing pages:
- [ ] Homepage/landing
- [ ] Blog listing page
- [ ] Blog post detail page
- [ ] Podcast listing page
- [ ] Podcast episode detail page
- [ ] About page
- [ ] Books page
- [ ] Contact modal

### 9. Deploy
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables in Vercel
- [ ] Deploy to production
- [ ] Test production build

---

## 📞 Support & Resources

### Documentation References
- **REQUIREMENTS.md** - Full feature requirements
- **COMPONENT_MANIFEST.md** - Component details & database schema
- **SUPABASE_INTEGRATION_GUIDE.md** - Code examples for Supabase

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Recharts Docs](https://recharts.org)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)

---

## ✅ Final Checklist

Before considering migration complete:

- [ ] All 57 files copied to Cursor
- [ ] All dependencies installed
- [ ] Environment variables set
- [ ] Supabase client created
- [ ] Database tables created
- [ ] At least one component rendering without errors
- [ ] TypeScript compiles with no critical errors
- [ ] Styling from globals.css is applied
- [ ] No console errors in browser
- [ ] Documentation files are accessible

---

## 🎉 Success Criteria

Migration is successful when:

1. ✅ All components render without errors
2. ✅ CMS dashboard displays with all 7 tabs
3. ✅ At least one CRUD operation works (e.g., create/edit blog post)
4. ✅ Styling matches the Metaforica brand (warm colors, organic shapes)
5. ✅ No TypeScript errors (or only minor ones you can fix)
6. ✅ You can navigate between CMS sections
7. ✅ Rich text editor toolbar functions
8. ✅ Email template preview renders

---

**Ready to migrate! 🚀**

Copy all 57 files to Cursor and follow the post-migration setup tasks above.

Good luck with your Metaforica website! If you encounter any issues, refer back to the documentation files for detailed guidance.
