import { Platform, TextStyle } from 'react-native';

/**
 * DEMİR ÇELİK SAHA PLATFORMU — TASARIM SİSTEMİ
 * ------------------------------------------------
 * Palet, sahadaki gerçek malzeme dilinden türetildi:
 * grafit sac plaka grisi, ergimiş metal turuncusu,
 * soğuk çelik mavisi ve güvenlik şeridi sarısı.
 */

export const colors = {
  bg: '#14171A',            // Grafit zemin
  surface: '#1C2126',       // Kart zemini
  surfaceRaised: '#232931', // Yükseltilmiş panel
  surfaceInput: '#1A1F24',  // Input zemini
  border: '#323A42',
  borderLight: '#3D4650',
  borderFocus: '#FF7A29',

  textPrimary: '#ECEFF1',
  textSecondary: '#8A9399',
  textMuted: '#5C666D',

  amber: '#FF7A29',         // Ergimiş metal — birincil aksiyon
  amberDeep: '#E35F0A',
  spark: '#FFC93C',         // Uyarı / vurgu
  steelBlue: '#5B8FA8',     // Soğuk çelik — ikincil / bilgi
  safetyGreen: '#4C9A6A',   // Onay / temiz bakiye
  dangerRed: '#E1483F',     // Risk / gecikmiş bakiye
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const radii = { sm: 6, md: 10, lg: 16, pill: 999 };

const monoFont = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });

export const typography = {
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.amber,
  } as TextStyle,
  display: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.textPrimary,
  } as TextStyle,
  h2: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.textPrimary,
  } as TextStyle,
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  } as TextStyle,
  body: {
    fontSize: 14,
    color: colors.textPrimary,
  } as TextStyle,
  bodyMuted: {
    fontSize: 13,
    color: colors.textSecondary,
  } as TextStyle,
  mono: {
    fontFamily: monoFont,
    color: colors.textPrimary,
  } as TextStyle,
};

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.35,
  shadowRadius: 8,
  elevation: 4,
};