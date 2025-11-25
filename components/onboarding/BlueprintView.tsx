/**
 * BlueprintView - Final Plan Display with Holographic Card
 * 
 * Shows calculated macros with a rainbow gradient effect.
 * Saves user profile to Firebase and navigates to home.
 */

import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { calculateMacros, MacroInput } from '../../utils/calculateMacros';
import { signInAnonymously, saveUserProfile } from '../../services/firebase';

interface Props {
  formData: {
    name: string;
    sex: 'male' | 'female';
    units: 'metric' | 'imperial';
    age: string;
    height: number;
    weight: number;
    targetWeight: number;
    activity: number;
    goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  };
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BlueprintView({ formData, onBack }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const buttonScale = useSharedValue(1);
  const rainbowPhase = useSharedValue(0);

  // Animate rainbow effect
  useEffect(() => {
    rainbowPhase.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const holographicStyle = useAnimatedStyle(() => {
    const color1 = interpolateColor(
      rainbowPhase.value,
      [0, 0.33, 0.66, 1],
      ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF6B6B']
    );
    const color2 = interpolateColor(
      rainbowPhase.value,
      [0, 0.33, 0.66, 1],
      ['#4ECDC4', '#FFE66D', '#FF6B6B', '#4ECDC4']
    );
    
    return {
      borderColor: color1,
      shadowColor: color2,
    };
  });

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Calculate macros
  const macroInput: MacroInput = {
    sex: formData.sex,
    age: parseInt(formData.age) || 30,
    heightCm: formData.height,
    weightKg: formData.weight,
    activityLevel: formData.activity,
    goal: formData.goal,
  };
  
  const macros = calculateMacros(macroInput);

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign in anonymously
      const uid = await signInAnonymously();
      
      if (!uid) {
        throw new Error('Failed to create account');
      }

      // 2. Save profile to Firestore
      const success = await saveUserProfile(uid, {
        profile: {
          displayName: formData.name,
          units: formData.units,
          onboardingCompleted: true,
        },
        stats: {
          sex: formData.sex,
          age: parseInt(formData.age) || 30,
          heightCm: formData.height,
          startWeightKg: formData.weight,
          currentWeightKg: formData.weight,
          goalWeightKg: formData.targetWeight,
          activityLevel: formData.activity,
          targetCalories: macros.targetCalories,
          targetProtein: macros.targetProtein,
        },
        subscription: {
          tier: 'free',
          expiry: null,
        },
      });

      if (!success) {
        throw new Error('Failed to save profile');
      }

      // 3. Navigate to home
      router.replace('/(tabs)/home');
    } catch (err) {
      console.error('Onboarding completion error:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Your Protocol</Text>
          </View>
          <Text style={styles.title}>Here's your blueprint, {formData.name}.</Text>
        </View>

        {/* Holographic Card */}
        <Animated.View 
          entering={FadeInUp.duration(600).delay(200)}
          style={[styles.holographicCard, holographicStyle]}
        >
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Daily Targets</Text>
            <View style={[
              styles.focusBadge,
              formData.goal === 'weight_loss' && styles.focusDeficit,
              formData.goal === 'muscle_gain' && styles.focusSurplus,
            ]}>
              <Text style={styles.focusText}>{macros.focus}</Text>
            </View>
          </View>

          {/* Main Stats */}
          <View style={styles.mainStats}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{macros.targetCalories}</Text>
              <Text style={styles.mainStatLabel}>Calories</Text>
            </View>
            <View style={styles.statSeparator} />
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{macros.targetProtein}g</Text>
              <Text style={styles.mainStatLabel}>Protein</Text>
            </View>
          </View>

          {/* Breakdown */}
          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Basal Metabolic Rate</Text>
              <Text style={styles.breakdownValue}>{macros.bmr} cal</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Activity Adjusted (TDEE)</Text>
              <Text style={styles.breakdownValue}>{macros.tdee} cal</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Goal Adjustment</Text>
              <Text style={[
                styles.breakdownValue,
                formData.goal === 'weight_loss' && { color: '#ef4444' },
                formData.goal === 'muscle_gain' && { color: '#22c55e' },
              ]}>
                {formData.goal === 'weight_loss' ? '-500 cal' : 
                 formData.goal === 'muscle_gain' ? '+250 cal' : '±0 cal'}
              </Text>
            </View>
          </View>

          {/* Rainbow shimmer overlay hint */}
          <View style={styles.shimmerOverlay} />
        </Animated.View>

        {/* Info Note */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.infoNote}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            These targets will adjust as you log your progress. The app learns with you.
          </Text>
        </Animated.View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable onPress={onBack} style={styles.backButton} disabled={isLoading}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <AnimatedPressable
            onPress={handleComplete}
            onPressIn={() => { buttonScale.value = withSpring(0.95); }}
            onPressOut={() => { buttonScale.value = withSpring(1); }}
            style={[styles.nextButton, buttonStyle]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.nextButtonText}>Start My Journey</Text>
            )}
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
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#9333ea',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: '#1c1917',
    textAlign: 'center',
  },
  holographicCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1c1917',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: '#a8a29e',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  focusBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  focusDeficit: {
    backgroundColor: '#ef4444',
  },
  focusSurplus: {
    backgroundColor: '#22c55e',
  },
  focusText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 10,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mainStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainStat: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 40,
    color: 'white',
  },
  mainStatLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#78716c',
    marginTop: 2,
  },
  statSeparator: {
    width: 1,
    height: 50,
    backgroundColor: '#44403c',
    marginHorizontal: 20,
  },
  breakdown: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  breakdownLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#a8a29e',
  },
  breakdownValue: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  infoNote: {
    flexDirection: 'row',
    backgroundColor: '#fefce8',
    borderRadius: 10,
    padding: 12,
    maxWidth: 400,
    marginBottom: 16,
    gap: 10,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#854d0e',
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
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
    backgroundColor: '#f97316',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 50,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
