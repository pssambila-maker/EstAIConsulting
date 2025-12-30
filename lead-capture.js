// Lead Capture System for EST AI Consulting
// Manages popup, form submission, and access control to gated content

// Check if user has already submitted lead form
function hasSubmittedLead() {
    return localStorage.getItem('leadSubmitted') === 'true';
}

// Store lead submission
function markLeadSubmitted(leadData) {
    localStorage.setItem('leadSubmitted', 'true');
    localStorage.setItem('leadEmail', leadData.email);
    localStorage.setItem('leadName', leadData.name);
    localStorage.setItem('leadInterest', leadData.interest);
}

// Get stored lead data
function getLeadData() {
    return {
        email: localStorage.getItem('leadEmail') || '',
        name: localStorage.getItem('leadName') || '',
        interest: localStorage.getItem('leadInterest') || ''
    };
}

// Show lead capture popup
function showLeadCapturePopup(courseInterest = '') {
    // Check if already submitted
    if (hasSubmittedLead()) {
        return true; // Allow access
    }

    const popup = document.getElementById('leadCapturePopup');
    if (!popup) {
        console.error('Lead capture popup not found');
        return false;
    }

    // Pre-select course interest if provided
    if (courseInterest) {
        const interestSelect = popup.querySelector('select[name="course-interest"]');
        if (interestSelect) {
            interestSelect.value = courseInterest;
        }
    }

    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    return false;
}

// Hide lead capture popup
function hideLeadCapturePopup() {
    const popup = document.getElementById('leadCapturePopup');
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }
}

// Handle form submission
async function handleLeadFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Get form data
    const formData = new FormData(form);
    const leadData = {
        name: formData.get('name'),
        email: formData.get('email'),
        interest: formData.get('course-interest')
    };

    // Validate
    if (!leadData.name || !leadData.email || !leadData.interest) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        // Submit to Netlify Forms in the background
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'form-name': 'lead-capture',
                ...leadData
            }).toString()
        }).catch(err => console.log('Background form submission:', err));

        // Store lead data immediately (don't wait for Netlify Forms)
        markLeadSubmitted(leadData);

        // Show success message
        showNotification('Thank you! Full course details unlocked.', 'success');

        // Hide popup after short delay
        setTimeout(() => {
            hideLeadCapturePopup();

            // Reload page to show gated content or redirect to course page
            const currentPage = window.location.pathname;
            if (currentPage === '/' || currentPage.includes('index.html')) {
                // Redirect to appropriate course page based on interest
                redirectToCourse(leadData.interest);
            } else {
                // Reload current course page to show gated content
                window.location.reload();
            }
        }, 1500);
    } catch (error) {
        console.error('Lead capture error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// Redirect to appropriate course page
function redirectToCourse(interest) {
    const courseMap = {
        'ai-fundamentals': '/ai-fundamentals.html',
        'business-leaders': '/ai-business-leaders.html',
        'custom-training': '/custom-ai-training.html'
    };

    const targetPage = courseMap[interest];
    if (targetPage) {
        window.location.href = targetPage;
    } else {
        // Default to fundamentals or reload current page
        window.location.reload();
    }
}

// Show/hide gated content based on lead submission
function checkGatedContent() {
    const hasAccess = hasSubmittedLead();

    // Find all gated content sections
    const gatedSections = document.querySelectorAll('.gated-content');
    const gatedOverlays = document.querySelectorAll('.gated-overlay');

    if (hasAccess) {
        // Show gated content
        gatedSections.forEach(section => {
            section.classList.remove('hidden');
            section.style.display = 'block';
        });

        // Remove overlays
        gatedOverlays.forEach(overlay => {
            overlay.remove();
        });
    } else {
        // Hide gated content
        gatedSections.forEach(section => {
            section.classList.add('hidden');
            section.style.display = 'none';
        });
    }
}

// Utility: Show notification (reuse from payment.js style)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.lead-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `lead-notification lead-notification-${type}`;

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
        z-index: 10001;
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check and show/hide gated content
    checkGatedContent();

    // Set up form submission handler
    const leadForm = document.getElementById('leadCaptureForm');
    if (leadForm) {
        leadForm.addEventListener('submit', handleLeadFormSubmit);
    }

    // Set up close button
    const closeButton = document.querySelector('.popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', hideLeadCapturePopup);
    }

    // Close popup when clicking overlay
    const popup = document.getElementById('leadCapturePopup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                hideLeadCapturePopup();
            }
        });
    }

    // Handle "Learn More" buttons on landing page
    const learnMoreButtons = document.querySelectorAll('.btn-learn-more');
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseInterest = this.getAttribute('data-course');
            const targetUrl = this.getAttribute('href');

            if (hasSubmittedLead()) {
                // Already submitted, go directly to course page
                window.location.href = targetUrl;
            } else {
                // Show lead capture popup
                showLeadCapturePopup(courseInterest);
            }
        });
    });

    // Pre-fill email in Stripe checkout if available
    const leadData = getLeadData();
    if (leadData.email && typeof window.updateStripeEmail === 'function') {
        window.updateStripeEmail(leadData.email);
    }
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        hasSubmittedLead,
        showLeadCapturePopup,
        hideLeadCapturePopup,
        getLeadData
    };
}
