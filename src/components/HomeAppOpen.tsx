import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppState } from 'react-native';
import { useApp } from '../context/AppContext';
import { beginAppOpenBackground, preloadAppOpenAd, showAppOpenAd } from '../services/adsService';

export function HomeAppOpen() {
  const { canShowBanner } = useApp();
  useFocusEffect(useCallback(() => {
    if (!canShowBanner) return;
    preloadAppOpenAd();
    let backgroundAt: number | null = null;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') backgroundAt = beginAppOpenBackground();
      if (state === 'active') {
        const opportunity = backgroundAt; backgroundAt = null;
        if (opportunity !== null) void showAppOpenAd(opportunity);
      }
    });
    return () => subscription.remove();
  }, [canShowBanner]));
  return null;
}
