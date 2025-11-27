/**
 * Learn Screen - The Curriculum ("The Path")
 * 
 * A structured learning experience where users progress through 
 * biological lessons organized by mastery level.
 * 
 * "The other heart of the app" alongside Home.
 * 
 * @see SIM-009 for implementation details
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import useJourney from '../../hooks/useJourney';
import ProgressArc from '../../components/curriculum/ProgressArc';
import SectionHeader from '../../components/curriculum/SectionHeader';
import CurriculumLessonCard from '../../components/curriculum/CurriculumLessonCard';
import TapthroughModal, { TapthroughSlide } from '../../components/modals/TapthroughModal';
import { GoldenRule } from '../../services/contentBank';
import { MasteryLevel, LessonStatus } from '../../types/schema';

// Design system colors
const COLORS = {
  background: '#F8F6F2',
  stone900: '#1c1917',
  stone500: '#78716c',
  stone300: '#d6d3d1',
};

// Level order for iteration
const LEVELS: MasteryLevel[] = ['foundation', 'intermediate', 'advanced'];

/**
 * Convert a GoldenRule to TapthroughSlides for the modal
 */
function ruleToSlides(rule: GoldenRule): TapthroughSlide[] {
  const paragraphIcons = ['📖', '🔬', '💡'];
  
  return [
    // Content slides (one per paragraph)
    ...rule.paragraphs.map((para, i) => ({
      id: `${rule.id}-${i}`,
      icon: paragraphIcons[i] || '📝',
      title: i === 0 ? rule.title : '',
      subtitle: i === 0 ? rule.subtitle : undefined,
      body: para,
    })),
    // Completion slide
    {
      id: `${rule.id}-complete`,
      icon: '✨',
      title: 'Lesson Complete',
      body: `You've learned about ${rule.title}. This knowledge will serve you well.`,
      isCompletion: true,
    },
  ];
}

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const {
    isLoading,
    completedCount,
    totalCount,
    progress,
    currentLevel,
    getLessonStatus,
    getRulesForLevel,
    completeLesson,
  } = useJourney();

  // Modal state
  const [selectedRule, setSelectedRule] = useState<GoldenRule | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Track just-completed lesson for animation
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  
  // Clear justCompletedId after animation completes
  useEffect(() => {
    if (justCompletedId) {
      const timer = setTimeout(() => {
        setJustCompletedId(null);
      }, 1500); // Animation duration + buffer
      return () => clearTimeout(timer);
    }
  }, [justCompletedId]);

  // Get rules organized by level with their statuses
  const levelData = useMemo(() => {
    return LEVELS.map(level => {
      const rules = getRulesForLevel(level);
      const rulesWithStatus = rules.map((rule, index) => ({
        rule,
        status: getLessonStatus(rule.id, index, level),
      }));
      
      // Count completed in this level
      const completedInLevel = rulesWithStatus.filter(
        r => r.status === 'completed'
      ).length;
      
      // Is this level locked?
      const isLocked = LEVELS.indexOf(level) > LEVELS.indexOf(currentLevel);
      
      return {
        level,
        rules: rulesWithStatus,
        completedCount: completedInLevel,
        totalCount: rules.length,
        isLocked,
      };
    });
  }, [currentLevel, getLessonStatus, getRulesForLevel]);

  // Handle lesson tap
  const handleLessonPress = useCallback((rule: GoldenRule, status: LessonStatus) => {
    if (status === 'locked') {
      // Could show a toast here
      return;
    }
    setSelectedRule(rule);
    setModalVisible(true);
  }, []);

  // Handle modal completion
  // Note: The modal handles its own close animation, then calls this
  const handleModalComplete = useCallback(async () => {
    const ruleToComplete = selectedRule;
    
    // Clear modal state first to prevent flash
    setModalVisible(false);
    setSelectedRule(null);
    
    // Then persist the completion and trigger card animation
    if (ruleToComplete) {
      setJustCompletedId(ruleToComplete.id);
      await completeLesson(ruleToComplete.id);
    }
  }, [selectedRule, completeLesson]);

  // Generate slides for selected rule
  const modalSlides = useMemo(() => {
    if (!selectedRule) return [];
    return ruleToSlides(selectedRule);
  }, [selectedRule]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.stone500} />
        <Text style={styles.loadingText}>Loading your journey...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Progress Arc */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <ProgressArc
            progress={progress}
            completedCount={completedCount}
            totalCount={totalCount}
          />
          <Text style={styles.headerTitle}>Your Path</Text>
          <Text style={styles.headerSubtitle}>
            Master the biology of lasting change
          </Text>
        </Animated.View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Level Sections */}
        {levelData.map(({ level, rules, completedCount: levelCompleted, totalCount: levelTotal, isLocked }) => (
          <View key={level} style={styles.section}>
            <SectionHeader
              level={level}
              isLocked={isLocked}
              completedCount={levelCompleted}
              totalCount={levelTotal}
            />
            
            {/* Lesson Cards */}
            <View style={styles.lessonList}>
              {rules.map(({ rule, status }, index) => (
                <CurriculumLessonCard
                  key={rule.id}
                  rule={rule}
                  status={isLocked ? 'locked' : status}
                  index={index}
                  justCompleted={justCompletedId === rule.id}
                  onPress={() => handleLessonPress(rule, isLocked ? 'locked' : status)}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Lesson Modal */}
      <TapthroughModal
        visible={modalVisible}
        slides={modalSlides}
        onComplete={handleModalComplete}
        finalButtonText="Complete"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    color: COLORS.stone500,
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: COLORS.stone900,
    marginTop: 8,
  },
  headerSubtitle: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: COLORS.stone500,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.stone300,
    marginVertical: 20,
    marginHorizontal: 40,
  },
  section: {
    marginBottom: 28,
  },
  lessonList: {
    marginTop: 4,
  },
});
