/**
 * GoalView - Primary Objective Selection
 * 
 * Three large, tactile cards for goal selection.
 * Clear icons and descriptions for each option.
 */

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  onGoalChange: (goal: 'weight_loss' | 'maintenance' | 'muscle_gain') => void;
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GOALS = [
  {
    id: 'weight_loss' as const,
    icon: '📉',
    title: 'Lose Weight',
    description: 'Reduce body fat while preserving muscle mass.',
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
  {
    id: 'maintenance' as const,
    icon: '⚖️',
    title: 'Maintain',
    description: 'Keep your current weight while improving habits.',
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  {
    id: 'muscle_gain' as const,
    icon: '📈',
    title: 'Build Muscle',
    description: 'Gain lean mass with controlled surplus.',
    color: '#22c55e',
    bgColor: '#f0fdf4',
  },
];

export default function GoalView({ goal, onGoalChange, onNext, onBack }: Props) {
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Your Mission</Text>
          </View>
          <Text style={styles.title}>What's your primary goal?</Text>
          <Text style={styles.subtitle}>
            We'll customize your plan around this objective.
          </Text>
        </View>

        {/* Goal Cards */}
        <View style={styles.cardsContainer}>
          {GOALS.map((g, index) => (
            <Animated.View
              key={g.id}
              entering={FadeInUp.duration(400).delay(index * 100)}
            >
              <Pressable
                onPress={() => onGoalChange(g.id)}
                style={[
                  styles.goalCard,
                  { backgroundColor: g.bgColor },
                  goal === g.id && styles.goalCardActive,
                  goal === g.id && { borderColor: g.color },
                ]}
              >
                <View style={[styles.iconCircle, { backgroundColor: g.color + '20' }]}>
                  <Text style={styles.goalIcon}>{g.icon}</Text>
                </View>
                <View style={styles.goalContent}>
                  <Text style={[styles.goalTitle, goal === g.id && { color: g.color }]}>
                    {g.title}
                  </Text>
                  <Text style={styles.goalDescription}>{g.description}</Text>
                </View>
                {/* Selection indicator */}
                <View style={[
                  styles.selectionDot,
                  goal === g.id && { backgroundColor: g.color },
                ]} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <AnimatedPressable
            onPress={onNext}
            onPressIn={() => { buttonScale.value = withSpring(0.95); }}
            onPressOut={() => { buttonScale.value = withSpring(1); }}
            style={[styles.nextButton, buttonStyle]}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#9333ea',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: '#78716c',
    textAlign: 'center',
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    alignSelf: 'center',
    marginBottom: 24,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 14,
  },
  goalCardActive: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalIcon: {
    fontSize: 24,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: '#1c1917',
    marginBottom: 2,
  },
  goalDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#78716c',
    lineHeight: 18,
  },
  selectionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6d3d1',
    backgroundColor: 'transparent',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#78716c',
  },
  nextButton: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
