/**
 * Learn Screen - Educational Content
 * 
 * Placeholder for educational content and lessons.
 */

import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LearnScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Learn</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#1c1917',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: '#78716c',
  },
});

