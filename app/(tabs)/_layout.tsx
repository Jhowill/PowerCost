import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useApp } from '../../src/context/AppContext';

export default function TabLayout() {
  const { colors, t } = useApp();
  const icons = {
    index: ['home', 'home-outline'],
    calculate: ['add', 'add-outline'],
    history: ['time', 'time-outline'],
    extras: ['gift', 'gift-outline'],
    settings: ['settings', 'settings-outline'],
  } as const;
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 72, paddingTop: 8, paddingBottom: 9 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      tabBarIcon: ({ color, focused }) => {
        const pair = icons[route.name as keyof typeof icons] ?? icons.index;
        return <Ionicons name={focused ? pair[0] : pair[1]} size={22} color={color} />;
      },
    })}>
      <Tabs.Screen name="index" options={{ title: t('nav.home') }} />
      <Tabs.Screen name="calculate" options={{ title: t('nav.calculate') }} />
      <Tabs.Screen name="history" options={{ title: t('nav.history') }} />
      <Tabs.Screen name="extras" options={{ title: t('nav.extras') }} />
      <Tabs.Screen name="settings" options={{ title: t('nav.settings') }} />
    </Tabs>
  );
}
