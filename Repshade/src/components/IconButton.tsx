import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  size?: number; // Visual box size, default 44
  variant?: 'default' | 'filled' | 'tinted' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  size = 44,
  variant = 'default',
  disabled = false,
  style,
}: IconButtonProps) {
  const { theme, radius } = useAppTheme();

  const getStyle = (pressed: boolean): ViewStyle => {
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';

    switch (variant) {
      case 'default':
        backgroundColor = pressed ? theme.background.elevated : theme.background.secondary;
        borderColor = theme.border.subtle;
        break;
      case 'filled':
        backgroundColor = pressed ? theme.background.elevated : theme.background.tertiary;
        break;
      case 'tinted':
        backgroundColor = pressed ? theme.accent.primaryPressed : theme.accent.primarySoft;
        break;
      case 'ghost':
        backgroundColor = pressed ? theme.background.secondary : 'transparent';
        break;
    }

    return {
      width: Math.max(44, size),
      height: Math.max(44, size),
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor,
      borderColor,
      borderWidth: variant === 'default' ? 1 : 0,
      opacity: disabled ? 0.4 : 1,
    };
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [getStyle(pressed), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
    >
      {icon}
    </Pressable>
  );
}
