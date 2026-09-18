import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Chip({
  label,
  selected = false,
  onPress,
  style,
  textStyle,
  icon,
}: ChipProps) {
  const { theme, radius } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected
            ? theme.accent.primarySoft
            : pressed
            ? theme.background.elevated
            : theme.background.secondary,
          borderColor: selected ? theme.accent.primary : theme.border.subtle,
          borderRadius: radius.full,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {icon}
      <Text
        style={[
          styles.text,
          {
            color: selected ? theme.accent.primary : theme.text.secondary,
            fontWeight: selected ? '700' : '500',
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontSize: 13,
  },
});
