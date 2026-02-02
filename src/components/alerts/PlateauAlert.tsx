'use client';

import React from 'react';
import Link from 'next/link';
import { PlateauAnalysis } from '@/types';
import { cn } from '@/lib/utils';

interface PlateauAlertProps {
  analysis: PlateauAnalysis;
}

const STATUS_CONFIG = {
  ok: {
    borderColor: 'border-[var(--ok)]',
    textColor: 'text-[var(--ok)]',
    label: 'OK',
    progressColor: 'bg-[var(--ok)]',
  },
  warning: {
    borderColor: 'border-[var(--warning)]',
    textColor: 'text-[var(--warning)]',
    label: 'WARN',
    progressColor: 'bg-[var(--warning)]',
  },
  plateau: {
    borderColor: 'border-[var(--danger)]',
    textColor: 'text-[var(--danger)]',
    label: 'PLATEAU',
    progressColor: 'bg-[var(--danger)]',
  },
};

export function PlateauAlert({ analysis }: PlateauAlertProps) {
  const config = STATUS_CONFIG[analysis.status];
  const [previousWeek, currentWeek] = analysis.weeklyVolumes;

  const maxVolume = Math.max(previousWeek, currentWeek, 1);
  const previousProgress = (previousWeek / maxVolume) * 100;
  const currentProgress = (currentWeek / maxVolume) * 100;

  return (
    <Link href={`/history?exercise=${analysis.exerciseId}`}>
      <div
        className={cn(
          'mb-4 p-4 cursor-pointer',
          'bg-[var(--card-bg)] border-l-4',
          'hover:bg-[var(--background-secondary)] transition-colors',
          config.borderColor
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[var(--foreground)]">
            {analysis.exerciseName}
          </h3>
          <span className={cn('text-xs font-medium', config.textColor)}>
            {config.label}
          </span>
        </div>

        {/* Message */}
        <p className="text-xs text-[var(--muted)] mb-4">
          {analysis.message}
        </p>

        {/* Volume comparison */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--muted)] w-16">Last week</span>
            <div className="flex-1 h-2 bg-[var(--background)] overflow-hidden">
              <div
                className="h-full bg-[var(--muted)] transition-all"
                style={{ width: `${previousProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--foreground)] w-16 text-right">
              {previousWeek.toFixed(0)} kg
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[var(--muted)] w-16">This week</span>
            <div className="flex-1 h-2 bg-[var(--background)] overflow-hidden">
              <div
                className={cn('h-full transition-all', config.progressColor)}
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--foreground)] w-16 text-right">
              {currentWeek.toFixed(0)} kg
            </span>
          </div>
        </div>

        {/* Trend */}
        {analysis.trend !== 0 && previousWeek > 0 && currentWeek > 0 && (
          <p
            className={cn(
              'mt-3 text-xs text-right',
              analysis.trend > 0 ? 'text-[var(--ok)]' : 'text-[var(--danger)]'
            )}
          >
            {analysis.trend > 0 ? '+' : ''}{analysis.trend.toFixed(1)}%
          </p>
        )}
      </div>
    </Link>
  );
}
