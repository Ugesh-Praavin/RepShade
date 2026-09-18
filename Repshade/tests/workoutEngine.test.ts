import { workoutEngine } from '../src/domain/workout/workoutEngine';

describe('Repshade Workout Domain Engine', () => {
  describe('State Transitions', () => {
    it('should allow valid transitions from planned', () => {
      expect(workoutEngine.canTransition('planned', 'in_progress')).toBe(true);
      expect(workoutEngine.canTransition('planned', 'skipped')).toBe(true);
      expect(workoutEngine.canTransition('planned', 'abandoned')).toBe(true);
      expect(workoutEngine.canTransition('planned', 'completed')).toBe(false);
    });

    it('should allow valid transitions from in_progress', () => {
      expect(workoutEngine.canTransition('in_progress', 'paused')).toBe(true);
      expect(workoutEngine.canTransition('in_progress', 'completed')).toBe(true);
      expect(workoutEngine.canTransition('in_progress', 'abandoned')).toBe(true);
      expect(workoutEngine.canTransition('in_progress', 'planned')).toBe(false);
    });

    it('should not allow transitions from completed terminal state', () => {
      expect(workoutEngine.canTransition('completed', 'in_progress')).toBe(false);
      expect(workoutEngine.canTransition('completed', 'planned')).toBe(false);
    });
  });

  describe('Volume & Reps Calculation', () => {
    const sampleSets = [
      { id: '1', weight: 100, reps: 5, completed: 1 }, // 500
      { id: '2', weight: 100, reps: 5, completed: 1 }, // 500
      { id: '3', weight: 100, reps: 4, completed: true }, // 400
      { id: '4', weight: 100, reps: 5, completed: 0 }, // not completed -> 0
      { id: '5', weight: 80, reps: 8, completed: false }, // not completed -> 0
    ];

    it('should compute total volume only for completed sets', () => {
      const volume = workoutEngine.calculateTotalVolume(sampleSets);
      expect(volume).toBe(1400);
    });

    it('should calculate completed sets count accurately', () => {
      const count = workoutEngine.calculateCompletedSetsCount(sampleSets);
      expect(count).toBe(3);
    });

    it('should calculate total reps accurately for completed sets', () => {
      const reps = workoutEngine.calculateTotalReps(sampleSets);
      expect(reps).toBe(14);
    });
  });

  describe('Estimated 1RM (Brzycki Formula)', () => {
    it('should return exact weight for 1 rep', () => {
      expect(workoutEngine.calculateEstimated1RM(100, 1)).toBe(100);
    });

    it('should return 0 for 0 or negative values', () => {
      expect(workoutEngine.calculateEstimated1RM(0, 5)).toBe(0);
      expect(workoutEngine.calculateEstimated1RM(100, 0)).toBe(0);
      expect(workoutEngine.calculateEstimated1RM(-50, 5)).toBe(0);
    });

    it('should calculate 1RM for standard rep ranges accurately', () => {
      // 100kg x 5 reps -> 100 * (36 / 32) = 112.5
      expect(workoutEngine.calculateEstimated1RM(100, 5)).toBe(112.5);

      // 80kg x 10 reps -> 80 * (36 / 27) = 106.666... -> 106.7
      expect(workoutEngine.calculateEstimated1RM(80, 10)).toBe(106.7);
    });

    it('should protect against extreme reps (>= 37)', () => {
      expect(workoutEngine.calculateEstimated1RM(50, 40)).toBe(50);
    });
  });

  describe('Duration Formatting', () => {
    it('should format seconds into MM:SS when under 1 hour', () => {
      expect(workoutEngine.formatDuration(0)).toBe('00:00');
      expect(workoutEngine.formatDuration(65)).toBe('01:05');
      expect(workoutEngine.formatDuration(862)).toBe('14:22');
      expect(workoutEngine.formatDuration(3599)).toBe('59:59');
    });

    it('should format seconds into HH:MM:SS when 1 hour or over', () => {
      expect(workoutEngine.formatDuration(3600)).toBe('01:00:00');
      expect(workoutEngine.formatDuration(3665)).toBe('01:01:05');
      expect(workoutEngine.formatDuration(5425)).toBe('01:30:25');
    });
  });
});
