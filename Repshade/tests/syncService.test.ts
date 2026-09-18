import { syncService } from '../src/services/syncService';
import { WorkoutSummaryInfo } from '../src/stores/workoutStore';
import { WorkoutSetRow } from '../src/repositories/workoutRepository';
import { SplitRow } from '../src/repositories/splitRepository';
import { WorkoutWithExercises } from '../src/stores/splitStore';
import { doc, setDoc } from 'firebase/firestore';

describe('Firestore syncService', () => {
  const testUserId = 'test_user_firestore_123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully sync user profile to users/{userId}', async () => {
    const user = {
      uid: testUserId,
      email: 'athlete@repshade.app',
      displayName: 'RepShade Athlete',
      photoURL: 'https://example.com/avatar.jpg',
    };

    await syncService.syncUserProfile(user, { bio: 'Powerlifter' });

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId);
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        uid: testUserId,
        email: 'athlete@repshade.app',
        displayName: 'RepShade Athlete',
        photoURL: 'https://example.com/avatar.jpg',
        bio: 'Powerlifter',
      }),
      { merge: true }
    );
  });

  it('should successfully sync user settings to users/{userId}/settings/preferences', async () => {
    await syncService.syncUserSettings(testUserId, {
      weight_unit: 'lb',
      default_rest_seconds: 120,
      auto_start_rest_timer: 1,
    });

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'settings', 'preferences');
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        weight_unit: 'lb',
        default_rest_seconds: 120,
        auto_start_rest_timer: 1,
      }),
      { merge: true }
    );
  });

  it('should successfully sync completed workout session, sets, and root collection', async () => {
    const sessionId = 'test_session_sync_456';
    const summary: WorkoutSummaryInfo = {
      session: {
        id: sessionId,
        user_id: testUserId,
        split_id: 'split_1',
        workout_template_id: 'template_1',
        started_at: Date.now() - 3600000,
        completed_at: Date.now(),
        duration_seconds: 3600,
        total_volume: 5000,
        total_sets: 6,
        total_reps: 60,
        status: 'completed',
        split_advanced: 1,
        notes: null,
        created_at: Date.now() - 3600000,
        updated_at: Date.now(),
      },
      templateName: 'Push A',
      templateDescription: 'Chest, Shoulders & Triceps',
      totalVolume: 5000,
      totalSets: 6,
      totalReps: 60,
      durationSeconds: 3600,
      prsAchieved: [{ exerciseName: 'Barbell Bench Press', weight: 100, reps: 5 }],
      breakdown: [
        {
          exerciseId: 'ex_bench',
          exerciseName: 'Barbell Bench Press',
          setsCount: 3,
          bestWeight: 100,
          bestReps: 5,
          volume: 2500,
          isPR: true,
        },
      ],
      nextWorkoutName: 'Pull A',
      nextWorkoutDescription: 'Back & Biceps',
      currentSplitIndex: 1,
      totalSplitWorkouts: 3,
    };

    const completedSets: WorkoutSetRow[] = [
      {
        id: 'set_1',
        workout_session_id: sessionId,
        workout_exercise_id: 'we_1',
        exercise_id: 'ex_bench',
        set_number: 1,
        weight: 100,
        reps: 5,
        rpe: 8,
        rir: 2,
        set_type: 'normal',
        completed: 1,
        duration_seconds: null,
        distance: null,
        notes: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    ];

    await syncService.syncCompletedWorkout(testUserId, summary, completedSets);

    // 1. users/{userId}/workout_sessions/{sessionId}
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'workout_sessions', sessionId);
    // 2. users/{userId}/workout_sessions/{sessionId}/sets/set_1
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'workout_sessions', sessionId, 'sets', 'set_1');
    // 3. workout_sessions/{sessionId} (root collection)
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'workout_sessions', sessionId);
    // 4. users/{userId}/prs/ex_bench
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'prs', 'ex_bench');
  });

  it('should successfully sync split and active split to Firestore', async () => {
    const split: SplitRow = {
      id: 'split_123',
      user_id: testUserId,
      name: 'Push Pull Legs',
      description: 'Classic 3-day split',
      current_workout_index: 0,
      is_active: 1,
      created_at: Date.now(),
      updated_at: Date.now(),
    };

    const workouts: WorkoutWithExercises[] = [
      {
        id: 'workout_push',
        split_id: 'split_123',
        user_id: testUserId,
        name: 'Push Day',
        description: 'Chest and triceps',
        workout_order: 0,
        estimated_duration_minutes: 60,
        created_at: Date.now(),
        updated_at: Date.now(),
        exercises: [],
      },
    ];

    await syncService.syncSplit(testUserId, split, workouts);

    // users/{userId}/splits/{splitId}
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'splits', 'split_123');
    // users/{userId}/active_split/current
    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'active_split', 'current');
  });

  it('should successfully sync body weight logs to users/{userId}/body_weight_logs/{id}', async () => {
    const now = Date.now();
    await syncService.syncBodyWeight(testUserId, 82.5, 'kg', now);

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', testUserId, 'body_weight_logs', expect.any(String));
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: testUserId,
        weight: 82.5,
        unit: 'kg',
        recordedAt: now,
      }),
      { merge: true }
    );
  });

  it('should migrate guest data from local_user to new authenticated user ID', async () => {
    const result = await syncService.migrateGuestDataToUser('firebase_auth_user_999');
    expect(result).toBeDefined();
    expect(result.migratedCount).toBeGreaterThanOrEqual(0);
  });

  it('should safely no-op migrateGuestDataToUser when given local_user or empty ID', async () => {
    const res1 = await syncService.migrateGuestDataToUser('local_user');
    expect(res1.migratedCount).toBe(0);

    const res2 = await syncService.migrateGuestDataToUser('');
    expect(res2.migratedCount).toBe(0);
  });

  it('should run syncAllLocalDataToFirestore without throwing for valid userId', async () => {
    const result = await syncService.syncAllLocalDataToFirestore('firebase_auth_user_999');
    expect(result).toBeDefined();
    expect(typeof result.workoutsSynced).toBe('number');
    expect(typeof result.splitsSynced).toBe('number');
    expect(typeof result.prsSynced).toBe('number');
  });
});
