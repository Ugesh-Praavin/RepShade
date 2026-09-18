import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { TypographyVariant } from '@/constants/theme';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'error' | 'success' | string;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
}

export function AppText({
  variant = 'bodyMd',
  color = 'primary',
  weight,
  align,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme, typography } = useAppTheme();

  const resolveColor = () => {
    switch (color) {
      case 'primary':
        return theme.text.primary;
      case 'secondary':
        return theme.text.secondary;
      case 'tertiary':
        return theme.text.tertiary;
      case 'disabled':
        return theme.text.disabled;
      case 'accent':
        return theme.accent.primary;
      case 'error':
        return theme.status.error;
      case 'success':
        return theme.status.success;
      default:
        return color;
    }
  };

  const textStyle: TextStyle = {
    ...typography[variant],
    color: resolveColor(),
    ...(weight ? { fontWeight: weight } : {}),
    ...(align ? { textAlign: align } : {}),
  };

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
}
