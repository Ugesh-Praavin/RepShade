import { queryFirst, execute } from '../database/client';

export interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  active_split_id: string | null;
  created_at: number;
  updated_at: number;
}

export const userRepository = {
  async getUser(id: string): Promise<UserRow | null> {
    return queryFirst<UserRow>('SELECT * FROM users WHERE id = ?;', [id]);
  },

  async upsertUser(user: {
    id: string;
    email: string;
    displayName?: string | null;
    photoUrl?: string | null;
    activeSplitId?: string | null;
  }): Promise<void> {
    const now = Date.now();
    await execute(
      `INSERT INTO users (id, email, display_name, photo_url, active_split_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         display_name = COALESCE(excluded.display_name, users.display_name),
         photo_url = COALESCE(excluded.photo_url, users.photo_url),
         active_split_id = COALESCE(excluded.active_split_id, users.active_split_id),
         updated_at = excluded.updated_at;`,
      [
        user.id,
        user.email,
        user.displayName ?? null,
        user.photoUrl ?? null,
        user.activeSplitId ?? null,
        now,
        now,
      ]
    );
  },

  async setActiveSplit(userId: string, splitId: string): Promise<void> {
    await execute(
      'UPDATE users SET active_split_id = ?, updated_at = ? WHERE id = ?;',
      [splitId, Date.now(), userId]
    );
  },
};
