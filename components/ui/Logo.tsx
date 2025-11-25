/**
 * Logo Component
 */

import { Text, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <Text style={styles.logo}>
      Simpli<Text style={styles.accent}>fit</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 28,
    color: '#1c1917',
  },
  accent: {
    fontStyle: 'italic',
    color: '#f97316',
  },
});
