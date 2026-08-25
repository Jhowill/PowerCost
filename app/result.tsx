import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { BannerAdSlot } from '../src/components/BannerAdSlot';
import { RewardedCard } from '../src/components/RewardedCard';
import { Button, Card, EmptyState, Header, Page } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';
import { formatCurrency, formatNumber } from '../src/utils/calculation';
import { createSavingsPlan, getRecommendedReduction, getSavingActionKey } from '../src/utils/insights';

export default function ResultScreen() {
  const {
    colors, t, currentSimulation, settings, ads, whatIfActive, internetAvailable, saveCurrent, isCurrentSaved,
    resetCalculation, maybeShowInterstitial,
  } = useApp();
  const [reduction, setReduction] = useState(25);

  if (!currentSimulation) {
    return (
      <Page>
        <Header title={t('result.title')} back onBack={() => router.back()} />
        <EmptyState title={t('result.noResult')} text={t('home.noCalculation')} action={t('home.calculateNow')} onAction={() => router.replace('/calculate')} />
      </Page>
    );
  }

  const { input, result } = currentSimulation;
  const applianceName = input.applianceNameKey ? t(input.applianceNameKey) : input.applianceName;
  const impactKey = `result.${result.impactLevel}`;
  const impactColor = result.impactLevel === 'low' ? colors.success : result.impactLevel === 'medium' ? colors.warning : colors.danger;
  const tipsActive = internetAvailable && ads.tipsUnlockedSimulationIds.includes(currentSimulation.id);
  const recommendedReduction = getRecommendedReduction(input.applianceId);
  const recommendedPlan = createSavingsPlan(input, result, recommendedReduction);
  const scenarioPlan = createSavingsPlan(input, result, reduction);
  const scenarioOptions = [...new Set([10, recommendedReduction, 25, 50])];

  const save = () => {
    const status = saveCurrent();
    if (status === 'saved') {
      Alert.alert(t('result.saved'));
    } else if (status === 'limit') {
      Alert.alert(t('history.limit'), t('history.unlock'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('ads.watch'), onPress: () => router.push('/extras') },
      ]);
    }
  };

  const calculateAnother = () => {
    void maybeShowInterstitial();
    resetCalculation();
    router.replace('/calculate');
  };

  return (
    <Page>
      <Header title={t('result.title')} back onBack={() => router.back()} />
      <Card style={styles.deviceCard}>
        <View style={[styles.deviceIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="flash-outline" size={25} color={colors.primary} /></View>
        <View style={styles.deviceCopy}>
          <Text style={[styles.deviceName, { color: colors.text }]}>{applianceName}</Text>
          <Text style={[styles.deviceDetails, { color: colors.textMuted }]}>{t('result.details', { watts: formatNumber(input.powerWatts, settings.locale, 0), hours: formatNumber(input.hoursPerDay, settings.locale, input.hoursPerDay % 1 ? 1 : 0), days: input.daysPerMonth })}</Text>
          <Text style={[styles.deviceDetails, { color: colors.textMuted }]}>{t('result.tariff', { value: formatCurrency(input.tariffPerKwh, settings.locale, settings.currency) })}</Text>
        </View>
      </Card>

      <Card tone="primary" style={styles.resultCard}>
        <Text style={[styles.resultLabel, { color: colors.text }]}>{t('result.monthlyEstimated')}</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.resultValue, { color: colors.primary }]}>{formatCurrency(result.costPerMonth, settings.locale, settings.currency)}</Text>
        <Text style={[styles.perMonth, { color: colors.textMuted }]}>{t('result.perMonth')}</Text>
        <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: impactColor }]}>
          <Text style={[styles.badgeText, { color: impactColor }]}>{t(impactKey)}</Text>
        </View>
      </Card>

      <Metric label={t('result.monthlyConsumption')} value={`${formatNumber(result.consumptionKwhMonth, settings.locale)} kWh`} />
      <Metric label={t('result.dailyCost')} value={formatCurrency(result.costPerDay, settings.locale, settings.currency)} />
      <Metric label={t('result.yearlyCost')} value={formatCurrency(result.costPerYear, settings.locale, settings.currency)} />
      <Text style={[styles.warning, { color: colors.textMuted }]}>{t('result.approx')}</Text>

      <Button label={isCurrentSaved ? t('result.saved') : t('result.save')} onPress={save} icon={isCurrentSaved ? 'checkmark-circle' : 'bookmark-outline'} disabled={isCurrentSaved} />
      <Button label={t('result.compare')} onPress={() => router.push('/compare')} variant="outline" icon="bar-chart-outline" />
      <Button label={t('result.calculateAnother')} onPress={calculateAnother} variant="ghost" icon="refresh-outline" />
      <BannerAdSlot />

      {tipsActive ? (
        <Card tone="reward" style={styles.extraCard}>
          <View style={styles.extraTitleRow}>
            <Ionicons name="bulb-outline" size={25} color={colors.warning} />
            <Text style={[styles.extraTitle, { color: colors.text }]}>{t('result.personalPlan')}</Text>
          </View>
          <Text style={[styles.extraText, { color: colors.text }]}>{t(getSavingActionKey(input.applianceId))}</Text>
          <View style={[styles.goal, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.goalIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="flag-outline" size={22} color={colors.primary} /></View>
            <View style={styles.goalCopy}>
              <Text style={[styles.goalLabel, { color: colors.textMuted }]}>{t('result.recommendedGoal')}</Text>
              <Text style={[styles.goalValue, { color: colors.text }]}>
                {input.applianceId === 'refrigerator'
                  ? t('result.improveEfficiency', { percent: recommendedReduction })
                  : t('result.reduceMinutes', { minutes: formatNumber(recommendedPlan.minutesSavedPerDay, settings.locale, 0), percent: recommendedReduction })}
              </Text>
            </View>
          </View>
          <View style={styles.insightGrid}>
            <InsightMetric label={t('result.monthlySaving')} value={formatCurrency(recommendedPlan.monthlySavings, settings.locale, settings.currency)} />
            <InsightMetric label={t('result.yearlySaving')} value={formatCurrency(recommendedPlan.yearlySavings, settings.locale, settings.currency)} />
            <InsightMetric label={t('result.energyAvoided')} value={`${formatNumber(recommendedPlan.yearlyKwhSavings, settings.locale, 1)} kWh`} />
          </View>
          <Text style={[styles.disclaimer, { color: colors.textMuted }]}>{t('result.planDisclaimer')}</Text>
        </Card>
      ) : (
        <RewardedCard title={t('unlock.tips')} duration={t('result.unlockTip')} feature="energy_tips" />
      )}

      {whatIfActive ? (
        <Card style={styles.extraCard}>
          <Text style={[styles.extraTitle, { color: colors.text }]}>{t('result.whatIfTitle')}</Text>
          <Text style={[styles.extraText, { color: colors.textMuted }]}>{t('result.whatIfAdvancedText')}</Text>
          <View style={styles.scenarioRow}>
            {scenarioOptions.map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityState={{ selected: reduction === value }}
                onPress={() => setReduction(value)}
                style={[styles.scenarioChip, { backgroundColor: reduction === value ? colors.primarySoft : colors.surfaceSoft, borderColor: reduction === value ? colors.primary : colors.border }]}>
                <Text style={[styles.scenarioChipText, { color: colors.text }]}>{t('result.lessUse', { value })}</Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.scenarioResult, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.scenarioLabel, { color: colors.textMuted }]}>{t('result.newMonthlyCost')}</Text>
            <Text style={[styles.scenarioValue, { color: colors.primary }]}>{formatCurrency(scenarioPlan.newMonthlyCost, settings.locale, settings.currency)}</Text>
            <Text style={[styles.scenarioSaving, { color: colors.text }]}>{t('result.youSave', { value: formatCurrency(scenarioPlan.monthlySavings, settings.locale, settings.currency) })}</Text>
          </View>
          <View style={styles.insightGrid}>
            <InsightMetric label={t('result.targetUse')} value={`${formatNumber(scenarioPlan.targetHoursPerDay, settings.locale, 1)} h/${t('result.day')}`} />
            <InsightMetric label={t('result.newConsumption')} value={`${formatNumber(scenarioPlan.newMonthlyConsumption, settings.locale, 1)} kWh`} />
            <InsightMetric label={t('result.savingInYear')} value={formatCurrency(scenarioPlan.yearlySavings, settings.locale, settings.currency)} />
          </View>
        </Card>
      ) : (
        <RewardedCard title={t('unlock.whatIf')} duration={t('result.unlockWhatIf')} feature="what_if" />
      )}
    </Page>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const { colors } = useApp();
  return (
    <View style={[styles.metric, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function InsightMetric({ label, value }: { label: string; value: string }) {
  const { colors } = useApp();
  return (
    <View style={[styles.insightMetric, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.insightLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.insightValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  deviceCard: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  deviceIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  deviceCopy: { flex: 1, marginLeft: 13 },
  deviceName: { fontSize: 19, lineHeight: 25, fontWeight: '800' },
  deviceDetails: { fontSize: 13, lineHeight: 19 },
  resultCard: { alignItems: 'center', paddingVertical: 28 },
  resultLabel: { fontSize: 16, fontWeight: '800' },
  resultValue: { width: '100%', fontSize: 48, lineHeight: 58, fontWeight: '900', letterSpacing: -1.4, textAlign: 'center', marginTop: 12 },
  perMonth: { fontSize: 16 },
  badge: { borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5, marginTop: 13 },
  badgeText: { fontSize: 13, fontWeight: '800' },
  metric: { minHeight: 64, borderWidth: 1, borderRadius: 14, marginBottom: 10, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  metricLabel: { flex: 1, fontSize: 14 },
  metricValue: { fontSize: 17, fontWeight: '800', textAlign: 'right' },
  warning: { fontSize: 13, lineHeight: 19, marginVertical: 5 },
  extraCard: { marginTop: 16 },
  extraTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  extraTitle: { fontSize: 19, lineHeight: 25, fontWeight: '800' },
  extraText: { fontSize: 15, lineHeight: 22, marginTop: 7 },
  goal: { borderWidth: 1, borderRadius: 16, flexDirection: 'row', alignItems: 'center', padding: 13, marginTop: 15 },
  goalIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  goalCopy: { flex: 1, marginLeft: 11 },
  goalLabel: { fontSize: 12, fontWeight: '700' },
  goalValue: { fontSize: 15, lineHeight: 20, fontWeight: '800', marginTop: 2 },
  insightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  insightMetric: { width: '31%', flexGrow: 1, minWidth: 105, borderWidth: 1, borderRadius: 13, padding: 11 },
  insightLabel: { fontSize: 11, lineHeight: 15, fontWeight: '700' },
  insightValue: { fontSize: 16, lineHeight: 21, fontWeight: '900', marginTop: 3 },
  disclaimer: { fontSize: 11, lineHeight: 16, marginTop: 10 },
  scenarioRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  scenarioChip: { flex: 1, minHeight: 50, borderWidth: 1.5, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  scenarioChipText: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  scenarioResult: { borderRadius: 16, alignItems: 'center', padding: 16, marginTop: 14 },
  scenarioLabel: { fontSize: 13 },
  scenarioValue: { fontSize: 28, fontWeight: '900', marginTop: 3 },
  scenarioSaving: { fontSize: 14, fontWeight: '700', marginTop: 3 },
});
