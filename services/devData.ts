/**
 * Dev Data Seeding Utility
 * 
 * Helper functions to populate Firestore with dummy data for testing.
 * Only use in development/alpha builds.
 * 
 * Provides:
 * - seedWeeklyData: Creates 7 days of realistic weight logs and plate checks
 * - clearAllData: Nukes all user data (use with caution)
 * 
 * @see SIM-017 testing
 */

import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { isFirebaseConfigured } from './firebase';
import { DayLog, WeightLog } from '../types/schema';

// =============================================================================
// SEED REALISTIC DATA
// =============================================================================

/**
 * Seed 7 days of weight logs with a gentle downward trend
 * Includes realistic daily fluctuations
 */
async function seedWeightLogs(uid: string): Promise<void> {
  const db = getFirestore();
  const batch = writeBatch(db);

  // Starting weight: 80 kg, trending down ~0.5 kg over 7 days (more visible)
  const startWeight = 80;
  const trendDelta = 0.5 / 7; // Decrease per day
  
  const weightData: Array<{ date: string; weight: number }> = [];
  
  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Add trend + random fluctuation (±0.3 kg water weight)
    const randomFluctuation = (Math.random() - 0.5) * 0.6;
    const weight = Math.round((startWeight - (trendDelta * (6 - daysAgo)) + randomFluctuation) * 10) / 10;
    
    const weightLog: WeightLog = {
      date: dateStr,
      weight,
      timestamp: date.getTime(),
    };

    weightData.push({ date: dateStr, weight });
    
    const ref = doc(db, 'users', uid, 'weight_logs', dateStr);
    batch.set(ref, weightLog);
  }

  await batch.commit();
  console.log('[DevData] Seeded 7 weight logs:');
  weightData.forEach(w => console.log(`  ${w.date}: ${w.weight} kg`));
}

/**
 * Seed 7 days of day logs with realistic plate checks
 * Pattern: High compliance (5-6 protein hits, 4-5 plants hits)
 */
async function seedDayLogs(uid: string): Promise<void> {
  const db = getFirestore();
  const batch = writeBatch(db);

  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Build meals for this day
    // Pattern: 80% chance of protein, 60% chance of plants
    const meals: Record<string, any> = {};
    
    mealTypes.forEach((meal) => {
      const hasProtein = Math.random() < 0.8;
      const hasPlants = Math.random() < 0.6;
      const satiety = Math.floor(Math.random() * 3) + 3; // 3-5 range
      
      meals[meal] = {
        protein: hasProtein,
        plants: hasPlants,
        satiety,
        timestamp: date.getTime(),
      };
    });

    const dayLog: DayLog = {
      date: dateStr,
      meals,
    };

    const ref = doc(db, 'users', uid, 'days', dateStr);
    batch.set(ref, dayLog);
  }

  await batch.commit();
  console.log('[DevData] Seeded 7 day logs');
}

/**
 * Seed complete weekly data set
 * Call this once to populate test data
 */
export async function seedWeeklyData(): Promise<boolean> {
  console.log('[DevData] seedWeeklyData called');
  
  try {
    if (!isFirebaseConfigured()) {
      console.error('[DevData] Firebase not configured - cannot seed data');
      return false;
    }
    
    const auth = getAuth();
    console.log('[DevData] Auth instance:', auth ? 'exists' : 'null');
    console.log('[DevData] Current user:', auth?.currentUser ? auth.currentUser.uid.slice(0, 8) + '...' : 'null');
    
    if (!auth.currentUser) {
      console.error('[DevData] No authenticated user - cannot seed data');
      return false;
    }

    const uid = auth.currentUser.uid;
    
    console.log('[DevData] Seeding data for uid:', uid.slice(0, 6) + '...');
    
    await seedWeightLogs(uid);
    await seedDayLogs(uid);
    
    console.log('[DevData] ✅ Seeding complete - go to Home tab to verify');
    return true;
  } catch (error) {
    console.error('[DevData] Seeding failed:', error);
    return false;
  }
}

// =============================================================================
// CLEAR DATA
// =============================================================================

/**
 * DELETE ALL user data (weight logs, day logs, everything except profile)
 * WARNING: This is irreversible!
 */
export async function clearAllUserData(): Promise<boolean> {
  console.log('[DevData] clearAllUserData called');
  
  try {
    if (!isFirebaseConfigured()) {
      console.error('[DevData] Firebase not configured');
      return false;
    }
    
    const auth = getAuth();
    if (!auth.currentUser) {
      console.error('[DevData] No authenticated user');
      return false;
    }

    const uid = auth.currentUser.uid;
    const db = getFirestore();

    console.log('[DevData] 🗑️  Clearing all data for uid:', uid.slice(0, 6) + '...');

    // Clear weight_logs
    const weightRef = collection(db, 'users', uid, 'weight_logs');
    const weightDocs = await getDocs(weightRef);
    const batch1 = writeBatch(db);
    weightDocs.forEach((doc) => {
      batch1.delete(doc.ref);
    });
    await batch1.commit();
    console.log('[DevData] Cleared weight logs');

    // Clear days
    const daysRef = collection(db, 'users', uid, 'days');
    const daysDocs = await getDocs(daysRef);
    const batch2 = writeBatch(db);
    daysDocs.forEach((doc) => {
      batch2.delete(doc.ref);
    });
    await batch2.commit();
    console.log('[DevData] Cleared day logs');

    // Clear journey if exists
    try {
      const journeyRef = doc(db, 'users', uid, 'journey', 'progress');
      await deleteDoc(journeyRef);
      console.log('[DevData] Cleared journey');
    } catch (e) {
      // Journey may not exist, that's ok
    }

    console.log('[DevData] ✅ Clear complete');
    return true;
  } catch (error) {
    console.error('[DevData] Clear failed:', error);
    return false;
  }
}

// =============================================================================
// QUICK SEED VARIANT
// =============================================================================

/**
 * Seed just enough data to show the "Gathering Data" state
 * (3 days minimum)
 */
export async function seedMinimalData(): Promise<boolean> {
  console.log('[DevData] seedMinimalData called');
  
  try {
    if (!isFirebaseConfigured()) {
      console.error('[DevData] Firebase not configured');
      return false;
    }
    
    const auth = getAuth();
    if (!auth.currentUser) {
      console.error('[DevData] No authenticated user');
      return false;
    }

    const uid = auth.currentUser.uid;
    const db = getFirestore();

    console.log('[DevData] Seeding minimal data (3 days)...');

    // Just weight logs for 3 days
    for (let daysAgo = 2; daysAgo >= 0; daysAgo--) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const weight = 80 - (daysAgo * 0.1); // Slight downward trend

      const weightLog: WeightLog = {
        date: dateStr,
        weight,
        timestamp: date.getTime(),
      };

      const ref = doc(db, 'users', uid, 'weight_logs', dateStr);
      await setDoc(ref, weightLog);
    }

    console.log('[DevData] ✅ Minimal seed complete');
    return true;
  } catch (error) {
    console.error('[DevData] Minimal seed failed:', error);
    return false;
  }
}

