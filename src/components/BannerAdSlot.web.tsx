import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';

export function BannerAdSlot() {
  const { canShowBanner, colors, t } = useApp();
  if (!canShowBanner) return null;

  return (
    <View accessibilityLabel={t('ads.preview')} style={[styles.preview, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
      <Text style={[styles.previewText, { color: colors.textMuted }]}>{t('ads.preview')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  preview: { height: 58, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  previewText: { fontSize: 12 },
});
