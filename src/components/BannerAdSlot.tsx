import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { nativeAdsAvailable } from '../services/adsService';

declare const require: (moduleName: string) => Record<string, unknown>;

export function BannerAdSlot() {
  const { canShowBanner, colors, t } = useApp();
  if (!canShowBanner) return null;

  if (nativeAdsAvailable) {
    try {
      const ads = require('react-native-google-mobile-ads') as unknown as {
        BannerAd: React.ComponentType<{ unitId: string; size: string }>;
        BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: string };
        TestIds: { BANNER: string };
      };
      return (
        <View style={styles.nativeWrap}>
          <ads.BannerAd unitId={ads.TestIds.BANNER} size={ads.BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
        </View>
      );
    } catch {
      return null;
    }
  }

  return (
    <View accessibilityLabel={t('ads.preview')} style={[styles.preview, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
      <Text style={[styles.previewText, { color: colors.textMuted }]}>{t('ads.preview')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nativeWrap: { minHeight: 60, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  preview: { height: 58, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  previewText: { fontSize: 12 },
});
