import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, Plus } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  Input,
  Chip,
  SectionHeader,
  Divider,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useExerciseStore } from '@/stores/exerciseStore';

const MUSCLE_CHOICES = [
  'Chest',
  'Back',
  'Shoulders',
  'Quadriceps',
  'Hamstrings',
  'Biceps',
  'Triceps',
  'Core',
  'Calves',
  'Glutes',
];

const EQUIPMENT_CHOICES = [
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight',
  'Smith Machine',
  'Kettlebell',
  'Bands',
];

export default function CreateExerciseScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { createCustomExercise, isLoading } = useExerciseStore();

  const [name, setName] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState('Chest');
  const [equipment, setEquipment] = useState('Barbell');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter an exercise name');
      return;
    }

    try {
      await createCustomExercise({
        userId: 'local_user',
        name: name.trim(),
        primaryMuscle,
        equipment,
      });
      router.back();
    } catch (err: any) {
      setError(err?.message || 'Failed to create exercise');
    }
  };

  return (
    <Screen scrollable edges={['top', 'bottom']}>
      <ScreenHeader title="Create Custom Exercise" showBack />

      <View style={styles.content}>
        {/* Name Input */}
        <Input
          label="Exercise Name"
          placeholder="e.g. Incline Cable Fly"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError(null);
          }}
          error={error || undefined}
          leftIcon={<Dumbbell size={18} color={theme.text.tertiary} />}
        />

        <Divider />

        {/* Primary Muscle Selector */}
        <SectionHeader title="Primary Muscle Target" />
        <View style={styles.chipGrid}>
          {MUSCLE_CHOICES.map((m) => (
            <Chip
              key={m}
              label={m}
              selected={primaryMuscle === m}
              onPress={() => setPrimaryMuscle(m)}
            />
          ))}
        </View>

        <Divider />

        {/* Equipment Selector */}
        <SectionHeader title="Equipment Required" />
        <View style={styles.chipGrid}>
          {EQUIPMENT_CHOICES.map((eq) => (
            <Chip
              key={eq}
              label={eq}
              selected={equipment === eq}
              onPress={() => setEquipment(eq)}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="CREATE EXERCISE"
            onPress={handleSave}
            loading={isLoading}
            variant="primary"
            size="lg"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});
