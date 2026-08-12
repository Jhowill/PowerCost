import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BannerAdSlot } from '../../src/components/BannerAdSlot';
import { NativeAdSlot } from '../../src/components/NativeAdSlot';
import { Button, Card, Header, Page } from '../../src/components/ui';
import { useApp } from '../../src/context/AppContext';
import { formatCurrency } from '../../src/utils/calculation';

export default function HomeScreen() {
  const { colors, t, history, currentSimulation, settings, resetCalculation, setCurrentSimulation } = useApp();
  const last = history[0] ?? currentSimulation;
  const calculate = () => {
    resetCalculation();
    router.push('/calculate');
  };
  const openLast = () => {
    if (!last) return;
    setCurrentSimulation(last);
    router.push('/result');
  };
  return (
    <Page>
      <Header title="PowerCost" subtitle={t('home.subtitle')} />

      <Card tone="primary" style={styles.hero}>
        <View style={styles.heroHeading}>
          <View style={[styles.heroIcon, { backgroundColor: colors.surface }]}><Ionicons name="flash" size={25} color={colors.primary} /></View>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroTitle, { color: colors.text }]}>{t('home.heroTitle')}</Text>
            <Text style={[styles.heroText, { color: colors.textMuted }]}>{t('home.heroText')}</Text>
          </View>
        </View>
        <Button label={t('home.calculateNow')} onPress={calculate} icon="calculator-outline" />
      </Card>

      <View style={styles.quickRow}>
        <QuickCard icon="time-outline" title={t('home.history')} subtitle={t('home.historyHint')} onPress={() => router.push('/history')} />
        <QuickCard icon="bar-chart-outline" title={t('home.compare')} subtitle={t('home.compareHint')} onPress={() => router.push('/compare')} />
      </View>

      {last ? (
        <Pressable accessibilityRole="button" onPress={openLast}>
          <Card style={styles.lastCard}>
            <View style={styles.lastCopy}>
              <Text style={[styles.tipTitle, { color: colors.text }]}>{t('home.lastTitle')}</Text>
              <Text style={[styles.lastName, { color: colors.text }]}>{last.input.applianceNameKey ? t(last.input.applianceNameKey) : last.input.applianceName}</Text>
            </View>
            <Text style={[styles.lastCost, { color: colors.primary }]}>{formatCurrency(last.result.costPerMonth, settings.locale, settings.currency)}</Text>
          </Card>
        </Pressable>
      ) : null}

      <Card tone="reward" style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={26} color={colors.warning} />
        <View style={styles.tipCopy}>
          <Text style={[styles.tipTitle, { color: colors.text }]}>{t('home.tipTitle')}</Text>
          <Text style={[styles.tipText, { color: colors.textMuted }]}>{t('home.tip')}</Text>
        </View>
      </Card>
      <NativeAdSlot />
      <BannerAdSlot />
    </Page>
  );
}

function QuickCard({ icon, title, subtitle, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  const { colors } = useApp();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quick, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}>
      <Ionicons name={icon} size={23} color={colors.primary} />
      <Text style={[styles.quickTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.quickText, { color: colors.textMuted }]}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 22 },
  heroHeading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  heroIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  heroCopy: { flex: 1 },
  heroTitle: { fontSize: 21, lineHeight: 27, fontWeight: '800' },
  heroText: { fontSize: 15, lineHeight: 21, marginTop: 2 },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  quick: { flex: 1, minHeight: 112, borderWidth: 1, borderRadius: 18, padding: 15, justifyContent: 'center' },
  quickTitle: { fontSize: 17, fontWeight: '800', marginTop: 7 },
  quickText: { fontSize: 13, marginTop: 2 },
  lastCard: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  lastCopy: { flex: 1 },
  lastName: { fontSize: 16, marginTop: 3 },
  lastCost: { fontSize: 18, fontWeight: '800' },
  tipCard: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 12 },
  tipCopy: { flex: 1 },
  tipTitle: { fontSize: 16, fontWeight: '800' },
  tipText: { fontSize: 14, lineHeight: 20, marginTop: 2 },
});
