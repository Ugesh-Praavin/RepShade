import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}: AppButtonProps) {
  const { theme, radius } = useAppTheme();

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const minHeight = size === 'sm' ? 44 : size === 'lg' ? 56 : 48;
    const paddingHorizontal = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

    let backgroundColor: string = theme.accent.primary;
    let borderColor: string | undefined;
    let borderWidth: number | undefined;

    switch (variant) {
      case 'primary':
        backgroundColor = pressed ? theme.accent.primaryPressed : theme.accent.primary;
        break;
      case 'secondary':
        backgroundColor = pressed ? theme.background.elevated : theme.background.secondary;
        borderColor = theme.border.default;
        borderWidth = 1;
        break;
      case 'destructive':
        backgroundColor = pressed ? '#D32F2F' : theme.status.error;
        break;
      case 'ghost':
        backgroundColor = pressed ? theme.background.tertiary : 'transparent';
        break;
    }

    if (disabled) {
      backgroundColor = variant === 'ghost' ? 'transparent' : theme.background.tertiary;
      borderColor = variant === 'secondary' ? theme.border.subtle : undefined;
    }

    return {
      minHeight,
      paddingHorizontal,
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius: radius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      opacity: disabled && !loading ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    let color: string = '#0B0D0F';

    switch (variant) {
      case 'primary':
        color = theme.accent.primaryText;
        break;
      case 'secondary':
      case 'ghost':
        color = theme.text.primary;
        break;
      case 'destructive':
        color = '#FFFFFF';
        break;
    }

    if (disabled) {
      color = theme.text.disabled;
    }

    return {
      color,
      fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
      fontWeight: '800',
      letterSpacing: 0.5,
    };
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.accent.primaryText : theme.text.primary}
        />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}
