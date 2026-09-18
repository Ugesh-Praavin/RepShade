import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dumbbell, Award, History, Info } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  Card,
  SectionHeader,
  Divider,
  StatCard,
  EmptyState,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useExerciseStore } from '@/stores/exerciseStore';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { selectedExerciseDetail, isLoading, loadExerciseDetails } = useExerciseStore();

  useEffect(() => {
    if (id) {
      loadExerciseDetails(id);
    }
  }, [id]);

  if (isLoading || !selectedExerciseDetail) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ScreenHeader title="Exercise Details" showBack />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent.primary} />
        </View>
      </Screen>
    );
  }

  const { exercise, prs, recentSets } = selectedExerciseDetail;
  const bestWeightPR = prs.find((p) => p.record_type === 'weight');

  let secondaryList: string[] = [];
  if (exercise.secondary_muscles) {
    try {
      secondaryList = JSON.parse(exercise.secondary_muscles);
    } catch {
      secondaryList = [exercise.secondary_muscles];
    }
  }

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <ScreenHeader title={exercise.name} showBack />

      {/* Target Muscles & Equipment Header Card */}
      <Card variant="default" style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: theme.accent.primarySoft, borderColor: theme.accent.primary }]}>
            <AppText variant="caption" color="accent" weight="700">
              {exercise.primary_muscle.toUpperCase()}
            </AppText>
          </View>
          {exercise.equipment && (
            <View style={[styles.badge, { backgroundColor: theme.background.tertiary, borderColor: theme.border.subtle }]}>
              <AppText variant="caption" color="secondary" weight="600">
                {exercise.equipment.toUpperCase()}
              </AppText>
            </View>
          )}
          {exercise.is_custom === 1 && (
            <View style={[styles.badge, { backgroundColor: 'rgba(110, 168, 254, 0.15)', borderColor: theme.status.info }]}>
              <AppText variant="caption" color="info" weight="700">
                CUSTOM
              </AppText>
            </View>
          )}
        </View>

        {secondaryList.length > 0 && (
          <View style={styles.secondaryRow}>
            <AppText variant="caption" color="tertiary">
              Secondary Muscles:{' '}
            </AppText>
            <AppText variant="caption" color="secondary">
              {secondaryList.join(', ')}
            </AppText>
          </View>
        )}
      </Card>

      {/* Personal Records Section */}
      <View style={styles.section}>
        <SectionHeader title="Personal Record (PR)" />
        <View style={styles.statsRow}>
          <StatCard
            label="HEAVIEST LIFT"
            value={bestWeightPR ? `${bestWeightPR.value} kg` : '--'}
            subtitle={bestWeightPR?.reps ? `${bestWeightPR.reps} reps` : 'No record yet'}
            icon={<Award size={18} color={theme.accent.primary} />}
          />
          <StatCard
            label="TRACKING"
            value={exercise.tracking_type === 'weight_reps' ? 'Weight × Reps' : exercise.tracking_type}
            subtitle="Standard strength"
            icon={<Dumbbell size={18} color={theme.text.secondary} />}
          />
        </View>
      </View>

      <Divider />

      {/* Previous Performance History */}
      <View style={styles.section}>
        <SectionHeader title="Recent Performance Log" />
        {recentSets.length === 0 ? (
          <EmptyState
            icon={<History size={32} color={theme.text.tertiary} />}
            title="No sets recorded"
            description="Perform this exercise in an active workout to track your history and progressive overload."
          />
        ) : (
          <View style={styles.historyList}>
            {recentSets.map((s, idx) => (
              <View
                key={s.id || idx}
                style={[
                  styles.historyItem,
                  { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle, borderRadius: radius.sm },
                ]}
              >
                <AppText variant="bodyMd" weight="700">
                  Set {s.set_number}
                </AppText>
                <View style={styles.historyValues}>
                  <AppText variant="bodyMd" weight="800" color="accent">
                    {s.weight || 0} kg
                  </AppText>
                  <AppText variant="bodySm" color="secondary">
                    × {s.reps || 0} reps
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  secondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
  historyValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
});
