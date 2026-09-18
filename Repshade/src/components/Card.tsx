import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'highlighted' | 'interactive';
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export function Card({
  children,
  variant = 'default',
  onPress,
  style,
  padding = 16,
}: CardProps) {
  const { theme, radius } = useAppTheme();

  const getCardStyle = (pressed?: boolean): ViewStyle => {
    let backgroundColor: string = theme.background.secondary;
    let borderColor: string = theme.border.subtle;
    const borderWidth = 1;

    switch (variant) {
      case 'elevated':
        backgroundColor = theme.background.elevated;
        break;
      case 'highlighted':
        borderColor = theme.accent.primary;
        break;
      case 'interactive':
        if (pressed) {
          backgroundColor = theme.background.elevated;
          borderColor = theme.border.default;
        }
        break;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius: radius.md,
      padding,
    };
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [getCardStyle(pressed), style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
}
