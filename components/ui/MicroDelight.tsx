/**
 * MicroDelight - Signature Celebration Moment
 * 
 * A tiny animated stick-figure weightlifter that appears on meaningful wins.
 * 
 * SIM-014: "Micro-Delight Without Clown Energy"
 * - Subtle, quick, and skippable
 * - Appears occasionally on milestones (not every tap)
 * - Respects Reduce Motion (falls back to fade + subtle scale)
 * 
 * Trigger conditions:
 * - First protein hit of the day
 * - Streak milestones (3, 7, 14, 30 days)
 * - Lesson completion
 * - Weight goal progress (every 1kg toward goal)
 * 
 * Usage:
 * ```tsx
 * <MicroDelight 
 *   visible={showCelebration} 
 *   variant="lift" 
 *   onComplete={() => setShowCelebration(false)} 
 * />
 * ```
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import { COLORS, STONE, RADII, SPACING } from '../../constants/theme';
import { DURATION, EASING as MOTION_EASING, SPRING } from '../../constants/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MicroDelightProps {
  /** Whether the celebration is visible */
  visible: boolean;
  /** Animation variant */
  variant?: 'lift' | 'jump' | 'flex';
  /** Called when animation completes or user dismisses */
  onComplete?: () => void;
  /** Auto-dismiss duration in ms (default 2000) */
  duration?: number;
}

// SVG viewBox dimensions
const SIZE = 80;
const CENTER_X = SIZE / 2;
const CENTER_Y = SIZE / 2;

/**
 * StickFigure - Animated SVG weightlifter
 * 
 * Simple, recognizable figure performing a successful lift.
 * Design: Circle head, line body, angled arms holding barbell, V legs.
 */
function StickFigure({ progress }: { progress: Animated.SharedValue<number> }) {
  const { shouldReduceMotion } = useReducedMotion();
  
  // Head position (bobs up slightly on lift)
  const headStyle = useAnimatedStyle(() => {
    const translateY = progress.value * -3;
    return { transform: [{ translateY }] };
  });

  // Arms angle (from down to up position)
  const leftArmProps = useAnimatedProps(() => {
    // Arm goes from angled down (120°) to straight up (30°)
    const startAngle = 120;
    const endAngle = 30;
    const angle = startAngle + (endAngle - startAngle) * progress.value;
    const radians = (angle * Math.PI) / 180;
    const armLength = 14;
    
    const x2 = CENTER_X - 8 + Math.cos(radians) * armLength;
    const y2 = 32 + Math.sin(radians) * armLength;
    
    return {
      x1: CENTER_X - 8,
      y1: 32,
      x2,
      y2,
    };
  });

  const rightArmProps = useAnimatedProps(() => {
    const startAngle = 60;
    const endAngle = 150;
    const angle = startAngle + (endAngle - startAngle) * progress.value;
    const radians = (angle * Math.PI) / 180;
    const armLength = 14;
    
    const x2 = CENTER_X + 8 + Math.cos(radians) * armLength;
    const y2 = 32 + Math.sin(radians) * armLength;
    
    return {
      x1: CENTER_X + 8,
      y1: 32,
      x2,
      y2,
    };
  });

  // Barbell position (follows hands)
  const barbellProps = useAnimatedProps(() => {
    const startY = 44;
    const endY = 20;
    const y = startY + (endY - startY) * progress.value;
    
    return {
      y1: y,
      y2: y,
    };
  });

  // Leg crouch (slight bend on lift)
  const leftLegProps = useAnimatedProps(() => {
    const bendAmount = progress.value * 4;
    return {
      x2: CENTER_X - 10 - bendAmount,
      y2: 62 - bendAmount,
    };
  });

  const rightLegProps = useAnimatedProps(() => {
    const bendAmount = progress.value * 4;
    return {
      x2: CENTER_X + 10 + bendAmount,
      y2: 62 - bendAmount,
    };
  });

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {/* Head */}
      <AnimatedCircle
        cx={CENTER_X}
        cy={22}
        r={8}
        fill="none"
        stroke={STONE[700]}
        strokeWidth={2.5}
        // @ts-ignore - animated styles work at runtime
        style={headStyle}
      />
      
      {/* Body */}
      <Line
        x1={CENTER_X}
        y1={30}
        x2={CENTER_X}
        y2={50}
        stroke={STONE[700]}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      
      {/* Left Arm */}
      <AnimatedLine
        stroke={STONE[700]}
        strokeWidth={2.5}
        strokeLinecap="round"
        animatedProps={leftArmProps}
      />
      
      {/* Right Arm */}
      <AnimatedLine
        stroke={STONE[700]}
        strokeWidth={2.5}
        strokeLinecap="round"
        animatedProps={rightArmProps}
      />
      
      {/* Left Leg */}
      <AnimatedLine
        x1={CENTER_X}
        y1={50}
        stroke={STONE[700]}
        strokeWidth={2.5}
        strokeLinecap="round"
        animatedProps={leftLegProps}
      />
      
      {/* Right Leg */}
      <AnimatedLine
        x1={CENTER_X}
        y1={50}
        stroke={STONE[700]}
        strokeWidth={2.5}
        strokeLinecap="round"
        animatedProps={rightLegProps}
      />
      
      {/* Barbell */}
      <G>
        {/* Bar */}
        <AnimatedLine
          x1={CENTER_X - 22}
          x2={CENTER_X + 22}
          stroke={STONE[600]}
          strokeWidth={2}
          strokeLinecap="round"
          animatedProps={barbellProps}
        />
        {/* Left weight */}
        <AnimatedCircle
          cx={CENTER_X - 22}
          r={5}
          fill={STONE[600]}
          animatedProps={useAnimatedProps(() => ({
            cy: 44 + (20 - 44) * progress.value,
          }))}
        />
        {/* Right weight */}
        <AnimatedCircle
          cx={CENTER_X + 22}
          r={5}
          fill={STONE[600]}
          animatedProps={useAnimatedProps(() => ({
            cy: 44 + (20 - 44) * progress.value,
          }))}
        />
      </G>
    </Svg>
  );
}

