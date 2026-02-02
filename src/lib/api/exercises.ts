import { createClient } from '@/lib/supabase/client';
import { Exercise, DbExercise, PRESET_EXERCISES } from '@/types';
import { generateId } from '@/lib/plateau/helpers';

// Transform database exercise to app exercise
function toExercise(dbExercise: DbExercise): Exercise {
  return {
    id: dbExercise.id,
    name: dbExercise.name,
    muscleGroup: dbExercise.muscle_group,
  };
}

/**
 * Get all exercises for the current user
 */
export async function getExercises(): Promise<Exercise[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('muscle_group')
    .order('name');

  if (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }

  return (data || []).map(toExercise);
}

/**
 * Add a new exercise
 */
export async function addExercise(
  name: string,
  muscleGroup: string
): Promise<Exercise> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('exercises')
    .insert({
      user_id: user.id,
      name,
      muscle_group: muscleGroup,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding exercise:', error);
    throw error;
  }

  return toExercise(data);
}

/**
 * Update an existing exercise
 */
export async function updateExercise(exercise: Exercise): Promise<Exercise> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('exercises')
    .update({
      name: exercise.name,
      muscle_group: exercise.muscleGroup,
      updated_at: new Date().toISOString(),
    })
    .eq('id', exercise.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }

  return toExercise(data);
}

/**
 * Delete an exercise
 */
export async function deleteExercise(exerciseId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', exerciseId);

  if (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
}

/**
 * Initialize preset exercises for a new user
 */
export async function initializePresetExercises(): Promise<Exercise[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if user already has exercises
  const { data: existing } = await supabase
    .from('exercises')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    // User already has exercises, return them
    return getExercises();
  }

  // Insert all preset exercises
  const exercisesToInsert = PRESET_EXERCISES.map(exercise => ({
    user_id: user.id,
    name: exercise.name,
    muscle_group: exercise.muscleGroup,
  }));

  const { data, error } = await supabase
    .from('exercises')
    .insert(exercisesToInsert)
    .select();

  if (error) {
    console.error('Error initializing preset exercises:', error);
    throw error;
  }

  return (data || []).map(toExercise);
}
