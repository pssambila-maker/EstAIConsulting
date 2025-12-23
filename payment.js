// Stripe Payment Integration for EST AI Consulting

// NOTE: Replace 'pk_test_YOUR_PUBLISHABLE_KEY' with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY';

// Initialize Stripe (will be loaded from Stripe.js script)
let stripe;

// Course pricing information
const courses = {
    'ai-fundamentals-self-paced': {
        name: 'AI Fundamentals - Self-Paced',
        price: 497,
        priceId: 'price_YOUR_PRICE_ID_1' // Replace with actual Stripe Price ID
    },
    'ai-fundamentals-cohort': {
        name: 'AI Fundamentals - Cohort-Based',
        price: 997,
        priceId: 'price_YOUR_PRICE_ID_2'
    },
    'business-leaders-executive': {
        name: 'AI for Business Leaders - Executive Cohort',
        price: 4997,
        priceId: 'price_YOUR_PRICE_ID_3'
    },
    'business-leaders-team': {
        name: 'AI for Business Leaders - Team Package',
        price: 12997,
        priceId: 'price_YOUR_PRICE_ID_4'
    }
};

// Initialize Stripe when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load Stripe.js dynamically if not already loaded
    if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => {
            stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            attachPaymentListeners();
        };
        document.head.appendChild(script);
    } else {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        attachPaymentListeners();
    }
});

// Attach event listeners to payment buttons
function attachPaymentListeners() {
    // Find all payment buttons
    const paymentButtons = document.querySelectorAll('[data-course-id]');

    paymentButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseId = this.getAttribute('data-course-id');
            const course = courses[courseId];

            if (course) {
                handlePayment(course, courseId);
            } else {
                console.error('Course not found:', courseId);
                showNotification('Course configuration error. Please contact support.', 'error');
            }
        });
    });
}

// Handle payment process
async function handlePayment(course, courseId) {
    try {
        // Show loading state
        showNotification('Redirecting to secure checkout...', 'info');

        // Create checkout session via Vercel serverless function
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                courseId: courseId,
                courseName: course.name,
                price: course.price,
                priceId: course.priceId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const session = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
            sessionId: session.sessionId
        });

        if (result.error) {
            showNotification(result.error.message, 'error');
        }

    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Unable to process payment. Please try again or contact support.', 'error');
    }
}

// Alternative: Direct Stripe Checkout redirect (if you're using Stripe Payment Links)
function redirectToStripeCheckout(paymentLink) {
    window.location.href = paymentLink;
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.payment-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `payment-notification payment-notification-${type}`;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    const icons = {
        success: '✓',
        error: '✗',
        info: 'ℹ',
        warning: '⚠'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
        line-height: 1;
    `;

    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { handlePayment, redirectToStripeCheckout };
}
