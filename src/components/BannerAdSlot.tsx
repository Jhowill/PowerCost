import React from 'react';
import { router } from 'expo-router';
import { Button } from './ui';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { getAdUnitId } from '../config/ads';
import { nativeAdsAvailable } from '../services/adsService';
import { AdErrorBoundary } from './AdErrorBoundary';

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
        <AdErrorBoundary>
          <View style={styles.nativeWrap}>
            <ads.BannerAd unitId={getAdUnitId('banner', ads.TestIds.BANNER)} size={ads.BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
            <Button label={t('ads.report')} variant="ghost" onPress={() => router.push('/report-ad' as never)} />
          </View>
        </AdErrorBoundary>
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
