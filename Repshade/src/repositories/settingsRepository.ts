import { queryFirst, execute } from '../database/client';
import { syncService } from '../services/syncService';

export interface UserSettingsRow {
  user_id: string;
  weight_unit: 'kg' | 'lb';
  distance_unit: 'km' | 'mi';
  auto_start_rest_timer: number;
  default_rest_seconds: number;
  show_rpe: number;
  show_rir: number;
  theme: 'system' | 'light' | 'dark';
  workout_reminders_enabled: number;
  created_at: number;
  updated_at: number;
}

export const settingsRepository = {
  async getSettings(userId: string): Promise<UserSettingsRow | null> {
    return queryFirst<UserSettingsRow>('SELECT * FROM settings WHERE user_id = ?;', [userId]);
  },

  async initDefaultSettings(userId: string): Promise<void> {
    const now = Date.now();
    await execute(
      `INSERT OR IGNORE INTO settings (
        user_id, weight_unit, distance_unit, auto_start_rest_timer,
        default_rest_seconds, show_rpe, show_rir, theme, workout_reminders_enabled,
        created_at, updated_at
      ) VALUES (?, 'kg', 'km', 1, 90, 1, 0, 'dark', 1, ?, ?);`,
      [userId, now, now]
    );
  },

  async updateSettings(
    userId: string,
    updates: Partial<{
      weight_unit: 'kg' | 'lb';
      distance_unit: 'km' | 'mi';
      auto_start_rest_timer: number;
      default_rest_seconds: number;
      show_rpe: number;
      show_rir: number;
      theme: 'system' | 'light' | 'dark';
      workout_reminders_enabled: number;
    }>
  ): Promise<void> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return;

    const setClauses = fields.map((f) => `${f} = ?`).join(', ') + ', updated_at = ?';
    const values = [...Object.values(updates), Date.now(), userId];

    await execute(`UPDATE settings SET ${setClauses} WHERE user_id = ?;`, values as (string | number)[]);

    // Background sync settings to Firestore
    syncService.syncUserSettings(userId, updates).catch((err) => {
      console.warn('Background syncUserSettings failed:', err);
    });
  },
};
