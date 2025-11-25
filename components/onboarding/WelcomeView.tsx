/**
 * WelcomeView - Introduction Carousel with Animated Slides
 * 
 * Features "The Quantum Forge" intro animation:
 * 1. Energy Accumulation: A glowing core pulses.
 * 2. The Split: The core divides into binary opposites.
 * 3. The Acceleration: They orbit and build velocity.
 * 4. The Singularity: A flash of light (shockwave) clears the screen.
 * 5. The Materialization: The UI "cools down" from energy to solid form.
 */

import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';

interface Props {
  slide: number;
  onSlideChange: (slide: number) => void;
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');
const MAX_DIM = Math.max(width, height);

const CONTENT = [
  { title: 'Welcome to Simplifit', subtitle: 'A new way to think about your body.', icon: '✨' },
  { title: 'Biology, not Magic.', subtitle: 'We use established science to build a protocol that actually works.', icon: '🧬' },
  { title: "Let's build your plan.", subtitle: "We'll gather some data to custom build your roadmap.", icon: '📊' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper component for a glowing blob
const GlowingBlob = ({ color, style }: { color: string, style: any }) => (
  <Animated.View style={[styles.blobContainer, style]}>
    {/* Core */}
    <View style={[styles.blobCore, { backgroundColor: color }]} />
    {/* Inner Glow */}
    <View style={[styles.blobGlow, { backgroundColor: color, opacity: 0.5, transform: [{ scale: 1.5 }] }]} />
    {/* Outer Glow */}
    <View style={[styles.blobGlow, { backgroundColor: color, opacity: 0.2, transform: [{ scale: 2.5 }] }]} />
  </Animated.View>
);

export default function WelcomeView({ slide, onSlideChange, onFinish }: Props) {
  const [introFinished, setIntroFinished] = useState(false);
  const buttonScale = useSharedValue(1);
  
  // Intro Animation Controller (0 -> 1)
  const progress = useSharedValue(0);
  
  // Logo Materialization Values
  const logoCooling = useSharedValue(0); // 0 (Hot/Energy) -> 1 (Cold/Solid)

  const current = CONTENT[slide];

  useEffect(() => {
    if (slide === 0 && !introFinished) {
      // THE QUANTUM SEQUENCE
      
      // 1. Progress: Controls Orbit & Expansion
      progress.value = withTiming(1, { duration: 2800, easing: Easing.bezier(0.5, 0, 0.1, 1) }, (finished) => {
        if (finished) runOnJS(setIntroFinished)(true);
      });

      // 2. Logo "Cooling Down" Effect (Starts at 1.8s)
      logoCooling.value = withDelay(1800, withTiming(1, { duration: 1200 }));

    } else if (introFinished) {
      // Immediate final state for subsequent slides
      progress.value = 1;
      logoCooling.value = 1;
    }
  }, [slide, introFinished]);

  // --- Animation Interpolations ---

  // Orbit Rotation (Accelerates exponentially)
  const rotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 0.8], [0, 1080], Extrapolation.CLAMP)}deg` }]
  }));

  // Distance between blobs
  const separation = useAnimatedStyle(() => {
    // 0-20%: Pulse together
    // 20-60%: Separate to orbit distance
    // 60-100%: Expand off screen
    const dist = interpolate(
      progress.value,
      [0, 0.2, 0.6, 1],
      [0, 0, 60, MAX_DIM],
      Extrapolation.CLAMP
    );
    return { width: dist }; // Used as a spacer or container width
  });

  // Blob Scale (Pulse then shrink then explode)
  const blobScale = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      [0, 0.1, 0.2, 0.8, 1],
      [1, 1.5, 1, 1, 4], // Pulse -> Normal -> Massive
      Extrapolation.CLAMP
    );
    return { transform: [{ scale }] };
  });

  // The Shockwave Flash
  const shockwaveStyle = useAnimatedStyle(() => {
    // Trigger flash at ~75% progress
    const scale = interpolate(progress.value, [0.75, 1], [0, 4], Extrapolation.CLAMP);
    const opacity = interpolate(progress.value, [0.75, 0.85, 1], [0, 1, 0], Extrapolation.CLAMP);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // Logo Reveal Style
  const logoStyle = useAnimatedStyle(() => {
    // Fade in as shockwave clears
    const opacity = interpolate(progress.value, [0.85, 1], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(progress.value, [0.85, 1], [1.5, 1], Extrapolation.CLAMP); // Zoom out effect
    
    // Color interpolation: Hot Orange -> Solid Dark
    const color = interpolateColor(
      logoCooling.value,
      [0, 1],
      ['#f97316', '#1c1917']
    );

    return {
      opacity,
      transform: [{ scale }],
      color,
    };
  });

  // Logo Text Shadow (Glow)
  const logoGlowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(logoCooling.value, [0, 1], [0.8, 0]); // Glow fades out
    return { opacity };
  });

  // Content Slide Up
  const contentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(logoCooling.value, [0.2, 1], [0, 1], Extrapolation.CLAMP);
    const translateY = interpolate(logoCooling.value, [0.2, 1], [40, 0], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePress = () => {
    slide < 2 ? onSlideChange(slide + 1) : onFinish();
  };

  return (
    <View style={styles.container}>
      
      {/* --- INTRO ANIMATION LAYER --- */}
      {!introFinished && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Centered Container for Orbit */}
          <View style={styles.centerContainer}>
            {/* Orbiting Container */}
            <Animated.View style={[styles.orbitContainer, rotation]}>
              {/* Separation Container moves blobs apart */}
              <Animated.View style={[styles.separationContainer, separation]}>
                <Animated.View style={[styles.blobWrapper, blobScale]}>
                  <GlowingBlob color="#FFD166" style={undefined} />
                </Animated.View>
                <Animated.View style={[styles.blobWrapper, blobScale]}>
                  <GlowingBlob color="#EF476F" style={undefined} />
                </Animated.View>
              </Animated.View>
            </Animated.View>
            
            {/* The Shockwave Flash */}
            <Animated.View style={[styles.shockwave, shockwaveStyle]} />
          </View>
        </View>
      )}

      {/* --- MAIN CONTENT LAYER --- */}
      
      {/* Logo Area */}
      <View style={styles.logoContainer}>
        {/* Glow Layer (fades out) */}
        <Animated.Text style={[styles.logo, styles.logoGlow, logoGlowStyle]}>
          Simpli<Text style={styles.logoAccent}>fit</Text>
        </Animated.Text>
        {/* Main Logo Layer (cools down) */}
        <Animated.Text style={[styles.logo, logoStyle]}>
          Simpli<Text style={[styles.logoAccent, logoStyle]}>fit</Text>
        </Animated.Text>
      </View>

      {/* Slide Content */}
      <Animated.View
        key={slide}
        entering={introFinished ? FadeIn.duration(400) : undefined}
        exiting={FadeOut.duration(200)}
        style={[styles.slideContent, !introFinished && contentStyle]}
      >
        {/* Icon */}
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>{current.icon}</Text>
        </View>

        {/* Content */}
        <View style={styles.contentBox}>
          <Text style={styles.title}>{current.title}</Text>
          <Text style={styles.subtitle}>{current.subtitle}</Text>
        </View>

        {/* Button */}
        <AnimatedPressable
          onPress={handlePress}
          onPressIn={() => { buttonScale.value = withSpring(0.95); }}
          onPressOut={() => { buttonScale.value = withSpring(1); }}
          style={[styles.button, buttonStyle]}
        >
          <Text style={styles.buttonText}>{slide < 2 ? 'Continue' : 'Start'}</Text>
        </AnimatedPressable>
      </Animated.View>

      {/* Dots */}
      <Animated.View style={[styles.dotsContainer, !introFinished && contentStyle]}>
        {[0, 1, 2].map((i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              i === slide && styles.dotActive,
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Intro Styles
  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  orbitContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 0, // Animated
  },
  blobWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 10,
  },
  blobGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  shockwave: {
    position: 'absolute',
    width: MAX_DIM,
    height: MAX_DIM,
    borderRadius: MAX_DIM / 2,
    backgroundColor: '#fff', // Pure white flash
    zIndex: 20,
  },
  // Main Styles
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 48,
    color: '#1c1917',
  },
  logoGlow: {
    position: 'absolute',
    color: '#f97316', // Orange glow behind
    textShadowColor: '#f97316',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  logoAccent: {
    fontStyle: 'italic',
    // Color handled by animation
  },
  slideContent: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 40,
  },
  contentBox: {
    alignItems: 'center',
    maxWidth: 300,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    color: '#1c1917',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 48,
  },
  dot: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d6d3d1',
  },
  dotActive: {
    width: 32,
    backgroundColor: '#1c1917',
  },
});
