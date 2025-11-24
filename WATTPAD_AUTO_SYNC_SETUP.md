# Wattpad Automatic Sync Setup

## Overview
Set up weekly automatic syncing of Wattpad stories, similar to the Spotify podcast sync.

---

## Option 1: External Cron Service (RECOMMENDED)

Since Supabase's native scheduler is a paid feature, use a free external service to trigger the Edge Function.

### Services to Choose From:

#### A. **cron-job.org** (Free, Easy)
1. Sign up: https://cron-job.org
2. Create new cron job:
   - **Title:** Sync Wattpad Stories
   - **URL:** `https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories`
   - **Method:** POST
   - **Schedule:** Weekly (e.g., Sunday at 9 AM)
   - **Timezone:** Your timezone
3. Save and enable

**Pros:** Simple, reliable, free tier sufficient  
**Cons:** Requires external account

---

#### B. **GitHub Actions** (Free, Developer-Friendly)
Create a workflow file that runs weekly:

```yaml
# .github/workflows/sync-wattpad.yml
name: Sync Wattpad Stories

on:
  schedule:
    # Runs every Sunday at 9 AM UTC
    - cron: '0 9 * * 0'
  workflow_dispatch: # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Wattpad Sync
        run: |
          curl -X POST \
            https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories \
            -H "Content-Type: application/json"
```

**Pros:** Version controlled, free, runs on GitHub  
**Cons:** Requires GitHub repo for workflow

---

#### C. **EasyCron** (Free tier available)
1. Sign up: https://www.easycron.com
2. Add cron job:
   - **URL:** `https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories`
   - **Type:** POST
   - **Schedule:** Weekly
3. Enable

**Pros:** Simple interface  
**Cons:** Free tier has limitations

---

## Option 2: Supabase RPC Function (Alternative)

Create a simple RPC function that admin can trigger:

```sql
-- Create RPC function to call Edge Function
CREATE OR REPLACE FUNCTION trigger_wattpad_sync()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- This would need http extension (paid tier)
  -- Or trigger via Supabase client from CMS
  RETURN json_build_object('status', 'triggered');
END;
$$;
```

**Note:** This requires manual CMS trigger or paid Supabase features.

---

## Option 3: Cloudflare Workers (Free Tier)

Deploy a simple worker that runs on schedule:

```javascript
// Cloudflare Worker
export default {
  async scheduled(event, env, ctx) {
    await fetch('https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

Set cron trigger: `0 9 * * 0` (weekly)

**Pros:** Serverless, fast, generous free tier  
**Cons:** Requires Cloudflare account

---

## Recommended Setup: cron-job.org

**Step-by-step:**

1. **Sign up** at https://cron-job.org/en/signup/

2. **Create Cron Job:**
   - Click "Create Cronjob"
   - **Title:** "Sync Wattpad Stories - Metafórica"
   - **Address (URL):** `https://fdfchoshzouwguvxfnuv.supabase.co/functions/v1/sync-wattpad-stories`
   - **Request Method:** POST
   - **Schedule:**
     - **Type:** Weekly
     - **Day:** Sunday
     - **Time:** 09:00 (9 AM)
   - **Timezone:** America/Los_Angeles (or your timezone)
   - **Enabled:** Yes

3. **Advanced Settings:**
   - **Timeout:** 60 seconds
   - **Request Headers:** (Leave default)
   - **Notifications:** Enable email on failure (optional)

4. **Save** and test with "Execute Now"

---

## Sync Schedule Recommendation

### Wattpad Stories
- **Frequency:** Weekly
- **Day:** Sunday
- **Time:** 9 AM
- **Reason:** Stories don't update as frequently as podcasts, weekly is sufficient

### Spotify Podcasts (Existing)
- **Frequency:** Daily (or on-demand)
- **Day:** As needed
- **Time:** Variable
- **Reason:** New episodes published regularly

---

## Testing the Setup

### Test Manual Sync First:
1. Go to `/admin` → Wattpad tab
2. Click "Sync Now"
3. Verify stories appear

### Test Scheduled Sync:
1. Set up cron job
2. Use "Execute Now" button to test
3. Check CMS to verify stories synced
4. Monitor for one week to ensure it runs

---

## Monitoring & Notifications

### Success Indicators:
- ✅ Stories appear in CMS after sync
- ✅ `last_synced_at` timestamp updates
- ✅ Stats (reads, votes) update

### Failure Detection:
- ❌ Edge Function returns 500 error
- ❌ No stories synced (result.synced = 0)
- ❌ Network timeout

### Setup Notifications:
Most cron services offer email notifications on failure. Enable this to get alerted if sync fails.

---

## Maintenance

### What to Check Monthly:
- Verify cron job still active
- Check story count hasn't decreased (indicates API issues)
- Review sync logs for errors

### When to Re-sync Manually:
- After publishing new Wattpad story
- After updating story details
- If stats seem outdated

---

## Cost Comparison

| Service | Free Tier | Paid Tier | Best For |
|---------|-----------|-----------|----------|
| cron-job.org | Unlimited | $5/mo | Simple setups |
| GitHub Actions | 2,000 min/mo | Free for public repos | Developers |
| Cloudflare Workers | 100K requests/day | $5/mo | High volume |
| Supabase Scheduler | N/A | Paid only | Native integration |

**Recommendation:** Start with cron-job.org (free, simple, reliable)

---

## Security Considerations

- ✅ Edge Function has CORS enabled (already done)
- ✅ No API keys needed (Wattpad API is public)
- ✅ Rate limits respected (1 sync per week)
- ✅ Upsert logic prevents duplicates

---

## Next Steps

1. **Choose service** (recommend cron-job.org)
2. **Create account** and set up cron job
3. **Test** with "Execute Now"
4. **Monitor** for first week
5. **Done!** Stories auto-sync weekly

Let me know if you need help setting up any of these!


