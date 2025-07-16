import { Theme } from '../types';

export const themes: Record<string, Theme> = {
  classic: {
    name: 'WhatsApp Classic',
    colors: {
      primary: '#25D366',
      accent: '#128C7E',
      gray: '#D2D1D4',
      text: '#1E1E1E',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      border: '#E5E7EB',
    },
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: '#25D366',
      accent: '#128C7E',
      gray: '#374151',
      text: '#F9FAFB',
      background: '#111827',
      surface: '#1F2937',
      border: '#374151',
    },
  },
  highContrast: {
    name: 'High Contrast',
    colors: {
      primary: '#25D366',
      accent: '#128C7E',
      gray: '#808080',
      text: '#000000',
      background: '#FFFFFF',
      surface: '#F0F0F0',
      border: '#000000',
    },
  },
};

export const defaultTheme = themes.classic;