import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Network from 'expo-network';
import { AppState, Platform } from 'react-native';

import { getAdUnitId } from '../config/ads';
import { recordAdEvent } from './adDiagnostics';

declare const require: (moduleName: string) => Record<string, unknown>;

type FullscreenAd = {
  addAdEventListener: (event: string, callback: (error?: unknown) => void) => () => void;
  load: () => void;
  show: () => Promise<void>;
};

export const nativeAdsAvailable =
  Platform.OS !== 'web' && Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

let fullscreenAdShowing = false;
let adsReady = false;
let initializationPromise: Promise<boolean> | null = null;
let consentBlocked = false;
let nextRetryAt = 0;
let failures = 0;
const readyListeners = new Set<(ready: boolean) => void>();
export const subscribeAdsReady = (listener: (ready: boolean) => void) => {
  readyListeners.add(listener);
  listener(adsReady);
  return () => { readyListeners.delete(listener); };
};
const setAdsReady = (ready: boolean) => {
  adsReady = ready;
  readyListeners.forEach((listener) => listener(ready));
};
export const retryAdsInitialization = async () => {
  if (fullscreenAdShowing || AppState.currentState !== 'active') return false;
  return initializeAds();
};

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
  failures = 0;
  nextRetryAt = 0;
  setAdsReady(true);
  recordAdEvent('init-ready');
};

export const initializeAds = async (): Promise<boolean> => {
  if (!nativeAdsAvailable) { setAdsReady(true); return true; }
  if (adsReady) return true;
  if (consentBlocked || Date.now() < nextRetryAt || AppState.currentState !== 'active') return false;
  if (!(await hasInternetConnection())) return false;
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        const ads = require('react-native-google-mobile-ads') as unknown as MobileAdsModule;
        const consent = await ads.AdsConsent.gatherConsent();
        if (!consent.canRequestAds) {
          consentBlocked = true;
          recordAdEvent('consent-blocked');
          return false;
        }
        await startMobileAds(ads);
        return true;
      } catch (error) {
        nextRetryAt = Date.now() + Math.min(300_000, 30_000 * 2 ** Math.min(failures++, 4));
        recordAdEvent('init-error', error);
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
  openCache?.dispose(); openCache = null;
  openLoadingDispose?.(); openLoadingDispose = null;
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
    const fail = (error?: unknown) => {
      recordAdEvent('interstitial-error', error);
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
      recordAdEvent('interstitial-loaded');
    }));
    cleanups.push(ad.addAdEventListener(sdk.AdEventType.ERROR, fail));
    timer = setTimeout(fail, 15_000);
    try { ad.load(); } catch { fail(); }
  } catch { recordAdEvent('interstitial-error'); interstitialLoading = false; }
};

export const showRewardedAd = async (onEarned: () => void = () => {}, signal?: AbortSignal): Promise<RewardedAdResult> => {
  if (signal?.aborted || !nativeAdsAvailable || fullscreenAdShowing || AppState.currentState !== 'active') return 'unavailable';
  fullscreenAdShowing = true;
  let cancelled = false;
  const pending = AppState.addEventListener('change', (state) => { if (state !== 'active') cancelled = true; });
  const connected = await bounded(hasInternetConnection(), 5_000);
  const ready = connected && (adsReady || await bounded(initializeAds(), 15_000));
  pending.remove();
  if (!connected) { fullscreenAdShowing = false; return 'offline'; }
  if (!ready || cancelled || signal?.aborted || AppState.currentState !== 'active') {
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
      const fail = (error?: unknown) => { recordAdEvent('reward-error', error); finish(); };
      cleanups.push(() => lifecycle.remove());
      const cancel = () => {
        // Once presented, keep listening until closure so earned rewards are never lost.
        if (!presenting) { recordAdEvent('reward-cancelled'); finish(); }
      };
      signal?.addEventListener('abort', cancel);
      cleanups.push(() => signal?.removeEventListener('abort', cancel));
      cleanups.push(ad.addAdEventListener(sdk.RewardedAdEventType.LOADED, () => {
        if (settled) return;
        if (signal?.aborted || AppState.currentState !== 'active' || !adsReady) { finish(); return; }
        clearTimeout(timer);
        presenting = true;
        // No presentation timeout: only native closure/error may release this lock.
        try { void ad.show().catch(fail); } catch { fail(); }
      }));
      cleanups.push(ad.addAdEventListener(sdk.RewardedAdEventType.EARNED_REWARD, () => {
        if (earned || settled) return;
        earned = true;
        recordAdEvent('reward-earned');
        onEarned();
      }));
      cleanups.push(ad.addAdEventListener(sdk.AdEventType.CLOSED, finish));
      cleanups.push(ad.addAdEventListener(sdk.AdEventType.ERROR, fail));
      timer = setTimeout(fail, 15_000);
      try { ad.load(); } catch { fail(); }
    });
  } catch { recordAdEvent('reward-error'); fullscreenAdShowing = false; return 'unavailable'; }
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
        if (!shown) recordAdEvent('interstitial-error');
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
  } catch { recordAdEvent('interstitial-error'); fullscreenAdShowing = false; return false; }
};

