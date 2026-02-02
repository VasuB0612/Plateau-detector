import { createClient } from '@/lib/supabase/client';
import { Workout, WorkingSet, DbWorkout, DbSet } from '@/types';
import { calculateSetVolume, calculateTotalVolume, getTodayISO, generateId } from '@/lib/plateau/helpers';

// Transform database workout + sets to app workout
function toWorkout(dbWorkout: DbWorkout, dbSets: DbSet[]): Workout {
  const sets: WorkingSet[] = dbSets
    .sort((a, b) => a.set_order - b.set_order)
    .map(s => ({
      id: s.id,
      weight: Number(s.weight),
      reps: s.reps,
      rpe: s.rpe,
      volume: Number(s.volume),
    }));

  return {
    id: dbWorkout.id,
    date: dbWorkout.date,
    exerciseId: dbWorkout.exercise_id,
    sets,
    totalVolume: Number(dbWorkout.total_volume),
  };
}

/**
 * Get all workouts for the current user
 */
export async function getWorkouts(): Promise<Workout[]> {
  const supabase = createClient();

  // Get workouts
  const { data: workoutsData, error: workoutsError } = await supabase
    .from('workouts')
    .select('*')
    .order('date', { ascending: false });

  if (workoutsError) {
    console.error('Error fetching workouts:', workoutsError);
    throw workoutsError;
  }

  if (!workoutsData || workoutsData.length === 0) {
    return [];
  }

  // Get all sets for these workouts
  const workoutIds = workoutsData.map(w => w.id);
  const { data: setsData, error: setsError } = await supabase
    .from('sets')
    .select('*')
    .in('workout_id', workoutIds);

  if (setsError) {
    console.error('Error fetching sets:', setsError);
    throw setsError;
  }

  // Group sets by workout_id
  const setsByWorkout: Record<string, DbSet[]> = {};
  (setsData || []).forEach(set => {
    if (!setsByWorkout[set.workout_id]) {
      setsByWorkout[set.workout_id] = [];
    }
    setsByWorkout[set.workout_id].push(set);
  });

  // Transform to app format
  return workoutsData.map(workout =>
    toWorkout(workout, setsByWorkout[workout.id] || [])
  );
}

/**
 * Get workouts for a specific exercise
 */
export async function getWorkoutsForExercise(exerciseId: string): Promise<Workout[]> {
  const supabase = createClient();

  const { data: workoutsData, error: workoutsError } = await supabase
    .from('workouts')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('date', { ascending: false });

  if (workoutsError) {
    console.error('Error fetching workouts:', workoutsError);
    throw workoutsError;
  }

  if (!workoutsData || workoutsData.length === 0) {
    return [];
  }

  // Get all sets for these workouts
  const workoutIds = workoutsData.map(w => w.id);
  const { data: setsData, error: setsError } = await supabase
    .from('sets')
    .select('*')
    .in('workout_id', workoutIds);

  if (setsError) {
    console.error('Error fetching sets:', setsError);
    throw setsError;
  }

  // Group sets by workout_id
  const setsByWorkout: Record<string, DbSet[]> = {};
  (setsData || []).forEach(set => {
    if (!setsByWorkout[set.workout_id]) {
      setsByWorkout[set.workout_id] = [];
    }
    setsByWorkout[set.workout_id].push(set);
  });

  return workoutsData.map(workout =>
    toWorkout(workout, setsByWorkout[workout.id] || [])
  );
}

/**
 * Add a new workout with sets
 */
export async function addWorkout(
  exerciseId: string,
  sets: Omit<WorkingSet, 'id' | 'volume'>[]
): Promise<Workout> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Calculate volumes
  const setsWithVolume: WorkingSet[] = sets.map((set, index) => ({
    ...set,
    id: generateId(),
    volume: calculateSetVolume(set.weight, set.reps),
  }));

  const totalVolume = calculateTotalVolume(setsWithVolume);

  // Create workout
  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      exercise_id: exerciseId,
      date: getTodayISO(),
      total_volume: totalVolume,
    })
    .select()
    .single();

  if (workoutError) {
    console.error('Error creating workout:', workoutError);
    throw workoutError;
  }

  // Create sets
  const setsToInsert = setsWithVolume.map((set, index) => ({
    workout_id: workoutData.id,
    weight: set.weight,
    reps: set.reps,
    rpe: set.rpe,
    volume: set.volume,
    set_order: index,
  }));

  const { data: setsData, error: setsError } = await supabase
    .from('sets')
    .insert(setsToInsert)
    .select();

  if (setsError) {
    console.error('Error creating sets:', setsError);
    // Try to clean up the workout
    await supabase.from('workouts').delete().eq('id', workoutData.id);
    throw setsError;
  }

  return toWorkout(workoutData, setsData || []);
}

/**
 * Delete a workout and its sets
 */
export async function deleteWorkout(workoutId: string): Promise<void> {
  const supabase = createClient();

  // Sets will be deleted automatically due to CASCADE
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId);

  if (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
}
