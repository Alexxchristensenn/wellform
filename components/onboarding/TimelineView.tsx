/**
 * TimelineView - Calculate and Display Goal Timeline
 * 
 * Uses 0.75% bodyweight change per week (conservative, sustainable).
 * Shows visual timeline with milestone markers.
 */

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { calculateArrivalDate } from '../../utils/calculateMacros';

interface Props {
  currentWeight: number;
  targetWeight: number;
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  units: 'metric' | 'imperial';
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Format helpers
const kgToLbs = (kg: number): number => Math.round(kg * 2.205);

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export default function TimelineView({ 
  currentWeight, 
  targetWeight, 
  goal,
  units, 
  onNext, 
  onBack 
}: Props) {
  const buttonScale = useSharedValue(1);
  const timelineProgress = useSharedValue(0);

  const { weeks, date } = calculateArrivalDate(currentWeight, targetWeight);

  // Animate timeline on mount
  useEffect(() => {
    timelineProgress.value = withDelay(500, withTiming(1, { duration: 1500 }));
  }, []);

  const timelineStyle = useAnimatedStyle(() => ({
    width: `${timelineProgress.value * 100}%`,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Format weight display
  const formatWeight = (kg: number) => 
    units === 'imperial' ? `${kgToLbs(kg)} lbs` : `${Math.round(kg)} kg`;

  const weightDiff = Math.abs(targetWeight - currentWeight);
  const isMaintenance = goal === 'maintenance';

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Your Timeline</Text>
          </View>
          <Text style={styles.title}>
            {isMaintenance ? "You're already there!" : "Here's your journey"}
          </Text>
        </View>

        {!isMaintenance ? (
          <>
            {/* Timeline Visual */}
            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.timelineContainer}>
              <View style={styles.timelineTrack}>
                <Animated.View style={[styles.timelineProgress, timelineStyle]} />
              </View>
              
              <View style={styles.timelineLabels}>
                <View style={styles.timelinePoint}>
                  <View style={styles.pointDot} />
                  <Text style={styles.pointLabel}>Today</Text>
                  <Text style={styles.pointValue}>{formatWeight(currentWeight)}</Text>
                </View>
                
                <View style={[styles.timelinePoint, styles.timelinePointEnd]}>
                  <View style={[styles.pointDot, styles.pointDotEnd]} />
                  <Text style={styles.pointLabel}>{formatDate(date)}</Text>
                  <Text style={styles.pointValue}>{formatWeight(targetWeight)}</Text>
                </View>
              </View>
            </Animated.View>

            {/* Stats Cards */}
            <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{weeks}</Text>
                <Text style={styles.statLabel}>Weeks</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatWeight(weightDiff)}</Text>
                <Text style={styles.statLabel}>{goal === 'weight_loss' ? 'To Lose' : 'To Gain'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCard}>
                <Text style={styles.statValue}>0.75%</Text>
                <Text style={styles.statLabel}>Per Week</Text>
              </View>
            </Animated.View>

            {/* Explanation */}
            <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.explanationBox}>
              <Text style={styles.explanationText}>
                This is a <Text style={styles.explanationBold}>sustainable pace</Text>. 
                Faster results often lead to rebound. We're playing the long game.
              </Text>
            </Animated.View>
          </>
        ) : (
          // Maintenance view
          <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.maintenanceContainer}>
            <Text style={styles.maintenanceIcon}>✨</Text>
            <Text style={styles.maintenanceText}>
              No weight change needed. We'll focus on building sustainable habits and optimizing your nutrition.
            </Text>
            <View style={styles.maintenanceBenefits}>
              {['Better energy', 'Improved sleep', 'Healthier relationship with food'].map((benefit, i) => (
                <View key={i} style={styles.benefitRow}>
                  <Text style={styles.benefitCheck}>✓</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

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
            <Text style={styles.nextButtonText}>See My Plan</Text>
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
    alignItems: 'center',
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    color: '#1c1917',
    textAlign: 'center',
  },
  timelineContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  timelineTrack: {
    height: 8,
    backgroundColor: '#e7e5e4',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  timelineProgress: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 4,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timelinePoint: {
    alignItems: 'flex-start',
  },
  timelinePointEnd: {
    alignItems: 'flex-end',
  },
  pointDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f97316',
    marginBottom: 6,
  },
  pointDotEnd: {
    backgroundColor: '#22c55e',
  },
  pointLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    color: '#78716c',
    marginBottom: 2,
  },
  pointValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: '#1c1917',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e7e5e4',
    marginHorizontal: 12,
  },
  statValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#1c1917',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 11,
    color: '#78716c',
  },
  explanationBox: {
    backgroundColor: '#fafaf9',
    borderRadius: 12,
    padding: 14,
    maxWidth: 400,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
  },
  explanationText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#44403c',
    lineHeight: 20,
  },
  explanationBold: {
    fontFamily: 'Manrope_700Bold',
    color: '#1c1917',
  },
  maintenanceContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  maintenanceIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  maintenanceText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#44403c',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  maintenanceBenefits: {
    width: '100%',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  benefitCheck: {
    fontSize: 14,
    color: '#22c55e',
  },
  benefitText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: '#1c1917',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 16,
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
