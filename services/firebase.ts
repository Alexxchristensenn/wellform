/**
 * Firebase Configuration and Services
 * 
 * Handles authentication and Firestore database operations.
 * Uses LAZY initialization to prevent crashes when env vars are missing.
 * All operations are wrapped in try-catch for graceful error handling.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously as firebaseSignInAnonymously,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  Firestore,
} from 'firebase/firestore';
import { UserProfile } from '../types/schema';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Lazy initialization - only initialize when needed
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;

/**
 * Check if Firebase is properly configured
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey && 
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'undefined'
  );
}

/**
 * Get Firebase app instance (lazy initialization)
 */
function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Set EXPO_PUBLIC_FIREBASE_* environment variables.');
    return null;
  }
  
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

/**
 * Get Auth instance (lazy initialization)
 */
function getAuthInstance(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
}

/**
 * Get Firestore instance (lazy initialization)
 */
function getFirestoreInstance(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  
  if (!_db) {
    _db = getFirestore(app);
  }
  return _db;
}

/**
 * Sign in anonymously
 * Creates a temporary account that can be upgraded later
 * Returns null if Firebase is not configured (allows testing without backend)
 */
export async function signInAnonymously(): Promise<string | null> {
  const auth = getAuthInstance();
  
  if (!auth) {
    console.warn('Firebase Auth not available. Running in offline mode.');
    // Return a mock UID for development/testing
    return `mock_${Date.now()}`;
  }

  try {
    const result = await firebaseSignInAnonymously(auth);
    return result.user.uid;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    // Return mock UID as fallback
    return `mock_${Date.now()}`;
  }
}

/**
 * Save user profile to Firestore
 * Path: users/{uid}
 * Returns true even if Firebase is not configured (graceful degradation)
 */
export async function saveUserProfile(
  uid: string, 
  profile: Omit<UserProfile, 'profile'> & { profile: Omit<UserProfile['profile'], 'createdAt'> }
): Promise<boolean> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available. Profile not saved to cloud.');
    // TODO: Consider saving to AsyncStorage for offline support
    return true; // Return true to allow navigation to continue
  }

  try {
    const userRef = doc(db, 'users', uid);
    
    // Build the full profile with timestamp
    const fullProfile: UserProfile = {
      profile: {
        ...profile.profile,
        createdAt: new Date().toISOString(),
      },
      stats: profile.stats,
      subscription: {
        tier: 'free',
        expiry: null,
      },
    };

    await setDoc(userRef, fullProfile);
    return true;
  } catch (error) {
    console.error('Failed to save user profile:', error);
    return false;
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available.');
    return null;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}
