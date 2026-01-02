/**
 * WeeklyInsightCard - The Insight Engine UI (Refined)
 * 
 * A premium "Accessible Ethereal" card featuring:
 * - Animated streak counter with fire emoji celebration
 * - 7-day weight trend sparkline (SVG)
 * - Integrated trend delta display
 * - Context-aware insight text
 * 
 * @see SIM-017 The Insight Engine
 * @updated Visual refinement pass - streak animations + better hierarchy
 */

import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, G } from 'react-native-svg';
import { TrendingUp, TrendingDown, Minus, Zap, Leaf, Target } from 'lucide-react-native';
import { STONE, ACCENT, COLORS, SPACING, RADII, TYPE, FONTS } from '../../constants/theme';
import { SPRING } from '../../constants/motion';
import { SHADOW } from '../../utils/shadows';
import { TrendPoint, WeeklyStats, TrendData } from '../../hooks/useWeeklyReview';

// =============================================================================
// TYPES
// =============================================================================

interface WeeklyInsightCardProps {
  stats: WeeklyStats;
  trend: TrendData;
  history: TrendPoint[];
  insight: string;
  hasEnoughData: boolean;
  units?: 'metric' | 'imperial';
}

// =============================================================================
// STREAK BADGE COMPONENT
// =============================================================================

interface StreakBadgeProps {
  count: number;
  type: 'protein' | 'plants';
  total: number;
}

/**
 * StreakBadge - Animated streak counter with fire effect
 * 
 * When count >= 3, shows a celebration animation
 */
