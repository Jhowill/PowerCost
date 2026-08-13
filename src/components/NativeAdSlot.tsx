import React, { ReactElement, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ViewProps } from 'react-native';

import { getAdUnitId } from '../config/ads';
import { useApp } from '../context/AppContext';
import { nativeAdsAvailable } from '../services/adsService';
import { AdErrorBoundary } from './AdErrorBoundary';

declare const require: (moduleName: string) => Record<string, unknown>;

type NativeAdLike = {
  headline: string;
  body: string;
  callToAction: string;
  advertiser: string | null;
  icon: { url: string } | null;
  destroy: () => void;
};

type NativeAdsModule = {
  NativeAd: { createForAdRequest: (id: string) => Promise<NativeAdLike> };
  NativeAdView: React.ComponentType<ViewProps & { nativeAd: NativeAdLike }>;
  NativeAsset: React.ComponentType<{ assetType: string; children: ReactElement }>;
  NativeMediaView: React.ComponentType<ViewProps & { resizeMode?: 'cover' | 'contain' | 'stretch' }>;
  NativeAssetType: { HEADLINE: string; BODY: string; CALL_TO_ACTION: string; ADVERTISER: string; ICON: string };
  TestIds: { NATIVE: string };
};

export function NativeAdSlot() {
  const { canShowBanner, colors, t } = useApp();
  const [nativeAd, setNativeAd] = useState<NativeAdLike | null>(null);

  useEffect(() => {
    setNativeAd(null);
    if (!canShowBanner || !nativeAdsAvailable) return;
    let mounted = true;
    let loadedAd: NativeAdLike | null = null;
    try {
      const ads = require('react-native-google-mobile-ads') as unknown as NativeAdsModule;
      void ads.NativeAd.createForAdRequest(getAdUnitId('native', ads.TestIds.NATIVE))
        .then((ad) => {
          loadedAd = ad;
          if (mounted) setNativeAd(ad);
          else ad.destroy();
        })
        .catch(() => undefined);
    } catch {
      return;
    }
    return () => {
      mounted = false;
      loadedAd?.destroy();
    };
  }, [canShowBanner]);

  if (!canShowBanner || !nativeAd || !nativeAdsAvailable) return null;

  try {
    const ads = require('react-native-google-mobile-ads') as unknown as NativeAdsModule;
    return (
      <AdErrorBoundary>
        <ads.NativeAdView nativeAd={nativeAd} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sponsorRow}>
            <Text style={[styles.sponsored, { color: colors.textMuted }]}>{t('ads.sponsored')}</Text>
            {nativeAd.advertiser ? (
              <ads.NativeAsset assetType={ads.NativeAssetType.ADVERTISER}>
                <Text numberOfLines={1} style={[styles.advertiser, { color: colors.textMuted }]}>{nativeAd.advertiser}</Text>
              </ads.NativeAsset>
            ) : null}
          </View>
          <View style={styles.heading}>
            {nativeAd.icon ? (
              <ads.NativeAsset assetType={ads.NativeAssetType.ICON}>
                <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
              </ads.NativeAsset>
            ) : null}
            <ads.NativeAsset assetType={ads.NativeAssetType.HEADLINE}>
              <Text numberOfLines={2} style={[styles.headline, { color: colors.text }]}>{nativeAd.headline}</Text>
            </ads.NativeAsset>
          </View>
          <ads.NativeMediaView resizeMode="cover" style={styles.media} />
          <ads.NativeAsset assetType={ads.NativeAssetType.BODY}>
            <Text numberOfLines={3} style={[styles.body, { color: colors.textMuted }]}>{nativeAd.body}</Text>
          </ads.NativeAsset>
          <ads.NativeAsset assetType={ads.NativeAssetType.CALL_TO_ACTION}>
            <View style={[styles.cta, { backgroundColor: colors.primary }]}>
              <Text style={[styles.ctaText, { color: colors.textOnPrimary }]}>{nativeAd.callToAction}</Text>
            </View>
          </ads.NativeAsset>
        </ads.NativeAdView>
      </AdErrorBoundary>
    );
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 6, marginBottom: 16, overflow: 'hidden' },
  sponsorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 },
  sponsored: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  advertiser: { maxWidth: 180, fontSize: 11 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 42, height: 42, borderRadius: 10 },
  headline: { flex: 1, fontSize: 17, lineHeight: 22, fontWeight: '800' },
  media: { width: '100%', height: 160, borderRadius: 12, marginTop: 12, overflow: 'hidden' },
  body: { fontSize: 13, lineHeight: 18, marginTop: 10 },
  cta: { minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12, paddingHorizontal: 14 },
  ctaText: { fontSize: 15, fontWeight: '900' },
});
