import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button, Card, Field, Header, Page, SectionLabel } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';
import { CurrencyCode, EnergyPlanPeriod } from '../src/types';
import { formatCurrency, formatNumber, parseDecimal } from '../src/utils/calculation';
import { localMonth, validMonth } from '../src/utils/persistence';

const ACTIONS = ['standby', 'schedule', 'temperature', 'lighting'] as const;
const ACTION_KEYS = ['plan.actionStandby', 'plan.actionSchedule', 'plan.actionTemperature', 'plan.actionLighting'];

export default function PlanScreen() {
  const { colors, t, settings, plan, history, updatePlan, recalculate, resetCalculation, storageError } = useApp();
  const [month, setMonth] = useState(localMonth);
  const [unit, setUnit] = useState<CurrencyCode>(settings.currency);
  const [targetText, setTarget] = useState('');
  const [kwhText, setKwh] = useState('');
  const [costText, setCost] = useState('');
  const [error, setError] = useState('');
  const [showImport, setShowImport] = useState(false);
  const period = plan.periods.find((p) => p.id === month && p.currency === unit);
  useEffect(() => {
    setTarget(String(period ? period.targetMonthlyCost ?? '' : plan.targets[unit] ?? ''));
    setKwh(String(period?.measuredMonthlyKwh ?? ''));
    setCost(String(period?.measuredMonthlyCost ?? ''));
    setError('');
  }, [month, unit, period, plan.targets]);

  const appliances = plan.appliances;
  const priced = appliances.filter((a) => a.currency === unit);
  const total = priced.reduce((sum, a) => sum + a.result.costPerMonth, 0);
  const totalKwh = appliances.reduce((sum, a) => sum + a.result.consumptionKwhMonth, 0);
  const money = (value: number, currency = unit) => formatCurrency(value, settings.locale, currency);
  const num = (value: number) => formatNumber(value, settings.locale, 1);
  const monthLabel = (id: string) => validMonth(id)
    ? new Intl.DateTimeFormat(settings.locale, { month: 'long', year: 'numeric' }).format(new Date(Number(id.slice(0, 4)), Number(id.slice(5, 7)) - 1, 15))
    : id;
  const sorted = [...plan.periods].sort((a, b) => b.id.localeCompare(a.id) || a.currency.localeCompare(b.currency));
  const previous = period ? sorted.find((p) => p.id < period.id && p.currency === period.currency) : undefined;
  const target = plan.targets[unit];
  const rooms = new Map<string, { cost: number; kwh: number }>();
  for (const a of appliances) {
    const name = a.input.room || t('plan.unassigned');
    const current = rooms.get(name) ?? { cost: 0, kwh: 0 };
    rooms.set(name, { cost: current.cost + (a.currency === unit ? a.result.costPerMonth : 0), kwh: current.kwh + a.result.consumptionKwhMonth });
  }
  const parseOptional = (text: string) => text.trim() ? parseDecimal(text) : undefined;
  const save = () => {
    const goal = parseOptional(targetText), kwh = parseOptional(kwhText), cost = parseOptional(costText);
    if (!validMonth(month) || [goal, kwh, cost].some((v) => v !== undefined && (!Number.isFinite(v) || v < 0 || v > 1e12)) || goal === 0) {
      setError(t('house.invalid')); return;
    }
    const hasBill = kwh !== undefined || cost !== undefined;
    const next: EnergyPlanPeriod = {
      id: month, label: month, currency: unit, targetMonthlyCost: goal,
      measuredMonthlyKwh: kwh, measuredMonthlyCost: cost,
      estimatedKwh: period ? period.estimatedKwh : totalKwh,
      estimatedCost: period ? period.estimatedCost : total,
      actions: period?.actions ?? [...plan.actions],
      createdAt: period?.createdAt ?? new Date().toISOString(),
    };
    if (period && !hasBill) { setError(t('house.invalid')); return; }
    updatePlan({
      currency: unit, targetMonthlyCost: goal,
      targets: { ...plan.targets, [unit]: goal },
      periods: hasBill ? [next, ...plan.periods.filter((p) => !(p.id === month && p.currency === unit))] : plan.periods,
    });
    setError('');
    Alert.alert(t('common.done'));
  };
  const removePeriod = (p: EnergyPlanPeriod) => Alert.alert(t('house.remove'), monthLabel(p.id) + ' · ' + p.currency, [
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('house.remove'), style: 'destructive', onPress: () => updatePlan({ periods: plan.periods.filter((v) => !(v.id === p.id && v.currency === p.currency)) }) },
  ]);
  const textStyle = { color: colors.text, fontSize: 15, lineHeight: 23 };
  return <Page>
    <Header title={t('plan.title')} subtitle={t('house.independent')} back onBack={() => router.back()} />
    <Card tone="primary">
      <Text style={textStyle}>{t('plan.estimate')}</Text>
      <Text style={{ color: colors.primary, fontSize: 30, fontWeight: '800' }}>{money(total)}</Text>
      <Text style={textStyle}>{num(totalKwh)} kWh/{t('result.perMonth')}</Text>
      <Text style={textStyle}>{t('house.allCurrencies', { currency: unit })}</Text>
      {target !== undefined ? <Text style={textStyle}>{total > target ? t('plan.aboveTarget', { value: money(total - target) }) : t('plan.withinTarget')}</Text> : null}
    </Card>

    {rooms.size ? <Card>
      <SectionLabel>{t('plan.rooms')}</SectionLabel>
      {[...rooms.entries()].map(([name, values]) => <Text key={name} style={textStyle}>{name}: {num(values.kwh)} kWh · {money(values.cost)}</Text>)}
    </Card> : null}
    <SectionLabel>{t('house.inventory')}</SectionLabel>
    {!appliances.length ? <Text style={textStyle}>{t('house.empty')}</Text> : null}
    {appliances.map((a) => <Card key={a.id}>
      <Text style={{ ...textStyle, fontWeight: '800' }}>{a.input.applianceNameKey ? t(a.input.applianceNameKey) : a.input.applianceName}</Text>
      <Text style={textStyle}>{a.input.room || t('plan.unassigned')} · {a.input.quantity ?? 1} × {a.input.powerWatts} W</Text>
      <Text style={textStyle}>{num(a.result.consumptionKwhMonth)} kWh · {money(a.result.costPerMonth, a.currency)}</Text>
      <Button label={t('house.edit')} disabled={storageError} variant="outline" onPress={() => {
        recalculate({ ...a, input: { ...a.input, householdId: a.id } }); router.push('/calculate');
      }} />
      <Button label={t('house.remove')} disabled={storageError} variant="ghost" onPress={() => Alert.alert(t('house.remove'), t('house.confirmRemove'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('house.remove'), style: 'destructive', onPress: () => updatePlan({ appliances: appliances.filter((v) => v.id !== a.id) }) },
      ])} />
    </Card>)}
    <Button label={t('plan.add')} disabled={storageError} icon="add-circle-outline" onPress={() => { resetCalculation(); router.push('/calculate'); }} />
    <Button label={t('house.import')} disabled={storageError} variant="outline" onPress={() => setShowImport((v) => !v)} />
    {showImport ? <Card>
      <Text style={textStyle}>{t('house.importHint')}</Text>
      {history.map((a) => {
        const id = a.input.householdId ?? a.id;
        return <Button key={a.id} disabled={appliances.some((v) => v.id === id) || storageError}
          label={a.input.applianceNameKey ? t(a.input.applianceNameKey) : a.input.applianceName} variant="outline"
          onPress={() => updatePlan({ appliances: [{ ...a, id, input: { ...a.input, householdId: id } }, ...appliances.filter((v) => v.id !== id)] })} />;
      })}
    </Card> : null}

    <SectionLabel>{t('plan.actions')}</SectionLabel>
    <Card>{ACTIONS.map((id, index) => <Pressable key={id} disabled={storageError} accessibilityRole="checkbox"
      accessibilityState={{ checked: plan.actions.includes(id) }} style={{ flexDirection: 'row', gap: 10, paddingVertical: 12 }}
      onPress={() => updatePlan({ actions: plan.actions.includes(id) ? plan.actions.filter((v) => v !== id) : [...plan.actions, id] })}>
      <Ionicons name={plan.actions.includes(id) ? 'checkbox' : 'square-outline'} size={24} color={colors.primary} />
      <Text style={{ ...textStyle, flex: 1 }}>{t(ACTION_KEYS[index])}</Text>
    </Pressable>)}
    <Text style={textStyle}>{t('house.actionsSnapshot')}</Text></Card>

    <SectionLabel>{t('plan.measurement')}</SectionLabel>
    <Card>
      <Field label={t('house.period')} value={month} onChangeText={setMonth} placeholder="YYYY-MM" />
      <Text style={textStyle}>{t('house.periodHelp')}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>{(['BRL', 'USD', 'EUR'] as const).map((c) =>
        <Button key={c} label={c} variant={c === unit ? 'primary' : 'outline'} onPress={() => setUnit(c)} />)}</View>
      <Field label={t('plan.target')} value={targetText} onChangeText={setTarget} keyboardType="decimal-pad" unit={unit} />
      <Field label={t('plan.measuredKwh')} value={kwhText} onChangeText={setKwh} keyboardType="decimal-pad" unit="kWh" />
      <Field label={t('plan.measuredCost')} value={costText} onChangeText={setCost} keyboardType="decimal-pad" unit={unit} />
      {error ? <Text accessibilityLiveRegion="polite" style={{ color: colors.danger }}>{error}</Text> : null}
      <Text style={textStyle}>{t('house.estimateSnapshot')}</Text>
      <Button label={t('plan.save')} onPress={save} disabled={storageError} />
    </Card>

    {period ? <Card>
      <Text style={{ ...textStyle, fontWeight: '800' }}>{t('plan.invoiceComparison')} · {monthLabel(period.id)}</Text>
      {period.targetMonthlyCost !== undefined ? <Text style={textStyle}>{t('plan.target')}: {money(period.targetMonthlyCost)}</Text> : null}
      {period.measuredMonthlyKwh !== undefined && period.estimatedKwh !== undefined ?
        <Text style={textStyle}>{t('house.differenceKwh', { value: num(period.measuredMonthlyKwh - period.estimatedKwh) })}</Text> : null}
      {period.measuredMonthlyCost !== undefined && period.estimatedCost !== undefined ?
        <Text style={textStyle}>{t('house.differenceCost', { value: money(period.measuredMonthlyCost - period.estimatedCost) })}</Text> : null}
      {period.estimatedKwh === undefined && period.estimatedCost === undefined ? <Text style={textStyle}>{t('house.missingComparison')}</Text> : null}
      {previous?.measuredMonthlyKwh !== undefined && period.measuredMonthlyKwh !== undefined ?
        <Text style={textStyle}>{t('house.previousKwh', { value: num(period.measuredMonthlyKwh - previous.measuredMonthlyKwh), period: monthLabel(previous.id) })}</Text> : null}
      {previous?.measuredMonthlyCost !== undefined && period.measuredMonthlyCost !== undefined ?
        <Text style={textStyle}>{t('house.previousCost', { value: money(period.measuredMonthlyCost - previous.measuredMonthlyCost), period: monthLabel(previous.id) })}</Text> : null}
      <Text style={textStyle}>{t('house.actionsCount', { count: period.actions.length })}</Text>
      {period.actions.map((id) => { const index = ACTIONS.indexOf(id as typeof ACTIONS[number]); return index >= 0 ? <Text key={id} style={textStyle}>{t(ACTION_KEYS[index])}</Text> : null; })}
    </Card> : null}
    <SectionLabel>{t('plan.periods')}</SectionLabel>
    <Text style={textStyle}>{t('house.periodsHint')}</Text>
    {sorted.map((p) => <Card key={p.id + p.currency}>
      <Text style={{ ...textStyle, fontWeight: '800' }}>{monthLabel(p.id)} · {p.currency}</Text>
      {p.measuredMonthlyKwh !== undefined ? <Text style={textStyle}>{num(p.measuredMonthlyKwh)} kWh</Text> : null}
      {p.measuredMonthlyCost !== undefined ? <Text style={textStyle}>{money(p.measuredMonthlyCost, p.currency)}</Text> : null}
      <Button label={t('house.edit')} variant="outline" onPress={() => { setMonth(p.id); setUnit(p.currency); }} />
      <Button label={t('house.remove')} variant="ghost" disabled={storageError} onPress={() => removePeriod(p)} />
    </Card>)}
  </Page>;
}
