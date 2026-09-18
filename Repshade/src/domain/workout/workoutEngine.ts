/**
 * Repshade Pure Workout Domain Engine
 *
 * Responsibilities:
 * - Session state transitions & validation
 * - 1RM estimation & volume calculations
 * - PR detection logic
 */

export type WorkoutState = 'planned' | 'in_progress' | 'paused' | 'completed' | 'abandoned' | 'skipped';

export interface SetEntry {
  id: string;
  weight?: number | null;
  reps?: number | null;
  completed: boolean | number;
}

export const workoutEngine = {
  /**
   * Valid state transitions map
   */
  validTransitions: {
    planned: ['in_progress', 'skipped', 'abandoned'],
    in_progress: ['paused', 'completed', 'abandoned'],
    paused: ['in_progress', 'completed', 'abandoned'],
    completed: [], // Terminal
    abandoned: [], // Terminal
    skipped: [],   // Terminal
  } as Record<WorkoutState, WorkoutState[]>,

  /**
   * Validates whether a workout session state transition is permitted
   */
  canTransition(fromState: WorkoutState, toState: WorkoutState): boolean {
    const allowed = this.validTransitions[fromState] || [];
    return allowed.includes(toState);
  },

  /**
   * Compute total volume from completed sets
   */
  calculateTotalVolume(sets: SetEntry[]): number {
    return sets.reduce((sum, s) => {
      const isDone = s.completed === true || s.completed === 1;
      if (!isDone) return sum;
      const weight = Number(s.weight) || 0;
      const reps = Number(s.reps) || 0;
      return sum + weight * reps;
    }, 0);
  },

  /**
   * Compute completed sets count
   */
  calculateCompletedSetsCount(sets: SetEntry[]): number {
    return sets.filter((s) => s.completed === true || s.completed === 1).length;
  },

  /**
   * Compute total reps from completed sets
   */
  calculateTotalReps(sets: SetEntry[]): number {
    return sets.reduce((sum, s) => {
      const isDone = s.completed === true || s.completed === 1;
      if (!isDone) return sum;
      return sum + (Number(s.reps) || 0);
    }, 0);
  },

  /**
   * Estimate 1 Rep Max using the Brzycki Formula:
   * 1RM = weight * (36 / (37 - reps))
   */
  calculateEstimated1RM(weight: number, reps: number): number {
    if (weight <= 0 || reps <= 0) return 0;
    if (reps === 1) return weight;
    if (reps >= 37) return weight; // Guard against division by zero/negative
    const estimated = weight * (36 / (37 - reps));
    return Math.round(estimated * 10) / 10;
  },

  /**
   * Format seconds into MM:SS or HH:MM:SS
   */
  formatDuration(totalSeconds: number): string {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  },
};
