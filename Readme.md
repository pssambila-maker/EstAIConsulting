# EST AI Consulting & Training

Professional AI consulting and training services website.

**Live Site:** [https://estaiconsulting.com](https://estaiconsulting.com)

## Features
- Beautiful landing page with modern design
- Three detailed course pages (AI Fundamentals, Business Leaders, Custom Training)
- Stripe payment integration with serverless functions
- Fully responsive design across all devices
- Auto-deployment from GitHub to Netlify
- Custom domain with automatic HTTPS/SSL

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Payments:** Stripe Checkout with webhooks
- **Backend:** Netlify Functions (serverless)
- **Hosting:** Netlify
- **Version Control:** GitHub
- **Domain:** Porkbun DNS

## Quick Start

### Prerequisites
- GitHub account
- Netlify account (free tier)
- Stripe account
- Custom domain (optional)

### Deployment
See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for complete deployment instructions.

### Local Development
```bash
# Clone the repository
git clone https://github.com/pssambila-maker/EstAIConsulting.git
cd EstAIConsulting

# Install dependencies
npm install

# Run locally with Netlify Dev
npm run dev
```

## Project Structure
```
EstAIConsulting/
├── index.html              # Main landing page
├── ai-fundamentals.html    # AI Fundamentals course page
├── ai-business-leaders.html # Business Leaders course page
├── custom-ai-training.html # Custom training page
├── success.html            # Payment success page
├── cancel.html             # Payment cancelled page
├── styles.css              # Main stylesheet
├── course.css              # Course-specific styles
├── script.js               # Main JavaScript
├── course.js               # Course page interactions
├── payment.js              # Stripe payment integration
├── logo.svg                # EST AI Consulting logo
├── netlify/functions/      # Serverless functions
│   ├── create-checkout-session.js
│   └── webhook.js
├── package.json            # Dependencies
└── README.md               # This file
```

## Environment Variables

Required environment variables (set in Netlify):
```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRICE_AI_FUNDAMENTALS_SELF_PACED=price_...
PRICE_AI_FUNDAMENTALS_COHORT=price_...
PRICE_BUSINESS_LEADERS_EXECUTIVE=price_...
PRICE_BUSINESS_LEADERS_TEAM=price_...
```

## Stripe Configuration

1. Create products in Stripe Dashboard
2. Get Price IDs for each product
3. Add to Netlify environment variables
4. Set up webhook endpoint: `https://estaiconsulting.com/.netlify/functions/webhook`

See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed instructions.

## Contributing

This is a production website for EST AI Consulting. For issues or questions, please contact the development team.

## License

© 2024 EST AI Consulting. All rights reserved.