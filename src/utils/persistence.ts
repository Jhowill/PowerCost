import { AppSettings, AdsState, CurrencyCode, EnergyPlan, EnergyPlanPeriod, SavedSimulation } from '../types';
import { calculateEnergyCost } from './calculation';

export const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 1e12;
export const amount = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1e15;
export const currency = (value: unknown, fallback: CurrencyCode): CurrencyCode => ['BRL', 'USD', 'EUR'].includes(value as string) ? value as CurrencyCode : fallback;
export const date = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : undefined;
export const strings = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === 'string'))] : [];
export const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

// Malformed JSON is a read failure, not permission to overwrite the original.
export const parseStored = (raw: string | null): unknown => raw === null ? null : JSON.parse(raw);
export function normalizeSettings(raw: unknown, defaults: AppSettings): AppSettings {
  const v = object(raw);
  return { ...defaults,
    locale: ['pt-BR', 'en-US', 'es-ES', 'fr-FR'].includes(v.locale as string) ? v.locale as AppSettings['locale'] : defaults.locale,
    theme: ['system', 'light', 'dark'].includes(v.theme as string) ? v.theme as AppSettings['theme'] : defaults.theme,
    currency: currency(v.currency, defaults.currency),
    defaultTariffPerKwh: positive(v.defaultTariffPerKwh) ? v.defaultTariffPerKwh : undefined,
  };
}
export function normalizeHistory(raw: unknown, fallback: CurrencyCode): SavedSimulation[] {
  if (!Array.isArray(raw)) return [];
  const ids = new Set<string>();
  return raw.flatMap((entry): SavedSimulation[] => {
    const v = object(entry), i = object(v.input);
    if (typeof v.id !== 'string' || ids.has(v.id) || !date(v.createdAt) ||
      typeof i.applianceName !== 'string' || !i.applianceName.trim() ||
      !positive(i.powerWatts) || !positive(i.hoursPerDay) || i.hoursPerDay > 24 ||
      !positive(i.daysPerMonth) || !Number.isInteger(i.daysPerMonth) || i.daysPerMonth > 31 ||
      !positive(i.tariffPerKwh) ||
      (i.quantity !== undefined && (!positive(i.quantity) || !Number.isInteger(i.quantity) || i.quantity > 99))) return [];
    const unit = currency(v.currency, fallback);
    const input = {
      applianceId: typeof i.applianceId === 'string' ? i.applianceId : 'other',
      applianceName: i.applianceName,
      applianceNameKey: typeof i.applianceNameKey === 'string' ? i.applianceNameKey : undefined,
      powerWatts: i.powerWatts, hoursPerDay: i.hoursPerDay, daysPerMonth: i.daysPerMonth,
      tariffPerKwh: i.tariffPerKwh, quantity: typeof i.quantity === 'number' ? i.quantity : 1,
      room: typeof i.room === 'string' ? i.room.trim() || undefined : undefined,
      currency: unit,
      householdId: typeof i.householdId === 'string' ? i.householdId : undefined,
    };
    const result = calculateEnergyCost(input);
    if (![result.costPerMonth, result.costPerYear, result.consumptionKwhYear].every(amount)) return [];
    ids.add(v.id);
    return [{ id: v.id, createdAt: v.createdAt as string, currency: unit, input, result }];
  });
}
export function normalizeAds(raw: unknown, defaults: AdsState): AdsState {
  const v = object(raw);
  if (v.schemaVersion !== 2) return defaults;
  return { ...defaults, adFreeUntil: date(v.adFreeUntil), expandedComparisonUntil: date(v.expandedComparisonUntil),
    extraHistorySlotsUntil: date(v.extraHistorySlotsUntil), whatIfUnlockedUntil: date(v.whatIfUnlockedUntil),
    lastInterstitialShownAt: date(v.lastInterstitialShownAt), tipsUnlockedSimulationIds: strings(v.tipsUnlockedSimulationIds),
    completedCalculationsSinceLastInterstitial: amount(v.completedCalculationsSinceLastInterstitial)
      ? Math.floor(v.completedCalculationsSinceLastInterstitial) : 0 };
}
export const validMonth = (id: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(id) && Number(id.slice(0, 4)) >= 1900 && Number(id.slice(0, 4)) <= 2200;
export const localMonth = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
export function normalizePlan(raw: unknown, fallback: CurrencyCode): EnergyPlan {
  const v = object(raw), unit = currency(v.currency, fallback);
  const seen = new Set<string>();
  const periods: EnergyPlanPeriod[] = Array.isArray(v.periods) ? v.periods.flatMap((entry): EnergyPlanPeriod[] => {
    const p = object(entry);
    if (typeof p.id !== 'string' || !validMonth(p.id) || !date(p.createdAt)) return [];
    const unit = currency(p.currency, currency(v.currency, fallback)), key = p.id + unit;
    if (seen.has(key)) return [];
    const kwh = amount(p.measuredMonthlyKwh) ? p.measuredMonthlyKwh : undefined;
    const cost = amount(p.measuredMonthlyCost) ? p.measuredMonthlyCost : undefined;
    if (kwh === undefined && cost === undefined) return [];
    seen.add(key);
    return [{ id: p.id, label: p.id, currency: unit, measuredMonthlyKwh: kwh, measuredMonthlyCost: cost,
      targetMonthlyCost: positive(p.targetMonthlyCost) ? p.targetMonthlyCost : undefined,
      estimatedKwh: amount(p.estimatedKwh) ? p.estimatedKwh : undefined,
      estimatedCost: amount(p.estimatedCost) ? p.estimatedCost : undefined,
      actions: strings(p.actions), createdAt: p.createdAt as string }];
  }) : [];
  // Preserve the single legacy bill as a dated period during migration.
  if (!periods.length && (amount(v.measuredMonthlyKwh) || amount(v.measuredMonthlyCost))) {
    const createdAt = date(v.updatedAt) ?? new Date().toISOString();
    const id = localMonth(new Date(createdAt));
    periods.push({ id, label: id, currency: unit, createdAt,
      measuredMonthlyKwh: amount(v.measuredMonthlyKwh) ? v.measuredMonthlyKwh : undefined,
      measuredMonthlyCost: amount(v.measuredMonthlyCost) ? v.measuredMonthlyCost : undefined,
      targetMonthlyCost: positive(v.targetMonthlyCost) ? v.targetMonthlyCost : undefined, actions: strings(v.actions) });
  }
  const targets: Partial<Record<CurrencyCode, number>> = {};
  const storedTargets = object(v.targets);
  for (const code of ['BRL', 'USD', 'EUR'] as const) {
    if (positive(storedTargets[code])) targets[code] = storedTargets[code];
  }
  if (targets[unit] === undefined && positive(v.targetMonthlyCost)) targets[unit] = v.targetMonthlyCost;
  return { schemaVersion: 4, currency: unit, appliances: normalizeHistory(v.appliances, unit), periods, targets,
    targetMonthlyCost: positive(v.targetMonthlyCost) ? v.targetMonthlyCost : undefined,
    actions: strings(v.actions), updatedAt: date(v.updatedAt) ?? new Date().toISOString() };
}
