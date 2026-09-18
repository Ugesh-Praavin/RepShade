export interface PredefinedWorkoutExercise {
  exerciseId: string;
  name: string;
  primaryMuscle: string;
  targetSets: number;
  targetRepMin: number;
  targetRepMax: number;
  restSeconds: number;
}

export interface PredefinedWorkout {
  name: string;
  description: string;
  exercises: PredefinedWorkoutExercise[];
}

export interface PredefinedSplit {
  type: 'ppl' | 'upper_lower' | 'full_body' | 'custom';
  name: string;
  description: string;
  badge: string;
  workouts: PredefinedWorkout[];
}

export const PREDEFINED_SPLITS: Record<string, PredefinedSplit> = {
  ppl: {
    type: 'ppl',
    name: 'Push / Pull / Legs (PPL)',
    description: 'The premier 3-day hypertrophy cycle. Isolates pressing, pulling, and lower body.',
    badge: 'MOST POPULAR',
    workouts: [
      {
        name: 'Push Day A',
        description: 'Chest, Shoulders & Triceps',
        exercises: [
          {
            exerciseId: 'sys_barbell_bench_press',
            name: 'Barbell Bench Press',
            primaryMuscle: 'Chest',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_incline_dumbbell_press',
            name: 'Incline Dumbbell Press',
            primaryMuscle: 'Chest',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 10,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_dumbbell_lateral_raise',
            name: 'Dumbbell Lateral Raise',
            primaryMuscle: 'Shoulders',
            targetSets: 4,
            targetRepMin: 12,
            targetRepMax: 15,
            restSeconds: 60,
          },
          {
            exerciseId: 'sys_tricep_pushdown',
            name: 'Tricep Rope Pushdown',
            primaryMuscle: 'Triceps',
            targetSets: 3,
            targetRepMin: 10,
            targetRepMax: 12,
            restSeconds: 60,
          },
        ],
      },
      {
        name: 'Pull Day A',
        description: 'Back, Rear Delts & Biceps',
        exercises: [
          {
            exerciseId: 'sys_deadlift',
            name: 'Conventional Deadlift',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 5,
            targetRepMax: 5,
            restSeconds: 180,
          },
          {
            exerciseId: 'sys_lat_pulldown',
            name: 'Lat Pulldown (Wide Grip)',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 12,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_seated_cable_row',
            name: 'Seated Cable Row',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 10,
            targetRepMax: 12,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_hammer_curl',
            name: 'Dumbbell Hammer Curl',
            primaryMuscle: 'Biceps',
            targetSets: 3,
            targetRepMin: 10,
            targetRepMax: 12,
            restSeconds: 60,
          },
        ],
      },
      {
        name: 'Legs Day A',
        description: 'Quads, Hamstrings & Calves',
        exercises: [
          {
            exerciseId: 'sys_barbell_squat',
            name: 'Barbell Back Squat',
            primaryMuscle: 'Quadriceps',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 150,
          },
          {
            exerciseId: 'sys_romanian_deadlift',
            name: 'Romanian Deadlift (RDL)',
            primaryMuscle: 'Hamstrings',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 10,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_leg_press',
            name: 'Leg Press',
            primaryMuscle: 'Quadriceps',
            targetSets: 3,
            targetRepMin: 10,
            targetRepMax: 12,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_standing_calf_raise',
            name: 'Standing Calf Raise',
            primaryMuscle: 'Calves',
            targetSets: 4,
            targetRepMin: 12,
            targetRepMax: 15,
            restSeconds: 60,
          },
        ],
      },
    ],
  },

  upper_lower: {
    type: 'upper_lower',
    name: 'Upper / Lower Split',
    description: 'Balanced 2-day rotation allowing higher frequency for strength and muscle.',
    badge: 'OPTIMAL FREQUENCY',
    workouts: [
      {
        name: 'Upper Body A',
        description: 'Chest, Back, Shoulders & Arms',
        exercises: [
          {
            exerciseId: 'sys_barbell_bench_press',
            name: 'Barbell Bench Press',
            primaryMuscle: 'Chest',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_barbell_row',
            name: 'Barbell Bent Over Row',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_overhead_press',
            name: 'Standing Barbell Overhead Press',
            primaryMuscle: 'Shoulders',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 10,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_lat_pulldown',
            name: 'Lat Pulldown (Wide Grip)',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 10,
            targetRepMax: 12,
            restSeconds: 90,
          },
        ],
      },
      {
        name: 'Lower Body A',
        description: 'Quads, Hamstrings & Core',
        exercises: [
          {
            exerciseId: 'sys_barbell_squat',
            name: 'Barbell Back Squat',
            primaryMuscle: 'Quadriceps',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 150,
          },
          {
            exerciseId: 'sys_romanian_deadlift',
            name: 'Romanian Deadlift (RDL)',
            primaryMuscle: 'Hamstrings',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 10,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_leg_extension',
            name: 'Leg Extension',
            primaryMuscle: 'Quadriceps',
            targetSets: 3,
            targetRepMin: 12,
            targetRepMax: 15,
            restSeconds: 60,
          },
          {
            exerciseId: 'sys_hanging_leg_raise',
            name: 'Hanging Leg Raise',
            primaryMuscle: 'Core',
            targetSets: 3,
            targetRepMin: 12,
            targetRepMax: 15,
            restSeconds: 60,
          },
        ],
      },
    ],
  },

  full_body: {
    type: 'full_body',
    name: 'Full Body Routine',
    description: 'Compound movements training every major muscle group in each session.',
    badge: 'TIME EFFICIENT',
    workouts: [
      {
        name: 'Full Body Day A',
        description: 'Squat, Bench, Row Focus',
        exercises: [
          {
            exerciseId: 'sys_barbell_squat',
            name: 'Barbell Back Squat',
            primaryMuscle: 'Quadriceps',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 150,
          },
          {
            exerciseId: 'sys_barbell_bench_press',
            name: 'Barbell Bench Press',
            primaryMuscle: 'Chest',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_barbell_row',
            name: 'Barbell Bent Over Row',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 10,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_dumbbell_lateral_raise',
            name: 'Dumbbell Lateral Raise',
            primaryMuscle: 'Shoulders',
            targetSets: 3,
            targetRepMin: 12,
            targetRepMax: 15,
            restSeconds: 60,
          },
        ],
      },
      {
        name: 'Full Body Day B',
        description: 'Deadlift, Press, Pull Focus',
        exercises: [
          {
            exerciseId: 'sys_deadlift',
            name: 'Conventional Deadlift',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 5,
            targetRepMax: 5,
            restSeconds: 180,
          },
          {
            exerciseId: 'sys_overhead_press',
            name: 'Standing Barbell Overhead Press',
            primaryMuscle: 'Shoulders',
            targetSets: 3,
            targetRepMin: 6,
            targetRepMax: 8,
            restSeconds: 120,
          },
          {
            exerciseId: 'sys_lat_pulldown',
            name: 'Lat Pulldown (Wide Grip)',
            primaryMuscle: 'Back',
            targetSets: 3,
            targetRepMin: 8,
            targetRepMax: 12,
            restSeconds: 90,
          },
          {
            exerciseId: 'sys_barbell_bicep_curl',
            name: 'Barbell Bicep Curl',
            primaryMuscle: 'Biceps',
            targetSets: 3,
            targetRepMin: 10,
            targetRepMax: 12,
            restSeconds: 60,
          },
        ],
      },
    ],
  },
};
