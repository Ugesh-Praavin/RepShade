import React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface NumericInputProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  style?: ViewStyle;
}

export function NumericInput({
  value,
  onChange,
  label,
  unit,
  step = 1,
  min = 0,
  max = 9999,
  style,
}: NumericInputProps) {
  const { theme, radius } = useAppTheme();

  const handleDecrement = () => {
    const nextVal = Math.max(min, Math.round((value - step) * 10) / 10);
    onChange(nextVal);
  };

  const handleIncrement = () => {
    const nextVal = Math.min(max, Math.round((value + step) * 10) / 10);
    onChange(nextVal);
  };

  const handleTextChange = (text: string) => {
    const parsed = parseFloat(text);
    if (isNaN(parsed)) {
      onChange(0);
    } else {
      onChange(Math.max(min, Math.min(max, parsed)));
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.text.secondary }]}>{label}</Text>
      )}

      <View
        style={[
          styles.box,
          {
            backgroundColor: theme.background.secondary,
            borderColor: theme.border.subtle,
            borderRadius: radius.md,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? theme.background.elevated : theme.background.tertiary,
              borderTopLeftRadius: radius.md,
              borderBottomLeftRadius: radius.md,
            },
          ]}
          onPress={handleDecrement}
          accessibilityLabel={`Decrease ${label || 'value'}`}
          hitSlop={4}
        >
          <Minus size={18} color={theme.text.primary} />
        </Pressable>

        <View style={styles.valueContainer}>
          <TextInput
            value={value.toString()}
            onChangeText={handleTextChange}
            keyboardType="decimal-pad"
            style={[styles.input, { color: theme.text.primary }]}
            selectTextOnFocus
          />
          {unit && <Text style={[styles.unit, { color: theme.text.tertiary }]}>{unit}</Text>}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed ? theme.background.elevated : theme.background.tertiary,
              borderTopRightRadius: radius.md,
              borderBottomRightRadius: radius.md,
            },
          ]}
          onPress={handleIncrement}
          accessibilityLabel={`Increase ${label || 'value'}`}
          hitSlop={4}
        >
          <Plus size={18} color={theme.text.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
  },
  button: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    minWidth: 70,
  },
  input: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    padding: 0,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
});
