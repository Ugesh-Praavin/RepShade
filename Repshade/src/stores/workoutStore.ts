import { create } from 'zustand';
import { workoutEngine } from '../domain/workout/workoutEngine';
import {
  workoutRepository,
  WorkoutSessionRow,
  WorkoutSetRow,
} from '../repositories/workoutRepository';
import { recordRepository } from '../repositories/recordRepository';
import { ExerciseRow } from '../repositories/exerciseRepository';
import { splitRepository } from '../repositories/splitRepository';
import { WorkoutWithExercises, useSplitStore } from './splitStore';
import { generateUUID } from '../utils/uuid';
import { execute } from '../database/client';
import { workoutTimerService } from '../services/workoutTimerService';
import { useAuthStore } from './authStore';
import { syncService } from '../services/syncService';

export interface ExerciseSummaryBreakdown {
  exerciseId: string;
  exerciseName: string;
  setsCount: number;
  bestWeight: number;
  bestReps: number;
  volume: number;
  isPR?: boolean;
}

export interface WorkoutSummaryInfo {
  session: WorkoutSessionRow;
  templateName: string;
  templateDescription: string;
  totalVolume: number;
  totalSets: number;
  totalReps: number;
  durationSeconds: number;
  prsAchieved: { exerciseName: string; weight: number; reps: number }[];
  breakdown: ExerciseSummaryBreakdown[];
  nextWorkoutName: string;
  nextWorkoutDescription: string;
  currentSplitIndex: number;
  totalSplitWorkouts: number;
}

