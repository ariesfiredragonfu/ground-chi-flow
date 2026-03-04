/**
 * Firebase configuration for GroundChiFlow
 *
 * FAIL-SAFE: If Firebase config is missing or invalid, the app still runs.
 * Auth and Firestore use AsyncStorage fallback when Firebase is unavailable.
 *
 * SETUP: Add EXPO_PUBLIC_FIREBASE_* vars to .env for full Firebase features.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, enableNetwork, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
export let firebaseAvailable = false;

function initFirebase(): boolean {
  if (app) return firebaseAvailable;

  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !projectId || typeof apiKey !== 'string' || apiKey.length < 10) {
    return false;
  }

  try {
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    };

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : (getApps()[0] as FirebaseApp);
    _auth = getAuth(app);
    _db = getFirestore(app);
    enableNetwork(_db).catch(() => {});
    firebaseAvailable = true;
    return true;
  } catch {
    return false;
  }
}

initFirebase();

// Export auth — null when Firebase unavailable
export const auth: Auth | null = _auth;

// Export db — null when Firebase unavailable (useHealthData checks this)
export const db: Firestore | null = _db;

export default app;
