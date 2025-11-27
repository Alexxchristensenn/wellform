/**
 * TapthroughModal - Reusable Educational Slideshow Modal
 * 
 * A full-screen modal for displaying educational content in a paced,
 * tap-to-advance format. Used for:
 * - Onboarding philosophy introduction
 * - Golden Rules in Curriculum
 * - Daily tips and achievements
 */

import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Dimensions } from 'react-native';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export interface TapthroughSlide {
  id: string;
  icon: string;           // Emoji or icon name
  title: string;
  body: string;
  accentColor?: string;   // Optional color override
}

export interface TapthroughModalProps {
  visible: boolean;
  slides: TapthroughSlide[];
  onComplete: () => void;
  finalButtonText?: string;  // Default: "Got it"
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TapthroughModal({ 
  visible, 
  slides, 
  onComplete,
  finalButtonText = "Got it"
}: TapthroughModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const buttonScale = useSharedValue(1);
  
  const isLastSlide = currentIndex === slides.length - 1;
  const currentSlide = slides[currentIndex];

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleTap = () => {
    hapticLight();
    
    if (isLastSlide) {
      hapticSuccess();
      onComplete();
      // Reset for next open
      setCurrentIndex(0);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleBackgroundTap = () => {
    // Only advance on non-last slides via background tap
    if (!isLastSlide) {
      hapticLight();
      setCurrentIndex(i => i + 1);
    }
  };

  if (!visible || !currentSlide) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={handleBackgroundTap}>
        <Animated.View
          key={currentSlide.id}
          entering={SlideInUp.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          style={styles.cardContainer}
        >
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            {/* Icon */}
            <View style={[
              styles.iconContainer,
              currentSlide.accentColor && { backgroundColor: currentSlide.accentColor + '20' }
            ]}>
              <Text style={styles.icon}>{currentSlide.icon}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{currentSlide.title}</Text>

            {/* Body */}
            <Text style={styles.body}>{currentSlide.body}</Text>

            {/* Progress Dots */}
            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            {/* Action Button (visible on last slide) or Tap hint */}
            {isLastSlide ? (
              <AnimatedPressable
                onPress={handleTap}
                onPressIn={() => { buttonScale.value = withSpring(0.95); }}
                onPressOut={() => { buttonScale.value = withSpring(1); }}
                style={[
                  styles.finalButton,
                  currentSlide.accentColor && { backgroundColor: currentSlide.accentColor },
                  buttonStyle
                ]}
              >
                <Text style={styles.finalButtonText}>{finalButtonText}</Text>
              </AnimatedPressable>
            ) : (
              <Pressable onPress={handleTap} style={styles.tapHint}>
                <Text style={styles.tapHintText}>Tap to continue</Text>
              </Pressable>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    backgroundColor: '#1c1917',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  body: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: '#a8a29e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#44403c',
  },
  dotActive: {
    backgroundColor: 'white',
    width: 18,
  },
  finalButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  finalButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  tapHint: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tapHintText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: '#78716c',
  },
});

