import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import {
  Plus,
  Trash2,
  Dumbbell,
  Clock,
  Repeat,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  IconButton,
  Card,
  SectionHeader,
  Divider,
  Modal,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnboardingStore, OnboardingWorkout } from '@/stores/onboardingStore';
import { SYSTEM_EXERCISES } from '@/constants/defaultExercises';

export default function ConfigureWorkoutsScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const {
    workouts,
    addWorkout,
    deleteWorkout,
    renameWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExerciseConfig,
    completeOnboarding,
    isLoading,
  } = useOnboardingStore();

  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string>(
    workouts[0]?.id || ''
  );
  const [exerciseModalTargetWorkout, setExerciseModalTargetWorkout] = useState<string | null>(null);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [addWorkoutModalVisible, setAddWorkoutModalVisible] = useState(false);

  const handleFinish = async () => {
    try {
      await completeOnboarding('local_user');
      router.replace('/onboarding/complete');
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err);
      Alert.alert('Onboarding Error', err?.message || 'Failed to save split routine. Please try again.');
    }
  };

  const handleAddCustomWorkout = () => {
    if (newWorkoutName.trim()) {
      addWorkout(newWorkoutName.trim());
      setNewWorkoutName('');
      setAddWorkoutModalVisible(false);
    }
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <ScreenHeader title="Configure Split" showBack />

      <View style={styles.header}>
        <AppText variant="h2" weight="800">
          Customize Your Routine
        </AppText>
        <AppText variant="bodySm" color="secondary">
          Review exercises and sets. You can always edit these templates later in the Plan tab.
        </AppText>
      </View>

      {/* Workout Cards Accordion */}
      <View style={styles.workoutList}>
        {workouts.map((workout, wIdx) => {
          const isExpanded = expandedWorkoutId === workout.id;

          return (
            <Card
              key={workout.id}
              variant={isExpanded ? 'highlighted' : 'default'}
              style={styles.workoutCard}
            >
              {/* Workout Header */}
              <Pressable
                style={styles.workoutHeader}
                onPress={() => setExpandedWorkoutId(isExpanded ? '' : workout.id)}
              >
                <View style={styles.workoutTitleBlock}>
                  <AppText variant="label" color="accent">
                    WORKOUT {wIdx + 1}
                  </AppText>
                  <AppText variant="h3" weight="800">
                    {workout.name}
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {workout.exercises.length} exercises configured
                  </AppText>
                </View>

                <View style={styles.headerControls}>
                  {workouts.length > 1 && (
                    <IconButton
                      icon={<Trash2 size={16} color={theme.status.error} />}
                      onPress={() => deleteWorkout(workout.id)}
                      accessibilityLabel="Delete workout"
                      variant="ghost"
                      size={36}
                    />
                  )}
                  {isExpanded ? (
                    <ChevronUp size={20} color={theme.text.tertiary} />
                  ) : (
                    <ChevronDown size={20} color={theme.text.tertiary} />
                  )}
                </View>
              </Pressable>

              {/* Expanded Exercises Content */}
              {isExpanded && (
                <View style={styles.exerciseSection}>
                  <Divider style={{ marginVertical: 8 }} />

                  {workout.exercises.map((ex, eIdx) => (
                    <View
                      key={ex.exerciseId + eIdx}
                      style={[
                        styles.exerciseItem,
                        {
                          backgroundColor: theme.background.primary,
                          borderColor: theme.border.subtle,
                          borderRadius: radius.sm,
                        },
                      ]}
                    >
                      <View style={styles.exerciseItemHeader}>
                        <View style={{ flex: 1 }}>
                          <AppText variant="bodyMd" weight="700">
                            {eIdx + 1}. {ex.name}
                          </AppText>
                          <AppText variant="caption" color="accent">
                            {ex.primaryMuscle.toUpperCase()}
                          </AppText>
                        </View>
                        <IconButton
                          icon={<Trash2 size={14} color={theme.text.tertiary} />}
                          onPress={() => removeExerciseFromWorkout(workout.id, ex.exerciseId)}
                          accessibilityLabel="Remove exercise"
                          variant="ghost"
                          size={32}
                        />
                      </View>

                      {/* Sets & Reps Config Controls */}
                      <View style={styles.configRow}>
                        <View style={styles.configChip}>
                          <Repeat size={12} color={theme.text.tertiary} />
                          <AppText variant="caption" color="secondary">
                            {ex.targetSets} sets × {ex.targetRepMin}-{ex.targetRepMax} reps
                          </AppText>
                        </View>

                        <View style={styles.configChip}>
                          <Clock size={12} color={theme.text.tertiary} />
                          <AppText variant="caption" color="secondary">
                            {ex.restSeconds}s rest
                          </AppText>
                        </View>
                      </View>
                    </View>
                  ))}

                  {/* Add Exercise to Workout Button */}
                  <AppButton
                    title="+ ADD EXERCISE"
                    variant="secondary"
                    size="sm"
                    onPress={() => setExerciseModalTargetWorkout(workout.id)}
                    style={{ marginTop: 8 }}
                  />
                </View>
              )}
            </Card>
          );
        })}

        {/* Add Another Workout Button */}
        <AppButton
          title="+ ADD ANOTHER WORKOUT"
          variant="secondary"
          size="md"
          onPress={() => setAddWorkoutModalVisible(true)}
          style={{ marginTop: 4 }}
        />
      </View>

      <View style={styles.footerAction}>
        <AppButton
          title="FINISH & ACTIVATE SPLIT"
          onPress={handleFinish}
          loading={isLoading}
          variant="primary"
          size="lg"
          rightIcon={<Check size={18} color="#0B0D0F" />}
        />
      </View>

      {/* Quick Exercise Picker Modal */}
      <Modal
        visible={!!exerciseModalTargetWorkout}
        onClose={() => setExerciseModalTargetWorkout(null)}
      >
        <AppText variant="h3" weight="800" style={{ marginBottom: 12 }}>
          Add Exercise to Workout
        </AppText>
        <ScrollView style={{ maxHeight: 340 }}>
          <View style={{ gap: 8 }}>
            {SYSTEM_EXERCISES.slice(0, 15).map((sysEx) => (
              <Pressable
                key={sysEx.id}
                style={[
                  styles.pickerItem,
                  {
                    backgroundColor: theme.background.primary,
                    borderColor: theme.border.subtle,
                    borderRadius: radius.sm,
                  },
                ]}
                onPress={() => {
                  if (exerciseModalTargetWorkout) {
                    addExerciseToWorkout(exerciseModalTargetWorkout, {
                      exerciseId: sysEx.id,
                      name: sysEx.name,
                      primaryMuscle: sysEx.primaryMuscle,
                    });
                    setExerciseModalTargetWorkout(null);
                  }
                }}
              >
                <View>
                  <AppText variant="bodyMd" weight="600">
                    {sysEx.name}
                  </AppText>
                  <AppText variant="caption" color="accent">
                    {sysEx.primaryMuscle} • {sysEx.equipment}
                  </AppText>
                </View>
                <Plus size={16} color={theme.accent.primary} />
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <AppButton
          title="Cancel"
          variant="ghost"
          size="sm"
          onPress={() => setExerciseModalTargetWorkout(null)}
          style={{ marginTop: 12 }}
        />
      </Modal>

      {/* Add Workout Name Modal */}
      <Modal
        visible={addWorkoutModalVisible}
        onClose={() => setAddWorkoutModalVisible(false)}
      >
        <AppText variant="h3" weight="800" style={{ marginBottom: 12 }}>
          New Workout Name
        </AppText>
        <TextInput
          placeholder="e.g. Upper Body B or Arms & Abs"
          placeholderTextColor={theme.text.tertiary}
          value={newWorkoutName}
          onChangeText={setNewWorkoutName}
          style={[
            styles.nameInput,
            {
              backgroundColor: theme.background.primary,
              borderColor: theme.border.default,
              color: theme.text.primary,
              borderRadius: radius.sm,
            },
          ]}
        />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <AppButton
            title="Cancel"
            variant="secondary"
            onPress={() => setAddWorkoutModalVisible(false)}
            style={{ flex: 1 }}
          />
          <AppButton
            title="Add"
            variant="primary"
            onPress={handleAddCustomWorkout}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
    gap: 4,
  },
  workoutList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  workoutCard: {
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitleBlock: {
    gap: 2,
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseSection: {
    gap: 8,
    marginTop: 4,
  },
  exerciseItem: {
    padding: 12,
    borderWidth: 1,
    gap: 8,
  },
  exerciseItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configRow: {
    flexDirection: 'row',
    gap: 8,
  },
  configChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
  },
  nameInput: {
    borderWidth: 1,
    padding: 12,
    fontSize: 15,
  },
  footerAction: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
});
