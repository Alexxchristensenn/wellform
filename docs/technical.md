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

## Design Tokens (Color Palette)

Based on the "Accessible Ethereal" theme with high contrast:

| Token | Hex | Usage |
|-------|-----|-------|
| stone-50 | #fafaf9 | Primary text on dark |
| stone-100 | #f5f5f4 | Secondary text |
| stone-400 | #a8a29e | Muted/placeholder |
| stone-800 | #292524 | Card backgrounds |
| stone-900 | #1c1917 | App background |
| stone-950 | #0c0a09 | Deep background |
