/**
 * useDailyLog Hook - Behavior-Based Daily Tracking
 * 
 * Subscribes to today's document in users/{uid}/days/{YYYY-MM-DD}
 * and provides live updates for meal behaviors and habits.
 * 
 * PIVOTED in SIM-006: Now tracks behaviors (protein/plants/satiety)
 * instead of calories and macros. Habits beat numbers.
 * 
 * Features:
 * - Real-time updates via onSnapshot
 * - Behavior stats calculation (protein hits, plants hits)
 * - Graceful fallback for offline/guest mode
 * - Loading and error states for UI feedback
 * 
 * @see SIM-006 for implementation details
 */

import { useEffect, useState, useCallback } from 'react';
import { 
  doc, 
  onSnapshot,
  Unsubscribe,
  getFirestore,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { DayLog, MealType, PlateCheckMeal, DayStats } from '../types/schema';
import { isFirebaseConfigured, logPlateCheckToFirestore } from '../services/firebase';

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

// Default empty day log
const EMPTY_DAY_LOG: DayLog = {
  date: getTodayDateString(),
  meals: {},
};

// Default empty stats
const EMPTY_STATS: DayStats = {
  proteinHits: 0,
  proteinTotal: 0,
  plantsHits: 0,
  plantsTotal: 0,
  mealsLogged: [],
  hasProteinToday: false,
};

/**
 * Calculate derived stats from a day log
 */
function calculateStats(dayLog: DayLog): DayStats {
  const meals = dayLog.meals || {};
  const mealTypes = Object.keys(meals) as MealType[];
  
  let proteinHits = 0;
  let plantsHits = 0;
  
  mealTypes.forEach((mealType) => {
    const meal = meals[mealType];
    if (meal) {
      if (meal.protein) proteinHits++;
      if (meal.plants) plantsHits++;
    }
  });
  
  return {
    proteinHits,
    proteinTotal: mealTypes.length,
    plantsHits,
    plantsTotal: mealTypes.length,
    mealsLogged: mealTypes,
    hasProteinToday: proteinHits > 0,
  };
}

interface UseDailyLogReturn {
  // Today's day log document
  dayLog: DayLog;
  
  // Derived stats for easy UI access
  stats: DayStats;
  
  // Loading/error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  logPlateCheck: (
    mealType: MealType, 
    data: { protein: boolean; plants: boolean; satiety: number }
  ) => Promise<boolean>;
}

export default function useDailyLog(): UseDailyLogReturn {
  const [dayLog, setDayLog] = useState<DayLog>(EMPTY_DAY_LOG);
  const [uid, setUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Log a plate check - wraps the Firebase service function
   */
  const logPlateCheck = useCallback(async (
    mealType: MealType,
    data: { protein: boolean; plants: boolean; satiety: number }
  ): Promise<boolean> => {
    if (!uid) {
      console.warn('Cannot log plate check: No authenticated user');
      // Still update local state for demo/offline mode
      const newMeal: PlateCheckMeal = {
        protein: data.protein,
        plants: data.plants,
        satiety: data.satiety,
        timestamp: Date.now(),
      };
      setDayLog(prev => ({
        ...prev,
        meals: {
          ...prev.meals,
          [mealType]: newMeal,
        },
      }));
      return true;
    }

    try {
      const success = await logPlateCheckToFirestore(uid, mealType, data);
      // Note: If using onSnapshot, the state will update automatically
      return success;
    } catch (err) {
      console.error('Error logging plate check:', err);
      setError('Failed to save. Please try again.');
      return false;
    }
  }, [uid]);

  useEffect(() => {
    const today = getTodayDateString();
    
    // If Firebase is not configured, use empty log
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured. Using local state only.');
      setDayLog({ ...EMPTY_DAY_LOG, date: today });
      setIsLoading(false);
      return;
    }

    let unsubscribeSnapshot: Unsubscribe | null = null;
    
    const auth = getAuth();
    
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser: User | null) => {
      if (!authUser) {
        // No authenticated user - use empty log
        setUid(null);
        setDayLog({ ...EMPTY_DAY_LOG, date: today });
        setIsLoading(false);
        return;
      }

      setUid(authUser.uid);

      // Subscribe to today's day document
      try {
        const db = getFirestore();
        const dayRef = doc(db, 'users', authUser.uid, 'days', today);

        unsubscribeSnapshot = onSnapshot(
          dayRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data() as DayLog;
              setDayLog({
                date: data.date || today,
                meals: data.meals || {},
                weight: data.weight,
                trend: data.trend,
                behaviors: data.behaviors,
                reflection: data.reflection,
              });
              setError(null);
            } else {
              // Document doesn't exist yet - start fresh
              setDayLog({ ...EMPTY_DAY_LOG, date: today });
            }
            setIsLoading(false);
          },
          (err) => {
            console.error('Firestore snapshot error:', err);
            setError('Unable to load today\'s log. Using offline mode.');
            setDayLog({ ...EMPTY_DAY_LOG, date: today });
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up Firestore listener:', err);
        setError('Connection error. Using offline mode.');
        setDayLog({ ...EMPTY_DAY_LOG, date: today });
        setIsLoading(false);
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

  // Calculate derived stats
  const stats = calculateStats(dayLog);

  return {
    dayLog,
    stats,
    isLoading,
    error,
    logPlateCheck,
  };
}
