import React from 'react';
import { Pressable, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface TextButtonProps {
  title: string;
  onPress: () => void;
  color?: 'primary' | 'accent' | 'secondary' | 'error';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function TextButton({
  title,
  onPress,
  color = 'accent',
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: TextButtonProps) {
  const { theme } = useAppTheme();

  const resolveColor = () => {
    if (disabled) return theme.text.disabled;
    switch (color) {
      case 'accent':
        return theme.accent.primary;
      case 'primary':
        return theme.text.primary;
      case 'secondary':
        return theme.text.secondary;
      case 'error':
        return theme.status.error;
      default:
        return theme.accent.primary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { opacity: pressed ? 0.7 : 1 },
        style,
      ]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      <Text style={[styles.text, { color: resolveColor() }, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
