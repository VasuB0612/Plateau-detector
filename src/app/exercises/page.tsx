'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Dumbbell, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Chip } from '@/components/ui/Chip';
import { useWorkout } from '@/context/WorkoutContext';
import { Exercise, MUSCLE_GROUPS } from '@/types';

export default function ExercisesPage() {
  const { state, addExercise, updateExercise, deleteExercise } = useWorkout();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<string>('Chest');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingExercise(null);
    setName('');
    setMuscleGroup('Chest');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setName(exercise.name);
    setMuscleGroup(exercise.muscleGroup);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingExercise(null);
    setName('');
    setMuscleGroup('Chest');
    setError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Exercise name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (editingExercise) {
        await updateExercise({
          ...editingExercise,
          name: name.trim(),
          muscleGroup,
        });
      } else {
        await addExercise(name.trim(), muscleGroup);
      }

      closeModal();
    } catch (err) {
      setError('Failed to save exercise');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (exercise: Exercise) => {
    if (window.confirm(`Delete "${exercise.name}"? Workouts will remain.`)) {
      deleteExercise(exercise.id);
    }
  };

  const groupedExercises = state.exercises.reduce<Record<string, Exercise[]>>(
    (acc, exercise) => {
      const group = exercise.muscleGroup;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(exercise);
      return acc;
    },
    {}
  );

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
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-medium text-[var(--foreground)]">
                Exercises
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {state.exercises.length} exercise{state.exercises.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={openAddModal} icon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          </div>

          {/* Exercise list */}
          {state.exercises.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Dumbbell className="w-8 h-8 text-[var(--muted)] mx-auto mb-4" />
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">
                  No exercises yet
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  Click Add to create your first exercise.
                </p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedExercises).map(([group, exercises]) => (
              <div key={group} className="mb-6">
                <h2 className="text-xs text-[var(--muted)] uppercase tracking-wider bg-[var(--background-secondary)] px-4 py-2 mb-3">
                  {group}
                </h2>
                {exercises.map(exercise => (
                  <Card key={exercise.id} className="mb-2">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Dumbbell className="w-4 h-4 text-[var(--primary)]" />
                        <div>
                          <h3 className="text-sm font-medium text-[var(--foreground)]">
                            {exercise.name}
                          </h3>
                          <p className="text-xs text-[var(--muted)]">
                            {exercise.muscleGroup}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(exercise)}
                          className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exercise)}
                          className="p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingExercise ? 'Edit Exercise' : 'Add Exercise'}
      >
        <div className="space-y-4">
          <Input
            label="Exercise Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Bench Press"
            autoFocus
          />

          <div>
            <label className="block text-[11px] font-medium text-[var(--muted)] mb-2 uppercase tracking-wider">
              Muscle Group
            </label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map(group => (
                <Chip
                  key={group}
                  selected={muscleGroup === group}
                  onClick={() => setMuscleGroup(group)}
                >
                  {group}
                </Chip>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)]">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
