/**
 * AmbientBackground - Animated Color Blobs
 * 
 * Creates the ethereal floating background effect from the web prototype.
 * Blobs smoothly transition to new positions when variant changes.
 * 
 * SIM-014: Added "Infinite Drift" animation
 * - Blobs float in oval patterns creating a subtle "breathing" effect
 * - Uses offset phases so blobs move independently
 * - Respects Reduce Motion (static when enabled)
 */

import { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { AMBIENT } from '../../constants/theme';

type Variant = 'welcome' | 'name' | 'bio' | 'height' | 'weight' | 'goal' | 'activity' | 'target' | 'education' | 'timeline' | 'myth' | 'blueprint';

interface Props {
  variant?: Variant;
}

// Drift animation constants
const DRIFT = {
  // Oval radius for drift movement (in pixels)
  radiusX: 30,
  radiusY: 20,
  // Duration for one complete orbit (in ms)
  duration1: 8000,  // Blob 1 slower
  duration2: 6000,  // Blob 2 faster (creates interesting patterns)
};

// Blob configurations for each onboarding step (using AMBIENT theme colors)
const CONFIGS: Record<Variant, { b1: { top: number; left: number; color: string }; b2: { top: number; left: number; color: string } }> = {
  welcome: { b1: { top: 0.5, left: 0.5, color: AMBIENT.gold }, b2: { top: 0.8, left: 0.8, color: AMBIENT.coral } },
  name: { b1: { top: -0.2, left: 0.2, color: AMBIENT.mint }, b2: { top: 0.9, left: 0.9, color: AMBIENT.ocean } },
  bio: { b1: { top: 0.3, left: -0.2, color: AMBIENT.gold }, b2: { top: 0.9, left: 0.9, color: AMBIENT.ocean } },
  height: { b1: { top: -0.2, left: 0.4, color: AMBIENT.coral }, b2: { top: 1.1, left: -0.1, color: AMBIENT.gold } },
  weight: { b1: { top: 0.4, left: -0.2, color: AMBIENT.ocean }, b2: { top: 0.8, left: 0.9, color: AMBIENT.mint } },
  goal: { b1: { top: 0.1, left: 0.9, color: AMBIENT.coral }, b2: { top: 1.0, left: 0.0, color: AMBIENT.gold } },
  activity: { b1: { top: 0.2, left: -0.1, color: AMBIENT.gold }, b2: { top: 0.85, left: 0.95, color: AMBIENT.coral } },
  target: { b1: { top: -0.1, left: -0.1, color: AMBIENT.mint }, b2: { top: 0.9, left: 0.9, color: AMBIENT.ocean } },
  education: { b1: { top: 0.2, left: 0.2, color: AMBIENT.ocean }, b2: { top: 0.8, left: 0.8, color: AMBIENT.coral } },
  timeline: { b1: { top: -0.1, left: 0.7, color: AMBIENT.gold }, b2: { top: 1.0, left: -0.1, color: AMBIENT.mint } },
  myth: { b1: { top: 0.3, left: 0.3, color: AMBIENT.coral }, b2: { top: 0.7, left: 0.7, color: AMBIENT.gold } },
  blueprint: { b1: { top: 0.5, left: 0.5, color: '#FFFFFF' }, b2: { top: 0.5, left: 0.5, color: AMBIENT.cream } },
};

export default function AmbientBackground({ variant = 'welcome' }: Props) {
  const { width, height } = useWindowDimensions();
  const { shouldReduceMotion } = useReducedMotion();
  const blobSize = width * 0.6;
  const config = CONFIGS[variant];

  // Shared values for blob base positions (controlled by variant)
  const blob1Top = useSharedValue(config.b1.top * height);
  const blob1Left = useSharedValue(config.b1.left * width);
  const blob2Top = useSharedValue(config.b2.top * height);
  const blob2Left = useSharedValue(config.b2.left * width);
  
  // SIM-014: Drift animation progress (0 to 1, loops infinitely)
  const drift1Progress = useSharedValue(0);
  const drift2Progress = useSharedValue(0);

  // Transition when variant changes
  useEffect(() => {
    const timing = { duration: 1200, easing: Easing.bezier(0.25, 0.8, 0.25, 1) };
    blob1Top.value = withTiming(config.b1.top * height, timing);
    blob1Left.value = withTiming(config.b1.left * width, timing);
    blob2Top.value = withTiming(config.b2.top * height, timing);
    blob2Left.value = withTiming(config.b2.left * width, timing);
  }, [variant, width, height]);

  // SIM-014: Start infinite drift animation
  useEffect(() => {
    if (shouldReduceMotion) {
      // Static when Reduce Motion is enabled
      drift1Progress.value = 0;
      drift2Progress.value = 0;
      return;
    }
    
    // Blob 1: Slower, larger orbit
    drift1Progress.value = withRepeat(
      withTiming(1, { 
        duration: DRIFT.duration1, 
        easing: Easing.linear 
      }),
      -1, // Infinite
      false // Don't reverse
    );
    
    // Blob 2: Faster orbit, creates interesting patterns
    drift2Progress.value = withRepeat(
      withTiming(1, { 
        duration: DRIFT.duration2, 
        easing: Easing.linear 
      }),
      -1,
      false
    );
  }, [shouldReduceMotion]);

  const blob1Style = useAnimatedStyle(() => {
    // Calculate drift offset using sine/cosine for oval path
    const angle = drift1Progress.value * Math.PI * 2;
    const driftX = Math.cos(angle) * DRIFT.radiusX;
    const driftY = Math.sin(angle) * DRIFT.radiusY;
    
    return {
      position: 'absolute',
      width: blobSize,
      height: blobSize,
      borderRadius: blobSize / 2,
      backgroundColor: config.b1.color,
      top: blob1Top.value - blobSize / 2 + driftY,
      left: blob1Left.value - blobSize / 2 + driftX,
      opacity: 0.5,
    };
  });

  const blob2Style = useAnimatedStyle(() => {
    // Offset phase by 90° for more interesting movement
    const angle = drift2Progress.value * Math.PI * 2 + Math.PI / 2;
    const driftX = Math.cos(angle) * DRIFT.radiusX * 0.8; // Slightly smaller orbit
    const driftY = Math.sin(angle) * DRIFT.radiusY * 1.2; // Taller oval
    
    return {
      position: 'absolute',
      width: blobSize,
      height: blobSize,
      borderRadius: blobSize / 2,
      backgroundColor: config.b2.color,
      top: blob2Top.value - blobSize / 2 + driftY,
      left: blob2Left.value - blobSize / 2 + driftX,
      opacity: 0.5,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={blob1Style} />
      <Animated.View style={blob2Style} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AMBIENT.cream,
    overflow: 'hidden',
  },
});
