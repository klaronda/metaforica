# Resend Email Setup Guide

## Overview
This guide will help you set up Resend to send email notifications when someone submits the contact form.

## Step 1: Create Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log into Resend dashboard
2. Go to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Metafórica Contact Form")
5. Copy the API key (you'll only see it once!)

## Step 3: Add Domain (Required for Production)

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter `soymetaforica.com`
4. Follow the DNS setup instructions to verify your domain
5. Add the required DNS records in your Squarespace DNS settings:
   - **TXT record** for domain verification
   - **SPF record** (TXT)
   - **DKIM records** (CNAME)
   - **DMARC record** (TXT)

**Note:** For testing, you can use Resend's test domain, but you'll need to verify your domain for production.

## Step 4: Add API Key to Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Click **Add Secret**
4. Name: `RESEND_API_KEY`
5. Value: Paste your Resend API key
6. Click **Save**

## Step 5: Deploy Edge Function

Deploy the `send-contact-email` Edge Function to Supabase:

```bash
cd /Users/kevoo/Cursor/Metaforica
supabase functions deploy send-contact-email
```

Or use the Supabase CLI from your project directory.

## Step 6: Test the Integration

1. Submit a test contact form on your site
2. Check your email at `contact@soymetaforica.com`
3. Verify the email contains all contact form details

## Troubleshooting

### Email not sending?
- Check Supabase Edge Function logs: **Edge Functions** → **send-contact-email** → **Logs**
- Verify `RESEND_API_KEY` secret is set correctly
- Check Resend dashboard for delivery status

### Domain verification issues?
- Make sure all DNS records are added correctly
- Wait up to 24 hours for DNS propagation
- Use Resend's domain verification tool to check status

## Email Template

The email template includes:
- Contact name
- Email address
- Phone (if provided)
- Subject
- Message content
- Timestamp
- Styled with Metafórica brand colors (yellow/amber)

## Next Steps

Once set up, all contact form submissions will:
1. Save to `contact_submissions` table
2. Send email notification to `contact@soymetaforica.com`
3. Use the sender's email as reply-to address

