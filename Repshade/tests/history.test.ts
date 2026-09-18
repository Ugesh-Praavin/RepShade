import { syncService } from '../src/services/syncService';
import { workoutEngine } from '../src/domain/workout/workoutEngine';

describe('Repshade History, Progress & Sync Service Tests', () => {
  it('should calculate estimated 1RM for PR calculations', () => {
    const est = workoutEngine.calculateEstimated1RM(80, 8);
    expect(est).toBe(99.3);
  });

  it('should enqueue offline operations to SQLite sync queue', async () => {
    const id = await syncService.enqueue({
      userId: 'test_user',
      operation: 'create',
      entityType: 'workout_session',
      entityId: 'sess_123',
      payload: { totalVolume: 10000, duration: 2400 },
    });

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
  });

  it('should process pending sync queue items successfully', async () => {
    const result = await syncService.processPendingQueue('test_user');
    expect(result.processed).toBeDefined();
    expect(result.failed).toBe(0);
  });

  it('should format workout history duration accurately', () => {
    expect(workoutEngine.formatDuration(2880)).toBe('48:00');
  });
});
