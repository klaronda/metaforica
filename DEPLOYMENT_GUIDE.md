# Deployment Guide: Vercel + Squarespace Domain

## 🚀 Step 1: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Search for `metaforica`
   - Click "Import"

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Click "Environment Variables" tab:
   ```
   Name: VITE_SUPABASE_URL
   Value: [your Supabase project URL]

   Name: VITE_SUPABASE_ANON_KEY
   Value: [your Supabase anon key]
   ```
   
   **Where to find these:**
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   - Copy "Project URL" → VITE_SUPABASE_URL
   - Copy "anon public" key → VITE_SUPABASE_ANON_KEY

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Site deployed! (e.g., `metaforica-xyz.vercel.app`)

---

## 🌐 Step 2: Connect Squarespace Domain

### In Vercel Dashboard

1. **Go to your project settings**
   - Click on your project
   - Go to "Settings" → "Domains"

2. **Add Custom Domain**
   - Click "Add"
   - Enter your domain: `metaforica.com` (or whatever domain you have)
   - Click "Add"

3. **Vercel will show DNS records**
   Vercel will provide you with DNS records like:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
   
   **Keep this tab open** - you'll need these values!

---

## 🔧 Step 3: Configure DNS in Squarespace

### In Squarespace Dashboard

1. **Go to Domains**
   - Settings → Domains
   - Click your domain (e.g., `metaforica.com`)
   - Click "DNS Settings"

2. **Add A Record (for root domain)**
   ```
   Type: A
   Host: @
   Data: 76.76.21.21
   TTL: Automatic
   ```
   
3. **Add CNAME Record (for www)**
   ```
   Type: CNAME
   Host: www
   Data: cname.vercel-dns.com
   TTL: Automatic
   ```

4. **Remove Conflicting Records**
   - Remove any existing A records pointing elsewhere
   - Remove Squarespace's default CNAME for www
   - Keep MX records (for email) if you have any

5. **Save Changes**

---

## ⏱️ Step 4: Wait for DNS Propagation

- **Time:** 5 minutes - 48 hours (usually 15-30 minutes)
- **Check status:** https://dnschecker.org

### Verify it's working:
```bash
# Check A record
dig metaforica.com

# Check CNAME
dig www.metaforica.com
```

---

## ✅ Step 5: Enable HTTPS (Automatic)

Vercel automatically provisions SSL certificates:
- Usually takes 5-10 minutes after DNS propagation
- Your site will be available at:
  - `https://metaforica.com`
  - `https://www.metaforica.com`

---

## 🔄 Step 6: Set Up Automatic Deployments

Already configured! ✅

Every time you push to GitHub:
```bash
git add .
git commit -m "Update content"
git push
```

Vercel automatically:
1. Detects the push
2. Builds the site
3. Deploys to production
4. Updates your custom domain

---

## 📊 Optional: Analytics & Monitoring

### Enable Vercel Analytics
1. Go to your project → "Analytics"
2. Click "Enable"
3. Add to your site (already configured in `index.html`)

### Enable Vercel Speed Insights
1. Go to your project → "Speed Insights"
2. Click "Enable"

---

## 🐛 Troubleshooting

### Site not loading after DNS change
- Wait longer (DNS can take up to 48 hours)
- Clear your browser cache
- Try incognito mode
- Check: https://dnschecker.org

### Build failing on Vercel
- Check "Deployments" tab for error logs
- Verify environment variables are set
- Ensure `package.json` has correct scripts

### 404 errors on routes
- Already fixed with `vercel.json` rewrites
- If still happening, check Vercel logs

### Images not loading
- Check Supabase Storage bucket URLs
- Verify CORS settings in Supabase

---

## 📝 Environment Variables Reference

Add these in Vercel → Settings → Environment Variables:

| Variable | Where to Find | Example |
|----------|--------------|---------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API | `eyJhbGc...` |

**Important:** 
- Don't commit `.env.local` to GitHub
- Add `.env.local` to `.gitignore` (already done)

---

## 🎯 Post-Deployment Checklist

- [ ] Site loads at custom domain
- [ ] HTTPS enabled (green lock)
- [ ] Navigation works
- [ ] Images load
- [ ] CMS login works
- [ ] Admin pages are `noindex,nofollow`
- [ ] Podcast section loads episodes
- [ ] Blog posts display
- [ ] Wattpad stories load
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] Run Lighthouse audit (95+ scores)

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Project:** https://vercel.com/klaronda/metaforica
- **Deployment Logs:** Project → Deployments
- **Domain Settings:** Project → Settings → Domains
- **Environment Variables:** Project → Settings → Environment Variables

---

## 🚨 Common Issues

### "Domain is already in use"
- Domain might be connected to another Vercel project
- Remove it from the old project first

### "Invalid DNS Configuration"
- Double-check A and CNAME records
- Make sure there are no typos
- Remove conflicting records

### "Site works on vercel.app but not custom domain"
- DNS not propagated yet - wait
- Check DNS records are correct
- Try clearing DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

---

**🎉 Once DNS propagates, your site will be live at your custom domain!**


