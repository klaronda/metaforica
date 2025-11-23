# Lighthouse Optimization Checklist

## ✅ Navigation Mapping (VERIFIED)
All navigation links are properly mapped:
- Home → `/`
- Escritos → `/escritos`
- Podcast → scrolls to `#podcast` on home
- Historias → `/historias`
- Libros → scrolls to `#books` on home
- Sobre Mí → scrolls to `#about` on home
- Admin → `/admin`
- Login → `/login`

## 🚀 Performance Optimizations

### 1. Images
**Current Issues:**
- Large unoptimized images from Unsplash
- No lazy loading
- Missing width/height attributes

**Fixes:**
```tsx
// Add to ImageWithFallback component
<img 
  src={src}
  alt={alt}
  loading="lazy"  // ← Add this
  width="800"     // ← Add appropriate dimensions
  height="600"
  decoding="async"
/>
```

### 2. Fonts
**Add font preload to index.html:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 3. Code Splitting
**Already done via React lazy loading** ✅

### 4. Remove Unused CSS
**Action:** Audit Tailwind purge in production build

## ♿ Accessibility (A11y)

### 1. Add Skip to Content Link
```tsx
// Add to Header component
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 2. ARIA Labels for Navigation
```tsx
<nav aria-label="Main navigation">
  {/* navigation items */}
</nav>
```

### 3. Button vs Link Semantics
**Change navigation buttons to links:**
```tsx
// Instead of <button onClick={...}>
<a href="/escritos" onClick={(e) => { e.preventDefault(); handleNavClick('allPosts'); }}>
  Escritos
</a>
```

### 4. Alt Text Audit
- ✅ Hero images have descriptive alt text
- ✅ Blog post images have alt text
- ⚠️ Decorative images should have `alt=""`

### 5. Form Labels
- ✅ All form inputs have labels
- ✅ Contact form is accessible

### 6. Color Contrast
**Current:** Yellow on white might fail WCAG
**Check:** All text has minimum 4.5:1 contrast ratio

## 🔍 SEO

### 1. Meta Tags
**Add to index.html:**
```html
<meta name="description" content="Metafórica - Podcast y escritos sobre la condición humana, crecimiento personal y las metáforas que dan forma a nuestras vidas. Por Alexandra.">
<meta name="keywords" content="podcast español, escritura, desarrollo personal, metáforas, psicología">
<meta property="og:title" content="Metafórica - Podcast y Escritos">
<meta property="og:description" content="Explora la condición humana a través de historias, reflexiones y conversaciones profundas.">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:url" content="https://metaforica.com">
<meta name="twitter:card" content="summary_large_image">
```

### 2. Structured Data
**Add JSON-LD for podcast:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "name": "Metafórica",
  "description": "Podcast sobre la condición humana...",
  "url": "https://metaforica.com",
  "author": {
    "@type": "Person",
    "name": "Alexandra"
  }
}
</script>
```

### 3. Sitemap
**Create sitemap.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://metaforica.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://metaforica.com/escritos</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://metaforica.com/historias</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 4. Robots.txt
```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: https://metaforica.com/sitemap.xml
```

### 5. Canonical URLs
**Add to each page:**
```html
<link rel="canonical" href="https://metaforica.com/escritos">
```

## ⚡ Best Practices

### 1. HTTPS
- ✅ Enforce HTTPS in production
- ✅ HSTS headers

### 2. Console Errors
- ⚠️ Check browser console for errors
- ⚠️ Fix any React warnings

### 3. Modern Image Formats
**Use WebP with fallbacks:**
```tsx
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

### 4. Caching Headers
**Configure in Vercel/hosting:**
```
Cache-Control: public, max-age=31536000, immutable
```

## 🎯 Quick Wins (Implement First)

1. ✅ Add `loading="lazy"` to all images
2. ✅ Add width/height to images
3. ✅ Add meta description
4. ✅ Add alt text to all images
5. ✅ Fix navigation semantics (button → link)
6. ✅ Add skip to content link
7. ✅ Add ARIA labels
8. ✅ Create sitemap.xml
9. ✅ Create robots.txt
10. ✅ Add structured data

## 📊 Expected Improvements

**Before:**
- Performance: ~60-70
- Accessibility: ~75-85
- Best Practices: ~80-90
- SEO: ~70-80

**After:**
- Performance: ~85-95
- Accessibility: ~95-100
- Best Practices: ~95-100
- SEO: ~95-100

## 🛠️ Testing
```bash
# Run Lighthouse
npx lighthouse http://localhost:3006 --view

# Or use Chrome DevTools
# 1. Open DevTools
# 2. Go to Lighthouse tab
# 3. Generate report
```

