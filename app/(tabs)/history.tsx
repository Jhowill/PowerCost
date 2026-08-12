import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { BannerAdSlot } from '../../src/components/BannerAdSlot';
import { RewardedCard } from '../../src/components/RewardedCard';
import { Button, Card, EmptyState, Header, Page } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { APP_LIMITS, formatCurrency, formatDate, formatNumber } from '../../src/utils/calculation';

export default function HistoryScreen() {
  const { colors, t, history, settings, ads, extraHistoryActive, setCurrentSimulation, recalculate, deleteSimulation, clearHistory } = useApp();
  const capacity = extraHistoryActive ? APP_LIMITS.rewardedHistory : APP_LIMITS.freeHistory;

  const open = (id: string) => {
    const item = history.find((simulation) => simulation.id === id);
    if (!item) return;
    setCurrentSimulation(item);
    router.push('/result');
  };
  const recalc = (id: string) => {
    const item = history.find((simulation) => simulation.id === id);
    if (!item) return;
    recalculate(item);
    router.push('/calculate');
  };
  const confirmDelete = (id: string) => Alert.alert(t('common.delete'), t('history.clearText'), [
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('common.delete'), style: 'destructive', onPress: () => deleteSimulation(id) },
  ]);
  const confirmClear = () => Alert.alert(t('history.clearTitle'), t('history.clearText'), [
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('history.clear'), style: 'destructive', onPress: clearHistory },
  ]);

  return (
    <Page>
      <Header title={t('history.title')} subtitle={t('history.subtitle')} />
      {history.length ? (
        <>
          <View style={styles.toolbar}>
            <View style={[styles.filter, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}><Text style={[styles.filterText, { color: colors.primary }]}>{t('history.all')}</Text></View>
            <Pressable accessibilityRole="button" accessibilityLabel={t('history.clear')} onPress={confirmClear} style={styles.trash}><Ionicons name="trash-outline" size={23} color={colors.danger} /></Pressable>
          </View>
          <Card style={styles.capacityCard}>
            <View style={styles.capacityTop}>
              <View>
                <Text style={[styles.capacityTitle, { color: colors.text }]}>{t('history.capacity')}</Text>
                <Text style={[styles.capacityText, { color: colors.textMuted }]}>{t('history.capacityUsed', { used: history.length, total: capacity })}</Text>
              </View>
              {extraHistoryActive ? <View style={[styles.extraBadge, { backgroundColor: colors.primarySoft }]}><Text style={[styles.extraBadgeText, { color: colors.primary }]}>{t('history.extraActive')}</Text></View> : null}
            </View>
            <View style={[styles.capacityTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.capacityValue, { backgroundColor: colors.primary, width: `${Math.min(100, (history.length / capacity) * 100)}%` }]} />
            </View>
          </Card>
          {history.map((item) => (
            <Card key={item.id} style={styles.item}>
              <Pressable accessibilityRole="button" onPress={() => open(item.id)} style={styles.itemMain}>
                <View style={styles.itemCopy}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.input.applianceNameKey ? t(item.input.applianceNameKey) : item.input.applianceName}</Text>
                  <Text style={[styles.itemMeta, { color: colors.textMuted }]}>{formatDate(item.createdAt, settings.locale)} • {formatNumber(item.result.consumptionKwhMonth, settings.locale)} kWh</Text>
                </View>
                <Text style={[styles.itemCost, { color: colors.primary }]}>{formatCurrency(item.result.costPerMonth, settings.locale, settings.currency)}<Text style={styles.perMonth}>/{t('result.perMonth')}</Text></Text>
              </Pressable>
              <View style={[styles.actions, { borderTopColor: colors.border }]}>
                <SmallAction icon="eye-outline" label={t('common.view')} onPress={() => open(item.id)} />
                <SmallAction icon="refresh-outline" label={t('common.recalculate')} onPress={() => recalc(item.id)} />
                <SmallAction icon="trash-outline" label={t('common.delete')} onPress={() => confirmDelete(item.id)} danger />
              </View>
            </Card>
          ))}
          {history.length >= APP_LIMITS.freeHistory - 1 && !extraHistoryActive ? (
            <RewardedCard title={history.length >= APP_LIMITS.freeHistory ? t('history.limit') : t('history.almostFull')} description={t('unlock.historyDescription')} duration={t('history.unlock')} feature="extra_history_slots" icon="archive-outline" activeUntil={ads.extraHistorySlotsUntil} />
          ) : null}
          <Button label={t('compare.title')} onPress={() => router.push('/compare')} variant="outline" icon="bar-chart-outline" />
        </>
      ) : (
        <EmptyState icon="time-outline" title={t('history.emptyTitle')} text={t('history.emptyText')} action={t('home.calculateNow')} onAction={() => router.push('/calculate')} />
      )}
      <BannerAdSlot />
    </Page>
  );
}

function SmallAction({ icon, label, onPress, danger }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; danger?: boolean }) {
  const { colors } = useApp();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}>
      <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.primary} />
      <Text numberOfLines={1} style={[styles.actionText, { color: danger ? colors.danger : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbar: { minHeight: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  capacityCard: { padding: 15 },
  capacityTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  capacityTitle: { fontSize: 15, fontWeight: '800' },
  capacityText: { fontSize: 12, marginTop: 2 },
  capacityTrack: { height: 7, borderRadius: 999, overflow: 'hidden', marginTop: 12 },
  capacityValue: { height: '100%', borderRadius: 999 },
  extraBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  extraBadgeText: { fontSize: 11, fontWeight: '800' },
  filter: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 7 },
  filterText: { fontSize: 14, fontWeight: '800' },
  trash: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  item: { padding: 0, overflow: 'hidden' },
  itemMain: { minHeight: 82, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, paddingVertical: 13, gap: 12 },
  itemCopy: { flex: 1 },
  itemName: { fontSize: 17, lineHeight: 23, fontWeight: '800' },
  itemMeta: { fontSize: 13, lineHeight: 19, marginTop: 2 },
  itemCost: { maxWidth: '45%', fontSize: 16, fontWeight: '900', textAlign: 'right' },
  perMonth: { fontSize: 9 },
  actions: { flexDirection: 'row', minHeight: 48, borderTopWidth: StyleSheet.hairlineWidth },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
  actionText: { fontSize: 11, fontWeight: '700' },
});
