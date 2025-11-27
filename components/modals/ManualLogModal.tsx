/**
 * ManualLogModal - Grandma-Friendly Meal Entry
 * 
 * A tactile, accessible modal for manually logging meals.
 * Features large fonts, number steppers (not keyboards), and clear feedback.
 * 
 * Design Philosophy:
 * - "The Grandma Test": Large touch targets, high contrast, readable text
 * - Tactile inputs: +/- buttons instead of keyboard entry
 * - Clear visual hierarchy: Name first, then numbers
 * 
 * @see SIM-005 for implementation details
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideOutDown,
} from 'react-native-reanimated';
import { X, Minus, Plus, Utensils } from 'lucide-react-native';

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
  red500: '#ef4444',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

interface ManualLogModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (meal: { name: string; calories: number; protein: number }) => Promise<void>;
}

// Animated wrapper components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * NumberStepper - Tactile number input with +/- buttons
 * Large touch targets for accessibility
 */
function NumberStepper({
  label,
  value,
  onChange,
  unit,
  step = 10,
  min = 0,
  max = 9999,
  color = COLORS.stone900,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  color?: string;
}) {
  const handleDecrement = useCallback(() => {
    onChange(Math.max(min, value - step));
  }, [value, step, min, onChange]);

  const handleIncrement = useCallback(() => {
    onChange(Math.min(max, value + step));
  }, [value, step, max, onChange]);

  // Long press for faster stepping
  const handleLongDecrement = useCallback(() => {
    onChange(Math.max(min, value - step * 5));
  }, [value, step, min, onChange]);

  const handleLongIncrement = useCallback(() => {
    onChange(Math.min(max, value + step * 5));
  }, [value, step, max, onChange]);

  return (
    <View style={styles.stepperContainer}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        {/* Decrement Button */}
        <Pressable
          onPress={handleDecrement}
          onLongPress={handleLongDecrement}
          delayLongPress={300}
          style={({ pressed }) => [
            styles.stepperButton,
            pressed && styles.stepperButtonPressed,
          ]}
          accessibilityLabel={`Decrease ${label}`}
          accessibilityHint={`Decreases ${label} by ${step}`}
        >
          <Minus size={28} color={COLORS.stone700} strokeWidth={3} />
        </Pressable>

        {/* Value Display */}
        <View style={styles.stepperValueContainer}>
          <Text style={[styles.stepperValue, { color }]}>{value}</Text>
          <Text style={styles.stepperUnit}>{unit}</Text>
        </View>

        {/* Increment Button */}
        <Pressable
          onPress={handleIncrement}
          onLongPress={handleLongIncrement}
          delayLongPress={300}
          style={({ pressed }) => [
            styles.stepperButton,
            styles.stepperButtonIncrement,
            pressed && styles.stepperButtonPressed,
          ]}
          accessibilityLabel={`Increase ${label}`}
          accessibilityHint={`Increases ${label} by ${step}`}
        >
          <Plus size={28} color={COLORS.white} strokeWidth={3} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ManualLogModal({
  visible,
  onClose,
  onSubmit,
}: ManualLogModalProps) {
  const insets = useSafeAreaInsets();
  
  // Form state
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState(200);
  const [protein, setProtein] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    setMealName('');
    setCalories(200);
    setProtein(10);
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!mealName.trim()) {
      // Could add validation feedback here
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name: mealName.trim(),
        calories,
        protein,
      });
      handleClose();
    } catch (error) {
      console.error('Error submitting meal:', error);
      setIsSubmitting(false);
    }
  }, [mealName, calories, protein, onSubmit, handleClose]);

  const canSubmit = mealName.trim().length > 0 && !isSubmitting;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Utensils size={24} color={COLORS.emerald600} />
            </View>
            <Text style={styles.title}>Log a Meal</Text>
            <Pressable
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityLabel="Close"
            >
              <X size={24} color={COLORS.stone500} />
            </Pressable>
          </View>

          <ScrollView 
            style={styles.formScroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Meal Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>What did you eat?</Text>
              <TextInput
                style={styles.textInput}
                value={mealName}
                onChangeText={setMealName}
                placeholder="e.g., Grilled Chicken Salad"
                placeholderTextColor={COLORS.stone400}
                autoFocus
                returnKeyType="done"
                maxLength={100}
                accessibilityLabel="Meal name"
              />
            </View>

            {/* Calories Stepper */}
            <NumberStepper
              label="Calories"
              value={calories}
              onChange={setCalories}
              unit="kcal"
              step={25}
              min={0}
              max={5000}
              color={COLORS.emerald600}
            />

            {/* Protein Stepper */}
            <NumberStepper
              label="Protein"
              value={protein}
              onChange={setProtein}
              unit="grams"
              step={5}
              min={0}
              max={500}
              color={COLORS.stone900}
            />
          </ScrollView>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
              pressed && canSubmit && styles.submitButtonPressed,
            ]}
            accessibilityLabel="Log meal"
            accessibilityState={{ disabled: !canSubmit }}
          >
            <Text style={[
              styles.submitButtonText,
              !canSubmit && styles.submitButtonTextDisabled,
            ]}>
              {isSubmitting ? 'Saving...' : 'Log It'}
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
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
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stone100,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.emerald100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: COLORS.stone900,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.stone100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formScroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 28,
  },
  inputLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.stone700,
    marginBottom: 12,
  },
  textInput: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 20,
    color: COLORS.stone900,
    backgroundColor: COLORS.stone50,
    borderWidth: 2,
    borderColor: COLORS.stone200,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  // Number Stepper styles
  stepperContainer: {
    marginBottom: 24,
  },
  stepperLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 16,
    color: COLORS.stone700,
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.stone100,
    borderWidth: 2,
    borderColor: COLORS.stone200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonIncrement: {
    backgroundColor: COLORS.stone900,
    borderColor: COLORS.stone900,
  },
  stepperButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  stepperValueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.stone50,
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.stone200,
  },
  stepperValue: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 36,
    color: COLORS.stone900,
  },
  stepperUnit: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: COLORS.stone500,
    marginTop: 2,
  },
  // Submit button
  submitButton: {
    marginHorizontal: 24,
    marginTop: 8,
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
  submitButtonTextDisabled: {
    color: COLORS.stone500,
  },
});

