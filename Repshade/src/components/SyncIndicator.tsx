import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CloudCheck, CloudOff, RefreshCw } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'pending';

export interface SyncIndicatorProps {
  status: SyncState;
  pendingCount?: number;
}

export function SyncIndicator({ status, pendingCount = 0 }: SyncIndicatorProps) {
  const { theme } = useAppTheme();

  const getDetails = () => {
    switch (status) {
      case 'synced':
        return {
          icon: <CloudCheck size={14} color={theme.status.success} />,
          text: 'Synced',
          color: theme.status.success,
        };
      case 'syncing':
        return {
          icon: <ActivityIndicator size="small" color={theme.accent.primary} />,
          text: 'Syncing...',
          color: theme.accent.primary,
        };
      case 'pending':
        return {
          icon: <RefreshCw size={14} color={theme.status.warning} />,
          text: `${pendingCount} pending`,
          color: theme.status.warning,
        };
      case 'offline':
        return {
          icon: <CloudOff size={14} color={theme.text.tertiary} />,
          text: 'Offline',
          color: theme.text.tertiary,
        };
    }
  };

  const details = getDetails();

  return (
    <View style={styles.container}>
      {details.icon}
      <Text style={[styles.text, { color: details.color }]}>{details.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
