
export const themes = {
  light: {
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    secondary: '#10b981',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    secondary: '#34d399',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  }
};

export type Theme = 'light' | 'dark';
