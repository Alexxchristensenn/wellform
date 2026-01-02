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
 * 
 * @updated SIM-014: Uses theme tokens for visual consistency
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Drumstick, Leaf, CheckCircle, ChevronRight } from 'lucide-react-native';
import HolographicCard from '../ui/HolographicCard';
import { DayStats, MealType } from '../../types/schema';
import { STONE, ACCENT, COLORS, FONTS, TYPE, SPACING, RADII, SHADOWS, BUTTON } from '../../constants/theme';
import { DURATION } from '../../constants/motion';

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
              <CheckCircle size={12} color={ACCENT.emerald[500]} />
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
          entering={FadeIn.duration(DURATION.slow)}
          style={styles.habitsRow}
        >
          <HabitProgress
            label="Protein"
            icon={Drumstick}
            hits={proteinHits}
            total={proteinTotal}
            color={{
              bg: ACCENT.rose[100],
              icon: ACCENT.rose[500],
              text: ACCENT.rose[500],
            }}
          />
          <View style={styles.habitsDivider} />
          <HabitProgress
            label="Plants"
            icon={Leaf}
            hits={plantsHits}
            total={plantsTotal}
            color={{
              bg: ACCENT.emerald[100],
              icon: ACCENT.emerald[500],
              text: ACCENT.emerald[500],
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
    <Animated.View entering={FadeInUp.duration(DURATION.slow + 50).delay(DURATION.fast)}>
      <HolographicCard active={showHolographic} borderRadius={RADII['3xl']}>
        {cardContent}
      </HolographicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  innerContent: {
    padding: SPACING['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.displayRegular,
    fontSize: TYPE.headlineLarge.fontSize,
    lineHeight: TYPE.headlineLarge.lineHeight,
    color: STONE[900],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.sansMedium,
    fontSize: TYPE.bodySmall.fontSize,
    color: STONE[500],
  },
  // Meal Dots
  mealDotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  mealDot: {
    width: 28,
    height: 28,
    borderRadius: RADII.full,
    backgroundColor: STONE[100],
    borderWidth: 1,
    borderColor: STONE[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealDotLogged: {
    backgroundColor: ACCENT.emerald[100],
    borderColor: ACCENT.emerald[500],
  },
  mealDotText: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: 10,
    color: STONE[400],
  },
  // Habits Row
  habitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glassSubtle,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  habitsDivider: {
    width: 1,
    height: 40,
    backgroundColor: STONE[200],
    marginHorizontal: SPACING.lg,
  },
  habitContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADII.sm + 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm + 2,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitLabel: {
    fontFamily: FONTS.sansSemiBold,
    fontSize: TYPE.caption.fontSize,
    color: STONE[500],
    marginBottom: 2,
  },
  habitValue: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: TYPE.headlineSmall.fontSize,
  },
  // Empty State
  emptyState: {
    backgroundColor: COLORS.glassSubtle,
    borderRadius: RADII.xl,
    padding: SPACING['2xl'],
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.white,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: FONTS.sansMedium,
    fontSize: TYPE.bodyMedium.fontSize,
    color: STONE[500],
    textAlign: 'center',
  },
  // Check In Button - Uses BUTTON tokens
  checkInButton: {
    backgroundColor: BUTTON.primary.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: BUTTON.primary.paddingVertical,
    borderRadius: BUTTON.primary.borderRadius,
    ...SHADOWS.button,
  },
  checkInButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: BUTTON.primary.pressedBackground,
  },
  checkInButtonText: {
    fontFamily: FONTS.sansBold,
    fontSize: TYPE.labelLarge.fontSize,
    letterSpacing: 2,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
});
