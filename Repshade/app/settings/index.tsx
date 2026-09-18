import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Timer,
  Database,
  Shield,
  Smartphone,
  ChevronRight,
  Sparkles,
  RefreshCw,
  LogOut,
  Trash2,
  CloudCheck,
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
import { useExerciseStore } from '@/stores/exerciseStore';
import { useAuthStore } from '@/stores/authStore';
import { settingsRepository } from '@/repositories/settingsRepository';
import { resetDatabase } from '@/database/client';
import { syncService } from '@/services/syncService';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { initializeLibrary } = useExerciseStore();
  const { signOut, isAuthenticated, user } = useAuthStore();
  const userId = user?.uid || 'local_user';

  const [autoRestTimer, setAutoRestTimer] = useState(true);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(90);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await settingsRepository.getSettings(userId);
        if (s) {
          setWeightUnit(s.weight_unit);
          setDefaultRestSeconds(s.default_rest_seconds);
          setAutoRestTimer(s.auto_start_rest_timer === 1);
        }
      } catch (e) {
        console.warn('Failed to load settings from SQLite:', e);
      }
    }
    loadSettings();
  }, [userId]);

  const handleWeightUnitChange = async (unit: 'kg' | 'lb') => {
    setWeightUnit(unit);
    await settingsRepository.updateSettings(userId, { weight_unit: unit });
  };

  const handleRestSecondsChange = async (seconds: number) => {
    setDefaultRestSeconds(seconds);
    await settingsRepository.updateSettings(userId, { default_rest_seconds: seconds });
  };

  const handleAutoRestTimerChange = async (val: boolean) => {
    setAutoRestTimer(val);
    await settingsRepository.updateSettings(userId, { auto_start_rest_timer: val ? 1 : 0 });
  };

  const handleCloudSync = async () => {
    if (!isAuthenticated || !user?.uid || user.uid === 'local_user') {
      Alert.alert(
        'Guest Mode',
        'Sign in or create an account to back up and sync your offline workouts to the cloud.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In / Sign Up', onPress: () => router.push('/auth/sign-in') },
        ]
      );
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncService.syncAllLocalDataToFirestore(user.uid);
      Alert.alert(
        'Cloud Sync Successful',
        `Successfully synced ${res.workoutsSynced} workouts, ${res.splitsSynced} splits, and ${res.prsSynced} PRs to Firestore.`
      );
    } catch (e: any) {
      Alert.alert('Sync Failed', 'Could not sync with the cloud. Check your network connection.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReseed = async () => {
    setIsReseeding(true);
    try {
      await initializeLibrary();
      Alert.alert('Database Seeded', '50+ bundled exercises re-seeded successfully.');
    } catch (e) {
      Alert.alert('Error', 'Failed to re-seed database.');
    } finally {
      setIsReseeding(false);
    }
  };

  const handleResetData = async () => {
    setShowResetDialog(false);
    setIsResetting(true);
    try {
      await resetDatabase();
      await initializeLibrary();
      router.replace('/onboarding');
    } catch (e) {
      Alert.alert('Reset Failed', 'Could not reset local database.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignOut = async () => {
    setShowSignOutDialog(false);
    await signOut();
    router.replace('/(tabs)');
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
        <View style={{ flex: 1 }}>
          <AppText variant="h1" weight="900">
            Settings & Preferences
          </AppText>
          <AppText variant="caption" color="secondary">
            App configuration & local database management
          </AppText>
        </View>
      </View>

      <View style={styles.content}>
        {/* WORKOUT PREFERENCES */}
        <SectionHeader title="Workout Preferences" />

        <Card variant="default" style={styles.settingsCard}>
          {/* Unit selector */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd" weight="700">
                Weight Units
              </AppText>
              <AppText variant="caption" color="secondary">
                Kilograms (kg) vs Pounds (lbs)
              </AppText>
            </View>
            <View style={styles.chipGroup}>
              <Chip
                label="KG"
                selected={weightUnit === 'kg'}
                onPress={() => handleWeightUnitChange('kg')}
              />
              <Chip
                label="LB"
                selected={weightUnit === 'lb'}
                onPress={() => handleWeightUnitChange('lb')}
              />
            </View>
          </View>

          <Divider style={{ marginVertical: 12 }} />

          {/* Rest timer default */}
          <View style={styles.settingRow}>
            <View>
              <AppText variant="bodyMd" weight="700">
                Default Rest Pause
              </AppText>
              <AppText variant="caption" color="secondary">
                Auto-rest timer interval
              </AppText>
            </View>
            <View style={styles.chipGroup}>
              <Chip
                label="60s"
                selected={defaultRestSeconds === 60}
                onPress={() => handleRestSecondsChange(60)}
              />
              <Chip
                label="90s"
                selected={defaultRestSeconds === 90}
                onPress={() => handleRestSecondsChange(90)}
              />
              <Chip
                label="120s"
                selected={defaultRestSeconds === 120}
                onPress={() => handleRestSecondsChange(120)}
              />
            </View>
          </View>

          <Divider style={{ marginVertical: 12 }} />

          {/* Auto rest toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="bodyMd" weight="700">
                Auto-Start Rest Timer
              </AppText>
              <AppText variant="caption" color="secondary">
                Automatically start timer when set is completed
              </AppText>
            </View>
            <Switch
              value={autoRestTimer}
              onValueChange={handleAutoRestTimerChange}
              trackColor={{ false: theme.background.tertiary, true: theme.accent.primary }}
              thumbColor="#0B0D0F"
            />
          </View>
        </Card>

        {/* DATABASE & TOOLS */}
        <SectionHeader title="Database & Developer Tools" style={{ marginTop: 24 }} />

        <Card variant="default" style={styles.settingsCard}>
          <Pressable
            style={({ pressed }) => [
              styles.actionRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={handleCloudSync}
            disabled={isSyncing}
          >
            <View style={styles.actionLeft}>
              <CloudCheck size={18} color={theme.accent.primary} />
              <View>
                <AppText variant="bodyMd" weight="700">
                  {isSyncing ? 'Syncing to Cloud...' : 'Cloud Data Sync'}
                </AppText>
                <AppText variant="caption" color="secondary">
                  {isAuthenticated
                    ? 'Upload and synchronize local sessions & PRs with Firestore'
                    : 'Sign in to migrate and back up local workouts to the cloud'}
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </Pressable>

          <Divider style={{ marginVertical: 8 }} />

          <Pressable
            style={({ pressed }) => [
              styles.actionRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={handleReseed}
            disabled={isReseeding}
          >
            <View style={styles.actionLeft}>
              <RefreshCw size={18} color={theme.accent.primary} />
              <View>
                <AppText variant="bodyMd" weight="700">
                  {isReseeding ? 'Reseeding Library...' : 'Re-seed System Exercises'}
                </AppText>
                <AppText variant="caption" color="secondary">
                  Ensure 50+ bundled exercises are present in SQLite
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </Pressable>

          <Divider style={{ marginVertical: 8 }} />

          <Pressable
            style={({ pressed }) => [
              styles.actionRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={() => router.push('/showcase')}
          >
            <View style={styles.actionLeft}>
              <Sparkles size={18} color={theme.accent.primary} />
              <View>
                <AppText variant="bodyMd" weight="700">
                  UI Component Showcase
                </AppText>
                <AppText variant="caption" color="secondary">
                  Interactive design system token & component audit
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </Pressable>

          <Divider style={{ marginVertical: 8 }} />

          <Pressable
            style={({ pressed }) => [
              styles.actionRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={() => router.push('/onboarding')}
          >
            <View style={styles.actionLeft}>
              <Shield size={18} color={theme.text.primary} />
              <View>
                <AppText variant="bodyMd" weight="700">
                  Re-run Onboarding Setup
                </AppText>
                <AppText variant="caption" color="secondary">
                  Reconfigure split templates or initial workouts
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </Pressable>
          <Divider style={{ marginVertical: 8 }} />

          <Pressable
            style={({ pressed }) => [
              styles.actionRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={() => setShowResetDialog(true)}
          >
            <View style={styles.actionLeft}>
              <Trash2 size={18} color={theme.status.error} />
              <View>
                <AppText variant="bodyMd" weight="700" color="error">
                  Reset All Data & Database
                </AppText>
                <AppText variant="caption" color="secondary">
                  Purge all workout history, PRs, and custom splits
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.status.error} />
          </Pressable>
        </Card>

        {/* ACCOUNT & SIGN OUT */}
        {isAuthenticated && (
          <>
            <SectionHeader title="Account Actions" style={{ marginTop: 24 }} />
            <AppButton
              title="SIGN OUT SESSION"
              onPress={() => setShowSignOutDialog(true)}
              variant="destructive"
              size="md"
              leftIcon={<LogOut size={18} color="#FFFFFF" />}
            />
          </>
        )}

        {/* FOOTNOTE */}
        <View style={styles.footnote}>
          <AppText variant="caption" color="tertiary" weight="700">
            REPSHADE ENGINE v1.2.4 (BUILD 88)
          </AppText>
          <AppText variant="caption" color="secondary">
            ZERO TRACKERS • ZERO ADS • 100% OFFLINE GYM-READY
          </AppText>
        </View>
      </View>

      {/* CONFIRM DIALOGS */}
      <ConfirmDialog
        visible={showResetDialog}
        title="Reset All Training Data?"
        message="This action will permanently purge all workout sessions, sets, personal records, and custom splits from your on-device database."
        confirmLabel="RESET ALL DATA"
        cancelLabel="CANCEL"
        onConfirm={handleResetData}
        onCancel={() => setShowResetDialog(false)}
        destructive={true}
      />

      <ConfirmDialog
        visible={showSignOutDialog}
        title="Sign Out Session?"
        message="Your local encrypted training vault remains safely preserved on this device."
        confirmLabel="SIGN OUT"
        cancelLabel="KEEP LOGGED IN"
        onConfirm={handleSignOut}
        onCancel={() => setShowSignOutDialog(false)}
        destructive={true}
      />
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
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  settingsCard: {
    padding: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chipGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  footnote: {
    alignItems: 'center',
    marginTop: 36,
    gap: 4,
  },
});
