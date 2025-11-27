/**
 * TargetWeightView - Goal Weight Selection
 * 
 * Shows current weight vs target with visual comparison.
 * Horizontal slider for easy adjustment.
 */

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

interface Props {
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  units: 'metric' | 'imperial';
  onTargetChange: (weight: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Conversion helpers
const kgToLbs = (kg: number): number => Math.round(kg * 2.205);
const lbsToKg = (lbs: number): number => lbs / 2.205;

export default function TargetWeightView({ 
  currentWeight, 
  targetWeight, 
  goal,
  units, 
  onTargetChange, 
  onNext, 
  onBack 
}: Props) {
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Calculate slider bounds based on goal
  const minWeight = goal === 'weight_loss' 
    ? Math.max(currentWeight * 0.7, 40) // Max 30% loss
    : currentWeight;
  const maxWeight = goal === 'muscle_gain'
    ? currentWeight * 1.3 // Max 30% gain
    : currentWeight;

  // For maintenance, allow small range
  const actualMin = goal === 'maintenance' ? currentWeight * 0.95 : minWeight;
  const actualMax = goal === 'maintenance' ? currentWeight * 1.05 : maxWeight;

  // Format display
  const formatWeight = (kg: number) => 
    units === 'imperial' ? `${kgToLbs(kg)} lbs` : `${Math.round(kg)} kg`;

  const difference = targetWeight - currentWeight;
  const differenceText = difference === 0 
    ? 'Maintain' 
    : `${difference > 0 ? '+' : ''}${formatWeight(Math.abs(difference))}`;

  // Slider values based on units
  const minDisplay = units === 'imperial' ? kgToLbs(actualMin) : actualMin;
  const maxDisplay = units === 'imperial' ? kgToLbs(actualMax) : actualMax;
  const currentDisplay = units === 'imperial' ? kgToLbs(targetWeight) : targetWeight;

  const handleSliderChange = (value: number) => {
    hapticSelection();
    const weightKg = units === 'imperial' ? lbsToKg(value) : value;
    onTargetChange(weightKg);
  };

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Destination</Text>
          </View>
          <Text style={styles.title}>Where are we headed?</Text>
          <Text style={styles.subtitle}>
            Set a realistic target. We'll calculate your timeline.
          </Text>
        </View>

        {/* Weight Comparison */}
        <View style={styles.comparisonContainer}>
          {/* Current */}
          <View style={styles.weightBox}>
            <Text style={styles.weightLabel}>NOW</Text>
            <Text style={styles.weightValue}>{formatWeight(currentWeight)}</Text>
          </View>

          {/* Arrow & Difference */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
            <Text style={[
              styles.differenceText,
              difference < 0 && styles.differenceNegative,
              difference > 0 && styles.differencePositive,
            ]}>
              {differenceText}
            </Text>
          </View>

          {/* Target */}
          <View style={[styles.weightBox, styles.weightBoxTarget]}>
            <Text style={[styles.weightLabel, { color: '#a8a29e' }]}>GOAL</Text>
            <Text style={[styles.weightValue, styles.weightValueTarget]}>
              {formatWeight(targetWeight)}
            </Text>
          </View>
        </View>

        {/* Slider */}
        {goal !== 'maintenance' && (
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={minDisplay}
              maximumValue={maxDisplay}
              step={1}
              value={currentDisplay}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={goal === 'weight_loss' ? '#ef4444' : '#22c55e'}
              maximumTrackTintColor="#e7e5e4"
              thumbTintColor="#1c1917"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>{formatWeight(actualMin)}</Text>
              <Text style={styles.sliderLabel}>{formatWeight(actualMax)}</Text>
            </View>
          </View>
        )}

        {goal === 'maintenance' && (
          <View style={styles.maintenanceNote}>
            <Text style={styles.maintenanceText}>
              ✓ Great choice! We'll focus on sustainable habits.
            </Text>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <AnimatedPressable
            onPress={onNext}
            onPressIn={() => { 
              hapticLight();
              buttonScale.value = withSpring(0.95); 
            }}
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
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
  },
  weightBox: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weightBoxTarget: {
    backgroundColor: '#1c1917',
  },
  weightLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    color: '#78716c',
    letterSpacing: 2,
    marginBottom: 6,
  },
  weightValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#1c1917',
  },
  weightValueTarget: {
    color: 'white',
  },
  arrowContainer: {
    alignItems: 'center',
  },
  arrow: {
    fontSize: 20,
    color: '#d6d3d1',
    marginBottom: 4,
  },
  differenceText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#78716c',
  },
  differenceNegative: {
    color: '#ef4444',
  },
  differencePositive: {
    color: '#22c55e',
  },
  sliderContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#a8a29e',
  },
  maintenanceNote: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  maintenanceText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#059669',
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
