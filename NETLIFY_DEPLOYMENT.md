# Netlify Deployment Guide for EST AI Consulting

Complete step-by-step guide to deploy and maintain your website on Netlify with Stripe integration.

**Live Site:** https://estaiconsulting.com

---

## Table of Contents
1. [Initial Deployment](#initial-deployment)
2. [Custom Domain Setup](#custom-domain-setup)
3. [Stripe Configuration](#stripe-configuration)
4. [Environment Variables](#environment-variables)
5. [Testing](#testing)
6. [Going Live](#going-live)
7. [Maintenance](#maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Initial Deployment

### Prerequisites
- [x] GitHub account with repository access
- [x] Netlify account (free tier is sufficient)
- [x] Domain registered (estaiconsulting.com via Porkbun)

### Step 1: Sign Up for Netlify

1. Go to https://www.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify to access your GitHub repositories

### Step 2: Import Your Repository

1. Click "Add new site" → "Import an existing project"
2. Click "Deploy with GitHub"
3. Select repository: `pssambila-maker/EstAIConsulting`
4. **Build settings:**
   - Build command: (leave empty)
   - Publish directory: (leave empty or use `/`)
   - Functions directory: `netlify/functions` (auto-detected)
5. Click "Deploy site"

### Step 3: Wait for Deployment

- First deployment takes 1-2 minutes
- You'll get a temporary URL like: `random-name-123.netlify.app`
- Site is immediately live and accessible

**✅ Your site is now deployed!**

---

## Custom Domain Setup

### Step 1: Add Domain in Netlify

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `estaiconsulting.com`
4. Click "Verify"
5. Also add: `www.estaiconsulting.com`

### Step 2: Configure DNS at Porkbun

Netlify will show you the required DNS records:

#### For estaiconsulting.com (apex domain):
```
Type: A
Host: @ (or leave blank)
Answer: 75.2.60.5
TTL: 600
```

#### For www.estaiconsulting.com:
```
Type: CNAME
Host: www
Answer: [your-site-name].netlify.app
TTL: 600
```

**Steps:**
1. Log in to Porkbun
2. Go to DNS Management for estaiconsulting.com
3. Delete any existing ALIAS or CNAME records for root domain
4. Add the A record
5. Add the CNAME record
6. Save changes

### Step 3: Wait for DNS Propagation

- Usually takes 10-30 minutes
- Can take up to 24 hours (rare)
- Check status in Netlify → Domains

### Step 4: SSL Certificate

- Netlify automatically provisions SSL certificate
- No action required on your part
- Certificate is automatically renewed

**✅ Your custom domain is now configured!**

---

## Stripe Configuration

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Sign up for account
3. Complete business verification (optional for test mode)

### Step 2: Get API Keys

1. Go to Stripe Dashboard → Developers → API Keys
2. You'll see two modes: **Test** and **Live**
3. Start with **Test mode** (toggle at top right)
4. Copy these keys:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...` (click "Reveal" to see)

**⚠️ Important:** Never commit secret keys to Git!

### Step 3: Create Products and Prices

Create 4 products in Stripe Dashboard → Products:

#### Product 1: AI Fundamentals - Self-Paced
- Name: AI Fundamentals - Self-Paced
- Price: $497 USD
- Type: One-time payment
- Copy the Price ID: `price_...`

#### Product 2: AI Fundamentals - Cohort-Based
- Name: AI Fundamentals - Cohort-Based
- Price: $997 USD
- Type: One-time payment
- Copy the Price ID: `price_...`

#### Product 3: AI for Business Leaders - Executive Cohort
- Name: AI for Business Leaders - Executive Cohort
- Price: $4,997 USD
- Type: One-time payment
- Copy the Price ID: `price_...`

#### Product 4: AI for Business Leaders - Team Package
- Name: AI for Business Leaders - Team Package
- Price: $12,997 USD
- Type: One-time payment
- Copy the Price ID: `price_...`

### Step 4: Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL:** `https://estaiconsulting.com/.netlify/functions/webhook`
4. **Description:** EST AI Consulting - Payment Notifications
5. **Events to listen to:**
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
6. Click "Add endpoint"
7. Copy the **Signing secret**: `whsec_...`

**✅ Stripe is now configured!**

---

## Environment Variables

Add these in Netlify Dashboard → Site settings → Environment variables:

### Required Variables

| Variable Name | Value | Where to Get It |
|--------------|-------|-----------------|
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe → Developers → API Keys |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe → Developers → Webhooks |
| `PRICE_AI_FUNDAMENTALS_SELF_PACED` | `price_...` | Stripe → Products → AI Fundamentals Self-Paced |
| `PRICE_AI_FUNDAMENTALS_COHORT` | `price_...` | Stripe → Products → AI Fundamentals Cohort |
| `PRICE_BUSINESS_LEADERS_EXECUTIVE` | `price_...` | Stripe → Products → Business Leaders Executive |
| `PRICE_BUSINESS_LEADERS_TEAM` | `price_...` | Stripe → Products → Business Leaders Team |

### Adding Variables in Netlify

1. Go to Site settings → Environment variables
2. Click "Add a variable"
3. Select "Add a single variable"
4. Enter key and value
5. Choose scopes: **Production**, **Deploy Previews**, **Branch deploys**
6. Click "Create variable"
7. Repeat for all 7 variables

### Trigger Redeploy

After adding all variables:
1. Go to Deploys
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete

**✅ Environment variables are configured!**

---

## Testing

### Test 1: Website Loads

Visit: https://estaiconsulting.com

**Verify:**
- [x] Homepage loads correctly
- [x] All images display
- [x] Navigation works
- [x] Course pages load
- [x] Logo displays
- [x] Contact form appears

### Test 2: Payment Flow (Test Mode)

1. Go to a course page (e.g., AI Fundamentals)
2. Click "Enroll Now - $497" button
3. Should redirect to Stripe Checkout
4. Use test card details:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
5. Click "Pay"
6. Should redirect to success.html

**Expected behavior:**
- ✅ Button click triggers loading notification
- ✅ Redirects to Stripe Checkout page
- ✅ Payment form works
- ✅ Successful payment redirects to success page
- ✅ Success page shows confirmation

### Test 3: Webhook Delivery

1. After test payment, go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. Check recent events
4. Should see `checkout.session.completed` event
5. Status should be **Succeeded** (green checkmark)

### Test 4: Netlify Functions Logs

1. Go to Netlify Dashboard → Functions
2. Click `/create-checkout-session`
3. Check logs for invocations
4. Should see successful requests
5. Do the same for `/webhook`

**✅ All tests passing!**

---

## Going Live (Production Mode)

When ready to accept real payments:

### Step 1: Switch Stripe to Live Mode

1. In Stripe Dashboard, toggle to **Live mode** (top right)
2. Complete business verification if required
3. Get your Live API keys

### Step 2: Create Live Products

Create the same 4 products in Live mode:
1. Go to Products (in Live mode)
2. Recreate all 4 courses
3. Copy new Live Price IDs

### Step 3: Update Environment Variables

In Netlify:
1. Update `STRIPE_PUBLISHABLE_KEY` with `pk_live_...`
2. Update `STRIPE_SECRET_KEY` with `sk_live_...`
3. Update all `PRICE_*` variables with Live Price IDs
4. Redeploy site

### Step 4: Update Webhook

1. Create new webhook in Live mode
2. Use same URL: `https://estaiconsulting.com/.netlify/functions/webhook`
3. Select same events
4. Copy new Signing Secret
5. Update `STRIPE_WEBHOOK_SECRET` in Netlify
6. Redeploy

### Step 5: Test with Small Real Payment

1. Make a small test purchase ($1 if possible, or smallest amount)
2. Use real credit card
3. Verify:
   - Payment processes
   - Webhook fires
   - Confirmation page shows
   - Money appears in Stripe balance

**✅ You're live and accepting payments!**

---

## Maintenance

### Auto-Deployment

Every time you push to GitHub:
1. Netlify detects the change
2. Automatically builds and deploys
3. Updates live site in 1-2 minutes
4. Sends notification email

**No manual deployment needed!**

### Making Updates

```bash
# Make changes to files
# Then commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### Monitoring

**Netlify Dashboard:**
- Analytics: Page views, bandwidth
- Functions: Invocation count, errors
- Deploys: History and status
- Logs: Real-time debugging

**Stripe Dashboard:**
- Payments: All transactions
- Customers: Customer list
- Webhooks: Delivery status
- Logs: API requests

### Backups

- Code: Automatically versioned in GitHub
- Configuration: Document environment variables
- Stripe: Download customer/payment data monthly

---

## Troubleshooting

### Issue: Domain Not Loading

**Symptoms:** estaiconsulting.com shows error or old site

**Solutions:**
1. Check DNS records at Porkbun match Netlify requirements
2. Wait 30 minutes for DNS propagation
3. Clear browser cache
4. Try incognito/private browsing
5. Use DNS checker: https://dnschecker.org

### Issue: Payment Button Doesn't Work

**Symptoms:** Click button, nothing happens or error shows

**Solutions:**
1. Check browser console for JavaScript errors (F12)
2. Verify environment variables are set in Netlify
3. Check Functions logs for errors
4. Verify Stripe keys are correct (test vs live)
5. Check that Price IDs match Stripe products

### Issue: Webhook Not Receiving Events

**Symptoms:** Payment succeeds but webhook doesn't fire

**Solutions:**
1. Verify webhook URL is exactly: `https://estaiconsulting.com/.netlify/functions/webhook`
2. Check webhook signing secret matches Netlify variable
3. Look at Stripe webhook logs for delivery failures
4. Check Netlify Functions logs for errors
5. Verify webhook is in correct mode (test vs live)

### Issue: SSL Certificate Error

**Symptoms:** "Not secure" warning or certificate error

**Solutions:**
1. Wait 24 hours after DNS configuration
2. Go to Netlify → Domain settings
3. Click "Verify DNS configuration"
4. Click "Renew certificate" if needed
5. Contact Netlify support if persists

### Issue: Function Timeout

**Symptoms:** "Function execution timeout" error

**Solutions:**
1. Check Netlify Functions logs for details
2. Verify Stripe package is in package.json
3. Check network issues
4. Simplify function logic if needed
5. Contact Netlify support for limits

### Issue: Deployment Failed

**Symptoms:** Red X on deployment, site not updating

**Solutions:**
1. Check deploy log in Netlify for errors
2. Verify package.json has correct dependencies
3. Check for syntax errors in code
4. Try manual deploy: Deploys → Trigger deploy
5. Roll back to previous deploy if needed

---

## Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Netlify Support:** https://www.netlify.com/support
- **Stripe Docs:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Porkbun Support:** https://porkbun.com/support

---

## Quick Reference

### Important URLs

- **Live Site:** https://estaiconsulting.com
- **Netlify Dashboard:** https://app.netlify.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **GitHub Repo:** https://github.com/pssambila-maker/EstAIConsulting
- **Porkbun DNS:** https://porkbun.com/account/domainsSpeedy

### Netlify Functions Endpoints

- Create Checkout: `/.netlify/functions/create-checkout-session`
- Webhook: `/.netlify/functions/webhook`

### Stripe Test Cards

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

---

## Success Checklist

- [x] Site deployed to Netlify
- [x] Custom domain configured (estaiconsulting.com)
- [x] SSL certificate active (HTTPS)
- [x] Stripe account created
- [x] Products and prices created in Stripe
- [x] Environment variables configured
- [x] Netlify Functions deployed
- [x] Webhook endpoint created
- [x] Test payment successful
- [x] Webhook delivery confirmed
- [x] Auto-deployment working
- [ ] Live mode activated (when ready)
- [ ] Real payment tested (when ready)

---

**🎉 Your EST AI Consulting website is live and accepting payments!**

For additional help or questions, refer to the support resources above or contact your development team.
