import { Theme } from '../types';

export const themes: Record<string, Theme> = {
  classic: {
    name: 'Swift Classic',
    colors: {
      primary: '#003CFF',
      accent: '#FA0082',
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
      primary: '#4F72FF',
      accent: '#FF4DA6',
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
      primary: '#0000FF',
      accent: '#FF0080',
      gray: '#808080',
      text: '#000000',
      background: '#FFFFFF',
      surface: '#F0F0F0',
      border: '#000000',
    },
  },
};

export const defaultTheme = themes.classic;