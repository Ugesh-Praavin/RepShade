import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface OfflineBannerProps {
  isOffline?: boolean;
  message?: string;
}

export function OfflineBanner({
  isOffline = true,
  message = 'Offline mode — All logs save locally to SQLite',
}: OfflineBannerProps) {
  const { theme } = useAppTheme();

  if (!isOffline) return null;

  return (
    <View style={[styles.banner, { backgroundColor: theme.background.elevated, borderColor: theme.border.subtle }]}>
      <WifiOff size={14} color={theme.status.warning} />
      <Text style={[styles.text, { color: theme.text.secondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
