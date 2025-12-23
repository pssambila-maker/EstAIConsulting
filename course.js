// FAQ Toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Enrollment form submission
const enrollmentForm = document.querySelector('.enrollment-form');

if (enrollmentForm) {
    enrollmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(enrollmentForm);

        // Show success message
        showNotification('Thank you for your enrollment! We\'ll contact you within 24 hours to complete your registration.', 'success');

        // Reset form
        enrollmentForm.reset();

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scroll to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll for curriculum modules
const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 100);
            moduleObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.week-module').forEach(module => {
    module.style.opacity = '0';
    moduleObserver.observe(module);
});

// Highlight active navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Add price highlighting on hover
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('featured-pricing')) {
            this.style.borderColor = 'var(--primary-color)';
        }
    });

    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('featured-pricing')) {
            this.style.borderColor = 'var(--border-color)';
        }
    });
});

// Track enrollment button clicks for analytics
document.querySelectorAll('.btn-pricing, .course-cta a').forEach(button => {
    button.addEventListener('click', function(e) {
        const planType = this.closest('.pricing-card')?.querySelector('h3')?.textContent || 'General';
        console.log(`Enrollment interest: ${planType}`);

        // You can add analytics tracking here
        // Example: gtag('event', 'enrollment_click', { plan: planType });
    });
});

// Add notification for special offers (optional)
function showSpecialOffer() {
    const hasSeenOffer = sessionStorage.getItem('seenOffer');

    if (!hasSeenOffer) {
        setTimeout(() => {
            const offerMessage = 'Limited time offer: Enroll this week and get 20% off! Use code AISTART20';
            showNotification(offerMessage, 'info');
            sessionStorage.setItem('seenOffer', 'true');
        }, 5000);
    }
}

// Uncomment to enable special offer notification
// showSpecialOffer();

// Enhanced notification function with different types
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };

    const icons = {
        success: '✓',
        error: '⚠',
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
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 7000);
}
