import { splitRepository } from '../src/repositories/splitRepository';
import { resetDatabase } from '../src/database/client';

describe('Routine Customization and Data Reset Engine', () => {
  it('should format split customization helper methods cleanly', () => {
    expect(typeof splitRepository.updateSplitName).toBe('function');
    expect(typeof splitRepository.addWorkoutToSplit).toBe('function');
    expect(typeof splitRepository.deleteWorkoutFromSplit).toBe('function');
    expect(typeof splitRepository.renameWorkoutInSplit).toBe('function');
    expect(typeof splitRepository.addExerciseToWorkout).toBe('function');
    expect(typeof splitRepository.removeExerciseFromWorkout).toBe('function');
    expect(typeof splitRepository.updateWorkoutExerciseTargetConfig).toBe('function');
  });

  it('should expose resetDatabase helper for full table purging', () => {
    expect(typeof resetDatabase).toBe('function');
  });
});
