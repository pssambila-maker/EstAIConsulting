// Firebase Configuration
// Replace these values with your actual Firebase project credentials

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// TODO: Replace with your Firebase project configuration
// You can find this in Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBzKfoL5IGnhWs3cm8Qfi6gmSFz5nJAdro",
  authDomain: "est-ai-consulting-ed90c.firebaseapp.com",
  projectId: "est-ai-consulting-ed90c",
  storageBucket: "est-ai-consulting-ed90c.firebasestorage.app",
  messagingSenderId: "59145797512",
  appId: "1:59145797512:web:9e0567d80727985fcac43d"
  // measurementId: "G-XXXXXXXXXX" // Optional - Add this if you enable Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (optional, only in production)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
