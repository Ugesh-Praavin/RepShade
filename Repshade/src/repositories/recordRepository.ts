import { queryAll, queryFirst, execute } from '../database/client';
import { generateUUID } from '../utils/uuid';

export interface PersonalRecordRow {
  id: string;
  user_id: string;
  exercise_id: string;
  record_type: 'weight' | 'reps' | 'volume' | 'estimated_1rm';
  value: number;
  weight: number | null;
  reps: number | null;
  workout_session_id: string;
  achieved_at: number;
  created_at: number;
  updated_at: number;
  // Joined field
  exercise_name?: string;
}

export const recordRepository = {
  async getAllPRs(userId: string): Promise<PersonalRecordRow[]> {
    return queryAll<PersonalRecordRow>(
      `SELECT pr.*, e.name as exercise_name 
       FROM personal_records pr
       LEFT JOIN exercises e ON pr.exercise_id = e.id
       WHERE pr.user_id = ?
       ORDER BY pr.achieved_at DESC;`,
      [userId]
    );
  },

  async getPRForExercise(
    userId: string,
    exerciseId: string,
    recordType: 'weight' | 'reps' | 'volume' | 'estimated_1rm' = 'weight'
  ): Promise<PersonalRecordRow | null> {
    return queryFirst<PersonalRecordRow>(
      `SELECT * FROM personal_records 
       WHERE user_id = ? AND exercise_id = ? AND record_type = ? 
       ORDER BY value DESC LIMIT 1;`,
      [userId, exerciseId, recordType]
    );
  },

  async checkAndSavePR(params: {
    userId: string;
    exerciseId: string;
    recordType: 'weight' | 'reps' | 'volume' | 'estimated_1rm';
    value: number;
    weight?: number;
    reps?: number;
    workoutSessionId: string;
  }): Promise<boolean> {
    const existing = await this.getPRForExercise(params.userId, params.exerciseId, params.recordType);

    if (!existing || params.value > existing.value) {
      const now = Date.now();
      const id = generateUUID();
      await execute(
        `INSERT INTO personal_records (
          id, user_id, exercise_id, record_type, value, weight, reps, workout_session_id, achieved_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          id,
          params.userId,
          params.exerciseId,
          params.recordType,
          params.value,
          params.weight || null,
          params.reps || null,
          params.workoutSessionId,
          now,
          now,
          now,
        ]
      );
      return true;
    }

    return false;
  },
};
