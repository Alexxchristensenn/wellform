/**
 * Core data schema for Simplifit
 * 
 * These interfaces map directly to the Firestore schema defined in docs/architecture.md.
 * DO NOT modify without updating the documentation.
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
    targetCalories: number;
    targetProtein: number;
  };
  subscription: {
    tier: 'free' | 'plus';
    expiry: string | null; // ISO 8601 timestamp or null for free tier
  };
}

/**
 * Daily Log - Subcollection document
 * Firestore path: users/{uid}/daily_logs/{YYYY-MM-DD}
 */
export interface DailyLog {
  date: string; // Format: YYYY-MM-DD
  calories: number;
  protein: number;
  water: number; // Liters
  steps: number;
  completedRituals: string[]; // e.g., ["hydration", "movement"]
  completedLesson: boolean;
  weightEntry: number | null; // Kilograms, null if not logged today
  meals: Meal[];
}

/**
 * Individual meal entry
 */
export interface Meal {
  name: string;
  cals: number;
  type: 'manual' | 'ai_camera';
}

/**
 * AI Response Schema for Food Recognition
 * Used when processing images via OpenAI Vision API
 */
export interface AIFoodResponse {
  name: string;
  cals: number;
  macros: {
    p: number; // Protein (grams)
    c: number; // Carbs (grams)
    f: number; // Fat (grams)
  };
  micros?: string[]; // Optional array of notable micronutrients
  tip?: string; // Optional nutritional tip
}

