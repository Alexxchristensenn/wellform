/**
 * MythView - Myth Buster Quiz
 * 
 * Two-part quiz that busts common fitness myths:
 * 1. Spot Reduction (crunches for belly fat)
 * 2. Carbs Make You Fat
 */

import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Myth {
  id: number;
  question: string;
  correctAnswer: boolean;
  explanation: string;
  icon: string;
}

const MYTHS: Myth[] = [
  {
    id: 1,
    question: "True or False: Doing crunches is the best way to burn belly fat.",
    correctAnswer: false,
    explanation: "Fat loss happens evenly across your body. You cannot target specific areas. Crunches strengthen ab muscles, but won't specifically reduce belly fat.",
    icon: "🏋️",
  },
  {
    id: 2,
    question: "True or False: Carbs (like bread or fruit) automatically make you gain fat.",
    correctAnswer: false,
    explanation: "Only eating too many calories causes fat gain. Carbs are just fuel. The source matters for health, but total calories determine weight change.",
    icon: "🍞",
  },
];

export default function MythView({ onNext, onBack }: Props) {
  const [mythIndex, setMythIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  
  const buttonScale = useSharedValue(1);
  const cardShake = useSharedValue(0);

  const currentMyth = MYTHS[mythIndex];
  const isCorrect = selectedAnswer === currentMyth.correctAnswer;
  const isLastMyth = mythIndex === MYTHS.length - 1;

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardShake.value }],
  }));

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    
    // Shake if wrong
    if (answer !== currentMyth.correctAnswer) {
      cardShake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  };

  const handleContinue = () => {
    if (isLastMyth) {
      onNext();
    } else {
      setMythIndex(mythIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Myth Buster {mythIndex + 1}/{MYTHS.length}</Text>
          </View>
        </View>

        {/* Question Card */}
        <Animated.View 
          key={mythIndex}
          entering={FadeInUp.duration(400)}
          style={[styles.questionCard, cardStyle]}
        >
          <Text style={styles.mythIcon}>{currentMyth.icon}</Text>
          <Text style={styles.questionText}>{currentMyth.question}</Text>

          {/* Answer Buttons */}
          {!answered && (
            <View style={styles.answerButtons}>
              <Pressable 
                onPress={() => handleAnswer(true)}
                style={styles.answerButton}
              >
                <Text style={styles.answerButtonText}>True</Text>
              </Pressable>
              <Pressable 
                onPress={() => handleAnswer(false)}
                style={styles.answerButton}
              >
                <Text style={styles.answerButtonText}>False</Text>
              </Pressable>
            </View>
          )}

          {/* Result */}
          {answered && (
            <Animated.View entering={FadeIn.duration(400)} style={styles.resultContainer}>
              <View style={[
                styles.resultBadge,
                isCorrect ? styles.resultCorrect : styles.resultWrong
              ]}>
                <Text style={styles.resultBadgeText}>
                  {isCorrect ? '✓ Correct!' : '✗ Actually...'}
                </Text>
              </View>
              <Text style={styles.resultAnswer}>
                The answer is <Text style={styles.resultBold}>FALSE</Text>
              </Text>
              <Text style={styles.explanationText}>{currentMyth.explanation}</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Progress dots */}
        <View style={styles.progressDots}>
          {MYTHS.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot,
                i === mythIndex && styles.dotActive,
                i < mythIndex && styles.dotComplete,
              ]} 
            />
          ))}
        </View>

        {/* Navigation */}
        <View style={styles.navRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          {answered && (
            <AnimatedPressable
              onPress={handleContinue}
              onPressIn={() => { buttonScale.value = withSpring(0.95); }}
              onPressOut={() => { buttonScale.value = withSpring(1); }}
              style={[styles.nextButton, buttonStyle]}
            >
              <Text style={styles.nextButtonText}>
                {isLastMyth ? 'Continue' : 'Next Myth'}
              </Text>
            </AnimatedPressable>
          )}
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
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
  },
  badgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    color: '#d97706',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 20,
  },
  mythIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  questionText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#1c1917',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  answerButton: {
    flex: 1,
    backgroundColor: '#f5f5f4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e7e5e4',
  },
  answerButtonText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: '#1c1917',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  resultBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 10,
  },
  resultCorrect: {
    backgroundColor: '#dcfce7',
  },
  resultWrong: {
    backgroundColor: '#fef2f2',
  },
  resultBadgeText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
    color: '#1c1917',
  },
  resultAnswer: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 15,
    color: '#1c1917',
    marginBottom: 10,
  },
  resultBold: {
    fontFamily: 'Manrope_700Bold',
    color: '#ef4444',
  },
  explanationText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: '#78716c',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d6d3d1',
  },
  dotActive: {
    backgroundColor: '#f97316',
    width: 24,
  },
  dotComplete: {
    backgroundColor: '#22c55e',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#78716c',
  },
  nextButton: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
