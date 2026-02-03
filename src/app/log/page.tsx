'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SetInput } from '@/components/workout/SetInput';
import { ExercisePicker } from '@/components/workout/ExercisePicker';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useWorkout } from '@/context/WorkoutContext';
import { Exercise } from '@/types';

interface SetData {
  weight: string;
  reps: string;
  rpe: string;
}

const createEmptySet = (): SetData => ({
  weight: '',
  reps: '',
  rpe: '7',
});

export default function LogWorkoutPage() {
  const router = useRouter();
  const { state, addWorkout } = useWorkout();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | undefined>();
  const [sets, setSets] = useState<SetData[]>([createEmptySet()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAddSet = () => {
    setSets([...sets, createEmptySet()]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const handleSetChange = (
    index: number,
    field: keyof SetData,
    value: string
  ) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const validateSets = (): string | null => {
    for (let i = 0; i < sets.length; i++) {
      const set = sets[i];
      const weight = parseFloat(set.weight);
      const reps = parseInt(set.reps);
      const rpe = parseInt(set.rpe);

      if (isNaN(weight) || weight <= 0) {
        return `Set ${i + 1}: Enter valid weight`;
      }

      if (isNaN(reps) || reps <= 0) {
        return `Set ${i + 1}: Enter valid reps`;
      }

      if (isNaN(rpe) || rpe < 1 || rpe > 10) {
        return `Set ${i + 1}: RPE must be 1-10`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    setError(null);

    if (!selectedExercise) {
      setError('Select an exercise first');
      return;
    }

    const validationError = validateSets();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const setsToSave = sets.map(set => ({
        weight: parseFloat(set.weight),
        reps: parseInt(set.reps),
        rpe: parseInt(set.rpe),
      }));

      await addWorkout(selectedExercise.id, setsToSave);
      setShowSuccessModal(true);
    } catch (err) {
      setError('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalVolume = sets.reduce((sum, set) => {
    const weight = parseFloat(set.weight) || 0;
    const reps = parseInt(set.reps) || 0;
    return sum + weight * reps;
  }, 0);

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    router.push('/');
  };

  const handleLogAnother = () => {
    setShowSuccessModal(false);
    setSelectedExercise(undefined);
    setSets([createEmptySet()]);
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <Navigation />
        <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mx-auto mb-4" />
              <p className="text-[var(--muted)] text-sm">Loading...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          <h1 className="text-lg font-medium text-[var(--foreground)] mb-6">
            Log Workout
          </h1>

          {/* Exercise picker */}
          <div className="mb-6">
            <label className="block text-[11px] font-medium text-[var(--muted)] mb-2 uppercase tracking-wider">
              Exercise
            </label>
            <ExercisePicker
              exercises={state.exercises}
              selectedExercise={selectedExercise}
              onSelect={setSelectedExercise}
            />
          </div>

          {/* Sets section */}
          <div className="mb-6">
            <h2 className="text-sm text-[var(--muted)] mb-3">
              Sets
            </h2>
            {sets.map((set, index) => (
              <SetInput
                key={index}
                index={index}
                weight={set.weight}
                reps={set.reps}
                rpe={set.rpe}
                onWeightChange={(value) => handleSetChange(index, 'weight', value)}
                onRepsChange={(value) => handleSetChange(index, 'reps', value)}
                onRpeChange={(value) => handleSetChange(index, 'rpe', value)}
                onRemove={() => handleRemoveSet(index)}
                showRemove={sets.length > 1}
              />
            ))}

            <Button
              variant="outline"
              onClick={handleAddSet}
              className="w-full"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Set
            </Button>
          </div>

          {/* Total volume */}
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">Total Volume</span>
              <span className="text-lg font-medium text-[var(--primary)]">
                {totalVolume.toFixed(0)} kg
              </span>
            </CardContent>
          </Card>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 border border-[var(--danger)] text-[var(--danger)] text-sm">
              {error}
            </div>
          )}

          {/* Save button */}
          <Button
            onClick={handleSave}
            loading={saving}
            className="w-full"
            size="lg"
          >
            Save Workout
          </Button>
        </div>
      </main>

      {/* Success modal */}
      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleLogAnother}
        onConfirm={handleGoToDashboard}
        title="Workout Logged!"
        message="Your workout has been saved successfully. Would you like to go to the dashboard?"
        confirmText="Go to Dashboard"
        cancelText="Log Another"
        variant="success"
      />
    </div>
  );
}
