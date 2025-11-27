/**
 * PlateCheckModal - Behavior-Based Meal Logging
 * 
 * The core of the "Intuitive Precision" philosophy.
 * Logs meals in under 5 seconds using simple yes/no questions.
 * 
 * Features:
 * - Meal selector (Breakfast/Lunch/Dinner/Snack)
 * - Binary toggles for Protein and Plants
 * - Satiety slider (1-5) with witty labels
 * - Haptic feedback on interactions
 * 
 * Design Philosophy:
 * - "The Grandma Test": Large touch targets, high contrast
 * - "Habit > Number": We track presence, not grams
 * - "Quality over Quantity": No calorie counting
 * 
 * @see SIM-006 for implementation details
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import { X, Check, Leaf, Drumstick, Sun, Coffee, Moon, Cookie, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MealType } from '../../types/schema';
import { getPlateReact, PlateReact } from '../../services/contentBank';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone800: '#292524',
  stone700: '#44403c',
  stone600: '#57534e',
  stone500: '#78716c',
  stone400: '#a8a29e',
  stone300: '#d6d3d1',
  stone200: '#e7e5e4',
  stone100: '#f5f5f4',
  stone50: '#fafaf9',
  white: '#FFFFFF',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald100: '#d1fae5',
  amber500: '#f59e0b',
  amber100: '#fef3c7',
  rose500: '#f43f5e',
  rose100: '#ffe4e6',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Meal type configuration
const MEAL_CONFIG: Record<MealType, { label: string; icon: typeof Coffee; color: string }> = {
  breakfast: { label: 'Breakfast', icon: Coffee, color: '#f59e0b' },
  lunch: { label: 'Lunch', icon: Sun, color: '#10b981' },
  dinner: { label: 'Dinner', icon: Moon, color: '#8b5cf6' },
  snack: { label: 'Snack', icon: Cookie, color: '#ec4899' },
};

// Satiety labels (Scientific/Witty per persona)
const SATIETY_LABELS: Record<number, { short: string; description: string }> = {
  1: { short: 'Empty', description: 'Running on fumes' },
  2: { short: 'Hungry', description: 'Could eat' },
  3: { short: 'Neutral', description: 'Just right' },
  4: { short: 'Satiated', description: 'Comfortably full' },
  5: { short: 'Thanksgiving', description: 'Need a nap' },
};

interface PlateCheckModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (mealType: MealType, data: { protein: boolean; plants: boolean; satiety: number }) => Promise<void>;
  alreadyLoggedMeals?: MealType[];
}

// Animated wrapper components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * FeedbackView - Displays witty reaction after meal logging
 * 
 * Shows a success icon and the personality-driven feedback text.
 * Auto-dismisses after display duration.
 */
function FeedbackView({ reaction }: { reaction: PlateReact }) {
  const iconScale = useSharedValue(0);
  
  useEffect(() => {
    // Bounce-in animation for the icon
    iconScale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(2)) }),
      withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
    );
  }, []);
  
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  
  // Icon and color based on reaction type
  const getReactionStyle = () => {
    switch (reaction.type) {
      case 'perfect':
        return { 
          iconBg: COLORS.emerald100, 
          iconColor: COLORS.emerald600,
          borderColor: COLORS.emerald500,
        };
      case 'meh':
        return { 
          iconBg: COLORS.amber100, 
          iconColor: COLORS.amber500,
          borderColor: COLORS.amber500,
        };
      case 'oops':
        return { 
          iconBg: COLORS.stone100, 
          iconColor: COLORS.stone600,
          borderColor: COLORS.stone400,
        };
    }
  };
  
  const style = getReactionStyle();
  
  return (
    <Animated.View 
      entering={FadeIn.duration(400)} 
      style={styles.feedbackContainer}
    >
      {/* Success Icon */}
      <Animated.View 
        style={[
          styles.feedbackIconContainer, 
          { backgroundColor: style.iconBg, borderColor: style.borderColor },
          iconAnimatedStyle,
        ]}
      >
        {reaction.type === 'perfect' ? (
          <Sparkles size={40} color={style.iconColor} />
        ) : (
          <Check size={40} color={style.iconColor} strokeWidth={2.5} />
        )}
      </Animated.View>
      
      {/* Reaction Text */}
      <Text style={styles.feedbackText}>{reaction.content}</Text>
      
      {/* Subtle indicator - tap to dismiss or auto-close */}
      <Text style={styles.feedbackHint}>tap anywhere to continue</Text>
    </Animated.View>
  );
}

/**
 * MealSelector - Toggle between meal types
 */
