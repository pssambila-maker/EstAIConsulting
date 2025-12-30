// Example Node.js/Express Server for Stripe Integration
// This is a reference implementation - adapt to your backend framework

const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY'); // Replace with your Stripe secret key
const app = express();

app.use(express.json());
app.use(express.static('.')); // Serve static files

// Create Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { courseId, courseName, price, priceId } = req.body;

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId, // Use your Stripe Price ID
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel.html`,
            customer_email: req.body.email, // Optional: pre-fill customer email
            metadata: {
                courseId: courseId,
                courseName: courseName
            },
            // Optional: Collect additional information
            billing_address_collection: 'required',
        });

        res.json({ sessionId: session.id });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook to handle successful payments
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_YOUR_WEBHOOK_SECRET'; // Replace with your webhook secret

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            // Fulfill the purchase
            console.log('Payment successful for:', session.metadata.courseName);

            // TODO:
            // 1. Send confirmation email to customer
            // 2. Grant course access
            // 3. Add to your database
            // 4. Send course materials

            await fulfillOrder(session);
            break;

        case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object;
            console.log('Payment failed:', paymentIntent.id);
            // TODO: Send failure notification
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

// Function to fulfill the order
async function fulfillOrder(session) {
    // Retrieve the session with line items
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items'] }
    );

    const customerEmail = session.customer_details.email;
    const courseName = session.metadata.courseName;

    console.log(`Enrolling ${customerEmail} in ${courseName}`);

    // TODO: Implement your business logic:
    // - Send welcome email with course access
    // - Create user account if needed
    // - Add to learning management system
    // - Send calendar invites for cohort-based courses
}

// Get session details (for success page)
app.get('/session-status', async (req, res) => {
    const sessionId = req.query.session_id;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json({
            status: session.payment_status,
            customer_email: session.customer_details.email,
            course: session.metadata.courseName
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/*
SETUP INSTRUCTIONS:

1. Install dependencies:
   npm install express stripe

2. Set environment variables:
   - STRIPE_SECRET_KEY: Your Stripe secret key
   - STRIPE_WEBHOOK_SECRET: Your webhook signing secret

3. Create products and prices in Stripe Dashboard:
   - Go to Stripe Dashboard > Products
   - Create products for each course
   - Copy the Price IDs to payment.js

4. Set up webhook:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: https://yourdomain.com/webhook
   - Select events: checkout.session.completed, payment_intent.payment_failed
   - Copy webhook signing secret to environment variable

5. Test with Stripe CLI:
   stripe listen --forward-to localhost:3000/webhook

6. Use test card numbers:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002
   - 3D Secure: 4000 0027 6000 3184
*/
