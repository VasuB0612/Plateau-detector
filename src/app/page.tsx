'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, AlertTriangle, Loader2, Info } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PlateauAlert } from '@/components/alerts/PlateauAlert';
import { useWorkout } from '@/context/WorkoutContext';
import { getPlateauSummary } from '@/lib/plateau/detector';

const RPE_STORAGE_KEY = 'plateau-rpe-explained';

export default function DashboardPage() {
  const { state, refreshData } = useWorkout();
  const [refreshing, setRefreshing] = useState(false);
  const [showRpeModal, setShowRpeModal] = useState(false);

  useEffect(() => {
    const hasSeenRpeExplanation = localStorage.getItem(RPE_STORAGE_KEY);
    if (!hasSeenRpeExplanation && !state.isLoading) {
      setShowRpeModal(true);
    }
  }, [state.isLoading]);

  const handleCloseRpeModal = () => {
    localStorage.setItem(RPE_STORAGE_KEY, 'true');
    setShowRpeModal(false);
  };

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

      {/* RPE Explanation Modal for first-time users */}
      <Modal
        isOpen={showRpeModal}
        onClose={handleCloseRpeModal}
        title="What is RPE?"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[var(--foreground)]">
              <strong>RPE (Rate of Perceived Exertion)</strong> is a scale from 1-10 that measures how hard a set felt, based on how many reps you had left in reserve.
            </p>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] p-4">
            <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-3">
              RPE Scale
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">RPE 10</span>
                <span className="text-[var(--foreground)]">Maximum effort, no reps left</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">RPE 9</span>
                <span className="text-[var(--foreground)]">Very hard, 1 rep in reserve</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">RPE 8</span>
                <span className="text-[var(--foreground)]">Hard, 2 reps in reserve</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">RPE 7</span>
                <span className="text-[var(--foreground)]">Moderate, 3 reps in reserve</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">RPE 6</span>
                <span className="text-[var(--foreground)]">Light, 4+ reps in reserve</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--muted)]">
            Most training sets should be around RPE 7-8. This helps you track intensity and avoid overtraining.
          </p>

          <Button onClick={handleCloseRpeModal} className="w-full">
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
