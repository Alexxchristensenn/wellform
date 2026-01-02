/**
 * useReducedMotion - Accessibility Hook
 * 
 * Detects system "Reduce Motion" setting and provides
 * animation fallbacks for accessibility compliance.
 * 
 * Usage:
 * ```tsx
 * const { shouldReduceMotion, getAnimationConfig } = useReducedMotion();
 * 
 * const animatedStyle = useAnimatedStyle(() => ({
 *   transform: [{ 
 *     scale: withSpring(pressed ? getAnimationConfig().pressScale : 1) 
 *   }],
 * }));
 * ```
 * 
 * @see SIM-014 Acceptance Criteria C (Accessibility)
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { REDUCED_MOTION, DURATION, ANIMATION } from '../constants/motion';

interface ReducedMotionConfig {
  /** Whether to reduce/skip animations */
  shouldReduceMotion: boolean;
  
  /** Get appropriate duration based on setting */
  getDuration: (normalDuration: number) => number;
  
  /** Get appropriate scale for press feedback */
  getPressScale: () => number;
  
  /** Whether to skip a specific animation type */
  shouldSkip: (animationType: string) => boolean;
  
  /** Get animation config with fallbacks applied */
  getAnimationConfig: () => {
    enterDuration: number;
    exitDuration: number;
    pressScale: number;
    enableShimmer: boolean;
    enableAmbient: boolean;
  };
}

/**
 * Hook to handle Reduce Motion accessibility setting
 */
export function useReducedMotion(): ReducedMotionConfig {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Get initial value
    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      setShouldReduceMotion(isEnabled);
    });

    // Subscribe to changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setShouldReduceMotion(isEnabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const getDuration = (normalDuration: number): number => {
    if (!shouldReduceMotion) return normalDuration;
    // Use faster durations when reduced motion is enabled
    return Math.min(normalDuration, REDUCED_MOTION.enterDuration);
  };

  const getPressScale = (): number => {
    if (!shouldReduceMotion) return ANIMATION.pressScale;
    // Still provide subtle feedback even with reduced motion
    return REDUCED_MOTION.scaleMin;
  };

  const shouldSkip = (animationType: string): boolean => {
    if (!shouldReduceMotion) return false;
    return REDUCED_MOTION.skip.includes(animationType);
  };

  const getAnimationConfig = () => ({
    enterDuration: shouldReduceMotion ? REDUCED_MOTION.enterDuration : DURATION.normal,
    exitDuration: shouldReduceMotion ? REDUCED_MOTION.exitDuration : DURATION.fast,
    pressScale: shouldReduceMotion ? REDUCED_MOTION.scaleMin : ANIMATION.pressScale,
    enableShimmer: !shouldReduceMotion,
    enableAmbient: !shouldReduceMotion,
  });

  return {
    shouldReduceMotion,
    getDuration,
    getPressScale,
    shouldSkip,
    getAnimationConfig,
  };
}

export default useReducedMotion;

