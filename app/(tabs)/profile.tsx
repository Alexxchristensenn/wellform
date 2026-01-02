/**
 * Profile Screen - Identity & Debug Interface
 * 
 * Provides visual verification of the current auth session and
 * allows manual sign-out for testing/resetting the app state.
 * 
 * Features:
 * - Displays current Firebase UID (or "Not Signed In")
 * - Sign Out button → redirects to onboarding
 * - Alpha/Debug mode indicator
 * 
 * @see SIM-018: Identity Cycle & Profile Scaffold
 */

import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';

import useUser from '../../hooks/useUser';
import { signOut } from '../../services/firebase';
import { hapticLight, hapticSuccess } from '../../utils/haptics';
import { COLORS, STONE, TYPE, SPACING, RADII, FONTS, A11Y, ACCENT } from '../../constants/theme';
import { SPRING } from '../../constants/motion';

// =============================================================================
// COMPONENT
// =============================================================================

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { uid, isAuthenticated, profile, loading } = useUser();

  // Button press animation
  const buttonScale = useSharedValue(1);
  
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Format UID for display (truncate middle for readability)
  const formatUID = (id: string | null): string => {
    if (!id) return 'Not Signed In';
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-8)}`;
  };

  // Get auth status text
  const getAuthStatus = (): string => {
    if (loading) return 'Loading...';
    if (!isAuthenticated) return 'Guest';
    if (uid?.startsWith('mock_')) return 'Mock (Offline)';
    return 'Anonymous';
  };

  // Execute the actual sign out logic
  const executeSignOut = async () => {
    try {
      // Haptic feedback (will silently fail on web)
      try { hapticSuccess(); } catch {}
      
      // Sign out from Firebase (works offline)
      await signOut();
      
      // Clear all cached data
      queryClient.clear();
      
      // Navigate to onboarding
      router.replace('/onboarding');
    } catch (error) {
      console.error('[Profile] Sign out error:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to sign out. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      }
    }
  };

  // Handle sign out with confirmation
  const handleSignOut = async () => {
    // Haptic feedback on press (will silently fail on web)
    try { hapticLight(); } catch {}
    
    // Use platform-appropriate confirmation dialog
    if (Platform.OS === 'web') {
      // Web: use native browser confirm dialog
      const confirmed = window.confirm(
        'Sign Out?\n\nThis will clear your session and return you to onboarding. Your data will remain saved.'
      );
      if (confirmed) {
        await executeSignOut();
      }
    } else {
      // Native: use React Native Alert
      Alert.alert(
        'Sign Out',
        'This will clear your session and return you to onboarding. Your data will remain saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: executeSignOut,
          },
        ]
      );
    }
  };

  // Button press handlers
  const onPressIn = () => {
    buttonScale.value = withSpring(0.98, SPRING.snappy);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1, SPRING.snappy);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.xl }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Session & Debug Info</Text>
      </View>

      {/* Identity Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>IDENTITY</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>UID</Text>
          <Text style={styles.infoValue} selectable>
            {formatUID(uid)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <View style={[
              styles.statusDot, 
              isAuthenticated ? styles.statusDotActive : styles.statusDotInactive
            ]} />
            <Text style={styles.statusText}>{getAuthStatus()}</Text>
          </View>
        </View>

        {profile?.displayName && (
          <>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profile.displayName}</Text>
            </View>
          </>
        )}
      </View>

      {/* Sign Out Button */}
      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <Pressable
          style={styles.signOutButton}
          onPress={handleSignOut}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out and return to onboarding"
        >
          <Text style={styles.signOutIcon}>🚪</Text>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </Animated.View>

      {/* Environment Badge */}
      <View style={styles.footer}>
        <View style={styles.envBadge}>
          <Text style={styles.envText}>Alpha Build</Text>
        </View>
        <Text style={styles.versionText}>v0.1.0</Text>
      </View>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: STONE[950],
    paddingHorizontal: SPACING['2xl'],
  },
  
  // Header
  header: {
    marginBottom: SPACING['3xl'],
  },
  title: {
    ...TYPE.displayMedium,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPE.bodyMedium,
    color: COLORS.textMuted,
  },
  
  // Identity Card
  card: {
    backgroundColor: STONE[900],
    borderRadius: RADII['3xl'],
    padding: SPACING['2xl'],
    borderWidth: 1,
    borderColor: STONE[800],
  },
  cardLabel: {
    ...TYPE.labelMedium,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: A11Y.minInteractiveSize,
  },
  infoLabel: {
    ...TYPE.bodyMedium,
    color: COLORS.textMuted,
  },
  infoValue: {
    ...TYPE.bodyMedium,
    fontFamily: FONTS.sansSemiBold,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: STONE[800],
    marginVertical: SPACING.md,
  },
  
  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  statusDotInactive: {
    backgroundColor: COLORS.textMuted,
  },
  statusText: {
    ...TYPE.bodyMedium,
    fontFamily: FONTS.sansSemiBold,
    color: COLORS.textPrimary,
  },
  
  // Sign Out Button
  buttonContainer: {
    marginTop: SPACING['3xl'],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: STONE[800],
    borderRadius: RADII.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING['2xl'],
    minHeight: A11Y.minButtonHeight,
    borderWidth: 1.5,
    // Semantic border color: rose indicates destructive action
    borderColor: ACCENT.rose[500],
    gap: SPACING.md,
  },
  signOutIcon: {
    fontSize: 20,
    // Semantic color: indicates this is a significant action
    opacity: 0.8,
  },
  signOutText: {
    ...TYPE.titleMedium,
    // Semantic color: rose indicates destructive/session-altering action
    // Signals to user: "This button does something significant"
    color: ACCENT.rose[500],
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: SPACING['4xl'],
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  envBadge: {
    backgroundColor: STONE[800],
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.full,
    borderWidth: 1,
    borderColor: STONE[700],
  },
  envText: {
    ...TYPE.labelSmall,
    color: COLORS.textMuted,
  },
  versionText: {
    ...TYPE.caption,
    color: STONE[600],
  },
});
