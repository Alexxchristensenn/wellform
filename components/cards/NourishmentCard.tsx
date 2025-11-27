/**
 * NourishmentCard - The Plate Check Entry Point
 * 
 * PIVOTED in SIM-006: Now shows behavior tracking instead of calories.
 * Displays protein/plants habit progress and triggers holographic shimmer
 * when the user logs protein.
 * 
 * Design Philosophy:
 * - "Habit > Number": Show "2/3 Protein Goals Hit" not "1,250 kcal"
 * - Holographic reward: Visual delight when protein is logged
 * - One clear CTA: "Check In" button for Plate Check modal
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Drumstick, Leaf, CheckCircle, ChevronRight } from 'lucide-react-native';
import HolographicCard from '../ui/HolographicCard';
import { DayStats, MealType } from '../../types/schema';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone700: '#44403c',
  stone600: '#57534e',
  stone500: '#78716c',
  stone400: '#a8a29e',
  stone200: '#e7e5e4',
  stone100: '#f5f5f4',
  white: '#FFFFFF',
  emerald500: '#10b981',
  emerald100: '#d1fae5',
  rose500: '#f43f5e',
  rose100: '#ffe4e6',
  amber500: '#f59e0b',
};

// Meal display names
const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'B',
  lunch: 'L',
  dinner: 'D',
  snack: 'S',
};

interface NourishmentCardProps {
  stats: DayStats;
  onCheckIn?: () => void;
}

/**
 * HabitProgress - Shows progress toward a habit goal
 */
function HabitProgress({ 
  label, 
  icon: Icon, 
  hits, 
  total,
  color,
}: { 
  label: string;
  icon: typeof Drumstick;
  hits: number;
  total: number;
  color: { bg: string; icon: string; text: string };
}) {
  // If no meals logged, show "0/0" but style differently
  const hasProgress = total > 0;
  
  return (
    <View style={styles.habitContainer}>
      <View style={[styles.habitIconContainer, { backgroundColor: color.bg }]}>
        <Icon size={18} color={color.icon} />
      </View>
      <View style={styles.habitTextContainer}>
        <Text style={styles.habitLabel}>{label}</Text>
        <Text style={[styles.habitValue, { color: color.text }]}>
          {hasProgress ? `${hits}/${total}` : '—'}
        </Text>
      </View>
    </View>
  );
}

/**
 * MealDots - Shows which meals have been logged
 */
function MealDots({ mealsLogged }: { mealsLogged: MealType[] }) {
  const allMeals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  return (
    <View style={styles.mealDotsContainer}>
      {allMeals.map((meal) => {
        const isLogged = mealsLogged.includes(meal);
        return (
          <View
            key={meal}
            style={[
              styles.mealDot,
              isLogged && styles.mealDotLogged,
            ]}
          >
            {isLogged ? (
              <CheckCircle size={12} color={COLORS.emerald500} />
            ) : (
              <Text style={styles.mealDotText}>{MEAL_LABELS[meal]}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default function NourishmentCard({
  stats,
  onCheckIn,
}: NourishmentCardProps) {
  const { proteinHits, proteinTotal, plantsHits, plantsTotal, mealsLogged, hasProteinToday } = stats;
  
  // Determine card state
  const hasMealsLogged = mealsLogged.length > 0;
  
  // Holographic effect triggers when protein is logged
  const showHolographic = hasProteinToday;

  const cardContent = (
    <View style={styles.innerContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nourishment</Text>
          <Text style={styles.subtitle}>
            {hasMealsLogged 
              ? `${mealsLogged.length} meal${mealsLogged.length > 1 ? 's' : ''} logged`
              : 'No meals logged yet'
            }
          </Text>
        </View>
        <MealDots mealsLogged={mealsLogged} />
      </View>

      {/* Habit Progress */}
      {hasMealsLogged ? (
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={styles.habitsRow}
        >
          <HabitProgress
            label="Protein"
            icon={Drumstick}
            hits={proteinHits}
            total={proteinTotal}
            color={{
              bg: COLORS.rose100,
              icon: COLORS.rose500,
              text: COLORS.rose500,
            }}
          />
          <View style={styles.habitsDivider} />
          <HabitProgress
            label="Plants"
            icon={Leaf}
            hits={plantsHits}
            total={plantsTotal}
            color={{
              bg: COLORS.emerald100,
              icon: COLORS.emerald500,
              text: COLORS.emerald500,
            }}
          />
        </Animated.View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Tap below to log your first meal
          </Text>
        </View>
      )}

      {/* Check In Button */}
      <Pressable
        onPress={onCheckIn}
        style={({ pressed }) => [
          styles.checkInButton,
          pressed && styles.checkInButtonPressed,
        ]}
      >
        <Text style={styles.checkInButtonText}>CHECK IN</Text>
        <ChevronRight size={18} color={COLORS.white} />
      </Pressable>
    </View>
  );

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(200)}>
      <HolographicCard active={showHolographic} borderRadius={28}>
        {cardContent}
      </HolographicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  innerContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 26,
    color: COLORS.stone900,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: COLORS.stone500,
  },
  // Meal Dots
  mealDotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  mealDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.stone100,
    borderWidth: 1,
    borderColor: COLORS.stone200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealDotLogged: {
    backgroundColor: COLORS.emerald100,
    borderColor: COLORS.emerald500,
  },
  mealDotText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 10,
    color: COLORS.stone400,
  },
  // Habits Row
  habitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  habitsDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.stone200,
    marginHorizontal: 16,
  },
  habitContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: COLORS.stone500,
    marginBottom: 2,
  },
  habitValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
  },
  // Empty State
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.white,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: COLORS.stone500,
    textAlign: 'center',
  },
  // Check In Button
  checkInButton: {
    backgroundColor: COLORS.stone900,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: COLORS.stone200,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  checkInButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#000000',
  },
  checkInButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    letterSpacing: 2,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});
