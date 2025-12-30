# Lead Capture System Guide

Complete documentation for the EST AI Consulting lead capture and gating system.

---

## Overview

The lead capture system collects visitor information before allowing access to detailed course pricing and enrollment. This increases conversion rates, builds your email list, and allows for follow-up marketing.

### Implementation: **Option A - Lead Capture Popup**

**Strategy:** Low-friction email capture without full authentication

---

## How It Works

### User Flow

```
1. Visitor lands on homepage
   ↓
2. Sees course overview cards (public)
   ↓
3. Clicks "Learn More" button
   ↓
4. Popup appears (if not previously submitted)
   ↓
5. Fills out: Name, Email, Course Interest
   ↓
6. Submits form
   ↓
7. Redirected to full course page
   ↓
8. Can view pricing and enroll
   ↓
9. On return visits: No popup (remembered via localStorage)
```

### What's Gated vs Public

**Public (No Lead Required):**
- Landing page
- Services section
- About section
- Course overview cards (title, duration, brief description, key features)
- Contact form

**Gated (Lead Required):**
- Detailed course curriculum
- Pricing tiers and payment options
- "Enroll Now" buttons
- Course-specific bonus materials

---

## Technical Implementation

### Files

#### 1. `lead-capture.js`
**Purpose:** Handles all lead capture logic

**Key Functions:**
- `hasSubmittedLead()` - Check if user already submitted
- `markLeadSubmitted(data)` - Store lead data in localStorage
- `showLeadCapturePopup(courseInterest)` - Display popup
- `hideLeadCapturePopup()` - Close popup
- `handleLeadFormSubmit(event)` - Process form submission
- `checkGatedContent()` - Show/hide gated sections based on submission status

**localStorage Keys:**
- `leadSubmitted`: `'true'` if form submitted
- `leadEmail`: User's email address
- `leadName`: User's full name
- `leadInterest`: Selected course interest

#### 2. `lead-capture.css`
**Purpose:** Styles for popup and gated content

**Key Classes:**
- `.lead-popup` - Popup overlay container
- `.popup-container` - Modal content box
- `.lead-form` - Form styling
- `.gated-content` - Content sections that require lead
- `.gated-overlay` - Blur/overlay for gated content

#### 3. `index.html` Updates
**Changes:**
- Added `<link rel="stylesheet" href="lead-capture.css">`
- Added popup HTML before `</body>`
- Updated course buttons with `btn-learn-more` class and `data-course` attributes
- Added `<script src="lead-capture.js"></script>`

---

## Netlify Forms Integration

### How It Works

The lead capture form uses Netlify Forms - a free feature that:
- Automatically processes form submissions
- Sends submissions to your email
- Provides a submissions dashboard
- No backend code required!

### Form Configuration

```html
<form
    id="leadCaptureForm"
    name="lead-capture"
    method="POST"
    data-netlify="true"
    netlify-honeypot="bot-field"
>
    <input type="hidden" name="form-name" value="lead-capture">
    <!-- Form fields -->
</form>
```

**Attributes:**
- `data-netlify="true"` - Enables Netlify Forms
- `netlify-honeypot="bot-field"` - Spam protection
- `name="lead-capture"` - Form identifier

### Viewing Submissions

1. Go to Netlify Dashboard
2. Select your site
3. Click "Forms" in left sidebar
4. Click "lead-capture" form
5. View all submissions with download option

### Email Notifications

**Setup:**
1. Netlify Dashboard → Site → Forms → Form notifications
2. Click "Add notification" → "Email notification"
3. Select "lead-capture" form
4. Enter your email address
5. Save

**You'll receive an email for every submission!**

---

## Form Fields

### Collected Data

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| **Name** | Text | Yes | Personalization, follow-up emails |
| **Email** | Email | Yes | Communication, pre-fill Stripe checkout |
| **Course Interest** | Select | Yes | Segmentation, redirect to appropriate course |

### Course Options

1. **AI Fundamentals** (`ai-fundamentals`) - 4-Week beginner program
2. **AI for Business Leaders** (`business-leaders`) - 6-Week executive program
3. **Custom AI Training** (`custom-training`) - Flexible custom programs
4. **General Inquiry** (`general`) - Not sure yet

---

## User Experience Features

### 1. Smooth Animations
- Popup slides in with fade effect
- Close button rotates on hover
- Form buttons have lift effect

### 2. Form Validation
- HTML5 validation (required fields)
- Email format validation
- Real-time error messages

### 3. Loading States
- Submit button shows "Submitting..." during processing
- Button disabled during submission
- Success notification appears

### 4. Notifications
- Success: Green notification with checkmark
- Error: Red notification with X icon
- Auto-dismiss after 5 seconds
- Manual close button

### 5. Return Visitor Experience
- localStorage remembers submission
- No popup on return visits
- Immediate access to gated content
- Email pre-filled in Stripe checkout

---

## Customization

### Change Popup Text

**Edit `index.html`:**

```html
<div class="popup-header">
    <h2>Your Custom Headline</h2>
    <p>Your custom description</p>
</div>
```

### Change Benefits List

**Edit `index.html`:**

```html
<ul class="popup-benefits">
    <li>Your benefit 1</li>
    <li>Your benefit 2</li>
    <li>Your benefit 3</li>
</ul>
```

### Change Colors

**Edit `lead-capture.css`:**

```css
.popup-header {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

.btn-submit-lead {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Add More Form Fields

**In `index.html`:**

```html
<div class="form-field">
    <label for="field-name">Field Label <span class="required">*</span></label>
    <input type="text" id="field-name" name="field-name" required>
