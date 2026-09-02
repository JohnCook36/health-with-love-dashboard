export const designTokens = {
  color: {
    light: {
      background: '#FFFAF4', backgroundSecondary: '#FFF5EF', surface: '#FFFDFC', surfaceMuted: '#F9F4F0',
      textPrimary: '#2D3033', textSecondary: '#6C7279', textMuted: '#9A928B', textInverse: '#FFFFFF',
      border: '#EDE4DD', borderStrong: '#DDD1C8', primary: '#E96E63', primaryPressed: '#D85C52',
      primaryMuted: '#FBE4DF', success: '#6D9B72', successMuted: '#EAF3E8', warning: '#D79545',
      warningMuted: '#FFF0DA', emergency: '#E34545', emergencyMuted: '#FCE2E2', info: '#8B78C7',
      infoMuted: '#EEE8FA', lavender: '#9B82D0', lavenderMuted: '#EFE9F8', peach: '#F29B73',
      peachMuted: '#FCE9DF', overlay: 'rgba(33, 27, 24, 0.42)', shadow: 'rgba(83, 58, 44, 0.10)',
    },
    dark: {
      background: '#171513', backgroundSecondary: '#211E1B', surface: '#25211E', surfaceMuted: '#2C2723',
      textPrimary: '#F8F3EE', textSecondary: '#C8BFB7', textMuted: '#938A83', textInverse: '#1A1715',
      border: '#3A342F', borderStrong: '#4A423B', primary: '#F07C70', primaryPressed: '#E46B60',
      primaryMuted: '#3B2422', success: '#87B28C', successMuted: '#233229', warning: '#E1AA63',
      warningMuted: '#3A2E1B', emergency: '#F06464', emergencyMuted: '#3A2020', info: '#A792DB',
      infoMuted: '#29233A', lavender: '#A78CDF', lavenderMuted: '#2E263D', peach: '#E89A79',
      peachMuted: '#3A2922', overlay: 'rgba(0, 0, 0, 0.56)', shadow: 'rgba(0, 0, 0, 0.28)',
    },
  },
  spacing: { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40 },
  radius: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24, pill: 999 },
  typography: {
    size: { caption: 12, bodySmall: 14, body: 16, bodyLarge: 18, section: 20, title: 28, display: 32 },
    lineHeight: { caption: 16, bodySmall: 20, body: 24, bodyLarge: 26, section: 28, title: 36, display: 40 },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  icon: { sm: 16, md: 20, lg: 24, xl: 28 },
  control: { minTouchTarget: 48, buttonHeight: 52, largeButtonHeight: 58 },
  animation: { fast: 120, normal: 220, slow: 320, pressScale: 0.97 },
} as const;
