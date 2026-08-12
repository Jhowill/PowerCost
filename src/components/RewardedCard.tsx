import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { RewardedFeature } from '../types';
import { Button, Card } from './ui';

export function RewardedCard({ title, description, duration, feature, icon = 'gift-outline', activeUntil, active = false, disabled = false }: {
  title: string;
  description?: string;
  duration: string;
  feature: RewardedFeature;
  icon?: keyof typeof Ionicons.glyphMap;
  activeUntil?: string;
  active?: boolean;
  disabled?: boolean;
}) {
  const { colors, t, unlockFeature } = useApp();
  const [loading, setLoading] = useState(false);
  const isActive = active || Boolean(activeUntil && new Date(activeUntil).getTime() > Date.now());
  const onWatch = async () => {
    setLoading(true);
    const success = await unlockFeature(feature);
    setLoading(false);
    Alert.alert(success ? t('ads.unlocked') : t('ads.failed'));
  };
  const time = activeUntil ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(activeUntil)) : '';
  return (
    <Card tone="reward" style={styles.card}>
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          <Ionicons name={isActive ? 'checkmark-circle' : icon} size={22} color={isActive ? colors.primary : colors.warning} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        {description ? <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text> : null}
        <Text style={[styles.duration, { color: colors.textMuted }]}>{isActive ? (activeUntil ? t('ads.activeUntil', { time }) : t('common.active')) : duration}</Text>
      </View>
      {isActive ? <Text style={[styles.active, { color: colors.primary }]}>{t('common.active')}</Text> : (
        <Button label={loading ? t('ads.watching') : t('ads.watch')} onPress={onWatch} variant="reward" loading={loading} disabled={disabled} style={styles.button} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 10 },
  copy: { flex: 1 },
  titleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  title: { flex: 1, fontSize: 16, fontWeight: '800' },
  description: { fontSize: 13, lineHeight: 18, marginTop: 5, marginLeft: 30 },
  duration: { fontSize: 12, fontWeight: '700', marginTop: 5, marginLeft: 30 },
  button: { minHeight: 44, marginTop: 0, paddingHorizontal: 14 },
  active: { fontSize: 14, fontWeight: '800', paddingHorizontal: 8 },
});
