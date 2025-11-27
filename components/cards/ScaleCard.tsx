/**
 * ScaleCard - The Truth Layer Weight Tracking
 * 
 * Displays current weight, trend weight (EMA), and provides
 * a tactile slider for weight entry.
 * 
 * Design Philosophy:
 * - Calm visual tone when weight fluctuates up
 * - Emphasizes the TREND, not daily readings
 * - "Grandma Test" compliant: Large fonts, tactile inputs
 * 
 * @see SIM-005 for implementation details
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { Scale, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react-native';
import HolographicCard from '../ui/HolographicCard';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone700: '#44403c',
  stone600: '#57534e',
  stone500: '#78716c',
  stone400: '#a8a29e',
  stone300: '#d6d3d1',
  stone200: '#e7e5e4',
  stone100: '#f5f5f4',
  stone50: '#fafaf9',
  // Calm colors - no alarming reds
  sky100: '#e0f2fe',
  sky200: '#bae6fd',
  sky500: '#0ea5e9',
  sky600: '#0284c7',
  sky700: '#0369a1',
  emerald100: '#d1fae5',
  emerald500: '#10b981',
  emerald600: '#059669',
  amber100: '#fef3c7',
  amber500: '#f59e0b',
  amber600: '#d97706',
  white: '#FFFFFF',
  glassWhite: 'rgba(255, 255, 255, 0.75)',
};

// Conversion constants
const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 0.453592;

interface ScaleCardProps {
  currentWeight: number | null; // Today's weight in kg
  trendWeight: number | null; // EMA trend in kg
  previousTrend: number | null; // Yesterday's trend for comparison
  hasLoggedToday: boolean;
  units: 'metric' | 'imperial';
  startWeight: number; // Starting weight from profile (kg)
  goalWeight: number; // Goal weight from profile (kg)
  onLogWeight: (weightKg: number) => Promise<boolean>;
}

/**
 * Convert kg to display units
 */
function toDisplayWeight(kg: number, units: 'metric' | 'imperial'): number {
  return units === 'imperial' ? kg * KG_TO_LBS : kg;
}

/**
 * Convert display units to kg for storage
 */
function toKg(value: number, units: 'metric' | 'imperial'): number {
  return units === 'imperial' ? value * LBS_TO_KG : value;
}

/**
 * Get trend direction and message
 */
function getTrendInsight(
  currentWeight: number | null,
  trendWeight: number | null,
  previousTrend: number | null,
  goalWeight: number
): { icon: 'up' | 'down' | 'stable'; message: string; isPositive: boolean } {
  // No data yet
  if (trendWeight === null) {
    return { icon: 'stable', message: 'Log your first weight to start tracking', isPositive: true };
  }
  
  // Compare trend to previous trend
  if (previousTrend !== null) {
    const trendDelta = trendWeight - previousTrend;
    const isLosingWeight = goalWeight < (currentWeight ?? trendWeight);
    
    if (Math.abs(trendDelta) < 0.1) {
      return { icon: 'stable', message: 'Your trend is holding steady', isPositive: true };
    }
    
    if (trendDelta < 0) {
      // Trend is going down
      return { 
        icon: 'down', 
        message: isLosingWeight ? 'Your trend is moving toward your goal' : 'Your trend is decreasing',
        isPositive: isLosingWeight,
      };
    } else {
      // Trend is going up - use calm messaging
      return { 
        icon: 'up', 
        message: 'Daily fluctuations are normal — trust the trend',
        isPositive: false,
      };
    }
  }
  
  return { icon: 'stable', message: 'Keep logging to see your trend develop', isPositive: true };
}

