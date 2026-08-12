import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { BannerAdSlot } from '../../src/components/BannerAdSlot';
import { RewardedCard } from '../../src/components/RewardedCard';
import { Button, Card, Field, Header, OptionModal, Page, SectionLabel, SettingRow } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { AppTheme, SupportedLocale } from '../../src/types';
import { formatCurrency, formatCurrencySymbol, parseDecimal } from '../../src/utils/calculation';

const localeNames: Record<SupportedLocale, string> = { 'pt-BR': 'Português', 'en-US': 'English', 'es-ES': 'Español', 'fr-FR': 'Français' };

export default function SettingsScreen() {
  const { colors, t, settings, ads, setLocale, setTheme, setDefaultTariff, clearHistory, clearAllLocalData, openAdsPrivacyOptions } = useApp();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [tariffText, setTariffText] = useState(String(settings.defaultTariffPerKwh ?? 0.9).replace('.', ','));

  const saveTariff = () => {
    const tariff = parseDecimal(tariffText);
    if (!Number.isFinite(tariff) || tariff <= 0) {
      Alert.alert(t('error.tariff'));
      return;
    }
    setDefaultTariff(tariff);
    Alert.alert(t('common.done'));
  };
  const confirmClear = () => Alert.alert(t('history.clearTitle'), t('history.clearText'), [
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('history.clear'), style: 'destructive', onPress: clearHistory },
  ]);
  const confirmDeleteAll = () => Alert.alert(t('settings.deleteAllTitle'), t('settings.deleteAllText'), [
    { text: t('common.cancel'), style: 'cancel' },
    {
      text: t('settings.deleteAllData'),
      style: 'destructive',
      onPress: () => void clearAllLocalData()
        .then(() => Alert.alert(t('settings.dataDeleted')))
        .catch(() => Alert.alert(t('settings.deleteAllError'))),
    },
  ]);
  const themeLabel = settings.theme === 'system' ? t('settings.system') : settings.theme === 'light' ? t('settings.light') : t('settings.dark');

  return (
    <Page>
      <Header title={t('settings.title')} subtitle={t('settings.subtitle')} />
      <SectionLabel>{t('settings.general')}</SectionLabel>
      <Card style={styles.group}>
        <SettingRow label={t('settings.language')} value={localeNames[settings.locale]} onPress={() => setLanguageOpen(true)} />
        <SettingRow label={t('settings.theme')} value={themeLabel} onPress={() => setThemeOpen(true)} />
        <SettingRow label={t('settings.defaultTariff')} value={settings.defaultTariffPerKwh ? `${formatCurrency(settings.defaultTariffPerKwh, settings.locale, settings.currency)}/kWh` : '—'} />
        <Field label={t('settings.defaultTariff')} value={tariffText} onChangeText={setTariffText} keyboardType="decimal-pad" unit={`${formatCurrencySymbol(settings.currency)}/kWh`} />
        <Button label={t('settings.saveTariff')} onPress={saveTariff} icon="save-outline" />
      </Card>

      <SectionLabel>{t('settings.ads')}</SectionLabel>
      <RewardedCard title={t('settings.removeAds')} duration={t('unlock.adFreeTime')} feature="ad_free" activeUntil={ads.adFreeUntil} />
      <Button label={t('unlock.title')} onPress={() => router.push('/unlock')} variant="outline" icon="gift-outline" />
      <Button
        label={t('settings.adPrivacy')}
        onPress={() => void openAdsPrivacyOptions().then((success) => {
          if (!success) Alert.alert(t('ads.privacyUnavailable'));
        })}
        variant="ghost"
        icon="shield-checkmark-outline"
      />
      <BannerAdSlot />

      <SectionLabel>{t('settings.other')}</SectionLabel>
      <Card style={styles.group}>
        <SettingRow label={t('settings.about')} onPress={() => Alert.alert(t('settings.about'), t('settings.aboutText'))} />
        <SettingRow label={t('settings.privacy')} onPress={() => router.push('/privacy')} />
        <SettingRow label={t('settings.terms')} onPress={() => router.push('/terms')} />
        <SettingRow label={t('settings.clearHistory')} onPress={confirmClear} danger />
        <SettingRow label={t('settings.deleteAllData')} onPress={confirmDeleteAll} danger />
        <SettingRow label={t('settings.version')} value={Constants.expoConfig?.version ?? '1.0.0'} />
      </Card>
      <OptionModal
        visible={languageOpen}
        title={t('settings.language')}
        selected={settings.locale}
        options={(Object.entries(localeNames) as [SupportedLocale, string][]).map(([value, label]) => ({ value, label }))}
        onSelect={(value) => setLocale(value as SupportedLocale)}
        onClose={() => setLanguageOpen(false)}
      />
      <OptionModal
        visible={themeOpen}
        title={t('settings.theme')}
        selected={settings.theme}
        options={[
          { value: 'system', label: t('settings.system') },
          { value: 'light', label: t('settings.light') },
          { value: 'dark', label: t('settings.dark') },
        ]}
        onSelect={(value) => setTheme(value as AppTheme)}
        onClose={() => setThemeOpen(false)}
      />
      <Text style={[styles.note, { color: colors.textMuted }]}>{t('result.approx')}</Text>
    </Page>
  );
}

const styles = StyleSheet.create({
  group: { paddingVertical: 4, paddingHorizontal: 17 },
  note: { fontSize: 12, textAlign: 'center', marginTop: 18 },
});
