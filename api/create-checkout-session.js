// Vercel Serverless Function for Stripe Checkout
// This replaces the Express server for production deployment

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Course configurations with Price IDs
const courses = {
    'ai-fundamentals-self-paced': {
        name: 'AI Fundamentals - Self-Paced',
        price: 497,
        priceId: process.env.PRICE_AI_FUNDAMENTALS_SELF_PACED
    },
    'ai-fundamentals-cohort': {
        name: 'AI Fundamentals - Cohort-Based',
        price: 997,
        priceId: process.env.PRICE_AI_FUNDAMENTALS_COHORT
    },
    'business-leaders-executive': {
        name: 'AI for Business Leaders - Executive Cohort',
        price: 4997,
        priceId: process.env.PRICE_BUSINESS_LEADERS_EXECUTIVE
    },
    'business-leaders-team': {
        name: 'AI for Business Leaders - Team Package',
        price: 12997,
        priceId: process.env.PRICE_BUSINESS_LEADERS_TEAM
    }
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { courseId } = req.body;

        // Validate course ID
        if (!courseId || !courses[courseId]) {
            return res.status(400).json({
                error: 'Invalid course ID',
                validCourses: Object.keys(courses)
            });
        }

        const course = courses[courseId];

        // Validate that Price ID is configured
        if (!course.priceId) {
            return res.status(500).json({
                error: 'Course price not configured. Please add Price ID to environment variables.'
            });
        }

        // Get the domain from the request
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const baseUrl = `${protocol}://${host}`;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: course.priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/cancel.html`,
            metadata: {
                courseId: courseId,
                courseName: course.name,
                coursePrice: course.price
            },
            // Optional: Collect customer information
            customer_email: req.body.email || undefined,
        });

        return res.status(200).json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({
            error: 'Failed to create checkout session',
            message: error.message
        });
    }
};
