/**
 * Core data schema for Simplifit
 * 
 * These interfaces map directly to the Firestore schema defined in docs/architecture.md.
 * DO NOT modify without updating the documentation.
 * 
 * @updated SIM-006: Pivot from calorie counting to behavior-based tracking
 */

/**
 * User Profile - Top level document in users collection
 * Firestore path: users/{uid}
 */
export interface UserProfile {
  profile: {
    displayName: string;
    units: 'imperial' | 'metric';
    onboardingCompleted: boolean;
    createdAt: string; // ISO 8601 timestamp
  };
  stats: {
    sex: 'male' | 'female' | 'other';
    age: number;
    heightCm: number;
    startWeightKg: number;
    currentWeightKg: number;
    goalWeightKg: number;
    activityLevel: number; // e.g., 1.2, 1.375, 1.55, 1.725, 1.9
    targetCalories: number; // Display-only guidance
    targetProtein: number; // Display-only guidance
  };
  subscription: {
    tier: 'free' | 'plus';
    expiry: string | null; // ISO 8601 timestamp or null for free tier
  };
}

// ============================================================================
// BEHAVIOR-BASED TRACKING (SIM-006: The Plate Check)
// ============================================================================

/**
 * Meal types for the Plate Check
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * Individual meal behavior log from Plate Check
 * Tracks protein/plants presence and satiety, NOT calories
 */
export interface PlateCheckMeal {
  protein: boolean; // "Did you have palm-sized protein?"
  plants: boolean;  // "Did you have 1-2 fists of plants?"
  satiety: number;  // 1 (Empty) to 5 (Thanksgiving)
  timestamp?: number; // Unix timestamp
}

/**
 * Daily behaviors tracked outside of meals
 */
export interface DailyBehaviors {
  didWorkout: boolean;
  sleepQuality: number; // 1-5 scale
}

/**
 * Day Log - Daily document with behavior tracking
 * Firestore path: users/{uid}/days/{YYYY-MM-DD}
 * 
 * @see SIM-006 for implementation details
 * @see docs/architecture.md Section 2 for schema definition
 */
export interface DayLog {
  date: string; // Format: YYYY-MM-DD
  
  // Meal behaviors (keyed by meal type)
  meals: Partial<Record<MealType, PlateCheckMeal>>;
  
  // Optional: Weight logged that day
  weight?: number;
  trend?: number;
  
  // Optional: Other daily behaviors
  behaviors?: DailyBehaviors;
  
  // Optional: Free-text reflection
  reflection?: string;
}

/**
 * Derived stats from DayLog for UI display
 */
export interface DayStats {
  proteinHits: number;    // Count of meals with protein: true
  proteinTotal: number;   // Total meals logged
  plantsHits: number;     // Count of meals with plants: true
  plantsTotal: number;    // Total meals logged
  mealsLogged: MealType[]; // Which meals have been logged
  hasProteinToday: boolean; // At least one protein hit (for holographic trigger)
}

// ============================================================================
// LEGACY TYPES (Deprecated - kept for migration compatibility)
// ============================================================================

/**
 * @deprecated Use DayLog with meals object instead
 * Legacy Daily Log from calorie-counting era
 */
export interface LegacyDailyLog {
  date: string;
  calories: number;
  protein: number;
  water: number;
  steps: number;
  completedRituals: string[];
  completedLesson: boolean;
  weightEntry: number | null;
  meals: LegacyMeal[];
}

/**
 * @deprecated Use PlateCheckMeal instead
 */
export interface LegacyMeal {
  name: string;
  cals: number;
  type: 'manual' | 'ai_camera';
}

/**
 * @deprecated Use PlateCheckMeal instead
 * Old meal entry format with calorie/protein counting
 */
export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  timestamp: number;
}

// ============================================================================
// WEIGHT TRACKING (SIM-005: The Truth Layer)
// ============================================================================

/**
 * Weight Log Entry
 * Firestore path: users/{uid}/weight_logs/{YYYY-MM-DD}
 * 
 * Used for tracking daily weight and calculating the EMA trend.
 * @see SIM-005 for implementation details
 */
export interface WeightLog {
  date: string; // Format: YYYY-MM-DD (document ID)
  weight: number; // Weight in kilograms (converted for storage)
  timestamp: number; // Unix timestamp (serverTimestamp)
}

/**
 * Weight Data with Trend Calculation
 * Returned by useWeight hook with computed EMA trend
 */
export interface WeightTrend {
  currentWeight: number | null; // Today's logged weight (kg)
  trendWeight: number | null; // Calculated EMA trend (kg)
  previousTrend: number | null; // Yesterday's trend for comparison
  logs: WeightLog[]; // Last 30 days of weight logs
  hasLoggedToday: boolean; // Whether user has logged weight today
}

// ============================================================================
// CURRICULUM JOURNEY (SIM-009: The Path)
// ============================================================================

/**
 * Lesson status for curriculum progression
 */
export type LessonStatus = 'completed' | 'current' | 'available' | 'locked';

/**
 * Mastery levels for curriculum organization
 */
export type MasteryLevel = 'foundation' | 'intermediate' | 'advanced';

/**
 * Journey Document - Tracks curriculum progress
 * Firestore path: users/{uid}/journey (single document)
 * 
 * @see SIM-009 for implementation details
 */
export interface JourneyDocument {
  completedRules: string[];      // ['golden-001', 'golden-002', ...]
  currentLevel: MasteryLevel;
  lastCompletedAt: number | null; // Unix timestamp
  startedAt: number;              // Unix timestamp
}

// ============================================================================
// AI INTEGRATION
// ============================================================================

/**
 * AI Response Schema for Plate Photo Analysis
 * Used when processing images via OpenAI Vision API
 * 
 * Note: We analyze for EDUCATION, not logging. 
 * We don't extract calories.
 */
export interface AIPlateResponse {
  hasProtein: boolean;
  hasVegetables: boolean;
  suggestion: string; // Friendly educational tip
}

/**
 * @deprecated Use AIPlateResponse instead
 * Old AI response with calorie extraction
 */
export interface AIFoodResponse {
  name: string;
  cals: number;
  macros: {
    p: number;
    c: number;
    f: number;
  };
  micros?: string[];
  tip?: string;
}
