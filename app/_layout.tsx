import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useApp } from '../src/context/AppContext';

function Navigation() {
  const { hydrated, colors, resolvedTheme, storageError, retryStorage, t } = useApp();
  if (!hydrated) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  return (
    <>
      {storageError ? <View style={{ padding: 16, paddingTop: 40, backgroundColor: colors.surface }}>
        <Text style={{ color: colors.danger }}>{t('storage.error')}</Text>
        <Pressable onPress={retryStorage} accessibilityRole="button" style={{ paddingVertical: 12 }}><Text style={{ color: colors.primary }}>{t('storage.retry')}</Text></Pressable>
      </View> : null}
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="result" />
        <Stack.Screen name="compare" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="terms" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider><Navigation /></AppProvider>
    </SafeAreaProvider>
  );
}
