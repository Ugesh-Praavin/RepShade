import { create } from 'zustand';
import { PREDEFINED_SPLITS, PredefinedWorkout, PredefinedWorkoutExercise } from '../constants/predefinedSplits';
import { SYSTEM_EXERCISES } from '../constants/defaultExercises';
import { exerciseRepository } from '../repositories/exerciseRepository';
import { splitRepository } from '../repositories/splitRepository';
import { generateUUID } from '../utils/uuid';

export interface OnboardingWorkoutExercise extends PredefinedWorkoutExercise {
  id?: string;
}

export interface OnboardingWorkout {
  id: string;
  name: string;
  description: string;
  exercises: OnboardingWorkoutExercise[];
}

export interface OnboardingStoreState {
  selectedSplitType: 'ppl' | 'upper_lower' | 'full_body' | 'custom';
  splitName: string;
  splitDescription: string;
  workouts: OnboardingWorkout[];
  isLoading: boolean;
  error: string | null;

  // Actions
  selectSplitType: (type: 'ppl' | 'upper_lower' | 'full_body' | 'custom') => void;
  setSplitName: (name: string) => void;
  addWorkout: (name: string) => void;
  deleteWorkout: (workoutId: string) => void;
  renameWorkout: (workoutId: string, name: string) => void;
  addExerciseToWorkout: (workoutId: string, exercise: {
    exerciseId: string;
    name: string;
    primaryMuscle: string;
  }) => void;
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => void;
  updateExerciseConfig: (
    workoutId: string,
    exerciseId: string,
    config: Partial<{
      targetSets: number;
      targetRepMin: number;
      targetRepMax: number;
      restSeconds: number;
    }>
  ) => void;
  completeOnboarding: (userId?: string) => Promise<string>;
}

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  selectedSplitType: 'ppl',
  splitName: PREDEFINED_SPLITS.ppl.name,
  splitDescription: PREDEFINED_SPLITS.ppl.description,
  workouts: PREDEFINED_SPLITS.ppl.workouts.map((w) => ({
    id: generateUUID(),
    name: w.name,
    description: w.description,
    exercises: w.exercises.map((e) => ({ ...e, id: generateUUID() })),
  })),
  isLoading: false,
  error: null,

  selectSplitType: (type) => {
    if (type === 'custom') {
      set({
        selectedSplitType: 'custom',
        splitName: 'Custom Split',
        splitDescription: 'My personalized training program',
        workouts: [
          {
            id: generateUUID(),
            name: 'Workout 1',
            description: 'Custom Workout',
            exercises: [],
          },
        ],
      });
      return;
    }

    const template = PREDEFINED_SPLITS[type];
    set({
      selectedSplitType: type,
      splitName: template.name,
      splitDescription: template.description,
      workouts: template.workouts.map((w) => ({
        id: generateUUID(),
        name: w.name,
        description: w.description,
        exercises: w.exercises.map((e) => ({ ...e, id: generateUUID() })),
      })),
    });
  },

  setSplitName: (name) => set({ splitName: name }),

  addWorkout: (name) => {
    const { workouts } = get();
    set({
      workouts: [
        ...workouts,
        {
          id: generateUUID(),
          name: name || `Workout ${workouts.length + 1}`,
          description: '',
          exercises: [],
        },
      ],
    });
  },

  deleteWorkout: (workoutId) => {
    const { workouts } = get();
    if (workouts.length <= 1) return; // Keep at least 1 workout
    set({
      workouts: workouts.filter((w) => w.id !== workoutId),
    });
  },

  renameWorkout: (workoutId, name) => {
    const { workouts } = get();
    set({
      workouts: workouts.map((w) => (w.id === workoutId ? { ...w, name } : w)),
    });
  },

  addExerciseToWorkout: (workoutId, exercise) => {
    const { workouts } = get();
    set({
      workouts: workouts.map((w) => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          exercises: [
            ...w.exercises,
            {
              id: generateUUID(),
              exerciseId: exercise.exerciseId,
              name: exercise.name,
              primaryMuscle: exercise.primaryMuscle,
              targetSets: 3,
              targetRepMin: 8,
              targetRepMax: 12,
              restSeconds: 90,
            },
          ],
        };
      }),
    });
  },

  removeExerciseFromWorkout: (workoutId, exerciseId) => {
    const { workouts } = get();
    set({
      workouts: workouts.map((w) => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          exercises: w.exercises.filter((e) => e.exerciseId !== exerciseId),
        };
      }),
    });
  },

  updateExerciseConfig: (workoutId, exerciseId, config) => {
    const { workouts } = get();
    set({
      workouts: workouts.map((w) => {
        if (w.id !== workoutId) return w;
        return {
          ...w,
          exercises: w.exercises.map((e) =>
            e.exerciseId === exerciseId ? { ...e, ...config } : e
          ),
        };
      }),
    });
  },

  completeOnboarding: async (userId: string = 'local_user') => {
    set({ isLoading: true, error: null });
    const { splitName, splitDescription, workouts } = get();

    try {
      // Ensure system exercises are present in SQLite DB before FK checks
      await exerciseRepository.seedSystemExercises(SYSTEM_EXERCISES);

      const splitId = await splitRepository.createSplitWithWorkouts(
        userId,
        splitName,
        splitDescription,
        workouts.map((w) => ({
          name: w.name,
          description: w.description,
          exercises: w.exercises.map((e) => ({
            exerciseId: e.exerciseId,
            targetSets: e.targetSets,
            targetRepMin: e.targetRepMin,
            targetRepMax: e.targetRepMax,
            restSeconds: e.restSeconds,
          })),
        }))
      );
      set({ isLoading: false });
      return splitId;
    } catch (err: any) {
      set({ error: err?.message || 'Failed to save onboarding split', isLoading: false });
      throw err;
    }
  },
}));
