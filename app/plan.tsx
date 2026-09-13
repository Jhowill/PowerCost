import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BannerAdSlot } from '../src/components/BannerAdSlot';
import { Button, Card, EmptyState, Field, Header, Page, SectionLabel } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';
import { formatCurrency, formatNumber, parseDecimal } from '../src/utils/calculation';

const ACTIONS = [
  { id: 'standby', label: 'plan.actionStandby' },
  { id: 'schedule', label: 'plan.actionSchedule' },
  { id: 'temperature', label: 'plan.actionTemperature' },
  { id: 'lighting', label: 'plan.actionLighting' },
] as const;

export default function PlanScreen() {
  const { colors, t, history, settings, plan, updatePlan } = useApp();
  const [targetText, setTargetText] = useState(plan.targetMonthlyCost ? String(plan.targetMonthlyCost).replace('.', ',') : '');
  const [measuredKwhText, setMeasuredKwhText] = useState(plan.measuredMonthlyKwh ? String(plan.measuredMonthlyKwh).replace('.', ',') : '');
  const [measuredCostText, setMeasuredCostText] = useState(plan.measuredMonthlyCost ? String(plan.measuredMonthlyCost).replace('.', ',') : '');
  const planMatchesCurrency = plan.currency === settings.currency;
  useEffect(() => {
    if (!planMatchesCurrency) {
      setTargetText('');
      setMeasuredKwhText('');
      setMeasuredCostText('');
    }
  }, [planMatchesCurrency]);
  const estimates = useMemo(() => history.filter((item) => item.currency === settings.currency), [history, settings.currency]);
  const total = estimates.reduce((sum, item) => sum + item.result.costPerMonth, 0);
  const rooms = useMemo(() => {
    const grouped = new Map<string, number>();
    estimates.forEach((item) => {
      const room = item.input.room?.trim() || t('plan.unassigned');
      grouped.set(room, (grouped.get(room) ?? 0) + item.result.costPerMonth);
    });
    return [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  }, [estimates, t]);
  const target = planMatchesCurrency ? plan.targetMonthlyCost : undefined;
  const gap = target ? total - target : 0;
  const savePlan = () => {
    const targetValue = parseDecimal(targetText);
    const kwhValue = parseDecimal(measuredKwhText);
    const costValue = parseDecimal(measuredCostText);
    updatePlan({
      targetMonthlyCost: Number.isFinite(targetValue) && targetValue > 0 ? targetValue : undefined,
      measuredMonthlyKwh: Number.isFinite(kwhValue) && kwhValue > 0 ? kwhValue : undefined,
      measuredMonthlyCost: Number.isFinite(costValue) && costValue > 0 ? costValue : undefined,
    });
  };
  const toggleAction = (id: string) => updatePlan({ actions: plan.actions.includes(id) ? plan.actions.filter((item) => item !== id) : [...plan.actions, id] });

  return (
    <Page>
      <Header title={t('plan.title')} subtitle={t('plan.subtitle')} back onBack={() => router.back()} />
      <Card tone="primary" style={styles.summary}>
        <Text style={[styles.summaryLabel, { color: colors.text }]}>{t('plan.estimate')}</Text>
        <Text style={[styles.summaryValue, { color: colors.primary }]}>{formatCurrency(total, settings.locale, settings.currency)}{t('plan.perMonth')}</Text>
        <Text style={[styles.summaryText, { color: colors.textMuted }]}>
          {target ? (gap > 0 ? t('plan.aboveTarget', { value: formatCurrency(gap, settings.locale, settings.currency) }) : t('plan.withinTarget')) : t('plan.noTarget')}
        </Text>
      </Card>

      <SectionLabel>{t('plan.measurement')}</SectionLabel>
      {!planMatchesCurrency ? <Card style={styles.comparison}><Text style={[styles.cardText, { color: colors.textMuted }]}>{t('plan.currencyChanged')}</Text></Card> : null}
      <Card style={styles.form}>
        <Text style={[styles.formHint, { color: colors.textMuted }]}>{t('plan.measurementHint')}</Text>
        <Field label={t('plan.target')} value={targetText} onChangeText={setTargetText} keyboardType="decimal-pad" unit={settings.currency} />
        <Field label={t('plan.measuredKwh')} value={measuredKwhText} onChangeText={setMeasuredKwhText} keyboardType="decimal-pad" unit="kWh" />
        <Field label={t('plan.measuredCost')} value={measuredCostText} onChangeText={setMeasuredCostText} keyboardType="decimal-pad" unit={settings.currency} />
        <Button label={t('plan.save')} onPress={savePlan} icon="save-outline" />
      </Card>

      {planMatchesCurrency && (plan.measuredMonthlyKwh || plan.measuredMonthlyCost) ? (
        <Card style={styles.comparison}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('plan.invoiceComparison')}</Text>
          {plan.measuredMonthlyKwh ? <Text style={[styles.cardText, { color: colors.textMuted }]}>{t('plan.measuredKwhValue', { value: formatNumber(plan.measuredMonthlyKwh, settings.locale, 1) })}</Text> : null}
          {plan.measuredMonthlyCost ? <Text style={[styles.cardText, { color: colors.textMuted }]}>{t('plan.measuredCostValue', { value: formatCurrency(plan.measuredMonthlyCost, settings.locale, settings.currency) })}</Text> : null}
          <Text style={[styles.cardText, { color: colors.textMuted }]}>{t('plan.unexplained', { value: formatCurrency(Math.abs((plan.measuredMonthlyCost ?? total) - total), settings.locale, settings.currency) })}</Text>
        </Card>
      ) : null}

      <SectionLabel>{t('plan.rooms')}</SectionLabel>
      {rooms.length ? rooms.map(([room, value]) => (
        <Card key={room} style={styles.roomCard}>
          <View style={[styles.roomIcon, { backgroundColor: colors.primarySoft }]}><Ionicons name="home-outline" size={21} color={colors.primary} /></View>
          <View style={styles.roomCopy}><Text style={[styles.roomName, { color: colors.text }]}>{room}</Text><Text style={[styles.cardText, { color: colors.textMuted }]}>{formatCurrency(value, settings.locale, settings.currency)}{t('plan.perMonth')}</Text></View>
        </Card>
      )) : <EmptyState icon="home-outline" title={t('plan.emptyTitle')} text={t('plan.emptyText')} action={t('plan.add')} onAction={() => router.push('/calculate')} />}

      <SectionLabel>{t('plan.actions')}</SectionLabel>
      <Card style={styles.actions}>
        {ACTIONS.map((action) => {
          const selected = plan.actions.includes(action.id);
          return <Pressable key={action.id} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggleAction(action.id)} style={styles.actionRow}>
            <Ionicons name={selected ? 'checkbox' : 'square-outline'} size={25} color={selected ? colors.primary : colors.textMuted} />
            <Text style={[styles.actionText, { color: colors.text }]}>{t(action.label)}</Text>
          </Pressable>;
        })}
      </Card>
      <BannerAdSlot />
    </Page>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 20 },
  summaryLabel: { fontSize: 15, fontWeight: '800' },
  summaryValue: { fontSize: 28, lineHeight: 36, fontWeight: '900', marginTop: 4 },
  summaryText: { fontSize: 14, lineHeight: 20, marginTop: 5 },
  form: { padding: 17 },
  formHint: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  comparison: { padding: 17 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardText: { fontSize: 14, lineHeight: 20, marginTop: 3 },
  roomCard: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 12 },
  roomIcon: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  roomCopy: { flex: 1 },
  roomName: { fontSize: 16, fontWeight: '800' },
  actions: { padding: 8 },
  actionRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 8 },
  actionText: { flex: 1, fontSize: 15, fontWeight: '700' },
});
