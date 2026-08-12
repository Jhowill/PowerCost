const pause = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const nativeAdsAvailable = false;

export const initializeAds = async () => undefined;

export const showRewardedAd = async (): Promise<boolean> => {
  await pause(700);
  return true;
};

export const showInterstitialAd = async (): Promise<boolean> => false;

export const showAppOpenAd = async (): Promise<boolean> => false;