export interface WorkoutStoreState {
  activeSession: WorkoutSessionRow | null;
  activeTemplate: WorkoutWithExercises | null;
  sessionSets: WorkoutSetRow[];
  elapsedSeconds: number;
  isPaused: boolean;
  totalPausedMs: number;
  lastPausedTimestamp: number | null;
  restTimerSeconds: number;
  isRestTimerActive: boolean;
  restTimerTotal: number;
  summaryData: WorkoutSummaryInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  startWorkout: (template: WorkoutWithExercises, userId?: string) => Promise<void>;
  logSet: (
    setId: string,
    updates: Partial<{
      weight: number;
      reps: number;
      rpe: number;
      rir: number;
      setType: string;
      completed: boolean;
      notes: string;
    }>
  ) => Promise<void>;
  toggleSetComplete: (setId: string, defaultRestSeconds?: number) => Promise<void>;
  addSet: (workoutExerciseId: string, exerciseId: string) => Promise<void>;
  removeSet: (setId: string) => Promise<void>;
  addExerciseToWorkout: (exercise: ExerciseRow) => Promise<void>;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  addRestSeconds: (delta: number) => void;
  tickTimers: () => void;
  finishWorkout: () => Promise<WorkoutSummaryInfo | null>;
  finishWorkoutWithDuration: (durationSeconds: number) => Promise<WorkoutSummaryInfo | null>;
  discardWorkout: () => Promise<void>;
  checkAndRestoreWorkout: (userId?: string) => Promise<boolean>;
}

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  activeSession: null,
  activeTemplate: null,
  sessionSets: [],
  elapsedSeconds: 0,
  isPaused: false,
  totalPausedMs: 0,
  lastPausedTimestamp: null,
  restTimerSeconds: 0,
  isRestTimerActive: false,
  restTimerTotal: 90,
  summaryData: null,
  isLoading: false,
  error: null,

  startWorkout: async (template, userId) => {
    const effectiveUserId =
      userId && userId !== 'local_user'
        ? userId
        : useAuthStore.getState().user?.uid || userId || 'local_user';
    set({ isLoading: true, error: null });
    try {
      const now = Date.now();
      const rawExercises = template.exercises || [];
      const { sessionId, sets } = await workoutRepository.startWorkoutSession({
        userId: effectiveUserId,
        splitId: template.split_id,
        workoutTemplateId: template.id,
        exercises: rawExercises.map((e) => ({
          workoutExerciseId: e.id,
          exerciseId: e.exercise_id,
          targetSets: e.target_sets || 3,
          targetRepMin: e.target_rep_min || 8,
          targetRepMax: e.target_rep_max || 12,
        })),
      });

      const session: WorkoutSessionRow = {
        id: sessionId,
        user_id: effectiveUserId,
        split_id: template.split_id,
        workout_template_id: template.id,
        started_at: now,
        completed_at: null,
        status: 'in_progress',
        duration_seconds: 0,
        total_volume: 0,
        total_sets: 0,
        total_reps: 0,
        notes: null,
        split_advanced: 0,
        created_at: now,
        updated_at: now,
      };

      set({
        activeSession: session,
        activeTemplate: {
          ...template,
          exercises: rawExercises,
        },
        sessionSets: sets,
        elapsedSeconds: 0,
        isPaused: false,
        totalPausedMs: 0,
        lastPausedTimestamp: null,
        restTimerSeconds: 0,
        isRestTimerActive: false,
        summaryData: null,
        isLoading: false,
      });

      // Start Android/iOS Foreground Service with live Chronometer notification
      try {
        await workoutTimerService.startTimer(sessionId, template.name, now);
      } catch (serviceErr) {
        console.warn('Native workout timer service error (continuing with internal timer):', serviceErr);
      }
    } catch (err: any) {
      set({ error: err?.message || 'Failed to start workout', isLoading: false });
      throw err;
    }
  },

  logSet: async (setId, updates) => {
    const { sessionSets } = get();
    const updated = sessionSets.map((s) => {
      if (s.id !== setId) return s;
      return {
        ...s,
        ...updates,
        completed: updates.completed !== undefined ? (updates.completed ? 1 : 0) : s.completed,
      };
    });

    set({ sessionSets: updated });
    await workoutRepository.logSet(setId, updates);
  },

  toggleSetComplete: async (setId, defaultRestSeconds = 90) => {
    const { sessionSets, activeSession } = get();
    const targetSet = sessionSets.find((s) => s.id === setId);
    if (!targetSet) return;

    const nextCompleted = targetSet.completed === 1 ? 0 : 1;

    const updated = sessionSets.map((s) =>
      s.id === setId ? { ...s, completed: nextCompleted } : s
    );

    set({ sessionSets: updated });
    await workoutRepository.logSet(setId, { completed: nextCompleted === 1 });

    if (nextCompleted === 1) {
      get().startRestTimer(defaultRestSeconds);

      if (activeSession && targetSet.weight && targetSet.weight > 0) {
        try {
          await recordRepository.checkAndSavePR({
            userId: activeSession.user_id,
            exerciseId: targetSet.exercise_id,
            recordType: 'weight',
            value: targetSet.weight,
            weight: targetSet.weight,
            reps: targetSet.reps || 1,
            workoutSessionId: activeSession.id,
          });
        } catch (e) {
          console.error('Error saving PR:', e);
        }
      }
    }
  },

  addSet: async (workoutExerciseId, exerciseId) => {
    const { activeSession, sessionSets } = get();
    if (!activeSession) return;

    const existingForExercise = sessionSets.filter(
      (s) => s.workout_exercise_id === workoutExerciseId
    );
    const nextSetNumber = existingForExercise.length + 1;
    const lastSet = existingForExercise[existingForExercise.length - 1];

    const newSet = await workoutRepository.addSetToSession({
      sessionId: activeSession.id,
      workoutExerciseId,
      exerciseId,
      setNumber: nextSetNumber,
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 10,
    });

    set({ sessionSets: [...sessionSets, newSet] });
  },

  removeSet: async (setId) => {
    const { sessionSets } = get();
    set({ sessionSets: sessionSets.filter((s) => s.id !== setId) });
  },

  addExerciseToWorkout: async (exercise: ExerciseRow) => {
    const { activeSession, activeTemplate, sessionSets } = get();
    if (!activeSession || !activeTemplate) return;

    const workoutExerciseId = generateUUID();
    const newWorkoutExercise = {
      id: workoutExerciseId,
      workout_template_id: activeTemplate.id,
      exercise_id: exercise.id,
      exercise_order: activeTemplate.exercises.length + 1,
      target_sets: 3,
      target_rep_min: 8,
      target_rep_max: 12,
      rest_seconds: 90,
      set_type: 'normal',
      notes: null,
      is_superset: 0,
      superset_group: null,
      created_at: Date.now(),
      updated_at: Date.now(),
      exercise_name: exercise.name,
      primary_muscle: exercise.primary_muscle,
      equipment: exercise.equipment || undefined,
    };

    const newSet = await workoutRepository.addSetToSession({
      sessionId: activeSession.id,
      workoutExerciseId,
      exerciseId: exercise.id,
      setNumber: 1,
      weight: 0,
      reps: 10,
    });

    set({
      activeTemplate: {
        ...activeTemplate,
        exercises: [...activeTemplate.exercises, newWorkoutExercise],
      },
      sessionSets: [...sessionSets, newSet],
    });
  },

  pauseWorkout: () => {
    const { elapsedSeconds } = get();
    workoutTimerService.pauseTimer(elapsedSeconds);
    set({ isPaused: true, lastPausedTimestamp: Date.now() });
  },

  resumeWorkout: () => {
    const { lastPausedTimestamp, totalPausedMs } = get();
    let newTotalPaused = totalPausedMs;
    if (lastPausedTimestamp) {
      newTotalPaused += Date.now() - lastPausedTimestamp;
    }
    workoutTimerService.resumeTimer();
    set({ isPaused: false, lastPausedTimestamp: null, totalPausedMs: newTotalPaused });
  },

  startRestTimer: (seconds) => {
    set({
      restTimerSeconds: seconds,
      restTimerTotal: seconds,
      isRestTimerActive: true,
    });
  },

  stopRestTimer: () => {
    set({
      restTimerSeconds: 0,
      isRestTimerActive: false,
    });
  },

  addRestSeconds: (delta) => {
    const { restTimerSeconds, restTimerTotal } = get();
    const next = Math.max(0, restTimerSeconds + delta);
    set({
      restTimerSeconds: next,
      restTimerTotal: Math.max(restTimerTotal, next),
      isRestTimerActive: next > 0,
    });
  },

  tickTimers: () => {
    const { isPaused, activeSession, totalPausedMs, isRestTimerActive, restTimerSeconds } = get();

    let nextElapsed = get().elapsedSeconds;
    if (activeSession && activeSession.started_at) {
      if (!isPaused) {
        const now = Date.now();
        nextElapsed = Math.max(0, Math.floor((now - activeSession.started_at - totalPausedMs) / 1000));
      }
    } else if (!isPaused) {
      nextElapsed += 1;
    }

    let nextRest = restTimerSeconds;
    let nextRestActive = isRestTimerActive;
    if (isRestTimerActive && restTimerSeconds > 0) {
      nextRest -= 1;
      if (nextRest <= 0) {
        nextRestActive = false;
        nextRest = 0;
      }
    }

    set({
      elapsedSeconds: nextElapsed,
      restTimerSeconds: nextRest,
      isRestTimerActive: nextRestActive,
    });
  },

  finishWorkout: async () => {
    const { elapsedSeconds } = get();
    return await get().finishWorkoutWithDuration(elapsedSeconds);
  },

  finishWorkoutWithDuration: async (durationSeconds: number) => {
    await workoutTimerService.stopTimer();

    let { activeSession, sessionSets, activeTemplate } = get();

    // If activeSession is missing (e.g. app was terminated), recover it from SQLite
    if (!activeSession) {
      const currentUserId = useAuthStore.getState().user?.uid || 'local_user';
      let dbSession = await workoutRepository.getActiveSession(currentUserId);
      if (!dbSession && currentUserId !== 'local_user') {
        dbSession = await workoutRepository.getActiveSession('local_user');
      }
      if (dbSession) {
        activeSession = dbSession;
        sessionSets = await workoutRepository.getSetsForSession(dbSession.id);
        const workouts = await splitRepository.getWorkoutsForSplit(dbSession.split_id);
        const template = workouts.find((w) => w.id === dbSession.workout_template_id);
        if (template) {
          const exercises = await splitRepository.getExercisesForWorkout(template.id);
          activeTemplate = { ...template, exercises };
        }
      }
    }

    if (!activeSession) return null;

    const completedSets = sessionSets.filter((s) => s.completed === 1);
    const totalVolume = workoutEngine.calculateTotalVolume(completedSets);
    const totalReps = workoutEngine.calculateTotalReps(completedSets);

    await workoutRepository.finishWorkoutSession({
      sessionId: activeSession.id,
      durationSeconds,
    });

    const effectiveUserId =
      activeSession.user_id && activeSession.user_id !== 'local_user'
        ? activeSession.user_id
        : useAuthStore.getState().user?.uid || activeSession.user_id || 'local_user';

    // Advance split in SQLite & splitStore
    try {
      await useSplitStore.getState().advanceSplit();
    } catch (e) {
      console.error('Error advancing split:', e);
    }

    const splitState = useSplitStore.getState();
    const nextWorkout = splitState.nextWorkout;
    const splitWorkouts = splitState.workouts;
    const currentSplitIndex = splitState.activeSplit?.current_workout_index || 0;

    // Calculate exercise breakdown and check for personal records
    const breakdown: ExerciseSummaryBreakdown[] = [];
    const prsAchieved: { exerciseName: string; weight: number; reps: number }[] = [];
    if (activeTemplate) {
      for (const ex of activeTemplate.exercises) {
        const exSets = completedSets.filter((s) => s.workout_exercise_id === ex.id);
        if (exSets.length > 0) {
          const exVol = workoutEngine.calculateTotalVolume(exSets);
          let bestW = 0;
          let bestR = 0;
          for (const s of exSets) {
            const w = s.weight || 0;
            const r = s.reps || 0;
            if (w > bestW || (w === bestW && r > bestR)) {
              bestW = w;
              bestR = r;
            }
          }

          let isPR = false;
          try {
            const existingPR = await recordRepository.getPRForExercise(effectiveUserId, ex.exercise_id, 'weight');
            if (bestW > 0 && (!existingPR || bestW > existingPR.value)) {
              isPR = true;
              prsAchieved.push({
                exerciseName: ex.exercise_name || 'Exercise',
                weight: bestW,
                reps: bestR,
              });
            }
          } catch (e) {
            console.warn('Error checking PR for breakdown:', e);
          }

          breakdown.push({
            exerciseId: ex.exercise_id,
            exerciseName: ex.exercise_name || 'Exercise',
            setsCount: exSets.length,
            bestWeight: bestW,
            bestReps: bestR,
            volume: exVol,
            isPR,
          });
        }
      }
    }

    const summary: WorkoutSummaryInfo = {
      session: {
        ...activeSession,
        user_id: effectiveUserId,
        status: 'completed',
        completed_at: Date.now(),
        duration_seconds: durationSeconds,
        total_volume: totalVolume,
        total_sets: completedSets.length,
        total_reps: totalReps,
        split_advanced: 1,
      },
      templateName: activeTemplate?.name || 'Workout',
      templateDescription: activeTemplate?.description || 'Strength Session',
      totalVolume,
      totalSets: completedSets.length,
      totalReps,
      durationSeconds,
      prsAchieved,
      breakdown,
      nextWorkoutName: nextWorkout?.name || 'Next Workout',
      nextWorkoutDescription: nextWorkout?.description || '',
      currentSplitIndex,
      totalSplitWorkouts: splitWorkouts.length || 3,
    };

    // Background sync completed workout and sets to Firestore (enqueues offline if network fails)
    syncService.syncCompletedWorkout(effectiveUserId, summary, completedSets).catch((err) => {
      console.warn('Background syncCompletedWorkout failed:', err);
    });

    set({
      summaryData: summary,
      activeSession: null,
      activeTemplate: null,
      sessionSets: [],
      elapsedSeconds: 0,
      totalPausedMs: 0,
      lastPausedTimestamp: null,
      isRestTimerActive: false,
    });

    return summary;
  },

  discardWorkout: async () => {
    await workoutTimerService.stopTimer();
    const { activeSession } = get();
    if (activeSession) {
      try {
        await execute("UPDATE workout_sessions SET status = 'abandoned' WHERE id = ?;", [activeSession.id]);
      } catch (e) {
        console.warn('Failed to mark session abandoned:', e);
      }
    }
    set({
      activeSession: null,
      activeTemplate: null,
      sessionSets: [],
      elapsedSeconds: 0,
      totalPausedMs: 0,
      lastPausedTimestamp: null,
      isRestTimerActive: false,
      restTimerSeconds: 0,
      summaryData: null,
    });
  },

  checkAndRestoreWorkout: async (userId) => {
    const effectiveUserId =
      userId && userId !== 'local_user'
        ? userId
        : useAuthStore.getState().user?.uid || userId || 'local_user';
    try {
      // 1. Check if user tapped "Stop Timer" on notification while app was in background or closed
      const pending = await workoutTimerService.getPendingCompletedWorkout();
      if (pending && pending.hasPending) {
        await workoutTimerService.clearPendingCompletedWorkout();
        const summary = await get().finishWorkoutWithDuration(pending.durationSeconds);
        if (summary) {
          return true; // Workout was completed via notification
        }
      }

      // 2. Check if there's an in_progress session in SQLite
      let activeSession = await workoutRepository.getActiveSession(effectiveUserId);
      if (!activeSession && effectiveUserId !== 'local_user') {
        activeSession = await workoutRepository.getActiveSession('local_user');
      }
      if (activeSession && activeSession.status === 'in_progress') {
        const sets = await workoutRepository.getSetsForSession(activeSession.id);
        const workouts = await splitRepository.getWorkoutsForSplit(activeSession.split_id);
        const template = workouts.find((w) => w.id === activeSession.workout_template_id);
        let activeTemplate: WorkoutWithExercises | null = null;
        if (template) {
          const exercises = await splitRepository.getExercisesForWorkout(template.id);
          activeTemplate = { ...template, exercises };
        }

        const elapsed = Math.max(0, Math.floor((Date.now() - activeSession.started_at) / 1000));

        set({
          activeSession,
          activeTemplate,
          sessionSets: sets,
          elapsedSeconds: elapsed,
          isPaused: false,
          totalPausedMs: 0,
          lastPausedTimestamp: null,
        });

        // Ensure timer service is running with notification
        await workoutTimerService.startTimer(
          activeSession.id,
          activeTemplate?.name || 'Active Workout',
          activeSession.started_at
        );
      }
    } catch (e) {
      console.warn('Error in checkAndRestoreWorkout:', e);
    }
    return false;
  },
}));
