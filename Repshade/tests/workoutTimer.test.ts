import { workoutTimerService } from '../src/services/workoutTimerService';
import { useWorkoutStore } from '../src/stores/workoutStore';

jest.mock('../src/database/client', () => ({
  queryAll: jest.fn().mockResolvedValue([]),
  queryFirst: jest.fn().mockResolvedValue(null),
  execute: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
  withTransaction: jest.fn().mockImplementation((cb) => cb({ execute: jest.fn() })),
  getDatabase: jest.fn().mockResolvedValue({}),
}));

describe('Workout Timer Service & Background Notification Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize workout timer service methods safely', async () => {
    expect(workoutTimerService).toBeDefined();
    expect(typeof workoutTimerService.startTimer).toBe('function');
    expect(typeof workoutTimerService.pauseTimer).toBe('function');
    expect(typeof workoutTimerService.resumeTimer).toBe('function');
    expect(typeof workoutTimerService.stopTimer).toBe('function');
    expect(typeof workoutTimerService.getTimerStatus).toBe('function');
    expect(typeof workoutTimerService.getPendingCompletedWorkout).toBe('function');
    expect(typeof workoutTimerService.clearPendingCompletedWorkout).toBe('function');
  });

  it('should return default timer status when native module is mocked or not android', async () => {
    const status = await workoutTimerService.getTimerStatus();
    expect(status).toEqual({
      isRunning: false,
      isPaused: false,
      sessionId: null,
      workoutName: null,
      startedAt: 0,
      elapsedSeconds: 0,
    });
  });

  it('should handle pending completed workout check gracefully', async () => {
    const pending = await workoutTimerService.getPendingCompletedWorkout();
    expect(pending).toEqual({
      hasPending: false,
      sessionId: null,
      durationSeconds: 0,
      completedAt: 0,
    });
  });

  it('should tick elapsed seconds accurately based on started_at timestamp', () => {
    const store = useWorkoutStore.getState();
    const startedAt = Date.now() - 35000; // 35 seconds ago

    useWorkoutStore.setState({
      activeSession: {
        id: 'test-session-1',
        user_id: 'local_user',
        split_id: 'split-1',
        workout_template_id: 'template-1',
        started_at: startedAt,
        completed_at: null,
        status: 'in_progress',
        duration_seconds: 0,
        total_volume: 0,
        total_sets: 0,
        total_reps: 0,
        notes: null,
        split_advanced: 0,
        created_at: startedAt,
        updated_at: startedAt,
      },
      elapsedSeconds: 0,
      isPaused: false,
      totalPausedMs: 0,
    });

    useWorkoutStore.getState().tickTimers();
    expect(useWorkoutStore.getState().elapsedSeconds).toBeGreaterThanOrEqual(35);
  });

  it('should finish workout with exact duration recorded from notification', async () => {
    const exactDuration = 1845; // 30m 45s recorded by notification button
    const summary = await useWorkoutStore.getState().finishWorkoutWithDuration(exactDuration);

    expect(summary).not.toBeNull();
    expect(summary?.durationSeconds).toBe(exactDuration);
    expect(useWorkoutStore.getState().activeSession).toBeNull();
  });
});

describe('iOS Notification & Timer Integration', () => {
  it('should support iOS notification permissions and background controls', async () => {
    const permResult = await workoutTimerService.requestNotificationPermission();
    expect(permResult).toBe(true);

    const started = await workoutTimerService.startTimer('session-ios-1', 'Push Day A', Date.now());
    expect(started).toBe(true);

    const paused = await workoutTimerService.pauseTimer(120);
    expect(paused).toBe(true);

    const resumed = await workoutTimerService.resumeTimer();
    expect(resumed).toBe(true);

    const stopped = await workoutTimerService.stopTimer();
    expect(stopped).toBe(true);
  });
});
