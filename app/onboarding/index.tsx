/**
 * Onboarding Flow - Step Manager
 * 
 * Complete onboarding journey with 12 steps:
 * 1. Welcome - Introduction carousel
 * 2. Name - User's name
 * 3. Bio - Sex and Age
 * 4. Height - Wall metaphor slider
 * 5. Weight - Scale metaphor slider
 * 6. Goal - Weight loss/maintain/gain cards
 * 7. Activity - Activity level selection (defaults to Sedentary)
 * 8. Target - Target weight slider
 * 9. Education - Daily fluctuation vs trend
 * 10. Myth - Myth buster quiz
 * 11. Timeline - Calculate arrival date
 * 12. Blueprint - Final plan with Firebase save
 * 
 * @updated SIM-018: Scorched Earth Policy - Signs out existing user on mount
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from '../../services/firebase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

// UI Components
import AmbientBackground from '../../components/ui/AmbientBackground';
import ProgressBar from '../../components/ui/ProgressBar';
import Logo from '../../components/ui/Logo';

// Onboarding Views
import WelcomeView from '../../components/onboarding/WelcomeView';
import NameView from '../../components/onboarding/NameView';
import BioView from '../../components/onboarding/BioView';
import HeightView from '../../components/onboarding/HeightView';
import WeightView from '../../components/onboarding/WeightView';
import GoalView from '../../components/onboarding/GoalView';
import ActivityView from '../../components/onboarding/ActivityView';
import TargetWeightView from '../../components/onboarding/TargetWeightView';
import EducationScaleView from '../../components/onboarding/EducationScaleView';
import MythView from '../../components/onboarding/MythView';
import TimelineView from '../../components/onboarding/TimelineView';
import BlueprintView from '../../components/onboarding/BlueprintView';

type Step = 
  | 'welcome' 
  | 'name' 
  | 'bio' 
  | 'height' 
  | 'weight' 
  | 'goal' 
  | 'activity'
  | 'target' 
  | 'education' 
  | 'myth'
  | 'timeline' 
  | 'blueprint';

const STEPS: Step[] = [
  'welcome', 
  'name', 
  'bio', 
  'height', 
  'weight', 
  'goal', 
  'activity',
  'target', 
  'education', 
  'myth',
  'timeline', 
  'blueprint'
];

// Header height = logo + padding
const HEADER_HEIGHT = 60;

interface FormData {
  name: string;
  sex: 'male' | 'female';
  units: 'metric' | 'imperial';
  age: string;
  height: number;
  weight: number;
  targetWeight: number;
  activity: number;
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [stepIndex, setStepIndex] = useState(0);
  const [introSlide, setIntroSlide] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    sex: 'female',
    units: 'imperial',
    age: '30',
    height: 170,        // cm
    weight: 70,         // kg
    targetWeight: 65,   // kg
    activity: 1.2,      // Sedentary default (critical for accurate TDEE)
    goal: 'weight_loss',
  });

  // ============================================================================
  // SIM-018: SCORCHED EARTH POLICY
  // When onboarding mounts, destroy any existing session to ensure a fresh start.
  // This prevents "Sticky Sessions" where old data leaks into new journeys.
  // ============================================================================
  useEffect(() => {
    const purgeSession = async () => {
      try {
        // Sign out any existing user (works offline - clears local state)
        await signOut();
        
        // Clear all cached data from React Query
        // This ensures no stale user data persists from a previous session
        queryClient.clear();
        
        console.log('[Onboarding] Session purged. Ready for fresh start.');
      } catch (error) {
        console.error('[Onboarding] Session purge failed:', error);
        // Continue anyway - the flow should still work
      }
    };

    purgeSession();
  }, [queryClient]);

  const currentStep = STEPS[stepIndex];
  const next = () => stepIndex < STEPS.length - 1 && setStepIndex(stepIndex + 1);
  const prev = () => stepIndex > 0 && setStepIndex(stepIndex - 1);
  const updateFormData = (updates: Partial<FormData>) => setFormData((p) => ({ ...p, ...updates }));

  // Determine if we should show the top logo (not on welcome view which has its own)
  const showTopLogo = stepIndex > 0;

  // Update target weight when goal changes
  const handleGoalChange = (goal: FormData['goal']) => {
    let newTarget = formData.weight;
    
    if (goal === 'weight_loss') {
      newTarget = formData.weight * 0.9; // Suggest 10% loss
    } else if (goal === 'muscle_gain') {
      newTarget = formData.weight * 1.1; // Suggest 10% gain
    }
    
    updateFormData({ goal, targetWeight: Math.round(newTarget) });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeView 
            slide={introSlide} 
            onSlideChange={setIntroSlide} 
            onFinish={next} 
          />
        );
      
      case 'name':
        return (
          <NameView 
            name={formData.name} 
            onNameChange={(name) => updateFormData({ name })} 
            onNext={next} 
          />
        );
      
      case 'bio':
        return (
          <BioView
            sex={formData.sex}
            age={formData.age}
            onSexChange={(sex) => updateFormData({ sex })}
            onAgeChange={(age) => updateFormData({ age })}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'height':
        return (
          <HeightView
            height={formData.height}
            units={formData.units}
            onHeightChange={(height) => updateFormData({ height })}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'weight':
        return (
          <WeightView
            weight={formData.weight}
            units={formData.units}
            onWeightChange={(weight) => updateFormData({ weight, targetWeight: weight })}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'goal':
        return (
          <GoalView
            goal={formData.goal}
            onGoalChange={handleGoalChange}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'activity':
        return (
          <ActivityView
            activity={formData.activity}
            onActivityChange={(activity) => updateFormData({ activity })}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'target':
        return (
          <TargetWeightView
            currentWeight={formData.weight}
            targetWeight={formData.targetWeight}
            goal={formData.goal}
            units={formData.units}
            onTargetChange={(targetWeight) => updateFormData({ targetWeight })}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'education':
        return (
          <EducationScaleView
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'myth':
        return (
          <MythView
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'timeline':
        return (
          <TimelineView
            currentWeight={formData.weight}
            targetWeight={formData.targetWeight}
            goal={formData.goal}
            units={formData.units}
            onNext={next}
            onBack={prev}
          />
        );
      
      case 'blueprint':
        return (
          <BlueprintView
            formData={formData}
            onBack={prev}
          />
        );
      
      default:
        return null;
    }
  };

  // Calculate content area padding
  const contentPaddingTop = showTopLogo 
    ? insets.top + HEADER_HEIGHT + 16 // Space for logo + buffer
    : insets.top;

  return (
    <View style={styles.container}>
      <AmbientBackground variant={currentStep} />
      
      {/* Progress bar (hidden on welcome) */}
      {stepIndex > 0 && (
        <View style={[styles.progressContainer, { top: insets.top }]}>
          <ProgressBar current={stepIndex} total={STEPS.length - 1} />
        </View>
      )}
      
      {/* Logo (shown on all steps except welcome, which has its own) */}
      {showTopLogo && (
        <View style={[styles.logoContainer, { top: insets.top + 8 }]}>
          <Logo />
        </View>
      )}

      {/* Main content - KeyboardAvoidingView for input screens */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <Animated.View 
          key={currentStep}
          entering={FadeIn.duration(400)}
          style={[
            styles.content, 
            { 
              paddingTop: contentPaddingTop, 
              paddingBottom: insets.bottom + 16,
            }
          ]}
        >
          {renderStep()}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 24,
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
});
