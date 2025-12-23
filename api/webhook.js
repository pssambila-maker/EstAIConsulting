// Vercel Serverless Function for Stripe Webhooks
// Handles payment confirmations and fulfillment

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Helper function to get raw body for webhook signature verification
const getRawBody = (req) => {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            resolve(data);
        });
        req.on('error', reject);
    });
};

module.exports = async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Get raw body for signature verification
        const rawBody = await getRawBody(req);

        // Verify webhook signature
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({
            error: `Webhook Error: ${err.message}`
        });
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Payment successful:', session.id);

                // Fulfill the order
                await fulfillOrder(session);
                break;

            case 'payment_intent.payment_failed':
                const paymentIntent = event.data.object;
                console.log('Payment failed:', paymentIntent.id);

                // Handle payment failure (e.g., send email notification)
                await handlePaymentFailure(paymentIntent);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });

    } catch (error) {
        console.error('Webhook handler error:', error);
        return res.status(500).json({
            error: 'Webhook handler failed',
            message: error.message
        });
    }
};

/**
 * Fulfill the order after successful payment
 * This is where you would:
 * - Send confirmation email
 * - Grant course access
 * - Add to your database/CRM
 * - Send to automation platform
 */
async function fulfillOrder(session) {
    const customerEmail = session.customer_details?.email;
    const courseName = session.metadata?.courseName;
    const courseId = session.metadata?.courseId;

    console.log('Fulfilling order:', {
        email: customerEmail,
        course: courseName,
        courseId: courseId,
        amount: session.amount_total / 100,
        currency: session.currency
    });

    // TODO: Implement fulfillment logic
    // Examples:
    // 1. Send confirmation email with course access
    // 2. Add user to your database
    // 3. Grant access to learning platform
    // 4. Send to CRM (HubSpot, Salesforce, etc.)
    // 5. Trigger automation workflow (Zapier, Make, etc.)
    // 6. Send calendar invite for cohort-based courses

    // Example: Log to console (replace with actual implementation)
    console.log(`✅ Order fulfilled for ${customerEmail} - ${courseName}`);

    // You can integrate with services like:
    // - SendGrid/Mailgun for emails
    // - Your database (MongoDB, PostgreSQL, etc.)
    // - Notion, Airtable for tracking enrollments
    // - Slack for team notifications
}

/**
 * Handle payment failures
 */
async function handlePaymentFailure(paymentIntent) {
    console.log('Payment failed:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        error: paymentIntent.last_payment_error?.message
    });

    // TODO: Implement failure handling
    // - Send notification to admin
    // - Log to monitoring system
    // - Send retry email to customer
}
