# Google Analytics Data API Setup Guide

This guide will help you connect the Google Analytics Data API to display real-time analytics data in your CMS dashboard.

## Prerequisites

- Google Analytics 4 property set up
- Google Cloud Platform account
- Access to your GA4 property

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it: `Metaforica Analytics` (or any name)
4. Click "Create"
5. Wait for project creation (30 seconds)

## Step 2: Enable Google Analytics Data API

1. In your Google Cloud project, go to **APIs & Services** → **Library**
2. Search for: `Google Analytics Data API`
3. Click on it and click **"Enable"**
4. Wait for it to enable (10-20 seconds)

## Step 3: Create a Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"Service Account"**
3. Fill in:
   - **Service account name:** `metaforica-analytics`
   - **Service account ID:** (auto-generated)
   - **Description:** `Service account for Metaforica analytics dashboard`
4. Click **"Create and Continue"**
5. Skip "Grant this service account access to project" (click **Continue**)
6. Skip "Grant users access" (click **Done**)

## Step 4: Create and Download Service Account Key

1. In **Credentials** page, find your service account
2. Click on the service account email
3. Go to **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **JSON** format
6. Click **"Create"**
7. **IMPORTANT:** The JSON file will download automatically - **SAVE THIS FILE SECURELY**

The JSON file looks like:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "metaforica-analytics@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

## Step 5: Grant Service Account Access to GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. In the **Property** column, click **"Property Access Management"**
4. Click **"+"** → **"Add users"**
5. Enter your service account email (from the JSON file: `client_email`)
6. Select role: **"Viewer"** (read-only access)
7. Click **"Add"**

## Step 6: Get Your GA4 Property ID

1. In Google Analytics, go to **Admin**
2. In the **Property** column, click **"Property Settings"**
3. Find **"Property ID"** (looks like: `123456789`)
4. **Copy this number** - you'll need it

## Step 7: Add Secrets to Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Edge Functions** → **Secrets**
4. Add these secrets:

### Secret 1: Service Account JSON
- **Name:** `GA_SERVICE_ACCOUNT_JSON`
- **Value:** Paste the **entire contents** of the JSON file you downloaded
- Click **"Add Secret"**

### Secret 2: Property ID
- **Name:** `GA_PROPERTY_ID`
- **Value:** Your GA4 Property ID (e.g., `123456789`)
- Click **"Add Secret"**

## Step 8: Deploy the Edge Function

### Option A: Via Supabase Dashboard (Easiest)

1. Go to **Edge Functions** in Supabase Dashboard
2. Click **"Create a new function"**
3. Name it: `fetch-ga-analytics`
4. Copy the code from: `/Users/kevoo/Cursor/Metaforica/supabase/functions/fetch-ga-analytics/index.ts`
5. Paste into the editor
6. Click **"Deploy"**

### Option B: Via CLI

```bash
cd /Users/kevoo/Cursor/Metaforica
supabase functions deploy fetch-ga-analytics
```

## Step 9: Test the Integration

1. Go to your CMS → **Analytics** tab
2. Click the **refresh button** (circular arrow icon)
3. You should see real analytics data appear!

## Troubleshooting

### "GA_SERVICE_ACCOUNT_JSON not configured"
- Make sure you added the secret in Supabase
- The value should be the entire JSON file contents (as a string)

### "GA_PROPERTY_ID not configured"
- Make sure you added the Property ID secret
- It should be just the number (e.g., `123456789`), not a URL

### "Token exchange failed"
- Check that the service account has access to your GA4 property
- Verify the JSON file is correct and not corrupted
- Make sure the Google Analytics Data API is enabled

### "GA API error: 403"
- Service account doesn't have access to the GA4 property
- Go back to Step 5 and grant access

### "GA API error: 404"
- Property ID is incorrect
- Double-check the Property ID in GA4 Admin → Property Settings

## What Data is Fetched

The dashboard displays:
- **Active Users** - Unique visitors in the last 30 days
- **Page Views** - Total page views in the last 30 days
- **Average Session Duration** - Average time visitors spend on your site
- **Bounce Rate** - Percentage of single-page sessions

## Next Steps

- The dashboard auto-refreshes when you click the refresh button
- Data is fetched from the last 30 days by default
- You can extend this to fetch more detailed reports (top pages, locations, devices) by updating the Edge Function

## Security Notes

- Service account credentials are stored securely in Supabase secrets
- The service account has read-only access (Viewer role)
- Never commit the JSON file to GitHub
- The Edge Function handles authentication automatically

---

**Need help?** Check the [Google Analytics Data API documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)

