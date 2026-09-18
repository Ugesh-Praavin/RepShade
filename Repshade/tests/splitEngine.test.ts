import { splitEngine } from '../src/domain/split/splitEngine';

describe('Repshade Rolling Split Domain Engine', () => {
  const samplePPL = [
    { name: 'Push Day A' },
    { name: 'Pull Day A' },
    { name: 'Legs Day A' },
  ];

  it('should return initial workout at index 0 (Push Day A)', () => {
    const next = splitEngine.getNextWorkout({
      currentWorkoutIndex: 0,
      workouts: samplePPL,
    });
    expect(next?.name).toBe('Push Day A');
  });

  it('should advance to Pull Day A after completing Push Day A', () => {
    const result = splitEngine.advanceWorkout({
      currentWorkoutIndex: 0,
      workouts: samplePPL,
    });

    expect(result.currentWorkoutIndex).toBe(1);
    expect(result.nextWorkout?.name).toBe('Pull Day A');
  });

  it('should advance from Pull Day A to Legs Day A', () => {
    const result = splitEngine.advanceWorkout({
      currentWorkoutIndex: 1,
      workouts: samplePPL,
    });

    expect(result.currentWorkoutIndex).toBe(2);
    expect(result.nextWorkout?.name).toBe('Legs Day A');
  });

  it('should wraparound from Legs Day A back to Push Day A (Modulo Cycle)', () => {
    const result = splitEngine.advanceWorkout({
      currentWorkoutIndex: 2,
      workouts: samplePPL,
    });

    expect(result.currentWorkoutIndex).toBe(0);
    expect(result.nextWorkout?.name).toBe('Push Day A');
  });

  it('should maintain unchanged position across simulated calendar days if no workout completed', () => {
    // Simulating user missing Monday, Tuesday, Wednesday
    const mondayState = { currentWorkoutIndex: 1, workouts: samplePPL };
    const thursdayNext = splitEngine.getNextWorkout(mondayState);

    // Thursday still yields Pull Day A
    expect(thursdayNext?.name).toBe('Pull Day A');
    expect(mondayState.currentWorkoutIndex).toBe(1);
  });

  it('should advance immediately on manual skip', () => {
    const result = splitEngine.skipWorkout({
      currentWorkoutIndex: 1, // Currently on Pull
      workouts: samplePPL,
    });

    // Skipped to Legs
    expect(result.currentWorkoutIndex).toBe(2);
    expect(result.nextWorkout?.name).toBe('Legs Day A');
  });

  it('should reset position back to index 0', () => {
    const result = splitEngine.resetSplit({
      currentWorkoutIndex: 2,
      workouts: samplePPL,
    });

    expect(result.currentWorkoutIndex).toBe(0);
    expect(result.nextWorkout?.name).toBe('Push Day A');
  });

  it('should handle single-workout splits gracefully', () => {
    const singleWorkoutSplit = [{ name: 'Full Body Single' }];

    const next = splitEngine.getNextWorkout({
      currentWorkoutIndex: 0,
      workouts: singleWorkoutSplit,
    });
    expect(next?.name).toBe('Full Body Single');

    const advanced = splitEngine.advanceWorkout({
      currentWorkoutIndex: 0,
      workouts: singleWorkoutSplit,
    });
    expect(advanced.currentWorkoutIndex).toBe(0);
    expect(advanced.nextWorkout?.name).toBe('Full Body Single');
  });

  it('should handle empty splits without throwing errors', () => {
    const next = splitEngine.getNextWorkout({
      currentWorkoutIndex: 0,
      workouts: [],
    });
    expect(next).toBeNull();

    const advanced = splitEngine.advanceWorkout({
      currentWorkoutIndex: 0,
      workouts: [],
    });
    expect(advanced.currentWorkoutIndex).toBe(0);
    expect(advanced.nextWorkout).toBeNull();
  });
});
