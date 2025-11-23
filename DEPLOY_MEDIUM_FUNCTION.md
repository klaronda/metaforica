# Deploy Medium Import Edge Function

The Medium import feature requires deploying the `import-medium-post` Edge Function to Supabase.

## Option 1: Deploy via Supabase Dashboard (Easiest - 2 minutes)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/fdfchoshzouwguvxfnuv/functions

2. **Create New Function**
   - Click "Create a new function" or "New function"
   - Name: `import-medium-post`
   - Click "Create function"

3. **Paste the Code**
   - Open: `/Users/kevoo/Cursor/Metaforica/supabase/functions/import-medium-post/index.ts`
   - Copy all the code
   - Paste it into the Supabase function editor
   - Click "Deploy"

4. **Test It**
   - Go back to your CMS
   - Hard refresh (Cmd+Shift+R)
   - Try importing a Medium post

---

## Option 2: Deploy via CLI (If you prefer command line)

### Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

### Login to Supabase
```bash
supabase login
```

### Link your project
```bash
cd /Users/kevoo/Cursor/Metaforica
supabase link --project-ref fdfchoshzouwguvxfnuv
```

### Deploy the function
```bash
supabase functions deploy import-medium-post
```

---

## Troubleshooting

### CORS Errors
If you see CORS errors after deploying, the function needs to handle OPTIONS requests. The code already includes this, so just make sure you deployed the latest version.

### "Function not found" Error
Wait 30 seconds after deploying, then try again. Sometimes there's a delay.

### Medium Post Not Parsing
Some Medium posts have Cloudflare protection. If a specific post fails:
1. Try a different Medium post first to verify the function works
2. If other posts work, that specific post may require manual import

---

## Test URLs

Try these public Medium posts to test:
- https://medium.com/@yourprofile/any-public-post
- Make sure the post is published and publicly accessible
- The URL should include the full path, not just the domain

---

## What Gets Imported

✅ Title  
✅ Content (formatted HTML)  
✅ Excerpt  
✅ Featured image  
✅ Tags  
✅ Publish date (original Medium date)  
✅ Read time  
✅ Author  

The post will automatically appear in your Posts tab, sorted by its original Medium publish date.

