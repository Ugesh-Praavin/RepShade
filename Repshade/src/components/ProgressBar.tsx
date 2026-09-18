import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ProgressBarProps {
  progress: number; // 0 to 1 (or 0 to 100)
  height?: number;
  color?: string;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  height = 6,
  color,
  style,
}: ProgressBarProps) {
  const { theme, radius } = useAppTheme();

  // Normalize progress to 0-1
  const normalized = progress > 1 ? Math.min(1, Math.max(0, progress / 100)) : Math.min(1, Math.max(0, progress));
  const percentage = `${normalized * 100}%`;

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: theme.background.tertiary,
          borderRadius: radius.full,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: percentage as any,
            height,
            backgroundColor: color || theme.accent.primary,
            borderRadius: radius.full,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
