import { doc, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { firestore } from '../../firebase/config';
import { syncRepository } from '../repositories/syncRepository';
import { WorkoutSetRow } from '../repositories/workoutRepository';
import { SplitRow } from '../repositories/splitRepository';
import { WorkoutWithExercises } from '../stores/splitStore';
import { WorkoutSummaryInfo } from '../stores/workoutStore';
import { AuthUser } from './authService';
import { generateUUID } from '../utils/uuid';

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
   * Syncs user profile data directly to Firestore
   */
  async syncUserProfile(user: AuthUser, extraData?: Record<string, any>): Promise<void> {
    if (!user || !user.uid) return;

    const payload = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Athlete',
      photoURL: user.photoURL || null,
      platform: Platform.OS,
      lastLoginAt: Date.now(),
      updatedAt: Date.now(),
      ...extraData,
    };

    if (firestore) {
      try {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, payload, { merge: true });
        return;
      } catch (err) {
        console.warn('Direct Firestore user sync failed, enqueueing offline:', err);
      }
    }

    // Enqueue if offline or failed
    await this.enqueue({
      userId: user.uid,
      operation: 'update',
      entityType: 'user_profile',
      entityId: user.uid,
      payload,
    });
  },

  /**
   * Syncs user settings to Firestore
   */
  async syncUserSettings(userId: string, settings: Record<string, any>): Promise<void> {
    if (!userId) return;

    const payload = {
      ...settings,
      updatedAt: Date.now(),
    };

    if (firestore) {
      try {
        const settingsRef = doc(firestore, 'users', userId, 'settings', 'preferences');
        await setDoc(settingsRef, payload, { merge: true });

        // Also merge into user document for quick access
        const userRef = doc(firestore, 'users', userId);
        await setDoc(userRef, { settings: payload, updatedAt: Date.now() }, { merge: true });
        return;
      } catch (err) {
        console.warn('Direct Firestore settings sync failed, enqueueing offline:', err);
      }
    }

    await this.enqueue({
      userId,
      operation: 'update',
      entityType: 'user_settings',
      entityId: 'preferences',
      payload,
    });
  },

  /**
   * Syncs a completed workout session with full sets, volume, PRs, and exercise breakdown to Firestore
   */
  async syncCompletedWorkout(
    userId: string,
    summary: WorkoutSummaryInfo,
    completedSets: WorkoutSetRow[]
  ): Promise<void> {
    if (!userId || !summary || !summary.session) return;

    const sessionId = summary.session.id;
    const setsPayload = completedSets.map((s) => ({
      id: s.id,
      workoutSessionId: sessionId,
      workoutExerciseId: s.workout_exercise_id,
      exerciseId: s.exercise_id,
      setNumber: s.set_number,
      weight: s.weight,
      reps: s.reps,
      setType: s.set_type,
      completed: s.completed,
      rpe: s.rpe ?? null,
      rir: s.rir ?? null,
      updatedAt: s.updated_at || Date.now(),
    }));

    const workoutPayload = {
      id: sessionId,
      userId,
      splitId: summary.session.split_id,
      workoutTemplateId: summary.session.workout_template_id,
      workoutName: summary.templateName,
      workoutDescription: summary.templateDescription,
      startedAt: summary.session.started_at,
      completedAt: summary.session.completed_at || Date.now(),
      durationSeconds: summary.durationSeconds,
      totalVolume: summary.totalVolume,
      totalSets: summary.totalSets,
      totalReps: summary.totalReps,
      status: 'completed',
      breakdown: summary.breakdown || [],
      sets: setsPayload,
      prsAchieved: summary.prsAchieved || [],
      syncedAt: Date.now(),
    };

    if (firestore) {
      try {
        // 1. User subcollection: users/{userId}/workout_sessions/{sessionId}
        const userSessionRef = doc(firestore, 'users', userId, 'workout_sessions', sessionId);
        await setDoc(userSessionRef, workoutPayload, { merge: true });

        // 2. Also save each individual set in subcollection: users/{userId}/workout_sessions/{sessionId}/sets/{setId}
        for (const s of setsPayload) {
          const setRef = doc(firestore, 'users', userId, 'workout_sessions', sessionId, 'sets', s.id);
          await setDoc(setRef, s, { merge: true });
        }

        // 3. Top-level collection for cross-querying: workout_sessions/{sessionId}
        const rootSessionRef = doc(firestore, 'workout_sessions', sessionId);
        await setDoc(rootSessionRef, workoutPayload, { merge: true });

        // 4. Update Personal Records in Firestore: users/{userId}/prs/{exerciseId}
        if (summary.breakdown && summary.breakdown.length > 0) {
          for (const item of summary.breakdown) {
            if (item.bestWeight > 0) {
              const prRef = doc(firestore, 'users', userId, 'prs', item.exerciseId);
              await setDoc(
                prRef,
                {
                  exerciseId: item.exerciseId,
                  exerciseName: item.exerciseName,
                  bestWeight: item.bestWeight,
                  bestReps: item.bestReps,
                  lastVolume: item.volume,
                  lastSessionId: sessionId,
                  achievedAt: Date.now(),
                },
                { merge: true }
              );
            }
          }
        }

        console.log(`[Firestore] Successfully synced workout ${sessionId} to Firestore for user ${userId}`);
        return;
      } catch (err) {
        console.warn('Direct Firestore workout sync failed, enqueueing offline:', err);
      }
    }

    // Enqueue for offline sync
    await this.enqueue({
      userId,
      operation: 'create',
      entityType: 'workout_session',
      entityId: sessionId,
      payload: workoutPayload,
    });
  },

  /**
   * Syncs active split and workout templates to Firestore
   */
  async syncSplit(userId: string, split: SplitRow, workouts: WorkoutWithExercises[]): Promise<void> {
    if (!userId || !split) return;

    const payload = {
      id: split.id,
      userId,
      name: split.name,
      description: split.description,
      currentWorkoutIndex: split.current_workout_index,
      workoutsCount: workouts.length,
      workouts: workouts.map((w) => ({
        id: w.id,
        name: w.name,
        description: w.description,
        orderIndex: w.workout_order,
        exercises: (w.exercises || []).map((e) => ({
          id: e.id,
          exerciseId: e.exercise_id,
          exerciseName: e.exercise_name,
          targetSets: e.target_sets,
          targetRepMin: e.target_rep_min,
          targetRepMax: e.target_rep_max,
          restSeconds: e.rest_seconds,
        })),
      })),
      updatedAt: Date.now(),
    };

    if (firestore) {
      try {
        const splitRef = doc(firestore, 'users', userId, 'splits', split.id);
        await setDoc(splitRef, payload, { merge: true });

        const activeRef = doc(firestore, 'users', userId, 'active_split', 'current');
        await setDoc(activeRef, payload, { merge: true });
        return;
      } catch (err) {
        console.warn('Direct Firestore split sync failed, enqueueing offline:', err);
      }
    }

    await this.enqueue({
      userId,
      operation: 'update',
      entityType: 'split',
      entityId: split.id,
      payload,
    });
  },

  /**
   * Syncs body weight tracking entries to Firestore
   */
  async syncBodyWeight(
    userId: string,
    weight: number,
    unit: 'kg' | 'lb' = 'kg',
    recordedAt: number = Date.now()
  ): Promise<void> {
    if (!userId) return;

    const id = generateUUID();
    const payload = {
      id,
      userId,
      weight,
      unit,
      recordedAt,
      syncedAt: Date.now(),
    };

    if (firestore) {
      try {
        const logRef = doc(firestore, 'users', userId, 'body_weight_logs', id);
        await setDoc(logRef, payload, { merge: true });
        return;
      } catch (err) {
        console.warn('Direct Firestore body weight sync failed, enqueueing offline:', err);
      }
    }

    await this.enqueue({
      userId,
      operation: 'create',
      entityType: 'body_weight',
      entityId: id,
      payload,
    });
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
        let payloadObj: Record<string, any> = {};
        try {
          payloadObj = JSON.parse(op.payload);
        } catch {
          payloadObj = { raw: op.payload };
        }

        // Upload to Firestore document: users/{userId}/{entity_type}s/{entity_id}
        if (firestore) {
          const collectionName = op.entity_type.endsWith('s') ? op.entity_type : `${op.entity_type}s`;
          const docRef = doc(firestore, 'users', userId, collectionName, op.entity_id);
          await setDoc(
            docRef,
            {
              ...payloadObj,
              entityId: op.entity_id,
              syncedAt: Date.now(),
              operation: op.operation,
            },
            { merge: true }
          );
        }

        await syncRepository.markOperationComplete(op.id);
        processed++;
      } catch {
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
