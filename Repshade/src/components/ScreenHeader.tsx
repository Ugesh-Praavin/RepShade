import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { IconButton } from './IconButton';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showClose?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  showClose = false,
  onBack,
  rightAction,
  style,
}: ScreenHeaderProps) {
  const router = useRouter();
  const { theme } = useAppTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { borderBottomColor: theme.border.subtle }, style]}>
      <View style={styles.left}>
        {showBack && (
          <IconButton
            icon={<ArrowLeft size={20} color={theme.text.primary} />}
            onPress={handleBack}
            accessibilityLabel="Go back"
            variant="ghost"
          />
        )}
        {showClose && (
          <IconButton
            icon={<X size={20} color={theme.text.primary} />}
            onPress={handleBack}
            accessibilityLabel="Close"
            variant="ghost"
          />
        )}
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: theme.text.primary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.text.secondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.right}>{rightAction}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  left: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  right: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
