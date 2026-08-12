import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, useColorScheme } from 'react-native';

import { translate } from '../i18n/translations';
import { initializeAds, showAdsPrivacyOptions, showAppOpenAd, showInterstitialAd, showRewardedAd } from '../services/adsService';
import { palettes } from '../theme';
import {
  AdsState,
  AppSettings,
  AppTheme,
  CalculationDraft,
  CurrencyCode,
  RewardedFeature,
  SavedSimulation,
  SupportedLocale,
} from '../types';
import { APP_LIMITS, calculateEnergyCost, isActiveUntil } from '../utils/calculation';

const STORAGE = {
  settings: '@powercost/app_settings',
  history: '@powercost/history',
  ads: '@powercost/ads_state',
} as const;

const CURRENCY_BY_LOCALE: Record<SupportedLocale, CurrencyCode> = {
  'pt-BR': 'BRL', 'en-US': 'USD', 'es-ES': 'EUR', 'fr-FR': 'EUR',
};

const detectLocale = (): SupportedLocale => {
  const language = getLocales()[0]?.languageCode;
  if (language === 'en') return 'en-US';
  if (language === 'es') return 'es-ES';
  if (language === 'fr') return 'fr-FR';
  return 'pt-BR';
};

const now = () => new Date().toISOString();

const initialLocale = detectLocale();
const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: 1,
  locale: initialLocale,
  theme: 'system',
  currency: CURRENCY_BY_LOCALE[initialLocale],
  defaultTariffPerKwh: 0.9,
  hasSeenFirstResult: false,
};

const DEFAULT_ADS: AdsState = {
  schemaVersion: 1,
  tipsUnlockedSimulationIds: [],
  completedCalculationsSinceLastInterstitial: 0,
};

const emptyDraft = (tariff = 0.9): CalculationDraft => ({
  applianceId: '',
  applianceName: '',
  powerWatts: 0,
  hoursPerDay: 1,
  daysPerMonth: 30,
  tariffPerKwh: tariff,
});

type SaveResult = 'saved' | 'limit' | 'none';

type AppContextValue = {
  hydrated: boolean;
  settings: AppSettings;
  ads: AdsState;
  history: SavedSimulation[];
  draft: CalculationDraft;
  currentSimulation: SavedSimulation | null;
  resolvedTheme: 'light' | 'dark';
  colors: (typeof palettes)['light'] | (typeof palettes)['dark'];
  t: (key: string, params?: Record<string, string | number>) => string;
  setDraft: React.Dispatch<React.SetStateAction<CalculationDraft>>;
  resetCalculation: () => void;
  completeCalculation: (input: CalculationDraft) => SavedSimulation;
  setCurrentSimulation: (simulation: SavedSimulation) => void;
  recalculate: (simulation: SavedSimulation) => void;
  saveCurrent: () => SaveResult;
  deleteSimulation: (id: string) => void;
  clearHistory: () => void;
  clearAllLocalData: () => Promise<void>;
  isCurrentSaved: boolean;
  setLocale: (locale: SupportedLocale) => void;
  setTheme: (theme: AppTheme) => void;
  setDefaultTariff: (value: number) => void;
  unlockFeature: (feature: RewardedFeature) => Promise<boolean>;
  openAdsPrivacyOptions: () => Promise<boolean>;
  maybeShowInterstitial: () => Promise<void>;
  canShowBanner: boolean;
  adFreeActive: boolean;
  expandedComparisonActive: boolean;
  extraHistoryActive: boolean;
  whatIfActive: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const normalizeSettings = (raw: string | null): AppSettings => {
  const value = safeParse<Partial<AppSettings>>(raw, {});
  const locale = ['pt-BR', 'en-US', 'es-ES', 'fr-FR'].includes(value.locale ?? '') ? value.locale as SupportedLocale : DEFAULT_SETTINGS.locale;
  const theme = ['system', 'light', 'dark'].includes(value.theme ?? '') ? value.theme as AppTheme : DEFAULT_SETTINGS.theme;
  const currency = ['BRL', 'USD', 'EUR'].includes(value.currency ?? '') ? value.currency as CurrencyCode : CURRENCY_BY_LOCALE[locale];
  return {
    ...DEFAULT_SETTINGS,
    ...value,
    schemaVersion: 1,
    locale,
    theme,
    currency,
    defaultTariffPerKwh: typeof value.defaultTariffPerKwh === 'number' && value.defaultTariffPerKwh > 0 ? value.defaultTariffPerKwh : DEFAULT_SETTINGS.defaultTariffPerKwh,
    hasSeenFirstResult: Boolean(value.hasSeenFirstResult),
  };
};

const normalizeAds = (raw: string | null): AdsState => {
  const value = safeParse<Partial<AdsState>>(raw, {});
  return {
    ...DEFAULT_ADS,
    ...value,
    schemaVersion: 1,
    tipsUnlockedSimulationIds: Array.isArray(value.tipsUnlockedSimulationIds)
      ? value.tipsUnlockedSimulationIds.filter((id): id is string => typeof id === 'string')
      : [],
    completedCalculationsSinceLastInterstitial: typeof value.completedCalculationsSinceLastInterstitial === 'number'
      ? Math.max(0, value.completedCalculationsSinceLastInterstitial)
      : 0,
  };
};

const isSavedSimulation = (value: unknown): value is SavedSimulation => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SavedSimulation>;
  if (typeof item.id !== 'string' || typeof item.createdAt !== 'string' || Number.isNaN(Date.parse(item.createdAt))) return false;
  if (!item.input || typeof item.input !== 'object' || !item.result || typeof item.result !== 'object') return false;
  return typeof item.input.applianceName === 'string'
    && typeof item.input.powerWatts === 'number'
    && typeof item.input.hoursPerDay === 'number'
    && typeof item.input.daysPerMonth === 'number'
    && typeof item.input.tariffPerKwh === 'number'
    && typeof item.result.costPerMonth === 'number'
    && typeof item.result.consumptionKwhMonth === 'number';
};

