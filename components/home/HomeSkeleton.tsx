/**
 * HomeSkeleton - Loading State for Home Screen
 * 
 * Displays a pulsing skeleton version of the dashboard
 * while user data is being fetched from Firestore.
 * 
 * SIM-007: Now displays witty loading lines from contentBank.
 * 
 * Uses Reanimated for smooth pulse animation.
 * 
 * @updated SIM-014: Uses theme tokens and respects Reduce Motion
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { Loader2 } from 'lucide-react-native';
import { getLoadingLine } from '../../services/contentBank';
import { COLORS, STONE, FONTS, TYPE, SPACING, RADII, SHADOWS } from '../../constants/theme';
import { TIMING, EASING, DURATION } from '../../constants/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Skeleton-specific colors extending theme
const SKELETON_COLORS = {
  base: COLORS.glassSubtle,
  highlight: COLORS.glassBorder,
  border: COLORS.glassBorder,
};

// Skeleton pulse hook - respects Reduce Motion
function useSkeletonPulse() {
  const { shouldReduceMotion } = useReducedMotion();
  const opacity = useSharedValue(shouldReduceMotion ? 0.7 : 0.4);
  
  React.useEffect(() => {
    if (shouldReduceMotion) {
      // Static state for reduced motion
      opacity.value = 0.7;
      return;
    }
    
    opacity.value = withRepeat(
      withTiming(1, TIMING.pulse),
      -1,
      true
    );
  }, [shouldReduceMotion]);
  
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
}

// Spinning loading icon hook - respects Reduce Motion
function useSpinAnimation() {
  const { shouldReduceMotion } = useReducedMotion();
  const rotation = useSharedValue(0);
  
  React.useEffect(() => {
    if (shouldReduceMotion) {
      // Static state for reduced motion
      rotation.value = 0;
      return;
    }
    
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: 1500, 
        easing: EASING.linear 
      }),
      -1,
      false
    );
  }, [shouldReduceMotion]);
  
  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
}

function SkeletonBox({ 
  width, 
  height, 
  borderRadius = 12,
  style,
}: { 
  width: number | string; 
  height: number; 
  borderRadius?: number;
  style?: object;
}) {
  const pulseStyle = useSkeletonPulse();
  
  return (
    <Animated.View 
      style={[
        styles.skeletonBox,
        { width, height, borderRadius },
        pulseStyle,
        style,
      ]} 
    />
  );
}

function HeaderSkeleton() {
  const insets = useSafeAreaInsets();
  const pulseStyle = useSkeletonPulse();
  
  return (
    <Animated.View 
      style={[
        styles.headerContainer, 
        { marginTop: insets.top + 12 },
        pulseStyle,
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <SkeletonBox width={48} height={48} borderRadius={24} />
          <View style={styles.headerText}>
            <SkeletonBox width={80} height={10} />
            <SkeletonBox width={140} height={22} style={{ marginTop: 6 }} />
          </View>
        </View>
        <SkeletonBox width={50} height={32} borderRadius={20} />
      </View>
    </Animated.View>
  );
}

function CardSkeleton({ height = 200 }: { height?: number }) {
  const pulseStyle = useSkeletonPulse();
  
  return (
    <Animated.View 
      style={[
        styles.cardContainer,
        { height },
        pulseStyle,
      ]}
    >
      {/* Card header */}
      <View style={styles.cardHeader}>
        <SkeletonBox width={100} height={24} borderRadius={12} />
        <SkeletonBox width={60} height={40} borderRadius={8} />
      </View>
      
      {/* Card content */}
      <View style={styles.cardBody}>
        <SkeletonBox width="80%" height={16} />
        <SkeletonBox width="60%" height={16} style={{ marginTop: 8 }} />
      </View>
      
      {/* Card action */}
      <SkeletonBox 
        width="100%" 
        height={56} 
        borderRadius={20} 
        style={{ marginTop: 16 }}
      />
    </Animated.View>
  );
}

function SpinningLoader() {
  const spinStyle = useSpinAnimation();
  
  return (
    <View style={styles.loadingIconContainer}>
      <Animated.View style={spinStyle}>
        <Loader2 size={18} color={STONE[500]} />
      </Animated.View>
    </View>
  );
}

export default function HomeSkeleton() {
  const insets = useSafeAreaInsets();
  
  // SIM-007: Cache the loading line so it doesn't change during load
  const [loadingLine] = useState(() => getLoadingLine());
  
  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <HeaderSkeleton />
      
      {/* Cards skeleton */}
      <View style={[styles.cardsContainer, { paddingTop: insets.top + 100 }]}>
        <CardSkeleton height={180} />
        <CardSkeleton height={240} />
        <CardSkeleton height={160} />
      </View>
      
      {/* SIM-007: Witty loading toast */}
      <Animated.View 
        entering={FadeIn.delay(DURATION.slow).duration(DURATION.deliberate)} 
        style={[styles.loadingToast, { bottom: insets.bottom + 100 }]}
      >
        <SpinningLoader />
        <Text style={styles.loadingLine}>{loadingLine.content}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 20,
    backgroundColor: SKELETON_COLORS.base,
    borderRadius: RADII['3xl'],
    borderWidth: 1,
    borderColor: SKELETON_COLORS.border,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  headerText: {
    gap: 2,
  },
  cardsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING['2xl'],
  },
  cardContainer: {
    backgroundColor: SKELETON_COLORS.base,
    borderRadius: RADII['3xl'],
    padding: SPACING['2xl'],
    borderWidth: 1,
    borderColor: SKELETON_COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  cardBody: {
    gap: SPACING.xs,
  },
  skeletonBox: {
    backgroundColor: SKELETON_COLORS.highlight,
  },
  // SIM-007: Loading toast styles
  loadingToast: {
    position: 'absolute',
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: RADII.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md + 2,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  loadingIconContainer: {
    width: 28,
    height: 28,
    borderRadius: RADII.full,
    backgroundColor: STONE[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  loadingLine: {
    flex: 1,
    fontFamily: FONTS.sansRegular,
    fontSize: TYPE.bodyMedium.fontSize,
    color: STONE[600],
    lineHeight: TYPE.bodyMedium.lineHeight,
  },
});

