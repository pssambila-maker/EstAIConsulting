# SendGrid Email Setup Guide

Complete guide to configure email notifications for EST AI Consulting course enrollments.

---

## Quick Overview

When a customer completes payment, they automatically receive a beautiful HTML email with:
- Payment confirmation
- Course-specific access details
- Next steps to get started
- Support contact information

---

## Step 1: Create SendGrid Account

1. Go to https://sendgrid.com/
2. Click "Start for Free"
3. Sign up with your email
4. Complete email verification
5. **Free tier includes**: 100 emails/day forever (perfect for getting started!)

---

## Step 2: Verify Sender Identity

Before you can send emails, you need to verify your sender email address.

### Option A: Single Sender Verification (Recommended for Testing)

1. Go to SendGrid Dashboard → **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name**: EST AI Consulting
   - **From Email Address**: noreply@estaiconsulting.com (or your email)
   - **Reply To**: hello@estaiconsulting.com
   - **Company Address**: Your business address
4. Click **"Create"**
5. Check your email and click the verification link
6. ✅ You're verified!

### Option B: Domain Authentication (Recommended for Production)

1. Go to SendGrid Dashboard → **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Select your DNS host (Porkbun)
4. Follow the instructions to add DNS records
5. Wait for verification (can take up to 48 hours)
6. ✅ Domain verified!

---

## Step 3: Create API Key

