import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

import { getAdUnitId } from '../config/ads';

declare const require: (moduleName: string) => Record<string, unknown>;

type FullscreenAd = {
  addAdEventListener: (event: string, callback: () => void) => () => void;
  load: () => void;
  show: () => Promise<void>;
};

export const nativeAdsAvailable =
  Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let fullscreenAdShowing = false;
let lastAppOpenShownAt = 0;
let adsReady = false;

export const initializeAds = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) return true;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      default: () => { initialize: () => Promise<unknown> };
      AdsConsent: { gatherConsent: () => Promise<{ canRequestAds: boolean }> };
    };
    const consent = await ads.AdsConsent.gatherConsent();
    if (!consent.canRequestAds) return false;
    await ads.default().initialize();
    adsReady = true;
    return true;
  } catch {
    // Falhas de consentimento ou anúncios nunca bloqueiam o app.
    return false;
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) {
    await pause(700);
    return true;
  }
  if (!adsReady || fullscreenAdShowing) return false;

  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      RewardedAd: { createForAdRequest: (id: string) => FullscreenAd };
      RewardedAdEventType: { LOADED: string; EARNED_REWARD: string };
      AdEventType: { ERROR: string; CLOSED: string };
      TestIds: { REWARDED: string };
    };
    const ad = ads.RewardedAd.createForAdRequest(getAdUnitId('rewarded', ads.TestIds.REWARDED));
    return await new Promise<boolean>((resolve) => {
      let earned = false;
      let settled = false;
      let loadTimeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(loadTimeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
        clearTimeout(loadTimeout);
        fullscreenAdShowing = true;
        void ad.show().catch(() => finish(false));
      }));
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => { earned = true; }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(earned)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      loadTimeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return false;
  }
};

export const showInterstitialAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable || !adsReady || fullscreenAdShowing) return false;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      InterstitialAd: { createForAdRequest: (id: string) => FullscreenAd };
      AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
      TestIds: { INTERSTITIAL: string };
    };
    const ad = ads.InterstitialAd.createForAdRequest(getAdUnitId('interstitial', ads.TestIds.INTERSTITIAL));
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      let loadTimeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(loadTimeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.AdEventType.LOADED, () => {
        clearTimeout(loadTimeout);
        fullscreenAdShowing = true;
        void ad.show().catch(() => finish(false));
      }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      loadTimeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return false;
  }
};

export const showAppOpenAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable || !adsReady || fullscreenAdShowing || Date.now() - lastAppOpenShownAt < 10 * 60_000) return false;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      AppOpenAd: { createForAdRequest: (id: string) => FullscreenAd };
      AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
      TestIds: { APP_OPEN: string };
    };
    const ad = ads.AppOpenAd.createForAdRequest(getAdUnitId('appOpen', ads.TestIds.APP_OPEN));
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      let loadTimeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(loadTimeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.AdEventType.LOADED, () => {
        clearTimeout(loadTimeout);
        fullscreenAdShowing = true;
        lastAppOpenShownAt = Date.now();
        void ad.show().catch(() => finish(false));
      }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      loadTimeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return false;
  }
};

export const showAdsPrivacyOptions = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) return false;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      AdsConsent: { showPrivacyOptionsForm: () => Promise<{ canRequestAds: boolean }> };
    };
    const consent = await ads.AdsConsent.showPrivacyOptionsForm();
    adsReady = consent.canRequestAds;
    return true;
  } catch {
    return false;
  }
};
