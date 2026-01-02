/**
 * HolographicCard - Premium Rainbow Shimmer Effect
 * 
 * Recreates the CSS `rainbow-slide` animation using react-native-reanimated.
 * 
 * Technique: Since we can't animate background-position in RN, we create
 * an oversized LinearGradient (2x width) and animate its translateX position
 * to simulate the sliding effect. The gradient is clipped by the parent container.
 * 
 * SIM-014 Upgrades:
 * - Subtle vertical drift for more "liquid" feel
 * - Specular highlight sweep on activation
 * - Reduced intensity for calm, restrained elegance
 * - Respects Reduce Motion accessibility setting
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
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { HOLOGRAPHIC, COLORS, SHADOWS, RADII } from '../../constants/theme';
import { DURATION, TIMING, ANIMATION, EASING } from '../../constants/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { createShadow } from '../../utils/shadows';

interface HolographicCardProps {
  children: React.ReactNode;
  active?: boolean;
  /** Trigger specular sweep animation (e.g., on completion) */
  celebrate?: boolean;
  style?: ViewStyle;
  borderRadius?: number;
}

// SIM-014: More subtle, premium gradient colors
// Reduced opacity for calm elegance, not flashy
const GRADIENT_COLORS = [
  'rgba(255, 255, 255, 0.92)',    // Soft white
  'rgba(255, 190, 200, 0.35)',    // Whisper pink
  'rgba(190, 245, 255, 0.35)',    // Whisper cyan
  'rgba(255, 252, 200, 0.35)',    // Whisper yellow
  'rgba(255, 255, 255, 0.92)',    // Soft white
];

// Gradient stops - slightly tighter for more refined shimmer
const GRADIENT_LOCATIONS: readonly [number, number, ...number[]] = [0.05, 0.28, 0.5, 0.72, 0.95];

// Specular highlight for celebration sweep
const SPECULAR_COLORS = [
  'rgba(255, 255, 255, 0)',
  'rgba(255, 255, 255, 0.6)',
  'rgba(255, 255, 255, 0)',
];
const SPECULAR_LOCATIONS: readonly [number, number, ...number[]] = [0, 0.5, 1];

