/**
 * HeightView - "Wall Metaphor" Height Selection
 * 
 * A vertical bar that fills as the slider moves up.
 * Visual representation of measuring against a wall.
 */

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
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
  height: number; // in cm
  units: 'metric' | 'imperial';
  onHeightChange: (height: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Conversion helpers
const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  return { feet, inches };
};

const MIN_HEIGHT = 120; // cm
const MAX_HEIGHT = 220; // cm
const BAR_HEIGHT = 200; // Reduced from 280 for better fit

export default function HeightView({ height, units, onHeightChange, onNext, onBack }: Props) {
  const buttonScale = useSharedValue(1);
  const fillProgress = useSharedValue(0);

  // Animate fill when height changes
  useEffect(() => {
    const progress = (height - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT);
    fillProgress.value = withTiming(progress, { duration: 200 });
  }, [height]);

  const fillStyle = useAnimatedStyle(() => ({
    height: fillProgress.value * BAR_HEIGHT,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Format display
  const displayHeight = units === 'imperial' 
    ? (() => {
        const { feet, inches } = cmToFeetInches(height);
        return `${feet}'${inches}"`;
      })()
    : `${height} cm`;

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Measurements</Text>
          </View>
          <Text style={styles.title}>How tall are you?</Text>
        </View>

        {/* Wall Metaphor Visual */}
        <View style={styles.visualContainer}>
          {/* Measurement Bar */}
          <View style={styles.measurementBar}>
            {/* Fill from bottom */}
            <Animated.View style={[styles.measurementFill, fillStyle]} />
            
            {/* Height indicator */}
            <View style={styles.heightIndicator}>
              <Text style={styles.heightValue}>{displayHeight}</Text>
            </View>
          </View>

          {/* Human silhouette hint */}
          <View style={styles.silhouetteContainer}>
            <Text style={styles.silhouette}>🧍</Text>
          </View>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={MIN_HEIGHT}
            maximumValue={MAX_HEIGHT}
            step={1}
            value={height}
            onValueChange={onHeightChange}
            minimumTrackTintColor="#1c1917"
            maximumTrackTintColor="#e7e5e4"
            thumbTintColor="#1c1917"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>{units === 'imperial' ? "4'0\"" : '120 cm'}</Text>
            <Text style={styles.sliderLabel}>{units === 'imperial' ? "7'2\"" : '220 cm'}</Text>
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
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#1c1917',
    textAlign: 'center',
  },
  visualContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: BAR_HEIGHT + 24,
    marginBottom: 24,
    gap: 20,
  },
  measurementBar: {
    width: 50,
    height: BAR_HEIGHT,
    backgroundColor: '#f5f5f4',
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderColor: '#e7e5e4',
  },
  measurementFill: {
    width: '100%',
    backgroundColor: '#1c1917',
    borderRadius: 23,
  },
  heightIndicator: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  heightValue: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: 'white',
    backgroundColor: '#1c1917',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  silhouetteContainer: {
    justifyContent: 'flex-end',
    height: BAR_HEIGHT,
  },
  silhouette: {
    fontSize: 48,
    opacity: 0.3,
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
