# Ticket: SIM-002 - Visual Shell & Onboarding (Part 1)

**Priority:** High
**Feature:** F-02 (Onboarding Flow)

## Description
Implement the visual core of the app and the initial onboarding sequence. This requires porting the CSS-based design from the web prototype into React Native primitives and Reanimated logic.

## Requirements
1.  **Fonts:** Load 'PlayfairDisplay' and 'Manrope' in the root layout using 'expo-font'.
2.  **Navigation:** Set up 'app/_layout.tsx' (Stack) and 'app/onboarding/index.tsx'.
3.  **Visuals (Hard):** Create 'components/ui/AmbientBackground.tsx'. 
    * *Constraint:* You MUST convert the CSS '@keyframes' blob animations from the prototype into 'react-native-reanimated' shared values ('withRepeat', 'withTiming').
4.  **Screens:** Implement the 'WelcomeView' and 'NameView' components from the prototype.

## Acceptance Criteria
- [ ] App loads with custom fonts (Serif headers, Sans body).
- [ ] The background blobs move smoothly (fluid animation).
- [ ] User can tap "Start", enter text in a styled input, and navigate to the next step.
