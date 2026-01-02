/**
 * Motion - Simplifit Animation System
 * 
 * Cohesive motion language for the "Accessible Ethereal" aesthetic.
 * All animations should be purposeful, not decorative.
 * 
 * Rules:
 * 1. Every motion reinforces feedback, hierarchy, or progress
 * 2. Springs for tactile (buttons, toggles), timing for informational (fades)
 * 3. Respect Reduce Motion system setting
 * 
 * @see SIM-014 Premium Vibe Pass
 */

import { Easing, WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

// =============================================================================
// DURATION TOKENS
// =============================================================================

/**
 * Duration Scale
 * Standardized timing for consistent rhythm.
 */
export const DURATION = {
  // Micro - Button presses, toggles, immediate feedback
  micro: 150,
  
  // Fast - Small UI changes, hover states
  fast: 200,
  
  // Normal - Standard transitions, fades
  normal: 300,
  
  // Slow - Modal open/close, page transitions
  slow: 450,
  
  // Deliberate - Emphasis animations, onboarding reveals
  deliberate: 600,
  
  // Ambient - Background animations, shimmer loops
  ambient: 3000,
} as const;

// =============================================================================
// EASING PRESETS
// =============================================================================

/**
 * Easing Functions
 * Named curves for consistent motion character.
 */
export const EASING = {
  // Standard - Most UI transitions
  standard: Easing.bezier(0.25, 0.1, 0.25, 1),
  
  // Emphasized - Entrances, important reveals
  emphasized: Easing.bezier(0.25, 0.8, 0.25, 1),
  
  // Decelerate - Entering elements (fast start, slow end)
  decelerate: Easing.out(Easing.ease),
  
  // Accelerate - Exiting elements (slow start, fast end)
  accelerate: Easing.in(Easing.ease),
  
  // Bounce - Tactile feedback, success states
  bounce: Easing.out(Easing.back(1.5)),
  
  // Smooth - Ambient, continuous animations
  smooth: Easing.inOut(Easing.ease),
  
  // Linear - Progress bars, loading spinners
  linear: Easing.linear,
} as const;

// =============================================================================
// SPRING CONFIGS
// =============================================================================

/**
 * Spring Presets
 * Physics-based motion for tactile interactions.
 */
export const SPRING: Record<string, WithSpringConfig> = {
  // Snappy - Button presses, quick feedback
  snappy: {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  },
  
  // Responsive - Toggles, switches, sliders
  responsive: {
    damping: 20,
    stiffness: 200,
  },
  
  // Gentle - Card movements, modal slides
  gentle: {
    damping: 25,
    stiffness: 150,
  },
  
  // Bouncy - Success celebrations, micro-delights
  bouncy: {
    damping: 12,
    stiffness: 180,
  },
  
  // Wobbly - Playful emphasis (use sparingly)
  wobbly: {
    damping: 8,
    stiffness: 100,
  },
} as const;

// =============================================================================
// TIMING CONFIGS
// =============================================================================

/**
 * Timing Presets
 * Curve-based motion for fades and informational transitions.
 */
export const TIMING: Record<string, WithTimingConfig> = {
  // Fade In - Standard entrance
  fadeIn: {
    duration: DURATION.normal,
    easing: EASING.decelerate,
  },
  
  // Fade Out - Standard exit
  fadeOut: {
    duration: DURATION.fast,
    easing: EASING.accelerate,
  },
  
  // Slide Enter - Modal/sheet entrance
  slideEnter: {
    duration: DURATION.slow,
    easing: EASING.emphasized,
  },
  
  // Slide Exit - Modal/sheet exit
  slideExit: {
    duration: DURATION.normal,
    easing: EASING.accelerate,
  },
  
  // Shimmer - Holographic effect loop
  shimmer: {
    duration: DURATION.ambient,
    easing: EASING.smooth,
  },
  
  // Pulse - Skeleton loading
  pulse: {
    duration: 1000,
    easing: EASING.smooth,
  },
  
  // Pop - Quick emphasis
  pop: {
    duration: DURATION.micro,
    easing: EASING.bounce,
  },
} as const;

// =============================================================================
// ANIMATION PRESETS
// =============================================================================

/**
 * Common Animation Values
 * Reusable scale/opacity/translate values.
 */
export const ANIMATION = {
  // Press states
  pressScale: 0.98,
  pressScaleSubtle: 0.995,
  
  // Pop-in effect
  popInStart: 0.95,
  popInOvershoot: 1.02,
  popInEnd: 1,
  
  // Fade values
  fadeStart: 0,
  fadeEnd: 1,
  
  // Slide distances
  slideDistance: 20,
  modalSlideDistance: 100,
  
  // Flash/glow
  flashPeak: 1.15,
  glowNormal: 1,
} as const;

// =============================================================================
// STAGGER DELAYS
// =============================================================================

/**
 * Stagger Timing
 * For list/grid animations with cascading reveals.
 */
export const STAGGER = {
  // Quick cascade - Card lists
  fast: 50,
  
  // Standard cascade - Grid items
  normal: 100,
  
  // Deliberate cascade - Onboarding steps
  slow: 150,
} as const;

// =============================================================================
// HAPTIC PAIRING RULES
// =============================================================================

/**
 * Haptic-Motion Pairing
 * When to use which haptic with which animation.
 * 
 * Usage:
 * - Light: Button press, selection change, toggle
 * - Medium: Important state change, confirmation
 * - Success: Task completion, milestone, save
 * - Selection: Slider tick, picker change (throttled)
 */
export const HAPTIC_MOTION = {
  // Button press
  buttonPress: {
    haptic: 'light',
    animation: 'pressScale',
  },
  // Toggle on
  toggleOn: {
    haptic: 'medium',
    animation: 'spring.responsive',
  },
  // Toggle off
  toggleOff: {
    haptic: 'light',
    animation: 'spring.responsive',
  },
  // Save/Submit
  submit: {
    haptic: 'success',
    animation: 'spring.bouncy',
  },
  // Slider change
  sliderChange: {
    haptic: 'selection', // throttled
    animation: 'none',
  },
  // Card appear
  cardEnter: {
    haptic: 'none',
    animation: 'timing.fadeIn',
  },
  // Modal open
  modalOpen: {
    haptic: 'light',
    animation: 'spring.gentle',
  },
  // Milestone/celebration
  celebrate: {
    haptic: 'success',
    animation: 'spring.bouncy',
  },
} as const;

// =============================================================================
// REDUCE MOTION FALLBACKS
// =============================================================================

/**
 * Reduced Motion Alternatives
 * Simplified animations for accessibility.
 * 
 * When Reduce Motion is enabled:
 * - Replace slides with fades
 * - Replace springs with quick timing
 * - Disable looping ambient animations
 * - Keep subtle scale (0.98-1.02 range)
 */
export const REDUCED_MOTION = {
  // Replace complex entrance with simple fade
  enterDuration: DURATION.fast,
  exitDuration: DURATION.micro,
  
  // Minimal scale range (still provides feedback)
  scaleMin: 0.98,
  scaleMax: 1.02,
  
  // Skip these animation types entirely
  skip: ['shimmer', 'ambient', 'loop', 'continuous'],
} as const;