export default function HolographicCard({
  children,
  active = true,
  celebrate = false,
  style,
  borderRadius = RADII['3xl'],
}: HolographicCardProps) {
  // Accessibility: Reduce Motion support
  const { shouldReduceMotion, getAnimationConfig } = useReducedMotion();
  const animConfig = getAnimationConfig();
  
  // Container dimensions for pixel-based animation
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Animation progress value (0 to 1)
  const shimmerProgress = useSharedValue(0);
  // SIM-014: Vertical drift for more organic "liquid" movement
  const verticalDrift = useSharedValue(0);
  // Pop-in scale animation
  const popScale = useSharedValue(active ? ANIMATION.popInStart : 1);
  // Flash/glow effect
  const glowIntensity = useSharedValue(1);
  // SIM-014: Specular highlight sweep (triggered on celebrate)
  const specularProgress = useSharedValue(-1);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerWidth(width);
    setContainerHeight(height);
  };

  useEffect(() => {
    if (active) {
      // Pop-in animation (mimics CSS pop-in-shimmer)
      // SIM-014: Respects Reduce Motion - uses subtle scale only
      if (shouldReduceMotion) {
        popScale.value = withTiming(1, { duration: DURATION.fast });
      } else {
        popScale.value = withSequence(
          withTiming(ANIMATION.popInOvershoot, { 
            duration: DURATION.normal, 
            easing: EASING.bounce 
          }),
          withTiming(ANIMATION.popInEnd, { 
            duration: DURATION.fast, 
            easing: EASING.decelerate 
          })
        );
      }

      // Glow settle animation
      if (!shouldReduceMotion) {
        glowIntensity.value = withSequence(
          withTiming(1.1, { duration: DURATION.micro }),
          withTiming(1, { 
            duration: DURATION.deliberate, 
            easing: EASING.decelerate 
          })
        );
      }

      // SIM-014: Enhanced shimmer with slower, more premium duration
      if (animConfig.enableShimmer) {
        // Horizontal shimmer - slower for elegance (4 seconds vs 3)
        shimmerProgress.value = withRepeat(
          withTiming(1, { 
            duration: 4000, 
            easing: EASING.smooth 
          }),
          -1,
          true
        );
        
        // SIM-014: Subtle vertical drift - creates "liquid surface" illusion
        // Offset cycle from horizontal for more organic movement
        verticalDrift.value = withDelay(
          500,
          withRepeat(
            withTiming(1, { 
              duration: 5000, 
              easing: EASING.smooth 
            }),
            -1,
            true
          )
        );
      }
    } else {
      shimmerProgress.value = 0;
      verticalDrift.value = 0;
      popScale.value = 1;
      glowIntensity.value = 1;
    }
  }, [active, shouldReduceMotion]);

  // SIM-014: Trigger specular sweep on celebrate prop change
  useEffect(() => {
    if (celebrate && !shouldReduceMotion) {
      specularProgress.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { 
          duration: DURATION.deliberate, 
          easing: EASING.decelerate 
        }),
        withTiming(2, { duration: 0 }) // Reset off-screen
      );
    }
  }, [celebrate, shouldReduceMotion]);

  // Animated style for the gradient container
  // We translate the gradient to create the sliding effect
  const gradientContainerStyle = useAnimatedStyle(() => {
    // The gradient is 200% width, so we translate from 0 to -containerWidth
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [0, -containerWidth]
    );
    
    // SIM-014: Subtle vertical drift for "liquid surface" effect
    // Range is ±8px - enough to notice but not distracting
    const translateY = interpolate(
      verticalDrift.value,
      [0, 0.5, 1],
      [-8, 8, -8]
    );

    return {
      transform: [{ translateX }, { translateY }],
      opacity: glowIntensity.value,
    };
  });

  // SIM-014: Specular highlight sweep animation
  const specularStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      specularProgress.value,
      [-1, 0, 1, 2],
      [-containerWidth * 0.5, -containerWidth * 0.3, containerWidth * 1.3, containerWidth * 2]
    );
    
    const opacity = interpolate(
      specularProgress.value,
      [-1, 0, 0.5, 1, 2],
      [0, 0.8, 1, 0.8, 0]
    );

    return {
      transform: [{ translateX }, { rotate: '15deg' }],
      opacity,
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
        {/* SIM-014: Oversized gradient with vertical drift */}
        <Animated.View 
          style={[
            styles.gradientWrapper, 
            { 
              width: containerWidth * 2,
              height: containerHeight + 24, // Extra height for vertical drift
              top: -12, // Center the extra height
            },
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
        
        {/* SIM-014: Specular highlight sweep (appears on celebrate) */}
        <Animated.View 
          style={[
            styles.specularHighlight,
            { height: containerHeight * 1.5 },
            specularStyle,
          ]}
        >
          <LinearGradient
            colors={SPECULAR_COLORS}
            locations={SPECULAR_LOCATIONS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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

// Platform-safe holographic shadow
// Subtle shadow for holographic cards - should be understated
const HOLOGRAPHIC_SHADOW = createShadow({
  color: 'rgba(0, 0, 0, 0.08)',
  offsetX: 0,
  offsetY: 2,
  opacity: 1,
  radius: 8,
  elevation: 2,
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    // SIM-014: Softer shadow for more premium feel (platform-safe)
    ...HOLOGRAPHIC_SHADOW,
  },
  inactiveContainer: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
  },
  gradientClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientWrapper: {
    position: 'absolute',
    left: 0,
  },
  gradient: {
    flex: 1,
  },
  // SIM-014: Specular highlight for celebration sweep
  specularHighlight: {
    position: 'absolute',
    top: -50,
    width: 80,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
