import { ResolvedTheme } from './types';

export const palettes = {
  light: {
    background: '#F5FAF4',
    backgroundAlt: '#ECF6EF',
    surface: '#FFFFFF',
    surfaceSoft: '#F8FCF8',
    primary: '#168A4A',
    primaryPressed: '#0F6B39',
    primarySoft: '#DFF5E8',
    secondary: '#F5B82E',
    secondarySoft: '#FFF4D2',
    text: '#17231B',
    textMuted: '#66736A',
    textOnPrimary: '#FFFFFF',
    border: '#DDE8DF',
    borderStrong: '#B8CDBE',
    success: '#168A4A',
    warning: '#D97706',
    danger: '#C2410C',
    adSurface: '#FFF8E5',
    overlay: 'rgba(23,35,27,0.45)',
  },
  dark: {
    background: '#07130D',
    backgroundAlt: '#0B1A12',
    surface: '#102018',
    surfaceSoft: '#14291E',
    primary: '#35C978',
    primaryPressed: '#1A9B55',
    primarySoft: '#123B25',
    secondary: '#FACC15',
    secondarySoft: '#3A2D08',
    text: '#F3FFF6',
    textMuted: '#A8B8AD',
    textOnPrimary: '#06100A',
    border: '#254333',
    borderStrong: '#3F6B50',
    success: '#35C978',
    warning: '#F59E0B',
    danger: '#FB923C',
    adSurface: '#2C250E',
    overlay: 'rgba(0,0,0,0.60)',
  },
} as const;

export type ThemeColors = (typeof palettes)[ResolvedTheme];

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 } as const;
