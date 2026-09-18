import { queryAll, execute } from '../database/client';
import { generateUUID } from '../utils/uuid';
import { syncService } from '../services/syncService';

export interface BodyWeightRow {
  id: string;
  user_id: string;
  weight: number;
  unit: 'kg' | 'lb';
  recorded_at: number;
  created_at: number;
  updated_at: number;
}

export const progressRepository = {
  async getWeeklyVolume(userId: string, weeksCount: number = 8): Promise<{ weekStart: number; totalVolume: number }[]> {
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const cutoff = now - weeksCount * oneWeekMs;

    const sessions = await queryAll<{ started_at: number; total_volume: number }>(
      `SELECT started_at, total_volume 
       FROM workout_sessions 
       WHERE user_id = ? AND status = 'completed' AND started_at >= ?
       ORDER BY started_at ASC;`,
      [userId, cutoff]
    );

    const weekBuckets: Record<number, number> = {};
    for (const session of sessions) {
      // Bucket by week starting epoch
      const weekIndex = Math.floor((session.started_at - cutoff) / oneWeekMs);
      const weekTimestamp = cutoff + weekIndex * oneWeekMs;
      weekBuckets[weekTimestamp] = (weekBuckets[weekTimestamp] || 0) + (session.total_volume || 0);
    }

    return Object.entries(weekBuckets).map(([ts, vol]) => ({
      weekStart: Number(ts),
      totalVolume: Math.round(vol),
    }));
  },

  async logBodyWeight(userId: string, weight: number, unit: 'kg' | 'lb' = 'kg'): Promise<string> {
    const id = generateUUID();
    const now = Date.now();
    await execute(
      `INSERT INTO body_weight_entries (id, user_id, weight, unit, recorded_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [id, userId, weight, unit, now, now, now]
    );

    // Background sync to Firestore (queues for offline if network is unavailable)
    syncService.syncBodyWeight(userId, weight, unit, now).catch((err) => {
      console.warn('Background syncBodyWeight failed:', err);
    });

    return id;
  },

  async getBodyWeightHistory(userId: string, limit: number = 30): Promise<BodyWeightRow[]> {
    return queryAll<BodyWeightRow>(
      'SELECT * FROM body_weight_entries WHERE user_id = ? ORDER BY recorded_at DESC LIMIT ?;',
      [userId, limit]
    );
  },
};
