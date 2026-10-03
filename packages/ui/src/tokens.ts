// ============================================================
// CleanCare Design System Tokens
// Source of truth for all visual decisions across all apps.
// ============================================================

export const colors = {
  // Primary — Strong blue from reference design
  primary: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',  // main CTA buttons
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Navy — dark text / headings
  navy: {
    50:  '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',  // body text
    900: '#0f172a',  // headings
  },

  // Soft blue surface — cards / backgrounds
  surface: {
    white:      '#ffffff',
    page:       '#f8fafc',
    card:       '#ffffff',
    inputBg:    '#f1f5f9',
    softBlue:   '#eff6ff',
    hover:      '#f1f5f9',
    selected:   '#dbeafe',
  },

  // Semantic status colors
  success: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    bg:  '#f0fdf4',
    text:'#15803d',
    border:'#bbf7d0',
  },
  warning: {
    50:  '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    bg:  '#fffbeb',
    text:'#b45309',
    border:'#fde68a',
  },
  danger: {
    50:  '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    bg:  '#fef2f2',
    text:'#b91c1c',
    border:'#fecaca',
  },
  info: {
    50:  '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    bg:  '#eff6ff',
    text:'#1d4ed8',
    border:'#bfdbfe',
  },
  neutral: {
    50:  '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    bg:  '#f1f5f9',
    text:'#475569',
    border:'#e2e8f0',
  },

  // Order status chip colors (matches reference screenshots)
  orderStatus: {
    BOOKED:             { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    PICKUP_ASSIGNED:    { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    PICKED_UP:          { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    RECEIVED:           { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    PROCESSING:         { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
    QC:                 { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
    PACKED:             { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    READY_FOR_DELIVERY: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    OUT_FOR_DELIVERY:   { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
    DELIVERED:          { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    COMPLETED:          { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
    CANCELLED:          { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  },
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs:   '0.75rem',    // 12px
    sm:   '0.875rem',   // 14px
    base: '1rem',       // 16px
    lg:   '1.125rem',   // 18px
    xl:   '1.25rem',    // 20px
    '2xl':'1.5rem',     // 24px
    '3xl':'1.875rem',   // 30px
    '4xl':'2.25rem',    // 36px
  },
  fontWeight: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    extrabold:'800',
  },
  lineHeight: {
    tight:  '1.25',
    normal: '1.5',
    relaxed:'1.625',
  },
} as const;

export const spacing = {
  0:    '0',
  0.5:  '0.125rem',
  1:    '0.25rem',
  1.5:  '0.375rem',
  2:    '0.5rem',
  2.5:  '0.625rem',
  3:    '0.75rem',
  3.5:  '0.875rem',
  4:    '1rem',
  5:    '1.25rem',
  6:    '1.5rem',
  7:    '1.75rem',
  8:    '2rem',
  9:    '2.25rem',
  10:   '2.5rem',
  12:   '3rem',
  14:   '3.5rem',
  16:   '4rem',
  20:   '5rem',
  24:   '6rem',
  32:   '8rem',
} as const;

export const borderRadius = {
  none: '0',
  sm:   '0.25rem',
  base: '0.375rem',
  md:   '0.5rem',
  lg:   '0.75rem',
  xl:   '1rem',
  '2xl':'1.5rem',
  '3xl':'2rem',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  xs:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm:   '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md:   '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:   '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:   '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  card: '0 2px 8px 0 rgb(0 0 0 / 0.08)',
  // Subtle blue glow for selected states
  primaryGlow: '0 0 0 3px rgb(59 130 246 / 0.15)',
} as const;

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  base:    0,
  raised:  10,
  dropdown:20,
  sticky:  30,
  overlay: 40,
  modal:   50,
  popover: 60,
  toast:   70,
} as const;

export const transitions = {
  fast:   '150ms ease',
  base:   '200ms ease',
  slow:   '300ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;
