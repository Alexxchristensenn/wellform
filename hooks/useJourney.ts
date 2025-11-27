/**
 * useJourney - Curriculum Progress Hook
 * 
 * Manages curriculum progression through the Golden Rules.
 * Provides real-time updates via Firestore subscription.
 * 
 * @see SIM-009 for implementation details
 */

import { useState, useEffect, useCallback } from 'react';
import { JourneyDocument, LessonStatus, MasteryLevel } from '../types/schema';
import { GoldenRule, getRulesByLevel, GOLDEN_RULES } from '../services/contentBank';
import { 
  subscribeToJourney, 
  completeLessonInFirestore,
  initializeJourney,
} from '../services/firebase';
import useUser from './useUser';
import { hapticSuccess } from '../utils/haptics';

// Level order for comparison
const LEVEL_ORDER: MasteryLevel[] = ['foundation', 'intermediate', 'advanced'];

// Default empty journey for initial state
const DEFAULT_JOURNEY: JourneyDocument = {
  completedRules: [],
  currentLevel: 'foundation',
  lastCompletedAt: null,
  startedAt: Date.now(),
};

export interface UseJourneyReturn {
  // Data
  journey: JourneyDocument;
  isLoading: boolean;
  
  // Progress metrics
  completedCount: number;
  totalCount: number;
  progress: number; // 0-1
  currentLevel: MasteryLevel;
  
  // Lesson helpers
  getLessonStatus: (ruleId: string, ruleIndex: number, level: MasteryLevel) => LessonStatus;
  getRulesForLevel: (level: MasteryLevel) => GoldenRule[];
  
  // Actions
  completeLesson: (ruleId: string) => Promise<void>;
  initJourney: () => Promise<void>;
}

export default function useJourney(): UseJourneyReturn {
  const { uid } = useUser();
  const [journey, setJourney] = useState<JourneyDocument>(DEFAULT_JOURNEY);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to journey updates
  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    const unsubscribe = subscribeToJourney(uid, (data) => {
      if (data) {
        setJourney(data);
      } else {
        setJourney(DEFAULT_JOURNEY);
      }
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid]);

  // Calculate progress metrics
  const totalCount = GOLDEN_RULES.length;
  const completedCount = journey.completedRules.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  /**
   * Get rules for a specific level
   */
  const getRulesForLevel = useCallback((level: MasteryLevel): GoldenRule[] => {
    return getRulesByLevel(level);
  }, []);

  /**
   * Determine if a level is unlocked based on previous level completion
   */
  const isLevelUnlocked = useCallback((level: MasteryLevel): boolean => {
    const levelIndex = LEVEL_ORDER.indexOf(level);
    const currentLevelIndex = LEVEL_ORDER.indexOf(journey.currentLevel);
    return levelIndex <= currentLevelIndex;
  }, [journey.currentLevel]);

  /**
   * Determine the status of a specific lesson
   */
  const getLessonStatus = useCallback((
    ruleId: string,
    ruleIndex: number,
    level: MasteryLevel
  ): LessonStatus => {
    // Already completed?
    if (journey.completedRules.includes(ruleId)) {
      return 'completed';
    }

    // Is this level unlocked?
    if (!isLevelUnlocked(level)) {
      return 'locked';
    }

    // Get rules in this level
    const rulesInLevel = getRulesForLevel(level);
    
    // First rule in level is always available if level is unlocked
    if (ruleIndex === 0) {
      // Check if any incomplete rules exist before this one
      const hasIncomplete = rulesInLevel.some((r, i) => 
        i < ruleIndex && !journey.completedRules.includes(r.id)
      );
      return hasIncomplete ? 'available' : 'current';
    }

    // Check if previous rule in level is completed
    const prevRule = rulesInLevel[ruleIndex - 1];
    if (prevRule && journey.completedRules.includes(prevRule.id)) {
      // Previous is complete - check if this is the first incomplete
      const firstIncompleteIndex = rulesInLevel.findIndex(
        r => !journey.completedRules.includes(r.id)
      );
      return firstIncompleteIndex === ruleIndex ? 'current' : 'available';
    }

    return 'locked';
  }, [journey.completedRules, isLevelUnlocked, getRulesForLevel]);

  /**
   * Check if completing a lesson should unlock the next level
   */
  const shouldUnlockNextLevel = useCallback((ruleId: string): MasteryLevel | undefined => {
    const currentLevelRules = getRulesForLevel(journey.currentLevel);
    
    // After adding this rule, will all current level rules be complete?
    const completedAfter = [...journey.completedRules, ruleId];
    const allComplete = currentLevelRules.every(r => completedAfter.includes(r.id));
    
    if (allComplete) {
      const currentIndex = LEVEL_ORDER.indexOf(journey.currentLevel);
      if (currentIndex < LEVEL_ORDER.length - 1) {
        return LEVEL_ORDER[currentIndex + 1];
      }
    }
    
    return undefined;
  }, [journey.completedRules, journey.currentLevel, getRulesForLevel]);

  /**
   * Mark a lesson as complete
   */
  const completeLesson = useCallback(async (ruleId: string): Promise<void> => {
    if (!uid) return;
    
    // Already completed?
    if (journey.completedRules.includes(ruleId)) return;

    // Check if this unlocks next level
    const newLevel = shouldUnlockNextLevel(ruleId);

    // Optimistic update
    setJourney(prev => ({
      ...prev,
      completedRules: [...prev.completedRules, ruleId],
      currentLevel: newLevel || prev.currentLevel,
      lastCompletedAt: Date.now(),
    }));

    // Haptic feedback
    hapticSuccess();

    // Persist to Firestore
    await completeLessonInFirestore(uid, ruleId, newLevel);
  }, [uid, journey.completedRules, shouldUnlockNextLevel]);

  /**
   * Initialize journey for new users
   */
  const initJourney = useCallback(async (): Promise<void> => {
    if (!uid) return;
    await initializeJourney(uid);
  }, [uid]);

  return {
    journey,
    isLoading,
    completedCount,
    totalCount,
    progress,
    currentLevel: journey.currentLevel,
    getLessonStatus,
    getRulesForLevel,
    completeLesson,
    initJourney,
  };
}

