'use client';

import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { PlateauAlert } from '@/components/alerts/PlateauAlert';
import { useWorkout } from '@/context/WorkoutContext';
import { getPlateauSummary } from '@/lib/plateau/detector';

export default function DashboardPage() {
  const { state, refreshData } = useWorkout();
  const [refreshing, setRefreshing] = React.useState(false);

  const summary = getPlateauSummary(state.workouts, state.exercises);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const sortedAnalyses = [...state.plateauAnalyses].sort((a, b) => {
    const order = { plateau: 0, warning: 1, ok: 2 };
    return order[a.status] - order[b.status];
  });

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
            <h1 className="text-lg font-medium text-[var(--foreground)]">
              Dashboard
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Summary card */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <h2 className="text-sm text-[var(--muted)] mb-4">
                Status Overview
              </h2>
              <div className="flex flex-wrap gap-3 justify-around">
                <Chip variant="ok" className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3" />
                  {summary.ok} OK
                </Chip>
                <Chip variant="warning" className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" />
                  {summary.warning} Warn
                </Chip>
                <Chip variant="danger" className="flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" />
                  {summary.plateau} Plateau
                </Chip>
              </div>
            </CardContent>
          </Card>

          {/* Section title */}
          <h2 className="text-sm text-[var(--muted)] mb-4">
            Exercise Status
          </h2>

          {/* Exercise status list */}
          {sortedAnalyses.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">
                  No exercises yet
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  Add exercises and start logging workouts to see your progress.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div>
              {sortedAnalyses.map(analysis => (
                <PlateauAlert key={analysis.exerciseId} analysis={analysis} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
