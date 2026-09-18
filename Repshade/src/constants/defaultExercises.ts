export interface SystemExerciseDefinition {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  trackingType?: string;
  instructions?: string;
}

export const SYSTEM_EXERCISES: SystemExerciseDefinition[] = [
  // CHEST
  {
    id: 'sys_barbell_bench_press',
    name: 'Barbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Barbell',
    instructions: 'Lie on flat bench, grip bar slightly wider than shoulder width, lower bar to mid-chest, press up.',
  },
  {
    id: 'sys_incline_barbell_press',
    name: 'Incline Barbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Barbell',
    instructions: 'Lie on 30-45 degree incline bench, lower bar to upper chest, drive upward.',
  },
  {
    id: 'sys_incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Shoulders', 'Triceps'],
    equipment: 'Dumbbell',
    instructions: 'Sit on inclined bench holding dumbbells at chest height, press upward until arms are extended.',
  },
  {
    id: 'sys_flat_dumbbell_press',
    name: 'Flat Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_dumbbell_fly',
    name: 'Dumbbell Chest Fly',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_cable_chest_fly',
    name: 'Cable Fly (Mid/High)',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
  },
  {
    id: 'sys_chest_dip',
    name: 'Chest Dip',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Shoulders'],
    equipment: 'Bodyweight',
  },
  {
    id: 'sys_push_up',
    name: 'Push Up',
    primaryMuscle: 'Chest',
    secondaryMuscles: ['Triceps', 'Core'],
    equipment: 'Bodyweight',
  },

  // BACK
  {
    id: 'sys_deadlift',
    name: 'Conventional Deadlift',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Core'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_barbell_row',
    name: 'Barbell Bent Over Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_lat_pulldown',
    name: 'Lat Pulldown (Wide Grip)',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    equipment: 'Cable',
  },
  {
    id: 'sys_seated_cable_row',
    name: 'Seated Cable Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps', 'Shoulders'],
    equipment: 'Cable',
  },
  {
    id: 'sys_pull_up',
    name: 'Pull Up',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    equipment: 'Bodyweight',
  },
  {
    id: 'sys_single_arm_dumbbell_row',
    name: 'Single Arm Dumbbell Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_t_bar_row',
    name: 'T-Bar Row',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Biceps'],
    equipment: 'Machine',
  },
  {
    id: 'sys_face_pull',
    name: 'Face Pull',
    primaryMuscle: 'Back',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Cable',
  },

  // SHOULDERS
  {
    id: 'sys_overhead_press',
    name: 'Standing Barbell Overhead Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps', 'Core'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_seated_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Shoulder Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Triceps'],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_dumbbell_lateral_raise',
    name: 'Dumbbell Lateral Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_cable_lateral_raise',
    name: 'Cable Lateral Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: [],
    equipment: 'Cable',
  },
  {
    id: 'sys_rear_delt_fly',
    name: 'Rear Delt Fly / Reverse Pec Deck',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Back'],
    equipment: 'Machine',
  },
  {
    id: 'sys_dumbbell_front_raise',
    name: 'Dumbbell Front Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscles: ['Chest'],
    equipment: 'Dumbbell',
  },

  // LEGS - QUADS & GLUTES
  {
    id: 'sys_barbell_squat',
    name: 'Barbell Back Squat',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_front_squat',
    name: 'Barbell Front Squat',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_leg_press',
    name: 'Leg Press',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes'],
    equipment: 'Machine',
  },
  {
    id: 'sys_hack_squat',
    name: 'Hack Squat',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes'],
    equipment: 'Machine',
  },
  {
    id: 'sys_leg_extension',
    name: 'Leg Extension',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: [],
    equipment: 'Machine',
  },
  {
    id: 'sys_bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_walking_lunge',
    name: 'Walking Dumbbell Lunge',
    primaryMuscle: 'Quadriceps',
    secondaryMuscles: ['Glutes'],
    equipment: 'Dumbbell',
  },

  // LEGS - HAMSTRINGS & CALVES
  {
    id: 'sys_romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    primaryMuscle: 'Hamstrings',
    secondaryMuscles: ['Glutes', 'Back'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_lying_leg_curl',
    name: 'Lying Leg Curl',
    primaryMuscle: 'Hamstrings',
    secondaryMuscles: ['Calves'],
    equipment: 'Machine',
  },
  {
    id: 'sys_seated_leg_curl',
    name: 'Seated Leg Curl',
    primaryMuscle: 'Hamstrings',
    secondaryMuscles: [],
    equipment: 'Machine',
  },
  {
    id: 'sys_standing_calf_raise',
    name: 'Standing Calf Raise',
    primaryMuscle: 'Calves',
    secondaryMuscles: [],
    equipment: 'Machine',
  },
  {
    id: 'sys_seated_calf_raise',
    name: 'Seated Calf Raise',
    primaryMuscle: 'Calves',
    secondaryMuscles: [],
    equipment: 'Machine',
  },

  // ARMS - BICEPS
  {
    id: 'sys_barbell_bicep_curl',
    name: 'Barbell Bicep Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Barbell',
  },
  {
    id: 'sys_dumbbell_bicep_curl',
    name: 'Incline Dumbbell Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: [],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_hammer_curl',
    name: 'Dumbbell Hammer Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbell',
  },
  {
    id: 'sys_preacher_curl',
    name: 'EZ-Bar Preacher Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: [],
    equipment: 'Barbell',
  },
  {
    id: 'sys_cable_bicep_curl',
    name: 'Cable Bicep Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscles: [],
    equipment: 'Cable',
  },

  // ARMS - TRICEPS
  {
    id: 'sys_tricep_pushdown',
    name: 'Tricep Rope Pushdown',
    primaryMuscle: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
  },
  {
    id: 'sys_skull_crusher',
    name: 'EZ-Bar Skull Crusher',
    primaryMuscle: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Barbell',
  },
  {
    id: 'sys_overhead_tricep_extension',
    name: 'Overhead Cable Tricep Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscles: [],
    equipment: 'Cable',
  },
  {
    id: 'sys_close_grip_bench_press',
    name: 'Close-Grip Bench Press',
    primaryMuscle: 'Triceps',
    secondaryMuscles: ['Chest', 'Shoulders'],
    equipment: 'Barbell',
  },

  // CORE
  {
    id: 'sys_hanging_leg_raise',
    name: 'Hanging Leg Raise',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    equipment: 'Bodyweight',
  },
  {
    id: 'sys_cable_crunch',
    name: 'Kneeling Cable Crunch',
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    equipment: 'Cable',
  },
  {
    id: 'sys_plank',
    name: 'Plank',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Shoulders'],
    equipment: 'Bodyweight',
  },
  {
    id: 'sys_ab_wheel_rollout',
    name: 'Ab Wheel Rollout',
    primaryMuscle: 'Core',
    secondaryMuscles: ['Back'],
    equipment: 'Other',
  },
];
