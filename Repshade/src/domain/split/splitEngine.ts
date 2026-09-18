/**
 * Repshade Pure Rolling Split Domain Engine
 *
 * Core Rule:
 * "The calendar tells you when you trained. Your split tells you what you train next."
 *
 * Missed calendar days NEVER advance the split.
 * Only two actions advance the split:
 * 1. Completing a workout.
 * 2. Manually skipping a workout.
 */

export interface SplitEngineInput<T = any> {
  currentWorkoutIndex: number;
  workouts: T[];
}

export interface SplitEngineResult<T = any> {
  currentWorkoutIndex: number;
  nextWorkout: T | null;
  previousWorkoutIndex?: number;
}

export const splitEngine = {
  /**
   * Get the current up-next workout based on index.
   * Deterministic, zero side-effects.
   */
  getNextWorkout<T>(split: SplitEngineInput<T>): T | null {
    if (!split.workouts || split.workouts.length === 0) {
      return null;
    }

    const safeIndex = this.normalizeIndex(split.currentWorkoutIndex, split.workouts.length);
    return split.workouts[safeIndex] || null;
  },

  /**
   * Advances the split to the next workout in sequence (e.g. after workout completion).
   * Wraps around automatically when reaching the end of the split cycle.
   */
  advanceWorkout<T>(split: SplitEngineInput<T>): SplitEngineResult<T> {
    if (!split.workouts || split.workouts.length === 0) {
      return { currentWorkoutIndex: 0, nextWorkout: null };
    }

    const total = split.workouts.length;
    const previousIndex = this.normalizeIndex(split.currentWorkoutIndex, total);
    const nextIndex = (previousIndex + 1) % total;

    return {
      previousWorkoutIndex: previousIndex,
      currentWorkoutIndex: nextIndex,
      nextWorkout: split.workouts[nextIndex],
    };
  },

  /**
   * Manually skips the current workout and moves to the next one.
   */
  skipWorkout<T>(split: SplitEngineInput<T>): SplitEngineResult<T> {
    // Same rolling transition logic as advanceWorkout
    return this.advanceWorkout(split);
  },

  /**
   * Resets the split position back to the beginning (index 0).
   */
  resetSplit<T>(split: SplitEngineInput<T>): SplitEngineResult<T> {
    if (!split.workouts || split.workouts.length === 0) {
      return { currentWorkoutIndex: 0, nextWorkout: null };
    }

    return {
      currentWorkoutIndex: 0,
      nextWorkout: split.workouts[0] || null,
    };
  },

  /**
   * Normalizes any out-of-bounds or negative index into a safe valid index within [0, length - 1].
   */
  normalizeIndex(index: number, totalWorkouts: number): number {
    if (totalWorkouts <= 0) return 0;
    const normalized = index % totalWorkouts;
    return normalized < 0 ? normalized + totalWorkouts : normalized;
  },
};
