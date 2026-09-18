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
} from 'lucide-react-native';

import {
  Screen,
  AppText,
  Card,
  Divider,
  AppButton,
  ConfirmDialog,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/authStore';
import { useSplitStore } from '@/stores/splitStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { activeSplit, nextWorkout } = useSplitStore();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const handleSignOut = async () => {
    setShowSignOutDialog(false);
    await signOut();
  };

  const displayName = user?.displayName || (isAuthenticated ? 'Athlete' : 'UGESH PRAAVIN D');
  const userEmail = user?.email || 'ugesh.praavin@training.local';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

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
          <View
            style={[
              styles.monogramAvatar,
              { backgroundColor: theme.accent.primarySoft, borderColor: theme.accent.primary },
            ]}
          >
            <AppText variant="h2" weight="900" color="accent">
              {initials}
            </AppText>
          </View>

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
            <AppText variant="caption" color="tertiary" weight="700" style={{ marginTop: 2 }}>
              ATHLETE #0482 • ON-DEVICE VAULT ACTIVE
            </AppText>
          </View>
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
    marginBottom: 16,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  monogramAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
