/**
 * DailyPulseFeed - The Core Feed Component
 * 
 * Renders cards in a specific order based on time of day:
 * - Morning (5AM - 11AM): Lesson → Scale → Rituals → Nourishment
 * - Day (11AM - 7PM): Nourishment → Scale → Rituals → Lesson
 * - Evening (7PM+): Rituals → Scale → Nourishment → Lesson
 * 
 * @updated SIM-006: NourishmentCard now receives behavior stats instead of calories
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import useTimeOfDay, { TimeOfDay } from '../../hooks/useTimeOfDay';
import LessonCard from '../cards/LessonCard';
import NourishmentCard from '../cards/NourishmentCard';
import RitualsCard from '../cards/RitualsCard';
import ScaleCard from '../cards/ScaleCard';
import { GoldenRule } from '../../services/content';
import { DayStats } from '../../types/schema';

interface DailyPulseFeedProps {
  // Nourishment state (SIM-006: Now behavior-based)
  stats: DayStats;
  onCheckIn?: () => void;
  
  // Weight/Scale state
  currentWeight: number | null;
  trendWeight: number | null;
  previousTrend: number | null;
  hasLoggedWeightToday: boolean;
  units: 'metric' | 'imperial';
  startWeight: number;
  goalWeight: number;
  
  // Rituals state
  hydrationLiters: number;
  movementMins: number;
  
  // Content
  dailyRule?: GoldenRule | null;
  
  // Actions
  onLogWeight?: (weightKg: number) => Promise<boolean>;
  onRitualPress?: (ritualId: string) => void;
  onRitualInfoPress?: (ritualId: string) => void;
}

type CardType = 'lesson' | 'nourishment' | 'scale' | 'rituals';

// Scale card positioned below Nourishment for natural flow:
// Log food → Check weight trend → Complete rituals
const CARD_ORDER: Record<TimeOfDay, CardType[]> = {
  morning: ['lesson', 'scale', 'rituals', 'nourishment'],
  day: ['nourishment', 'scale', 'rituals', 'lesson'],
  evening: ['rituals', 'scale', 'nourishment', 'lesson'],
};

export default function DailyPulseFeed({
  stats,
  onCheckIn,
  currentWeight,
  trendWeight,
  previousTrend,
  hasLoggedWeightToday,
  units,
  startWeight,
  goalWeight,
  hydrationLiters = 0,
  movementMins = 0,
  dailyRule,
  onLogWeight,
  onRitualPress,
  onRitualInfoPress,
}: DailyPulseFeedProps) {
  const { timeOfDay } = useTimeOfDay();
  const cardOrder = CARD_ORDER[timeOfDay];

  // Prepare rituals data
  const rituals = [
    {
      id: 'hydration',
      name: 'Hydration',
      current: hydrationLiters,
      target: 3,
      unit: 'Liters',
      icon: 'hydration' as const,
      color: {
        bg: '#eff6ff',
        icon: '#3b82f6',
        text: '#2563eb',
        border: '#60a5fa',
      },
    },
    {
      id: 'movement',
      name: 'Movement',
      current: movementMins,
      target: 30,
      unit: 'mins goal',
      icon: 'movement' as const,
      color: {
        bg: '#faf5ff',
        icon: '#a855f7',
        text: '#9333ea',
        border: '#c084fc',
      },
    },
  ];

  const renderCard = (type: CardType, index: number) => {
    switch (type) {
      case 'lesson':
        return (
          <View key={`${type}-${index}`} style={styles.cardWrapper}>
            <LessonCard
              ruleNumber={dailyRule?.ruleNumber}
              title={dailyRule?.title}
              subtitle={dailyRule?.subtitle}
              content={dailyRule?.content}
              readTime={dailyRule?.readTime}
            />
          </View>
        );
      case 'nourishment':
        return (
          <View key={`${type}-${index}`} style={styles.cardWrapper}>
            <NourishmentCard
              stats={stats}
              onCheckIn={onCheckIn}
            />
          </View>
        );
      case 'scale':
        return (
          <View key={`${type}-${index}`} style={styles.cardWrapper}>
            <ScaleCard
              currentWeight={currentWeight}
              trendWeight={trendWeight}
              previousTrend={previousTrend}
              hasLoggedToday={hasLoggedWeightToday}
              units={units}
              startWeight={startWeight}
              goalWeight={goalWeight}
              onLogWeight={onLogWeight ?? (async () => false)}
            />
          </View>
        );
      case 'rituals':
        return (
          <View key={`${type}-${index}`} style={styles.cardWrapper}>
            <RitualsCard
              rituals={rituals}
              onRitualPress={onRitualPress}
              onInfoPress={onRitualInfoPress}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      {cardOrder.map((cardType, index) => renderCard(cardType, index))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  cardWrapper: {
    // Individual card wrapper for consistent spacing
  },
});
