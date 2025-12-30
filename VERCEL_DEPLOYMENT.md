# Vercel Deployment Guide for EST AI Consulting

Complete step-by-step guide to deploy your website to Vercel with custom domain.

## ✅ Prerequisites Completed

- [x] GitHub repository created and code pushed
- [x] Domain name registered (estaiconsulting.com)
- [x] Vercel account created and connected to GitHub

---

## 🚀 Step 1: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - You should already be logged in with GitHub

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Find and select: `pssambila-maker/EstAIConsulting`
   - Click "Import"

3. **Configure Project**
   - **Project Name:** `est-ai-consulting` (or leave as default)
   - **Framework Preset:** Leave as "Other" (we have a static site)
   - **Root Directory:** `./` (default)
   - **Build Command:** Leave empty (no build needed)
   - **Output Directory:** Leave empty (static files in root)

4. **Click "Deploy"**
   - Vercel will deploy your site immediately
   - You'll get a URL like: `est-ai-consulting.vercel.app`
   - Initial deployment takes ~1-2 minutes

---

## 🔐 Step 2: Configure Environment Variables

**IMPORTANT:** Add these BEFORE testing payments!

1. **In Vercel Dashboard**
   - Go to your project → "Settings" → "Environment Variables"

2. **Add Stripe Keys** (one at a time)

   | Name | Value | Where to Get It |
   |------|-------|-----------------|
   | `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | Stripe Dashboard → Developers → API Keys |
   | `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | Stripe Dashboard → Developers → API Keys |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard → Developers → Webhooks (create endpoint first) |

3. **Add Stripe Price IDs**

   First, create products in Stripe Dashboard, then add Price IDs:

   | Name | Example Value | Product Name |
   |------|---------------|--------------|
   | `PRICE_AI_FUNDAMENTALS_SELF_PACED` | `price_1ABC...` | AI Fundamentals - Self-Paced ($497) |
   | `PRICE_AI_FUNDAMENTALS_COHORT` | `price_1DEF...` | AI Fundamentals - Cohort ($997) |
   | `PRICE_BUSINESS_LEADERS_EXECUTIVE` | `price_1GHI...` | Business Leaders - Executive ($4,997) |
   | `PRICE_BUSINESS_LEADERS_TEAM` | `price_1JKL...` | Business Leaders - Team ($12,997) |

4. **Environment Selection**
   - For each variable, select: **Production, Preview, and Development**
   - This ensures they work in all environments

5. **Save and Redeploy**
   - After adding all variables, go to "Deployments"
   - Click "..." on latest deployment → "Redeploy"
   - This applies the new environment variables

---

## 🌐 Step 3: Connect Custom Domain

1. **Add Domain in Vercel**
   - Go to Project → "Settings" → "Domains"
   - Enter: `estaiconsulting.com`
   - Click "Add"
   - Also add: `www.estaiconsulting.com` (recommended)

2. **Vercel will show DNS records needed:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Configure DNS at Your Registrar (Porkbun)**
   - Log in to Porkbun
   - Go to: DNS Management for estaiconsulting.com
   - Delete any existing A or CNAME records for @ and www
   - Add the records Vercel provided:

   **Record 1:**
   - Type: `A`
   - Host: `@` (or leave blank)
   - Answer: `76.76.21.21`
   - TTL: `300` (or default)

   **Record 2:**
   - Type: `CNAME`
   - Host: `www`
   - Answer: `cname.vercel-dns.com`
   - TTL: `300` (or default)

4. **Wait for DNS Propagation**
   - Usually takes 5-30 minutes
   - Can take up to 24 hours (rare)
   - Check status in Vercel → Domains tab
   - Vercel will automatically issue SSL certificate when DNS is ready

5. **Verify**
   - Once verified, your site will be live at:
     - https://estaiconsulting.com
     - https://www.estaiconsulting.com
   - Both will have automatic HTTPS (SSL)

---

## 🔔 Step 4: Set Up Stripe Webhook

