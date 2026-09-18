import { queryAll, queryFirst, execute, withTransaction } from '../database/client';
import { generateUUID } from '../utils/uuid';

export interface SplitRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  current_workout_index: number;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export interface WorkoutTemplateRow {
  id: string;
  split_id: string;
  user_id: string;
  name: string;
  description: string | null;
  workout_order: number;
  estimated_duration_minutes: number | null;
  created_at: number;
  updated_at: number;
}

export interface WorkoutExerciseRow {
  id: string;
  workout_template_id: string;
  exercise_id: string;
  exercise_order: number;
  target_sets: number;
  target_rep_min: number | null;
  target_rep_max: number | null;
  rest_seconds: number | null;
  set_type: string;
  notes: string | null;
  is_superset: number;
  superset_group: string | null;
  created_at: number;
  updated_at: number;
  // Joined fields from exercises table
  exercise_name?: string;
  primary_muscle?: string;
  equipment?: string;
}

export const splitRepository = {
  async getActiveSplit(userId: string): Promise<SplitRow | null> {
    return queryFirst<SplitRow>(
      'SELECT * FROM splits WHERE user_id = ? AND is_active = 1 LIMIT 1;',
      [userId]
    );
  },

  async getSplitById(splitId: string): Promise<SplitRow | null> {
    return queryFirst<SplitRow>('SELECT * FROM splits WHERE id = ?;', [splitId]);
  },

  async getWorkoutsForSplit(splitId: string): Promise<WorkoutTemplateRow[]> {
    return queryAll<WorkoutTemplateRow>(
      'SELECT * FROM workout_templates WHERE split_id = ? ORDER BY workout_order ASC;',
      [splitId]
    );
  },

  async getExercisesForWorkout(workoutTemplateId: string): Promise<WorkoutExerciseRow[]> {
    return queryAll<WorkoutExerciseRow>(
      `SELECT we.*, e.name as exercise_name, e.primary_muscle, e.equipment
       FROM workout_exercises we
       LEFT JOIN exercises e ON we.exercise_id = e.id
       WHERE we.workout_template_id = ?
       ORDER BY we.exercise_order ASC;`,
      [workoutTemplateId]
    );
  },

  async createSplitWithWorkouts(
    userId: string,
    splitName: string,
    description: string,
    workouts: {
      name: string;
      description?: string;
      exercises?: {
        exerciseId: string;
        targetSets: number;
        targetRepMin?: number;
        targetRepMax?: number;
        restSeconds?: number;
      }[];
    }[]
  ): Promise<string> {
    const splitId = generateUUID();
    const now = Date.now();

    await withTransaction(async (tx) => {
      // Deactivate older splits
      await tx.execute('UPDATE splits SET is_active = 0, updated_at = ? WHERE user_id = ?;', [
        now,
        userId,
      ]);

      // Insert new active split
      await tx.execute(
        `INSERT INTO splits (id, user_id, name, description, current_workout_index, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, 1, ?, ?);`,
        [splitId, userId, splitName, description || null, now, now]
      );

      // Insert workouts
      for (let i = 0; i < workouts.length; i++) {
        const w = workouts[i];
        const workoutId = generateUUID();
        await tx.execute(
          `INSERT INTO workout_templates (id, split_id, user_id, name, description, workout_order, estimated_duration_minutes, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 50, ?, ?);`,
          [workoutId, splitId, userId, w.name, w.description || null, i, now, now]
        );

        // Insert exercises if provided
        if (w.exercises && w.exercises.length > 0) {
          for (let j = 0; j < w.exercises.length; j++) {
            const ex = w.exercises[j];
            const workoutExerciseId = generateUUID();
            await tx.execute(
              `INSERT INTO workout_exercises (
                id, workout_template_id, exercise_id, exercise_order,
                target_sets, target_rep_min, target_rep_max, rest_seconds, set_type,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'normal', ?, ?);`,
              [
                workoutExerciseId,
                workoutId,
                ex.exerciseId,
                j,
                ex.targetSets || 3,
                ex.targetRepMin || 8,
                ex.targetRepMax || 12,
                ex.restSeconds || 90,
                now,
                now,
              ]
            );
          }
        }
      }
    });

    return splitId;
  },

  async updateCurrentWorkoutIndex(splitId: string, newIndex: number): Promise<void> {
    await execute('UPDATE splits SET current_workout_index = ?, updated_at = ? WHERE id = ?;', [
      newIndex,
      Date.now(),
      splitId,
    ]);
  },

  async updateSplitName(splitId: string, name: string): Promise<void> {
    await execute('UPDATE splits SET name = ?, updated_at = ? WHERE id = ?;', [
      name,
      Date.now(),
      splitId,
    ]);
  },

  async addWorkoutToSplit(
    splitId: string,
    userId: string,
    workoutName: string,
    workoutOrder: number
  ): Promise<string> {
    const workoutId = generateUUID();
    const now = Date.now();
    await execute(
      `INSERT INTO workout_templates (id, split_id, user_id, name, description, workout_order, estimated_duration_minutes, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'Custom workout routine', ?, 50, ?, ?);`,
      [workoutId, splitId, userId, workoutName, workoutOrder, now, now]
    );
    return workoutId;
  },

  async deleteWorkoutFromSplit(workoutId: string): Promise<void> {
    await withTransaction(async (tx) => {
      await tx.execute('DELETE FROM workout_exercises WHERE workout_template_id = ?;', [workoutId]);
      await tx.execute('DELETE FROM workout_templates WHERE id = ?;', [workoutId]);
    });
  },

  async renameWorkoutInSplit(workoutId: string, name: string): Promise<void> {
    await execute('UPDATE workout_templates SET name = ?, updated_at = ? WHERE id = ?;', [
      name,
      Date.now(),
      workoutId,
    ]);
  },

  async addExerciseToWorkout(
    workoutTemplateId: string,
    exerciseId: string,
    exerciseOrder: number,
    targetSets: number = 3,
    targetRepMin: number = 8,
    targetRepMax: number = 12,
    restSeconds: number = 90
  ): Promise<string> {
    const id = generateUUID();
    const now = Date.now();
    await execute(
      `INSERT INTO workout_exercises (
        id, workout_template_id, exercise_id, exercise_order,
        target_sets, target_rep_min, target_rep_max, rest_seconds, set_type, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'normal', ?, ?);`,
      [id, workoutTemplateId, exerciseId, exerciseOrder, targetSets, targetRepMin, targetRepMax, restSeconds, now, now]
    );
    return id;
  },

  async removeExerciseFromWorkout(workoutExerciseId: string): Promise<void> {
    await execute('DELETE FROM workout_exercises WHERE id = ?;', [workoutExerciseId]);
  },

  async updateWorkoutExerciseTargetConfig(
    workoutExerciseId: string,
    config: { targetSets?: number; targetRepMin?: number; targetRepMax?: number; restSeconds?: number }
  ): Promise<void> {
    const sets = config.targetSets ?? 3;
    const repMin = config.targetRepMin ?? 8;
    const repMax = config.targetRepMax ?? 12;
    const rest = config.restSeconds ?? 90;
    await execute(
      `UPDATE workout_exercises 
       SET target_sets = ?, target_rep_min = ?, target_rep_max = ?, rest_seconds = ?, updated_at = ? 
       WHERE id = ?;`,
      [sets, repMin, repMax, rest, Date.now(), workoutExerciseId]
    );
  },
};
