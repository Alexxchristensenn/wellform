# Ticket: SIM-001 - Project Foundation

**Priority:** High
**Feature:** F-01 (Project Foundation)

## Description
Initialize the 'Simplifit' application shell. This involves configuring the build tools (NativeWind, Reanimated) and establishing the core data structures (TypeScript interfaces) and service layers (AI Stub) before we build any UI.

## Requirements
1.  **Tailwind Setup:** Configure 'nativewind' to work with the Metro bundler. Ensure 'tailwind.config.js' uses the 'nativewind/preset'.
2.  **Animation Setup:** Configure 'react-native-reanimated' plugin in 'babel.config.js'.
3.  **Type Definitions:** Create 'types/schema.ts' defining the 'UserProfile' and 'DailyLog' interfaces exactly as specified in 'docs/architecture.md'.
4.  **AI Service:** Create 'services/ai.ts'. Setup the OpenAI configuration for 'gpt-4o-mini' ensuring 'json_object' response format is used.

## Acceptance Criteria
- [ ] 'npx expo start' runs without crashing.
- [ ] TypeScript compiler does not throw errors on the new schema types.
- [ ] The AI service file exists and is typed correctly.
