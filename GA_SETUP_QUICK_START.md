# Google Analytics Data API - Quick Setup (100% FREE)

All steps below are completely free - no credit card required!

## ✅ Step 1: Get Your GA4 Property ID (2 minutes)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. In the **Property** column, click **"Property Settings"**
4. Find **"Property ID"** - it's a number like `123456789`
5. **Copy this number** - you'll need it later

**Your Property ID:** ________________ (fill this in)

---

## ✅ Step 2: Create Google Cloud Project (3 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Name: `Metaforica Analytics`
4. Click **"Create"**
5. Wait ~30 seconds for creation

**Note:** Google Cloud free tier includes this - no payment required!

---

## ✅ Step 3: Enable Analytics Data API (1 minute)

**IMPORTANT:** This step is required! The API must be enabled for the Edge Function to work.

1. In your Google Cloud project, go to **APIs & Services** → **Library**
2. Search: `Google Analytics Data API`
3. Click it → Click **"Enable"**
4. Wait 10-20 seconds

**OR** use this direct link (replace PROJECT_ID with your project ID):
- https://console.developers.google.com/apis/api/analyticsdata.googleapis.com/overview?project=388768196566

**Note:** If you just enabled it, wait a few minutes for the change to propagate before testing.

---

## ✅ Step 4: Create Service Account (2 minutes)

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in:
   - **Name:** `metaforica-analytics`
   - **Description:** `For analytics dashboard`
4. Click **"Create and Continue"**
5. Click **"Continue"** (skip role assignment)
6. Click **"Done"**

---

## ✅ Step 5: Download Service Account Key (2 minutes)

1. In **Credentials**, find your service account
2. Click the service account **email** (looks like `metaforica-analytics@...`)
3. Go to **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **JSON**
6. Click **"Create"**
7. **SAVE THE DOWNLOADED JSON FILE** - you'll need it!

**File location:** ________________ (where you saved it)

---

## ✅ Step 6: Grant Access to GA4 (2 minutes)

1. Go back to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** → **Property Access Management**
3. Click **"+"** → **"Add users"**
4. Paste your **service account email** (from the JSON file, field: `client_email`)
5. Role: **"Viewer"** (read-only)
6. Click **"Add"**

**Service Account Email:** ________________ (from JSON file)

---

## ✅ Step 7: Add Secrets to Supabase (3 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Edge Functions** → **Secrets**

### Secret 1: Service Account JSON
- **Name:** `GA_SERVICE_ACCOUNT_JSON`
- **Value:** Open the JSON file you downloaded, copy **ALL** contents, paste here
- Click **"Add Secret"**

### Secret 2: Property ID  
- **Name:** `GA_PROPERTY_ID`
- **Value:** Your Property ID from Step 1 (just the number, e.g., `123456789`)
- Click **"Add Secret"**

---

## ✅ Step 8: Deploy Edge Function (2 minutes)

The function code is already ready! Just need to deploy:

### Option A: Via Supabase Dashboard
1. Go to **Edge Functions** in Supabase
2. Click **"Create a new function"**
3. Name: `fetch-ga-analytics`
4. Copy code from: `supabase/functions/fetch-ga-analytics/index.ts`
5. Paste and click **"Deploy"**

### Option B: Via CLI (if you have Supabase CLI)
```bash
cd /Users/kevoo/Cursor/Metaforica
supabase functions deploy fetch-ga-analytics
```

---

## ✅ Step 9: Test It!

1. Go to your CMS → **Analytics** tab
2. Click the **refresh button** (circular arrow icon)
3. You should see real data! 🎉

---

## 💰 Cost: $0.00

- Google Cloud free tier: ✅ Free
- Google Analytics Data API: ✅ Free  
- Supabase Edge Functions: ✅ Free tier includes this
- **Total cost: $0**

---

## 🆘 Need Help?

If you get stuck at any step, let me know which step and what error you're seeing!




