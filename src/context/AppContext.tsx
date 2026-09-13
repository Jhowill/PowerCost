import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import * as Network from 'expo-network';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { AppState, useColorScheme } from 'react-native';

import { translate } from '../i18n/translations';
import { initializeAds, RewardedAdResult, showAdsPrivacyOptions, preloadInterstitialAd, showInterstitialAd, showRewardedAd } from '../services/adsService';
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
import { normalizeSettings, normalizeAds, normalizeHistory, normalizePlan, parseStored } from '../utils/persistence';

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
  schemaVersion: 4,
  appliances: [],
  targets: {},
  currency: DEFAULT_SETTINGS.currency,
  periods: [],
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
  storageError: boolean;
  retryStorage: () => void;
  draftRevision: number;
  saveHousehold: () => void;
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
  setCurrency: (currency: CurrencyCode) => void;
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

export function AppProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme();
  const networkState = Network.useNetworkState();
  const internetAvailable = networkState.isConnected === true && networkState.isInternetReachable === true;
  const [storageError, setStorageError] = useState(false);
  const [reload, setReload] = useState(0);
  const writable = useRef(new Set<string>());
  const writes = useRef(Promise.resolve());
  const persist = useCallback((key: string, value: unknown) => {
    if (!writable.current.has(key)) return;
    const serialized = JSON.stringify(value);
    writes.current = writes.current.then(() => AsyncStorage.setItem(key, serialized)).catch(() => { setStorageError(true); });
  }, []);
  const [draftRevision, setDraftRevision] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [clock, setClock] = useState(0);
  const [adsInitialized, setAdsInitialized] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [ads, setAds] = useState<AdsState>(DEFAULT_ADS);
  const [plan, setPlan] = useState<EnergyPlan>(DEFAULT_PLAN);
  const [history, setHistory] = useState<SavedSimulation[]>([]);
  const [draft, setDraft] = useState<CalculationDraft>(emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh));
  const [currentSimulation, setCurrentSimulation] = useState<SavedSimulation | null>(null);

  const adsRef = useRef(ads);
  adsRef.current = ads;
  const dataGeneration = useRef(0);
  useEffect(() => {
    let active = true;
    setHydrated(false);
    void (async () => {
      await writes.current;
      const keys = Object.values(STORAGE);
      const results = await Promise.allSettled(keys.map(async (key) => {
        const parsed = parseStored(await AsyncStorage.getItem(key));
        if (parsed !== null && (key === STORAGE.history ? !Array.isArray(parsed) : typeof parsed !== 'object' || Array.isArray(parsed))) throw new Error('Invalid storage shape');
        if (key === STORAGE.plan && parsed && typeof (parsed as EnergyPlan).schemaVersion === 'number' && (parsed as EnergyPlan).schemaVersion > 4) throw new Error('Unsupported plan version');
        return parsed;
      }));
      if (!active) return;
      writable.current = new Set(keys.filter((_, index) => results[index].status === 'fulfilled'));
      if (results[0].status === 'rejected') {
        // Do not rewrite legacy amounts using a guessed currency.
        writable.current.delete(STORAGE.history);
        writable.current.delete(STORAGE.plan);
      }
      setStorageError(results.some((result) => result.status === 'rejected'));
      const read = (index: number) => {
        const result = results[index];
        return result.status === 'fulfilled' ? result.value : undefined;
      };
      const loadedSettings = results[0].status === 'fulfilled' ? normalizeSettings(read(0), DEFAULT_SETTINGS) : DEFAULT_SETTINGS;
      if (results[0].status === 'fulfilled') setSettings(loadedSettings);
      if (results[1].status === 'fulfilled') setHistory(normalizeHistory(read(1), loadedSettings.currency));
      if (results[2].status === 'fulfilled') {
        const loadedAds = normalizeAds(read(2), DEFAULT_ADS);
        adsRef.current = loadedAds;
        setAds(loadedAds);
      }
      if (results[3].status === 'fulfilled') setPlan(normalizePlan(read(3), loadedSettings.currency));
      setDraft({ ...emptyDraft(loadedSettings.defaultTariffPerKwh), currency: loadedSettings.currency });
      setDraftRevision((v) => v + 1);
      setHydrated(true);
    })();
    return () => { active = false; };
  }, [reload]);

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
    if (hydrated && adsInitialized && !isActiveUntil(ads.adFreeUntil)) preloadInterstitialAd();
    // App Open is disabled: the app has no foreground loading phase.
  }, [hydrated, adsInitialized, ads.adFreeUntil]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setClock((v) => v + 1);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setClock((value) => value + 1), 60_000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (hydrated) persist(STORAGE.settings, settings);
  }, [hydrated, settings, persist]);
  useEffect(() => {
    if (hydrated) persist(STORAGE.history, history);
  }, [hydrated, history, persist]);
  useEffect(() => {
    if (hydrated) persist(STORAGE.ads, ads);
  }, [ads, hydrated, persist]);
  useEffect(() => {
    if (hydrated) persist(STORAGE.plan, plan);
  }, [hydrated, plan, persist]);

  const resolvedTheme = settings.theme === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : settings.theme;
  const colors = palettes[resolvedTheme];
  const t = (key: string, params?: Record<string, string | number>) => translate(settings.locale, key, params);

  const resetCalculation = () => {
    setCurrentSimulation(null);
    setDraft({ ...emptyDraft(settings.defaultTariffPerKwh), currency: settings.currency });
    setDraftRevision((v) => v + 1);
  };

  const completeCalculation = (input: CalculationDraft) => {
    const simulation: SavedSimulation = {
      id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      currency: input.currency ?? settings.currency,
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
    setDraft({ ...simulation.input, currency: simulation.currency });
    setDraftRevision((v) => v + 1);
  };

  const extraHistoryActive = isActiveUntil(ads.extraHistorySlotsUntil);
  const saveCurrent = (): SaveResult => {
    if (!currentSimulation || storageError) return 'none';
    if (history.some((item) => item.id === currentSimulation.id)) return 'saved';
    const limit = extraHistoryActive ? APP_LIMITS.rewardedHistory : APP_LIMITS.freeHistory;
    if (history.length >= limit) return 'limit';
    setHistory((items) => items.some((item) => item.id === currentSimulation.id) || items.length >= limit ? items : [currentSimulation, ...items]);
    return 'saved';
  };

  const deleteSimulation = (id: string) => setHistory((items) => items.filter((item) => item.id !== id));
  const clearHistory = () => setHistory([]);
  const clearAllLocalData = async () => {
    dataGeneration.current += 1;
    await writes.current;
    await AsyncStorage.multiRemove(Object.values(STORAGE));
    writable.current = new Set(Object.values(STORAGE));
    setStorageError(false);
    adsRef.current = DEFAULT_ADS;
    setSettings(DEFAULT_SETTINGS);
    setAds(DEFAULT_ADS);
    setPlan(DEFAULT_PLAN);
    setHistory([]);
    setCurrentSimulation(null);
    setDraft({ ...emptyDraft(DEFAULT_SETTINGS.defaultTariffPerKwh), currency: DEFAULT_SETTINGS.currency });
    setDraftRevision((v) => v + 1);
  };

  const setLocale = (locale: SupportedLocale) => {
    setSettings((value) => ({ ...value, locale }));
  };
  const setCurrency = (currency: CurrencyCode) => setSettings((value) => value.currency === currency ? value : ({ ...value, currency, defaultTariffPerKwh: undefined }));
  const setTheme = (theme: AppTheme) => setSettings((value) => ({ ...value, theme }));
  const setDefaultTariff = (defaultTariffPerKwh: number) => {
    setSettings((value) => ({ ...value, defaultTariffPerKwh }));

  };
  const updatePlan = (updates: Partial<EnergyPlan>) => {
    if (storageError) return;
    setPlan((value) => ({ ...value, ...updates, updatedAt: now() }));
  };

  const saveHousehold = () => {
    if (!currentSimulation || storageError) return;
    const id = currentSimulation.input.householdId ?? currentSimulation.id;
    const item = { ...currentSimulation, id, input: { ...currentSimulation.input, householdId: id } };
    setPlan((value) => ({ ...value, appliances: [item, ...value.appliances.filter((existing) => existing.id !== id)], updatedAt: now() }));
    setCurrentSimulation({ ...currentSimulation, input: item.input });
  };
  const unlockFeature = async (feature: RewardedFeature) => {
    if (!internetAvailable) return 'offline';
    if (!writable.current.has(STORAGE.ads)) return 'unavailable';
    const simulationId = currentSimulation?.id;
    if (feature === 'energy_tips' && !simulationId) return 'unavailable';
    const generation = dataGeneration.current;
    let granted = false;
    return showRewardedAd(() => {
      if (granted || generation !== dataGeneration.current) return;
      granted = true;
      const fromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();
      const value = adsRef.current;
      let next = value;
      if (feature === 'ad_free') next = { ...value, adFreeUntil: fromNow(30) };
      if (feature === 'expanded_comparison') next = { ...value, expandedComparisonUntil: fromNow(24 * 60) };
      if (feature === 'extra_history_slots') next = { ...value, extraHistorySlotsUntil: fromNow(24 * 60) };
      if (feature === 'what_if') next = { ...value, whatIfUnlockedUntil: fromNow(30) };
      if (feature === 'energy_tips' && simulationId) next = { ...value, tipsUnlockedSimulationIds: [...new Set([...value.tipsUnlockedSimulationIds, simulationId])] };
      adsRef.current = next;
      setAds(next);
      persist(STORAGE.ads, next);
    });
  };

  const adFreeActive = isActiveUntil(ads.adFreeUntil);
  const openAdsPrivacyOptions = async () => {
    const result = await showAdsPrivacyOptions();
    setAdsInitialized(result.adsReady);
    return result.opened;
  };
  const maybeShowInterstitial = async () => {
    if (!internetAvailable || adFreeActive || ads.completedCalculationsSinceLastInterstitial < 1) return;
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
    storageError,
    retryStorage: () => setReload((v) => v + 1),
    draftRevision,
    saveHousehold,
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
    setCurrency,
    setTheme,
    setDefaultTariff,
    updatePlan,
    unlockFeature,
    openAdsPrivacyOptions,
    maybeShowInterstitial,
    canShowBanner: internetAvailable && adsInitialized && !adFreeActive,
    adFreeActive,
    expandedComparisonActive: isActiveUntil(ads.expandedComparisonUntil),
    extraHistoryActive,
    whatIfActive: isActiveUntil(ads.whatIfUnlockedUntil),
    internetAvailable,
  // Functions are intentionally regenerated with the current localized state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [storageError, draftRevision, hydrated, adsInitialized, clock, settings, ads, plan, history, draft, currentSimulation, resolvedTheme, colors, adFreeActive, extraHistoryActive, internetAvailable]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
};