1. Go to SendGrid Dashboard → **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `EST AI Consulting - Production`
4. Choose **"Full Access"** (or at minimum "Mail Send" permission)
5. Click **"Create & View"**
6. **IMPORTANT**: Copy the API key immediately (you won't see it again!)
   - Starts with `SG.`
   - Example: `SG.xxxxxxxxxxxxxxxxxxxxx`

---

## Step 4: Add API Key to Netlify

1. Go to **Netlify Dashboard** → Your Site → **Site configuration**
2. Click **"Environment variables"**
3. Click **"Add a variable"** → **"Add a single variable"**

**Add Variable 1:**
- Key: `SENDGRID_API_KEY`
- Value: `SG.your_actual_api_key_here`
- Scopes: Check all (Production, Deploy Previews, Branch deploys)
- Click "Create variable"

**Add Variable 2:**
- Key: `SENDGRID_FROM_EMAIL`
- Value: `noreply@estaiconsulting.com` (or the email you verified)
- Scopes: Check all
- Click "Create variable"

---

## Step 5: Redeploy Your Site

1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment (15-20 seconds)
4. ✅ Email notifications are now active!

---

## Step 6: Test Email Notifications

### Test the Complete Flow:

1. Go to your website: https://estaiconsulting.com
2. Complete lead capture form
3. Click "Enroll Now" on any course
4. Use test card: `4242 4242 4242 4242`
5. Complete the payment
6. **Check your email!** You should receive the welcome email

### Check SendGrid Delivery:

1. Go to SendGrid Dashboard → **Activity**
2. You should see your test email in the list
3. Status should be **"Delivered"** with a green checkmark

---

## Email Template Details

### What Customers Receive:

**Subject**: "Welcome to [Course Name]! Your Course Access Details"

**Email Includes**:
- Personalized greeting
- Payment confirmation (amount paid)
- Course-specific details and features
- Next steps to get started
- Support contact information
- Professional branding matching your website

### Course-Specific Content:

Each course has customized content:

**AI Fundamentals - Self-Paced ($497)**:
- Lifetime access to materials
- 4-week curriculum details
- Community forum access
- Next steps: Login credentials, Slack invite, syllabus

**AI Fundamentals - Cohort ($997)**:
- Cohort start date information
- Live session schedule
- Instructor access details
- Next steps: Cohort Slack, pre-course survey

**Business Leaders - Executive ($4,997)**:
- 1-on-1 consulting sessions
- Custom AI roadmap
- Executive network access
- Next steps: Strategy session, assessment form

**Business Leaders - Team ($12,997)**:
- Team enrollment details
- Dedicated account manager
- Custom curriculum info
- Next steps: Team member info, kickoff meeting

---

## Customization

### Change Email Content:

Edit [netlify/functions/webhook.js](netlify/functions/webhook.js) - look for the `getCourseDetails()` function at the bottom.

### Change Sender Name/Email:

Update in Netlify environment variables:
- `SENDGRID_FROM_EMAIL` - The email address
- Update the `name` field in webhook.js line 154

### Add More Email Types:

You can add emails for:
- Payment failures (already hooked up in code)
- Course reminders
- Completion certificates
- Upsell offers

---

## Monitoring & Analytics

### SendGrid Dashboard:

**Activity Feed**:
- View all sent emails
- See delivery status
- Check opens and clicks (if tracking enabled)

**Statistics**:
- Total emails sent
- Delivery rate
- Bounce rate
- Spam reports

**Alerts**:
- Set up alerts for delivery issues
- Get notified of bounces
- Monitor reputation

---

## Troubleshooting

### Email Not Sending

**Check 1**: Verify API key is correct in Netlify
- Go to Site configuration → Environment variables
- Confirm `SENDGRID_API_KEY` starts with `SG.`

**Check 2**: Verify sender email
- Go to SendGrid → Settings → Sender Authentication
- Ensure your email is verified (green checkmark)

**Check 3**: Check Netlify Function logs
- Go to Netlify → Functions → webhook
- Look for errors in the logs

**Check 4**: Check SendGrid Activity
- Go to SendGrid → Activity
- Look for failed deliveries
- Check error messages

### Email Going to Spam

**Solutions**:
1. Use Domain Authentication instead of Single Sender
2. Warm up your sending (start with low volume)
3. Avoid spam trigger words in subject/body
4. Include unsubscribe link (for marketing emails)
5. Maintain good sender reputation

### SendGrid API Key Invalid

**If you see "API key invalid" errors**:
1. Generate a new API key in SendGrid
2. Update the key in Netlify environment variables
3. Redeploy your site
4. Test again

---

## Upgrade Options

### Free Tier Limits:
- 100 emails/day
- Perfect for testing and small volume

### Paid Tiers:
When you need more:
- **Essentials ($19.95/mo)**: 50,000 emails/month
- **Pro ($89.95/mo)**: 100,000 emails/month
- Includes advanced features: dedicated IP, priority support

### When to Upgrade:
- You're sending 100+ emails per day
- You need dedicated IP for better deliverability
- You want advanced analytics
- You need priority support

---

## Best Practices

### Email Deliverability:

1. **Always use verified sender addresses**
2. **Start with low volume** (warm up your domain)
3. **Monitor bounce rates** (keep below 5%)
4. **Handle unsubscribes** properly
5. **Don't buy email lists** (only send to customers who purchased)

### Content Tips:

1. **Keep it concise** - customers scan emails
2. **Clear call-to-action** - what should they do next?
3. **Mobile-friendly** - 50%+ open on mobile
4. **Test before sending** - send test emails to yourself
5. **Personalization** - use customer name and course details

### Security:

1. **Never commit API keys** to Git (they're in .env which is gitignored)
2. **Rotate keys** periodically
3. **Use environment variables** for all secrets
4. **Monitor for suspicious activity**

---

## Support Resources

- **SendGrid Docs**: https://docs.sendgrid.com
- **SendGrid Support**: https://support.sendgrid.com
- **API Reference**: https://docs.sendgrid.com/api-reference
- **Deliverability Guide**: https://sendgrid.com/resource/email-deliverability-guide

---

## Quick Reference

### Environment Variables Needed:
```
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@estaiconsulting.com
```

### SendGrid Dashboard Links:
- **API Keys**: https://app.sendgrid.com/settings/api_keys
- **Sender Auth**: https://app.sendgrid.com/settings/sender_auth
- **Activity**: https://app.sendgrid.com/email_activity
- **Statistics**: https://app.sendgrid.com/statistics

### Test Email Address:
Use test card `4242 4242 4242 4242` with any email address to test.

---

## Success Checklist

- [ ] SendGrid account created
- [ ] Sender email verified (or domain authenticated)
- [ ] API key generated
- [ ] `SENDGRID_API_KEY` added to Netlify
- [ ] `SENDGRID_FROM_EMAIL` added to Netlify
- [ ] Site redeployed
- [ ] Test payment completed
- [ ] Welcome email received
- [ ] Email appears in SendGrid Activity

---

**🎉 Email notifications are now live!**

Every customer who completes a payment will automatically receive a beautiful welcome email with their course access details.
