# Creating a GA4 Property - Step by Step

## Step 1: Create the Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon, bottom left)
3. In the **Account** column (left), make sure you have an account selected
   - If you don't have an account, click **"Create Account"** first
4. In the **Property** column (middle), click **"Create Property"**

## Step 2: Fill in Property Details

1. **Property name:** `Metafórica` (or whatever you want)
2. **Reporting time zone:** Select your timezone
3. **Currency:** Select your currency
4. Click **"Next"**

## Step 3: Business Information (Optional)

1. Select your industry category (or "Other")
2. Select business size
3. Select how you'll use Google Analytics
4. Click **"Create"**

## Step 4: Set Up Data Stream

1. Select **"Web"** (since this is a website)
2. **Website URL:** `https://soymetaforica.com`
3. **Stream name:** `Metafórica Website` (or whatever you want)
4. Click **"Create stream"**

## Step 5: Get Your IDs

After creating the stream, you'll see:
- ✅ **Measurement ID:** G-XXXXXXXXXX (like G-LFQ0BL4777)
- ✅ **Stream ID:** XXXXXXXXXX (like 13040771317)
- ✅ **Property ID:** This is what we need! It's usually shown in the Admin panel

## Step 6: Find Your Property ID

1. Go back to **Admin** → **Property Settings**
2. Look for **"Property ID"** at the top
3. It's a number like `123456789` (usually 8-9 digits)
4. **Copy this number** - this is what we need for the Data API!

---

## Important Notes

- **Property creation is FREE** ✅
- **No credit card required** ✅
- You'll get the Property ID immediately after creating the property
- The Property ID is different from Stream ID and Measurement ID

---

## Once You Have the Property ID

We'll use it to:
1. Set up Google Cloud project (free)
2. Connect the Data API (free)
3. Fetch analytics data in your CMS dashboard

**Your Property ID:** ________________ (fill this in once you create the property)

