import { Ionicons } from '@expo/vector-icons';
import React, { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useApp } from '../context/AppContext';
import { radius, spacing } from '../theme';

type IconName = keyof typeof Ionicons.glyphMap;

export function Page({ children, contentStyle }: PropsWithChildren<{ contentStyle?: StyleProp<ViewStyle> }>) {
  const { colors } = useApp();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.page, contentStyle]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Header({ title, subtitle, back, onBack }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void }) {
  const { colors, t } = useApp();
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.back')} onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>{t('common.back')}</Text>
        </Pressable>
      ) : null}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style, tone = 'normal' }: PropsWithChildren<{ style?: StyleProp<ViewStyle>; tone?: 'normal' | 'primary' | 'reward' }>) {
  const { colors, resolvedTheme } = useApp();
  const backgroundColor = tone === 'primary' ? colors.primarySoft : tone === 'reward' ? colors.adSurface : colors.surface;
  return (
    <View style={[
      styles.card,
      { backgroundColor, borderColor: colors.border },
      resolvedTheme === 'light' ? styles.lightShadow : null,
      style,
    ]}>{children}</View>
  );
}

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'reward' | 'danger';

export function Button({ label, onPress, icon, variant = 'primary', disabled, loading, style }: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useApp();
  const backgroundColor = variant === 'primary' ? colors.primary : variant === 'reward' ? colors.secondary : variant === 'danger' ? colors.danger : 'transparent';
  const foreground = variant === 'primary' ? colors.textOnPrimary : variant === 'reward' ? '#17231B' : variant === 'danger' ? '#FFFFFF' : variant === 'ghost' ? colors.primary : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading) }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor: variant === 'outline' ? colors.borderStrong : backgroundColor, opacity: disabled ? 0.45 : pressed ? 0.78 : 1 },
        variant === 'ghost' ? styles.ghostButton : null,
        style,
      ]}>
      {loading ? <ActivityIndicator color={foreground} /> : (
        <View style={styles.buttonContent}>
          {icon ? <Ionicons name={icon} color={foreground} size={21} /> : null}
          <Text numberOfLines={2} style={[styles.buttonText, { color: foreground }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Choice({ title, subtitle, icon, selected, onPress, compact }: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  selected?: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        compact ? styles.choiceCompact : null,
        { backgroundColor: selected ? colors.primarySoft : colors.surface, borderColor: selected ? colors.primary : colors.border, opacity: pressed ? 0.75 : 1 },
      ]}>
      {icon ? <View style={[styles.choiceIcon, { backgroundColor: colors.backgroundAlt }]}><Ionicons name={icon} size={22} color={colors.primary} /></View> : null}
      <View style={styles.choiceTextWrap}>
        <Text style={[styles.choiceTitle, { color: colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.choiceSubtitle, { color: colors.textMuted }]}>{subtitle}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={24} color={colors.primary} /> : null}
    </Pressable>
  );
}

export function Field({ label, unit, error, ...props }: TextInputProps & { label: string; unit?: string; error?: string }) {
  const { colors } = useApp();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <View style={[styles.field, { backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.borderStrong }]}>
        <TextInput
          {...props}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
          accessibilityLabel={label}
        />
        {unit ? <Text style={[styles.unit, { color: colors.textMuted }]}>{unit}</Text> : null}
      </View>
      {error ? <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  const { colors } = useApp();
  return <Text style={[styles.sectionLabel, { color: colors.text }]}>{children}</Text>;
}

export function EmptyState({ icon = 'file-tray-outline', title, text, action, onAction }: {
  icon?: IconName; title: string; text: string; action?: string; onAction?: () => void;
}) {
  const { colors } = useApp();
  return (
    <Card style={styles.empty}>
      <Ionicons name={icon} size={42} color={colors.primary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>{text}</Text>
      {action && onAction ? <Button label={action} onPress={onAction} style={styles.emptyAction} /> : null}
    </Card>
  );
}

export function SettingRow({ label, value, onPress, danger }: { label: string; value?: string; onPress?: () => void; danger?: boolean }) {
  const { colors } = useApp();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, { borderBottomColor: colors.border, opacity: pressed ? 0.65 : 1 }]}>
      <Text style={[styles.settingLabel, { color: danger ? colors.danger : colors.text }]}>{label}</Text>
      <View style={styles.settingValueWrap}>
        {value ? <Text numberOfLines={1} style={[styles.settingValue, { color: colors.textMuted }]}>{value}</Text> : null}
        {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
      </View>
    </Pressable>
  );
}

export function OptionModal({ visible, title, options, selected, onSelect, onClose }: {
  visible: boolean;
  title: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const { colors, t } = useApp();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={(event) => event.stopPropagation()}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
          {options.map((option) => (
            <Choice key={option.value} title={option.label} selected={selected === option.value} onPress={() => { onSelect(option.value); onClose(); }} compact />
          ))}
          <Button label={t('common.cancel')} onPress={onClose} variant="ghost" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  page: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 36 },
  content: { width: '100%', maxWidth: 620, alignSelf: 'center', flexGrow: 1 },
  header: { paddingTop: 8, paddingBottom: 18 },
  backButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginLeft: -6 },
  backText: { fontSize: 16, fontWeight: '700' },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '800', letterSpacing: -0.6 },
  subtitle: { fontSize: 16, lineHeight: 23, marginTop: 2 },
  card: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.lg },
  lightShadow: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  button: { minHeight: 58, borderRadius: radius.lg, borderWidth: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 18, marginTop: 10 },
  ghostButton: { minHeight: 50, borderWidth: 0 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  buttonText: { fontSize: 17, lineHeight: 22, fontWeight: '800', textAlign: 'center' },
  choice: { minHeight: 66, borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  choiceCompact: { minHeight: 56 },
  choiceIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  choiceTextWrap: { flex: 1 },
  choiceTitle: { fontSize: 17, fontWeight: '800', lineHeight: 22 },
  choiceSubtitle: { fontSize: 14, lineHeight: 19, marginTop: 1 },
  fieldWrap: { marginBottom: 18 },
  fieldLabel: { fontSize: 17, lineHeight: 23, fontWeight: '800', marginBottom: 7 },
  field: { minHeight: 64, borderWidth: 1.5, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  input: { flex: 1, minWidth: 0, fontSize: 22, fontWeight: '700', minHeight: 58, paddingVertical: 10 },
  unit: { flexShrink: 0, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  error: { fontSize: 14, fontWeight: '600', lineHeight: 20, marginTop: 6 },
  sectionLabel: { fontSize: 17, fontWeight: '800', lineHeight: 24, marginTop: 5, marginBottom: 10 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyTitle: { fontSize: 21, fontWeight: '800', textAlign: 'center', marginTop: 14 },
  emptyText: { fontSize: 16, lineHeight: 23, textAlign: 'center', marginTop: 6 },
  emptyAction: { width: '100%', marginTop: 20 },
  settingRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, gap: 12 },
  settingLabel: { flex: 1, fontSize: 16, fontWeight: '700' },
  settingValueWrap: { maxWidth: '48%', flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { fontSize: 14 },
  modalOverlay: { flex: 1, justifyContent: 'center', padding: 22 },
  modalCard: { width: '100%', maxWidth: 520, alignSelf: 'center', borderRadius: radius.xl, borderWidth: 1, padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', marginBottom: 18 },
});
