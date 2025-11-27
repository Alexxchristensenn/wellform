/**
 * NameView - Name Input Screen
 * 
 * Simple name collection with large, accessible input.
 */

import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { hapticLight } from '../../utils/haptics';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NameView({ name, onNameChange, onNext }: Props) {
  const buttonScale = useSharedValue(1);
  const isValid = name.trim().length >= 1;

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleSubmit = () => isValid && onNext();

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>First Impressions</Text>
          </View>
          <Text style={styles.title}>What should we call you?</Text>
        </View>

        {/* Content */}
        <View style={styles.inputContainer}>
          <TextInput
            value={name}
            onChangeText={onNameChange}
            placeholder="Your Name"
            placeholderTextColor="#a8a29e"
            autoFocus
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            style={styles.input}
          />
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <AnimatedPressable
            onPress={handleSubmit}
            onPressIn={() => { 
              hapticLight();
              buttonScale.value = withSpring(0.95); 
            }}
            onPressOut={() => { buttonScale.value = withSpring(1); }}
            style={[styles.button, !isValid && styles.buttonDisabled, buttonStyle]}
            disabled={!isValid}
          >
            <Text style={styles.buttonIcon}>→</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  badge: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#0f766e',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    color: '#1c1917',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 48,
  },
  input: {
    width: '100%',
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 28,
    color: '#1c1917',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e7e5e4',
    paddingBottom: 8,
  },
  navRow: {
    marginTop: 'auto',
    paddingTop: 24,
    paddingBottom: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f4',
    opacity: 0.5,
  },
  buttonIcon: {
    fontSize: 24,
    color: '#1c1917',
  },
});
