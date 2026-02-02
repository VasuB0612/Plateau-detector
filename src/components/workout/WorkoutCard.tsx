import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Workout, Exercise } from '@/types';
import { formatDate } from '@/lib/plateau/helpers';

interface WorkoutCardProps {
  workout: Workout;
  exercise?: Exercise;
  onDelete?: () => void;
}

export function WorkoutCard({ workout, exercise, onDelete }: WorkoutCardProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground)]">
              {exercise?.name || 'Unknown Exercise'}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1">{formatDate(workout.date)}</p>
          </div>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sets */}
        <div className="space-y-2">
          {workout.sets.map((set, index) => (
            <div key={set.id} className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-[var(--muted)] w-8">
                S{index + 1}
              </span>
              <Chip size="sm">{set.weight} kg</Chip>
              <Chip size="sm">{set.reps} reps</Chip>
              <Chip size="sm">RPE {set.rpe}</Chip>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <p className="text-sm font-medium text-[var(--primary)]">
            Total: {workout.totalVolume.toFixed(0)} kg
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