export default function ScaleCard({
  currentWeight,
  trendWeight,
  previousTrend,
  hasLoggedToday,
  units = 'metric',
  startWeight,
  goalWeight,
  onLogWeight,
}: ScaleCardProps) {
  // Slider state
  const [isEditing, setIsEditing] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(() => {
    // Initialize with current weight or a reasonable default based on start weight
    const defaultKg = currentWeight ?? startWeight ?? 70;
    return toDisplayWeight(defaultKg, units);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Weight display values
  const displayUnit = units === 'imperial' ? 'lbs' : 'kg';
  const displayCurrent = currentWeight !== null ? toDisplayWeight(currentWeight, units).toFixed(1) : '--';
  const displayTrend = trendWeight !== null ? toDisplayWeight(trendWeight, units).toFixed(1) : '--';
  
  // Get trend insight
  const insight = getTrendInsight(currentWeight, trendWeight, previousTrend, goalWeight);
  
  // Slider range (±20 from current/start weight)
  const centerWeight = toDisplayWeight(currentWeight ?? startWeight ?? 70, units);
  const minWeight = Math.max(centerWeight - 20, units === 'imperial' ? 66 : 30); // Min 30kg/66lbs
  const maxWeight = centerWeight + 20;
  
  // Update slider value when current weight changes
  useEffect(() => {
    if (currentWeight !== null) {
      setSliderValue(toDisplayWeight(currentWeight, units));
    }
  }, [currentWeight, units]);

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  const handleCancelEditing = useCallback(() => {
    setIsEditing(false);
    // Reset to current value
    if (currentWeight !== null) {
      setSliderValue(toDisplayWeight(currentWeight, units));
    }
  }, [currentWeight, units]);
  
  const handleSubmitWeight = useCallback(async () => {
    setIsSubmitting(true);
    const weightKg = toKg(sliderValue, units);
    const success = await onLogWeight(weightKg);
    setIsSubmitting(false);
    if (success) {
      setIsEditing(false);
    }
  }, [sliderValue, units, onLogWeight]);

  // Handle slider value change
  const handleSliderChange = useCallback((value: number) => {
    setSliderValue(Math.round(value * 10) / 10);
  }, []);

  // Trend icon component
  const TrendIcon = insight.icon === 'down' 
    ? TrendingDown 
    : insight.icon === 'up' 
      ? TrendingUp 
      : Minus;

  const cardContent = (
    <View style={styles.innerContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Scale size={20} color={COLORS.sky600} />
          </View>
          <Text style={styles.title}>The Scale</Text>
        </View>
        <Pressable style={styles.infoButton}>
          <Info size={14} color={COLORS.stone400} />
        </Pressable>
      </View>

      {/* Weight Display */}
      {!isEditing ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.weightDisplay}>
          {/* Today's Weight */}
          <Pressable onPress={handleStartEditing} style={styles.weightSection}>
            <Text style={styles.weightLabel}>TODAY</Text>
            <View style={styles.weightValueRow}>
              <Text style={styles.weightValue}>{displayCurrent}</Text>
              <Text style={styles.weightUnit}>{displayUnit}</Text>
            </View>
            {!hasLoggedToday && (
              <Text style={styles.tapToLogHint}>Tap to log</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Trend Weight */}
          <View style={styles.weightSection}>
            <Text style={styles.weightLabel}>TREND</Text>
            <View style={styles.weightValueRow}>
              <Text style={[styles.weightValue, styles.trendValue]}>{displayTrend}</Text>
              <Text style={[styles.weightUnit, styles.trendUnit]}>{displayUnit}</Text>
            </View>
            <View style={styles.trendIndicator}>
              <TrendIcon 
                size={14} 
                color={insight.isPositive ? COLORS.emerald600 : COLORS.amber600} 
              />
            </View>
          </View>
        </Animated.View>
      ) : (
        // Editing Mode - Slider Input
        <Animated.View entering={FadeIn.duration(200)} style={styles.editingContainer}>
          {/* Large weight display */}
          <View style={styles.editingValueContainer}>
            <TextInput
              style={styles.editingValue}
              value={sliderValue.toFixed(1)}
              keyboardType="decimal-pad"
              onChangeText={(text) => {
                const num = parseFloat(text);
                if (!isNaN(num) && num >= minWeight && num <= maxWeight) {
                  setSliderValue(num);
                }
              }}
              selectTextOnFocus
            />
            <Text style={styles.editingUnit}>{displayUnit}</Text>
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={minWeight}
              maximumValue={maxWeight}
              value={sliderValue}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={COLORS.sky500}
              maximumTrackTintColor={COLORS.stone200}
              thumbTintColor={COLORS.sky500}
              step={0.1}
            />
            
            {/* Range labels */}
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>{minWeight.toFixed(0)}</Text>
              <Text style={styles.sliderLabel}>{maxWeight.toFixed(0)}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.editingActions}>
            <Pressable 
              onPress={handleCancelEditing}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              onPress={handleSubmitWeight}
              disabled={isSubmitting}
              style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
            >
              <Text style={styles.saveButtonText}>
                {isSubmitting ? 'Saving...' : 'Save Weight'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* Insight Message */}
      {!isEditing && (
        <View style={[
          styles.insightContainer,
          insight.isPositive ? styles.insightPositive : styles.insightNeutral,
        ]}>
          <TrendIcon 
            size={16} 
            color={insight.isPositive ? COLORS.emerald600 : COLORS.amber600} 
          />
          <Text style={[
            styles.insightText,
            insight.isPositive ? styles.insightTextPositive : styles.insightTextNeutral,
          ]}>
            {insight.message}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(100)}>
      <HolographicCard active={hasLoggedToday} borderRadius={28}>
        {cardContent}
      </HolographicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  innerContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.sky100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: COLORS.stone900,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.stone100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Weight display
  weightDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  weightSection: {
    alignItems: 'center',
    flex: 1,
  },
  weightLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.stone500,
    marginBottom: 8,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weightValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 42,
    color: COLORS.stone900,
  },
  weightUnit: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: COLORS.stone500,
  },
  trendValue: {
    color: COLORS.sky700,
  },
  trendUnit: {
    color: COLORS.sky600,
  },
  trendIndicator: {
    marginTop: 4,
  },
  tapToLogHint: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: COLORS.sky600,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.stone200,
    marginHorizontal: 16,
  },
  // Insight message
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  insightPositive: {
    backgroundColor: COLORS.emerald100,
  },
  insightNeutral: {
    backgroundColor: COLORS.amber100,
  },
  insightText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    flex: 1,
  },
  insightTextPositive: {
    color: COLORS.emerald600,
  },
  insightTextNeutral: {
    color: COLORS.amber600,
  },
  // Editing mode
  editingContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  editingValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 24,
  },
  editingValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 56,
    color: COLORS.stone900,
    textAlign: 'center',
    minWidth: 140,
    padding: 0,
  },
  editingUnit: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 20,
    color: COLORS.stone500,
  },
  // Slider
  sliderContainer: {
    width: '100%',
    marginBottom: 24,
  },
  slider: {
    width: '100%',
    height: 50,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: COLORS.stone400,
  },
  // Action buttons
  editingActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.stone100,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: COLORS.stone600,
  },
  saveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.stone900,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: COLORS.white,
  },
});

