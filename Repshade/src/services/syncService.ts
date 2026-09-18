import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { syncRepository, SyncOperationRow } from '../repositories/syncRepository';

export const syncService = {
  /**
   * Enqueues an offline-first mutation operation into local SQLite
   */
  async enqueue(params: {
    userId: string;
    operation: 'create' | 'update' | 'delete';
    entityType: string;
    entityId: string;
    payload: Record<string, any>;
  }): Promise<string> {
    return syncRepository.queueOperation(params);
  },

  /**
   * Processes all pending offline sync operations asynchronously in background and updates Firestore
   */
  async processPendingQueue(userId: string = 'local_user'): Promise<{ processed: number; failed: number }> {
    const pending = await syncRepository.getPendingOperations(userId);
    let processed = 0;
    let failed = 0;

    for (const op of pending) {
      try {
        let payloadObj = {};
        try {
          payloadObj = JSON.parse(op.payload);
        } catch {
          payloadObj = { raw: op.payload };
        }

        // Upload to Firestore document: users/{userId}/{entity_type}s/{entity_id}
        if (firestore) {
          const collectionName = op.entity_type.endsWith('s') ? op.entity_type : `${op.entity_type}s`;
          const docRef = doc(firestore, 'users', userId, collectionName, op.entity_id);
          await setDoc(docRef, {
            ...payloadObj,
            entityId: op.entity_id,
            syncedAt: Date.now(),
            operation: op.operation,
          }, { merge: true });
        }

        await syncRepository.markOperationComplete(op.id);
        processed++;
      } catch (e) {
        // If offline or network error, mark as failed retry (remains pending locally)
        await syncRepository.markOperationFailed(op.id);
        failed++;
      }
    }

    return { processed, failed };
  },

  /**
   * Get total number of pending queue operations
   */
  async getPendingCount(userId: string = 'local_user'): Promise<number> {
    return syncRepository.getPendingCount(userId);
  },
};
