/**
 * ProgressBar Component
 */

import { View, StyleSheet } from 'react-native';

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${progress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(231, 229, 228, 0.5)',
    zIndex: 50,
  },
  fill: {
    height: '100%',
    backgroundColor: '#f97316',
  },
});
