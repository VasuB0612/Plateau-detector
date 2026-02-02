'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';

interface SetInputProps {
  index: number;
  weight: string;
  reps: string;
  rpe: string;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
  onRpeChange: (value: string) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export function SetInput({
  index,
  weight,
  reps,
  rpe,
  onWeightChange,
  onRepsChange,
  onRpeChange,
  onRemove,
  showRemove,
}: SetInputProps) {
  const volume = (parseFloat(weight) || 0) * (parseFloat(reps) || 0);

  const handleRpeChange = (value: string) => {
    const num = parseInt(value);
    if (value === '' || (num >= 1 && num <= 10)) {
      onRpeChange(value);
    }
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm text-[var(--foreground)]">
            Set {index + 1}
          </h4>
          {showRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="0"
            min="0"
            step="0.5"
          />
          <Input
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => onRepsChange(e.target.value)}
            placeholder="0"
            min="0"
          />
          <Input
            label="RPE"
            type="number"
            value={rpe}
            onChange={(e) => handleRpeChange(e.target.value)}
            placeholder="7"
            min="1"
            max="10"
          />
        </div>

        <p className="mt-3 text-xs text-[var(--muted)]">
          Volume: <span className="text-[var(--primary)]">{volume.toFixed(0)} kg</span>
        </p>
      </CardContent>
    </Card>
  );
}
