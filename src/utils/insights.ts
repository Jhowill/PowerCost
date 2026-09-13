import { CalculationDraft, CalculationResult } from '../types';

export type SavingsPlan = {
  reductionPercent: number;
  targetHoursPerDay: number;
  minutesSavedPerDay: number;
  newMonthlyCost: number;
  newMonthlyConsumption: number;
  monthlySavings: number;
  yearlySavings: number;
  yearlyKwhSavings: number;
};

const RECOMMENDED_REDUCTION_BY_APPLIANCE: Record<string, number> = {
  air_conditioner: 15,
  electric_shower: 20,
  refrigerator: 10,
  tv: 20,
  washing_machine: 15,
  fan: 15,
  computer: 20,
  lamp: 25,
};

export const getRecommendedReduction = (applianceId: string) =>
  RECOMMENDED_REDUCTION_BY_APPLIANCE[applianceId] ?? 15;

export const getSavingActionKey = (applianceId: string) => {
  if (applianceId === 'air_conditioner') return 'result.action.airConditioner';
  if (applianceId === 'electric_shower') return 'result.action.shower';
  if (applianceId === 'refrigerator') return 'result.action.refrigerator';
  if (applianceId === 'washing_machine') return 'result.action.washingMachine';
  if (applianceId === 'lamp') return 'result.action.lamp';
  if (applianceId === 'tv' || applianceId === 'computer') return 'result.action.electronics';
  return 'result.action.general';
};

export const createSavingsPlan = (
  input: CalculationDraft,
  result: CalculationResult,
  requestedReduction: number,
): SavingsPlan => {
  const reductionPercent = Math.min(90, Math.max(1, requestedReduction));
  const factor = reductionPercent / 100;

  return {
    reductionPercent,
    targetHoursPerDay: input.hoursPerDay * (1 - factor),
    minutesSavedPerDay: input.hoursPerDay * 60 * factor,
    newMonthlyCost: result.costPerMonth * (1 - factor),
    newMonthlyConsumption: result.consumptionKwhMonth * (1 - factor),
    monthlySavings: result.costPerMonth * factor,
    yearlySavings: result.costPerYear * factor,
    yearlyKwhSavings: result.consumptionKwhYear * factor,
  };
};
