import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Choice, Field, Header, Page, SectionLabel } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { APPLIANCES } from '../../src/data/appliances';
import { Appliance } from '../../src/types';
import { formatCurrencySymbol, parseDecimal } from '../../src/utils/calculation';

export default function CalculateScreen() {
  const { colors, t, draft, setDraft, completeCalculation, settings, setDefaultTariff } = useApp();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState(draft.applianceNameKey ? '' : draft.applianceName);
  const [powerText, setPowerText] = useState(draft.powerWatts ? String(draft.powerWatts) : '');
  const [tariffText, setTariffText] = useState(String(draft.tariffPerKwh || settings.defaultTariffPerKwh || 0.9).replace('.', ','));
  const [hoursCustom, setHoursCustom] = useState('');
  const [daysCustom, setDaysCustom] = useState('');
  const [saveTariff, setSaveTariff] = useState(false);
  const [error, setError] = useState('');

  const appliances = useMemo(() => APPLIANCES.filter((item) => t(item.nameKey).toLocaleLowerCase(settings.locale).includes(search.toLocaleLowerCase(settings.locale))), [search, settings.locale, t]);
  const selected = APPLIANCES.find((item) => item.id === draft.applianceId);

  const selectAppliance = (appliance: Appliance) => {
    setError('');
    setDraft((value) => ({
      ...value,
      applianceId: appliance.id,
      applianceNameKey: appliance.id === 'other' ? undefined : appliance.nameKey,
      applianceName: appliance.id === 'other' ? customName : t(appliance.nameKey),
      powerWatts: appliance.defaultPowerWatts ?? 0,
    }));
    setPowerText(appliance.defaultPowerWatts ? String(appliance.defaultPowerWatts) : '');
  };

  const goNext = () => {
    setError('');
    if (step === 1) {
      if (!selected) return setError(t('error.selectAppliance'));
      if (selected.id === 'other' && !customName.trim()) return setError(t('error.customName'));
      if (selected.id === 'other') setDraft((value) => ({ ...value, applianceName: customName.trim() }));
      setStep(2);
      return;
    }
    if (step === 2) {
      const power = parseDecimal(powerText);
      if (!Number.isFinite(power) || power <= 0) return setError(t('error.power'));
      setDraft((value) => ({ ...value, powerWatts: power }));
      setStep(3);
    }
  };

  const calculate = () => {
    setError('');
    const tariff = parseDecimal(tariffText);
    const hours = hoursCustom ? parseDecimal(hoursCustom) : draft.hoursPerDay;
    const days = daysCustom ? parseDecimal(daysCustom) : draft.daysPerMonth;
    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) return setError(t('error.hours'));
    if (!Number.isInteger(days) || days < 1 || days > 31) return setError(t('error.days'));
    if (!Number.isFinite(tariff) || tariff <= 0) return setError(t('error.tariff'));
    const input = { ...draft, powerWatts: parseDecimal(powerText), hoursPerDay: hours, daysPerMonth: days, tariffPerKwh: tariff };
    setDraft(input);
    if (saveTariff) setDefaultTariff(tariff);
    completeCalculation(input);
    router.push('/result');
  };

  const goBack = () => {
    setError('');
    if (step > 1) setStep((value) => value - 1);
    else router.replace('/');
  };

  return (
    <Page>
      <Header title={t('calculate.title')} subtitle={t('calculate.step', { current: step })} back onBack={goBack} />
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}><View style={[styles.progressValue, { backgroundColor: colors.primary, width: `${step * 33.333}%` }]} /></View>

      {step === 1 ? (
        <>
          <Text style={[styles.question, { color: colors.text }]}>{t('calculate.applianceQuestion')}</Text>
          <Field label={t('calculate.search')} value={search} onChangeText={setSearch} placeholder={t('calculate.search')} />
          <SectionLabel>{t('calculate.mostUsed')}</SectionLabel>
          {appliances.map((appliance) => (
            <Choice
              key={appliance.id}
              title={t(appliance.nameKey)}
              subtitle={t(appliance.categoryKey)}
              icon={appliance.icon as keyof typeof Ionicons.glyphMap}
              selected={draft.applianceId === appliance.id}
              onPress={() => selectAppliance(appliance)}
              compact
            />
          ))}
          {selected?.id === 'other' ? (
            <Field
              label={t('calculate.customName')}
              value={customName}
              onChangeText={(value) => { setCustomName(value); setDraft((draftValue) => ({ ...draftValue, applianceName: value })); }}
              autoFocus
            />
          ) : null}
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Text style={[styles.question, { color: colors.text }]}>{t('calculate.powerQuestion')}</Text>
          <Text style={[styles.help, { color: colors.textMuted }]}>{t('calculate.powerHelp')}</Text>
          <Field label={t('calculate.powerLabel')} value={powerText} onChangeText={setPowerText} keyboardType="decimal-pad" unit="W" error={error || undefined} />
          <Card tone="primary" style={styles.example}>
            <Text style={[styles.exampleLabel, { color: colors.text }]}>{t('calculate.example')}</Text>
            <Text style={[styles.exampleValue, { color: colors.primary }]}>{t('calculate.exampleText')}</Text>
          </Card>
          {selected?.defaultPowerWatts ? (
            <Button label={t('calculate.dontKnow')} onPress={() => { setPowerText(String(selected.defaultPowerWatts)); setError(''); }} variant="outline" icon="help-circle-outline" />
          ) : null}
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Text style={[styles.question, { color: colors.text }]}>{t('calculate.usageQuestion')}</Text>
          <View style={styles.grid}>
            {[0.5, 1, 2, 4, 8, 24].map((hours) => (
              <QuickSelect
                key={hours}
                label={hours === 0.5 ? t('calculate.halfHour') : hours === 1 ? t('calculate.oneHour') : hours === 24 ? t('calculate.allDay') : t('calculate.hours', { count: hours })}
                selected={!hoursCustom && draft.hoursPerDay === hours}
                onPress={() => { setHoursCustom(''); setDraft((value) => ({ ...value, hoursPerDay: hours })); }}
              />
            ))}
          </View>
          <Field label={t('calculate.custom')} value={hoursCustom} onChangeText={setHoursCustom} keyboardType="decimal-pad" unit="h" />

          <SectionLabel>{t('calculate.daysQuestion')}</SectionLabel>
          <Choice title={t('calculate.everyDay')} subtitle={t('calculate.daysCount', { count: 30 })} selected={!daysCustom && draft.daysPerMonth === 30} onPress={() => { setDaysCustom(''); setDraft((value) => ({ ...value, daysPerMonth: 30 })); }} compact />
          <Choice title={t('calculate.workDays')} subtitle={t('calculate.daysCount', { count: 22 })} selected={!daysCustom && draft.daysPerMonth === 22} onPress={() => { setDaysCustom(''); setDraft((value) => ({ ...value, daysPerMonth: 22 })); }} compact />
          <Field label={t('calculate.custom')} value={daysCustom} onChangeText={setDaysCustom} keyboardType="number-pad" unit={t('calculate.daysCount', { count: '' }).trim()} />

          <Field label={t('calculate.tariffQuestion')} value={tariffText} onChangeText={setTariffText} keyboardType="decimal-pad" unit={`${formatCurrencySymbol(settings.currency)}/kWh`} />
          <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: saveTariff }} onPress={() => setSaveTariff((value) => !value)} style={styles.checkboxRow}>
            <Ionicons name={saveTariff ? 'checkbox' : 'square-outline'} size={27} color={colors.primary} />
            <Text style={[styles.checkboxText, { color: colors.text }]}>{t('calculate.saveTariff')}</Text>
          </Pressable>
        </>
      ) : null}

      {error && step !== 2 ? <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
      <Button label={step === 3 ? t('calculate.calculate') : t('common.next')} onPress={step === 3 ? calculate : goNext} icon={step === 3 ? 'calculator-outline' : 'arrow-forward'} style={styles.bottomButton} />
    </Page>
  );
}

function QuickSelect({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useApp();
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.quick, { backgroundColor: selected ? colors.primarySoft : colors.surface, borderColor: selected ? colors.primary : colors.border, opacity: pressed ? 0.7 : 1 }]}>
      <Text style={[styles.quickText, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  progressTrack: { height: 5, borderRadius: 999, overflow: 'hidden', marginBottom: 22 },
  progressValue: { height: '100%', borderRadius: 999 },
  question: { fontSize: 22, lineHeight: 29, fontWeight: '800', marginBottom: 13 },
  help: { fontSize: 15, lineHeight: 21, marginTop: -8, marginBottom: 18 },
  example: { padding: 18 },
  exampleLabel: { fontSize: 15, fontWeight: '800' },
  exampleValue: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  quick: { width: '48%', flexGrow: 1, minHeight: 54, borderWidth: 1.5, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  quickText: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  checkboxRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkboxText: { flex: 1, fontSize: 16, fontWeight: '700' },
  error: { fontSize: 15, lineHeight: 21, fontWeight: '700', marginTop: 4 },
  bottomButton: { marginTop: 22 },
});
