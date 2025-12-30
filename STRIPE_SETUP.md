# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for EST AI Consulting training programs.

## 📋 Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Node.js installed (for the backend server)
- A domain or hosting service for your website

## 🚀 Quick Start

### 1. Create Stripe Account

1. Go to https://stripe.com and create an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

### 2. Get Your API Keys

1. Go to **Developers > API Keys** in the Stripe Dashboard
2. Copy your **Publishable Key** (starts with `pk_test_...` for test mode)
3. Copy your **Secret Key** (starts with `sk_test_...` for test mode)

**⚠️ IMPORTANT:** Never expose your secret key in client-side code!

### 3. Create Products and Prices

1. Go to **Products** in the Stripe Dashboard
2. Create products for each course:
   - **AI Fundamentals - Self-Paced** ($497)
   - **AI Fundamentals - Cohort-Based** ($997)
   - **AI for Business Leaders - Executive Cohort** ($4,997)
   - **AI for Business Leaders - Team Package** ($12,997)

3. For each product:
   - Click "Add Product"
   - Enter the product name and price
   - Set pricing to "One-time"
   - Copy the **Price ID** (starts with `price_...`)

### 4. Update Configuration Files

#### Update `payment.js`

Replace the placeholder values:

```javascript
// Line 4: Add your publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_ACTUAL_KEY';

// Lines 9-26: Add your Price IDs
const courses = {
    'ai-fundamentals-self-paced': {
        name: 'AI Fundamentals - Self-Paced',
        price: 497,
        priceId: 'price_YOUR_ACTUAL_PRICE_ID_1' // From Stripe Dashboard
    },
    // ... update all Price IDs
};
```

#### Update `server-example.js`

Replace the placeholder values:

```javascript
// Line 5: Add your secret key
const stripe = require('stripe')('sk_test_YOUR_ACTUAL_SECRET_KEY');
```

## 🔧 Backend Setup

### Option 1: Simple Backend (Recommended for Testing)

1. Install dependencies:
```bash
npm init -y
npm install express stripe cors dotenv
```

2. Create `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
PORT=3000
```

3. Run the server:
```bash
node server-example.js
```

### Option 2: Use Stripe Payment Links (No Backend Required)

1. Go to **Payment Links** in Stripe Dashboard
2. Create a payment link for each course
3. Update the payment buttons to use direct links:

```javascript
// In payment.js, update the button click handler:
button.addEventListener('click', function(e) {
    e.preventDefault();
    const paymentLink = this.getAttribute('data-payment-link');
    window.location.href = paymentLink;
});
```

4. Update HTML buttons:
```html
<button class="btn-pricing" data-payment-link="https://buy.stripe.com/YOUR_LINK">
    Enroll Now - $497
</button>
```

## 🔔 Set Up Webhooks

Webhooks notify your server when payments succeed or fail.

1. Go to **Developers > Webhooks** in Stripe Dashboard
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the **Signing Secret** (starts with `whsec_...`)
6. Add to your `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

## 🧪 Testing

### Test Card Numbers

Use these card numbers in test mode:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0027 6000 3184
- Use any future expiration date and any 3-digit CVC

### Test the Integration

1. Click on a course enrollment button
2. You should be redirected to Stripe Checkout
3. Use a test card number
4. Complete the payment
5. You should be redirected to `success.html`

### Test Webhooks Locally

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
# Download from: https://github.com/stripe/stripe-cli/releases
```

2. Listen for webhooks:
```bash
stripe listen --forward-to localhost:3000/webhook
```

3. Trigger a test event:
```bash
stripe trigger checkout.session.completed
```

## 📧 Post-Payment Actions

Update `server-example.js` to implement post-payment actions:

```javascript
async function fulfillOrder(session) {
    const customerEmail = session.customer_details.email;
    const courseName = session.metadata.courseName;

    // TODO: Implement these actions
    // 1. Send confirmation email
    // 2. Grant course access
    // 3. Add to CRM/database
    // 4. Send calendar invites (for cohort courses)
    // 5. Trigger any automation workflows
}
```

## 🚢 Going Live

When ready for production:

1. Switch Stripe to **Live Mode** in the dashboard
2. Get your live API keys (start with `pk_live_...` and `sk_live_...`)
3. Update `payment.js` and `server-example.js` with live keys
4. Create live products and prices
5. Update webhook endpoint with live URL
6. Test thoroughly with small amounts first

## 🔒 Security Best Practices

1. **Never** expose your secret key in client-side code
2. Always validate webhooks using the signing secret
3. Use HTTPS for your website
4. Implement rate limiting on your backend
5. Store API keys in environment variables
6. Validate all payment amounts server-side
7. Log all transactions for auditing

## 📚 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)

## ❓ Troubleshooting

### Payment button doesn't work
- Check browser console for errors
- Verify API keys are correct
- Ensure `payment.js` is loaded

### Webhook not receiving events
- Verify webhook URL is correct
- Check webhook signing secret
- Ensure endpoint returns 200 response

### Redirect not working after payment
- Verify success URL is correct
- Check that `success.html` is accessible
- Look for JavaScript errors

## 💡 Alternative: Stripe Payment Links

For a simpler setup without backend code:

1. Create Payment Links in Stripe Dashboard
2. Replace the payment buttons with direct links
3. No server code needed!
4. Still get webhooks for fulfillment

## 📞 Support

- Stripe Support: https://support.stripe.com
- EST AI Consulting: hello@estaiconsulting.com

---

**Ready to accept payments!** 🎉

Start in test mode, verify everything works, then switch to live mode when ready.
