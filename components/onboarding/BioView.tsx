/**
 * BioView - Biological Data Collection (Sex + Age)
 * 
 * Large, tactile toggle buttons for sex selection.
 * Age input uses both text input and slider for flexibility.
 */

import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
import { hapticLight, hapticSelection } from '../../utils/haptics';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

interface Props {
  sex: 'male' | 'female';
  age: string;
  onSexChange: (sex: 'male' | 'female') => void;
  onAgeChange: (age: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BioView({ sex, age, onSexChange, onAgeChange, onNext, onBack }: Props) {
  const buttonScale = useSharedValue(1);
  const ageNum = parseInt(age) || 30;
  const isValid = ageNum >= 13 && ageNum <= 100;

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleAgeTextChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    onAgeChange(cleaned);
  };

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>The Basics</Text>
          </View>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>
            This helps us calculate your metabolism accurately.
          </Text>
        </View>

        {/* Sex Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Biological Sex</Text>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => {
                hapticLight();
                onSexChange('female');
              }}
              style={[styles.toggleButton, sex === 'female' && styles.toggleActive]}
            >
              <Text style={styles.toggleIcon}>♀</Text>
              <Text style={[styles.toggleLabel, sex === 'female' && styles.toggleLabelActive]}>
                Female
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                hapticLight();
                onSexChange('male');
              }}
              style={[styles.toggleButton, sex === 'male' && styles.toggleActive]}
            >
              <Text style={styles.toggleIcon}>♂</Text>
              <Text style={[styles.toggleLabel, sex === 'male' && styles.toggleLabelActive]}>
                Male
              </Text>
            </Pressable>
          </View>
          <Text style={styles.hint}>Used for metabolic calculations only.</Text>
        </View>

        {/* Age Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Age</Text>
          <View style={styles.ageDisplay}>
            <TextInput
              style={styles.ageInput}
              value={age}
              onChangeText={handleAgeTextChange}
              keyboardType="number-pad"
              maxLength={3}
              selectTextOnFocus
            />
            <Text style={styles.ageUnit}>years old</Text>
          </View>
          <View style={styles.sliderWrapper}>
            <Slider
              style={styles.slider}
              minimumValue={13}
              maximumValue={100}
              step={1}
              value={ageNum}
              onValueChange={(val) => {
                hapticSelection();
                onAgeChange(String(Math.round(val)));
              }}
              minimumTrackTintColor="#1c1917"
              maximumTrackTintColor="#e7e5e4"
              thumbTintColor="#1c1917"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>13</Text>
              <Text style={styles.sliderLabel}>100</Text>
            </View>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <AnimatedPressable
            onPress={isValid ? onNext : undefined}
            onPressIn={() => { 
              hapticLight();
              buttonScale.value = withSpring(0.95); 
            }}
            onPressOut={() => { buttonScale.value = withSpring(1); }}
            style={[styles.nextButton, !isValid && styles.buttonDisabled, buttonStyle]}
            disabled={!isValid}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
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
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#d97706',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: '#78716c',
    textAlign: 'center',
  },
  section: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
    color: '#44403c',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e7e5e4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  toggleActive: {
    borderColor: '#1c1917',
    backgroundColor: '#fafaf9',
  },
  toggleIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  toggleLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: '#78716c',
  },
  toggleLabelActive: {
    color: '#1c1917',
  },
  hint: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#a8a29e',
    textAlign: 'center',
    marginTop: 8,
  },
  ageDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ageInput: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 56,
    color: '#1c1917',
    textAlign: 'center',
    includeFontPadding: false,
    padding: 0,
  },
  ageUnit: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: '#78716c',
    marginTop: 4,
  },
  sliderWrapper: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: '#a8a29e',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 24,
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
  buttonDisabled: {
    backgroundColor: '#d6d3d1',
  },
  nextButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
