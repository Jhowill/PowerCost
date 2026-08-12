import { Platform } from 'react-native';

type AdUnitKind = 'banner' | 'interstitial' | 'rewarded' | 'native' | 'appOpen';

const ANDROID_AD_UNITS: Record<AdUnitKind, string> = {
  banner: 'ca-app-pub-4042606302261972/9990547373',
  interstitial: 'ca-app-pub-4042606302261972/6705908482',
  rewarded: 'ca-app-pub-4042606302261972/5392826819',
  native: 'ca-app-pub-4042606302261972/2790714205',
  appOpen: 'ca-app-pub-4042606302261972/7364384038',
};

const IOS_AD_UNITS: Record<AdUnitKind, string> = {
  banner: 'ca-app-pub-4042606302261972/5554226882',
  interstitial: 'ca-app-pub-4042606302261972/7681058746',
  rewarded: 'ca-app-pub-4042606302261972/1115650394',
  native: 'ca-app-pub-4042606302261972/1189857921',
  appOpen: 'ca-app-pub-4042606302261972/4079745141',
};

export const PRODUCTION_AD_UNITS = Platform.OS === 'ios' ? IOS_AD_UNITS : ANDROID_AD_UNITS;

export const getAdUnitId = (kind: AdUnitKind, testId: string) => (__DEV__ ? testId : PRODUCTION_AD_UNITS[kind]);
