/**
 * useTimeOfDay Hook
 * 
 * Returns the current time period based on hour of day.
 * Used by DailyPulseFeed to reorder cards based on time context.
 * 
 * - Morning (5AM - 11AM): Focus on learning, fresh start
 * - Day (11AM - 7PM): Focus on nourishment, peak activity
 * - Evening (7PM+): Focus on rituals, wind down
 */

import { useState, useEffect } from 'react';

export type TimeOfDay = 'morning' | 'day' | 'evening';

interface TimeOfDayConfig {
  greeting: string;
  icon: 'sunrise' | 'sun' | 'moon';
}

const TIME_CONFIGS: Record<TimeOfDay, TimeOfDayConfig> = {
  morning: {
    greeting: 'Good Morning',
    icon: 'sunrise',
  },
  day: {
    greeting: 'Good Afternoon',
    icon: 'sun',
  },
  evening: {
    greeting: 'Good Evening',
    icon: 'moon',
  },
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'morning';
  } else if (hour >= 11 && hour < 19) {
    return 'day';
  } else {
    return 'evening';
  }
}

export default function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay);

  useEffect(() => {
    // Update every minute to catch time transitions
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const config = TIME_CONFIGS[timeOfDay];

  return {
    timeOfDay,
    greeting: config.greeting,
    icon: config.icon,
    // Exposed for debugging/testing - can force a specific time period
    setTimeOfDay,
  };
}

