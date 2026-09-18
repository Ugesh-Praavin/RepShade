import { create } from 'zustand';
import { exerciseRepository, ExerciseRow } from '../repositories/exerciseRepository';
import { recordRepository, PersonalRecordRow } from '../repositories/recordRepository';
import { workoutRepository, WorkoutSetRow } from '../repositories/workoutRepository';
import { SYSTEM_EXERCISES } from '../constants/defaultExercises';

export interface ExerciseDetailData {
  exercise: ExerciseRow;
  prs: PersonalRecordRow[];
  recentSets: WorkoutSetRow[];
}

export interface ExerciseStoreState {
  exercises: ExerciseRow[];
  filteredExercises: ExerciseRow[];
  searchQuery: string;
  selectedMuscle: string | null;
  selectedEquipment: string | null;
  isLoading: boolean;
  selectedExerciseDetail: ExerciseDetailData | null;
  error: string | null;

  // Actions
  initializeLibrary: (userId?: string) => Promise<void>;
  loadExercises: (userId?: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedMuscle: (muscle: string | null) => void;
  setSelectedEquipment: (equipment: string | null) => void;
  createCustomExercise: (data: {
    userId: string;
    name: string;
    primaryMuscle: string;
    secondaryMuscles?: string[];
    equipment?: string;
  }) => Promise<string>;
  loadExerciseDetails: (exerciseId: string, userId?: string) => Promise<void>;
}

export const useExerciseStore = create<ExerciseStoreState>((set, get) => ({
  exercises: [],
  filteredExercises: [],
  searchQuery: '',
  selectedMuscle: null,
  selectedEquipment: null,
  isLoading: false,
  selectedExerciseDetail: null,
  error: null,

  initializeLibrary: async (userId?: string) => {
    set({ isLoading: true });
    try {
      // Seed default exercises if not already present
      await exerciseRepository.seedSystemExercises(SYSTEM_EXERCISES);
      await get().loadExercises(userId);
    } catch (err: any) {
      set({ error: err?.message || 'Failed to initialize exercises' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadExercises: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const all = await exerciseRepository.getAllExercises(userId);
      set({ exercises: all });
      applyFilters(set, get);
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load exercises' });
    } finally {
      set({ isLoading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    applyFilters(set, get);
  },

  setSelectedMuscle: (muscle: string | null) => {
    set({ selectedMuscle: muscle });
    applyFilters(set, get);
  },

  setSelectedEquipment: (equipment: string | null) => {
    set({ selectedEquipment: equipment });
    applyFilters(set, get);
  },

  createCustomExercise: async (data) => {
    set({ isLoading: true });
    try {
      const id = await exerciseRepository.createCustomExercise(data);
      await get().loadExercises(data.userId);
      return id;
    } finally {
      set({ isLoading: false });
    }
  },

  loadExerciseDetails: async (exerciseId: string, userId: string = 'local_user') => {
    set({ isLoading: true });
    try {
      const exercise = await exerciseRepository.getExerciseById(exerciseId);
      if (!exercise) return;

      const pr = await recordRepository.getPRForExercise(userId, exerciseId);
      const recent = await workoutRepository.getPreviousPerformance(exerciseId, 10);

      set({
        selectedExerciseDetail: {
          exercise,
          prs: pr ? [pr] : [],
          recentSets: recent,
        },
      });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load exercise details' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

function applyFilters(
  set: (state: Partial<ExerciseStoreState>) => void,
  get: () => ExerciseStoreState
) {
  const { exercises, searchQuery, selectedMuscle, selectedEquipment } = get();
  let result = [...exercises];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.primary_muscle.toLowerCase().includes(q) ||
        (e.equipment && e.equipment.toLowerCase().includes(q))
    );
  }

  if (selectedMuscle) {
    result = result.filter(
      (e) => e.primary_muscle.toLowerCase() === selectedMuscle.toLowerCase()
    );
  }

  if (selectedEquipment) {
    result = result.filter(
      (e) => e.equipment && e.equipment.toLowerCase() === selectedEquipment.toLowerCase()
    );
  }

  set({ filteredExercises: result });
}
