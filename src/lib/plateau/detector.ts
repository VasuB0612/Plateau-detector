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
  const weeklyVolumes = getWeeklyVolumes(workouts, exercise.id, 2);
  const [previousWeek, currentWeek] = weeklyVolumes;

  // If no data for either week, return OK with message
  if (previousWeek === 0 && currentWeek === 0) {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status: 'ok',
      weeklyVolumes,
      trend: 0,
      message: 'No workout data yet. Start logging to track progress!',
    };
  }

  // If only current week has data
  if (previousWeek === 0) {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status: 'ok',
      weeklyVolumes,
      trend: 100,
      message: 'Great start! Keep logging to track your progress.',
    };
  }

  // If only previous week has data (no recent workout)
  if (currentWeek === 0) {
    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status: 'warning',
      weeklyVolumes,
      trend: -100,
      message: 'No workout this week yet. Time to train!',
    };
  }

  // Calculate percentage change
  const trend = calculatePercentageChange(previousWeek, currentWeek);

  // Determine status based on thresholds
  let status: 'ok' | 'warning' | 'plateau';
  let message: string;

  if (trend >= GROWTH_THRESHOLD) {
    status = 'ok';
    message = `Volume up ${trend.toFixed(1)}%. Keep up the great work!`;
  } else if (trend > -GROWTH_THRESHOLD) {
    status = 'warning';
    message = `Volume stagnant (${trend.toFixed(1)}%). Consider increasing weight or reps.`;
  } else {
    status = 'plateau';
    message = `Volume down ${Math.abs(trend).toFixed(1)}%. Consider deload or program change.`;
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
