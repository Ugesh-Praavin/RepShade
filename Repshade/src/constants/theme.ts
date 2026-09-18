// Repshade Design Tokens & Themes

export const palette = {
  // Dark Theme
  dark: {
    background: {
      primary: '#0B0D0F',
      secondary: '#121519',
      tertiary: '#191D21',
      elevated: '#20252A',
    },
    text: {
      primary: '#F5F7F8',
      secondary: '#A8B0B7',
      tertiary: '#707980',
      disabled: '#4D555B',
    },
    border: {
      subtle: '#242A2F',
      default: '#30373D',
      strong: '#414A52',
    },
    accent: {
      primary: '#B8F34A',
      primaryPressed: '#A4DD3F',
      pressed: '#A4DD3F',
      primarySoft: '#26331A',
      muted: 'rgba(184, 243, 74, 0.15)',
      primaryText: '#0B0D0F',
    },
    status: {
      success: '#6FD08C',
      warning: '#F2C94C',
      error: '#FF6B6B',
      info: '#6EA8FE',
    },
  },

  // Light Theme
  light: {
    background: {
      primary: '#F7F8F6',
      secondary: '#FFFFFF',
      tertiary: '#EEF0ED',
      elevated: '#FFFFFF',
    },
    text: {
      primary: '#16191B',
      secondary: '#5E666C',
      tertiary: '#858D92',
      disabled: '#B0B6BA',
    },
    border: {
      subtle: '#E4E7E5',
      default: '#D5D9D7',
      strong: '#B9BFBC',
    },
    accent: {
      primary: '#88C81E',
      primaryPressed: '#76AF18',
      pressed: '#76AF18',
      primarySoft: '#E8F6D3',
      muted: 'rgba(136, 200, 30, 0.15)',
      primaryText: '#FFFFFF',
    },
    status: {
      success: '#4FA86C',
      warning: '#D4A017',
      error: '#E04F4F',
      info: '#4B88E8',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
  },

  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },

  typography: {
    h1: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34, letterSpacing: -0.5 },
    h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, letterSpacing: -0.3 },
    h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
    bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
    bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    bodySm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
    label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
    caption: { fontSize: 11, fontWeight: '400' as const, lineHeight: 14 },
    statNumber: { fontSize: 32, fontWeight: '800' as const, lineHeight: 38 },
  },
} as const;

export const theme = {
  dark: palette.dark,
  light: palette.light,
  spacing: palette.spacing,
  radius: palette.radius,
  typography: palette.typography,
};

export type AppTheme = typeof palette.dark;
export type SpacingKey = keyof typeof palette.spacing;
export type RadiusKey = keyof typeof palette.radius;
export type TypographyVariant = keyof typeof palette.typography;
