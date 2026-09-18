import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal as RNModal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  X,
  Check,
  Timer,
  Plus,
  Minus,
  Pause,
  Play,
  History,
  Info,
  ChevronDown,
  Dumbbell,
  CheckCircle2,
  Trash2,
  Search,
} from 'lucide-react-native';

import {
  Screen,
  AppText,
  AppButton,
  IconButton,
  Card,
  SectionHeader,
  Divider,
  ConfirmDialog,
  Chip,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useSplitStore } from '@/stores/splitStore';
import { useExerciseStore } from '@/stores/exerciseStore';
import { workoutEngine } from '@/domain/workout/workoutEngine';
import { ExerciseRow } from '@/repositories/exerciseRepository';

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();

  const {
    activeSession,
    activeTemplate,
    sessionSets,
    elapsedSeconds,
    isPaused,
    restTimerSeconds,
    isRestTimerActive,
    restTimerTotal,
    startWorkout,
    logSet,
    toggleSetComplete,
    addSet,
    removeSet,
    addExerciseToWorkout,
    pauseWorkout,
    resumeWorkout,
    startRestTimer,
    stopRestTimer,
    addRestSeconds,
    tickTimers,
    finishWorkout,
    discardWorkout,
  } = useWorkoutStore();

  const { nextWorkout } = useSplitStore();
  const { exercises: libraryExercises, initializeLibrary } = useExerciseStore();

  // Local state for modals & pickers
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');

  // Start workout if none is active on mount
  useEffect(() => {
    initializeLibrary();
    if (!activeSession && nextWorkout) {
      startWorkout(nextWorkout);
    }
  }, []);

  // Timer ticker interval (runs every second)
  useEffect(() => {
    const interval = setInterval(() => {
      tickTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const completedSets = sessionSets.filter((s) => s.completed === 1);
  const totalVolume = workoutEngine.calculateTotalVolume(completedSets);
  const totalReps = workoutEngine.calculateTotalReps(completedSets);

  // Exercise library filtered list
  const filteredExercises = exerciseSearchQuery
    ? libraryExercises.filter(
        (e) =>
          e.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
          e.primary_muscle.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
      )
    : libraryExercises;

  const handleFinish = async () => {
    setShowFinishDialog(false);
    const summary = await finishWorkout();
    if (summary) {
      router.replace('/workout/summary');
    }
  };

  const handleDiscard = async () => {
    setShowDiscardDialog(false);
    await discardWorkout();
    router.replace('/(tabs)');
  };

  const handleSelectAddExercise = async (ex: ExerciseRow) => {
    await addExerciseToWorkout(ex);
    setShowAddExerciseModal(false);
    setExerciseSearchQuery('');
  };

  // Stepper helpers
  const handleAdjustWeight = (setId: string, currentWeight: number | null, delta: number) => {
    const val = Math.max(0, Math.round(((currentWeight || 0) + delta) * 10) / 10);
    logSet(setId, { weight: val });
  };

  const handleAdjustReps = (setId: string, currentReps: number | null, delta: number) => {
    const val = Math.max(0, (currentReps || 0) + delta);
    logSet(setId, { reps: val });
  };

  const exercises = activeTemplate?.exercises || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* 1. TOP CONTROL BAR */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background.primary,
            borderBottomColor: theme.border.subtle,
          },
        ]}
      >
        <Pressable
          style={[styles.closeBtn, { backgroundColor: theme.background.secondary }]}
          onPress={() => setShowDiscardDialog(true)}
          accessibilityLabel="Discard or minimize workout"
        >
          <X size={18} color={theme.text.primary} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <AppText variant="h2" weight="900" numberOfLines={1}>
            {activeTemplate?.name || 'ACTIVE WORKOUT'}
          </AppText>
          <View style={styles.telemetryRow}>
            <View style={[styles.statusDot, { backgroundColor: theme.status.success }]} />
            <AppText variant="caption" color="secondary" weight="700">
              OFFLINE READY • {completedSets.length}/{sessionSets.length} SETS
            </AppText>
          </View>
        </View>

        <View style={styles.headerRightGroup}>
          <Pressable
            style={[styles.timerBadge, { backgroundColor: theme.background.secondary }]}
            onPress={() => (isPaused ? resumeWorkout() : pauseWorkout())}
          >
            {isPaused ? (
              <Play size={13} color={theme.status.warning} />
            ) : (
              <Timer size={13} color={theme.accent.primary} />
            )}
            <AppText
              variant="label"
              weight="800"
              color={isPaused ? 'warning' : 'accent'}
              style={styles.timerText}
            >
              {workoutEngine.formatDuration(elapsedSeconds)}
            </AppText>
          </Pressable>

          <AppButton
            title="FINISH"
            onPress={() => setShowFinishDialog(true)}
            variant="primary"
            size="sm"
            style={styles.finishBtn}
          />
        </View>
      </View>

      {/* 2. SCROLLABLE WORKOUT BODY */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((ex, exIdx) => {
          const exSets = sessionSets.filter((s) => s.workout_exercise_id === ex.id);

          return (
            <Card
              key={ex.id || exIdx}
              variant="default"
              style={StyleSheet.flatten([styles.exerciseCard, { borderColor: theme.border.subtle }])}
            >
              {/* Exercise Header */}
              <View style={styles.exHeader}>
                <View style={{ flex: 1 }}>
                  <AppText variant="caption" color="accent" weight="800" style={styles.muscleTag}>
                    {(ex.primary_muscle || 'GENERAL').toUpperCase()}{' '}
                    {ex.equipment ? `• ${ex.equipment.toUpperCase()}` : ''}
                  </AppText>
                  <AppText variant="h2" weight="800">
                    {ex.exercise_name || `Exercise ${exIdx + 1}`}
                  </AppText>
                </View>
                <View style={[styles.exOrderBadge, { backgroundColor: theme.background.elevated }]}>
                  <AppText variant="caption" color="tertiary" weight="800">
                    #{exIdx + 1}
                  </AppText>
                </View>
              </View>

              {/* Target / Recommendation Info Banner */}
              <View
                style={[
                  styles.infoBanner,
                  { backgroundColor: theme.background.elevated, borderRadius: radius.sm },
                ]}
              >
                <Info size={14} color={theme.text.tertiary} />
                <AppText variant="caption" color="secondary">
                  Target: {ex.target_sets || 3} sets • {ex.target_rep_min || 8}-
                  {ex.target_rep_max || 12} reps • {ex.rest_seconds || 90}s rest
                </AppText>
              </View>

              {/* Sets Table Header */}
              <View style={styles.tableHeader}>
                <AppText variant="caption" color="tertiary" weight="800" style={styles.colSet}>
                  SET
                </AppText>
                <AppText variant="caption" color="tertiary" weight="800" style={styles.colPrev}>
                  PREV
                </AppText>
                <AppText variant="caption" color="tertiary" weight="800" style={styles.colLoad}>
                  KG
                </AppText>
                <AppText variant="caption" color="tertiary" weight="800" style={styles.colReps}>
                  REPS
                </AppText>
                <AppText variant="caption" color="tertiary" weight="800" style={styles.colCheck}>
                  DONE
                </AppText>
              </View>

              {/* Sets Rows */}
              {exSets.map((s, sIdx) => {
                const isCompleted = s.completed === 1;

                return (
                  <View
                    key={s.id}
                    style={[
                      styles.setRow,
                      {
                        backgroundColor: isCompleted
                          ? theme.background.elevated
                          : theme.background.secondary,
                        borderColor: isCompleted ? theme.accent.primarySoft : theme.border.subtle,
                        borderRadius: radius.md,
                      },
                    ]}
                  >
                    {/* Set Number */}
                    <View style={styles.colSet}>
                      <View
                        style={[
                          styles.setNumberCircle,
                          {
                            backgroundColor: isCompleted
                              ? theme.accent.primarySoft
                              : theme.background.elevated,
                          },
                        ]}
                      >
                        <AppText
                          variant="caption"
                          weight="800"
                          color={isCompleted ? 'accent' : 'primary'}
                        >
                          {sIdx + 1}
                        </AppText>
                      </View>
                    </View>

                    {/* Previous Performance (Benchmark) */}
                    <View style={styles.colPrev}>
                      <AppText variant="caption" color="tertiary" weight="600">
                        {s.weight && s.weight > 0 ? `${s.weight}kg` : '—'}
                      </AppText>
                    </View>

                    {/* KG Stepper / Editor */}
                    <View style={styles.colLoad}>
                      <View style={styles.stepperContainer}>
                        <Pressable
                          style={[
                            styles.stepBtn,
                            { backgroundColor: theme.background.tertiary, borderRadius: radius.xs },
                          ]}
                          onPress={() => handleAdjustWeight(s.id, s.weight, -2.5)}
                          hitSlop={8}
                        >
                          <Minus size={12} color={theme.text.primary} />
                        </Pressable>

                        <TextInput
                          style={[
                            styles.stepperInput,
                            {
                              color: theme.text.primary,
                              backgroundColor: theme.background.primary,
                              borderRadius: radius.xs,
                            },
                          ]}
                          keyboardType="decimal-pad"
                          value={s.weight !== null ? String(s.weight) : '0'}
                          onChangeText={(t) => {
                            const val = parseFloat(t) || 0;
                            logSet(s.id, { weight: val });
                          }}
                        />

                        <Pressable
                          style={[
                            styles.stepBtn,
                            { backgroundColor: theme.background.tertiary, borderRadius: radius.xs },
                          ]}
                          onPress={() => handleAdjustWeight(s.id, s.weight, 2.5)}
                          hitSlop={8}
                        >
                          <Plus size={12} color={theme.text.primary} />
                        </Pressable>
                      </View>
                    </View>

                    {/* REPS Stepper / Editor */}
                    <View style={styles.colReps}>
                      <View style={styles.stepperContainer}>
                        <Pressable
                          style={[
                            styles.stepBtn,
                            { backgroundColor: theme.background.tertiary, borderRadius: radius.xs },
                          ]}
                          onPress={() => handleAdjustReps(s.id, s.reps, -1)}
                          hitSlop={8}
                        >
                          <Minus size={12} color={theme.text.primary} />
                        </Pressable>

                        <TextInput
                          style={[
                            styles.stepperInput,
                            {
                              color: theme.text.primary,
                              backgroundColor: theme.background.primary,
                              borderRadius: radius.xs,
                            },
                          ]}
                          keyboardType="number-pad"
                          value={s.reps !== null ? String(s.reps) : '0'}
                          onChangeText={(t) => {
                            const val = parseInt(t, 10) || 0;
                            logSet(s.id, { reps: val });
                          }}
                        />

                        <Pressable
                          style={[
                            styles.stepBtn,
                            { backgroundColor: theme.background.tertiary, borderRadius: radius.xs },
                          ]}
                          onPress={() => handleAdjustReps(s.id, s.reps, 1)}
                          hitSlop={8}
                        >
                          <Plus size={12} color={theme.text.primary} />
                        </Pressable>
                      </View>
                    </View>

                    {/* Complete Set Button (Signature Neon Check) */}
                    <View style={styles.colCheck}>
                      <Pressable
                        style={[
                          styles.checkBtn,
                          {
                            backgroundColor: isCompleted
                              ? theme.accent.primary
                              : theme.background.tertiary,
                            borderColor: isCompleted
                              ? theme.accent.primary
                              : theme.border.subtle,
                            borderRadius: radius.md,
                          },
                        ]}
                        onPress={() => toggleSetComplete(s.id, ex.rest_seconds || 90)}
                        accessibilityLabel={`Complete set ${sIdx + 1}`}
                      >
                        <Check
                          size={18}
                          color={isCompleted ? '#0B0D0F' : theme.text.tertiary}
                          strokeWidth={isCompleted ? 3 : 2}
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              })}

              {/* Add Set Button */}
              <Pressable
                style={[
                  styles.addSetBtn,
                  {
                    backgroundColor: theme.background.secondary,
                    borderColor: theme.border.subtle,
                    borderRadius: radius.md,
                  },
                ]}
                onPress={() => addSet(ex.id, ex.exercise_id)}
              >
                <Plus size={16} color={theme.text.secondary} />
                <AppText variant="caption" weight="800" color="secondary">
                  ADD SET
                </AppText>
              </Pressable>
            </Card>
          );
        })}

        {/* Add Exercise to Workout Button */}
        <Pressable
          style={[
            styles.addExerciseCardBtn,
            {
              backgroundColor: theme.background.secondary,
              borderColor: theme.border.subtle,
              borderRadius: radius.lg,
            },
          ]}
          onPress={() => setShowAddExerciseModal(true)}
        >
          <Dumbbell size={20} color={theme.accent.primary} />
          <AppText variant="bodyMd" weight="800" color="primary">
            + ADD EXERCISE
          </AppText>
        </Pressable>

        <View style={{ height: isRestTimerActive || restTimerSeconds > 0 ? 120 : 60 }} />
      </ScrollView>

      {/* 3. FLOATING / BOTTOM REST TIMER BAR */}
      {(isRestTimerActive || restTimerSeconds > 0) && (
        <View
          style={[
            styles.restTimerDrawer,
            {
              backgroundColor: theme.background.elevated,
              borderColor: theme.accent.primary,
              borderRadius: radius.lg,
            },
          ]}
        >
          <View style={styles.restTimerContent}>
            <View style={styles.restTimerLeft}>
              <View
                style={[
                  styles.restIconCircle,
                  { backgroundColor: theme.accent.primarySoft },
                ]}
              >
                <Timer size={18} color={theme.accent.primary} />
              </View>
              <View>
                <AppText variant="caption" color="tertiary" weight="800">
                  REST INTERVAL
                </AppText>
                <AppText variant="h2" weight="900" color="accent" style={styles.restTimerValue}>
                  {workoutEngine.formatDuration(restTimerSeconds)}
                </AppText>
              </View>
            </View>

            <View style={styles.restTimerActions}>
              <Pressable
                style={[
                  styles.restActionBtn,
                  { backgroundColor: theme.background.secondary, borderRadius: radius.sm },
                ]}
                onPress={() => addRestSeconds(30)}
              >
                <AppText variant="caption" weight="800" color="primary">
                  +30s
                </AppText>
              </Pressable>

              <Pressable
                style={[
                  styles.restActionBtn,
                  { backgroundColor: theme.background.secondary, borderRadius: radius.sm },
                ]}
                onPress={() => stopRestTimer()}
              >
                <AppText variant="caption" weight="800" color="secondary">
                  SKIP
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* Rest Progress Bar */}
          <View
            style={[styles.restProgressTrack, { backgroundColor: theme.background.tertiary }]}
          >
            <View
              style={[
                styles.restProgressBar,
                {
                  backgroundColor: theme.accent.primary,
                  width: `${Math.min(
                    100,
                    Math.max(0, (restTimerSeconds / (restTimerTotal || 90)) * 100)
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* 4. ADD EXERCISE MODAL */}
      <RNModal
        visible={showAddExerciseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddExerciseModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background.primary }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border.subtle }]}>
            <AppText variant="h2" weight="800">
              Add Exercise
            </AppText>
            <IconButton
              icon={<X size={20} color={theme.text.primary} />}
              onPress={() => setShowAddExerciseModal(false)}
              accessibilityLabel="Close add exercise modal"
              variant="ghost"
              size={36}
            />
          </View>

          {/* Search bar */}
          <View
            style={[
              styles.modalSearchBar,
              { backgroundColor: theme.background.secondary, borderRadius: radius.md },
            ]}
          >
            <Search size={18} color={theme.text.tertiary} />
            <TextInput
              style={[styles.modalSearchInput, { color: theme.text.primary }]}
              placeholder="Search exercise or muscle..."
              placeholderTextColor={theme.text.tertiary}
              value={exerciseSearchQuery}
              onChangeText={setExerciseSearchQuery}
            />
            {exerciseSearchQuery.length > 0 && (
              <Pressable onPress={() => setExerciseSearchQuery('')}>
                <X size={16} color={theme.text.tertiary} />
              </Pressable>
            )}
          </View>

          {/* Exercise list */}
          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.exercisePickerItem,
                  {
                    backgroundColor: pressed
                      ? theme.background.elevated
                      : theme.background.secondary,
                    borderColor: theme.border.subtle,
                    borderRadius: radius.md,
                  },
                ]}
                onPress={() => handleSelectAddExercise(item)}
              >
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyMd" weight="700">
                    {item.name}
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {(item.primary_muscle || '').toUpperCase()} • {((item.equipment || 'none')).toUpperCase()}
                  </AppText>
                </View>
                <Plus size={18} color={theme.accent.primary} />
              </Pressable>
            )}
          />
        </View>
      </RNModal>

      {/* 5. FINISH WORKOUT CONFIRM DIALOG */}
      <ConfirmDialog
        visible={showFinishDialog}
        title="Finish Workout?"
        message={`You logged ${completedSets.length} completed sets with a total volume of ${totalVolume.toLocaleString()} kg.`}
        confirmLabel="FINISH WORKOUT"
        cancelLabel="KEEP TRAINING"
        onConfirm={handleFinish}
        onCancel={() => setShowFinishDialog(false)}
        destructive={false}
      />

      {/* 6. DISCARD WORKOUT CONFIRM DIALOG */}
      <ConfirmDialog
        visible={showDiscardDialog}
        title="Discard Workout?"
        message="Are you sure you want to discard this session? All logged sets from today will be lost."
        confirmLabel="DISCARD"
        cancelLabel="CANCEL"
        onConfirm={handleDiscard}
        onCancel={() => setShowDiscardDialog(false)}
        destructive={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 12,
  },
  finishBtn: {
    minWidth: 70,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  exerciseCard: {
    padding: 16,
    gap: 12,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  muscleTag: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  exOrderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  colSet: {
    width: 36,
    alignItems: 'center',
  },
  colPrev: {
    width: 50,
    alignItems: 'center',
  },
  colLoad: {
    flex: 1,
    marginHorizontal: 4,
  },
  colReps: {
    flex: 1,
    marginHorizontal: 4,
  },
  colCheck: {
    width: 44,
    alignItems: 'flex-end',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  setNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  stepBtn: {
    width: 24,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperInput: {
    flex: 1,
    height: 32,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    padding: 0,
  },
  checkBtn: {
    width: 38,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  addExerciseCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  restTimerDrawer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderWidth: 1.5,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  restTimerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  restTimerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTimerValue: {
    fontSize: 20,
    marginTop: -2,
  },
  restTimerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  restActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  restProgressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  restProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  exercisePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
});
