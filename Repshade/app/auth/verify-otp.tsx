import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, Mail, CheckCircle2 } from 'lucide-react-native';

import {
  Screen,
  ScreenHeader,
  AppText,
  AppButton,
  TextButton,
  ErrorState,
} from '@/components';
import { useAppTheme } from '@/hooks/useAppTheme';
import { otpService } from '@/services/otpService';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { theme, radius } = useAppTheme();
  const params = useLocalSearchParams<{ email?: string; userId?: string }>();
  const email = params.email || '';
  const userId = params.userId || '';

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(60);

  const inputRef = useRef<TextInput>(null);

  // 60-second cooldown timer for resending OTP
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerify = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (code.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await otpService.verifyOtp(email, code, userId);
      if (res.success) {
        setSuccessMessage('Account verified successfully! Redirecting...');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1200);
      } else {
        setErrorMessage(res.error || 'Invalid code. Please check and try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await otpService.sendOtp(email);
      if (res.success) {
        setSuccessMessage('A new verification code has been sent to your email.');
        setCooldown(60);
      } else {
        setErrorMessage(res.error || 'Failed to resend verification code.');
      }
    } catch {
      setErrorMessage('Failed to send verification code. Please check connection.');
    } finally {
      setIsResending(false);
    }
  };

  // Render the 6 OTP digit boxes
  const renderOtpBoxes = () => {
    const digits = code.split('');
    const boxes = [];

    for (let i = 0; i < 6; i++) {
      const digit = digits[i] || '';
      const isFocused = code.length === i;

      boxes.push(
        <Pressable
          key={i}
          onPress={() => inputRef.current?.focus()}
          style={[
            styles.otpBox,
            {
              backgroundColor: theme.background.secondary,
              borderColor: isFocused
                ? theme.accent.primary
                : digit
                ? theme.border.strong
                : theme.border.subtle,
              borderRadius: radius.md,
            },
          ]}
        >
          <AppText variant="h2" weight="900" style={{ color: digit ? theme.accent.primary : theme.text.primary }}>
            {digit}
          </AppText>
        </Pressable>
      );
    }

    return boxes;
  };

  return (
    <Screen scrollable edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <ScreenHeader title="Verify Email" showBack />

      {/* Header Icon & Title */}
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: theme.background.secondary, borderColor: theme.border.subtle }]}>
          <ShieldCheck size={36} color={theme.accent.primary} />
        </View>
        <AppText variant="h1" weight="900" style={styles.title}>
          Check Your Inbox
        </AppText>
        <AppText variant="bodyMd" color="secondary" style={styles.subtitle}>
          We sent a 6-digit verification code to
        </AppText>
        <View style={styles.emailBadge}>
          <Mail size={14} color={theme.accent.primary} style={{ marginRight: 6 }} />
          <AppText variant="caption" weight="700" color="accent">
            {email || 'your email'}
          </AppText>
        </View>
      </View>

      {/* Messages */}
      {errorMessage && (
        <ErrorState message={errorMessage} style={styles.alertBox} />
      )}
      {successMessage && (
        <View style={[styles.successBox, { borderColor: theme.accent.primary, backgroundColor: '#00E67615' }]}>
          <CheckCircle2 size={18} color={theme.accent.primary} style={{ marginRight: 8 }} />
          <AppText variant="bodySm" weight="700" style={{ color: theme.accent.primary, flex: 1 }}>
            {successMessage}
          </AppText>
        </View>
      )}

      {/* Hidden Text Input + Visual Digit Boxes */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(val) => {
            const numeric = val.replace(/[^0-9]/g, '').slice(0, 6);
            setCode(numeric);
            if (errorMessage) setErrorMessage(null);
            if (numeric.length === 6) {
              setErrorMessage(null);
            }
          }}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus
        />
        <View style={styles.boxesRow}>{renderOtpBoxes()}</View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AppButton
          title="Verify & Continue"
          onPress={handleVerify}
          loading={isLoading}
          disabled={code.length !== 6 || isLoading}
          size="lg"
          style={styles.verifyBtn}
        />

        {/* Resend button with cooldown timer */}
        <View style={styles.resendRow}>
          <AppText variant="bodySm" color="secondary">
            {"Didn't receive the code? "}
          </AppText>
          {cooldown > 0 ? (
            <AppText variant="bodySm" weight="700" color="tertiary">
              Resend in {cooldown}s
            </AppText>
          ) : (
            <TextButton
              title={isResending ? 'Sending...' : 'Resend Code'}
              onPress={handleResend}
              disabled={isResending}
            />
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E67610',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  alertBox: {
    marginBottom: 16,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  inputContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
  },
  otpBox: {
    width: 44,
    height: 54,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    marginTop: 20,
    gap: 16,
  },
  verifyBtn: {
    width: '100%',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});
