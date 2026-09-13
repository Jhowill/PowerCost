import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import * as Network from 'expo-network';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, useColorScheme } from 'react-native';

import { translate } from '../i18n/translations';
import { initializeAds, RewardedAdResult, showAdsPrivacyOptions, showAppOpenAd, showInterstitialAd, showRewardedAd } from '../services/adsService';
import { palettes } from '../theme';
import {
  AdsState,
  AppSettings,
  AppTheme,
  CalculationDraft,
  CurrencyCode,
  EnergyPlan,
  RewardedFeature,
  SavedSimulation,
  SupportedLocale,
} from '../types';
import { APP_LIMITS, calculateEnergyCost, isActiveUntil } from '../utils/calculation';

const STORAGE = {
  settings: '@powercost/app_settings',
  history: '@powercost/history',
  ads: '@powercost/ads_state',
  plan: '@powercost/energy_plan',
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
};

const DEFAULT_ADS: AdsState = {
  schemaVersion: 2,
  tipsUnlockedSimulationIds: [],
  completedCalculationsSinceLastInterstitial: 0,
};

const DEFAULT_PLAN: EnergyPlan = {
  schemaVersion: 1,
  actions: [],
  updatedAt: now(),
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
  plan: EnergyPlan;
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
  updatePlan: (updates: Partial<EnergyPlan>) => void;
  unlockFeature: (feature: RewardedFeature) => Promise<RewardedAdResult>;
  openAdsPrivacyOptions: () => Promise<boolean>;
  maybeShowInterstitial: () => Promise<void>;
  canShowBanner: boolean;
  adFreeActive: boolean;
  expandedComparisonActive: boolean;
  extraHistoryActive: boolean;
  whatIfActive: boolean;
  internetAvailable: boolean;
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
  };
};

const validIsoDate = (value: unknown) => typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : undefined;

