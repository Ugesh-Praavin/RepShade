import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Play,
  Flame,
  Dumbbell,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  IconButton,
  TextButton,
  Card,
  SectionHeader,
  Divider,
  Chip,
  Input,
  NumericInput,
  BottomSheet,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  OfflineBanner,
  SyncIndicator,
  StatCard,
  ProgressBar,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ShowcaseScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const [chipSelected, setChipSelected] = useState('chest');
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(8);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <ScreenHeader
        title="UI Design System Audit"
        subtitle="Repshade Core UI Components"
        showBack
      />

      <OfflineBanner />

      <View style={styles.section}>
        <SectionHeader title="Typography Hierarchy" />
        <AppText variant="h1">Heading 1 (28px)</AppText>
        <AppText variant="h2">Heading 2 (22px)</AppText>
        <AppText variant="h3">Heading 3 (18px)</AppText>
        <AppText variant="bodyLg">Body Large — Clean and readable</AppText>
        <AppText variant="bodyMd" color="secondary">
          Body Medium — Secondary information
        </AppText>
        <AppText variant="label" color="accent">
          Label / Tag — Accent Highlight
        </AppText>
        <AppText variant="statNumber" color="accent">
          14,250 <AppText variant="bodySm" color="secondary">KG</AppText>
        </AppText>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Button Variants (Touch target ≥ 44pt)" />
        <View style={styles.buttonStack}>
          <AppButton
            title="Primary Button (CTA)"
            onPress={() => {}}
            leftIcon={<Play size={18} color="#0B0D0F" fill="#0B0D0F" />}
          />
          <AppButton
            title="Secondary Button"
            variant="secondary"
            onPress={() => {}}
            leftIcon={<Dumbbell size={18} color={theme.text.primary} />}
          />
          <AppButton
            title="Destructive Button"
            variant="destructive"
            onPress={() => setDialogVisible(true)}
          />
          <AppButton
            title="Ghost Button"
            variant="ghost"
            onPress={() => setSheetVisible(true)}
          />
          <View style={styles.row}>
            <IconButton
              icon={<Flame size={20} color={theme.accent.primary} />}
              onPress={() => {}}
              accessibilityLabel="Streak"
              variant="tinted"
            />
            <IconButton
              icon={<Sparkles size={20} color={theme.text.primary} />}
              onPress={() => {}}
              accessibilityLabel="PRs"
              variant="default"
            />
            <TextButton title="Text Action" onPress={() => {}} />
          </View>
        </View>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Numeric Workout Inputs" />
        <View style={styles.row}>
          <NumericInput
            label="Weight (kg)"
            value={weight}
            onChange={setWeight}
            step={2.5}
            unit="kg"
            style={{ flex: 1 }}
          />
          <NumericInput
            label="Reps"
            value={reps}
            onChange={setReps}
            step={1}
            unit="reps"
            style={{ flex: 1 }}
          />
        </View>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Form Inputs" />
        <Input
          label="Workout Name"
          placeholder="e.g. Chest & Triceps"
          value={inputText}
          onChangeText={setInputText}
          leftIcon={<Dumbbell size={18} color={theme.text.tertiary} />}
        />
        <Input
          label="Email with Error State"
          placeholder="athlete@example.com"
          value="invalid-email"
          error="Please enter a valid email address"
        />
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Chips / Filter System" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {['chest', 'back', 'shoulders', 'legs', 'arms', 'core'].map((item) => (
            <Chip
              key={item}
              label={item.toUpperCase()}
              selected={chipSelected === item}
              onPress={() => setChipSelected(item)}
            />
          ))}
        </ScrollView>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Stat Cards & Progress Bars" />
        <View style={styles.row}>
          <StatCard
            label="WEEKLY VOLUME"
            value="18,400"
            unit="kg"
            trend="+12% vs last week"
            trendPositive
            icon={<TrendingUp size={16} color={theme.accent.primary} />}
          />
          <StatCard
            label="PERSONAL RECORDS"
            value="6"
            subtitle="All-time high"
            icon={<Award size={16} color={theme.accent.primary} />}
          />
        </View>
        <View style={{ marginTop: 16, gap: 6 }}>
          <AppText variant="caption" color="tertiary">WORKOUT PROGRESS (65%)</AppText>
          <ProgressBar progress={0.65} height={8} />
        </View>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Sync & Connectivity Indicators" />
        <View style={styles.syncRow}>
          <SyncIndicator status="synced" />
          <SyncIndicator status="syncing" />
          <SyncIndicator status="pending" pendingCount={3} />
          <SyncIndicator status="offline" />
        </View>
      </View>

      <Divider />

      <View style={styles.section}>
        <SectionHeader title="Empty & Error States" />
        <EmptyState
          icon={<Calendar size={32} color={theme.text.tertiary} />}
          title="No History Found"
          description="Log your first workout to start building your streak."
          actionTitle="Start Workout"
          onAction={() => router.push('/workout/active')}
          style={{ marginBottom: 16 }}
        />
        <ErrorState
          title="Sync Connection Error"
          message="Could not connect to Firebase. Local changes will sync when online."
          onRetry={() => {}}
        />
      </View>

      {/* Modals */}
      <ConfirmDialog
        visible={dialogVisible}
        title="Discard Workout?"
        message="Are you sure you want to discard this workout? All unsaved sets will be lost."
        destructive
        confirmLabel="Discard"
        cancelLabel="Keep Training"
        onConfirm={() => setDialogVisible(false)}
        onCancel={() => setDialogVisible(false)}
      />

      <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
        <View style={{ paddingVertical: 12, gap: 16 }}>
          <AppText variant="h3">Quick Settings</AppText>
          <AppText variant="bodyMd" color="secondary">
            This bottom sheet is reusable for exercise substitution, workout notes, and set options.
          </AppText>
          <AppButton title="Close Sheet" onPress={() => setSheetVisible(false)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginVertical: 4,
  },
  buttonStack: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  chipRow: {
    gap: 8,
    paddingVertical: 4,
  },
  syncRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 8,
  },
});
