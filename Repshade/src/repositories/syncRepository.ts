import { queryAll, queryFirst, execute } from '../database/client';
import { generateUUID } from '../utils/uuid';

export interface SyncOperationRow {
  id: string;
  user_id: string;
  operation: 'create' | 'update' | 'delete';
  entity_type: string;
  entity_id: string;
  payload: string;
  created_at: number;
  retry_count: number;
  last_attempt_at: number | null;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
}

export const syncRepository = {
  async queueOperation(params: {
    userId: string;
    operation: 'create' | 'update' | 'delete';
    entityType: string;
    entityId: string;
    payload: Record<string, any>;
  }): Promise<string> {
    const id = generateUUID();
    const now = Date.now();
    await execute(
      `INSERT INTO sync_operations (
        id, user_id, operation, entity_type, entity_id, payload, created_at, retry_count, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending');`,
      [
        id,
        params.userId,
        params.operation,
        params.entityType,
        params.entityId,
        JSON.stringify(params.payload),
        now,
      ]
    );
    return id;
  },

  async getPendingOperations(userId?: string, limit: number = 50): Promise<SyncOperationRow[]> {
    if (userId) {
      return queryAll<SyncOperationRow>(
        `SELECT * FROM sync_operations 
         WHERE user_id = ? AND (status = 'pending' OR status = 'failed') 
         ORDER BY created_at ASC LIMIT ?;`,
        [userId, limit]
      );
    }
    return queryAll<SyncOperationRow>(
      `SELECT * FROM sync_operations 
       WHERE status = 'pending' OR status = 'failed' 
       ORDER BY created_at ASC LIMIT ?;`,
      [limit]
    );
  },

  async markOperationComplete(id: string): Promise<void> {
    await execute('DELETE FROM sync_operations WHERE id = ?;', [id]);
  },

  async markOperationFailed(id: string): Promise<void> {
    await execute(
      `UPDATE sync_operations 
       SET retry_count = retry_count + 1, last_attempt_at = ?, status = 'failed' 
       WHERE id = ?;`,
      [Date.now(), id]
    );
  },

  async getPendingCount(userId?: string): Promise<number> {
    let row: { count: number } | null;
    if (userId) {
      row = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM sync_operations WHERE user_id = ? AND status != 'completed';`,
        [userId]
      );
    } else {
      row = await queryFirst<{ count: number }>(
        `SELECT COUNT(*) as count FROM sync_operations WHERE status != 'completed';`
      );
    }
    return row?.count || 0;
  },
};
