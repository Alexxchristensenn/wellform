/**
 * useWeight Hook - Weight Tracking & Trend Calculation
 * 
 * Subscribes to the last 30 days of weight logs and calculates
 * an Exponential Moving Average (EMA) to show the user's "true" trend.
 * 
 * The EMA smooths out daily fluctuations (water retention, food weight, etc.)
 * to give users a clearer picture of their actual progress.
 * 
 * Formula: Trend = (PreviousTrend × 0.9) + (CurrentWeight × 0.1)
 * 
 * @see SIM-005 for implementation details
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  getFirestore,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { WeightLog, WeightTrend } from '../types/schema';
import { isFirebaseConfigured, logWeightToFirestore } from '../services/firebase';

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
 * Calculate Exponential Moving Average (EMA) from weight logs
 * 
 * EMA Formula: Trend = (PreviousTrend × 0.9) + (CurrentWeight × 0.1)
 * 
 * This gives 90% weight to the existing trend and 10% to the new reading,
 * effectively smoothing out daily fluctuations over ~10 days.
 * 
 * Handles missing days gracefully by continuing from the last known trend.
 */
function calculateEMATrend(logs: WeightLog[]): { current: number | null; previous: number | null } {
  if (logs.length === 0) {
    return { current: null, previous: null };
  }

  // Sort logs by date (oldest first for proper EMA calculation)
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  
  // Start with the first weight as the initial trend
  let trend = sortedLogs[0].weight;
  let previousTrend: number | null = null;
  
  // Calculate EMA through the sorted logs
  for (let i = 1; i < sortedLogs.length; i++) {
    previousTrend = trend;
    // EMA: 90% previous trend + 10% current weight
    trend = (trend * 0.9) + (sortedLogs[i].weight * 0.1);
  }
  
  // If we only have one log, previous trend equals current
  if (sortedLogs.length === 1) {
    previousTrend = trend;
  }

  return { 
    current: Math.round(trend * 10) / 10, // Round to 1 decimal
    previous: previousTrend ? Math.round(previousTrend * 10) / 10 : null,
  };
}

interface UseWeightReturn {
  // Weight data
  currentWeight: number | null;
  trendWeight: number | null;
  previousTrend: number | null;
  hasLoggedToday: boolean;
  
  // Raw logs for charts (future use)
  logs: WeightLog[];
  
  // Loading/error states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  logWeight: (weightKg: number) => Promise<boolean>;
}

export default function useWeight(): UseWeightReturn {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log weight - wraps the Firebase service function
  const logWeight = useCallback(async (weightKg: number): Promise<boolean> => {
    if (!uid) {
      console.warn('Cannot log weight: No authenticated user');
      // Still update local state for demo/offline mode
      const today = getTodayDateString();
      const newLog: WeightLog = {
        date: today,
        weight: weightKg,
        timestamp: Date.now(),
      };
      
      setLogs(prev => {
        // Replace today's entry if it exists, otherwise add
        const filtered = prev.filter(log => log.date !== today);
        return [...filtered, newLog].sort((a, b) => a.date.localeCompare(b.date));
      });
      
      return true;
    }

    try {
      const success = await logWeightToFirestore(uid, weightKg);
      // If using onSnapshot, the state will update automatically
      return success;
    } catch (err) {
      console.error('Error logging weight:', err);
      setError('Failed to save weight. Please try again.');
      return false;
    }
  }, [uid]);

  useEffect(() => {
    // If Firebase is not configured, use empty logs
    if (!isFirebaseConfigured()) {
      console.warn('Firebase not configured. Using local state only for weight.');
      setIsLoading(false);
      return;
    }

    let unsubscribeSnapshot: Unsubscribe | null = null;
    
    const auth = getAuth();
    
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser: User | null) => {
      if (!authUser) {
        // No authenticated user - use empty logs
        setUid(null);
        setLogs([]);
        setIsLoading(false);
        return;
      }

      setUid(authUser.uid);

      // Subscribe to weight_logs collection (last 30 days)
      try {
        const db = getFirestore();
        const weightLogsRef = collection(db, 'users', authUser.uid, 'weight_logs');
        
        // Query last 30 entries, ordered by date descending
        const weightQuery = query(
          weightLogsRef,
          orderBy('date', 'desc'),
          limit(30)
        );

        unsubscribeSnapshot = onSnapshot(
          weightQuery,
          (snapshot) => {
            const weightLogs: WeightLog[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              weightLogs.push({
                date: data.date || doc.id,
                weight: data.weight,
                timestamp: data.timestamp,
              });
            });
            
            setLogs(weightLogs);
            setError(null);
            setIsLoading(false);
          },
          (err) => {
            console.error('Firestore weight snapshot error:', err);
            setError('Unable to load weight history. Using offline mode.');
            setLogs([]);
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up weight Firestore listener:', err);
        setError('Connection error. Using offline mode.');
        setLogs([]);
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

  // Calculate derived values using memoization
  const { currentWeight, trendWeight, previousTrend, hasLoggedToday } = useMemo(() => {
    const today = getTodayDateString();
    const todayLog = logs.find(log => log.date === today);
    const trend = calculateEMATrend(logs);
    
    return {
      currentWeight: todayLog?.weight ?? null,
      trendWeight: trend.current,
      previousTrend: trend.previous,
      hasLoggedToday: !!todayLog,
    };
  }, [logs]);

  return {
    currentWeight,
    trendWeight,
    previousTrend,
    hasLoggedToday,
    logs,
    isLoading,
    error,
    logWeight,
  };
}

