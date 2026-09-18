import { queryAll, queryFirst, execute, withTransaction } from '../database/client';
import { generateUUID } from '../utils/uuid';

export interface ExerciseRow {
  id: string;
  user_id: string | null;
  name: string;
  primary_muscle: string;
  secondary_muscles: string | null;
  equipment: string | null;
  tracking_type: string;
  is_custom: number;
  created_at: number;
  updated_at: number;
}

export const exerciseRepository = {
  async getAllExercises(userId?: string): Promise<ExerciseRow[]> {
    if (userId) {
      return queryAll<ExerciseRow>(
        'SELECT * FROM exercises WHERE user_id IS NULL OR user_id = ? ORDER BY name ASC;',
        [userId]
      );
    }
    return queryAll<ExerciseRow>('SELECT * FROM exercises ORDER BY name ASC;');
  },

  async searchExercises(query: string, userId?: string): Promise<ExerciseRow[]> {
    const formatted = `%${query.toLowerCase().trim()}%`;
    if (userId) {
      return queryAll<ExerciseRow>(
        `SELECT * FROM exercises 
         WHERE (user_id IS NULL OR user_id = ?) 
         AND (LOWER(name) LIKE ? OR LOWER(primary_muscle) LIKE ?)
         ORDER BY name ASC;`,
        [userId, formatted, formatted]
      );
    }
    return queryAll<ExerciseRow>(
      `SELECT * FROM exercises 
       WHERE LOWER(name) LIKE ? OR LOWER(primary_muscle) LIKE ?
       ORDER BY name ASC;`,
      [formatted, formatted]
    );
  },

  async getExerciseById(id: string): Promise<ExerciseRow | null> {
    return queryFirst<ExerciseRow>('SELECT * FROM exercises WHERE id = ?;', [id]);
  },

  async getExercisesByMuscle(muscle: string, userId?: string): Promise<ExerciseRow[]> {
    if (userId) {
      return queryAll<ExerciseRow>(
        'SELECT * FROM exercises WHERE (user_id IS NULL OR user_id = ?) AND primary_muscle = ? ORDER BY name ASC;',
        [userId, muscle]
      );
    }
    return queryAll<ExerciseRow>(
      'SELECT * FROM exercises WHERE primary_muscle = ? ORDER BY name ASC;',
      [muscle]
    );
  },

  async createCustomExercise(exercise: {
    userId: string;
    name: string;
    primaryMuscle: string;
    secondaryMuscles?: string[];
    equipment?: string;
    trackingType?: string;
  }): Promise<string> {
    const id = generateUUID();
    const now = Date.now();
    await execute(
      `INSERT INTO exercises (
        id, user_id, name, primary_muscle, secondary_muscles, equipment, tracking_type, is_custom, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?);`,
      [
        id,
        exercise.userId,
        exercise.name,
        exercise.primaryMuscle,
        exercise.secondaryMuscles ? JSON.stringify(exercise.secondaryMuscles) : null,
        exercise.equipment || null,
        exercise.trackingType || 'weight_reps',
        now,
        now,
      ]
    );
    return id;
  },

  async seedSystemExercises(
    exercises: {
      id: string;
      name: string;
      primaryMuscle: string;
      secondaryMuscles?: string[];
      equipment?: string;
    }[]
  ): Promise<void> {
    const now = Date.now();
    await withTransaction(async (tx) => {
      for (const ex of exercises) {
        await tx.execute(
          `INSERT OR IGNORE INTO exercises (
            id, user_id, name, primary_muscle, secondary_muscles, equipment, tracking_type, is_custom, created_at, updated_at
          ) VALUES (?, NULL, ?, ?, ?, ?, 'weight_reps', 0, ?, ?);`,
          [
            ex.id,
            ex.name,
            ex.primaryMuscle,
            ex.secondaryMuscles ? JSON.stringify(ex.secondaryMuscles) : null,
            ex.equipment || null,
            now,
            now,
          ]
        );
      }
    });
  },
};
