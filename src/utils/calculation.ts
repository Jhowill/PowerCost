import { CalculationDraft, CalculationResult, CurrencyCode, ImpactLevel, SupportedLocale } from '../types';

export const APP_LIMITS = {
  freeHistory: 5,
  rewardedHistory: 10,
  freeComparison: 3,
  rewardedComparison: 10,
} as const;

export const getImpactLevel = (cost: number): ImpactLevel => {
  if (cost < 20) return 'low';
  if (cost < 80) return 'medium';
  return 'high';
};

export const calculateEnergyCost = (input: CalculationDraft): CalculationResult => {
  const consumptionKwhMonth = (input.powerWatts * input.hoursPerDay * input.daysPerMonth) / 1000;
  const costPerMonth = consumptionKwhMonth * input.tariffPerKwh;
  return {
    consumptionKwhMonth,
    consumptionKwhYear: consumptionKwhMonth * 12,
    costPerDay: costPerMonth / input.daysPerMonth,
    costPerMonth,
    costPerYear: costPerMonth * 12,
    impactLevel: getImpactLevel(costPerMonth),
  };
};

export const parseDecimal = (value: string) => Number(value.trim().replace(',', '.'));

export const formatCurrency = (value: number, locale: SupportedLocale, currency: CurrencyCode) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
};

export const formatCurrencySymbol = (currency: CurrencyCode) => CURRENCY_SYMBOLS[currency];

export const formatNumber = (value: number, locale: SupportedLocale, digits = 1) =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

export const formatDate = (value: string, locale: SupportedLocale) =>
  new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));

export const isActiveUntil = (value?: string) => Boolean(value && new Date(value).getTime() > Date.now());
