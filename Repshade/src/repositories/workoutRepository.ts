import { queryAll, queryFirst, execute, withTransaction } from '../database/client';
import { generateUUID } from '../utils/uuid';

export interface WorkoutSessionRow {
  id: string;
  user_id: string;
  split_id: string;
  workout_template_id: string;
  started_at: number;
  completed_at: number | null;
  status: 'planned' | 'in_progress' | 'paused' | 'completed' | 'abandoned' | 'skipped';
  duration_seconds: number;
  total_volume: number;
  total_sets: number;
  total_reps: number;
  notes: string | null;
  split_advanced: number;
  created_at: number;
  updated_at: number;
}

export interface WorkoutSetRow {
  id: string;
  workout_session_id: string;
  workout_exercise_id: string;
  exercise_id: string;
  set_number: number;
  weight: number | null;
  reps: number | null;
  duration_seconds: number | null;
  distance: number | null;
  rpe: number | null;
  rir: number | null;
  set_type: string;
  completed: number;
  notes: string | null;
  created_at: number;
  updated_at: number;
}

export const workoutRepository = {
  async getActiveSession(userId: string): Promise<WorkoutSessionRow | null> {
    return queryFirst<WorkoutSessionRow>(
      `SELECT * FROM workout_sessions 
       WHERE user_id = ? AND (status = 'in_progress' OR status = 'paused') 
       ORDER BY started_at DESC LIMIT 1;`,
      [userId]
    );
  },

  async startWorkoutSession(params: {
    userId: string;
    splitId: string;
    workoutTemplateId: string;
    exercises: {
      workoutExerciseId: string;
      exerciseId: string;
      targetSets: number;
      targetRepMin?: number;
      targetRepMax?: number;
    }[];
  }): Promise<{ sessionId: string; sets: WorkoutSetRow[] }> {
    const sessionId = generateUUID();
    const now = Date.now();
    const createdSets: WorkoutSetRow[] = [];

    await withTransaction(async (tx) => {
      // Create session
      await tx.execute(
        `INSERT INTO workout_sessions (
          id, user_id, split_id, workout_template_id, started_at, status, duration_seconds,
          total_volume, total_sets, total_reps, split_advanced, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'in_progress', 0, 0, 0, 0, 0, ?, ?);`,
        [sessionId, params.userId, params.splitId, params.workoutTemplateId, now, now, now]
      );

      // Create placeholder initial sets based on targetSets
      for (const ex of params.exercises) {
        for (let s = 1; s <= ex.targetSets; s++) {
          const setId = generateUUID();
          const targetReps = ex.targetRepMax || ex.targetRepMin || 10;
          await tx.execute(
            `INSERT INTO workout_sets (
              id, workout_session_id, workout_exercise_id, exercise_id, set_number,
              weight, reps, set_type, completed, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, 0, ?, 'normal', 0, ?, ?);`,
            [setId, sessionId, ex.workoutExerciseId, ex.exerciseId, s, targetReps, now, now]
          );

          createdSets.push({
            id: setId,
            workout_session_id: sessionId,
            workout_exercise_id: ex.workoutExerciseId,
            exercise_id: ex.exerciseId,
            set_number: s,
            weight: 0,
            reps: targetReps,
            duration_seconds: null,
            distance: null,
            rpe: null,
            rir: null,
            set_type: 'normal',
            completed: 0,
            notes: null,
            created_at: now,
            updated_at: now,
          });
        }
      }
    });

    return { sessionId, sets: createdSets };
  },

  async getSetsForSession(sessionId: string): Promise<WorkoutSetRow[]> {
    return queryAll<WorkoutSetRow>(
      'SELECT * FROM workout_sets WHERE workout_session_id = ? ORDER BY workout_exercise_id, set_number ASC;',
      [sessionId]
    );
  },

  async logSet(setId: string, updates: {
    weight?: number;
    reps?: number;
    rpe?: number;
    rir?: number;
    setType?: string;
    completed?: boolean;
    notes?: string;
  }): Promise<void> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return;

    const columnMap: Record<string, string> = {
      weight: 'weight',
      reps: 'reps',
      rpe: 'rpe',
      rir: 'rir',
      setType: 'set_type',
      completed: 'completed',
      notes: 'notes',
    };

    const setClauses: string[] = [];
    const values: (string | number | null)[] = [];

    for (const [key, val] of Object.entries(updates)) {
      if (columnMap[key]) {
        setClauses.push(`${columnMap[key]} = ?`);
        if (typeof val === 'boolean') {
          values.push(val ? 1 : 0);
        } else {
          values.push(val as any);
        }
      }
    }

    setClauses.push('updated_at = ?');
    values.push(Date.now());
    values.push(setId);

    await execute(`UPDATE workout_sets SET ${setClauses.join(', ')} WHERE id = ?;`, values);
  },

  async addSetToSession(params: {
    sessionId: string;
    workoutExerciseId: string;
    exerciseId: string;
    setNumber: number;
    weight?: number;
    reps?: number;
    setType?: string;
  }): Promise<WorkoutSetRow> {
    const setId = generateUUID();
    const now = Date.now();
    await execute(
      `INSERT INTO workout_sets (
        id, workout_session_id, workout_exercise_id, exercise_id, set_number,
        weight, reps, set_type, completed, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?);`,
      [
        setId,
        params.sessionId,
        params.workoutExerciseId,
        params.exerciseId,
        params.setNumber,
        params.weight || 0,
        params.reps || 10,
        params.setType || 'normal',
        now,
        now,
      ]
    );

    return {
      id: setId,
      workout_session_id: params.sessionId,
      workout_exercise_id: params.workoutExerciseId,
      exercise_id: params.exerciseId,
      set_number: params.setNumber,
      weight: params.weight || 0,
      reps: params.reps || 10,
      duration_seconds: null,
      distance: null,
      rpe: null,
      rir: null,
      set_type: params.setType || 'normal',
      completed: 0,
      notes: null,
      created_at: now,
      updated_at: now,
    };
  },

  async finishWorkoutSession(params: {
    sessionId: string;
    durationSeconds: number;
    notes?: string;
  }): Promise<{ totalVolume: number; totalSets: number; totalReps: number }> {
    const sets = await this.getSetsForSession(params.sessionId);
    const completedSets = sets.filter((s) => s.completed === 1);

    let totalVolume = 0;
    let totalReps = 0;
    for (const s of completedSets) {
      const weight = s.weight || 0;
      const reps = s.reps || 0;
      totalVolume += weight * reps;
      totalReps += reps;
    }

    const now = Date.now();
    await execute(
      `UPDATE workout_sessions SET
        completed_at = ?,
        status = 'completed',
        duration_seconds = ?,
        total_volume = ?,
        total_sets = ?,
        total_reps = ?,
        notes = ?,
        split_advanced = 1,
        updated_at = ?
       WHERE id = ?;`,
      [
        now,
        params.durationSeconds,
        totalVolume,
        completedSets.length,
        totalReps,
        params.notes || null,
        now,
        params.sessionId,
      ]
    );

    return { totalVolume, totalSets: completedSets.length, totalReps };
  },

  async getPreviousPerformance(exerciseId: string, limit: number = 5): Promise<WorkoutSetRow[]> {
    return queryAll<WorkoutSetRow>(
      `SELECT * FROM workout_sets 
       WHERE exercise_id = ? AND completed = 1 
       ORDER BY created_at DESC LIMIT ?;`,
      [exerciseId, limit]
    );
  },
};
