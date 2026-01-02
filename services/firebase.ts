/**
 * Firebase Configuration and Services
 * 
 * Handles authentication and Firestore database operations.
 * Uses LAZY initialization to prevent crashes when env vars are missing.
 * All operations are wrapped in try-catch for graceful error handling.
 * 
 * @updated SIM-006: Added logPlateCheckToFirestore for behavior-based tracking
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously as firebaseSignInAnonymously,
  signOut as firebaseSignOut,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import { UserProfile, MealType, PlateCheckMeal, DayLog, WeightLog, JourneyDocument } from '../types/schema';

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
 * Exported for use in hooks that need auth state changes
 */
export function getAuthInstance(): Auth | null {
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
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
 * Sign out the current user
 * Clears local auth state even if offline (graceful degradation)
 * 
 * @returns true if sign out succeeded, false if failed
 * @see SIM-018: Identity Cycle
 */
export async function signOut(): Promise<boolean> {
  const auth = getAuthInstance();
  
  if (!auth) {
    console.warn('Firebase Auth not available. Local state cleared.');
    return true; // Consider it a success - no session to clear
  }

  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out failed:', error);
    // Even if Firebase call fails, the local state should be cleared
    // Firebase SDK handles offline sign-out gracefully
    return false;
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

// ============================================================================
// PLATE CHECK (SIM-006: Behavior-Based Meal Logging)
// ============================================================================

/**
 * Log a Plate Check to Firestore
 * Path: users/{uid}/days/{YYYY-MM-DD}
 * 
 * Uses setDoc with merge to add/update individual meal entries
 * without overwriting other meals or daily data.
 * 
 * @param uid - User's auth UID
 * @param mealType - breakfast | lunch | dinner | snack
 * @param plateCheck - { protein: boolean, plants: boolean, satiety: 1-5 }
 * 
 * @see SIM-006 for implementation details
 */
export async function logPlateCheckToFirestore(
  uid: string,
  mealType: MealType,
  plateCheck: Omit<PlateCheckMeal, 'timestamp'>
): Promise<boolean> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available. Plate check not saved to cloud.');
    return false;
  }

  try {
    const today = getTodayDateString();
    const dayRef = doc(db, 'users', uid, 'days', today);
    
    // Build the meal entry with timestamp
    const mealEntry: PlateCheckMeal = {
      protein: plateCheck.protein,
      plants: plateCheck.plants,
      satiety: plateCheck.satiety,
      timestamp: Date.now(),
    };

    // Use setDoc with merge to update only this meal
    // This preserves other meals and daily data
    await setDoc(dayRef, {
      date: today,
      meals: {
        [mealType]: mealEntry,
      },
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Failed to log plate check:', error);
    return false;
  }
}

/**
 * Get today's day log from Firestore
 * Path: users/{uid}/days/{YYYY-MM-DD}
 */
export async function getDayLog(uid: string): Promise<DayLog | null> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available.');
    return null;
  }

  try {
    const today = getTodayDateString();
    const dayRef = doc(db, 'users', uid, 'days', today);
    const snapshot = await getDoc(dayRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as DayLog;
    }
    return null;
  } catch (error) {
    console.error('Failed to get day log:', error);
    return null;
  }
}

// ============================================================================
// WEIGHT TRACKING (SIM-005: The Truth Layer)
// ============================================================================

/**
 * Log weight to Firestore
 * Path: users/{uid}/weight_logs/{YYYY-MM-DD}
 * 
 * Creates or overwrites the weight entry for today.
 * Weight is stored in kilograms regardless of user's display preference.
 * 
 * @see SIM-005 for implementation details
 */
export async function logWeightToFirestore(
  uid: string,
  weightKg: number
): Promise<boolean> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available. Weight not saved to cloud.');
    return false;
  }

  try {
    const today = getTodayDateString();
    const weightRef = doc(db, 'users', uid, 'weight_logs', today);
    
    const weightLog: WeightLog = {
      date: today,
      weight: weightKg,
      timestamp: Date.now(),
    };

    // Use setDoc to create or overwrite today's entry
    await setDoc(weightRef, weightLog);
    
    return true;
  } catch (error) {
    console.error('Failed to log weight:', error);
    return false;
  }
}

// ============================================================================
// CURRICULUM JOURNEY (SIM-009: The Path)
// ============================================================================

/**
 * Get journey document from Firestore
 * Path: users/{uid}/journey
 */
export async function getJourney(uid: string): Promise<JourneyDocument | null> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available.');
    return null;
  }

  try {
    const journeyRef = doc(db, 'users', uid, 'journey', 'progress');
    const snapshot = await getDoc(journeyRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as JourneyDocument;
    }
    return null;
  } catch (error) {
    console.error('Failed to get journey:', error);
    return null;
  }
}

/**
 * Subscribe to journey document changes
 * Path: users/{uid}/journey
 * 
 * Returns an unsubscribe function to clean up the listener.
 */
export function subscribeToJourney(
  uid: string,
  callback: (journey: JourneyDocument | null) => void
): Unsubscribe | null {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available.');
    callback(null);
    return null;
  }

  try {
    const journeyRef = doc(db, 'users', uid, 'journey', 'progress');
    
    return onSnapshot(journeyRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as JourneyDocument);
      } else {
        callback(null);
      }
    }, (error) => {
      console.error('Journey subscription error:', error);
      callback(null);
    });
  } catch (error) {
    console.error('Failed to subscribe to journey:', error);
    return null;
  }
}

/**
 * Initialize journey document for new users
 * Path: users/{uid}/journey
 * 
 * Called after onboarding is complete.
 */
export async function initializeJourney(uid: string): Promise<boolean> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available. Journey not initialized.');
    return false;
  }

  try {
    const journeyRef = doc(db, 'users', uid, 'journey', 'progress');
    
    // Check if already exists
    const existing = await getDoc(journeyRef);
    if (existing.exists()) {
      return true; // Already initialized
    }
    
    const journey: JourneyDocument = {
      completedRules: [],
      currentLevel: 'foundation',
      lastCompletedAt: null,
      startedAt: Date.now(),
    };

    await setDoc(journeyRef, journey);
    return true;
  } catch (error) {
    console.error('Failed to initialize journey:', error);
    return false;
  }
}

/**
 * Mark a lesson as complete
 * Path: users/{uid}/journey
 * 
 * Adds the rule ID to completedRules and updates level if needed.
 */
export async function completeLessonInFirestore(
  uid: string,
  ruleId: string,
  newLevel?: 'foundation' | 'intermediate' | 'advanced'
): Promise<boolean> {
  const db = getFirestoreInstance();
  
  if (!db) {
    console.warn('Firestore not available. Lesson completion not saved.');
    return false;
  }

  try {
    const journeyRef = doc(db, 'users', uid, 'journey', 'progress');
    
    // Get current journey
    const snapshot = await getDoc(journeyRef);
    const currentJourney = snapshot.exists() 
      ? snapshot.data() as JourneyDocument 
      : {
          completedRules: [],
          currentLevel: 'foundation' as const,
          lastCompletedAt: null,
          startedAt: Date.now(),
        };
    
    // Add ruleId if not already completed
    if (!currentJourney.completedRules.includes(ruleId)) {
      currentJourney.completedRules.push(ruleId);
    }
    
    // Update level if provided
    if (newLevel) {
      currentJourney.currentLevel = newLevel;
    }
    
    currentJourney.lastCompletedAt = Date.now();

    await setDoc(journeyRef, currentJourney);
    return true;
  } catch (error) {
    console.error('Failed to complete lesson:', error);
    return false;
  }
}
