import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Network from 'expo-network';
import { AppState, Platform } from 'react-native';

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
let adsReady = false;
let initializationPromise: Promise<boolean> | null = null;

export type RewardedAdResult = 'earned' | 'offline' | 'unavailable';

const bounded = async (operation: Promise<boolean>, milliseconds: number): Promise<boolean> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([operation, new Promise<boolean>((resolve) => { timer = setTimeout(() => resolve(false), milliseconds); })]);
  } catch { return false; }
  finally { if (timer !== undefined) clearTimeout(timer); }
};

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

// Presentation never waits for an interstitial to load. A missed opportunity is skipped.
let cachedInterstitial: { ad: FullscreenAd; loadedAt: number; dispose: () => void } | null = null;
let interstitialLoading = false;
let preloadGeneration = 0;
export const cancelPreloadedAds = () => {
  preloadGeneration += 1;
  cachedInterstitial?.dispose();
  cachedInterstitial = null;
  interstitialLoading = false;
};
export const preloadInterstitialAd = () => {
  if (!nativeAdsAvailable || !adsReady || interstitialLoading || cachedInterstitial) return;
  interstitialLoading = true;
  const generation = preloadGeneration;
  try {
    const sdk = require('react-native-google-mobile-ads') as unknown as {
      InterstitialAd: { createForAdRequest: (id: string) => FullscreenAd };
      AdEventType: { LOADED: string; ERROR: string };
      TestIds: { INTERSTITIAL: string };
    };
    const ad = sdk.InterstitialAd.createForAdRequest(getAdUnitId('interstitial', sdk.TestIds.INTERSTITIAL));
    const cleanups: (() => void)[] = [];
    let timer: ReturnType<typeof setTimeout>;
    const dispose = () => { clearTimeout(timer); cleanups.splice(0).forEach((fn) => fn()); };
    const fail = () => {
      dispose();
      if (generation === preloadGeneration) {
        interstitialLoading = false;
        if (cachedInterstitial?.ad === ad) cachedInterstitial = null;
      }
    };
    cleanups.push(ad.addAdEventListener(sdk.AdEventType.LOADED, () => {
      clearTimeout(timer);
      if (generation !== preloadGeneration) { dispose(); return; }
      interstitialLoading = false;
      cachedInterstitial = { ad, loadedAt: Date.now(), dispose };
    }));
    cleanups.push(ad.addAdEventListener(sdk.AdEventType.ERROR, fail));
    timer = setTimeout(fail, 15_000);
    try { ad.load(); } catch { fail(); }
  } catch { interstitialLoading = false; }
};

export const showRewardedAd = async (onEarned: () => void = () => {}): Promise<RewardedAdResult> => {
  if (!nativeAdsAvailable || fullscreenAdShowing || AppState.currentState !== 'active') return 'unavailable';
  fullscreenAdShowing = true;
  let cancelled = false;
  const pending = AppState.addEventListener('change', (state) => { if (state !== 'active') cancelled = true; });
  const connected = await bounded(hasInternetConnection(), 5_000);
  const ready = connected && (adsReady || await bounded(initializeAds(), 15_000));
  pending.remove();
  if (!connected) { fullscreenAdShowing = false; return 'offline'; }
  if (!ready || cancelled || AppState.currentState !== 'active') {
    fullscreenAdShowing = false; return 'unavailable';
  }
  try {
    const sdk = require('react-native-google-mobile-ads') as unknown as {
      RewardedAd: { createForAdRequest: (id: string) => FullscreenAd };
      RewardedAdEventType: { LOADED: string; EARNED_REWARD: string };
      AdEventType: { ERROR: string; CLOSED: string };
      TestIds: { REWARDED: string };
    };
    const ad = sdk.RewardedAd.createForAdRequest(getAdUnitId('rewarded', sdk.TestIds.REWARDED));
    return await new Promise<RewardedAdResult>((resolve) => {
      let earned = false, settled = false, presenting = false;
      let timer: ReturnType<typeof setTimeout>;
      const cleanups: (() => void)[] = [];
      const finish = () => {
        if (settled) return;
        settled = true;
        fullscreenAdShowing = false;
        clearTimeout(timer);
        cleanups.forEach((fn) => fn());
        resolve(earned ? 'earned' : 'unavailable');
      };
      const lifecycle = AppState.addEventListener('change', (state) => {
        if (!presenting && state !== 'active') finish();
      });
      cleanups.push(() => lifecycle.remove());
      cleanups.push(ad.addAdEventListener(sdk.RewardedAdEventType.LOADED, () => {
        if (settled) return;
        if (AppState.currentState !== 'active' || !adsReady) { finish(); return; }
        clearTimeout(timer);
        presenting = true;
        // No presentation timeout: only native closure/error may release this lock.
        try { void ad.show().catch(finish); } catch { finish(); }
      }));
      cleanups.push(ad.addAdEventListener(sdk.RewardedAdEventType.EARNED_REWARD, () => {
        if (earned || settled) return;
        earned = true;
        onEarned();
      }));
      cleanups.push(ad.addAdEventListener(sdk.AdEventType.CLOSED, finish));
      cleanups.push(ad.addAdEventListener(sdk.AdEventType.ERROR, finish));
      timer = setTimeout(finish, 15_000);
      try { ad.load(); } catch { finish(); }
    });
  } catch { fullscreenAdShowing = false; return 'unavailable'; }
};

export const showInterstitialAd = async (): Promise<boolean> => {
  if (!nativeAdsAvailable || !adsReady || fullscreenAdShowing || AppState.currentState !== 'active') return false;
  const cached = cachedInterstitial;
  if (!cached || Date.now() - cached.loadedAt > 50 * 60_000) {
    cached?.dispose();
    cachedInterstitial = null;
    preloadInterstitialAd();
    return false;
  }
  fullscreenAdShowing = true;
  cachedInterstitial = null;
  cached.dispose();
  try {
    const sdk = require('react-native-google-mobile-ads') as unknown as { AdEventType: { ERROR: string; CLOSED: string } };
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      const cleanups: (() => void)[] = [];
      const finish = (shown: boolean) => {
        if (settled) return;
        settled = true;
        cleanups.forEach((fn) => fn());
        fullscreenAdShowing = false;
        resolve(shown);
        preloadInterstitialAd();
      };
      cleanups.push(cached.ad.addAdEventListener(sdk.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(cached.ad.addAdEventListener(sdk.AdEventType.ERROR, () => finish(false)));
      try { void cached.ad.show().catch(() => finish(false)); } catch { finish(false); }
    });
  } catch { fullscreenAdShowing = false; return false; }
};

// Retained as an explicit disabled API. No delayed ads on foreground transitions.
export const showAppOpenAd = async (): Promise<boolean> => false;

export const showAdsPrivacyOptions = async (): Promise<{ opened: boolean; adsReady: boolean }> => {
  if (!nativeAdsAvailable || fullscreenAdShowing || initializationPromise || AppState.currentState !== 'active') return { opened: false, adsReady };
  fullscreenAdShowing = true;
  cancelPreloadedAds();
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as MobileAdsModule;
    const consent = await ads.AdsConsent.showPrivacyOptionsForm();
    if (consent.canRequestAds) await startMobileAds(ads);
    else { adsReady = false; cancelPreloadedAds(); }
    return { opened: true, adsReady };
  } catch {
    return { opened: false, adsReady };
  } finally {
    fullscreenAdShowing = false;
  }
};
