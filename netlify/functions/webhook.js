// Netlify Function for Stripe Webhooks
// Handles payment confirmations and fulfillment

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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
 * Sends confirmation email with course access details
 */
async function fulfillOrder(session) {
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Student';
    const courseName = session.metadata?.courseName;
    const courseId = session.metadata?.courseId;
    const amountPaid = (session.amount_total / 100).toFixed(2);
    const currency = session.currency.toUpperCase();

    console.log('Fulfilling order:', {
        email: customerEmail,
        course: courseName,
        courseId: courseId,
        amount: amountPaid,
        currency: currency
    });

    // Send confirmation email via SendGrid
    if (process.env.SENDGRID_API_KEY && customerEmail) {
        try {
            await sendCourseAccessEmail({
                email: customerEmail,
                name: customerName,
                courseName: courseName,
                courseId: courseId,
                amountPaid: amountPaid,
                currency: currency
            });
            console.log(`✅ Confirmation email sent to ${customerEmail}`);
        } catch (error) {
            console.error('Failed to send email:', error.message);
            // Don't throw - we still want to fulfill the order even if email fails
        }
    } else {
        console.log('⚠️ SendGrid not configured or no customer email - skipping email');
    }

    console.log(`✅ Order fulfilled for ${customerEmail} - ${courseName}`);
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

/**
 * Send course access email via SendGrid
 */
async function sendCourseAccessEmail({ email, name, courseName, courseId, amountPaid, currency }) {
    // Get course-specific details
    const courseDetails = getCourseDetails(courseId);

    const msg = {
        to: email,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL || 'noreply@estaiconsulting.com',
            name: 'EST AI Consulting'
        },
        subject: `Welcome to ${courseName}! Your Course Access Details`,
        text: `Hi ${name},

Thank you for enrolling in ${courseName}!

Your payment of ${currency} ${amountPaid} has been processed successfully.

${courseDetails.accessInstructions}

Course Details:
${courseDetails.details}

What's Next:
${courseDetails.nextSteps}

If you have any questions, reply to this email or contact us at hello@estaiconsulting.com.

Welcome aboard!
The EST AI Consulting Team`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${courseName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to EST AI Consulting!</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">Hi ${name},</p>

                            <p style="font-size: 16px; color: #333; margin: 0 0 20px;">
                                Thank you for enrolling in <strong>${courseName}</strong>!
                            </p>

                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 14px; color: #666;">Payment Confirmation</p>
                                <p style="margin: 10px 0 0; font-size: 24px; color: #10b981; font-weight: bold;">${currency} ${amountPaid}</p>
                            </div>

                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px;">📚 ${courseDetails.title}</h2>
                            <div style="color: #555; line-height: 1.6;">
                                ${courseDetails.htmlDetails}
                            </div>

                            <h2 style="color: #333; font-size: 20px; margin: 30px 0 15px;">🚀 What's Next?</h2>
                            <div style="color: #555; line-height: 1.6;">
                                ${courseDetails.htmlNextSteps}
                            </div>

                            <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                    <strong>Need Help?</strong><br>
                                    Reply to this email or contact us at <a href="mailto:hello@estaiconsulting.com" style="color: #3b82f6;">hello@estaiconsulting.com</a>
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                EST AI Consulting<br>
                                Empowering businesses through AI education
                            </p>
                            <p style="margin: 15px 0 0; font-size: 12px; color: #999;">
                                © ${new Date().getFullYear()} EST AI Consulting. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    };

    await sgMail.send(msg);
}

/**
 * Get course-specific access details
 */
function getCourseDetails(courseId) {
    const courses = {
        'ai-fundamentals-self-paced': {
            title: 'AI Fundamentals - Self-Paced',
            accessInstructions: 'You now have lifetime access to all course materials.',
            details: `• 4-week comprehensive curriculum
• Self-paced learning
• Access to all recorded lessons
• Community forum access
• Downloadable resources and templates`,
            htmlDetails: `
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">4-week comprehensive curriculum</li>
                    <li style="margin-bottom: 10px;">Self-paced learning</li>
                    <li style="margin-bottom: 10px;">Access to all recorded lessons</li>
                    <li style="margin-bottom: 10px;">Community forum access</li>
                    <li style="margin-bottom: 10px;">Downloadable resources and templates</li>
                </ul>`,
            nextSteps: `1. Check your email for course platform login credentials (arriving within 24 hours)
2. Join our private community Slack channel
3. Download the course syllabus and schedule
4. Start with Module 1: Introduction to AI`,
            htmlNextSteps: `
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Check your email for course platform login credentials (arriving within 24 hours)</li>
                    <li style="margin-bottom: 10px;">Join our private community Slack channel</li>
                    <li style="margin-bottom: 10px;">Download the course syllabus and schedule</li>
                    <li style="margin-bottom: 10px;">Start with Module 1: Introduction to AI</li>
                </ol>`
        },
        'ai-fundamentals-cohort': {
            title: 'AI Fundamentals - Cohort-Based',
            accessInstructions: 'You are enrolled in our next cohort starting soon!',
            details: `• 4-week instructor-led program
• Live sessions every week
• Direct instructor access
• Peer collaboration
• Certificate of completion`,
            htmlDetails: `
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">4-week instructor-led program</li>
                    <li style="margin-bottom: 10px;">Live sessions every week</li>
                    <li style="margin-bottom: 10px;">Direct instructor access</li>
                    <li style="margin-bottom: 10px;">Peer collaboration</li>
                    <li style="margin-bottom: 10px;">Certificate of completion</li>
                </ul>`,
            nextSteps: `1. You'll receive cohort start date and schedule within 48 hours
2. Join the cohort Slack channel invitation
3. Complete the pre-course survey
4. Prepare questions for the kickoff session`,
            htmlNextSteps: `
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">You'll receive cohort start date and schedule within 48 hours</li>
                    <li style="margin-bottom: 10px;">Join the cohort Slack channel invitation</li>
                    <li style="margin-bottom: 10px;">Complete the pre-course survey</li>
                    <li style="margin-bottom: 10px;">Prepare questions for the kickoff session</li>
                </ol>`
        },
        'business-leaders-executive': {
            title: 'AI for Business Leaders - Executive Cohort',
            accessInstructions: 'Welcome to our executive program!',
            details: `• 6-week executive program
• Strategic AI implementation
• 1-on-1 consulting sessions
• Custom AI roadmap for your business
• Executive peer network`,
            htmlDetails: `
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">6-week executive program</li>
                    <li style="margin-bottom: 10px;">Strategic AI implementation</li>
                    <li style="margin-bottom: 10px;">1-on-1 consulting sessions</li>
                    <li style="margin-bottom: 10px;">Custom AI roadmap for your business</li>
                    <li style="margin-bottom: 10px;">Executive peer network</li>
                </ul>`,
            nextSteps: `1. Schedule your kickoff 1-on-1 strategy session
2. Complete the executive assessment form
3. Join the executive cohort network
4. Receive personalized program timeline`,
            htmlNextSteps: `
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Schedule your kickoff 1-on-1 strategy session</li>
                    <li style="margin-bottom: 10px;">Complete the executive assessment form</li>
                    <li style="margin-bottom: 10px;">Join the executive cohort network</li>
                    <li style="margin-bottom: 10px;">Receive personalized program timeline</li>
                </ol>`
        },
        'business-leaders-team': {
            title: 'AI for Business Leaders - Team Package',
            accessInstructions: 'Your team is enrolled!',
            details: `• Team enrollment (up to 5 members)
• Customized curriculum for your organization
• Dedicated account manager
• Team workshops and collaboration sessions
• Post-program implementation support`,
            htmlDetails: `
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Team enrollment (up to 5 members)</li>
                    <li style="margin-bottom: 10px;">Customized curriculum for your organization</li>
                    <li style="margin-bottom: 10px;">Dedicated account manager</li>
                    <li style="margin-bottom: 10px;">Team workshops and collaboration sessions</li>
                    <li style="margin-bottom: 10px;">Post-program implementation support</li>
                </ul>`,
            nextSteps: `1. Your account manager will contact you within 24 hours
2. Submit team member information
3. Schedule team kickoff meeting
4. Receive customized program proposal`,
            htmlNextSteps: `
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Your account manager will contact you within 24 hours</li>
                    <li style="margin-bottom: 10px;">Submit team member information</li>
                    <li style="margin-bottom: 10px;">Schedule team kickoff meeting</li>
                    <li style="margin-bottom: 10px;">Receive customized program proposal</li>
                </ol>`
        }
    };

    return courses[courseId] || {
        title: 'Your EST AI Course',
        accessInstructions: 'You now have access to your course.',
        details: 'Course details will be sent separately.',
        htmlDetails: '<p>Course details will be sent separately.</p>',
        nextSteps: 'Check your email for access instructions.',
        htmlNextSteps: '<p>Check your email for access instructions.</p>'
    };
}
