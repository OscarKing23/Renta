export const DarkColors = {
  // Backgrounds
  background: '#0F0F14',
  surface: '#1A1A24',
  surfaceLight: '#242434',
  card: '#1E1E2E',

  // Primary / Accent
  primary: '#D4A843',
  primaryLight: '#E8C76A',
  primaryDark: '#B8912E',
  primaryGradientStart: '#D4A843',
  primaryGradientEnd: '#B8912E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B6B80',
  textOnPrimary: '#0F0F14',

  // Semantic
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Borders & Dividers
  border: '#2A2A3A',
  divider: '#1F1F30',

  // Overlay
  overlay: 'rgba(15, 15, 20, 0.85)',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export const LightColors: typeof DarkColors = {
  // Backgrounds
  background: '#F5F5F8',
  surface: '#FFFFFF',
  surfaceLight: '#EEEEF4',
  card: '#FFFFFF',

  // Primary / Accent
  primary: '#C49530',
  primaryLight: '#D4A843',
  primaryDark: '#A67D1E',
  primaryGradientStart: '#D4A843',
  primaryGradientEnd: '#C49530',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#5A5A72',
  textMuted: '#9A9AB0',
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Borders & Dividers
  border: '#DDDDE8',
  divider: '#EDEDF5',

  // Overlay
  overlay: 'rgba(245, 245, 248, 0.85)',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export type ThemeColors = typeof DarkColors;

// Keep backward-compat default export
export const Colors = DarkColors;