const normalizeAds = (raw: string | null): AdsState => {
  const value = safeParse<Partial<AdsState>>(raw, {});
  if (value.schemaVersion !== 2) return DEFAULT_ADS;
  return {
    ...DEFAULT_ADS,
    ...value,
    schemaVersion: 2,
    adFreeUntil: validIsoDate(value.adFreeUntil),
    expandedComparisonUntil: validIsoDate(value.expandedComparisonUntil),
    extraHistorySlotsUntil: validIsoDate(value.extraHistorySlotsUntil),
    whatIfUnlockedUntil: validIsoDate(value.whatIfUnlockedUntil),
    lastInterstitialShownAt: validIsoDate(value.lastInterstitialShownAt),
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
    && Number.isFinite(item.input.powerWatts) && item.input.powerWatts > 0
    && Number.isFinite(item.input.hoursPerDay) && item.input.hoursPerDay > 0 && item.input.hoursPerDay <= 24
    && Number.isInteger(item.input.daysPerMonth) && item.input.daysPerMonth >= 1 && item.input.daysPerMonth <= 31
    && (item.input.quantity === undefined || (Number.isInteger(item.input.quantity) && item.input.quantity >= 1 && item.input.quantity <= 99))
    && Number.isFinite(item.input.tariffPerKwh) && item.input.tariffPerKwh > 0
    && Number.isFinite(item.result.costPerMonth) && item.result.costPerMonth >= 0
    && Number.isFinite(item.result.consumptionKwhMonth) && item.result.consumptionKwhMonth >= 0;
};

const normalizeHistory = (raw: string | null, fallbackCurrency: CurrencyCode): SavedSimulation[] => {
  const value = safeParse<unknown>(raw, []);
  if (!Array.isArray(value)) return [];
  return value.filter(isSavedSimulation).map((item) => ({
    ...item,
    currency: item.currency ?? fallbackCurrency,
    input: { ...item.input, quantity: Math.max(1, item.input.quantity ?? 1) },
  }));
};

const normalizePlan = (raw: string | null): EnergyPlan => {
  const value = safeParse<Partial<EnergyPlan>>(raw, {});
  return {
    ...DEFAULT_PLAN,
    ...value,
    schemaVersion: 1,
    actions: Array.isArray(value.actions) ? value.actions.filter((item): item is string => typeof item === 'string') : [],
    targetMonthlyCost: typeof value.targetMonthlyCost === 'number' && value.targetMonthlyCost > 0 ? value.targetMonthlyCost : undefined,
    measuredMonthlyKwh: typeof value.measuredMonthlyKwh === 'number' && value.measuredMonthlyKwh > 0 ? value.measuredMonthlyKwh : undefined,
    measuredMonthlyCost: typeof value.measuredMonthlyCost === 'number' && value.measuredMonthlyCost > 0 ? value.measuredMonthlyCost : undefined,
    updatedAt: typeof value.updatedAt === 'string' && !Number.isNaN(Date.parse(value.updatedAt)) ? value.updatedAt : now(),
  };
};

export function AppProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme();
  const networkState = Network.useNetworkState();
  const internetAvailable = networkState.isConnected === true && networkState.isInternetReachable === true;
  const [hydrated, setHydrated] = useState(false);
  const [clock, setClock] = useState(0);
  const [adsInitialized, setAdsInitialized] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ads, setAds] = useState<AdsState>(DEFAULT_ADS);
  const [plan, setPlan] = useState<EnergyPlan>(DEFAULT_PLAN);
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [draft, setDraft] = useState<CalculationDraft>(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
  const [currentSimulation, setCurrentSimulation] = useState<SavedSimulation | null>(null);

  useEffect(() => {
    void Promise.all([
      AsyncStorage.getItem(STORAGE.settings),
      AsyncStorage.getItem(STORAGE.history),
      AsyncStorage.getItem(STORAGE.ads),
      AsyncStorage.getItem(STORAGE.plan),
    ]).then(([settingsRaw, historyRaw, adsRaw, planRaw]) => {
      const loadedSettings = normalizeSettings(settingsRaw);
      setSettings(loadedSettings);
      setHistory(normalizeHistory(historyRaw, loadedSettings.currency));
      setAds(normalizeAds(adsRaw));
      setPlan(normalizePlan(planRaw));
      setDraft(emptyDraft(loadedSettings.defaultTariffPerKwh ?? 0.9));
    }).catch(() => {
      setSettings(DEFAULT_SETTINGS);
      setHistory([]);
      setAds(DEFAULT_ADS);
      setPlan(DEFAULT_PLAN);
      setDraft(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
    }).finally(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    let active = true;
    if (!internetAvailable) {
      setAdsInitialized(false);
      return;
    }
    void initializeAds().then((ready) => {
      if (active) setAdsInitialized(ready);
    }).catch(() => {
      if (active) setAdsInitialized(false);
    });
    return () => { active = false; };
  }, [internetAvailable]);

  useEffect(() => {
    if (!hydrated || !adsInitialized) return;
    let wasBackgrounded = false;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        wasBackgrounded = true;
        return;
      }
      if (nextState === 'active' && wasBackgrounded) {
        wasBackgrounded = false;
        if (internetAvailable && !isActiveUntil(ads.adFreeUntil)) void showAppOpenAd();
      }
    });
    return () => subscription.remove();
  }, [ads.adFreeUntil, adsInitialized, hydrated, internetAvailable]);

  useEffect(() => {
    const timer = setInterval(() => setClock((value) => value + 1), 60_000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.settings, JSON.stringify(settings)).catch(() => undefined);
  }, [hydrated, settings]);
  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.history, JSON.stringify(history)).catch(() => undefined);
  }, [hydrated, history]);
  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.ads, JSON.stringify(ads)).catch(() => undefined);
  }, [ads, hydrated]);
  useEffect(() => {
    if (hydrated) void AsyncStorage.setItem(STORAGE.plan, JSON.stringify(plan)).catch(() => undefined);
  }, [hydrated, plan]);

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
      currency: settings.currency,
      input: { ...input, quantity: Math.max(1, input.quantity ?? 1) },
      result: calculateEnergyCost(input),
      createdAt: now(),
    };
    setCurrentSimulation(simulation);
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

  const extraHistoryActive = internetAvailable && isActiveUntil(ads.extraHistorySlotsUntil);
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
    setPlan(DEFAULT_PLAN);
    setHistory([]);
    setCurrentSimulation(null);
    setDraft(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
  };

  const setLocale = (locale: SupportedLocale) => {
    setSettings((value) => ({ ...value, locale }));
  };
  const setCurrency = (currency: CurrencyCode) => setSettings((value) => ({ ...value, currency }));
  const setTheme = (theme: AppTheme) => setSettings((value) => ({ ...value, theme }));
  const setDefaultTariff = (defaultTariffPerKwh: number) => {
    setSettings((value) => ({ ...value, defaultTariffPerKwh }));
    setDraft((value) => ({ ...value, tariffPerKwh: defaultTariffPerKwh }));
  };
  const updatePlan = (updates: Partial<EnergyPlan>) => setPlan((value) => ({ ...value, ...updates, updatedAt: now() }));

  const unlockFeature = async (feature: RewardedFeature) => {
    if (!internetAvailable) return 'offline';
    if (feature === 'energy_tips' && !currentSimulation) return 'unavailable';
    const result = await showRewardedAd();
    if (result !== 'earned') return result;
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
    return 'earned';
  };

  const adFreeActive = internetAvailable && isActiveUntil(ads.adFreeUntil);
  const openAdsPrivacyOptions = async () => {
    const result = await showAdsPrivacyOptions();
    setAdsInitialized(result.adsReady);
    return result.opened;
  };
  const maybeShowInterstitial = async () => {
    if (adFreeActive || ads.completedCalculationsSinceLastInterstitial < 1) return;
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
    plan,
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
    updatePlan,
    unlockFeature,
    openAdsPrivacyOptions,
    maybeShowInterstitial,
    canShowBanner: internetAvailable && adsInitialized && !adFreeActive,
    adFreeActive,
    expandedComparisonActive: internetAvailable && isActiveUntil(ads.expandedComparisonUntil),
    extraHistoryActive,
    whatIfActive: internetAvailable && isActiveUntil(ads.whatIfUnlockedUntil),
    internetAvailable,
  // Functions are intentionally regenerated with the current localized state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [hydrated, adsInitialized, clock, settings, ads, plan, history, draft, currentSimulation, resolvedTheme, colors, adFreeActive, extraHistoryActive, internetAvailable]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
};
