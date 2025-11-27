/**
 * Content Engine - Golden Rules Service
 * 
 * Philosophy: "Boring is Effective."
 * 
 * Delivers daily educational content (Golden Rules) to help users
 * understand the science behind sustainable weight management.
 * 
 * SIM-007: Now powered by contentBank.ts for richer, personality-driven content.
 * 
 * Mechanism:
 * - Uses day-of-year to rotate through rules
 * - All users see the same rule on the same day
 * - Content sourced from the comprehensive contentBank
 */

import {
  getDailyGoldenRule,
  getGoldenRule as getGoldenRuleById,
  getAllGoldenRules,
  GoldenRule as ContentBankGoldenRule,
} from './contentBank';

/**
 * Golden Rule structure (UI-friendly format)
 * Adapts the contentBank format for component consumption.
 */
export interface GoldenRule {
  id: string;
  ruleNumber: number;
  title: string;
  subtitle: string;
  content: string;
  readTime: string;
  category: 'science' | 'nutrition' | 'mindset' | 'lifestyle';
}

/**
 * Map contentBank categories to UI categories
 */
function mapCategory(category: ContentBankGoldenRule['category']): GoldenRule['category'] {
  const categoryMap: Record<ContentBankGoldenRule['category'], GoldenRule['category']> = {
    thermodynamics: 'science',
    nutrition: 'nutrition',
    physiology: 'science',
    lifestyle: 'lifestyle',
    metabolism: 'science',
    behavior: 'mindset',
  };
  return categoryMap[category];
}

/**
 * Convert contentBank GoldenRule to UI-friendly format
 * Joins paragraph array into single content string with proper spacing.
 */
function adaptGoldenRule(rule: ContentBankGoldenRule, index: number): GoldenRule {
  // Extract first part of title as main title, rest as subtitle if needed
  // For contentBank, the title is concise, subtitle explains the concept
  return {
    id: rule.id,
    ruleNumber: index + 1,
    title: rule.title,
    subtitle: rule.subtitle,
    content: rule.paragraphs.join('\n\n'),
    readTime: rule.readTime,
    category: mapCategory(rule.category),
  };
}

/**
 * Get today's Golden Rule
 * 
 * SIM-007: Now sources from contentBank for richer content.
 * Rotates through rules based on day of year.
 * All users see the same rule on the same day.
 * 
 * @returns Today's GoldenRule
 */
export function getDailyRule(): GoldenRule {
  const rule = getDailyGoldenRule();
  const allRules = getAllGoldenRules();
  const index = allRules.findIndex((r) => r.id === rule.id);
  return adaptGoldenRule(rule, index);
}

/**
 * Get a specific rule by ID
 * 
 * @param id - Rule ID (e.g., 'golden-001')
 * @returns GoldenRule or undefined
 */
export function getRuleById(id: string): GoldenRule | undefined {
  const rule = getGoldenRuleById(id);
  if (!rule) return undefined;
  
  const allRules = getAllGoldenRules();
  const index = allRules.findIndex((r) => r.id === rule.id);
  return adaptGoldenRule(rule, index);
}

/**
 * Get all rules (for testing/admin purposes)
 * 
 * @returns Array of all GoldenRules
 */
export function getAllRules(): GoldenRule[] {
  return getAllGoldenRules().map((rule, index) => adaptGoldenRule(rule, index));
}

/**
 * Get the next rule after today's
 * Useful for "preview tomorrow's lesson" features
 * 
 * @returns Tomorrow's GoldenRule
 */
export function getNextRule(): GoldenRule {
  const allRules = getAllGoldenRules();
  const todayRule = getDailyGoldenRule();
  const todayIndex = allRules.findIndex((r) => r.id === todayRule.id);
  const nextIndex = (todayIndex + 1) % allRules.length;
  return adaptGoldenRule(allRules[nextIndex], nextIndex);
}

