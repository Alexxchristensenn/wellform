/**
 * useWeeklyReview Hook - The Insight Engine
 * 
 * Synthesizes Behavior (Plate Checks) vs Biology (Weight Trend) to generate
 * weekly insights that answer: "Is my effort actually working?"
 * 
 * Features:
 * - Aggregates last 7-14 days of behavior data (protein/plants)
 * - Calculates trend delta from EMA weight history
 * - Generates context-aware insight strings
 * - Provides sparkline-ready data points
 * 
 * @see SIM-017 The Insight Engine
 */

import { useEffect, useState, useMemo } from 'react';
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
import { isFirebaseConfigured } from '../services/firebase';
import { DayLog, WeightLog } from '../types/schema';

// =============================================================================
// TYPES
// =============================================================================

export interface WeeklyStats {
  proteinDays: number;      // Days with at least one protein hit
  totalDays: number;        // Total days with any logged data
  adherence: number;        // Percentage (0-100)
  plantsDays: number;       // Days with at least one plants hit
}

export interface TrendData {
  current: number | null;   // Today's EMA trend
  weekAgo: number | null;   // EMA from 7 days ago
  delta: number;            // Difference (current - weekAgo)
  direction: 'up' | 'down' | 'flat';
}

export interface TrendPoint {
  date: string;
  weight: number | null;    // Raw weight (may be null if no log)
  trend: number;            // Calculated EMA
}

