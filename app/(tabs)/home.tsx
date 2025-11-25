/**
 * Home Screen - Main Dashboard
 * 
 * Displays daily progress, targets, and quick actions.
 * This is where users land after completing onboarding.
 */

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // TODO: Fetch actual user data from Firebase
  const mockData = {
    name: 'User',
    calories: { current: 0, target: 1800 },
    protein: { current: 0, target: 140 },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{mockData.name}</Text>
        </Animated.View>

        {/* Daily Progress Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.progressCard}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          
          {/* Calories */}
          <View style={styles.progressRow}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Calories</Text>
              <Text style={styles.progressValue}>
                {mockData.calories.current} / {mockData.calories.target}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(mockData.calories.current / mockData.calories.target) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Protein */}
          <View style={styles.progressRow}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Protein</Text>
              <Text style={styles.progressValue}>
                {mockData.protein.current}g / {mockData.protein.target}g
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  styles.progressFillProtein,
                  { width: `${(mockData.protein.current / mockData.protein.target) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>📷</Text>
              <Text style={styles.actionLabel}>Snap Meal</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>✏️</Text>
              <Text style={styles.actionLabel}>Manual Log</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>⚖️</Text>
              <Text style={styles.actionLabel}>Weigh In</Text>
            </View>
          </View>
        </Animated.View>

        {/* Welcome Message for New Users */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.welcomeCard}>
          <Text style={styles.welcomeIcon}>🎉</Text>
          <Text style={styles.welcomeTitle}>Welcome to Simplifit!</Text>
          <Text style={styles.welcomeText}>
            Your personalized plan is ready. Start by logging your first meal to see the magic happen.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: '#78716c',
  },
  name: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    color: '#1c1917',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: '#78716c',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
    color: '#1c1917',
  },
  progressValue: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#78716c',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f4',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f97316',
    borderRadius: 4,
  },
  progressFillProtein: {
    backgroundColor: '#22c55e',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
    color: '#78716c',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    color: '#1c1917',
  },
  welcomeCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  welcomeIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 18,
    color: '#065f46',
    marginBottom: 8,
  },
  welcomeText: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
  },
});

