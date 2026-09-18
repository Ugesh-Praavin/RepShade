import { PREDEFINED_SPLITS } from '../src/constants/predefinedSplits';
import { useOnboardingStore } from '../src/stores/onboardingStore';

describe('Repshade Onboarding & Split Configurations', () => {
  it('should have all predefined split templates available', () => {
    expect(PREDEFINED_SPLITS.ppl).toBeDefined();
    expect(PREDEFINED_SPLITS.upper_lower).toBeDefined();
    expect(PREDEFINED_SPLITS.full_body).toBeDefined();
  });

  it('should select PPL template with 3 default workouts', () => {
    useOnboardingStore.getState().selectSplitType('ppl');
    const state = useOnboardingStore.getState();

    expect(state.selectedSplitType).toBe('ppl');
    expect(state.workouts.length).toBe(3);
    expect(state.workouts[0].name).toBe('Push Day A');
    expect(state.workouts[1].name).toBe('Pull Day A');
    expect(state.workouts[2].name).toBe('Legs Day A');
  });

  it('should allow adding, renaming, and removing workouts', () => {
    const store = useOnboardingStore.getState();
    store.addWorkout('Arm Day Special');

    const updated = useOnboardingStore.getState();
    const added = updated.workouts.find((w) => w.name === 'Arm Day Special');
    expect(added).toBeDefined();

    if (added) {
      store.renameWorkout(added.id, 'Arm Day Deluxe');
      expect(
        useOnboardingStore.getState().workouts.find((w) => w.id === added.id)?.name
      ).toBe('Arm Day Deluxe');

      store.deleteWorkout(added.id);
      expect(
        useOnboardingStore.getState().workouts.find((w) => w.id === added.id)
      ).toBeUndefined();
    }
  });

  it('should allow adding exercises and tweaking sets/reps in a workout', () => {
    const store = useOnboardingStore.getState();
    const workoutId = store.workouts[0].id;

    store.addExerciseToWorkout(workoutId, {
      exerciseId: 'sys_close_grip_bench_press',
      name: 'Close-Grip Bench Press',
      primaryMuscle: 'Triceps',
    });

    const workout = useOnboardingStore
      .getState()
      .workouts.find((w) => w.id === workoutId);
    const addedEx = workout?.exercises.find(
      (e) => e.exerciseId === 'sys_close_grip_bench_press'
    );
    expect(addedEx).toBeDefined();
    expect(addedEx?.targetSets).toBe(3);

    store.updateExerciseConfig(workoutId, 'sys_close_grip_bench_press', {
      targetSets: 4,
      restSeconds: 75,
    });

    const updatedEx = useOnboardingStore
      .getState()
      .workouts.find((w) => w.id === workoutId)
      ?.exercises.find((e) => e.exerciseId === 'sys_close_grip_bench_press');

    expect(updatedEx?.targetSets).toBe(4);
    expect(updatedEx?.restSeconds).toBe(75);
  });
});
