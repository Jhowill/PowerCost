export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR';
export type AppTheme = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export type CurrencyCode = 'BRL' | 'USD' | 'EUR';
export type ImpactLevel = 'low' | 'medium' | 'high';
export type RewardedFeature =
  | 'ad_free'
  | 'expanded_comparison'
  | 'extra_history_slots'
  | 'energy_tips'
  | 'what_if';

export type Appliance = {
  id: string;
  nameKey: string;
  categoryKey: string;
  icon: string;
  defaultPowerWatts?: number;
};

export type CalculationDraft = {
  currency?: CurrencyCode;
  householdId?: string;
  applianceId: string;
  applianceName: string;
  applianceNameKey?: string;
  powerWatts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  quantity?: number;
  room?: string;
  tariffPerKwh: number;
};

export type CalculationResult = {
  consumptionKwhMonth: number;
  consumptionKwhYear: number;
  costPerDay: number;
  costPerMonth: number;
  costPerYear: number;
  impactLevel: ImpactLevel;
};

export type SavedSimulation = {
  id: string;
  currency: CurrencyCode;
  input: CalculationDraft;
  result: CalculationResult;
  createdAt: string;
};

export type AppSettings = {
  schemaVersion: 1;
  locale: SupportedLocale;
  theme: AppTheme;
  currency: CurrencyCode;
  defaultTariffPerKwh?: number;
};

export type AdsState = {
  schemaVersion: 2;
  adFreeUntil?: string;
  expandedComparisonUntil?: string;
  extraHistorySlotsUntil?: string;
  whatIfUnlockedUntil?: string;
  tipsUnlockedSimulationIds: string[];
  lastInterstitialShownAt?: string;
  completedCalculationsSinceLastInterstitial: number;
};


export type EnergyPlanPeriod = {
  id: string;
  currency: CurrencyCode;
  targetMonthlyCost?: number;
  estimatedKwh?: number;
  estimatedCost?: number;
  actions: string[];
  label: string;
  measuredMonthlyKwh?: number;
  measuredMonthlyCost?: number;
  createdAt: string;
};

export type EnergyPlan = {
  schemaVersion: 4;
  appliances: SavedSimulation[];
  targets: Partial<Record<CurrencyCode, number>>;
  currency: CurrencyCode;
  periods: EnergyPlanPeriod[];
  targetMonthlyCost?: number;
  measuredMonthlyKwh?: number;
  measuredMonthlyCost?: number;
  actions: string[];
  updatedAt: string;
};
