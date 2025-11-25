/**
 * Onboarding Layout - Simple Stack wrapper
 * 
 * This layout ensures the onboarding route is properly recognized.
 */

import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}


