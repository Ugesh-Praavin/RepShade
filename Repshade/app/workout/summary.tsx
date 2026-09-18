import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Trophy,
  Check,
  ArrowRight,
  Sparkles,
  Flame,
  Calendar,
  Layers,
  Clock,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react-native';

import {
  Screen,
  AppText,
  AppButton,
  Card,
  SectionHeader,
  Divider,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useSplitStore } from '@/stores/splitStore';
import { workoutEngine } from '@/domain/workout/workoutEngine';

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { summaryData } = useWorkoutStore();
  const { activeSplit, workouts, nextWorkout } = useSplitStore();

  const durationMin = Math.max(
    1,
    Math.round((summaryData?.durationSeconds || 0) / 60)
  );
  const totalVolume = summaryData?.totalVolume || 0;
  const totalSets = summaryData?.totalSets || 0;
  const totalReps = summaryData?.totalReps || 0;
  const breakdown = summaryData?.breakdown || [];

  const splitIndex = activeSplit?.current_workout_index || 0;
  const totalWorkouts = workouts.length || 3;

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      {/* Top Status Header */}
      <View
        style={[
          styles.topHeader,
          {
            backgroundColor: theme.background.primary,
            borderBottomColor: theme.border.subtle,
          },
        ]}
      >
        <View style={styles.telemetryBadge}>
          <View style={[styles.statusDot, { backgroundColor: theme.status.success }]} />
          <AppText variant="caption" color="secondary" weight="700">
            SESSION LOGGED • OFFLINE READY
          </AppText>
        </View>
        <AppText variant="caption" color="tertiary" weight="700">
          LOCAL SYNCED
        </AppText>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. COMPLETION HERO ANCHOR */}
        <View style={styles.heroSection}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: theme.accent.primarySoft,
                  borderColor: theme.accent.primary,
                },
              ]}
            >
              <Check size={16} color={theme.accent.primary} strokeWidth={3} />
            </View>
            <AppText variant="caption" color="accent" weight="800">
              WORKOUT COMPLETE
            </AppText>
          </View>

          <AppText variant="h1" weight="900" style={styles.workoutTitle}>
            {summaryData?.templateName || 'WORKOUT COMPLETED'}
          </AppText>

          <AppText variant="bodyMd" color="secondary">
            {summaryData?.templateDescription || 'Chest • Shoulders • Triceps'}
          </AppText>

          <View style={styles.heroMetaRow}>
            <AppText variant="caption" color="tertiary" weight="700">
              TODAY
            </AppText>
            <AppText variant="caption" color="tertiary">
              •
            </AppText>
            <AppText variant="caption" color="secondary" weight="700">
              {durationMin} MIN DURATION
            </AppText>
            <AppText variant="caption" color="tertiary">
              •
            </AppText>
            <AppText variant="caption" color="secondary" weight="700">
              {totalReps} TOTAL REPS
            </AppText>
          </View>
        </View>

        {/* 2. CORE TELEMETRY METRICS GRID (2x2) */}
        <View style={styles.metricsGrid}>
          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.subtle,
                borderRadius: radius.lg,
              },
            ]}
          >
            <AppText variant="caption" color="tertiary" weight="800">
              DURATION
            </AppText>
            <View style={styles.metricValRow}>
              <AppText variant="h1" weight="900">
                {durationMin}
              </AppText>
              <AppText variant="caption" color="secondary" style={styles.metricUnit}>
                min
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.subtle,
                borderRadius: radius.lg,
              },
            ]}
          >
            <AppText variant="caption" color="tertiary" weight="800">
              TOTAL VOLUME
            </AppText>
            <View style={styles.metricValRow}>
              <AppText variant="h1" weight="900">
                {totalVolume.toLocaleString()}
              </AppText>
              <AppText variant="caption" color="secondary" style={styles.metricUnit}>
                kg
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.subtle,
                borderRadius: radius.lg,
              },
            ]}
          >
            <AppText variant="caption" color="tertiary" weight="800">
              EXERCISES
            </AppText>
            <View style={styles.metricValRow}>
              <AppText variant="h1" weight="900">
                {breakdown.length || 1}
              </AppText>
              <AppText variant="caption" color="secondary" style={styles.metricUnit}>
                finished
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.subtle,
                borderRadius: radius.lg,
              },
            ]}
          >
            <AppText variant="caption" color="tertiary" weight="800">
              SETS LOGGED
            </AppText>
            <View style={styles.metricValRow}>
              <AppText variant="h1" weight="900">
                {totalSets}
              </AppText>
              <AppText variant="caption" color="secondary" style={styles.metricUnit}>
                working sets
              </AppText>
            </View>
          </View>
        </View>

        {/* 3. SPLIT ADVANCEMENT CARD (CRUCIAL ROLLING SPLIT LOGIC) */}
        <Card
          variant="highlighted"
          style={StyleSheet.flatten([styles.splitCard, { borderRadius: radius.lg }])}
        >
          <View style={styles.splitHeader}>
            <View style={styles.splitIndicator}>
              <View style={[styles.statusDot, { backgroundColor: theme.accent.primary }]} />
              <AppText variant="caption" color="primary" weight="800">
                ROLLING SPLIT ADVANCED
              </AppText>
            </View>
            <AppText variant="caption" color="secondary" weight="700">
              Position {(splitIndex % totalWorkouts) + 1} of {totalWorkouts}
            </AppText>
          </View>

          <View
            style={[
              styles.nextWorkoutBox,
              {
                backgroundColor: theme.background.primary,
                borderColor: theme.border.subtle,
                borderRadius: radius.md,
              },
            ]}
          >
            <View>
              <AppText variant="caption" color="tertiary" weight="800">
                NEXT IN YOUR SPLIT
              </AppText>
              <AppText variant="h2" weight="900" style={{ marginTop: 2 }}>
                {nextWorkout?.name || 'PULL DAY A'}
              </AppText>
              <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
                {nextWorkout?.description || 'Back • Biceps • Rear Delts'}
              </AppText>
            </View>

            {/* Step Sequence Pills */}
            <View style={styles.stepsSequence}>
              {workouts.map((w, idx) => {
                const isCurrent = idx === splitIndex % totalWorkouts;
                const isPast = idx < splitIndex % totalWorkouts;

                return (
                  <View
                    key={w.id || idx}
                    style={[
                      styles.stepPill,
                      {
                        backgroundColor: isCurrent
                          ? theme.accent.primary
                          : theme.background.secondary,
                        borderColor: isCurrent ? theme.accent.primary : theme.border.subtle,
                      },
                    ]}
                  >
                    <AppText
                      variant="caption"
                      color={isCurrent ? 'inverse' : isPast ? 'tertiary' : 'secondary'}
                      weight="800"
                    >
                      {w.name.split(' ')[0]} {isPast ? '✓' : ''}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </View>

          <AppText variant="caption" color="tertiary" style={styles.splitExplanation}>
            The calendar tells you when you trained. Your split tells you what you train next.
            {'\n'}
            Missed days will never advance this position until you complete or manually skip it.
          </AppText>
        </Card>

        {/* 4. EXERCISE BREAKDOWN LIST */}
        {breakdown.length > 0 && (
          <View style={styles.breakdownSection}>
            <SectionHeader title="Exercise Breakdown" />
            <View
              style={[
                styles.breakdownContainer,
                {
                  backgroundColor: theme.background.secondary,
                  borderColor: theme.border.subtle,
                  borderRadius: radius.lg,
                },
              ]}
            >
              {breakdown.map((item, idx) => (
                <View
                  key={item.exerciseId || idx}
                  style={[
                    styles.breakdownRow,
                    idx > 0 && { borderTopWidth: 1, borderTopColor: theme.border.subtle },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.breakdownNameRow}>
                      <AppText variant="caption" color="tertiary" weight="800">
                        {String(idx + 1).padStart(2, '0')}
                      </AppText>
                      <AppText variant="bodyMd" weight="700">
                        {item.exerciseName}
                      </AppText>
                    </View>
                    <AppText
                      variant="caption"
                      color="tertiary"
                      style={{ marginLeft: 22, marginTop: 2 }}
                    >
                      {item.setsCount} sets • Best: {item.bestWeight} kg × {item.bestReps}
                    </AppText>
                  </View>

                  <View style={styles.breakdownVol}>
                    <AppText variant="caption" weight="800" color="primary">
                      {item.volume.toLocaleString()} kg
                    </AppText>
                    <AppText variant="caption" color="tertiary">
                      vol
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 5. LOCAL DATABASE ARCHIVE FOOTNOTE */}
        <View style={styles.archiveFootnote}>
          <ShieldCheck size={14} color={theme.text.tertiary} />
          <AppText variant="caption" color="tertiary">
            Permanent session archive saved to local SQLite database.
          </AppText>
        </View>
      </ScrollView>

      {/* 6. BOTTOM FIXED ACTION */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.background.primary,
            borderTopColor: theme.border.subtle,
          },
        ]}
      >
        <AppButton
          title="DONE"
          onPress={() => router.replace('/(tabs)')}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} color="#0B0D0F" />}
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 100,
  },
  heroSection: {
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  workoutTitle: {
    marginTop: 4,
    fontSize: 28,
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricBox: {
    width: '48%',
    padding: 14,
    borderWidth: 1,
    gap: 4,
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricUnit: {
    fontSize: 12,
  },
  splitCard: {
    padding: 16,
    gap: 12,
  },
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splitIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextWorkoutBox: {
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  stepsSequence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  stepPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  splitExplanation: {
    lineHeight: 18,
  },
  breakdownSection: {
    gap: 8,
  },
  breakdownContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  breakdownNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownVol: {
    alignItems: 'flex-end',
  },
  archiveFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
});
