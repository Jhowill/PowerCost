import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Platform, Text } from 'react-native';
import { Button, Card, Field, Header, Page } from '../src/components/ui';
import { useApp } from '../src/context/AppContext';
import { PUBLIC_LINKS } from '../src/config/publicLinks';

export default function ReportAdScreen() {
  const { t, colors } = useApp();
  const [description, setDescription] = useState('');
  const [opening, setOpening] = useState(false);
  const open = async () => {
    if (!description.trim()) { Alert.alert(t('ads.reportRequired')); return; }
    setOpening(true);
    const body = description.trim() + '\n\nPlatform: ' + Platform.OS + '\nReport prepared: ' + new Date().toISOString();
    try {
      await Linking.openURL(PUBLIC_LINKS.support + '/new?title=' + encodeURIComponent('PowerCost: inappropriate ad') + '&body=' + encodeURIComponent(body));
    } catch { Alert.alert(t('settings.linkError')); }
    finally { setOpening(false); }
  };
  return <Page>
    <Header title={t('ads.report')} back onBack={() => router.back()} />
    <Card>
      <Text style={{ color: colors.text, lineHeight: 23 }}>{t('ads.reportHint')}</Text>
      <Field label={t('ads.reportDescription')} value={description} onChangeText={setDescription} multiline maxLength={1200} />
      <Text style={{ color: colors.textMuted, lineHeight: 22 }}>{t('ads.reportPublic')}</Text>
      <Button label={t('ads.reportSend')} onPress={open} loading={opening} disabled={opening} />
    </Card>
  </Page>;
}
