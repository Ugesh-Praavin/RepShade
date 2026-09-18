import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal as RNModal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  Dumbbell,
  CheckCircle2,
  Award,
  ChevronRight,
  X,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';

import {
  Screen,
  AppText,
  AppButton,
  IconButton,
  Card,
  SectionHeader,
  Divider,
  EmptyState,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import {
  historyRepository,
  CompletedWorkoutHistoryItem,
} from '@/repositories/historyRepository';
import { workoutRepository, WorkoutSetRow } from '@/repositories/workoutRepository';
import { splitRepository, WorkoutExerciseRow } from '@/repositories/splitRepository';
import { workoutEngine } from '@/domain/workout/workoutEngine';
import { useAuthStore } from '@/stores/authStore';

export default function HistoryScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { user } = useAuthStore();
  const effectiveUserId = user?.uid || 'local_user';

  const [historyItems, setHistoryItems] = useState<CompletedWorkoutHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for inspecting a session
  const [selectedSession, setSelectedSession] = useState<CompletedWorkoutHistoryItem | null>(null);
  const [sessionSets, setSessionSets] = useState<WorkoutSetRow[]>([]);
  const [sessionExercises, setSessionExercises] = useState<WorkoutExerciseRow[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const items = await historyRepository.getWorkoutHistory(effectiveUserId, 50);
      setHistoryItems(items);
    } catch (e) {
      console.error('Error loading history:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    historyRepository.getWorkoutHistory(effectiveUserId, 50)
      .then((items) => {
        if (isMounted) {
          setHistoryItems(items);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error('Error loading history:', e);
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [effectiveUserId]);

  const handleOpenDetails = async (session: CompletedWorkoutHistoryItem) => {
    setSelectedSession(session);
    setIsLoadingDetails(true);
    try {
      const sets = await workoutRepository.getSetsForSession(session.id);
      setSessionSets(sets);

      if (session.workout_template_id) {
        const exs = await splitRepository.getExercisesForWorkout(session.workout_template_id);
        setSessionExercises(exs);
      }
    } catch (e) {
      console.error('Error loading session details:', e);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <AppText variant="label" color="secondary">
            OFFLINE TRAINING LOG
          </AppText>
          <AppText variant="h1" weight="900" numberOfLines={1} adjustsFontSizeToFit>
            Workout History
          </AppText>
        </View>
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: theme.accent.primarySoft,
              borderColor: theme.accent.primary,
              flexShrink: 0,
            },
          ]}
        >
          <AppText variant="caption" color="accent" weight="800">
            {historyItems.length} SESSIONS
          </AppText>
        </View>
      </View>

      {historyItems.length === 0 && !isLoading ? (
        <EmptyState
          title="No Workouts Logged Yet"
          description="Complete your first session from the Home tab. Your training history and set performance will appear here automatically."
          actionTitle="START WORKOUT"
          onAction={() => router.push('/(tabs)')}
          icon={<Calendar size={40} color={theme.text.tertiary} />}
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={styles.listContainer}>
          {historyItems.map((item) => {
            const durationMin = Math.max(1, Math.round(item.duration_seconds / 60));

            return (
              <Card
                key={item.id}
                variant="default"
                style={StyleSheet.flatten([styles.historyCard, { borderColor: theme.border.subtle }])}
              >
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <AppText variant="caption" color="tertiary" weight="700">
                      {formatDate(item.started_at).toUpperCase()}
                    </AppText>
                    <AppText variant="h2" weight="900" numberOfLines={1} style={styles.sessionTitle}>
                      {item.workout_template_name || 'Completed Workout'}
                    </AppText>
                    <AppText variant="caption" color="secondary" numberOfLines={1}>
                      {item.split_name || 'Rolling Split'}
                    </AppText>
                  </View>

                  <Pressable
                    style={[
                      styles.detailsBtn,
                      {
                        backgroundColor: theme.background.elevated,
                        borderRadius: radius.md,
                      },
                    ]}
                    onPress={() => handleOpenDetails(item)}
                  >
                    <AppText variant="caption" color="accent" weight="800">
                      DETAILS
                    </AppText>
                    <ChevronRight size={14} color={theme.accent.primary} />
                  </Pressable>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                {/* Metrics Grid */}
                <View style={styles.cardMetricsGrid}>
                  <View style={styles.metricItem}>
                    <AppText variant="caption" color="tertiary">
                      DURATION
                    </AppText>
                    <AppText variant="bodyMd" weight="800" color="primary">
                      {durationMin}m
                    </AppText>
                  </View>

                  <View style={styles.metricItem}>
                    <AppText variant="caption" color="tertiary">
                      VOLUME
                    </AppText>
                    <AppText variant="bodyMd" weight="800" color="primary">
                      {item.total_volume.toLocaleString()} kg
                    </AppText>
                  </View>

                  <View style={styles.metricItem}>
                    <AppText variant="caption" color="tertiary">
                      SETS
                    </AppText>
                    <AppText variant="bodyMd" weight="800" color="primary">
                      {item.total_sets}
                    </AppText>
                  </View>

                  <View style={styles.metricItem}>
                    <AppText variant="caption" color="tertiary">
                      REPS
                    </AppText>
                    <AppText variant="bodyMd" weight="800" color="primary">
                      {item.total_reps}
                    </AppText>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {/* SESSION DETAILS MODAL */}
      <RNModal
        visible={selectedSession !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSession(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.background.primary }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border.subtle }]}>
            <View>
              <AppText variant="caption" color="accent" weight="800">
                SESSION DETAIL LOG
              </AppText>
              <AppText variant="h2" weight="900">
                {selectedSession?.workout_template_name || 'Workout Details'}
              </AppText>
            </View>
            <IconButton
              icon={<X size={20} color={theme.text.primary} />}
              onPress={() => setSelectedSession(null)}
              accessibilityLabel="Close workout details"
              variant="ghost"
              size={36}
            />
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
            {/* Header Telemetry Box */}
            <View
              style={[
                styles.modalMetaBox,
                {
                  backgroundColor: theme.background.secondary,
                  borderColor: theme.border.subtle,
                  borderRadius: radius.md,
                },
              ]}
            >
              <View style={styles.metaRow}>
                <AppText variant="caption" color="tertiary">
                  DATE & TIME
                </AppText>
                <AppText variant="caption" weight="700" color="primary">
                  {selectedSession ? formatDate(selectedSession.started_at) : ''}
                </AppText>
              </View>
              <View style={styles.metaRow}>
                <AppText variant="caption" color="tertiary">
                  DURATION
                </AppText>
                <AppText variant="caption" weight="700" color="primary">
                  {Math.round((selectedSession?.duration_seconds || 0) / 60)} minutes
                </AppText>
              </View>
              <View style={styles.metaRow}>
                <AppText variant="caption" color="tertiary">
                  TOTAL VOLUME
                </AppText>
                <AppText variant="caption" weight="800" color="accent">
                  {(selectedSession?.total_volume || 0).toLocaleString()} kg
                </AppText>
              </View>
            </View>

            <SectionHeader title="Logged Sets Breakdown" />

            {/* Sets list */}
            {sessionSets.map((s, idx) => (
              <View
                key={s.id || idx}
                style={[
                  styles.setDetailRow,
                  {
                    backgroundColor: theme.background.secondary,
                    borderColor: theme.border.subtle,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <View style={styles.setDetailLeft}>
                  <View
                    style={[
                      styles.setNumBadge,
                      { backgroundColor: theme.background.elevated },
                    ]}
                  >
                    <AppText variant="caption" weight="800" color="primary">
                      {s.set_number}
                    </AppText>
                  </View>
                  <View>
                    <AppText variant="bodyMd" weight="700">
                      Set {s.set_number}
                    </AppText>
                    <AppText variant="caption" color="tertiary">
                      {s.set_type.toUpperCase()}
                    </AppText>
                  </View>
                </View>

                <View style={styles.setDetailRight}>
                  <AppText variant="h2" weight="800" color="primary">
                    {s.weight || 0} kg × {s.reps || 0} reps
                  </AppText>
                </View>
              </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 20,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 40,
  },
  historyCard: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sessionTitle: {
    marginTop: 2,
    marginBottom: 1,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  cardMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    gap: 2,
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
  modalMetaBox: {
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
  },
  setDetailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  setNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setDetailRight: {
    alignItems: 'flex-end',
  },
});
