/**
 * Mifflin-St Jeor Equation for BMR and TDEE Calculation
 * 
 * This is the gold standard for estimating metabolic rate.
 * Research shows it's accurate to within ~10% for most people.
 */

export interface MacroInput {
  sex: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: number; // 1.2 to 1.9
  goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
}

export interface MacroResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProtein: number;
  focus: string;
}

/**
 * Calculate BMR using Mifflin-St Jeor equation
 * Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
 * Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
 */
export function calculateMacros(data: MacroInput): MacroResult {
  // 1. Calculate BMR (Basal Metabolic Rate)
  let bmr = (10 * data.weightKg) + (6.25 * data.heightCm) - (5 * data.age);
  bmr += data.sex === 'male' ? 5 : -161;

  // 2. Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * data.activityLevel;

  // 3. Apply goal-based adjustment
  let targetCalories = tdee;
  let focus = 'Maintenance';

  if (data.goal === 'weight_loss') {
    // 500 calorie deficit = ~0.5kg/week loss (safe, sustainable)
    targetCalories = tdee - 500;
    focus = 'Caloric Deficit';
  } else if (data.goal === 'muscle_gain') {
    // 250 calorie surplus = lean gains with minimal fat
    targetCalories = tdee + 250;
    focus = 'Lean Surplus';
  }

  // 4. Calculate protein (2g per kg bodyweight - optimal for body composition)
  const targetProtein = data.weightKg * 2.0;

  // 5. Ensure minimum safe calories
  const minCalories = data.sex === 'male' ? 1500 : 1200;
  targetCalories = Math.max(targetCalories, minCalories);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    targetProtein: Math.round(targetProtein),
    focus,
  };
}

/**
 * Calculate estimated arrival date based on weight goal
 * Uses 0.75% bodyweight change per week (conservative, sustainable)
 */
export function calculateArrivalDate(
  currentWeightKg: number,
  goalWeightKg: number
): { weeks: number; date: Date } {
  const weightDifference = Math.abs(currentWeightKg - goalWeightKg);
  const weeklyChange = currentWeightKg * 0.0075; // 0.75% per week
  const weeks = Math.ceil(weightDifference / weeklyChange);
  
  const arrivalDate = new Date();
  arrivalDate.setDate(arrivalDate.getDate() + (weeks * 7));
  
  return { weeks, date: arrivalDate };
}

/**
 * Activity level multipliers with descriptions
 */
export const ACTIVITY_LEVELS = [
  {
    value: 1.2,
    label: 'Sedentary',
    description: 'Office job, minimal exercise',
    warning: 'Most people fit here. Be honest.',
  },
  {
    value: 1.375,
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    warning: 'Walking 30min daily counts.',
  },
  {
    value: 1.55,
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    warning: 'Regular gym sessions.',
  },
  {
    value: 1.725,
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    warning: 'Athletes and manual laborers.',
  },
  {
    value: 1.9,
    label: 'Extremely Active',
    description: 'Physical job + hard training',
    warning: 'Professional athletes only.',
  },
];

