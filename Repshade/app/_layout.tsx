import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDatabase } from '@/database/client';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore error if splash screen was already prevented
});

import { useAuthStore } from '@/stores/authStore';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';

  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;
    async function init() {
      try {
        await getDatabase();
        unsubscribeAuth = useAuthStore.getState().initializeAuth();
      } catch (err) {
        console.error('Failed to initialize local database or auth:', err);
      } finally {
        await SplashScreen.hideAsync().catch(() => {});
      }
    }
    init();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0B0D0F',
      card: '#121519',
      text: '#F5F7F8',
      border: '#242A2F',
      primary: '#B8F34A',
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F8F9FA',
      card: '#FFFFFF',
      text: '#111418',
      border: '#E5E7EB',
      primary: '#B8F34A',
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={isDark ? customDarkTheme : customLightTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: isDark ? '#0B0D0F' : '#F8F9FA' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="workout" options={{ headerShown: false }} />
          <Stack.Screen name="exercise" options={{ headerShown: false }} />
          <Stack.Screen name="progress" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="showcase" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
