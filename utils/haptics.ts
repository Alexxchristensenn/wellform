/**
 * Haptics Utility - Tactile Feedback for Onboarding & UI
 * 
 * Provides throttled haptic feedback functions to prevent spam.
 * Uses expo-haptics for cross-platform support.
 * 
 * SIM-014: Pairing Rules (see docs/technical.md for full spec)
 * 
 * | Interaction      | Function       | Animation              |
 * |------------------|----------------|------------------------|
 * | Button press     | hapticLight    | scale 0.98             |
 * | Toggle ON        | hapticMedium   | spring.responsive      |
 * | Toggle OFF       | hapticLight    | spring.responsive      |
 * | Save/Submit      | hapticSuccess  | spring.bouncy          |
 * | Slider tick      | hapticSelection| none (throttled 100ms) |
 * | Modal open       | hapticLight    | spring.gentle          |
 * | Celebration      | hapticSuccess  | spring.bouncy          |
 * 
 * @updated SIM-014: Added pairing documentation
 */

import * as Haptics from 'expo-haptics';

/**
 * Light impact haptic - use for button presses, card selections, modal open
 * Pair with: scale 0.98 press animation
 */
export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium impact haptic - use for toggle ON, important state changes
 * Pair with: spring.responsive animation
 */
export const hapticMedium = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Success notification haptic - use for final completion, milestones
 * Pair with: spring.bouncy animation, celebrate effects
 * WARNING: Use sparingly - only for meaningful completions
 */
export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Error notification haptic - use for validation errors, failures
 */
export const hapticError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

/**
 * Throttled selection haptic for sliders
 * Prevents haptic spam when rapidly changing values
 * Pair with: no animation (feedback is the haptic itself)
 */
let lastHaptic = 0;
const THROTTLE_MS = 100;

export const hapticSelection = () => {
  const now = Date.now();
  if (now - lastHaptic > THROTTLE_MS) {
    Haptics.selectionAsync();
    lastHaptic = now;
  }
};

/**
 * Reset throttle - call when slider interaction ends
 */
export const resetHapticThrottle = () => {
  lastHaptic = 0;
};

/**
 * Toggle haptic - convenience function for boolean toggles
 * Uses medium for ON (celebration), light for OFF (dismissal)
 */
export const hapticToggle = (isOn: boolean) => {
  if (isOn) {
    hapticMedium();
  } else {
    hapticLight();
  }
};

