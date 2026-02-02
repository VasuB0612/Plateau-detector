// Exercise definition
export interface Exercise {
  id: string;
  name: string;           // e.g., "Bench Press"
  muscleGroup: string;    // e.g., "Chest"
}

// Individual set
export interface WorkingSet {
  id: string;
  weight: number;         // in kg or lbs
  reps: number;
  rpe: number;            // 1-10 scale
  volume: number;         // weight × reps (calculated)
}

// Single workout session
export interface Workout {
  id: string;
  date: string;           // ISO date
  exerciseId: string;
  sets: WorkingSet[];
  totalVolume: number;    // sum of all set volumes
}

// Plateau analysis result
export interface PlateauAnalysis {
  exerciseId: string;
  exerciseName: string;
  status: 'ok' | 'warning' | 'plateau';
  weeklyVolumes: number[];  // last 2 weeks
  trend: number;            // percentage change
  message: string;
}

// Preset exercises data
export const PRESET_EXERCISES: Omit<Exercise, 'id'>[] = [
  { name: 'Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Bench Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Flyes', muscleGroup: 'Chest' },
  { name: 'Squat', muscleGroup: 'Legs' },
  { name: 'Leg Press', muscleGroup: 'Legs' },
  { name: 'Leg Curl', muscleGroup: 'Legs' },
  { name: 'Leg Extension', muscleGroup: 'Legs' },
  { name: 'Deadlift', muscleGroup: 'Back' },
  { name: 'Barbell Row', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Pull-ups', muscleGroup: 'Back' },
  { name: 'Overhead Press', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raises', muscleGroup: 'Shoulders' },
  { name: 'Bicep Curls', muscleGroup: 'Arms' },
  { name: 'Tricep Pushdown', muscleGroup: 'Arms' },
  { name: 'Skull Crushers', muscleGroup: 'Arms' },
];

// Database types (for Supabase)
export interface DbExercise {
  id: string;
  user_id: string;
  name: string;
  muscle_group: string;
  created_at: string;
  updated_at: string;
}

export interface DbWorkout {
  id: string;
  user_id: string;
  exercise_id: string;
  date: string;
  total_volume: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSet {
  id: string;
  workout_id: string;
  weight: number;
  reps: number;
  rpe: number;
  volume: number;
  set_order: number;
  created_at: string;
}

// Muscle groups constant
export const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Other',
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];
