import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, Plus, ChevronRight, Play } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  Card,
  SectionHeader,
  Divider,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useSplitStore } from '@/stores/splitStore';

export default function PlanScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { activeSplit, workouts, loadActiveSplit } = useSplitStore();

  useEffect(() => {
    loadActiveSplit();
  }, []);

  const currentIndex = activeSplit?.current_workout_index || 0;
  const totalWorkouts = workouts.length || 1;

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <ScreenHeader
        title="Training Plan"
        subtitle={activeSplit?.name || 'Rolling Split'}
      />

      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AppText variant="h2" weight="800">
              Your Split Routine
            </AppText>
            <AppText variant="bodySm" color="secondary">
              Rolling sequence advances only upon completion or manual skip.
            </AppText>
          </View>
          <AppButton
            title="EDIT ROUTINE"
            onPress={() => router.push('/plan/edit')}
            variant="primary"
            size="sm"
          />
        </View>
      </View>

      <View style={styles.workoutList}>
        {workouts.map((w, idx) => {
          const isUpNext = idx === currentIndex % totalWorkouts;

          return (
            <Card
              key={w.id || idx}
              variant={isUpNext ? 'highlighted' : 'default'}
              style={styles.workoutCard}
            >
              <View style={styles.cardTop}>
                <View style={styles.orderBadge}>
                  <AppText
                    variant="label"
                    color={isUpNext ? 'accent' : 'secondary'}
                    weight="700"
                  >
                    WORKOUT {idx + 1} {isUpNext ? '• UP NEXT' : ''}
                  </AppText>
                </View>
                <Dumbbell size={16} color={isUpNext ? theme.accent.primary : theme.text.tertiary} />
              </View>

              <AppText variant="h3" weight="800">
                {w.name}
              </AppText>
              <AppText variant="bodySm" color="secondary">
                {w.description || 'Target workout routine'}
              </AppText>

              {/* Exercise Items List Preview */}
              <View style={styles.exercisePreview}>
                <Divider style={{ marginVertical: 8 }} />
                {w.exercises?.map((ex, eIdx) => (
                  <View key={ex.exercise_id + eIdx} style={styles.exerciseRow}>
                    <AppText variant="bodySm" weight="600" style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>
                      {eIdx + 1}. {ex.exercise_name || 'Exercise'}
                    </AppText>
                    <AppText variant="caption" color="secondary" style={{ flexShrink: 0 }}>
                      {ex.target_sets} sets × {ex.target_rep_min}-{ex.target_rep_max} reps
                    </AppText>
                  </View>
                ))}
              </View>

              {isUpNext && (
                <AppButton
                  title="START THIS WORKOUT"
                  onPress={() => router.push('/workout/active')}
                  variant="primary"
                  size="sm"
                  leftIcon={<Play size={14} color="#0B0D0F" fill="#0B0D0F" />}
                  style={{ marginTop: 12 }}
                />
              )}
            </Card>
          );
        })}
      </View>

      {/* Change Split / Re-run Onboarding CTA */}
      <View style={styles.footerContainer}>
        <AppButton
          title="EDIT ROUTINE & WORKOUTS"
          onPress={() => router.push('/plan/edit')}
          variant="primary"
          size="md"
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="CHANGE SPLIT TEMPLATE"
          onPress={() => router.push('/onboarding/choose-split')}
          variant="secondary"
          size="md"
        />
      </View>
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
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderBadge: {
    paddingVertical: 2,
  },
  exercisePreview: {
    gap: 6,
    marginTop: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
});