export interface WeeklyReviewData {
  loading: boolean;
  error: string | null;
  stats: WeeklyStats;
  trend: TrendData;
  history: TrendPoint[];    // For sparkline (7 most recent points)
  insight: string;
  hasEnoughData: boolean;   // At least 3 days of data
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Number of days to query (slightly more than 7 for EMA accuracy)
const QUERY_DAYS = 14;

// Minimum days needed to show insights
const MIN_DAYS_FOR_INSIGHT = 3;

// EMA smoothing factor (same as useWeight.ts)
const EMA_ALPHA = 0.1;

// Adherence thresholds
const HIGH_ADHERENCE_THRESHOLD = 0.6; // 60% or more = "high"

// Trend thresholds (in kg)
const FLAT_THRESHOLD = 0.15; // ±0.15 kg = "flat"

// =============================================================================
// INSIGHT GENERATOR
// =============================================================================

/**
 * Generate insight string based on adherence + trend matrix
 * 
 * Matrix:
 * - High adherence + trend down → "Metabolic Gold"
 * - High adherence + trend flat → "Body adapting"
 * - High adherence + trend up → "Patience required"
 * - Low adherence + trend down → "Mixed signals"
 * - Low adherence + trend flat → "Opportunity ahead"
 * - Low adherence + trend up → "Biology is honest"
 */
function generateInsight(
  adherence: number, 
  direction: 'up' | 'down' | 'flat',
  hasEnoughData: boolean
): string {
  if (!hasEnoughData) {
    return 'Keep logging to unlock your weekly insight.';
  }

  const isHighAdherence = adherence >= HIGH_ADHERENCE_THRESHOLD * 100;

  if (isHighAdherence) {
    switch (direction) {
      case 'down':
        return 'Metabolic gold. Your consistency is paying off. Keep going.';
      case 'flat':
        return 'Body adapting. Check sleep and stress — or slightly reduce portions.';
      case 'up':
        return 'Patience. Biology takes time. Trust the process and stay consistent.';
    }
  } else {
    switch (direction) {
      case 'down':
        return 'Progress despite gaps. Imagine what consistency could unlock.';
      case 'flat':
        return 'Opportunity ahead. More protein hits could break this plateau.';
      case 'up':
        return 'Biology is honest. Focus on protein at every meal this week.';
    }
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get date string N days ago
 */
function getDateStringDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date string
 */
function getTodayDateString(): string {
  return getDateStringDaysAgo(0);
}

/**
 * Calculate EMA from weight logs
 * Returns array of trend points for sparkline
 */
function calculateEMAHistory(logs: WeightLog[]): TrendPoint[] {
  if (logs.length === 0) return [];

  // Sort logs by date (oldest first)
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  
  const trendPoints: TrendPoint[] = [];
  let currentTrend = sortedLogs[0].weight;
  
  for (const log of sortedLogs) {
    // EMA formula: trend = (1 - alpha) * prevTrend + alpha * currentWeight
    currentTrend = (1 - EMA_ALPHA) * currentTrend + EMA_ALPHA * log.weight;
    
    trendPoints.push({
      date: log.date,
      weight: log.weight,
      trend: Math.round(currentTrend * 10) / 10, // Round to 1 decimal
    });
  }

  return trendPoints;
}

/**
 * Check if a day has at least one protein hit
 */
function dayHasProtein(dayLog: DayLog): boolean {
  const meals = dayLog.meals || {};
  return Object.values(meals).some(meal => meal?.protein === true);
}

/**
 * Check if a day has at least one plants hit
 */
function dayHasPlants(dayLog: DayLog): boolean {
  const meals = dayLog.meals || {};
  return Object.values(meals).some(meal => meal?.plants === true);
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const DEFAULT_STATS: WeeklyStats = {
  proteinDays: 0,
  totalDays: 0,
  adherence: 0,
  plantsDays: 0,
};

const DEFAULT_TREND: TrendData = {
  current: null,
  weekAgo: null,
  delta: 0,
  direction: 'flat',
};

// =============================================================================
// HOOK
// =============================================================================

export default function useWeeklyReview(): WeeklyReviewData {
  const [dayLogs, setDayLogs] = useState<DayLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Firestore data
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    let unsubscribeDays: Unsubscribe | null = null;
    let unsubscribeWeight: Unsubscribe | null = null;
    
    const auth = getAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser: User | null) => {
      if (!authUser) {
        setDayLogs([]);
        setWeightLogs([]);
        setLoading(false);
        return;
      }

      const db = getFirestore();
      
      // Subscribe to days collection (last 14 entries)
      try {
        const daysRef = collection(db, 'users', authUser.uid, 'days');
        const daysQuery = query(
          daysRef,
          orderBy('date', 'desc'),
          limit(QUERY_DAYS)
        );

        unsubscribeDays = onSnapshot(
          daysQuery,
          (snapshot) => {
            const logs: DayLog[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as DayLog;
              logs.push({
                date: data.date || doc.id,
                meals: data.meals || {},
                behaviors: data.behaviors,
                reflection: data.reflection,
              });
            });
            setDayLogs(logs);
          },
          (err) => {
            console.error('Days snapshot error:', err);
            setError('Unable to load behavior history.');
          }
        );
      } catch (err) {
        console.error('Error setting up days listener:', err);
      }

      // Subscribe to weight_logs collection (last 14 entries)
      try {
        const weightRef = collection(db, 'users', authUser.uid, 'weight_logs');
        const weightQuery = query(
          weightRef,
          orderBy('date', 'desc'),
          limit(QUERY_DAYS)
        );

        unsubscribeWeight = onSnapshot(
          weightQuery,
          (snapshot) => {
            const logs: WeightLog[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              logs.push({
                date: data.date || doc.id,
                weight: data.weight,
                timestamp: data.timestamp,
              });
            });
            setWeightLogs(logs);
            setLoading(false);
          },
          (err) => {
            console.error('Weight snapshot error:', err);
            setError('Unable to load weight history.');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up weight listener:', err);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDays) unsubscribeDays();
      if (unsubscribeWeight) unsubscribeWeight();
    };
  }, []);

  // Calculate derived values
  const result = useMemo((): Omit<WeeklyReviewData, 'loading' | 'error'> => {
    // Get date boundaries for the 7-day window
    const today = getTodayDateString();
    const weekAgoDate = getDateStringDaysAgo(7);

    // Filter to last 7 days for stats
    const recentDays = dayLogs.filter(log => log.date >= weekAgoDate && log.date <= today);
    
    // Calculate behavior stats
    const proteinDays = recentDays.filter(dayHasProtein).length;
    const plantsDays = recentDays.filter(dayHasPlants).length;
    const totalDays = recentDays.length;
    const adherence = totalDays > 0 ? Math.round((proteinDays / 7) * 100) : 0;

    const stats: WeeklyStats = {
      proteinDays,
      totalDays,
      adherence,
      plantsDays,
    };

    // Sort weight logs by date ascending before EMA calculation
    // (Firestore query returns descending, but EMA needs ascending)
    const sortedWeightLogs = [...weightLogs].sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate EMA trend history
    const trendHistory = calculateEMAHistory(sortedWeightLogs);
    
    // Get last 7 trend points for sparkline
    const history = trendHistory.slice(-7);
    
    // Debug logging
    if (trendHistory.length > 0) {
      console.log('[WeeklyReview] Trend history:', trendHistory.length, 'points');
      console.log('[WeeklyReview] History for sparkline:', history.map(h => ({ date: h.date, trend: h.trend })));
    }
    
    // Calculate trend delta
    let trend: TrendData = { ...DEFAULT_TREND };
    
    if (trendHistory.length >= 2) {
      const current = trendHistory[trendHistory.length - 1].trend;
      
      // Find trend from ~7 days ago (or oldest available)
      const weekAgoIndex = Math.max(0, trendHistory.length - 7);
      const weekAgo = trendHistory[weekAgoIndex].trend;
      
      const delta = Math.round((current - weekAgo) * 10) / 10;
      
      let direction: 'up' | 'down' | 'flat';
      if (delta > FLAT_THRESHOLD) {
        direction = 'up';
      } else if (delta < -FLAT_THRESHOLD) {
        direction = 'down';
      } else {
        direction = 'flat';
      }

      trend = {
        current,
        weekAgo,
        delta,
        direction,
      };
      
      console.log('[WeeklyReview] Trend:', { current, weekAgo, delta, direction });
    }

    // Check if we have enough data
    const hasEnoughData = totalDays >= MIN_DAYS_FOR_INSIGHT || trendHistory.length >= MIN_DAYS_FOR_INSIGHT;

    // Generate insight
    const insight = generateInsight(adherence, trend.direction, hasEnoughData);

    return {
      stats,
      trend,
      history,
      insight,
      hasEnoughData,
    };
  }, [dayLogs, weightLogs]);

  return {
    loading,
    error,
    ...result,
  };
}

