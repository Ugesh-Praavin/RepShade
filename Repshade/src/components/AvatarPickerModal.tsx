import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Check, X, Trash2 } from 'lucide-react-native';

import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { BottomSheet } from './BottomSheet';
import { useAppTheme } from '@/hooks/useAppTheme';
import { MALE_AVATARS, FEMALE_AVATARS } from '@/constants/avatars';

export interface AvatarPickerModalProps {
  visible: boolean;
  currentPhotoUrl?: string | null;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string | null) => void;
}

export function AvatarPickerModal({
  visible,
  currentPhotoUrl,
  onClose,
  onSelectAvatar,
}: AvatarPickerModalProps) {
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'male' | 'female'>('male');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(currentPhotoUrl || null);

  const displayedAvatars = activeTab === 'male' ? MALE_AVATARS : FEMALE_AVATARS;

  const handleSave = () => {
    onSelectAvatar(selectedUrl);
    onClose();
  };

  const handleClear = () => {
    setSelectedUrl(null);
    onSelectAvatar(null);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <AppText variant="h2" weight="900">
              PROFILE AVATAR
            </AppText>
            <AppText variant="caption" color="secondary" style={{ marginTop: 2 }}>
              Select an athletic avatar. Cached permanently on device.
            </AppText>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={[styles.closeBtn, { backgroundColor: theme.background.elevated }]}
          >
            <X size={18} color={theme.text.secondary} />
          </Pressable>
        </View>

        {/* Gender Category Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === 'male' ? theme.accent.primary : theme.background.elevated,
                borderColor:
                  activeTab === 'male' ? theme.accent.primary : theme.border.subtle,
              },
            ]}
            onPress={() => setActiveTab('male')}
          >
            <AppText
              variant="label"
              weight="800"
              color={activeTab === 'male' ? 'inverse' : 'secondary'}
            >
              MALE (6)
            </AppText>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === 'female' ? theme.accent.primary : theme.background.elevated,
                borderColor:
                  activeTab === 'female' ? theme.accent.primary : theme.border.subtle,
              },
            ]}
            onPress={() => setActiveTab('female')}
          >
            <AppText
              variant="label"
              weight="800"
              color={activeTab === 'female' ? 'inverse' : 'secondary'}
            >
              FEMALE (6)
            </AppText>
          </Pressable>
        </View>

        {/* 6 Avatar Grid */}
        <View style={styles.grid}>
          {displayedAvatars.map((item) => {
            const isSelected = selectedUrl === item.url;
            return (
              <Pressable
                key={item.id}
                onPress={() => setSelectedUrl(item.url)}
                style={[
                  styles.avatarWrapper,
                  {
                    borderColor: isSelected ? theme.accent.primary : theme.border.subtle,
                    backgroundColor: theme.background.elevated,
                  },
                  isSelected && styles.avatarSelected,
                ]}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="memory-disk"
                />
                {isSelected && (
                  <View
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: theme.accent.primary },
                    ]}
                  >
                    <Check size={12} color="#0B0D0F" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <AppButton
            title="SET PROFILE PHOTO"
            onPress={handleSave}
            variant="primary"
            size="md"
            style={{ flex: 1 }}
          />

          {currentPhotoUrl && (
            <Pressable
              onPress={handleClear}
              style={[
                styles.removeBtn,
                {
                  borderColor: theme.border.subtle,
                  backgroundColor: theme.background.elevated,
                },
              ]}
            >
              <Trash2 size={16} color={theme.status.error} />
            </Pressable>
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 4,
  },
  avatarWrapper: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarSelected: {
    borderWidth: 2.5,
    transform: [{ scale: 1.04 }],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  removeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
