import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BannerAdSlot } from '../src/components/BannerAdSlot';
import { RewardedCard } from '../src/components/RewardedCard';
import { Button, Card, EmptyState, Header, Page } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';
import { APP_LIMITS, formatCurrency } from '../src/utils/calculation';

export default function CompareScreen() {
  const { colors, t, history, settings, ads, expandedComparisonActive, setCurrentSimulation, resetCalculation, maybeShowInterstitial } = useApp();
  const sorted = [...history].sort((a, b) => b.result.costPerMonth - a.result.costPerMonth);
  const limit = expandedComparisonActive ? APP_LIMITS.rewardedComparison : APP_LIMITS.freeComparison;
  const visible = sorted.slice(0, limit);
  const max = visible[0]?.result.costPerMonth || 1;
  const total = visible.reduce((sum, item) => sum + item.result.costPerMonth, 0);
  const goBack = () => { void maybeShowInterstitial(); router.back(); };
  const add = () => { resetCalculation(); router.push('/calculate'); };
  const open = (index: number) => { setCurrentSimulation(visible[index]); router.push('/result'); };

  return (
    <Page>
      <Header title={t('compare.title')} subtitle={t('compare.subtitle')} back onBack={goBack} />
      {history.length < 2 ? (
        <EmptyState icon="bar-chart-outline" title={t('compare.emptyTitle')} text={t('compare.emptyText')} action={t('compare.add')} onAction={add} />
      ) : (
        <>
          <Card tone="primary" style={styles.summary}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>{t('compare.total')}</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>{formatCurrency(total, settings.locale, settings.currency)}/{t('result.perMonth')}</Text>
            <Text style={[styles.annualTotal, { color: colors.text }]}>{t('compare.yearlyTotal', { value: formatCurrency(total * 12, settings.locale, settings.currency) })}</Text>
            <Text style={[styles.summaryText, { color: colors.textMuted }]}>{t('compare.highest', { name: visible[0].input.applianceNameKey ? t(visible[0].input.applianceNameKey) : visible[0].input.applianceName })}</Text>
          </Card>
          {visible.map((item, index) => (
            <Pressable key={item.id} onPress={() => open(index)}>
              <Card style={styles.rankCard}>
                <View style={[styles.rank, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}><Text style={[styles.rankNumber, { color: colors.primary }]}>{index + 1}</Text></View>
                <View style={styles.rankCopy}>
                  <View style={styles.rankTop}>
                    <Text numberOfLines={1} style={[styles.rankName, { color: colors.text }]}>{item.input.applianceNameKey ? t(item.input.applianceNameKey) : item.input.applianceName}</Text>
                    <Text style={[styles.rankCost, { color: colors.primary }]}>{formatCurrency(item.result.costPerMonth, settings.locale, settings.currency)}</Text>
                  </View>
                  <View style={[styles.barTrack, { backgroundColor: colors.border }]}><View style={[styles.barValue, { backgroundColor: colors.primary, width: `${Math.max(5, (item.result.costPerMonth / max) * 100)}%` }]} /></View>
                  <Text style={[styles.share, { color: colors.textMuted }]}>{t('compare.share', { value: Math.round((item.result.costPerMonth / total) * 100) })}</Text>
                </View>
              </Card>
            </Pressable>
          ))}
          {sorted.length > APP_LIMITS.freeComparison && !expandedComparisonActive ? (
            <RewardedCard title={t('compare.unlock')} duration={t('unlock.compareTime')} feature="expanded_comparison" activeUntil={ads.expandedComparisonUntil} />
          ) : null}
          <Button label={t('compare.add')} onPress={add} icon="add-circle-outline" />
        </>
      )}
      <BannerAdSlot />
    </Page>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 20 },
  summaryLabel: { fontSize: 15, fontWeight: '800' },
  summaryValue: { fontSize: 28, lineHeight: 36, fontWeight: '900', marginTop: 3 },
  annualTotal: { fontSize: 14, lineHeight: 20, fontWeight: '800', marginTop: 2 },
  summaryText: { fontSize: 14, lineHeight: 20, marginTop: 4 },
  rankCard: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  rank: { width: 34, height: 34, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  rankNumber: { fontSize: 15, fontWeight: '900' },
  rankCopy: { flex: 1 },
  rankTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankName: { flex: 1, fontSize: 16, fontWeight: '800' },
  rankCost: { fontSize: 15, fontWeight: '900' },
  barTrack: { height: 7, borderRadius: 999, overflow: 'hidden', marginTop: 10 },
  barValue: { height: '100%', borderRadius: 999 },
  share: { fontSize: 11, fontWeight: '700', marginTop: 5 },
});
