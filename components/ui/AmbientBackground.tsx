/**
 * AmbientBackground - Animated Color Blobs
 * 
 * Creates the ethereal floating background effect from the web prototype.
 * Blobs smoothly transition to new positions when variant changes.
 */

import { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';

type Variant = 'welcome' | 'name' | 'bio' | 'height' | 'weight' | 'goal' | 'activity' | 'target' | 'education' | 'timeline' | 'myth' | 'blueprint';

interface Props {
  variant?: Variant;
}

// Blob configurations for each onboarding step
const CONFIGS: Record<Variant, { b1: { top: number; left: number; color: string }; b2: { top: number; left: number; color: string } }> = {
  welcome: { b1: { top: 0.5, left: 0.5, color: '#FFD166' }, b2: { top: 0.8, left: 0.8, color: '#EF476F' } },
  name: { b1: { top: -0.2, left: 0.2, color: '#06D6A0' }, b2: { top: 0.9, left: 0.9, color: '#118AB2' } },
  bio: { b1: { top: 0.3, left: -0.2, color: '#FFD166' }, b2: { top: 0.9, left: 0.9, color: '#118AB2' } },
  height: { b1: { top: -0.2, left: 0.4, color: '#EF476F' }, b2: { top: 1.1, left: -0.1, color: '#FFD166' } },
  weight: { b1: { top: 0.4, left: -0.2, color: '#118AB2' }, b2: { top: 0.8, left: 0.9, color: '#06D6A0' } },
  goal: { b1: { top: 0.1, left: 0.9, color: '#EF476F' }, b2: { top: 1.0, left: 0.0, color: '#FFD166' } },
  activity: { b1: { top: 0.2, left: -0.1, color: '#FFD166' }, b2: { top: 0.85, left: 0.95, color: '#EF476F' } },
  target: { b1: { top: -0.1, left: -0.1, color: '#06D6A0' }, b2: { top: 0.9, left: 0.9, color: '#118AB2' } },
  education: { b1: { top: 0.2, left: 0.2, color: '#118AB2' }, b2: { top: 0.8, left: 0.8, color: '#EF476F' } },
  timeline: { b1: { top: -0.1, left: 0.7, color: '#FFD166' }, b2: { top: 1.0, left: -0.1, color: '#06D6A0' } },
  myth: { b1: { top: 0.3, left: 0.3, color: '#EF476F' }, b2: { top: 0.7, left: 0.7, color: '#FFD166' } },
  blueprint: { b1: { top: 0.5, left: 0.5, color: '#FFFFFF' }, b2: { top: 0.5, left: 0.5, color: '#F8F6F2' } },
};

export default function AmbientBackground({ variant = 'welcome' }: Props) {
  const { width, height } = useWindowDimensions();
  const blobSize = width * 0.6;
  const config = CONFIGS[variant];

  // Shared values for blob positions
  const blob1Top = useSharedValue(config.b1.top * height);
  const blob1Left = useSharedValue(config.b1.left * width);
  const blob2Top = useSharedValue(config.b2.top * height);
  const blob2Left = useSharedValue(config.b2.left * width);

  // Transition when variant changes
  useEffect(() => {
    const timing = { duration: 1200, easing: Easing.bezier(0.25, 0.8, 0.25, 1) };
    blob1Top.value = withTiming(config.b1.top * height, timing);
    blob1Left.value = withTiming(config.b1.left * width, timing);
    blob2Top.value = withTiming(config.b2.top * height, timing);
    blob2Left.value = withTiming(config.b2.left * width, timing);
  }, [variant, width, height]);

  const blob1Style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: blobSize,
    height: blobSize,
    borderRadius: blobSize / 2,
    backgroundColor: config.b1.color,
    top: blob1Top.value - blobSize / 2,
    left: blob1Left.value - blobSize / 2,
    opacity: 0.5,
  }));

  const blob2Style = useAnimatedStyle(() => ({
    position: 'absolute',
    width: blobSize,
    height: blobSize,
    borderRadius: blobSize / 2,
    backgroundColor: config.b2.color,
    top: blob2Top.value - blobSize / 2,
    left: blob2Left.value - blobSize / 2,
    opacity: 0.5,
  }));

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
    backgroundColor: '#F8F6F2',
    overflow: 'hidden',
  },
});
