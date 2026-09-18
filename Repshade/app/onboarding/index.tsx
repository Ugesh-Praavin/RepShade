import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, ArrowRight, ShieldCheck, Flame, CalendarOff } from 'lucide-react-native';

import { Screen, AppText, AppButton, Card } from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <View
          style={[
            styles.logoBox,
            { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle },
          ]}
        >
          <Dumbbell size={40} color={theme.accent.primary} />
        </View>
        <AppText variant="h1" weight="900" style={styles.appName}>
          REPSHADE
        </AppText>
        <AppText variant="label" color="accent" style={styles.tagline}>
          TRAIN. LOG. PROGRESS. REPEAT.
        </AppText>
      </View>

      {/* Core Philosophy Highlights */}
      <View style={styles.featureList}>
        <Card variant="default" style={styles.featCard}>
          <View style={[styles.iconWrap, { backgroundColor: theme.accent.primarySoft }]}>
            <CalendarOff size={22} color={theme.accent.primary} />
          </View>
          <View style={styles.featText}>
            <AppText variant="bodyMd" weight="700">
              The Rolling Split Rule
            </AppText>
            <AppText variant="bodySm" color="secondary">
              The calendar tells you when you trained. Your split tells you what you train next.
            </AppText>
          </View>
        </Card>

        <Card variant="default" style={styles.featCard}>
          <View style={[styles.iconWrap, { backgroundColor: theme.background.tertiary }]}>
            <ShieldCheck size={22} color={theme.text.primary} />
          </View>
          <View style={styles.featText}>
            <AppText variant="bodyMd" weight="700">
              100% Offline-First
            </AppText>
            <AppText variant="bodySm" color="secondary">
              Log sets in dead gym zones without internet lags or cloud dependency.
            </AppText>
          </View>
        </Card>

        <Card variant="default" style={styles.featCard}>
          <View style={[styles.iconWrap, { backgroundColor: theme.background.tertiary }]}>
            <Flame size={22} color={theme.status.warning} />
          </View>
          <View style={styles.featText}>
            <AppText variant="bodyMd" weight="700">
              Progressive Overload
            </AppText>
            <AppText variant="bodySm" color="secondary">
              Instant previous performance targets and automated PR celebrations.
            </AppText>
          </View>
        </Card>
      </View>

      {/* Action CTA */}
      <View style={styles.actionContainer}>
        <AppButton
          title="CHOOSE YOUR SPLIT"
          onPress={() => router.push('/onboarding/choose-split')}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} color="#0B0D0F" />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  top: {
    alignItems: 'center',
    paddingTop: 16,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    letterSpacing: 1.5,
  },
  featureList: {
    gap: 12,
    marginVertical: 20,
  },
  featCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featText: {
    flex: 1,
    gap: 2,
  },
  actionContainer: {
    paddingBottom: 16,
  },
});
