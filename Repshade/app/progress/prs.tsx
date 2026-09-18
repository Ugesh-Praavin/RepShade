import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  Award,
  Dumbbell,
  Calendar,
  Filter,
} from 'lucide-react-native';

import {
  Screen,
  AppText,
  AppButton,
  IconButton,
  Card,
  Chip,
  SectionHeader,
  Divider,
  EmptyState,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { recordRepository, PersonalRecordRow } from '@/repositories/recordRepository';
import { exerciseRepository } from '@/repositories/exerciseRepository';
import { useAuthStore } from '@/stores/authStore';
import { workoutEngine } from '@/domain/workout/workoutEngine';

export interface PRWithExercise extends PersonalRecordRow {
  exercise_name: string;
  primary_muscle: string;
  equipment: string;
}

const MUSCLE_FILTERS = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms'];

export default function PersonalRecordsScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { user } = useAuthStore();
  const effectiveUserId = user?.uid || 'local_user';

  const [prs, setPrs] = useState<PRWithExercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadPRs = async () => {
    setIsLoading(true);
    try {
      const records = await recordRepository.getAllPRs(effectiveUserId);
      const enriched: PRWithExercise[] = [];

      for (const r of records) {
        const ex = await exerciseRepository.getExerciseById(r.exercise_id);
        enriched.push({
          ...r,
          exercise_name: ex?.name || 'Exercise',
          primary_muscle: ex?.primary_muscle || 'General',
          equipment: ex?.equipment || 'Bodyweight',
        });
      }

      setPrs(enriched);
    } catch (e) {
      console.error('Error loading PRs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    recordRepository
      .getAllPRs(effectiveUserId)
      .then(async (records) => {
        const enriched: PRWithExercise[] = [];
        for (const r of records) {
          const ex = await exerciseRepository.getExerciseById(r.exercise_id);
          enriched.push({
            ...r,
            exercise_name: ex?.name || 'Exercise',
            primary_muscle: ex?.primary_muscle || 'General',
            equipment: ex?.equipment || 'Bodyweight',
          });
        }
        if (isMounted) {
          setPrs(enriched);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error('Error loading PRs:', e);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveUserId]);

  const filteredPrs =
    selectedMuscle === 'All'
      ? prs
      : prs.filter(
          (p) => (p.primary_muscle || '').toLowerCase() === selectedMuscle.toLowerCase()
        );

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
        <View style={styles.headerTitles}>
          <AppText variant="h1" weight="900">
            Personal Records
          </AppText>
          <AppText variant="caption" color="secondary">
            All-time max loads, reps & 1RM estimates
          </AppText>
        </View>
      </View>

      {/* Muscle Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {MUSCLE_FILTERS.map((m) => {
          const isSelected = selectedMuscle === m;

          return (
            <Chip
              key={m}
              label={m}
              selected={isSelected}
              onPress={() => setSelectedMuscle(m)}
            />
          );
        })}
      </ScrollView>

      {/* PR Cards List */}
      {filteredPrs.length === 0 && !isLoading ? (
        <EmptyState
          title="No PR Milestones Yet"
          description="Log completed sets during your workouts to automatically detect and celebrate Personal Records here."
          actionTitle="START WORKOUT"
          onAction={() => router.push('/(tabs)')}
          icon={<Award size={40} color={theme.text.tertiary} />}
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={styles.listContainer}>
          {filteredPrs.map((pr) => {
            const weight = pr.weight || pr.value || 0;
            const reps = pr.reps || 1;
            const est1RM = workoutEngine.calculateEstimated1RM(weight, reps);

            return (
              <Card
                key={pr.id}
                variant="highlighted"
                style={StyleSheet.flatten([styles.prCard, { borderColor: theme.accent.primarySoft }])}
              >
                <View style={styles.prCardTop}>
                  <View style={{ flex: 1 }}>
                    <AppText variant="caption" color="accent" weight="800" style={styles.muscleTag}>
                      {(pr.primary_muscle || 'GENERAL').toUpperCase()} •{' '}
                      {(pr.equipment || 'EQUIPMENT').toUpperCase()}
                    </AppText>
                    <AppText variant="h2" weight="900">
                      {pr.exercise_name}
                    </AppText>
                  </View>

                  <View
                    style={[
                      styles.prBadge,
                      {
                        backgroundColor: theme.accent.primarySoft,
                        borderColor: theme.accent.primary,
                      },
                    ]}
                  >
                    <Sparkles size={12} color={theme.accent.primary} />
                    <AppText variant="caption" color="accent" weight="800">
                      PR
                    </AppText>
                  </View>
                </View>

                <Divider style={{ marginVertical: 12 }} />

                <View style={styles.prMetricsRow}>
                  <View style={styles.prMetricItem}>
                    <AppText variant="caption" color="tertiary">
                      BEST LOAD
                    </AppText>
                    <AppText variant="h2" weight="900" color="primary">
                      {weight} kg × {reps} reps
                    </AppText>
                  </View>

                  <View style={styles.prMetricItem}>
                    <AppText variant="caption" color="tertiary">
                      ESTIMATED 1RM
                    </AppText>
                    <AppText variant="h2" weight="900" color="accent">
                      {est1RM} kg
                    </AppText>
                  </View>

                  <View style={styles.prMetricItem}>
                    <AppText variant="caption" color="tertiary">
                      DATE ACHIEVED
                    </AppText>
                    <AppText variant="caption" weight="700" color="secondary">
                      {formatDate(pr.achieved_at)}
                    </AppText>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      )}
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
  headerTitles: {
    flex: 1,
  },
  filterRow: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 40,
  },
  prCard: {
    padding: 16,
  },
  prCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  muscleTag: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  prBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  prMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  prMetricItem: {
    gap: 2,
  },
});
