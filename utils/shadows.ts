/**
 * Platform-Safe Shadow Utility
 * 
 * Creates consistent shadows across iOS, Android, and Web without
 * triggering deprecation warnings in react-native-web.
 * 
 * iOS: Uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android: Uses elevation
 * Web: Uses boxShadow CSS property
 * 
 * @see SIM-017 Visual Refinement
 */

import { Platform, ViewStyle } from 'react-native';

// =============================================================================
// TYPES
// =============================================================================

interface ShadowConfig {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}

type ShadowPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';

// =============================================================================
// SHADOW GENERATOR
// =============================================================================

/**
 * Creates a platform-safe shadow object
 * 
 * Usage:
 * ```typescript
 * const styles = StyleSheet.create({
 *   card: {
 *     ...createShadow({ offsetY: 4, opacity: 0.1, radius: 12, elevation: 4 }),
 *   }
 * });
 * ```
 */
export function createShadow(config: ShadowConfig): ViewStyle {
  const {
    color = '#000000',
    offsetX = 0,
    offsetY = 4,
    opacity = 0.1,
    radius = 12,
    elevation = 4,
  } = config;

  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: offsetX, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    web: {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(0,0,0,${opacity})`,
    },
    default: {},
  }) as ViewStyle;
}

// =============================================================================
// PRESET SHADOWS
// =============================================================================

/**
 * Pre-configured shadow presets matching our design system
 * Use these instead of manually creating shadows
 */
export const SHADOW = {
  none: createShadow({ offsetY: 0, opacity: 0, radius: 0, elevation: 0 }),
  
  // Subtle - Cards, containers
  sm: createShadow({
    offsetY: 2,
    opacity: 0.03,
    radius: 8,
    elevation: 2,
  }),
  
  // Medium - Elevated cards, buttons
  md: createShadow({
    offsetY: 4,
    opacity: 0.06,
    radius: 12,
    elevation: 4,
  }),
  
  // Large - Modals, popovers
  lg: createShadow({
    offsetY: 8,
    opacity: 0.1,
    radius: 20,
    elevation: 8,
  }),
  
  // Extra large - Prominent CTAs
  xl: createShadow({
    offsetY: 10,
    opacity: 0.15,
    radius: 25,
    elevation: 12,
  }),
  
  // Glow effect (for holographic elements)
  glow: Platform.select({
    ios: {
      shadowColor: 'rgba(100, 200, 255, 0.6)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 20,
    },
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0 0 20px rgba(100, 200, 255, 0.4)',
    },
    default: {},
  }) as ViewStyle,
  
  // Success glow (emerald)
  successGlow: Platform.select({
    ios: {
      shadowColor: 'rgba(16, 185, 129, 0.6)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
    },
    default: {},
  }) as ViewStyle,
  
  // Fire glow (amber/orange)
  fireGlow: Platform.select({
    ios: {
      shadowColor: 'rgba(245, 158, 11, 0.6)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
    },
    default: {},
  }) as ViewStyle,
};

/**
 * Get shadow preset by name
 */
export function getShadow(preset: ShadowPreset): ViewStyle {
  return SHADOW[preset] || SHADOW.none;
}

// =============================================================================
// TEXT SHADOW UTILITY (For Web Compatibility)
// =============================================================================

/**
 * Creates a platform-safe text shadow
 * 
 * Web uses CSS `textShadow`, native uses textShadow* properties
 */
export function createTextShadow(config: {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  radius?: number;
}): object {
  const {
    color = 'rgba(0,0,0,0.3)',
    offsetX = 0,
    offsetY = 2,
    radius = 4,
  } = config;

  return Platform.select({
    web: {
      textShadow: `${offsetX}px ${offsetY}px ${radius}px ${color}`,
    },
    default: {
      textShadowColor: color,
      textShadowOffset: { width: offsetX, height: offsetY },
      textShadowRadius: radius,
    },
  });
}

