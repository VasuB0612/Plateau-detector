'use client';

import React, { useState, useMemo } from 'react';
import { Search, Dumbbell, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Exercise } from '@/types';
import { cn } from '@/lib/utils';

interface ExercisePickerProps {
  exercises: Exercise[];
  selectedExercise?: Exercise;
  onSelect: (exercise: Exercise) => void;
}

export function ExercisePicker({
  exercises,
  selectedExercise,
  onSelect,
}: ExercisePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter(
      e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [exercises, searchQuery]);

  const groupedExercises = useMemo(() => {
    return filteredExercises.reduce<Record<string, Exercise[]>>(
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
  }, [filteredExercises]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full justify-start text-left"
        icon={<Dumbbell className="w-4 h-4" />}
      >
        {selectedExercise ? selectedExercise.name : 'Select Exercise'}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery('');
        }}
        title="Select Exercise"
        className="max-w-md"
      >
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>

        {/* Exercise list */}
        <div className="max-h-80 overflow-y-auto -mx-4 px-4">
          {Object.entries(groupedExercises).map(([group, groupExercises]) => (
            <div key={group} className="mb-4">
              <h4 className="text-xs text-[var(--muted)] uppercase tracking-wider bg-[var(--background-secondary)] px-3 py-2 -mx-4">
                {group}
              </h4>
              {groupExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 text-left',
                    'border-b border-[var(--border)]',
                    selectedExercise?.id === exercise.id
                      ? 'bg-[var(--primary)] text-[var(--background)]'
                      : 'hover:bg-[var(--background-secondary)]'
                  )}
                >
                  <span className="text-sm">{exercise.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <p className="text-center text-[var(--muted)] py-8 text-sm">
              No exercises found
            </p>
          )}
        </div>

        {/* Cancel button */}
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
