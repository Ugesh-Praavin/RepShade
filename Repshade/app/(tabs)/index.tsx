import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Dumbbell, Flame, Sparkles, FastForward, CheckCircle2 } from 'lucide-react-native';

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
import { useSplitStore } from '@/stores/splitStore';
import { useExerciseStore } from '@/stores/exerciseStore';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { activeSplit, workouts, nextWorkout, loadActiveSplit, skipCurrentWorkout, isLoading } =
    useSplitStore();
  const { initializeLibrary } = useExerciseStore();

  useEffect(() => {
    initializeLibrary();
    loadActiveSplit();
  }, []);

  const currentIndex = activeSplit?.current_workout_index || 0;
  const totalWorkouts = workouts.length || 3;

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Greeting Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <AppText variant="label" color="secondary">
            WELCOME ATHLETE
          </AppText>
          <AppText variant="h1" weight="900" numberOfLines={1} adjustsFontSizeToFit>
            Ready to Train?
          </AppText>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.accent.primarySoft, borderColor: theme.accent.primary, flexShrink: 0 },
          ]}
        >
          <Flame size={14} color={theme.accent.primary} />
          <AppText variant="caption" color="accent" weight="700">
            CYCLE 1
          </AppText>
        </View>
      </View>

      {/* Up Next Card (Rolling Split Core Engine) */}
      <Card variant="highlighted" style={styles.nextCard}>
        <View style={styles.cardHeader}>
          <AppText variant="label" color="accent" style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>
            UP NEXT IN SPLIT
          </AppText>
          <AppText variant="caption" color="secondary" style={{ flexShrink: 0 }}>
            {activeSplit?.name || 'PPL Split'} ({(currentIndex % totalWorkouts) + 1}/{totalWorkouts})
          </AppText>
        </View>

        <AppText variant="h1" weight="900" numberOfLines={1} style={styles.workoutName}>
          {nextWorkout?.name || 'Push Day A'}
        </AppText>

        <AppText variant="bodyMd" color="secondary" style={styles.workoutMeta}>
          {nextWorkout?.description || 'Chest • Shoulders • Triceps'} (
          {nextWorkout?.exercises?.length || 4} exercises)
        </AppText>

        <View style={styles.actionsRow}>
          <AppButton
            title="START WORKOUT"
            onPress={() => router.push('/workout/active')}
            variant="primary"
            size="lg"
            leftIcon={<Play size={18} color="#0B0D0F" fill="#0B0D0F" />}
            style={{ flex: 1 }}
          />

          <IconButton
            icon={<FastForward size={20} color={theme.text.primary} />}
            onPress={() => skipCurrentWorkout()}
            accessibilityLabel="Skip current workout in split"
            variant="default"
            size={56}
          />
        </View>
      </Card>

      {/* Split Sequence Progress Bar */}
      <View style={styles.sequenceContainer}>
        <SectionHeader title="Rolling Sequence Position" />
        <View style={styles.sequenceSteps}>
          {workouts.map((w, idx) => {
            const isCurrent = idx === currentIndex % totalWorkouts;
            const isPast = idx < currentIndex % totalWorkouts;

            return (
              <View
                key={w.id || idx}
                style={[
                  styles.stepCard,
                  {
                    backgroundColor: isCurrent
                      ? theme.accent.primarySoft
                      : theme.background.secondary,
                    borderColor: isCurrent ? theme.accent.primary : theme.border.subtle,
                    borderRadius: radius.md,
                    borderWidth: isCurrent ? 2 : 1,
                  },
                ]}
              >
                <AppText
                  variant="caption"
                  color={isCurrent ? 'accent' : 'secondary'}
                  weight={isCurrent ? '800' : '600'}
                >
                  {w.name}
                </AppText>
                {isCurrent && (
                  <AppText variant="caption" color="accent" weight="700">
                    • UP NEXT
                  </AppText>
                )}
              </View>
            );
          })}
        </View>
      </View>

      <Divider style={{ marginVertical: 16 }} />

      {/* Quick Actions */}
      <View style={styles.quickSection}>
        <SectionHeader title="Quick Actions" />
        <View style={styles.actionGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: pressed ? theme.background.elevated : theme.background.secondary,
                borderColor: theme.border.subtle,
                borderRadius: radius.md,
              },
            ]}
            onPress={() => router.push('/exercise')}
          >
            <Dumbbell size={22} color={theme.accent.primary} />
            <AppText variant="bodyMd" weight="700">
              Exercise Library
            </AppText>
            <AppText variant="caption" color="secondary">
              50+ exercises offline
            </AppText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: pressed ? theme.background.elevated : theme.background.secondary,
                borderColor: theme.border.subtle,
                borderRadius: radius.md,
              },
            ]}
            onPress={() => router.push('/progress/prs')}
          >
            <Sparkles size={22} color={theme.accent.primary} />
            <AppText variant="bodyMd" weight="700">
              Personal Records
            </AppText>
            <AppText variant="caption" color="secondary">
              Track PR milestones
            </AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
  },
  appName: {
    letterSpacing: 2,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  nextCard: {
    marginHorizontal: 16,
    padding: 20,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    marginTop: 4,
    marginBottom: 2,
  },
  workoutMeta: {
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sequenceContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sequenceSteps: {
    gap: 8,
  },
  stepCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  quickSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
});
