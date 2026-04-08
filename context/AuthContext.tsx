/**
 * AuthContext — wraps Firebase Auth state so any screen can access the
 * current user without prop-drilling.
 *
 * When Firebase is unavailable: loading stops immediately, skipAuth is the only way in.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, firebaseAvailable } from '../lib/firebase';

// Fake user for dev bypass — has uid so useHealthData can treat as "local only"
const GUEST_USER = { uid: 'guest', email: 'guest@local' } as User;

const GUEST_STORAGE_KEY = 'groundchiflow_guest';

/** Admin email — bypasses subscription verification. See docs/ACCESS_GUIDE.md */
export const ADMIN_EMAIL = 'admin@groundchiflow.com';

interface AuthContextType {
  user: User | null;
  /** True until first auth state is known (Firebase off or first onAuthStateChanged). Root layout uses this — not sign-in button. */
  initializing: boolean;
  /** True while sign-in / sign-up request is in flight. Does not unmount the login screen. */
  authPending: boolean;
  devBypass: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  skipAuth: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authPending, setAuthPending] = useState(false);
  const [devBypass, setDevBypass] = useState(() => {
    if (typeof sessionStorage === 'undefined') return false;
    try {
      return sessionStorage.getItem(GUEST_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !firebaseAvailable) {
      setInitializing(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    const timeout = setTimeout(() => setInitializing(false), 5000);
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth || !firebaseAvailable) {
      setError('Sign-in is not available. Please check your connection or contact support.');
      return;
    }
    try {
      setError(null);
      setAuthPending(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(friendlyError(err?.code || ''));
    } finally {
      setAuthPending(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth || !firebaseAvailable) {
      setError('Sign-up is not available. Please check your connection or contact support.');
      return;
    }
    try {
      setError(null);
      setAuthPending(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(friendlyError(err?.code || ''));
    } finally {
      setAuthPending(false);
    }
  };

  const signOut = async () => {
    setDevBypass(false);
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {}
    if (auth && firebaseAvailable) {
      try {
        await firebaseSignOut(auth);
      } catch (err: any) {
        setError(err?.message || 'Sign out failed');
      }
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth || !firebaseAvailable) {
      setError('Password reset is not available. Please check your connection or contact support.');
      return;
    }
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email.trim());
      // Success: Firebase sends the email; we don't set error
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setError('No account found with this email. Try signing up.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err?.message || 'Could not send reset email. Try again.');
      }
    }
  };

  const skipAuth = () => {
    try {
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(GUEST_STORAGE_KEY, '1');
    } catch {}
    setDevBypass(true);
    setInitializing(false);
  };

  const clearError = () => setError(null);

  const effectiveUser = devBypass ? GUEST_USER : user;
  const isAdmin = !!(effectiveUser?.email && effectiveUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        initializing,
        authPending,
        devBypass,
        isAdmin,
        signIn,
        signUp,
        signOut,
        resetPassword,
        skipAuth,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-api-key':
    case 'auth/configuration-not-found':
      return 'Sign-in is not available. Please contact support.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. In Firebase Console → Authentication → Settings, add this site under Authorized domains (e.g. howell-forge.com and your GitHub Pages host).';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.';
    default:
      return `${code ? code + ' — ' : ''}Something went wrong. Please try again.`;
  }
}
