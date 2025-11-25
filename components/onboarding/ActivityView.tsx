/**
 * ActivityView - Activity Level Selection
 * 
 * CRITICAL: Default to Sedentary. Most people overestimate their activity.
 * Accurate TDEE calculation depends on honest assessment.
 */

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ACTIVITY_LEVELS } from '../../utils/calculateMacros';

interface Props {
  activity: number;
  onActivityChange: (activity: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ActivityView({ activity, onActivityChange, onNext, onBack }: Props) {
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      {/* Header - Fixed at top */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Be Honest</Text>
        </View>
        <Text style={styles.title}>How active are you?</Text>
      </View>

      {/* Scrollable Activity Options */}
      <ScrollView 
        style={styles.optionsScroll}
        contentContainerStyle={styles.optionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {ACTIVITY_LEVELS.map((level, index) => {
          const isSelected = activity === level.value;
          
          return (
            <Animated.View
              key={level.value}
              entering={FadeInUp.duration(400).delay(index * 80)}
            >
              <Pressable
                onPress={() => onActivityChange(level.value)}
                style={[
                  styles.activityCard,
                  isSelected && styles.activityCardActive,
                ]}
              >
                {/* Recommended badge - inside card to prevent cutoff */}
                {index === 0 && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>RECOMMENDED</Text>
                  </View>
                )}
                <View style={styles.activityHeader}>
                  <Text style={[styles.activityLabel, isSelected && styles.activityLabelActive]}>
                    {level.label}
                  </Text>
                  <View style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterActive,
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Text style={styles.activityDescription}>{level.description}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Navigation - Fixed at bottom */}
      <View style={styles.navRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        <AnimatedPressable
          onPress={onNext}
          onPressIn={() => { buttonScale.value = withSpring(0.95); }}
          onPressOut={() => { buttonScale.value = withSpring(1); }}
          style={[styles.nextButton, buttonStyle]}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#dc2626',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#1c1917',
    textAlign: 'center',
  },
  optionsScroll: {
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 4,
    gap: 10,
    paddingTop: 12,
    paddingBottom: 16,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    paddingTop: 16,
    borderWidth: 2,
    borderColor: '#e7e5e4',
  },
  activityCardActive: {
    borderColor: '#1c1917',
    backgroundColor: '#fafaf9',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: '#44403c',
  },
  activityLabelActive: {
    color: '#1c1917',
  },
  activityDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#78716c',
    lineHeight: 18,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d6d3d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#1c1917',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1c1917',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 10,
  },
  recommendedText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 9,
    color: 'white',
    letterSpacing: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f4',
    backgroundColor: 'transparent',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#78716c',
  },
  nextButton: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
