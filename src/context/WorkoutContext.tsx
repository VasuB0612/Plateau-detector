'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { Exercise, Workout, WorkingSet, PlateauAnalysis } from '@/types';
import * as exercisesApi from '@/lib/api/exercises';
import * as workoutsApi from '@/lib/api/workouts';
import { analyzeAllExercises } from '@/lib/plateau/detector';
import { useAuth } from './AuthContext';

// State shape
interface WorkoutState {
  exercises: Exercise[];
  workouts: Workout[];
  plateauAnalyses: PlateauAnalysis[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type WorkoutAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EXERCISES'; payload: Exercise[] }
  | { type: 'SET_WORKOUTS'; payload: Workout[] }
  | { type: 'ADD_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_EXERCISE'; payload: Exercise }
  | { type: 'DELETE_EXERCISE'; payload: string }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'UPDATE_ANALYSES'; payload: PlateauAnalysis[] }
  | { type: 'RESET' };

// Initial state
const initialState: WorkoutState = {
  exercises: [],
  workouts: [],
  plateauAnalyses: [],
  isLoading: true,
  error: null,
};

// Reducer
function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload };
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload };
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, action.payload] };
    case 'UPDATE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.map(e =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter(e => e.id !== action.payload),
      };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(w => w.id !== action.payload),
      };
    case 'UPDATE_ANALYSES':
      return { ...state, plateauAnalyses: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Context type
interface WorkoutContextType {
  state: WorkoutState;
  addExercise: (name: string, muscleGroup: string) => Promise<void>;
  updateExercise: (exercise: Exercise) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  addWorkout: (exerciseId: string, sets: Omit<WorkingSet, 'id' | 'volume'>[]) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  getExerciseById: (id: string) => Exercise | undefined;
  getWorkoutsForExercise: (exerciseId: string) => Workout[];
  getAnalysisForExercise: (exerciseId: string) => PlateauAnalysis | undefined;
}

// Create context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider component
interface WorkoutProviderProps {
  children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const { user, isLoading: authLoading } = useAuth();

  // Initialize data when user changes
  const initializeData = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'RESET' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Initialize preset exercises if this is a new user
      const exercises = await exercisesApi.initializePresetExercises();
      const workouts = await workoutsApi.getWorkouts();

      dispatch({ type: 'SET_EXERCISES', payload: exercises });
      dispatch({ type: 'SET_WORKOUTS', payload: workouts });
    } catch (error) {
      console.error('Error initializing data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      initializeData();
    }
  }, [authLoading, initializeData]);

  // Update analyses when exercises or workouts change
  useEffect(() => {
    if (!state.isLoading && state.exercises.length > 0) {
      const analyses = analyzeAllExercises(state.workouts, state.exercises);
      dispatch({ type: 'UPDATE_ANALYSES', payload: analyses });
    }
  }, [state.exercises, state.workouts, state.isLoading]);

  const refreshData = async () => {
    await initializeData();
  };

  const addExercise = async (name: string, muscleGroup: string) => {
    try {
      const newExercise = await exercisesApi.addExercise(name, muscleGroup);
      dispatch({ type: 'ADD_EXERCISE', payload: newExercise });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add exercise' });
      throw error;
    }
  };

  const updateExercise = async (exercise: Exercise) => {
    try {
      const updated = await exercisesApi.updateExercise(exercise);
      dispatch({ type: 'UPDATE_EXERCISE', payload: updated });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update exercise' });
      throw error;
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      await exercisesApi.deleteExercise(exerciseId);
      dispatch({ type: 'DELETE_EXERCISE', payload: exerciseId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete exercise' });
      throw error;
    }
  };

  const addWorkout = async (
    exerciseId: string,
    sets: Omit<WorkingSet, 'id' | 'volume'>[]
  ) => {
    try {
      const newWorkout = await workoutsApi.addWorkout(exerciseId, sets);
      dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add workout' });
      throw error;
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      await workoutsApi.deleteWorkout(workoutId);
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete workout' });
      throw error;
    }
  };

  const getExerciseById = (id: string): Exercise | undefined => {
    return state.exercises.find(e => e.id === id);
  };

  const getWorkoutsForExercise = (exerciseId: string): Workout[] => {
    return state.workouts
      .filter(w => w.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAnalysisForExercise = (exerciseId: string): PlateauAnalysis | undefined => {
    return state.plateauAnalyses.find(a => a.exerciseId === exerciseId);
  };

  const value: WorkoutContextType = {
    state,
    addExercise,
    updateExercise,
    deleteExercise,
    addWorkout,
    deleteWorkout,
    refreshData,
    getExerciseById,
    getWorkoutsForExercise,
    getAnalysisForExercise,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Custom hook to use the context
export function useWorkout(): WorkoutContextType {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
