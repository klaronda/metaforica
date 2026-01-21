# Google Analytics Edge Function Troubleshooting

## Error: 500 Internal Server Error

If you're seeing a 500 error when trying to fetch analytics data, check the following:

### Step 1: Verify Secrets are Configured

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **Edge Functions** → **Secrets**
3. Verify these secrets exist:
   - `GA_SERVICE_ACCOUNT_JSON` - Should contain the full JSON from your service account key file
   - `GA_PROPERTY_ID` - Should be `514232226` (your Property ID)

**To check if secrets are set:**
- If they're missing, add them following Step 7 in `GA_SETUP_QUICK_START.md`

### Step 2: Verify Service Account Access

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. Click **Property Access Management**
4. Verify your service account email (from the JSON file, field: `client_email`) is listed with **"Viewer"** role
5. If not listed, add it:
   - Click **"+"** → **"Add users"**
   - Paste your service account email
   - Role: **"Viewer"**
   - Click **"Add"**

### Step 3: Check Edge Function Logs

1. Go to Supabase Dashboard
2. Navigate to **Edge Functions** → **fetch-ga-analytics**
3. Click on the function
4. Go to **Logs** tab
5. Look for error messages - they will tell you exactly what's wrong

Common errors you might see:
- `GA_SERVICE_ACCOUNT_JSON not configured` → Add the secret
- `GA_PROPERTY_ID not configured` → Add the secret
- `Token exchange failed` → Service account JSON might be invalid
- `GA API error: 403` → Service account doesn't have access to the property
- `GA API error: 404` → Property ID might be wrong

### Step 4: Test the Function Manually

You can test the Edge Function directly:

1. Go to Supabase Dashboard → **Edge Functions** → **fetch-ga-analytics**
2. Click **"Invoke"** button
3. Use this test payload:
```json
{
  "startDate": "7daysAgo",
  "endDate": "today",
  "metrics": ["activeUsers"]
}
```
4. Check the response - it will show you the exact error

### Step 5: Verify Property ID

Your Property ID should be: `514232226`

To double-check:
1. Go to Google Analytics → Admin
2. Click **Property Settings**
3. Verify the **Property ID** matches `514232226`

### Step 6: Re-deploy the Function

If secrets were added after deployment, you may need to redeploy:

1. Go to Supabase Dashboard → **Edge Functions**
2. Find **fetch-ga-analytics**
3. Click **"..."** menu → **"Redeploy"** or **"Edit"** → **"Deploy"**

This ensures the function picks up the latest secrets.

---

## Still Not Working?

After checking all the above, refresh the Analytics tab in your CMS and check the browser console. The improved error handling should now show you the exact error message from the Edge Function.

Common fixes:
- ✅ Secrets configured correctly
- ✅ Service account has Viewer access to GA4 property
- ✅ Property ID is correct (514232226)
- ✅ Edge Function is deployed and up-to-date

If you're still seeing errors, share the exact error message from the browser console and we can troubleshoot further!


































