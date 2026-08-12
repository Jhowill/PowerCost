import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { getLegalDocument, LEGAL_UPDATED_AT, LegalDocumentType } from '../data/legal';
import { spacing } from '../theme';
import { Card, Header, Page } from './ui';

export function LegalDocumentScreen({ type }: { type: LegalDocumentType }) {
  const { colors, settings, t } = useApp();
  const document = getLegalDocument(type, settings.locale);

  return (
    <Page contentStyle={styles.page}>
      <Header title={document.title} subtitle={document.summary} back onBack={() => router.back()} />
      <Text style={[styles.updated, { color: colors.textMuted }]}>
        {t('legal.updated', { date: LEGAL_UPDATED_AT })}
      </Text>
      {document.sections.map((section) => (
        <Card key={section.title} style={styles.section}>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
          <View style={styles.paragraphs}>
            {section.paragraphs.map((paragraph, index) => (
              <Text key={`${section.title}-${index}`} style={[styles.paragraph, { color: colors.textMuted }]}>{paragraph}</Text>
            ))}
          </View>
        </Card>
      ))}
    </Page>
  );
}

const styles = StyleSheet.create({
  page: { paddingBottom: 52 },
  updated: { fontSize: 13, fontWeight: '700', marginTop: -8, marginBottom: spacing.lg },
  section: { padding: spacing.xl },
  sectionTitle: { fontSize: 19, lineHeight: 25, fontWeight: '800', marginBottom: spacing.md },
  paragraphs: { gap: spacing.md },
  paragraph: { fontSize: 15, lineHeight: 23 },
});