let openCache: { ad: FullscreenAd; loadedAt: number; dispose: () => void } | null = null;
let openLoadingDispose: (() => void) | null = null;
let lastOpenAt = 0;
export const beginAppOpenBackground = () =>
  !fullscreenAdShowing && !initializationPromise && adsReady ? Date.now() : null;

export const preloadAppOpenAd = () => {
  if (!nativeAdsAvailable || !adsReady || openCache || openLoadingDispose) return;
  try {
    const sdk = require('react-native-google-mobile-ads') as unknown as {
      AppOpenAd: { createForAdRequest: (id: string) => FullscreenAd };
      AdEventType: { LOADED: string; ERROR: string }; TestIds: { APP_OPEN: string };
    };
    const ad = sdk.AppOpenAd.createForAdRequest(getAdUnitId('appOpen', sdk.TestIds.APP_OPEN));
    const cleanups: (() => void)[] = [];
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const dispose = () => { disposed = true; clearTimeout(timer); cleanups.splice(0).forEach((fn) => fn()); };
    const fail = (error?: unknown) => {
      recordAdEvent('open-error', error); dispose();
      if (openLoadingDispose === dispose) openLoadingDispose = null;
      if (openCache?.ad === ad) openCache = null;
    };
    openLoadingDispose = dispose;
    cleanups.push(ad.addAdEventListener(sdk.AdEventType.LOADED, () => {
      if (disposed || !adsReady) { fail(); return; }
      clearTimeout(timer); openLoadingDispose = null;
      openCache = { ad, loadedAt: Date.now(), dispose }; recordAdEvent('open-loaded');
    }));
    cleanups.push(ad.addAdEventListener(sdk.AdEventType.ERROR, fail));
    timer = setTimeout(fail, 15_000);
    try { ad.load(); } catch (error) { fail(error); }
  } catch (error) { recordAdEvent('open-error', error); openLoadingDispose?.(); openLoadingDispose = null; }
};

// Called synchronously on a genuine foreground transition, never from a load callback.
export const showAppOpenAd = async (backgroundAt?: number | null): Promise<boolean> => {
  const elapsed = backgroundAt == null ? 0 : Date.now() - backgroundAt;
  if (elapsed < 60_000 || !nativeAdsAvailable || !adsReady || fullscreenAdShowing || initializationPromise || AppState.currentState !== 'active' || Date.now() - lastOpenAt < 600_000) return false;
  const cached = openCache;
  if (!cached || Date.now() - cached.loadedAt >= 4 * 60 * 60_000) {
    cached?.dispose(); openCache = null; preloadAppOpenAd(); return false;
  }
  openCache = null; cached.dispose(); fullscreenAdShowing = true;
  lastOpenAt = Date.now();
  try {
    const sdk = require('react-native-google-mobile-ads') as unknown as { AdEventType: { CLOSED: string; ERROR: string } };
    return await new Promise<boolean>((resolve) => {
      let settled = false;
      const cleanups: (() => void)[] = [];
      const finish = (shown: boolean) => {
        if (settled) return; settled = true;
        cleanups.forEach((fn) => fn()); fullscreenAdShowing = false;
        resolve(shown); preloadAppOpenAd();
      };
      const fail = (error?: unknown) => { recordAdEvent('open-error', error); finish(false); };
      cleanups.push(cached.ad.addAdEventListener(sdk.AdEventType.CLOSED, () => finish(true)));
      cleanups.push(cached.ad.addAdEventListener(sdk.AdEventType.ERROR, fail));
      try { void cached.ad.show().catch(fail); } catch (error) { fail(error); }
    });
  } catch (error) { recordAdEvent('open-error', error); fullscreenAdShowing = false; return false; }
};

export const showAdsPrivacyOptions = async (): Promise<{ opened: boolean; adsReady: boolean }> => {
  if (!nativeAdsAvailable || fullscreenAdShowing || initializationPromise || AppState.currentState !== 'active') return { opened: false, adsReady };
  fullscreenAdShowing = true;
  cancelPreloadedAds();
  try {
    const ads = require('react-native-google-mobile-ads') as unknown as MobileAdsModule;
    const consent = await ads.AdsConsent.showPrivacyOptionsForm();
    consentBlocked = !consent.canRequestAds;
    if (consent.canRequestAds) await startMobileAds(ads);
    else { setAdsReady(false); cancelPreloadedAds(); }
    return { opened: true, adsReady };
  } catch {
    return { opened: false, adsReady };
  } finally {
    fullscreenAdShowing = false;
  }
};
