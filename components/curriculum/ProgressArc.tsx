/**
 * ProgressArc - Large Progress Indicator for Curriculum
 * 
 * Displays a semicircular progress arc with percentage and count.
 * Uses SVG for crisp rendering and Reanimated for smooth animations.
 * 
 * @see SIM-009 for design specifications
 */

import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone500: '#78716c',
  stone200: '#e7e5e4',
  orange500: '#f97316',
  green500: '#22c55e',
};

interface ProgressArcProps {
  progress: number; // 0-1
  completedCount: number;
  totalCount: number;
}

export default function ProgressArc({ 
  progress, 
  completedCount, 
  totalCount 
}: ProgressArcProps) {
  const animatedProgress = useSharedValue(0);
  
  // Arc geometry - 270 degree arc
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Arc spans from 135° to 405° (270° total)
  const startAngle = 135;
  const endAngle = 405;
  const arcLength = endAngle - startAngle; // 270 degrees
  
  // Convert degrees to radians
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  
  // Calculate arc path
  const describeArc = (start: number, end: number): string => {
    const startRad = degToRad(start);
    const endRad = degToRad(end);
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = end - start > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };
  
  // Background track path (full arc)
  const trackPath = describeArc(startAngle, endAngle);
  
  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 15,
      stiffness: 80,
    });
  }, [progress]);
  
  // Animated progress path
  const animatedProps = useAnimatedProps(() => {
    const currentEnd = startAngle + arcLength * animatedProgress.value;
    const startRad = degToRad(startAngle);
    const endRad = degToRad(currentEnd);
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = currentEnd - startAngle > 180 ? 1 : 0;
    
    return {
      d: animatedProgress.value > 0.01 
        ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
        : '',
    };
  });
  
  const percentageText = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size * 0.7} viewBox={`0 0 ${size} ${size * 0.85}`}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={COLORS.orange500} />
            <Stop offset="100%" stopColor={COLORS.green500} />
          </LinearGradient>
        </Defs>
        
        {/* Background track */}
        <Path
          d={trackPath}
          stroke={COLORS.stone200}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Progress arc with gradient */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      
      {/* Center content */}
      <View style={styles.centerContent}>
        <Text style={styles.percentage}>{percentageText}%</Text>
        <Text style={styles.countText}>
          {completedCount} of {totalCount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    top: 60,
  },
  percentage: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 48,
    color: COLORS.stone900,
    lineHeight: 56,
  },
  countText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: COLORS.stone500,
    marginTop: 4,
  },
});

