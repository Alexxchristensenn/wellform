/**
 * WeightView - "Scale Metaphor" Current Weight Selection
 * 
 * Horizontal slider mimicking a bathroom scale display.
 * Large, readable numbers for accessibility.
 */

import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { useEffect } from 'react';

interface Props {
  weight: number; // in kg
  units: 'metric' | 'imperial';
  onWeightChange: (weight: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Conversion helpers
const kgToLbs = (kg: number): number => Math.round(kg * 2.205);
const lbsToKg = (lbs: number): number => lbs / 2.205;

const MIN_WEIGHT = 30; // kg
const MAX_WEIGHT = 200; // kg

export default function WeightView({ weight, units, onWeightChange, onNext, onBack }: Props) {
  const buttonScale = useSharedValue(1);
  const scaleGlow = useSharedValue(0.5);

  // Pulse effect on weight change
  useEffect(() => {
    scaleGlow.value = withTiming(1, { duration: 150 }, () => {
      scaleGlow.value = withTiming(0.5, { duration: 300 });
    });
  }, [weight]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: scaleGlow.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Format display
  const displayWeight = units === 'imperial' 
    ? `${kgToLbs(weight)}`
    : `${Math.round(weight)}`;
  const displayUnit = units === 'imperial' ? 'lbs' : 'kg';

  // Slider values based on units
  const minDisplay = units === 'imperial' ? kgToLbs(MIN_WEIGHT) : MIN_WEIGHT;
  const maxDisplay = units === 'imperial' ? kgToLbs(MAX_WEIGHT) : MAX_WEIGHT;
  const currentDisplay = units === 'imperial' ? kgToLbs(weight) : weight;

  const handleSliderChange = (value: number) => {
    const weightKg = units === 'imperial' ? lbsToKg(value) : value;
    onWeightChange(weightKg);
  };

  const handleTextChange = (text: string) => {
    const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
    const weightKg = units === 'imperial' ? lbsToKg(value) : value;
    onWeightChange(weightKg);
  };

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Current State</Text>
          </View>
          <Text style={styles.title}>What do you weigh today?</Text>
          <Text style={styles.subtitle}>
            Don't worry—this is just your starting point.
          </Text>
        </View>

        {/* Scale Display */}
        <View style={styles.scaleContainer}>
          {/* Glow effect */}
          <Animated.View style={[styles.scaleGlow, glowStyle]} />
          
          {/* Scale face */}
          <View style={styles.scaleFace}>
            <View style={styles.scaleDisplay}>
              <TextInput
                style={styles.weightInput}
                value={displayWeight}
                onChangeText={handleTextChange}
                keyboardType="number-pad"
                maxLength={3}
                selectTextOnFocus
              />
              <Text style={styles.weightUnit}>{displayUnit}</Text>
            </View>
            
            {/* Scale details */}
            <View style={styles.scaleDots}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.scaleDot} />
              ))}
            </View>
          </View>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minDisplay}
            maximumValue={maxDisplay}
            step={1}
            value={currentDisplay}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#1c1917"
            maximumTrackTintColor="#e7e5e4"
            thumbTintColor="#1c1917"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>{minDisplay} {displayUnit}</Text>
            <Text style={styles.sliderLabel}>{maxDisplay} {displayUnit}</Text>
          </View>
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
    alignItems: 'center',
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#db2777',
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
  scaleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  scaleGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#f97316',
    opacity: 0.2,
  },
  scaleFace: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#f5f5f4',
  },
  scaleDisplay: {
    alignItems: 'center',
  },
  weightInput: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 48,
    color: '#1c1917',
    textAlign: 'center',
    minWidth: 100,
    borderBottomWidth: 2,
    borderBottomColor: '#f5f5f4',
    paddingBottom: 0,
  },
  weightUnit: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 18,
    color: '#78716c',
    marginTop: -4,
  },
  scaleDots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  scaleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d6d3d1',
  },
  sliderContainer: {
    width: '100%',
    maxWidth: 400,
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
