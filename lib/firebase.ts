/**
 * Firebase configuration for GroundChiFlow
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com and create a new project
 *    called "GroundChiFlow" (or similar).
 * 2. Enable Authentication → Email/Password in the Firebase console.
 * 3. (Optional) Enable Firestore Database for cloud persistence.
 * 4. In Project Settings → "Your apps" → Add app → Web app (</>),
 *    register the app and copy the firebaseConfig object below.
 * 5. Replace the placeholder values with your actual Firebase credentials.
 * 6. For production, move these to environment variables using
 *    expo-constants or a .env file (never commit real keys to git).
 *
 * REQUIRED PACKAGES (already installed):
 *   firebase (^12.x)
 *
 * OPTIONAL — for Firestore persistence on native:
 *   npx expo install @react-native-firebase/app @react-native-firebase/auth
 *   (The modular Firebase JS SDK used here works well for Expo Go / web)
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Values come from .env (EXPO_PUBLIC_* vars are auto-exposed by Expo — no extra packages needed)
// To set up: fill in .env at the project root, then restart the dev server.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initializing when hot-reloading in development
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
