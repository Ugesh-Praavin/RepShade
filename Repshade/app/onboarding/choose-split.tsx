import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Layers, ArrowRight, Check, Dumbbell, Sparkles } from 'lucide-react-native';

import { Screen, ScreenHeader, AppText, AppButton, Card } from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { PREDEFINED_SPLITS } from '@/constants/predefinedSplits';

export default function ChooseSplitScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { selectedSplitType, selectSplitType } = useOnboardingStore();

  const splitOptions = [
    {
      type: 'ppl' as const,
      title: 'Push / Pull / Legs (PPL)',
      subtitle: '3-day cycle: Push A → Pull A → Legs A',
      badge: 'MOST POPULAR',
      workoutsCount: '3 Workouts',
    },
    {
      type: 'upper_lower' as const,
      title: 'Upper / Lower',
      subtitle: '2-day cycle: Upper Body → Lower Body',
      badge: 'OPTIMAL FREQUENCY',
      workoutsCount: '2 Workouts',
    },
    {
      type: 'full_body' as const,
      title: 'Full Body Routine',
      subtitle: 'Compound power: Full Body A → Full Body B',
      badge: 'TIME EFFICIENT',
      workoutsCount: '2 Workouts',
    },
    {
      type: 'custom' as const,
      title: 'Custom Split',
      subtitle: 'Design your own workout sequence from scratch',
      badge: 'CUSTOMIZABLE',
      workoutsCount: 'Your choice',
    },
  ];

  const handleContinue = () => {
    router.push('/onboarding/configure-workouts');
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <ScreenHeader title="Choose Your Split" showBack />

      <View style={styles.header}>
        <AppText variant="h2" weight="800">
          How do you like to train?
        </AppText>
        <AppText variant="bodyMd" color="secondary">
          Select a template. You can customize, reorder, or add exercises next.
        </AppText>
      </View>

      <View style={styles.list}>
        {splitOptions.map((opt) => {
          const isSelected = selectedSplitType === opt.type;
          return (
            <Pressable
              key={opt.type}
              style={({ pressed }) => [
                styles.splitCard,
                {
                  backgroundColor: isSelected
                    ? theme.background.elevated
                    : pressed
                    ? theme.background.elevated
                    : theme.background.secondary,
                  borderColor: isSelected ? theme.accent.primary : theme.border.subtle,
                  borderRadius: radius.lg,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => selectSplitType(opt.type)}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isSelected
                        ? theme.accent.primarySoft
                        : theme.background.tertiary,
                    },
                  ]}
                >
                  <AppText
                    variant="caption"
                    color={isSelected ? 'accent' : 'secondary'}
                    weight="700"
                  >
                    {opt.badge}
                  </AppText>
                </View>

                {isSelected ? (
                  <View
                    style={[styles.checkCircle, { backgroundColor: theme.accent.primary }]}
                  >
                    <Check size={14} color="#0B0D0F" />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.emptyCircle,
                      { borderColor: theme.border.default },
                    ]}
                  />
                )}
              </View>

              <AppText variant="h3" weight="800" style={styles.title}>
                {opt.title}
              </AppText>
              <AppText variant="bodySm" color="secondary">
                {opt.subtitle}
              </AppText>

              <View style={[styles.cardFooter, { borderTopColor: theme.border.subtle }]}>
                <View style={styles.metaRow}>
                  <Dumbbell size={14} color={theme.accent.primary} />
                  <AppText variant="caption" color="secondary">
                    {opt.workoutsCount}
                  </AppText>
                </View>
                <AppText variant="caption" color="accent" weight="700">
                  ROLLING SEQUENCE
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footerAction}>
        <AppButton
          title="CONFIGURE WORKOUTS"
          onPress={handleContinue}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} color="#0B0D0F" />}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
    gap: 4,
  },
  list: {
    paddingHorizontal: 16,
    gap: 14,
  },
  splitCard: {
    padding: 18,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  title: {
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerAction: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
});
