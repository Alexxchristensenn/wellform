/**
 * HomeHeader - Greeting & Status Bar
 * 
 * Displays time-of-day greeting with appropriate icon,
 * user's name, and optional streak/status indicator.
 * 
 * Features glassmorphism styling with blur effect.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sunrise, Sun, Moon, Flame } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import useTimeOfDay from '../../hooks/useTimeOfDay';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone500: '#78716c',
  stone400: '#a8a29e',
  white: '#FFFFFF',
  whiteTranslucent: 'rgba(255, 255, 255, 0.75)',
  border: 'rgba(255, 255, 255, 0.9)',
  flame: '#f97316',
};

interface HomeHeaderProps {
  userName: string;
  streakDays?: number;
}

const TimeIcon = ({ icon }: { icon: 'sunrise' | 'sun' | 'moon' }) => {
  const iconProps = {
    size: 24,
    color: COLORS.stone500,
    strokeWidth: 1.5,
  };

  switch (icon) {
    case 'sunrise':
      return <Sunrise {...iconProps} />;
    case 'sun':
      return <Sun {...iconProps} />;
    case 'moon':
      return <Moon {...iconProps} />;
  }
};

export default function HomeHeader({ userName, streakDays = 0 }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();
  const { greeting, icon } = useTimeOfDay();

  return (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
    >
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.content}>
          {/* Left: Icon + Greeting */}
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <TimeIcon icon={icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.pulseLabel}>TODAY'S PULSE</Text>
              <Text style={styles.greeting}>
                {greeting}, <Text style={styles.name}>{userName}</Text>
              </Text>
            </View>
          </View>

          {/* Right: Streak indicator */}
          {streakDays > 0 && (
            <View style={styles.streakContainer}>
              <Flame size={16} color={COLORS.flame} strokeWidth={2} />
              <Text style={styles.streakText}>{streakDays}</Text>
            </View>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  blurContainer: {
    marginHorizontal: 16,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.whiteTranslucent,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: 2,
  },
  pulseLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.stone500,
    textTransform: 'uppercase',
  },
  greeting: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 22,
    color: COLORS.stone900,
  },
  name: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 20,
  },
  streakText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: COLORS.flame,
  },
});

