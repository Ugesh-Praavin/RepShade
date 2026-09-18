import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  Input,
  ErrorState,
  Card,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/stores/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleReset = async () => {
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return;
    }

    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      // Handled by authStore
    }
  };

  return (
    <Screen scrollable edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <ScreenHeader title="Reset Password" showBack />

      <View style={styles.content}>
        {sent ? (
          <Card variant="default" style={styles.successCard}>
            <CheckCircle2 size={48} color={theme.status.success} />
            <AppText variant="h3" weight="700">
              Reset Link Sent
            </AppText>
            <AppText variant="bodyMd" color="secondary" align="center">
              We've sent password reset instructions to{' '}
              <AppText variant="bodyMd" weight="700" color="primary">
                {email}
              </AppText>
              . Please check your inbox.
            </AppText>
            <AppButton
              title="BACK TO SIGN IN"
              onPress={() => router.push('/auth/sign-in')}
              variant="primary"
              size="md"
              style={{ marginTop: 12, width: '100%' }}
            />
          </Card>
        ) : (
          <>
            <View style={styles.header}>
              <AppText variant="h2" weight="800">
                Forgot Password?
              </AppText>
              <AppText variant="bodyMd" color="secondary">
                Enter the email associated with your account and we'll send you a password reset link.
              </AppText>
            </View>

            {(error || localError) && (
              <ErrorState message={error || localError || ''} style={styles.errorBox} />
            )}

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

            <AppButton
              title="SEND RESET LINK"
              onPress={handleReset}
              loading={isLoading}
              variant="primary"
              size="lg"
              style={styles.submitBtn}
            />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 4,
    gap: 16,
  },
  header: {
    gap: 6,
    marginBottom: 8,
  },
  errorBox: {
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 8,
  },
  successCard: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
    marginTop: 20,
  },
});
