import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { splitRepository } from '@/repositories/splitRepository';
import { exerciseRepository } from '@/repositories/exerciseRepository';
import { SYSTEM_EXERCISES } from '@/constants/defaultExercises';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuthStore();
  const [checkingSplit, setCheckingSplit] = useState(true);

  useEffect(() => {
    async function determineRoute() {
      if (isInitializing) return;

      try {
        await exerciseRepository.seedSystemExercises(SYSTEM_EXERCISES);
        const split = await splitRepository.getActiveSplit('local_user');
        if (!split) {
          // New user -> Onboarding Screen first!
          router.replace('/onboarding');
        } else if (!isAuthenticated) {
          // Completed onboarding -> Sign In / Sign Up!
          router.replace('/auth/sign-in');
        } else {
          // Authenticated -> Home Page!
          router.replace('/(tabs)');
        }
      } catch (e) {
        router.replace('/onboarding');
      } finally {
        setCheckingSplit(false);
      }
    }

    determineRoute();
  }, [isInitializing, isAuthenticated]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#B8F34A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0D0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
