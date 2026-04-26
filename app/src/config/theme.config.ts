export const THEME = {
  colors: {
    backgroundPrimary: '#FFF7ED',
    backgroundSecondary: '#FFEDD5',
    primary: '#EA580C',
    primaryHover: '#C2410C',
    accent: '#F59E0B',
    textPrimary: '#1F2937',
    textSecondary: '#6B4F3A',
    borderSoft: '#FDBA74',
    success: '#16A34A',
    error: '#DC2626',
  },
  fonts: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  shadows: {
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
} as const;
