import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AppButton } from './AppButton';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onAction,
  style,
}: EmptyStateProps) {
  const { theme, radius } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background.secondary,
          borderColor: theme.border.subtle,
          borderRadius: radius.lg,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
      {description && (
        <Text style={[styles.description, { color: theme.text.secondary }]}>
          {description}
        </Text>
      )}
      {actionTitle && onAction && (
        <AppButton
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          size="sm"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: 20,
    minWidth: 140,
  },
});