export default function MicroDelight({
  visible,
  variant = 'lift',
  onComplete,
  duration = 2000,
}: MicroDelightProps) {
  const { shouldReduceMotion } = useReducedMotion();
  
  // Container animation values
  const containerOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.8);
  
  // Figure animation progress (0 = start pose, 1 = end pose)
  const liftProgress = useSharedValue(0);

  const handleComplete = () => {
    onComplete?.();
  };

  useEffect(() => {
    if (visible) {
      if (shouldReduceMotion) {
        // Reduced motion: simple fade in/out
        containerOpacity.value = withSequence(
          withTiming(1, { duration: DURATION.fast }),
          withDelay(duration - DURATION.fast * 2, withTiming(0, { duration: DURATION.fast }))
        );
        containerScale.value = withTiming(1, { duration: DURATION.fast });
        
        // Still do the lift, just faster
        liftProgress.value = withTiming(1, { duration: DURATION.normal });
        
        // Trigger complete callback
        setTimeout(() => runOnJS(handleComplete)(), duration);
      } else {
        // Full animation sequence
        // 1. Pop in container
        containerOpacity.value = withTiming(1, { duration: DURATION.fast });
        containerScale.value = withSpring(1, SPRING.bouncy);
        
        // 2. Perform the lift animation
        liftProgress.value = withSequence(
          // Wind up (slight dip)
          withTiming(0.1, { duration: 200, easing: Easing.out(Easing.ease) }),
          // Explosive lift
          withTiming(1, { duration: 400, easing: MOTION_EASING.bounce }),
          // Hold at top
          withDelay(600, withTiming(1, { duration: 0 })),
          // Lower back down
          withTiming(0.3, { duration: 300, easing: Easing.in(Easing.ease) })
        );
        
        // 3. Fade out
        containerOpacity.value = withDelay(
          duration - DURATION.normal,
          withTiming(0, { duration: DURATION.normal })
        );
        containerScale.value = withDelay(
          duration - DURATION.normal,
          withTiming(0.9, { duration: DURATION.normal })
        );
        
        // Trigger complete callback
        setTimeout(() => runOnJS(handleComplete)(), duration);
      }
    } else {
      // Reset
      containerOpacity.value = 0;
      containerScale.value = 0.8;
      liftProgress.value = 0;
    }
  }, [visible, shouldReduceMotion, duration]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ scale: containerScale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable onPress={handleComplete} style={styles.dismissArea}>
        <Animated.View style={[styles.container, containerStyle]}>
          <StickFigure progress={liftProgress} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  dismissArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 100,
    height: 100,
    borderRadius: RADII.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
});

