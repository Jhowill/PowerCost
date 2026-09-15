import type { RewardedAdResult } from './adsService';

export const nativeAdsAvailable = false;

export const initializeAds = async (): Promise<boolean> => true;
export const retryAdsInitialization = initializeAds;
export const subscribeAdsReady = (listener: (ready: boolean) => void) => {
  listener(true);
  return () => {};
};
export const preloadInterstitialAd = () => {};
export const preloadAppOpenAd = () => {};
export const beginAppOpenBackground = (): number | null => null;
export const cancelPreloadedAds = () => {};

export const showRewardedAd = async (): Promise<RewardedAdResult> => 'unavailable';

export const showInterstitialAd = async (): Promise<boolean> => false;

export const showAppOpenAd = async (): Promise<boolean> => false;

export const showAdsPrivacyOptions = async (): Promise<{ opened: boolean; adsReady: boolean }> => ({ opened: false, adsReady: false });
