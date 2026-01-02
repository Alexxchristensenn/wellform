# Technical Specifications

## Core Stack

- **Runtime:** Expo SDK ~54 (Managed Workflow).
- **Language:** TypeScript.
- **Router:** expo-router (File-based routing).
- **Styling:** React Native `StyleSheet` + react-native-reanimated (Complex animations).

## Critical Libraries

- **State/Cache:** @tanstack/react-query (Server state), zustand (Client state/Auth).
- **Auth:** firebase/auth, expo-apple-authentication.
- **Database:** firebase/firestore (with offline persistence enabled).
- **AI:** openai (Official Node.js library).

## Environment Variables (.env)

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_OPENAI_API_KEY=...
```

## Animation Standards

- **Holographic Effect:** Must use react-native-reanimated with `interpolateColor` for hue rotation. CSS Keyframes do not work in Native.
- **Gesture Handling:** Use react-native-gesture-handler for sliders to avoid conflicts with OS gestures on iOS.

---

## Motion System (SIM-014)

All animations use presets from `constants/motion.ts`. Every motion reinforces feedback, hierarchy, or progress.

### Duration Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `micro` | 150ms | Button presses, toggles, immediate feedback |
| `fast` | 200ms | Small UI changes, hover states |
| `normal` | 300ms | Standard transitions, fades |
| `slow` | 450ms | Modal open/close, page transitions |
| `deliberate` | 600ms | Emphasis animations, onboarding reveals |
| `ambient` | 3000ms | Background shimmer, looping effects |

### Animation Types

**Springs (Tactile):** Use for user-initiated interactions.
```typescript
// Button press
withSpring(targetValue, SPRING.snappy)

// Toggles, switches
withSpring(targetValue, SPRING.responsive)

// Modal slides, card movements
withSpring(targetValue, SPRING.gentle)

// Success celebrations
withSpring(targetValue, SPRING.bouncy)
```

**Timing (Informational):** Use for system-initiated transitions.
```typescript
// Fade in entrance
withTiming(1, TIMING.fadeIn)

// Shimmer loop
withTiming(1, TIMING.shimmer)

// Skeleton pulse
withTiming(1, TIMING.pulse)
```

### Haptic Pairing Rules

| Interaction | Haptic | Animation |
|-------------|--------|-----------|
| Button press | `light` | scale 0.98 |
| Toggle ON | `medium` | spring.responsive |
| Toggle OFF | `light` | spring.responsive |
| Save/Submit | `success` | spring.bouncy |
| Slider tick | `selection` (throttled) | none |
| Modal open | `light` | spring.gentle |
| Celebration | `success` | spring.bouncy |

### Reduce Motion Accessibility

**Requirement:** All animations must respect the system "Reduce Motion" setting.

Use the `useReducedMotion` hook:
```typescript
import { useReducedMotion } from '../hooks/useReducedMotion';

function MyComponent() {
  const { shouldReduceMotion, getAnimationConfig } = useReducedMotion();
  const config = getAnimationConfig();
  
  // Skip continuous animations
  if (!config.enableShimmer) return;
  
  // Use reduced duration
  withTiming(1, { duration: config.enterDuration });
}
```

**Fallback Rules:**
- Replace slides → fades
- Replace springs → quick timing (200ms)
- Disable looping ambient animations
- Keep subtle scale feedback (0.98-1.02 range)

---

## Styling Standards

All components use React Native's built-in `StyleSheet.create()` for styling. We do **not** use NativeWind, Tailwind, or any CSS-in-JS libraries.

Example pattern:
```typescript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1917', // stone-900
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fafaf9', // stone-50
  },
});
```

## Design Tokens (SIM-014)

All design tokens are defined in `constants/theme.ts`. Import from there instead of hardcoding values.

### Color Palette

Based on the "Accessible Ethereal" theme with high contrast:

**Stone Scale (Neutrals):**
| Token | Hex | Usage |
|-------|-----|-------|
| `STONE[50]` | #fafaf9 | Primary text on dark |
| `STONE[100]` | #f5f5f4 | Secondary text |
| `STONE[200]` | #e7e5e4 | Borders, dividers |
| `STONE[400]` | #a8a29e | Muted/placeholder |
| `STONE[500]` | #78716c | Secondary UI elements |
| `STONE[800]` | #292524 | Card backgrounds |
| `STONE[900]` | #1c1917 | Primary buttons, text |
| `STONE[950]` | #0c0a09 | App background |

**Accent Colors:**
| Category | Token | Usage |
|----------|-------|-------|
| Success | `ACCENT.emerald[500]` | Positive states, plants |
| Warning | `ACCENT.amber[500]` | Satiety, caution |
| Protein | `ACCENT.rose[500]` | Protein indicators |
| Info | `ACCENT.sky[500]` | Weight, scale |
| Exercise | `ACCENT.purple[500]` | Movement, dinner |

### Typography

**Fonts:**
- `PlayfairDisplay` - Headlines, large numbers
- `Manrope` - Body text, labels, buttons

**Type Scale:**
| Token | Size | Usage |
|-------|------|-------|
| `TYPE.displayLarge` | 42px | Hero numbers |
| `TYPE.displayMedium` | 32px | Section heroes |
| `TYPE.headlineLarge` | 26px | Card titles |
| `TYPE.headlineMedium` | 24px | Subsection titles |
| `TYPE.bodyLarge` | 16px | Primary content |
| `TYPE.bodyMedium` | 14px | Secondary content |
| `TYPE.labelMedium` | 12px | Section headers |
| `TYPE.caption` | 12px | Hints, metadata |

### Spacing & Radii

**Spacing (4px base):**
| Token | Value | Usage |
|-------|-------|-------|
| `SPACING.xs` | 4px | Tight gaps |
| `SPACING.sm` | 8px | Icon gaps |
| `SPACING.md` | 12px | Element gaps |
| `SPACING.lg` | 16px | Section gaps |
| `SPACING.xl` | 20px | Card padding |
| `SPACING['2xl']` | 24px | Container padding |

**Border Radii:**
| Token | Value | Usage |
|-------|-------|-------|
| `RADII.sm` | 8px | Small elements |
| `RADII.md` | 12px | Buttons, inputs |
| `RADII.lg` | 16px | Cards (small) |
| `RADII.xl` | 20px | Buttons (large) |
| `RADII['3xl']` | 28px | Cards (standard) |
| `RADII.full` | 9999px | Circles, pills |
