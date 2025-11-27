/**
 * useUser Hook - Real-time Firestore User Subscription
 * 
 * Subscribes to the current user's Firestore document and provides
 * live updates to profile, stats, and targets data.
 * 
 * Features:
 * - Real-time updates via onSnapshot
 * - Graceful fallback for offline/guest mode
 * - Loading and error states for UI feedback
 */

import { useEffect, useState, useCallback } from 'react';
import { 
  doc, 
  onSnapshot,
  Unsubscribe,
  getFirestore,
  getDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { UserProfile } from '../types/schema';
import { isFirebaseConfigured } from '../services/firebase';

// Default guest profile for offline/unauthenticated users
const GUEST_PROFILE: UserProfile = {
  profile: {
    displayName: 'Guest',
    units: 'metric',
    onboardingCompleted: false,
    createdAt: new Date().toISOString(),
  },
  stats: {
    sex: 'other',
    age: 30,
    heightCm: 170,
    startWeightKg: 70,
    currentWeightKg: 70,
    goalWeightKg: 65,
    activityLevel: 1.55,
    targetCalories: 2000,
    targetProtein: 100,
  },
  subscription: {
    tier: 'free',
    expiry: null,
  },
};

interface UseUserReturn {
  // User data (separated for convenience)
  profile: UserProfile['profile'] | null;
  stats: UserProfile['stats'] | null;
  targets: {
    dailyCalories: number;
    dailyProtein: number;
  } | null;
  
  // Full user document
  user: UserProfile | null;
  
  // Auth state
  uid: string | null;
  isAuthenticated: boolean;
  
  // Loading/error states
  loading: boolean;
  error: string | null;
  
  // Actions
  refetch: () => Promise<void>;
}

export default function useUser(): UseUserReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manual refetch function
  const refetch = useCallback(async () => {
    if (!uid || !isFirebaseConfigured()) return;
    
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
      
      if (snapshot.exists()) {
        setUser(snapshot.data() as UserProfile);
        setError(null);
      }
    } catch (err) {
      console.error('Error refetching user:', err);
    }
  }, [uid]);

  useEffect(() => {
    // If Firebase is not configured, use guest profile immediately
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured. Using guest profile.');
      setUser(GUEST_PROFILE);
      setLoading(false);
      return;
    }

    let unsubscribeSnapshot: Unsubscribe | null = null;
    
    const auth = getAuth();
    
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser: User | null) => {
      if (!authUser) {
        // No authenticated user - use guest profile
        setUid(null);
        setUser(GUEST_PROFILE);
        setLoading(false);
        return;
      }

      setUid(authUser.uid);

      // Subscribe to user document
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', authUser.uid);

        unsubscribeSnapshot = onSnapshot(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.data() as UserProfile;
              setUser(userData);
              setError(null);
            } else {
              // User document doesn't exist yet (might be mid-onboarding)
              // Use guest profile but keep UID for future writes
              setUser(GUEST_PROFILE);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Firestore snapshot error:', err);
            setError('Unable to load profile. Using offline mode.');
            setUser(GUEST_PROFILE);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up Firestore listener:', err);
        setError('Connection error. Using offline mode.');
        setUser(GUEST_PROFILE);
        setLoading(false);
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  // Derived values for convenience
  const profile = user?.profile ?? null;
  const stats = user?.stats ?? null;
  const targets = stats ? {
    dailyCalories: stats.targetCalories,
    dailyProtein: stats.targetProtein,
  } : null;

  return {
    profile,
    stats,
    targets,
    user,
    uid,
    isAuthenticated: !!uid,
    loading,
    error,
    refetch,
  };
}

