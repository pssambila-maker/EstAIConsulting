# EST AI Consulting Website

A modern, professional AI consulting website with authentication-gated content for lead generation.

## 🌟 Features

- **Animated Landing Page** - Eye-catching neural network animation with color-cycling effects
- **Firebase Authentication** - Secure user registration and login
- **Lead Capture System** - Users must register to access premium content
- **Firestore Database** - Automatic storage of user data for follow-up
- **Stripe Ready** - Payment integration prepared for future services
- **Professional Design** - Navy-blue gradient with purple/cyan accents
- **Mobile Responsive** - Optimized for all devices

## 📄 Pages

### Free Access (No Registration):
- **Landing Page** (`/`) - Animated homepage with navigation
- **About & Training** (`/ai-business-leaders.html`) - Company info and training programs

### Protected Content (Registration Required):
- **Services** (`/custom-ai-training.html`) - AI consulting services with contact form
- **Get Started** (`/ai-fundamentals.html`) - Onboarding and packages
- **Contact Form** - Integrated in Services page

### Authentication:
- **Register/Login** (`/register.html`) - User authentication portal

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Firebase account
- Firebase project: "EST AI Consulting"

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5174

### Configure Firebase

1. Open `src/firebase/config.ts`
2. Replace placeholder values with your Firebase credentials
3. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions

### Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## 📚 Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase configuration guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment and testing instructions

## 🎨 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Hosting**: Firebase Hosting
- **Payments**: Stripe (ready for integration)
- **Styling**: Inline styles (no CSS framework needed)

## 🔐 Authentication Flow

1. User visits landing page (free access)
2. User browses About page (free access)
3. User clicks on Services/Get Started/Contact
4. Redirected to registration page
5. User registers with:
   - Email & Password
   - First & Last Name
   - Company Name (optional)
   - Phone Number (optional)
   - Role/Position (optional)
6. Data saved to Firestore
7. User gains access to all protected content

## 💼 Lead Generation Strategy

**Key Benefit**: You capture user contact information BEFORE they even inquire about services!

### What You Collect:
- Full name
- Email address
- Company name
- Phone number
- Job role
- Registration date
- Last login timestamp

### Use Cases:
- Email marketing campaigns
- Personalized outreach
- Lead nurturing sequences
- Follow-up even if they don't submit contact form
- Sales pipeline management

## 🎨 Color Scheme

- **Background**: Navy-blue gradient (`#0a0f1e` → `#1a1f3a`)
- **Primary**: Purple (`#8a2be2`)
- **Accent**: Cyan (`#00d4ff`)
- **Text**: White/Light grey

More professional than pure black, better for business consulting, makes animations pop!

## 📊 Data Structure

### Firestore - Users Collection
```javascript
users/{userId}/
  - uid: string
  - email: string
  - firstName: string
  - lastName: string
  - company: string
  - phone: string
  - role: string
  - createdAt: timestamp
  - lastLogin: timestamp
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Common Issues

**Firebase not configured:**
- Update `src/firebase/config.ts` with your credentials

**Protected pages accessible without login:**
- Check auth protection script is present

**Registration fails:**
- Enable Email/Password auth in Firebase Console
- Create Firestore database

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for more troubleshooting.

## 📈 Next Steps

After deployment:
1. Monitor registrations in Firebase Console
2. Set up email notifications
3. Create email campaigns
4. Add Stripe payment forms
5. Implement analytics
6. SEO optimization
7. Add more content/resources

## 📞 Support

For setup questions, see:
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📄 License

Private - EST AI Consulting

## 🎯 Project Status

✅ **Ready for Deployment**

Todo before going live:
- [ ] Configure Firebase credentials
- [ ] Test registration flow
- [ ] Deploy to Firebase Hosting
- [ ] Test on production URL
- [ ] Set up Google Analytics
- [ ] Configure Stripe (optional)

---

Built with ❤️ for EST AI Consulting
