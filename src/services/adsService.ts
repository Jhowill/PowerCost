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

export const initializeAds = async () => {
  if (!nativeAdsAvailable) return;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      default: () => { initialize: () => Promise<unknown> };
      AdsConsent: { gatherConsent: () => Promise<{ canRequestAds: boolean }> };
    };
    const consent = await ads.AdsConsent.gatherConsent();
    if (consent.canRequestAds) await ads.default().initialize();
  } catch {
    // Falhas de consentimento ou anúncios nunca bloqueiam o app.
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) {
    await pause(700);
    return true;
  }
  if (fullscreenAdShowing) return false;

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
      let timeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(timeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
        fullscreenAdShowing = true;
        void ad.show();
      }));
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => { earned = true; }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(earned)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      timeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return false;
  }
};

export const showInterstitialAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable || fullscreenAdShowing) return false;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      InterstitialAd: { createForAdRequest: (id: string) => FullscreenAd };
      AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
      TestIds: { INTERSTITIAL: string };
    };
    const ad = ads.InterstitialAd.createForAdRequest(getAdUnitId('interstitial', ads.TestIds.INTERSTITIAL));
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      let timeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(timeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.AdEventType.LOADED, () => {
        fullscreenAdShowing = true;
        void ad.show();
      }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      timeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return false;
  }
};

export const showAppOpenAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable || fullscreenAdShowing || Date.now() - lastAppOpenShownAt < 2 * 60_000) return false;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      AppOpenAd: { createForAdRequest: (id: string) => FullscreenAd };
      AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
      TestIds: { APP_OPEN: string };
    };
    const ad = ads.AppOpenAd.createForAdRequest(getAdUnitId('appOpen', ads.TestIds.APP_OPEN));
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      let timeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(timeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.AdEventType.LOADED, () => {
        fullscreenAdShowing = true;
        lastAppOpenShownAt = Date.now();
        void ad.show();
      }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      timeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    fullscreenAdShowing = false;
    return false;
  }
};
