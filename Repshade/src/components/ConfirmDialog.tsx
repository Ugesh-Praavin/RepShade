import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { AppButton } from './AppButton';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} onClose={onCancel}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
        <Text style={[styles.message, { color: theme.text.secondary }]}>{message}</Text>

        <View style={styles.actions}>
          <AppButton
            title={cancelLabel}
            variant="secondary"
            onPress={onCancel}
            style={styles.btn}
            disabled={loading}
          />
          <AppButton
            title={confirmLabel}
            variant={destructive ? 'destructive' : 'primary'}
            onPress={onConfirm}
            style={styles.btn}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
  },
});
