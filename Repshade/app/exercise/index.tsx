import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Dumbbell, ChevronRight } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  Chip,
  Input,
  IconButton,
  EmptyState,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useExerciseStore } from '@/stores/exerciseStore';
import { ExerciseRow } from '@/repositories/exerciseRepository';

const MUSCLE_GROUPS = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Quadriceps',
  'Hamstrings',
  'Biceps',
  'Triceps',
  'Core',
  'Calves',
];

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const {
    filteredExercises,
    searchQuery,
    selectedMuscle,
    isLoading,
    initializeLibrary,
    setSearchQuery,
    setSelectedMuscle,
  } = useExerciseStore();

  useEffect(() => {
    initializeLibrary();
  }, []);

  const renderExerciseItem = ({ item }: { item: ExerciseRow }) => (
    <Pressable
      style={({ pressed }) => [
        styles.exerciseCard,
        {
          backgroundColor: pressed ? theme.background.elevated : theme.background.secondary,
          borderColor: theme.border.subtle,
          borderRadius: radius.md,
        },
      ]}
      onPress={() => router.push(`/exercise/${item.id}` as any)}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconBox, { backgroundColor: theme.background.tertiary }]}>
          <Dumbbell size={18} color={theme.accent.primary} />
        </View>
        <View style={styles.cardInfo}>
          <AppText variant="bodyMd" weight="700">
            {item.name}
          </AppText>
          <View style={styles.tagRow}>
            <AppText variant="caption" color="accent" weight="600">
              {item.primary_muscle.toUpperCase()}
            </AppText>
            {item.equipment && (
              <>
                <AppText variant="caption" color="tertiary">•</AppText>
                <AppText variant="caption" color="secondary">
                  {item.equipment}
                </AppText>
              </>
            )}
            {item.is_custom === 1 && (
              <>
                <AppText variant="caption" color="tertiary">•</AppText>
                <AppText variant="caption" color="info" weight="700">
                  CUSTOM
                </AppText>
              </>
            )}
          </View>
        </View>
      </View>
      <ChevronRight size={18} color={theme.text.tertiary} />
    </Pressable>
  );

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenHeader
        title="Exercise Library"
        subtitle={`${filteredExercises.length} movements available offline`}
        showBack
        rightAction={
          <IconButton
            icon={<Plus size={20} color={theme.accent.primary} />}
            onPress={() => router.push('/exercise/create' as any)}
            accessibilityLabel="Create custom exercise"
            variant="ghost"
          />
        }
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by exercise or muscle..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={theme.text.tertiary} />}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {/* Muscle Group Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {MUSCLE_GROUPS.map((muscle) => {
            const isSelected =
              muscle === 'All' ? selectedMuscle === null : selectedMuscle === muscle;
            return (
              <Chip
                key={muscle}
                label={muscle}
                selected={isSelected}
                onPress={() => setSelectedMuscle(muscle === 'All' ? null : muscle)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Exercise List */}
      {isLoading && filteredExercises.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.accent.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<Dumbbell size={36} color={theme.text.tertiary} />}
              title="No exercises found"
              description="Try adjusting your search query or filter tags."
              actionTitle="Create Custom Exercise"
              onAction={() => router.push('/exercise/create' as any)}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  filterContainer: {
    paddingVertical: 10,
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    gap: 4,
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
