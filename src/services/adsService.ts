import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Network from 'expo-network';
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

let fullscreenAdShowing = false;
let lastAppOpenShownAt = 0;
let adsReady = false;
let initializationPromise: Promise<boolean> | null = null;

export type RewardedAdResult = 'earned' | 'offline' | 'unavailable';

const hasInternetConnection = async () => {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch {
    return false;
  }
};

type MobileAdsModule = {
  default: () => {
    initialize: () => Promise<unknown>;
    setRequestConfiguration: (configuration: {
      maxAdContentRating: string;
      tagForChildDirectedTreatment: boolean;
    }) => Promise<unknown>;
  };
  AdsConsent: {
    gatherConsent: () => Promise<{ canRequestAds: boolean }>;
    showPrivacyOptionsForm: () => Promise<{ canRequestAds: boolean }>;
  };
};

const startMobileAds = async (ads: MobileAdsModule) => {
  if (!adsReady) {
    const mobileAds = ads.default();
    await mobileAds.setRequestConfiguration({
      maxAdContentRating: 'PG',
      tagForChildDirectedTreatment: false,
    });
    await mobileAds.initialize();
  }
  adsReady = true;
};

export const initializeAds = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) return true;
  if (adsReady) return true;
  if (!(await hasInternetConnection())) return false;
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        const ads = require('react-native-google-mobile-ads') as unknown as MobileAdsModule;
        const consent = await ads.AdsConsent.gatherConsent();
        if (!consent.canRequestAds) return false;
        await startMobileAds(ads);
        return true;
      } catch {
        // Falhas de consentimento ou anúncios nunca bloqueiam o app.
        return false;
      }
    })().finally(() => {
      initializationPromise = null;
    });
  }
  return initializationPromise;
};

export const showRewardedAd = async (): Promise<RewardedAdResult> => {
  if (!nativeAdsAvailable) return 'unavailable';
  if (!(await hasInternetConnection())) return 'offline';
  if (fullscreenAdShowing) return 'unavailable';
  if (!adsReady && !(await initializeAds())) return 'unavailable';
  fullscreenAdShowing = true;

  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      RewardedAd: { createForAdRequest: (id: string) => FullscreenAd };
      RewardedAdEventType: { LOADED: string; EARNED_REWARD: string };
      AdEventType: { ERROR: string; CLOSED: string };
      TestIds: { REWARDED: string };
    };
    const ad = ads.RewardedAd.createForAdRequest(getAdUnitId('rewarded', ads.TestIds.REWARDED));
    return await new Promise<RewardedAdResult>((resolve) => {
      let earned = false;
      let settled = false;
      let loadTimeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: RewardedAdResult) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(loadTimeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
        clearTimeout(loadTimeout);
        loadTimeout = setTimeout(() => finish('unavailable'), 120_000);
        void ad.show().catch(() => finish('unavailable'));
      }));
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => { earned = true; }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => {
        if (!earned) {
          finish('unavailable');
          return;
        }
        void hasInternetConnection()
          .then((online) => finish(online ? 'earned' : 'offline'))
          .catch(() => finish('offline'));
      }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish('unavailable')));
      loadTimeout = setTimeout(() => finish('unavailable'), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return 'unavailable';
  }
};

export const showInterstitialAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable || !adsReady || fullscreenAdShowing) return false;
  if (!(await hasInternetConnection())) return false;
  fullscreenAdShowing = true;
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
        loadTimeout = setTimeout(() => finish(false), 120_000);
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
  if (!(await hasInternetConnection())) return false;
  fullscreenAdShowing = true;
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
        loadTimeout = setTimeout(() => finish(false), 120_000);
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

export const showAdsPrivacyOptions = async (): Promise<{ opened: boolean; adsReady: boolean }> => {
  if (!nativeAdsAvailable) return { opened: false, adsReady };
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as MobileAdsModule;
    const consent = await ads.AdsConsent.showPrivacyOptionsForm();
    if (consent.canRequestAds) await startMobileAds(ads);
    else adsReady = false;
    return { opened: true, adsReady };
  } catch {
    return { opened: false, adsReady };
  }
};
