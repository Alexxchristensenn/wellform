/**
 * LessonCard - "The Golden Rules"
 * 
 * Educational content card with accordion expand behavior.
 * Displays bite-sized health education content.
 * 
 * @updated SIM-014: Uses theme tokens, improved press animations
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import { BookOpen, ChevronDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { STONE, COLORS, FONTS, TYPE, SPACING, RADII, SHADOWS } from '../../constants/theme';
import { DURATION, EASING, SPRING, ANIMATION } from '../../constants/motion';

// Orange accent colors for lessons (not in main theme as it's lesson-specific)
const LESSON_ACCENT = {
  bg: 'rgba(255, 237, 213, 0.8)',
  border: '#fed7aa',
  icon: '#f97316',
  text: '#ea580c',
  badge: '#7c2d12',
};

interface LessonCardProps {
  ruleNumber?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  readTime?: string;
}

export default function LessonCard({
  ruleNumber = 4,
  title = 'The Myth of',
  subtitle = '"Starvation Mode"',
  content = 'Your body doesn\'t hold onto fat because you ate too little today. Energy balance is math, but hormones make it feel complex. The truth is: consistent small deficits beat dramatic restrictions every time.',
  readTime = '2 min',
}: LessonCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Animation values
  const expandProgress = useSharedValue(0);
  const iconRotation = useSharedValue(0);
  // SIM-014: Press scale for tactile feedback
  const pressScale = useSharedValue(1);

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    // SIM-014: Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    expandProgress.value = withTiming(newExpanded ? 1 : 0, {
      duration: DURATION.normal,
      easing: EASING.decelerate,
    });
    
    iconRotation.value = withTiming(newExpanded ? 180 : 0, {
      duration: DURATION.normal,
      easing: EASING.decelerate,
    });
  };
  
  // SIM-014: Press animation handlers
  const handlePressIn = () => {
    pressScale.value = withSpring(ANIMATION.pressScale, SPRING.snappy);
  };
  
  const handlePressOut = () => {
    pressScale.value = withSpring(1, SPRING.snappy);
  };

  // Animated styles
  // SIM-007: Increased maxHeight for richer contentBank paragraphs
  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: expandProgress.value * 800,
    opacity: expandProgress.value,
    marginTop: expandProgress.value * 16,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));
  
  // SIM-014: Container press animation
  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(DURATION.slow + 50).delay(DURATION.micro)}>
      <Pressable 
        onPress={toggleExpand}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.container, containerAnimStyle]}>
        {/* Left accent border */}
        <View style={styles.accentBorder} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>GOLDEN RULE #{ruleNumber.toString().padStart(2, '0')}</Text>
          </View>
          <BookOpen size={20} color={expanded ? LESSON_ACCENT.icon : STONE[400]} />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Preview text (visible when collapsed) */}
        {!expanded && (
          <Text style={styles.previewText} numberOfLines={2}>
            {content}
          </Text>
        )}

        {/* Expandable content */}
        <Animated.View style={[styles.expandableContent, contentStyle]}>
          <Text style={styles.fullContent}>{content}</Text>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Animated.View style={iconStyle}>
            <ChevronDown size={14} color={expanded ? STONE[900] : STONE[500]} />
          </Animated.View>
          <Text style={[styles.footerText, expanded && styles.footerTextActive]}>
            {expanded ? 'Tap to collapse' : `Read ${readTime} Lesson`}
          </Text>
        </View>
        </Animated.View>
      </Pressable>
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
    borderLeftWidth: 4,
    borderLeftColor: LESSON_ACCENT.border,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  accentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    backgroundColor: LESSON_ACCENT.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  badge: {
    backgroundColor: LESSON_ACCENT.bg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADII.xl,
  },
  badgeText: {
    fontFamily: FONTS.sansBold,
    fontSize: 10,
    letterSpacing: TYPE.labelSmall.letterSpacing,
    color: LESSON_ACCENT.badge,
    textTransform: 'uppercase',
  },
  titleContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.displayRegular,
    fontSize: TYPE.headlineLarge.fontSize,
    color: STONE[900],
    lineHeight: TYPE.headlineLarge.lineHeight,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: TYPE.headlineLarge.fontSize,
    color: LESSON_ACCENT.text,
    fontStyle: 'italic',
    lineHeight: TYPE.headlineLarge.lineHeight,
  },
  previewText: {
    fontFamily: FONTS.sansRegular,
    fontSize: TYPE.bodyLarge.fontSize,
    color: STONE[600],
    lineHeight: TYPE.bodyLarge.lineHeight,
    marginBottom: SPACING.lg,
  },
  expandableContent: {
    overflow: 'hidden',
  },
  fullContent: {
    fontFamily: FONTS.sansRegular,
    fontSize: TYPE.bodyLarge.fontSize,
    color: STONE[600],
    lineHeight: TYPE.bodyLarge.lineHeight + 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.sm,
  },
  footerText: {
    fontFamily: FONTS.sansBold,
    fontSize: TYPE.labelSmall.fontSize,
    letterSpacing: TYPE.labelSmall.letterSpacing,
    color: STONE[500],
    textTransform: 'uppercase',
  },
  footerTextActive: {
    color: STONE[900],
  },
});

