// Standalone auth bundle for use in HTML files
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  addDoc,
  collection
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzKfoL5IGnhWs3cm8Qfi6gmSFz5nJAdro",
  authDomain: "est-ai-consulting-ed90c.firebaseapp.com",
  projectId: "est-ai-consulting-ed90c",
  storageBucket: "est-ai-consulting-ed90c.firebasestorage.app",
  messagingSenderId: "59145797512",
  appId: "1:59145797512:web:9e0567d80727985fcac43d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth functions
export async function registerUser(email, password, userData) {
  try {
    console.log('Creating user in Firebase Auth...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created in Auth:', user.uid);

    console.log('Updating user profile...');
    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    console.log('Saving user data to Firestore...');
    const userDocData = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company || '',
      phone: userData.phone || '',
      role: userData.role || '',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), userDocData);
    console.log('User data saved to Firestore successfully');

    return user;
  } catch (error) {
    console.error('Registration error in auth-bundle:', error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login timestamp
    await setDoc(
      doc(db, 'users', user.uid),
      { lastLogin: serverTimestamp() },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export function isAuthenticated() {
  return auth.currentUser !== null;
}

export function getCurrentUser() {
  return auth.currentUser;
}

// Wait for auth state to be ready before checking
export function waitForAuthReady() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Improved auth check that waits for Firebase to initialize
export async function checkAuthAndRedirect(redirectUrl = '/register.html') {
  const user = await waitForAuthReady();
  if (!user) {
    const currentPage = window.location.pathname;
    window.location.href = `${redirectUrl}?redirect=${encodeURIComponent(currentPage)}`;
    return false;
  }
  return true;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Export db and serverTimestamp for contact form
export { db, serverTimestamp, addDoc, collection };
