import { WorkingSet, Workout } from '@/types';

/**
 * Calculate the volume for a single set (weight × reps)
 */
export function calculateSetVolume(weight: number, reps: number): number {
  return weight * reps;
}

/**
 * Calculate total volume for an array of sets
 */
export function calculateTotalVolume(sets: WorkingSet[]): number {
  return sets.reduce((sum, set) => sum + set.volume, 0);
}

/**
 * Get the start of the week (Monday) for a given date
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the week number for a date (relative to a reference point)
 */
export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

/**
 * Check if a date falls in the current ongoing week
 */
export function isCurrentWeek(date: Date): boolean {
  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  const dateWeekStart = getWeekStart(date);
  return currentWeekStart.getTime() === dateWeekStart.getTime();
}

/**
 * Group workouts by week and calculate weekly volume for a specific exercise.
 * Returns 3 values: [twoWeeksAgo, lastWeek, currentWeekInProgress]
 * Only the first two (completed weeks) should be used for plateau detection.
 * The third value is the current in-progress week for display purposes.
 */
export function getWeeklyVolumes(
  workouts: Workout[],
  exerciseId: string,
  numWeeks: number = 3
): number[] {
  const now = new Date();
  const weeklyVolumes: Map<string, number> = new Map();

  // Filter workouts for this exercise
  const exerciseWorkouts = workouts.filter(w => w.exerciseId === exerciseId);

  // Group by week
  exerciseWorkouts.forEach(workout => {
    const workoutDate = new Date(workout.date);
    const weekStart = getWeekStart(workoutDate);
    const weekKey = weekStart.toISOString().split('T')[0];

    const currentVolume = weeklyVolumes.get(weekKey) || 0;
    weeklyVolumes.set(weekKey, currentVolume + workout.totalVolume);
  });

  // Build week keys: 2 completed weeks + current in-progress week
  // Current week start
  const currentWeekStart = getWeekStart(now);
  // Last week start (1 week before current week)
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  // Two weeks ago start
  const twoWeeksAgoStart = new Date(currentWeekStart);
  twoWeeksAgoStart.setDate(twoWeeksAgoStart.getDate() - 14);

  const weeks = [
    twoWeeksAgoStart.toISOString().split('T')[0],
    lastWeekStart.toISOString().split('T')[0],
    currentWeekStart.toISOString().split('T')[0],
  ];

  // Return volumes for each week (0 if no data)
  return weeks.map(week => weeklyVolumes.get(week) || 0);
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) {
    return newValue > 0 ? 100 : 0;
  }
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format a date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date for display (shorter format)
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get today's date as ISO string (date part only)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
