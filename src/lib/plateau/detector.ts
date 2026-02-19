import { Exercise, Workout, PlateauAnalysis } from '@/types';
import { getWeeklyVolumes, calculatePercentageChange } from './helpers';

/**
 * Detection thresholds:
 * - OK: Volume increasing >=2% week-over-week
 * - Warning: Volume change between -2% and +2% (stagnant)
 * - Plateau: Volume declining (negative trend)
 */
const GROWTH_THRESHOLD = 2; // 2% increase threshold for "OK" status

/**
 * Detect plateau status for a single exercise
 */
export function detectPlateau(
  workouts: Workout[],
  exercise: Exercise
): PlateauAnalysis {
  const weeklyVolumes = getWeeklyVolumes(workouts, exercise.id, 3);
  const [twoWeeksAgo, lastWeek, currentWeek] = weeklyVolumes;

  // If no data for either completed week, check current week
  if (twoWeeksAgo === 0 && lastWeek === 0) {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status: 'ok',
      weeklyVolumes,
      trend: 0,
      message: currentWeek > 0
        ? 'Week in progress — keep it up! Full comparison available next week.'
        : 'No workout data yet. Start logging to track progress!',
    };
  }

  // If only last week has data (no two-weeks-ago data)
  if (twoWeeksAgo === 0) {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status: 'ok',
      weeklyVolumes,
      trend: 100,
      message: 'Great start! One more completed week needed for comparison.',
    };
  }

  // If only two weeks ago has data (nothing last week)
  if (lastWeek === 0) {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status: 'warning',
      weeklyVolumes,
      trend: -100,
      message: currentWeek > 0
        ? 'Missed last week, but you\'re back this week!'
        : 'No workout last week. Time to get back on track!',
    };
  }

  // Calculate percentage change between two completed weeks
  const trend = calculatePercentageChange(twoWeeksAgo, lastWeek);

  // Determine status based on thresholds
  let status: 'ok' | 'warning' | 'plateau';
  let message: string;

  if (trend >= GROWTH_THRESHOLD) {
    status = 'ok';
    message = `Volume up ${trend.toFixed(1)}% last week. Keep up the great work!`;
  } else if (trend > -GROWTH_THRESHOLD) {
    status = 'warning';
    message = `Volume stagnant (${trend.toFixed(1)}%) last week. Consider increasing weight or reps.`;
  } else {
    status = 'plateau';
    message = `Volume down ${Math.abs(trend).toFixed(1)}% last week. Consider deload or program change.`;
  }

  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    status,
    weeklyVolumes,
    trend,
    message,
  };
}

/**
 * Analyze all exercises for plateau status
 */
export function analyzeAllExercises(
  workouts: Workout[],
  exercises: Exercise[]
): PlateauAnalysis[] {
  return exercises.map(exercise => detectPlateau(workouts, exercise));
}

/**
 * Get exercises that have warning or plateau status
 */
export function getProblematicExercises(
  workouts: Workout[],
  exercises: Exercise[]
): PlateauAnalysis[] {
  const analyses = analyzeAllExercises(workouts, exercises);
  return analyses.filter(a => a.status === 'warning' || a.status === 'plateau');
}

/**
 * Get summary statistics for the dashboard
 */
export function getPlateauSummary(
  workouts: Workout[],
  exercises: Exercise[]
): { ok: number; warning: number; plateau: number } {
  const analyses = analyzeAllExercises(workouts, exercises);
  return {
    ok: analyses.filter(a => a.status === 'ok').length,
    warning: analyses.filter(a => a.status === 'warning').length,
    plateau: analyses.filter(a => a.status === 'plateau').length,
  };
}
