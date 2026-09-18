// Core Domain & Application Types for Repshade

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'full_body'
  | 'other';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'smith_machine'
  | 'kettlebell'
  | 'bands'
  | 'other';

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export type WorkoutSessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType;
  instructions?: string;
  isCustom: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutExerciseTemplate {
  id: string;
  workoutTemplateId: string;
  exerciseId: string;
  exercise?: Exercise;
  order: number;
  targetSets: number;
  targetRepMin: number;
  targetRepMax: number;
  restSeconds: number;
  setType: SetType;
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  splitId: string;
  name: string;
  description?: string;
  order: number;
  exercises: WorkoutExerciseTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface Split {
  id: string;
  userId: string;
  name: string;
  description?: string;
  currentWorkoutIndex: number;
  workouts: WorkoutTemplate[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSet {
  id: string;
  workoutSessionId: string;
  exerciseId: string;
  setNumber: number;
  type: SetType;
  weightKg: number;
  reps: number;
  targetReps?: number;
  rpe?: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  splitId?: string;
  workoutTemplateId?: string;
  workoutName: string;
  status: WorkoutSessionStatus;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  notes?: string;
  sets: WorkoutSet[];
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  weightUnit: 'kg' | 'lbs';
  hasCompletedOnboarding: boolean;
  activeSplitId?: string;
  createdAt: string;
  updatedAt: string;
}
