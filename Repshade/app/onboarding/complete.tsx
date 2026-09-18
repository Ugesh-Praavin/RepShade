import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, ArrowRight, CheckCircle2, Play, Flame } from 'lucide-react-native';

import { Screen, AppText, AppButton, Card } from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { splitName, workouts } = useOnboardingStore();
  const { continueAsGuest } = useAuthStore();

  const firstWorkout = workouts[0];

  const handleContinueGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.accent.primarySoft, borderColor: theme.accent.primary },
          ]}
        >
          <Trophy size={48} color={theme.accent.primary} />
        </View>

        <AppText variant="h1" weight="900" style={styles.title}>
          Program Ready!
        </AppText>
        <AppText variant="bodyMd" color="secondary" align="center" style={styles.subtitle}>
          Your rolling split is saved to SQLite and ready for your first workout session.
        </AppText>
      </View>

      {/* Up Next Card Preview */}
      <Card variant="highlighted" style={styles.upNextCard}>
        <View style={styles.cardHeader}>
          <AppText variant="label" color="accent">
            UP NEXT IN SPLIT
          </AppText>
          <View style={styles.badge}>
            <Flame size={12} color={theme.accent.primary} />
            <AppText variant="caption" color="accent" weight="700">
              WORKOUT 1/{workouts.length}
            </AppText>
          </View>
        </View>

        <AppText variant="h2" weight="800">
          {firstWorkout?.name || 'Workout 1'}
        </AppText>

        <AppText variant="bodySm" color="secondary">
          {firstWorkout?.exercises?.length || 0} exercises queued
        </AppText>
      </Card>

      <View style={styles.actionContainer}>
        <AppButton
          title="CREATE ACCOUNT / SIGN UP"
          onPress={() => router.replace('/auth/sign-up')}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} color="#0B0D0F" />}
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="SIGN IN TO EXISTING ACCOUNT"
          onPress={() => router.replace('/auth/sign-in')}
          variant="secondary"
          size="md"
          style={{ marginBottom: 10 }}
        />
        <AppButton
          title="CONTINUE AS GUEST ATHLETE"
          onPress={handleContinueGuest}
          variant="ghost"
          size="sm"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  top: {
    alignItems: 'center',
    paddingTop: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    maxWidth: 280,
  },
  upNextCard: {
    padding: 20,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionContainer: {
    gap: 4,
    paddingBottom: 16,
  },
});
