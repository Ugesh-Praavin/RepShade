import { create } from 'zustand';
import { splitEngine } from '../domain/split/splitEngine';
import {
  splitRepository,
  SplitRow,
  WorkoutTemplateRow,
  WorkoutExerciseRow,
} from '../repositories/splitRepository';
import { PREDEFINED_SPLITS } from '../constants/predefinedSplits';

export interface WorkoutWithExercises extends WorkoutTemplateRow {
  exercises: WorkoutExerciseRow[];
}

export interface SplitStoreState {
  activeSplit: SplitRow | null;
  workouts: WorkoutWithExercises[];
  nextWorkout: WorkoutWithExercises | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadActiveSplit: (userId?: string) => Promise<void>;
  advanceSplit: () => Promise<void>;
  skipCurrentWorkout: () => Promise<void>;
  resetSplit: () => Promise<void>;
  seedDefaultSplitIfEmpty: (userId?: string) => Promise<void>;

  // Routine Editing Actions
  renameSplit: (name: string) => Promise<void>;
  addWorkout: (name: string) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  renameWorkout: (workoutId: string, name: string) => Promise<void>;
  addExerciseToWorkoutTemplate: (workoutId: string, exerciseId: string) => Promise<void>;
  removeExerciseFromWorkoutTemplate: (workoutExerciseId: string) => Promise<void>;
  updateExerciseTargetConfig: (
    workoutExerciseId: string,
    config: { targetSets?: number; targetRepMin?: number; targetRepMax?: number; restSeconds?: number }
  ) => Promise<void>;
}

export const useSplitStore = create<SplitStoreState>((set, get) => ({
  activeSplit: null,
  workouts: [],
  nextWorkout: null,
  isLoading: false,
  error: null,

  loadActiveSplit: async (userId: string = 'local_user') => {
    set({ isLoading: true, error: null });
    try {
      let split = await splitRepository.getActiveSplit(userId);

      // If no active split exists in SQLite, seed default PPL
      if (!split) {
        await get().seedDefaultSplitIfEmpty(userId);
        split = await splitRepository.getActiveSplit(userId);
      }

      if (!split) {
        set({ activeSplit: null, workouts: [], nextWorkout: null, isLoading: false });
        return;
      }

      // Load workouts and exercises
      const workoutTemplates = await splitRepository.getWorkoutsForSplit(split.id);
      const fullWorkouts: WorkoutWithExercises[] = [];

      for (const wt of workoutTemplates) {
        const exercises = await splitRepository.getExercisesForWorkout(wt.id);
        fullWorkouts.push({
          ...wt,
          exercises,
        });
      }

      const next = splitEngine.getNextWorkout({
        currentWorkoutIndex: split.current_workout_index,
        workouts: fullWorkouts,
      });

      set({
        activeSplit: split,
        workouts: fullWorkouts,
        nextWorkout: next,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load active split', isLoading: false });
    }
  },

  seedDefaultSplitIfEmpty: async (userId: string = 'local_user') => {
    const ppl = PREDEFINED_SPLITS.ppl;
    await splitRepository.createSplitWithWorkouts(
      userId,
      ppl.name,
      ppl.description,
      ppl.workouts.map((w) => ({
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
  },

  advanceSplit: async () => {
    const { activeSplit, workouts } = get();
    if (!activeSplit || workouts.length === 0) return;

    const result = splitEngine.advanceWorkout({
      currentWorkoutIndex: activeSplit.current_workout_index,
      workouts,
    });

    // Persist to local SQLite
    await splitRepository.updateCurrentWorkoutIndex(
      activeSplit.id,
      result.currentWorkoutIndex
    );

    set({
      activeSplit: {
        ...activeSplit,
        current_workout_index: result.currentWorkoutIndex,
      },
      nextWorkout: result.nextWorkout,
    });
  },

  skipCurrentWorkout: async () => {
    const { activeSplit, workouts } = get();
    if (!activeSplit || workouts.length === 0) return;

    const result = splitEngine.skipWorkout({
      currentWorkoutIndex: activeSplit.current_workout_index,
      workouts,
    });

    // Persist to local SQLite
    await splitRepository.updateCurrentWorkoutIndex(
      activeSplit.id,
      result.currentWorkoutIndex
    );

    set({
      activeSplit: {
        ...activeSplit,
        current_workout_index: result.currentWorkoutIndex,
      },
      nextWorkout: result.nextWorkout,
    });
  },

  resetSplit: async () => {
    const { activeSplit, workouts } = get();
    if (!activeSplit || workouts.length === 0) return;

    const result = splitEngine.resetSplit({
      currentWorkoutIndex: activeSplit.current_workout_index,
      workouts,
    });

    await splitRepository.updateCurrentWorkoutIndex(activeSplit.id, 0);

    set({
      activeSplit: {
        ...activeSplit,
        current_workout_index: 0,
      },
      nextWorkout: result.nextWorkout,
    });
  },

  renameSplit: async (name: string) => {
    const { activeSplit } = get();
    if (!activeSplit) return;
    await splitRepository.updateSplitName(activeSplit.id, name);
    await get().loadActiveSplit(activeSplit.user_id);
  },

  addWorkout: async (name: string) => {
    const { activeSplit, workouts } = get();
    if (!activeSplit) return;
    await splitRepository.addWorkoutToSplit(activeSplit.id, activeSplit.user_id, name, workouts.length);
    await get().loadActiveSplit(activeSplit.user_id);
  },

  deleteWorkout: async (workoutId: string) => {
    const { activeSplit } = get();
    if (!activeSplit) return;
    await splitRepository.deleteWorkoutFromSplit(workoutId);
    await get().loadActiveSplit(activeSplit.user_id);
  },

  renameWorkout: async (workoutId: string, name: string) => {
    const { activeSplit } = get();
    if (!activeSplit) return;
    await splitRepository.renameWorkoutInSplit(workoutId, name);
    await get().loadActiveSplit(activeSplit.user_id);
  },

  addExerciseToWorkoutTemplate: async (workoutId: string, exerciseId: string) => {
    const { activeSplit, workouts } = get();
    if (!activeSplit) return;
    const targetW = workouts.find((w) => w.id === workoutId);
    const order = targetW ? targetW.exercises.length : 0;
    await splitRepository.addExerciseToWorkout(workoutId, exerciseId, order);
    await get().loadActiveSplit(activeSplit.user_id);
  },

  removeExerciseFromWorkoutTemplate: async (workoutExerciseId: string) => {
    const { activeSplit } = get();
    if (!activeSplit) return;
    await splitRepository.removeExerciseFromWorkout(workoutExerciseId);
    await get().loadActiveSplit(activeSplit.user_id);
  },

  updateExerciseTargetConfig: async (
    workoutExerciseId: string,
    config: { targetSets?: number; targetRepMin?: number; targetRepMax?: number; restSeconds?: number }
  ) => {
    const { activeSplit } = get();
    if (!activeSplit) return;
    await splitRepository.updateWorkoutExerciseTargetConfig(workoutExerciseId, config);
    await get().loadActiveSplit(activeSplit.user_id);
  },
}));