function MealSelector({
  selected,
  onSelect,
  alreadyLogged,
}: {
  selected: MealType;
  onSelect: (meal: MealType) => void;
  alreadyLogged: MealType[];
}) {
  const meals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <View style={styles.mealSelectorContainer}>
      {meals.map((meal) => {
        const config = MEAL_CONFIG[meal];
        const Icon = config.icon;
        const isSelected = selected === meal;
        const isLogged = alreadyLogged.includes(meal);

        return (
          <Pressable
            key={meal}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(meal);
            }}
            style={[
              styles.mealButton,
              isSelected && styles.mealButtonSelected,
              isSelected && { borderColor: config.color },
            ]}
          >
            <View style={[
              styles.mealIconContainer,
              isSelected && { backgroundColor: `${config.color}20` },
            ]}>
              <Icon 
                size={20} 
                color={isSelected ? config.color : COLORS.stone400} 
              />
              {isLogged && (
                <View style={styles.loggedBadge}>
                  <Check size={10} color={COLORS.white} strokeWidth={3} />
                </View>
              )}
            </View>
            <Text style={[
              styles.mealLabel,
              isSelected && styles.mealLabelSelected,
            ]}>
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * BehaviorToggle - Big, tappable yes/no toggle
 */
function BehaviorToggle({
  label,
  question,
  value,
  onChange,
  icon: Icon,
  activeColor,
}: {
  label: string;
  question: string;
  value: boolean;
  onChange: (value: boolean) => void;
  icon: typeof Drumstick;
  activeColor: string;
}) {
  const progress = useSharedValue(value ? 1 : 0);

  const handlePress = useCallback(() => {
    const newValue = !value;
    progress.value = withSpring(newValue ? 1 : 0);
    Haptics.impactAsync(
      newValue ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
    onChange(newValue);
  }, [value, onChange]);

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.stone100, `${activeColor}15`]
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.stone200, activeColor]
    );
    return { backgroundColor, borderColor };
  });

  const iconContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.stone200, activeColor]
    );
    return { backgroundColor };
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.toggleContainer, containerStyle]}
    >
      <View style={styles.toggleContent}>
        <Animated.View style={[styles.toggleIconContainer, iconContainerStyle]}>
          <Icon size={24} color={value ? COLORS.white : COLORS.stone500} />
        </Animated.View>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleLabel}>{label}</Text>
          <Text style={styles.toggleQuestion}>{question}</Text>
        </View>
      </View>
      <View style={[
        styles.toggleIndicator,
        value && styles.toggleIndicatorActive,
        value && { backgroundColor: activeColor },
      ]}>
        {value && <Check size={16} color={COLORS.white} strokeWidth={3} />}
      </View>
    </AnimatedPressable>
  );
}

/**
 * SatietySlider - 1-5 scale with haptic feedback
 */
function SatietySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const handleSelect = useCallback((level: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(level);
  }, [onChange]);

  return (
    <View style={styles.satietyContainer}>
      <Text style={styles.satietyTitle}>How full do you feel?</Text>
      
      {/* Slider dots */}
      <View style={styles.satietyTrack}>
        {[1, 2, 3, 4, 5].map((level) => (
          <Pressable
            key={level}
            onPress={() => handleSelect(level)}
            style={styles.satietyDotContainer}
          >
            <View style={[
              styles.satietyDot,
              level <= value && styles.satietyDotActive,
              level === value && styles.satietyDotCurrent,
            ]} />
          </Pressable>
        ))}
      </View>

      {/* Labels */}
      <View style={styles.satietyLabels}>
        <Text style={styles.satietyLabelEnd}>Empty</Text>
        <Text style={styles.satietyLabelEnd}>Full</Text>
      </View>

      {/* Current value display */}
      <View style={styles.satietyValueContainer}>
        <Text style={styles.satietyValue}>{SATIETY_LABELS[value].short}</Text>
        <Text style={styles.satietyDescription}>{SATIETY_LABELS[value].description}</Text>
      </View>
    </View>
  );
}

