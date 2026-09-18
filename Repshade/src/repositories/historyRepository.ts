import { queryAll, queryFirst } from '../database/client';
import { WorkoutSessionRow } from './workoutRepository';

export interface CompletedWorkoutHistoryItem extends WorkoutSessionRow {
  split_name?: string;
  workout_template_name?: string;
}

export const historyRepository = {
  async getWorkoutHistory(userId: string = 'local_user', limit: number = 50): Promise<CompletedWorkoutHistoryItem[]> {
    if (userId && userId !== 'local_user') {
      return queryAll<CompletedWorkoutHistoryItem>(
        `SELECT ws.*, s.name as split_name, wt.name as workout_template_name
         FROM workout_sessions ws
         LEFT JOIN splits s ON ws.split_id = s.id
         LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
         WHERE (ws.user_id = ? OR ws.user_id = 'local_user') AND ws.status = 'completed'
         ORDER BY ws.started_at DESC
         LIMIT ?;`,
        [userId, limit]
      );
    }
    return queryAll<CompletedWorkoutHistoryItem>(
      `SELECT ws.*, s.name as split_name, wt.name as workout_template_name
       FROM workout_sessions ws
       LEFT JOIN splits s ON ws.split_id = s.id
       LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
       WHERE ws.user_id = ? AND ws.status = 'completed'
       ORDER BY ws.started_at DESC
       LIMIT ?;`,
      [userId, limit]
    );
  },

  async getSessionById(sessionId: string): Promise<CompletedWorkoutHistoryItem | null> {
    return queryFirst<CompletedWorkoutHistoryItem>(
      `SELECT ws.*, s.name as split_name, wt.name as workout_template_name
       FROM workout_sessions ws
       LEFT JOIN splits s ON ws.split_id = s.id
       LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
       WHERE ws.id = ?;`,
      [sessionId]
    );
  },

  async getWorkoutsByDateRange(
    userId: string,
    startTimestamp: number,
    endTimestamp: number
  ): Promise<CompletedWorkoutHistoryItem[]> {
    return queryAll<CompletedWorkoutHistoryItem>(
      `SELECT ws.*, s.name as split_name, wt.name as workout_template_name
       FROM workout_sessions ws
       LEFT JOIN splits s ON ws.split_id = s.id
       LEFT JOIN workout_templates wt ON ws.workout_template_id = wt.id
       WHERE ws.user_id = ? AND ws.status = 'completed'
       AND ws.started_at >= ? AND ws.started_at <= ?
       ORDER BY ws.started_at ASC;`,
      [userId, startTimestamp, endTimestamp]
    );
  },
};
