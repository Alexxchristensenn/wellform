/**
 * EducationScaleView - Daily Fluctuation vs Trend Education
 * 
 * Teaches users that daily weight fluctuations are normal.
 * Sets expectations before showing their timeline.
 */

import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EducationScaleView({ onNext, onBack }: Props) {
  const buttonScale = useSharedValue(1);
  const scaleWobble = useSharedValue(0);

  // Animate the scale wobble
  useEffect(() => {
    scaleWobble.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 800 }),
        withTiming(3, { duration: 800 }),
        withTiming(0, { duration: 800 }),
      ),
      -1,
      false
    );
  }, []);

  const wobbleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${scaleWobble.value}deg` }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>A Note on Gravity</Text>
          </View>
          <Text style={styles.title}>The scale will lie to you.</Text>
        </View>

        {/* Animated Scale */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.scaleContainer}>
          <Animated.View style={[styles.scaleEmoji, wobbleStyle]}>
            <Text style={styles.scaleIcon}>⚖️</Text>
          </Animated.View>
          <View style={styles.fluctuationBars}>
            {['+2', '+1', '0', '-1', '-2'].map((label, i) => (
              <View key={i} style={styles.fluctuationRow}>
                <Text style={styles.fluctuationLabel}>{label} lb</Text>
                <View 
                  style={[
                    styles.fluctuationBar, 
                    { width: `${Math.abs(parseFloat(label) * 25) + 20}%` }
                  ]} 
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Explanation Cards */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardIcon}>💧</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Water Weight</Text>
              <Text style={styles.cardText}>
                Salt, carbs, and hydration cause 2-5 lb daily swings.
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardIcon}>📈</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Focus on the Trend</Text>
              <Text style={styles.cardText}>
                Weekly averages reveal true progress. Daily numbers are noise.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Key Insight */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.insightBox}>
          <Text style={styles.insightText}>
            "If you weigh yourself daily, you're measuring <Text style={styles.insightBold}>water</Text>.{'\n'}
            If you track weekly averages, you're measuring <Text style={styles.insightBold}>progress</Text>."
          </Text>
        </Animated.View>

        {/* Navigation */}
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
            <Text style={styles.nextButtonText}>Got it</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    color: '#1c1917',
    textAlign: 'center',
  },
  scaleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scaleEmoji: {
    marginBottom: 12,
  },
  scaleIcon: {
    fontSize: 40,
  },
  fluctuationBars: {
    width: '100%',
    maxWidth: 260,
  },
  fluctuationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 8,
  },
  fluctuationLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    color: '#78716c',
    width: 36,
    textAlign: 'right',
  },
  fluctuationBar: {
    height: 6,
    backgroundColor: '#f97316',
    borderRadius: 3,
    opacity: 0.6,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 10,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: '#1c1917',
    marginBottom: 2,
  },
  cardText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#78716c',
    lineHeight: 18,
  },
  insightBox: {
    backgroundColor: '#1c1917',
    borderRadius: 12,
    padding: 14,
    maxWidth: 400,
    marginBottom: 20,
  },
  insightText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#e7e5e4',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightBold: {
    fontFamily: 'Manrope_700Bold',
    color: '#f97316',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 16,
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