export default function PlateCheckModal({
  visible,
  onClose,
  onSubmit,
  alreadyLoggedMeals = [],
}: PlateCheckModalProps) {
  const insets = useSafeAreaInsets();
  
  // Form state
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [hasProtein, setHasProtein] = useState(false);
  const [hasPlants, setHasPlants] = useState(false);
  const [satiety, setSatiety] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback state (SIM-007: Voice Integration)
  const [feedback, setFeedback] = useState<PlateReact | null>(null);

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    setSelectedMeal('lunch');
    setHasProtein(false);
    setHasPlants(false);
    setSatiety(3);
    setIsSubmitting(false);
    setFeedback(null);
    onClose();
  }, [onClose]);

  // Submit handler (SIM-007: Now shows feedback before closing)
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    try {
      await onSubmit(selectedMeal, {
        protein: hasProtein,
        plants: hasPlants,
        satiety,
      });
      
      // SIM-007: Get witty reaction and show feedback view
      const reaction = getPlateReact(hasProtein, hasPlants);
      setFeedback(reaction);
      
      // Auto-close after 5 seconds (enough time to read the witty text)
      setTimeout(() => {
        handleClose();
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting plate check:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsSubmitting(false);
    }
  }, [selectedMeal, hasProtein, hasPlants, satiety, onSubmit, handleClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <AnimatedPressable
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.backdrop}
          onPress={handleClose}
        />

        {/* Modal Content */}
        <Animated.View
          entering={SlideInDown.springify().damping(20).stiffness(200)}
          exiting={SlideOutDown.duration(200)}
          style={[
            styles.modalContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          {/* SIM-007: Show feedback view after successful submit (tap to dismiss) */}
          {feedback ? (
            <Pressable onPress={handleClose} style={{ flex: 1 }}>
              <FeedbackView reaction={feedback} />
            </Pressable>
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Plate Check</Text>
                  <Text style={styles.subtitle}>Quality over Quantity.</Text>
                </View>
                <Pressable
                  onPress={handleClose}
                  style={styles.closeButton}
                  accessibilityLabel="Close"
                >
                  <X size={24} color={COLORS.stone500} />
                </Pressable>
              </View>

              {/* Meal Selector */}
              <MealSelector
                selected={selectedMeal}
                onSelect={setSelectedMeal}
                alreadyLogged={alreadyLoggedMeals}
              />

              {/* The Pillars */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>The Pillars</Text>
                
                <BehaviorToggle
                  label="Protein"
                  question="Did you have palm-sized protein?"
                  value={hasProtein}
                  onChange={setHasProtein}
                  icon={Drumstick}
                  activeColor={COLORS.rose500}
                />

                <BehaviorToggle
                  label="Plants"
                  question="Did you have 1-2 fists of veggies?"
                  value={hasPlants}
                  onChange={setHasPlants}
                  icon={Leaf}
                  activeColor={COLORS.emerald500}
                />
              </View>

              {/* Satiety Slider */}
              <SatietySlider value={satiety} onChange={setSatiety} />

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                accessibilityLabel="Log meal"
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Saving...' : 'Log It'}
                </Text>
              </Pressable>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
    paddingHorizontal: 24,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stone100,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: COLORS.stone900,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.stone500,
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.stone100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Meal Selector
  mealSelectorContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  mealButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.stone200,
    backgroundColor: COLORS.white,
  },
  mealButtonSelected: {
    backgroundColor: COLORS.stone50,
    borderWidth: 2,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.stone100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  loggedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.emerald500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    color: COLORS.stone500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealLabelSelected: {
    color: COLORS.stone900,
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: COLORS.stone500,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  // Behavior Toggle
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 12,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    color: COLORS.stone900,
    marginBottom: 2,
  },
  toggleQuestion: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.stone500,
  },
  toggleIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.stone300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleIndicatorActive: {
    borderWidth: 0,
  },
  // Satiety Slider
  satietyContainer: {
    marginBottom: 28,
  },
  satietyTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    color: COLORS.stone500,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  satietyTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  satietyDotContainer: {
    padding: 12,
  },
  satietyDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.stone200,
  },
  satietyDotActive: {
    backgroundColor: COLORS.amber500,
  },
  satietyDotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginTop: -4,
    marginBottom: -4,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.amber500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  satietyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  satietyLabelEnd: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    color: COLORS.stone400,
  },
  satietyValueContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.stone50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignSelf: 'center',
  },
  satietyValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: COLORS.stone900,
  },
  satietyDescription: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.stone500,
    marginTop: 2,
  },
  // Submit Button
  submitButton: {
    backgroundColor: COLORS.stone900,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: COLORS.stone200,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#000000',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.stone300,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    letterSpacing: 1,
    color: COLORS.white,
  },
  // SIM-007: Feedback View Styles
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    minHeight: 300,
  },
  feedbackIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 3,
  },
  feedbackText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 20,
    color: COLORS.stone800,
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 8,
  },
  feedbackHint: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 12,
    color: COLORS.stone400,
    marginTop: 32,
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
});