1. **Get Your Webhook URL**
   - Your webhook endpoint is: `https://estaiconsulting.com/api/webhook`
   - (Or use the `.vercel.app` URL if domain isn't ready yet)

2. **Create Webhook in Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://estaiconsulting.com/api/webhook`
   - Description: "EST AI Consulting - Payment Confirmations"

3. **Select Events to Listen For**
   - Click "Select events"
   - Choose:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.payment_failed`
   - Click "Add events"

4. **Get Webhook Signing Secret**
   - After creating webhook, click on it
   - Click "Reveal" under "Signing secret"
   - Copy the secret (starts with `whsec_...`)

5. **Add to Vercel Environment Variables**
   - Go to Vercel → Project Settings → Environment Variables
   - Add new variable:
     - Name: `STRIPE_WEBHOOK_SECRET`
     - Value: `whsec_...` (the secret you copied)
     - Environment: Production, Preview, Development
   - Save and redeploy

---

## 🧪 Step 5: Test Everything

### Test 1: Website Loads
- Visit: https://estaiconsulting.com
- All pages should load correctly
- Navigation should work
- Styles should be applied

### Test 2: Payment Flow (Test Mode)
1. Go to a course page (e.g., AI Fundamentals)
2. Click "Enroll Now" button
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete payment
6. Should redirect to success page

### Test 3: Webhook Delivery
1. After test payment, go to Stripe Dashboard → Webhooks
2. Click on your webhook endpoint
3. You should see `checkout.session.completed` event
4. Status should be "Succeeded" (green checkmark)

### Test 4: Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `/api/create-checkout-session`
3. Check logs for any errors
4. Do the same for `/api/webhook`

---

## 📊 Monitoring and Maintenance

### Vercel Dashboard
- **Analytics:** Track page views and performance
- **Deployments:** See all deployments and their status
- **Functions:** Monitor serverless function invocations
- **Logs:** Real-time logs for debugging

### Stripe Dashboard
- **Payments:** See all successful payments
- **Customers:** Track customer enrollments
- **Webhooks:** Monitor webhook delivery
- **Logs:** Debug payment issues

---

## 🔄 Auto-Deployment

Your site is now set up for automatic deployment!

**Every time you push to GitHub:**
1. Vercel automatically detects the change
2. Builds and deploys your site
3. Updates the live site (usually ~1-2 minutes)
4. Sends you a notification when done

**To update your site:**
```bash
# Make changes to your files
# Then commit and push
git add .
git commit -m "Update: description of changes"
git push origin main
```

That's it! Vercel handles the rest automatically.

---

## 🚢 Going Live (Production Mode)

When ready to accept real payments:

1. **Switch Stripe to Live Mode**
   - In Stripe Dashboard, toggle from "Test" to "Live"
   - Get your live API keys (pk_live_... and sk_live_...)

2. **Update Vercel Environment Variables**
   - Replace test keys with live keys
   - Update all PRICE_* variables with live Price IDs
   - Redeploy

3. **Update Webhook**
   - Create new webhook endpoint in Live mode
   - Use same URL: `https://estaiconsulting.com/api/webhook`
   - Get new webhook secret and update in Vercel

4. **Test with Small Amount**
   - Make a real small purchase to verify
   - Check that webhook fires correctly
   - Verify fulfillment logic works

---

## 💡 Useful Commands

### Local Development
```bash
# Install dependencies
npm install

# Run local development server
npm run dev
# Site will be at: http://localhost:3000
# Functions will work locally with test environment variables
```

### Manual Deployment
```bash
# Deploy to production
npm run deploy

# Or use Vercel CLI directly
vercel --prod
```

---

## 🔒 Security Checklist

- ✅ Never commit `.env` file (it's in `.gitignore`)
- ✅ Use environment variables for all secrets
- ✅ Enable HTTPS (automatic with Vercel)
- ✅ Verify webhook signatures (implemented in `/api/webhook.js`)
- ✅ Validate all payment amounts server-side (implemented)
- ✅ Use Stripe's test mode until ready for production

---

## ❓ Troubleshooting

### Domain not connecting
- Verify DNS records exactly match what Vercel shows
- Wait 30 minutes for DNS propagation
- Use DNS checker: https://dnschecker.org

### Payment button doesn't work
- Check browser console for errors
- Verify environment variables are set in Vercel
- Check Vercel function logs for errors
- Ensure Stripe keys are correct (test vs live)

### Webhook not receiving events
- Verify webhook URL is correct
- Check webhook signing secret in environment variables
- Look at Stripe webhook logs for delivery failures
- Check Vercel function logs for errors

### Function timeout or error
- Check Vercel function logs
- Verify Stripe package is installed (`package.json`)
- Ensure environment variables are set for all environments

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Stripe Docs:** https://stripe.com/docs
- **DNS Help:** Your domain registrar's support

---

## 🎉 You're All Set!

Your EST AI Consulting website is now:
- ✅ Live at https://estaiconsulting.com
- ✅ Auto-deploying from GitHub
- ✅ Processing payments with Stripe
- ✅ Sending webhooks for fulfillment
- ✅ Running on Vercel's global CDN
- ✅ Secured with automatic HTTPS

**Next Steps:**
1. Test all payment flows thoroughly in test mode
2. Set up email notifications for enrollments
3. Create customer onboarding process
4. Switch to live mode when ready
5. Start marketing your courses!

Good luck with your AI consulting business! 🚀
