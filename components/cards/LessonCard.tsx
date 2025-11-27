/**
 * LessonCard - "The Golden Rules"
 * 
 * Educational content card with accordion expand behavior.
 * Displays bite-sized health education content.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInUp,
} from 'react-native-reanimated';
import { BookOpen, ChevronDown } from 'lucide-react-native';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone800: '#292524',
  stone600: '#57534e',
  stone500: '#78716c',
  stone400: '#a8a29e',
  stone300: '#d6d3d1',
  orange100: 'rgba(255, 237, 213, 0.8)',
  orange200: '#fed7aa',
  orange500: '#f97316',
  orange600: '#ea580c',
  orange900: '#7c2d12',
  white: '#FFFFFF',
  glassWhite: 'rgba(255, 255, 255, 0.75)',
  border: 'rgba(255, 255, 255, 0.9)',
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

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    
    expandProgress.value = withTiming(newExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    
    iconRotation.value = withTiming(newExpanded ? 180 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
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

  return (
    <Animated.View entering={FadeInUp.duration(500).delay(100)}>
      <Pressable onPress={toggleExpand} style={styles.container}>
        {/* Left accent border */}
        <View style={styles.accentBorder} />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>GOLDEN RULE #{ruleNumber.toString().padStart(2, '0')}</Text>
          </View>
          <BookOpen size={20} color={expanded ? COLORS.orange500 : COLORS.stone400} />
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
            <ChevronDown size={14} color={expanded ? COLORS.stone900 : COLORS.stone500} />
          </Animated.View>
          <Text style={[styles.footerText, expanded && styles.footerTextActive]}>
            {expanded ? 'Tap to collapse' : `Read ${readTime} Lesson`}
          </Text>
        </View>
      </Pressable>
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
    borderLeftWidth: 4,
    borderLeftColor: COLORS.orange200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 4,
    overflow: 'hidden',
  },
  accentBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.orange200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: COLORS.orange100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    color: COLORS.orange900,
    textTransform: 'uppercase',
  },
  titleContainer: {
    marginBottom: 12,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 26,
    color: COLORS.stone900,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 26,
    color: COLORS.orange600,
    fontStyle: 'italic',
    lineHeight: 32,
  },
  previewText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: COLORS.stone600,
    lineHeight: 24,
    marginBottom: 16,
  },
  expandableContent: {
    overflow: 'hidden',
  },
  fullContent: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: COLORS.stone600,
    lineHeight: 26,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  footerText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.stone500,
    textTransform: 'uppercase',
  },
  footerTextActive: {
    color: COLORS.stone900,
  },
});