const normalizeHistory = (raw: string | null): SavedSimulation[] => {
  const value = safeParse<unknown>(raw, []);
  return Array.isArray(value) ? value.filter(isSavedSimulation) : [];
};

export function AppProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme();
  const [hydrated, setHydrated] = useState(false);
  const [adsInitialized, setAdsInitialized] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ads, setAds] = useState<AdsState>(DEFAULT_ADS);
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [draft, setDraft] = useState<CalculationDraft>(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
  const [currentSimulation, setCurrentSimulation] = useState<SavedSimulation | null>(null);

  useEffect(() => {
    void initializeAds().then(setAdsInitialized);
    void Promise.all([
      AsyncStorage.getItem(STORAGE.settings),
      AsyncStorage.getItem(STORAGE.history),
      AsyncStorage.getItem(STORAGE.ads),
    ]).then(([settingsRaw, historyRaw, adsRaw]) => {
      const loadedSettings = normalizeSettings(settingsRaw);
      setSettings(loadedSettings);
      setHistory(normalizeHistory(historyRaw));
      setAds(normalizeAds(adsRaw));
      setDraft(emptyDraft(loadedSettings.defaultTariffPerKwh ?? 0.9));
    }).catch(() => {
      setSettings(DEFAULT_SETTINGS);
      setHistory([]);
      setAds(DEFAULT_ADS);
      setDraft(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
    }).finally(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated || !adsInitialized) return;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && settings.hasSeenFirstResult && !isActiveUntil(ads.adFreeUntil)) {
        void showAppOpenAd();
      }
    });
    return () => subscription.remove();
  }, [ads.adFreeUntil, adsInitialized, hydrated, settings.hasSeenFirstResult]);

  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.settings, JSON.stringify(settings)).catch(() => undefined);
  }, [hydrated, settings]);
  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.history, JSON.stringify(history)).catch(() => undefined);
  }, [hydrated, history]);
  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.ads, JSON.stringify(ads)).catch(() => undefined);
  }, [ads, hydrated]);

  const resolvedTheme = settings.theme === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : settings.theme;
  const colors = palettes[resolvedTheme];
  const t = (key: string, params?: Record<string, string | number>) => translate(settings.locale, key, params);

  const resetCalculation = () => {
    setCurrentSimulation(null);
    setDraft(emptyDraft(settings.defaultTariffPerKwh ?? 0.9));
  };

  const completeCalculation = (input: CalculationDraft) => {
    const simulation: SavedSimulation = {
      id: `sim_${Date.now()}`,
      input: { ...input },
      result: calculateEnergyCost(input),
      createdAt: now(),
    };
    setCurrentSimulation(simulation);
    setSettings((value) => ({ ...value, hasSeenFirstResult: true }));
    setAds((value) => ({
      ...value,
      completedCalculationsSinceLastInterstitial: value.completedCalculationsSinceLastInterstitial + 1,
    }));
    return simulation;
  };

  const recalculate = (simulation: SavedSimulation) => {
    setCurrentSimulation(null);
    setDraft({ ...simulation.input });
  };

  const extraHistoryActive = isActiveUntil(ads.extraHistorySlotsUntil);
  const saveCurrent = (): SaveResult => {
    if (!currentSimulation) return 'none';
    if (history.some((item) => item.id === currentSimulation.id)) return 'saved';
    const limit = extraHistoryActive ? APP_LIMITS.rewardedHistory : APP_LIMITS.freeHistory;
    if (history.length >= limit) return 'limit';
    setHistory((items) => [currentSimulation, ...items]);
    return 'saved';
  };

  const deleteSimulation = (id: string) => setHistory((items) => items.filter((item) => item.id !== id));
  const clearHistory = () => setHistory([]);
  const clearAllLocalData = async () => {
    await AsyncStorage.multiRemove(Object.values(STORAGE));
    setSettings(DEFAULT_SETTINGS);
    setAds(DEFAULT_ADS);
    setHistory([]);
    setCurrentSimulation(null);
    setDraft(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
  };

  const setLocale = (locale: SupportedLocale) => {
    setSettings((value) => ({ ...value, locale, currency: CURRENCY_BY_LOCALE[locale] }));
  };
  const setTheme = (theme: AppTheme) => setSettings((value) => ({ ...value, theme }));
  const setDefaultTariff = (defaultTariffPerKwh: number) => {
    setSettings((value) => ({ ...value, defaultTariffPerKwh }));
    setDraft((value) => ({ ...value, tariffPerKwh: defaultTariffPerKwh }));
  };

  const unlockFeature = async (feature: RewardedFeature) => {
    if (feature === 'energy_tips' && !currentSimulation) return false;
    const success = await showRewardedAd();
    if (!success) return false;
    const fromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();
    setAds((value) => {
      if (feature === 'ad_free') return { ...value, adFreeUntil: fromNow(30) };
      if (feature === 'expanded_comparison') return { ...value, expandedComparisonUntil: fromNow(24 * 60) };
      if (feature === 'extra_history_slots') return { ...value, extraHistorySlotsUntil: fromNow(24 * 60) };
      if (feature === 'what_if') return { ...value, whatIfUnlockedUntil: fromNow(30) };
      if (feature === 'energy_tips' && currentSimulation) {
        return { ...value, tipsUnlockedSimulationIds: [...new Set([...value.tipsUnlockedSimulationIds, currentSimulation.id])] };
      }
      return value;
    });
    return true;
  };

  const adFreeActive = isActiveUntil(ads.adFreeUntil);
  const openAdsPrivacyOptions = async () => {
    const result = await showAdsPrivacyOptions();
    setAdsInitialized(result.adsReady);
    return result.opened;
  };
  const maybeShowInterstitial = async () => {
    if (!settings.hasSeenFirstResult || adFreeActive || ads.completedCalculationsSinceLastInterstitial < 1) return;
    if (ads.lastInterstitialShownAt) {
      const minutes = (Date.now() - new Date(ads.lastInterstitialShownAt).getTime()) / 60_000;
      if (minutes < 2) return;
    }
    if (await showInterstitialAd()) {
      setAds((value) => ({ ...value, lastInterstitialShownAt: now(), completedCalculationsSinceLastInterstitial: 0 }));
    }
  };

  const value = useMemo<AppContextValue>(() => ({
    hydrated,
    settings,
    ads,
    history,
    draft,
    currentSimulation,
    resolvedTheme,
    colors,
    t,
    setDraft,
    resetCalculation,
    completeCalculation,
    setCurrentSimulation,
    recalculate,
    saveCurrent,
    deleteSimulation,
    clearHistory,
    clearAllLocalData,
    isCurrentSaved: Boolean(currentSimulation && history.some((item) => item.id === currentSimulation.id)),
    setLocale,
    setTheme,
    setDefaultTariff,
    unlockFeature,
    openAdsPrivacyOptions,
    maybeShowInterstitial,
    canShowBanner: adsInitialized && settings.hasSeenFirstResult && !adFreeActive,
    adFreeActive,
    expandedComparisonActive: isActiveUntil(ads.expandedComparisonUntil),
    extraHistoryActive,
    whatIfActive: isActiveUntil(ads.whatIfUnlockedUntil),
  // Functions are intentionally regenerated with the current localized state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [hydrated, adsInitialized, settings, ads, history, draft, currentSimulation, resolvedTheme, colors, adFreeActive, extraHistoryActive]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
};
