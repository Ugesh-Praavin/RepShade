import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  style?: ViewStyle;
}

export function StatCard({
  label,
  value,
  unit,
  subtitle,
  icon,
  trend,
  trendPositive,
  style,
}: StatCardProps) {
  const { theme, radius } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background.secondary,
          borderColor: theme.border.subtle,
          borderRadius: radius.md,
        },
        style,
      ]}
    >
      <View style={styles.top}>
        <Text style={[styles.label, { color: theme.text.tertiary }]}>{label}</Text>
        {icon && <View>{icon}</View>}
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: theme.text.primary }]}>{value}</Text>
        {unit && <Text style={[styles.unit, { color: theme.text.secondary }]}>{unit}</Text>}
      </View>

      {(subtitle || trend) && (
        <View style={styles.footer}>
          {trend && (
            <Text
              style={[
                styles.trend,
                { color: trendPositive ? theme.status.success : theme.status.error },
              ]}
            >
              {trend}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>{subtitle}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
  },
  unit: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trend: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
  },
});
