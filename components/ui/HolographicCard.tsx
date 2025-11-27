/**
 * HolographicCard - The Rainbow Shimmer Effect
 * 
 * Recreates the CSS `rainbow-slide` animation using react-native-reanimated.
 * 
 * Technique: Since we can't animate background-position in RN, we create
 * an oversized LinearGradient (2x width) and animate its translateX position
 * to simulate the sliding effect. The gradient is clipped by the parent container.
 * 
 * CSS Reference:
 * @keyframes rainbow-slide {
 *   0% { background-position: 0% 50%; }
 *   100% { background-position: 200% 50%; }
 * }
 * 
 * background: linear-gradient(110deg, #fff 10%, #ffb4be 30%, #b4f0ff 50%, #fffab4 70%, #fff 90%);
 * background-size: 200% 200%;
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface HolographicCardProps {
  children: React.ReactNode;
  active?: boolean;
  style?: ViewStyle;
  borderRadius?: number;
}

// Rainbow gradient colors (translating the CSS gradient)
const GRADIENT_COLORS = [
  'rgba(255, 255, 255, 0.95)',    // White at start
  'rgba(255, 180, 190, 0.5)',     // Soft pink #ffb4be
  'rgba(180, 240, 255, 0.5)',     // Soft cyan #b4f0ff
  'rgba(255, 250, 180, 0.5)',     // Soft yellow #fffab4
  'rgba(255, 255, 255, 0.95)',    // White at end
];

// Gradient stops
const GRADIENT_LOCATIONS: readonly [number, number, ...number[]] = [0.1, 0.3, 0.5, 0.7, 0.9];

export default function HolographicCard({
  children,
  active = true,
  style,
  borderRadius = 28,
}: HolographicCardProps) {
  // Container dimensions for pixel-based animation
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Animation progress value (0 to 1)
  const shimmerProgress = useSharedValue(0);
  // Pop-in scale animation
  const popScale = useSharedValue(active ? 0.95 : 1);
  // Flash effect
  const flashOpacity = useSharedValue(1);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  useEffect(() => {
    if (active) {
      // Pop-in animation (mimics CSS pop-in-shimmer)
      popScale.value = withSequence(
        withTiming(1.02, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      );

      // Flash settle animation
      flashOpacity.value = withSequence(
        withTiming(1.15, { duration: 100 }),
        withTiming(1, { duration: 800, easing: Easing.out(Easing.ease) })
      );

      // Continuous shimmer animation - uses reverse for smooth back-and-forth
      // This creates a natural "light sweeping across surface" effect
      // without the jarring jump that occurs with one-directional infinite scroll
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease), // Smooth acceleration/deceleration
        }),
        -1,   // Infinite repeat
        true  // Reverse direction each cycle for seamless loop
      );
    } else {
      shimmerProgress.value = 0;
      popScale.value = 1;
      flashOpacity.value = 1;
    }
  }, [active]);

  // Animated style for the gradient container
  // We translate the gradient to create the sliding effect
  const gradientContainerStyle = useAnimatedStyle(() => {
    // The gradient is 200% width, so we translate from 0 to -containerWidth
    // This creates the effect of the gradient sliding through
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [0, -containerWidth]
    );

    return {
      transform: [{ translateX }],
      opacity: flashOpacity.value,
    };
  });

  // Container scale animation
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popScale.value }],
  }));

  if (!active) {
    // When not active, render as a simple card with glass effect
    return (
      <View style={[styles.inactiveContainer, { borderRadius }, style]}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View 
      style={[styles.container, { borderRadius }, containerStyle, style]}
      onLayout={handleLayout}
    >
      {/* Clipping container */}
      <View style={[styles.gradientClip, { borderRadius }]}>
        {/* The oversized gradient that slides */}
        <Animated.View 
          style={[
            styles.gradientWrapper, 
            { width: containerWidth * 2 },
            gradientContainerStyle,
          ]}
        >
          <LinearGradient
            colors={GRADIENT_COLORS}
            locations={GRADIENT_LOCATIONS}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
      
      {/* Holographic border */}
      <View style={[styles.border, { borderRadius }]} />
      
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'rgba(100, 200, 255, 0.4)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 8,
  },
  inactiveContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 4,
  },
  gradientClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