</div>
```

**In `lead-capture.js` (`handleLeadFormSubmit`):**

```javascript
const leadData = {
    name: formData.get('name'),
    email: formData.get('email'),
    interest: formData.get('course-interest'),
    customField: formData.get('field-name') // Add new field
};
```

---

## Integration with Stripe

### Email Pre-fill

When user has submitted lead form, their email is automatically stored and can be used to pre-fill Stripe checkout.

**In `payment.js` (future enhancement):**

```javascript
const leadData = getLeadData();
if (leadData.email) {
    // Pre-fill email in Stripe checkout
    customerEmail: leadData.email
}
```

---

## Analytics & Tracking

### What You Can Track

1. **Form Submissions**
   - Total leads captured
   - Conversion rate (visitors → leads)
   - Course interest breakdown

2. **User Behavior**
   - Which courses get most clicks
   - Drop-off points
   - Return visitor rate

3. **Email Marketing**
   - Build segmented lists based on course interest
   - Send targeted follow-ups
   - Track email-to-enrollment conversion

### Recommended Tools

- **Google Analytics** - Track popup opens, submissions
- **Mailchimp/ConvertKit** - Import leads, automated sequences
- **Zapier** - Auto-sync Netlify Forms → CRM/Email tool

---

## Testing

### Test the Popup

1. Visit homepage
2. Click any "Learn More" button
3. Verify popup appears
4. Fill out form with test data
5. Submit
6. Check:
   - ✅ Notification appears
   - ✅ Popup closes
   - ✅ Redirects to course page
   - ✅ localStorage stores data

### Test Return Visitor

1. After submission, reload homepage
2. Click "Learn More" again
3. Verify:
   - ✅ No popup appears
   - ✅ Goes directly to course page

### Clear Test Data

**In browser console:**
```javascript
localStorage.clear()
location.reload()
```

---

## Troubleshooting

### Popup Doesn't Appear

**Check:**
1. JavaScript console for errors (F12)
2. `lead-capture.js` is loaded (check Network tab)
3. Popup HTML exists in page source
4. No ad blocker interfering

### Form Doesn't Submit

**Check:**
1. Netlify Forms is enabled (`data-netlify="true"`)
2. Form has `name` attribute
3. Hidden `form-name` input exists
4. Site has been deployed to Netlify (forms don't work locally)

### localStorage Not Working

**Check:**
1. Browser allows localStorage (not in private/incognito mode)
2. No browser extensions blocking storage
3. Check browser console for errors

### Email Not Received

**Check:**
1. Netlify Forms email notification is set up
2. Check spam folder
3. Verify email address in Netlify settings
4. Check Netlify Forms submission log

---

## Next Steps: Gating Course Pages

### To Complete Full Implementation

**Update Each Course Page:**
1. Add lead-capture CSS/JS files
2. Wrap pricing section in `.gated-content` class
3. Add unlock overlay for non-submitted visitors
4. Check lead submission status on page load

**Example for `ai-fundamentals.html`:**

```html
<!-- Add to <head> -->
<link rel="stylesheet" href="lead-capture.css">

<!-- Wrap pricing section -->
<div class="gated-content">
    <!-- Pricing cards here -->
</div>

<!-- Add before </body> -->
<script src="lead-capture.js"></script>
```

---

## Marketing Use Cases

### 1. Email Sequences

**Day 0:** Welcome email with course overview PDF
**Day 2:** Share success stories from past students
**Day 5:** Limited-time discount offer
**Day 7:** Final reminder + urgency

### 2. Segmentation

- **AI Fundamentals leads** → Beginner-focused content
- **Business Leaders leads** → Executive case studies, ROI data
- **Custom Training leads** → Enterprise solutions, team packages

### 3. Retargeting

- Facebook/LinkedIn ads to leads who haven't enrolled
- Promote webinars to interested leads
- Showcase testimonials from similar professionals

---

## Privacy & Compliance

### GDPR Compliance

- Clear purpose statement ("Get instant access...")
- Consent checkbox (if required in your jurisdiction)
- Privacy policy link
- Easy opt-out mechanism
- Data deletion on request

### Best Practices

- Never share email addresses
- Use double opt-in for email marketing
- Honor unsubscribe requests immediately
- Store data securely
- Regular backup of submissions

---

## Performance

### Load Time Impact

- CSS: ~3KB (minimal)
- JavaScript: ~8KB (minimal)
- No external dependencies
- Popup loads instantly

### Optimization

- CSS and JS are already minified
- Popup is hidden by default (no render blocking)
- Form submission uses AJAX (no page reload)

---

## Support

### Common Questions

**Q: Will this work locally?**
A: Popup works locally, but Netlify Forms only work when deployed.

**Q: Can I use a different email service?**
A: Yes! You can replace the form submission with any service (Mailchimp, ConvertKit, etc.)

**Q: How do I export leads?**
A: Netlify Dashboard → Forms → Download CSV

**Q: Can I add more questions?**
A: Yes! Just add form fields and update the JavaScript accordingly.

**Q: What if someone clears localStorage?**
A: They'll see the popup again. This is intentional to re-capture if needed.

---

## Summary

✅ **Implemented:** Lead capture popup on landing page
✅ **Collecting:** Name, Email, Course Interest
✅ **Storage:** localStorage + Netlify Forms
✅ **UX:** Smooth animations, validation, notifications
⏳ **Pending:** Gate pricing sections on course detail pages

**Next:** Complete gating implementation on course pages and set up Stripe integration!

---

**Questions or issues?** Check the troubleshooting section or review the code comments in `lead-capture.js`.
