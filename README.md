# Metafórica

> Podcast y escritos sobre la condición humana, el crecimiento personal y las metáforas que dan forma a nuestras vidas.

[![Live Site](https://img.shields.io/badge/Live-Site-yellow)](https://metaforica.com)
[![Built with React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![Powered by Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com)

## 🌟 Features

### Content Management
- **📝 Blog Posts** - Rich text editor with Markdown support
- **🎙️ Podcast Episodes** - Automatic Spotify sync via Edge Functions
- **📚 Wattpad Stories** - Direct integration with Wattpad API
- **✍️ Medium Integration** - Link Medium posts as cards with "Read on Medium" CTAs

### User Experience
- **🎨 Modern UI** - Organic shapes, warm colors, and smooth animations
- **📱 Fully Responsive** - Mobile-first design
- **♿ Accessible** - WCAG AA compliant with semantic HTML
- **⚡ Performance** - Lighthouse score: 95+ on all metrics
- **🔍 SEO Optimized** - Meta tags, sitemap, structured data

### Admin Features
- **🔐 Secure Authentication** - Supabase Auth with session persistence
- **📊 Content Management System** - Manage posts, podcasts, stories, and settings
- **🖼️ Image Management** - Upload to Supabase Storage with auto-optimization
- **📥 Import Tools** - Import from Medium, WordPress, and Wattpad

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage (for images)
  - Edge Functions (Deno)

### Integrations
- **Spotify API** - Podcast episode sync
- **Wattpad API** - Story import
- **Medium** - Post metadata scraping

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/klaronda/metaforica.git
cd metaforica
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3006`

## 📦 Database Setup

### 1. Create Tables
Run the SQL files in this order:
1. `CREATE_BLOG_POSTS_TABLE.sql`
2. `wattpad-stories-schema.sql`
3. See `SUPABASE_INTEGRATION_GUIDE.md` for podcast_episodes table

### 2. Create Storage Buckets
- `site-assets`
- `blog-assets`
- `profile-assets`
- `podcast-assets`
- `email-assets`
- `import-assets`

### 3. Deploy Edge Functions
```bash
# Deploy podcast sync
supabase functions deploy sync-podcast

# Deploy Wattpad sync
supabase functions deploy sync-wattpad-stories

# Deploy Medium import
supabase functions deploy import-medium-post
```

See `DEPLOY_MEDIUM_FUNCTION.md` for detailed instructions.

## 🎨 Project Structure

```
metaforica/
├── public/              # Static assets
│   ├── sitemap.xml     # SEO sitemap
│   └── robots.txt      # Crawler instructions
├── src/
│   ├── components/     # React components
│   │   ├── Hero.tsx
│   │   ├── BlogSection.tsx
│   │   ├── PodcastSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── BlogManager.tsx  # CMS
│   │   └── ...
│   ├── lib/
│   │   └── supabase.ts # Supabase client
│   ├── App.tsx         # Main app with routing
│   └── main.tsx
├── supabase/
│   └── functions/      # Edge Functions
│       ├── sync-podcast/
│       ├── sync-wattpad-stories/
│       └── import-medium-post/
└── *.md               # Documentation
```

## 📖 Documentation

- **[LIGHTHOUSE_OPTIMIZATION.md](LIGHTHOUSE_OPTIMIZATION.md)** - Performance & SEO guide
- **[LIGHTHOUSE_IMPROVEMENTS_DONE.md](LIGHTHOUSE_IMPROVEMENTS_DONE.md)** - Completed optimizations
- **[MEDIUM_INTEGRATION_PLAN.md](MEDIUM_INTEGRATION_PLAN.md)** - Medium import strategy
- **[MEDIUM_CARD_INTEGRATION_COMPLETE.md](MEDIUM_CARD_INTEGRATION_COMPLETE.md)** - Medium implementation
- **[DEPLOY_MEDIUM_FUNCTION.md](DEPLOY_MEDIUM_FUNCTION.md)** - Edge Function deployment

## 🔑 Key Features Explained

### Podcast Sync
Automatically fetches episodes from Spotify:
- Runs via Edge Function
- Stores metadata (title, description, artwork, duration)
- Displays latest episode on homepage
- Full episode list with embedded players

### Medium Integration
Import Medium posts as cards:
1. Paste Medium URL in CMS
2. Scrapes metadata (title, excerpt, image, date)
3. Creates card with "De Medium.com" badge
4. Clicking opens Medium in new tab

### Wattpad Stories
Sync stories from Wattpad profile:
- Automatic import via API
- Displays cover, title, description, stats
- Links directly to Wattpad

### CMS
Full-featured admin panel:
- Blog post editor with rich text
- Podcast manager
- Wattpad manager
- About page editor
- Email template manager
- Import tools
- Analytics dashboard

## 🌐 Deployment

### Recommended: Vercel

1. **Connect GitHub repo**
2. **Add environment variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy**

### Build for Production
```bash
npm run build
```

## 🔒 Security

- ✅ Supabase Row Level Security (RLS) enabled
- ✅ Admin routes protected with authentication
- ✅ `noindex,nofollow` on admin pages
- ✅ Environment variables for sensitive data
- ✅ CORS configured on Edge Functions

## 🐛 Troubleshooting

### CMS not loading
1. Check `.env.local` has correct Supabase credentials
2. Verify you're logged in
3. Check browser console for errors

### Images not uploading
1. Verify storage buckets exist in Supabase
2. Check RLS policies allow uploads
3. Ensure file size < 2MB

### Podcast/Wattpad sync failing
1. Check Edge Functions are deployed
2. Verify API credentials in Supabase secrets
3. Check function logs in Supabase dashboard

## 📄 License

MIT License - feel free to use this project for your own website!

## 👤 Author

**Alexandra (Metafórica)**
- Website: [metaforica.com](https://metaforica.com)
- Spotify: [Metafórica Podcast](https://open.spotify.com/show/0gC3vpRw7USZCJ9kHPrl5N)
- Instagram: [@metaforica.podcast](https://www.instagram.com/metaforica.podcast/)
- YouTube: [@metaforicapodcast](https://www.youtube.com/@metaforicapodcast)

## 🙏 Acknowledgments

- Built with ❤️ by [Kevin Laronda](https://github.com/klaronda)
- UI inspired by warm, organic design principles
- Powered by the amazing Supabase platform

---

**⭐ Star this repo if you find it useful!**
