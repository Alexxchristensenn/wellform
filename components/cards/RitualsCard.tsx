/**
 * RitualsCard - Daily Habits Tracking
 * 
 * Displays daily rituals (hydration, movement, etc.) with
 * interactive elements and educational "Why" tooltips.
 * 
 * @updated SIM-014: Uses theme tokens, improved press animations
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Droplet, Activity, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { STONE, ACCENT, COLORS, FONTS, TYPE, SPACING, RADII, SHADOWS } from '../../constants/theme';
import { DURATION, SPRING, ANIMATION } from '../../constants/motion';

interface RitualItem {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  icon: 'hydration' | 'movement';
  color: {
    bg: string;
    icon: string;
    text: string;
    border: string;
  };
}

interface RitualsCardProps {
  rituals?: RitualItem[];
  onRitualPress?: (ritualId: string) => void;
  onInfoPress?: (ritualId: string) => void;
}

const DEFAULT_RITUALS: RitualItem[] = [
  {
    id: 'hydration',
    name: 'Hydration',
    current: 0,
    target: 3,
    unit: 'Liters',
    icon: 'hydration',
    color: {
      bg: ACCENT.sky[50],
      icon: ACCENT.sky[500],
      text: ACCENT.sky[600],
      border: ACCENT.sky[200],
    },
  },
  {
    id: 'movement',
    name: 'Movement',
    current: 0,
    target: 30,
    unit: 'mins goal',
    icon: 'movement',
    color: {
      bg: ACCENT.purple[50],
      icon: ACCENT.purple[500],
      text: ACCENT.purple[600],
      border: ACCENT.purple[100],
    },
  },
];

function RitualIcon({ type, color }: { type: 'hydration' | 'movement'; color: string }) {
  const iconProps = { size: 22, color, strokeWidth: 2 };
  
  switch (type) {
    case 'hydration':
      return <Droplet {...iconProps} />;
    case 'movement':
      return <Activity {...iconProps} />;
    default:
      return <Droplet {...iconProps} />;
  }
}

function RitualRow({
  ritual,
  onPress,
  onInfoPress,
}: {
  ritual: RitualItem;
  onPress?: () => void;
  onInfoPress?: () => void;
}) {
  // SIM-014: Press scale animation
  const pressScale = useSharedValue(1);
  
  const handlePressIn = () => {
    pressScale.value = withSpring(ANIMATION.pressScale, SPRING.snappy);
  };
  
  const handlePressOut = () => {
    pressScale.value = withSpring(1, SPRING.snappy);
  };
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    (onPress || onInfoPress)?.();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));
  
  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.ritualRow, animatedStyle]}>
        <View style={styles.ritualContent}>
          <View style={[styles.ritualIcon, { backgroundColor: ritual.color.bg }]}>
            <RitualIcon type={ritual.icon} color={ritual.color.icon} />
          </View>
          <View style={styles.ritualInfo}>
            <Text style={styles.ritualName}>{ritual.name}</Text>
            <Text style={styles.ritualProgress}>
              {ritual.current} / {ritual.target} {ritual.unit}
            </Text>
          </View>
        </View>
        
        <Pressable
          onPress={onInfoPress}
          style={({ pressed }) => [
            styles.infoCircle,
            pressed && { borderColor: ritual.color.border },
          ]}
        >
          <Info 
            size={12} 
            color={STONE[300]} 
            style={styles.infoIcon}
          />
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

export default function RitualsCard({
  rituals = DEFAULT_RITUALS,
  onRitualPress,
  onInfoPress,
}: RitualsCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(DURATION.slow + 50).delay(DURATION.normal)}>
      <View style={styles.container}>
        <Text style={styles.title}>Daily Rituals</Text>
        
        <View style={styles.ritualsList}>
          {rituals.map((ritual) => (
            <RitualRow
              key={ritual.id}
              ritual={ritual}
              onPress={() => onRitualPress?.(ritual.id)}
              onInfoPress={() => onInfoPress?.(ritual.id)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glass,
    borderRadius: RADII['3xl'],
    padding: SPACING['2xl'],
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
  },
  title: {
    fontFamily: FONTS.displayRegular,
    fontSize: TYPE.headlineLarge.fontSize,
    color: STONE[900],
    marginBottom: SPACING['2xl'],
  },
  ritualsList: {
    gap: SPACING.lg,
  },
  ritualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.glassSubtle,
    borderRadius: RADII.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  ritualContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  ritualIcon: {
    width: 48,
    height: 48,
    borderRadius: RADII.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ritualInfo: {
    gap: 2,
  },
  ritualName: {
    fontFamily: FONTS.displayRegular,
    fontSize: TYPE.titleLarge.fontSize,
    color: STONE[800],
  },
  ritualProgress: {
    fontFamily: FONTS.sansBold,
    fontSize: TYPE.labelSmall.fontSize,
    letterSpacing: 1.2,
    color: STONE[500],
    textTransform: 'uppercase',
  },
  infoCircle: {
    width: 32,
    height: 32,
    borderRadius: RADII.full,
    borderWidth: 2,
    borderColor: STONE[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    opacity: 0,
  },
});

