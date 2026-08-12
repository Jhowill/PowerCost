import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BannerAdSlot } from '../src/components/BannerAdSlot';
import { RewardedCard } from '../src/components/RewardedCard';
import { Card, Header, Page } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';

export default function UnlockScreen() {
  const { colors, t, ads, currentSimulation } = useApp();
  return (
    <Page>
      <Header title={t('unlock.title')} subtitle={t('unlock.subtitle')} back onBack={() => router.back()} />
      <Card tone="primary" style={styles.intro}>
        <Text style={[styles.introTitle, { color: colors.text }]}>{t('unlock.tempTitle')}</Text>
        <Text style={[styles.introText, { color: colors.textMuted }]}>{t('unlock.tempText')}</Text>
      </Card>

      <RewardedCard title={t('unlock.adFree')} description={t('unlock.adFreeDescription')} duration={t('unlock.adFreeTime')} feature="ad_free" icon="eye-off-outline" activeUntil={ads.adFreeUntil} />
      <RewardedCard title={t('unlock.compare')} description={t('unlock.compareDescription')} duration={t('unlock.compareTime')} feature="expanded_comparison" icon="analytics-outline" activeUntil={ads.expandedComparisonUntil} />
      <RewardedCard title={t('unlock.history')} description={t('unlock.historyDescription')} duration={t('unlock.historyTime')} feature="extra_history_slots" icon="archive-outline" activeUntil={ads.extraHistorySlotsUntil} />
      <RewardedCard
        title={t('unlock.tips')}
        description={t('unlock.tipsDescription')}
        duration={currentSimulation ? t('unlock.tipsTime') : t('unlock.tipsNeedsResult')}
        feature="energy_tips"
        icon="bulb-outline"
        active={Boolean(currentSimulation && ads.tipsUnlockedSimulationIds.includes(currentSimulation.id))}
        disabled={!currentSimulation}
      />
      <RewardedCard title={t('unlock.whatIf')} description={t('unlock.whatIfDescription')} duration={t('unlock.whatIfTime')} feature="what_if" icon="options-outline" activeUntil={ads.whatIfUnlockedUntil} />

      <Card style={styles.plus}>
        <Text style={[styles.plusTitle, { color: colors.text }]}>{t('unlock.plus')}</Text>
        <View style={[styles.soon, { backgroundColor: colors.primarySoft }]}><Text style={[styles.soonText, { color: colors.primary }]}>{t('unlock.soon')}</Text></View>
      </Card>
      <BannerAdSlot />
    </Page>
  );
}

const styles = StyleSheet.create({
  intro: { padding: 18 },
  introTitle: { fontSize: 18, fontWeight: '800' },
  introText: { fontSize: 14, lineHeight: 20, marginTop: 4 },
  plus: { minHeight: 68, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  plusTitle: { fontSize: 17, fontWeight: '800' },
  soon: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  soonText: { fontSize: 12, fontWeight: '800' },
});
