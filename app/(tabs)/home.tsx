/**
 * Home Screen - "The Daily Pulse"
 * 
 * Main dashboard displaying time-aware content feed with:
 * - Glassmorphism header with greeting
 * - Educational content (LessonCard) - Daily Golden Rule
 * - Meal behavior logging (NourishmentCard with Plate Check)
 * - Daily rituals (RitualsCard)
 * 
 * Card order changes based on time of day for contextual relevance.
 * 
 * @updated SIM-006: Replaced calorie logging with Plate Check behavior tracking
 * 
 * Data Sources:
 * - User profile/targets from Firestore via useUser hook
 * - Behavior tracking via useDailyLog hook
 * - Golden Rules from content service
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import HomeHeader from '../../components/home/HomeHeader';
import DailyPulseFeed from '../../components/home/DailyPulseFeed';
import HomeSkeleton from '../../components/home/HomeSkeleton';
import PlateCheckModal from '../../components/modals/PlateCheckModal';
import useUser from '../../hooks/useUser';
import useDailyLog from '../../hooks/useDailyLog';
import useWeight from '../../hooks/useWeight';
import { getDailyRule, GoldenRule } from '../../services/content';
import { MealType } from '../../types/schema';

// Design system colors
const COLORS = {
  background: '#F8F6F2',
  gradientStart: '#f3e7e9',
  gradientMid: '#e3eeff',
  gradientEnd: '#e8f3e8',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // Fetch user data from Firestore
  const { profile, stats, targets, loading, error } = useUser();
  
  // Fetch today's daily log (real-time subscription) - SIM-006: Now behavior-based
  const { stats: dayStats, logPlateCheck, isLoading: dailyLogLoading } = useDailyLog();
  
  // Fetch weight data and trend (SIM-005: The Truth Layer)
  const { 
    currentWeight, 
    trendWeight, 
    previousTrend,
    hasLoggedToday: hasLoggedWeightToday, 
    logWeight, 
    isLoading: weightLoading 
  } = useWeight();
  
  // Get today's Golden Rule
  const [dailyRule, setDailyRule] = useState<GoldenRule | null>(null);
  
  // Plate Check modal state (SIM-006)
  const [isPlateCheckModalVisible, setIsPlateCheckModalVisible] = useState(false);
  
  useEffect(() => {
    // Fetch daily rule on mount
    const rule = getDailyRule();
    setDailyRule(rule);
  }, []);
  
  // Rituals state (still mocked - future ticket)
  const [hydrationLiters, setHydrationLiters] = useState(0);
  const [movementMins, setMovementMins] = useState(0);

  // Derived values from real user data
  const userName = profile?.displayName ?? 'Guest';
  
  // Weight-related derived values
  const units = profile?.units ?? 'metric';
  const startWeight = stats?.startWeightKg ?? 70;
  const goalWeight = stats?.goalWeightKg ?? 65;

  // Plate Check Modal handlers (SIM-006)
  const handleOpenPlateCheck = useCallback(() => {
    setIsPlateCheckModalVisible(true);
  }, []);

  const handleClosePlateCheck = useCallback(() => {
    setIsPlateCheckModalVisible(false);
  }, []);

  const handleSubmitPlateCheck = useCallback(async (
    mealType: MealType,
    data: { protein: boolean; plants: boolean; satiety: number }
  ) => {
    await logPlateCheck(mealType, data);
    // Modal will close automatically after successful submission
  }, [logPlateCheck]);

  // Rituals handlers
  const handleRitualPress = useCallback((ritualId: string) => {
    // Mock: Increment ritual
    if (ritualId === 'hydration') {
      setHydrationLiters((prev) => Math.min(prev + 1, 3));
    } else if (ritualId === 'movement') {
      setMovementMins((prev) => Math.min(prev + 10, 30));
    }
  }, []);

  const handleRitualInfoPress = useCallback((ritualId: string) => {
    // TODO: Show "Why" modal (future ticket)
    console.log(`Showing info for: ${ritualId}`);
  }, []);

  // Header height for scroll offset (smaller header = less offset needed)
  const headerHeight = insets.top + 60;

  // Show skeleton while loading user data, daily log, or weight data
  if (loading || dailyLogLoading || weightLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />
        <HomeSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated gradient background */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Fixed header - uses real user name */}
      <HomeHeader 
        userName={userName} 
        streakDays={0} // SIM-017: Will show when user has actual streak data
      />

      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: headerHeight + 16,
            paddingBottom: insets.bottom + 100, // Space for tab bar
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <DailyPulseFeed
          // Nourishment (SIM-006: Behavior-based)
          stats={dayStats}
          onCheckIn={handleOpenPlateCheck}
          // Weight
          currentWeight={currentWeight}
          trendWeight={trendWeight}
          previousTrend={previousTrend}
          hasLoggedWeightToday={hasLoggedWeightToday}
          units={units}
          startWeight={startWeight}
          goalWeight={goalWeight}
          onLogWeight={logWeight}
          // Rituals
          hydrationLiters={hydrationLiters}
          movementMins={movementMins}
          onRitualPress={handleRitualPress}
          onRitualInfoPress={handleRitualInfoPress}
          // Content
          dailyRule={dailyRule}
        />
      </ScrollView>
      
      {/* Plate Check Modal (SIM-006) */}
      <PlateCheckModal
        visible={isPlateCheckModalVisible}
        onClose={handleClosePlateCheck}
        onSubmit={handleSubmitPlateCheck}
        alreadyLoggedMeals={dayStats.mealsLogged}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
