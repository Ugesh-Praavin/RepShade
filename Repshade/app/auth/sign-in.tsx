import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Dumbbell, ArrowRight, Lock, Mail } from 'lucide-react-native';

import {
  Screen,
  AppText,
  AppButton,
  Input,
  TextButton,
  ErrorState,
  Divider,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/authStore';

export default function SignInScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const { signIn, isLoading, error, clearError, continueAsGuest } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async () => {
    clearError();
    setLocalError(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both your email and password.');
      return;
    }

    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch {
      // Error handled by authStore
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <Screen scrollable edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={[styles.logoBox, { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle }]}>
          <Dumbbell size={36} color={theme.accent.primary} />
        </View>
        <AppText variant="h1" weight="900" style={styles.appName}>
          REPSHADE
        </AppText>
        <AppText variant="label" color="accent" style={styles.tagline}>
          TRAIN. LOG. PROGRESS. REPEAT.
        </AppText>
      </View>

      {/* Error Message */}
      {(error || localError) && (
        <ErrorState
          message={error || localError || ''}
          style={styles.errorBox}
        />
      )}

      {/* Form Fields */}
      <View style={styles.form}>
        <Input
          label="Email Address"
          placeholder="user@gmail.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (localError) setLocalError(null);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          leftIcon={<Mail size={18} color={theme.text.tertiary} />}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (localError) setLocalError(null);
          }}
          leftIcon={<Lock size={18} color={theme.text.tertiary} />}
        />

        <View style={styles.forgotRow}>
          <TextButton
            title="Forgot Password?"
            onPress={() => router.push('/auth/forgot-password')}
            color="secondary"
          />
        </View>

        <AppButton
          title="SIGN IN"
          onPress={handleSignIn}
          loading={isLoading}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} color="#0B0D0F" />}
          style={styles.submitBtn}
        />

        {/* Offline / Guest Mode */}
        <AppButton
          title="CONTINUE AS GUEST (OFFLINE)"
          onPress={handleContinueAsGuest}
          variant="secondary"
          size="md"
          style={styles.guestBtn}
        />
      </View>

      <Divider style={{ marginVertical: 24 }} />

      {/* Sign Up Link */}
      <View style={styles.footer}>
        <AppText variant="bodyMd" color="secondary">
          {"Don't have an account? "}
        </AppText>
        <TextButton
          title="Sign Up"
          onPress={() => router.push('/auth/sign-up')}
          color="accent"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
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
    letterSpacing: 2,
  },
  errorBox: {
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -6,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 8,
  },
  guestBtn: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
