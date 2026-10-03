import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        navy: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        surface: {
          page:     '#f8fafc',
          card:     '#ffffff',
          inputBg:  '#f1f5f9',
          softBlue: '#eff6ff',
          hover:    '#f1f5f9',
          selected: '#dbeafe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 2px 8px 0 rgb(0 0 0 / 0.08)',
        'card-lg':    '0 4px 16px 0 rgb(0 0 0 / 0.10)',
        'primary-glow':'0 0 0 3px rgb(59 130 246 / 0.15)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};

export default config;
