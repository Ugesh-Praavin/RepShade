import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Settings as SettingsIcon,
  Shield,
  LogOut,
  LogIn,
  ChevronRight,
  Verified,
  Lock,
  RotateCw,
  Sliders,
  Timer,
  Moon,
  Bell,
  CloudCheck,
  Download,
  ShieldCheck,
  Camera,
} from 'lucide-react-native';
import { Image } from 'expo-image';

import {
  Screen,
  AppText,
  Card,
  Divider,
  AppButton,
  ConfirmDialog,
  AvatarPickerModal,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/authStore';
import { useSplitStore } from '@/stores/splitStore';
import { syncService } from '@/services/syncService';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { user, isAuthenticated, signOut, updateProfilePhoto } = useAuthStore();
  const { activeSplit, nextWorkout } = useSplitStore();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSignOut = async () => {
    setShowSignOutDialog(false);
    await signOut();
  };

  const handleCloudSync = async () => {
    if (!isAuthenticated || !user?.uid || user.uid === 'local_user') {
      router.push('/auth/sign-in');
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const res = await syncService.syncAllLocalDataToFirestore(user.uid);
      setSyncStatus(`Synced: ${res.workoutsSynced} workouts, ${res.splitsSynced} splits, ${res.prsSynced} PRs!`);
      setTimeout(() => setSyncStatus(null), 5000);
    } catch (e: any) {
      setSyncStatus('Sync error. Please check your internet connection.');
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  const displayName = user?.displayName || 'user';
  const userEmail = user?.email || (isAuthenticated ? 'user@gmail.com' : 'guest@gmail.com');
  const initials = (displayName || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'U';

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      {/* 1. TOP PROFILE HEADER & TELEMETRY */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <AppText variant="caption" color="accent" weight="800">
            YOUR ACCOUNT
          </AppText>
          <AppText variant="h1" weight="900" numberOfLines={1} adjustsFontSizeToFit>
            PROFILE
          </AppText>
        </View>
        <View
          style={[
            styles.encryptedBadge,
            {
              backgroundColor: theme.background.secondary,
              borderColor: theme.border.subtle,
              flexShrink: 0,
            },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: theme.status.success }]} />
          <AppText variant="caption" color="secondary" weight="700">
            LOCAL ENCRYPTED
          </AppText>
        </View>
      </View>

      {/* 2. USER IDENTITY CARD */}
      <Card
        variant="default"
        style={StyleSheet.flatten([
          styles.identityCard,
          { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle },
        ])}
      >
        <View style={styles.identityRow}>
          <Pressable
            style={[
              styles.monogramAvatar,
              {
                backgroundColor: user?.photoURL ? 'transparent' : theme.accent.primarySoft,
                borderColor: theme.accent.primary,
              },
            ]}
            onPress={() => setShowAvatarPicker(true)}
            accessibilityLabel="Change profile avatar"
          >
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatarPhoto}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />
            ) : (
              <AppText variant="h2" weight="900" color="accent">
                {initials}
              </AppText>
            )}
            <View style={[styles.avatarBadge, { backgroundColor: theme.accent.primary }]}>
              <Camera size={11} color="#0B0D0F" strokeWidth={2.5} />
            </View>
          </Pressable>

          <View style={styles.identityDetails}>
            <View style={styles.nameRow}>
              <AppText variant="h2" weight="900" numberOfLines={1}>
                {displayName}
              </AppText>
              <Verified size={16} color={theme.accent.primary} />
            </View>
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {userEmail}
            </AppText>
            <Pressable
              onPress={() => setShowAvatarPicker(true)}
              style={styles.changeAvatarBtn}
              hitSlop={8}
            >
              <AppText variant="caption" color="accent" weight="700">
                {user?.photoURL ? 'CHANGE AVATAR' : 'CHOOSE AVATAR (12 PRESETS)'}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Card>

      {/* 2.5 CLOUD SYNC CALLOUT */}
      <Card
        variant="highlighted"
        style={StyleSheet.flatten([
          styles.cloudCard,
          { backgroundColor: theme.background.secondary, borderColor: theme.accent.primary },
        ])}
      >
        <View style={styles.cloudRow}>
          <CloudCheck size={22} color={theme.accent.primary} />
          <View style={{ flex: 1 }}>
            <AppText variant="label" weight="800" color="primary">
              {isAuthenticated ? 'CLOUD SYNC & BACKUP' : 'SYNC GUEST DATA TO CLOUD'}
            </AppText>
            <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
              {syncStatus ||
                (isAuthenticated
                  ? 'All on-device routines, sessions, and PRs are backed up to Firestore.'
                  : 'Training as Guest? Sign in or create an account to migrate and sync all your local workouts and PRs with the cloud.')}
            </AppText>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          {isAuthenticated ? (
            <AppButton
              title={isSyncing ? 'SYNCING DATA...' : 'SYNC DATA TO CLOUD'}
              onPress={handleCloudSync}
              loading={isSyncing}
              variant="secondary"
              size="sm"
              leftIcon={<RotateCw size={14} color={theme.accent.primary} />}
            />
          ) : (
            <AppButton
              title="SIGN IN / CREATE ACCOUNT TO SYNC"
              onPress={() => router.push('/auth/sign-in')}
              variant="primary"
              size="sm"
              leftIcon={<LogIn size={14} color="#0B0D0F" />}
            />
          )}
        </View>
      </Card>

      {/* 3. TRAINING CONTEXT OVERVIEW GRID */}
      <View style={styles.contextGrid}>
        <View
          style={[
            styles.contextCard,
            { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle, borderRadius: radius.md },
          ]}
        >
          <View style={styles.contextTop}>
            <AppText variant="caption" color="tertiary" weight="800">
              SPLIT
            </AppText>
            <RotateCw size={12} color={theme.text.tertiary} />
          </View>
          <AppText variant="label" weight="800" color="primary" numberOfLines={1} style={{ marginTop: 4 }}>
            {activeSplit?.name || 'Push / Pull / Legs'}
          </AppText>
          <AppText variant="caption" color="secondary">
            3-Day Rolling Loop
          </AppText>
        </View>

        <View
          style={[
            styles.contextCard,
            { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle, borderRadius: radius.md },
          ]}
        >
          <View style={styles.contextTop}>
            <AppText variant="caption" color="tertiary" weight="800">
              NEXT SESSION
            </AppText>
            <View style={[styles.statusDot, { backgroundColor: theme.accent.primary }]} />
          </View>
          <AppText variant="label" weight="800" color="accent" numberOfLines={1} style={{ marginTop: 4 }}>
            {nextWorkout?.name || 'Push Day A'}
          </AppText>
          <AppText variant="caption" color="secondary" numberOfLines={1}>
            {nextWorkout?.description || 'Chest • Shoulders'}
          </AppText>
        </View>

        <View
          style={[
            styles.contextCard,
            { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle, borderRadius: radius.md },
          ]}
        >
          <AppText variant="caption" color="tertiary" weight="800">
            EXPERIENCE
          </AppText>
          <AppText variant="label" weight="800" color="primary" style={{ marginTop: 4 }}>
            1–3 Years
          </AppText>
          <AppText variant="caption" color="secondary">
            Intermediate Lifter
          </AppText>
        </View>

        <View
          style={[
            styles.contextCard,
            { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle, borderRadius: radius.md },
          ]}
        >
          <AppText variant="caption" color="tertiary" weight="800">
            FOCUS
          </AppText>
          <AppText variant="label" weight="800" color="primary" style={{ marginTop: 4 }}>
            Hypertrophy
          </AppText>
          <AppText variant="caption" color="secondary">
            Mechanical Tension
          </AppText>
        </View>
      </View>

      {/* 4. GROUPED SETTINGS */}
      <View style={styles.groupSection}>
        <AppText variant="caption" color="tertiary" weight="800" style={styles.groupHeader}>
          TRAINING & APP CONFIG
        </AppText>

        <Card variant="default" style={styles.groupCard}>
          <Pressable
            style={({ pressed }) => [
              styles.menuRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.menuLeft}>
              <Sliders size={18} color={theme.text.primary} />
              <View>
                <AppText variant="bodyMd" weight="700">
                  Settings & Preferences
                </AppText>
                <AppText variant="caption" color="secondary">
                  Units, rest timer, database tools
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </Pressable>

          <Divider style={{ marginVertical: 8 }} />

          <Pressable
            style={({ pressed }) => [
              styles.menuRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={() => router.push('/onboarding')}
          >
            <View style={styles.menuLeft}>
              <RotateCw size={18} color={theme.text.primary} />
              <View>
                <AppText variant="bodyMd" weight="700">
                  Split Configuration
                </AppText>
                <AppText variant="caption" color="secondary">
                  Reconfigure workout templates & rotation
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.text.tertiary} />
          </Pressable>

          <Divider style={{ marginVertical: 8 }} />

          <Pressable
            style={({ pressed }) => [
              styles.menuRow,
              pressed && { backgroundColor: theme.background.elevated },
            ]}
            onPress={() => router.push('/showcase')}
          >
            <View style={styles.menuLeft}>
              <Shield size={18} color={theme.accent.primary} />
              <View>
                <AppText variant="bodyMd" weight="700" color="accent">
                  UI Design Tokens Showcase
                </AppText>
                <AppText variant="caption" color="secondary">
                  Interactive design system audit
                </AppText>
              </View>
            </View>
            <ChevronRight size={18} color={theme.accent.primary} />
          </Pressable>
        </Card>
      </View>

      {/* 5. OFFLINE GUARANTEE BANNER */}
      <View
        style={[
          styles.offlineBanner,
          {
            backgroundColor: theme.background.secondary,
            borderColor: theme.border.subtle,
            borderRadius: radius.md,
          },
        ]}
      >
        <ShieldCheck size={18} color={theme.accent.primary} />
        <AppText variant="caption" color="secondary" style={{ flex: 1, lineHeight: 18 }}>
          All training logs and PR benchmarks are committed to on-device SQLite storage first.
          Full tracking remains 100% functional without an internet connection.
        </AppText>
      </View>

      {/* 6. SIGN OUT BUTTON */}
      <View style={styles.authSection}>
        {isAuthenticated ? (
          <AppButton
            title="SIGN OUT"
            onPress={() => setShowSignOutDialog(true)}
            variant="destructive"
            size="md"
            leftIcon={<LogOut size={18} color="#FFFFFF" />}
          />
        ) : (
          <AppButton
            title="SIGN IN / CLOUD SYNC"
            onPress={() => router.push('/auth/sign-in')}
            variant="primary"
            size="md"
            leftIcon={<LogIn size={18} color="#0B0D0F" />}
          />
        )}
      </View>

      {/* 7. FOOTNOTE TELEMETRY */}
      <View style={styles.footnote}>
        <AppText variant="caption" color="tertiary" weight="800">
          REPSHADE ENGINE v1.2.4 (BUILD 88)
        </AppText>
        <AppText variant="caption" color="tertiary">
          ZERO TRACKERS • ZERO ADS • GYM-READY
        </AppText>
      </View>

      {/* SIGN OUT CONFIRM DIALOG */}
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

      {/* AVATAR PICKER MODAL (12 PRESETS - CACHED VIA EXPO-IMAGE) */}
      <AvatarPickerModal
        visible={showAvatarPicker}
        currentPhotoUrl={user?.photoURL}
        onClose={() => setShowAvatarPicker(false)}
        onSelectAvatar={async (url) => {
          await updateProfilePhoto(url);
        }}
      />
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
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  identityCard: {
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 12,
  },
  cloudCard: {
    marginHorizontal: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  cloudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  monogramAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0B0D0F',
  },
  changeAvatarBtn: {
    marginTop: 4,
  },
  identityDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  contextCard: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
  },
  contextTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  groupHeader: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  groupCard: {
    padding: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginHorizontal: 20,
    padding: 14,
    borderWidth: 1,
    marginBottom: 24,
  },
  authSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  footnote: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 4,
  },
});
