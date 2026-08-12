import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

declare const require: (moduleName: string) => Record<string, unknown>;

export const nativeAdsAvailable =
  Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const initializeAds = async () => {
  if (!nativeAdsAvailable) return;
  try {
    const ads = require('react-native-google-mobile-ads') as { default: () => { initialize: () => Promise<unknown> } };
    await ads.default().initialize();
  } catch {
    // A falha de anúncios nunca bloqueia o app.
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) {
    await pause(700);
    return true;
  }

  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      RewardedAd: { createForAdRequest: (id: string) => { addAdEventListener: (event: string, callback: () => void) => () => void; load: () => void; show: () => Promise<void> } };
      RewardedAdEventType: { LOADED: string; EARNED_REWARD: string };
      AdEventType: { ERROR: string; CLOSED: string };
      TestIds: { REWARDED: string };
    };
    const ad = ads.RewardedAd.createForAdRequest(ads.TestIds.REWARDED);
    return await new Promise<boolean>((resolve) => {
      let earned = false;
      let settled = false;
      let timeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.LOADED, () => void ad.show()));
      cleanups.push(ad.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => { earned = true; }));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(earned)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      timeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    return false;
  }
};

export const showInterstitialAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) return false;
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as {
      InterstitialAd: { createForAdRequest: (id: string) => { addAdEventListener: (event: string, callback: () => void) => () => void; load: () => void; show: () => Promise<void> } };
      AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
      TestIds: { INTERSTITIAL: string };
    };
    const ad = ads.InterstitialAd.createForAdRequest(ads.TestIds.INTERSTITIAL);
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      let timeout: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = (value: boolean) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        cleanups.forEach((cleanup) => cleanup());
        resolve(value);
      };
      cleanups.push(ad.addAdEventListener(ads.AdEventType.LOADED, () => void ad.show()));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(ad.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));
      timeout = setTimeout(() => finish(false), 15_000);
      ad.load();
    });
  } catch {
    return false;
  }
};
