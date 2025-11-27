/**
 * CurriculumLessonCard - Lesson Card for Curriculum
 * 
 * Displays a lesson with status indicators (completed, current, available, locked).
 * Supports tap interaction for opening the TapthroughModal.
 * Includes smooth "check off" animation when a lesson is just completed.
 * 
 * @see SIM-009 for design specifications
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolateColor,
  FadeInUp,
  Easing,
} from 'react-native-reanimated';
import { Check, Lock, ChevronRight } from 'lucide-react-native';
import { LessonStatus, MasteryLevel } from '../../types/schema';
import { GoldenRule } from '../../services/contentBank';
import { hapticLight } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone700: '#44403c',
  stone500: '#78716c',
  stone400: '#a8a29e',
  stone200: '#e7e5e4',
  stone100: '#f5f5f4',
  white: '#ffffff',
  green500: '#22c55e',
  green400: '#4ade80',
  green100: '#dcfce7',
  orange500: '#f97316',
  orange100: '#ffedd5',
  purple500: '#8b5cf6',
};

// Level colors
const LEVEL_COLORS: Record<MasteryLevel, string> = {
  foundation: COLORS.green500,
  intermediate: COLORS.orange500,
  advanced: COLORS.purple500,
};

interface CurriculumLessonCardProps {
  rule: GoldenRule;
  status: LessonStatus;
  index: number;
  justCompleted?: boolean; // True when this lesson was just marked complete
  onPress: () => void;
}

export default function CurriculumLessonCard({ 
  rule, 
  status, 
  index,
  justCompleted = false,
  onPress 
}: CurriculumLessonCardProps) {
  const scale = useSharedValue(1);
  
  // Animation values for completion transition
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const iconBgProgress = useSharedValue(0);
  const cardGlow = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  
  // Trigger completion animation when justCompleted becomes true
  useEffect(() => {
    if (justCompleted) {
      // Reset values
      checkScale.value = 0;
      checkOpacity.value = 0;
      iconBgProgress.value = 0;
      cardGlow.value = 0;
      badgeScale.value = 0;
      
      // Orchestrated animation sequence
      // 1. Card glow pulse
      cardGlow.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 400 })
      );
      
      // 2. Icon background color transition (orange -> green)
      iconBgProgress.value = withTiming(1, { 
        duration: 400, 
        easing: Easing.out(Easing.ease) 
      });
      
      // 3. Checkmark scales in with bounce
      checkScale.value = withDelay(150, 
        withSpring(1, { damping: 12, stiffness: 200 })
      );
      checkOpacity.value = withDelay(150, 
        withTiming(1, { duration: 200 })
      );
      
      // 4. Badge scales in
      badgeScale.value = withDelay(300, 
        withSpring(1, { damping: 14, stiffness: 180 })
      );
    } else if (status === 'completed') {
      // Already completed, show final state immediately
      checkScale.value = 1;
      checkOpacity.value = 1;
      iconBgProgress.value = 1;
      badgeScale.value = 1;
    }
  }, [justCompleted, status]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  // Animated glow overlay
  const glowStyle = useAnimatedStyle(() => ({
    opacity: cardGlow.value * 0.15,
  }));
  
  // Animated icon background (orange -> green transition)
  const iconBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      iconBgProgress.value,
      [0, 1],
      [COLORS.orange100, COLORS.green500]
    ),
  }));
  
  // Animated checkmark
  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));
  
  // Animated badge
  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeScale.value,
  }));
  
  const handlePressIn = () => {
    if (status !== 'locked') {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  const handlePress = () => {
    if (status === 'locked') {
      hapticLight();
      return;
    }
    hapticLight();
    onPress();
  };
  
  const levelColor = LEVEL_COLORS[rule.level];
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const showCompletionAnimation = justCompleted || isCompleted;

  return (
    <Animated.View entering={FadeInUp.duration(400).delay(index * 50)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          isLocked && styles.containerLocked,
          isCurrent && !justCompleted && styles.containerCurrent,
          isCompleted && styles.containerCompleted,
          animatedStyle,
        ]}
      >
        {/* Completion glow overlay */}
        {justCompleted && (
          <Animated.View style={[styles.completionGlow, glowStyle]} />
        )}
        
        {/* Left border accent */}
        <View style={[
          styles.leftBorder,
          { backgroundColor: isLocked ? COLORS.stone300 : levelColor },
          showCompletionAnimation && { backgroundColor: COLORS.green500 },
        ]} />
        
        {/* Status indicator */}
        {showCompletionAnimation ? (
          // Animated completion icon
          <Animated.View style={[styles.statusIcon, iconBgStyle]}>
            <Animated.View style={checkmarkStyle}>
              <Check size={14} color={COLORS.white} strokeWidth={3} />
            </Animated.View>
          </Animated.View>
        ) : (
          // Static status icons
          <View style={[
            styles.statusIcon,
            isCurrent && styles.statusIconCurrent,
            isLocked && styles.statusIconLocked,
          ]}>
            {isLocked && <Lock size={12} color={COLORS.stone400} />}
            {isCurrent && <ChevronRight size={14} color={COLORS.orange500} strokeWidth={3} />}
            {status === 'available' && (
              <View style={styles.availableDot} />
            )}
          </View>
        )}
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={[
            styles.title,
            isLocked && styles.titleLocked,
          ]}>
            {rule.title}
          </Text>
          <Text style={[
            styles.subtitle,
            isLocked && styles.subtitleLocked,
          ]} numberOfLines={1}>
            {rule.subtitle}
          </Text>
        </View>
        
        {/* Current badge */}
        {isCurrent && !justCompleted && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CONTINUE →</Text>
          </View>
        )}
        
        {/* Completed badge - animated on justCompleted */}
        {showCompletionAnimation && (
          <Animated.View style={[styles.completedBadge, justCompleted && badgeStyle]}>
            <Text style={styles.completedBadgeText}>REVIEW</Text>
          </Animated.View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.stone200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  containerLocked: {
    opacity: 0.5,
    backgroundColor: COLORS.stone100,
  },
  containerCurrent: {
    borderColor: COLORS.orange500,
    borderWidth: 2,
    shadowColor: COLORS.orange500,
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  containerCompleted: {
    backgroundColor: COLORS.white,
  },
  completionGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.green400,
    borderRadius: 16,
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.stone100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusIconCurrent: {
    backgroundColor: COLORS.orange100,
  },
  statusIconLocked: {
    backgroundColor: COLORS.stone200,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.stone400,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.stone900,
    marginBottom: 2,
  },
  titleLocked: {
    color: COLORS.stone500,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.stone500,
  },
  subtitleLocked: {
    color: COLORS.stone400,
  },
  currentBadge: {
    backgroundColor: COLORS.orange500,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 9,
    color: COLORS.white,
    letterSpacing: 1,
  },
  completedBadge: {
    backgroundColor: COLORS.green100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 9,
    color: COLORS.green500,
    letterSpacing: 1,
  },
});
