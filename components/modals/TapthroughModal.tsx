/**
 * TapthroughModal - Ethereal Educational Slideshow Modal
 * 
 * A full-screen modal for displaying educational content in a paced,
 * tap-to-advance format. Redesigned with "Accessible Ethereal" aesthetic:
 * - Simple fade entrance (clean, no movement)
 * - Smooth crossfades between content
 * - Rainbow shimmer border on completion slides
 * - Centered radial glow effects
 * 
 * Used for:
 * - Onboarding philosophy introduction
 * - Golden Rules in Curriculum
 * - Daily tips and achievements
 * 
 * @updated SIM-009: Ethereal design, rainbow shimmer, centered glow, fade-only animation
 */

import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

export interface TapthroughSlide {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  body: string;
  accentColor?: string;
  isCompletion?: boolean;
}

export interface TapthroughModalProps {
  visible: boolean;
  slides: TapthroughSlide[];
  onComplete: () => void;
  onSlideChange?: (index: number) => void;
  finalButtonText?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Rainbow gradient colors for shimmer effect
const RAINBOW_COLORS = [
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // back to orange for seamless loop
];

export default function TapthroughModal({ 
  visible, 
  slides, 
  onComplete,
  onSlideChange,
  finalButtonText = "Got it"
}: TapthroughModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [internalVisible, setInternalVisible] = useState(false);
  
  // Animation values - simplified to fade only
  const cardOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(1);
  const buttonScale = useSharedValue(1);
  const shimmerPosition = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  
  const currentSlide = slides[currentIndex];
  const isLastSlide = currentIndex === slides.length - 1;
  const isCompletion = currentSlide?.isCompletion ?? false;

  // Handle modal open - simple fade only
  useEffect(() => {
    if (visible && !isClosing) {
      setInternalVisible(true);
      setCurrentIndex(0);
      
      // Simple fade entrance
      overlayOpacity.value = withTiming(1, { duration: 300 });
      cardOpacity.value = withTiming(1, { duration: 300 });
      contentOpacity.value = 1;
    }
  }, [visible]);

  // Handle slide changes
  useEffect(() => {
    if (visible && onSlideChange && !isClosing) {
      onSlideChange(currentIndex);
    }
  }, [currentIndex, visible, isClosing]);

  // Completion slide effects
  useEffect(() => {
    if (isCompletion && !isClosing) {
      // Rainbow shimmer animation
      shimmerPosition.value = withRepeat(
        withTiming(1, { duration: 2500, easing: Easing.linear }),
        -1,
        false
      );
      
      // Glow pulse
      glowPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      shimmerPosition.value = 0;
      glowPulse.value = 0;
    }
  }, [isCompletion, isClosing]);

  // Close animation handler - simple fade out
  const handleClose = () => {
    setIsClosing(true);
    
    cardOpacity.value = withTiming(0, { duration: 200 });
    overlayOpacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(finalizeClose)();
    });
  };

  const finalizeClose = () => {
    setIsClosing(false);
    setInternalVisible(false);
    setCurrentIndex(0);
    onComplete();
  };

  // Advance to next slide with crossfade
  const advanceSlide = () => {
    if (isClosing) return;
    
    hapticLight();
    
    // Crossfade content
    contentOpacity.value = withSequence(
      withTiming(0, { duration: 150 }),
      withTiming(1, { duration: 200 })
    );
    
    setTimeout(() => {
      setCurrentIndex(i => i + 1);
    }, 150);
  };

  const handleTap = () => {
    if (isClosing) return;
    
    if (isLastSlide) {
      hapticSuccess();
      handleClose();
    } else {
      advanceSlide();
    }
  };

  const handleBackgroundTap = () => {
    if (!isLastSlide && !isClosing) {
      advanceSlide();
    }
  };

  // Animated styles
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 0.4, 1], [0.4, 0.6, 1]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 0.4, 1], [1, 1.05, 1.15]) }],
  }));

  // Rainbow border shimmer style
  const shimmerStyle = useAnimatedStyle(() => {
    const rotation = interpolate(shimmerPosition.value, [0, 1], [0, 360]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  if (!internalVisible || !currentSlide) return null;

  return (
    <Modal
      visible={internalVisible}
      transparent
      statusBarTranslucent
      animationType="none"
    >
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <Pressable style={styles.overlayPressable} onPress={handleBackgroundTap}>
          <Animated.View style={[styles.cardWrapper, cardStyle]}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              {/* Rainbow shimmer border for completion */}
              {isCompletion && (
                <View style={styles.shimmerContainer}>
                  <Animated.View style={[styles.shimmerGradientWrapper, shimmerStyle]}>
                    <LinearGradient
                      colors={RAINBOW_COLORS}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.shimmerGradient}
                    />
                  </Animated.View>
                </View>
              )}
              
              <View style={[
                styles.card,
                isCompletion && styles.cardCompletion,
              ]}>
                <Animated.View style={[styles.contentContainer, contentStyle]}>
                  {/* Icon with glow wrapper - ensures centering */}
                  <View style={styles.iconWrapper}>
                    {/* Radial glow behind icon for completion */}
                    {isCompletion && (
                      <Animated.View style={[styles.completionGlow, glowStyle]} />
                    )}
                    
                    <View style={[
                      styles.iconContainer,
                      currentSlide.accentColor && { backgroundColor: currentSlide.accentColor + '20' },
                      isCompletion && styles.iconContainerCompletion,
                    ]}>
                      <Text style={[styles.icon, isCompletion && styles.iconCompletion]}>
                        {currentSlide.icon}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  {currentSlide.title ? (
                    <Text style={[
                      styles.title,
                      isCompletion && styles.titleCompletion
                    ]}>
                      {currentSlide.title}
                    </Text>
                  ) : null}

                  {/* Subtitle */}
                  {currentSlide.subtitle && (
                    <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
                  )}

                  {/* Body */}
                  <Text style={[
                    styles.body,
                    isCompletion && styles.bodyCompletion
                  ]}>
                    {currentSlide.body}
                  </Text>
                </Animated.View>

                {/* Progress Dots */}
                <View style={styles.dotsContainer}>
                  {slides.map((slide, index) => (
                    <View
                      key={slide.id}
                      style={[
                        styles.dot,
                        index === currentIndex && styles.dotActive,
                        index === currentIndex && isCompletion && styles.dotCompletion,
                        index < currentIndex && styles.dotCompleted,
                      ]}
                    />
                  ))}
                </View>

                {/* Action Button or Tap hint */}
                {isLastSlide ? (
                  <AnimatedPressable
                    onPress={handleTap}
                    onPressIn={() => { buttonScale.value = withSpring(0.95); }}
                    onPressOut={() => { buttonScale.value = withSpring(1); }}
                    style={[
                      styles.finalButton,
                      isCompletion && styles.finalButtonCompletion,
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
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 10, 9, 0.92)',
  },
  overlayPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  shimmerContainer: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 24,
    overflow: 'hidden',
  },
  shimmerGradientWrapper: {
    width: '200%',
    height: '200%',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
  },
  shimmerGradient: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#1c1917',
    borderRadius: 22,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardCompletion: {
    backgroundColor: '#1a1918',
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  // Wrapper to hold icon + glow together, centered
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  // Glow is now positioned relative to iconWrapper, centered behind icon
  completionGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#22c55e',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainerCompletion: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  icon: {
    fontSize: 36,
  },
  iconCompletion: {
    fontSize: 42,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    color: '#fafaf9',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },
  titleCompletion: {
    color: '#4ade80',
    fontSize: 28,
  },
  subtitle: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: '#a8a29e',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  body: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 15,
    color: '#a8a29e',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  bodyCompletion: {
    color: '#d6d3d1',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3f3f46',
  },
  dotActive: {
    backgroundColor: '#fafaf9',
    width: 20,
  },
  dotCompletion: {
    backgroundColor: '#4ade80',
  },
  dotCompleted: {
    backgroundColor: '#57534e',
  },
  finalButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 44,
    paddingVertical: 18,
    borderRadius: 50,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  finalButtonCompletion: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  finalButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
  },
  tapHint: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  tapHintText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    color: '#71717a',
    letterSpacing: 0.5,
  },
});
