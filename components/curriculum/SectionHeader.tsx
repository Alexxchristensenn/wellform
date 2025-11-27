/**
 * SectionHeader - Level Section Header for Curriculum
 * 
 * Displays the section title, icon, and description for each mastery level.
 * 
 * @see SIM-009 for design specifications
 */

import { View, Text, StyleSheet } from 'react-native';
import { MasteryLevel } from '../../types/schema';

// Design system colors
const COLORS = {
  stone900: '#1c1917',
  stone500: '#78716c',
  stone400: '#a8a29e',
  green500: '#22c55e',
  orange500: '#f97316',
  purple500: '#8b5cf6',
};

// Level configuration
const LEVEL_CONFIG: Record<MasteryLevel, {
  icon: string;
  label: string;
  description: string;
  color: string;
}> = {
  foundation: {
    icon: '🌱',
    label: 'FOUNDATION',
    description: 'The fundamentals of energy & food',
    color: COLORS.green500,
  },
  intermediate: {
    icon: '🌿',
    label: 'INTERMEDIATE',
    description: 'The deeper science of metabolism',
    color: COLORS.orange500,
  },
  advanced: {
    icon: '🌳',
    label: 'ADVANCED',
    description: 'Mastering the nuances',
    color: COLORS.purple500,
  },
};

interface SectionHeaderProps {
  level: MasteryLevel;
  isLocked?: boolean;
  completedCount?: number;
  totalCount?: number;
}

export default function SectionHeader({ 
  level, 
  isLocked = false,
  completedCount,
  totalCount,
}: SectionHeaderProps) {
  const config = LEVEL_CONFIG[level];
  
  const lockedDescription = level === 'intermediate' 
    ? 'Complete Foundation to unlock'
    : level === 'advanced'
    ? 'Complete Intermediate to unlock'
    : config.description;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={[
          styles.label,
          { color: isLocked ? COLORS.stone400 : config.color }
        ]}>
          {config.label}
        </Text>
        {!isLocked && completedCount !== undefined && totalCount !== undefined && (
          <Text style={styles.progress}>
            {completedCount}/{totalCount}
          </Text>
        )}
      </View>
      <Text style={[
        styles.description,
        isLocked && styles.descriptionLocked
      ]}>
        {isLocked ? lockedDescription : config.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  progress: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    color: COLORS.stone400,
    marginLeft: 'auto',
  },
  description: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 13,
    color: COLORS.stone500,
    marginLeft: 26,
  },
  descriptionLocked: {
    fontStyle: 'italic',
    color: COLORS.stone400,
  },
});

