// Netlify Function for Stripe Webhooks
// Handles payment confirmations and fulfillment

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let stripeEvent;

    try {
        // Verify webhook signature
        stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            webhookSecret
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: `Webhook Error: ${err.message}`
            })
        };
    }

    // Handle the event
    try {
        switch (stripeEvent.type) {
            case 'checkout.session.completed':
                const session = stripeEvent.data.object;
                console.log('Payment successful:', session.id);

                // Fulfill the order
                await fulfillOrder(session);
                break;

            case 'payment_intent.payment_failed':
                const paymentIntent = stripeEvent.data.object;
                console.log('Payment failed:', paymentIntent.id);

                // Handle payment failure
                await handlePaymentFailure(paymentIntent);
                break;

            default:
                console.log(`Unhandled event type: ${stripeEvent.type}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ received: true })
        };

    } catch (error) {
        console.error('Webhook handler error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Webhook handler failed',
                message: error.message
            })
        };
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
