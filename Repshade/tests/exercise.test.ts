import { SYSTEM_EXERCISES } from '../src/constants/defaultExercises';

describe('Repshade Exercise Library & Dataset', () => {
  it('should bundle at least 30+ system exercises offline', () => {
    expect(SYSTEM_EXERCISES.length).toBeGreaterThanOrEqual(30);
  });

  it('should have stable sys_ prefixed IDs for all system exercises', () => {
    for (const ex of SYSTEM_EXERCISES) {
      expect(ex.id).toMatch(/^sys_[a-z0-9_]+$/);
      expect(ex.name).toBeTruthy();
      expect(ex.primaryMuscle).toBeTruthy();
      expect(ex.equipment).toBeTruthy();
    }
  });

  it('should cover all required core muscle groups', () => {
    const muscles = new Set(SYSTEM_EXERCISES.map((e) => e.primaryMuscle));
    const required = [
      'Chest',
      'Back',
      'Shoulders',
      'Quadriceps',
      'Hamstrings',
      'Biceps',
      'Triceps',
      'Core',
      'Calves',
    ];

    for (const req of required) {
      expect(muscles.has(req)).toBe(true);
    }
  });

  it('should filter correctly by search query and muscle group', () => {
    const chestExercises = SYSTEM_EXERCISES.filter(
      (e) => e.primaryMuscle.toLowerCase() === 'chest'
    );
    expect(chestExercises.length).toBeGreaterThanOrEqual(5);

    const benchMatches = SYSTEM_EXERCISES.filter((e) =>
      e.name.toLowerCase().includes('bench')
    );
    expect(benchMatches.length).toBeGreaterThanOrEqual(3);
  });
});
