/**
 * Tabs Layout - Main App Navigation
 * 
 * Bottom tab navigation for the main app experience.
 * Users arrive here after completing onboarding.
 * 
 * @updated SIM-009: Removed Log tab, added LearnTabIcon with progress ring
 */

import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import useJourney from '../../hooks/useJourney';

// Create animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone400: '#a8a29e',
  stone200: '#e7e5e4',
  orange500: '#f97316',
  white: '#ffffff',
};

// Simple icon component for Home and Profile
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '🏠',
    profile: '👤',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
}

// Custom Learn tab icon with progress ring
function LearnTabIcon({ focused }: { focused: boolean }) {
  const { progress } = useJourney();
  const animatedProgress = useSharedValue(0);
  
  // Circle geometry
  const size = 36;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    animatedProgress.value = withSpring(progress, {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={styles.learnIconContainer}>
      {/* Progress ring */}
      <Svg width={size} height={size} style={styles.progressRing}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.stone200}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS.orange500}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      
      {/* Brain icon centered */}
      <Text style={[styles.learnIcon, focused && styles.learnIconFocused]}>
        🧠
      </Text>
      
      {/* Glow effect when focused */}
      {focused && <View style={styles.learnGlow} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.stone900,
        tabBarInactiveTintColor: COLORS.stone400,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => <LearnTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.stone200,
    paddingTop: 8,
    height: 84,
  },
  tabLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  // Learn tab icon styles
  learnIconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRing: {
    position: 'absolute',
  },
  learnIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  learnIconFocused: {
    opacity: 1,
  },
  learnGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.orange500,
    opacity: 0.15,
  },
});
