/**
 * Haptics Utility - Tactile Feedback for Onboarding & UI
 * 
 * Provides throttled haptic feedback functions to prevent spam.
 * Uses expo-haptics for cross-platform support.
 */

import * as Haptics from 'expo-haptics';

/**
 * Light impact haptic - use for button presses, card selections
 */
export const hapticLight = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/**
 * Medium impact haptic - use for important interactions
 */
export const hapticMedium = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

/**
 * Success notification haptic - use for final completion only
 */
export const hapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

/**
 * Throttled selection haptic for sliders
 * Prevents haptic spam when rapidly changing values
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

