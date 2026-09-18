import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  TrendingUp,
  Award,
  Activity,
  Flame,
  ChevronRight,
  Sparkles,
  BarChart3,
  Dumbbell,
  Target,
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
import { progressRepository } from '@/repositories/progressRepository';
import { recordRepository, PersonalRecordRow } from '@/repositories/recordRepository';
import { historyRepository } from '@/repositories/historyRepository';

export default function ProgressScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();

  const [weeklyVolume, setWeeklyVolume] = useState<{ weekStart: number; totalVolume: number }[]>([]);
  const [prs, setPrs] = useState<PersonalRecordRow[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);

  const loadProgressData = async () => {
    try {
      const [vol, allPrs, history] = await Promise.all([
        progressRepository.getWeeklyVolume('local_user', 6),
        recordRepository.getAllPRs('local_user'),
        historyRepository.getWorkoutHistory('local_user', 100),
      ]);
      setWeeklyVolume(vol);
      setPrs(allPrs);
      setTotalSessions(history.length);
    } catch (e) {
      console.error('Error loading progress data:', e);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      progressRepository.getWeeklyVolume('local_user', 6),
      recordRepository.getAllPRs('local_user'),
      historyRepository.getWorkoutHistory('local_user', 100),
    ])
      .then(([vol, allPrs, history]) => {
        if (isMounted) {
          setWeeklyVolume(vol);
          setPrs(allPrs);
          setTotalSessions(history.length);
        }
      })
      .catch((e) => {
        console.error('Error loading progress data:', e);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalWeeklyVol = weeklyVolume.reduce((acc, curr) => acc + curr.totalVolume, 0);
  const maxWeeklyVol = Math.max(...weeklyVolume.map((w) => w.totalVolume), 1000);

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* Header with zero overlap */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <AppText variant="label" color="secondary">
            OFFLINE ANALYTICS
          </AppText>
          <AppText variant="h1" weight="900" numberOfLines={1} adjustsFontSizeToFit style={styles.headerTitleText}>
            Progress Overview
          </AppText>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: theme.accent.primarySoft,
              borderColor: theme.accent.primary,
            },
          ]}
        >
          <TrendingUp size={13} color={theme.accent.primary} />
          <AppText variant="caption" color="accent" weight="800">
            TRENDING
          </AppText>
        </View>
      </View>

      {/* Telemetry Metric Cards */}
      <View style={styles.statsRow}>
        <Card variant="default" style={styles.statCard}>
          <Activity size={18} color={theme.accent.primary} />
          <AppText variant="h1" weight="900" numberOfLines={1}>
            {(totalWeeklyVol / 1000).toFixed(1)}k
          </AppText>
          <AppText variant="caption" color="tertiary" weight="800">
            RECENT VOLUME (KG)
          </AppText>
        </Card>

        <Card variant="default" style={styles.statCard}>
          <Award size={18} color={theme.accent.primary} />
          <AppText variant="h1" weight="900" numberOfLines={1}>
            {prs.length}
          </AppText>
          <AppText variant="caption" color="tertiary" weight="800">
            TOTAL PR MILESTONES
          </AppText>
        </Card>
      </View>

      {/* Personal Records Banner Card (Zero Chevron Overlap) */}
      <Pressable
        style={({ pressed }) => [
          styles.prBannerCard,
          {
            backgroundColor: pressed ? theme.background.elevated : theme.background.secondary,
            borderColor: theme.border.subtle,
            borderRadius: radius.lg,
          },
        ]}
        onPress={() => router.push('/progress/prs')}
      >
        <View style={styles.prBannerLeft}>
          <View
            style={[
              styles.prIconCircle,
              {
                backgroundColor: theme.accent.primarySoft,
                borderColor: theme.accent.primary,
              },
            ]}
          >
            <Sparkles size={20} color={theme.accent.primary} />
          </View>
          <View style={styles.prBannerTextGroup}>
            <AppText variant="h2" weight="900" numberOfLines={1}>
              Personal Records ({prs.length})
            </AppText>
            <AppText variant="caption" color="secondary" numberOfLines={2} style={styles.prSubtext}>
              View maximum loads, rep records, & 1RM estimates
            </AppText>
          </View>
        </View>

        <ChevronRight size={20} color={theme.text.secondary} style={styles.chevronIcon} />
      </Pressable>

      <Divider style={{ marginVertical: 20 }} />

      {/* Weekly Volume Trend Visualizer (Zero Label Collision) */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Weekly Volume Progression" />

        <Card variant="default" style={styles.chartCard}>
          {weeklyVolume.length === 0 ? (
            <AppText variant="caption" color="tertiary" style={{ textAlign: 'center', padding: 20 }}>
              Complete workouts to populate your weekly volume progression.
            </AppText>
          ) : (
            <View style={styles.barChartContainer}>
              {weeklyVolume.map((item, idx) => {
                const heightPct = Math.max(12, Math.round((item.totalVolume / maxWeeklyVol) * 100));

                return (
                  <View key={item.weekStart || idx} style={styles.barColumn}>
                    <AppText variant="caption" color="secondary" weight="800" style={styles.barLabelText}>
                      {(item.totalVolume / 1000).toFixed(1)}k
                    </AppText>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${heightPct}%`,
                            backgroundColor: theme.accent.primary,
                            borderRadius: radius.xs,
                          },
                        ]}
                      />
                    </View>
                    <AppText variant="caption" color="tertiary" weight="700">
                      W{idx + 1}
                    </AppText>
                  </View>
                );
              })}
            </View>
          )}
        </Card>
      </View>

      {/* Muscle Group Volume Distribution */}
      <View style={styles.sectionContainer}>
        <SectionHeader title="Muscle Group Distribution" />

        <Card variant="default" style={styles.distributionCard}>
          <View style={styles.distItem}>
            <View style={styles.distLabelRow}>
              <AppText variant="bodyMd" weight="700">
                Chest & Shoulders
              </AppText>
              <AppText variant="caption" color="accent" weight="800">
                40%
              </AppText>
            </View>
            <View style={[styles.distTrack, { backgroundColor: theme.background.tertiary }]}>
              <View
                style={[
                  styles.distFill,
                  { width: '40%', backgroundColor: theme.accent.primary },
                ]}
              />
            </View>
          </View>

          <View style={styles.distItem}>
            <View style={styles.distLabelRow}>
              <AppText variant="bodyMd" weight="700">
                Back & Biceps
              </AppText>
              <AppText variant="caption" color="accent" weight="800">
                35%
              </AppText>
            </View>
            <View style={[styles.distTrack, { backgroundColor: theme.background.tertiary }]}>
              <View
                style={[
                  styles.distFill,
                  { width: '35%', backgroundColor: theme.accent.primary },
                ]}
              />
            </View>
          </View>

          <View style={styles.distItem}>
            <View style={styles.distLabelRow}>
              <AppText variant="bodyMd" weight="700">
                Legs & Core
              </AppText>
              <AppText variant="caption" color="accent" weight="800">
                25%
              </AppText>
            </View>
            <View style={[styles.distTrack, { backgroundColor: theme.background.tertiary }]}>
              <View
                style={[
                  styles.distFill,
                  { width: '25%', backgroundColor: theme.accent.primary },
                ]}
              />
            </View>
          </View>
        </Card>
      </View>
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
  headerTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  headerTitleText: {
    fontSize: 26,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    flexShrink: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  prBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    padding: 16,
    borderWidth: 1,
  },
  prBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  prIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  prBannerTextGroup: {
    flex: 1,
  },
  prSubtext: {
    marginTop: 2,
    lineHeight: 16,
  },
  chevronIcon: {
    flexShrink: 0,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartCard: {
    padding: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 16,
    paddingBottom: 4,
  },
  barColumn: {
    alignItems: 'center',
    gap: 6,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barLabelText: {
    fontSize: 11,
    marginBottom: 2,
  },
  barTrack: {
    width: 24,
    height: 90,
    backgroundColor: '#191D21',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
  },
  distributionCard: {
    padding: 16,
    gap: 14,
  },
  distItem: {
    gap: 6,
  },
  distLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
    borderRadius: 3,
  },
});
