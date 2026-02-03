import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Loader2, ChevronDown } from "lucide-react";
import { Navigation } from "@/components/layout/Navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { WorkoutCard } from "@/components/workout/WorkoutCard";
import { useWorkout } from "@/context/WorkoutContext";
import { Workout } from "@/types";
import { cn } from "@/lib/utils";

export default function HistoryPageContent() {
  const searchParams = useSearchParams();
  const initialExerciseId = searchParams.get("exercise");

  const { state, deleteWorkout, getExerciseById } = useWorkout();
  const [filterExerciseId, setFilterExerciseId] = useState<string | null>(
    initialExerciseId,
  );
  const [showFilter, setShowFilter] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

  const sortedWorkouts = useMemo(() => {
    let workouts = [...state.workouts];

    if (filterExerciseId) {
      workouts = workouts.filter((w) => w.exerciseId === filterExerciseId);
    }

    return workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [state.workouts, filterExerciseId]);

  const exercisesWithWorkouts = useMemo(() => {
    const exerciseIds = new Set(state.workouts.map((w) => w.exerciseId));
    return state.exercises.filter((e) => exerciseIds.has(e.id));
  }, [state.exercises, state.workouts]);

  const selectedExercise = filterExerciseId
    ? getExerciseById(filterExerciseId)
    : null;

  const handleDelete = (workout: Workout) => {
    setWorkoutToDelete(workout);
  };

  const confirmDelete = () => {
    if (workoutToDelete) {
      deleteWorkout(workoutToDelete.id);
      setWorkoutToDelete(null);
    }
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
        {/* Filter section */}
        <div className="bg-[var(--card-bg)] border-b border-[var(--border)] p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 w-full md:w-auto",
                  "text-sm text-[var(--foreground)]",
                  "border border-[var(--border)]",
                  "hover:border-[var(--primary)] transition-colors",
                )}
              >
                <Filter className="w-4 h-4" />
                <span>
                  {selectedExercise ? selectedExercise.name : "All Exercises"}
                </span>
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>

              {/* Dropdown */}
              {showFilter && (
                <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-[var(--card-bg)] border border-[var(--border)] z-10 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setFilterExerciseId(null);
                      setShowFilter(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm border-b border-[var(--border)]",
                      !filterExerciseId
                        ? "bg-[var(--primary)] text-[var(--background)]"
                        : "hover:bg-[var(--background-secondary)] text-[var(--foreground)]",
                    )}
                  >
                    All Exercises
                  </button>
                  {exercisesWithWorkouts.map((exercise) => (
                    <button
                      key={exercise.id}
                      onClick={() => {
                        setFilterExerciseId(exercise.id);
                        setShowFilter(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm border-b border-[var(--border)]",
                        filterExerciseId === exercise.id
                          ? "bg-[var(--primary)] text-[var(--background)]"
                          : "hover:bg-[var(--background-secondary)] text-[var(--foreground)]",
                      )}
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          <h1 className="text-lg font-medium text-[var(--foreground)] mb-4">
            History
          </h1>

          {sortedWorkouts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">
                  No workouts yet
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  Start logging workouts to see your history.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-sm text-[var(--muted)] mb-4">
                {sortedWorkouts.length} workout
                {sortedWorkouts.length !== 1 ? "s" : ""} found
              </p>
              {sortedWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  exercise={getExerciseById(workout.exerciseId)}
                  onDelete={() => handleDelete(workout)}
                />
              ))}
            </>
          )}
        </div>
      </main>

      {/* Click outside to close filter */}
      {showFilter && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowFilter(false)}
        />
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!workoutToDelete}
        onClose={() => setWorkoutToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Workout"
        message="Are you sure you want to delete this workout? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
