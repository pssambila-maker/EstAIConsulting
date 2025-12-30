# Firebase Setup Guide for EST AI Consulting

This guide will help you configure Firebase for your EST AI Consulting website with authentication and Firestore database.

## Prerequisites

- Firebase account (create one at [https://firebase.google.com](https://firebase.google.com))
- Your Firebase project: **EST AI Consulting**

## Step 1: Firebase Console Setup

### 1.1 Access Your Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **EST AI Consulting**

### 1.2 Enable Authentication
1. In the Firebase Console, click **Authentication** in the left sidebar
2. Click **Get Started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**

### 1.3 Create Firestore Database
1. In the Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in production mode** (we'll add rules later)
4. Choose your database location (choose closest to your users, e.g., `us-central`)
5. Click **Enable**

### 1.4 Set Firestore Security Rules
1. In Firestore Database, click on the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow admins to read all users (you can add admin check later)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 2: Get Firebase Configuration

### 2.1 Register Your Web App
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`) to add a web app
4. Register app:
   - App nickname: `EST AI Consulting Web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click **Register app**

### 2.2 Copy Firebase Config
1. You'll see your Firebase configuration object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

2. Copy these values

### 2.3 Update Your Project Configuration
1. Open `src/firebase/config.ts` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Step 3: Deploy to Firebase Hosting

### 3.1 Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase
```bash
firebase login
```

### 3.3 Initialize Firebase in Your Project
```bash
firebase init
```

Select:
- **Hosting**: Configure files for Firebase Hosting
- Use existing project: **EST AI Consulting**
- Public directory: `dist`
- Configure as single-page app: **No**
- Set up automatic builds with GitHub: **No** (optional)

### 3.4 Build Your Project
```bash
npm run build
```

### 3.5 Deploy to Firebase
```bash
firebase deploy
```

## Step 4: Stripe Integration (Optional - For Future Payment Processing)

### 4.1 Create Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a Stripe account

### 4.2 Get Stripe Keys
1. Go to Stripe Dashboard
2. Click **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**

### 4.3 Install Stripe Firebase Extension (Recommended)
1. In Firebase Console, go to **Extensions**
2. Search for "Run Payments with Stripe"
3. Click **Install**
4. Follow the setup wizard and enter your Stripe keys

## Step 5: Test Your Setup

### 5.1 Test Registration
1. Visit your deployed site
2. Click on any gated page (Services, Get Started, Contact)
3. You should be redirected to the registration page
4. Create a test account
5. Verify you're redirected to the protected page

### 5.2 Verify Firestore
1. Go to Firebase Console → Firestore Database
2. You should see a new document in the `users` collection
3. Verify it contains:
   - User email
   - First name, last name
   - Company, phone, role (if provided)
   - Timestamps

### 5.3 Test Login
1. Logout (or use incognito mode)
2. Try accessing a gated page
3. Click "Login" tab
4. Login with your test credentials
5. Verify successful redirect

## User Flow Summary

### Free Access (No Registration):
- ✅ Landing Page (animated homepage)
- ✅ About Page (company info & training programs)

### Gated Content (Registration Required):
- 🔒 Services Page
- 🔒 Get Started Page
- 🔒 Contact Form (on Services page)

### Registration Benefits:
When users register, you collect:
- Email address
- Full name (first & last)
- Company name
- Phone number (optional)
- Role/Position

This data is stored in Firestore and you can:
- Contact them even if they don't submit the contact form
- Build an email marketing list
- Track user engagement
- Follow up with personalized outreach

## Firestore Data Structure

### Users Collection
```
users/
  {userId}/
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

## Environment Variables (Production Best Practice)

For production, you should use environment variables:

1. Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. Update `src/firebase/config.ts` to use env variables:
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## Troubleshooting

### Issue: "Firebase: Error (auth/popup-blocked)"
- Solution: Ensure popups are allowed for your domain

### Issue: "Firebase: Error (auth/network-request-failed)"
- Solution: Check your internet connection and Firebase project status

### Issue: Users can't access protected pages after login
- Solution: Check browser console for errors, verify Firebase config is correct

### Issue: Firestore permission denied
- Solution: Check Firestore security rules are set correctly

## Next Steps

1. ✅ Configure Firebase credentials
2. ✅ Test registration and login
3. ✅ Deploy to Firebase Hosting
4. 📧 Set up email verification (optional)
5. 💳 Configure Stripe for payments (optional)
6. 📊 Set up Firebase Analytics
7. 🔔 Add email notifications for new registrations

## Support

For issues or questions:
- Firebase Documentation: https://firebase.google.com/docs
- Stripe Documentation: https://stripe.com/docs
- Create an issue in this repository

---

**Important Security Note**: Never commit your Firebase configuration with actual credentials to a public repository. Always use environment variables for sensitive data.
