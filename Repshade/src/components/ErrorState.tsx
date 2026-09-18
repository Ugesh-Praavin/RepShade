import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { AppButton } from './AppButton';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: ViewStyle;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  style,
}: ErrorStateProps) {
  const { theme, radius } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background.secondary,
          borderColor: theme.status.error,
          borderRadius: radius.md,
        },
        style,
      ]}
    >
      <AlertTriangle size={24} color={theme.status.error} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>
      </View>
      {onRetry && (
        <AppButton
          title={retryLabel}
          onPress={onRetry}
          variant="secondary"
          size="sm"
          style={styles.retryBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 4,
  },
});