function StreakBadge({ count, type, total }: StreakBadgeProps) {
  const isStreak = count >= 3;
  
  // Animation values
  const firePulse = useSharedValue(0);
  const badgeScale = useSharedValue(0.8);
  
  // Trigger celebration animation on streak
  useEffect(() => {
    if (isStreak) {
      // Initial pop-in
      badgeScale.value = withSpring(1, SPRING.bouncy);
      
      // Continuous subtle pulse for active streaks
      firePulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1, // Infinite
        false
      );
    } else {
      badgeScale.value = withSpring(1, SPRING.gentle);
      firePulse.value = withTiming(0, { duration: 300 });
    }
  }, [isStreak, count]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const fireStyle = useAnimatedStyle(() => ({
    opacity: interpolate(firePulse.value, [0, 1], [0.7, 1]),
    transform: [
      { scale: interpolate(firePulse.value, [0, 1], [1, 1.15]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(firePulse.value, [0, 1], [0.2, 0.5]),
  }));

  // Colors based on type
  const colors = type === 'protein' 
    ? { bg: ACCENT.rose[500], light: ACCENT.rose[100], text: ACCENT.rose[600] }
    : { bg: ACCENT.emerald[500], light: ACCENT.emerald[100], text: ACCENT.emerald[600] };

  const Icon = type === 'protein' ? Zap : Leaf;

  return (
    <Animated.View style={[styles.streakBadge, containerStyle]}>
      {/* Glow effect for streaks */}
      {isStreak && (
        <Animated.View style={[styles.streakGlow, { backgroundColor: colors.bg }, glowStyle]} />
      )}
      
      <View style={[styles.streakContent, { backgroundColor: colors.light }]}>
        {/* Fire emoji for streaks */}
        {isStreak && (
          <Animated.Text style={[styles.fireEmoji, fireStyle]}>
            🔥
          </Animated.Text>
        )}
        
        {/* Icon for non-streak */}
        {!isStreak && (
          <Icon size={14} color={colors.text} strokeWidth={2.5} />
        )}
        
        {/* Count */}
        <Text style={[styles.streakCount, { color: colors.text }]}>
          {count}
        </Text>
        
        {/* Divider */}
        <View style={[styles.streakDivider, { backgroundColor: colors.text + '30' }]} />
        
        {/* Total */}
        <Text style={[styles.streakTotal, { color: colors.text + '80' }]}>
          {total}
        </Text>
      </View>
      
      {/* Label */}
      <Text style={[styles.streakLabel, { color: STONE[500] }]}>
        {type === 'protein' ? 'Protein' : 'Plants'}
      </Text>
    </Animated.View>
  );
}

// =============================================================================
// SPARKLINE COMPONENT
// =============================================================================

interface SparklineProps {
  data: TrendPoint[];
  width: number;
  height: number;
  direction: 'up' | 'down' | 'flat';
}

/**
 * Sparkline - Enhanced SVG trend visualization
 */
function Sparkline({ data, width, height, direction }: SparklineProps) {
  const pathData = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '', lastPoint: null };

    const trends = data.map(d => d.trend);
    const minTrend = Math.min(...trends);
    const maxTrend = Math.max(...trends);
    const range = maxTrend - minTrend || 1;
    
    const paddingX = 12;
    const paddingY = 16;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const points = data.map((point, index) => {
      const x = paddingX + (index / (data.length - 1)) * chartWidth;
      const y = paddingY + chartHeight - ((point.trend - minTrend) / range) * chartHeight;
      return { x, y };
    });

    let linePath = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpy1 = prev.y;
      const cpx2 = curr.x - (curr.x - prev.x) / 3;
      const cpy2 = curr.y;
      linePath += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }

    const areaPath = linePath + 
      ` L ${points[points.length - 1].x} ${height}` +
      ` L ${points[0].x} ${height} Z`;

    return { linePath, areaPath, lastPoint: points[points.length - 1] };
  }, [data, width, height]);

  // Color based on trend direction
  const lineColor = direction === 'down' 
    ? ACCENT.emerald[500] 
    : direction === 'up' 
      ? ACCENT.rose[500] 
      : ACCENT.sky[500];

  if (data.length < 2) {
    return (
      <View style={[sparklineStyles.emptyContainer, { width, height }]}>
        <View style={sparklineStyles.emptyLine} />
        <Text style={sparklineStyles.emptyText}>Awaiting weight data...</Text>
      </View>
    );
  }

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        
        {/* Grid lines (subtle) */}
        {[0.25, 0.5, 0.75].map((pct, i) => (
          <Path
            key={i}
            d={`M 12 ${16 + (height - 32) * pct} L ${width - 12} ${16 + (height - 32) * pct}`}
            stroke={STONE[200]}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}
        
        {/* Gradient area */}
        <Path d={pathData.areaPath} fill="url(#sparklineGradient)" />
        
        {/* Trend line */}
        <Path
          d={pathData.linePath}
          stroke={lineColor}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.length <= 7 && data.map((point, i) => {
          const x = 12 + (i / (data.length - 1)) * (width - 24);
          const trends = data.map(d => d.trend);
          const minTrend = Math.min(...trends);
          const maxTrend = Math.max(...trends);
          const range = maxTrend - minTrend || 1;
          const y = 16 + (height - 32) - ((point.trend - minTrend) / range) * (height - 32);
          
          return (
            <G key={i}>
              {/* Outer ring for last point */}
              {i === data.length - 1 && (
                <Circle cx={x} cy={y} r={8} fill={lineColor + '20'} />
              )}
              <Circle cx={x} cy={y} r={4} fill={lineColor} />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const sparklineStyles = StyleSheet.create({
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  emptyLine: {
    width: '60%',
    height: 2,
    backgroundColor: STONE[200],
    borderRadius: 1,
  },
  emptyText: {
    fontSize: TYPE.caption.fontSize,
    fontFamily: FONTS.sansRegular,
    color: STONE[400],
  },
});

// =============================================================================
// TREND HERO COMPONENT
// =============================================================================

interface TrendHeroProps {
  current: number | null;
  delta: number;
  direction: 'up' | 'down' | 'flat';
  units: 'metric' | 'imperial';
}

function TrendHero({ current, delta, direction, units }: TrendHeroProps) {
  const TrendIcon = direction === 'down' 
    ? TrendingDown 
    : direction === 'up' 
      ? TrendingUp 
      : Minus;

  const trendColor = direction === 'down'
    ? ACCENT.emerald[500]
    : direction === 'up'
      ? ACCENT.rose[500]
      : STONE[400];

  // Format values
  const unit = units === 'metric' ? 'kg' : 'lbs';
  const displayCurrent = current 
    ? (units === 'imperial' ? current * 2.205 : current).toFixed(1)
    : '--';
  const displayDelta = delta !== 0 
    ? (units === 'imperial' ? Math.abs(delta) * 2.205 : Math.abs(delta)).toFixed(1)
    : null;

  return (
    <View style={styles.trendHero}>
      {/* Current trend weight */}
      <View style={styles.trendCurrent}>
        <Text style={styles.trendLabel}>TREND</Text>
        <View style={styles.trendValueRow}>
          <Text style={styles.trendValue}>{displayCurrent}</Text>
          <Text style={styles.trendUnit}>{unit}</Text>
        </View>
      </View>
      
      {/* Delta badge */}
      {displayDelta && (
        <Animated.View 
          entering={FadeIn.delay(200).duration(300)}
          style={[styles.trendDelta, { backgroundColor: trendColor + '15' }]}
        >
          <TrendIcon size={18} color={trendColor} strokeWidth={2.5} />
          <Text style={[styles.trendDeltaText, { color: trendColor }]}>
            {direction === 'down' ? '−' : '+'}{displayDelta} {unit}
          </Text>
          <Text style={styles.trendDeltaPeriod}>this week</Text>
        </Animated.View>
      )}
    </View>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function WeeklyInsightCard({
  stats,
  trend,
  history,
  insight,
  hasEnoughData,
  units = 'metric',
}: WeeklyInsightCardProps) {
  // Track container width for responsive sparkline
  const [containerWidth, setContainerWidth] = useState(300);
  
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width - SPACING.xl * 2); // Account for padding
  };

  return (
    <View 
      style={styles.container}
      onLayout={handleLayout}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Weekly Insight</Text>
          <View style={styles.targetIcon}>
            <Target size={18} color={STONE[400]} strokeWidth={2} />
          </View>
        </View>
        <Text style={styles.subtitle}>7-day behavior + biology</Text>
      </View>

      {/* Divider */}
      <View style={styles.sectionDivider} />

      {/* Streak Badges Section */}
      <View style={styles.streakSection}>
        <View style={styles.streakRow}>
          <StreakBadge 
            count={stats.proteinDays} 
            type="protein" 
            total={Math.max(stats.totalDays, 7)}
          />
          <StreakBadge 
            count={stats.plantsDays} 
            type="plants" 
            total={Math.max(stats.totalDays, 7)}
          />
        </View>
      </View>

      {/* Divider */}
      <View style={styles.sectionDivider} />

      {/* Trend Hero */}
      <TrendHero 
        current={trend.current}
        delta={trend.delta}
        direction={trend.direction}
        units={units}
      />

      {/* Sparkline */}
      <View style={styles.sparklineContainer}>
        <Sparkline 
          data={history} 
          width={containerWidth} 
          height={80}
          direction={trend.direction}
        />
      </View>

      {/* Insight Text */}
      <View style={styles.insightContainer}>
        <Text style={styles.insightText}>{insight}</Text>
      </View>

      {/* Progress Indicator (when not enough data) */}
      {!hasEnoughData && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(stats.totalDays / 3) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {stats.totalDays} of 3 days to unlock full insights
          </Text>
        </View>
      )}
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADII['2xl'],
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    ...SHADOW.md,
  },
  
  // Header
  header: {
    paddingVertical: SPACING.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: TYPE.titleMedium.fontSize,
    fontFamily: FONTS.sansBold,
    color: STONE[900],
  },
  subtitle: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: STONE[400],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  targetIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: STONE[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Section Divider
  sectionDivider: {
    height: 1,
    backgroundColor: STONE[100],
    marginVertical: SPACING.md,
  },
  
  // Streak Section
  streakSection: {
    paddingVertical: SPACING.xs,
  },
  streakRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  streakBadge: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  streakGlow: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 36,
    borderRadius: RADII.lg,
    opacity: 0.2,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.lg,
    marginBottom: SPACING.xs,
  },
  fireEmoji: {
    fontSize: 14,
  },
  streakCount: {
    fontSize: TYPE.titleMedium.fontSize,
    fontFamily: FONTS.sansBold,
  },
  streakDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 2,
  },
  streakTotal: {
    fontSize: TYPE.bodySmall.fontSize,
    fontFamily: FONTS.sansRegular,
  },
  streakLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  
  // Trend Hero
  trendHero: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  trendCurrent: {},
  trendLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansSemiBold,
    color: STONE[400],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  trendValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.xs,
  },
  trendValue: {
    fontSize: 36,
    fontFamily: FONTS.displaySemiBold,
    color: STONE[900],
    letterSpacing: -1,
  },
  trendUnit: {
    fontSize: TYPE.bodyMedium.fontSize,
    fontFamily: FONTS.sansMedium,
    color: STONE[400],
    marginBottom: 4,
  },
  trendDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.lg,
  },
  trendDeltaText: {
    fontSize: TYPE.bodySmall.fontSize,
    fontFamily: FONTS.sansBold,
  },
  trendDeltaPeriod: {
    fontSize: 10,
    fontFamily: FONTS.sansRegular,
    color: STONE[400],
  },
  
  // Sparkline
  sparklineContainer: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
    marginHorizontal: -SPACING.sm,
  },
  
  // Insight
  insightContainer: {
    backgroundColor: STONE[50],
    borderRadius: RADII.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT.sky[500],
    marginTop: SPACING.xs,
  },
  insightText: {
    fontSize: TYPE.bodySmall.fontSize,
    fontFamily: FONTS.sansMedium,
    color: STONE[600],
    lineHeight: TYPE.bodySmall.lineHeight + 4,
  },
  
  // Progress
  progressContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: STONE[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: ACCENT.amber[500],
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontFamily: FONTS.sansRegular,
    color: STONE[400],
  },
});
