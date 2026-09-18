import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal as RNModal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Dumbbell,
  Check,
  X,
  Search,
  ChevronDown,
} from 'lucide-react-native';

import {
  Screen,
  AppText,
  AppButton,
  IconButton,
  Card,
  SectionHeader,
  Divider,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useSplitStore, WorkoutWithExercises } from '@/stores/splitStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { ExerciseRow } from '@/repositories/exerciseRepository';

export default function EditRoutineScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const {
    activeSplit,
    workouts,
    loadActiveSplit,
    renameSplit,
    addWorkout,
    deleteWorkout,
    renameWorkout,
    addExerciseToWorkoutTemplate,
    removeExerciseFromWorkoutTemplate,
    updateExerciseTargetConfig,
  } = useSplitStore();

  const { exercises: libraryExercises, initializeLibrary } = useExerciseStore();

  const [isEditingSplitName, setIsEditingSplitName] = useState(false);
  const [splitNameInput, setSplitNameInput] = useState('');

  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false);

  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingWorkoutName, setEditingWorkoutName] = useState('');

  const [targetWorkoutForAddExercise, setTargetWorkoutForAddExercise] = useState<string | null>(null);
  const [exerciseSearch, setExerciseSearch] = useState('');

  useEffect(() => {
    loadActiveSplit();
    initializeLibrary();
  }, []);

  const handleSaveSplitName = async () => {
    if (splitNameInput.trim()) {
      await renameSplit(splitNameInput.trim());
    }
    setIsEditingSplitName(false);
  };

  const handleCreateWorkout = async () => {
    if (newWorkoutName.trim()) {
      await addWorkout(newWorkoutName.trim());
      setNewWorkoutName('');
      setShowAddWorkoutModal(false);
    }
  };

  const handleSaveWorkoutName = async (workoutId: string) => {
    if (editingWorkoutName.trim()) {
      await renameWorkout(workoutId, editingWorkoutName.trim());
    }
    setEditingWorkoutId(null);
  };

  const handleAddExercise = async (exercise: ExerciseRow) => {
    if (targetWorkoutForAddExercise) {
      await addExerciseToWorkoutTemplate(targetWorkoutForAddExercise, exercise.id);
      setTargetWorkoutForAddExercise(null);
      setExerciseSearch('');
    }
  };

  const filteredExercises = exerciseSearch
    ? libraryExercises.filter(
        (e) =>
          e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
          e.primary_muscle.toLowerCase().includes(exerciseSearch.toLowerCase())
      )
    : libraryExercises;

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={<ArrowLeft size={20} color={theme.text.primary} />}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          variant="ghost"
          size={40}
        />
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color="accent" weight="800">
            ROUTINE CUSTOMIZER
          </AppText>
          <AppText variant="h1" weight="900">
            Edit Split & Workouts
          </AppText>
        </View>
      </View>

      <View style={styles.content}>
        {/* Split Name Editor */}
        <Card variant="highlighted" style={styles.splitCard}>
          <AppText variant="caption" color="tertiary" weight="800">
            CURRENT SPLIT PROGRAM
          </AppText>

          {isEditingSplitName ? (
            <View style={styles.inlineEditRow}>
              <TextInput
                value={splitNameInput}
                onChangeText={setSplitNameInput}
                style={[
                  styles.textInput,
                  {
                    color: theme.text.primary,
                    borderColor: theme.accent.primary,
                    backgroundColor: theme.background.primary,
                  },
                ]}
                autoFocus
              />
              <IconButton
                icon={<Check size={18} color="#0B0D0F" />}
                onPress={handleSaveSplitName}
                accessibilityLabel="Save split name"
                variant="filled"
                size={36}
              />
            </View>
          ) : (
            <View style={styles.splitNameRow}>
              <AppText variant="h2" weight="900" style={{ flex: 1 }}>
                {activeSplit?.name || 'Rolling Split'}
              </AppText>
              <IconButton
                icon={<Edit3 size={16} color={theme.accent.primary} />}
                onPress={() => {
                  setSplitNameInput(activeSplit?.name || '');
                  setIsEditingSplitName(true);
                }}
                accessibilityLabel="Edit split name"
                variant="ghost"
                size={36}
              />
            </View>
          )}
        </Card>

        {/* Workouts List */}
        <View style={styles.sectionHeaderRow}>
          <SectionHeader title={`Workouts in Split (${workouts.length})`} />
          <AppButton
            title="ADD WORKOUT"
            onPress={() => setShowAddWorkoutModal(true)}
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} color={theme.accent.primary} />}
          />
        </View>

        {workouts.map((w, idx) => (
          <Card key={w.id} variant="default" style={styles.workoutCard}>
            {/* Workout Header */}
            <View style={styles.workoutTop}>
              {editingWorkoutId === w.id ? (
                <View style={styles.inlineEditRow}>
                  <TextInput
                    value={editingWorkoutName}
                    onChangeText={setEditingWorkoutName}
                    style={[
                      styles.textInput,
                      {
                        color: theme.text.primary,
                        borderColor: theme.accent.primary,
                        backgroundColor: theme.background.secondary,
                      },
                    ]}
                    autoFocus
                  />
                  <IconButton
                    icon={<Check size={16} color="#0B0D0F" />}
                    onPress={() => handleSaveWorkoutName(w.id)}
                    accessibilityLabel="Save workout name"
                    variant="filled"
                    size={32}
                  />
                </View>
              ) : (
                <View style={styles.workoutTitleGroup}>
                  <AppText variant="caption" color="accent" weight="800">
                    DAY {idx + 1}
                  </AppText>
                  <AppText variant="h2" weight="900">
                    {w.name}
                  </AppText>
                </View>
              )}

              <View style={styles.workoutActionGroup}>
                <IconButton
                  icon={<Edit3 size={16} color={theme.text.secondary} />}
                  onPress={() => {
                    setEditingWorkoutId(w.id);
                    setEditingWorkoutName(w.name);
                  }}
                  accessibilityLabel="Rename workout"
                  variant="ghost"
                  size={32}
                />
                {workouts.length > 1 && (
                  <IconButton
                    icon={<Trash2 size={16} color={theme.status.error} />}
                    onPress={() => deleteWorkout(w.id)}
                    accessibilityLabel="Delete workout"
                    variant="ghost"
                    size={32}
                  />
                )}
              </View>
            </View>

            <Divider style={{ marginVertical: 10 }} />

            {/* Exercises List */}
            <View style={styles.exercisesList}>
              {w.exercises?.map((ex) => (
                <View
                  key={ex.id}
                  style={[
                    styles.exerciseRowCard,
                    {
                      backgroundColor: theme.background.secondary,
                      borderColor: theme.border.subtle,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <View style={styles.exerciseHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <AppText variant="bodyMd" weight="800" numberOfLines={1}>
                        {ex.exercise_name || 'Exercise'}
                      </AppText>
                      <AppText variant="caption" color="tertiary">
                        {(ex.primary_muscle || 'GENERAL').toUpperCase()}
                      </AppText>
                    </View>

                    <IconButton
                      icon={<Trash2 size={14} color={theme.status.error} />}
                      onPress={() => removeExerciseFromWorkoutTemplate(ex.id)}
                      accessibilityLabel="Remove exercise from routine"
                      variant="ghost"
                      size={28}
                    />
                  </View>

                  {/* Target Config Steppers */}
                  <View style={styles.configControlsRow}>
                    <View style={styles.configItem}>
                      <AppText variant="caption" color="secondary">
                        SETS
                      </AppText>
                      <View style={styles.stepperGroup}>
                        <Pressable
                          style={[styles.stepperBtn, { backgroundColor: theme.background.tertiary }]}
                          onPress={() =>
                            updateExerciseTargetConfig(ex.id, {
                              targetSets: Math.max(1, ex.target_sets - 1),
                            })
                          }
                        >
                          <AppText variant="bodySm" weight="800">-</AppText>
                        </Pressable>
                        <AppText variant="bodySm" weight="900">{ex.target_sets}</AppText>
                        <Pressable
                          style={[styles.stepperBtn, { backgroundColor: theme.background.tertiary }]}
                          onPress={() =>
                            updateExerciseTargetConfig(ex.id, {
                              targetSets: ex.target_sets + 1,
                            })
                          }
                        >
                          <AppText variant="bodySm" weight="800">+</AppText>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.configItem}>
                      <AppText variant="caption" color="secondary">
                        REP RANGE
                      </AppText>
                      <View style={styles.stepperGroup}>
                        <Pressable
                          style={[styles.stepperBtn, { backgroundColor: theme.background.tertiary }]}
                          onPress={() =>
                            updateExerciseTargetConfig(ex.id, {
                              targetRepMin: Math.max(1, (ex.target_rep_min || 8) - 1),
                            })
                          }
                        >
                          <AppText variant="bodySm" weight="800">-</AppText>
                        </Pressable>
                        <AppText variant="bodySm" weight="900">
                          {ex.target_rep_min || 8}-{ex.target_rep_max || 12}
                        </AppText>
                        <Pressable
                          style={[styles.stepperBtn, { backgroundColor: theme.background.tertiary }]}
                          onPress={() =>
                            updateExerciseTargetConfig(ex.id, {
                              targetRepMax: (ex.target_rep_max || 12) + 1,
                            })
                          }
                        >
                          <AppText variant="bodySm" weight="800">+</AppText>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <AppButton
                title="ADD EXERCISE"
                onPress={() => setTargetWorkoutForAddExercise(w.id)}
                variant="secondary"
                size="sm"
                leftIcon={<Plus size={14} color={theme.accent.primary} />}
                style={{ marginTop: 8 }}
              />
            </View>
          </Card>
        ))}
      </View>

      {/* MODAL: ADD WORKOUT */}
      <RNModal
        visible={showAddWorkoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddWorkoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Card variant="default" style={styles.modalBox}>
            <AppText variant="h2" weight="900">
              New Workout Routine
            </AppText>
            <AppText variant="caption" color="secondary">
              Enter name for the new workout (e.g. Leg Day B, Core & Abs)
            </AppText>
            <TextInput
              value={newWorkoutName}
              onChangeText={setNewWorkoutName}
              placeholder="Workout Name"
              placeholderTextColor={theme.text.tertiary}
              style={[
                styles.textInput,
                {
                  color: theme.text.primary,
                  borderColor: theme.border.subtle,
                  backgroundColor: theme.background.secondary,
                  marginTop: 12,
                },
              ]}
              autoFocus
            />
            <View style={styles.modalBtnRow}>
              <AppButton
                title="CANCEL"
                onPress={() => setShowAddWorkoutModal(false)}
                variant="ghost"
                size="md"
              />
              <AppButton
                title="CREATE WORKOUT"
                onPress={handleCreateWorkout}
                variant="primary"
                size="md"
              />
            </View>
          </Card>
        </View>
      </RNModal>

      {/* MODAL: ADD EXERCISE FROM LIBRARY */}
      <RNModal
        visible={targetWorkoutForAddExercise !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setTargetWorkoutForAddExercise(null)}
      >
        <View style={[styles.exerciseModalContainer, { backgroundColor: theme.background.primary }]}>
          <View style={styles.exerciseModalHeader}>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color="accent" weight="800">
                EXERCISE LIBRARY (50+)
              </AppText>
              <AppText variant="h2" weight="900">
                Add Exercise to Workout
              </AppText>
            </View>
            <IconButton
              icon={<X size={20} color={theme.text.primary} />}
              onPress={() => setTargetWorkoutForAddExercise(null)}
              accessibilityLabel="Close exercise picker"
              variant="ghost"
              size={36}
            />
          </View>

          <View style={styles.searchBarContainer}>
            <Search size={18} color={theme.text.tertiary} style={{ marginLeft: 12 }} />
            <TextInput
              value={exerciseSearch}
              onChangeText={setExerciseSearch}
              placeholder="Search exercise or muscle group..."
              placeholderTextColor={theme.text.tertiary}
              style={[styles.searchInput, { color: theme.text.primary }]}
            />
          </View>

          <ScrollView contentContainerStyle={styles.exerciseListContainer}>
            {filteredExercises.map((ex) => (
              <Pressable
                key={ex.id}
                style={({ pressed }) => [
                  styles.exercisePickerCard,
                  {
                    backgroundColor: pressed ? theme.background.elevated : theme.background.secondary,
                    borderColor: theme.border.subtle,
                    borderRadius: radius.md,
                  },
                ]}
                onPress={() => handleAddExercise(ex)}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyMd" weight="800">
                    {ex.name}
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {ex.primary_muscle.toUpperCase()} • {ex.equipment || 'Bodyweight'}
                  </AppText>
                </View>
                <Plus size={18} color={theme.accent.primary} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </RNModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  splitCard: {
    padding: 16,
    gap: 8,
  },
  splitNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  workoutCard: {
    padding: 16,
    gap: 12,
  },
  workoutTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitleGroup: {
    flex: 1,
  },
  workoutActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exercisesList: {
    gap: 10,
  },
  exerciseRowCard: {
    padding: 12,
    borderWidth: 1,
    gap: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configControlsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  configItem: {
    gap: 4,
  },
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    padding: 20,
    gap: 8,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  exerciseModalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  exerciseModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  exerciseListContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 40,
  },
  exercisePickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
});
