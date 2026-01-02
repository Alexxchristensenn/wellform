/**
 * Theme - Simplifit Design System
 * 
 * "Accessible Ethereal" - High contrast, fluid animation, holographic feedback.
 * Single source of truth for all visual tokens.
 * 
 * @see SIM-014 Premium Vibe Pass
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

/**
 * Stone Palette - Primary neutral scale
 * Used for backgrounds, text, borders, and UI chrome.
 */
export const STONE = {
  50: '#fafaf9',
  100: '#f5f5f4',
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  800: '#292524',
  900: '#1c1917',
  950: '#0c0a09',
} as const;

/**
 * Accent Colors - Semantic meaning
 * Used sparingly for feedback, states, and emphasis.
 */
export const ACCENT = {
  // Success / Positive
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
  },
  // Warning / Neutral attention
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  // Protein / Energy
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    500: '#f43f5e',
    600: '#e11d48',
  },
  // Scale / Weight / Info
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  // Movement / Exercise
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#a855f7',
    600: '#9333ea',
  },
} as const;

/**
 * Holographic Palette - For shimmer effects
 * Soft, ethereal colors that create the "rainbow slide" effect.
 */
export const HOLOGRAPHIC = {
  white: 'rgba(255, 255, 255, 0.95)',
  pink: 'rgba(255, 180, 190, 0.5)',   // #ffb4be
  cyan: 'rgba(180, 240, 255, 0.5)',   // #b4f0ff
  yellow: 'rgba(255, 250, 180, 0.5)', // #fffab4
} as const;

/**
 * Ambient Blob Colors - For background animations
 */
export const AMBIENT = {
  gold: '#FFD166',
  coral: '#EF476F',
  mint: '#06D6A0',
  ocean: '#118AB2',
  cream: '#F8F6F2',
} as const;

/**
 * Semantic Colors - Quick access to common use cases
 */
export const COLORS = {
  // Backgrounds
  background: STONE[950],
  backgroundElevated: STONE[900],
  surface: STONE[800],
  surfaceElevated: STONE[700],
  
  // Glass effects
  glass: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.9)',
  glassSubtle: 'rgba(255, 255, 255, 0.6)',
  
  // Text
  textPrimary: STONE[50],
  textSecondary: STONE[100],
  textMuted: STONE[400],
  textInverse: STONE[900],
  
  // Borders
  border: STONE[200],
  borderSubtle: STONE[100],
  borderStrong: STONE[300],
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Pure
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Feedback states
  success: ACCENT.emerald[500],
  successLight: ACCENT.emerald[100],
  warning: ACCENT.amber[500],
  warningLight: ACCENT.amber[100],
  error: ACCENT.rose[500],
  errorLight: ACCENT.rose[100],
  info: ACCENT.sky[500],
  infoLight: ACCENT.sky[100],
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Font Families
 * - Playfair Display: Headlines, large numbers, card titles
 * - Manrope: Body text, labels, buttons
 */
export const FONTS = {
  // Serif - Elegant headlines
  displayRegular: 'PlayfairDisplay_400Regular',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
  displayBold: 'PlayfairDisplay_700Bold',
  
  // Sans - Clean body text
  sansRegular: 'Manrope_400Regular',
  sansMedium: 'Manrope_500Medium',
  sansSemiBold: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',
} as const;

/**
 * Type Scale
 * Named sizes with line height recommendations.
 * "Grandma Test" compliant - minimum 13px for body.
 */
export const TYPE = {
  // Display - Large headlines
  displayLarge: {
    fontSize: 42,
    lineHeight: 48,
    fontFamily: FONTS.displaySemiBold,
  },
  displayMedium: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: FONTS.displaySemiBold,
  },
  displaySmall: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: FONTS.displaySemiBold,
  },
  
  // Headlines - Section titles
  headlineLarge: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: FONTS.displayRegular,
  },
  headlineMedium: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: FONTS.displayRegular,
  },
  headlineSmall: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: FONTS.displayRegular,
  },
  
  // Titles - Card headers, bold labels
  titleLarge: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FONTS.sansBold,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FONTS.sansSemiBold,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.sansSemiBold,
  },
  
  // Body - Readable content
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FONTS.sansRegular,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONTS.sansRegular,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FONTS.sansRegular,
  },
  
  // Labels - UI chrome, buttons, tags
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONTS.sansSemiBold,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONTS.sansSemiBold,
    letterSpacing: 1,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: FONTS.sansBold,
    letterSpacing: 1.5,
  },
  
  // Captions - Hints, secondary info
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONTS.sansMedium,
  },
} as const;

// =============================================================================
// SPACING & LAYOUT
// =============================================================================

/**
 * Spacing Scale
 * 4px base unit for consistent rhythm.
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

/**
 * Border Radii
 * Consistent curves across the app.
 */
export const RADII = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

/**
 * Shadow Presets
 * Elevation levels for cards, buttons, modals.
 */
export const SHADOWS = {
  // Subtle - Cards, containers
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  // Medium - Elevated cards, buttons
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  // Large - Modals, popovers
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  // Extra large - Prominent CTAs
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 12,
  },
  // Holographic glow
  holographic: {
    shadowColor: 'rgba(100, 200, 255, 0.4)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 8,
  },
  // Button press shadow (softer stone color)
  button: {
    shadowColor: STONE[200],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

/**
 * Card Tokens
 * Consistent card styling across the app.
 */
export const CARD = {
  borderRadius: RADII['3xl'],
  padding: SPACING['2xl'],
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
  backgroundColor: COLORS.glass,
} as const;

/**
 * Button Tokens
 */
export const BUTTON = {
  // Primary (dark)
  primary: {
    backgroundColor: STONE[900],
    textColor: COLORS.white,
    pressedBackground: COLORS.black,
    borderRadius: RADII.xl,
    paddingVertical: SPACING.lg + 2, // 18
    paddingHorizontal: SPACING['2xl'],
  },
  // Secondary (light)
  secondary: {
    backgroundColor: STONE[100],
    textColor: STONE[600],
    pressedBackground: STONE[200],
    borderRadius: RADII.lg,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
} as const;

/**
 * Input Tokens
 */
export const INPUT = {
  borderRadius: RADII.xl,
  borderWidth: 2,
  borderColor: STONE[200],
  focusBorderColor: STONE[400],
  backgroundColor: COLORS.white,
  padding: SPACING.lg,
} as const;

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/**
 * Minimum touch target sizes (Grandma Test)
 */
export const A11Y = {
  minTouchTarget: 44, // iOS HIG minimum
  minButtonHeight: 48,
  minInteractiveSize: 32,
} as const;

