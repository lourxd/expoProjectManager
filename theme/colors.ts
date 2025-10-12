export const theme = {
  // Background colors
  background: {
    primary: '#000000',
    secondary: '#0a0a0a',
    tertiary: '#121212',
    elevated: '#1a1a1a',
    card: '#1c1c1c',
  },

  // Border colors
  border: {
    subtle: '#1f1f1f',
    default: '#2a2a2a',
    strong: '#333333',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#a1a1a1',
    tertiary: '#666666',
    muted: '#4a4a4a',
  },

  // Brand colors
  brand: {
    primary: '#0a84ff',
    secondary: '#ffffff',
    accent: '#30d158',
    warning: '#ff9f0a',
    error: '#ff453a',
  },

  // Interactive states
  interactive: {
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(255, 255, 255, 0.1)',
    selected: 'rgba(10, 132, 255, 0.15)',
  },

  // Icon colors
  icon: {
    primary: '#ffffff',
    secondary: '#a1a1a1',
    brand: '#0a84ff',
    success: '#30d158',
  },
};

export type Theme = typeof theme;
