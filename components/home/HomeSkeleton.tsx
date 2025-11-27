/**
 * HomeSkeleton - Loading State for Home Screen
 * 
 * Displays a pulsing skeleton version of the dashboard
 * while user data is being fetched from Firestore.
 * 
 * SIM-007: Now displays witty loading lines from contentBank.
 * 
 * Uses Reanimated for smooth pulse animation.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { Loader2 } from 'lucide-react-native';
import { getLoadingLine } from '../../services/contentBank';

// Design system colors
const COLORS = {
  skeleton: 'rgba(255, 255, 255, 0.6)',
  skeletonHighlight: 'rgba(255, 255, 255, 0.9)',
  border: 'rgba(255, 255, 255, 0.8)',
};

// Skeleton pulse hook
function useSkeletonPulse() {
  const opacity = useSharedValue(0.4);
  
  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { 
        duration: 1000, 
        easing: Easing.inOut(Easing.ease) 
      }),
      -1,
      true
    );
  }, []);
  
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
}

// Spinning loading icon hook
function useSpinAnimation() {
  const rotation = useSharedValue(0);
  
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: 1500, 
        easing: Easing.linear 
      }),
      -1,
      false
    );
  }, []);
  
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
        <Loader2 size={18} color="#78716c" />
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
        entering={FadeIn.delay(400).duration(600)} 
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
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: COLORS.skeleton,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    gap: 2,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 24,
  },
  cardContainer: {
    backgroundColor: COLORS.skeleton,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardBody: {
    gap: 4,
  },
  skeletonBox: {
    backgroundColor: COLORS.skeletonHighlight,
  },
  // SIM-007: Loading toast styles
  loadingToast: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  loadingLine: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#57534e',
    lineHeight: 22,
  },
});

