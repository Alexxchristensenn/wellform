/**
 * RitualsCard - Daily Habits Tracking
 * 
 * Displays daily rituals (hydration, movement, etc.) with
 * interactive elements and educational "Why" tooltips.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Droplet, Activity, Info } from 'lucide-react-native';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone800: '#292524',
  stone600: '#57534e',
  stone500: '#78716c',
  stone400: '#a8a29e',
  stone300: '#d6d3d1',
  stone200: '#e7e5e4',
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  purple50: '#faf5ff',
  purple100: '#f3e8ff',
  purple400: '#c084fc',
  purple500: '#a855f7',
  purple600: '#9333ea',
  white: '#FFFFFF',
  glassWhite: 'rgba(255, 255, 255, 0.75)',
  glassWhite60: 'rgba(255, 255, 255, 0.6)',
  border: 'rgba(255, 255, 255, 0.9)',
};

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
      bg: COLORS.blue50,
      icon: COLORS.blue500,
      text: COLORS.blue600,
      border: COLORS.blue400,
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
      bg: COLORS.purple50,
      icon: COLORS.purple500,
      text: COLORS.purple600,
      border: COLORS.purple400,
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
  return (
    <Pressable
      onPress={onPress || onInfoPress}
      style={({ pressed }) => [
        styles.ritualRow,
        pressed && styles.ritualRowPressed,
      ]}
    >
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
          color={COLORS.stone300} 
          style={styles.infoIcon}
        />
      </Pressable>
    </Pressable>
  );
}

export default function RitualsCard({
  rituals = DEFAULT_RITUALS,
  onRitualPress,
  onInfoPress,
}: RitualsCardProps) {
  return (
    <Animated.View entering={FadeInUp.duration(500).delay(300)}>
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
    backgroundColor: COLORS.glassWhite,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 26,
    color: COLORS.stone900,
    marginBottom: 24,
  },
  ritualsList: {
    gap: 16,
  },
  ritualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.glassWhite60,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  ritualRowPressed: {
    backgroundColor: COLORS.white,
  },
  ritualContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ritualIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ritualInfo: {
    gap: 2,
  },
  ritualName: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    color: COLORS.stone800,
  },
  ritualProgress: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    color: COLORS.stone500,
    textTransform: 'uppercase',
  },
  infoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.stone200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    opacity: 0,
  },
});

