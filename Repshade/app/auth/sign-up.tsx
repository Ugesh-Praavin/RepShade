import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, ArrowRight } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  Input,
  TextButton,
  ErrorState,
  Divider,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/authStore';
import { otpService } from '@/services/otpService';

export default function SignUpScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { signUp, signIn, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignUp = async () => {
    clearError();
    setLocalError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setLocalError('Please fill in your email and password.');
      return;
    }

    if (cleanPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      let user;
      try {
        user = await signUp(cleanEmail, cleanPassword, name.trim());
      } catch (err: any) {
        // If account already exists in Firebase Auth (e.g. from previous attempts or unverified registration),
        // log in and seamlessly proceed to OTP verification!
        if (err?.code === 'auth/email-already-in-use') {
          clearError();
          try {
            user = await signIn(cleanEmail, cleanPassword);
          } catch {
            setLocalError('An account with this email already exists with a different password. Please check your password or sign in below.');
            return;
          }
        } else {
          throw err;
        }
      }

      if (user) {
        clearError();
        setLocalError(null);
        // Send 6-digit OTP code to user's email via Gmail SMTP
        await otpService.sendOtp(cleanEmail);
        // Route user to OTP verification screen
        router.push({
          pathname: '/auth/verify-otp' as any,
          params: { email: cleanEmail, userId: user.uid },
        });
      }
    } catch {
      // Handled by authStore or local error
    }
  };

  return (
    <Screen scrollable edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <ScreenHeader title="Create Account" showBack />

      <View style={styles.header}>
        <AppText variant="h2" weight="800">
          Join Repshade
        </AppText>
        <AppText variant="bodyMd" color="secondary">
          Track workouts offline, sync across devices.
        </AppText>
      </View>

      {(error || localError) && (
        <ErrorState message={error || localError || ''} style={styles.errorBox} />
      )}

      <View style={styles.form}>
        <Input
          label="Your Name / Nickname"
          placeholder="e.g. Alex"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={18} color={theme.text.tertiary} />}
        />

        <Input
          label="Email Address"
          placeholder="athlete@example.com"
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
          label="Password (min. 6 characters)"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (localError) setLocalError(null);
          }}
          leftIcon={<Lock size={18} color={theme.text.tertiary} />}
        />

        <AppButton
          title="CREATE ACCOUNT"
          onPress={handleSignUp}
          loading={isLoading}
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight size={18} color="#0B0D0F" />}
          style={styles.submitBtn}
        />
      </View>

      <Divider style={{ marginVertical: 24 }} />

      <View style={styles.footer}>
        <AppText variant="bodyMd" color="secondary">
          Already have an account?{' '}
        </AppText>
        <TextButton
          title="Sign In"
          onPress={() => router.push('/auth/sign-in')}
          color="accent"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 4,
    marginBottom: 24,
    gap: 4,
  },
  errorBox: {
    marginBottom: 16,
  },
  form: {
    gap: 12,
  },
  submitBtn: {
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
