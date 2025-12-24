// Netlify Function for Stripe Checkout
// This handles payment processing for EST AI Consulting courses

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

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { courseId } = JSON.parse(event.body);

        // Validate course ID
        if (!courseId || !courses[courseId]) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Invalid course ID',
                    validCourses: Object.keys(courses)
                })
            };
        }

        const course = courses[courseId];

        // Validate that Price ID is configured
        if (!course.priceId) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Course price not configured. Please add Price ID to environment variables.'
                })
            };
        }

        // Get the domain from environment or use the request origin
        const origin = event.headers.origin || 'https://estaiconsulting.com';

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
            success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel.html`,
            metadata: {
                courseId: courseId,
                courseName: course.name,
                coursePrice: course.price
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                sessionId: session.id,
                url: session.url
            })
        };

    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to create checkout session',
                message: error.message
            })
        };
    }
};
